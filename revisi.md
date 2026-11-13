# Rencana revisi SealMaxxing

Berkas sementara. Dihapus setelah seluruh revisi selesai dan pemilik mengonfirmasi hasilnya.

Dasar revisi (masukan pemilik, 2026-11-14):

1. Model mobil belum memenuhi: belum mirip mobil aslinya.
2. README belum rapi dan belum lengkap; harus memuat tangkapan layar hasil deploy.
3. Harga dan seluruh info harus diverifikasi persis; harga non-rupiah disertai konversi rupiah
   bulat dengan kurs $1 = Rp18.100.
4. Gambar acuan mobil disimpan di folder `model/`.

Urutan kerja: R0 → R1 → R2 → R3 → R4 → R5. Setiap fase ditutup dengan lint, typecheck, tes,
tangkapan layar desktop dan ponsel, lalu commit kecil.

---

## Catatan penyelesaian (2026-11-14)

- R1 dikerjakan dengan satu permukaan loft yang dibentuk medan lekukan dan panel konformal
  per mobil, bukan titik kendali bebas per stasiun; lubang udara berupa panel gelap di atas
  lekukan. Kemiripan ada pada tingkat ilustrasi dan dicatat di "Masalah terbuka".
- Tambahan di luar rencana: suara sintetis per mobil (permintaan pemilik).
- Lighthouse belum dijalankan ulang.

## R0 — Gambar acuan (`model/`)

| Berkas                | Mobil             | Yang dipakai sebagai acuan                                                   |
| --------------------- | ----------------- | ---------------------------------------------------------------------------- |
| `model/seal.png`      | BYD Seal          | Tiga-perempat depan-atas: garis atap fastback, atap kaca hitam, lampu, pelek |
| `model/laferrari.png` | Ferrari LaFerrari | Tiga-perempat depan: hidung, lubang kap, kanopi, saluran samping             |
| `model/p1.png`        | McLaren P1        | Tiga-perempat depan: lampu, cekungan pintu, sayap belakang                   |
| `model/senna.png`     | McLaren Senna     | Atas-depan: splitter, sayap, bagian tengah hitam, kaca                       |

- [x] Empat gambar disalin ke `model/` (lokal).
- [x] Keputusan pemilik (2026-11-14): gambar **tetap lokal**. `model/` masuk `.gitignore` karena
      keempatnya foto pihak ketiga tanpa lisensi jelas (aturan keras 5). Gambar hanya acuan
      bentuk dan tidak pernah dimuat oleh aplikasi.

## R1 — Model 3D supaya mirip acuan

Masalah sekarang: keempat bodi dibuat dari satu penampang superelips yang di-loft, sehingga
semuanya tampak seperti satu bentuk lonjong yang sama; tidak ada spatbor, lubang udara, lampu
berbentuk, spion, atau garis pintu; semua hitam di latar hitam.

Tetap berlaku: model buatan sendiri (prosedural), skala sebenarnya, tanpa logo, komponen dalam
berlabel ilustrasi, nama node `<systemId>__<partId>__<indeks>`.

### R1.1 Pembangun bodi baru (`src/scene/procedural/`)

- [x] Penampang per stasiun tidak lagi satu superelips: tiap stasiun punya titik kendali
      sendiri (lantai, ambang, pinggang, bahu, tepi kap/dek) sehingga bisa membentuk bahu
      spatbor, pinggang yang masuk, dan dek belakang yang datar.
- [x] Spatbor: tonjolan di atas tiap roda dan lengkung roda yang benar-benar terpotong
      (geometri, bukan `discard` di shader), dengan bibir lengkung.
- [x] Rumah kaca terpisah: kaca depan, kaca samping, kaca belakang, pilar A/B/C, dan atap
      sebagai panel sendiri, bukan satu gelembung.
- [x] Bukaan sebagai panel gelap yang masuk ke dalam bodi: gril, saluran samping, lubang kap,
      diffuser.
- [x] Detail bersama: spion, garis celah pintu dan kap, lampu depan dan belakang berbentuk
      (bukan kotak), pelek sesuai pola tiap mobil.
- [x] Tes: tiap mobil tetap memenuhi panjang, lebar, tinggi, dan jarak sumbu roda dari data
      (toleransi 1%); tes pemetaan node tetap lolos.

### R1.2 Ciri khas per mobil (dicek terhadap `model/`)

- [x] **Seal**: sedan fastback empat pintu; kap pendek menurun; atap kaca hitam yang menyatu
      sampai kaca belakang; lampu depan sipit dengan garis LED; pola titik di bumper bawah;
      gagang pintu rata; pelek lima jari berpola bilah; bibir bagasi; batang lampu belakang.
- [x] **LaFerrari**: hidung rendah dengan dua bukaan dan lubang kap berbentuk V; spatbor depan
      menonjol; kanopi sempit yang maju; saluran besar di belakang pintu; atap hitam; buritan
      lebar dengan lampu bulat; pelek lima jari ganda.
- [x] **P1**: lampu depan melengkung mengikuti bentuk logo-nya (tanpa logo); cekungan dalam di
      sisi pintu; corong atap; buritan terbuka berjaring; sayap belakang yang bisa naik;
      knalpot tengah.
- [x] **Senna**: splitter depan lebar dengan bilah; bagian tengah karbon hitam dari kap sampai
      atap; kaca bawah di pintu; sayap tetap raksasa dengan penyangga leher angsa dan pelat
      ujung; knalpot ke atas; pelek mur tunggal.

### R1.3 Warna dan pencahayaan

- [x] Livery tema tetap ada, tetapi bodi diberi garis aksen dan cukup cahaya tepi supaya
      bentuknya terbaca (sekarang nyaris hilang di latar).
- [x] **Keputusan pemilik: livery bawaan.** Usul: bawaan mengikuti warna acuan (Seal
      biru-abu, LaFerrari merah atap hitam, P1 merah tua, Senna jingga dengan karbon hitam),
      dan livery tema hitam-merah menjadi sakelar. Alternatif: tetap livery tema sebagai bawaan.
- [x] Studio: lantai sedikit memantul, lampu strip merah, cahaya tepi lebih kuat.

### R1.4 Selesai bila

- [x] Tangkapan layar tiap mobil dari sudut yang sama dengan gambar acuan diletakkan
      berdampingan dan dinilai: siluet, proporsi, dan tiga ciri khas tiap mobil dikenali.
- [x] Garasi, Bedah (kupas, ledak, potong, sinar-X), dan Banding tetap berfungsi di desktop
      dan ponsel; gambar statis tanpa WebGL dibuat ulang.

## R2 — Verifikasi harga dan seluruh data

Status: selesai dan diterapkan (2026-11-14). Enam angka tetap berlabel "perlu verifikasi";
rinciannya di `docs/PROGRESS.md`.

- [x] **Harga**: cari harga peluncuran resmi tiap mobil beserta sumbernya (siaran pers
      pabrikan atau media besar), mata uang asli, dan tahun. - Seal Performance AWD: harga OTR Indonesia (rupiah, tidak dikonversi). - LaFerrari, P1, Senna: harga peluncuran dalam USD (pasar AS) dari sumber; bila sumber
      hanya memuat GBP/EUR, harga USD resmi pasar AS yang dipakai, bukan konversi silang.
- [x] **Konversi rupiah**: kurs tetap $1 = Rp18.100 (ketetapan pemilik, 2026-11-14).
      Rupiah = USD × 18.100, dibulatkan. Tampil sebagai "± Rp… (perkiraan, kurs $1 =
      Rp18.100)" di samping harga asli; harga asli dan tahunnya tetap ditampilkan.
- [x] Skema: `price` menjadi angka + mata uang + tahun (`priceUsd` / `priceIdr`) supaya
      konversi dihitung di `src/lib/` (dengan tes), tidak diketik tangan.
- [x] **57 angka "perlu verifikasi"**: dicek satu per satu ke sumber (urutan prioritas
      CARSOME.md 3.6), `tbc(...)` diubah menjadi `ok(..., [sumber])`; angka yang ternyata salah
      diperbaiki dan dicatat di `docs/PROGRESS.md`.
- [x] Angka yang sudah `verified` dicek ulang secara acak (minimal harga, daya, berat,
      akselerasi, kecepatan puncak, baterai, dimensi) terhadap sumbernya.
- [x] Angka yang tetap tidak bisa dipastikan dibiarkan berlabel "perlu verifikasi" dan
      didaftar di PROGRESS; tidak ada angka yang dikarang.
- [x] Kalibrasi simulasi dijalankan ulang bila berat, daya, atau klaim akselerasi berubah.
- [x] Teks bagian dan kalimat banding yang menyebut angka disesuaikan dengan data baru.

## R3 — README

- [x] Judul, satu kalimat penjelasan, tautan situs (https://orls967.github.io/SealMaxxing/),
      dan lencana status deploy.
- [x] Tangkapan layar hasil deploy (dari R5), disimpan di `docs/screenshots/`: Garasi, Bedah
      (sinar-X dan ledak), Banding (sorot sistem dan tumpuk), Data, Adu; desktop dan ponsel.
- [x] Tabel empat mobil: jenis, tahun, daya, berat, 0–100, harga asli dan rupiah.
- [x] Fitur per halaman, cara memakai (kontrol 3D, tautan yang bisa dibagikan).
- [x] Aturan data dan banding yang adil, status verifikasi, batasan model dan simulasi.
- [x] Teknologi, struktur folder, perintah menjalankan dan memeriksa, alur deploy.
- [x] Kredit, lisensi, dan pernyataan tidak berafiliasi.
- [x] Rapi: daftar isi, tabel sejajar, tanpa bagian kosong.

## R4 — Perapian lain yang ikut terdampak

- [x] `CREDITS.md` dan halaman Tentang diperbarui (model, gambar acuan, sumber harga, kurs).
- [x] Peringatan CI: naikkan versi aksi GitHub yang masih menargetkan Node 20.
- [x] `docs/PROGRESS.md` diperbarui tiap fase.

## R5 — Fase terakhir

- [ ] Semua pemeriksaan: lint, typecheck, tes unit, e2e, build, Lighthouse aksesibilitas ≥ 95.
- [x] Push dan tunggu deploy sukses.
- [x] Ambil tangkapan layar dari situs yang sudah tayang, simpan ke `docs/screenshots/`,
      pasang di README, push lagi.
- [ ] Tunjukkan hasil ke pemilik. Setelah pemilik mengonfirmasi sesuai: hapus `revisi.md`,
      commit, push.

---

# Revisi putaran 2 (masukan pemilik, 2026-11-14)

Masukan: (1) model baru mirip ± 55%, target minimal 99%; (2) suara jangan sintetis;
(3) akselerasi tidak sesuai: Seal seharusnya lebih kencang di awal.

## R6 — Akselerasi: Seal unggul di awal

- [x] R6.1 Periksa model: mobil bermesin bakar mendapat traksi penuh sejak t = 0, sehingga
      Seal tertinggal sejak start (bertentangan dengan CARSOME.md 2.7).
- [x] R6.2 Tambah waktu bangun dorongan saat start (`launchS`): Seal 0,05 dtk; LaFerrari dan
      P1 0,35 dtk; Senna 0,4 dtk (parameter model, bukan data pabrikan).
- [x] R6.3 Kalibrasi ulang cengkeraman dan efisiensi supaya 0–100 dan 0–200 tetap dalam ±5%
      dari klaim; tes: Seal di depan ketiga hypercar pada 0,5 dan 1 dtk, tersusul sebelum 3 dtk.
- [x] R6.4 Catatan model di halaman Adu menjelaskan sebabnya.
- [ ] R6.5 Pemilik menilai hasil di halaman Adu. Klaim pabrikan (Seal 3,8 dtk; LaFerrari
      < 3,0; P1 2,8; Senna 2,8) sudah dicek ke sumber dan tidak diubah.

## R7 — Model 3D minimal 99% mirip

Kemiripan 99% tidak bisa dicapai dengan bodi prosedural (bentuk dari rumus). Butuh model 3D
sungguhan (GLB) tiap mobil. Pencarian 2026-11-14 tidak menemukan model CC0/CC-BY yang
lisensi dan asal-usulnya bisa dipastikan untuk keempat mobil.

- [ ] R7.1 **Keputusan pemilik: sumber model.** (a) pemilik menyediakan empat berkas GLB
      beserta bukti lisensinya; atau (b) pemilik membeli model berlisensi (CGTrader,
      RenderHub, dan sejenisnya) yang lisensinya mengizinkan ditayangkan di web publik; atau
      (c) pemilik mengizinkan model Sketchfab berlabel CC-BY walau asal-usulnya tidak bisa
      dipastikan (menyimpang dari aturan keras 5, harus tertulis).
- [ ] R7.2 Simpan GLB di `public/models/<carId>.glb`, catat lisensi dan pembuat di `CREDITS.md`.
- [ ] R7.3 Optimasi: `scripts/optimize-models.mjs` (Draco/Meshopt, tekstur WebP/KTX2), target
      ≤ 5 MB per mobil, dimuat saat diperlukan dengan indikator kemajuan.
- [ ] R7.4 Pemuat GLB di `src/scene/`: skala disetel ke panjang dari data (skala sebenarnya),
      titik asal di poros depan, logo pabrikan dihapus dari mesh/tekstur.
- [ ] R7.5 Petakan mesh GLB ke `PartId` (panel bodi, pintu, kaca, lampu, roda, ban, sayap)
      supaya pilih, sorot, kupas, ledak, dan sinar-X tetap berfungsi; komponen dalam tetap
      ilustrasi prosedural di dalam bodi baru.
- [ ] R7.6 Bodi prosedural menjadi cadangan saat GLB gagal dimuat; gambar statis dibuat ulang.
- [ ] R7.7 Selesai bila tangkapan layar dari sudut gambar acuan (`model/`) diletakkan
      berdampingan dan dinilai pemilik.

## R8 — Suara rekaman asli

Pencarian 2026-11-14 tidak menemukan rekaman LaFerrari, P1, atau Senna berlisensi terbuka.

- [ ] R8.1 **Pemilik menyiapkan rekaman** tiap mobil (MP3/OGG/WAV) beserta asal dan
      lisensinya. Paling baik dua klip per mobil: langsam (bisa diulang) dan digas sampai
      putaran tinggi, 3–8 detik, tanpa musik atau suara orang. Seal: dengung motor saat
      berakselerasi.
- [ ] R8.2 Simpan di `public/sounds/<carId>-idle.*` dan `<carId>-rev.*`; catat di `CREDITS.md`.
- [ ] R8.3 Pemutar: tombol "Tahan untuk injak gas" memutar rekaman (langsam berulang, lalu
      klip digas dengan nada dan volume mengikuti gas); dimuat saat tombol pertama ditekan.
- [ ] R8.4 Suara sintetis hanya menjadi cadangan bila berkas rekaman sebuah mobil belum ada,
      dan tetap berlabel sintetis.

---

## Keputusan yang ditunggu dari pemilik

2. Sumber model 3D (R7.1) dan rekaman suara (R8.1).

1. Livery bawaan: dikerjakan dengan warna acuan sebagai bawaan dan livery tema sebagai sakelar
   (usul di R1.3); dibalik bila pemilik memilih sebaliknya.
