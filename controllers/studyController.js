// Study session controller.
// Request flow:  route -> validation -> controller -> data (database.js) -> JSON response

const database = require('../data/database');

// GET /api/study-sessions  ->  200
function getStudySessions(req, res) {
  res.status(200).json({
    success: true,
    count: database.studySessions.length,
    data: database.studySessions,
  });
}

// POST /api/study-sessions  ->  201 (the body was already validated)
function createStudySession(req, res) {
  const { subject, duration, date } = req.body;
  const session = database.addStudySession(subject.trim(), duration, date);

  res.status(201).json({
    success: true,
    message: 'Study session created successfully',
    data: session,
  });
}

module.exports = { getStudySessions, createStudySession };
