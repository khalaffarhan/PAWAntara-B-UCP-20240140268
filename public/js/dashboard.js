// public/js/dashboard.js
// Dashboard admin: tambah/edit/hapus produk lewat REST API (Fetch API + async/await).
// Semua request mutasi (POST/PUT/DELETE) memakai session cookie yang sudah dibuat saat login,
// jadi otomatis ditolak 401 oleh server kalau sesi sudah habis / belum login.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const tableBody = document.getElementById("productTableBody");
  const formAlert = document.getElementById("formAlert");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const idInput = document.getElementById("productId");

  if (!form || !tableBody) return;

  function formatRupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
  }

  function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = `auth-alert ${type}`;
    formAlert.hidden = false;
    setTimeout(() => { formAlert.hidden = true; }, 4000);
  }

  function stockBadgeClass(stock) {
    if (stock <= 0) return "empty";
    if (stock < 10) return "low";
    return "";
  }

  function renderTable(products) {
    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Belum ada produk.</td></tr>`;
      return;
    }

    tableBody.innerHTML = products
      .map(
        (p) => `
        <tr data-id="${p.id}">
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${formatRupiah(p.price)}</td>
          <td><span class="stock-badge ${stockBadgeClass(p.stock)}">${p.stock}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="icon-btn edit" title="Edit" data-action="edit" data-id="${p.id}">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button type="button" class="icon-btn delete" title="Hapus" data-action="delete" data-id="${p.id}">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  async function loadProducts() {
    tableBody.innerHTML = `<tr><td colspan="6" class="table-loading"><i class="bi bi-arrow-repeat"></i> Memuat data produk...</td></tr>`;
    try {
      const res = await fetch("/api/products");
      const result = await res.json();
      if (res.ok && result.status === "success") {
        renderTable(result.data);
      } else {
        tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Gagal memuat produk.</td></tr>`;
      }
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Terjadi kesalahan jaringan.</td></tr>`;
    }
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    formTitle.innerHTML = '<i class="bi bi-plus-circle-fill"></i> Tambah Produk';
    submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Simpan Produk';
    cancelEditBtn.hidden = true;
  }

  async function fillFormForEdit(id) {
    try {
      const res = await fetch(`/api/products/${id}`);
      const result = await res.json();
      if (!res.ok || result.status !== "success") {
        showAlert("Produk tidak ditemukan.", "error");
        return;
      }
      const p = result.data;
      idInput.value = p.id;
      document.getElementById("name").value = p.name;
      document.getElementById("category").value = p.category;
      document.getElementById("price").value = p.price;
      document.getElementById("stock").value = p.stock;
      document.getElementById("unit").value = p.unit || "";
      document.getElementById("icon").value = p.icon || "";
      document.getElementById("description").value = p.description || "";

      formTitle.innerHTML = `<i class="bi bi-pencil-fill"></i> Edit Produk: ${p.name}`;
      submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Update Produk';
      cancelEditBtn.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      showAlert("Terjadi kesalahan jaringan.", "error");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.status === 401) {
        showAlert("Sesi login habis, silakan login ulang.", "error");
        setTimeout(() => (window.location.href = "/login"), 1200);
        return;
      }

      if (res.ok && result.status === "success") {
        showAlert("Produk berhasil dihapus.", "success");
        loadProducts();
      } else {
        showAlert(result.message || "Gagal menghapus produk.", "error");
      }
    } catch (err) {
      showAlert("Terjadi kesalahan jaringan.", "error");
    }
  }

  // Submit form (tambah / update tergantung ada tidaknya productId)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const unit = document.getElementById("unit").value.trim();
    const icon = document.getElementById("icon").value.trim();
    const description = document.getElementById("description").value.trim();

    // Validasi input dasar — cegah submit kosong / tidak valid
    if (!name || !category || price === "" || stock === "") {
      showAlert("Nama, kategori, harga, dan stok wajib diisi.", "error");
      return;
    }
    if (Number(price) < 0 || Number(stock) < 0) {
      showAlert("Harga dan stok tidak boleh negatif.", "error");
      return;
    }

    const payload = { name, category, price: Number(price), stock: Number(stock), unit, icon, description };
    const editingId = idInput.value;
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    submitBtn.disabled = true;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.status === 401) {
        showAlert("Sesi login habis, silakan login ulang.", "error");
        setTimeout(() => (window.location.href = "/login"), 1200);
        return;
      }

      if (res.ok && result.status === "success") {
        showAlert(result.message || "Berhasil disimpan.", "success");
        resetForm();
        loadProducts();
      } else {
        showAlert(result.message || "Gagal menyimpan produk.", "error");
      }
    } catch (err) {
      showAlert("Terjadi kesalahan jaringan.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  cancelEditBtn.addEventListener("click", resetForm);

  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "edit") fillFormForEdit(id);
    if (btn.dataset.action === "delete") deleteProduct(id);
  });

  loadProducts();
});
