// backend/src/controllers/taskController.js
const supabase = require('../config/supabaseClient');

async function list(req, res, next) {
  try {
    const { userId, role } = req.body;

    let query = supabase
      .from('tasks')
      .select('id, title, description, due_date, status, assigned_to, users(name)')
      .order('due_date', { ascending: true });

    if (role === 'student') {
      query = query.eq('assigned_to', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const enriched = data.map(task => ({
      ...task,
      assigned_to_name: task.users?.name ?? 'Unknown',
    }));

    res.json(enriched);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, description, assigned_to, due_date } = req.body;
    const { data, error } = await supabase.from('tasks').insert([{
      title,
      description,
      assigned_to,
      due_date,
      status: 'pending',
    }]);

    if (error) throw error;

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id, status } = req.body;
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update };
