# PALMSTAKE RTK ENTERPRISE — PWA (GitHub Pages)

Aplikasi web progresif untuk pekerjaan **pancang tanam kelapa sawit berbasis GNSS RTK**: desain grid segitiga, stake-out lapangan offline, impor data controller (CSV/NMEA/GeoJSON), QC bertingkat, peta GIS, RAB, jadwal, dan laporan akhir.

Frontend ini terhubung ke backend **Google Apps Script + Google Sheets** milik organisasi Anda. Data tidak disimpan di GitHub.

## Isi repositori (5 berkas)

| Berkas | Fungsi |
| --- | --- |
| `index.html` | Seluruh aplikasi (HTML + CSS + JS, satu berkas) |
| `sw.js` | Service worker: cache aplikasi, pustaka, dan ubin peta untuk mode offline |
| `manifest.json` | Manifest PWA (nama, ikon, warna, pintasan) |
| `icon.svg` | Ikon aplikasi |
| `README.md` | Dokumen ini |

## Cara pasang

1. **Backend dulu.** Ikuti panduan PDF bagian "Instalasi Apps Script": buat Google Spreadsheet, tempel semua berkas `.gs` dan `.html`, lalu **Deploy › New deployment › Web app** (Execute as: *Me*, Who has access: *Anyone*). Salin URL yang berakhiran `/exec`.
2. **Hubungkan URL.** Pilih salah satu:
   - Edit `index.html`, cari `window.PS_GAS_URL = '';` lalu isi URL `/exec` Anda; atau
   - Biarkan kosong — layar login akan meminta URL Web App dan menyimpannya di perangkat.
3. **Unggah ke GitHub.** Buat repositori baru, unggah 5 berkas ini ke cabang `main`.
4. **Aktifkan Pages.** *Settings › Pages › Build and deployment › Deploy from a branch › main / root*. Tunggu 1–2 menit; aplikasi tersedia di `https://<akun>.github.io/<repo>/`.
5. **Pasang di ponsel.** Buka alamat tersebut di Chrome Android → menu ⋮ → *Install app / Tambahkan ke layar utama*.

## Mode offline

- Saat online, buka menu **Stake-out Lapangan › Siapkan offline** untuk setiap blok: titik desain, observasi, dan ubin peta (zoom 14–19) disimpan di perangkat.
- Pencatatan pancang, laporan harian, cek titik kontrol, transaksi material, dan foto tersimpan di **antrean IndexedDB** dan dikirim otomatis saat sinyal kembali.
- Setiap item memiliki `syncId` unik sehingga pengiriman ulang **tidak menggandakan data** (idempoten).
- Logout tidak menghapus antrean yang belum terkirim.

## Pembaruan versi

Ganti `index.html`, lalu naikkan nilai `VERSION` di `sw.js` (mis. `psrtk-1.0.1`). Pengguna akan mendapat notifikasi "Versi baru tersedia".

## Keamanan

- Autentikasi, RBAC, dan audit trail berjalan di server Apps Script; GitHub Pages hanya menyajikan berkas statis.
- Token sesi berlaku 6 jam (diperpanjang otomatis saat aktif). Password disimpan sebagai hash bersalt.
- Gunakan HTTPS (bawaan GitHub Pages). Jangan menaruh kunci lisensi atau data proyek di repositori.

## Lisensi

Perangkat lunak komersial — penggunaan tunduk pada EULA dan kunci lisensi dari penyedia. Komponen pihak ketiga: Leaflet (BSD-2-Clause), TweetNaCl.js (public domain), SheetJS CE (Apache-2.0, dimuat saat ekspor Excel). Peta dasar © kontributor OpenStreetMap, Esri, OpenTopoMap sesuai ketentuan masing-masing.
