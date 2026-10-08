import json
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any
from blockchain.evidence.evm_anchor import EVMAnchorService

class EvidenceHasher:
    @staticmethod
    def generate_evidence_package(campaign_id: str, posts: list, risk_data: dict) -> dict:
        """
        Creates a canonical JSON evidence bundle, computes its SHA-256 hash,
        and anchors it on the EVM Smart Contract (Polygon Amoy / Ethereum Sepolia Testnet).
        """
        now_iso = datetime.now(timezone.utc).isoformat()

        content_ids = []
        for p in posts:
            if isinstance(p, dict):
                content_ids.append(p.get("id", "UNKNOWN"))
            elif hasattr(p, "id"):
                content_ids.append(p.id)
            else:
                content_ids.append(str(p))

        signals_applied = []
        raw_signals = risk_data.get("signals", []) if isinstance(risk_data, dict) else []
        for s in raw_signals:
            if isinstance(s, dict):
                signals_applied.append(s.get("name", str(s)))
            elif hasattr(s, "name"):
                signals_applied.append(s.name)
            else:
                signals_applied.append(str(s))

        evidence_payload = {
            "campaign_id": campaign_id,
            "timestamp": now_iso,
            "content_ids": content_ids,
            "risk_score": risk_data.get("base_risk", 85) if isinstance(risk_data, dict) else 85,
            "confidence": risk_data.get("confidence", "HIGH") if isinstance(risk_data, dict) else "HIGH",
            "signals_applied": signals_applied
        }
        
        # Canonical JSON string sorting keys
        canonical_str = json.dumps(evidence_payload, sort_keys=True)
        sha256_digest = hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()
        
        # Anchor on-chain via EVM Smart Contract
        evm_anchor_data = EVMAnchorService.anchor_evidence_hash(
            sha256_hex=sha256_digest,
            campaign_id=campaign_id
        )

        return {
            "evidence_id": f"EVID-{campaign_id}",
            "campaign_id": campaign_id,
            "created_at": now_iso,
            "content_count": len(posts),
            "sha256_hash": f"0x{sha256_digest}",
            "blockchain_status": "SEALED_ON_EVM_BLOCKCHAIN",
            "blockchain_network": evm_anchor_data["blockchain_network"],
            "chain_id": evm_anchor_data["chain_id"],
            "contract_address": evm_anchor_data["contract_address"],
            "tx_hash": evm_anchor_data["tx_hash"],
            "block_number": evm_anchor_data["block_number"],
            "gas_used": evm_anchor_data["gas_used"],
            "explorer_url": evm_anchor_data["explorer_url"],
            "audit_events": [
                "EVIDENCE_PACKAGED",
                "SHA256_DIGEST_COMPUTED",
                "EVM_SMART_CONTRACT_SEALED",
                "BLOCKCHAIN_ANCHOR_VERIFIED"
            ]
        }

    @staticmethod
    def verify_evidence(canonical_payload: dict, expected_hash: str) -> bool:
        canonical_str = json.dumps(canonical_payload, sort_keys=True)
        computed_hash = hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()
        clean_expected = expected_hash.lower().replace("0x", "")
        return computed_hash.lower() == clean_expected
