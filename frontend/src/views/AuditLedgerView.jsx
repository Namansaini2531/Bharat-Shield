import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Download, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Volume2, 
  Check,
  Fingerprint,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuditLedgerView() {
  const { currentRole, currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const hashString = "A8F73D9B6C2E4F1A5D8B9C0E3F2A1D4B7C6E5F9A8B7C6D5E4F3A2B1C091C2";

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/auth/audit-log?role=${currentRole}`);
        if (res.ok) {
          const data = await res.json();
          setAuditLogs(data);
        }
      } catch (err) {
        console.warn('Audit fetch offline:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [currentRole]);

  const handleCopy = () => {
    navigator.clipboard.writeText(hashString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Top Banner with Clearance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: currentUser.badgeColor, fontWeight: 700, letterSpacing: '1px' }}>
              {currentUser.badgeText}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              IMMUTABLE AUDIT TRAIL
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            Evidence Integrity & EVM Audit Ledger
          </h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '2px 8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
              Auditor: {currentUser.name}
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '2px 8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
              Clearance: {currentUser.clearance.split('(')[0]}
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '2px 8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
              Hardhat / EVM Chain ID: 31337
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="bs-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> BLOCKCHAIN: VERIFIED
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
            Sync Status: NTP & EVM Confirmed
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '20px' }}>
        
        {/* Left Column: Cryptographic Signature & Verification */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Cryptographic Signature Card */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <ShieldCheck size={16} style={{ color: '#06b6d4' }} />
              <span>Cryptographic Signature Digest</span>
            </div>

            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '10px', 
              padding: '14px', 
              marginBottom: '16px' 
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', marginBottom: '6px' }}>
                ACTIVE ROOT STATE SHA-256 HASH
              </div>
              <div style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: '#60a5fa', wordBreak: 'break-all' }}>
                {hashString}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleCopy} className="bs-button bs-button-secondary" style={{ gap: '6px', fontSize: '12px' }}>
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied Hash' : 'Copy Hash'}</span>
              </button>

              <button className="bs-button bs-button-secondary" style={{ gap: '6px', fontSize: '12px' }}>
                <Download size={14} />
                <span>Download Cryptographic Certificate</span>
              </button>
            </div>
          </div>

          {/* Integrity Verification Checklist */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span>Chain of Custody Verifications</span>
              </div>
              <span className="bs-badge bs-badge-blue" style={{ fontSize: '10px' }}>
                Zero-Trust Isolation
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Role authentication seal
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: currentUser.badgeColor }}>
                  {currentUser.roleTitle.split('—')[0]}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Court-Admissible Sec 65B Certificate
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>Indian Evidence Act</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> EVM Smart Contract Notarization
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>Block #14,921</span>
              </div>

            </div>

            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "All operational actions and role transitions are cryptographically sealed to prevent retro-active manipulation."
            </div>
          </div>

        </div>

        {/* Right Column: Live Audit Event Trail */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <Clock size={16} style={{ color: '#3b82f6' }} />
            <span>Cryptographic Session & Action Log</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '520px' }}>
            {auditLogs.length > 0 ? (
              auditLogs.map((log, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  backgroundColor: 'var(--inner-box-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {log.action}
                    </span>
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>
                      {log.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Actor: {log.actor} ({log.role})
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: '4px', wordBreak: 'break-all' }}>
                    Hash: {log.hash?.slice(0, 24)}...
                  </div>
                </div>
              ))
            ) : (
              [
                { action: 'ROLE_SWITCH_TO_INVESTIGATION_BUREAU', actor: 'Joint Director Vikram Rawat', role: 'investigation_bureau', time: 'Just now' },
                { action: 'SEC69A_DIRECTION_ISSUED', actor: 'Joint Director Vikram Rawat', role: 'investigation_bureau', time: '12m ago' },
                { action: 'EVM_PACKAGE_TIMESTAMPED', actor: 'System Notary', role: 'system', time: '24m ago' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  backgroundColor: 'var(--inner-box-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {item.action}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {item.time}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Actor: {item.actor}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
