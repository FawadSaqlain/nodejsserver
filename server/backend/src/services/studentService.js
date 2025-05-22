// src/services/studentService.js
const supabase = require('../config/supabaseClient');

async function getStudents() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('role', 'student');
  if (error) throw error;
  return data;
}

async function createStudent({ name, email, password }) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      name,
      email,
      role: 'student',
      password_hash: password
    }])
    .select('id, name, email');
  if (error) throw error;
  return data[0];
}

async function deleteStudent(id) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

async function updateStudentPassword(id, password) {
  const { data, error } = await supabase
    .from('users')
    .update({ password_hash: password })
    .eq('id', id)
    .select('id, name, email');
  if (error) throw error;
  return data[0];
}

async function updateStudent(id, { name, email, password }) {
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (password !== undefined) updates.password_hash = password;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('id, name, email');
  if (error) throw error;
  return data[0];
}

module.exports = {
  getStudents,
  createStudent,
  deleteStudent,
  updateStudentPassword,
  updateStudent
};
