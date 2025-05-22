// src/services/taskService.js
const supabase = require('../config/supabaseClient');

async function getTasks() {
  console.log('[Service.getTasks] Querying tasks table');
  const { data, error } = await supabase.from('tasks').select('*');
  console.log('[Service.getTasks] Supabase response:', { data, error });
  if (error) {
    console.error('[Service.getTasks] Error fetching tasks:', error);
    throw error;
  }
  return data;
}

async function createTask(task) {
  console.log('[Service.createTask] Inserting task:', task);
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select('*'); // chain select to return the new row

  console.log('[Service.createTask] Supabase response:', { data, error });
  if (error) {
    console.error('[Service.createTask] Insert error:', error);
    throw error;
  }
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('[Service.createTask] No data returned after insert:', data);
    throw new Error('Insert succeeded but no data returned');
  }
  console.log('[Service.createTask] Returning inserted task:', data[0]);
  return data[0];
}
async function updateTaskStatus(id, status) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select('*')                // ask Supabase to return the updated row
    .single();                  // you expect exactly one row back

  if (error) throw error;
  return data;
}

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,            // <-- export it
}