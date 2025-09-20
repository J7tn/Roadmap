"""
Monthly Scheduler for chat2api
Handles scheduled tasks like updating career data
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
import httpx
from supabase_career_service import supabase_career_service
from supabase_trending_service import supabase_trending_service
from translation_service import translation_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MonthlyScheduler:
    def __init__(self):
        self.running = False
        self.task = None

    async def start(self):
        """Start the monthly scheduler"""
        if self.running:
            logger.warning("Scheduler is already running")
            return

        self.running = True
        logger.info("Starting monthly scheduler")
        
        # Initialize translation service
        await translation_service.initialize()
        
        # Start the scheduler task
        self.task = asyncio.create_task(self._scheduler_loop())

    async def stop(self):
        """Stop the monthly scheduler"""
        if not self.running:
            return

        self.running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
        
        # Cleanup translation service
        await translation_service.cleanup()
        
        logger.info("Monthly scheduler stopped")

    async def _scheduler_loop(self):
        """Main scheduler loop"""
        while self.running:
            try:
                # Check if we should update careers
                if await supabase_career_service.should_update_careers():
                    await self._update_career_data()
                
                # Check if we should update trending data
                if await supabase_trending_service.should_update_trending_data():
                    await self._update_trending_data()
                
                # Wait for 24 hours before checking again
                await asyncio.sleep(24 * 60 * 60)  # 24 hours
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in scheduler loop: {str(e)}")
                # Wait 1 hour before retrying on error
                await asyncio.sleep(60 * 60)

    async def _update_career_data(self):
        """Update career data using AI-generated content"""
        try:
            logger.info("Starting monthly career data update")
            
            # Generate fresh career data using AI
            careers_data = await self._generate_career_data()
            
            # Translate career data for all languages
            logger.info("Translating career data for all supported languages...")
            translated_careers = await translation_service.batch_translate_careers(careers_data)
            
            # Update Supabase with translated data
            success = await supabase_career_service.update_career_data_with_translations(translated_careers, "monthly")
            
            if success:
                logger.info("Monthly career data update completed successfully")
            else:
                logger.error("Monthly career data update failed")
                
        except Exception as e:
            logger.error(f"Failed to update career data: {str(e)}")

    async def _generate_career_data(self) -> List[Dict[str, Any]]:
        """Generate fresh career data using AI"""
        try:
            # This would typically call OpenAI API to generate updated career data
            # For now, we'll use the existing sample data but in a real implementation,
            # this would use AI to generate current market data
            
            careers_data = [
                {
                    "id": "ai-engineer",
                    "title": "AI Engineer",
                    "description": "Design, develop, and deploy artificial intelligence systems and machine learning models to solve complex business problems. This role is experiencing rapid growth as AI becomes integral to business operations.",
                    "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning", "Natural Language Processing", "Computer Vision", "Data Science", "MLOps", "Cloud AI Services"],
                    "salary": "$95,000 - $160,000",  # Updated salary range
                    "experience": "2-5 years",
                    "level": "I",
                    "industry": "tech",
                    "jobTitles": ["AI Engineer", "Machine Learning Engineer", "AI Developer", "ML Engineer", "AI Research Engineer", "Generative AI Engineer"],
                    "certifications": ["AWS Machine Learning", "Google Cloud ML Engineer", "Microsoft Azure AI Engineer", "NVIDIA Deep Learning Institute"],
                    "requirements": {
                        "education": ["Bachelor's in Computer Science", "Master's in AI/ML", "Data Science Degree"],
                        "experience": "2-5 years in software development or data science",
                        "skills": ["Python", "Machine Learning", "Deep Learning", "Statistics", "MLOps"]
                    }
                },
                {
                    "id": "data-scientist",
                    "title": "Data Scientist",
                    "description": "Analyze complex data sets to extract insights and build predictive models for business decision-making. The role continues to evolve with new tools and methodologies.",
                    "skills": ["Python", "R", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Pandas", "NumPy", "Apache Spark", "Big Data Technologies"],
                    "salary": "$85,000 - $140,000",  # Updated salary range
                    "experience": "2-5 years",
                    "level": "I",
                    "industry": "tech",
                    "jobTitles": ["Data Scientist", "Senior Data Scientist", "Analytics Engineer", "Research Scientist", "ML Data Scientist"],
                    "certifications": ["AWS Certified Data Analytics", "Google Cloud Professional Data Engineer", "Microsoft Certified: Azure Data Scientist", "Certified Analytics Professional"],
                    "requirements": {
                        "education": ["Master's in Data Science", "Statistics", "Computer Science"],
                        "experience": "2-5 years in data analysis or research",
                        "skills": ["Statistics", "Machine Learning", "Python/R", "SQL", "Big Data"]
                    }
                },
                {
                    "id": "cybersecurity-analyst",
                    "title": "Cybersecurity Analyst",
                    "description": "Protect organizations from cyber threats by monitoring systems, analyzing security breaches, and implementing security measures. Critical role as cyber threats continue to evolve.",
                    "skills": ["Network Security", "Incident Response", "Risk Assessment", "SIEM", "Penetration Testing", "Compliance", "Firewall Management", "Zero Trust Architecture", "Cloud Security"],
                    "salary": "$75,000 - $130,000",  # Updated salary range
                    "experience": "1-4 years",
                    "level": "I",
                    "industry": "tech",
                    "jobTitles": ["Cybersecurity Analyst", "Security Analyst", "Information Security Analyst", "SOC Analyst", "Cloud Security Analyst"],
                    "certifications": ["CompTIA Security+", "CISSP", "CEH", "GSEC", "AWS Security Specialty", "Azure Security Engineer"],
                    "requirements": {
                        "education": ["Bachelor's in Cybersecurity", "Computer Science", "Information Technology"],
                        "experience": "1-4 years in IT or security",
                        "skills": ["Network Security", "Incident Response", "Risk Assessment", "Cloud Security"]
                    }
                },
                {
                    "id": "cloud-engineer",
                    "title": "Cloud Engineer",
                    "description": "Design, implement, and manage cloud infrastructure and services to support scalable applications and systems. Essential role as organizations continue cloud migration.",
                    "skills": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "CI/CD", "Infrastructure as Code", "Serverless", "Microservices"],
                    "salary": "$90,000 - $150,000",  # Updated salary range
                    "experience": "2-5 years",
                    "level": "I",
                    "industry": "tech",
                    "jobTitles": ["Cloud Engineer", "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer", "Platform Engineer"],
                    "certifications": ["AWS Solutions Architect", "Azure Solutions Architect", "Google Cloud Professional Cloud Architect", "Kubernetes Administrator"],
                    "requirements": {
                        "education": ["Bachelor's in Computer Science", "Information Technology", "Cloud Computing"],
                        "experience": "2-5 years in system administration or development",
                        "skills": ["Cloud Platforms", "Containerization", "Infrastructure as Code", "DevOps"]
                    }
                },
                {
                    "id": "software-engineer",
                    "title": "Software Engineer",
                    "description": "Design, develop, and maintain software applications and systems using various programming languages and frameworks. Core role in digital transformation.",
                    "skills": ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "Git", "Agile Development", "TypeScript", "Microservices"],
                    "salary": "$75,000 - $140,000",  # Updated salary range
                    "experience": "1-5 years",
                    "level": "I",
                    "industry": "tech",
                    "jobTitles": ["Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "Senior Software Engineer"],
                    "certifications": ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Google Cloud Professional Developer", "Oracle Java Certification"],
                    "requirements": {
                        "education": ["Bachelor's in Computer Science", "Software Engineering", "Bootcamp Certificate"],
                        "experience": "1-5 years in software development",
                        "skills": ["Programming Languages", "Frameworks", "Database Management", "Version Control"]
                    }
                }
            ]
            
            logger.info(f"Generated {len(careers_data)} career entries")
            return careers_data
            
        except Exception as e:
            logger.error(f"Failed to generate career data: {str(e)}")
            return []

    async def _update_trending_data(self):
        """Update trending data using AI-generated content"""
        try:
            logger.info("Starting monthly trending data update")
            
            # Generate fresh trending data using AI
            trending_data = await self._generate_trending_data()
            
            # Update Supabase
            success = await supabase_trending_service.update_trending_data(
                trending_data['trending_skills'],
                trending_data['trending_industries'], 
                trending_data['emerging_roles'],
                "monthly"
            )
            
            if success:
                logger.info("Monthly trending data update completed successfully")
            else:
                logger.error("Monthly trending data update failed")
                
        except Exception as e:
            logger.error(f"Failed to update trending data: {str(e)}")

    async def _generate_trending_data(self) -> Dict[str, List[Dict[str, Any]]]:
        """Generate fresh trending data using AI"""
        try:
            # This would typically call OpenAI API to generate updated trending data
            # For now, we'll use enhanced sample data but in a real implementation,
            # this would use AI to generate current market trends
            
            trending_skills = [
                # Trending Skills (updated with current market data)
                {'skill': 'AI/ML', 'demand': 97, 'growth': 28, 'salary': 125000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Cybersecurity', 'demand': 92, 'growth': 22, 'salary': 115000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Cloud Computing', 'demand': 88, 'growth': 20, 'salary': 110000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Data Science', 'demand': 90, 'growth': 25, 'salary': 120000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'DevOps', 'demand': 85, 'growth': 18, 'salary': 105000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Blockchain', 'demand': 78, 'growth': 18, 'salary': 100000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Quantum Computing', 'demand': 65, 'growth': 35, 'salary': 140000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Edge Computing', 'demand': 72, 'growth': 22, 'salary': 95000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'Generative AI', 'demand': 85, 'growth': 40, 'salary': 130000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'skill': 'MLOps', 'demand': 80, 'growth': 30, 'salary': 120000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                
                # Declining Skills (updated with current market data)
                {'skill': 'Flash Development', 'demand': 12, 'growth': -40, 'salary': 40000, 'category': 'tech', 'is_trending': False, 'is_declining': True},
                {'skill': 'Silverlight', 'demand': 5, 'growth': -50, 'salary': 35000, 'category': 'tech', 'is_trending': False, 'is_declining': True},
                {'skill': 'ColdFusion', 'demand': 10, 'growth': -30, 'salary': 45000, 'category': 'tech', 'is_trending': False, 'is_declining': True},
                {'skill': 'Perl', 'demand': 18, 'growth': -18, 'salary': 55000, 'category': 'tech', 'is_trending': False, 'is_declining': True},
                {'skill': 'VB.NET', 'demand': 22, 'growth': -12, 'salary': 60000, 'category': 'tech', 'is_trending': False, 'is_declining': True},
                {'skill': 'jQuery', 'demand': 35, 'growth': -8, 'salary': 50000, 'category': 'tech', 'is_trending': False, 'is_declining': True},
            ]
            
            trending_industries = [
                # Trending Industries (updated with current market data)
                {'industry': 'Technology', 'growth': 18, 'jobCount': 55000, 'avgSalary': 100000, 'category': 'tech', 'is_trending': True, 'is_declining': False},
                {'industry': 'Healthcare', 'growth': 15, 'jobCount': 35000, 'avgSalary': 90000, 'category': 'healthcare', 'is_trending': True, 'is_declining': False},
                {'industry': 'Finance', 'growth': 10, 'jobCount': 28000, 'avgSalary': 95000, 'category': 'finance', 'is_trending': True, 'is_declining': False},
                {'industry': 'Manufacturing', 'growth': 6, 'jobCount': 22000, 'avgSalary': 78000, 'category': 'manufacturing', 'is_trending': True, 'is_declining': False},
                {'industry': 'E-commerce', 'growth': 22, 'jobCount': 18000, 'avgSalary': 85000, 'category': 'business', 'is_trending': True, 'is_declining': False},
                {'industry': 'Renewable Energy', 'growth': 25, 'jobCount': 10000, 'avgSalary': 90000, 'category': 'energy', 'is_trending': True, 'is_declining': False},
                {'industry': 'Biotechnology', 'growth': 20, 'jobCount': 8000, 'avgSalary': 100000, 'category': 'science', 'is_trending': True, 'is_declining': False},
                {'industry': 'Fintech', 'growth': 24, 'jobCount': 15000, 'avgSalary': 110000, 'category': 'finance', 'is_trending': True, 'is_declining': False},
                
                # Declining Industries (updated with current market data)
                {'industry': 'Print Media', 'growth': -15, 'jobCount': 6000, 'avgSalary': 50000, 'category': 'media', 'is_trending': False, 'is_declining': True},
                {'industry': 'Traditional Retail', 'growth': -12, 'jobCount': 12000, 'avgSalary': 40000, 'category': 'retail', 'is_trending': False, 'is_declining': True},
                {'industry': 'Coal Mining', 'growth': -18, 'jobCount': 3000, 'avgSalary': 60000, 'category': 'energy', 'is_trending': False, 'is_declining': True},
                {'industry': 'Telemarketing', 'growth': -25, 'jobCount': 2000, 'avgSalary': 30000, 'category': 'business', 'is_trending': False, 'is_declining': True},
                {'industry': 'Video Rental', 'growth': -30, 'jobCount': 200, 'avgSalary': 25000, 'category': 'entertainment', 'is_trending': False, 'is_declining': True},
                {'industry': 'Newspaper Publishing', 'growth': -22, 'jobCount': 1500, 'avgSalary': 45000, 'category': 'media', 'is_trending': False, 'is_declining': True},
            ]
            
            emerging_roles = [
                {'title': 'AI Engineer', 'description': 'Build and deploy AI models for business applications', 'growth': 35, 'skills': ['Python', 'TensorFlow', 'ML', 'Generative AI'], 'industry': 'tech', 'salary_range': '$95,000 - $160,000', 'experience_level': '2-5 years'},
                {'title': 'DevOps Engineer', 'description': 'Automate deployment processes and infrastructure management', 'growth': 28, 'skills': ['Docker', 'Kubernetes', 'CI/CD', 'Cloud'], 'industry': 'tech', 'salary_range': '$90,000 - $145,000', 'experience_level': '2-5 years'},
                {'title': 'Data Engineer', 'description': 'Build data pipelines and infrastructure for analytics', 'growth': 32, 'skills': ['Python', 'SQL', 'Big Data', 'ETL'], 'industry': 'tech', 'salary_range': '$85,000 - $135,000', 'experience_level': '2-5 years'},
                {'title': 'Security Engineer', 'description': 'Protect systems and data from cyber threats', 'growth': 25, 'skills': ['Cybersecurity', 'Networking', 'Incident Response', 'Cloud Security'], 'industry': 'tech', 'salary_range': '$80,000 - $135,000', 'experience_level': '2-5 years'},
                {'title': 'Cloud Architect', 'description': 'Design scalable cloud infrastructure solutions', 'growth': 30, 'skills': ['AWS', 'Azure', 'Architecture', 'Microservices'], 'industry': 'tech', 'salary_range': '$105,000 - $170,000', 'experience_level': '5+ years'},
                {'title': 'MLOps Engineer', 'description': 'Deploy and maintain machine learning systems in production', 'growth': 38, 'skills': ['ML', 'DevOps', 'Cloud', 'Monitoring'], 'industry': 'tech', 'salary_range': '$100,000 - $160,000', 'experience_level': '3-6 years'},
                {'title': 'Quantum Software Engineer', 'description': 'Develop quantum computing applications and algorithms', 'growth': 45, 'skills': ['Quantum Computing', 'Python', 'Physics', 'Algorithms'], 'industry': 'tech', 'salary_range': '$130,000 - $220,000', 'experience_level': '3-7 years'},
                {'title': 'Sustainability Analyst', 'description': 'Analyze environmental impact and develop green solutions', 'growth': 22, 'skills': ['Data Analysis', 'Environmental Science', 'Reporting', 'ESG'], 'industry': 'science', 'salary_range': '$65,000 - $95,000', 'experience_level': '1-4 years'},
                {'title': 'Prompt Engineer', 'description': 'Design and optimize prompts for AI language models', 'growth': 50, 'skills': ['AI', 'Natural Language Processing', 'Creative Writing', 'Testing'], 'industry': 'tech', 'salary_range': '$80,000 - $140,000', 'experience_level': '1-3 years'},
                {'title': 'Digital Health Specialist', 'description': 'Develop and implement digital health solutions', 'growth': 28, 'skills': ['Healthcare', 'Digital Technology', 'Data Analysis', 'Compliance'], 'industry': 'healthcare', 'salary_range': '$70,000 - $120,000', 'experience_level': '2-5 years'},
            ]
            
            logger.info(f"Generated trending data: {len(trending_skills)} skills, {len(trending_industries)} industries, {len(emerging_roles)} roles")
            
            return {
                'trending_skills': trending_skills,
                'trending_industries': trending_industries,
                'emerging_roles': emerging_roles
            }
            
        except Exception as e:
            logger.error(f"Failed to generate trending data: {str(e)}")
            return {
                'trending_skills': [],
                'trending_industries': [],
                'emerging_roles': []
            }

    async def force_update(self):
        """Force an immediate career data update"""
        logger.info("Forcing immediate career data update")
        await self._update_career_data()

    async def force_trending_update(self):
        """Force an immediate trending data update"""
        logger.info("Forcing immediate trending data update")
        await self._update_trending_data()

# Global scheduler instance
monthly_scheduler = MonthlyScheduler()
