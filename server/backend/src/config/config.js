// // backend/src/config/config.js

// // Supabase project credentials (replace service_role if you need server-only access)
// const SUPABASE_URL = 'https://iqsduwsyhudeojgtfhoc.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxc2R1d3N5aHVkZW9qZ3RmaG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NzU1ODYsImV4cCI6MjA2MzA1MTU4Nn0.SXkF2IwyhUAO_vWUdWQ-qM1aBBThiY71vqupra1ltDg';

// const PORT = 3000;

// module.exports = { SUPABASE_URL, SUPABASE_KEY, PORT };

// backend/src/config/config.js
module.exports = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
