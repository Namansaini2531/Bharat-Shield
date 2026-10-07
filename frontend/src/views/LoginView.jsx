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
      minHeight: '100vh',
      backgroundColor: '#111317',
      backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(30, 58, 138, 0.25) 0%, rgba(17, 19, 23, 0.95) 75%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Outer Split Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '1040px',
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1.15fr) minmax(360px, 1fr)',
        minHeight: '660px'
      }}>
        
        {/* ================= LEFT COLUMN: Vibrant Blue Radiant Showcase ================= */}
        <div style={{
          background: 'linear-gradient(150deg, #1e40af 0%, #2563eb 38%, #0284c7 78%, #38bdf8 100%)',
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff'
        }}>
          {/* Ambient Lighting Gradients */}
          <div style={{
            position: 'absolute',
            top: '-15%',
            right: '-15%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.35) 0%, rgba(37, 99, 235, 0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Top Brand Header */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Shield size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>
                ninth <span style={{ opacity: 0.8, fontWeight: 500, fontSize: '13px', marginLeft: '2px' }}>/ SENTINEL</span>
              </span>
            </div>
          </div>

          {/* Middle Title & Description */}
          <div style={{ position: 'relative', zIndex: 2, margin: '40px 0 30px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <span>Join Us to Build</span>
              <span>🤩</span>
            </div>

            <h1 style={{
              fontSize: '38px',
              fontWeight: 800,
              letterSpacing: '-1px',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
              color: '#ffffff'
            }}>
              Start your Journey
            </h1>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: '340px'
            }}>
              Follow these simple steps to set up your operational persona & access the threat grid.
            </p>
          </div>

          {/* Bottom Progressive Cards (3 Steps as in UI) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Step 1: Active White Card */}
            <div 
              onClick={() => setStepIndex(1)}
              style={{
                backgroundColor: stepIndex === 1 ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: stepIndex === 1 ? '0 12px 25px rgba(0, 0, 0, 0.18)' : 'none',
                color: stepIndex === 1 ? '#0f172a' : '#ffffff'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: stepIndex === 1 ? '#2563eb' : 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                1
              </div>

              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: 1.3,
                marginTop: '12px'
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
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: stepIndex === 2 ? '#0f172a' : '#ffffff'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: stepIndex === 2 ? '#2563eb' : 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                2
              </div>

              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.3,
                opacity: stepIndex === 2 ? 1 : 0.9,
                marginTop: '12px'
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
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: stepIndex === 3 ? '#0f172a' : '#ffffff'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: stepIndex === 3 ? '#2563eb' : 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </div>

              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.3,
                opacity: stepIndex === 3 ? 1 : 0.9,
                marginTop: '12px'
              }}>
                Verify your identity through passport/ID
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Form Panel ================= */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '40px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#1e293b'
        }}>
          <div>
            {/* Header Title & Switcher */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 6px 0',
                letterSpacing: '-0.4px'
              }}>
                {mode === 'join' ? 'Join Us' : 'Welcome Back'}
              </h2>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {mode === 'join' ? 'Enter operator credentials or select persona' : 'Authenticate with your clearance token'}
              </div>
            </div>

            {/* Error Message Toast */}
            {errorMsg && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '18px',
                fontSize: '12px',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Master Password Banner */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '8px 12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontWeight: 600 }}>
                <Key size={13} />
                <span>Master Key: <code style={{ fontFamily: 'JetBrains Mono', color: '#2563eb' }}>sentinel@16#</code></span>
              </div>
              <button
                type="button"
                onClick={handleQuickMasterFill}
                style={{
                  background: '#2563eb',
                  border: 'none',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Autofill
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Phone Number Input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Phone number / Official ID
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '14px', userSelect: 'none' }}>🇮🇳</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 0000 00 00"
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      width: '100%',
                      fontSize: '13px',
                      color: '#0f172a',
                      fontWeight: 500
                    }}
                  />
                </div>
              </div>

              {/* Full Name & Username Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    style={{
                      width: '100%',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#0f172a',
                      fontWeight: 500,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Username
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    position: 'relative'
                  }}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        outline: 'none',
                        width: '100%',
                        fontSize: '13px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}
                    />
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                  </div>
                </div>
              </div>

              {/* Role Persona Quick Pills */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Operational Persona / Partition
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
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
                          padding: '7px 6px',
                          borderRadius: '8px',
                          border: isSelected ? `1.5px solid ${p.color}` : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? `${p.color}10` : '#f8fafc',
                          color: isSelected ? p.color : '#64748b',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={13} />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px 14px',
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
                      fontSize: '14px',
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.3 }}>
                  At least 8 characters, or use Master Password <strong style={{ color: '#2563eb' }}>sentinel@16#</strong>.
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#2563eb',
                  backgroundImage: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                  marginTop: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSubmitting ? 'Authenticating Sentinel Grid...' : 'Continue'}
              </button>

              {/* Toggle Account Mode */}
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                {mode === 'join' ? (
                  <>
                    Already have an account?{' '}
                    <span 
                      onClick={() => setMode('login')} 
                      style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
                      Log in
                    </span>
                  </>
                ) : (
                  <>
                    Need to configure a new operator?{' '}
                    <span 
                      onClick={() => setMode('join')} 
                      style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
                      Join Us
                    </span>
                  </>
                )}
              </div>

            </form>
          </div>

          {/* Bottom Legal Disclaimer */}
          <div style={{
            fontSize: '10px',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.4,
            marginTop: '20px'
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
