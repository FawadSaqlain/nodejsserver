// backend/src/utils/printUsers.js

const supabase = require('../config/supabaseClient');

async function printAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');       // ← select all columns

    if (error) {
      console.error('Error fetching users:', error);
      process.exit(1);
    }

    console.log('All users:');
    console.table(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

printAllUsers();
