import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
import httpx

logger = logging.getLogger("bharat_shield.connectors")

BASE_DIR = Path(__file__).resolve().parents[3]
KEYS_FILE = BASE_DIR / "data" / "user_keys.json"

def get_saved_keys() -> Dict[str, str]:
    """Load user API keys from local secure storage."""
    try:
        if KEYS_FILE.exists():
            with open(KEYS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading saved keys: {e}")
    return {}

def save_user_keys(keys: Dict[str, str]) -> bool:
    """Save user API keys to local secure storage."""
    try:
        KEYS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(KEYS_FILE, "w", encoding="utf-8") as f:
            json.dump(keys, f, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error saving keys: {e}")
        return False

# =========================================================================
# 1. GOOGLE GEMINI CONNECTOR (Free AI Triage & Fact-Checking)
# =========================================================================
async def test_gemini_key(api_key: str) -> Dict[str, Any]:
    """Test if a Google Gemini API key is valid."""
    if not api_key or len(api_key) < 15:
        return {"valid": False, "message": "Key is too short or empty"}
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name", "").replace("models/", "") for m in data.get("models", [])[:4]]
                return {
                    "valid": True,
                    "message": f"Connected! Available models: {', '.join(models)}",
                    "models": models
                }
            else:
                err_msg = resp.json().get("error", {}).get("message", "API request failed")
                return {"valid": False, "message": f"Gemini error: {err_msg}"}
    except Exception as e:
        return {"valid": False, "message": f"Network error: {str(e)}"}

async def live_gemini_verify(query: str, api_key: str) -> Dict[str, Any]:
    """Run real-time forensic fact-check & narrative debunk using Google Gemini."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    prompt = f"""You are BHARAT-SHIELD SENTINEL, a forensic cognitive security and campaign analysis system for India.
Analyze the following claim, social media rumor, or viral topic:
"{query}"

Return a valid JSON object ONLY (no markdown code blocks, just raw JSON) with this exact schema:
{{
  "verdict": "Likely Disinformation" | "Manipulated Media" | "Unverified Rumor" | "Likely Authentic",
  "risk_score": 0-100,
  "confidence": 0.0-1.0,
  "detected_patterns": ["string list of 2-4 manipulation tactics, e.g. 'Out-of-context video', 'Astroturfing', 'Synthetic audio'"],
  "debunk_summary": "2-3 clear sentences explaining the factual reality and why it is misleading",
  "recommended_action": "Clear guidance for citizens receiving this forward"
}}"""

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                headers={"Content-Type": "application/json"}
            )
            if resp.status_code == 200:
                raw_text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Clean any markdown fences if present
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                return json.loads(raw_text.strip())
            else:
                return {"error": f"Gemini API returned status {resp.status_code}: {resp.text}"}
    except Exception as e:
        return {"error": f"Gemini verification failed: {str(e)}"}

# =========================================================================
# 2. YOUTUBE DATA API v3 CONNECTOR (Live Video Search)
# =========================================================================
async def test_youtube_key(api_key: str) -> Dict[str, Any]:
    """Test if a YouTube Data API v3 key is valid."""
    if not api_key or len(api_key) < 15:
        return {"valid": False, "message": "Key is too short or empty"}
    
    url = f"https://www.googleapis.com/youtube/v3/search?part=id&q=India&maxResults=1&key={api_key}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return {"valid": True, "message": "Connected to YouTube Data API v3"}
            else:
                err_msg = resp.json().get("error", {}).get("message", "API request failed")
                return {"valid": False, "message": f"YouTube error: {err_msg}"}
    except Exception as e:
        return {"valid": False, "message": f"Network error: {str(e)}"}

async def live_youtube_search(query: str, api_key: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Search live YouTube videos matching a campaign topic or keyword."""
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&type=video&maxResults={max_results}&key={api_key}"
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                items = resp.json().get("items", [])
                results = []
                for item in items:
                    snippet = item.get("snippet", {})
                    video_id = item.get("id", {}).get("videoId", "")
                    results.append({
                        "platform": "youtube",
                        "title": snippet.get("title", ""),
                        "channel": snippet.get("channelTitle", ""),
                        "published_at": snippet.get("publishedAt", ""),
                        "description": snippet.get("description", "")[:140] + "...",
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "thumbnail": snippet.get("thumbnails", {}).get("default", {}).get("url", "")
                    })
                return results
    except Exception as e:
        logger.error(f"YouTube search failed: {e}")
    return []

# =========================================================================
# 3. REDDIT PUBLIC CONNECTOR (Community Discussions & Sentiment)
# =========================================================================
async def live_reddit_search(query: str, subreddit: str = "india", limit: int = 5) -> List[Dict[str, Any]]:
    """Search public Reddit posts without requiring OAuth keys (uses public JSON API)."""
    url = f"https://www.reddit.com/r/{subreddit}/search.json?q={query}&restrict_sr=1&sort=relevance&limit={limit}"
    headers = {"User-Agent": "BharatShieldSentinel/1.0.0 (Personal Security Radar)"}
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                posts = resp.json().get("data", {}).get("children", [])
                results = []
                for p in posts:
                    data = p.get("data", {})
                    results.append({
                        "platform": "reddit",
                        "title": data.get("title", ""),
                        "subreddit": f"r/{data.get('subreddit', subreddit)}",
                        "author": data.get("author", "[deleted]"),
                        "score": data.get("score", 0),
                        "num_comments": data.get("num_comments", 0),
                        "url": f"https://reddit.com{data.get('permalink', '')}",
                        "created_utc": data.get("created_utc", 0)
                    })
                return results
    except Exception as e:
        logger.error(f"Reddit search failed: {e}")
    return []

# =========================================================================
# 4. TELEGRAM BOT CONNECTOR (Tipline Alerts)
# =========================================================================
async def test_telegram_token(bot_token: str) -> Dict[str, Any]:
    """Test if a Telegram Bot Token is valid."""
    if not bot_token or ":" not in bot_token:
        return {"valid": False, "message": "Token must be in format '123456:ABC-DEF...'"}
    
    url = f"https://api.telegram.org/bot{bot_token}/getMe"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                user = resp.json().get("result", {})
                return {
                    "valid": True,
                    "message": f"Connected to @{user.get('username')} ({user.get('first_name')})"
                }
            else:
                return {"valid": False, "message": "Invalid Telegram bot token"}
    except Exception as e:
        return {"valid": False, "message": f"Network error: {str(e)}"}

# =========================================================================
# 5. OLLAMA LOCAL CONNECTOR (100% Offline AI)
# =========================================================================
async def test_ollama_endpoint(endpoint: str = "http://localhost:11434") -> Dict[str, Any]:
    """Test connection to a local Ollama instance."""
    url = f"{endpoint.rstrip('/')}/api/tags"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                models = [m.get("name") for m in resp.json().get("models", [])]
                return {
                    "valid": True,
                    "message": f"Connected! Available models: {', '.join(models) if models else 'None installed'}",
                    "models": models
                }
            return {"valid": False, "message": f"Ollama returned HTTP {resp.status_code}"}
    except Exception:
        return {"valid": False, "message": "Could not connect to Ollama on localhost:11434"}
