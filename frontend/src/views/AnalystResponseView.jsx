import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  UserPlus, 
  Flag, 
  Eye, 
  ChevronRight, 
  FileText, 
  Lock, 
  Building2, 
  Newspaper, 
  ShieldCheck, 
  Send,
  AlertTriangle,
  FileCheck2,
  Share2,
  Fingerprint,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function AnalystResponseView({ onNavigate }) {
  const { currentRole, currentUser, executeProtectedAction, recordAuditLog } = useAuth();
  const [checkedSteps, setCheckedSteps] = useState([true, true, true, true, false, false]);
  const [actionMessage, setActionMessage] = useState('');
  const [actionTx, setActionTx] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleStep = (index) => {
    const updated = [...checkedSteps];
    updated[index] = !updated[index];
    setCheckedSteps(updated);
  };

  const getRoleWorkflow = () => {
    if (currentRole === ROLES.SYSTEM_ADMIN) {
      return {
        campaignId: 'CMP-ROOT-001',
        campaignName: 'Full-Spectrum Cyber Defense & IO Counter-Measures',
        threatLevel: 'SUPREME ROOT COMMAND',
        threatColor: '#10b981',
        steps: [
          { num: 1, text: "Synchronize inter-agency IO threat telemetry across all active zones", subtitle: "Correlate signals from NCCC, CERT-In, and state cyber command centers." },
          { num: 2, text: "Execute Section 69A IT Act emergency takedown protocols", subtitle: "Authorize fast-track blocking notices for critical malicious hosting infrastructure." },
          { num: 3, text: "Inspect and tune real-time AI vector similarity cluster parameters", subtitle: "Optimize MiniLM 384-dimensional cosine distance thresholds." },
          { num: 4, text: "Anchor cryptographic evidence packages on EVM Polygon notary ledger", subtitle: "Seal SHA-256 canonical manifests with multi-sig governance keys." },
          { num: 5, text: "Compile inter-agency strategic cyber threat briefings", subtitle: "Publish consolidated executive dossiers for Cabinet Security Committee." },
          { num: 6, text: "Monitor 24/7 autonomous botnet mutation detection grid", subtitle: "Maintain automated sentinel alerts until coordinated swarm activity subsides." }
        ],
        actions: [
          { label: 'Execute Sec 69A Takedown', actionType: 'sec69a_takedown', icon: ShieldAlert, primary: true, isDanger: true },
          { label: 'Notarize Evidence Ledger', actionType: 'blockchain_notarize', icon: Lock, primary: false, isDanger: false },
          { label: 'Generate Root Intelligence Dossier', actionType: 'report', icon: FileText, primary: false, isDanger: false }
        ]
      };
    }

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return {
        campaignId: 'CMP-ADANI-009',
        campaignName: 'Mundra Port & Liquidity Disinformation Operation',
        threatLevel: 'CRITICAL BRAND THREAT',
        threatColor: '#f59e0b',
        steps: [
          { num: 1, text: "Audit financial statements against fraudulent default claims", subtitle: "Compare quarterly balance sheet metrics with circulated Telegram rumors." },
          { num: 2, text: "Forensic acoustic check on alleged executive voice notes", subtitle: "Run deepfake voice synthesis classifier against authentic voice signatures." },
          { num: 3, text: "Track market short-seller correlation on stock exchanges", subtitle: "Cross-examine volume spike timestamps with social bot burst periods." },
          { num: 4, text: "Compile defamation evidence dossier for legal counsel", subtitle: "Preserve immutable SHA-256 snapshots of offending influencer accounts." },
          { num: 5, text: "Draft BSE / NSE Exchange clarification disclosure", subtitle: "Formulate regulatory clarification statement for market integrity." },
          { num: 6, text: "Continuous sentiment & stock volatility monitoring", subtitle: "Maintain 24/7 brand defense radar until negative sentiment normalizes." }
        ],
        actions: [
          { label: 'Dispatch BSE/NSE Clarification', actionType: 'bse_clarification', icon: Share2, primary: true, isDanger: false },
          { label: 'Notarize Defamation Vault', actionType: 'blockchain_notarize', icon: Lock, primary: false, isDanger: false },
          { label: 'Generate Corporate Threat Brief', actionType: 'report', icon: FileText, primary: false, isDanger: false }
        ]
      };
    }

    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return {
        campaignId: 'FACT-007',
        campaignName: 'Nationwide Internet & Telecom Blackout Rumor',
        threatLevel: 'HIGH PUBLIC VIRALITY',
        threatColor: '#3b82f6',
        steps: [
          { num: 1, text: "Cross-examine claim with Department of Telecommunications (DoT)", subtitle: "Confirm zero active shutdown orders or official notifications issued." },
          { num: 2, text: "Trace rumor origin back to altered PDF circular", subtitle: "Identify original date tampering and cloned government letterhead." },
          { num: 3, text: "Identify regional language translations & Hinglish variants", subtitle: "Group Hindi, Marathi, and Tamil WhatsApp forwarded iterations." },
          { num: 4, text: "Review citizen reports received on WhatsApp Tipline", subtitle: "Assess public concern level across 842 incoming tipline inquiries." },
          { num: 5, text: "Generate Multilingual Fact-Check Debunk Card", subtitle: "Format clean shareable graphic debunking the hoax with source links." },
          { num: 6, text: "Broadcast verification update to WhatsApp news subscribers", subtitle: "Push pre-verified debunk bulletin to stop rumor propagation early." }
        ],
        actions: [
          { label: 'Publish Press Fact-Check Card', actionType: 'publish_factcheck', icon: Newspaper, primary: true, isDanger: false },
          { label: 'Dispatch WhatsApp Tipline Debunk', actionType: 'generate_debunk_bulletin', icon: Send, primary: false, isDanger: false },
          { label: 'Generate Media Fact-Check Brief', actionType: 'report', icon: FileText, primary: false, isDanger: false }
        ]
      };
    }

    // Default: Investigation Bureau of India (IB)
    return {
      campaignId: 'CMP-007',
      campaignName: 'State-Sponsored Infrastructure Cyber & Disinfo Op',
      threatLevel: 'LEVEL 5 NATIONAL SECURITY',
      threatColor: '#ef4444',
      steps: [
        { num: 1, text: "Verify threat indicators with CERT-In & Intelligence grid", subtitle: "Correlate IP address nodes with known foreign APT infrastructure." },
        { num: 2, text: "Monitor cross-border botnet burst propagation in real-time", subtitle: "Cluster 36 coordinated proxy networks operating across Telegram and X." },
        { num: 3, text: "Analyze linguistic mutation tree across border districts", subtitle: "Detect systematic dialect shifts designed to induce panic." },
        { num: 4, text: "Verify cryptographic SHA-256 seal on evidence repository", subtitle: "Ensure evidence chain integrity for judicial submission and Section 69A order." },
        { num: 5, text: "Issue Section 69A IT Act emergency takedown direction", subtitle: "Transmit urgent takedown notice to intermediary compliance officers." },
        { num: 6, text: "Maintain active surveillance & inter-agency briefing", subtitle: "Ongoing monitoring until threat network is fully neutralized." }
      ],
      actions: [
        { label: 'Issue Section 69A IT Act Takedown', actionType: 'sec69a_takedown', icon: ShieldAlert, primary: true, isDanger: true },
        { label: 'Seal EVM Court Evidence Package', actionType: 'blockchain_notarize', icon: FileCheck2, primary: false, isDanger: false },
        { label: 'Generate Classified Inter-Agency Brief', actionType: 'report', icon: FileText, primary: false, isDanger: false }
      ]
    };
  };

  const workflow = getRoleWorkflow();

  const handleAction = async (actionType) => {
    if (actionType === 'report') {
      if (onNavigate) onNavigate('report-generator');
      return;
    }
    if (actionType === 'evidence') {
      if (onNavigate) onNavigate('evidence');
      return;
    }

    setIsProcessing(true);
    setActionMessage('');
    setActionTx(null);

    try {
      const res = await executeProtectedAction(actionType, workflow.campaignId, {
        analyst: currentUser.name,
        role: currentUser.roleTitle
      });

      setActionMessage(res.message || `Action '${actionType}' verified and signed.`);
      setActionTx({
        txHash: res.cryptographic_signature,
        timestamp: res.timestamp || new Date().toISOString(),
        role: res.executor_role
      });
      recordAuditLog(actionType.toUpperCase(), workflow.campaignId, { status: 'EXECUTED', tx: res.cryptographic_signature });
    } catch (err) {
      setActionMessage(`⚠️ Access Denied / Error: ${err.message || 'Operation failed'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Top Banner with Active Persona Clearance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: currentUser.badgeColor, padding: '3px 10px', backgroundColor: 'var(--bg-muted)', border: `1px solid ${currentUser.badgeColor}40`, borderRadius: '9999px', fontWeight: 700 }}>
              {currentUser.badgeText}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Campaign ID: #{workflow.campaignId}
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '6px', letterSpacing: '-0.5px' }}>
            {currentUser.roleTitle} — Response Studio
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {workflow.campaignName}
          </p>
        </div>

        <div className="bs-card" style={{ padding: '12px 20px', borderColor: `${workflow.threatColor}40`, backgroundColor: `${workflow.threatColor}08`, textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            THREAT CLASSIFICATION
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: workflow.threatColor, fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
            ● {workflow.threatLevel}
          </div>
        </div>
      </div>

      {actionMessage && (
        <div style={{
          backgroundColor: actionMessage.includes('Denied') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: actionMessage.includes('Denied') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '14px 18px',
          marginBottom: '20px',
          fontSize: '13px',
          color: actionMessage.includes('Denied') ? '#ef4444' : '#10b981',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>{actionMessage}</span>
            <button 
              onClick={() => { setActionMessage(''); setActionTx(null); }}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>
              ✕
            </button>
          </div>
          {actionTx && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>EVM Signature: {actionTx.txHash}</span>
              <span>Timestamp: {actionTx.timestamp}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Standard Operating Procedure & Execution Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Standard Operating Procedure */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <CheckCircle2 size={16} style={{ color: '#3b82f6' }} />
            <span>Role-Specific Standard Operating Procedure (SOP)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workflow.steps.map((step, idx) => {
              const isChecked = checkedSteps[idx];
              return (
                <div
                  key={step.num}
                  onClick={() => toggleStep(idx)}
                  style={{
                    backgroundColor: isChecked ? 'rgba(59, 130, 246, 0.04)' : 'var(--inner-box-bg)',
                    border: isChecked ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isChecked ? '#3b82f6' : 'var(--bg-card)',
                      border: isChecked ? '1px solid #60a5fa' : '1px solid var(--border-color)',
                      color: isChecked ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      {step.num}
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: isChecked ? 'var(--text-heading)' : 'var(--text-secondary)' }}>
                        {step.text}
                      </div>
                      {step.subtitle && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                          {step.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ color: isChecked ? '#3b82f6' : 'var(--text-muted)' }}>
                    {isChecked ? <CheckCircle2 size={18} /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-heading)' }}>
              Authorized Response Actions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {workflow.actions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button 
                    key={idx}
                    disabled={isProcessing}
                    onClick={() => handleAction(act.actionType)}
                    className={act.isDanger ? 'bs-button bs-button-danger' : (act.primary ? 'bs-button bs-button-primary' : 'bs-button bs-button-secondary')} 
                    style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px', opacity: isProcessing ? 0.7 : 1 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={15} /> {act.label}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                );
              })}

              <button 
                onClick={() => handleAction('report')}
                className="bs-button bs-button-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '10px', fontSize: '13px' }}>
                <UserPlus size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Assign Lead Analyst ({currentUser.name})</span>
              </button>

              <button 
                onClick={() => setActionMessage('ℹ️ Campaign marked as low-threat organic discourse under analyst oversight.')}
                className="bs-button bs-button-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '10px', fontSize: '13px' }}>
                <Flag size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Mark as Organic Discourse</span>
              </button>
            </div>
          </div>

          {/* Cryptographic Key & Governance Notice */}
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderLeft: `4px solid ${workflow.threatColor}`, 
            borderRadius: 'var(--radius-md)', 
            padding: '14px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--text-heading)', fontWeight: 700 }}>
              <Fingerprint size={14} style={{ color: currentUser.badgeColor }} />
              <span>Signatory Clearance Verified:</span>
            </div>
            <span>Operating under clearance <strong>{currentUser.clearance}</strong>. All countermeasure triggers are logged to the tamper-evident audit ledger.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
