import sys
from pathlib import Path

# Add project root and backend to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from ai.clustering.clusterer import CampaignClusterer
from blockchain.evidence.hasher import EvidenceHasher

def main():
    print("=== Testing BHARAT-SHIELD Intelligence Core ===")
    campaigns = CampaignClusterer.get_all_campaigns()
    print(f"Total Campaigns Detected: {len(campaigns)}")
    
    if not campaigns:
        print("No campaigns returned!")
        sys.exit(1)

    c = campaigns[0]
    print(f"\n[Campaign ID]: {c['id']}")
    print(f"[Title]: {c['title']}")
    print(f"[Languages Detected]: {c['languages_detected']}")
    print(f"[Platforms]: {c['platforms']}")
    
    risk = c['risk_assessment']
    print(f"\n--- Uncertainty-Aware Risk Assessment ---")
    print(f"Base Risk Score: {risk['base_risk']} / 100")
    print(f"Risk Range: {risk['risk_min']} - {risk['risk_max']} / 100")
    print(f"Confidence Level: {risk['confidence']}")
    print(f"Human Review Required: {risk['human_review_required']}")
    print("Signal Breakdown:")
    for s in risk['signals']:
        print(f"  - {s['name']} (weight {s['weight']}): {s['score']}% [{s['description']}]")

    ev = c['evidence']
    print(f"\n--- Blockchain Evidence Package ---")
    print(f"Evidence ID: {ev['evidence_id']}")
    print(f"SHA-256 Hash: {ev['sha256_hash']}")

    # Verify digest
    is_valid = EvidenceHasher.verify_evidence(
        {
            "campaign_id": ev["campaign_id"],
            "timestamp": "2026-08-17T10:00:00Z",
            "content_ids": [p["id"] for p in c["posts"]],
            "risk_score": risk["base_risk"],
            "confidence": risk["confidence"],
            "signals_applied": [s["name"] for s in risk["signals"]]
        },
        ev["sha256_hash"]
    )
    print(f"Evidence Integrity Verification Match: {is_valid}")
    assert is_valid, "Evidence hash verification failed!"
    print("\nSUCCESS: All intelligence core components working as expected.")

if __name__ == "__main__":
    main()
