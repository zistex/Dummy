import React from 'react';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  PlusCircle, 
  GitFork, 
  FileText, 
  QrCode, 
  Sparkles,
  Link2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'flow' | 'documents' | 'traceability' | 'chains';
  onSelectTab: (tab: 'flow' | 'documents' | 'traceability' | 'chains') => void;
  onOpenQuickWizard: () => void;
  onOpenAddModal: () => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
  totalDocsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickWizard,
  onOpenAddModal,
  userName,
  userRole,
  onLogout,
  totalDocsCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">TERNIVA</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Document Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Master Dokumen Agrikultur, Peternakan & Perikanan
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Information */}
          <div className="flex items-center gap-3">
            {/* Quick Auto-Chain Generator Button */}
            <button
              onClick={onOpenQuickWizard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Buat SO yang otomatis menerbitkan Surat Jalan, DO, BAST, dan Invoice sekaligus"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Transaksi Cepat</span>
              <span className="sm:hidden">Buat SO</span>
            </button>

            {/* Manual New Document Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Tambah Dokumen</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Single Role Identity */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border border-emerald-200">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{userName}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Role: Admin</div>
              </div>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 transition ml-1"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 text-xs font-medium scrollbar-none">
          <button
            onClick={() => onSelectTab('flow')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'flow'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-4 h-4 text-emerald-600" />
            <span>Peta Alur Dokumen (9 Tahap)</span>
          </button>

          <button
            onClick={() => onSelectTab('documents')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'documents'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Semua Dokumen</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
              {totalDocsCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('chains')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'chains'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-4 h-4 text-amber-600" />
            <span>Transaksi Terhubung (PO→SO→SJ→INV)</span>
          </button>

          <button
            onClick={() => onSelectTab('traceability')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'traceability'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-teal-600" />
            <span>Traceability Batch ID</span>
          </button>
        </div>
      </div>
    </header>
  );
};
