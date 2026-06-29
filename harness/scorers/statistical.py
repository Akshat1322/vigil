from sentence_transformers import SentenceTransformer
import numpy as np

# Load once at module level — don't reload on every prompt
_model = None

def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def cosine_similarity(text_a: str, text_b: str) -> float:
    """
    Compute cosine similarity between two texts.
    Returns float between 0.0 and 1.0.
    1.0 = identical meaning, 0.0 = completely different.
    """
    model = get_embedding_model()
    embeddings = model.encode([text_a, text_b])
    
    vec_a = embeddings[0]
    vec_b = embeddings[1]
    
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
    
    similarity = dot_product / (norm_a * norm_b)
    return float(np.clip(similarity, 0.0, 1.0))
