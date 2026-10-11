// Task controller.
// Request flow:  route -> validation -> controller -> data (database.js) -> JSON response

const database = require('../data/database');

// GET /api/tasks  ->  200
function getTasks(req, res) {
  res.status(200).json({
    success: true,
    count: database.tasks.length,
    data: database.tasks,
  });
}

// GET /api/tasks/:id  ->  200, or 404 if the task does not exist
function getTask(req, res) {
  const id = Number(req.params.id); // already validated by validateId
  const task = database.tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.status(200).json({ success: true, data: task });
}

// POST /api/tasks  ->  201 (the body was already validated)
function createTask(req, res) {
  const task = database.addTask(req.body.title.trim());

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
}

module.exports = { getTasks, getTask, createTask };
