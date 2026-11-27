import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';
import RoleSwitchModal from './RoleSwitchModal';
import { useAuth, ROLES, PROFILE_CLUSTER_NODES } from '../context/AuthContext';
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
    if (currentRole === ROLES.SYSTEM_ADMIN) {
      return [
        {
          label: 'Overview',
          items: [
            { id: 'overview', label: 'Command center', icon: LayoutDashboard },
            { id: 'campaigns', label: 'Campaigns', icon: ShieldAlert, count: 17 }
          ]
        },
        {
          label: 'Threat intelligence',
          items: [
            { id: 'threats', label: 'Radar assessments', icon: AlertTriangle },
            { id: 'analyst-response', label: 'Threat response', icon: Sparkles },
            { id: 'enterprise', label: 'Enterprise profiles', icon: Building2 },
            { id: 'report-generator', label: 'Intelligence dossiers', icon: FileText }
          ]
        },
        {
          label: 'Forensics & audit',
          items: [
            { id: 'evidence', label: 'Court evidence', icon: FileCheck },
            { id: 'audit', label: 'Audit ledger', icon: BookOpen }
          ]
        },
        {
          label: 'Telemetry',
          items: [
            { id: 'live', label: 'Live telemetry', icon: Radio },
            { id: 'tipline', label: 'Dialect tipline', icon: PhoneCall }
          ]
        },
        {
          label: 'System',
          items: [
            { id: 'admin', label: 'System operations', icon: Terminal },
            { id: 'settings', label: 'Security policies', icon: Settings }
          ]
        }
      ];
    }

    if (currentRole === ROLES.CORPORATE_ENTERPRISE) {
      return [
        {
          label: 'Overview',
          items: [
            { id: 'overview', label: 'Executive desk', icon: LayoutDashboard },
            { id: 'campaigns', label: 'Brand campaigns', icon: ShieldAlert, count: 4 },
            { id: 'enterprise', label: 'Enterprise data profile', icon: Building2 }
          ]
        },
        {
          label: 'Threat intelligence',
          items: [
            { id: 'threats', label: 'Volatility risk', icon: AlertTriangle },
            { id: 'analyst-response', label: 'Threat response', icon: Sparkles },
            { id: 'report-generator', label: 'Executive dossier', icon: FileText }
          ]
        },
        {
          label: 'Forensics & audit',
          items: [
            { id: 'evidence', label: 'Legal evidence', icon: FileCheck }
          ]
        },
        {
          label: 'Telemetry',
          items: [
            { id: 'live', label: 'Market intelligence', icon: Radio }
          ]
        },
        {
          label: 'System',
          items: [
            { id: 'admin', label: 'System operations', icon: Terminal },
            { id: 'settings', label: 'Security policies', icon: Settings }
          ]
        }
      ];
    }

    if (currentRole === ROLES.JOURNALIST_MEDIA) {
      return [
        {
          label: 'Overview',
          items: [
            { id: 'overview', label: 'Newsroom desk', icon: LayoutDashboard },
            { id: 'campaigns', label: 'Monitored campaigns', icon: ShieldAlert, count: 6 }
          ]
        },
        {
          label: 'Investigation',
          items: [
            { id: 'threats', label: 'Reach metrics', icon: AlertTriangle },
            { id: 'analyst-response', label: 'Threat response', icon: Sparkles },
            { id: 'enterprise', label: 'Corporate entities', icon: Building2 },
            { id: 'report-generator', label: 'Press bulletin', icon: FileText }
          ]
        },
        {
          label: 'Telemetry',
          items: [
            { id: 'live', label: 'Viral feed', icon: Radio },
            { id: 'tipline', label: 'Public tipline', icon: PhoneCall, count: 12 }
          ]
        },
        {
          label: 'System',
          items: [
            { id: 'admin', label: 'System operations', icon: Terminal },
            { id: 'settings', label: 'Security policies', icon: Settings }
          ]
        }
      ];
    }

    // Default: Investigation Bureau of India
    return [
      {
        label: 'Overview',
        items: [
          { id: 'overview', label: 'Command desk', icon: LayoutDashboard },
          { id: 'campaigns', label: 'All campaigns', icon: ShieldAlert, count: 17 }
        ]
      },
      {
        label: 'Threat intelligence',
        items: [
          { id: 'threats', label: 'Security risks', icon: AlertTriangle },
          { id: 'analyst-response', label: 'Threat response', icon: Sparkles },
          { id: 'enterprise', label: 'Enterprise entities', icon: Building2 },
          { id: 'report-generator', label: 'Agency dossiers', icon: FileText }
        ]
      },
      {
        label: 'Forensics & audit',
        items: [
          { id: 'evidence', label: 'Court evidence', icon: FileCheck },
          { id: 'audit', label: 'Audit ledger', icon: BookOpen }
        ]
      },
      {
        label: 'Telemetry',
        items: [
          { id: 'live', label: 'Classified feed', icon: Radio },
          { id: 'tipline', label: 'Intercept tipline', icon: PhoneCall, count: 12 }
        ]
      },
      {
        label: 'System',
        items: [
          { id: 'admin', label: 'System operations', icon: Terminal },
          { id: 'settings', label: 'Security policies', icon: Settings }
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
              flexShrink: 0
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
                    <Icon size={16} strokeWidth={1.5} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }} />
                    <div className="sidebar-label-badge-wrap">
                      <span className="sidebar-item-label">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="sidebar-count">
                          {item.count}
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
          gap: '16px'
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

          {/* Multi-Node Cluster Status & Quick Jump Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            fontSize: '11px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                flexShrink: 0
              }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 500, color: 'var(--text-heading)' }}>
                :{typeof window !== 'undefined' ? (window.location.port || '5173') : '5173'}
              </span>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}>
                {currentUser.roleTitle.split('/')[0].trim()}
              </span>
            </div>

            <div style={{ height: '12px', width: '1px', backgroundColor: 'var(--border-color)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {PROFILE_CLUSTER_NODES.map(node => {
                const isCurrent = typeof window !== 'undefined' && window.location.port === node.port;
                return (
                  <a
                    key={node.port}
                    href={node.url}
                    target={isCurrent ? undefined : "_blank"}
                    rel="noreferrer"
                    title={`${node.title} (${node.name}) on Port ${node.port}`}
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isCurrent ? 'var(--bg-raised)' : 'transparent',
                      border: `1px solid ${isCurrent ? 'var(--border-light)' : 'transparent'}`,
                      color: isCurrent ? 'var(--text-heading)' : 'var(--text-muted)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontFamily: 'JetBrains Mono',
                      fontSize: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      cursor: isCurrent ? 'default' : 'pointer'
                    }}
                  >
                    :{node.port} {node.shortTitle}
                  </a>
                );
              })}
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
          minWidth: 0
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
