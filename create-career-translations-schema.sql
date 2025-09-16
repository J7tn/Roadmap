-- Career Translation Tables for Supabase
-- This schema stores translated career data for multiple languages

-- Career translations table for titles, descriptions, and other text content
CREATE TABLE IF NOT EXISTS career_translations (
    id SERIAL PRIMARY KEY,
    career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    job_titles TEXT[] NOT NULL,
    certifications TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_id, language_code)
);

-- Career trend translations table
CREATE TABLE IF NOT EXISTS career_trend_translations (
    id SERIAL PRIMARY KEY,
    career_trend_id INTEGER NOT NULL REFERENCES career_trends(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
    trend_description TEXT,
    market_insights TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_trend_id, language_code)
);

-- Industry translations table
CREATE TABLE IF NOT EXISTS industry_translations (
    id SERIAL PRIMARY KEY,
    industry_key TEXT NOT NULL,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
    industry_name TEXT NOT NULL,
    industry_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(industry_key, language_code)
);

-- Skill translations table
CREATE TABLE IF NOT EXISTS skill_translations (
    id SERIAL PRIMARY KEY,
    skill_key TEXT NOT NULL,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
    skill_name TEXT NOT NULL,
    skill_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_key, language_code)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_career_translations_career_id ON career_translations(career_id);
CREATE INDEX IF NOT EXISTS idx_career_translations_language ON career_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_career_trend_translations_trend_id ON career_trend_translations(career_trend_id);
CREATE INDEX IF NOT EXISTS idx_career_trend_translations_language ON career_trend_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_industry_translations_key ON industry_translations(industry_key);
CREATE INDEX IF NOT EXISTS idx_industry_translations_language ON industry_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_skill_translations_key ON skill_translations(skill_key);
CREATE INDEX IF NOT EXISTS idx_skill_translations_language ON skill_translations(language_code);

-- Enable RLS on all translation tables
ALTER TABLE career_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_trend_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for read access
CREATE POLICY "Allow read access to career_translations" ON career_translations
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to career_trend_translations" ON career_trend_translations
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to industry_translations" ON industry_translations
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to skill_translations" ON skill_translations
    FOR SELECT USING (true);

-- Create RLS policies for admin insert/update (using service role)
CREATE POLICY "Allow admin insert to career_translations" ON career_translations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update to career_translations" ON career_translations
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin insert to career_trend_translations" ON career_trend_translations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update to career_trend_translations" ON career_trend_translations
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin insert to industry_translations" ON industry_translations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update to industry_translations" ON industry_translations
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin insert to skill_translations" ON skill_translations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update to skill_translations" ON skill_translations
    FOR UPDATE USING (true);

-- Create triggers to update timestamps
CREATE TRIGGER update_career_translations_updated_at
    BEFORE UPDATE ON career_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_trend_translations_updated_at
    BEFORE UPDATE ON career_trend_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_industry_translations_updated_at
    BEFORE UPDATE ON industry_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_translations_updated_at
    BEFORE UPDATE ON skill_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial industry translations (English as base)
INSERT INTO industry_translations (industry_key, language_code, industry_name, industry_description) VALUES
('technology', 'en', 'Technology', 'Software development, IT services, and digital innovation'),
('healthcare', 'en', 'Healthcare', 'Medical services, pharmaceuticals, and health technology'),
('finance', 'en', 'Finance', 'Banking, investment, insurance, and financial services'),
('education', 'en', 'Education', 'Educational institutions, training, and learning technology'),
('marketing', 'en', 'Marketing', 'Digital marketing, advertising, and brand management'),
('consulting', 'en', 'Consulting', 'Business consulting, strategy, and advisory services'),
('manufacturing', 'en', 'Manufacturing', 'Production, engineering, and industrial operations'),
('retail', 'en', 'Retail', 'Consumer goods, e-commerce, and retail operations'),
('media', 'en', 'Media', 'Entertainment, journalism, and content creation'),
('government', 'en', 'Government', 'Public sector, policy, and administration')
ON CONFLICT (industry_key, language_code) DO NOTHING;

-- Insert initial skill translations (English as base)
INSERT INTO skill_translations (skill_key, language_code, skill_name, skill_category) VALUES
-- Technical Skills
('javascript', 'en', 'JavaScript', 'Programming'),
('python', 'en', 'Python', 'Programming'),
('react', 'en', 'React', 'Frontend'),
('nodejs', 'en', 'Node.js', 'Backend'),
('sql', 'en', 'SQL', 'Database'),
('aws', 'en', 'AWS', 'Cloud'),
('docker', 'en', 'Docker', 'DevOps'),
('git', 'en', 'Git', 'Version Control'),
('machine_learning', 'en', 'Machine Learning', 'AI/ML'),
('data_analysis', 'en', 'Data Analysis', 'Analytics'),
('project_management', 'en', 'Project Management', 'Management'),
('agile', 'en', 'Agile', 'Methodology'),
('ui_ux', 'en', 'UI/UX Design', 'Design'),
('communication', 'en', 'Communication', 'Soft Skills'),
('leadership', 'en', 'Leadership', 'Soft Skills'),
('problem_solving', 'en', 'Problem Solving', 'Soft Skills'),
('teamwork', 'en', 'Teamwork', 'Soft Skills'),
('analytical_thinking', 'en', 'Analytical Thinking', 'Soft Skills'),
('creativity', 'en', 'Creativity', 'Soft Skills'),
('adaptability', 'en', 'Adaptability', 'Soft Skills')
ON CONFLICT (skill_key, language_code) DO NOTHING;
