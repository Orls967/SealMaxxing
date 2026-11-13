# CarSome

Aplikasi web 3D untuk membedah dan membandingkan empat mobil dengan empat filosofi penggerak:

| Mobil | Jenis |
|---|---|
| BYD Seal Performance AWD | Listrik baterai |
| Ferrari LaFerrari | Hibrida V12 |
| McLaren P1 | Hibrida plug-in V8 twin-turbo |
| McLaren Senna | Bensin V8 twin-turbo |

Fokusnya perbandingan per bagian: penjelasan sebuah bagian selalu tampil di samping padanannya
di tiga mobil lain. Tanpa backend, tanpa akun, tanpa API key.

> Bukan produk resmi. Tidak berafiliasi dengan BYD, Ferrari, atau McLaren. Model 3D adalah
> ilustrasi skematis buatan sendiri, bukan CAD pabrikan; skala antarmobil sebenarnya.

## Halaman

| Rute | Isi |
|---|---|
| `#/` | Garasi: empat mobil berjajar pada skala sebenarnya |
| `#/bedah/:carId` | Kupas lapisan, ledak, potong, sinar-X, panel bagian dengan strip banding |
| `#/banding/:systemId?` | 2–4 mobil berjajar atau ditumpuk, kamera sinkron, sorot sistem, baris banding |
| `#/data` | Tabel induk, grafik, varian khusus sirkuit, sumber, ekspor CSV |
| `#/adu` | Simulasi akselerasi, pengereman, downforce, dan aliran energi |
| `#/glosarium`, `#/tentang` | Istilah, metode, batasan, kredit |

Seluruh keadaan tampilan tersimpan di hash URL, jadi setiap tampilan bisa dibagikan.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build → dist/
npm run preview
```

## Memeriksa

```bash
npm run lint
npm run typecheck
npm run test           # Vitest: lib, konten, komponen, pemetaan node 3D
npm run e2e            # Playwright
npm run check:content  # kelengkapan konten dan sumber
node scripts/shots.mjs out.png '#/banding/energy?xray=1' 1440x900
```

## Aturan data

- Setiap angka punya sumber; yang belum dicek ditandai **perlu verifikasi**.
- Bagian yang tidak ada pada sebuah mobil ditulis "tidak ada pada mobil ini" beserta alasannya,
  bukan angka nol.
- Pemenang hanya ditandai bila dasar ukurnya sama. Dasar berbeda → kedua angka tampil dengan
  labelnya, tanpa pemenang.
- Simulasi berlabel "model sederhana", dikalibrasi supaya 0–100 dan 0–200 km/jam berada dalam
  ±5% dari klaim pabrikan, dan selalu tampil di samping klaimnya.

## Struktur

```
src/content/   data dan teks (tanpa logika)
src/lib/       fungsi murni + tes (banding, turunan, simulasi, format, CSV)
src/scene/     semua three.js / React Three Fiber
src/ui/        komponen tampilan
src/pages/     satu berkas per rute, dimuat malas
src/store/     Zustand, disinkronkan dengan hash URL
```

Spesifikasi lengkap ada di `CARSOME.md`, aturan kode di `CLAUDE.md`, kredit di `CREDITS.md`.
