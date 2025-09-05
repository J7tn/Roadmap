-- Career data tables for Supabase
-- This schema stores career information updated monthly by chat2api

-- Main careers table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_by TEXT DEFAULT 'chat2api'
);

-- Career search index for better performance
CREATE INDEX IF NOT EXISTS idx_careers_industry ON careers(industry);
CREATE INDEX IF NOT EXISTS idx_careers_level ON careers(level);
CREATE INDEX IF NOT EXISTS idx_careers_updated_at ON careers(updated_at);

-- Full-text search index (simplified to avoid immutability issues)
CREATE INDEX IF NOT EXISTS idx_careers_search ON careers USING gin(
    to_tsvector('english', title || ' ' || description)
);

-- Career update log table
CREATE TABLE IF NOT EXISTS career_update_log (
    id SERIAL PRIMARY KEY,
    update_type TEXT NOT NULL, -- 'monthly', 'manual', 'initial'
    careers_updated INTEGER NOT NULL,
    update_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    chat2api_version TEXT,
    notes TEXT
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_careers_updated_at 
    BEFORE UPDATE ON careers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_update_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access to careers (for the app)
DROP POLICY IF EXISTS "Allow public read access to careers" ON careers;
CREATE POLICY "Allow public read access to careers" ON careers
    FOR SELECT USING (true);

-- Allow service role to manage careers (for chat2api)
DROP POLICY IF EXISTS "Allow service role to manage careers" ON careers;
CREATE POLICY "Allow service role to manage careers" ON careers
    FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access to update log
DROP POLICY IF EXISTS "Allow public read access to career_update_log" ON career_update_log;
CREATE POLICY "Allow public read access to career_update_log" ON career_update_log
    FOR SELECT USING (true);

-- Allow service role to manage update log
DROP POLICY IF EXISTS "Allow service role to manage career_update_log" ON career_update_log;
CREATE POLICY "Allow service role to manage career_update_log" ON career_update_log
    FOR ALL USING (auth.role() = 'service_role');

-- Insert some sample data
INSERT INTO careers (
    id, title, description, skills, salary, experience, level, industry, 
    job_titles, certifications, requirements
) VALUES 
(
    'ai-engineer',
    'AI Engineer',
    'Design, develop, and deploy artificial intelligence systems and machine learning models to solve complex business problems.',
    ARRAY['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Science'],
    '$90,000 - $150,000',
    '2-5 years',
    'I',
    'tech',
    ARRAY['AI Engineer', 'Machine Learning Engineer', 'AI Developer', 'ML Engineer', 'AI Research Engineer'],
    ARRAY['AWS Machine Learning', 'Google Cloud ML Engineer', 'Microsoft Azure AI Engineer'],
    '{"education": ["Bachelor''s in Computer Science", "Master''s in AI/ML", "Data Science Degree"], "experience": "2-5 years in software development or data science", "skills": ["Python", "Machine Learning", "Deep Learning", "Statistics"]}'
),
(
    'data-scientist',
    'Data Scientist',
    'Analyze complex data sets to extract insights and build predictive models for business decision-making.',
    ARRAY['Python', 'R', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization', 'Pandas', 'NumPy'],
    '$80,000 - $130,000',
    '2-5 years',
    'I',
    'tech',
    ARRAY['Data Scientist', 'Senior Data Scientist', 'Analytics Engineer', 'Research Scientist'],
    ARRAY['AWS Certified Data Analytics', 'Google Cloud Professional Data Engineer', 'Microsoft Certified: Azure Data Scientist'],
    '{"education": ["Master''s in Data Science", "Statistics", "Computer Science"], "experience": "2-5 years in data analysis or research", "skills": ["Statistics", "Machine Learning", "Python/R", "SQL"]}'
),
(
    'cybersecurity-analyst',
    'Cybersecurity Analyst',
    'Protect organizations from cyber threats by monitoring systems, analyzing security breaches, and implementing security measures.',
    ARRAY['Network Security', 'Incident Response', 'Risk Assessment', 'SIEM', 'Penetration Testing', 'Compliance', 'Firewall Management'],
    '$70,000 - $120,000',
    '1-4 years',
    'I',
    'tech',
    ARRAY['Cybersecurity Analyst', 'Security Analyst', 'Information Security Analyst', 'SOC Analyst'],
    ARRAY['CompTIA Security+', 'CISSP', 'CEH', 'GSEC'],
    '{"education": ["Bachelor''s in Cybersecurity", "Computer Science", "Information Technology"], "experience": "1-4 years in IT or security", "skills": ["Network Security", "Incident Response", "Risk Assessment"]}'
),
(
    'cloud-engineer',
    'Cloud Engineer',
    'Design, implement, and manage cloud infrastructure and services to support scalable applications and systems.',
    ARRAY['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Infrastructure as Code'],
    '$85,000 - $140,000',
    '2-5 years',
    'I',
    'tech',
    ARRAY['Cloud Engineer', 'DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
    ARRAY['AWS Solutions Architect', 'Azure Solutions Architect', 'Google Cloud Professional Cloud Architect'],
    '{"education": ["Bachelor''s in Computer Science", "Information Technology", "Cloud Computing"], "experience": "2-5 years in system administration or development", "skills": ["Cloud Platforms", "Containerization", "Infrastructure as Code"]}'
),
(
    'software-engineer',
    'Software Engineer',
    'Design, develop, and maintain software applications and systems using various programming languages and frameworks.',
    ARRAY['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'Agile Development'],
    '$70,000 - $130,000',
    '1-5 years',
    'I',
    'tech',
    ARRAY['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
    ARRAY['AWS Certified Developer', 'Microsoft Certified: Azure Developer', 'Google Cloud Professional Developer'],
    '{"education": ["Bachelor''s in Computer Science", "Software Engineering", "Bootcamp Certificate"], "experience": "1-5 years in software development", "skills": ["Programming Languages", "Frameworks", "Database Management"]}'
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial update log entry
INSERT INTO career_update_log (update_type, careers_updated, notes)
VALUES ('initial', 5, 'Initial career data setup')
ON CONFLICT DO NOTHING;

-- Trending data tables
CREATE TABLE IF NOT EXISTS trending_skills (
    id SERIAL PRIMARY KEY,
    skill TEXT NOT NULL,
    demand INTEGER NOT NULL CHECK (demand >= 0 AND demand <= 100),
    growth INTEGER NOT NULL,
    salary INTEGER,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_trending BOOLEAN DEFAULT true,
    is_declining BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS trending_industries (
    id SERIAL PRIMARY KEY,
    industry TEXT NOT NULL,
    growth INTEGER NOT NULL,
    job_count INTEGER NOT NULL,
    avg_salary INTEGER,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_trending BOOLEAN DEFAULT true,
    is_declining BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS emerging_roles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    growth INTEGER NOT NULL,
    skills TEXT[] NOT NULL,
    industry TEXT,
    salary_range TEXT,
    experience_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending data update log
CREATE TABLE IF NOT EXISTS trending_update_log (
    id SERIAL PRIMARY KEY,
    update_type TEXT NOT NULL, -- 'monthly', 'manual', 'initial'
    skills_updated INTEGER NOT NULL,
    industries_updated INTEGER NOT NULL,
    roles_updated INTEGER NOT NULL,
    update_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    chat2api_version TEXT,
    notes TEXT
);

-- Indexes for trending data
CREATE INDEX IF NOT EXISTS idx_trending_skills_category ON trending_skills(category);
CREATE INDEX IF NOT EXISTS idx_trending_skills_trending ON trending_skills(is_trending);
CREATE INDEX IF NOT EXISTS idx_trending_skills_declining ON trending_skills(is_declining);
CREATE INDEX IF NOT EXISTS idx_trending_industries_category ON trending_industries(category);
CREATE INDEX IF NOT EXISTS idx_trending_industries_trending ON trending_industries(is_trending);
CREATE INDEX IF NOT EXISTS idx_trending_industries_declining ON trending_industries(is_declining);
CREATE INDEX IF NOT EXISTS idx_emerging_roles_industry ON emerging_roles(industry);

-- Triggers for trending data
CREATE OR REPLACE TRIGGER update_trending_skills_updated_at 
    BEFORE UPDATE ON trending_skills 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_trending_industries_updated_at 
    BEFORE UPDATE ON trending_industries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_emerging_roles_updated_at 
    BEFORE UPDATE ON emerging_roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for trending data
ALTER TABLE trending_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE emerging_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_update_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trending data
DROP POLICY IF EXISTS "Allow public read access to trending_skills" ON trending_skills;
CREATE POLICY "Allow public read access to trending_skills" ON trending_skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to trending_industries" ON trending_industries;
CREATE POLICY "Allow public read access to trending_industries" ON trending_industries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to emerging_roles" ON emerging_roles;
CREATE POLICY "Allow public read access to emerging_roles" ON emerging_roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to trending_update_log" ON trending_update_log;
CREATE POLICY "Allow public read access to trending_update_log" ON trending_update_log
    FOR SELECT USING (true);

-- Allow service role to manage trending data
DROP POLICY IF EXISTS "Allow service role to manage trending_skills" ON trending_skills;
CREATE POLICY "Allow service role to manage trending_skills" ON trending_skills
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow service role to manage trending_industries" ON trending_industries;
CREATE POLICY "Allow service role to manage trending_industries" ON trending_industries
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow service role to manage emerging_roles" ON emerging_roles;
CREATE POLICY "Allow service role to manage emerging_roles" ON emerging_roles
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow service role to manage trending_update_log" ON trending_update_log;
CREATE POLICY "Allow service role to manage trending_update_log" ON trending_update_log
    FOR ALL USING (auth.role() = 'service_role');

-- Insert sample trending data
INSERT INTO trending_skills (skill, demand, growth, salary, category, is_trending, is_declining) VALUES
-- Trending Skills
('AI/ML', 95, 25, 120000, 'tech', true, false),
('Cybersecurity', 90, 20, 110000, 'tech', true, false),
('Cloud Computing', 85, 18, 105000, 'tech', true, false),
('Data Science', 88, 22, 115000, 'tech', true, false),
('DevOps', 82, 16, 100000, 'tech', true, false),
('Blockchain', 75, 15, 95000, 'tech', true, false),
('Quantum Computing', 60, 30, 130000, 'tech', true, false),
('Edge Computing', 70, 20, 90000, 'tech', true, false),

-- Declining Skills
('Flash Development', 15, -35, 45000, 'tech', false, true),
('Silverlight', 8, -45, 40000, 'tech', false, true),
('ColdFusion', 12, -25, 50000, 'tech', false, true),
('Perl', 20, -15, 60000, 'tech', false, true),
('VB.NET', 25, -10, 65000, 'tech', false, true),
('jQuery', 40, -5, 55000, 'tech', false, true)
ON CONFLICT DO NOTHING;

INSERT INTO trending_industries (industry, growth, job_count, avg_salary, category, is_trending, is_declining) VALUES
-- Trending Industries
('Technology', 15, 50000, 95000, 'tech', true, false),
('Healthcare', 12, 30000, 85000, 'healthcare', true, false),
('Finance', 8, 25000, 90000, 'finance', true, false),
('Manufacturing', 5, 20000, 75000, 'manufacturing', true, false),
('E-commerce', 18, 15000, 80000, 'business', true, false),
('Renewable Energy', 22, 8000, 85000, 'energy', true, false),
('Biotechnology', 16, 6000, 95000, 'science', true, false),
('Fintech', 20, 12000, 105000, 'finance', true, false),

-- Declining Industries
('Print Media', -12, 8000, 55000, 'media', false, true),
('Traditional Retail', -8, 15000, 45000, 'retail', false, true),
('Coal Mining', -15, 5000, 65000, 'energy', false, true),
('Telemarketing', -20, 3000, 35000, 'business', false, true),
('Video Rental', -25, 500, 30000, 'entertainment', false, true),
('Newspaper Publishing', -18, 2000, 50000, 'media', false, true)
ON CONFLICT DO NOTHING;

INSERT INTO emerging_roles (title, description, growth, skills, industry, salary_range, experience_level) VALUES
('AI Engineer', 'Build and deploy AI models', 30, ARRAY['Python', 'TensorFlow', 'ML'], 'tech', '$90,000 - $150,000', '2-5 years'),
('DevOps Engineer', 'Automate deployment processes', 25, ARRAY['Docker', 'Kubernetes', 'CI/CD'], 'tech', '$85,000 - $140,000', '2-5 years'),
('Data Engineer', 'Build data pipelines and infrastructure', 28, ARRAY['Python', 'SQL', 'Big Data'], 'tech', '$80,000 - $130,000', '2-5 years'),
('Security Engineer', 'Protect systems and data', 22, ARRAY['Cybersecurity', 'Networking', 'Incident Response'], 'tech', '$75,000 - $130,000', '2-5 years'),
('Cloud Architect', 'Design cloud infrastructure', 26, ARRAY['AWS', 'Azure', 'Architecture'], 'tech', '$100,000 - $160,000', '5+ years'),
('MLOps Engineer', 'Deploy and maintain ML systems', 32, ARRAY['ML', 'DevOps', 'Cloud'], 'tech', '$95,000 - $155,000', '3-6 years'),
('Quantum Software Engineer', 'Develop quantum computing applications', 40, ARRAY['Quantum Computing', 'Python', 'Physics'], 'tech', '$120,000 - $200,000', '3-7 years'),
('Sustainability Analyst', 'Analyze environmental impact', 18, ARRAY['Data Analysis', 'Environmental Science', 'Reporting'], 'science', '$60,000 - $90,000', '1-4 years')
ON CONFLICT DO NOTHING;

-- Insert initial trending update log entry
INSERT INTO trending_update_log (update_type, skills_updated, industries_updated, roles_updated, notes)
VALUES ('initial', 14, 14, 8, 'Initial trending data setup')
ON CONFLICT DO NOTHING;
