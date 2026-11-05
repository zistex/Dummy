import React from 'react';
import { 
  ShoppingCart, 
  ClipboardCheck, 
  Truck, 
  FileCheck2, 
  ArrowRight, 
  Sparkles,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ModuleCode, TernivaDocument } from '../types';

interface DocumentFlowGuideProps {
  documents: TernivaDocument[];
  onSelectModule: (moduleCode: ModuleCode) => void;
  onOpenQuickWizard: () => void;
  onViewDoc: (doc: TernivaDocument) => void;
}

export const DocumentFlowGuide: React.FC<DocumentFlowGuideProps> = ({
  documents,
  onSelectModule,
  onOpenQuickWizard,
  onViewDoc
}) => {
  // 4 Core Practical Steps that anyone understands immediately
  const simpleSteps = [
    {
      num: 1,
      title: 'Pesanan Masuk',
      docs: ['Purchase Order (PO)', 'Sales Order (SO)'],
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-200',
      icon: ShoppingCart,
      summary: 'Buyer memesan komoditas, Admin menerbitkan Sales Order.',
      sampleDocType: 'Sales Order (SO)'
    },
    {
      num: 2,
      title: 'Pemeriksaan QC',
      docs: ['Form QC', 'Sortasi & Grading'],
      color: 'cyan',
      bgColor: 'bg-cyan-500',
      lightBg: 'bg-cyan-50',
      textColor: 'text-cyan-800',
      borderColor: 'border-cyan-200',
      icon: ClipboardCheck,
      summary: 'Pengecekan kualitas, kesegaran & suhu komoditas.',
      sampleDocType: 'Form Pemeriksaan QC'
    },
    {
      num: 3,
      title: 'Pengiriman Armada',
      docs: ['Delivery Order (DO)', 'Surat Jalan'],
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      textColor: 'text-indigo-800',
      borderColor: 'border-indigo-200',
      icon: Truck,
      summary: 'Surat jalan dibawa sopir saat pengantaran barang.',
      sampleDocType: 'Surat Jalan'
    },
    {
      num: 4,
      title: 'Serah Terima & Lunas',
      docs: ['BAST Terima', 'Invoice', 'Kwitansi'],
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200',
      icon: FileCheck2,
      summary: 'Barang diterima buyer, terbit tagihan & kwitansi lunas.',
      sampleDocType: 'Invoice Penjualan'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Simple Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Alur Dokumen Terniva (4 Langkah Sederhana)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mulai dari pesanan buyer, uji mutu, pengiriman armada, hingga serah terima & tagihan.
          </p>
        </div>

        <button
          onClick={onOpenQuickWizard}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Buat 4 Dokumen Sekaligus (1-Klik)</span>
        </button>
      </div>

      {/* 4 Clean Steps Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {simpleSteps.map((step, idx) => {
          const Icon = step.icon;
          // Find a sample document matching this step
          const sampleDoc = documents.find(d => 
            d.documentType.toLowerCase().includes(step.sampleDocType.toLowerCase())
          ) || documents[0];

          return (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition relative"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                  <div className={`p-2 rounded-xl ${step.lightBg} ${step.textColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {step.summary}
                </p>

                {/* Key Documents in this Step */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                    Dokumen Utama:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {step.docs.map((docName, dIdx) => (
                      <span
                        key={dIdx}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${step.lightBg} ${step.textColor} ${step.borderColor}`}
                      >
                        {docName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Sample Document Action */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                {sampleDoc ? (
                  <button
                    onClick={() => onViewDoc(sampleDoc)}
                    className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lihat Contoh Resmi</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 block text-center">
                    Dokumen aktif
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Connection Rule (Sangat Mudah Dipahami Orang Awam) */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
              Prinsip Otomatis Terniva: Input Sekali, Dokumen Terhubung
            </h4>
            <p className="text-xs text-emerald-900 mt-0.5">
              Admin hanya perlu membuat <strong>Sales Order (SO)</strong>. Sistem otomatis menghasilkan <strong>Surat Jalan, BAST, dan Invoice</strong> dengan nomor dan rincian barang yang sama persis tanpa perlu ketik ulang.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenQuickWizard}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
        >
          Coba Sekarang
        </button>
      </div>
    </div>
  );
};
