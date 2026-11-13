export interface Term {
  id: string;
  term: string;
  def: string;
}

export const GLOSSARY: Term[] = [
  {
    id: 'aero-aktif',
    term: 'Aero aktif',
    def: 'Sayap atau flap yang sudutnya diubah komputer saat mobil berjalan untuk menukar downforce dengan hambatan.',
  },
  { id: 'awd', term: 'AWD', def: 'Penggerak semua roda: tenaga dikirim ke roda depan dan belakang.' },
  {
    id: 'bak-karbon',
    term: 'Bak karbon (tub)',
    def: 'Struktur utama berbentuk bak dari serat karbon tempat penumpang duduk dan tempat komponen lain menempel.',
  },
  {
    id: 'berat-kering',
    term: 'Berat kering',
    def: 'Berat mobil tanpa bensin, oli, dan cairan lain. Selalu lebih kecil daripada berat siap jalan.',
  },
  {
    id: 'berat-siap-jalan',
    term: 'Berat siap jalan (kerb)',
    def: 'Berat mobil dengan semua cairan dan bensin, tanpa penumpang. Standar DIN mengisi tangki 90%.',
  },
  {
    id: 'bev',
    term: 'BEV',
    def: 'Mobil listrik baterai: seluruh tenaganya berasal dari baterai yang diisi dari luar.',
  },
  {
    id: 'blade',
    term: 'Baterai Blade',
    def: 'Rancangan sel BYD berbentuk bilah panjang yang disusun langsung menjadi paket tanpa modul.',
  },
  {
    id: 'brake-steer',
    term: 'Brake Steer',
    def: 'Teknik McLaren: mengerem ringan roda belakang bagian dalam agar mobil lebih mudah berbelok.',
  },
  {
    id: 'cd',
    term: 'Koefisien hambat (Cd)',
    def: 'Angka tanpa satuan yang menyatakan seberapa licin sebuah bentuk membelah udara; makin kecil makin licin.',
  },
  {
    id: 'ctb',
    term: 'CTB (Cell-to-Body)',
    def: 'Rancangan yang menjadikan paket baterai sebagai lantai struktural mobil.',
  },
  {
    id: 'dct',
    term: 'Kopling ganda (DCT)',
    def: 'Transmisi dengan dua kopling yang menyiapkan gigi berikutnya sehingga perpindahan terjadi tanpa memutus tenaga.',
  },
  {
    id: 'diffuser',
    term: 'Diffuser',
    def: 'Bagian lantai belakang yang melebar ke atas; melambatkan udara dari bawah mobil dan menghasilkan hisapan.',
  },
  {
    id: 'downforce',
    term: 'Downforce',
    def: 'Gaya aerodinamika yang menekan mobil ke aspal sehingga ban mencengkeram lebih kuat. Naik dengan kuadrat kecepatan.',
  },
  {
    id: 'drs',
    term: 'DRS',
    def: 'Sistem yang meratakan sayap belakang di lintasan lurus untuk mengurangi hambatan.',
  },
  {
    id: 'hy-kers',
    term: 'HY-KERS',
    def: 'Sistem hibrida Ferrari yang diturunkan dari KERS Formula 1: memanen energi pengereman untuk dorongan tambahan.',
  },
  {
    id: 'inverter',
    term: 'Inverter',
    def: 'Perangkat yang mengubah arus searah baterai menjadi arus bolak-balik untuk motor, dan sebaliknya.',
  },
  {
    id: 'ipas',
    term: 'IPAS',
    def: 'Tombol pada McLaren P1 yang melepaskan seluruh tenaga motor listrik seketika.',
  },
  {
    id: 'jeda-turbo',
    term: 'Jeda turbo',
    def: 'Waktu tunggu antara menginjak gas dan turbo menghasilkan tekanan penuh.',
  },
  {
    id: 'karbon-keramik',
    term: 'Karbon-keramik',
    def: 'Bahan cakram rem yang ringan dan tahan panas sangat tinggi, dipakai pada mobil berkinerja tinggi.',
  },
  {
    id: 'lfp',
    term: 'LFP',
    def: 'Litium besi fosfat: kimia baterai yang awet dan tahan panas dengan kepadatan energi lebih rendah.',
  },
  {
    id: 'magnetoreologis',
    term: 'Peredam magnetoreologis',
    def: 'Peredam berisi cairan berpartikel besi yang kekentalannya diatur medan magnet.',
  },
  {
    id: 'monocage',
    term: 'MonoCage',
    def: 'Sel serat karbon McLaren yang menyatukan bak dan struktur atap dalam satu cetakan.',
  },
  {
    id: 'monokok',
    term: 'Monokok',
    def: 'Struktur bodi yang kulit dan rangkanya menjadi satu kesatuan penahan beban.',
  },
  {
    id: 'phev',
    term: 'Hibrida plug-in (PHEV)',
    def: 'Hibrida yang baterainya bisa diisi dari colokan dan mampu berjalan dengan listrik saja.',
  },
  { id: 'ps', term: 'PS', def: 'Tenaga kuda metrik. 1 kW = 1,36 PS.' },
  {
    id: 'regenerasi',
    term: 'Regenerasi',
    def: 'Memakai motor listrik sebagai generator saat melambat untuk mengisi baterai.',
  },
  {
    id: 'torque-fill',
    term: 'Pengisian torsi',
    def: 'Memakai torsi instan motor listrik untuk menutup celah saat mesin atau turbo belum memberi tenaga penuh.',
  },
  {
    id: 'wishbone',
    term: 'Wishbone ganda',
    def: 'Susunan suspensi dengan dua lengan berbentuk A yang menjaga sudut roda tetap baik.',
  },
  {
    id: 'wltp',
    term: 'WLTP',
    def: 'Siklus uji standar untuk konsumsi dan jarak tempuh; lebih ketat daripada NEDC, sehingga angkanya tidak bisa dibandingkan langsung.',
  },
];
