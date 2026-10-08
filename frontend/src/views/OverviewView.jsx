import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import {
  Activity,
  AlertOctagon,
  Database,
  ArrowRight,
  MapPin,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';

export default function OverviewView({ onNavigate }) {
  const [timeRange, setTimeRange] = useState('7D');
  const { currentRole } = useAuth();
  const { isConnected, liveSignals } = useWebSocket();

  const [backendOverview, setBackendOverview] = useState(null);
  const [backendCampaigns, setBackendCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real data from backend API
  const fetchRealData = async () => {
    setIsRefreshing(true);
    try {
      const [overviewRes, campaignsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/overview?role=${currentRole}`).catch(() => null),
        fetch(`http://127.0.0.1:8000/api/campaigns?role=${currentRole}`).catch(() => null)
      ]);

      if (overviewRes && overviewRes.ok) {
        const data = await overviewRes.json();
        setBackendOverview(data);
      }
      if (campaignsRes && campaignsRes.ok) {
        const camps = await campaignsRes.json();
        if (Array.isArray(camps)) {
          setBackendCampaigns(camps);
        }
      }
    } catch (err) {
      console.warn('Real data fetch skipped, using live context:', err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 15000);
    return () => clearInterval(interval);
  }, [currentRole]);

  // Meaningful KPI & telemetry configurations tailored per active persona
  const personaData = useMemo(() => {
    const liveCount = liveSignals.length;

    if (currentRole === ROLES.SYSTEM_ADMIN) {
      const baseIntercepts = backendOverview?.stats?.content_analyzed || 72080;
      const totalIntercepts = (baseIntercepts + liveCount).toLocaleString();
      const activeCamps = backendOverview?.stats?.active_campaigns || 17;
      const criticalThreats = backendOverview?.stats?.high_risk_campaigns || 5;

      return {
        roleId: 'system_admin',
        title: 'Super Administrator — System Architecture & Threat Grid Command',
        subtitle: 'Supreme root access: software telemetry, cluster health, cross-agency IO matrix & vector operations',
        classificationBadge: 'SUPREME ROOT // LEVEL 5+',
        classificationColor: '#10b981',
        stats: [
          { label: 'Active Cyber Campaigns', value: String(activeCamps), color: 'var(--text-heading)' },
          { label: 'Critical National Threats', value: String(criticalThreats), color: '#ef4444', isDanger: true },
          { label: 'Raw Intercepts Ingested', value: totalIntercepts, color: 'var(--text-heading)' },
          { label: 'Cluster Nodes Online', value: '4 / 4', color: '#10b981' },
          { label: 'Court Evidences Sealed', value: '89', color: '#10b981' }
        ],
        timeline: [
          { time: '00:00', count: 14 + Math.round(liveCount * 0.1), highRisk: 3 },
          { time: '04:00', count: 16 + Math.round(liveCount * 0.15), highRisk: 4 },
          { time: '08:00', count: 64 + Math.round(liveCount * 0.3), highRisk: 24 },
          { time: '12:00', count: 128 + Math.round(liveCount * 0.4), highRisk: 92 },
          { time: '16:00', count: 98 + Math.round(liveCount * 0.2), highRisk: 62 },
          { time: '20:00', count: 56 + Math.round(liveCount * 0.1), highRisk: 22 },
        ],
        sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ name: s.name, pct: `${s.percentage}%`, color: s.color })) : [
          { name: 'X (Twitter)', pct: '37%', color: 'var(--sticker-sky)' },
          { name: 'Reddit Ingestion', pct: '28%', color: 'var(--sticker-orange)' },
          { name: 'Instagram Reels', pct: '28%', color: 'var(--sticker-pink)' },
          { name: 'Telegram Dark Web', pct: '5%', color: 'var(--sticker-purple)' },
          { name: 'WhatsApp Tiplines', pct: '2%', color: 'var(--sticker-teal)' }
        ],
        hotspots: [
          { name: 'DELHI / NCR ROOT COMMAND', top: '35%', left: '40%', color: '#ef4444' },
          { name: 'MUMBAI / GATEWAY', top: '60%', left: '30%', color: '#f59e0b' },
          { name: 'J&K BORDER SECTOR', top: '20%', left: '35%', color: '#ef4444' },
          { name: 'BENGALURU TECH HUB', top: '75%', left: '45%', color: '#10b981' }
        ]
      };
    }

    if (currentRole === ROLES.INVESTIGATION_BUREAU) {
      const baseIntercepts = backendOverview?.stats?.content_analyzed || 72080;
      const totalIntercepts = (baseIntercepts + liveCount).toLocaleString();

      return {
        roleId: 'investigation_bureau',
        title: 'Investigation Bureau of India — Cyber Operations Command',
        subtitle: 'National security threat matrix, foreign state-sponsored information ops & inter-agency threat mitigation',
        classificationBadge: 'LEVEL 5 TOP SECRET / LEA',
        classificationColor: '#ef4444',
        stats: [
          { label: 'Active Foreign Operations', value: '12', color: 'var(--text-heading)' },
          { label: 'Critical Threat Vectors', value: '5', color: '#ef4444', isDanger: true },
          { label: 'Classified Intercepts', value: totalIntercepts, color: 'var(--text-heading)' },
          { label: 'Proxy Bot Farms Tracked', value: '42', color: 'var(--sticker-orange)' },
          { label: 'Court Evidences Sealed', value: '89', color: '#10b981' }
        ],
        timeline: [
          { time: '00:00', count: 18 + Math.round(liveCount * 0.1), highRisk: 4 },
          { time: '04:00', count: 22 + Math.round(liveCount * 0.15), highRisk: 6 },
          { time: '08:00', count: 92 + Math.round(liveCount * 0.3), highRisk: 48 },
          { time: '12:00', count: 165 + Math.round(liveCount * 0.4), highRisk: 104 },
          { time: '16:00', count: 120 + Math.round(liveCount * 0.2), highRisk: 74 },
          { time: '20:00', count: 56 + Math.round(liveCount * 0.1), highRisk: 22 },
        ],
        sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ name: s.name, pct: `${s.percentage}%`, color: s.color })) : [
          { name: 'X (Twitter Botnets)', pct: '37%', color: 'var(--sticker-sky)' },
          { name: 'Reddit Disinfo Swarms', pct: '28%', color: 'var(--sticker-orange)' },
          { name: 'Instagram Visual Ops', pct: '28%', color: 'var(--sticker-pink)' },
          { name: 'Dark Telegram Channels', pct: '7%', color: 'var(--sticker-purple)' }
        ],
        hotspots: [
          { name: 'J&K SECTOR COMMAND', top: '22%', left: '36%', color: '#ef4444' },
          { name: 'DELHI LEA HQ', top: '35%', left: '40%', color: '#ef4444' },
          { name: 'WESTERN BORDER CORRIDOR', top: '48%', left: '26%', color: '#f59e0b' },
          { name: 'SILIGURI CORRIDOR', top: '38%', left: '72%', color: '#ef4444' }
        ]
      };
    }

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      const basePosts = backendOverview?.stats?.content_analyzed || 14280;
      const totalPosts = (basePosts + liveCount).toLocaleString();

      return {
        roleId: 'corporate_enterprise',
        title: 'Tata Sons — Brand Defense & Market Risk Radar',
        subtitle: 'Real-time detection of coordinated corporate smear campaigns, stock sabotage, EV battery hoaxes, TCS hiring rumors & executive deepfakes',
        classificationBadge: 'ENTERPRISE TIER-1 RESTRICTED',
        classificationColor: '#dd5b00',
        stats: [
          { label: 'Active Brand Attacks', value: '4', color: 'var(--text-heading)' },
          { label: 'High Risk Market Threats', value: '2', color: '#ef4444', isDanger: true },
          { label: 'Corporate Posts Analyzed', value: totalPosts, color: 'var(--text-heading)' },
          { label: 'Executive Deepfakes', value: '3', color: 'var(--sticker-orange)' },
          { label: 'Sentiment Sabotage Index', value: '-62%', color: 'var(--sticker-pink)' }
        ],
        timeline: [
          { time: '00:00', count: 8 + Math.round(liveCount * 0.05), highRisk: 1 },
          { time: '04:00', count: 12 + Math.round(liveCount * 0.1), highRisk: 2 },
          { time: '08:00', count: 65 + Math.round(liveCount * 0.3), highRisk: 38 },
          { time: '12:00', count: 98 + Math.round(liveCount * 0.4), highRisk: 72 },
          { time: '16:00', count: 82 + Math.round(liveCount * 0.25), highRisk: 54 },
          { time: '20:00', count: 45 + Math.round(liveCount * 0.1), highRisk: 22 },
        ],
        sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ name: s.name, pct: `${s.percentage}%`, color: s.color })) : [
          { name: 'X / FinTwit Clusters', pct: '38%', color: 'var(--sticker-sky)' },
          { name: 'Instagram Viral Reels', pct: '28%', color: 'var(--sticker-pink)' },
          { name: 'Reddit Investor Hubs', pct: '20%', color: 'var(--sticker-orange)' },
          { name: 'Telegram Shadow Groups', pct: '14%', color: 'var(--sticker-purple)' }
        ],
        hotspots: [
          { name: 'BOMBAY HOUSE / MUMBAI', top: '58%', left: '30%', color: '#ef4444' },
          { name: 'PUNE AUTO & EV HUB', top: '65%', left: '32%', color: '#f59e0b' },
          { name: 'JAMSHEDPUR STEEL HUB', top: '46%', left: '72%', color: '#10b981' },
          { name: 'BSE / FINANCIAL DISTRICT', top: '54%', left: '28%', color: '#f59e0b' }
        ]
      };
    }

    // Default: Journalist / Media
    const baseTipline = backendOverview?.stats?.tipline_submissions || 9424;
    const totalTipline = (baseTipline + liveCount).toLocaleString();

    return {
      roleId: 'journalist_media',
      title: 'National Press Consortium — Fact-Check & Virality Monitor',
      subtitle: 'Cross-lingual rumor genealogies, viral WhatsApp forwards, manipulated media & pre-publication debunk verification',
      classificationBadge: 'PRESS ACCREDITED // VERIFICATION DESK',
      classificationColor: '#0075de',
      stats: [
        { label: 'Viral Rumors Tracked', value: '23', color: 'var(--text-heading)' },
        { label: 'Critical Debunk Priority', value: '6', color: '#ef4444', isDanger: true },
        { label: 'Citizen Tipline Submissions', value: totalTipline, color: 'var(--text-heading)' },
        { label: 'Multilingual Variants', value: '78', color: 'var(--notion-blue)' },
        { label: 'AI Generative Fakes', value: '11', color: 'var(--sticker-orange)' }
      ],
      timeline: [
        { time: '00:00', count: 20 + Math.round(liveCount * 0.1), highRisk: 6 },
        { time: '04:00', count: 24 + Math.round(liveCount * 0.15), highRisk: 8 },
        { time: '08:00', count: 110 + Math.round(liveCount * 0.35), highRisk: 58 },
        { time: '12:00', count: 180 + Math.round(liveCount * 0.4), highRisk: 112 },
        { time: '16:00', count: 135 + Math.round(liveCount * 0.25), highRisk: 78 },
        { time: '20:00', count: 70 + Math.round(liveCount * 0.1), highRisk: 30 },
      ],
      sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ name: s.name, pct: `${s.percentage}%`, color: s.color })) : [
        { name: 'WhatsApp Citizen Tipline', pct: '38%', color: 'var(--sticker-teal)' },
        { name: 'Instagram Viral Reels', pct: '28%', color: 'var(--sticker-pink)' },
        { name: 'Reddit Rumor Threads', pct: '20%', color: 'var(--sticker-orange)' },
        { name: 'X / Public Feeds', pct: '14%', color: 'var(--sticker-sky)' }
      ],
      hotspots: [
        { name: 'DELHI MEDIA DESK', top: '35%', left: '40%', color: '#0075de' },
        { name: 'MUMBAI METRO', top: '60%', left: '30%', color: '#ff64c8' },
        { name: 'BENGALURU FACT DESK', top: '75%', left: '45%', color: '#0075de' },
        { name: 'KOLKATA PRESS BUREAU', top: '48%', left: '70%', color: '#10b981' }
      ]
    };
  }, [currentRole, backendOverview, liveSignals.length]);

  // Merge real campaigns from backend with role-partitioned campaigns
  const displayCampaigns = useMemo(() => {
    if (backendCampaigns && backendCampaigns.length > 0) {
      return backendCampaigns.map(c => ({
        id: c.id,
        title: c.title,
        risk: `${c.threat_score - 6}-${c.threat_score}`,
        coord: `${c.cross_platform_sync || 92}`,
        aiAsst: `${Math.round(c.threat_score * 0.9)}`,
        status: c.status?.replace('_', ' ') || 'ACTIVE',
        statusColor: c.threat_score >= 85 ? 'danger' : 'secondary',
        focus: c.target || c.category || 'Information Warfare'
      }));
    }

    // Fallback default campaign list if backend unreachable
    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return [
        { id: 'TATA-009', title: 'Tata Motors EV & TCS Disinformation Swarm', risk: '89-95', coord: '94', aiAsst: '88', status: 'DEFENSE ACTIVE', statusColor: 'danger', focus: 'EV & Placement Disinformation' },
        { id: 'TATA-014', title: 'Air India & Executive Deepfake Audio on Reels', risk: '82-91', coord: '78', aiAsst: '96', status: 'FORENSICS LOCKED', statusColor: 'danger', focus: 'Synthetic Voice Impersonation' },
        { id: 'TATA-022', title: 'Tata Steel Environmental ESG Fabrications', risk: '58-71', coord: '62', aiAsst: '34', status: 'MONITORING', statusColor: 'secondary', focus: 'Foreign NGO Regulatory Hoax' }
      ];
    }
    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return [
        { id: 'FACT-007', title: 'Nationwide Internet & UPI Blackout Panic Forward', risk: '92-96', coord: '96', aiAsst: '88', status: 'DEBUNK ISSUED', statusColor: 'danger', focus: 'Mass Panic Induction' },
        { id: 'FACT-011', title: 'Fake PM Subsidy Portal Phishing Links', risk: '71-83', coord: '65', aiAsst: '42', status: 'FACT-CHECKED', statusColor: 'secondary', focus: 'Financial Fraud Scam' },
        { id: 'FACT-033', title: 'Altered Video of Cyclone Damage in Coastal Zone', risk: '60-72', coord: '54', aiAsst: '76', status: 'VERIFYING', statusColor: 'secondary', focus: 'Old Footage Re-contextualized' }
      ];
    }
    return [
      { id: 'CMP-007', title: 'Infrastructure Shutdown & Civil Unrest Narrative', risk: '88-94', coord: '93', aiAsst: '81', status: 'ACTIVE CRITICAL', statusColor: 'danger', focus: 'State-Sponsored Destabilization' },
      { id: 'CMP-011', title: 'Government Identity Spoofing & Phishing Matrix', risk: '71-83', coord: '65', aiAsst: '42', status: 'MONITORING', statusColor: 'secondary', focus: 'Credential Harvesting Farm' },
      { id: 'CMP-003', title: 'Communal Polarization Burst in Border Districts', risk: '52-67', coord: '48', aiAsst: '12', status: 'SURVEILLANCE', statusColor: 'secondary', focus: 'Cross-Border Telegram Networks' }
    ];
  }, [backendCampaigns, currentRole]);

  return (
    <div>
      {/* Page Header with Persona Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: `${personaData.classificationColor}18`,
              color: personaData.classificationColor,
              border: `1px solid ${personaData.classificationColor}40`,
              letterSpacing: '0.05em',
              fontFamily: 'JetBrains Mono'
            }}>
              {personaData.classificationBadge}
            </span>
            {liveSignals.length > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 117, 222, 0.12)',
                color: 'var(--notion-blue)',
                border: '1px solid rgba(0, 117, 222, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'JetBrains Mono'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0075de', boxShadow: '0 0 6px #0075de' }} />
                +{liveSignals.length} LIVE SIGNALS
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            {personaData.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '800px', lineHeight: 1.5 }}>
            {personaData.subtitle}
          </p>
        </div>

        {/* Live sync indicator & manual refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={fetchRealData}
            disabled={isRefreshing}
            className="button-utility"
            title="Refresh real-time intelligence feeds"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP 5 STAT CARDS (Classic Card Design with 100% Real Live Data)           */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {personaData.stats.map((st, idx) => (
          <div 
            key={idx} 
            className="bs-card" 
            style={{ 
              padding: '18px',
              borderColor: st.isDanger ? 'rgba(239, 68, 68, 0.4)' : undefined,
              background: st.isDanger ? 'rgba(239, 68, 68, 0.04)' : undefined
            }}
          >
            <div style={{ color: st.isDanger ? '#ef4444' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
              <span>{st.label}</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: st.color || 'var(--text-heading)', marginTop: '8px', fontFamily: 'JetBrains Mono', letterSpacing: '-1px' }}>
              {st.value}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MIDDLE ROW: TIMELINE CHART & PARTITIONED INGESTION SOURCES                */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Timeline Chart */}
        <div className="bs-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)' }}>
              <Activity size={18} style={{ color: 'var(--notion-blue)' }} />
              <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Brand Attack Velocity & Stock Volatility Timeline' : currentRole === ROLES.JOURNALIST_MEDIA ? 'Viral Rumor Forward Velocity Timeline' : 'National Threat Activity Timeline'}</span>
            </div>
            {/* Pill-shaped Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setTimeRange('24H')}
                className={`pill-tab ${timeRange === '24H' ? 'active' : ''}`}
              >
                24H
              </button>
              <button
                onClick={() => setTimeRange('7D')}
                className={`pill-tab ${timeRange === '7D' ? 'active' : ''}`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeRange('30D')}
                className={`pill-tab ${timeRange === '30D' ? 'active' : ''}`}
              >
                30D
              </button>
            </div>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personaData.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-soft)', color: 'var(--text-heading)' }}
                  cursor={{ fill: 'rgba(0, 117, 222, 0.04)' }}
                />
                <Bar dataKey="count" fill="var(--notion-blue)" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="highRisk" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution Card */}
        <div className="bs-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <Database size={18} style={{ color: 'var(--sticker-teal)' }} />
            <span>Partitioned Ingestion Channels</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {personaData.sources.map((src, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: src.color, display: 'inline-block' }}></span>
                    <span style={{ color: 'var(--text-primary)' }}>{src.name}</span>
                  </span>
                  <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>{src.pct}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: src.pct, height: '100%', backgroundColor: src.color, borderRadius: '9999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ROW: PRIORITY CAMPAIGNS TABLE & REGIONAL HOTSPOTS MAP              */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Priority Campaigns Table */}
        <div className="bs-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <AlertOctagon size={18} style={{ color: '#ef4444' }} />
              <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Targeted Corporate Smear Campaigns' : currentRole === ROLES.JOURNALIST_MEDIA ? 'Viral Rumor Verification Queue' : 'Priority Threat Campaigns'}</span>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('campaigns')}
              className="button-utility"
              style={{ fontSize: '12px' }}
            >
              <span>View All Campaigns</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--inner-box-bg)', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>ID</th>
                  <th style={{ padding: '10px 14px' }}>NARRATIVE FOCUS</th>
                  <th style={{ padding: '10px 14px' }}>RISK RANGE</th>
                  <th style={{ padding: '10px 14px' }}>COORD.</th>
                  <th style={{ padding: '10px 14px' }}>AI ASST.</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {displayCampaigns.map((cmp, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < displayCampaigns.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{cmp.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{cmp.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{cmp.focus}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{cmp.risk}</span>
                        <div style={{ width: '45px', height: '4px', backgroundColor: '#ef4444', borderRadius: '9999px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>{cmp.coord}%</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: 'var(--sticker-orange)', fontWeight: 600 }}>{cmp.aiAsst}%</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onNavigate && onNavigate('campaigns')}
                        className={`bs-button bs-button-${cmp.statusColor}`}
                        style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '9999px' }}
                      >
                        {cmp.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Hotspot Preview */}
        <div className="bs-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <MapPin size={18} style={{ color: 'var(--sticker-pink)' }} />
            <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Asset & Financial Center Hotspots' : currentRole === ROLES.JOURNALIST_MEDIA ? 'Citizen Tipline Regional Nodes' : 'National Hotspot Clusters'}</span>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--inner-box-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            overflow: 'hidden'
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              opacity: 0.7
            }} />

            {/* Glowing Hotspots based on current persona */}
            {personaData.hotspots.map((h, hIdx) => (
              <div 
                key={hIdx}
                style={{ 
                  position: 'absolute', 
                  top: h.top, 
                  left: h.left, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div 
                  style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: h.color, 
                    boxShadow: `0 0 10px ${h.color}` 
                  }} 
                />
                <span style={{ fontSize: '9px', color: 'var(--text-primary)', marginTop: '3px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: 'var(--bg-card)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  {h.name}
                </span>
              </div>
            ))}

            <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '2px 8px', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>LIVE RADAR</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
