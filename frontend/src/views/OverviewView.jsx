import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Activity, AlertOctagon, Database, MessageSquare, Bot, ArrowUpRight, MapPin } from 'lucide-react';

const timelineData = [
  { time: '00:00', count: 12, highRisk: 2 },
  { time: '02:00', count: 24, highRisk: 4 },
  { time: '04:00', count: 18, highRisk: 3 },
  { time: '06:00', count: 35, highRisk: 8 },
  { time: '08:00', count: 50, highRisk: 15 },
  { time: '10:00', count: 85, highRisk: 45 },
  { time: '12:00', count: 120, highRisk: 90 },
  { time: '14:00', count: 105, highRisk: 75 },
  { time: '16:00', count: 95, highRisk: 60 },
  { time: '18:00', count: 68, highRisk: 30 },
  { time: '20:00', count: 52, highRisk: 20 },
  { time: '22:00', count: 40, highRisk: 10 },
];

export default function OverviewView({ onNavigate }) {
  const [timeRange, setTimeRange] = useState('7D');

  return (
    <div>
      {/* Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            National Information Operations Monitor
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            AI-assisted detection and investigation of coordinated malign narratives
          </p>
        </div>
        <div className="bs-badge bs-badge-blue" style={{ padding: '6px 12px', fontSize: '10px' }}>
          SIMULATED / DEMONSTRATION DATA
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '20px' }}>

        {/* Stat 1 */}
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ color: '#8c9ba5', fontSize: '12px', fontWeight: 600 }}>
            <span>Active Campaigns</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginTop: '10px', fontFamily: 'JetBrains Mono' }}>
            17
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bs-card" style={{ padding: '16px', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.03)' }}>
          <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
            <span>High Risk Campaigns</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444', marginTop: '10px', fontFamily: 'JetBrains Mono' }}>
            5
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ color: '#8c9ba5', fontSize: '12px', fontWeight: 600 }}>
            <span>Content Analyzed</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginTop: '10px', fontFamily: 'JetBrains Mono' }}>
            12,483
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bs-card" style={{ padding: '16px' }}>
          <div style={{ color: '#8c9ba5', fontSize: '12px', fontWeight: 600 }}>
            <span>Tipline Submissions</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginTop: '10px', fontFamily: 'JetBrains Mono' }}>
            385
          </div>
        </div>

        {/* Stat 5 */}
        <div className="bs-card" style={{ padding: '16px', borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.03)' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 600 }}>
            <span>AI-Assistance Suspected</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', marginTop: '10px', fontFamily: 'JetBrains Mono' }}>
            7
          </div>
        </div>

      </div>

      {/* Middle Row: Timeline Chart & Source Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Timeline Chart */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
              <Activity size={16} style={{ color: '#3b82f6' }} />
              <span>Threat Activity Timeline</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setTimeRange('24H')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: timeRange === '24H' ? 'var(--bg-card)' : 'transparent',
                  color: timeRange === '24H' ? 'var(--text-heading)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: timeRange === '24H' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                24H
              </button>
              <button
                onClick={() => setTimeRange('7D')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: timeRange === '7D' ? '#2563eb' : 'transparent',
                  color: timeRange === '7D' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: timeRange === '7D' ? '0 1px 3px rgba(37,99,235,0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                7D
              </button>
            </div>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#576575" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', color: 'var(--text-heading)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="highRisk" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution Card */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} style={{ color: '#06b6d4' }} />
            <span>Source Distribution</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* X */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'inline-block' }}></span>
                  <span>X (Twitter)</span>
                </span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono' }}>52%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '52%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }}></div>
              </div>
            </div>

            {/* Telegram */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
                  <span>Telegram</span>
                </span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono' }}>21%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '21%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '9999px' }}></div>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                  <span>WhatsApp</span>
                </span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono' }}>17%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '17%', height: '100%', backgroundColor: '#ef4444', borderRadius: '9999px' }}></div>
              </div>
            </div>

            {/* News */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8c9ba5', display: 'inline-block' }}></span>
                  <span>News Media</span>
                </span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono' }}>10%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', backgroundColor: '#8c9ba5', borderRadius: '9999px' }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Row: Priority Campaigns Table & Cross-Regional Propagation Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Table Card */}
        <div className="bs-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} style={{ color: '#ef4444' }} />
            <span>Priority Campaigns</span>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>ID</th>
                  <th style={{ padding: '10px 14px' }}>NARRATIVE</th>
                  <th style={{ padding: '10px 14px' }}>RISK (0-100)</th>
                  <th style={{ padding: '10px 14px' }}>COORD.</th>
                  <th style={{ padding: '10px 14px' }}>AI ASST.</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>#007</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Internet Shutdown Narrative</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>88-94</span>
                      <div style={{ width: '60px', height: '4px', backgroundColor: '#ef4444', borderRadius: '9999px' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>93</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: '#f59e0b', fontWeight: 600 }}>81</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => onNavigate && onNavigate('campaigns')}
                      className="bs-button bs-button-danger"
                      style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}>
                      INVESTIGATE
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>#011</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Fake Government Scheme</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>71-83</span>
                      <div style={{ width: '45px', height: '4px', backgroundColor: '#f59e0b', borderRadius: '9999px' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>65</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>42</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button className="bs-button bs-button-secondary" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}>
                      MONITOR
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>#003</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Communal Rumour Variant</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>52-67</span>
                      <div style={{ width: '30px', height: '4px', backgroundColor: 'var(--text-muted)', borderRadius: '9999px' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>48</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono' }}>12</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button className="bs-button bs-button-secondary" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}>
                      REVIEW
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Map Preview */}
        <div className="bs-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} style={{ color: '#ec4899' }} />
            <span>Cross-Regional Propagation</span>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--inner-box-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px',
            overflow: 'hidden'
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              opacity: 0.6
            }} />

            {/* Glowing Hotspots */}
            <div style={{ position: 'absolute', top: '35%', left: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-pulse-slow" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 12px #ef4444' }} />
              <span style={{ fontSize: '9px', color: '#fca5a5', marginTop: '2px', fontWeight: 600 }}>DELHI / NCR</span>
            </div>

            <div style={{ position: 'absolute', top: '60%', left: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-pulse-slow" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
              <span style={{ fontSize: '9px', color: '#fde68a', marginTop: '2px', fontWeight: 600 }}>MUMBAI</span>
            </div>

            <div style={{ position: 'absolute', bottom: '25%', right: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-pulse-slow" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
              <span style={{ fontSize: '9px', color: '#fca5a5', marginTop: '2px', fontWeight: 600 }}>BENGALURU</span>
            </div>

            <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ fontSize: '10px', color: '#8c9ba5' }}>HOTSPOT</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
