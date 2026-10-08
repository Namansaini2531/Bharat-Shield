"""
BHARAT-SHIELD SENTINEL — Groq AI Counter-Disinformation Strategic Advisor
Utilizes Groq Ultra-Low Latency Inference (LLaMA-3.3-70B-Versatile) to generate 
multilingual counter-narratives, tactical interventions, prebunking advisories, 
and statutory response playbooks tailored per operational persona.
"""

import os
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class GroqCounterAdvisor:
    """
    Intelligent Counter-Disinformation Advisor powered by Groq LLaMA-3.3-70B.
    """

    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    DEFAULT_MODEL = "llama-3.3-70b-versatile"

    @classmethod
    def get_api_key(cls, custom_key: Optional[str] = None) -> Optional[str]:
        if custom_key and custom_key.strip():
            return custom_key.strip()
        return os.getenv("GROQ_API_KEY", "").strip() or None

    @classmethod
    def generate_strategy(
        cls,
        campaign_id: str,
        title: str,
        category: str,
        target: str,
        threat_score: int,
        primary_language: str,
        languages_detected: list,
        summary: str,
        role: str = "investigation_bureau",
        custom_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates a comprehensive counter-disinformation strategic action plan.
        """
        api_key = cls.get_api_key(custom_key)

        if api_key:
            try:
                ai_result = cls._query_groq_llm(
                    api_key=api_key,
                    campaign_id=campaign_id,
                    title=title,
                    category=category,
                    target=target,
                    threat_score=threat_score,
                    primary_language=primary_language,
                    languages_detected=languages_detected,
                    summary=summary,
                    role=role
                )
                if ai_result:
                    ai_result["is_live_llm"] = True
                    ai_result["engine"] = "Groq LLaMA-3.3-70B-Versatile"
                    return ai_result
            except Exception as e:
                logger.warning(f"Groq API call failed, falling back to deterministic engine: {e}")

        # Fallback to rule-based expert engine if Groq key is absent or request fails
        fallback_result = cls._generate_expert_heuristic_strategy(
            campaign_id=campaign_id,
            title=title,
            category=category,
            target=target,
            threat_score=threat_score,
            primary_language=primary_language,
            languages_detected=languages_detected,
            summary=summary,
            role=role
        )
        fallback_result["is_live_llm"] = False
        fallback_result["engine"] = "Sentinel Expert Heuristic (Provide Groq API Key for Live Neural Inoculation)"
        return fallback_result

    @classmethod
    def _query_groq_llm(
        cls,
        api_key: str,
        campaign_id: str,
        title: str,
        category: str,
        target: str,
        threat_score: int,
        primary_language: str,
        languages_detected: list,
        summary: str,
        role: str
    ) -> Optional[Dict[str, Any]]:
        """
        Executes an HTTP POST request to Groq API.
        """
        role_contexts = {
            "investigation_bureau": "Law Enforcement & National Security Intelligence (Section 69A IT Act, public order preservation, APT botnet neutralisation, court evidence)",
            "corporate_enterprise": "Corporate Brand Defense & Market Integrity (SEBI LODR Regulation 30 disclosure, investor reassurance, fake circular invalidation)",
            "journalist_media": "Public Fact-Checking & Media Desk (IFCN compliance, shareable multilingual debunk cards, WhatsApp tipline distribution)",
            "system_admin": "Root Cyber Defense & Master Infrastructure (Ingestion filter hardening, botnet ASN blacklisting, Merkle notary verification)"
        }

        role_desc = role_contexts.get(role, role_contexts["investigation_bureau"])

        system_prompt = (
            "You are the Lead Counter-Disinformation Strategist for BHARAT-SHIELD SENTINEL, India's sovereign "
            "cognitive warfare defense system. Your duty is to formulate rapid, culturally grounded, multilingual "
            "counter-narratives and tactical mitigation playbooks against state-sponsored or coordinated psychological operations.\n"
            f"Current Operational Persona: {role.upper()} ({role_desc}).\n"
            "Output must be STRICT JSON format only, matching the exact JSON schema requested."
        )

        user_prompt = f"""
Campaign Under Analysis:
- ID: {campaign_id}
- Title: {title}
- Category: {category}
- Target: {target}
- Threat Index: {threat_score}/100
- Primary Language: {primary_language}
- Languages Detected: {', '.join(languages_detected) if languages_detected else 'Hindi, English'}
- Narrative Summary: {summary}

Formulate a tactical counter-disinformation response. Return a JSON object with:
{{
  "executive_diagnosis": "Concise 2-3 sentence cognitive vector vulnerability assessment and psychological driver analysis.",
  "urgency_rating": "IMMEDIATE (0-30 MINS)" | "HIGH (1-2 HOURS)" | "MEDIUM (SCHEDULED)",
  "tactical_interventions": [
    {{"action": "Action Name", "description": "Specific tactical action step", "priority": "CRITICAL" | "HIGH"}}
  ],
  "counter_narratives": [
    {{
      "language": "Hindi (हिंदी)",
      "script": "Devanagari",
      "channel": "WhatsApp & Telegram Forward",
      "headline": "Short compelling truth headline",
      "message": "Clear factual message refuting the claim without reinforcing the false rumor, with verifiable source reference.",
      "call_to_action": "Actionable verification advice for citizens"
    }},
    {{
      "language": "English",
      "script": "Latin",
      "channel": "Twitter / X & Official Press Statement",
      "headline": "Official Advisory Headline",
      "message": "Authoritative factual statement debunking the synthetic vector.",
      "call_to_action": "Official link or helpline reference"
    }},
    {{
      "language": "Regional (Telugu/Tamil/Marathi/Bengali)",
      "script": "Regional Script",
      "channel": "Regional Tipline & News Broadcast",
      "headline": "Regional headline",
      "message": "Culturally resonant debunking message.",
      "call_to_action": "Citizen verification advisory"
    }}
  ],
  "psychological_prebunking": "Inoculation technique explaining the narrative manipulation tactic to build cognitive immunity against follow-up mutations.",
  "statutory_legal_actions": [
    "Specific statutory or regulatory step (e.g. Section 69A IT Act notice / SEBI Regulation 30 filing / FIR under BNS)"
  ],
  "channel_matrix": [
    {{"channel": "WhatsApp Broadcast", "recommended_timeframe": "< 15 mins", "tactic": "Deploy prebunk cards to community group admins"}},
    {{"channel": "X (Twitter) Community Notes", "recommended_timeframe": "< 30 mins", "tactic": "Submit high-rating debunk proof links"}},
    {{"channel": "Official Web Portal / Exchange", "recommended_timeframe": "< 1 hour", "tactic": "Publish cryptographic verification digest"}}
  ]
}}
"""

        payload = {
            "model": cls.DEFAULT_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
            "max_tokens": 1500
        }

        req = urllib.request.Request(
            cls.GROQ_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
                "User-Agent": "BharatShieldSentinel/1.0"
            }
        )

        with urllib.request.urlopen(req, timeout=12) as response:
            res_body = response.read().decode("utf-8")
            data = json.loads(res_body)
            content_str = data["choices"][0]["message"]["content"]
            return json.loads(content_str)

    @classmethod
    def _generate_expert_heuristic_strategy(
        cls,
        campaign_id: str,
        title: str,
        category: str,
        target: str,
        threat_score: int,
        primary_language: str,
        languages_detected: list,
        summary: str,
        role: str
    ) -> Dict[str, Any]:
        """
        Deterministic expert counter-strategy engine used when offline or without API key.
        """
        is_high = threat_score >= 85

        if role == "corporate_enterprise":
            return {
                "executive_diagnosis": f"Pre-market coordinated sentiment depression vector targeting {target}. Uses synthetic audiovisual artifacts to induce retail shareholder panic and trigger short-selling algorithms.",
                "urgency_rating": "IMMEDIATE (0-30 MINS)" if is_high else "HIGH (1-2 HOURS)",
                "tactical_interventions": [
                    {"action": "SEBI Regulation 30 LODR Clarification", "description": "Issue an immediate corporate disclosure to BSE and NSE denying counterfeit media and circulars.", "priority": "CRITICAL"},
                    {"action": "Social Media Platform Takedown Notice", "description": "File emergency brand impersonation and synthetic media takedown with X, Instagram, and Telegram.", "priority": "HIGH"},
                    {"action": "Investor Relations Fact Sheet", "description": "Distribute verified operational telemetry metrics to institutional analysts and credit agencies.", "priority": "HIGH"}
                ],
                "counter_narratives": [
                    {
                        "language": "English",
                        "script": "Latin",
                        "channel": "Stock Exchange Disclosure & Official X Handle",
                        "headline": f"Official Clarification: Malicious Disinformation Regarding {target}",
                        "message": f"We strongly clarify that recent claims and fabricated media regarding {title} are entirely false and manufactured. All operations, vehicle telemetry, and hiring programs continue normally. Verified updates are available exclusively on our official portals.",
                        "call_to_action": "Refer to official stock exchange announcements for authentic company updates."
                    },
                    {
                        "language": "Hindi (हिंदी)",
                        "script": "Devanagari",
                        "channel": "WhatsApp & Regional Press Release",
                        "headline": f"आधिकारिक स्पष्टीकरण: {target} से संबंधित फर्जी दावों का खंडन",
                        "message": f"{target} द्वारा यह स्पष्ट किया जाता है कि सोशल मीडिया पर फैलाई जा रही अफवाहें और वीडियो पूर्णतः भ्रामक और नकली हैं। हमारी सभी सेवाएं सामान्य रूप से कार्यरत हैं। अफवाहों पर ध्यान न दें।",
                        "call_to_action": "कृपया केवल आधिकारिक वेबसाइट पर दी गई सूचना पर ही भरोसा करें।"
                    }
                ],
                "psychological_prebunking": "Adversaries rely on the 'First Mover Lie' before markets open. Exposing the short-seller timing correlation disarms the credibility of future mutated claims.",
                "statutory_legal_actions": [
                    "BSE / NSE Immediate Clarification under Regulation 30 of SEBI (LODR) Regulations 2015",
                    "FIR under Section 66D IT Act 2000 (Cheating by personation using computer resource)",
                    "Preservation of digital evidence under Section 65B Indian Evidence Act"
                ],
                "channel_matrix": [
                    {"channel": "Stock Exchange Portals (BSE/NSE)", "recommended_timeframe": "< 15 mins", "tactic": "File corporate announcement"},
                    {"channel": "Official Corporate Handles", "recommended_timeframe": "< 30 mins", "tactic": "Pin official debunk with cryptographic certificate"},
                    {"channel": "Institutional Analyst Desk", "recommended_timeframe": "< 45 mins", "tactic": "Host immediate factual briefing"}
                ]
            }

        if role == "journalist_media":
            return {
                "executive_diagnosis": f"High-velocity viral WhatsApp hoax mutating across regional scripts. Leverages manufactured urgency and authority impersonation to trigger civil anxiety.",
                "urgency_rating": "IMMEDIATE (0-30 MINS)",
                "tactical_interventions": [
                    {"action": "Multilingual Debunk Bulletin Broadcast", "description": "Deploy ready-to-share verification cards in Hindi, English, and regional scripts across WhatsApp channels.", "priority": "CRITICAL"},
                    {"action": "DoT / Official Ministry Denial Citation", "description": "Quote verified on-record statements from primary authorities directly contradicting the forward.", "priority": "CRITICAL"},
                    {"action": "WhatsApp Fact-Checking Tipline Auto-Reply", "description": "Configure instant automated debunk responses for citizen tipline queries matching this keyword signature.", "priority": "HIGH"}
                ],
                "counter_narratives": [
                    {
                        "language": "Hindi (हिंदी)",
                        "script": "Devanagari",
                        "channel": "WhatsApp Shareable Card & Telegram Broadcast",
                        "headline": "फैक्ट चेक: क्या देश में इंटरनेट और सेवाएं बंद होने वाली हैं? जानें सच",
                        "message": "दावा: सोशल मीडिया पर दावा किया जा रहा है कि आज रात से सेवाएं बंद रहेंगी।\nसच: यह दावा पूरी तरह से फर्जी है। संबंधित मंत्रालय ने स्पष्ट किया है कि ऐसा कोई आदेश जारी नहीं किया गया है। फर्जी नोटिस से भ्रमित न हों।",
                        "call_to_action": "इस सच को अपने व्हाट्सएप ग्रुपों में साझा करें और अफवाहों को रोकें।"
                    },
                    {
                        "language": "English",
                        "script": "Latin",
                        "channel": "Fact-Check Portal & Twitter/X Thread",
                        "headline": f"FACT CHECK: Viral Claims of {title} Are Fabricated",
                        "message": f"A viral message claiming imminent shutdown or order has been proven FALSE. Official spokespersons confirm no such circular exists. The document is an amateur digital forgery.",
                        "call_to_action": "Check our full forensic debunk report at our verified portal."
                    }
                ],
                "psychological_prebunking": "Teach citizens the 'Look for the Watermark & Seal' technique. Highlighting the forged font misalignment trains readers to spot future spoofed gazettes.",
                "statutory_legal_actions": [
                    "IFCN Code of Principles Multi-Source Verification Documentation",
                    "PIB Fact Check Cross-Verification Synchronization",
                    "WhatsApp Tipline API Automated Inoculation Broadcast"
                ],
                "channel_matrix": [
                    {"channel": "WhatsApp Tipline Broadcast", "recommended_timeframe": "< 10 mins", "tactic": "Push verified 1-page visual card to 50k+ subscribers"},
                    {"channel": "X / Twitter Community Note", "recommended_timeframe": "< 20 mins", "tactic": "Attach authoritative rebuttal link to top viral tweets"},
                    {"channel": "Mainstream News Ticker", "recommended_timeframe": "< 30 mins", "tactic": "Flash on-screen debunk alert across regional news channels"}
                ]
            }

        # Default: Investigation Bureau / LEA / System Admin
        return {
            "executive_diagnosis": f"State-sponsored cognitive manipulation operation utilizing multi-hop automated bot swarms to amplify {title} across {', '.join(languages_detected) if languages_detected else 'regional scripts'}. Designed to provoke public panic and supply chain friction.",
            "urgency_rating": "IMMEDIATE (0-30 MINS)",
            "tactical_interventions": [
                {"action": "Section 69A IT Act Emergency Blocking Order", "description": "Transmit urgent directive to MeitY for blocking of 48 primary seed URLs and hostile Telegram channels.", "priority": "CRITICAL"},
                {"action": "Inter-Agency Intelligence Flash Bulletin", "description": "Disseminate threat actor IOCs and proxy ASN ranges to CERT-In and state police cyber cells.", "priority": "CRITICAL"},
                {"action": "Cryptographic Blockchain Evidence Sealing", "description": "Anchor SHA-256 Merkle root package of all coordinated post payloads to EVM notary contract.", "priority": "HIGH"},
                {"action": "Public Order Counter-Broadcast via PIB", "description": "Release synchronized multi-language factual advisories across all state telecom circles.", "priority": "HIGH"}
            ],
            "counter_narratives": [
                {
                    "language": "Hindi (हिंदी)",
                    "script": "Devanagari",
                    "channel": "PIB Press Release & Official National Broadcast",
                    "headline": "राष्ट्रीय सुरक्षा सूचना: भ्रामक एवं प्रायोजित सूचना से सतर्क रहें",
                    "message": f"नागरिकों को सूचित किया जाता है कि {title} से संबंधित सोशल मीडिया पर प्रसारित सूचनाएं पूर्णतः निराधार एवं शरारतपूर्ण हैं। सभी आवश्यक सेवाएं निर्बाध रूप से चालू हैं। अफवाह फैलाने वालों के विरुद्ध कानूनी कार्रवाई की जा रही है।",
                    "call_to_action": "अफवाहों पर विश्वास न करें और केवल आधिकारिक सरकारी हैंडल्स से प्राप्त सूचना को ही सही मानें।"
                },
                {
                    "language": "English",
                    "script": "Latin",
                    "channel": "Ministry of Information & Broadcasting Advisory",
                    "headline": f"Official National Security Advisory: {title} Debunked",
                    "message": f"The Government of India categorically refutes fabricated claims regarding {target}. Coordinated hostile networks attempting to incite public panic have been identified, and law enforcement agencies are initiating statutory action under the IT Act.",
                    "call_to_action": "Verify all statutory directives through official .gov.in portals."
                },
                {
                    "language": "Telugu (తెలుగు)",
                    "script": "Telugu",
                    "channel": "State Information & Public Relations Broadcast",
                    "headline": "అధికారిక హెచ్చరిక: తప్పుడు ప్రచారాలను నమ్మవద్దు",
                    "message": "సోషల్ మీడియాలో వ్యాపిస్తున్న సమాచారం పూర్తిగా అవాస్తవం. అన్ని బ్యాంకింగ్ మరియు అత్యవసర సేవలు సాధారణంగా నడుస్తున్నాయి.",
                    "call_to_action": "తప్పుడు సమాచారాన్ని ఫార్వర్డ్ చేయవద్దు."
                }
            ],
            "psychological_prebunking": "Educate the public on 'Burst Coincidence' — showing how identical messages appeared simultaneously across 800 accounts within 5 minutes instantly dismantles citizen belief in organic origin.",
            "statutory_legal_actions": [
                "Section 69A of Information Technology Act 2000 (Emergency Blocking of Information)",
                "Section 65B Indian Evidence Act Cryptographic Certificate Generation",
                "Bharatiya Nyaya Sanhita (BNS) Section 353 (Statements conducing to public mischief)",
                "EVM Smart Contract SHA-256 Immutable Audit Log Sealing"
            ],
            "channel_matrix": [
                {"channel": "PIB / MeitY Emergency Alert", "recommended_timeframe": "< 15 mins", "tactic": "Issue national multi-lingual gazette denial"},
                {"channel": "Telecom Circle SMS Broadcast", "recommended_timeframe": "< 30 mins", "tactic": "Push localized SMS advisories in northern districts"},
                {"channel": "Platform Compliance Emergency Takedown", "recommended_timeframe": "< 45 mins", "tactic": "Execute statutory API blocking notices"}
            ]
        }
