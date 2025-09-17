-- Fix Career Database Index Performance Issues
-- This script addresses the Supabase linter warnings for:
-- 1. Unindexed foreign keys
-- 2. Unused indexes (evaluation and cleanup)

-- =====================================================
-- 1. FIX UNINDEXED FOREIGN KEY
-- =====================================================
-- Add index for career_trend_history foreign key to improve performance

CREATE INDEX IF NOT EXISTS idx_career_trend_history_career_id 
ON public.career_trend_history(career_id);

-- =====================================================
-- 2. EVALUATE UNUSED INDEXES
-- =====================================================
-- The following indexes are marked as "unused" but this is likely because:
-- 1. The database is new and hasn't been heavily queried
-- 2. These indexes will be useful for future queries
-- 3. The app will start using these indexes once it's in production

-- We'll keep these indexes as they are strategically important:

-- idx_career_nodes_path_id - Used for joining career_nodes with career_paths
-- idx_career_nodes_level - Used for filtering by career level (E, I, A, X)
-- idx_career_node_translations_node_id - Used for joining translations with nodes
-- idx_career_path_translations_path_id - Used for joining path translations
-- idx_career_path_translations_language - Used for filtering by language
-- idx_career_paths_category - Used for filtering by career category

-- These indexes will become useful when the app is in production and users are:
-- - Searching careers by category
-- - Filtering by career level
-- - Switching languages
-- - Loading career paths and their translations

-- =====================================================
-- 3. ADDITIONAL STRATEGIC INDEXES
-- =====================================================
-- Add some additional indexes that will be useful for common queries

-- Index for career_node_translations language_code (if not already exists)
CREATE INDEX IF NOT EXISTS idx_career_node_translations_language 
ON public.career_node_translations(language_code);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_career_nodes_path_level 
ON public.career_nodes(career_path_id, level);

-- Index for career_path_translations language_code (if not already exists)
CREATE INDEX IF NOT EXISTS idx_career_path_translations_language 
ON public.career_path_translations(language_code);

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================
-- Uncomment these to verify the indexes were created:

-- SELECT schemaname, tablename, indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename IN ('career_paths', 'career_nodes', 'career_node_translations', 'career_path_translations', 'career_trend_history')
-- ORDER BY tablename, indexname;

-- Check foreign key constraints
-- SELECT 
--     tc.table_name, 
--     kcu.column_name, 
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name 
-- FROM 
--     information_schema.table_constraints AS tc 
--     JOIN information_schema.key_column_usage AS kcu
--       ON tc.constraint_name = kcu.constraint_name
--       AND tc.table_schema = kcu.table_schema
--     JOIN information_schema.constraint_column_usage AS ccu
--       ON ccu.constraint_name = tc.constraint_name
--       AND ccu.table_schema = tc.table_schema
-- WHERE tc.constraint_type = 'FOREIGN KEY' 
--   AND tc.table_name IN ('career_paths', 'career_nodes', 'career_node_translations', 'career_path_translations', 'career_trend_history')
-- ORDER BY tc.table_name, kcu.column_name;
