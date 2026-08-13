// public/js/produk.js
// Halaman Produk (publik). Mengambil data secara DINAMIS dari GET /api/products
// lewat Fetch API (async/await) — bukan data hardcode lagi (Sprint 2, FR-16).
// Filter kategori & pencarian diproses di client dari data yang sama.

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const resultCount = document.getElementById("resultCount");
  const filterForm = document.getElementById("filterForm");
  const searchInput = document.getElementById("searchInput");
  const pillsContainer = document.getElementById("categoryPills");

  if (!grid) return;

  let allProducts = [];
  let activeCategory = "semua";
  let activeSearch = "";

  function formatRupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
  }

  function renderProducts(list) {
    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state fade-up" style="grid-column: 1 / -1;">
          <i class="bi bi-emoji-frown"></i>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba kata kunci lain atau lihat semua kategori produk kami.</p>
          <button type="button" class="btn btn-outline" id="resetFilterBtn">Reset Filter</button>
        </div>
      `;
      const resetBtn = document.getElementById("resetFilterBtn");
      if (resetBtn) resetBtn.addEventListener("click", resetFilters);
      return;
    }

    grid.innerHTML = list
      .map(
        (p) => `
        <article class="product-card fade-up">
          <a href="/produk/${p.id}" class="product-media">
            <span class="badge-category">${p.category}</span>
            <i class="bi ${p.icon || "bi-box-seam-fill"}"></i>
          </a>
          <div class="product-body">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-unit">${p.unit || "-"}</p>
            <div class="product-footer">
              <span class="product-price">${formatRupiah(p.price)}</span>
              <span class="product-stock ${p.stock < 10 ? "low" : ""}">
                Stok ${p.stock}
              </span>
            </div>
            <a href="/produk/${p.id}" class="btn btn-primary btn-block">
              Lihat Detail
            </a>
          </div>
        </article>
      `
      )
      .join("");
  }

  function applyFilters() {
    let result = allProducts;

    if (activeCategory && activeCategory !== "semua") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (activeSearch) {
      const keyword = activeSearch.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(keyword));
    }

    resultCount.innerHTML = activeSearch
      ? `Menampilkan <strong>${result.length}</strong> produk untuk "<strong>${activeSearch}</strong>"`
      : `Menampilkan <strong>${result.length}</strong> produk`;

    renderProducts(result);
  }

  function resetFilters() {
    activeCategory = "semua";
    activeSearch = "";
    searchInput.value = "";
    pillsContainer.querySelectorAll(".pill").forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.kategori === "semua");
    });
    applyFilters();
  }

  async function loadProducts() {
    grid.innerHTML = `<p class="table-loading"><i class="bi bi-arrow-repeat"></i> Memuat data produk dari server...</p>`;
    try {
      const res = await fetch("/api/products");
      const result = await res.json();

      if (res.ok && result.status === "success") {
        allProducts = result.data;
        applyFilters();
      } else {
        grid.innerHTML = `<p class="table-loading">Gagal memuat produk. Silakan refresh halaman.</p>`;
      }
    } catch (err) {
      grid.innerHTML = `<p class="table-loading">Terjadi kesalahan jaringan. Silakan refresh halaman.</p>`;
    }
  }

  // Filter kategori (klik pill)
  pillsContainer.addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;
    e.preventDefault();

    activeCategory = pill.dataset.kategori;
    pillsContainer.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    applyFilters();
  });

  // Filter pencarian (submit form)
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    activeSearch = searchInput.value.trim();
    applyFilters();
  });

  loadProducts();
});
