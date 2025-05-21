
# Real Estate CRM API

This is the FastAPI backend for the Real Estate CRM application, designed to support both web and React Native mobile clients.

## Features

- Authentication (login, signup, profile management)
- Client management
- Calendar and appointment scheduling
- Integration with Supabase for database operations

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd server
pip install -r requirements.txt
```

### Running the API

```bash
cd server
uvicorn main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000)

## API Documentation

Once the server is running, you can access the interactive API documentation:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Docker Deployment

You can build and run the API using Docker:

```bash
# Build the Docker image
docker build -t real-estate-crm-api .

# Run the container
docker run -p 8000:8000 real-estate-crm-api
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Project Structure

- `/routers` - API route handlers organized by feature
- `main.py` - Application entry point
- `dependencies.py` - Shared dependencies and utilities
