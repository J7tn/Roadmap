const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkIndustries() {
  console.log('🔍 Checking career industries in database...');
  
  const { data, error } = await supabase
    .from('career_nodes_with_translations')
    .select('career_node_id, title, industry')
    .limit(10);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📊 Sample career industries:');
  data.forEach((career, index) => {
    console.log(`  ${index + 1}. ${career.title} - Industry: ${career.industry}`);
  });
  
  // Check unique industries
  const { data: industries, error: industryError } = await supabase
    .from('career_nodes_with_translations')
    .select('industry')
    .not('industry', 'is', null);
    
  if (!industryError) {
    const uniqueIndustries = [...new Set(industries.map(i => i.industry))];
    console.log('\n🏭 Unique industries in database:');
    uniqueIndustries.forEach(industry => console.log(`  - ${industry}`));
  }
  
  // Check business careers specifically
  console.log('\n💼 Business careers:');
  const { data: businessCareers, error: businessError } = await supabase
    .from('career_nodes_with_translations')
    .select('career_node_id, title, industry')
    .eq('industry', 'business')
    .limit(5);
    
  if (!businessError) {
    businessCareers.forEach((career, index) => {
      console.log(`  ${index + 1}. ${career.title} - Industry: ${career.industry}`);
    });
  }
  
  // Check finance careers specifically
  console.log('\n💰 Finance careers:');
  const { data: financeCareers, error: financeError } = await supabase
    .from('career_nodes_with_translations')
    .select('career_node_id, title, industry')
    .eq('industry', 'finance')
    .limit(5);
    
  if (!financeError) {
    financeCareers.forEach((career, index) => {
      console.log(`  ${index + 1}. ${career.title} - Industry: ${career.industry}`);
    });
  }
}

checkIndustries().catch(console.error);
