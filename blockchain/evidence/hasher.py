import json
import hashlib
from typing import Dict, Any

class EvidenceHasher:
    @staticmethod
    def generate_evidence_package(campaign_id: str, posts: list, risk_data: dict) -> dict:
        """
        Creates a canonical JSON evidence bundle and computes its SHA-256 hash.
        """
        evidence_payload = {
            "campaign_id": campaign_id,
            "timestamp": "2026-08-17T10:00:00Z",
            "content_ids": [p.get("id") if isinstance(p, dict) else p.id for p in posts],
            "risk_score": risk_data.get("base_risk"),
            "confidence": risk_data.get("confidence"),
            "signals_applied": [s.get("name") if isinstance(s, dict) else s.name for s in risk_data.get("signals", [])]
        }
        
        # Canonical JSON string sorting keys
        canonical_str = json.dumps(evidence_payload, sort_keys=True)
        sha256_digest = hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()
        
        return {
            "evidence_id": f"EVID-{campaign_id}",
            "campaign_id": campaign_id,
            "created_at": "2026-08-17T10:00:00Z",
            "content_count": len(posts),
            "sha256_hash": sha256_digest,
            "audit_events": [
                "EVIDENCE_PACKAGED",
                "SHA256_GENERATED",
                "PENDING_BLOCKCHAIN_ANCHOR"
            ]
        }

    @staticmethod
    def verify_evidence(canonical_payload: dict, expected_hash: str) -> bool:
        canonical_str = json.dumps(canonical_payload, sort_keys=True)
        computed_hash = hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()
        return computed_hash.lower() == expected_hash.lower()
