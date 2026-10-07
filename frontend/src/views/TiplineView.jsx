import React, { useState } from 'react';
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
  RefreshCw 
} from 'lucide-react';

const signalsData = [
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
  const [selectedSignal, setSelectedSignal] = useState(signalsData[0]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Top Title Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Voluntary Tipline Intelligence
          </h2>
          <p style={{ fontSize: '13px', color: '#8c9ba5', marginTop: '2px' }}>
            Real-time crowdsourced signal ingestion and automated NLP triage.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '9999px' }}>
          <RefreshCw size={12} className="animate-pulse-slow" />
          <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>Live Sync Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px', width: 'fit-content' }}>
        {['All', 'WhatsApp', 'Telegram', 'Images', 'Voice', 'High Priority'].map((filter) => (
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
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #232b3e', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', fontSize: '11px', color: '#8c9ba5', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Signal ID</span>
            <span>Source</span>
            <span>Time</span>
            <span>Status / NLP Tag</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {signalsData.map((sig) => {
              const Icon = sig.sourceIcon;
              const isSelected = selectedSignal.id === sig.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1.2fr',
                    padding: '14px 16px',
                    borderBottom: '1px solid #1e2638',
                    backgroundColor: isSelected ? '#1c2333' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 600, color: isSelected ? '#60a5fa' : '#fff' }}>
                    {sig.id}
                  </span>

                  <span style={{ fontSize: '12px', color: '#8c9ba5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={14} /> {sig.source}
                  </span>

                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#8c9ba5' }}>
                    {sig.time}
                  </span>

                  <div>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 600,
                      color: sig.statusType === 'danger' ? '#ef4444' : sig.statusType === 'warning' ? '#f59e0b' : '#8c9ba5' 
                    }}>
                      {sig.status}
                    </span>
                    <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 4px', backgroundColor: '#0f131d', border: '1px solid #232b3e', borderRadius: '2px', color: '#8c9ba5' }}>
                      {sig.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Signal Detail Inspector */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Inspector Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid #232b3e', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} style={{ color: '#3b82f6' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'JetBrains Mono' }}>
                  Signal: {selectedSignal.id}
                </h3>
              </div>
              <div style={{ fontSize: '11px', color: '#8c9ba5', marginTop: '4px', display: 'flex', gap: '12px' }}>
                <span>Ingested: {selectedSignal.time}:22 UTC</span>
                <span>• Source Anonymized</span>
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
              <span style={{ fontSize: '11px', color: '#8c9ba5', fontWeight: 600, textTransform: 'uppercase' }}>
                Raw Intercept Payload
              </span>
              <span className="bs-badge bs-badge-amber" style={{ fontSize: '9px' }}>
                Type: Text Message
              </span>
            </div>

            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '10px', 
              padding: '14px',
              fontFamily: 'JetBrains Mono',
              fontSize: '13px',
              color: '#f59e0b',
              position: 'relative',
              lineHeight: 1.4
            }}>
              "{selectedSignal.payload}"
              
              <button 
                onClick={() => handleCopy(selectedSignal.payload)}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  cursor: 'pointer' 
                }}>
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* NLP Analysis Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            
            {/* Detected Language */}
            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Detected Language</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)' }}>{selectedSignal.detectedLang}</span>
                <span style={{ fontSize: '11px', color: '#60a5fa', fontFamily: 'JetBrains Mono' }}>{selectedSignal.confidence} Conf.</span>
              </div>
            </div>

            {/* Intent Classification */}
            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Intent Classification</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>{selectedSignal.intent}</span>
                <span style={{ fontSize: '10px', color: '#ef4444', textTransform: 'uppercase', fontWeight: 600 }}>{selectedSignal.severity}</span>
              </div>
            </div>

          </div>

          {/* Normalized Translation */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Normalized Translation
            </div>
            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)' }}>
              "{selectedSignal.translation}"
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
              border: '3px solid #ef4444', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              color: '#ef4444',
              fontFamily: 'JetBrains Mono',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.2)'
            }}>
              {selectedSignal.correlationMatch}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={12} /> Campaign Correlation Matrix
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('campaigns')}
                  style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Campaign #007 <ExternalLink size={10} />
                </button>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
                Semantic Match Detected
              </div>
              <p style={{ fontSize: '11px', color: '#8c9ba5', marginTop: '2px' }}>
                High semantic overlap with known disinformation vector tracking under <strong style={{ color: '#fff' }}>{selectedSignal.campaignMatch}</strong>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button className="bs-button bs-button-primary" style={{ flex: 1, fontSize: '12px' }}>
              Add to Campaign
            </button>
            <button className="bs-button bs-button-danger" style={{ flex: 1, fontSize: '12px' }}>
              Escalate
            </button>
            <button className="bs-button bs-button-secondary" style={{ flex: 1, fontSize: '12px' }}>
              Mark False Positive
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
