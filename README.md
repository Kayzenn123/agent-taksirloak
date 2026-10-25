# TAKSIRLOAK — Taksir Harga Barang Loak Sebelum Bayar

Hari 16 — 30 Days of Code. Satu karcis bus antarkota raksasa yang disobek jadi
kalkulator taksir: pilih barang di lapak, atur kondisi, sobek karcisnya, keluar
harga wajar + harga tawar awal + checklist cek barang. Suara "Bang Taksir",
tukang taksir lapak pasar loak — blak-blakan, bahasa pasar.

> **Semua harga berlabel CONTOH.** Harga listing/penawaran Oktober 2026, bukan
> harga transaksi. Harga jual riil biasanya 5–20% di bawah listing setelah nego.

## Fitur

- **18 barang bekas** (satu per kategori): HP Android, iPhone 11/13, ThinkPad
  T480, MacBook Air M1, sepeda Polygon, Sony A6000, jam Seiko/Casio, sneakers,
  tas branded, PS4 Slim, PS5 Disc, TV LED 32"/43", Honda Beat, buku/komik,
  furnitur jati, GoPro Hero 10, AirPods Pro Gen 2 — masing-masing dengan faktor
  utama harga + checklist cek 3 butir spesifik.
- **Kalkulator live**: kondisi (Mulus ×1,0 / Lecet ×0,8 / Rusak ringan ×0,55) +
  kelengkapan (Fullset ×1,0 / Batangan ×0,85) + tahun beli (faktor umur −2%
  per tahun, maks −30%) → kisaran wajar, harga tawar awal (batas bawah ×0,9),
  harga mentok (batas bawah ×0,97). Semua dibulatkan ke Rp10.000. TV punya
  pilihan ukuran 32"/43" dengan kisaran sendiri.
- **SOBEK KARCIS**: stempel SAH + nomor karcis `TL-2026-XXXX` + simpan ke
  riwayat.
- **Salin pesan tawar WA** (clipboard + fallback) dan **salin tautan** deep-link.
- **Ekspor JSON riwayat** + muat lagi taksiran lama ("Pakai lagi").
- **Deep-link** `?barang=<slug>&kondisi=&lengkap=&tahun=&varian=` — state
  terbaca saat load.
- **Riwayat** di `localStorage` key `taksirloak-v1` (berversi, validasi skema,
  try/catch).
- **Easter egg**: ketik `tawar` di mana saja → panel Mode Tawar-Menawar
  (3 jurus tawar Bang Taksir).
- **Empty state** ("Karcis masih kosong, Bang…") + **error state**
  ("Karcisnya kosong, Bang. Pilih barang dulu, baru taksir.").
- **Gerak (GSAP + ScrollTrigger, lokal)**: A zoom in karcis lalu pan kanan ke
  kalkulator (scrub) · B 3 band marquee beda kecepatan + tombol jeda · C judul
  melengkung (textPath) + scramble angka + denyut wght (font variable) · D
  tombol TAKSIR magnetic + cursor shape-shift + tilt 3D karcis hasil · E garis
  sobekan draw-on + clip-path lingkaran saat kartu barang dibuka.
- **Aksesibilitas**: skip link, `aria-live="polite"` untuk hasil taksir,
  keyboard penuh (Tab + Enter/Space), tap target ≥44px, `lang="id"`, 1 h1,
  toggle "Gerak: nyala/mati" + hormat `prefers-reduced-motion`.

## Tech

- Vanilla JS + GSAP 3.12.5 + ScrollTrigger (di-host lokal di `vendor/`,
  tanpa CDN lain). Tanpa gambar raster — semua grafis SVG inline dengan
  filter `feTurbulence` (hand-drawn goyang). 20+ ikon digambar sendiri
  (3 custom: karcis berlubang, timbangan, stempel SAH).
- Font self-host: Rum Raisin (display), Noto Kufi Arabic variable
  (body, wght 100–900), Akronim (aksen/nomor karcis).
- Hanya 3 ukuran font: 16px body / 28px sub / `clamp(48px, 12vw, 150px)`
  raksasa. (Catatan: brief menulis `clamp(64px, 18vw, 220px)`; diubah
  karena 220px membuat judul "TAKSIRLOAK" terpotong di 390px dan 1280px —
  terukur di screenshot verifikasi parent, lihat CRITIQUE.md.)
- Palet (oklch, analogous hue 7, dark): bg `oklch(0.15 0.058 7)`, surface
  `oklch(0.21 0.040 7)`, text `oklch(0.94 0.020 7)`, muted
  `oklch(0.65 0.030 7)`, accent `oklch(0.69 0.195 37)`, accent-2
  `oklch(0.66 0.208 337)`, pop `oklch(0.87 0.249 199)`.

## Cara jalanin

```bash
cd site
python3 -m http.server 8000
# buka http://localhost:8000
```

## Hasil QA

- `tools/qa.js` (chromium): **exit 0** — 360/390/768/1280 tanpa overflow,
  0 tap target kecil, 0 console error, 0 input tanpa label, h1 = 1,
  `fps4x = 60,4`, reduced-motion 0 animasi jalan.
- `tools/qa.js` (webkit): **exit 0** — semua viewport sama bersihnya.
  (Catatan: run pertama webkit gagal launch karena `libgstreamer-1.0.so.0`
  hilang di VM — bukan salah web; setelah `npx playwright install-deps
  webkit`, lolos.)
- Uji fungsional Playwright (chromium, 27 cek di `../test-fungsi.js`):
  **semua lulus** — hitung harga per pengali (termasuk pembulatan Rp10.000),
  varian TV, sobek + stempel + nomor, salin WA, localStorage + survive reload,
  deep-link, easter egg, ekspor JSON, mode ringan, jeda marquee.
- Uji keyboard: Tab pertama = skip link (Enter → scroll ke lapak), Enter di
  kartu memilih barang, Space di radio kondisi bekerja.
- **Lighthouse belum terukur di VM** (tidak ada Chrome/Lighthouse terpasang
  di environment ini) — skor tidak dikarang. Budget: JS ~147KB mentah
  (app 32KB + GSAP 72KB + ScrollTrigger 43KB), CSS 18KB, font ~99KB.

## Kredit aset

- Font: Rum Raisin, Noto Kufi Arabic, Akronim — via Fontsource, lisensi OFL.
- Ikon: digambar sendiri (SVG inline, gaya hand-drawn), inspirasi Streamline.
- GSAP 3.12.5 + ScrollTrigger — lisensi gratis standar GSAP.
- Data harga: riset `../RESEARCH.md` — listing Tokopedia/Shopee/JBA
  Oktober 2026 (detail sumber di footer situs).

## Catatan

- Nomor karcis berlaku untuk taksiran saat disobek; mengubah kondisi setelah
  sobek tidak mengganti nomor — sobek ulang untuk nomor baru.
- Harga motor Beat memakai harga lelang JBA = lantai; eceran showroom/OLX
  bisa di atas itu. Sneakers model hype bisa s.d. Rp2.500.000 (di luar
  kisaran umum Rp150 rb–1 jt).
