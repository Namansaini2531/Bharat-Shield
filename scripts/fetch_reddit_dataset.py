"""
Reddit Threat Intelligence & Disinformation Dataset Scraper for BHARAT-SHIELD.
Collects public discussions, claims, and viral narratives from targeted Indian subreddits,
enriches them with the Multilingual AI Threat Pipeline (384-d pgvector embeddings, NER,
Threat Scoring), and persists them into datasets or directly into PostgreSQL.

Supports:
1. Official Reddit OAuth2 API (using REDDIT_CLIENT_ID & REDDIT_CLIENT_SECRET in .env)
2. Benchmark & Simulation Mode (for immediate offline / token-free testing)
"""

import os
import sys
import time
import json
import uuid
import argparse
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional

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

# Load .env
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=PROJECT_ROOT / ".env")
except ImportError:
    pass

import httpx
from ai.pipeline import BharatShieldIntelligencePipeline
from ai.embeddings import MultilingualEmbedder
from ai.multimodal.processor import MultimodalIntelligenceProcessor
from database.db import is_db_available, insert_signal, insert_audit_entry


# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("bharat_shield.reddit_collector")

DEFAULT_SUBREDDITS = [
    "india",
    "IndianDefense",
    "indiadiscussion",
    "unitedstatesofindia",
    "IndianStockMarket",
    "delhi",
    "mumbai"
]

DEFAULT_INTEL_QUERIES = [
    "blackout",
    "shutdown",
    "fake order",
    "rumor",
    "telecom",
    "bank freeze",
    "deepfake",
    "sabotage",
    "border tension",
    "cyber attack"
]

REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "").strip()
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "").strip()
REDDIT_USER_AGENT = os.getenv(
    "REDDIT_USER_AGENT",
    "BharatShieldSentinel:v1.0 (by /u/sentinel_intel_team)"
)

# Realistic curated Indian Subreddit benchmark items for testing without API keys
BENCHMARK_REDDIT_POSTS = [
    {
        "id": "REDDIT-IND-01",
        "platform": "reddit",
        "subreddit": "india",
        "author": "disinfo_watcher99",
        "title": "URGENT: DoT and Home Ministry issuing nationwide mobile internet blackout from midnight tonight? Hearing rumors on WhatsApp.",
        "text": "Seeing widespread forwards in local housing society groups claiming all telecom operators (Jio, Airtel) will halt mobile data services for 72 hours across NCR and Maharashtra due to central server migrations. Is this verified or another coordinated WhatsApp hoax?",
        "url": "https://reddit.com/r/india/comments/blackout_rumor",
        "score": 482,
        "upvote_ratio": 0.89,
        "num_comments": 142,
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "REDDIT-DEF-02",
        "platform": "reddit",
        "subreddit": "IndianDefense",
        "author": "northern_sector_intel",
        "title": "Unverified Telegram video claiming massive cross-border proxy drone incursions in Poonch / Rajouri sector.",
        "text": "Multiple shadow OSINT handles on Twitter and Telegram are circulating a 30-second low-resolution night vision clip claiming border skirmishes. Geolocation metadata appears recycled from 2022 Nagorno-Karabakh footage. Suspected coordinated PSYOP disinformation swarm.",
        "url": "https://reddit.com/r/IndianDefense/comments/border_drone_osint",
        "score": 310,
        "upvote_ratio": 0.94,
        "num_comments": 89,
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "REDDIT-FIN-03",
        "platform": "reddit",
        "subreddit": "IndianStockMarket",
        "author": "market_hawk_in",
        "title": "Fabricated SEBI advisory regarding port export license suspensions being dumped on fin-influencer groups.",
        "text": "Before market open today, PDF documents with forged SEBI and DRI letterheads claiming customs cancellation for Adani Ports & SEZ were circulated on anonymous trading channels. Seems like a deliberate short-seller bear raid coordinated ahead of derivative expiry.",
        "url": "https://reddit.com/r/IndianStockMarket/comments/sebi_fake_advisory",
        "score": 625,
        "upvote_ratio": 0.96,
        "num_comments": 210,
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "REDDIT-HIN-04",
        "platform": "reddit",
        "subreddit": "indiadiscussion",
        "author": "desi_patriot_77",
        "title": "सावधान: क्या रिज़र्व बैंक ने 500 रुपये के नोटों की वैधता पर कोई नई गाइडलाइन जारी की है?",
        "text": "व्हाट्सएप और फेसबुक पर एक ऑडियो क्लिप वायरल हो रहा है जिसमें दावा किया गया है कि 31 तारीख के बाद 500 के नोट अमान्य हो जाएंगे। क्या यह पूरी तरह से फर्जी और भ्रामक प्रचार है? सबको सूचित करें।",
        "url": "https://reddit.com/r/indiadiscussion/comments/rbi_500_hoax",
        "score": 195,
        "upvote_ratio": 0.91,
        "num_comments": 64,
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "REDDIT-CYB-05",
        "platform": "reddit",
        "subreddit": "india",
        "author": "cyber_analyst_blr",
        "title": "Deepfake audio impersonating senior government officials spreading on regional WhatsApp channels.",
        "text": "Voice synthesis clone discussing fabricated power grid rationing in southern states has surfaced across multiple tier-2 Telegram dark channels. High-frequency burst patterns indicate automated botnet amplification.",
        "url": "https://reddit.com/r/india/comments/deepfake_audio_grid",
        "score": 540,
        "upvote_ratio": 0.97,
        "num_comments": 115,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
]

class RedditIntelligenceCollector:
    def __init__(self, client_id: Optional[str] = None, client_secret: Optional[str] = None):
        self.client_id = client_id or REDDIT_CLIENT_ID
        self.client_secret = client_secret or REDDIT_CLIENT_SECRET
        self.access_token: Optional[str] = None
        self.client = httpx.Client(headers={"User-Agent": REDDIT_USER_AGENT}, timeout=15.0)

    def authenticate_oauth(self) -> bool:
        """Authenticate with Reddit OAuth2 API using application credentials."""
        if not self.client_id or not self.client_secret:
            return False

        try:
            logger.info("Authenticating with official Reddit OAuth2 API...")
            auth = (self.client_id, self.client_secret)
            data = {"grant_type": "client_credentials"}
            res = self.client.post(
                "https://www.reddit.com/api/v1/access_token",
                auth=auth,
                data=data,
                headers={"User-Agent": REDDIT_USER_AGENT}
            )

            if res.status_code == 200:
                self.access_token = res.json().get("access_token")
                logger.info("✓ Reddit OAuth2 authentication successful!")
                return True
            else:
                logger.warning(f"Reddit OAuth2 failed ({res.status_code}): {res.text}")
                return False
        except Exception as e:
            logger.error(f"Reddit OAuth2 exception: {e}")
            return False

    def fetch_subreddit_posts_oauth(self, subreddit: str, listing: str = "hot", limit: int = 25) -> List[Dict[str, Any]]:
        """Fetch posts using authenticated Reddit OAuth2 endpoint."""
        if not self.access_token:
            return []

        url = f"https://oauth.reddit.com/r/{subreddit}/{listing}"
        headers = {
            "Authorization": f"bearer {self.access_token}",
            "User-Agent": REDDIT_USER_AGENT
        }
        params = {"limit": min(limit, 100), "raw_json": 1}

        try:
            res = self.client.get(url, headers=headers, params=params)
            if res.status_code == 200:
                children = res.json().get("data", {}).get("children", [])
                posts = [self._normalize_raw_post(c.get("data", {}), subreddit=subreddit) for c in children]
                logger.info(f"✓ Retrieved {len(posts)} posts from r/{subreddit} via OAuth2 API")
                return posts
            return []
        except Exception as e:
            logger.error(f"OAuth fetch error for r/{subreddit}: {e}")
            return []

    def _normalize_raw_post(self, raw: Dict[str, Any], subreddit: Optional[str] = None) -> Dict[str, Any]:
        """Normalize Reddit post schema."""
        title = raw.get("title", "")
        selftext = raw.get("selftext", "")
        full_text = f"{title}\n\n{selftext}".strip() if selftext else title
        created_utc = raw.get("created_utc", time.time())
        created_dt = datetime.fromtimestamp(created_utc, tz=timezone.utc).isoformat()

        return {
            "id": f"REDDIT-{raw.get('id', uuid.uuid4().hex[:8])}",
            "platform": "reddit",
            "subreddit": subreddit or raw.get("subreddit", "unknown"),
            "author": raw.get("author", "[deleted]"),
            "title": title,
            "text": full_text,
            "url": raw.get("url", ""),
            "permalink": f"https://www.reddit.com{raw.get('permalink', '')}",
            "score": raw.get("score", 0),
            "upvote_ratio": raw.get("upvote_ratio", 1.0),
            "num_comments": raw.get("num_comments", 0),
            "timestamp": created_dt,
            "over_18": raw.get("over_18", False)
        }

    def enrich_post_with_ai(self, post: Dict[str, Any]) -> Dict[str, Any]:

        """
        Run Sentinel Multi-Signal AI pipeline on a Reddit post.
        Automatically performs OCR on attached photos/posters and ASR on videos
        so all multimodal media is converted directly into pure analyzable text!
        """
        raw_text = post.get("text", "")
        post_url = post.get("url", "")
        
        # 1. Multimodal OCR & ASR Extraction
        media_extraction = MultimodalIntelligenceProcessor.extract_unified_text_from_media(
            title_or_caption=raw_text,
            media_url=post_url
        )
        unified_text = media_extraction.get("unified_text") or raw_text
        if not unified_text:
            return post

        # 2. Sentinel AI Intelligence Analysis
        analysis = BharatShieldIntelligencePipeline.process_signal(
            text=unified_text,
            media_type=media_extraction.get("media_type", "text"),
            platform="reddit",
            metadata={
                "subreddit": post.get("subreddit"),
                "author": post.get("author"),
                "score": post.get("score"),
                "comments": post.get("num_comments"),
                "has_ocr_or_asr": media_extraction.get("has_multimodal_extracted_content", False)
            }
        )

        # 3. 384-dimensional Vector Embedding
        embedding = MultilingualEmbedder.encode(unified_text)

        enriched = dict(post)
        enriched["unified_extracted_text"] = unified_text
        enriched["media_extraction"] = media_extraction
        enriched["language_analysis"] = analysis["language_analysis"]
        enriched["entities_and_claims"] = analysis["entities_and_claims"]
        enriched["ai_assistance_indicators"] = analysis["ai_assistance_indicators"]
        enriched["threat_score"] = analysis["risk_assessment"]["base_risk"]
        enriched["confidence"] = analysis["risk_assessment"]["confidence"]
        enriched["risk_signals"] = [s["name"] for s in analysis["risk_assessment"].get("signals", [])]
        enriched["evidence_sha256"] = analysis["evidence_package"]["sha256_hash"]
        enriched["embedding_dimension"] = len(embedding)
        enriched["embedding"] = embedding

        return enriched


    def collect_dataset(
        self,
        subreddits: List[str],
        posts_per_source: int = 10,
        enrich_with_ai: bool = True
    ) -> List[Dict[str, Any]]:
        """Collect and enrich posts using OAuth2 if configured, or high-fidelity benchmark dataset."""
        raw_posts = []

        is_authenticated = self.authenticate_oauth()
        if is_authenticated:
            for sub in subreddits:
                posts = self.fetch_subreddit_posts_oauth(sub, limit=posts_per_source)
                raw_posts.extend(posts)
                time.sleep(0.5)

        if not raw_posts:
            logger.info("Using curated Indian Subreddit threat intelligence dataset...")
            raw_posts = list(BENCHMARK_REDDIT_POSTS)

        logger.info(f"Enriching {len(raw_posts)} posts with Sentinel AI Threat Engine...")
        enriched_posts = []
        for idx, p in enumerate(raw_posts, 1):
            enriched = self.enrich_post_with_ai(p)
            enriched_posts.append(enriched)

        return enriched_posts

    def persist_to_database(self, posts: List[Dict[str, Any]]) -> int:
        """Persist enriched Reddit posts into PostgreSQL pgvector database."""
        if not is_db_available():
            logger.warning("PostgreSQL is offline. Skipping database persistence.")
            return 0

        saved_count = 0
        for p in posts:
            try:
                signal_id = p.get("id")
                raw_payload = p.get("text", "")
                lang_data = p.get("language_analysis", {})
                detected_lang = lang_data.get("language", "en")
                threat_score = p.get("threat_score", 50)
                confidence = p.get("confidence", "HIGH")
                sha_hash = p.get("evidence_sha256", f"sha256:{uuid.uuid4().hex}")
                embedding = p.get("embedding")

                severity = "CRITICAL" if threat_score >= 80 else ("HIGH" if threat_score >= 60 else "MEDIUM")
                intent = "suspicious_disinformation" if threat_score >= 65 else "public_discourse"

                success = insert_signal(
                    signal_id=signal_id,
                    source=f"reddit_r_{p.get('subreddit', 'all')}",
                    raw_payload=raw_payload,
                    detected_language=detected_lang,
                    confidence_score=0.9 if confidence == "HIGH" else 0.7,
                    intent_classification=intent,
                    severity=severity,
                    normalized_translation=lang_data.get("normalized_text", raw_payload),
                    campaign_id="CMP-007" if threat_score >= 80 else None,
                    embedding=embedding
                )

                if success:
                    saved_count += 1
                    insert_audit_entry(
                        package_id=signal_id,
                        campaign_id="CMP-007" if threat_score >= 80 else None,
                        sha256_hash=sha_hash,
                        event_type="REDDIT_INGESTION_SEALED",
                        details=f"Ingested from r/{p.get('subreddit')} (Score: {p.get('score')}, Threat: {threat_score}/100)",
                        analyst_id="REDDIT_COLLECTOR",
                        role="investigation_bureau"
                    )
            except Exception as e:
                logger.error(f"Failed to persist Reddit post {p.get('id')}: {e}")

        logger.info(f"✓ Successfully inserted {saved_count}/{len(posts)} Reddit signals into PostgreSQL!")
        return saved_count

def main():
    parser = argparse.ArgumentParser(description="Bharat-Shield Reddit Intelligence Dataset Builder")
    parser.add_argument("--subreddits", type=str, default=",".join(DEFAULT_SUBREDDITS[:4]), help="Comma-separated list of subreddits")
    parser.add_argument("--limit", type=int, default=5, help="Number of posts per subreddit")
    parser.add_argument("--output", type=str, default="data/raw/reddit_signals.json", help="Output JSON file path")
    parser.add_argument("--save-to-db", action="store_true", help="Save enriched signals directly to PostgreSQL pgvector")

    args = parser.parse_args()
    subreddits = [s.strip() for s in args.subreddits.split(",") if s.strip()]

    print("=" * 75)
    print("🛡️ BHARAT-SHIELD REDDIT THREAT INTELLIGENCE COLLECTOR")
    print("=" * 75)
    print(f"Target Subreddits: {subreddits}")
    print(f"Output File:       {args.output}")
    print(f"Database Ingest:   {'ENABLED (PostgreSQL pgvector)' if args.save_to_db else 'DISABLED'}")
    print("=" * 75 + "\n")

    collector = RedditIntelligenceCollector()
    dataset = collector.collect_dataset(subreddits=subreddits, posts_per_source=args.limit)

    # Export to JSON
    out_path = PROJECT_ROOT / args.output
    out_path.parent.mkdir(parents=True, exist_ok=True)

    export_data = []
    for item in dataset:
        export_item = dict(item)
        if "embedding" in export_item:
            export_item["embedding_preview"] = export_item["embedding"][:5]
            del export_item["embedding"]
        export_data.append(export_item)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Successfully saved {len(export_data)} enriched Reddit posts to {out_path}!")

    if args.save_to_db:
        collector.persist_to_database(dataset)

    # Print summary cards
    print("\n" + "─" * 75)
    print("🔍 PROCESSED THREAT INTELLIGENCE SIGNALS FROM REDDIT:")
    print("─" * 75)
    for idx, p in enumerate(export_data, 1):
        threat = p.get("threat_score", 0)
        risk_emoji = "🚨" if threat >= 75 else ("⚠️" if threat >= 50 else "🟢")
        print(f"[{idx}] {risk_emoji} {p.get('id')} | r/{p.get('subreddit')} | Author: u/{p.get('author')}")
        print(f"    Title:        {p.get('title')[:75]}...")
        print(f"    Language:     {p.get('language_analysis', {}).get('language', 'en').upper()}")
        print(f"    Threat Score: {threat}/100 | Confidence: {p.get('confidence', 'N/A')}")
        print(f"    Evidence:     {p.get('evidence_sha256', '')[:24]}...")
        print()

if __name__ == "__main__":
    main()
