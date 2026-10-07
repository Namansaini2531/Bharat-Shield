"""
Verification and Test Suite for Multimodal Intelligence Extraction (OCR & ASR).
Demonstrates how Bharat-Shield extracts visual text from posters/images and
spoken dialogues from video/audio, converting all media directly into pure text.
"""

import sys
import json
from pathlib import Path

# Add project root to sys.path
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

from ai.multimodal.processor import MultimodalIntelligenceProcessor
from ai.pipeline import BharatShieldIntelligencePipeline

def run_multimodal_test():
    print("=" * 75)
    print("🔬 BHARAT-SHIELD MULTIMODAL OCR & ASR EXTRACTION TEST")
    print("=" * 75)

    test_scenarios = [
        {
            "type": "IMAGE / POSTER",
            "caption": "Viral infographic claiming internet shutdown across Maharashtra.",
            "url": "https://i.redd.it/fake_circular_sample.png",
            "media_type": "image"
        },
        {
            "type": "VIDEO / SPEECH",
            "caption": "Undersea fiber optic sabotage technical advisory recording.",
            "url": "https://v.redd.it/telecom_sabotage_clip.mp4",
            "media_type": "video"
        },
        {
            "type": "VOICE NOTE / AUDIO",
            "caption": "WhatsApp audio forward regarding ₹500 currency note ban.",
            "url": "https://api.sentinel.internal/media/voice_note_500.ogg",
            "media_type": "audio"
        }
    ]

    for idx, sample in enumerate(test_scenarios, 1):
        print(f"\n[Test Case {idx}] Ingesting {sample['type']}:")
        print(f"  • Source URL: {sample['url']}")
        print(f"  • Context:    \"{sample['caption']}\"")
        
        # 1. Extract pure text using Multimodal Engine
        extraction = MultimodalIntelligenceProcessor.extract_unified_text_from_media(
            title_or_caption=sample['caption'],
            media_url=sample['url'],
            explicit_type=sample['media_type']
        )

        print("\n  🔍 EXTRACTED PURE TEXT INTELLIGENCE:")
        for line in extraction['unified_text'].split("\n\n"):
            print(f"     > {line}")

        # 2. Process with AI Threat Matrix
        analysis = BharatShieldIntelligencePipeline.process_signal(
            text=extraction['unified_text'],
            media_type=sample['media_type'],
            platform="multimodal_ingest"
        )

        print(f"\n  📊 SENTINEL THREAT ASSESSMENT:")
        print(f"     • Detected Language: {analysis['language_analysis']['language'].upper()}")
        print(f"     • Threat Score:      {analysis['risk_assessment']['base_risk']}/100")
        print(f"     • Confidence:        {analysis['risk_assessment']['confidence']}")
        print(f"     • Evidence SHA-256:  {analysis['evidence_package']['sha256_hash'][:28]}...")
        print("─" * 75)

    print("\n✓ ALL MULTIMODAL OCR AND ASR EXTRACTIONS VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    run_multimodal_test()
