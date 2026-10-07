import React, { useState, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy loading all 11 view components
const OverviewView = lazy(() => import('./views/OverviewView'));
const CampaignView = lazy(() => import('./views/CampaignView'));
const LiveIntelView = lazy(() => import('./views/LiveIntelView'));
const TiplineView = lazy(() => import('./views/TiplineView'));
const NarrativesView = lazy(() => import('./views/NarrativesView'));
const EvidenceView = lazy(() => import('./views/EvidenceView'));
const ThreatAssessmentsView = lazy(() => import('./views/ThreatAssessmentsView'));
const AuditLedgerView = lazy(() => import('./views/AuditLedgerView'));
const AnalystResponseView = lazy(() => import('./views/AnalystResponseView'));
const ReportGeneratorView = lazy(() => import('./views/ReportGeneratorView'));
const SettingsView = lazy(() => import('./views/SettingsView'));
const NotFoundView = lazy(() => import('./views/NotFoundView'));

// Dark Command Loading Fallback
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '14px',
      color: '#8c9ba5'
    }}>
      <Loader2 size={32} className="animate-pulse-slow" style={{ color: '#3b82f6' }} />
      <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', letterSpacing: '1px' }}>
        LOADING SECURE MODULE...
      </div>
    </div>
  );
}

export default function App() {
  const [currentNav, setCurrentNav] = useState('overview');
  const [theme, setTheme] = useState('dark');

  React.useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        const resolved = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', resolved);
      };
      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const renderView = () => {
    switch (currentNav) {
      case 'overview':
        return <OverviewView onNavigate={(nav) => setCurrentNav(nav)} />;
      case 'campaigns':
        return <CampaignView />;
      case 'live':
        return <LiveIntelView onNavigate={(nav) => setCurrentNav(nav)} />;
      case 'tipline':
        return <TiplineView onNavigate={(nav) => setCurrentNav(nav)} />;
      case 'narratives':
        return <NarrativesView />;
      case 'evidence':
        return <EvidenceView />;
      case 'threats':
        return <ThreatAssessmentsView />;
      case 'audit':
        return <AuditLedgerView />;
      case 'analyst-response':
        return <AnalystResponseView onNavigate={(nav) => setCurrentNav(nav)} />;
      case 'report-generator':
        return <ReportGeneratorView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <NotFoundView onNavigate={(nav) => setCurrentNav(nav)} />;
    }
  };

  return (
    <Layout currentNav={currentNav} setCurrentNav={setCurrentNav} theme={theme} setTheme={setTheme}>
      <Suspense fallback={<LoadingFallback />}>
        {renderView()}
      </Suspense>
    </Layout>
  );
}
