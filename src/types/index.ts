export type ModuleCode = 
  | '01' // Legalitas & Kemitraan
  | '02' // Proposal & Penawaran
  | '03' // Transaksi & Penjualan
  | '04' // Keuangan & Invoice
  | '05' // QC & Delivery
  | '06' // Operasional & SOP
  | '07' // Standar Produk & Traceability
  | '08' // Ekspor
  | '09'; // Arsip & Laporan

export type DocumentStatus = 
  | 'DRAFT' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'SENT' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface ModuleInfo {
  code: ModuleCode;
  name: string;
  shortTitle: string;
  purpose: string;
  color: string;
  iconName: string;
  docTypes: string[];
}

export interface DocumentItem {
  name: string;
  grade?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  specNotes?: string;
}

export interface TernivaDocument {
  id: string;
  documentNumber: string;
  documentType: string;
  moduleCode: ModuleCode;
  referenceType: 'TRANSAKSI' | 'MITRA' | 'BUYER' | 'BATCH' | 'EKSPEDISI' | 'EKSPOR' | 'OPERASIONAL';
  referenceId: string;
  documentDate: string;
  createdBy: string;
  approvedBy: string;
  approvalDate?: string;
  documentStatus: DocumentStatus;
  version: string;
  partnerName: string;
  partnerType: 'SUPPLIER_PETANI' | 'BUYER_HORECA' | 'EKSPEDISI' | 'EKSPORTIR' | 'INTERNAL';
  commodity: string;
  totalValue: number;
  notes: string;
  fileUrl?: string;
  attachmentName?: string;
  
  // Specific details for official preview
  items?: DocumentItem[];
  paymentTerms?: string;
  deliveryAddress?: string;
  driverName?: string;
  vehicleNumber?: string;
  batchId?: string;
  qcResult?: {
    grade: string;
    temperatureCelsius?: number;
    defectPercentage?: number;
    moisturePercentage?: number;
    inspectionNotes: string;
    inspectorName: string;
  };
  exportDetails?: {
    destinationCountry: string;
    hsCode: string;
    incoterms: string;
    vesselOrFlight: string;
    containerNo?: string;
    cooNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BatchTraceability {
  batchId: string;
  commodity: string;
  producerName: string;
  producerType: 'Petani' | 'Peternak' | 'Nelayan';
  farmLocation: string;
  harvestDate: string;
  initialQuantity: number;
  unit: string;
  gradeAssigned: string;
  qcInspector: string;
  qcDate: string;
  soNumber: string;
  deliveryDocNumber: string;
  buyerName: string;
  deliveredDate: string;
  status: 'Dipanen' | 'QC Lolos' | 'Sedang Dikirim' | 'Diterima Buyer';
}

export interface TransactionChain {
  transactionId: string;
  buyerName: string;
  supplierName: string;
  commodity: string;
  totalQuantity: number;
  unit: string;
  totalAmount: number;
  status: 'Proses' | 'Pengiriman' | 'Lunas' | 'Selesai';
  documents: {
    poBuyer?: string;
    salesOrder?: string;
    poSupplier?: string;
    deliveryOrder?: string;
    suratJalan?: string;
    bast?: string;
    invoice?: string;
    receipt?: string;
    qcReport?: string;
  };
}
