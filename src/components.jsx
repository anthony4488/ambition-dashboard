import React from 'react'

const s = {
  metric: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    padding: '14px 18px',
    border: '1px solid var(--border)',
    animation: 'fadeUp 0.3s ease both',
  },
  label: { fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 },
  value: { fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' },
}

export function MetricCard({ label, value, color = 'var(--text-primary)', delay = 0 }) {
  return (
    <div style={{ ...s.metric, animationDelay: `${delay}ms` }}>
      <div style={s.label}>{label}</div>
      <div style={{ ...s.value, color }}>{value}</div>
    </div>
  )
}

export function MetricGrid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
      {children}
    </div>
  )
}

export function Slider({ label, value, onChange, min, max, step, format }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  )
}

export function SectionHeader({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em',
      textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8,
      borderBottom: '1px solid var(--border)',
    }}>{children}</div>
  )
}

export function TierCard({ name, revenue, detail, accent }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderLeft: accent ? `3px solid ${accent}` : '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{name}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--green)' }}>{revenue}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{detail}</div>
    </div>
  )
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 2, marginBottom: 28, borderBottom: '1px solid var(--border)',
      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '12px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          border: 'none', background: 'none', whiteSpace: 'nowrap',
          color: active === t.id ? 'var(--accent)' : 'var(--text-muted)',
          borderBottom: active === t.id ? '2px solid var(--accent)' : '2px solid transparent',
          transition: 'all 0.15s', fontFamily: 'var(--font)',
        }}>{t.label}</button>
      ))}
    </div>
  )
}
