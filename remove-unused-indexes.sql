-- =====================================================
-- Remove Unused Indexes Script
-- =====================================================
-- This script removes all unused indexes identified by the Supabase linter
-- to improve database performance and reduce storage overhead
-- =====================================================

-- Remove unused indexes from skills table
DROP INDEX IF EXISTS public.idx_skills_demand;
DROP INDEX IF EXISTS public.idx_skills_growth;

-- Remove unused indexes from industries table
DROP INDEX IF EXISTS public.idx_industries_growth;

-- Remove unused indexes from roles table
DROP INDEX IF EXISTS public.idx_roles_growth;

-- Remove unused indexes from jobs table
DROP INDEX IF EXISTS public.idx_jobs_industry;
DROP INDEX IF EXISTS public.idx_jobs_posted_date;

-- Remove unused indexes from market_trends table
DROP INDEX IF EXISTS public.idx_market_trends_type;

-- Remove unused indexes from careers table
DROP INDEX IF EXISTS public.idx_careers_search;

-- Remove unused indexes from trending_skills table
DROP INDEX IF EXISTS public.idx_trending_skills_category;
DROP INDEX IF EXISTS public.idx_trending_skills_trending;
DROP INDEX IF EXISTS public.idx_trending_skills_declining;

-- Remove unused indexes from trending_industries table
DROP INDEX IF EXISTS public.idx_trending_industries_category;
DROP INDEX IF EXISTS public.idx_trending_industries_trending;
DROP INDEX IF EXISTS public.idx_trending_industries_declining;

-- Remove unused indexes from emerging_roles table
DROP INDEX IF EXISTS public.idx_emerging_roles_industry;

-- Remove unused indexes from career_trends table
DROP INDEX IF EXISTS public.idx_career_trends_last_updated;
DROP INDEX IF EXISTS public.idx_career_trends_next_update;

-- Remove unused indexes from career_trend_history table
DROP INDEX IF EXISTS public.idx_trend_history_career_id;
DROP INDEX IF EXISTS public.idx_trend_history_month_year;
DROP INDEX IF EXISTS public.idx_trend_history_created_at;

-- Remove unused indexes from industry_trends table
DROP INDEX IF EXISTS public.idx_industry_trends_month_year;
DROP INDEX IF EXISTS public.idx_industry_trends_avg_score;

-- Remove unused indexes from trend_update_log table
DROP INDEX IF EXISTS public.idx_update_log_month;
DROP INDEX IF EXISTS public.idx_update_log_status;
DROP INDEX IF EXISTS public.idx_update_log_created_at;

-- Remove unused indexes from career_translations table
DROP INDEX IF EXISTS public.idx_career_translations_language;

-- Remove unused indexes from career_trend_translations table
DROP INDEX IF EXISTS public.idx_career_trend_translations_trend_id;
DROP INDEX IF EXISTS public.idx_career_trend_translations_language;

-- Remove unused indexes from industry_translations table
DROP INDEX IF EXISTS public.idx_industry_translations_key;
DROP INDEX IF EXISTS public.idx_industry_translations_language;

-- Remove unused indexes from skill_translations table
DROP INDEX IF EXISTS public.idx_skill_translations_language;

-- =====================================================
-- Script Complete
-- =====================================================
-- This script has removed all unused indexes identified by the Supabase linter
-- 
-- Expected Results:
-- - All unused_index warnings will be resolved
-- - Database storage usage will be reduced
-- - Write operations will be faster (no need to maintain unused indexes)
-- - Database maintenance overhead will be reduced
-- 
-- Note: These indexes can be recreated later if needed for specific queries
-- =====================================================
