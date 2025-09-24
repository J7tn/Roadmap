#!/usr/bin/env python3
"""
Monthly Career Trend Updater - Language Specific Tables Version
Uses chat2api to analyze career trends and update Supabase database with language-specific tables
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import aiohttp
import asyncpg
from dataclasses import dataclass
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('monthly_trend_updater_language_specific.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class CareerTrendData:
    """Data structure for career trend information"""
    career_id: str
    trend_score: float  # 0-10 scale
    trend_direction: str  # 'rising', 'stable', 'declining'
    demand_level: str  # 'high', 'medium', 'low'
    growth_rate: float  # Percentage
    market_insights: str
    key_skills_trending: List[str]
    salary_trend: str
    job_availability_score: float  # 0-10 scale
    top_locations: List[str]
    remote_work_trend: float  # 0-10 scale
    industry_impact: str
    automation_risk: float  # 0-10 scale
    future_outlook: str
    confidence_score: float  # 0-10 scale
    currency_code: str = 'USD'  # Default to USD
    salary_data: Dict = None  # Salary data by region/currency

class MonthlyTrendUpdaterLanguageSpecific:
    def __init__(self):
        self.chat2api_key = os.getenv('CHAT2API_KEY')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        self.db_pool = None
        
        # Supported languages
        self.supported_languages = ['en', 'ja', 'de', 'es', 'fr']
        
        # Currency mapping for regions
        self.currency_mapping = {
            'north-america': 'USD',
            'europe': 'EUR', 
            'asia-pacific': 'JPY',
            'south-america': 'BRL',
            'africa': 'ZAR',
            'middle-east': 'AED'
        }

    async def initialize(self):
        """Initialize database connection"""
        try:
            # Parse Supabase URL to get connection details
            if self.supabase_url:
                # Extract database URL from Supabase URL
                db_url = f"postgresql://postgres:{self.supabase_service_key}@{self.supabase_url.replace('https://', '').replace('http://', '')}/postgres"
                self.db_pool = await asyncpg.create_pool(db_url)
                logger.info("Database connection pool created successfully")
            else:
                raise ValueError("SUPABASE_URL environment variable not set")
        except Exception as e:
            logger.error(f"Failed to initialize database connection: {e}")
            raise

    async def close(self):
        """Close database connection"""
        if self.db_pool:
            await self.db_pool.close()
            logger.info("Database connection closed")

    def get_currency_for_region(self, region: str) -> str:
        """Get currency code for a given region"""
        return self.currency_mapping.get(region, 'USD')

    def generate_salary_data(self, base_salary: float, currency_code: str) -> dict:
        """Generate salary data with currency-specific formatting"""
        currency_symbols = {
            'USD': '$', 'EUR': '€', 'JPY': '¥', 'BRL': 'R$', 'ZAR': 'R', 'AED': 'د.إ'
        }
        currency_names = {
            'USD': 'US Dollar', 'EUR': 'Euro', 'JPY': 'Japanese Yen',
            'BRL': 'Brazilian Real', 'ZAR': 'South African Rand', 'AED': 'UAE Dirham'
        }
        symbol = currency_symbols.get(currency_code, '$')
        name = currency_names.get(currency_code, 'US Dollar')
        return {
            'currency_code': currency_code,
            'currency_symbol': symbol,
            'currency_name': name,
            'base_salary': base_salary,
            'formatted_salary': f"{symbol}{base_salary:,.0f}",
            'salary_range': {
                'min': base_salary * 0.8, 'max': base_salary * 1.2, 'median': base_salary
            }
        }

    async def get_careers_from_core_table(self) -> List[Dict]:
        """Get careers from the core careers table"""
        try:
            async with self.db_pool.acquire() as conn:
                query = """
                SELECT id, level, salary_range, experience_required
                FROM careers_core
                ORDER BY id
                """
                rows = await conn.fetch(query)
                return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Failed to fetch careers from core table: {e}")
            return []

    async def get_career_content_for_language(self, career_id: str, language: str) -> Optional[Dict]:
        """Get career content for a specific language"""
        try:
            async with self.db_pool.acquire() as conn:
                table_name = f"careers_{language}"
                query = f"""
                SELECT title, description, skills, job_titles, certifications, requirements
                FROM {table_name}
                WHERE career_id = $1
                """
                row = await conn.fetchrow(query, career_id)
                return dict(row) if row else None
        except Exception as e:
            logger.error(f"Failed to fetch career content for {career_id} in {language}: {e}")
            return None

    def _create_trend_analysis_prompt(self, career: Dict, language: str = 'en') -> str:
        """Create prompt for trend analysis"""
        
        # Language-specific prompts
        language_prompts = {
            'en': {
                'instruction': "Analyze the current market trends for the following career and provide comprehensive trend data in JSON format.",
                'output_format': "Provide the analysis in the following JSON format:",
                'guidelines': "Guidelines:",
                'salary_info': "salary_info.base_salary: average salary in USD for this role",
                'region': "salary_info.region: \"north-america\", \"europe\", \"asia-pacific\", \"south-america\", \"africa\", or \"middle-east\""
            },
            'ja': {
                'instruction': "以下のキャリアの現在の市場トレンドを分析し、JSON形式で包括的なトレンドデータを提供してください。",
                'output_format': "以下のJSON形式で分析を提供してください：",
                'guidelines': "ガイドライン：",
                'salary_info': "salary_info.base_salary: この役職の平均給与（USD）",
                'region': "salary_info.region: \"north-america\", \"europe\", \"asia-pacific\", \"south-america\", \"africa\", または \"middle-east\""
            }
        }
        
        prompt_data = language_prompts.get(language, language_prompts['en'])
        
        prompt = f"""
        {prompt_data['instruction']}
        
        Career: {career['title']}
        Description: {career['description']}
        Skills: {', '.join(career['skills']) if career['skills'] else 'Not specified'}
        Job Titles: {', '.join(career['job_titles']) if career['job_titles'] else 'Not specified'}
        
        {prompt_data['output_format']}
        {{
            "trend_score": 7.5,
            "trend_direction": "rising",
            "demand_level": "high",
            "growth_rate": 8.2,
            "market_insights": "Strong growth in technology sector with increasing demand for skilled professionals.",
            "key_skills_trending": ["AI/ML", "Cloud Computing", "DevOps", "Cybersecurity"],
            "salary_trend": "Salaries increasing 5-8% annually",
            "job_availability_score": 8.0,
            "top_locations": ["San Francisco", "Seattle", "Austin", "Boston"],
            "remote_work_trend": 7.5,
            "industry_impact": "Critical role in digital transformation",
            "automation_risk": 3.5,
            "future_outlook": "Excellent long-term prospects",
            "confidence_score": 8.5,
            "salary_info": {{
                "base_salary": 85000,
                "region": "north-america"
            }}
        }}
        
        {prompt_data['guidelines']}
        - trend_score: 0-10 scale rating of overall career trend
        - trend_direction: "rising", "stable", or "declining"
        - demand_level: "high", "medium", or "low"
        - growth_rate: percentage growth rate
        - market_insights: detailed market analysis (in {language} language)
        - key_skills_trending: list of trending skills
        - salary_trend: salary trend description (in {language} language)
        - job_availability_score: 0-10 scale of job availability
        - top_locations: list of top hiring locations
        - remote_work_trend: 0-10 scale of remote work availability
        - industry_impact: impact on industry (in {language} language)
        - automation_risk: 0-10 scale of automation risk
        - future_outlook: future prospects (in {language} language)
        - confidence_score: 0-10 scale of analysis confidence
        - {prompt_data['salary_info']}
        - {prompt_data['region']}
        
        Provide current, accurate market data based on recent trends and job market analysis.
        """
        return prompt

    async def analyze_career_trend(self, career_id: str, career_content: Dict, language: str = 'en') -> Optional[CareerTrendData]:
        """Analyze career trend using chat2api"""
        try:
            prompt = self._create_trend_analysis_prompt(career_content, language)
            
            async with aiohttp.ClientSession() as session:
                headers = {
                    'Authorization': f'Bearer {self.chat2api_key}',
                    'Content-Type': 'application/json'
                }
                
                data = {
                    'model': 'gpt-4',
                    'messages': [
                        {'role': 'user', 'content': prompt}
                    ],
                    'temperature': 0.3,
                    'max_tokens': 2000
                }
                
                async with session.post('https://api.chat2api.com/v1/chat/completions', 
                                      headers=headers, json=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        content = result['choices'][0]['message']['content']
                        return self._parse_trend_response(content, career_id, language)
                    else:
                        logger.error(f"Chat2API request failed with status {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Failed to analyze trend for {career_id} in {language}: {e}")
            return None

    def _parse_trend_response(self, content: str, career_id: str, language: str = 'en') -> Optional[CareerTrendData]:
        """Parse trend analysis response"""
        try:
            # Extract JSON from response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                logger.error(f"No JSON found in response for {career_id}")
                return None
                
            json_str = content[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Extract salary info
            salary_info = data.get('salary_info', {})
            base_salary = float(salary_info.get('base_salary', 75000))
            region = salary_info.get('region', 'north-america')
            
            currency_code = self.get_currency_for_region(region)
            salary_data = self.generate_salary_data(base_salary, currency_code)
            
            trend_data = CareerTrendData(
                career_id=career_id,
                trend_score=float(data.get('trend_score', 7.0)),
                trend_direction=data.get('trend_direction', 'stable'),
                demand_level=data.get('demand_level', 'medium'),
                growth_rate=float(data.get('growth_rate', 5.0)),
                market_insights=data.get('market_insights', 'Market analysis not available'),
                key_skills_trending=data.get('key_skills_trending', []),
                salary_trend=data.get('salary_trend', 'Salary trend not available'),
                job_availability_score=float(data.get('job_availability_score', 6.0)),
                top_locations=data.get('top_locations', []),
                remote_work_trend=float(data.get('remote_work_trend', 6.0)),
                industry_impact=data.get('industry_impact', 'Industry impact not analyzed'),
                automation_risk=float(data.get('automation_risk', 5.0)),
                future_outlook=data.get('future_outlook', 'Future outlook not available'),
                confidence_score=float(data.get('confidence_score', 7.0)),
                currency_code=currency_code,
                salary_data=salary_data
            )
            
            return trend_data
            
        except Exception as e:
            logger.error(f"Failed to parse trend response for {career_id} in {language}: {e}")
            return None

    async def save_trend_data(self, trend_data: CareerTrendData, language: str = 'en') -> bool:
        """Save trend data to language-specific table"""
        try:
            async with self.db_pool.acquire() as conn:
                table_name = f"career_trends_{language}"
                
                # Check if table exists, if not, create it
                await self.ensure_trend_table_exists(language)
                
                # Insert or update career trend
                query = f"""
                INSERT INTO {table_name} (
                    career_id, trend_score, trend_direction, demand_level, growth_rate,
                    market_insights, key_skills_trending, salary_trend, job_availability_score,
                    top_locations, remote_work_trend, industry_impact, automation_risk,
                    future_outlook, currency_code, salary_data, confidence_score, last_updated, next_update_due
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), $18
                )
                ON CONFLICT (career_id) DO UPDATE SET
                    trend_score = EXCLUDED.trend_score,
                    trend_direction = EXCLUDED.trend_direction,
                    demand_level = EXCLUDED.demand_level,
                    growth_rate = EXCLUDED.growth_rate,
                    market_insights = EXCLUDED.market_insights,
                    key_skills_trending = EXCLUDED.key_skills_trending,
                    salary_trend = EXCLUDED.salary_trend,
                    job_availability_score = EXCLUDED.job_availability_score,
                    top_locations = EXCLUDED.top_locations,
                    remote_work_trend = EXCLUDED.remote_work_trend,
                    industry_impact = EXCLUDED.industry_impact,
                    automation_risk = EXCLUDED.automation_risk,
                    future_outlook = EXCLUDED.future_outlook,
                    currency_code = EXCLUDED.currency_code,
                    salary_data = EXCLUDED.salary_data,
                    confidence_score = EXCLUDED.confidence_score,
                    last_updated = NOW(),
                    next_update_due = EXCLUDED.next_update_due
                """
                
                next_update = datetime.now() + timedelta(days=30)
                
                await conn.execute(
                    query,
                    trend_data.career_id,
                    trend_data.trend_score,
                    trend_data.trend_direction,
                    trend_data.demand_level,
                    trend_data.growth_rate,
                    trend_data.market_insights,
                    trend_data.key_skills_trending,
                    trend_data.salary_trend,
                    trend_data.job_availability_score,
                    trend_data.top_locations,
                    trend_data.remote_work_trend,
                    trend_data.industry_impact,
                    trend_data.automation_risk,
                    trend_data.future_outlook,
                    trend_data.currency_code,
                    json.dumps(trend_data.salary_data) if trend_data.salary_data else None,
                    trend_data.confidence_score,
                    next_update
                )
                
                logger.info(f"Successfully saved trend data for {trend_data.career_id} in {language}")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save trend data for {trend_data.career_id} in {language}: {e}")
            return False

    async def ensure_trend_table_exists(self, language: str):
        """Ensure trend table exists for the given language"""
        try:
            async with self.db_pool.acquire() as conn:
                table_name = f"career_trends_{language}"
                
                # Check if table exists
                check_query = """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                )
                """
                exists = await conn.fetchval(check_query, table_name)
                
                if not exists:
                    # Create table
                    create_query = f"""
                    CREATE TABLE {table_name} (
                        career_id TEXT PRIMARY KEY REFERENCES careers_core(id) ON DELETE CASCADE,
                        trend_score DECIMAL(3,2) NOT NULL CHECK (trend_score >= 0 AND trend_score <= 10),
                        trend_direction TEXT NOT NULL CHECK (trend_direction IN ('rising', 'stable', 'declining')),
                        demand_level TEXT NOT NULL CHECK (demand_level IN ('high', 'medium', 'low')),
                        growth_rate DECIMAL(5,2),
                        market_insights TEXT,
                        key_skills_trending TEXT[],
                        salary_trend TEXT,
                        job_availability_score DECIMAL(3,2) CHECK (job_availability_score >= 0 AND job_availability_score <= 10),
                        top_locations TEXT[],
                        remote_work_trend DECIMAL(3,2) CHECK (remote_work_trend >= 0 AND remote_work_trend <= 10),
                        industry_impact TEXT,
                        automation_risk DECIMAL(3,2) CHECK (automation_risk >= 0 AND automation_risk <= 10),
                        future_outlook TEXT,
                        currency_code TEXT DEFAULT 'USD',
                        salary_data JSONB,
                        confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 10),
                        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        next_update_due TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    )
                    """
                    await conn.execute(create_query)
                    
                    # Enable RLS
                    await conn.execute(f"ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY")
                    
                    # Create RLS policies
                    await conn.execute(f"""
                        CREATE POLICY "Allow public read access to {table_name}" 
                        ON {table_name} FOR SELECT USING (true)
                    """)
                    
                    await conn.execute(f"""
                        CREATE POLICY "Allow service role to manage {table_name}" 
                        ON {table_name} FOR ALL USING ((select auth.role()) = 'service_role')
                    """)
                    
                    logger.info(f"Created trend table {table_name}")
                
        except Exception as e:
            logger.error(f"Failed to ensure trend table exists for {language}: {e}")

    async def update_all_languages(self):
        """Update trends for all supported languages"""
        logger.info("Starting monthly trend update for all languages...")
        
        try:
            # Get all careers from core table
            careers = await self.get_careers_from_core_table()
            logger.info(f"Found {len(careers)} careers to update")
            
            total_updates = 0
            successful_updates = 0
            failed_updates = 0
            errors = []
            
            for language in self.supported_languages:
                logger.info(f"Processing language: {language}")
                
                for i, career in enumerate(careers):
                    try:
                        career_id = career['id']
                        logger.info(f"Processing career {i+1}/{len(careers)}: {career_id} in {language}")
                        
                        # Get career content for this language
                        career_content = await self.get_career_content_for_language(career_id, language)
                        
                        if not career_content:
                            logger.warning(f"No content found for {career_id} in {language}, skipping")
                            continue
                        
                        # Analyze trend
                        trend_data = await self.analyze_career_trend(career_id, career_content, language)
                        
                        if trend_data:
                            # Save trend data
                            if await self.save_trend_data(trend_data, language):
                                successful_updates += 1
                            else:
                                failed_updates += 1
                                errors.append(f"Failed to save trend data for {career_id} in {language}")
                        else:
                            failed_updates += 1
                            errors.append(f"Failed to analyze trend for {career_id} in {language}")
                        
                        total_updates += 1
                        
                        # Rate limiting
                        await asyncio.sleep(1)
                        
                    except Exception as e:
                        logger.error(f"Error processing {career_id} in {language}: {e}")
                        failed_updates += 1
                        errors.append(f"Error processing {career_id} in {language}: {str(e)}")
            
            # Log summary
            logger.info(f"Update completed for all languages:")
            logger.info(f"  Total updates attempted: {total_updates}")
            logger.info(f"  Successful updates: {successful_updates}")
            logger.info(f"  Failed updates: {failed_updates}")
            
            if errors:
                logger.error("Errors encountered:")
                for error in errors[:10]:  # Log first 10 errors
                    logger.error(f"  - {error}")
                if len(errors) > 10:
                    logger.error(f"  ... and {len(errors) - 10} more errors")
            
            return successful_updates, failed_updates
            
        except Exception as e:
            logger.error(f"Failed to update trends for all languages: {e}")
            return 0, 0

async def main():
    """Main execution function"""
    updater = MonthlyTrendUpdaterLanguageSpecific()
    
    try:
        await updater.initialize()
        successful, failed = await updater.update_all_languages()
        
        logger.info(f"Monthly trend update completed: {successful} successful, {failed} failed")
        
    except Exception as e:
        logger.error(f"Monthly trend update failed: {e}")
        raise
    finally:
        await updater.close()

if __name__ == "__main__":
    asyncio.run(main())
