from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import os
from dotenv import load_dotenv
from supabase import Client
from dependencies import get_supabase, get_current_user

# Load environment variables
load_dotenv()

router = APIRouter()

# Get API key from environment
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

class PropertySearchRequest(BaseModel):
    address: str
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

class PropertyResponse(BaseModel):
    address: str
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    property_type: Optional[str] = None
    zestimate: Optional[float] = None
    rent_estimate: Optional[float] = None
    neighborhood: Optional[str] = None
    market_trends: Optional[Dict[str, Any]] = None

# APISCRAPY Free API Integration
@router.get("/property-info/{address}", response_model=Dict[str, Any])
async def get_property_info(
    address: str,
    user: dict = Depends(get_current_user)
):
    """Get property information using APISCRAPY free API"""
    try:
        async with httpx.AsyncClient() as client:
            # APISCRAPY API endpoint (free tier)
            response = await client.get(
                "https://api.apiscrapy.com/v1/property",
                params={
                    "address": address,
                    "format": "json"
                },
                headers={
                    "User-Agent": "SwiftReach-CRM/1.0"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Property API error: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Property API request timed out"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch property data: {str(e)}"
        )

# Test endpoint without authentication
@router.get("/test-zillow/{address}", response_model=Dict[str, Any])
async def test_zillow_data(address: str):
    """Test endpoint for Zillow data without authentication"""
    if not RAPIDAPI_KEY:
        raise HTTPException(
            status_code=500,
            detail="RapidAPI key not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch",
                params={
                    "location": address
                },
                headers={
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Zillow API error: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail="Request timeout - Zillow API took too long to respond"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching Zillow data: {str(e)}"
        )

# Public bot endpoints for AI chatbot (no authentication required)
@router.get("/bot/property-info/{address}", response_model=Dict[str, Any])
async def bot_get_property_info(address: str):
    """Public endpoint for AI bot to get property information"""
    if not RAPIDAPI_KEY:
        raise HTTPException(
            status_code=500,
            detail="RapidAPI key not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch",
                params={
                    "location": address,
                    "status_type": "ForSale"
                },
                headers={
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    # Ensure data is a dictionary
                    if not isinstance(data, dict):
                        return {
                            "address": address,
                            "error": "No property data found for this address"
                        }
                    
                    # Check if we got a zpid (Zillow Property ID)
                    if 'zpid' in data and data['zpid']:
                        # Make a second request to get property details using zpid
                        zpid = data['zpid']
                        detail_response = await client.get(
                            "https://zillow-com1.p.rapidapi.com/property",
                            params={"zpid": zpid},
                            headers={
                                "X-RapidAPI-Key": RAPIDAPI_KEY,
                                "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
                            },
                            timeout=30.0
                        )
                        
                        if detail_response.status_code == 200:
                            detail_data = detail_response.json()
                            if isinstance(detail_data, dict):
                                return {
                                    "address": address,
                                    "zpid": zpid,
                                    "price": detail_data.get('price'),
                                    "bedrooms": detail_data.get('bedrooms'),
                                    "bathrooms": detail_data.get('bathrooms'),
                                    "square_feet": detail_data.get('livingArea'),
                                    "lot_size": detail_data.get('lotAreaValue'),
                                    "year_built": detail_data.get('yearBuilt'),
                                    "property_type": detail_data.get('homeType'),
                                    "zestimate": detail_data.get('zestimate'),
                                    "neighborhood": detail_data.get('address', {}).get('neighborhood') if isinstance(detail_data.get('address'), dict) else None,
                                    "status": detail_data.get('homeStatus'),
                                    "listing_url": detail_data.get('detailUrl'),
                                    "description": detail_data.get('description')
                                }
                    
                    # Format the response for the AI bot (original logic for props)
                    if 'props' in data and isinstance(data['props'], list) and len(data['props']) > 0:
                        prop = data['props'][0]
                        if isinstance(prop, dict):
                            return {
                                "address": address,
                                "price": prop.get('price'),
                                "bedrooms": prop.get('bedrooms'),
                                "bathrooms": prop.get('bathrooms'),
                                "square_feet": prop.get('livingArea'),
                                "lot_size": prop.get('lotAreaValue'),
                                "year_built": prop.get('yearBuilt'),
                                "property_type": prop.get('homeType'),
                                "zestimate": prop.get('zestimate'),
                                "neighborhood": prop.get('address', {}).get('neighborhood') if isinstance(prop.get('address'), dict) else None,
                                "status": prop.get('homeStatus'),
                                "listing_url": prop.get('detailUrl')
                            }
                    
                    return {
                        "address": address,
                        "error": "No property data found for this address"
                    }
                except (ValueError, TypeError) as e:
                    return {
                        "address": address,
                        "error": "No property data found for this address"
                    }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Zillow API error: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail="Request timeout - Zillow API took too long to respond"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching property data: {str(e)}"
        )

@router.get("/bot/zillow/{address}", response_model=Dict[str, Any])
async def bot_get_zillow_data(address: str):
    """Public endpoint for AI bot to get Zillow data"""
    return await bot_get_property_info(address)

@router.get("/bot/search/{address}", response_model=Dict[str, Any])
async def bot_search_properties(address: str):
    """Public endpoint for AI bot to search for multiple properties"""
    if not RAPIDAPI_KEY:
        raise HTTPException(
            status_code=500,
            detail="RapidAPI key not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch",
                params={
                    "location": address,
                    "status_type": "ForSale"
                },
                headers={
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    
                    # Return multiple results if available
                    if 'props' in data and isinstance(data['props'], list) and len(data['props']) > 0:
                        results = []
                        for prop in data['props'][:10]:  # Limit to 10 results
                            if isinstance(prop, dict):
                                results.append({
                                    "address": prop.get('address', {}).get('streetAddress', '') + ', ' + 
                                              prop.get('address', {}).get('city', '') + ', ' + 
                                              prop.get('address', {}).get('state', '') if isinstance(prop.get('address'), dict) else address,
                                    "price": prop.get('price'),
                                    "bedrooms": prop.get('bedrooms'),
                                    "bathrooms": prop.get('bathrooms'),
                                    "square_feet": prop.get('livingArea'),
                                    "lot_size": prop.get('lotAreaValue'),
                                    "year_built": prop.get('yearBuilt'),
                                    "property_type": prop.get('homeType'),
                                    "zestimate": prop.get('zestimate'),
                                    "neighborhood": prop.get('address', {}).get('neighborhood') if isinstance(prop.get('address'), dict) else None,
                                    "status": prop.get('homeStatus'),
                                    "listing_url": prop.get('detailUrl'),
                                    "zpid": prop.get('zpid')
                                })
                        
                        return {
                            "search_term": address,
                            "results": results,
                            "total_count": len(results)
                        }
                    
                    return {
                        "search_term": address,
                        "results": [],
                        "total_count": 0,
                        "error": "No properties found for this search"
                    }
                    
                except (ValueError, TypeError) as e:
                    return {
                        "search_term": address,
                        "results": [],
                        "total_count": 0,
                        "error": "No properties found for this search"
                    }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Zillow API error: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail="Request timeout - Zillow API took too long to respond"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching properties: {str(e)}"
        )

# Zillow API Integration (Free)
@router.get("/zillow/{address}", response_model=Dict[str, Any])
async def get_zillow_data(
    address: str,
    user: dict = Depends(get_current_user)
):
    """Get property data from Zillow API"""
    if not RAPIDAPI_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="RapidAPI key not configured"
        )
        
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch",
                params={
                    "location": address,
                    "home_type": "Houses"
                },
                headers={
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Zillow API error: {response.text}"
                )
                
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Zillow data: {str(e)}"
        )

# Market Analysis Endpoint
@router.get("/market-analysis/{location}", response_model=Dict[str, Any])
async def get_market_analysis(
    location: str,
    property_type: Optional[str] = Query("single-family"),
    user: dict = Depends(get_current_user)
):
    """Get comprehensive market analysis for a location"""
    try:
        market_data = {}
        
        async with httpx.AsyncClient() as client:
            # Get property data from multiple sources
            tasks = []
            
            # APISCRAPY market data
            apiscrapy_task = client.get(
                "https://api.apiscrapy.com/v1/market",
                params={
                    "location": location,
                    "property_type": property_type
                }
            )
            tasks.append(apiscrapy_task)
            
            # Execute all requests concurrently
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process responses
            for i, response in enumerate(responses):
                if isinstance(response, httpx.Response) and response.status_code == 200:
                    if i == 0:  # APISCRAPY response
                        market_data["apiscrapy"] = response.json()
                        
        return {
            "location": location,
            "property_type": property_type,
            "market_data": market_data,
            "analysis_date": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch market analysis: {str(e)}"
        )

# Property Comparison Endpoint
@router.post("/compare", response_model=Dict[str, Any])
async def compare_properties(
    addresses: List[str],
    user: dict = Depends(get_current_user)
):
    """Compare multiple properties"""
    try:
        if len(addresses) > 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 5 properties can be compared at once"
            )
            
        properties = []
        
        async with httpx.AsyncClient() as client:
            for address in addresses:
                try:
                    response = await client.get(
                        "https://api.apiscrapy.com/v1/property",
                        params={"address": address}
                    )
                    if response.status_code == 200:
                        properties.append({
                            "address": address,
                            "data": response.json()
                        })
                except Exception:
                    properties.append({
                        "address": address,
                        "data": None,
                        "error": "Failed to fetch data"
                    })
                    
        return {
            "comparison": properties,
            "comparison_date": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compare properties: {str(e)}"
        )