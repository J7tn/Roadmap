-- Complete database setup with RLS enabled for all tables
-- This script creates missing tables and enables RLS on all tables

-- Create skills table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    description TEXT,
    demand_level INTEGER CHECK (demand_level >= 0 AND demand_level <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create industries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.industries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    growth_rate DECIMAL(5,2),
    avg_salary INTEGER,
    job_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT CHECK (level IN ('E', 'I', 'A', 'X')),
    industry TEXT,
    salary_range TEXT,
    required_skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT,
    location TEXT,
    description TEXT,
    requirements TEXT,
    salary_range TEXT,
    employment_type TEXT,
    remote_allowed BOOLEAN DEFAULT false,
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_trends table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.market_trends (
    id SERIAL PRIMARY KEY,
    trend_type TEXT NOT NULL, -- 'skill', 'industry', 'role', 'technology'
    name TEXT NOT NULL,
    description TEXT,
    growth_percentage DECIMAL(5,2),
    demand_score INTEGER CHECK (demand_score >= 0 AND demand_score <= 100),
    salary_impact TEXT,
    timeframe TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_demand ON public.skills(demand_level);
CREATE INDEX IF NOT EXISTS idx_industries_growth ON public.industries(growth_rate);
CREATE INDEX IF NOT EXISTS idx_roles_level ON public.roles(level);
CREATE INDEX IF NOT EXISTS idx_roles_industry ON public.roles(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON public.jobs(posted_date);
CREATE INDEX IF NOT EXISTS idx_market_trends_type ON public.market_trends(trend_type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE OR REPLACE TRIGGER update_skills_updated_at 
    BEFORE UPDATE ON public.skills 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_industries_updated_at 
    BEFORE UPDATE ON public.industries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON public.roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON public.jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_market_trends_updated_at 
    BEFORE UPDATE ON public.market_trends 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for skills table
DROP POLICY IF EXISTS "Allow public read access to skills" ON public.skills;
CREATE POLICY "Allow public read access to skills" ON public.skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage skills" ON public.skills;
CREATE POLICY "Allow service role to manage skills" ON public.skills
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create RLS policies for industries table
DROP POLICY IF EXISTS "Allow public read access to industries" ON public.industries;
CREATE POLICY "Allow public read access to industries" ON public.industries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage industries" ON public.industries;
CREATE POLICY "Allow service role to manage industries" ON public.industries
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create RLS policies for roles table
DROP POLICY IF EXISTS "Allow public read access to roles" ON public.roles;
CREATE POLICY "Allow public read access to roles" ON public.roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage roles" ON public.roles;
CREATE POLICY "Allow service role to manage roles" ON public.roles
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create RLS policies for jobs table
DROP POLICY IF EXISTS "Allow public read access to jobs" ON public.jobs;
CREATE POLICY "Allow public read access to jobs" ON public.jobs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage jobs" ON public.jobs;
CREATE POLICY "Allow service role to manage jobs" ON public.jobs
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create RLS policies for market_trends table
DROP POLICY IF EXISTS "Allow public read access to market_trends" ON public.market_trends;
CREATE POLICY "Allow public read access to market_trends" ON public.market_trends
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage market_trends" ON public.market_trends;
CREATE POLICY "Allow service role to manage market_trends" ON public.market_trends
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Insert sample data for skills table
INSERT INTO public.skills (name, category, description, demand_level) VALUES
('Python', 'Programming', 'High-level programming language', 95),
('JavaScript', 'Programming', 'Web development language', 90),
('SQL', 'Database', 'Database query language', 85),
('Machine Learning', 'AI/ML', 'Artificial intelligence subset', 88),
('Cloud Computing', 'Infrastructure', 'Remote computing services', 82),
('Cybersecurity', 'Security', 'Information security practices', 87),
('Data Analysis', 'Analytics', 'Statistical data interpretation', 80),
('Project Management', 'Management', 'Planning and execution of projects', 75)
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for industries table
INSERT INTO public.industries (name, description, growth_rate, avg_salary, job_count) VALUES
('Technology', 'Software and hardware development', 15.5, 95000, 50000),
('Healthcare', 'Medical and health services', 12.3, 85000, 30000),
('Finance', 'Banking and financial services', 8.7, 90000, 25000),
('Manufacturing', 'Production and assembly', 5.2, 75000, 20000),
('Education', 'Teaching and educational services', 6.8, 65000, 18000),
('Retail', 'Consumer goods and services', 3.1, 45000, 35000),
('Energy', 'Power generation and distribution', 9.4, 80000, 12000),
('Transportation', 'Logistics and shipping', 7.6, 55000, 15000)
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for roles table
INSERT INTO public.roles (title, description, level, industry, salary_range, required_skills) VALUES
('Software Engineer', 'Develop software applications', 'I', 'Technology', '$70,000 - $130,000', ARRAY['Python', 'JavaScript', 'SQL']),
('Data Scientist', 'Analyze data for insights', 'I', 'Technology', '$80,000 - $130,000', ARRAY['Python', 'Machine Learning', 'Data Analysis']),
('Project Manager', 'Lead project execution', 'A', 'Technology', '$75,000 - $120,000', ARRAY['Project Management', 'Leadership']),
('Cybersecurity Analyst', 'Protect systems from threats', 'I', 'Technology', '$70,000 - $120,000', ARRAY['Cybersecurity', 'Network Security']),
('Cloud Engineer', 'Manage cloud infrastructure', 'I', 'Technology', '$85,000 - $140,000', ARRAY['Cloud Computing', 'DevOps']),
('Financial Analyst', 'Analyze financial data', 'I', 'Finance', '$60,000 - $100,000', ARRAY['Data Analysis', 'Financial Modeling']),
('Registered Nurse', 'Provide patient care', 'I', 'Healthcare', '$55,000 - $85,000', ARRAY['Patient Care', 'Medical Knowledge']),
('Operations Manager', 'Oversee daily operations', 'A', 'Manufacturing', '$65,000 - $110,000', ARRAY['Operations Management', 'Leadership'])
ON CONFLICT DO NOTHING;

-- Insert sample data for jobs table
INSERT INTO public.jobs (title, company, location, description, requirements, salary_range, employment_type, remote_allowed) VALUES
('Senior Software Engineer', 'Tech Corp', 'San Francisco, CA', 'Lead development of web applications', '5+ years experience, Python, React', '$120,000 - $160,000', 'Full-time', true),
('Data Analyst', 'Data Inc', 'New York, NY', 'Analyze business data and create reports', '2+ years experience, SQL, Excel', '$65,000 - $90,000', 'Full-time', true),
('Marketing Manager', 'Brand Co', 'Chicago, IL', 'Develop and execute marketing strategies', '3+ years experience, Digital Marketing', '$70,000 - $100,000', 'Full-time', false),
('DevOps Engineer', 'Cloud Systems', 'Austin, TX', 'Manage cloud infrastructure and deployments', '3+ years experience, AWS, Docker', '$90,000 - $130,000', 'Full-time', true),
('UX Designer', 'Design Studio', 'Seattle, WA', 'Create user-centered design solutions', '2+ years experience, Figma, User Research', '$75,000 - $110,000', 'Full-time', true)
ON CONFLICT DO NOTHING;

-- Insert sample data for market_trends table
INSERT INTO public.market_trends (trend_type, name, description, growth_percentage, demand_score, salary_impact, timeframe) VALUES
('skill', 'Artificial Intelligence', 'AI and machine learning technologies', 25.5, 95, 'High', '2024-2026'),
('skill', 'Cloud Computing', 'Remote computing and storage services', 18.2, 88, 'High', '2024-2026'),
('industry', 'Renewable Energy', 'Solar, wind, and other clean energy sectors', 22.1, 85, 'Medium', '2024-2026'),
('role', 'AI Engineer', 'Specialized engineers for AI systems', 30.8, 92, 'High', '2024-2026'),
('technology', 'Quantum Computing', 'Next-generation computing technology', 35.2, 78, 'Very High', '2025-2027'),
('skill', 'Cybersecurity', 'Information security and protection', 20.3, 90, 'High', '2024-2026'),
('industry', 'E-commerce', 'Online retail and digital commerce', 15.7, 82, 'Medium', '2024-2026'),
('role', 'Data Engineer', 'Specialists in data infrastructure', 28.4, 87, 'High', '2024-2026')
ON CONFLICT DO NOTHING;

-- Verify RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
