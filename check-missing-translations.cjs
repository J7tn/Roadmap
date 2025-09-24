#!/usr/bin/env node

/**
 * Check Missing Translations in Language-Specific Tables
 * 
 * This script analyzes what translations are missing in the new language-specific table structure
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const LANGUAGES = ['en', 'ja', 'de', 'es', 'fr'];

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();
    
    return !error && data;
  } catch (error) {
    return false;
  }
}

async function getTableRowCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    return error ? 0 : count;
  } catch (error) {
    return 0;
  }
}

async function checkCoreTables() {
  console.log('🔍 Checking core tables...');
  
  const coreTables = ['careers_core', 'industries_core'];
  
  for (const table of coreTables) {
    const exists = await checkTableExists(table);
    const count = exists ? await getTableRowCount(table) : 0;
    
    console.log(`   ${exists ? '✅' : '❌'} ${table}: ${exists ? `${count} rows` : 'NOT EXISTS'}`);
  }
}

async function checkLanguageSpecificTables() {
  console.log('\n🌍 Checking language-specific tables...');
  
  for (const language of LANGUAGES) {
    console.log(`\n📝 Language: ${language.toUpperCase()}`);
    
    // Check career tables
    const careerTable = `careers_${language}`;
    const careerExists = await checkTableExists(careerTable);
    const careerCount = careerExists ? await getTableRowCount(careerTable) : 0;
    console.log(`   ${careerExists ? '✅' : '❌'} ${careerTable}: ${careerExists ? `${careerCount} rows` : 'NOT EXISTS'}`);
    
    // Check industry tables
    const industryTable = `industries_${language}`;
    const industryExists = await checkTableExists(industryTable);
    const industryCount = industryExists ? await getTableRowCount(industryTable) : 0;
    console.log(`   ${industryExists ? '✅' : '❌'} ${industryTable}: ${industryExists ? `${industryCount} rows` : 'NOT EXISTS'}`);
    
    // Check trend tables (only for some languages)
    if (['en', 'ja', 'de'].includes(language)) {
      const trendTable = `career_trends_${language}`;
      const trendExists = await checkTableExists(trendTable);
      const trendCount = trendExists ? await getTableRowCount(trendTable) : 0;
      console.log(`   ${trendExists ? '✅' : '❌'} ${trendTable}: ${trendExists ? `${trendCount} rows` : 'NOT EXISTS'}`);
    }
  }
}

async function checkOldTables() {
  console.log('\n📊 Checking old table structure...');
  
  const oldTables = [
    'careers',
    'career_paths', 
    'translations',
    'career_trends',
    'career_trend_translations'
  ];
  
  for (const table of oldTables) {
    const exists = await checkTableExists(table);
    const count = exists ? await getTableRowCount(table) : 0;
    
    console.log(`   ${exists ? '✅' : '❌'} ${table}: ${exists ? `${count} rows` : 'NOT EXISTS'}`);
  }
}

async function analyzeMissingData() {
  console.log('\n🔍 Analyzing missing data...');
  
  // Check if we have core data
  const coreCareersCount = await getTableRowCount('careers_core');
  const coreIndustriesCount = await getTableRowCount('industries_core');
  
  console.log(`\n📊 Core Data Status:`);
  console.log(`   Careers Core: ${coreCareersCount} records`);
  console.log(`   Industries Core: ${coreIndustriesCount} records`);
  
  if (coreCareersCount === 0) {
    console.log('\n⚠️  WARNING: No careers in careers_core table!');
    console.log('   You need to populate the core tables first.');
  }
  
  if (coreIndustriesCount === 0) {
    console.log('\n⚠️  WARNING: No industries in industries_core table!');
    console.log('   You need to populate the core tables first.');
  }
  
  // Check language coverage
  console.log('\n🌍 Language Coverage Analysis:');
  
  for (const language of LANGUAGES) {
    const careerTable = `careers_${language}`;
    const industryTable = `industries_${language}`;
    
    const careerCount = await getTableRowCount(careerTable);
    const industryCount = await getTableRowCount(industryTable);
    
    const careerCoverage = coreCareersCount > 0 ? (careerCount / coreCareersCount * 100).toFixed(1) : 0;
    const industryCoverage = coreIndustriesCount > 0 ? (industryCount / coreIndustriesCount * 100).toFixed(1) : 0;
    
    console.log(`   ${language.toUpperCase()}:`);
    console.log(`     Careers: ${careerCount}/${coreCareersCount} (${careerCoverage}%)`);
    console.log(`     Industries: ${industryCount}/${coreIndustriesCount} (${industryCoverage}%)`);
  }
}

async function getSampleData() {
  console.log('\n📋 Sample Data Preview:');
  
  // Show sample from careers_core
  try {
    const { data: careers, error } = await supabase
      .from('careers_core')
      .select('*')
      .limit(3);
    
    if (!error && careers && careers.length > 0) {
      console.log('\n💼 Sample Careers (Core):');
      careers.forEach(career => {
        console.log(`   - ${career.id} (${career.level})`);
      });
    }
  } catch (error) {
    console.log('   No careers_core data available');
  }
  
  // Show sample from industries_core
  try {
    const { data: industries, error } = await supabase
      .from('industries_core')
      .select('*')
      .limit(3);
    
    if (!error && industries && industries.length > 0) {
      console.log('\n🏭 Sample Industries (Core):');
      industries.forEach(industry => {
        console.log(`   - ${industry.id}`);
      });
    }
  } catch (error) {
    console.log('   No industries_core data available');
  }
  
  // Show sample from English careers
  try {
    const { data: careersEn, error } = await supabase
      .from('careers_en')
      .select('career_id, title')
      .limit(3);
    
    if (!error && careersEn && careersEn.length > 0) {
      console.log('\n🇺🇸 Sample Careers (English):');
      careersEn.forEach(career => {
        console.log(`   - ${career.career_id}: ${career.title}`);
      });
    }
  } catch (error) {
    console.log('   No careers_en data available');
  }
}

async function main() {
  console.log('🔍 Checking Missing Translations in Language-Specific Tables');
  console.log('=' * 60);
  
  try {
    await checkCoreTables();
    await checkLanguageSpecificTables();
    await checkOldTables();
    await analyzeMissingData();
    await getSampleData();
    
    console.log('\n📋 Next Steps:');
    console.log('   1. If core tables are empty, run: populate-language-specific-tables.cjs');
    console.log('   2. If language tables are missing, run: create-language-specific-tables.sql');
    console.log('   3. If translations are incomplete, run the population script');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  }
}

main();
