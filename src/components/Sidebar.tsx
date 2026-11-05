import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  FileText, 
  Link2, 
  QrCode, 
  PlusCircle, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  X,
  ChevronRight,
  TrendingUp,
  User,
  SendHorizontal
} from 'lucide-react';
import { ModuleCode } from '../types';

export type NavTab = 'dashboard' | 'flow' | 'documents' | 'chains' | 'traceability' | 'pengajuan';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickWizard: () => void;
  onOpenAddModal: () => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
  totalDocsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenQuickWizard,
  onOpenAddModal,
  userName,
  userRole,
  onLogout,
  totalDocsCount
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Statistik',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'flow' as NavTab,
      label: 'Alur Dokumen',
      icon: GitFork,
      badge: '4 Langkah'
    },
    {
      id: 'documents' as NavTab,
      label: 'Semua Dokumen',
      icon: FileText,
      badge: totalDocsCount.toString()
    },
    {
      id: 'chains' as NavTab,
      label: 'Rantai Transaksi',
      icon: Link2,
      badge: null
    },
    {
      id: 'traceability' as NavTab,
      label: 'Traceability Batch',
      icon: QrCode,
      badge: null
    },
    {
      id: 'pengajuan' as NavTab,
      label: 'Pengajuan ke Finance',
      icon: SendHorizontal,
      badge: null
    }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Drawer / Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm font-black">
              IDK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-white">PT. Inovasi Digital Kreasi</span>
              </div>
              <div className="text-[10px] text-slate-400">Terniva Document Management</div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-3.5 space-y-2 border-b border-slate-800/80">
          <button
            onClick={() => {
              onOpenQuickWizard();
              onClose();
            }}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>+ Transaksi Cepat</span>
          </button>

          <button
            onClick={() => {
              onOpenAddModal();
              onClose();
            }}
            className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>+ Input Dokumen</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Role Card & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{userName}</div>
                <div className="text-[10px] text-emerald-400 font-medium">Role: {userRole}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition shrink-0 ml-1"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
