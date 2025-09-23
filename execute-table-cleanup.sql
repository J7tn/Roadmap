-- Supabase Table Cleanup
-- Execute these commands in your Supabase Dashboard → SQL Editor

-- Remove empty tables that are no longer needed
DROP TABLE IF EXISTS career_trend_history CASCADE;
DROP TABLE IF EXISTS industry_trends CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;

-- Verify the cleanup
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;
