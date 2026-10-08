import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import {
  Activity,
  AlertOctagon,
  Database,
  ArrowRight,
  MapPin,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Filter,
  BarChart3,
  LineChart as LineChartIcon,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Flame,
  Radio,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';

export default function OverviewView({ onNavigate }) {
  // Filter States
  const [timeRange, setTimeRange] = useState('7D'); // '24H', '7D', '30D', 'ALL'
  const [metricFilter, setMetricFilter] = useState('ALL'); // 'ALL', 'HIGH_RISK', 'BOTNET', 'CROSS_PLATFORM'
  const [selectedChannel, setSelectedChannel] = useState('ALL'); // 'ALL', 'twitter', 'reddit', 'instagram', 'telegram', 'whatsapp'
  const [chartType, setChartType] = useState('bar'); // 'bar', 'area', 'line'
  
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
      const activeCamps = backendOverview?.stats?.active_campaigns ?? 6;
      const criticalThreats = backendOverview?.stats?.high_risk_campaigns ?? 3;

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
          { label: 'Cluster Nodes Online', value: '4 / 4', color: '#10b981' }
        ],
        sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ key: s.key || s.name.toLowerCase(), name: s.name, pct: `${s.percentage}%`, rawPct: s.percentage, color: s.color })) : [
          { key: 'twitter', name: 'X (Twitter)', pct: '37%', rawPct: 37, color: 'var(--sticker-sky, #38bdf8)' },
          { key: 'reddit', name: 'Reddit Ingestion', pct: '28%', rawPct: 28, color: 'var(--sticker-orange, #fb923c)' },
          { key: 'instagram', name: 'Instagram Reels', pct: '28%', rawPct: 28, color: 'var(--sticker-pink, #f472b6)' },
          { key: 'telegram', name: 'Telegram Dark Web', pct: '5%', rawPct: 5, color: 'var(--sticker-purple, #c084fc)' },
          { key: 'whatsapp', name: 'WhatsApp Tiplines', pct: '2%', rawPct: 2, color: 'var(--sticker-teal, #2dd4bf)' }
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
      const activeCamps = backendOverview?.stats?.active_campaigns ?? 6;
      const criticalThreats = backendOverview?.stats?.high_risk_campaigns ?? 3;

      return {
        roleId: 'investigation_bureau',
        title: 'Investigation Bureau of India — Cyber Operations Command',
        subtitle: 'National security threat matrix, foreign state-sponsored information ops & inter-agency threat mitigation',
        classificationBadge: 'LEVEL 5 TOP SECRET / LEA',
        classificationColor: '#ef4444',
        stats: [
          { label: 'Active Foreign Operations', value: String(activeCamps), color: 'var(--text-heading)' },
          { label: 'Critical Threat Vectors', value: String(criticalThreats), color: '#ef4444', isDanger: true },
          { label: 'Classified Intercepts', value: totalIntercepts, color: 'var(--text-heading)' },
          { label: 'Proxy Bot Farms Tracked', value: '42', color: 'var(--sticker-orange, #fb923c)' }
        ],
        sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ key: s.key || s.name.toLowerCase(), name: s.name, pct: `${s.percentage}%`, rawPct: s.percentage, color: s.color })) : [
          { key: 'twitter', name: 'X (Twitter Botnets)', pct: '37%', rawPct: 37, color: 'var(--sticker-sky, #38bdf8)' },
          { key: 'reddit', name: 'Reddit Disinfo Swarms', pct: '28%', rawPct: 28, color: 'var(--sticker-orange, #fb923c)' },
          { key: 'instagram', name: 'Instagram Visual Ops', pct: '28%', rawPct: 28, color: 'var(--sticker-pink, #f472b6)' },
          { key: 'telegram', name: 'Dark Telegram Channels', pct: '7%', rawPct: 7, color: 'var(--sticker-purple, #c084fc)' }
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
      const activeCamps = backendOverview?.stats?.active_campaigns ?? 3;
      const criticalThreats = backendOverview?.stats?.high_risk_campaigns ?? 2;

      return {
        roleId: 'corporate_enterprise',
        title: 'Tata Sons — Brand Defense & Market Risk Radar',
        subtitle: 'Real-time detection of coordinated corporate smear campaigns, stock sabotage, energy & port hoaxes, and executive deepfakes',
        classificationBadge: 'ENTERPRISE TIER-1 RESTRICTED',
        classificationColor: '#f59e0b',
        stats: [
          { label: 'Active Brand Attacks', value: String(activeCamps), color: 'var(--text-heading)' },
          { label: 'High Risk Market Threats', value: String(criticalThreats), color: '#ef4444', isDanger: true },
          { label: 'Corporate Posts Analyzed', value: totalPosts, color: 'var(--text-heading)' },
          { label: 'Executive Deepfakes', value: '3', color: 'var(--sticker-orange, #fb923c)' }
        ],
        sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ key: s.key || s.name.toLowerCase(), name: s.name, pct: `${s.percentage}%`, rawPct: s.percentage, color: s.color })) : [
          { key: 'twitter', name: 'X / FinTwit Clusters', pct: '38%', rawPct: 38, color: 'var(--sticker-sky, #38bdf8)' },
          { key: 'instagram', name: 'Instagram Viral Reels', pct: '28%', rawPct: 28, color: 'var(--sticker-pink, #f472b6)' },
          { key: 'reddit', name: 'Reddit Investor Hubs', pct: '20%', rawPct: 20, color: 'var(--sticker-orange, #fb923c)' },
          { key: 'telegram', name: 'Telegram Shadow Groups', pct: '14%', rawPct: 14, color: 'var(--sticker-purple, #c084fc)' }
        ],
        hotspots: [
          { name: 'TATA SONS HQ / BOMBAY HOUSE', top: '58%', left: '30%', color: '#ef4444' },
          { name: 'TATA MOTORS PUNE PLANT', top: '60%', left: '32%', color: '#f59e0b' },
          { name: 'TCS TECH CORRIDOR BENGALURU', top: '75%', left: '45%', color: '#10b981' },
          { name: 'TATA STEEL JAMSHEDPUR', top: '48%', left: '72%', color: '#f59e0b' }
        ]
      };
    }

    // Default: Journalist / Media
    const baseTipline = backendOverview?.stats?.tipline_submissions || 9424;
    const totalTipline = (baseTipline + liveCount).toLocaleString();
    const activeCamps = backendOverview?.stats?.active_campaigns ?? 3;
    const criticalThreats = backendOverview?.stats?.high_risk_campaigns ?? 2;

    return {
      roleId: 'journalist_media',
      title: 'National Press Consortium — Fact-Check & Virality Monitor',
      subtitle: 'Cross-lingual rumor genealogies, viral WhatsApp forwards, manipulated media & pre-publication debunk verification',
      classificationBadge: 'PRESS ACCREDITED // VERIFICATION DESK',
      classificationColor: '#3b82f6',
      stats: [
        { label: 'Viral Rumors Tracked', value: String(activeCamps), color: 'var(--text-heading)' },
        { label: 'Critical Debunk Priority', value: String(criticalThreats), color: '#ef4444', isDanger: true },
        { label: 'Citizen Tipline Submissions', value: totalTipline, color: 'var(--text-heading)' },
        { label: 'Multilingual Variants', value: '78', color: '#3b82f6' }
      ],
      sources: backendOverview?.sources ? backendOverview.sources.map(s => ({ key: s.key || s.name.toLowerCase(), name: s.name, pct: `${s.percentage}%`, rawPct: s.percentage, color: s.color })) : [
        { key: 'whatsapp', name: 'WhatsApp Citizen Tipline', pct: '38%', rawPct: 38, color: 'var(--sticker-teal, #2dd4bf)' },
        { key: 'instagram', name: 'Instagram Viral Reels', pct: '28%', rawPct: 28, color: 'var(--sticker-pink, #f472b6)' },
        { key: 'reddit', name: 'Reddit Rumor Threads', pct: '20%', rawPct: 20, color: 'var(--sticker-orange, #fb923c)' },
        { key: 'twitter', name: 'X / Public Feeds', pct: '14%', rawPct: 14, color: 'var(--sticker-sky, #38bdf8)' }
      ],
      hotspots: [
        { name: 'DELHI MEDIA DESK', top: '35%', left: '40%', color: '#3b82f6' },
        { name: 'MUMBAI METRO', top: '60%', left: '30%', color: '#f472b6' },
        { name: 'BENGALURU FACT DESK', top: '75%', left: '45%', color: '#3b82f6' },
        { name: 'KOLKATA PRESS BUREAU', top: '48%', left: '70%', color: '#10b981' }
      ]
    };
  }, [currentRole, backendOverview, liveSignals.length]);

  // =========================================================================
  // DYNAMIC COMPUTED GRAPH DATA (Reacts to timeRange, metricFilter, and selectedChannel)
  // =========================================================================
  const graphData = useMemo(() => {
    const liveCount = liveSignals.length;

    // Platform channel scale multipliers
    const channelMultiplier = {
      'ALL': 1.0,
      'twitter': 0.38,
      'reddit': 0.28,
      'instagram': 0.25,
      'telegram': 0.14,
      'whatsapp': 0.18
    }[selectedChannel] || 1.0;

    // Metric weighting factors
    const metricFactor = {
      'ALL': { totalScale: 1.0, highRiskScale: 1.0, botScale: 1.0 },
      'HIGH_RISK': { totalScale: 0.5, highRiskScale: 1.2, botScale: 0.6 },
      'BOTNET': { totalScale: 0.6, highRiskScale: 0.7, botScale: 1.4 },
      'CROSS_PLATFORM': { totalScale: 0.8, highRiskScale: 0.9, botScale: 0.9 }
    }[metricFilter] || { totalScale: 1.0, highRiskScale: 1.0, botScale: 1.0 };

    let basePoints = [];

    if (timeRange === '24H') {
      basePoints = [
        { label: '00:00', baseTotal: 22, baseHigh: 4, baseBot: 8 },
        { label: '04:00', baseTotal: 34, baseHigh: 8, baseBot: 14 },
        { label: '08:00', baseTotal: 96, baseHigh: 42, baseBot: 56 },
        { label: '12:00', baseTotal: 184, baseHigh: 112, baseBot: 120 },
        { label: '16:00', baseTotal: 142, baseHigh: 84, baseBot: 92 },
        { label: '20:00', baseTotal: 86, baseHigh: 38, baseBot: 48 },
        { label: '23:59', baseTotal: 48, baseHigh: 14, baseBot: 22 }
      ];
    } else if (timeRange === '7D') {
      basePoints = [
        { label: 'Mon', baseTotal: 420, baseHigh: 180, baseBot: 240 },
        { label: 'Tue', baseTotal: 580, baseHigh: 240, baseBot: 310 },
        { label: 'Wed', baseTotal: 890, baseHigh: 460, baseBot: 520 },
        { label: 'Thu', baseTotal: 1240, baseHigh: 720, baseBot: 810 },
        { label: 'Fri', baseTotal: 980, baseHigh: 540, baseBot: 620 },
        { label: 'Sat', baseTotal: 640, baseHigh: 310, baseBot: 380 },
        { label: 'Sun', baseTotal: 510, baseHigh: 210, baseBot: 290 }
      ];
    } else if (timeRange === '30D') {
      basePoints = [
        { label: 'Week 1', baseTotal: 3400, baseHigh: 1420, baseBot: 1890 },
        { label: 'Week 2', baseTotal: 4800, baseHigh: 2100, baseBot: 2750 },
        { label: 'Week 3', baseTotal: 6900, baseHigh: 3450, baseBot: 4200 },
        { label: 'Week 4', baseTotal: 8200, baseHigh: 4600, baseBot: 5400 },
        { label: 'Current', baseTotal: 5100 + (liveCount * 12), baseHigh: 2800 + (liveCount * 5), baseBot: 3200 + (liveCount * 7) }
      ];
    } else { // 'ALL'
      basePoints = [
        { label: 'Q1 (Jan-Mar)', baseTotal: 14200, baseHigh: 6800, baseBot: 8900 },
        { label: 'Q2 (Apr-Jun)', baseTotal: 19800, baseHigh: 9400, baseBot: 12400 },
        { label: 'Q3 (Jul-Sep)', baseTotal: 26400, baseHigh: 14100, baseBot: 18200 },
        { label: 'Q4 (Active)', baseTotal: 31200 + (liveCount * 25), baseHigh: 18400 + (liveCount * 10), baseBot: 21900 + (liveCount * 15) }
      ];
    }

    return basePoints.map((pt, idx) => {
      const liveFactor = timeRange === '24H' ? Math.round(liveCount * 0.15) : Math.round(liveCount * 2);
      const totalSignals = Math.max(1, Math.round((pt.baseTotal + liveFactor) * channelMultiplier * metricFactor.totalScale));
      const highRisk = Math.max(0, Math.min(totalSignals, Math.round((pt.baseHigh + (liveFactor * 0.5)) * channelMultiplier * metricFactor.highRiskScale)));
      const botnetBurst = Math.max(0, Math.min(totalSignals, Math.round((pt.baseBot + (liveFactor * 0.6)) * channelMultiplier * metricFactor.botScale)));
      const normalVolume = Math.max(0, totalSignals - highRisk);

      return {
        time: pt.label,
        totalSignals,
        highRisk,
        botnetBurst,
        normalVolume,
        velocityRate: `+${Math.round((highRisk / (totalSignals || 1)) * 100)}%`
      };
    });
  }, [timeRange, metricFilter, selectedChannel, liveSignals.length]);

  // Aggregate stats from the current graph view
  const graphSummary = useMemo(() => {
    const totalVolume = graphData.reduce((acc, d) => acc + d.totalSignals, 0);
    const totalHighRisk = graphData.reduce((acc, d) => acc + d.highRisk, 0);
    const totalBotBurst = graphData.reduce((acc, d) => acc + d.botnetBurst, 0);
    const peakInterval = [...graphData].sort((a, b) => b.totalSignals - a.totalSignals)[0]?.time || 'N/A';

    return {
      totalVolume,
      totalHighRisk,
      totalBotBurst,
      peakInterval,
      riskRatio: totalVolume > 0 ? Math.round((totalHighRisk / totalVolume) * 100) : 0
    };
  }, [graphData]);

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

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return [
        { id: 'ADANI-009', title: 'Adani Energy & Port Infrastructure Smear Campaign', risk: '89-95', coord: '94', aiAsst: '88', status: 'DEFENSE ACTIVE', statusColor: 'danger', focus: 'Market Sabotage & Short Disinfo' },
        { id: 'ADANI-014', title: 'Executive Deepfake Audio on Reels & Telegram', risk: '82-91', coord: '78', aiAsst: '96', status: 'FORENSICS LOCKED', statusColor: 'danger', focus: 'Synthetic Voice Impersonation' },
        { id: 'ADANI-022', title: 'Adani Green Energy Regulatory Hoax & ESG Claims', risk: '58-71', coord: '62', aiAsst: '34', status: 'MONITORING', statusColor: 'secondary', focus: 'Foreign Media Regulatory Smear' }
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

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'var(--bg-card, #161822)',
          border: '1px solid var(--border-color, #2a2d3d)',
          borderRadius: '8px',
          padding: '12px 14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          fontSize: '12px',
          color: 'var(--text-heading, #ffffff)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '13px', borderBottom: '1px solid var(--border-color, #2a2d3d)', paddingBottom: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span>Interval: {label}</span>
            <span style={{ color: '#ef4444' }}>Risk: {data.velocityRate}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: 'var(--notion-blue, #3b82f6)' }}>● Total Signals:</span>
              <strong style={{ fontFamily: 'JetBrains Mono' }}>{data.totalSignals.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#ef4444' }}>● High Risk Threats:</span>
              <strong style={{ fontFamily: 'JetBrains Mono', color: '#ef4444' }}>{data.highRisk.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#f59e0b' }}>● Bot / Swarm Bursts:</span>
              <strong style={{ fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>{data.botnetBurst.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* ========================================================================= */}
      {/* PAGE HEADER WITH PERSONA CONTEXT & REAL-TIME CONTROLS                     */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
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
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'JetBrains Mono'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
                +{liveSignals.length} LIVE SIGNALS
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.5px', margin: 0 }}>
            {personaData.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '850px', lineHeight: 1.5 }}>
            {personaData.subtitle}
          </p>
        </div>

        {/* Live sync indicator & manual refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={fetchRealData}
            disabled={isRefreshing}
            className="bs-button bs-button-secondary"
            title="Refresh real-time intelligence feeds"
            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP 5 STAT CARDS                                                          */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {personaData.stats.map((st, idx) => (
          <div 
            key={idx} 
            className="bs-card" 
            style={{ 
              padding: '16px',
              borderColor: st.isDanger ? 'rgba(239, 68, 68, 0.4)' : undefined,
              background: st.isDanger ? 'rgba(239, 68, 68, 0.04)' : undefined
            }}
          >
            <div style={{ color: st.isDanger ? '#ef4444' : 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              <span>{st.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: st.color || 'var(--text-heading)', marginTop: '6px', fontFamily: 'JetBrains Mono', letterSpacing: '-0.5px' }}>
              {st.value}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE TIMELINE GRAPH & CHANNEL DISTRIBUTION CARD                    */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '20px' }}>

        {/* Timeline Chart Container */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Bar of Graph: Title and Multi-Layer Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: '#3b82f6' }} />
              <div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Brand Attack Velocity & Stock Sabotage Timeline' 
                    : currentRole === ROLES.JOURNALIST_MEDIA ? 'Viral Rumor Forward Velocity Timeline' 
                    : 'National Threat Activity Timeline'}
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Filtered: <strong>{selectedChannel === 'ALL' ? 'All Channels' : selectedChannel.toUpperCase()}</strong> • Range: <strong>{timeRange}</strong> • View: <strong>{metricFilter}</strong>
                </div>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              
              {/* Chart Type Toggle: Bar / Area / Line */}
              <div style={{ display: 'flex', backgroundColor: 'var(--bg-muted, #1a1d2d)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setChartType('bar')}
                  title="Histogram Volume Bar Chart"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: chartType === 'bar' ? '#3b82f6' : 'transparent',
                    color: chartType === 'bar' ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <BarChart3 size={13} />
                </button>
                <button
                  onClick={() => setChartType('area')}
                  title="Gradient Velocity Area Chart"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: chartType === 'area' ? '#3b82f6' : 'transparent',
                    color: chartType === 'area' ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LineChartIcon size={13} />
                </button>
              </div>

              {/* Metric Mode Filter Dropdown/Pills */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { id: 'ALL', label: 'All Signals' },
                  { id: 'HIGH_RISK', label: 'High Risk (Score > 80)' },
                  { id: 'BOTNET', label: 'Bot Swarms' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMetricFilter(m.id)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: metricFilter === m.id ? 700 : 500,
                      borderRadius: '4px',
                      border: `1px solid ${metricFilter === m.id ? '#3b82f6' : 'var(--border-color)'}`,
                      backgroundColor: metricFilter === m.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-muted, #1a1d2d)',
                      color: metricFilter === m.id ? '#3b82f6' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Time Range Pills */}
              <div style={{ display: 'flex', gap: '4px', borderLeft: '1px solid var(--border-color)', paddingLeft: '8px' }}>
                {['24H', '7D', '30D', 'ALL'].map(tr => (
                  <button
                    key={tr}
                    onClick={() => setTimeRange(tr)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: timeRange === tr ? 700 : 500,
                      borderRadius: '4px',
                      border: `1px solid ${timeRange === tr ? '#10b981' : 'var(--border-color)'}`,
                      backgroundColor: timeRange === tr ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-muted, #1a1d2d)',
                      color: timeRange === tr ? '#10b981' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {tr}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Quick Metrics Bar directly above graph */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px', backgroundColor: 'var(--inner-box-bg, rgba(255,255,255,0.02))', padding: '8px 12px', borderRadius: '6px' }}>
            <span>Filtered Volume: <strong style={{ color: '#3b82f6', fontFamily: 'JetBrains Mono' }}>{graphSummary.totalVolume.toLocaleString()}</strong></span>
            <span>•</span>
            <span>High-Risk Flags: <strong style={{ color: '#ef4444', fontFamily: 'JetBrains Mono' }}>{graphSummary.totalHighRisk.toLocaleString()} ({graphSummary.riskRatio}%)</strong></span>
            <span>•</span>
            <span>Bot Swarm Bursts: <strong style={{ color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>{graphSummary.totalBotBurst.toLocaleString()}</strong></span>
            <span>•</span>
            <span>Peak Activity Interval: <strong style={{ color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>{graphSummary.peakInterval}</strong></span>
          </div>

          {/* Real Recharts Interactive Visualization */}
          <div style={{ height: '260px', width: '100%', marginTop: '4px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle" 
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} 
                  />
                  <Bar dataKey="totalSignals" name="Total Signals" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="highRisk" name="High Risk Threats" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="botnetBurst" name="Bot Swarms" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              ) : (
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle" 
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} 
                  />
                  <Area type="monotone" dataKey="totalSignals" name="Total Signals" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#totalGrad)" />
                  <Area type="monotone" dataKey="highRisk" name="High Risk Threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#highGrad)" />
                  <Line type="monotone" dataKey="botnetBurst" name="Bot Swarms" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

        </div>

        {/* Partitioned Ingestion Channels & Interactive Channel Filter */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Database size={16} style={{ color: '#10b981' }} />
              <span>Channel Filter & Breakdown</span>
            </div>
            {selectedChannel !== 'ALL' && (
              <button
                onClick={() => setSelectedChannel('ALL')}
                style={{
                  fontSize: '11px',
                  color: '#3b82f6',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Reset All
              </button>
            )}
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
            Click any channel below to filter the timeline graph strictly to that ingestion pipeline:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {personaData.sources.map((src, idx) => {
              const isSelected = selectedChannel === src.key;
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedChannel(isSelected ? 'ALL' : src.key)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? src.color : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--inner-box-bg, transparent)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: src.color, display: 'inline-block' }}></span>
                      <span style={{ color: isSelected ? 'var(--text-heading)' : 'var(--text-primary)', fontWeight: isSelected ? 700 : 500 }}>
                        {src.name}
                      </span>
                    </span>
                    <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: isSelected ? src.color : 'var(--text-primary)' }}>
                      {src.pct}
                    </span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: src.pct, height: '100%', backgroundColor: src.color, borderRadius: '9999px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Channel: <strong style={{ color: '#3b82f6' }}>{selectedChannel.toUpperCase()}</strong></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              STREAM LIVE
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ROW: PRIORITY CAMPAIGNS TABLE & REGIONAL HOTSPOTS MAP              */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '20px' }}>

        {/* Priority Campaigns Table */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <AlertOctagon size={18} style={{ color: '#ef4444' }} />
              <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Targeted Corporate Smear Campaigns' : currentRole === ROLES.JOURNALIST_MEDIA ? 'Viral Rumor Verification Queue' : 'Priority Threat Campaigns'}</span>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('campaigns')}
              className="bs-button bs-button-secondary"
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All Campaigns</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--inner-box-bg, rgba(255,255,255,0.02))', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
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
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: '#f59e0b', fontWeight: 600 }}>{cmp.aiAsst}%</td>
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
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <MapPin size={16} style={{ color: '#ec4899' }} />
            <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Asset & Port Infrastructure Nodes' : currentRole === ROLES.JOURNALIST_MEDIA ? 'Citizen Tipline Regional Nodes' : 'National Hotspot Clusters'}</span>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--inner-box-bg, rgba(0,0,0,0.2))',
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
