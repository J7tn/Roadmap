-- Career Atlas Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  demand_percentage INTEGER NOT NULL CHECK (demand_percentage >= 0 AND demand_percentage <= 100),
  growth_rate DECIMAL(5,2) NOT NULL,
  avg_salary INTEGER NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industries table
CREATE TABLE IF NOT EXISTS industries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  growth_percentage DECIMAL(5,2) NOT NULL,
  job_count INTEGER NOT NULL,
  avg_salary INTEGER NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  growth_rate DECIMAL(5,2) NOT NULL,
  required_skills TEXT[] NOT NULL,
  avg_salary INTEGER NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  industry VARCHAR(255) NOT NULL,
  experience_level VARCHAR(100) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  posted_date DATE NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market trends table (for caching aggregated data)
CREATE TABLE IF NOT EXISTS market_trends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trend_type VARCHAR(50) NOT NULL CHECK (trend_type IN ('skills', 'industries', 'roles', 'jobs')),
  data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_demand ON skills(demand_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_skills_growth ON skills(growth_rate DESC);
CREATE INDEX IF NOT EXISTS idx_industries_growth ON industries(growth_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_roles_growth ON roles(growth_rate DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_trends_type ON market_trends(trend_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update last_updated automatically
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_trends_updated_at BEFORE UPDATE ON market_trends FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data to test
INSERT INTO skills (name, demand_percentage, growth_rate, avg_salary) VALUES
  ('AI/ML', 95, 25.5, 120000),
  ('Cybersecurity', 90, 20.3, 110000),
  ('Cloud Computing', 85, 18.7, 105000),
  ('Data Science', 88, 22.1, 115000),
  ('DevOps', 82, 16.9, 100000)
ON CONFLICT (name) DO NOTHING;

INSERT INTO industries (name, growth_percentage, job_count, avg_salary) VALUES
  ('Technology', 15.2, 50000, 95000),
  ('Healthcare', 12.8, 30000, 85000),
  ('Finance', 8.5, 25000, 90000),
  ('Manufacturing', 5.3, 20000, 75000)
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (title, description, growth_rate, required_skills, avg_salary) VALUES
  ('AI Engineer', 'Build and deploy AI models', 30.5, ARRAY['Python', 'TensorFlow', 'Machine Learning'], 120000),
  ('DevOps Engineer', 'Automate deployment processes', 25.8, ARRAY['Docker', 'Kubernetes', 'CI/CD'], 105000),
  ('Data Engineer', 'Build data pipelines and infrastructure', 28.2, ARRAY['Python', 'SQL', 'Big Data'], 110000)
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
