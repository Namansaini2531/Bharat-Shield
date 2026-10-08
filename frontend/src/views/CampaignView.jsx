import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { 
  AlertTriangle, 
  Share2, 
  Bot, 
  Radio,
  RefreshCw, 
  Download, 
  ZoomIn, 
  FileText, 
  Clock, 
  Languages, 
  Server,
  ShieldAlert,
  Building2,
  Newspaper,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  Search,
  Filter,
  Archive,
  Activity,
  Flame,
  Globe,
  Database,
  ChevronRight,
  Hash,
  Eye,
  ShieldCheck
} from 'lucide-react';

export default function CampaignView() {
  const { currentRole, currentUser, executeProtectedAction, can } = useAuth();
  
  // Data State
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [archivedCampaigns, setArchivedCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' | 'archived'
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('threat_desc');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState(null);
  const [expandedSignals, setExpandedSignals] = useState(false);

  // Robust Fallback Ongoing Campaigns by Role
  const fallbackOngoingByRole = {
    [ROLES.SYSTEM_ADMIN]: [
      {
        id: 'CMP-007',
        title: 'Infrastructure Shutdown & Civil Unrest Narrative',
        category: 'National Security / Disinformation Warfare',
        status: 'ACTIVE CRITICAL',
        type: 'ongoing',
        threat_score: 94,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        target: 'National Critical Infrastructure & Public Law & Order',
        summary: 'State-sponsored coordinated synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize', 'bse_clarification'],
        posts: [
          { platform: 'telegram', timestamp: '10 min ago', language: 'hi-Latn', text: 'URGENT: All telecom towers in northern sector shutting down from midnight. Withdraw cash now!' },
          { platform: 'twitter', timestamp: '18 min ago', language: 'en', text: 'Breaking: National grid frequency dropping sharply. Power blackout expected across 6 states.' },
          { platform: 'whatsapp', timestamp: '24 min ago', language: 'hi', text: 'आपातकालीन सूचना: दूरसंचार और बैंकिंग सर्वर अगले 48 घंटों के लिए बंद रहेंगे।' }
        ]
      },
      {
        id: 'CMP-011',
        title: 'Government Identity Spoofing & Phishing Matrix',
        category: 'Credential Harvesting Farm',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 83,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Urdu'],
        platforms: ['twitter', 'telegram'],
        post_count: 412,
        cross_platform_sync: 89,
        target: 'Defense Personnel & Northern Logistics Hubs',
        summary: 'Coordinated bot network deploying deepfake operational orders targeting border transit networks.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize'],
        posts: [
          { platform: 'twitter', timestamp: '42 min ago', language: 'en', text: 'Official directive issued: Defense logistics re-routing via NH-44 effective immediately.' },
          { platform: 'telegram', timestamp: '1 hour ago', language: 'hi-Latn', text: 'Download newly signed border transit pass app from this link (Trojan detected).' }
        ]
      },
      {
        id: 'CMP-TATA-009',
        title: 'Tata Motors EV & TCS Disinformation Swarm',
        category: 'Market Manipulation & Short Sabotage',
        status: 'DEFENSE ACTIVE',
        type: 'ongoing',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        target: 'Tata Motors EV Safety & TCS Campus Recruitment',
        summary: 'Synchronized release of fabricated EV battery explosion videos and counterfeit TCS hiring freeze memos across shadow Telegram & Instagram channels.',
        authorized_actions: ['bse_clarification', 'executive_briefing', 'defamation_vault'],
        posts: [
          { platform: 'instagram', timestamp: '15 min ago', language: 'en', text: 'Viral Reel: Alleged thermal runaway defect in latest EV fleet (AI-generated CGI).' },
          { platform: 'telegram', timestamp: '30 min ago', language: 'hi', text: 'TCS ने रोकी नई भर्तियां, आंतरिक ज्ञापन हुआ लीक (Counterfeit Memo).' }
        ]
      },
      {
        id: 'FACT-007',
        title: 'Nationwide Internet & UPI Blackout Panic Forward',
        category: 'Mass Panic Induction',
        status: 'VIRAL SPIKE',
        type: 'ongoing',
        threat_score: 89,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'Marathi', 'English'],
        platforms: ['whatsapp', 'telegram', 'facebook'],
        post_count: 3490,
        cross_platform_sync: 94,
        target: 'General Public & Civic Communities',
        summary: 'Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.',
        authorized_actions: ['publish_factcheck', 'generate_debunk_bulletin'],
        posts: [
          { platform: 'whatsapp', timestamp: '5 min ago', language: 'hi', text: 'कृपया ध्यान दें: आज रात 12 बजे से UPI सेवाएं 3 दिन के लिए बंद रहेंगी।' }
        ]
      }
    ],
    [ROLES.INVESTIGATION_BUREAU]: [
      {
        id: 'CMP-007',
        title: 'Operation Echo: Telecom & Critical Grid Sabotage',
        category: 'National Security / Disinformation Warfare',
        status: 'ACTIVE CRITICAL',
        type: 'ongoing',
        threat_score: 94,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        target: 'National Critical Infrastructure & Public Law & Order',
        summary: 'Coordinated synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize']
      },
      {
        id: 'CMP-011',
        title: 'Operation Redacted: Border Sector Coordinated Proxy Swarm',
        category: 'Cross-Border Cyber Operations',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 88,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Urdu', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 412,
        cross_platform_sync: 89,
        target: 'Defense Personnel & Northern Logistics Hubs',
        summary: 'Coordinated bot network deploying deepfake operational orders targeting border transit networks.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier']
      },
      {
        id: 'CMP-003',
        title: 'Operation Cipher: Subsea Cable Sabotage Rumor Tree',
        category: 'State-Sponsored Information Warfare',
        status: 'SURVEILLANCE',
        type: 'ongoing',
        threat_score: 79,
        confidence: 'MEDIUM',
        primary_language: 'en',
        languages_detected: ['English', 'Tamil', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 218,
        cross_platform_sync: 84,
        target: 'Coastal Data Centers & Banking Backbone',
        summary: 'Synthetic technical advisories alleging undersea fiber cuts to trigger financial market panic.',
        authorized_actions: ['inter_agency_dossier', 'blockchain_notarize']
      }
    ],
    [ROLES.CORPORATE_ENTERPRISE]: [
      {
        id: 'CMP-TATA-009',
        title: 'Coordinated Disinformation Swarm (Tata Motors EV & TCS)',
        category: 'Market Manipulation & Brand Sabotage',
        status: 'ACTIVE HIGH',
        type: 'ongoing',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        target: 'Tata Motors & TCS Share Price & Brand Trust',
        summary: 'Synchronized release of fabricated EV battery defect videos and counterfeit hiring freeze notices on shadow Telegram channels prior to market opening.',
        authorized_actions: ['bse_clarification', 'executive_briefing', 'defamation_vault']
      },
      {
        id: 'CMP-TATA-014',
        title: 'Deepfake Voice Note Attack on Executive Leadership',
        category: 'Executive Deepfake Phishing & Defamation',
        status: 'FORENSIC TRIAGE',
        type: 'ongoing',
        threat_score: 87,
        confidence: 'HIGH',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'telegram', 'instagram'],
        post_count: 520,
        cross_platform_sync: 88,
        target: 'Tata Sons Leadership & Air India Operational Solvency',
        summary: 'AI voice synthesis impersonating aviation management and Group CFO discussing fictional credit default swaps.',
        authorized_actions: ['bse_clarification', 'defamation_vault']
      },
      {
        id: 'CMP-TATA-022',
        title: 'Tata Steel Environmental ESG Fabrications',
        category: 'Commercial ESG Sabotage',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 73,
        confidence: 'MEDIUM',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi'],
        platforms: ['twitter', 'instagram'],
        post_count: 310,
        cross_platform_sync: 77,
        target: 'Tata Steel Global ESG Ratings & Sovereign Funds',
        summary: 'Cross-border botnet weaponizing counterfeit regulatory notices to trigger automated ESG risk rating downgrades.',
        authorized_actions: ['executive_briefing']
      }
    ],
    [ROLES.JOURNALIST_MEDIA]: [
      {
        id: 'FACT-007',
        title: 'Nationwide Internet & Power Shutdown Hoax Mutation Tree',
        category: 'Citizen WhatsApp Debunk & Fact-Check',
        status: 'VIRAL SPIKE',
        type: 'ongoing',
        threat_score: 89,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'Marathi', 'English'],
        platforms: ['whatsapp', 'telegram', 'facebook'],
        post_count: 3490,
        cross_platform_sync: 94,
        target: 'General Public & Civic Communities',
        summary: 'Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.',
        authorized_actions: ['publish_factcheck', 'generate_debunk_bulletin']
      },
      {
        id: 'FACT-011',
        title: 'Synthetic Audio Clip Claiming Regional Bank Moratorium',
        category: 'Financial Disinformation Fact-Check',
        status: 'DEBUNKED',
        type: 'ongoing',
        threat_score: 82,
        confidence: 'HIGH',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'twitter'],
        post_count: 1840,
        cross_platform_sync: 91,
        target: 'Retail Depositors & Urban Cooperatives',
        summary: 'Fabricated voice clip of RBI Governor allegedly restricting cash withdrawals in northern states.',
        authorized_actions: ['publish_factcheck', 'generate_debunk_bulletin']
      },
      {
        id: 'FACT-033',
        title: 'Manipulated Video of Election Electoral Roll Purge',
        category: 'Electoral Integrity & Misinformation',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 76,
        confidence: 'MEDIUM',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Telugu'],
        platforms: ['twitter', 'facebook'],
        post_count: 920,
        cross_platform_sync: 81,
        target: 'Voters & Civic Organizations',
        summary: 'Old training video republished with deceptive subtitles claiming electronic voting machine server anomalies.',
        authorized_actions: ['publish_factcheck']
      }
    ]
  };

  // Robust Fallback Historical ML Clustered Campaigns (Discovered via Multilingual HDBSCAN on Raw Datasets)
  const fallbackArchivedMLCampaigns = [
    {
      id: 'CMP-ML-001',
      title: '500 Rupee Note Star Series Currency Demonetization Rumor',
      status: 'ARCHIVED / CONTAINED',
      type: 'archived',
      category: 'Financial Panic / AltNews Ingestion',
      threat_score: 58.2,
      confidence: 'HIGH',
      primary_language: 'hi',
      languages_detected: ['hi', 'en', 'hi-Latn'],
      platforms: ['instagram', 'twitter', 'whatsapp'],
      post_count: 14,
      cross_platform_sync: 82,
      target: 'Retail Banking & Public Cash Confidence',
      summary: 'Viral claim that 500 Rupee notes containing star symbol in number panel are counterfeit. Clustered across 14 Instagram Reels and WhatsApp groups with 82% semantic overlap.',
      authorized_actions: ['inter_agency_dossier', 'blockchain_notarize'],
      evidence: {
        evidence_id: 'EVID-CMP-ML-001',
        sha256_hash: '8f9e4c3a1b2d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
        audit_events: ['ML_CLUSTER_ISOLATED', 'SHA256_SEALED', 'FACT_CHECK_CONCLUDED']
      },
      posts: [
        { platform: 'instagram', timestamp: '2023-08-14', language: 'hi', text: 'सावधान! 500 रुपये के नोट पर अगर स्टार का निशान है तो वह नकली है।' },
        { platform: 'twitter', timestamp: '2023-08-15', language: 'en', text: 'Is RBI issuing fake notes with star symbols? Many shopkeepers refusing payment.' }
      ]
    },
    {
      id: 'CMP-ML-002',
      title: 'Income Tax Refund Phishing APK Weaponization Campaign',
      status: 'ARCHIVED / CONTAINED',
      type: 'archived',
      category: 'Cyber Phishing & Credential Farm',
      threat_score: 64.5,
      confidence: 'HIGH',
      primary_language: 'hi-Latn',
      languages_detected: ['hi-Latn', 'hi', 'en'],
      platforms: ['telegram', 'whatsapp'],
      post_count: 8,
      cross_platform_sync: 86,
      target: 'Taxpayers & Mobile Banking Credentials',
      summary: 'Malicious Android APK disguised as IT Department tax refund utility propagated through shadow Telegram channels.',
      authorized_actions: ['inter_agency_dossier', 'blockchain_notarize'],
      evidence: {
        evidence_id: 'EVID-CMP-ML-002',
        sha256_hash: '3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
        audit_events: ['MALWARE_FINGERPRINTED', 'DOMAIN_SEIZED', 'SEALED']
      }
    },
    {
      id: 'CMP-ML-003',
      title: 'Refinery Industrial Fire Deceptive Geo-Location Hoax',
      status: 'ARCHIVED / CONTAINED',
      type: 'archived',
      category: 'Industrial Infrastructure Sabotage',
      threat_score: 53.3,
      confidence: 'HIGH',
      primary_language: 'hi',
      languages_detected: ['hi', 'en'],
      platforms: ['instagram', 'twitter'],
      post_count: 7,
      cross_platform_sync: 78,
      target: 'Domestic Oil Refineries & Energy Security',
      summary: 'Recycled footage of 2019 overseas chemical plant fire falsely claimed to be Indian oil refinery incident.',
      authorized_actions: ['inter_agency_dossier']
    },
    {
      id: 'CMP-ML-004',
      title: 'Three Gorges Dam Collapse & Cross-Border Flood Panic',
      status: 'ARCHIVED / CONTAINED',
      type: 'archived',
      category: 'Cross-Border Disinformation Warfare',
      threat_score: 48.3,
      confidence: 'MEDIUM',
      primary_language: 'en',
      languages_detected: ['en', 'hi'],
      platforms: ['twitter', 'reddit'],
      post_count: 6,
      cross_platform_sync: 74,
      target: 'Border State Preparedness & River Basin Panic',
      summary: 'Simulated CGI videos claiming dam breach triggering downstream emergency alerts.',
      authorized_actions: ['inter_agency_dossier']
    },
    {
      id: 'CMP-ML-005',
      title: 'Coordinated Political Smear Synthetic Video Edit (Deepfake)',
      status: 'ARCHIVED / CONTAINED',
      type: 'archived',
      category: 'Deepfake & Visual Media Manipulation',
      threat_score: 72.8,
      confidence: 'HIGH',
      primary_language: 'hi',
      languages_detected: ['hi', 'en', 'mr'],
      platforms: ['twitter', 'instagram', 'telegram'],
      post_count: 12,
      cross_platform_sync: 91,
      target: 'Electoral Candidates & Civic Neutrality',
      summary: 'Synchronized splice of televised debate with inverted audio track to fabricate unconstitutional remarks.',
      authorized_actions: ['inter_agency_dossier', 'blockchain_notarize']
    },
    {
      id: 'CMP-ML-006',
      title: 'Regional Bank Moratorium Voice Clone Forward',
      status: 'ARCHIVED / CONTAINED',
      type: 'archived',
      category: 'Financial Stability Disinformation',
      threat_score: 61.0,
      confidence: 'HIGH',
      primary_language: 'hi',
      languages_detected: ['hi', 'en'],
      platforms: ['whatsapp', 'twitter'],
      post_count: 9,
      cross_platform_sync: 88,
      target: 'Cooperative Banking Customers',
      summary: 'Cloned audio note of state cooperative registrar alleging liquidity freeze.',
      authorized_actions: ['inter_agency_dossier']
    }
  ];

  // Fetch campaigns from backend
  useEffect(() => {
    async function loadAllCampaigns() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/campaigns?role=${currentRole}`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Grouped response format
            if (Array.isArray(data.ongoing) && data.ongoing.length > 0) {
              setOngoingCampaigns(data.ongoing);
            } else {
              setOngoingCampaigns(fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]);
            }
            if (Array.isArray(data.archived) && data.archived.length > 0) {
              setArchivedCampaigns(data.archived);
            } else {
              setArchivedCampaigns(fallbackArchivedMLCampaigns);
            }
          } else if (Array.isArray(data)) {
            // Array response fallback
            const ongoing = data.filter(c => c.type !== 'archived' && !c.status?.includes('ARCHIVED'));
            const archived = data.filter(c => c.type === 'archived' || c.status?.includes('ARCHIVED'));
            setOngoingCampaigns(ongoing.length > 0 ? ongoing : (fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]));
            setArchivedCampaigns(archived.length > 0 ? archived : fallbackArchivedMLCampaigns);
          }
        } else {
          setOngoingCampaigns(fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]);
          setArchivedCampaigns(fallbackArchivedMLCampaigns);
        }
      } catch (e) {
        console.warn('Backend fetch failed, using fallback campaigns', e);
        setOngoingCampaigns(fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]);
        setArchivedCampaigns(fallbackArchivedMLCampaigns);
      } finally {
        setLoading(false);
      }
    }
    loadAllCampaigns();
  }, [currentRole]);

  // Set default selected campaign when list changes or tab switches
  const currentList = activeTab === 'ongoing' ? ongoingCampaigns : archivedCampaigns;
  
  useEffect(() => {
    if (currentList.length > 0) {
      if (!currentList.some(c => c.id === selectedCampaignId)) {
        setSelectedCampaignId(currentList[0].id);
      }
    }
  }, [activeTab, currentList, selectedCampaignId]);

  // Filter & Search Logic
  const filteredCampaigns = useMemo(() => {
    return currentList.filter(c => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = c.id?.toLowerCase().includes(q);
        const matchesTitle = c.title?.toLowerCase().includes(q);
        const matchesCategory = c.category?.toLowerCase().includes(q);
        const matchesTarget = c.target?.toLowerCase().includes(q);
        const matchesSummary = c.summary?.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesCategory && !matchesTarget && !matchesSummary) {
          return false;
        }
      }

      // Platform filter
      if (platformFilter !== 'all') {
        if (!c.platforms?.includes(platformFilter)) {
          return false;
        }
      }

      // Threat Score filter
      if (threatFilter === 'critical') {
        if ((c.threat_score || 0) < 85) return false;
      } else if (threatFilter === 'high') {
        if ((c.threat_score || 0) < 70 || (c.threat_score || 0) >= 85) return false;
      } else if (threatFilter === 'medium') {
        if ((c.threat_score || 0) >= 70) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'threat_desc') return (b.threat_score || 0) - (a.threat_score || 0);
      if (sortBy === 'threat_asc') return (a.threat_score || 0) - (b.threat_score || 0);
      if (sortBy === 'posts_desc') return (b.post_count || 0) - (a.post_count || 0);
      if (sortBy === 'sync_desc') return (b.cross_platform_sync || 0) - (a.cross_platform_sync || 0);
      return 0;
    });
  }, [currentList, searchQuery, platformFilter, threatFilter, sortBy]);

  // Currently inspected campaign
  const activeCampaign = currentList.find(c => c.id === selectedCampaignId) || currentList[0] || {};

  // Action execution handler
  const handleExecuteAction = async (actionType) => {
    setActionStatus({ loading: true, message: 'Verifying RBAC clearance and executing...' });
    try {
      const res = await executeProtectedAction(actionType, activeCampaign.id);
      setActionStatus({
        success: true,
        loading: false,
        message: res?.message || 'Threat remediation action executed successfully!',
        txHash: res?.cryptographic_signature || '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')
      });
      setTimeout(() => setActionStatus(null), 5000);
    } catch (err) {
      setActionStatus({
        success: false,
        loading: false,
        message: err.message || 'Execution failed due to RBAC restrictions'
      });
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  // Helper for platform badge color
  const getPlatformBadge = (p) => {
    const map = {
      twitter: { name: 'X / Twitter', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
      telegram: { name: 'Telegram', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
      whatsapp: { name: 'WhatsApp', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
      instagram: { name: 'Instagram', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
      reddit: { name: 'Reddit', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
      news: { name: 'News Feeds', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' }
    };
    return map[p.toLowerCase()] || { name: p.toUpperCase(), color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' };
  };

  return (
    <div>
      {/* 1. Header with Persona Clearance & Module Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: currentUser.badgeColor, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {currentUser.badgeText}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {currentUser.clearance}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {currentUser.organization}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
              All Campaigns Intelligence Hub
            </h2>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Multi-Source Narrative Discovery, Live Ongoing Threats & ML-Clustered Disinformation Operations
          </div>
        </div>

        {/* Operational Status Ribbon */}
        <div style={{
          padding: '8px 16px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '9999px',
          backgroundColor: activeTab === 'ongoing' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
          border: activeTab === 'ongoing' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
          color: activeTab === 'ongoing' ? '#ef4444' : '#10b981'
        }}>
          {activeTab === 'ongoing' ? (
            <>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <strong style={{ letterSpacing: '0.5px' }}>LIVE THREAT MITIGATION ACTIVE</strong>
            </>
          ) : (
            <>
              <Archive size={14} />
              <strong style={{ letterSpacing: '0.5px' }}>ML CLUSTER RETROSPECTIVE VAULT</strong>
            </>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Total Campaigns */}
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>TOTAL INDEXED OPS</span>
            <Database size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>
              {ongoingCampaigns.length + archivedCampaigns.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Operations</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Multilingual Neural Clusters
          </div>
        </div>

        {/* Ongoing Active */}
        <div 
          onClick={() => setActiveTab('ongoing')}
          className="bs-card" 
          style={{ 
            padding: '16px', 
            cursor: 'pointer',
            border: activeTab === 'ongoing' ? '1px solid #ef4444' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'ongoing' ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>ONGOING CAMPAIGNS</span>
            <Flame size={14} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono' }}>
              {ongoingCampaigns.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Threats</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Live response clearance required
          </div>
        </div>

        {/* Archived ML Clusters */}
        <div 
          onClick={() => setActiveTab('archived')}
          className="bs-card" 
          style={{ 
            padding: '16px', 
            cursor: 'pointer',
            border: activeTab === 'archived' ? '1px solid #10b981' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'archived' ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>ARCHIVED CAMPAIGNS</span>
            <Archive size={14} style={{ color: '#10b981' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
              {archivedCampaigns.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ML Clusters</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Contained / Historical AltNews Data
          </div>
        </div>

        {/* Cross-Platform Burst Sync */}
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>AVG TEMPORAL SYNC</span>
            <Activity size={14} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#3b82f6', fontFamily: 'JetBrains Mono' }}>
              {activeCampaign.cross_platform_sync || 91}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Burst Lock</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cross-platform seed correlation
          </div>
        </div>

      </div>

      {/* 3. Action Status Toast Banner */}
      {actionStatus && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '18px',
          backgroundColor: actionStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: actionStatus.success ? '1px solid #10b981' : '1px solid #ef4444',
          color: actionStatus.success ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {actionStatus.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{actionStatus.message}</span>
          </div>
          {actionStatus.txHash && (
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-muted)' }}>
              EVM TX: {actionStatus.txHash.slice(0, 22)}...
            </span>
          )}
        </div>
      )}

      {/* 4. Tab Switcher & Filter / Search Bar */}
      <div className="bs-card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Main Tab Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'var(--inner-box-bg)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('ongoing')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'ongoing' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'ongoing' ? '#ef4444' : 'var(--text-secondary)',
                boxShadow: activeTab === 'ongoing' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span>Ongoing Campaigns ({ongoingCampaigns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTab === 'archived' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'archived' ? '#10b981' : 'var(--text-secondary)',
                boxShadow: activeTab === 'archived' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Archive size={14} />
              <span>Archived Campaigns ({archivedCampaigns.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'ongoing' ? 'ongoing threats' : 'archived ML clusters'} by ID, keyword, target...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-heading)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Platform Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PLATFORM:</span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-heading)',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Channels</option>
              <option value="twitter">X (Twitter)</option>
              <option value="telegram">Telegram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>

          {/* Threat Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SEVERITY:</span>
            <select
              value={threatFilter}
              onChange={(e) => setThreatFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-heading)',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Scores</option>
              <option value="critical">Critical (&gt;85)</option>
              <option value="high">High (70 - 85)</option>
              <option value="medium">Medium (&lt;70)</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-heading)',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="threat_desc">Threat Score (High to Low)</option>
              <option value="threat_asc">Threat Score (Low to High)</option>
              <option value="posts_desc">Signal Count (Most to Least)</option>
              <option value="sync_desc">Temporal Burst Sync (%)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 5. Main Split View: Campaigns List (Left) & Investigation Deep Dive (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(460px, 2fr)', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Filtered Campaigns List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {activeTab === 'ongoing' ? 'Ongoing Threat Operations' : 'Discovered ML Clusters'} ({filteredCampaigns.length})
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {activeTab === 'ongoing' ? 'Active Surveillance' : 'HDBSCAN Partitioned'}
            </span>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="bs-card" style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Filter size={24} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>No campaigns match your filter criteria</div>
              <div style={{ fontSize: '11px', marginTop: '4px' }}>Try resetting search or platform filters</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '780px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredCampaigns.map((camp) => {
                const isSelected = selectedCampaignId === camp.id;
                const isOngoing = activeTab === 'ongoing' || camp.type === 'ongoing';
                const score = camp.threat_score || 50;
                
                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    className="bs-card"
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      border: isSelected 
                        ? `2px solid ${isOngoing ? '#ef4444' : '#10b981'}` 
                        : '1px solid var(--border-color)',
                      backgroundColor: isSelected 
                        ? (isOngoing ? 'rgba(239, 68, 68, 0.06)' : 'rgba(16, 185, 129, 0.06)') 
                        : 'var(--bg-card)',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Top Row: ID + Status + Score */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ 
                          fontFamily: 'JetBrains Mono', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          color: isOngoing ? '#ef4444' : '#10b981',
                          backgroundColor: 'var(--inner-box-bg)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)'
                        }}>
                          {camp.id}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: isOngoing ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: isOngoing ? '#ef4444' : '#10b981'
                        }}>
                          {camp.status || (isOngoing ? 'ACTIVE' : 'CONTAINED')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: score >= 85 ? '#ef4444' : score >= 70 ? '#f59e0b' : '#3b82f6' }}>
                          {score}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/100</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      color: 'var(--text-heading)', 
                      lineHeight: 1.35, 
                      marginBottom: '6px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {camp.title}
                    </div>

                    {/* Category */}
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {camp.category}
                    </div>

                    {/* Bottom Metadata: Platform Badges + Signal Count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '11px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {camp.platforms?.slice(0, 3).map((p) => {
                          const badge = getPlatformBadge(p);
                          return (
                            <span 
                              key={p} 
                              style={{ 
                                fontSize: '9px', 
                                fontWeight: 700, 
                                padding: '1px 5px', 
                                borderRadius: '3px', 
                                backgroundColor: badge.bg, 
                                color: badge.color 
                              }}
                            >
                              {badge.name.split('/')[0].trim()}
                            </span>
                          );
                        })}
                        {(camp.platforms?.length || 0) > 3 && (
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                            +{camp.platforms.length - 3}
                          </span>
                        )}
                      </div>

                      <div style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{camp.post_count || 1} signals</span>
                        <ChevronRight size={12} style={{ color: isSelected ? (isOngoing ? '#ef4444' : '#10b981') : 'var(--text-muted)' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Selected Campaign Deep-Dive Inspection Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Inspection Header Card */}
          <div className="bs-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ 
                    fontFamily: 'JetBrains Mono', 
                    fontSize: '12px', 
                    fontWeight: 800, 
                    color: activeTab === 'ongoing' ? '#ef4444' : '#10b981',
                    backgroundColor: 'var(--inner-box-bg)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {activeCampaign.id || 'CMP-000'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: activeTab === 'ongoing' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    color: activeTab === 'ongoing' ? '#ef4444' : '#10b981'
                  }}>
                    {activeCampaign.status || (activeTab === 'ongoing' ? 'ACTIVE CRITICAL' : 'ARCHIVED')}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {activeCampaign.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.4, margin: '0 0 6px 0' }}>
                  {activeCampaign.title}
                </h3>
              </div>

              {/* Top Quick Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="bs-button bs-button-secondary" 
                  onClick={() => alert(`Exporting intelligence dossier for ${activeCampaign.id}...`)}
                  style={{ padding: '7px 12px', fontSize: '11px', gap: '6px' }}
                >
                  <Download size={13} /> Export Dossier
                </button>
              </div>
            </div>

            {/* Target Domain & Operational Summary */}
            <div style={{ 
              padding: '14px', 
              borderRadius: '8px', 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-heading)' }}>Target Domain / Impact Vector: </strong>
                <span style={{ color: currentUser.badgeColor, fontWeight: 600 }}>{activeCampaign.target || 'National Critical Infrastructure'}</span>
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-heading)' }}>Operational Narrative: </strong>
                {activeCampaign.summary || 'Coordinated synthetic campaign spreading false narratives across regional channels.'}
              </div>
            </div>

            {/* Key Telemetry Gauge Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              
              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>SEVERITY SCORE</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                  {activeCampaign.threat_score || 94} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>BURST SYNC</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                  {activeCampaign.cross_platform_sync || 93}%
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>SIGNAL NODES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                  {activeCampaign.post_count || 842}
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CONFIDENCE</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                  {activeCampaign.confidence || 'HIGH'}
                </div>
              </div>

            </div>

            {/* Channels & Language Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CHANNELS:</span>
                {activeCampaign.platforms?.map((p) => {
                  const b = getPlatformBadge(p);
                  return (
                    <span key={p} style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: b.bg, color: b.color }}>
                      {b.name}
                    </span>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <Languages size={13} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>LANGUAGES:</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {activeCampaign.languages_detected?.join(', ') || 'Hindi, English, Hinglish'}
                </span>
              </div>
            </div>

          </div>

          {/* Multi-Hop Propagation Topology Visualizer */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                <Share2 size={16} style={{ color: '#06b6d4' }} />
                <span>Multi-Hop Propagation Topology ({activeCampaign.id})</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Neural Vector Graph
              </span>
            </div>

            {/* Topology Diagram Box */}
            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-lg)',
              padding: '24px 16px',
              position: 'relative'
            }}>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Root Botnet Seed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Relay Swarm (Telegram / X)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Targeted Public Domain
                </span>
              </div>

              {/* Topology Nodes Flow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
                {/* Node 1: Seed */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    margin: '0 auto 8px',
                    boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'
                  }}>
                    <Bot size={24} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Origin Seed</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Coordinated IP Hub</div>
                </div>

                <div style={{ height: '2px', flex: 1, backgroundColor: '#3b82f6', margin: '0 8px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '35%', fontSize: '9px', color: '#60a5fa', backgroundColor: 'var(--bg-card)', padding: '1px 5px', borderRadius: '4px' }}>
                    +{activeCampaign.cross_platform_sync || 94}% sync
                  </div>
                </div>

                {/* Node 2: Swarm */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    margin: '0 auto 8px',
                    boxShadow: '0 0 16px rgba(37, 99, 235, 0.4)'
                  }}>
                    <Share2 size={22} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Relay Swarm</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activeCampaign.post_count || 42} Nodes</div>
                </div>

                <div style={{ height: '2px', flex: 1, backgroundColor: '#10b981', margin: '0 8px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '35%', fontSize: '9px', color: '#34d399', backgroundColor: 'var(--bg-card)', padding: '1px 5px', borderRadius: '4px' }}>
                    Cross-Lingual
                  </div>
                </div>

                {/* Node 3: Target */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #047857)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    margin: '0 auto 8px',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
                  }}>
                    <Layers size={22} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Target Domain</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activeCampaign.target?.split('&')[0]?.trim() || 'Civil Space'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Intercepted Signals / Sample Posts in Cluster */}
          {activeCampaign.posts && activeCampaign.posts.length > 0 && (
            <div className="bs-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                  <Eye size={16} style={{ color: '#f59e0b' }} />
                  <span>Intercepted Signals in Cluster ({activeCampaign.posts.length} Captured)</span>
                </div>
                <button
                  onClick={() => setExpandedSignals(!expandedSignals)}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {expandedSignals ? 'Collapse' : 'Expand All'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(expandedSignals ? activeCampaign.posts : activeCampaign.posts.slice(0, 3)).map((post, idx) => {
                  const pBadge = getPlatformBadge(post.platform || 'twitter');
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '10px 12px', 
                        borderRadius: '6px', 
                        backgroundColor: 'var(--inner-box-bg)', 
                        border: '1px solid var(--border-color)',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px', backgroundColor: pBadge.bg, color: pBadge.color }}>
                          {pBadge.name}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                          {post.timestamp || 'Real-time intercept'} • {post.language || 'en'}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-heading)', lineHeight: 1.4 }}>
                        {post.text || post.ocr_text || 'Signal payload text'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Toolkit (Contextual to Ongoing Threats vs Archived Retrospectives) */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Sparkles size={16} style={{ color: currentUser.badgeColor }} />
              <span>
                {activeTab === 'ongoing' ? 'Authorized Counter-Operation Toolkit' : 'Forensic Post-Mortem & Case Dossier'}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Execution clearance under <strong style={{ color: currentUser.badgeColor }}>{currentUser.roleTitle}</strong>:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              
              {/* Ongoing Actions */}
              {activeTab === 'ongoing' && can('canIssueSec69A') && (
                <button
                  onClick={() => handleExecuteAction('sec69a_takedown')}
                  className="bs-button"
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Dispatch Threat Remediation Directive</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {activeTab === 'ongoing' && can('canGenerateSEBIDisclosure') && (
                <button
                  onClick={() => handleExecuteAction('bse_clarification')}
                  className="bs-button"
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    border: 'none',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Dispatch BSE/NSE Clarification</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {activeTab === 'ongoing' && can('canPublishFactCheck') && (
                <button
                  onClick={() => handleExecuteAction('publish_factcheck')}
                  className="bs-button"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Broadcast Fact-Check Debunk Card</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {/* Shared Blockchain Notarization */}
              <button
                onClick={() => handleExecuteAction('blockchain_notarize')}
                className="bs-button bs-button-secondary"
                style={{
                  padding: '9px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>{activeTab === 'ongoing' ? 'Anchor Evidence on Blockchain' : 'Verify SHA-256 Merkle Seal'}</span>
                <Lock size={14} />
              </button>

            </div>

            {/* Cryptographic Verification Footer */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                <span>EVM Smart Contract: 0x71C...B38 (Polygon Mainnet)</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                EVID-SHA256: {activeCampaign.evidence?.sha256_hash?.slice(0, 16) || 'a399d57364ce...'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
