-- Fix RLS Performance Issues for Career Database Tables
-- This script addresses the Supabase linter warnings for:
-- 1. Auth RLS Initialization Plan issues
-- 2. Multiple Permissive Policies conflicts

-- =====================================================
-- 1. FIX AUTH RLS INITIALIZATION PLAN ISSUES
-- =====================================================
-- Replace auth.<function>() with (select auth.<function>()) for better performance

-- Drop existing policies for career_paths
DROP POLICY IF EXISTS "Allow public read access to career_paths" ON public.career_paths;
DROP POLICY IF EXISTS "Allow service role full access to career_paths" ON public.career_paths;

-- Create optimized unified policy for career_paths
CREATE POLICY "career_paths_unified_policy" ON public.career_paths
FOR ALL USING (
  (select auth.role()) = 'service_role' OR 
  (select auth.role()) = 'anon' OR 
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Drop existing policies for career_nodes
DROP POLICY IF EXISTS "Allow public read access to career_nodes" ON public.career_nodes;
DROP POLICY IF EXISTS "Allow service role full access to career_nodes" ON public.career_nodes;

-- Create optimized unified policy for career_nodes
CREATE POLICY "career_nodes_unified_policy" ON public.career_nodes
FOR ALL USING (
  (select auth.role()) = 'service_role' OR 
  (select auth.role()) = 'anon' OR 
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Drop existing policies for career_node_translations
DROP POLICY IF EXISTS "Allow public read access to career_node_translations" ON public.career_node_translations;
DROP POLICY IF EXISTS "Allow service role full access to career_node_translations" ON public.career_node_translations;

-- Create optimized unified policy for career_node_translations
CREATE POLICY "career_node_translations_unified_policy" ON public.career_node_translations
FOR ALL USING (
  (select auth.role()) = 'service_role' OR 
  (select auth.role()) = 'anon' OR 
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- Drop existing policies for career_path_translations
DROP POLICY IF EXISTS "Allow public read access to career_path_translations" ON public.career_path_translations;
DROP POLICY IF EXISTS "Allow service role full access to career_path_translations" ON public.career_path_translations;

-- Create optimized unified policy for career_path_translations
CREATE POLICY "career_path_translations_unified_policy" ON public.career_path_translations
FOR ALL USING (
  (select auth.role()) = 'service_role' OR 
  (select auth.role()) = 'anon' OR 
  (select auth.role()) = 'authenticated' OR
  (select auth.role()) = 'authenticator' OR
  (select auth.role()) = 'dashboard_user'
);

-- =====================================================
-- 2. VERIFY RLS IS ENABLED ON ALL TABLES
-- =====================================================
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_node_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_path_translations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE PERFORMANCE INDEXES
-- =====================================================
-- These indexes will help with query performance
CREATE INDEX IF NOT EXISTS idx_career_paths_category ON public.career_paths(category);
CREATE INDEX IF NOT EXISTS idx_career_nodes_path_id ON public.career_nodes(career_path_id);
CREATE INDEX IF NOT EXISTS idx_career_nodes_level ON public.career_nodes(level);
CREATE INDEX IF NOT EXISTS idx_career_node_translations_language ON public.career_node_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_career_node_translations_node_id ON public.career_node_translations(career_node_id);
CREATE INDEX IF NOT EXISTS idx_career_path_translations_language ON public.career_path_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_career_path_translations_path_id ON public.career_path_translations(career_path_id);

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================
-- Uncomment these to verify the fixes worked:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('career_paths', 'career_nodes', 'career_node_translations', 'career_path_translations')
-- ORDER BY tablename, policyname;

-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename IN ('career_paths', 'career_nodes', 'career_node_translations', 'career_path_translations')
-- ORDER BY tablename;
