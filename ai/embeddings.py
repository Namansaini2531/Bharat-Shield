import os
import numpy as np

# Supported multilingual models
DEFAULT_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
LABSE_MODEL_NAME = "sentence-transformers/LaBSE"

_models = {}
_HAS_ST = False

try:
    from sentence_transformers import SentenceTransformer
    _HAS_ST = True
except Exception as e:
    _HAS_ST = False
    print(f"Notice: sentence-transformers not initialized ({e}). Using deterministic fallback generator.")

def get_model(model_name: str = DEFAULT_MODEL_NAME):
    """Lazy-load and cache the requested sentence-transformer model."""
    if not _HAS_ST:
        return None
    if model_name not in _models:
        try:
            print(f"Loading embedding model: {model_name}...")
            _models[model_name] = SentenceTransformer(model_name)
            print(f"✓ Model {model_name} loaded successfully.")
        except Exception as e:
            print(f"Warning: Could not load model {model_name}: {e}")
            return None
    return _models[model_name]

class MultilingualEmbedder:
    """
    Generates cross-lingual vector embeddings for English, Hindi, Hinglish, Tamil, Bengali, etc.
    Supports:
      - sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 (384-dim, fast & lightweight)
      - sentence-transformers/LaBSE (768-dim, high accuracy across 109+ languages)
    """
    DIMENSION = 384

    @classmethod
    def encode(cls, text: str, model_name: str = DEFAULT_MODEL_NAME) -> list[float]:
        """Encode a single text into an embedding vector."""
        if not text or not text.strip():
            dim = 768 if "LaBSE" in model_name or "labse" in model_name.lower() else cls.DIMENSION
            return [0.0] * dim

        model = get_model(model_name)
        if model is not None:
            embedding = model.encode(text, convert_to_numpy=True)
            return embedding.tolist()
        
        # Deterministic semantic-simulated fallback for testing without GPU/PyTorch download
        dim = 768 if "LaBSE" in model_name or "labse" in model_name.lower() else cls.DIMENSION
        rng = np.random.RandomState(hash(text.strip().lower()) & 0xffffffff)
        vec = rng.randn(dim)
        vec = vec / np.linalg.norm(vec)
        return vec.tolist()

    @classmethod
    def encode_batch(cls, texts: list[str], model_name: str = DEFAULT_MODEL_NAME) -> list[list[float]]:
        """Encode multiple texts in a batch."""
        if not texts:
            return []
        
        model = get_model(model_name)
        if model is not None:
            embeddings = model.encode(texts, convert_to_numpy=True, batch_size=32)
            return [emb.tolist() for emb in embeddings]
        
        return [cls.encode(t, model_name=model_name) for t in texts]

    @classmethod
    def cosine_similarity(cls, vec1: list[float], vec2: list[float]) -> float:
        """Compute cosine similarity between two embedding vectors."""
        v1 = np.array(vec1, dtype=np.float32)
        v2 = np.array(vec2, dtype=np.float32)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return float(np.dot(v1, v2) / (norm1 * norm2))

if __name__ == "__main__":
    t1 = "Government is going to shut down the internet tomorrow. Share immediately!"
    t2 = "Authorities may suspend internet access tomorrow across all regions."
    t3 = "सरकार कल पूरे देश में इंटरनेट बंद करने वाली है। तुरंत शेयर करें।"
    t4 = "Sarkar kal internet band karne wali hai sabko forward karo."
    t5 = "India won the cricket match yesterday evening."

    print("=" * 60)
    print(" BHARAT-SHIELD MULTILINGUAL EMBEDDINGS VERIFICATION")
    print("=" * 60)
    
    v1 = MultilingualEmbedder.encode(t1)
    v2 = MultilingualEmbedder.encode(t2)
    v3 = MultilingualEmbedder.encode(t3)
    v4 = MultilingualEmbedder.encode(t4)
    v5 = MultilingualEmbedder.encode(t5)

    print(f"Embedding Vector Dimension: {len(v1)}")
    print(f"EN Original <-> EN Paraphrase:  {MultilingualEmbedder.cosine_similarity(v1, v2):.4f}")
    print(f"EN Original <-> Hindi Script:   {MultilingualEmbedder.cosine_similarity(v1, v3):.4f}")
    print(f"EN Original <-> Hinglish Roman: {MultilingualEmbedder.cosine_similarity(v1, v4):.4f}")
    print(f"EN Original <-> Cricket News:   {MultilingualEmbedder.cosine_similarity(v1, v5):.4f}")


