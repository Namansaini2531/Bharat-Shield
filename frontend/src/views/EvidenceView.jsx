import React from 'react';
import { Bot, AlertTriangle, HelpCircle } from 'lucide-react';

export default function EvidenceView() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>
          Synthetic generation evidence
        </h2>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
          Signal indicators and structural coordination metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Coordination index
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
            <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>93</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>

        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Synthetic probability
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
            <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--risk-elevated)', fontFamily: 'JetBrains Mono' }}>81</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Component Breakdown & Operation Topology */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
        
        {/* Component Breakdown Card */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-heading)' }}>
            Component breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Linguistic similarity</span>
                <span style={{ fontWeight: 500, fontFamily: 'JetBrains Mono', color: 'var(--accent-primary)' }}>18/20</span>
              </div>
              <div style={{ height: '3px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Template reuse</span>
                <span style={{ fontWeight: 500, fontFamily: 'JetBrains Mono', color: 'var(--risk-elevated)' }}>15/20</span>
              </div>
              <div style={{ height: '3px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--risk-elevated)', borderRadius: '2px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Cross-language variants</span>
                <span style={{ fontWeight: 500, fontFamily: 'JetBrains Mono', color: 'var(--accent-primary)' }}>18/20</span>
              </div>
              <div style={{ height: '3px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Generation burst</span>
                <span style={{ fontWeight: 500, fontFamily: 'JetBrains Mono', color: 'var(--risk-elevated)' }}>14/20</span>
              </div>
              <div style={{ height: '3px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--risk-elevated)', borderRadius: '2px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Automation metadata</span>
                <span style={{ fontWeight: 500, fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>8/10</span>
              </div>
              <div style={{ height: '3px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operation Topology Quadrant */}
        <div className="bs-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-heading)' }}>
            Operation topology
          </div>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-control)',
            position: 'relative',
            minHeight: '220px',
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
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono'
            }}>
              Coordination
            </div>

            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono'
            }}>
              Synthetic likelihood
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

            {/* Q4: High AI / High Coord */}
            <div style={{ 
              backgroundColor: 'var(--risk-critical-bg)', 
              border: '1px solid var(--risk-critical-border)',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '12px',
              position: 'relative'
            }}>
              {/* Hotspot Dots */}
              <div style={{ position: 'absolute', top: '25%', left: '30%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--risk-critical)' }} />
              <div style={{ position: 'absolute', bottom: '30%', right: '25%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--risk-critical)' }} />
              <div style={{ position: 'absolute', bottom: '45%', right: '40%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--risk-elevated)' }} />

              <AlertTriangle size={15} style={{ color: 'var(--risk-critical)', marginBottom: '4px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--risk-critical)', textAlign: 'center', lineHeight: 1.2 }}>
                Coordinated synthetic campaign
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Advisory Banner */}
      <div style={{
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-control)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <HelpCircle size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <span>
          Assessment indicates potential synthetic coordination based on multi-signal telemetry. Requires forensic analyst review prior to legal dispatch.
        </span>
      </div>
    </div>
  );
}
