const supabase = require('../config/supabaseClient');

async function getTasksForUser(userId, role) {
  let query = supabase.from('tasks').select('*');
  if (role === 'student') {
    query = query.eq('assigned_to', userId);
  }
  const { data, error } = await query.order('due_date', { ascending: true });
  if (error) throw error;
  return data;
}

async function createTask(task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select('*');
  if (error) throw error;
  return data[0];
}

async function updateTask({ id, ...changes }) {
  const { data, error } = await supabase
    .from('tasks')
    .update(changes)
    .eq('id', id)
    .select('*');
  if (error) throw error;
  return data[0];
}

module.exports = { getTasksForUser, createTask, updateTask };
