// middleware/responseTime.js
// Middleware custom tambahan (Sprint 2, di luar auth): mengukur & mencatat
// berapa lama setiap request diproses server, dicetak ke terminal saat response selesai.

function responseTime(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    console.log(
      `⏱  ${req.method} ${req.originalUrl} → ${res.statusCode} (${durationMs.toFixed(1)}ms)`
    );
  });

  next();
}

module.exports = responseTime;
