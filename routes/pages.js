// routes/pages.js
// Route halaman (server-side render via EJS). Sprint 1: data masih dari array dummy.

const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET / — Beranda
router.get("/", (req, res) => {
  const featured = products.slice(0, 4);
  res.render("index", {
    title: "Beranda",
    activePage: "home",
    featured,
  });
});

// GET /produk — Daftar produk + filter lewat query string (?kategori= / ?search=)
router.get("/produk", (req, res) => {
  const { kategori, search } = req.query;
  let result = products;

  if (kategori && kategori !== "semua") {
    result = result.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search) {
    const keyword = search.toLowerCase().trim();
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  const categories = [...new Set(products.map((p) => p.category))];

  res.render("produk", {
    title: "Produk",
    activePage: "produk",
    products: result,
    categories,
    activeKategori: kategori || "semua",
    activeSearch: search || "",
  });
});

// GET /produk/:id — Detail produk (route dinamis)
router.get("/produk/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).render("produk-detail", {
      title: "Produk Tidak Ditemukan",
      activePage: "produk",
      product: null,
    });
  }

  res.render("produk-detail", {
    title: product.name,
    activePage: "produk",
    product,
  });
});

// GET /tanya-ai — Halaman chat Tanya AI (UI saja, logic balasan menyusul di Sprint 2)
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    title: "Tanya AI",
    activePage: "tanya-ai",
  });
});

module.exports = router;
