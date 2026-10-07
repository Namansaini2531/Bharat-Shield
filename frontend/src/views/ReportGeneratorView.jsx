import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  Newspaper, 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  Copy, 
  Printer, 
  ExternalLink 
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

export default function ReportGeneratorView() {
  const { currentRole, currentUser } = useAuth();
  const [sections, setSections] = useState({
    executiveSummary: true,
    statutoryAuthority: true,
    targetVectors: true,
    coordinationEvidence: true,
    blockchainIntegrity: true,
    designatedOfficerSeal: true,
  });

  const [format, setFormat] = useState('PDF');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getReportMeta = () => {
    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return {
        docId: 'RPT-CORP-ADANI-009',
        title: 'SEBI Regulation 30 Brand Defense & Market Risk Dossier',
        subtitle: 'Adani Strategic Intelligence & Legal Counsel Briefing',
        classification: 'ENTERPRISE PRIVILEGED // TIER-1',
        classColor: '#f59e0b',
        targetCampaign: 'CMP-ADANI-009',
        addressee: 'BSE / NSE Surveillance & Corporate Governance Board',
        summaryText: 'Forensic evaluation indicates synthetic short-seller coordination across 42 proxy channels designed to artificially distort trading sentiment prior to market open.',
        statutoryCitation: 'Prepared pursuant to SEBI (LODR) Regulations & Indian Penal Code Sec 499 (Corporate Defamation)',
        actNoticeText: `CONFIDENTIAL & PRIVILEGED LEGAL REPORT\nPursuant to SEBI (LODR) Regulation 30 & IPC Sec 499\nTarget Campaign: CMP-ADANI-009\nEvidence Hash: sha256:d82a44bb01c89f50e7a2b91901a5b82c`
      };
    }

    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return {
        docId: 'RPT-FACTCHECK-007',
        title: 'National Press Fact-Check & WhatsApp Debunk Bulletin',
        subtitle: 'Public Verification & Mutation Tree Analysis',
        classification: 'PUBLIC TRUST // PRESS ACCREDITED',
        classColor: '#3b82f6',
        targetCampaign: 'FACT-007',
        addressee: 'National Press Consortium & Certified Fact-Checking Desks',
        summaryText: 'Multi-lingual verification confirms the circulating Department of Telecom shutdown circular is a cloned fabrication. Debunk cards issued in Hindi, Hinglish, Marathi, and Tamil.',
        statutoryCitation: 'Certified under International Fact-Checking Network (IFCN) Standards & Press Council Guidelines',
        actNoticeText: `PRESS FACT-CHECK BULLETIN // IFCN ACCREDITED\nTarget: Telecommunication Internet Shutdown Hoax\nConclusion: FABRICATED CIRCULAR\nDebunk Issued: EN / HI / HINGLISH / MR`
      };
    }

    // Default: Investigation Bureau of India
    return {
      docId: 'RPT-IB-C007-992',
      title: 'Section 69A IT Act Emergency Blocking Requisition Dossier',
      subtitle: 'Classified Inter-Agency Cyber Threat Intelligence // Court-Admissible',
      classification: 'TOP SECRET // LEA // NATIONAL SECURITY',
      classColor: '#ef4444',
      targetCampaign: 'CMP-007',
      addressee: 'Ministry of Home Affairs & CERT-In Emergency Response Cell',
      summaryText: 'Multi-platform state-sponsored disinformation swarm detected targeting national telecommunication infrastructure with high cross-platform temporal synchronicity (96%). Immediate emergency takedown requisitioned under Section 69A IT Act 2000.',
      statutoryCitation: 'Invoked under Section 69A of Information Technology Act 2000 read with IT (Procedure and Safeguards for Blocking of Access) Rules 2009',
      actNoticeText: `GOVERNMENT OF INDIA // MINISTRY OF ELECTRONICS & IT\nEMERGENCY ORDER UNDER SECTION 69A INFORMATION TECHNOLOGY ACT 2000\n\nTo: Designated Intermediary Grievance Officers (X/Twitter, Telegram, WhatsApp)\nRe: Emergency Sequestration & Takedown of Malicious IO Vector (CMP-007)\n\nEvidence Merkle Root: 0x8e3b44f910a29df14e21a9f2\nForensic SHA-256 Digest: sha256:d82a44bb01c89f50e7a2b91901a5b82c\n\nDirection: Block access immediately within 24 hours under Rule 9 of Blocking Rules 2009.`
    };
  };

  const reportMeta = getReportMeta();

  const handleDownload = async () => {
    setDownloading(true);
    let dossierData = null;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentRole
        },
        body: JSON.stringify({
          campaign_id: reportMeta.targetCampaign,
          format: format.toLowerCase()
        })
      });
      const data = await res.json();
      dossierData = data.dossier;
    } catch (e) {
      console.warn('Backend offline, compiling client dossier');
    }

    if (format === 'JSON') {
      const exportBlob = new Blob([JSON.stringify(dossierData || reportMeta, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportMeta.docId}_evidence_ledger.json`;
      a.click();
    } else if (format === 'HTML' || format === 'PDF') {
      window.print();
    }

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 800);
  };

  const copyNoticeToClipboard = () => {
    navigator.clipboard.writeText(reportMeta.actNoticeText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div>
      {/* Top Header with Active Clearance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: currentUser.badgeColor, fontWeight: 700, letterSpacing: '1px' }}>
              {currentUser.badgeText}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              STATUTORY DOSSIER GENERATOR
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.5px' }}>
            {reportMeta.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {reportMeta.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={copyNoticeToClipboard}
            className="bs-button bs-button-secondary"
            style={{ padding: '9px 14px', fontSize: '12px', gap: '6px' }}
          >
            {copiedNotice ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            <span>{copiedNotice ? 'Notice Copied' : 'Copy Requisition Notice'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bs-button bs-button-primary"
            style={{ padding: '9px 18px', fontSize: '13px', gap: '8px' }}
          >
            {downloadSuccess ? <Check size={16} /> : <Download size={16} />}
            <span>{downloadSuccess ? 'Export Ready' : downloading ? 'Generating Dossier...' : `Export as ${format}`}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Preview & Configuration Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Live Document Preview */}
        <div className="bs-card" style={{ padding: '28px', backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', position: 'relative' }}>
          
          {/* Top Bar Preview Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
              AUTHENTICATED SIGNATORY: {currentUser.name.toUpperCase()} // CLEARANCE: {currentUser.clearance}
            </div>
          </div>

          {/* Dossier Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', margin: 0, letterSpacing: '0.5px' }}>
                BHARAT-SHIELD SENTINEL DOSSIER
              </h1>
              <div style={{ fontSize: '13px', fontWeight: 700, color: reportMeta.classColor, marginTop: '4px' }}>
                {reportMeta.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Recipient Authority: {reportMeta.addressee}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div>DOC_ID: {reportMeta.docId}</div>
              <div>DATE: {new Date().toISOString().slice(0, 10)}</div>
              <div style={{ color: reportMeta.classColor, fontWeight: 700 }}>{reportMeta.classification}</div>
            </div>
          </div>

          {/* Threat Metric Grid in Report */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
            gap: '12px', 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Campaign</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>{reportMeta.targetCampaign}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clearance Level</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: reportMeta.classColor, marginTop: '4px' }}>{currentUser.clearance.split('(')[0]}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Threat Rating</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                94/100 <span className="bs-badge bs-badge-red" style={{ fontSize: '9px' }}>CRITICAL</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sync Index</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#60a5fa', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                96% Temporal
              </div>
            </div>
          </div>

          {/* Document Section: Executive Summary */}
          {sections.executiveSummary && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                1. Executive Operational Finding
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {reportMeta.summaryText}
              </p>
            </div>
          )}

          {/* Document Section: Statutory Citation */}
          {sections.statutoryAuthority && (
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--bg-card)', borderLeft: `3px solid ${currentUser.badgeColor}`, borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Statutory Authority & Jurisdiction</div>
              <div style={{ fontSize: '12px', color: 'var(--text-heading)', marginTop: '4px' }}>{reportMeta.statutoryCitation}</div>
            </div>
          )}

          {/* Document Section: Infringing Vectors Table */}
          {sections.targetVectors && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                2. Target Infringing Accounts & Vector Ledger
              </h3>
              
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 10px' }}>Platform</th>
                      <th style={{ padding: '8px 10px' }}>Target Handle / URI</th>
                      <th style={{ padding: '8px 10px' }}>SHA-256 Digest</th>
                      <th style={{ padding: '8px 10px' }}>Requisition Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px 10px', color: '#60a5fa', fontWeight: 600 }}>X (Twitter)</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'JetBrains Mono' }}>@tech_leaks_in</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>sha256:d82a44bb...</td>
                      <td style={{ padding: '8px 10px', color: '#ef4444', fontWeight: 700 }}>SEC 69A BLOCK</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px 10px', color: '#38bdf8', fontWeight: 600 }}>Telegram</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'JetBrains Mono' }}>t.me/telecom_sabotage_news</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>sha256:f55a12ec...</td>
                      <td style={{ padding: '8px 10px', color: '#ef4444', fontWeight: 700 }}>CHANNEL SEQUESTER</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 10px', color: '#34d399', fontWeight: 600 }}>WhatsApp</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'JetBrains Mono' }}>Broadcast Swarm #7719</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>sha256:88bc4190...</td>
                      <td style={{ padding: '8px 10px', color: '#f59e0b', fontWeight: 700 }}>DEBUNK BROADCAST</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Document Section: Evidentiary Audit Seal */}
          {sections.blockchainIntegrity && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Lock size={14} style={{ color: '#10b981' }} />
                <span>SHA-256 Digest Verified • Section 65B Indian Evidence Act Certified</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#10b981' }}>
                MERKLE ROOT: 0x8e3b44f910a29df14e21a9f2
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Customization Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '16px' }}>
              Dossier Components
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.keys(sections).map((key) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sections[key]}
                    onChange={() => toggleSection(key)}
                    style={{ accentColor: currentUser.badgeColor }}
                  />
                  <span style={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '12px' }}>
              Export Format
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['PDF', 'JSON', 'HTML'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: format === fmt ? `1px solid ${currentUser.badgeColor}` : '1px solid var(--border-color)',
                    backgroundColor: format === fmt ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: format === fmt ? 'var(--text-heading)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
