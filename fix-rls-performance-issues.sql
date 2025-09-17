-- Fix RLS Performance Issues
-- This script addresses the Supabase linter warnings for RLS performance optimization

-- 1. Fix Auth RLS Initialization Plan Issues
-- Replace auth.<function>() with (select auth.<function>()) to prevent re-evaluation for each row

-- Fix careers table RLS policy
DROP POLICY IF EXISTS "careers_access_policy" ON public.careers;
CREATE POLICY "careers_access_policy" ON public.careers
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix career_update_log table RLS policy
DROP POLICY IF EXISTS "career_update_log_access_policy" ON public.career_update_log;
CREATE POLICY "career_update_log_access_policy" ON public.career_update_log
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix emerging_roles table RLS policy
DROP POLICY IF EXISTS "emerging_roles_access_policy" ON public.emerging_roles;
CREATE POLICY "emerging_roles_access_policy" ON public.emerging_roles
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix industries table RLS policy
DROP POLICY IF EXISTS "industries_access_policy" ON public.industries;
CREATE POLICY "industries_access_policy" ON public.industries
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix jobs table RLS policy
DROP POLICY IF EXISTS "jobs_access_policy" ON public.jobs;
CREATE POLICY "jobs_access_policy" ON public.jobs
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix market_trends table RLS policy
DROP POLICY IF EXISTS "market_trends_access_policy" ON public.market_trends;
CREATE POLICY "market_trends_access_policy" ON public.market_trends
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix roles table RLS policy
DROP POLICY IF EXISTS "roles_access_policy" ON public.roles;
CREATE POLICY "roles_access_policy" ON public.roles
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix career_trends table RLS policy
DROP POLICY IF EXISTS "career_trends_access_policy" ON public.career_trends;
CREATE POLICY "career_trends_access_policy" ON public.career_trends
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix career_trend_history table RLS policy
DROP POLICY IF EXISTS "career_trend_history_access_policy" ON public.career_trend_history;
CREATE POLICY "career_trend_history_access_policy" ON public.career_trend_history
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix industry_trends table RLS policy
DROP POLICY IF EXISTS "industry_trends_access_policy" ON public.industry_trends;
CREATE POLICY "industry_trends_access_policy" ON public.industry_trends
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix trend_update_log table RLS policy
DROP POLICY IF EXISTS "trend_update_log_access_policy" ON public.trend_update_log;
CREATE POLICY "trend_update_log_access_policy" ON public.trend_update_log
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix skills table RLS policy
DROP POLICY IF EXISTS "skills_access_policy" ON public.skills;
CREATE POLICY "skills_access_policy" ON public.skills
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix trending_industries table RLS policy
DROP POLICY IF EXISTS "trending_industries_access_policy" ON public.trending_industries;
CREATE POLICY "trending_industries_access_policy" ON public.trending_industries
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix trending_skills table RLS policy
DROP POLICY IF EXISTS "trending_skills_access_policy" ON public.trending_skills;
CREATE POLICY "trending_skills_access_policy" ON public.trending_skills
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Fix trending_update_log table RLS policy
DROP POLICY IF EXISTS "trending_update_log_access_policy" ON public.trending_update_log;
CREATE POLICY "trending_update_log_access_policy" ON public.trending_update_log
FOR ALL USING (
  (select auth.role()) = 'service_role' OR
  (select auth.role()) = 'anon' OR
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- 2. Remove Duplicate Permissive Policies
-- The linter detected multiple permissive policies for the same role and action
-- We'll keep only the comprehensive access policies and remove the redundant ones

-- Remove duplicate policies from career_update_log
DROP POLICY IF EXISTS "Allow service role to manage career_update_log" ON public.career_update_log;
DROP POLICY IF EXISTS "Allow public read access to career_update_log" ON public.career_update_log;

-- Remove duplicate policies from careers
DROP POLICY IF EXISTS "Allow service role to manage careers" ON public.careers;
DROP POLICY IF EXISTS "Allow public read access to careers" ON public.careers;

-- Remove duplicate policies from emerging_roles
DROP POLICY IF EXISTS "Allow service role to manage emerging_roles" ON public.emerging_roles;
DROP POLICY IF EXISTS "Allow public read access to emerging_roles" ON public.emerging_roles;

-- Remove duplicate policies from trending_industries
DROP POLICY IF EXISTS "Allow service role to manage trending_industries" ON public.trending_industries;
DROP POLICY IF EXISTS "Allow public read access to trending_industries" ON public.trending_industries;

-- Remove duplicate policies from trending_skills
DROP POLICY IF EXISTS "Allow service role to manage trending_skills" ON public.trending_skills;
DROP POLICY IF EXISTS "Allow public read access to trending_skills" ON public.trending_skills;

-- Remove duplicate policies from trending_update_log
DROP POLICY IF EXISTS "Allow service role to manage trending_update_log" ON public.trending_update_log;
DROP POLICY IF EXISTS "Allow public read access to trending_update_log" ON public.trending_update_log;

-- 3. Create Optimized Policies for Public Read Access
-- Create separate, optimized policies for public read access where needed

-- Public read access for careers (optimized)
CREATE POLICY "careers_public_read" ON public.careers
FOR SELECT USING (true);

-- Public read access for emerging_roles (optimized)
CREATE POLICY "emerging_roles_public_read" ON public.emerging_roles
FOR SELECT USING (true);

-- Public read access for trending_industries (optimized)
CREATE POLICY "trending_industries_public_read" ON public.trending_industries
FOR SELECT USING (true);

-- Public read access for trending_skills (optimized)
CREATE POLICY "trending_skills_public_read" ON public.trending_skills
FOR SELECT USING (true);

-- Public read access for career_update_log (optimized)
CREATE POLICY "career_update_log_public_read" ON public.career_update_log
FOR SELECT USING (true);

-- Public read access for trending_update_log (optimized)
CREATE POLICY "trending_update_log_public_read" ON public.trending_update_log
FOR SELECT USING (true);

-- 4. Create Service Role Policies for Full Access
-- Create separate policies for service role with full access

-- Service role full access for careers
CREATE POLICY "careers_service_full_access" ON public.careers
FOR ALL USING ((select auth.role()) = 'service_role');

-- Service role full access for career_update_log
CREATE POLICY "career_update_log_service_full_access" ON public.career_update_log
FOR ALL USING ((select auth.role()) = 'service_role');

-- Service role full access for emerging_roles
CREATE POLICY "emerging_roles_service_full_access" ON public.emerging_roles
FOR ALL USING ((select auth.role()) = 'service_role');

-- Service role full access for trending_industries
CREATE POLICY "trending_industries_service_full_access" ON public.trending_industries
FOR ALL USING ((select auth.role()) = 'service_role');

-- Service role full access for trending_skills
CREATE POLICY "trending_skills_service_full_access" ON public.trending_skills
FOR ALL USING ((select auth.role()) = 'service_role');

-- Service role full access for trending_update_log
CREATE POLICY "trending_update_log_service_full_access" ON public.trending_update_log
FOR ALL USING ((select auth.role()) = 'service_role');

-- 5. Update remaining tables with optimized policies
-- Update other tables that don't need public read access

-- Update industries table (no public read needed)
DROP POLICY IF EXISTS "industries_access_policy" ON public.industries;
CREATE POLICY "industries_service_access" ON public.industries
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update jobs table (no public read needed)
DROP POLICY IF EXISTS "jobs_access_policy" ON public.jobs;
CREATE POLICY "jobs_service_access" ON public.jobs
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update market_trends table (no public read needed)
DROP POLICY IF EXISTS "market_trends_access_policy" ON public.market_trends;
CREATE POLICY "market_trends_service_access" ON public.market_trends
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update roles table (no public read needed)
DROP POLICY IF EXISTS "roles_access_policy" ON public.roles;
CREATE POLICY "roles_service_access" ON public.roles
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update career_trends table (no public read needed)
DROP POLICY IF EXISTS "career_trends_access_policy" ON public.career_trends;
CREATE POLICY "career_trends_service_access" ON public.career_trends
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update career_trend_history table (no public read needed)
DROP POLICY IF EXISTS "career_trend_history_access_policy" ON public.career_trend_history;
CREATE POLICY "career_trend_history_service_access" ON public.career_trend_history
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update industry_trends table (no public read needed)
DROP POLICY IF EXISTS "industry_trends_access_policy" ON public.industry_trends;
CREATE POLICY "industry_trends_service_access" ON public.industry_trends
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update trend_update_log table (no public read needed)
DROP POLICY IF EXISTS "trend_update_log_access_policy" ON public.trend_update_log;
CREATE POLICY "trend_update_log_service_access" ON public.trend_update_log
FOR ALL USING ((select auth.role()) = 'service_role');

-- Update skills table (no public read needed)
DROP POLICY IF EXISTS "skills_access_policy" ON public.skills;
CREATE POLICY "skills_service_access" ON public.skills
FOR ALL USING ((select auth.role()) = 'service_role');

-- 6. Verify RLS is enabled on all tables
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_update_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emerging_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_trend_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_update_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_update_log ENABLE ROW LEVEL SECURITY;

-- 7. Create indexes for better performance (if not already exist)
-- These indexes will help with query performance

CREATE INDEX IF NOT EXISTS idx_careers_industry ON public.careers(industry);
CREATE INDEX IF NOT EXISTS idx_careers_level ON public.careers(level);
CREATE INDEX IF NOT EXISTS idx_careers_updated_at ON public.careers(updated_at);
CREATE INDEX IF NOT EXISTS idx_career_trends_career_id ON public.career_trends(career_id);
CREATE INDEX IF NOT EXISTS idx_career_trends_updated_at ON public.career_trends(updated_at);
CREATE INDEX IF NOT EXISTS idx_trending_skills_updated_at ON public.trending_skills(updated_at);
CREATE INDEX IF NOT EXISTS idx_trending_industries_updated_at ON public.trending_industries(updated_at);
CREATE INDEX IF NOT EXISTS idx_emerging_roles_updated_at ON public.emerging_roles(updated_at);

-- 8. Add comments for documentation
COMMENT ON POLICY "careers_public_read" ON public.careers IS 'Optimized public read access for careers table';
COMMENT ON POLICY "careers_service_full_access" ON public.careers IS 'Service role full access for careers table';
COMMENT ON POLICY "emerging_roles_public_read" ON public.emerging_roles IS 'Optimized public read access for emerging_roles table';
COMMENT ON POLICY "emerging_roles_service_full_access" ON public.emerging_roles IS 'Service role full access for emerging_roles table';
COMMENT ON POLICY "trending_industries_public_read" ON public.trending_industries IS 'Optimized public read access for trending_industries table';
COMMENT ON POLICY "trending_industries_service_full_access" ON public.trending_industries IS 'Service role full access for trending_industries table';
COMMENT ON POLICY "trending_skills_public_read" ON public.trending_skills IS 'Optimized public read access for trending_skills table';
COMMENT ON POLICY "trending_skills_service_full_access" ON public.trending_skills IS 'Service role full access for trending_skills table';

-- Success message
SELECT 'RLS Performance Optimization Complete!' as status;
