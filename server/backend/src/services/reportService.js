// services/reportService.js
const supabase = require('../config/supabaseClient');

async function getByDateRange(start, end) {
  // same complete-filter → tally → join as in the controller
}

async function getTopPerformers() {
  // same completed-only → avgTime → top N
}

module.exports = { getByDateRange, getTopPerformers };
