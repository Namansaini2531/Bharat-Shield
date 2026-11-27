import React from 'react';
import logoImg from '../assets/logo.png';
import {
  PanelLeftClose,
  PanelLeft,
  Settings,
  Fingerprint,
  LogOut,
  ShieldCheck,
  Building2,
  Newspaper,
  Terminal
} from 'lucide-react';
import { ROLES } from '../context/AuthContext';

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  currentNav,
  setCurrentNav,
  navGroups,
  currentUser,
  currentRole,
  setIsAuthModalOpen,
  logout
}) {
  const getRoleIcon = () => {
    if (currentRole === ROLES.SYSTEM_ADMIN) return Terminal;
    if (currentRole === ROLES.CORPORATE_ENTERPRISE) return Building2;
    if (currentRole === ROLES.JOURNALIST_MEDIA) return Newspaper;
    return ShieldCheck;
  };

  const RoleIcon = getRoleIcon();

  return (
    <aside className={`bs-sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* 1. Header / Brand Strip */}
      <div className="sidebar-brand-container">
        <div
          className="sidebar-brand-inner"
          onClick={isCollapsed ? toggleSidebar : undefined}
          title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : undefined}
        >
          <div className="sidebar-logo-wrap">
            <img src={logoImg} alt="Bharat-Shield Sentinel" className="sidebar-logo-img" />
          </div>
          {!isCollapsed && (
            <div className="sidebar-brand-info">
              <span className="sidebar-brand-title">BHARAT-SHIELD</span>
              <span className="sidebar-brand-subtitle">SENTINEL FORENSICS</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            title="Collapse Sidebar (Ctrl+B)"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* 2. Navigation Items List */}
      <div className="sidebar-nav-container">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="sidebar-group">
            {!isCollapsed ? (
              <div className="sidebar-group-label">{group.label}</div>
            ) : groupIdx > 0 ? (
              <div className="sidebar-collapsed-divider" />
            ) : null}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentNav(item.id)}
                  title={isCollapsed ? `${item.label}${item.count !== undefined ? ` (${item.count})` : ''}` : undefined}
                  className={`sidebar-menu-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon-wrap">
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
                    {isCollapsed && item.count !== undefined && (
                      <span className="sidebar-collapsed-dot" />
                    )}
                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="sidebar-item-label">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="sidebar-count">{item.count}</span>
                      )}
                    </>
                  )}

                  {isActive && <span className="sidebar-active-indicator" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Settings Navigation Option */}
      <div className="sidebar-footer-nav">
        <button
          onClick={() => setCurrentNav('settings')}
          title={isCollapsed ? "System Settings" : undefined}
          className={`sidebar-menu-btn ${currentNav === 'settings' ? 'active' : ''}`}
        >
          <span className="sidebar-icon-wrap">
            <Settings size={18} strokeWidth={currentNav === 'settings' ? 2 : 1.75} />
          </span>
          {!isCollapsed && (
            <span className="sidebar-item-label">System settings</span>
          )}
          {currentNav === 'settings' && <span className="sidebar-active-indicator" />}
        </button>
      </div>

      {/* 4. User Persona & RBAC Footer */}
      <div className="sidebar-user-section">
        {!isCollapsed ? (
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar" style={{ borderColor: currentUser?.badgeColor || '#3b82f6' }}>
              <RoleIcon size={15} style={{ color: currentUser?.badgeColor || '#3b82f6' }} />
            </div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-name" title={currentUser?.name || 'Commander Arvind Sharma'}>
                {currentUser?.name || 'Commander Arvind Sharma'}
              </div>
              <div className="sidebar-user-role">
                <span className="sidebar-status-dot" style={{ backgroundColor: currentUser?.badgeColor || '#10b981' }} />
                <span>{currentUser?.role || 'Lead Investigator'}</span>
              </div>
            </div>
            <div className="sidebar-user-actions">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                title="Switch RBAC Persona"
                className="sidebar-mini-action-btn"
                aria-label="Switch RBAC Persona"
              >
                <Fingerprint size={14} />
              </button>
              <button
                onClick={logout}
                title="Lock & Sign Out"
                className="sidebar-mini-action-btn danger"
                aria-label="Lock & Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            title={`${currentUser?.name || 'Commander Arvind Sharma'} (${currentUser?.role || 'Lead Investigator'}) - Click to switch persona`}
            className="sidebar-collapsed-user-btn"
            aria-label="Switch RBAC Persona"
          >
            <div className="sidebar-user-avatar-collapsed" style={{ borderColor: currentUser?.badgeColor || '#3b82f6' }}>
              <RoleIcon size={16} style={{ color: currentUser?.badgeColor || '#3b82f6' }} />
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}
