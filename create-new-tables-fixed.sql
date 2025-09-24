-- Create new organized tables for careers and industries (Fixed version)
-- Run this in your Supabase SQL editor

-- 1. Industries table (master reference)
CREATE TABLE IF NOT EXISTS industries_new (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon TEXT,
    job_count INTEGER DEFAULT 0,
    avg_salary TEXT,
    growth_rate TEXT,
    global_demand TEXT,
    top_countries TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Industry translations table
CREATE TABLE IF NOT EXISTS industry_translations (
    industry_id TEXT NOT NULL REFERENCES industries_new(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (industry_id, language_code)
);

-- 3. Careers table (simplified)
CREATE TABLE IF NOT EXISTS careers_new (
    id TEXT PRIMARY KEY,
    industry_id TEXT NOT NULL REFERENCES industries_new(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('E', 'I', 'A', 'X')),
    salary_range TEXT,
    experience_required TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Career content table (all translatable content)
CREATE TABLE IF NOT EXISTS career_content (
    career_id TEXT NOT NULL REFERENCES careers_new(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    job_titles TEXT[] NOT NULL,
    certifications TEXT[] NOT NULL,
    requirements JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (career_id, language_code)
);

-- 5. Career trends (updated to reference new careers table)
CREATE TABLE IF NOT EXISTS career_trends_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id TEXT NOT NULL REFERENCES careers_new(id) ON DELETE CASCADE,
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
    data_source TEXT DEFAULT 'chat2api',
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 10),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_update_due TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_industries_new_id ON industries_new(id);
CREATE INDEX IF NOT EXISTS idx_industry_translations_lang ON industry_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_careers_new_industry ON careers_new(industry_id);
CREATE INDEX IF NOT EXISTS idx_careers_new_level ON careers_new(level);
CREATE INDEX IF NOT EXISTS idx_career_content_lang ON career_content(language_code);
CREATE INDEX IF NOT EXISTS idx_career_content_career ON career_content(career_id);
CREATE INDEX IF NOT EXISTS idx_career_trends_new_career ON career_trends_new(career_id);

-- Enable RLS (Row Level Security)
ALTER TABLE industries_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_trends_new ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to industries_new" ON industries_new;
DROP POLICY IF EXISTS "Allow public read access to industry_translations" ON industry_translations;
DROP POLICY IF EXISTS "Allow public read access to careers_new" ON careers_new;
DROP POLICY IF EXISTS "Allow public read access to career_content" ON career_content;
DROP POLICY IF EXISTS "Allow public read access to career_trends_new" ON career_trends_new;

CREATE POLICY "Allow public read access to industries_new" ON industries_new FOR SELECT USING (true);
CREATE POLICY "Allow public read access to industry_translations" ON industry_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to careers_new" ON careers_new FOR SELECT USING (true);
CREATE POLICY "Allow public read access to career_content" ON career_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to career_trends_new" ON career_trends_new FOR SELECT USING (true);

-- Create RLS policies for service role management (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Allow service role to manage industries_new" ON industries_new;
DROP POLICY IF EXISTS "Allow service role to manage industry_translations" ON industry_translations;
DROP POLICY IF EXISTS "Allow service role to manage careers_new" ON careers_new;
DROP POLICY IF EXISTS "Allow service role to manage career_content" ON career_content;
DROP POLICY IF EXISTS "Allow service role to manage career_trends_new" ON career_trends_new;

CREATE POLICY "Allow service role to manage industries_new" ON industries_new FOR ALL USING ((select auth.role()) = 'service_role');
CREATE POLICY "Allow service role to manage industry_translations" ON industry_translations FOR ALL USING ((select auth.role()) = 'service_role');
CREATE POLICY "Allow service role to manage careers_new" ON careers_new FOR ALL USING ((select auth.role()) = 'service_role');
CREATE POLICY "Allow service role to manage career_content" ON career_content FOR ALL USING ((select auth.role()) = 'service_role');
CREATE POLICY "Allow service role to manage career_trends_new" ON career_trends_new FOR ALL USING ((select auth.role()) = 'service_role');

-- Create triggers for updated_at timestamps (drop existing first to avoid conflicts)
DROP TRIGGER IF EXISTS update_industries_new_updated_at ON industries_new;
DROP TRIGGER IF EXISTS update_industry_translations_updated_at ON industry_translations;
DROP TRIGGER IF EXISTS update_careers_new_updated_at ON careers_new;
DROP TRIGGER IF EXISTS update_career_content_updated_at ON career_content;
DROP TRIGGER IF EXISTS update_career_trends_new_updated_at ON career_trends_new;

-- Create or replace the function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_industries_new_updated_at 
    BEFORE UPDATE ON industries_new 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_industry_translations_updated_at 
    BEFORE UPDATE ON industry_translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_new_updated_at 
    BEFORE UPDATE ON careers_new 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_content_updated_at 
    BEFORE UPDATE ON career_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_trends_new_updated_at 
    BEFORE UPDATE ON career_trends_new 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
