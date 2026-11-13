import { noPart, part, type CarParts } from '../types';

export const laferrariParts: CarParts = {
  'body-panels': part(
    'Kulit serat karbon yang dibentuk oleh aerodinamika: hidung rendah, pinggang ramping, buritan lebar.',
    'Panel karbon tipis menempel pada bak karbon dan rangka bantu. Lekukan di sisi bodi mengalirkan udara ke radiator samping dan ke atas diffuser.',
    'Ferrari menginginkan downforce tanpa sayap besar yang menonjol, jadi bentuk bodinya sendiri yang bekerja.',
    ['lengthMm', 'widthMm', 'heightMm'],
  ),
  doors: part(
    'Dua pintu kupu-kupu yang membuka ke atas dan ke depan.',
    'Pintu berengsel di tiang depan dan atap, membawa sebagian atap dan ambang ikut terbuka. Bukaan besar memudahkan masuk melewati ambang bak karbon yang tinggi.',
    'Ambang karbon yang tinggi dan atap rendah membuat pintu biasa hampir mustahil dipakai.',
    ['seats'],
  ),
  glass: part(
    'Kaca depan melengkung lebar dan kaca penutup mesin di belakang.',
    'Kaca depan menyatu dengan atap sempit berbentuk gelembung. Penutup mesin transparan memperlihatkan V12.',
    'Kabin sempit memperkecil luas frontal; kaca mesin murni untuk memamerkan jantung mobil.',
  ),
  lights: part(
    'Lampu depan memanjang ke atas spatbor dan sepasang lampu belakang bundar.',
    'Lampu depan mengikuti garis spatbor. Lampu belakang bundar diletakkan tinggi di tepi buritan terbuka.',
    'Buritan dibiarkan terbuka agar udara panas mesin keluar, jadi lampu harus ringkas.',
  ),
  tub: part(
    'Bak (tub) serat karbon dari empat jenis serat, dibuat dengan metode Formula 1.',
    'Lembaran karbon disusun tangan lalu dipanggang dalam autoklaf. Serat berbeda dipakai di tempat berbeda: yang paling kuat di zona pintu, yang paling kaku di lantai. Kursi menyatu dengan bak.',
    'Karbon memberi kekakuan sangat tinggi dengan berat rendah, mengimbangi tambahan berat sistem hibrida.',
    ['dryKg', 'kerbKg'],
  ),
  subframes: part(
    'Rangka bantu aluminium di depan dan rangka belakang yang memegang V12, transmisi, dan suspensi.',
    'Rangka depan memegang suspensi dan radiator. Di belakang, mesin dan transmisi dibaut ke bak karbon dan ikut menahan beban.',
    'Aluminium mudah diperbaiki setelah benturan, sedangkan bak karbon dijaga tetap utuh.',
  ),
  'crash-structure': part(
    'Struktur remuk depan dan belakang yang menempel pada bak karbon.',
    'Kotak remuk menyerap energi dengan hancur terkendali. Bak karbon berfungsi sebagai sel keselamatan yang tidak boleh berubah bentuk.',
    'Memisahkan bagian yang boleh hancur dari sel penumpang adalah prinsip mobil balap.',
  ),
  engine: part(
    'V12 6,3 liter tanpa turbo bersudut 65 derajat yang berputar sampai 9.250 rpm.',
    'Dua belas silinder menghisap udara secara alami lewat saluran masuk yang panjangnya berubah-ubah. Tenaga puncak 800 PS baru muncul di 9.000 rpm.',
    'Tanpa turbo, respons gas seketika dan suaranya khas; kekurangan torsi di putaran bawah ditutup motor listrik.',
    ['cylinders', 'displacementCc', 'enginePowerKw', 'engineTorqueNm', 'engineMaxRpm'],
  ),
  induction: part(
    'Hisapan alami: kotak udara karbon dan saluran masuk dengan panjang variabel, tanpa turbo.',
    'Udara masuk lewat corong di atap ke kotak udara di atas mesin. Panjang saluran memendek di putaran tinggi supaya gelombang tekanan membantu mengisi silinder.',
    'Mengatur panjang saluran menggantikan sebagian peran turbo tanpa mengorbankan respons.',
  ),
  'motor-front': noPart(
    'LaFerrari berpenggerak roda belakang saja.',
    'Motor depan menggerakkan roda depan pada mobil berpenggerak empat roda.',
    'Seluruh tenaga dikirim ke roda belakang lewat satu transmisi. Tidak ada motor di poros depan.',
    'Motor depan menambah berat di hidung; Ferrari memilih keseimbangan dan kemurnian kemudi.',
  ),
  'motor-rear': part(
    'Satu motor listrik 120 kW yang menempel pada transmisi (HY-KERS).',
    'Motor terhubung ke salah satu poros transmisi kopling ganda dan mendorong bersama V12. Saat mengerem atau ketika mesin menghasilkan torsi berlebih, ia menjadi generator.',
    'Meletakkannya di transmisi menjaga berat tetap rendah dan di belakang, dekat titik berat.',
    ['motorPowerKw', 'powerTotalKw'],
  ),
  transmission: part(
    'Transmisi kopling ganda 7 tingkat di belakang mesin.',
    'Dua kopling menyiapkan gigi berikutnya sebelum dipakai, sehingga perpindahan terjadi tanpa memutus tenaga. Motor listrik mengisi celah torsi saat berpindah gigi.',
    'Perpindahan tanpa jeda penting ketika hampir 1.000 PS disalurkan hanya lewat dua roda.',
    ['gears'],
  ),
  driveline: part(
    'Diferensial elektronik (E-Diff) dan dua poros roda belakang.',
    'Diferensial dikunci dan dibuka oleh komputer sesuai sudut kemudi, gas, dan selip. Ia bekerja bersama kendali traksi.',
    'Membagi torsi kiri-kanan secara aktif membantu mobil keluar tikungan tanpa kehilangan traksi.',
  ),
  battery: part(
    'Paket litium-ion kecil sekitar 2,3 kWh seberat ± 60 kg, dipasang di lantai di belakang kursi.',
    'Sel dirakit oleh divisi balap Ferrari dan didinginkan cairan. Paket ini dirancang untuk mengeluarkan dan menerima daya besar dalam waktu singkat, bukan menyimpan banyak energi.',
    'Baterai sebesar koper cukup untuk dorongan beberapa detik; yang lebih besar hanya menambah berat.',
    ['batteryKwh', 'batteryKg', 'evRangeKm'],
  ),
  'fuel-tank': part(
    'Tangki bensin sekitar 86 liter di antara kabin dan mesin.',
    'Tangki diletakkan di tengah mobil, di belakang sekat kabin. Posisinya dekat titik berat sehingga keseimbangan tidak banyak berubah saat bensin berkurang.',
    'V12 6,3 liter haus bahan bakar, jadi tangki besar tetap diperlukan.',
    ['fuelTankL'],
  ),
  'power-electronics': part(
    'Dua inverter dan konverter DC-DC yang mengatur aliran listrik HY-KERS.',
    'Inverter mengubah arus searah baterai menjadi arus bolak-balik untuk motor. Motor bantu kedua menggerakkan aksesori supaya mesin tidak terbebani.',
    'Kendali listrik yang cepat memungkinkan motor mengisi celah torsi dalam hitungan milidetik.',
  ),
  'charge-port': noPart(
    'Baterai LaFerrari tidak bisa dicolok.',
    'Soket pengisian memasukkan listrik dari luar ke baterai.',
    'Baterai hanya diisi dari pengereman dan dari kelebihan torsi V12, misalnya saat menikung ketika tenaga mesin tidak terpakai penuh.',
    'Tanpa mode listrik murni, soket dan pengisi daya hanya akan menjadi berat mati.',
  ),
  radiators: part(
    'Radiator utama di depan dan pendingin oli serta transmisi di sisi belakang.',
    'Udara masuk lewat hidung, melewati radiator miring, lalu keluar lewat lubang di kap sehingga ikut menghasilkan downforce. Bukaan di depan roda belakang mendinginkan mesin.',
    'V12 hampir 800 PS membuang panas sangat besar, dan jalur keluarnya dimanfaatkan untuk aerodinamika.',
  ),
  'battery-cooling': part(
    'Sirkuit cairan terpisah yang menjaga suhu baterai dan inverter.',
    'Cairan pendingin mengalir di antara modul baterai. Sirkuit ini bersuhu lebih rendah daripada sirkuit mesin.',
    'Sel yang diisi dan dikuras dengan daya tinggi cepat panas dan harus dijaga agar awet.',
  ),
  'air-paths': part(
    'Udara dipandu melalui bodi: lewat kap depan, sepanjang pinggang, dan keluar di buritan terbuka.',
    'Lubang di kap membuang udara radiator ke atas. Saluran di sisi bodi mengisi radiator belakang, dan buritan terbuka melepas udara panas mesin.',
    'Mengalirkan udara menembus bodi mengurangi hambatan sekaligus menambah downforce.',
  ),
  exhaust: part(
    'Knalpot dari paduan Inconel dengan saluran sama panjang yang keluar di tengah buritan.',
    'Enam saluran tiap deret silinder bergabung menjadi satu, dengan panjang yang disamakan agar denyut gas saling membantu. Inconel tahan panas tinggi dan bisa dibuat sangat tipis.',
    'Saluran sama panjang menaikkan tenaga dan membentuk suara V12 yang melengking.',
  ),
  'suspension-front': part(
    'Wishbone ganda dengan peredam magnetoreologis.',
    'Cairan dalam peredam mengandung partikel besi yang mengental saat diberi medan magnet. Kekerasan berubah dalam milidetik mengikuti kondisi jalan.',
    'Peredam aktif memungkinkan mobil nyaman di jalan dan kaku di sirkuit tanpa mengganti komponen.',
  ),
  'suspension-rear': part(
    'Multilink belakang dengan peredam magnetoreologis.',
    'Beberapa batang mengatur sudut roda saat suspensi bergerak. Peredam bekerja bersama aero aktif menjaga tinggi mobil tetap stabil.',
    'Tinggi mobil yang stabil penting agar diffuser bekerja konsisten.',
  ),
  steering: part(
    'Kemudi berbantuan dengan rasio cepat.',
    'Rasio cepat membuat putaran kemudi kecil sudah cukup di tikungan tajam. Bantuan kemudi disetel agar rasa jalan tetap sampai ke tangan pengemudi.',
    'Umpan balik kemudi dianggap lebih penting daripada kenyamanan.',
  ),
  discs: part(
    'Cakram karbon-keramik Brembo, lebih besar di depan.',
    'Cakram karbon-keramik tahan panas sangat tinggi dan jauh lebih ringan daripada besi tuang. Ia baru bekerja optimal setelah hangat.',
    'Mengerem berulang dari 300 km/jam lebih akan melelehkan rem baja biasa.',
    ['discFrontMm', 'discRearMm'],
  ),
  calipers: part(
    'Kaliper Brembo monoblok yang didinginkan saluran udara khusus.',
    'Kaliper dibuat dari satu blok aluminium agar kaku. Saluran dari bumper meniupkan udara langsung ke kaliper dan cakram.',
    'Kaliper kaku memberi rasa pedal yang konsisten pada pengereman ekstrem.',
  ),
  regen: part(
    'Motor memanen energi saat mengerem dan juga dari kelebihan torsi mesin.',
    'Ketika rem diinjak, motor menahan transmisi dan mengisi baterai. Di tikungan, V12 sengaja diberi beban tambahan oleh motor supaya tetap di putaran efisien sambil mengisi baterai.',
    'Baterai kecil cepat habis, jadi harus diisi kembali di setiap kesempatan.',
  ),
  'air-brake': part(
    'Spoiler belakang aktif yang naik saat pengereman untuk menambah hambatan dan tekanan.',
    'Spoiler tersembunyi di buritan terangkat bersama flap diffuser ketika mengerem keras. Beban pada roda belakang bertambah sehingga mobil tetap stabil.',
    'Menambah beban di belakang saat mengerem memungkinkan rem belakang bekerja lebih keras.',
  ),
  wheels: part(
    'Pelek tempa 19 inci di depan dan 20 inci di belakang.',
    'Pelek tempa lebih kuat dan ringan daripada pelek cor. Diameter belakang lebih besar untuk ban yang jauh lebih lebar.',
    'Roda ringan mengurangi massa tak berpegas sehingga suspensi lebih mudah menjaga kontak ban.',
    ['wheelFrontIn', 'wheelRearIn'],
  ),
  tires: part(
    'Ban Pirelli P Zero Corsa: 265 mm di depan dan 345 mm di belakang.',
    'Ban belakang selebar 345 mm adalah yang terlebar di antara keempat mobil. Komponnya dikembangkan khusus untuk mobil ini.',
    'Hampir 1.000 PS lewat dua roda saja menuntut tapak ban belakang yang sangat lebar.',
    ['tireFrontMm', 'tireRearMm'],
  ),
  'front-aero': part(
    'Sayap depan menggantung di bawah hidung dengan flap aktif di lantai depan.',
    'Sayap kecil di tengah hidung terinspirasi mobil F1. Flap di bawahnya membuka untuk mengurangi hambatan di lintasan lurus.',
    'Downforce depan harus bisa diseimbangkan dengan belakang yang berubah-ubah.',
    ['downforceKg'],
  ),
  underbody: part(
    'Lantai rata dengan diffuser belakang besar berflap aktif.',
    'Udara dipercepat di bawah lantai sehingga tekanannya turun dan mobil terhisap ke aspal. Flap diffuser mengubah besar hisapan itu.',
    'Downforce dari lantai hampir tanpa hambatan tambahan, jadi inilah sumber utamanya.',
  ),
  'rear-wing': part(
    'Spoiler belakang yang tersembunyi dan hanya naik saat dibutuhkan.',
    'Spoiler selebar buritan terangkat otomatis pada kecepatan tinggi dan di tikungan. Saat turun, garis bodi tetap bersih.',
    'Ferrari tidak mau sayap tetap yang merusak bentuk dan menambah hambatan.',
  ),
  'active-aero': part(
    'Flap depan, flap diffuser, dan spoiler belakang yang digerakkan komputer.',
    'Sistem membaca kecepatan, sudut kemudi, dan pengereman lalu memilih konfigurasi downforce tinggi atau hambatan rendah. Perubahan terjadi otomatis tanpa campur tangan pengemudi.',
    'Satu bentuk tetap tidak bisa optimal untuk tikungan dan lintasan lurus sekaligus.',
    ['downforceKg'],
  ),
  seats: part(
    'Dua kursi tetap yang dicetak menyatu dengan bak karbon.',
    'Kursi tidak bisa digeser; yang diatur adalah pedal dan kemudi. Bantalan dibuat sesuai ukuran badan pemilik.',
    'Kursi tetap menurunkan posisi duduk dan titik berat serta menghemat berat rel kursi.',
    ['seats'],
  ),
  dashboard: part(
    'Panel instrumen digital 12,3 inci dan dasbor karbon minimalis.',
    'Layar di depan pengemudi menampilkan takometer besar dan status hibrida. Tidak ada layar tengah besar.',
    'Segala yang tidak membantu mengemudi dibuang.',
  ),
  controls: part(
    'Kemudi bergaya F1 dengan manettino, tombol sein, dan tuas pindah gigi di baliknya.',
    'Hampir semua kendali ada di kemudi sehingga tangan tidak perlu lepas. Kotak pedal digeser maju-mundur untuk menyesuaikan pengemudi.',
    'Tata letak diambil langsung dari mobil balap.',
  ),
  cargo: part(
    'Hampir tanpa bagasi: hanya ruang kecil di hidung.',
    'Ruang depan sebagian besar terisi radiator dan saluran udara. Yang tersisa cukup untuk tas kecil.',
    'Setiap liter ruang dipakai untuk pendinginan dan aerodinamika.',
  ),
  'drive-modes': part(
    'Manettino di kemudi: Wet, Sport, Race, CT Off, dan ESC Off.',
    'Kenop memilih seberapa besar bantuan elektronik dan seagresif apa sistem hibrida bekerja. Sistem hibrida selalu aktif di semua mode.',
    'Pengemudi mengatur batas mobil dari satu kenop tanpa menu.',
  ),
  stability: part(
    'Kendali traksi F1-Trac, E-Diff, dan kendali stabilitas yang terpadu dengan sistem hibrida.',
    'Komputer mengatur torsi mesin, torsi motor, diferensial, dan rem bersama-sama. Motor listrik dipakai untuk menghaluskan penyaluran tenaga saat keluar tikungan.',
    'Motor merespons lebih cepat daripada mesin, sehingga kendali traksi bisa lebih halus.',
  ),
  'driver-assist': noPart(
    'Tidak ada bantuan pengemudi seperti jaga lajur atau kendali jelajah adaptif.',
    'Sistem bantu pengemudi memakai kamera dan radar untuk membantu mengerem dan menjaga lajur.',
    'LaFerrari hanya punya sensor parkir dan kamera mundur. Semua keputusan mengemudi ada pada pengemudi.',
    'Mobil ini dibuat untuk dikemudikan, dan sensor tambahan berarti berat tambahan.',
  ),
};
