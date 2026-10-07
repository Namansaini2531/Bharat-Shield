import React from 'react';
import { Bot, AlertTriangle, HelpCircle } from 'lucide-react';

export default function EvidenceView() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
          AI-Assistance Evidence
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Analytical breakdown of automated generation signals.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            COORDINATION SCORE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>93</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/100</span>
          </div>
        </div>

        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            AI-ASSISTANCE LIKELIHOOD
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'JetBrains Mono' }}>81</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Component Breakdown & Operation Topology */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Component Breakdown Card */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-heading)' }}>
            Component Breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Linguistic similarity</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--accent-blue)' }}>18/20</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Template reuse</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--accent-amber)' }}>15/20</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--accent-amber)', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Cross-language variants</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--accent-blue)' }}>18/20</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Generation burst</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--accent-amber)' }}>14/20</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--accent-amber)', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Automation metadata</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>8/10</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operation Topology Quadrant */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-heading)' }}>
            Operation Topology
          </div>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--inner-box-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            position: 'relative',
            minHeight: '260px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            overflow: 'hidden'
          }}>
            {/* Axis Labels */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(-90deg)',
              fontSize: '10px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              letterSpacing: '1px'
            }}>
              COORDINATION (LOW → HIGH)
            </div>

            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              letterSpacing: '1px'
            }}>
              AI ASSISTANCE (LOW → HIGH)
            </div>

            {/* Q1: Low/High */}
            <div style={{ borderRight: '1px dashed var(--border-color)', borderBottom: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
              Low / High
            </div>

            {/* Q2: High/High */}
            <div style={{ borderBottom: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
              High / High
            </div>

            {/* Q3: Low/Low */}
            <div style={{ borderRight: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
              Low / Low
            </div>

            {/* Q4: High AI / High Coord (Highlighted Hotspot Quadrant) */}
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '12px',
              position: 'relative',
              borderRadius: '0 0 9px 0'
            }}>
              {/* Hotspot Dots */}
              <div style={{ position: 'absolute', top: '25%', left: '30%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              <div style={{ position: 'absolute', bottom: '30%', right: '25%', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              <div style={{ position: 'absolute', bottom: '45%', right: '40%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />

              <AlertTriangle size={18} style={{ color: 'var(--accent-red)', marginBottom: '4px' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-red)', textAlign: 'center', lineHeight: 1.2 }}>
                Potential AI-Amplified Coordinated Operation
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Warning Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <HelpCircle size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
        <span>
          <strong style={{ color: 'var(--text-heading)' }}>Assessment Warning:</strong> This assessment indicates possible AI assistance based on multiple signals. It does not establish proof of LLM generation.
        </span>
      </div>
    </div>
  );
}
