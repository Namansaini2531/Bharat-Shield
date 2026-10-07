import React, { useState } from 'react';
import { FileText, Download, Check, ShieldAlert, Sparkles } from 'lucide-react';

export default function ReportGeneratorView() {
  const [sections, setSections] = useState({
    executiveSummary: true,
    sourceAnalysis: true,
    narrativeEvolution: true,
    coordinationEvidence: true,
    aiEvidence: false,
    threatAssessment: true,
    blockchainIntegrity: true,
    analystActions: false,
  });

  const [format, setFormat] = useState('PDF');

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>
            REPORT GENERATOR
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            Intelligence Report
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Configure and generate official operational dossier for Campaign C007.
          </p>
        </div>
      </div>

      {/* Main Grid: Document Preview & Configuration Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Live Document Preview */}
        <div className="bs-card" style={{ padding: '24px', backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', position: 'relative' }}>
          
          {/* Top Bar Preview Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
              PREVIEW_RENDER_V1.2 // SECURE_VIEW
            </div>
          </div>

          {/* Dossier Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', margin: 0, letterSpacing: '0.5px' }}>
                BHARAT-SHIELD
              </h1>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>
                Campaign Intelligence Report
              </div>
            </div>

            <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div>DOC_ID: RPT-C007-992</div>
              <div>DATE: 2026-08-21T14:00Z</div>
            </div>
          </div>

          {/* Threat Metric Grid in Report */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '12px', 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Campaign</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>C007</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Classification</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>CONFIDENTIAL // LEA</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Threat Level</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                88–94 <span className="bs-badge bs-badge-red" style={{ fontSize: '9px' }}>HIGH</span>
              </div>
            </div>
          </div>

          {/* Section I: Executive Summary */}
          {sections.executiveSummary && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '8px', borderLeft: '3px solid #3b82f6', paddingLeft: '8px' }}>
                I. Executive Summary
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Potential coordinated cross-platform information operation involving multilingual narrative variants identified operating within sector 4. Analysis indicates highly sophisticated evasion techniques utilizing compromised residential proxies and AI-generated linguistic structures to bypass standard NLP detection parameters. The operation's primary objective appears to be the erosion of institutional trust prior to upcoming fiscal announcements.
              </p>
            </div>
          )}

          {/* Section II: Network Topography Placeholder */}
          {sections.sourceAnalysis && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '8px', borderLeft: '3px solid #3b82f6', paddingLeft: '8px' }}>
                II. Network Topography
              </div>
              <div style={{ 
                height: '140px', 
                backgroundColor: 'var(--bg-card)', 
                border: '1px dashed var(--border-color)', 
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono'
              }}>
                [ GRAPH_RENDER_AREA // VECTOR_MAP_READY ]
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Configuration Controls Sidebar */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <FileText size={16} style={{ color: '#3b82f6' }} />
            <span>Report Configuration</span>
          </div>

          {/* Sections Toggle List */}
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            Include Sections
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', flex: 1 }}>
            {[
              { id: 'executiveSummary', label: 'Executive Summary' },
              { id: 'sourceAnalysis', label: 'Source Analysis' },
              { id: 'narrativeEvolution', label: 'Narrative Evolution' },
              { id: 'coordinationEvidence', label: 'Coordination Evidence' },
              { id: 'aiEvidence', label: 'AI-Assistance Evidence' },
              { id: 'threatAssessment', label: 'Threat Assessment' },
              { id: 'blockchainIntegrity', label: 'Blockchain Evidence Integrity' },
              { id: 'analystActions', label: 'Analyst Actions' },
            ].map((sec) => (
              <div
                key={sec.id}
                onClick={() => toggleSection(sec.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 12px',
                  backgroundColor: 'var(--inner-box-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: sections[sec.id] ? 'var(--text-heading)' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{sec.label}</span>
                <div style={{
                  width: '30px',
                  height: '18px',
                  borderRadius: '9999px',
                  backgroundColor: sections[sec.id] ? '#3b82f6' : 'var(--bg-muted)',
                  position: 'relative',
                  transition: 'background-color 0.15s ease'
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '2px',
                    left: sections[sec.id] ? '14px' : '2px',
                    transition: 'left 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Export Format Options */}
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Export Format
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '20px' }}>
            {['PDF', 'JSON (STIX)', 'CSV'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                style={{
                  padding: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: format === fmt ? '#3b82f6' : 'var(--inner-box-bg)',
                  color: format === fmt ? '#fff' : 'var(--text-secondary)',
                  border: format === fmt ? '1px solid #60a5fa' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Download Action Button */}
          <button className="bs-button bs-button-primary" style={{ width: '100%', gap: '8px', padding: '12px', fontSize: '13px' }}>
            <Download size={16} /> Generate {format} Report
          </button>
          
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
            Generation will automatically log to Audit Ledger.
          </div>
        </div>

      </div>
    </div>
  );
}
