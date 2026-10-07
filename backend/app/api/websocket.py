"""
Real-Time WebSocket Intelligence Streaming Engine for BHARAT-SHIELD.
Enables bidirectional, low-latency broadcast of live incoming signals,
disinformation narrative mutations, and threat cluster spikes to analyst consoles.
"""

import json
import uuid
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException, Body
from ai.threat_scoring.risk_engine import RiskAssessmentEngine
from ai.language.processor import MultilingualProcessor
from blockchain.evidence.hasher import EvidenceHasher

logger = logging.getLogger("bharat_shield.websocket")

router = APIRouter(tags=["WebSocket Intelligence Stream"])

class IntelligenceStreamManager:
    """Manages active WebSocket connections for live analyst telemetry."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_metadata: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket, role: str = "investigation_bureau", analyst_id: str = "ANALYST-IB"):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_metadata[websocket] = {
            "role": role,
            "analyst_id": analyst_id,
            "connected_at": datetime.now(timezone.utc).isoformat()
        }
        logger.info(f"Analyst client connected via WebSocket: {analyst_id} [{role}] (Active: {len(self.active_connections)})")
        
        # Send initial handshake and stream status
        await websocket.send_json({
            "event": "STREAM_CONNECTED",
            "message": "BHARAT-SHIELD Real-Time Sentinel Stream Connected",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "role": role,
            "active_analysts": len(self.active_connections)
        })

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            meta = self.connection_metadata.pop(websocket, {})
            self.active_connections.remove(websocket)
            logger.info(f"Analyst client disconnected: {meta.get('analyst_id', 'UNKNOWN')} (Remaining: {len(self.active_connections)})")

    async def broadcast_signal(self, signal_payload: Dict[str, Any], target_role: Optional[str] = None):
        """Broadcasts a new intelligence signal to all or role-filtered active connections."""
        if not self.active_connections:
            return

        message = {
            "event": "NEW_SIGNAL_INGESTED",
            "data": signal_payload,
            "broadcast_at": datetime.now(timezone.utc).isoformat()
        }

        disconnected_clients = []
        for connection in self.active_connections:
            meta = self.connection_metadata.get(connection, {})
            client_role = meta.get("role")
            
            # Role matching filter if target_role is specified (investigation_bureau has super-access)
            if target_role and client_role != "investigation_bureau" and client_role != "system_admin" and client_role != target_role:
                continue

            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Error broadcasting to client: {e}")
                disconnected_clients.append(connection)

        for dead_client in disconnected_clients:
            self.disconnect(dead_client)

    async def broadcast_alert(self, alert_type: str, title: str, description: str, severity: str = "HIGH"):
        """Broadcasts high-priority threat alert banner to all clients."""
        if not self.active_connections:
            return

        alert_payload = {
            "event": "THREAT_ALERT",
            "alert": {
                "id": f"ALT-{uuid.uuid4().hex[:6].upper()}",
                "type": alert_type,
                "title": title,
                "description": description,
                "severity": severity,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }

        for connection in list(self.active_connections):
            try:
                await connection.send_json(alert_payload)
            except Exception:
                self.disconnect(connection)

stream_manager = IntelligenceStreamManager()

@router.websocket("/ws/live-signals")
async def websocket_live_signals_endpoint(
    websocket: WebSocket,
    role: str = Query(default="investigation_bureau"),
    analyst_id: str = Query(default="ANALYST-DEF")
):
    """
    WebSocket endpoint for high-frequency signal streaming and live alerts.
    """
    await stream_manager.connect(websocket, role=role, analyst_id=analyst_id)
    try:
        while True:
            # Handle incoming client ping or message
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                if parsed.get("action") == "PING":
                    await websocket.send_json({
                        "event": "PONG",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
            except Exception:
                pass
    except WebSocketDisconnect:
        stream_manager.disconnect(websocket)
    except Exception as e:
        logger.debug(f"WebSocket connection exception: {e}")
        stream_manager.disconnect(websocket)

@router.post("/api/stream/emit-signal")
async def emit_live_signal(signal: Dict[str, Any] = Body(...)):
    """
    REST endpoint to inject an ingested signal directly into the live broadcast stream.
    Used by Telegram Bot, WhatsApp Webhook, or Instagram/Reddit Crawlers.
    """
    raw_text = signal.get("text") or signal.get("raw_payload") or ""
    platform = signal.get("platform") or signal.get("source") or "tipline"
    media_type = signal.get("media_type") or "text"

    sig_id = signal.get("id") or f"SIG-LIVE-{uuid.uuid4().hex[:6].upper()}"
    timestamp = signal.get("timestamp") or datetime.now(timezone.utc).isoformat()

    lang_meta = MultilingualProcessor.detect_language(raw_text)
    risk = RiskAssessmentEngine.evaluate_campaign([{"text": raw_text, "platform": platform}])
    
    enriched_signal = {
        "id": sig_id,
        "platform": platform,
        "raw_payload": raw_text,
        "text": raw_text,
        "media_type": media_type,
        "detected_language": lang_meta.get("language", "en"),
        "confidence_score": 0.94,
        "threat_score": risk.get("base_risk", 75),
        "severity": "CRITICAL" if risk.get("base_risk", 75) >= 80 else "MEDIUM",
        "intent_classification": "coordinated_disinformation",
        "timestamp": timestamp,
        "sha256": EvidenceHasher.compute_sha256_dict({"id": sig_id, "text": raw_text})
    }

    await stream_manager.broadcast_signal(enriched_signal)

    # If critical risk, also emit threat alert
    if enriched_signal["threat_score"] >= 80:
        await stream_manager.broadcast_alert(
            alert_type="CRITICAL_DISINFORMATION_SPIKE",
            title=f"Critical IO Spike on {platform.upper()}",
            description=f"High-threat synchronized narrative detected: '{raw_text[:60]}...'",
            severity="CRITICAL"
        )

    return {"status": "broadcast_success", "signal_id": sig_id, "active_clients": len(stream_manager.active_connections)}

@router.post("/api/stream/simulate-burst")
async def simulate_signal_burst(count: int = Query(default=3, ge=1, le=10)):
    """
    Simulates a live burst of incoming tipline / crawler signals across multiple platforms.
    """
    sample_burst = [
        {
            "platform": "whatsapp",
            "text": "URGENT: All railway server operations down in Northern Zone due to cyber attack. Do not book tickets!",
            "media_type": "audio"
        },
        {
            "platform": "telegram",
            "text": "Breaking: Reserve Bank declares temporary moratorium on private sector digital withdrawals from midnight.",
            "media_type": "text"
        },
        {
            "platform": "instagram",
            "text": "Viral Infographic circulating: Mumbai local train operations suspended for 48 hours. Forward immediately.",
            "media_type": "image"
        },
        {
            "platform": "reddit",
            "text": "PSA: Massive grid outage reported across 4 states, mobile towers going dark.",
            "media_type": "text"
        },
        {
            "platform": "twitter",
            "text": "ALERT: Fake advisory circulating regarding defense exam cancellation. CERT-In investigating.",
            "media_type": "text"
        }
    ]

    emitted = []
    for i in range(min(count, len(sample_burst))):
        s = sample_burst[i]
        res = await emit_live_signal(s)
        emitted.append(res)
        await asyncio.sleep(0.3)

    return {"status": "simulated_burst_complete", "count": len(emitted)}

@router.get("/api/stream/status")
def get_stream_status():
    """Returns real-time WebSocket connection count and health status."""
    return {
        "status": "ONLINE",
        "active_analyst_clients": len(stream_manager.active_connections),
        "protocol": "RFC 6455 WebSocket",
        "channels": ["live_signals", "threat_alerts", "evidence_audit"]
    }
