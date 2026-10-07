from ai.threat_scoring.signals import ThreatSignalExtractor

class RiskAssessmentEngine:
    """
    Computes uncertainty-aware risk scores according to the BHARAT-SHIELD formula:
    BaseRisk = 0.25 * NarrativeSimilarity 
               + 0.15 * TemporalBurst 
               + 0.15 * CrossPlatformPropagation 
               + 0.10 * CrossLanguageSeeding 
               + 0.10 * TemplateFingerprint 
               + 0.10 * NarrativeMutation 
               + 0.10 * AmplificationSignals 
               + 0.05 * SourceAnomaly
    """

    WEIGHTS = {
        "semantic_similarity": (0.25, "Cross-lingual semantic narrative match"),
        "temporal_burst": (0.15, "High density propagation burst"),
        "cross_platform": (0.15, "Multi-channel coordinated spread"),
        "cross_language": (0.10, "Multi-language seeding (EN/HI/Hinglish)"),
        "template_fingerprint": (0.10, "Prompt-like structural template reuse"),
        "narrative_mutation": (0.10, "Paraphrase and translation variation"),
        "amplification_signals": (0.10, "Urgent CTA and share push"),
        "source_anomaly": (0.05, "Anomalous account timing/pattern")
    }

    @classmethod
    def evaluate_campaign(cls, posts: list) -> dict:
        signals_raw = ThreatSignalExtractor.analyze_posts(posts)

        base_score_0_1 = 0.0
        signal_details = []

        for key, (weight, desc) in cls.WEIGHTS.items():
            val = signals_raw.get(key, 0.0)
            contrib = weight * val
            base_score_0_1 += contrib
            signal_details.append({
                "name": key,
                "weight": weight,
                "score": round(val * 100, 1),
                "description": desc
            })

        base_risk_100 = round(base_score_0_1 * 100, 1)

        # Compute uncertainty margin based on dataset count
        evidence_count = len(posts)
        if evidence_count >= 5:
            uncertainty = 4.0
            confidence = "High"
        elif evidence_count >= 2:
            uncertainty = 8.0
            confidence = "Medium"
        else:
            uncertainty = 15.0
            confidence = "Low"

        risk_min = max(0.0, round(base_risk_100 - uncertainty, 1))
        risk_max = min(100.0, round(base_risk_100 + uncertainty, 1))

        return {
            "base_risk": base_risk_100,
            "uncertainty_margin": uncertainty,
            "risk_min": risk_min,
            "risk_max": risk_max,
            "confidence": confidence,
            "corroborating_signals_count": len([s for s in signal_details if s["score"] > 40]),
            "signals": signal_details,
            "human_review_required": base_risk_100 >= 60.0
        }
