import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  ArrowRight, 
  Eye, 
  X, 
  CheckCircle2, 
  Building2, 
  Users, 
  Edit3, 
  Trash2, 
  Paperclip, 
  Upload, 
  Clock, 
  Calendar, 
  Check, 
  Printer, 
  FileText 
} from 'lucide-react';
import { Buyer, buyerService } from '../data/buyerData';

// ==========================================
// TAHAP 1-8 TRANSAKSI LOKAL (SOP KETAT)
// ==========================================
export type TahapLokal = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ItemBarang {
  id: string;
  namaBarang: string;
  spec: string;
  qty: string;
  harga: number;
}

export interface TransaksiLokal {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  tahap: TahapLokal;
  buyerNama: string;
  buyerId?: string;
  
  // Dialog input sesuai permintaan:
  daftarBarang: ItemBarang[];
  waktuMulaiKumpul: string;
  waktuTibaLokasi: string;
  lampiranPdfNama?: string;
  lampiranPdfUrl?: string;

  // Nilai ringkasan:
  jenisBarang: string;
  kuantitas: string;
  spesifikasi: string;
  hargaPermintaan: number;
  kebutuhanPengiriman: string;

  // Tahap lanjutan 2-8:
  produsenNama?: string;
  produsenKategori?: 'Petani' | 'Peternak' | 'Nelayan' | string;
  hargaBeliProdusen?: number;
  jadwalKetersediaanProdusen?: string;
  nilaiDP?: number;
  statusPembayaranDP?: string;
  nomorSuratJalan?: string;
  kendaraanSopir?: string;
  kondisiBarangDiterima?: string;
  statusPelunasan?: string;
  catatanPenutupan?: string;
}

const TAHAP_LOKAL_NAMES: Record<TahapLokal, string> = {
  1: '1. Permintaan Buyer',
  2: '2. Identifikasi Produsen',
  3: '3. Negosiasi Produsen',
  4: '4. Permintaan DP',
  5: '5. Persiapan & Kirim',
  6: '6. Konfirmasi Terima',
  7: '7. Pelunasan',
  8: '8. Selesai'
};

const INITIAL_LOKAL: TransaksiLokal[] = [
  {
    id: 'txl-1',
    nomorTransaksi: 'TXL-202611-001',
    tanggal: '2026-11-01',
    tahap: 8,
    buyerNama: 'PT Sumber Pangan Nusantara',
    buyerId: 'byr-lok-1',
    daftarBarang: [
      {
        id: 'ib-1',
        namaBarang: 'Jagung Pipil Kering Grade A',
        spec: 'Kadar air max 14%, butir utuh bersih',
        qty: '25 Ton',
        harga: 5800
      }
    ],
    waktuMulaiKumpul: '2026-11-02 (Mulai panen & kumpul silo Kendal)',
    waktuTibaLokasi: '2026-11-05 (3 hari sampai Gudang Cikande Banten)',
    lampiranPdfNama: 'PO_Resmi_PT_Sumber_Pangan.pdf',
    lampiranPdfUrl: '#',
    jenisBarang: 'Jagung Pipil Kering Grade A',
    kuantitas: '25 Ton',
    spesifikasi: 'Kadar air max 14%, butir utuh bersih',
    hargaPermintaan: 5800,
    kebutuhanPengiriman: 'Gudang Cikande Banten',
    produsenNama: 'Gapoktan Makmur Tani Kendal',
    produsenKategori: 'Petani',
    hargaBeliProdusen: 5100,
    jadwalKetersediaanProdusen: 'Ready muat 2026-11-03',
    nilaiDP: 43500000,
    statusPembayaranDP: 'Lunas DP (30%)',
    nomorSuratJalan: 'SJ-TER-202611-112',
    kendaraanSopir: 'Truk Fuso B 9812 UI - Pak Joko',
    kondisiBarangDiterima: 'Lolos QC & Diterima Lengkap',
    statusPelunasan: 'Lunas 100%'
  },
  {
    id: 'txl-2',
    nomorTransaksi: 'TXL-202611-002',
    tanggal: '2026-11-04',
    tahap: 4,
    buyerNama: 'Koperasi Peternak Unggas Berkah',
    buyerId: 'byr-lok-2',
    daftarBarang: [
      {
        id: 'ib-2',
        namaBarang: 'Pakan Konsentrat Broiler Starter',
        spec: 'Protein kasar min 21%, Serat max 5%',
        qty: '10 Ton',
        harga: 9500
      }
    ],
    waktuMulaiKumpul: '2026-11-05 (Mulai mixing pabrik Boyolali)',
    waktuTibaLokasi: '2026-11-08 (2 hari ke Sentra Salatiga)',
    lampiranPdfNama: 'Surat_Pesanan_Koperasi_Unggas.pdf',
    lampiranPdfUrl: '#',
    jenisBarang: 'Pakan Konsentrat Broiler Starter',
    kuantitas: '10 Ton',
    spesifikasi: 'Protein kasar min 21%, Serat max 5%',
    hargaPermintaan: 9500,
    kebutuhanPengiriman: 'Kandang Sentra Salatiga & Boyolali',
    produsenNama: 'Sentra Pakan Boyolali',
    produsenKategori: 'Peternak',
    hargaBeliProdusen: 8700,
    jadwalKetersediaanProdusen: 'Ready muat 2026-11-06',
    nilaiDP: 28500000,
    statusPembayaranDP: 'Menunggu Konfirmasi Transfer DP'
  },
  {
    id: 'txl-3',
    nomorTransaksi: 'TXL-202611-003',
    tanggal: '2026-11-06',
    tahap: 1,
    buyerNama: 'PT Japfa Feedmill Cirebon',
    daftarBarang: [
      {
        id: 'ib-3',
        namaBarang: 'Dedak Padi Halus Super',
        spec: 'Kadar air max 12%, serat kasar max 10%',
        qty: '15 Ton',
        harga: 4200
      }
    ],
    waktuMulaiKumpul: '2026-11-08 (Penggilingan padi Subang)',
    waktuTibaLokasi: '2026-11-11 (Gudang Pabrik Cirebon)',
    lampiranPdfNama: 'RFQ_Dedak_Japfa_Nov.pdf',
    lampiranPdfUrl: '#',
    jenisBarang: 'Dedak Padi Halus Super',
    kuantitas: '15 Ton',
    spesifikasi: 'Kadar air max 12%, serat kasar max 10%',
    hargaPermintaan: 4200,
    kebutuhanPengiriman: 'Pabrik Cirebon'
  }
];

export const TransaksiView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTahapFilter, setSelectedTahapFilter] = useState<number | 'ALL'>('ALL');

  // Central Buyer Database
  const [buyerList, setBuyerList] = useState<Buyer[]>(() => buyerService.getBuyers());
  const [isBuyerDbOpen, setIsBuyerDbOpen] = useState(false);
  const [isBuyerFormOpen, setIsBuyerFormOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [buyerFormInput, setBuyerFormInput] = useState<Partial<Buyer>>({
    tipe: 'Lokal',
    kategoriBisnis: 'Industri Pakan',
    negara: 'Indonesia'
  });

  // Local transactions
  const [lokalList, setLokalList] = useState<TransaksiLokal[]>(() => {
    const saved = localStorage.getItem('terniva_flow_transaksi_lokal');
    return saved ? JSON.parse(saved) : INITIAL_LOKAL;
  });

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [advancingLokal, setAdvancingLokal] = useState<TransaksiLokal | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<TransaksiLokal | null>(null);
  const [advanceInput, setAdvanceInput] = useState<any>({});

  // Status Change Confirmation Modal State (Select Option + Simple Confirm + Save)
  interface StatusModalTargetLokal {
    tx: TransaksiLokal;
    targetTahap: TahapLokal;
    catatan?: string;
    produsenNama?: string;
    produsenKategori?: string;
    hargaBeliProdusen?: number;
    nilaiDP?: number;
    nomorSuratJalan?: string;
    kondisiBarangDiterima?: string;
    statusPelunasan?: string;
  }
  const [statusModalTarget, setStatusModalTarget] = useState<StatusModalTargetLokal | null>(null);

  // ========================================================
  // FORM INPUT LOKAL SESUAI PERMINTAAN USER:
  // - pilih mitra buyer
  // - crud barang yg dibutuhkan dan qtynya
  // - spec
  // - qty
  // - harga
  // - waktu (waktu pengumpulan & waktu tiba lokasi)
  // - lampiran (upload pdf)
  // ========================================================
  const [lokalBuyerId, setLokalBuyerId] = useState('');
  const [lokalBuyerNama, setLokalBuyerNama] = useState('');
  const [lokalBarangList, setLokalBarangList] = useState<ItemBarang[]>([
    { id: '1', namaBarang: 'Jagung Pipil Kering Grade A', spec: 'Kadar air max 14%, butir utuh', qty: '20 Ton', harga: 5800 }
  ]);
  const [lokalWaktuKumpul, setLokalWaktuKumpul] = useState('2026-11-10');
  const [lokalWaktuTiba, setLokalWaktuTiba] = useState('2026-11-14');
  const [lokalEstimasiWaktu, setLokalEstimasiWaktu] = useState('3-4 Hari perjalanan ke lokasi buyer');
  const [lokalLampiranFile, setLokalLampiranFile] = useState<File | null>(null);
  const [lokalLampiranNama, setLokalLampiranNama] = useState('');

  // Sync buyer database
  const refreshBuyers = () => {
    setBuyerList(buyerService.getBuyers());
  };

  const saveLokal = (updated: TransaksiLokal[]) => {
    setLokalList(updated);
    localStorage.setItem('terniva_flow_transaksi_lokal', JSON.stringify(updated));
  };

  // Auto-fill when selecting buyer for Lokal
  const handleSelectLokalBuyer = (id: string) => {
    setLokalBuyerId(id);
    if (!id) {
      setLokalBuyerNama('');
      return;
    }
    const found = buyerList.find(b => b.id === id);
    if (found) {
      setLokalBuyerNama(found.nama);
      if (found.produkUtama && lokalBarangList.length > 0) {
        setLokalBarangList(prev => [
          { ...prev[0], namaBarang: found.produkUtama }
        ]);
      }
    }
  };

  // CRUD Barang Lokal
  const handleAddBarangLokal = () => {
    setLokalBarangList([
      ...lokalBarangList,
      { id: `b-${Date.now()}`, namaBarang: '', spec: '', qty: '10 Ton', harga: 5000 }
    ]);
  };

  const handleUpdateBarangLokal = (id: string, field: keyof ItemBarang, val: any) => {
    setLokalBarangList(lokalBarangList.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleDeleteBarangLokal = (id: string) => {
    if (lokalBarangList.length <= 1) {
      alert('Minimal harus ada 1 jenis barang dalam transaksi');
      return;
    }
    setLokalBarangList(lokalBarangList.filter(item => item.id !== id));
  };

  // Handle PDF Upload
  const handlePdfUploadLokal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLokalLampiranFile(file);
      setLokalLampiranNama(file.name);
    }
  };

  // Submit Transaksi Lokal Baru (Tahap 1)
  const handleSubmitLokal = (e: React.FormEvent) => {
    e.preventDefault();
    const rand = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const firstItem = lokalBarangList[0];

    const newTx: TransaksiLokal = {
      id: `txl-${Date.now()}`,
      nomorTransaksi: `TXL-${dateStr}-${rand}`,
      tanggal: new Date().toISOString().split('T')[0],
      tahap: 1,
      buyerNama: lokalBuyerNama,
      buyerId: lokalBuyerId || undefined,
      daftarBarang: lokalBarangList,
      waktuMulaiKumpul: `Mulai: ${lokalWaktuKumpul}`,
      waktuTibaLokasi: `Tiba: ${lokalWaktuTiba} (${lokalEstimasiWaktu})`,
      lampiranPdfNama: lokalLampiranNama || undefined,
      lampiranPdfUrl: lokalLampiranFile ? URL.createObjectURL(lokalLampiranFile) : undefined,
      jenisBarang: lokalBarangList.length === 1 ? firstItem.namaBarang : `${firstItem.namaBarang} (+${lokalBarangList.length - 1} item lain)`,
      kuantitas: firstItem.qty,
      spesifikasi: firstItem.spec,
      hargaPermintaan: firstItem.harga,
      kebutuhanPengiriman: `Sampai di lokasi: ${lokalWaktuTiba}`
    };

    saveLokal([newTx, ...lokalList]);
    setIsCreateOpen(false);
  };

  // Advance Stage Handler
  const handleConfirmAdvanceLokal = () => {
    if (!advancingLokal) return;
    const next = (advancingLokal.tahap + 1) as TahapLokal;
    const updated = lokalList.map(item => {
      if (item.id === advancingLokal.id) {
        return { ...item, tahap: next, ...advanceInput };
      }
      return item;
    });
    saveLokal(updated);
    setAdvancingLokal(null);
    setAdvanceInput({});
  };

  // Select Option -> Confirmation Dialog -> Save Handlers
  const handleOpenStatusModal = (tx: TransaksiLokal, newTahap: TahapLokal) => {
    if (newTahap === tx.tahap) return;
    setStatusModalTarget({
      tx,
      targetTahap: newTahap,
      catatan: '',
      produsenNama: tx.produsenNama || '',
      produsenKategori: tx.produsenKategori || 'Petani',
      hargaBeliProdusen: tx.hargaBeliProdusen || undefined,
      nilaiDP: tx.nilaiDP || undefined,
      nomorSuratJalan: tx.nomorSuratJalan || '',
      kondisiBarangDiterima: tx.kondisiBarangDiterima || 'Lolos QC & Diterima Lengkap',
      statusPelunasan: tx.statusPelunasan || 'Lunas 100%'
    });
  };

  const handleSaveStatusModal = () => {
    if (!statusModalTarget) return;
    const { 
      tx, 
      targetTahap, 
      catatan, 
      produsenNama, 
      produsenKategori, 
      hargaBeliProdusen, 
      nilaiDP, 
      nomorSuratJalan, 
      kondisiBarangDiterima, 
      statusPelunasan 
    } = statusModalTarget;

    const updated = lokalList.map(item => {
      if (item.id === tx.id) {
        return {
          ...item,
          tahap: targetTahap,
          catatanPenutupan: catatan || item.catatanPenutupan,
          ...(produsenNama ? { produsenNama, produsenKategori } : {}),
          ...(hargaBeliProdusen ? { hargaBeliProdusen } : {}),
          ...(nilaiDP ? { nilaiDP, statusPembayaranDP: 'Lunas DP' } : {}),
          ...(nomorSuratJalan ? { nomorSuratJalan } : {}),
          ...(kondisiBarangDiterima ? { kondisiBarangDiterima } : {}),
          ...(statusPelunasan ? { statusPelunasan } : {})
        };
      }
      return item;
    });

    saveLokal(updated);
    setStatusModalTarget(null);
  };

  // CRUD Buyer Handlers
  const handleSaveBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuyer) {
      buyerService.updateBuyer(editingBuyer.id, buyerFormInput);
    } else {
      buyerService.addBuyer({
        nama: buyerFormInput.nama || 'Buyer Baru',
        tipe: 'Lokal',
        kategoriBisnis: buyerFormInput.kategoriBisnis || 'Industri Pakan',
        pic: buyerFormInput.pic || '-',
        telepon: buyerFormInput.telepon || '-',
        email: buyerFormInput.email || '-',
        negara: 'Indonesia',
        kotaAlamat: buyerFormInput.kotaAlamat || '-',
        produkUtama: buyerFormInput.produkUtama || '-'
      });
    }
    refreshBuyers();
    setIsBuyerFormOpen(false);
    setEditingBuyer(null);
  };

  const handleDeleteBuyer = (id: string) => {
    if (confirm('Hapus buyer ini dari database?')) {
      buyerService.deleteBuyer(id);
      refreshBuyers();
    }
  };

  const openAddBuyerModal = () => {
    setEditingBuyer(null);
    setBuyerFormInput({
      nama: '',
      tipe: 'Lokal',
      kategoriBisnis: 'Industri Pakan',
      pic: '',
      telepon: '',
      email: '',
      negara: 'Indonesia',
      kotaAlamat: '',
      produkUtama: ''
    });
    setIsBuyerFormOpen(true);
  };

  const openEditBuyerModal = (b: Buyer) => {
    setEditingBuyer(b);
    setBuyerFormInput({ ...b });
    setIsBuyerFormOpen(true);
  };

  const getBadgeClass = (tahap: number) => {
    if (tahap === 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (tahap === 1) return 'bg-slate-100 text-slate-800 border-slate-200';
    if (tahap === 4) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const localBuyersCount = buyerList.filter(b => b.tipe === 'Lokal').length;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Transaksi Lokal
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              8 Tahap Alur
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mencatat transaksi harian mitra buyer lokal, identifikasi produsen (petani/peternak/nelayan), DP, hingga pelunasan.
          </p>
        </div>

        {/* Database Buyer Button, Search & Add Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBuyerDbOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-200"
            title="Kelola Database Mitra Buyer Lokal"
          >
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>Database Mitra Buyer ({localBuyersCount})</span>
          </button>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari no. transaksi / buyer..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Buat Transaksi Lokal</span>
          </button>
        </div>
      </div>

      {/* Filter Tahap Pills (1 - 8) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedTahapFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
            selectedTahapFilter === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Tahap ({lokalList.length})
        </button>

        {([1, 2, 3, 4, 5, 6, 7, 8] as TahapLokal[]).map(step => {
          const count = lokalList.filter(tx => tx.tahap === step).length;
          return (
            <button
              key={step}
              onClick={() => setSelectedTahapFilter(selectedTahapFilter === step ? 'ALL' : step)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedTahapFilter === step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{TAHAP_LOKAL_NAMES[step]}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedTahapFilter === step ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TABEL TRANSAKSI LOKAL (SEDERHANA, TANPA CARD)           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-4">Mitra Buyer</th>
                <th className="py-3 px-4">Barang & Qty</th>
                <th className="py-3 px-4">Waktu Sampai / Kumpul</th>
                <th className="py-3 px-4">Harga Permintaan</th>
                <th className="py-3 px-4">Lampiran</th>
                <th className="py-3 px-4 text-center">Tahap Saat Ini</th>
                <th className="py-3 px-4 text-center">Aksi Alur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lokalList
                .filter(tx => {
                  const matchStep = selectedTahapFilter === 'ALL' || tx.tahap === selectedTahapFilter;
                  const q = searchQuery.toLowerCase();
                  const matchSearch =
                    tx.nomorTransaksi.toLowerCase().includes(q) ||
                    tx.buyerNama.toLowerCase().includes(q) ||
                    tx.jenisBarang.toLowerCase().includes(q);
                  return matchStep && matchSearch;
                })
                .map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {tx.nomorTransaksi}
                      <span className="block text-[10px] text-slate-400 font-normal">{tx.tanggal}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {tx.buyerNama}
                      {tx.produsenNama && (
                        <div className="text-[10px] text-emerald-700 font-normal mt-0.5">
                          Produsen: {tx.produsenNama} ({tx.produsenKategori || 'Petani'})
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{tx.jenisBarang}</div>
                      <div className="text-[11px] text-slate-500">
                        {tx.daftarBarang ? `${tx.daftarBarang.length} item barang (${tx.kuantitas})` : tx.kuantitas}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium text-slate-900">{tx.waktuTibaLokasi || tx.kebutuhanPengiriman}</div>
                      {tx.waktuMulaiKumpul && (
                        <div className="text-[10px] text-slate-400">{tx.waktuMulaiKumpul}</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">Rp {tx.hargaPermintaan.toLocaleString('id-ID')} / unit</div>
                      {tx.nilaiDP ? (
                        <div className="text-[10px] text-emerald-700 font-medium">DP: Rp {tx.nilaiDP.toLocaleString('id-ID')}</div>
                      ) : (
                        <div className="text-[10px] text-slate-400">Belum DP</div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {tx.lampiranPdfNama ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Paperclip className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate max-w-[110px]">{tx.lampiranPdfNama}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center">
                        <select
                          value={tx.tahap}
                          onChange={(e) => handleOpenStatusModal(tx, Number(e.target.value) as TahapLokal)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs transition ${getBadgeClass(tx.tahap)}`}
                          title="Klik pilihan untuk mengubah status transaksi"
                        >
                          {([1, 2, 3, 4, 5, 6, 7, 8] as TahapLokal[]).map(step => (
                            <option key={step} value={step} className="bg-white text-slate-800 font-semibold py-1">
                              {TAHAP_LOKAL_NAMES[step]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {tx.tahap < 8 ? (
                          <button
                            onClick={() => handleOpenStatusModal(tx, (tx.tahap + 1) as TahapLokal)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                            title={`Lanjut ke ${TAHAP_LOKAL_NAMES[(tx.tahap + 1) as TahapLokal]}`}
                          >
                            <span>Lanjut Tahap {tx.tahap + 1}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-100 rounded border border-emerald-200">
                            Selesai Ditutup
                          </span>
                        )}

                        <button
                          onClick={() => setSelectedDetail(tx)}
                          className="p-1 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIALOG INPUT TRANSAKSI LOKAL (SESUAI PERMINTAAN USER)    */}
      {/* ======================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Form Permintaan Barang dari Buyer (Tahap 1)
                </h3>
                <p className="text-[11px] text-emerald-100">
                  Input data kebutuhan mitra buyer, rincian barang, spesifikasi, kuantitas, harga, estimasi waktu, & lampiran PDF.
                </p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLokal} className="p-5 space-y-4 text-xs">
              {/* 1. PILIH MITRA BUYER */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Pilih Mitra Buyer</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      openAddBuyerModal();
                    }}
                    className="text-[11px] text-emerald-800 font-semibold hover:underline"
                  >
                    + Tambah Mitra Baru ke DB
                  </button>
                </div>

                <select
                  value={lokalBuyerId}
                  onChange={(e) => handleSelectLokalBuyer(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih dari Database Buyer (Atau Ketik Nama di Bawah) --</option>
                  {buyerList
                    .filter(b => b.tipe === 'Lokal')
                    .map(b => (
                      <option key={b.id} value={b.id}>
                        {b.nama} — {b.kotaAlamat.split(',')[0]}
                      </option>
                    ))}
                </select>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Mitra Buyer..."
                    value={lokalBuyerNama}
                    onChange={(e) => setLokalBuyerNama(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* 2. DAFTAR BARANG YANG DIBUTUHKAN & QTY, SPEC, HARGA */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Daftar Barang yang Dibutuhkan</h4>
                    <p className="text-[10px] text-slate-400">Kelola item barang, spesifikasi, kuantitas, dan harga satuan</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBarangLokal}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Tambah Barang</span>
                  </button>
                </div>

                <div className="space-y-2.5 pt-1">
                  {lokalBarangList.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-700">Barang #{idx + 1}</span>
                        {lokalBarangList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteBarangLokal(item.id)}
                            className="text-rose-600 hover:text-rose-800 text-[10px] font-semibold flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus Item</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Nama / Jenis Barang</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Jagung Pipil Kering Grade A"
                            value={item.namaBarang}
                            onChange={(e) => handleUpdateBarangLokal(item.id, 'namaBarang', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Spesifikasi (Spec)</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Kadar air max 14%, butir utuh"
                            value={item.spec}
                            onChange={(e) => handleUpdateBarangLokal(item.id, 'spec', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Kuantitas (Qty)</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 20 Ton"
                            value={item.qty}
                            onChange={(e) => handleUpdateBarangLokal(item.id, 'qty', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Harga Permintaan (Rp / unit)</label>
                          <input
                            type="number"
                            required
                            placeholder="Contoh: 5800"
                            value={item.harga}
                            onChange={(e) => handleUpdateBarangLokal(item.id, 'harga', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. WAKTU PENGUMPULAN & WAKTU TIBA LOKASI */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Kebutuhan Waktu & Estimasi Perjalanan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Mulai Pengumpulan Barang
                    </label>
                    <input
                      type="date"
                      required
                      value={lokalWaktuKumpul}
                      onChange={(e) => setLokalWaktuKumpul(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Waktu Barang Sampai di Lokasi Buyer
                    </label>
                    <input
                      type="date"
                      required
                      value={lokalWaktuTiba}
                      onChange={(e) => setLokalWaktuTiba(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Kebutuhan Pengiriman & Lokasi Penyerahan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 3-4 hari perjalanan ke Gudang Cikande Banten"
                    value={lokalEstimasiWaktu}
                    onChange={(e) => setLokalEstimasiWaktu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              {/* 4. LAMPIRAN (UPLOAD PDF) */}
              <div className="p-3.5 bg-blue-50/50 border border-dashed border-blue-300 rounded-xl space-y-2">
                <label className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <Upload className="w-3.5 h-3.5 text-blue-700" />
                  <span>Lampiran Berkas (Upload PDF)</span>
                </label>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUploadLokal}
                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />

                {lokalLampiranNama && (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-900 bg-blue-100 p-2 rounded">
                    <Paperclip className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span className="font-medium truncate">File terlampir: {lokalLampiranNama}</span>
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Simpan Transaksi Lokal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DATABASE MITRA BUYER LOKAL                      */}
      {/* ======================================================== */}
      {isBuyerDbOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs flex flex-col max-h-[85vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Database Mitra Buyer Lokal</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openAddBuyerModal}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Tambah Mitra Baru</span>
                </button>
                <button onClick={() => setIsBuyerDbOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Nama Mitra Buyer</th>
                      <th className="py-2.5 px-3">Kategori Bisnis</th>
                      <th className="py-2.5 px-3">Kontak & PIC</th>
                      <th className="py-2.5 px-3">Kota / Wilayah</th>
                      <th className="py-2.5 px-3">Produk Utama</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {buyerList
                      .filter(b => b.tipe === 'Lokal')
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {b.nama}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{b.kategoriBisnis}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-800">{b.pic}</div>
                            <div className="text-[10px] text-slate-400">{b.telepon}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-slate-800">{b.kotaAlamat.split(',')[0]}</div>
                            <div className="text-[10px] text-slate-400">{b.negara}</div>
                          </td>
                          <td className="py-2.5 px-3 text-emerald-800 font-semibold">{b.produkUtama}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditBuyerModal(b)}
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                                title="Edit Buyer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBuyer(b.id)}
                                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                title="Hapus Buyer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500 shrink-0">
              <span>Mitra buyer di database ini langsung muncul pada pilihan dropdown saat membuat transaksi lokal.</span>
              <button
                onClick={() => setIsBuyerDbOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT MITRA BUYER */}
      {isBuyerFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="font-bold">
                {editingBuyer ? 'Edit Data Mitra Buyer' : 'Tambah Mitra Buyer Baru ke Database'}
              </h4>
              <button onClick={() => setIsBuyerFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBuyer} className="p-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Mitra Buyer / Perusahaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sumber Pangan Nusantara"
                  value={buyerFormInput.nama || ''}
                  onChange={(e) => setBuyerFormInput({ ...buyerFormInput, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Bisnis</label>
                <select
                  value={buyerFormInput.kategoriBisnis || 'Industri Pakan'}
                  onChange={(e) => setBuyerFormInput({ ...buyerFormInput, kategoriBisnis: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Industri Pakan">Industri Pakan</option>
                  <option value="Modern Retail / Supermarket">Modern Retail / Supermarket</option>
                  <option value="Koperasi Peternak">Koperasi Peternak</option>
                  <option value="Trading / Distributor">Trading / Distributor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama PIC</label>
                  <input
                    type="text"
                    placeholder="Bambang Irawan"
                    value={buyerFormInput.pic || ''}
                    onChange={(e) => setBuyerFormInput({ ...buyerFormInput, pic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telepon / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0812-3344-5566"
                    value={buyerFormInput.telepon || ''}
                    onChange={(e) => setBuyerFormInput({ ...buyerFormInput, telepon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kota / Lokasi Gudang</label>
                <input
                  type="text"
                  placeholder="Kawasan Industri Cikande Banten"
                  value={buyerFormInput.kotaAlamat || ''}
                  onChange={(e) => setBuyerFormInput({ ...buyerFormInput, kotaAlamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Produk Komoditas Utama</label>
                <input
                  type="text"
                  placeholder="Jagung Pipil Kering Grade A"
                  value={buyerFormInput.produkUtama || ''}
                  onChange={(e) => setBuyerFormInput({ ...buyerFormInput, produkUtama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBuyerFormOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DIALOG KONFIRMASI UBAH STATUS (SIMPLE UI & SAVE) */}
      {/* ======================================================== */}
      {statusModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold block">{statusModalTarget.tx.nomorTransaksi}</span>
                <h4 className="font-bold text-sm">Konfirmasi Perubahan Status</h4>
              </div>
              <button onClick={() => setStatusModalTarget(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {/* Info Singkat Transaksi */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">{statusModalTarget.tx.buyerNama}</div>
                <div className="text-[11px] text-slate-500">{statusModalTarget.tx.jenisBarang} • {statusModalTarget.tx.kuantitas}</div>
              </div>

              {/* Status Sebelumnya -> Status Baru */}
              <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="text-center flex-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Status Lama</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeClass(statusModalTarget.tx.tahap)}`}>
                    {TAHAP_LOKAL_NAMES[statusModalTarget.tx.tahap]}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 mx-2" />

                <div className="text-center flex-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block mb-1">Status Baru</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeClass(statusModalTarget.targetTahap)}`}>
                    {TAHAP_LOKAL_NAMES[statusModalTarget.targetTahap]}
                  </span>
                </div>
              </div>

              {/* Form Input Tambahan Sesuai Tahap Tujuan (Opsional) */}
              {statusModalTarget.targetTahap === 2 && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Produsen (Petani / Peternak / Nelayan)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Gapoktan Makmur Tani Kendal"
                      value={statusModalTarget.produsenNama || ''}
                      onChange={(e) => setStatusModalTarget({ ...statusModalTarget, produsenNama: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              )}

              {statusModalTarget.targetTahap === 3 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Harga Beli Disepakati Produsen (Rp / unit)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 5100"
                    value={statusModalTarget.hargaBeliProdusen || ''}
                    onChange={(e) => setStatusModalTarget({ ...statusModalTarget, hargaBeliProdusen: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              )}

              {statusModalTarget.targetTahap === 4 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nilai Down Payment / DP (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 43500000"
                    value={statusModalTarget.nilaiDP || ''}
                    onChange={(e) => setStatusModalTarget({ ...statusModalTarget, nilaiDP: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              )}

              {statusModalTarget.targetTahap === 5 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nomor Surat Jalan Pengiriman</label>
                  <input
                    type="text"
                    placeholder="SJ-TER-202611-112"
                    value={statusModalTarget.nomorSuratJalan || ''}
                    onChange={(e) => setStatusModalTarget({ ...statusModalTarget, nomorSuratJalan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              )}

              {statusModalTarget.targetTahap === 6 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Konfirmasi Penerimaan Barang</label>
                  <select
                    value={statusModalTarget.kondisiBarangDiterima || 'Lolos QC & Diterima Lengkap'}
                    onChange={(e) => setStatusModalTarget({ ...statusModalTarget, kondisiBarangDiterima: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Lolos QC & Diterima Lengkap">Lolos QC & Diterima Lengkap</option>
                    <option value="Diterima Sebagian / Penyesuaian Timbangan">Diterima Sebagian / Penyesuaian Timbangan</option>
                  </select>
                </div>
              )}

              {statusModalTarget.targetTahap === 7 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Pelunasan Buyer</label>
                  <select
                    value={statusModalTarget.statusPelunasan || 'Lunas 100%'}
                    onChange={(e) => setStatusModalTarget({ ...statusModalTarget, statusPelunasan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Lunas 100% (Transfer Masuk Rekening)">Lunas 100% (Transfer Masuk Rekening)</option>
                    <option value="Pelunasan Termin 7 Hari (Tempo)">Pelunasan Termin 7 Hari (Tempo)</option>
                  </select>
                </div>
              )}

              {statusModalTarget.targetTahap === 8 && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-[11px]">
                  Konfirmasi: Seluruh tahapan transaksi lokal telah terpenuhi. Transaksi akan ditutup.
                </div>
              )}

              {/* Catatan / Keterangan Singkat */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Catatan / Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Disetujui bagian operasional / DP telah masuk..."
                  value={statusModalTarget.catatan || ''}
                  onChange={(e) => setStatusModalTarget({ ...statusModalTarget, catatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              {/* Tombol Simpan & Batal */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStatusModalTarget(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatusModal}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: DETAIL TRANSAKSI LOKAL                          */}
      {/* ======================================================== */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-xs">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold block">
                  {selectedDetail.nomorTransaksi}
                </span>
                <h3 className="text-sm font-bold">Rincian Lengkap Transaksi Lokal</h3>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Status Alur */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tahap Transaksi</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border mt-0.5 ${getBadgeClass(selectedDetail.tahap)}`}>
                    {TAHAP_LOKAL_NAMES[selectedDetail.tahap]}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tanggal Transaksi</span>
                  <span className="font-semibold text-slate-900">{selectedDetail.tanggal}</span>
                </div>
              </div>

              {/* Data Mitra Buyer & Produsen */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mitra Buyer</span>
                  <span className="font-bold text-slate-900 text-xs block mt-0.5">{selectedDetail.buyerNama}</span>
                  <span className="text-[11px] text-slate-500">{selectedDetail.kebutuhanPengiriman}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Produsen / Pemasok</span>
                  <span className="font-bold text-slate-900 text-xs block mt-0.5">
                    {selectedDetail.produsenNama || 'Belum ditunjuk (Tahap 2)'}
                  </span>
                  {selectedDetail.produsenKategori && (
                    <span className="text-[11px] text-emerald-700 font-medium">Kategori: {selectedDetail.produsenKategori}</span>
                  )}
                </div>
              </div>

              {/* Rincian Barang (CRUD Table View) */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rincian Barang yang Dipesan:</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Nama Barang</th>
                        <th className="py-2 px-3">Spesifikasi</th>
                        <th className="py-2 px-3 text-right">Kuantitas</th>
                        <th className="py-2 px-3 text-right">Harga Permintaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedDetail.daftarBarang || []).map((b, i) => (
                        <tr key={b.id || i}>
                          <td className="py-2 px-3 font-semibold text-slate-900">{b.namaBarang}</td>
                          <td className="py-2 px-3 text-slate-600">{b.spec}</td>
                          <td className="py-2 px-3 text-right font-medium">{b.qty}</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                            Rp {b.harga.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Waktu & Jadwal */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Kebutuhan Waktu:</span>
                <div>{selectedDetail.waktuMulaiKumpul}</div>
                <div>{selectedDetail.waktuTibaLokasi}</div>
              </div>

              {/* Status Keuangan & Pengiriman */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Status DP & Pelunasan</span>
                  <div className="font-bold text-emerald-950 mt-0.5">
                    {selectedDetail.nilaiDP ? `DP: Rp ${selectedDetail.nilaiDP.toLocaleString('id-ID')}` : 'Belum Ada DP'}
                  </div>
                  <div className="text-[11px] text-emerald-700">{selectedDetail.statusPembayaranDP || '-'}</div>
                  {selectedDetail.statusPelunasan && (
                    <div className="text-[11px] font-semibold text-emerald-900 mt-1">Pelunasan: {selectedDetail.statusPelunasan}</div>
                  )}
                </div>

                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-800 uppercase font-bold block">Surat Jalan & Pengiriman</span>
                  <div className="font-mono font-bold text-blue-950 mt-0.5">
                    {selectedDetail.nomorSuratJalan || 'Belum Terbit (Tahap 5)'}
                  </div>
                  <div className="text-[11px] text-blue-700">{selectedDetail.kendaraanSopir || '-'}</div>
                  {selectedDetail.kondisiBarangDiterima && (
                    <div className="text-[11px] font-semibold text-blue-900 mt-1">Terima: {selectedDetail.kondisiBarangDiterima}</div>
                  )}
                </div>
              </div>

              {/* Lampiran PDF */}
              {selectedDetail.lampiranPdfNama && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-900 block">{selectedDetail.lampiranPdfNama}</span>
                      <span className="text-[10px] text-slate-400">Dokumen Lampiran PDF</span>
                    </div>
                  </div>
                  {selectedDetail.lampiranPdfUrl && selectedDetail.lampiranPdfUrl !== '#' && (
                    <a
                      href={selectedDetail.lampiranPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition"
                    >
                      Buka PDF
                    </a>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
