import numpy as np

try:
    from sentence_transformers import SentenceTransformer
    # Load lightweight high-performance multilingual model (384 dimensions)
    # Supports 50+ languages including English, Hindi, Hinglish, Tamil, etc.
    _model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    _HAS_ST = True
    print("Loaded SentenceTransformer multilingual model.")
except Exception as e:
    _model = None
    _HAS_ST = False
    print(f"Notice: sentence-transformers not installed ({e}). Using deterministic fallback embedding generator.")

class MultilingualEmbedder:
    """
    Generates 384-dimensional embeddings for English, Hindi, and Hinglish text.
    Uses sentence-transformers if available, with a fallback deterministic generator.
    """
    DIMENSION = 384

    @classmethod
    def encode(cls, text: str) -> list[float]:
        if not text:
            return [0.0] * cls.DIMENSION

        if _HAS_ST and _model is not None:
            embedding = _model.encode(text, convert_to_numpy=True)
            return embedding.tolist()
        
        # Fallback pseudo-random deterministic vector for lightweight testing
        rng = np.random.RandomState(hash(text) & 0xffffffff)
        vec = rng.randn(cls.DIMENSION)
        vec = vec / np.linalg.norm(vec)
        return vec.tolist()

    @classmethod
    def cosine_similarity(cls, vec1: list[float], vec2: list[float]) -> float:
        v1 = np.array(vec1)
        v2 = np.array(vec2)
        dot = np.dot(v1, v2)
        norm = np.linalg.norm(v1) * np.linalg.norm(v2)
        if norm == 0:
            return 0.0
        return float(dot / norm)

if __name__ == "__main__":
    # Quick Test: English vs Paraphrase vs Hindi vs Hinglish
    t1 = "Government is going to shut down the internet tomorrow."
    t2 = "Authorities may suspend internet access tomorrow."
    t3 = "सरकार कल इंटरनेट बंद करने वाली है।"
    t4 = "Sarkar kal internet band karne wali hai."
    t5 = "Cricket match ticket booking opening today."

    v1 = MultilingualEmbedder.encode(t1)
    v2 = MultilingualEmbedder.encode(t2)
    v3 = MultilingualEmbedder.encode(t3)
    v4 = MultilingualEmbedder.encode(t4)
    v5 = MultilingualEmbedder.encode(t5)

    print("\n--- Multilingual Embedding Similarity Test ---")
    print(f"Dim size: {len(v1)}")
    print(f"EN -> Paraphrase EN similarity: {MultilingualEmbedder.cosine_similarity(v1, v2):.4f}")
    print(f"EN -> Hindi similarity:         {MultilingualEmbedder.cosine_similarity(v1, v3):.4f}")
    print(f"EN -> Hinglish similarity:      {MultilingualEmbedder.cosine_similarity(v1, v4):.4f}")
    print(f"EN -> Unrelated Cricket similarity: {MultilingualEmbedder.cosine_similarity(v1, v5):.4f}")

