import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Truck, 
  ShieldCheck, 
  Globe2, 
  FileSpreadsheet, 
  Printer, 
  Search, 
  Calendar, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Percent, 
  Layers, 
  Coins, 
  ChevronRight,
  Filter
} from 'lucide-react';

export type LaporanType = 
  | 'data_mitra'
  | 'supplier'
  | 'buyer'
  | 'produk'
  | 'penjualan'
  | 'pembelian'
  | 'pendapatan'
  | 'keuntungan'
  | 'piutang_hutang'
  | 'pengiriman'
  | 'qc_retur'
  | 'ekspor';

export const LaporanManajemenView: React.FC = () => {
  const [activeReport, setActiveReport] = useState<LaporanType>('penjualan');
  const [periode, setPeriode] = useState<'nov' | 'q4' | 'ytd'>('nov');
  const [searchQuery, setSearchQuery] = useState('');

  const reportMenu: { id: LaporanType; title: string; subtitle: string; icon: any }[] = [
    { id: 'data_mitra', title: '1. Data Mitra', subtitle: 'Jumlah dan status mitra peternak & kelompok tani', icon: Users },
    { id: 'supplier', title: '2. Performa Supplier', subtitle: 'Volume, kualitas, dan ketepatan pasokan', icon: Building2 },
    { id: 'buyer', title: '3. Aktivitas Buyer', subtitle: 'Frekuensi pesanan, volume, & nilai transaksi', icon: Users },
    { id: 'produk', title: '4. Produk Unggulan', subtitle: 'Komoditas paling banyak diperdagangkan', icon: Layers },
    { id: 'penjualan', title: '5. Penjualan', subtitle: 'Total penjualan, omzet, qty, dan buyer', icon: TrendingUp },
    { id: 'pembelian', title: '6. Pembelian', subtitle: 'Total belanja komoditas ke supplier', icon: Coins },
    { id: 'pendapatan', title: '7. Pendapatan Terniva', subtitle: 'Margin, komisi, dan biaya layanan sistem', icon: Coins },
    { id: 'keuntungan', title: '8. Laba Bersih / Profit', subtitle: 'Pendapatan vs HPP dan biaya operasional', icon: Percent },
    { id: 'piutang_hutang', title: '9. Piutang & Hutang', subtitle: 'Monitoring saldo kewajiban dan jatuh tempo', icon: AlertCircle },
    { id: 'pengiriman', title: '10. Distribusi & Pengiriman', subtitle: 'Ketepatan waktu armada dan keterlambatan', icon: Truck },
    { id: 'qc_retur', title: '11. QC & Retur', subtitle: 'Evaluasi kualitas, komplain, & kerusakan', icon: ShieldCheck },
    { id: 'ekspor', title: '12. Perdagangan Ekspor', subtitle: 'Negara tujuan, volume, dan nilai devisa', icon: Globe2 }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              Executive Dashboard
            </span>
            <span className="text-xs text-slate-400 font-medium">Laporan Manajemen Terniva</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Laporan Manajemen Bisnis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Membantu pemilik Terniva memantau performa 12 lini bisnis tanpa perlu memeriksa satu per satu dokumen transaksi.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="nov">November 2026 (Bulan Ini)</option>
            <option value="q4">Kuartal IV (Okt - Des 2026)</option>
            <option value="ytd">Tahun Berjalan 2026 (YTD)</option>
          </select>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Omzet Penjualan</span>
          <span className="text-lg sm:text-2xl font-black text-slate-900 mt-1 block">Rp 1.485.000.000</span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs bulan lalu</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Belanja Komoditas</span>
          <span className="text-lg sm:text-2xl font-black text-slate-900 mt-1 block">Rp 1.228.400.000</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
            85 Pemasok & Sentra Panen
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Laba Bersih Operasional</span>
          <span className="text-lg sm:text-2xl font-black text-emerald-800 mt-1 block">Rp 186.250.000</span>
          <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
            Net Margin: 12.5%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Ketepatan Distribusi</span>
          <span className="text-lg sm:text-2xl font-black text-blue-800 mt-1 block">97.8% On-Time</span>
          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
            44 dari 45 Kiriman Tepat
          </span>
        </div>
      </div>

      {/* Grid Layout: Left report selector pills, Right report detail table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: 12 Report List */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Daftar 12 Laporan Manajemen
          </div>
          <div className="space-y-1 pt-1 max-h-[560px] overflow-y-auto">
            {reportMenu.map((r) => {
              const Icon = r.icon;
              const isActive = activeReport === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveReport(r.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <div className="truncate">{r.title}</div>
                      <div className={`text-[10px] font-normal truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {r.subtitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Report Content Table */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Laporan Terpilih
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {reportMenu.find(r => r.id === activeReport)?.title}
              </h3>
              <p className="text-xs text-slate-500">
                {reportMenu.find(r => r.id === activeReport)?.subtitle}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Periode Data</span>
              <span className="text-xs font-semibold text-slate-800">
                {periode === 'nov' ? 'November 2026' : periode === 'q4' ? 'Kuartal IV 2026' : 'Tahun 2026 YTD'}
              </span>
            </div>
          </div>

          {/* 1. Laporan Data Mitra */}
          {activeReport === 'data_mitra' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Kategori Mitra</th>
                    <th className="py-2.5 px-3">Wilayah Sentra</th>
                    <th className="py-2.5 px-3 text-right">Jumlah Mitra</th>
                    <th className="py-2.5 px-3">Kapasitas Produksi</th>
                    <th className="py-2.5 px-3 text-center">Status Kemitraan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Peternak Ayam Petelur (Layer)</td>
                    <td className="py-2.5 px-3 text-slate-600">Kendal & Batang, Jawa Tengah</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">42 Peternak</td>
                    <td className="py-2.5 px-3 text-slate-600">18.5 Ton Telur / Minggu</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Aktif & Bersertifikat</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Petani Jagung Pipil Hibrida</td>
                    <td className="py-2.5 px-3 text-slate-600">Grobogan & Demak, Jawa Tengah</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">68 Petani (4 Gapoktan)</td>
                    <td className="py-2.5 px-3 text-slate-600">85 Ton Jagung / Panen</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Aktif Panen</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Peternak Sapi Perah Mandiri</td>
                    <td className="py-2.5 px-3 text-slate-600">Boyolali & Salatiga</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">25 Peternak</td>
                    <td className="py-2.5 px-3 text-slate-600">12.000 Liter Susu / Hari</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Aktif Rutin</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Peternak Domba & Kambing Pedaging</td>
                    <td className="py-2.5 px-3 text-slate-600">Temanggung & Magelang</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">18 Peternak</td>
                    <td className="py-2.5 px-3 text-slate-600">450 Ekor Siap Potong / Bln</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Tahap Pembesaran</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 2. Laporan Supplier */}
          {activeReport === 'supplier' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Nama Supplier</th>
                    <th className="py-2.5 px-3">Produk Pasokan</th>
                    <th className="py-2.5 px-3 text-right">Volume Kirim</th>
                    <th className="py-2.5 px-3 text-center">Grade Kualitas</th>
                    <th className="py-2.5 px-3 text-center">Ketepatan Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Gapoktan Makmur Tani Kendal</td>
                    <td className="py-2.5 px-3 text-slate-700">Jagung Pipil Kering Silo 1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">120 Ton</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Grade A (99%)</span></td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">98.5% (Tepat)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Koperasi Peternak Sapi Boyolali</td>
                    <td className="py-2.5 px-3 text-slate-700">Susu Sapi Segar Dingin</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">75.000 Liter</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Grade Super (BJ 1.028)</span></td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">100% (Sempurna)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Sentra Unggas Berkah Demak</td>
                    <td className="py-2.5 px-3 text-slate-700">Telur Ayam Ras Coklat</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">45 Ton</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Grade A (98.2%)</span></td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">96.0% (Baik)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Laporan Buyer */}
          {activeReport === 'buyer' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Nama Buyer / Perusahaan</th>
                    <th className="py-2.5 px-3 text-center">Jumlah Pesanan</th>
                    <th className="py-2.5 px-3 text-right">Volume Beli</th>
                    <th className="py-2.5 px-3 text-right">Nilai Transaksi (Rp)</th>
                    <th className="py-2.5 px-3 text-center">Status Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">PT Sumber Pangan Nusantara</td>
                    <td className="py-2.5 px-3 text-center font-bold">8 PO</td>
                    <td className="py-2.5 px-3 text-right font-bold">185 Ton</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 642.500.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Lancar (Termin 7 Hari)</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">PT Charoen Pokphand Indonesia Tbk</td>
                    <td className="py-2.5 px-3 text-center font-bold">5 PO</td>
                    <td className="py-2.5 px-3 text-right font-bold">120 Ton</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 480.000.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Lancar</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Superindo Regional Jawa Tengah</td>
                    <td className="py-2.5 px-3 text-center font-bold">14 PO</td>
                    <td className="py-2.5 px-3 text-right font-bold">28 Ton</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 210.000.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Lancar</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 4. Laporan Produk */}
          {activeReport === 'produk' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Nama Produk Komoditas</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Volume Terjual</th>
                    <th className="py-2.5 px-3 text-right">Rata-rata Harga Jual</th>
                    <th className="py-2.5 px-3 text-right">Total Nilai Penjualan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Jagung Pipil Kering Grade A</td>
                    <td className="py-2.5 px-3 text-slate-600">Pakan & Industri</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">180 Ton</td>
                    <td className="py-2.5 px-3 text-right">Rp 5.800 / Kg</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 1.044.000.000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Telur Ayam Ras Segar Coklat</td>
                    <td className="py-2.5 px-3 text-slate-600">Konsumsi Rumah Tangga</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">15.5 Ton</td>
                    <td className="py-2.5 px-3 text-right">Rp 26.500 / Kg</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 410.750.000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Pakan Konsentrat Broiler Starter</td>
                    <td className="py-2.5 px-3 text-slate-600">Pakan Formulasi</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">3.2 Ton</td>
                    <td className="py-2.5 px-3 text-right">Rp 9.500 / Kg</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 30.250.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 5. Laporan Penjualan */}
          {activeReport === 'penjualan' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Periode Transaksi</th>
                    <th className="py-2.5 px-3">Buyer Penerima</th>
                    <th className="py-2.5 px-3 text-right">Kuantitas (Qty)</th>
                    <th className="py-2.5 px-3 text-right">Omzet Penjualan (Rp)</th>
                    <th className="py-2.5 px-3 text-center">Status Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">01 - 07 Nov 2026</td>
                    <td className="py-2.5 px-3 text-slate-700">PT Sumber Pangan Nusantara</td>
                    <td className="py-2.5 px-3 text-right font-bold">25 Ton Jagung</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 145.000.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">BAST & Invoice Selesai</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">02 - 06 Nov 2026</td>
                    <td className="py-2.5 px-3 text-slate-700">PT Charoen Pokphand Indonesia</td>
                    <td className="py-2.5 px-3 text-right font-bold">40 Ton Jagung</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 232.000.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Selesai</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">04 - 07 Nov 2026</td>
                    <td className="py-2.5 px-3 text-slate-700">Superindo Retail Jawa Tengah</td>
                    <td className="py-2.5 px-3 text-right font-bold">4.000 Kg Telur Ras</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">Rp 106.000.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Lunas</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 6. Laporan Pembelian */}
          {activeReport === 'pembelian' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Periode</th>
                    <th className="py-2.5 px-3">Supplier / Mitra</th>
                    <th className="py-2.5 px-3">Produk Komoditas</th>
                    <th className="py-2.5 px-3 text-right">Nilai Pembelian (HPP)</th>
                    <th className="py-2.5 px-3 text-center">Status Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-mono text-slate-900">Nov 2026</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Gapoktan Makmur Tani Kendal</td>
                    <td className="py-2.5 px-3 text-slate-700">Jagung Pipil Kering Silo 1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">Rp 127.500.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">DP Terbayar, Sisa Termin</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono text-slate-900">Nov 2026</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Sentra Unggas Berkah Demak</td>
                    <td className="py-2.5 px-3 text-slate-700">Telur Ayam Ras Coklat</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">Rp 92.000.000</td>
                    <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Lunas</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 7. Laporan Pendapatan Terniva */}
          {activeReport === 'pendapatan' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase">Margin Komoditas</span>
                  <span className="text-base font-bold text-emerald-900">Rp 148.500.000</span>
                  <span className="text-[10px] text-emerald-700">Selisih Jual vs Beli</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-bold block uppercase">Biaya Layanan & QC</span>
                  <span className="text-base font-bold text-blue-900">Rp 28.500.000</span>
                  <span className="text-[10px] text-blue-700">Sertifikasi & Timbang</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-700 font-bold block uppercase">Komisi Agregator</span>
                  <span className="text-base font-bold text-amber-900">Rp 9.250.000</span>
                  <span className="text-[10px] text-amber-700">Mitra Peternak Binaan</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Total pendapatan bruto Terniva periode November 2026 tercatat sebesar <strong>Rp 186.250.000</strong>.
              </p>
            </div>
          )}

          {/* 8. Laporan Keuntungan */}
          {activeReport === 'keuntungan' && (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Komponen Laba Rugi</th>
                      <th className="py-2.5 px-3 text-right">Nilai Nominal (Rp)</th>
                      <th className="py-2.5 px-3 text-right">Persentase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Total Pendapatan (Omzet)</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">Rp 1.485.000.000</td>
                      <td className="py-2 px-3 text-right font-mono">100.0%</td>
                    </tr>
                    <tr className="bg-rose-50/40">
                      <td className="py-2 px-3 text-rose-800">Harga Pokok Pembelian (HPP Supplier)</td>
                      <td className="py-2 px-3 text-right font-bold text-rose-800">(Rp 1.228.400.000)</td>
                      <td className="py-2 px-3 text-right font-mono text-rose-800">82.7%</td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="py-2 px-3 font-bold text-emerald-900">Laba Kotor (Gross Profit)</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-900">Rp 256.600.000</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-900">17.3%</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-700">Biaya Operasional, Gudang & Logistik</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-700">(Rp 70.350.000)</td>
                      <td className="py-2 px-3 text-right font-mono">4.7%</td>
                    </tr>
                    <tr className="bg-emerald-100/60 font-black">
                      <td className="py-3 px-3 text-emerald-950 text-sm">Laba Bersih Operasional (Net Profit)</td>
                      <td className="py-3 px-3 text-right text-emerald-950 text-sm">Rp 186.250.000</td>
                      <td className="py-3 px-3 text-right font-mono text-sm">12.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. Laporan Piutang & Hutang */}
          {activeReport === 'piutang_hutang' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                <span className="text-[10px] text-blue-700 font-bold uppercase block">Ringkasan Piutang Buyer</span>
                <div className="text-xl font-bold text-blue-900">Rp 249.450.000</div>
                <div className="text-xs text-blue-800 space-y-1">
                  <div className="flex justify-between"><span>Belum Jatuh Tempo:</span><span className="font-bold">Rp 160.950.000</span></div>
                  <div className="flex justify-between"><span>Jatuh Tempo &lt; 7 Hari:</span><span className="font-bold text-amber-700">Rp 88.500.000</span></div>
                  <div className="flex justify-between"><span>Macet &gt; 30 Hari:</span><span className="font-bold text-emerald-700">Rp 0 (Nihil)</span></div>
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <span className="text-[10px] text-rose-700 font-bold uppercase block">Ringkasan Hutang Supplier</span>
                <div className="text-xl font-bold text-rose-900">Rp 205.000.000</div>
                <div className="text-xs text-rose-800 space-y-1">
                  <div className="flex justify-between"><span>Jadwal Bayar Minggu Ini:</span><span className="font-bold">Rp 127.500.000</span></div>
                  <div className="flex justify-between"><span>Jadwal Bayar Minggu Depan:</span><span className="font-bold">Rp 77.500.000</span></div>
                  <div className="flex justify-between"><span>Keterlambatan Bayar:</span><span className="font-bold text-emerald-700">Rp 0 (Aman)</span></div>
                </div>
              </div>
            </div>
          )}

          {/* 10. Laporan Pengiriman */}
          {activeReport === 'pengiriman' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Pengiriman</span>
                  <span className="text-xl font-black text-slate-900">45 Trip</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Tepat Waktu</span>
                  <span className="text-xl font-black text-emerald-800">44 Trip (97.8%)</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] text-amber-700 font-bold uppercase block">Keterlambatan</span>
                  <span className="text-xl font-black text-amber-800">1 Trip (2.2%)</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Catatan keterlambatan: 1 trip tertunda 2 jam akibat cuaca hujan lebat di jalur Pantura (Surat Jalan SJ-TER-202611-098).
              </p>
            </div>
          )}

          {/* 11. Laporan QC & Retur */}
          {activeReport === 'qc_retur' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Komoditas Produk</th>
                    <th className="py-2.5 px-3 text-center">Total Batch Diuji</th>
                    <th className="py-2.5 px-3 text-center">Tingkat Lolos QC</th>
                    <th className="py-2.5 px-3 text-center">Jumlah Komplain</th>
                    <th className="py-2.5 px-3 text-right">Persentase Retur / Rusak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Jagung Pipil Kering Grade A</td>
                    <td className="py-2.5 px-3 text-center font-bold">18 Batch</td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">100% Lolos</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">0</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">0.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Telur Ayam Ras Segar</td>
                    <td className="py-2.5 px-3 text-center font-bold">14 Batch</td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">98.8% Lolos</td>
                    <td className="py-2.5 px-3 text-center text-amber-700 font-bold">1 Kasus</td>
                    <td className="py-2.5 px-3 text-right text-amber-700 font-bold">0.4% (Retak cangkang)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Pakan Ternak Formula SP-2</td>
                    <td className="py-2.5 px-3 text-center font-bold">6 Batch</td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">99.0% Lolos</td>
                    <td className="py-2.5 px-3 text-center text-amber-700 font-bold">1 Kasus</td>
                    <td className="py-2.5 px-3 text-right text-amber-700 font-bold">0.8% (Karung sobek)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 12. Laporan Ekspor */}
          {activeReport === 'ekspor' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Negara Tujuan</th>
                    <th className="py-2.5 px-3">Nama Buyer Internasional</th>
                    <th className="py-2.5 px-3">Produk Komoditas</th>
                    <th className="py-2.5 px-3 text-right">Volume Ekspor</th>
                    <th className="py-2.5 px-3 text-right">Nilai Ekspor (USD / IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Singapura</td>
                    <td className="py-2.5 px-3 text-slate-700">SG Agro Foods Pte Ltd</td>
                    <td className="py-2.5 px-3 text-slate-700">Jagung Pipil Grade Ekspor</td>
                    <td className="py-2.5 px-3 text-right font-bold">50 Ton (2 Kontainer)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">$22,500 / Rp 355.500.000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Malaysia</td>
                    <td className="py-2.5 px-3 text-slate-700">Malaya Feedmills Berhad</td>
                    <td className="py-2.5 px-3 text-slate-700">Dedak Padi Halus & Konsentrat</td>
                    <td className="py-2.5 px-3 text-right font-bold">25 Ton (1 Kontainer)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-800">$10,200 / Rp 161.160.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
