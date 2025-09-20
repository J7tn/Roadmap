#!/bin/bash

# Start script for chat2api backend
echo "Starting chat2api backend..."

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ]; then
    echo "WARNING: SUPABASE_URL not set"
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "WARNING: SUPABASE_SERVICE_ROLE_KEY not set"
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "WARNING: OPENAI_API_KEY not set"
fi

# Start the FastAPI application
echo "Starting FastAPI server on port ${PORT:-8000}..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
