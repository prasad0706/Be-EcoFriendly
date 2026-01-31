const { createClient } = require('@supabase/supabase-js');

// Only initialize if Supabase credentials are provided
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey && supabaseAnonKey !== 'placeholder-anon-key') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  if (supabaseServiceKey && supabaseServiceKey !== 'placeholder-service-role-key') {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
}

module.exports = { supabase, supabaseAdmin };
