import { noPart, part, type CarParts } from '../types';

export const p1Parts: CarParts = {
  'body-panels': part(
    'Kulit serat karbon yang "dibungkus susut" serapat mungkin di sekeliling komponen mekanis.',
    'Hanya ada sedikit panel besar, semuanya karbon. Permukaan penuh cekungan yang mengalirkan udara ke radiator samping dan ke sayap belakang.',
    'Bodi sekecil mungkin berarti luas frontal kecil dan berat rendah.',
    ['lengthMm', 'widthMm', 'heightMm', 'dragCd'],
  ),
  doors: part(
    'Dua pintu dihedral yang membuka ke atas dan ke depan.',
    'Pintu berengsel tunggal di tiang depan dan membawa sebagian atap. Rongga di dalam pintu menjadi saluran udara menuju radiator samping.',
    'Pintu ikut bekerja sebagai saluran pendingin, bukan sekadar penutup.',
    ['seats'],
  ),
  glass: part(
    'Kanopi kaca bergaya jet tempur dengan panel atap kaca.',
    'Kaca depan lebih tinggi daripada lebarnya dan menyambung ke panel kaca di atap. Tiang depan dibuat tipis untuk pandangan luas.',
    'Pandangan yang baik membantu pengemudi menempatkan mobil dengan tepat di sirkuit.',
  ),
  lights: part(
    'Lampu depan LED berbentuk logo McLaren dan lampu belakang berupa garis tipis.',
    'Lampu belakang hanyalah garis LED di tepi bodi; sisanya jaring terbuka. Udara panas mesin keluar melewati buritan itu.',
    'Buritan terbuka membuang panas, jadi lampu dibuat setipis mungkin.',
  ),
  tub: part(
    'MonoCage serat karbon sekitar 90 kg yang mencakup bak, atap, dan corong udara.',
    'Berbeda dari bak terbuka, MonoCage adalah satu cetakan yang mencakup struktur atap dan saluran hisap di atas kabin. Rumah baterai dan elektronika ikut menyatu.',
    'Menyatukan atap ke dalam struktur menambah kekakuan dan melindungi penumpang tanpa rangka tambahan.',
    ['tubKg', 'dryKg', 'kerbKg'],
  ),
  subframes: part(
    'Rangka bantu aluminium di depan dan belakang.',
    'Rangka depan memegang suspensi dan radiator; rangka belakang memegang mesin, transmisi, dan suspensi belakang.',
    'Aluminium menyerap energi tabrakan dan bisa diganti tanpa membuang MonoCage.',
  ),
  'crash-structure': part(
    'Struktur remuk aluminium depan dan belakang yang dibaut ke MonoCage.',
    'Bagian ini dirancang hancur bertahap. MonoCage tetap utuh sebagai sel keselamatan.',
    'Prinsip sel keselamatan kaku dengan ujung yang bisa hancur berasal dari Formula 1.',
  ),
  engine: part(
    'V8 3,8 liter twin-turbo berdaya 737 PS, dengan tekanan turbo tinggi.',
    'Dua turbo besar memampatkan udara hingga sekitar 2,4 bar. Mesin kecil ini menghasilkan tenaga besar, tetapi turbo besar butuh waktu untuk berputar.',
    'Mesin ringkas dan ringan dengan turbo besar memberi tenaga puncak tinggi; jeda turbonya ditutup motor listrik.',
    ['cylinders', 'displacementCc', 'enginePowerKw', 'engineTorqueNm', 'engineMaxRpm'],
  ),
  induction: part(
    'Corong udara di atap dan dua turbocharger besar dengan intercooler.',
    'Udara masuk dari corong atap yang menyatu dengan MonoCage. Turbo memampatkannya, lalu intercooler mendinginkannya sebelum masuk mesin.',
    'Udara yang dingin dan padat membawa lebih banyak oksigen sehingga lebih banyak bensin bisa dibakar.',
  ),
  'motor-front': noPart(
    'P1 berpenggerak roda belakang saja.',
    'Motor depan menggerakkan roda depan pada mobil berpenggerak empat roda.',
    'Seluruh tenaga V8 dan motor listrik dikirim ke roda belakang.',
    'McLaren memilih berat rendah dan kemudi murni daripada traksi empat roda.',
  ),
  'motor-rear': part(
    'Satu motor listrik 132 kW yang menempel langsung pada blok mesin.',
    'Motor terhubung ke poros engkol dan mendorong lewat transmisi yang sama. Ia memberi torsi seketika saat turbo belum bertekanan, dan menahan mesin saat pindah gigi agar perpindahan lebih cepat.',
    'Torsi instan motor menutupi kelemahan utama mesin turbo besar, yaitu jeda respons.',
    ['motorPowerKw', 'powerTotalKw', 'torqueTotalNm'],
  ),
  transmission: part(
    'Transmisi kopling ganda 7 tingkat.',
    'Dua kopling bergantian menyalurkan tenaga sehingga perpindahan gigi tanpa jeda. Motor listrik membantu menyamakan putaran mesin saat naik gigi.',
    'Torsi gabungan dibatasi 900 Nm justru untuk melindungi transmisi ini.',
    ['gears'],
  ),
  driveline: part(
    'Diferensial terbuka dengan pengereman roda dalam (Brake Steer).',
    'Alih-alih diferensial pengunci yang berat, rem roda belakang bagian dalam ditekan sedikit di tikungan. Efeknya menarik hidung mobil masuk ke tikungan.',
    'Teknik ini berasal dari F1 dan lebih ringan daripada diferensial aktif.',
  ),
  battery: part(
    'Paket litium-ion 4,7 kWh seberat 96 kg di belakang kabin, menyatu dengan MonoCage.',
    'Paket berdaya-padat tinggi ini bisa diisi dari mesin atau dicolok ke listrik. Kapasitasnya dua kali LaFerrari sehingga cukup untuk berjalan listrik murni lebih dari 10 km.',
    'Kemampuan berjalan listrik menuntut kapasitas lebih besar, dan itu dibayar dengan berat.',
    ['batteryKwh', 'batteryKg', 'evRangeKm'],
  ),
  'fuel-tank': part(
    'Tangki bensin 72 liter di belakang kabin.',
    'Tangki diletakkan di tengah mobil di depan mesin. Baterai dipasang tepat di dekatnya.',
    'Menaruh benda berat di antara kedua poros menjaga keseimbangan.',
    ['fuelTankL'],
  ),
  'power-electronics': part(
    'Inverter dan pengisi daya on-board yang didinginkan cairan.',
    'Inverter mengatur arus ke motor dan dari motor. Pengisi daya menerima listrik dari colokan rumah.',
    'Kendali cepat diperlukan agar motor bisa mengisi torsi tepat saat turbo tertinggal.',
  ),
  'charge-port': part(
    'Soket pengisian AC untuk mengisi baterai dari stopkontak.',
    'Baterai penuh dalam kira-kira dua jam dari stopkontak rumah. Tidak ada pengisian cepat DC.',
    'Dengan baterai sekecil ini, pengisian lambat sudah cukup.',
  ),
  radiators: part(
    'Radiator samping besar di depan roda belakang dan radiator depan.',
    'Udara untuk radiator samping masuk lewat lekukan pintu. Radiator depan mendinginkan sirkuit bersuhu rendah untuk intercooler dan sistem listrik.',
    'Mesin turbo bertekanan tinggi dan sistem hibrida sama-sama butuh pendinginan besar.',
  ),
  'battery-cooling': part(
    'Sirkuit cairan bersuhu rendah untuk baterai, motor, dan inverter.',
    'Cairan pendingin mengalir melalui tiap modul baterai. Sirkuit ini terpisah dari pendingin mesin yang jauh lebih panas.',
    'Baterai berdaya tinggi harus dijaga sejuk agar bisa terus memberi dorongan.',
  ),
  'air-paths': part(
    'Udara mengalir lewat pintu ke radiator, lewat corong atap ke mesin, dan keluar di buritan terbuka.',
    'Lekukan pintu dan bodi berfungsi sebagai saluran. Udara panas keluar lewat kisi di atas mesin dan buritan berjaring.',
    'Bentuk bodi ditentukan oleh kebutuhan udara, bukan sebaliknya.',
    ['dragCd'],
  ),
  exhaust: part(
    'Knalpot Inconel pendek dengan satu lubang keluar besar di tengah buritan.',
    'Saluran dibuat sependek dan selurus mungkin dari turbo ke belakang. Inconel dipilih karena tahan panas dan ringan.',
    'Jalur pendek mengurangi berat dan tekanan balik.',
  ),
  'suspension-front': part(
    'Wishbone ganda dengan sistem hidropneumatik (RaceActive Chassis Control).',
    'Peredam tiap roda saling terhubung secara hidraulik sehingga tidak perlu batang stabilizer. Kekerasan dan tinggi mobil diatur terpisah.',
    'Sistem ini bisa lembut di jalan lurus dan sangat kaku melawan gulingan tanpa kompromi biasa.',
  ),
  'suspension-rear': part(
    'Wishbone ganda belakang dengan sistem hidropneumatik yang sama.',
    'Dalam mode Race, mobil turun 50 mm dan pegas menjadi sekitar tiga kali lebih kaku. Tinggi yang rendah membuat lantai menghasilkan hisapan lebih besar.',
    'Aerodinamika lantai sangat peka terhadap tinggi mobil, jadi tingginya harus bisa dikendalikan.',
  ),
  steering: part(
    'Kemudi elektro-hidraulik.',
    'Pompa listrik memberi tekanan hidraulik untuk membantu kemudi. Rasa jalan tetap terasa seperti kemudi hidraulik.',
    'Menggabungkan umpan balik hidraulik dengan efisiensi pompa listrik.',
  ),
  discs: part(
    'Cakram karbon-keramik Akebono berlapis silikon karbida.',
    'Lapisan silikon karbida sangat keras dan menyerap panas lebih baik daripada karbon-keramik biasa. Permukaannya mengilap seperti cermin.',
    'Bahan ini dikembangkan dari teknologi luar angkasa agar rem lebih kecil dan ringan untuk daya yang sama.',
    ['discFrontMm', 'discRearMm'],
  ),
  calipers: part(
    'Kaliper monoblok Akebono.',
    'Kaliper satu blok menjepit cakram. Tidak ada pemaduan dengan regenerasi pada pedal; rasa pedal murni hidraulik.',
    'McLaren memilih rasa pedal yang konsisten daripada memanen energi lewat rem.',
  ),
  regen: part(
    'Baterai diisi terutama oleh mesin, bukan oleh pengereman.',
    'Motor menjadi generator saat pedal gas dilepas dan saat mesin punya tenaga lebih. Pengereman regeneratif lewat pedal rem sengaja tidak dipakai.',
    'Memisahkan regenerasi dari pedal rem menjaga rasa rem tetap alami.',
  ),
  'air-brake': part(
    'Sayap belakang menegak saat mengerem keras sebagai rem udara.',
    'Saat pengereman, sayap mengubah sudutnya hingga curam. Hambatan naik dan roda belakang ditekan lebih kuat.',
    'Menambah beban belakang menstabilkan mobil saat mengerem dari kecepatan tinggi.',
  ),
  wheels: part(
    'Pelek tempa 19 inci di depan dan 20 inci di belakang.',
    'Pelek paduan tempa dibuat seringan mungkin. Ukuran belakang lebih besar untuk ban yang lebih lebar.',
    'Massa tak berpegas rendah membantu suspensi menjaga kontak ban dengan aspal.',
    ['wheelFrontIn', 'wheelRearIn'],
  ),
  tires: part(
    'Ban Pirelli P Zero Corsa: 245 mm di depan dan 315 mm di belakang.',
    'Kompon dan konstruksi dikembangkan khusus bersama Pirelli. Ban lebih sempit daripada LaFerrari.',
    'Ban yang lebih sempit lebih ringan dan hambatannya lebih kecil; downforce menambah cengkeraman di kecepatan tinggi.',
    ['tireFrontMm', 'tireRearMm'],
  ),
  'front-aero': part(
    'Splitter depan dengan dua flap aktif di bawah hidung.',
    'Flap di depan roda depan mengubah sudut untuk menambah atau mengurangi downforce depan. Mereka bergerak bersama sayap belakang agar keseimbangan terjaga.',
    'Keseimbangan aero depan-belakang harus tetap ketika sayap belakang berubah.',
    ['downforceKg'],
  ),
  underbody: part(
    'Lantai rata dengan diffuser belakang.',
    'Udara dipercepat di bawah mobil dan diperlambat kembali di diffuser. Dalam mode Race, mobil yang turun 50 mm memperkuat efek ini.',
    'Lantai adalah sumber downforce paling efisien.',
  ),
  'rear-wing': part(
    'Sayap belakang besar yang naik hingga 300 mm di sirkuit dan 120 mm di jalan.',
    'Sayap tersimpan rata di bodi lalu terangkat pada dua tiang hidraulik. Sudutnya bisa diubah sampai 29 derajat.',
    'Sayap yang bisa disembunyikan memberi hambatan rendah di jalan dan 600 kg downforce di sirkuit.',
    ['downforceKg'],
  ),
  'active-aero': part(
    'DRS, flap depan, dan sayap belakang yang dikendalikan komputer.',
    'Tombol DRS di kemudi meratakan sayap untuk memangkas hambatan sekitar seperempat. Sistem otomatis mengembalikannya saat rem diinjak.',
    'Seperti di F1, downforce dibuang ketika tidak diperlukan agar kecepatan lurus naik.',
    ['downforceKg'],
  ),
  seats: part(
    'Dua kursi cangkang karbon tipis dengan sandaran tetap.',
    'Cangkang karbon hanya dilapisi bantalan tipis. Kursi bisa digeser maju-mundur, sudut sandarannya dipasang tetap.',
    'Setiap kursi dibuat seringan mungkin.',
    ['seats'],
  ),
  dashboard: part(
    'Dasbor karbon polos dengan panel instrumen digital dan layar tengah kecil tegak.',
    'Serat karbon dibiarkan tanpa lapisan pernis tebal untuk menghemat berat. Layar instrumen berubah tampilan dalam mode Race.',
    'Karpet dan peredam suara pun dijadikan pilihan demi berat.',
  ),
  controls: part(
    'Kemudi dengan tombol DRS dan IPAS serta tuas pindah gigi di baliknya.',
    'Tombol IPAS melepaskan seluruh tenaga motor listrik sekaligus. Tombol DRS meratakan sayap belakang.',
    'Dua tombol itu diambil langsung dari kemudi mobil F1.',
  ),
  cargo: part(
    'Bagasi depan kecil sekitar 120 liter.',
    'Ruang di hidung cukup untuk dua tas kecil. Tidak ada bagasi belakang.',
    'Cukup untuk perjalanan akhir pekan, tidak lebih.',
    ['cargoL'],
  ),
  'drive-modes': part(
    'Mode E (listrik), Normal, Sport, Track, dan Race.',
    'Mode E mematikan mesin dan berjalan dengan baterai. Mode Race menurunkan mobil, menaikkan sayap, dan mengeraskan suspensi; butuh sekitar 30 detik untuk berubah.',
    'Rentang dari senyap listrik sampai setelan sirkuit menjadikan P1 paling serbaguna di antara tiga hypercar.',
    ['evRangeKm'],
  ),
  stability: part(
    'Kendali traksi dan stabilitas yang bekerja bersama Brake Steer dan motor listrik.',
    'Komputer mengatur torsi mesin dan motor serta rem tiap roda. Motor dipakai untuk memperhalus penyaluran torsi.',
    'Tenaga 916 PS di roda belakang perlu diatur dengan sangat halus.',
  ),
  'driver-assist': noPart(
    'Tidak ada bantuan pengemudi seperti jaga lajur atau kendali jelajah adaptif.',
    'Sistem bantu pengemudi memakai kamera dan radar untuk membantu mengerem dan menjaga lajur.',
    'P1 hanya punya sensor parkir dan kamera mundur sebagai pilihan.',
    'Sensor dan komputernya menambah berat tanpa membuat mobil lebih cepat.',
  ),
};
