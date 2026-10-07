import json
from pathlib import Path
from ai.threat_scoring.risk_engine import RiskAssessmentEngine
from blockchain.evidence.hasher import EvidenceHasher

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_FILE = BASE_DIR / "data" / "synthetic" / "campaign_data.json"

class CampaignClusterer:
    @classmethod
    def get_all_campaigns(cls) -> list:
        if not DATA_FILE.exists():
            return []

        with open(DATA_FILE, "r", encoding="utf-8") as f:
            posts = json.load(f)

        if not posts:
            return []

        languages = list(set(p.get("language") for p in posts))
        platforms = list(set(p.get("platform") for p in posts))
        
        risk_data = RiskAssessmentEngine.evaluate_campaign(posts)
        evidence = EvidenceHasher.generate_evidence_package("CMP-001", posts, risk_data)

        campaign = {
            "id": "CMP-001",
            "title": "Fabricated Internet Shutdown Warning",
            "status": "active",
            "primary_language": "en",
            "languages_detected": languages,
            "platforms": platforms,
            "post_count": len(posts),
            "posts": posts,
            "risk_assessment": risk_data,
            "evidence": evidence
        }

        return [campaign]

    @classmethod
    def get_campaign_by_id(cls, campaign_id: str) -> dict:
        campaigns = cls.get_all_campaigns()
        for c in campaigns:
            if c["id"] == campaign_id:
                return c
        return None
