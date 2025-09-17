-- Career Database Schema for Multi-Language Support
-- This schema creates language-specific tables for career data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create career_paths table (language-agnostic structure)
CREATE TABLE IF NOT EXISTS career_paths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    industry TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_nodes table (language-agnostic structure)
CREATE TABLE IF NOT EXISTS career_nodes (
    id TEXT PRIMARY KEY,
    career_path_id TEXT NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('E', 'I', 'A', 'X')),
    salary_range TEXT,
    time_to_achieve TEXT,
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create language-specific career node translations table
CREATE TABLE IF NOT EXISTS career_node_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_node_id TEXT NOT NULL REFERENCES career_nodes(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'ja', 'ko', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    job_titles JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_node_id, language_code)
);

-- Create language-specific career path translations table
CREATE TABLE IF NOT EXISTS career_path_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_path_id TEXT NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'ja', 'ko', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar')),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_path_id, language_code)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_career_nodes_path_id ON career_nodes(career_path_id);
CREATE INDEX IF NOT EXISTS idx_career_nodes_level ON career_nodes(level);
CREATE INDEX IF NOT EXISTS idx_career_node_translations_node_id ON career_node_translations(career_node_id);
CREATE INDEX IF NOT EXISTS idx_career_node_translations_language ON career_node_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_career_path_translations_path_id ON career_path_translations(career_path_id);
CREATE INDEX IF NOT EXISTS idx_career_path_translations_language ON career_path_translations(language_code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_career_paths_updated_at BEFORE UPDATE ON career_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_nodes_updated_at BEFORE UPDATE ON career_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_node_translations_updated_at BEFORE UPDATE ON career_node_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_path_translations_updated_at BEFORE UPDATE ON career_path_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_node_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_path_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to career_paths" ON career_paths
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to career_nodes" ON career_nodes
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to career_node_translations" ON career_node_translations
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to career_path_translations" ON career_path_translations
    FOR SELECT USING (true);

-- Create policies for service role (for monthly updates)
CREATE POLICY "Allow service role full access to career_paths" ON career_paths
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to career_nodes" ON career_nodes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to career_node_translations" ON career_node_translations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to career_path_translations" ON career_path_translations
    FOR ALL USING (auth.role() = 'service_role');

-- Insert sample data for testing
INSERT INTO career_paths (id, name, category, industry, description) VALUES
('software-development', 'Software Development', 'tech', 'technology', 'Career path for software development roles'),
('healthcare-nursing', 'Nursing Career Path', 'healthcare', 'healthcare', 'Career path for nursing and healthcare roles'),
('business-management', 'Business Management', 'business', 'business', 'Career path for business management roles')
ON CONFLICT (id) DO NOTHING;

-- Insert sample career nodes
INSERT INTO career_nodes (id, career_path_id, level, salary_range, time_to_achieve, requirements) VALUES
('junior-dev', 'software-development', 'E', '$50,000 - $70,000', '0-2 years', '{"education": ["Bachelor''s in Computer Science", "Bootcamp Certificate"], "experience": "0-2 years", "skills": ["Programming Fundamentals", "Version Control", "Basic Testing"]}'),
('mid-dev', 'software-development', 'I', '$70,000 - $100,000', '2-5 years', '{"education": ["Bachelor''s Degree", "Relevant Certifications"], "experience": "2-5 years", "skills": ["Framework Expertise", "API Development", "Testing", "Mentorship"]}'),
('senior-dev', 'software-development', 'A', '$100,000 - $150,000', '5+ years', '{"education": ["Bachelor''s Degree", "Advanced Certifications"], "experience": "5+ years", "skills": ["System Architecture", "Team Leadership", "Performance Optimization"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample English translations
INSERT INTO career_node_translations (career_node_id, language_code, title, description, skills, certifications, job_titles) VALUES
('junior-dev', 'en', 'Junior Developer', 'Entry-level position focused on building and maintaining websites under supervision.', '["JavaScript", "HTML/CSS", "Git", "Basic Algorithms", "SQL"]', '["AWS Certified Cloud Practitioner", "Scrum Foundation"]', '["Junior Software Engineer", "Associate Developer", "Code Apprentice"]'),
('mid-dev', 'en', 'Mid-Level Developer', 'Builds complex web applications and mentors junior developers.', '["React/Vue/Angular", "Node.js", "API Integration", "Testing", "Database Design"]', '["AWS Certified Developer", "Microsoft Certified: JavaScript Developer"]', '["Software Engineer", "Full Stack Developer", "Web Developer"]'),
('senior-dev', 'en', 'Senior Developer', 'Leads development teams and makes high-level architectural decisions.', '["System Architecture", "Performance Optimization", "Team Leadership", "DevOps", "Code Review"]', '["Google Professional Cloud Developer", "AWS Solutions Architect"]', '["Senior Software Engineer", "Lead Developer", "Technical Lead"]')
ON CONFLICT (career_node_id, language_code) DO NOTHING;

-- Insert sample career path translations
INSERT INTO career_path_translations (career_path_id, language_code, name, description) VALUES
('software-development', 'en', 'Software Development', 'Career path for software development roles'),
('healthcare-nursing', 'en', 'Nursing Career Path', 'Career path for nursing and healthcare roles'),
('business-management', 'en', 'Business Management', 'Career path for business management roles')
ON CONFLICT (career_path_id, language_code) DO NOTHING;

-- Create view for easy querying with translations
CREATE OR REPLACE VIEW career_nodes_with_translations AS
SELECT 
    cn.id,
    cn.career_path_id,
    cn.level,
    cn.salary_range,
    cn.time_to_achieve,
    cn.requirements,
    cnt.language_code,
    cnt.title,
    cnt.description,
    cnt.skills,
    cnt.certifications,
    cnt.job_titles,
    cp.name as path_name,
    cp.category,
    cp.industry
FROM career_nodes cn
JOIN career_node_translations cnt ON cn.id = cnt.career_node_id
JOIN career_paths cp ON cn.career_path_id = cp.id;

-- Grant permissions
GRANT SELECT ON career_paths TO anon, authenticated;
GRANT SELECT ON career_nodes TO anon, authenticated;
GRANT SELECT ON career_node_translations TO anon, authenticated;
GRANT SELECT ON career_path_translations TO anon, authenticated;
GRANT SELECT ON career_nodes_with_translations TO anon, authenticated;

-- Grant full access to service role
GRANT ALL ON career_paths TO service_role;
GRANT ALL ON career_nodes TO service_role;
GRANT ALL ON career_node_translations TO service_role;
GRANT ALL ON career_path_translations TO service_role;
