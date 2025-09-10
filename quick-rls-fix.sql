-- Quick RLS fix for existing tables
-- Run this if the tables already exist but RLS is not enabled

-- Enable RLS on all problematic tables
ALTER TABLE IF EXISTS public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.market_trends ENABLE ROW LEVEL SECURITY;

-- Create policies for skills table
DROP POLICY IF EXISTS "Allow public read access to skills" ON public.skills;
CREATE POLICY "Allow public read access to skills" ON public.skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage skills" ON public.skills;
CREATE POLICY "Allow service role to manage skills" ON public.skills
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create policies for industries table
DROP POLICY IF EXISTS "Allow public read access to industries" ON public.industries;
CREATE POLICY "Allow public read access to industries" ON public.industries
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage industries" ON public.industries;
CREATE POLICY "Allow service role to manage industries" ON public.industries
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create policies for roles table
DROP POLICY IF EXISTS "Allow public read access to roles" ON public.roles;
CREATE POLICY "Allow public read access to roles" ON public.roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage roles" ON public.roles;
CREATE POLICY "Allow service role to manage roles" ON public.roles
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create policies for jobs table
DROP POLICY IF EXISTS "Allow public read access to jobs" ON public.jobs;
CREATE POLICY "Allow public read access to jobs" ON public.jobs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage jobs" ON public.jobs;
CREATE POLICY "Allow service role to manage jobs" ON public.jobs
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Create policies for market_trends table
DROP POLICY IF EXISTS "Allow public read access to market_trends" ON public.market_trends;
CREATE POLICY "Allow public read access to market_trends" ON public.market_trends
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role to manage market_trends" ON public.market_trends;
CREATE POLICY "Allow service role to manage market_trends" ON public.market_trends
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Verify the fix
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
AND tablename IN ('skills', 'industries', 'roles', 'jobs', 'market_trends')
ORDER BY tablename;
