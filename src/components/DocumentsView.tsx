import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle, 
  Database,
  FileCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import { DocumentItem } from '../types';
import { api } from '../services/api';

interface DocumentsViewProps {
  documents: DocumentItem[];
  onDocumentUploaded: (doc: DocumentItem) => void;
  onDocumentDeleted: (id: string) => void;
  onDocumentIndexed: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onDocumentUploaded,
  onDocumentDeleted,
  onDocumentIndexed,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [indexingId, setIndexingId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const newDoc = await api.uploadDocument(formData);
      onDocumentUploaded(newDoc);
    } catch (err) {
      console.error('Document upload error:', err);
      alert('Unable to process document. Ensure it is a valid PDF, DOCX, or TXT file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReindex = async (id: string) => {
    setIndexingId(id);
    try {
      await api.indexDocument(id);
      onDocumentIndexed(id);
    } catch (err) {
      console.error(err);
    } finally {
      setIndexingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/90 backdrop-blur-md text-sky-400 font-bold rounded border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              LOCAL RAG ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              TECHNICAL DOCUMENTATION REPOSITORY & VECTOR STORE
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-1">
            Maintenance Manuals & Schematics
          </h1>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3.5 py-2 bg-sky-600/90 hover:bg-sky-500 backdrop-blur-md active:bg-sky-700 text-white font-medium text-xs rounded border border-sky-400/50 shadow transition-all flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Technical Document</span>
        </button>
      </div>

      {/* Upload Zone with Glassmorphism */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          dragActive
            ? 'border-sky-400 bg-sky-950/30'
            : 'border-white/10 hover:border-white/20 glass-panel'
        }`}
      >
        <div className="w-9 h-9 rounded bg-slate-800/80 border border-white/15 flex items-center justify-center text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <FileText className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200">
            Ingest Maintenance Manuals, OEM Schematics, or Operating Protocols
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Supported formats: PDF, DOCX, TXT. Ingestion chunks text with exact page numbers preserved.
          </p>
        </div>

        {isUploading && (
          <div className="flex items-center gap-2 text-xs text-sky-400 pt-2 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Parsing PDF pages and generating local vector embeddings...</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,text/plain"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Document Registry Table with Glassmorphism */}
      <div className="glass-panel rounded-lg overflow-hidden">
        {/* Table Filter / Controls */}
        <div className="p-3.5 border-b border-white/[0.08] bg-black/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-200 tracking-wider">
              LOCAL DOCUMENT INDEX
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ({documents.length} REPOSITORIES)
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter manuals..."
              className="pl-8 pr-3 py-1 bg-slate-900/80 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Table Content */}
        {filteredDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/30 text-slate-400 border-b border-white/[0.08] text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">DOCUMENT TITLE</th>
                  <th className="py-2.5 px-4 font-semibold">PAGES</th>
                  <th className="py-2.5 px-4 font-semibold">CHUNKS</th>
                  <th className="py-2.5 px-4 font-semibold">SIZE</th>
                  <th className="py-2.5 px-4 font-semibold">STATUS</th>
                  <th className="py-2.5 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-100 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate max-w-xs sm:max-w-md">{doc.name}</span>
                      {doc.is_demo && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-semibold backdrop-blur-sm">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{doc.page_count}</td>
                    <td className="py-3 px-4 text-slate-300">{doc.chunks_count || 0}</td>
                    <td className="py-3 px-4 text-slate-400">{formatFileSize(doc.size_bytes)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        INDEXED
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReindex(doc.id)}
                          disabled={indexingId === doc.id}
                          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-300 text-[11px] rounded border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all cursor-pointer"
                        >
                          {indexingId === doc.id ? 'Reindexing...' : 'Re-index'}
                        </button>
                        <button
                          onClick={() => onDocumentDeleted(doc.id)}
                          className="p-1 hover:bg-red-950/60 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <p className="text-xs text-slate-400 font-mono">No matching documents found in repository.</p>
          </div>
        )}
      </div>

      {/* Technical RAG Architecture Notice with Glassmorphism */}
      <div className="glass-panel rounded-lg p-4 text-xs font-mono text-slate-400 flex items-start gap-3">
        <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>GROUNDING GUARANTEE:</strong> Every extracted chunk preserves strict document ID, filename, and original page number. Answers generated in the Field Assistant workspace must cite these specific page locations. If no relevant chunk matches a technician&apos;s question, the model is architected to state that no supporting manual information exists rather than fabricating guidance.
        </p>
      </div>
    </div>
  );
};
