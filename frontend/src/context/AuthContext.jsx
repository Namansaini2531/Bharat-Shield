import React, { createContext, useContext, useState, useEffect } from 'react';

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
    organization: 'Ministry of Home Affairs / Cyber Ops',
    clearance: 'Level 5 (Classified / National Security)',
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
      canGenerateSEBIDisclosure: true,
      canTrackMarketSabotage: true,
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
      canPublishFactCheck: true,
      canInspectNarrativeTree: true,
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

  useEffect(() => {
    setCurrentUser(USER_PROFILES[currentRole]);
    try {
      localStorage.setItem('bharat_shield_active_role', currentRole);
    } catch {}
  }, [currentRole]);

  const switchRole = (roleKey) => {
    if (USER_PROFILES[roleKey]) {
      setCurrentRole(roleKey);
    }
  };

  const hasAccessToNav = (navId) => {
    return currentUser.allowedNavs.includes(navId);
  };

  return (
    <AuthContext.Provider value={{
      currentRole,
      currentUser,
      switchRole,
      hasAccessToNav,
      isAuthModalOpen,
      setIsAuthModalOpen,
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
