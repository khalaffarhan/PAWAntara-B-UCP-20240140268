// data/products.js
// Data produk dummy (in-memory) — akan diganti/dihubungkan ke REST API penuh (CRUD) di Sprint 2.
// Field: id, name, category, price, stock, unit, icon (Bootstrap Icons), description

const products = [
  {
    id: 1,
    name: "Beras Pandan Wangi",
    category: "Beras",
    price: 65000,
    stock: 20,
    unit: "5 kg",
    icon: "bi-basket2-fill",
    description:
      "Beras pulen wangi pandan alami, hasil panen pilihan petani lokal. Cocok untuk kebutuhan makan sehari-hari keluarga.",
  },
  {
    id: 2,
    name: "Minyak Goreng Sania",
    category: "Minyak Goreng",
    price: 34000,
    stock: 15,
    unit: "2 liter",
    icon: "bi-droplet-fill",
    description:
      "Minyak goreng kemasan jernih dari kelapa sawit pilihan, rendah kolesterol dan cocok untuk segala jenis masakan.",
  },
  {
    id: 3,
    name: "Gula Pasir Gulaku",
    category: "Gula",
    price: 15000,
    stock: 40,
    unit: "1 kg",
    icon: "bi-box-seam-fill",
    description:
      "Gula pasir putih bersih dengan butiran halus, diproses higienis untuk kebutuhan konsumsi rumah tangga.",
  },
  {
    id: 4,
    name: "Telur Ayam Negeri",
    category: "Telur",
    price: 28000,
    stock: 30,
    unit: "1 kg",
    icon: "bi-egg-fried",
    description:
      "Telur ayam negeri segar pilihan, ukuran seragam, sumber protein harian yang terjangkau untuk keluarga.",
  },
  {
    id: 5,
    name: "Tepung Terigu Segitiga Biru",
    category: "Bahan Pokok",
    price: 12000,
    stock: 25,
    unit: "1 kg",
    icon: "bi-bag-fill",
    description:
      "Tepung terigu serbaguna dengan kualitas premium, cocok untuk membuat roti, kue, maupun gorengan.",
  },
  {
    id: 6,
    name: "Kecap Manis ABC",
    category: "Bumbu Dapur",
    price: 18000,
    stock: 18,
    unit: "600 ml",
    icon: "bi-droplet-half",
    description:
      "Kecap manis kental dengan cita rasa gurih legit, bahan wajib dapur Indonesia untuk berbagai masakan.",
  },
  {
    id: 7,
    name: "Susu Kental Manis Frisian Flag",
    category: "Susu",
    price: 11000,
    stock: 22,
    unit: "370 g",
    icon: "bi-cup-straw",
    description:
      "Susu kental manis creamy dengan rasa favorit keluarga, nikmat untuk pelengkap roti, kopi, atau minuman.",
  },
  {
    id: 8,
    name: "Indomie Goreng",
    category: "Mie Instan",
    price: 13500,
    stock: 50,
    unit: "5 pcs",
    icon: "bi-basket3-fill",
    description:
      "Mie instan goreng rasa original dengan bumbu khas Indonesia, praktis dan mengenyangkan untuk stok dapur.",
  },
];

module.exports = products;
