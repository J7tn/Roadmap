-- Fix function security issues
-- This script addresses the mutable search_path warning

-- Drop and recreate the update_updated_at_column function with secure search_path
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

-- Recreate all triggers that use this function
-- Note: These will be recreated automatically when the function is dropped and recreated
-- But let's be explicit about it

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_careers_updated_at ON public.careers;
DROP TRIGGER IF EXISTS update_trending_skills_updated_at ON public.trending_skills;
DROP TRIGGER IF EXISTS update_trending_industries_updated_at ON public.trending_industries;
DROP TRIGGER IF EXISTS update_emerging_roles_updated_at ON public.emerging_roles;
DROP TRIGGER IF EXISTS update_skills_updated_at ON public.skills;
DROP TRIGGER IF EXISTS update_industries_updated_at ON public.industries;
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
DROP TRIGGER IF EXISTS update_market_trends_updated_at ON public.market_trends;

-- Recreate triggers with the secure function
CREATE TRIGGER update_careers_updated_at 
    BEFORE UPDATE ON public.careers 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trending_skills_updated_at 
    BEFORE UPDATE ON public.trending_skills 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trending_industries_updated_at 
    BEFORE UPDATE ON public.trending_industries 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emerging_roles_updated_at 
    BEFORE UPDATE ON public.emerging_roles 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Only create triggers for tables that exist
DO $$
BEGIN
    -- Check if skills table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'skills') THEN
        EXECUTE 'CREATE TRIGGER update_skills_updated_at 
            BEFORE UPDATE ON public.skills 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if industries table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'industries') THEN
        EXECUTE 'CREATE TRIGGER update_industries_updated_at 
            BEFORE UPDATE ON public.industries 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if roles table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN
        EXECUTE 'CREATE TRIGGER update_roles_updated_at 
            BEFORE UPDATE ON public.roles 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if jobs table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jobs') THEN
        EXECUTE 'CREATE TRIGGER update_jobs_updated_at 
            BEFORE UPDATE ON public.jobs 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
    
    -- Check if market_trends table exists and create trigger
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'market_trends') THEN
        EXECUTE 'CREATE TRIGGER update_market_trends_updated_at 
            BEFORE UPDATE ON public.market_trends 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column()';
    END IF;
END $$;

-- Verify the function is secure
SELECT 
    proname as function_name,
    prosecdef as security_definer,
    proconfig as search_path_config
FROM pg_proc 
WHERE proname = 'update_updated_at_column' 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
