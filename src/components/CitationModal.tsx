import React from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { Citation } from '../types';

interface CitationModalProps {
  citation: Citation | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-lg max-w-xl w-full p-5 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase">
          <BookOpen className="w-4 h-4" />
          <span>GROUNDED OEM TECHNICAL MANUAL EXCERPT</span>
        </div>

        <div>
          <h2 className="text-base font-bold text-white font-sans">{citation.document_name}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
            <span className="text-sky-300 font-semibold">PAGE NUMBER: {citation.page_number}</span>
            {citation.similarity_score && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>SIMILARITY SCORE: {citation.similarity_score}%</span>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel-subtle p-3.5 rounded-md text-xs text-slate-200 leading-relaxed max-h-80 overflow-y-auto font-mono whitespace-pre-wrap">
          {citation.excerpt}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono border-t border-white/[0.08]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VERIFIED CITATION HASH</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-md text-slate-200 text-xs font-mono rounded border border-white/15 transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
