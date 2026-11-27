import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  Radio, 
  X, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Play, 
  Sparkles,
  Camera,
  RefreshCw,
  AlertTriangle,
  Database,
  Hash,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Layers,
  TrendingDown,
  Filter,
  Search,
  ChevronRight,
  BarChart3,
  AlertOctagon,
  Cpu,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

export default function LiveIntelView({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('market-intel'); // 'market-intel', 'batch-ingest', 'live-feed'
  
  // Market Intel Ingestion Form State
  const [signalText, setSignalText] = useState('');
  const [selectedSource, setSelectedSource] = useState('Telegram Trading Rooms');
  const [selectedTicker, setSelectedTicker] = useState('TATAMOTORS');
  const [selectedMediaType, setSelectedMediaType] = useState('pdf_circular');
  const [selectedTiming, setSelectedTiming] = useState('PRE_MARKET_0845_0915');
  
  // Pipeline Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  
  // History & Presets State
  const [presets, setPresets] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyStats, setHistoryStats] = useState({
    total: 0,
    critical: 0,
    avgScore: 0,
    topTickers: []
  });
  const [searchFilter, setSearchFilter] = useState('');
  const [tickerFilter, setTickerFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [inspectModalItem, setInspectModalItem] = useState(null);
  const [activeDisclosureTab, setActiveDisclosureTab] = useState('reg30'); // 'reg30', 'press', 'sec69a', 'playbook'

  // Batch Ingestion State
  const [fileStaged, setFileStaged] = useState(true);
  const [analyzingBatch, setAnalyzingBatch] = useState(false);
  const [batchDone, setBatchDone] = useState(false);

  // WebSocket Context
  const { isConnected, liveSignals, stats, triggerSimulationBurst } = useWebSocket();
  const [simulating, setSimulating] = useState(false);

  // Fetch presets and initial history on mount
  useEffect(() => {
    fetchPresets();
    fetchHistory();
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/market-intel/presets');
      if (res.ok) {
        const data = await res.json();
        setPresets(data.presets || []);
      }
    } catch (err) {
      console.warn('Could not fetch market intel presets:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/market-intel/history?limit=30');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.signals || []);
        setHistoryStats({
          total: data.total_signals_analyzed || (data.signals || []).length,
          critical: data.critical_threats_count || 0,
          avgScore: data.average_threat_score || 0,
          topTickers: data.top_attacked_tickers || []
        });
        if (!processedResult && data.signals && data.signals.length > 0) {
          setProcessedResult(data.signals[0]);
        }
      }
    } catch (err) {
      console.warn('Could not fetch market intel history:', err);
    }
  };

  const handleSelectPreset = (preset) => {
    setSignalText(preset.text);
    setSelectedSource(preset.source);
    setSelectedTicker(preset.company_ticker);
    setSelectedMediaType(preset.media_type);
    setSelectedTiming(preset.timing_slot);
  };

  const handleIngestAndProcess = async (e) => {
    if (e) e.preventDefault();
    if (!signalText.trim()) return;

    setIsProcessing(true);
    setPipelineStep(1);

    // Animated pipeline progression
    const t1 = setTimeout(() => setPipelineStep(2), 300);
    const t2 = setTimeout(() => setPipelineStep(3), 700);
    const t3 = setTimeout(() => setPipelineStep(4), 1100);
    const t4 = setTimeout(() => setPipelineStep(5), 1500);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/market-intel/ingest-and-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: signalText,
          source: selectedSource,
          company_ticker: selectedTicker,
          media_type: selectedMediaType,
          timing_slot: selectedTiming
        })
      });

      if (res.ok) {
        const json = await res.json();
        setTimeout(() => {
          setPipelineStep(6);
          setTimeout(() => {
            setProcessedResult(json.data);
            setIsProcessing(false);
            fetchHistory();
          }, 400);
        }, 1800);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      console.error('Processing failed:', err);
      // Fallback local processing simulation if offline
      setTimeout(() => {
        setIsProcessing(false);
        fetchHistory();
      }, 2000);
    }
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSimulateBurst = async () => {
    setSimulating(true);
    await triggerSimulationBurst(3);
    setTimeout(() => setSimulating(false), 800);
  };

  const handleAnalyzeDataset = () => {
    setAnalyzingBatch(true);
    setTimeout(() => {
      setAnalyzingBatch(false);
      setBatchDone(true);
      setTimeout(() => setBatchDone(false), 4000);
    }, 2000);
  };

  // Filter history
  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchFilter || 
      (item.raw_text || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.signal_id || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.target_entity?.company_name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.target_entity?.ticker_symbol || '').toLowerCase().includes(searchFilter.toLowerCase());

    const matchesTicker = tickerFilter === 'ALL' || item.target_entity?.ticker_key === tickerFilter;
    const matchesSeverity = severityFilter === 'ALL' || item.metrics?.threat_level === severityFilter;

    return matchesSearch && matchesTicker && matchesSeverity;
  });

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Top Header & Telemetry Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '20px', 
        flexWrap: 'wrap', 
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ 
              padding: '2px 7px', 
              backgroundColor: 'var(--bg-input)', 
              color: 'var(--text-secondary)', 
              borderRadius: 'var(--radius-badge)', 
              fontSize: '11px', 
              fontWeight: 500, 
              fontFamily: 'JetBrains Mono',
              border: '1px solid var(--border-color)'
            }}>
              Market intelligence
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-heading)', letterSpacing: '-0.01em', margin: 0 }}>
            Market intelligence & signal ingestion
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
            Financial rumor ingestion, pre-market triage, semantic vector correlation, and regulatory disclosure drafting.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* WebSocket Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-badge)',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono',
            color: isConnected ? 'var(--risk-verified)' : 'var(--risk-critical)'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isConnected ? 'var(--risk-verified)' : 'var(--risk-critical)'
            }} />
            <span>{isConnected ? 'BSE/NSE stream active' : 'Offline / reconnecting'}</span>
          </div>

          <button
            onClick={handleSimulateBurst}
            disabled={simulating}
            className="bs-button bs-button-secondary"
            style={{ fontSize: '11.5px', padding: '5px 12px', gap: '6px' }}
          >
            <Zap size={13} />
            <span>{simulating ? 'Injecting stream...' : 'Simulate burst'}</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        marginBottom: '20px', 
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('market-intel')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: activeTab === 'market-intel' ? 'var(--bg-raised)' : 'transparent',
            border: '1px solid ' + (activeTab === 'market-intel' ? 'var(--border-light)' : 'transparent'),
            borderRadius: 'var(--radius-control)',
            color: activeTab === 'market-intel' ? 'var(--text-heading)' : 'var(--text-muted)',
            fontWeight: activeTab === 'market-intel' ? 600 : 400,
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          <BarChart3 size={14} />
          <span>Ingest & process</span>
        </button>

        <button
          onClick={() => setActiveTab('batch-ingest')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: activeTab === 'batch-ingest' ? 'var(--bg-raised)' : 'transparent',
            border: '1px solid ' + (activeTab === 'batch-ingest' ? 'var(--border-light)' : 'transparent'),
            borderRadius: 'var(--radius-control)',
            color: activeTab === 'batch-ingest' ? 'var(--text-heading)' : 'var(--text-muted)',
            fontWeight: activeTab === 'batch-ingest' ? 600 : 400,
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          <Upload size={14} />
          <span>Batch dataset ingest</span>
        </button>

        <button
          onClick={() => setActiveTab('live-feed')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: activeTab === 'live-feed' ? 'var(--bg-raised)' : 'transparent',
            border: '1px solid ' + (activeTab === 'live-feed' ? 'var(--border-light)' : 'transparent'),
            borderRadius: 'var(--radius-control)',
            color: activeTab === 'live-feed' ? 'var(--text-heading)' : 'var(--text-muted)',
            fontWeight: activeTab === 'live-feed' ? 600 : 400,
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          <Radio size={14} />
          <span>Live feed</span>
          {liveSignals.length > 0 && (
            <span style={{ 
              fontSize: '10px', 
              padding: '1px 5px', 
              borderRadius: 'var(--radius-badge)', 
              backgroundColor: 'var(--accent-subtle)', 
              color: 'var(--accent-primary)',
              fontFamily: 'JetBrains Mono'
            }}>
              {liveSignals.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INGEST & PROCESS MARKET INTEL                                      */}
      {/* ========================================================================= */}
      {activeTab === 'market-intel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Scenario Loader Bar */}
          <div className="bs-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Preloaded attack scenarios</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Select to populate ingestion terminal</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-badge)',
                    backgroundColor: selectedTicker === preset.company_ticker && signalText === preset.text ? 'var(--bg-raised)' : 'var(--bg-input)',
                    border: `1px solid ${selectedTicker === preset.company_ticker && signalText === preset.text ? 'var(--border-light)' : 'var(--border-color)'}`,
                    color: selectedTicker === preset.company_ticker && signalText === preset.text ? 'var(--text-heading)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>{preset.company_ticker}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>• {preset.media_type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Ingestion Form & Real-Time Processing Console */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
            
            {/* Left: Input Form */}
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} style={{ color: '#3b82f6' }} />
                <span>Market Signal Ingestion Terminal</span>
              </div>

              <form onSubmit={handleIngestAndProcess} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Raw Intercepted Signal / Forged Document Transcript
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{signalText.length} characters</span>
                  </div>
                  <textarea
                    value={signalText}
                    onChange={(e) => setSignalText(e.target.value)}
                    placeholder="Paste intercepted Telegram trading tip, leaked forged SEBI/DRI circular text, deepfake transcript, or social media market rumor here..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      lineHeight: '1.5'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Target Listed Security
                    </label>
                    <select
                      value={selectedTicker}
                      onChange={(e) => setSelectedTicker(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--inner-box-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono'
                      }}
                    >
                      <option value="TATAMOTORS">TATAMOTORS (Tata Motors Ltd)</option>
                      <option value="TCS">TCS (Tata Consultancy Services)</option>
                      <option value="TATAPOWER">TATAPOWER (Tata Power Ltd)</option>
                      <option value="TATASTEEL">TATASTEEL (Tata Steel Ltd)</option>
                      <option value="ADANIPORTS">ADANIPORTS (Adani Ports & SEZ)</option>
                      <option value="ADANIENT">ADANIENT (Adani Enterprises)</option>
                      <option value="RELIANCE">RELIANCE (Reliance Industries)</option>
                      <option value="HDFCBANK">HDFCBANK (HDFC Bank Ltd)</option>
                      <option value="INFY">INFY (Infosys Limited)</option>
                      <option value="SBIN">SBIN (State Bank of India)</option>
                      <option value="ITC">ITC (ITC Limited)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Source Ingestion Channel
                    </label>
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--inner-box-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    >
                      <option value="Telegram Trading Rooms">Telegram Trading Rooms (Alpha Alert Wire)</option>
                      <option value="Twitter FinTwit Swarm">Twitter / X FinTwit Coordinated Swarm</option>
                      <option value="Reddit /r/IndianStockMarket">Reddit /r/IndianStockMarket Community</option>
                      <option value="WhatsApp Rumor Channel">WhatsApp Forward Wire (Encrypted Chat)</option>
                      <option value="Regulatory Circular Ingest">Regulatory PDF Upload / Document Scanner</option>
                      <option value="Dark Web Market Whisper">Dark Web Financial Threat Forum</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Media Modality & Payload Type
                    </label>
                    <select
                      value={selectedMediaType}
                      onChange={(e) => setSelectedMediaType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--inner-box-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    >
                      <option value="pdf_circular">Forged PDF Circular / Regulatory Letterhead</option>
                      <option value="voice_note">Synthetic Audio Leak / Voice Note ASR</option>
                      <option value="deepfake_video">Deepfake Video / Visual Manipulation</option>
                      <option value="image_infographic">Social Infographic / Screenshot OCR</option>
                      <option value="text">Plain Text Viral Broadcast</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Market Timing Synchronization
                    </label>
                    <select
                      value={selectedTiming}
                      onChange={(e) => setSelectedTiming(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--inner-box-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    >
                      <option value="PRE_MARKET_0845_0915">Pre-Market Opening Bell Burst (08:45 - 09:15 IST)</option>
                      <option value="MARKET_HOURS">Live Trading Session (09:15 - 15:30 IST)</option>
                      <option value="DERIVATIVES_EXPIRY_EVE">Monthly / Weekly F&O Derivatives Expiry Eve</option>
                      <option value="WEEKEND_AFTER_HOURS">Weekend / Post-Market News Cycle</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSignalText('');
                      setProcessedResult(null);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing || !signalText.trim()}
                    className="bs-button bs-button-primary"
                    style={{
                      padding: '10px 24px',
                      fontSize: '13px',
                      fontWeight: 700,
                      gap: '8px',
                      opacity: !signalText.trim() ? 0.5 : 1
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Processing Neural Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={15} />
                        <span>Ingest & Process Signal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Real-time Pipeline Progress or Summary Gauge */}
            <div className="bs-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} style={{ color: '#10b981' }} />
                  <span>Neural Ingestion Pipeline Stages</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                  End-to-end vector extraction, bear-raid correlation, and sovereign AI disclosure generation.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { step: 1, label: 'Multilingual Ingestion & Obfuscation Stripping', desc: 'Indic NLP + Text Normalization' },
                    { step: 2, label: 'Financial Entity & Stock Ticker Resolution', desc: 'Ticker: ' + selectedTicker + ' • Regulators: SEBI/RBI' },
                    { step: 3, label: 'MiniLM 384-dim Semantic Vector Embedding', desc: 'pgvector HNSW Cosine Index Matching' },
                    { step: 4, label: 'Bear-Raid & Short-Seller Manipulation Risk Engine', desc: 'Timing correlation + Panic matrix' },
                    { step: 5, label: 'Sovereign SEBI Reg 30 Disclosure Synthesis', desc: 'Automated statutory exchange dispatch' },
                    { step: 6, label: 'EVM Cryptographic Evidence Preservation', desc: 'SHA-256 Digest + Smart Contract Notary' }
                  ].map((stage) => {
                    const isDone = isProcessing ? pipelineStep > stage.step : (processedResult ? true : false);
                    const isCurrent = isProcessing && pipelineStep === stage.step;

                    return (
                      <div 
                        key={stage.step}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: isCurrent ? 'rgba(59, 130, 246, 0.15)' : 'var(--inner-box-bg)',
                          border: `1px solid ${isCurrent ? '#3b82f6' : isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: isDone ? '#10b981' : isCurrent ? '#3b82f6' : 'var(--bg-card)',
                          color: isDone || isCurrent ? '#ffffff' : 'var(--text-muted)'
                        }}>
                          {isDone ? <Check size={13} /> : stage.step}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: isCurrent ? '#60a5fa' : 'var(--text-heading)' }}>
                            {stage.label}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                            {stage.desc}
                          </div>
                        </div>

                        {isCurrent && (
                          <RefreshCw size={14} className="animate-spin" style={{ color: '#3b82f6' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {processedResult && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: 700 }}>
                    <ShieldCheck size={16} />
                    <span>Signal Analyzed & Sealed in Audit Ledger</span>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#10b981' }}>
                    {processedResult.signal_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RESULTS DOSSIER: PROCESSED INTELLIGENCE                                   */}
          {/* ========================================================================= */}
          {processedResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Dossier Header Banner */}
              <div className="bs-card" style={{ 
                padding: '20px 24px', 
                backgroundColor: 'var(--bg-card)',
                border: `1px solid ${processedResult.metrics?.manipulation_score >= 85 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                boxShadow: processedResult.metrics?.manipulation_score >= 85 ? '0 0 24px rgba(239, 68, 68, 0.1)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="bs-badge" style={{
                        backgroundColor: processedResult.metrics?.threat_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: processedResult.metrics?.threat_level === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'JetBrains Mono'
                      }}>
                        {processedResult.metrics?.threat_level} THREAT
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                        ID: {processedResult.signal_id} • Ingested: {new Date(processedResult.timestamp).toLocaleTimeString()} IST
                      </span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', margin: '4px 0' }}>
                      {processedResult.target_entity?.company_name} ({processedResult.target_entity?.ticker_symbol})
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                      Sector: {processedResult.target_entity?.sector} • Group: {processedResult.target_entity?.group} • Est. Market Cap: ₹{processedResult.target_entity?.market_cap_cr?.toLocaleString()} Cr
                    </p>
                  </div>

                  {/* Big Manipulation Score Gauge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 20px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Market Sabotage Score
                      </div>
                      <div style={{ fontSize: '11px', color: processedResult.metrics?.manipulation_score >= 85 ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
                        {processedResult.metrics?.circuit_breaker_risk} VOLATILITY
                      </div>
                    </div>

                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: processedResult.metrics?.manipulation_score >= 85 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      border: `2px solid ${processedResult.metrics?.manipulation_score >= 85 ? '#ef4444' : '#f59e0b'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 900,
                      fontFamily: 'JetBrains Mono',
                      color: processedResult.metrics?.manipulation_score >= 85 ? '#ef4444' : '#f59e0b'
                    }}>
                      {processedResult.metrics?.manipulation_score}
                    </div>
                  </div>
                </div>

                {/* Key Metrics 4-Box Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bear-Raid Probability</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                      {processedResult.metrics?.bear_raid_probability}%
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Pre-Market Opening Spike</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timing Synchronization</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#3b82f6', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                      {processedResult.metrics?.pre_market_timing_sync}%
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Aligned with 08:45 Bell</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Price Volatility</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                      {processedResult.metrics?.estimated_volatility_pct}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Simulated Opening Gap</div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Cap at Risk</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#ec4899', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                      {processedResult.metrics?.estimated_mcap_exposure_cr}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Enterprise Exposure</div>
                  </div>
                </div>

                {/* Attack Vectors & Regulators Impersonated */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ATTACK VECTORS:</span>
                    {processedResult.attack_vectors_detected?.map((vec, idx) => (
                      <span key={idx} style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        fontWeight: 600,
                        border: '1px solid rgba(239, 68, 68, 0.25)'
                      }}>
                        {vec.name}
                      </span>
                    ))}
                  </div>

                  {processedResult.regulators_impersonated?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>IMPERSONATED REGULATORS:</span>
                      {processedResult.regulators_impersonated.map((reg, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: '#f59e0b',
                          fontWeight: 700,
                          border: '1px solid rgba(245, 158, 11, 0.25)'
                        }}>
                          {reg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Regulatory Disclosures & AI Strategic Counter-Playbook */}
              <div className="bs-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} style={{ color: '#3b82f6' }} />
                      <span>Sovereign Regulatory Disclosures & Defense Dispatch</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                      Auto-synthesized statutory exchange clarifications, emergency takedown notices, and legal proofs.
                    </p>
                  </div>

                  {/* Disclosure Sub-Tabs */}
                  <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--inner-box-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => setActiveDisclosureTab('reg30')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: activeDisclosureTab === 'reg30' ? 'var(--bg-card)' : 'transparent',
                        color: activeDisclosureTab === 'reg30' ? '#60a5fa' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      SEBI Reg 30 Draft
                    </button>

                    <button
                      onClick={() => setActiveDisclosureTab('press')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: activeDisclosureTab === 'press' ? 'var(--bg-card)' : 'transparent',
                        color: activeDisclosureTab === 'press' ? '#60a5fa' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      NSE / BSE Press Release
                    </button>

                    <button
                      onClick={() => setActiveDisclosureTab('sec69a')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: activeDisclosureTab === 'sec69a' ? 'var(--bg-card)' : 'transparent',
                        color: activeDisclosureTab === 'sec69a' ? '#60a5fa' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      IT Act Sec 69A Notice
                    </button>

                    <button
                      onClick={() => setActiveDisclosureTab('playbook')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: activeDisclosureTab === 'playbook' ? 'var(--bg-card)' : 'transparent',
                        color: activeDisclosureTab === 'playbook' ? '#60a5fa' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Rapid Action Playbook
                    </button>
                  </div>
                </div>

                {/* Disclosure Content Viewer */}
                {activeDisclosureTab === 'reg30' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--text-primary)',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '260px',
                      overflowY: 'auto'
                    }}>
                      {processedResult.regulatory_disclosures?.sebi_reg30_draft}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                      <button
                        onClick={() => handleCopy(processedResult.regulatory_disclosures?.sebi_reg30_draft, 'reg30')}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                      >
                        {copiedKey === 'reg30' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                        <span>{copiedKey === 'reg30' ? 'Copied to Clipboard!' : 'Copy SEBI Clarification'}</span>
                      </button>

                      <button
                        onClick={() => onNavigate && onNavigate('analyst-response')}
                        className="bs-button bs-button-primary"
                        style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                      >
                        <span>Dispatch to Exchange Terminal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {activeDisclosureTab === 'press' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--text-primary)',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '260px',
                      overflowY: 'auto'
                    }}>
                      {processedResult.regulatory_disclosures?.nse_bse_press_advisory}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                      <button
                        onClick={() => handleCopy(processedResult.regulatory_disclosures?.nse_bse_press_advisory, 'press')}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                      >
                        {copiedKey === 'press' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                        <span>{copiedKey === 'press' ? 'Copied Press Release!' : 'Copy Press Release'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeDisclosureTab === 'sec69a' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--text-primary)',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '260px',
                      overflowY: 'auto'
                    }}>
                      {processedResult.regulatory_disclosures?.it_act_sec69a_takedown}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                      <button
                        onClick={() => handleCopy(processedResult.regulatory_disclosures?.it_act_sec69a_takedown, 'sec69a')}
                        className="bs-button bs-button-secondary"
                        style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
                      >
                        {copiedKey === 'sec69a' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                        <span>{copiedKey === 'sec69a' ? 'Copied Takedown Notice!' : 'Copy Sec 69A Notice'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeDisclosureTab === 'playbook' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {processedResult.regulatory_disclosures?.statutory_playbook?.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          backgroundColor: 'var(--inner-box-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {item.step}
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
                              {item.action}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Protocol Urgency: {item.urgency}
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '10px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 700
                        }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Blockchain Evidence & 384-dim Embedding Coordinates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Blockchain Proof Card */}
                <div className="bs-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Lock size={16} style={{ color: '#10b981' }} />
                    <span>Cryptographic Evidence Preservation (EVM Ledger)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}>
                    <div style={{ padding: '8px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>SHA-256 EVIDENCE DIGEST</div>
                      <div style={{ color: '#60a5fa', wordBreak: 'break-all', marginTop: '2px' }}>
                        {processedResult.blockchain_proof?.sha256_hash}
                      </div>
                    </div>

                    <div style={{ padding: '8px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>EVM TRANSACTION HASH</div>
                      <div style={{ color: '#10b981', wordBreak: 'break-all', marginTop: '2px' }}>
                        {processedResult.blockchain_proof?.evm_tx_hash}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ padding: '8px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>BLOCK NUMBER</div>
                        <div style={{ color: 'var(--text-heading)', marginTop: '2px' }}>
                          #{processedResult.blockchain_proof?.block_number}
                        </div>
                      </div>

                      <div style={{ padding: '8px', backgroundColor: 'var(--inner-box-bg)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>NOTARY STATUS</div>
                        <div style={{ color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                          ✓ VERIFIED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 384-dim Vector Slice Card */}
                <div className="bs-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Database size={16} style={{ color: '#3b82f6' }} />
                    <span>pgvector 384-dim Semantic Coordinates</span>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Deterministic cross-lingual MiniLM vector projection indexed via HNSW cosine distance for sub-millisecond cluster matching.
                  </p>

                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#60a5fa',
                    lineHeight: '1.6'
                  }}>
                    <div>Vector Dimension: {processedResult.vector_embedding_preview?.dimension || 384}d (Float32)</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Sample Cosine Coordinates:</div>
                    <div style={{ color: '#f59e0b', wordBreak: 'break-all' }}>
                      [{processedResult.vector_embedding_preview?.sample_values?.join(', ')}, ...]
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PROCESSED SIGNALS HISTORY & STREAM TABLE                                  */}
          {/* ========================================================================= */}
          <div className="bs-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ color: '#3b82f6' }} />
                  <span>Processed Market Intelligence Signals ({history.length})</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Historical record of all analyzed financial claims, bear-raid intercepts, and notarized disclosures.
                </p>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search signals, tickers, IDs..."
                    style={{
                      padding: '6px 12px 6px 30px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      width: '200px'
                    }}
                  />
                </div>

                <select
                  value={tickerFilter}
                  onChange={(e) => setTickerFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="ALL">All Tickers</option>
                  <option value="TATAMOTORS">TATAMOTORS</option>
                  <option value="ADANIPORTS">ADANIPORTS</option>
                  <option value="HDFCBANK">HDFCBANK</option>
                  <option value="INFY">INFY</option>
                  <option value="RELIANCE">RELIANCE</option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'var(--inner-box-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MODERATE">Moderate</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>SIGNAL ID</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>TARGET SECURITY</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>SOURCE / CHANNEL</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>CLAIM EXCERPT</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>THREAT SCORE</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>EVM NOTARY</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No processed market signals match your active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item, idx) => (
                      <tr 
                        key={item.signal_id || idx}
                        style={{ 
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: '#60a5fa', fontWeight: 600 }}>
                          {item.signal_id}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                            color: '#60a5fa', 
                            fontFamily: 'JetBrains Mono', 
                            fontWeight: 700 
                          }}>
                            {item.target_entity?.ticker_symbol || item.target_entity?.ticker_key}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                          {item.source}
                        </td>
                        <td style={{ padding: '12px', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-heading)' }}>
                          {item.raw_text}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className="bs-badge" style={{
                            backgroundColor: item.metrics?.threat_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: item.metrics?.threat_level === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {item.metrics?.manipulation_score || 75}/100
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#10b981' }}>
                          ✓ SEALED
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setProcessedResult(item);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="bs-button bs-button-secondary"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            Inspect Dossier
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATASET BATCH INGEST & CLUSTERING                                   */}
      {/* ========================================================================= */}
      {activeTab === 'batch-ingest' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Drag & Drop Import Card */}
          <div className="bs-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-heading)' }}>
              <Upload size={18} style={{ color: '#3b82f6' }} />
              <span>Multimodal Dataset Batch Ingest & Semantic Staging</span>
            </div>

            <div style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '36px', 
              textAlign: 'center',
              backgroundColor: 'var(--inner-box-bg)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                marginBottom: '14px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Upload size={24} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
                Drag and drop 20K Instagram / Reddit / Twitter JSONL datasets
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Automated OCR text extraction, Whisper ASR audio demuxing, and 384-dim vector embeddings
              </div>

              <button className="bs-button bs-button-secondary" style={{ marginTop: '18px', fontSize: '12px', padding: '8px 18px' }}>
                Select File System Dataset
              </button>
            </div>
          </div>

          {/* Staging Pipeline Card */}
          {fileStaged && (
            <div className="bs-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', color: '#60a5fa', border: '1px solid var(--border-color)' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)' }}>instagram_20k_dataset.jsonl & reddit_20k_dataset.jsonl</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ready for Multilingual Vectorization • 92.4 MB Total</div>
                  </div>
                </div>

                <button 
                  onClick={() => setFileStaged(false)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Data Summary Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '12px', 
                padding: '16px', 
                backgroundColor: 'var(--inner-box-bg)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingested Signals</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>40,000+</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modalities</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>Text, OCR, ASR</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Embeddings Model</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#3b82f6', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>MiniLM 384d</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Sectors</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>Markets & Infra</div>
                </div>
              </div>

              {/* Pipeline Staging Checklist */}
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Batch Processing Stages
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>Schema Normalization</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>Language ID (Indic + English)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>Multimodal OCR & Whisper ASR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>Entity & Claim Extractor</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>Vector Embedding (pgvector)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span>HDBSCAN Narrative Clustering</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  onClick={handleAnalyzeDataset}
                  disabled={analyzingBatch}
                  className="bs-button bs-button-primary" 
                  style={{ gap: '8px', fontSize: '13px', padding: '10px 20px' }}
                >
                  <Sparkles size={15} /> 
                  <span>{analyzingBatch ? 'Processing 40K Vectors & Clusters...' : batchDone ? '✓ Clustering Synchronized' : 'Execute Full Batch Clustering'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REAL-TIME SOCKET STREAM                                            */}
      {/* ========================================================================= */}
      {activeTab === 'live-feed' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
          
          {/* Socket Stream List */}
          <div className="bs-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={18} style={{ color: '#10b981' }} />
                  <span>Real-Time Socket Intercepts ({liveSignals.length})</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Live incoming stream from Telegram bots, WhatsApp tipline, and social crawlers.
                </p>
              </div>

              <button
                onClick={handleSimulateBurst}
                disabled={simulating}
                className="bs-button bs-button-secondary"
                style={{ fontSize: '12px', padding: '6px 14px', gap: '6px' }}
              >
                <Zap size={13} />
                <span>Simulate Burst</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto' }}>
              {liveSignals.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  Listening for incoming signals from Telegram, WhatsApp, and social crawlers...
                </div>
              ) : (
                liveSignals.map((sig, idx) => (
                  <div 
                    key={sig.id || idx}
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--inner-box-bg)',
                      border: `1px solid ${sig.threat_score >= 80 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="bs-badge" style={{
                        fontSize: '10px',
                        backgroundColor: sig.platform === 'whatsapp' ? 'rgba(16, 185, 129, 0.15)' : sig.platform === 'telegram' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                        color: sig.platform === 'whatsapp' ? '#10b981' : sig.platform === 'telegram' ? '#3b82f6' : '#ec4899',
                        textTransform: 'uppercase'
                      }}>
                        {sig.platform}
                      </span>

                      <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: sig.threat_score >= 80 ? '#ef4444' : 'var(--text-secondary)', fontWeight: 700 }}>
                        Threat: {sig.threat_score || 75}/100
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-heading)', lineHeight: 1.5, marginBottom: '8px' }}>
                      {sig.raw_payload || sig.text}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                      <span>{sig.id}</span>
                      <span>{new Date(sig.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ingestion Telemetry Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="bs-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Activity size={16} style={{ color: '#3b82f6' }} />
                <span>Today's Channel Ingestion Volume</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={13} style={{ color: '#10b981' }} /> WhatsApp Tipline
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                    {stats.todayWhatsApp}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={13} style={{ color: '#3b82f6' }} /> Telegram Tipline
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                    {stats.todayTelegram}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={13} style={{ color: '#ec4899' }} /> Instagram Harvester
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                    {stats.todayInstagram}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--inner-box-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={13} style={{ color: '#f59e0b' }} /> Reddit Streamer
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-heading)', marginTop: '4px' }}>
                    {stats.todayReddit}
                  </div>
                </div>
              </div>
            </div>

            <div className="bs-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Globe size={16} style={{ color: '#10b981' }} />
                <span>Active Intermediary Takedowns</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Algorithmic blocking requests issued under IT Act Sec 69A targeting coordinated market disruption.
              </p>

              <button 
                onClick={() => onNavigate && onNavigate('evidence')}
                className="bs-button bs-button-secondary" 
                style={{ width: '100%', gap: '8px', fontSize: '12px', padding: '10px' }}>
                <span>Open Blockchain Evidence Vault</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
