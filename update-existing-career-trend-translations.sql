-- =====================================================
-- Update Existing Career Trend Translations Table
-- =====================================================
-- This script adds missing columns to the existing career_trend_translations table

-- 1. Add missing columns to existing career_trend_translations table
ALTER TABLE public.career_trend_translations 
ADD COLUMN IF NOT EXISTS salary_trend TEXT,
ADD COLUMN IF NOT EXISTS industry_impact TEXT,
ADD COLUMN IF NOT EXISTS future_outlook TEXT,
ADD COLUMN IF NOT EXISTS key_skills_trending TEXT[],
ADD COLUMN IF NOT EXISTS top_locations TEXT[];

-- 2. Create industry_trend_translations table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.industry_trend_translations (
    id SERIAL PRIMARY KEY,
    industry TEXT NOT NULL,
    language_code TEXT NOT NULL,
    industry_insights TEXT NOT NULL,
    emerging_skills TEXT[] NOT NULL DEFAULT '{}',
    top_trending_careers TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(industry, language_code)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_career_trend_translations_career_trend_id ON public.career_trend_translations(career_trend_id);
CREATE INDEX IF NOT EXISTS idx_career_trend_translations_language ON public.career_trend_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_industry_trend_translations_industry ON public.industry_trend_translations(industry);
CREATE INDEX IF NOT EXISTS idx_industry_trend_translations_language ON public.industry_trend_translations(language_code);

-- 4. Enable RLS (if not already enabled)
ALTER TABLE public.career_trend_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_trend_translations ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies (if they don't exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.career_trend_translations;
CREATE POLICY "Enable read access for all users" ON public.career_trend_translations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.industry_trend_translations;
CREATE POLICY "Enable read access for all users" ON public.industry_trend_translations FOR SELECT USING (true);

-- 6. Grant permissions
GRANT SELECT ON public.career_trend_translations TO anon, authenticated;
GRANT SELECT ON public.industry_trend_translations TO anon, authenticated;
