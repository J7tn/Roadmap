-- Comprehensive Career Database Schema for Supabase
-- This schema supports a complete career database with smart caching for mobile performance

-- Main careers table with comprehensive data
CREATE TABLE IF NOT EXISTS careers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    salary TEXT NOT NULL,
    experience TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('E', 'I', 'A', 'X')),
    industry TEXT NOT NULL,
    job_titles TEXT[] NOT NULL,
    certifications TEXT[] NOT NULL,
    requirements JSONB NOT NULL,
    career_path_id TEXT NOT NULL,
    career_path_name TEXT NOT NULL,
    career_path_category TEXT NOT NULL,
    -- Performance optimization fields
    search_vector tsvector,
    skill_vector tsvector,
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_by TEXT DEFAULT 'comprehensive-database'
);

-- Career paths table for organizing careers
CREATE TABLE IF NOT EXISTS career_paths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    total_careers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User career preferences and search history for smart caching
CREATE TABLE IF NOT EXISTS user_career_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    preferred_industries TEXT[] DEFAULT '{}',
    experience_level TEXT,
    target_level TEXT,
    skills TEXT[] DEFAULT '{}',
    search_history TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smart cache table for mobile performance
CREATE TABLE IF NOT EXISTS career_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT UNIQUE NOT NULL,
    user_id TEXT,
    cache_type TEXT NOT NULL CHECK (cache_type IN ('search', 'recommendations', 'industry', 'skills')),
    cached_data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career transitions and relationships
CREATE TABLE IF NOT EXISTS career_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_career_id TEXT NOT NULL REFERENCES careers(id),
    to_career_id TEXT NOT NULL REFERENCES careers(id),
    transition_type TEXT NOT NULL CHECK (transition_type IN ('lateral', 'promotion', 'skill_based', 'industry_change')),
    difficulty_score INTEGER CHECK (difficulty_score BETWEEN 1 AND 10),
    common_skills TEXT[] DEFAULT '{}',
    skill_gaps TEXT[] DEFAULT '{}',
    estimated_time_months INTEGER,
    success_rate DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_careers_industry ON careers(industry);
CREATE INDEX IF NOT EXISTS idx_careers_level ON careers(level);
CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(career_path_category);
CREATE INDEX IF NOT EXISTS idx_careers_updated_at ON careers(updated_at);
CREATE INDEX IF NOT EXISTS idx_careers_search_vector ON careers USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_careers_skill_vector ON careers USING gin(skill_vector);

-- Cache performance indexes
CREATE INDEX IF NOT EXISTS idx_cache_key ON career_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_user_id ON career_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_cache_type ON career_cache(cache_type);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON career_cache(expires_at);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_career_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_industries ON user_career_preferences USING gin(preferred_industries);

-- Career transitions indexes
CREATE INDEX IF NOT EXISTS idx_transitions_from ON career_transitions(from_career_id);
CREATE INDEX IF NOT EXISTS idx_transitions_to ON career_transitions(to_career_id);
CREATE INDEX IF NOT EXISTS idx_transitions_type ON career_transitions(transition_type);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_careers_title_search ON careers USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_careers_description_search ON careers USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_careers_skills_search ON careers USING gin(to_tsvector('english', array_to_string(skills, ' ')));

-- Functions for smart caching
CREATE OR REPLACE FUNCTION update_career_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' || 
        COALESCE(array_to_string(NEW.job_titles, ' '), '') || ' ' ||
        COALESCE(NEW.industry, '') || ' ' ||
        COALESCE(NEW.career_path_name, '')
    );
    
    NEW.skill_vector := to_tsvector('english', 
        COALESCE(array_to_string(NEW.skills, ' '), '')
    );
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update search vectors
CREATE OR REPLACE TRIGGER update_careers_search_vector 
    BEFORE INSERT OR UPDATE ON careers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_career_search_vector();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM career_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ language 'plpgsql';

-- Function to get smart career recommendations
CREATE OR REPLACE FUNCTION get_smart_career_recommendations(
    p_user_id TEXT,
    p_industries TEXT[] DEFAULT NULL,
    p_experience_level TEXT DEFAULT NULL,
    p_skills TEXT[] DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    career_id TEXT,
    title TEXT,
    level TEXT,
    industry TEXT,
    match_score DECIMAL,
    match_reasons TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH user_prefs AS (
        SELECT 
            COALESCE(p_industries, preferred_industries) as industries,
            COALESCE(p_experience_level, experience_level) as exp_level,
            COALESCE(p_skills, skills) as user_skills
        FROM user_career_preferences 
        WHERE user_id = p_user_id
        LIMIT 1
    ),
    career_matches AS (
        SELECT 
            c.id,
            c.title,
            c.level,
            c.industry,
            -- Calculate match score based on multiple factors
            (
                CASE WHEN c.industry = ANY(up.industries) THEN 3.0 ELSE 0.0 END +
                CASE WHEN c.level = up.exp_level THEN 2.0 
                     WHEN (up.exp_level = 'E' AND c.level = 'I') THEN 1.5
                     WHEN (up.exp_level = 'I' AND c.level = 'A') THEN 1.5
                     WHEN (up.exp_level = 'A' AND c.level = 'X') THEN 1.5
                     ELSE 0.0 END +
                (SELECT COUNT(*)::DECIMAL / GREATEST(array_length(c.skills, 1), 1) 
                 FROM unnest(c.skills) as skill 
                 WHERE skill = ANY(up.user_skills)) * 2.0
            ) as score,
            ARRAY[
                CASE WHEN c.industry = ANY(up.industries) THEN 'Industry match' END,
                CASE WHEN c.level = up.exp_level THEN 'Level match' 
                     WHEN (up.exp_level = 'E' AND c.level = 'I') THEN 'Next level up'
                     WHEN (up.exp_level = 'I' AND c.level = 'A') THEN 'Next level up'
                     WHEN (up.exp_level = 'A' AND c.level = 'X') THEN 'Next level up'
                     END,
                CASE WHEN EXISTS(SELECT 1 FROM unnest(c.skills) as skill WHERE skill = ANY(up.user_skills)) 
                     THEN 'Skill match' END
            ] as reasons
        FROM careers c, user_prefs up
        WHERE c.skills && up.user_skills OR c.industry = ANY(up.industries)
    )
    SELECT 
        cm.id::TEXT,
        cm.title,
        cm.level,
        cm.industry,
        cm.score,
        array_remove(cm.reasons, NULL)
    FROM career_matches cm
    WHERE cm.score > 0
    ORDER BY cm.score DESC, cm.title
    LIMIT p_limit;
END;
$$ language 'plpgsql';

-- RLS (Row Level Security) policies
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_career_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_transitions ENABLE ROW LEVEL SECURITY;

-- Public read access for careers and career paths
CREATE POLICY "Careers are publicly readable" ON careers FOR SELECT USING (true);
CREATE POLICY "Career paths are publicly readable" ON career_paths FOR SELECT USING (true);
CREATE POLICY "Career transitions are publicly readable" ON career_transitions FOR SELECT USING (true);

-- User-specific policies for preferences and cache
CREATE POLICY "Users can manage their own preferences" ON user_career_preferences 
    FOR ALL USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can manage their own cache" ON career_cache 
    FOR ALL USING (user_id = current_setting('app.current_user_id', true) OR user_id IS NULL);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE OR REPLACE TRIGGER update_careers_updated_at 
    BEFORE UPDATE ON careers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_career_paths_updated_at 
    BEFORE UPDATE ON career_paths 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial career paths
INSERT INTO career_paths (id, name, category, description) VALUES
('software-development', 'Software Development', 'tech', 'Technology careers in software development and programming'),
('engineering-careers', 'Engineering', 'engineering', 'Various engineering disciplines and specializations'),
('healthcare-careers', 'Healthcare', 'healthcare', 'Medical and healthcare professional careers'),
('business-management', 'Business Management', 'business', 'Business leadership and management careers'),
('agriculture-careers', 'Agriculture', 'agriculture', 'Agricultural and farming career paths'),
('manufacturing-careers', 'Manufacturing', 'manufacturing', 'Production and manufacturing industry careers'),
('retail-careers', 'Retail', 'retail', 'Retail sales and store management careers'),
('transportation-careers', 'Transportation', 'transportation', 'Transportation and logistics careers'),
('emergency-services-careers', 'Emergency Services', 'emergency-services', 'Public safety and emergency response careers')
ON CONFLICT (id) DO NOTHING;
