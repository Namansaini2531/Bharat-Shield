import React from 'react';
import { 
  Home, 
  ChevronRight, 
  ShieldAlert, 
  Radio, 
  PhoneCall, 
  GitFork, 
  Share2, 
  FileCheck, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Shield, 
  Settings 
} from 'lucide-react';

const NAV_METADATA = {
  overview: {
    category: 'Intelligence Hub',
    label: 'Dashboard',
    icon: Home
  },
  campaigns: {
    category: 'Operations',
    label: 'Active Campaigns',
    subLabel: 'Investigation #007',
    icon: ShieldAlert
  },
  live: {
    category: 'Signal Ingestion',
    label: 'Live Intel Feed',
    icon: Radio
  },
  tipline: {
    category: 'Public Ingestion',
    label: 'Citizen Tipline',
    icon: PhoneCall
  },
  narratives: {
    category: 'Threat Analysis',
    label: 'Narrative Clusters',
    icon: GitFork
  },
  network: {
    category: 'Threat Analysis',
    label: 'Actor Network Graph',
    icon: Share2
  },
  evidence: {
    category: 'Chain of Custody',
    label: 'Evidence Vault',
    icon: FileCheck
  },
  threats: {
    category: 'Risk Analytics',
    label: 'Threat Assessments',
    icon: AlertTriangle
  },
  audit: {
    category: 'Governance',
    label: 'Audit Ledger',
    icon: BookOpen
  },
  'analyst-response': {
    category: 'Action Center',
    label: 'Analyst Response',
    icon: Shield
  },
  'report-generator': {
    category: 'Intelligence Exports',
    label: 'Advisory Generator',
    icon: FileText
  },
  settings: {
    category: 'System Config',
    label: 'Cluster Settings',
    icon: Settings
  }
};

export default function Breadcrumbs({ currentNav, onNavigate, customTrail = null }) {
  const currentMeta = NAV_METADATA[currentNav] || {
    category: 'System',
    label: currentNav.charAt(0).toUpperCase() + currentNav.slice(1),
    icon: Shield
  };

  const trail = customTrail || [
    { label: 'Home', nav: 'overview', isRoot: true },
    { label: currentMeta.category, nav: currentNav === 'overview' ? 'overview' : null },
    { label: currentMeta.label, nav: currentMeta.subLabel ? currentNav : null, isCurrent: !currentMeta.subLabel },
    ...(currentMeta.subLabel ? [{ label: currentMeta.subLabel, isCurrent: true }] : [])
  ];

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        flexWrap: 'nowrap',
        overflow: 'hidden'
      }}
    >
      <ol style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        listStyle: 'none', 
        margin: 0, 
        padding: 0,
        whiteSpace: 'nowrap'
      }}>
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          const isClickable = !!item.nav && onNavigate && !isLast;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <li aria-hidden="true" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                  <ChevronRight size={13} strokeWidth={2.4} style={{ opacity: 0.5, flexShrink: 0 }} />
                </li>
              )}
              <li style={{ display: 'flex', alignItems: 'center' }}>
                {item.isRoot ? (
                  <button
                    onClick={() => onNavigate && onNavigate('overview')}
                    title="Dashboard"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      padding: '4px 6px',
                      borderRadius: '3px',
                      color: 'var(--accent-blue)',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)';
                    }}
                  >
                    <Home size={13} />
                  </button>
                ) : isClickable ? (
                  <button
                    onClick={() => onNavigate(item.nav)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span
                    style={{
                      color: isLast ? 'var(--text-heading)' : 'var(--text-secondary)',
                      fontWeight: isLast ? 700 : 500,
                      fontSize: '12px',
                      padding: '2px 4px'
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
