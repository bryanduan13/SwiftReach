
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from supabase import Client
from datetime import date, datetime, time
from uuid import UUID, uuid4
import json

from dependencies import get_supabase, get_current_user

router = APIRouter()

class CalendarCreate(BaseModel):
    name: Optional[str] = "My Calendar"

class CalendarResponse(BaseModel):
    id: UUID
    profile_id: UUID
    name: str
    created_at: datetime
    updated_at: datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: Optional[datetime] = None
    all_day: Optional[bool] = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    all_day: Optional[bool] = None

class EventResponse(EventBase):
    id: UUID
    calendar_id: UUID
    created_at: datetime
    updated_at: datetime

# Calendar endpoints
@router.post("/calendar", response_model=CalendarResponse, status_code=status.HTTP_201_CREATED)
async def create_calendar(
    calendar: CalendarCreate,
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new calendar for the current user"""
    try:
        result = supabase.table("calendars").insert({
            "profile_id": str(user.id),
            "name": calendar.name
        }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create calendar"
            )
            
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create calendar: {str(e)}"
        )

@router.get("/calendar", response_model=CalendarResponse)
async def get_user_calendar(
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get the calendar for the current user"""
    try:
        result = supabase.table("calendars").select("*").eq("profile_id", str(user.id)).execute()
        
        if not result.data:
            # Create a default calendar if none exists
            create_result = supabase.table("calendars").insert({
                "profile_id": str(user.id),
                "name": "My Calendar"
            }).execute()
            return create_result.data[0]
            
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve calendar: {str(e)}"
        )

# Event endpoints - backward compatible route
@router.get("/", response_model=List[EventResponse])
async def get_events_legacy(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get calendar events for the current user (legacy endpoint)"""
    return await get_events(start_date, end_date, user, supabase)

@router.get("/events", response_model=List[EventResponse])
async def get_events(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get calendar events for the current user"""
    try:
        # First get the user's calendar
        calendar_result = supabase.table("calendars").select("id").eq("profile_id", str(user.id)).execute()
        
        if not calendar_result.data:
            return []
            
        calendar_id = calendar_result.data[0]["id"]
        
        # Build query for events
        query = supabase.table("calendar_events").select("*").eq("calendar_id", calendar_id)
        
        # Add date filters if provided
        if start_date:
            query = query.gte("start_datetime", start_date.isoformat())
        if end_date:
            query = query.lte("start_datetime", end_date.isoformat())
            
        result = query.order("start_datetime").execute()
        
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve events: {str(e)}"
        )

@router.post("/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate,
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new calendar event"""
    try:
        # First get the user's calendar
        calendar_result = supabase.table("calendars").select("id").eq("profile_id", str(user.id)).execute()
        
        if not calendar_result.data:
            # Create a default calendar if none exists
            create_calendar_result = supabase.table("calendars").insert({
                "profile_id": str(user.id),
                "name": "My Calendar"
            }).execute()
            calendar_id = create_calendar_result.data[0]["id"]
        else:
            calendar_id = calendar_result.data[0]["id"]
        
        # Create the event
        result = supabase.table("calendar_events").insert({
            "calendar_id": calendar_id,
            "title": event.title,
            "description": event.description,
            "start_datetime": event.start_datetime.isoformat(),
            "end_datetime": event.end_datetime.isoformat() if event.end_datetime else None,
            "all_day": event.all_day
        }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create event"
            )
            
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

@router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: UUID,
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific event by ID"""
    try:
        # First get the user's calendar to ensure they own this event
        calendar_result = supabase.table("calendars").select("id").eq("profile_id", str(user.id)).execute()
        
        if not calendar_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calendar not found"
            )
            
        calendar_id = calendar_result.data[0]["id"]
        
        # Get the event
        result = supabase.table("calendar_events").select("*").eq("id", str(event_id)).eq("calendar_id", calendar_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
            
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve event: {str(e)}"
        )

@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: UUID,
    event_update: EventUpdate,
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update an existing event"""
    try:
        # First get the user's calendar to ensure they own this event
        calendar_result = supabase.table("calendars").select("id").eq("profile_id", str(user.id)).execute()
        
        if not calendar_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calendar not found"
            )
            
        calendar_id = calendar_result.data[0]["id"]
        
        # Build update data
        update_data = {}
        if event_update.title is not None:
            update_data["title"] = event_update.title
        if event_update.description is not None:
            update_data["description"] = event_update.description
        if event_update.start_datetime is not None:
            update_data["start_datetime"] = event_update.start_datetime.isoformat()
        if event_update.end_datetime is not None:
            update_data["end_datetime"] = event_update.end_datetime.isoformat()
        if event_update.all_day is not None:
            update_data["all_day"] = event_update.all_day
            
        update_data["updated_at"] = datetime.now().isoformat()
        
        # Update the event
        result = supabase.table("calendar_events").update(update_data).eq("id", str(event_id)).eq("calendar_id", calendar_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
            
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}"
        )

@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: UUID,
    user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete an event"""
    try:
        # First get the user's calendar to ensure they own this event
        calendar_result = supabase.table("calendars").select("id").eq("profile_id", str(user.id)).execute()
        
        if not calendar_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calendar not found"
            )
            
        calendar_id = calendar_result.data[0]["id"]
        
        # Delete the event
        result = supabase.table("calendar_events").delete().eq("id", str(event_id)).eq("calendar_id", calendar_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
            
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete event: {str(e)}"
        )
