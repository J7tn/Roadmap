#!/bin/bash

# Startup script for Railway deployment
# This ensures the language-specific scheduler starts properly

echo "Starting Chat2API with language-specific trend updates..."

# Set environment variables if not already set
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start the FastAPI application with uvicorn
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1