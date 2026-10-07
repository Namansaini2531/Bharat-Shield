"""
Database Seeder Script for Bharat-Shield-Sentinel
Loads synthetic dataset (data/synthetic/campaign_data.json) into PostgreSQL
with 384-dimensional multilingual embeddings.
"""

import sys
import json
from pathlib import Path

# Add root directory to sys.path
BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))

from database.db import get_connection, init_db
from ai.embeddings import MultilingualEmbedder

DATASET_PATH = BASE_DIR / "data" / "synthetic" / "campaign_data.json"

def seed_database():
    print("1. Initializing schema and vector extensions...")
    init_db()

    if not DATASET_PATH.exists():
        print(f"Error: Dataset file not found at {DATASET_PATH}")
        return

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        posts = json.load(f)

    print(f"2. Loaded {len(posts)} posts from {DATASET_PATH.name}.")

    conn = get_connection()
    with conn.cursor() as cur:
        # Seed predefined campaigns
        campaigns_data = [
            ("CAMPAIGN_007", "Operation Echo: Telecom Disruption Hoax", "active", "hi-Latn", ["Hindi", "Hinglish", "Tamil", "English", "Bengali"], ["twitter", "telegram", "whatsapp_tipline"], 25, 80, 95, 96, 94),
            ("CAMPAIGN_011", "Operation Currency Panic: Banking & 500 Note Hoax", "active", "hi", ["Hindi", "Hinglish", "English"], ["twitter", "telegram", "facebook", "whatsapp_tipline"], 20, 75, 92, 88, 91),
            ("CAMPAIGN_003", "Organic Friendly News: Cricket World Cup Victory", "resolved", "en", ["English", "Hindi"], ["twitter", "news"], 15, 5, 12, 10, 8),
            ("CAMPAIGN_019", "Defense Logistics & Border Movement Rumors", "monitoring", "en", ["English", "Urdu"], ["twitter", "telegram"], 10, 70, 88, 85, 86),
            ("CAMPAIGN_022", "Public Health & Vaccine Disinformation Swarm", "active", "hi", ["Hindi", "English"], ["whatsapp_tipline", "facebook"], 5, 65, 80, 78, 82)
        ]

        for cmp in campaigns_data:
            cur.execute("""
                INSERT INTO campaigns (id, title, status, primary_language, languages_detected, platforms, post_count, overall_threat_min, overall_threat_max, coordination_score, ai_probability)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    status = EXCLUDED.status,
                    post_count = EXCLUDED.post_count;
            """, cmp)

        print("✓ Campaigns inserted/updated.")

        # Seed Tipline Signals with Embeddings
        print("3. Generating embeddings & inserting signals into PostgreSQL...")
        for p in posts:
            p_id = p.get("id")
            source = p.get("platform", "web")
            raw_text = p.get("text", "")
            lang = p.get("language", "en")
            camp_id = p.get("campaign_cluster")
            
            # Compute 384-d vector embedding
            embedding = MultilingualEmbedder.encode(raw_text)

            cur.execute("""
                INSERT INTO tipline_signals (id, source, raw_payload, detected_language, intent_classification, severity, campaign_id, embedding)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    raw_payload = EXCLUDED.raw_payload,
                    embedding = EXCLUDED.embedding;
            """, (
                p_id,
                source,
                raw_text,
                lang,
                "disinformation" if "Hoax" in str(camp_id) or camp_id in ["CAMPAIGN_007", "CAMPAIGN_011"] else "organic",
                "HIGH" if camp_id in ["CAMPAIGN_007", "CAMPAIGN_011"] else "LOW",
                camp_id if camp_id in ["CAMPAIGN_007", "CAMPAIGN_011", "CAMPAIGN_003", "CAMPAIGN_019", "CAMPAIGN_022"] else None,
                embedding
            ))

        conn.commit()
    conn.close()
    print("✓ Successfully seeded all tipline signals and vector embeddings into database!")

if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print(f"Error seeding database: {e}")
        print("Make sure PostgreSQL is running (e.g., via `docker compose up -d postgres`)")
