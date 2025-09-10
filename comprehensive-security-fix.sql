-- Comprehensive Security Fix for Supabase Database
-- This script addresses both RLS and function security issues

-- ==============================================
-- PART 1: Fix Function Security Issues
-- ==============================================

-- Drop and recreate the update_updated_at_column function with secure search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ==============================================
-- PART 2: Enable RLS on All Tables
-- ==============================================

-- Enable RLS on all tables that might exist
ALTER TABLE IF EXISTS public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.career_update_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trending_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trending_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.emerging_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trending_update_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.market_trends ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- PART 3: Create RLS Policies for All Tables
-- ==============================================

-- Policies for careers table
DROP POLICY IF EXISTS "Allow public read access to careers" ON public.careers;
CREATE POLICY "Allow public read access to careers" ON public.careers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage careers" ON public.careers;
CREATE POLICY "Allow service role to manage careers" ON public.careers
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for career_update_log table
DROP POLICY IF EXISTS "Allow public read access to career_update_log" ON public.career_update_log;
CREATE POLICY "Allow public read access to career_update_log" ON public.career_update_log
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage career_update_log" ON public.career_update_log;
CREATE POLICY "Allow service role to manage career_update_log" ON public.career_update_log
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for trending_skills table
DROP POLICY IF EXISTS "Allow public read access to trending_skills" ON public.trending_skills;
CREATE POLICY "Allow public read access to trending_skills" ON public.trending_skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage trending_skills" ON public.trending_skills;
CREATE POLICY "Allow service role to manage trending_skills" ON public.trending_skills
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for trending_industries table
DROP POLICY IF EXISTS "Allow public read access to trending_industries" ON public.trending_industries;
CREATE POLICY "Allow public read access to trending_industries" ON public.trending_industries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage trending_industries" ON public.trending_industries;
CREATE POLICY "Allow service role to manage trending_industries" ON public.trending_industries
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for emerging_roles table
DROP POLICY IF EXISTS "Allow public read access to emerging_roles" ON public.emerging_roles;
CREATE POLICY "Allow public read access to emerging_roles" ON public.emerging_roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage emerging_roles" ON public.emerging_roles;
CREATE POLICY "Allow service role to manage emerging_roles" ON public.emerging_roles
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for trending_update_log table
DROP POLICY IF EXISTS "Allow public read access to trending_update_log" ON public.trending_update_log;
CREATE POLICY "Allow public read access to trending_update_log" ON public.trending_update_log
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage trending_update_log" ON public.trending_update_log;
CREATE POLICY "Allow service role to manage trending_update_log" ON public.trending_update_log
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for skills table (if exists)
DROP POLICY IF EXISTS "Allow public read access to skills" ON public.skills;
CREATE POLICY "Allow public read access to skills" ON public.skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage skills" ON public.skills;
CREATE POLICY "Allow service role to manage skills" ON public.skills
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for industries table (if exists)
DROP POLICY IF EXISTS "Allow public read access to industries" ON public.industries;
CREATE POLICY "Allow public read access to industries" ON public.industries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage industries" ON public.industries;
CREATE POLICY "Allow service role to manage industries" ON public.industries
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for roles table (if exists)
DROP POLICY IF EXISTS "Allow public read access to roles" ON public.roles;
CREATE POLICY "Allow public read access to roles" ON public.roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage roles" ON public.roles;
CREATE POLICY "Allow service role to manage roles" ON public.roles
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for jobs table (if exists)
DROP POLICY IF EXISTS "Allow public read access to jobs" ON public.jobs;
CREATE POLICY "Allow public read access to jobs" ON public.jobs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage jobs" ON public.jobs;
CREATE POLICY "Allow service role to manage jobs" ON public.jobs
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Policies for market_trends table (if exists)
DROP POLICY IF EXISTS "Allow public read access to market_trends" ON public.market_trends;
CREATE POLICY "Allow public read access to market_trends" ON public.market_trends
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage market_trends" ON public.market_trends;
CREATE POLICY "Allow service role to manage market_trends" ON public.market_trends
    FOR ALL USING ((select auth.role()) = 'service_role');

-- ==============================================
-- PART 4: Recreate All Triggers with Secure Function
-- ==============================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_careers_updated_at ON public.careers;
DROP TRIGGER IF EXISTS update_trending_skills_updated_at ON public.trending_skills;
DROP TRIGGER IF EXISTS update_trending_industries_updated_at ON public.trending_industries;
DROP TRIGGER IF EXISTS update_emerging_roles_updated_at ON public.emerging_roles;
DROP TRIGGER IF EXISTS update_skills_updated_at ON public.skills;
DROP TRIGGER IF EXISTS update_industries_updated_at ON public.industries;
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
DROP TRIGGER IF EXISTS update_market_trends_updated_at ON public.market_trends;

-- Recreate triggers with the secure function
CREATE TRIGGER update_careers_updated_at 
    BEFORE UPDATE ON public.careers 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trending_skills_updated_at 
    BEFORE UPDATE ON public.trending_skills 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trending_industries_updated_at 
    BEFORE UPDATE ON public.trending_industries 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emerging_roles_updated_at 
    BEFORE UPDATE ON public.emerging_roles 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Only create triggers for tables that exist
DO $$
BEGIN
    -- Check if skills table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'skills') THEN
        EXECUTE 'CREATE TRIGGER update_skills_updated_at 
            BEFORE UPDATE ON public.skills 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if industries table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'industries') THEN
        EXECUTE 'CREATE TRIGGER update_industries_updated_at 
            BEFORE UPDATE ON public.industries 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if roles table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN
        EXECUTE 'CREATE TRIGGER update_roles_updated_at 
            BEFORE UPDATE ON public.roles 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if jobs table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jobs') THEN
        EXECUTE 'CREATE TRIGGER update_jobs_updated_at 
            BEFORE UPDATE ON public.jobs 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if market_trends table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_trends') THEN
        EXECUTE 'CREATE TRIGGER update_market_trends_updated_at 
            BEFORE UPDATE ON public.market_trends 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
END $$;

-- ==============================================
-- PART 5: Verification Queries
-- ==============================================

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

-- Verify function security
SELECT 
    proname as function_name,
    prosecdef as security_definer,
    proconfig as search_path_config,
    CASE 
        WHEN prosecdef AND proconfig IS NOT NULL THEN '✅ Secure'
        ELSE '❌ Insecure'
    END as security_status
FROM pg_proc 
WHERE proname = 'update_updated_at_column' 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Show current PostgreSQL version
SELECT version() as postgres_version;
