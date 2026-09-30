import React, { useState, useEffect } from 'react';
import { ActiveTab, SystemInfo, AIStatus, DocumentItem, InspectionResult, InspectionReport, Citation, AIProvider } from './types';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InspectionView } from './components/InspectionView';
import { DocumentsView } from './components/DocumentsView';
import { AssistantView } from './components/AssistantView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { CitationModal } from './components/CitationModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [inspections, setInspections] = useState<InspectionResult[]>([]);
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isResettingDemo, setIsResettingDemo] = useState(false);

  // Initial data loading
  const loadInitialData = async () => {
    try {
      const [sys, ai, docs, reps] = await Promise.all([
        api.getSystemInfo().catch(() => null),
        api.getAIStatus().catch(() => null),
        api.getDocuments().catch(() => []),
        api.getReports().catch(() => []),
      ]);

      if (sys) setSystemInfo(sys);
      if (ai) setAIStatus(ai);
      if (docs) setDocuments(docs);
      if (reps) setReports(reps);

      // Seed inspections if reports exist
      if (reps && reps.length > 0 && inspections.length === 0) {
        const firstRep = reps[0];
        setInspections([
          {
            id: 'insp-demo-001',
            equipment_name: firstRep.equipment_name,
            category: firstRep.equipment_category,
            description: 'High-displacement axial piston hydraulic pump mounted on vibration-isolated sub-chassis with fluid line fittings and pressure monitoring manifold.',
            observations: firstRep.observations,
            possible_issues: firstRep.possible_issues,
            recommended_checks: firstRep.recommended_checks,
            confidence_label: 'AI assessment',
            model: 'Qualcomm AI Hub YOLOv8x-cls (INT8) / FieldLens Vision Engine',
            runtime: 'Snapdragon NPU Optimized',
            timestamp: firstRep.created_at,
            is_demo: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Demo reset handler
  const handleResetDemo = async () => {
    setIsResettingDemo(true);
    try {
      await api.resetDemoData();
      await loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResettingDemo(false);
    }
  };

  // Generate report from inspection
  const handleGenerateReport = async (inspection: InspectionResult) => {
    try {
      const report = await api.generateReport({
        equipment_name: inspection.equipment_name,
        equipment_category: inspection.category,
        observations: inspection.observations,
        possible_issues: inspection.possible_issues,
        recommended_checks: inspection.recommended_checks,
        manual_references: [
          {
            document_id: 'doc-demo-manual',
            document_name: 'FieldLens Demonstration Maintenance Manual',
            page_number: 6,
            excerpt: 'Section 3.2: Inspect the fluorocarbon shaft seal during every 500-hour service interval. Any visible fluid weeping or oil residue pooling at the front flange indicates micro-tear degradation.',
          },
          {
            document_id: 'doc-demo-manual',
            document_name: 'FieldLens Demonstration Maintenance Manual',
            page_number: 4,
            excerpt: 'Section 2.4: Normal continuous working pressure is 210 bar (3,045 PSI). System pressure exceeding 260 bar risks instantaneous damage to cylinder barrel faces and drive shaft seals.',
          },
        ],
        assistant_notes: `Visual inspection completed on-device. Observed ${inspection.observations.length} feature checkpoints. Recommended ordering replacement FKM lip seal kit before next scheduled 500-hour shutdown.`,
        technician_name: 'Alex Vance (Lead Mechanical Specialist)',
      });

      setReports((prev) => [report, ...prev]);
      setActiveTab('reports');
    } catch (err) {
      console.error('Failed to generate report:', err);
      alert('Unable to generate report. Please try again.');
    }
  };

  // Document management handlers
  const handleDocumentUploaded = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleDocumentDeleted = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDocumentIndexed = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'indexed' } : d))
    );
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await api.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const currentEquipment = inspections.length > 0 ? inspections[0] : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070a10] text-slate-100 font-sans selection:bg-sky-500/20 selection:text-sky-300 relative">
      {/* Background ambient lighting for glassmorphism panels */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-sky-950/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[350px] bg-slate-800/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Global Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiStatus={aiStatus}
        systemInfo={systemInfo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          aiStatus={aiStatus}
          onResetDemo={handleResetDemo}
          isResetting={isResettingDemo}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              systemInfo={systemInfo}
              aiStatus={aiStatus}
              documents={documents}
              inspections={inspections}
              reports={reports}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'inspection' && (
            <InspectionView
              currentInspection={currentEquipment}
              onInspectionAnalyzed={(res) => {
                setInspections([res, ...inspections]);
              }}
              setActiveTab={setActiveTab}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              documents={documents}
              onDocumentUploaded={handleDocumentUploaded}
              onDocumentDeleted={handleDocumentDeleted}
              onDocumentIndexed={handleDocumentIndexed}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantView
              currentEquipment={currentEquipment}
              documents={documents}
              aiStatus={aiStatus}
              systemInfo={systemInfo}
              onOpenCitation={(cite) => setActiveCitation(cite)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              reports={reports}
              onDeleteReport={handleDeleteReport}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              systemInfo={systemInfo}
              aiStatus={aiStatus}
              onProviderChange={(prov: AIProvider) => {
                setAIStatus((prev) => prev ? { ...prev, active_provider: prov } : null);
              }}
              onRefreshSystem={loadInitialData}
            />
          )}
        </main>
      </div>

      {/* Citation Excerpt Modal */}
      <CitationModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />
    </div>
  );
}
