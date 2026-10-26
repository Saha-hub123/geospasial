# 🗺️ Sistem Informasi Geografis (SIG) Kampus ULBI Bandung

Website peta interaktif kampus **Universitas Logistik dan Bisnis Internasional (ULBI)** Bandung (Jl. Sariasih No. 54, Sarijadi, Sukasari, Kota Bandung) yang dibangun murni menggunakan library modern vanilla JavaScript **[CrootJS](https://croot.js.org/)** (`map.js`, `geo.js`, `mapcontrol.js`).

Website ini dirancang secara statis (zero-build, zero-dependency) dan siap langsung dideploy ke **GitHub Pages**.

---

## ⚡ Maps Without a Map Library (CrootJS)

Aplikasi ini menggunakan modul `map.js` dari **CrootJS** (`https://croot.js.org/`):
- **Tanpa Leaflet, OpenLayers, ataupun Mapbox**.
- Peta *slippy map* ditulis dari nol (*from scratch*) dengan ukuran super ringan (~11 KB gzipped).
- *Tile basemap* OpenStreetMap.
- Data **GeoJSON** digambar langsung sebagai elemen **vektor SVG interaktif**.
- Mendukung fitur *pan*, *pinch-zoom*, kontrol skala (*scale bar*), pelacakan lokasi (*locate me*), *popup*, dan *click-to-pick coordinates*.
- Tidak memerlukan file CSS eksternal dari pihak ketiga.

---

## 📊 Ringkasan Data Geospasial (`714240013_mohammadisa_sig_mapulbi.geojson`)

Data GeoJSON diperkaya dan diramaikan di sekitar kawasan kampus ULBI Sarijadi dengan total **75 fitur spasial**:

| Tipe Geometri | Jumlah | Keterangan & Objek Utama |
| :--- | :---: | :--- |
| 🏛️ **Polygon** (Bangunan) | **25** | Gedung Rektorat, Gedung Vokasi, Gedung FLTB, Masjid Nurul Ilmi, Asrama Putra Raflesia, Asrama Putri Anggrek, Asrama Putri Gandaria, GOR STIMLOG & Poltekpos, Auditorium, Perpustakaan & Learning Center ULBI, Student Center, Lab Komputer, Klinik Pratama, Pos Satpam, Pujasera, Workshop Logistik, dll. |
| 🛣️ **LineString** (Jalan / Jalur) | **25** | Jalan Raya Sari Asih, Boulevard Utama Masuk Rektorat, Jalan Lingkar Barat/Utara/Timur Kampus, Jalur Pedestrian Plaza Tengah, Jalan Akses Asrama Raflesia/Anggrek/Gandaria, Jalur Khusus Truk Logistik Pos Indonesia, Jalur Evakuasi Darurat, Jalur Hijau Kampus, dll. |
| 📍 **Point** (Titik Lokasi / POI) | **25** | Titik Nol Kampus ULBI, Gerbang Utama, Halte Bus Trans Metro / Angkot Sari Asih, ATM Center Mandiri/BNI/BRI, Assembly Point Evakuasi Rektorat & Asrama, Parkiran Motor & Mobil, Lab Komputasi GIS, Spot Foto I Love ULBI, Kantin Mbak Tri, Charging Station Sepeda Listrik, dll. |
| **Total Fitur** | **75** | **Lengkap dengan atribut `name`, `category`, `tipe`, dan `keterangan`.** |

---

## 🌟 Fitur Utama Website

1. **Peta Interaktif Penuh (Slippy Map)**:
   - Geser (*pan*) dan perbesar (*zoom*) secara mulus.
   - Kontrol zoom `+` dan `-`.
   - Skala peta dinamis (*scale bar*) di sudut kiri bawah.
   - Tombol *Locate Me* di sudut kiri atas untuk melacak posisi pengguna saat ini.
2. **Styling Khusus Berbasis Kategori**:
   - Bangunan diwarnai dengan gradasi tematik (akademik, asrama, tempat ibadah, olahraga, dll.).
   - Jalur jalan diberi ketebalan dan warna kontras (jalan protokol warna merah/oranye, jalan kampus warna biru, pedestrian warna hijau).
   - Titik POI diberi penanda lingkaran beraneka warna dengan radius terkalibrasi.
3. **Popup Interaktif**:
   - Menampilkan label jenis geometri, nama objek, kategori, tipe spesifik, serta deskripsi lengkap saat diklik.
4. **Click-to-Pick Coordinates (Ambil Koordinat)**:
   - Klik di sembarang titik peta untuk melihat koordinat lintang & bujur (*latitude & longitude*).
   - Tersedia tombol **"Salin Koordinat"** untuk menyalin koordinat langsung ke clipboard.
5. **Filter Cepat Berdasarkan Geometri**:
   - Tombol tab filter instan: *Semua*, *🏛️ Bangunan*, *🛣️ Jalan*, dan *📍 Titik POI*.
6. **Pencarian Real-Time**:
   - Kotak pencarian langsung memfilter objek di tabel maupun pada peta.
7. **Tabel Data Spasial & Aksi "Lihat di Peta"**:
   - Setiap baris tabel dilengkapi tombol **"🔍 Lihat di Peta"** yang otomatis mengarahkan kamera peta (*zoom 18*), membuka popup informasi objek tersebut, dan menggulirkan tampilan ke peta.
8. **Pengelolaan Sumber Data GeoJSON**:
   - Muat data bawaan (`./714240013_mohammadisa_sig_mapulbi.geojson`).
   - Muat data dari URL/link GitHub (`/blob/`).
   - Unggah (*upload*) file GeoJSON lokal komputer tanpa perlu server backend.
   - Tombol **"💾 Unduh GeoJSON"** untuk mengekspor data saat ini.

---

## 🚀 Panduan Deploy ke GitHub Pages

Karena project ini murni menggunakan file statis (`HTML`, `CSS`, `JS`, dan `GeoJSON`), Anda dapat langsung mempublikasikannya ke **GitHub Pages** secara gratis dengan langkah mudah berikut:

### Langkah 1: Buat Repositori di GitHub
1. Buka [GitHub](https://github.com/) dan login ke akun Anda.
2. Buat repositori baru (misalnya dengan nama: `sig-map-ulbi` atau `geo`).
3. Pilih visibilitas **Public**.

### Langkah 2: Unggah / Push File ke GitHub
Buka terminal / PowerShell di direktori proyek ini, lalu jalankan perintah:

```bash
# 1. Inisialisasi git (jika belum)
git init

# 2. Tambahkan semua file
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi website peta kampus ULBI berbasis croot.js"

# 4. Ganti branch utama menjadi main
git branch -M main

# 5. Hubungkan dengan repositori GitHub Anda (ganti URL dengan repo Anda)
git remote add origin https://github.com/<USERNAME-ANDA>/<NAMA-REPO-ANDA>.git

# 6. Push ke GitHub
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages
1. Pada halaman repositori GitHub Anda, klik menu **Settings** (ikon gerigi).
2. Di bilah sisi kiri (*sidebar*), klik tab **Pages** (di bawah menu *Code and automation*).
3. Pada bagian **Build and deployment**:
   - **Source**: Pilih **Deploy from a branch**.
   - **Branch**: Pilih `main` dan biarkan foldernya `/ (root)`.
   - Klik tombol **Save**.
4. Tunggu sekitar 1–2 menit hingga proses build selesai.
5. Website peta Anda akan aktif dan dapat diakses di:
   ```
   https://<USERNAME-ANDA>.github.io/<NAMA-REPO-ANDA>/
   ```

---

## 💻 Menjalankan Secara Lokal (Local Development)

Jika ingin menguji website di komputer lokal:

Karena file JavaScript menggunakan ES Modules (`import ... from '...'`), jalankan menggunakan web server lokal (bukan sekadar double click file HTML):

### Cara 1: Menggunakan Node.js (`npx serve`)
```bash
npx serve .
```
Buka alamat yang muncul (biasanya `http://localhost:3000`).

### Cara 2: Menggunakan Python
```bash
python -m http.server 8000
```
Buka browser di `http://localhost:8000`.

### Cara 3: Menggunakan Ekstensi VS Code
- Pasang ekstensi **Live Server** di Visual Studio Code.
- Klik kanan file `index.html` lalu pilih **Open with Live Server**.

---

## 📁 Struktur Berkas

```
geo/
├── index.html                               # Halaman antarmuka utama website
├── style.css                                # Styling CSS modern & responsif
├── index.js                                 # Logika modul aplikasi berbasis CrootJS
├── 714240013_mohammadisa_sig_mapulbi.geojson # Data 75 objek geospasial kampus ULBI
└── README.md                                # Dokumentasi lengkap & panduan publikasi
```

---

## 📚 Referensi & Kredit
- **CrootJS Official**: [https://croot.js.org/](https://croot.js.org/)
- **CrootJS GitHub**: [https://github.com/crootjs/crootjs.github.io](https://github.com/crootjs/crootjs.github.io)
- **OpenStreetMap**: Kontributor OpenStreetMap untuk peta dasar dunia.
- **Universitas Logistik dan Bisnis Internasional (ULBI)**: [https://www.ulbi.ac.id/](https://www.ulbi.ac.id/)
