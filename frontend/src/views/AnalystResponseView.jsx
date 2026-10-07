import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, UserPlus, Flag, Eye, ChevronRight, FileText, Lock } from 'lucide-react';

export default function AnalystResponseView({ onNavigate }) {
  const [checkedSteps, setCheckedSteps] = useState([true, true, true, true, false, false]);

  const toggleStep = (index) => {
    const updated = [...checkedSteps];
    updated[index] = !updated[index];
    setCheckedSteps(updated);
  };

  const steps = [
    { num: 1, text: "Verify core narrative claims" },
    { num: 2, text: "Monitor propagation" },
    { num: 3, text: "Identify additional variants" },
    { num: 4, text: "Review evidence" },
    { num: 5, text: "Prepare evidence-backed response" },
    { num: 6, text: "Continue human analyst monitoring", subtitle: "Ongoing active surveillance required until threat level normalizes below threshold 30." }
  ];

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', padding: '3px 10px', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '9999px' }}>
              ID: #007
            </span>
            <span style={{ fontSize: '11px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ↳ Active Mitigation
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '6px', letterSpacing: '-0.5px' }}>
            Analyst Response
          </h2>
        </div>

        <div className="bs-card" style={{ padding: '12px 20px', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.04)', textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            CAMPAIGN THREAT LEVEL
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
            ● HIGH
          </div>
        </div>
      </div>

      {/* Main Grid: Standard Operating Procedure & Execution Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Standard Operating Procedure */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
            <CheckCircle2 size={16} style={{ color: '#3b82f6' }} />
            <span>Standard Operating Procedure</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step, idx) => {
              const isChecked = checkedSteps[idx];
              return (
                <div
                  key={step.num}
                  onClick={() => toggleStep(idx)}
                  style={{
                    backgroundColor: isChecked ? 'rgba(59, 130, 246, 0.04)' : 'var(--inner-box-bg)',
                    border: isChecked ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isChecked ? '#3b82f6' : 'var(--bg-card)',
                      border: isChecked ? '1px solid #60a5fa' : '1px solid var(--border-color)',
                      color: isChecked ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      {step.num}
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: isChecked ? 'var(--text-heading)' : 'var(--text-secondary)' }}>
                        {step.text}
                      </div>
                      {step.subtitle && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                          {step.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ color: isChecked ? '#3b82f6' : 'var(--text-muted)' }}>
                    {idx === 5 ? <Eye size={18} /> : (isChecked ? <CheckCircle2 size={18} /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-heading)' }}>
              Execution Matrix
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => onNavigate && onNavigate('report-generator')}
                className="bs-button bs-button-danger" 
                style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px' }}>
                <span>Escalate Campaign</span>
                <ChevronRight size={16} />
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('report-generator')}
                className="bs-button bs-button-primary" 
                style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={14} /> Generate Evidence Report
                </span>
                <ChevronRight size={16} />
              </button>

              <button className="bs-button bs-button-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '10px', fontSize: '13px' }}>
                <UserPlus size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Assign Analyst</span>
              </button>

              <button className="bs-button bs-button-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '10px', fontSize: '13px' }}>
                <Flag size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Mark False Positive</span>
              </button>

              <button className="bs-button bs-button-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', gap: '10px', fontSize: '13px' }}>
                <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Continue Monitoring</span>
              </button>
            </div>
          </div>

          {/* Policy Notice Box */}
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderLeft: '4px solid #f59e0b', 
            borderRadius: 'var(--radius-md)', 
            padding: '14px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <strong style={{ color: 'var(--text-heading)' }}>Notice:</strong> System does not automatically censor content. Human analysts make final decisions.
          </div>

        </div>

      </div>
    </div>
  );
}

