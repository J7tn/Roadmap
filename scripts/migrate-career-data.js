#!/usr/bin/env node

/**
 * Career Data Migration Script
 * Migrates all career data from JSON files to Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
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
 * Convert career node to Supabase format
 */
function convertCareerNodeToSupabase(careerNode, careerPath) {
  return {
    id: careerNode.id,
    title: careerNode.t,
    description: careerNode.d,
    skills: careerNode.s || [],
    salary: careerNode.sr || '',
    experience: careerNode.te || '',
    level: careerNode.l,
    industry: careerPath.cat,
    job_titles: careerNode.jt || [],
    certifications: careerNode.c || [],
    requirements: careerNode.r || {},
    career_path_id: careerPath.id,
    career_path_name: careerPath.n,
    career_path_category: careerPath.cat
  };
}

/**
 * Migrate career paths to Supabase
 */
async function migrateCareerPaths(careerPaths) {
  console.log('🔄 Migrating career paths...');
  
  const careerPathData = careerPaths.map(path => ({
    id: path.id,
    name: path.n,
    category: path.cat,
    description: `Career path for ${path.n}`,
    total_careers: path.nodes ? path.nodes.length : 0
  }));

  const { data, error } = await supabase
    .from('career_paths')
    .upsert(careerPathData, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error migrating career paths:', error);
    throw error;
  }

  console.log(`✅ Migrated ${careerPathData.length} career paths`);
}

/**
 * Migrate careers to Supabase
 */
async function migrateCareers(careerPaths) {
  console.log('🔄 Migrating careers...');
  
  const allCareers = [];
  
  for (const careerPath of careerPaths) {
    if (!careerPath.nodes) continue;
    
    for (const careerNode of careerPath.nodes) {
      const supabaseCareer = convertCareerNodeToSupabase(careerNode, careerPath);
      allCareers.push(supabaseCareer);
    }
  }

  console.log(`📊 Total careers to migrate: ${allCareers.length}`);

  // Migrate in batches to avoid Supabase limits
  const batchSize = 100;
  let migratedCount = 0;

  for (let i = 0; i < allCareers.length; i += batchSize) {
    const batch = allCareers.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('careers')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error migrating batch ${Math.floor(i / batchSize) + 1}:`, error);
      throw error;
    }

    migratedCount += batch.length;
    console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}: ${migratedCount}/${allCareers.length} careers`);
  }

  console.log(`✅ Successfully migrated ${migratedCount} careers`);
}

/**
 * Create career transitions
 */
async function createCareerTransitions(careerPaths) {
  console.log('🔄 Creating career transitions...');
  
  const transitions = [];
  
  for (const careerPath of careerPaths) {
    if (!careerPath.nodes || careerPath.nodes.length < 2) continue;
    
    for (let i = 0; i < careerPath.nodes.length - 1; i++) {
      const fromCareer = careerPath.nodes[i];
      const toCareer = careerPath.nodes[i + 1];
      
      // Determine transition type
      let transitionType = 'promotion';
      if (fromCareer.l === toCareer.l) {
        transitionType = 'lateral';
      }
      
      // Calculate difficulty score (1-10)
      const levelDiff = getLevelDifference(fromCareer.l, toCareer.l);
      const difficultyScore = Math.min(10, Math.max(1, 5 + levelDiff));
      
      // Find common skills
      const commonSkills = (fromCareer.s || []).filter(skill => 
        (toCareer.s || []).includes(skill)
      );
      
      // Find skill gaps
      const skillGaps = (toCareer.s || []).filter(skill => 
        !(fromCareer.s || []).includes(skill)
      );
      
      transitions.push({
        from_career_id: fromCareer.id,
        to_career_id: toCareer.id,
        transition_type: transitionType,
        difficulty_score: difficultyScore,
        common_skills: commonSkills,
        skill_gaps: skillGaps,
        estimated_time_months: estimateTransitionTime(fromCareer.l, toCareer.l),
        success_rate: calculateSuccessRate(difficultyScore, commonSkills.length)
      });
    }
  }

  console.log(`📊 Total transitions to create: ${transitions.length}`);

  // Create transitions in batches
  const batchSize = 100;
  let createdCount = 0;

  for (let i = 0; i < transitions.length; i += batchSize) {
    const batch = transitions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('career_transitions')
      .upsert(batch, { onConflict: 'from_career_id,to_career_id' });

    if (error) {
      console.error(`❌ Error creating transition batch ${Math.floor(i / batchSize) + 1}:`, error);
      throw error;
    }

    createdCount += batch.length;
    console.log(`✅ Created transition batch ${Math.floor(i / batchSize) + 1}: ${createdCount}/${transitions.length} transitions`);
  }

  console.log(`✅ Successfully created ${createdCount} career transitions`);
}

/**
 * Helper functions
 */
function getLevelDifference(fromLevel, toLevel) {
  const levels = { 'E': 1, 'I': 2, 'A': 3, 'X': 4 };
  return levels[toLevel] - levels[fromLevel];
}

function estimateTransitionTime(fromLevel, toLevel) {
  const levelDiff = getLevelDifference(fromLevel, toLevel);
  if (levelDiff === 0) return 6; // Lateral move
  if (levelDiff === 1) return 12; // One level up
  if (levelDiff === 2) return 24; // Two levels up
  return 36; // Three levels up
}

function calculateSuccessRate(difficultyScore, commonSkillsCount) {
  const baseRate = 0.7; // 70% base success rate
  const skillBonus = Math.min(0.2, commonSkillsCount * 0.05); // Up to 20% bonus for skills
  const difficultyPenalty = (difficultyScore - 5) * 0.05; // Penalty for high difficulty
  
  return Math.max(0.1, Math.min(0.95, baseRate + skillBonus - difficultyPenalty));
}

/**
 * Main migration function
 */
async function main() {
  try {
    console.log('🚀 Starting career data migration...');
    
    // Load career path files
    const careerPaths = loadCareerPathFiles();
    
    // Migrate career paths
    await migrateCareerPaths(careerPaths);
    
    // Migrate careers
    await migrateCareers(careerPaths);
    
    // Create career transitions
    await createCareerTransitions(careerPaths);
    
    console.log('🎉 Migration completed successfully!');
    
    // Display summary
    const totalCareers = careerPaths.reduce((sum, path) => sum + (path.nodes?.length || 0), 0);
    const totalTransitions = careerPaths.reduce((sum, path) => {
      if (!path.nodes || path.nodes.length < 2) return sum;
      return sum + (path.nodes.length - 1);
    }, 0);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Career Paths: ${careerPaths.length}`);
    console.log(`   Careers: ${totalCareers}`);
    console.log(`   Transitions: ${totalTransitions}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = { main };
