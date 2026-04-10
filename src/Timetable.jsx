import React, { useState, useMemo } from 'react'
import { MetricCard, MetricGrid, SectionHeader } from './components'
import { schedule, pendingLeads, getTimetableStats } from './data'

const fmt = n => '$' + Math.round(n).toLocaleString()

const dayColors = {
  Monday: '#3B82F6',
  Tuesday: '#8B5CF6',
  Wednesday: '#22C55E',
  Thursday: '#F59E0B',
  Friday: '#EF4444',
  Saturday: '#EC4899',
  Sunday: '#06B6D4',
}

const statusColors = {
  booked: { bg: 'var(--green-dim)', border: 'var(--green)', color: 'var(--green)', label: 'Booked' },
  warm: { bg: 'var(--accent-dim)', border: 'var(--accent)', color: 'var(--accent)', label: 'Warm' },
  new: { bg: 'var(--blue-dim)', border: 'var(--blue)', color: 'var(--blue)', label: 'New' },
  cold: { bg: 'var(--red-dim)', border: 'var(--red)', color: 'var(--red)', label: 'Cold' },
  dead: { bg: '#52525b18', border: '#52525b', color: '#71717a', label: 'Dead' },
}

export default function Timetable() {
  const [view, setView] = useState('grid')
  const [leadFilter, setLeadFilter] = useState('all')
  const stats = useMemo(() => getTimetableStats(), [])

  const filteredLeads = leadFilter === 'all'
    ? pendingLeads.filter(l => l.status !== 'dead')
    : pendingLeads.filter(l => l.status === leadFilter)

  const leadCounts = useMemo(() => {
    const c = { booked: 0, warm: 0, new: 0, cold: 0, dead: 0 }
    pendingLeads.forEach(l => c[l.status]++)
    return c
  }, [])

  // Revenue by day for the bar chart
  const dayRevenue = useMemo(() => {
    return schedule.map(day => {
      let rev = 0
      let athletes = 0
      let sessions = day.sessions.length
      day.sessions.forEach(s => {
        s.athletes.forEach(a => { rev += a.rate; athletes++ })
      })
      return { day: day.day, rev, athletes, sessions }
    })
  }, [])

  const maxDayRev = Math.max(...dayRevenue.map(d => d.rev))

  return (
    <div>
      {/* Top-line metrics */}
      <MetricGrid>
        <MetricCard label="Weekly revenue" value={fmt(stats.weeklyRevenue)} color="var(--green)" delay={0} />
        <MetricCard label="Monthly (est.)" value={fmt(stats.monthlyRevenue)} color="var(--green)" delay={50} />
        <MetricCard label="Sessions / wk" value={stats.totalSessions} delay={100} />
        <MetricCard label="Athlete slots" value={stats.totalAthletes} delay={150} />
        <MetricCard label="Open spots" value={stats.availableSlots} color="var(--blue)" delay={200} />
        <MetricCard label="Fill rate" value={stats.fillRate.toFixed(0) + '%'} color="var(--accent)" delay={250} />
      </MetricGrid>

      {/* Revenue by day bar chart */}
      <SectionHeader>Revenue by day</SectionHeader>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
        marginBottom: 28,
      }}>
        {dayRevenue.map(d => (
          <div key={d.day} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '12px 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dayColors[d.day], letterSpacing: '0.02em' }}>
              {d.day.slice(0, 3).toUpperCase()}
            </div>
            <div style={{
              width: 24, borderRadius: 4, background: 'var(--border)',
              height: 80, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: maxDayRev > 0 ? `${(d.rev / maxDayRev) * 100}%` : '0%',
                background: dayColors[d.day],
                borderRadius: 4,
                transition: 'height 0.4s ease',
                opacity: 0.85,
              }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {fmt(d.rev)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {d.athletes} athletes
            </div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SectionHeader>Weekly timetable</SectionHeader>
        <div style={{ display: 'flex', gap: 4 }}>
          {['grid', 'list'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: '1px solid var(--border)', borderRadius: 6,
              background: view === v ? 'var(--accent)' : 'var(--bg-card)',
              color: view === v ? '#fff' : 'var(--text-muted)',
              fontFamily: 'var(--font)', textTransform: 'capitalize',
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Timetable */}
      {view === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12, marginBottom: 28,
        }}>
          {schedule.map(day => (
            <div key={day.day} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 16px',
                background: dayColors[day.day] + '18',
                borderBottom: `2px solid ${dayColors[day.day]}40`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: dayColors[day.day] }}>
                  {day.day}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {day.sessions.reduce((s, ses) => s + ses.athletes.length, 0)} athletes
                </span>
              </div>
              <div style={{ padding: '8px 0' }}>
                {day.sessions.map((session, si) => {
                  const isFull = session.athletes.length >= 6
                  const isEmpty = session.available || session.athletes.length === 0
                  return (
                    <div key={si} style={{
                      padding: '7px 16px',
                      borderBottom: si < day.sessions.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                        minWidth: 62, paddingTop: 1, fontVariantNumeric: 'tabular-nums',
                      }}>{session.time}</div>
                      <div style={{ flex: 1 }}>
                        {isEmpty ? (
                          <div style={{
                            fontSize: 12, color: 'var(--blue)', fontWeight: 500,
                            background: 'var(--blue-dim)', padding: '3px 8px',
                            borderRadius: 4, display: 'inline-block',
                          }}>
                            Open — {session.maxSpots || 6} spots
                            {session.note ? ` (${session.note})` : ''}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 8px' }}>
                            {session.athletes.map((a, ai) => (
                              <span key={ai} style={{
                                fontSize: 12, fontWeight: 500,
                                color: 'var(--text-secondary)',
                              }}>
                                {a.name}
                                <span style={{
                                  fontSize: 10, color: 'var(--text-muted)',
                                  marginLeft: 2,
                                }}>${a.rate}</span>
                              </span>
                            ))}
                            {!isFull && session.athletes.length > 0 && (
                              <span style={{
                                fontSize: 10, color: 'var(--blue)', fontWeight: 500,
                                opacity: 0.8, alignSelf: 'center',
                              }}>+{6 - session.athletes.length} open</span>
                            )}
                          </div>
                        )}
                        {session.note && !isEmpty && (
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                            {session.note}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: 28 }}>
          {schedule.map((day, di) => (
            <div key={di} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: dayColors[day.day],
                letterSpacing: '0.04em', textTransform: 'uppercase',
                paddingBottom: 8, marginBottom: 4,
                borderBottom: `1px solid ${dayColors[day.day]}30`,
              }}>{day.day}
                <span style={{
                  fontSize: 11, color: 'var(--text-muted)', fontWeight: 500,
                  textTransform: 'none', letterSpacing: 0, marginLeft: 12,
                }}>
                  {fmt(dayRevenue[di].rev)} / {dayRevenue[di].athletes} athletes
                </span>
              </div>
              {day.sessions.map((session, si) => {
                const isEmpty = session.available || session.athletes.length === 0
                return (
                  <div key={si} style={{
                    display: 'flex', gap: 12, padding: '6px 0',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      fontSize: 12, color: 'var(--text-muted)', fontWeight: 500,
                      minWidth: 72, paddingTop: 2, fontVariantNumeric: 'tabular-nums',
                    }}>{session.time}</div>
                    <div style={{ flex: 1 }}>
                      {isEmpty ? (
                        <span style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 500 }}>
                          Open — {session.maxSpots || 6} spots
                          {session.note ? ` (${session.note})` : ''}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {session.athletes.map(a => a.name).join(', ')}
                          {session.athletes.length < 6 && (
                            <span style={{ color: 'var(--blue)', fontSize: 11, marginLeft: 6 }}>
                              +{6 - session.athletes.length} open
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: isEmpty ? 'var(--text-muted)' : 'var(--green)',
                      fontVariantNumeric: 'tabular-nums', minWidth: 50, textAlign: 'right',
                    }}>
                      {isEmpty ? '—' : fmt(session.athletes.reduce((s, a) => s + a.rate, 0))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Revenue connection summary */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
        marginBottom: 28, borderLeft: '3px solid var(--green)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Revenue breakdown
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{fmt(stats.weeklyRevenue)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per week</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{fmt(stats.monthlyRevenue)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per month (est.)</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{fmt(stats.monthlyRevenue * 12)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>annual (est.)</div>
          </div>
        </div>
        <div style={{
          marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{stats.totalAthletes}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>booked slots / wk</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue)' }}>{stats.availableSlots}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>open spots</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>
              {fmt(stats.availableSlots * 100)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>potential uplift / wk</div>
          </div>
        </div>
      </div>

      {/* Pending leads / pipeline */}
      <SectionHeader>Pipeline — pending leads ({pendingLeads.filter(l => l.status !== 'dead').length})</SectionHeader>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${pendingLeads.filter(l => l.status !== 'dead').length})` },
          { key: 'booked', label: `Booked (${leadCounts.booked})` },
          { key: 'warm', label: `Warm (${leadCounts.warm})` },
          { key: 'new', label: `New (${leadCounts.new})` },
          { key: 'cold', label: `Cold (${leadCounts.cold})` },
          { key: 'dead', label: `Dead (${leadCounts.dead})` },
        ].map(f => (
          <button key={f.key} onClick={() => setLeadFilter(f.key)} style={{
            padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${leadFilter === f.key ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 6,
            background: leadFilter === f.key ? 'var(--accent-dim)' : 'var(--bg-card)',
            color: leadFilter === f.key ? 'var(--accent)' : 'var(--text-muted)',
            fontFamily: 'var(--font)',
          }}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 6, marginBottom: 20 }}>
        {filteredLeads.map((lead, i) => {
          const s = statusColors[lead.status]
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '10px 14px',
              borderLeft: `3px solid ${s.border}`,
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', padding: '2px 6px',
                borderRadius: 4, background: s.bg, color: s.color,
                border: `1px solid ${s.border}40`,
                minWidth: 52, textAlign: 'center',
              }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                {lead.name}
              </span>
              {lead.note && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                  {lead.note}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
