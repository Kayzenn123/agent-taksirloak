/* TAKSIRLOAK — Hari 16 · 30 Days of Code
   Vanilla JS + GSAP lokal. Satu file, dipisah per lapisan:
   DATA → STATE → RENDER → HITUNG → RIWAYAT → DEEP-LINK →
   EASTER EGG → GERAK A (kamera) / B (marquee) / C (teks) /
   D (input) / E (reveal). */
"use strict";

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ---------- DATA: 18 barang, kisaran dari RESEARCH.md ----------
   Semua harga = CONTOH, harga listing Okt 2026, bukan harga transaksi. */
const ITEMS = [
  { slug: "a54", nama: "Samsung Galaxy A54 5G", kat: "HP Android", low: 3400000, high: 4300000,
    faktor: "Varian RAM/storage + garansi resmi SEIN masih jalan.",
    cek: ["Battery health di atas 85%", "Layar mulus, tanpa burn-in/shadow", "IMEI terdaftar Kemenperin"],
    icon: "hp", span: 4 },
  { slug: "iphone-11", nama: "iPhone 11 64/128GB", kat: "iPhone", low: 3500000, high: 5500000,
    faktor: "Battery Health + iBox/resmi vs ex-inter (status IMEI).",
    cek: ["Battery Health 85% ke atas", "Face ID + True Tone jalan", "IMEI terdaftar, bukan bypass"],
    icon: "iphone", span: 2 },
  { slug: "iphone-13", nama: "iPhone 13 128GB", kat: "iPhone", low: 5300000, high: 7800000,
    faktor: "Battery Health + iBox vs inter + fullset.",
    cek: ["Battery Health 87% ke atas", "Kamera + Face ID normal", "iBox lebih mahal dari inter"],
    icon: "iphone", span: 2 },
  { slug: "thinkpad-t480", nama: "ThinkPad T480 i5 Gen 8", kat: "Laptop", low: 3000000, high: 4700000,
    faktor: "Generasi CPU + RAM/SSD + kesehatan baterai.",
    cek: ["Baterai tahan 3 jam ke atas", "Keyboard + trackpoint normal", "SSD sehat, tanpa bad sector"],
    icon: "laptop", span: 2 },
  { slug: "macbook-air-m1", nama: "MacBook Air M1", kat: "Laptop", low: 6500000, high: 10000000,
    faktor: "Cycle count baterai + iBox vs inter + kelengkapan.",
    cek: ["Cycle count di bawah 300", "Layar tanpa garis/retak", "Charger ori + box ada"],
    icon: "macbook", span: 2 },
  { slug: "polygon-xtrada", nama: "Sepeda Polygon (Xtrada 5)", kat: "Sepeda", low: 1500000, high: 5500000,
    faktor: "Seri & tahun rilis + kondisi frame/komponen (groupset).",
    cek: ["Frame tanpa retak/penyok", "Rem + shifting responsif", "Ban + rantai masih layak"],
    icon: "sepeda", span: 3 },
  { slug: "sony-a6000", nama: "Sony A6000 kit", kat: "Kamera", low: 5500000, high: 6500000,
    faktor: "Shutter count + kit lensa vs body only.",
    cek: ["Shutter count rendah", "Sensor bersih, tanpa jamur", "Kit 16-50mm fokus normal"],
    icon: "kamera", span: 3 },
  { slug: "seiko-5", nama: "Jam Seiko 5 / Casio", kat: "Jam tangan", low: 350000, high: 3750000,
    faktor: "Merek/model & keaslian (ori vs KW), kelengkapan box.",
    cek: ["Mesin jalan akurat", "Kaca tanpa gores dalam", "Ori, bukan KW — cek nomor seri"],
    icon: "jam", span: 2 },
  { slug: "sneakers", nama: "Sneakers Nike/Adidas", kat: "Sepatu", low: 150000, high: 1000000,
    faktor: "Model/hype + kondisi sol & keaslian.",
    cek: ["Sol belum aus parah", "Jahitan rapi, bukan KW", "Insole + box ada"],
    icon: "sepatu", span: 2, note: "Model hype bisa tembus s.d. Rp2.500.000." },
  { slug: "tas-coach", nama: "Tas Coach / Kate Spade", kat: "Tas branded", low: 400000, high: 2000000,
    faktor: "Keaslian + kondisi kulit & kelengkapan (dust bag, kartu).",
    cek: ["Kulit tanpa kikis parah", "Resleting + hardware mulus", "Dust bag + kartu autentik ada"],
    icon: "tas", span: 2 },
  { slug: "ps4-slim", nama: "PS4 Slim", kat: "Konsol game", low: 2200000, high: 4000000,
    faktor: "OFW vs HEN + jumlah stick + bundel game.",
    cek: ["Baca disc normal", "Stick tidak drifting", "Kipas tidak berisik/overheat"],
    icon: "konsol", span: 4 },
  { slug: "ps5-disc", nama: "PS5 Disc", kat: "Konsol game", low: 7300000, high: 10500000,
    faktor: "Disc vs Digital + garansi toko + bundel stick/game.",
    cek: ["Disc drive baca normal", "Port HDMI + USB jalan", "Garansi toko masih ada"],
    icon: "konsol2", span: 2 },
  { slug: "tv-led", nama: "TV LED 32\" / 43\"", kat: "TV", low: 1500000, high: 3000000,
    faktor: "Ukuran + Smart TV vs TV biasa + kondisi panel/backlight.",
    cek: ["Panel tanpa garis/bintik", "Backlight rata, tidak belang", "Remote + kaki/braket ada"],
    icon: "tv", span: 2,
    variants: [
      { v: "32", label: "32 inci — Rp1,5–2,5 jt", low: 1500000, high: 2500000 },
      { v: "43", label: "43 inci — Rp2,25–3 jt", low: 2250000, high: 3000000 }
    ] },
  { slug: "honda-beat", nama: "Honda Beat 2019–2022", kat: "Motor", low: 8500000, high: 9600000,
    faktor: "Tahun + kondisi mesin/km + kelengkapan surat (STNK/BPKB, pajak hidup).",
    cek: ["STNK + BPKB cocok nomor rangka", "Pajak hidup, mesin halus", "KM wajar untuk tahunnya"],
    icon: "motor", span: 2, note: "Harga lelang JBA = lantai — eceran showroom/OLX bisa di atas ini." },
  { slug: "buku-komik", nama: "Buku/komik bekas per pcs", kat: "Buku", low: 10000, high: 50000,
    faktor: "Judul/kelangkaan + kondisi fisik (menguning, sobek, lengkap).",
    cek: ["Halaman lengkap, tidak sobek", "Tidak berjamur/berbau", "Edisi langka = lebih mahal"],
    icon: "buku", span: 2 },
  { slug: "furnitur-jati", nama: "Furnitur kayu jati", kat: "Furnitur", low: 200000, high: 2000000,
    faktor: "Jenis kayu (jati asli vs campuran) + ukuran/kondisi & ukiran.",
    cek: ["Kayu jati asli, bukan lapis", "Sambungan kokoh, tidak goyang", "Tanpa rayap/bekas air"],
    icon: "furnitur", span: 3 },
  { slug: "gopro-hero10", nama: "GoPro Hero 10", kat: "Action cam", low: 2750000, high: 4000000,
    faktor: "Jumlah baterai + aksesoris/fullset + kondisi lensa.",
    cek: ["Lensa tanpa gores", "Baterai masih awet", "Rekam 4K tanpa mati mendadak"],
    icon: "gopro", span: 3 },
  { slug: "airpods-pro2", nama: "AirPods Pro Gen 2 ori", kat: "TWS", low: 2000000, high: 3100000,
    faktor: "Keaslian (banyak KW/clone) + kesehatan baterai.",
    cek: ["Nomor seri cocok di situs Apple", "ANC + Transparency jalan", "Case ngecas normal"],
    icon: "tws", span: 2 }
];
const bySlug = Object.fromEntries(ITEMS.map((it) => [it.slug, it]));

/* ---------- IKON: hand-drawn goyang, feTurbulence, digambar sendiri ---------- */
const ICON_PATHS = {
  hp: '<rect x="20" y="8" width="24" height="48" rx="4"/><path d="M28 14h8"/><circle cx="32" cy="48" r="2"/>',
  iphone: '<rect x="19" y="8" width="26" height="48" rx="6"/><path d="M26 14h12"/><path d="M32 46h.01"/>',
  laptop: '<rect x="12" y="14" width="40" height="26" rx="2"/><path d="M6 46h52"/><path d="M24 40h16"/>',
  macbook: '<rect x="10" y="16" width="44" height="26" rx="3"/><path d="M4 46h56"/><circle cx="32" cy="29" r="2"/>',
  sepeda: '<circle cx="16" cy="44" r="10"/><circle cx="48" cy="44" r="10"/><path d="M16 44l12-18h12l8 18M28 26l-6 10M40 26l-12 18"/>',
  kamera: '<rect x="8" y="20" width="48" height="28" rx="4"/><path d="M22 20l4-6h12l4 6"/><circle cx="32" cy="34" r="9"/><circle cx="32" cy="34" r="3"/><path d="M50 26h.01"/>',
  jam: '<circle cx="32" cy="32" r="14"/><path d="M32 22v10l7 4"/><path d="M26 18l-3-8M38 18l3-8M26 46l-3 8M38 46l3 8"/>',
  sepatu: '<path d="M10 42V28l8-2 6 8 12 4c8 2 14 4 18 8v4H10z"/><path d="M22 34l6 6M30 36l6 5"/>',
  tas: '<rect x="14" y="24" width="36" height="28" rx="4"/><path d="M22 24v-6a10 10 0 0 1 20 0v6"/><path d="M28 34h8"/><path d="M14 34h36"/>',
  konsol: '<path d="M14 22h36c4 0 6 3 6 8v6c0 5-3 8-8 8l-6-3H22l-6 3c-5 0-8-3-8-8v-6c0-5 2-8 6-8z"/><path d="M20 28v8M16 32h8"/><circle cx="44" cy="29" r="1.6"/><circle cx="48" cy="34" r="1.6"/>',
  konsol2: '<rect x="24" y="8" width="16" height="48" rx="6"/><path d="M24 20h16"/><path d="M32 44h.01"/><path d="M18 52h28"/>',
  tv: '<rect x="8" y="14" width="48" height="30" rx="3"/><path d="M24 52h16M32 44v8"/><path d="M20 14L14 6M44 14l6-8"/>',
  motor: '<circle cx="14" cy="46" r="9"/><circle cx="50" cy="46" r="9"/><path d="M14 46l10-16h12l6 8 8 8M26 30l-4 10M42 38h-8"/>',
  buku: '<path d="M32 16c-4-4-10-5-16-4v36c6-1 12 0 16 4 4-4 10-5 16-4V12c-6-1-12 0-16 4z"/><path d="M32 16v36"/>',
  furnitur: '<path d="M20 10v26"/><path d="M20 36h26"/><path d="M46 36v-8"/><path d="M22 36v14M44 36v14"/>',
  gopro: '<rect x="14" y="18" width="36" height="30" rx="5"/><circle cx="32" cy="33" r="9"/><circle cx="32" cy="33" r="3"/><path d="M22 18v-4h20v4"/><path d="M46 24h.01"/>',
  tws: '<rect x="18" y="30" width="28" height="20" rx="7"/><circle cx="26" cy="22" r="5"/><circle cx="38" cy="22" r="5"/><path d="M26 27v3M38 27v3"/>',
  timbangan: '<path d="M32 8v8M20 16h24"/><path d="M32 16L18 40M32 16l14 24"/><path d="M12 40h12M40 40h12"/><path d="M10 44a8 4 0 0 0 16 0M38 44a8 4 0 0 0 16 0"/><path d="M24 56h16"/>',
  stempel: '<path d="M24 8h16v10H24z"/><path d="M32 18v10"/><rect x="14" y="28" width="36" height="14" rx="2"/><path d="M14 42v6h36v-6"/><path d="M20 35h4M28 35h4M36 35h4"/>',
  karcis: '<path d="M8 20h48v10a6 6 0 0 0 0 12v10H8v-10a6 6 0 0 0 0-12z"/><path d="M40 20v32" stroke-dasharray="3 4"/><circle cx="16" cy="28" r="2"/><circle cx="16" cy="44" r="2"/><path d="M46 28h6M46 36h6M46 44h6"/>',
  cari: '<circle cx="28" cy="28" r="16"/><path d="M40 40L54 54"/><path d="M20 28h16M28 20v16"/>'
};
function icon(name) {
  return '<svg viewBox="0 0 64 64" class="ic" aria-hidden="true" focusable="false">' +
    '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#wobble)">' +
    (ICON_PATHS[name] || ICON_PATHS.karcis) + "</g></svg>";
}

/* ---------- STATE ---------- */
const LS_KEY = "taksirloak-v1";
const state = { slug: null, kondisi: "mulus", lengkap: "fullset", tahun: 2024, varian: null, nomor: null };
let motionOn = true;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- FORMAT / HITUNG ---------- */
const rp = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
const round10k = (n) => Math.round(n / 10000) * 10000;
function shortRp(n) {
  if (n >= 1000000) return "Rp" + (n / 1000000).toFixed(1).replace(".", ",").replace(",0", "") + " jt";
  if (n >= 1000) return "Rp" + Math.round(n / 1000) + " rb";
  return rp(n);
}
function hitung(item, st) {
  const v = item.variants
    ? (item.variants.find((x) => x.v === st.varian) || item.variants[0])
    : { low: item.low, high: item.high };
  const kf = { mulus: 1, lecet: 0.8, rusak: 0.55 }[st.kondisi];
  const lf = st.lengkap === "fullset" ? 1 : 0.85;
  const umur = 2026 - st.tahun;
  const yf = Math.max(0.7, 1 - 0.02 * umur);
  const low = round10k(v.low * kf * lf * yf);
  const high = round10k(v.high * kf * lf * yf);
  return { low, high, tawar: round10k(low * 0.9), mentok: round10k(low * 0.97) };
}
const KONDISI_LABEL = { mulus: "Mulus", lecet: "Lecet", rusak: "Rusak ringan" };
const LENGKAP_LABEL = { fullset: "Fullset", batangan: "Batangan" };

/* ---------- RENDER: grid lapak ---------- */
function renderGrid() {
  const grid = $("#lapakGrid");
  grid.innerHTML = "";
  for (const it of ITEMS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card span-" + it.span;
    b.dataset.slug = it.slug;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML =
      '<span class="card-icon">' + icon(it.icon) + "</span>" +
      '<span class="card-nama"></span>' +
      '<span class="card-kat"></span>' +
      '<span class="card-harga">' + shortRp(it.low) + "–" + shortRp(it.high) + ' <span class="tag-contoh">CONTOH</span></span>';
    b.querySelector(".card-nama").textContent = it.nama;
    b.querySelector(".card-kat").textContent = it.kat;
    b.addEventListener("click", () => selectItem(it.slug, true));
    grid.appendChild(b);
  }
  const info = document.createElement("article");
  info.className = "card card-info span-4";
  info.innerHTML =
    '<span class="card-icon">' + icon("timbangan") + "</span>" +
    '<span class="card-nama">Cara taksir</span>' +
    "<ol><li>Pilih barang di lapak ini.</li><li>Atur kondisi, kelengkapan, tahun beli.</li><li>Sobek karcis — keluar harga wajar + tawar awal + mentok.</li></ol>" +
    '<span class="card-kat">Semua harga CONTOH — harga listing Okt 2026, bukan harga transaksi.</span>';
  grid.appendChild(info);
}

/* ---------- RENDER: marquee ---------- */
function renderMarquee() {
  const band = (id, text, times) => {
    const el = $(id);
    const half = document.createElement("span");
    half.textContent = text.repeat(times);
    const half2 = half.cloneNode(true);
    half2.setAttribute("aria-hidden", "true");
    el.append(half, half2);
  };
  band("#mqBand1", ITEMS.map((i) => i.nama).join(" • ") + " • ", 1);
  band("#mqBand2", "TAKSIR DULU • JANGAN KETIPU • BAYAR KEMUDIAN • ", 4);
  band("#mqBand3", ITEMS.map((i) => i.nama.split(" ")[0] + " " + shortRp(i.low) + "–" + shortRp(i.high)).join(" • ") + " • ", 1);
}

/* ---------- RENDER: kalkulator ---------- */
function setText(el, text, animate) {
  if (!animate || !motionOn) { el.textContent = text; return; }
  scramble(el, text);
}
function scramble(el, finalText) {
  const live = $("#hasilLive");
  live.setAttribute("aria-live", "off");
  const chars = "0123456789.,";
  const target = finalText;
  const start = performance.now();
  const dur = 320;
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const cut = Math.floor(p * target.length);
    let out = target.slice(0, cut);
    for (let i = cut; i < target.length; i++) {
      out += /[0-9]/.test(target[i]) ? chars[Math.floor(Math.random() * chars.length)] : target[i];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
    else { el.textContent = target; live.setAttribute("aria-live", "polite"); pulseWght(el); }
  }
  requestAnimationFrame(frame);
}
function pulseWght(el) {
  if (!window.gsap || !motionOn) return;
  gsap.fromTo(el, { "--wght": 400 }, { "--wght": 800, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut", overwrite: true });
}
function renderCalc(animate) {
  const item = state.slug ? bySlug[state.slug] : null;
  const empty = $("#emptyHasil");
  const angka = $("#angkaHasil");
  if (!item) {
    empty.hidden = false;
    angka.hidden = true;
    $("#selNama").textContent = "Belum pilih barang";
    $("#selKat").textContent = "Pilih dulu di lapak atas, Bang.";
    $("#sumNama").textContent = "Belum ada barang dipilih";
    $("#sumRange").textContent = "—";
    $("#sumTawar").textContent = "—";
    $("#tawarMentok").textContent = "—";
    return;
  }
  const h = hitung(item, state);
  empty.hidden = true;
  angka.hidden = false;
  $("#selNama").textContent = item.nama;
  $("#selKat").textContent = item.kat + " • " + KONDISI_LABEL[state.kondisi] + " • " + LENGKAP_LABEL[state.lengkap] + " • Tahun " + state.tahun;
  setText($("#hargaLow"), rp(h.low), animate);
  setText($("#hargaHigh"), rp(h.high), animate);
  setText($("#hargaTawar"), rp(h.tawar), animate);
  setText($("#hargaMentok"), rp(h.mentok), animate);
  $("#faktorText").textContent = item.faktor;
  const cek = $("#cekList");
  cek.innerHTML = "";
  for (const c of item.cek) {
    const li = document.createElement("li");
    li.textContent = c;
    cek.appendChild(li);
  }
  const nk = $("#noteKhusus");
  if (item.note) { nk.hidden = false; nk.textContent = item.note; } else { nk.hidden = true; }
  $("#sumNama").textContent = item.nama;
  $("#sumRange").textContent = rp(h.low) + " – " + rp(h.high);
  $("#sumTawar").textContent = rp(h.tawar) + " / " + rp(h.mentok);
  $("#tawarMentok").textContent = rp(h.mentok);
}
function selectItem(slug, animate) {
  const item = bySlug[slug];
  if (!item) return;
  state.slug = slug;
  state.nomor = null;
  $("#nomorKarcis").textContent = "TL-2026-····";
  $("#stempel").classList.remove("on");
  $("#stempel").setAttribute("aria-hidden", "true");
  $$("#lapakGrid .card[data-slug]").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.slug === slug)));
  const vw = $("#varianWrap");
  if (item.variants) {
    vw.hidden = false;
    const sel = $("#varian");
    sel.innerHTML = "";
    for (const v of item.variants) {
      const o = document.createElement("option");
      o.value = v.v;
      o.textContent = v.label;
      sel.appendChild(o);
    }
    state.varian = item.variants.some((v) => v.v === state.varian) ? state.varian : item.variants[0].v;
    sel.value = state.varian;
  } else {
    vw.hidden = true;
    state.varian = null;
  }
  renderCalc(animate);
  writeParams();
  if (animate && window.gsap && motionOn) {
    gsap.fromTo("#ticketHasil",
      { clipPath: "circle(0% at 50% 0%)" },
      { clipPath: "circle(150% at 50% 50%)", duration: 0.6, ease: "power2.out", clearProps: "clipPath" });
  }
}

/* ---------- DEEP-LINK ---------- */
function readParams() {
  try {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get("barang");
    if (slug && bySlug[slug]) state.slug = slug;
    const k = p.get("kondisi");
    if (k && KONDISI_LABEL[k]) state.kondisi = k;
    const l = p.get("lengkap");
    if (l && LENGKAP_LABEL[l]) state.lengkap = l;
    const t = parseInt(p.get("tahun"), 10);
    if (t >= 2015 && t <= 2026) state.tahun = t;
    const v = p.get("varian");
    if (v) state.varian = v;
  } catch (e) { /* param rusak → pakai default */ }
}
function writeParams() {
  try {
    const p = new URLSearchParams();
    if (state.slug) p.set("barang", state.slug);
    p.set("kondisi", state.kondisi);
    p.set("lengkap", state.lengkap);
    p.set("tahun", String(state.tahun));
    if (state.varian) p.set("varian", state.varian);
    const url = window.location.pathname + "?" + p.toString();
    window.history.replaceState(null, "", url);
  } catch (e) { /* abaikan */ }
}
function buildLink() {
  const p = new URLSearchParams();
  if (state.slug) p.set("barang", state.slug);
  p.set("kondisi", state.kondisi);
  p.set("lengkap", state.lengkap);
  p.set("tahun", String(state.tahun));
  if (state.varian) p.set("varian", state.varian);
  return window.location.origin + window.location.pathname + "?" + p.toString();
}

/* ---------- RIWAYAT (localStorage berversi + validasi skema) ---------- */
function loadHistory() {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((e) =>
      e && e.v === 1 && typeof e.slug === "string" && bySlug[e.slug] &&
      typeof e.low === "number" && typeof e.high === "number" &&
      typeof e.tawar === "number" && typeof e.mentok === "number" &&
      typeof e.ts === "number" && typeof e.nomor === "string");
  } catch (e) { return []; }
}
function saveHistory(list) {
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { /* penyimpanan penuh/diblokir */ }
}
function renderHistory() {
  const list = loadHistory();
  const ul = $("#riwayatList");
  ul.innerHTML = "";
  $("#riwayatEmpty").hidden = list.length > 0;
  for (const e of list.slice().reverse()) {
    const item = bySlug[e.slug];
    const li = document.createElement("li");
    li.className = "riwayat-item";
    const tgl = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e.ts));
    li.innerHTML =
      '<div class="riwayat-teks"><span class="riwayat-nama"></span>' +
      '<span class="riwayat-meta"></span></div>' +
      '<button type="button" class="btn btn-kecil">Pakai lagi</button>';
    li.querySelector(".riwayat-nama").textContent = item.nama + " • " + e.nomor;
    li.querySelector(".riwayat-meta").textContent =
      rp(e.low) + "–" + rp(e.high) + " • Tawar " + rp(e.tawar) + " • Mentok " + rp(e.mentok) + " • " + tgl;
    li.querySelector("button").addEventListener("click", () => {
      state.kondisi = KONDISI_LABEL[e.kondisi] ? e.kondisi : "mulus";
      state.lengkap = LENGKAP_LABEL[e.lengkap] ? e.lengkap : "fullset";
      state.tahun = (e.tahun >= 2015 && e.tahun <= 2026) ? e.tahun : 2024;
      syncControls();
      selectItem(e.slug, true);
      if (e.varian && bySlug[e.slug].variants) { state.varian = e.varian; $("#varian").value = e.varian; renderCalc(true); writeParams(); }
      $("#kalkulator").scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
    });
    ul.appendChild(li);
  }
}
function syncControls() {
  $$('input[name="kondisi"]').forEach((r) => { r.checked = r.value === state.kondisi; });
  $$('input[name="lengkap"]').forEach((r) => { r.checked = r.value === state.lengkap; });
  $("#tahun").value = String(state.tahun);
}

/* ---------- AKSI: sobek / salin / ekspor ---------- */
function sobek() {
  const err = $("#kalkError");
  const status = $("#waStatus");
  err.textContent = "";
  if (!state.slug) {
    err.textContent = "Karcisnya kosong, Bang. Pilih barang dulu, baru taksir.";
    $("#lapak").scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
    return;
  }
  const item = bySlug[state.slug];
  const h = hitung(item, state);
  state.nomor = "TL-2026-" + String(Math.floor(1000 + Math.random() * 9000));
  $("#nomorKarcis").textContent = state.nomor;
  const st = $("#stempel");
  st.classList.add("on");
  st.setAttribute("aria-hidden", "false");
  if (window.gsap && motionOn) {
    gsap.fromTo(st, { scale: 2.4, rotate: -30, opacity: 0 }, { scale: 1, rotate: -12, opacity: 1, duration: 0.4, ease: "back.out(2)" });
  }
  const list = loadHistory();
  list.push({ v: 1, slug: state.slug, kondisi: state.kondisi, lengkap: state.lengkap, tahun: state.tahun, varian: state.varian, low: h.low, high: h.high, tawar: h.tawar, mentok: h.mentok, nomor: state.nomor, ts: Date.now() });
  saveHistory(list);
  renderHistory();
  status.textContent = "Karcis disobek — SAH. Nomor " + state.nomor + ".";
}
function waMessage() {
  const item = bySlug[state.slug];
  const h = hitung(item, state);
  return "Bang, gw mau nawar " + item.nama + " (" + KONDISI_LABEL[state.kondisi] + "/" + LENGKAP_LABEL[state.lengkap] + ", tahun " + state.tahun + ").\n" +
    "Kisaran wajar: " + rp(h.low) + "–" + rp(h.high) + " (CONTOH — harga listing Okt 2026, bukan harga transaksi).\n" +
    "Gw tawar " + rp(h.tawar) + " dulu ya. Mentok gw " + rp(h.mentok) + ".\n" +
    "Karcis: " + (state.nomor || "TL-2026-····") + " — TAKSIRLOAK";
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e2) { return false; }
  }
}

/* ---------- EASTER EGG: ketik "tawar" ---------- */
let keyBuffer = "";
function initEasterEgg() {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!/^[a-z]$/i.test(e.key)) return;
    keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-5);
    if (keyBuffer === "tawar") {
      const panel = $("#tawarPanel");
      panel.hidden = false;
      const h2 = panel.querySelector("h2");
      h2.setAttribute("tabindex", "-1");
      h2.focus();
      panel.scrollIntoView({ behavior: motionOn ? "smooth" : "auto", block: "start" });
      keyBuffer = "";
    }
  });
  $("#tawarClose").addEventListener("click", () => { $("#tawarPanel").hidden = true; });
}

/* ---------- GERAK ---------- */
function buildTearPath() {
  const path = $("#tearPath");
  let d = "M0 12";
  for (let x = 25; x <= 600; x += 25) d += " L" + x + " " + (x % 50 === 25 ? 6 : 18);
  path.setAttribute("d", d);
  const draw = $("#tearDraw");
  if (draw) draw.setAttribute("d", d);
}
function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) { document.body.classList.add("nomotion"); motionOn = false; return; }
  gsap.registerPlugin(ScrollTrigger);
  /* A: zoom in karcis lalu pan kanan ke kalkulator (scrub) */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#atas", start: "top top", end: "bottom bottom", scrub: 0.5 }
  });
  tl.to("#heroTicket", { scale: 1.18, rotate: -1.2, ease: "none", duration: 0.35 }, 0)
    .from("#kalkMini", { y: 40, opacity: 0, duration: 0.2, ease: "none" }, 0.75)
    .to("#track", { xPercent: -50, ease: "none", duration: 0.65 }, 0.35);
  /* E: garis sobekan draw-on */
  const draw = $("#tearDraw");
  if (draw) {
    const len = draw.getTotalLength();
    gsap.set(draw, { strokeDasharray: len, strokeDashoffset: len });
    ScrollTrigger.create({
      trigger: "#ticketHasil", start: "top 85%", once: true,
      onEnter: () => gsap.to(draw, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" })
    });
  }
  document.fonts.ready.then(() => { try { ScrollTrigger.refresh(); } catch (e) { /* abaikan */ } });
}
function destroyMotion() {
  if (window.ScrollTrigger) {
    window.ScrollTrigger.getAll().forEach((t) => t.kill());
  }
  if (window.gsap) {
    gsap.set("#track", { clearProps: "all" });
    gsap.set("#heroTicket", { clearProps: "all" });
    gsap.set("#kalkMini", { clearProps: "all" });
  }
}
function setMotion(on) {
  motionOn = on;
  const btn = $("#motionToggle");
  btn.setAttribute("aria-pressed", String(on));
  btn.textContent = on ? "Gerak: nyala" : "Gerak: mati";
  document.body.classList.toggle("nomotion", !on);
  if (on) initMotion(); else destroyMotion();
  if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (e) { /* abaikan */ } }
}
function initInputMotion() {
  /* D: magnetic + cursor shape-shift + tilt — hanya pointer halus + gerak nyala */
  const follower = $("#cursorFollower");
  if (finePointer) {
    const qx = window.gsap ? gsap.quickTo(follower, "x", { duration: 0.25, ease: "power3" }) : null;
    const qy = window.gsap ? gsap.quickTo(follower, "y", { duration: 0.25, ease: "power3" }) : null;
    document.addEventListener("mousemove", (e) => {
      if (!motionOn || !qx) return;
      follower.classList.add("on");
      qx(e.clientX);
      qy(e.clientY);
    });
    $$('[data-cursor="ticket"]').forEach((el) => {
      el.addEventListener("mouseenter", () => follower.classList.add("ticket"));
      el.addEventListener("mouseleave", () => follower.classList.remove("ticket"));
    });
  }
  if (finePointer && window.gsap) {
    $$(".magnetic").forEach((btn) => {
      const mx = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3" });
      const my = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3" });
      btn.addEventListener("mousemove", (e) => {
        if (!motionOn) return;
        const r = btn.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.25);
        my((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
    });
    const ticket = $("#ticketHasil");
    ticket.addEventListener("mousemove", (e) => {
      if (!motionOn) return;
      const r = ticket.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      gsap.to(ticket, { rotateX: rx, rotateY: ry, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
    });
    ticket.addEventListener("mouseleave", () => {
      gsap.to(ticket, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
    });
  }
}

/* ---------- INIT ---------- */
function init() {
  renderGrid();
  renderMarquee();
  buildTearPath();

  /* tahun: 2015–2026 */
  const tahunSel = $("#tahun");
  for (let y = 2026; y >= 2015; y--) {
    const o = document.createElement("option");
    o.value = String(y);
    o.textContent = String(y);
    tahunSel.appendChild(o);
  }

  readParams();
  syncControls();
  if (state.slug) {
    const item = bySlug[state.slug];
    if (item && item.variants) {
      state.varian = item.variants.some((v) => v.v === state.varian) ? state.varian : item.variants[0].v;
    }
    selectItem(state.slug, false);
  } else {
    renderCalc(false);
  }
  renderHistory();
  initEasterEgg();
  initInputMotion();

  /* kontrol kondisi / kelengkapan / tahun / varian */
  $$('input[name="kondisi"]').forEach((r) => r.addEventListener("change", () => { state.kondisi = r.value; renderCalc(true); writeParams(); }));
  $$('input[name="lengkap"]').forEach((r) => r.addEventListener("change", () => { state.lengkap = r.value; renderCalc(true); writeParams(); }));
  tahunSel.addEventListener("change", () => { state.tahun = parseInt(tahunSel.value, 10) || 2024; renderCalc(true); writeParams(); });
  $("#varian").addEventListener("change", (e) => { state.varian = e.target.value; renderCalc(true); writeParams(); });

  $("#heroTaksirBtn").addEventListener("click", () => {
    if (!state.slug) {
      $("#heroError").textContent = "Karcisnya kosong, Bang. Pilih barang dulu, baru taksir.";
      $("#lapak").scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
      return;
    }
    $("#heroError").textContent = "";
    $("#kalkulator").scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
    $("#sobekBtn").focus({ preventScroll: true });
  });
  $("#gantiBtn").addEventListener("click", () => {
    $("#lapak").scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
    const first = $('#lapakGrid .card[data-slug]');
    if (first) first.focus({ preventScroll: true });
  });
  $("#sobekBtn").addEventListener("click", sobek);
  $("#salinWaBtn").addEventListener("click", async () => {
    const status = $("#waStatus");
    if (!state.slug) { $("#kalkError").textContent = "Karcisnya kosong, Bang. Pilih barang dulu, baru taksir."; return; }
    if (!state.nomor) { status.textContent = "Sobek dulu karcisnya, Bang — biar nomornya nempel di pesan."; return; }
    const ok = await copyText(waMessage());
    status.textContent = ok ? "Pesan tawar disalin, Bang. Tempel di WA penjual." : "Gagal menyalin — salin manual dari karcis, Bang.";
  });
  $("#salinTautanBtn").addEventListener("click", async () => {
    const ok = await copyText(buildLink());
    $("#waStatus").textContent = ok ? "Tautan disalin, Bang." : "Gagal menyalin tautan.";
  });
  $("#eksporBtn").addEventListener("click", () => {
    const list = loadHistory();
    const st = $("#riwayatStatus");
    if (!list.length) { st.textContent = "Riwayat masih kosong, Bang."; return; }
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "taksirloak-riwayat.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    st.textContent = "Riwayat diekspor (" + list.length + " taksiran).";
  });
  $("#hapusRiwayatBtn").addEventListener("click", () => {
    saveHistory([]);
    renderHistory();
    $("#riwayatStatus").textContent = "Riwayat dihapus.";
  });
  $("#marqueeToggle").addEventListener("click", (e) => {
    const wrap = $("#marqueeWrap");
    const paused = wrap.classList.toggle("paused");
    e.currentTarget.setAttribute("aria-pressed", String(paused));
    e.currentTarget.textContent = paused ? "Jalanin marquee" : "Jeda marquee";
  });
  $("#motionToggle").addEventListener("click", () => setMotion(!motionOn));

  /* gerak awal: hormati setelan OS */
  if (prefersReduced || !window.gsap) {
    setMotion(false);
  } else {
    setMotion(true);
  }
}
document.addEventListener("DOMContentLoaded", init);
