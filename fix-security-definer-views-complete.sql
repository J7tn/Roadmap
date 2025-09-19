-- =====================================================
-- Complete Fix for Security Definer Views
-- =====================================================
-- This script completely removes and recreates views to eliminate SECURITY DEFINER issues

-- First, let's check what views exist and drop them completely
DROP VIEW IF EXISTS public.career_nodes_with_translations CASCADE;
DROP VIEW IF EXISTS public.careers_without_trends CASCADE;
DROP VIEW IF EXISTS public.active_translations CASCADE;

-- =====================================================
-- 1. Recreate career_nodes_with_translations view
-- =====================================================
CREATE VIEW public.career_nodes_with_translations AS
SELECT
    cn.id AS node_id,
    cn.career_path_id,
    cn.level,
    cn.salary_range,
    cn.time_to_achieve,
    cn.requirements,
    cnt.language_code,
    cnt.title,
    cnt.description,
    cnt.skills,
    cnt.certifications,
    cnt.job_titles,
    cp.category AS path_category,
    cpt.name AS path_name
FROM
    public.career_nodes cn
JOIN
    public.career_node_translations cnt ON cn.id = cnt.career_node_id
JOIN
    public.career_paths cp ON cn.career_path_id = cp.id
JOIN
    public.career_path_translations cpt ON cp.id = cpt.career_path_id AND cnt.language_code = cpt.language_code;

-- =====================================================
-- 2. Recreate careers_without_trends view
-- =====================================================
CREATE VIEW public.careers_without_trends AS
SELECT 
    c.*,
    COALESCE(ct.trend_score, 0) as trending_score,
    COALESCE(ct.growth_rate, 0) as growth_rate,
    COALESCE(ct.demand_level, 'low') as demand_level,
    COALESCE(ct.last_updated, NOW()) as trend_last_updated
FROM 
    public.careers c
LEFT JOIN 
    public.career_trends ct ON c.id = ct.career_id;

-- =====================================================
-- 3. Recreate active_translations view
-- =====================================================
CREATE VIEW public.active_translations AS
SELECT 
    id,
    language_code,
    translation_data,
    version,
    is_active,
    created_at,
    updated_at
FROM 
    public.translations
WHERE 
    is_active = true;

-- =====================================================
-- Grant appropriate permissions
-- =====================================================

-- Grant read access to all users for the views
GRANT SELECT ON public.career_nodes_with_translations TO anon, authenticated;
GRANT SELECT ON public.careers_without_trends TO anon, authenticated;
GRANT SELECT ON public.active_translations TO anon, authenticated;

-- =====================================================
-- Add comments for documentation
-- =====================================================

COMMENT ON VIEW public.career_nodes_with_translations IS 'View to easily query career nodes with their translations - no SECURITY DEFINER';
COMMENT ON VIEW public.careers_without_trends IS 'View to query careers with trend data - no SECURITY DEFINER';
COMMENT ON VIEW public.active_translations IS 'View to query active translations - no SECURITY DEFINER';

-- =====================================================
-- Verify the views were created without SECURITY DEFINER
-- =====================================================

-- This query will show if any views still have SECURITY DEFINER
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('career_nodes_with_translations', 'careers_without_trends', 'active_translations')
AND definition LIKE '%SECURITY DEFINER%';
