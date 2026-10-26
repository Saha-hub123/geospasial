/**
 * SIG Map ULBI Bandung - Vanilla ES6+ Web Map Application
 * Menggunakan library CrootJS (map.js, geo.js, mapcontrol.js)
 * Dokumentasi: https://croot.js.org/
 */

import {
  createMap,
  addGeoJSON,
  clearMap,
  fitMap,
  setMapView,
  onMapClick,
  showPopup,
  getGeoJSON,
  readGeoJSONFile,
  getCenter
} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.min.js";

import {
  addScaleBar,
  addLocateButton
} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/mapcontrol.min.js";

// State Aplikasi
let fullData = null;
let currentFilteredData = null;
let currentFilter = "all";
let searchQuery = "";
let lastClickedCoord = null;

const DEFAULT_GEOJSON_PATH = "./714240013_mohammadisa_sig_mapulbi.geojson";

// Inisialisasi Peta
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // 1. Buat peta dengan CrootJS
  createMap("map");

  // 2. Tambahkan kontrol skala peta (scale bar) di sudut kiri bawah
  try {
    addScaleBar("map", "bottom-left");
  } catch (err) {
    console.warn("Scalebar not initialized:", err);
  }

  // 3. Tambahkan tombol pencari lokasi saya (geolokasi) di sudut kiri atas
  try {
    addLocateButton("map", (result) => {
      if (result && result.position) {
        showToast(`📍 Lokasi terdeteksi: ${result.position[0].toFixed(5)}, ${result.position[1].toFixed(5)}`);
      } else {
        showToast("⚠️ Tidak dapat mendeteksi lokasi atau izin ditolak.");
      }
    }, "top-left");
  } catch (err) {
    console.warn("Locate button not initialized:", err);
  }

  // 4. Dengarkan klik pada peta
  onMapClick("map", handleMapClick);

  // 5. Muat data GeoJSON bawaan
  loadGeoJSONData(DEFAULT_GEOJSON_PATH);

  // 6. Pasang event listeners untuk kontrol UI
  setupEventListeners();
}

/**
 * Muat data GeoJSON via CrootJS getGeoJSON()
 */
function loadGeoJSONData(url) {
  showToast("Memuat data GeoJSON...");

  getGeoJSON(url, (response) => {
    if (response.status === 0) {
      showToast("❌ Gagal memuat data. Periksa koneksi atau CORS.");
      console.error("CrootJS getGeoJSON error response:", response);
      return;
    }
    if (response.status !== 200) {
      showToast(`❌ Gagal memuat data (HTTP ${response.status}).`);
      return;
    }
    if (!response.data || !response.data.features) {
      showToast("❌ Format file bukan GeoJSON yang valid.");
      return;
    }

    fullData = response.data;
    applyFilterAndSearch(true);
    updateStatistics(fullData);
    showToast(`✅ Berhasil memuat ${fullData.features.length} fitur spasial!`);
  });
}

/**
 * Event Listeners untuk toolbar, filter, pencarian, dan unduh
 */
function setupEventListeners() {
  // Filter tombol tipe geometri
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      applyFilterAndSearch(false);
    });
  });

  // Reset Tampilan / Fit Map
  const btnFitMap = document.getElementById("btn-fit-map");
  if (btnFitMap) {
    btnFitMap.addEventListener("click", () => {
      if (currentFilteredData && currentFilteredData.features.length > 0) {
        fitMap("map", currentFilteredData);
        showToast("🎯 Tampilan peta telah dipusatkan kembali.");
      }
    });
  }

  // Pencarian Realtime
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilterAndSearch(false);
    });
  }

  // Salin Koordinat
  const btnCopyCoord = document.getElementById("btn-copy-coord");
  if (btnCopyCoord) {
    btnCopyCoord.addEventListener("click", () => {
      if (lastClickedCoord) {
        const text = `${lastClickedCoord[0].toFixed(6)}, ${lastClickedCoord[1].toFixed(6)}`;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`📋 Koordinat disalin: ${text}`);
        }).catch(() => {
          showToast(`Koordinat: ${text}`);
        });
      }
    });
  }

  // Unduh GeoJSON
  const btnDownload = document.getElementById("btn-download");
  if (btnDownload) {
    btnDownload.addEventListener("click", downloadCurrentGeoJSON);
  }

  // Muat URL Eksternal
  const btnLoadUrl = document.getElementById("btn-load-url");
  const customUrlInput = document.getElementById("custom-url-input");
  if (btnLoadUrl && customUrlInput) {
    btnLoadUrl.addEventListener("click", () => {
      const url = customUrlInput.value.trim();
      if (url) {
        loadGeoJSONData(url);
      } else {
        showToast("⚠️ Masukkan URL GeoJSON terlebih dahulu.");
      }
    });
  }

  // Muat File Lokal Komputer
  const localFileInput = document.getElementById("local-file-input");
  if (localFileInput) {
    localFileInput.addEventListener("change", () => {
      readGeoJSONFile("local-file-input", (data) => {
        if (!data || !data.features) {
          showToast("❌ File yang dipilih bukan GeoJSON yang valid.");
          return;
        }
        fullData = data;
        applyFilterAndSearch(true);
        updateStatistics(fullData);
        showToast(`✅ Berhasil membuka file: ${data.features.length} fitur dimuat.`);
      });
    });
  }
}

/**
 * Filter data berdasarkan tipe geometri dan teks pencarian,
 * lalu render ulang SVG pada peta dan isi tabel data
 */
function applyFilterAndSearch(shouldFit = false) {
  if (!fullData || !fullData.features) return;

  const filteredFeatures = fullData.features.filter((f) => {
    // 1. Cek tipe geometri
    const typeMatch = (currentFilter === "all") || (f.geometry && f.geometry.type === currentFilter);
    if (!typeMatch) return false;

    // 2. Cek query pencarian
    if (!searchQuery) return true;

    const props = f.properties || {};
    const name = String(props.name || "").toLowerCase();
    const tipe = String(props.tipe || "").toLowerCase();
    const cat = String(props.category || "").toLowerCase();
    const desc = String(props.keterangan || "").toLowerCase();

    return name.includes(searchQuery) ||
           tipe.includes(searchQuery) ||
           cat.includes(searchQuery) ||
           desc.includes(searchQuery);
  });

  currentFilteredData = {
    type: "FeatureCollection",
    features: filteredFeatures
  };

  // Bersihkan SVG layer dan gambar ulang dengan CrootJS
  clearMap("map");

  if (filteredFeatures.length > 0) {
    addGeoJSON("map", currentFilteredData, {
      style: getFeatureStyle,
      popup: createCustomPopup
    });

    if (shouldFit) {
      fitMap("map", currentFilteredData);
    }
  }

  renderTable(filteredFeatures);
}

/**
 * Styling cerdas untuk tiap tipe objek spasial (Polygon, LineString, Point)
 */
function getFeatureStyle(feature) {
  const geomType = feature.geometry ? feature.geometry.type : "";
  const tipe = (feature.properties && feature.properties.tipe) || "";

  if (geomType === "Polygon") {
    if (tipe.includes("Asrama")) {
      return { fill: "#f59e0b", fillOpacity: 0.45, stroke: "#d97706", strokeWidth: 2 };
    } else if (tipe.includes("Ibadah")) {
      return { fill: "#06b6d4", fillOpacity: 0.45, stroke: "#0891b2", strokeWidth: 2 };
    } else if (tipe.includes("Olahraga")) {
      return { fill: "#8b5cf6", fillOpacity: 0.45, stroke: "#7c3aed", strokeWidth: 2 };
    } else if (tipe.includes("Parkir")) {
      return { fill: "#64748b", fillOpacity: 0.4, stroke: "#475569", strokeWidth: 2 };
    } else if (tipe.includes("Keamanan")) {
      return { fill: "#ef4444", fillOpacity: 0.5, stroke: "#dc2626", strokeWidth: 2 };
    } else {
      // Gedung umum, rektorat, vokasi, perpustakaan
      return { fill: "#10b981", fillOpacity: 0.45, stroke: "#047857", strokeWidth: 2 };
    }
  }

  if (geomType === "LineString") {
    if (tipe.includes("Protokol") || tipe.includes("Boulevard")) {
      return { stroke: "#dc2626", strokeWidth: 4, strokeOpacity: 0.9 };
    } else if (tipe.includes("Pejalan Kaki") || tipe.includes("Hijau")) {
      return { stroke: "#059669", strokeWidth: 3, strokeOpacity: 0.85 };
    } else if (tipe.includes("Evakuasi")) {
      return { stroke: "#d97706", strokeWidth: 3.5, strokeOpacity: 0.9 };
    } else {
      // Jalan kampus umum
      return { stroke: "#2563eb", strokeWidth: 3.5, strokeOpacity: 0.85 };
    }
  }

  if (geomType === "Point") {
    if (tipe.includes("Pusat")) {
      return { fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 3, radius: 9 };
    } else if (tipe.includes("Keamanan") || tipe.includes("Gerbang")) {
      return { fill: "#e11d48", stroke: "#ffffff", strokeWidth: 2, radius: 7.5 };
    } else if (tipe.includes("Finansial") || tipe.includes("Perbankan")) {
      return { fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2, radius: 7 };
    } else if (tipe.includes("Kuliner")) {
      return { fill: "#ea580c", stroke: "#ffffff", strokeWidth: 2, radius: 7 };
    } else {
      return { fill: "#ef4444", stroke: "#ffffff", strokeWidth: 2, radius: 6.5 };
    }
  }

  return {};
}

/**
 * Pembuat node HTML untuk popup CrootJS
 */
function createCustomPopup(feature) {
  const p = feature.properties || {};
  const geom = feature.geometry ? feature.geometry.type : "Fitur";

  const container = document.createElement("div");
  container.className = "custom-popup";

  const badge = document.createElement("span");
  badge.className = `popup-badge badge-${geom.toLowerCase()}`;
  badge.textContent = geom === "Polygon" ? "🏛️ Bangunan" :
                      geom === "LineString" ? "🛣️ Jalur Jalan" : "📍 Titik POI";

  const title = document.createElement("h4");
  title.className = "popup-title";
  title.textContent = p.name || "Objek ULBI";

  const typeDesc = document.createElement("div");
  typeDesc.className = "popup-type";
  typeDesc.innerHTML = `<strong>Tipe:</strong> ${p.tipe || p.category || '-'}`;

  const desc = document.createElement("p");
  desc.className = "popup-desc";
  desc.textContent = p.keterangan || "Fasilitas di sekitar area kampus ULBI Bandung.";

  container.append(badge, title, typeDesc, desc);
  return container;
}

/**
 * Handler klik peta menggunakan CrootJS onMapClick
 */
function handleMapClick(position, feature) {
  lastClickedCoord = position;
  const clickInfoEl = document.getElementById("click-info");
  const btnCopyCoord = document.getElementById("btn-copy-coord");

  if (!clickInfoEl) return;

  const coordStr = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;

  if (feature && feature.properties) {
    const name = feature.properties.name || "Fitur";
    const type = feature.geometry ? feature.geometry.type : "";
    clickInfoEl.textContent = `🎯 Mengenai: ${name} [${type}] di (${coordStr})`;
  } else {
    clickInfoEl.textContent = `📍 Titik Koordinat: Longitude: ${position[0].toFixed(6)} | Latitude: ${position[1].toFixed(6)}`;
  }

  if (btnCopyCoord) {
    btnCopyCoord.style.display = "inline-flex";
  }
}

/**
 * Perbarui statistik jumlah fitur
 */
function updateStatistics(data) {
  if (!data || !data.features) return;

  let total = data.features.length;
  let polygons = 0;
  let lines = 0;
  let points = 0;

  data.features.forEach((f) => {
    if (!f.geometry) return;
    if (f.geometry.type === "Polygon") polygons++;
    else if (f.geometry.type === "LineString") lines++;
    else if (f.geometry.type === "Point") points++;
  });

  const elTotal = document.getElementById("stat-total");
  const elPolygons = document.getElementById("stat-polygons");
  const elLines = document.getElementById("stat-lines");
  const elPoints = document.getElementById("stat-points");

  if (elTotal) elTotal.textContent = total;
  if (elPolygons) elPolygons.textContent = polygons;
  if (elLines) elLines.textContent = lines;
  if (elPoints) elPoints.textContent = points;

  // Update badge count di filter buttons
  const cAll = document.getElementById("count-all");
  const cPoly = document.getElementById("count-polygon");
  const cLine = document.getElementById("count-line");
  const cPoint = document.getElementById("count-point");

  if (cAll) cAll.textContent = total;
  if (cPoly) cPoly.textContent = polygons;
  if (cLine) cLine.textContent = lines;
  if (cPoint) cPoint.textContent = points;
}

/**
 * Render daftar fitur ke tabel interaktif
 */
function renderTable(features) {
  const tbody = document.getElementById("table-body");
  if (!tbody) return;

  tbody.replaceChildren();

  if (features.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 6;
    emptyCell.style.textAlign = "center";
    emptyCell.style.padding = "2rem";
    emptyCell.textContent = "Tidak ada objek geospasial yang cocok dengan kriteria filter.";
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    return;
  }

  features.forEach((feature, index) => {
    const props = feature.properties || {};
    const geom = feature.geometry ? feature.geometry.type : "Unknown";

    const tr = document.createElement("tr");

    // # index
    const tdIndex = document.createElement("td");
    tdIndex.textContent = String(index + 1);

    // Nama
    const tdName = document.createElement("td");
    tdName.className = "feature-name-cell";
    tdName.textContent = props.name || "Tanpa Nama";

    // Geometri badge
    const tdGeom = document.createElement("td");
    const geomBadge = document.createElement("span");
    geomBadge.className = `badge-cell badge-${geom.toLowerCase()}`;
    geomBadge.textContent = geom;
    tdGeom.appendChild(geomBadge);

    // Kategori & Tipe
    const tdType = document.createElement("td");
    tdType.innerHTML = `<div><strong>${props.tipe || "-"}</strong></div><small style="color:#64748b;">${props.category || ""}</small>`;

    // Keterangan
    const tdDesc = document.createElement("td");
    tdDesc.textContent = props.keterangan || "-";

    // Aksi (Lihat di Peta)
    const tdAction = document.createElement("td");
    tdAction.style.textAlign = "center";

    const btnLocate = document.createElement("button");
    btnLocate.type = "button";
    btnLocate.className = "btn-locate-row";
    btnLocate.innerHTML = "🔍 Lihat di Peta";
    btnLocate.addEventListener("click", () => {
      focusFeatureOnMap(feature);
    });

    tdAction.appendChild(btnLocate);

    tr.append(tdIndex, tdName, tdGeom, tdType, tdDesc, tdAction);
    tbody.appendChild(tr);
  });
}

/**
 * Pusatkan peta ke objek tertentu saat tombol tabel diklik
 */
function focusFeatureOnMap(feature) {
  if (!feature || !feature.geometry) return;

  const center = getCenter(feature);
  if (!center) return;

  // Pusatkan peta dengan zoom 18
  setMapView("map", center, 18);

  // Tampilkan popup di atas fitur
  const popupNode = createCustomPopup(feature);
  showPopup("map", center, popupNode);

  // Gulir halus halaman ke container peta
  const mapElement = document.getElementById("map");
  if (mapElement) {
    mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  showToast(`🎯 Menyorot: ${feature.properties.name || "Objek"}`);
}

/**
 * Unduh GeoJSON saat ini
 */
function downloadCurrentGeoJSON() {
  if (!fullData) {
    showToast("⚠️ Tidak ada data untuk diunduh.");
    return;
  }

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "714240013_mohammadisa_sig_mapulbi.geojson");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast("💾 File GeoJSON berhasil diunduh.");
}

/**
 * Tampilkan notifikasi toast kecil
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
