# PROGRESS

Diperbarui: 2026-11-14
Milestone aktif: revisi putaran 2 (lihat `revisi.md`), fase R7 dan R8
Sub-tugas aktif: menunggu berkas dari pemilik: model GLB (R7.1) dan rekaman suara (R8.1)
Langkah berikut yang persis: begitu pemilik menaruh GLB di `public/models/` atau rekaman di `public/sounds/` (atau memutuskan sumbernya), kerjakan R7.2–R7.7 dan R8.2–R8.4 di `revisi.md`. `revisi.md` belum dihapus.

## Selesai

- R0: gambar acuan tetap lokal di `model/` (masuk `.gitignore`).
- R1: bodi dibangun ulang (`src/scene/procedural/surface.ts`): lengkung roda dipotong di mesh, spatbor mengikuti roda, rumah kaca terpisah menjadi panel (kaca depan, samping, belakang, atap, pilar), panel konformal untuk lampu, lubang udara, pintu, dan garis celah, spion, pelek per mobil, warna acuan sebagai livery bawaan dengan livery tema sebagai sakelar. Gambar statis tanpa WebGL dibuat ulang.
- R2: harga dan data dicek ke sumber dan diterapkan; harga disimpan sebagai angka + mata uang + tahun, rupiah dihitung di `src/lib/price.ts` dengan kurs tetap $1 = Rp18.100 (`src/content/fx.ts`).
- R3: README ditulis ulang. R4: `CREDITS.md`, halaman Tentang, dan versi aksi GitHub diperbarui.
- Tambahan (permintaan pemilik, 2026-11-14): suara tiap mobil lewat tombol "Tahan untuk injak gas" di kartu Garasi dan di halaman Bedah.

## Hasil verifikasi R2

- Seal: Rp750.000.000 OTR Jakarta (Zigwheels, Moladin), tidak dikonversi. Tinggi 1.460 mm dan jarak sumbu 2.920 mm (ArenaEV, BYD Australia), Cd 0,219 (panduan produk BYD).
- LaFerrari: MSRP AS $1.416.362 (Autoblog, CarGurus) → ± Rp25.636.152.200. Dimensi, daya dan torsi mesin, motor, transmisi, cakram 398/380 mm, ban, pelek, 0–100 < 3 dtk, 0–300 15 dtk, putaran maksimum 9.250 rpm cocok dengan Wikipedia dan salinan lembar data peluncuran. Jarak sumbu: 2.650 mm (Wikipedia) dipakai; salinan lembar data menulis 2.665 mm.
- P1: harga AS $1.150.000 (siaran pers McLaren di PR Newswire, Autoblog) → ± Rp20.815.000.000. Dimensi, cakram 390/380 mm, ban, pelek, MonoCage 90 kg, baterai 96 kg, bagasi 120 L dari paket pers (PistonHeads) dan Ultimate Specs. Jarak listrik diubah dari "> 10 km" menjadi 11 km NEDC.
- Senna: lembar media McLaren (versi AS, 31 Juli 2018) mengonfirmasi angka di kode: tinggi 1.229 mm (48,4 in), lebar tanpa spion 1.958 mm (2.153 mm dengan spion, angka yang dipakai Wikipedia), berat DIN 1.309 kg, cakram 390 mm, ban dan pelek, harga $958.966 → ± Rp17.357.284.600. **Berubah:** 0–300 km/jam dari 17,5 dtk (klaim awal Februari 2018) menjadi 18,8 dtk (lembar media Juli 2018).
- FXX K Evo: 1.050 cv dan 640 kg pada 200 km/jam dari halaman resmi Ferrari.
- Pemeriksaan ulang menemukan satu sumber yang salah kutip: tangki P1 72 L tercatat bersumber Wikipedia padahal halaman itu tidak memuatnya; statusnya dikembalikan ke "perlu verifikasi".

## Publikasi

- Repositori: https://github.com/Orls967/SealMaxxing (publik, cabang `master`, tag m0–m9).
- Situs: https://orls967.github.io/SealMaxxing/ lewat `.github/workflows/deploy.yml` (lint, tes, build, deploy pada setiap push ke `master`).

## Hasil pemeriksaan akhir

- `lint`, `typecheck`, `build` lolos. Vitest: 90 tes lolos. Playwright: 15 tes lolos.
- Lighthouse aksesibilitas belum dijalankan ulang setelah revisi (terakhir 100 di semua halaman sebelum revisi).
- R6 (2026-11-14): model akselerasi diberi waktu bangun dorongan saat start (`launchS`); Seal kini di depan ketiga hypercar pada 0,5 dan 1 dtk dan tersusul sebelum 3 dtk. Kalibrasi baru (model / klaim 0–100): Seal 3,70 / 3,8; LaFerrari 2,89 / < 3,0; P1 ± 2,8 / 2,8; Senna ± 2,8 / 2,8.
- Kalibrasi model tetap dalam ±5% untuk 0–100 dan 0–200. `cdA` Senna dinaikkan 0,75 → 0,84 supaya 0–300 model tetap dalam 10% dari angka baru 18,8 dtk.
- Suara: keempat profil diperiksa lewat render luring (`OfflineAudioContext`): sinyal ada, tidak terpotong (puncak < 0,4), nada naik bersama gas. Belum dinilai dengan telinga oleh pemilik.

## Keputusan

- Livery bawaan = warna acuan (Seal biru-abu, LaFerrari merah atap hitam, P1 merah tua, Senna jingga + karbon); livery tema hitam-merah menjadi sakelar (`?liv=theme`).
- Suara disintesis di peramban (Web Audio), bukan rekaman: tidak ditemukan rekaman LaFerrari, P1, dan Senna yang lisensinya bisa dipastikan (aturan keras 5). Nada dihitung dari jumlah silinder dan putaran maksimum; parameter lain (putaran langsam 1.000 rpm, waktu naik/turun) adalah asumsi model di `src/lib/sound.ts`. "Suara mesin" tadinya di luar lingkup (CARSOME.md 2.10) dan ditambahkan atas permintaan pemilik.
- Bodi: tetap satu permukaan loft, dibentuk dengan medan lekukan (`dents`) dan panel konformal (`patches`) per mobil, bukan penampang bertitik kendali bebas per stasiun. Lubang udara adalah panel gelap di atas lekukan, bukan rongga sungguhan.
- Harga: pasar AS dipakai untuk ketiga hypercar supaya satu mata uang; "harga per kW" tetap tidak dihitung (tahun dan pasar berbeda).
- Model 3D: hanya jalur prosedural (4.3 tingkat 2). Tidak ada GLB.
- Kupas: lapisan terkupas disembunyikan; dengan sinar-X lapisan itu menjadi siluet.
- Potong: tutup potongan memakai sisi belakang berwarna merah (bukan stencil).
- Sorot: bagian terpilih memakai material berpendar merah; tanpa postprocessing Outline.
- Keadaan tampilan: store Zustand menulis ke hash lewat `history.replaceState`.
- Simulasi: rasio gigi tidak diambil dari pabrikan; parameter model ada di `src/lib/sim/params.ts`.
- Nama akhir proyek: SealMaxxing. Hosting: GitHub Pages lewat GitHub Actions.

## Masalah terbuka

- Kemiripan bodi masih pada tingkat ilustrasi: proporsi, warna, dan ciri utama tiap mobil dikenali, tetapi permukaannya belum sehalus model hasil pahat. Muka depan Seal masih polos.
- Kaca tembus pandang memperlihatkan rangka kabin ilustratif di dalamnya.
- Kurva downforce LaFerrari diekstrapolasi dari satu titik yang belum terverifikasi.
- Sakelar posisi sayap di Adu hanya mengubah gambar, tidak mengubah angka.
- Belum ada berkas `LICENSE`; lisensi kode menunggu keputusan pemilik.

## Data yang belum terverifikasi

- Seal: tingkat transmisi 1.
- LaFerrari: downforce ± 360 kg pada 200 km/jam.
- P1: putaran maksimum ± 8.250 rpm, tangki 72 L.
- Senna: putaran maksimum ± 8.500 rpm, tangki 72 L.
- Tidak dipublikasikan pabrikan (tampil "Tidak dipublikasikan"): Cd LaFerrari dan Senna, massa bak LaFerrari dan Senna, bagasi LaFerrari dan Senna, massa baterai dan diameter cakram Seal.
