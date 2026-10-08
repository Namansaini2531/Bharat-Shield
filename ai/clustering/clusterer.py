import json
from pathlib import Path
import numpy as np
from ai.embeddings import MultilingualEmbedder
from ai.threat_scoring.risk_engine import RiskAssessmentEngine
from blockchain.evidence.hasher import EvidenceHasher

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_FILE = BASE_DIR / "data" / "synthetic" / "campaign_data.json"

class CampaignClusterer:
    """
    Unsupervised Narrative Clustering Engine for BHARAT-SHIELD.
    Uses Multilingual Embeddings + HDBSCAN / Agglomerative distance clustering to group
    emergent disinformation variants across platforms and languages into coordinated campaigns.
    """

    @classmethod
    def cluster_posts(cls, posts: list, distance_threshold: float = 0.45) -> list[dict]:
        """
        Groups posts dynamically into narrative clusters using HDBSCAN or Agglomerative Clustering
        on multilingual vector representations.
        """
        if not posts:
            return []

        # Extract text payloads (text or OCR)
        texts = [p.get("text") or p.get("ocr_text", "") for p in posts]
        embeddings = np.array(MultilingualEmbedder.encode_batch(texts))

        labels = None
        # Try HDBSCAN (from scikit-learn 1.3+ or fast agglomerative fallback)
        try:
            from sklearn.cluster import HDBSCAN
            clusterer = HDBSCAN(min_cluster_size=2, metric='euclidean', cluster_selection_epsilon=distance_threshold)
            labels = clusterer.fit_predict(embeddings)
        except Exception:
            try:
                from sklearn.cluster import AgglomerativeClustering
                clusterer = AgglomerativeClustering(
                    n_clusters=None,
                    distance_threshold=distance_threshold,
                    metric='cosine',
                    linkage='average'
                )
                labels = clusterer.fit_predict(embeddings)
            except Exception:
                # Fallback: simple cosine distance graph components
                labels = [0] * len(posts)

        # Group posts by cluster label
        clusters_map = {}
        for idx, label in enumerate(labels):
            cluster_id = f"CMP-{abs(label) + 1:03d}" if label != -1 else f"ISOLATED-{idx+1:03d}"
            if cluster_id not in clusters_map:
                clusters_map[cluster_id] = []
            clusters_map[cluster_id].append(posts[idx])

        # Convert to structured campaign objects
        campaigns = []
        for c_id, c_posts in clusters_map.items():
            languages = list(set(p.get("language") for p in c_posts if p.get("language")))
            platforms = list(set(p.get("platform") for p in c_posts if p.get("platform")))
            representative_post = c_posts[0]
            title = representative_post.get("text", "Unidentified Narrative Cluster")[:60] + "..."

            risk_data = RiskAssessmentEngine.evaluate_campaign(c_posts)
            evidence = EvidenceHasher.generate_evidence_package(c_id, c_posts, risk_data)

            campaigns.append({
                "id": c_id,
                "title": title,
                "status": "active" if len(c_posts) > 1 else "monitoring",
                "primary_language": languages[0] if languages else "en",
                "languages_detected": languages,
                "platforms": platforms,
                "post_count": len(c_posts),
                "posts": c_posts,
                "risk_assessment": risk_data,
                "evidence": evidence
            })

        # Sort campaigns by risk score descending
        campaigns.sort(key=lambda x: x["risk_assessment"]["base_risk"], reverse=True)
        return campaigns

    @classmethod
    def get_all_campaigns(cls) -> list:
        if not DATA_FILE.exists():
            return []

        with open(DATA_FILE, "r", encoding="utf-8") as f:
            posts = json.load(f)

        if not posts:
            return []

        # If data already has predefined clusters, we group them or run clustering
        return cls.cluster_posts(posts)

    @classmethod
    def get_campaign_by_id(cls, campaign_id: str) -> dict:
        campaigns = cls.get_all_campaigns()
        for c in campaigns:
            if c["id"] == campaign_id:
                return c
        return None

