from typing import List, Dict

class RetrievalService:
    def __init__(self):
        self.chunks: List[Dict] = []

    def add_chunks(self, new_chunks: List[Dict]):
        self.chunks.extend(new_chunks)

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        if not self.chunks:
            return []

        tokens = [t.lower() for t in query.split() if len(t) > 2]
        scored = []

        for chunk in self.chunks:
            text_lower = chunk.get("text", "").lower()
            score = 0
            for token in tokens:
                if token in text_lower:
                    score += 2
            if score > 0:
                scored.append({"chunk": chunk, "score": score})

        scored.sort(key=lambda x: x["score"], reverse=True)
        return [item["chunk"] for item in scored[:top_k]]

retrieval_engine = RetrievalService()
