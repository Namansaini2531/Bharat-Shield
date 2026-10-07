import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

// Optional Web Audio Synth for threat alerts
function playThreatChirp(severity = 'MEDIUM') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(severity === 'CRITICAL' ? 880 : 520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(severity === 'CRITICAL' ? 440 : 660, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // Silent fail if audio blocked by browser policy
  }
}

export function WebSocketProvider({ children }) {
  const { currentRole, currentUser } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [liveSignals, setLiveSignals] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [stats, setStats] = useState({
    todayWhatsApp: 238,
    todayTelegram: 147,
    todayInstagram: 94,
    todayReddit: 61,
    totalIngestedToday: 540
  });

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname || '127.0.0.1';
      const wsUrl = `${protocol}//${host}:8000/ws/live-signals?role=${currentRole}&analyst_id=${currentUser?.badgeText || 'ANALYST'}`;

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        console.log("✓ Bharat-Shield WebSocket connected:", wsUrl);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          if (payload.event === 'NEW_SIGNAL_INGESTED') {
            const sig = payload.data;
            setLiveSignals((prev) => [sig, ...prev.slice(0, 49)]);
            
            // Update stats
            setStats((prev) => {
              const platform = (sig.platform || '').toLowerCase();
              return {
                ...prev,
                todayWhatsApp: platform.includes('whatsapp') ? prev.todayWhatsApp + 1 : prev.todayWhatsApp,
                todayTelegram: platform.includes('telegram') ? prev.todayTelegram + 1 : prev.todayTelegram,
                todayInstagram: platform.includes('instagram') ? prev.todayInstagram + 1 : prev.todayInstagram,
                todayReddit: platform.includes('reddit') ? prev.todayReddit + 1 : prev.todayReddit,
                totalIngestedToday: prev.totalIngestedToday + 1
              };
            });

            if (sig.threat_score >= 80 || sig.severity === 'CRITICAL') {
              playThreatChirp('CRITICAL');
            }
          } else if (payload.event === 'THREAT_ALERT') {
            setActiveAlert(payload.alert);
            playThreatChirp('CRITICAL');
            setTimeout(() => setActiveAlert(null), 8000);
          }
        } catch (err) {
          console.warn("WebSocket message parsing error:", err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        // Reconnect attempt after 4s
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 4000);
      };

      socket.onerror = (err) => {
        console.debug("WebSocket connection fallback:", err);
        socket.close();
      };
    } catch (e) {
      console.debug("WebSocket init fallback:", e);
    }
  }, [currentRole, currentUser]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connectWebSocket]);

  // Method to manually trigger a burst simulation
  const triggerSimulationBurst = async (count = 3) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/stream/simulate-burst?count=${count}`, {
        method: 'POST'
      });
      return await res.json();
    } catch (e) {
      // Fallback local injection if server is offline
      const mockSignal = {
        id: `SIG-SIM-${Math.floor(Math.random() * 9000 + 1000)}`,
        platform: ['whatsapp', 'telegram', 'instagram', 'reddit'][Math.floor(Math.random() * 4)],
        raw_payload: 'Breaking: False circular regarding national internet shutdown circulating.',
        detected_language: 'hi-Latn',
        threat_score: 91,
        severity: 'CRITICAL',
        timestamp: new Date().toISOString()
      };
      setLiveSignals((prev) => [mockSignal, ...prev.slice(0, 49)]);
      playThreatChirp('CRITICAL');
      return { status: 'mock_burst_injected' };
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, liveSignals, activeAlert, stats, triggerSimulationBurst, dismissAlert: () => setActiveAlert(null) }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
