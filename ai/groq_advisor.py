"""
BHARAT-SHIELD SENTINEL — Kritrim AI Counter-Disinformation Strategic Advisor
Utilizes Kritrim Ultra-Low Latency Sovereign Inference Engine to generate 
multilingual counter-narratives, tactical interventions, prebunking advisories, 
statutory response playbooks, and damage-reduction roadmaps tailored per operational persona.
"""

import os
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

logger = logging.getLogger("bharat_shield.kritrim_advisor")

class GroqCounterAdvisor:
    """
    Intelligent Counter-Disinformation & Damage Reduction Advisor powered by Kritrim Sovereign AI Engine.
    """

    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    DEFAULT_MODEL = "llama-3.3-70b-versatile"

    @classmethod
    def get_api_key(cls, custom_key: Optional[str] = None) -> Optional[str]:
        if custom_key and custom_key.strip():
            return custom_key.strip()
        return os.getenv("KRITRIM_API_KEY", "").strip() or os.getenv("GROQ_API_KEY", "").strip() or None

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
        Generates a comprehensive counter-disinformation and damage-minimization strategic action plan.
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
                    ai_result["engine"] = f"Kritrim Ultra-Fast Sovereign AI Engine"
                    ai_result["api_key_masked"] = f"kritrim_...{api_key[-4:]}" if len(api_key) > 8 else "kritrim_active"
                    return ai_result
            except Exception as e:
                logger.warning(f"Kritrim AI API call failed, falling back to deterministic engine: {e}")

        # Fallback to rule-based expert engine if API key is absent or request fails
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
        fallback_result["engine"] = "Sentinel Expert Heuristic Engine (Enter Kritrim API Key for Live Neural Inoculation)"
        fallback_result["api_key_masked"] = None
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
            "investigation_bureau": "Law Enforcement & National Security Intelligence (Section 69A IT Act emergency takedowns, public order preservation, APT botnet neutralisation, criminal prosecution under BNS)",
            "corporate_enterprise": "Corporate Brand Defense & Market Integrity (SEBI LODR Regulation 30 corporate disclosures, shareholder panic suppression, investor reassurance, fake circular invalidation)",
            "journalist_media": "Public Fact-Checking & Media Desk (IFCN compliance, shareable multilingual debunk cards, WhatsApp tipline broadcast, community note deployment)",
            "system_admin": "Root Cyber Defense & Master Infrastructure (Ingestion filter hardening, botnet ASN blacklisting, Merkle notary verification, C2 mitigation)"
        }

        role_desc = role_contexts.get(role, role_contexts["investigation_bureau"])

        system_prompt = (
            "You are the Chief AI Counter-Disinformation Strategist for BHARAT-SHIELD SENTINEL, India's sovereign "
            "cognitive warfare defense system. Your primary objective is to formulate RAPID DAMAGE REDUCTION STRATEGIES, "
            "culturally grounded multilingual counter-narratives, and tactical mitigation playbooks against state-sponsored or coordinated psychological operations.\n"
            f"Current Operational Persona: {role.upper()} ({role_desc}).\n"
            "Output must be STRICT JSON format only, matching the exact JSON schema requested."
        )

        user_prompt = f"""
Campaign Under Analysis:
- ID: {campaign_id}
- Title: {title}
- Category: {category}
- Target: {target}
- Threat Score: {threat_score}/100
- Primary Language: {primary_language}
- Languages Detected: {', '.join(languages_detected) if languages_detected else 'Hindi, English'}
- Narrative Summary: {summary}

Formulate an actionable damage minimization and mitigation response. Return a JSON object matching this schema:
{{
  "executive_diagnosis": "Concise 2-3 sentence cognitive vector vulnerability assessment and psychological driver analysis.",
  "urgency_rating": "IMMEDIATE (0-30 MINS)" | "HIGH (1-2 HOURS)" | "MEDIUM (SCHEDULED)",
  "damage_reduction_impact": "Key estimate of damage reduction and containment potential (e.g. '85-92% containment of public panic & market shorting within 45 mins').",
  "damage_containment_roadmap": [
    {{"phase": "T+0 to T+15m", "milestone": "Action step name", "expected_damage_containment": "Percentage/description"}},
    {{"phase": "T+15m to T+45m", "milestone": "Action step name", "expected_damage_containment": "Percentage/description"}},
    {{"phase": "T+45m to T+2h", "milestone": "Action step name", "expected_damage_containment": "Percentage/description"}}
  ],
  "tactical_interventions": [
    {{"action": "Action Name", "description": "Specific tactical action step", "priority": "CRITICAL" | "HIGH", "timeframe": "< 15 mins"}}
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

        candidate_models = [
            "openai/gpt-oss-120b",
            "llama-3.3-70b-versatile",
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-20b",
            "llama-3.1-70b-versatile"
        ]

        last_error = None
        for model_name in candidate_models:
            payload = {
                "model": model_name,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2,
                "response_format": {"type": "json_object"},
                "max_tokens": 1800
            }

            req = urllib.request.Request(
                cls.GROQ_API_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BharatShieldSentinel/1.0"
                }
            )

            try:
                with urllib.request.urlopen(req, timeout=14) as response:
                    res_body = response.read().decode("utf-8")
                    data = json.loads(res_body)
                    content_str = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content_str)
                    parsed["engine"] = f"Kritrim Sovereign AI ({model_name})"
                    return parsed
            except Exception as err:
                last_error = err
                logger.debug(f"Model {model_name} failed: {err}")
                continue

        if last_error:
            raise last_error
        return None

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
        Deterministic expert counter-strategy engine used when offline or without Groq API key.
        """
        is_high = threat_score >= 85

        if role == "corporate_enterprise":
            return {
                "executive_diagnosis": f"Pre-market coordinated sentiment depression vector targeting {target}. Uses synthetic audiovisual artifacts to induce retail shareholder panic and trigger algorithmic short-selling ahead of exchange bell.",
                "urgency_rating": "IMMEDIATE (0-30 MINS)" if is_high else "HIGH (1-2 HOURS)",
                "damage_reduction_impact": f"Projected 88% reduction in stock volatility and investor capital erosion by pre-empting the 09:15 IST opening bell with authoritative BSE/NSE disclosures.",
                "damage_containment_roadmap": [
                    {"phase": "T+0 to T+15m", "milestone": "File Emergency SEBI LODR Regulation 30 Denial on BSE/NSE Portals", "expected_damage_containment": "Neutralizes automated short-seller trading triggers"},
                    {"phase": "T+15m to T+45m", "milestone": "Dispatch Verified Technical Telemetry Cards to Institutional Broker Desks", "expected_damage_containment": "75% containment of institutional panic selling"},
                    {"phase": "T+45m to T+2h", "milestone": "File Digital Forensics Notary Vault Evidence with Cyber Police & Exchanges", "expected_damage_containment": "95% lasting inoculation & legal culpability preservation"}
                ],
                "tactical_interventions": [
                    {"action": "SEBI Regulation 30 LODR Clarification", "description": "Issue an immediate corporate disclosure to BSE and NSE denying counterfeit media, circulars, and executive audio.", "priority": "CRITICAL", "timeframe": "< 15 mins"},
                    {"action": "Social Media Platform Takedown Notice", "description": "File emergency brand impersonation and synthetic media takedowns with X, Instagram, and Telegram.", "priority": "HIGH", "timeframe": "< 30 mins"},
                    {"action": "Investor Relations Fact Sheet", "description": "Distribute verified operational telemetry metrics to institutional analysts and credit rating agencies.", "priority": "HIGH", "timeframe": "< 45 mins"},
                    {"action": "Cryptographic Notary Evidence Sealing", "description": "Anchor SHA-256 Merkle root package of offending handles into Polygon notary ledger for defamation litigation.", "priority": "HIGH", "timeframe": "< 1 hour"}
                ],
                "counter_narratives": [
                    {
                        "language": "English",
                        "script": "Latin",
                        "channel": "Stock Exchange Disclosure & Official X Handle",
                        "headline": f"Official Clarification: Malicious Disinformation Regarding {target}",
                        "message": f"We categorically clarify that recent claims and fabricated media regarding {title} are entirely false and manufactured. All operations, vehicle telemetry, and commercial contracts continue normally. Verified updates are available exclusively on our official portals.",
                        "call_to_action": "Refer to official BSE/NSE stock exchange announcements for authentic company updates."
                    },
                    {
                        "language": "Hindi (हिंदी)",
                        "script": "Devanagari",
                        "channel": "WhatsApp & Regional Press Release",
                        "headline": f"आधिकारिक स्पष्टीकरण: {target} से संबंधित फर्जी दावों का पूर्ण खंडन",
                        "message": f"{target} द्वारा यह स्पष्ट किया जाता है कि सोशल मीडिया पर फैलाई जा रही अफवाहें और वीडियो पूर्णतः भ्रामक और नकली हैं। हमारी सभी सेवाएं सामान्य रूप से कार्यरत हैं। अफवाहों पर ध्यान न दें।",
                        "call_to_action": "कृपया केवल आधिकारिक वेबसाइट पर दी गई सूचना पर ही भरोसा करें।"
                    },
                    {
                        "language": "Marathi (मराठी)",
                        "script": "Devanagari",
                        "channel": "Regional Tipline & State Media",
                        "headline": f"अधिकृत खुलासा: {target} बाबत पसरवल्या जाणाऱ्या अफवांवर विश्वास ठेवू नका",
                        "message": f"{target} ने स्पष्ट केले आहे की सोशल मीडियावर फिरणारे दावे आणि व्हिडिओ पूर्णपणे खोटे आहेत. सर्व कामकाज सुरळीत सुरू आहे.",
                        "call_to_action": "अधिकृत सूचनेसाठी कंपनीच्या संकेतस्थळाला भेट द्या."
                    }
                ],
                "psychological_prebunking": "Adversaries rely on the 'First Mover Lie' before markets open. Exposing the short-seller timing correlation disarms the credibility of future mutated claims.",
                "statutory_legal_actions": [
                    "BSE / NSE Immediate Clarification under Regulation 30 of SEBI (LODR) Regulations 2015",
                    "FIR under Section 66D IT Act 2000 (Cheating by personation using computer resource)",
                    "Preservation of digital evidence under Section 65B Indian Evidence Act / BSA 2023",
                    "Defamation Notice under Section 356 Bharatiya Nyaya Sanhita (BNS)"
                ],
                "channel_matrix": [
                    {"channel": "Stock Exchange Portals (BSE/NSE)", "recommended_timeframe": "< 15 mins", "tactic": "File corporate announcement and request trading halt notice if necessary"},
                    {"channel": "Official Corporate Handles", "recommended_timeframe": "< 30 mins", "tactic": "Pin official debunk with cryptographic certificate"},
                    {"channel": "Institutional Analyst Desk", "recommended_timeframe": "< 45 mins", "tactic": "Host immediate factual briefing and distribute telemetry PDF"}
                ]
            }

        if role == "journalist_media":
            return {
                "executive_diagnosis": f"High-velocity viral WhatsApp hoax mutating across regional scripts. Leverages manufactured urgency, authority impersonation, and false gazettes to trigger civil anxiety.",
                "urgency_rating": "IMMEDIATE (0-30 MINS)",
                "damage_reduction_impact": "Estimated 90% reduction in unverified WhatsApp forward reshares within 30 minutes via coordinated IFCN debunk card broadcast.",
                "damage_containment_roadmap": [
                    {"phase": "T+0 to T+15m", "milestone": "Push Automated Tipline Debunk to 50,000+ Inquiring Subscribers", "expected_damage_containment": "Cuts peer-to-peer forward momentum at source"},
                    {"phase": "T+15m to T+45m", "milestone": "Submit High-Rated Community Notes on X and Meta Fact-Check Portal", "expected_damage_containment": "70% reduction in cross-platform visual propagation"},
                    {"phase": "T+45m to T+2h", "milestone": "Broadcast Verified Multi-Language Video Fact-Check Bulletin", "expected_damage_containment": "94% public cognitive inoculation"}
                ],
                "tactical_interventions": [
                    {"action": "Multilingual Debunk Bulletin Broadcast", "description": "Deploy ready-to-share verification cards in Hindi, English, and regional scripts across WhatsApp channels.", "priority": "CRITICAL", "timeframe": "< 15 mins"},
                    {"action": "DoT / Official Ministry Denial Citation", "description": "Quote verified on-record statements from primary authorities directly contradicting the forward.", "priority": "CRITICAL", "timeframe": "< 20 mins"},
                    {"action": "WhatsApp Fact-Checking Tipline Auto-Reply", "description": "Configure instant automated debunk responses for citizen tipline queries matching this keyword signature.", "priority": "HIGH", "timeframe": "< 30 mins"}
                ],
                "counter_narratives": [
                    {
                        "language": "Hindi (हिंदी)",
                        "script": "Devanagari",
                        "channel": "WhatsApp Shareable Card & Telegram Broadcast",
                        "headline": "फैक्ट चेक: क्या देश में सेवाएं बंद होने वाली हैं? जानें सच",
                        "message": "दावा: सोशल मीडिया पर दावा किया जा रहा है कि आज रात से सेवाएं बंद रहेंगी।\nसच: यह दावा पूरी तरह से फर्जी है। संबंधित विभाग ने स्पष्ट किया है कि ऐसा कोई आदेश जारी नहीं किया गया है। फर्जी नोटिस से भ्रमित न हों।",
                        "call_to_action": "इस सच को अपने व्हाट्सएप ग्रुपों में साझा करें और अफवाहों को रोकें।"
                    },
                    {
                        "language": "English",
                        "script": "Latin",
                        "channel": "Fact-Check Portal & Twitter/X Thread",
                        "headline": f"FACT CHECK: Viral Claims of {title} Are Fabricated",
                        "message": f"A viral message claiming imminent shutdown or order has been proven FALSE. Official spokespersons confirm no such circular exists. The document is an amateur digital forgery.",
                        "call_to_action": "Check our full forensic debunk report at our verified portal."
                    },
                    {
                        "language": "Bengali (বাংলা)",
                        "script": "Bengali",
                        "channel": "Regional Tipline Broadcast",
                        "headline": "ফ্যাক্ট চেক: ভাইরাল দাবি সম্পূর্ণ ভুয়ো ও ভিত্তিহীন",
                        "message": "সোশ্যাল মিডিয়ায় প্রচারিত দাবিটি সম্পূর্ণ মিথ্যা। কর্তৃপক্ষ নিশ্চিত করেছে যে এমন কোনও নির্দেশিকা জারি করা হয়নি।",
                        "call_to_action": "ভুয়ো খবর শেয়ার করবেন না।"
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
            "executive_diagnosis": f"State-sponsored cognitive manipulation operation utilizing multi-hop automated bot swarms to amplify {title} across {', '.join(languages_detected) if languages_detected else 'regional scripts'}. Designed to provoke public panic, bank runs, and supply chain friction.",
            "urgency_rating": "IMMEDIATE (0-30 MINS)",
            "damage_reduction_impact": "Targeting 95% neutralization of foreign C2 botnet amplification and civic panic prevention within 30 minutes of Section 69A IT Act execution.",
            "damage_containment_roadmap": [
                {"phase": "T+0 to T+15m", "milestone": "Issue Emergency Section 69A IT Act Takedown Directives to Intermediaries", "expected_damage_containment": "Blocks 48 primary seed URLs and hostile Telegram channels"},
                {"phase": "T+15m to T+45m", "milestone": "Broadcast Sovereign Counter-Advisory via PIB & State Telecom Circles", "expected_damage_containment": "80% public anxiety neutralization"},
                {"phase": "T+45m to T+2h", "milestone": "Anchor EVM Merkle Evidence Package & Dispatch CERT-In Blacklist", "expected_damage_containment": "Complete adversary botnet infrastructure sequestration"}
            ],
            "tactical_interventions": [
                {"action": "Section 69A IT Act Emergency Blocking Order", "description": "Transmit urgent directive to MeitY for blocking of 48 primary seed URLs and hostile Telegram channels.", "priority": "CRITICAL", "timeframe": "< 15 mins"},
                {"action": "Inter-Agency Intelligence Flash Bulletin", "description": "Disseminate threat actor IOCs and proxy ASN ranges to CERT-In and state police cyber cells.", "priority": "CRITICAL", "timeframe": "< 20 mins"},
                {"action": "Cryptographic Blockchain Evidence Sealing", "description": "Anchor SHA-256 Merkle root package of all coordinated post payloads to EVM notary contract.", "priority": "HIGH", "timeframe": "< 30 mins"},
                {"action": "Public Order Counter-Broadcast via PIB", "description": "Release synchronized multi-language factual advisories across all state telecom circles.", "priority": "HIGH", "timeframe": "< 45 mins"}
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
                    "message": "సోషల్ మీడియాలో వ్యాపిస్తున్న సమాచారం పూర్తిగా అవాస్తవం. అన్ని బ్యాంకిिंग మరియు అత్యవసర సేవలు సాధారణంగా నడుస్తున్నాయి.",
                    "call_to_action": "తప్పుడు సమాచారాన్ని ఫార్వర్డ్ చేయవద్దు."
                }
            ],
            "psychological_prebunking": "Educate the public on 'Burst Coincidence' — showing how identical messages appeared simultaneously across 800 accounts within 5 minutes instantly dismantles citizen belief in organic origin.",
            "statutory_legal_actions": [
                "Section 69A of Information Technology Act 2000 (Emergency Blocking of Information)",
                "Section 65B Indian Evidence Act Cryptographic Certificate Generation / BSA 2023",
                "Bharatiya Nyaya Sanhita (BNS) Section 353 (Statements conducing to public mischief)",
                "EVM Smart Contract SHA-256 Immutable Audit Log Sealing"
            ],
            "channel_matrix": [
                {"channel": "PIB / MeitY Emergency Alert", "recommended_timeframe": "< 15 mins", "tactic": "Issue national multi-lingual gazette denial"},
                {"channel": "Telecom Circle SMS Broadcast", "recommended_timeframe": "< 30 mins", "tactic": "Push localized SMS advisories in northern districts"},
                {"channel": "Platform Compliance Emergency Takedown", "recommended_timeframe": "< 45 mins", "tactic": "Execute statutory API blocking notices"}
            ]
        }
