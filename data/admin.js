// data/admin.js
// Sprint 2 — Akun admin/kasir (bukan self-register, cukup 1 akun hardcode/seed).
// Username & password mentah diambil dari .env (tidak ke-commit ke repo, lihat .gitignore).
// Password disimpan dalam bentuk hash bcrypt, bukan plain text — dibuat sekali saat server start.

const bcrypt = require("bcryptjs");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_RAW = process.env.ADMIN_PASSWORD || "admin123";

// Hash dibuat sekali di memori saat modul ini pertama kali di-load (server start).
const admin = {
  username: ADMIN_USERNAME,
  passwordHash: bcrypt.hashSync(ADMIN_PASSWORD_RAW, 10),
};

module.exports = admin;
