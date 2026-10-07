import React, { useState } from 'react';
import { useAuth, ROLES, MASTER_PASSWORD } from '../context/AuthContext';
import {
  Shield,
  Eye,
  EyeOff,
  Check,
  Lock,
  Key,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Newspaper,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LoginView() {
  const { login, allProfiles } = useAuth();

  const [mode, setMode] = useState('join'); // 'join' or 'login'
  const [phone, setPhone] = useState('+91 98100 44219');
  const [fullName, setFullName] = useState('Joint Director Vikram Rawat');
  const [username, setUsername] = useState('v_rawat_ib');
  const [password, setPassword] = useState('sentinel@16#');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.INVESTIGATION_BUREAU);
  const [stepIndex, setStepIndex] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    const profile = allProfiles[roleKey];
    if (profile) {
      setFullName(profile.name);
      setUsername(profile.username || profile.id);
      setPhone(profile.phone || '+91 98100 00000');
    }
  };

  const handleQuickMasterFill = () => {
    setPassword(MASTER_PASSWORD);
    handleSelectRole(ROLES.INVESTIGATION_BUREAU);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login({
        password: password.trim(),
        roleKey: selectedRole,
        customName: fullName,
        customPhone: phone,
        customUsername: username
      });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
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
      gridTemplateColumns: '1.15fr 1fr',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
    }}>

      {/* ================= LEFT COLUMN: Vibrant Blue Radiant Showcase (Full Screen Left Half) ================= */}
      <div style={{
        background: 'linear-gradient(145deg, #1d4ed8 0%, #2563eb 38%, #0284c7 75%, #38bdf8 100%)',
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Ambient Lighting Background Circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(186, 230, 253, 0.35) 0%, rgba(37, 99, 235, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, rgba(30, 64, 175, 0) 70%)',
          pointerEvents: 'none'
        }} />

        {/* Top Brand Header */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <Shield size={22} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.4px' }}>
              ninth <span style={{ opacity: 0.85, fontWeight: 500, fontSize: '15px', marginLeft: '4px' }}>/ SENTINEL</span>
            </span>
          </div>
        </div>

        {/* Middle Hero Showcase */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(12px)',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <span>Join Us to Build</span>
            <span style={{ fontSize: '15px' }}>🤩</span>
          </div>

          <h1 style={{
            fontSize: '52px',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: '0 0 16px 0',
            color: '#ffffff'
          }}>
            Start your Journey
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.88)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '460px'
          }}>
            Follow these simple steps to set up your operational persona & access the unified cognitive defense grid.
          </p>
        </div>

        {/* Bottom Progressive Step Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Step 1: Active White Card */}
          <div
            onClick={() => setStepIndex(1)}
            style={{
              backgroundColor: stepIndex === 1 ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '135px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: stepIndex === 1 ? '0 16px 32px rgba(0, 0, 0, 0.18)' : 'none',
              color: stepIndex === 1 ? '#0f172a' : '#ffffff',
              transform: stepIndex === 1 ? 'translateY(-3px)' : 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: stepIndex === 1 ? '#2563eb' : 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              1
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              lineHeight: 1.35,
              marginTop: '16px'
            }}>
              Register your account
            </div>
          </div>

          {/* Step 2: Glass Card */}
          <div
            onClick={() => setStepIndex(2)}
            style={{
              backgroundColor: stepIndex === 2 ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '135px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: stepIndex === 2 ? '#0f172a' : '#ffffff',
              transform: stepIndex === 2 ? 'translateY(-3px)' : 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: stepIndex === 2 ? '#2563eb' : 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              2
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: 1.35,
              opacity: stepIndex === 2 ? 1 : 0.9,
              marginTop: '16px'
            }}>
              Set up your profile information
            </div>
          </div>

          {/* Step 3: Glass Card */}
          <div
            onClick={() => setStepIndex(3)}
            style={{
              backgroundColor: stepIndex === 3 ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '135px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: stepIndex === 3 ? '#0f172a' : '#ffffff',
              transform: stepIndex === 3 ? 'translateY(-3px)' : 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: stepIndex === 3 ? '#2563eb' : 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: 1.35,
              opacity: stepIndex === 3 ? 1 : 0.9,
              marginTop: '16px'
            }}>
              Verify your identity through passport/ID
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: Form Panel (Full Screen Right Half) ================= */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#1e293b',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Header Title & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px 0',
              letterSpacing: '-0.6px'
            }}>
              {mode === 'join' ? 'Join Us' : 'Welcome Back'}
            </h2>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {mode === 'join' ? 'Enter operator credentials or select persona' : 'Authenticate with your clearance token'}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Master Password Override Quick Chip */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontWeight: 600 }}>
              <Key size={15} />
              <span>Master Key: <code style={{ fontFamily: 'JetBrains Mono', color: '#2563eb', fontWeight: 700 }}>sentinel@16#</code></span>
            </div>
            <button
              type="button"
              onClick={handleQuickMasterFill}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
              }}
            >
              Autofill
            </button>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Phone Number / Official ID Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Phone number
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 16px',
                gap: '12px',
                transition: 'all 0.15s ease'
              }}>
                <span style={{ fontSize: '16px', userSelect: 'none' }}>🇦🇲</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+374 0000 00 00"
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
            </div>

            {/* Full Name & Username Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juliette Karapetyan"
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#0f172a',
                    fontWeight: 500,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Username
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  position: 'relative'
                }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="julietux"
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
                  <Check size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                </div>
              </div>
            </div>

            {/* Operational Persona Switcher */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
                Operational Clearance Persona
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { key: ROLES.INVESTIGATION_BUREAU, label: 'IB / LEA', color: '#ef4444', icon: ShieldCheck },
                  { key: ROLES.CORPORATE_ENTERPRISE, label: 'Adani Risk', color: '#f59e0b', icon: Building2 },
                  { key: ROLES.JOURNALIST_MEDIA, label: 'Press Desk', color: '#3b82f6', icon: Newspaper }
                ].map(p => {
                  const isSelected = selectedRole === p.key;
                  const Icon = p.icon;
                  return (
                    <button
                      type="button"
                      key={p.key}
                      onClick={() => handleSelectRole(p.key)}
                      style={{
                        padding: '9px 6px',
                        borderRadius: '10px',
                        border: isSelected ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? `${p.color}12` : '#f8fafc',
                        color: isSelected ? p.color : '#64748b',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={14} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 16px',
                position: 'relative'
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '15px',
                    color: '#0f172a',
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
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                At least 12 characters, no more than 20 characters.<br />
                Uppercase letters, lowercase letters, numbers, and symbols.
              </div>
            </div>

            {/* Continue Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: '#2563eb',
                backgroundImage: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '15px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                marginTop: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              {isSubmitting ? 'Authenticating Sentinel Grid...' : 'Continue'}
            </button>

            {/* Mode Switcher */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              {mode === 'join' ? (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => setMode('login')}
                    style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                    Log in
                  </span>
                </>
              ) : (
                <>
                  Need to configure a new operator?{' '}
                  <span
                    onClick={() => setMode('join')}
                    style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                    Join Us
                  </span>
                </>
              )}
            </div>

          </form>

          {/* Bottom Legal Disclaimer */}
          <div style={{
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.5,
            marginTop: '28px'
          }}>
            By signing up I confirm that I carefully have read and agree to the Ninth{' '}
            <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span> and{' '}
            <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Terms of Service</span>.
          </div>

        </div>
      </div>

    </div>
  );
}
