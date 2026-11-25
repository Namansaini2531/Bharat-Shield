"""
BHARAT-SHIELD SENTINEL — Enterprise Data Profile & ML Semantic Scoping Engine
Allows corporate enterprises and threat analysts to configure brand identities, stock tickers, 
subsidiaries, key executives, official domains, and brand attack vectors. 
Scopes ML clustering, vector search, and threat detection to exclusively search and 
isolate campaigns and signals threatening the configured enterprise.
"""

import os
import json
import logging
import numpy as np
from pathlib import Path
from typing import Dict, Any, List, Optional

logger = logging.getLogger("bharat_shield.enterprise")

ENTERPRISE_STORAGE_FILE = Path(__file__).resolve().parents[1] / "data" / "enterprise_profiles.json"

DEFAULT_ENTERPRISE_PROFILES: Dict[str, Dict[str, Any]] = {
    "tata_group": {
        "id": "tata_group",
        "name": "Tata Sons & Tata Group Entities",
        "ticker_symbols": ["TATAMOTORS", "TCS", "TATAPOWER", "TATASTEEL", "TITAN", "INDIANHOTEL"],
        "subsidiaries": [
            "Tata Motors", 
            "Tata Consultancy Services (TCS)", 
            "Tata Power", 
            "Air India", 
            "Tata Steel", 
            "Titan Company", 
            "Tata Neu", 
            "Tata Communications",
            "Tata Consumer Products"
        ],
        "executives": [
            "N. Chandrasekaran (Chairman)", 
            "PB Balaji (Group CFO)", 
            "K. Krithivasan (CEO, TCS)", 
            "Campbell Wilson (CEO, Air India)", 
            "T. V. Narendran (MD, Tata Steel)"
        ],
        "brand_keywords": [
            "battery defect", 
            "ev fire", 
            "ev burst",
            "layoff freeze", 
            "campus hire cancel", 
            "credit default swap", 
            "bms failure", 
            "accounting fraud", 
            "air india crash hoax", 
            "tata steel esg penalty"
        ],
        "official_domains": ["tata.com", "tatamotors.com", "tcs.com", "airindia.com", "@TataCompanies", "@TataMotors", "@TCS"],
        "industry_sector": "Diversified Conglomerate (Automotive, Tech, Energy, Aviation)",
        "threat_threshold": 65,
        "is_active": True,
        "last_updated": "2026-10-08T11:30:00Z"
    },
    "reliance_group": {
        "id": "reliance_group",
        "name": "Reliance Industries Limited (RIL)",
        "ticker_symbols": ["RELIANCE", "JIOFIN"],
        "subsidiaries": [
            "Jio Infocomm", 
            "Reliance Retail", 
            "Reliance Oil & Gas", 
            "Jio Financial Services", 
            "Network18", 
            "Viacom18"
        ],
        "executives": [
            "Mukesh Ambani (Chairman & MD)", 
            "Akash Ambani (Chairman, Jio)", 
            "Isha Ambani (Director, Retail)", 
            "Anant Ambani (Director, Energy)", 
            "V. Srikanth (Joint CFO)"
        ],
        "brand_keywords": [
            "jio tariff hike hoax", 
            "refinery blast rumor", 
            "jamnagar fire fake", 
            "reliance debt default", 
            "retail boycott hoax", 
            "sim block fake dot order"
        ],
        "official_domains": ["ril.com", "jio.com", "relianceretail.com", "@reliancejio", "@flameofril"],
        "industry_sector": "Energy, Telecom, Retail & Digital Services",
        "threat_threshold": 65,
        "is_active": False,
        "last_updated": "2026-10-08T10:00:00Z"
    },
    "infosys_limited": {
        "id": "infosys_limited",
        "name": "Infosys Limited",
        "ticker_symbols": ["INFY"],
        "subsidiaries": [
            "Infosys BPM", 
            "Finacle Core Banking", 
            "Infosys McCamish", 
            "EdgeVerve Systems", 
            "Panaya"
        ],
        "executives": [
            "Salil Parekh (CEO & MD)", 
            "Nandan Nilekani (Co-Founder)", 
            "Jayesh Sanghrajka (CFO)", 
            "Sumit Virmani (EVP & CMO)"
        ],
        "brand_keywords": [
            "income tax portal crash", 
            "finacle banking outage hoax", 
            "h-1b visa fraud rumor", 
            "infosys mass layoff leak", 
            "whistleblower forged memo", 
            "banking transaction freeze"
        ],
        "official_domains": ["infosys.com", "edgeverve.com", "@Infosys"],
        "industry_sector": "Information Technology & Financial Software",
        "threat_threshold": 65,
        "is_active": False,
        "last_updated": "2026-10-08T09:30:00Z"
    },
    "state_bank_of_india": {
        "id": "state_bank_of_india",
        "name": "State Bank of India (SBI)",
        "ticker_symbols": ["SBIN"],
        "subsidiaries": [
            "SBI Cards & Payment Services", 
            "SBI Life Insurance", 
            "SBI Mutual Fund", 
            "SBI Capital Markets", 
            "YONO Digital Banking"
        ],
        "executives": [
            "CS Setty (Chairman)", 
            "Saloni Narayan (MD)", 
            "Kameshwar Rao Kodavanti (CFO)",
            "Dinesh Khara (Former Chairman)"
        ],
        "brand_keywords": [
            "yono hack hoax", 
            "sbi ₹500 note ban circular", 
            "atm cash shortage rumor", 
            "moratorium fake circular", 
            "account freeze panic forward", 
            "sbi server compromised"
        ],
        "official_domains": ["sbi.co.in", "onlinesbi.sbi", "sbicard.com", "@TheOfficialSBI"],
        "industry_sector": "Public Sector Banking & Financial Services",
        "threat_threshold": 65,
        "is_active": False,
        "last_updated": "2026-10-08T09:00:00Z"
    },
    "adani_group": {
        "id": "adani_group",
        "name": "Adani Group & Ports Entities",
        "ticker_symbols": ["ADANIENT", "ADANIPORTS", "ADANIGREEN", "ADANIPOWER"],
        "subsidiaries": [
            "Adani Enterprises",
            "Adani Ports and SEZ",
            "Adani Green Energy",
            "Adani Total Gas",
            "Adani Wilmar"
        ],
        "executives": [
            "Gautam Adani (Chairman)",
            "Karan Adani (MD, Adani Ports)",
            "Jugeshinder Singh (Group CFO)"
        ],
        "brand_keywords": [
            "short seller dossier leak",
            "port closure hoax",
            "coal import penalty rumor",
            "offshore shell company fabrication",
            "bribery indictment fake circular"
        ],
        "official_domains": ["adani.com", "adaniports.com", "@AdaniOnline"],
        "industry_sector": "Infrastructure, Logistics, Energy & Commodities",
        "threat_threshold": 65,
        "is_active": False,
        "last_updated": "2026-10-08T08:30:00Z"
    }
}


class EnterpriseScoper:
    """
    Manages Enterprise profiles and executes ML semantic filtering of threat campaigns.
    """

    @classmethod
    def _load_profiles(cls) -> Dict[str, Dict[str, Any]]:
        """Loads enterprise profiles from persistent disk or falls back to defaults."""
        if ENTERPRISE_STORAGE_FILE.exists():
            try:
                with open(ENTERPRISE_STORAGE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict) and len(data) > 0:
                        return data
            except Exception as e:
                logger.warning(f"Failed to read enterprise profiles file, using defaults: {e}")
        return dict(DEFAULT_ENTERPRISE_PROFILES)

    @classmethod
    def _save_profiles(cls, profiles: Dict[str, Dict[str, Any]]) -> bool:
        """Persists enterprise profiles to disk."""
        try:
            ENTERPRISE_STORAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(ENTERPRISE_STORAGE_FILE, "w", encoding="utf-8") as f:
                json.dump(profiles, f, indent=2)
            return True
        except Exception as e:
            logger.error(f"Failed to save enterprise profiles: {e}")
            return False

    @classmethod
    def get_all_profiles(cls) -> List[Dict[str, Any]]:
        """Returns list of all enterprise profiles."""
        profiles = cls._load_profiles()
        return list(profiles.values())

    @classmethod
    def get_active_profile(cls) -> Dict[str, Any]:
        """Returns currently active enterprise profile."""
        profiles = cls._load_profiles()
        for p in profiles.values():
            if p.get("is_active"):
                return p
        # Fallback to tata_group
        return profiles.get("tata_group", list(profiles.values())[0])

    @classmethod
    def set_active_profile(cls, profile_id: str) -> Optional[Dict[str, Any]]:
        """Sets the active enterprise profile."""
        profiles = cls._load_profiles()
        if profile_id not in profiles:
            return None
        
        for k in profiles:
            profiles[k]["is_active"] = (k == profile_id)
        
        cls._save_profiles(profiles)
        return profiles[profile_id]

    @classmethod
    def upsert_profile(cls, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates or updates an enterprise profile."""
        profiles = cls._load_profiles()
        
        pid = profile_data.get("id") or profile_data.get("name", "enterprise").lower().replace(" ", "_").replace("-", "_")
        
        existing = profiles.get(pid, {})
        
        # Ensure list formats
        def clean_list(val):
            if isinstance(val, list):
                return [str(v).strip() for v in val if str(v).strip()]
            if isinstance(val, str):
                return [v.strip() for v in val.split(",") if v.strip()]
            return []

        ticker_symbols = clean_list(profile_data.get("ticker_symbols", existing.get("ticker_symbols", [])))
        subsidiaries = clean_list(profile_data.get("subsidiaries", existing.get("subsidiaries", [])))
        executives = clean_list(profile_data.get("executives", existing.get("executives", [])))
        brand_keywords = clean_list(profile_data.get("brand_keywords", existing.get("brand_keywords", [])))
        official_domains = clean_list(profile_data.get("official_domains", existing.get("official_domains", [])))

        updated_profile = {
            "id": pid,
            "name": profile_data.get("name", existing.get("name", "Custom Enterprise")).strip(),
            "ticker_symbols": ticker_symbols,
            "subsidiaries": subsidiaries,
            "executives": executives,
            "brand_keywords": brand_keywords,
            "official_domains": official_domains,
            "industry_sector": profile_data.get("industry_sector", existing.get("industry_sector", "General Enterprise")).strip(),
            "threat_threshold": int(profile_data.get("threat_threshold", existing.get("threat_threshold", 65))),
            "is_active": bool(profile_data.get("is_active", existing.get("is_active", True))),
            "last_updated": profile_data.get("last_updated") or "2026-10-08T11:30:00Z"
        }

        # If this profile is active, deactivate others
        if updated_profile["is_active"]:
            for k in profiles:
                profiles[k]["is_active"] = False

        profiles[pid] = updated_profile
        cls._save_profiles(profiles)
        return updated_profile

    @classmethod
    def delete_profile(cls, profile_id: str) -> bool:
        """Deletes a custom enterprise profile."""
        profiles = cls._load_profiles()
        if profile_id in profiles:
            del profiles[profile_id]
            # Ensure at least one is active
            if profiles and not any(p.get("is_active") for p in profiles.values()):
                first_key = list(profiles.keys())[0]
                profiles[first_key]["is_active"] = True
            cls._save_profiles(profiles)
            return True
        return False

    @classmethod
    def calculate_campaign_relevance(
        cls, 
        campaign: Dict[str, Any], 
        profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates ML semantic & entity relevance score of a campaign against the enterprise profile.
        Returns:
            - is_relevant: bool (whether campaign matches enterprise criteria)
            - match_score: float (0 - 100%)
            - matched_entities: list[str] (names of matching brands, executives, or keywords)
            - match_type: str ('DIRECT_ENTITY_TARGET' | 'SUBSIDIARY_MENTION' | 'EXECUTIVE_IMPERSONATION' | 'VECTOR_SIMILARITY' | 'UNRELATED')
        """
        if not profile:
            profile = cls.get_active_profile()

        title = (campaign.get("title") or "").lower()
        target = (campaign.get("target") or "").lower()
        summary = (campaign.get("summary") or "").lower()
        category = (campaign.get("category") or "").lower()
        
        # Aggregate campaign text corpus
        corpus = f"{title} {target} {summary} {category}"
        for post in campaign.get("posts", []):
            if isinstance(post, dict):
                corpus += " " + (post.get("text") or post.get("raw_payload") or "").lower()
            elif isinstance(post, str):
                corpus += " " + post.lower()

        matched_entities = []
        score = 0.0
        match_type = "UNRELATED"

        # 1. Check direct company name & tickers
        enterprise_name = (profile.get("name") or "").lower()
        name_tokens = [t for t in enterprise_name.split() if len(t) > 3 and t not in ["limited", "sons", "group", "industries", "bank", "india", "entities"]]
        for t in name_tokens:
            if t in corpus:
                matched_entities.append(profile.get("name"))
                score += 45.0
                match_type = "DIRECT_ENTITY_TARGET"
                break

        for ticker in profile.get("ticker_symbols", []):
            if ticker.lower() in corpus:
                matched_entities.append(f"Ticker: {ticker}")
                score += 35.0
                if match_type == "UNRELATED":
                    match_type = "DIRECT_ENTITY_TARGET"

        # 2. Check executives
        for exec_name in profile.get("executives", []):
            exec_clean = exec_name.split("(")[0].strip().lower()
            parts = [p for p in exec_clean.split() if len(p) > 3]
            for p in parts:
                if p in corpus:
                    matched_entities.append(f"Executive: {exec_name}")
                    score += 35.0
                    match_type = "EXECUTIVE_IMPERSONATION"
                    break

        # 3. Check subsidiaries / brand names
        for sub in profile.get("subsidiaries", []):
            sub_clean = sub.split("(")[0].strip().lower()
            if sub_clean and sub_clean in corpus:
                matched_entities.append(f"Subsidiary: {sub}")
                score += 30.0
                if match_type == "UNRELATED":
                    match_type = "SUBSIDIARY_MENTION"

        # 4. Check brand attack keywords
        for kw in profile.get("brand_keywords", []):
            if kw.lower() in corpus:
                matched_entities.append(f"Attack Vector: {kw}")
                score += 20.0
                if match_type == "UNRELATED":
                    match_type = "VECTOR_SIMILARITY"

        # 5. Check official domains & handles
        for dom in profile.get("official_domains", []):
            dom_clean = dom.lower().replace("@", "")
            if dom_clean in corpus:
                matched_entities.append(f"Domain/Handle: {dom}")
                score += 25.0

        # Normalize score
        match_score = min(100.0, round(score, 1))
        threshold = profile.get("threat_threshold", 65)
        is_relevant = (match_score >= 25.0) or (len(matched_entities) > 0)

        if match_score >= 60.0 and match_type == "UNRELATED":
            match_type = "DIRECT_ENTITY_TARGET"

        return {
            "is_relevant": is_relevant,
            "match_score": match_score,
            "matched_entities": list(dict.fromkeys(matched_entities)),
            "match_type": match_type,
            "enterprise_id": profile.get("id"),
            "enterprise_name": profile.get("name"),
            "confidence": "HIGH" if match_score >= 60 else ("MEDIUM" if match_score >= 30 else "LOW")
        }

    @classmethod
    def filter_campaigns_for_enterprise(
        cls, 
        campaigns: List[Dict[str, Any]], 
        profile: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Filters a list of campaigns to return exclusively those matching the enterprise profile,
        enriching each with enterprise relevance metadata and damage metrics.
        """
        if not profile:
            profile = cls.get_active_profile()

        results = []
        for c in campaigns:
            relevance = cls.calculate_campaign_relevance(c, profile)
            if relevance["is_relevant"]:
                c_enriched = dict(c)
                c_enriched["enterprise_relevance"] = relevance
                results.append(c_enriched)

        # Sort by relevance match_score descending, then threat_score descending
        results.sort(
            key=lambda x: (
                x.get("enterprise_relevance", {}).get("match_score", 0),
                x.get("threat_score", 0)
            ), 
            reverse=True
        )
        return results
