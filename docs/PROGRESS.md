# PROGRESS
Diperbarui: 2026-11-14
Milestone aktif: M9 selesai; publikasi (Bagian 6) sedang berjalan
Sub-tugas aktif: publikasi ke GitHub Pages
Langkah berikut yang persis: lihat "Masalah terbuka"; lanjutkan verifikasi angka di "Data yang belum terverifikasi" (ubah `tbc(...)` menjadi `ok(..., [sumber])` di `src/content/cars/*.ts`).

## Selesai
- M0 Fondasi: Vite, lint, format, tes, token bred, HashRouter, `scripts/shots.mjs`.
- M1 Skema dan data awal: skema Zod, empat berkas mobil, registri metrik, metrik turunan, validasi konten.
- M2 Verifikasi data: sebagian besar angka dicek ke sumber; sisanya tercatat di bawah.
- M3 Studio dan model prosedural: studio bred, pustaka material, empat bodi berskala benar, Garasi.
- M4 Komponen dalam: semua bagian di 3.4 dimodelkan skematis; tes pemetaan node lolos untuk keempat mobil.
- M5 Bedah: kupas, ledak (pegas teredam + garis penghubung), potong tiga sumbu, sinar-X, klik/hover/klik ganda, daftar keyboard, panel bagian dengan strip banding, preset kamera.
- M6 Banding: berjajar (satu kanvas, beberapa viewport) dan tumpuk dengan tiga titik acuan, kamera sinkron, sorot sistem, baris banding, kalimat ringkas, bagian padanan. Delapan cerita 3.5 punya tautan di Garasi.
- M7 Data dan grafik: tabel induk (cari, saring, urut), batang, radar, sebar, kurva downforce, varian ekstrem, ekspor CSV, glosarium, daftar sumber.
- M8 Adu: akselerasi, pengereman, downforce, aliran energi. Kalibrasi teruji.
- M9: cadangan tanpa WebGL (gambar statis), halaman Tentang, CREDITS, README, e2e, audit aksesibilitas.

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
- Nama proyek dan tujuan hosting: ditanyakan ke pemilik saat publikasi (Bagian 6).

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
