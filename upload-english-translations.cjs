#!/usr/bin/env node

/**
 * Upload English translations to Supabase translations table
 * This script reads the local en.json file and uploads it to Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadEnglishTranslations() {
  try {
    console.log('🚀 Starting English translations upload...');
    
    // Read the English translations file
    const translationsPath = path.join(__dirname, 'src', 'locales', 'en.json');
    
    if (!fs.existsSync(translationsPath)) {
      console.error('❌ English translations file not found at:', translationsPath);
      process.exit(1);
    }
    
    const englishTranslations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
    console.log('📖 Loaded English translations from local file');
    console.log(`📊 Translation keys loaded: ${Object.keys(englishTranslations).length} main categories`);
    
    // Check if translations table exists and get its structure
    console.log('🔍 Checking translations table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('translations')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error accessing translations table:', tableError.message);
      console.log('💡 Make sure the translations table exists in your Supabase database');
      process.exit(1);
    }
    
    console.log('✅ Translations table is accessible');
    
    // Check if English translations already exist
    console.log('🔍 Checking for existing English translations...');
    const { data: existingTranslations, error: checkError } = await supabase
      .from('translations')
      .select('id, version, updated_at')
      .eq('language_code', 'en')
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking existing translations:', checkError.message);
      process.exit(1);
    }
    
    if (existingTranslations && existingTranslations.length > 0) {
      console.log(`📋 Found existing English translations (version: ${existingTranslations[0].version})`);
      console.log(`📅 Last updated: ${existingTranslations[0].updated_at}`);
      
      // Ask if user wants to update
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        rl.question('Do you want to update the existing translations? (y/N): ', resolve);
      });
      
      rl.close();
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Upload cancelled by user');
        process.exit(0);
      }
    }
    
    // Prepare the translation data for upload
    const translationData = {
      language_code: 'en',
      translation_data: englishTranslations,
      version: existingTranslations && existingTranslations.length > 0 
        ? existingTranslations[0].version + 1 
        : 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📤 Uploading English translations to Supabase...');
    console.log(`📊 Version: ${translationData.version}`);
    console.log(`📊 Translation keys: ${Object.keys(englishTranslations).length} main categories`);
    
    // Upload the translations
    const { data, error } = await supabase
      .from('translations')
      .upsert(translationData, { 
        onConflict: 'language_code,version',
        ignoreDuplicates: false 
      })
      .select();
    
    if (error) {
      console.error('❌ Error uploading translations:', error.message);
      console.error('Full error:', error);
      process.exit(1);
    }
    
    console.log('✅ Successfully uploaded English translations to Supabase!');
    console.log('📊 Upload details:');
    console.log(`   - Language: ${translationData.language_code}`);
    console.log(`   - Version: ${translationData.version}`);
    console.log(`   - Keys uploaded: ${Object.keys(englishTranslations).length} main categories`);
    console.log(`   - Total translation entries: ${JSON.stringify(englishTranslations).length} characters`);
    
    // Verify the upload
    console.log('🔍 Verifying upload...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('translations')
      .select('id, language_code, version, is_active, updated_at')
      .eq('language_code', 'en')
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1);
    
    if (verifyError) {
      console.error('❌ Error verifying upload:', verifyError.message);
    } else if (verifyData && verifyData.length > 0) {
      console.log('✅ Upload verified successfully!');
      console.log(`   - ID: ${verifyData[0].id}`);
      console.log(`   - Version: ${verifyData[0].version}`);
      console.log(`   - Active: ${verifyData[0].is_active}`);
      console.log(`   - Updated: ${verifyData[0].updated_at}`);
    }
    
    console.log('🎉 English translations are now available in Supabase!');
    console.log('💡 Your app will now load translations from Supabase instead of local files');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadEnglishTranslations()
  .then(() => {
    console.log('✨ Upload process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Upload process failed:', error);
    process.exit(1);
  });
