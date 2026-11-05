import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingCart, 
  Truck, 
  FileCheck2, 
  CreditCard, 
  ClipboardCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { TernivaDocument, TransactionChain } from '../types';

interface QuickTransactionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (newDocs: TernivaDocument[], newChain: TransactionChain) => void;
}

export const QuickTransactionWizard: React.FC<QuickTransactionWizardProps> = ({
  isOpen,
  onClose,
  onGenerated
}) => {
  const [buyerName, setBuyerName] = useState('Hotel Grand Horison Jakarta');
  const [supplierName, setSupplierName] = useState('Koperasi Peternak Lembu Makmur Boyolali');
  const [commodity, setCommodity] = useState('Daging Sapi Tenderloin Segar Chilled');
  const [quantity, setQuantity] = useState(250);
  const [unit, setUnit] = useState('kg');
  const [unitPrice, setUnitPrice] = useState(185000);
  const [driverName, setDriverName] = useState('Heri Setiawan');
  const [vehicleNumber, setVehicleNumber] = useState('B 9821 TNA (Cold Box)');
  const [deliveryAddress, setDeliveryAddress] = useState('Kitchen Receiving Lt. G, Grand Horison Hotel, Jl. Thamrin No. 10 Jakarta');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<{
    chain: TransactionChain | null;
    docCount: number;
  }>({ chain: null, docCount: 0 });

  if (!isOpen) return null;

  const totalValue = quantity * unitPrice;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const serial = Math.floor(1000 + Math.random() * 9000);
    const trxId = `TRX-2026-${serial}`;
    const batchId = `BATCH-${commodity.split(' ')[0].toUpperCase()}-2026-${serial}`;

    const soDocNumber = `TRN-SO/2026/11/${serial}`;
    const doDocNumber = `TRN-DO/2026/11/${serial}`;
    const sjDocNumber = `TRN-SJ/2026/11/${serial}`;
    const bastDocNumber = `TRN-BAST/2026/11/${serial}`;
    const invDocNumber = `TRN-INV/2026/11/${serial}`;
    const qcDocNumber = `TRN-QC/2026/11/${serial}`;
    const poSupDocNumber = `TRN-POSUP/2026/11/${serial}`;

    const items = [
      {
        name: commodity,
        grade: 'Grade A Standar Terniva',
        quantity,
        unit,
        unitPrice,
        totalPrice: totalValue,
        specNotes: 'Kualitas higienis, pengiriman suhu terkontrol'
      }
    ];

    // Create 6 automatically linked documents without re-typing data
    const newDocs: TernivaDocument[] = [
      // 1. Sales Order (Modul 03)
      {
        id: `DOC-SO-${serial}`,
        documentNumber: soDocNumber,
        documentType: 'Sales Order (SO)',
        moduleCode: '03',
        referenceType: 'TRANSAKSI',
        referenceId: trxId,
        documentDate: dateStr,
        createdBy: 'Budi Santoso (Admin Terniva)',
        approvedBy: 'Hendra Wijaya (Manajer Operasional)',
        approvalDate: dateStr,
        documentStatus: 'APPROVED',
        version: '1.0',
        partnerName: buyerName,
        partnerType: 'BUYER_HORECA',
        commodity,
        totalValue,
        notes: `Pesanan penjualan resmi untuk ${buyerName}. Pasokan dari ${supplierName}.`,
        batchId,
        items,
        deliveryAddress,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      // 2. PO Supplier (Modul 03)
      {
        id: `DOC-POSUP-${serial}`,
        documentNumber: poSupDocNumber,
        documentType: 'Purchase Order Supplier',
        moduleCode: '03',
        referenceType: 'TRANSAKSI',
        referenceId: trxId,
        documentDate: dateStr,
        createdBy: 'Budi Santoso (Admin Terniva)',
        approvedBy: 'Hendra Wijaya (Manajer Operasional)',
        approvalDate: dateStr,
        documentStatus: 'APPROVED',
        version: '1.0',
        partnerName: supplierName,
        partnerType: 'SUPPLIER_PETANI',
        commodity,
        totalValue: Math.round(totalValue * 0.85), // Harga beli supplier ~85%
        notes: `Pemesanan pasokan komoditas langsung ke mitra ${supplierName}.`,
        batchId,
        items: [
          {
            name: commodity,
            grade: 'Grade A Standar Terniva',
            quantity,
            unit,
            unitPrice: Math.round(unitPrice * 0.85),
            totalPrice: Math.round(totalValue * 0.85)
          }
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      // 3. Form Pemeriksaan QC (Modul 05)
      {
        id: `DOC-QC-${serial}`,
        documentNumber: qcDocNumber,
        documentType: 'Form Pemeriksaan QC',
        moduleCode: '05',
        referenceType: 'BATCH',
        referenceId: batchId,
        documentDate: dateStr,
        createdBy: 'Drh. Fajar Prasetyo / Rahmat QC',
        approvedBy: 'Drh. Fajar Prasetyo',
        approvalDate: dateStr,
        documentStatus: 'COMPLETED',
        version: '1.0',
        partnerName: supplierName,
        partnerType: 'SUPPLIER_PETANI',
        commodity,
        totalValue,
        batchId,
        qcResult: {
          grade: 'Grade A Prima Lolos Sensoris',
          temperatureCelsius: 2.1,
          defectPercentage: 0.3,
          moisturePercentage: 68.0,
          inspectionNotes: 'Aroma segar natural, warna normal standar, lolos uji higienitas siap didistribusikan.',
          inspectorName: 'Admin QC Terniva'
        },
        notes: 'Pemeriksaan sebelum muat ke armada rantai dingin.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      // 4. Delivery Order (DO) (Modul 03)
      {
        id: `DOC-DO-${serial}`,
        documentNumber: doDocNumber,
        documentType: 'Delivery Order (DO)',
        moduleCode: '03',
        referenceType: 'TRANSAKSI',
        referenceId: trxId,
        documentDate: dateStr,
        createdBy: 'Budi Santoso (Admin Terniva)',
        approvedBy: 'Hendra Wijaya (Manajer Operasional)',
        approvalDate: dateStr,
        documentStatus: 'APPROVED',
        version: '1.0',
        partnerName: buyerName,
        partnerType: 'BUYER_HORECA',
        commodity,
        totalValue,
        batchId,
        deliveryAddress,
        items,
        notes: 'Instruksi pengeluaran barang dari gudang/hub Terniva.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      // 5. Surat Jalan (Modul 03)
      {
        id: `DOC-SJ-${serial}`,
        documentNumber: sjDocNumber,
        documentType: 'Surat Jalan',
        moduleCode: '03',
        referenceType: 'TRANSAKSI',
        referenceId: trxId,
        documentDate: dateStr,
        createdBy: 'Budi Santoso (Admin Terniva)',
        approvedBy: 'Siti Rahma (Logistik)',
        approvalDate: dateStr,
        documentStatus: 'SENT',
        version: '1.0',
        partnerName: buyerName,
        partnerType: 'BUYER_HORECA',
        commodity,
        totalValue,
        batchId,
        driverName,
        vehicleNumber,
        deliveryAddress,
        items,
        notes: 'Dokumen pendamping armada perjalanan.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      // 6. BAST Serah Terima (Modul 03)
      {
        id: `DOC-BAST-${serial}`,
        documentNumber: bastDocNumber,
        documentType: 'Berita Acara Serah Terima',
        moduleCode: '03',
        referenceType: 'TRANSAKSI',
        referenceId: trxId,
        documentDate: dateStr,
        createdBy: 'Budi Santoso (Admin Terniva)',
        approvedBy: `PIC Gudang ${buyerName}`,
        approvalDate: dateStr,
        documentStatus: 'APPROVED',
        version: '1.0',
        partnerName: buyerName,
        partnerType: 'BUYER_HORECA',
        commodity,
        totalValue,
        batchId,
        deliveryAddress,
        items,
        notes: 'Diterima dalam kondisi baik, jumlah sesuai, dan temperatur terjaga.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      // 7. Invoice Penjualan (Modul 04)
      {
        id: `DOC-INV-${serial}`,
        documentNumber: invDocNumber,
        documentType: 'Invoice Penjualan',
        moduleCode: '04',
        referenceType: 'TRANSAKSI',
        referenceId: trxId,
        documentDate: dateStr,
        createdBy: 'Budi Santoso (Admin Terniva)',
        approvedBy: 'Dewi Lestari (Finance Manager)',
        approvalDate: dateStr,
        documentStatus: 'SENT',
        version: '1.0',
        partnerName: buyerName,
        partnerType: 'BUYER_HORECA',
        commodity,
        totalValue,
        paymentTerms: 'Termin 14 Hari kerja',
        items,
        notes: 'Tagihan penjualan resmi PT Terniva Agri Nusantara.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    const newChain: TransactionChain = {
      transactionId: trxId,
      buyerName,
      supplierName,
      commodity,
      totalQuantity: quantity,
      unit,
      totalAmount: totalValue,
      status: 'Pengiriman',
      documents: {
        salesOrder: soDocNumber,
        poSupplier: poSupDocNumber,
        qcReport: qcDocNumber,
        deliveryOrder: doDocNumber,
        suratJalan: sjDocNumber,
        bast: bastDocNumber,
        invoice: invDocNumber
      }
    };

    onGenerated(newDocs, newChain);
    setGeneratedResults({ chain: newChain, docCount: newDocs.length });
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Wizard Buat Transaksi Terpadu (1-Klik)</h3>
              <p className="text-xs text-emerald-200">
                Buat Sales Order, otomatis generate DO, Surat Jalan, QC, BAST, dan Invoice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <form onSubmit={handleGenerate} className="p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Otomatisasi Dokumen Terniva:</strong> Anda cukup mengisi rincian di bawah ini. Sistem akan langsung menghubungkan seluruh dokumen tanpa perlu Anda menginput data yang sama berulang kali.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Buyer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Buyer (Hotel / Resto / Perusahaan)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Contoh: Grand Horison Hotel"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Supplier / Mitra */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mitra Pemasok (Petani / Peternak / Nelayan)
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Contoh: Koperasi Peternak Lembu Boyolali"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Commodity & Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Komoditas & Spesifikasi
                </label>
                <input
                  type="text"
                  required
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  placeholder="Contoh: Cabai Merah Keriting Grade A"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Volume
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="ekor">ekor</option>
                    <option value="karton">karton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Harga Satuan (Rp)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Nilai Transaksi
                </label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-emerald-800">
                  Rp {totalValue.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Sopir & Kendaraan
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Nama Pengemudi"
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="No Polisi Armada"
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Pengiriman
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Lokasi bongkar muat buyer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Terbitkan 7 Dokumen Terhubung Sekarang</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Berhasil Menghasilkan {generatedResults.docCount} Dokumen Terpadu!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                ID Transaksi: <strong className="text-slate-900 font-mono">{generatedResults.chain?.transactionId}</strong>
                <br />
                Seluruh dokumen (SO, PO Supplier, QC, DO, Surat Jalan, BAST, dan Invoice) telah otomatis dibuat dan saling terhubung.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Sales Order</span>
                <span className="font-mono font-bold text-emerald-800 text-[11px] truncate block">
                  {generatedResults.chain?.documents.salesOrder}
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Surat Jalan</span>
                <span className="font-mono font-bold text-emerald-800 text-[11px] truncate block">
                  {generatedResults.chain?.documents.suratJalan}
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">BAST Terima</span>
                <span className="font-mono font-bold text-emerald-800 text-[11px] truncate block">
                  {generatedResults.chain?.documents.bast}
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Invoice Tagihan</span>
                <span className="font-mono font-bold text-emerald-800 text-[11px] truncate block">
                  {generatedResults.chain?.documents.invoice}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
              >
                Lihat di Daftar Dokumen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
