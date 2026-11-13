import { noPart, part, type CarParts } from '../types';

export const sealParts: CarParts = {
  'body-panels': part(
    'Kulit luar sedan empat pintu dari baja dan aluminium dengan bentuk licin berhambatan rendah.',
    'Panel dipres lalu dilas ke rangka monokok. Hidung rendah, gagang pintu rata, dan buritan yang menyempit menjaga aliran udara tetap menempel sehingga hambatannya kecil.',
    'Pada mobil listrik hambatan udara langsung memotong jarak tempuh, jadi bentuk dikejar untuk efisiensi, bukan downforce.',
    ['lengthMm', 'widthMm', 'heightMm', 'dragCd'],
  ),
  doors: part(
    'Empat pintu berengsel biasa dengan kaca tanpa bingkai dan gagang yang masuk rata ke bodi.',
    'Pintu membuka ke samping pada engsel depan. Gagang keluar otomatis saat mobil dibuka kuncinya lalu masuk lagi ketika berjalan.',
    'Mobil harian butuh akses mudah untuk lima penumpang; gagang rata mengurangi hambatan udara.',
    ['seats'],
  ),
  glass: part(
    'Kaca depan, jendela, dan atap kaca panorama satu lembar.',
    'Atap kaca tetap menutup hampir seluruh kabin dan berlapis penahan panas. Kacanya ikut menyumbang kekakuan atap karena direkatkan ke rangka.',
    'Baterai di lantai menaikkan posisi duduk, dan atap kaca tipis mengembalikan ruang kepala.',
  ),
  lights: part(
    'Lampu LED depan dan batang lampu belakang selebar bodi.',
    'Semua lampu memakai LED berdaya rendah. Lampu belakang berupa satu batang dengan pola titik yang menyala berurutan.',
    'LED hemat energi dan memberi kebebasan bentuk sebagai identitas visual.',
  ),
  tub: part(
    'Monokok baja dan aluminium dengan paket baterai sebagai lantai struktural (Cell-to-Body).',
    'Tutup atas paket baterai sekaligus menjadi lantai kabin. Sel Blade, pelat atas, dan pelat bawah membentuk struktur lapis seperti sarang lebah yang ikut menahan puntiran.',
    'Menjadikan baterai bagian dari struktur menghemat tinggi lantai dan menaikkan kekakuan tanpa menambah banyak rangka.',
    ['kerbKg', 'wheelbaseMm'],
  ),
  subframes: part(
    'Rangka bantu depan dan belakang dari aluminium dan baja yang memegang motor dan suspensi.',
    'Tiap rangka bantu dibaut ke monokok lewat bantalan karet. Motor, gigi reduksi, dan lengan suspensi menempel padanya.',
    'Bantalan karet meredam getaran dan dengung motor supaya kabin senyap.',
  ),
  'crash-structure': part(
    'Zona remuk depan dan belakang serta ambang samping yang melindungi baterai.',
    'Balok dan kotak remuk menyerap energi tabrakan. Ambang samping dibuat sangat kuat karena tepat di baliknya ada sel baterai.',
    'Tanpa mesin di depan, zona remuk bisa dirancang lebih bebas, tetapi baterai harus dijaga dari tusukan samping.',
  ),
  engine: noPart(
    'Seal sepenuhnya listrik dan tidak punya mesin bakar.',
    'Mesin bakar mengubah bensin menjadi putaran lewat ledakan di dalam silinder.',
    'Di Seal perannya diganti dua motor listrik yang mengambil energi langsung dari baterai, tanpa pembakaran, tanpa oli mesin, tanpa busi.',
    'Motor listrik jauh lebih sederhana, senyap, dan efisien; kelemahannya ada di berat baterai, bukan di motornya.',
  ),
  induction: noPart(
    'Tanpa mesin bakar, tidak ada udara yang perlu dihisap atau dimampatkan.',
    'Sistem hisap dan turbo memasok udara bertekanan ke mesin bakar.',
    'Motor listrik tidak membutuhkan udara untuk bekerja. Udara yang masuk ke Seal hanya dipakai untuk pendinginan dan kabin.',
    'Hilangnya saluran hisap membebaskan ruang depan untuk bagasi kecil.',
  ),
  'motor-front': part(
    'Motor induksi 160 kW di poros depan yang menyala saat butuh traksi atau tenaga penuh.',
    'Rotor motor induksi tidak bermagnet, sehingga ketika tidak dialiri arus ia berputar bebas hampir tanpa hambatan. Inverter menyalakannya dalam sekejap saat pedal diinjak dalam.',
    'Motor depan hanya dipakai sesekali, jadi jenis yang bisa "diam gratis" menghemat energi saat melaju santai.',
    ['motorPowerKw'],
  ),
  'motor-rear': part(
    'Motor magnet permanen 230 kW di poros belakang, penggerak utama sehari-hari.',
    'Magnet pada rotor membuat motor ini sangat efisien di beban ringan. Ia menyatu dengan inverter dan gigi reduksi dalam satu rumah.',
    'Motor yang bekerja hampir sepanjang waktu dipilih dari jenis paling efisien.',
    ['motorPowerKw', 'powerTotalKw', 'torqueTotalNm'],
  ),
  transmission: part(
    'Gigi reduksi satu tingkat pada tiap motor, tanpa perpindahan gigi.',
    'Sepasang roda gigi menurunkan putaran motor yang sangat tinggi menjadi putaran roda. Mundur dilakukan dengan membalik arah putar motor.',
    'Motor listrik bertorsi penuh sejak diam dan berputar sampai belasan ribu rpm, jadi tidak perlu banyak gigi.',
    ['gears'],
  ),
  driveline: part(
    'Empat poros roda pendek dari dua unit penggerak; tidak ada poros kardan.',
    'Tiap unit penggerak punya diferensialnya sendiri. Pembagian torsi depan-belakang diatur perangkat lunak, bukan kopling mekanis.',
    'Tanpa hubungan mekanis depan-belakang, lantai bisa rata dan torsi bisa dibagi dalam hitungan milidetik.',
  ),
  battery: part(
    'Paket LFP Blade 82,56 kWh yang membentang di seluruh lantai antara kedua poros.',
    'Sel panjang pipih berdiri berjajar seperti bilah dan langsung menjadi bagian struktur paket. Kimia litium besi fosfat tahan panas dan awet, dengan kepadatan energi lebih rendah daripada nikel.',
    'Paket lebar dan tipis di lantai menurunkan titik berat dan memberi jarak tempuh harian; LFP dipilih demi keamanan dan umur pakai.',
    ['batteryKwh', 'evRangeKm', 'dcChargeKw'],
  ),
  'fuel-tank': noPart(
    'Seal tidak memakai bensin.',
    'Tangki bensin menyimpan bahan bakar cair untuk mesin bakar.',
    'Seluruh energi Seal disimpan di baterai lantai. Sebagai gambaran, 82,56 kWh setara energi kimia sekitar 9 liter bensin, tetapi motor listrik memakainya kira-kira tiga kali lebih efisien.',
    'Menyimpan listrik jauh lebih berat daripada menyimpan bensin; itulah sumber utama bobot Seal.',
  ),
  'power-electronics': part(
    'Inverter, pengisi daya on-board, dan konverter DC-DC yang mengatur aliran listrik.',
    'Inverter mengubah arus searah baterai menjadi arus bolak-balik tiga fasa untuk motor, dan sebaliknya saat regenerasi. Konverter DC-DC memasok sistem 12 V.',
    'Menyatukan komponen ini dengan motor memendekkan kabel tegangan tinggi dan menghemat berat.',
  ),
  'charge-port': part(
    'Soket pengisian di spatbor belakang kanan untuk AC dan DC cepat.',
    'Pengisian DC sampai 150 kW mengalir langsung ke baterai; pengisian AC lewat pengisi on-board. Soket yang sama bisa mengeluarkan listrik untuk peralatan (V2L).',
    'Mobil listrik harian harus bisa diisi di rumah maupun di stasiun cepat.',
    ['dcChargeKw'],
  ),
  radiators: part(
    'Kondensor dan radiator depan untuk sirkuit pendingin dan pompa kalor.',
    'Cairan pendingin membawa panas dari motor dan inverter ke radiator depan. Pompa kalor memindahkan panas itu ke kabin saat dibutuhkan.',
    'Panas buangan penggerak listrik kecil, sehingga bukaan depan bisa sempit dan sering tertutup.',
  ),
  'battery-cooling': part(
    'Pelat pendingin refrigeran yang menempel langsung pada paket baterai.',
    'Refrigeran AC mengalir di pelat di atas sel untuk mendinginkan atau menghangatkannya. Suhu sel dijaga dalam rentang sempit, terutama saat pengisian cepat.',
    'Baterai besar menghasilkan banyak panas ketika diisi 150 kW; pendinginan langsung menjaga umur sel.',
  ),
  'air-paths': part(
    'Aliran udara diarahkan untuk mengurangi hambatan: tirai udara di bumper dan lantai rata.',
    'Celah di sudut bumper membentuk tirai udara di sisi roda depan. Kisi depan aktif menutup ketika pendinginan tidak diperlukan.',
    'Setiap pengurangan hambatan langsung menjadi tambahan jarak tempuh.',
    ['dragCd'],
  ),
  exhaust: noPart(
    'Tidak ada pembakaran, jadi tidak ada gas buang.',
    'Knalpot menyalurkan dan membersihkan gas sisa pembakaran serta meredam suara.',
    'Seal tidak mengeluarkan emisi dari mobilnya sendiri. Suara pada kecepatan rendah dibuat oleh pengeras suara peringatan pejalan kaki.',
    'Hilangnya knalpot dan katalis membebaskan ruang lantai belakang untuk diffuser dan bagasi.',
  ),
  'suspension-front': part(
    'Suspensi depan wishbone ganda dengan pegas ulir.',
    'Dua lengan berbentuk A menahan roda sehingga sudut bannya tetap baik saat menikung. Peredam mengubah kekerasannya mengikuti frekuensi guncangan.',
    'Wishbone ganda memberi kendali lebih presisi untuk sedan seberat dua ton lebih.',
  ),
  'suspension-rear': part(
    'Suspensi belakang lima-link independen.',
    'Lima batang terpisah mengatur gerak roda ke segala arah secara mandiri. Susunan ini menahan gaya dorong motor belakang tanpa mengubah arah roda.',
    'Lima-link memisahkan kenyamanan dari kestabilan, penting untuk motor belakang yang bertorsi besar.',
  ),
  steering: part(
    'Kemudi rak-dan-pinion dengan bantuan motor listrik.',
    'Motor listrik pada rak menambah gaya putar sesuai kecepatan. Sistem bantu pengemudi bisa menggerakkan kemudi lewat motor yang sama.',
    'Bantuan listrik hemat energi dan diperlukan untuk fitur bantu jaga lajur.',
  ),
  discs: part(
    'Cakram baja berventilasi di keempat roda.',
    'Kampas menjepit cakram besi tuang untuk mengubah gerak menjadi panas. Pada pengereman biasa sebagian besar perlambatan justru dikerjakan motor.',
    'Karena regenerasi mengambil sebagian besar beban, cakram baja yang murah dan awet sudah cukup.',
  ),
  calipers: part(
    'Kaliper rem dengan sistem brake-by-wire yang memadukan rem gesek dan regenerasi.',
    'Pedal rem dibaca sebagai permintaan perlambatan. Komputer memutuskan berapa bagian dikerjakan motor dan berapa oleh kaliper.',
    'Pemaduan otomatis membuat rasa pedal tetap konsisten sambil memanen energi sebanyak mungkin.',
  ),
  regen: part(
    'Pengereman regeneratif: motor berubah menjadi generator dan mengisi baterai.',
    'Saat pedal gas dilepas atau rem diinjak, motor menahan putaran roda dan menghasilkan listrik. Baterai besar sanggup menerima daya regenerasi yang tinggi.',
    'Energi yang pada mobil biasa terbuang sebagai panas dikembalikan menjadi jarak tempuh.',
  ),
  'air-brake': noPart(
    'Seal tidak punya sayap yang bisa berdiri sebagai rem udara.',
    'Rem udara menegakkan sayap belakang untuk menambah hambatan dan menekan roda belakang saat mengerem keras.',
    'Seal mengandalkan regenerasi dan rem gesek. Pada kecepatan jalan raya, rem udara hampir tidak berpengaruh.',
    'Rem udara baru berguna jauh di atas 200 km/jam, di luar jangkauan Seal.',
  ),
  wheels: part(
    'Pelek paduan 19 inci dengan desain tertutup.',
    'Permukaan pelek yang relatif rata mengurangi olakan udara di sekitar roda. Ukuran depan dan belakang sama.',
    'Ukuran seragam memudahkan rotasi ban dan menekan biaya.',
    ['wheelFrontIn', 'wheelRearIn'],
  ),
  tires: part(
    'Ban 235/45 R19 di keempat roda.',
    'Ban jalan raya bertelapak penuh dengan dinding cukup tinggi untuk kenyamanan. Kompon dipilih untuk hambatan gulir rendah.',
    'Ban adalah batas traksi sebenarnya: tenaga 390 kW tersalur baik berkat empat roda penggerak, bukan berkat ban yang lebar.',
    ['tireFrontMm', 'tireRearMm'],
  ),
  'front-aero': part(
    'Bumper depan halus dengan bukaan pendingin kecil dan tirai udara.',
    'Udara dibelah dengan lembut dan diarahkan mengelilingi roda. Tidak ada splitter menonjol.',
    'Tujuannya memperkecil hambatan, bukan menekan hidung ke aspal.',
  ),
  underbody: part(
    'Lantai rata karena paket baterai menutup seluruh bagian bawah, diakhiri diffuser kecil.',
    'Permukaan bawah yang rata membuat udara mengalir tanpa tersangkut. Diffuser belakang melambatkan udara secara bertahap.',
    'Lantai rata didapat "gratis" dari baterai dan menurunkan hambatan.',
  ),
  'rear-wing': part(
    'Bibir bagasi kecil (ducktail) yang menyatu dengan tutup bagasi.',
    'Tepi tajam di ujung bagasi memisahkan aliran udara dengan rapi. Efeknya mengurangi gaya angkat belakang, bukan menghasilkan downforce besar.',
    'Sayap besar akan menambah hambatan dan memotong jarak tempuh.',
  ),
  'active-aero': noPart(
    'Tidak ada sayap atau flap aerodinamika yang bergerak; hanya kisi pendingin aktif.',
    'Aero aktif mengubah sudut sayap dan flap sesuai kecepatan untuk menukar downforce dengan hambatan.',
    'Seal hanya membuka-tutup kisi depan demi pendinginan dan efisiensi.',
    'Pada kecepatan maksimum 180 km/jam, keuntungan aero aktif tidak sebanding dengan berat dan biayanya.',
  ),
  seats: part(
    'Lima kursi: dua kursi depan berpenyangga samping dan bangku belakang untuk tiga orang.',
    'Kursi depan diatur dengan motor listrik serta berpemanas dan berventilasi. Lantai belakang rata karena tidak ada terowongan kardan.',
    'Mobil ini harus nyaman dipakai keluarga setiap hari.',
    ['seats'],
  ),
  dashboard: part(
    'Layar sentuh 15,6 inci yang bisa berputar ditambah panel instrumen digital.',
    'Hampir semua fungsi diatur lewat layar tengah yang bisa diputar tegak atau mendatar. Panel kecil di balik kemudi menampilkan kecepatan dan sisa energi.',
    'Antarmuka berbasis layar murah diperbarui lewat perangkat lunak.',
  ),
  controls: part(
    'Kemudi multifungsi, tuas pemilih arah di konsol, dan pedal tunggal untuk gas.',
    'Tidak ada tuas gigi atau kopling. Melepas pedal gas sudah memberi perlambatan regeneratif.',
    'Penggerak listrik menyederhanakan kendali menjadi maju, mundur, dan berhenti.',
  ),
  cargo: part(
    'Bagasi belakang 400 liter dan bagasi depan kecil sekitar 50 liter.',
    'Ruang di bawah kap depan kosong karena tidak ada mesin, cukup untuk kabel pengisian. Sandaran kursi belakang bisa dilipat.',
    'Praktis untuk harian; inilah hal yang tidak dimiliki tiga hypercar lainnya.',
    ['cargoL'],
  ),
  'drive-modes': part(
    'Mode Eco, Normal, Sport, dan Salju yang mengubah respons motor dan kemudi.',
    'Perangkat lunak mengatur seberapa cepat torsi diberikan dan seberapa kuat regenerasi. Mode Sport menyalakan motor depan lebih sering.',
    'Satu mobil harus bisa hemat di kota dan cepat saat diminta.',
  ),
  stability: part(
    'Kendali torsi cerdas (iTAC) yang mengatur torsi tiap poros sebelum roda selip.',
    'Sensor membaca perubahan kecepatan roda puluhan kali per detik. Sistem menggeser atau mengurangi torsi motor, bukan sekadar mengerem roda yang selip.',
    'Motor listrik merespons jauh lebih cepat daripada rem, sehingga koreksinya lebih halus.',
  ),
  'driver-assist': part(
    'Paket bantu pengemudi: kamera, radar, jaga lajur, kendali jelajah adaptif, dan rem darurat.',
    'Kamera dan radar memantau kendaraan dan marka di sekitar. Komputer bisa mengerem, menjaga jarak, dan mengoreksi kemudi.',
    'Fitur keselamatan aktif sudah menjadi standar untuk mobil keluarga modern.',
  ),
};
