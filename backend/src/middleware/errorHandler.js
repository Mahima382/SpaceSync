// ─── 404 Handler ──────────────────────────────
function notFound(req, res, next) {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  })
}

// ─── Global Error Handler ─────────────────────
function errorHandler(err, req, res, next) {
  console.error('[Unhandled Error]', err)
  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal server error',
  })
}

module.exports = { notFound, errorHandler }
