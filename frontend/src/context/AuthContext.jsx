import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const MASTER_PASSWORDS = ['sentinel@16#', 'Naman@16#'];
export const MASTER_PASSWORD = 'sentinel@16#';

export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  INVESTIGATION_BUREAU: 'investigation_bureau',
  CORPORATE_ENTERPRISE: 'corporate_enterprise',
  JOURNALIST_MEDIA: 'journalist_media'
};

export const USER_PROFILES = {
  [ROLES.SYSTEM_ADMIN]: {
    id: 'user_admin_000',
    name: 'Naman Saini',
    email: 'saininaman643@gmail.com',
    phone: '+91 98110 00001',
    username: 'naman_superadmin',
    defaultPassword: 'Naman@16#',
    role: ROLES.SYSTEM_ADMIN,
    roleTitle: 'Super Administrator / NCCC Operations Command',
    organization: 'National Cyber Coordination Centre (NCCC) & MoD',
    clearance: 'Level 5+ (Supreme Root Authority)',
    clearanceLevel: 6,
    badgeColor: '#10b981',
    badgeText: 'SUPREME ADMIN // ROOT',
    avatarInitials: 'NS',
    allowedNavs: [
      'overview', 'live', 'tipline', 'campaigns', 'narratives', 
      'threats', 'analyst-response', 'report-generator', 'evidence', 'audit', 'admin', 'settings'
    ],
    features: {
      canManageSystem: true,
      canIssueSec69A: true,
      canAccessClassifiedIntel: true,
      canViewUnmaskedMetadata: true,
      canGenerateLegalDossier: true,
      canSignBlockchainEvidence: true,
      canGenerateSEBIDisclosure: true,
      canTrackMarketSabotage: true,
      canPublishFactCheck: true,
      canInspectNarrativeTree: true,
      canViewAuditLedger: true,
      scopeTitle: 'Full Spectrum Software Architecture & Threat Grid Management'
    }
  },
  [ROLES.INVESTIGATION_BUREAU]: {
    id: 'user_ib_001',
    name: 'Joint Director Vikram Rawat',
    email: 'v.rawat@ib.gov.in',
    phone: '+91 98100 44219',
    username: 'v_rawat_ib',
    defaultPassword: 'sentinel@16#',
    role: ROLES.INVESTIGATION_BUREAU,
    roleTitle: 'Investigation Bureau of India (IB / LEA)',
    organization: 'Ministry of Home Affairs / Cyber Ops Command',
    clearance: 'Level 5 (Classified / National Security)',
    clearanceLevel: 5,
    badgeColor: '#ef4444',
    badgeText: 'TOP SECRET / LEA',
    avatarInitials: 'IB',
    allowedNavs: [
      'overview', 'live', 'tipline', 'campaigns', 'narratives', 
      'threats', 'analyst-response', 'report-generator', 'evidence', 'audit', 'admin', 'settings'
    ],
    features: {
      canIssueSec69A: true,
      canAccessClassifiedIntel: true,
      canViewUnmaskedMetadata: true,
      canGenerateLegalDossier: true,
      canSignBlockchainEvidence: true,
      canGenerateSEBIDisclosure: false,
      canTrackMarketSabotage: false,
      canPublishFactCheck: false,
      canInspectNarrativeTree: true,
      canViewAuditLedger: true,
      scopeTitle: 'National Security & Inter-Agency Threat Matrix'
    }
  },
  [ROLES.CORPORATE_ENTERPRISE]: {
    id: 'user_tata_007',
    name: 'Rajesh Singhania',
    email: 'ciso.defense@tata.com',
    phone: '+91 98200 88314',
    username: 'rsinghania_tata',
    defaultPassword: 'sentinel@16#',
    role: ROLES.CORPORATE_ENTERPRISE,
    roleTitle: 'Tata Sons — Brand Defense & Market Risk',
    organization: 'Tata Strategic Threat Intelligence & Brand Protection',
    clearance: 'Enterprise Tier-1 (Corporate Risk & Security)',
    clearanceLevel: 3,
    badgeColor: '#f59e0b',
    badgeText: 'ENTERPRISE RISK',
    avatarInitials: 'TG',
    allowedNavs: [
      'overview', 'live', 'campaigns', 'narratives', 
      'threats', 'analyst-response', 'report-generator', 'evidence', 'admin', 'settings'
    ],
    features: {
      canIssueSec69A: false,
      canAccessClassifiedIntel: false,
      canViewUnmaskedMetadata: false,
      canGenerateLegalDossier: false,
      canSignBlockchainEvidence: true,
      canGenerateSEBIDisclosure: true,
      canTrackMarketSabotage: true,
      canPublishFactCheck: false,
      canInspectNarrativeTree: true,
      canViewAuditLedger: false,
      scopeTitle: 'Corporate Threat Radar & Market Sentiment Defense'
    }
  },
  [ROLES.JOURNALIST_MEDIA]: {
    id: 'user_media_404',
    name: 'Pooja Kashyap',
    email: 'pooja.k@nationalpress.org',
    phone: '+91 99112 33451',
    username: 'pkashyap_npc',
    defaultPassword: 'sentinel@16#',
    role: ROLES.JOURNALIST_MEDIA,
    roleTitle: 'Investigative Bureau Lead / Fact-Checker',
    organization: 'National Press Consortium & Fact-Check Desk',
    clearance: 'Public Trust (Certified Fact-Checker)',
    clearanceLevel: 2,
    badgeColor: '#3b82f6',
    badgeText: 'PRESS ACCREDITED',
    avatarInitials: 'NP',
    allowedNavs: [
      'overview', 'live', 'tipline', 'campaigns', 'narratives', 
      'threats', 'analyst-response', 'report-generator', 'admin', 'settings'
    ],
    features: {
      canIssueSec69A: false,
      canAccessClassifiedIntel: false,
      canViewUnmaskedMetadata: false,
      canGenerateLegalDossier: false,
      canSignBlockchainEvidence: false,
      canGenerateSEBIDisclosure: false,
      canTrackMarketSabotage: false,
      canPublishFactCheck: true,
      canInspectNarrativeTree: true,
      canViewAuditLedger: false,
      scopeTitle: 'Public Virality & Cross-Lingual Narrative Verification'
    }
  },
  // Alias keys for robust backward-compatibility
  'admin': {
    id: 'user_admin_000',
    name: 'Naman Saini',
    email: 'saininaman643@gmail.com',
    phone: '+91 98110 00001',
    username: 'naman_superadmin',
    defaultPassword: 'Naman@16#',
    role: ROLES.SYSTEM_ADMIN,
    roleTitle: 'Super Administrator / NCCC Operations Command',
    organization: 'National Cyber Coordination Centre (NCCC) & MoD',
    clearance: 'Level 5+ (Supreme Root Authority)',
    clearanceLevel: 6,
    badgeColor: '#10b981',
    badgeText: 'SUPREME ADMIN // ROOT',
    avatarInitials: 'NS',
    allowedNavs: [
      'overview', 'live', 'tipline', 'campaigns', 'narratives', 
      'threats', 'analyst-response', 'report-generator', 'evidence', 'audit', 'admin', 'settings'
    ],
    features: {
      canManageSystem: true,
      canIssueSec69A: true,
      canAccessClassifiedIntel: true,
      canViewUnmaskedMetadata: true,
      canGenerateLegalDossier: true,
      canSignBlockchainEvidence: true,
      canGenerateSEBIDisclosure: true,
      canTrackMarketSabotage: true,
      canPublishFactCheck: true,
      canInspectNarrativeTree: true,
      canViewAuditLedger: true,
      scopeTitle: 'Full Spectrum Software Architecture & Threat Grid Management'
    }
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('bharat_shield_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat_shield_active_role');
      return saved && USER_PROFILES[saved] ? saved : ROLES.INVESTIGATION_BUREAU;
    } catch {
      return ROLES.INVESTIGATION_BUREAU;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => USER_PROFILES[currentRole] || USER_PROFILES[ROLES.INVESTIGATION_BUREAU]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const profile = USER_PROFILES[currentRole] || USER_PROFILES[ROLES.INVESTIGATION_BUREAU];
    setCurrentUser(profile);
    try {
      localStorage.setItem('bharat_shield_active_role', currentRole);
    } catch {}
  }, [currentRole]);

  const login = useCallback(async ({ password, roleKey = ROLES.INVESTIGATION_BUREAU, customName = '', customPhone = '', customUsername = '', customEmail = '' }) => {
    const isMaster = MASTER_PASSWORDS.includes(password) || password === 'sentinel@16#' || password === 'Naman@16#';
    
    // Valid if master password OR standard demo login
    if (!isMaster && password.length < 4 && password !== 'admin' && password !== 'sentinel') {
      throw new Error('Invalid credentials. Please enter a valid password.');
    }

    const targetRole = USER_PROFILES[roleKey] ? roleKey : ROLES.INVESTIGATION_BUREAU;
    const baseProfile = USER_PROFILES[targetRole];

    const userProfile = {
      ...baseProfile,
      name: customName || baseProfile.name,
      email: customEmail || baseProfile.email,
      phone: customPhone || baseProfile.phone,
      username: customUsername || baseProfile.username
    };

    setCurrentRole(targetRole);
    setCurrentUser(userProfile);
    setIsAuthenticated(true);

    try {
      localStorage.setItem('bharat_shield_authenticated', 'true');
      localStorage.setItem('bharat_shield_active_role', targetRole);
      
      // Audit log to backend
      fetch('http://127.0.0.1:8000/api/auth/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': targetRole },
        body: JSON.stringify({
          action: isMaster ? 'MASTER_KEY_LOGIN_SUCCESS' : 'LOGIN_SUCCESS',
          target: `${userProfile.name} (${userProfile.clearance})`,
          details: { isMaster, timestamp: new Date().toISOString() }
        })
      }).catch(() => {});
    } catch {}

    return userProfile;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('bharat_shield_authenticated');
    } catch {}
  }, []);

  const switchRole = useCallback(async (roleKey) => {
    if (USER_PROFILES[roleKey]) {
      setCurrentRole(roleKey);
      try {
        await fetch('http://127.0.0.1:8000/api/auth/switch-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target_role: roleKey, reason: 'Operator persona switch' })
        });
      } catch (err) {
        console.warn('Backend audit sync skipped or backend offline:', err);
      }
    }
  }, []);

  const hasAccessToNav = useCallback((navId) => {
    return currentUser?.allowedNavs?.includes(navId) ?? false;
  }, [currentUser]);

  const can = useCallback((featureKey) => {
    return !!currentUser?.features?.[featureKey];
  }, [currentUser]);

  const executeProtectedAction = useCallback(async (actionType, campaignId, details = {}) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyst/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentRole,
          'X-User-Id': currentUser.id
        },
        body: JSON.stringify({
          action_type: actionType,
          campaign_id: campaignId,
          details
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Action authorization failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Protected action execution error:', err);
      throw err;
    }
  }, [currentRole, currentUser]);

  const recordAuditLog = useCallback(async (action, target, details = {}) => {
    try {
      await fetch('http://127.0.0.1:8000/api/auth/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentRole
        },
        body: JSON.stringify({ action, target, details })
      });
    } catch (err) {
      console.warn('Audit logging failed:', err);
    }
  }, [currentRole]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      currentRole,
      currentUser,
      switchRole,
      hasAccessToNav,
      can,
      executeProtectedAction,
      recordAuditLog,
      isAuthModalOpen,
      setIsAuthModalOpen,
      masterPassword: MASTER_PASSWORD,
      allProfiles: USER_PROFILES
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
