export type ActiveTab = 'dashboard' | 'inspection' | 'documents' | 'assistant' | 'reports' | 'settings';

export type AIProvider = 'development' | 'local' | 'qualcomm';

export interface SystemInfo {
  platform: string;
  processor: string;
  architecture: string;
  npu_available: boolean;
  gpu_available: boolean;
  runtime: string;
  total_memory_gb: number;
  free_memory_gb: number;
  os_release: string;
  hostname: string;
  is_snapdragon_detected: boolean;
  snapdragon_details?: {
    family: string;
    npu_cores?: string;
    tops_rating?: string;
    oem_partner?: string;
  };
  supported_models: string[];
}

export interface AIStatus {
  engine_ready: boolean;
  active_provider: AIProvider;
  offline_ready: boolean;
  vision_model: {
    name: string;
    status: 'Ready' | 'Initializing' | 'Unavailable';
    device: string;
    runtime: string;
  };
  language_model: {
    name: string;
    status: 'Ready' | 'Initializing' | 'Unavailable';
    device: string;
    runtime: string;
  };
  speech_model: {
    name: string;
    status: 'Ready' | 'Initializing' | 'Unavailable';
    device: string;
    runtime: string;
  };
  vector_search: {
    name: string;
    status: 'Ready' | 'Initializing' | 'Unavailable';
    indexed_chunks: number;
  };
}

export interface PotentialIssue {
  issue: string;
  severity: 'Low' | 'Medium' | 'High';
  detail?: string;
}

export interface InspectionResult {
  id: string;
  equipment_name: string;
  category: string;
  description: string;
  observations: string[];
  possible_issues: PotentialIssue[];
  recommended_checks: string[];
  confidence_label: string; // "AI assessment" as required
  model: string;
  runtime: string;
  timestamp: string;
  image_url?: string;
  image_name?: string;
  is_demo?: boolean;
}

export interface DocumentChunk {
  chunk_id: string;
  document_id: string;
  document_name: string;
  page_number: number;
  text: string;
  token_count?: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size_bytes: number;
  page_count: number;
  extracted_text_size_chars: number;
  status: 'indexed' | 'processing' | 'uploaded' | 'error';
  indexed_date: string;
  is_demo?: boolean;
  chunks_count: number;
}

export interface Citation {
  document_id: string;
  document_name: string;
  page_number: number;
  excerpt: string;
  similarity_score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  model?: string;
  runtime?: string;
  audio_url?: string;
  is_transcribed?: boolean;
}

export interface InspectionReport {
  id: string;
  report_number: string;
  title: string;
  created_at: string;
  equipment_name: string;
  equipment_category: string;
  image_url?: string;
  observations: string[];
  possible_issues: PotentialIssue[];
  recommended_checks: string[];
  manual_references: Citation[];
  assistant_notes: string;
  model_info: string;
  runtime_info: string;
  privacy_status: string;
  technician_name?: string;
  is_demo?: boolean;
}
