
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import Client
from datetime import date, datetime, time
from uuid import UUID, uuid4
import json

from dependencies import get_supabase, get_current_user

router = APIRouter()

class EventBase(BaseModel):
    title: str
    client: str
    location: str
    date: date
    startTime: str  # Using string as per your existing frontend model
    endTime: str    # Using string as per your existing frontend model
    type: str       # This should be one of: "showing", "meeting", "open-house", "call"

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    title: Optional[str] = None
    client: Optional[str] = None
    location: Optional[str] = None
    date: Optional[date] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    type: Optional[str] = None

class EventResponse(EventBase):
    id: UUID
    agent_id: UUID
    created_at: datetime

@router.get("/", response_model=List[Dict[str, Any]])
async def get_events(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    event_type: Optional[str] = Query(None),
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get calendar events for the current agent"""
    try:
        # This would be a real implementation if you had an events table
        # For now, we'll return mock data similar to what's in your frontend
        events = [
            {
                "id": 1,
                "title": "Property Showing",
                "client": "Emma Thompson",
                "location": "123 Main St",
                "date": "2025-05-22",
                "startTime": "10:00 AM",
                "endTime": "11:00 AM",
                "type": "showing"
            },
            {
                "id": 2,
                "title": "Client Meeting",
                "client": "Michael Chen",
                "location": "Office",
                "date": "2025-05-22",
                "startTime": "2:00 PM",
                "endTime": "3:00 PM",
                "type": "meeting"
            },
            {
                "id": 3,
                "title": "Open House",
                "client": "Public",
                "location": "456 Oak Ave",
                "date": "2025-05-23",
                "startTime": "1:00 PM",
                "endTime": "4:00 PM",
                "type": "open-house"
            },
            {
                "id": 4,
                "title": "Follow-up Call",
                "client": "Sarah Johnson",
                "location": "Phone",
                "date": "2025-05-24",
                "startTime": "11:00 AM",
                "endTime": "11:30 AM",
                "type": "call"
            }
        ]
        
        # Filter by date range if provided
        if start_date:
            events = [e for e in events if date.fromisoformat(e["date"]) >= start_date]
        if end_date:
            events = [e for e in events if date.fromisoformat(e["date"]) <= end_date]
        
        # Filter by event type if provided
        if event_type:
            events = [e for e in events if e["type"] == event_type]
            
        return events
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve events: {str(e)}"
        )

@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate,
    user: dict = Depends(get_current_user)
):
    """Create a new calendar event"""
    # This is a mock implementation since we don't have an events table yet
    # In a real implementation, you would create the event in your database
    try:
        new_event = {
            "id": uuid4(),
            "title": event.title,
            "client": event.client,
            "location": event.location,
            "date": event.date.isoformat(),
            "startTime": event.startTime,
            "endTime": event.endTime,
            "type": event.type,
            "agent_id": user.get("id"),
            "created_at": datetime.now().isoformat()
        }
        
        return new_event
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )
