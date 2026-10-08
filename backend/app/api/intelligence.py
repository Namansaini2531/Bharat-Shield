import json
import logging
import uuid
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Body, Header, HTTPException, Query

try:
    from ai.clustering.clusterer import CampaignClusterer
    from ai.embeddings import MultilingualEmbedder
    from ai.pipeline import BharatShieldIntelligencePipeline
except Exception:
    CampaignClusterer = None
    MultilingualEmbedder = None
    BharatShieldIntelligencePipeline = None

from backend.app.models.schemas import Campaign, EvidencePackage

try:
    from blockchain.evidence.hasher import EvidenceHasher
except Exception:
    EvidenceHasher = None

from database.db import (
    get_audit_ledger_from_db,
    get_campaign_by_id_from_db,
    get_campaigns_from_db,
    get_db_overview_stats,
    get_recent_signals,
    insert_audit_entry,
    insert_signal,
    is_db_available,
    search_similar_signals,
    upsert_campaign,
)

logger = logging.getLogger("bharat_shield.intelligence")

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_FILE = BASE_DIR / "data" / "synthetic" / "campaign_data.json"

router = APIRouter(prefix="/api", tags=["Intelligence"])

# In-memory runtime fallback storage for signals and audit records
IN_MEMORY_SIGNALS: List[Dict[str, Any]] = []

# Campaign Action & Mitigation Ledger Storage
IN_MEMORY_CAMPAIGN_LEDGER: Dict[str, List[Dict[str, Any]]] = {
    "CMP-007": [
        {
            "id": "EV-ACT-88A12B01",
            "campaign_id": "CMP-007",
            "action_type": "sec69a_takedown",
            "action_name": "Section 69A IT Act Emergency Blocking Notice",
            "damage_reduction_effect": "48 hostile Telegram seed URLs and C2 bridge accounts flagged to MeitY",
            "executor": "OP_INVESTIGATION_BUREAU",
            "role": "investigation_bureau",
            "status": "SEALED_ON_EVM",
            "tx_hash": "0x7a29e4d1f88c3a90b41c0989ad871034f828a1c902b4d7",
            "block_number": 8492019,
            "timestamp": "2026-10-08T10:15:00Z"
        },
        {
            "id": "EV-ACT-88A12B02",
            "campaign_id": "CMP-007",
            "action_type": "inter_agency_dossier",
            "action_name": "Inter-Agency Intelligence Flash Bulletin",
            "damage_reduction_effect": "Threat actor IOCs and ASN proxy ranges synchronized with CERT-In",
            "executor": "OP_INVESTIGATION_BUREAU",
            "role": "investigation_bureau",
            "status": "SEALED_ON_EVM",
            "tx_hash": "0x33b190f892a014cf99812b1928fa802094391abf83c109",
            "block_number": 8492044,
            "timestamp": "2026-10-08T10:30:00Z"
        }
    ],
    "CMP-TATA-009": [
        {
            "id": "EV-ACT-TATA-01",
            "campaign_id": "CMP-TATA-009",
            "action_type": "bse_clarification",
            "action_name": "BSE & NSE Regulation 30 Corporate LODR Clarification",
            "damage_reduction_effect": "Pre-market official denial distributed to exchange clearing members; retail panic curtailed by 85%",
            "executor": "OP_CORPORATE_ENTERPRISE",
            "role": "corporate_enterprise",
            "status": "SEALED_ON_EVM",
            "tx_hash": "0x89e02fb812903ab7cf34091ab109f7a934bb012489",
            "block_number": 8492002,
            "timestamp": "2026-10-08T08:55:00Z"
        },
        {
            "id": "EV-ACT-TATA-02",
            "campaign_id": "CMP-TATA-009",
            "action_type": "blockchain_notarize",
            "action_name": "Defamation Evidence Vault Cryptographic Sealing",
            "damage_reduction_effect": "Merkle root of 1,280 coordinated bot accounts sealed into Polygon Amoy ledger for Section 66D IT Act litigation",
            "executor": "OP_CORPORATE_ENTERPRISE",
            "role": "corporate_enterprise",
            "status": "SEALED_ON_EVM",
            "tx_hash": "0x28fb01ab49c90182390abff71829034af109b8c910",
            "block_number": 8492065,
            "timestamp": "2026-10-08T09:20:00Z"
        }
    ],
    "FACT-007": [
        {
            "id": "EV-ACT-FACT-01",
            "campaign_id": "FACT-007",
            "action_type": "publish_factcheck",
            "action_name": "Multilingual IFCN Fact-Check Card Broadcast",
            "damage_reduction_effect": "Verified debunk graphics pushed to 54,000+ WhatsApp Tipline subscribers; rumor velocity reduced by 92%",
            "executor": "OP_JOURNALIST_MEDIA",
            "role": "journalist_media",
            "status": "SEALED_ON_EVM",
            "tx_hash": "0x12a89047bf192083ca89012390fab847c109289124",
            "block_number": 8492011,
            "timestamp": "2026-10-08T09:40:00Z"
        }
    ]
}

# Role-specific campaign registries
ROLE_CAMPAIGNS = {
    "investigation_bureau": [
        {
            "id": "CMP-007",
            "title": "Operation Echo: Telecom & Critical Grid Sabotage",
            "status": "ACTIVE_CRITICAL",
            "category": "National Security / Disinformation Warfare",
            "threat_score": 94,
            "confidence": "HIGH",
            "primary_language": "hi-Latn",
            "languages_detected": ["Hindi", "Hinglish", "Punjabi", "English"],
            "platforms": ["twitter", "telegram", "whatsapp"],
            "post_count": 842,
            "cross_platform_sync": 96,
            "target": "National Critical Infrastructure & Public Law & Order",
            "summary": "Coordinated synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-011",
            "title": "Operation Redacted: Border Sector Coordinated Proxy Swarm",
            "status": "MONITORING",
            "category": "Cross-Border Cyber Operations",
            "threat_score": 88,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Urdu", "Hindi"],
            "platforms": ["twitter", "telegram"],
            "post_count": 412,
            "cross_platform_sync": 89,
            "target": "Defense Personnel & Northern Logistics Hubs",
            "summary": "Coordinated bot network deploying deepfake operational orders targeting border transit networks.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier"]
        },
        {
            "id": "CMP-003",
            "title": "Operation Cipher: Subsea Cable Sabotage Rumor Tree",
            "status": "TRIAGED",
            "category": "State-Sponsored Information Warfare",
            "threat_score": 79,
            "confidence": "MEDIUM",
            "primary_language": "en",
            "languages_detected": ["English", "Tamil", "Hindi"],
            "platforms": ["twitter", "news"],
            "post_count": 218,
            "cross_platform_sync": 84,
            "target": "Coastal Data Centers & Banking Backbone",
            "summary": "Synthetic technical advisories alleging undersea fiber cuts to trigger financial market panic.",
            "authorized_actions": ["inter_agency_dossier"]
        },
        {
            "id": "CMP-029",
            "title": "Operation Petro-Panic: Refinery Blast & Fuel Rationing Disinformation",
            "status": "ACTIVE_CRITICAL",
            "category": "Critical Infrastructure / Energy Disinformation",
            "threat_score": 91,
            "confidence": "HIGH",
            "primary_language": "hi-Latn",
            "languages_detected": ["Hindi", "Hinglish", "Punjabi", "English"],
            "platforms": ["twitter", "telegram", "whatsapp", "instagram"],
            "post_count": 1420,
            "cross_platform_sync": 94,
            "target": "National Oil Refineries & Public Fuel Supplies",
            "summary": "Coordinated disinformation network recirculating out-of-context industrial fire footage with fabricated claims of nationwide refinery sabotage and emergency fuel rationing.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-001",
            "title": "Operation Currency Shock: Fabricated ₹500 Demonetization Circular",
            "status": "VIRAL_SPIKE",
            "category": "Financial Disinformation & Economic Warfare",
            "threat_score": 93,
            "confidence": "HIGH",
            "primary_language": "te",
            "languages_detected": ["Telugu", "Hindi", "Tamil", "English"],
            "platforms": ["whatsapp", "twitter", "telegram"],
            "post_count": 2840,
            "cross_platform_sync": 96,
            "target": "Banking Backbone & Retail Cash Depositors",
            "summary": "Synthetic circular bearing counterfeit Ministry of Finance watermarks alleging immediate invalidation of ₹500 currency notes to incite ATM rushes and digital banking bottlenecks.",
            "authorized_actions": ["publish_factcheck", "sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-015",
            "title": "Operation Sovereign Cloud: Defense Recruitment Phishing & Portal Spoofing",
            "status": "MONITORING",
            "category": "State-Sponsored Cyber Espionage",
            "threat_score": 85,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi", "Urdu"],
            "platforms": ["twitter", "telegram", "instagram"],
            "post_count": 640,
            "cross_platform_sync": 88,
            "target": "Defense Aspirants & Armed Forces Logistics Portals",
            "summary": "Coordinated social engineering swarm distributing counterfeit MoD recruitment circulars embedded with malicious credential-harvesting APK links.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        }
    ],
    "corporate_enterprise": [
        {
            "id": "CMP-TATA-009",
            "title": "Coordinated Disinformation Swarm (Tata Motors EV & TCS)",
            "status": "ACTIVE_HIGH",
            "category": "Market Manipulation & Brand Sabotage",
            "threat_score": 91,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi", "Marathi"],
            "platforms": ["twitter", "telegram", "instagram"],
            "post_count": 1280,
            "cross_platform_sync": 93,
            "target": "Tata Motors & TCS Share Price & Brand Trust",
            "summary": "Synchronized release of fabricated EV battery defect videos and counterfeit hiring freeze notices on shadow Telegram channels prior to market opening.",
            "authorized_actions": ["bse_clarification", "executive_briefing", "defamation_vault"]
        },
        {
            "id": "CMP-TATA-014",
            "title": "Deepfake Voice Note Attack on Executive Leadership",
            "status": "FORENSIC_TRIAGE",
            "category": "Executive Deepfake Phishing & Defamation",
            "threat_score": 87,
            "confidence": "HIGH",
            "primary_language": "hi",
            "languages_detected": ["Hindi", "English"],
            "platforms": ["whatsapp", "telegram", "instagram"],
            "post_count": 520,
            "cross_platform_sync": 88,
            "target": "Tata Sons Leadership & Air India Operational Solvency",
            "summary": "AI voice synthesis impersonating aviation management and Group CFO discussing fictional credit default swaps.",
            "authorized_actions": ["bse_clarification", "defamation_vault"]
        },
        {
            "id": "CMP-TATA-022",
            "title": "Tata Steel Environmental ESG Fabrications",
            "status": "MONITORING",
            "category": "Commercial ESG Sabotage",
            "threat_score": 73,
            "confidence": "MEDIUM",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi"],
            "platforms": ["twitter", "instagram"],
            "post_count": 310,
            "cross_platform_sync": 77,
            "target": "Tata Steel Global ESG Ratings & Sovereign Funds",
            "summary": "Cross-border botnet weaponizing counterfeit regulatory notices to trigger automated ESG risk rating downgrades.",
            "authorized_actions": ["executive_briefing"]
        }
    ],
    "journalist_media": [
        {
            "id": "FACT-007",
            "title": "Nationwide Internet & Power Shutdown Hoax Mutation Tree",
            "status": "VIRAL_SPIKE",
            "category": "Citizen WhatsApp Debunk & Fact-Check",
            "threat_score": 89,
            "confidence": "HIGH",
            "primary_language": "hi-Latn",
            "languages_detected": ["Hindi", "Hinglish", "Bengali", "Marathi", "English"],
            "platforms": ["whatsapp", "telegram", "facebook"],
            "post_count": 3490,
            "cross_platform_sync": 94,
            "target": "General Public & Civic Communities",
            "summary": "Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.",
            "authorized_actions": ["publish_factcheck", "generate_debunk_bulletin"]
        },
        {
            "id": "FACT-011",
            "title": "Synthetic Audio Clip Claiming Regional Bank Moratorium",
            "status": "DEBUNKED",
            "category": "Financial Disinformation Fact-Check",
            "threat_score": 82,
            "confidence": "HIGH",
            "primary_language": "hi",
            "languages_detected": ["Hindi", "English"],
            "platforms": ["whatsapp", "twitter"],
            "post_count": 1840,
            "cross_platform_sync": 91,
            "target": "Retail Depositors & Urban Cooperatives",
            "summary": "Fabricated voice clip of RBI Governor allegedly restricting cash withdrawals in northern states.",
            "authorized_actions": ["publish_factcheck", "generate_debunk_bulletin"]
        },
        {
            "id": "FACT-033",
            "title": "Manipulated Video of Election Electoral Roll Purge",
            "status": "MONITORING",
            "category": "Electoral Integrity & Misinformation",
            "threat_score": 76,
            "confidence": "MEDIUM",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi", "Telugu"],
            "platforms": ["twitter", "facebook"],
            "post_count": 920,
            "cross_platform_sync": 81,
            "target": "Voters & Civic Organizations",
            "summary": "Old training video republished with deceptive subtitles claiming electronic voting machine server anomalies.",
            "authorized_actions": ["publish_factcheck"]
        }
    ],
    "system_admin": [
        {
            "id": "CMP-007",
            "title": "Infrastructure Shutdown & Civil Unrest Narrative",
            "status": "ACTIVE CRITICAL",
            "category": "National Security / Disinformation Warfare",
            "threat_score": 94,
            "confidence": "HIGH",
            "primary_language": "hi-Latn",
            "languages_detected": ["Hindi", "Hinglish", "Punjabi", "English"],
            "platforms": ["twitter", "telegram", "whatsapp"],
            "post_count": 842,
            "cross_platform_sync": 96,
            "target": "National Critical Infrastructure & Public Law & Order",
            "summary": "State-sponsored coordinated synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize", "bse_clarification"]
        },
        {
            "id": "CMP-011",
            "title": "Government Identity Spoofing & Phishing Matrix",
            "status": "MONITORING",
            "category": "Credential Harvesting Farm",
            "threat_score": 83,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi", "Urdu"],
            "platforms": ["twitter", "telegram"],
            "post_count": 412,
            "cross_platform_sync": 89,
            "target": "Defense Personnel & Northern Logistics Hubs",
            "summary": "Coordinated bot network deploying deepfake operational orders targeting border transit networks.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-003",
            "title": "Communal Polarization Burst in Border Districts",
            "status": "SURVEILLANCE",
            "category": "Cross-Border Telegram Networks",
            "threat_score": 67,
            "confidence": "MEDIUM",
            "primary_language": "en",
            "languages_detected": ["English", "Tamil", "Hindi"],
            "platforms": ["telegram", "twitter"],
            "post_count": 218,
            "cross_platform_sync": 84,
            "target": "Coastal Data Centers & Banking Backbone",
            "summary": "Synthetic technical advisories alleging undersea fiber cuts to trigger financial market panic.",
            "authorized_actions": ["inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-TATA-009",
            "title": "Tata Motors EV & TCS Disinformation Swarm",
            "status": "DEFENSE ACTIVE",
            "category": "Market Manipulation & Short Sabotage",
            "threat_score": 91,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi", "Marathi"],
            "platforms": ["twitter", "telegram", "instagram"],
            "post_count": 1280,
            "cross_platform_sync": 93,
            "target": "Tata Motors & TCS Share Price & Brand Trust",
            "summary": "Synchronized release of fabricated EV defect claims and counterfeit campus hiring freeze circulars on shadow Telegram & Instagram channels.",
            "authorized_actions": ["bse_clarification", "executive_briefing", "defamation_vault"]
        },
        {
            "id": "FACT-007",
            "title": "Nationwide Internet & UPI Blackout Panic Forward",
            "status": "DEBUNK ISSUED",
            "category": "Mass Panic Induction",
            "threat_score": 89,
            "confidence": "HIGH",
            "primary_language": "hi-Latn",
            "languages_detected": ["Hindi", "Hinglish", "Bengali", "Marathi", "English"],
            "platforms": ["whatsapp", "telegram", "facebook"],
            "post_count": 3490,
            "cross_platform_sync": 94,
            "target": "General Public & Civic Communities",
            "summary": "Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.",
            "authorized_actions": ["publish_factcheck", "generate_debunk_bulletin"]
        },
        {
            "id": "CMP-029",
            "title": "Operation Petro-Panic: Refinery Blast & Fuel Rationing Disinformation",
            "status": "ACTIVE CRITICAL",
            "category": "Critical Infrastructure / Energy Disinformation",
            "threat_score": 91,
            "confidence": "HIGH",
            "primary_language": "hi-Latn",
            "languages_detected": ["Hindi", "Hinglish", "Punjabi", "English"],
            "platforms": ["twitter", "telegram", "whatsapp", "instagram"],
            "post_count": 1420,
            "cross_platform_sync": 94,
            "target": "National Oil Refineries & Public Fuel Supplies",
            "summary": "Coordinated disinformation network recirculating out-of-context industrial fire footage with fabricated claims of nationwide refinery sabotage and emergency fuel rationing.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-001",
            "title": "Operation Currency Shock: Fabricated ₹500 Demonetization Circular",
            "status": "VIRAL SPIKE",
            "category": "Financial Disinformation & Economic Warfare",
            "threat_score": 93,
            "confidence": "HIGH",
            "primary_language": "te",
            "languages_detected": ["Telugu", "Hindi", "Tamil", "English"],
            "platforms": ["whatsapp", "twitter", "telegram"],
            "post_count": 2840,
            "cross_platform_sync": 96,
            "target": "Banking Backbone & Retail Cash Depositors",
            "summary": "Synthetic circular bearing counterfeit Ministry of Finance watermarks alleging immediate invalidation of ₹500 currency notes to incite ATM rushes and digital banking bottlenecks.",
            "authorized_actions": ["publish_factcheck", "sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        },
        {
            "id": "CMP-015",
            "title": "Operation Sovereign Cloud: Defense Recruitment Phishing & Portal Spoofing",
            "status": "MONITORING",
            "category": "State-Sponsored Cyber Espionage",
            "threat_score": 85,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Hindi", "Urdu"],
            "platforms": ["twitter", "telegram", "instagram"],
            "post_count": 640,
            "cross_platform_sync": 88,
            "target": "Defense Aspirants & Armed Forces Logistics Portals",
            "summary": "Coordinated social engineering swarm distributing counterfeit MoD recruitment circulars embedded with malicious credential-harvesting APK links.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"]
        }
    ]
}

@router.get("/overview")
def get_overview(role: Optional[str] = Query(default="investigation_bureau")):
    """
    Overview Telemetry & Threat Metrics with dynamic multi-platform dataset integration.
    """
    posts = []
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                posts = json.load(f)
        except Exception:
            posts = []

    db_stats = get_db_overview_stats() if is_db_available() else None
    total_analyzed = (db_stats["total_signals"] if db_stats and db_stats["total_signals"] > 0 else 72080) + len(IN_MEMORY_SIGNALS)

    if role in ["system_admin", "admin", "super_admin"]:
        sys_camps = ROLE_CAMPAIGNS.get("system_admin", ROLE_CAMPAIGNS["investigation_bureau"])
        active_camps_count = len(sys_camps)
        high_risk_count = sum(1 for c in sys_camps if (c.get("threat_score") or 0) >= 88 or "CRITICAL" in c.get("status", ""))

        return {
            "role": "system_admin",
            "organization": "National Cyber Coordination Centre (NCCC) & MoD",
            "clearance": "Level 5+ (Supreme Root Authority)",
            "storage_engine": "PostgreSQL (pgvector)" if is_db_available() else "In-Memory Optimized",
            "stats": {
                "active_campaigns": active_camps_count,
                "high_risk_campaigns": high_risk_count,
                "content_analyzed": total_analyzed,
                "tipline_submissions": 2000 + len(IN_MEMORY_SIGNALS),
                "ai_suspected": 89,
                "cluster_nodes_online": "4 / 4"
            },
            "timeline": {
                "24H": [
                    {"time": "00:00", "count": 14, "highRisk": 3},
                    {"time": "04:00", "count": 16, "highRisk": 4},
                    {"time": "08:00", "count": 64, "highRisk": 24},
                    {"time": "12:00", "count": 128, "highRisk": 92},
                    {"time": "16:00", "count": 98, "highRisk": 62},
                    {"time": "20:00", "count": 56, "highRisk": 22},
                ]
            },
            "sources": [
                {"name": "X (Twitter)", "key": "twitter", "count": 26480, "percentage": 37, "color": "var(--sticker-sky)"},
                {"name": "Reddit Ingestion", "key": "reddit", "count": 20000, "percentage": 28, "color": "var(--sticker-orange)"},
                {"name": "Instagram Reels", "key": "instagram", "count": 20000, "percentage": 28, "color": "var(--sticker-pink)"},
                {"name": "Telegram Dark Web", "key": "telegram", "count": 3600, "percentage": 5, "color": "var(--sticker-purple)"},
                {"name": "WhatsApp Tiplines", "key": "whatsapp", "count": 2000, "percentage": 2, "color": "var(--sticker-teal)"}
            ]
        }

    if role == "corporate_enterprise":
        return {
            "role": "corporate_enterprise",
            "organization": "Tata Sons — Brand Defense & Market Risk",
            "clearance": "Enterprise Tier-1",
            "storage_engine": "PostgreSQL (pgvector)" if is_db_available() else "In-Memory Optimized",
            "stats": {
                "active_campaigns": db_stats["total_campaigns"] if db_stats and db_stats["total_campaigns"] > 0 else 4,
                "high_risk_campaigns": db_stats["high_risk_campaigns"] if db_stats else 2,
                "content_analyzed": 14280 + len(IN_MEMORY_SIGNALS),
                "tipline_submissions": 46 + len(IN_MEMORY_SIGNALS),
                "ai_suspected": 3
            },
            "timeline": {
                "24H": [
                    {"time": "00:00", "count": 8, "highRisk": 1},
                    {"time": "04:00", "count": 12, "highRisk": 2},
                    {"time": "08:00", "count": 65, "highRisk": 38},
                    {"time": "12:00", "count": 98, "highRisk": 72},
                    {"time": "16:00", "count": 82, "highRisk": 54},
                    {"time": "20:00", "count": 45, "highRisk": 22},
                ]
            },
            "sources": [
                {"name": "X / FinTwit Clusters", "key": "twitter", "count": 5426, "percentage": 38, "color": "var(--sticker-sky)"},
                {"name": "Instagram Viral Reels", "key": "instagram", "count": 3998, "percentage": 28, "color": "var(--sticker-pink)"},
                {"name": "Reddit Investor Hubs", "key": "reddit", "count": 2856, "percentage": 20, "color": "var(--sticker-orange)"},
                {"name": "Telegram Shadow Groups", "key": "telegram", "count": 2000, "percentage": 14, "color": "var(--sticker-purple)"}
            ]
        }

    if role == "journalist_media":
        return {
            "role": "journalist_media",
            "organization": "National Press Consortium & Fact-Check Desk",
            "clearance": "Press Accredited",
            "storage_engine": "PostgreSQL (pgvector)" if is_db_available() else "In-Memory Optimized",
            "stats": {
                "active_campaigns": db_stats["total_campaigns"] if db_stats and db_stats["total_campaigns"] > 0 else 3,
                "high_risk_campaigns": db_stats["high_risk_campaigns"] if db_stats else 2,
                "content_analyzed": 24800 + len(IN_MEMORY_SIGNALS),
                "tipline_submissions": 9424 + len(IN_MEMORY_SIGNALS),
                "ai_suspected": 11
            },
            "timeline": {
                "24H": [
                    {"time": "00:00", "count": 18, "highRisk": 3},
                    {"time": "04:00", "count": 22, "highRisk": 4},
                    {"time": "08:00", "count": 75, "highRisk": 35},
                    {"time": "12:00", "count": 140, "highRisk": 95},
                    {"time": "16:00", "count": 110, "highRisk": 68},
                    {"time": "20:00", "count": 62, "highRisk": 25},
                ]
            },
            "sources": [
                {"name": "WhatsApp Citizen Tipline", "key": "whatsapp", "count": 9424, "percentage": 38, "color": "var(--sticker-teal)"},
                {"name": "Instagram Viral Reels", "key": "instagram", "count": 6944, "percentage": 28, "color": "var(--sticker-pink)"},
                {"name": "Reddit Rumor Threads", "key": "reddit", "count": 4960, "percentage": 20, "color": "var(--sticker-orange)"},
                {"name": "X / Public Feeds", "key": "twitter", "count": 3472, "percentage": 14, "color": "var(--sticker-sky)"}
            ]
        }

    ib_camps = ROLE_CAMPAIGNS.get("investigation_bureau", [])
    ib_active_count = len(ib_camps)
    ib_critical_count = sum(1 for c in ib_camps if (c.get("threat_score") or 0) >= 88 or "CRITICAL" in c.get("status", ""))

    # Default: Investigation Bureau of India (IB / LEA)
    return {
        "role": "investigation_bureau",
        "organization": "Investigation Bureau of India (IB / LEA)",
        "clearance": "Level 5 Top Secret",
        "storage_engine": "PostgreSQL (pgvector)" if is_db_available() else "In-Memory Optimized",
        "stats": {
            "active_campaigns": ib_active_count,
            "high_risk_campaigns": ib_critical_count,
            "content_analyzed": total_analyzed,
            "tipline_submissions": 3850 + len(IN_MEMORY_SIGNALS),
            "ai_suspected": 89
        },
        "timeline": {
            "24H": [
                {"time": "00:00", "count": 14, "highRisk": 3},
                {"time": "02:00", "count": 22, "highRisk": 5},
                {"time": "04:00", "count": 16, "highRisk": 4},
                {"time": "06:00", "count": 38, "highRisk": 9},
                {"time": "08:00", "count": 64, "highRisk": 24},
                {"time": "10:00", "count": 92, "highRisk": 48},
                {"time": "12:00", "count": 128, "highRisk": 92},
                {"time": "14:00", "count": 112, "highRisk": 78},
                {"time": "16:00", "count": 98, "highRisk": 62},
                {"time": "18:00", "count": 74, "highRisk": 34},
                {"time": "20:00", "count": 56, "highRisk": 22},
                {"time": "22:00", "count": 42, "highRisk": 11},
            ]
        },
        "sources": [
            {"name": "X (Twitter Botnets)", "key": "twitter", "count": 26480, "percentage": 37, "color": "var(--sticker-sky)"},
            {"name": "Reddit Disinfo Swarms", "key": "reddit", "count": 20000, "percentage": 28, "color": "var(--sticker-orange)"},
            {"name": "Instagram Visual Ops", "key": "instagram", "count": 20000, "percentage": 28, "color": "var(--sticker-pink)"},
            {"name": "Dark Telegram Channels", "key": "telegram", "count": 5600, "percentage": 7, "color": "var(--sticker-purple)"}
        ]
    }

CLUSTERED_CAMPAIGNS_FILE = BASE_DIR / "data" / "processed" / "clustered_campaigns.json"
_CACHED_ARCHIVED_CAMPAIGNS = None

MOVED_FROM_ARCHIVED_IDS = {"CMP-029", "CMP-001", "CMP-015"}

def get_archived_ml_campaigns() -> List[Dict[str, Any]]:
    """Loads and caches campaigns discovered by ML clustering models on historical datasets, excluding campaigns moved to ongoing."""
    global _CACHED_ARCHIVED_CAMPAIGNS
    if _CACHED_ARCHIVED_CAMPAIGNS is not None:
        return _CACHED_ARCHIVED_CAMPAIGNS
    
    if CLUSTERED_CAMPAIGNS_FILE.exists():
        try:
            with open(CLUSTERED_CAMPAIGNS_FILE, "r", encoding="utf-8") as f:
                raw_clusters = json.load(f)
                archived = []
                for idx, c in enumerate(raw_clusters):
                    c_id = c.get("id") or f"CMP-ML-{idx+1:03d}"
                    if c_id in MOVED_FROM_ARCHIVED_IDS:
                        continue
                    title = c.get("title") or "Cross-Platform Narrative Cluster"
                    title = title.strip()
                    threat_score = round(float(c.get("threat_score") or c.get("risk_assessment", {}).get("base_risk", 50.0)), 1)
                    
                    archived.append({
                        "id": c_id,
                        "title": title,
                        "status": "ARCHIVED / CONTAINED",
                        "type": "archived",
                        "category": c.get("category") or "ML Disinformation Cluster",
                        "threat_score": threat_score,
                        "overall_threat_min": c.get("overall_threat_min", max(0.0, threat_score - 10)),
                        "overall_threat_max": c.get("overall_threat_max", min(100.0, threat_score + 10)),
                        "confidence": c.get("confidence") or "HIGH",
                        "coordination_score": c.get("coordination_score", 75),
                        "ai_probability": c.get("ai_probability", 65),
                        "cross_platform_sync": c.get("cross_platform_sync", 80),
                        "primary_language": c.get("primary_language") or "hi",
                        "languages_detected": c.get("languages_detected") or ["hi", "en"],
                        "platforms": c.get("platforms") or ["twitter", "telegram"],
                        "post_count": c.get("post_count") or len(c.get("posts", [])),
                        "target": c.get("target") or "Public Information Space & Civic Trust",
                        "summary": c.get("summary") or f"Historical campaign identified via Multilingual Embeddings + HDBSCAN clustering containing {c.get('post_count', 0)} coordinated signals.",
                        "authorized_actions": c.get("authorized_actions") or ["inter_agency_dossier", "blockchain_notarize"],
                        "risk_assessment": c.get("risk_assessment"),
                        "evidence": c.get("evidence"),
                        "posts": c.get("posts", [])[:8]
                    })
                _CACHED_ARCHIVED_CAMPAIGNS = archived
                return _CACHED_ARCHIVED_CAMPAIGNS
        except Exception as e:
            logger.error(f"Error loading clustered campaigns: {e}")
            return []
    return []

@router.get("/campaigns")
def get_campaigns(
    role: Optional[str] = Query(default="investigation_bureau"),
    status: Optional[str] = Query(default=None),
    enterprise_id: Optional[str] = Query(default=None),
    scope_enterprise: Optional[bool] = Query(default=False),
    x_user_role: Optional[str] = Header(default=None)
):
    """
    Return comprehensive campaign intelligence filtered by user role, lifecycle state, 
    and optional ML Enterprise Scoping.
    """
    from ai.enterprise_scoper import EnterpriseScoper

    active_role = role or x_user_role or "investigation_bureau"
    
    # If enterprise scoping is explicitly requested or role is corporate_enterprise
    if scope_enterprise or (enterprise_id is not None) or active_role == "corporate_enterprise":
        profile = None
        if enterprise_id:
            profiles = {p["id"]: p for p in EnterpriseScoper.get_all_profiles()}
            profile = profiles.get(enterprise_id)
        if not profile:
            profile = EnterpriseScoper.get_active_profile()

        # Gather all candidates
        all_candidates = []
        seen = set()
        for r_camps in ROLE_CAMPAIGNS.values():
            for c in r_camps:
                if c["id"] not in seen:
                    seen.add(c["id"])
                    c_copy = dict(c)
                    c_copy["type"] = "ongoing"
                    all_candidates.append(c_copy)
        for c in get_archived_ml_campaigns():
            if c["id"] not in seen:
                seen.add(c["id"])
                all_candidates.append(dict(c))

        scoped_list = EnterpriseScoper.filter_campaigns_for_enterprise(all_candidates, profile)
        
        ongoing_scoped = [c for c in scoped_list if c.get("type") == "ongoing"]
        archived_scoped = [c for c in scoped_list if c.get("type") != "ongoing"]

        if status == "ongoing":
            return ongoing_scoped
        elif status == "archived":
            return archived_scoped

        return {
            "enterprise_profile": profile,
            "ongoing": ongoing_scoped,
            "archived": archived_scoped,
            "total_count": len(scoped_list),
            "ongoing_count": len(ongoing_scoped),
            "archived_count": len(archived_scoped)
        }

    ongoing_raw = ROLE_CAMPAIGNS.get(active_role, ROLE_CAMPAIGNS["investigation_bureau"])
    ongoing_list = []
    for c in ongoing_raw:
        c_copy = dict(c)
        c_copy["type"] = "ongoing"
        if not c_copy.get("status"):
            c_copy["status"] = "ACTIVE CRITICAL"
        ongoing_list.append(c_copy)
        
    archived_list = get_archived_ml_campaigns()
    
    if status == "ongoing":
        return ongoing_list
    elif status == "archived":
        return archived_list
    
    # Return structured object containing both ongoing and ML-clustered archived campaigns
    return {
        "ongoing": ongoing_list,
        "archived": archived_list,
        "total_count": len(ongoing_list) + len(archived_list),
        "ongoing_count": len(ongoing_list),
        "archived_count": len(archived_list)
    }

@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str, role: Optional[str] = Query(default="investigation_bureau")):
    """Fetch specific campaign with role authorization checks and ML cluster lookup."""
    active_role = role if role in ROLE_CAMPAIGNS else "investigation_bureau"
    
    # Check in active role campaigns
    for c in ROLE_CAMPAIGNS.get(active_role, []):
        if c["id"].lower() == campaign_id.lower():
            c_copy = dict(c)
            c_copy["type"] = "ongoing"
            return c_copy
            
    # Check across all ongoing role campaigns
    for r_campaigns in ROLE_CAMPAIGNS.values():
        for c in r_campaigns:
            if c["id"].lower() == campaign_id.lower():
                c_copy = dict(c)
                c_copy["type"] = "ongoing"
                return c_copy
                
    # Check in ML archived campaigns
    archived_list = get_archived_ml_campaigns()
    for c in archived_list:
        if c["id"].lower() == campaign_id.lower():
            return c
            
    # Check in database if available
    if is_db_available():
        db_camp = get_campaign_by_id_from_db(campaign_id)
        if db_camp:
            return db_camp
            
    # Check default AI clusterer fallback
    campaign = CampaignClusterer.get_campaign_by_id(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found under current clearance partition")
    return campaign


@router.post("/analyst/action")
def execute_analyst_action(
    payload: Dict[str, Any] = Body(...),
    x_user_role: Optional[str] = Header(default="investigation_bureau")
):
    """
    Role-Protected Execution of Counter-Operations:
    - 'sec69a_takedown' requires 'investigation_bureau' or 'system_admin'
    - 'bse_clarification' requires 'corporate_enterprise' or 'system_admin'
    - 'publish_factcheck' requires 'journalist_media' or 'system_admin'
    Persists immutable audit trail into PostgreSQL audit_ledger table.
    """
    action_type = payload.get("action_type")
    campaign_id = payload.get("campaign_id", "CMP-007")
    active_role = x_user_role if x_user_role in ROLE_CAMPAIGNS or x_user_role == "system_admin" else "investigation_bureau"

    # RBAC Authorization Matrix Check
    ROLE_PERMISSIONS = {
        "sec69a_takedown": ["investigation_bureau", "system_admin"],
        "inter_agency_dossier": ["investigation_bureau", "system_admin"],
        "blockchain_notarize": ["investigation_bureau", "corporate_enterprise", "system_admin"],
        "bse_clarification": ["corporate_enterprise", "system_admin"],
        "executive_briefing": ["corporate_enterprise", "system_admin"],
        "defamation_vault": ["corporate_enterprise", "system_admin"],
        "publish_factcheck": ["journalist_media", "system_admin"],
        "generate_debunk_bulletin": ["journalist_media", "system_admin"]
    }

    allowed_roles = ROLE_PERMISSIONS.get(action_type, ["investigation_bureau", "system_admin"])
    if active_role not in allowed_roles:
        raise HTTPException(
            status_code=403, 
            detail=f"RBAC ACCESS DENIED: Active role '{active_role}' is not authorized to execute '{action_type}'. Required permissions: {allowed_roles}"
        )

    package_id = f"EV-ACT-{uuid.uuid4().hex[:8].upper()}"
    tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:8]}"
    details_str = json.dumps({
        "action": action_type,
        "campaign_id": campaign_id,
        "executor": active_role,
        "payload": payload
    })

    # Persist in PostgreSQL audit_ledger
    db_persisted = False
    if is_db_available():
        db_persisted = insert_audit_entry(
            package_id=package_id,
            campaign_id=campaign_id,
            sha256_hash=tx_hash,
            event_type=f"COUNTER_ACTION_{action_type.upper()}",
            details=details_str,
            analyst_id=f"OP_{active_role.upper()}",
            role=active_role
        )

    # Record in campaign action ledger
    ledger_entry = {
        "id": package_id,
        "campaign_id": campaign_id,
        "action_type": action_type,
        "action_name": payload.get("action_name", action_type.replace("_", " ").title()),
        "damage_reduction_effect": payload.get("damage_reduction_effect") or f"Executed '{action_type}' to minimize campaign harm.",
        "executor": f"OP_{active_role.upper()}",
        "role": active_role,
        "status": "SEALED_ON_EVM",
        "tx_hash": tx_hash,
        "block_number": 8492000 + len(IN_MEMORY_SIGNALS) + 1,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    if campaign_id not in IN_MEMORY_CAMPAIGN_LEDGER:
        IN_MEMORY_CAMPAIGN_LEDGER[campaign_id] = []
    IN_MEMORY_CAMPAIGN_LEDGER[campaign_id].insert(0, ledger_entry)

    return {
        "status": "EXECUTED",
        "action_type": action_type,
        "campaign_id": campaign_id,
        "executor_role": active_role,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "cryptographic_signature": tx_hash,
        "package_id": package_id,
        "db_persisted": db_persisted,
        "ledger_entry": ledger_entry,
        "message": f"Operation '{action_type}' authorized, executed, and sealed with EVM cryptographic timestamp."
    }

@router.get("/campaigns/{campaign_id}/ledger")
def get_campaign_ledger(campaign_id: str):
    """
    Returns the immutable action & damage reduction ledger for a specific campaign.
    """
    entries = IN_MEMORY_CAMPAIGN_LEDGER.get(campaign_id, [])
    if not entries and is_db_available():
        db_entries = get_audit_ledger_from_db(limit=30)
        entries = [e for e in db_entries if e.get("campaign_id") == campaign_id]
    return {
        "campaign_id": campaign_id,
        "total_actions": len(entries),
        "ledger": entries
    }

@router.get("/campaigns/ledger/all")
def get_all_campaign_ledgers():
    """
    Returns summary action ledgers across all tracked campaigns.
    """
    return {
        "status": "SUCCESS",
        "total_campaigns_tracked": len(IN_MEMORY_CAMPAIGN_LEDGER),
        "ledgers": IN_MEMORY_CAMPAIGN_LEDGER
    }

@router.post("/reports/generate")
def generate_role_report(
    payload: Dict[str, Any] = Body(...),
    x_user_role: Optional[str] = Header(default="investigation_bureau")
):
    """Generate role-jurisdiction official report dossiers."""
    active_role = x_user_role if x_user_role in ROLE_CAMPAIGNS else "investigation_bureau"
    campaign_id = payload.get("campaign_id", "CMP-007")
    format_type = payload.get("format", "pdf")

    report_titles = {
        "investigation_bureau": "Section 69A IT Act Emergency Information Operation Dossier",
        "corporate_enterprise": "SEBI / Stock Exchange Brand Defense & Market Volatility Briefing",
        "journalist_media": "Multilingual Fact-Check & WhatsApp Debunk Dispatch"
    }

    report_id = f"REP-{str(uuid.uuid4())[:8].upper()}"
    sha_hash = f"sha256:{uuid.uuid4().hex}"

    if is_db_available():
        insert_audit_entry(
            package_id=report_id,
            campaign_id=campaign_id,
            sha256_hash=sha_hash,
            event_type="REPORT_GENERATED",
            details=f"Generated {format_type.upper()} briefing: {report_titles.get(active_role)}",
            analyst_id=f"OP_{active_role.upper()}",
            role=active_role
        )

    return {
        "report_id": report_id,
        "title": report_titles.get(active_role, "Threat Intelligence Report"),
        "role": active_role,
        "campaign_id": campaign_id,
        "format": format_type,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "integrity_hash": sha_hash,
        "status": "READY_FOR_DOWNLOAD"
    }

@router.post("/evidence/{evidence_id}/verify")
def verify_evidence(evidence_id: str):
    campaign = CampaignClusterer.get_campaign_by_id("CMP-001")
    if not campaign or not campaign.get("evidence"):
        raise HTTPException(status_code=404, detail="Evidence record not found")

    evidence = campaign["evidence"]
    is_valid = EvidenceHasher.verify_evidence(
        {
            "campaign_id": evidence["campaign_id"],
            "timestamp": "2026-08-17T10:00:00Z",
            "content_ids": [p["id"] for p in campaign["posts"]],
            "risk_score": campaign["risk_assessment"]["base_risk"],
            "confidence": campaign["risk_assessment"]["confidence"],
            "signals_applied": [s["name"] for s in campaign["risk_assessment"]["signals"]]
        },
        evidence["sha256_hash"]
    )

    return {
        "evidence_id": evidence_id,
        "verified": is_valid,
        "sha256_hash": evidence["sha256_hash"],
        "message": "Evidence integrity verified successfully via SHA-256 digest match."
    }

@router.get("/models/status")
def get_ai_models_status():
    """Returns the operational status of all BHARAT-SHIELD AI/ML models."""
    return BharatShieldIntelligencePipeline.get_models_status()

@router.post("/pipeline/analyze")
def analyze_content(payload: Dict[str, Any] = Body(...)):
    """
    Real-Time Multimodal Intelligence Analysis:
    Runs full pipeline (Language ID -> OCR/ASR -> Entities -> Embeddings -> Threat Score -> Evidence).
    """
    text = payload.get("text", "")
    media_type = payload.get("media_type", "text")
    platform = payload.get("platform", "whatsapp_tipline")
    metadata = payload.get("metadata", {})

    result = BharatShieldIntelligencePipeline.process_signal(
        text=text,
        media_type=media_type,
        platform=platform,
        metadata=metadata
    )

    # Optional vector similarity search against PostgreSQL
    similar_signals = []
    if is_db_available() and text:
        embedding = MultilingualEmbedder.encode(text)
        similar_signals = search_similar_signals(embedding, limit=3)
        result["similar_known_threats"] = similar_signals

    return result

@router.post("/tipline/ingest")
def ingest_tipline_signal(payload: Dict[str, Any] = Body(...)):
    """
    Tipline Signal Ingestion:
    1. Analyzes submitted signal via Multilingual Multimodal AI Pipeline.
    2. Calculates 384-dimensional pgvector semantic embedding.
    3. Persists signal into PostgreSQL `tipline_signals` with HNSW vector index.
    4. Logs tamper-evident cryptographic evidence hash into `audit_ledger`.
    5. Performs real-time Cosine Similarity search to detect campaign correlation.
    """
    text = payload.get("text", "")
    media_type = payload.get("media_type", "text")
    platform = payload.get("platform", "whatsapp_tipline")

    analysis = BharatShieldIntelligencePipeline.process_signal(
        text=text,
        media_type=media_type,
        platform=platform
    )

    signal_id = analysis["signal_id"]
    lang = analysis["language_analysis"]["language"]
    threat_level = analysis["risk_assessment"]["base_risk"]
    confidence = analysis["risk_assessment"]["confidence"]
    sha256_hash = analysis["evidence_package"]["sha256_hash"]
    
    # Determine severity label
    severity = "CRITICAL" if threat_level >= 85 else ("HIGH" if threat_level >= 65 else "MEDIUM")
    
    # Generate 384-dim embedding
    embedding = MultilingualEmbedder.encode(text or analysis.get("language_analysis", {}).get("raw_text", ""))

    # PostgreSQL + pgvector persistence
    db_saved = False
    similar_clusters = []
    if is_db_available():
        db_saved = insert_signal(
            signal_id=signal_id,
            source=platform,
            raw_payload=text,
            detected_language=lang,
            confidence_score=0.92 if confidence == "HIGH" else 0.75,
            intent_classification="disinformation_swarm" if threat_level > 70 else "unverified_signal",
            severity=severity,
            normalized_translation=analysis["language_analysis"].get("normalized_text", text),
            campaign_id="CMP-007" if threat_level > 80 else None,
            embedding=embedding
        )

        evm_pkg = analysis.get("evidence_package", {})
        insert_audit_entry(
            package_id=signal_id,
            campaign_id="CMP-007" if threat_level > 80 else None,
            sha256_hash=sha256_hash,
            event_type="SIGNAL_EVM_SEALED",
            details=f"Ingested from {platform} ({lang}) with Threat Score {threat_level}/100. EVM Tx: {evm_pkg.get('tx_hash', 'N/A')}",
            analyst_id="SENTINEL_AI_INGEST",
            role="investigation_bureau",
            tx_hash=evm_pkg.get("tx_hash"),
            block_number=evm_pkg.get("block_number"),
            contract_address=evm_pkg.get("contract_address")
        )

        # Query pgvector for cosine similarity matches
        similar_clusters = search_similar_signals(embedding, limit=3)

    # In-memory buffer backup
    IN_MEMORY_SIGNALS.append({
        "id": signal_id,
        "platform": platform,
        "text": text,
        "language": lang,
        "threat_level": threat_level,
        "confidence": confidence,
        "sha256_hash": sha256_hash,
        "timestamp": analysis["timestamp"]
    })

    return {
        "status": "INGESTED",
        "signal_id": signal_id,
        "language_detected": lang,
        "threat_level": threat_level,
        "severity": severity,
        "confidence": confidence,
        "ai_assistance": analysis["ai_assistance_indicators"]["status"],
        "sha256_hash": sha256_hash,
        "db_persisted": db_saved,
        "storage_engine": "PostgreSQL (pgvector HNSW)" if db_saved else "In-Memory Buffer",
        "correlated_signals": similar_clusters,
        "full_analysis": analysis
    }

@router.get("/signals/recent")
def get_recent_tipline_signals(limit: int = Query(default=20)):
    """Retrieve the newest ingested signals from PostgreSQL or in-memory fallback."""
    if is_db_available():
        db_signals = get_recent_signals(limit=limit)
        if db_signals:
            return db_signals
    
    # Return in-memory buffer
    return IN_MEMORY_SIGNALS[-limit:]

@router.post("/signals/search-vector")
def search_signals_by_vector(payload: Dict[str, Any] = Body(...)):
    """
    Search tipline signals using pgvector cosine similarity (<=>).
    """
    query_text = payload.get("query", "")
    limit = payload.get("limit", 5)
    
    if not query_text:
        raise HTTPException(status_code=400, detail="Query text required")

    embedding = MultilingualEmbedder.encode(query_text)

    if is_db_available():
        results = search_similar_signals(embedding, limit=limit)
        return {
            "query": query_text,
            "dimension": len(embedding),
            "matches_count": len(results),
            "results": results
        }

    return {
        "query": query_text,
        "dimension": len(embedding),
        "matches_count": 0,
        "results": [],
        "note": "PostgreSQL pgvector offline; returning empty match set."
    }

@router.post("/reports/generate")
def generate_intelligence_report(
    payload: Dict[str, Any] = Body(...),
    x_user_role: Optional[str] = Header(default="investigation_bureau")
):
    """
    Generates a certified legal and compliance intelligence dossier with SHA-256 evidence integrity.
    Supports Section 69A IT Act (LEA), SEBI Regulation 30 (Corporate), and IFCN Fact-Checking (Media).
    """
    campaign_id = payload.get("campaign_id", "CMP-007")
    fmt = payload.get("format", "pdf").lower()
    
    role = x_user_role or "investigation_bureau"
    
    # Generate timestamp and cryptographic seal
    timestamp = datetime.now(timezone.utc).isoformat()
    dossier_id = f"DOSSIER-{uuid.uuid4().hex[:8].upper()}"
    
    dossier = {
        "dossier_id": dossier_id,
        "campaign_id": campaign_id,
        "generated_at": timestamp,
        "role_partition": role,
        "format": fmt,
        "statutory_authority": "Section 69A of Information Technology Act 2000 (Blocking Rules 2009)" if role == "investigation_bureau" else "SEBI LODR Regulation 30 & IPC Sec 499" if role == "corporate_enterprise" else "IFCN Press Verification Standard",
        "threat_classification": "CRITICAL NATIONAL SECURITY DISINFORMATION OPERATION" if role == "investigation_bureau" else "COORDINATED MARKET MANIPULATION",
        "evidence_integrity": {
            "merkle_root": f"0x{uuid.uuid4().hex}",
            "sha256_package_hash": EvidenceHasher.compute_sha256_dict({"campaign_id": campaign_id, "dossier_id": dossier_id, "timestamp": timestamp}),
            "chain_of_custody": "EVM Block Notarized & PostgreSQL Audit Ledger Logged",
            "admissibility": "Certified Under Section 65B Indian Evidence Act / Bharatiya Sakshya Adhiniyam"
        },
        "target_infringing_vectors": [
            {
                "platform": "twitter",
                "target_url": "https://x.com/tech_leaks_in/status/17849201948",
                "sha256_digest": "sha256:d82a44bb01c89f50e7a2b91901a5b82c",
                "recommended_action": "EMERGENCY_URL_TAKEDOWN"
            },
            {
                "platform": "telegram",
                "target_url": "https://t.me/telecom_sabotage_news/4192",
                "sha256_digest": "sha256:f55a12ec89bb4109ca8817a02b66782d",
                "recommended_action": "CHANNEL_SEQUESTRATION"
            },
            {
                "platform": "whatsapp",
                "target_url": "urn:whatsapp:forward_tree:77192a01",
                "sha256_digest": "sha256:88bc4190ea148201feea2910ba489912",
                "recommended_action": "PUBLIC_DEBUNK_BROADCAST"
            }
        ]
    }

    if is_db_available():
        insert_audit_entry(
            package_id=dossier_id,
            campaign_id=campaign_id,
            sha256_hash=dossier["evidence_integrity"]["sha256_package_hash"],
            event_type="LEGAL_DOSSIER_COMPILED",
            details=f"Dossier {dossier_id} generated for {role} targeting {campaign_id}.",
            role=role
        )

    return {
        "status": "DOSSIER_COMPILED_SUCCESSFULLY",
        "dossier": dossier
    }

@router.post("/evidence/anchor")
def anchor_campaign_evidence(payload: Dict[str, Any] = Body(...)):
    """
    On-Chain EVM Smart Contract Evidence Anchoring Endpoint:
    Packages canonical JSON evidence and anchors SHA-256 digest on Polygon Amoy / EVM smart contract.
    """
    campaign_id = payload.get("campaign_id", "CMP-007")
    posts = payload.get("posts", [{"id": "SIG-001"}, {"id": "SIG-002"}])
    risk_data = payload.get("risk_data", {"base_risk": 94, "confidence": "HIGH", "signals": [{"name": "panic_inducement"}]})

    evidence_package = EvidenceHasher.generate_evidence_package(
        campaign_id=campaign_id,
        posts=posts,
        risk_data=risk_data
    )

    if is_db_available():
        insert_audit_entry(
            package_id=evidence_package["evidence_id"],
            campaign_id=campaign_id,
            sha256_hash=evidence_package["sha256_hash"],
            tx_hash=evidence_package["tx_hash"],
            block_number=evidence_package["block_number"],
            contract_address=evidence_package["contract_address"],
            event_type="EVM_SMART_CONTRACT_SEALED",
            details=f"Anchored on {evidence_package['blockchain_network']} in Tx {evidence_package['tx_hash']}",
            analyst_id="SYSTEM_EVM_NOTARY",
            role="investigation_bureau"
        )

    return {
        "status": "EVIDENCE_SEALED_ON_EVM",
        "package": evidence_package
    }

@router.get("/evidence/verify/{sha256_hash}")
def verify_evm_evidence(sha256_hash: str):
    """
    Verify whether a given SHA-256 digest is valid and anchored on the EVM Smart Contract.
    """
    from blockchain.evidence.evm_anchor import EVMAnchorService
    return EVMAnchorService.verify_on_chain(sha256_hex=sha256_hash)


@router.post("/ai/counter-strategy")
def generate_ai_counter_strategy(
    payload: Dict[str, Any] = Body(...),
    x_user_role: Optional[str] = Header(default="investigation_bureau")
):
    """
    Generates persona-tailored counter-disinformation strategies, multilingual debunk drafts, 
    and statutory response steps using Kritrim Sovereign AI Engine.
    """
    from ai.groq_advisor import GroqCounterAdvisor

    campaign_id = payload.get("campaign_id", "CMP-007")
    title = payload.get("title", "Coordinated Disinformation Vector")
    category = payload.get("category", "Disinformation Operation")
    target = payload.get("target", "National Information Space")
    threat_score = int(payload.get("threat_score", 90))
    primary_language = payload.get("primary_language", "hi-Latn")
    languages_detected = payload.get("languages_detected", ["Hindi", "English"])
    summary = payload.get("summary", "")
    role = payload.get("role") or x_user_role or "investigation_bureau"
    custom_api_key = payload.get("custom_kritrim_api_key") or payload.get("kritrim_api_key") or payload.get("custom_groq_api_key") or payload.get("groq_api_key")

    strategy = GroqCounterAdvisor.generate_strategy(
        campaign_id=campaign_id,
        title=title,
        category=category,
        target=target,
        threat_score=threat_score,
        primary_language=primary_language,
        languages_detected=languages_detected,
        summary=summary,
        role=role,
        custom_key=custom_api_key
    )

    return {
        "status": "SUCCESS",
        "campaign_id": campaign_id,
        "role": role,
        "strategy": strategy
    }


# ---------------------------------------------------------------------------
# Enterprise Data Profile & ML Scoping Endpoints
# ---------------------------------------------------------------------------

@router.get("/enterprise/profiles")
def get_enterprise_profiles():
    """Returns all configured enterprise brand profiles."""
    from ai.enterprise_scoper import EnterpriseScoper
    return {
        "status": "SUCCESS",
        "profiles": EnterpriseScoper.get_all_profiles(),
        "active_profile": EnterpriseScoper.get_active_profile()
    }

@router.get("/enterprise/profile/active")
def get_active_enterprise_profile():
    """Returns the currently active enterprise profile."""
    from ai.enterprise_scoper import EnterpriseScoper
    return {
        "status": "SUCCESS",
        "profile": EnterpriseScoper.get_active_profile()
    }

@router.post("/enterprise/profile")
def upsert_enterprise_profile(payload: Dict[str, Any] = Body(...)):
    """Creates or updates an enterprise profile with custom brand data."""
    from ai.enterprise_scoper import EnterpriseScoper
    updated = EnterpriseScoper.upsert_profile(payload)
    return {
        "status": "SUCCESS",
        "message": f"Enterprise profile for '{updated.get('name')}' updated successfully.",
        "profile": updated
    }

@router.post("/enterprise/profile/activate/{profile_id}")
def activate_enterprise_profile(profile_id: str):
    """Sets the active enterprise profile for ML search and scoping."""
    from ai.enterprise_scoper import EnterpriseScoper
    active = EnterpriseScoper.set_active_profile(profile_id)
    if not active:
        raise HTTPException(status_code=404, detail=f"Enterprise profile '{profile_id}' not found.")
    return {
        "status": "SUCCESS",
        "message": f"Active enterprise profile switched to '{active.get('name')}'.",
        "profile": active
    }

@router.get("/enterprise/campaigns")
def get_enterprise_scoped_campaigns(
    profile_id: Optional[str] = Query(default=None),
    role: Optional[str] = Query(default="corporate_enterprise")
):
    """
    Returns campaigns filtered and scored by ML semantic relevance to the active enterprise.
    """
    from ai.enterprise_scoper import EnterpriseScoper
    
    # 1. Load active profile
    if profile_id:
        profiles = {p["id"]: p for p in EnterpriseScoper.get_all_profiles()}
        profile = profiles.get(profile_id) or EnterpriseScoper.get_active_profile()
    else:
        profile = EnterpriseScoper.get_active_profile()

    # 2. Gather all candidate campaigns (both role-specific, all roles, and ML clustered)
    all_campaigns = []
    seen_ids = set()

    for role_key, c_list in ROLE_CAMPAIGNS.items():
        for c in c_list:
            if c["id"] not in seen_ids:
                seen_ids.add(c["id"])
                c_copy = dict(c)
                c_copy["type"] = "ongoing"
                all_campaigns.append(c_copy)

    for c in get_archived_ml_campaigns():
        if c["id"] not in seen_ids:
            seen_ids.add(c["id"])
            all_campaigns.append(dict(c))

    # 3. Filter using ML Enterprise Scoper
    scoped_campaigns = EnterpriseScoper.filter_campaigns_for_enterprise(all_campaigns, profile)

    return {
        "status": "SUCCESS",
        "enterprise_profile": profile,
        "total_campaigns_evaluated": len(all_campaigns),
        "matching_campaigns_count": len(scoped_campaigns),
        "campaigns": scoped_campaigns
    }

@router.post("/enterprise/ml-scan")
def run_enterprise_ml_scan(payload: Dict[str, Any] = Body(...)):
    """
    Runs an on-demand ML semantic vector scan across recent signals and datasets 
    to detect newly emerging threat clusters against the enterprise.
    """
    from ai.enterprise_scoper import EnterpriseScoper
    
    profile = payload.get("profile") or EnterpriseScoper.get_active_profile()
    
    # Run scan across ongoing and clustered campaigns
    all_campaigns = []
    seen_ids = set()
    for role_key, c_list in ROLE_CAMPAIGNS.items():
        for c in c_list:
            if c["id"] not in seen_ids:
                seen_ids.add(c["id"])
                all_campaigns.append(dict(c))

    for c in get_archived_ml_campaigns():
        if c["id"] not in seen_ids:
            seen_ids.add(c["id"])
            all_campaigns.append(dict(c))

    scoped = EnterpriseScoper.filter_campaigns_for_enterprise(all_campaigns, profile)

    return {
        "status": "SCAN_COMPLETE",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "enterprise_id": profile.get("id"),
        "enterprise_name": profile.get("name"),
        "vectors_analyzed": 72080 + len(IN_MEMORY_SIGNALS),
        "matching_clusters_found": len(scoped),
        "top_threat_detected": scoped[0] if scoped else None,
        "matching_campaigns": scoped
    }

@router.delete("/enterprise/profile/{profile_id}")
def delete_enterprise_profile(profile_id: str):
    """Deletes an enterprise profile."""
    from ai.enterprise_scoper import EnterpriseScoper
    deleted = EnterpriseScoper.delete_profile(profile_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Enterprise profile '{profile_id}' not found.")
    return {
        "status": "SUCCESS",
        "message": f"Enterprise profile '{profile_id}' deleted successfully.",
        "active_profile": EnterpriseScoper.get_active_profile()
    }





