import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  Zap, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Pause, 
  Play, 
  Layers, 
  ShieldAlert, 
  Filter, 
  Info, 
  X,
  ExternalLink,
  Lock
} from 'lucide-react';

const DEFAULT_NODES = [
  // Campaign Core
  { id: 'core-1', label: 'Operation Echo: Grid Sabotage', type: 'core', threat: 94, size: 28, color: '#ef4444', x: 400, y: 250, cluster: 'CMP-007' },
  
  // Targets
  { id: 'tgt-1', label: 'DoT Infrastructure & 5G Towers', type: 'target', threat: 85, size: 20, color: '#f59e0b', x: 260, y: 150, cluster: 'Target' },
  { id: 'tgt-2', label: 'Banking & UPI Payment Hubs', type: 'target', threat: 80, size: 18, color: '#f59e0b', x: 540, y: 140, cluster: 'Target' },

  // Botnet Swarms
  { id: 'swarm-1', label: 'Botnet Cluster Alpha (42 Proxies)', type: 'swarm', threat: 92, size: 22, color: '#ec4899', x: 240, y: 360, platform: 'twitter', cluster: 'Swarm' },
  { id: 'swarm-2', label: 'Telegram Infiltration Ring (18 Channels)', type: 'swarm', threat: 88, size: 20, color: '#3b82f6', x: 560, y: 360, platform: 'telegram', cluster: 'Swarm' },
  { id: 'swarm-3', label: 'WhatsApp Forward Relay Net', type: 'swarm', threat: 86, size: 20, color: '#10b981', x: 400, y: 430, platform: 'whatsapp', cluster: 'Swarm' },

  // Amplifiers / Seed Accounts
  { id: 'acc-1', label: '@tech_leaks_in (Seed Node)', type: 'account', platform: 'twitter', threat: 95, size: 14, color: '#60a5fa', x: 150, y: 320 },
  { id: 'acc-2', label: '@indiagrid_alert (Proxy)', type: 'account', platform: 'twitter', threat: 89, size: 13, color: '#60a5fa', x: 170, y: 430 },
  { id: 'acc-3', label: 't.me/telecom_sabotage_news', type: 'account', platform: 'telegram', threat: 91, size: 14, color: '#38bdf8', x: 670, y: 320 },
  { id: 'acc-4', label: 't.me/urgent_civic_leaks', type: 'account', platform: 'telegram', threat: 84, size: 13, color: '#38bdf8', x: 660, y: 430 },
  { id: 'acc-5', label: 'WA Group: State Emergency Broadcasters', type: 'account', platform: 'whatsapp', threat: 87, size: 14, color: '#34d399', x: 320, y: 490 },
  { id: 'acc-6', label: 'WA Group: Civic Updates Mumbai', type: 'account', platform: 'whatsapp', threat: 82, size: 13, color: '#34d399', x: 480, y: 490 },
  { id: 'acc-7', label: 'IG: @darknews_india (Meme Farm)', type: 'account', platform: 'instagram', threat: 86, size: 14, color: '#f43f5e', x: 400, y: 100 },
];

const DEFAULT_EDGES = [
  { source: 'core-1', target: 'tgt-1', weight: 4, label: 'Targeting Vector' },
  { source: 'core-1', target: 'tgt-2', weight: 3, label: 'Secondary Narrative' },
  { source: 'core-1', target: 'swarm-1', weight: 5, sync: '96%' },
  { source: 'core-1', target: 'swarm-2', weight: 5, sync: '91%' },
  { source: 'core-1', target: 'swarm-3', weight: 4, sync: '88%' },
  { source: 'core-1', target: 'acc-7', weight: 3, sync: '84%' },
  { source: 'swarm-1', target: 'acc-1', weight: 2 },
  { source: 'swarm-1', target: 'acc-2', weight: 2 },
  { source: 'swarm-2', target: 'acc-3', weight: 2 },
  { source: 'swarm-2', target: 'acc-4', weight: 2 },
  { source: 'swarm-3', target: 'acc-5', weight: 2 },
  { source: 'swarm-3', target: 'acc-6', weight: 2 },
  { source: 'acc-1', target: 'tgt-1', weight: 2 },
  { source: 'acc-3', target: 'tgt-2', weight: 2 },
  { source: 'acc-7', target: 'tgt-1', weight: 2 }
];

export default function NetworkGraph({ campaignId = 'CMP-007' }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges] = useState(DEFAULT_EDGES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const animFrameRef = useRef(null);
  const pulseOffsetRef = useRef(0);

  // Filter nodes based on platform
  const visibleNodes = useMemo(() => {
    if (selectedPlatform === 'all') return nodes;
    return nodes.filter(n => n.type === 'core' || n.type === 'target' || n.platform === selectedPlatform);
  }, [nodes, selectedPlatform]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return edges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));
  }, [edges, visibleNodeIds]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      pulseOffsetRef.current += 0.04;

      // 1. Draw Grid Background in world coordinates
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = -200; x < canvas.width + 400; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -200);
        ctx.lineTo(x, canvas.height + 400);
        ctx.stroke();
      }
      for (let y = -200; y < canvas.height + 400; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-200, y);
        ctx.lineTo(canvas.width + 400, y);
        ctx.stroke();
      }

      const nodeMap = {};
      visibleNodes.forEach(n => { nodeMap[n.id] = n; });

      // 2. Draw Edges & Moving Pulse Particles
      visibleEdges.forEach((edge, idx) => {
        const src = nodeMap[edge.source];
        const tgt = nodeMap[edge.target];
        if (!src || !tgt) return;

        // Base Line
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = edge.sync ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.25)';
        ctx.lineWidth = edge.weight || 2;
        ctx.stroke();

        // Energy Pulse Particle moving along the edge
        const t = (pulseOffsetRef.current + idx * 0.3) % 1;
        const px = src.x + (tgt.x - src.x) * t;
        const py = src.y + (tgt.y - src.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = edge.sync ? '#ef4444' : '#60a5fa';
        ctx.shadowColor = edge.sync ? '#ef4444' : '#60a5fa';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Draw Nodes
      visibleNodes.forEach(n => {
        const isSelected = selectedNode?.id === n.id;

        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + (n.type === 'core' ? 8 + Math.sin(pulseOffsetRef.current * 2) * 3 : 4), 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}22`;
        ctx.fill();

        // Core Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = isSelected ? 20 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Node Label
        ctx.font = `600 ${n.type === 'core' ? '12px' : '10px'} Inter, sans-serif`;
        ctx.fillStyle = '#f3f4f6';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(n.label, n.x, n.y + n.size + 16);
        ctx.shadowBlur = 0;

        // Threat rating inside core
        if (n.threat) {
          ctx.font = '700 9px JetBrains Mono, monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${n.threat}`, n.x, n.y + 3);
        }
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [visibleNodes, visibleEdges, selectedNode, zoom, pan]);

  // Mouse Interactivity: Clicking, Dragging & Panning
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked a node
    const clicked = visibleNodes.find(n => {
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= n.size + 6;
    });

    if (clicked) {
      setSelectedNode(clicked);
      setDraggingNode(clicked);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (draggingNode) {
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      setNodes(prev => prev.map(n => n.id === draggingNode.id ? { ...n, x: mouseX, y: mouseY } : n));
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.5), 2.5));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <div className="bs-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', backgroundColor: '#0b0d14' }}>
      
      {/* Top Controls Toolbar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Left: Platform Filters */}
        <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto', backgroundColor: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(8px)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: 'All Vectors' },
            { id: 'twitter', label: 'X (Twitter)' },
            { id: 'telegram', label: 'Telegram' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'instagram', label: 'Instagram' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedPlatform === p.id ? '#3b82f6' : 'transparent',
                color: selectedPlatform === p.id ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Right: Zoom & Reset Controls */}
        <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto', backgroundColor: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(8px)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button onClick={() => setZoom(z => Math.min(z * 1.15, 2.5))} className="bs-button bs-button-secondary" style={{ padding: '6px', border: 'none' }}>
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z * 0.85, 0.5))} className="bs-button bs-button-secondary" style={{ padding: '6px', border: 'none' }}>
            <ZoomOut size={14} />
          </button>
          <button onClick={resetView} className="bs-button bs-button-secondary" style={{ padding: '6px', border: 'none' }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          width: '100%',
          height: '500px',
          display: 'block',
          cursor: isPanning ? 'grabbing' : draggingNode ? 'grabbing' : 'grab'
        }}
      />

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          width: '320px',
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          zIndex: 20,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: selectedNode.color }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {selectedNode.type} Node
              </span>
            </div>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            {selectedNode.label}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 8px', borderRadius: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Threat Score:</span>
              <div style={{ color: selectedNode.threat >= 80 ? '#ef4444' : '#f59e0b', fontWeight: 700, marginTop: '2px' }}>
                {selectedNode.threat}/100
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 8px', borderRadius: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Platform:</span>
              <div style={{ color: '#60a5fa', fontWeight: 700, marginTop: '2px', textTransform: 'capitalize' }}>
                {selectedNode.platform || 'Cross-Platform'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
            Synchronized propagation detected with 94% narrative vector similarity across botnet relays.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#10b981', fontFamily: 'JetBrains Mono' }}>
            <Lock size={12} /> SHA-256 Provenance Logged
          </div>
        </div>
      )}

      {/* Bottom Info Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: 'rgba(17, 24, 39, 0.6)',
        borderTop: '1px solid var(--border-color)',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Nodes: <strong style={{ color: '#ffffff' }}>{visibleNodes.length}</strong></span>
          <span>Edges: <strong style={{ color: '#ffffff' }}>{visibleEdges.length}</strong></span>
          <span>Active Swarm Sync: <strong style={{ color: '#ef4444' }}>96%</strong></span>
        </div>
        <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}>
          Drag nodes to arrange • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
