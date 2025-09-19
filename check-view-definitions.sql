-- =====================================================
-- Check Current View Definitions
-- =====================================================
-- This script shows the current definitions of the problematic views

-- 1. Show the current view definitions
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('career_nodes_with_translations', 'careers_without_trends', 'active_translations')
ORDER BY viewname;

-- 2. Check if there are any functions that create these views
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) LIKE '%career_nodes_with_translations%'
OR pg_get_functiondef(p.oid) LIKE '%careers_without_trends%'
OR pg_get_functiondef(p.oid) LIKE '%active_translations%';

-- 3. Check the table structure to understand the data types
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('career_nodes', 'career_node_translations', 'career_paths', 'career_path_translations', 'careers', 'career_trends', 'translations')
ORDER BY table_name, ordinal_position;
