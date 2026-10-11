// Validation middleware: runs BEFORE the controller.
// Bad input is answered with HTTP 400 and the controller is never reached.

function badRequest(res, message) {
  return res.status(400).json({ success: false, message });
}

// If no body was sent (or it is not an object), treat it as {} so we never crash.
function getBody(req) {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}

// ---------- POST /api/tasks ----------
function validateTask(req, res, next) {
  const { title } = getBody(req);

  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 100) {
    return badRequest(res, 'Task title must be between 3 and 100 characters');
  }
  next();
}

// ---------- POST /api/study-sessions ----------
function isRealDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  // The format is right; now check it is a real calendar date (rejects 2026-02-31)
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validateStudySession(req, res, next) {
  const { subject, duration, date } = getBody(req);

  if (typeof subject !== 'string' || subject.trim().length < 2 || subject.trim().length > 100) {
    return badRequest(res, 'Subject must be between 2 and 100 characters');
  }
  if (typeof duration !== 'number' || !Number.isFinite(duration)) {
    return badRequest(res, 'Duration is required and must be a number');
  }
  if (duration <= 0 || duration > 600) {
    return badRequest(res, 'Duration must be greater than 0 and at most 600 minutes');
  }
  if (!isRealDate(date)) {
    return badRequest(res, 'Date is required and must be a valid date in YYYY-MM-DD format');
  }
  next();
}

// ---------- GET /api/tasks/:id ----------
// The id must be a whole number of 1 or more.
function validateId(req, res, next) {
  if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
    return badRequest(res, 'ID must be a positive whole number');
  }
  next();
}

module.exports = { validateTask, validateStudySession, validateId };
