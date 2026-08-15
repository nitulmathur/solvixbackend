const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.txt') });

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://aisolvix.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  }
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const aiRouter = require('./routes/ai');
app.use('/', aiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Running on port ${PORT}`);
});
