import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  Radio, 
  X, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Play, 
  Sparkles,
  Camera,
  RefreshCw
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

export default function LiveIntelView({ onNavigate }) {
  const [fileStaged, setFileStaged] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const { isConnected, liveSignals, stats, triggerSimulationBurst } = useWebSocket();
  const [simulating, setSimulating] = useState(false);

  const handleAnalyzeDataset = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisDone(true);
      setTimeout(() => setAnalysisDone(false), 4000);
    }, 2000);
  };

  const handleSimulateBurst = async () => {
    setSimulating(true);
    await triggerSimulationBurst(3);
    setTimeout(() => setSimulating(false), 800);
  };

  return (
    <div>
      {/* Page Title Header with Live WebSocket Telemetry Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            Intelligence Ingestion & Live Stream
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time multimodal ingestion, automated vectorization, and live socket signal triage.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* WebSocket Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '9999px',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono',
            color: isConnected ? '#10b981' : '#ef4444'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              boxShadow: isConnected ? '0 0 8px #10b981' : 'none'
            }} />
            <span>{isConnected ? 'LIVE WEBSOCKET STREAMING' : 'OFFLINE // RECONNECTING'}</span>
          </div>

          <button
            onClick={handleSimulateBurst}
            disabled={simulating}
            className="bs-button bs-button-primary"
            style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
          >
            <Zap size={14} className={simulating ? "animate-pulse" : ""} />
            <span>{simulating ? 'Injecting Burst...' : 'Simulate Live Intercepts'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '20px' }}>
        
        {/* Left Column: Platform Dataset Import & Pipeline Staging */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Drag & Drop Import Card */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Upload size={16} style={{ color: '#3b82f6' }} />
              <span>Multimodal Dataset Batch Ingest</span>
            </div>

            <div style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '32px', 
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
                Drag and drop 20K Instagram / Reddit / Twitter JSONL datasets
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Automated OCR text extraction, Whisper ASR audio demuxing, and 384-dim vector embeddings
              </div>

              <button className="bs-button bs-button-secondary" style={{ marginTop: '16px', fontSize: '12px', padding: '8px 16px' }}>
                Select File System Dataset
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
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>instagram_20k_dataset.jsonl & reddit_20k_dataset.jsonl</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ready for Multilingual Vectorization • 92.4 MB Total</div>
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
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingested Signals</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>40,000+</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modalities</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>Text, OCR, ASR</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Embeddings Model</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#3b82f6', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>MiniLM 384d</div>
                </div>
              </div>

              {/* Pipeline Staging Checklist */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Processing Stages
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Schema Normalization</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Language ID (Indic + English)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Multimodal OCR & Whisper ASR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Entity & Claim Extractor</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>Vector Embedding (pgvector)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                  <span>HDBSCAN Narrative Clustering</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  onClick={handleAnalyzeDataset}
                  disabled={analyzing}
                  className="bs-button bs-button-primary" 
                  style={{ gap: '8px', fontSize: '12px', padding: '10px 18px' }}
                >
                  <Sparkles size={14} /> 
                  <span>{analyzing ? 'Processing Vectors & Clusters...' : analysisDone ? '✓ Clustering Synchronized' : 'Execute Full Batch Clustering'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live WebSocket Incoming Signal Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Live Channels Counter Overview */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Radio size={16} style={{ color: '#10b981' }} />
              <span>Live Ingestion Telemetry</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
              Active channels streaming live intercepts into the Sentinel triage pipeline.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={13} style={{ color: '#10b981' }} /> WhatsApp Tipline
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                  {stats.todayWhatsApp}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={13} style={{ color: '#3b82f6' }} /> Telegram Tipline
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                  {stats.todayTelegram}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={13} style={{ color: '#ec4899' }} /> Instagram Harvester
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                  {stats.todayInstagram}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={13} style={{ color: '#f59e0b' }} /> Reddit Streamer
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                  {stats.todayReddit}
                </div>
              </div>
            </div>

            {/* Live Socket Feed List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Real-Time Socket Intercepts ({liveSignals.length})
              </span>
              <span style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} className="animate-pulse" />
                STREAM ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {liveSignals.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  Listening for incoming signals from Telegram, WhatsApp, and social crawlers...
                </div>
              ) : (
                liveSignals.map((sig, idx) => (
                  <div 
                    key={sig.id || idx}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: `1px solid ${sig.threat_score >= 80 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="bs-badge" style={{
                        fontSize: '9px',
                        backgroundColor: sig.platform === 'whatsapp' ? 'rgba(16, 185, 129, 0.15)' : sig.platform === 'telegram' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                        color: sig.platform === 'whatsapp' ? '#10b981' : sig.platform === 'telegram' ? '#3b82f6' : '#ec4899',
                        textTransform: 'uppercase'
                      }}>
                        {sig.platform}
                      </span>

                      <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: sig.threat_score >= 80 ? '#ef4444' : 'var(--text-secondary)' }}>
                        Threat: {sig.threat_score || 75}/100
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-heading)', lineHeight: 1.4, marginBottom: '6px' }}>
                      {sig.raw_payload || sig.text}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                      <span>{sig.id}</span>
                      <span>{new Date(sig.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => onNavigate && onNavigate('tipline')}
              className="bs-button bs-button-secondary" 
              style={{ width: '100%', gap: '8px', fontSize: '12px', padding: '10px', marginTop: '16px' }}>
              <span>Open Dedicated Tipline Console</span>
              <ArrowRight size={14} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
