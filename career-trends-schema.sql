-- Career Trends Schema for Monthly Updates
-- Stores trend data for each career updated monthly via chat2api

-- Career trends table for storing monthly trend data
CREATE TABLE IF NOT EXISTS career_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    
    -- Trend data from chat2api
    trend_score DECIMAL(3,2) NOT NULL CHECK (trend_score >= 0 AND trend_score <= 10), -- 0-10 scale
    trend_direction TEXT NOT NULL CHECK (trend_direction IN ('rising', 'stable', 'declining')),
    demand_level TEXT NOT NULL CHECK (demand_level IN ('high', 'medium', 'low')),
    growth_rate DECIMAL(5,2), -- Percentage growth rate
    
    -- Market insights
    market_insights TEXT, -- AI-generated market analysis
    key_skills_trending TEXT[], -- Trending skills for this career
    salary_trend TEXT, -- Salary trend analysis
    job_availability_score DECIMAL(3,2) CHECK (job_availability_score >= 0 AND job_availability_score <= 10),
    
    -- Geographic data
    top_locations TEXT[], -- Top cities/regions for this career
    remote_work_trend DECIMAL(3,2) CHECK (remote_work_trend >= 0 AND remote_work_trend <= 10),
    
    -- Industry context
    industry_impact TEXT, -- How industry changes affect this career
    automation_risk DECIMAL(3,2) CHECK (automation_risk >= 0 AND automation_risk <= 10),
    future_outlook TEXT, -- 2-3 year outlook
    
    -- Data source and quality
    data_source TEXT DEFAULT 'chat2api',
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 10),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_update_due TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career trend history for tracking changes over time
CREATE TABLE IF NOT EXISTS career_trend_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    trend_data JSONB NOT NULL, -- Full trend data snapshot
    month_year TEXT NOT NULL, -- Format: '2024-01'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industry trend summaries (aggregated data)
CREATE TABLE IF NOT EXISTS industry_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry TEXT NOT NULL,
    month_year TEXT NOT NULL, -- Format: '2024-01'
    
    -- Aggregated metrics
    avg_trend_score DECIMAL(3,2),
    total_careers INTEGER,
    rising_careers INTEGER,
    stable_careers INTEGER,
    declining_careers INTEGER,
    
    -- Top trending careers in this industry
    top_trending_careers TEXT[], -- Array of career IDs
    emerging_skills TEXT[], -- Skills trending across the industry
    
    -- Market insights
    industry_insights TEXT,
    key_drivers TEXT[], -- Factors driving industry trends
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(industry, month_year)
);

-- Update tracking for monitoring the monthly update process
CREATE TABLE IF NOT EXISTS trend_update_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    update_month TEXT NOT NULL, -- Format: '2024-01'
    status TEXT NOT NULL CHECK (status IN ('started', 'in_progress', 'completed', 'failed')),
    
    -- Progress tracking
    total_careers INTEGER,
    processed_careers INTEGER,
    successful_updates INTEGER,
    failed_updates INTEGER,
    
    -- Error tracking
    errors JSONB, -- Array of error messages
    warnings JSONB, -- Array of warning messages
    
    -- Performance metrics
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Data quality metrics
    avg_confidence_score DECIMAL(3,2),
    data_quality_issues INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_career_trends_career_id ON career_trends(career_id);
CREATE INDEX IF NOT EXISTS idx_career_trends_last_updated ON career_trends(last_updated);
CREATE INDEX IF NOT EXISTS idx_career_trends_next_update ON career_trends(next_update_due);
CREATE INDEX IF NOT EXISTS idx_career_trends_trend_score ON career_trends(trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_career_trends_demand_level ON career_trends(demand_level);

CREATE INDEX IF NOT EXISTS idx_trend_history_career_id ON career_trend_history(career_id);
CREATE INDEX IF NOT EXISTS idx_trend_history_month_year ON career_trend_history(month_year);
CREATE INDEX IF NOT EXISTS idx_trend_history_created_at ON career_trend_history(created_at);

CREATE INDEX IF NOT EXISTS idx_industry_trends_industry ON industry_trends(industry);
CREATE INDEX IF NOT EXISTS idx_industry_trends_month_year ON industry_trends(month_year);
CREATE INDEX IF NOT EXISTS idx_industry_trends_avg_score ON industry_trends(avg_trend_score DESC);

CREATE INDEX IF NOT EXISTS idx_update_log_month ON trend_update_log(update_month);
CREATE INDEX IF NOT EXISTS idx_update_log_status ON trend_update_log(status);
CREATE INDEX IF NOT EXISTS idx_update_log_created_at ON trend_update_log(created_at);

-- RLS Policies
ALTER TABLE career_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_trend_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_update_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trend data
CREATE POLICY "Allow public read access to career trends" ON career_trends
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to trend history" ON career_trend_history
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to industry trends" ON industry_trends
    FOR SELECT USING (true);

-- Allow service role full access for updates
CREATE POLICY "Allow service role full access to career trends" ON career_trends
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to trend history" ON career_trend_history
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to industry trends" ON industry_trends
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to update log" ON trend_update_log
    FOR ALL USING (auth.role() = 'service_role');

-- Functions for trend analysis
CREATE OR REPLACE FUNCTION get_career_trend_summary(career_id_param TEXT)
RETURNS TABLE (
    career_id TEXT,
    current_trend_score DECIMAL,
    trend_direction TEXT,
    demand_level TEXT,
    growth_rate DECIMAL,
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get industry trend summary
CREATE OR REPLACE FUNCTION get_industry_trend_summary(industry_param TEXT)
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
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending careers across all industries
CREATE OR REPLACE FUNCTION get_trending_careers(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    career_id TEXT,
    title TEXT,
    industry TEXT,
    trend_score DECIMAL,
    trend_direction TEXT,
    demand_level TEXT,
    growth_rate DECIMAL,
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
        ct.market_insights
    FROM career_trends ct
    JOIN careers c ON c.id = ct.career_id
    WHERE ct.last_updated >= NOW() - INTERVAL '2 months' -- Only recent data
    ORDER BY ct.trend_score DESC, ct.growth_rate DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_career_trends_updated_at
    BEFORE UPDATE ON career_trends
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_industry_trends_updated_at
    BEFORE UPDATE ON industry_trends
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trend_update_log_updated_at
    BEFORE UPDATE ON trend_update_log
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
