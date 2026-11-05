import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  Eye,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { TernivaDocument, TransactionChain, ModuleCode } from '../types';
import { MODULES_INFO } from '../data/initialData';

interface DashboardStatsProps {
  documents: TernivaDocument[];
  chains: TransactionChain[];
  onSelectModule: (code: ModuleCode) => void;
  onViewDoc: (doc: TernivaDocument) => void;
  onOpenQuickWizard: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  documents,
  chains,
  onSelectModule,
  onViewDoc,
  onOpenQuickWizard
}) => {
  // Calculations
  const totalDocs = documents.length;
  const totalValue = documents.reduce((sum, d) => sum + (d.totalValue || 0), 0);

  // Status counts
  const completedCount = documents.filter(d => d.documentStatus === 'COMPLETED').length;
  const approvedCount = documents.filter(d => d.documentStatus === 'APPROVED').length;
  const sentCount = documents.filter(d => d.documentStatus === 'SENT').length;
  const reviewCount = documents.filter(d => d.documentStatus === 'REVIEW').length;
  const draftCount = documents.filter(d => d.documentStatus === 'DRAFT').length;

  const completionRate = totalDocs > 0 ? Math.round(((completedCount + approvedCount) / totalDocs) * 100) : 0;

  // Commodity Volumes
  const commodityStats = [
    { name: 'Ikan Kerapu Cantang Ekspor', volume: 2000, unit: 'kg', color: 'bg-teal-500' },
    { name: 'Telur Ayam Ras Omega', volume: 800, unit: 'kg', color: 'bg-amber-500' },
    { name: 'Daging Sapi Segar Prime', volume: 570, unit: 'kg', color: 'bg-emerald-600' },
    { name: 'Cabai Merah Keriting', volume: 620, unit: 'kg', color: 'bg-rose-500' }
  ];

  const maxVolume = 2000;

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Documents */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Dokumen</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalDocs}</div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="text-emerald-600 font-bold">Terpadu</span>
            <span>semua kategori</span>
          </div>
        </div>

        {/* Total Transaction Value */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nilai Transaksi</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
            Rp {(totalValue / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Total tercatat dalam sistem
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Penyelesaian</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{completionRate}%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {completedCount + approvedCount} dari {totalDocs} dokumen sah
          </div>
        </div>

        {/* Active Chains */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rantai Transaksi</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{chains.length}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            PO → SO → SJ → BAST → INV
          </div>
        </div>
      </div>

      {/* Status Distribution Progress & Metric Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Distribusi Status Dokumen
          </h3>
          <span className="text-xs font-semibold text-slate-500">{totalDocs} Dokumen Terdaftar</span>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${(completedCount / totalDocs) * 100}%` }} 
            className="bg-emerald-500 h-full transition-all" 
            title={`Completed: ${completedCount}`}
          />
          <div 
            style={{ width: `${(approvedCount / totalDocs) * 100}%` }} 
            className="bg-blue-500 h-full transition-all" 
            title={`Approved: ${approvedCount}`}
          />
          <div 
            style={{ width: `${(sentCount / totalDocs) * 100}%` }} 
            className="bg-indigo-500 h-full transition-all" 
            title={`Sent: ${sentCount}`}
          />
          <div 
            style={{ width: `${(reviewCount / totalDocs) * 100}%` }} 
            className="bg-amber-500 h-full transition-all" 
            title={`Review: ${reviewCount}`}
          />
          <div 
            style={{ width: `${(draftCount / totalDocs) * 100}%` }} 
            className="bg-slate-300 h-full transition-all" 
            title={`Draft: ${draftCount}`}
          />
        </div>

        {/* Status Numbers Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Completed</span>
            <span className="text-lg font-black text-emerald-900">{completedCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
            <span className="text-[10px] font-bold text-blue-800 uppercase block">Approved</span>
            <span className="text-lg font-black text-blue-900">{approvedCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-800 uppercase block">Sent</span>
            <span className="text-lg font-black text-indigo-900">{sentCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Review</span>
            <span className="text-lg font-black text-amber-900">{reviewCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Draft</span>
            <span className="text-lg font-black text-slate-800">{draftCount}</span>
          </div>
        </div>
      </div>

      {/* Grid: Categories Distribution (Pure Numbers) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Statistik Kategori Dokumen
          </h3>
          <span className="text-xs text-slate-500">Klik kategori untuk filter langsung</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {MODULES_INFO.map((mod) => {
            const count = documents.filter(d => d.moduleCode === mod.code).length;
            const percentage = totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0;
            return (
              <div
                key={mod.code}
                onClick={() => onSelectModule(mod.code)}
                className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                      {mod.shortTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    {percentage}% dari total
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-800">{count}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">dok</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Commodity Volume & Recent Transaction Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Commodity Volume Bar Graph */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Volume Komoditas Pangan
          </h3>

          <div className="space-y-3.5">
            {commodityStats.map((item, idx) => {
              const widthPct = Math.round((item.volume / maxVolume) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{item.name}</span>
                    <span className="text-slate-600 font-mono font-bold">
                      {item.volume.toLocaleString('id-ID')} {item.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions List (Pure Metrics, No Fluff) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Transaksi Terkini
            </h3>
            <button
              onClick={onOpenQuickWizard}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>+ Buat Baru</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {chains.slice(0, 4).map((c) => (
              <div key={c.transactionId} className="py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{c.transactionId}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.buyerName}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-800">
                    Rp {(c.totalAmount / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {c.totalQuantity} {c.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
