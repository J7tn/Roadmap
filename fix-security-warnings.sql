-- Fix Security Warnings for Supabase Database
-- This script addresses the mutable search_path warnings and provides guidance for PostgreSQL version upgrade

-- ==============================================
-- PART 1: Fix Function Search Path Issues
-- ==============================================

-- Fix get_career_trend_summary function
DROP FUNCTION IF EXISTS public.get_career_trend_summary(TEXT);

CREATE OR REPLACE FUNCTION public.get_career_trend_summary(career_id_param TEXT)
RETURNS TABLE (
    career_id TEXT,
    current_trend_score DECIMAL,
    trend_direction TEXT,
    demand_level TEXT,
    growth_rate DECIMAL,
    last_updated TIMESTAMP WITH TIME ZONE,
    trend_history JSONB
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.career_id,
        ct.trend_score,
        ct.trend_direction,
        ct.demand_level,
        ct.growth_rate,
        ct.last_updated,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'month_year', cth.month_year,
                    'trend_score', (cth.trend_data->>'trend_score')::DECIMAL,
                    'trend_direction', cth.trend_data->>'trend_direction',
                    'created_at', cth.created_at
                )
            )
            FROM career_trend_history cth
            WHERE cth.career_id = career_id_param
            ORDER BY cth.created_at DESC
            LIMIT 12 -- Last 12 months
        ) as trend_history
    FROM career_trends ct
    WHERE ct.career_id = career_id_param
    ORDER BY ct.last_updated DESC
    LIMIT 1;
END;
$$;

-- Fix get_industry_trend_summary function
DROP FUNCTION IF EXISTS public.get_industry_trend_summary(TEXT);

CREATE OR REPLACE FUNCTION public.get_industry_trend_summary(industry_param TEXT)
RETURNS TABLE (
    industry TEXT,
    current_avg_trend_score DECIMAL,
    total_careers INTEGER,
    rising_careers INTEGER,
    stable_careers INTEGER,
    declining_careers INTEGER,
    top_trending_careers TEXT[],
    emerging_skills TEXT[],
    last_updated TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        it.industry,
        it.avg_trend_score,
        it.total_careers,
        it.rising_careers,
        it.stable_careers,
        it.declining_careers,
        it.top_trending_careers,
        it.emerging_skills,
        it.updated_at
    FROM industry_trends it
    WHERE it.industry = industry_param
    ORDER BY it.updated_at DESC
    LIMIT 1;
END;
$$;

-- Fix get_trending_careers function
DROP FUNCTION IF EXISTS public.get_trending_careers(INTEGER);

CREATE OR REPLACE FUNCTION public.get_trending_careers(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    career_id TEXT,
    title TEXT,
    industry TEXT,
    trend_score DECIMAL,
    trend_direction TEXT,
    demand_level TEXT,
    growth_rate DECIMAL,
    market_insights TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.career_id,
        c.title,
        c.industry,
        ct.trend_score,
        ct.trend_direction,
        ct.demand_level,
        ct.growth_rate,
        ct.market_insights
    FROM career_trends ct
    JOIN careers c ON c.id = ct.career_id
    WHERE ct.last_updated >= NOW() - INTERVAL '2 months' -- Only recent data
    ORDER BY ct.trend_score DESC, ct.growth_rate DESC
    LIMIT limit_count;
END;
$$;

-- ==============================================
-- PART 2: Drop All Triggers First (Required for Function Drop)
-- ==============================================

-- Drop ALL existing triggers that depend on update_updated_at_column function
DROP TRIGGER IF EXISTS update_careers_updated_at ON public.careers;
DROP TRIGGER IF EXISTS update_career_update_log_updated_at ON public.career_update_log;
DROP TRIGGER IF EXISTS update_trending_skills_updated_at ON public.trending_skills;
DROP TRIGGER IF EXISTS update_trending_industries_updated_at ON public.trending_industries;
DROP TRIGGER IF EXISTS update_emerging_roles_updated_at ON public.emerging_roles;
DROP TRIGGER IF EXISTS update_trending_update_log_updated_at ON public.trending_update_log;
DROP TRIGGER IF EXISTS update_skills_updated_at ON public.skills;
DROP TRIGGER IF EXISTS update_industries_updated_at ON public.industries;
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
DROP TRIGGER IF EXISTS update_market_trends_updated_at ON public.market_trends;
DROP TRIGGER IF EXISTS update_career_trends_updated_at ON public.career_trends;
DROP TRIGGER IF EXISTS update_industry_trends_updated_at ON public.industry_trends;
DROP TRIGGER IF EXISTS update_trend_update_log_updated_at ON public.trend_update_log;

-- ==============================================
-- PART 3: Fix update_updated_at_column function
-- ==============================================

-- Now we can safely drop and recreate the function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ==============================================
-- PART 4: Recreate All Triggers with Secure Function
-- ==============================================

-- Recreate triggers with the secure function
CREATE TRIGGER update_career_trends_updated_at
    BEFORE UPDATE ON public.career_trends
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_trends_updated_at
    BEFORE UPDATE ON public.industry_trends
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trend_update_log_updated_at
    BEFORE UPDATE ON public.trend_update_log
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Only create triggers for tables that exist
DO $$
BEGIN
    -- Check if careers table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'careers') THEN
        EXECUTE 'CREATE TRIGGER update_careers_updated_at 
            BEFORE UPDATE ON public.careers 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if career_update_log table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'career_update_log') THEN
        EXECUTE 'CREATE TRIGGER update_career_update_log_updated_at 
            BEFORE UPDATE ON public.career_update_log 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if trending_skills table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trending_skills') THEN
        EXECUTE 'CREATE TRIGGER update_trending_skills_updated_at 
            BEFORE UPDATE ON public.trending_skills 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if trending_industries table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trending_industries') THEN
        EXECUTE 'CREATE TRIGGER update_trending_industries_updated_at 
            BEFORE UPDATE ON public.trending_industries 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if emerging_roles table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emerging_roles') THEN
        EXECUTE 'CREATE TRIGGER update_emerging_roles_updated_at 
            BEFORE UPDATE ON public.emerging_roles 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if trending_update_log table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trending_update_log') THEN
        EXECUTE 'CREATE TRIGGER update_trending_update_log_updated_at 
            BEFORE UPDATE ON public.trending_update_log 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
END $$;

-- ==============================================
-- PART 5: Verification Queries
-- ==============================================

-- Verify function security for all functions
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

-- Show current PostgreSQL version
SELECT version() as postgres_version;

-- ==============================================
-- PART 6: PostgreSQL Version Upgrade Instructions
-- ==============================================

/*
POSTGRESQL VERSION UPGRADE INSTRUCTIONS:

Your current version: supabase-postgres-17.4.1.075
Issue: Security patches are available

To upgrade your PostgreSQL version in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to Settings > Database
3. Look for "Upgrade Database" or "Database Version" section
4. Follow the upgrade process (this may require a maintenance window)
5. The upgrade will apply the latest security patches

Alternative: Contact Supabase support if you don't see upgrade options in the dashboard.

Security Impact: The current version has known vulnerabilities that could be exploited.
Upgrading will patch these security issues.

Reference: https://supabase.com/docs/guides/platform/upgrading
*/
