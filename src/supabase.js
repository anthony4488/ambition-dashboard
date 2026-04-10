import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Athletes ────────────────────────────────────────────
export async function fetchAthletes() {
  const { data, error } = await supabase
    .from('ambition_athletes')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function upsertAthlete(athlete) {
  const { data, error } = await supabase
    .from('ambition_athletes')
    .upsert(athlete, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAthlete(id) {
  const { error } = await supabase.from('ambition_athletes').delete().eq('id', id)
  if (error) throw error
}

// ─── Sessions ────────────────────────────────────────────
export async function fetchSessions() {
  const { data, error } = await supabase
    .from('ambition_sessions')
    .select(`
      *,
      ambition_session_athletes (
        id,
        athlete_id,
        ambition_athletes ( id, name, rate )
      )
    `)
    .order('sort_order')
  if (error) throw error
  return data
}

export async function upsertSession(session) {
  const { data, error } = await supabase
    .from('ambition_sessions')
    .upsert(session, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSession(id) {
  const { error } = await supabase.from('ambition_sessions').delete().eq('id', id)
  if (error) throw error
}

export async function addAthleteToSession(sessionId, athleteId) {
  const { error } = await supabase
    .from('ambition_session_athletes')
    .insert({ session_id: sessionId, athlete_id: athleteId })
  if (error) throw error
}

export async function removeAthleteFromSession(sessionId, athleteId) {
  const { error } = await supabase
    .from('ambition_session_athletes')
    .delete()
    .eq('session_id', sessionId)
    .eq('athlete_id', athleteId)
  if (error) throw error
}

// ─── Leads ───────────────────────────────────────────────
export async function fetchLeads() {
  const { data, error } = await supabase
    .from('ambition_leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function upsertLead(lead) {
  const { data, error } = await supabase
    .from('ambition_leads')
    .upsert(lead, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteLead(id) {
  const { error } = await supabase.from('ambition_leads').delete().eq('id', id)
  if (error) throw error
}
