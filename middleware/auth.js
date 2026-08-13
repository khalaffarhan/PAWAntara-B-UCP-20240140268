// middleware/auth.js
// Middleware custom: melindungi halaman dashboard & endpoint mutasi produk (POST/PUT/DELETE).
// Sesi login disimpan lewat express-session (req.session.user).

// Untuk endpoint REST API — kalau belum login, tolak dengan 401 JSON (bukan redirect).
function requireApiAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    status: "error",
    message: "Unauthorized, silakan login terlebih dahulu",
  });
}

// Untuk halaman (server-rendered) — kalau belum login, redirect ke halaman login.
function requirePageAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/login");
}

module.exports = { requireApiAuth, requirePageAuth };
