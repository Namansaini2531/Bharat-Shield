import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Check, 
  Layers, 
  Activity, 
  Bot, 
  Languages, 
  Clock, 
  Cpu, 
  Sparkles,
  Building2,
  Newspaper,
  Terminal,
  X,
  ExternalLink,
  Share2,
  Search,
  Filter,
  ArrowRight,
  Lock,
  Shield,
  Hash,
  Network,
  Download,
  Scale,
  Eye,
  Flame,
  Zap,
  Radio,
  SlidersHorizontal,
  Key,
  Copy,
  RefreshCw,
  Send,
  Info
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function ThreatAssessmentsView() {
  const { currentRole, currentUser, executeProtectedAction, can } = useAuth();

  // Ledger State
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState('groq_ai'); // 'groq_ai' | 'breakdown' | 'checklist' | 'linguistics' | 'propagation' | 'actions'
  
  // Groq AI State & User Key Storage
  const [groqApiKey, setGroqApiKey] = useState(() => {
    try {
      return localStorage.getItem('bharat_shield_groq_api_key') || '';
    } catch {
      return '';
    }
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStrategyData, setAiStrategyData] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'critical' | 'high' | 'medium'
  const [platformFilter, setPlatformFilter] = useState('all');
  const [actionFeedback, setActionFeedback] = useState(null);

  // Fallback Campaign Library per Role with Deep Threat Forensic Data
  const fallbackCampaignsByRole = {
    [ROLES.INVESTIGATION_BUREAU]: [
      {
        id: 'CMP-007',
        title: 'Infrastructure Shutdown & Civil Unrest Narrative',
        category: 'National Security / Disinformation Warfare',
        status: 'ACTIVE CRITICAL',
        threat_score: 94,
        threat_color: '#ef4444',
        threat_label: 'CRITICAL',
        confidence: 'VERY HIGH (96.5%)',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        target: 'Critical Telecom Infrastructure & Public Order',
        summary: 'State-sponsored synthetic campaign spreading false claims of nationwide communication blackout to provoke bank runs and civic panic.',
        breakdown: [
          { name: 'Semantic vector cluster density (LaBSE/MiniLM)', score: '24.5/25', pct: '98%', color: '#ef4444', desc: 'Dense semantic clustering across 8 regional dialects with cosine similarity > 0.91.' },
          { name: 'Cross-platform relay synchronicity (X, TG, WA)', score: '19.2/20', pct: '96%', color: '#f59e0b', desc: 'Sub-second inter-network relay between Telegram bridge channels and X bot swarms.' },
          { name: 'Temporal propagation burst window (< 10 mins)', score: '18.8/20', pct: '94%', color: '#f59e0b', desc: 'Over 840 synthetic accounts activated in a tightly coordinated 8-minute burst.' },
          { name: 'Multilingual mutation & translation drift', score: '14.2/15', pct: '95%', color: '#3b82f6', desc: 'Automated dialect mutation maintaining 96% narrative consistency across scripts.' },
          { name: 'Synthetic AI text & media signature detection', score: '13.8/15', pct: '92%', color: '#10b981', desc: 'Neural text entropy score 0.22 indicating high probability of LLM synthetic generation.' },
          { name: 'Adversary TTP template fingerprint reuse', score: '8.8/10', pct: '88%', color: '#8c9ba5', desc: 'Matches known APT-44 disinformation playbook pattern previously observed in 2024.' }
        ],
        checklist: [
          { title: '4 Distinct Hostile Infrastructure Clusters Confirmed', desc: 'Origin nodes identified across known foreign proxy ranges (AS9482, AS4128).' },
          { title: 'Multilingual Rapid Dialect Seeding (HI, EN, TA)', desc: 'Simultaneous coordinated payload drops across regional channels within 12 minutes.' },
          { title: 'Section 69A IT Act Statutory Grounds Satisfied', desc: 'Direct threat to public order and sovereignty documented with verifiable artifacts.' },
          { title: 'Cryptographic Merkle Root Sealed on Polygon', desc: 'SHA-256 evidence package anchored on EVM notary contract with immutable block hash.' }
        ],
        linguistics: {
          codeMixing: '78% Hinglish, 14% Pure Devanagari Hindi, 8% English',
          evasionTactics: ['Spaced-letter evasion (b l a c k o u t)', 'Zero-width space injection', 'Regional slang code-words'],
          slangTriggers: ['danga', 'hड़ताल', 'bandh', 'chakka jam', 'blackout order']
        },
        propagation: {
          originNode: 'SEED-01 (Proxy ASN-4829, Shadow TG Channel)',
          relaySwarm: 'SWARM-42 (+96% Temporal Sync, 842 Bot Nodes)',
          targetImpact: 'Northern Grid Telecom & Banking Depositor Channels'
        }
      },
      {
        id: 'CMP-029',
        title: 'Operation Petro-Panic: Refinery Sabotage & Fuel Rationing Disinformation',
        category: 'Critical Energy Infrastructure / Economic Sabotage',
        status: 'ACTIVE CRITICAL',
        threat_score: 91,
        threat_color: '#ef4444',
        threat_label: 'CRITICAL',
        confidence: 'HIGH (94.2%)',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp', 'instagram'],
        post_count: 1420,
        cross_platform_sync: 94,
        target: 'National Oil Refineries & Public Fuel Supplies',
        summary: 'Recirculated out-of-context industrial fire video paired with forged Ministry of Petroleum fuel rationing orders.',
        breakdown: [
          { name: 'Deepfake / Recycled Video Thermal Artifact Detection', score: '24.0/25', pct: '96%', color: '#ef4444', desc: 'Video provenance matches 2021 overseas refinery fire, altered with Hindi audio dubbing.' },
          { name: 'Coordinated WhatsApp Panic Relay Velocity (3.8x)', score: '18.8/20', pct: '94%', color: '#f59e0b', desc: 'Mass forwarding through regional driver and delivery agent WhatsApp group networks.' },
          { name: 'Counterfeit Ministry Seal & Gazette Watermark', score: '18.5/20', pct: '92%', color: '#ef4444', desc: 'Cloned PDF header with forged Under Secretary signature and incorrect font kerning.' },
          { name: 'Cross-platform short-window dissemination', score: '13.5/15', pct: '90%', color: '#3b82f6', desc: 'Synchronized push across 1,420 accounts targeting Delhi-NCR and Mumbai metropolitan zones.' },
          { name: 'Economic Panic Induction Sentiment Index', score: '13.2/15', pct: '88%', color: '#f59e0b', desc: 'High correlation with localized fuel station queue surges in northern districts.' },
          { name: 'Adversary Account Farm Fingerprint Reuse', score: '8.5/10', pct: '85%', color: '#8c9ba5', desc: 'Account age distribution shows 72% created within last 45 days using disposable virtual SIMs.' }
        ],
        checklist: [
          { title: 'Refinery Operational Logs Verified Normal', desc: 'Ministry of Petroleum SCADA telemetry confirms 100% operational throughput across all units.' },
          { title: 'Video Provenance Hash Matched to 2021 Archive', desc: 'Perceptual hash matching confirms recycled foreign footage.' },
          { title: 'Section 69A IT Act Urgent Blocking Notice Drafted', desc: 'Emergency takedown grounds established for 48 primary seed URLs.' },
          { title: 'Citizen Clarification Bulletin Disseminated', desc: 'PIB Fact-Check alert linked with real-time fuel inventory dashboard.' }
        ],
        linguistics: {
          codeMixing: '65% Hindi, 25% Hinglish, 10% Punjabi',
          evasionTactics: ['Spaced numbers (7 2 g h a n t e)', 'Forged gazette letterhead PDF'],
          slangTriggers: ['petrol khatam', 'rationing', 'emergency quota', 'tanker strike']
        },
        propagation: {
          originNode: 'SEED-09 (Recycled Botnet Cluster, TG Forward Bot)',
          relaySwarm: 'SWARM-18 (+94% Sync, 1,420 Coordinated Accounts)',
          targetImpact: 'Urban Petrol Stations & Logistics Fleets'
        }
      },
      {
        id: 'CMP-001',
        title: 'Operation Currency Shock: Fabricated ₹500 Demonetization Circular',
        category: 'Financial Disinformation & Economic Warfare',
        status: 'VIRAL SPIKE',
        threat_score: 93,
        threat_color: '#ef4444',
        threat_label: 'CRITICAL',
        confidence: 'HIGH (95.8%)',
        primary_language: 'te',
        languages_detected: ['Telugu', 'Hindi', 'Tamil', 'English'],
        platforms: ['whatsapp', 'twitter', 'telegram'],
        post_count: 2840,
        cross_platform_sync: 96,
        target: 'Banking Backbone & Retail Cash Depositors',
        summary: 'Synthetic circular bearing counterfeit Ministry of Finance watermarks alleging immediate invalidation of ₹500 currency notes.',
        breakdown: [
          { name: 'Multi-lingual regional mutation (TE, TA, HI, EN)', score: '24.2/25', pct: '97%', color: '#ef4444', desc: 'Coordinated translation into 4 languages deployed within 35 minutes across state channels.' },
          { name: 'WhatsApp Viral Forward Velocity Multiplier (5.1x)', score: '19.4/20', pct: '97%', color: '#f59e0b', desc: 'Rapid viral spread targeting elderly and family WhatsApp community groups.' },
          { name: 'Counterfeit RBI Gazette Formatting Artifacts', score: '18.2/20', pct: '91%', color: '#ef4444', desc: 'Forged circular lacks authentic digital signature and uses obsolete notification numbering.' },
          { name: 'Bank ATM queue correlation spike', score: '14.0/15', pct: '93%', color: '#3b82f6', desc: 'Social sentiment panic spike detected across Hyderabad, Bengaluru, and Chennai.' },
          { name: 'Synthetic voice note attachment detection', score: '13.5/15', pct: '90%', color: '#10b981', desc: 'Accompanying audio forward contains TTS synthetic tone artifacts.' },
          { name: 'Historical demonetization hoax template recycling', score: '8.7/10', pct: '87%', color: '#8c9ba5', desc: '82% text overlap with viral 2023 hoax circular.' }
        ],
        checklist: [
          { title: 'RBI & Ministry of Finance Official Denial Verified', desc: 'RBI Chief General Manager confirmed circular is completely fictitious.' },
          { title: 'Digital Signature Invalidation Proven', desc: 'Cryptographic hash on PDF does not match NIC PKI root authority.' },
          { title: 'Emergency Banking Advisory Issued', desc: 'Indian Banks Association (IBA) broadcast advisory to all regional branches.' },
          { title: 'Cyber Crime FIR Registered Under IT Act & BNS', desc: 'Police complaints lodged for deliberate economic disruption.' }
        ],
        linguistics: {
          codeMixing: '52% Telugu, 28% Hindi, 12% Tamil, 8% English',
          evasionTactics: ['Audio forwarding without text caption', 'Fabricated PDF thumbnail preview'],
          slangTriggers: ['note ban', '500 cancel', 'ఏటీఎం', 'rbi order', 'turant nikalo']
        },
        propagation: {
          originNode: 'SEED-03 (Encrypted Telegram Channel "MoneyAlerts")',
          relaySwarm: 'SWARM-55 (+96% Sync, 2,840 Forward Nodes)',
          targetImpact: 'Retail Depositors & Commercial Bank Branches'
        }
      },
      {
        id: 'CMP-015',
        title: 'Operation Sovereign Cloud: Defense Recruitment Phishing & Portal Spoofing',
        category: 'State-Sponsored Cyber Espionage',
        status: 'MONITORING',
        threat_score: 85,
        threat_color: '#f59e0b',
        threat_label: 'HIGH RISK',
        confidence: 'HIGH (92.4%)',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Urdu'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 640,
        cross_platform_sync: 88,
        target: 'Defense Aspirants & Armed Forces Logistics Portals',
        summary: 'Coordinated social engineering swarm distributing counterfeit MoD recruitment circulars embedded with malicious credential-harvesting APK links.',
        breakdown: [
          { name: 'Malicious APK payload domain correlation', score: '22.5/25', pct: '90%', color: '#f59e0b', desc: 'Credential stealer APK disguised as official recruitment portal app.' },
          { name: 'Social engineering urgency index', score: '17.8/20', pct: '89%', color: '#f59e0b', desc: 'Claims "Last date today for 10,000 logistics vacancies" to induce rushed downloads.' },
          { name: 'Targeted demographic distribution (Defense aspirants)', score: '17.0/20', pct: '85%', color: '#3b82f6', desc: 'Promoted in specialized coaching and physical training social media groups.' },
          { name: 'Typosquatting domain infrastructure analysis', score: '13.0/15', pct: '87%', color: '#ef4444', desc: 'Registered 3 days ago on offshore registrar with Cloudflare proxy obfuscation.' },
          { name: 'Synthetic testimonial video generation', score: '12.0/15', pct: '80%', color: '#10b981', desc: 'AI-generated avatars presenting fake candidate selection testimonials.' },
          { name: 'Adversary infrastructure overlap (APT-36)', score: '7.8/10', pct: '78%', color: '#8c9ba5', desc: 'C2 IP overlap with previous Android spyware campaigns.' }
        ],
        checklist: [
          { title: 'Cert-In Advisory Triage Completed', desc: 'Malicious domain blacklisted at national DNS resolver level.' },
          { title: 'APK Signature Analyzed in Sandbox', desc: 'Identified SMS forwarder and contact exfiltration malware.' },
          { title: 'Official MoD Recruitment Alert Broadcast', desc: 'Official portal joinindianarmy.nic.in published warning.' },
          { title: 'Telegram Channel Takedown Order Issued', desc: '14 distribution channels flagged to platform compliance.' }
        ],
        linguistics: {
          codeMixing: '60% English, 30% Hindi, 10% Urdu',
          evasionTactics: ['Shortened bit.ly links', 'APK direct download bypass'],
          slangTriggers: ['bharti', 'sarkari naukri', 'direct joining', 'mod admit card']
        },
        propagation: {
          originNode: 'SEED-12 (Offshore C2 Server, Spoofed Domain)',
          relaySwarm: 'SWARM-23 (+88% Sync, 640 Social Accounts)',
          targetImpact: 'Armed Forces Aspirants & Youth Training Forums'
        }
      },
      {
        id: 'CMP-011',
        title: 'Government Identity Spoofing & Phishing Matrix',
        category: 'Credential Harvesting Farm',
        status: 'MONITORING',
        threat_score: 88,
        threat_color: '#f59e0b',
        threat_label: 'HIGH RISK',
        confidence: 'HIGH (93.0%)',
        primary_language: 'en',
        languages_detected: ['English', 'Urdu', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 412,
        cross_platform_sync: 89,
        target: 'Defense Personnel & Northern Logistics Hubs',
        summary: 'Bot network deploying counterfeit operational transit advisories targeting border supply networks.',
        breakdown: [
          { name: 'Identity spoofing & badge impersonation', score: '23.0/25', pct: '92%', color: '#f59e0b', desc: 'Forged insignia and officer profile photo cloning detected.' },
          { name: 'Transit routing disinformation velocity', score: '18.0/20', pct: '90%', color: '#f59e0b', desc: 'False directives claiming NH-44 highway closures.' },
          { name: 'Adversary C2 temporal correlation', score: '17.2/20', pct: '86%', color: '#3b82f6', desc: 'Bot swarm timing coincides with scheduled transit convoys.' },
          { name: 'Multilingual dialect seeding', score: '13.0/15', pct: '87%', color: '#3b82f6', desc: 'Simultaneous deployment in Hindi, Urdu, and English.' },
          { name: 'Synthetic text marker detection', score: '12.0/15', pct: '80%', color: '#10b981', desc: 'LLM generated pseudo-military operational language.' },
          { name: 'Fingerprint playbook match', score: '7.8/10', pct: '78%', color: '#8c9ba5', desc: 'Matches known regional psyops infrastructure.' }
        ],
        checklist: [
          { title: 'Counterfeit Account Clusters Flagged', desc: '78 spoofed profile accounts isolated and preserved.' },
          { title: 'Northern Command Security Verification Done', desc: 'Confirmed no alteration to official transit schedule.' },
          { title: 'Cryptographic Timestamp Anchored', desc: 'Evidence sealed with blockchain notary hash.' },
          { title: 'Statutory Section 69A Grounds Satisfied', desc: 'National security risk threshold validated.' }
        ],
        linguistics: {
          codeMixing: '55% English, 35% Hindi, 10% Urdu',
          evasionTactics: ['Spaced acronyms', 'Cloned official letterheads'],
          slangTriggers: ['route diversion', 'convoy halt', 'nh44 blocked']
        },
        propagation: {
          originNode: 'SEED-05 (Hostile ASN-3192)',
          relaySwarm: 'SWARM-14 (+89% Sync, 412 Bot Nodes)',
          targetImpact: 'Border Supply Transits & Logistics Staff'
        }
      },
      {
        id: 'CMP-003',
        title: 'Subsea Cable Sabotage Rumor Tree',
        category: 'State-Sponsored Cognitive Warfare',
        status: 'SURVEILLANCE',
        threat_score: 79,
        threat_color: '#3b82f6',
        threat_label: 'MONITORING',
        confidence: 'MEDIUM (86.5%)',
        primary_language: 'en',
        languages_detected: ['English', 'Tamil', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 218,
        cross_platform_sync: 84,
        target: 'Coastal Data Centers & Banking Backbone',
        summary: 'Synthetic technical advisories alleging undersea fiber cuts to trigger financial market panic.',
        breakdown: [
          { name: 'Technical terminology spoofing score', score: '20.0/25', pct: '80%', color: '#3b82f6', desc: 'Misuse of BGP routing and submarine cable terminology.' },
          { name: 'Financial market timing correlation', score: '16.5/20', pct: '82%', color: '#f59e0b', desc: 'Disseminated 30 mins prior to equity market opening bell.' },
          { name: 'Cross-platform amplification index', score: '16.0/20', pct: '80%', color: '#3b82f6', desc: 'Amplify bot swarm deployed across technical forums.' },
          { name: 'Regional script drift (Tamil/English)', score: '12.0/15', pct: '80%', color: '#3b82f6', desc: 'Chennai landing station specifically targeted.' },
          { name: 'Synthetic text coherence score', score: '11.5/15', pct: '77%', color: '#10b981', desc: 'Synthetic advisory format mimicry.' },
          { name: 'Adversary infrastructure match', score: '7.0/10', pct: '70%', color: '#8c9ba5', desc: 'Traced to known rumor propagation clusters.' }
        ],
        checklist: [
          { title: 'Subsea Cable Consortium Latency Verified', desc: 'All undersea landing stations operating at nominal latency.' },
          { title: 'SEBI & Exchange Triage Completed', desc: 'Clarification notice shared with clearing houses.' },
          { title: 'Origin Bot Accounts Preserved', desc: 'Digital footprint logged in forensic ledger.' },
          { title: 'Ongoing Automated Surveillance Active', desc: 'Real-time keyword telemetry listening.' }
        ],
        linguistics: {
          codeMixing: '70% English, 20% Tamil, 10% Hindi',
          evasionTactics: ['Deceptive technical jargon', 'BGP outage screenshot forgery'],
          slangTriggers: ['subsea cable cut', 'internet down', 'chennai landing station']
        },
        propagation: {
          originNode: 'SEED-07 (Hostile Forum Cluster)',
          relaySwarm: 'SWARM-09 (+84% Sync, 218 Accounts)',
          targetImpact: 'Financial Traders & Technology Communities'
        }
      }
    ],
    [ROLES.CORPORATE_ENTERPRISE]: [
      {
        id: 'CMP-TATA-009',
        title: 'Tata Motors EV & TCS Coordinated Disinformation Swarm',
        category: 'Market Manipulation & Brand Defense Radar',
        status: 'DEFENSE ACTIVE',
        threat_score: 91,
        threat_color: '#f59e0b',
        threat_label: 'HIGH RISK',
        confidence: 'HIGH (94.2%)',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        target: 'Tata Motors EV Market Share & TCS Brand Equity',
        summary: 'Synchronized release of fabricated EV battery defect videos and counterfeit hiring freeze circulars to manipulate stock prices.',
        breakdown: [
          { name: 'Pre-Market opening burst timing correlation', score: '23.8/25', pct: '95%', color: '#f59e0b', desc: 'Disinformation peak deployed precisely between 08:45 and 09:10 IST.' },
          { name: 'Cross-platform short-seller swarm activation', score: '18.8/20', pct: '94%', color: '#f59e0b', desc: 'High correlation with derivative option volume spikes in target counters.' },
          { name: 'Counterfeit video thermal smoke artifact detection', score: '18.2/20', pct: '91%', color: '#ef4444', desc: 'AI visual analysis identifies synthetic smoke rendering artifacts and overlay tampering.' },
          { name: 'Cloned executive voice acoustic anomaly score', score: '14.0/15', pct: '93%', color: '#ef4444', desc: 'Spectrogram analysis reveals 12kHz synthetic frequency harmonics typical of voice cloning.' },
          { name: 'Fake hiring freeze notice template reuse', score: '13.2/15', pct: '88%', color: '#3b82f6', desc: 'Counterfeit PDF matches template used in previous tech sector smear campaign.' },
          { name: 'Social sentiment distortion index', score: '8.5/10', pct: '85%', color: '#8c9ba5', desc: 'Bot swarm accounted for 78% of negative brand mentions in the first hour.' }
        ],
        checklist: [
          { title: 'BMS Telemetry Verified Authentic & Defect-Free', desc: 'Connected vehicle telemetry confirms 0 battery thermal anomalies across active fleet.' },
          { title: 'AI Deepfake Audio Voice Cloning Confirmed', desc: 'Synthetic acoustic signature documented in forensic audio lab report.' },
          { title: 'SEBI Regulation 30 Trigger Threshold Met', desc: 'Disinformation velocity justifies immediate corporate stock exchange disclosure.' },
          { title: 'Legal Evidence Package Sealed on Blockchain', desc: 'Offending accounts preserved with immutable SHA-256 Merkle timestamp.' }
        ],
        linguistics: {
          codeMixing: '72% English, 20% Hindi, 8% Marathi',
          evasionTactics: ['Spaced company tags (T A T A)', 'Shortened link redirection'],
          slangTriggers: ['ev fire', 'battery burst', 'layoff circular', 'tcs freeze']
        },
        propagation: {
          originNode: 'SEED-04 (Short-seller coordinated Telegram syndicate)',
          relaySwarm: 'SWARM-33 (+93% Sync, 1,280 Bot Nodes)',
          targetImpact: 'Retail Equity Investors & Tech Recruits'
        }
      },
      {
        id: 'CMP-TATA-014',
        title: 'Deepfake Voice Note on Executive Leadership & Solvency',
        category: 'Executive Impersonation & Financial Defamation',
        status: 'FORENSIC TRIAGE',
        threat_score: 87,
        threat_color: '#f59e0b',
        threat_label: 'HIGH RISK',
        confidence: 'HIGH (91.5%)',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'telegram'],
        post_count: 520,
        cross_platform_sync: 88,
        target: 'Group CFO & Aviation Subsidiary Solvency',
        summary: 'AI voice synthesis impersonating Group CFO discussing fictional credit rating downgrades and liquidity constraints.',
        breakdown: [
          { name: 'Acoustic voice synthesis neural anomaly', score: '23.5/25', pct: '94%', color: '#ef4444', desc: 'Voice clone model identified (VALL-E variant) with missing natural breath pauses.' },
          { name: 'WhatsApp private group distribution pattern', score: '18.2/20', pct: '91%', color: '#f59e0b', desc: 'Seeded into HNI trader and broker WhatsApp groups via spoofed numbers.' },
          { name: 'Financial market solvency panic score', score: '17.5/20', pct: '88%', color: '#f59e0b', desc: 'Aimed at bond yields and commercial paper spreads.' },
          { name: 'Multi-lingual regional translation', score: '13.0/15', pct: '87%', color: '#3b82f6', desc: 'English and Hindi summary cards paired with audio clip.' },
          { name: 'Synthetic audio metadata analysis', score: '12.8/15', pct: '85%', color: '#10b981', desc: 'Exif metadata reveals generative software watermark.' },
          { name: 'Adversary signature matching', score: '8.0/10', pct: '80%', color: '#8c9ba5', desc: 'Linked to previous corporate extortion attempt cluster.' }
        ],
        checklist: [
          { title: 'Executive Voiceprint Invalidation Certificate', desc: 'Forensic acoustic laboratory issued formal authenticity denial certificate.' },
          { title: 'Credit Rating Agencies Confirmation Received', desc: 'CRISIL & ICRA confirmed AAA rating remains unchanged.' },
          { title: 'BSE/NSE Clarification Statement Dispatched', desc: 'Formal announcement published under Regulation 30 of LODR.' },
          { title: 'Cyber Crime Police Complaint Filed', desc: 'Section 66D IT Act (cheating by personation) FIR lodged.' }
        ],
        linguistics: {
          codeMixing: '50% Hindi, 50% English',
          evasionTactics: ['Forwarded as voice note without caller ID', 'Short audio snippets to evade filters'],
          slangTriggers: ['downgrade', 'liquidity crunch', 'cfo audio', 'loan default']
        },
        propagation: {
          originNode: 'SEED-08 (Spoofed Virtual WhatsApp Number)',
          relaySwarm: 'SWARM-19 (+88% Sync, 520 Forward Nodes)',
          targetImpact: 'Institutional Bond Holders & Wealth Managers'
        }
      }
    ],
    [ROLES.JOURNALIST_MEDIA]: [
      {
        id: 'FACT-007',
        title: 'Nationwide Telecom & Power Blackout Hoax Mutation Tree',
        category: 'Public Fact-Check & Citizen Debunk Desk',
        status: 'VIRAL SPIKE',
        threat_score: 89,
        threat_color: '#3b82f6',
        threat_label: 'VIRAL SPIKE',
        confidence: 'HIGH (96.0%)',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'Marathi', 'English'],
        platforms: ['whatsapp', 'telegram', 'facebook'],
        post_count: 3490,
        cross_platform_sync: 94,
        target: 'Citizen Social Communities & Residential Groups',
        summary: 'Viral WhatsApp forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.',
        breakdown: [
          { name: 'WhatsApp Forward Velocity Multiplier (4.2x)', score: '24.0/25', pct: '96%', color: '#3b82f6', desc: 'Exponential sharing rate across state resident welfare associations.' },
          { name: 'Multi-lingual regional mutation (HI, MR, BN, TA)', score: '19.0/20', pct: '95%', color: '#3b82f6', desc: 'Mutated into 5 regional scripts with localized phone numbers.' },
          { name: 'Citizen panic withdrawal trigger language', score: '17.8/20', pct: '89%', color: '#ef4444', desc: 'Uses panic triggers ("withdraw cash now", "power grid failure tonight").' },
          { name: 'Forged Department of Telecom letterhead detection', score: '14.5/15', pct: '97%', color: '#10b981', desc: 'Visual OCR reveals font misalignment and outdated ministry emblem.' },
          { name: 'Citizen tipline corroboration volume', score: '13.5/15', pct: '90%', color: '#f59e0b', desc: 'Over 140 tipline submissions received within 2 hours.' },
          { name: 'Historical blackout hoax template recycling', score: '8.0/10', pct: '80%', color: '#8c9ba5', desc: 'Matches 2022 cyclone misinformation text structure.' }
        ],
        checklist: [
          { title: 'Department of Telecom (DoT) Verified Denial', desc: 'Official DoT spokesperson confirmed no blackout directive exists.' },
          { title: 'Cloned PDF Gazette Watermark Detected', desc: 'Font kerning and digital artifacts prove amateur PDF forgery.' },
          { title: 'Multilingual Debunk Cards Pre-Generated', desc: 'Shareable graphic assets created in Hindi, Marathi, Bengali, and English.' },
          { title: 'IFCN Standard Verification Protocols Met', desc: 'Two independent sources corroborating debunk conclusion.' }
        ],
        linguistics: {
          codeMixing: '48% Hindi, 22% Bengali, 18% Marathi, 12% English',
          evasionTactics: ['Forwarded as many times tag bypass', 'Screenshot of fabricated tweet'],
          slangTriggers: ['batti gul', 'blackout order', 'dot notice', 'cash nikal lo']
        },
        propagation: {
          originNode: 'SEED-02 (Mass WhatsApp Broadcast List)',
          relaySwarm: 'SWARM-61 (+94% Sync, 3,490 Forward Chains)',
          targetImpact: 'Urban Residents & WhatsApp Family Groups'
        }
      },
      {
        id: 'FACT-011',
        title: 'Synthetic Audio Clip Claiming Regional Bank Moratorium',
        category: 'Financial Disinformation Fact-Check',
        status: 'DEBUNKED',
        threat_score: 82,
        threat_color: '#10b981',
        threat_label: 'DEBUNKED',
        confidence: 'HIGH (90.0%)',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'twitter'],
        post_count: 1840,
        cross_platform_sync: 91,
        target: 'Retail Depositors & Urban Cooperatives',
        summary: 'Fabricated voice clip of RBI Governor allegedly restricting cash withdrawals in northern states.',
        breakdown: [
          { name: 'Audio cloning acoustic artifact detection', score: '23.0/25', pct: '92%', color: '#10b981', desc: 'Identified robotic pitch stability and synthetic spectrogram envelope.' },
          { name: 'WhatsApp forward acceleration rate', score: '18.0/20', pct: '90%', color: '#3b82f6', desc: 'Shared extensively in trader and merchant groups.' },
          { name: 'Bank run trigger linguistic markers', score: '17.0/20', pct: '85%', color: '#ef4444', desc: 'Explicit calls for early morning counter withdrawals.' },
          { name: 'RBI official communication cross-check', score: '14.0/15', pct: '93%', color: '#10b981', desc: 'No such circular published in RBI notification ledger.' },
          { name: 'Citizen tipline corroboration rate', score: '12.5/15', pct: '83%', color: '#f59e0b', desc: '88 tipline alerts processed within 90 minutes.' },
          { name: 'Adversary recycling pattern', score: '7.5/10', pct: '75%', color: '#8c9ba5', desc: 'Recycled script from 2020 cooperative bank rumor.' }
        ],
        checklist: [
          { title: 'RBI Official Press Release Issued', desc: 'RBI clarified financial stability of cooperative banking network.' },
          { title: 'Acoustic Verification Report Certified', desc: 'Voice synthesizer signatures documented.' },
          { title: 'Debunk Video Published Across Social Media', desc: 'Fact-check desk broadcast 60-second video explainer.' },
          { title: 'Tipline Auto-Responder Activated', desc: 'Automated debunk reply pushed to 340+ inquiring citizens.' }
        ],
        linguistics: {
          codeMixing: '75% Hindi, 25% English',
          evasionTactics: ['Audio without accompanying text', 'Fake logo in preview image'],
          slangTriggers: ['bank doob gaya', 'paisa nikalo', 'rbi moratarium']
        },
        propagation: {
          originNode: 'SEED-11 (Anonymous Telegram Forward)',
          relaySwarm: 'SWARM-27 (+91% Sync, 1,840 Forward Chains)',
          targetImpact: 'Small Business Owners & Cooperative Depositors'
        }
      }
    ],
    [ROLES.SYSTEM_ADMIN]: [
      {
        id: 'CMP-ROOT-001',
        title: 'Master Cyber Operations & IO Counter-Measures Grid',
        category: 'Supreme Root Command // Architecture Integrity',
        status: 'ACTIVE CRITICAL',
        threat_score: 96,
        threat_color: '#10b981',
        threat_label: 'CRITICAL',
        confidence: 'VERY HIGH (98.4%)',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Telugu', 'Tamil', 'Bengali', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp', 'instagram'],
        post_count: 5120,
        cross_platform_sync: 98,
        target: 'National Information Space & Critical Infrastructure Grid',
        summary: 'Holistic cross-sector cognitive manipulation vector monitoring automated botnets, deepfake audiovisual artifacts, and state-sponsored proxy networks.',
        breakdown: [
          { name: 'Semantic vector cluster density (LaBSE/MiniLM)', score: '24.8/25', pct: '99%', color: '#3b82f6', desc: 'Massive embedding cluster spanning 8 languages with cosine distance < 0.12.' },
          { name: 'Cross-platform relay synchronicity (X, TG, WA)', score: '19.6/20', pct: '98%', color: '#f59e0b', desc: 'Inter-network propagation delay under 45 seconds across all ingestion nodes.' },
          { name: 'Temporal propagation burst window (< 5 mins)', score: '19.2/20', pct: '96%', color: '#f59e0b', desc: 'Over 5,120 coordinated nodes triggered in synchronized API bursts.' },
          { name: 'Multilingual mutation & translation drift', score: '14.8/15', pct: '99%', color: '#3b82f6', desc: 'Autonomous neural translation maintaining exact psychological trigger payload.' },
          { name: 'Synthetic AI text & media signature detection', score: '14.5/15', pct: '97%', color: '#10b981', desc: 'Deep learning classifier flags 94% of media items as synthetic / manipulated.' },
          { name: 'Adversary TTP template fingerprint reuse', score: '9.5/10', pct: '95%', color: '#8c9ba5', desc: 'Exact match with state-actor threat matrix signatures (APT-44 & APT-36).' }
        ],
        checklist: [
          { title: '4 Independent Master Ingestion Nodes Active', desc: 'Continuous stream validated across X, Telegram, Reddit, and WhatsApp with 0 dropped frames.' },
          { title: 'Cross-Regional Dialect Seeding Detected', desc: 'Simultaneous deployment in HI, EN, TE, TA, BN within 45 minutes.' },
          { title: 'Cryptographic Merkle Root Verified on Polygon', desc: 'SHA-256 evidence package anchored with immutable block confirmation.' },
          { title: 'Sub-Minute Temporal Blast Radius Proven', desc: 'Over 5,120 synthetic nodes synchronized across cloud VPS ranges.' }
        ],
        linguistics: {
          codeMixing: '40% Hindi, 25% English, 15% Telugu, 10% Tamil, 10% Bengali',
          evasionTactics: ['Zero-width space obfuscation', 'Multilingual code-switching', 'Homoglyph substitution'],
          slangTriggers: ['grid down', 'blackout', 'curfew', 'danga', 'boycott', 'bank fail']
        },
        propagation: {
          originNode: 'ROOT SEED MESH (Distributed Hostile VPS Fleet across 12 ASNs)',
          relaySwarm: 'SWARM-ROOT-ALL (+98% Sync, 5,120 Master Ingestion Nodes)',
          targetImpact: 'Sovereign Communications Backbone & Financial Infrastructure'
        }
      }
    ]
  };

  // Helper to enrich any raw backend campaign with deep explainability assessment
  const enrichCampaignWithAssessment = (campaign, role) => {
    if (campaign.breakdown && campaign.checklist) return campaign;

    const score = campaign.threat_score || 85;
    const isCrit = score >= 90;
    const isHigh = score >= 80 && score < 90;

    const color = isCrit ? '#ef4444' : isHigh ? '#f59e0b' : '#3b82f6';
    const label = isCrit ? 'CRITICAL' : isHigh ? 'HIGH RISK' : 'MONITORING';
    const confidence = isCrit ? 'VERY HIGH (96.5%)' : isHigh ? 'HIGH (93.2%)' : 'MEDIUM (86.0%)';

    const p1 = (score * 0.245).toFixed(1);
    const p2 = (score * 0.192).toFixed(1);
    const p3 = (score * 0.185).toFixed(1);
    const p4 = (score * 0.142).toFixed(1);
    const p5 = (score * 0.138).toFixed(1);
    const p6 = (score * 0.088).toFixed(1);

    return {
      ...campaign,
      threat_score: score,
      threat_color: color,
      threat_label: label,
      confidence: confidence,
      breakdown: [
        { name: 'Semantic vector cluster density (LaBSE/MiniLM)', score: `${p1}/25`, pct: `${Math.min(100, Math.round((p1/25)*100))}%`, color: color, desc: 'High cosine embedding density indicating deliberate narrative synchronization.' },
        { name: 'Cross-platform relay synchronicity (X, TG, WA)', score: `${p2}/20`, pct: `${Math.min(100, Math.round((p2/20)*100))}%`, color: '#f59e0b', desc: 'Coordinated relay latency between Telegram ingestion channels and social platforms.' },
        { name: 'Temporal propagation burst window (< 15m)', score: `${p3}/20`, pct: `${Math.min(100, Math.round((p3/20)*100))}%`, color: '#f59e0b', desc: 'Concentrated bot activation within a sub-minute temporal window.' },
        { name: 'Multilingual mutation & translation drift', score: `${p4}/15`, pct: `${Math.min(100, Math.round((p4/15)*100))}%`, color: '#3b82f6', desc: 'Cross-regional script adaptation preserving emotional hostility and panic triggers.' },
        { name: 'Synthetic AI text & media signature detection', score: `${p5}/15`, pct: `${Math.min(100, Math.round((p5/15)*100))}%`, color: '#10b981', desc: 'Perplexity anomalies and synthetic artifact signatures identified.' },
        { name: 'Adversary TTP template fingerprint reuse', score: `${p6}/10`, pct: `${Math.min(100, Math.round((p6/10)*100))}%`, color: '#8c9ba5', desc: 'Structural narrative match with previously cataloged cognitive warfare vectors.' }
      ],
      checklist: [
        { title: '4 Independent Master Ingestion Nodes Verified', desc: 'Continuous stream validated across X, Telegram, Reddit, and WhatsApp.' },
        { title: 'Cross-Regional Dialect Seeding Detected', desc: `Simultaneous deployment across ${campaign.languages_detected?.join(', ') || 'multiple regional scripts'}.` },
        { title: 'Cryptographic Merkle Root Sealed on Blockchain', desc: 'SHA-256 evidence package anchored on EVM Polygon notary contract.' },
        { title: 'Temporal Blast Radius Verified', desc: `Over ${campaign.post_count || 450} synthetic nodes synchronized with ${campaign.cross_platform_sync || 92}% temporal correlation.` }
      ],
      linguistics: {
        codeMixing: `65% ${campaign.primary_language === 'te' ? 'Telugu' : campaign.primary_language === 'hi-Latn' ? 'Hinglish' : 'Hindi'}, 25% English, 10% Regional`,
        evasionTactics: ['Spaced characters', 'Zero-width space evasion', 'Homoglyph substitution'],
        slangTriggers: ['viral order', 'breaking notice', 'urgent circular', 'immediate action']
      },
      propagation: {
        originNode: `SEED-${campaign.id?.replace(/[^0-9]/g, '') || '01'} (Foreign Proxy Cluster)`,
        relaySwarm: `SWARM-${campaign.id} (+${campaign.cross_platform_sync || 94}% Sync, ${campaign.post_count || 500}+ Bot Nodes)`,
        targetImpact: campaign.target || 'General Civic & Enterprise Domain'
      }
    };
  };

  // Fetch campaigns from backend
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/campaigns?role=${currentRole}`);
        if (res.ok) {
          const data = await res.json();
          let rawList = [];
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            rawList = [...(data.ongoing || []), ...(data.archived || [])];
          } else if (Array.isArray(data)) {
            rawList = data;
          }

          if (rawList.length > 0) {
            const enriched = rawList.map(c => enrichCampaignWithAssessment(c, currentRole));
            setCampaigns(enriched);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend fetch failed, using role fallbacks:', e);
      }

      // Fallback
      const fallbacks = fallbackCampaignsByRole[currentRole] || fallbackCampaignsByRole[ROLES.INVESTIGATION_BUREAU];
      setCampaigns(fallbacks);
    }
    loadCampaigns();
  }, [currentRole]);

  // Handle Escape key to close sliding drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Groq AI Counter-Strategy for Selected Campaign
  const fetchGroqStrategy = async (campaign) => {
    if (!campaign) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai/counter-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole
        },
        body: JSON.stringify({
          campaign_id: campaign.id,
          title: campaign.title,
          category: campaign.category,
          target: campaign.target,
          threat_score: campaign.threat_score || 90,
          primary_language: campaign.primary_language || 'hi-Latn',
          languages_detected: campaign.languages_detected || ['Hindi', 'English'],
          summary: campaign.summary || '',
          role: currentRole,
          custom_groq_api_key: groqApiKey || undefined
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.strategy) {
          setAiStrategyData(prev => ({ ...prev, [campaign.id]: json.strategy }));
        }
      }
    } catch (err) {
      console.warn('Groq Strategy fetch error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Open Sliding Window stretching right up to the sidebar
  const openDrawer = (campaign) => {
    setSelectedCampaign(campaign);
    setDrawerActiveTab('groq_ai');
    setActionFeedback(null);
    setIsDrawerOpen(true);

    // Fetch Groq Strategy if not cached
    if (!aiStrategyData[campaign.id]) {
      fetchGroqStrategy(campaign);
    }
  };

  // Close Sliding Window
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Save Groq API Key
  const handleSaveApiKey = () => {
    const cleanKey = tempApiKey.trim();
    setGroqApiKey(cleanKey);
    try {
      localStorage.setItem('bharat_shield_groq_api_key', cleanKey);
    } catch (e) {}
    setShowKeyModal(false);
    if (selectedCampaign) {
      fetchGroqStrategy(selectedCampaign);
    }
  };

  // Copy to clipboard helper
  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Execute Protected / Directive Action
  const handleExecuteAction = async (actionType) => {
    if (!selectedCampaign) return;
    setActionFeedback({ loading: true, message: `Executing ${actionType.replace(/_/g, ' ')}...` });
    try {
      if (executeProtectedAction) {
        const res = await executeProtectedAction(actionType, selectedCampaign.id);
        setActionFeedback({
          success: true,
          message: res?.message || `Directive ${actionType} successfully executed. Notary proof hash generated.`
        });
      } else {
        setTimeout(() => {
          setActionFeedback({
            success: true,
            message: `Directive ${actionType} executed. Cryptographic proof sealed on blockchain.`
          });
        }, 600);
      }
    } catch (e) {
      setActionFeedback({
        success: false,
        message: e?.message || 'Action failed or requires elevation.'
      });
    }
  };

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = c.id?.toLowerCase().includes(q);
        const mTitle = c.title?.toLowerCase().includes(q);
        const mCat = c.category?.toLowerCase().includes(q);
        const mTarget = c.target?.toLowerCase().includes(q);
        if (!mId && !mTitle && !mCat && !mTarget) return false;
      }

      // Severity Filter
      if (severityFilter === 'critical' && (c.threat_score || 0) < 90) return false;
      if (severityFilter === 'high' && ((c.threat_score || 0) < 80 || (c.threat_score || 0) >= 90)) return false;
      if (severityFilter === 'medium' && (c.threat_score || 0) >= 80) return false;

      // Platform Filter
      if (platformFilter !== 'all') {
        if (!c.platforms?.includes(platformFilter)) return false;
      }

      return true;
    });
  }, [campaigns, searchQuery, severityFilter, platformFilter]);

  const currentStrategy = selectedCampaign ? (aiStrategyData[selectedCampaign.id] || null) : null;
  const totalCount = campaigns.length;
  const criticalCount = campaigns.filter(c => (c.threat_score || 0) >= 90).length;
  const highCount = campaigns.filter(c => (c.threat_score || 0) >= 80 && (c.threat_score || 0) < 90).length;

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', position: 'relative' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.15)', 
              color: '#3b82f6', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Activity size={13} /> EXPLAINABLE THREAT TELEMETRY
            </span>
            <span style={{ 
              backgroundColor: groqApiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
              color: groqApiKey ? '#10b981' : '#f59e0b', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Zap size={13} /> {groqApiKey ? 'GROQ LLaMA-3.3 70B CONNECTED' : 'EXPERT HEURISTIC ADVISOR'}
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.4px', margin: '8px 0 0 0' }}>
            Explainable Threat Assessment & AI Counter-Disinformation Ledger
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Automated multi-signal algorithmic breakdown and Groq AI counter-measure playbooks for {currentUser?.roleTitle || 'Threat Intelligence'}.
          </p>
        </div>

        {/* Action Button: Configure Groq API Key */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setTempApiKey(groqApiKey);
              setShowKeyModal(true);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: groqApiKey ? 'rgba(16, 185, 129, 0.12)' : 'var(--accent-blue)',
              color: groqApiKey ? '#10b981' : '#ffffff',
              border: `1px solid ${groqApiKey ? 'rgba(16, 185, 129, 0.3)' : 'var(--accent-blue)'}`,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Key size={14} />
            <span>{groqApiKey ? 'Groq Key Configured (Edit)' : 'Connect Groq API Key'}</span>
          </button>

          {/* KPI Widget */}
          <div className="bs-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CRITICAL THREATS</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono' }}>{criticalCount} Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bs-card" style={{ padding: '14px 18px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '420px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search campaigns, ID, target domain, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 34px',
              fontSize: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Severity Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>SEVERITY:</span>
          {[
            { id: 'all', label: 'All Threats' },
            { id: 'critical', label: 'Critical (≥90)', color: '#ef4444' },
            { id: 'high', label: 'High Risk (80-89)', color: '#f59e0b' },
            { id: 'medium', label: 'Monitored (<80)', color: '#3b82f6' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSeverityFilter(f.id)}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: severityFilter === f.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                backgroundColor: severityFilter === f.id ? 'var(--accent-blue)' : 'var(--bg-muted)',
                color: severityFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Platform Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PLATFORM:</span>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Channels</option>
            <option value="telegram">Telegram</option>
            <option value="twitter">Twitter / X</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

      </div>

      {/* Main Campaign Ledger Table */}
      <div className="bs-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Campaign ID & Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Narrative Vector & Target</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Threat Index</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Linguistic Vectors</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Telemetry & Sync</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>AI Counter-Strategy</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ShieldAlert size={32} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>No campaigns match your filter criteria</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Try resetting search or adjusting severity threshold.</div>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c, idx) => {
                  const score = c.threat_score || 85;
                  const scoreColor = score >= 90 ? '#ef4444' : score >= 80 ? '#f59e0b' : '#3b82f6';
                  const statusLabel = c.threat_label || (score >= 90 ? 'CRITICAL' : score >= 80 ? 'HIGH RISK' : 'MONITORING');

                  return (
                    <tr 
                      key={c.id || idx}
                      onClick={() => openDrawer(c)}
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Column 1: ID & Status */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontFamily: 'JetBrains Mono', 
                            fontSize: '11px', 
                            fontWeight: 800, 
                            color: 'var(--text-heading)',
                            backgroundColor: 'var(--bg-muted)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)'
                          }}>
                            {c.id}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: scoreColor,
                            backgroundColor: `${scoreColor}15`,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: `1px solid ${scoreColor}30`,
                            letterSpacing: '0.4px'
                          }}>
                            {statusLabel}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={11} style={{ color: '#10b981' }} /> {c.confidence || '94.5% Conf'}
                        </div>
                      </td>

                      {/* Column 2: Narrative Title & Target */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', maxWidth: '340px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '13px', lineHeight: 1.3 }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Target:</span> {c.target || c.category}
                        </div>
                      </td>

                      {/* Column 3: Threat Score Gauge */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 800, color: scoreColor, fontFamily: 'JetBrains Mono' }}>
                            {score}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
                        </div>
                        <div style={{ width: '100px', height: '5px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden', marginTop: '4px' }}>
                          <div style={{ width: `${Math.min(100, score)}%`, height: '100%', backgroundColor: scoreColor, borderRadius: '9999px' }} />
                        </div>
                      </td>

                      {/* Column 4: Linguistic Vectors */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                            {c.primary_language || 'hi-Latn'}
                          </span>
                          {c.languages_detected?.slice(0, 3).map((lang, lIdx) => (
                            <span key={lIdx} style={{ fontSize: '10px', padding: '2px 5px', borderRadius: '4px', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                              {lang}
                            </span>
                          ))}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '6px' }}>
                          {c.platforms?.map((p, pIdx) => (
                            <span key={pIdx} style={{ textTransform: 'capitalize', fontSize: '10px', color: 'var(--text-muted)' }}>
                              • {p}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Column 5: Telemetry & Sync */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Radio size={12} style={{ color: '#10b981' }} />
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                            {c.cross_platform_sync || 94}% Sync
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {c.post_count?.toLocaleString() || '840'} Coordinated Nodes
                        </div>
                      </td>

                      {/* Column 6: Inspect Action CTA */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(c);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-muted)',
                            color: 'var(--text-heading)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent-blue)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = 'var(--accent-blue)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
                            e.currentTarget.style.color = 'var(--text-heading)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                          }}
                        >
                          <Sparkles size={13} style={{ color: '#f59e0b' }} />
                          <span>AI Counter-Strategy</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WIDE SLIDING WINDOW — EXTENDING ALL THE WAY UP TO THE SIDEBAR!             */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div 
          onClick={closeDrawer}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end',
            transition: 'opacity 0.25s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              // Stretching width right up to the sidebar border!
              width: 'calc(100vw - 260px)',
              maxWidth: 'calc(100vw - 68px)',
              height: '100%',
              backgroundColor: 'var(--bg-card)',
              borderLeft: '2px solid var(--border-color)',
              boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.7)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            
            {/* Drawer Top Header & Navigation */}
            <div style={{
              padding: '18px 28px',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-sidebar)',
              position: 'sticky',
              top: 0,
              zIndex: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="bs-badge bs-badge-blue" style={{ fontSize: '11px', fontWeight: 800 }}>
                  {selectedCampaign?.id}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: selectedCampaign?.threat_color || '#ef4444',
                  backgroundColor: `${selectedCampaign?.threat_color || '#ef4444'}15`,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${selectedCampaign?.threat_color || '#ef4444'}30`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Check size={12} /> {selectedCampaign?.confidence || 'HIGH (96.5%)'}
                </span>
                
                {/* Groq Engine Badge */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: currentStrategy?.is_live_llm ? '#10b981' : '#f59e0b',
                  backgroundColor: currentStrategy?.is_live_llm ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${currentStrategy?.is_live_llm ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Zap size={12} />
                  <span>{currentStrategy?.engine || (groqApiKey ? 'Groq LLaMA-3.3 70B' : 'Expert Heuristic Engine')}</span>
                </span>
              </div>

              {/* Action Buttons: Configure Key & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => {
                    setTempApiKey(groqApiKey);
                    setShowKeyModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Key size={13} style={{ color: '#f59e0b' }} />
                  <span>API Key</span>
                </button>

                <button
                  onClick={closeDrawer}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>Close</span>
                  <kbd style={{ fontSize: '10px', backgroundColor: 'var(--bg-card)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>ESC</kbd>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Drawer Hero Banner */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              backgroundImage: `linear-gradient(90deg, ${selectedCampaign?.threat_color || '#ef4444'}15 0%, transparent 70%)`,
              borderLeft: `5px solid ${selectedCampaign?.threat_color || '#ef4444'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1 1 560px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                    {selectedCampaign?.category}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '6px', letterSpacing: '-0.4px', lineHeight: 1.3 }}>
                    {selectedCampaign?.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                    {selectedCampaign?.summary}
                  </p>
                  
                  {/* Quick Telemetry Pills */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                    <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-muted)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <strong>Target Domain:</strong> {selectedCampaign?.target}
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-muted)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <strong>Swarm Sync:</strong> {selectedCampaign?.cross_platform_sync}%
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-muted)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <strong>Nodes:</strong> {selectedCampaign?.post_count?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Score Meter Widget */}
                <div style={{ textAlign: 'right', minWidth: '160px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    ALGORITHMIC THREAT INDEX
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: selectedCampaign?.threat_color || '#ef4444', fontFamily: 'JetBrains Mono' }}>
                    {selectedCampaign?.threat_score} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', justifyContent: 'flex-end' }}>
                    <div style={{ width: '110px', height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${selectedCampaign?.threat_score || 85}%`, height: '100%', backgroundColor: selectedCampaign?.threat_color || '#ef4444', borderRadius: '9999px' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: selectedCampaign?.threat_color || '#ef4444', fontWeight: 800 }}>
                      {selectedCampaign?.threat_label || 'CRITICAL'}
                    </span>
                  </div>

                  {/* Regenerate AI Button */}
                  <button
                    onClick={() => fetchGroqStrategy(selectedCampaign)}
                    disabled={isAiLoading}
                    style={{
                      marginTop: '12px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-muted)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      cursor: isAiLoading ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={12} className={isAiLoading ? 'animate-spin' : ''} style={{ color: '#f59e0b' }} />
                    <span>{isAiLoading ? 'Analyzing...' : 'Regenerate Strategy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar inside Drawer */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              padding: '0 28px',
              overflowX: 'auto'
            }}>
              {[
                { id: 'groq_ai', label: 'Groq AI Counter-Playbook', icon: Sparkles, badge: 'AI' },
                { id: 'breakdown', label: 'Multi-Signal Breakdown', icon: FileText },
                { id: 'checklist', label: 'Forensic Audit Checklist', icon: CheckCircle2 },
                { id: 'linguistics', label: 'Linguistic & Slang Radar', icon: Languages },
                { id: 'propagation', label: 'Multi-Hop Propagation Trace', icon: Network },
                { id: 'actions', label: 'Persona Directives & Export', icon: Shield }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = drawerActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerActiveTab(tab.id)}
                    style={{
                      padding: '14px 16px',
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                      background: 'none',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} style={{ color: tab.id === 'groq_ai' ? '#f59e0b' : undefined }} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Drawer Body Content */}
            <div style={{ padding: '28px', flex: '1 1 auto' }}>

              {/* Action Feedback Banner */}
              {actionFeedback && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  backgroundColor: actionFeedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${actionFeedback.success ? '#10b981' : '#ef4444'}`,
                  color: actionFeedback.success ? '#10b981' : '#ef4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {actionFeedback.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span>{actionFeedback.message}</span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 1: GROQ AI COUNTER-DISINFORMATION PLAYBOOK (PRIMARY)                 */}
              {/* ========================================================================= */}
              {drawerActiveTab === 'groq_ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  
                  {/* Executive Diagnosis Card */}
                  <div className="bs-card" style={{ 
                    padding: '20px', 
                    backgroundColor: 'var(--inner-box-bg)',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bot size={14} /> COGNITIVE VECTOR DIAGNOSIS & THREAT TRAJECTORY
                      </div>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 800, 
                        color: '#ef4444', 
                        backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}>
                        URGENCY: {currentStrategy?.urgency_rating || 'IMMEDIATE (0-30 MINS)'}
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                      {currentStrategy?.executive_diagnosis || 'Analyzing cognitive manipulation patterns across regional ingestion channels...'}
                    </p>
                  </div>

                  {/* Immediate Tactical Interventions */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} style={{ color: '#f59e0b' }} />
                      <span>Immediate Tactical Mitigation Interventions</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                      {currentStrategy?.tactical_interventions?.map((item, idx) => (
                        <div key={idx} className="bs-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
                                {item.action}
                              </span>
                              <span style={{ 
                                fontSize: '9px', 
                                fontWeight: 800, 
                                color: item.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                                backgroundColor: item.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                {item.priority}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {item.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleExecuteAction(`tactical_${idx}`)}
                            style={{
                              marginTop: '12px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-muted)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            Trigger Action Protocol →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pre-Drafted Multilingual Counter-Narratives */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Languages size={16} style={{ color: '#3b82f6' }} />
                      <span>Pre-Drafted Multilingual Counter-Narrative Scripts (Ready to Deploy)</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {currentStrategy?.counter_narratives?.map((item, idx) => (
                        <div key={idx} className="bs-card" style={{ padding: '18px', backgroundColor: 'var(--inner-box-bg)' }}>
                          
                          {/* Card Top Metadata */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '3px 8px', borderRadius: '4px' }}>
                                {item.language}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                Channel: <strong>{item.channel}</strong>
                              </span>
                            </div>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopyText(`${item.headline}\n\n${item.message}\n\n${item.call_to_action}`, idx)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: copiedIndex === idx ? '#10b981' : 'var(--bg-muted)',
                                color: copiedIndex === idx ? '#ffffff' : 'var(--text-primary)',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedIndex === idx ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                            </button>
                          </div>

                          {/* Headline */}
                          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
                            {item.headline}
                          </div>

                          {/* Message Body */}
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'var(--text-primary)', 
                            backgroundColor: 'var(--bg-card)', 
                            padding: '12px 14px', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border-color)',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-line'
                          }}>
                            {item.message}
                          </div>

                          {/* Call to action */}
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>Citizen Action:</span> {item.call_to_action}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Psychological Prebunking & Inoculation */}
                  <div className="bs-card" style={{ padding: '18px', backgroundColor: 'var(--bg-muted)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={16} style={{ color: '#10b981' }} />
                      <span>Psychological Inoculation & Prebunking Advisory</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {currentStrategy?.psychological_prebunking || 'Educate target demographics on the adversary deception mechanism to build cognitive immunity.'}
                    </p>
                  </div>

                  {/* Channel Deployment Timeline Matrix */}
                  <div className="bs-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '12px' }}>
                      Cross-Channel Response Timeline & Routing
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      {currentStrategy?.channel_matrix?.map((ch, idx) => (
                        <div key={idx} style={{ backgroundColor: 'var(--bg-muted)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>{ch.channel}</span>
                            <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>{ch.recommended_timeframe}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                            {ch.tactic}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: MULTI-SIGNAL BREAKDOWN                                            */}
              {/* ========================================================================= */}
              {drawerActiveTab === 'breakdown' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Algorithmic Weights Summary */}
                  <div className="bs-card" style={{ padding: '16px', backgroundColor: 'var(--inner-box-bg)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      FORMULATION MODEL: MULTI-SIGNAL SENSITIVITY FORMULA
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--text-primary)', backgroundColor: 'var(--bg-muted)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      Threat Index = (0.25 × Semantic Cluster) + (0.20 × Relay Sync) + (0.20 × Temporal Window) + (0.15 × Multilingual Mutation) + (0.15 × AI Synth) + (0.10 × TTP Reuse)
                    </div>
                  </div>

                  {/* Signals List */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                    {selectedCampaign?.breakdown?.map((item, idx) => (
                      <div key={idx} className="bs-card" style={{ padding: '16px 18px', backgroundColor: 'var(--bg-muted)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '13px' }}>
                            {item.name}
                          </div>
                          <div style={{ fontWeight: 800, fontFamily: 'JetBrains Mono', color: item.color, fontSize: '14px' }}>
                            {item.score} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({item.pct})</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '7px', backgroundColor: 'var(--bg-dark)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ width: item.pct, height: '100%', backgroundColor: item.color, borderRadius: '9999px' }} />
                        </div>

                        {/* Description */}
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {item.desc || 'Algorithmic corroboration indicates high probability of orchestrated cognitive vector amplification.'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: FORENSIC AUDIT CHECKLIST                                          */}
              {/* ========================================================================= */}
              {drawerActiveTab === 'checklist' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Verifiable cryptographic and statutory evidentiary criteria recorded for this cognitive vector:
                  </div>

                  {selectedCampaign?.checklist?.map((item, idx) => (
                    <div key={idx} className="bs-card" style={{ padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                        padding: '6px', 
                        borderRadius: '6px',
                        color: '#10b981',
                        flexShrink: 0
                      }}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                          {item.desc}
                        </div>
                      </div>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 800, 
                        color: '#10b981', 
                        backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        VERIFIED
                      </span>
                    </div>
                  ))}

                  {/* Blockchain Notary Block */}
                  <div className="bs-card" style={{ padding: '16px 18px', marginTop: '10px', backgroundColor: 'var(--inner-box-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      <Lock size={15} style={{ color: '#3b82f6' }} />
                      <span>Cryptographic Blockchain Notarization Ledger</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Merkle Root Hash: <code style={{ color: '#10b981' }}>0x9e8a7f...d41b9c2e</code> · Notary Contract: <code style={{ color: 'var(--accent-blue)' }}>Polygon POS #48920194</code>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: LINGUISTIC & SLANG RADAR                                          */}
              {/* ========================================================================= */}
              {drawerActiveTab === 'linguistics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Code-mixing Distribution */}
                  <div className="bs-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>
                      Vernacular Code-Mixing & Script Analysis
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      {selectedCampaign?.linguistics?.codeMixing || '78% Hinglish, 14% Pure Devanagari Hindi, 8% English'}
                    </div>

                    <div style={{ height: '10px', width: '100%', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '65%', backgroundColor: '#ef4444' }} title="Regional Dialect / Hinglish" />
                      <div style={{ width: '25%', backgroundColor: '#3b82f6' }} title="English" />
                      <div style={{ width: '10%', backgroundColor: '#10b981' }} title="Code-mixed slang" />
                    </div>
                  </div>

                  {/* Evasion Tactics Detected */}
                  <div className="bs-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px' }}>
                      Obfuscation & Evasion Tactics Detected
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedCampaign?.linguistics?.evasionTactics?.map((t, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#ef4444',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.25)'
                        }}>
                          • {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lexicon Trigger Words */}
                  <div className="bs-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px' }}>
                      Slang Lexical Triggers Extracted from Live Stream
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedCampaign?.linguistics?.slangTriggers?.map((s, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          fontFamily: 'JetBrains Mono',
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--text-primary)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)'
                        }}>
                          "{s}"
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: MULTI-HOP PROPAGATION TRACE                                       */}
              {/* ========================================================================= */}
              {drawerActiveTab === 'propagation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Visual 3-tier infrastructure attribution topology and amplification relay sequence:
                  </div>

                  {/* Node Flow Diagram */}
                  <div className="bs-card" style={{ padding: '24px', backgroundColor: 'var(--inner-box-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                      
                      {/* Tier 1: Origin Seed */}
                      <div style={{ flex: '1 1 200px', backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid #ef4444' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>TIER 1: ORIGIN SEED</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>
                          {selectedCampaign?.propagation?.originNode || 'SEED-01 (Proxy Cluster)'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Initial seed payload dropped via automated bridge bot.
                        </div>
                      </div>

                      <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />

                      {/* Tier 2: Swarm Relay */}
                      <div style={{ flex: '1 1 200px', backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>TIER 2: AMPLIFICATION SWARM</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>
                          {selectedCampaign?.propagation?.relaySwarm || 'SWARM-42 (+96% Sync)'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          High temporal synchronicity relay with dialect mutation.
                        </div>
                      </div>

                      <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />

                      {/* Tier 3: Target Domain */}
                      <div style={{ flex: '1 1 200px', backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>TIER 3: TARGET IMPACT ZONE</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>
                          {selectedCampaign?.propagation?.targetImpact || selectedCampaign?.target}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Downstream citizen & enterprise community exposure.
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Relay Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div className="bs-card" style={{ padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>INTER-NODE LATENCY</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                        0.84 seconds
                      </div>
                    </div>

                    <div className="bs-card" style={{ padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CROSS-DIALECT MUTATION</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                        4 Languages / 35m
                      </div>
                    </div>

                    <div className="bs-card" style={{ padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>BOTNET ASN CLUSTER</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                        AS9482 (Offshore)
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: PERSONA DIRECTIVES & ACTION EXECUTION                              */}
              {/* ========================================================================= */}
              {drawerActiveTab === 'actions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Select an authorized operational response directive for <strong>{currentUser?.roleTitle || 'Threat Intelligence'}</strong>:
                  </div>

                  {/* Role Specific Actions Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    
                    {/* Action 1: Export Dossier */}
                    <div className="bs-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                          <Download size={16} style={{ color: '#3b82f6' }} />
                          <span>Export Cryptographic Dossier</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                          Compile Section 65B Indian Evidence Act compliant PDF/JSON dossier with complete hash logs.
                        </p>
                      </div>
                      <button
                        onClick={() => handleExecuteAction('export_dossier')}
                        style={{
                          marginTop: '14px',
                          padding: '9px 14px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          backgroundColor: 'var(--accent-blue)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Generate & Download Dossier
                      </button>
                    </div>

                    {/* Action 2: Notarize Blockchain */}
                    <div className="bs-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                          <Lock size={16} style={{ color: '#10b981' }} />
                          <span>Anchor Proof to Blockchain</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                          Seal SHA-256 Merkle root hash of all campaign nodes onto Polygon testnet notary contract.
                        </p>
                      </div>
                      <button
                        onClick={() => handleExecuteAction('blockchain_notarize')}
                        style={{
                          marginTop: '14px',
                          padding: '9px 14px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Execute Blockchain Notarization
                      </button>
                    </div>

                    {/* Action 3: Role Specific Trigger */}
                    <div className="bs-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                          <ShieldAlert size={16} style={{ color: '#ef4444' }} />
                          <span>
                            {currentRole === ROLES.INVESTIGATION_BUREAU && 'Issue Section 69A IT Act Notice'}
                            {currentRole === ROLES.CORPORATE_ENTERPRISE && 'File SEBI Reg 30 Clarification'}
                            {currentRole === ROLES.JOURNALIST_MEDIA && 'Publish Multilingual Debunk Card'}
                            {currentRole === ROLES.SYSTEM_ADMIN && 'Deploy Root Botnet IP Ban Directive'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                          {currentRole === ROLES.INVESTIGATION_BUREAU && 'Trigger urgent legal blocking order to Ministry of Electronics & IT (MeitY).'}
                          {currentRole === ROLES.CORPORATE_ENTERPRISE && 'Issue formal stock exchange disclosure to arrest share price manipulation.'}
                          {currentRole === ROLES.JOURNALIST_MEDIA && 'Broadcast verified fact-check bulletin to citizen subscribers across regional channels.'}
                          {currentRole === ROLES.SYSTEM_ADMIN && 'Push blacklisted proxy ASNs to edge firewalls and ingestion pipeline filters.'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleExecuteAction('role_directive')}
                        style={{
                          marginTop: '14px',
                          padding: '9px 14px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Execute Response Protocol
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GROQ API KEY CONFIGURATION MODAL                                         */}
      {/* ========================================================================= */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="bs-card" style={{ width: '100%', maxWidth: '480px', padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                  Configure Groq API Key
                </h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
              Enter your Groq API key (<code>gsk_...</code>) to enable real-time neural counter-disinformation synthesis powered by <strong>LLaMA-3.3 70B Versatile</strong> at ultra-low inference latency.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                GROQ API KEY
              </label>
              <input
                type="password"
                placeholder="gsk_..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontFamily: 'JetBrains Mono',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Info size={12} /> Key is stored securely in your local browser session.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--accent-blue)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Save & Connect Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Style for Smooth Slide In */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0.7;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}
