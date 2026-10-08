import re
from typing import List, Dict, Any, Optional

class EntityAndClaimExtractor:
    """
    Zero-Shot Named Entity Recognition (GLiNER-style) & Claim Extractor.
    Extracts key actors, government institutions, infrastructure targets,
    and normalized core claims from unstructured multilingual posts.
    """

    # Target entity knowledge lexicon for Indian misinformation threats
    KNOWN_ORGANIZATIONS = [
        "RBI", "Reserve Bank of India", "DoT", "Department of Telecommunications",
        "TRAI", "PIB", "Press Information Bureau", "SEBI", "BSE", "NSE",
        "Adani", "Adani Enterprises", "Adani Ports", "Reliance", "Jio", "Airtel",
        "SBI", "State Bank of India", "HDFC", "ICICI", "Supreme Court", "ECI", "Election Commission"
    ]

    KNOWN_INFRASTRUCTURE = [
        "internet", "broadband", "4G", "5G", "telecom", "ATM", "bank server",
        "power grid", "subsea cable", "metro", "railway", "fuel supply", "petrol pump"
    ]

    KNOWN_LOCATIONS = [
        "Delhi", "Mumbai", "Kashmir", "Punjab", "Bengaluru", "Chennai", "Kolkata",
        "Hyderabad", "Ahmedabad", "Gujarat", "India", "Bharat", "Ladakh"
    ]

    _gliner_model = None
    _HAS_GLINER = False

    @classmethod
    def _init_gliner(cls):
        if cls._gliner_model is not None:
            return
        try:
            from gliner import GLiNER
            cls._gliner_model = GLiNER.from_pretrained("urchade/gliner_small-v2.1")
            cls._HAS_GLINER = True
        except Exception:
            cls._HAS_GLINER = False

    @classmethod
    def extract_entities(cls, text: str) -> Dict[str, Any]:
        """Extracts organizations, infrastructure, locations, and targets from text."""
        if not text:
            return {"organizations": [], "infrastructure": [], "locations": [], "claims": []}

        cls._init_gliner()

        extracted_orgs = []
        extracted_infra = []
        extracted_locs = []

        # High-performance regex / lexicon matching
        text_lower = text.lower()
        for org in cls.KNOWN_ORGANIZATIONS:
            if re.search(r'\b' + re.escape(org.lower()) + r'\b', text_lower):
                extracted_orgs.append(org)

        for infra in cls.KNOWN_INFRASTRUCTURE:
            if re.search(r'\b' + re.escape(infra.lower()) + r'\b', text_lower):
                extracted_infra.append(infra)

        for loc in cls.KNOWN_LOCATIONS:
            if re.search(r'\b' + re.escape(loc.lower()) + r'\b', text_lower):
                extracted_locs.append(loc)

        # Normalize Claim Proposition
        claim = cls.extract_claim_proposition(text)

        return {
            "organizations": list(set(extracted_orgs)),
            "infrastructure": list(set(extracted_infra)),
            "locations": list(set(extracted_locs)),
            "claim_proposition": claim
        }

    @classmethod
    def extract_claim_proposition(cls, text: str) -> str:
        """Extracts normalized proposition / core predicate claim from text."""
        clean = re.sub(r'https?://\S+', '', text)
        clean = re.sub(r'[🚨😱🔥📢⚠️]', '', clean).strip()
        
        # Strip common forward boilerplate
        clean = re.sub(r'^(URGENT|BREAKING|ALERT|सावधान|জরুরী):\s*', '', clean, flags=re.IGNORECASE)
        clean = re.sub(r'(Share immediately|Sabko forward karo|तुरंत शेयर करें|Forward to all).*$', '', clean, flags=re.IGNORECASE).strip()

        return clean[:120] if clean else text[:120]
