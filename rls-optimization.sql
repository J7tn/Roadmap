-- RLS Performance Optimization Script
-- Fixes auth RLS initialization plan and multiple permissive policies issues
-- Edited by Flare on 2024-12-19

-- ==============================================
-- 1. FIX AUTH RLS INITIALIZATION PLAN ISSUES
-- ==============================================
-- Replace auth.role() calls with (select auth.role()) to prevent re-evaluation per row

-- Fix careers table service role policy
DROP POLICY IF EXISTS "Allow service role to manage careers" ON careers;
CREATE POLICY "Allow service role to manage careers" ON careers
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix career_update_log table service role policy
DROP POLICY IF EXISTS "Allow service role to manage career_update_log" ON career_update_log;
CREATE POLICY "Allow service role to manage career_update_log" ON career_update_log
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix trending_skills table service role policy
DROP POLICY IF EXISTS "Allow service role to manage trending_skills" ON trending_skills;
CREATE POLICY "Allow service role to manage trending_skills" ON trending_skills
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix trending_industries table service role policy
DROP POLICY IF EXISTS "Allow service role to manage trending_industries" ON trending_industries;
CREATE POLICY "Allow service role to manage trending_industries" ON trending_industries
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix emerging_roles table service role policy
DROP POLICY IF EXISTS "Allow service role to manage emerging_roles" ON emerging_roles;
CREATE POLICY "Allow service role to manage emerging_roles" ON emerging_roles
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix trending_update_log table service role policy
DROP POLICY IF EXISTS "Allow service role to manage trending_update_log" ON trending_update_log;
CREATE POLICY "Allow service role to manage trending_update_log" ON trending_update_log
    FOR ALL USING ((select auth.role()) = 'service_role');

-- ==============================================
-- 2. CONSOLIDATE MULTIPLE PERMISSIVE POLICIES
-- ==============================================
-- Combine public read and service role policies into single optimized policies

-- Consolidated careers table policy
DROP POLICY IF EXISTS "Allow public read access to careers" ON careers;
DROP POLICY IF EXISTS "Allow service role to manage careers" ON careers;
CREATE POLICY "Unified careers access policy" ON careers
    FOR SELECT USING (true);
CREATE POLICY "Service role full access to careers" ON careers
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Consolidated career_update_log table policy
DROP POLICY IF EXISTS "Allow public read access to career_update_log" ON career_update_log;
DROP POLICY IF EXISTS "Allow service role to manage career_update_log" ON career_update_log;
CREATE POLICY "Unified career_update_log access policy" ON career_update_log
    FOR SELECT USING (true);
CREATE POLICY "Service role full access to career_update_log" ON career_update_log
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Consolidated trending_skills table policy
DROP POLICY IF EXISTS "Allow public read access to trending_skills" ON trending_skills;
DROP POLICY IF EXISTS "Allow service role to manage trending_skills" ON trending_skills;
CREATE POLICY "Unified trending_skills access policy" ON trending_skills
    FOR SELECT USING (true);
CREATE POLICY "Service role full access to trending_skills" ON trending_skills
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Consolidated trending_industries table policy
DROP POLICY IF EXISTS "Allow public read access to trending_industries" ON trending_industries;
DROP POLICY IF EXISTS "Allow service role to manage trending_industries" ON trending_industries;
CREATE POLICY "Unified trending_industries access policy" ON trending_industries
    FOR SELECT USING (true);
CREATE POLICY "Service role full access to trending_industries" ON trending_industries
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Consolidated emerging_roles table policy
DROP POLICY IF EXISTS "Allow public read access to emerging_roles" ON emerging_roles;
DROP POLICY IF EXISTS "Allow service role to manage emerging_roles" ON emerging_roles;
CREATE POLICY "Unified emerging_roles access policy" ON emerging_roles
    FOR SELECT USING (true);
CREATE POLICY "Service role full access to emerging_roles" ON emerging_roles
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Consolidated trending_update_log table policy
DROP POLICY IF EXISTS "Allow public read access to trending_update_log" ON trending_update_log;
DROP POLICY IF EXISTS "Allow service role to manage trending_update_log" ON trending_update_log;
CREATE POLICY "Unified trending_update_log access policy" ON trending_update_log
    FOR SELECT USING (true);
CREATE POLICY "Service role full access to trending_update_log" ON trending_update_log
    FOR ALL USING ((select auth.role()) = 'service_role');

-- ==============================================
-- 3. VERIFICATION QUERIES
-- ==============================================
-- Run these to verify the policies are working correctly

-- Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('careers', 'career_update_log', 'trending_skills', 'trending_industries', 'emerging_roles', 'trending_update_log')
ORDER BY tablename, policyname;

-- Test public read access (should work for all users)
-- SELECT COUNT(*) FROM careers;
-- SELECT COUNT(*) FROM trending_skills;

-- Test service role access (should work only for service_role)
-- This would need to be run with service_role credentials
-- SELECT COUNT(*) FROM careers;
