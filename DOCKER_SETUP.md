# Roadmap Chat2API Docker Setup

This guide explains how to set up and use the Docker-based Chat2API service for your Roadmap application.

## What This Setup Provides

- **Local Chat2API service** running in Docker containers
- **Redis caching** for improved performance
- **OpenAI API integration** with fallback responses
- **Custom endpoints** for job market data, trends, and skills
- **Automatic caching** of responses to reduce API calls

## Prerequisites

1. **Docker Desktop** installed and running
2. **OpenAI API key** (optional, for real AI responses)
3. **Chat2API key** (optional, for additional features)

## Quick Start

### Option 1: Windows Batch File (Easiest)
1. Double-click `start-chat2api.bat`
2. Wait for services to start
3. Chat2API will be available at `http://localhost:8000`

### Option 2: PowerShell Script
1. Right-click `start-chat2api.ps1` → "Run with PowerShell"
2. Wait for services to start
3. Chat2API will be available at `http://localhost:8000`

### Option 3: Manual Docker Commands
```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f chat2api

# Stop services
docker-compose down
```

## Configuration

### 1. Update Environment Variables

Edit `chat2api.env` and add your actual API keys:

```env
OPENAI_API_KEY=your-actual-openai-key
CHAT2API_API_KEY=your-actual-chat2api-key
```

### 2. Update Your Main .env File

In your main `.env` file, update these lines:

```env
# Chat2API Configuration
VITE_CHAT2API_KEY=local-docker-key
VITE_CHAT2API_URL=http://localhost:8000
```

## How It Works

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your React   │    │   Chat2API     │    │     Redis      │
│     App        │◄──►│   Service      │◄──►│    Cache       │
│                 │    │  (Port 8000)   │    │                │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **Your app** requests job market data
2. **Chat2API service** checks Redis cache first
3. **If cached**: Returns cached data immediately
4. **If not cached**: Calls OpenAI API or uses fallback
5. **Stores response** in Redis for future requests
6. **Returns data** to your app

## API Endpoints

### 1. Chat Completions (OpenAI Compatible)
```
POST http://localhost:8000/v1/chat/completions
```

### 2. Job Market Data
```
POST http://localhost:8000/api/jobs/market
{
  "industry": "technology",
  "location": "United States",
  "limit": 50
}
```

### 3. Market Trends
```
POST http://localhost:8000/api/trends/market
{
  "industries": ["technology", "healthcare"]
}
```

### 4. Skills Data
```
POST http://localhost:8000/api/skills/data
{
  "skill_name": "JavaScript"
}
```

### 5. Health Check
```
GET http://localhost:8000/health
```

## Benefits of This Setup

### ✅ **Cost Effective**
- No external API costs for basic operations
- Caching reduces repeated API calls
- Fallback data when APIs are unavailable

### ✅ **Performance**
- Redis caching for instant responses
- Local service reduces latency
- Automatic rate limiting and optimization

### ✅ **Reliability**
- Fallback responses when APIs fail
- Local service continues working offline
- Graceful degradation of features

### ✅ **Customization**
- Modify prompts and responses
- Add new data sources
- Custom business logic

## Troubleshooting

### Service Won't Start
```bash
# Check Docker status
docker info

# Check service logs
docker-compose logs chat2api

# Restart services
docker-compose restart
```

### Port Already in Use
```bash
# Check what's using port 8000
netstat -ano | findstr :8000

# Stop conflicting service or change port in docker-compose.yml
```

### Redis Connection Issues
```bash
# Check Redis container
docker-compose ps redis

# View Redis logs
docker-compose logs redis
```

## Development

### Adding New Endpoints
1. Edit `chat2api_app/main.py`
2. Add new route handlers
3. Rebuild Docker image: `docker-compose up --build`

### Modifying Prompts
1. Edit the prompt strings in `main.py`
2. Restart the service: `docker-compose restart chat2api`

### Adding New Data Sources
1. Create new API integration functions
2. Add caching logic
3. Update the main endpoints

## Production Considerations

### Security
- Restrict CORS origins in production
- Add authentication middleware
- Use environment-specific configuration

### Scaling
- Add load balancer for multiple instances
- Use external Redis cluster
- Implement proper monitoring

### Monitoring
- Add logging and metrics
- Set up health checks
- Monitor API usage and performance

## Support

If you encounter issues:
1. Check the service logs: `docker-compose logs chat2api`
2. Verify Docker is running: `docker info`
3. Check port availability: `netstat -ano | findstr :8000`
4. Restart services: `docker-compose restart`

## Next Steps

1. **Start the services** using one of the startup scripts
2. **Test the endpoints** using a tool like Postman or curl
3. **Update your app** to use the local service
4. **Customize the prompts** for your specific needs
5. **Add your API keys** for real AI responses

Happy coding! 🚀
