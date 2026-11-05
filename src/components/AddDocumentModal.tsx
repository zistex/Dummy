import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  Handshake, 
  FileText,
  Building,
  Tag,
  ArrowRight
} from 'lucide-react';
import { ModuleCode, TernivaDocument, DocumentStatus } from '../types';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doc: TernivaDocument) => void;
  defaultModule?: ModuleCode;
}

// 5 Grouping Tahap Pekerjaan Nyata (Super Sederhana untuk Orang Awam)
const TAHAP_PEKERJAAN = [
  {
    id: 'transaksi',
    label: 'Pesanan Baru (Sales Order)',
    desc: 'Pesanan masuk dari pembeli / restoran / hotel',
    icon: ShoppingCart,
    color: 'emerald',
    docType: 'Sales Order (SO)',
    moduleCode: '03' as ModuleCode,
    partnerType: 'BUYER_HORECA' as const
  },
  {
    id: 'kirim',
    label: 'Pengiriman & Surat Jalan',
    desc: 'Pengantaran barang oleh sopir / armada pengangkut',
    icon: Truck,
    color: 'indigo',
    docType: 'Surat Jalan',
    moduleCode: '03' as ModuleCode,
    partnerType: 'BUYER_HORECA' as const
  },
  {
    id: 'tagihan',
    label: 'Penagihan & Invoice',
    desc: 'Menerbitkan tagihan pembayaran resmi ke pelanggan',
    icon: CreditCard,
    color: 'purple',
    docType: 'Invoice Penjualan',
    moduleCode: '04' as ModuleCode,
    partnerType: 'BUYER_HORECA' as const
  },
  {
    id: 'kemitraan',
    label: 'Perjanjian & Kemitraan (PKS / MOU)',
    desc: 'Kerja sama pasokan dengan petani, peternak, atau nelayan',
    icon: Handshake,
    color: 'blue',
    docType: 'Perjanjian Kerja Sama Pemasok',
    moduleCode: '01' as ModuleCode,
    partnerType: 'SUPPLIER_PETANI' as const
  },
  {
    id: 'penawaran',
    label: 'Penawaran Harga (SPH)',
    desc: 'Kirim surat daftar harga produk ke calon pembeli',
    icon: FileText,
    color: 'amber',
    docType: 'Surat Penawaran Harga',
    moduleCode: '02' as ModuleCode,
    partnerType: 'BUYER_HORECA' as const
  }
];

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  // User selects Tahap Pekerjaan, NOT confusing technical document codes!
  const [selectedTahapId, setSelectedTahapId] = useState<string>('transaksi');
  const activeTahap = TAHAP_PEKERJAAN.find(t => t.id === selectedTahapId) || TAHAP_PEKERJAAN[0];

  const [partnerName, setPartnerName] = useState('');
  const [commodity, setCommodity] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<string>('kg');
  const [unitPrice, setUnitPrice] = useState<number>(50000);
  const [notes, setNotes] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const totalValue = quantity * unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serial = Math.floor(1000 + Math.random() * 9000);
    const prefix = activeTahap.docType.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'DOC');
    const docNumber = `TRN-${prefix}/2026/11/${serial}`;
    const now = new Date().toISOString();

    const newDoc: TernivaDocument = {
      id: `DOC-JOB-${serial}`,
      documentNumber: docNumber,
      documentType: activeTahap.docType,
      moduleCode: activeTahap.moduleCode,
      referenceType: 'TRANSAKSI',
      referenceId: `TRX-2026-${serial}`,
      documentDate,
      createdBy: 'Budi Santoso (Admin)',
      approvedBy: 'Hendra Wijaya (Manajer Operasional)',
      approvalDate: documentDate,
      documentStatus: 'APPROVED',
      version: '1.0',
      partnerName: partnerName || 'Mitra Rekanan',
      partnerType: activeTahap.partnerType,
      commodity: commodity || 'Komoditas Terstandar',
      totalValue,
      notes: notes || `Diterbitkan pada tahap pekerjaan: ${activeTahap.label}.`,
      items: [
        {
          name: commodity || 'Komoditas',
          grade: 'Grade A Terstandar',
          quantity,
          unit,
          unitPrice,
          totalPrice: totalValue
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    onAdd(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold">Buat Dokumen Berdasarkan Tahap Pekerjaan</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih pekerjaan yang sedang dilakukan, jenis dokumen otomatis disesuaikan sistem.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Step 1: Select Tahap Pekerjaan (Clean Cards) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              1. Pilih Tahap Pekerjaan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TAHAP_PEKERJAAN.map((tahap) => {
                const Icon = tahap.icon;
                const isSelected = selectedTahapId === tahap.id;
                return (
                  <div
                    key={tahap.id}
                    onClick={() => setSelectedTahapId(tahap.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 leading-tight">
                        {tahap.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {tahap.desc}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-800 mt-1">
                        Dokumen: <strong>{tahap.docType}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Simple Business Data Inputs */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              2. Masukkan Informasi Pekerjaan:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Pelanggan / Mitra / Penerima
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Contoh: Hotel Grand Horison / Resto Padang"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Komoditas / Barang
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    placeholder="Contoh: Daging Sapi / Cabai Merah"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Jumlah Volume
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="ekor">ekor</option>
                    <option value="karton">karton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Harga Satuan (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Total Nilai (Otomatis)
                </label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold text-emerald-800 text-xs">
                  Rp {totalValue.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tanggal & Catatan Tambahan (Opsional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="date"
                  required
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Pengiriman pagi, kemasan vacuum pack..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Terbitkan Dokumen ({activeTahap.docType})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
