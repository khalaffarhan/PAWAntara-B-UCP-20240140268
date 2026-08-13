// public/js/login.js
// Handle form login: validasi dasar, kirim ke POST /api/login via Fetch API (async/await).

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const alertBox = document.getElementById("loginAlert");
  const submitBtn = document.getElementById("loginSubmitBtn");
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (!form) return;

  // Toggle show/hide password
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggleBtn.innerHTML = isHidden
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    });
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `auth-alert ${type}`;
    alertBox.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validasi input dasar — cegah submit kosong
    if (!username || !password) {
      showAlert("Username dan password wajib diisi.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Memproses...';

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        showAlert("Login berhasil! Mengarahkan ke dashboard...", "success");
        window.location.href = "/dashboard";
      } else {
        showAlert(result.message || "Username atau password salah.", "error");
      }
    } catch (err) {
      showAlert("Terjadi kesalahan jaringan. Coba lagi.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Masuk';
    }
  });
});
