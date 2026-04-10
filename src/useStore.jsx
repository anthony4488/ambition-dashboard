import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as db from './supabase'
import { schedule as staticSchedule, pendingLeads as staticLeads } from './data'

const Ctx = createContext()

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Transform Supabase sessions into the grouped-by-day format the UI expects
function groupSessions(raw) {
  const byDay = {}
  DAY_ORDER.forEach(d => { byDay[d] = [] })

  raw.forEach(s => {
    const athletes = (s.ambition_session_athletes || []).map(sa => ({
      junctionId: sa.id,
      id: sa.ambition_athletes?.id,
      name: sa.ambition_athletes?.name || '?',
      rate: sa.ambition_athletes?.rate || 100,
    }))
    const entry = {
      id: s.id,
      time: s.time_slot,
      athletes,
      maxSpots: s.max_spots || 6,
      available: s.is_available,
      note: s.note || '',
      sort_order: s.sort_order,
    }
    if (byDay[s.day_of_week]) byDay[s.day_of_week].push(entry)
  })

  return DAY_ORDER.map(day => ({ day, sessions: byDay[day] }))
}

export function StoreProvider({ children }) {
  const [athletes, setAthletes] = useState([])
  const [sessions, setSessions] = useState([])  // raw from supabase
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [a, s, l] = await Promise.all([
        db.fetchAthletes(),
        db.fetchSessions(),
        db.fetchLeads(),
      ])
      setAthletes(a)
      setSessions(s)
      setLeads(l)
      setUsingFallback(false)
    } catch (e) {
      console.warn('Supabase unavailable, using static data:', e.message)
      setError(e.message)
      setUsingFallback(true)
      // Fall back to static data so the dashboard still works
      setAthletes([])
      setSessions([])
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Grouped schedule for timetable display
  const schedule = usingFallback
    ? staticSchedule
    : groupSessions(sessions)

  const leadsList = usingFallback ? staticLeads : leads

  // ─── Athlete CRUD ──────────────────────────────────
  const saveAthlete = async (athlete) => {
    const result = await db.upsertAthlete(athlete)
    await load()
    return result
  }
  const removeAthlete = async (id) => {
    await db.deleteAthlete(id)
    await load()
  }

  // ─── Session CRUD ──────────────────────────────────
  const saveSession = async (session) => {
    const result = await db.upsertSession(session)
    await load()
    return result
  }
  const removeSession = async (id) => {
    await db.deleteSession(id)
    await load()
  }
  const assignAthlete = async (sessionId, athleteId) => {
    await db.addAthleteToSession(sessionId, athleteId)
    await load()
  }
  const unassignAthlete = async (sessionId, athleteId) => {
    await db.removeAthleteFromSession(sessionId, athleteId)
    await load()
  }

  // ─── Lead CRUD ─────────────────────────────────────
  const saveLead = async (lead) => {
    const result = await db.upsertLead(lead)
    await load()
    return result
  }
  const removeLead = async (id) => {
    await db.deleteLead(id)
    await load()
  }

  return (
    <Ctx.Provider value={{
      athletes, schedule, leads: leadsList, loading, error, usingFallback,
      reload: load,
      saveAthlete, removeAthlete,
      saveSession, removeSession, assignAthlete, unassignAthlete,
      saveLead, removeLead,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStore() { return useContext(Ctx) }
