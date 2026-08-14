// utils/chatbot.js
// Logika balasan "Tanya AI" — 100% dummy, keyword matching + if-else di backend.
// TIDAK memanggil API AI eksternal (OpenAI/Anthropic/Gemini/dsb) sama sekali,
// sesuai ketentuan PRD Bagian 6 & 10 (dilarang integrasi API AI pihak ketiga).

function normalize(text) {
  return text.toLowerCase().trim();
}

function containsAny(text, keywords) {
  return keywords.some((k) => text.includes(k));
}

// Cari produk yang namanya disebut di pertanyaan (untuk keyword stok/harga)
function findMentionedProduct(text, products) {
  return products.find((p) => text.includes(p.name.toLowerCase())) || null;
}

function getChatReply(rawMessage, products) {
  const text = normalize(rawMessage);

  // 1) Sapaan
  if (containsAny(text, ["halo", "hai", "hi ", "assalamualaikum", "selamat"])) {
    return "Halo juga! 👋 Ada yang bisa saya bantu soal stok, harga, ongkir, atau jam buka toko?";
  }

  // 2) Jam buka / operasional
  if (containsAny(text, ["jam buka", "buka jam", "tutup jam", "jam operasional", "buka sampai", "jam berapa"])) {
    return "Toko kami buka setiap hari Senin–Sabtu jam 07.00–20.00, dan Minggu jam 08.00–17.00 😊";
  }

  // 3) Ongkir / pengiriman / antar
  if (containsAny(text, ["ongkir", "antar", "kirim", "diantar", "pengiriman", "delivery"])) {
    return "Kami menyediakan layanan antar untuk wilayah sekitar toko, gratis ongkir dengan minimum belanja tertentu. Pesanan diproses cepat dan bisa sampai di hari yang sama untuk area dekat!";
  }

  // 4) Cara pembayaran
  if (containsAny(text, ["bayar", "pembayaran", "transfer", "cod", "cash", "qris"])) {
    return "Pembayaran bisa lewat transfer bank, QRIS, atau bayar di tempat (COD) saat barang diantar ke rumah Anda.";
  }

  // 5) Stok / harga produk tertentu — coba deteksi nama produk yang disebut
  const mentioned = findMentionedProduct(text, products);
  if (mentioned && containsAny(text, ["stok", "ada ga", "ada gak", "tersedia", "ready"])) {
    return mentioned.stock > 0
      ? `Stok "${mentioned.name}" saat ini tersedia sebanyak ${mentioned.stock} (kemasan ${mentioned.unit}).`
      : `Mohon maaf, stok "${mentioned.name}" sedang habis. Silakan cek produk lain di halaman Produk ya!`;
  }
  if (mentioned && containsAny(text, ["harga", "berapa", "harganya"])) {
    const rupiah = "Rp" + Number(mentioned.price).toLocaleString("id-ID");
    return `Harga "${mentioned.name}" adalah ${rupiah} per ${mentioned.unit}.`;
  }

  // 6) Pertanyaan stok/harga umum tanpa nama produk spesifik
  if (containsAny(text, ["stok", "tersedia", "ready"])) {
    return "Untuk info stok terbaru, silakan cek halaman Produk kami — datanya selalu diperbarui langsung oleh admin toko.";
  }
  if (containsAny(text, ["harga", "berapa"])) {
    return "Harga setiap produk bisa dilihat langsung di halaman Produk. Kalau ada produk spesifik yang Anda cari, sebutkan namanya ya!";
  }

  // 7) Terima kasih
  if (containsAny(text, ["makasih", "terima kasih", "thanks"])) {
    return "Sama-sama! Senang bisa membantu 😊 Ada lagi yang ingin ditanyakan?";
  }

  // 8) Fallback default
  return "Terima kasih sudah bertanya! Untuk saat ini saya bisa bantu info seputar jam buka, ongkir, cara pembayaran, serta stok & harga produk. Coba tanyakan salah satu topik itu ya 🙂";
}

module.exports = getChatReply;
