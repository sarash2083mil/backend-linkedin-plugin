const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db');

app.get('/', (req, res) => {
  res.send('🎯 Welcome to the Links AI Backend!');
});

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Users"');
    res.json(result.rows);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
