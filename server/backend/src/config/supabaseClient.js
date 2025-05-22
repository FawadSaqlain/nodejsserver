// backend/src/config/supabaseClient.js

const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_KEY } = require('./config');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_KEY is missing in config.js');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
