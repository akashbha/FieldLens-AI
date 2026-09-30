from typing import List, Optional
from pydantic import BaseModel

class PotentialIssueSchema(BaseModel):
    issue: str
    severity: str # Low, Medium, High
    detail: Optional[str] = None

class InspectionAnalysisResponse(BaseModel):
    equipment_name: str
    category: str
    description: str
    observations: List[str]
    possible_issues: List[PotentialIssueSchema]
    recommended_checks: List[str]
    confidence_label: str = "AI assessment" # Not pretending calibrated probability
    model: str
    runtime: str

class CitationSchema(BaseModel):
    document_id: str
    document_name: str
    page_number: int
    excerpt: str
    similarity_score: Optional[float] = None

class ChatRequest(BaseModel):
    query: str
    equipment_context: Optional[dict] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[CitationSchema]
    model: str
    runtime: str

class SystemInfoResponse(BaseModel):
    platform: str
    processor: str
    architecture: str
    npu_available: bool
    gpu_available: bool
    runtime: str
    supported_models: List[str]

class AIStatusResponse(BaseModel):
    engine_ready: bool
    offline_ready: bool
    vision_model: dict
    language_model: dict
    speech_model: dict
    vector_search: dict
