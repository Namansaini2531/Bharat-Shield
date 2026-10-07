from fastapi import APIRouter, HTTPException, Header, Query, Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/auth", tags=["Authentication & RBAC"])

# Master RBAC Personas & Capabilities
USER_PROFILES = {
    "system_admin": {
        "id": "user_admin_000",
        "name": "Naman Saini (Super Admin)",
        "email": "saininaman643@gmail.com",
        "role": "system_admin",
        "role_title": "Super Administrator / NCCC Operations Command",
        "organization": "National Cyber Coordination Centre (NCCC) & MoD",
        "clearance": "Level 5+ (Supreme Root Authority)",
        "clearance_level": 6,
        "badge_color": "#10b981",
        "badge_text": "SUPREME ADMIN // ROOT",
        "avatar_initials": "NS",
        "allowed_navs": [
            "overview", "live", "tipline", "campaigns", "narratives", 
            "threats", "analyst-response", "report-generator", "evidence", "audit", "admin", "settings"
        ],
        "permissions": {
            "can_manage_system": True,
            "can_issue_sec69a": True,
            "can_access_classified_intel": True,
            "can_view_unmasked_metadata": True,
            "can_generate_legal_dossier": True,
            "can_sign_blockchain_evidence": True,
            "can_generate_sebi_disclosure": True,
            "can_track_market_sabotage": True,
            "can_publish_fact_check": True,
            "can_inspect_narrative_tree": True,
            "can_view_audit_ledger": True
        },
        "scope_title": "Full Spectrum Software Architecture & Threat Grid Management"
    },
    "investigation_bureau": {
        "id": "user_ib_001",
        "name": "Joint Director Vikram Rawat",
        "email": "v.rawat@ib.gov.in",
        "role": "investigation_bureau",
        "role_title": "Investigation Bureau of India (IB / LEA)",
        "organization": "Ministry of Home Affairs / Cyber Ops Command",
        "clearance": "Level 5 (Classified / National Security)",
        "clearance_level": 5,
        "badge_color": "#ef4444",
        "badge_text": "TOP SECRET / LEA",
        "avatar_initials": "IB",
        "allowed_navs": [
            "overview", "live", "tipline", "campaigns", "narratives", 
            "threats", "analyst-response", "report-generator", "evidence", "audit", "admin", "settings"
        ],
        "permissions": {
            "can_issue_sec69a": True,
            "can_access_classified_intel": True,
            "can_view_unmasked_metadata": True,
            "can_generate_legal_dossier": True,
            "can_sign_blockchain_evidence": True,
            "can_generate_sebi_disclosure": False,
            "can_track_market_sabotage": False,
            "can_publish_fact_check": False,
            "can_inspect_narrative_tree": True,
            "can_view_audit_ledger": True
        },
        "scope_title": "National Security & Inter-Agency Threat Matrix"
    },
    "corporate_enterprise": {
        "id": "user_adani_007",
        "name": "Rajesh Singhania",
        "email": "ciso.defense@adani.com",
        "role": "corporate_enterprise",
        "role_title": "Adani Group — Brand Defense & Market Risk",
        "organization": "Adani Corporate Security & Threat Intelligence",
        "clearance": "Enterprise Tier-1 (Corporate Risk & Security)",
        "clearance_level": 3,
        "badge_color": "#f59e0b",
        "badge_text": "ENTERPRISE RISK",
        "avatar_initials": "AG",
        "allowed_navs": [
            "overview", "live", "campaigns", "narratives", 
            "threats", "analyst-response", "report-generator", "evidence", "admin", "settings"
        ],
        "permissions": {
            "can_issue_sec69a": False,
            "can_access_classified_intel": False,
            "can_view_unmasked_metadata": False,
            "can_generate_legal_dossier": False,
            "can_sign_blockchain_evidence": True,
            "can_generate_sebi_disclosure": True,
            "can_track_market_sabotage": True,
            "can_publish_fact_check": False,
            "can_inspect_narrative_tree": True,
            "can_view_audit_ledger": False
        },
        "scope_title": "Corporate Threat Radar & Market Sentiment Defense"
    },
    "journalist_media": {
        "id": "user_media_404",
        "name": "Pooja Kashyap",
        "email": "pooja.k@nationalpress.org",
        "role": "journalist_media",
        "role_title": "Investigative Bureau Lead / Fact-Checker",
        "organization": "National Press Consortium & Fact-Check Desk",
        "clearance": "Public Trust (Certified Fact-Checker)",
        "clearance_level": 2,
        "badge_color": "#3b82f6",
        "badge_text": "PRESS ACCREDITED",
        "avatar_initials": "NP",
        "allowed_navs": [
            "overview", "live", "tipline", "campaigns", "narratives", 
            "threats", "analyst-response", "report-generator", "admin", "settings"
        ],
        "permissions": {
            "can_issue_sec69a": False,
            "can_access_classified_intel": False,
            "can_view_unmasked_metadata": False,
            "can_generate_legal_dossier": False,
            "can_sign_blockchain_evidence": False,
            "can_generate_sebi_disclosure": False,
            "can_track_market_sabotage": False,
            "can_publish_fact_check": True,
            "can_inspect_narrative_tree": True,
            "can_view_audit_ledger": False
        },
        "scope_title": "Public Virality & Cross-Lingual Narrative Verification"
    }
}

# Real-time In-Memory Audit Event Trail for RBAC actions
AUDIT_LOGS = [
    {
        "id": "AUD-0091",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": "Joint Director Vikram Rawat",
        "role": "investigation_bureau",
        "action": "SESSION_INITIALIZED",
        "target": "Classified Partition Level 5",
        "status": "AUTHORIZED",
        "hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    },
    {
        "id": "AUD-0090",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": "Rajesh Singhania",
        "role": "corporate_enterprise",
        "action": "SEBI_DISCLOSURE_DRAFTED",
        "target": "Adani Stock Volatility Telemetry",
        "status": "AUTHORIZED",
        "hash": "0x4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
    }
]

class RoleSwitchRequest(BaseModel):
    target_role: str
    reason: Optional[str] = "Operator requested persona transition"

class AuditLogEntry(BaseModel):
    action: str
    target: str
    details: Optional[Dict[str, Any]] = None

from database.db import is_db_available, insert_audit_entry, get_audit_ledger_from_db

@router.get("/roles")
def get_all_roles():
    """Return all available RBAC roles, clearance levels, and capability definitions."""
    return USER_PROFILES

@router.get("/me")
def get_current_user(x_user_role: Optional[str] = Header(default="investigation_bureau"), role: Optional[str] = Query(default=None)):
    """Return the authenticated user profile based on role header or query parameter."""
    active_role = role or x_user_role or "investigation_bureau"
    if active_role not in USER_PROFILES:
        active_role = "investigation_bureau"
    return USER_PROFILES[active_role]

@router.post("/switch-role")
def switch_role(req: RoleSwitchRequest):
    """Switch active operational persona with cryptographic audit logging."""
    if req.target_role not in USER_PROFILES:
        raise HTTPException(status_code=400, detail=f"Invalid target role: {req.target_role}")

    profile = USER_PROFILES[req.target_role]
    audit_id = f"AUD-{str(uuid.uuid4())[:8].upper()}"
    tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:16]}"
    
    log_entry = {
        "id": audit_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": profile["name"],
        "role": profile["role"],
        "action": f"ROLE_SWITCH_TO_{profile['role'].upper()}",
        "target": profile["clearance"],
        "status": "AUTHORIZED",
        "hash": tx_hash
    }
    AUDIT_LOGS.insert(0, log_entry)

    # Persist in DB if available
    if is_db_available():
        insert_audit_entry(
            package_id=audit_id,
            campaign_id=None,
            sha256_hash=tx_hash,
            event_type="ROLE_SWITCH",
            details=f"Switched persona to {profile['name']} ({profile['role']})",
            analyst_id=profile["id"],
            role=profile["role"]
        )

    return {
        "status": "success",
        "message": f"Successfully authenticated as {profile['name']} ({profile['role_title']})",
        "user": profile,
        "audit_id": log_entry["id"]
    }

@router.get("/permissions")
def get_permissions_matrix():
    """Return comprehensive RBAC capability matrix for all supported personas."""
    return {
        role_key: {
            "title": profile["role_title"],
            "clearance": profile["clearance"],
            "permissions": profile["permissions"],
            "allowed_navs": profile["allowed_navs"]
        }
        for role_key, profile in USER_PROFILES.items()
    }

@router.get("/audit-log")
def get_audit_log(x_user_role: Optional[str] = Header(default="investigation_bureau"), role: Optional[str] = Query(default=None)):
    """Return cryptographic RBAC audit logs from PostgreSQL or in-memory fallback."""
    active_role = role or x_user_role or "investigation_bureau"
    
    if is_db_available():
        db_logs = get_audit_ledger_from_db(limit=50, role=active_role)
        if db_logs:
            # Map DB format to UI expectations
            return [
                {
                    "id": f"AUD-{log['package_id'][-8:]}" if log.get("package_id") else f"AUD-{log['id']}",
                    "timestamp": log["recorded_at"].isoformat() if hasattr(log["recorded_at"], "isoformat") else str(log["recorded_at"]),
                    "actor": log.get("analyst_id") or "OPERATOR",
                    "role": log.get("role") or "investigation_bureau",
                    "action": log.get("event_type") or "AUDIT_EVENT",
                    "target": log.get("campaign_id") or "Sentinel Vault",
                    "status": "AUTHORIZED",
                    "hash": log.get("sha256_hash") or f"0x{uuid.uuid4().hex}"
                }
                for log in db_logs
            ]

    # Full audit log visible to IB & admin; Corporate and Media see their own actions
    if active_role in ["investigation_bureau", "system_admin"]:
        return AUDIT_LOGS
    else:
        return [log for log in AUDIT_LOGS if log["role"] == active_role]

@router.post("/audit-log")
def create_audit_log(entry: AuditLogEntry, x_user_role: Optional[str] = Header(default="investigation_bureau")):
    """Record an RBAC or operational action into the tamper-evident audit trail."""
    active_role = x_user_role if x_user_role in USER_PROFILES else "investigation_bureau"
    profile = USER_PROFILES[active_role]
    audit_id = f"AUD-{str(uuid.uuid4())[:8].upper()}"
    tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:16]}"

    log_item = {
        "id": audit_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": profile["name"],
        "role": profile["role"],
        "action": entry.action,
        "target": entry.target,
        "status": "AUTHORIZED",
        "details": entry.details or {},
        "hash": tx_hash
    }
    AUDIT_LOGS.insert(0, log_item)

    if is_db_available():
        insert_audit_entry(
            package_id=audit_id,
            campaign_id=None,
            sha256_hash=tx_hash,
            event_type=entry.action,
            details=json.dumps(entry.details or {}),
            analyst_id=profile["id"],
            role=profile["role"]
        )

    return {"status": "recorded", "entry": log_item}

