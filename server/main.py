
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
from supabase import create_client, Client

from routers import auth, clients, calendar

app = FastAPI(
    title="Real Estate CRM API",
    description="API for Real Estate CRM supporting web and mobile clients",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import Supabase configuration from environment variables
SUPABASE_URL = "https://vkakkcpxfqwtmjwhqdhu.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWtrY3B4ZnF3dG1qd2hxZGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODQ5ODEsImV4cCI6MjA2MzI2MDk4MX0.XgAwkvnJqBzR9NpwTrQ309PdexINjnPB3sV9_acMUJs"

# Function to get Supabase client
def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clients"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Real Estate CRM API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
