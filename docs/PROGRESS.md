# PROGRESS
Diperbarui: 2026-11-14
Milestone aktif: revisi (lihat `revisi.md`), fase R2
Sub-tugas aktif: verifikasi harga dan data ke sumber; terhenti karena limit pencarian web
Langkah berikut yang persis: lanjutkan R2 di `revisi.md` mulai dari daftar "Belum dicek" di bawah, lalu terapkan "Temuan R2" ke `src/content/cars/*.ts` dan `src/content/sources.ts`; setelah itu R1 (model 3D).

## Temuan R2 sejauh ini (belum diterapkan ke kode)
- Seal: Rp750 juta OTR Jakarta dikonfirmasi beberapa sumber (Zigwheels, Fortune IDN, Gridoto mengutip situs BYD Indonesia). Tidak dikonversi.
- Senna: harga AS $958.966 (lembar media McLaren) → ± Rp17.357.284.600 pada kurs $1 = Rp18.100.
- P1: harga AS $1.150.000 (duPont Registry; Motor1 menulis angka lain, perlu sumber kedua) → ± Rp20.815.000.000.
- LaFerrari: harga AS belum ditemukan; Wikipedia hanya menyebut "lebih dari 1 juta euro".
- LaFerrari (Wikipedia): panjang 4.702, lebar 1.992, tinggi 1.116, jarak sumbu 2.650 mm; berat siap jalan 1.585 kg; mesin 588 kW pada 9.000 rpm, 700 Nm pada 6.750 rpm; motor 120 kW; gabungan 708 kW dan 900 Nm; 7 tingkat; cakram 398/380 mm; ban 265/30 R19 dan 345/30 R20; Aperta 200 unit + 9 + 1 (kode menulis 210: sama). 0–100 tertulis 2,6 dtk (kode: klaim < 3,0). 0–300: klaim 15 dtk dibantah, terukur 21,99 dtk.
- P1 (Wikipedia): dimensi 4.588 × 1.946 × 1.188, jarak sumbu 2.670 mm; torsi mesin 720 Nm pada 4.000 rpm; jarak listrik 11 km NEDC (kode: > 10 km); berat siap jalan 1.490 kg di kotak info tetapi 1.547 kg di teks (sumber bertentangan); baterai 535 V.
- Senna (Wikipedia) BERBEDA dari kode: lebar 2.153 mm (kode 1.958), tinggi 1.195 mm (kode 1.229), berat siap jalan 1.374 kg (kode ± 1.309). Harus dicek ke lembar media McLaren sebelum diubah; lebar kemungkinan termasuk spion.
- Belum dicek: harga AS LaFerrari; putaran maksimum ketiga mesin; cakram, ban, pelek, tangki, massa MonoCage P1 dan Senna; downforce LaFerrari; tinggi, jarak sumbu, Cd, dan tingkat transmisi Seal; daya FXX K Evo.

## Publikasi
- Repositori: https://github.com/Orls967/SealMaxxing (publik, cabang `master`, tag m0–m9).
- Situs: https://orls967.github.io/SealMaxxing/ lewat `.github/workflows/deploy.yml` (lint, tes, build, deploy pada setiap push ke `master`).
- Diperiksa setelah tayang: tujuh rute termuat tanpa permintaan gagal; tangkapan layar desktop dan ponsel sesuai.

## Hasil pemeriksaan akhir
- `lint`, `typecheck`, `build` lolos. Vitest: 82 tes lolos. Playwright: 15 tes lolos.
- Lighthouse aksesibilitas: 100 pada Garasi, Bedah, Banding, Data, Adu (downforce, aliran energi), Glosarium, Tentang.
- Kalibrasi model (model / klaim): Seal 0–100 3,82 / 3,8; LaFerrari 2,98 / < 3,0 dan 6,90 / 6,9; P1 2,79 / 2,8 dan 6,80 / 6,8; Senna 2,78 / 2,8 dan 6,81 / 6,8. 0–300 tidak dikalibrasi dan jatuh dalam 10% dari klaim.
- Muatan awal Garasi ± 1,4 MB belum dikompresi (three.js ± 1,1 MB, dimuat hanya di rute 3D).

## Keputusan
- Model 3D: hanya jalur prosedural (4.3 tingkat 2). Tidak ada GLB; `CarModel` membangun grup bernama `<systemId>__<partId>__<indeks>` langsung dari primitif. Karena itu `optimize-models.mjs` dan tingkat detail berbasis GLB tidak dibuat; Garasi memakai `detail="exterior"` sebagai tingkat rendah.
- Kupas: lapisan terkupas disembunyikan; dengan sinar-X lapisan itu menjadi siluet.
- Potong: tutup potongan memakai sisi belakang berwarna merah (bukan stencil). Komponen dalam berongga di bidang potong.
- Sorot: bagian terpilih memakai material berpendar merah; tanpa postprocessing Outline (lebih ringan, sama di ponsel).
- Memilih bagian dari daftar otomatis menyalakan sinar-X bila bagian itu masih tertutup lapisan luar.
- Titik acuan "tanah" pada tata letak tumpuk diartikan sebagai tengah bodi (semua mobil selalu di tanah).
- Keadaan tampilan: store Zustand menulis ke hash lewat `history.replaceState`; navigasi rute menghidrasi ulang dari URL.
- Simulasi: rasio gigi tidak diambil dari pabrikan; gigi disusun geometris dari kecepatan gigi 1 (parameter model) sampai sedikit di atas kecepatan puncak. Semua parameter model ada di `src/lib/sim/params.ts` dan berlabel bukan data pabrikan.
- Pengereman: tidak ada klaim pabrikan yang seragam, jadi hanya hasil model yang tampil.
- "Harga per kW" (2.5) tidak dihitung: harga keempat mobil berbeda mata uang dan tahun, sehingga hasilnya tidak sebanding (2.6).
- Warna aksen digelapkan dari #e11d2e ke #cc1626 supaya teks putih di atasnya lolos kontras AA.
- Nama akhir proyek: SealMaxxing (keputusan pemilik, 2026-11-14). Hosting: GitHub Pages lewat GitHub Actions, repositori publik. Nama berkas `CARSOME.md` dan judul `CLAUDE.md` tidak diubah.

## Masalah terbuka
- Bodi adalah pendekatan siluet dari penampang yang di-loft; detail seperti lubang udara, lampu, dan lengkung spatbor masih kasar.
- Kurva downforce LaFerrari diekstrapolasi dari satu titik yang belum terverifikasi (± 360 kg pada 200 km/jam) dan tidak dibatasi, sehingga di atas 280 km/jam melampaui Senna. Berlabel perkiraan.
- Sakelar posisi sayap di Adu hanya mengubah gambar, tidak mengubah angka (tidak ada data pabrikan untuk tiap posisi).
- Bayangan kontak dimatikan saat ledak/kupas/sinar-X.

## Data yang belum terverifikasi
- Seal: tinggi 1.460 mm, jarak sumbu roda 2.920 mm, tingkat transmisi 1, Cd 0,219.
- LaFerrari: torsi gabungan > 900 Nm, 0–100 < 3,0 dtk, 0–300 15 dtk, panjang/lebar/tinggi/jarak sumbu, berat siap jalan ± 1.585 kg, daya mesin 588 kW, torsi mesin 700 Nm, putaran maksimum 9.250 rpm, daya motor 120 kW, tingkat transmisi 7, cakram 398/380 mm, ban 265/345 mm, pelek 19/20 inci, downforce ± 360 kg pada 200 km/jam, harga, daya FXX K Evo 772 kW.
- P1: panjang/lebar/tinggi/jarak sumbu, putaran maksimum ± 8.250 rpm, massa MonoCage 90 kg, cakram 390/380 mm, ban 245/315 mm, pelek 19/20 inci, harga.
- Senna: panjang/lebar/tinggi/jarak sumbu, berat siap jalan ± 1.309 kg, putaran maksimum ± 8.500 rpm, tangki 72 L, cakram 390/390 mm, ban 245/315 mm, pelek 19/20 inci, harga.
- Tidak dipublikasikan pabrikan (tampil "Tidak dipublikasikan"): Cd LaFerrari dan Senna, massa bak LaFerrari dan Senna, bagasi LaFerrari dan Senna, massa baterai dan diameter cakram Seal.
