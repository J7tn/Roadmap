#!/usr/bin/env node

/**
 * Generate Trend Data Script
 * Generates diverse trend data for all careers in Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Career paths directory
const CAREER_PATHS_DIR = path.join(__dirname, '../src/data/careerPaths');

/**
 * Load all career path JSON files
 */
function loadCareerPathFiles() {
  const files = fs.readdirSync(CAREER_PATHS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(CAREER_PATHS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    });
  
  console.log(`📁 Loaded ${files.length} career path files`);
  return files;
}

/**
 * Generate realistic trend data for a career
 */
function generateTrendData(career, industry) {
  // Industry-specific trend patterns
  const industryPatterns = {
    'tech': {
      baseScore: 8.5,
      growthRate: 15.0,
      trendingSkills: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Python', 'JavaScript'],
      topLocations: ['San Francisco', 'Seattle', 'Austin', 'New York', 'Boston'],
      remoteWork: 8.5,
      automationRisk: 3.0
    },
    'healthcare': {
      baseScore: 8.0,
      growthRate: 12.0,
      trendingSkills: ['Telemedicine', 'Data Analytics', 'AI Diagnostics', 'Patient Care', 'Medical Technology'],
      topLocations: ['Boston', 'Philadelphia', 'Cleveland', 'Rochester', 'Baltimore'],
      remoteWork: 4.0,
      automationRisk: 2.0
    },
    'finance': {
      baseScore: 7.5,
      growthRate: 8.0,
      trendingSkills: ['Fintech', 'Blockchain', 'Risk Management', 'Data Science', 'Regulatory Compliance'],
      topLocations: ['New York', 'Chicago', 'San Francisco', 'Boston', 'Charlotte'],
      remoteWork: 6.0,
      automationRisk: 4.5
    },
    'education': {
      baseScore: 7.0,
      growthRate: 6.0,
      trendingSkills: ['EdTech', 'Online Learning', 'Data Analytics', 'Student Success', 'Curriculum Design'],
      topLocations: ['Boston', 'New York', 'Los Angeles', 'Chicago', 'Washington DC'],
      remoteWork: 7.0,
      automationRisk: 3.5
    },
    'manufacturing': {
      baseScore: 6.5,
      growthRate: 4.0,
      trendingSkills: ['Automation', 'Quality Control', 'Lean Manufacturing', 'IoT', 'Supply Chain'],
      topLocations: ['Detroit', 'Cleveland', 'Milwaukee', 'Pittsburgh', 'Cincinnati'],
      remoteWork: 2.0,
      automationRisk: 7.0
    },
    'retail': {
      baseScore: 6.0,
      growthRate: 3.0,
      trendingSkills: ['E-commerce', 'Customer Experience', 'Data Analytics', 'Omnichannel', 'Digital Marketing'],
      topLocations: ['New York', 'Los Angeles', 'Chicago', 'Atlanta', 'Dallas'],
      remoteWork: 3.0,
      automationRisk: 6.0
    },
    'creative': {
      baseScore: 7.5,
      growthRate: 10.0,
      trendingSkills: ['Digital Design', 'Video Production', 'Social Media', 'Brand Strategy', 'User Experience'],
      topLocations: ['Los Angeles', 'New York', 'San Francisco', 'Austin', 'Portland'],
      remoteWork: 8.0,
      automationRisk: 4.0
    },
    'marketing': {
      baseScore: 7.0,
      growthRate: 8.0,
      trendingSkills: ['Digital Marketing', 'Data Analytics', 'SEO/SEM', 'Social Media', 'Marketing Automation'],
      topLocations: ['New York', 'San Francisco', 'Chicago', 'Boston', 'Austin'],
      remoteWork: 7.5,
      automationRisk: 5.0
    },
    'legal': {
      baseScore: 6.5,
      growthRate: 5.0,
      trendingSkills: ['Legal Technology', 'Compliance', 'Contract Management', 'Data Privacy', 'Legal Research'],
      topLocations: ['New York', 'Washington DC', 'Los Angeles', 'Chicago', 'Boston'],
      remoteWork: 6.0,
      automationRisk: 6.5
    },
    'engineering': {
      baseScore: 8.0,
      growthRate: 9.0,
      trendingSkills: ['CAD/Design', 'Project Management', 'Quality Assurance', 'Innovation', 'Technical Leadership'],
      topLocations: ['Detroit', 'Houston', 'Seattle', 'Boston', 'San Francisco'],
      remoteWork: 5.0,
      automationRisk: 4.0
    },
    'science': {
      baseScore: 7.5,
      growthRate: 7.0,
      trendingSkills: ['Data Analysis', 'Research Methods', 'Laboratory Techniques', 'Scientific Writing', 'Collaboration'],
      topLocations: ['Boston', 'San Francisco', 'Washington DC', 'Research Triangle', 'San Diego'],
      remoteWork: 4.0,
      automationRisk: 3.0
    }
  };

  // Get industry pattern or default
  const pattern = industryPatterns[industry] || {
    baseScore: 6.5,
    growthRate: 5.0,
    trendingSkills: ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Leadership'],
    topLocations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    remoteWork: 5.0,
    automationRisk: 5.0
  };

  // Add some randomness to make each career unique
  const randomFactor = () => (Math.random() - 0.5) * 2; // -1 to 1
  
  const trendScore = Math.max(1.0, Math.min(10.0, pattern.baseScore + randomFactor()));
  const growthRate = Math.max(-5.0, pattern.growthRate + randomFactor() * 5);
  const jobAvailability = Math.max(1.0, Math.min(10.0, trendScore + randomFactor()));
  const remoteWork = Math.max(1.0, Math.min(10.0, pattern.remoteWork + randomFactor()));
  const automationRisk = Math.max(1.0, Math.min(10.0, pattern.automationRisk + randomFactor()));

  // Determine trend direction
  let trendDirection = 'stable';
  if (growthRate > 8) trendDirection = 'rising';
  else if (growthRate < 2) trendDirection = 'declining';

  // Determine demand level
  let demandLevel = 'medium';
  if (trendScore > 8) demandLevel = 'high';
  else if (trendScore < 5) demandLevel = 'low';

  // Generate market insights
  const insights = [
    `Strong growth potential in ${industry} sector`,
    `Increasing demand for specialized skills`,
    `Technology integration driving opportunities`,
    `Market expansion creating new roles`,
    `Industry transformation opening doors`
  ];

  const futureOutlooks = [
    'Very positive outlook with strong growth expected',
    'Positive trends with expanding opportunities',
    'Stable market with consistent demand',
    'Growing field with emerging specializations',
    'Strong future prospects in evolving industry'
  ];

  return {
    career_id: career.id,
    trend_score: Math.round(trendScore * 100) / 100,
    trend_direction: trendDirection,
    demand_level: demandLevel,
    growth_rate: Math.round(growthRate * 100) / 100,
    market_insights: insights[Math.floor(Math.random() * insights.length)],
    key_skills_trending: pattern.trendingSkills.slice(0, 3 + Math.floor(Math.random() * 3)),
    salary_trend: growthRate > 5 ? 'Increasing' : growthRate < 0 ? 'Decreasing' : 'Stable',
    job_availability_score: Math.round(jobAvailability * 100) / 100,
    top_locations: pattern.topLocations.slice(0, 3 + Math.floor(Math.random() * 2)),
    remote_work_trend: Math.round(remoteWork * 100) / 100,
    industry_impact: `Strong impact from ${industry} industry trends`,
    automation_risk: Math.round(automationRisk * 100) / 100,
    future_outlook: futureOutlooks[Math.floor(Math.random() * futureOutlooks.length)],
    confidence_score: Math.round((7 + Math.random() * 2) * 100) / 100,
    last_updated: new Date().toISOString()
  };
}

/**
 * Generate trend data for all careers
 */
async function generateAllTrendData() {
  console.log('🚀 Starting trend data generation...');
  
  try {
    // Load all career paths
    const careerPaths = loadCareerPathFiles();
    
    // Collect all careers
    const allCareers = [];
    for (const careerPath of careerPaths) {
      for (const career of careerPath.nodes) {
        allCareers.push({
          ...career,
          industry: careerPath.cat
        });
      }
    }
    
    console.log(`📊 Found ${allCareers.length} careers to generate trend data for`);
    
    // Generate trend data for each career
    const trendDataList = [];
    for (const career of allCareers) {
      const trendData = generateTrendData(career, career.industry);
      trendDataList.push(trendData);
    }
    
    console.log(`✅ Generated trend data for ${trendDataList.length} careers`);
    
    // Insert trend data into Supabase
    console.log('💾 Inserting trend data into Supabase...');
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < trendDataList.length; i += batchSize) {
      const batch = trendDataList.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('career_trends')
        .upsert(batch);
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
        // Try individual inserts for this batch
        for (const trendData of batch) {
          const { error: individualError } = await supabase
            .from('career_trends')
            .upsert([trendData]);
          
          if (!individualError) {
            successCount++;
          } else {
            console.error(`❌ Error inserting ${trendData.career_id}:`, individualError);
          }
        }
      } else {
        successCount += batch.length;
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(trendDataList.length/batchSize)}`);
      }
    }
    
    console.log('🎉 Successfully generated and inserted trend data!');
    console.log(`📊 ${successCount}/${trendDataList.length} careers now have unique trend data`);
    
    // Show some examples
    console.log('\n📋 Sample trend data generated:');
    for (let i = 0; i < Math.min(5, trendDataList.length); i++) {
      const trend = trendDataList[i];
      console.log(`   ${trend.career_id}: Score ${trend.trend_score}/10, ${trend.trend_direction}, ${trend.growth_rate}% growth`);
    }
    
  } catch (error) {
    console.error('❌ Error generating trend data:', error);
  }
}

// Run the script
if (require.main === module) {
  generateAllTrendData()
    .then(() => {
      console.log('\n✅ Trend data generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { generateAllTrendData, generateTrendData };
