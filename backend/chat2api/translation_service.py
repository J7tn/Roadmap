#!/usr/bin/env python3
"""
Translation Service for chat2api
Handles automatic translation of career data and trends for all 11 supported languages
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
import aiohttp
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('translation_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class TranslationRequest:
    """Data structure for translation requests"""
    text: str
    target_language: str
    source_language: str = "en"
    context: str = "career_data"

class TranslationService:
    """Service for translating career data and trends"""
    
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.supported_languages = {
            'en': 'English',
            'es': 'Spanish', 
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ru': 'Russian',
            'ar': 'Arabic'
        }
        self.session = None
        
    async def initialize(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession()
        logger.info("Translation service initialized")
        
    async def cleanup(self):
        """Clean up resources"""
        if self.session:
            await self.session.close()
            
    async def translate_text(self, text: str, target_language: str, context: str = "career_data") -> Optional[str]:
        """Translate a single text using OpenAI"""
        if not self.openai_api_key:
            logger.warning("No OpenAI API key available, skipping translation")
            return None
            
        if target_language == 'en':
            return text  # No translation needed for English
            
        try:
            # Create context-aware prompt for better translations
            context_prompts = {
                "career_data": "You are a professional translator specializing in career and job market terminology.",
                "trend_data": "You are a professional translator specializing in business and market analysis terminology.",
                "skill_data": "You are a professional translator specializing in technical and professional skills terminology."
            }
            
            system_prompt = context_prompts.get(context, context_prompts["career_data"])
            
            prompt = f"""
            {system_prompt}
            
            Translate the following text from English to {self.supported_languages[target_language]}.
            Maintain professional terminology and ensure the translation is accurate for the career/job market context.
            Return only the translated text, no explanations or additional text.
            
            Text to translate: {text}
            """
            
            async with self.session.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 500
                }
            ) as response:
                
                if response.status != 200:
                    logger.error(f"Translation request failed: {response.status}")
                    return None
                
                result = await response.json()
                translated_text = result['choices'][0]['message']['content'].strip()
                
                # Remove quotes if the AI wrapped the translation in quotes
                if translated_text.startswith('"') and translated_text.endswith('"'):
                    translated_text = translated_text[1:-1]
                
                return translated_text
                
        except Exception as e:
            logger.error(f"Failed to translate text to {target_language}: {e}")
            return None
    
    async def translate_career_data(self, career_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Translate career data for all supported languages"""
        translations = {}
        
        # Fields that need translation
        translatable_fields = [
            'title', 'description', 'skills', 'jobTitles', 'certifications'
        ]
        
        for language_code, language_name in self.supported_languages.items():
            if language_code == 'en':
                # English is the source, no translation needed
                translations[language_code] = {
                    'title': career_data.get('title', ''),
                    'description': career_data.get('description', ''),
                    'skills': career_data.get('skills', []),
                    'jobTitles': career_data.get('jobTitles', []),
                    'certifications': career_data.get('certifications', [])
                }
                continue
                
            logger.info(f"Translating career data to {language_name} ({language_code})")
            
            translation = {}
            
            # Translate title
            if 'title' in career_data:
                translated_title = await self.translate_text(
                    career_data['title'], 
                    language_code, 
                    'career_data'
                )
                translation['title'] = translated_title or career_data['title']
            
            # Translate description
            if 'description' in career_data:
                translated_description = await self.translate_text(
                    career_data['description'], 
                    language_code, 
                    'career_data'
                )
                translation['description'] = translated_description or career_data['description']
            
            # Translate skills array
            if 'skills' in career_data:
                translated_skills = []
                for skill in career_data['skills']:
                    translated_skill = await self.translate_text(
                        skill, 
                        language_code, 
                        'skill_data'
                    )
                    translated_skills.append(translated_skill or skill)
                translation['skills'] = translated_skills
            
            # Translate job titles array
            if 'jobTitles' in career_data:
                translated_job_titles = []
                for job_title in career_data['jobTitles']:
                    translated_job_title = await self.translate_text(
                        job_title, 
                        language_code, 
                        'career_data'
                    )
                    translated_job_titles.append(translated_job_title or job_title)
                translation['jobTitles'] = translated_job_titles
            
            # Translate certifications array
            if 'certifications' in career_data:
                translated_certifications = []
                for cert in career_data['certifications']:
                    translated_cert = await self.translate_text(
                        cert, 
                        language_code, 
                        'career_data'
                    )
                    translated_certifications.append(translated_cert or cert)
                translation['certifications'] = translated_certifications
            
            translations[language_code] = translation
            
            # Rate limiting - wait between language translations
            await asyncio.sleep(1)
        
        return translations
    
    async def translate_trend_data(self, trend_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Translate trend data for all supported languages"""
        translations = {}
        
        # Fields that need translation in trend data
        translatable_fields = [
            'market_insights', 'salary_trend', 'industry_impact', 'future_outlook'
        ]
        
        for language_code, language_name in self.supported_languages.items():
            if language_code == 'en':
                # English is the source, no translation needed
                translations[language_code] = {
                    'market_insights': trend_data.get('market_insights', ''),
                    'salary_trend': trend_data.get('salary_trend', ''),
                    'industry_impact': trend_data.get('industry_impact', ''),
                    'future_outlook': trend_data.get('future_outlook', '')
                }
                continue
                
            logger.info(f"Translating trend data to {language_name} ({language_code})")
            
            translation = {}
            
            # Translate market insights
            if 'market_insights' in trend_data:
                translated_insights = await self.translate_text(
                    trend_data['market_insights'], 
                    language_code, 
                    'trend_data'
                )
                translation['market_insights'] = translated_insights or trend_data['market_insights']
            
            # Translate salary trend
            if 'salary_trend' in trend_data:
                translated_salary_trend = await self.translate_text(
                    trend_data['salary_trend'], 
                    language_code, 
                    'trend_data'
                )
                translation['salary_trend'] = translated_salary_trend or trend_data['salary_trend']
            
            # Translate industry impact
            if 'industry_impact' in trend_data:
                translated_impact = await self.translate_text(
                    trend_data['industry_impact'], 
                    language_code, 
                    'trend_data'
                )
                translation['industry_impact'] = translated_impact or trend_data['industry_impact']
            
            # Translate future outlook
            if 'future_outlook' in trend_data:
                translated_outlook = await self.translate_text(
                    trend_data['future_outlook'], 
                    language_code, 
                    'trend_data'
                )
                translation['future_outlook'] = translated_outlook or trend_data['future_outlook']
            
            translations[language_code] = translation
            
            # Rate limiting - wait between language translations
            await asyncio.sleep(1)
        
        return translations
    
    async def batch_translate_careers(self, careers_data: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Translate multiple careers for all languages"""
        all_translations = {}
        
        for language_code in self.supported_languages.keys():
            all_translations[language_code] = []
        
        for i, career in enumerate(careers_data):
            logger.info(f"Translating career {i+1}/{len(careers_data)}: {career.get('title', 'Unknown')}")
            
            career_translations = await self.translate_career_data(career)
            
            for language_code, translation in career_translations.items():
                # Add non-translatable fields
                full_translation = {
                    'id': career.get('id', ''),
                    'level': career.get('level', ''),
                    'industry': career.get('industry', ''),
                    'salary': career.get('salary', ''),
                    'experience': career.get('experience', ''),
                    'requirements': career.get('requirements', {}),
                    **translation
                }
                all_translations[language_code].append(full_translation)
            
            # Rate limiting - wait between careers
            await asyncio.sleep(2)
        
        return all_translations
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return self.supported_languages.copy()
    
    def is_language_supported(self, language_code: str) -> bool:
        """Check if a language is supported"""
        return language_code in self.supported_languages

# Global translation service instance
translation_service = TranslationService()
