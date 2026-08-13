const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.txt') });

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Import AI routes
const aiRouter = require('./routes/ai');
app.use('/', aiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});