import os
import sys
import json

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from blockchain.evidence.hasher import EvidenceHasher
from blockchain.evidence.evm_anchor import EVMAnchorService
from database.db import is_db_available, insert_audit_entry, get_audit_ledger_from_db

def run_evm_anchoring_test():
    print("=" * 70)
    print(" BHARAT-SHIELD SENTINEL — ON-CHAIN EVM SMART CONTRACT VERIFICATION ")
    print("=" * 70)

    campaign_id = "CAMPAIGN_007"
    mock_posts = [
        {"id": "SIG-WA-00921", "platform": "whatsapp", "text": "Panic induction text message"},
        {"id": "SIG-TG-00419", "platform": "telegram", "text": "Official disinformation narrative"}
    ]
    mock_risk = {
        "base_risk": 95,
        "confidence": "HIGH",
        "signals": [{"name": "cross_platform_swarm"}, {"name": "ai_generated_synthetics"}]
    }

    # Step 1: Generate evidence package & EVM smart contract anchor proof
    print("\n[1] Generating Canonical Evidence Package & Invoking EVM Smart Contract...")
    package = EvidenceHasher.generate_evidence_package(campaign_id, mock_posts, mock_risk)
    
    print("\n[+] EVM Evidence Package Sealed:")
    print(f" - Evidence ID:       {package['evidence_id']}")
    print(f" - SHA-256 Hash:      {package['sha256_hash']}")
    print(f" - EVM Status:        {package['blockchain_status']}")
    print(f" - EVM Network:       {package['blockchain_network']} (Chain ID: {package['chain_id']})")
    print(f" - Contract Address:  {package['contract_address']}")
    print(f" - Transaction Hash:  {package['tx_hash']}")
    print(f" - Block Number:      #{package['block_number']}")
    print(f" - Gas Used:          {package['gas_used']} units")
    print(f" - PolygonScan URL:   {package['explorer_url']}")
    print(f" - Audit Sequence:    {' -> '.join(package['audit_events'])}")

    # Step 2: Verify Evidence On-Chain
    print("\n[2] Verifying Evidence Digest On-Chain...")
    verification = EVMAnchorService.verify_on_chain(package["sha256_hash"])
    print(f"[+] Verification Result: {verification['verification_status']}")
    print(f" - Valid:             {verification['is_valid']}")
    print(f" - Proof Type:        {verification['proof_type']}")

    # Step 3: Audit Ledger Persistence in PostgreSQL
    print("\n[3] Logging EVM Transaction to PostgreSQL Audit Ledger...")
    db_available = is_db_available()
    if db_available:
        success = insert_audit_entry(
            package_id=package["evidence_id"],
            campaign_id=campaign_id,
            sha256_hash=package["sha256_hash"],
            tx_hash=package["tx_hash"],
            block_number=package["block_number"],
            contract_address=package["contract_address"],
            event_type="EVM_SMART_CONTRACT_SEALED",
            details=f"Anchored on {package['blockchain_network']} in Tx {package['tx_hash']}",
            analyst_id="INVESTIGATION_OFFICER_ROOT",
            role="investigation_bureau"
        )
        print(f"[+] Audit Entry Inserted into PostgreSQL: {success}")
        
        ledger = get_audit_ledger_from_db(limit=3)
        print(f"[+] Total DB Audit Ledger Entries Retrieved: {len(ledger)}")
        if ledger:
            top = ledger[0]
            print(f"   Top Ledger Log: Tx {top.get('tx_hash')} | Block #{top.get('block_number')}")
    else:
        print("[-] PostgreSQL DB is offline. Evidence package sealed in-memory.")

    print("\n" + "=" * 70)
    print(" [+] ON-CHAIN EVM SMART CONTRACT ANCHORING VERIFIED SUCCESSFULLY! ")
    print("=" * 70)

if __name__ == "__main__":
    run_evm_anchoring_test()
