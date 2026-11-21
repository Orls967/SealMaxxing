# Kredit

## Aset

| Aset                                                              | Asal                                                                                                | Lisensi         |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------- |
| Model 3D bodi luar keempat mobil (`public/models/*.glb`)          | Sketchfab, diolah dengan `scripts/build-models.mjs`; rincian di bawah                               | CC BY 4.0       |
| Komponen dalam, bodi cadangan, roda dan ban Senna                 | Dibuat sendiri secara prosedural di `src/scene/procedural/`                                         | Buatan sendiri  |
| Klip audio `public/sounds/*`                                      | Dipotong dan dinormalisasi dari rekaman terbuka; detail sumber dan perbedaan model dicatat di bawah | CC0 / CC BY 3.0 |
| Suara sintetis cadangan (dipakai hanya bila rekaman gagal dimuat) | Dibangkitkan dengan Web Audio (`src/ui/sound/engineVoice.ts`)                                       | Buatan sendiri  |
| Tangkapan layar `docs/screenshots/*.png`                          | Tangkapan dari situs yang tayang                                                                    | Buatan sendiri  |
| Gambar statis `public/static/*.webp`                              | Tangkapan dari model di atas (`scripts/static-cars.mjs`)                                            | Buatan sendiri  |
| Ikon `public/favicon.svg`                                         | Dibuat sendiri                                                                                      | Buatan sendiri  |
| Pencahayaan studio                                                | Dibangun dari light former di kode; tidak ada HDRI yang diunduh                                     | Buatan sendiri  |

## Model 3D

Model bodi diunduh dari Sketchfab dengan lisensi [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Berkas mentahnya disimpan lokal di `model/glb/` (tidak masuk repositori); yang tayang adalah hasil
olah `scripts/build-models.mjs`.

| Mobil     | Model                                                                                             | Pembuat       |
| --------- | ------------------------------------------------------------------------------------------------- | ------------- |
| Seal      | [2024 BYD Seal Performance AWD](https://sketchfab.com/3d-models/96ec5c34852f4c3090a755d4445f5e98) | Nazh Design   |
| LaFerrari | [Ferrari Laferrari](https://sketchfab.com/3d-models/006a4b4047754c35aa5ed0366bff3b49)             | Res1n         |
| P1        | [McLaren P1](https://sketchfab.com/3d-models/e791b5aee5c6497c83994f4e5f1db84b)                    | hartwelkisaka |
| Senna     | [McLaren senna](https://sketchfab.com/3d-models/f3ada11a4618463cac2e082c008cc340)                 | hartwelkisaka |

Perubahan yang dibuat proyek ini: diputar dan diskalakan ke panjang sebenarnya, poros roda
diukur pada model, segitiga dipecah ke bagian aplikasi (panel bodi, pintu, kaca, lampu, roda, ban,
sayap), jaring disederhanakan dan dikompresi, tekstur dibuang, emblem pabrikan dibuang, dan
warna diganti dengan warna acuan atau livery tema. Model LaFerrari aslinya berwarna hitam. Model
Senna tidak menyertakan ban; roda dan bannya digambar oleh aplikasi.

Asal-usul: model P1 dan Senna dinyatakan pembuatnya sebagai karya sendiri. Asal-usul model Seal
("dikonversi dari SketchUp") dan LaFerrari tidak bisa dipastikan; keduanya dipakai atas dasar
label CC BY di Sketchfab, dengan persetujuan pemilik proyek, dan akan diganti bila ada keberatan.
Model yang jelas berasal dari ekstraksi game (CSR Racing 2, Assetto Corsa) sengaja tidak dipakai.
Tidak ada logo pabrikan yang ditampilkan.

## Rekaman suara

Semua klip dipotong menjadi 5–7 detik, dinormalisasi, dan dikonversi ke MP3 untuk proyek ini.
Klip Freesound generik dipakai sebagai pengganti dan bukan rekaman model mobil pada nama berkasnya;
rekaman P1 dan LaFerrari dari Commons adalah model yang disebutkan:

| Berkas                                                        | Rekaman sumber                                                                                                                                                                                               | Lisensi dan perubahan                                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `public/sounds/seal-accel.mp3`                                | [“Acceleration of an electric car”](https://freesound.org/people/justVova/sounds/761685/) — justVova; sumbernya Tesla Model S Plaid, bukan BYD Seal                                                          | CC0; pratinjau MP3 dipangkas dan dinormalisasi. Dipakai sebagai pengganti dengung motor listrik saat akselerasi.   |
| `public/sounds/senna-idle.mp3`, `public/sounds/senna-rev.mp3` | [“Supercar rev”](https://freesound.org/people/richwise/sounds/478756/) — richwise; model mobil tidak diketahui                                                                                               | CC0; bagian langsam dan rev dipangkas lalu dinormalisasi. Bukan rekaman McLaren Senna.                             |
| `public/sounds/p1-idle.mp3`, `public/sounds/p1-rev.mp3`       | [“McLaren P1 — engine and exhaust sound”](<https://commons.wikimedia.org/wiki/File:McLaren_P1_-_engine_and_exhaust_sound_(YouTube_M1xuT1ue10c).opus>) — audio video YouTube oleh Alfisti J                   | CC BY 3.0; dipotong dan dikonversi ke MP3. Halaman Commons saat pengambilan masih bertanda perlu tinjauan lisensi. |
| `public/sounds/laferrari-idle.mp3`                            | [“Ferrari_motor_idle”](https://freesound.org/people/jtvdb/sounds/857147/) — jtvdb; model Ferrari tidak diketahui                                                                                             | CC0; dipangkas dan dinormalisasi. Bukan rekaman LaFerrari.                                                         |
| `public/sounds/laferrari-rev.mp3`                             | [“Ferrari LaFerrari — engine and exhaust sound”](<https://commons.wikimedia.org/wiki/File:Ferrari_LaFerrari_-_engine_and_exhaust_sound_(YouTube_miX50gTQndk).opus>) — audio video YouTube oleh Erwin Lindsen | CC BY 3.0; dipotong dan dikonversi ke MP3. Halaman Commons saat pengambilan masih bertanda perlu tinjauan lisensi. |

Audio McLaren Senna spesifik yang ditemukan di YouTube tidak dipakai karena lisensi penggunaan ulangnya
tidak dapat diverifikasi. Rekaman CC BY Commons di atas menampilkan lisensi CC BY 3.0, tetapi juga
memiliki penanda tinjauan lisensi yang belum selesai.

## Gambar acuan

Bentuk dan warna bawaan tiap mobil disusun dengan melihat foto acuan yang disimpan pemilik
proyek di folder lokal `model/`. Foto itu milik pihak ketiga, tidak masuk repositori
(`.gitignore`), dan tidak pernah dimuat oleh aplikasi.

## Huruf

Tidak ada berkas huruf yang disertakan. Antarmuka memakai huruf sistem (`Avenir Next
Condensed` / `Arial Narrow` untuk judul, `Inter` / `Helvetica Neue` / huruf sistem untuk teks).

## Pustaka

React, React Router, three.js, @react-three/fiber, @react-three/drei, Zustand, d3-scale,
d3-shape, Zod, Tailwind CSS, Vite, Vitest, Playwright, Testing Library, sharp. Semuanya
berlisensi MIT, ISC, BSD, atau Apache-2.0; lihat `package.json` dan lisensi tiap paket.

## Data

Sumber tiap angka tercantum di `src/content/sources.ts` dan tampil di halaman Data. Angka
yang belum dicek ke sumber berstatus `verified: false` dan ditandai "perlu verifikasi".

Harga peluncuran: BYD Seal dari Zigwheels Indonesia dan Moladin (OTR Jakarta); LaFerrari dari
Autoblog dan CarGurus (MSRP pasar AS); McLaren P1 dari siaran pers McLaren (PR Newswire) dan
Autoblog; McLaren Senna dari lembar media McLaren. Perkiraan rupiah memakai kurs tetap
$1 = Rp18.100 yang ditetapkan pemilik proyek pada 14 November 2026 (`src/content/fx.ts`).

## Pernyataan

Proyek ini bukan produk resmi dan tidak berafiliasi, disponsori, atau disetujui oleh BYD,
Ferrari, atau McLaren. Nama merek dan model dipakai hanya sebagai penyebutan.
