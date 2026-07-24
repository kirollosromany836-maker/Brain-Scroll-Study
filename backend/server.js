require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const participantRoutes = require('./routes/participants');
const quizRoutes = require('./routes/quiz');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '200kb' }));

// General rate limit to reduce abuse / scraping risk
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
  })
);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/participants', participantRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler - never leak stack traces to clients
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`BrainScroll Study API running on http://localhost:${PORT}`);
});
