import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Building2, 
  Newspaper, 
  Lock, 
  Check, 
  X, 
  KeyRound, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Fingerprint
} from 'lucide-react';

export default function RoleSwitchModal({ isOpen, onClose }) {
  const { currentRole, switchRole, allProfiles } = useAuth();

  if (!isOpen) return null;

  const roleCards = [
    {
      key: ROLES.INVESTIGATION_BUREAU,
      title: 'Investigation Bureau of India',
      subtitle: 'Law Enforcement & National Security Wing',
      badge: 'TOP SECRET (Level 5)',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeColor: '#ef4444',
      icon: ShieldCheck,
      iconColor: '#ef4444',
      targetEntity: 'Ministry of Home Affairs / Inter-Agency Cyber Command',
      capabilities: [
        'Classified state-sponsored disinformation alerts',
        'Cross-border botnet & deepfake threat tracking',
        'Section 69A IT Act emergency takedown dossiers',
        'Court-admissible SHA-256 / EVM blockchain evidence'
      ]
    },
    {
      key: ROLES.CORPORATE_ENTERPRISE,
      title: 'Adani Group — Brand Defense',
      subtitle: 'Corporate Risk & Market Intelligence',
      badge: 'ENTERPRISE TIER-1',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#f59e0b',
      icon: Building2,
      iconColor: '#f59e0b',
      targetEntity: 'Adani Strategic Threat & Brand Defense Unit',
      capabilities: [
        'Stock manipulation & short-seller smear detection',
        'Executive deepfake & phishing alert radar',
        'Supply chain & ESG disinformation monitoring',
        'BSE / NSE investor clarification counter-briefs'
      ]
    },
    {
      key: ROLES.JOURNALIST_MEDIA,
      title: 'National Press Consortium',
      subtitle: 'Fact-Checking & Investigative Journalism',
      badge: 'PRESS ACCREDITED',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeColor: '#3b82f6',
      icon: Newspaper,
      iconColor: '#3b82f6',
      targetEntity: 'Media Bureau & Citizen Fact-Check Desk',
      capabilities: [
        'Viral social media rumor origin genealogy',
        'WhatsApp/Telegram forward mutation tracking',
        'Cross-lingual debunk cards (Hindi, Hinglish, English)',
        'Pre-publication viral claim verification radar'
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '850px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--inner-box-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Fingerprint size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Role-Based Access Control (RBAC) Portal
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Select an authorized operational persona to switch clearance level and data partition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Cards Grid */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          {roleCards.map(card => {
            const isSelected = currentRole === card.key;
            const Icon = card.icon;

            return (
              <div
                key={card.key}
                onClick={() => {
                  switchRole(card.key);
                  onClose();
                }}
                style={{
                  border: isSelected ? `2px solid ${card.badgeColor}` : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'var(--inner-box-bg)',
                  borderRadius: '12px',
                  padding: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: card.badgeColor,
                    color: '#ffffff',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: card.badgeBg,
                      color: card.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: card.badgeBg,
                        color: card.badgeColor
                      }}>
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 4px 0' }}>
                    {card.title}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.3 }}>
                    {card.subtitle}
                  </div>

                  <div style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    letterSpacing: '0.5px'
                  }}>
                    Assigned Scope & Permissions:
                  </div>

                  <ul style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {card.capabilities.map((cap, idx) => (
                      <li key={idx} style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        lineHeight: 1.3
                      }}>
                        <span style={{ color: card.iconColor, marginTop: '2px' }}>•</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isSelected ? 'none' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? card.badgeColor : 'transparent',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? 'Active Persona' : 'Switch to this Persona'}
                    {!isSelected && <ChevronRight size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--inner-box-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Lock size={14} />
            <span>Encrypted zero-trust tenant isolation with end-to-end audit trails</span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
