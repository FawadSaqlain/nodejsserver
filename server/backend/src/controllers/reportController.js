const supabase = require('../config/supabaseClient');

// controllers/reportController.js
async function generateReport(req, res) {
  try {
    const { start, end } = req.query;
    console.log('[REPORT] Generating report from', start, 'to', end);

    // 1) fetch only completed tasks whose due_date is in [start, end]
    const { data: tasks, error: taskErr } = await supabase
      .from('tasks')
      .select('assigned_to')
      .eq('status', 'completed')
      .gte('due_date', start)
      .lte('due_date', end);

    if (taskErr) throw taskErr;

    console.log('[REPORT] Fetched', tasks.length, 'completed tasks');
    if (tasks.length === 0) {
      return res.json([]);
    }

    // 2) tally by student ID
    const counts = tasks.reduce((acc, t) => {
      acc[t.assigned_to] = (acc[t.assigned_to] || 0) + 1;
      return acc;
    }, {});

    // 3) lookup student names
    const ids = Object.keys(counts).map(Number);
    const { data: students, error: userErr } = await supabase
      .from('users')
      .select('id, name')
      .in('id', ids);
    if (userErr) throw userErr;

    // 4) assemble final payload
    const result = students.map(s => ({
      assigned_to: s.name,
      completed_count: counts[s.id] || 0,
    }));

    console.log('[REPORT] Returning', result.length, 'entries');
    res.json(result);
  } catch (err) {
    console.error('[REPORT] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

async function topPerformers(req, res) {
  try {
    console.log('[TOP] Fetching top performers...');

    // 1) fetch all completed tasks
    const { data: tasks, error: taskErr } = await supabase
      .from('tasks')
      .select('assigned_to')
      .eq('status', 'completed');

    if (taskErr) throw taskErr;

    // 2) tally by student ID
    const counts = tasks.reduce((acc, t) => {
      acc[t.assigned_to] = (acc[t.assigned_to] || 0) + 1;
      return acc;
    }, {});

    // 3) lookup student names
    const ids = Object.keys(counts).map(Number);
    if (ids.length === 0) {
      return res.json([]);
    }

    const { data: students, error: userErr } = await supabase
      .from('users')
      .select('id, name')
      .in('id', ids);
    if (userErr) throw userErr;

    // 4) build, sort descending, take top 5
    const result = students
      .map(s => ({
        name: s.name,
        completed_count: counts[s.id] || 0,
      }))
      .sort((a, b) => b.completed_count - a.completed_count)
      .slice(0, 5);

    console.log('[TOP] Returning', result.length, 'performers');
    res.json(result);

  } catch (err) {
    console.error('[TOP] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
const ExcelJS = require('exceljs');

// ... Inside reportController.js

async function exportReportExcel(req, res) {
  try {
    const { start, end } = req.query;
    console.log('[EXPORT] Generating Excel report from', start, 'to', end);

    const { data: tasks, error: taskErr } = await supabase
      .from('tasks')
      .select('assigned_to, due_date, status')
      .gte('due_date', start)
      .lte('due_date', end);

    if (taskErr) throw taskErr;

    const ids = [...new Set(tasks.map(t => t.assigned_to))];
    const { data: users, error: userErr } = await supabase
      .from('users')
      .select('id, name')
      .in('id', ids);

    if (userErr) throw userErr;

    const nameMap = Object.fromEntries(users.map(u => [u.id, u.name]));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Task Report');

    sheet.columns = [
      { header: 'Student Name', key: 'name', width: 30 },
      { header: 'Due Date', key: 'due_date', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    tasks.forEach(task => {
      sheet.addRow({
        name: nameMap[task.assigned_to] || `Student ${task.assigned_to}`,
        due_date: task.due_date,
        status: task.status,
      });
    });

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=report_${start}_${end}.xlsx`
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('[EXPORT] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}


// controllers/reportController.js

async function generateStudentReport(req, res) {
  try {
    const { start, end, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query' });
    }

    console.log('[STUDENT REPORT] Generating for', userId, 'from', start, 'to', end);

    const { data: tasks, error: taskErr } = await supabase
      .from('tasks')
      .select('assigned_to')
      .eq('status', 'completed')
      .eq('assigned_to', userId)
      .gte('due_date', start)
      .lte('due_date', end);

    if (taskErr) throw taskErr;

    const count = tasks.length;

    const { data: users, error: userErr } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .single();

    if (userErr) throw userErr;

    const result = [{
      assigned_to: users.name,
      completed_count: count,
    }];

    res.json(result);
  } catch (err) {
    console.error('[STUDENT REPORT] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
// const ExcelJS = require('exceljs');
// const supabase = require('../yourSupabaseClient'); // ← adjust to your actual import
// File: src/controllers/reportController.js
// const ExcelJS = require('exceljs');

// ... other imports and setup (e.g., supabase)


async function exportStudentReportExcel(req, res) {
  try {
    const { start, end, userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query' });
    }

    console.log(
      `[EXPORT STUDENT] Generating for user ${userId} from ${start} to ${end}`
    );

    // 1) Fetch tasks, default to empty array
    const { data: tasks = [], error: taskErr } = await supabase
      .from('tasks')
      .select('assigned_to, due_date, status')
      .eq('assigned_to', userId)
      .gte('due_date', start)
      .lte('due_date', end);

    if (taskErr) {
      console.error('[EXPORT STUDENT] Supabase tasks error:', taskErr.message);
      return res.status(500).json({ error: taskErr.message });
    }

    // 2) Fetch user info
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    if (userErr) {
      console.error('[EXPORT STUDENT] Supabase user error:', userErr.message);
      return res.status(500).json({ error: userErr.message });
    }

    // 3) Create workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Student Task Report');

    // Define columns before adding rows
    sheet.columns = [
      { header: 'Due Date', key: 'due_date', width: 20 },
      { header: 'Status',   key: 'status',   width: 15 },
    ];

    // Title & metadata
    sheet.mergeCells('A1:B1');
    sheet.getCell('A1').value = 'Student Task Completion Report';
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };
    sheet.addRow([]);
    sheet.addRow([`Student: ${user.name}`, `User ID: ${userId}`]);
    sheet.addRow([`Date Range: ${start} → ${end}`]);
    sheet.addRow([`Exported On: ${new Date().toLocaleString()}`]);
    sheet.addRow([]);

    // 4) Early-return empty workbook if no tasks
    if (tasks.length === 0) {
      const buffer = await workbook.xlsx.writeBuffer();
      return res
        .status(200)
        .set({
          'Content-Disposition': `attachment; filename=student_report_${userId}_${start}_${end}.xlsx`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        .send(buffer);
    }

    // 5) Populate data rows & tally counts
    let completed = 0;
    let pending = 0;
    tasks.forEach(task => {
      const status = task.status ?? 'unknown';
      if (status === 'completed') completed++;
      else pending++;
      sheet.addRow({ due_date: task.due_date, status });
    });

    // 6) Summary section
    sheet.addRow([]);
    const summary = sheet.addRow({ due_date: 'Total Tasks', status: tasks.length });
    summary.font = { bold: true };
    sheet.addRow({ due_date: 'Completed', status: completed });
    sheet.addRow({ due_date: 'Pending', status: pending });

    // 7) Auto-size columns & styling
    sheet.columns.forEach((column) => {
      // Safely handle undefined headers
      const headerText = column.header ? column.header.toString() : '';
      let maxLength = headerText.length;
      // Iterate each cell in this column
      column.eachCell({ includeEmpty: true }, cell => {
        const val = cell.value != null ? cell.value.toString() : '';
        if (val.length > maxLength) maxLength = val.length;
      });
      column.width = maxLength + 2;
    });
    sheet.eachRow(row =>
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      })
    );

    // 8) Stream the .xlsx back
    res
      .status(200)
      .set({
        'Content-Disposition': `attachment; filename=student_report_${userId}_${start}_${end}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('[EXPORT STUDENT] Unexpected Error:', err);
    res.status(500).json({ error: err.message });
  }
  console.log("[EXPORT REPORT DONE]");
}

module.exports = {
  generateReport,
  topPerformers,
  exportReportExcel,
  generateStudentReport,
  exportStudentReportExcel,
};
