"""
Real Reddit Crawler & Dataset Generator for BHARAT-SHIELD.
Crawls 20,000 100% REAL, authentic, live/indexed posts from major Indian Subreddits
using the Arctic Shift / Pushshift archival search API.

Generates:
- data/raw/reddit_20k_dataset.json (JSON array of 20,000 real posts)
- data/raw/reddit_20k_dataset.jsonl (JSON Lines format for streaming / fast loading)
"""

import os
import sys
import time
import json
import random
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Set

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_JSON = PROJECT_ROOT / "data" / "raw" / "reddit_20k_dataset.json"
OUTPUT_JSONL = PROJECT_ROOT / "data" / "raw" / "reddit_20k_dataset.jsonl"

TARGET_SUBREDDITS = [
    "india",
    "indiasocial",
    "delhi",
    "mumbai",
    "bangalore",
    "developersIndia",
    "IndiaSpeaks",
    "unitedstatesofindia",
    "IndiaInvestments",
    "IndianStockMarket",
    "LegalAdviceIndia",
    "IndianTeenagers",
    "IndianDefense",
    "hyderabad",
    "kolkata",
    "chennai",
    "pune",
    "kerala",
    "AskIndia",
    "CarsIndia",
    "ISRO",
    "indiadiscussion",
    "IndianGaming",
    "BollyBlindsNGossip",
    "TwoXIndia",
    "StartUpIndia",
    "IndiaTech",
    "indianmedschool",
    "CricketShitpost",
    "bollywood",
    "ahmedabad",
    "jaipur",
    "lucknow",
    "chandigarh",
    "bihar",
    "uttarpradesh",
    "gujarat",
    "punjab"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 BharatShieldIntel/2.0"
}

def determine_media_type(post: Dict[str, Any]) -> str:
    """Classify the media type of a real Reddit submission."""
    post_hint = post.get("post_hint", "")
    url = post.get("url", "")
    is_video = post.get("is_video", False)
    is_self = post.get("is_self", False)
    domain = post.get("domain", "")

    if is_video or "v.redd.it" in url or post_hint == "hosted:video":
        return "video"
    elif post_hint == "image" or "i.redd.it" in url or url.endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
        return "image"
    elif "gallery" in post_hint or "gallery" in domain:
        return "gallery"
    elif is_self:
        return "text"
    elif post.get("poll_data"):
        return "poll"
    else:
        return "link"

def normalize_reddit_post(raw: Dict[str, Any], subreddit_fallback: str) -> Dict[str, Any]:
    """Transform raw Reddit API object into clean Bharat-Shield schema."""
    post_id = str(raw.get("id", ""))
    sub = raw.get("subreddit") or subreddit_fallback
    author = raw.get("author", "[deleted]")
    if author and not author.startswith("u/") and author not in ("[deleted]", "[removed]"):
        author_formatted = f"u/{author}"
    else:
        author_formatted = author or "[deleted]"

    title = (raw.get("title") or "").strip()
    selftext = (raw.get("selftext") or "").strip()

    # Filter out [removed] or [deleted] placeholders in selftext
    clean_selftext = "" if selftext in ("[removed]", "[deleted]") else selftext
    
    if clean_selftext:
        full_text = f"{title}\n\n{clean_selftext}"
    else:
        full_text = title

    created_utc = raw.get("created_utc", 0)
    try:
        created_dt = datetime.fromtimestamp(float(created_utc), tz=timezone.utc).isoformat()
    except Exception:
        created_dt = datetime.now(timezone.utc).isoformat()

    permalink = raw.get("permalink", "")
    if permalink and not permalink.startswith("http"):
        permalink = f"https://reddit.com{permalink}"

    url = raw.get("url") or permalink

    return {
        "id": f"REDDIT-{post_id}",
        "reddit_id": post_id,
        "platform": "reddit",
        "subreddit": sub,
        "author": author_formatted,
        "title": title,
        "selftext": clean_selftext,
        "text": full_text,
        "url": url,
        "permalink": permalink,
        "media_type": determine_media_type(raw),
        "score": int(raw.get("score", 0) or 0),
        "upvote_ratio": float(raw.get("upvote_ratio", 1.0) or 1.0),
        "num_comments": int(raw.get("num_comments", 0) or 0),
        "timestamp": created_dt,
        "created_utc": int(created_utc),
        "link_flair_text": raw.get("link_flair_text") or "",
        "over_18": bool(raw.get("over_18", False)),
        "is_self": bool(raw.get("is_self", False)),
        "domain": raw.get("domain") or ""
    }

def fetch_batch_from_arctic(subreddit: str, before: int = None, limit: int = 100, max_retries: int = 4) -> List[Dict[str, Any]]:
    """Fetch a batch of submissions from Arctic Shift API with exponential backoff."""
    base_url = f"https://arctic-shift.photon-reddit.com/api/posts/search?subreddit={subreddit}&limit={limit}"
    if before:
        base_url += f"&before={before}"

    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(base_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("data", [])
        except urllib.error.HTTPError as e:
            if e.code in (422, 429, 502, 503, 504):
                wait_time = (attempt + 1) * 1.5 + random.uniform(0.2, 0.6)
                time.sleep(wait_time)
            else:
                # Other HTTP error, break
                break
        except Exception:
            time.sleep(1.0 + attempt * 0.5)

    return []

def crawl_20k_dataset(target_total: int = 20000):
    print("=" * 70)
    print(f"BHARAT-SHIELD: Real Reddit Indian Subreddits Dataset Crawler")
    print(f"Target: {target_total:,} 100% Real Posts across {len(TARGET_SUBREDDITS)} Subreddits")
    print(f"Output JSON : {OUTPUT_JSON}")
    print(f"Output JSONL: {OUTPUT_JSONL}")
    print("=" * 70)

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    collected_posts: List[Dict[str, Any]] = []
    seen_ids: Set[str] = set()

    # Pre-calculate quotas per subreddit, but allow dynamic overflow
    posts_per_sub_target = max(600, (target_total // len(TARGET_SUBREDDITS)) + 50)
    print(f"Targeting ~{posts_per_sub_target} posts per subreddit across {len(TARGET_SUBREDDITS)} subreddits...\n")

    t_start = time.time()
    last_save_time = time.time()

    for sub_idx, sub in enumerate(TARGET_SUBREDDITS, 1):
        if len(collected_posts) >= target_total:
            break

        sub_collected = 0
        before_cursor = None
        consecutive_empty = 0

        print(f"[{sub_idx:02d}/{len(TARGET_SUBREDDITS):02d}] Crawling r/{sub}...")

        while sub_collected < posts_per_sub_target and len(collected_posts) < target_total:
            batch = fetch_batch_from_arctic(subreddit=sub, before=before_cursor, limit=100)

            if not batch:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    print(f"   -> No more posts available from r/{sub}. Moving to next.")
                    break
                time.sleep(1.5)
                continue

            consecutive_empty = 0
            new_in_batch = 0

            for raw_post in batch:
                p_id = str(raw_post.get("id", ""))
                if not p_id or p_id in seen_ids:
                    continue

                normalized = normalize_reddit_post(raw_post, subreddit_fallback=sub)
                
                # Verify that it has at least a title
                if not normalized["title"]:
                    continue

                seen_ids.add(p_id)
                collected_posts.append(normalized)
                sub_collected += 1
                new_in_batch += 1

                if len(collected_posts) >= target_total:
                    break

            # Update timestamp cursor to oldest post in this batch
            if batch:
                oldest_ts = batch[-1].get("created_utc")
                if oldest_ts and (before_cursor is None or oldest_ts < before_cursor):
                    before_cursor = oldest_ts
                else:
                    # If cursor didn't move backwards, subtract 1 second
                    before_cursor = (before_cursor or int(time.time())) - 86400

            elapsed = time.time() - t_start
            rate = len(collected_posts) / elapsed if elapsed > 0 else 0
            print(f"   r/{sub}: +{new_in_batch} posts | Sub total: {sub_collected} | Overall: {len(collected_posts):,}/{target_total:,} ({rate:.1f} posts/s)")

            # Periodic checkpoint save every 2,500 posts or 60 seconds
            if time.time() - last_save_time > 60 or len(collected_posts) % 2500 == 0:
                save_intermediate(collected_posts)
                last_save_time = time.time()

            # Courteous pacing delay between API calls
            time.sleep(0.4)

    # Final pass: if still under target_total, loop back through major active subreddits
    if len(collected_posts) < target_total:
        print(f"\nCollected {len(collected_posts):,} posts. Deep crawling top subreddits to reach {target_total:,}...")
        for sub in ["india", "delhi", "mumbai", "bangalore", "IndiaSpeaks", "developersIndia", "AskIndia"]:
            if len(collected_posts) >= target_total:
                break
            print(f"Deep crawling r/{sub}...")
            before_cursor = None
            for _ in range(30):
                if len(collected_posts) >= target_total:
                    break
                batch = fetch_batch_from_arctic(subreddit=sub, before=before_cursor, limit=100)
                if not batch:
                    time.sleep(1.0)
                    continue
                for raw_post in batch:
                    p_id = str(raw_post.get("id", ""))
                    if p_id and p_id not in seen_ids:
                        seen_ids.add(p_id)
                        collected_posts.append(normalize_reddit_post(raw_post, subreddit_fallback=sub))
                        if len(collected_posts) >= target_total:
                            break
                if batch:
                    before_cursor = batch[-1].get("created_utc")
                time.sleep(0.4)

    # Truncate to exact target_total if exceeded
    final_dataset = collected_posts[:target_total]

    # Save to disk
    save_final_dataset(final_dataset)

    t_total = time.time() - t_start
    print("\n" + "=" * 70)
    print(f"SUCCESS: Crawled & Compiled Exactly {len(final_dataset):,} Real Reddit Posts!")
    print(f"Total Elapsed Time: {t_total:.1f}s ({t_total/60:.2f} mins)")
    print(f"JSON File : {OUTPUT_JSON} ({OUTPUT_JSON.stat().st_size / (1024*1024):.2f} MB)")
    print(f"JSONL File: {OUTPUT_JSONL} ({OUTPUT_JSONL.stat().st_size / (1024*1024):.2f} MB)")
    print("=" * 70)

def save_intermediate(posts: List[Dict[str, Any]]):
    """Save progress checkpoint to disk."""
    try:
        with open(OUTPUT_JSONL, "w", encoding="utf-8") as f:
            for p in posts:
                f.write(json.dumps(p, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"Checkpoint save warning: {e}")

def save_final_dataset(posts: List[Dict[str, Any]]):
    """Write both JSON array and JSONL files."""
    print(f"\nWriting {len(posts):,} records to {OUTPUT_JSON}...")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    print(f"Writing {len(posts):,} records to {OUTPUT_JSONL}...")
    with open(OUTPUT_JSONL, "w", encoding="utf-8") as f:
        for p in posts:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

if __name__ == "__main__":
    crawl_20k_dataset(target_total=20000)
