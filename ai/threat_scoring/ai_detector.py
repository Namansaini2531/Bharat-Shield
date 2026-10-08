import re
from typing import List, Dict, Any

class AIAssistanceDetector:
    """
    Evaluates probabilistic AI-Assistance and LLM generation indicators.
    Observes structural uniformity, unnatural paraphrase diversity, template consistency,
    and prompt-style markers across coordinated post clusters.
    
    IMPORTANT: As per BHARAT-SHIELD Responsible AI guidelines, results are framed
    probabilistically ('AI-Assistance Indicators Elevated') and never as definitive proof.
    """

    LLM_STYLE_MARKERS = [
        "in conclusion", "furthermore", "it is important to note", "official directive states",
        "citizens are advised to", "as per recent notifications", "key takeaways",
        "निर्णय के अनुसार", "महत्वपूर्ण सूचना"
    ]

    @classmethod
    def evaluate_text(cls, text: str) -> Dict[str, Any]:
        """Evaluates single text for synthetic style indicators."""
        if not text:
            return {"ai_probability": 0, "status": "INSUFFICIENT_DATA", "indicators": []}

        indicators = []
        text_lower = text.lower()

        # Marker 1: Formulaic prompt output structure
        matched_markers = [m for m in cls.LLM_STYLE_MARKERS if m in text_lower]
        if matched_markers:
            indicators.append(f"Formulaic synthetic phrasing detected ({', '.join(matched_markers)})")

        # Marker 2: Numbered lists / bullet-point structure inside short forwards
        if re.search(r'(^|\n)\s*(\d+\.|\*|-)\s+', text):
            indicators.append("Structured list formatting typical of LLM summary outputs")

        # Marker 3: High syntactic uniformity / complex subordinate clauses
        sentences = [s for s in re.split(r'[.!?।]', text) if len(s.strip()) > 5]
        if len(sentences) >= 3:
            avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
            if 14 <= avg_len <= 22:
                indicators.append("Uniform sentence length distribution characteristic of LLM generation")

        score = min(92, len(indicators) * 28 + (15 if matched_markers else 5))
        
        status = "AI-Assistance Indicators Elevated" if score >= 50 else "Organic / Low Synthetic Signals"

        return {
            "ai_probability": score,
            "status": status,
            "indicators": indicators,
            "is_elevated": score >= 50
        }

    @classmethod
    def evaluate_cluster(cls, cluster_posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates a cluster of posts for AI-generated campaign traits
        (e.g., rapid multilingual template paraphrasing).
        """
        if not cluster_posts:
            return {"cluster_ai_probability": 0, "summary": "Empty cluster"}

        total = len(cluster_posts)
        languages = set(p.get("language") for p in cluster_posts if p.get("language"))
        
        individual_scores = [cls.evaluate_text(p.get("text", "")).get("ai_probability", 0) for p in cluster_posts]
        avg_score = sum(individual_scores) / total

        # Paraphrase diversity boost: if multiple languages convey identical semantic payload
        multilingual_boost = 15 if len(languages) >= 3 else (8 if len(languages) == 2 else 0)
        
        final_cluster_score = min(95, int(avg_score + multilingual_boost))

        return {
            "cluster_ai_probability": final_cluster_score,
            "languages_analyzed_count": len(languages),
            "status": "AI-Assistance Indicators Elevated" if final_cluster_score >= 55 else "Standard Propagation",
            "paraphrase_dispersion": "High" if len(languages) >= 2 else "Normal"
        }
