
from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
from supabase import Client
import jwt
from datetime import datetime, timedelta

from dependencies import get_supabase, get_current_user

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

@router.post("/login", response_model=Dict[str, Any])
async def login(user_data: UserLogin, supabase: Client = Depends(get_supabase)):
    """Login with email and password"""
    try:
        response = supabase.auth.sign_in_with_password({"email": user_data.email, "password": user_data.password})
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/signup", response_model=Dict[str, Any])
async def signup(user_data: UserSignup, supabase: Client = Depends(get_supabase)):
    """Create a new user account"""
    try:
        user_metadata = {}
        if user_data.full_name:
            user_metadata["full_name"] = user_data.full_name
            
        response = supabase.auth.sign_up({
            "email": user_data.email, 
            "password": user_data.password,
            "options": {
                "data": user_metadata
            }
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}",
        )

@router.post("/logout")
async def logout(supabase: Client = Depends(get_supabase), user: dict = Depends(get_current_user)):
    """Logout current user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}",
        )

@router.get("/me", response_model=Dict[str, Any])
async def get_user_profile(user: dict = Depends(get_current_user), supabase: Client = Depends(get_supabase)):
    """Get current user profile"""
    try:
        user_id = user.get("id")
        response = supabase.table("profiles").select("*").eq("id", user_id).single()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user profile: {str(e)}",
        )

@router.post("/refresh", response_model=Dict[str, Any])
async def refresh_token(refresh_token: str, supabase: Client = Depends(get_supabase)):
    """Refresh authentication token"""
    try:
        response = supabase.auth.refresh_session(refresh_token)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token refresh failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
