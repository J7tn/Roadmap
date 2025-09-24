const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableSchema() {
  console.log('🔍 Checking table schemas...');

  try {
    // Check industry_translations table structure by trying to select specific columns
    console.log('\n📋 Checking industry_translations columns...');
    
    const testColumns = ['industry_id', 'language_code', 'name', 'description', 'created_at', 'updated_at'];
    
    for (const column of testColumns) {
      try {
        const { data, error } = await supabase
          .from('industry_translations')
          .select(column)
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Column '${column}': ${error.message}`);
        } else {
          console.log(`   ✅ Column '${column}': Exists`);
        }
      } catch (err) {
        console.log(`   ❌ Column '${column}': ${err.message}`);
      }
    }

    // Try to get all data to see what columns actually exist
    console.log('\n📋 Getting sample data to see actual structure...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('industry_translations')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log(`   ❌ Error getting sample data: ${sampleError.message}`);
    } else if (sampleData && sampleData.length > 0) {
      console.log('   ✅ Sample data structure:');
      console.log('   ', Object.keys(sampleData[0]));
    } else {
      console.log('   📊 No data in table');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

checkTableSchema().catch(console.error);
