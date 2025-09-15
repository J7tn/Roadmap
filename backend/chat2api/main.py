from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import os
import json
import redis
from datetime import datetime, timedelta
import asyncio
from contextlib import asynccontextmanager
from supabase_career_service import supabase_career_service
from supabase_trending_service import supabase_trending_service
from scheduler import monthly_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Chat2API with monthly scheduler...")
    await monthly_scheduler.start()
    yield
    # Shutdown
    print("Shutting down Chat2API...")
    await monthly_scheduler.stop()

app = FastAPI(title="Roadmap Chat2API", version="1.0.0", lifespan=lifespan)

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

class CareerData(BaseModel):
    id: str
    title: str
    description: str
    skills: List[str]
    salary: str
    experience: str
    level: str  # E, I, A, X
    industry: str
    jobTitles: List[str]
    certifications: List[str]
    requirements: Dict[str, Any]
    location: Optional[str] = "United States"
    limit: int = 50

class MarketTrendsRequest(BaseModel):
    industries: Optional[List[str]] = None

class SkillsRequest(BaseModel):
    skill_name: Optional[str] = None

class SkillsAssessmentRequest(BaseModel):
    skills: List[str]
    experience_level: str
    current_role: str
    experience_details: str
    selected_career_goal: str
    goals_details: str

class CareerUpdateRequest(BaseModel):
    careerId: str
    updates: Dict[str, Any]

class CareerRoadmapRequest(BaseModel):
    careerId: str
    currentLevel: str
    targetLevel: str
    skills: List[str]
    experience: str

class CareerSearchRequest(BaseModel):
    skills: Optional[List[str]] = None
    salary: Optional[Dict[str, int]] = None
    level: Optional[str] = None
    category: Optional[str] = None

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

# Career data endpoints
@app.get("/api/careers")
async def get_all_careers():
    """Get all available careers with current market data"""
    try:
        # Sample career data - in production this would come from a database
        # and be updated monthly via scheduled jobs
        careers = [
            {
                "id": "ai-engineer",
                "title": "AI Engineer",
                "description": "Design, develop, and deploy artificial intelligence systems and machine learning models to solve complex business problems.",
                "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning", "Natural Language Processing", "Computer Vision", "Data Science"],
                "salary": "$90,000 - $150,000",
                "experience": "2-5 years",
                "level": "I",
                "industry": "tech",
                "jobTitles": ["AI Engineer", "Machine Learning Engineer", "AI Developer", "ML Engineer", "AI Research Engineer"],
                "certifications": ["AWS Machine Learning", "Google Cloud ML Engineer", "Microsoft Azure AI Engineer"],
                "requirements": {
                    "education": ["Bachelor's in Computer Science", "Master's in AI/ML", "Data Science Degree"],
                    "experience": "2-5 years in software development or data science",
                    "skills": ["Python", "Machine Learning", "Deep Learning", "Statistics"]
                }
            },
            {
                "id": "data-scientist",
                "title": "Data Scientist",
                "description": "Analyze complex data sets to extract insights and build predictive models for business decision-making.",
                "skills": ["Python", "R", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Pandas", "NumPy"],
                "salary": "$80,000 - $130,000",
                "experience": "2-5 years",
                "level": "I",
                "industry": "tech",
                "jobTitles": ["Data Scientist", "Senior Data Scientist", "Analytics Engineer", "Research Scientist"],
                "certifications": ["AWS Certified Data Analytics", "Google Cloud Professional Data Engineer", "Microsoft Certified: Azure Data Scientist"],
                "requirements": {
                    "education": ["Master's in Data Science", "Statistics", "Computer Science"],
                    "experience": "2-5 years in data analysis or research",
                    "skills": ["Statistics", "Machine Learning", "Python/R", "SQL"]
                }
            },
            {
                "id": "cybersecurity-analyst",
                "title": "Cybersecurity Analyst",
                "description": "Protect organizations from cyber threats by monitoring systems, analyzing security breaches, and implementing security measures.",
                "skills": ["Network Security", "Incident Response", "Risk Assessment", "SIEM", "Penetration Testing", "Compliance", "Firewall Management"],
                "salary": "$70,000 - $120,000",
                "experience": "1-4 years",
                "level": "I",
                "industry": "tech",
                "jobTitles": ["Cybersecurity Analyst", "Security Analyst", "Information Security Analyst", "SOC Analyst"],
                "certifications": ["CompTIA Security+", "CISSP", "CEH", "GSEC"],
                "requirements": {
                    "education": ["Bachelor's in Cybersecurity", "Computer Science", "Information Technology"],
                    "experience": "1-4 years in IT or security",
                    "skills": ["Network Security", "Incident Response", "Risk Assessment"]
                }
            },
            {
                "id": "cloud-engineer",
                "title": "Cloud Engineer",
                "description": "Design, implement, and manage cloud infrastructure and services to support scalable applications and systems.",
                "skills": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "CI/CD", "Infrastructure as Code"],
                "salary": "$85,000 - $140,000",
                "experience": "2-5 years",
                "level": "I",
                "industry": "tech",
                "jobTitles": ["Cloud Engineer", "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer"],
                "certifications": ["AWS Solutions Architect", "Azure Solutions Architect", "Google Cloud Professional Cloud Architect"],
                "requirements": {
                    "education": ["Bachelor's in Computer Science", "Information Technology", "Cloud Computing"],
                    "experience": "2-5 years in system administration or development",
                    "skills": ["Cloud Platforms", "Containerization", "Infrastructure as Code"]
                }
            },
            {
                "id": "software-engineer",
                "title": "Software Engineer",
                "description": "Design, develop, and maintain software applications and systems using various programming languages and frameworks.",
                "skills": ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "Git", "Agile Development"],
                "salary": "$70,000 - $130,000",
                "experience": "1-5 years",
                "level": "I",
                "industry": "tech",
                "jobTitles": ["Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer"],
                "certifications": ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Google Cloud Professional Developer"],
                "requirements": {
                    "education": ["Bachelor's in Computer Science", "Software Engineering", "Bootcamp Certificate"],
                    "experience": "1-5 years in software development",
                    "skills": ["Programming Languages", "Frameworks", "Database Management"]
                }
            }
        ]
        
        return careers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching careers: {str(e)}")

@app.get("/api/careers/{career_id}")
async def get_career_by_id(career_id: str):
    """Get a specific career by ID"""
    try:
        # Get all careers and find the specific one
        careers_response = await get_all_careers()
        career = next((c for c in careers_response if c["id"] == career_id), None)
        
        if not career:
            raise HTTPException(status_code=404, detail="Career not found")
        
        return career
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching career: {str(e)}")

@app.get("/api/careers/search")
async def search_careers(q: str = ""):
    """Search careers by query"""
    try:
        careers_response = await get_all_careers()
        
        if not q:
            return careers_response
        
        query = q.lower()
        filtered_careers = [
            career for career in careers_response
            if (query in career["title"].lower() or
                query in career["description"].lower() or
                any(query in skill.lower() for skill in career["skills"]) or
                any(query in title.lower() for title in career["jobTitles"]))
        ]
        
        return filtered_careers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching careers: {str(e)}")

# Career management endpoints
@app.post("/api/careers/update")
async def force_career_update():
    """Force an immediate career data update (admin endpoint)"""
    try:
        await monthly_scheduler.force_update()
        return {"message": "Career data update initiated", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update career data: {str(e)}")

@app.get("/api/careers/stats")
async def get_career_stats():
    """Get career data statistics"""
    try:
        stats = await supabase_career_service.get_career_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get career stats: {str(e)}")

@app.get("/api/careers/update-status")
async def get_update_status():
    """Check if career data should be updated"""
    try:
        should_update = await supabase_career_service.should_update_careers()
        return {
            "should_update": should_update,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check update status: {str(e)}")

# Trending data endpoints
@app.get("/api/trending/skills")
async def get_trending_skills():
    """Get trending skills data"""
    try:
        # This would typically fetch from Supabase, but for now return sample data
        # In production, this would be handled by the frontend Supabase service
        return {"message": "Use Supabase client directly for trending skills"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending skills: {str(e)}")

@app.get("/api/trending/industries")
async def get_trending_industries():
    """Get trending industries data"""
    try:
        return {"message": "Use Supabase client directly for trending industries"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending industries: {str(e)}")

@app.get("/api/trending/roles")
async def get_emerging_roles():
    """Get emerging roles data"""
    try:
        return {"message": "Use Supabase client directly for emerging roles"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get emerging roles: {str(e)}")

@app.post("/api/trending/update")
async def force_trending_update():
    """Force an immediate trending data update (admin endpoint)"""
    try:
        await monthly_scheduler.force_trending_update()
        return {"message": "Trending data update initiated", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update trending data: {str(e)}")

@app.get("/api/trending/stats")
async def get_trending_stats():
    """Get trending data statistics"""
    try:
        stats = await supabase_trending_service.get_trending_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending stats: {str(e)}")

@app.get("/api/trending/update-status")
async def get_trending_update_status():
    """Check if trending data should be updated"""
    try:
        should_update = await supabase_trending_service.should_update_trending_data()
        return {
            "should_update": should_update,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check trending update status: {str(e)}")

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

@app.post("/api/skills/assessment")
async def get_skills_assessment_recommendations(request: SkillsAssessmentRequest):
    """Get personalized career recommendations based on skills assessment"""
    cache_key = get_cache_key("skills_assessment", 
                             skills=",".join(sorted(request.skills)),
                             experience=request.experience_level,
                             goal=request.selected_career_goal)
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = f"""Based on this skills assessment, provide personalized career recommendations:

Skills: {', '.join(request.skills)}
Experience Level: {request.experience_level}
Current Role: {request.current_role}
Experience Details: {request.experience_details}
Career Goal: {request.selected_career_goal}
Additional Goals: {request.goals_details}

Please provide recommendations in this exact JSON format:
{{
  "careerPaths": [
    {{
      "title": "Job Title",
      "match": "95%",
      "description": "Why this career path matches",
      "salary": "Salary range",
      "growth": "Growth potential",
      "requiredSkills": ["skill1", "skill2"],
      "nextSteps": ["step1", "step2"]
    }}
  ],
  "skillDevelopment": [
    {{
      "skill": "Skill Name",
      "priority": "High/Medium/Low",
      "timeline": "3-6 months",
      "description": "Why this skill is important",
      "resources": ["resource1", "resource2"]
    }}
  ],
  "roadmap": {{
    "shortTerm": ["Goal 1", "Goal 2"],
    "mediumTerm": ["Goal 1", "Goal 2"],
    "longTerm": ["Goal 1", "Goal 2"]
  }}
}}

Make the recommendations highly personalized and actionable based on their specific skills, experience, and goals."""
        
        response = await generate_ai_response(prompt)
        recommendations = parse_assessment_response(response)
        
        cache_response(cache_key, recommendations)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Career Management Endpoints
@app.get("/api/careers")
async def get_all_careers():
    """Get all available careers with current market data"""
    cache_key = get_cache_key("all_careers")
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = """Provide a comprehensive list of current career paths with up-to-date information including:

1. Career ID, title, category, and level
2. Current salary ranges (min, max, currency) with 2024 data
3. Required skills for each level
4. Growth potential percentage and description
5. Next steps for career progression
6. Short/medium/long term roadmap
7. Market demand and job outlook

Return in JSON format with careers array containing all the detailed information."""
        
        response = await generate_ai_response(prompt)
        careers_data = parse_careers_response(response)
        
        cache_response(cache_key, careers_data, ttl=86400)  # Cache for 24 hours
        return careers_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/careers/{career_id}")
async def get_career_data(career_id: str):
    """Get specific career data with current market information"""
    cache_key = get_cache_key("career_data", career_id=career_id)
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = f"""Provide detailed, current information for the career: {career_id}

Include:
1. Current salary ranges (2024 data)
2. Required skills and certifications
3. Growth potential and market outlook
4. Career progression roadmap (short/medium/long term)
5. Job requirements and qualifications
6. Market demand and job availability

Return in JSON format with all current market data."""
        
        response = await generate_ai_response(prompt)
        career_data = parse_single_career_response(response)
        
        cache_response(cache_key, career_data, ttl=86400)
        return career_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/careers/{career_id}")
async def update_career_data(career_id: str, request: CareerUpdateRequest):
    """Update career data with new information"""
    try:
        # Validate the update request
        if not request.updates:
            raise HTTPException(status_code=400, detail="No updates provided")
        
        # Generate updated career data using AI
        prompt = f"""Update the career data for {career_id} with the following changes:
        
Updates: {json.dumps(request.updates, indent=2)}

Please provide the complete updated career information including:
1. Updated salary ranges with current market data
2. Revised required skills and certifications
3. Current growth potential and market outlook
4. Updated career roadmap
5. Current job requirements

Return the complete updated career data in JSON format."""
        
        response = await generate_ai_response(prompt)
        updated_career = parse_single_career_response(response)
        
        # Update cache
        cache_key = get_cache_key("career_data", career_id=career_id)
        cache_response(cache_key, updated_career, ttl=86400)
        
        return updated_career
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/careers/roadmap")
async def generate_career_roadmap(request: CareerRoadmapRequest):
    """Generate personalized career roadmap"""
    cache_key = get_cache_key("career_roadmap", 
                             career_id=request.careerId,
                             current_level=request.currentLevel,
                             target_level=request.targetLevel)
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = f"""Generate a personalized career roadmap for transitioning from {request.currentLevel} to {request.targetLevel} in {request.careerId}.

Current Skills: {', '.join(request.skills)}
Current Experience: {request.experience}

Provide a detailed roadmap with:
1. Short-term goals (3-6 months)
2. Medium-term goals (6-12 months) 
3. Long-term goals (1+ years)

Each goal should be specific, actionable, and include:
- Skills to develop
- Certifications to obtain
- Experience to gain
- Milestones to achieve

Return in JSON format with shortTerm, mediumTerm, and longTerm arrays."""
        
        response = await generate_ai_response(prompt)
        roadmap = parse_roadmap_response(response)
        
        cache_response(cache_key, roadmap, ttl=604800)  # Cache for 1 week
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/careers/{career_id}/refresh")
async def refresh_career_data(career_id: str):
    """Refresh career data with latest market information"""
    try:
        prompt = f"""Provide the most current market data for {career_id} career path including:

1. Updated 2024 salary ranges
2. Current required skills and technologies
3. Latest growth projections and market trends
4. Updated job requirements and qualifications
5. Current certifications and training needed
6. Market demand and job availability

Return complete updated career data in JSON format."""
        
        response = await generate_ai_response(prompt)
        refreshed_career = parse_single_career_response(response)
        
        # Update cache
        cache_key = get_cache_key("career_data", career_id=career_id)
        cache_response(cache_key, refreshed_career, ttl=86400)
        
        return refreshed_career
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/careers/{career_id}/market")
async def get_career_market_data(career_id: str):
    """Get current market data for a specific career"""
    cache_key = get_cache_key("career_market", career_id=career_id)
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = f"""Provide current market data for {career_id} including:

1. Job demand score (0-100)
2. Growth rate percentage
3. Average salary range
4. Number of current job openings
5. Market trends and outlook

Return in JSON format with demand, growth, averageSalary, jobOpenings, and lastUpdated fields."""
        
        response = await generate_ai_response(prompt)
        market_data = parse_market_data_response(response)
        
        cache_response(cache_key, market_data, ttl=86400)
        return market_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/careers/search")
async def search_careers(request: CareerSearchRequest):
    """Search careers based on criteria"""
    cache_key = get_cache_key("career_search", 
                             skills=",".join(request.skills or []),
                             salary_min=request.salary.get('min') if request.salary else None,
                             salary_max=request.salary.get('max') if request.salary else None,
                             level=request.level,
                             category=request.category)
    
    cached = get_cached_response(cache_key)
    if cached:
        return cached
    
    try:
        prompt = f"""Search for careers matching these criteria:

Skills: {', '.join(request.skills or [])}
Salary Range: {request.salary.get('min') if request.salary else 'Any'} - {request.salary.get('max') if request.salary else 'Any'}
Level: {request.level or 'Any'}
Category: {request.category or 'Any'}

Return matching careers with current market data in JSON format."""
        
        response = await generate_ai_response(prompt)
        search_results = parse_careers_response(response)
        
        cache_response(cache_key, search_results, ttl=3600)  # Cache for 1 hour
        return search_results
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

def parse_assessment_response(response: str) -> Dict[str, Any]:
    """Parse AI response into assessment recommendations format"""
    try:
        json_match = response.find('{')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Throw error instead of returning fallback data
    raise ValueError("Failed to parse assessment recommendations from AI response")

def parse_careers_response(response: str) -> List[Dict[str, Any]]:
    """Parse AI response into careers list format"""
    try:
        json_match = response.find('[')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Throw error instead of returning fallback data
    raise ValueError("Failed to parse careers data from AI response")

def parse_single_career_response(response: str) -> Dict[str, Any]:
    """Parse AI response into single career format"""
    try:
        json_match = response.find('{')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Throw error instead of returning fallback data
    raise ValueError("Failed to parse career data from AI response")

def parse_roadmap_response(response: str) -> Dict[str, Any]:
    """Parse AI response into roadmap format"""
    try:
        json_match = response.find('{')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Throw error instead of returning fallback data
    raise ValueError("Failed to parse roadmap data from AI response")

def parse_market_data_response(response: str) -> Dict[str, Any]:
    """Parse AI response into market data format"""
    try:
        json_match = response.find('{')
        if json_match != -1:
            json_str = response[json_match:]
            return json.loads(json_str)
    except:
        pass
    
    # Throw error instead of returning fallback data
    raise ValueError("Failed to parse market data from AI response")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
