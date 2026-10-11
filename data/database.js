// In-memory data store.
//
// The data lives in plain JavaScript arrays. It is created when the server starts
// and is lost when the server stops. (Week 3 replaces this file with a real database.)
//
// The controllers are the only files that touch this data.

const tasks = [
  { id: 1, title: 'Practice Arrays', completed: false },
  { id: 2, title: 'Study DBMS', completed: true },
  { id: 3, title: 'Solve Aptitude Questions', completed: false },
  { id: 4, title: 'Revise Operating Systems', completed: false },
];

const studySessions = [
  { id: 1, subject: 'Data Structures', duration: 60, date: '2026-10-04' },
  { id: 2, subject: 'DBMS', duration: 45, date: '2026-10-03' },
  { id: 3, subject: 'Python', duration: 90, date: '2026-10-02' },
];

// Next id to hand out. Ids are never re-used.
let nextTaskId = tasks.length + 1;
let nextSessionId = studySessions.length + 1;

function addTask(title) {
  const task = { id: nextTaskId, title, completed: false };
  nextTaskId += 1;
  tasks.push(task);
  return task;
}

function addStudySession(subject, duration, date) {
  const session = { id: nextSessionId, subject, duration, date };
  nextSessionId += 1;
  studySessions.push(session);
  return session;
}

module.exports = { tasks, studySessions, addTask, addStudySession };
