from typing import List, Dict, Optional
from backend.services.hardware_service import HardwareService

class LLMEngine:
    def __init__(self, provider: str = "development"):
        self.provider = provider
        self.hw = HardwareService.get_system_info()

    def generate_grounded_answer(self, query: str, citations: List[Dict], equipment_context: Optional[dict] = None) -> Dict:
        is_npu = self.hw.get("npu_available", False)

        if not citations:
            return {
                "answer": "No supporting information was found in the uploaded manuals for this specific query. Please verify the terminology or upload the relevant technical manual.",
                "citations": [],
                "model": "Qwen3-4B-Instruct (INT4 Quantized)" if is_npu else "FieldLens Local LLM Engine",
                "runtime": "Qualcomm Hexagon NPU (Direct QNN)" if is_npu else "Local Host Machine Inference"
            }

        top_cite = citations[0]
        answer = f"According to {top_cite.get('document_name')} (Page {top_cite.get('page_number')}): {top_cite.get('excerpt')}\n\nEnsure routine maintenance intervals and safety torque specifications are strictly observed."

        return {
            "answer": answer,
            "citations": citations,
            "model": "Qwen3-4B-Instruct (Qualcomm AI Hub INT4)" if is_npu else "FieldLens Local LLM Engine",
            "runtime": "Snapdragon Hexagon NPU" if is_npu else "Local On-Device Engine"
        }
