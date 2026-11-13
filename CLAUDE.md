# CarSome

Aplikasi web 3D untuk membedah dan membandingkan empat mobil: BYD Seal Performance AWD
(listrik), Ferrari LaFerrari (hibrida V12), McLaren P1 (hibrida plug-in V8), dan McLaren Senna
(bensin V8). Fokusnya perbandingan antarmobil per bagian. Tema hitam-merah (bred). Tanpa
backend, tanpa API key.

Spesifikasi lengkap ada di CARSOME.md. Di awal setiap sesi, jalankan prosedur lanjut di
CARSOME.md bagian 1.2.

## Perintah

- `npm run dev` — server pengembangan (port 5173)
- `npm run build` — tsc + vite build; `npm run preview` — sajikan `dist`
- `npm run lint`, `npm run typecheck`, `npm run test` (vitest), `npm run e2e` (playwright)
- `npm run check:content` — validasi kelengkapan konten dan sumber
- `node scripts/shots.mjs <out.png> '<hash>' [WxH]` — tangkapan layar untuk dinilai

## Aturan keras

1. Git lokal saja sampai pemilik berkata "Publikasikan": tanpa remote, tanpa push.
2. Jangan mengarang angka. Setiap angka dari CARSOME.md Bagian 3 atau punya `sources`; yang
   belum dicek berstatus `verified: false` dan UI menampilkan "perlu verifikasi".
3. Banding hanya bila dasar ukur sama (CARSOME.md 2.6). Dasar berbeda → tampilkan keduanya
   dengan labelnya, tanpa pemenang.
4. Bagian yang tidak ada pada sebuah mobil adalah `presence: absent` dengan alasan, bukan
   angka 0, `null`, atau baris yang dihilangkan.
5. Aset berlisensi jelas (CC0/CC-BY atau buatan sendiri), dicatat di CREDITS.md. Tanpa model
   hasil ekstraksi game. Tanpa logo pabrikan.
6. Komponen dalam berlabel "ilustrasi"; skala antarmobil selalu sebenarnya.
7. Jangan mengubah CARSOME.md.

## Bahasa dan penamaan

- UI berbahasa Indonesia. Kode, nama variabel, komentar, dan pesan commit berbahasa Inggris.
- Teks UI hanya di `src/content/ui.ts`; konten mobil hanya di `src/content/`. Tidak ada
  string tampilan yang ditulis langsung di komponen.
- Komponen `PascalCase.tsx`, satu komponen per berkas; hook `useThing.ts`; lainnya
  `camelCase.ts`. Ekspor bernama, tanpa `export default` kecuali halaman yang dimuat malas.
- ID tetap dan huruf kecil: `CarId` (`seal`, `laferrari`, `p1`, `senna`), `SystemId`,
  `PartId` (kebab-case), `MetricId` (camelCase dengan satuan). Jangan menulis ID sebagai
  string lepas; impor dari `src/content/ids.ts`.
- Node GLB: `<systemId>__<partId>__<indeks>`.

## TypeScript

- `strict` penuh, `noUncheckedIndexedAccess`. Tanpa `any`, tanpa `as` kecuali di batas
  pemuatan data yang langsung divalidasi Zod, tanpa `@ts-ignore`.
- Tipe konten diturunkan dari skema Zod (`z.infer`), tidak ditulis dua kali.
- Angka sebagai `number` dengan satuan di nama field (`kerbKg`, `powerTotalKw`,
  `wheelbaseMm`, `zeroTo100S`). Daya disimpan dalam kW, panjang mm, massa kg, kecepatan km/jam.
- Nilai bersumber selalu `Sourced<T>`; jangan membuka `.value` tanpa membawa `basis` dan
  `verified` sampai ke UI.
- Gabungan terdiskriminasi (`kind`) untuk keadaan; `switch` dengan pemeriksaan lengkap
  (`never`).
- Metrik turunan dihitung di `src/lib/derived.ts`, tidak pernah disimpan di konten.

## Batas modul

- `src/content/` — data dan teks saja, tanpa logika, tanpa impor React atau three.
- `src/lib/` — fungsi murni, tanpa React, tanpa three, tanpa DOM; setiap berkas punya
  `*.test.ts` di sebelahnya.
- `src/scene/` — satu-satunya tempat yang mengimpor three, R3F, atau drei.
- `src/ui/` — komponen tampilan; tidak mengimpor dari `src/scene/`.
- `src/pages/` — merangkai `ui` dan `scene`; dimuat malas per rute.
- `src/store/` — Zustand; keadaan tampilan yang bisa dibagikan disinkronkan dengan hash URL.
- Arah impor: `pages → ui/scene → store → lib → content`. Tidak boleh berbalik.

## React dan 3D

- Komponen fungsi dan hook saja. Ambil dari store dengan selektor sempit.
- Animasi per frame lewat `useFrame` dan ref; jangan `setState` di dalam `useFrame`.
- Jangan membuat objek, vektor, material, atau geometri baru di dalam `useFrame` atau badan
  render; buat sekali dengan `useMemo` atau di tingkat modul.
- Material hanya dari `src/scene/materials.ts`; tidak ada warna heksadesimal di komponen scene.
- Buang (`dispose`) geometri dan tekstur buatan sendiri saat komponen dilepas.
- `frameloop="demand"` dan panggil `invalidate()` saat ada perubahan.
- Satu kanvas dengan beberapa viewport untuk tata letak berjajar.
- Hormati `prefers-reduced-motion`: transisi menjadi perpindahan langsung.

## Gaya dan tema

- Tailwind v4 dengan token di `src/styles/theme.css`. Hanya token (`bg-surface`,
  `text-accent`); tanpa warna heksadesimal atau nilai sembarang di kelas.
- Palet bred: hitam, abu gelap, satu merah aksen, kuning hanya untuk "perlu verifikasi".
- Penanda mobil di grafik: `seal` putih, `laferrari` merah terang, `p1` merah tua, `senna`
  abu terang, selalu disertai pola isian dan label langsung. Ambil dari
  `src/content/carMarks.ts`.
- Angka tampil lewat `src/lib/format.ts` (`Intl.NumberFormat('id-ID')`), angka tabular di
  tabel, satuan selalu ikut.

## Aksesibilitas

Semua yang bisa diklik di 3D punya padanan di daftar yang bisa dijangkau keyboard; fokus
terlihat; kontras AA; grafik punya tabel padanan; gambar dan kanvas punya deskripsi teks.

## Pengujian dan selesai

- Logika baru di `lib/` datang bersama tesnya. Perbaikan bug datang bersama tes yang gagal
  sebelum perbaikan.
- Tampilan 3D dianggap selesai setelah tangkapan layar desktop dan ponsel diperiksa.
- Conventional Commits; tag `m0` … `m9`. Checkpoint: typecheck + test lolos → commit →
  perbarui `docs/PROGRESS.md` → commit `chore: checkpoint`.
- **Commit kecil dan sering:** satu bagian kecil yang utuh = satu commit (satu berkas konten,
  satu komponen, satu fungsi beserta tesnya). Jangan menumpuk banyak perubahan dalam satu commit.
- **Tanpa atribusi Claude:** pesan commit dan deskripsi PR tidak boleh memuat
  `Co-Authored-By: Claude`, "Generated with Claude Code", atau penyebutan Claude/Anthropic
  lainnya. Penulis commit hanya pemilik repo (identitas git lokal).
- Prettier dan ESLint tanpa peringatan; jangan mematikan aturan lint per baris tanpa komentar
  alasan.
