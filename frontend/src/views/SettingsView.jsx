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
  FileCheck,
  Fingerprint,
  Building2,
  Newspaper,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function SettingsView() {
  const { currentRole, currentUser, switchRole, setIsAuthModalOpen, allProfiles } = useAuth();
  const [activeTab, setActiveTab] = useState('rbac');
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

  const permissionsList = [
    { key: 'canIssueSec69A', label: 'Section 69A IT Act Emergency Takedowns' },
    { key: 'canAccessClassifiedIntel', label: 'Raw Classified Telemetry & Intelligence' },
    { key: 'canViewUnmaskedMetadata', label: 'Unmasked Submitter Metadata & IP Traces' },
    { key: 'canGenerateLegalDossier', label: 'Judicial Evidence Dossier Compilation' },
    { key: 'canSignBlockchainEvidence', label: 'EVM Cryptographic Evidence Signing' },
    { key: 'canGenerateSEBIDisclosure', label: 'SEBI / Stock Exchange Counter-Briefs' },
    { key: 'canTrackMarketSabotage', label: 'Market Volatility & Short-Seller Sabotage Radar' },
    { key: 'canPublishFactCheck', label: 'Consortium Fact-Check & WhatsApp Debunk Broadcast' },
    { key: 'canInspectNarrativeTree', label: 'Multilingual Narrative Mutation Inspection' },
    { key: 'canViewAuditLedger', label: 'Immutable Blockchain Audit Ledger Access' }
  ];

  return (
    <div>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            SYSTEM & IDENTITY ADMINISTRATION
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            Cluster & Security Settings
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Configure RBAC clearances, threat detection algorithms, EVM blockchain notary, and ingestion telemetry.
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
            { id: 'rbac', label: 'RBAC & Clearances', icon: Fingerprint },
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
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Settings Panel */}
        <div>
          
          {/* Tab 0: RBAC & Clearances */}
          {activeTab === 'rbac' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Active Identity Card */}
              <div className="bs-card" style={{ padding: '24px', borderLeft: `4px solid ${currentUser.badgeColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: `${currentUser.badgeColor}20`,
                      border: `1px solid ${currentUser.badgeColor}60`,
                      color: currentUser.badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 800
                    }}>
                      {currentUser.avatarInitials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                          {currentUser.name}
                        </h3>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: `${currentUser.badgeColor}20`,
                          color: currentUser.badgeColor
                        }}>
                          {currentUser.badgeText}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {currentUser.roleTitle}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                        {currentUser.email} • ID: {currentUser.id} • {currentUser.organization}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bs-button bs-button-primary"
                    style={{ fontSize: '12px', padding: '8px 16px', gap: '6px' }}
                  >
                    <RefreshCw size={14} />
                    <span>Switch Active Persona</span>
                  </button>
                </div>
              </div>

              {/* RBAC Permission Matrix */}
              <div className="bs-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Role-Based Access Control (RBAC) Capability Matrix
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Multi-tenant zero-trust capability distribution across operational jurisdictions.
                </p>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px' }}>Operational Capability</th>
                        <th style={{ padding: '10px 12px', color: '#ef4444' }}>IB / LEA (Gov)</th>
                        <th style={{ padding: '10px 12px', color: '#f59e0b' }}>Adani (Enterprise)</th>
                        <th style={{ padding: '10px 12px', color: '#3b82f6' }}>Press Consortium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsList.map((perm) => {
                        const ibHas = allProfiles[ROLES.INVESTIGATION_BUREAU]?.features?.[perm.key] ?? false;
                        const corpHas = allProfiles[ROLES.CORPORATE_ENTERPRISE]?.features?.[perm.key] ?? false;
                        const mediaHas = allProfiles[ROLES.JOURNALIST_MEDIA]?.features?.[perm.key] ?? false;

                        return (
                          <tr key={perm.key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '10px 12px', color: 'var(--text-heading)', fontWeight: 500 }}>
                              {perm.label}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              {ibHas ? <CheckCircle2 size={16} style={{ color: '#10b981' }} /> : <XCircle size={16} style={{ color: 'var(--text-muted)' }} />}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              {corpHas ? <CheckCircle2 size={16} style={{ color: '#10b981' }} /> : <XCircle size={16} style={{ color: 'var(--text-muted)' }} />}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              {mediaHas ? <CheckCircle2 size={16} style={{ color: '#10b981' }} /> : <XCircle size={16} style={{ color: 'var(--text-muted)' }} />}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Tab 1: Threat Engine */}
          {activeTab === 'general' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} style={{ color: 'var(--accent-blue)' }} />
                <span>Detection Sensitivity & Clustering Thresholds</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Adjust algorithmic weights for text embeddings, cross-lingual correlation, and bot heuristics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                      Minimum Threat Confidence Threshold
                    </label>
                    <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--accent-blue)' }}>
                      {threshold}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="99" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Blockchain & Custody */}
          {activeTab === 'blockchain' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: 'var(--accent-green)' }} />
                <span>EVM Smart Contract & Notary Node</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Manage local Hardhat/Anvil EVM notary endpoints and judicial evidence signing.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)', display: 'block', marginBottom: '6px' }}>
                    EVM RPC Endpoint
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
              </div>
            </div>
          )}

          {/* Tab 3: Ingestion Feeds */}
          {activeTab === 'ingestion' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Platform Connectors & Webhooks</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Configure streaming connectors for X (Twitter), Telegram dark feeds, and Citizen WhatsApp Tiplines.
              </p>
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
