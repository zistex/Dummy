import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  Building, 
  User, 
  Award, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { BatchTraceability, TernivaDocument } from '../types';

interface TraceabilityExplorerProps {
  batches: BatchTraceability[];
  documents: TernivaDocument[];
  onViewDocByNumber: (docNumber: string) => void;
}

export const TraceabilityExplorer: React.FC<TraceabilityExplorerProps> = ({
  batches,
  documents,
  onViewDocByNumber
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.batchId || '');

  const filteredBatches = batches.filter(b => 
    b.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.producerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBatch = batches.find(b => b.batchId === selectedBatchId) || batches[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Traceability Asal Produk (Batch ID)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lacak riwayat dari panen/nelayan, uji QC, armada kirim, hingga tiba di buyer.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Batch ID / Komoditas..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Batches Selection List */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
            Daftar Batch Komoditas ({filteredBatches.length})
          </span>

          {filteredBatches.map((batch) => {
            const isSelected = batch.batchId === selectedBatch?.batchId;
            return (
              <div
                key={batch.batchId}
                onClick={() => setSelectedBatchId(batch.batchId)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-teal-800">
                    {batch.batchId}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {batch.producerType}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{batch.commodity}</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{batch.producerName}</span>
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Panen: {batch.harvestDate}</span>
                  <span className="font-semibold text-emerald-700">{batch.gradeAssigned}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Journey Timeline for Selected Batch */}
        {selectedBatch && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {selectedBatch.batchId}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedBatch.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedBatch.commodity}</h3>
                <p className="text-xs text-slate-500">
                  Volume Asal: <strong>{selectedBatch.initialQuantity} {selectedBatch.unit}</strong> • Standar Mutu: <strong className="text-emerald-700">{selectedBatch.gradeAssigned}</strong>
                </p>
              </div>

              {/* QR Code Graphic Representation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center flex flex-col items-center">
                <QrCode className="w-12 h-12 text-slate-800" />
                <span className="text-[10px] font-mono text-slate-500 mt-1">QR Validasi Asli</span>
              </div>
            </div>

            {/* 4-Stage Visual Journey Timeline */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Kronologi Perjalanan Komoditas (Asal → QC → Pengiriman → Buyer)
              </span>

              {/* Step 1: Panen / Asal */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">
                      1. Asal Produksi & Pemanenan ({selectedBatch.producerType})
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {selectedBatch.harvestDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {selectedBatch.producerName}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lokasi: {selectedBatch.farmLocation}</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Pemeriksaan QC & Grading */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-800">
                      2. Pemeriksaan Standar Mutu & QC
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {selectedBatch.qcDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    Hasil Uji: {selectedBatch.gradeAssigned}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Admin QC: {selectedBatch.qcInspector}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Pengiriman Armada Terniva */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-800">
                      3. Distribusi & Dokumen Pengiriman
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Armada Rantai Dingin
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    Surat Jalan: {selectedBatch.deliveryDocNumber}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => onViewDocByNumber(selectedBatch.deliveryDocNumber)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Buka Surat Jalan</span>
                    </button>
                    {selectedBatch.soNumber && (
                      <button
                        onClick={() => onViewDocByNumber(selectedBatch.soNumber)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Buka Sales Order ({selectedBatch.soNumber})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Serah Terima di Buyer */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">
                      4. Penerimaan Akhir di Buyer
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedBatch.deliveredDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {selectedBatch.buyerName}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Status: Transaksi Sukses & Terdokumentasi Lengkap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
