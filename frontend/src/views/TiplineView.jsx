import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Mic, 
  AlertTriangle, 
  Bookmark, 
  MoreVertical, 
  Copy, 
  ExternalLink, 
  Check, 
  RefreshCw,
  Radio,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

const baselineSignals = [
  {
    id: 'WA-000231',
    source: 'WhatsApp',
    sourceIcon: MessageSquare,
    time: '09:14',
    status: 'Matched Campaign #007',
    tag: 'Hinglish',
    statusType: 'danger',
    payload: 'Government kal internet band karne wali hai. Sabko immediately forward karo.',
    detectedLang: 'Hinglish',
    confidence: '97%',
    intent: 'Panic Induction',
    severity: 'High Severity',
    translation: 'Government is going to shut down the internet tomorrow. Forward to everyone immediately.',
    correlationMatch: '94%',
    campaignMatch: 'Campaign #007 (Telecom Disruption Hoax)'
  },
  {
    id: 'TG-004192',
    source: 'Telegram',
    sourceIcon: Send,
    time: '09:11',
    status: 'Processing Triage...',
    tag: 'Hindi',
    statusType: 'neutral',
    payload: 'सरकार द्वारा इंटरनेट निलंबन का आधिकारिक नोटिस जारी किया गया है।',
    detectedLang: 'Hindi',
    confidence: '99%',
    intent: 'Official Disinformation',
    severity: 'Medium Severity',
    translation: 'Official notice of internet suspension has been issued by the government.',
    correlationMatch: '88%',
    campaignMatch: 'Campaign #007 (Telecom Disruption Hoax)'
  },
  {
    id: 'WA-000230',
    source: 'WhatsApp',
    sourceIcon: ImageIcon,
    time: '09:05',
    status: 'OCR Extraction Pending',
    tag: 'Image',
    statusType: 'warning',
    payload: '[Image File Ingested: meme_viral_notice.png]',
    detectedLang: 'English / OCR',
    confidence: '91%',
    intent: 'Visual Propaganda',
    severity: 'High Severity',
    translation: 'INTERNET SHUT DOWN TMROW!! PLS SHARE FAST',
    correlationMatch: '92%',
    campaignMatch: 'Campaign #007 (Telecom Disruption Hoax)'
  }
];

export default function TiplineView({ onNavigate }) {
  const { isConnected, liveSignals, triggerSimulationBurst } = useWebSocket();
  const [activeFilter, setActiveFilter] = useState('All');
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Merge live socket signals with baseline
  const combinedSignals = useMemo(() => {
    const formattedLive = liveSignals.map(s => ({
      id: s.id,
      source: (s.platform || 'Tipline').charAt(0).toUpperCase() + (s.platform || 'tipline').slice(1),
      sourceIcon: (s.platform || '').toLowerCase().includes('whatsapp') ? MessageSquare : Send,
      time: new Date(s.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: s.threat_score >= 80 ? 'CRITICAL THREAT' : 'TRIAGED',
      tag: (s.detected_language || 'en').toUpperCase(),
      statusType: s.threat_score >= 80 ? 'danger' : 'warning',
      payload: s.raw_payload || s.text || '',
      detectedLang: (s.detected_language || 'en').toUpperCase(),
      confidence: `${Math.round((s.confidence_score || 0.92) * 100)}%`,
      intent: s.intent_classification || 'Disinformation Swarm',
      severity: s.severity || 'Medium',
      translation: s.raw_payload || s.text || '',
      correlationMatch: `${s.threat_score || 85}%`,
      campaignMatch: 'Active Cross-Platform Threat Vector',
      isLive: true
    }));

    return [...formattedLive, ...baselineSignals];
  }, [liveSignals]);

  const [selectedSignal, setSelectedSignal] = useState(combinedSignals[0]);

  // Keep selected signal in sync if a new live signal arrives and nothing was selected
  React.useEffect(() => {
    if (combinedSignals.length > 0 && (!selectedSignal || !combinedSignals.find(s => s.id === selectedSignal.id))) {
      setSelectedSignal(combinedSignals[0]);
    }
  }, [combinedSignals, selectedSignal]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBurst = async () => {
    setSimulating(true);
    await triggerSimulationBurst(2);
    setTimeout(() => setSimulating(false), 800);
  };

  // Filter signals
  const filteredSignals = combinedSignals.filter(sig => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'WhatsApp') return sig.source.toLowerCase().includes('whatsapp');
    if (activeFilter === 'Telegram') return sig.source.toLowerCase().includes('telegram');
    if (activeFilter === 'Images') return sig.tag.includes('Image') || sig.tag.includes('OCR');
    if (activeFilter === 'High Priority') return sig.statusType === 'danger' || sig.severity.includes('High');
    return true;
  });

  const activeSig = selectedSignal || combinedSignals[0];

  return (
    <div>
      {/* Top Title Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            Voluntary Tipline Intelligence
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time crowdsourced signal ingestion, automated Whisper ASR & OCR triage.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '11px', 
            color: isConnected ? 'var(--accent-green)' : 'var(--accent-red)', 
            backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            padding: '6px 14px', 
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`, 
            borderRadius: '9999px',
            fontFamily: 'JetBrains Mono'
          }}>
            <RefreshCw size={12} className={isConnected ? "animate-pulse-slow" : ""} />
            <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>{isConnected ? 'WebSocket Sync Active' : 'Offline / Polling'}</span>
          </div>

          <button
            onClick={handleBurst}
            disabled={simulating}
            className="bs-button bs-button-primary"
            style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
          >
            <Zap size={13} className={simulating ? "animate-pulse" : ""} />
            <span>{simulating ? 'Injecting...' : 'Simulate Tipline Influx'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px', width: 'fit-content' }}>
        {['All', 'WhatsApp', 'Telegram', 'Images', 'High Priority'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              backgroundColor: activeFilter === filter ? 'var(--bg-card)' : 'transparent',
              color: activeFilter === filter ? 'var(--text-heading)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: activeFilter === filter ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Split Panel Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>
        
        {/* Left Column: Signal Ingestion Table */}
        <div className="bs-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr 1.2fr', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Signal ID</span>
            <span>Source</span>
            <span>Time</span>
            <span>Status / Tag</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '550px', overflowY: 'auto' }}>
            {filteredSignals.map((sig) => {
              const Icon = sig.sourceIcon || MessageSquare;
              const isSelected = activeSig?.id === sig.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 0.8fr 1.2fr',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--accent-blue)' : 'var(--text-heading)' }}>
                    {sig.id}
                  </span>

                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={14} style={{ color: sig.source.toLowerCase().includes('whatsapp') ? 'var(--accent-green)' : 'var(--accent-blue)' }} /> {sig.source}
                  </span>

                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {sig.time}
                  </span>

                  <div>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 600,
                      color: sig.statusType === 'danger' ? 'var(--accent-red)' : sig.statusType === 'warning' ? 'var(--accent-amber)' : 'var(--text-secondary)' 
                    }}>
                      {sig.status}
                    </span>
                    <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 4px', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '2px', color: 'var(--text-secondary)' }}>
                      {sig.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Signal Detail Inspector */}
        {activeSig && (
          <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Inspector Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={18} style={{ color: 'var(--accent-blue)' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0, fontFamily: 'JetBrains Mono' }}>
                    Signal: {activeSig.id}
                  </h3>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                  <span>Ingested: {activeSig.time} UTC</span>
                  <span>• Cryptographically Sealed</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="bs-button bs-button-secondary" style={{ padding: '6px' }}>
                  <Bookmark size={14} />
                </button>
                <button className="bs-button bs-button-secondary" style={{ padding: '6px' }}>
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            {/* Raw Intercept Payload Card */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Raw Intercept Payload
                </span>
                <span className="bs-badge bs-badge-amber" style={{ fontSize: '9px' }}>
                  Source: {activeSig.source}
                </span>
              </div>

              <div style={{ 
                backgroundColor: 'var(--inner-box-bg)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px', 
                padding: '14px',
                fontFamily: 'JetBrains Mono',
                fontSize: '13px',
                color: 'var(--accent-amber)',
                position: 'relative',
                lineHeight: 1.4
              }}>
                "{activeSig.payload}"
                
                <button 
                  onClick={() => handleCopy(activeSig.payload)}
                  style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-secondary)', 
                    cursor: 'pointer' 
                  }}>
                  {copied ? <Check size={14} style={{ color: 'var(--accent-green)' }} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* NLP Analysis Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              
              {/* Detected Language */}
              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Detected Language</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)' }}>{activeSig.detectedLang}</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontFamily: 'JetBrains Mono' }}>{activeSig.confidence} Conf.</span>
                </div>
              </div>

              {/* Intent Classification */}
              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Intent Classification</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-red)' }}>{activeSig.intent}</span>
                  <span style={{ fontSize: '10px', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 600 }}>{activeSig.severity}</span>
                </div>
              </div>

            </div>

            {/* Normalized Translation */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                Normalized Meaning / Semantic Extract
              </div>
              <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)' }}>
                "{activeSig.translation}"
              </div>
            </div>

            {/* Campaign Correlation Matrix Box */}
            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid rgba(239, 68, 68, 0.4)', 
              borderRadius: '10px', 
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              {/* Match Circle */}
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                border: '3px solid var(--accent-red)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                color: 'var(--accent-red)',
                fontFamily: 'JetBrains Mono',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.2)'
              }}>
                {activeSig.correlationMatch}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={12} /> Campaign Correlation Matrix
                  </div>
                  <button 
                    onClick={() => onNavigate && onNavigate('campaigns')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Campaign Matrix <ExternalLink size={10} />
                  </button>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', marginTop: '4px' }}>
                  Cross-Platform Semantic Match
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  High semantic overlap with known disinformation vector tracking under <strong style={{ color: 'var(--text-heading)' }}>{activeSig.campaignMatch}</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button 
                onClick={() => onNavigate && onNavigate('campaigns')}
                className="bs-button bs-button-primary" 
                style={{ flex: 1, fontSize: '12px' }}>
                Add to Campaign
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('analyst-response')}
                className="bs-button bs-button-danger" 
                style={{ flex: 1, fontSize: '12px' }}>
                Escalate Threat
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
