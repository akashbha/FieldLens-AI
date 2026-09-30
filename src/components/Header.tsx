import React, { useState, useEffect } from 'react';
import { ActiveTab, AIStatus } from '../types';
import { RefreshCw, WifiOff, Upload } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  aiStatus: AIStatus | null;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  aiStatus,
  onResetDemo,
  isResetting,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') + Math.abs(Math.floor(now.getTimezoneOffset() / 60)));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumb = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'STATION OVERVIEW / TELEMETRY';
      case 'inspection': return 'OPTICAL INSPECTION & DEFECT DETECTION';
      case 'documents': return 'LOCAL TECHNICAL MANUAL REPOSITORY (RAG)';
      case 'assistant': return 'GROUNDED FIELD ENGINEERING ASSISTANT';
      case 'reports': return 'CERTIFIED INSPECTION PROTOCOLS & EXPORT';
      case 'settings': return 'QUALCOMM NPU ACCELERATION & MODEL REGISTRY';
      default: return 'FIELDLENS INDUSTRIAL';
    }
  };

  return (
    <header className="h-14 px-6 glass-header flex items-center justify-between sticky top-0 z-10 select-none">
      {/* Station Path & Navigation Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-medium">
          <span className="text-slate-400">FIELDLENS</span>
          <span className="text-slate-600">::</span>
          <span className="text-slate-200 tracking-wider font-semibold">{getBreadcrumb(activeTab)}</span>
        </div>
      </div>

      {/* Hardware Telemetry & System Action */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Real-time Engineering Clock */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{timeStr || 'SYSTEM SYNCHRONIZED'}</span>
        </div>

        {/* Operating Environment Invariant */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded text-slate-300">
          <WifiOff className="w-3.5 h-3.5 text-slate-400" />
          <span>OFFLINE READY</span>
        </div>

        {/* Quick Action: Upload Image */}
        <button
          onClick={() => setActiveTab('inspection')}
          className="flex items-center gap-1.5 px-3 py-1 bg-sky-600/90 hover:bg-sky-500 active:bg-sky-700 backdrop-blur-md text-white border border-sky-400/40 shadow-[0_2px_8px_rgba(2,132,199,0.3)] rounded transition-all text-xs font-semibold cursor-pointer"
          title="Go to Inspection workspace to upload or capture equipment photos"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image</span>
        </button>

        {/* Demo Dataset Reset Button */}
        <button
          onClick={onResetDemo}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-900/90 backdrop-blur-md text-slate-200 hover:text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] rounded transition-all text-xs font-medium cursor-pointer"
          title="Reload baseline hydraulic pump inspection & manual data"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reload Sample Data</span>
        </button>
      </div>
    </header>
  );
};
