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
      key: ROLES.SYSTEM_ADMIN,
      title: 'Operations Admin',
      subtitle: 'System infrastructure & telemetry governance',
      badge: 'Admin',
      badgeBg: 'rgba(255, 255, 255, 0.05)',
      badgeColor: 'var(--text-secondary)',
      icon: ShieldCheck,
      iconColor: 'var(--text-primary)',
      targetEntity: 'National Cyber Coordination Centre',
      capabilities: [
        'Full software management & node cluster telemetry',
        'Operator clearance & credentials governance',
        'Ingestion connector pipeline controls',
        'Model hyperparameter & threshold tuning'
      ]
    },
    {
      key: ROLES.INVESTIGATION_BUREAU,
      title: 'Investigation Bureau',
      subtitle: 'National security & cross-border threat monitoring',
      badge: 'Classified',
      badgeBg: 'rgba(239, 68, 68, 0.1)',
      badgeColor: 'var(--risk-critical)',
      icon: ShieldCheck,
      iconColor: 'var(--risk-critical)',
      targetEntity: 'Inter-Agency Cyber Command',
      capabilities: [
        'State-sponsored disinformation alerts',
        'Botnet & synthetic media tracking',
        'Section 69A IT Act emergency dossiers',
        'Cryptographic hash verification'
      ]
    },
    {
      key: ROLES.CORPORATE_ENTERPRISE,
      title: 'Enterprise Risk',
      subtitle: 'Brand defense & market risk monitoring',
      badge: 'Enterprise',
      badgeBg: 'rgba(245, 158, 11, 0.1)',
      badgeColor: 'var(--risk-elevated)',
      icon: Building2,
      iconColor: 'var(--risk-elevated)',
      targetEntity: 'Brand Protection & Market Intelligence',
      capabilities: [
        'Market smear & stock sabotage detection',
        'Executive impersonation & phishing alerts',
        'Supply chain rumor tracking',
        'Investor clarification counter-briefs'
      ]
    },
    {
      key: ROLES.JOURNALIST_MEDIA,
      title: 'Press Desk',
      subtitle: 'Fact-checking & viral intelligence intake',
      badge: 'Accredited',
      badgeBg: 'rgba(59, 130, 246, 0.1)',
      badgeColor: 'var(--accent-primary)',
      icon: Newspaper,
      iconColor: 'var(--accent-primary)',
      targetEntity: 'Press Consortium & Fact Desk',
      capabilities: [
        'Viral social media rumor genealogies',
        'WhatsApp/Telegram forward tracking',
        'Cross-lingual debunk generation',
        'Pre-publication verification queue'
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
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-control)',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)'
            }}>
              <Fingerprint size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                Operational persona
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '1px 0 0 0' }}>
                Select an authorized operational clearance profile
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
              borderRadius: 'var(--radius-control)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Cards Grid */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
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
                  border: isSelected ? '1px solid var(--border-light)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--bg-raised)' : 'var(--bg-input)',
                  borderRadius: 'var(--radius-control)',
                  padding: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.12s ease, border-color 0.12s ease',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-deep)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} strokeWidth={2.5} />
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
