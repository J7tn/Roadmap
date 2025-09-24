-- Complete Database Cleanup SQL Commands
-- Run these commands in your Supabase SQL Editor to remove ALL old system tables

-- Remove ALL old system tables (in order to avoid foreign key constraints)
DROP TABLE IF EXISTS career_nodes CASCADE;
DROP TABLE IF EXISTS career_path_translations CASCADE;
DROP TABLE IF EXISTS career_update_log CASCADE;
DROP TABLE IF EXISTS emerging_roles CASCADE;
DROP TABLE IF EXISTS industry_trend_translations CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS market_trends CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS test_career_trend_translations CASCADE;

-- Remove the old tables we identified earlier
DROP TABLE IF EXISTS careers CASCADE;
DROP TABLE IF EXISTS career_paths CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS career_trends CASCADE;
DROP TABLE IF EXISTS career_trend_translations CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS career_content CASCADE;
DROP TABLE IF EXISTS careers_new CASCADE;
DROP TABLE IF EXISTS industries_new CASCADE;
DROP TABLE IF EXISTS industry_translations CASCADE;
DROP TABLE IF EXISTS career_node_translations CASCADE;
DROP TABLE IF EXISTS career_translations CASCADE;
DROP TABLE IF EXISTS skill_translations CASCADE;
DROP TABLE IF EXISTS node_translations CASCADE;
DROP TABLE IF EXISTS content_translations CASCADE;

-- Verify cleanup by running this query after the cleanup:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
