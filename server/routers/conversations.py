from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import Client
from datetime import datetime
from uuid import UUID
from enum import Enum
import openai
import os
import asyncio
from dependencies import get_supabase, get_current_user

router = APIRouter()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class MessageType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    CALL = "call"
    NOTE = "note"
    WHATSAPP = "whatsapp"

class MessageDirection(str, Enum):
    INBOUND = "inbound"
    OUTBOUND = "outbound"

class MessageStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"
    DRAFT = "draft"

class ConversationCreate(BaseModel):
    client_id: Optional[UUID] = None
    subject: Optional[str] = None
    message_type: MessageType
    direction: MessageDirection
    content: str
    html_content: Optional[str] = None
    status: MessageStatus = MessageStatus.ACTIVE
    thread_id: Optional[UUID] = None
    reply_to_id: Optional[UUID] = None
    external_message_id: Optional[str] = None
    attachments: Optional[List[Dict[str, Any]]] = []
    metadata: Optional[Dict[str, Any]] = {}

class ConversationUpdate(BaseModel):
    subject: Optional[str] = None
    content: Optional[str] = None
    html_content: Optional[str] = None
    status: Optional[MessageStatus] = None
    attachments: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None

class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    client_id: Optional[UUID]
    subject: Optional[str]
    message_type: MessageType
    direction: MessageDirection
    content: str
    html_content: Optional[str]
    status: MessageStatus
    thread_id: Optional[UUID]
    reply_to_id: Optional[UUID]
    external_message_id: Optional[str]
    attachments: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    embedding_generated: bool
    created_at: datetime
    updated_at: datetime

class EmbeddingCreate(BaseModel):
    conversation_id: UUID
    content_text: str
    embedding_model: str = "text-embedding-ada-002"
    chunk_index: int = 0
    metadata: Optional[Dict[str, Any]] = {}

class EmbeddingResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    content_text: str
    embedding_model: str
    chunk_index: int
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class SimilaritySearchRequest(BaseModel):
    query: str
    match_threshold: float = 0.7
    match_count: int = 10
    filter_client_id: Optional[UUID] = None

class SimilaritySearchResult(BaseModel):
    conversation_id: UUID
    content_text: str
    similarity: float
    conversation_subject: Optional[str]
    conversation_created_at: datetime
    client_id: Optional[UUID]

# Conversation CRUD endpoints
@router.post("/conversations/", response_model=ConversationResponse)
async def create_conversation(
    conversation: ConversationCreate,
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    try:
        print(f"Creating conversation for user: {current_user.id}")
        
        # Convert conversation to dict and handle UUID serialization
        conversation_data = conversation.dict()
        print(f"Conversation data: {conversation_data}")
        
        # Convert UUID fields to strings
        conversation_data['client_id'] = str(conversation_data['client_id'])
        if conversation_data.get('thread_id'):
            conversation_data['thread_id'] = str(conversation_data['thread_id'])
        if conversation_data.get('reply_to_id'):
            conversation_data['reply_to_id'] = str(conversation_data['reply_to_id'])
        
        # Add user_id and embedding fields
        conversation_data['user_id'] = str(current_user.id)
        conversation_data['embedding_generated'] = False
        
        print(f"Final conversation data to insert: {conversation_data}")
        
        # Verify client exists in clients table
        client_check = supabase.table("clients").select("id").eq("id", conversation_data['client_id']).execute()
        if not client_check.data:
            raise HTTPException(status_code=400, detail=f"Client with ID {conversation_data['client_id']} not found")
        
        print(f"Client verified: {client_check.data[0]['id']}")
        
        result = supabase.table("conversations").insert(conversation_data).execute()
        print(f"Insert result: {result}")
        
        if result.data:
            conversation_id = result.data[0]['id']
            print(f"Created conversation with ID: {conversation_id}")
            
            # Re-enable embedding generation
            asyncio.create_task(generate_embedding_for_conversation(conversation_id, supabase))
            print(f"Started embedding generation task for conversation {conversation_id}")
            
            return ConversationResponse(**result.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to create conversation")
            
    except Exception as e:
        print(f"Error creating conversation: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/", response_model=List[ConversationResponse])
async def get_conversations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    client_id: Optional[UUID] = Query(None),
    message_type: Optional[MessageType] = Query(None),
    status: Optional[MessageStatus] = Query(None),
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get conversations with optional filtering"""
    try:
        query = supabase.table("conversations").select("*").eq("user_id", current_user.id)
        
        if client_id:
            query = query.eq("client_id", str(client_id))
        if message_type:
            query = query.eq("message_type", message_type.value)
        if status:
            query = query.eq("status", status.value)
        
        result = query.order("created_at", desc=True).range(skip, skip + limit - 1).execute()
        
        return [ConversationResponse(**conv) for conv in result.data]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: UUID = Path(...),
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific conversation"""
    try:
        result = supabase.table("conversations").select("*").eq("id", str(conversation_id)).eq("user_id", current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return ConversationResponse(**result.data[0])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/conversations/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: UUID = Path(...),
    conversation_update: ConversationUpdate = ...,
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update a conversation"""
    try:
        # Check if conversation exists and belongs to user
        existing = supabase.table("conversations").select("*").eq("id", str(conversation_id)).eq("user_id", current_user.id).execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        update_data = {k: v for k, v in conversation_update.dict().items() if v is not None}
        
        result = supabase.table("conversations").update(update_data).eq("id", str(conversation_id)).execute()
        
        return ConversationResponse(**result.data[0])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: UUID = Path(...),
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete a conversation (soft delete by setting status to deleted)"""
    try:
        result = supabase.table("conversations").update({"status": "deleted"}).eq("id", str(conversation_id)).eq("user_id", current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vector embedding endpoints
@router.post("/conversations/{conversation_id}/generate-embedding")
async def generate_embedding(
    conversation_id: UUID = Path(...),
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Generate embedding for a specific conversation"""
    try:
        await generate_embedding_for_conversation(conversation_id, supabase, current_user.id)
        return {"message": "Embedding generated successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations/search", response_model=List[SimilaritySearchResult])
async def semantic_search(
    search_request: SimilaritySearchRequest,
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Perform semantic search on conversations"""
    try:
        # Generate embedding for the search query
        response = openai.embeddings.create(
            input=search_request.query,
            model="text-embedding-ada-002"
        )
        query_embedding = response.data[0].embedding
        
        # Perform similarity search using the RPC function
        result = supabase.rpc(
            "similarity_search",
            {
                "query_embedding": query_embedding,
                "match_threshold": search_request.match_threshold,
                "match_count": search_request.match_count,
                "filter_user_id": current_user.id
            }
        ).execute()
        
        return [SimilaritySearchResult(**item) for item in result.data]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations/batch-generate-embeddings")
async def batch_generate_embeddings(
    current_user: Any = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Generate embeddings for all conversations without embeddings"""
    try:
        # Get conversations without embeddings
        result = supabase.table("conversations").select("id, content").eq("user_id", current_user.id).eq("embedding_generated", False).execute()
        
        generated_count = 0
        for conversation in result.data:
            try:
                await generate_embedding_for_conversation(conversation["id"], supabase)
                generated_count += 1
            except Exception as e:
                print(f"Failed to generate embedding for conversation {conversation['id']}: {e}")
        
        return {"message": f"Generated embeddings for {generated_count} conversations"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper function
async def generate_embedding_for_conversation(
    conversation_id: UUID, 
    supabase: Client, 
    user_id: Optional[str] = None
):
    """Generate and store embedding for a conversation"""
    try:
        # Get conversation content
        query = supabase.table("conversations").select("content, subject").eq("id", str(conversation_id))
        if user_id:
            query = query.eq("user_id", user_id)
        
        result = query.execute()
        
        if not result.data:
            raise Exception("Conversation not found")
        
        conversation = result.data[0]
        
        # Combine subject and content for embedding
        content_text = f"{conversation.get('subject', '')} {conversation['content']}".strip()
        
        # Generate embedding using OpenAI
        response = openai.embeddings.create(
            input=content_text,
            model="text-embedding-ada-002"
        )
        
        embedding = response.data[0].embedding
        
        # Store embedding
        embedding_data = {
            "conversation_id": str(conversation_id),
            "content_text": content_text,
            "embedding": embedding,
            "embedding_model": "text-embedding-ada-002",
            "chunk_index": 0
        }
        
        # Insert or update embedding
        supabase.table("conversation_embeddings").upsert(embedding_data).execute()
        
        # Mark conversation as having embedding generated
        supabase.table("conversations").update({
            "embedding_generated": True
        }).eq("id", str(conversation_id)).execute()
        
    except Exception as e:
        raise Exception(f"Failed to generate embedding: {str(e)}")