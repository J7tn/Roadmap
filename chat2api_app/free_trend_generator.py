#!/usr/bin/env python3
"""
Free Career Trend Generator
Generates realistic career trend data without requiring external API keys
"""

import random
import json
from datetime import datetime
from typing import Dict, List, Any

class FreeTrendGenerator:
    """Generates realistic career trend data using industry knowledge"""
    
    def __init__(self):
        # Industry-specific trend patterns
        self.industry_trends = {
            'tech': {
                'base_score': 8.5,
                'growth_rate': 15.0,
                'trending_skills': ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Python'],
                'top_locations': ['San Francisco', 'Seattle', 'Austin', 'New York', 'Boston'],
                'remote_work': 8.5,
                'automation_risk': 3.0
            },
            'healthcare': {
                'base_score': 8.0,
                'growth_rate': 12.0,
                'trending_skills': ['Telemedicine', 'Data Analytics', 'AI Diagnostics', 'Patient Care', 'Medical Technology'],
                'top_locations': ['Boston', 'Philadelphia', 'Cleveland', 'Rochester', 'Baltimore'],
                'remote_work': 4.0,
                'automation_risk': 2.0
            },
            'finance': {
                'base_score': 7.5,
                'growth_rate': 8.0,
                'trending_skills': ['Fintech', 'Blockchain', 'Risk Management', 'Data Science', 'Regulatory Compliance'],
                'top_locations': ['New York', 'Chicago', 'San Francisco', 'Boston', 'Charlotte'],
                'remote_work': 6.0,
                'automation_risk': 4.5
            },
            'education': {
                'base_score': 7.0,
                'growth_rate': 6.0,
                'trending_skills': ['EdTech', 'Online Learning', 'Data Analytics', 'Student Success', 'Curriculum Design'],
                'top_locations': ['Boston', 'New York', 'Los Angeles', 'Chicago', 'Washington DC'],
                'remote_work': 7.0,
                'automation_risk': 3.5
            },
            'manufacturing': {
                'base_score': 6.5,
                'growth_rate': 5.0,
                'trending_skills': ['Automation', 'IoT', 'Quality Control', 'Supply Chain', 'Lean Manufacturing'],
                'top_locations': ['Detroit', 'Cleveland', 'Milwaukee', 'Indianapolis', 'Grand Rapids'],
                'remote_work': 2.0,
                'automation_risk': 6.0
            },
            'agriculture': {
                'base_score': 6.0,
                'growth_rate': 4.0,
                'trending_skills': ['Precision Agriculture', 'Drones', 'Data Analytics', 'Sustainability', 'Crop Science'],
                'top_locations': ['Fresno', 'Bakersfield', 'Modesto', 'Stockton', 'Visalia'],
                'remote_work': 1.0,
                'automation_risk': 5.0
            }
        }
        
        # Career level multipliers
        self.level_multipliers = {
            'E': 0.8,  # Entry level
            'I': 1.0,  # Intermediate
            'A': 1.2,  # Advanced
            'X': 1.4   # Expert
        }
        
        # Market insights templates
        self.insights_templates = {
            'tech': [
                "The technology sector continues to experience rapid growth with increasing demand for AI and cloud computing professionals.",
                "Digital transformation across industries is driving unprecedented demand for tech talent.",
                "Remote work adoption has expanded the talent pool and increased competition for top tech roles."
            ],
            'healthcare': [
                "Healthcare technology integration is creating new opportunities for tech-savvy healthcare professionals.",
                "Aging population and increased healthcare needs are driving steady job growth.",
                "Telemedicine and digital health solutions are reshaping the healthcare landscape."
            ],
            'finance': [
                "Fintech innovation is disrupting traditional banking and creating new career opportunities.",
                "Regulatory changes and digital transformation are reshaping the financial services industry.",
                "Data analytics and risk management skills are increasingly valuable in finance."
            ]
        }
    
    def generate_trend_data(self, career: Dict[str, Any]) -> Dict[str, Any]:
        """Generate realistic trend data for a career"""
        
        # Extract career information
        title = career.get('title', 'Unknown')
        industry = career.get('industry', 'tech')
        level = career.get('level', 'I')
        
        # Get industry-specific data
        industry_data = self.industry_trends.get(industry, self.industry_trends['tech'])
        level_multiplier = self.level_multipliers.get(level, 1.0)
        
        # Generate trend score with some randomness
        base_score = industry_data['base_score']
        trend_score = min(10.0, max(0.0, base_score + random.uniform(-1.0, 1.0)))
        
        # Determine trend direction
        if trend_score >= 8.0:
            trend_direction = 'rising'
        elif trend_score >= 6.0:
            trend_direction = 'stable'
        else:
            trend_direction = 'declining'
        
        # Generate demand level
        if trend_score >= 8.0:
            demand_level = 'high'
        elif trend_score >= 6.0:
            demand_level = 'medium'
        else:
            demand_level = 'low'
        
        # Generate growth rate
        base_growth = industry_data['growth_rate']
        growth_rate = max(0.0, base_growth + random.uniform(-3.0, 3.0))
        
        # Generate market insights
        insights = self._generate_insights(title, industry, trend_score)
        
        # Generate trending skills
        trending_skills = industry_data['trending_skills'].copy()
        random.shuffle(trending_skills)
        trending_skills = trending_skills[:random.randint(3, 5)]
        
        # Generate salary trend
        salary_trend = self._generate_salary_trend(trend_score, level)
        
        # Generate job availability score
        job_availability = min(10.0, max(0.0, trend_score + random.uniform(-1.0, 1.0)))
        
        # Generate top locations
        top_locations = industry_data['top_locations'].copy()
        random.shuffle(top_locations)
        top_locations = top_locations[:random.randint(3, 5)]
        
        # Generate remote work trend
        remote_work = industry_data['remote_work'] + random.uniform(-1.0, 1.0)
        remote_work = min(10.0, max(0.0, remote_work))
        
        # Generate automation risk
        automation_risk = industry_data['automation_risk'] + random.uniform(-0.5, 0.5)
        automation_risk = min(10.0, max(0.0, automation_risk))
        
        # Generate future outlook
        future_outlook = self._generate_future_outlook(title, industry, trend_score)
        
        return {
            'trend_score': round(trend_score, 1),
            'trend_direction': trend_direction,
            'demand_level': demand_level,
            'growth_rate': round(growth_rate, 1),
            'market_insights': insights,
            'key_skills_trending': trending_skills,
            'salary_trend': salary_trend,
            'job_availability_score': round(job_availability, 1),
            'top_locations': top_locations,
            'remote_work_trend': round(remote_work, 1),
            'automation_risk_score': round(automation_risk, 1),
            'future_outlook': future_outlook,
            'confidence_score': round(random.uniform(7.0, 9.5), 1)
        }
    
    def _generate_insights(self, title: str, industry: str, trend_score: float) -> str:
        """Generate market insights based on career and industry"""
        
        # Get industry-specific insights
        industry_insights = self.insights_templates.get(industry, self.insights_templates['tech'])
        
        # Select a base insight
        base_insight = random.choice(industry_insights)
        
        # Add career-specific context
        if 'engineer' in title.lower():
            context = " Engineering roles are particularly in demand with strong technical skills being highly valued."
        elif 'analyst' in title.lower():
            context = " Data-driven decision making is increasing the importance of analytical roles."
        elif 'manager' in title.lower():
            context = " Leadership and management skills are becoming increasingly important in this field."
        else:
            context = " Specialized skills and experience are key differentiators in this competitive market."
        
        return base_insight + context
    
    def _generate_salary_trend(self, trend_score: float, level: str) -> str:
        """Generate salary trend description"""
        
        if trend_score >= 8.0:
            if level in ['A', 'X']:
                return "Significant salary increases expected, especially for senior roles"
            else:
                return "Strong salary growth with competitive compensation packages"
        elif trend_score >= 6.0:
            return "Moderate salary growth with stable compensation trends"
        else:
            return "Salary growth may be limited, focus on skill development"
    
    def _generate_future_outlook(self, title: str, industry: str, trend_score: float) -> str:
        """Generate future outlook for the career"""
        
        if trend_score >= 8.0:
            outlook = "Excellent long-term prospects with strong growth potential. "
        elif trend_score >= 6.0:
            outlook = "Positive outlook with steady growth expected. "
        else:
            outlook = "Challenging market conditions, focus on skill differentiation. "
        
        # Add industry-specific outlook
        if industry == 'tech':
            outlook += "Technology continues to evolve rapidly, creating new opportunities."
        elif industry == 'healthcare':
            outlook += "Healthcare sector remains stable with growing demand for specialized roles."
        elif industry == 'finance':
            outlook += "Financial services are adapting to digital transformation and regulatory changes."
        else:
            outlook += "Industry trends suggest continued evolution and adaptation."
        
        return outlook

# Global instance
free_trend_generator = FreeTrendGenerator()
