"""
High-Performance 20,000-Record Reddit Intelligence Dataset Generator for BHARAT-SHIELD.
Generates an enterprise-scale dataset (20,000 records) simulating Indian subreddit discourse,
coordinated information operations (IO), botnet amplification swarms, multilingual mutations,
and financial/infrastructure threat narratives.

Output Formats:
- JSONL (JSON Lines): exactly 20,000 lines (1 JSON record per line)
- JSON (Array): 20,000 objects
- Optional: Direct PostgreSQL batch ingestion with pgvector embeddings
"""

import os
import sys
import time
import json
import uuid
import random
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Dict, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from database.db import is_db_available, get_connection

SUBREDDITS = [
    "india",
    "IndianDefense",
    "IndianStockMarket",
    "indiadiscussion",
    "unitedstatesofindia",
    "delhi",
    "mumbai",
    "bangalore",
    "CryptoIndia",
    "punjab",
    "kolkata",
    "hyderabad",
    "chennai",
    "technews_in",
    "isro_discussion"
]

CAMPAIGN_ARCHETYPES = [
    {
        "cluster_id": "CMP-ECHO-007",
        "category": "Telecom & Critical Grid Sabotage",
        "base_threat": 88,
        "languages": ["en", "hi", "hi-Latn", "bn", "ta"],
        "titles": [
            "URGENT: Nationwide internet and 5G grid blackout ordered for next 48 hours?",
            "Seeing multiple WhatsApp forwards claiming telecom servers shutting down tonight.",
            "BREAKING: DoT secret circular ordering mobile data suspension in major metros.",
            "सरकार कल पूरे देश में इंटरनेट बंद करने वाली है। तुरंत सबको शेयर करें।",
            "Sarkar kal internet band kar rahi hai. Jio aur Airtel dono pe data down hoga.",
            "Emergency Notice: Major power grid frequency collapse reported across northern states.",
            "Telecom tower fiber optic link failure causing massive internet outage across NCR."
        ],
        "bodies": [
            "Forwarded from a reliable internal circle: All telecom operators have been instructed to throttle data bandwidth starting midnight tonight due to emergency security drills. ATMs and UPI will be impacted.",
            "Multiple sources on Telegram dark channels are claiming that state-wide communication blackouts will begin at 00:00 hrs. Please withdraw emergency cash immediately.",
            "कृपया ध्यान दें: दूरसंचार विभाग ने सभी इंटरनेट प्रदाताओं को आपातकालीन शटडाउन का आदेश जारी किया है। सभी समूहों में भेजें।",
            "Bhai log, sabhi official groups me ye notice circulate ho raha hai. Data pack khatam hone se pehle zaroori kaam nipta lo."
        ]
    },
    {
        "cluster_id": "CMP-CURRENCY-011",
        "category": "Banking & Currency Panic Swarm",
        "base_threat": 84,
        "languages": ["en", "hi", "hi-Latn", "gu", "mr"],
        "titles": [
            "RBI emergency notification: Are ₹500 currency notes being demonetized again?",
            "Bank ATMs shutting down for 72 hours starting tonight due to central currency audit.",
            "सावधान: रिज़र्व बैंक ने ₹500 के नोटों की मान्यता रद्द करने की घोषणा की?",
            "Urgent advisory circulating on fin-influencer groups regarding bank deposit freeze.",
            "Sabhi 500 ke note jaldi exchange karlo, kal se banks accept nahi karenge.",
            "Deepfake voice clip of RBI Governor warning of commercial bank moratorium."
        ],
        "bodies": [
            "An unverified audio file claiming to be an internal briefing from the central bank states that existing 500-rupee bills will cease to be legal tender after midnight. Massive crowds seen at local ATMs.",
            "Viral forward citing Section 24 of RBI Act claiming nationwide ATM withdrawal caps of Rs 2000 per day starting tomorrow.",
            "व्हाट्सएप पर यह वॉयस नोट तेजी से फैल रहा है कि कल से बैंक लेन-देन पूरी तरह बंद रहेगा। तुरंत अपने परिचितों को सतर्क करें।",
            "Fin-Telegram channels are pushing panic orders asking retail investors to dump fixed deposits into offshore crypto wallets."
        ]
    },
    {
        "cluster_id": "CMP-MARKET-009",
        "category": "Coordinated Short-Seller Bear Raid",
        "base_threat": 91,
        "languages": ["en", "gu", "hi"],
        "titles": [
            "Forged SEBI order alleging custom license revocation for Adani Ports & SEZ.",
            "Fabricated DRI inquiry documents circulating on shadow stock trading groups.",
            "Breaking: Massive ESG violation rating downgrade leaked ahead of market open.",
            "Adani Green Energy solar export shipments reportedly detained at European ports.",
            "Short-seller bot network deploying synchronized sell signals across Stocktwits & Reddit."
        ],
        "bodies": [
            "Prior to pre-market trading, forged PDF circulars carrying fraudulent regulatory seals were broadcast on multiple private trading Telegram rooms claiming export terminal cancellations.",
            "Coordinated accounts created in the last 48 hours are mass-spamming Reddit stock forums with allegations of sovereign debt defaults to trigger panic selling in large-cap indices.",
            "Fake technical analysis reports alleging undisclosed debt covenants are being amplified by automated social bot swarms."
        ]
    },
    {
        "cluster_id": "CMP-BORDER-014",
        "category": "Cross-Border Cyber & Proxy Operations",
        "base_threat": 89,
        "languages": ["en", "hi", "ur"],
        "titles": [
            "Recycled 2020 combat footage republished claiming fresh border skirmishes in Poonch.",
            "Fabricated military movement advisory posted by coordinated proxy sockpuppet accounts.",
            "Deceptive OSINT thread claiming defense satellite communications jammed.",
            "Synthetic audio simulating senior army commander field orders circulated on Twitter/X.",
            "Deepfake video claiming northern sector airspace closed to civilian aviation."
        ],
        "bodies": [
            "Analysis of video metadata reveals clips from previous regional conflicts being captioned with current dates to generate panic in border transit corridors.",
            "Swarm of coordinated accounts displaying identical temporal posting bursts and cross-platform synchronization targeting defense logistics discussions."
        ]
    },
    {
        "cluster_id": "CMP-ORGANIC-001",
        "category": "Organic Civic & Cultural Discourse (Benign)",
        "base_threat": 12,
        "languages": ["en", "hi", "ta", "kn", "te"],
        "titles": [
            "Incredible achievement: ISRO successfully launches next-generation solar satellite!",
            "What a thrilling cricket match! Team India secures historic series victory.",
            "Bengaluru tech park introduces new automated metro feeder bus routes.",
            "Discussion: Best practices for cybersecurity hygiene and two-factor authentication.",
            "Monsoon weather forecast update for coastal Maharashtra and Goa.",
            "Delhi Metro announces extended operating hours for upcoming festival season."
        ],
        "bodies": [
            "Congratulations to all scientists and engineers who worked tirelessly on this landmark mission. A proud moment for the entire nation!",
            "Great initiative by municipal authorities to improve last-mile public transit connectivity.",
            "Reminder to always verify sources through official press bureaus before forwarding sensational claims."
        ]
    }
]

BOT_USERNAME_PREFIXES = [
    "intel_hawk", "cyber_sentinel", "desi_patriot", "truth_seeker", "market_watcher",
    "news_relay", "crypto_bull", "shadow_scout", "delhi_insider", "mumbai_pulse",
    "bharat_voice", "fact_guard", "quant_trader", "alpha_analyst", "civic_radar"
]

def generate_reddit_record(record_idx: int, start_time: datetime) -> Dict[str, Any]:
    """Generate a single realistic Reddit intelligence record."""
    archetype = random.choices(
        CAMPAIGN_ARCHETYPES,
        weights=[30, 25, 20, 15, 10],  # 90% malign/threat campaigns, 10% organic baseline
        k=1
    )[0]

    sub = random.choice(SUBREDDITS)
    lang = random.choice(archetype["languages"])
    title_tmpl = random.choice(archetype["titles"])
    body_tmpl = random.choice(archetype["bodies"])
    
    # Add variation and entropy
    has_variant = random.random() > 0.4
    title = f"{title_tmpl} (Report #{record_idx})" if has_variant else title_tmpl
    body = f"{body_tmpl}\n\n[Discussion Thread ID: {uuid.uuid4().hex[:6].upper()}]"

    # Time simulation (spread across past 14 days)
    delta_minutes = random.randint(0, 14 * 24 * 60)
    record_dt = start_time - timedelta(minutes=delta_minutes)

    # Engagement metrics
    score = random.randint(5, 1450)
    upvote_ratio = round(random.uniform(0.65, 0.98), 2)
    num_comments = int(score * random.uniform(0.15, 0.45))
    author = f"u/{random.choice(BOT_USERNAME_PREFIXES)}_{random.randint(100, 9999)}"

    # Risk & AI metrics
    is_malign = archetype["cluster_id"] != "CMP-ORGANIC-001"
    threat_score = max(5, min(98, archetype["base_threat"] + random.randint(-8, 8))) if is_malign else random.randint(5, 25)
    ai_prob = random.randint(65, 95) if is_malign else random.randint(5, 30)
    coordination_score = random.randint(70, 98) if is_malign else random.randint(10, 35)

    media_type = random.choice(["text", "text", "image", "video"])
    media_url = f"https://i.redd.it/post_asset_{uuid.uuid4().hex[:8]}.png" if media_type == "image" else (
        f"https://v.redd.it/clip_{uuid.uuid4().hex[:8]}.mp4" if media_type == "video" else ""
    )

    sha256_hash = f"sha256:{uuid.uuid4().hex}{uuid.uuid4().hex[:8]}"

    return {
        "id": f"REDDIT-P{record_idx:06d}",
        "platform": "reddit",
        "subreddit": sub,
        "author": author,
        "title": title,
        "text": f"{title}\n\n{body}",
        "url": media_url or f"https://reddit.com/r/{sub}/comments/{uuid.uuid4().hex[:7]}",
        "media_type": media_type,
        "score": score,
        "upvote_ratio": upvote_ratio,
        "num_comments": num_comments,
        "timestamp": record_dt.isoformat(),
        "language": lang,
        "campaign_cluster": archetype["cluster_id"],
        "category": archetype["category"],
        "threat_score": threat_score,
        "threat_level": "CRITICAL" if threat_score >= 80 else ("HIGH" if threat_score >= 60 else "MEDIUM" if threat_score >= 35 else "LOW"),
        "confidence": "HIGH" if score > 100 else "MEDIUM",
        "coordination_score": coordination_score,
        "ai_probability": ai_prob,
        "evidence_sha256": sha256_hash
    }

def generate_20k_dataset(
    total_count: int = 20000,
    output_jsonl: str = "data/raw/reddit_20k_dataset.jsonl",
    output_json: Optional[str] = "data/raw/reddit_20k_dataset.json",
    save_to_db: bool = False
):
    print("=" * 75)
    print(f"🚀 GENERATING {total_count:,} RECORDS REDDIT INTELLIGENCE DATASET")
    print("=" * 75)
    start_time = datetime.now(timezone.utc)
    t0 = time.time()

    jsonl_path = PROJECT_ROOT / output_jsonl
    jsonl_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Writing {total_count:,} lines to JSONL: {jsonl_path}...")
    
    all_records = []
    line_count = 0

    with open(jsonl_path, "w", encoding="utf-8") as f_jsonl:
        for i in range(1, total_count + 1):
            rec = generate_reddit_record(i, start_time)
            f_jsonl.write(json.dumps(rec, ensure_ascii=False) + "\n")
            line_count += 1

            if output_json:
                all_records.append(rec)

            if i % 5000 == 0 or i == total_count:
                elapsed = time.time() - t0
                rate = i / max(elapsed, 0.001)
                print(f"  -> Generated {i:,}/{total_count:,} lines ({rate:.0f} recs/sec)...")

    file_size_mb = jsonl_path.stat().st_size / (1024 * 1024)
    print(f"\n✓ Successfully created JSONL dataset with {line_count:,} lines ({file_size_mb:.2f} MB)!")

    # Write JSON array export if requested
    if output_json and all_records:
        json_path = PROJECT_ROOT / output_json
        print(f"Writing full JSON array to: {json_path}...")
        with open(json_path, "w", encoding="utf-8") as f_json:
            json.dump(all_records, f_json, indent=2, ensure_ascii=False)
        json_size_mb = json_path.stat().st_size / (1024 * 1024)
        print(f"✓ Created JSON array export ({json_size_mb:.2f} MB)!")

    # Ingest into PostgreSQL if requested
    if save_to_db:
        if is_db_available():
            print("\nIngesting batch records into PostgreSQL (pgvector tipline_signals)...")
            _batch_insert_to_postgres(all_records)
        else:
            print("\n⚠ PostgreSQL is offline. Skipping database batch ingestion.")

    total_elapsed = time.time() - t0
    print("\n" + "=" * 75)
    print(f"✅ COMPLETED IN {total_elapsed:.2f}s | TOTAL DATASET: {total_count:,} LINES")
    print(f"📁 JSONL Path: {jsonl_path}")
    if output_json:
        print(f"📁 JSON Path:  {PROJECT_ROOT / output_json}")
    print("=" * 75)

def _batch_insert_to_postgres(records: List[Dict[str, Any]], batch_size: int = 1000):
    """Batch insert records into PostgreSQL using psycopg2 execute_values."""
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            from psycopg2.extras import execute_values
            
            query = """
                INSERT INTO tipline_signals (
                    id, source, raw_payload, detected_language,
                    confidence_score, intent_classification, severity,
                    normalized_translation, campaign_id
                ) VALUES %s
                ON CONFLICT (id) DO NOTHING;
            """
            
            tuples = [
                (
                    r["id"],
                    f"reddit_r_{r['subreddit']}",
                    r["text"],
                    r["language"],
                    0.95 if r["confidence"] == "HIGH" else 0.75,
                    r["category"],
                    r["threat_level"],
                    r["text"],
                    r["campaign_cluster"] if r["campaign_cluster"] != "CMP-ORGANIC-001" else None
                )
                for r in records
            ]

            for idx in range(0, len(tuples), batch_size):
                chunk = tuples[idx:idx + batch_size]
                execute_values(cur, query, chunk)
                conn.commit()
                print(f"  ✓ Ingested batch {idx + len(chunk):,}/{len(tuples):,} into PostgreSQL...")

        conn.close()
        print("✓ All records successfully committed to PostgreSQL database!")
    except Exception as e:
        print(f"PostgreSQL batch ingest error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Generate 20,000 Lines Reddit Intelligence Dataset")
    parser.add_argument("--count", type=int, default=20000, help="Total number of records/lines to generate (default: 20000)")
    parser.add_argument("--jsonl", type=str, default="data/raw/reddit_20k_dataset.jsonl", help="Output JSONL filepath")
    parser.add_argument("--json", type=str, default="data/raw/reddit_20k_dataset.json", help="Output JSON filepath")
    parser.add_argument("--save-to-db", action="store_true", help="Batch ingest into PostgreSQL tipline_signals")

    args = parser.parse_args()
    generate_20k_dataset(
        total_count=args.count,
        output_jsonl=args.jsonl,
        output_json=args.json,
        save_to_db=args.save_to_db
    )

if __name__ == "__main__":
    main()
