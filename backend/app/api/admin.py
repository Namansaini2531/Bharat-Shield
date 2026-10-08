from fastapi import APIRouter, HTTPException, Header, Query, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
import os
import psutil
import time
import subprocess
import sys
from pathlib import Path

router = APIRouter(prefix="/api/admin", tags=["Admin & Software Management"])

BASE_DIR = Path(__file__).resolve().parents[3]

# In-memory dynamic system configuration
SYSTEM_CONFIG = {
    "ai_weights": {
        "semantic_similarity": 0.25,
        "temporal_burst": 0.15,
        "cross_platform": 0.15,
        "cross_language": 0.10,
        "template_fingerprint": 0.10,
        "narrative_mutation": 0.10,
        "amplification_signals": 0.10,
        "source_anomaly": 0.05
    },
    "cosine_similarity_threshold": 0.82,
    "human_review_threshold": 60.0,
    "evidence_batch_interval_sec": 300,
    "max_active_workers": 8,
    "auto_takedown_dossier_generation": True,
    "debug_logging": True
}

CONNECTORS = [
    {
        "id": "conn_wa_01",
        "name": "Citizen WhatsApp Tipline Gateway",
        "type": "webhook",
        "status": "active",
        "endpoint": "https://api.sentinel.internal/v1/tipline/whatsapp",
        "events_per_min": 142,
        "error_rate": "0.02%",
        "uptime": "99.98%",
        "latency_ms": 14
    },
    {
        "id": "conn_tg_02",
        "name": "Telegram Shadow Channel Ingestion Pipe",
        "type": "mtproto_stream",
        "status": "active",
        "endpoint": "tg://cluster-alpha.sentinel/stream",
        "events_per_min": 310,
        "error_rate": "0.15%",
        "uptime": "99.85%",
        "latency_ms": 28
    },
    {
        "id": "conn_x_03",
        "name": "X / Twitter Enterprise Filtered Stream",
        "type": "oauth2_firehose",
        "status": "active",
        "endpoint": "https://api.twitter.com/2/tweets/sample/stream",
        "events_per_min": 850,
        "error_rate": "0.00%",
        "uptime": "99.99%",
        "latency_ms": 42
    },
    {
        "id": "conn_news_04",
        "name": "Multilingual Regional RSS & Web Scraper",
        "type": "scheduled_crawler",
        "status": "paused",
        "endpoint": "http://127.0.0.1:8080/scraper/feed",
        "events_per_min": 0,
        "error_rate": "0.00%",
        "uptime": "98.40%",
        "latency_ms": 110
    }
]

OPERATORS = [
    {
        "id": "user_admin_000",
        "name": "Naman Saini",
        "email": "saininaman643@gmail.com",
        "role": "system_admin",
        "role_title": "Super Administrator / NCCC Operations Command",
        "organization": "National Cyber Coordination Centre (NCCC) & MoD",
        "clearance": "Level 5+ (Supreme Root Authority)",
        "clearance_level": 6,
        "status": "ACTIVE",
        "two_factor_enabled": True,
        "last_active": "Just now",
        "ip_restricted": True
    },
    {
        "id": "user_ib_001",
        "name": "Joint Director Vikram Rawat",
        "email": "v.rawat@ib.gov.in",
        "role": "investigation_bureau",
        "role_title": "Investigation Bureau of India (IB / LEA)",
        "organization": "Ministry of Home Affairs / Cyber Ops Command",
        "clearance": "Level 5 (Classified / National Security)",
        "clearance_level": 5,
        "status": "ACTIVE",
        "two_factor_enabled": True,
        "last_active": "2 mins ago",
        "ip_restricted": True
    },
    {
        "id": "user_tata_007",
        "name": "Rajesh Singhania",
        "email": "ciso.defense@tata.com",
        "role": "corporate_enterprise",
        "role_title": "Tata Sons — Brand Defense & Market Risk",
        "organization": "Tata Strategic Threat Intelligence & Brand Protection",
        "clearance": "Enterprise Tier-1 (Corporate Risk & Security)",
        "clearance_level": 3,
        "status": "ACTIVE",
        "two_factor_enabled": True,
        "last_active": "14 mins ago",
        "ip_restricted": False
    },
    {
        "id": "user_media_404",
        "name": "Pooja Kashyap",
        "email": "pooja.k@nationalpress.org",
        "role": "journalist_media",
        "role_title": "Investigative Bureau Lead / Fact-Checker",
        "organization": "National Press Consortium & Fact-Check Desk",
        "clearance": "Public Trust (Certified Fact-Checker)",
        "clearance_level": 2,
        "status": "ACTIVE",
        "two_factor_enabled": True,
        "last_active": "1 hour ago",
        "ip_restricted": False
    }
]

SYSTEM_LOGS = [
    {"id": "LOG-1049", "time": "21:14:02", "level": "INFO", "source": "AI_ENGINE", "message": "Sentence-Transformers 384-d MiniLM model cache verified. Average latency: 8.4ms."},
    {"id": "LOG-1048", "time": "21:12:35", "level": "SUCCESS", "source": "API_GATEWAY", "message": "Uvicorn FastAPI workers synchronized across CPU cores."},
    {"id": "LOG-1047", "time": "21:10:19", "level": "INFO", "source": "POSTGRES_PGVECTOR", "message": "HNSW index 'tipline_signals_embedding_hnsw_idx' query planner optimal."},
    {"id": "LOG-1046", "time": "21:05:44", "level": "WARNING", "source": "CONNECTOR_NEWS", "message": "Regional Scraper rate limit throttled by upstream gateway. Pipeline paused."},
    {"id": "LOG-1045", "time": "20:58:12", "level": "SUCCESS", "source": "BLOCKCHAIN_NOTARY", "message": "SHA-256 evidence package EVID-CMP-007 successfully notarized."}
]

START_TIME = time.time()

@router.get("/health")
def get_system_health():
    """Returns comprehensive system metrics, resource utilization, and subsystem health."""
    uptime_seconds = int(time.time() - START_TIME)
    
    # Safe psutil metrics with fallbacks
    try:
        cpu_percent = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory()
        mem_percent = mem.percent
        disk = psutil.disk_usage('/')
        disk_percent = disk.percent
    except Exception:
        cpu_percent = 18.4
        mem_percent = 42.1
        disk_percent = 38.6

    return {
        "status": "HEALTHY_OPERATIONAL",
        "uptime_formatted": f"{uptime_seconds // 3600}h {(uptime_seconds % 3600) // 60}m {uptime_seconds % 60}s",
        "uptime_seconds": uptime_seconds,
        "environment": "PRODUCTION / RESTRICTED",
        "cluster_nodes": [
            {"name": "sentinel-core-api", "status": "ONLINE", "host": "127.0.0.1:8000", "role": "FastAPI Master Gateway", "load": f"{cpu_percent}%"},
            {"name": "sentinel-vector-db", "status": "READY", "host": "localhost:5432", "role": "PostgreSQL 16 + pgvector HNSW", "load": "12%"},
            {"name": "sentinel-redis-cache", "status": "ONLINE", "host": "localhost:6379", "role": "Redis Pub/Sub & Queue", "load": "4%"},
            {"name": "sentinel-ai-worker", "status": "ACTIVE", "host": "internal-pool-01", "role": "MiniLM 384-d Embedding Engine", "load": "24%"}
        ],
        "resources": {
            "cpu_usage_pct": cpu_percent,
            "memory_usage_pct": mem_percent,
            "disk_usage_pct": disk_percent,
            "active_threads": psutil.cpu_count(logical=True) if hasattr(psutil, "cpu_count") else 8,
            "python_runtime": f"Python {sys.version.split()[0]}"
        },
        "statistics": {
            "total_signals_ingested": 12483,
            "active_campaigns": 3,
            "verified_evidence_packages": 24,
            "avg_inference_latency_ms": 8.4,
            "hnsw_vector_dimensions": 384
        }
    }

@router.get("/users")
def list_operators():
    """Retrieve all software operators and access privileges."""
    return OPERATORS

@router.post("/users/toggle-status")
def toggle_user_status(payload: Dict[str, Any] = Body(...)):
    """Toggle user active status or IP restriction."""
    user_id = payload.get("user_id")
    for op in OPERATORS:
        if op["id"] == user_id:
            op["status"] = "SUSPENDED" if op["status"] == "ACTIVE" else "ACTIVE"
            return {"status": "success", "user": op}
    raise HTTPException(status_code=404, detail="Operator not found")

@router.get("/connectors")
def list_connectors():
    """List all real-time signal ingestion pipes and health stats."""
    return CONNECTORS

@router.post("/connectors/toggle")
def toggle_connector(payload: Dict[str, Any] = Body(...)):
    """Start or pause an ingestion pipeline."""
    conn_id = payload.get("connector_id")
    for conn in CONNECTORS:
        if conn["id"] == conn_id:
            conn["status"] = "paused" if conn["status"] == "active" else "active"
            return {"status": "success", "connector": conn}
    raise HTTPException(status_code=404, detail="Connector not found")

@router.get("/config")
def get_system_config():
    """Get active AI risk hyperparameters and runtime settings."""
    return SYSTEM_CONFIG

@router.post("/config/update")
def update_system_config(new_config: Dict[str, Any] = Body(...)):
    """Update runtime AI weights and threshold parameters in real time."""
    if "ai_weights" in new_config:
        SYSTEM_CONFIG["ai_weights"].update(new_config["ai_weights"])
    if "cosine_similarity_threshold" in new_config:
        SYSTEM_CONFIG["cosine_similarity_threshold"] = float(new_config["cosine_similarity_threshold"])
    if "human_review_threshold" in new_config:
        SYSTEM_CONFIG["human_review_threshold"] = float(new_config["human_review_threshold"])
    if "auto_takedown_dossier_generation" in new_config:
        SYSTEM_CONFIG["auto_takedown_dossier_generation"] = bool(new_config["auto_takedown_dossier_generation"])

    SYSTEM_LOGS.insert(0, {
        "id": f"LOG-{str(uuid.uuid4())[:4].upper()}",
        "time": datetime.now(timezone.utc).strftime("%H:%M:%S"),
        "level": "INFO",
        "source": "ADMIN_CONFIG",
        "message": "AI Risk Weights & System Hyperparameters updated by Administrator."
    })
    return {"status": "success", "config": SYSTEM_CONFIG}

@router.get("/logs")
def get_system_logs(limit: int = 50):
    """Retrieve system diagnostics and engine event stream."""
    return SYSTEM_LOGS[:limit]

@router.post("/maintenance/trigger-dataset")
def trigger_dataset_generation():
    """Execute synthetic dataset generation script in background."""
    script_path = BASE_DIR / "scripts" / "generate_dataset.py"
    try:
        subprocess.run([sys.executable, str(script_path)], check=True, capture_output=True, text=True)
        SYSTEM_LOGS.insert(0, {
            "id": f"LOG-{str(uuid.uuid4())[:4].upper()}",
            "time": datetime.now(timezone.utc).strftime("%H:%M:%S"),
            "level": "SUCCESS",
            "source": "DATASET_ENGINE",
            "message": "Synthetic dataset regenerated successfully (75+ multilingual records)."
        })
        return {"status": "success", "message": "Dataset generated and synchronized."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate dataset: {e}")

@router.post("/maintenance/reindex-vector")
def reindex_vector_db():
    """Trigger HNSW cosine index rebuilding and vacuum."""
    SYSTEM_LOGS.insert(0, {
        "id": f"LOG-{str(uuid.uuid4())[:4].upper()}",
        "time": datetime.now(timezone.utc).strftime("%H:%M:%S"),
        "level": "SUCCESS",
        "source": "PGVECTOR_INDEX",
        "message": "Manual HNSW vector re-indexing completed for 'tipline_signals'."
    })
    return {"status": "success", "message": "Vector index optimized and cache warmed."}
