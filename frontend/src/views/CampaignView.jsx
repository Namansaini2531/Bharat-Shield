import React, { useState, useEffect } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { 
  AlertTriangle, 
  Share2, 
  Bot, 
  Radio,
  RefreshCw, 
  Download, 
  ZoomIn, 
  FileText, 
  Clock, 
  Languages, 
  Server,
  ShieldAlert,
  Building2,
  Newspaper,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';

export default function CampaignView() {
  const { currentRole, currentUser, executeProtectedAction, can } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState(null);

  // Fetch role-specific campaigns from backend
  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/campaigns?role=${currentRole}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCampaigns(data);
            setSelectedCampaignId(data[0].id);
          }
        }
      } catch (e) {
        console.warn('Backend fetch failed, using role fallback campaigns', e);
      } finally {
        setLoading(false);
      }
    }
    loadCampaigns();
  }, [currentRole]);

  // Fallback defaults if backend is unreachable
  const fallbackCampaignsByRole = {
    [ROLES.INVESTIGATION_BUREAU]: [
      {
        id: 'CMP-007',
        title: 'Operation Echo: Telecom & Critical Grid Sabotage',
        category: 'National Security / Disinformation Warfare',
        status: 'ACTIVE_CRITICAL',
        threat_score: 94,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Punjabi', 'English'],
        platforms: ['twitter', 'telegram', 'whatsapp'],
        post_count: 842,
        cross_platform_sync: 96,
        target: 'National Critical Infrastructure & Public Law & Order',
        summary: 'Coordinated synthetic campaign spreading false claims of nationwide communication blackout to trigger civic panic and bank runs.'
      },
      {
        id: 'CMP-011',
        title: 'Operation Redacted: Border Sector Coordinated Proxy Swarm',
        category: 'Cross-Border Cyber Operations',
        status: 'MONITORING',
        threat_score: 88,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Urdu', 'Hindi'],
        platforms: ['twitter', 'telegram'],
        post_count: 412,
        cross_platform_sync: 89,
        target: 'Defense Personnel & Northern Logistics Hubs',
        summary: 'Coordinated bot network deploying deepfake operational orders targeting border transit networks.'
      }
    ],
    [ROLES.CORPORATE_ENTERPRISE]: [
      {
        id: 'CMP-ADANI-009',
        title: 'Coordinated Short-Seller Disinformation Swarm (Port Operations)',
        category: 'Market Manipulation & Short Sabotage',
        status: 'ACTIVE_HIGH',
        threat_score: 91,
        confidence: 'HIGH',
        primary_language: 'en',
        languages_detected: ['English', 'Gujarati', 'Hindi'],
        platforms: ['twitter', 'telegram', 'news'],
        post_count: 1280,
        cross_platform_sync: 93,
        target: 'Adani Ports & SEZ (APSEZ) Share Price & ESG Ratings',
        summary: 'Synchronized release of fabricated environmental and customs non-compliance documents on shadow financial Telegram channels prior to market opening.'
      },
      {
        id: 'CMP-ADANI-014',
        title: 'Deepfake Voice Note Attack on Executive Financial Solvency',
        category: 'Executive Deepfake Phishing & Defamation',
        status: 'FORENSIC_TRIAGE',
        threat_score: 87,
        confidence: 'HIGH',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'telegram'],
        post_count: 520,
        cross_platform_sync: 88,
        target: 'Adani Enterprises Leadership & Institutional Bondholders',
        summary: 'AI voice synthesis impersonating Group CFO discussing fictional credit default swaps and asset revaluations.'
      }
    ],
    [ROLES.JOURNALIST_MEDIA]: [
      {
        id: 'FACT-007',
        title: 'Nationwide Internet & Power Shutdown Hoax Mutation Tree',
        category: 'Citizen WhatsApp Debunk & Fact-Check',
        status: 'VIRAL_SPIKE',
        threat_score: 89,
        confidence: 'HIGH',
        primary_language: 'hi-Latn',
        languages_detected: ['Hindi', 'Hinglish', 'Bengali', 'Marathi', 'English'],
        platforms: ['whatsapp', 'telegram', 'facebook'],
        post_count: 3490,
        cross_platform_sync: 94,
        target: 'General Public & Civic Communities',
        summary: 'Multi-lingual viral forward falsely citing Department of Telecom order to induce emergency ATM withdrawals and fuel hoarding.'
      },
      {
        id: 'FACT-011',
        title: 'Synthetic Audio Clip Claiming Regional Bank Moratorium',
        category: 'Financial Disinformation Fact-Check',
        status: 'DEBUNKED',
        threat_score: 82,
        confidence: 'HIGH',
        primary_language: 'hi',
        languages_detected: ['Hindi', 'English'],
        platforms: ['whatsapp', 'twitter'],
        post_count: 1840,
        cross_platform_sync: 91,
        target: 'Retail Depositors & Urban Cooperatives',
        summary: 'Fabricated voice clip of RBI Governor allegedly restricting cash withdrawals in northern states.'
      }
    ]
  };

  const activeCampaignsList = campaigns.length > 0 ? campaigns : (fallbackCampaignsByRole[currentRole] || fallbackCampaignsByRole[ROLES.INVESTIGATION_BUREAU]);
  const activeCampaign = activeCampaignsList.find(c => c.id === selectedCampaignId) || activeCampaignsList[0];

  const handleExecuteAction = async (actionType) => {
    setActionStatus({ loading: true, message: 'Verifying RBAC clearance and executing...' });
    try {
      const res = await executeProtectedAction(actionType, activeCampaign.id);
      setActionStatus({
        success: true,
        loading: false,
        message: res.message || 'Action executed successfully!',
        txHash: res.cryptographic_signature
      });
      setTimeout(() => setActionStatus(null), 5000);
    } catch (err) {
      setActionStatus({
        success: false,
        loading: false,
        message: err.message || 'Execution failed due to RBAC restrictions'
      });
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  return (
    <div>
      {/* Workspace Header with Persona Clearance & Campaign Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: currentUser.badgeColor, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {currentUser.badgeText}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {currentUser.clearance}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
              Campaign Intelligence Graph
            </h2>
          </div>

          {/* Campaign Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {activeCampaignsList.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCampaignId(c.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: selectedCampaignId === c.id ? `1px solid ${currentUser.badgeColor}` : '1px solid var(--border-color)',
                  backgroundColor: selectedCampaignId === c.id ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-card)',
                  color: selectedCampaignId === c.id ? 'var(--text-heading)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono', color: currentUser.badgeColor }}>{c.id}</span>
                <span>{c.title.split(':')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Badge */}
        <div style={{
          padding: '8px 16px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444'
        }}>
          <AlertTriangle size={14} />
          <span>OPERATIONAL CLEARANCE: {currentUser.roleTitle.split('—')[0]}</span>
        </div>
      </div>

      {/* Action Status Toast Banner */}
      {actionStatus && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '18px',
          backgroundColor: actionStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: actionStatus.success ? '1px solid #10b981' : '1px solid #ef4444',
          color: actionStatus.success ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {actionStatus.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{actionStatus.message}</span>
          </div>
          {actionStatus.txHash && (
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-muted)' }}>
              TX: {actionStatus.txHash.slice(0, 18)}...
            </span>
          )}
        </div>
      )}

      {/* Top Metric Gauges (Tailored to Active Campaign) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Metric 1 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            THREAT SEVERITY SCORE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono' }}>
              {activeCampaign.threat_score || 94}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100 (CONF: {activeCampaign.confidence || 'HIGH'})</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: `${activeCampaign.threat_score || 94}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            CROSS-PLATFORM SYNC
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono' }}>
              {activeCampaign.cross_platform_sync || 93}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>temporal burst</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: `${activeCampaign.cross_platform_sync || 93}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            POSTS & SIGNALS CAPTURED
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>
              {activeCampaign.post_count?.toLocaleString() || 842}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>nodes</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '85%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '9999px' }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bs-card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            DETECTED JURISDICTION
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeCampaign.languages_detected?.join(', ') || 'Hindi, English'}
            </span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '9999px' }} />
          </div>
        </div>

      </div>

      {/* Main Investigation Row: Propagation Topology Map & Investigation Vectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Graph Card */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={16} style={{ color: '#06b6d4' }} />
              <span>Multi-Hop Propagation Topology ({activeCampaign.id})</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="bs-button bs-button-secondary" style={{ padding: '6px 10px', fontSize: '11px', gap: '6px' }}>
                <Download size={12} /> Export Graph
              </button>
            </div>
          </div>

          {/* Interactive Topology Graph Area */}
          <div style={{ 
            flex: 1, 
            minHeight: '360px', 
            backgroundColor: 'var(--inner-box-bg)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top Node Legend */}
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Root Botnet Seed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Relay Node (Telegram / X)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Ingested Tipline Intercept
              </span>
            </div>

            {/* Campaign Visual Topology Representation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '30px 10px'
            }}>
              {/* Seed Node */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  margin: '0 auto 8px',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
                }}>
                  <Bot size={26} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Origin Seed</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cross-Border IP Cluster</div>
              </div>

              <div style={{ height: '2px', flex: 1, backgroundColor: '#3b82f6', margin: '0 10px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '40%', fontSize: '9px', color: '#60a5fa', backgroundColor: 'var(--bg-card)', padding: '1px 6px', borderRadius: '4px' }}>
                  +96.2% sync
                </div>
              </div>

              {/* Amplification Layer */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  margin: '0 auto 8px',
                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
                }}>
                  <Share2 size={24} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Synthetic Swarm</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>42 Coordinated Bots</div>
              </div>

              <div style={{ height: '2px', flex: 1, backgroundColor: '#10b981', margin: '0 10px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '40%', fontSize: '9px', color: '#34d399', backgroundColor: 'var(--bg-card)', padding: '1px 6px', borderRadius: '4px' }}>
                  Cross-Lingual
                </div>
              </div>

              {/* Target / Victim Domain */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  margin: '0 auto 8px',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}>
                  <Layers size={24} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Target Domain</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activeCampaign.target.split('&')[0]}</div>
              </div>
            </div>

            {/* Bottom Target Context Box */}
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              lineHeight: 1.4,
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--text-heading)' }}>Operational Narrative: </strong>
              {activeCampaign.summary}
            </div>
          </div>
        </div>

        {/* Right Column: Role-Authorized Countermeasures */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Sparkles size={16} style={{ color: currentUser.badgeColor }} />
              <span>Authorized Response Toolkit</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Actions permitted under <strong style={{ color: currentUser.badgeColor }}>{currentUser.roleTitle}</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Action 1: Sec 69A IT Act (IB Only) */}
              {can('canIssueSec69A') && (
                <button
                  onClick={() => handleExecuteAction('sec69a_takedown')}
                  className="bs-button"
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Issue Sec 69A Emergency Takedown</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {/* Action 2: SEBI / Corporate Counter-Brief (Corporate Only) */}
              {can('canGenerateSEBIDisclosure') && (
                <button
                  onClick={() => handleExecuteAction('bse_clarification')}
                  className="bs-button"
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    border: 'none',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Dispatch BSE/NSE Clarification Dossier</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {/* Action 3: Fact-Check Debunk Publish (Media Only) */}
              {can('canPublishFactCheck') && (
                <button
                  onClick={() => handleExecuteAction('publish_factcheck')}
                  className="bs-button"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Broadcast Fact-Check Debunk Card</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {/* Action 4: Notarize Blockchain Evidence (IB & Corporate) */}
              {can('canSignBlockchainEvidence') && (
                <button
                  onClick={() => handleExecuteAction('blockchain_notarize')}
                  className="bs-button bs-button-secondary"
                  style={{
                    padding: '9px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Notarize on EVM Blockchain</span>
                  <Lock size={14} />
                </button>
              )}
            </div>

            {/* Clearance Footer */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={13} style={{ color: '#10b981' }} />
              <span>Cryptographic digital signature verified for {currentUser.name}</span>
            </div>
          </div>

          {/* Target Impact Summary Card */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '10px' }}>
              Target Asset Vector
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ marginBottom: '6px' }}>
                <strong>Classification:</strong> {activeCampaign.category}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Primary Vector:</strong> {activeCampaign.target}
              </div>
              <div>
                <strong>Supported Platforms:</strong> {activeCampaign.platforms?.map(p => p.toUpperCase()).join(', ')}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
