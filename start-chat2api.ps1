# Roadmap Chat2API Docker Startup Script
Write-Host "Starting Roadmap Chat2API Docker Services..." -ForegroundColor Green
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "Building and starting Chat2API services..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host ""
Write-Host "Services started! Chat2API is running at http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs: docker-compose logs -f chat2api" -ForegroundColor White
Write-Host "  Stop services: docker-compose down" -ForegroundColor White
Write-Host "  Restart: docker-compose restart" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
