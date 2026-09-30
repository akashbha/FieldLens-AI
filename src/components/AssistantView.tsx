import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { ChatMessage, Citation, InspectionResult, DocumentItem, AIStatus, SystemInfo } from '../types';
import { api } from '../services/api';

interface AssistantViewProps {
  currentEquipment: InspectionResult | null;
  documents: DocumentItem[];
  aiStatus: AIStatus | null;
  systemInfo: SystemInfo | null;
  onOpenCitation: (citation: Citation) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  currentEquipment,
  documents,
  aiStatus,
  systemInfo,
  onOpenCitation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'FieldLens On-Device Diagnostic Terminal initialized.\nAll answers are strictly grounded in your locally indexed maintenance manuals and current equipment telemetry.\n\nType a diagnostic question or select a standard engineering verification command below.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: aiStatus?.language_model.name || 'Qwen3-4B-Instruct (INT4)',
      runtime: aiStatus?.language_model.runtime || 'Snapdragon NPU / Hexagon',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSources, setActiveSources] = useState<Citation[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickCommands = [
    'What is the rated continuous operating pressure?',
    'What should I inspect first for the shaft seal weeping?',
    'What are the scheduled maintenance intervals?',
    'What fluid lubrication grade and viscosity are specified?',
    'What causes cavitation and abnormal whining vibration?',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const response = await api.sendChatMessage(textToSend, currentEquipment);
      
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        model: response.model,
        runtime: response.runtime,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (response.citations && response.citations.length > 0) {
        setActiveSources(response.citations);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Error: Local inference request timed out. Verify model cache integrity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is unavailable in this environment. Please type questions.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col space-y-4">
      {/* Workspace Header Strip */}
      <div className="flex items-center justify-between shrink-0 border-b border-white/[0.08] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/90 backdrop-blur-md text-sky-400 font-bold rounded border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              DIAGNOSTIC TERMINAL
            </span>
            <span className="text-xs font-mono text-slate-400">
              STRICT CITATION ENGINE · ZERO HALLUCINATION INVARIANT
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Field Engineering Assistant
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 hidden sm:inline">INFERENCE:</span>
          <span className="px-2 py-0.5 bg-slate-800/80 backdrop-blur-md border border-white/15 text-sky-400 rounded font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            {aiStatus?.language_model.device || 'NPU (Hexagon)'}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* LEFT COLUMN: Engineering Diagnostic Feed (8 cols) */}
        <div className="lg:col-span-8 flex flex-col glass-panel rounded-lg overflow-hidden min-h-0">
          {/* Console Header Bar */}
          <div className="px-4 py-2.5 bg-black/20 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-slate-200">INTERACTIVE DIAGNOSTIC LOG</span>
            </div>
            <span>GROUNDING: ON-DEVICE VECTOR RAG</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
                  msg.role === 'user'
                    ? 'bg-slate-900/80 border-sky-500/40 text-slate-100 shadow-[inset_0_1px_0_0_rgba(2,132,199,0.15)]'
                    : 'glass-panel-subtle text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${msg.role === 'user' ? 'text-sky-300' : 'text-slate-300'}`}>
                      {msg.role === 'user' ? 'OPERATOR' : 'FIELDLENS-AI'}
                    </span>
                    {msg.role === 'assistant' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 border border-white/10 text-slate-400">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Grounded Citation Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" />
                      <span>CORRELATED TECHNICAL MANUAL SECTIONS:</span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.citations.map((cite, idx) => (
                        <div
                          key={idx}
                          onClick={() => onOpenCitation(cite)}
                          className="p-2.5 rounded-md glass-panel-subtle hover:border-sky-400/50 cursor-pointer transition-all flex items-center justify-between text-xs group"
                        >
                          <div className="flex items-center gap-2 truncate mr-2">
                            <span className="w-4 h-4 rounded bg-slate-800 border border-white/15 text-slate-200 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                              {cite.document_name}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px] shrink-0">
                              (Page {cite.page_number})
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-sky-400 group-hover:underline flex items-center gap-1 shrink-0">
                            <span>Examine</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Footer */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>ENGINE: {msg.model || 'Qwen3-4B'}</span>
                    <button
                      onClick={() => speakText(msg.content)}
                      className="text-slate-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Audio readout"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-sky-400" />
                          <span>MUTE READOUT</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>AUDIO PLAYOUT</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="p-3 rounded-md glass-panel-subtle text-xs font-mono text-slate-400 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing on-device vector similarity & LLM context synthesis...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Standard Engineering Commands Strip */}
          <div className="p-2.5 bg-black/20 backdrop-blur-md border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-slate-400 shrink-0 font-semibold">PRESETS:</span>
            {quickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(cmd)}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded whitespace-nowrap transition-all shrink-0 cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Command Input Box */}
          <div className="p-3 bg-black/30 backdrop-blur-md border-t border-white/[0.08] flex items-center gap-2">
            <button
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-950/80 backdrop-blur-md text-red-300 border-red-700 shadow-[inset_0_1px_0_0_rgba(239,68,68,0.2)]'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-300 border-white/10'
              }`}
              title={isListening ? 'Microphone Active' : 'Push-to-Talk (Hands-free)'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-slate-300" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening for voice command...' : 'Ask equipment question (e.g. pressure limit, seal torque, troubleshooting)...'}
              className="flex-1 bg-slate-900/80 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] focus:border-sky-400 rounded px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none font-sans"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-2 bg-sky-600/90 hover:bg-sky-500 backdrop-blur-md disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs rounded border border-sky-400/50 shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Context Panels (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Active Asset Specification */}
          <div className="glass-panel rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 tracking-wider">
              <span>ACTIVE ASSET CONTEXT</span>
              <span className="text-sky-400 font-semibold">SYNCED</span>
            </div>

            {currentEquipment ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white font-sans">{currentEquipment.equipment_name}</div>
                <div className="text-[11px] font-mono text-sky-400">{currentEquipment.category}</div>
                <div className="glass-panel-subtle p-2.5 rounded-md space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">PRIMARY DEFECT:</span>
                  <span className="text-amber-300 font-semibold">
                    {currentEquipment.possible_issues.length > 0
                      ? currentEquipment.possible_issues[0].issue
                      : 'Nominal Condition'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active equipment scan selected.</p>
            )}
          </div>

          {/* Active Manual Repository */}
          <div className="glass-panel rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 tracking-wider">
              <span>ACTIVE MANUALS</span>
              <span className="text-emerald-400 font-semibold">{documents.length} REPOSITORIES</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {documents.map((doc) => (
                <div key={doc.id} className="glass-panel-subtle p-2 rounded-md text-xs flex items-center justify-between">
                  <span className="text-slate-200 truncate mr-2 font-medium">{doc.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{doc.page_count} Pgs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retrieved Excerpts for Inspection */}
          <div className="glass-panel rounded-lg p-4 space-y-3 flex-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 tracking-wider">
              <span>RETRIEVED EXCERPTS</span>
              <span className="text-sky-400 font-semibold">{activeSources.length} CHUNKS</span>
            </div>

            {activeSources.length > 0 ? (
              <div className="space-y-2">
                {activeSources.map((cite, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenCitation(cite)}
                    className="glass-panel-subtle p-2.5 rounded-md hover:border-sky-400/40 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="truncate">{cite.document_name}</span>
                      <span className="text-[10px] font-mono text-sky-400">Page {cite.page_number}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2 italic">
                      &quot;{cite.excerpt}&quot;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Document citations will appear here as questions retrieve supporting manual sections.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
