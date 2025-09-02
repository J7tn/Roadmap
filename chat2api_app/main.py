from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import os
import json
import redis
from datetime import datetime, timedelta

app = FastAPI(title="Roadmap Chat2API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection for caching
redis_client = None
try:
    redis_client = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)
except:
    print("Redis not available, running without cache")

# Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str = "gpt-3.5-turbo"
    messages: List[ChatMessage]
    temperature: float = 0.7
    max_tokens: int = 2000
    stream: bool = False

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[Dict[str, Any]]
    usage: Dict[str, int]

class JobMarketRequest(BaseModel):
    industry: Optional[str] = "technology"
    location: Optional[str] = "United States"
    limit: int = 50

class MarketTrendsRequest(BaseModel):
    industries: Optional[List[str]] = None

class SkillsRequest(BaseModel):
    skill_name: Optional[str] = None

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CHAT2API_API_KEY = os.getenv("CHAT2API_API_KEY")
CACHE_TTL = 604800  # 1 week (7 days)

def get_cache_key(request_type: str, **kwargs) -> str:
    """Generate cache key for requests"""
    key_parts = [request_type]
    for k, v in sorted(kwargs.items()):
        if v is not None:
            key_parts.append(f"{k}:{v}")
    return ":".join(key_parts)

def get_cached_response(cache_key: str) -> Optional[Dict[str, Any]]:
    """Get cached response from Redis"""
    if not redis_client:
        return None
    
    try:
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
    except:
        pass
    return None

def cache_response(cache_key: str, response: Dict[str, Any], ttl: int = CACHE_TTL):
    """Cache response in Redis"""
    if not redis_client:
        return
    
    try:
        redis_client.setex(cache_key, ttl, json.dumps(response))
    except:
        pass

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    """Main chat completions endpoint compatible with OpenAI API"""
    try:
        # Check if we have a cached response for job market requests
        if is_job_market_request(request.messages):
            cache_key = get_cache_key("job_market", 
                                    industry=extract_industry(request.messages),
                                    location=extract_location(request.messages))
            cached = get_cached_response(cache_key)
            if cached:
                return cached

        # Forward to OpenAI or use fallback
        response = await forward_to_openai(request)
        
        # Cache job market responses
        if is_job_market_request(request.messages):
            cache_key = get_cache_key("job_market", 
                                    industry=extract_industry(request.messages),
                                    location=extract_location(request.messages))
            cache_response(cache_key, response)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/jobs/market")
async def get_job_market_data(request: JobMarketRequest):
    """Get job market data for specific industry and location"""
    cache_key = get_cache_key("job_market", 
                             industry=request.industry, 
                             location=request.location)
    
    # Check cache first
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        # Generate job market data using AI
        prompt = f"""Find current job openings for {request.industry} positions in {request.location}. 
        Return the data in JSON format with fields: id, title, company, location, salary (min, max, currency), 
        skills, experience, type, postedDate, demand, growthRate, industry, description.
        Generate {request.limit} realistic job postings."""
        
        response = await generate_ai_response(prompt)
        job_data = parse_job_response(response)
        
        # Cache the response
        cache_response(cache_key, job_data)
        
        return job_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trends/market")
async def get_market_trends(request: MarketTrendsRequest):
    """Get market trends and insights"""
    cache_key = get_cache_key("market_trends", 
                             industries=",".join(request.industries) if request.industries else "all")
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = """Provide current market trends for technology and other industries including:
        1. Trending skills with demand scores (0-100), growth rates, and salary estimates
        2. Emerging job roles with descriptions, growth rates, and required skills
        3. Industry insights with growth rates, job counts, and average salaries
        Return in JSON format matching the MarketTrends interface."""
        
        response = await generate_ai_response(prompt)
        trends_data = parse_trends_response(response)
        
        cache_response(cache_key, trends_data)
        return trends_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/skills/data")
async def get_skills_data(request: SkillsRequest):
    """Get skills assessment data"""
    cache_key = get_cache_key("skills_data", skill_name=request.skill_name)
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = f"""Provide detailed information about {request.skill_name or 'in-demand technical skills'} including:
        demand score (0-100), salary estimates, growth rate, related skills, and relevant certifications.
        Return in JSON format matching the SkillsData interface."""
        
        response = await generate_ai_response(prompt)
        skills_data = parse_skills_response(response)
        
        cache_response(cache_key, skills_data)
        return skills_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def is_job_market_request(messages: List[ChatMessage]) -> bool:
    """Check if the request is for job market data"""
    content = " ".join([msg.content.lower() for msg in messages])
    keywords = ["job", "position", "career", "employment", "hiring", "recruitment"]
    return any(keyword in content for keyword in keywords)

def extract_industry(messages: List[ChatMessage]) -> Optional[str]:
    """Extract industry from messages"""
    content = " ".join([msg.content.lower() for msg in messages])
    industries = ["technology", "healthcare", "finance", "manufacturing", "education"]
    for industry in industries:
        if industry in content:
            return industry
    return None

def extract_location(messages: List[ChatMessage]) -> Optional[str]:
    """Extract location from messages"""
    content = " ".join([msg.content.lower() for msg in messages])
    locations = ["united states", "remote", "new york", "california", "texas"]
    for location in locations:
        if location in content:
            return location
    return "United States"

async def forward_to_openai(request: ChatRequest) -> Dict[str, Any]:
    """Forward request to OpenAI API"""
    if not OPENAI_API_KEY:
        # Return fallback response if no API key
        return generate_fallback_response(request)
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json=request.dict()
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            # Fallback if OpenAI fails
            return generate_fallback_response(request)

async def generate_ai_response(prompt: str) -> str:
    """Generate AI response using available API"""
    if OPENAI_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7,
                        "max_tokens": 2000
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
        except:
            pass
    
    # Fallback to predefined responses
    return generate_fallback_content(prompt)

def generate_fallback_response(request: ChatRequest) -> Dict[str, Any]:
    """Generate fallback response when APIs fail"""
    return {
        "id": f"fallback-{datetime.utcnow().timestamp()}",
        "object": "chat.completion",
        "created": int(datetime.utcnow().timestamp()),
        "model": request.model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": generate_fallback_content(" ".join([msg.content for msg in request.messages]))
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0
        }
    }

def generate_fallback_content(prompt: str) -> str:
    """Generate fallback content based on prompt"""
    if "job" in prompt.lower() or "position" in prompt.lower():
        return """Here are some sample job openings:

1. **Software Engineer** at TechCorp
   - Location: Remote
   - Salary: $80,000 - $120,000
   - Skills: JavaScript, React, Node.js
   - Experience: Mid Level

2. **Data Scientist** at Analytics Inc
   - Location: Remote
   - Salary: $90,000 - $140,000
   - Skills: Python, Machine Learning, SQL
   - Experience: Mid Level

*Note: This is fallback data. For real-time information, please check job boards.*"""
    
    return "I'm currently using fallback mode. Please try again later for real-time data."

def parse_job_response(response: str) -> List[Dict[str, Any]]:
    """Parse AI response into job data format"""
    try:
        # Try to extract JSON from response
        json_match = response.find('{')
        if json_match != -1:
            json_str = response[json_match:]
            data = json.loads(json_str)
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'jobs' in data:
                return data['jobs']
    except:
        pass
    
    # Return fallback data if parsing fails
    return [
        {
            "id": "fallback-1",
            "title": "Software Engineer",
            "company": "Tech Company",
            "location": "Remote",
            "salary": {"min": 80000, "max": 120000, "currency": "USD"},
            "skills": ["JavaScript", "React", "Node.js"],
            "experience": "Mid Level",
            "type": "full-time",
            "postedDate": datetime.utcnow().isoformat(),
            "demand": "high",
            "growthRate": 15,
            "industry": "Technology",
            "description": "Fallback job data when APIs are unavailable."
        }
    ]

def parse_trends_response(response: str) -> Dict[str, Any]:
    """Parse AI response into trends format"""
    try:
        json_match = response.find('{')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Return fallback trends
    return {
        "trendingSkills": [
            {"skill": "AI/ML", "demand": 95, "growth": 25, "salary": 120000},
            {"skill": "Cybersecurity", "demand": 90, "growth": 20, "salary": 110000}
        ],
        "emergingRoles": [
            {"title": "AI Engineer", "description": "Build AI models", "growth": 30, "skills": ["Python", "ML"]}
        ],
        "industryInsights": [
            {"industry": "Technology", "growth": 15, "jobCount": 50000, "avgSalary": 95000}
        ]
    }

def parse_skills_response(response: str) -> List[Dict[str, Any]]:
    """Parse AI response into skills format"""
    try:
        json_match = response.find('[')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Return fallback skills data
    return [
        {
            "skill": "JavaScript",
            "demand": 90,
            "salary": 95000,
            "growth": 15,
            "relatedSkills": ["TypeScript", "React"],
            "certifications": ["AWS Certified Developer"]
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
