import React from 'react';
import { GitFork, Globe, Clock, MessageSquare, Image as ImageIcon, Send, ArrowRight } from 'lucide-react';

const mutations = [
  {
    id: 1,
    tag: 'ORIGINAL STRAIN',
    lang: 'EN',
    time: 'T-00:00',
    text: '"Internet shutdown tomorrow"',
    source: 'Source: Platform X',
    sim: 'Sim: Baseline',
    simColor: '#3b82f6',
    border: 'var(--border-color)'
  },
  {
    id: 2,
    tag: 'SEMANTIC PARAPHRASE',
    lang: 'EN',
    time: 'T+00:45',
    text: '"Authorities may suspend internet access tomorrow"',
    source: 'Source: Secure Messenger Beta',
    sim: '94% SIMILARITY',
    simColor: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.4)',
    activeNode: true
  },
  {
    id: 3,
    tag: 'DIRECT TRANSLATION',
    lang: 'HI',
    time: 'T+01:20',
    text: '"सरकार कल इंटरनेट बंद करने वाली है"',
    source: 'Source: Encrypted Chat Group',
    sim: '92% Sim',
    simColor: '#f59e0b',
    border: 'var(--border-color)'
  },
  {
    id: 4,
    tag: 'PHONETIC MUTATION',
    lang: 'HINGLISH',
    time: 'T+03:05',
    text: '"Sarkar kal internet band karne wali hai"',
    source: 'Source: Social Feed Alpha',
    sim: '88% Sim',
    simColor: '#ef4444',
    border: 'var(--border-color)'
  },
  {
    id: 5,
    tag: 'MEDIA ENCAPSULATION (MEME)',
    lang: 'VISUAL',
    time: 'T+05:30',
    text: 'OCR EXTRACT: "INTERNET SHUT DOWN TMROW!! PLS SHARE FAST"',
    source: 'Source: Image Intercept',
    sim: '84% Sim',
    simColor: '#8b5cf6',
    border: 'var(--border-color)',
    isMedia: true
  }
];

export default function NarrativesView() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
          Narrative Mutation Analysis
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '800px', lineHeight: 1.5 }}>
          Multiple semantically equivalent variants appeared across platforms within a short time window. Tracing linguistic and format mutations from point of origin.
        </p>
      </div>

      {/* Mutation Timeline Tree */}
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        
        {/* Connecting Vertical Line */}
        <div style={{
          position: 'absolute',
          top: '24px',
          bottom: '24px',
          left: '11px',
          width: '2px',
          backgroundColor: 'var(--border-color)'
        }} />

        {mutations.map((item) => (
          <div key={item.id} style={{ position: 'relative', marginBottom: '24px' }}>
            
            {/* Timeline Node Bullet */}
            <div style={{
              position: 'absolute',
              left: '-32px',
              top: '20px',
              transform: 'translateX(-50%)',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'var(--inner-box-bg)',
              border: `3px solid ${item.activeNode ? '#3b82f6' : 'var(--border-color)'}`,
              boxShadow: item.activeNode ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
              zIndex: 2
            }} />

            {/* Mutation Node Card */}
            <div className="bs-card" style={{ 
              padding: '20px', 
              borderColor: item.border, 
              backgroundColor: item.activeNode ? 'rgba(59, 130, 246, 0.04)' : 'var(--bg-card)' 
            }}>
              
              {/* Card Top Metadata Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="bs-badge bs-badge-blue" style={{ fontSize: '10px', borderRadius: '9999px', padding: '3px 10px' }}>
                    {item.tag}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={12} /> {item.lang}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
              </div>

              {/* Text Payload */}
              <div style={{ 
                fontSize: '17px', 
                fontWeight: 600, 
                color: 'var(--text-heading)', 
                marginBottom: '16px',
                fontFamily: item.lang === 'HI' ? 'inherit' : 'Inter, sans-serif'
              }}>
                {item.text}
              </div>

              {/* Card Footer: Source & Similarity */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={12} style={{ color: '#3b82f6' }} />
                  <span>{item.source}</span>
                </div>

                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  color: item.simColor, 
                  fontFamily: 'JetBrains Mono',
                  padding: '3px 10px',
                  backgroundColor: 'var(--inner-box-bg)',
                  border: `1px solid ${item.simColor}`,
                  borderRadius: '9999px'
                }}>
                  {item.sim}
                </div>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

