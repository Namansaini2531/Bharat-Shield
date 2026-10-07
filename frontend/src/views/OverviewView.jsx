import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { 
  Activity, 
  AlertOctagon, 
  Database, 
  MessageSquare, 
  Bot, 
  ArrowUpRight, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Newspaper,
  TrendingDown,
  FileCheck2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function OverviewView({ onNavigate }) {
  const [timeRange, setTimeRange] = useState('7D');
  const { currentRole, currentUser, setIsAuthModalOpen } = useAuth();

  // Role-partitioned data feeds
  const getRoleDashboardData = () => {
    if (currentRole === ROLES.SYSTEM_ADMIN) {
      return {
        title: 'Super Administrator — System Architecture & Threat Grid Command',
        subtitle: 'Supreme root access: software telemetry, cluster health, cross-agency IO matrix & vector operations',
        classificationBadge: 'SUPREME ROOT / LEVEL 5+',
        classificationColor: '#10b981',
        stats: [
          { label: 'Active Cyber Campaigns', value: '17', sub: 'Cross-Border Ingestion', color: 'var(--text-heading)' },
          { label: 'Critical National Threats', value: '5', sub: 'Sec 69A Escalation Tier', color: '#ef4444', isDanger: true },
          { label: 'Raw Intercepts Ingested', value: '12,483', sub: 'Deep Web & Social Feeds', color: 'var(--text-heading)' },
          { label: 'Cluster Nodes Online', value: '4 / 4', sub: '100% Operational', color: '#10b981' },
          { label: 'Court Evidences Sealed', value: '89', sub: 'SHA-256 Block-anchored', color: '#10b981' }
        ],
        campaigns: [
          {
            id: 'CMP-007',
            title: 'Infrastructure Shutdown & Civil Unrest Narrative',
            risk: '88-94',
            coord: '93',
            aiAsst: '81',
            status: 'SEC 69A ACTIVE',
            statusColor: 'danger',
            focus: 'State-Sponsored Destabilization'
          },
          {
            id: 'CMP-011',
            title: 'Government Identity Spoofing & Phishing Matrix',
            risk: '71-83',
            coord: '65',
            aiAsst: '42',
            status: 'MONITORING',
            statusColor: 'secondary',
            focus: 'Credential Harvesting Farm'
          },
          {
            id: 'CMP-003',
            title: 'Communal Polarization Burst in Border Districts',
            risk: '52-67',
            coord: '48',
            aiAsst: '12',
            status: 'SURVEILLANCE',
            statusColor: 'secondary',
            focus: 'Cross-Border Telegram Networks'
          }
        ],
        sources: [
          { name: 'X (Twitter)', pct: '52%', color: '#3b82f6' },
          { name: 'Telegram Dark Channels', pct: '21%', color: '#f59e0b' },
          { name: 'WhatsApp Tiplines', pct: '17%', color: '#ef4444' },
          { name: 'News & Shadow Portals', pct: '10%', color: '#8c9ba5' }
        ],
        timeline: [
          { time: '00:00', count: 14, highRisk: 3 },
          { time: '04:00', count: 16, highRisk: 4 },
          { time: '08:00', count: 64, highRisk: 24 },
          { time: '12:00', count: 128, highRisk: 92 },
          { time: '16:00', count: 98, highRisk: 62 },
          { time: '20:00', count: 56, highRisk: 22 },
        ]
      };
    }

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return {
        title: 'Adani Group — Brand Defense & Market Risk Radar',
        subtitle: 'Real-time detection of coordinated corporate smear campaigns, stock sabotage & executive deepfakes',
        classificationBadge: 'ENTERPRISE TIER-1 RESTRICTED',
        classificationColor: '#f59e0b',
        stats: [
          { label: 'Active Brand Attacks', value: '4', sub: 'Targeting Energy & Ports', color: 'var(--text-heading)' },
          { label: 'High Risk Market Threats', value: '2', sub: 'Stock Volatility Risk', color: '#ef4444', isDanger: true },
          { label: 'Corporate Posts Analyzed', value: '4,892', sub: 'Across X, Telegram & Forums', color: 'var(--text-heading)' },
          { label: 'Executive Deepfakes', value: '3', sub: 'Synthetic Voice Notes', color: '#f59e0b' },
          { label: 'Sentiment Index', value: '-62%', sub: 'Targeted Smear Surge', color: '#ec4899' }
        ],
        campaigns: [
          {
            id: 'ADANI-009',
            title: 'Mundra Port Solvency & Default Smear',
            risk: '89-95',
            coord: '94',
            aiAsst: '88',
            status: 'CRITICAL',
            statusColor: 'danger',
            focus: 'Short-Seller Disinformation'
          },
          {
            id: 'ADANI-014',
            title: 'CFO Deepfake Audio on Telegram Channels',
            risk: '82-91',
            coord: '78',
            aiAsst: '96',
            status: 'INVESTIGATING',
            statusColor: 'danger',
            focus: 'Synthetic Audio Impersonation'
          },
          {
            id: 'ADANI-022',
            title: 'Green Energy Subsidiary ESG Fabrications',
            risk: '58-71',
            coord: '62',
            aiAsst: '34',
            status: 'MONITORING',
            statusColor: 'secondary',
            focus: 'Foreign NGO Narrative Botnet'
          }
        ],
        sources: [
          { name: 'X / Stocktwits', pct: '48%', color: '#3b82f6' },
          { name: 'Telegram Groups', pct: '32%', color: '#f59e0b' },
          { name: 'WhatsApp Forwards', pct: '12%', color: '#ef4444' },
          { name: 'Web / Blogs', pct: '8%', color: '#8c9ba5' }
        ],
        timeline: [
          { time: '00:00', count: 8, highRisk: 1 },
          { time: '04:00', count: 12, highRisk: 2 },
          { time: '08:00', count: 65, highRisk: 38 },
          { time: '12:00', count: 98, highRisk: 72 },
          { time: '16:00', count: 82, highRisk: 54 },
          { time: '20:00', count: 45, highRisk: 22 },
        ]
      };
    }

    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return {
        title: 'National Press Consortium — Fact-Check & Virality Monitor',
        subtitle: 'Cross-lingual rumor genealogies, viral WhatsApp forwards & pre-publication debunk verification',
        classificationBadge: 'PRESS VERIFICATION DESK',
        classificationColor: '#3b82f6',
        stats: [
          { label: 'Viral Rumors Tracked', value: '23', sub: 'Cross-Platform Spread', color: 'var(--text-heading)' },
          { label: 'Critical Debunk Priority', value: '6', sub: 'Active Public Panic', color: '#ef4444', isDanger: true },
          { label: 'Citizen Submissions', value: '842', sub: 'WhatsApp Tipline', color: 'var(--text-heading)' },
          { label: 'Multilingual Variants', value: '78', sub: 'Hindi, Hinglish, Tamil', color: '#3b82f6' },
          { label: 'AI Generative Fakes', value: '11', sub: 'Image/Voice Debunks', color: '#f59e0b' }
        ],
        campaigns: [
          {
            id: 'FACT-007',
            title: 'Nationwide Internet & UPI Blackout Rumor',
            risk: '88-94',
            coord: '93',
            aiAsst: '81',
            status: 'DEBUNK NEEDED',
            statusColor: 'danger',
            focus: 'Panic Induction / Fake Notice'
          },
          {
            id: 'FACT-011',
            title: 'Fake PM Subsidy Portal Phishing Links',
            risk: '71-83',
            coord: '65',
            aiAsst: '42',
            status: 'FACT-CHECKED',
            statusColor: 'secondary',
            focus: 'Financial Fraud Scam'
          },
          {
            id: 'FACT-033',
            title: 'Altered Video of Cyclone Damage in Coastal Zone',
            risk: '60-72',
            coord: '54',
            aiAsst: '76',
            status: 'VERIFYING',
            statusColor: 'secondary',
            focus: 'Old Footage Re-contextualized'
          }
        ],
        sources: [
          { name: 'WhatsApp Tipline', pct: '44%', color: '#ef4444' },
          { name: 'X (Twitter)', pct: '36%', color: '#3b82f6' },
          { name: 'Telegram Forwards', pct: '14%', color: '#f59e0b' },
          { name: 'Facebook Groups', pct: '6%', color: '#8c9ba5' }
        ],
        timeline: [
          { time: '00:00', count: 18, highRisk: 3 },
          { time: '04:00', count: 22, highRisk: 4 },
          { time: '08:00', count: 75, highRisk: 35 },
          { time: '12:00', count: 140, highRisk: 95 },
          { time: '16:00', count: 110, highRisk: 68 },
          { time: '20:00', count: 62, highRisk: 25 },
        ]
      };
    }

    // Default: Investigation Bureau of India (IB / Law Enforcement)
    return {
      title: 'Investigation Bureau of India — Cyber Operations Command',
      subtitle: 'National security threat matrix, foreign state-sponsored information ops & Section 69A enforcement',
      classificationBadge: 'LEVEL 5 TOP SECRET / LEA',
      classificationColor: '#ef4444',
      stats: [
        { label: 'Active Cyber Campaigns', value: '17', sub: 'Cross-Border Ingestion', color: 'var(--text-heading)' },
        { label: 'Critical National Threats', value: '5', sub: 'Sec 69A Escalation Tier', color: '#ef4444', isDanger: true },
        { label: 'Raw Intercepts Ingested', value: '12,483', sub: 'Deep Web & Social Feeds', color: 'var(--text-heading)' },
        { label: 'Proxy Bot Farms Tracked', value: '42', sub: 'Coordinated Clusters', color: '#f59e0b' },
        { label: 'Court Evidences Sealed', value: '89', sub: 'SHA-256 Block-anchored', color: '#10b981' }
      ],
      campaigns: [
        {
          id: 'CMP-007',
          title: 'Infrastructure Shutdown & Civil Unrest Narrative',
          risk: '88-94',
          coord: '93',
          aiAsst: '81',
          status: 'SEC 69A ACTIVE',
          statusColor: 'danger',
          focus: 'State-Sponsored Destabilization'
        },
        {
          id: 'CMP-011',
          title: 'Government Identity Spoofing & Phishing Matrix',
          risk: '71-83',
          coord: '65',
          aiAsst: '42',
          status: 'MONITORING',
          statusColor: 'secondary',
          focus: 'Credential Harvesting Farm'
        },
        {
          id: 'CMP-003',
          title: 'Communal Polarization Burst in Border Districts',
          risk: '52-67',
          coord: '48',
          aiAsst: '12',
          status: 'SURVEILLANCE',
          statusColor: 'secondary',
          focus: 'Cross-Border Telegram Networks'
        }
      ],
      sources: [
        { name: 'X (Twitter)', pct: '52%', color: '#3b82f6' },
        { name: 'Telegram Dark Channels', pct: '21%', color: '#f59e0b' },
        { name: 'WhatsApp Tiplines', pct: '17%', color: '#ef4444' },
        { name: 'News & Shadow Portals', pct: '10%', color: '#8c9ba5' }
      ],
      timeline: [
        { time: '00:00', count: 14, highRisk: 3 },
        { time: '04:00', count: 16, highRisk: 4 },
        { time: '08:00', count: 64, highRisk: 24 },
        { time: '12:00', count: 128, highRisk: 92 },
        { time: '16:00', count: 98, highRisk: 62 },
        { time: '20:00', count: 56, highRisk: 22 },
      ]
    };
  };

  const data = getRoleDashboardData();

  return (
    <div>
      {/* Top Tenant Clearance Banner */}
      <div style={{
        backgroundColor: `${data.classificationColor}10`,
        border: `1px solid ${data.classificationColor}30`,
        borderRadius: '10px',
        padding: '10px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: data.classificationColor,
            boxShadow: `0 0 8px ${data.classificationColor}`
          }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
            CURRENT ACCESS SCOPE: {currentUser?.roleTitle || 'Super Administrator'}
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: `${data.classificationColor}20`,
            color: data.classificationColor
          }}>
            {data.classificationBadge}
          </span>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          style={{
            background: 'transparent',
            border: `1px solid ${data.classificationColor}50`,
            borderRadius: '6px',
            color: data.classificationColor,
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Switch Organization Persona</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            {data.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {data.subtitle}
          </p>
        </div>
        <div className="bs-badge bs-badge-blue" style={{ padding: '6px 12px', fontSize: '10px' }}>
          AI INFERENCE ENGINE ACTIVE
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {data.stats.map((st, idx) => (
          <div 
            key={idx} 
            className="bs-card" 
            style={{ 
              padding: '16px',
              borderColor: st.isDanger ? 'rgba(239, 68, 68, 0.4)' : undefined,
              background: st.isDanger ? 'rgba(239, 68, 68, 0.04)' : undefined
            }}
          >
            <div style={{ color: st.isDanger ? '#ef4444' : '#8c9ba5', fontSize: '12px', fontWeight: 600 }}>
              <span>{st.label}</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: st.color, marginTop: '8px', fontFamily: 'JetBrains Mono' }}>
              {st.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {st.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Timeline Chart & Source Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Timeline Chart */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
              <Activity size={16} style={{ color: '#3b82f6' }} />
              <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Brand Attack Velocity Timeline' : 'Threat Activity Timeline'}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setTimeRange('24H')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: timeRange === '24H' ? 'var(--bg-card)' : 'transparent',
                  color: timeRange === '24H' ? 'var(--text-heading)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: timeRange === '24H' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  cursor: 'pointer'
                }}>
                24H
              </button>
              <button
                onClick={() => setTimeRange('7D')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: timeRange === '7D' ? '#2563eb' : 'transparent',
                  color: timeRange === '7D' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                7D
              </button>
            </div>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#576575" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', color: 'var(--text-heading)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="highRisk" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution Card */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} style={{ color: '#06b6d4' }} />
            <span>Partitioned Ingestion Sources</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {data.sources.map((src, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: src.color, display: 'inline-block' }}></span>
                    <span>{src.name}</span>
                  </span>
                  <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono' }}>{src.pct}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: src.pct, height: '100%', backgroundColor: src.color, borderRadius: '9999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row: Priority Campaigns Table & Regional Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Table Card */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} style={{ color: '#ef4444' }} />
            <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Targeted Corporate Disinformation Campaigns' : 'Priority Threat Campaigns'}</span>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>ID</th>
                  <th style={{ padding: '10px 14px' }}>NARRATIVE FOCUS</th>
                  <th style={{ padding: '10px 14px' }}>RISK RANGE</th>
                  <th style={{ padding: '10px 14px' }}>COORD.</th>
                  <th style={{ padding: '10px 14px' }}>AI ASST.</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((cmp, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < data.campaigns.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{cmp.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{cmp.title}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{cmp.focus}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{cmp.risk}</span>
                        <div style={{ width: '50px', height: '4px', backgroundColor: '#ef4444', borderRadius: '9999px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>{cmp.coord}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: '#f59e0b', fontWeight: 600 }}>{cmp.aiAsst}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onNavigate && onNavigate('campaigns')}
                        className={`bs-button bs-button-${cmp.statusColor}`}
                        style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}>
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
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} style={{ color: '#ec4899' }} />
            <span>{currentRole === ROLES.CORPORATE_ENTERPRISE ? 'Asset & Financial Center Hotspots' : 'Cross-Regional Hotspots'}</span>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--inner-box-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px',
            overflow: 'hidden'
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              opacity: 0.6
            }} />

            {/* Glowing Hotspots */}
            <div style={{ position: 'absolute', top: '35%', left: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-pulse-slow" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 12px #ef4444' }} />
              <span style={{ fontSize: '9px', color: '#fca5a5', marginTop: '2px', fontWeight: 600 }}>
                {currentRole === ROLES.CORPORATE_ENTERPRISE ? 'MUNDRA / GUJ' : 'DELHI / NCR'}
              </span>
            </div>

            <div style={{ position: 'absolute', top: '60%', left: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-pulse-slow" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
              <span style={{ fontSize: '9px', color: '#fde68a', marginTop: '2px', fontWeight: 600 }}>
                {currentRole === ROLES.CORPORATE_ENTERPRISE ? 'BSE / MUMBAI' : 'MUMBAI'}
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: '25%', right: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-pulse-slow" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
              <span style={{ fontSize: '9px', color: '#fca5a5', marginTop: '2px', fontWeight: 600 }}>
                {currentRole === ROLES.CORPORATE_ENTERPRISE ? 'KHAVDA ENERGY' : 'BENGALURU'}
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ fontSize: '10px', color: '#8c9ba5' }}>LIVE TRACKING</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
