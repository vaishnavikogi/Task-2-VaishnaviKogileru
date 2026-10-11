const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const studyRoutes = require('./routes/studyRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

// ---------- Middleware ----------
app.use(cors()); //         lets the FocusFlow frontend (another origin) call this API
app.use(express.json()); // parses JSON request bodies into req.body

// Simple request logger: METHOD URL STATUS
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

// ---------- Routes ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FocusFlow API is running' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/study-sessions', studyRoutes);
app.use('/api/stats', statsRoutes);

// ---------- Error handling (must come last) ----------
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`FocusFlow API running at http://localhost:${PORT}`);
});
