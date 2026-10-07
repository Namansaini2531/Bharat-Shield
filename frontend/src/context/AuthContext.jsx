import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const ROLES = {
  INVESTIGATION_BUREAU: 'investigation_bureau',
  CORPORATE_ENTERPRISE: 'corporate_enterprise',
  JOURNALIST_MEDIA: 'journalist_media'
};

export const USER_PROFILES = {
  [ROLES.INVESTIGATION_BUREAU]: {
    id: 'user_ib_001',
    name: 'Joint Director Vikram Rawat',
    email: 'v.rawat@ib.gov.in',
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
      'threats', 'analyst-response', 'report-generator', 'evidence', 'audit', 'settings'
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
    id: 'user_adani_007',
    name: 'Rajesh Singhania',
    email: 'ciso.defense@adani.com',
    role: ROLES.CORPORATE_ENTERPRISE,
    roleTitle: 'Adani Group — Brand Defense & Market Risk',
    organization: 'Adani Corporate Security & Threat Intelligence',
    clearance: 'Enterprise Tier-1 (Corporate Risk & Security)',
    clearanceLevel: 3,
    badgeColor: '#f59e0b',
    badgeText: 'ENTERPRISE RISK',
    avatarInitials: 'AG',
    allowedNavs: [
      'overview', 'live', 'campaigns', 'narratives', 
      'threats', 'analyst-response', 'report-generator', 'evidence', 'settings'
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
      'threats', 'analyst-response', 'report-generator', 'settings'
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
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat_shield_active_role');
      return saved && USER_PROFILES[saved] ? saved : ROLES.INVESTIGATION_BUREAU;
    } catch {
      return ROLES.INVESTIGATION_BUREAU;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => USER_PROFILES[currentRole]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [auditEventNotification, setAuditEventNotification] = useState(null);

  useEffect(() => {
    const profile = USER_PROFILES[currentRole] || USER_PROFILES[ROLES.INVESTIGATION_BUREAU];
    setCurrentUser(profile);
    try {
      localStorage.setItem('bharat_shield_active_role', currentRole);
    } catch {}
  }, [currentRole]);

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
      currentRole,
      currentUser,
      switchRole,
      hasAccessToNav,
      can,
      executeProtectedAction,
      recordAuditLog,
      isAuthModalOpen,
      setIsAuthModalOpen,
      auditEventNotification,
      setAuditEventNotification,
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
