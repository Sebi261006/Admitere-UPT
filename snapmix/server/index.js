const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data.json');
const RATE_FILE = path.join(__dirname, 'rates.json');

app.use(cors());
app.use(express.json());

const CLIENT_BUILD = path.join(__dirname, '../dist');
app.use(express.static(CLIENT_BUILD));

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return { bookings: [], messages: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function readRates() {
  try {
    return JSON.parse(fs.readFileSync(RATE_FILE, 'utf-8'));
  } catch (e) {
    return {
      base: { photography: 850, cocktail: 720, full: 1500 },
      perGuest: 75,
      perHour: 160,
      extraGuestThreshold: 40,
      extraGuestFee: 300,
      weekendMultiplier: 1.15,
      eveningMultiplier: 1.1,
    };
  }
}

function writeRates(rates) {
  fs.writeFileSync(RATE_FILE, JSON.stringify(rates, null, 2));
}

app.get('/api/bookings', (req, res) => {
  const data = readData();
  res.json(data.bookings);
});

app.post('/api/bookings', (req, res) => {
  const { name, email, date } = req.body || {};
  if (!name || !email || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = readData();
  const booking = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  data.bookings.push(booking);
  writeData(data);
  res.status(201).json(booking);
});

app.get('/api/messages', (req, res) => {
  const data = readData();
  res.json(data.messages);
});

app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = readData();
  const msg = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  data.messages.push(msg);
  writeData(data);
  res.status(201).json(msg);
});

app.get('/api/rates', (req, res) => {
  const rates = readRates();
  res.json(rates);
});

app.put('/api/rates', (req, res) => {
  const rates = req.body;
  if (!rates || !rates.base) {
    return res.status(400).json({ error: 'Invalid rates payload' });
  }

  writeRates(rates);
  res.status(200).json(rates);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
});

app.listen(PORT, () => console.log(`SnapMix server running on http://localhost:${PORT}`));
