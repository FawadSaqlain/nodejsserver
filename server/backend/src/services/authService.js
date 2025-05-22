// backend/src/services/authService.js
const supabase = require('../config/supabaseClient');

async function login(email, password) {
  // Query your users table directly
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('email', email)
    .eq('password_hash', password)
    .single();

  if (error || !data) {
    const err = new Error('Invalid login credentials');
    err.status = 401;
    throw err;
  }

  // For simplicity, just return the user record
  return data;
}

module.exports = { login };
