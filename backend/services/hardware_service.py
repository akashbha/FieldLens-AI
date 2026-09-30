import platform
import os

class HardwareService:
    @staticmethod
    def get_system_info():
        plat = platform.system()
        proc = platform.processor() or "Unknown Processor"
        arch = platform.machine()

        # Check real Snapdragon / ARM64 Windows indicators
        is_arm64 = "arm" in arch.lower() or "aarch64" in arch.lower()
        is_windows = plat == "Windows"
        has_snapdragon = "snapdragon" in proc.lower() or "qualcomm" in proc.lower()

        npu_detected = (is_arm64 and is_windows) or has_snapdragon

        return {
            "platform": plat,
            "processor": proc,
            "architecture": arch,
            "npu_available": npu_detected,
            "gpu_available": True,
            "runtime": "Qualcomm AI Runtime (Hexagon Direct NPU)" if npu_detected else "DirectML / CPU Local Execution",
            "supported_models": [
                "YOLOv8x-cls (Qualcomm AI Hub INT8)",
                "Qwen3-4B-Instruct (GenieX / QNN EP INT4)",
                "Distil-Whisper-Small (SNPE / QNN INT8)",
                "BGE-Small-EN-v1.5 (DirectML / QNN)"
            ]
        }
