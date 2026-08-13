// routes/auth.js
// Sprint 2 — Autentikasi admin/kasir: halaman login, POST /api/login, POST /api/logout.
// Sesi login disimpan lewat express-session; password dicek dengan bcrypt (bukan plain text).

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const admin = require("../data/admin");

// ── GET /login — Halaman login (kalau sudah login, langsung ke dashboard) ──
router.get("/login", (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login Admin",
    activePage: "login",
  });
});

// ── POST /api/login — Validasi kredensial & buat sesi login ──
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username dan password wajib diisi",
    });
  }

  if (username !== admin.username) {
    return res.status(401).json({
      status: "error",
      message: "Username atau password salah",
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({
      status: "error",
      message: "Username atau password salah",
    });
  }

  // Kredensial valid → buat sesi login
  req.session.user = { username: admin.username };

  res.status(200).json({
    status: "success",
    message: "Login berhasil",
  });
});

// ── POST /api/logout — Hapus sesi login ──
router.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal logout, silakan coba lagi",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({
      status: "success",
      message: "Logout berhasil",
    });
  });
});

module.exports = router;
