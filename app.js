// app.js
// Server utama — Toko Sembako Ariesta (Sprint 1 + Sprint 2)
// Node.js + Express + EJS + partials, static assets, middleware custom,
// route dinamis, REST API CRUD penuh, autentikasi session-based, Tanya AI dummy.

require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const requestLogger = require("./middleware/logger");
const responseTime = require("./middleware/responseTime");
const pageRoutes = require("./routes/pages");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine ───────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Middleware bawaan & custom ───────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger); // middleware custom #1: logger (Sprint 1)
app.use(responseTime); // middleware custom #2: response time (Sprint 2)

// ── Session (login admin/kasir) ─────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ariesta-secret-dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2 jam
    },
  })
);

// ── Static assets ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Helper global untuk EJS (format rupiah, tahun berjalan, status login, dst) ──
app.use((req, res, next) => {
  res.locals.formatRupiah = (angka) =>
    "Rp" + Number(angka).toLocaleString("id-ID");
  res.locals.currentYear = new Date().getFullYear();
  res.locals.isLoggedIn = !!(req.session && req.session.user);
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use("/", authRoutes); // GET /login (halaman) + POST /api/login, POST /api/logout
app.use("/api", apiRoutes); // REST API produk (CRUD) & /api/chat
app.use("/", pageRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Halaman Tidak Ditemukan",
    activePage: "",
  });
});

app.listen(PORT, () => {
  console.log(`🛒 Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
