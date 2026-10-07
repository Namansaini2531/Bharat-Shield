"""
Dataset Integrator for IO-X Twitter Disinformation & Influence Operations Datasets.
Source Repository: https://github.com/shafin191/IO-X-Datasets.git

Exclusively extracts and processes INDIA-SPECIFIC datasets:
1. AltNews India (2020-2022) Fact-Checked Fake Tweets & Coordinated Swarms
2. AltNews India (2024 General Elections) Fact-Checked Fake Tweets
3. AltNews Fact-Checked Investigative Reports & Claim Debunk URLs

Normalizes all records into the Bharat-Shield Intelligence & Threat Pipeline schema.
"""

import os
import sys
import json
import hashlib
import urllib.request
from pathlib import Path
from typing import List, Dict, Any

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_RAW_DIR = PROJECT_ROOT / "data" / "raw"
TWITTER_OUT_DIR = DATA_RAW_DIR / "twitter_iox"

RAW_BASE_URL = "https://raw.githubusercontent.com/shafin191/IO-X-Datasets/main"

# Strictly India-specific datasets
FILES_TO_PULL = [
    {
        "name": "AltNews20-22_Fake_Tweets.csv",
        "url": f"{RAW_BASE_URL}/AltX/AltNews20-22_Fake_Tweets.csv",
        "target": TWITTER_OUT_DIR / "AltNews20-22_Fake_Tweets.csv",
        "category": "India Disinformation Swarm (2020-2022)",
        "source": "AltNews India"
    },
    {
        "name": "AltNews24_Fake_Tweets.csv",
        "url": f"{RAW_BASE_URL}/AltX/AltNews24_Fake_Tweets.csv",
        "target": TWITTER_OUT_DIR / "AltNews24_Fake_Tweets.csv",
        "category": "India Election & Disinformation (2024)",
        "source": "AltNews India 2024"
    },
    {
        "name": "AltNews20-22_FactChecked_Reports.csv",
        "url": f"{RAW_BASE_URL}/AltX/AltNews20-22_FactChecked_Reports.csv",
        "target": TWITTER_OUT_DIR / "AltNews20-22_FactChecked_Reports.csv",
        "category": "Fact-Check Debunk Reports",
        "source": "AltNews Reports"
    },
    {
        "name": "AltNews24_FactChecked_Reports.csv",
        "url": f"{RAW_BASE_URL}/AltX/AltNews24_FactChecked_Reports.csv",
        "target": TWITTER_OUT_DIR / "AltNews24_FactChecked_Reports.csv",
        "category": "Fact-Check Debunk Reports 2024",
        "source": "AltNews Reports 2024"
    }
]

def download_file_if_needed(url: str, local_path: Path) -> Path:
    """Download file from raw GitHub if local copy doesn't exist."""
    local_path.parent.mkdir(parents=True, exist_ok=True)
    if local_path.exists() and local_path.stat().st_size > 0:
        return local_path

    print(f"Downloading {local_path.name} from {url}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BharatShield/2.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        content = resp.read()
        with open(local_path, "wb") as f:
            f.write(content)
    print(f"✓ Downloaded {local_path.name} ({len(content)/(1024):.1f} KB)")
    return local_path

def detect_indic_lang(text: str) -> str:
    """Heuristic language detection for Indic scripts and Indian English."""
    for ch in text:
        code = ord(ch)
        if 0x0900 <= code <= 0x097F:
            return "hi"  # Devanagari (Hindi, Marathi)
        elif 0x0980 <= code <= 0x09FF:
            return "bn"  # Bengali
        elif 0x0B80 <= code <= 0x0BFF:
            return "ta"  # Tamil
        elif 0x0C00 <= code <= 0x0C7F:
            return "te"  # Telugu
        elif 0x0A00 <= code <= 0x0A7F:
            return "pa"  # Punjabi
        elif 0x0C80 <= code <= 0x0CFF:
            return "kn"  # Kannada
        elif 0x0D00 <= code <= 0x0D7F:
            return "ml"  # Malayalam
        elif 0x0A80 <= code <= 0x0AFF:
            return "gu"  # Gujarati
    return "en"

def process_india_datasets():
    print("=" * 70)
    print("BHARAT-SHIELD: Strictly India-Specific Twitter Disinformation Pipeline")
    print("Source: https://github.com/shafin191/IO-X-Datasets (AltX / AltNews India)")
    print(f"Destination: {TWITTER_OUT_DIR}")
    print("=" * 70)

    TWITTER_OUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Download / Verify Raw CSV Files
    for item in FILES_TO_PULL:
        download_file_if_needed(item["url"], item["target"])

    # 2. Process AltNews India Fake Tweets (2020-2022 & 2024)
    print("\nProcessing India Fake Tweets (AltNews 2020-2022 & 2024)...")
    df_alt_old = pd.read_csv(TWITTER_OUT_DIR / "AltNews20-22_Fake_Tweets.csv")
    df_alt_24 = pd.read_csv(TWITTER_OUT_DIR / "AltNews24_Fake_Tweets.csv")

    india_tweets: List[Dict[str, Any]] = []
    seen_tweet_ids = set()

    for df, era, cat in [
        (df_alt_old, "2020-2022", "India Disinformation Swarm (2020-2022)"),
        (df_alt_24, "2024", "India General Elections & Civic Disinformation (2024)")
    ]:
        for _, row in df.iterrows():
            t_id = str(row.get("Tweet_ID", "")).strip()
            if not t_id or t_id in seen_tweet_ids or t_id == "nan":
                continue
            seen_tweet_ids.add(t_id)

            u_id = str(row.get("User_ID", "")).strip()
            text = str(row.get("Tweet_Text", "")).strip()
            if not text or text == "nan":
                continue

            lang = detect_indic_lang(text)
            sha = hashlib.sha256(text.encode("utf-8")).hexdigest()

            record = {
                "id": f"TWITTER-IND-{t_id}",
                "tweet_id": t_id,
                "platform": "twitter",
                "author": f"u/{u_id}" if u_id else "unknown_user",
                "text": text,
                "region": "India",
                "dataset_source": f"AltNews India ({era})",
                "campaign_cluster": f"CMP-IO-INDIA-{era[:4]}",
                "category": cat,
                "threat_level": "CRITICAL",
                "threat_score": 92,
                "confidence": "HIGH",
                "is_coordinated_io": True,
                "language": lang,
                "evidence_sha256": f"sha256:{sha}"
            }
            india_tweets.append(record)

    print(f"✓ Formatted {len(india_tweets):,} verified India disinformation tweets!")

    # 3. Process Fact-Check Reports
    print("\nProcessing AltNews India Fact-Check Reports metadata...")
    reports = []
    df_rep_old = pd.read_csv(TWITTER_OUT_DIR / "AltNews20-22_FactChecked_Reports.csv")
    df_rep_24 = pd.read_csv(TWITTER_OUT_DIR / "AltNews24_FactChecked_Reports.csv")

    for _, row in df_rep_old.iterrows():
        reports.append({
            "source": "AltNews India (2020-2022)",
            "region": "India",
            "fact_check_url": row.get("Fact_Check_Link", ""),
            "topic": row.get("Tweet_Topic", "")
        })

    for _, row in df_rep_24.iterrows():
        reports.append({
            "source": "AltNews India (2024)",
            "region": "India",
            "fact_check_url": row.get("Page URL", ""),
            "topic": "Lok Sabha Election 2024 Fact-Check"
        })

    # 4. Save Exclusively India Outputs
    out_india_json = TWITTER_OUT_DIR / "twitter_india_disinfo.json"
    out_india_jsonl = TWITTER_OUT_DIR / "twitter_india_disinfo.jsonl"
    out_reports_json = TWITTER_OUT_DIR / "twitter_factchecked_reports.json"
    out_combined_json = DATA_RAW_DIR / "twitter_disinfo_dataset.json"

    print(f"\nWriting India-only datasets to disk...")
    with open(out_india_json, "w", encoding="utf-8") as f:
        json.dump(india_tweets, f, ensure_ascii=False, indent=2)

    with open(out_india_jsonl, "w", encoding="utf-8") as f:
        for t in india_tweets:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")

    with open(out_reports_json, "w", encoding="utf-8") as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)

    # Make the main dataset file strictly India-only
    with open(out_combined_json, "w", encoding="utf-8") as f:
        json.dump(india_tweets, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 70)
    print("SUCCESS: 100% India-Specific Twitter Datasets Built!")
    print(f"Total Verified India Disinfo Tweets : {len(india_tweets):,} records")
    print(f"Total AltNews India Fact-Check Debunks: {len(reports):,} reports")
    print(f"Main File: {out_combined_json} ({out_combined_json.stat().st_size / (1024*1024):.2f} MB)")
    print("=" * 70)

if __name__ == "__main__":
    process_india_datasets()
