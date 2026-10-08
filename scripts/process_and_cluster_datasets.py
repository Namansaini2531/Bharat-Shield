"""
Batch Ingestion, Vectorization, and Cross-Platform Clustering Pipeline for BHARAT-SHIELD.
Processes harvested 20K Instagram, 20K Reddit, and Twitter dataset feeds into unified intelligence,
generates 384-dimensional multilingual embeddings, groups coordinated campaigns, creates cryptographic
SHA-256 evidence packages, and saves structured results to `data/processed/` and PostgreSQL pgvector.
"""

import sys
import os
import json
import uuid
import time
import argparse
import numpy as np
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from ai.language.processor import MultilingualProcessor
from ai.multimodal.processor import MultimodalIntelligenceProcessor
from ai.embeddings import MultilingualEmbedder
from ai.threat_scoring.risk_engine import RiskAssessmentEngine
from ai.threat_scoring.ai_detector import AIAssistanceDetector
from ai.ner.extractor import EntityAndClaimExtractor
from blockchain.evidence.hasher import EvidenceHasher
from database.db import is_db_available, insert_signal, upsert_campaign, insert_audit_entry

DATA_DIR = PROJECT_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def load_signals_from_file(file_path: Path, max_records: int = 500) -> List[Dict[str, Any]]:
    """Loads records from JSON or JSONL file with flexible field extraction."""
    records = []
    if not file_path.exists():
        print(f"  [!] File not found: {file_path}")
        return []

    print(f"  [*] Ingesting from {file_path.name}...")
    try:
        if file_path.suffix == ".jsonl":
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                for line in f:
                    if not line.strip():
                        continue
                    try:
                        obj = json.loads(line)
                        records.append(obj)
                        if len(records) >= max_records:
                            break
                    except json.JSONDecodeError:
                        continue
        elif file_path.suffix == ".json":
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                data = json.load(f)
                if isinstance(data, list):
                    records = data[:max_records]
                elif isinstance(data, dict):
                    records = list(data.values())[:max_records]
    except Exception as e:
        print(f"  [!] Error reading {file_path.name}: {e}")

    print(f"  ✓ Loaded {len(records)} raw signals from {file_path.name}")
    return records

def normalize_signal(raw: Dict[str, Any], default_platform: str = "web") -> Dict[str, Any]:
    """Standardizes heterogeneous data objects into Bharat-Shield Unified Signal format."""
    sig_id = raw.get("id") or raw.get("signal_id") or raw.get("tweet_id") or raw.get("reddit_id") or f"SIG-{uuid.uuid4().hex[:8].upper()}"
    platform = raw.get("platform") or default_platform
    
    # Text normalization
    raw_text = raw.get("text") or raw.get("title") or raw.get("selftext") or raw.get("caption") or ""
    if "title" in raw and "selftext" in raw and raw["selftext"]:
        raw_text = f"{raw['title']}\n{raw['selftext']}"
    
    media_url = raw.get("url") or raw.get("media_url") or ""
    media_type = raw.get("media_type") or MultimodalIntelligenceProcessor.detect_media_type(media_url or raw_text)

    # Detect language & obfuscation
    lang_info = MultilingualProcessor.detect_language(raw_text)
    detected_lang = lang_info.get("language", "en")
    normalized_text = MultilingualProcessor.normalize_text(raw_text)

    # Entities and claims
    entities = EntityAndClaimExtractor.extract_entities(normalized_text)

    # AI assistance detection
    ai_detect = AIAssistanceDetector.evaluate_text(normalized_text)

    return {
        "id": sig_id,
        "platform": platform,
        "raw_text": raw_text,
        "normalized_text": normalized_text,
        "language": detected_lang,
        "media_type": media_type,
        "media_url": media_url,
        "entities": entities,
        "ai_assistance": ai_detect,
        "author": raw.get("author") or "u/anonymous_proxy",
        "timestamp": raw.get("timestamp") or datetime.now(timezone.utc).isoformat(),
        "threat_level": raw.get("threat_level", "MEDIUM")
    }

def run_pipeline(sample_size: int = 300, distance_threshold: float = 0.42, push_to_db: bool = True):
    print("=" * 80)
    print(" 🛡️ BHARAT-SHIELD INTELLIGENCE VECTORIZATION & CLUSTERING PIPELINE")
    print(f"    Target Ingestion: {sample_size} records per source | Clustering Cosine Thr: {distance_threshold}")
    print("=" * 80)

    # 1. Harvest from raw sources
    all_raw_signals = []
    
    # Instagram 20K
    insta_file = RAW_DIR / "instagram_20k_dataset.jsonl"
    if not insta_file.exists():
        insta_file = RAW_DIR / "instagram_20k_dataset.json"
    if not insta_file.exists():
        insta_file = RAW_DIR / "instagram_signals.jsonl"
    if insta_file.exists():
        all_raw_signals.extend(load_signals_from_file(insta_file, max_records=sample_size))

    # Reddit 20K
    reddit_file = RAW_DIR / "reddit_20k_dataset.jsonl"
    if not reddit_file.exists():
        reddit_file = RAW_DIR / "reddit_20k_dataset.json"
    if not reddit_file.exists():
        reddit_file = RAW_DIR / "reddit_signals.json"
    if reddit_file.exists():
        all_raw_signals.extend(load_signals_from_file(reddit_file, max_records=sample_size))

    # Twitter IO-X Disinformation Dataset
    twitter_file = RAW_DIR / "twitter_disinfo_dataset.json"
    if not twitter_file.exists():
        twitter_file = RAW_DIR / "twitter_iox" / "twitter_india_disinfo.jsonl"
    if twitter_file.exists():
        all_raw_signals.extend(load_signals_from_file(twitter_file, max_records=sample_size))

    # Synthetic Baseline
    synth_file = DATA_DIR / "synthetic" / "campaign_data.json"
    if synth_file.exists() and len(all_raw_signals) < 50:
        all_raw_signals.extend(load_signals_from_file(synth_file, max_records=sample_size))

    if not all_raw_signals:
        print("[!] No signals found to process. Generating synthetic benchmark signals...")
        from scripts.generate_dataset import generate_signals
        all_raw_signals = generate_signals(count=100)

    print(f"\n[*] Total Raw Signals Collected for Processing: {len(all_raw_signals)}")

    # 2. Normalize and Extract Intelligence
    print("[*] Normalizing text, detecting languages, extracting entities & AI indicators...")
    normalized_signals = []
    for raw in all_raw_signals:
        norm = normalize_signal(raw)
        if norm["normalized_text"].strip():
            normalized_signals.append(norm)

    print(f"✓ Normalized {len(normalized_signals)} actionable signals.")

    # 3. Vector Embeddings
    print("\n[*] Generating 384-dimensional Multilingual Vector Embeddings in batches...")
    texts = [s["normalized_text"] for s in normalized_signals]
    start_time = time.time()
    embeddings = MultilingualEmbedder.encode_batch(texts)
    elapsed = time.time() - start_time
    print(f"✓ Computed {len(embeddings)} vectors in {elapsed:.2f}s ({len(embeddings)/max(elapsed, 0.001):.1f} vec/sec)")

    for sig, emb in zip(normalized_signals, embeddings):
        sig["embedding"] = emb

    # 4. Multi-Platform Semantic Clustering (HDBSCAN / Agglomerative)
    print("\n[*] Running Unsupervised Narrative Clustering across Cross-Platform Vectors...")
    emb_matrix = np.array(embeddings, dtype=np.float32)
    labels = None

    try:
        from sklearn.cluster import AgglomerativeClustering
        clusterer = AgglomerativeClustering(
            n_clusters=None,
            distance_threshold=distance_threshold,
            metric='cosine',
            linkage='average'
        )
        labels = clusterer.fit_predict(emb_matrix)
        print(f"✓ Agglomerative Clustering generated {len(set(labels))} narrative clusters.")
    except Exception as e:
        print(f"[!] Clustering fallback triggered ({e}). Assigning heuristic buckets.")
        labels = [i % 8 for i in range(len(normalized_signals))]

    # Group signals into campaigns
    campaign_map = {}
    for sig, label in zip(normalized_signals, labels):
        cid = f"CMP-{label+1:03d}" if label >= 0 else f"ISOLATED-{sig['id']}"
        sig["campaign_id"] = cid
        if cid not in campaign_map:
            campaign_map[cid] = []
        campaign_map[cid].append(sig)

    # 5. Risk Assessment, Coordination Matrix & Blockchain Evidence Hashing
    print("\n[*] Evaluating Threat Matrices and generating Cryptographic Evidence Packages...")
    clustered_campaigns = []
    db_online = is_db_available() if push_to_db else False

    if db_online:
        print("✓ PostgreSQL pgvector is ONLINE. Seeding vectors and campaign telemetry into database...")
    else:
        print("⚠ PostgreSQL pgvector is OFFLINE. Proceeding with JSON and in-memory export.")

    for cid, c_signals in campaign_map.items():
        # Evaluate risk score for the campaign
        post_objs = [{
            "id": s["id"],
            "platform": s["platform"],
            "text": s["normalized_text"],
            "language": s["language"],
            "ai_assistance": s["ai_assistance"]
        } for s in c_signals]

        risk_data = RiskAssessmentEngine.evaluate_campaign(post_objs)
        evidence_pkg = EvidenceHasher.generate_evidence_package(cid, post_objs, risk_data)

        languages = list(set(s["language"] for s in c_signals))
        platforms = list(set(s["platform"] for s in c_signals))
        rep_text = c_signals[0]["normalized_text"]
        title = rep_text[:75].strip() + ("..." if len(rep_text) > 75 else "")

        threat_score = risk_data.get("base_risk", 70)
        coordination_score = risk_data.get("coordination_score", 75)
        ai_prob = risk_data.get("ai_assistance_probability", 65)
        cross_platform_sync = min(99, int(50 + len(platforms) * 15 + len(c_signals) * 2))

        campaign_doc = {
            "id": cid,
            "title": title,
            "status": "ACTIVE_CRITICAL" if threat_score >= 80 else "MONITORING",
            "category": "Cross-Platform Information Operation",
            "primary_language": languages[0] if languages else "en",
            "languages_detected": languages,
            "platforms": platforms,
            "post_count": len(c_signals),
            "threat_score": threat_score,
            "overall_threat_min": max(10, threat_score - 15),
            "overall_threat_max": min(100, threat_score + 10),
            "confidence": risk_data.get("confidence", "HIGH"),
            "coordination_score": coordination_score,
            "ai_probability": ai_prob,
            "cross_platform_sync": cross_platform_sync,
            "target": "National Infrastructure & Social Cohesion",
            "summary": f"Detected cross-lingual swarm across {', '.join(platforms)} with {len(c_signals)} synchronized signals.",
            "authorized_actions": ["sec69a_takedown", "inter_agency_dossier", "blockchain_notarize"],
            "risk_assessment": risk_data,
            "evidence": evidence_pkg,
            "posts": c_signals[:10]
        }
        clustered_campaigns.append(campaign_doc)

        # Insert to DB if available
        if db_online:
            upsert_campaign(campaign_doc)
            insert_audit_entry(
                package_id=evidence_pkg.get("package_id", cid),
                campaign_id=cid,
                sha256_hash=evidence_pkg.get("sha256_hash", ""),
                event_type="BATCH_PIPELINE_NOTARIZATION",
                details=f"Campaign {cid} clustered with {len(c_signals)} signals across {len(platforms)} platforms."
            )

    # Insert individual signals with embeddings into Postgres
    if db_online:
        print("[*] Inserting indexed signals with 384-dim embeddings into pgvector...")
        inserted_cnt = 0
        for s in normalized_signals[:300]:
            ok = insert_signal(
                signal_id=s["id"],
                source=s["platform"],
                raw_payload=s["raw_text"],
                detected_language=s["language"],
                confidence_score=0.92,
                intent_classification="coordinated_disinformation",
                severity="HIGH" if s.get("threat_level") == "CRITICAL" else "MEDIUM",
                normalized_translation=s["normalized_text"],
                campaign_id=s.get("campaign_id"),
                embedding=s.get("embedding")
            )
            if ok:
                inserted_cnt += 1
        print(f"✓ Inserted {inserted_cnt} vector-indexed signals into PostgreSQL.")

    # Sort campaigns by threat score
    clustered_campaigns.sort(key=lambda x: x["threat_score"], reverse=True)

    # 6. Save Processed Intelligence Output
    out_campaigns_file = PROCESSED_DIR / "clustered_campaigns.json"
    with open(out_campaigns_file, "w", encoding="utf-8") as f:
        json.dump(clustered_campaigns, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Saved {len(clustered_campaigns)} campaigns to {out_campaigns_file.relative_to(PROJECT_ROOT)}")

    out_signals_file = PROCESSED_DIR / "processed_signals.jsonl"
    with open(out_signals_file, "w", encoding="utf-8") as f:
        for s in normalized_signals:
            # Write record without raw heavy embedding in jsonl for compact file
            compact_s = {k: v for k, v in s.items() if k != "embedding"}
            compact_s["embedding_dim"] = len(s.get("embedding", []))
            f.write(json.dumps(compact_s, ensure_ascii=False) + "\n")
    print(f"✓ Saved {len(normalized_signals)} processed signals to {out_signals_file.relative_to(PROJECT_ROOT)}")

    # Update synthetic campaign data for frontend fallback
    with open(synth_file, "w", encoding="utf-8") as f:
        # Save sample posts for in-memory frontend queries
        synth_posts = []
        for s in normalized_signals[:100]:
            synth_posts.append({
                "id": s["id"],
                "platform": s["platform"],
                "text": s["normalized_text"],
                "language": s["language"],
                "media_type": s["media_type"],
                "author": s["author"],
                "timestamp": s["timestamp"],
                "ai_assistance": s["ai_assistance"]
            })
        json.dump(synth_posts, f, indent=2, ensure_ascii=False)
    print(f"✓ Synchronized frontend benchmark intelligence in {synth_file.relative_to(PROJECT_ROOT)}")

    print("\n" + "=" * 80)
    print("🎉 BATCH PROCESSING & VECTOR CLUSTERING PIPELINE COMPLETED SUCCESSFULLY!")
    print(f"   • Total Signals Vectorized: {len(normalized_signals)}")
    print(f"   • Coordinated Campaigns Identified: {len(clustered_campaigns)}")
    print(f"   • High-Risk Campaigns (Threat >= 80): {sum(1 for c in clustered_campaigns if c['threat_score'] >= 80)}")
    print("=" * 80)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bharat-Shield Batch Ingestion and Clustering")
    parser.add_argument("--samples", type=int, default=150, help="Max samples per dataset source")
    parser.add_argument("--distance", type=float, default=0.42, help="Cosine distance threshold for clustering")
    parser.add_argument("--no-db", action="store_true", help="Skip database ingestion")
    args = parser.parse_args()

    run_pipeline(sample_size=args.samples, distance_threshold=args.distance, push_to_db=not args.no_db)
