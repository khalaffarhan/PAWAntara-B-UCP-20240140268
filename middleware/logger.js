// middleware/logger.js
// Middleware custom sederhana: mencatat method, endpoint, dan waktu setiap request masuk.

function requestLogger(req, res, next) {
  const now = new Date().toLocaleString("id-ID", { hour12: false });
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
