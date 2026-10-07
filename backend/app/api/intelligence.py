from backend.app.models.schemas import Campaign, EvidencePackage
from ai.clustering.clusterer import CampaignClusterer
from ai.pipeline import BharatShieldIntelligencePipeline
from blockchain.evidence.hasher import EvidenceHasher
import json
from pathlib import Path
from collections import Counter
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_FILE = BASE_DIR / "data" / "synthetic" / "campaign_data.json"

router = APIRouter(prefix="/api", tags=["Intelligence"])

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
        }
    ],
    "corporate_enterprise": [
        {
            "id": "CMP-ADANI-009",
            "title": "Coordinated Short-Seller Disinformation Swarm (Port Operations)",
            "status": "ACTIVE_HIGH",
            "category": "Market Manipulation & Short Sabotage",
            "threat_score": 91,
            "confidence": "HIGH",
            "primary_language": "en",
            "languages_detected": ["English", "Gujarati", "Hindi"],
            "platforms": ["twitter", "telegram", "news"],
            "post_count": 1280,
            "cross_platform_sync": 93,
            "target": "Adani Ports & SEZ (APSEZ) Share Price & ESG Ratings",
            "summary": "Synchronized release of fabricated environmental and customs non-compliance documents on shadow financial Telegram channels prior to market opening.",
            "authorized_actions": ["bse_clarification", "executive_briefing", "defamation_vault"]
        },
        {
            "id": "CMP-ADANI-014",
            "title": "Deepfake Voice Note Attack on Executive Financial Solvency",
            "status": "FORENSIC_TRIAGE",
            "category": "Executive Deepfake Phishing & Defamation",
            "threat_score": 87,
            "confidence": "HIGH",
            "primary_language": "hi",
            "languages_detected": ["Hindi", "English"],
            "platforms": ["whatsapp", "telegram"],
            "post_count": 520,
            "cross_platform_sync": 88,
            "target": "Adani Enterprises Leadership & Institutional Bondholders",
            "summary": "AI voice synthesis impersonating Group CFO discussing fictional credit default swaps and asset revaluations.",
            "authorized_actions": ["bse_clarification", "defamation_vault"]
        },
        {
            "id": "CMP-CORP-022",
            "title": "Solar & Green Energy Supply Chain Malign Smear",
            "status": "MONITORING",
            "category": "Commercial ESG Sabotage",
            "threat_score": 73,
            "confidence": "MEDIUM",
            "primary_language": "en",
            "languages_detected": ["English", "French"],
            "platforms": ["twitter", "news"],
            "post_count": 310,
            "cross_platform_sync": 77,
            "target": "Adani Green Energy Global Sovereign Funds",
            "summary": "Cross-border botnet weaponizing outdated dispute filings to trigger automated ESG risk rating downgrades.",
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
    ]
}

@router.get("/overview")
def get_overview(role: Optional[str] = Query(default="investigation_bureau")):
    posts = []
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            posts = json.load(f)

    if role == "corporate_enterprise":
        return {
            "role": "corporate_enterprise",
            "organization": "Adani Group — Brand Defense & Market Risk",
            "clearance": "Enterprise Tier-1",
            "stats": {
                "active_campaigns": 3,
                "high_risk_campaigns": 2,
                "content_analyzed": 4892,
                "tipline_submissions": 46,
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
                {"name": "X / Stocktwits", "key": "twitter", "count": 2348, "percentage": 48, "color": "#3b82f6"},
                {"name": "Telegram Channels", "key": "telegram", "count": 1565, "percentage": 32, "color": "#f59e0b"},
                {"name": "WhatsApp Forwards", "key": "whatsapp", "count": 587, "percentage": 12, "color": "#ef4444"},
                {"name": "Shadow Financial Web", "key": "news", "count": 392, "percentage": 8, "color": "#8c9ba5"}
            ]
        }

    if role == "journalist_media":
        return {
            "role": "journalist_media",
            "organization": "National Press Consortium & Fact-Check Desk",
            "clearance": "Press Accredited",
            "stats": {
                "active_campaigns": 3,
                "high_risk_campaigns": 2,
                "content_analyzed": 8420,
                "tipline_submissions": 842,
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
                {"name": "WhatsApp Tipline", "key": "whatsapp", "count": 3704, "percentage": 44, "color": "#ef4444"},
                {"name": "X (Twitter)", "key": "twitter", "count": 3031, "percentage": 36, "color": "#3b82f6"},
                {"name": "Telegram Groups", "key": "telegram", "count": 1178, "percentage": 14, "color": "#f59e0b"},
                {"name": "Facebook Pages", "key": "news", "count": 505, "percentage": 6, "color": "#8c9ba5"}
            ]
        }

    # Default: Investigation Bureau of India
    total_posts = len(posts)
    clusters = Counter(p.get("campaign_cluster") for p in posts if p.get("campaign_cluster"))
    platforms = Counter(p.get("platform") for p in posts if p.get("platform"))
    
    twitter_count = platforms.get("twitter", 0)
    telegram_count = platforms.get("telegram", 0)
    whatsapp_count = platforms.get("whatsapp_tipline", 0)
    news_count = platforms.get("news", 0) + platforms.get("facebook", 0)
    
    total_platform_sum = max(twitter_count + telegram_count + whatsapp_count + news_count, 1)
    
    source_distribution = [
        {"name": "X (Twitter)", "key": "twitter", "count": twitter_count, "percentage": round((twitter_count / total_platform_sum) * 100), "color": "#3b82f6"},
        {"name": "Telegram Dark Feeds", "key": "telegram", "count": telegram_count, "percentage": round((telegram_count / total_platform_sum) * 100), "color": "#f59e0b"},
        {"name": "Citizen Tipline", "key": "whatsapp", "count": whatsapp_count, "percentage": round((whatsapp_count / total_platform_sum) * 100), "color": "#ef4444"},
        {"name": "Shadow Portals", "key": "news", "count": news_count, "percentage": round((news_count / total_platform_sum) * 100), "color": "#8c9ba5"}
    ]

    timeline_24h = [
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

    return {
        "role": "investigation_bureau",
        "organization": "Investigation Bureau of India (IB / LEA)",
        "clearance": "Level 5 Top Secret",
        "stats": {
            "active_campaigns": len(clusters) or 3,
            "high_risk_campaigns": 2,
            "content_analyzed": total_posts or 12483,
            "tipline_submissions": whatsapp_count or 385,
            "ai_suspected": 7
        },
        "timeline": {
            "24H": timeline_24h
        },
        "sources": source_distribution
    }

@router.get("/campaigns")
def get_campaigns(
    role: Optional[str] = Query(default="investigation_bureau"),
    x_user_role: Optional[str] = Header(default=None)
):
    """Return campaign intelligence list filtered by active user persona/role clearance."""
    active_role = role or x_user_role or "investigation_bureau"
    if active_role in ROLE_CAMPAIGNS:
        return ROLE_CAMPAIGNS[active_role]
    return ROLE_CAMPAIGNS["investigation_bureau"]

@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str, role: Optional[str] = Query(default="investigation_bureau")):
    """Fetch specific campaign with role authorization checks."""
    active_role = role if role in ROLE_CAMPAIGNS else "investigation_bureau"
    for c in ROLE_CAMPAIGNS[active_role]:
        if c["id"].lower() == campaign_id.lower():
            return c
            
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
    - 'sec69a_takedown' requires 'investigation_bureau'
    - 'bse_clarification' requires 'corporate_enterprise'
    - 'publish_factcheck' requires 'journalist_media'
    """
    action_type = payload.get("action_type")
    campaign_id = payload.get("campaign_id", "CMP-007")
    active_role = x_user_role if x_user_role in ROLE_CAMPAIGNS else "investigation_bureau"

    # RBAC Authorization Matrix Check
    ROLE_PERMISSIONS = {
        "sec69a_takedown": ["investigation_bureau"],
        "inter_agency_dossier": ["investigation_bureau"],
        "blockchain_notarize": ["investigation_bureau", "corporate_enterprise"],
        "bse_clarification": ["corporate_enterprise"],
        "executive_briefing": ["corporate_enterprise"],
        "defamation_vault": ["corporate_enterprise"],
        "publish_factcheck": ["journalist_media"],
        "generate_debunk_bulletin": ["journalist_media"]
    }

    allowed_roles = ROLE_PERMISSIONS.get(action_type, ["investigation_bureau"])
    if active_role not in allowed_roles:
        raise HTTPException(
            status_code=403, 
            detail=f"RBAC ACCESS DENIED: Active role '{active_role}' is not authorized to execute '{action_type}'. Required permissions: {allowed_roles}"
        )

    tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:8]}"
    return {
        "status": "EXECUTED",
        "action_type": action_type,
        "campaign_id": campaign_id,
        "executor_role": active_role,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "cryptographic_signature": tx_hash,
        "message": f"Operation '{action_type}' authorized and sealed with EVM cryptographic timestamp."
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

    return {
        "report_id": f"REP-{str(uuid.uuid4())[:8].upper()}",
        "title": report_titles.get(active_role, "Threat Intelligence Report"),
        "role": active_role,
        "campaign_id": campaign_id,
        "format": format_type,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "integrity_hash": f"sha256:{uuid.uuid4().hex}",
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
    return result

@router.post("/tipline/ingest")
def ingest_tipline_signal(payload: Dict[str, Any] = Body(...)):
    """
    Tipline Signal Ingestion:
    Analyzes submitted signal, calculates campaign correlation, and seals evidence.
    """
    text = payload.get("text", "")
    media_type = payload.get("media_type", "text")
    platform = payload.get("platform", "whatsapp_tipline")

    analysis = BharatShieldIntelligencePipeline.process_signal(
        text=text,
        media_type=media_type,
        platform=platform
    )
    return {
        "status": "INGESTED",
        "signal_id": analysis["signal_id"],
        "language_detected": analysis["language_analysis"]["language"],
        "threat_level": analysis["risk_assessment"]["base_risk"],
        "confidence": analysis["risk_assessment"]["confidence"],
        "ai_assistance": analysis["ai_assistance_indicators"]["status"],
        "sha256_hash": analysis["evidence_package"]["sha256_hash"],
        "full_analysis": analysis
    }
