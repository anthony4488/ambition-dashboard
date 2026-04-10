import { useState } from 'react'
import { MetricCard, SectionTitle, fmt } from './components.jsx'
import { schedule } from './data'

function buildInitialState() {
  const state = {}
  schedule.forEach((d, di) => {
    d.sessions.forEach((s, si) => {
      s.athletes.forEach((a, ai) => {
        state[`${di}-${si}-${ai}`] = true
      })
    })
  })
  return state
}

export default function AttendanceTracker() {
  const [attendance, setAttendance] = useState(buildInitialState)

  const toggle = (key) => {
    setAttendance(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const setAll = (val) => {
    setAttendance(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(k => next[k] = val)
      return next
    })
  }

  let totalSessions = 0, attended = 0, absent = 0, revIn = 0, revLost = 0
  schedule.forEach((d, di) => {
    d.sessions.forEach((s, si) => {
      s.athletes.forEach((a, ai) => {
        totalSessions++
        const key = `${di}-${si}-${ai}`
        if (attendance[key]) {
          attended++
          revIn += a.rate
        } else {
          absent++
          revLost += a.rate
        }
      })
    })
  })
  const cancelRate = totalSessions > 0 ? (absent / totalSessions) : 0

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
        marginBottom: 16,
      }}>
        <MetricCard label="Booked" value={totalSessions} delay={0} />
        <MetricCard label="Attended" value={attended} color="var(--green)" delay={50} />
        <MetricCard label="No-show" value={absent} color="var(--red)" delay={100} />
        <MetricCard label="Cancel rate" value={(cancelRate * 100).toFixed(1) + '%'} color={cancelRate > 0.15 ? 'var(--red)' : 'var(--orange)'} delay={150} />
        <MetricCard label="Revenue in" value={fmt(revIn)} color="var(--green)" delay={200} />
        <MetricCard label="Revenue lost" value={fmt(revLost)} color="var(--red)" delay={250} />
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
      }}>
        <button onClick={() => setAll(true)} style={{
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font)',
          background: 'var(--green-dim)',
          color: 'var(--green)',
          border: '1px solid rgba(46,204,113,0.3)',
          borderRadius: 6,
          cursor: 'pointer',
        }}>Check all</button>
        <button onClick={() => setAll(false)} style={{
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font)',
          background: 'var(--red-dim)',
          color: 'var(--red)',
          border: '1px solid rgba(231,76,60,0.3)',
          borderRadius: 6,
          cursor: 'pointer',
        }}>Uncheck all</button>
      </div>

      {schedule.map((day, di) => (
        <div key={di} style={{
          marginBottom: 20,
          animation: `fadeUp 0.3s ease ${di * 40}ms both`,
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--orange)',
            padding: '8px 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: 6,
            letterSpacing: '-0.01em',
          }}>{day.day}</div>

          {day.sessions.map((session, si) => (
            <div key={si} style={{
              display: 'flex',
              gap: 12,
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                minWidth: 72,
                paddingTop: 2,
                flexShrink: 0,
              }}>{session.time}</div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 14px',
                flex: 1,
              }}>
                {session.athletes.map((ath, ai) => {
                  const key = `${di}-${si}-${ai}`
                  const checked = attendance[key]
                  return (
                    <label key={ai} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(key)}
                      />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: checked ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        textDecoration: checked ? 'none' : 'line-through',
                        transition: 'all 0.15s ease',
                      }}>{ath.name}</span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: checked ? 'var(--green)' : 'var(--red)',
                        opacity: 0.7,
                      }}>${ath.rate}</span>
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
