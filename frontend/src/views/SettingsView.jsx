import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Key, 
  Server, 
  Bell, 
  Database, 
  Lock, 
  Check, 
  Sliders, 
  Cpu, 
  Save, 
  RefreshCw,
  Globe,
  Radio,
  FileCheck
} from 'lucide-react';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  // Form States
  const [threshold, setThreshold] = useState(85);
  const [coordinationWindow, setCoordinationWindow] = useState('4');
  const [evmRpc, setEvmRpc] = useState('http://127.0.0.1:8545');
  const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const [autoNotarize, setAutoNotarize] = useState(true);
  const [tiplineSync, setTiplineSync] = useState(true);
  const [retentionDays, setRetentionDays] = useState('90');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            SYSTEM ADMINISTRATION
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            Cluster & Security Settings
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Configure threat detection algorithms, EVM blockchain notary, and ingestion telemetry parameters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSave}
            className="bs-button bs-button-primary" 
            style={{ gap: '8px', padding: '9px 18px', fontSize: '13px' }}>
            {saved ? <Check size={16} /> : <Save size={16} />}
            <span>{saved ? 'Saved Configuration' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Settings Sidebar Tabs + Active Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
        
        {/* Settings Navigation Tabs */}
        <div className="bs-card" style={{ padding: '12px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'general', label: 'Threat Engine', icon: Sliders },
            { id: 'blockchain', label: 'EVM & Custody', icon: Shield },
            { id: 'ingestion', label: 'Ingestion Feeds', icon: Radio },
            { id: 'api', label: 'API Keys & Webhooks', icon: Key },
            { id: 'storage', label: 'Data Retention', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tab 1: Threat Engine */}
          {activeTab === 'general' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} style={{ color: 'var(--accent-blue)' }} />
                <span>Threat Engine & Detection Sensitivity</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Calibrate thresholds for triggering automated high-priority incident investigations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                      High Priority Escalation Threshold
                    </label>
                    <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {threshold} / 100
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="98" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Campaigns scoring above {threshold} will automatically generate an Analyst Alert and notify commanders.
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', display: 'block', marginBottom: '6px' }}>
                    Temporal Coordination Window
                  </label>
                  <select 
                    value={coordinationWindow}
                    onChange={(e) => setCoordinationWindow(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="2">2 Minutes (Ultra-Strict Coordinated Bursts)</option>
                    <option value="4">4 Minutes (Standard Synthetic Propagation)</option>
                    <option value="10">10 Minutes (Extended Campaign Window)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: EVM & Custody */}
          {activeTab === 'blockchain' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: 'var(--accent-green)' }} />
                <span>EVM Blockchain Notarization & Chain of Custody</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Manage the cryptographic ledger endpoint used to stamp digital evidence packages.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', display: 'block', marginBottom: '6px' }}>
                    EVM RPC Endpoint URL
                  </label>
                  <input 
                    type="text" 
                    value={evmRpc}
                    onChange={(e) => setEvmRpc(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', display: 'block', marginBottom: '6px' }}>
                    Smart Contract Address (EvidenceRegistry.sol)
                  </label>
                  <input 
                    type="text" 
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--inner-box-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                      Auto-Notarize Verified Evidence
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Automatically write SHA-256 digests of high-risk payloads to block memory.
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoNotarize}
                    onChange={(e) => setAutoNotarize(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Ingestion Feeds */}
          {activeTab === 'ingestion' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} style={{ color: '#06b6d4' }} />
                <span>Signal Ingestion & Citizen Tipline Channels</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Configure active telemetry pipes from social messaging networks and fringe forums.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'WhatsApp Business Tipline Gateway', status: 'Active', port: 'Webhook :8000/api/tipline/whatsapp' },
                  { name: 'Telegram Bot Intelligence Dispatcher', status: 'Active', port: 'Webhook :8000/api/tipline/telegram' },
                  { name: 'X / Twitter Synthetic Propagation Stream', status: 'Monitoring', port: 'Direct Kafka Pipe' }
                ].map((feed, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 16px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>{feed.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>{feed.port}</div>
                    </div>
                    <span className="bs-badge bs-badge-green">{feed.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: API Keys */}
          {activeTab === 'api' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} style={{ color: 'var(--accent-amber)' }} />
                <span>Operational API Credentials</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Secret tokens for law enforcement integration and inter-agency threat sharing.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', display: 'block', marginBottom: '6px' }}>
                    Inter-Agency STIX 2.1 Threat Sharing API Token
                  </label>
                  <input 
                    type="password" 
                    value="bs_sec_live_99218aef882199042bba"
                    readOnly
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Data Retention */}
          {activeTab === 'storage' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} style={{ color: 'var(--accent-purple)' }} />
                <span>Evidence Storage & Data Retention</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Define retention cycles for ingested citizen submissions and audio/video artifacts.
              </p>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', display: 'block', marginBottom: '6px' }}>
                  Raw Media Storage Retention Cycle
                </label>
                <select 
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="30">30 Days (Standard Audit Cache)</option>
                  <option value="90">90 Days (Recommended for Judicial Proceedings)</option>
                  <option value="365">365 Days (National Security Long-Term Vault)</option>
                </select>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
