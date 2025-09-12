#!/usr/bin/env node

/**
 * Test Migration Results
 * Verifies that the migration was successful
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMigrationResults() {
  try {
    console.log('🧪 Testing migration results...');
    
    // Test 1: Count total careers
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('id', { count: 'exact' });
    
    if (careersError) {
      console.error('❌ Error counting careers:', careersError);
      return;
    }
    
    console.log(`✅ Total careers in database: ${careers.length}`);
    
    // Test 2: Get sample careers by industry
    const { data: techCareers, error: techError } = await supabase
      .from('careers')
      .select('id, title, industry, level')
      .eq('industry', 'tech')
      .limit(5);
    
    if (techError) {
      console.error('❌ Error getting tech careers:', techError);
    } else {
      console.log(`✅ Found ${techCareers.length} tech careers`);
      techCareers.forEach(career => {
        console.log(`   - ${career.title} (${career.level})`);
      });
    }
    
    // Test 3: Get careers by level
    const { data: entryCareers, error: entryError } = await supabase
      .from('careers')
      .select('id, title, industry, level')
      .eq('level', 'E')
      .limit(5);
    
    if (entryError) {
      console.error('❌ Error getting entry-level careers:', entryError);
    } else {
      console.log(`✅ Found ${entryCareers.length} entry-level careers`);
      entryCareers.forEach(career => {
        console.log(`   - ${career.title} (${career.industry})`);
      });
    }
    
    // Test 4: Search by skills
    const { data: skillCareers, error: skillError } = await supabase
      .from('careers')
      .select('id, title, skills')
      .contains('skills', ['JavaScript'])
      .limit(3);
    
    if (skillError) {
      console.error('❌ Error searching by skills:', skillError);
    } else {
      console.log(`✅ Found ${skillCareers.length} careers with JavaScript skills`);
      skillCareers.forEach(career => {
        console.log(`   - ${career.title}: ${career.skills.join(', ')}`);
      });
    }
    
    // Test 5: Get career by ID
    if (careers.length > 0) {
      const testCareerId = careers[0].id;
      const { data: career, error: careerError } = await supabase
        .from('careers')
        .select('*')
        .eq('id', testCareerId)
        .single();
      
      if (careerError) {
        console.error('❌ Error getting career by ID:', careerError);
      } else {
        console.log(`✅ Successfully retrieved career: ${career.title}`);
        console.log(`   Skills: ${career.skills.join(', ')}`);
        console.log(`   Level: ${career.level}`);
        console.log(`   Industry: ${career.industry}`);
      }
    }
    
    console.log('\n🎉 Migration test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total careers: ${careers.length}`);
    console.log(`   Tech careers: ${techCareers?.length || 0}`);
    console.log(`   Entry-level careers: ${entryCareers?.length || 0}`);
    console.log(`   JavaScript careers: ${skillCareers?.length || 0}`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Re-enable RLS in Supabase for security');
    console.log('2. Test the app with the new hybrid service');
    console.log('3. Build and deploy to Android Studio');
    
  } catch (error) {
    console.error('❌ Migration test failed:', error);
  }
}

// Run test
testMigrationResults();
