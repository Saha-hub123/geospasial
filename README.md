# 🗺️ Peta Kampus ULBI (SIG CrootJS)

Website Sistem Informasi Geografis (SIG) Kampus **ULBI (Universitas Logistik dan Bisnis Internasional)** Bandung dengan tampilan modern dan minimalis, dibuat murni menggunakan modul standar resmi **[CrootJS](https://croot.js.org/)** (`map.js`, `geo.js`, `element.js`) tanpa ketergantungan library peta eksternal seperti Leaflet ataupun CSS pihak ketiga.

---

## ⚡ Fitur & Arsitektur CrootJS

- **`geo.js`**: Memuat, memvalidasi data GeoJSON dari URL atau file lokal, mengekstrak properti (`getPropertyKeys`), dan menghitung titik tengah spasial (`getCenter`).
- **`map.js`**: Peta slippy map super ringan (~11 KB gzipped) berbasis tile OpenStreetMap dan render layer GeoJSON langsung sebagai elemen SVG interaktif (*pan*, *pinch-zoom*, popup, dan klik koordinat).
- **`element.js`**: Helper manipulasi DOM native (`onClick`, `onChange`, `getValue`, `setInnerText`, `container`).
- **Modern Minimalist UI**: Antarmuka bersih, elegan, dan fungsional tanpa framework CSS berat (murni Vanilla CSS).

---

## 📂 Data Geospasial Tunggal

Semua data tersimpan rapi hanya dalam 1 file GeoJSON tunggal:
- **`714240013_mohammadisa_sig_mapulbi.geojson`** (Total **60 fitur**):
  - 🏛️ **20 Poligon Bangunan**: Gedung Rektorat, Vokasi, FLTB, Masjid Nurul Ilmi, Asrama Putra Raflesia, Asrama Putri Anggrek & Gandaria, GOR STIMLOG & Poltekpos, Auditorium, Perpustakaan, Pasar Sarijadi, Student Center, Pos Satpam, dll.
  - 🛣️ **20 Polyline Jalan / Jalur**: Jl. Raya Sari Asih, Boulevard Utama Kampus, Jl. Lingkar Barat/Timur, Jl. Sariasih 2 & 3, Jl. Tirtasari 1-3, Jl. Sarimanah 1-2, Jl. Sarijadi Raya, Jl. Sarimanis, dll.
  - 📍 **20 Point Fasilitas / POI**: Kampus ULBI, Masjid Al-Falah, Puskesmas Sarijadi, Masjid Baitul A'la, Kosan Mahasiswa, Donsu, D'Okeh, Labbaik Chicken, Mixue, Graha Sarimanah, SD, Rumah Bersalin Muhammadiyah, Al Azhar, Polban, AHASS, Lapang Voli, Warnet, Laundry, dll.

Setiap fitur memiliki atribut lengkap dan seragam:
- `name` (Nama Objek)
- `kategori` (Kategori Fasilitas / Fungsi)
- `tipe` (Tipe Spesifik Objek)
- `keterangan` (Deskripsi / Catatan Lapangan)

---

## 🚀 Publikasi ke GitHub Pages

Proyek ini menggunakan file statis murni sehingga dapat langsung diaktifkan di GitHub Pages:

1. **Commit & Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: peta sig ulbi modern minimalis crootjs"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO>.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages**:
   - Buka repositori GitHub > **Settings** > **Pages**.
   - Di bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
   - Website akan online di `https://<USERNAME>.github.io/<REPO>/`.

---

## 💻 Pengujian Lokal

Gunakan web server lokal sederhana:
- **Node.js**: `npx serve .`
- **Python**: `python -m http.server 8000`
- **VS Code**: Klik kanan `index.html` > **Open with Live Server**.
