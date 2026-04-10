-- Seed script: populate ambition tables with existing timetable data
-- Run this AFTER the migration

-- ─── Athletes ────────────────────────────────────────
INSERT INTO ambition_athletes (name, rate) VALUES
  ('Jess', 100), ('Isaac', 90), ('Joseph', 100), ('Mason', 100),
  ('Paul Lee', 150), ('George', 100), ('Alessio', 100), ('Cassius', 100),
  ('Oscar', 90), ('Marley', 90), ('Ariana', 90), ('Juvaan', 100),
  ('Lucas', 100), ('James', 100), ('Dino', 100), ('Hugo', 100),
  ('Mohammed', 100), ('Tristan', 90), ('Sofia', 100), ('Natalia', 100),
  ('Stefan', 100), ('Dom', 100), ('Jamie''s', 100), ('Dyl', 100),
  ('Sel', 100), ('Noah', 90), ('Ali', 100), ('Maksim', 80),
  ('Marco', 100), ('Mohamed', 100), ('Mahmoud', 100), ('Braith', 100),
  ('Xavi', 100), ('Luka', 100), ('Yousef', 100), ('DeAndre', 90),
  ('Zoey', 90), ('Jacob', 100), ('Hassan', 100), ('Jude', 100),
  ('Olive', 100), ('Ziggy', 100), ('Hass Daughter', 100),
  ('Khalid', 100), ('Clayton', 100), ('Tyson', 120),
  ('Chloe (Paul''s)', 100), ('Leo', 100), ('Joey', 100),
  ('Lachie', 100), ('Rahman', 100), ('Archie', 100),
  ('Paul (Svetlana''s)', 160)
ON CONFLICT DO NOTHING;

-- ─── Sessions ────────────────────────────────────────
-- Monday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots) VALUES
  ('Monday', '4:30 PM', 10, true, 6),
  ('Monday', '5:30 PM', 20, false, 6),
  ('Monday', '5:50 PM', 30, false, 6),
  ('Monday', '6:50 PM', 40, true, 6);

-- Tuesday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots, note) VALUES
  ('Tuesday', '12:00 PM', 50, false, 6, 'Seniors session'),
  ('Tuesday', '4:00 PM', 60, false, 6, NULL),
  ('Tuesday', '5:10 PM', 70, false, 6, NULL),
  ('Tuesday', '6:20 PM', 80, false, 6, NULL);

-- Wednesday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots) VALUES
  ('Wednesday', '4:30 PM', 90, false, 6),
  ('Wednesday', '5:40 PM', 100, false, 6),
  ('Wednesday', '4:30 PM ⚽', 105, false, 6),
  ('Wednesday', '6:50 PM', 110, false, 6);

-- Thursday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots, note) VALUES
  ('Thursday', '12:00 PM', 120, true, 6, 'Seniors session'),
  ('Thursday', '3:30 PM', 130, false, 6, NULL),
  ('Thursday', '5:00 PM', 140, false, 6, NULL),
  ('Thursday', '6:10 PM', 150, true, 6, NULL);

-- Friday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots) VALUES
  ('Friday', '4:30 PM', 160, false, 6),
  ('Friday', '4:40 PM', 170, false, 6),
  ('Friday', '5:30 PM', 180, false, 6),
  ('Friday', '6:50 PM', 190, true, 6);

-- Saturday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots) VALUES
  ('Saturday', '9:20 AM', 200, false, 6),
  ('Saturday', '10:30 AM', 210, false, 6),
  ('Saturday', '12:00 PM', 220, false, 6),
  ('Saturday', '1:20 PM', 230, true, 6);

-- Sunday
INSERT INTO ambition_sessions (day_of_week, time_slot, sort_order, is_available, max_spots) VALUES
  ('Sunday', '9:20 AM', 240, true, 6),
  ('Sunday', '10:30 AM', 250, false, 6),
  ('Sunday', '11:30 AM', 260, false, 6),
  ('Sunday', '1:00 PM', 270, true, 6);

-- ─── Session Athletes (junction) ─────────────────────
-- This uses subqueries to match by name + time slot

-- Monday 5:30 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:30 PM' AND s.day_of_week = 'Monday' AND a.name = 'Jess';
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:30 PM' AND s.day_of_week = 'Monday' AND a.name = 'Isaac';
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:30 PM' AND s.day_of_week = 'Monday' AND a.name = 'Joseph';

-- Monday 5:50 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:50 PM' AND s.day_of_week = 'Monday' AND a.name = 'Mason';

-- Tuesday 12:00 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '12:00 PM' AND s.day_of_week = 'Tuesday' AND a.name = 'Paul Lee';

-- Tuesday 4:00 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '4:00 PM' AND s.day_of_week = 'Tuesday' AND a.name IN ('George', 'Alessio', 'Cassius');

-- Tuesday 5:10 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:10 PM' AND s.day_of_week = 'Tuesday' AND a.name IN ('Oscar', 'Marley', 'Ariana', 'Juvaan', 'Lucas');

-- Tuesday 6:20 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '6:20 PM' AND s.day_of_week = 'Tuesday' AND a.name IN ('James', 'Dino', 'Hugo', 'Isaac', 'Mohammed');

-- Wednesday 4:30 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '4:30 PM' AND s.day_of_week = 'Wednesday' AND a.name IN ('Tristan', 'Isaac', 'Sofia', 'Natalia', 'Stefan', 'Dom');

-- Wednesday 5:40 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:40 PM' AND s.day_of_week = 'Wednesday' AND a.name IN ('Jamie''s', 'Dyl', 'Sel', 'Noah', 'Ali', 'Maksim');

-- Wednesday 4:30 PM ⚽
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '4:30 PM ⚽' AND s.day_of_week = 'Wednesday' AND a.name = 'Marco';

-- Wednesday 6:50 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '6:50 PM' AND s.day_of_week = 'Wednesday' AND a.name IN ('Mohamed', 'Mahmoud', 'Braith');

-- Thursday 3:30 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '3:30 PM' AND s.day_of_week = 'Thursday' AND a.name = 'Isaac';

-- Thursday 5:00 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:00 PM' AND s.day_of_week = 'Thursday' AND a.name IN ('Xavi', 'Mason', 'Luka', 'Yousef', 'DeAndre');

-- Friday 4:30 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '4:30 PM' AND s.day_of_week = 'Friday' AND a.name IN ('Zoey', 'Jacob', 'Ali', 'Hassan');

-- Friday 4:40 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '4:40 PM' AND s.day_of_week = 'Friday' AND a.name IN ('Jude', 'James', 'Olive', 'Ziggy', 'Xavi');

-- Friday 5:30 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '5:30 PM' AND s.day_of_week = 'Friday' AND a.name IN ('Joseph', 'Ali', 'Hass Daughter', 'Mohamed');

-- Saturday 9:20 AM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '9:20 AM' AND s.day_of_week = 'Saturday' AND a.name IN ('Khalid', 'Mohammed', 'Clayton');

-- Saturday 10:30 AM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '10:30 AM' AND s.day_of_week = 'Saturday' AND a.name IN ('Stefan', 'Mason', 'Tristan', 'Marco', 'Tyson', 'Chloe (Paul''s)');

-- Saturday 12:00 PM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '12:00 PM' AND s.day_of_week = 'Saturday' AND a.name IN ('Lucas', 'Jacob', 'Leo', 'Joey', 'Jude');

-- Sunday 10:30 AM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '10:30 AM' AND s.day_of_week = 'Sunday' AND a.name IN ('Lachie', 'James', 'Rahman', 'Archie', 'Hassan');

-- Sunday 11:30 AM
INSERT INTO ambition_session_athletes (session_id, athlete_id)
SELECT s.id, a.id FROM ambition_sessions s, ambition_athletes a
WHERE s.time_slot = '11:30 AM' AND s.day_of_week = 'Sunday' AND a.name = 'Paul (Svetlana''s)';

-- ─── Leads ───────────────────────────────────────────
INSERT INTO ambition_leads (name, note, status) VALUES
  ('Andrew Cam', 'Paid 10th April — 1pm 10/4 Strathfield', 'booked'),
  ('Shane Curl', '4/4 assessment 2:30pm', 'booked'),
  ('Omar', 'Assessment 4/4 1:20pm', 'booked'),
  ('Kim Glossop', 'Booked', 'booked'),
  ('Cherrie Drigo', 'Booked in for 29/3', 'booked'),
  ('Daniel Borg', 'Message back Thursday for assessment session 2/4', 'warm'),
  ('Elesha Mason', 'Call on 1 of April', 'warm'),
  ('Antonios Arsenio', 'Call back on the 18th of April', 'warm'),
  ('Stephen Zahr', 'Call back on 6/4', 'warm'),
  ('Angela', 'Call on 1/4', 'warm'),
  ('Belinda Long Jetty', 'Touch base back 2/4 — kid plays at Wanderers', 'warm'),
  ('Borello', 'Check DM in 3 days', 'warm'),
  ('Barry', 'Called — trying to find days', 'warm'),
  ('Hass Hijazi', 'IG haven''t DM''d yet', 'warm'),
  ('Troy Son', NULL, 'new'),
  ('Trent Son', NULL, 'new'),
  ('Alex Stephenson', NULL, 'new'),
  ('David Moir', NULL, 'new'),
  ('Sam Cricket', NULL, 'new'),
  ('Ray Elmasri', NULL, 'new'),
  ('Navin', NULL, 'new'),
  ('Tom Casey', NULL, 'new'),
  ('Khalid Elwan', 'Canberra', 'new'),
  ('Alex Ehsani', NULL, 'new'),
  ('Joe Malvisto', NULL, 'new'),
  ('Perverndren Naidoo', NULL, 'new'),
  ('Ally', 'Called no pick up', 'cold'),
  ('Andry', 'Called no pick up', 'cold'),
  ('Pita', 'Low lead', 'cold'),
  ('David Son Dully', 'Dead', 'dead');
