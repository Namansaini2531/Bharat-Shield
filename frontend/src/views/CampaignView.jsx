import React from 'react';
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
  Server 
} from 'lucide-react';

export default function CampaignView() {
  return (
    <div>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            INVESTIGATION WORKSPACE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
              Campaign Intelligence Graph
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', padding: '3px 10px', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '9999px' }}>
              Target: Infrastructure
            </span>
            <span className="bs-badge bs-badge-red">
              Status: ACTIVE
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Internet Shutdown Narrative
          </p>
        </div>

        <div className="bs-badge bs-badge-red" style={{ padding: '8px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '9999px' }}>
          <AlertTriangle size={14} />
          <span>HIGH PRIORITY — INVESTIGATION REQUIRED</span>
        </div>
      </div>

      {/* Top Metric Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Metric 1 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            OVERALL THREAT
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono' }}>88-94</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>range</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '90%', height: '100%', backgroundColor: '#ef4444', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            COORDINATION LEVEL
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>93</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '93%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AI GEN-PROBABILITY
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>81</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '81%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            CROSS-PLATFORM SYNC
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>89</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '89%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '9999px' }} />
          </div>
        </div>

      </div>

      {/* Main Investigation Row: Propagation Topology Map & Investigation Vectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Graph Card */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={16} style={{ color: '#06b6d4' }} />
              <span>Propagation Topology Map</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="bs-button bs-button-secondary" style={{ padding: '6px 10px', fontSize: '11px', gap: '6px' }}>
                <Download size={12} /> Export Data
              </button>
              <button className="bs-button bs-button-secondary" style={{ padding: '6px 10px', fontSize: '11px', gap: '6px' }}>
                <ZoomIn size={12} /> Zoom
              </button>
            </div>
          </div>

          {/* Interactive Topology Graph Area */}
          <div style={{ 
            flex: 1, 
            minHeight: '360px', 
            backgroundColor: 'var(--inner-box-bg)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              opacity: 0.25
            }} />

            {/* SVG Connecting lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {/* Center to X */}
              <line x1="50%" y1="50%" x2="28%" y2="30%" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Center to Telegram */}
              <line x1="50%" y1="50%" x2="72%" y2="25%" stroke="#3b82f6" strokeWidth="1.5" />
              {/* Center to WhatsApp */}
              <line x1="50%" y1="50%" x2="28%" y2="75%" stroke="#f59e0b" strokeWidth="1.5" />
              {/* Center to News */}
              <line x1="50%" y1="50%" x2="72%" y2="75%" stroke="var(--border-color)" strokeWidth="1.5" />
            </svg>

            {/* Center Hub Node */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: '94px',
              height: '94px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid #ef4444',
              boxShadow: '0 0 24px rgba(239, 68, 68, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3
            }}>
              <Radio size={20} style={{ color: '#ef4444' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px', color: 'var(--text-heading)' }}>CAMPAIGN</span>
              <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 800 }}>#007</span>
            </div>

            {/* Node 1: X / Twitter */}
            <div style={{ 
              position: 'absolute', 
              top: '15%', 
              left: '18%',
              width: '160px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-heading)' }}># X / TWITTER</span>
                <span style={{ fontSize: '10px', backgroundColor: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>143</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Lang: HI, EN</div>
              <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600, marginTop: '2px' }}>Bot Activity: 92%</div>
            </div>

            {/* Node 2: Telegram */}
            <div style={{ 
              position: 'absolute', 
              top: '15%', 
              right: '18%',
              width: '160px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid #3b82f6',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-heading)' }}>✈ TELEGRAM</span>
                <span style={{ fontSize: '10px', backgroundColor: '#3b82f6', color: '#fff', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>31</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Lang: UR, EN</div>
              <div style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 600, marginTop: '2px' }}>Forward Rate: High</div>
            </div>

            {/* Node 3: WhatsApp */}
            <div style={{ 
              position: 'absolute', 
              bottom: '15%', 
              left: '18%',
              width: '160px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid #f59e0b',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-heading)' }}>💬 WHATSAPP</span>
                <span style={{ fontSize: '10px', backgroundColor: '#f59e0b', color: '#000', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>22</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Lang: Regional</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Media Type: Video/Audio</div>
            </div>

            {/* Node 4: Fringe News */}
            <div style={{ 
              position: 'absolute', 
              bottom: '15%', 
              right: '18%',
              width: '160px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-heading)' }}>📰 FRINGE NEWS</span>
                <span style={{ fontSize: '10px', backgroundColor: 'var(--bg-muted)', color: 'var(--text-primary)', padding: '1px 6px', borderRadius: '9999px', fontWeight: 600 }}>8</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Index Status: Unverified</div>
            </div>

          </div>
        </div>

        {/* Right Vectors Sidebar */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-heading)' }}>
            Investigation Vectors
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            System AI flagged <strong style={{ color: 'var(--text-heading)' }}>CAMPAIGN #007</strong> based on synchronous cross-platform payload delivery and abnormal linguistic homogeneity.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            
            {/* Vector 1 */}
            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} style={{ color: '#ef4444' }} /> Temporal Coordination
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                143 primary posts injected onto X/Twitter within a 4-minute window. Statistically impossible for organic user behavior.
              </p>
              <div className="bs-badge bs-badge-red" style={{ marginTop: '8px', fontSize: '9px', borderRadius: '9999px' }}>
                Confidence: 99%
              </div>
            </div>

            {/* Vector 2 */}
            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Languages size={14} style={{ color: '#f59e0b' }} /> Linguistic Homogeneity
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                Textual analysis shows 81% exact-match phrases across regional WhatsApp variants, indicating central translation before distribution.
              </p>
            </div>

            {/* Vector 3 */}
            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Server size={14} style={{ color: '#3b82f6' }} /> Infrastructure Overlap
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                3 Telegram channels and 2 Fringe News domains resolve to a known bulletproof hosting subnet previously associated with APT-42.
              </p>
            </div>

          </div>

          <button className="bs-button bs-button-primary" style={{ width: '100%', marginTop: '16px', fontSize: '12px', padding: '10px' }}>
            GENERATE BRIEFING REPORT
          </button>
        </div>

      </div>

      {/* Bottom Table: Initial Seed Nodes */}
      <div className="bs-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>Initial Seed Nodes (Top 3)</div>
          <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Live tracking active
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '10px 12px' }}>Account / Asset ID</th>
                <th style={{ padding: '10px 12px' }}>Platform</th>
                <th style={{ padding: '10px 12px' }}>Impact Score</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Time Detected</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#ef4444', fontWeight: 600 }}>@AnonOp_RegionX</td>
                <td style={{ padding: '12px', color: 'var(--text-heading)' }}>X / Twitter</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#ef4444', fontWeight: 700 }}>98.4</td>
                <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>14:02:11 UTC</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#60a5fa', fontWeight: 600 }}>t.me/Truth_Network_HQ</td>
                <td style={{ padding: '12px', color: 'var(--text-heading)' }}>Telegram</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#60a5fa', fontWeight: 700 }}>85.1</td>
                <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>14:03:45 UTC</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#f59e0b', fontWeight: 600 }}>WA_Group_Hash_992A</td>
                <td style={{ padding: '12px', color: 'var(--text-heading)' }}>WhatsApp</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#f59e0b', fontWeight: 700 }}>72.0</td>
                <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>14:15:00 UTC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

