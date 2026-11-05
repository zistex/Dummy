import React from 'react';
import { 
  ArrowRight, 
  Sparkles,
  Eye,
  Building,
  CheckCircle2
} from 'lucide-react';
import { TransactionChain, TernivaDocument } from '../types';

interface TransactionChainsViewProps {
  chains: TransactionChain[];
  documents: TernivaDocument[];
  onViewDocByNumber: (docNumber: string) => void;
  onOpenQuickWizard: () => void;
}

export const TransactionChainsView: React.FC<TransactionChainsViewProps> = ({
  chains,
  documents,
  onViewDocByNumber,
  onOpenQuickWizard
}) => {
  return (
    <div className="space-y-4">
      {/* Header Minimal */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Rantai Transaksi (Dokumen Terhubung)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Satu transaksi menghubungkan SO, QC, Surat Jalan, BAST, dan Invoice.
          </p>
        </div>

        <button
          onClick={onOpenQuickWizard}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          <span>+ Transaksi Baru</span>
        </button>
      </div>

      {/* Clean Transaction Cards */}
      <div className="space-y-3">
        {chains.map((chain) => {
          // List of core connected documents in chronological order
          const chainDocs = [
            { label: 'SO', number: chain.documents.salesOrder, color: 'text-amber-800 bg-amber-50 border-amber-200' },
            { label: 'QC', number: chain.documents.qcReport, color: 'text-cyan-800 bg-cyan-50 border-cyan-200' },
            { label: 'Surat Jalan', number: chain.documents.suratJalan, color: 'text-indigo-800 bg-indigo-50 border-indigo-200' },
            { label: 'BAST', number: chain.documents.bast, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
            { label: 'Invoice', number: chain.documents.invoice, color: 'text-purple-800 bg-purple-50 border-purple-200' },
            { label: 'Kwitansi', number: chain.documents.receipt, color: 'text-teal-800 bg-teal-50 border-teal-200' }
          ].filter(item => Boolean(item.number));

          return (
            <div
              key={chain.transactionId}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition space-y-3"
            >
              {/* Row 1: Key Summary (No Wall of Text) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {chain.transactionId}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {chain.buyerName}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {chain.commodity} ({chain.totalQuantity} {chain.unit})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-800">
                    Rp {chain.totalAmount.toLocaleString('id-ID')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    chain.status === 'Lunas' || chain.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {chain.status}
                  </span>
                </div>
              </div>

              {/* Row 2: Clean Document Pipeline Chain (Icon buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {chainDocs.map((doc, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => onViewDocByNumber(doc.number!)}
                      className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition hover:shadow-xs cursor-pointer shrink-0 ${doc.color}`}
                      title={`Klik untuk lihat ${doc.label}: ${doc.number}`}
                    >
                      <span className="font-bold">{doc.label}</span>
                      <span className="font-mono text-[11px] opacity-75">{doc.number}</span>
                      <Eye className="w-3 h-3 opacity-60 ml-0.5" />
                    </button>

                    {idx < chainDocs.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
