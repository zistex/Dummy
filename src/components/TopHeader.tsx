import React from 'react';
import { Menu, Sparkles, PlusCircle, ShieldCheck } from 'lucide-react';
import { NavTab } from './Sidebar';

interface TopHeaderProps {
  onOpenSidebar: () => void;
  currentTab: NavTab;
  onOpenQuickWizard: () => void;
  onOpenAddModal: () => void;
  userRole?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenSidebar,
  currentTab,
  onOpenQuickWizard,
  onOpenAddModal
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Statistik & Metrik Dokumen';
      case 'transaksi':
        return 'Dokumen Transaksi Pemasok & Buyer';
      case 'keuangan':
        return 'Dokumen & Monitoring Keuangan';
      case 'laporan':
        return 'Laporan Manajemen Bisnis Terniva';
      case 'ekspor':
        return 'Perdagangan & Manajemen Ekspor';
      case 'flow':
        return 'Alur Dokumen (4 Langkah Mudah)';
      case 'documents':
        return 'Katalog Semua Dokumen';
      case 'chains':
        return 'Rantai Transaksi Terhubung';
      case 'traceability':
        return 'Traceability Batch ID';
      case 'pengajuan':
        return 'Pengajuan ke Finance';
      default:
        return 'Manajemen Dokumen';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Mobile hamburger & Active Tab Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {getTabTitle(currentTab)}
              </h1>
            </div>
          </div>

          {/* Right: Quick actions & Single Role Pill */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenQuickWizard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Transaksi Cepat</span>
              <span className="sm:hidden">+ SO</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Input Manual</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
