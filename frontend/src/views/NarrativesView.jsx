import React, { useState } from 'react';
import { GitFork, Globe, Clock, MessageSquare, Image as ImageIcon, Send, ArrowRight, Network, GitBranch } from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';

const mutations = [
  {
    id: 1,
    tag: 'ORIGINAL STRAIN',
    lang: 'EN',
    time: 'T-00:00',
    text: '"Internet shutdown tomorrow across major districts"',
    source: 'Source: Platform X Seed Node (@tech_leaks_in)',
    sim: 'Sim: Baseline',
    simColor: '#3b82f6',
    border: 'var(--border-color)'
  },
  {
    id: 2,
    tag: 'SEMANTIC PARAPHRASE',
    lang: 'EN',
    time: 'T+00:45',
    text: '"Authorities may suspend internet access tomorrow for 48 hours"',
    source: 'Source: Telegram Infiltration Channel',
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
    text: '"सरकार कल इंटरनेट बंद करने वाली है, अपने जरूरी काम आज ही निपटा लें"',
    source: 'Source: WhatsApp Forward Chain (Mumbai / Delhi)',
    sim: '92% Sim',
    simColor: '#f59e0b',
    border: 'var(--border-color)'
  },
  {
    id: 4,
    tag: 'PHONETIC MUTATION',
    lang: 'HINGLISH',
    time: 'T+03:05',
    text: '"Sarkar kal internet band karne wali hai sabhi dosto ko forward karo"',
    source: 'Source: Instagram Broadcast Group',
    sim: '88% Sim',
    simColor: '#ef4444',
    border: 'var(--border-color)'
  },
  {
    id: 5,
    tag: 'MEDIA ENCAPSULATION (MEME / OCR)',
    lang: 'VISUAL',
    time: 'T+05:30',
    text: 'OCR EXTRACT: "EMERGENCY NOTICE: INTERNET SHUT DOWN TMROW!! PLS SHARE FAST"',
    source: 'Source: Viral Graphic Intercept',
    sim: '84% Sim',
    simColor: '#8b5cf6',
    border: 'var(--border-color)',
    isMedia: true
  }
];

export default function NarrativesView() {
  const [activeTab, setActiveTab] = useState('graph');

  return (
    <div>
      {/* Page Header & View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            Narrative Mutation & Topology
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '800px', lineHeight: 1.5 }}>
            Cross-platform semantic tracking, botnet coordination topology, and linguistic paraphrase mutation lineage.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('graph')}
            style={{
              padding: '7px 16px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              backgroundColor: activeTab === 'graph' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'graph' ? 'var(--text-heading)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: activeTab === 'graph' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Network size={14} style={{ color: '#3b82f6' }} />
            <span>Interactive Botnet Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            style={{
              padding: '7px 16px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              backgroundColor: activeTab === 'tree' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'tree' ? 'var(--text-heading)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: activeTab === 'tree' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitBranch size={14} style={{ color: '#10b981' }} />
            <span>Mutation Lineage Tree</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Network Topology Graph */}
      {activeTab === 'graph' && (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
              Coordinated Inauthentic Behavior (CIB) Propagation Graph
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              TARGET: Campaign CMP-007 (Telecom Disruption Hoax)
            </div>
          </div>
          <NetworkGraph campaignId="CMP-007" />
        </div>
      )}

      {/* Tab 2: Mutation Timeline Tree */}
      {activeTab === 'tree' && (
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
      )}
    </div>
  );
}
