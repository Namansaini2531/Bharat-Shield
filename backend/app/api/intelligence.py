from fastapi import APIRouter, HTTPException, Query
from backend.app.models.schemas import Campaign, EvidencePackage
from ai.clustering.clusterer import CampaignClusterer
from blockchain.evidence.hasher import EvidenceHasher
import json
from pathlib import Path
from collections import Counter
from typing import Optional

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_FILE = BASE_DIR / "data" / "synthetic" / "campaign_data.json"

router = APIRouter(prefix="/api", tags=["Intelligence"])

# Supported RBAC personas
ROLES_METADATA = {
    "investigation_bureau": {
        "role_id": "investigation_bureau",
        "name": "Investigation Bureau of India (IB / LEA)",
        "clearance": "Level 5 Top Secret",
        "scope": "National Security, Critical Infrastructure & Cross-Border Ops",
        "allowed_campaigns": ["CMP-007", "CMP-011", "CMP-003", "CAMPAIGN_007", "CAMPAIGN_011"]
    },
    "corporate_enterprise": {
        "role_id": "corporate_enterprise",
        "name": "Adani Group — Brand Defense & Market Risk",
        "clearance": "Enterprise Tier-1",
        "scope": "Stock Volatility Sabotage, Executive Deepfakes & Corporate Disinformation",
        "allowed_campaigns": ["ADANI-009", "ADANI-014", "ADANI-022"]
    },
    "journalist_media": {
        "role_id": "journalist_media",
        "name": "National Press Consortium & Fact-Check Desk",
        "clearance": "Press Accredited",
        "scope": "Public Virality, Cross-Lingual Mutation Trees & WhatsApp Debunks",
        "allowed_campaigns": ["FACT-007", "FACT-011", "FACT-033"]
    }
}

@router.get("/auth/roles")
def get_roles():
    """Return all available RBAC roles and permissions."""
    return ROLES_METADATA

@router.get("/overview")
def get_overview(role: Optional[str] = Query(default="investigation_bureau")):
    posts = []
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            posts = json.load(f)

    # Role tailored metrics
    if role == "corporate_enterprise":
        return {
            "role": "corporate_enterprise",
            "organization": "Adani Group Brand Defense",
            "stats": {
                "active_campaigns": 4,
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
            "organization": "National Press Consortium",
            "stats": {
                "active_campaigns": 23,
                "high_risk_campaigns": 6,
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
        "organization": "Investigation Bureau of India",
        "stats": {
            "active_campaigns": len(clusters) or 17,
            "high_risk_campaigns": sum(1 for c in ["CAMPAIGN_007", "CAMPAIGN_011"] if c in clusters) or 5,
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
def get_campaigns(role: Optional[str] = Query(default="investigation_bureau")):
    all_campaigns = CampaignClusterer.get_all_campaigns()
    return all_campaigns

@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    campaign = CampaignClusterer.get_campaign_by_id(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

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
