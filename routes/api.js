// routes/api.js
// REST API — Sprint 1 menyediakan endpoint read-only (GET).
// Sprint 2: dilengkapi CRUD penuh (POST/PUT/DELETE, wajib login) + endpoint Tanya AI dummy.
// GET tetap publik, mutasi data (POST/PUT/DELETE) dilindungi middleware auth di server
// (bukan cuma disembunyikan di frontend) sesuai kontrak Bagian 7 PRD.

const express = require("express");
const router = express.Router();

// products di sini adalah SATU sumber data in-memory yang sama dipakai
// oleh GET (baca) maupun POST/PUT/DELETE (mutasi) — bukan dua sumber terpisah,
// begitu juga dipakai ulang oleh halaman publik /produk lewat endpoint yang sama.
const products = require("../data/products");
const { requireApiAuth } = require("../middleware/auth");
const getChatReply = require("../utils/chatbot");

// Helper: cari index array berdasarkan id, -1 kalau tidak ada
function findProductIndex(id) {
  return products.findIndex((p) => p.id === id);
}

// Helper: id berikutnya (aman walau ada produk yang sudah dihapus)
function getNextId() {
  return products.length > 0
    ? Math.max(...products.map((p) => p.id)) + 1
    : 1;
}

// ── GET /api/products — Ambil seluruh data produk (PUBLIK) ──
router.get("/products", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Daftar produk berhasil diambil",
    data: products,
  });
});

// ── GET /api/products/:id — Ambil satu produk berdasarkan ID (PUBLIK) ──
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

// ── POST /api/products — Tambah produk baru (WAJIB LOGIN) ──
router.post("/products", requireApiAuth, (req, res) => {
  const { name, category, price, stock, unit, icon, description } = req.body;

  // Validasi input dasar di server (jangan cuma percaya frontend)
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field name, category, price, dan stock wajib diisi",
    });
  }

  const priceNum = Number(price);
  const stockNum = Number(stock);
  if (Number.isNaN(priceNum) || Number.isNaN(stockNum) || priceNum < 0 || stockNum < 0) {
    return res.status(400).json({
      status: "error",
      message: "Price dan stock harus berupa angka positif",
    });
  }

  const newProduct = {
    id: getNextId(),
    name: String(name).trim(),
    category: String(category).trim(),
    price: priceNum,
    stock: stockNum,
    unit: unit ? String(unit).trim() : "-",
    icon: icon ? String(icon).trim() : "bi-box-seam-fill",
    description: description ? String(description).trim() : "",
  };

  products.push(newProduct);

  res.status(201).json({
    status: "success",
    message: "Produk ditambahkan",
    data: newProduct,
  });
});

// ── PUT /api/products/:id — Update produk (harga/stok/dll) (WAJIB LOGIN) ──
router.put("/products/:id", requireApiAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = findProductIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Produk dengan id ${req.params.id} tidak ditemukan`,
    });
  }

  const { name, category, price, stock, unit, icon, description } = req.body;
  const current = products[index];

  if (price !== undefined && (Number.isNaN(Number(price)) || Number(price) < 0)) {
    return res.status(400).json({
      status: "error",
      message: "Price harus berupa angka positif",
    });
  }
  if (stock !== undefined && (Number.isNaN(Number(stock)) || Number(stock) < 0)) {
    return res.status(400).json({
      status: "error",
      message: "Stock harus berupa angka positif",
    });
  }

  const updated = {
    ...current,
    name: name !== undefined ? String(name).trim() : current.name,
    category: category !== undefined ? String(category).trim() : current.category,
    price: price !== undefined ? Number(price) : current.price,
    stock: stock !== undefined ? Number(stock) : current.stock,
    unit: unit !== undefined ? String(unit).trim() : current.unit,
    icon: icon !== undefined ? String(icon).trim() : current.icon,
    description: description !== undefined ? String(description).trim() : current.description,
  };

  products[index] = updated;

  res.status(200).json({
    status: "success",
    message: "Produk diperbarui",
    data: updated,
  });
});

// ── DELETE /api/products/:id — Hapus produk (WAJIB LOGIN) ──
router.delete("/products/:id", requireApiAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = findProductIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Produk dengan id ${req.params.id} tidak ditemukan`,
    });
  }

  products.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: "Produk dihapus",
  });
});

// ── POST /api/chat — Tanya AI dummy (PUBLIK, logika keyword matching di backend) ──
router.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message || !String(message).trim()) {
    return res.status(400).json({
      status: "error",
      message: "Pertanyaan tidak boleh kosong",
    });
  }

  const reply = getChatReply(String(message), products);

  res.status(200).json({
    status: "success",
    data: { reply },
  });
});

module.exports = router;
