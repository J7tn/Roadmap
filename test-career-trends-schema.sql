-- =====================================================
-- Test Career Trends Schema
-- =====================================================
-- This script tests the career trends schema to ensure it works correctly

-- 1. Test if career_trends table exists and has the expected structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'career_trends'
AND column_name = 'career_id';

-- 2. Test if we can query career_trends with career_id
SELECT 
    career_id,
    trend_score,
    trend_direction,
    demand_level
FROM public.career_trends 
LIMIT 3;

-- 3. Test if the new translation tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('career_trend_translations', 'industry_trend_translations');

-- 4. Test if the new views were created
SELECT 
    viewname,
    definition
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('career_trends_with_translations', 'industry_trends_with_translations');

-- 5. Test if we can query the new view (should return empty results initially)
SELECT 
    career_id,
    language_code,
    market_insights
FROM public.career_trends_with_translations 
LIMIT 3;
