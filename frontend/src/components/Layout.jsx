import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from './Breadcrumbs';
import ThemeToggle from './ThemeToggle';
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
  X
} from 'lucide-react';

export default function Layout({ currentNav, setCurrentNav, theme, setTheme, children }) {
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
      } catch {}
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

  // Structured Navigation Groups for Shadcn Application Shell 1
  const navGroups = [
    {
      label: 'PLATFORM & RECON',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'live', label: 'Live Intel Feed', icon: Radio, badge: 'LIVE', badgeColor: 'red' },
        { id: 'tipline', label: 'Citizen Tipline', icon: PhoneCall, badge: '12', badgeColor: 'blue' }
      ]
    },
    {
      label: 'INVESTIGATION & THREATS',
      items: [
        { id: 'campaigns', label: 'Campaign #007', icon: ShieldAlert, badge: '94%', badgeColor: 'red' },
        { id: 'narratives', label: 'Narrative Clusters', icon: GitFork },
        { id: 'threats', label: 'Threat Assessments', icon: AlertTriangle },
        { id: 'analyst-response', label: 'Response Studio', icon: Sparkles },
        { id: 'report-generator', label: 'Advisory Generator', icon: FileText }
      ]
    },
    {
      label: 'FORENSICS & LEDGER',
      items: [
        { id: 'evidence', label: 'Evidence Vault', icon: FileCheck },
        { id: 'audit', label: 'Blockchain Audit', icon: BookOpen, badge: 'EVM', badgeColor: 'green' }
      ]
    }
  ];

  const notificationsList = [
    { id: 1, title: 'Campaign #007 Cross-Lingual Surge', desc: 'Hindi & Hinglish paraphrases detected in Tipline within 18m.', time: '2m ago', unread: true },
    { id: 2, title: 'Blockchain Evidence Recorded', desc: 'SHA-256 Digest 0x7f4a... anchored to EVM Block #10429.', time: '14m ago', unread: true },
    { id: 3, title: 'OCR Extraction Completed', desc: 'Poster image normalized from Roman Hindi to Devanagari.', time: '35m ago', unread: false }
  ];

  const sidebarWidth = isCollapsed ? '64px' : '260px';

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-dark)', 
      color: 'var(--text-primary)',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      {/* ========================================================================= */}
      {/* SHADCN APPLICATION SHELL 1: COLLAPSIBLE SIDEBAR                          */}
      {/* ========================================================================= */}
      <aside className={`bs-sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar Header / Organization Switcher */}
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
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ffffff', 
              boxShadow: '0 0 12px rgba(37, 99, 235, 0.45)', 
              flexShrink: 0 
            }}>
              <Shield size={20} strokeWidth={2.4} />
            </div>
            
            <div className="sidebar-brand-text">
              <span>BHARAT-SHIELD</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Content */}
        <div style={{ 
          flex: 1, 
          padding: '12px 8px', 
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
      {/* APPLICATION SHELL 1: MAIN CONTAINER & TOP NAVIGATION BAR                */}
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
            {/* Sidebar Trigger Button (shadcn style) */}
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

          {/* Right Header Section: Search, Blockchain Status, Notifications, Theme & Account Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            
            {/* Global Quick Search Input with kbd badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px',
              padding: '5px 10px',
              width: '210px',
              transition: 'border-color 0.15s ease'
            }}>
              <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search campaigns..." 
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

            {/* Notification Bell with Dropdown */}
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
                      2 UNREAD
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
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px',
                  flexShrink: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>
                  BS
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>
                    Analyst Unit #09
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
                  width: '240px',
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
                      Analyst Unit #09
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      analyst@bharat-shield.gov.in
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: 'var(--accent-green)', 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px', 
                      marginTop: '6px',
                      padding: '3px 8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '9999px',
                      width: 'fit-content'
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
                      Level 4 Clearance
                    </div>
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    <button 
                      onClick={() => { setCurrentNav('audit'); setShowUserMenu(false); }}
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
                      <BookOpen size={14} style={{ color: 'var(--accent-blue)' }} /> 
                      <span>Audit Trail Log</span>
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
                      <span>Defense Dashboard</span>
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
