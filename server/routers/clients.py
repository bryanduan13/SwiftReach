
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import Client
from datetime import datetime
from uuid import UUID

from dependencies import get_supabase, get_current_user

router = APIRouter()

class ClientBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = "active"

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class ClientResponse(ClientBase):
    id: UUID
    agent_id: UUID
    created_at: str
    updated_at: str
    avatar_url: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    full_name: Optional[str] = None

class ClientResponse(ClientBase):
    id: UUID
    created_at: str
    updated_at: str
    agent_id: UUID
    created_at: datetime
    updated_at: datetime

@router.get("/", response_model=List[Dict[str, Any]])
async def get_clients(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(100, gt=0, le=500),
    offset: int = Query(0, ge=0),
    user: dict = Depends(get_current_user), 
    supabase: Client = Depends(get_supabase)
):
    """Get all clients for the current agent"""
    try:
        query = supabase.table("clients").select("*").eq("agent_id", user.id).order("created_at", desc=True)
        
        if status_filter:
            query = query.eq("status", status_filter)
            
        query = query.range(offset, offset + limit - 1)
        response = query.execute()
        
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to retrieve clients: {str(e)}"
        )

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_client(
    client: ClientCreate,
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new client"""
    try:
        client_data = client.dict()
        client_data["agent_id"] = user.id  # Changed from user.get("id") to user.id
        client_data["created_at"] = datetime.now().isoformat()
        client_data["updated_at"] = datetime.now().isoformat()
        
        # Remove None values
        client_data = {k: v for k, v in client_data.items() if v is not None}
        
        print(f"Creating client with data: {client_data}")  # Debug log
        
        response = supabase.table("clients").insert(client_data).execute()
        
        if len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Client creation failed - no data returned"
            )
    except Exception as e:
        print(f"Error creating client: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create client: {str(e)}"
        )

@router.get("/{client_id}", response_model=Dict[str, Any])
async def get_client(
    client_id: UUID = Path(...),
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific client by ID"""
    try:
        response = supabase.table("clients").select("*").eq("id", str(client_id)).eq("agent_id", user.get("id")).single()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )
            
        return response.data
    except Exception as e:
        if "not_found" in str(e).lower() or "no rows" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve client: {str(e)}"
        )

@router.put("/{client_id}", response_model=Dict[str, Any])
async def update_client(
    client: ClientUpdate,
    client_id: UUID = Path(...),
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update a client by ID"""
    try:
        # First, verify client exists and belongs to the current agent
        check_response = supabase.table("clients").select("id").eq("id", str(client_id)).eq("agent_id", user.get("id")).single()
        
        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found or you don't have permission to update this client"
            )
        
        # Filter out None values
        update_data = {k: v for k, v in client.dict().items() if v is not None}
        update_data["updated_at"] = datetime.now().isoformat()
        
        response = supabase.table("clients").update(update_data).eq("id", str(client_id)).execute()
        
        if len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )
    except Exception as e:
        if "not_found" in str(e).lower() or "no rows" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update client: {str(e)}"
        )

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: UUID = Path(...),
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete a client by ID"""
    try:
        # Use service role or bypass RLS for this operation
        response = supabase.table("clients").delete().eq("id", str(client_id)).eq("agent_id", user.id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found or you don't have permission to delete this client"
            )
            
        return None
    except Exception as e:
        print(f"Delete error: {str(e)}")  # Add logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete client: {str(e)}"
        )
