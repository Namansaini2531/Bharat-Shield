import re

class ThreatSignalExtractor:
    URGENCY_KEYWORDS = [
        "urgent", "breaking", "immediately", "share", "shutting down", 
        "तुरंत", "बंद", "सावधान", "वायरल", "शटडाउन", "इमरजेंसी"
    ]
    
    CTA_KEYWORDS = [
        "share immediately", "forward to all", "tell everyone", "सबको भेजें", "शेयर करें"
    ]

    @classmethod
    def detect_urgency(cls, text: str) -> float:
        text_lower = text.lower()
        matches = sum(1 for kw in cls.URGENCY_KEYWORDS if kw in text_lower)
        return min(1.0, matches * 0.4)

    @classmethod
    def detect_cta(cls, text: str) -> float:
        text_lower = text.lower()
        matches = sum(1 for kw in cls.CTA_KEYWORDS if kw in text_lower)
        return 1.0 if matches > 0 else 0.0

    @classmethod
    def analyze_posts(cls, posts: list) -> dict:
        total = len(posts)
        if total == 0:
            return {}

        languages = set(p.get("language") for p in posts)
        platforms = set(p.get("platform") for p in posts)
        
        urgency_scores = [cls.detect_urgency(p.get("text", "")) for p in posts]
        avg_urgency = sum(urgency_scores) / total

        # Cross-language signal score
        cross_lang_score = min(1.0, (len(languages) - 1) * 0.5)

        # Cross-platform signal score
        cross_plat_score = min(1.0, (len(platforms) - 1) * 0.5)

        # High similarity / burst approximation
        semantic_similarity_score = 0.85 if total > 1 else 0.4

        return {
            "semantic_similarity": semantic_similarity_score,
            "temporal_burst": 0.80 if total >= 3 else 0.3,
            "cross_platform": cross_plat_score,
            "cross_language": cross_lang_score,
            "template_fingerprint": avg_urgency,
            "narrative_mutation": 0.75 if len(languages) > 1 else 0.2,
            "amplification_signals": avg_urgency,
            "source_anomaly": 0.50
        }
