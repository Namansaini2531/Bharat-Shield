import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_PATH = BASE_DIR / "data" / "synthetic" / "campaign_data.json"
DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)

# Generate 75 realistic social post objects covering 5 distinct narrative campaigns & edge cases
posts = []

# Campaign 1: Telecom Disruption Hoax (Malicious High Burst) - Posts P001 to P25
c1_templates = [
    ("twitter", "en", "URGENT: Government is shutting down internet services tomorrow across all states. Share immediately!"),
    ("telegram", "en", "BREAKING: Total internet suspension ordered by government starting midnight tonight."),
    ("whatsapp_tipline", "hi", "कल से पूरे देश में इंटरनेट बंद होने वाला है। तुरंत सभी व्हाट्सएप ग्रुप में भेजें।"),
    ("whatsapp_tipline", "hi-Latn", "Sarkar kal internet band karne wali hai. Sabko immediately forward karo."),
    ("twitter", "ta", "அவசரம்: நாளை முதல் இணைய சேவை நிறுத்தப்படும் என அரசு அறிவித்துள்ளது. உடனடியாக பகிரவும்."),
    ("news", "en", "Unverified reports claim potential nationwide internet shutdown scheduled for tomorrow."),
    ("twitter", "hi-Latn", "Sarkar internet bandh kar rahi hai kal se. Confirm news guys share fast!"),
    ("telegram", "hi", "सरकार द्वारा इंटरनेट निलंबन का आधिकारिक गुप्त आदेश जारी हुआ।"),
    ("whatsapp_tipline", "bn", "জরুরী: সরকার আগামীকাল ইন্টারনেট পরিষেবা বন্ধ করে দেবে। এখনই শেয়ার করুন।"),
    ("twitter", "en", "ALERT: Telecom providers instructed to throttle 4G/5G networks starting 00:00 UTC.")
]

for i in range(1, 26):
    tmpl = c1_templates[(i - 1) % len(c1_templates)]
    posts.append({
        "id": f"P{i:03d}",
        "platform": tmpl[0],
        "timestamp": f"2026-08-16T09:{i%60:02d}:15",
        "language": tmpl[1],
        "text": tmpl[2] if i <= 10 else f"{tmpl[2]} (Variant #{i})",
        "media_type": "image" if i % 4 == 0 else "text",
        "ocr_text": "INTERNET SHUT DOWN TMROW!! PLS SHARE FAST" if i % 4 == 0 else None,
        "campaign_cluster": "CAMPAIGN_007"
    })

# Campaign 2: Banking / Currency Scam (Malicious High Risk) - Posts P026 to P45
c2_templates = [
    ("whatsapp_tipline", "hi", "RBI का नया नियम: आज रात 12 बजे के बाद ₹500 के नोट अमान्य घोषित। तुरंत बदलें!"),
    ("twitter", "en", "ALERT: RBI revoking validity of 500 Rupee currency notes starting tonight. Massive panic in banks."),
    ("telegram", "hi-Latn", "Sabhi 500 ke note jaldi exchange karlo bank band hone se pehle!"),
    ("facebook", "hi", "बैंकों में भारी भीड़! ₹500 के पुराने नोट जमा करने की अंतिम तिथि आज।"),
    ("twitter", "en", "Urgent notice: All bank ATMs will be locked down for 72 hours due to currency audit.")
]

for i in range(26, 46):
    tmpl = c2_templates[(i - 26) % len(c2_templates)]
    posts.append({
        "id": f"P{i:03d}",
        "platform": tmpl[0],
        "timestamp": f"2026-08-16T11:{(i*2)%60:02d}:00",
        "language": tmpl[1],
        "text": tmpl[2] if i <= 30 else f"{tmpl[2]} [Verified Warning Ref #{i}]",
        "media_type": "text",
        "campaign_cluster": "CAMPAIGN_011"
    })

# Campaign 3: Organic Friendly News (Cricket World Cup Victory - Low Risk Organic) - Posts P046 to P60
c3_templates = [
    ("twitter", "en", "WHAT A WIN! India wins the World Cup final in a stunning last-over thriller! 🇮🇳🏆"),
    ("facebook", "hi", "भारत बना विश्व विजेता! शानदार प्रदर्शन, पूरी टीम को बधाई। 🎉"),
    ("telegram", "en", "Unbelievable match! Captain leads from the front to secure historic trophy."),
    ("twitter", "hi-Latn", "India jeet gayi World Cup!! Epic performance by the bowlers in death overs!"),
    ("whatsapp_tipline", "en", "Congratulations Team India on winning the championship! Proud moment.")
]

for i in range(46, 61):
    tmpl = c3_templates[(i - 46) % len(c3_templates)]
    posts.append({
        "id": f"P{i:03d}",
        "platform": tmpl[0],
        "timestamp": f"2026-08-16T14:{(i*3)%60:02d}:30",
        "language": tmpl[1],
        "text": tmpl[2],
        "media_type": "text",
        "campaign_cluster": "ORGANIC_NEWS_001"
    })

# Edge Cases: Multi-Language Mixed, Audio Transcripts, Empty/Corrupted payloads - Posts P061 to P75
edge_cases = [
    # Edge Case 1: Audio Voice Note Transcript (WhatsApp)
    {"platform": "whatsapp_tipline", "language": "hi-Latn", "text": "[Audio Transcript 0:42]: Bhai news me sunne ko mila hai ki kal petrol pumps pe rationing hogi. Pura tank bharwa lo.", "media_type": "audio", "campaign_cluster": "EDGE_AUDIO_001"},
    # Edge Case 2: Code-Mixed Hinglish + Tamil
    {"platform": "twitter", "language": "hi-Latn", "text": "Arrey yar, chennai la internet slow aa irukku! Is government blocking servers?", "media_type": "text", "campaign_cluster": "EDGE_MIXED_001"},
    # Edge Case 3: Image OCR Only Payload (No raw text)
    {"platform": "whatsapp_tipline", "language": "hi", "text": "[Image Intercept]", "ocr_text": "सरकारी योजना: सभी नागरिकों को मिलेंगे ₹50000 सहायता राशि। इस लिंक पर क्लिक करें।", "media_type": "image", "campaign_cluster": "EDGE_OCR_001"},
    # Edge Case 4: Zero Threat Neutral Query
    {"platform": "twitter", "language": "en", "text": "Does anyone know the official schedule for tomorrow's metro maintenance work?", "media_type": "text", "campaign_cluster": "NEUTRAL_QUERY"},
    # Edge Case 5: Deepfake Video Report Transcript
    {"platform": "telegram", "language": "en", "text": "[Video Analysis]: AI Deepfake video of official news anchor spreading fake stock market crash alert.", "media_type": "video", "campaign_cluster": "EDGE_DEEPFAKE_001"},
    # Edge Case 6: Duplicate Spam Injection
    {"platform": "twitter", "language": "en", "text": "URGENT: Government is shutting down internet services tomorrow across all states. Share immediately!", "media_type": "text", "campaign_cluster": "CAMPAIGN_007"},
    # Edge Case 7: High Emoji Saturation Bot Post
    {"platform": "telegram", "language": "hi", "text": "🚨🚨 इमेरजेंसी नोटिस 🚨🚨 बंद होगा बैंक सर्वर! 😱😱 शेयर करें ➡️ ➡️ ➡️", "media_type": "text", "campaign_cluster": "CAMPAIGN_011"},
    # Edge Case 8: Multilingual Tamil Translation
    {"platform": "whatsapp_tipline", "language": "ta", "text": "நாளை முதல் அனைத்து ஏடிஎம்களும் மூடப்படும் என ரிசர்வ் வங்கி தெரிவித்துள்ளது.", "media_type": "text", "campaign_cluster": "CAMPAIGN_011"},
    # Edge Case 9: Foreign Domain Bulletproof Host Match
    {"platform": "news", "language": "en", "text": "Fringe Alert: Domain resolving to bulletproof hosting subnet 185.220.x.x posting fake emergency advisories.", "media_type": "text", "campaign_cluster": "CAMPAIGN_007"},
    # Edge Case 10: Mixed Hinglish & Emojis
    {"platform": "twitter", "language": "hi-Latn", "text": "Breaking news 🚨 Kal se 500 note ban ho gaya boss!! Viral news forward fast 🔥", "media_type": "text", "campaign_cluster": "CAMPAIGN_011"},
    # Edge Case 11: Single character / Noise input
    {"platform": "whatsapp_tipline", "language": "en", "text": "???", "media_type": "text", "campaign_cluster": "NOISE"},
    # Edge Case 12: Long Official Press Release (False Positive Candidate)
    {"platform": "news", "language": "en", "text": "OFFICIAL PRESS RELEASE: Press Information Bureau issues clarification regarding false rumors circulating on social messaging platforms. Citizens are advised to rely only on official handles.", "media_type": "text", "campaign_cluster": "OFFICIAL_PRESS_RELEASE"},
    # Edge Case 13: Bengali Regional Campaign Variant
    {"platform": "facebook", "language": "bn", "text": "জরুরি খবর: আগামীকাল ব্যাঙ্ক বন্ধ থাকবে, আজই টাকা তুলুন।", "media_type": "text", "campaign_cluster": "CAMPAIGN_011"},
    # Edge Case 14: Automated Bot Retry Pattern
    {"platform": "twitter", "language": "en", "text": "ALERT: RBI revoking validity of 500 Rupee currency notes starting tonight [Bot Retry #09]", "media_type": "text", "campaign_cluster": "CAMPAIGN_011"},
    # Edge Case 15: Audio Note Hinglish Summary
    {"platform": "whatsapp_tipline", "language": "hi-Latn", "text": "[Audio Transcript 1:15]: Voice recording claiming military lockdown in northern sector.", "media_type": "audio", "campaign_cluster": "CAMPAIGN_007"}
]

for idx, ec in enumerate(edge_cases, start=61):
    posts.append({
        "id": f"P{idx:03d}",
        "platform": ec["platform"],
        "timestamp": f"2026-08-16T16:{(idx*4)%60:02d}:45",
        "language": ec["language"],
        "text": ec["text"],
        "media_type": ec.get("media_type", "text"),
        "ocr_text": ec.get("ocr_text", None),
        "campaign_cluster": ec["campaign_cluster"]
    })

# Save JSON file
with open(DATASET_PATH, "w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"Generated synthetic dataset with {len(posts)} posts across 5 campaigns and all edge cases.")
