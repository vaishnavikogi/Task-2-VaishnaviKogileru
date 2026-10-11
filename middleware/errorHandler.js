// Centralized error handling. Express recognises an error handler by its
// FOUR parameters (err, req, res, next).
// Every error ends up here and becomes a consistent JSON response.

// Runs when no route matched the request -> 404
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  // Malformed JSON in the request body -> 400
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
  }

  // The real error is logged on the SERVER only. The client gets a generic message,
  // so internal details are never leaked.
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Something went wrong' });
}

module.exports = { notFoundHandler, errorHandler };
