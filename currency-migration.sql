-- Currency Support Migration for Career Trends
-- Run this SQL in your Supabase SQL editor to add currency support

-- Add currency columns to career_trends table
ALTER TABLE career_trends 
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS salary_data JSONB;

-- Add currency columns to career_trend_history table
ALTER TABLE career_trend_history 
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'USD';

-- Add currency columns to industry_trends table
ALTER TABLE industry_trends 
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS salary_insights JSONB;

-- Create indexes for currency lookups
CREATE INDEX IF NOT EXISTS idx_career_trends_currency ON career_trends(currency_code);
CREATE INDEX IF NOT EXISTS idx_industry_trends_currency ON industry_trends(currency_code);

-- Add comments for documentation
COMMENT ON COLUMN career_trends.currency_code IS 'Currency code for salary data (USD, EUR, JPY, etc.)';
COMMENT ON COLUMN career_trends.salary_data IS 'JSON object containing salary ranges and insights for this currency/region';
COMMENT ON COLUMN industry_trends.currency_code IS 'Currency code for industry salary insights';
COMMENT ON COLUMN industry_trends.salary_insights IS 'JSON object containing industry salary insights for this currency/region';

-- Update the get_career_trend_summary function to include currency
CREATE OR REPLACE FUNCTION get_career_trend_summary(career_id_param TEXT, currency_code_param TEXT DEFAULT 'USD')
RETURNS TABLE (
    career_id TEXT,
    current_trend_score DECIMAL,
    trend_direction TEXT,
    demand_level TEXT,
    growth_rate DECIMAL,
    currency_code TEXT,
    salary_data JSONB,
    last_updated TIMESTAMP WITH TIME ZONE,
    trend_history JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.career_id,
        ct.trend_score,
        ct.trend_direction,
        ct.demand_level,
        ct.growth_rate,
        ct.currency_code,
        ct.salary_data,
        ct.last_updated,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'month_year', cth.month_year,
                    'trend_score', (cth.trend_data->>'trend_score')::DECIMAL,
                    'trend_direction', cth.trend_data->>'trend_direction',
                    'currency_code', cth.currency_code,
                    'created_at', cth.created_at
                )
            )
            FROM career_trend_history cth
            WHERE cth.career_id = career_id_param
            AND (cth.currency_code = currency_code_param OR cth.currency_code IS NULL)
            ORDER BY cth.created_at DESC
            LIMIT 12 -- Last 12 months
        ) as trend_history
    FROM career_trends ct
    WHERE ct.career_id = career_id_param
    AND (ct.currency_code = currency_code_param OR ct.currency_code IS NULL)
    ORDER BY ct.last_updated DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a new function to get trending careers by currency
CREATE OR REPLACE FUNCTION get_trending_careers_by_currency(currency_code_param TEXT DEFAULT 'USD', limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    career_id TEXT,
    title TEXT,
    industry TEXT,
    trend_score DECIMAL,
    trend_direction TEXT,
    demand_level TEXT,
    growth_rate DECIMAL,
    currency_code TEXT,
    salary_data JSONB,
    market_insights TEXT
) AS $$
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
        ct.currency_code,
        ct.salary_data,
        ct.market_insights
    FROM career_trends ct
    JOIN careers c ON c.id = ct.career_id
    WHERE ct.last_updated >= NOW() - INTERVAL '2 months' -- Only recent data
    AND (ct.currency_code = currency_code_param OR ct.currency_code IS NULL)
    ORDER BY ct.trend_score DESC, ct.growth_rate DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
