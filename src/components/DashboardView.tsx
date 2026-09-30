import React from 'react';
import { 
  ScanSearch, 
  FileText, 
  BotMessageSquare, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Database,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ChevronRight,
  Upload
} from 'lucide-react';
import { ActiveTab, AIStatus, SystemInfo, DocumentItem, InspectionResult, InspectionReport } from '../types';

interface DashboardViewProps {
  systemInfo: SystemInfo | null;
  aiStatus: AIStatus | null;
  documents: DocumentItem[];
  inspections: InspectionResult[];
  reports: InspectionReport[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  systemInfo,
  aiStatus,
  documents,
  inspections,
  reports,
  setActiveTab,
}) => {
  const isSnapdragon = systemInfo?.is_snapdragon_detected;
  const currentEquipment = inspections.length > 0 ? inspections[0] : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Industrial Banner: Premium Translucent Glassmorphism Interface */}
      <div className="glass-panel rounded-lg p-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 bg-slate-800/90 backdrop-blur-md border border-white/15 text-sky-400 rounded shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                SNAPDRAGON AI LAB
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                QUALCOMM BUILD & PRESENT CHALLENGE
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>FIELDLENS INDUSTRIAL AI WORKSTATION</span>
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Private on-device artificial intelligence for industrial asset inspection, mechanical condition monitoring, and grounded maintenance documentation retrieval on Snapdragon-powered HP Windows PCs.
            </p>
          </div>

          {/* Quick-action Industrial Control Buttons */}
          <div className="flex flex-wrap lg:flex-nowrap gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('inspection')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 backdrop-blur-md active:bg-sky-700 text-white font-semibold text-xs rounded border border-sky-400/40 shadow-[0_2px_12px_rgba(2,132,199,0.35)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image / Inspect</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 hover:text-white font-medium text-xs rounded border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Technical Manuals</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 hover:text-white font-medium text-xs rounded border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <BotMessageSquare className="w-4 h-4 text-slate-400" />
              <span>Diagnostic Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Strip (4 Units) with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {/* Unit 1: System Readiness */}
        <div className="glass-panel p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>ENGINE STATUS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-sm font-bold text-slate-100 font-sans">
            AI Engine Operational
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Local Models Primed (0ms Network)
          </div>
        </div>

        {/* Unit 2: Host Hardware */}
        <div className="glass-panel p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>HARDWARE TARGET</span>
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 font-sans truncate" title={systemInfo?.processor}>
            {isSnapdragon ? 'Snapdragon X-series' : (systemInfo?.processor || 'Hardware information unavailable')}
          </div>
          <div className="text-[11px] text-slate-400">
            {systemInfo?.platform || 'Windows'} · {systemInfo?.architecture || 'ARM64'}
          </div>
        </div>

        {/* Unit 3: NPU / Acceleration */}
        <div className="glass-panel p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>AI ACCELERATOR</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 font-sans">
            {isSnapdragon ? 'Qualcomm Hexagon NPU' : 'DirectML Execution'}
          </div>
          <div className="text-[11px] text-sky-400 font-medium">
            {isSnapdragon ? '45 TOPS Matrix Engine' : 'Host Direct Inference'}
          </div>
        </div>

        {/* Unit 4: Privacy & Air-Gap */}
        <div className="glass-panel p-3.5 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>DATA ENCLAVE</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-sans">
            Zero-Cloud Invariant
          </div>
          <div className="text-[11px] text-slate-400">
            Images & Manuals On-Device Only
          </div>
        </div>
      </div>

      {/* Main Two-Column Engineering Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Industrial Asset Specification & Condition State (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider">
                  MONITORED ASSET SPECIFICATION
                </span>
                <h2 className="text-base font-bold text-white font-sans mt-0.5">
                  {currentEquipment ? currentEquipment.equipment_name : 'No Equipment Loaded'}
                </h2>
              </div>

              {currentEquipment?.is_demo && (
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950/70 border border-amber-800/80 text-amber-300 rounded font-semibold backdrop-blur-sm">
                  DEMO DATASET
                </span>
              )}
            </div>

            {/* Industrial Machinery Asset Plate / Nameplate Display */}
            <div className="glass-panel-subtle p-3.5 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">ASSET ID</span>
                <span className="text-slate-200 font-bold">HP-450-AXP</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CLASSIFICATION</span>
                <span className="text-slate-200 font-bold">Fluid Power</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">RATED PRESSURE</span>
                <span className="text-slate-200 font-bold">210 BAR (3,045 PSI)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">RELIEF CRACK</span>
                <span className="text-amber-400 font-bold">250 BAR LIMIT</span>
              </div>
            </div>

            {/* Visual Observations Checklist */}
            {currentEquipment && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
                  VISUAL DEFECT INSPECTION CHECKPOINTS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentEquipment.observations.map((obs, idx) => (
                    <div key={idx} className="glass-panel-subtle p-2.5 rounded-md flex items-start gap-2 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                      <span className="leading-snug">{obs}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flagged Mechanical Anomalies */}
            {currentEquipment && currentEquipment.possible_issues.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
                  CONDITION ALARMS & DISCREPANCIES
                </div>
                <div className="space-y-2">
                  {currentEquipment.possible_issues.map((iss, idx) => (
                    <div key={idx} className="p-3 rounded-md bg-amber-950/20 backdrop-blur-md border border-amber-800/40 shadow-[inset_0_1px_0_0_rgba(245,158,11,0.1)] flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-slate-100">{iss.issue}</div>
                          {iss.detail && <p className="text-slate-400 mt-0.5">{iss.detail}</p>}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-900/40 border border-amber-700/60 text-amber-200 rounded shrink-0 font-semibold">
                        {iss.severity} SEVERITY
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-slate-400">
                Confidence: <strong className="text-slate-300 font-medium">{currentEquipment?.confidence_label || 'AI assessment'}</strong>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('inspection')}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-sky-400 hover:text-white rounded border border-white/10 font-medium flex items-center gap-1.5 text-xs cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  onClick={() => setActiveTab('inspection')}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 text-xs cursor-pointer"
                >
                  <span>Diagnostic Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Knowledge Index & Telemetry Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Document Intelligence & RAG Index Status */}
          <div className="glass-panel rounded-lg p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                  TECHNICAL DOCUMENTATION REPOSITORY
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {documents.length} REPOSITORIES
              </span>
            </div>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="glass-panel-subtle p-3 rounded-md flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <div className="font-semibold text-slate-200 truncate">{doc.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {doc.page_count} Pages · {doc.chunks_count} Vector Chunks
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/80 border border-white/15 text-sky-300 rounded font-semibold shrink-0">
                    INDEXED
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              All PDF manual pages are parsed with strict page numbering preserved. When questions are asked, local vector search extracts only grounded references.
            </p>

            <button
              onClick={() => setActiveTab('documents')}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 font-medium text-xs rounded border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Manage Manuals & Chunks</span>
            </button>
          </div>

          {/* Operational Inspection Records Counter */}
          <div className="glass-panel rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <span className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                CERTIFIED INSPECTION PROTOCOLS
              </span>
              <span className="text-[11px] font-mono text-slate-400">{reports.length} ARCHIVED</span>
            </div>

            {reports.length > 0 ? (
              <div className="glass-panel-subtle p-3 rounded-md space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-sky-400 font-semibold">{reports[0].report_number}</span>
                  <span className="text-slate-400">{new Date(reports[0].created_at).toLocaleDateString()}</span>
                </div>
                <div className="font-semibold text-slate-200 truncate">{reports[0].title}</div>
                <p className="text-[11px] text-slate-400 truncate">{reports[0].equipment_name}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No inspection records generated yet.</p>
            )}

            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 font-medium text-xs rounded border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <span>View Certified Reports & Export</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
