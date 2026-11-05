import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  Eye, 
  Calendar, 
  Tag, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  PlusCircle,
  Download,
  Trash2,
  Building,
  UserCheck
} from 'lucide-react';
import { TernivaDocument, ModuleCode, DocumentStatus } from '../types';
import { MODULES_INFO } from '../data/initialData';

interface DocumentExplorerProps {
  documents: TernivaDocument[];
  selectedModule: ModuleCode | 'ALL';
  onSelectModule: (mod: ModuleCode | 'ALL') => void;
  onViewDoc: (doc: TernivaDocument) => void;
  onOpenAddModal: () => void;
  onDeleteDoc: (id: string) => void;
}

export const DocumentExplorer: React.FC<DocumentExplorerProps> = ({
  documents,
  selectedModule,
  onSelectModule,
  onViewDoc,
  onOpenAddModal,
  onDeleteDoc
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');

  // Filtered documents
  const filtered = documents.filter((doc) => {
    const matchesModule = selectedModule === 'ALL' || doc.moduleCode === selectedModule;
    const matchesStatus = statusFilter === 'ALL' || doc.documentStatus === statusFilter;
    const matchesQuery = 
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SENT':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const currentModuleInfo = MODULES_INFO.find(m => m.code === selectedModule);

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor dokumen, nama buyer, komoditas, atau mitra..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="REVIEW">REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="SENT">SENT (Terkirim)</option>
              <option value="COMPLETED">COMPLETED (Selesai)</option>
            </select>

            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>Tambah Dokumen</span>
            </button>
          </div>
        </div>

        {/* Categories Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => onSelectModule('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
              selectedModule === 'ALL'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Dokumen ({documents.length})
          </button>

          {MODULES_INFO.map((mod) => {
            const count = documents.filter(d => d.moduleCode === mod.code).length;
            const isSelected = selectedModule === mod.code;
            return (
              <button
                key={mod.code}
                onClick={() => onSelectModule(mod.code)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{mod.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Description Header if filtered */}
      {currentModuleInfo && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl flex items-start justify-between gap-4 text-xs">
          <div>
            <h3 className="font-bold text-emerald-950 text-sm">
              {currentModuleInfo.name}
            </h3>
            <p className="text-emerald-900 mt-0.5 leading-relaxed">
              {currentModuleInfo.purpose}
            </p>
          </div>
          <button
            onClick={() => onSelectModule('ALL')}
            className="text-[11px] font-semibold text-emerald-800 hover:underline shrink-0"
          >
            Tampilkan Semua Dokumen
          </button>
        </div>
      )}

      {/* Documents Grid / Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">Tidak ada dokumen yang sesuai</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Coba ubah kata kunci pencarian atau ganti filter kategori di bagian atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const modInfo = MODULES_INFO.find(m => m.code === doc.moduleCode);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {modInfo?.shortTitle || 'Dokumen'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(doc.documentStatus)}`}>
                      {doc.documentStatus}
                    </span>
                  </div>

                  {/* Document Number & Title */}
                  <div className="mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 block truncate">
                      {doc.documentNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {doc.documentType}
                    </h4>
                  </div>

                  {/* Commodity & Partner */}
                  <div className="space-y-1 my-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{doc.commodity}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.partnerName}</span>
                    </div>
                  </div>

                  {/* Value / Amount if exists */}
                  {doc.totalValue > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Nilai Dokumen:</span>
                      <strong className="font-bold text-slate-900">
                        Rp {doc.totalValue.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {doc.documentDate}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewDoc(doc)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      title="Buka Lembar Resmi & Cetak Kop"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat & Cetak</span>
                    </button>
                    
                    <button
                      onClick={() => onDeleteDoc(doc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
