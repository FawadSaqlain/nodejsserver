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



const multer = require('multer');
const XLSX = require('xlsx');
const supabase = require('../config/supabaseClient');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const uploadMiddleware = upload.single('file');

async function handleUpload(req, res, next) {
  try {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const students = rows.map(row => ({
      name: row.name || row.Name,
      email: row.email || row.Email,
      role: 'student',
      // ⚠️ TODO: Hash passwords properly in production
      password_hash: row.password || row.Password || '123456',
    }));

    const { error: insertError } = await supabase
      .from('users')
      .insert(students);

    if (insertError) throw insertError;

    // ✅ Now fetch all students to return (like your other CRUDs)
    const { data: allStudents, error: fetchError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'student');

    if (fetchError) throw fetchError;

    res.status(201).json({
      message: `${students.length} students uploaded successfully.`,
      students: allStudents,
    });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  list,
  create,
  remove,
  resetPassword,
  edit,
  uploadMiddleware,
  handleUpload
};
