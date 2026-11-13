# CARSOME.md — instruksi tunggal untuk Claude Code

Spesifikasi lengkap proyek **CarSome** (nama kerja): aplikasi web 3D untuk membedah dan
membandingkan empat mobil. Isinya: cara kerja (Bagian 1), spesifikasi produk (Bagian 2), data
mobil (Bagian 3), arsitektur (Bagian 4), roadmap (Bagian 5), publikasi (Bagian 6).
Aturan penulisan kode ada di `CLAUDE.md`.

## Bagian 0 — Untuk pemilik proyek (manusia)

1. Buka terminal di folder ini, jalankan `claude`, tempel:

   ```
   Baca CARSOME.md sampai habis, lalu kerjakan semuanya berurutan dari M0
   sampai M9 tanpa berhenti, sesuai Bagian 1.
   ```
2. Sesi terputus karena limit → buka `claude` lagi, ketik `Lanjut dari checkpoint terakhir.`
3. Siap online → ketik `Publikasikan.`

Tiga keputusan yang sudah diambil di dokumen ini dan boleh kamu ubah sebelum mulai:

| Keputusan | Pilihan sekarang | Alternatif |
|---|---|---|
| Arti "spek tertinggi" | Varian **legal jalan raya** tertinggi jadi model 3D utama; varian sirkuit (FXX K Evo, P1 GTR, Senna GTR) hanya sebagai kartu data "varian ekstrem" | Varian sirkuit jadi model utama |
| Warna bred | Satu livery tema hitam-merah untuk keempat mobil, diberi label "livery tema" bila bukan warna pabrik | Hanya warna pabrik |
| Nama | "CarSome" adalah nama kerja. Carsome juga merek jual-beli mobil bekas, jadi ganti nama sebelum publikasi | — |

---

# Bagian 1 — Cara kerja (wajib diikuti Claude Code)

## 1.1 Satu alur tanpa henti

- Kerjakan M0 → M9 (Bagian 5) berurutan. Selesai satu milestone, langsung lanjut. Jangan
  berhenti untuk melapor atau meminta persetujuan rencana.
- Jangan bertanya untuk hal yang bisa diputuskan sendiri; ambil pilihan paling masuk akal dan
  catat di `docs/PROGRESS.md` bagian "Keputusan".
- Berhenti hanya bila: (1) M9 lolos, (2) buntu pada hal yang hanya bisa diberikan pemilik,
  setelah semua hal lain dikerjakan, (3) limit memutus sesi.
- Sub-tugas gagal setelah tiga pendekatan berbeda → catat di "Masalah terbuka", pasang versi
  sederhana yang berfungsi, lanjut.

## 1.2 Checkpoint dan lanjut setelah limit

- Setiap selesai satu sub-tugas: `typecheck` dan `test` lolos → commit → timpa
  `docs/PROGRESS.md` → commit `chore: checkpoint`.
- Ada tanda limit atau batas konteks mendekat → hentikan pekerjaan baru, tulis checkpoint, beri
  tahu pemilik dalam satu kalimat.
- Format `docs/PROGRESS.md` (ditimpa, bukan ditambah):

  ```
  # PROGRESS
  Diperbarui: <tanggal jam>
  Milestone aktif: M?
  Sub-tugas aktif: <yang sedang dikerjakan>
  Langkah berikut yang persis: <perintah/file/fungsi berikutnya>

  ## Selesai
  ## Keputusan
  ## Masalah terbuka
  ## Data yang belum terverifikasi
  ```
- Prosedur lanjut: baca `docs/PROGRESS.md`, `git status`, `git log -5`, jalankan `typecheck`
  dan `test`, lalu teruskan dari "Langkah berikut yang persis".

## 1.3 Aturan keras

1. **Git lokal saja** sampai pemilik berkata "Publikasikan".
2. **Jangan mengarang angka.** Setiap angka berasal dari Bagian 3 atau punya `sources`. Angka
   yang belum dicek ke sumber berstatus `verified: false` dan UI menampilkan "perlu verifikasi".
3. **Banding yang adil.** Dua angka hanya dibandingkan bila dasar ukurnya sama (lihat 2.6).
   Kalau tidak sama, tampilkan keduanya dengan label dasar ukur, tanpa menyatakan pemenang.
4. **"Tidak berlaku" bukan nol.** Senna tidak punya baterai traksi; Seal tidak punya knalpot.
   Tampilkan "tidak ada pada mobil ini" beserta alasannya, jangan angka 0 atau batang kosong.
5. **Aset berlisensi jelas.** Model 3D hanya dari sumber berlisensi terbuka (CC0/CC-BY) atau
   buatan sendiri; catat di `CREDITS.md`. Dilarang memakai model hasil ekstraksi game atau
   unduhan tanpa lisensi. Tidak dapat model → pakai model prosedural (4.3).
6. **Bukan produk resmi.** Tanpa logo pabrikan. Nama merek dan model hanya sebagai penyebutan,
   dan halaman Tentang memuat pernyataan tidak berafiliasi dengan BYD, Ferrari, atau McLaren.
7. **Jujur soal ilustrasi.** Komponen dalam (mesin, baterai, sasis) adalah ilustrasi skematis;
   beri label "ilustrasi, bukan CAD pabrikan". Skala antarmobil selalu sebenarnya.
8. **Jangan mengubah CARSOME.md.**

## 1.4 Prioritas utama

Urutan prioritas saat harus memilih: (1) perbandingan mudah dibaca, (2) kualitas 3D dan
bedah, (3) kelengkapan data, (4) fitur tambahan. Setiap tampilan 3D diperiksa lewat tangkapan
layar (`scripts/shots.mjs`) sebelum dianggap selesai: mobil terbaca jelas di latar gelap,
bagian terpilih menonjol, tidak ada teks menimpa model, 60 fps di laptop biasa.

## 1.5 Definisi selesai tiap milestone

`lint`, `typecheck`, `test`, `build` lolos; kriteria terima milestone terpenuhi; tangkapan
layar desktop (1440×900) dan ponsel (390×844) diperiksa; `docs/PROGRESS.md` mutakhir; tag `m?`.

---

# Bagian 2 — PRD (Spesifikasi Produk)

## 2.1 Tujuan

Pengguna bisa menjawab dua pertanyaan untuk bagian mana pun dari mobil:
"**ini apa dan bagaimana cara kerjanya?**" dan "**bagaimana bedanya di keempat mobil?**"

BumiLapis berfokus menjelaskan tiap bagian. CarSome berfokus **membandingkan**: penjelasan
bagian selalu tampil berdampingan dengan padanannya di mobil lain.

Empat mobil, empat filosofi penggerak:

| id | Mobil | Jenis | Peran dalam cerita |
|---|---|---|---|
| `seal` | BYD Seal Performance AWD (MY2026) | Listrik baterai (BEV) | Sedan listrik harian, dua motor |
| `laferrari` | Ferrari LaFerrari | Hibrida ringan-berat (V12 + KERS) | Listrik untuk menambah tenaga, tanpa mode EV |
| `p1` | McLaren P1 | Hibrida plug-in (V8 twin-turbo) | Listrik untuk mengisi celah torsi turbo, ada mode EV |
| `senna` | McLaren Senna | Bensin murni (V8 twin-turbo) | Ringan dan downforce, tanpa listrik |

## 2.2 Struktur aplikasi

| Rute | Halaman | Isi |
|---|---|---|
| `#/` | Garasi | Empat mobil berjajar pada skala sebenarnya, angka kunci, pintu masuk ke semua modul |
| `#/bedah/:carId` | Bedah | Satu mobil: kupas lapisan, ledak, potong, sinar-X, klik bagian |
| `#/banding` | Banding | 2–4 mobil berdampingan, kamera sinkron, satu sistem disorot di semua mobil |
| `#/banding/:systemId` | Banding per sistem | Bagian padanan dari tiap mobil, berjajar dan dijelaskan |
| `#/data` | Data | Tabel lengkap semua metrik, grafik, sumber, status verifikasi |
| `#/adu` | Adu | Simulasi akselerasi, pengereman, dan downforce terhadap kecepatan |
| `#/glosarium` | Glosarium | Istilah teknis, tertaut dari semua teks |
| `#/tentang` | Tentang | Metode, batasan, kredit, pernyataan tidak berafiliasi |

Keadaan tampilan (mobil terpilih, sistem, bagian, mode bedah) disimpan di hash URL supaya
setiap tampilan bisa dibagikan dan dipotret.

## 2.3 Modul A — Bedah (satu mobil)

Empat alat bedah, bisa digabung:

1. **Kupas lapisan.** Penggeser dari luar ke dalam: bodi → kaca dan interior → aero dan
   pendingin → sasis → penggerak dan penyimpan energi. Lapisan yang terkupas memudar.
2. **Ledak.** Penggeser 0–100% yang memisahkan komponen sepanjang sumbu alaminya; garis
   penghubung tipis menunjukkan asal tiap komponen.
3. **Potong.** Bidang potong yang bisa digeser pada sumbu memanjang, melintang, dan vertikal;
   permukaan potongan ditutup warna merah tema.
4. **Sinar-X.** Bodi menjadi siluet tembus pandang; sistem terpilih menyala merah.

Interaksi: seret untuk memutar, gulir untuk zoom, klik bagian untuk memilih, klik ganda untuk
fokus. Daftar sistem di sisi kiri menjadi padanan keyboard untuk semua yang bisa diklik.
Tombol preset kamera: depan, samping, atas, tiga-perempat, bawah.

Panel bagian (kanan, atau lembar bawah di ponsel) memuat: nama, satu kalimat fungsi, cara
kerja (3–5 kalimat), angka kunci, "kenapa dirancang begini", dan **strip banding**: bagian
padanan di tiga mobil lain dengan satu angka pembeda dan tombol "Bandingkan".

Kriteria terima: setiap bagian di 3.4 bisa dipilih lewat klik dan lewat keyboard; keempat alat
bekerja di keempat mobil; panel tidak pernah menutupi bagian terpilih.

## 2.4 Modul B — Banding (inti aplikasi)

- **Pemilih mobil:** 2, 3, atau 4 mobil. Bawaan: keempatnya.
- **Tata letak:** berjajar (viewport terbagi) atau **tumpuk** (siluet tembus pandang
  ditumpuk pada titik acuan sama: poros depan, tengah wheelbase, atau tanah) untuk melihat
  beda ukuran, tinggi, dan posisi komponen.
- **Kamera sinkron:** memutar satu mobil memutar semuanya; bisa dimatikan.
- **Sorot sistem:** memilih satu sistem (mis. "penyimpan energi") menyalakannya di semua
  mobil sekaligus, sisanya menjadi sinar-X. Ini tampilan utama: terlihat langsung bahwa
  baterai Seal mengisi seluruh lantai, sedangkan baterai LaFerrari sebesar koper di belakang
  kursi.
- **Baris banding:** di bawah viewport, satu baris per metrik sistem itu: batang horizontal
  per mobil pada sumbu yang sama, nilai, satuan, dasar ukur, dan tanda yang terbaik bila
  metriknya punya arah "lebih baik" yang jelas.
- **Kalimat ringkas:** satu sampai dua kalimat hasil banding yang ditulis tangan per sistem
  (bukan dibangkitkan otomatis), mis. "P1 membawa baterai dua kali kapasitas LaFerrari karena
  harus bisa berjalan listrik murni."

Kriteria terima: berpindah sistem tidak memuat ulang model; di ponsel tata letak berjajar
menjadi geser-horizontal dua mobil; setiap metrik menampilkan dasar ukurnya.

## 2.5 Modul C — Data

- **Tabel induk:** baris = metrik (dikelompokkan per sistem), kolom = mobil. Bisa dicari,
  diurutkan, dan disaring per sistem. Sel menampilkan nilai, satuan, dan ikon status sumber.
- **Grafik:** batang berdampingan untuk satu metrik; radar untuk profil ternormalisasi
  (akselerasi, kecepatan puncak, daya per berat, downforce, pengereman, praktis harian);
  sebar daya-terhadap-berat; kurva downforce terhadap kecepatan.
- **Metrik turunan** dihitung di kode, tidak disimpan: daya per ton, torsi per ton, porsi
  daya listrik, energi baterai per kg, harga per kW, berat per meter panjang.
- **Varian ekstrem:** sakelar yang menambahkan FXX K Evo, P1 GTR, dan Senna GTR sebagai kolom
  data tambahan (tanpa model 3D), berlabel "khusus sirkuit".
- Ekspor tabel yang sedang tampil ke CSV.

## 2.6 Aturan banding yang adil

| Hal | Aturan |
|---|---|
| Berat | Simpan `dryKg` dan `kerbKg` terpisah. Banding bawaan memakai berat siap jalan (kerb); berat kering hanya dibandingkan dengan berat kering |
| Daya | Simpan dalam kW; tampil kW dan PS. Daya gabungan hibrida bukan jumlah sederhana mesin + motor kecuali pabrikan menyatakannya |
| Akselerasi | 0–100, 0–200, 0–300 km/jam dari klaim pabrikan; catat bila klaim berupa "kurang dari" |
| Jarak tempuh | Selalu dengan siklus uji (WLTP/NEDC/CLTC). Siklus berbeda tidak dibandingkan langsung |
| Downforce | Selalu dengan kecepatan ukurnya; banding hanya lewat kurva di 4.6, berlabel perkiraan |
| Harga | Harga peluncuran, mata uang asli dan tahun; konversi rupiah berlabel perkiraan dengan tanggal kurs |
| Era | Tampilkan tahun produksi di kepala kolom: tiga hypercar 2013–2019, Seal 2026 |

## 2.7 Modul D — Adu (simulasi)

1. **Akselerasi:** lintasan lurus tampak samping, empat mobil, penghitung waktu, grafik
   kecepatan-waktu dan jarak-waktu. Pilihan jarak: 0–100, 0–200, 0–300 km/jam, 402 m, 1 km.
   Terlihat Seal unggul di meter-meter awal berkat AWD lalu tertinggal jauh di kecepatan tinggi.
2. **Pengereman:** 100–0 dan 200–0 km/jam, dengan kontribusi downforce terhadap cengkeraman.
3. **Downforce terhadap kecepatan:** penggeser kecepatan; panah gaya di atas tiap mobil
   membesar; sayap aktif berubah posisi (mode DRS dan rem udara).
4. **Aliran energi:** diagram per mobil tentang dari mana tenaga datang dan ke roda mana
   pergi saat akselerasi, melaju, dan mengerem (regenerasi).

Semua simulasi berlabel "model sederhana" dan menampilkan klaim pabrikan di samping hasil
model. Model dikalibrasi supaya 0–100 dan 0–200 berada dalam ±5% dari klaim (4.6).

## 2.8 Tema visual: bred

- Latar hitam, permukaan abu sangat gelap, satu warna aksen merah. Tanpa warna lain kecuali
  status (kuning untuk "perlu verifikasi").
- Suasana studio gelap: lantai reflektif redup, lampu strip merah, rim light putih supaya
  bodi hitam tetap terbaca bentuknya. Bodi hitam tanpa rim light adalah kegagalan (1.4).
- **Livery tema:** bodi hitam mengilap, aksen merah pada kaliper, garis bodi, jahitan
  interior, dan elemen aero. Untuk LaFerrari tersedia varian kedua, bodi merah atap hitam,
  karena itu kombinasi pabrik yang paling dikenal. Label kecil "livery tema" bila bukan
  warna pabrik.
- **Membedakan empat mobil tanpa warna pelangi:** tiap mobil punya penanda tetap yang
  dipakai di semua grafik: `seal` putih, `laferrari` merah terang, `p1` merah tua, `senna`
  abu terang; ditambah pola isian dan label langsung pada batang atau garis, sehingga
  grafik tetap terbaca tanpa bergantung pada warna.
- Tipografi: satu sans lebar untuk judul dan angka besar, satu sans netral untuk teks, angka
  tabular di semua tabel.

## 2.9 Non-fungsional

- Tanpa backend, tanpa akun, tanpa API key; bisa disajikan sebagai berkas statis.
- UI berbahasa Indonesia. Keyboard penuh, kontras AA, hormati `prefers-reduced-motion`,
  setiap tampilan 3D punya padanan teks (daftar sistem dan tabel).
- Muatan awal Garasi di bawah 3 MB; model tiap mobil dimuat saat diperlukan dengan
  indikator kemajuan; target 60 fps di laptop grafis terintegrasi, 30 fps di ponsel menengah.
- WebGL tidak tersedia → halaman Data dan Banding per sistem tetap berfungsi dengan gambar
  statis.

## 2.10 Di luar lingkup versi awal

Simulasi waktu putaran sirkuit, suara mesin, mode AR/VR, konfigurator warna bebas, mobil
kelima, model 3D untuk varian sirkuit, data dari API langsung.

---

# Bagian 3 — Data mobil

Status data: angka di bagian ini adalah **data awal** yang disusun dari ingatan umum dan
pencarian singkat, sehingga semuanya masuk ke kode sebagai `verified: false`. M2 bertugas
mengecek tiap angka ke sumber di 3.6 lalu mengubah statusnya. Angka bertanda **(?)** paling
perlu dicek. Bila sumber berbeda dari tabel ini, sumber yang menang; catat perubahannya di
`docs/PROGRESS.md`.

## 3.1 Identitas

| | Seal Performance AWD | LaFerrari | McLaren P1 | McLaren Senna |
|---|---|---|---|---|
| Tahun produksi | MY2026 (generasi sejak 2022) | 2013–2016 (Aperta 2016–2018) | 2013–2015 | 2018–2019 |
| Jumlah unit | Produksi massal | 499 coupe + 210 Aperta (?) | 375 | 500 |
| Bentuk | Sedan 4 pintu, 5 kursi | Coupe 2 kursi | Coupe 2 kursi | Coupe 2 kursi |
| Tata letak | Dua motor, AWD | Mesin tengah-belakang, RWD | Mesin tengah-belakang, RWD | Mesin tengah-belakang, RWD |
| Harga peluncuran | ± Rp750 juta (Indonesia, 2026) | ± €1,3 juta (?) | £866.000 | £750.000 |
| Varian ekstrem | — | FXX K Evo: 1.050 PS, khusus sirkuit | P1 GTR: 1.000 PS, khusus sirkuit | Senna GTR: 825 PS, khusus sirkuit |

## 3.2 Penggerak dan energi

| | Seal | LaFerrari | P1 | Senna |
|---|---|---|---|---|
| Mesin bakar | Tidak ada | V12 6.262 cc, tanpa turbo | V8 3.799 cc, twin-turbo | V8 3.994 cc, twin-turbo |
| Daya mesin | — | 588 kW (800 PS) pada 9.000 rpm | 542 kW (737 PS) pada 7.500 rpm | 588 kW (800 PS) pada 7.250 rpm |
| Torsi mesin | — | 700 Nm | 720 Nm | 800 Nm |
| Putaran maksimum | — | 9.250 rpm | 8.250 rpm (?) | 8.500 rpm (?) |
| Motor listrik | Depan induksi 160 kW; belakang magnet permanen 230 kW | 1 motor 120 kW (HY-KERS) | 1 motor 132 kW, 260 Nm | Tidak ada |
| Daya gabungan | 390 kW (530 PS) | 708 kW (963 PS) | 674 kW (916 PS) | 588 kW (800 PS) |
| Torsi gabungan | 670 Nm | > 900 Nm | 900 Nm | 800 Nm |
| Baterai traksi | 82,56 kWh, LFP Blade, menyatu dengan bodi (CTB) | ± 2,3 kWh (?), ± 60 kg | 4,7 kWh, 96 kg | Tidak ada |
| Tegangan sistem | ± 550–570 V (?) | (?) | (?) | 12 V saja |
| Colok listrik | Ya: DC 150 kW, AC 11 kW (?) | Tidak | Ya | Tidak |
| Jarak listrik murni | 520 km WLTP (klaim Indonesia 580 km NEDC) | 0, tidak ada mode EV | ± 11 km (NEDC) (?) | 0 |
| Tangki bensin | — | 86 L (?) | 72 L (?) | 72 L (?) |
| Transmisi | Reduksi satu tingkat per motor | Kopling ganda 7 tingkat | Kopling ganda 7 tingkat | Kopling ganda 7 tingkat |

Peran listrik, bahan utama kalimat banding:

- **Seal:** listrik adalah satu-satunya sumber tenaga. Motor depan induksi bisa berputar
  bebas tanpa hambatan magnet saat tidak dipakai; motor belakang magnet permanen bekerja
  hampir sepanjang waktu.
- **LaFerrari:** motor menambah tenaga dan mengisi torsi di putaran rendah supaya V12 bisa
  disetel untuk putaran tinggi. Baterai diisi dari pengereman dan dari kelebihan torsi mesin.
- **P1:** motor mengisi jeda turbo ("torque fill") dan memberi dorongan sesaat lewat tombol
  IPAS; baterai bisa dicolok dan mobil bisa berjalan listrik murni.
- **Senna:** tidak ada listrik traksi. Bobot yang dihemat menjadi senjata utamanya.

## 3.3 Sasis, dimensi, aero, rem, kinerja

| | Seal | LaFerrari | P1 | Senna |
|---|---|---|---|---|
| Struktur | Monokok baja dan aluminium, baterai jadi lantai (CTB) | Bak serat karbon, empat jenis serat | Serat karbon MonoCage, ± 90 kg | Serat karbon Monocage III |
| Panjang × lebar × tinggi (mm) | 4.800 × 1.875 × 1.460 | 4.702 × 1.992 × 1.116 | 4.588 × 1.946 × 1.188 | 4.744 × 1.958 × 1.229 |
| Jarak sumbu roda (mm) | 2.920 | 2.650 | 2.670 | 2.670 |
| Berat kering (kg) | — | 1.255 | 1.395 | 1.198 |
| Berat siap jalan (kg) | ± 2.185 | ± 1.585 (?) | ± 1.547 (?) | ± 1.309 (?) |
| Suspensi | Wishbone ganda depan, lima-link belakang, peredam pasif atau adaptif (?) | Wishbone ganda depan, multilink belakang, peredam magnetoreologis | Hidropneumatik saling terhubung (RCC), tanpa stabilizer; mode Race turun 50 mm | Hidropneumatik RCC II, tinggi dan kekakuan variabel |
| Rem | Cakram baja berventilasi, regeneratif | Karbon-keramik 398 / 380 mm | Karbon-keramik berlapis silikon karbida 390 / 380 mm | Karbon-keramik CCM-R 390 mm |
| Ban depan / belakang | 235/45 R19 keduanya | 265/30 R19 / 345/30 R20 | 245/35 R19 / 315/30 R20 | 245/35 R19 / 315/30 R20 |
| Koefisien hambat | Cd 0,219 | (?) | Cd 0,34 (?) | (?) |
| Downforce | Tidak dirancang untuk downforce | ± 360 kg pada 200 km/jam (?) | 600 kg pada 257 km/jam | 800 kg pada 250 km/jam |
| Aero aktif | Tidak | Flap depan, diffuser, spoiler belakang | Sayap belakang naik sampai 300 mm, DRS, flap depan | Sayap belakang dan bilah depan aktif, rem udara |
| 0–100 km/jam (dtk) | 3,8 | < 3,0 | 2,8 | 2,8 |
| 0–200 km/jam (dtk) | — | < 7,0 | 6,8 | 6,8 |
| 0–300 km/jam (dtk) | — | 15,0 | 16,5 | 17,5 |
| Kecepatan puncak (km/jam) | 180, dibatasi | > 350 | 350, dibatasi | 335 |
| Kursi / bagasi | 5 kursi; 400 L + 53 L depan | 2 kursi; nyaris tanpa bagasi | 2 kursi; ± 120 L (?) | 2 kursi; ruang dua helm |

## 3.4 Taksonomi bagian (sama untuk keempat mobil)

Setiap bagian punya `id` yang sama di keempat mobil supaya bisa dipasangkan. Mobil yang tidak
memiliki bagian itu tetap punya entri berisi alasan ketiadaannya.

| Sistem (`systemId`) | Bagian (`partId`) |
|---|---|
| `body` Bodi | `body-panels`, `doors` (pintu biasa / kupu-kupu / dihedral), `glass`, `lights` |
| `structure` Struktur | `tub` (monokok atau bak karbon), `subframes`, `crash-structure` |
| `powertrain` Penggerak | `engine`, `induction` (turbo, intake), `motor-front`, `motor-rear`, `transmission`, `driveline` |
| `energy` Penyimpan energi | `battery`, `fuel-tank`, `power-electronics`, `charge-port` |
| `thermal` Pendingin | `radiators`, `battery-cooling`, `air-paths` |
| `exhaust` Pembuangan | `exhaust` |
| `suspension` Suspensi | `suspension-front`, `suspension-rear`, `steering` |
| `brakes` Rem | `discs`, `calipers`, `regen` (pengereman regeneratif), `air-brake` |
| `wheels` Roda | `wheels`, `tires` |
| `aero` Aerodinamika | `front-aero`, `underbody` (lantai, diffuser), `rear-wing`, `active-aero` |
| `cabin` Kabin | `seats`, `dashboard`, `controls`, `cargo` |
| `electronics` Elektronik | `drive-modes`, `stability`, `driver-assist` |

Untuk setiap pasangan bagian dan mobil, konten memuat: `summary` (satu kalimat), `howItWorks`
(3–5 kalimat), `whyThisWay` (alasan rancangan, 1–2 kalimat), `keyFacts` (angka dengan
sumber), dan `presence` (`present` | `absent` beserta alasan). Untuk setiap bagian, satu
`comparison` tulisan tangan (1–2 kalimat) yang merangkum beda keempat mobil.

## 3.5 Cerita banding yang wajib ada

1. **Di mana energi disimpan:** 82,56 kWh di lantai (Seal), 2,3 kWh di belakang kursi
   (LaFerrari), 4,7 kWh (P1), hanya bensin (Senna); bandingkan volume, massa, dan posisinya.
2. **Tiga cara memakai listrik:** satu-satunya sumber, penambah tenaga, pengisi jeda turbo.
3. **Daya per ton:** Senna mengalahkan P1 dan mendekati LaFerrari dengan daya paling kecil di
   antara ketiganya, karena beratnya paling ringan; Seal paling berat hampir satu ton.
4. **Awal lawan akhir:** AWD dan torsi instan membuat Seal dekat di 0–100, lalu selisih
   melebar tajam di 0–200.
5. **Baja lawan karbon:** monokok baja dengan baterai struktural lawan bak serat karbon.
6. **Downforce:** 0, ± 360, 600, 800 kg, dan harga yang dibayar Senna berupa kecepatan puncak
   paling rendah di antara tiga hypercar.
7. **Rem:** regenerasi mengembalikan energi di Seal; tiga lainnya membuangnya sebagai panas
   pada cakram karbon-keramik (LaFerrari dan P1 mengambil sebagian lewat motor).
8. **Praktis harian:** kursi, bagasi, jarak tempuh, biaya energi per km, harga.

## 3.6 Sumber untuk verifikasi (M2)

Urutan prioritas: (1) siaran pers dan lembar spesifikasi resmi pabrikan (BYD Indonesia dan
BYD global untuk Seal MY2026; media.ferrari.com; cars.mclaren.press), (2) buku manual pemilik,
(3) uji media otomotif besar, (4) ensiklopedia sebagai penunjuk arah saja. Setiap `sources`
berisi judul, penerbit, URL, dan tanggal akses. Spesifikasi Seal berbeda antarpasar: pakai
pasar Indonesia sebagai acuan, dan catat bila sebuah angka berasal dari pasar lain.

---

# Bagian 4 — Arsitektur Teknis

## 4.1 Stack

Vite + React + TypeScript strict; three.js lewat @react-three/fiber, drei, dan
postprocessing; Zustand; HashRouter; Tailwind v4; grafik SVG sendiri dengan d3-scale dan
d3-shape; Zod; Vitest; Playwright. `base: './'`. Sama dengan BumiLapis supaya pola dan
skripnya bisa dipakai ulang.

## 4.2 Struktur folder

```
src/
  content/        data dan teks (tanpa logika)
    cars/         seal.ts, laferrari.ts, p1.ts, senna.ts
    parts/        satu berkas per systemId: teks per bagian per mobil
    metrics.ts    registri metrik (4.5)
    comparisons.ts kalimat banding tulisan tangan
    glossary.ts, sources.ts, ui.ts
  lib/            logika murni + unit test
    compare.ts    penyelarasan metrik, normalisasi, penentuan terbaik
    derived.ts    metrik turunan
    sim/          accel.ts, brake.ts, downforce.ts
    format.ts     Intl.NumberFormat('id-ID'), satuan
    schema.ts     skema Zod
  scene/          semua three.js
    Studio.tsx    lampu, lantai, lingkungan
    CarModel.tsx  pemuat GLB + pemetaan node → partId
    dissect/      Peel.tsx, Explode.tsx, Cut.tsx, XRay.tsx
    compare/      SideBySide.tsx, Overlay.tsx, SyncedCamera.ts
    procedural/   pembangun model cadangan
  ui/             komponen UI (panel, tabel, grafik, kontrol)
  pages/          satu berkas per rute, dimuat malas
  store/          Zustand: view.ts (pilihan, mode), settings.ts
public/models/    <carId>.glb
scripts/          shots.mjs, optimize-models.mjs, check-content.mjs
docs/             PROGRESS.md
```

## 4.3 Model 3D

- **Satu GLB per mobil**, satuan meter, skala sebenarnya, titik asal di tengah poros depan
  pada permukaan tanah, +X ke belakang mobil, +Y ke atas.
- **Penamaan node:** `<systemId>__<partId>__<indeks>` (mis. `energy__battery__0`). `CarModel`
  membangun peta `partId → Object3D[]` dari nama ini; node tanpa pola ini dianggap bodi.
  Sebuah tes memastikan setiap `partId` berstatus `present` punya minimal satu node.
- **Dua tingkat sumber, dicoba berurutan:**
  1. Model eksterior berlisensi CC0 atau CC-BY, dicatat di `CREDITS.md`, dipecah per bagian.
  2. **Model prosedural** (`scene/procedural/`): bodi dari penampang melintang yang di-loft
     mengikuti dimensi 3.3 dan siluet tiap mobil; roda, cakram, sayap dari primitif.
  Tingkat 2 adalah jalur bawaan dan harus selesai lebih dulu, supaya aplikasi tidak pernah
  bergantung pada unduhan.
- **Komponen dalam selalu buatan sendiri** dan skematis: blok mesin dengan jumlah silinder
  benar (V12 atau V8), turbo, motor, paket baterai sesuai ukuran dan posisi, bak karbon,
  lengan suspensi, tangki, radiator, knalpot. Ukuran dan posisi mengikuti data; detail halus
  tidak diklaim akurat.
- **Anggaran:** ≤ 150 ribu segitiga dan ≤ 4 MB per mobil setelah `optimize-models.mjs`
  (gltf-transform: meshopt, tekstur KTX2, dedup). Dua tingkat detail; tata letak empat mobil
  memakai tingkat rendah.
- **Material:** satu pustaka material bersama (`scene/materials.ts`) untuk cat hitam, cat
  merah, serat karbon, kaca, karet, logam, cakram keramik, dan material sinar-X, supaya
  keempat mobil serasi dan livery bisa diganti tanpa menyentuh model.

## 4.4 Teknik bedah

- **Kupas:** tiap sistem punya `layerIndex`; opasitas material diturunkan per lapisan.
- **Ledak:** tiap bagian punya `explodeDir` dan `explodeDist` di konten; posisi =
  asal + arah × jarak × t. Animasi lewat `useFrame` dengan pegas teredam, bukan state React.
- **Potong:** `clippingPlanes` pada material bersama; tutup potongan memakai teknik stencil.
- **Sinar-X:** material fresnel aditif tanpa penulisan kedalaman untuk bodi; bagian tersorot
  memakai material asli ditambah garis tepi (postprocessing Outline).
- **Pemilihan:** raycast pada pointer; sorot saat hover; pilihan disimpan di store dan hash.
- Render sesuai kebutuhan (`frameloop="demand"`), hanya menggambar saat ada perubahan.
- Tata letak berjajar memakai satu kanvas dengan beberapa viewport (drei `View`), bukan
  empat kanvas.

## 4.5 Skema data (TypeScript, divalidasi Zod)

```ts
type CarId = 'seal' | 'laferrari' | 'p1' | 'senna'

interface Sourced<T> {
  value: T
  basis?: string        // 'kerb DIN', 'WLTP', 'klaim pabrikan', 'pada 250 km/jam'
  qualifier?: 'exact' | 'approx' | 'lessThan' | 'greaterThan' | 'limited'
  sources: SourceId[]
  verified: boolean
  market?: string       // 'ID', 'EU', 'global'
}

type Presence =
  | { kind: 'present' }
  | { kind: 'absent'; reason: string }

interface CarPart {
  carId: CarId
  partId: PartId
  presence: Presence
  summary: string
  howItWorks: string
  whyThisWay: string
  keyFacts: { label: string; value: Sourced<number | string>; unit?: Unit }[]
  explodeDir?: [number, number, number]
  explodeDist?: number
}

interface Metric {
  id: MetricId          // 'powerTotalKw', 'kerbKg', 'zeroTo100S'
  systemId: SystemId
  label: string
  unit: Unit
  better: 'higher' | 'lower' | 'none'
  comparableBasis: boolean   // true → hanya dibandingkan bila basis sama
  get: (car: Car) => Sourced<number> | Presence
}
```

Angka disimpan sebagai number dengan satuan di nama field (`kerbKg`, `powerTotalKw`,
`wheelbaseMm`). `scripts/check-content.mjs` dan tes Vitest memastikan: semua mobil punya entri
untuk semua `partId`; semua `SourceId` ada; tidak ada angka tanpa `sources` kecuali berstatus
`verified: false`; semua metrik terdefinisi untuk semua mobil (nilai atau `absent`).

## 4.6 Model simulasi (`lib/sim/`)

Semua fungsi murni dan teruji.

- **Akselerasi:** integrasi langkah waktu 1 ms.
  Gaya dorong = min(gaya traksi, gaya penggerak).
  Gaya traksi = μ × (beban poros penggerak + pindah beban + porsi downforce).
  Gaya penggerak listrik = min(torsi puncak × rasio / jari-jari roda, daya / kecepatan).
  Gaya penggerak mesin bakar = torsi(rpm) × rasio gigi × efisiensi / jari-jari roda, dengan
  kurva torsi yang didekati dari titik daya dan torsi puncak, jeda perpindahan gigi, dan
  tambahan motor untuk hibrida.
  Hambatan = ½ρ·CdA·v² + hambatan gulir.
  Parameter μ dan efisiensi dikalibrasi per mobil supaya 0–100 dan 0–200 berada dalam ±5%
  dari klaim; tes menjaga batas itu.
- **Pengereman:** perlambatan = μ × (g + downforce(v) / massa), dibatasi kapasitas rem.
- **Downforce:** F(v) = F_ref × (v / v_ref)², dari satu titik klaim pabrikan, dibatasi
  nilai maksimum bila pabrikan menyebut pembatasan aktif. Berlabel "perkiraan dari satu titik".
- UI selalu menampilkan klaim pabrikan di samping hasil model.

## 4.7 Pengujian

- **Unit (Vitest):** `lib/` seluruhnya; validasi konten; kalibrasi simulasi.
- **Komponen:** tabel banding, baris metrik (termasuk kasus `absent` dan basis berbeda).
- **E2E (Playwright):** tiap rute termuat; pilih bagian lewat keyboard; ganti sistem di
  Banding; hash memulihkan tampilan; tanpa WebGL halaman Data tetap berfungsi.
- **Visual:** `scripts/shots.mjs <out.png> '<hash>' [WxH]` untuk tangkapan layar yang dinilai
  sebelum sebuah tampilan 3D dianggap selesai.

## 4.8 Performa

Pemisahan kode per rute; three.js hanya di rute 3D; model dimuat malas dengan `Suspense` dan
indikator kemajuan; instancing untuk baut, sel baterai, dan sirip radiator; bayangan kontak
alih-alih shadow map penuh; batasi `dpr` ke 2; postprocessing dimatikan di ponsel.

---

# Bagian 5 — Roadmap

## M0 — Fondasi
Proyek Vite, lint, format, tes, Tailwind dengan token bred, HashRouter dengan semua rute
kosong, `scripts/shots.mjs`, `git init`, `docs/PROGRESS.md`.
Terima: `build` lolos; semua rute tampil dengan kerangka dan tema.

## M1 — Skema dan data awal
Skema Zod, empat berkas mobil dari Bagian 3 (semua `verified: false`), registri metrik,
metrik turunan, `check-content`, halaman Data versi tabel polos.
Terima: tabel menampilkan semua metrik 3.1–3.3 untuk empat mobil, termasuk sel "tidak ada".

## M2 — Verifikasi data
Cek setiap angka ke sumber (3.6), isi `sources`, ubah `verified`, perbaiki angka yang salah.
Terima: semua angka bertanda (?) terselesaikan atau tercatat di "Data yang belum terverifikasi".

## M3 — Studio dan model prosedural
Studio bred, pustaka material, empat model prosedural berskala benar dengan node bernama
sesuai 4.3, Garasi dengan empat mobil berjajar.
Terima: keempat mobil dikenali dari siluetnya di tangkapan layar; panjang dan tinggi relatif
sesuai data.

## M4 — Komponen dalam
Semua bagian di 3.4 dimodelkan skematis untuk keempat mobil, pada posisi dan ukuran benar.
Terima: tes pemetaan node lolos; sinar-X memperlihatkan tata letak khas tiap mobil.

## M5 — Bedah
Kupas, ledak, potong, sinar-X, pemilihan, panel bagian dengan strip banding, preset kamera.
Terima: kriteria 2.3.

## M6 — Banding
Berjajar dan tumpuk, kamera sinkron, sorot sistem, baris banding, kalimat ringkas, konten
teks lengkap untuk semua bagian.
Terima: kriteria 2.4; delapan cerita di 3.5 bisa ditunjukkan dengan satu tautan masing-masing.

## M7 — Data dan grafik
Tabel induk lengkap, grafik batang, radar, sebar, varian ekstrem, ekspor CSV, glosarium.
Terima: aturan 2.6 terlihat diterapkan (basis tampil; basis berbeda tidak diberi pemenang).

## M8 — Adu
Simulasi akselerasi, pengereman, downforce, aliran energi, dengan kalibrasi teruji.
Terima: 0–100 dan 0–200 model dalam ±5% dari klaim untuk semua mobil.

## M9 — Penyempurnaan dan siap online
Model berlisensi terbuka bila tersedia (4.3 tingkat 1), tingkat detail, ponsel,
aksesibilitas, cadangan tanpa WebGL, halaman Tentang, `CREDITS.md`, README, audit performa.
Terima: semua tes lolos; Lighthouse aksesibilitas ≥ 95; laporan akhir ditulis.

---

# Bagian 6 — Publikasi (hanya setelah pemilik berkata "Publikasikan")

1. Tanyakan nama akhir proyek (lihat catatan nama di Bagian 0) dan ganti di seluruh aplikasi.
2. Periksa ulang `CREDITS.md`, pernyataan tidak berafiliasi, dan daftar data yang belum
   terverifikasi; tampilkan daftarnya ke pemilik.
3. Tanyakan tujuan hosting (bawaan: GitHub Pages lewat GitHub Actions), buat remote, push,
   pasang alur kerja deploy, periksa situs yang sudah tayang dengan tangkapan layar.
