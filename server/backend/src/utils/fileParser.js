// src/utils/fileParser.js
const ExcelJS = require('exceljs');

async function parseExcel(path) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path);
  const ws = wb.worksheets[0];
  return ws.getSheetValues(); // or whatever format you need
}

module.exports = { parseExcel };
