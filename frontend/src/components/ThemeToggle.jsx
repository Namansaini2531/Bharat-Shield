import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

const themes = [
  { id: 'dark',   label: 'Dark Mode',    icon: Moon,    color: '#818cf8' },
  { id: 'light',  label: 'Light Mode',   icon: Sun,     color: '#f59e0b' },
  { id: 'system', label: 'System Theme', icon: Monitor, color: '#10b981' },
];

export default function ThemeToggle({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '32px',
          padding: '0 8px',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'inherit',
          color: 'var(--text-primary)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          whiteSpace: 'nowrap',
        }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.25)')}
        onBlur={(e)  => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
      >
        <CurrentIcon size={15} style={{ color: current.color, flexShrink: 0 }} />
      </button>

      {/* ── Popover ── */}
      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '160px',
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px -4px rgba(0,0,0,0.45), 0 4px 8px -2px rgba(0,0,0,0.3)',
            padding: '4px',
            zIndex: 200,
            animation: 'shadcn-select-in 0.12s ease-out',
          }}
        >
          {themes.map((item) => {
            const Icon = item.icon;
            const selected = item.id === theme;
            return (
              <button
                key={item.id}
                role="option"
                aria-selected={selected}
                onClick={() => { setTheme(item.id); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selected ? 'var(--bg-card-hover)' : 'transparent',
                  color: selected ? 'var(--text-heading)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: selected ? 600 : 400,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s, color 0.1s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selected ? 'var(--bg-card-hover)' : 'transparent';
                  e.currentTarget.style.color = selected ? 'var(--text-heading)' : 'var(--text-secondary)';
                }}
              >
                <Icon size={13} style={{ color: item.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {selected && (
                  <Check size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Keyframe ── */}
      <style>{`
        @keyframes shadcn-select-in {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
