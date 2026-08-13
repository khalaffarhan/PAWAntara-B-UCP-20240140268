// routes/pages.js
// Route halaman (server-side render via EJS).
// Sprint 1: Beranda masih pakai array dummy langsung (cukup untuk preview statis).
// Sprint 2: halaman Produk (publik) & Detail Produk sekarang mengambil data secara
// DINAMIS lewat GET /api/products di sisi client (Fetch API), bukan hardcode SSR lagi —
// EJS di sini hanya menyediakan shell/kerangka halaman, isi produk di-render oleh JS.

const express = require("express");
const router = express.Router();
const products = require("../data/products");
const { requirePageAuth } = require("../middleware/auth");

// GET / — Beranda (preview produk masih SSR dari array, cukup untuk tampilan awal)
router.get("/", (req, res) => {
  const featured = products.slice(0, 4);
  res.render("index", {
    title: "Beranda",
    activePage: "home",
    featured,
  });
});

// GET /produk — Daftar produk (shell EJS; data & filter diambil client-side via
// GET /api/products?kategori=&search= memakai Fetch API, lihat public/js/produk.js)
router.get("/produk", (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];

  res.render("produk", {
    title: "Produk",
    activePage: "produk",
    categories,
  });
});

// GET /produk/:id — Detail produk (route dinamis; shell EJS, detail di-fetch
// client-side dari GET /api/products/:id, lihat public/js/produk-detail.js)
router.get("/produk/:id", (req, res) => {
  const id = req.params.id;

  res.render("produk-detail", {
    title: "Detail Produk",
    activePage: "produk",
    productId: id,
  });
});

// GET /tanya-ai — Halaman chat Tanya AI (fetch ke POST /api/chat, lihat public/js/main.js)
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    title: "Tanya AI",
    activePage: "tanya-ai",
  });
});

// ── Sprint 2: Auth-related pages ──────────────────────────────

// GET /dashboard — Dashboard admin/kasir (WAJIB LOGIN, dilindungi middleware auth)
router.get("/dashboard", requirePageAuth, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard Admin",
    activePage: "dashboard",
    adminUsername: req.session.user.username,
  });
});

module.exports = router;
