const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../utils/demand.csv');

exports.getDemand = (req, res) => {
  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading demand data' });
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return obj;
    });
    res.json({ demand: rows });
  });
}; 