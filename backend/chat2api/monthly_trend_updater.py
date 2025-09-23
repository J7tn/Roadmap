#!/usr/bin/env python3
"""
Monthly Career Trend Updater
Uses chat2api to analyze career trends and update Supabase database
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
from translation_service import translation_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('monthly_trend_updater.log'),
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

class MonthlyTrendUpdater:
    """Main class for updating career trends monthly"""
    
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        self.chat2api_url = os.getenv('CHAT2API_URL', 'http://localhost:8000')
        self.chat2api_key = os.getenv('CHAT2API_API_KEY')
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("Missing required Supabase environment variables")
        
        self.db_pool = None
        self.session = None
        
        # Currency mapping for regions
        self.currency_mapping = {
            'north-america': 'USD',
            'europe': 'EUR', 
            'asia-pacific': 'JPY',
            'south-america': 'BRL',
            'africa': 'ZAR',
            'middle-east': 'AED'
        }
        
    def get_currency_for_region(self, region: str) -> str:
        """Get currency code for a given region"""
        return self.currency_mapping.get(region, 'USD')
    
    def generate_salary_data(self, base_salary: float, currency_code: str) -> dict:
        """Generate salary data with currency-specific formatting"""
        # Currency symbols mapping
        currency_symbols = {
            'USD': '$',
            'EUR': '€',
            'JPY': '¥',
            'BRL': 'R$',
            'ZAR': 'R',
            'AED': 'د.إ'
        }
        
        # Currency names mapping
        currency_names = {
            'USD': 'US Dollar',
            'EUR': 'Euro',
            'JPY': 'Japanese Yen',
            'BRL': 'Brazilian Real',
            'ZAR': 'South African Rand',
            'AED': 'UAE Dirham'
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
                'min': base_salary * 0.8,
                'max': base_salary * 1.2,
                'median': base_salary
            }
        }
        
    async def initialize(self):
        """Initialize database connection and HTTP session"""
        try:
            # Create database connection pool
            self.db_pool = await asyncpg.create_pool(
                host=self.supabase_url.replace('https://', '').replace('http://', ''),
                port=5432,
                user='postgres',
                password=self.supabase_key,
                database='postgres',
                min_size=5,
                max_size=20
            )
            
            # Create HTTP session
            self.session = aiohttp.ClientSession()
            
            # Initialize translation service
            await translation_service.initialize()
            
            logger.info("Initialized database connection, HTTP session, and translation service")
            
        except Exception as e:
            logger.error(f"Failed to initialize: {e}")
            raise
    
    async def cleanup(self):
        """Clean up resources"""
        if self.db_pool:
            await self.db_pool.close()
        if self.session:
            await self.session.close()
        await translation_service.cleanup()
    
    async def get_careers_to_update(self) -> List[Dict]:
        """Get careers that need trend updates"""
        try:
            async with self.db_pool.acquire() as conn:
                # Get careers that haven't been updated in the last month
                query = """
                SELECT c.id, c.title, c.industry, c.skills, c.level, c.description
                FROM careers c
                LEFT JOIN career_trends ct ON c.id = ct.career_id
                WHERE ct.last_updated IS NULL 
                   OR ct.last_updated < NOW() - INTERVAL '1 month'
                ORDER BY c.industry, c.title
                LIMIT 100
                """
                
                rows = await conn.fetch(query)
                careers = [dict(row) for row in rows]
                
                logger.info(f"Found {len(careers)} careers to update")
                return careers
                
        except Exception as e:
            logger.error(f"Failed to get careers to update: {e}")
            return []
    
    async def analyze_career_trend(self, career: Dict) -> Optional[CareerTrendData]:
        """Use chat2api to analyze career trends"""
        try:
            # Prepare prompt for chat2api
            prompt = self._create_trend_analysis_prompt(career)
            
            # Call chat2api
            async with self.session.post(
                f"{self.chat2api_url}/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.chat2api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a career market analyst. Analyze career trends and provide structured data."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000
                }
            ) as response:
                
                if response.status != 200:
                    logger.error(f"Chat2API request failed: {response.status}")
                    return None
                
                result = await response.json()
                content = result['choices'][0]['message']['content']
                
                # Parse the response
                trend_data = self._parse_trend_response(content, career['id'])
                return trend_data
                
        except Exception as e:
            logger.error(f"Failed to analyze career trend for {career['id']}: {e}")
            return None
    
    def _create_trend_analysis_prompt(self, career: Dict) -> str:
        """Create a detailed prompt for trend analysis"""
        skills_str = ', '.join(career.get('skills', []))
        
        prompt = f"""
        Analyze the current market trends for the career: {career['title']}
        
        Career Details:
        - Title: {career['title']}
        - Industry: {career['industry']}
        - Level: {career['level']}
        - Skills: {skills_str}
        - Description: {career.get('description', '')}
        
        Please provide a comprehensive trend analysis in the following JSON format:
        {{
            "trend_score": 7.5,
            "trend_direction": "rising",
            "demand_level": "high",
            "growth_rate": 15.2,
            "market_insights": "Detailed analysis of current market conditions...",
            "key_skills_trending": ["Python", "Machine Learning", "Cloud Computing"],
            "salary_trend": "Salaries are increasing by 8-12% annually due to high demand",
            "job_availability_score": 8.2,
            "top_locations": ["San Francisco", "New York", "Seattle", "Austin"],
            "remote_work_trend": 7.8,
            "industry_impact": "AI and automation are driving demand for this role",
            "automation_risk": 3.2,
            "future_outlook": "Strong growth expected over next 2-3 years",
            "confidence_score": 8.5,
            "salary_info": {{
                "base_salary": 85000,
                "region": "north-america"
            }}
        }}
        
        Guidelines:
        - trend_score: 0-10 scale (10 = very hot/trending)
        - trend_direction: "rising", "stable", or "declining"
        - demand_level: "high", "medium", or "low"
        - growth_rate: percentage growth expected
        - job_availability_score: 0-10 scale (10 = many jobs available)
        - remote_work_trend: 0-10 scale (10 = very remote-friendly)
        - automation_risk: 0-10 scale (10 = high risk of automation)
        - confidence_score: 0-10 scale (10 = very confident in analysis)
        - salary_info.base_salary: average salary in USD for this role
        - salary_info.region: "north-america", "europe", "asia-pacific", "south-america", "africa", or "middle-east"
        
        Provide current, accurate market data based on recent trends and job market analysis.
        """
        
        return prompt
    
    def _parse_trend_response(self, content: str, career_id: str) -> Optional[CareerTrendData]:
        """Parse the chat2api response into structured data"""
        try:
            # Extract JSON from response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                logger.error(f"No JSON found in response for {career_id}")
                return None
            
            json_str = content[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Extract salary information for currency conversion
            salary_info = data.get('salary_info', {})
            base_salary = float(salary_info.get('base_salary', 75000))  # Default to $75k USD
            region = salary_info.get('region', 'north-america')  # Default to North America
            
            # Get currency for the region
            currency_code = self.get_currency_for_region(region)
            
            # Generate salary data with currency information
            salary_data = self.generate_salary_data(base_salary, currency_code)
            
            # Create CareerTrendData object
            trend_data = CareerTrendData(
                career_id=career_id,
                trend_score=float(data.get('trend_score', 5.0)),
                trend_direction=data.get('trend_direction', 'stable'),
                demand_level=data.get('demand_level', 'medium'),
                growth_rate=float(data.get('growth_rate', 0.0)),
                market_insights=data.get('market_insights', ''),
                key_skills_trending=data.get('key_skills_trending', []),
                salary_trend=data.get('salary_trend', ''),
                job_availability_score=float(data.get('job_availability_score', 5.0)),
                top_locations=data.get('top_locations', []),
                remote_work_trend=float(data.get('remote_work_trend', 5.0)),
                industry_impact=data.get('industry_impact', ''),
                automation_risk=float(data.get('automation_risk', 5.0)),
                future_outlook=data.get('future_outlook', ''),
                confidence_score=float(data.get('confidence_score', 5.0)),
                currency_code=currency_code,
                salary_data=salary_data
            )
            
            return trend_data
            
        except Exception as e:
            logger.error(f"Failed to parse trend response for {career_id}: {e}")
            return None
    
    async def save_trend_data(self, trend_data: CareerTrendData) -> bool:
        """Save trend data to Supabase"""
        try:
            async with self.db_pool.acquire() as conn:
                # Insert or update career trend
                query = """
                INSERT INTO career_trends (
                    career_id, trend_score, trend_direction, demand_level, growth_rate,
                    market_insights, key_skills_trending, salary_trend, job_availability_score,
                    top_locations, remote_work_trend, industry_impact, automation_risk,
                    future_outlook, confidence_score, next_update_due
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
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
                    trend_data.confidence_score,
                    trend_data.currency_code,
                    trend_data.salary_data,
                    next_update
                )
                
                # Save to history
                history_query = """
                INSERT INTO career_trend_history (career_id, trend_data, currency_code, month_year)
                VALUES ($1, $2, $3, $4)
                """
                
                current_month = datetime.now().strftime('%Y-%m')
                trend_json = {
                    'trend_score': trend_data.trend_score,
                    'trend_direction': trend_data.trend_direction,
                    'demand_level': trend_data.demand_level,
                    'growth_rate': trend_data.growth_rate,
                    'market_insights': trend_data.market_insights,
                    'key_skills_trending': trend_data.key_skills_trending,
                    'salary_trend': trend_data.salary_trend,
                    'job_availability_score': trend_data.job_availability_score,
                    'top_locations': trend_data.top_locations,
                    'remote_work_trend': trend_data.remote_work_trend,
                    'industry_impact': trend_data.industry_impact,
                    'automation_risk': trend_data.automation_risk,
                    'future_outlook': trend_data.future_outlook,
                    'confidence_score': trend_data.confidence_score
                }
                
                await conn.execute(
                    history_query,
                    trend_data.career_id,
                    json.dumps(trend_json),
                    trend_data.currency_code,
                    current_month
                )
                
                logger.info(f"Saved trend data for {trend_data.career_id}")
                
                # Save translations for all languages
                await self.save_trend_translations(trend_data)
                
                return True
                
        except Exception as e:
            logger.error(f"Failed to save trend data for {trend_data.career_id}: {e}")
            return False
    
    async def save_trend_translations(self, trend_data: CareerTrendData):
        """Save trend data translations for all supported languages"""
        try:
            # Convert trend data to dict for translation
            trend_dict = {
                'market_insights': trend_data.market_insights,
                'salary_trend': trend_data.salary_trend,
                'industry_impact': trend_data.industry_impact,
                'future_outlook': trend_data.future_outlook
            }
            
            # Get translations for all languages
            translations = await translation_service.translate_trend_data(trend_dict)
            
            # Save translations to database
            async with self.db_pool.acquire() as conn:
                for language_code, translation in translations.items():
                    if language_code == 'en':
                        continue  # Skip English as it's already saved
                    
                    # Insert or update trend translation
                    translation_query = """
                    INSERT INTO career_trend_translations (
                        career_id, language_code, market_insights, salary_trend,
                        industry_impact, future_outlook, created_at, updated_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                    ON CONFLICT (career_id, language_code) DO UPDATE SET
                        market_insights = EXCLUDED.market_insights,
                        salary_trend = EXCLUDED.salary_trend,
                        industry_impact = EXCLUDED.industry_impact,
                        future_outlook = EXCLUDED.future_outlook,
                        updated_at = NOW()
                    """
                    
                    await conn.execute(
                        translation_query,
                        trend_data.career_id,
                        language_code,
                        translation.get('market_insights', ''),
                        translation.get('salary_trend', ''),
                        translation.get('industry_impact', ''),
                        translation.get('future_outlook', '')
                    )
                    
                    logger.info(f"Saved trend translation for {trend_data.career_id} in {language_code}")
                
        except Exception as e:
            logger.error(f"Failed to save trend translations for {trend_data.career_id}: {e}")
    
    async def update_industry_trends(self):
        """Update industry-level trend summaries"""
        try:
            async with self.db_pool.acquire() as conn:
                # Get all industries
                industries_query = "SELECT DISTINCT industry FROM careers"
                industries = await conn.fetch(industries_query)
                
                current_month = datetime.now().strftime('%Y-%m')
                
                for industry_row in industries:
                    industry = industry_row['industry']
                    
                    # Get trend data for this industry
                    trend_query = """
                    SELECT 
                        COUNT(*) as total_careers,
                        AVG(trend_score) as avg_trend_score,
                        COUNT(CASE WHEN trend_direction = 'rising' THEN 1 END) as rising_careers,
                        COUNT(CASE WHEN trend_direction = 'stable' THEN 1 END) as stable_careers,
                        COUNT(CASE WHEN trend_direction = 'declining' THEN 1 END) as declining_careers,
                        ARRAY_AGG(career_id ORDER BY trend_score DESC LIMIT 5) as top_trending_careers,
                        ARRAY_AGG(DISTINCT unnest(key_skills_trending)) as emerging_skills
                    FROM career_trends ct
                    JOIN careers c ON c.id = ct.career_id
                    WHERE c.industry = $1 AND ct.last_updated >= NOW() - INTERVAL '1 month'
                    """
                    
                    trend_data = await conn.fetchrow(trend_query, industry)
                    
                    if trend_data and trend_data['total_careers'] > 0:
                        # Insert or update industry trend
                        industry_query = """
                        INSERT INTO industry_trends (
                            industry, month_year, avg_trend_score, total_careers,
                            rising_careers, stable_careers, declining_careers,
                            top_trending_careers, emerging_skills
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        ON CONFLICT (industry, month_year) DO UPDATE SET
                            avg_trend_score = EXCLUDED.avg_trend_score,
                            total_careers = EXCLUDED.total_careers,
                            rising_careers = EXCLUDED.rising_careers,
                            stable_careers = EXCLUDED.stable_careers,
                            declining_careers = EXCLUDED.declining_careers,
                            top_trending_careers = EXCLUDED.top_trending_careers,
                            emerging_skills = EXCLUDED.emerging_skills,
                            updated_at = NOW()
                        """
                        
                        await conn.execute(
                            industry_query,
                            industry,
                            current_month,
                            float(trend_data['avg_trend_score']),
                            trend_data['total_careers'],
                            trend_data['rising_careers'],
                            trend_data['stable_careers'],
                            trend_data['declining_careers'],
                            trend_data['top_trending_careers'],
                            trend_data['emerging_skills']
                        )
                        
                        logger.info(f"Updated industry trends for {industry}")
                
        except Exception as e:
            logger.error(f"Failed to update industry trends: {e}")
    
    async def run_monthly_update(self):
        """Run the complete monthly update process"""
        start_time = time.time()
        current_month = datetime.now().strftime('%Y-%m')
        
        logger.info(f"Starting monthly trend update for {current_month}")
        
        try:
            # Create update log entry
            async with self.db_pool.acquire() as conn:
                log_query = """
                INSERT INTO trend_update_log (
                    update_month, status, start_time, total_careers
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
                """
                
                log_id = await conn.fetchval(
                    log_query,
                    current_month,
                    'started',
                    datetime.now(),
                    0  # Will update later
                )
            
            # Get careers to update
            careers = await self.get_careers_to_update()
            
            if not careers:
                logger.info("No careers need updating")
                return
            
            # Update log with total count
            async with self.db_pool.acquire() as conn:
                await conn.execute(
                    "UPDATE trend_update_log SET total_careers = $1 WHERE id = $2",
                    len(careers), log_id
                )
            
            # Process careers
            successful_updates = 0
            failed_updates = 0
            errors = []
            
            for i, career in enumerate(careers):
                try:
                    logger.info(f"Processing career {i+1}/{len(careers)}: {career['title']}")
                    
                    # Analyze trend
                    trend_data = await self.analyze_career_trend(career)
                    
                    if trend_data:
                        # Save trend data
                        if await self.save_trend_data(trend_data):
                            successful_updates += 1
                        else:
                            failed_updates += 1
                            errors.append(f"Failed to save trend data for {career['id']}")
                    else:
                        failed_updates += 1
                        errors.append(f"Failed to analyze trend for {career['id']}")
                    
                    # Update progress
                    async with self.db_pool.acquire() as conn:
                        await conn.execute(
                            "UPDATE trend_update_log SET processed_careers = $1 WHERE id = $2",
                            i + 1, log_id
                        )
                    
                    # Rate limiting - wait between requests
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    failed_updates += 1
                    error_msg = f"Error processing {career['id']}: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)
            
            # Update industry trends
            await self.update_industry_trends()
            
            # Calculate final metrics
            end_time = time.time()
            duration_minutes = int((end_time - start_time) / 60)
            
            # Update log with final status
            async with self.db_pool.acquire() as conn:
                final_query = """
                UPDATE trend_update_log SET
                    status = $1,
                    successful_updates = $2,
                    failed_updates = $3,
                    errors = $4,
                    end_time = $5,
                    duration_minutes = $6
                WHERE id = $7
                """
                
                await conn.execute(
                    final_query,
                    'completed' if failed_updates == 0 else 'completed_with_errors',
                    successful_updates,
                    failed_updates,
                    json.dumps(errors),
                    datetime.now(),
                    duration_minutes,
                    log_id
                )
            
            logger.info(f"Monthly update completed: {successful_updates} successful, {failed_updates} failed")
            
        except Exception as e:
            logger.error(f"Monthly update failed: {e}")
            
            # Update log with error status
            try:
                async with self.db_pool.acquire() as conn:
                    await conn.execute(
                        "UPDATE trend_update_log SET status = 'failed', errors = $1 WHERE id = $2",
                        json.dumps([str(e)]), log_id
                    )
            except:
                pass

async def main():
    """Main function to run the monthly trend updater"""
    updater = MonthlyTrendUpdater()
    
    try:
        await updater.initialize()
        await updater.run_monthly_update()
    except Exception as e:
        logger.error(f"Failed to run monthly update: {e}")
    finally:
        await updater.cleanup()

if __name__ == "__main__":
    asyncio.run(main())
