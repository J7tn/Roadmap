-- =====================================================
-- Create Views with Existing Table Structure
-- =====================================================
-- This script creates views that work with the existing career_trend_translations table

-- Create view to easily query trend data with translations
CREATE OR REPLACE VIEW public.career_trends_with_translations AS
SELECT 
    ct.id,
    ct.career_id,
    ct.trend_score,
    ct.trend_direction,
    ct.demand_level,
    ct.growth_rate,
    ct.job_availability_score,
    ct.remote_work_trend,
    ct.automation_risk,
    ct.confidence_score,
    ct.last_updated,
    ct.data_source,
    ct.next_update_due,
    ct.created_at,
    ct.updated_at,
    -- Use translated content if available, fallback to original
    COALESCE(ctt.market_insights, ct.market_insights) as market_insights,
    COALESCE(ctt.salary_trend, ct.salary_trend) as salary_trend,
    COALESCE(ctt.industry_impact, ct.industry_impact) as industry_impact,
    COALESCE(ctt.future_outlook, ct.future_outlook) as future_outlook,
    COALESCE(ctt.key_skills_trending, ct.key_skills_trending) as key_skills_trending,
    COALESCE(ctt.top_locations, ct.top_locations) as top_locations,
    ctt.language_code
FROM 
    public.career_trends ct
LEFT JOIN 
    public.career_trend_translations ctt ON ct.id = ctt.career_trend_id;

-- Grant permissions on the view
GRANT SELECT ON public.career_trends_with_translations TO anon, authenticated;

-- Add comment
COMMENT ON VIEW public.career_trends_with_translations IS 'View to query career trends with language-specific translations';
