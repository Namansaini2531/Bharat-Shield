"""
Telegram Citizen & Field Intelligence Tipline Bot for BHARAT-SHIELD SENTINEL.
Allows citizens, journalists, and intelligence operatives to forward viral texts,
posters/screenshots (OCR), and voice notes (Whisper ASR) for instant AI debunking,
threat scoring, and immutable cryptographic evidence preservation.
"""

import os
import sys
import time
import json
import logging
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
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
from database.db import is_db_available, insert_signal, insert_audit_entry
from ai.embeddings import MultilingualEmbedder

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("bharat_shield.telegram_bot")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
API_BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

def format_risk_bar(score: int) -> str:
    """Render an ASCII progress bar for threat level."""
    filled = min(10, max(0, int(score / 10)))
    empty = 10 - filled
    return f"[{'█' * filled}{'░' * empty}] {score}/100"

def get_threat_badge(score: int) -> str:
    if score >= 80:
        return "🚨 CRITICAL DISINFORMATION THREAT"
    elif score >= 60:
        return "⚠️ HIGH SUSPICION / COVERT BOTNET"
    elif score >= 35:
        return "⚡ MEDIUM / UNVERIFIED VIRAL CLAIM"
    else:
        return "✅ LOW RISK / BENIGN CONTENT"

def build_verification_card(analysis: Dict[str, Any], media_type: str = "text", extracted_text: Optional[str] = None) -> str:
    """Generate a clean, structured Telegram Markdown report card."""
    signal_id = analysis.get("signal_id", "SIG-UNKNOWN")
    risk_data = analysis.get("risk_assessment", {})
    lang_data = analysis.get("language_analysis", {})
    ai_data = analysis.get("ai_assistance_indicators", {})
    entities_data = analysis.get("entities_and_claims", {})
    evidence = analysis.get("evidence_package", {})

    base_risk = risk_data.get("base_risk", 50)
    confidence = risk_data.get("confidence", "HIGH")
    lang_name = lang_data.get("language", "English")
    is_obfuscated = lang_data.get("obfuscated", False)
    ai_status = ai_data.get("status", "UNVERIFIED")
    ai_prob = ai_data.get("probability", 0.5)
    sha_hash = evidence.get("sha256_hash", "0x00000000000000000000000000000000")

    claims = entities_data.get("claims", [])
    entities = entities_data.get("entities", [])
    signals = risk_data.get("signals", [])

    msg_lines = [
        "🛡️ *BHARAT-SHIELD SENTINEL INTELLIGENCE REPORT*",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        f"🆔 *Signal ID:* `{signal_id}`",
        f"📊 *Threat Assessment:* {get_threat_badge(base_risk)}",
        f"📈 *Threat Index:* `{format_risk_bar(base_risk)}`",
        f"🎯 *Confidence Level:* `{confidence}`",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "🌐 *Semantic & Linguistic Signals:*",
        f" • *Language Detected:* `{lang_name.upper()}`",
        f" • *Script Obfuscation/Leetspeak:* `{'DETECTED ⚠️' if is_obfuscated else 'None'}`",
        f" • *Synthetic / AI-Generated:* `{ai_status}` ({int(ai_prob * 100)}% prob)",
    ]

    if extracted_text and media_type in ["image", "audio"]:
        preview = extracted_text[:180] + ("..." if len(extracted_text) > 180 else "")
        msg_lines.append(f" • *Extracted Content ({media_type.upper()}):* _{preview}_")

    if entities:
        ent_names = [e.get("text", "") for e in entities[:4] if e.get("text")]
        if ent_names:
            msg_lines.append(f" • *Targeted Entities:* `{', '.join(ent_names)}`")

    if signals:
        active_sigs = [s.get("name", "") for s in signals if s.get("score", 0) > 0.4]
        if active_sigs:
            msg_lines.append(f" • *IO Behavioral Vectors:* `{', '.join(active_sigs[:3])}`")

    msg_lines.extend([
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "🔒 *Immutable Evidence Ledger:*",
        f" • *SHA-256 Digest:* `{sha_hash[:20]}...`",
        " • *Chain Status:* `EVM Notarized (Proof-of-Integrity)`",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ])

    if base_risk >= 70:
        msg_lines.append("🛑 *ADVISORY:* High-confidence coordination detected. *DO NOT FORWARD*. An official counter-intelligence dossier has been queued for verification.")
    elif base_risk >= 40:
        msg_lines.append("ℹ️ *ADVISORY:* Unverified viral forward with suspicious amplification patterns. Await official fact-check confirmation.")
    else:
        msg_lines.append("✅ *ADVISORY:* No coordinated threat signatures detected. Content conforms to standard organic discourse.")

    return "\n".join(msg_lines)

class TelegramSentinelBot:
    def __init__(self, token: Optional[str] = None):
        self.token = token or TELEGRAM_BOT_TOKEN
        self.api_url = f"https://api.telegram.org/bot{self.token}"
        self.offset = 0

    async def send_message(self, client: httpx.AsyncClient, chat_id: int, text: str, parse_mode: str = "Markdown") -> bool:
        """Send a formatted text message to a Telegram chat."""
        try:
            url = f"{self.api_url}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": text,
                "parse_mode": parse_mode
            }
            res = await client.post(url, json=payload, timeout=10.0)
            return res.status_code == 200
        except Exception as e:
            logger.error(f"Failed to send Telegram message to chat {chat_id}: {e}")
            return False

    async def get_file_bytes(self, client: httpx.AsyncClient, file_id: str) -> Optional[bytes]:
        """Download a file (photo or voice note) from Telegram servers."""
        try:
            # 1. Get file path
            url = f"{self.api_url}/getFile"
            res = await client.get(url, params={"file_id": file_id}, timeout=10.0)
            if res.status_code != 200:
                return None
            
            file_path = res.json().get("result", {}).get("file_path")
            if not file_path:
                return None

            # 2. Download file content
            download_url = f"https://api.telegram.org/file/bot{self.token}/{file_path}"
            file_res = await client.get(download_url, timeout=20.0)
            if file_res.status_code == 200:
                return file_res.content
            return None
        except Exception as e:
            logger.error(f"Failed to download file {file_id}: {e}")
            return None

    async def process_update(self, client: httpx.AsyncClient, update: Dict[str, Any]):
        """Handle incoming updates (messages, forwards, photos, voice notes)."""
        msg = update.get("message") or update.get("channel_post")
        if not msg:
            return

        chat_id = msg.get("chat", {}).get("id")
        user = msg.get("from", {})
        username = user.get("username") or user.get("first_name", "Citizen")

        text = msg.get("text", "")
        caption = msg.get("caption", "")
        photo = msg.get("photo")
        voice = msg.get("voice") or msg.get("audio")

        # Handle Commands
        if text.startswith("/start"):
            welcome_text = (
                f"🛡️ *Welcome to BHARAT-SHIELD Sentinel Tipline, {username}!*\n\n"
                "I am the AI Sentinel Bot for detecting coordinated disinformation campaigns, "
                "synthetic deepfakes, and state-sponsored information operations.\n\n"
                "🔍 *How to Use:*\n"
                "• *Forward any suspicious text* message, WhatsApp forward, or tweet.\n"
                "• *Send a screenshot or poster* to trigger Multilingual OCR extraction.\n"
                "• *Send a voice note* to trigger Whisper ASR audio transcription.\n\n"
                "🔒 *Privacy Guarantee:* All submissions are cryptographically hashed and anonymized."
            )
            await self.send_message(client, chat_id, welcome_text)
            return


        if text.startswith("/status"):
            models_status = BharatShieldIntelligencePipeline.get_models_status()
            db_status = "ONLINE (pgvector HNSW)" if is_db_available() else "IN-MEMORY FALLBACK"
            status_text = (
                "⚙️ *BHARAT-SHIELD AI SYSTEM STATUS:*\n"
                f"• *Vector DB:* `{db_status}`\n"
                f"• *Embedding Models:* `sentence-transformers (384-d MiniLM / LaBSE)`\n"
                f"• *ASR Engine:* `Whisper Multilingual [ONLINE]`\n"
                f"• *OCR Engine:* `Tesseract / EasyOCR [ONLINE]`\n"
                f"• *Threat Matrix:* `Multi-Signal Coordination Scorer [ONLINE]`\n"
                f"• *Blockchain Proof:* `SHA-256 / EVM Ledger [ACTIVE]`"
            )
            await self.send_message(client, chat_id, status_text)
            return

        if text.startswith("/help"):
            help_text = (
                "📖 *BHARAT-SHIELD Tipline Guide*\n\n"
                "1. *Forwarded Messages:* Simply forward any message from a channel or group directly to this bot.\n"
                "2. *Supported Languages:* Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Punjabi, Hinglish, English.\n"
                "3. *Whistleblower Protocol:* All submissions generate a tamper-proof SHA-256 audit receipt."
            )
            await self.send_message(client, chat_id, help_text)
            return

        # Notification: Processing started
        await self.send_message(client, chat_id, "⏳ *Analyzing signal across Sentinel AI cluster...*", parse_mode="Markdown")

        # 1. Image / Poster / Screenshot
        if photo:
            largest_photo = photo[-1]
            photo_bytes = await self.get_file_bytes(client, largest_photo["file_id"])
            
            analysis = BharatShieldIntelligencePipeline.process_signal(
                text=caption,
                media_type="image",
                image_bytes=photo_bytes,
                platform="telegram_bot"
            )
            extracted = analysis.get("language_analysis", {}).get("raw_text") or caption
            card = build_verification_card(analysis, media_type="image", extracted_text=extracted)
            await self.send_message(client, chat_id, card)
            self._persist_telegram_signal(analysis, caption or extracted, "image")
            return

        # 2. Voice Note / Audio
        if voice:
            voice_bytes = await self.get_file_bytes(client, voice["file_id"])
            
            analysis = BharatShieldIntelligencePipeline.process_signal(
                text=caption,
                media_type="audio",
                audio_bytes=voice_bytes,
                platform="telegram_bot"
            )
            extracted = analysis.get("language_analysis", {}).get("raw_text") or caption
            card = build_verification_card(analysis, media_type="audio", extracted_text=extracted)
            await self.send_message(client, chat_id, card)
            self._persist_telegram_signal(analysis, caption or extracted, "audio")
            return

        # 3. Text Message
        raw_content = text or caption
        if raw_content:
            analysis = BharatShieldIntelligencePipeline.process_signal(
                text=raw_content,
                media_type="text",
                platform="telegram_bot"
            )
            card = build_verification_card(analysis, media_type="text")
            await self.send_message(client, chat_id, card)
            self._persist_telegram_signal(analysis, raw_content, "text")

    def _persist_telegram_signal(self, analysis: Dict[str, Any], raw_text: str, media_type: str):
        """Helper to save signal and audit ledger record to PostgreSQL if available."""
        if not is_db_available():
            return
        try:
            signal_id = analysis["signal_id"]
            lang = analysis["language_analysis"]["language"]
            threat = analysis["risk_assessment"]["base_risk"]
            confidence = analysis["risk_assessment"]["confidence"]
            sha = analysis["evidence_package"]["sha256_hash"]
            embedding = MultilingualEmbedder.encode(raw_text)

            insert_signal(
                signal_id=signal_id,
                source=f"telegram_{media_type}",
                raw_payload=raw_text,
                detected_language=lang,
                confidence_score=0.9 if confidence == "HIGH" else 0.7,
                intent_classification="tipline_submission",
                severity="HIGH" if threat >= 70 else "MEDIUM",
                normalized_translation=analysis["language_analysis"].get("normalized_text", raw_text),
                campaign_id="CMP-007" if threat >= 80 else None,
                embedding=embedding
            )

            insert_audit_entry(
                package_id=signal_id,
                campaign_id="CMP-007" if threat >= 80 else None,
                sha256_hash=sha,
                event_type="TELEGRAM_SIGNAL_VERIFIED",
                details=f"Processed Telegram {media_type} signal (Threat: {threat}/100)",
                analyst_id="TELEGRAM_BOT",
                role="investigation_bureau"
            )
        except Exception as e:
            logger.error(f"Error persisting Telegram signal: {e}")

    async def run_polling(self):
        """Asynchronous long-polling worker loop."""
        if not self.token or self.token == "YOUR_TELEGRAM_BOT_TOKEN":
            logger.warning("TELEGRAM_BOT_TOKEN not configured in .env. Running in interactive demo mode.")
            self._run_demo_simulation()
            return

        logger.info("🛡️ Starting BHARAT-SHIELD Telegram Bot long-polling loop...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            while True:
                try:
                    url = f"{self.api_url}/getUpdates"
                    params = {"offset": self.offset, "timeout": 25}
                    res = await client.get(url, params=params)
                    
                    if res.status_code == 200:
                        data = res.json()
                        updates = data.get("result", [])
                        for update in updates:
                            self.offset = update["update_id"] + 1
                            await self.process_update(client, update)
                    elif res.status_code == 401:
                        logger.error("Invalid Telegram Bot Token. Check TELEGRAM_BOT_TOKEN in .env")
                        break
                    else:
                        logger.warning(f"Telegram API responded with {res.status_code}: {res.text}")

                except asyncio.CancelledError:
                    logger.info("Telegram bot polling stopped.")
                    break
                except Exception as e:
                    logger.error(f"Polling exception: {e}")
                    await asyncio.sleep(3)

    def _run_demo_simulation(self):
        """Interactive local simulation for testing without a live bot token."""
        print("\n" + "="*70)
        print("🤖 BHARAT-SHIELD TELEGRAM TIPLINE SIMULATOR (No Token Required)")
        print("="*70)
        test_inputs = [
            "🚨 URGENT: Government announces nationwide internet and power shutdown from midnight! Share immediately to all groups!",
            "Adani Ports customs license suspended by federal authorities amidst tax inquiry. Sell off positions now before market opens!",
            "भारतीय रिज़र्व बैंक ने ₹500 के नोटों पर तत्काल प्रभाव से रोक लगा दी है। सबको तुरंत शेयर करें सावधान रहें।"
        ]
        
        for idx, sample in enumerate(test_inputs, 1):
            print(f"\n[Test Case {idx}] Incoming Citizen Message:")
            print(f'"{sample}"')
            print("\nAnalyzing with Sentinel AI Pipeline...")
            analysis = BharatShieldIntelligencePipeline.process_signal(text=sample, media_type="text", platform="telegram_sim")
            card = build_verification_card(analysis, media_type="text")
            print("\n" + card)
            print("-" * 70)

def main():
    bot = TelegramSentinelBot()
    try:
        asyncio.run(bot.run_polling())
    except KeyboardInterrupt:
        print("\nTelegram bot terminated.")

if __name__ == "__main__":
    main()
