const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, 'entries.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const loadEntries = () => {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
};

const saveEntries = (entries) => {
  fs.writeFileSync(FILE, JSON.stringify(entries, null, 2));
};

app.get('/entry/:user/:date', (req, res) => {
  const { user, date } = req.params;
  const entries = loadEntries();
  const entry = entries[user]?.[date];
  res.json(entry || {});
});

app.post('/submit', (req, res) => {
  const { user, date, hours, notes } = req.body;
  if (!user || !date || !hours) return res.send("User, Date, and Hours are required.");
  const entries = loadEntries();
  if (!entries[user]) entries[user] = {};
  entries[user][date] = { hours, notes };
  saveEntries(entries);
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
