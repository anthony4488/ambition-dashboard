import React from 'react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      display: 'grid', placeContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px',
        minWidth: 340, maxWidth: 520, maxHeight: '85vh', overflowY: 'auto',
        animation: 'fadeUp 0.2s ease both',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, color: 'var(--text-muted)', padding: '4px 8px',
            fontFamily: 'var(--font)',
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', fontSize: 13, fontWeight: 500,
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  borderRadius: 6, color: 'var(--text-primary)', fontFamily: 'var(--font)',
  outline: 'none',
}

const labelStyle = {
  fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6,
  display: 'block',
}

export function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export function Input(props) {
  return <input style={inputStyle} {...props} />
}

export function Select({ children, ...props }) {
  return <select style={{ ...inputStyle, cursor: 'pointer' }} {...props}>{children}</select>
}

export function Btn({ children, variant = 'primary', ...props }) {
  const styles = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none' },
    danger: { background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)' },
    ghost: { background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
  }
  return (
    <button {...props} style={{
      padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
      borderRadius: 6, fontFamily: 'var(--font)',
      ...styles[variant],
      opacity: props.disabled ? 0.5 : 1,
      ...props.style,
    }}>{children}</button>
  )
}
