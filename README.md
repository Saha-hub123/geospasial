# 🗺️ GeoJSON di Peta + CrootJS (SIG Kampus ULBI)

Project website peta interaktif Sistem Informasi Geografis (SIG) Kampus **ULBI (Universitas Logistik dan Bisnis Internasional)** Bandung. Project ini murni dibuat menggunakan modul standar resmi **[CrootJS](https://croot.js.org/)** (`map.js`, `geo.js`, `element.js`) tanpa library pihak ketiga lainnya (tanpa Leaflet, Mapbox, Bootstrap, atau dependencies tambahan).

Website ini siap langsung dipublikasikan ke **GitHub Pages**.

---

## ⚡ Maps Without a Map Library

Mengikuti filosofi dan standar resmi CrootJS:
- **`geo.js`**: Mengambil dan memvalidasi data GeoJSON dari URL atau file lokal, mengembalikan `FeatureCollection`, menghitung titik tengah (`getCenter`), dan membaca kunci atribut (`getPropertyKeys`).
- **`map.js`**: Merender peta *slippy map* dari nol (~11 KB gzipped) dengan tile OpenStreetMap, menggambar GeoJSON sebagai SVG vektor interaktif, menangani *pan*, *pinch-zoom*, popup, dan klik koordinat (`onMapClick`).
- **`element.js`**: Helper DOM native (`onClick`, `onChange`, `getValue`, `setInnerText`, `container`).
- **Murni ES6+ Module**: Tanpa bundler, tanpa npm, diimpor langsung via CDN jsDelivr.

---

## 📂 Struktur Berkas Data GeoJSON

1. **`714240013_mohammadisa_sig_mapulbi.geojson`** (Data Awal / Original)
   - Berisi 20 fitur awal kampus ULBI (16 poligon bangunan, 3 poliline jalan, 1 point lokasi).

2. **`update.geojson`** (Data Update / Diperkaya)
   - Berisi **75 fitur geospasial** di sekitar kampus ULBI Bandung:
     - 🏛️ **25 Poligon Bangunan** *(minimal 20 terpenuhi)*
     - 🛣️ **25 Polyline Jalan / Jalur** *(minimal 20 terpenuhi)*
     - 📍 **25 Point / Titik Fasilitas POI** *(minimal 20 terpenuhi)*
   - File ini dimuat secara default di dalam website melalui input URL `./update.geojson`.

---

## 🚀 Panduan Publikasi ke GitHub Pages

1. **Inisialisasi Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: peta geojson ulbi dengan crootjs"
   git branch -M main
   ```

2. **Hubungkan dan Push ke Repositori GitHub**:
   ```bash
   git remote add origin https://github.com/<USERNAME>/<REPO>.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages**:
   - Buka repositori di GitHub.
   - Masuk ke menu **Settings** > **Pages**.
   - Pada bagian **Build and deployment** > **Branch**, pilih `main` dan folder `/ (root)`.
   - Klik **Save**.
   - Website akan aktif di `https://<USERNAME>.github.io/<REPO>/`.

---

## 💻 Pengujian Lokal

Jalankan menggunakan web server lokal sederhana (karena ES Module memerlukan protokol HTTP/HTTPS):
- **Node.js**:
  ```bash
  npx serve .
  ```
- **Python**:
  ```bash
  python -m http.server 8000
  ```
- **VS Code**: Klik kanan `index.html` > **Open with Live Server**.
