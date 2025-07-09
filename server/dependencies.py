from fastapi import Depends, Header, HTTPException, status
from supabase import create_client, Client
import jwt
from typing import Optional, Dict, Any
from fastapi import Header, Depends, HTTPException, status

# Import Supabase configuration from environment variables
SUPABASE_URL = "https://vkakkcpxfqwtmjwhqdhu.supabase.co"
# Replace line 9 with your service role key
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWtrY3B4ZnF3dG1qd2hxZGh1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY4NDk4MSwiZXhwIjoyMDYzMjYwOTgxfQ.x3U9CbIZHU4SjEvsH5CwDBv6br2x32ftXD3ZY-LGUsk"

def get_supabase() -> Client:
    """Get a Supabase client instance"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_current_user(
    authorization: str = Header(None), 
    supabase: Client = Depends(get_supabase)
) -> Any:
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
        response = supabase.auth.get_user(token)
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
