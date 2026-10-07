import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import { 
  Eye, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';


export default function LoginView() {
  const { login, allProfiles } = useAuth();

  const [email, setEmail] = useState('admin@sentinel.gov.in');
  const [password, setPassword] = useState('sentinel@16#');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.INVESTIGATION_BUREAU);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleQuickAutofill = () => {
    setEmail('admin@sentinel.gov.in');
    setPassword('sentinel@16#');
    setTouched({ email: true, password: true });
    setErrors({ email: '', password: '' });
    setServerError('');
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
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .input-box:focus-within {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
        }
        .btn-sign-in:hover:not(:disabled) {
          background-color: #dc2626 !important;
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4) !important;
        }
      `}</style>

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
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{
              fontSize: '34px',
              fontWeight: 900,
              color: '#0f172a',
              margin: '0 0 8px 0',
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
              Log in to start managing your projects and clients with ease.
            </p>
          </div>

          {/* Quick Demo Autofill Badge */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '24px',
            fontSize: '12px',
            color: '#1e40af'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: '#2563eb' }} /> Default Demo Login
              </span>
              <button
                type="button"
                onClick={handleQuickAutofill}
                style={{
                  background: '#2563eb',
                  border: 'none',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Autofill
              </button>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#1e3a8a' }}>
              <div><strong>Email:</strong> admin@sentinel.gov.in</div>
              <div><strong>Password:</strong> sentinel@16#</div>
            </div>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* WORK EMAIL * */}
            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#334155',
                display: 'block',
                marginBottom: '8px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                WORK EMAIL <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div 
                className="input-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: touched.email && errors.email ? '#fef2f2' : '#ffffff',
                  border: `1px solid ${touched.email && errors.email ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: '14px',
                  padding: '13px 16px',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@company.com"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '14px',
                    color: '#0f172a',
                    fontWeight: 500
                  }}
                />
              </div>
              {touched.email && errors.email && (
                <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* PASSWORD * */}
            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#334155',
                display: 'block',
                marginBottom: '8px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                PASSWORD <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div 
                className="input-box"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: touched.password && errors.password ? '#fef2f2' : '#ffffff',
                  border: `1px solid ${touched.password && errors.password ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: '14px',
                  padding: '13px 16px',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '15px',
                    color: '#0f172a',
                    fontWeight: 500,
                    letterSpacing: showPassword ? 'normal' : '2px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember me & Forgot Password Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              marginTop: '-4px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    backgroundColor: rememberMe ? '#ea580c' : '#ffffff',
                    border: `1px solid ${rememberMe ? '#ea580c' : '#cbd5e1'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {rememberMe && <Check size={13} strokeWidth={3} />}
                </div>
                <span>Remember me</span>
              </label>

              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }}
                style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'none' }}
              >
                Forgot password?
              </a>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="btn-sign-in"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: isButtonDisabled ? '#cbd5e1' : '#ef4444',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                boxShadow: isButtonDisabled ? 'none' : '0 8px 20px rgba(239, 68, 68, 0.35)',
                transition: 'all 0.2s ease',
                marginTop: '6px'
              }}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>SIGNING IN...</span>
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>


          </form>

        </div>
      </div>

    </div>
  );
}
