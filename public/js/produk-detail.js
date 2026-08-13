// public/js/produk-detail.js
// Halaman Detail Produk (route dinamis /produk/:id). Data diambil dari
// GET /api/products/:id lewat Fetch API — menangani kasus produk tidak ditemukan.

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detailContainer");
  if (!container) return;

  const productId = container.dataset.productId;

  function formatRupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
  }

  function renderNotFound() {
    document.title = "Produk Tidak Ditemukan · Toko Sembako Ariesta";
    container.innerHTML = `
      <div class="container empty-state fade-up">
        <i class="bi bi-box-seam"></i>
        <h1>Produk Tidak Ditemukan</h1>
        <p>Maaf, produk yang Anda cari tidak tersedia atau sudah tidak ada di katalog kami.</p>
        <a href="/produk" class="btn btn-primary">
          <i class="bi bi-arrow-left"></i> Kembali ke Produk
        </a>
      </div>
    `;
  }

  function renderProduct(p) {
    document.title = `${p.name} · Toko Sembako Ariesta`;
    const waMessage = encodeURIComponent(`Halo, saya mau tanya stok ${p.name}`);

    container.innerHTML = `
      <div class="container">
        <nav class="breadcrumb fade-up" aria-label="breadcrumb">
          <a href="/">Beranda</a> <i class="bi bi-chevron-right"></i>
          <a href="/produk">Produk</a> <i class="bi bi-chevron-right"></i>
          <span>${p.name}</span>
        </nav>

        <div class="detail-grid fade-up">
          <div class="detail-media">
            <span class="badge-category">${p.category}</span>
            <i class="bi ${p.icon || "bi-box-seam-fill"}"></i>
          </div>

          <div class="detail-info">
            <h1>${p.name}</h1>
            <p class="detail-unit"><i class="bi bi-box"></i> Kemasan: ${p.unit || "-"}</p>

            <div class="detail-price-row">
              <span class="detail-price">${formatRupiah(p.price)}</span>
              <span class="product-stock ${p.stock < 10 ? "low" : ""}">
                <i class="bi bi-check-circle-fill"></i> Stok tersedia: ${p.stock}
              </span>
            </div>

            <p class="detail-desc">${p.description || ""}</p>

            <div class="detail-actions">
              <a
                href="https://wa.me/6281234567890?text=${waMessage}"
                target="_blank"
                rel="noopener"
                class="btn btn-primary btn-lg"
              >
                <i class="bi bi-whatsapp"></i> Pesan via WhatsApp
              </a>
              <a href="/tanya-ai" class="btn btn-ghost btn-lg">
                <i class="bi bi-robot"></i> Tanya AI Dulu
              </a>
            </div>

            <a href="/produk" class="back-link">
              <i class="bi bi-arrow-left"></i> Kembali ke semua produk
            </a>
          </div>
        </div>
      </div>
    `;
  }

  async function loadProduct() {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`);
      const result = await res.json();

      if (res.ok && result.status === "success") {
        renderProduct(result.data);
      } else {
        renderNotFound();
      }
    } catch (err) {
      container.innerHTML = `<div class="container"><p class="table-loading">Terjadi kesalahan jaringan. Silakan refresh halaman.</p></div>`;
    }
  }

  loadProduct();
});
