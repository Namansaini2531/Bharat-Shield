from typing import Any, Dict
from fastapi import APIRouter, Body, HTTPException
from backend.app.connectors.live_connectors import (
    get_saved_keys,
    save_user_keys,
    test_gemini_key,
    test_youtube_key,
    test_telegram_token,
    test_ollama_endpoint,
    live_gemini_verify,
    live_youtube_search,
    live_reddit_search
)

router = APIRouter(prefix="/api/connectors", tags=["Platform Connectors"])

@router.get("/status")
def get_connectors_status() -> Dict[str, Any]:
    """Return configured status of connectors (without revealing full secret keys)."""
    keys = get_saved_keys()
    
    def mask_key(k: str) -> str:
        if not k:
            return ""
        if len(k) <= 8:
            return "••••••••"
        return f"{k[:4]}••••••••{k[-4:]}"

    return {
        "gemini": {
            "configured": bool(keys.get("gemini")),
            "masked_key": mask_key(keys.get("gemini", ""))
        },
        "youtube": {
            "configured": bool(keys.get("youtube")),
            "masked_key": mask_key(keys.get("youtube", ""))
        },
        "telegram": {
            "configured": bool(keys.get("telegram")),
            "masked_key": mask_key(keys.get("telegram", ""))
        },
        "twitter": {
            "configured": bool(keys.get("twitter")),
            "masked_key": mask_key(keys.get("twitter", ""))
        },
        "ollama": {
            "configured": bool(keys.get("ollama", "http://localhost:11434")),
            "endpoint": keys.get("ollama", "http://localhost:11434")
        }
    }

@router.post("/save-keys")
def save_keys(payload: Dict[str, str] = Body(...)) -> Dict[str, Any]:
    """Persist user API keys to local secure storage."""
    existing = get_saved_keys()
    # Merge non-empty values
    for k, v in payload.items():
        if v and not v.startswith("••••"):
            existing[k] = v.strip()
    
    success = save_user_keys(existing)
    return {"success": success, "message": "API keys saved successfully"}

@router.post("/test")
async def test_connector(payload: Dict[str, str] = Body(...)) -> Dict[str, Any]:
    """Test connection for a specific platform API key."""
    service = payload.get("service")
    key = payload.get("key", "").strip()

    # If key wasn't provided in payload, check saved keys
    if not key or key.startswith("••••"):
        key = get_saved_keys().get(service, "")

    if service == "gemini":
        return await test_gemini_key(key)
    elif service == "youtube":
        return await test_youtube_key(key)
    elif service == "telegram":
        return await test_telegram_token(key)
    elif service == "ollama":
        endpoint = key or "http://localhost:11434"
        return await test_ollama_endpoint(endpoint)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported service: {service}")

@router.post("/live-verify")
async def live_verify(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """Run real-time AI fact-check using user's Gemini key."""
    query = payload.get("query", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    api_key = payload.get("api_key") or get_saved_keys().get("gemini", "")
    if not api_key:
        return {
            "error": "No Gemini API key configured. Enter your free Gemini API key in Settings > API Keys to enable live verification."
        }

    return await live_gemini_verify(query, api_key)

@router.post("/live-search")
async def live_search(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """Search live YouTube & Reddit for matching social media discussions."""
    query = payload.get("query", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    keys = get_saved_keys()
    youtube_key = payload.get("youtube_key") or keys.get("youtube", "")

    results: Dict[str, Any] = {"query": query, "platforms": {}}

    # 1. Reddit public search (always available)
    reddit_results = await live_reddit_search(query, subreddit="india", limit=4)
    results["platforms"]["reddit"] = reddit_results

    # 2. YouTube search (if key provided)
    if youtube_key:
        yt_results = await live_youtube_search(query, youtube_key, max_results=4)
        results["platforms"]["youtube"] = yt_results
    else:
        results["platforms"]["youtube"] = []

    return results
