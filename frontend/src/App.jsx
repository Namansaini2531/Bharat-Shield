import React, { useState, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import LoginView from './views/LoginView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
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
const AdminView = lazy(() => import('./views/AdminView'));
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
        AUTHENTICATING & LOADING SECURE PARTITION...
      </div>
    </div>
  );
}

// Global Robust Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Bharat-Shield App Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('bharat_shield_authenticated');
      localStorage.removeItem('bharat_shield_active_role');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0c0e14',
          color: '#f3f4f6',
          padding: '24px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#161822',
            border: '1px solid #2a2d3d',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
              Security Partition Initialization Notice
            </h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, marginBottom: '20px' }}>
              The application encountered a state conflict during session hydration. Click below to clear cache and reload cleanly.
            </p>
            <div style={{
              backgroundColor: '#0b0d13',
              border: '1px solid #1e2230',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '11px',
              color: '#ef4444',
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'left',
              marginBottom: '24px',
              overflowX: 'auto'
            }}>
              {this.state.error?.message || 'Unknown render error'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
              }}
            >
              Reset Session & Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainAppContent() {
  const [currentNav, setCurrentNav] = useState('overview');
  const [theme, setTheme] = useState('dark');
  const { isAuthenticated, currentRole, hasAccessToNav } = useAuth();

  // Reset to overview if user switches to a role that lacks access to the current view
  React.useEffect(() => {
    if (!hasAccessToNav(currentNav)) {
      setCurrentNav('overview');
    }
  }, [currentRole, currentNav, hasAccessToNav]);

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

  // If not authenticated, display the Login / Auth Screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

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
      case 'admin':
        return <AdminView />;
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

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WebSocketProvider>
          <MainAppContent />
        </WebSocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
