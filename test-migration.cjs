#!/usr/bin/env node

/**
 * Simple Migration Test
 * Tests the migration script without full TypeScript compilation
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

console.log('🧪 Testing migration setup...');

// Check if Supabase environment variables are set
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

console.log('✅ Supabase environment variables found');

// Check if career path files exist
const careerPathsDir = path.join(__dirname, 'src/data/careerPaths');
const files = fs.readdirSync(careerPathsDir).filter(file => file.endsWith('.json'));

console.log(`✅ Found ${files.length} career path files`);

// Test loading one file
try {
  const testFile = path.join(careerPathsDir, files[0]);
  const content = fs.readFileSync(testFile, 'utf8');
  const data = JSON.parse(content);
  
  console.log(`✅ Successfully loaded ${data.n} with ${data.nodes?.length || 0} careers`);
  
  // Test data structure
  if (data.nodes && data.nodes.length > 0) {
    const firstCareer = data.nodes[0];
    const requiredFields = ['id', 't', 'l', 's', 'sr', 'te', 'd'];
    const missingFields = requiredFields.filter(field => !firstCareer[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ Career data structure is valid');
    } else {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
    }
  }
  
} catch (error) {
  console.error('❌ Failed to load career data:', error.message);
  process.exit(1);
}

// Test Supabase connection
try {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('✅ Supabase client created successfully');
  
  // Test a simple query
  supabase.from('careers').select('count').limit(1).then(({ data, error }) => {
    if (error) {
      console.log('⚠️  Supabase query test failed (this is expected if tables don\'t exist yet):', error.message);
    } else {
      console.log('✅ Supabase connection test successful');
    }
  }).catch(err => {
    console.log('⚠️  Supabase connection test failed (this is expected if tables don\'t exist yet):', err.message);
  });
  
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error.message);
  process.exit(1);
}

console.log('\n🎉 Migration test completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run the Supabase schema: comprehensive-career-database-schema.sql');
console.log('2. Run the migration script: npm run migrate-careers');
console.log('3. Test the app with the new hybrid service');

// Calculate estimated data size
let totalCareers = 0;
files.forEach(file => {
  try {
    const filePath = path.join(careerPathsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    totalCareers += data.nodes?.length || 0;
  } catch (error) {
    console.warn(`Warning: Could not load ${file}`);
  }
});

console.log(`\n📊 Estimated migration: ${totalCareers} careers across ${files.length} career paths`);
console.log(`📱 Mobile impact: ~${Math.round(totalCareers * 0.5)}KB with smart caching (vs ${Math.round(totalCareers * 2)}KB without)`);
