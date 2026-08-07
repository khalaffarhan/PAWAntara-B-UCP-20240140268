// public/js/main.js
// Interaksi front-end: hamburger menu, ripple button, scroll reveal, demo chat UI.
// Sprint 1: belum ada pemanggilan API sungguhan — murni manipulasi DOM & event handling.

document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initButtonRipple();
  initChatDemo();
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
   3. Demo UI Tanya AI (belum terhubung ke backend — Sprint 1)
--------------------------------------------------------- */
function initChatDemo() {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const body = document.getElementById("chatBody");
  if (!form || !input || !body) return;

  const demoReplies = [
    "Terima kasih sudah bertanya! Fitur balasan otomatis dari server sedang disiapkan dan akan aktif pada tahap pengembangan berikutnya.",
    "Pertanyaan Anda sudah tercatat. Untuk saat ini, silakan hubungi kami langsung via tombol WhatsApp di halaman detail produk ya!",
    "Asisten AI kami masih dalam tahap pengembangan tampilan (UI demo) — balasan cerdas menyusul segera 😊",
  ];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return; // validasi dasar: cegah submit kosong

    appendBubble("user", message);
    input.value = "";
    input.focus();

    const loadingBubble = appendLoadingBubble();

    // Simulasi delay balasan (dummy, tanpa request ke server)
    setTimeout(() => {
      loadingBubble.remove();
      const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
      appendBubble("ai", reply);
    }, 1100);
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
