export interface Buyer {
  id: string;
  nama: string;
  tipe: 'Lokal' | 'Ekspor';
  kategoriBisnis: 'Industri Pakan' | 'Modern Retail / Supermarket' | 'Koperasi Peternak' | 'Trading / Distributor' | 'Importir Global';
  pic: string;
  telepon: string;
  email: string;
  negara: string;
  kotaAlamat: string;
  produkUtama: string;
  terminPreferensi?: string;
  createdAt: string;
}

export const INITIAL_BUYERS: Buyer[] = [
  {
    id: 'byr-lok-1',
    nama: 'PT Sumber Pangan Nusantara',
    tipe: 'Lokal',
    kategoriBisnis: 'Industri Pakan',
    pic: 'Bambang Irawan (Procurement Manager)',
    telepon: '0812-3344-5566',
    email: 'procurement@sumberpangan.co.id',
    negara: 'Indonesia',
    kotaAlamat: 'Kawasan Industri Cikande, Serang, Banten',
    produkUtama: 'Jagung Pipil Kering Grade A',
    terminPreferensi: 'DP 30%, Pelunasan 7 hari setelah BAST',
    createdAt: '2026-10-15'
  },
  {
    id: 'byr-lok-2',
    nama: 'Koperasi Peternak Unggas Berkah',
    tipe: 'Lokal',
    kategoriBisnis: 'Koperasi Peternak',
    pic: 'H. Sudirman (Ketua Pengadaan)',
    telepon: '0813-8899-7700',
    email: 'koperasi.unggasberkah@gmail.com',
    negara: 'Indonesia',
    kotaAlamat: 'Kandang Sentra Salatiga & Ampel Boyolali',
    produkUtama: 'Pakan Konsentrat Broiler Starter',
    terminPreferensi: 'DP 30%, Sisa setelah kirim',
    createdAt: '2026-10-20'
  },
  {
    id: 'byr-lok-3',
    nama: 'Superindo Retail Jawa Tengah',
    tipe: 'Lokal',
    kategoriBisnis: 'Modern Retail / Supermarket',
    pic: 'Dewi Lestari (Fresh Produce Buyer)',
    telepon: '0811-2233-4455',
    email: 'fresh.procurement@superindo.co.id',
    negara: 'Indonesia',
    kotaAlamat: 'Distribution Center Tambakaji, Semarang',
    produkUtama: 'Telur Ayam Ras Coklat Segar',
    terminPreferensi: 'TOP 14 Hari',
    createdAt: '2026-10-25'
  },
  {
    id: 'byr-lok-4',
    nama: 'PT Charoen Pokphand Indonesia Tbk',
    tipe: 'Lokal',
    kategoriBisnis: 'Industri Pakan',
    pic: 'Hendra Wijaya (Raw Material Dept)',
    telepon: '021-691-9999',
    email: 'feedmill.purchasing@cp.co.id',
    negara: 'Indonesia',
    kotaAlamat: 'Plant Feedmill Semarang & Balaraja',
    produkUtama: 'Jagung Pipil Kering & Bekatul',
    terminPreferensi: 'CBD / DP 50%',
    createdAt: '2026-10-28'
  },
  {
    id: 'byr-exp-1',
    nama: 'SG Agro Foods Pte Ltd',
    tipe: 'Ekspor',
    kategoriBisnis: 'Importir Global',
    pic: 'Mr. Tan Wei Ming',
    telepon: '+65 6789 2100',
    email: 'procurement@sgagrofoods.com.sg',
    negara: 'Singapura',
    kotaAlamat: '12 Marina Boulevard, Marina Bay Tower 3, Singapore',
    produkUtama: 'Jagung Pipil Kering Grade Ekspor',
    terminPreferensi: 'TT (30% Advance, 70% vs BL copy)',
    createdAt: '2026-10-12'
  },
  {
    id: 'byr-exp-2',
    nama: 'Malaya Feedmills Berhad',
    tipe: 'Ekspor',
    kategoriBisnis: 'Industri Pakan',
    pic: 'Haji Azlan Shah',
    telepon: '+60 3 5519 8820',
    email: 'import@malayafeed.com.my',
    negara: 'Malaysia',
    kotaAlamat: 'Kawasan Perindustrian Shah Alam, Selangor',
    produkUtama: 'Dedak Padi Halus Fermentasi',
    terminPreferensi: 'Irrevocable LC at Sight',
    createdAt: '2026-10-18'
  },
  {
    id: 'byr-exp-3',
    nama: 'Vietnam Agri-Commodities Corp (VINACO)',
    tipe: 'Ekspor',
    kategoriBisnis: 'Importir Global',
    pic: 'Ms. Nguyen Thi Mai',
    telepon: '+84 28 3822 5590',
    email: 'trade@vinaco-agri.vn',
    negara: 'Vietnam',
    kotaAlamat: 'District 1, Ho Chi Minh City, Vietnam',
    produkUtama: 'Tepung Daun Kelor Organik Mesh 80',
    terminPreferensi: 'DP 50%, Sisa saat NPE terbit',
    createdAt: '2026-10-26'
  }
];

export const buyerService = {
  getBuyers(): Buyer[] {
    const saved = localStorage.getItem('terniva_central_buyers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BUYERS;
  },

  saveBuyers(list: Buyer[]) {
    localStorage.setItem('terniva_central_buyers', JSON.stringify(list));
  },

  addBuyer(buyer: Omit<Buyer, 'id' | 'createdAt'>): Buyer {
    const list = this.getBuyers();
    const newBuyer: Buyer = {
      ...buyer,
      id: `byr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newBuyer, ...list];
    this.saveBuyers(updated);
    return newBuyer;
  },

  updateBuyer(id: string, data: Partial<Buyer>): Buyer[] {
    const list = this.getBuyers();
    const updated = list.map(b => b.id === id ? { ...b, ...data } : b);
    this.saveBuyers(updated);
    return updated;
  },

  deleteBuyer(id: string): Buyer[] {
    const list = this.getBuyers();
    const updated = list.filter(b => b.id !== id);
    this.saveBuyers(updated);
    return updated;
  }
};
