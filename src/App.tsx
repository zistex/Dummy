/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginScreen } from './components/LoginScreen';
import { DashboardStats } from './components/DashboardStats';
import { DocumentFlowGuide } from './components/DocumentFlowGuide';
import { DocumentExplorer } from './components/DocumentExplorer';
import { TransactionChainsView } from './components/TransactionChainsView';
import { TraceabilityExplorer } from './components/TraceabilityExplorer';
import { DocumentModal } from './components/DocumentModal';
import { QuickTransactionWizard } from './components/QuickTransactionWizard';
import { AddDocumentModal } from './components/AddDocumentModal';
import { PengajuanView } from './components/PengajuanView';
import { TransaksiView } from './components/TransaksiView';
import { KeuanganView } from './components/KeuanganView';
import { LaporanManajemenView } from './components/LaporanManajemenView';
import { EksporView } from './components/EksporView';
import { INITIAL_DOCUMENTS, INITIAL_BATCHES, INITIAL_TRANSACTION_CHAINS } from './data/initialData';
import { TernivaDocument, TransactionChain, BatchTraceability, ModuleCode, DocumentStatus } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication State (Role Tunggal - Admin)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('terniva_auth') === 'true';
  });
  const [userName, setUserName] = useState<string>('Budi Santoso');
  const [userRole, setUserRole] = useState<string>('Admin');

  // Sidebar Drawer Open State (for Mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation State (Default to 'dashboard' as requested)
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedModule, setSelectedModule] = useState<ModuleCode | 'ALL'>('ALL');

  // Data State with LocalStorage Persistence
  const [documents, setDocuments] = useState<TernivaDocument[]>(() => {
    const saved = localStorage.getItem('terniva_documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved docs', e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  const [batches, setBatches] = useState<BatchTraceability[]>(() => {
    const saved = localStorage.getItem('terniva_batches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved batches', e);
      }
    }
    return INITIAL_BATCHES;
  });

  const [chains, setChains] = useState<TransactionChain[]>(() => {
    const saved = localStorage.getItem('terniva_chains');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved chains', e);
      }
    }
    return INITIAL_TRANSACTION_CHAINS;
  });

  // Active Document Modal Preview
  const [activePreviewDoc, setActivePreviewDoc] = useState<TernivaDocument | null>(null);

  // Modal Open States
  const [isQuickWizardOpen, setIsQuickWizardOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('terniva_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('terniva_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('terniva_chains', JSON.stringify(chains));
  }, [chains]);

  // Auth Handlers
  const handleLogin = (name: string, role: string) => {
    setUserName(name);
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('terniva_auth', 'true');
    showToast(`Selamat datang kembali, ${name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('terniva_auth');
  };

  // Document Handlers
  const handleViewDoc = (doc: TernivaDocument) => {
    setActivePreviewDoc(doc);
  };

  const handleViewDocByNumber = (docNumber: string) => {
    const found = documents.find(d => d.documentNumber.trim().toLowerCase() === docNumber.trim().toLowerCase());
    if (found) {
      setActivePreviewDoc(found);
    } else {
      showToast(`Dokumen ${docNumber} tidak ditemukan`);
    }
  };

  const handleUpdateStatus = (docId: string, newStatus: DocumentStatus) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          documentStatus: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    if (activePreviewDoc && activePreviewDoc.id === docId) {
      setActivePreviewDoc(prev => prev ? { ...prev, documentStatus: newStatus } : null);
    }

    showToast(`Status dokumen diubah menjadi ${newStatus}`);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Dokumen berhasil dihapus');
  };

  const handleAddCustomDoc = (newDoc: TernivaDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Dokumen ${newDoc.documentNumber} berhasil ditambahkan`);
  };

  const handleBatchGenerated = (newDocs: TernivaDocument[], newChain: TransactionChain) => {
    setDocuments(prev => [...newDocs, ...prev]);
    setChains(prev => [newChain, ...prev]);
    
    // Also create batch entry for traceability
    const firstDoc = newDocs[0];
    if (firstDoc && firstDoc.batchId) {
      const newBatch: BatchTraceability = {
        batchId: firstDoc.batchId,
        commodity: newChain.commodity,
        producerName: newChain.supplierName,
        producerType: 'Peternak',
        farmLocation: 'Kawasan Sentra Produksi Terniva Jawa Tengah',
        harvestDate: new Date().toISOString().split('T')[0],
        initialQuantity: newChain.totalQuantity,
        unit: newChain.unit,
        gradeAssigned: 'Grade A Standar Terniva',
        qcInspector: 'Admin QC Terniva',
        qcDate: new Date().toISOString().split('T')[0],
        soNumber: newChain.documents.salesOrder || '',
        deliveryDocNumber: newChain.documents.suratJalan || '',
        buyerName: newChain.buyerName,
        deliveredDate: 'Pengiriman Aktif',
        status: 'Sedang Dikirim'
      };
      setBatches(prev => [newBatch, ...prev]);
    }

    showToast(`Berhasil menerbitkan 7 dokumen terpadu untuk ${newChain.buyerName}!`);
  };

  const handleSelectModuleFromFlowOrStats = (code: ModuleCode) => {
    setSelectedModule(code);
    setCurrentTab('documents');
  };

  // If not authenticated, show pristine Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Drawer / Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickWizard={() => setIsQuickWizardOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
        totalDocsCount={documents.length}
      />

      {/* Main Content Area (Offset by 64px on lg desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Minimal Header */}
        <TopHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          currentTab={currentTab}
          onOpenQuickWizard={() => setIsQuickWizardOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          userRole={userRole}
        />

        {/* View Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'dashboard' && (
            <DashboardStats
              documents={documents}
              chains={chains}
              onSelectModule={handleSelectModuleFromFlowOrStats}
              onViewDoc={handleViewDoc}
              onOpenQuickWizard={() => setIsQuickWizardOpen(true)}
            />
          )}

          {currentTab === 'transaksi' && (
            <TransaksiView />
          )}

          {currentTab === 'keuangan' && (
            <KeuanganView />
          )}

          {currentTab === 'laporan' && (
            <LaporanManajemenView />
          )}

          {currentTab === 'ekspor' && (
            <EksporView onNotify={showToast} />
          )}

          {currentTab === 'pengajuan' && (
            <PengajuanView onNotify={showToast} />
          )}

          {currentTab === 'flow' && (
            <DocumentFlowGuide
              documents={documents}
              onSelectModule={handleSelectModuleFromFlowOrStats}
              onOpenQuickWizard={() => setIsQuickWizardOpen(true)}
              onViewDoc={handleViewDoc}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentExplorer
              documents={documents}
              selectedModule={selectedModule}
              onSelectModule={setSelectedModule}
              onViewDoc={handleViewDoc}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {currentTab === 'chains' && (
            <TransactionChainsView
              chains={chains}
              documents={documents}
              onViewDocByNumber={handleViewDocByNumber}
              onOpenQuickWizard={() => setIsQuickWizardOpen(true)}
            />
          )}

          {currentTab === 'traceability' && (
            <TraceabilityExplorer
              batches={batches}
              documents={documents}
              onViewDocByNumber={handleViewDocByNumber}
            />
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="no-print border-t border-slate-200 bg-white py-3 px-4 text-center text-[11px] text-slate-400">
          <span>PT. Inovasi Digital Kreasi &copy; 2026 • Sistem Dokumen Terpadu (Role: Admin)</span>
        </footer>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <DocumentModal
        document={activePreviewDoc}
        onClose={() => setActivePreviewDoc(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      <QuickTransactionWizard
        isOpen={isQuickWizardOpen}
        onClose={() => setIsQuickWizardOpen(false)}
        onGenerated={handleBatchGenerated}
      />

      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomDoc}
        defaultModule={selectedModule === 'ALL' ? '01' : selectedModule}
      />
    </div>
  );
}
