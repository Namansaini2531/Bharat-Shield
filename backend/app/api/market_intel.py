"""
FastAPI Router for Market Intelligence & Financial Threat Ingestion & Processing.
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Body, HTTPException, Query
from ai.market_intel import MarketIntelEngine

router = APIRouter(prefix="/api/market-intel", tags=["Market Intelligence"])

@router.get("/presets")
def get_market_presets():
    """
    Returns pre-configured high-impact financial & market disinformation attack scenarios.
    """
    return {
        "status": "SUCCESS",
        "presets": MarketIntelEngine.get_preset_scenarios()
    }

@router.get("/history")
def get_market_history(limit: int = Query(50, description="Max records to return")):
    """
    Returns historical processed market intelligence signals, real-time metrics, and blockchain notarizations.
    """
    return MarketIntelEngine.get_history(limit=limit)

@router.post("/ingest-and-process")
def ingest_and_process_market_signal(payload: Dict[str, Any] = Body(...)):
    """
    Ingests raw market text, rumor, or intercepted post, runs end-to-end NLP/NER,
    computes short-seller/manipulation risk, and generates statutory SEBI Reg 30 disclosures.
    """
    text = payload.get("text", "")
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Signal text cannot be empty.")

    source = payload.get("source", "Telegram Trading Rooms")
    media_type = payload.get("media_type", "text")
    company_ticker = payload.get("company_ticker")
    timing_slot = payload.get("timing_slot", "PRE_MARKET_0845_0915")
    metadata = payload.get("metadata", {})

    result = MarketIntelEngine.ingest_and_process(
        text=text,
        source=source,
        media_type=media_type,
        company_ticker=company_ticker,
        timing_slot=timing_slot,
        metadata=metadata,
        save_to_history=True
    )
    return {
        "status": "PROCESSED_SUCCESS",
        "data": result
    }

@router.post("/batch-process")
def batch_process_market_signals(payload: Dict[str, Any] = Body(...)):
    """
    Processes batch datasets of signals (JSON / JSONL items) through the market intel pipeline.
    """
    signals = payload.get("signals", [])
    if not signals or not isinstance(signals, list):
        raise HTTPException(status_code=400, detail="Payload must contain a non-empty 'signals' list.")

    result = MarketIntelEngine.batch_process(signals)
    return result
