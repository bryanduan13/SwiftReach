
from fastapi import Depends, Header, HTTPException, status
from supabase import create_client, Client
import jwt
from typing import Optional, Dict, Any

# Import Supabase configuration from environment variables
SUPABASE_URL = "https://vkakkcpxfqwtmjwhqdhu.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWtrY3B4ZnF3dG1qd2hxZGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODQ5ODEsImV4cCI6MjA2MzI2MDk4MX0.XgAwkvnJqBzR9NpwTrQ309PdexINjnPB3sV9_acMUJs"

def get_supabase() -> Client:
    """Get a Supabase client instance"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_current_user(
    authorization: str = Header(None), 
    supabase: Client = Depends(get_supabase)
) -> Dict[str, Any]:
    """
    Dependency to get the current authenticated user based on JWT token
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        # Extract the token from the Authorization header
        token = authorization.replace("Bearer ", "")
        
        # Validate the token with Supabase
        user = supabase.auth.get_user(token)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
