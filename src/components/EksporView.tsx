import React, { useState } from 'react';
import { 
  Globe2, 
  PlusCircle, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Printer, 
  X, 
  Eye, 
  Edit3, 
  Trash2, 
  Ship, 
  Building2, 
  ArrowRight, 
  Paperclip, 
  Upload, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  Check
} from 'lucide-react';
import { Buyer, buyerService } from '../data/buyerData';

// ==========================================
// 1. TAHAP 1-7 TRANSAKSI EKSPOR (SOP KETAT)
// ==========================================
export type TahapEkspor = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ItemBarangEkspor {
  id: string;
  namaBarang: string;
  spec: string;
  qty: string;
  harga: number; // in USD
}

export interface TransaksiEkspor {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  tahap: TahapEkspor;
  buyerNama: string;
  buyerId?: string;
  negaraTujuan: string;

  // Dialog input sesuai permintaan:
  daftarBarang: ItemBarangEkspor[];
  waktuPengiriman: string;
  waktuTibaPelabuhan: string;
  incoterms: string;
  lampiranPdfNama?: string;
  lampiranPdfUrl?: string;

  // Nilai ringkasan:
  komoditas: string;
  spesifikasi: string;
  kuantitas: string;
  hargaUSD: number;

  // Tahap lanjutan 2-7:
  nomorResiSampel?: string;
  statusApprovalSampel?: string;
  nomorPOKontrak?: string;
  nilaiDPEksporUSD?: number;
  pelabuhanMuat?: string;
  statusPelunasanSebelumKapal?: string;
  catatanPenutupan?: string;
}

const TAHAP_EKSPOR_NAMES: Record<TahapEkspor, string> = {
  1: '1. Penawaran Buyer',
  2: '2. Pengiriman Sampel',
  3: '3. Persetujuan Sampel',
  4: '4. Kesepakatan & DP',
  5: '5. Persiapan & Pelabuhan',
  6: '6. Pelunasan Pra-Kapal',
  7: '7. Selesai'
};

const INITIAL_EKSPOR_TX: TransaksiEkspor[] = [
  {
    id: 'txe-1',
    nomorTransaksi: 'TXE-202611-001',
    tanggal: '2026-10-25',
    tahap: 7,
    buyerNama: 'SG Agro Foods Pte Ltd',
    buyerId: 'byr-1',
    negaraTujuan: 'Singapura',
    daftarBarang: [
      {
        id: 'ib-e1',
        namaBarang: 'Jagung Pipil Kering Grade Ekspor',
        spec: 'Kadar air max 13.5%, Benda asing < 1%, Aflatoksin < 20ppb',
        qty: '50 MT',
        harga: 245
      }
    ],
    waktuPengiriman: '2026-11-04 (Mulai stuffing kontainer & muat kapal)',
    waktuTibaPelabuhan: '2026-11-09 (ETA Port of Singapore)',
    incoterms: 'FOB',
    lampiranPdfNama: 'Sales_Contract_SG_Agro_Foods.pdf',
    lampiranPdfUrl: '#',
    komoditas: 'Jagung Pipil Kering Grade Ekspor',
    spesifikasi: 'Kadar air max 13.5%, Benda asing < 1%',
    kuantitas: '50 MT',
    hargaUSD: 245,
    nomorResiSampel: 'DHL-8492019482',
    statusApprovalSampel: 'Approved Lolos Uji Lab',
    nomorPOKontrak: 'PO-SGAGRO-2026-109',
    nilaiDPEksporUSD: 3675,
    pelabuhanMuat: 'Tanjung Emas Semarang',
    statusPelunasanSebelumKapal: 'Lunas 100% Sebelum Kapal'
  },
  {
    id: 'txe-2',
    nomorTransaksi: 'TXE-202611-002',
    tanggal: '2026-11-03',
    tahap: 2,
    buyerNama: 'Malaya Feedmills Berhad',
    buyerId: 'byr-2',
    negaraTujuan: 'Malaysia',
    daftarBarang: [
      {
        id: 'ib-e2',
        namaBarang: 'Dedak Padi Halus Fermentasi',
        spec: 'Protein kasar min 12%, Serat kasar max 11%, Kadar air max 12%',
        qty: '25 MT',
        harga: 190
      }
    ],
    waktuPengiriman: '2026-11-15 (Target Muat Kapal Semarang)',
    waktuTibaPelabuhan: '2026-11-20 (ETA Port Klang Malaysia)',
    incoterms: 'CIF',
    lampiranPdfNama: 'Inquiry_Dedak_Malaya_Nov.pdf',
    lampiranPdfUrl: '#',
    komoditas: 'Dedak Padi Halus Fermentasi',
    spesifikasi: 'Protein kasar min 12%, Serat kasar max 11%',
    kuantitas: '25 MT',
    hargaUSD: 190,
    nomorResiSampel: 'FEDEX-7719203948',
    statusApprovalSampel: 'Sampel Terkirim (In Transit)'
  }
];

// ==========================================
// 2. BUYER TYPES & INITIAL DATA
// ==========================================
export interface ExportBuyer {
  id: string;
  nama: string;
  email: string;
  kontak: string;
  negara: string;
  alamat: string;
  produk: string;
  spek: string;
  harga: string;
  qty: string;
  keterangan: string;
  createdAt: string;
}

const INITIAL_BUYERS: ExportBuyer[] = [
  {
    id: 'byr-1',
    nama: 'SG Agro Foods Pte Ltd',
    email: 'procurement@sgagrofoods.com.sg',
    kontak: '+65 6789 2100',
    negara: 'Singapura',
    alamat: '12 Marina Boulevard, Marina Bay Financial Centre Tower 3, Singapore 018982',
    produk: 'Jagung Pipil Kering Grade A',
    spek: 'Kadar air max 13.5%, Benda asing < 1.0%, Bebas kutu hidup & aflatoksin < 20 ppb',
    harga: 'USD 245 / MT (FOB Semarang)',
    qty: '100 MT / Bulan (4 Kontainer 40ft)',
    keterangan: 'Buyer tetap pakan ayam dan puyuh komersial di wilayah Jurong & Lim Chu Kang',
    createdAt: '2026-10-15'
  },
  {
    id: 'byr-2',
    nama: 'Malaya Feedmills Berhad',
    email: 'import@malayafeed.com.my',
    kontak: '+60 3 5519 8820',
    negara: 'Malaysia',
    alamat: 'Kawasan Perindustrian Shah Alam, Seksyen 15, 40200 Shah Alam, Selangor',
    produk: 'Dedak Padi Halus & Jagung Silase',
    spek: 'Protein kasar min 12%, Serat kasar max 11%, Kadar air max 12%',
    harga: 'USD 190 / MT (CIF Port Klang)',
    qty: '50 MT / Bulan',
    keterangan: 'Kontrak kuartalan, pembayaran TT 30% Advance + 70% Against BL Copy',
    createdAt: '2026-10-22'
  },
  {
    id: 'byr-3',
    nama: 'Vietnam Agri-Commodities Corp (VINACO)',
    email: 'trade@vinaco-agri.vn',
    kontak: '+84 28 3822 5590',
    negara: 'Vietnam',
    alamat: 'District 1, Ho Chi Minh City, Vietnam',
    produk: 'Tepung Daun Kelor & Pakan Konsentrat',
    spek: 'Grade Premium Organic, Mesh 80, Warna hijau cerah bebas pewarna kimia',
    harga: 'USD 620 / MT (FOB Surabaya)',
    qty: '20 MT / Bulan',
    keterangan: 'Sedang proses verifikasi sample tahap 2 oleh Badan Karantina Vietnam',
    createdAt: '2026-11-01'
  }
];

// ==========================================
// 3. EXPORT DOCUMENT TYPES & INITIAL DATA
// ==========================================
export type ExportDocChoice = 
  | 'COO'
  | 'PHYTO'
  | 'HEALTH'
  | 'COA'
  | 'FUMIGATION'
  | 'INSURANCE'
  | 'EXPORT_PERMIT';

export interface ExportDocumentItem {
  id: string;
  type: ExportDocChoice;
  nomorDokumen: string;
  buyerNama: string;
  negaraTujuan: string;
  komoditas: string;
  instansiPenerbit: string;
  tanggalTerbit: string;
  masaBerlaku: string;
  status: 'Aktif / Terbit' | 'Dalam Proses' | 'Expired';
  keterangan: string;
}

const EXPORT_DOC_DEFINITIONS: Record<ExportDocChoice, { nama: string; artiFungsi: string }> = {
  COO: {
    nama: 'Certificate of Origin (COO / SKA)',
    artiFungsi: 'Surat Keterangan Asal. Membuktikan negara asal barang bahwa produk diproduksi di Indonesia.'
  },
  PHYTO: {
    nama: 'Phytosanitary Certificate (PHYTO)',
    artiFungsi: 'Sertifikat kesehatan tumbuhan, biasanya untuk ekspor hasil pertanian, tanaman, buah, dan rempah.'
  },
  HEALTH: {
    nama: 'Health Certificate (HEALTH)',
    artiFungsi: 'Sertifikat kesehatan produk, umumnya untuk produk pangan olahan atau produk hewan ternak.'
  },
  COA: {
    nama: 'Certificate of Analysis (COA)',
    artiFungsi: 'Sertifikat hasil analisis laboratorium yang menunjukkan spesifikasi kadar dan kualitas produk.'
  },
  FUMIGATION: {
    nama: 'Fumigation Certificate (FUMIGATION)',
    artiFungsi: 'Sertifikat bahwa barang atau kemasan telah menjalani fumigasi (pembasmian hama) sebelum naik kapal.'
  },
  INSURANCE: {
    nama: 'Insurance Certificate (INSURANCE)',
    artiFungsi: 'Bukti perlindungan asuransi maritim atas barang kargo selama pelayaran pengiriman internasional.'
  },
  EXPORT_PERMIT: {
    nama: 'Export Permit (Persetujuan Ekspor)',
    artiFungsi: 'Izin atau persetujuan resmi dari Kemendag / Bea Cukai untuk mengekspor barang tertentu.'
  }
};

const INITIAL_EXPORT_DOCS: ExportDocumentItem[] = [
  {
    id: 'edoc-1',
    type: 'COO',
    nomorDokumen: 'COO-INA-SG-202611-0082',
    buyerNama: 'SG Agro Foods Pte Ltd',
    negaraTujuan: 'Singapura',
    komoditas: 'Jagung Pipil Kering (50 MT)',
    instansiPenerbit: 'Dinas Perdagangan Provinsi Jawa Tengah (SKA Form D)',
    tanggalTerbit: '2026-11-03',
    masaBerlaku: '2027-05-03',
    status: 'Aktif / Terbit',
    keterangan: 'Tarif preferensi ASEAN Free Trade Area (ATIGA)'
  },
  {
    id: 'edoc-2',
    type: 'PHYTO',
    nomorDokumen: 'PHYTO-BKP-SMG-2026-1194',
    buyerNama: 'SG Agro Foods Pte Ltd',
    negaraTujuan: 'Singapura',
    komoditas: 'Jagung Pipil Kering Silo 1',
    instansiPenerbit: 'Balai Karantina Pertanian Kelas I Semarang',
    tanggalTerbit: '2026-11-04',
    masaBerlaku: '2026-11-18',
    status: 'Aktif / Terbit',
    keterangan: 'Bebas Sitophilus zeamais dan jamur Aspergillus flavus'
  },
  {
    id: 'edoc-3',
    type: 'COA',
    nomorDokumen: 'COA-SUCO-2026-8812',
    buyerNama: 'SG Agro Foods Pte Ltd',
    negaraTujuan: 'Singapura',
    komoditas: 'Jagung Pipil Kering',
    instansiPenerbit: 'PT Sucofindo (Persero) Laboratorium Semarang',
    tanggalTerbit: '2026-11-02',
    masaBerlaku: '2026-12-02',
    status: 'Aktif / Terbit',
    keterangan: 'Kadar Air: 13.2%, Benda Asing: 0.6%, Aflatoksin: 11.2 ppb'
  },
  {
    id: 'edoc-4',
    type: 'FUMIGATION',
    nomorDokumen: 'FUM-AFAS-2026-441',
    buyerNama: 'SG Agro Foods Pte Ltd',
    negaraTujuan: 'Singapura',
    komoditas: '2 Kontainer 40ft (50 MT)',
    instansiPenerbit: 'PT Fumindo Pest Mandiri (Certified AFAS Operator)',
    tanggalTerbit: '2026-11-04',
    masaBerlaku: '2026-11-25',
    status: 'Aktif / Terbit',
    keterangan: 'Methyl Bromide treatment 48g/m3 selama 24 jam'
  },
  {
    id: 'edoc-5',
    type: 'EXPORT_PERMIT',
    nomorDokumen: 'PEB-NPE-089123-2026',
    buyerNama: 'SG Agro Foods Pte Ltd',
    negaraTujuan: 'Singapura',
    komoditas: 'Jagung Pipil Kering',
    instansiPenerbit: 'KPPBC Tipe Madya Pabean Tanjung Emas',
    tanggalTerbit: '2026-11-05',
    masaBerlaku: '2026-11-12',
    status: 'Aktif / Terbit',
    keterangan: 'NPE Resmi Bea Cukai Jalur Hijau Ekspor'
  }
];

interface EksporViewProps {
  onNotify?: (msg: string) => void;
}

export const EksporView: React.FC<EksporViewProps> = ({ onNotify }) => {
  // Navigation Tabs within Ekspor (Separated & Dedicated)
  const [activeTab, setActiveTab] = useState<'transaksi' | 'buyer' | 'dokumen'>('transaksi');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. TRANSAKSI EKSPOR (7 TAHAP FLOW)
  const [eksporTxList, setEksporTxList] = useState<TransaksiEkspor[]>(() => {
    const saved = localStorage.getItem('terniva_flow_transaksi_ekspor');
    return saved ? JSON.parse(saved) : INITIAL_EKSPOR_TX;
  });
  const [selectedTahapFilter, setSelectedTahapFilter] = useState<number | 'ALL'>('ALL');
  const [isCreateTxOpen, setIsCreateTxOpen] = useState(false);
  const [advancingEkspor, setAdvancingEkspor] = useState<TransaksiEkspor | null>(null);
  const [selectedTxDetail, setSelectedTxDetail] = useState<TransaksiEkspor | null>(null);
  const [advanceInput, setAdvanceInput] = useState<any>({});

  // Status Change Confirmation Modal State (Select Option + Simple Confirm + Save)
  interface StatusModalTargetEkspor {
    tx: TransaksiEkspor;
    targetTahap: TahapEkspor;
    catatan?: string;
    nomorResiSampel?: string;
    statusApprovalSampel?: string;
    nomorPOKontrak?: string;
    nilaiDPEksporUSD?: number;
    pelabuhanMuat?: string;
    statusPelunasanSebelumKapal?: string;
  }
  const [statusModalTargetEkspor, setStatusModalTargetEkspor] = useState<StatusModalTargetEkspor | null>(null);

  // Dialog Form Input Ekspor (User Requirement):
  // - pilih buyer ekspor
  // - crud barang (komoditas, spec, qty, harga USD)
  // - spec
  // - waktu (jadwal kirim pelabuhan & target tiba)
  // - qty
  // - harga
  // - incoterm
  // - lampiran (upload pdf)
  const [eksporBuyerId, setEksporBuyerId] = useState('');
  const [eksporBuyerNama, setEksporBuyerNama] = useState('');
  const [eksporNegara, setEksporNegara] = useState('Singapura');
  const [eksporBarangList, setEksporBarangList] = useState<ItemBarangEkspor[]>([
    { id: '1', namaBarang: 'Jagung Pipil Kering Grade Ekspor', spec: 'Kadar air max 13.5%, Benda asing < 1%', qty: '50 MT', harga: 245 }
  ]);
  const [eksporWaktuKirim, setEksporWaktuKirim] = useState('2026-11-12');
  const [eksporWaktuTiba, setEksporWaktuTiba] = useState('2026-11-18');
  const [eksporIncoterm, setEksporIncoterm] = useState('FOB');
  const [eksporLampiranFile, setEksporLampiranFile] = useState<File | null>(null);
  const [eksporLampiranNama, setEksporLampiranNama] = useState('');

  // 2. BUYER STATE
  const [buyers, setBuyers] = useState<ExportBuyer[]>(() => {
    const saved = localStorage.getItem('terniva_export_buyers');
    return saved ? JSON.parse(saved) : INITIAL_BUYERS;
  });
  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<ExportBuyer | null>(null);
  const [buyerToDelete, setBuyerToDelete] = useState<ExportBuyer | null>(null);
  const [buyerForm, setBuyerForm] = useState<Partial<ExportBuyer>>({ negara: 'Singapura' });

  // 3. EXPORT DOCS STATE
  const [exportDocs, setExportDocs] = useState<ExportDocumentItem[]>(() => {
    const saved = localStorage.getItem('terniva_export_docs');
    return saved ? JSON.parse(saved) : INITIAL_EXPORT_DOCS;
  });
  const [selectedDocTypeFilter, setSelectedDocTypeFilter] = useState<ExportDocChoice | 'ALL'>('ALL');
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<ExportDocumentItem | null>(null);
  const [docForm, setDocForm] = useState<Partial<ExportDocumentItem>>({
    type: 'COO',
    instansiPenerbit: 'Dinas Perdagangan Provinsi Jawa Tengah',
    status: 'Aktif / Terbit'
  });

  // 4. MANAGEMENT STATE

  // Storage Savers
  const saveEksporTx = (updated: TransaksiEkspor[]) => {
    setEksporTxList(updated);
    localStorage.setItem('terniva_flow_transaksi_ekspor', JSON.stringify(updated));
  };

  const saveBuyers = (updated: ExportBuyer[]) => {
    setBuyers(updated);
    localStorage.setItem('terniva_export_buyers', JSON.stringify(updated));
  };

  const saveExportDocs = (updated: ExportDocumentItem[]) => {
    setExportDocs(updated);
    localStorage.setItem('terniva_export_docs', JSON.stringify(updated));
  };

  // CRUD Barang Ekspor
  const handleAddBarangEkspor = () => {
    setEksporBarangList([
      ...eksporBarangList,
      { id: `be-${Date.now()}`, namaBarang: '', spec: '', qty: '25 MT', harga: 200 }
    ]);
  };

  const handleUpdateBarangEkspor = (id: string, field: keyof ItemBarangEkspor, val: any) => {
    setEksporBarangList(eksporBarangList.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleDeleteBarangEkspor = (id: string) => {
    if (eksporBarangList.length <= 1) {
      alert('Minimal harus ada 1 jenis komoditas dalam transaksi ekspor');
      return;
    }
    setEksporBarangList(eksporBarangList.filter(item => item.id !== id));
  };

  const handleSelectBuyerEkspor = (id: string) => {
    setEksporBuyerId(id);
    if (!id) {
      setEksporBuyerNama('');
      setEksporNegara('Singapura');
      return;
    }
    const found = buyers.find(b => b.id === id);
    if (found) {
      setEksporBuyerNama(found.nama);
      setEksporNegara(found.negara);
      if (found.produk && eksporBarangList.length > 0) {
        setEksporBarangList(prev => [
          { ...prev[0], namaBarang: found.produk, spec: found.spek || prev[0].spec }
        ]);
      }
    }
  };

  const handlePdfUploadEkspor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEksporLampiranFile(file);
      setEksporLampiranNama(file.name);
    }
  };

  // Submit Transaksi Ekspor Baru (Tahap 1)
  const handleSubmitEksporTx = (e: React.FormEvent) => {
    e.preventDefault();
    const rand = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const firstItem = eksporBarangList[0];

    const newTx: TransaksiEkspor = {
      id: `txe-${Date.now()}`,
      nomorTransaksi: `TXE-${dateStr}-${rand}`,
      tanggal: new Date().toISOString().split('T')[0],
      tahap: 1,
      buyerNama: eksporBuyerNama,
      buyerId: eksporBuyerId || undefined,
      negaraTujuan: eksporNegara,
      daftarBarang: eksporBarangList,
      waktuPengiriman: `Jadwal Pengiriman: ${eksporWaktuKirim}`,
      waktuTibaPelabuhan: `Target Tiba: ${eksporWaktuTiba}`,
      incoterms: eksporIncoterm,
      lampiranPdfNama: eksporLampiranNama || undefined,
      lampiranPdfUrl: eksporLampiranFile ? URL.createObjectURL(eksporLampiranFile) : undefined,
      komoditas: eksporBarangList.length === 1 ? firstItem.namaBarang : `${firstItem.namaBarang} (+${eksporBarangList.length - 1} item)`,
      kuantitas: firstItem.qty,
      spesifikasi: firstItem.spec,
      hargaUSD: firstItem.harga
    };

    saveEksporTx([newTx, ...eksporTxList]);
    setIsCreateTxOpen(false);
    if (onNotify) onNotify(`Transaksi ekspor ${newTx.nomorTransaksi} berhasil dibuat`);
  };

  // Advance Stage Ekspor (1 -> 7)
  const handleConfirmAdvanceEkspor = () => {
    if (!advancingEkspor) return;
    const next = (advancingEkspor.tahap + 1) as TahapEkspor;
    const updated = eksporTxList.map(item => {
      if (item.id === advancingEkspor.id) {
        return { ...item, tahap: next, ...advanceInput };
      }
      return item;
    });
    saveEksporTx(updated);
    setAdvancingEkspor(null);
    setAdvanceInput({});
  };

  // Select Option -> Confirmation Dialog -> Save Handlers (Ekspor)
  const handleOpenStatusModalEkspor = (tx: TransaksiEkspor, newTahap: TahapEkspor) => {
    if (newTahap === tx.tahap) return;
    setStatusModalTargetEkspor({
      tx,
      targetTahap: newTahap,
      catatan: '',
      nomorResiSampel: tx.nomorResiSampel || '',
      statusApprovalSampel: tx.statusApprovalSampel || 'Approved Lolos Uji Lab',
      nomorPOKontrak: tx.nomorPOKontrak || '',
      nilaiDPEksporUSD: tx.nilaiDPEksporUSD || undefined,
      pelabuhanMuat: tx.pelabuhanMuat || 'Tanjung Emas Semarang',
      statusPelunasanSebelumKapal: tx.statusPelunasanSebelumKapal || 'Lunas 100% Sebelum Kapal'
    });
  };

  const handleSaveStatusModalEkspor = () => {
    if (!statusModalTargetEkspor) return;
    const { 
      tx, 
      targetTahap, 
      catatan, 
      nomorResiSampel, 
      statusApprovalSampel, 
      nomorPOKontrak, 
      nilaiDPEksporUSD, 
      pelabuhanMuat, 
      statusPelunasanSebelumKapal 
    } = statusModalTargetEkspor;

    const updated = eksporTxList.map(item => {
      if (item.id === tx.id) {
        return {
          ...item,
          tahap: targetTahap,
          catatanPenutupan: catatan || item.catatanPenutupan,
          ...(nomorResiSampel ? { nomorResiSampel } : {}),
          ...(statusApprovalSampel ? { statusApprovalSampel } : {}),
          ...(nomorPOKontrak ? { nomorPOKontrak } : {}),
          ...(nilaiDPEksporUSD ? { nilaiDPEksporUSD } : {}),
          ...(pelabuhanMuat ? { pelabuhanMuat } : {}),
          ...(statusPelunasanSebelumKapal ? { statusPelunasanSebelumKapal } : {})
        };
      }
      return item;
    });

    saveEksporTx(updated);
    setStatusModalTargetEkspor(null);
    if (onNotify) onNotify(`Status transaksi ${tx.nomorTransaksi} berhasil diperbarui`);
  };

  // Buyer CRUD Handlers
  const handleOpenAddBuyer = () => {
    setEditingBuyer(null);
    setBuyerForm({
      nama: '',
      email: '',
      kontak: '',
      negara: 'Singapura',
      alamat: '',
      produk: 'Jagung Pipil Kering Grade A',
      spek: '',
      harga: 'USD 240 / MT',
      qty: '50 MT',
      keterangan: ''
    });
    setIsBuyerModalOpen(true);
  };

  const handleOpenEditBuyer = (buyer: ExportBuyer) => {
    setEditingBuyer(buyer);
    setBuyerForm({ ...buyer });
    setIsBuyerModalOpen(true);
  };

  const handleDeleteBuyer = (id: string) => {
    const b = buyers.find(x => x.id === id);
    if (b) setBuyerToDelete(b);
  };

  const handleSaveBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuyer) {
      const updated = buyers.map(b => b.id === editingBuyer.id ? { ...b, ...buyerForm } as ExportBuyer : b);
      saveBuyers(updated);
      if (onNotify) onNotify('Data buyer berhasil diperbarui');
    } else {
      const newBuyer: ExportBuyer = {
        id: `byr-${Date.now()}`,
        nama: buyerForm.nama || 'Buyer Internasional',
        email: buyerForm.email || '',
        kontak: buyerForm.kontak || '',
        negara: buyerForm.negara || 'Singapura',
        alamat: buyerForm.alamat || '',
        produk: buyerForm.produk || 'Komoditas Pertanian',
        spek: buyerForm.spek || '',
        harga: buyerForm.harga || 'USD',
        qty: buyerForm.qty || '1 Lot Kontainer',
        keterangan: buyerForm.keterangan || '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      saveBuyers([newBuyer, ...buyers]);
      if (onNotify) onNotify(`Buyer ${newBuyer.nama} berhasil ditambahkan`);
    }
    setIsBuyerModalOpen(false);
  };

  // Create Export Document Handler
  const handleCreateExportDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const type = docForm.type || 'COO';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const newDoc: ExportDocumentItem = {
      id: `edoc-${Date.now()}`,
      type,
      nomorDokumen: `${type}-INA-${dateFormatted}-${rand}`,
      buyerNama: docForm.buyerNama || (buyers[0]?.nama || 'International Buyer'),
      negaraTujuan: docForm.negaraTujuan || (buyers[0]?.negara || 'Singapura'),
      komoditas: docForm.komoditas || 'Jagung Pipil Kering',
      instansiPenerbit: docForm.instansiPenerbit || 'Badan Otoritas Ekspor',
      tanggalTerbit: new Date().toISOString().split('T')[0],
      masaBerlaku: '6 Bulan',
      status: 'Aktif / Terbit',
      keterangan: docForm.keterangan || 'Dokumen persyaratan pabean ekspor lengkap'
    };

    saveExportDocs([newDoc, ...exportDocs]);
    setIsCreateDocModalOpen(false);
    if (onNotify) onNotify(`Dokumen ${newDoc.type} (${newDoc.nomorDokumen}) berhasil diterbitkan`);
  };


  const getBadgeClass = (tahap: number) => {
    if (tahap === 7) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (tahap === 1) return 'bg-slate-100 text-slate-800 border-slate-200';
    if (tahap === 4) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Perdagangan & Manajemen Ekspor
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              7 Tahap Alur
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem terpadu transaksi ekspor internasional, legalitas sertifikat (COO, Phyto, COA, dll), dan tracking kontainer pelabuhan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'transaksi' && (
            <button
              onClick={() => setIsCreateTxOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Transaksi Ekspor</span>
            </button>
          )}

          {activeTab === 'buyer' && (
            <button
              onClick={handleOpenAddBuyer}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tambah Buyer Ekspor</span>
            </button>
          )}

          {activeTab === 'dokumen' && (
            <button
              onClick={() => setIsCreateDocModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              <span>+ Terbitkan Dokumen Ekspor</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Tab Navigation (4 Dedicated Modules) */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'transaksi'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Transaksi Ekspor (7 Tahap)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'transaksi' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {eksporTxList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('buyer')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'buyer'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Listing Buyer</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'buyer' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {buyers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dokumen')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'dokumen'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dokumen Legalitas (7 Pilihan)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'dokumen' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {exportDocs.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. TRANSAKSI EKSPOR (7 TAHAP FLOW TABLE)                 */}
      {/* ======================================================== */}
      {activeTab === 'transaksi' && (
        <div className="space-y-3">
          {/* Filter Tahap Pills & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedTahapFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedTahapFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Semua Tahap ({eksporTxList.length})
              </button>

              {([1, 2, 3, 4, 5, 6, 7] as TahapEkspor[]).map(step => {
                const count = eksporTxList.filter(t => t.tahap === step).length;
                return (
                  <button
                    key={step}
                    onClick={() => setSelectedTahapFilter(selectedTahapFilter === step ? 'ALL' : step)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      selectedTahapFilter === step
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{TAHAP_EKSPOR_NAMES[step]}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedTahapFilter === step ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi / buyer / komoditas..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clean Table Ekspor (No Card) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">No. Transaksi</th>
                    <th className="py-3 px-4">Buyer & Negara</th>
                    <th className="py-3 px-4">Komoditas & Qty</th>
                    <th className="py-3 px-4">Harga (USD)</th>
                    <th className="py-3 px-4">Incoterm</th>
                    <th className="py-3 px-4">Jadwal Waktu</th>
                    <th className="py-3 px-4">Lampiran</th>
                    <th className="py-3 px-4 text-center">Tahap Saat Ini</th>
                    <th className="py-3 px-4 text-center">Aksi Alur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eksporTxList
                    .filter(tx => {
                      const matchStep = selectedTahapFilter === 'ALL' || tx.tahap === selectedTahapFilter;
                      const q = searchQuery.toLowerCase();
                      const matchSearch =
                        tx.nomorTransaksi.toLowerCase().includes(q) ||
                        tx.buyerNama.toLowerCase().includes(q) ||
                        tx.negaraTujuan.toLowerCase().includes(q) ||
                        tx.komoditas.toLowerCase().includes(q);
                      return matchStep && matchSearch;
                    })
                    .map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {tx.nomorTransaksi}
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.tanggal}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{tx.buyerNama}</div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                            {tx.negaraTujuan}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{tx.komoditas}</div>
                          <div className="text-[11px] text-slate-500">
                            {tx.daftarBarang ? `${tx.daftarBarang.length} item (${tx.kuantitas})` : tx.kuantitas}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-900">
                          ${tx.hargaUSD} USD / MT
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                            {tx.incoterms}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-700">
                          <div className="font-medium text-[11px]">{tx.waktuTibaPelabuhan || tx.pelabuhanMuat || '-'}</div>
                          {tx.waktuPengiriman && <div className="text-[10px] text-slate-400">{tx.waktuPengiriman}</div>}
                        </td>

                        <td className="py-3 px-4">
                          {tx.lampiranPdfNama ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <Paperclip className="w-3 h-3 text-blue-600 shrink-0" />
                              <span className="truncate max-w-[100px]">{tx.lampiranPdfNama}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center">
                            <select
                              value={tx.tahap}
                              onChange={(e) => handleOpenStatusModalEkspor(tx, Number(e.target.value) as TahapEkspor)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition ${getBadgeClass(tx.tahap)}`}
                              title="Klik pilihan untuk mengubah status ekspor"
                            >
                              {([1, 2, 3, 4, 5, 6, 7] as TahapEkspor[]).map(step => (
                                <option key={step} value={step} className="bg-white text-slate-800 font-semibold py-1">
                                  {TAHAP_EKSPOR_NAMES[step]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {tx.tahap < 7 ? (
                              <button
                                onClick={() => handleOpenStatusModalEkspor(tx, (tx.tahap + 1) as TahapEkspor)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                                title={`Lanjut ke ${TAHAP_EKSPOR_NAMES[(tx.tahap + 1) as TahapEkspor]}`}
                              >
                                <span>Lanjut Tahap {tx.tahap + 1}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-100 rounded border border-emerald-200">
                                Selesai
                              </span>
                            )}

                            <button
                              onClick={() => setSelectedTxDetail(tx)}
                              className="p-1 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                              title="Lihat Detail Transaksi Ekspor"
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
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. LISTING BUYER EKSPOR (TABEL)                          */}
      {/* ======================================================== */}
      {activeTab === 'buyer' && (
        <div className="space-y-3">
          {/* Top Filter and Search Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama buyer, negara tujuan, produk yang dicari, kontak, atau email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Total: <strong>{buyers.length}</strong> buyer internasional
              </span>
              <button
                onClick={handleOpenAddBuyer}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Tambah Buyer</span>
              </button>
            </div>
          </div>

          {/* Clean Table Listing Buyer (No Cards) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 min-w-[200px]">Buyer & Kontak</th>
                    <th className="py-3 px-4 min-w-[150px]">Negara & Alamat</th>
                    <th className="py-3 px-4 min-w-[180px]">Produk yang Dicari</th>
                    <th className="py-3 px-4 min-w-[220px]">Spesifikasi</th>
                    <th className="py-3 px-4 min-w-[110px]">Volume / Qty</th>
                    <th className="py-3 px-4 min-w-[130px]">Target Harga</th>
                    <th className="py-3 px-4 min-w-[170px]">Keterangan</th>
                    <th className="py-3 px-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {buyers
                    .filter(b => {
                      const q = searchQuery.toLowerCase();
                      return (
                        b.nama.toLowerCase().includes(q) ||
                        b.negara.toLowerCase().includes(q) ||
                        b.produk.toLowerCase().includes(q) ||
                        b.email.toLowerCase().includes(q) ||
                        b.kontak.toLowerCase().includes(q) ||
                        (b.spek && b.spek.toLowerCase().includes(q))
                      );
                    })
                    .map((b, idx) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 text-center text-slate-400 font-medium">
                          {idx + 1}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{b.nama}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{b.email}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{b.kontak}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase inline-block mb-1">
                            {b.negara}
                          </span>
                          <div className="text-[11px] text-slate-600 line-clamp-2" title={b.alamat}>
                            {b.alamat}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{b.produk}</span>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          <p className="line-clamp-2 text-[11px]" title={b.spek}>{b.spek || '-'}</p>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {b.qty}
                        </td>

                        <td className="py-3 px-4 font-bold text-emerald-800 whitespace-nowrap">
                          {b.harga}
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          <p className="line-clamp-2" title={b.keterangan}>{b.keterangan || '-'}</p>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditBuyer(b)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Edit Data Buyer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBuyer(b.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus Buyer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {buyers.filter(b => {
                    const q = searchQuery.toLowerCase();
                    return (
                      b.nama.toLowerCase().includes(q) ||
                      b.negara.toLowerCase().includes(q) ||
                      b.produk.toLowerCase().includes(q) ||
                      b.email.toLowerCase().includes(q) ||
                      b.kontak.toLowerCase().includes(q) ||
                      (b.spek && b.spek.toLowerCase().includes(q))
                    );
                  }).length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Tidak ada data buyer yang sesuai dengan pencarian "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PEMBUATAN DOKUMEN EKSPOR (7 PILIHAN LENGKAP)          */}
      {/* ======================================================== */}
      {activeTab === 'dokumen' && (
        <div className="space-y-4">
          {/* Filter Document Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedDocTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedDocTypeFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua Jenis Dokumen ({exportDocs.length})
            </button>

            {(['COO', 'PHYTO', 'HEALTH', 'COA', 'FUMIGATION', 'INSURANCE', 'EXPORT_PERMIT'] as ExportDocChoice[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDocTypeFilter(selectedDocTypeFilter === type ? 'ALL' : type)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedDocTypeFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Document Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">No. Sertifikat / Dokumen</th>
                    <th className="py-3 px-4">Jenis Dokumen</th>
                    <th className="py-3 px-4">Buyer & Negara Tujuan</th>
                    <th className="py-3 px-4">Komoditas Barang</th>
                    <th className="py-3 px-4">Instansi Penerbit</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exportDocs
                    .filter(d => selectedDocTypeFilter === 'ALL' || d.type === selectedDocTypeFilter)
                    .map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {doc.nomorDokumen}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Terbit: {doc.tanggalTerbit}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800 uppercase block w-fit mb-0.5">
                            {doc.type}
                          </span>
                          <span className="text-[11px] text-slate-700 font-medium">
                            {EXPORT_DOC_DEFINITIONS[doc.type]?.nama.split('(')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{doc.buyerNama}</div>
                          <div className="text-[11px] text-slate-500 font-medium">Negara: {doc.negaraTujuan}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {doc.komoditas}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-600">
                          {doc.instansiPenerbit}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedPreviewDoc(doc)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      {/* ======================================================== */}
      {/* DIALOG INPUT TRANSAKSI EKSPOR (SESUAI PERMINTAAN USER)   */}
      {/* ======================================================== */}
      {isCreateTxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Form Penawaran kepada Buyer Ekspor (Tahap 1)
                </h3>
                <p className="text-[11px] text-blue-200">
                  Input data buyer ekspor, komoditas, spesifikasi, kuantitas, harga (USD), jadwal pelabuhan, incoterm, & lampiran PDF.
                </p>
              </div>
              <button onClick={() => setIsCreateTxOpen(false)} className="text-blue-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEksporTx} className="p-5 space-y-4 text-xs">
              {/* 1. PILIH BUYER EKSPOR */}
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span>Pilih Buyer Ekspor</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateTxOpen(false);
                      handleOpenAddBuyer();
                    }}
                    className="text-[11px] text-blue-800 font-semibold hover:underline"
                  >
                    + Tambah Buyer Baru ke DB
                  </button>
                </div>

                <select
                  value={eksporBuyerId}
                  onChange={(e) => handleSelectBuyerEkspor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Buyer Terdaftar dari Database --</option>
                  {buyers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nama} ({b.negara})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nama Buyer Ekspor..."
                    value={eksporBuyerNama}
                    onChange={(e) => setEksporBuyerNama(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-slate-900 font-medium"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Negara Tujuan (Singapura, dll.)"
                    value={eksporNegara}
                    onChange={(e) => setEksporNegara(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* 2. DAFTAR BARANG EKSPOR */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Daftar Komoditas Ekspor</h4>
                    <p className="text-[10px] text-slate-400">Kelola barang, spesifikasi ekspor, kuantitas, dan harga USD</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBarangEkspor}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Tambah Komoditas</span>
                  </button>
                </div>

                <div className="space-y-2.5 pt-1">
                  {eksporBarangList.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-700">Komoditas #{idx + 1}</span>
                        {eksporBarangList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteBarangEkspor(item.id)}
                            className="text-rose-600 hover:text-rose-800 text-[10px] font-semibold flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Komoditas Ekspor</label>
                          <input
                            type="text"
                            required
                            placeholder="Jagung Pipil Kering Ekspor"
                            value={item.namaBarang}
                            onChange={(e) => handleUpdateBarangEkspor(item.id, 'namaBarang', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Spesifikasi Ekspor (Spec)</label>
                          <input
                            type="text"
                            required
                            placeholder="Kadar air max 13.5%, Benda asing < 1%"
                            value={item.spec}
                            onChange={(e) => handleUpdateBarangEkspor(item.id, 'spec', e.target.value)}
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
                            placeholder="50 MT (2 Kontainer 40ft)"
                            value={item.qty}
                            onChange={(e) => handleUpdateBarangEkspor(item.id, 'qty', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Harga (USD / MT)</label>
                          <input
                            type="number"
                            required
                            placeholder="245"
                            value={item.harga}
                            onChange={(e) => handleUpdateBarangEkspor(item.id, 'harga', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. WAKTU & INCOTERM */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Waktu & Persyaratan Perdagangan (Incoterm)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Jadwal Waktu Kirim Pelabuhan
                    </label>
                    <input
                      type="date"
                      required
                      value={eksporWaktuKirim}
                      onChange={(e) => setEksporWaktuKirim(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Target Tiba Pelabuhan Tujuan
                    </label>
                    <input
                      type="date"
                      required
                      value={eksporWaktuTiba}
                      onChange={(e) => setEksporWaktuTiba(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Incoterm Ekspor
                    </label>
                    <select
                      value={eksporIncoterm}
                      onChange={(e) => setEksporIncoterm(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-bold"
                    >
                      <option value="FOB">FOB (Free On Board)</option>
                      <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                      <option value="CFR">CFR (Cost and Freight)</option>
                      <option value="EXW">EXW (Ex Works)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. LAMPIRAN (UPLOAD PDF) */}
              <div className="p-3.5 bg-blue-50/50 border border-dashed border-blue-300 rounded-xl space-y-2">
                <label className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <Upload className="w-3.5 h-3.5 text-blue-700" />
                  <span>Lampiran Dokumen Ekspor (Upload PDF)</span>
                </label>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUploadEkspor}
                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />

                {eksporLampiranNama && (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-900 bg-blue-100 p-2 rounded">
                    <Paperclip className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span className="font-medium truncate">File terlampir: {eksporLampiranNama}</span>
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateTxOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Simpan Transaksi Ekspor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DIALOG KONFIRMASI UBAH STATUS EKSPOR (SIMPLE & SAVE) */}
      {/* ======================================================== */}
      {statusModalTargetEkspor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-blue-400 font-bold block">{statusModalTargetEkspor.tx.nomorTransaksi}</span>
                <h4 className="font-bold text-sm">Konfirmasi Perubahan Status Ekspor</h4>
              </div>
              <button onClick={() => setStatusModalTargetEkspor(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {/* Info Singkat Transaksi Ekspor */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">
                  {statusModalTargetEkspor.tx.buyerNama} ({statusModalTargetEkspor.tx.negaraTujuan})
                </div>
                <div className="text-[11px] text-slate-500">
                  {statusModalTargetEkspor.tx.komoditas} • {statusModalTargetEkspor.tx.kuantitas}
                </div>
              </div>

              {/* Status Lama -> Status Baru */}
              <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="text-center flex-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Status Lama</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeClass(statusModalTargetEkspor.tx.tahap)}`}>
                    {TAHAP_EKSPOR_NAMES[statusModalTargetEkspor.tx.tahap]}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-blue-700 shrink-0 mx-2" />

                <div className="text-center flex-1">
                  <span className="text-[10px] text-blue-800 uppercase font-bold block mb-1">Status Baru</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeClass(statusModalTargetEkspor.targetTahap)}`}>
                    {TAHAP_EKSPOR_NAMES[statusModalTargetEkspor.targetTahap]}
                  </span>
                </div>
              </div>

              {/* Input Tambahan Sesuai Tahap Tujuan (Opsional) */}
              {statusModalTargetEkspor.targetTahap === 2 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nomor Resi Sampel (AWB Kurir)</label>
                  <input
                    type="text"
                    placeholder="Contoh: DHL-8492019482 / FEDEX-77192"
                    value={statusModalTargetEkspor.nomorResiSampel || ''}
                    onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, nomorResiSampel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              )}

              {statusModalTargetEkspor.targetTahap === 3 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Persetujuan Sampel</label>
                  <select
                    value={statusModalTargetEkspor.statusApprovalSampel || 'Approved Lolos Uji Lab'}
                    onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, statusApprovalSampel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Approved Lolos Uji Lab">Approved Lolos Uji Lab</option>
                    <option value="Revisi Spesifikasi Kadar Air">Revisi Spesifikasi Kadar Air</option>
                  </select>
                </div>
              )}

              {statusModalTargetEkspor.targetTahap === 4 && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">No. PO / Kontrak</label>
                    <input
                      type="text"
                      placeholder="PO-BUYER-2026-01"
                      value={statusModalTargetEkspor.nomorPOKontrak || ''}
                      onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, nomorPOKontrak: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">DP (USD)</label>
                    <input
                      type="number"
                      placeholder="3675"
                      value={statusModalTargetEkspor.nilaiDPEksporUSD || ''}
                      onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, nilaiDPEksporUSD: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              )}

              {statusModalTargetEkspor.targetTahap === 5 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pelabuhan Muat (Port of Loading)</label>
                  <input
                    type="text"
                    placeholder="Tanjung Emas Semarang"
                    value={statusModalTargetEkspor.pelabuhanMuat || ''}
                    onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, pelabuhanMuat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              )}

              {statusModalTargetEkspor.targetTahap === 6 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pelunasan Pra-Kapal</label>
                  <select
                    value={statusModalTargetEkspor.statusPelunasanSebelumKapal || 'Lunas 100% Sebelum Kapal'}
                    onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, statusPelunasanSebelumKapal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Lunas 100% Sebelum Kapal">Lunas 100% Sebelum Kapal (Rekening Valas)</option>
                    <option value="L/C Confirmed Irrevocable at Sight">L/C Confirmed Irrevocable at Sight</option>
                  </select>
                </div>
              )}

              {statusModalTargetEkspor.targetTahap === 7 && (
                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-[11px]">
                  Konfirmasi: Kontainer telah berlayar dan seluruh pembayaran devisa diterima. Transaksi ekspor ditutup.
                </div>
              )}

              {/* Catatan / Keterangan Singkat */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Catatan / Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Disetujui pihak buyer, kargo siap di dermaga..."
                  value={statusModalTargetEkspor.catatan || ''}
                  onChange={(e) => setStatusModalTargetEkspor({ ...statusModalTargetEkspor, catatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              {/* Tombol Simpan & Batal */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStatusModalTargetEkspor(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatusModalEkspor}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
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
      {/* MODAL DETAIL TRANSAKSI EKSPOR                            */}
      {/* ======================================================== */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-xs">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold block">
                  {selectedTxDetail.nomorTransaksi}
                </span>
                <h3 className="text-sm font-bold">Rincian Lengkap Transaksi Ekspor</h3>
              </div>
              <button onClick={() => setSelectedTxDetail(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tahap Transaksi Ekspor</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border mt-0.5 ${getBadgeClass(selectedTxDetail.tahap)}`}>
                    {TAHAP_EKSPOR_NAMES[selectedTxDetail.tahap]}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tanggal Transaksi</span>
                  <span className="font-semibold text-slate-900">{selectedTxDetail.tanggal}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Buyer Ekspor</span>
                  <span className="font-bold text-slate-900 text-xs block mt-0.5">{selectedTxDetail.buyerNama}</span>
                  <span className="text-[11px] text-blue-700 font-medium">Negara: {selectedTxDetail.negaraTujuan}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Incoterm & Harga</span>
                  <span className="font-mono font-bold text-slate-900 text-xs block mt-0.5">
                    {selectedTxDetail.incoterms} • ${selectedTxDetail.hargaUSD} USD / MT
                  </span>
                  <span className="text-[11px] text-slate-500">{selectedTxDetail.waktuTibaPelabuhan}</span>
                </div>
              </div>

              {/* Rincian Komoditas */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rincian Komoditas Barang:</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Komoditas</th>
                        <th className="py-2 px-3">Spesifikasi Ekspor</th>
                        <th className="py-2 px-3 text-right">Volume (Qty)</th>
                        <th className="py-2 px-3 text-right">Harga (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedTxDetail.daftarBarang || []).map((b, i) => (
                        <tr key={b.id || i}>
                          <td className="py-2 px-3 font-semibold text-slate-900">{b.namaBarang}</td>
                          <td className="py-2 px-3 text-slate-600">{b.spec}</td>
                          <td className="py-2 px-3 text-right font-medium">{b.qty}</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                            ${b.harga} USD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Sampel & Pelabuhan */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-800 uppercase font-bold block">Tracking Sampel</span>
                  <div className="font-mono font-bold text-blue-950 mt-0.5">
                    {selectedTxDetail.nomorResiSampel || 'Belum Dikirim (Tahap 2)'}
                  </div>
                  <div className="text-[11px] text-blue-700">{selectedTxDetail.statusApprovalSampel || '-'}</div>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">DP & Pelunasan Pra-Kapal</span>
                  <div className="font-bold text-emerald-950 mt-0.5">
                    {selectedTxDetail.nilaiDPEksporUSD ? `DP: $${selectedTxDetail.nilaiDPEksporUSD} USD` : 'Belum Ada DP'}
                  </div>
                  <div className="text-[11px] text-emerald-700">{selectedTxDetail.statusPelunasanSebelumKapal || '-'}</div>
                </div>
              </div>

              {/* Lampiran PDF */}
              {selectedTxDetail.lampiranPdfNama && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-900 block">{selectedTxDetail.lampiranPdfNama}</span>
                      <span className="text-[10px] text-slate-400">Dokumen Lampiran Ekspor PDF</span>
                    </div>
                  </div>
                  {selectedTxDetail.lampiranPdfUrl && selectedTxDetail.lampiranPdfUrl !== '#' && (
                    <a
                      href={selectedTxDetail.lampiranPdfUrl}
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
                  onClick={() => setSelectedTxDetail(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TAMBAH / EDIT BUYER INTERNASIONAL                  */}
      {/* ======================================================== */}
      {isBuyerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  {editingBuyer ? 'Edit Data Buyer Internasional' : 'Tambah Buyer Internasional Baru'}
                </h3>
                <p className="text-[11px] text-emerald-200">Form listing calon dan mitra pembeli ekspor Terniva</p>
              </div>
              <button
                onClick={() => setIsBuyerModalOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBuyer} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Perusahaan Buyer</label>
                  <input
                    type="text"
                    required
                    value={buyerForm.nama || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, nama: e.target.value })}
                    placeholder="Contoh: SG Agro Foods Pte Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Negara Tujuan</label>
                  <input
                    type="text"
                    required
                    value={buyerForm.negara || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, negara: e.target.value })}
                    placeholder="Contoh: Singapura, Malaysia, Vietnam"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Resmi</label>
                  <input
                    type="email"
                    required
                    value={buyerForm.email || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                    placeholder="procurement@buyer.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kontak Telepon / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={buyerForm.kontak || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, kontak: e.target.value })}
                    placeholder="+65 6789 2100"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Kantor / Gudang Internasional</label>
                <textarea
                  rows={2}
                  required
                  value={buyerForm.alamat || ''}
                  onChange={(e) => setBuyerForm({ ...buyerForm, alamat: e.target.value })}
                  placeholder="Alamat lengkap tujuan pengiriman..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Produk yang Dicari</label>
                  <input
                    type="text"
                    required
                    value={buyerForm.produk || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, produk: e.target.value })}
                    placeholder="Jagung Pipil Kering Grade A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Kuantitas (Qty)</label>
                  <input
                    type="text"
                    required
                    value={buyerForm.qty || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, qty: e.target.value })}
                    placeholder="100 MT / Bulan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Spesifikasi Kebutuhan</label>
                  <input
                    type="text"
                    value={buyerForm.spek || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, spek: e.target.value })}
                    placeholder="Kadar air max 13.5%, Benda asing < 1%"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ekspektasi Harga</label>
                  <input
                    type="text"
                    value={buyerForm.harga || ''}
                    onChange={(e) => setBuyerForm({ ...buyerForm, harga: e.target.value })}
                    placeholder="USD 245 / MT (FOB)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  value={buyerForm.keterangan || ''}
                  onChange={(e) => setBuyerForm({ ...buyerForm, keterangan: e.target.value })}
                  placeholder="Metode pembayaran, preferensi pelabuhan, dll."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBuyerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition"
                >
                  Simpan Buyer Ekspor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TERBITKAN DOKUMEN EKSPOR                           */}
      {/* ======================================================== */}
      {isCreateDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-blue-800 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Terbitkan Dokumen Legalitas Ekspor Baru</h3>
                <p className="text-[11px] text-blue-200">
                  Pilih salah satu dari 7 sertifikat resmi ekspor perdagangan internasional
                </p>
              </div>
              <button
                onClick={() => setIsCreateDocModalOpen(false)}
                className="text-blue-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExportDoc} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jenis Dokumen Sertifikat</label>
                <select
                  value={docForm.type}
                  onChange={(e) => setDocForm({ ...docForm, type: e.target.value as ExportDocChoice })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="COO">COO / SKA — Certificate of Origin (Surat Keterangan Asal)</option>
                  <option value="PHYTO">PHYTO — Phytosanitary Certificate (Kesehatan Tumbuhan)</option>
                  <option value="HEALTH">HEALTH — Health Certificate (Kesehatan Pangan/Hewan)</option>
                  <option value="COA">COA — Certificate of Analysis (Hasil Analisis Laboratorium)</option>
                  <option value="FUMIGATION">FUMIGATION — Fumigation Certificate (Bebas Hama)</option>
                  <option value="INSURANCE">INSURANCE — Marine Cargo Insurance Certificate</option>
                  <option value="EXPORT_PERMIT">EXPORT_PERMIT — Export Permit / NPE Bea Cukai</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  {EXPORT_DOC_DEFINITIONS[docForm.type || 'COO']?.artiFungsi}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Buyer Consignee</label>
                  <input
                    type="text"
                    required
                    value={docForm.buyerNama || ''}
                    onChange={(e) => setDocForm({ ...docForm, buyerNama: e.target.value })}
                    placeholder="Contoh: SG Agro Foods Pte Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Negara Tujuan</label>
                  <input
                    type="text"
                    required
                    value={docForm.negaraTujuan || ''}
                    onChange={(e) => setDocForm({ ...docForm, negaraTujuan: e.target.value })}
                    placeholder="Singapura"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Komoditas & Kuantitas</label>
                  <input
                    type="text"
                    required
                    value={docForm.komoditas || ''}
                    onChange={(e) => setDocForm({ ...docForm, komoditas: e.target.value })}
                    placeholder="Jagung Pipil Kering (50 MT)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Instansi Penerbit Resmi</label>
                  <input
                    type="text"
                    required
                    value={docForm.instansiPenerbit || ''}
                    onChange={(e) => setDocForm({ ...docForm, instansiPenerbit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan / Catatan Spesifikasi Dokumen</label>
                <input
                  type="text"
                  value={docForm.keterangan || ''}
                  onChange={(e) => setDocForm({ ...docForm, keterangan: e.target.value })}
                  placeholder="Catatan inspeksi atau nomor referensi PEB..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDocModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition"
                >
                  Terbitkan Dokumen Ekspor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL PREVIEW & CETAK DOKUMEN EKSPOR                     */}
      {/* ======================================================== */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold block">
                  {selectedPreviewDoc.nomorDokumen}
                </span>
                <h3 className="text-sm font-bold">
                  {EXPORT_DOC_DEFINITIONS[selectedPreviewDoc.type]?.nama}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="border-b-2 border-slate-900 pb-3 text-center">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  REPUBLIC OF INDONESIA • OFFICIAL EXPORT DOCUMENT
                </div>
                <h2 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                  PT. INOVASI DIGITAL KREASI — TERNIVA EXPORT DIVISION
                </h2>
                <div className="text-[10px] text-slate-500">
                  Sentra Perdagangan Internasional Agrikultur & Peternakan Nusantara • export@inovasidigitalkreasi.com
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Jenis Sertifikat</span>
                  <span className="font-bold text-blue-900">{selectedPreviewDoc.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tanggal Terbit</span>
                  <span className="font-semibold text-slate-900">{selectedPreviewDoc.tanggalTerbit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Instansi Penerbit</span>
                  <span className="font-semibold text-slate-900">{selectedPreviewDoc.instansiPenerbit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Keabsahan</span>
                  <span className="font-bold text-emerald-800">{selectedPreviewDoc.status}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-slate-700">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 uppercase">
                  Konsinyasi Barang Ekspor
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Consignee (Buyer):</span>
                    <span className="font-bold text-slate-900">{selectedPreviewDoc.buyerNama}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Destination Country:</span>
                    <span className="font-bold text-slate-900">{selectedPreviewDoc.negaraTujuan}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block font-bold">Description of Goods:</span>
                    <span className="text-slate-900">{selectedPreviewDoc.komoditas}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block font-bold">Catatan Verifikasi & Legalitas:</span>
                    <span className="text-slate-800">{selectedPreviewDoc.keterangan}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-slate-600">
                <div className="text-[10px]">
                  <div>Electronic Certificate Verified</div>
                  <div className="font-mono text-slate-400">IDK-EXP-VERIFIED-2026</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Diverifikasi & Diterbitkan Oleh:</div>
                  <div className="font-bold text-slate-900 mt-1">Admin Ekspor Terniva</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">PT. Inovasi Digital Kreasi</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen Ekspor</span>
                </button>
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG KONFIRMASI HAPUS BUYER                             */}
      {/* ======================================================== */}
      {buyerToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Konfirmasi Hapus Data Buyer</h4>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus data buyer <strong>{buyerToDelete.nama}</strong> ({buyerToDelete.negara}) dari database?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBuyerToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = buyers.filter(b => b.id !== buyerToDelete.id);
                  saveBuyers(updated);
                  if (onNotify) onNotify(`Data buyer ${buyerToDelete.nama} berhasil dihapus`);
                  setBuyerToDelete(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
