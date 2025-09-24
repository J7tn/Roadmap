-- Cleanup Old Tables SQL Commands
-- Run these commands in your Supabase SQL Editor to remove old system tables

-- Remove old system tables (in order to avoid foreign key constraints)
-- Run these commands one by one in the Supabase SQL Editor

-- 1. Remove career_trend_translations (has foreign keys to career_trends)
DROP TABLE IF EXISTS career_trend_translations CASCADE;

-- 2. Remove career_trends 
DROP TABLE IF EXISTS career_trends CASCADE;

-- 3. Remove career_paths
DROP TABLE IF EXISTS career_paths CASCADE;

-- 4. Remove careers
DROP TABLE IF EXISTS careers CASCADE;

-- 5. Remove industries
DROP TABLE IF EXISTS industries CASCADE;

-- 6. Remove translations
DROP TABLE IF EXISTS translations CASCADE;

-- 7. Remove any other old tables that might exist
DROP TABLE IF EXISTS industry_translations CASCADE;
DROP TABLE IF EXISTS career_content CASCADE;
DROP TABLE IF EXISTS careers_new CASCADE;
DROP TABLE IF EXISTS industries_new CASCADE;

-- Verify the cleanup by running this query:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
