const express = require('express');
const taskController = require('../controllers/taskController');
const { validateTask, validateId } = require('../middleware/validation');

const router = express.Router();

// Mounted at /api/tasks in server.js
router.get('/', taskController.getTasks); //                   GET  /api/tasks
router.get('/:id', validateId, taskController.getTask); //     GET  /api/tasks/:id
router.post('/', validateTask, taskController.createTask); //  POST /api/tasks

module.exports = router;
