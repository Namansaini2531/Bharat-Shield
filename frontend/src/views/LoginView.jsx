import React, { useState, useRef, useEffect } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import { 
  Eye, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  Check,
  ChevronDown,
  Shield,
  ShieldAlert,
  Building2,
  Newspaper,
  UserCheck,
  Lock,
  Crown
} from 'lucide-react';

const ACCOUNTS = [
  {
    id: 'super_admin',
    role: ROLES.SYSTEM_ADMIN,
    name: 'Naman Saini',
    email: 'saininaman643@gmail.com',
    password: 'Naman@16#',
    title: 'Super Administrator / Root Command',
    badgeText: 'SUPREME ROOT // ADMIN',
    badgeColor: '#10b981',
    initials: 'NS',
    icon: Crown,
    organization: 'NCCC Operations & Ministry of Defence'
  },
  {
    id: 'ib_lea',
    role: ROLES.INVESTIGATION_BUREAU,
    name: 'Vikram Rawat',
    email: 'v.rawat@ib.gov.in',
    password: 'sentinel@16#',
    title: 'Joint Director / Cyber Operations',
    badgeText: 'TOP SECRET / LEA',
    badgeColor: '#ef4444',
    initials: 'IB',
    icon: ShieldAlert,
    organization: 'Investigation Bureau & MHA'
  },
  {
    id: 'adani_corp',
    role: ROLES.CORPORATE_ENTERPRISE,
    name: 'Rajesh Singhania',
    email: 'ciso.defense@adani.com',
    password: 'sentinel@16#',
    title: 'CISO / Brand Defense Lead',
    badgeText: 'ENTERPRISE RISK',
    badgeColor: '#f59e0b',
    initials: 'AG',
    icon: Building2,
    organization: 'Adani Strategic Intelligence'
  },
  {
    id: 'media_press',
    role: ROLES.JOURNALIST_MEDIA,
    name: 'Pooja Kashyap',
    email: 'pooja.k@nationalpress.org',
    password: 'sentinel@16#',
    title: 'Investigative Fact-Check Lead',
    badgeText: 'PRESS ACCREDITED',
    badgeColor: '#3b82f6',
    initials: 'NP',
    icon: Newspaper,
    organization: 'National Press Consortium'
  }
];

export default function LoginView() {
  const { login } = useAuth();

  // Default to Super Admin (Naman Saini)
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [email, setEmail] = useState(ACCOUNTS[0].email);
  const [password, setPassword] = useState(ACCOUNTS[0].password);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ACCOUNTS[0].role);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const dropdownRef = useRef(null);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofill handler when selecting an account from dropdown
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account.role);
    setTouched({ email: true, password: true });
    setErrors({ email: '', password: '' });
    setServerError('');
    setIsDropdownOpen(false);

    setToastMessage(`Autofilled credentials for ${account.name} (${account.badgeText})`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Email validation regex
  const validateEmail = (val) => {
    if (!val || !val.trim()) {
      return 'Work email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (val) => {
    if (!val) {
      return 'Password is required';
    }
    if (val.length < 4) {
      return 'Password must be at least 4 characters';
    }
    return '';
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(val) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const isEmailValid = !validateEmail(email);
  const isPasswordValid = !validatePassword(password);
  const isButtonDisabled = !email.trim() || !password || !isEmailValid || !isPasswordValid || isSubmitting;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setServerError('');

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        password: password.trim(),
        roleKey: selectedRole,
        customEmail: email.trim(),
        customName: selectedAccount?.name
      });
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInSlide {
          0% { opacity: 0; transform: translateY(-8px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .input-box:focus-within {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
        }
        .btn-sign-in:hover:not(:disabled) {
          background-color: #dc2626 !important;
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4) !important;
        }
        .account-item:hover {
          background-color: #f8fafc !important;
        }
        .account-circle-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>

      {/* ================= TOP-RIGHT CIRCULAR ACCOUNT SWITCHER BUTTON & DROPDOWN ================= */}
      <div 
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: '24px',
          right: '28px',
          zIndex: 1000
        }}
      >
        {/* Circular Avatar Switcher Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="account-circle-btn"
          title="Switch Account // Quick Autofill"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: `2px solid ${selectedAccount?.badgeColor || '#3b82f6'}`,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: `${selectedAccount?.badgeColor || '#3b82f6'}18`,
            color: selectedAccount?.badgeColor || '#3b82f6',
            fontWeight: 800,
            fontSize: '13px',
            fontFamily: 'JetBrains Mono, monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {selectedAccount?.initials || 'SA'}
          </div>

          {/* Active Status Pulse Indicator */}
          <span style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: selectedAccount?.badgeColor || '#10b981',
            border: '2px solid #ffffff',
            boxShadow: `0 0 6px ${selectedAccount?.badgeColor || '#10b981'}`
          }} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '56px',
            right: '0px',
            width: '340px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 1px 1px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            padding: '12px',
            animation: 'fadeInSlide 0.2s ease-out forwards',
            zIndex: 1001
          }}>
            <div style={{
              padding: '6px 10px 10px 10px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Select Account to Autofill
              </span>
              <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                4 PROFILES
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {ACCOUNTS.map((acc) => {
                const isSelected = selectedAccount?.id === acc.id;
                const IconComponent = acc.icon;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectAccount(acc)}
                    className="account-item"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.06)' : 'transparent',
                      border: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Avatar Circle */}
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: `${acc.badgeColor}15`,
                      border: `1.5px solid ${acc.badgeColor}`,
                      color: acc.badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                      flexShrink: 0
                    }}>
                      {acc.initials}
                    </div>

                    {/* Account Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                          {acc.name}
                        </span>
                        {isSelected && <Check size={14} style={{ color: '#3b82f6', strokeWidth: 3 }} />}
                      </div>
                      
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {acc.email}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: `${acc.badgeColor}15`,
                          color: acc.badgeColor,
                          border: `1px solid ${acc.badgeColor}30`,
                          letterSpacing: '0.4px'
                        }}>
                          {acc.badgeText}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= LEFT COLUMN: Dark Aesthetic with Diagonal Glowing Capsules ================= */}
      <div style={{
        backgroundColor: '#090d16',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 60px',
        color: '#ffffff'
      }}>
        {/* Subtle grid pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none'
        }} />

        {/* Floating Diagonal Gradient Capsules */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-20%',
          width: '650px',
          height: '650px',
          pointerEvents: 'none'
        }}>
          {/* Capsule 1 */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '60px',
            width: '420px',
            height: '80px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)',
            transform: 'rotate(-45deg)'
          }} />

          {/* Capsule 2 */}
          <div style={{
            position: 'absolute',
            top: '200px',
            left: '120px',
            width: '480px',
            height: '90px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 0 50px rgba(16, 185, 129, 0.25)',
            transform: 'rotate(-45deg)'
          }} />

          {/* Capsule 3 */}
          <div style={{
            position: 'absolute',
            top: '340px',
            left: '190px',
            width: '380px',
            height: '75px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.02) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.15)',
            transform: 'rotate(-45deg)'
          }} />
        </div>

        {/* Top Logo Header */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.45)',
            backdropFilter: 'blur(8px)',
            flexShrink: 0
          }}>
            <img src={logoImg} alt="Bharat-Shield Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1.1 }}>
              BHARAT-SHIELD
            </div>
            <div style={{ fontSize: '11px', color: '#38bdf8', letterSpacing: '2px', fontWeight: 700, marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
              COGNITIVE DEFENSE SENTINEL
            </div>
          </div>
        </div>

        {/* Bottom Hero Description */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '420px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.8px', marginBottom: '14px' }}>
            Unified Threat Intelligence & Cognitive Grid
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Empowering defense analysts, law enforcement, and risk leaders with real-time AI narrative verification and EVM-sealed court evidence.
          </p>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: Clean White Form ================= */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '60px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          {/* Header Title & Subtitle */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0f172a',
              margin: '0 0 6px 0',
              letterSpacing: '-1px'
            }}>
              Welcome Back!
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.5
            }}>
              Access your security partition with verified operational credentials.
            </p>
          </div>

          {/* Toast Notification if Account Selected */}
          {toastMessage && (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '18px',
              fontSize: '12px',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeInSlide 0.2s ease-out'
            }}>
              <Check size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Active Clearance Badge Card */}
          <div style={{
            backgroundColor: `${selectedAccount?.badgeColor || '#10b981'}10`,
            border: `1px solid ${selectedAccount?.badgeColor || '#10b981'}30`,
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Clearance Persona
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: selectedAccount?.badgeColor || '#10b981', marginTop: '2px' }}>
                {selectedAccount?.name} • {selectedAccount?.badgeText}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2563eb',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Switch</span>
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Server / Auth Error Banner */}
          {serverError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#991b1b',
              fontSize: '13px'
            }}>
              <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span>{serverError}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* EMAIL INPUT */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '6px'
              }}>
                Work Email
              </label>
              
              <div 
                className="input-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: errors.email && touched.email ? '1px solid #ef4444' : '1px solid #cbd5e1',
                  borderRadius: '14px',
                  backgroundColor: '#ffffff',
                  padding: '0 16px',
                  height: '48px',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@organization.gov.in"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>

              {errors.email && touched.email && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1e293b'
                }}>
                  Operational Password
                </label>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Master: <code style={{ color: '#0f172a', fontWeight: 600 }}>Naman@16#</code>
                </span>
              </div>
              
              <div 
                className="input-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: errors.password && touched.password ? '1px solid #ef4444' : '1px solid #cbd5e1',
                  borderRadius: '14px',
                  backgroundColor: '#ffffff',
                  padding: '0 16px',
                  height: '48px',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a',
                    backgroundColor: 'transparent'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && touched.password && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* REMEMBER ME */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
                />
                <span>Persist operational session</span>
              </label>

              <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'JetBrains Mono' }}>
                EVM Auth Ready
              </span>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="btn-sign-in"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: isButtonDisabled ? '#94a3b8' : '#ef4444',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.8px',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                boxShadow: isButtonDisabled ? 'none' : '0 4px 14px rgba(239, 68, 68, 0.35)',
                transition: 'all 0.2s ease',
                marginTop: '4px'
              }}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>AUTHENTICATING SENTINEL...</span>
                </div>
              ) : (
                'SIGN IN TO SENTINEL'
              )}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
