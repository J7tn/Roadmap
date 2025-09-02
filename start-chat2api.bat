@echo off
echo Starting Roadmap Chat2API Docker Services...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Building and starting Chat2API services...
docker-compose up --build -d

echo.
echo Services started! Chat2API is running at http://localhost:8000
echo.
echo To view logs: docker-compose logs -f chat2api
echo To stop services: docker-compose down
echo.
pause
