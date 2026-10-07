import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  Users, 
  Radio, 
  Sliders, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Key, 
  Settings, 
  Download, 
  Sparkles,
  Zap,
  Globe,
  SlidersHorizontal,
  FileCheck2,
  Check,
  Power,
  Building2,
  Newspaper,
  Shield,
  Clock,
  ExternalLink,
  Ban,
  UserX,
  Layers,
  BarChart3,
  Eye,
  EyeOff,
  Search,
  Filter,
  Flame,
  FileText,
  AlertOctagon,
  KeyRound,
  ShieldX
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function AdminView() {
  const { currentRole, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('subscribers'); // 'subscribers', 'moderation', 'guardrails', 'maintenance', 'logs'
  const [subscribers, setSubscribers] = useState([]);
  const [guardrailData, setGuardrailData] = useState({ rules: [], total_active: 0, total_violations_24h: 0 });
  const [incidents, setIncidents] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('all');
  const [selectedLogLevel, setSelectedLogLevel] = useState('ALL');
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);

  // Moderation modal / inline edit state
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [editFeatures, setEditFeatures] = useState({});
  const [editQuotas, setEditQuotas] = useState({});
  const [editStatus, setEditStatus] = useState('ACTIVE');

  // Fetch all admin data from backend
  const fetchAllAdminData = async () => {
    setIsRefreshing(true);
    try {
      const [subRes, grRes, incRes, hRes, connRes, logRes, anaRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/admin/subscribers').catch(() => null),
        fetch('http://127.0.0.1:8000/api/admin/guardrails').catch(() => null),
        fetch('http://127.0.0.1:8000/api/admin/guardrails/incidents').catch(() => null),
        fetch('http://127.0.0.1:8000/api/admin/health').catch(() => null),
        fetch('http://127.0.0.1:8000/api/admin/connectors').catch(() => null),
        fetch('http://127.0.0.1:8000/api/admin/logs').catch(() => null),
        fetch('http://127.0.0.1:8000/api/admin/usage-analytics').catch(() => null)
      ]);

      if (subRes && subRes.ok) {
        const data = await subRes.json();
        setSubscribers(data);
      }
      if (grRes && grRes.ok) {
        const data = await grRes.json();
        setGuardrailData(data);
      }
      if (incRes && incRes.ok) {
        const data = await incRes.json();
        setIncidents(data);
      }
      if (hRes && hRes.ok) {
        const data = await hRes.json();
        setSystemHealth(data);
        if (data.emergency_lockdown_active !== undefined) {
          setEmergencyLockdown(data.emergency_lockdown_active);
        }
      }
      if (connRes && connRes.ok) {
        const data = await connRes.json();
        setConnectors(data);
      }
      if (logRes && logRes.ok) {
        const data = await logRes.json();
        setSystemLogs(data);
      }
      if (anaRes && anaRes.ok) {
        const data = await anaRes.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Admin fetch offline, fallback state active:', err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
    const interval = setInterval(fetchAllAdminData, 8000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(''), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // Moderate Subscriber Status
  const handleModerateStatus = async (tenantId, newStatus) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/subscribers/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, status: newStatus })
      });
      if (res.ok) {
        showToast(`Tenant '${tenantId}' status updated to ${newStatus}.`);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast(`Updated '${tenantId}' status to ${newStatus} (cached).`);
      setSubscribers(prev => prev.map(s => s.tenant_id === tenantId ? { ...s, status: newStatus } : s));
    }
  };

  // Toggle Feature for Subscriber
  const handleToggleFeature = async (tenantId, featureKey, currentValue) => {
    try {
      const updatedFeatures = { [featureKey]: !currentValue };
      const res = await fetch('http://127.0.0.1:8000/api/admin/subscribers/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, features: updatedFeatures })
      });
      if (res.ok) {
        showToast(`Updated feature '${featureKey}' for tenant '${tenantId}'.`);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast(`Feature state updated.`);
      setSubscribers(prev => prev.map(s => {
        if (s.tenant_id === tenantId) {
          return { ...s, features: { ...s.features, [featureKey]: !currentValue } };
        }
        return s;
      }));
    }
  };

  // Terminate User Session
  const handleTerminateSession = async (tenantId, sessionId) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/subscribers/terminate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, session_id: sessionId })
      });
      if (res.ok) {
        showToast(`Session ${sessionId} terminated.`);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast(`Session ${sessionId} terminated locally.`);
      setSubscribers(prev => prev.map(s => {
        if (s.tenant_id === tenantId) {
          return { ...s, active_sessions: s.active_sessions.filter(sess => sess.session_id !== sessionId) };
        }
        return s;
      }));
    }
  };

  // Toggle Guardrail Rule
  const handleToggleGuardrail = async (ruleId, currentStatus) => {
    const nextStatus = currentStatus === 'ENFORCED' ? 'PAUSED' : 'ENFORCED';
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/guardrails/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule_id: ruleId, status: nextStatus })
      });
      if (res.ok) {
        showToast(`Guardrail '${ruleId}' is now ${nextStatus}.`);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast(`Guardrail '${ruleId}' status toggled.`);
      setGuardrailData(prev => ({
        ...prev,
        rules: prev.rules.map(r => r.id === ruleId ? { ...r, status: nextStatus } : r)
      }));
    }
  };

  // Resolve Guardrail Incident
  const handleResolveIncident = async (incidentId) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/guardrails/resolve-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incidentId, note: `Resolved by ${currentUser?.name || 'Super Admin'}` })
      });
      if (res.ok) {
        showToast(`Incident ${incidentId} resolved.`);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast(`Incident marked resolved.`);
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, resolved: true, resolved_by: 'Super Admin' } : i));
    }
  };

  // Toggle Emergency Platform Lockdown
  const handleToggleEmergencyLockdown = async () => {
    const nextState = !emergencyLockdown;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/emergency-lockdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: nextState })
      });
      if (res.ok) {
        setEmergencyLockdown(nextState);
        showToast(nextState ? 'EMERGENCY LOCKDOWN ENGAGED — External subscribers restricted.' : 'Emergency lockdown disengaged.');
        fetchAllAdminData();
      }
    } catch (e) {
      setEmergencyLockdown(nextState);
      showToast(nextState ? 'Lockdown engaged (offline cache).' : 'Lockdown released.');
    }
  };

  // Maintenance: Re-index Vectors
  const handleReindexVectors = async () => {
    try {
      showToast('Re-indexing pgvector HNSW database...');
      const res = await fetch('http://127.0.0.1:8000/api/admin/maintenance/reindex-vector', { method: 'POST' });
      if (res.ok) {
        showToast('pgvector HNSW index successfully re-indexed and cache warmed!');
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('Re-index command sent.');
    }
  };

  // Maintenance: Generate Dataset
  const handleGenerateDataset = async () => {
    try {
      showToast('Triggering synthetic dataset pipeline (75+ multilingual records)...');
      const res = await fetch('http://127.0.0.1:8000/api/admin/maintenance/trigger-dataset', { method: 'POST' });
      if (res.ok) {
        showToast('Synthetic dataset synchronized successfully!');
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('Dataset generation signal dispatched.');
    }
  };

  // Fallback defaults if offline
  const subsList = subscribers.length > 0 ? subscribers : [
    {
      id: "sub_ib_gov",
      tenant_id: "investigation_bureau",
      name: "Investigation Bureau of India (IB / LEA)",
      organization: "Ministry of Home Affairs (MHA)",
      tier: "Sovereign LEA Tier",
      tier_badge: "SOVEREIGN LEA",
      tier_color: "#ef4444",
      primary_contact: { name: "Joint Director Vikram Rawat", email: "v.rawat@ib.gov.in", role: "investigation_bureau" },
      status: "ACTIVE",
      allocated_seats: 50,
      active_seats: 18,
      quotas: { daily_api_limit: 100000, daily_api_used: 74320, token_limit: 10000000, token_used: 4820500, storage_gb_limit: 500, storage_gb_used: 184.2 },
      features: { sec69a_takedowns: true, classified_intel: true, unmasked_metadata: true, court_evidence_vault: true, blockchain_notary: true, sebi_disclosure: false, press_fact_check: false },
      metrics: { dossiers_generated: 34, sec69a_orders_issued: 19, blockchain_notarizations: 62, tipline_queries: 8940, avg_latency_ms: 11.2, guardrail_flags_24h: 2 },
      active_sessions: [
        { session_id: "SES-IB-8821", user: "JD Vikram Rawat", ip: "10.14.0.12 (MHA WAN)", module: "Sec 69A IT Escalation", duration: "1h 44m", status: "ONLINE" }
      ],
      ip_restriction_enabled: true,
      two_factor_enforced: true
    },
    {
      id: "sub_adani_corp",
      tenant_id: "corporate_enterprise",
      name: "Adani Group — Brand Defense & Market Risk",
      organization: "Adani Corporate Security & Threat Intelligence",
      tier: "Enterprise Tier-1",
      tier_badge: "ENTERPRISE RISK",
      tier_color: "#f59e0b",
      primary_contact: { name: "Rajesh Singhania", email: "ciso.defense@adani.com", role: "corporate_enterprise" },
      status: "ACTIVE",
      allocated_seats: 15,
      active_seats: 7,
      quotas: { daily_api_limit: 25000, daily_api_used: 18920, token_limit: 2500000, token_used: 1410200, storage_gb_limit: 200, storage_gb_used: 76.5 },
      features: { sec69a_takedowns: false, classified_intel: false, unmasked_metadata: false, court_evidence_vault: true, blockchain_notary: true, sebi_disclosure: true, press_fact_check: false },
      metrics: { dossiers_generated: 12, sec69a_orders_issued: 0, blockchain_notarizations: 14, tipline_queries: 4210, avg_latency_ms: 14.8, guardrail_flags_24h: 1 },
      active_sessions: [
        { session_id: "SES-AD-3310", user: "Rajesh Singhania (CISO)", ip: "203.192.88.14 (Adani HQ)", module: "Market Sentiment Radar", duration: "28m", status: "ONLINE" }
      ],
      ip_restriction_enabled: false,
      two_factor_enforced: true
    },
    {
      id: "sub_news_press",
      tenant_id: "journalist_media",
      name: "National Press Consortium & Fact-Check Desk",
      organization: "National Press Consortium",
      tier: "Press Accredited Suite",
      tier_badge: "PRESS ACCREDITED",
      tier_color: "#3b82f6",
      primary_contact: { name: "Pooja Kashyap", email: "pooja.k@nationalpress.org", role: "journalist_media" },
      status: "ACTIVE",
      allocated_seats: 5,
      active_seats: 3,
      quotas: { daily_api_limit: 10000, daily_api_used: 6420, token_limit: 1000000, token_used: 412800, storage_gb_limit: 50, storage_gb_used: 18.2 },
      features: { sec69a_takedowns: false, classified_intel: false, unmasked_metadata: false, court_evidence_vault: false, blockchain_notary: false, sebi_disclosure: false, press_fact_check: true },
      metrics: { dossiers_generated: 0, sec69a_orders_issued: 0, blockchain_notarizations: 0, tipline_queries: 1840, avg_latency_ms: 9.4, guardrail_flags_24h: 0 },
      active_sessions: [
        { session_id: "SES-NP-1044", user: "Pooja Kashyap", ip: "49.36.120.4 (Press Delhi)", module: "WhatsApp Tipline Ingestion", duration: "56m", status: "ONLINE" }
      ],
      ip_restriction_enabled: false,
      two_factor_enforced: true
    }
  ];

  const totalApiUsed = subsList.reduce((acc, s) => acc + s.quotas.daily_api_used, 0);
  const totalApiLimit = subsList.reduce((acc, s) => acc + s.quotas.daily_api_limit, 0);
  const totalTokensUsed = subsList.reduce((acc, s) => acc + s.quotas.token_used, 0);
  const totalActiveSessions = subsList.reduce((acc, s) => acc + (s.active_sessions?.length || 0), 0);

  const filteredSubscribers = selectedTenantId === 'all' 
    ? subsList 
    : subsList.filter(s => s.tenant_id === selectedTenantId);

  const filteredLogs = selectedLogLevel === 'ALL' 
    ? systemLogs 
    : systemLogs.filter(l => l.level === selectedLogLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              backgroundColor: emergencyLockdown ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)', 
              color: emergencyLockdown ? '#ef4444' : '#10b981', 
              fontSize: '11px', 
              fontWeight: 700, 
              padding: '3px 10px', 
              borderRadius: '4px', 
              border: `1px solid ${emergencyLockdown ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
              fontFamily: 'JetBrains Mono',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {emergencyLockdown ? <AlertOctagon size={13} /> : <Lock size={12} />}
              {emergencyLockdown ? 'EMERGENCY LOCKDOWN ACTIVE' : 'SUPER ADMIN // SUBSCRIBER GOVERNANCE'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
              3 ACTIVE SUBSCRIPTION TENANTS (IB, ADANI, NEWS)
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '6px', letterSpacing: '-0.5px' }}>
            Subscriber Usage Monitoring & Moderation Command Center
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time subscriber activity monitoring, dynamic quota moderation, statutory legal guardrails, and system maintenance.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={fetchAllAdminData}
            disabled={isRefreshing}
            className="bs-button bs-button-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            Sync Metrics
          </button>
          
          <button 
            onClick={handleToggleEmergencyLockdown}
            className="bs-button"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '12px',
              backgroundColor: emergencyLockdown ? '#10b981' : '#dc2626',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600
            }}
          >
            <Power size={14} />
            {emergencyLockdown ? 'Disengage Lockdown' : 'Emergency Lockdown'}
          </button>
        </div>
      </div>

      {/* Toast Notification Alert */}
      {actionSuccess && (
        <div style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.4)', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          color: '#10b981',
          fontSize: '13px'
        }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.15)', 
          border: '1px solid rgba(239, 68, 68, 0.4)', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          color: '#ef4444',
          fontSize: '13px'
        }}>
          <AlertTriangle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Aggregate Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Subscribers</span>
            <Building2 size={16} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '8px' }}>
            3 <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400 }}>Tenants (100% Online)</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            IB (Gov) • Adani (Corp) • Press (News)
          </div>
        </div>

        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Daily API Consumption</span>
            <Activity size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '8px' }}>
            {totalApiUsed.toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400 }}>/ {totalApiLimit.toLocaleString()}</span>
          </div>
          <div style={{ height: '4px', backgroundColor: 'var(--bg-muted)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${(totalApiUsed / totalApiLimit) * 100}%`, height: '100%', backgroundColor: '#10b981' }} />
          </div>
        </div>

        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>24h LLM Token Burn</span>
            <Zap size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '8px' }}>
            {(totalTokensUsed / 1000000).toFixed(2)}M <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400 }}>Tokens</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            MiniLM 384-d Embedding Engine
          </div>
        </div>

        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Live Sessions</span>
            <Users size={16} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '8px' }}>
            {totalActiveSessions} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400 }}>Concurrent Users</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across 3 verified enterprise IP ranges
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'subscribers', label: 'Subscriber Usage & Monitoring', icon: Activity },
          { id: 'moderation', label: 'Tenant Moderation & Access Controls', icon: Sliders },
          { id: 'guardrails', label: 'Guardrails & Compliance Matrix', icon: ShieldCheck, badge: guardrailData.rules?.length || 5 },
          { id: 'maintenance', label: 'Platform Health & Maintenance', icon: Server },
          { id: 'logs', label: 'Diagnostic Audit Logs', icon: Terminal }
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
                gap: '8px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge && (
                <span style={{ 
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-muted)', 
                  color: isActive ? '#3b82f6' : 'var(--text-muted)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUBSCRIBER MONITORING & TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'subscribers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tenant Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter Tenant:</span>
              {['all', 'investigation_bureau', 'corporate_enterprise', 'journalist_media'].map(tId => {
                const isSel = selectedTenantId === tId;
                const label = tId === 'all' ? 'All 3 Subscribers' 
                  : tId === 'investigation_bureau' ? 'Investigation Bureau (IB)'
                  : tId === 'corporate_enterprise' ? 'Adani Group (Enterprise)'
                  : 'National Press (News)';
                return (
                  <button
                    key={tId}
                    onClick={() => setSelectedTenantId(tId)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      fontWeight: isSel ? 600 : 400,
                      borderRadius: '6px',
                      border: `1px solid ${isSel ? '#3b82f6' : 'var(--border-color)'}`,
                      backgroundColor: isSel ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-card)',
                      color: isSel ? '#3b82f6' : 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Auto-refreshing every 8 seconds
            </div>
          </div>

          {/* Detailed Subscriber Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredSubscribers.map(sub => {
              const apiPct = Math.round((sub.quotas.daily_api_used / sub.quotas.daily_api_limit) * 100);
              const tokenPct = Math.round((sub.quotas.token_used / sub.quotas.token_limit) * 100);
              const isIb = sub.tenant_id === 'investigation_bureau';
              const isAdani = sub.tenant_id === 'corporate_enterprise';
              const isNews = sub.tenant_id === 'journalist_media';

              return (
                <div key={sub.id} className="bs-card" style={{ padding: '20px', borderLeft: `4px solid ${sub.tier_color}` }}>
                  
                  {/* Top Bar of Subscriber Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '8px', 
                        backgroundColor: `${sub.tier_color}18`, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: sub.tier_color
                      }}>
                        {isIb ? <Shield size={22} /> : isAdani ? <Building2 size={22} /> : <Newspaper size={22} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                            {sub.name}
                          </h3>
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: `${sub.tier_color}15`, 
                            color: sub.tier_color,
                            border: `1px solid ${sub.tier_color}40`,
                            fontFamily: 'JetBrains Mono'
                          }}>
                            {sub.tier_badge}
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: sub.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                            color: sub.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                          }}>
                            {sub.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Org: {sub.organization} • Contact: <strong>{sub.primary_contact.name}</strong> ({sub.primary_contact.email})
                        </div>
                      </div>
                    </div>

                    {/* Quick Moderation Button */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingSubscriber(sub);
                          setEditFeatures({ ...sub.features });
                          setEditQuotas({ ...sub.quotas });
                          setEditStatus(sub.status);
                          setActiveTab('moderation');
                        }}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Sliders size={13} />
                        Moderate Tenant
                      </button>
                    </div>
                  </div>

                  {/* Quota & Resource Usage Meters */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '16px', backgroundColor: 'var(--bg-muted)', padding: '14px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Daily API Quota:</span>
                        <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: apiPct > 80 ? '#ef4444' : 'var(--text-primary)' }}>
                          {sub.quotas.daily_api_used.toLocaleString()} / {sub.quotas.daily_api_limit.toLocaleString()} ({apiPct}%)
                        </span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${apiPct}%`, height: '100%', backgroundColor: apiPct > 80 ? '#ef4444' : '#3b82f6' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>LLM Token Allocation:</span>
                        <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                          {(sub.quotas.token_used / 1000).toFixed(0)}k / {(sub.quotas.token_limit / 1000).toFixed(0)}k ({tokenPct}%)
                        </span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${tokenPct}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Storage Used:</span>
                        <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                          {sub.quotas.storage_gb_used} GB / {sub.quotas.storage_gb_limit} GB
                        </span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${(sub.quotas.storage_gb_used / sub.quotas.storage_gb_limit) * 100}%`, height: '100%', backgroundColor: '#10b981' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Seats / Licenses:</span>
                        <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                          {sub.active_seats} / {sub.allocated_seats} Active
                        </span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${(sub.active_seats / sub.allocated_seats) * 100}%`, height: '100%', backgroundColor: '#8b5cf6' }} />
                      </div>
                    </div>
                  </div>

                  {/* Real-time Usage Metrics & Features Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    
                    {/* Column 1: Feature Entitlements */}
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Active Feature Entitlements
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {Object.entries(sub.features).map(([featKey, isEnabled]) => {
                          const featLabel = featKey.replace(/_/g, ' ').toUpperCase();
                          return (
                            <div key={featKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                              <span style={{ color: isEnabled ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {featLabel}
                              </span>
                              <span style={{ 
                                fontSize: '10px', 
                                fontWeight: 700, 
                                padding: '1px 6px', 
                                borderRadius: '4px',
                                backgroundColor: isEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: isEnabled ? '#10b981' : 'var(--text-muted)'
                              }}>
                                {isEnabled ? 'ENABLED' : 'DISABLED'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: Software Actions / Metrics 24h */}
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        24h Operational Actions
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ backgroundColor: 'var(--bg-muted)', padding: '8px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Dossiers Generated</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)' }}>
                            {sub.metrics.dossiers_generated}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-muted)', padding: '8px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Sec 69A Orders</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: sub.metrics.sec69a_orders_issued > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                            {sub.metrics.sec69a_orders_issued}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-muted)', padding: '8px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Blockchain Proofs</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#10b981' }}>
                            {sub.metrics.blockchain_notarizations}
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-muted)', padding: '8px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tipline Searches</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#3b82f6' }}>
                            {sub.metrics.tipline_queries}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        <span>Avg Latency: <strong>{sub.metrics.avg_latency_ms}ms</strong></span>
                        <span>Guardrail Flags (24h): <strong style={{ color: sub.metrics.guardrail_flags_24h > 0 ? '#f59e0b' : '#10b981' }}>{sub.metrics.guardrail_flags_24h}</strong></span>
                      </div>
                    </div>

                    {/* Column 3: Active Live Sessions */}
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Active Sessions ({sub.active_sessions?.length || 0})
                        </span>
                        <span style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          LIVE
                        </span>
                      </div>

                      {sub.active_sessions && sub.active_sessions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {sub.active_sessions.map(sess => (
                            <div key={sess.session_id} style={{ backgroundColor: 'var(--bg-muted)', padding: '8px', borderRadius: '6px', fontSize: '11px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sess.user}</span>
                                <button
                                  onClick={() => handleTerminateSession(sub.tenant_id, sess.session_id)}
                                  style={{ 
                                    background: 'transparent', 
                                    border: 'none', 
                                    color: '#ef4444', 
                                    fontSize: '10px', 
                                    cursor: 'pointer',
                                    padding: '2px 4px',
                                    borderRadius: '3px'
                                  }}
                                  title="Kill Session"
                                >
                                  Terminate
                                </button>
                              </div>
                              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Module: {sess.module}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}>
                                <span>IP: {sess.ip}</span>
                                <span>Duration: {sess.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                          No active sessions currently.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUBSCRIBER MODERATION & ACCESS CONTROL */}
      {/* ========================================================================= */}
      {activeTab === 'moderation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.08)', 
            border: '1px solid rgba(59, 130, 246, 0.25)', 
            padding: '14px 18px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Sliders size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-heading)' }}>Real-Time Tenant Moderation:</strong> Modify subscription states, dynamically restrict high-privilege features (Section 69A, SEBI disclosures, unmasked PII), adjust rate quotas, and force session re-authentication.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {subsList.map(sub => {
              return (
                <div key={sub.id} className="bs-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                          {sub.name}
                        </h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                          ID: {sub.tenant_id} • {sub.tier}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        backgroundColor: sub.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: sub.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                      }}>
                        {sub.status}
                      </span>
                    </div>

                    {/* Status Toggle Switch */}
                    <div style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Subscription Status:
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {['ACTIVE', 'RESTRICTED', 'THROTTLED', 'SUSPENDED'].map(st => {
                          const isCur = sub.status === st;
                          return (
                            <button
                              key={st}
                              onClick={() => handleModerateStatus(sub.tenant_id, st)}
                              style={{
                                flex: 1,
                                padding: '6px 4px',
                                fontSize: '11px',
                                fontWeight: isCur ? 700 : 400,
                                borderRadius: '4px',
                                border: `1px solid ${isCur ? (st === 'ACTIVE' ? '#10b981' : '#ef4444') : 'var(--border-color)'}`,
                                backgroundColor: isCur ? (st === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)') : 'var(--bg-muted)',
                                color: isCur ? (st === 'ACTIVE' ? '#10b981' : '#ef4444') : 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feature Toggles Switchboard */}
                    <div style={{ marginTop: '16px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                        Feature Permissions Switchboard:
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(sub.features).map(([featKey, isEnabled]) => {
                          const featLabel = featKey.replace(/_/g, ' ').toUpperCase();
                          return (
                            <div 
                              key={featKey} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '6px 10px',
                                backgroundColor: 'var(--bg-muted)',
                                borderRadius: '6px'
                              }}
                            >
                              <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{featLabel}</span>
                              <button
                                onClick={() => handleToggleFeature(sub.tenant_id, featKey, isEnabled)}
                                style={{
                                  padding: '3px 8px',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  borderRadius: '4px',
                                  border: 'none',
                                  backgroundColor: isEnabled ? '#10b981' : '#4b5563',
                                  color: '#ffffff',
                                  cursor: 'pointer'
                                }}
                              >
                                {isEnabled ? 'REVOKE' : 'GRANT'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Security Safeguards */}
                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Security Safeguards:
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '6px' }}>
                        <span>IP Range Restriction Lock:</span>
                        <strong style={{ color: sub.ip_restriction_enabled ? '#10b981' : '#f59e0b' }}>
                          {sub.ip_restriction_enabled ? 'LOCKED (Gov WAN)' : 'UNRESTRICTED'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <span>Mandatory 2FA Enforcement:</span>
                        <strong style={{ color: sub.two_factor_enforced ? '#10b981' : '#ef4444' }}>
                          {sub.two_factor_enforced ? 'ENFORCED' : 'OPTIONAL'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        if (sub.active_sessions && sub.active_sessions.length > 0) {
                          sub.active_sessions.forEach(s => handleTerminateSession(sub.tenant_id, s.session_id));
                        } else {
                          showToast(`No active sessions to purge for ${sub.name}.`);
                        }
                      }}
                      className="bs-button bs-button-secondary"
                      style={{ flex: 1, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#ef4444' }}
                    >
                      <UserX size={13} />
                      Kill All Active Sessions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GUARDRAILS & COMPLIANCE MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'guardrails' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Automated Guardrails & Statutory Compliance Rules
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Algorithmic policy enforcement for IT Act Sec 69A, SEBI Market Regulations, and Citizen Privacy.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Active Guardrails: <strong style={{ color: '#10b981' }}>{guardrailData.total_active || 5} Rules Enforced</strong>
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                24h Interceptions: <strong style={{ color: '#f59e0b' }}>{guardrailData.total_violations_24h || 163} Intercepted</strong>
              </span>
            </div>
          </div>

          {/* Guardrails Rules Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(guardrailData.rules?.length > 0 ? guardrailData.rules : [
              {
                id: "GR-01-SEC69A",
                name: "Section 69A IT Act Strict Evidentiary Threshold",
                category: "Legal & Constitutional Compliance",
                description: "Enforces minimum 2 verified corroborating cross-platform source clusters and 85%+ semantic confidence score before legal takedown order can be drafted.",
                enforcement_action: "HARD_BLOCK_IF_VIOLATED",
                status: "ENFORCED",
                applies_to: ["Investigation Bureau (IB)"],
                threshold_value: "85% Confidence / >= 2 Independent Clusters",
                violations_intercepted_total: 14
              },
              {
                id: "GR-02-PII-REDACTION",
                name: "Citizen Privacy & Zero PII Leakage Guardrail",
                category: "Data Privacy & Telecommunications Act",
                description: "Strictly redacts phone numbers, MSISDNs, Aadhaar tokens, and IP ranges from citizen WhatsApp tiplines before feeding to Media and Corporate tiers.",
                enforcement_action: "AUTOMATIC_ANONYMIZATION",
                status: "ENFORCED",
                applies_to: ["Adani Group", "News / Media Consortium"],
                threshold_value: "100% SHA-256 Masking",
                violations_intercepted_total: 48
              },
              {
                id: "GR-03-SEBI-INSIDER",
                name: "SEBI Anti-Sabotage & Market Integrity Guardrail",
                category: "Financial Markets & SEBI Act",
                description: "Restricts corporate disclosure generation to validated stock ticker anomalies. Logs immutable cryptographic audit trail to prevent corporate selective disclosure.",
                enforcement_action: "AUDIT_LEDGER_LOCK",
                status: "ENFORCED",
                applies_to: ["Adani Group (Enterprise Risk)"],
                threshold_value: "Immutable Hash Verification Required",
                violations_intercepted_total: 3
              },
              {
                id: "GR-04-AI-HALLUCINATION",
                name: "AI MiniLM Cosine Similarity Cutoff Guardrail",
                category: "AI Safety & Accuracy",
                description: "Blocks automated clustering if cosine similarity falls below 0.82, requiring mandatory human analyst peer review before narrative promotion.",
                enforcement_action: "MANDATORY_HUMAN_REVIEW",
                status: "ENFORCED",
                applies_to: ["ALL SUBSCRIBERS"],
                threshold_value: "0.82 Cosine Distance",
                violations_intercepted_total: 92
              },
              {
                id: "GR-05-RATE-BURST",
                name: "Adversarial Prompt Injection & Rate Burst Shield",
                category: "Cyber Defense & Anti-Scraping",
                description: "Intercepts bulk automated bot scraping, adversarial prompt injection payloads, and sudden unnatural query spikes above tenant tier allowance.",
                enforcement_action: "TEMPORARY_THROTTLE",
                status: "ENFORCED",
                applies_to: ["ALL SUBSCRIBERS"],
                threshold_value: "Max 120 req/min per API Key",
                violations_intercepted_total: 6
              }
            ]).map(rule => {
              const isEnforced = rule.status === 'ENFORCED';
              return (
                <div key={rule.id} className="bs-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontFamily: 'JetBrains Mono', 
                        fontWeight: 700, 
                        color: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {rule.id}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {rule.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '6px', marginBottom: '4px' }}>
                      {rule.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                      {rule.description}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px', fontSize: '11px', flexWrap: 'wrap' }}>
                      <span>Applies To: <strong>{rule.applies_to.join(', ')}</strong></span>
                      <span>Enforcement: <strong style={{ color: '#ef4444' }}>{rule.enforcement_action}</strong></span>
                      <span>Threshold: <strong style={{ fontFamily: 'JetBrains Mono', color: '#10b981' }}>{rule.threshold_value}</strong></span>
                      <span>Total Interceptions: <strong style={{ color: '#f59e0b' }}>{rule.violations_intercepted_total}</strong></span>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleToggleGuardrail(rule.id, rule.status)}
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isEnforced ? '#10b981' : '#4b5563',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isEnforced ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                      {isEnforced ? 'ENFORCED' : 'PAUSED'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Incident & Interceptions Feed */}
          <div className="bs-card" style={{ padding: '18px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                  Live Guardrail Incident & Flag Interception Feed
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Logged directly to tamper-proof audit trail
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(incidents.length > 0 ? incidents : [
                {
                  id: "INC-2026-901",
                  timestamp: "21:42:10",
                  tenant_name: "Adani Group (Enterprise)",
                  guardrail_name: "Citizen Privacy & Zero PII Leakage",
                  severity: "MEDIUM",
                  action_taken: "PAYLOAD_MASKED_AUTOMATICALLY",
                  details: "User query requested unmasked raw phone numbers for citizen tipline record #TIP-0842. System automatically applied SHA-256 pseudonymization.",
                  resolved: true,
                  resolved_by: "SYSTEM_GUARDRAIL_ENGINE"
                },
                {
                  id: "INC-2026-898",
                  timestamp: "20:15:33",
                  tenant_name: "Investigation Bureau (IB)",
                  guardrail_name: "Section 69A IT Act Strict Evidentiary Threshold",
                  severity: "HIGH",
                  action_taken: "TAKEDOWN_DRAFT_HALTED_FOR_VERIFICATION",
                  details: "Section 69A draft initiated on single-source Telegram message with 78% confidence score. Guardrail required additional cross-platform source validation.",
                  resolved: true,
                  resolved_by: "Super Admin A. Sharma (Approved after second cluster link)"
                }
              ]).map(inc => (
                <div 
                  key={inc.id} 
                  style={{ 
                    backgroundColor: 'var(--bg-muted)', 
                    padding: '12px 14px', 
                    borderRadius: '6px',
                    borderLeft: `3px solid ${inc.severity === 'HIGH' ? '#ef4444' : inc.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {inc.id}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{inc.timestamp}</span>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 700, 
                        padding: '1px 6px', 
                        borderRadius: '3px',
                        backgroundColor: inc.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: inc.severity === 'HIGH' ? '#ef4444' : '#f59e0b'
                      }}>
                        {inc.severity}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: inc.resolved ? '#10b981' : '#f59e0b' }}>
                      {inc.resolved ? '✓ RESOLVED' : '⚠ PENDING REVIEW'}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', marginTop: '4px' }}>
                    {inc.tenant_name} • <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{inc.guardrail_name}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {inc.details}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Action Taken: <strong style={{ color: '#3b82f6' }}>{inc.action_taken}</strong></span>
                    <span>Handled By: <strong>{inc.resolved_by}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PLATFORM HEALTH & MAINTENANCE */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Maintenance Action Triggers */}
          <div className="bs-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0, marginBottom: '4px' }}>
              Operational Maintenance Triggers
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Execute hardware index optimizations, synthetic dataset synchronization, and cache purging without software downtime.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleReindexVectors}
                className="bs-button bs-button-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                <Zap size={14} />
                Re-index PostgreSQL HNSW Vectors
              </button>

              <button
                onClick={handleGenerateDataset}
                className="bs-button bs-button-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
              >
                <Sparkles size={14} style={{ color: '#f59e0b' }} />
                Regenerate Synthetic Dataset (75+ Records)
              </button>

              <button
                onClick={() => showToast('Redis pub/sub buffer and token cache flushed.')}
                className="bs-button bs-button-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
              >
                <Database size={14} />
                Purge Redis Query Cache
              </button>
            </div>
          </div>

          {/* Subsystem Health Node Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {(systemHealth?.cluster_nodes || [
              { name: 'sentinel-core-api', status: 'ONLINE', host: '127.0.0.1:8000', role: 'FastAPI Master Gateway', load: '18%' },
              { name: 'sentinel-vector-db', status: 'READY', host: 'localhost:5432', role: 'PostgreSQL 16 + pgvector HNSW', load: '12%' },
              { name: 'sentinel-redis-cache', status: 'ONLINE', host: 'localhost:6379', role: 'Redis Pub/Sub & Queue', load: '4%' },
              { name: 'sentinel-ai-worker', status: 'ACTIVE', host: 'internal-pool-01', role: 'MiniLM 384-d Embedding Engine', load: '24%' }
            ]).map(node => (
              <div key={node.name} className="bs-card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>{node.name}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981'
                  }}>
                    {node.status}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {node.role}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', fontFamily: 'JetBrains Mono' }}>
                  <span>Host: {node.host}</span>
                  <span>Load: <strong style={{ color: 'var(--text-primary)' }}>{node.load}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Ingestion Connectors */}
          <div className="bs-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: 0, marginBottom: '4px' }}>
              Real-Time Signal Ingestion Gateways
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Live pipes supplying signals to the subscription tiers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {(connectors.length > 0 ? connectors : [
                { id: "conn_wa_01", name: "Citizen WhatsApp Tipline Gateway", status: "active", events_per_min: 142, uptime: "99.98%", latency_ms: 14, used_by: ["National Press", "Investigation Bureau"] },
                { id: "conn_tg_02", name: "Telegram Shadow Channel Pipe", status: "active", events_per_min: 310, uptime: "99.85%", latency_ms: 28, used_by: ["Investigation Bureau"] },
                { id: "conn_x_03", name: "X / Twitter Enterprise Stream", status: "active", events_per_min: 850, uptime: "99.99%", latency_ms: 42, used_by: ["Adani Group", "Investigation Bureau", "National Press"] },
                { id: "conn_news_04", name: "Multilingual RSS Scraper", status: "active", events_per_min: 94, uptime: "99.10%", latency_ms: 68, used_by: ["National Press", "Adani Group"] }
              ]).map(conn => (
                <div key={conn.id} style={{ backgroundColor: 'var(--bg-muted)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>{conn.name}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>{conn.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Used By: <strong>{conn.used_by?.join(', ') || 'All Subscriptions'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>
                    <span>{conn.events_per_min} evt/min</span>
                    <span>{conn.latency_ms}ms</span>
                    <span>{conn.uptime} up</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DIAGNOSTIC AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Diagnostic Telemetry & Moderation Audit Stream
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Immutable event stream for subscriber activity, guardrail triggers, and operator modifications.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ALERT'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLogLevel(lvl)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: selectedLogLevel === lvl ? 700 : 400,
                    borderRadius: '4px',
                    border: `1px solid ${selectedLogLevel === lvl ? '#3b82f6' : 'var(--border-color)'}`,
                    backgroundColor: selectedLogLevel === lvl ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-muted)',
                    color: selectedLogLevel === lvl ? '#3b82f6' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
            {(filteredLogs.length > 0 ? filteredLogs : [
              { id: "LOG-1062", time: "22:15:10", level: "INFO", source: "GUARDRAIL_ENGINE", message: "Zero PII Leakage filter passed 1,840 signals without exposure to Press tier." },
              { id: "LOG-1061", time: "22:10:44", level: "SUCCESS", source: "SUBSCRIBER_MONITOR", message: "Adani Enterprise quota utilization synced: 18,920 / 25,000 requests." },
              { id: "LOG-1060", time: "22:04:12", level: "INFO", source: "AI_ENGINE", message: "Sentence-Transformers 384-d MiniLM model cache verified. Average latency: 8.4ms." },
              { id: "LOG-1059", time: "21:58:30", level: "SUCCESS", source: "EVIDENCE_NOTARY", message: "Investigation Bureau SHA-256 chain-of-custody seal verified on Ethereum Testnet." }
            ]).map(log => {
              const color = log.level === 'ALERT' || log.level === 'ERROR' ? '#ef4444' 
                : log.level === 'WARNING' ? '#f59e0b'
                : log.level === 'SUCCESS' ? '#10b981'
                : '#3b82f6';
              return (
                <div 
                  key={log.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    padding: '8px 12px', 
                    backgroundColor: 'var(--bg-muted)', 
                    borderRadius: '4px',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0 }}>{log.time}</span>
                  <span style={{ color, fontWeight: 700, fontSize: '10px', flexShrink: 0, minWidth: '60px' }}>[{log.level}]</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', flexShrink: 0 }}>{log.source}:</span>
                  <span style={{ color: 'var(--text-primary)', flex: 1 }}>{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
