import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values

logger = logging.getLogger("bharat_shield.db")

# Load .env if present
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parents[1] / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

# Database connection settings
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "bharat_shield")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "postgres")

def get_connection(connect_timeout: int = 3):
    """Obtain a new connection to PostgreSQL."""
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        connect_timeout=connect_timeout
    )

def is_db_available() -> bool:
    """Fast check to verify if PostgreSQL is online and accepting connections."""
    try:
        conn = get_connection(connect_timeout=2)
        with conn.cursor() as cur:
            cur.execute("SELECT 1;")
        conn.close()
        return True
    except Exception as e:
        logger.debug(f"PostgreSQL connection check failed: {e}")
        return False

def setup_vector_extension():
    """Ensure pgvector extension is created on PostgreSQL."""
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            conn.commit()
        conn.close()
        logger.info("✓ pgvector extension verified.")
        return True
    except Exception as e:
        logger.warning(f"pgvector extension init warning: {e}")
        return False

def init_db():
    """Execute init.sql to configure schema, tables, and HNSW vector index."""
    init_sql_path = Path(__file__).resolve().parent / "init.sql"
    if not init_sql_path.exists():
        raise FileNotFoundError(f"init.sql not found at {init_sql_path}")
    
    with open(init_sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute(sql_content)
        conn.commit()
    conn.close()
    logger.info("✓ Database tables, schema, and HNSW vector indexes successfully initialized.")
    return True

# ---------------------------------------------------------------------------
# Tipline Signals & Vector Search Operations
# ---------------------------------------------------------------------------

def insert_signal(
    signal_id: str,
    source: str,
    raw_payload: str,
    detected_language: Optional[str] = "en",
    confidence_score: Optional[float] = 0.9,
    intent_classification: Optional[str] = "misinformation",
    severity: Optional[str] = "MEDIUM",
    normalized_translation: Optional[str] = None,
    campaign_id: Optional[str] = None,
    embedding: Optional[List[float]] = None
) -> bool:
    """Insert or update a signal with optional pgvector 384-dimensional embedding."""
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            query = """
                INSERT INTO tipline_signals (
                    id, source, raw_payload, detected_language,
                    confidence_score, intent_classification, severity,
                    normalized_translation, campaign_id, embedding
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    raw_payload = EXCLUDED.raw_payload,
                    detected_language = EXCLUDED.detected_language,
                    confidence_score = EXCLUDED.confidence_score,
                    intent_classification = EXCLUDED.intent_classification,
                    severity = EXCLUDED.severity,
                    normalized_translation = EXCLUDED.normalized_translation,
                    campaign_id = EXCLUDED.campaign_id,
                    embedding = EXCLUDED.embedding;
            """
            cur.execute(query, (
                signal_id,
                source,
                raw_payload,
                detected_language,
                confidence_score,
                intent_classification,
                severity,
                normalized_translation or raw_payload,
                campaign_id,
                embedding
            ))
            conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Failed to insert signal into Postgres: {e}")
        return False

def search_similar_signals(query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
    """
    Search for signals using Cosine Distance (<=> operator in pgvector).
    Returns signals ordered by semantic similarity (1 - cosine distance).
    """
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT id, source, raw_payload, detected_language, 
                       intent_classification, severity, campaign_id, received_at,
                       1 - (embedding <=> %s::vector) AS similarity_score
                FROM tipline_signals
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> %s::vector ASC
                LIMIT %s;
            """
            cur.execute(query, (query_embedding, query_embedding, limit))
            results = cur.fetchall()
        conn.close()
        return [dict(r) for r in results]
    except Exception as e:
        logger.error(f"Failed to search similar signals: {e}")
        return []

def get_recent_signals(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieve recent signals ordered by newest received timestamp."""
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, source, received_at, raw_payload, detected_language,
                       confidence_score, intent_classification, severity,
                       normalized_translation, campaign_id
                FROM tipline_signals
                ORDER BY received_at DESC
                LIMIT %s;
            """, (limit,))
            rows = cur.fetchall()
        conn.close()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error(f"Failed to get recent signals: {e}")
        return []

# ---------------------------------------------------------------------------
# Campaign Operations
# ---------------------------------------------------------------------------

def upsert_campaign(campaign: Dict[str, Any]) -> bool:
    """Insert or update campaign record in PostgreSQL."""
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            query = """
                INSERT INTO campaigns (
                    id, title, status, category, primary_language,
                    languages_detected, platforms, post_count,
                    overall_threat_min, overall_threat_max, threat_score,
                    confidence, coordination_score, ai_probability,
                    cross_platform_sync, target, summary, authorized_actions
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s
                )
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    status = EXCLUDED.status,
                    category = EXCLUDED.category,
                    post_count = EXCLUDED.post_count,
                    threat_score = EXCLUDED.threat_score,
                    coordination_score = EXCLUDED.coordination_score,
                    ai_probability = EXCLUDED.ai_probability,
                    cross_platform_sync = EXCLUDED.cross_platform_sync,
                    summary = EXCLUDED.summary;
            """
            cur.execute(query, (
                campaign.get("id"),
                campaign.get("title", "Untitled Campaign"),
                campaign.get("status", "active"),
                campaign.get("category", "General Misinformation"),
                campaign.get("primary_language", "en"),
                campaign.get("languages_detected", ["English"]),
                campaign.get("platforms", ["twitter"]),
                campaign.get("post_count", 0),
                campaign.get("overall_threat_min", 50),
                campaign.get("overall_threat_max", 90),
                campaign.get("threat_score", campaign.get("overall_threat_max", 75)),
                campaign.get("confidence", "HIGH"),
                campaign.get("coordination_score", 80),
                campaign.get("ai_probability", 75),
                campaign.get("cross_platform_sync", 85),
                campaign.get("target", "Public Infrastructure"),
                campaign.get("summary", ""),
                campaign.get("authorized_actions", [])
            ))
            conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Failed to upsert campaign: {e}")
        return False

def get_campaigns_from_db() -> List[Dict[str, Any]]:
    """Retrieve all campaigns from PostgreSQL."""
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, title, status, category, primary_language,
                       languages_detected, platforms, post_count,
                       overall_threat_min, overall_threat_max, threat_score,
                       confidence, coordination_score, ai_probability,
                       cross_platform_sync, target, summary, authorized_actions,
                       created_at
                FROM campaigns
                ORDER BY created_at DESC;
            """)
            rows = cur.fetchall()
        conn.close()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error(f"Failed to get campaigns from DB: {e}")
        return []

def get_campaign_by_id_from_db(campaign_id: str) -> Optional[Dict[str, Any]]:
    """Fetch single campaign by ID."""
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM campaigns WHERE LOWER(id) = LOWER(%s);", (campaign_id,))
            row = cur.fetchone()
        conn.close()
        return dict(row) if row else None
    except Exception as e:
        logger.error(f"Failed to get campaign {campaign_id}: {e}")
        return None

# ---------------------------------------------------------------------------
# Audit Ledger Operations
# ---------------------------------------------------------------------------

def insert_audit_entry(
    package_id: str,
    campaign_id: Optional[str],
    sha256_hash: str,
    event_type: str,
    details: str,
    analyst_id: Optional[str] = "SYSTEM",
    role: Optional[str] = "investigation_bureau"
) -> bool:
    """Log an immutable audit trail entry into PostgreSQL."""
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO audit_ledger (
                    package_id, campaign_id, sha256_hash,
                    event_type, details, analyst_id, role
                ) VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (package_id, campaign_id, sha256_hash, event_type, details, analyst_id, role))
            conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Failed to insert audit entry into DB: {e}")
        return False

def get_audit_ledger_from_db(limit: int = 50, role: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve audit ledger logs with optional role partition."""
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if role and role != "investigation_bureau" and role != "system_admin":
                cur.execute("""
                    SELECT id, package_id, campaign_id, sha256_hash,
                           event_type, details, analyst_id, role, recorded_at
                    FROM audit_ledger
                    WHERE role = %s
                    ORDER BY recorded_at DESC
                    LIMIT %s;
                """, (role, limit))
            else:
                cur.execute("""
                    SELECT id, package_id, campaign_id, sha256_hash,
                           event_type, details, analyst_id, role, recorded_at
                    FROM audit_ledger
                    ORDER BY recorded_at DESC
                    LIMIT %s;
                """, (limit,))
            rows = cur.fetchall()
        conn.close()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error(f"Failed to get audit ledger from DB: {e}")
        return []

# ---------------------------------------------------------------------------
# Overview Aggregations
# ---------------------------------------------------------------------------

def get_db_overview_stats() -> Optional[Dict[str, Any]]:
    """Calculate aggregated telemetry stats from PostgreSQL."""
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT COUNT(*) AS total_signals FROM tipline_signals;")
            total_signals = cur.fetchone()["total_signals"]

            cur.execute("SELECT COUNT(*) AS total_campaigns FROM campaigns;")
            total_campaigns = cur.fetchone()["total_campaigns"]

            cur.execute("SELECT COUNT(*) AS high_risk_campaigns FROM campaigns WHERE overall_threat_max >= 80 OR threat_score >= 80;")
            high_risk = cur.fetchone()["high_risk_campaigns"]

            cur.execute("SELECT source, COUNT(*) AS count FROM tipline_signals GROUP BY source;")
            sources = cur.fetchall()
        conn.close()
        return {
            "total_signals": total_signals,
            "total_campaigns": total_campaigns,
            "high_risk_campaigns": high_risk,
            "sources": [dict(s) for s in sources]
        }
    except Exception as e:
        logger.debug(f"DB overview aggregation skipped: {e}")
        return None

if __name__ == "__main__":
    print(f"Testing connection to PostgreSQL at {DB_HOST}:{DB_PORT}/{DB_NAME}...")
    if is_db_available():
        print("✓ Connected to PostgreSQL!")
        setup_vector_extension()
        init_db()
    else:
        print("⚠ PostgreSQL is currently offline. Sentinel will use high-speed in-memory fallbacks.")
