# Kredit

## Aset

| Aset | Asal | Lisensi |
|---|---|---|
| Model 3D keempat mobil (bodi, kaca, roda, seluruh komponen dalam) | Dibuat sendiri secara prosedural di `src/scene/procedural/` dari dimensi yang dipublikasikan | Buatan sendiri |
| Gambar statis `public/static/*.webp` | Tangkapan dari model di atas (`scripts/static-cars.mjs`) | Buatan sendiri |
| Ikon `public/favicon.svg` | Dibuat sendiri | Buatan sendiri |
| Pencahayaan studio | Dibangun dari light former di kode; tidak ada HDRI yang diunduh | Buatan sendiri |

Tidak ada model hasil ekstraksi game, tidak ada model unduhan, dan tidak ada logo pabrikan.
Tingkat 1 pada CARSOME.md 4.3 (model eksterior CC0/CC-BY) tidak dipakai: tidak ada model
berlisensi terbuka yang bisa diverifikasi untuk keempat mobil, sehingga jalur prosedural
menjadi satu-satunya sumber.

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

## Pernyataan

Proyek ini bukan produk resmi dan tidak berafiliasi, disponsori, atau disetujui oleh BYD,
Ferrari, atau McLaren. Nama merek dan model dipakai hanya sebagai penyebutan.
