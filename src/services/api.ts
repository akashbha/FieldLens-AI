import { SystemInfo, AIStatus, InspectionResult, DocumentItem, ChatMessage, InspectionReport, AIProvider } from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getSystemInfo(): Promise<SystemInfo> {
    const res = await fetch('/api/system/info');
    if (!res.ok) throw new Error('Failed to fetch system info');
    return res.json();
  },

  async getAIStatus(): Promise<AIStatus> {
    const res = await fetch('/api/ai/status');
    if (!res.ok) throw new Error('Failed to fetch AI status');
    return res.json();
  },

  async analyzeInspection(formData: FormData): Promise<InspectionResult> {
    const res = await fetch('/api/inspection/analyze', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to analyze equipment');
    return res.json();
  },

  async uploadDocument(formData: FormData): Promise<DocumentItem> {
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  async getDocuments(): Promise<DocumentItem[]> {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  async indexDocument(id: string) {
    const res = await fetch(`/api/documents/${id}/index`, {
      method: 'POST',
    });
    return res.json();
  },

  async sendChatMessage(query: string, equipmentContext?: any): Promise<{ answer: string; citations: any[]; model: string; runtime: string }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, equipment_context: equipmentContext }),
    });
    if (!res.ok) throw new Error('Failed to process message');
    return res.json();
  },

  async generateReport(reportData: Partial<InspectionReport>): Promise<InspectionReport> {
    const res = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },

  async getReports(): Promise<InspectionReport[]> {
    const res = await fetch('/api/reports');
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async deleteReport(id: string): Promise<boolean> {
    const res = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  async resetDemoData(): Promise<boolean> {
    const res = await fetch('/api/demo/reset', {
      method: 'POST',
    });
    return res.ok;
  },

  async setAIProvider(provider: AIProvider): Promise<boolean> {
    const res = await fetch('/api/settings/provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
    return res.ok;
  }
};
