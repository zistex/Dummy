import React, { useState } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Printer, 
  X, 
  Eye, 
  Receipt,
  CreditCard,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';

export type KeuanganDocType = 
  | 'proforma_invoice'
  | 'invoice_penjualan'
  | 'invoice_pembelian'
  | 'kwitansi'
  | 'bukti_bayar_supplier'
  | 'rekap_pembayaran'
  | 'laporan_piutang'
  | 'laporan_hutang';

export interface KeuanganItem {
  id: string;
  docType: KeuanganDocType;
  nomorDokumen: string;
  tanggal: string;
  status: 'Lunas' | 'Belum Lunas' | 'Jatuh Tempo' | 'Sebagian' | 'Draf';
  // Dynamic fields
  buyer?: string;
  supplier?: string;
  pembayar?: string;
  produk?: string;
  qty?: string;
  harga?: number;
  pajak?: number;
  total: number;
  termin?: string;
  jatuhTempo?: string;
  metode?: 'Transfer Bank' | 'Bilyet Giro' | 'Cash' | 'Escrow';
  referensiTransaksi?: string;
  invoiceRef?: string;
  nilaiTagihan?: number;
  dibayar?: number;
  sisaTagihan?: number;
}

const INITIAL_KEUANGAN_DATA: KeuanganItem[] = [
  {
    id: 'keu-1',
    docType: 'proforma_invoice',
    nomorDokumen: 'PI-TER-202611-008',
    tanggal: '2026-11-02',
    status: 'Draf',
    buyer: 'PT Sumber Pangan Nusantara',
    produk: 'Jagung Pipil Kering Grade A',
    qty: '25.000 Kg',
    harga: 5800,
    total: 145000000,
    termin: 'DP 30%, Pelunasan 7 hari setelah BAST'
  },
  {
    id: 'keu-2',
    docType: 'invoice_penjualan',
    nomorDokumen: 'INV-TER-202611-045',
    tanggal: '2026-11-06',
    status: 'Belum Lunas',
    buyer: 'PT Sumber Pangan Nusantara',
    produk: 'Jagung Pipil Kering Grade A (25 Ton)',
    qty: '25.000 Kg',
    harga: 5800,
    pajak: 15950000,
    total: 160950000,
    jatuhTempo: '2026-11-20'
  },
  {
    id: 'keu-3',
    docType: 'invoice_pembelian',
    nomorDokumen: 'INV-SUP-202611-019',
    tanggal: '2026-11-05',
    status: 'Belum Lunas',
    supplier: 'Gapoktan Makmur Tani Kendal',
    produk: 'Jagung Pipil Kering Silo 1',
    qty: '25.000 Kg',
    harga: 5100,
    total: 127500000,
    jatuhTempo: '2026-11-15'
  },
  {
    id: 'keu-4',
    docType: 'kwitansi',
    nomorDokumen: 'KWT-TER-202611-032',
    tanggal: '2026-11-03',
    status: 'Lunas',
    pembayar: 'PT Sumber Pangan Nusantara',
    total: 43500000,
    metode: 'Transfer Bank',
    referensiTransaksi: 'DP 30% atas PO-BYR-202611-042 via BCA'
  },
  {
    id: 'keu-5',
    docType: 'bukti_bayar_supplier',
    nomorDokumen: 'BBS-TER-202611-014',
    tanggal: '2026-11-04',
    status: 'Lunas',
    supplier: 'Gapoktan Makmur Tani Kendal',
    total: 50000000,
    metode: 'Transfer Bank',
    referensiTransaksi: 'Uang Muka Panen Jagung Pipil (Bank Mandiri)'
  },
  {
    id: 'keu-6',
    docType: 'rekap_pembayaran',
    nomorDokumen: 'REK-TER-202611-002',
    tanggal: '2026-11-06',
    status: 'Sebagian',
    invoiceRef: 'INV-TER-202611-045',
    nilaiTagihan: 160950000,
    dibayar: 43500000,
    sisaTagihan: 117450000,
    total: 160950000
  },
  {
    id: 'keu-7',
    docType: 'laporan_piutang',
    nomorDokumen: 'PIU-TER-202611-001',
    tanggal: '2026-11-07',
    status: 'Belum Lunas',
    buyer: 'PT Charoen Pokphand Indonesia Tbk',
    invoiceRef: 'INV-TER-202610-092',
    jatuhTempo: '2026-11-12',
    sisaTagihan: 88500000,
    total: 88500000
  },
  {
    id: 'keu-8',
    docType: 'laporan_hutang',
    nomorDokumen: 'HUT-TER-202611-001',
    tanggal: '2026-11-07',
    status: 'Belum Lunas',
    supplier: 'Koperasi Peternak Sapi Perah Boyolali',
    invoiceRef: 'INV-SUP-202610-077',
    jatuhTempo: '2026-11-14',
    sisaTagihan: 77500000,
    total: 77500000
  }
];

export const KeuanganView: React.FC = () => {
  const [data, setData] = useState<KeuanganItem[]>(() => {
    const saved = localStorage.getItem('terniva_keuangan_docs');
    return saved ? JSON.parse(saved) : INITIAL_KEUANGAN_DATA;
  });

  const [activeTab, setActiveTab] = useState<KeuanganDocType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KeuanganItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formDocType, setFormDocType] = useState<KeuanganDocType>('invoice_penjualan');
  const [formData, setFormData] = useState<Partial<KeuanganItem>>({
    total: 50000000,
    status: 'Belum Lunas',
    metode: 'Transfer Bank'
  });

  const saveToStorage = (updated: KeuanganItem[]) => {
    setData(updated);
    localStorage.setItem('terniva_keuangan_docs', JSON.stringify(updated));
  };

  const docTypeLabels: Record<KeuanganDocType, { label: string; fungsi: string; icon: any }> = {
    proforma_invoice: { label: 'Proforma Invoice', fungsi: 'Tagihan sementara buyer', icon: FileText },
    invoice_penjualan: { label: 'Invoice Penjualan', fungsi: 'Tagihan resmi kepada buyer', icon: Receipt },
    invoice_pembelian: { label: 'Invoice Pembelian', fungsi: 'Tagihan dari supplier/pemasok', icon: CreditCard },
    kwitansi: { label: 'Kwitansi', fungsi: 'Bukti penerimaan uang resmi', icon: DollarSign },
    bukti_bayar_supplier: { label: 'Bukti Pembayaran Supplier', fungsi: 'Bukti pembayaran kepada pemasok', icon: ArrowUpRight },
    rekap_pembayaran: { label: 'Rekap Pembayaran', fungsi: 'Monitoring pelunasan per invoice', icon: CheckCircle2 },
    laporan_piutang: { label: 'Laporan Piutang', fungsi: 'Monitoring tagihan buyer', icon: AlertCircle },
    laporan_hutang: { label: 'Laporan Hutang', fungsi: 'Monitoring kewajiban supplier', icon: Clock }
  };

  const filteredItems = data.filter(item => {
    const matchTab = activeTab === 'ALL' || item.docType === activeTab;
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      item.nomorDokumen.toLowerCase().includes(q) ||
      (item.buyer && item.buyer.toLowerCase().includes(q)) ||
      (item.supplier && item.supplier.toLowerCase().includes(q)) ||
      (item.pembayar && item.pembayar.toLowerCase().includes(q)) ||
      (item.invoiceRef && item.invoiceRef.toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  // Calculate totals
  const totalPiutang = data
    .filter(d => d.docType === 'laporan_piutang' || (d.docType === 'invoice_penjualan' && d.status !== 'Lunas'))
    .reduce((sum, d) => sum + (d.sisaTagihan || d.total || 0), 0);

  const totalHutang = data
    .filter(d => d.docType === 'laporan_hutang' || (d.docType === 'invoice_pembelian' && d.status !== 'Lunas'))
    .reduce((sum, d) => sum + (d.sisaTagihan || d.total || 0), 0);

  const totalKasMasuk = data
    .filter(d => d.docType === 'kwitansi')
    .reduce((sum, d) => sum + d.total, 0);

  const totalBayarSupplier = data
    .filter(d => d.docType === 'bukti_bayar_supplier')
    .reduce((sum, d) => sum + d.total, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    const prefixMap: Record<KeuanganDocType, string> = {
      proforma_invoice: 'PI-TER',
      invoice_penjualan: 'INV-TER',
      invoice_pembelian: 'INV-SUP',
      kwitansi: 'KWT-TER',
      bukti_bayar_supplier: 'BBS-TER',
      rekap_pembayaran: 'REK-TER',
      laporan_piutang: 'PIU-TER',
      laporan_hutang: 'HUT-TER'
    };

    const newDoc: KeuanganItem = {
      id: `keu-${Date.now()}`,
      docType: formDocType,
      nomorDokumen: `${prefixMap[formDocType]}-${dateFormatted}-${rand}`,
      tanggal: new Date().toISOString().split('T')[0],
      total: Number(formData.total) || 0,
      status: formData.status || 'Belum Lunas',
      ...formData
    };

    saveToStorage([newDoc, ...data]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              Finance & Akuntansi Terniva
            </span>
            <span className="text-xs text-slate-400 font-medium">8 Instrumen Keuangan Terpadu</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Keuangan & Monitoring Pelunasan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat penagihan invoice, kwitansi, bukti pembayaran pemasok, rekap pembayaran, piutang buyer, dan hutang supplier.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4 text-emerald-100" />
          <span>+ Buat Dokumen Keuangan</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Total Piutang Buyer</span>
            <ArrowDownLeft className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-blue-800 mt-1 block">
            Rp {(totalPiutang / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </span>
          <span className="text-[11px] text-slate-500">Monitoring Jatuh Tempo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Total Hutang Supplier</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-rose-800 mt-1 block">
            Rp {(totalHutang / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </span>
          <span className="text-[11px] text-slate-500">Kewajiban Pemasok</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Kas Masuk (Kwitansi)</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-emerald-800 mt-1 block">
            Rp {(totalKasMasuk / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Penerimaan Real</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Pembayaran Supplier</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-900 mt-1 block">
            Rp {(totalBayarSupplier / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </span>
          <span className="text-[11px] text-slate-500">Biro / Transfer Bank</span>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Keuangan ({data.length})
        </button>

        {(Object.keys(docTypeLabels) as KeuanganDocType[]).map((type) => {
          const itemDef = docTypeLabels[type];
          const count = data.filter(d => d.docType === type).length;
          const isActive = activeTab === type;
          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{itemDef.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Active Info */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor invoice, kwitansi, buyer, supplier..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {activeTab !== 'ALL' && (
          <div className="text-xs text-slate-600 bg-emerald-50/70 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-2">
            <span className="font-bold text-emerald-900">{docTypeLabels[activeTab].label}:</span>
            <span>{docTypeLabels[activeTab].fungsi}</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">No. Dokumen</th>
                <th className="py-3 px-4">Jenis Dokumen</th>
                <th className="py-3 px-4">Pihak / Entitas</th>
                <th className="py-3 px-4">Keterangan / Referensi</th>
                <th className="py-3 px-4 text-right">Nilai Tagihan / Jumlah</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada dokumen keuangan yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.nomorDokumen}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {item.tanggal}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {docTypeLabels[item.docType]?.label || item.docType}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {docTypeLabels[item.docType]?.fungsi}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.buyer && (
                        <div>
                          <span className="text-[10px] text-slate-400 block">Buyer:</span>
                          {item.buyer}
                        </div>
                      )}
                      {item.supplier && (
                        <div>
                          <span className="text-[10px] text-slate-400 block">Supplier:</span>
                          {item.supplier}
                        </div>
                      )}
                      {item.pembayar && (
                        <div>
                          <span className="text-[10px] text-slate-400 block">Pembayar:</span>
                          {item.pembayar}
                        </div>
                      )}
                      {!item.buyer && !item.supplier && !item.pembayar && (
                        <span>{item.invoiceRef || '-'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.produk && (
                        <div className="font-medium text-slate-900">{item.produk}</div>
                      )}
                      {item.referensiTransaksi && (
                        <div className="text-[11px] text-slate-600">{item.referensiTransaksi}</div>
                      )}
                      {item.termin && (
                        <div className="text-[10px] text-emerald-700">{item.termin}</div>
                      )}
                      {item.dibayar !== undefined && item.sisaTagihan !== undefined && (
                        <div className="text-[10px] text-slate-500">
                          Dibayar: Rp {item.dibayar.toLocaleString('id-ID')} • Sisa: Rp {item.sisaTagihan.toLocaleString('id-ID')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      Rp {item.total.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {item.jatuhTempo || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        item.status === 'Lunas' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : item.status === 'Sebagian'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : item.status === 'Jatuh Tempo'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedDoc(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold block">
                  {selectedDoc.nomorDokumen}
                </span>
                <h3 className="text-sm font-bold">
                  {docTypeLabels[selectedDoc.docType]?.label} — Dokumen Keuangan
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Fungsi</span>
                  <span className="font-semibold text-slate-900">{docTypeLabels[selectedDoc.docType]?.fungsi}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tanggal Penerbitan</span>
                  <span className="font-semibold text-slate-900">{selectedDoc.tanggal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Nilai</span>
                  <span className="font-bold text-emerald-800 text-sm">Rp {selectedDoc.total.toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Pembayaran</span>
                  <span className="font-bold text-slate-900">{selectedDoc.status}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-slate-700">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 uppercase">
                  Informasi Transaksi
                </h4>
                {selectedDoc.buyer && <div><span className="text-[10px] text-slate-400 block font-bold">Buyer:</span>{selectedDoc.buyer}</div>}
                {selectedDoc.supplier && <div><span className="text-[10px] text-slate-400 block font-bold">Supplier:</span>{selectedDoc.supplier}</div>}
                {selectedDoc.pembayar && <div><span className="text-[10px] text-slate-400 block font-bold">Pembayar:</span>{selectedDoc.pembayar}</div>}
                {selectedDoc.produk && <div><span className="text-[10px] text-slate-400 block font-bold">Produk:</span>{selectedDoc.produk}</div>}
                {selectedDoc.termin && <div><span className="text-[10px] text-slate-400 block font-bold">Termin:</span>{selectedDoc.termin}</div>}
                {selectedDoc.jatuhTempo && <div><span className="text-[10px] text-slate-400 block font-bold">Jatuh Tempo:</span>{selectedDoc.jatuhTempo}</div>}
                {selectedDoc.metode && <div><span className="text-[10px] text-slate-400 block font-bold">Metode Pembayaran:</span>{selectedDoc.metode}</div>}
                {selectedDoc.referensiTransaksi && <div><span className="text-[10px] text-slate-400 block font-bold">Referensi:</span>{selectedDoc.referensiTransaksi}</div>}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  PT. Inovasi Digital Kreasi — Terniva
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Invoice / Kwitansi</span>
                  </button>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Buat Dokumen Keuangan Baru</h3>
                <p className="text-[11px] text-emerald-200">Pilih instrumen penagihan, kwitansi, atau monitoring hutang/piutang</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jenis Dokumen Keuangan</label>
                <select
                  value={formDocType}
                  onChange={(e) => setFormDocType(e.target.value as KeuanganDocType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {(Object.keys(docTypeLabels) as KeuanganDocType[]).map((type) => (
                    <option key={type} value={type}>
                      {docTypeLabels[type].label} — {docTypeLabels[type].fungsi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {formDocType.includes('supplier') || formDocType === 'laporan_hutang' || formDocType === 'invoice_pembelian'
                      ? 'Nama Supplier / Pemasok'
                      : 'Nama Buyer / Pembayar'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyer || formData.supplier || formData.pembayar || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      buyer: e.target.value,
                      supplier: e.target.value,
                      pembayar: e.target.value 
                    })}
                    placeholder="Contoh: PT Sumber Pangan Nusantara"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nominal Jumlah (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={formData.total || 0}
                    onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jatuh Tempo (Opsional)</label>
                  <input
                    type="date"
                    value={formData.jatuhTempo || ''}
                    onChange={(e) => setFormData({ ...formData, jatuhTempo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Pembayaran</label>
                  <select
                    value={formData.status || 'Belum Lunas'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Belum Lunas">Belum Lunas</option>
                    <option value="Sebagian">Sebagian</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Jatuh Tempo">Jatuh Tempo</option>
                    <option value="Draf">Draf</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Referensi / Catatan Transaksi</label>
                <input
                  type="text"
                  value={formData.referensiTransaksi || ''}
                  onChange={(e) => setFormData({ ...formData, referensiTransaksi: e.target.value })}
                  placeholder="Contoh: Pelunasan tahap 2 via Bank Mandiri"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition"
                >
                  Simpan Dokumen Keuangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
