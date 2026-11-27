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
  const [activeTab, setActiveTab] = useState('api');
  const [saved, setSaved] = useState(false);

  // Platform API Keys (BYOK) State
  const [geminiKey, setGeminiKey] = useState(() => {
    try { return localStorage.getItem('bharat_shield_gemini_key') || ''; } catch { return ''; }
  });
  const [youtubeKey, setYoutubeKey] = useState(() => {
    try { return localStorage.getItem('bharat_shield_youtube_key') || ''; } catch { return ''; }
  });
  const [telegramToken, setTelegramToken] = useState(() => {
    try { return localStorage.getItem('bharat_shield_telegram_token') || ''; } catch { return ''; }
  });
  const [ollamaEndpoint, setOllamaEndpoint] = useState(() => {
    try { return localStorage.getItem('bharat_shield_ollama_endpoint') || 'http://localhost:11434'; } catch { return 'http://localhost:11434'; }
  });

  const [showKeys, setShowKeys] = useState(false);
  const [testingService, setTestingService] = useState(null);
  const [testResults, setTestResults] = useState({});

  // Live Sandbox Verification State
  const [liveQuery, setLiveQuery] = useState('Viral forward claiming Indian banking system failure next week due to foreign cyber attack');
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveVerdict, setLiveVerdict] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [liveSocialPosts, setLiveSocialPosts] = useState(null);

  // Form States
  const [threshold, setThreshold] = useState(85);
  const [coordinationWindow, setCoordinationWindow] = useState('4');
  const [evmRpc, setEvmRpc] = useState('http://127.0.0.1:8545');
  const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const [autoNotarize, setAutoNotarize] = useState(true);
  const [tiplineSync, setTiplineSync] = useState(true);
  const [retentionDays, setRetentionDays] = useState('90');

  // Test Connector Function
  const testConnector = async (service, key) => {
    setTestingService(service);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/connectors/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, key })
      });
      const data = await res.json();
      setTestResults(prev => ({ ...prev, [service]: data }));
    } catch (e) {
      setTestResults(prev => ({
        ...prev,
        [service]: { valid: false, message: 'Backend unreachable. Ensure desktop sidecar is running.' }
      }));
    } finally {
      setTestingService(null);
    }
  };

  // Save All API Keys
  const handleSave = async () => {
    try {
      localStorage.setItem('bharat_shield_gemini_key', geminiKey);
      localStorage.setItem('bharat_shield_youtube_key', youtubeKey);
      localStorage.setItem('bharat_shield_telegram_token', telegramToken);
      localStorage.setItem('bharat_shield_ollama_endpoint', ollamaEndpoint);

      await fetch('http://127.0.0.1:8000/api/connectors/save-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemini: geminiKey,
          youtube: youtubeKey,
          telegram: telegramToken,
          ollama: ollamaEndpoint
        })
      });
    } catch {}

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Run Real-Time AI Forensic Verification
  const handleLiveVerify = async () => {
    if (!liveQuery.trim()) return;
    setIsVerifying(true);
    setLiveVerdict(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/connectors/live-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: liveQuery, api_key: geminiKey })
      });
      const data = await res.json();
      setLiveVerdict(data);
    } catch (err) {
      setLiveVerdict({ error: 'Connection failed: ' + err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  // Run Real-Time Social Search (YouTube + Reddit)
  const handleLiveSearch = async () => {
    if (!liveQuery.trim()) return;
    setIsSearching(true);
    setLiveSocialPosts(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/connectors/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: liveQuery, youtube_key: youtubeKey })
      });
      const data = await res.json();
      setLiveSocialPosts(data);
    } catch (err) {
      setLiveSocialPosts({ error: 'Search failed: ' + err.message });
    } finally {
      setIsSearching(false);
    }
  };

  const permissionsList = [
    { key: 'canIssueSec69A', label: 'Rapid Incident Containment & Counter-Measures' },
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

  const currentTabs = [
    { id: 'api', label: 'Platform API Keys (BYOK)', icon: Key },
    { id: 'general', label: 'Threat Engine', icon: Sliders },
    { id: 'blockchain', label: 'EVM & Custody', icon: Shield },
    { id: 'ingestion', label: 'Ingestion Feeds', icon: Radio },
    { id: 'rbac', label: 'Personal Lenses & RBAC', icon: Fingerprint },
    { id: 'storage', label: 'Data Retention', icon: Database }
  ];

  return (
    <div>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            {isAdmin ? 'System configuration' : 'Identity profile'}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.01em' }}>
            {isAdmin ? 'Security & engine settings' : 'Identity & clearance settings'}
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isAdmin 
              ? 'Configure clearances, algorithmic thresholds, EVM blockchain notary, and ingestion telemetry.'
              : 'Security clearance profile, authorized operational privileges, and identity tokens.'}
          </p>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleSave}
              className="bs-button bs-button-primary" 
              style={{ gap: '6px', padding: '6px 14px', fontSize: '12px' }}>
              {saved ? <Check size={14} /> : <Save size={14} />}
              <span>{saved ? 'Saved' : 'Save changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Settings Sidebar Tabs + Active Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
        
        {/* Settings Navigation Tabs */}
        <div className="bs-card" style={{ padding: '12px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {currentTabs.map(tab => {
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
          
          {/* Non-Admin Profile Tab */}
          {!isAdmin && activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="bs-card" style={{ padding: '24px', borderLeft: `4px solid ${currentUser?.badgeColor || '#10b981'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: `${currentUser?.badgeColor || '#10b981'}20`,
                      border: `1px solid ${currentUser?.badgeColor || '#10b981'}60`,
                      color: currentUser?.badgeColor || '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 800
                    }}>
                      {currentUser?.avatarInitials || 'TG'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                          {currentUser?.name}
                        </h3>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: `${currentUser?.badgeColor || '#10b981'}20`,
                          color: currentUser?.badgeColor || '#10b981'
                        }}>
                          {currentUser?.badgeText}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {currentUser?.roleTitle}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                        {currentUser?.email} • ID: {currentUser?.id} • {currentUser?.organization}
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

              {/* Clearance Governance Notice */}
              <div className="bs-card" style={{ padding: '20px', backgroundColor: 'var(--inner-box-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Lock size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)' }}>
                      Centrally Managed RBAC Authority
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      Global tenant policies, detection thresholds, API keys, and containment escalation privileges are centrally controlled by the Super Administrator (NCCC).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Non-Admin Assigned Privileges Tab */}
          {!isAdmin && activeTab === 'privileges' && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                Operational Clearances & Permitted Capabilities
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Capabilities currently provisioned for {currentUser?.roleTitle}.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {permissionsList.map((perm) => {
                  const hasFeature = currentUser?.features?.[perm.key] ?? false;
                  return (
                    <div 
                      key={perm.key} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: hasFeature ? 'rgba(16, 185, 129, 0.06)' : 'var(--inner-box-bg)',
                        border: '1px solid',
                        borderColor: hasFeature ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: hasFeature ? 600 : 400, color: hasFeature ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                        {perm.label}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: hasFeature ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                        color: hasFeature ? '#10b981' : 'var(--text-muted)'
                      }}>
                        {hasFeature ? 'AUTHORIZED' : 'RESTRICTED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Tab 0: RBAC & Clearances */}
          {isAdmin && activeTab === 'rbac' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Active Identity Card */}
              <div className="bs-card" style={{ padding: '24px', borderLeft: `4px solid ${currentUser?.badgeColor || '#10b981'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: `${currentUser?.badgeColor || '#10b981'}20`,
                      border: `1px solid ${currentUser?.badgeColor || '#10b981'}60`,
                      color: currentUser?.badgeColor || '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 800
                    }}>
                      {currentUser?.avatarInitials || 'SA'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                          {currentUser?.name || 'Commander Arvind Sharma'}
                        </h3>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: `${currentUser?.badgeColor || '#10b981'}20`,
                          color: currentUser?.badgeColor || '#10b981'
                        }}>
                          {currentUser?.badgeText || 'ROOT'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {currentUser?.roleTitle || 'Super Administrator / NCCC Operations Command'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                        {currentUser?.email || 'a.sharma@sentinel.gov.in'} • ID: {currentUser?.id || 'user_admin_000'} • {currentUser?.organization || 'National Cyber Coordination Centre (NCCC)'}
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
                        <th style={{ padding: '10px 12px', color: '#f59e0b' }}>Tata (Enterprise)</th>
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

          {/* Tab 4: Platform API Keys (BYOK) */}
          {activeTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="bs-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Key size={18} style={{ color: 'var(--accent-primary)' }} />
                      <span>Bring Your Own Key (BYOK) Platform Connectors</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Enter your free API keys to enable live real-time web search, AI narrative triage, and video analysis.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowKeys(!showKeys)}
                      className="bs-button bs-button-secondary"
                      style={{ fontSize: '11.5px', padding: '5px 12px' }}
                    >
                      {showKeys ? 'Hide Keys' : 'Reveal Keys'}
                    </button>
                    <button
                      onClick={handleSave}
                      className="bs-button bs-button-primary"
                      style={{ fontSize: '11.5px', padding: '5px 14px', gap: '6px' }}
                    >
                      {saved ? <Check size={14} /> : <Save size={14} />}
                      <span>{saved ? 'Saved' : 'Save all keys'}</span>
                    </button>
                  </div>
                </div>

                {/* Connector Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* 1. Google Gemini */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Cpu size={16} style={{ color: 'var(--accent-primary)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                          Google Gemini API Key (Free AI Triage & Deepfake Debunk)
                        </span>
                      </div>
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: '11.5px', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Get free Gemini key <ExternalLink size={12} />
                      </a>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showKeys ? 'text' : 'password'}
                        placeholder="AIzaSy..."
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-control)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => testConnector('gemini', geminiKey)}
                        disabled={testingService === 'gemini'}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '11.5px', padding: '6px 14px' }}
                      >
                        {testingService === 'gemini' ? <RefreshCw size={13} className="animate-spin" /> : 'Test Connection'}
                      </button>
                    </div>
                    {testResults.gemini && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '11.5px',
                        color: testResults.gemini.valid ? 'var(--risk-verified)' : 'var(--risk-critical)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {testResults.gemini.valid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{testResults.gemini.message}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. YouTube Data API */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} style={{ color: '#ef4444' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                          YouTube Data API v3 Key (Video Search & Viral Shorts)
                        </span>
                      </div>
                      <a 
                        href="https://console.cloud.google.com/apis/credentials" 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: '11.5px', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Google Cloud Console <ExternalLink size={12} />
                      </a>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showKeys ? 'text' : 'password'}
                        placeholder="AIzaSy..."
                        value={youtubeKey}
                        onChange={(e) => setYoutubeKey(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-control)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => testConnector('youtube', youtubeKey)}
                        disabled={testingService === 'youtube'}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '11.5px', padding: '6px 14px' }}
                      >
                        {testingService === 'youtube' ? <RefreshCw size={13} className="animate-spin" /> : 'Test Connection'}
                      </button>
                    </div>
                    {testResults.youtube && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '11.5px',
                        color: testResults.youtube.valid ? 'var(--risk-verified)' : 'var(--risk-critical)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {testResults.youtube.valid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{testResults.youtube.message}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Reddit Public Connector */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                        Reddit Ingestion (r/india, r/delhi Public Discussions)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Uses Reddit's open JSON gateway. Ready for instant live sentiment & narrative search.
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-badge)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--risk-verified)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontFamily: 'JetBrains Mono'
                    }}>
                      ● Active (No Key Needed)
                    </span>
                  </div>

                  {/* 4. Telegram Bot Token */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Radio size={16} style={{ color: '#0ea5e9' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                          Telegram Tipline Bot Token (Optional)
                        </span>
                      </div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Created via @BotFather</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showKeys ? 'text' : 'password'}
                        placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-control)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => testConnector('telegram', telegramToken)}
                        disabled={testingService === 'telegram'}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '11.5px', padding: '6px 14px' }}
                      >
                        {testingService === 'telegram' ? <RefreshCw size={13} className="animate-spin" /> : 'Test Connection'}
                      </button>
                    </div>
                    {testResults.telegram && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '11.5px',
                        color: testResults.telegram.valid ? 'var(--risk-verified)' : 'var(--risk-critical)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {testResults.telegram.valid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{testResults.telegram.message}</span>
                      </div>
                    )}
                  </div>

                  {/* 5. Local Ollama Host */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Server size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                          Local Ollama Endpoint (100% Offline AI Inference)
                        </span>
                      </div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>e.g. llama3 / mistral</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={ollamaEndpoint}
                        onChange={(e) => setOllamaEndpoint(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-control)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => testConnector('ollama', ollamaEndpoint)}
                        disabled={testingService === 'ollama'}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '11.5px', padding: '6px 14px' }}
                      >
                        {testingService === 'ollama' ? <RefreshCw size={13} className="animate-spin" /> : 'Ping Ollama'}
                      </button>
                    </div>
                    {testResults.ollama && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '11.5px',
                        color: testResults.ollama.valid ? 'var(--risk-verified)' : 'var(--risk-critical)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {testResults.ollama.valid ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{testResults.ollama.message}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Live Testing Sandbox */}
              <div className="bs-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Live API Testing Sandbox
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Test your active API keys on any live social media claim or trending narrative in India.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={liveQuery}
                    onChange={(e) => setLiveQuery(e.target.value)}
                    placeholder="Enter claim or topic (e.g. 'Viral video claiming bank run in Mumbai')..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-control)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleLiveVerify}
                    disabled={isVerifying || !geminiKey}
                    className="bs-button bs-button-primary"
                    style={{ fontSize: '11.5px', padding: '6px 14px', gap: '6px' }}
                    title={!geminiKey ? "Enter your Gemini API key above first" : undefined}
                  >
                    {isVerifying ? <RefreshCw size={13} className="animate-spin" /> : <Cpu size={13} />}
                    <span>AI Forensic Verify</span>
                  </button>
                  <button
                    onClick={handleLiveSearch}
                    disabled={isSearching}
                    className="bs-button bs-button-secondary"
                    style={{ fontSize: '11.5px', padding: '6px 14px', gap: '6px' }}
                  >
                    {isSearching ? <RefreshCw size={13} className="animate-spin" /> : <Globe size={13} />}
                    <span>Search Web & Reddit</span>
                  </button>
                </div>

                {/* AI Verdict Display */}
                {liveVerdict && (
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '14px'
                  }}>
                    {liveVerdict.error ? (
                      <div style={{ color: 'var(--risk-critical)', fontSize: '12px' }}>{liveVerdict.error}</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-badge)',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'JetBrains Mono',
                            backgroundColor: liveVerdict.risk_score >= 70 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: liveVerdict.risk_score >= 70 ? 'var(--risk-critical)' : 'var(--risk-verified)'
                          }}>
                            VERDICT: {liveVerdict.verdict}
                          </span>
                          <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                            Risk Score: <strong style={{ color: 'var(--text-heading)' }}>{liveVerdict.risk_score}/100</strong>
                          </span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {liveVerdict.debunk_summary}
                        </p>
                        {liveVerdict.detected_patterns && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {liveVerdict.detected_patterns.map((p, i) => (
                              <span key={i} style={{
                                fontSize: '10.5px',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-badge)',
                                backgroundColor: 'var(--bg-raised)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)'
                              }}>
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Live Social Search Posts */}
                {liveSocialPosts && (
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '10px' }}>
                      Live Social Media Matches for "{liveSocialPosts.query}"
                    </div>

                    {/* Reddit Results */}
                    {liveSocialPosts.platforms?.reddit?.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                          Reddit Discussions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {liveSocialPosts.platforms.reddit.map((p, idx) => (
                            <a
                              key={idx}
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '12px'
                              }}
                            >
                              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px' }}>
                                {p.title}
                              </span>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', flexShrink: 0 }}>
                                {p.score} upvotes • {p.num_comments} comments
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* YouTube Results */}
                    {liveSocialPosts.platforms?.youtube?.length > 0 ? (
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                          YouTube Video Telemetry
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {liveSocialPosts.platforms.youtube.map((v, idx) => (
                            <a
                              key={idx}
                              href={v.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '12px'
                              }}
                            >
                              {v.thumbnail && (
                                <img src={v.thumbnail} alt="" style={{ width: '40px', height: '24px', objectFit: 'cover', borderRadius: '3px' }} />
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {v.title}
                                </div>
                                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{v.channel}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      !youtubeKey && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          (Add your YouTube Data API key above to see live YouTube video search results)
                        </div>
                      )
                    )}
                  </div>
                )}

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
