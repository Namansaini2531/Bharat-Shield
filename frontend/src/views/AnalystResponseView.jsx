import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  UserPlus, 
  Flag, 
  Eye, 
  ChevronRight, 
  FileText, 
  Lock, 
  Building2, 
  Newspaper, 
  ShieldCheck, 
  Send,
  AlertTriangle,
  FileCheck2,
  Share2,
  Fingerprint,
  RefreshCw,
  Clock,
  Key,
  Copy,
  Sparkles,
  Bot,
  Sliders,
  X,
  Search,
  Check,
  Zap,
  Radio,
  Download,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Layers,
  Scale
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function AnalystResponseView({ onNavigate }) {
  const { currentRole, currentUser, executeProtectedAction, recordAuditLog } = useAuth();

  // Ledger of campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeLedgerHistory, setActiveLedgerHistory] = useState([]);
  
  // Drawer / Sliding Window state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('groq_ai'); // 'groq_ai' | 'ledger' | 'sop' | 'actions'

  // Groq API Key & AI State
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
  const [aiStrategyMap, setAiStrategyMap] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFeedback, setActionFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Role SOP steps
  const [checkedSteps, setCheckedSteps] = useState([true, true, true, true, false, false]);

  const toggleStep = (index) => {
    const updated = [...checkedSteps];
    updated[index] = !updated[index];
    setCheckedSteps(updated);
  };

  // Fallback Campaign Library per Role
  const fallbackCampaignsByRole = {
    [ROLES.INVESTIGATION_BUREAU]: [
      {
        id: 'CMP-007',
        title: 'Operation Echo: Telecom & Critical Grid Sabotage',
        category: 'National Security / Disinformation Warfare',
        status: 'ACTIVE CRITICAL',
        threat_score: 94,
        threat_color: '#ef4444',
        target: 'National Critical Infrastructure & Public Law & Order',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        summary: 'State-sponsored synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize']
      },
      {
        id: 'CMP-029',
        title: 'Operation Petro-Panic: Refinery Blast & Fuel Rationing Disinformation',
        category: 'Critical Infrastructure / Energy Disinformation',
        status: 'ACTIVE CRITICAL',
        threat_score: 91,
        threat_color: '#ef4444',
        target: 'National Oil Refineries & Public Fuel Supplies',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp', 'instagram'],
        post_count: 1420,
        cross_platform_sync: 94,
        summary: 'Coordinated disinformation network recirculating out-of-context industrial fire footage with fabricated claims of nationwide refinery sabotage and emergency fuel rationing.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize']
      },
      {
        id: 'CMP-001',
        title: 'Operation Currency Shock: Fabricated ₹500 Demonetization Circular',
        category: 'Financial Disinformation & Economic Warfare',
        status: 'VIRAL SPIKE',
        threat_score: 93,
        threat_color: '#ef4444',
        target: 'Banking Backbone & Retail Cash Depositors',
        primary_language: 'te',
        languages_detected: ['Telugu', 'Hindi', 'Tamil', 'English'],
        platforms: ['whatsapp', 'twitter', 'telegram'],
        post_count: 2840,
        cross_platform_sync: 96,
        summary: 'Synthetic circular bearing counterfeit Ministry of Finance watermarks alleging immediate invalidation of ₹500 currency notes.',
        authorized_actions: ['publish_factcheck', 'sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize']
      },
      {
        id: 'CMP-015',
        title: 'Operation Sovereign Cloud: Defense Recruitment Phishing & Portal Spoofing',
        category: 'State-Sponsored Cyber Espionage',
        status: 'MONITORING',
        threat_score: 85,
        threat_color: '#f59e0b',
        target: 'Defense Aspirants & Armed Forces Logistics Portals',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Urdu'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 640,
        cross_platform_sync: 88,
        summary: 'Coordinated social engineering swarm distributing counterfeit MoD recruitment circulars embedded with malicious credential-harvesting APK links.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize']
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
        target: 'Tata Motors EV Market Share & TCS Brand Equity',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        summary: 'Synchronized release of fabricated EV battery defect videos and counterfeit hiring freeze circulars on shadow Telegram channels prior to market opening.',
        authorized_actions: ['bse_clarification', 'executive_briefing', 'defamation_vault', 'blockchain_notarize']
      },
      {
        id: 'CMP-TATA-014',
        title: 'Deepfake Voice Note on Executive Leadership & Solvency',
        category: 'Executive Impersonation & Financial Defamation',
        status: 'FORENSIC TRIAGE',
        threat_score: 87,
        threat_color: '#f59e0b',
        target: 'Group CFO & Aviation Subsidiary Solvency',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'telegram'],
        post_count: 520,
        cross_platform_sync: 88,
        summary: 'AI voice synthesis impersonating aviation management and Group CFO discussing fictional credit default swaps.',
        authorized_actions: ['bse_clarification', 'defamation_vault', 'blockchain_notarize']
      },
      {
        id: 'CMP-TATA-022',
        title: 'Tata Steel Environmental ESG Fabrications',
        category: 'Commercial ESG Sabotage',
        status: 'MONITORING',
        threat_score: 73,
        threat_color: '#3b82f6',
        target: 'Tata Steel Global ESG Ratings & Sovereign Funds',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi'],
        platforms: ['twitter', 'instagram'],
        post_count: 310,
        cross_platform_sync: 77,
        summary: 'Cross-border botnet weaponizing counterfeit regulatory notices to trigger automated ESG risk rating downgrades.',
        authorized_actions: ['bse_clarification', 'executive_briefing']
      }
    ],
    [ROLES.JOURNALIST_MEDIA]: [
      {
        id: 'FACT-007',
        title: 'Nationwide Telecom & Power Blackout Hoax Mutation Tree',
        category: 'Citizen WhatsApp Debunk & Fact-Check',
        status: 'VIRAL SPIKE',
        threat_score: 89,
        threat_color: '#3b82f6',
        target: 'Citizen Social Communities & Residential Groups',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'Marathi', 'English'],
        platforms: ['whatsapp', 'telegram', 'facebook'],
        post_count: 3490,
        cross_platform_sync: 94,
        summary: 'Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.',
        authorized_actions: ['publish_factcheck', 'generate_debunk_bulletin']
      },
      {
        id: 'FACT-011',
        title: 'Synthetic Audio Clip Claiming Regional Bank Moratorium',
        category: 'Financial Disinformation Fact-Check',
        status: 'DEBUNKED',
        threat_score: 82,
        threat_color: '#10b981',
        target: 'Retail Depositors & Urban Cooperatives',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'twitter'],
        post_count: 1840,
        cross_platform_sync: 91,
        summary: 'Fabricated voice clip of RBI Governor allegedly restricting cash withdrawals in northern states.',
        authorized_actions: ['publish_factcheck', 'generate_debunk_bulletin']
      }
    ],
    [ROLES.SYSTEM_ADMIN]: [
      {
        id: 'CMP-007',
        title: 'Infrastructure Shutdown & Civil Unrest Narrative',
        category: 'National Security / Disinformation Warfare',
        status: 'ACTIVE CRITICAL',
        threat_score: 94,
        threat_color: '#ef4444',
        target: 'National Critical Infrastructure & Public Law & Order',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        summary: 'State-sponsored coordinated synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.',
        authorized_actions: ['sec69a_takedown', 'inter_agency_dossier', 'blockchain_notarize', 'bse_clarification']
      },
      {
        id: 'CMP-TATA-009',
        title: 'Tata Motors EV & TCS Disinformation Swarm',
        category: 'Market Manipulation & Short Sabotage',
        status: 'DEFENSE ACTIVE',
        threat_score: 91,
        threat_color: '#f59e0b',
        target: 'Tata Motors & TCS Share Price & Brand Trust',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        summary: 'Synchronized release of fabricated EV defect claims and counterfeit campus hiring freeze circulars on shadow Telegram channels.',
        authorized_actions: ['bse_clarification', 'executive_briefing', 'defamation_vault']
      },
      {
        id: 'FACT-007',
        title: 'Nationwide Internet & UPI Blackout Panic Forward',
        category: 'Mass Panic Induction',
        status: 'DEBUNK ISSUED',
        threat_score: 89,
        threat_color: '#3b82f6',
        target: 'General Public & Civic Communities',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'Marathi', 'English'],
        platforms: ['whatsapp', 'telegram', 'facebook'],
        post_count: 3490,
        cross_platform_sync: 94,
        summary: 'Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.',
        authorized_actions: ['publish_factcheck', 'generate_debunk_bulletin']
      }
    ]
  };

  // Load campaigns from backend or role fallback
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/campaigns?role=${currentRole}`);
        if (res.ok) {
          const data = await res.json();
          let list = [];
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            list = [...(data.ongoing || []), ...(data.archived || [])];
          } else if (Array.isArray(data)) {
            list = data;
          }

          if (list.length > 0) {
            setCampaigns(list);
            if (!selectedCampaign) {
              setSelectedCampaign(list[0]);
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Campaign fetch error, using fallbacks:', e);
      }

      const fallbacks = fallbackCampaignsByRole[currentRole] || fallbackCampaignsByRole[ROLES.INVESTIGATION_BUREAU];
      setCampaigns(fallbacks);
      if (!selectedCampaign) {
        setSelectedCampaign(fallbacks[0]);
      }
    }
    loadData();
  }, [currentRole]);

  // Load Campaign Ledger History for selected campaign
  const fetchCampaignLedger = async (campaignId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/ledger`);
      if (res.ok) {
        const data = await res.json();
        setActiveLedgerHistory(data.ledger || []);
      }
    } catch (e) {
      console.warn('Ledger fetch error:', e);
    }
  };

  // Fetch Groq AI Counter-Strategy & Damage Reduction
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
          setAiStrategyMap(prev => ({ ...prev, [campaign.id]: json.strategy }));
        }
      }
    } catch (err) {
      console.warn('Groq Strategy fetch error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Open Sliding Window extending up to the sidebar
  const openSlidingWindow = (campaign, tab = 'groq_ai') => {
    setSelectedCampaign(campaign);
    setDrawerTab(tab);
    setActionFeedback(null);
    setIsDrawerOpen(true);
    fetchCampaignLedger(campaign.id);

    if (!aiStrategyMap[campaign.id]) {
      fetchGroqStrategy(campaign);
    }
  };

  const closeSlidingWindow = () => {
    setIsDrawerOpen(false);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setShowKeyModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Copy helper
  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Execute Action and log directly to Campaign Ledger
  const handleExecuteAction = async (actionType, actionName, damageReductionEffect) => {
    if (!selectedCampaign) return;
    setIsProcessing(true);
    setActionFeedback(null);

    try {
      const payload = {
        action_type: actionType,
        action_name: actionName || actionType.replace(/_/g, ' ').toUpperCase(),
        campaign_id: selectedCampaign.id,
        damage_reduction_effect: damageReductionEffect || `Executed ${actionType} to mitigate campaign reach.`,
        analyst: currentUser.name,
        role: currentUser.roleTitle
      };

      const res = await executeProtectedAction(actionType, selectedCampaign.id, payload);

      setActionFeedback({
        success: true,
        message: res.message || `Operation '${actionType}' executed and sealed into campaign ledger with EVM signature.`,
        txHash: res.cryptographic_signature || res.tx_hash
      });

      // Refresh campaign ledger history
      fetchCampaignLedger(selectedCampaign.id);

      if (recordAuditLog) {
        recordAuditLog(actionType.toUpperCase(), selectedCampaign.id, {
          status: 'EXECUTED',
          tx: res.cryptographic_signature
        });
      }
    } catch (err) {
      setActionFeedback({
        success: false,
        message: `⚠️ Access Denied / Error: ${err.message || 'Operation failed'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = c.id?.toLowerCase().includes(q);
        const mTitle = c.title?.toLowerCase().includes(q);
        const mCat = c.category?.toLowerCase().includes(q);
        const mTarget = c.target?.toLowerCase().includes(q);
        if (!mId && !mTitle && !mCat && !mTarget) return false;
      }

      if (statusFilter === 'critical' && (c.threat_score || 0) < 90) return false;
      if (statusFilter === 'high' && ((c.threat_score || 0) < 80 || (c.threat_score || 0) >= 90)) return false;
      if (statusFilter === 'monitoring' && (c.threat_score || 0) >= 80) return false;

      return true;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const activeStrategy = selectedCampaign ? aiStrategyMap[selectedCampaign.id] : null;

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontFamily: 'JetBrains Mono', 
              color: currentUser.badgeColor, 
              padding: '3px 10px', 
              backgroundColor: 'var(--bg-muted)', 
              border: `1px solid ${currentUser.badgeColor}40`, 
              borderRadius: '9999px', 
              fontWeight: 700 
            }}>
              {currentUser.badgeText}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Threat Response Studio & Campaign Ledger
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '6px', letterSpacing: '-0.5px' }}>
            Campaign Damage Reduction & Threat Response
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time Groq AI counter-disinformation strategic advisor, damage containment playbooks, and immutable campaign ledgers.
          </p>
        </div>

        {/* Groq API Key Status & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setTempApiKey(groqApiKey);
              setShowKeyModal(true);
            }}
            className="bs-button bs-button-secondary"
            style={{
              padding: '9px 15px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderColor: groqApiKey ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
              backgroundColor: groqApiKey ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-card)'
            }}
          >
            <Key size={14} style={{ color: groqApiKey ? '#10b981' : 'var(--text-secondary)' }} />
            <span>{groqApiKey ? `Groq API Active (${groqApiKey.slice(0, 7)}...)` : 'Set Groq API Key'}</span>
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('enterprise');
            }}
            className="bs-button bs-button-secondary"
            style={{ padding: '9px 15px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Building2 size={14} style={{ color: '#f59e0b' }} />
            <span>Enterprise Scope</span>
          </button>
        </div>
      </div>

      {/* Campaign Search & Filter Controls */}
      <div className="bs-card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaign ledger by ID, keyword, target entity, or narrative..."
            className="bs-input"
            style={{ width: '100%', border: 'none', background: 'transparent', padding: '4px 0', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Severity:</span>
          {['all', 'critical', 'high', 'monitoring'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setStatusFilter(lvl)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: statusFilter === lvl ? '#3b82f6' : 'var(--border-color)',
                backgroundColor: statusFilter === lvl ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-muted)',
                color: statusFilter === lvl ? '#3b82f6' : 'var(--text-secondary)',
                fontWeight: statusFilter === lvl ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Campaign Ledger Table */}
      <div className="bs-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Operational Campaign Ledger ({filteredCampaigns.length} Tracked Operations)
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Click any campaign to launch the <strong>Groq AI Damage Reduction Sliding Panel</strong>
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Campaign ID</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Operation Narrative & Target</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Threat Score</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Blast Radius</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Platforms</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Damage Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((camp) => {
                const isCrit = (camp.threat_score || 0) >= 90;
                const isHigh = (camp.threat_score || 0) >= 80 && !isCrit;
                const threatColor = isCrit ? '#ef4444' : isHigh ? '#f59e0b' : '#3b82f6';
                const isSelected = selectedCampaign?.id === camp.id;

                return (
                  <tr
                    key={camp.id}
                    onClick={() => openSlidingWindow(camp, 'groq_ai')}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    className="hover-row"
                  >
                    <td style={{ padding: '14px 18px', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--text-heading)' }}>
                      #{camp.id}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '3px' }}>
                        {camp.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        Target: <span style={{ color: 'var(--text-secondary)' }}>{camp.target}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono',
                        fontWeight: 700,
                        backgroundColor: `${threatColor}15`,
                        color: threatColor,
                        border: `1px solid ${threatColor}30`
                      }}>
                        ● {camp.threat_score}/100
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                      {camp.post_count || 480} nodes ({camp.cross_platform_sync || 92}% sync)
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(camp.platforms || ['twitter', 'telegram']).map((pl) => (
                          <span key={pl} style={{ fontSize: '10px', backgroundColor: 'var(--bg-muted)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                            {pl}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'JetBrains Mono'
                      }}>
                        {camp.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSlidingWindow(camp, 'groq_ai');
                        }}
                        className="bs-button bs-button-primary"
                        style={{ padding: '6px 12px', fontSize: '11px', gap: '6px' }}
                      >
                        <Sparkles size={12} />
                        <span>Groq Advisor</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDING WINDOW DRAWER EXTENDING UP TO SIDEBAR */}
      {isDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={closeSlidingWindow}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '860px',
              backgroundColor: 'var(--bg-card)',
              height: '100%',
              borderLeft: '1px solid var(--border-color)',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--inner-box-bg)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    #{selectedCampaign?.id}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Threat Score: <strong style={{ color: selectedCampaign?.threat_score >= 85 ? '#ef4444' : '#f59e0b' }}>{selectedCampaign?.threat_score}/100</strong>
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', margin: '4px 0 0 0' }}>
                  {selectedCampaign?.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => fetchGroqStrategy(selectedCampaign)}
                  disabled={isAiLoading}
                  className="bs-button bs-button-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px', gap: '6px' }}
                >
                  <RefreshCw size={12} className={isAiLoading ? 'animate-spin' : ''} />
                  <span>Refresh AI Advice</span>
                </button>

                <button
                  onClick={closeSlidingWindow}
                  style={{
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Drawer Tabs Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              {[
                { id: 'groq_ai', label: 'Groq Damage Reduction Advisor', icon: Sparkles },
                { id: 'ledger', label: 'Campaign Action Ledger', icon: BookOpen },
                { id: 'sop', label: 'Role Standard Operating Procedure', icon: CheckCircle2 },
                { id: 'actions', label: 'Statutory Execution Matrix', icon: ShieldAlert }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = drawerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerTab(tab.id)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--inner-box-bg)' : 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div style={{
                padding: '12px 20px',
                backgroundColor: actionFeedback.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderBottom: actionFeedback.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '12px',
                color: actionFeedback.success ? '#10b981' : '#ef4444',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} />
                  <span>{actionFeedback.message}</span>
                </div>
                {actionFeedback.txHash && (
                  <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                    Tx: {actionFeedback.txHash.slice(0, 16)}...
                  </span>
                )}
              </div>
            )}

            {/* Drawer Body Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* TAB 1: GROQ AI DAMAGE REDUCTION ADVISOR */}
              {drawerTab === 'groq_ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Engine & Key Telemetry Badge */}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bot size={16} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                        Inference Engine: <strong>{activeStrategy?.engine || (groqApiKey ? 'Groq LLaMA-3.3-70B' : 'Sentinel Expert Heuristic')}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activeStrategy?.api_key_masked && (
                        <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                          {activeStrategy.api_key_masked}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setTempApiKey(groqApiKey);
                          setShowKeyModal(true);
                        }}
                        style={{ fontSize: '11px', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {groqApiKey ? 'Update Key' : 'Enter Groq Key'}
                      </button>
                    </div>
                  </div>

                  {isAiLoading ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <RefreshCw size={28} className="animate-spin" style={{ color: '#3b82f6', margin: '0 auto 12px auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                        Generating Real-Time Damage Minimization Plan...
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        Synthesizing cognitive vulnerability diagnostics, multilingual debunks, and statutory orders via Groq LLaMA-3.3-70B.
                      </div>
                    </div>
                  ) : activeStrategy ? (
                    <>
                      {/* Executive Diagnosis & Damage Impact */}
                      <div style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderLeft: '4px solid #ef4444'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ef4444', letterSpacing: '0.5px' }}>
                            CRITICAL DAMAGE DIAGNOSIS & URGENCY: {activeStrategy.urgency_rating || 'IMMEDIATE (0-30 MINS)'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-heading)', lineHeight: 1.5, fontWeight: 500 }}>
                          {activeStrategy.executive_diagnosis}
                        </div>
                        {activeStrategy.damage_reduction_impact && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '12px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingDown size={14} />
                            <span>Damage Reduction Projection: {activeStrategy.damage_reduction_impact}</span>
                          </div>
                        )}
                      </div>

                      {/* 3-Stage Damage Containment Roadmap */}
                      {activeStrategy.damage_containment_roadmap && activeStrategy.damage_containment_roadmap.length > 0 && (
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={15} style={{ color: '#3b82f6' }} />
                            <span>3-Stage Damage Containment Roadmap</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                            {activeStrategy.damage_containment_roadmap.map((stage, idx) => (
                              <div key={idx} style={{
                                backgroundColor: 'var(--inner-box-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '12px 14px'
                              }}>
                                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#3b82f6', fontWeight: 700, marginBottom: '4px' }}>
                                  {stage.phase}
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                                  {stage.milestone}
                                </div>
                                <div style={{ fontSize: '11px', color: '#10b981' }}>
                                  ✓ {stage.expected_damage_containment}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prioritized Tactical Interventions */}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldAlert size={15} style={{ color: '#f59e0b' }} />
                          <span>Tactical Damage Mitigation Interventions</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {(activeStrategy.tactical_interventions || []).map((act, idx) => (
                            <div key={idx} style={{
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              padding: '14px 16px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '14px'
                            }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                                    {act.action}
                                  </span>
                                  <span style={{
                                    fontSize: '9px',
                                    fontFamily: 'JetBrains Mono',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: act.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                    color: act.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                                    fontWeight: 700
                                  }}>
                                    {act.priority || 'HIGH'}
                                  </span>
                                  {act.timeframe && (
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                      ⏱ {act.timeframe}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                  {act.description}
                                </div>
                              </div>

                              <button
                                onClick={() => handleExecuteAction(
                                  act.action.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30),
                                  act.action,
                                  act.description
                                )}
                                disabled={isProcessing}
                                className="bs-button bs-button-primary"
                                style={{ padding: '7px 14px', fontSize: '11px', whiteSpace: 'nowrap', gap: '6px' }}
                              >
                                <span>Execute & Seal</span>
                                <ChevronRight size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Multilingual Counter-Narratives */}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Share2 size={15} style={{ color: '#10b981' }} />
                          <span>Multilingual Counter-Narrative Broadcast Cards</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {(activeStrategy.counter_narratives || []).map((cn, idx) => (
                            <div key={idx} style={{
                              backgroundColor: 'var(--inner-box-bg)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              padding: '16px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6' }}>
                                    {cn.language}
                                  </span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                    Channel: {cn.channel}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleCopyText(`${cn.headline}\n\n${cn.message}\n\n${cn.call_to_action}`, idx)}
                                  className="bs-button bs-button-secondary"
                                  style={{ padding: '4px 10px', fontSize: '11px', gap: '4px' }}
                                >
                                  {copiedIndex === idx ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                                  <span>{copiedIndex === idx ? 'Copied' : 'Copy Draft'}</span>
                                </button>
                              </div>

                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
                                {cn.headline}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line', marginBottom: '8px' }}>
                                {cn.message}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                💡 Citizen Advisory: {cn.call_to_action}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Psychological Prebunking & Statutory Legal Citations */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
                            🧠 Cognitive Prebunking Tactic
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {activeStrategy.psychological_prebunking}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
                            ⚖️ Statutory Legal Directives
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {(activeStrategy.statutory_legal_actions || []).map((leg, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{leg}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </>
                  ) : null}

                </div>
              )}

              {/* TAB 2: CAMPAIGN ACTION LEDGER */}
              {drawerTab === 'ledger' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                        Immutable Response Ledger for Campaign #{selectedCampaign?.id}
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                        Chronological audit trail of counter-measures sealed with EVM Smart Contract hashes.
                      </p>
                    </div>

                    <button
                      onClick={() => fetchCampaignLedger(selectedCampaign?.id)}
                      className="bs-button bs-button-secondary"
                      style={{ padding: '6px 10px', fontSize: '11px', gap: '4px' }}
                    >
                      <RefreshCw size={12} />
                      <span>Refresh Ledger</span>
                    </button>
                  </div>

                  {activeLedgerHistory.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--inner-box-bg)', borderRadius: '8px' }}>
                      <BookOpen size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 8px auto' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>No response actions recorded yet</div>
                      <div style={{ fontSize: '11px', marginTop: '4px' }}>
                        Execute actions in the Groq AI Advisor or Execution Matrix to write immutable entries to this ledger.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeLedgerHistory.map((item, idx) => (
                        <div key={idx} style={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderLeft: '4px solid #10b981',
                          borderRadius: '8px',
                          padding: '14px 16px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                                {item.action_name || item.event_type || item.action_type}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                by {item.executor || item.analyst_id}
                              </span>
                            </div>
                            <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                              {item.status || 'SEALED_ON_EVM'}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>
                            {item.damage_reduction_effect || item.details}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                            <span>Tx: {item.tx_hash || '0x7a29e4d1f88c3a90...'}</span>
                            <span>{item.timestamp || item.recorded_at}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ROLE SOP & OPERATIONAL CHECKLIST */}
              {drawerTab === 'sop' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                    Standard Operating Procedure (SOP) Checklist
                  </div>
                  {[
                    { num: 1, text: "Verify threat indicators with CERT-In & Sovereign Cyber Grid", subtitle: "Correlate IP address nodes with known adversary botnet infrastructure." },
                    { num: 2, text: "Monitor cross-border botnet burst propagation in real-time", subtitle: "Cluster 36 coordinated proxy networks operating across Telegram, X, and WhatsApp." },
                    { num: 3, text: "Analyze linguistic mutation tree across regional scripts", subtitle: "Detect systematic dialect shifts designed to induce public panic." },
                    { num: 4, text: "Verify cryptographic SHA-256 seal on evidence repository", subtitle: "Ensure evidence chain integrity for judicial submission and compliance orders." },
                    { num: 5, text: "Dispatch Inter-Agency Counter-Measure Directive", subtitle: "Transmit urgent containment notice to intermediary compliance officers." },
                    { num: 6, text: "Maintain active surveillance & inter-agency briefing", subtitle: "Ongoing monitoring until threat network is fully neutralized." }
                  ].map((step, idx) => {
                    const isChecked = checkedSteps[idx];
                    return (
                      <div
                        key={step.num}
                        onClick={() => toggleStep(idx)}
                        style={{
                          backgroundColor: isChecked ? 'rgba(59, 130, 246, 0.04)' : 'var(--inner-box-bg)',
                          border: isChecked ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isChecked ? '#3b82f6' : 'var(--bg-card)',
                            color: isChecked ? '#fff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {step.num}
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: isChecked ? 'var(--text-heading)' : 'var(--text-secondary)' }}>
                              {step.text}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {step.subtitle}
                            </div>
                          </div>
                        </div>
                        <div style={{ color: isChecked ? '#3b82f6' : 'var(--text-muted)' }}>
                          {isChecked ? <CheckCircle2 size={16} /> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: STATUTORY EXECUTION MATRIX */}
              {drawerTab === 'actions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                    Authorized Counter-Measures & Directives
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={() => handleExecuteAction('sec69a_takedown', 'Section 69A IT Act Emergency Blocking Order', 'Emergency takedown directive transmitted to platform compliance officers.')}
                      disabled={isProcessing}
                      className="bs-button bs-button-danger"
                      style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={15} />
                        <span>Issue Section 69A IT Act Emergency Takedown</span>
                      </span>
                      <ChevronRight size={15} />
                    </button>

                    <button
                      onClick={() => handleExecuteAction('bse_clarification', 'SEBI LODR Regulation 30 Clarification', 'Published emergency corporate clarification disclosure on BSE and NSE.')}
                      disabled={isProcessing}
                      className="bs-button bs-button-primary"
                      style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Share2 size={15} />
                        <span>Dispatch BSE / NSE LODR Clarification Disclosure</span>
                      </span>
                      <ChevronRight size={15} />
                    </button>

                    <button
                      onClick={() => handleExecuteAction('blockchain_notarize', 'Polygon EVM Evidence Notarization', 'Merkle root SHA-256 evidence sealed on EVM smart contract.')}
                      disabled={isProcessing}
                      className="bs-button bs-button-secondary"
                      style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={15} />
                        <span>Seal SHA-256 Merkle Evidence on EVM Polygon</span>
                      </span>
                      <ChevronRight size={15} />
                    </button>

                    <button
                      onClick={() => handleExecuteAction('publish_factcheck', 'IFCN Certified Press Fact-Check Bulletin', 'Multilingual fact-check card published across media desks.')}
                      disabled={isProcessing}
                      className="bs-button bs-button-secondary"
                      style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Newspaper size={15} />
                        <span>Publish IFCN Certified Press Fact-Check Card</span>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* API Key Configuration Modal */}
      {showKeyModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowKeyModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  Configure Groq API Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
              Enter your personal or enterprise Groq API Key to enable ultra-low latency LLaMA-3.3-70B damage minimization inference.
            </p>

            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="gsk_..."
              className="bs-input"
              style={{ width: '100%', fontSize: '13px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              {groqApiKey && (
                <button
                  onClick={() => {
                    setGroqApiKey('');
                    try { localStorage.removeItem('bharat_shield_groq_api_key'); } catch (e) {}
                    setShowKeyModal(false);
                    if (selectedCampaign) fetchGroqStrategy(selectedCampaign);
                  }}
                  className="bs-button bs-button-danger"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  Clear Key
                </button>
              )}

              <button
                onClick={handleSaveApiKey}
                className="bs-button bs-button-primary"
                style={{ flex: 1, padding: '8px 14px', fontSize: '12px' }}
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
