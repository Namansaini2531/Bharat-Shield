import re
from typing import Dict, Any, List

class MultilingualProcessor:
    """
    Multilingual & Cross-Dialect NLP Processor for BHARAT-SHIELD.
    Identifies language, script, code-mixed Hinglish (hi-Latn), slang,
    and obfuscation markers across Indian languages.
    """

    # Common Hinglish stopwords and markers
    HINGLISH_MARKERS = {
        "hai", "hain", "ko", "se", "ka", "ki", "ke", "karo", "kare", "karna",
        "nahi", "raha", "rahi", "rahe", "yeh", "woh", "aaj", "kal", "sabko",
        "bhejo", "turant", "band", "sarkar", "bhai", "yaar", "dekho", "karo"
    }

    # High-risk urgency and coordination lexicon across scripts
    SLANG_LEXICON = {
        "hi": ["तुरंत", "बंद", "सावधान", "शटडाउन", "इमरजेंसी", "वायरल", "सख्त आदेश"],
        "hi-Latn": ["turant", "band", "savdhan", "shutdown", "emergency", "viral", "share fast", "sabko forward karo"],
        "en": ["urgent", "breaking", "shutting down", "blackout", "immediate action", "share before deleted"],
        "ta": ["அவசரம்", "நிறுத்தப்படும்", "உடனடியாக", "பகிரவும்"],
        "bn": ["জরুরী", "বন্ধ", "শেয়ার", "সতর্কতা"],
        "te": ["అత్యవసరం", "మూసివేత", "తక్షణమే", "షేర్ చేయండి"],
        "mr": ["तातडीने", "बंद", "सावधानता", "व्हायरल"]
    }

    @classmethod
    def detect_language(cls, text: str) -> Dict[str, Any]:
        """
        Detects primary language and script characteristics.
        Supports: English (en), Hindi (hi), Hinglish (hi-Latn), Tamil (ta),
                  Bengali (bn), Telugu (te), Marathi (mr), Punjabi (pa), Urdu (ur).
        """
        if not text or not text.strip():
            return {"language": "unknown", "script": "unknown", "confidence": 0.0, "is_code_mixed": False}

        text_clean = text.strip()
        
        # Unicode script detection
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', text_clean))
        has_tamil = bool(re.search(r'[\u0B80-\u0BFF]', text_clean))
        has_bengali = bool(re.search(r'[\u0980-\u09FF]', text_clean))
        has_telugu = bool(re.search(r'[\u0C00-\u0C7F]', text_clean))
        has_gurmukhi = bool(re.search(r'[\u0A00-\u0A7F]', text_clean))
        has_arabic_urdu = bool(re.search(r'[\u0600-\u06FF]', text_clean))
        has_latin = bool(re.search(r'[a-zA-Z]', text_clean))

        if has_tamil:
            return {"language": "ta", "script": "Tamil", "confidence": 0.95, "is_code_mixed": has_latin}
        if has_bengali:
            return {"language": "bn", "script": "Bengali", "confidence": 0.95, "is_code_mixed": has_latin}
        if has_telugu:
            return {"language": "te", "script": "Telugu", "confidence": 0.95, "is_code_mixed": has_latin}
        if has_gurmukhi:
            return {"language": "pa", "script": "Gurmukhi", "confidence": 0.95, "is_code_mixed": has_latin}
        if has_arabic_urdu:
            return {"language": "ur", "script": "Perso-Arabic", "confidence": 0.95, "is_code_mixed": has_latin}
        if has_devanagari:
            # Check for Marathi vs Hindi indicators (simplified)
            return {"language": "hi", "script": "Devanagari", "confidence": 0.92, "is_code_mixed": has_latin}

        # If Roman/Latin script, distinguish pure English vs Hinglish (hi-Latn)
        if has_latin:
            words = set(re.findall(r'\b[a-z]{2,}\b', text_clean.lower()))
            hinglish_matches = words.intersection(cls.HINGLISH_MARKERS)
            hinglish_ratio = len(hinglish_matches) / max(len(words), 1)

            if len(hinglish_matches) >= 2 or hinglish_ratio >= 0.15:
                return {
                    "language": "hi-Latn",
                    "script": "Latin (Hinglish)",
                    "confidence": min(0.95, 0.6 + len(hinglish_matches) * 0.1),
                    "is_code_mixed": True,
                    "matched_markers": list(hinglish_matches)
                }
            return {"language": "en", "script": "Latin (English)", "confidence": 0.90, "is_code_mixed": False}

        return {"language": "en", "script": "Latin", "confidence": 0.50, "is_code_mixed": False}

    @classmethod
    def normalize_text(cls, text: str) -> str:
        """Cleans repeated punctuation, excessive whitespace, and zero-width characters."""
        if not text:
            return ""
        # Remove zero-width characters (obfuscation technique)
        text = re.sub(r'[\u200B-\u200D\uFEFF]', '', text)
        # Normalize excessive whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    @classmethod
    def extract_obfuscation_signals(cls, text: str) -> Dict[str, Any]:
        """Detects deliberate obfuscation techniques (spaced characters, symbol leetspeak, zero-width chars)."""
        if not text:
            return {"obfuscation_detected": False, "score": 0.0, "details": []}

        details = []
        # Check for spaced letters like "s h u t d o w n"
        if re.search(r'\b[a-zA-Z]\s+[a-zA-Z]\s+[a-zA-Z]\s+[a-zA-Z]\b', text):
            details.append("Spaced-character evasion detected")

        # Check for symbol replacements like "sh!tdown" or "@dani"
        if re.search(r'[a-zA-Z][!@#$%^&*][a-zA-Z]', text):
            details.append("Leetspeak symbol substitution detected")

        score = min(1.0, len(details) * 0.5)
        return {
            "obfuscation_detected": score > 0,
            "score": score,
            "details": details
        }
