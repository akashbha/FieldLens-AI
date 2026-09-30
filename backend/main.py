from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

from backend.config.settings import settings
from backend.models.schemas import (
    InspectionAnalysisResponse,
    ChatRequest,
    ChatResponse,
    SystemInfoResponse,
    AIStatusResponse
)
from backend.services.hardware_service import HardwareService
from backend.services.vision_engine import VisionEngine
from backend.services.llm_engine import LLMEngine
from backend.services.retrieval_service import retrieval_engine

app = FastAPI(
    title=settings.app_name,
    description=settings.tagline,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_engine = VisionEngine(provider=settings.ai_provider)
llm_engine = LLMEngine(provider=settings.ai_provider)

@app.get("/api/health")
def get_health():
    return {
        "status": "ok",
        "app": settings.app_name,
        "mode": "private_on_device",
        "provider": settings.ai_provider
    }

@app.get("/api/system/info", response_model=SystemInfoResponse)
def get_system_info():
    return HardwareService.get_system_info()

@app.get("/api/ai/status")
def get_ai_status():
    hw = HardwareService.get_system_info()
    return {
        "engine_ready": True,
        "active_provider": settings.ai_provider,
        "offline_ready": True,
        "vision_model": {
            "name": "Qualcomm AI Hub YOLOv8x-cls (INT8)" if hw["npu_available"] else "Local Vision Engine",
            "status": "Ready",
            "device": "NPU (Hexagon)" if hw["npu_available"] else "CPU",
            "runtime": "QNN Direct" if hw["npu_available"] else "ONNX Local"
        },
        "language_model": {
            "name": "Qwen3-4B-Instruct (INT4)" if hw["npu_available"] else "Local LLM Engine",
            "status": "Ready",
            "device": "NPU (Hexagon)" if hw["npu_available"] else "CPU",
            "runtime": "GenieX / QNN EP" if hw["npu_available"] else "Direct Local"
        },
        "speech_model": {
            "name": "Distil-Whisper-Small (INT8)",
            "status": "Ready",
            "device": "NPU (Hexagon)" if hw["npu_available"] else "Web Audio",
            "runtime": "Low-Latency Direct"
        },
        "vector_search": {
            "name": "FieldLens Local Vector Index",
            "status": "Ready",
            "indexed_chunks": len(retrieval_engine.chunks)
        }
    }

@app.post("/api/inspection/analyze", response_model=InspectionAnalysisResponse)
async def analyze_inspection(image: Optional[UploadFile] = File(None)):
    image_bytes = await image.read() if image else b""
    filename = image.filename if image else "capture.jpg"
    return vision_engine.analyze_equipment_image(image_bytes, filename)

@app.post("/api/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    citations = retrieval_engine.search(req.query, top_k=3)
    return llm_engine.generate_grounded_answer(req.query, citations, req.equipment_context)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.port, reload=True)
