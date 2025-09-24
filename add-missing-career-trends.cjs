const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addMissingCareerTrends() {
  console.log('🔧 Adding missing career trends...');

  try {
    // Get all career trends from original table
    const { data: originalTrends, error: originalError } = await supabase
      .from('career_trends')
      .select('*');

    if (originalError) {
      console.error('   ❌ Error fetching original trends:', originalError.message);
      return;
    }

    // Get existing career trends from new table
    const { data: existingTrends, error: existingError } = await supabase
      .from('career_trends_new')
      .select('career_id');

    if (existingError) {
      console.error('   ❌ Error fetching existing trends:', existingError.message);
      return;
    }

    const existingIds = new Set(existingTrends.map(t => t.career_id));
    const missingTrends = originalTrends.filter(t => !existingIds.has(t.career_id));

    console.log(`   📊 Found ${missingTrends.length} missing career trends to add`);

    if (missingTrends.length === 0) {
      console.log('   ✅ No missing career trends to add');
      return;
    }

    // Get valid career IDs from new careers table
    const { data: validCareers } = await supabase
      .from('careers_new')
      .select('id');

    const validCareerIds = new Set(validCareers?.map(c => c.id) || []);

    // Filter trends that have valid career IDs
    const trendsToAdd = missingTrends
      .filter(trend => validCareerIds.has(trend.career_id))
      .map(trend => ({
        career_id: trend.career_id,
        trend_score: trend.trend_score,
        trend_direction: trend.trend_direction,
        demand_level: trend.demand_level,
        growth_rate: trend.growth_rate,
        market_insights: trend.market_insights,
        key_skills_trending: trend.key_skills_trending,
        salary_trend: trend.salary_trend,
        job_availability_score: trend.job_availability_score,
        top_locations: trend.top_locations,
        remote_work_trend: trend.remote_work_trend,
        industry_impact: trend.industry_impact,
        automation_risk: trend.automation_risk,
        future_outlook: trend.future_outlook,
        currency_code: trend.currency_code || 'USD',
        salary_data: trend.salary_data,
        data_source: trend.data_source || 'chat2api',
        confidence_score: trend.confidence_score,
        last_updated: trend.last_updated,
        next_update_due: trend.next_update_due
      }));

    const trendsWithInvalidCareers = missingTrends.filter(trend => !validCareerIds.has(trend.career_id));

    console.log(`   📊 Adding ${trendsToAdd.length} trends with valid career IDs`);
    console.log(`   📊 ${trendsWithInvalidCareers.length} trends have invalid career IDs (skipped)`);

    if (trendsWithInvalidCareers.length > 0) {
      console.log('   📊 Trends with invalid career IDs:');
      trendsWithInvalidCareers.slice(0, 10).forEach(trend => {
        console.log(`     - ${trend.career_id}`);
      });
      if (trendsWithInvalidCareers.length > 10) {
        console.log(`     ... and ${trendsWithInvalidCareers.length - 10} more`);
      }
    }

    // Insert trends in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < trendsToAdd.length; i += batchSize) {
      const batch = trendsToAdd.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from('career_trends_new')
          .upsert(batch, { onConflict: 'career_id' });
        
        if (error) {
          console.error(`   ❌ Error inserting trends batch ${Math.floor(i/batchSize) + 1}:`, error.message);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`   ✅ Inserted trends batch ${Math.floor(i/batchSize) + 1}: ${batch.length} trends`);
        }
      } catch (err) {
        console.error(`   ❌ Exception inserting trends batch ${Math.floor(i/batchSize) + 1}:`, err.message);
        errorCount += batch.length;
      }
    }

    console.log(`   📊 Results: ${successCount} successful, ${errorCount} errors`);

  } catch (error) {
    console.error('❌ Failed to add missing career trends:', error);
  }
}

addMissingCareerTrends().catch(console.error);
