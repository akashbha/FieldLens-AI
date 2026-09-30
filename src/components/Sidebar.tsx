import React from 'react';
import { 
  LayoutDashboard, 
  ScanSearch, 
  FileText, 
  BotMessageSquare, 
  ClipboardCheck, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Activity
} from 'lucide-react';
import { ActiveTab, AIStatus, SystemInfo } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  aiStatus: AIStatus | null;
  systemInfo: SystemInfo | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  aiStatus,
  systemInfo,
}) => {
  const navSections = [
    {
      group: 'OPERATIONS',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Command Overview', icon: LayoutDashboard, tag: 'LIVE' },
        { id: 'inspection' as ActiveTab, label: 'Equipment Inspection (Upload)', icon: ScanSearch, tag: 'VISION' },
        { id: 'documents' as ActiveTab, label: 'Technical Manuals', icon: FileText, tag: 'RAG' },
      ],
    },
    {
      group: 'ENGINEERING',
      items: [
        { id: 'assistant' as ActiveTab, label: 'Field Assistant', icon: BotMessageSquare, tag: 'QWEN' },
        { id: 'reports' as ActiveTab, label: 'Inspection Records', icon: ClipboardCheck, tag: 'ISO' },
        { id: 'settings' as ActiveTab, label: 'Hardware & Models', icon: Sliders, tag: 'NPU' },
      ],
    },
  ];

  const isSnapdragon = systemInfo?.is_snapdragon_detected;

  return (
    <aside className="w-64 glass-sidebar flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      <div className="flex flex-col">
        {/* Brand & Machine Station Header */}
        <div className="h-16 px-5 border-b border-white/[0.08] flex items-center justify-between bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-800/80 border border-white/15 flex items-center justify-center text-slate-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold tracking-wider text-slate-100 text-sm">FIELDLENS</span>
                <span className="text-[10px] font-mono text-slate-400 font-medium">v1.4</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">
                ON-DEVICE INDUSTRIAL AI
              </p>
            </div>
          </div>
        </div>

        {/* Machine Profile Bar */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-white/[0.06] backdrop-blur-sm flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>PLATFORM</span>
          </span>
          <span className="text-slate-200 font-semibold truncate max-w-[120px]" title={systemInfo?.processor}>
            {isSnapdragon ? 'Snapdragon X Elite' : (systemInfo?.architecture?.toUpperCase() || 'HOST ARM64')}
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider font-semibold text-slate-400">
                {sec.group}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800/80 backdrop-blur-md text-slate-100 font-semibold border-l-2 border-sky-400 border-y border-r border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      isActive
                        ? 'bg-slate-900/80 border-white/15 text-sky-300'
                        : 'bg-transparent border-white/[0.06] text-slate-400'
                    }`}>
                      {item.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Diagnostics Telemetry Strip (Bottom) */}
      <div className="border-t border-white/[0.08] bg-black/20 backdrop-blur-md p-3.5 space-y-2.5 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            LOCAL RUNTIME
          </span>
          <span className="text-slate-300 font-semibold">
            {aiStatus?.active_provider === 'qualcomm' ? 'QNN / NPU' : 'DIRECT HOST'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">ACCELERATOR</span>
          <span className="text-sky-400 font-medium">
            {isSnapdragon ? 'HEXAGON NPU' : 'DIRECTML / CPU'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06] text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AIR-GAPPED
          </span>
          <span className="text-[10px] text-emerald-400">0 KB CLOUD</span>
        </div>
      </div>
    </aside>
  );
};
