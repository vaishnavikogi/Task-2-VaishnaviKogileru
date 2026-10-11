const express = require('express');
const studyController = require('../controllers/studyController');
const { validateStudySession } = require('../middleware/validation');

const router = express.Router();

// Mounted at /api/study-sessions in server.js
router.get('/', studyController.getStudySessions); //                           GET  /api/study-sessions
router.post('/', validateStudySession, studyController.createStudySession); //  POST /api/study-sessions

module.exports = router;
