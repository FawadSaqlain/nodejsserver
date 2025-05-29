// backend/src/services/authService.js
const supabase = require('../config/supabaseClient');

async function login(email, password) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('email', email)
    .eq('password_hash', password)
    .single();

  return error || !data ? null : data;
}

async function loginStudent(email, password) {
  const user = await login(email, password);
  if (!user || user.role !== 'student') return null;
  return user;
}

async function loginTeacher(email, password) {
  const user = await login(email, password);
  if (!user || user.role !== 'teacher') return null;
  return user;
}

module.exports = { loginStudent, loginTeacher };
