"""
Unified Multimodal Ingestion Engine for BHARAT-SHIELD.
Downloads and processes photos, memes, infographics, screenshots, video streams,
and voice notes from Reddit, Telegram, WhatsApp, Twitter, and Web sources.
Runs Optical Character Recognition (OCR) on visual media and Automatic Speech
Recognition (ASR) on audio/video tracks to convert all media directly into pure,
analyzable intelligence text.
"""

import os
import sys
import io
import re
import uuid
import hashlib
import logging
import tempfile
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, List

import httpx
from PIL import Image

from ai.ocr.extractor import ImageOCRExtractor
from ai.asr.transcriber import VoiceNoteTranscriber

logger = logging.getLogger("bharat_shield.multimodal")

# Supported media extensions
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff", ".gif"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".opus"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".webm", ".avi"}

class MultimodalIntelligenceProcessor:
    """
    Directly converts multimodal media (Photos & Videos) into unified textual intelligence:
      1. Images/Posters -> Optical Character Recognition (OCR) -> Text
      2. Videos/Audio   -> Audio Demuxing + Whisper ASR      -> Text
    """

    @classmethod
    def detect_media_type(cls, url_or_path: str) -> str:
        """Classify media into 'image', 'video', 'audio', or 'text' based on URL/path."""
        url_lower = url_or_path.lower().split("?")[0]
        ext = Path(url_lower).suffix

        if ext in IMAGE_EXTENSIONS or "i.redd.it" in url_lower or "imgur.com" in url_lower or "photo" in url_lower:
            return "image"
        elif ext in VIDEO_EXTENSIONS or "v.redd.it" in url_lower or "video" in url_lower or "youtube" in url_lower or "youtu.be" in url_lower:
            return "video"
        elif ext in AUDIO_EXTENSIONS or "voice" in url_lower or "audio" in url_lower:
            return "audio"
        return "text"

    @classmethod
    def download_media_bytes(cls, url: str) -> Tuple[Optional[bytes], str]:
        """Download remote media file into memory with SHA-256 fingerprinting."""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            with httpx.Client(headers=headers, timeout=20.0, follow_redirects=True) as client:
                res = client.get(url)
                if res.status_code == 200:
                    raw_bytes = res.content
                    sha256_digest = hashlib.sha256(raw_bytes).hexdigest()
                    return raw_bytes, sha256_digest
                else:
                    logger.warning(f"Failed to download media from {url} (HTTP {res.status_code})")
                    return None, ""
        except Exception as e:
            logger.error(f"Media download exception for {url}: {e}")
            return None, ""

    @classmethod
    def process_image(cls, image_bytes_or_path, source_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Runs OCR directly on images/posters/screenshots to extract all embedded text.
        """
        sha256_hash = ""
        raw_bytes = None

        if isinstance(image_bytes_or_path, bytes):
            raw_bytes = image_bytes_or_path
            sha256_hash = hashlib.sha256(raw_bytes).hexdigest()
        elif isinstance(image_bytes_or_path, (str, Path)) and os.path.exists(image_bytes_or_path):
            with open(image_bytes_or_path, "rb") as f:
                raw_bytes = f.read()
            sha256_hash = hashlib.sha256(raw_bytes).hexdigest()
        elif source_url:
            raw_bytes, sha256_hash = cls.download_media_bytes(source_url)

        ocr_result = ImageOCRExtractor.extract_text(raw_bytes or b"")
        extracted_text = ocr_result.get("extracted_text", "").strip()

        return {
            "media_type": "image",
            "source_url": source_url or "",
            "media_sha256": sha256_hash,
            "ocr_engine": ocr_result.get("engine", "pytesseract"),
            "extracted_text": extracted_text,
            "has_extracted_text": bool(extracted_text),
            "confidence": ocr_result.get("confidence", 0.85)
        }

    @classmethod
    def process_video_or_audio(cls, audio_or_video_bytes_or_path, source_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Runs speech-to-text (ASR) on videos/voice notes to extract spoken words into text.
        """
        sha256_hash = ""
        raw_bytes = None

        if isinstance(audio_or_video_bytes_or_path, bytes):
            raw_bytes = audio_or_video_bytes_or_path
            sha256_hash = hashlib.sha256(raw_bytes).hexdigest()
        elif isinstance(audio_or_video_bytes_or_path, (str, Path)) and os.path.exists(audio_or_video_bytes_or_path):
            with open(audio_or_video_bytes_or_path, "rb") as f:
                raw_bytes = f.read()
            sha256_hash = hashlib.sha256(raw_bytes).hexdigest()
        elif source_url:
            raw_bytes, sha256_hash = cls.download_media_bytes(source_url)

        # Write to temporary file for Whisper / ASR ingestion
        asr_result = {}
        temp_audio_path = None
        try:
            if raw_bytes:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                    tmp.write(raw_bytes)
                    temp_audio_path = tmp.name
                asr_result = VoiceNoteTranscriber.transcribe(temp_audio_path)
            else:
                asr_result = VoiceNoteTranscriber.transcribe(b"")
        finally:
            if temp_audio_path and os.path.exists(temp_audio_path):
                try:
                    os.remove(temp_audio_path)
                except Exception:
                    pass

        transcript = asr_result.get("transcript", "").strip()

        return {
            "media_type": "video_audio",
            "source_url": source_url or "",
            "media_sha256": sha256_hash,
            "asr_engine": asr_result.get("engine", "whisper_asr"),
            "extracted_transcript": transcript,
            "has_transcript": bool(transcript),
            "detected_language": asr_result.get("language", "hi-Latn"),
            "confidence": asr_result.get("confidence", 0.86)
        }

    @classmethod
    def extract_unified_text_from_media(
        cls,
        title_or_caption: str = "",
        media_url: Optional[str] = None,
        media_bytes: Optional[bytes] = None,
        explicit_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Universal extraction pipeline:
        Takes any media URL or raw bytes -> Runs OCR and/or ASR -> Returns pure combined text!
        """
        detected_type = explicit_type or (cls.detect_media_type(media_url) if media_url else "text")
        
        ocr_data = None
        asr_data = None
        text_components = []

        if title_or_caption and title_or_caption.strip():
            text_components.append(title_or_caption.strip())

        if detected_type == "image":
            ocr_data = cls.process_image(media_bytes or b"", source_url=media_url)
            if ocr_data.get("extracted_text"):
                text_components.append(f"[Visual Text OCR]: {ocr_data['extracted_text']}")

        elif detected_type in ["video", "audio"]:
            asr_data = cls.process_video_or_audio(media_bytes or b"", source_url=media_url)
            if asr_data.get("extracted_transcript"):
                text_components.append(f"[Spoken Audio Transcript]: {asr_data['extracted_transcript']}")

        unified_text = "\n\n".join(text_components).strip()

        return {
            "media_type": detected_type,
            "media_url": media_url or "",
            "has_multimodal_extracted_content": bool(ocr_data or asr_data),
            "ocr_result": ocr_data,
            "asr_result": asr_data,
            "unified_text": unified_text
        }
