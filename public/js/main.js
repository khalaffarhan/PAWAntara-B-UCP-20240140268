// public/js/main.js
// Interaksi front-end: hamburger menu, ripple button, scroll reveal, demo chat UI.
// Sprint 1: belum ada pemanggilan API sungguhan — murni manipulasi DOM & event handling.

document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initButtonRipple();
  initChat();
  initLogout();
});

/* ---------------------------------------------------------
   1. Hamburger menu (mobile navbar)
--------------------------------------------------------- */
function initHamburger() {
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("navMenu");
  if (!btn || !menu) return;

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  btn.addEventListener("click", toggleMenu);

  // Tutup menu saat salah satu link diklik
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("open")) toggleMenu();
    });
  });

  // Tutup menu saat tombol Escape ditekan
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) toggleMenu();
  });
}

/* ---------------------------------------------------------
   2. Ripple effect pada semua tombol .btn
--------------------------------------------------------- */
function initButtonRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.remove("rippling");
      // Trigger reflow supaya animasi bisa diulang
      void btn.offsetWidth;
      btn.classList.add("rippling");
      setTimeout(() => btn.classList.remove("rippling"), 650);
    });
  });
}

/* ---------------------------------------------------------
   3. Tanya AI — terhubung ke POST /api/chat (Sprint 2)
--------------------------------------------------------- */
function initChat() {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const body = document.getElementById("chatBody");
  if (!form || !input || !body) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return; // validasi dasar: cegah submit kosong

    appendBubble("user", message);
    input.value = "";
    input.focus();

    const loadingBubble = appendLoadingBubble();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const result = await res.json();

      loadingBubble.remove();

      if (res.ok && result.status === "success") {
        appendBubble("ai", result.data.reply);
      } else {
        appendBubble("ai", result.message || "Maaf, terjadi kesalahan. Coba lagi ya.");
      }
    } catch (err) {
      loadingBubble.remove();
      appendBubble("ai", "Koneksi ke server terganggu. Silakan coba lagi.");
    }
  });

  function appendBubble(role, text) {
    const wrapper = document.createElement("div");
    wrapper.className = `chat-bubble ${role === "ai" ? "bubble-ai" : "bubble-user"}`;

    const avatar = document.createElement("div");
    avatar.className = `chat-avatar small ${role === "ai" ? "ai-avatar" : "user-avatar"}`;
    avatar.innerHTML = `<i class="bi ${role === "ai" ? "bi-robot" : "bi-person-fill"}"></i>`;

    const content = document.createElement("div");
    content.className = "bubble-content";
    content.textContent = text;

    wrapper.appendChild(avatar);
    wrapper.appendChild(content);
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;

    return wrapper;
  }

  function appendLoadingBubble() {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-bubble bubble-ai bubble-loading";
    wrapper.innerHTML = `
      <div class="chat-avatar small ai-avatar"><i class="bi bi-robot"></i></div>
      <div class="bubble-content">
        <span class="dot-typing"></span>
        <span class="dot-typing"></span>
        <span class="dot-typing"></span>
      </div>
    `;
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;
    return wrapper;
  }
}

/* ---------------------------------------------------------
   4. Logout (tombol muncul di navbar semua halaman saat login) — Sprint 2
--------------------------------------------------------- */
function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      // abaikan error jaringan, tetap redirect ke halaman login
    } finally {
      window.location.href = "/login";
    }
  });
}
