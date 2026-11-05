import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  FileText, 
  QrCode,
  Building2,
  Truck,
  Globe,
  Tag,
  ArrowRight
} from 'lucide-react';
import { TernivaDocument, DocumentStatus } from '../types';

interface DocumentModalProps {
  document: TernivaDocument | null;
  onClose: () => void;
  onUpdateStatus: (docId: string, newStatus: DocumentStatus) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  onClose,
  onUpdateStatus
}) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadgeStyle = (status: DocumentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SENT':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const statuses: DocumentStatus[] = ['DRAFT', 'REVIEW', 'APPROVED', 'SENT', 'COMPLETED'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {document.documentNumber}
              </span>
              <h4 className="text-xs font-medium text-slate-300">
                {document.documentType}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Status Advance */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg text-xs">
              <span className="text-slate-400 text-[11px]">Ubah Status:</span>
              <select
                value={document.documentStatus}
                onChange={(e) => onUpdateStatus(document.id, e.target.value as DocumentStatus)}
                className="bg-slate-700 text-white text-xs font-semibold rounded px-2 py-0.5 border border-slate-600 focus:outline-none"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              title="Cetak atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Paper Sheet */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex-1">
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-sm rounded-xl border border-slate-200 print-container relative text-slate-900 font-sans">
            
            {/* Status Stamp Watermark */}
            <div className="absolute right-8 top-32 rotate-[-12deg] pointer-events-none select-none opacity-85">
              <div className={`border-4 border-dashed px-4 py-1.5 rounded-lg text-center font-bold font-mono tracking-widest text-xs uppercase ${
                document.documentStatus === 'COMPLETED'
                  ? 'border-emerald-600 text-emerald-700'
                  : document.documentStatus === 'APPROVED'
                  ? 'border-blue-600 text-blue-700'
                  : document.documentStatus === 'SENT'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-amber-600 text-amber-700'
              }`}>
                [ TERNIVA {document.documentStatus} ]
              </div>
            </div>

            {/* Official Letterhead (KOP SURAT RESMI TERNIVA) */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    T
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-950">
                      PT. INOVASI DIGITAL KREASI
                    </h1>
                    <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Integrated Digital, Technology & Supply Chain Authority
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                      Gedung Inovasi Digital Lt. 8, Jakarta Selatan • Email: finance@inovasidigitalkreasi.com • Web: inovasidigitalkreasi.com
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300 uppercase">
                    FORM RESMI
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    ISO 9001:2015 Compliant
                  </div>
                </div>
              </div>
            </div>

            {/* Document Title Header */}
            <div className="text-center my-6">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-slate-950">
                {document.documentType}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-slate-500">Nomor Registrasi:</span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                  {document.documentNumber}
                </span>
              </div>
            </div>

            {/* Metadata Grid (Standard 10 Fields) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs mb-6">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Tanggal Dokumen</span>
                <span className="font-semibold text-slate-900">{document.documentDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Jenis Dokumen</span>
                <span className="font-semibold text-slate-900 truncate block">{document.documentType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Referensi ID</span>
                <span className="font-mono font-semibold text-slate-900">{document.referenceId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Status Resmi</span>
                <span className={`inline-block px-1.5 py-0.2 rounded font-bold text-[10px] border ${getStatusBadgeStyle(document.documentStatus)}`}>
                  {document.documentStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Dibuat Oleh</span>
                <span className="font-medium text-slate-800">{document.createdBy}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Disetujui Oleh</span>
                <span className="font-medium text-slate-800">{document.approvedBy || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Versi Dokumen</span>
                <span className="font-mono text-slate-800">v{document.version}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Batch ID Terkait</span>
                <span className="font-mono text-slate-800">{document.batchId || '-'}</span>
              </div>
            </div>

            {/* Partner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pihak Pertama (Penyelenggara)
                </span>
                <strong className="block text-slate-900 font-bold">PT. Inovasi Digital Kreasi</strong>
                <span className="text-slate-600 block mt-0.5">Divisi Operasional & Manajemen Keuangan</span>
                <span className="text-slate-500 block text-[11px]">NPWP: 01.892.441.2-021.000</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pihak Kedua (Mitra / Buyer / Relasi)
                </span>
                <strong className="block text-slate-900 font-bold">{document.partnerName}</strong>
                <span className="text-slate-600 block mt-0.5">Tipe: {document.partnerType}</span>
                {document.deliveryAddress && (
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Alamat: {document.deliveryAddress}
                  </span>
                )}
              </div>
            </div>

            {/* QC Parameters (If Form QC) */}
            {document.qcResult && (
              <div className="mb-6 p-4 rounded-lg bg-teal-50/60 border border-teal-200 text-xs">
                <h4 className="font-bold text-teal-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Hasil Pengujian Mutu & QC Terniva</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-teal-700 block">Grade Hasil Uji</span>
                    <strong className="text-slate-900">{document.qcResult.grade}</strong>
                  </div>
                  {document.qcResult.temperatureCelsius !== undefined && (
                    <div>
                      <span className="text-[10px] text-teal-700 block">Temperatur Aktual</span>
                      <strong className="text-slate-900">{document.qcResult.temperatureCelsius} °C</strong>
                    </div>
                  )}
                  {document.qcResult.defectPercentage !== undefined && (
                    <div>
                      <span className="text-[10px] text-teal-700 block">Toleransi Cacat</span>
                      <strong className="text-slate-900">{document.qcResult.defectPercentage} %</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-teal-700 block">Admin QC</span>
                    <strong className="text-slate-900">{document.qcResult.inspectorName}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-teal-200 text-[11px] text-teal-900">
                  <strong>Catatan Sensoris / Laboratorium:</strong> {document.qcResult.inspectionNotes}
                </div>
              </div>
            )}

            {/* Transport / Driver info (If Surat Jalan) */}
            {(document.driverName || document.vehicleNumber) && (
              <div className="mb-6 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Pengemudi Armada</span>
                  <div className="font-bold text-slate-900">{document.driverName || 'Armada Logistik Terniva'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Nomor Polisi Armada</span>
                  <div className="font-mono font-bold text-slate-900">{document.vehicleNumber || 'B 8921 TNA'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Tipe Pengiriman</span>
                  <div className="font-medium text-emerald-800">Rantai Dingin (Cold Chain)</div>
                </div>
              </div>
            )}

            {/* Export Details (If Export Document) */}
            {document.exportDetails && (
              <div className="mb-6 p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-xs space-y-2">
                <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-rose-700" />
                  <span>Detail Administrasi Ekspor Internasional</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-rose-700 block">Negara Tujuan</span>
                    <strong>{document.exportDetails.destinationCountry}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-700 block">HS Code</span>
                    <strong className="font-mono">{document.exportDetails.hsCode}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-700 block">Incoterms</span>
                    <strong>{document.exportDetails.incoterms}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-700 block">Vessel / Flight</span>
                    <strong>{document.exportDetails.vesselOrFlight}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-700 block">Container No.</span>
                    <strong className="font-mono">{document.exportDetails.containerNo || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-700 block">No. COO / SKA</span>
                    <strong className="font-mono">{document.exportDetails.cooNumber || '-'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Itemized Table */}
            {document.items && document.items.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-lg border border-slate-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                      <th className="py-2 px-3 font-semibold w-10 text-center">No</th>
                      <th className="py-2 px-3 font-semibold">Deskripsi Komoditas & Spesifikasi</th>
                      <th className="py-2 px-3 font-semibold">Grade</th>
                      <th className="py-2 px-3 font-semibold text-right">Volume</th>
                      <th className="py-2 px-3 font-semibold text-right">Harga Satuan</th>
                      <th className="py-2 px-3 font-semibold text-right">Total (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {document.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {item.name}
                          {item.specNotes && (
                            <span className="block text-[10px] text-slate-500 font-normal">
                              {item.specNotes}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{item.grade || 'Standar'}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                          {item.quantity.toLocaleString('id-ID')} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          Rp {item.unitPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          Rp {item.totalPrice.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {document.totalValue > 0 && (
                    <tfoot>
                      <tr className="bg-slate-50 font-bold border-t border-slate-300">
                        <td colSpan={5} className="py-2.5 px-3 text-right text-slate-700">
                          Total Nilai Transaksi:
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-800 text-sm">
                          Rp {document.totalValue.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* Notes & Terms */}
            <div className="mb-8 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <strong className="text-slate-800 block text-[11px] uppercase tracking-wide">
                Catatan & Ketentuan:
              </strong>
              <p className="text-slate-600 leading-relaxed">{document.notes}</p>
              {document.paymentTerms && (
                <p className="text-emerald-800 font-medium pt-1">
                  Termin Pembayaran: {document.paymentTerms}
                </p>
              )}
            </div>

            {/* Signatures & QR Validation Stamp */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
              {/* Pihak Pertama */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Dikeluarkan Oleh,
                </span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                  PT. Inovasi Digital Kreasi
                </span>
                <div className="h-16 flex items-center justify-center">
                  <span className="font-serif italic text-emerald-800 text-sm font-semibold border-b border-slate-300 pb-1">
                    {document.createdBy.split(' ')[0]} S.
                  </span>
                </div>
                <div className="text-slate-900 font-semibold">{document.createdBy}</div>
                <div className="text-[10px] text-slate-500">Admin Terniva</div>
              </div>

              {/* QR Code Validation */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-2 border border-slate-300 rounded bg-white">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  E-VERIFIKASI TERNIVA
                </span>
              </div>

              {/* Pihak Kedua */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Diterima / Disetujui Oleh,
                </span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5 truncate">
                  {document.partnerName}
                </span>
                <div className="h-16 flex items-center justify-center">
                  <span className="font-serif italic text-slate-600 text-sm font-semibold border-b border-slate-300 pb-1">
                    ( Tanda Tangan Resmi )
                  </span>
                </div>
                <div className="text-slate-900 font-semibold truncate">{document.approvedBy || 'Pihak Berwenang'}</div>
                <div className="text-[10px] text-slate-500">Penanggung Jawab / Penerima</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
