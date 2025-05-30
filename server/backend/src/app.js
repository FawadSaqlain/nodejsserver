// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes    = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const taskRoutes    = require('./routes/taskRoutes');
const reportRoutes  = require('./routes/reportRoutes');   // ← add this
const errorHandler  = require('./middlewares/errorHandler');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>🎓 Task Tracker API</h1>
    <p>Welcome! Available endpoints:</p>
    <ul>
      <li><code>POST /api/auth/login</code> — Teacher login</li>
      <li><code>GET  /api/students</code> — List students</li>
      <li><code>POST /api/students</code> — Create student</li>
      <li><code>DELETE /api/students/:id</code> — Delete student</li>
      <li><code>POST /api/students/upload</code> — Bulk upload via Excel</li>
      <li><code>GET  /api/tasks</code> — List tasks</li>
      <li><code>POST /api/tasks</code> — Create a task</li>
      <li><code>GET  /api/reports/top-performers</code> — Top performers</li>
      <li><code>GET  /api/reports?start=...&end=...</code> — Tasks by date range</li>
    </ul>
  `);
});

// API routes
app.use('/api/auth',    authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/reports',  reportRoutes);   // ← and this

// Global error handler
app.use(errorHandler);

module.exports = app;
