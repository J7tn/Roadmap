-- =====================================================
-- Diagnostic Script for Security Definer Views
-- =====================================================
-- This script helps identify what's causing the SECURITY DEFINER issues

-- 1. Check if the views exist and their definitions
SELECT 
    schemaname,
    viewname,
    viewowner,
    definition
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('career_nodes_with_translations', 'careers_without_trends', 'active_translations')
ORDER BY viewname;

-- 2. Check for any SECURITY DEFINER in the definitions
SELECT 
    schemaname,
    viewname,
    CASE 
        WHEN definition LIKE '%SECURITY DEFINER%' THEN 'HAS SECURITY DEFINER'
        ELSE 'NO SECURITY DEFINER'
    END as security_status
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('career_nodes_with_translations', 'careers_without_trends', 'active_translations')
ORDER BY viewname;

-- 3. Check if there are any functions that might be creating these views with SECURITY DEFINER
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) LIKE '%SECURITY DEFINER%'
AND pg_get_functiondef(p.oid) LIKE '%CREATE VIEW%'
AND n.nspname = 'public';

-- 4. Check for any triggers or other objects that might be recreating these views
SELECT 
    schemaname,
    tablename,
    triggername,
    tgdef
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
AND tgdef::text LIKE '%CREATE VIEW%';

-- 5. Check the current permissions on these views
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('career_nodes_with_translations', 'careers_without_trends', 'active_translations');

-- 6. Check if these are actually tables instead of views
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('career_nodes_with_translations', 'careers_without_trends', 'active_translations');
