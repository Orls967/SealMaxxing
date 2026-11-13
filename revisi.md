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

- [ ] Penampang per stasiun tidak lagi satu superelips: tiap stasiun punya titik kendali
      sendiri (lantai, ambang, pinggang, bahu, tepi kap/dek) sehingga bisa membentuk bahu
      spatbor, pinggang yang masuk, dan dek belakang yang datar.
- [ ] Spatbor: tonjolan di atas tiap roda dan lengkung roda yang benar-benar terpotong
      (geometri, bukan `discard` di shader), dengan bibir lengkung.
- [ ] Rumah kaca terpisah: kaca depan, kaca samping, kaca belakang, pilar A/B/C, dan atap
      sebagai panel sendiri, bukan satu gelembung.
- [ ] Bukaan sebagai panel gelap yang masuk ke dalam bodi: gril, saluran samping, lubang kap,
      diffuser.
- [ ] Detail bersama: spion, garis celah pintu dan kap, lampu depan dan belakang berbentuk
      (bukan kotak), pelek sesuai pola tiap mobil.
- [ ] Tes: tiap mobil tetap memenuhi panjang, lebar, tinggi, dan jarak sumbu roda dari data
      (toleransi 1%); tes pemetaan node tetap lolos.

### R1.2 Ciri khas per mobil (dicek terhadap `model/`)

- [ ] **Seal**: sedan fastback empat pintu; kap pendek menurun; atap kaca hitam yang menyatu
      sampai kaca belakang; lampu depan sipit dengan garis LED; pola titik di bumper bawah;
      gagang pintu rata; pelek lima jari berpola bilah; bibir bagasi; batang lampu belakang.
- [ ] **LaFerrari**: hidung rendah dengan dua bukaan dan lubang kap berbentuk V; spatbor depan
      menonjol; kanopi sempit yang maju; saluran besar di belakang pintu; atap hitam; buritan
      lebar dengan lampu bulat; pelek lima jari ganda.
- [ ] **P1**: lampu depan melengkung mengikuti bentuk logo-nya (tanpa logo); cekungan dalam di
      sisi pintu; corong atap; buritan terbuka berjaring; sayap belakang yang bisa naik;
      knalpot tengah.
- [ ] **Senna**: splitter depan lebar dengan bilah; bagian tengah karbon hitam dari kap sampai
      atap; kaca bawah di pintu; sayap tetap raksasa dengan penyangga leher angsa dan pelat
      ujung; knalpot ke atas; pelek mur tunggal.

### R1.3 Warna dan pencahayaan

- [ ] Livery tema tetap ada, tetapi bodi diberi garis aksen dan cukup cahaya tepi supaya
      bentuknya terbaca (sekarang nyaris hilang di latar).
- [ ] **Keputusan pemilik: livery bawaan.** Usul: bawaan mengikuti warna acuan (Seal
      biru-abu, LaFerrari merah atap hitam, P1 merah tua, Senna jingga dengan karbon hitam),
      dan livery tema hitam-merah menjadi sakelar. Alternatif: tetap livery tema sebagai bawaan.
- [ ] Studio: lantai sedikit memantul, lampu strip merah, cahaya tepi lebih kuat.

### R1.4 Selesai bila

- [ ] Tangkapan layar tiap mobil dari sudut yang sama dengan gambar acuan diletakkan
      berdampingan dan dinilai: siluet, proporsi, dan tiga ciri khas tiap mobil dikenali.
- [ ] Garasi, Bedah (kupas, ledak, potong, sinar-X), dan Banding tetap berfungsi di desktop
      dan ponsel; gambar statis tanpa WebGL dibuat ulang.

## R2 — Verifikasi harga dan seluruh data

Status: dimulai, terhenti karena limit pencarian web. Temuan sementara dicatat di
`docs/PROGRESS.md` bagian "Temuan R2" dan belum diterapkan ke kode.

- [ ] **Harga**: cari harga peluncuran resmi tiap mobil beserta sumbernya (siaran pers
      pabrikan atau media besar), mata uang asli, dan tahun. - Seal Performance AWD: harga OTR Indonesia (rupiah, tidak dikonversi). - LaFerrari, P1, Senna: harga peluncuran dalam USD (pasar AS) dari sumber; bila sumber
      hanya memuat GBP/EUR, harga USD resmi pasar AS yang dipakai, bukan konversi silang.
- [ ] **Konversi rupiah**: kurs tetap $1 = Rp18.100 (ketetapan pemilik, 2026-11-14).
      Rupiah = USD × 18.100, dibulatkan. Tampil sebagai "± Rp… (perkiraan, kurs $1 =
      Rp18.100)" di samping harga asli; harga asli dan tahunnya tetap ditampilkan.
- [ ] Skema: `price` menjadi angka + mata uang + tahun (`priceUsd` / `priceIdr`) supaya
      konversi dihitung di `src/lib/` (dengan tes), tidak diketik tangan.
- [ ] **57 angka "perlu verifikasi"**: dicek satu per satu ke sumber (urutan prioritas
      CARSOME.md 3.6), `tbc(...)` diubah menjadi `ok(..., [sumber])`; angka yang ternyata salah
      diperbaiki dan dicatat di `docs/PROGRESS.md`.
- [ ] Angka yang sudah `verified` dicek ulang secara acak (minimal harga, daya, berat,
      akselerasi, kecepatan puncak, baterai, dimensi) terhadap sumbernya.
- [ ] Angka yang tetap tidak bisa dipastikan dibiarkan berlabel "perlu verifikasi" dan
      didaftar di PROGRESS; tidak ada angka yang dikarang.
- [ ] Kalibrasi simulasi dijalankan ulang bila berat, daya, atau klaim akselerasi berubah.
- [ ] Teks bagian dan kalimat banding yang menyebut angka disesuaikan dengan data baru.

## R3 — README

- [ ] Judul, satu kalimat penjelasan, tautan situs (https://orls967.github.io/SealMaxxing/),
      dan lencana status deploy.
- [ ] Tangkapan layar hasil deploy (dari R5), disimpan di `docs/screenshots/`: Garasi, Bedah
      (sinar-X dan ledak), Banding (sorot sistem dan tumpuk), Data, Adu; desktop dan ponsel.
- [ ] Tabel empat mobil: jenis, tahun, daya, berat, 0–100, harga asli dan rupiah.
- [ ] Fitur per halaman, cara memakai (kontrol 3D, tautan yang bisa dibagikan).
- [ ] Aturan data dan banding yang adil, status verifikasi, batasan model dan simulasi.
- [ ] Teknologi, struktur folder, perintah menjalankan dan memeriksa, alur deploy.
- [ ] Kredit, lisensi, dan pernyataan tidak berafiliasi.
- [ ] Rapi: daftar isi, tabel sejajar, tanpa bagian kosong.

## R4 — Perapian lain yang ikut terdampak

- [ ] `CREDITS.md` dan halaman Tentang diperbarui (model, gambar acuan, sumber harga, kurs).
- [ ] Peringatan CI: naikkan versi aksi GitHub yang masih menargetkan Node 20.
- [ ] `docs/PROGRESS.md` diperbarui tiap fase.

## R5 — Fase terakhir

- [ ] Semua pemeriksaan: lint, typecheck, tes unit, e2e, build, Lighthouse aksesibilitas ≥ 95.
- [ ] Push dan tunggu deploy sukses.
- [ ] Ambil tangkapan layar dari situs yang sudah tayang, simpan ke `docs/screenshots/`,
      pasang di README, push lagi.
- [ ] Tunjukkan hasil ke pemilik. Setelah pemilik mengonfirmasi sesuai: hapus `revisi.md`,
      commit, push.

---

## Keputusan yang ditunggu dari pemilik

1. Livery bawaan: dikerjakan dengan warna acuan sebagai bawaan dan livery tema sebagai sakelar
   (usul di R1.3); dibalik bila pemilik memilih sebaliknya.
