// app.js
// Server utama — Toko Sembako Ariesta (Sprint 1)
// Node.js + Express + EJS + partials, static assets, middleware custom, route dinamis, REST API read-only.

const express = require("express");
const path = require("path");

const requestLogger = require("./middleware/logger");
const pageRoutes = require("./routes/pages");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine ───────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Middleware bawaan & custom ───────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger); // middleware custom: logger

// ── Static assets ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Helper global untuk EJS (format rupiah, tahun berjalan, dst) ──
app.use((req, res, next) => {
  res.locals.formatRupiah = (angka) =>
    "Rp" + Number(angka).toLocaleString("id-ID");
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api", apiRoutes);
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
