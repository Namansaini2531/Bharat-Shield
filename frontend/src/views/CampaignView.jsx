import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { 
  AlertTriangle, 
  Share2, 
  Bot, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Layers, 
  Search, 
  Archive, 
  Flame, 
  ChevronRight,
  Eye,
  Languages,
  X,
  ExternalLink,
  ShieldAlert,
  Radio,
  Clock
} from 'lucide-react';

export default function CampaignView() {
  const { currentRole, currentUser, executeProtectedAction, can } = useAuth();
  
  // Data State
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [archivedCampaigns, setArchivedCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' | 'archived'
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  
  // UI State
  const [actionStatus, setActionStatus] = useState(null);

  // Fallback Ongoing Campaigns by Role
  const fallbackOngoingByRole = {
    [ROLES.SYSTEM_ADMIN]: [
      {
        id: 'CMP-007',
        title: 'Infrastructure Shutdown & Civil Unrest Narrative',
        category: 'National Security / Disinformation',
        status: 'ACTIVE CRITICAL',
        type: 'ongoing',
        threat_score: 94,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        target: 'Critical Infrastructure & Public Order',
        summary: 'State-sponsored synthetic campaign spreading claims of nationwide communication blackout to induce civic panic.',
        posts: [
          { platform: 'telegram', timestamp: '10m ago', text: 'URGENT: All telecom towers in northern sector shutting down at midnight.' },
          { platform: 'twitter', timestamp: '18m ago', text: 'National grid frequency dropping sharply. Power blackout expected across 6 states.' },
          { platform: 'whatsapp', timestamp: '24m ago', text: 'आपातकालीन सूचना: दूरसंचार और बैंकिंग सर्वर अगले 48 घंटों के लिए बंद रहेंगे।' }
        ]
      },
      {
        id: 'CMP-011',
        title: 'Government Identity Spoofing & Phishing Matrix',
        category: 'Credential Harvesting',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 83,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Urdu'],
        platforms: ['twitter', 'telegram'],
        post_count: 412,
        cross_platform_sync: 89,
        target: 'Defense Logistics & Transit Hubs',
        summary: 'Bot network deploying counterfeit operational transit advisories targeting border supply networks.',
        posts: [
          { platform: 'twitter', timestamp: '42m ago', text: 'Official directive issued: Defense logistics re-routing via NH-44.' }
        ]
      },
      {
        id: 'CMP-029',
        title: 'Operation Petro-Panic: Refinery Blast & Fuel Rationing Disinformation',
        category: 'Critical Infrastructure / Energy Disinformation',
        status: 'ACTIVE CRITICAL',
        type: 'ongoing',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp', 'instagram'],
        post_count: 1420,
        cross_platform_sync: 94,
        target: 'National Oil Refineries & Public Fuel Supplies',
        summary: 'Coordinated disinformation network recirculating out-of-context industrial fire footage with fabricated claims of nationwide refinery sabotage and emergency fuel rationing.',
        posts: [
          { platform: 'telegram', timestamp: '12m ago', text: 'ALERT: Northern oil pipeline compromised. Fuel supplies halted for 72 hours across 5 states.' },
          { platform: 'twitter', timestamp: '20m ago', text: 'Refinery blast video going viral. Citizens rushing to gas stations in Delhi-NCR.' },
          { platform: 'whatsapp', timestamp: '35m ago', text: 'आपातकालीन संदेश: सभी पेट्रोल पंप आज रात 10 बजे से बंद हो रहे हैं। तुरंत पेट्रोल भरवा लें।' }
        ]
      },
      {
        id: 'CMP-001',
        title: 'Operation Currency Shock: Fabricated ₹500 Demonetization Circular',
        category: 'Financial Disinformation & Economic Warfare',
        status: 'VIRAL SPIKE',
        type: 'ongoing',
        threat_score: 93,
        confidence: 'HIGH',
        primary_language: 'te',
        languages_detected: ['Telugu', 'Hindi', 'Tamil', 'English'],
        platforms: ['whatsapp', 'twitter', 'telegram'],
        post_count: 2840,
        cross_platform_sync: 96,
        target: 'Banking Backbone & Retail Cash Depositors',
        summary: 'Synthetic circular bearing counterfeit Ministry of Finance watermarks alleging immediate invalidation of ₹500 currency notes to incite ATM rushes and digital banking bottlenecks.',
        posts: [
          { platform: 'whatsapp', timestamp: '8m ago', text: '₹500 నోట్ల రద్దు అంటూ సర్క్యులేట్ అవుతున్న నోటీస్ - వెంటనే ఏటీఎం నుంచి డబ్బులు తీసుకోండి!' },
          { platform: 'twitter', timestamp: '25m ago', text: 'Breaking: MoF reportedly phasing out ₹500 notes starting midnight. High queue at bank ATMs.' },
          { platform: 'telegram', timestamp: '40m ago', text: 'Download official gazette PDF copy: Demonetization order 2026.' }
        ]
      },
      {
        id: 'CMP-015',
        title: 'Operation Sovereign Cloud: Defense Recruitment Phishing & Portal Spoofing',
        category: 'State-Sponsored Cyber Espionage',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 85,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Urdu'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 640,
        cross_platform_sync: 88,
        target: 'Defense Aspirants & Armed Forces Logistics Portals',
        summary: 'Coordinated social engineering swarm distributing counterfeit MoD recruitment circulars embedded with malicious credential-harvesting APK links.',
        posts: [
          { platform: 'telegram', timestamp: '15m ago', text: 'Direct MoD recruitment portal open for 10,000 logistics staff. Apply via instant APK download.' },
          { platform: 'instagram', timestamp: '30m ago', text: 'Viral Reel: Ministry of Defence urgent recruitment notification link in bio.' }
        ]
      },
      {
        id: 'CMP-TATA-009',
        title: 'Tata Motors EV & TCS Disinformation Swarm',
        category: 'Market Manipulation',
        status: 'DEFENSE ACTIVE',
        type: 'ongoing',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        target: 'Tata Motors EV Safety & TCS Recruitment',
        summary: 'Synchronized release of fabricated EV battery defect videos and counterfeit hiring freeze circulars.',
        posts: [
          { platform: 'instagram', timestamp: '15m ago', text: 'Viral Reel: Fabricated EV battery thermal defect footage.' }
        ]
      }
    ],
    [ROLES.INVESTIGATION_BUREAU]: [
      {
        id: 'CMP-007',
        title: 'Telecom & Critical Grid Sabotage Narrative',
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
        target: 'Critical Infrastructure & Law & Order',
        summary: 'Synthetic campaign claiming imminent nationwide communications blackout to provoke panic withdrawals.',
        posts: [
          { platform: 'telegram', timestamp: '10m ago', text: 'URGENT: Northern sector telecom blackout scheduled tonight.' }
        ]
      },
      {
        id: 'CMP-011',
        title: 'Border Sector Coordinated Proxy Swarm',
        category: 'Cyber Intelligence Ops',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 88,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Urdu', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 412,
        cross_platform_sync: 89,
        target: 'Northern Logistics & Security Forces',
        summary: 'Automated cluster broadcasting fabricated operational directives across border district channels.',
        posts: [
          { platform: 'twitter', timestamp: '35m ago', text: 'False deployment orders circulating on regional channels.' }
        ]
      },
      {
        id: 'CMP-003',
        title: 'Subsea Cable Sabotage Rumor Tree',
        category: 'State-Sponsored Warfare',
        status: 'TRIAGED',
        type: 'ongoing',
        threat_score: 79,
        confidence: 'MEDIUM',
        primary_language: 'en',
        languages_detected: ['English', 'Tamil', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 218,
        cross_platform_sync: 84,
        target: 'Coastal Data Centers & Banking Backbone',
        summary: 'Synthetic technical advisories alleging undersea fiber cuts to trigger financial market panic.'
      },
      {
        id: 'CMP-029',
        title: 'Operation Petro-Panic: Refinery Blast & Fuel Rationing Disinformation',
        category: 'Critical Infrastructure / Energy Disinformation',
        status: 'ACTIVE CRITICAL',
        type: 'ongoing',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp', 'instagram'],
        post_count: 1420,
        cross_platform_sync: 94,
        target: 'National Oil Refineries & Public Fuel Supplies',
        summary: 'Coordinated disinformation network recirculating out-of-context industrial fire footage with fabricated claims of nationwide refinery sabotage and emergency fuel rationing.',
        posts: [
          { platform: 'telegram', timestamp: '12m ago', text: 'ALERT: Northern oil pipeline compromised. Fuel supplies halted for 72 hours across 5 states.' },
          { platform: 'twitter', timestamp: '20m ago', text: 'Refinery blast video going viral. Citizens rushing to gas stations in Delhi-NCR.' },
          { platform: 'whatsapp', timestamp: '35m ago', text: 'आपातकालीन संदेश: सभी पेट्रोल पंप आज रात 10 बजे से बंद हो रहे हैं। तुरंत पेट्रोल भरवा लें।' }
        ]
      },
      {
        id: 'CMP-001',
        title: 'Operation Currency Shock: Fabricated ₹500 Demonetization Circular',
        category: 'Financial Disinformation & Economic Warfare',
        status: 'VIRAL SPIKE',
        type: 'ongoing',
        threat_score: 93,
        confidence: 'HIGH',
        primary_language: 'te',
        languages_detected: ['Telugu', 'Hindi', 'Tamil', 'English'],
        platforms: ['whatsapp', 'twitter', 'telegram'],
        post_count: 2840,
        cross_platform_sync: 96,
        target: 'Banking Backbone & Retail Cash Depositors',
        summary: 'Synthetic circular bearing counterfeit Ministry of Finance watermarks alleging immediate invalidation of ₹500 currency notes to incite ATM rushes and digital banking bottlenecks.',
        posts: [
          { platform: 'whatsapp', timestamp: '8m ago', text: '₹500 నోట్ల రద్దు అంటూ సర్క్యులేట్ అవుతున్న నోటీస్ - వెంటనే ఏటీఎం నుంచి డబ్బులు తీసుకోండి!' },
          { platform: 'twitter', timestamp: '25m ago', text: 'Breaking: MoF reportedly phasing out ₹500 notes starting midnight. High queue at bank ATMs.' },
          { platform: 'telegram', timestamp: '40m ago', text: 'Download official gazette PDF copy: Demonetization order 2026.' }
        ]
      },
      {
        id: 'CMP-015',
        title: 'Operation Sovereign Cloud: Defense Recruitment Phishing & Portal Spoofing',
        category: 'State-Sponsored Cyber Espionage',
        status: 'MONITORING',
        type: 'ongoing',
        threat_score: 85,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Urdu'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 640,
        cross_platform_sync: 88,
        target: 'Defense Aspirants & Armed Forces Logistics Portals',
        summary: 'Coordinated social engineering swarm distributing counterfeit MoD recruitment circulars embedded with malicious credential-harvesting APK links.',
        posts: [
          { platform: 'telegram', timestamp: '15m ago', text: 'Direct MoD recruitment portal open for 10,000 logistics staff. Apply via instant APK download.' },
          { platform: 'instagram', timestamp: '30m ago', text: 'Viral Reel: Ministry of Defence urgent recruitment notification link in bio.' }
        ]
      }
    ],
    [ROLES.CORPORATE_ENTERPRISE]: [
      {
        id: 'CMP-TATA-009',
        title: 'Tata Motors EV & TCS Disinformation Swarm',
        category: 'Market & Brand Sabotage',
        status: 'ACTIVE HIGH',
        type: 'ongoing',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Hindi', 'Marathi'],
        platforms: ['twitter', 'telegram', 'instagram'],
        post_count: 1280,
        cross_platform_sync: 93,
        target: 'Tata Motors EV & TCS Share Value',
        summary: 'Fabricated EV fire video clips coordinated with fake campus hiring freeze circulars.',
        posts: [
          { platform: 'instagram', timestamp: '15m ago', text: 'Counterfeit video showing synthetic EV battery smoke.' }
        ]
      },
      {
        id: 'CMP-TATA-014',
        title: 'Deepfake Voice Note on Executive Leadership',
        category: 'Executive Phishing & Defamation',
        status: 'FORENSIC TRIAGE',
        type: 'ongoing',
        threat_score: 87,
        confidence: 'HIGH',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'telegram'],
        post_count: 520,
        cross_platform_sync: 88,
        target: 'Group CFO & Aviation Solvency',
        summary: 'AI voice synthesis impersonating Group CFO discussing fictional credit rating downgrades.',
        posts: [
          { platform: 'whatsapp', timestamp: '40m ago', text: 'Cloned audio note alleging liquidity constraints.' }
        ]
      }
    ],
    [ROLES.JOURNALIST_MEDIA]: [
      {
        id: 'FACT-007',
        title: 'Nationwide Internet & Power Shutdown Forward',
        category: 'Citizen Debunk & Fact-Check',
        status: 'VIRAL SPIKE',
        type: 'ongoing',
        threat_score: 89,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'English'],
        platforms: ['whatsapp', 'telegram'],
        post_count: 3490,
        cross_platform_sync: 94,
        target: 'Public Social Communities',
        summary: 'Viral WhatsApp forward falsely citing government gazette order to incite ATM cash hoarding.',
        posts: [
          { platform: 'whatsapp', timestamp: '5m ago', text: 'Fake DoT circular warning of 3-day internet blackout.' }
        ]
      },
      {
        id: 'FACT-011',
        title: 'Synthetic Audio of RBI Governor Moratorium',
        category: 'Financial Fact-Check',
        status: 'DEBUNKED',
        type: 'ongoing',
        threat_score: 82,
        confidence: 'HIGH',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'twitter'],
        post_count: 1840,
        cross_platform_sync: 91,
        target: 'Retail Depositors',
        summary: 'Cloned voice note claiming regional cooperative bank deposit freeze.',
        posts: [
          { platform: 'whatsapp', timestamp: '1h ago', text: 'Cloned voice clip claiming bank branch closure.' }
        ]
      }
    ]
  };

  // Fetch campaigns from backend
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/campaigns?role=${currentRole}`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            if (Array.isArray(data.ongoing) && data.ongoing.length > 0) {
              setOngoingCampaigns(data.ongoing);
            } else {
              setOngoingCampaigns(fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]);
            }
            if (Array.isArray(data.archived) && data.archived.length > 0) {
              setArchivedCampaigns(data.archived);
            }
          } else if (Array.isArray(data)) {
            const ongoing = data.filter(c => c.type !== 'archived' && !c.status?.includes('ARCHIVED'));
            const archived = data.filter(c => c.type === 'archived' || c.status?.includes('ARCHIVED'));
            setOngoingCampaigns(ongoing.length > 0 ? ongoing : (fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]));
            setArchivedCampaigns(archived);
          }
        } else {
          setOngoingCampaigns(fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]);
        }
      } catch (e) {
        setOngoingCampaigns(fallbackOngoingByRole[currentRole] || fallbackOngoingByRole[ROLES.INVESTIGATION_BUREAU]);
      }
    }
    loadCampaigns();
  }, [currentRole]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine current active list
  const currentList = activeTab === 'ongoing' ? ongoingCampaigns : archivedCampaigns;

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return currentList.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = c.id?.toLowerCase().includes(q);
        const mTitle = c.title?.toLowerCase().includes(q);
        const mCat = c.category?.toLowerCase().includes(q);
        const mTarget = c.target?.toLowerCase().includes(q);
        if (!mId && !mTitle && !mCat && !mTarget) return false;
      }
      if (platformFilter !== 'all') {
        if (!c.platforms?.includes(platformFilter)) return false;
      }
      return true;
    });
  }, [currentList, searchQuery, platformFilter]);

  // Open Sliding Drawer
  const openDrawer = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDrawerOpen(true);
  };

  // Close Sliding Drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Action execution
  const handleExecuteAction = async (actionType) => {
    if (!selectedCampaign) return;
    setActionStatus({ loading: true, message: 'Executing directive...' });
    try {
      const res = await executeProtectedAction(actionType, selectedCampaign.id);
      setActionStatus({
        success: true,
        loading: false,
        message: res?.message || 'Directive executed successfully',
        txHash: res?.cryptographic_signature
      });
      setTimeout(() => setActionStatus(null), 4000);
    } catch (err) {
      setActionStatus({
        success: false,
        loading: false,
        message: err.message || 'Execution failed'
      });
      setTimeout(() => setActionStatus(null), 4000);
    }
  };

  // Status color helper
  const getStatusBadgeStyle = (status = '') => {
    const s = status.toUpperCase();
    if (s.includes('CRITICAL') || s.includes('ACTIVE')) {
      return { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
    }
    if (s.includes('VIRAL') || s.includes('HIGH')) {
      return { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.3)' };
    }
    if (s.includes('CONTAINED') || s.includes('ARCHIVED') || s.includes('DEBUNKED')) {
      return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
    }
    return { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' };
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Title & Pill Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-heading)', margin: 0, letterSpacing: '-0.3px' }}>
            Campaign Ledger
          </h2>

          <div style={{ display: 'flex', backgroundColor: 'var(--inner-box-bg)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)', gap: '3px' }}>
            <button
              onClick={() => setActiveTab('ongoing')}
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'ongoing' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'ongoing' ? '#ef4444' : 'var(--text-secondary)',
                boxShadow: activeTab === 'ongoing' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span>Ongoing ({ongoingCampaigns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'archived' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'archived' ? '#10b981' : 'var(--text-secondary)',
                boxShadow: activeTab === 'archived' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Archive size={12} />
              <span>Archived ({archivedCampaigns.length})</span>
            </button>
          </div>
        </div>

        {/* Search, Filter & Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by ID, title, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-heading)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

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

          <div style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '6px',
            backgroundColor: 'var(--inner-box-bg)',
            border: '1px solid var(--border-color)',
            color: currentUser.badgeColor,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentUser.badgeColor }} />
            <span>{currentUser.roleTitle.split('—')[0].trim()}</span>
          </div>
        </div>

      </div>

      {/* Action Toast Banner */}
      {actionStatus && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '14px',
          backgroundColor: actionStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: actionStatus.success ? '1px solid #10b981' : '1px solid #ef4444',
          color: actionStatus.success ? '#10b981' : '#ef4444',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={15} />
          <span>{actionStatus.message}</span>
          {actionStatus.txHash && (
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              TX: {actionStatus.txHash.slice(0, 16)}...
            </span>
          )}
        </div>
      )}

      {/* 2. Full-Width Ledger Table */}
      <div className="bs-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--inner-box-bg)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, width: '42%' }}>Operational Narrative</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Threat Score</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Signals</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Channels</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No campaigns found matching your filter criteria
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => {
                  const score = camp.threat_score || 50;
                  const badgeStyle = getStatusBadgeStyle(camp.status);
                  
                  return (
                    <tr
                      key={camp.id}
                      onClick={() => openDrawer(camp)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--inner-box-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* ID */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ 
                          fontFamily: 'JetBrains Mono', 
                          fontWeight: 700, 
                          color: activeTab === 'ongoing' ? '#ef4444' : '#10b981' 
                        }}>
                          {camp.id}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: badgeStyle.border
                        }}>
                          {camp.status || (activeTab === 'ongoing' ? 'ACTIVE' : 'CONTAINED')}
                        </span>
                      </td>

                      {/* Title & Target */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.35, marginBottom: '2px' }}>
                          {camp.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Target: {camp.target?.split('&')[0]?.trim() || 'Civil space'}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {camp.category}
                      </td>

                      {/* Threat Score */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontFamily: 'JetBrains Mono', 
                            fontWeight: 800, 
                            color: score >= 85 ? '#ef4444' : score >= 70 ? '#f59e0b' : '#3b82f6',
                            minWidth: '24px'
                          }}>
                            {score}
                          </span>
                          <div style={{ width: '50px', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${Math.min(100, score)}%`, 
                              height: '100%', 
                              backgroundColor: score >= 85 ? '#ef4444' : score >= 70 ? '#f59e0b' : '#3b82f6' 
                            }} />
                          </div>
                        </div>
                      </td>

                      {/* Signals / Posts */}
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', whiteSpace: 'nowrap' }}>
                        {camp.post_count?.toLocaleString() || 1}
                      </td>

                      {/* Platforms */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {camp.platforms?.slice(0, 3).map(p => (
                            <span 
                              key={p} 
                              style={{ 
                                fontSize: '9px', 
                                fontWeight: 700, 
                                padding: '1px 5px', 
                                borderRadius: '3px', 
                                backgroundColor: 'var(--inner-box-bg)', 
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)' 
                              }}
                            >
                              {p.toUpperCase().slice(0, 4)}
                            </span>
                          ))}
                          {(camp.platforms?.length || 0) > 3 && (
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                              +{camp.platforms.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Inspect Button */}
                      <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(camp);
                          }}
                          className="bs-button bs-button-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                        >
                          <span>Inspect</span>
                          <ChevronRight size={12} />
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

      {/* 3. Sliding Window / Drawer from Right */}
      {isDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            onClick={closeDrawer}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)',
              zIndex: 999,
              transition: 'opacity 0.2s ease'
            }}
          />

          {/* Slide-out Drawer Panel */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '880px',
            maxWidth: '94vw',
            height: '100vh',
            backgroundColor: 'var(--bg-card)',
            borderLeft: '1px solid var(--border-color)',
            boxShadow: '-12px 0 40px rgba(0,0,0,0.35)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            animation: 'slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            
            {/* Drawer Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--inner-box-bg)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontFamily: 'JetBrains Mono', 
                  fontSize: '12px', 
                  fontWeight: 800, 
                  color: selectedCampaign?.type === 'ongoing' || activeTab === 'ongoing' ? '#ef4444' : '#10b981',
                  backgroundColor: 'var(--bg-card)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)'
                }}>
                  {selectedCampaign?.id}
                </span>

                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  ...getStatusBadgeStyle(selectedCampaign?.status)
                }}>
                  {selectedCampaign?.status || (activeTab === 'ongoing' ? 'ACTIVE' : 'CONTAINED')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => alert(`Exporting dossier for ${selectedCampaign?.id}...`)}
                  className="bs-button bs-button-secondary"
                  style={{ padding: '5px 10px', fontSize: '11px', gap: '4px' }}
                >
                  <Download size={12} />
                  <span>Dossier</span>
                </button>

                <button
                  onClick={closeDrawer}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Drawer Body with Balanced 2-Column Layout */}
            {selectedCampaign && (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Top Section: Title, Target & Narrative Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'stretch' }}>
                  
                  {/* Left Box: Narrative & Target Profile */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY:</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, backgroundColor: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          {selectedCampaign.category}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                        {selectedCampaign.title}
                      </h3>

                      <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-heading)' }}>Operational Narrative: </strong>
                        {selectedCampaign.summary}
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <strong>Target Vector: </strong>
                      <span style={{ color: currentUser.badgeColor, fontWeight: 600 }}>{selectedCampaign.target || 'National Critical Domain'}</span>
                    </div>
                  </div>

                  {/* Right Box: Threat Scorecard & Telemetry Metrics */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        THREAT SEVERITY SCORECARD
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
                        <span style={{ fontSize: '36px', fontWeight: 900, color: (selectedCampaign.threat_score || 50) >= 85 ? '#ef4444' : (selectedCampaign.threat_score || 50) >= 70 ? '#f59e0b' : '#3b82f6', fontFamily: 'JetBrains Mono' }}>
                          {selectedCampaign.threat_score || 94}
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/100</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', marginLeft: 'auto' }}>
                          {selectedCampaign.confidence || 'HIGH'} CONFIDENCE
                        </span>
                      </div>

                      <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                        <div style={{ width: `${selectedCampaign.threat_score || 94}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: '3px' }} />
                      </div>
                    </div>

                    {/* 3 Metric Pills */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>BURST SYNC</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#3b82f6', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                          {selectedCampaign.cross_platform_sync || 93}%
                        </div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>SIGNALS</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                          {selectedCampaign.post_count || 842}
                        </div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>DIALECTS</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                          {selectedCampaign.languages_detected?.length || 4}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Middle Section: 2-Column Split (Topology Graph Left, Intercepted Signals Right) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  {/* Left: Vertical Multi-Hop Topology Network */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Share2 size={14} style={{ color: '#06b6d4' }} />
                      <span>Multi-Hop Propagation Network</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      
                      {/* Step 1: Origin Seed */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Origin Seed Cluster</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Coordinated Darknet IP Range</div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>SEED-01</span>
                      </div>

                      {/* Link 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '28px', gap: '8px' }}>
                        <div style={{ width: '2px', height: '18px', backgroundColor: '#3b82f6' }} />
                        <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600, backgroundColor: 'var(--bg-card)', padding: '1px 6px', borderRadius: '3px', border: '1px solid var(--border-color)' }}>
                          +{selectedCampaign.cross_platform_sync || 96}% Temporal Synchronization
                        </span>
                      </div>

                      {/* Step 2: Relay Swarm */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Share2 size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Relay Amplification Swarm</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{selectedCampaign.post_count || 42} Nodes across X & Telegram</div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>SWARM-42</span>
                      </div>

                      {/* Link 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '28px', gap: '8px' }}>
                        <div style={{ width: '2px', height: '18px', backgroundColor: '#10b981' }} />
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600, backgroundColor: 'var(--bg-card)', padding: '1px 6px', borderRadius: '3px', border: '1px solid var(--border-color)' }}>
                          Multi-Dialect Translation Mutation
                        </span>
                      </div>

                      {/* Step 3: Target Domain */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Layers size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Target Domain</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{selectedCampaign.target?.split('&')[0]?.trim() || 'Civil Space'}</div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>TARGET</span>
                      </div>

                    </div>
                  </div>

                  {/* Right: Intercepted Signal Payloads Feed */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Eye size={14} style={{ color: '#f59e0b' }} />
                        <span>Intercepted Signals in Cluster</span>
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                        {selectedCampaign.posts?.length || 3} captured
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '250px', paddingRight: '2px' }}>
                      {(selectedCampaign.posts || [
                        { platform: 'telegram', timestamp: '10m ago', language: 'hi-Latn', text: 'URGENT: All communication nodes shutting down tonight.' },
                        { platform: 'twitter', timestamp: '18m ago', language: 'en', text: 'Breaking: National grid frequency dropping sharply across northern sector.' }
                      ]).map((p, idx) => (
                        <div key={idx} style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '11px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', fontSize: '9px', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                              {p.platform || 'CHANNEL'}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '9px', fontFamily: 'JetBrains Mono' }}>
                              {p.timestamp || 'Recent'} • {p.language || 'en'}
                            </span>
                          </div>
                          <div style={{ color: 'var(--text-heading)', lineHeight: 1.4 }}>{p.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 3. Bottom Section: 2-Column Action Toolkit & Blockchain Evidence Anchor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                  
                  {/* Action Execution Card */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} style={{ color: currentUser.badgeColor }} />
                        <span>Authorized Operational Countermeasures</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        Clearance: <strong style={{ color: currentUser.badgeColor }}>{currentUser.roleTitle}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {activeTab === 'ongoing' && can('canIssueSec69A') && (
                        <button
                          onClick={() => handleExecuteAction('sec69a_takedown')}
                          className="bs-button"
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 16px',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flex: '1 1 auto'
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
                            padding: '10px 16px',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flex: '1 1 auto'
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
                            padding: '10px 16px',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flex: '1 1 auto'
                          }}
                        >
                          <span>Broadcast Fact-Check Debunk</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Blockchain Evidence Anchor Card */}
                  <div style={{
                    padding: '16px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={14} style={{ color: '#10b981' }} />
                        <span>Cryptographic Evidence Seal</span>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                        SHA-256: {selectedCampaign.evidence?.sha256_hash?.slice(0, 24) || 'a399d57364ceaba5fffb5bbd'}...
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteAction('blockchain_notarize')}
                      className="bs-button bs-button-secondary"
                      style={{
                        padding: '9px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <span>{activeTab === 'ongoing' ? 'Anchor on Blockchain' : 'Verify Merkle Root'}</span>
                      <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>
        </>
      )}

      {/* Global CSS animation for smooth drawer slide-in */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
}
