import React, { useState } from 'react';
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
  Check 
} from 'lucide-react';

export default function AuditLedgerView() {
  const [copied, setCopied] = useState(false);
  const hashString = "A8F73D9B6C2E4F1A5D8B9C0E3F2A1D4B7C6E5F9A8B7C6D5E4F3A2B1C091C2";

  const handleCopy = () => {
    navigator.clipboard.writeText(hashString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            Evidence Integrity & Audit Ledger
          </h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '2px 8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
              Campaign C007
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '2px 8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
              Package EV-007-143
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '2px 8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
              Version: v1.3
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="bs-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> BLOCKCHAIN: VERIFIED
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
            Timestamp: 09:14:05
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Cryptographic Signature & Verification */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Cryptographic Signature Card */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <ShieldCheck size={16} style={{ color: '#06b6d4' }} />
              <span>Cryptographic Signature</span>
            </div>

            <div style={{ 
              backgroundColor: 'var(--inner-box-bg)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '10px', 
              padding: '14px', 
              marginBottom: '16px' 
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', marginBottom: '6px' }}>
                SHA-256 HASH
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
                <span>Download Certificate</span>
              </button>
            </div>
          </div>

          {/* Integrity Verification Card */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span>Integrity Verification</span>
              </div>
              <span className="bs-badge bs-badge-blue" style={{ fontSize: '10px' }}>
                System Status: Secure
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Original hash matches
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>System Verified</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Current hash matches
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>System Verified</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Timestamp verified
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>NTP Server Sync</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Evidence version verified
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>v1.3</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--inner-box-bg)', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981' }} /> Blockchain record verified
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>Node Confirmed</span>
              </div>

            </div>

            <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Message: "Evidence integrity confirmed."
            </div>
          </div>

        </div>

        {/* Right Column: Audit Ledger Timeline */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <Clock size={16} style={{ color: '#3b82f6' }} />
            <span>Audit Ledger Timeline</span>
          </div>

          <div style={{ position: 'relative', paddingLeft: '24px', flex: 1 }}>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '7px', width: '2px', backgroundColor: 'var(--border-color)' }} />

            {/* Timeline Item 1 */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--bg-card)' }} />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>09:14:02</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>Campaign detected</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>System automated alert</div>
            </div>

            {/* Timeline Item 2 */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--bg-card)' }} />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>09:14:04</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>Package created</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Initial compilation EV-007-143</div>
            </div>

            {/* Timeline Item 3 */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--bg-card)' }} />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>09:14:05</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>Hash registered</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Immutable ledger entry confirmed</div>
            </div>

            {/* Timeline Item 4 */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--bg-card)' }} />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>09:21:31</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>Analyst reviewed</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Analyst A-104 assigned</div>
            </div>

            {/* Timeline Item 5 */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '2px solid var(--bg-card)' }} />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>09:23:18</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>Risk updated</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Threat level elevated to High</div>
            </div>

            {/* Timeline Item 6 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', border: '2px solid var(--bg-card)' }} />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>09:24:02</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>Escalated</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Transferred to Tier 2 Command</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
