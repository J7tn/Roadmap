const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkIndustriesSchema() {
  console.log('🔍 Checking industries_new table schema...');

  try {
    // Get sample data to see actual structure
    const { data: sampleData, error: sampleError } = await supabase
      .from('industries_new')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log(`   ❌ Error getting sample data: ${sampleError.message}`);
    } else if (sampleData && sampleData.length > 0) {
      console.log('   ✅ Sample data structure:');
      console.log('   ', Object.keys(sampleData[0]));
      console.log('   Sample data:');
      console.log('   ', sampleData[0]);
    } else {
      console.log('   📊 No data in table');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

checkIndustriesSchema().catch(console.error);
