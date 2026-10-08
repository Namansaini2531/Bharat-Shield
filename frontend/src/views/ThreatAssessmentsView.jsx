import React from 'react';
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
  Terminal
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function ThreatAssessmentsView() {
  const { currentRole, currentUser } = useAuth();

  const getRoleThreatData = () => {
    if (currentRole === ROLES.SYSTEM_ADMIN) {
      return {
        campaignId: 'CMP-ROOT-001',
        title: 'Master Cyber Operations & IO Counter-Measures Grid',
        category: 'SUPREME ROOT COMMAND // ARCHITECTURE INTEGRITY',
        threatScore: '92–96',
        threatColor: '#10b981',
        threatLabel: 'CRITICAL',
        meterWidth: '94%',
        confidence: 'VERY HIGH (98.4%)',
        breakdown: [
          { name: 'Semantic vector cluster density (LaBSE/MiniLM)', score: '24.5/25', pct: '98%', color: '#3b82f6' },
          { name: 'Cross-platform relay synchronicity (X, TG, WA)', score: '19.2/20', pct: '96%', color: '#f59e0b' },
          { name: 'Temporal propagation burst window (< 15 mins)', score: '18.5/20', pct: '92%', color: '#f59e0b' },
          { name: 'Multilingual mutation & translation drift', score: '14.2/15', pct: '95%', color: '#3b82f6' },
          { name: 'Synthetic AI text & media signature detection', score: '13.8/15', pct: '92%', color: '#10b981' },
          { name: 'Adversary TTP template fingerprint reuse', score: '8.8/10', pct: '88%', color: '#8c9ba5' }
        ],
        checklist: [
          { title: '4 Independent Master Ingestion Nodes Verified', desc: 'Continuous stream validated across X, Telegram, Reddit, and WhatsApp.' },
          { title: 'Cross-Regional Dialect Seeding Detected', desc: 'Simultaneous deployment in HI, EN, TE, and TA within 90 minutes.' },
          { title: 'Cryptographic Merkle Root Verified', desc: 'SHA-256 evidence package anchored on EVM Polygon notary contract.' },
          { title: 'Sub-minute Temporal Blast Radius', desc: 'Over 840 synthetic nodes synchronized across cloud VPS ranges.' }
        ]
      };
    }

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return {
        campaignId: 'CMP-TATA-009',
        title: 'Tata Motors EV & TCS Coordinated Disinformation Swarm',
        category: 'MARKET MANIPULATION & BRAND DEFENSE RADAR',
        threatScore: '89–93',
        threatColor: '#f59e0b',
        threatLabel: 'HIGH RISK',
        meterWidth: '91%',
        confidence: 'HIGH (94.2%)',
        breakdown: [
          { name: 'Pre-Market opening burst timing correlation', score: '23.8/25', pct: '95%', color: '#f59e0b' },
          { name: 'Cross-platform short-seller swarm activation', score: '18.8/20', pct: '94%', color: '#f59e0b' },
          { name: 'Counterfeit video thermal smoke artifact detection', score: '18.2/20', pct: '91%', color: '#ef4444' },
          { name: 'Cloned executive voice acoustic anomaly score', score: '14.0/15', pct: '93%', color: '#ef4444' },
          { name: 'Fake hiring freeze notice template reuse', score: '13.2/15', pct: '88%', color: '#3b82f6' },
          { name: 'Social sentiment distortion index', score: '8.5/10', pct: '85%', color: '#8c9ba5' }
        ],
        checklist: [
          { title: 'BMS Telemetry Verified Authentic', desc: 'Zero defect logs recorded across connected fleet databases.' },
          { title: 'Deepfake Audio Synthesis Confirmed', desc: 'AI voice classifier identified synthetic vocal cloning signatures.' },
          { title: 'SEBI Regulation 30 Trigger Threshold Met', desc: 'Disinformation velocity warrants immediate exchange disclosure.' },
          { title: 'Legal Evidence Package Sealed', desc: 'Offending accounts preserved with immutable blockchain timestamp.' }
        ]
      };
    }

    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return {
        campaignId: 'FACT-007',
        title: 'Nationwide Telecom & Power Blackout Rumor Genealogies',
        category: 'PUBLIC FACT-CHECK & CITIZEN DEBUNK DESK',
        threatScore: '86–90',
        threatColor: '#3b82f6',
        threatLabel: 'VIRAL SPIKE',
        meterWidth: '89%',
        confidence: 'HIGH (96.0%)',
        breakdown: [
          { name: 'WhatsApp Forward Velocity Multiplier (4.2x)', score: '24.0/25', pct: '96%', color: '#3b82f6' },
          { name: 'Multi-lingual regional mutation (HI, MR, BN, TA)', score: '19.0/20', pct: '95%', color: '#3b82f6' },
          { name: 'Citizen panic withdrawal trigger language', score: '17.8/20', pct: '89%', color: '#ef4444' },
          { name: 'Forged Department of Telecom letterhead detection', score: '14.5/15', pct: '97%', color: '#10b981' },
          { name: 'Citizen tipline corroboration volume', score: '13.5/15', pct: '90%', color: '#f59e0b' },
          { name: 'Historical blackout hoax template recycling', score: '8.0/10', pct: '80%', color: '#8c9ba5' }
        ],
        checklist: [
          { title: 'Department of Telecom (DoT) Verified Denial', desc: 'Official spokesperson confirmed no blackout order exists.' },
          { title: 'Cloned PDF Gazette Watermark Detected', desc: 'Font kerning and digital artifacts prove amateur PDF forgery.' },
          { title: 'Multilingual Debunk Cards Formatted', desc: 'Shareable graphic assets pre-generated in 4 regional languages.' },
          { title: 'IFCN Standard Compliance Verified', desc: 'Fact-check methodology meets international verification protocols.' }
        ]
      };
    }

    // Default: Investigation Bureau of India (IB / LEA)
    return {
      campaignId: 'CMP-007',
      title: 'Coordinated Disinformation Vector: Operation Echo',
      category: 'NATIONAL SECURITY // CRITICAL INFRASTRUCTURE DEFENSE',
      threatScore: '88–94',
      threatColor: '#ef4444',
      threatLabel: 'CRITICAL',
      meterWidth: '94%',
      confidence: 'HIGH (96.5%)',
      breakdown: [
        { name: 'Narrative coordination across hostile APT groups', score: '24.0/25', pct: '96%', color: '#ef4444' },
        { name: 'Cross-platform propagation speed (X, TG, WA)', score: '19.0/20', pct: '95%', color: '#f59e0b' },
        { name: 'Temporal burst concentration window (< 10m)', score: '17.5/20', pct: '88%', color: '#f59e0b' },
        { name: 'Multilingual cross-border dialect mutation', score: '14.0/15', pct: '93%', color: '#3b82f6' },
        { name: 'AI generative assistance text markers', score: '12.8/15', pct: '85%', color: '#8c9ba5' },
        { name: 'Historical adversary TTP template matching', score: '8.2/10', pct: '82%', color: '#8c9ba5' }
      ],
      checklist: [
        { title: '4 Distinct Hostile Infrastructure Clusters Confirmed', desc: 'Origin nodes identified across known foreign proxy ranges.' },
        { title: 'Multilingual Rapid Dialect Seeding (HI, EN, TA)', desc: 'Simultaneous coordinated payload drops across regional channels.' },
        { title: 'Section 69A IT Act Statutory Grounds Satisfied', desc: 'Direct threat to public order and sovereignty documented.' },
        { title: 'High Temporal Synchronization (> 96%)', desc: 'Automated botnet burst proven by sub-second API timestamps.' }
      ]
    };
  };

  const data = getRoleThreatData();

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.3px', margin: 0 }}>
          Explainable Threat Assessment
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Automated multi-signal algorithmic breakdown of identified cognitive manipulation vectors for {currentUser?.roleTitle || 'Threat Intelligence'}.
        </p>
      </div>

      {/* Top Threat Banner */}
      <div className="bs-card" style={{ 
        padding: '24px', 
        marginBottom: '20px',
        backgroundColor: 'var(--bg-card)',
        backgroundImage: `linear-gradient(90deg, ${data.threatColor}15 0%, transparent 60%)`,
        borderLeft: `4px solid ${data.threatColor}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="bs-badge bs-badge-blue" style={{ fontSize: '11px', fontWeight: 700 }}>
                {data.campaignId}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: data.threatColor,
                backgroundColor: `${data.threatColor}15`,
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${data.threatColor}30`,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Check size={12} /> CONFIDENCE: {data.confidence}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '10px', letterSpacing: '-0.4px' }}>
              {data.title}
            </h3>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.5px' }}>
              {data.category}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              THREAT INDEX
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: data.threatColor, fontFamily: 'JetBrains Mono' }}>
              {data.threatScore} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/100</span>
            </div>

            {/* Slider meter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LOW</span>
              <div style={{ width: '110px', height: '5px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: data.meterWidth, height: '100%', backgroundColor: data.threatColor, borderRadius: '9999px' }} />
              </div>
              <span style={{ fontSize: '10px', color: data.threatColor, fontWeight: 700 }}>{data.threatLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Evidentiary Breakdown & Explainability Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Evidentiary Breakdown */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} style={{ color: '#3b82f6' }} />
            <span>Evidentiary Multi-Signal Breakdown</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.breakdown.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: item.color }}>{item.score}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: item.pct, height: '100%', backgroundColor: item.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Checklist */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span>Forensic Explainability Checklist</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.checklist.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
