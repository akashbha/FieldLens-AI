import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  BookOpen
} from 'lucide-react';
import { InspectionReport } from '../types';

interface ReportsViewProps {
  reports: InspectionReport[];
  onDeleteReport: (id: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onDeleteReport,
}) => {
  const [selectedReport, setSelectedReport] = useState<InspectionReport | null>(
    reports.length > 0 ? reports[0] : null
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/90 backdrop-blur-md text-sky-400 font-bold rounded border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              ISO 17359 AUDIT TRAIL
            </span>
            <span className="text-xs font-mono text-slate-400">
              EQUIPMENT CONDITION CERTIFICATES & INSPECTION ARCHIVE
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-1">
            Certified Inspection Protocols
          </h1>
        </div>

        {selectedReport && (
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-sky-600/90 hover:bg-sky-500 backdrop-blur-md active:bg-sky-700 text-white font-medium text-xs rounded border border-sky-400/50 shadow transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF Protocol</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reports Archive List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 tracking-wider">
            <span>ARCHIVED PROTOCOLS</span>
            <span>({reports.length} CERTIFICATES)</span>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-3.5 rounded-lg border backdrop-blur-md cursor-pointer transition-all ${
                    selectedReport?.id === rep.id
                      ? 'bg-slate-800/80 border-sky-400/60 shadow-[0_4px_16px_rgba(2,132,199,0.2),inset_0_1px_0_0_rgba(255,255,255,0.15)]'
                      : 'glass-panel-subtle hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-sky-400 font-bold">{rep.report_number}</span>
                    <span className="text-slate-400 text-[11px]">{new Date(rep.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 font-sans mt-1 truncate">
                    {rep.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                    {rep.equipment_name}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      CERTIFIED
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReport(rep.id);
                        if (selectedReport?.id === rep.id) {
                          setSelectedReport(null);
                        }
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                      title="Delete report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 glass-panel rounded-lg text-center space-y-2">
              <FileText className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">No inspection protocols generated yet.</p>
            </div>
          )}
        </div>

        {/* Selected Formal Certificate Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="glass-panel rounded-lg p-6 space-y-6 shadow-md print:border-none print:bg-white print:text-black">
              {/* Certificate Formal Letterhead */}
              <div className="border-b border-white/[0.08] pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-2 py-0.5 bg-slate-800/90 backdrop-blur-md border border-white/10 text-sky-400 text-[10px] font-mono font-bold tracking-wider rounded mb-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                    FIELD INSPECTION CERTIFICATE & PROTOCOL
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
                    {selectedReport.title}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-3">
                    <span>REF: {selectedReport.report_number}</span>
                    <span aria-hidden="true">·</span>
                    <span>TIMESTAMP: {new Date(selectedReport.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-slate-400 space-y-1">
                  <div>INSPECTOR: <span className="text-slate-200 font-semibold">{selectedReport.technician_name}</span></div>
                  <div>STANDARDS: <span className="text-emerald-400">ISO 13374 / 17359</span></div>
                </div>
              </div>

              {/* Machinery Asset Classification Block */}
              <div className="glass-panel-subtle p-3.5 rounded-md space-y-1 text-xs font-mono">
                <span className="text-[10px] text-slate-400 block tracking-wider font-semibold">ASSET PROFILE</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-100 font-sans">{selectedReport.equipment_name}</span>
                  <span className="text-sky-400 font-semibold">{selectedReport.equipment_category}</span>
                </div>
              </div>

              {/* Visual Defect Findings */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                  OPTICAL OBSERVATIONS (ON-DEVICE VISION)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedReport.observations.map((obs, idx) => (
                    <div key={idx} className="glass-panel-subtle p-2.5 rounded-md flex items-start gap-2 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomaly Classifications */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                  IDENTIFIED DEFECTS & CRITICALITY CLASSIFICATION
                </h3>
                <div className="space-y-1.5">
                  {selectedReport.possible_issues.map((iss, idx) => (
                    <div key={idx} className="glass-panel-subtle p-2.5 rounded-md flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-slate-100">{iss.issue}</div>
                          {iss.detail && <p className="text-slate-400 mt-0.5">{iss.detail}</p>}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950/60 border border-amber-800 text-amber-300 rounded font-semibold shrink-0">
                        {iss.severity} SEVERITY
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Protocol Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                  MANDATED ACTION PROTOCOLS
                </h3>
                <ol className="space-y-1.5 text-xs text-slate-300">
                  {selectedReport.recommended_checks.map((chk, idx) => (
                    <li key={idx} className="glass-panel-subtle p-2.5 rounded-md flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded bg-slate-800 border border-white/10 text-slate-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{chk}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Grounded Technical Manual References */}
              {selectedReport.manual_references && selectedReport.manual_references.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>GROUNDED OEM TECHNICAL MANUAL CITATIONS</span>
                  </h3>
                  <div className="space-y-1.5">
                    {selectedReport.manual_references.map((ref, idx) => (
                      <div key={idx} className="glass-panel-subtle p-3 rounded-md text-xs space-y-1 font-mono">
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span>{ref.document_name}</span>
                          <span className="text-sky-400 font-bold">PAGE {ref.page_number}</span>
                        </div>
                        <p className="text-slate-400 font-sans italic text-[11px] leading-relaxed">
                          &quot;{ref.excerpt}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inspector Diagnostic Synthesis */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                  DIAGNOSTIC SYNTHESIS & SIGN-OFF
                </h3>
                <div className="glass-panel-subtle p-3 rounded-md text-xs text-slate-300 font-sans leading-relaxed">
                  {selectedReport.assistant_notes}
                </div>
              </div>

              {/* Footer Audit Seal */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                <span>INFERENCE STACK: {selectedReport.model_info}</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ON-DEVICE AIR-GAPPED VERIFICATION</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-lg p-12 text-center space-y-2">
              <FileText className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Select a protocol certificate from the archive.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
