import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  Tag, 
  Globe, 
  Users, 
  Activity, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  TrendingDown, 
  Radio, 
  Cpu, 
  Zap,
  Info,
  ChevronRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function EnterpriseScopingView({ onNavigate }) {
  const { currentRole, currentUser } = useAuth();

  // State
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [scopedCampaigns, setScopedCampaigns] = useState([]);
  
  // Form State for editing / creating enterprise data
  const [formData, setFormData] = useState({
    name: '',
    industry_sector: '',
    ticker_symbols: '',
    subsidiaries: '',
    executives: '',
    brand_keywords: '',
    official_domains: '',
    threat_threshold: 65,
    is_active: true
  });

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [scanTelemetry, setScanTelemetry] = useState(null);

  // Load profiles from backend
  const loadProfiles = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/enterprise/profiles');
      if (res.ok) {
        const data = await res.json();
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
          const active = data.active_profile || data.profiles[0];
          setActiveProfile(active);
          setSelectedProfileId(active.id);
          populateForm(active);
          loadScopedCampaigns(active.id);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend load profiles failed, using defaults:', e);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const populateForm = (profile) => {
    if (!profile) return;
    setFormData({
      id: profile.id,
      name: profile.name || '',
      industry_sector: profile.industry_sector || '',
      ticker_symbols: (profile.ticker_symbols || []).join(', '),
      subsidiaries: (profile.subsidiaries || []).join(', '),
      executives: (profile.executives || []).join(', '),
      brand_keywords: (profile.brand_keywords || []).join(', '),
      official_domains: (profile.official_domains || []).join(', '),
      threat_threshold: profile.threat_threshold || 65,
      is_active: profile.is_active ?? true
    });
  };

  // Load campaigns matching the selected enterprise profile via ML scoper
  const loadScopedCampaigns = async (profileId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/enterprise/campaigns?profile_id=${profileId || selectedProfileId}`);
      if (res.ok) {
        const data = await res.json();
        setScopedCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.warn('Failed to load scoped campaigns:', e);
    }
  };

  // Select profile card
  const handleSelectProfile = (profile) => {
    setSelectedProfileId(profile.id);
    populateForm(profile);
    setIsCreatingNew(false);
    setIsEditing(false);
    loadScopedCampaigns(profile.id);
  };

  // Activate profile as the primary operational scope
  const handleActivateProfile = async (profileId) => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/enterprise/profile/activate/${profileId}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setActiveProfile(data.profile);
        setStatusMessage({ success: true, text: `Active Enterprise scope switched to "${data.profile.name}". All models will now filter for this entity.` });
        loadProfiles();
      }
    } catch (e) {
      setStatusMessage({ success: false, text: `Failed to activate profile: ${e.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  // Save / Update profile data
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const parseList = (str) => str.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      id: isCreatingNew ? undefined : formData.id,
      name: formData.name,
      industry_sector: formData.industry_sector,
      ticker_symbols: parseList(formData.ticker_symbols),
      subsidiaries: parseList(formData.subsidiaries),
      executives: parseList(formData.executives),
      brand_keywords: parseList(formData.brand_keywords),
      official_domains: parseList(formData.official_domains),
      threat_threshold: Number(formData.threat_threshold),
      is_active: formData.is_active,
      last_updated: new Date().toISOString()
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/enterprise/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setStatusMessage({ success: true, text: `Enterprise data for "${data.profile.name}" updated successfully. ML Scoper synchronized.` });
        setIsEditing(false);
        setIsCreatingNew(false);
        await loadProfiles();
        loadScopedCampaigns(data.profile.id);
      } else {
        throw new Error('Server returned error status');
      }
    } catch (err) {
      setStatusMessage({ success: false, text: `Error saving enterprise profile: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  // Run On-Demand ML Vector Scan for Enterprise Threats
  const handleRunMlScan = async () => {
    setIsScanning(true);
    setScanTelemetry(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/enterprise/ml-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profiles.find(p => p.id === selectedProfileId) || activeProfile
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScanTelemetry(data);
        setScopedCampaigns(data.matching_campaigns || []);
      }
    } catch (e) {
      console.warn('ML Scan failed:', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setFormData({
      id: '',
      name: '',
      industry_sector: '',
      ticker_symbols: '',
      subsidiaries: '',
      executives: '',
      brand_keywords: '',
      official_domains: '',
      threat_threshold: 65,
      is_active: true
    });
  };

  const currentSelected = profiles.find(p => p.id === selectedProfileId) || activeProfile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontFamily: 'JetBrains Mono', 
              color: '#f59e0b', 
              padding: '3px 10px', 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.3)', 
              borderRadius: '9999px', 
              fontWeight: 700 
            }}>
              ENTERPRISE ML SCOPING ENGINE
            </span>
            {activeProfile && (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Active Scope: <strong>{activeProfile.name}</strong>
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '6px', letterSpacing: '-0.5px' }}>
            Enterprise Data Profile & ML Scoping Center
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '750px' }}>
            Configure corporate brand identities, tickers, subsidiaries, and key executives. The ML semantic model vectorizes your enterprise footprint and exclusively isolates related threat campaigns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleRunMlScan}
            disabled={isScanning}
            className="bs-button bs-button-primary"
            style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isScanning ? <RefreshCw size={15} className="animate-spin" /> : <Cpu size={15} />}
            <span>{isScanning ? 'Running ML Vector Scan...' : 'Scan Enterprise Space (ML)'}</span>
          </button>

          <button
            onClick={handleStartCreateNew}
            className="bs-button bs-button-secondary"
            style={{ padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={15} />
            <span>New Enterprise</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage && (
        <div style={{
          backgroundColor: statusMessage.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: statusMessage.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px 18px',
          fontSize: '13px',
          color: statusMessage.success ? '#10b981' : '#ef4444',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={16} />
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace: 2 Columns (Profile Editor / Form & ML Scoped Threat Feed) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px' }}>
        
        {/* Left Column: Enterprise Data Input & Configuration Form */}
        <div className="bs-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={17} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                {isCreatingNew ? 'Create New Enterprise' : 'Enterprise Configuration & ML Scope'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={isCreatingNew ? 'new' : selectedProfileId}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    handleStartCreateNew();
                  } else {
                    const found = profiles.find(p => p.id === e.target.value);
                    if (found) handleSelectProfile(found);
                  }
                }}
                className="bs-input"
                style={{ fontSize: '12px', padding: '5px 10px', height: '32px', minWidth: '180px', backgroundColor: 'var(--bg-muted)' }}
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.is_active ? '(Active)' : ''}
                  </option>
                ))}
                <option value="new">+ Create Custom Enterprise</option>
              </select>

              {!isCreatingNew && currentSelected && !currentSelected.is_active && (
                <button
                  onClick={() => handleActivateProfile(currentSelected.id)}
                  disabled={isSaving}
                  className="bs-button bs-button-primary"
                  style={{ padding: '6px 10px', fontSize: '11px', gap: '4px', height: '32px' }}
                >
                  <Check size={12} />
                  <span>Activate</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Enterprise Legal Entity Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tata Sons & Tata Group Entities"
                className="bs-input"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Industry / Business Sector
              </label>
              <input
                type="text"
                value={formData.industry_sector}
                onChange={e => setFormData({ ...formData, industry_sector: e.target.value })}
                placeholder="e.g. Automotive, Tech, Energy & Aviation"
                className="bs-input"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Stock Ticker Symbols (comma separated)
              </label>
              <input
                type="text"
                value={formData.ticker_symbols}
                onChange={e => setFormData({ ...formData, ticker_symbols: e.target.value })}
                placeholder="e.g. TATAMOTORS, TCS, TATAPOWER, TATASTEEL"
                className="bs-input"
                style={{ width: '100%', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Subsidiaries & Key Brands (comma separated)
              </label>
              <textarea
                rows={2}
                value={formData.subsidiaries}
                onChange={e => setFormData({ ...formData, subsidiaries: e.target.value })}
                placeholder="e.g. Tata Motors, TCS, Air India, Titan Company, Tata Power"
                className="bs-input"
                style={{ width: '100%', fontSize: '12px', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Key Executives & Leadership (comma separated)
              </label>
              <input
                type="text"
                value={formData.executives}
                onChange={e => setFormData({ ...formData, executives: e.target.value })}
                placeholder="e.g. N. Chandrasekaran, PB Balaji, Campbell Wilson"
                className="bs-input"
                style={{ width: '100%', fontSize: '12px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Attack Keywords & Threat Vectors (comma separated)
              </label>
              <textarea
                rows={2}
                value={formData.brand_keywords}
                onChange={e => setFormData({ ...formData, brand_keywords: e.target.value })}
                placeholder="e.g. battery defect, ev fire, layoff freeze, accounting fraud"
                className="bs-input"
                style={{ width: '100%', fontSize: '12px', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Official Domains & Verified Handles (comma separated)
              </label>
              <input
                type="text"
                value={formData.official_domains}
                onChange={e => setFormData({ ...formData, official_domains: e.target.value })}
                placeholder="e.g. tata.com, tatamotors.com, @TataMotors"
                className="bs-input"
                style={{ width: '100%', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Threat Sensitivity Threshold: {formData.threat_threshold}%
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={formData.threat_threshold}
                  onChange={e => setFormData({ ...formData, threat_threshold: e.target.value })}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '14px' }}>
                <input
                  type="checkbox"
                  id="isActiveScope"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <label htmlFor="isActiveScope" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer' }}>
                  Active Scope
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="bs-button bs-button-primary"
                style={{ flex: 1, padding: '11px', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                <span>{isSaving ? 'Synchronizing Model...' : (isCreatingNew ? 'Create Profile & Scope' : 'Update Enterprise Profile')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Scoped Threats & ML Semantic Matching Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* ML Filter Telemetry Box */}
          <div className="bs-card" style={{ padding: '18px 20px', backgroundColor: 'var(--bg-card)', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '12px', fontWeight: 700 }}>
                  <Bot size={15} />
                  <span>ML Semantic Filter Status: ACTIVE</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '2px' }}>
                  Target Entity: {currentSelected?.name || 'Enterprise'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  The ML model filters out general discourse and evaluates cosine distance against configured brand tokens and tickers.
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  CAMPAIGNS SCOPED
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>
                  {scopedCampaigns.length} Threats
                </div>
              </div>
            </div>
          </div>

          {/* Scoped Campaigns List */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>ML Scoped Threat Campaigns for {currentSelected?.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Sorted by ML Match Relevance & Threat Score
              </span>
            </div>

            {scopedCampaigns.length === 0 ? (
              <div className="bs-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <ShieldCheck size={36} style={{ color: '#10b981', margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
                  No Active Malign Swarms Detected for this Profile
                </div>
                <div style={{ fontSize: '12px', maxWidth: '420px', margin: '6px auto 0 auto' }}>
                  The ML model did not detect high-confidence campaign signatures targeting configured subsidiaries or attack keywords.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scopedCampaigns.map(camp => {
                  const relevance = camp.enterprise_relevance || {};
                  const matchScore = relevance.match_score || 85;
                  const matchType = relevance.match_type || 'DIRECT_ENTITY_TARGET';
                  const matchedEntities = relevance.matched_entities || [];

                  return (
                    <div 
                      key={camp.id} 
                      className="bs-card" 
                      style={{ 
                        padding: '16px 18px',
                        borderLeft: camp.threat_score >= 85 ? '4px solid #ef4444' : '4px solid #f59e0b',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontWeight: 700 }}>
                              #{camp.id}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontFamily: 'JetBrains Mono',
                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}>
                              ML MATCH: {matchScore}% ({matchType.replace(/_/g, ' ')})
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: camp.threat_score >= 85 ? '#ef4444' : '#f59e0b',
                              backgroundColor: camp.threat_score >= 85 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              THREAT: {camp.threat_score}/100
                            </span>
                          </div>

                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '6px', marginBottom: '4px' }}>
                            {camp.title}
                          </h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 8px 0' }}>
                            {camp.summary}
                          </p>
                        </div>
                      </div>

                      {/* Matched Entities Pills */}
                      {matchedEntities.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Correlated Vectors:
                          </span>
                          {matchedEntities.map((ent, idx) => (
                            <span key={idx} style={{
                              fontSize: '10px',
                              backgroundColor: 'var(--bg-muted)',
                              border: '1px solid var(--border-color)',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              color: 'var(--text-secondary)'
                            }}>
                              {ent}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Target: <strong>{camp.target}</strong> · Platforms: {camp.platforms?.join(', ') || 'Social Grid'}
                        </div>

                        <button
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('analyst-response');
                            }
                          }}
                          className="bs-button bs-button-primary"
                          style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Sparkles size={13} />
                          <span>Launch Groq Damage Reduction</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
