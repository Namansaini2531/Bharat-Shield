import React, { useState, useEffect } from 'react';
import {
  Globe,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Ship,
  Zap,
  Activity,
  Layers,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Cpu,
  BarChart3
} from 'lucide-react';

export default function StrategicRadarView() {
  const [activeRegion, setActiveRegion] = useState('all');
  const [chains, setChains] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Simulator State
  const [customScenario, setCustomScenario] = useState('Escalation in Middle East causing Strait of Hormuz naval standoff and crude oil tanker restrictions');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Load Impact Chains & News on mount or region change
  useEffect(() => {
    fetchStrategicData(activeRegion);
  }, [activeRegion]);

  const fetchStrategicData = async (region) => {
    setLoading(true);
    try {
      const [chainsRes, newsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/strategic/impact-chains?region=${region}`),
        fetch(`http://127.0.0.1:8000/api/strategic/live-news?region=${region}`)
      ]);
      const chainsData = await chainsRes.json();
      const newsData = await newsRes.json();

      setChains(chainsData.chains || []);
      setNews(newsData.articles || []);
    } catch (e) {
      console.error('Failed to load strategic data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!customScenario.trim()) return;
    setIsSimulating(true);
    try {
      let geminiKey = '';
      try {
        geminiKey = localStorage.getItem('bharat_shield_gemini_key') || '';
      } catch {}

      const res = await fetch('http://127.0.0.1:8000/api/strategic/simulate-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: customScenario,
          gemini_key: geminiKey
        })
      });
      const data = await res.json();
      setSimulationResult(data.analysis || null);
    } catch (e) {
      console.error('Simulation failed:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const regions = [
    { id: 'all', label: '🌍 All Global Flashpoints' },
    { id: 'middle_east', label: 'Middle East & Gulf' },
    { id: 'indo_pacific', label: 'Indo-Pacific & Taiwan' },
    { id: 'europe', label: 'Europe & Black Sea' },
    { id: 'india_south_asia', label: 'India & South Asia' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Geopolitical & Geoeconomic Causal Engine
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', letterSpacing: '-0.01em' }}>
            Global Strategic Radar & Cascading Impact Chains
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '850px', lineHeight: 1.5 }}>
            Model the butterfly effect of global crises: how regional flashpoints trigger maritime chokepoint disruptions, commodity market price surges, and downstream consumer inflation.
          </p>
        </div>

        <button
          onClick={() => fetchStrategicData(activeRegion)}
          disabled={loading}
          className="bs-button bs-button-secondary"
          style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh Wire</span>
        </button>
      </div>

      {/* Region & Country Filter Pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        backgroundColor: 'var(--bg-input)',
        padding: '4px',
        borderRadius: 'var(--radius-control)',
        border: '1px solid var(--border-color)',
        width: 'fit-content'
      }}>
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRegion(r.id)}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: activeRegion === r.id ? 600 : 400,
              borderRadius: 'var(--radius-badge)',
              backgroundColor: activeRegion === r.id ? 'var(--bg-raised)' : 'transparent',
              color: activeRegion === r.id ? 'var(--text-heading)' : 'var(--text-muted)',
              border: activeRegion === r.id ? '1px solid var(--border-light)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Causal Chains (Left 65%) + Live News Wire & Simulator (Right 35%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(340px, 1.2fr)', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Causal Impact Chains */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Active Cascading Event Chains ({chains.length})</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              Dynamic Causal Graph
            </span>
          </div>

          {chains.map((chain) => (
            <div
              key={chain.id}
              className="bs-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderLeft: '3px solid var(--accent-primary)'
              }}
            >
              {/* Chain Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>
                    {chain.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <span>📍 {chain.trigger_event?.location}</span>
                    <span>•</span>
                    <span style={{ color: chain.trigger_event?.severity === 'CRITICAL' ? 'var(--risk-critical)' : 'var(--risk-elevated)', fontWeight: 600 }}>
                      {chain.trigger_event?.severity} TRIGGER
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-badge)',
                  backgroundColor: 'var(--bg-raised)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'JetBrains Mono'
                }}>
                  {chain.region.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              {/* Step-by-Step Causal Cascade Pipeline */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                position: 'relative'
              }}>
                {chain.links?.map((link, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-card)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Step 0{link.step}
                      </span>
                      {link.probability && (
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          fontFamily: 'JetBrains Mono',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: parseInt(link.probability) >= 70 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: parseInt(link.probability) >= 70 ? 'var(--risk-critical)' : 'var(--risk-elevated)'
                        }}>
                          Risk: {link.probability}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.3 }}>
                      {link.label}
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--accent-primary)', fontWeight: 500, fontFamily: 'JetBrains Mono' }}>
                      {link.metric}
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '2px' }}>
                      {link.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vulnerability Matrix (Who is impacted?) */}
              {chain.vulnerability_index && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Downstream Vulnerability Matrix
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                    {Object.entries(chain.vulnerability_index).map(([country, info]) => (
                      <div key={country} style={{ fontSize: '11.5px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '3px',
                          fontFamily: 'JetBrains Mono',
                          backgroundColor: info.risk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.12)',
                          color: info.risk === 'CRITICAL' ? 'var(--risk-critical)' : 'var(--accent-primary)'
                        }}>
                          {info.risk}
                        </span>
                        <div>
                          <strong style={{ color: 'var(--text-heading)' }}>{country}:</strong>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>{info.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: What-If Simulator + Live News Wire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. Custom 'What-If' Causal Simulator */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                "What-If" Causal Impact Simulator
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Test any geopolitical crisis to calculate cascading chokepoint risks and market shocks.
            </p>

            <textarea
              rows={3}
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
              placeholder="e.g. War in Middle East -> Strait of Hormuz closed for 30 days..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-control)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                lineHeight: 1.4,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: '10px'
              }}
            />

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="bs-button bs-button-primary"
              style={{ width: '100%', fontSize: '12px', padding: '8px 14px', gap: '6px' }}
            >
              {isSimulating ? <RefreshCw size={13} className="animate-spin" /> : <BarChart3 size={14} />}
              <span>{isSimulating ? 'Computing Cascading Shockwaves...' : 'Calculate Cascading Impact'}</span>
            </button>

            {/* Simulation Result Drawer */}
            {simulationResult && (
              <div style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: 'var(--radius-card)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {simulationResult.scenario_title}
                </div>

                {/* Primary Chokepoint */}
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chokepoint / Bottleneck</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--risk-critical)', fontFamily: 'JetBrains Mono' }}>
                      Risk: {simulationResult.primary_chokepoint_risk?.blockage_probability}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-heading)', marginTop: '2px' }}>
                    {simulationResult.primary_chokepoint_risk?.chokepoint_name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {simulationResult.primary_chokepoint_risk?.operational_impact}
                  </div>
                </div>

                {/* Commodity Shock */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Commodity & Asset Shockwave
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {simulationResult.commodity_and_market_ripple?.affected_assets?.map((asset, i) => (
                      <span key={i} style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-raised)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--accent-primary)',
                        fontFamily: 'JetBrains Mono'
                      }}>
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Downstream Macro */}
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-heading)' }}>Consumer Impact:</strong>{' '}
                  {simulationResult.macro_downstream_impact?.consumer_and_inflation_effect}
                </div>

                {/* Most Exposed Countries */}
                {simulationResult.macro_downstream_impact?.countries_most_exposed && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Highest Country Vulnerability
                    </div>
                    {simulationResult.macro_downstream_impact.countries_most_exposed.map((c, i) => (
                      <div key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                        <span style={{ color: 'var(--risk-critical)', fontWeight: 600 }}>• {c.country} ({c.vulnerability}):</span>{' '}
                        {c.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Live News Articles Wire (GDELT Project Open Feed) */}
          <div className="bs-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} style={{ color: 'var(--risk-verified)' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                  Live Strategic Wire (Open Articles)
                </h3>
              </div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                GDELT Global Grid
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {news.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.35 }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    <span>{item.source}</span>
                    <span>{item.published_at}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
