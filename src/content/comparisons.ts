import type { PartId, SystemId } from './ids';

/** Hand-written comparison per system. */
export const SYSTEM_COMPARISON: Record<SystemId, string> = {
  body: 'Seal adalah sedan baja empat pintu yang dibentuk untuk hambatan rendah. Ketiga hypercar berbalut karbon tipis, dan dari LaFerrari ke P1 ke Senna bentuknya makin tunduk pada aerodinamika, sampai Senna rela tampak tidak mulus.',
  structure: 'Seal memakai monokok logam dengan baterai sebagai lantai struktural. Ketiga hypercar dibangun di sekeliling sel serat karbon: bak terbuka di LaFerrari, sel beratap utuh (MonoCage) di P1 dan Senna.',
  powertrain: 'Empat jawaban berbeda: dua motor listrik (Seal), V12 tanpa turbo dibantu motor (LaFerrari), V8 turbo dibantu motor (P1), dan V8 turbo saja (Senna). LaFerrari paling bertenaga, tetapi hanya Seal yang menggerakkan keempat roda.',
  energy: 'Seal membawa 82,56 kWh di lantai, kira-kira 36 kali kapasitas baterai LaFerrari dan 18 kali P1. Senna tidak membawa baterai traksi sama sekali: seluruh energinya bensin, yang jauh lebih ringan per kWh.',
  thermal: 'Penggerak listrik Seal membuang sedikit panas sehingga bukaan depannya kecil dan sering tertutup. Ketiga hypercar harus membuang panas ratusan kilowatt dan memakai jalur udara panasnya untuk membantu aerodinamika.',
  exhaust: 'Seal tidak punya knalpot. LaFerrari memakai saluran sama panjang demi tenaga dan suara V12, P1 memilih jalur terpendek ke tengah buritan, dan Senna membuangnya ke atas agar tidak mengganggu sayap dan diffuser.',
  suspension: 'Seal memakai pegas ulir konvensional. LaFerrari memakai peredam magnetoreologis, sedangkan P1 dan Senna memakai sistem hidropneumatik saling terhubung yang juga mengatur tinggi mobil demi aerodinamika.',
  brakes: 'Seal mengerem terutama dengan motornya dan mengembalikan energi ke baterai; cakram bajanya jarang bekerja keras. Ketiga hypercar memakai karbon-keramik dan rem udara, dan hanya Senna yang sama sekali tidak memanen energi.',
  wheels: 'Seal memakai ban 235 mm yang sama di keempat roda. Hypercar memakai ban belakang jauh lebih lebar karena semua tenaga lewat dua roda: 345 mm di LaFerrari, 315 mm di P1 dan Senna, dengan Senna memakai ban setara ban sirkuit.',
  aero: 'Seal mengejar hambatan serendah mungkin dan tidak menghasilkan downforce. LaFerrari menyembunyikan aero aktifnya di dalam bodi, P1 menaikkan sayap besar hanya saat perlu, dan Senna memasang sayap tetap raksasa untuk 800 kg downforce.',
  cabin: 'Seal memuat lima orang dan 450 liter barang. Ketiga hypercar hanya dua kursi; LaFerrari mencetak kursinya ke dalam bak karbon, dan Senna hanya menyisakan ruang untuk dua helm.',
  electronics: 'Hanya Seal yang punya bantuan pengemudi berbasis kamera dan radar. Hypercar memusatkan elektroniknya pada kendali traksi, sasis, dan aero, dan menyerahkan sisanya kepada pengemudi.',
};

/** Hand-written one-line comparison per part. */
export const PART_COMPARISON: Record<PartId, string> = {
  'body-panels': 'Baja dan aluminium di Seal, serat karbon di ketiga hypercar; Seal dibentuk untuk efisiensi, Senna untuk downforce.',
  doors: 'Empat pintu biasa di Seal; pintu yang membuka ke atas di ketiga hypercar karena ambang karbonnya tinggi.',
  glass: 'Atap kaca panorama untuk kelegaan di Seal; kanopi sempit untuk luas frontal kecil di hypercar, dengan kaca pintu bawah khas Senna.',
  lights: 'Semuanya LED, tetapi di hypercar lampu harus berbagi tempat dengan bukaan udara.',
  tub: 'Monokok logam berbaterai struktural (Seal) lawan sel serat karbon (hypercar); P1 dan Senna menyatukan atap ke dalam selnya.',
  subframes: 'Keempatnya memakai rangka bantu logam; di hypercar rangka ini sengaja dibuat sebagai bagian yang boleh rusak dan diganti.',
  'crash-structure': 'Seal melindungi baterai di lantai; hypercar melindungi sel karbon penumpang.',
  engine: 'Tidak ada (Seal), V12 6,3 L tanpa turbo (LaFerrari), V8 3,8 L twin-turbo (P1), V8 4,0 L twin-turbo (Senna).',
  induction: 'LaFerrari menghisap alami dengan saluran variabel; P1 dan Senna memakai dua turbo; Seal tidak butuh udara untuk bertenaga.',
  'motor-front': 'Hanya Seal yang punya motor depan, dan karena itu hanya Seal yang berpenggerak empat roda.',
  'motor-rear': 'Seal 230 kW sebagai penggerak utama; LaFerrari 120 kW dan P1 132 kW sebagai pembantu mesin; Senna tanpa motor.',
  transmission: 'Satu gigi tetap per motor di Seal; kopling ganda 7 tingkat di ketiga hypercar.',
  driveline: 'Seal membagi torsi antarporos lewat perangkat lunak; LaFerrari memakai diferensial elektronik; P1 dan Senna memakai rem untuk membantu berbelok.',
  battery: '82,56 kWh di lantai (Seal), ± 2,3 kWh di belakang kursi (LaFerrari), 4,7 kWh di belakang kabin (P1), tidak ada (Senna).',
  'fuel-tank': 'Tidak ada di Seal; sekitar 86 L untuk V12 LaFerrari dan 72 L untuk V8 P1 dan Senna.',
  'power-electronics': 'Menjadi inti penggerak di Seal, pelengkap di LaFerrari dan P1, dan tidak ada di Senna.',
  'charge-port': 'Seal mengisi cepat DC 150 kW; P1 hanya AC lambat; LaFerrari dan Senna tidak bisa dicolok.',
  radiators: 'Bukaan kecil di Seal; radiator depan dan samping yang besar di hypercar bermesin tengah.',
  'battery-cooling': 'Pendinginan refrigeran langsung untuk paket besar Seal; sirkuit cairan kecil di LaFerrari dan P1; tidak ada di Senna.',
  'air-paths': 'Seal menghindari udara masuk ke bodi; hypercar justru mengalirkan udara menembus bodi untuk pendinginan dan downforce.',
  exhaust: 'Tidak ada (Seal), tengah buritan dengan saluran sama panjang (LaFerrari), satu lubang tengah (P1), ke atas lewat dek (Senna).',
  'suspension-front': 'Pegas ulir (Seal), magnetoreologis (LaFerrari), hidropneumatik saling terhubung (P1 dan Senna).',
  'suspension-rear': 'Lima-link untuk kenyamanan (Seal); di P1 dan Senna suspensi juga menurunkan mobil demi aerodinamika.',
  steering: 'Bantuan listrik penuh di Seal agar bisa dikendalikan sistem bantu; hypercar mempertahankan rasa jalan.',
  discs: 'Baja berventilasi di Seal; karbon-keramik di hypercar, dengan bahan makin canggih dari LaFerrari ke P1 ke Senna.',
  calipers: 'Seal memadukan rem gesek dengan regenerasi lewat komputer; hypercar mengutamakan rasa pedal yang konsisten.',
  regen: 'Seal memanen paling banyak; LaFerrari memanen dari rem dan mesin; P1 sengaja tidak memanen lewat pedal rem; Senna tidak memanen.',
  'air-brake': 'Tidak ada di Seal; di ketiga hypercar sayap atau spoiler menegak saat mengerem keras.',
  wheels: '19 inci di semua roda Seal; 19 inci depan dan 20 inci belakang di hypercar, dengan mur tunggal di Senna.',
  tires: '235 mm rata di Seal; ban belakang 345 mm di LaFerrari dan 315 mm di P1 dan Senna.',
  'front-aero': 'Bumper halus berhambatan rendah (Seal) lawan splitter dan flap aktif (hypercar).',
  underbody: 'Semua berlantai rata, tetapi Seal mendapatkannya dari baterai, sedangkan hypercar merancangnya untuk menghisap mobil ke aspal.',
  'rear-wing': 'Bibir kecil (Seal), spoiler tersembunyi (LaFerrari), sayap yang naik-turun (P1), sayap tetap raksasa (Senna).',
  'active-aero': 'Tidak ada di Seal; otomatis penuh di LaFerrari; dengan tombol DRS di P1; bergerak terus-menerus di Senna.',
  seats: 'Lima kursi berpengatur listrik (Seal) lawan dua kursi karbon; di LaFerrari kursinya bahkan bagian dari bak.',
  dashboard: 'Layar putar 15,6 inci di Seal; panel instrumen minimalis di hypercar, yang di Senna bisa merebah.',
  controls: 'Kemudi penuh tombol di LaFerrari, dua tombol (DRS dan IPAS) di P1, dan tanpa tombol sama sekali di Senna.',
  cargo: '450 L (Seal), ± 120 L (P1), nyaris nol (LaFerrari), dan hanya ruang helm (Senna).',
  'drive-modes': 'Seal menawarkan mode hemat; P1 punya mode listrik murni; LaFerrari dan Senna hanya mengatur seberapa agresif mobilnya.',
  stability: 'Seal mengoreksi lewat torsi motor; LaFerrari dan P1 memakai motornya untuk memperhalus traksi; Senna mengandalkan rem dan mesin.',
  'driver-assist': 'Hanya Seal yang punya; tiga hypercar sengaja tidak memasangnya.',
};

export interface Story {
  id: string;
  title: string;
  text: string;
  /** Hash path showing it. */
  to: string;
}

export const STORIES: Story[] = [
  { id: 'energy', title: 'Di mana energi disimpan', text: 'Lantai penuh baterai, baterai sebesar koper, atau hanya bensin.', to: '/banding/energy?xray=1' },
  { id: 'electric', title: 'Tiga cara memakai listrik', text: 'Sumber tunggal, penambah tenaga, atau pengisi jeda turbo.', to: '/banding/powertrain?xray=1' },
  { id: 'weight', title: 'Daya per ton', text: 'Senna menyamai P1 dengan daya 86 kW lebih kecil, karena 181 kg lebih ringan.', to: '/data?m=powerPerTonneKw' },
  { id: 'launch', title: 'Awal lawan akhir', text: 'Seal menempel di meter awal, lalu tertinggal jauh.', to: '/adu?mode=accel' },
  { id: 'structure', title: 'Baja lawan karbon', text: 'Monokok berbaterai struktural lawan sel serat karbon.', to: '/banding/structure?xray=1' },
  { id: 'aero', title: 'Downforce', text: 'Dari nol sampai 800 kg, dan harga yang dibayar di kecepatan puncak.', to: '/adu?mode=downforce' },
  { id: 'brakes', title: 'Ke mana energi rem pergi', text: 'Kembali ke baterai atau terbuang sebagai panas.', to: '/banding/brakes?xray=1' },
  { id: 'daily', title: 'Praktis harian', text: 'Kursi, bagasi, dan jarak tempuh.', to: '/banding/cabin?xray=1' },
];
