import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicateTranslations() {
  console.log('🧹 Cleaning up duplicate translation records...');

  try {
    // Get all translation records
    const { data: allTranslations, error: allError } = await supabase
      .from('translations')
      .select('*')
      .order('language_code', { ascending: true });

    if (allError) {
      console.error('❌ Error loading all translations:', allError);
      return;
    }

    console.log(`📊 Found ${allTranslations.length} translation records`);

    // Group by language code
    const groupedByLanguage = {};
    allTranslations.forEach(record => {
      if (!groupedByLanguage[record.language_code]) {
        groupedByLanguage[record.language_code] = [];
      }
      groupedByLanguage[record.language_code].push(record);
    });

    // For each language, keep only the latest record and delete the rest
    for (const [languageCode, records] of Object.entries(groupedByLanguage)) {
      if (records.length <= 1) {
        console.log(`✅ ${languageCode.toUpperCase()}: Only 1 record, keeping it`);
        continue;
      }

      console.log(`\n🔧 Processing ${languageCode.toUpperCase()} (${records.length} records):`);

      // Sort by created_at descending to get the latest record
      const sortedRecords = records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const latestRecord = sortedRecords[0];
      const recordsToDelete = sortedRecords.slice(1);

      console.log(`   📌 Keeping latest record: ID ${latestRecord.id} (${latestRecord.version}, ${latestRecord.created_at})`);
      console.log(`   🗑️  Deleting ${recordsToDelete.length} older records...`);

      // Delete older records
      for (const record of recordsToDelete) {
        const { error: deleteError } = await supabase
          .from('translations')
          .delete()
          .eq('id', record.id);

        if (deleteError) {
          console.error(`   ❌ Error deleting record ${record.id}:`, deleteError);
        } else {
          console.log(`   ✅ Deleted record ${record.id} (${record.version})`);
        }
      }
    }

    // Verify the cleanup
    console.log('\n🔍 Verifying cleanup...');
    const { data: finalTranslations, error: finalError } = await supabase
      .from('translations')
      .select('language_code, version, created_at')
      .order('language_code', { ascending: true });

    if (finalError) {
      console.error('❌ Error verifying cleanup:', finalError);
    } else {
      console.log(`📊 Final result: ${finalTranslations.length} translation records`);
      
      // Group and display final results
      const finalGrouped = {};
      finalTranslations.forEach(record => {
        if (!finalGrouped[record.language_code]) {
          finalGrouped[record.language_code] = [];
        }
        finalGrouped[record.language_code].push(record);
      });

      Object.entries(finalGrouped).forEach(([languageCode, records]) => {
        if (records.length === 1) {
          console.log(`   ✅ ${languageCode.toUpperCase()}: 1 record (${records[0].version})`);
        } else {
          console.log(`   ⚠️  ${languageCode.toUpperCase()}: ${records.length} records (still has duplicates!)`);
        }
      });
    }

    console.log('\n✅ Cleanup completed successfully!');
    console.log('🎯 The dynamic translation loading should now work properly.');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDuplicateTranslations();
