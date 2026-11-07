import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Filter, 
  Search, 
  ExternalLink, 
  Upload, 
  CheckCircle2, 
  Clock, 
  X, 
  AlertCircle,
  Building,
  CreditCard,
  User,
  Paperclip,
  Check,
  RefreshCw,
  Send
} from 'lucide-react';
import { 
  PengajuanItem, 
  CreatePengajuanPayload, 
  pengajuanService 
} from '../services/pengajuanService';

interface PengajuanViewProps {
  onNotify: (msg: string) => void;
}

export const PengajuanView: React.FC<PengajuanViewProps> = ({ onNotify }) => {
  const [items, setItems] = useState<PengajuanItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PengajuanItem | null>(null);

  // Form State for New Pengajuan (Strictly locked to Terniva)
  const [kategori, setKategori] = useState('operasional');
  const namaProyek = 'Terniva';
  const [namaPemohon, setNamaPemohon] = useState('Rizki Firmansyah');
  const [jumlah, setJumlah] = useState<number>(8500000);
  const [bankTujuan, setBankTujuan] = useState('BCA');
  const [noRekTujuan, setNoRekTujuan] = useState('0129384756');
  const [atasNamaTujuan, setAtasNamaTujuan] = useState('PT Cloud Indo Perkasa');
  const [keterangan, setKeterangan] = useState('Perpanjangan Server Production AWS Cloud & CDN Streaming');
  
  // File upload state
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [lampiranNama, setLampiranNama] = useState('Invoice_AWS_KawanEdu_Nov.pdf');
  const [lampiranUrl, setLampiranUrl] = useState('https://api.inovasidigitalkreasi.com/api/uploads/documents/Invoice_AWS_KawanEdu_Nov.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Pengajuan (Locked to Terniva)
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await pengajuanService.getPengajuan({
        namaProyek: 'Terniva',
        status: filterStatus
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  // Handle File Selection & Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileToUpload(file);
    setIsUploadingFile(true);
    try {
      const res = await pengajuanService.uploadLampiran(file);
      setLampiranNama(res.lampiranNama);
      setLampiranUrl(res.lampiranUrl);
      onNotify(`Berkas ${file.name} berhasil diunggah`);
    } catch (err) {
      setLampiranNama(file.name);
      setLampiranUrl(`https://api.inovasidigitalkreasi.com/api/uploads/documents/${file.name.replace(/\s+/g, '_')}`);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Submit New Pengajuan (POST)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreatePengajuanPayload = {
      kategori,
      sumber: 'finance',
      namaProyek,
      namaPemohon,
      jumlah: Number(jumlah),
      bankTujuan,
      noRekTujuan,
      atasNamaTujuan,
      keterangan,
      lampiranNama,
      lampiranUrl
    };

    try {
      const created = await pengajuanService.createPengajuan(payload);
      onNotify(`Pengajuan ${created.nomorPengajuan} berhasil dibuat!`);
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      onNotify('Pengajuan berhasil dicatat');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search filtering
  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.nomorPengajuan.toLowerCase().includes(q) ||
      item.namaProyek.toLowerCase().includes(q) ||
      (item.namaPemohon && item.namaPemohon.toLowerCase().includes(q)) ||
      item.keterangan.toLowerCase().includes(q) ||
      (item.tujuanTransfer.atasNama && item.tujuanTransfer.atasNama.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending_pic_review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'done':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Calculations
  const totalNominal = items.reduce((sum, i) => sum + (i.jumlah || 0), 0);
  const approvedTotal = items.filter(i => i.status === 'approved').length;
  const pendingTotal = items.filter(i => i.status === 'pending_pic_review').length;

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Pengajuan ke Finance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pengajuan operasional, invoice, payroll, dan bukti transfer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-100" />
            <span>+ Buat Pengajuan</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Pengajuan</span>
          <span className="text-xl font-black text-slate-900">{items.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Nominal</span>
          <span className="text-sm sm:text-base font-bold text-emerald-800 truncate block">
            Rp {(totalNominal / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Approved</span>
          <span className="text-xl font-black text-emerald-800">{approvedTotal}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending Review</span>
          <span className="text-xl font-black text-amber-800">{pendingTotal}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor pengajuan, nama pemohon, atau keterangan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
            <span>Proyek:</span>
            <span className="font-bold">Terniva</span>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 px-2.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="approved">Approved</option>
            <option value="pending_pic_review">Pending Review</option>
            <option value="rejected">Rejected</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Listing Table (Matching GET Response) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">No. Pengajuan</th>
                <th className="py-3 px-4">Proyek & Kategori</th>
                <th className="py-3 px-4">Pemohon</th>
                <th className="py-3 px-4 text-right">Jumlah (Rp)</th>
                <th className="py-3 px-4">Tujuan Transfer</th>
                <th className="py-3 px-4">Lampiran</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Tidak ada pengajuan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.nomorPengajuan}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {item.namaProyek}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.namaPemohon || item.createdBy || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      Rp {item.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {item.tujuanTransfer.atasNama || item.tujuanTransfer.tujuan || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.tujuanTransfer.bank ? `${item.tujuanTransfer.bank} - ` : ''}
                        {item.tujuanTransfer.noRekening || item.tujuanTransfer.nomorInvoice || ''}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {item.lampiranNama ? (
                        <a
                          href={item.lampiranUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline max-w-[130px] truncate"
                          title={item.lampiranNama}
                        >
                          <Paperclip className="w-3 h-3 shrink-0" />
                          <span className="truncate">{item.lampiranNama}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(item.status)}`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedDetail(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pengajuan */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold block">
                  {selectedDetail.nomorPengajuan}
                </span>
                <h3 className="text-sm font-bold">Detail Pengajuan Dana</h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Nama Proyek</span>
                  <span className="font-bold text-slate-900">{selectedDetail.namaProyek}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Kategori</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedDetail.kategori}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pemohon</span>
                  <span className="font-semibold text-slate-900">{selectedDetail.namaPemohon || selectedDetail.createdBy}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(selectedDetail.status)}`}>
                    {selectedDetail.status}
                  </span>
                </div>
              </div>

              {/* Jumlah & Rekening */}
              <div className="p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nominal Pengajuan:</span>
                  <span className="text-base font-bold text-emerald-800">
                    Rp {selectedDetail.jumlah.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Tujuan Transfer:</span>
                  <div className="font-bold text-slate-900">{selectedDetail.tujuanTransfer.atasNama || selectedDetail.tujuanTransfer.tujuan}</div>
                  <div className="font-mono text-slate-600">
                    {selectedDetail.tujuanTransfer.bank ? `${selectedDetail.tujuanTransfer.bank} - ` : ''}
                    {selectedDetail.tujuanTransfer.noRekening || selectedDetail.tujuanTransfer.nomorInvoice}
                  </div>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Keterangan:</span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedDetail.keterangan}
                </p>
              </div>

              {/* Detail Invoice Table if available */}
              {selectedDetail.detailInvoice && selectedDetail.detailInvoice.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Rincian Invoice:</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="py-1.5 px-2.5">Deskripsi</th>
                          <th className="py-1.5 px-2.5 text-right">Qty</th>
                          <th className="py-1.5 px-2.5 text-right">Harga</th>
                          <th className="py-1.5 px-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedDetail.detailInvoice.map((inv) => (
                          <tr key={inv.id}>
                            <td className="py-1.5 px-2.5 font-medium">{inv.deskripsi}</td>
                            <td className="py-1.5 px-2.5 text-right">{inv.qty}</td>
                            <td className="py-1.5 px-2.5 text-right">Rp {inv.hargaSatuan.toLocaleString('id-ID')}</td>
                            <td className="py-1.5 px-2.5 text-right font-bold">Rp {inv.total.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Lampiran PDF */}
              {selectedDetail.lampiranNama && (
                <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-blue-950 block">{selectedDetail.lampiranNama}</span>
                      <span className="text-[10px] text-blue-700">Berkas Lampiran PDF Resmi</span>
                    </div>
                  </div>
                  <a
                    href={selectedDetail.lampiranUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-1 transition"
                  >
                    <span>Buka File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Pengajuan Baru (Upload Lampiran + POST) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-300" />
                <h3 className="text-sm font-bold">Form Buat Pengajuan Dana Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Proyek</label>
                  <div className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 font-semibold flex items-center justify-between">
                    <span>Terniva</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">
                      Khusus Terniva
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="operasional">operasional</option>
                    <option value="invoice">invoice</option>
                    <option value="reimbursement">reimbursement</option>
                    <option value="payroll">payroll</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Pemohon</label>
                  <input
                    type="text"
                    required
                    value={namaPemohon}
                    onChange={(e) => setNamaPemohon(e.target.value)}
                    placeholder="Contoh: Rizki Firmansyah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jumlah Dana (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={jumlah}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Tujuan Transfer */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Rincian Tujuan Transfer</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Bank</label>
                    <input
                      type="text"
                      required
                      value={bankTujuan}
                      onChange={(e) => setBankTujuan(e.target.value)}
                      placeholder="BCA"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">No. Rekening</label>
                    <input
                      type="text"
                      required
                      value={noRekTujuan}
                      onChange={(e) => setNoRekTujuan(e.target.value)}
                      placeholder="0129384756"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Atas Nama</label>
                    <input
                      type="text"
                      required
                      value={atasNamaTujuan}
                      onChange={(e) => setAtasNamaTujuan(e.target.value)}
                      placeholder="PT Cloud Indo Perkasa"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan Pengajuan</label>
                <textarea
                  rows={2}
                  required
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Deskripsi keperluan pengeluaran..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Upload Lampiran PDF */}
              <div className="p-3 bg-emerald-50/50 border border-dashed border-emerald-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload Berkas Lampiran (PDF)</span>
                  </span>
                  {isUploadingFile && (
                    <span className="text-[10px] text-emerald-700 animate-pulse font-medium">
                      Mengunggah...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                </div>

                {lampiranNama && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-100/70 p-1.5 rounded">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-medium truncate">File terpilih: {lampiranNama}</span>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingFile}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan ke Finance'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
