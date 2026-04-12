import React, { useState, useMemo } from 'react'
import { MetricCard, MetricGrid, SectionHeader } from './components'
import { useStore } from './useStore'
import Modal, { FormField, Input, Select, Btn } from './Modal'

const fmt = n => '$' + Math.round(n).toLocaleString()

const dayColors = {
  Monday: '#3B82F6', Tuesday: '#8B5CF6', Wednesday: '#22C55E',
  Thursday: '#F59E0B', Friday: '#EF4444', Saturday: '#EC4899', Sunday: '#06B6D4',
}

const statusColors = {
  booked: { bg: 'var(--green-dim)', border: 'var(--green)', color: 'var(--green)', label: 'Booked' },
  warm: { bg: 'var(--accent-dim)', border: 'var(--accent)', color: 'var(--accent)', label: 'Warm' },
  new: { bg: 'var(--blue-dim)', border: 'var(--blue)', color: 'var(--blue)', label: 'New' },
  cold: { bg: 'var(--red-dim)', border: 'var(--red)', color: 'var(--red)', label: 'Cold' },
  dead: { bg: '#52525b18', border: '#52525b', color: '#71717a', label: 'Dead' },
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Timetable() {
  const store = useStore()
  const { schedule, leads, athletes, usingFallback, loading } = store

  const [view, setView] = useState('grid')
  const [leadFilter, setLeadFilter] = useState('all')

  // Modals
  const [sessionModal, setSessionModal] = useState(null)   // null | { editing session } | {}
  const [assignModal, setAssignModal] = useState(null)      // null | { sessionId, sessionTime, day }
  const [leadModal, setLeadModal] = useState(null)          // null | { editing lead } | {}
  const [athleteModal, setAthleteModal] = useState(null)    // null | { editing athlete } | {}
  const [busy, setBusy] = useState(false)

  // ─── Computed stats ────────────────────────────────
  const stats = useMemo(() => {
    let totalSessions = 0, totalAthletes = 0, weeklyRevenue = 0
    let availableSlots = 0, filledSlots = 0
    schedule.forEach(day => {
      day.sessions.forEach(s => {
        totalSessions++
        const count = s.athletes.length
        totalAthletes += count
        s.athletes.forEach(a => { weeklyRevenue += (a.rate || 100) })
        const max = s.maxSpots || 6
        if (s.available && count === 0) {
          availableSlots += max
        } else {
          filledSlots += count
          availableSlots += Math.max(0, max - count)
        }
      })
    })
    return {
      totalSessions, totalAthletes, weeklyRevenue,
      monthlyRevenue: weeklyRevenue * (44 / 12),
      availableSlots, filledSlots,
      fillRate: (filledSlots + availableSlots) > 0
        ? (filledSlots / (filledSlots + availableSlots)) * 100 : 0,
    }
  }, [schedule])

  const dayRevenue = useMemo(() => {
    return schedule.map(day => {
      let rev = 0, ath = 0
      day.sessions.forEach(s => s.athletes.forEach(a => { rev += (a.rate || 100); ath++ }))
      return { day: day.day, rev, athletes: ath, sessions: day.sessions.length }
    })
  }, [schedule])

  const maxDayRev = Math.max(...dayRevenue.map(d => d.rev), 1)

  const filteredLeads = useMemo(() => {
    if (leadFilter === 'all') return leads.filter(l => l.status !== 'dead')
    return leads.filter(l => l.status === leadFilter)
  }, [leads, leadFilter])

  const leadCounts = useMemo(() => {
    const c = { booked: 0, warm: 0, new: 0, cold: 0, dead: 0 }
    leads.forEach(l => c[l.status]++)
    return c
  }, [leads])

  // ─── Handlers ──────────────────────────────────────
  const handleSaveSession = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const fd = new FormData(e.target)
      await store.saveSession({
        ...(sessionModal?.id ? { id: sessionModal.id } : {}),
        day_of_week: fd.get('day'),
        time_slot: fd.get('time'),
        max_spots: parseInt(fd.get('max_spots')) || 6,
        is_available: fd.get('is_available') === 'on',
        note: fd.get('note') || null,
        sort_order: parseInt(fd.get('sort_order')) || 0,
      })
      setSessionModal(null)
    } catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleAssign = async (athleteId) => {
    if (!assignModal) return
    setBusy(true)
    try {
      await store.assignAthlete(assignModal.sessionId, athleteId)
      setAssignModal(null)
    } catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleUnassign = async (sessionId, athleteId) => {
    if (!confirm('Remove athlete from this session?')) return
    setBusy(true)
    try { await store.unassignAthlete(sessionId, athleteId) }
    catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleSaveLead = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const fd = new FormData(e.target)
      await store.saveLead({
        ...(leadModal?.id ? { id: leadModal.id } : {}),
        name: fd.get('name'),
        note: fd.get('note') || null,
        status: fd.get('status'),
      })
      setLeadModal(null)
    } catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleDeleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return
    setBusy(true)
    try { await store.removeLead(id) }
    catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleSaveAthlete = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const fd = new FormData(e.target)
      await store.saveAthlete({
        ...(athleteModal?.id ? { id: athleteModal.id } : {}),
        name: fd.get('name'),
        rate: parseInt(fd.get('rate')) || 100,
        notes: fd.get('notes') || null,
      })
      setAthleteModal(null)
    } catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleDeleteAthlete = async (id) => {
    if (!confirm('Delete this athlete? They will be removed from all sessions.')) return
    setBusy(true)
    try { await store.removeAthlete(id) }
    catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const handleDeleteSession = async (id) => {
    if (!confirm('Delete this session?')) return
    setBusy(true)
    try { await store.removeSession(id) }
    catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>

  return (
    <div>
      {usingFallback && (
        <div style={{
          background: 'var(--accent-dim)', border: '1px solid var(--accent)',
          borderRadius: 'var(--radius)', padding: '10px 16px', marginBottom: 16,
          fontSize: 12, color: 'var(--accent)',
        }}>
          Supabase tables not found — showing static data. Run the migration SQL to enable editing.
        </div>
      )}

      {/* Top-line metrics */}
      <MetricGrid>
        <MetricCard label="Weekly revenue" value={fmt(stats.weeklyRevenue)} color="var(--green)" delay={0} />
        <MetricCard label="Monthly (est.)" value={fmt(stats.monthlyRevenue)} color="var(--green)" delay={50} />
        <MetricCard label="Sessions / wk" value={stats.totalSessions} delay={100} />
        <MetricCard label="Athlete slots" value={stats.totalAthletes} delay={150} />
        <MetricCard label="Open spots" value={stats.availableSlots} color="var(--blue)" delay={200} />
        <MetricCard label="Fill rate" value={stats.fillRate.toFixed(0) + '%'} color="var(--accent)" delay={250} />
      </MetricGrid>

      {/* Revenue by day */}
      <SectionHeader>Revenue by day</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 28 }}>
        {dayRevenue.map(d => (
          <div key={d.day} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '12px 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dayColors[d.day] }}>
              {d.day.slice(0, 3).toUpperCase()}
            </div>
            <div style={{
              width: 24, borderRadius: 4, background: 'var(--border)',
              height: 80, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: `${(d.rev / maxDayRev) * 100}%`,
                background: dayColors[d.day], borderRadius: 4,
                transition: 'height 0.4s ease', opacity: 0.85,
              }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(d.rev)}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.athletes} athletes</div>
          </div>
        ))}
      </div>

      {/* Timetable header + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SectionHeader>Weekly timetable</SectionHeader>
        <div style={{ display: 'flex', gap: 6 }}>
          {!usingFallback && (
            <Btn variant="primary" onClick={() => setSessionModal({})} style={{ fontSize: 11, padding: '5px 12px' }}>
              + Session
            </Btn>
          )}
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

      {/* Timetable grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
        gap: 12, marginBottom: 28,
      }}>
        {schedule.map((day, di) => (
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
              <span style={{ fontSize: 13, fontWeight: 700, color: dayColors[day.day] }}>{day.day}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                {day.sessions.reduce((s, ses) => s + ses.athletes.length, 0)} athletes
                {view === 'list' && ` · ${fmt(dayRevenue[di].rev)}`}
              </span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {day.sessions.length === 0 && (
                <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                  No sessions
                </div>
              )}
              {day.sessions.map((session, si) => {
                const isEmpty = (session.available && session.athletes.length === 0)
                const isFull = session.athletes.length >= (session.maxSpots || 6)
                return (
                  <div key={session.id || si} style={{
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
                              fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
                              cursor: !usingFallback ? 'pointer' : 'default',
                            }}
                              onClick={() => {
                                if (!usingFallback && session.id) handleUnassign(session.id, a.id)
                              }}
                              title={!usingFallback ? 'Click to remove' : ''}
                            >
                              {a.name}
                              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 2 }}>
                                ${a.rate}
                              </span>
                            </span>
                          ))}
                          {!isFull && session.athletes.length > 0 && (
                            <span style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 500, opacity: 0.8, alignSelf: 'center' }}>
                              +{(session.maxSpots || 6) - session.athletes.length} open
                            </span>
                          )}
                        </div>
                      )}
                      {session.note && !isEmpty && (
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{session.note}</div>
                      )}
                    </div>
                    {/* Session actions */}
                    {!usingFallback && session.id && (
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button onClick={() => setAssignModal({ sessionId: session.id, sessionTime: session.time, day: day.day })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--blue)', padding: '2px 4px' }}
                          title="Add athlete">+</button>
                        <button onClick={() => setSessionModal({
                          id: session.id, day: day.day, time: session.time,
                          max_spots: session.maxSpots, is_available: session.available,
                          note: session.note, sort_order: session.sort_order,
                        })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', padding: '2px 4px' }}
                          title="Edit session">✎</button>
                        <button onClick={() => handleDeleteSession(session.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--red)', padding: '2px 4px', opacity: 0.6 }}
                          title="Delete session">✕</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
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
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{fmt(stats.weeklyRevenue * 44)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>annual (44 wks)</div>
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
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmt(stats.availableSlots * 100)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>potential uplift / wk</div>
          </div>
        </div>
      </div>

      {/* Athletes roster */}
      {!usingFallback && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionHeader>Athletes ({athletes.length})</SectionHeader>
            <Btn variant="primary" onClick={() => setAthleteModal({})} style={{ fontSize: 11, padding: '5px 12px' }}>
              + Athlete
            </Btn>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 8, marginBottom: 28,
          }}>
            {athletes.map(a => (
              <div key={a.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--green)' }}>${a.rate}/session</div>
                  {a.notes && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{a.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setAthleteModal(a)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', padding: '2px 6px' }}>✎</button>
                  <button onClick={() => handleDeleteAthlete(a.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--red)', padding: '2px 6px', opacity: 0.6 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Leads pipeline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <SectionHeader>Pipeline — pending leads ({leads.filter(l => l.status !== 'dead').length})</SectionHeader>
        {!usingFallback && (
          <Btn variant="primary" onClick={() => setLeadModal({})} style={{ fontSize: 11, padding: '5px 12px' }}>
            + Lead
          </Btn>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${leads.filter(l => l.status !== 'dead').length})` },
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
          const s = statusColors[lead.status] || statusColors.new
          return (
            <div key={lead.id || i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '10px 14px',
              borderLeft: `3px solid ${s.border}`,
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', padding: '2px 6px',
                borderRadius: 4, background: s.bg, color: s.color,
                border: `1px solid ${s.border}40`, minWidth: 52, textAlign: 'center',
              }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                {lead.name}
              </span>
              {lead.note && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', flex: 1 }}>
                  {lead.note}
                </span>
              )}
              {!usingFallback && (
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => setLeadModal(lead)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', padding: '2px 6px' }}>✎</button>
                  <button onClick={() => handleDeleteLead(lead.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--red)', padding: '2px 6px', opacity: 0.6 }}>✕</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── SESSION MODAL ─── */}
      <Modal open={!!sessionModal} onClose={() => setSessionModal(null)}
        title={sessionModal?.id ? 'Edit session' : 'New session'}>
        <form onSubmit={handleSaveSession}>
          <FormField label="Day">
            <Select name="day" defaultValue={sessionModal?.day || 'Monday'}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </FormField>
          <FormField label="Time slot">
            <Input name="time" placeholder="e.g. 5:30 PM" defaultValue={sessionModal?.time || ''} required />
          </FormField>
          <FormField label="Max spots">
            <Input name="max_spots" type="number" defaultValue={sessionModal?.max_spots || 6} min={1} max={20} />
          </FormField>
          <FormField label="Sort order">
            <Input name="sort_order" type="number" defaultValue={sessionModal?.sort_order || 0} />
          </FormField>
          <FormField label="Note">
            <Input name="note" placeholder="e.g. Seniors session" defaultValue={sessionModal?.note || ''} />
          </FormField>
          <FormField label="Available / open slot">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" name="is_available" defaultChecked={sessionModal?.is_available || false} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Mark as available (empty slot)</span>
            </label>
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <Btn type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</Btn>
            <Btn variant="ghost" type="button" onClick={() => setSessionModal(null)}>Cancel</Btn>
          </div>
        </form>
      </Modal>

      {/* ─── ASSIGN ATHLETE MODAL ─── */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)}
        title={`Add athlete to ${assignModal?.day} ${assignModal?.sessionTime}`}>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {athletes.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: 12 }}>
              No athletes yet. Create one first.
            </div>
          )}
          {athletes.map(a => (
            <div key={a.id} onClick={() => handleAssign(a.id)} style={{
              padding: '10px 12px', cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</span>
              <span style={{ fontSize: 11, color: 'var(--green)' }}>${a.rate}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* ─── LEAD MODAL ─── */}
      <Modal open={!!leadModal} onClose={() => setLeadModal(null)}
        title={leadModal?.id ? 'Edit lead' : 'New lead'}>
        <form onSubmit={handleSaveLead}>
          <FormField label="Name">
            <Input name="name" placeholder="Lead name" defaultValue={leadModal?.name || ''} required />
          </FormField>
          <FormField label="Status">
            <Select name="status" defaultValue={leadModal?.status || 'new'}>
              <option value="booked">Booked</option>
              <option value="warm">Warm</option>
              <option value="new">New</option>
              <option value="cold">Cold</option>
              <option value="dead">Dead</option>
            </Select>
          </FormField>
          <FormField label="Note">
            <Input name="note" placeholder="Follow-up details..." defaultValue={leadModal?.note || ''} />
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <Btn type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</Btn>
            <Btn variant="ghost" type="button" onClick={() => setLeadModal(null)}>Cancel</Btn>
          </div>
        </form>
      </Modal>

      {/* ─── ATHLETE MODAL ─── */}
      <Modal open={!!athleteModal} onClose={() => setAthleteModal(null)}
        title={athleteModal?.id ? 'Edit athlete' : 'New athlete'}>
        <form onSubmit={handleSaveAthlete}>
          <FormField label="Name">
            <Input name="name" placeholder="Athlete name" defaultValue={athleteModal?.name || ''} required />
          </FormField>
          <FormField label="Rate ($ per session)">
            <Input name="rate" type="number" defaultValue={athleteModal?.rate || 100} min={0} />
          </FormField>
          <FormField label="Notes">
            <Input name="notes" placeholder="Any notes..." defaultValue={athleteModal?.notes || ''} />
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <Btn type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</Btn>
            <Btn variant="ghost" type="button" onClick={() => setAthleteModal(null)}>Cancel</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
