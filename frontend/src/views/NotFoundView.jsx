import React from 'react';
import { ShieldAlert, ArrowLeft, Terminal, AlertTriangle, RefreshCw } from 'lucide-react';

export default function NotFoundView({ onNavigate }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      {/* Glow Icon Header */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444',
        marginBottom: '24px',
        position: 'relative'
      }}>
        <ShieldAlert size={40} />
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          boxShadow: '0 0 8px #ef4444'
        }} className="animate-pulse-slow" />
      </div>

      {/* 404 Status Code Badge */}
      <div className="bs-badge bs-badge-red" style={{ padding: '6px 16px', fontSize: '11px', marginBottom: '16px', borderRadius: '9999px' }}>
        ERROR 404 — ACCESS RESTRICTED / RESOURCE NOT FOUND
      </div>

      {/* Main Headline */}
      <h2 style={{
        fontSize: '30px',
        fontWeight: 800,
        color: 'var(--text-heading)',
        letterSpacing: '-0.5px',
        marginBottom: '10px'
      }}>
        CLASSIFIED TARGET NOT LOCATED
      </h2>

      <p style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        maxWidth: '540px',
        lineHeight: 1.6,
        marginBottom: '28px'
      }}>
        The intelligence telemetry path or resource coordinate you requested does not exist, has been redacted by Level 4 security protocol, or has moved to an unindexed sector.
      </p>

      {/* Terminal Output Simulation Box */}
      <div style={{
        width: '100%',
        maxWidth: '580px',
        backgroundColor: 'var(--inner-box-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        textAlign: 'left',
        fontFamily: 'JetBrains Mono',
        fontSize: '12px',
        color: 'var(--text-primary)',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
          <Terminal size={12} />
          <span>BHARAT-SHIELD TELEMETRY LOG</span>
        </div>
        <div style={{ color: '#ef4444' }}>[ERR 404_NOT_FOUND] Query string parameter failed resolution.</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>[SYS_AUDIT] Incident logged: Analyst A-104 @ 2026-08-21T20:17:32Z</div>
        <div style={{ color: '#f59e0b', marginTop: '4px' }}>[RECOMMENDATION] Return to primary command matrix.</div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '14px' }}>
        <button 
          onClick={() => onNavigate && onNavigate('overview')}
          className="bs-button bs-button-primary" 
          style={{ gap: '8px', fontSize: '13px', padding: '10px 22px' }}>
          <ArrowLeft size={16} /> Return to Overview
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="bs-button bs-button-secondary" 
          style={{ gap: '8px', fontSize: '13px', padding: '10px 22px' }}>
          <RefreshCw size={14} /> Re-sync Telemetry
        </button>
      </div>

    </div>
  );
}

