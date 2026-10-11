// Stats controller: the numbers are calculated from the stored data every time.
// Nothing is hard-coded.

const database = require('../data/database');

// GET /api/stats  ->  200
function getStats(req, res) {
  const completedTasks = database.tasks.filter((task) => task.completed).length;
  const totalStudyMinutes = database.studySessions.reduce((sum, session) => sum + session.duration, 0);

  res.status(200).json({
    success: true,
    message: 'Statistics calculated successfully',
    data: {
      totalTasks: database.tasks.length,
      completedTasks,
      pendingTasks: database.tasks.length - completedTasks,
      totalStudyMinutes,
      studySessions: database.studySessions.length,
    },
  });
}

module.exports = { getStats };
