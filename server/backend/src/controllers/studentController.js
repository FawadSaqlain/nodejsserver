// src/controllers/studentController.js
const studentService = require('../services/studentService');

async function list(req, res, next) {
  try {
    const students = await studentService.getStudents();
    res.json(students);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const student = await studentService.createStudent({ name, email, password });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await studentService.deleteStudent(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { password } = req.body;
    const updated = await studentService.updateStudentPassword(req.params.id, password);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function edit(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const updated = await studentService.updateStudent(req.params.id, { name, email, password });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  create,
  remove,
  resetPassword,
  edit
};
