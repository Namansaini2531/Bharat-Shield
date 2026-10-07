import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Clock, ArrowRight, MessageSquare, Send, Radio, X } from 'lucide-react';

export default function LiveIntelView({ onNavigate }) {
  const [fileStaged, setFileStaged] = useState(true);

  return (
    <div>
      {/* Page Title Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
          Intelligence Ingestion
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Ingest, normalize, and extract tactical insights from raw datasets and live feeds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Platform Dataset Import & Pipeline Staging */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Drag & Drop Import Card */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Upload size={16} style={{ color: '#3b82f6' }} />
              <span>Platform Dataset Import</span>
            </div>

            <div style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '36px', 
              textAlign: 'center',
              backgroundColor: 'var(--inner-box-bg)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                marginBottom: '14px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Upload size={22} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>
                Drag and drop CSV/JSON files here
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Max file size: 5GB per dataset • Automated entity tagging
              </div>

              <button className="bs-button bs-button-secondary" style={{ marginTop: '16px', fontSize: '12px', padding: '8px 16px' }}>
                Browse Files
              </button>
            </div>
          </div>

          {/* Staging Pipeline Card */}
          {fileStaged && (
            <div className="bs-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', color: '#60a5fa', border: '1px solid var(--border-color)' }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>twitter_campaign_dataset.csv</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ready for processing • 14.2 MB</div>
                  </div>
                </div>

                <button 
                  onClick={() => setFileStaged(false)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Data Summary Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '12px', 
                padding: '14px', 
                backgroundColor: 'var(--inner-box-bg)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Records</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>10,000</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Columns Detected</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>8</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Languages</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>3 Identified</div>
                </div>
              </div>

              {/* Pipeline Staging Checklist */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Pipeline Staging
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Schema Validation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Language ID</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Duplicate Normalization</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Entity Extraction</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Embedding Generation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Narrative Clustering</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="bs-button bs-button-primary" style={{ gap: '8px', fontSize: '12px', padding: '10px 18px' }}>
                  <FileText size={14} /> Analyze Dataset
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Tipline Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Radio size={16} style={{ color: '#10b981' }} />
              <span>Live Tipline Channels</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.4 }}>
              Voluntary user-submitted suspicious content is converted into structured intelligence records.
            </p>

            {/* WhatsApp Card */}
            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '14px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                  <MessageSquare size={16} style={{ color: '#10b981' }} />
                  WhatsApp Tipline
                </span>
                <span className="bs-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '9px', borderRadius: '9999px', padding: '2px 8px' }}>
                  ● CONNECTED
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)' }}>238</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>submissions today</span>
              </div>
            </div>

            {/* Telegram Card */}
            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                  <Send size={16} style={{ color: '#3b82f6' }} />
                  Telegram Tipline
                </span>
                <span className="bs-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '9px', borderRadius: '9999px', padding: '2px 8px' }}>
                  ● CONNECTED
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)' }}>147</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>submissions today</span>
              </div>
            </div>

            <button 
              onClick={() => onNavigate && onNavigate('tipline')}
              className="bs-button bs-button-secondary" 
              style={{ width: '100%', gap: '8px', fontSize: '12px', padding: '10px' }}>
              <span>View Submissions</span>
              <ArrowRight size={14} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

