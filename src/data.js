export const schedule = [
  {
    day: 'Monday', sessions: [
      { time: '4:30 PM', athletes: [], maxSpots: 6, available: true },
      { time: '5:30 PM', athletes: [
        { name: 'Jess', rate: 100 }, { name: 'Jess', rate: 100 },
        { name: 'Isaac', rate: 90 }, { name: 'Joseph', rate: 100 }
      ]},
      { time: '5:50 PM', athletes: [
        { name: 'Mason', rate: 100 }, { name: 'Isaac ⚽', rate: 90 }
      ]},
      { time: '6:50 PM', athletes: [], maxSpots: 6, available: true },
    ]
  },
  {
    day: 'Tuesday', sessions: [
      { time: '12:00 PM', athletes: [{ name: 'Paul Lee', rate: 150 }], maxSpots: 6, note: 'Seniors session' },
      { time: '4:00 PM', athletes: [
        { name: 'George', rate: 100 }, { name: 'Alessio', rate: 100 },
        { name: 'Cassius', rate: 100 }
      ]},
      { time: '5:10 PM', athletes: [
        { name: 'Oscar', rate: 90 }, { name: 'Marley', rate: 90 },
        { name: 'Ariana', rate: 90 }, { name: 'Juvaan', rate: 100 },
        { name: 'Lucas', rate: 100 }
      ]},
      { time: '6:20 PM', athletes: [
        { name: 'James', rate: 100 }, { name: 'Dino', rate: 100 },
        { name: 'Hugo', rate: 100 }, { name: 'Isaac', rate: 90 },
        { name: 'Mohammed', rate: 100 }
      ]},
    ]
  },
  {
    day: 'Wednesday', sessions: [
      { time: '4:30 PM', athletes: [
        { name: 'Tristan', rate: 90 }, { name: 'Isaac', rate: 90 },
        { name: 'Sofia', rate: 100 }, { name: 'Natalia', rate: 100 },
        { name: 'Stefan', rate: 100 }, { name: 'Dom', rate: 100 }
      ]},
      { time: '5:40 PM', athletes: [
        { name: "Jamie's", rate: 100 }, { name: 'Dyl', rate: 100 },
        { name: 'Sel', rate: 100 }, { name: 'Noah', rate: 90 },
        { name: 'Ali', rate: 100 }, { name: 'Maksim', rate: 80 }
      ]},
      { time: '4:30 PM ⚽', athletes: [{ name: 'Marco ⚽', rate: 100 }] },
      { time: '6:50 PM', athletes: [
        { name: 'Mohamed', rate: 100 }, { name: 'Mahmoud', rate: 100 },
        { name: 'Braith', rate: 100 }
      ]},
    ]
  },
  {
    day: 'Thursday', sessions: [
      { time: '12:00 PM', athletes: [], maxSpots: 6, available: true, note: 'Seniors session' },
      { time: '3:30 PM', athletes: [{ name: 'Isaac', rate: 90 }] },
      { time: '5:00 PM', athletes: [
        { name: 'Xavi', rate: 100 }, { name: 'Mason', rate: 100 },
        { name: 'Luka', rate: 100 }, { name: 'Yousef', rate: 100 },
        { name: 'DeAndre', rate: 90 }
      ]},
      { time: '6:10 PM', athletes: [], maxSpots: 6, available: true },
    ]
  },
  {
    day: 'Friday', sessions: [
      { time: '4:30 PM', athletes: [
        { name: 'Zoey', rate: 90 }, { name: 'Jacob', rate: 100 },
        { name: 'Ali', rate: 100 }, { name: 'Hassan', rate: 100 }
      ]},
      { time: '4:40 PM', athletes: [
        { name: 'Jude', rate: 100 }, { name: 'James', rate: 100 },
        { name: 'Olive', rate: 100 }, { name: 'Ziggy', rate: 100 },
        { name: 'Xavi ⚽', rate: 100 }
      ]},
      { time: '5:30 PM', athletes: [
        { name: 'Joseph', rate: 100 }, { name: 'Ali', rate: 100 },
        { name: 'Hass Daughter', rate: 100 }, { name: 'Ali', rate: 100 },
        { name: 'Mohamed', rate: 100 }
      ]},
      { time: '6:50 PM', athletes: [], maxSpots: 6, available: true },
    ]
  },
  {
    day: 'Saturday', sessions: [
      { time: '9:20 AM', athletes: [
        { name: 'Khalid', rate: 100 }, { name: 'Mohammed', rate: 100 },
        { name: 'Clayton', rate: 100 }
      ]},
      { time: '10:30 AM', athletes: [
        { name: 'Stefan', rate: 100 }, { name: 'Mason', rate: 100 },
        { name: 'Tristan', rate: 90 }, { name: 'Marco', rate: 100 },
        { name: 'Tyson', rate: 120 }, { name: "Chloe (Paul's)", rate: 100 }
      ]},
      { time: '12:00 PM', athletes: [
        { name: 'Lucas', rate: 100 }, { name: 'Jacob', rate: 90 },
        { name: 'Leo', rate: 100 }, { name: 'Joey', rate: 100 },
        { name: 'Jude', rate: 100 }
      ]},
      { time: '1:20 PM', athletes: [], maxSpots: 6, available: true },
    ]
  },
  {
    day: 'Sunday', sessions: [
      { time: '9:20 AM', athletes: [], maxSpots: 6, available: true },
      { time: '10:30 AM', athletes: [
        { name: 'Lachie', rate: 100 }, { name: 'James', rate: 100 },
        { name: 'Rahman', rate: 100 }, { name: 'Archie', rate: 100 },
        { name: 'Hassan', rate: 100 }
      ]},
      { time: '11:30 AM', athletes: [{ name: "Paul (Svetlana's)", rate: 160 }] },
      { time: '1:00 PM', athletes: [], maxSpots: 6, available: true },
    ]
  },
]

export const pendingLeads = [
  { name: 'Andrew Cam', note: 'Paid 10th April — 1pm 10/4 Strathfield', status: 'booked' },
  { name: 'Shane Curl', note: '4/4 assessment 2:30pm', status: 'booked' },
  { name: 'Omar', note: 'Assessment 4/4 1:20pm', status: 'booked' },
  { name: 'Kim Glossop', note: 'Booked', status: 'booked' },
  { name: 'Cherrie Drigo', note: 'Booked in for 29/3', status: 'booked' },
  { name: 'Daniel Borg', note: 'Message back Thursday for assessment session 2/4', status: 'warm' },
  { name: 'Elesha Mason', note: 'Call on 1 of April', status: 'warm' },
  { name: 'Antonios Arsenio', note: 'Call back on the 18th of April', status: 'warm' },
  { name: 'Stephen Zahr', note: 'Call back on 6/4', status: 'warm' },
  { name: 'Angela', note: 'Call on 1/4', status: 'warm' },
  { name: 'Belinda Long Jetty', note: 'Touch base back 2/4 — kid plays at Wanderers', status: 'warm' },
  { name: 'Borello', note: 'Check DM in 3 days', status: 'warm' },
  { name: 'Barry', note: 'Called — trying to find days', status: 'warm' },
  { name: 'Hass Hijazi', note: 'IG haven\'t DM\'d yet', status: 'warm' },
  { name: 'Troy Son', note: '', status: 'new' },
  { name: 'Trent Son', note: '', status: 'new' },
  { name: 'Alex Stephenson', note: '', status: 'new' },
  { name: 'David Moir', note: '', status: 'new' },
  { name: 'Sam Cricket', note: '', status: 'new' },
  { name: 'Ray Elmasri', note: '', status: 'new' },
  { name: 'Navin', note: '', status: 'new' },
  { name: 'Tom Casey', note: '', status: 'new' },
  { name: 'Khalid Elwan', note: 'Canberra', status: 'new' },
  { name: 'Alex Ehsani', note: '', status: 'new' },
  { name: 'Joe Malvisto', note: '', status: 'new' },
  { name: 'Perverndren Naidoo', note: '', status: 'new' },
  { name: 'Ally', note: 'Called no pick up', status: 'cold' },
  { name: 'Andry', note: 'Called no pick up', status: 'cold' },
  { name: 'Pita', note: 'Low lead', status: 'cold' },
  { name: 'David Son Dully', note: 'Dead', status: 'dead' },
]

// Helper: compute timetable stats
export function getTimetableStats() {
  let totalSessions = 0
  let totalAthletes = 0
  let weeklyRevenue = 0
  let availableSlots = 0
  let filledSlots = 0
  const maxPerSession = 6

  schedule.forEach(day => {
    day.sessions.forEach(session => {
      totalSessions++
      const count = session.athletes.length
      totalAthletes += count
      session.athletes.forEach(a => { weeklyRevenue += a.rate })
      if (session.available) {
        availableSlots += (session.maxSpots || maxPerSession)
      } else {
        filledSlots += count
        availableSlots += Math.max(0, maxPerSession - count)
      }
    })
  })

  return {
    totalSessions,
    totalAthletes,
    weeklyRevenue,
    monthlyRevenue: weeklyRevenue * (44 / 12),
    availableSlots,
    filledSlots,
    fillRate: totalSessions > 0 ? (filledSlots / (filledSlots + availableSlots)) * 100 : 0,
  }
}
