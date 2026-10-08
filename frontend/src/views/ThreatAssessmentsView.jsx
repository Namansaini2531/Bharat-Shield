import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, FileText, Check } from 'lucide-react';

export default function ThreatAssessmentsView() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
          Explainable Threat Assessment
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Automated algorithmic breakdown of identified cognitive manipulation vectors.
        </p>
      </div>

      {/* Top Threat Banner */}
      <div className="bs-card" style={{ 
        padding: '24px', 
        marginBottom: '20px',
        backgroundColor: 'var(--bg-card)',
        backgroundImage: 'linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, transparent 60%)',
        borderLeft: '4px solid #ef4444'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="bs-badge bs-badge-blue" style={{ fontSize: '10px' }}>
                CAMPAIGN #007
              </span>
              <span className="bs-badge bs-badge-red" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> CONFIDENCE: HIGH
              </span>
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '10px', letterSpacing: '-0.5px' }}>
              Coordinated Disinformation Vector: Operation Echo
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              THREAT LEVEL
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono' }}>
              88–94 <span style={{ fontSize: '14px', color: '#8c9ba5' }}>/100</span>
            </div>

            {/* Slider meter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LOW</span>
              <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: '#ef4444', borderRadius: '9999px' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>CRITICAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Evidentiary Breakdown & Explainability Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Evidentiary Breakdown */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} style={{ color: '#3b82f6' }} />
            <span>Evidentiary Breakdown</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Narrative coordination</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: '#60a5fa' }}>24/25</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Cross-platform propagation</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>19/20</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Temporal burst</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>17/20</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Multilingual mutation</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: '#60a5fa' }}>14/15</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '93%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>AI-assistance evidence</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: '#8c9ba5' }}>12/15</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', backgroundColor: '#8c9ba5', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Historical template reuse</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', color: '#8c9ba5' }}>8/10</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', backgroundColor: '#8c9ba5', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Explainability Checklist */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span>Explainability Checklist</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Checklist Item 1 */}
            <div style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>4 Distinct Sources Confirmed</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Origin nodes identified across independent infrastructure networks.
                </div>
              </div>
            </div>

            {/* Checklist Item 2 */}
            <div style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>Multilingual Rapid Appearance</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Simultaneous translation deployment in HI, EN, and TA within 2 hours.
                </div>
              </div>
            </div>

            {/* Checklist Item 3 */}
            <div style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>Persistent Templates</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Syntactic structures match known adversary TTPs from previous quarters.
                </div>
              </div>
            </div>

            {/* Checklist Item 4 */}
            <div style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>High Temporal Concentration</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  85% of volume generated within a narrow 45-minute tactical window.
                </div>
              </div>
            </div>

            {/* Checklist Item 5 */}
            <div style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>Possible AI Paraphrasing</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Low linguistic perplexity scores indicate LLM-assisted generation.
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
