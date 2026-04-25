# Panduan Setup Frontend Bioskop

Ikuti langkah-langkah di bawah ini setelah melakukan `git clone` untuk pertama kalinya.

## Persyaratan Awal
- **Node.js**: Versi 18.0.0 atau yang lebih baru.
- **NPM**: Biasanya sudah satu paket dengan Node.js.

## 1. Instalasi Semua Dependency
Anda **TIDAK PERLU** menginstal library satu per satu (seperti lucide, axios, dll) karena semuanya sudah terdaftar di `package.json`. Cukup jalankan satu perintah ini di terminal:

```bash
npm install
```

**Apa saja yang otomatis terinstal?**
- **React & Vite**: Core framework.
- **Lucide React**: Untuk icon-icon di aplikasi.
- **Tailwind CSS**: Untuk styling.
- **Axios**: Untuk koneksi ke API Backend.
- **Recharts**: Untuk tampilan chart/grafik.
- **Html2canvas**: Untuk fitur download tiket/gambar.

## 2. Cek Koneksi API (Penting!)
Pastikan frontend tahu di mana backend Anda berjalan. 
Buka file: `src/api/axiosClient.js`

Cek baris `baseURL`:
```javascript
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Sesuaikan jika port backend berbeda
  // ...
});
```

## 3. Menjalankan Aplikasi
Setelah instalasi selesai, jalankan aplikasi dengan perintah:

```bash
npm run dev
```

Aplikasi biasanya akan berjalan di `http://localhost:5173`.

---

## Troubleshooting (Jika Error)
1. **Error: "vite is not recognized"**: Berarti `npm install` belum berhasil atau terinterupsi. Coba hapus folder `node_modules` lalu jalankan `npm install` lagi.
2. **Error: "Network Error" (saat login/ambil data)**: Pastikan Backend Laravel sudah jalan (`php artisan serve`) dan URL di `axiosClient.js` sudah benar.
