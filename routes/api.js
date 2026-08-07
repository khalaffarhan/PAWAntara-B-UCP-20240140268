// routes/api.js
// REST API — Sprint 1 baru menyediakan endpoint read-only.
// POST/PUT/DELETE + autentikasi akan ditambahkan di Sprint 2.

const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET /api/products — Ambil seluruh data produk (format response konsisten)
router.get("/products", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Daftar produk berhasil diambil",
    data: products,
  });
});

// GET /api/products/:id — Ambil satu produk berdasarkan ID
router.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: `Produk dengan id ${req.params.id} tidak ditemukan`,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Produk berhasil diambil",
    data: product,
  });
});

module.exports = router;
