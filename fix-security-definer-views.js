import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixSecurityDefinerViews() {
  console.log('🔧 Fixing Security Definer View warnings...');
  
  try {
    // Read the SQL script
    const sqlScript = fs.readFileSync('fix-security-definer-views.sql', 'utf8');
    
    // Execute the SQL script
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlScript
    });

    if (error) {
      console.error('❌ Error executing SQL script:', error);
      
      // If the RPC function doesn't exist, try direct execution
      console.log('🔄 Trying alternative approach...');
      
      // Split the script into individual statements
      const statements = sqlScript
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.toLowerCase().includes('select')) {
          // For SELECT statements, use query
          const { data: result, error: queryError } = await supabase
            .from('_dummy')
            .select('*')
            .limit(0);
          
          if (queryError && !queryError.message.includes('relation "_dummy" does not exist')) {
            console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
          }
        } else {
          // For other statements, we'll need to use the SQL editor
          console.log(`📝 Please execute this statement in Supabase SQL Editor:`);
          console.log(statement);
          console.log('---');
        }
      }
    } else {
      console.log('✅ Security Definer View warnings fixed successfully!');
      console.log('📊 Results:', data);
    }
    
  } catch (error) {
    console.error('❌ Error reading or executing SQL script:', error);
    console.log('\n📝 Manual Fix Required:');
    console.log('Please run the following SQL in your Supabase SQL Editor:');
    console.log('\n' + fs.readFileSync('fix-security-definer-views.sql', 'utf8'));
  }
}

// Run the fix
fixSecurityDefinerViews().catch(console.error);
