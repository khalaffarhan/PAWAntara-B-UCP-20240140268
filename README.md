# 🛒 Toko Sembako Ariesta — Website & REST API (Sprint 1 & 2)

Tugas UCP 1 — Mata Kuliah Pemrograman Aplikasi Web (PAW)

**Nama Mahasiswa: Muhammad Mudhaffar Khalaf Farhan**
**NIM:20240140268** 
**Kelas:PAW-ANTARA-B** 

---

## 📖 Deskripsi Project

Website & REST API untuk **Toko Sembako Ariesta**, sebuah UMKM yang menjual
beras, minyak goreng, gula, telur, dan kebutuhan pokok rumah tangga lainnya.
Project ini dibangun dengan **Node.js + Express.js** menggunakan **EJS**
sebagai view engine, dilengkapi dengan:

- Halaman publik: Beranda, Produk (dinamis via Fetch API), Detail Produk,
  Tanya AI (chatbot dummy real-time).
- Dashboard admin/kasir untuk CRUD produk, dilindungi sistem login
  (session-based) — hanya bisa diakses setelah login.
- REST API penuh (GET/POST/PUT/DELETE) untuk data produk dengan kontrak
  response JSON yang konsisten.
- Endpoint `POST /api/chat` dengan logika balasan AI **dummy** (keyword
  matching di backend Express) — **tanpa** memanggil API AI pihak ketiga
  apa pun (OpenAI/Anthropic/Gemini/dsb), sesuai ketentuan tugas.

Tampilan didesain dengan pendekatan UI/UX modern (gaya startup/e-commerce
premium): hero gradient, statistik toko, feature card, product card dengan
efek hover, halaman detail dua kolom, dashboard admin dengan tabel & form
CRUD, serta halaman **Tanya AI** bergaya chat interaktif yang benar-benar
terhubung ke server.

---

## 🚀 Cara Menjalankan Project Secara Lokal

1. Clone repository ini, lalu masuk ke folder project:
   ```bash
   git clone <url-repo-anda>
   cd toko-sembako-ariesta
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Salin file `.env.example` menjadi `.env` (atau buat manual):
   ```bash
   cp .env.example .env
   ```
   Isi `.env`:
   ```
   PORT=3000
   SESSION_SECRET=ganti-dengan-string-rahasia-anda
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. Jalankan server (mode development, auto-restart via nodemon):
   ```bash
   npm run dev
   ```
   Atau mode biasa:
   ```bash
   npm start
   ```

5. Buka browser ke:
   ```
   http://localhost:3000
   ```

### 🔑 Kredensial Login Admin/Kasir (untuk pengecekan asisten)

| Username | Password   |
|----------|------------|
| `admin`  | `admin123` |

Kredensial mentah diambil dari file `.env` (tidak ikut ter-commit ke repo —
lihat `.gitignore`). Password admin **tidak** disimpan/dibandingkan sebagai
teks polos di server — di-hash memakai **bcrypt** (`bcryptjs`) saat server
start (lihat `data/admin.js`).

---

## 🗂️ Struktur Folder

```
toko-sembako-ariesta/
├── app.js                     # Entry point server Express
├── .env                       # Kredensial & secret (TIDAK di-commit)
├── .env.example                # Contoh isi .env
├── data/
│   ├── products.js             # Data produk (array in-memory, 1 sumber data)
│   └── admin.js                 # Akun admin/kasir (password di-hash bcrypt)
├── middleware/
│   ├── logger.js                # Middleware custom #1: request logger
│   ├── responseTime.js          # Middleware custom #2: pencatat waktu respons
│   └── auth.js                   # Middleware proteksi (page & API)
├── utils/
│   └── chatbot.js                # Logika balasan Tanya AI dummy (keyword matching)
├── routes/
│   ├── pages.js                  # Route halaman (EJS render / shell dinamis)
│   ├── api.js                    # REST API produk (CRUD) & /api/chat
│   └── auth.js                    # Halaman login + POST /api/login & /api/logout
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs             # Navbar dinamis (Login/Dashboard/Logout)
│   │   ├── footer.ejs
│   │   └── scripts.ejs
│   ├── index.ejs                  # Beranda
│   ├── produk.ejs                 # Daftar produk (shell, data via Fetch API)
│   ├── produk-detail.ejs          # Detail produk (shell, data via Fetch API)
│   ├── tanya-ai.ejs                # Halaman chat Tanya AI (real-time)
│   ├── login.ejs                   # Halaman login admin/kasir
│   ├── dashboard.ejs               # Dashboard CRUD produk (wajib login)
│   └── 404.ejs
└── public/
    ├── css/style.css
    └── js/
        ├── main.js                 # Hamburger, ripple, chat, logout
        ├── produk.js                 # Fetch & filter produk (halaman publik)
        ├── produk-detail.js          # Fetch detail produk by ID
        ├── login.js                   # Submit form login via Fetch API
        └── dashboard.js                # CRUD produk via Fetch API
```

---

## 🔗 Daftar Halaman (Route)

| Method | Route            | Akses  | Deskripsi                                                          |
|--------|-------------------|--------|------------------------------------------------------------------------|
| GET    | `/`               | Publik | Beranda — hero, statistik toko, keunggulan, produk pilihan            |
| GET    | `/produk`         | Publik | Daftar semua produk (data & filter diambil dinamis via Fetch API)     |
| GET    | `/produk/:id`     | Publik | Detail 1 produk berdasarkan ID (menangani ID tidak ditemukan)         |
| GET    | `/tanya-ai`       | Publik | Halaman chat Tanya AI, terhubung ke `POST /api/chat`                  |
| GET    | `/login`          | Publik | Halaman login admin/kasir                                              |
| GET    | `/dashboard`      | Login  | Dashboard CRUD produk (redirect ke `/login` jika belum login)         |

## 🔌 Daftar Endpoint REST API

| Method | Endpoint             | Deskripsi                                       | Akses  |
|--------|-----------------------|----------------------------------------------------|--------|
| POST   | `/api/login`           | Login admin/kasir, membuat sesi login              | Publik |
| POST   | `/api/logout`          | Logout, menghapus sesi login                        | Login  |
| GET    | `/api/products`        | Ambil seluruh data produk sembako                   | Publik |
| GET    | `/api/products/:id`    | Ambil satu produk berdasarkan ID                    | Publik |
| POST   | `/api/products`        | Tambah produk baru                                   | Login  |
| PUT    | `/api/products/:id`    | Update produk (harga/stok/dll) berdasarkan ID       | Login  |
| DELETE | `/api/products/:id`    | Hapus produk berdasarkan ID                          | Login  |
| POST   | `/api/chat`             | Kirim pertanyaan, terima balasan AI dummy dari server | Publik |

**Format response konsisten:** `{ "status": "success" | "error", "message": "...", "data": ... }`

Endpoint dengan akses **Login** akan menolak request yang belum memiliki
sesi login dengan response `{ "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" }`
dan HTTP status code **401** — pengecekan dilakukan di server (middleware
`requireApiAuth`), bukan hanya disembunyikan di frontend, sehingga tetap
ditolak walau di-hit langsung lewat Postman/Thunder Client tanpa login.

Contoh body request:
- `POST /api/login` → `{ "username": "admin", "password": "admin123" }`
- `POST /api/products` → `{ "name": "Minyak Goreng 2L", "category": "Minyak Goreng", "price": 34000, "stock": 15, "unit": "2 liter", "icon": "bi-droplet-fill", "description": "..." }`
- `PUT /api/products/:id` → field apa saja yang ingin diubah, contoh `{ "price": 68000, "stock": 12 }`
- `POST /api/chat` → `{ "message": "jam buka toko jam berapa?" }`

---

## 🤖 Logika Tanya AI (Dummy)

Balasan pada fitur Tanya AI **100% dibuat sendiri di backend Express**
(`utils/chatbot.js`), memakai pendekatan *keyword matching* + `if-else` —
**bukan** panggilan ke API AI pihak ketiga apa pun. Topik yang dikenali:
sapaan, jam buka/operasional, ongkir/pengiriman, cara pembayaran, serta
stok & harga produk tertentu (mendeteksi nama produk yang disebut di
pertanyaan). Di luar topik tersebut, chatbot memberi balasan fallback yang
mengarahkan ke topik yang didukung.

---

## 🎨 Penjelasan Tampilan (UI/UX)

- **Font:** Plus Jakarta Sans (Google Fonts) — modern & mudah dibaca di semua ukuran layar.
- **Palet warna:** Primary `#198754` (hijau khas UMKM segar), Secondary `#20c997`, Accent `#FFC107`, Background `#F8F9FA`, Card putih.
- **Navbar:** sticky, menu hamburger fungsional (vanilla JS) di mobile, kini **dinamis** — menampilkan tombol "Login Admin" saat belum login, atau menu "Dashboard" + "Logout" saat sudah login (status login dikirim server lewat `res.locals.isLoggedIn`).
- **Hero:** full width gradient hijau, headline besar, CTA ganda, ilustrasi keranjang & floating chip kategori, strip statistik toko.
- **Product card:** ikon representatif produk, badge kategori, nama, harga format Rupiah, status stok (badge merah jika stok < 10), tombol detail.
- **Halaman Produk (Sprint 2):** data diambil **dinamis** dari `GET /api/products` lewat Fetch API — filter kategori (pill) & pencarian diproses di client tanpa reload halaman, termasuk empty state saat produk tidak ditemukan.
- **Detail Produk (Sprint 2):** juga diambil dinamis dari `GET /api/products/:id`, menangani kasus ID tidak ditemukan dengan halaman pesan yang rapi (bukan crash).
- **Halaman Login:** kartu terpusat dengan ikon gembok, form username/password (toggle show/hide password), validasi dasar cegah submit kosong, alert sukses/error, dan redirect otomatis ke dashboard setelah berhasil.
- **Dashboard Admin (Sprint 2):** kartu form tambah/edit produk (grid responsif) dan tabel daftar produk dengan badge stok berwarna, tombol edit (mengisi ulang form) dan hapus (dengan konfirmasi), semuanya lewat Fetch API tanpa reload halaman.
- **Tanya AI:** bubble chat pelanggan & AI, avatar, loading bubble animasi titik-titik saat menunggu balasan server, kini **terhubung real-time** ke `POST /api/chat`.
- **Footer:** informasi toko, navigasi, kontak, jam operasional, sosial media, dan copyright.
- **Animasi:** fade-up saat halaman dimuat, ripple effect pada tombol, card lift & image zoom pada hover, transisi halus 0.3s–0.5s.
- **Responsive:** breakpoint di 992px, 768px, dan 480px, termasuk penyesuaian grid form dashboard & auth card di layar kecil.

---

## ✅ Catatan Kepatuhan Scope

- Tidak ada pemanggilan API AI eksternal apa pun — seluruh logika Tanya AI
  berjalan di backend Express sendiri (`utils/chatbot.js`).
- Tidak ada fitur registrasi akun publik — akun admin/kasir dibuat lewat
  seed/`.env` (`data/admin.js`), bukan self-register.
- Satu jenis akun admin/kasir (tanpa role-based permission berjenjang).
- Data produk & akun admin memakai array in-memory (sesuai pilihan bebas
  di PRD), dengan `GET`, `POST`, `PUT`, `DELETE` mengacu ke **satu sumber
  data yang sama** (`data/products.js`) sehingga perubahan di dashboard
  langsung terlihat di halaman Produk publik tanpa restart server.
- Password admin di-hash dengan bcrypt, kredensial mentah disimpan di
  `.env` yang di-gitignore.
