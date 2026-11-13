import type { CarId } from './ids';

export const FLOW_NODES = ['battery', 'tank', 'motorF', 'motor', 'engine', 'front', 'rear', 'heat'] as const;
export type FlowNode = (typeof FLOW_NODES)[number];
export const FLOW_STATES = ['accel', 'cruise', 'brake'] as const;
export type FlowState = (typeof FLOW_STATES)[number];

export interface FlowEdge {
  from: FlowNode;
  to: FlowNode;
  note: string;
}

const e = (from: FlowNode, to: FlowNode, note: string): FlowEdge => ({ from, to, note });

/** Qualitative energy paths per car and driving state. `motor` is the rear (or only) motor. */
export const ENERGY_FLOWS: Record<CarId, Record<FlowState, FlowEdge[]>> = {
  seal: {
    accel: [
      e('battery', 'motorF', 'Inverter depan menyalakan motor induksi saat butuh tenaga penuh.'),
      e('battery', 'motor', 'Motor belakang magnet permanen adalah penggerak utama.'),
      e('motorF', 'front', 'Roda depan ikut menarik: inilah penggerak empat roda.'),
      e('motor', 'rear', 'Torsi langsung ke roda belakang lewat satu gigi tetap.'),
    ],
    cruise: [
      e('battery', 'motor', 'Saat melaju santai hanya motor belakang yang bekerja.'),
      e('motor', 'rear', 'Motor depan berputar bebas hampir tanpa hambatan.'),
    ],
    brake: [
      e('front', 'motorF', 'Roda memutar motor depan sebagai generator.'),
      e('rear', 'motor', 'Roda memutar motor belakang sebagai generator.'),
      e('motorF', 'battery', 'Energi kembali ke baterai.'),
      e('motor', 'battery', 'Energi kembali ke baterai.'),
      e('front', 'heat', 'Cakram baja baru bekerja keras pada pengereman kuat.'),
    ],
  },
  laferrari: {
    accel: [
      e('tank', 'engine', 'V12 membakar bensin.'),
      e('engine', 'rear', 'Lewat kopling ganda 7 tingkat ke roda belakang.'),
      e('battery', 'motor', 'Baterai kecil melepas daya tinggi dalam waktu singkat.'),
      e('motor', 'rear', 'Motor menambah tenaga dan mengisi torsi di putaran rendah.'),
    ],
    cruise: [
      e('tank', 'engine', 'V12 bekerja sendiri; tidak ada mode listrik murni.'),
      e('engine', 'rear', 'Tenaga mesin ke roda belakang.'),
      e('engine', 'motor', 'Kelebihan torsi mesin memutar motor sebagai generator.'),
      e('motor', 'battery', 'Baterai diisi dari mesin.'),
    ],
    brake: [
      e('rear', 'motor', 'Motor memanen sebagian energi pengereman.'),
      e('motor', 'battery', 'Energi kembali ke baterai.'),
      e('front', 'heat', 'Sisanya menjadi panas di cakram karbon-keramik.'),
      e('rear', 'heat', 'Sisanya menjadi panas di cakram karbon-keramik.'),
    ],
  },
  p1: {
    accel: [
      e('tank', 'engine', 'V8 twin-turbo membakar bensin.'),
      e('engine', 'rear', 'Lewat kopling ganda 7 tingkat ke roda belakang.'),
      e('battery', 'motor', 'Motor mengisi jeda turbo; tombol IPAS melepas seluruh dayanya.'),
      e('motor', 'rear', 'Torsi instan menutup celah sebelum turbo bertekanan penuh.'),
    ],
    cruise: [
      e('tank', 'engine', 'V8 bekerja; dalam mode E mobil bisa berjalan dengan baterai saja.'),
      e('engine', 'rear', 'Tenaga mesin ke roda belakang.'),
      e('engine', 'motor', 'Mesin bisa memutar motor untuk mengisi baterai.'),
      e('motor', 'battery', 'Baterai diisi dari mesin, atau dari colokan saat parkir.'),
    ],
    brake: [
      e('front', 'heat', 'Pedal rem sengaja murni hidraulik demi rasa pedal.'),
      e('rear', 'heat', 'Energi rem menjadi panas di cakram karbon-keramik.'),
      e('rear', 'motor', 'Motor hanya memanen saat pedal gas dilepas, bukan lewat pedal rem.'),
      e('motor', 'battery', 'Sebagian kecil energi kembali ke baterai.'),
    ],
  },
  senna: {
    accel: [
      e('tank', 'engine', 'V8 twin-turbo adalah satu-satunya sumber tenaga.'),
      e('engine', 'rear', 'Lewat kopling ganda 7 tingkat ke roda belakang.'),
    ],
    cruise: [
      e('tank', 'engine', 'Selalu bensin; tidak ada listrik traksi.'),
      e('engine', 'rear', 'Tenaga mesin ke roda belakang.'),
    ],
    brake: [
      e('front', 'heat', 'Seluruh energi rem terbuang sebagai panas.'),
      e('rear', 'heat', 'Tidak ada yang dipanen; sayap menegak sebagai rem udara.'),
    ],
  },
};
