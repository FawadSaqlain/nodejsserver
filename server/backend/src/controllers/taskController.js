// src/controllers/taskController.js
const taskService = require('../services/taskService');

async function list(req, res, next) {
  try {
    console.log('[Controller.list] Fetching all tasks');
    const tasks = await taskService.getTasks();
    console.log('[Controller.list] Retrieved tasks:', tasks);
    res.json(tasks);
  } catch (err) {
    console.error('[Controller.list] Error:', err);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    console.log('[Controller.create] Incoming request body:', req.body);
    const task = await taskService.createTask(req.body);
    console.log('[Controller.create] Service returned new task:', task);
    res.status(201).json(task);
  } catch (err) {
    console.error('[Controller.create] Error:', err);
    next(err);
  }
}
async function update(req, res, next) {
  try {
    const { id, status } = req.body;
    if (typeof id !== 'number' || typeof status !== 'string') {
      return res.status(400).json({ message: 'id (number) and status (string) required' });
    }
    const updated = await taskService.updateTaskStatus(id, status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update };
// module.exports = { list, create };
