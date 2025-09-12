-- Security Verification Queries
-- Run these to confirm all security fixes are working

-- ==============================================
-- 1. Verify Function Security Status
-- ==============================================

SELECT 
    proname as function_name,
    prosecdef as security_definer,
    proconfig as search_path_config,
    CASE 
        WHEN prosecdef AND proconfig IS NOT NULL THEN '✅ Secure'
        ELSE '❌ Insecure'
    END as security_status
FROM pg_proc 
WHERE proname IN ('get_career_trend_summary', 'get_industry_trend_summary', 'get_trending_careers', 'update_updated_at_column')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- ==============================================
-- 2. Verify All Triggers Are Working
-- ==============================================

SELECT 
    trigger_name,
    event_object_table as table_name,
    action_statement as function_called,
    CASE 
        WHEN action_statement LIKE '%update_updated_at_column%' THEN '✅ Secure Function'
        ELSE '❌ Check Function'
    END as trigger_status
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

-- ==============================================
-- 3. Test Function Functionality
-- ==============================================

-- Test get_career_trend_summary (if you have career data)
-- SELECT * FROM get_career_trend_summary('software-engineer') LIMIT 1;

-- Test get_industry_trend_summary (if you have industry data)  
-- SELECT * FROM get_industry_trend_summary('Technology') LIMIT 1;

-- Test get_trending_careers
-- SELECT * FROM get_trending_careers(3);

-- ==============================================
-- 4. Check PostgreSQL Version
-- ==============================================

SELECT version() as postgres_version;

-- ==============================================
-- 5. Summary Report
-- ==============================================

SELECT 
    'Security Fix Summary' as report_type,
    'All functions should show ✅ Secure' as function_status,
    'All triggers should show ✅ Secure Function' as trigger_status,
    'PostgreSQL version should be 17.4 or newer' as version_status;
