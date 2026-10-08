import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';
import RoleSwitchModal from './RoleSwitchModal';
import { useAuth, ROLES } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import {

  LayoutDashboard,
  ShieldAlert,
  Radio,
  PhoneCall,
  GitFork,
  FileCheck,
  AlertTriangle,
  BookOpen,
  Settings,
  Bell,
  Search,
  PanelLeft,
  ChevronRight,
  ChevronsUpDown,
  Shield,
  Sparkles,
  FileText,
  CheckCircle2,
  Lock,
  ExternalLink,
  Activity,
  Layers,
  HelpCircle,
  LogOut,
  X,
  Building2,
  Newspaper,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Fingerprint,
  Terminal,
  Sliders,
  Server
} from 'lucide-react';

export default function Layout({ currentNav, setCurrentNav, theme, setTheme, children }) {
  const { currentRole, currentUser, isAuthModalOpen, setIsAuthModalOpen, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('bharat_shield_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('bharat_shield_sidebar_collapsed', String(next));
      } catch { }
      return next;
    });
  };

  // Keyboard shortcuts: Ctrl+K for search, Ctrl+B for sidebar toggle, Esc to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role-specific dynamic navigation definitions
  const getNavGroups = () => {
    // Dedicated System Admin / Platform Supervision Navigation
    if (currentRole === ROLES.SYSTEM_ADMIN) {
      return [
        {
          label: 'SUPERVISION & MONITORING',
          items: [
            { id: 'overview', label: 'Command Overview', icon: LayoutDashboard, badge: 'SUPERVISOR', badgeColor: 'green' },
            { id: 'admin-subscribers', label: 'Subscriber Telemetry', icon: Activity, badge: '3 ACTIVE', badgeColor: 'blue' }
          ]
        },
        {
          label: 'MODERATION & GOVERNANCE',
          items: [
            { id: 'admin-moderation', label: 'Tenant Access & Quotas', icon: Sliders },
            { id: 'admin-guardrails', label: 'Statutory Guardrails', icon: ShieldCheck, badge: '5 RULES', badgeColor: 'green' }
          ]
        },
        {
          label: 'INFRASTRUCTURE & HEALTH',
          items: [
            { id: 'admin-maintenance', label: 'System Health & Maintenance', icon: Server, badge: 'HEALTHY', badgeColor: 'green' },
            { id: 'admin-audit', label: 'Diagnostic Event Logs', icon: Terminal }
          ]
        },
        {
          label: 'SETTINGS & SYSTEM',
          items: [
            { id: 'settings', label: 'System Preferences', icon: Settings }
          ]
        }
      ];
    }

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return [
        {
          label: 'BRAND RADAR',
          items: [
            { id: 'overview', label: 'Executive Desk', icon: LayoutDashboard },
            { id: 'campaigns', label: 'All Campaigns', icon: ShieldAlert, badge: '4 ACT', badgeColor: 'red' }
          ]
        },
        {
          label: 'BRAND THREATS',
          items: [
            { id: 'narratives', label: 'Sabotage Clusters', icon: GitFork },
            { id: 'threats', label: 'Volatility Risk', icon: AlertTriangle },
            { id: 'analyst-response', label: 'NSE/BSE Dispatch', icon: Sparkles },
            { id: 'report-generator', label: 'Executive Dossier', icon: FileText }
          ]
        },
        {
          label: 'LEGAL EVIDENCE',
          items: [
            { id: 'evidence', label: 'Legal Evidence', icon: FileCheck }
          ]
        },
        {
          label: 'FEEDS & TELEMETRY',
          items: [
            { id: 'live', label: 'Market Intel', icon: Radio, badge: 'ACTIVE', badgeColor: 'orange' }
          ]
        },
        {
          label: 'PREFERENCES',
          items: [
            { id: 'settings', label: 'Settings', icon: Settings }
          ]
        }
      ];
    }

    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return [
        {
          label: 'MEDIA RADAR',
          items: [
            { id: 'overview', label: 'Newsroom Desk', icon: LayoutDashboard },
            { id: 'campaigns', label: 'All Campaigns', icon: ShieldAlert, badge: 'HOT', badgeColor: 'red' }
          ]
        },
        {
          label: 'INVESTIGATION',
          items: [
            { id: 'narratives', label: 'Mutation Tree', icon: GitFork },
            { id: 'threats', label: 'Reach Metrics', icon: AlertTriangle },
            { id: 'analyst-response', label: 'Debunk Center', icon: Sparkles },
            { id: 'report-generator', label: 'Press Bulletin', icon: FileText }
          ]
        },
        {
          label: 'FEEDS & TELEMETRY',
          items: [
            { id: 'live', label: 'Viral Feed', icon: Radio, badge: 'VIRAL', badgeColor: 'blue' },
            { id: 'tipline', label: 'Tipline Feed', icon: PhoneCall, badge: '12', badgeColor: 'blue' }
          ]
        },
        {
          label: 'PREFERENCES',
          items: [
            { id: 'settings', label: 'Settings', icon: Settings }
          ]
        }
      ];
    }

    // Default: Investigation Bureau of India (Full Classified Access)
    return [
      {
        label: 'THREAT RECON',
        items: [
          { id: 'overview', label: 'Command Desk', icon: LayoutDashboard },
          { id: 'campaigns', label: 'All Campaigns', icon: ShieldAlert, badge: '94%', badgeColor: 'red' }
        ]
      },
      {
        label: 'CAMPAIGNS',
        items: [
          { id: 'narratives', label: 'Border Clusters', icon: GitFork },
          { id: 'threats', label: 'Security Risk', icon: AlertTriangle },
          { id: 'analyst-response', label: 'Threat Response', icon: Sparkles },
          { id: 'report-generator', label: 'Agency Dossiers', icon: FileText }
        ]
      },
      {
        label: 'FORENSICS',
        items: [
          { id: 'evidence', label: 'Court Evidence', icon: FileCheck },
          { id: 'audit', label: 'Audit Ledger', icon: BookOpen, badge: 'EVM', badgeColor: 'green' }
        ]
      },
      {
        label: 'FEEDS & TELEMETRY',
        items: [
          { id: 'live', label: 'Classified Stream', icon: Radio, badge: 'INTEL', badgeColor: 'red' },
          { id: 'tipline', label: 'Intercept Tipline', icon: PhoneCall, badge: '12', badgeColor: 'blue' }
        ]
      },
      {
        label: 'PREFERENCES',
        items: [
          { id: 'settings', label: 'Settings', icon: Settings }
        ]
      }
    ];
  };

  const navGroups = getNavGroups();

  const getRoleIcon = () => {
    if (currentRole === ROLES.SYSTEM_ADMIN) return Terminal;
    if (currentRole === ROLES.CORPORATE_ENTERPRISE) return Building2;
    if (currentRole === ROLES.JOURNALIST_MEDIA) return Newspaper;
    return ShieldCheck;
  };

  const RoleIcon = getRoleIcon();

  const notificationsList = [
    {
      id: 1,
      title: currentRole === ROLES.CORPORATE_ENTERPRISE
        ? 'Deepfake Audio of CFO Detected'
        : currentRole === ROLES.JOURNALIST_MEDIA
          ? 'Viral WhatsApp Forward Spike (+420%)'
          : 'Campaign #007 Cross-Border Surge',
      desc: currentRole === ROLES.CORPORATE_ENTERPRISE
        ? 'Synthetic Hindi/English voice note attacking port solvency circulating on Telegram.'
        : currentRole === ROLES.JOURNALIST_MEDIA
          ? 'Unverified blackout rumor translated into 4 regional languages.'
          : 'High coordination burst across 36 proxy nodes detected in J&K sector.',
      time: '2m ago',
      unread: true
    },
    {
      id: 2,
      title: 'Evidence Package Timestamped',
      desc: 'SHA-256 Digest registered with court-admissible audit metadata.',
      time: '14m ago',
      unread: true
    }
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      {/* Role Switcher Authentication Modal */}
      <RoleSwitchModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* ========================================================================= */}
      {/* SHADCN APPLICATION SHELL: COLLAPSIBLE SIDEBAR                             */}
      {/* ========================================================================= */}
      <aside className={`bs-sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar Header / Brand */}
        <div className="sidebar-brand-container">
          <div
            onClick={isCollapsed ? toggleSidebar : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: 0,
              width: '100%',
              cursor: isCollapsed ? 'pointer' : 'default',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
            title={isCollapsed ? "Expand BHARAT-SHIELD Sidebar (Ctrl+B)" : undefined}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.45))'
            }}>
              <img
                src={logoImg}
                alt="Bharat-Shield Sentinel"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </div>

            <div className="sidebar-brand-text">
              <span>BHARAT-SHIELD</span>
            </div>

          </div>
        </div>



        {/* Sidebar Navigation Content */}
        <div style={{
          flex: 1,
          padding: '8px 8px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div className="sidebar-group-label">
                {group.label}
              </div>

              {isCollapsed && groupIdx > 0 && (
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '6px 4px' }} />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentNav(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`sidebar-menu-btn ${isActive ? 'active' : ''}`}
                  >
                    <div className="sidebar-icon-wrap">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="sidebar-label-badge-wrap">
                      <span className="sidebar-item-label">{item.label}</span>
                      {item.badge && (
                        <span className={`sidebar-badge sidebar-badge-${item.badgeColor || 'blue'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Settings */}
        <div style={{
          padding: '10px 8px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <button
            onClick={() => setCurrentNav('settings')}
            title={isCollapsed ? "System Settings" : undefined}
            className={`sidebar-menu-btn ${currentNav === 'settings' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-wrap">
              <Settings size={18} strokeWidth={2} />
            </div>
            <div className="sidebar-label-badge-wrap">
              <span className="sidebar-item-label">Settings</span>
            </div>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER & TOP NAVIGATION BAR                                       */}
      {/* ========================================================================= */}
      <div className={`bs-main-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Sticky Header */}
        <header style={{
          height: '60px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-sidebar)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          gap: '16px',
          transition: 'all 0.2s ease'
        }}>
          {/* Left Header Section: SidebarTrigger + Separator + Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            {/* Sidebar Trigger Button */}
            <button
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <PanelLeft size={16} />
            </button>

            {/* Vertical Separator */}
            <div style={{ height: '18px', width: '1px', backgroundColor: 'var(--border-color)' }} />

            {/* Breadcrumb Hierarchy */}
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Breadcrumbs currentNav={currentNav} onNavigate={setCurrentNav} />
            </div>
          </div>

          {/* Right Header Section: Search, Notifications, Theme, Account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

            {/* Global Quick Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '5px 10px',
              width: '180px',
              transition: 'border-color 0.15s ease'
            }}>
              <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <div className="kbd-badge">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 8px',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Bell size={16} />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-red)',
                  boxShadow: '0 0 6px var(--accent-red)'
                }} />
              </button>

              {/* Notification Popover Panel */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '320px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                  zIndex: 60,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      Intelligence Alerts
                    </div>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: 'var(--accent-red)',
                      fontWeight: 600
                    }}>
                      ACTIVE
                    </span>
                  </div>

                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {notificationsList.map(item => (
                      <div
                        key={item.id}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: item.unread ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.unread ? 'rgba(59, 130, 246, 0.04)' : 'transparent'}
                        onClick={() => {
                          setCurrentNav('campaigns');
                          setShowNotifications(false);
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.time}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.3 }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '8px 14px',
                    backgroundColor: 'var(--inner-box-bg)',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={() => { setCurrentNav('live'); setShowNotifications(false); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-blue)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Live Intel Stream →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Component */}
            <ThemeToggle theme={theme} setTheme={setTheme} />

            {/* Vertical Separator */}
            <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 2px' }} />

            {/* Navbar Right Account Info Button & Dropdown */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '3px 8px 3px 4px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: showUserMenu ? 'var(--border-light)' : 'var(--border-color)',
                  background: showUserMenu ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  height: '36px',
                  boxSizing: 'border-box',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
                onMouseLeave={(e) => {
                  if (!showUserMenu) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: `linear-gradient(135deg, ${currentUser.badgeColor}, #06b6d4)`,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px',
                  flexShrink: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>
                  {currentUser.avatarInitials}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>
                    {currentUser.name.split(' ')[0]}
                  </div>
                </div>
                <ChevronsUpDown size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </button>

              {/* User Popover Menu in Navbar */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '260px',
                  marginTop: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                  padding: '6px',
                  zIndex: 60,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {currentUser?.name || 'Commander Arvind Sharma'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {currentUser?.email || 'a.sharma@sentinel.gov.in'}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: currentUser?.badgeColor || '#10b981',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '6px',
                      padding: '3px 8px',
                      backgroundColor: `${currentUser?.badgeColor || '#10b981'}15`,
                      borderRadius: '9999px',
                      width: 'fit-content'
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: currentUser?.badgeColor || '#10b981' }} />
                      {currentUser?.clearance || 'Level 5+ (Supreme Root Authority)'}
                    </div>
                  </div>

                  <div style={{ padding: '6px 0' }}>
                    <button
                      onClick={() => { setIsAuthModalOpen(true); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--accent-blue)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Fingerprint size={14} />
                      <span>Switch RBAC Persona...</span>
                    </button>

                    <button
                      onClick={() => { setCurrentNav('overview'); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <Shield size={14} style={{ color: 'var(--accent-cyan)' }} />
                      <span>Command Dashboard</span>
                    </button>

                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={14} />
                      <span>Lock & Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main style={{
          flex: 1,
          padding: '24px 28px',
          backgroundColor: 'var(--bg-dark)',
          transition: 'background-color 0.2s ease',
          minWidth: 0
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
