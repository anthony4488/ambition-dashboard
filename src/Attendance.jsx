import React, { useState, useMemo } from 'react'
import { MetricCard, MetricGrid, SectionHeader } from './components'
import { schedule } from './data'

const fmt = n => '$' + Math.round(n).toLocaleString()

export default function Attendance() {
  const [attendance, setAttendance] = useState(() => {
    const init = {}
    schedule.forEach((d, di) => {
      d.sessions.forEach((s, si) => {
        s.athletes.forEach((a, ai) => {
          init[`${di}-${si}-${ai}`] = true
        })
      })
    })
    return init
  })

  const toggle = (key) => {
    setAttendance(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const resetAll = (val) => {
    setAttendance(prev => {
      const next = {}
      Object.keys(prev).forEach(k => next[k] = val)
      return next
    })
  }

  const stats = useMemo(() => {
    let total = 0, present = 0, absent = 0, revIn = 0, revLost = 0
    schedule.forEach((d, di) => {
      d.sessions.forEach((s, si) => {
        s.athletes.forEach((a, ai) => {
          total++
          const key = `${di}-${si}-${ai}`
          if (attendance[key]) {
            present++
            revIn += a.rate
          } else {
            absent++
            revLost += a.rate
          }
        })
      })
    })
    return { total, present, absent, cancelRate: total > 0 ? (absent / total * 100) : 0, revIn, revLost }
  }, [attendance])

  return (
    <div>
      <MetricGrid>
        <MetricCard label="Booked" value={stats.total} delay={0} />
        <MetricCard label="Attended" value={stats.present} color="var(--green)" delay={50} />
        <MetricCard label="No-show" value={stats.absent} color="var(--red)" delay={100} />
        <MetricCard label="Cancel %" value={stats.cancelRate.toFixed(1) + '%'} color={stats.cancelRate > 15 ? 'var(--red)' : 'var(--accent)'} delay={150} />
        <MetricCard label="Revenue in" value={fmt(stats.revIn)} color="var(--green)" delay={200} />
        <MetricCard label="Revenue lost" value={fmt(stats.revLost)} color="var(--red)" delay={250} />
      </MetricGrid>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => resetAll(true)} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          border: '1px solid var(--green)', borderRadius: 'var(--radius)',
          background: 'var(--green-dim)', color: 'var(--green)', fontFamily: 'var(--font)',
        }}>Check all</button>
        <button onClick={() => resetAll(false)} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          border: '1px solid var(--red)', borderRadius: 'var(--radius)',
          background: 'var(--red-dim)', color: 'var(--red)', fontFamily: 'var(--font)',
        }}>Uncheck all</button>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 4 }}>
          Uncheck athletes who cancelled or didn't show
        </span>
      </div>

      {schedule.map((day, di) => (
        <div key={di} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em',
            textTransform: 'uppercase', paddingBottom: 8, marginBottom: 8,
            borderBottom: '1px solid var(--border)',
          }}>{day.day}</div>

          {day.sessions.map((session, si) => (
            <div key={si} style={{
              display: 'flex', gap: 12, padding: '8px 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: 12, color: 'var(--text-muted)', fontWeight: 500,
                minWidth: 72, paddingTop: 2, fontVariantNumeric: 'tabular-nums',
              }}>{session.time}</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', flex: 1 }}>
                {session.athletes.map((ath, ai) => {
                  const key = `${di}-${si}-${ai}`
                  const checked = attendance[key]
                  return (
                    <label key={ai} style={{
                      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      fontSize: 13, fontWeight: 500,
                      color: checked ? 'var(--text-primary)' : 'var(--text-muted)',
                      textDecoration: checked ? 'none' : 'line-through',
                      transition: 'all 0.15s',
                    }}>
                      <input type="checkbox" checked={checked} onChange={() => toggle(key)} />
                      <span>{ath.name}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>
                        ${ath.rate}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
