-- Fix career_trends_with_translations view to properly join translation data
-- Run this in the Supabase SQL editor

-- Drop the existing view if it exists
DROP VIEW IF EXISTS career_trends_with_translations;

-- Create the new view with proper joins
CREATE VIEW career_trends_with_translations AS
SELECT 
  ct.*,
  ctt.language_code,
  ctt.market_insights as market_insights_translated,
  ctt.salary_trend as salary_trend_translated,
  ctt.industry_impact as industry_impact_translated,
  ctt.future_outlook as future_outlook_translated,
  ctt.key_skills_trending as key_skills_trending_translated,
  ctt.top_locations as top_locations_translated
FROM career_trends ct
LEFT JOIN career_trend_translations ctt ON ct.id = ctt.career_trend_id;

-- Grant permissions to the view
GRANT SELECT ON career_trends_with_translations TO authenticated;
GRANT SELECT ON career_trends_with_translations TO anon;
