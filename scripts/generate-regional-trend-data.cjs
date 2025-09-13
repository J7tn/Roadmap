#!/usr/bin/env node

/**
 * Generate Regional Trend Data Script
 * Generates region-specific trend data for all careers in Supabase
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

// Regional data patterns
const REGIONAL_PATTERNS = {
  'north-america': {
    name: 'North America',
    countries: ['United States', 'Canada', 'Mexico'],
    topCities: ['New York', 'San Francisco', 'Toronto', 'Vancouver', 'Mexico City', 'Los Angeles', 'Chicago', 'Boston'],
    economicFactors: {
      techGrowth: 1.2,
      healthcareGrowth: 1.1,
      manufacturingGrowth: 0.9,
      remoteWork: 1.3,
      salaryMultiplier: 1.0
    }
  },
  'europe': {
    name: 'Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland'],
    topCities: ['London', 'Berlin', 'Paris', 'Amsterdam', 'Stockholm', 'Zurich', 'Munich', 'Frankfurt'],
    economicFactors: {
      techGrowth: 1.1,
      healthcareGrowth: 1.0,
      manufacturingGrowth: 1.0,
      remoteWork: 1.1,
      salaryMultiplier: 0.85
    }
  },
  'asia-pacific': {
    name: 'Asia Pacific',
    countries: ['Japan', 'South Korea', 'Singapore', 'Australia', 'New Zealand', 'Hong Kong', 'Taiwan'],
    topCities: ['Tokyo', 'Seoul', 'Singapore', 'Sydney', 'Melbourne', 'Hong Kong', 'Taipei', 'Auckland'],
    economicFactors: {
      techGrowth: 1.4,
      healthcareGrowth: 1.2,
      manufacturingGrowth: 1.3,
      remoteWork: 0.9,
      salaryMultiplier: 0.7
    }
  },
  'south-america': {
    name: 'South America',
    countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay'],
    topCities: ['São Paulo', 'Buenos Aires', 'Santiago', 'Bogotá', 'Lima', 'Montevideo'],
    economicFactors: {
      techGrowth: 1.3,
      healthcareGrowth: 1.1,
      manufacturingGrowth: 1.1,
      remoteWork: 1.0,
      salaryMultiplier: 0.4
    }
  },
  'africa': {
    name: 'Africa',
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana'],
    topCities: ['Cape Town', 'Johannesburg', 'Lagos', 'Nairobi', 'Cairo', 'Casablanca'],
    economicFactors: {
      techGrowth: 1.5,
      healthcareGrowth: 1.3,
      manufacturingGrowth: 1.2,
      remoteWork: 0.8,
      salaryMultiplier: 0.3
    }
  },
  'middle-east': {
    name: 'Middle East',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Israel', 'Qatar', 'Kuwait', 'Bahrain'],
    topCities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Tel Aviv', 'Doha', 'Kuwait City'],
    economicFactors: {
      techGrowth: 1.2,
      healthcareGrowth: 1.1,
      manufacturingGrowth: 1.0,
      remoteWork: 0.9,
      salaryMultiplier: 0.8
    }
  }
};

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
 * Generate region-specific trend data for a career
 */
function generateRegionalTrendData(career, industry, region) {
  const regionData = REGIONAL_PATTERNS[region];
  const factors = regionData.economicFactors;
  
  // Industry-specific trend patterns (base patterns)
  const industryPatterns = {
    'tech': {
      baseScore: 8.5,
      growthRate: 15.0,
      trendingSkills: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Python', 'JavaScript'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 8.5,
      automationRisk: 3.0
    },
    'healthcare': {
      baseScore: 8.0,
      growthRate: 12.0,
      trendingSkills: ['Telemedicine', 'Data Analytics', 'AI Diagnostics', 'Patient Care', 'Medical Technology'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 4.0,
      automationRisk: 2.0
    },
    'finance': {
      baseScore: 7.5,
      growthRate: 8.0,
      trendingSkills: ['Fintech', 'Blockchain', 'Risk Management', 'Data Science', 'Regulatory Compliance'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 6.0,
      automationRisk: 4.5
    },
    'education': {
      baseScore: 7.0,
      growthRate: 6.0,
      trendingSkills: ['EdTech', 'Online Learning', 'Data Analytics', 'Student Success', 'Curriculum Design'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 7.0,
      automationRisk: 3.5
    },
    'manufacturing': {
      baseScore: 6.5,
      growthRate: 4.0,
      trendingSkills: ['Automation', 'Quality Control', 'Lean Manufacturing', 'IoT', 'Supply Chain'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 2.0,
      automationRisk: 7.0
    },
    'retail': {
      baseScore: 6.0,
      growthRate: 3.0,
      trendingSkills: ['E-commerce', 'Customer Experience', 'Data Analytics', 'Omnichannel', 'Digital Marketing'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 3.0,
      automationRisk: 6.0
    },
    'creative': {
      baseScore: 7.5,
      growthRate: 10.0,
      trendingSkills: ['Digital Design', 'Video Production', 'Social Media', 'Brand Strategy', 'User Experience'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 8.0,
      automationRisk: 4.0
    },
    'marketing': {
      baseScore: 7.0,
      growthRate: 8.0,
      trendingSkills: ['Digital Marketing', 'Data Analytics', 'SEO/SEM', 'Social Media', 'Marketing Automation'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 7.5,
      automationRisk: 5.0
    },
    'legal': {
      baseScore: 6.5,
      growthRate: 5.0,
      trendingSkills: ['Legal Technology', 'Compliance', 'Contract Management', 'Data Privacy', 'Legal Research'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 6.0,
      automationRisk: 6.5
    },
    'engineering': {
      baseScore: 8.0,
      growthRate: 9.0,
      trendingSkills: ['CAD/Design', 'Project Management', 'Quality Assurance', 'Innovation', 'Technical Leadership'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 5.0,
      automationRisk: 4.0
    },
    'science': {
      baseScore: 7.5,
      growthRate: 7.0,
      trendingSkills: ['Data Analysis', 'Research Methods', 'Laboratory Techniques', 'Scientific Writing', 'Collaboration'],
      topLocations: regionData.topCities.slice(0, 5),
      remoteWork: 4.0,
      automationRisk: 3.0
    }
  };

  // Get industry pattern or default
  const pattern = industryPatterns[industry] || {
    baseScore: 6.5,
    growthRate: 5.0,
    trendingSkills: ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Leadership'],
    topLocations: regionData.topCities.slice(0, 5),
    remoteWork: 5.0,
    automationRisk: 5.0
  };

  // Apply regional factors
  const regionalGrowthFactor = factors.techGrowth; // Use tech growth as base, adjust per industry
  const regionalRemoteFactor = factors.remoteWork;
  
  // Add some randomness to make each career unique
  const randomFactor = () => (Math.random() - 0.5) * 2; // -1 to 1
  
  const trendScore = Math.max(1.0, Math.min(10.0, pattern.baseScore + randomFactor()));
  const growthRate = Math.max(-5.0, (pattern.growthRate * regionalGrowthFactor) + randomFactor() * 5);
  const jobAvailability = Math.max(1.0, Math.min(10.0, trendScore + randomFactor()));
  const remoteWork = Math.max(1.0, Math.min(10.0, pattern.remoteWork * regionalRemoteFactor + randomFactor()));
  const automationRisk = Math.max(1.0, Math.min(10.0, pattern.automationRisk + randomFactor()));

  // Determine trend direction
  let trendDirection = 'stable';
  if (growthRate > 8) trendDirection = 'rising';
  else if (growthRate < 2) trendDirection = 'declining';

  // Determine demand level
  let demandLevel = 'medium';
  if (trendScore > 8) demandLevel = 'high';
  else if (trendScore < 5) demandLevel = 'low';

  // Generate region-specific insights
  const insights = [
    `Strong growth potential in ${regionData.name} ${industry} sector`,
    `Increasing demand for specialized skills in ${regionData.name}`,
    `Technology integration driving opportunities across ${regionData.name}`,
    `Market expansion creating new roles in ${regionData.name}`,
    `Industry transformation opening doors in ${regionData.name}`
  ];

  const futureOutlooks = [
    `Very positive outlook with strong growth expected in ${regionData.name}`,
    `Positive trends with expanding opportunities across ${regionData.name}`,
    `Stable market with consistent demand in ${regionData.name}`,
    `Growing field with emerging specializations in ${regionData.name}`,
    `Strong future prospects in evolving ${regionData.name} industry`
  ];

  return {
    career_id: `${career.id}-${region}`, // Combine career ID with region
    trend_score: Math.round(trendScore * 100) / 100,
    trend_direction: trendDirection,
    demand_level: demandLevel,
    growth_rate: Math.round(growthRate * 100) / 100,
    market_insights: insights[Math.floor(Math.random() * insights.length)],
    key_skills_trending: pattern.trendingSkills.slice(0, 3 + Math.floor(Math.random() * 3)),
    salary_trend: growthRate > 5 ? 'Increasing' : growthRate < 0 ? 'Decreasing' : 'Stable',
    job_availability_score: Math.round(jobAvailability * 100) / 100,
    top_locations: pattern.topLocations,
    remote_work_trend: Math.round(remoteWork * 100) / 100,
    industry_impact: `Strong impact from ${industry} industry trends in ${regionData.name}`,
    automation_risk: Math.round(automationRisk * 100) / 100,
    future_outlook: futureOutlooks[Math.floor(Math.random() * futureOutlooks.length)],
    confidence_score: Math.round((7 + Math.random() * 2) * 100) / 100,
    last_updated: new Date().toISOString()
  };
}

/**
 * Generate regional trend data for all careers
 */
async function generateAllRegionalTrendData() {
  console.log('🚀 Starting regional trend data generation...');
  
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
    
    console.log(`📊 Found ${allCareers.length} careers to generate regional trend data for`);
    console.log(`🌍 Generating data for ${Object.keys(REGIONAL_PATTERNS).length} regions`);
    
    // Generate trend data for each career in each region
    const allTrendData = [];
    const regions = Object.keys(REGIONAL_PATTERNS);
    
    for (const region of regions) {
      console.log(`\n🌍 Generating data for ${REGIONAL_PATTERNS[region].name}...`);
      
      for (const career of allCareers) {
        const trendData = generateRegionalTrendData(career, career.industry, region);
        allTrendData.push(trendData);
      }
    }
    
    console.log(`✅ Generated regional trend data for ${allTrendData.length} career-region combinations`);
    
    // Insert trend data into Supabase
    console.log('💾 Inserting regional trend data into Supabase...');
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 100;
    let successCount = 0;
    
    for (let i = 0; i < allTrendData.length; i += batchSize) {
      const batch = allTrendData.slice(i, i + batchSize);
      
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
            console.error(`❌ Error inserting ${trendData.career_id} (${trendData.region}):`, individualError);
          }
        }
      } else {
        successCount += batch.length;
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allTrendData.length/batchSize)}`);
      }
    }
    
    console.log('🎉 Successfully generated and inserted regional trend data!');
    console.log(`📊 ${successCount}/${allTrendData.length} career-region combinations now have unique trend data`);
    
    // Show some examples
    console.log('\n📋 Sample regional trend data generated:');
    for (let i = 0; i < Math.min(10, allTrendData.length); i += 2) {
      const trend = allTrendData[i];
      console.log(`   ${trend.career_id} (${trend.region}): Score ${trend.trend_score}/10, ${trend.trend_direction}, ${trend.growth_rate}% growth`);
    }
    
  } catch (error) {
    console.error('❌ Error generating regional trend data:', error);
  }
}

// Run the script
if (require.main === module) {
  generateAllRegionalTrendData()
    .then(() => {
      console.log('\n✅ Regional trend data generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { generateAllRegionalTrendData, generateRegionalTrendData };
