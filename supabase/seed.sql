-- =====================================================================
-- COLLEGE ARTS FESTIVAL (KALOLSAVAM) SEED DATA
-- Dhwani 2026 & Historical Utsav 2025 Data
-- =====================================================================

-- 1. Insert Festival Editions
INSERT INTO festivals (id, name, edition, year, theme, description, college_name, banner_url, start_date, end_date, status, is_current)
VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'DHWANI 2026',
    '38th Edition',
    2026,
    'Echoes of Heritage, Rhythms of Tomorrow',
    'The premier inter-department cultural festival celebrating creative arts, literature, dance, music, and dramatic performances.',
    'Victoria State Arts & Science College',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '4 days',
    'ACTIVE',
    true
),
(
    'a0000000-0000-0000-0000-000000000002',
    'UTSAV 2025',
    '37th Edition',
    2025,
    'Canvas of Expressions',
    'Annual cultural fest showcasing creative brilliance across visual arts, literature, and live stage arts.',
    'Victoria State Arts & Science College',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    '2025-02-10',
    '2025-02-14',
    'COMPLETED',
    false
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Teams for DHWANI 2026
INSERT INTO teams (id, festival_id, name, code, color, bg_gradient, badge_icon, motto, captain_name)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Ruby Phoenix', 'RUBY', '#e11d48', 'from-rose-500 to-red-700', 'Flame', 'Ignite the Stage, Conquer the Realm', 'Aadhavan Nair'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Emerald Dragons', 'EMERALD', '#059669', 'from-emerald-500 to-teal-700', 'Shield', 'Rooted in Tradition, Soaring in Glory', 'Fathima Zahra'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Sapphire Titans', 'SAPPHIRE', '#2563eb', 'from-blue-500 to-indigo-700', 'Zap', 'Waves of Artistry, Boundless Vision', 'Rohit George'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Topaz Knights', 'TOPAZ', '#d97706', 'from-amber-500 to-orange-700', 'Crown', 'Golden Valor, Unmatched Elegance', 'Ananya Menon')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Categories for DHWANI 2026
INSERT INTO categories (id, festival_id, name, slug, description, image_url, display_order)
VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Chithrolsavam', 'chithrolsavam', 'Visual arts, painting, charcoal sketching, poster design, and sculpture.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', 1),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Sahithyolsavam', 'sahithyolsavam', 'Literary competitions including poetry, short story, essay writing, and debates in English and Malayalam.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', 2),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Stage Events', 'stage-events', 'High-energy live performances: classical dance, cinematic dance, mime, drama, and light music.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Point Rules for DHWANI 2026
INSERT INTO point_rules (id, festival_id, first_place_points, second_place_points, third_place_points, grade_a_points, grade_b_points, grade_c_points, group_multiplier, is_active)
VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 5.0, 3.0, 1.0, 5.0, 3.0, 1.0, 2.0, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Students
INSERT INTO students (id, festival_id, student_id, full_name, class_grade, course, department, team_id, gender, email, phone)
VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'AF2026-001', 'Aarav Krishna', '3rd Year', 'B.Sc Computer Science', 'Computer Science', 'b0000000-0000-0000-0000-000000000001', 'MALE', 'aarav@college.edu', '9847000001'),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'AF2026-002', 'Diya Lakshmi', '2nd Year', 'B.A. English Literature', 'Humanities', 'b0000000-0000-0000-0000-000000000001', 'FEMALE', 'diya@college.edu', '9847000002'),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'AF2026-003', 'Bilal Mansoor', '3rd Year', 'B.Com Finance', 'Commerce', 'b0000000-0000-0000-0000-000000000002', 'MALE', 'bilal@college.edu', '9847000003'),
('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'AF2026-004', 'Kavya S. Pillai', '1st Year PG', 'M.A. Malayalam', 'Malayalam', 'b0000000-0000-0000-0000-000000000002', 'FEMALE', 'kavya@college.edu', '9847000004'),
('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'AF2026-005', 'Gautam Varma', '2nd Year', 'B.Sc Physics', 'Physics', 'b0000000-0000-0000-0000-000000000003', 'MALE', 'gautam@college.edu', '9847000005'),
('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'AF2026-006', 'Sneha Rachel', '3rd Year', 'B.Sc Chemistry', 'Chemistry', 'b0000000-0000-0000-0000-000000000003', 'FEMALE', 'sneha@college.edu', '9847000006'),
('e0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'AF2026-007', 'Naveen Kumar', '1st Year', 'B.A. Economics', 'Economics', 'b0000000-0000-0000-0000-000000000004', 'MALE', 'naveen@college.edu', '9847000007'),
('e0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'AF2026-008', 'Meera Nandini', '3rd Year', 'B.Sc Mathematics', 'Mathematics', 'b0000000-0000-0000-0000-000000000004', 'FEMALE', 'meera@college.edu', '9847000008')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Events
INSERT INTO events (id, festival_id, category_id, code, name, description, event_type, min_participants, max_participants, date, start_time, end_time, venue, stage_number, coordinator_name, coordinator_phone, status, rules)
VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'CH-01',
    'Water Color Painting',
    'On-the-spot water color painting based on a surprise environmental theme.',
    'INDIVIDUAL',
    1, 1,
    CURRENT_DATE,
    '09:30 AM', '12:00 PM',
    'Fine Arts Studio A',
    'Hall 1',
    'Prof. K. Rajendran', '9847111222',
    'COMPLETED',
    'Duration: 2.5 hours. Standard drawing sheets provided. Water colors and brushes must be brought by participant.'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'CH-02',
    'Pencil Sketching',
    'Live portrait and landscape pencil sketching competition.',
    'INDIVIDUAL',
    1, 1,
    CURRENT_DATE,
    '02:00 PM', '04:00 PM',
    'Fine Arts Studio B',
    'Hall 2',
    'Dr. Maya Balan', '9847222333',
    'COMPLETED',
    'Only graphite and charcoal pencils allowed. No mechanical stencils or tracing.'
),
(
    'f0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'SA-01',
    'Short Story Writing (Malayalam)',
    'Original creative prose writing on an announced topic.',
    'INDIVIDUAL',
    1, 1,
    CURRENT_DATE,
    '10:00 AM', '12:00 PM',
    'Seminar Hall 2',
    'Room 204',
    'Dr. Vinod Narayanan', '9847333444',
    'COMPLETED',
    'Maximum word limit: 2000 words. Topic given 10 minutes prior to competition.'
),
(
    'f0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'SA-02',
    'Elocution (English)',
    'Persuasive speech contest evaluating rhetoric, diction, and presence.',
    'INDIVIDUAL',
    1, 1,
    CURRENT_DATE + 1,
    '11:00 AM', '01:00 PM',
    'Language Lab',
    'Room 102',
    'Prof. Sarah Mathew', '9847444555',
    'SCHEDULED',
    'Time limit: 5 minutes + 1 minute warning bell. No notes or papers allowed during speech.'
),
(
    'f0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'ST-01',
    'Bharatanatyam',
    'Solo classical Indian dance presentation adhering to traditional margam.',
    'INDIVIDUAL',
    1, 1,
    CURRENT_DATE,
    '05:00 PM', '08:30 PM',
    'Main Open-Air Auditorium',
    'Stage 1',
    'Smt. Deepa Padmanabhan', '9847555666',
    'COMPLETED',
    'Maximum duration: 15 minutes. Pure classical costume and makeup mandatory.'
),
(
    'f0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'ST-02',
    'Mime (Group Competition)',
    'Silent theatrical enactment focusing on social themes with mime makeup.',
    'GROUP',
    4, 6,
    CURRENT_DATE + 1,
    '03:00 PM', '06:00 PM',
    'Main Open-Air Auditorium',
    'Stage 1',
    'Prof. Harikrishnan R', '9847666777',
    'SCHEDULED',
    'Group size: 4-6 students. Maximum time: 8 minutes. Background audio track allowed without vocal lyrics.'
)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Registrations (Individual)
INSERT INTO event_registrations (id, festival_id, event_id, student_id, team_id, chest_number, status)
VALUES
('00000000-0000-0000-0000-000000000101', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '101', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000102', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', '102', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000103', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', '103', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000104', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', '104', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000105', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', '201', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000106', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', '202', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000107', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', '203', 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;

-- 8. Group Event Squads & Members
INSERT INTO group_event_teams (id, festival_id, event_id, team_id, group_name, chest_number, status)
VALUES
('00000000-0000-0000-0000-000000000201', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Phoenix Silent Mimes', 'G-10', 'CONFIRMED'),
('00000000-0000-0000-0000-000000000202', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'Emerald Drama Guild', 'G-11', 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;

-- 9. Published Results
INSERT INTO results (id, festival_id, event_id, registration_id, student_id, team_id, position, grade, position_points, grade_points, total_points, remarks, status, published_at, created_by)
VALUES
-- Water Color Painting Results (1st: Diya, 2nd: Bilal, 3rd: Gautam)
('90000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 1, 'A', 5.0, 5.0, 10.0, 'Masterful landscape wash and composition.', 'PUBLISHED', NOW(), 'admin@fest.org'),
('90000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 2, 'A', 3.0, 5.0, 8.0, 'Vivid color gradient and technique.', 'PUBLISHED', NOW(), 'admin@fest.org'),
('90000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 3, 'B', 1.0, 3.0, 4.0, 'Expressive tonal control.', 'PUBLISHED', NOW(), 'admin@fest.org'),

-- Bharatanatyam Results (1st: Kavya, 2nd: Diya, 3rd: Meera)
('90000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000106', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 1, 'A', 5.0, 5.0, 10.0, 'Exquisite bhavam and rhythm precision.', 'PUBLISHED', NOW(), 'admin@fest.org'),
('90000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000105', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 2, 'A', 3.0, 5.0, 8.0, 'Splendid footwork and mudra clarity.', 'PUBLISHED', NOW(), 'admin@fest.org'),
('90000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000107', 'e0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 3, 'B', 1.0, 3.0, 4.0, 'Graceful execution.', 'PUBLISHED', NOW(), 'admin@fest.org')
ON CONFLICT (id) DO NOTHING;

-- 10. Schedules
INSERT INTO schedules (id, festival_id, event_id, venue, stage_number, date, start_time, end_time, status, notes)
VALUES
('80000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Fine Arts Studio A', 'Hall 1', CURRENT_DATE, '09:30 AM', '12:00 PM', 'COMPLETED', 'Event concluded smoothly.'),
('80000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002', 'Fine Arts Studio B', 'Hall 2', CURRENT_DATE, '02:00 PM', '04:00 PM', 'COMPLETED', 'Result evaluation under review.'),
('80000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', 'Seminar Hall 2', 'Room 204', CURRENT_DATE, '10:00 AM', '12:00 PM', 'COMPLETED', 'Papers submitted to judges.'),
('80000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000004', 'Language Lab', 'Room 102', CURRENT_DATE + 1, '11:00 AM', '01:00 PM', 'ON_TIME', 'Reporting time 10:30 AM.'),
('80000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', 'Main Open-Air Auditorium', 'Stage 1', CURRENT_DATE, '05:00 PM', '08:30 PM', 'COMPLETED', 'Grand classical evening event.'),
('80000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000006', 'Main Open-Air Auditorium', 'Stage 1', CURRENT_DATE + 1, '03:00 PM', '06:00 PM', 'ON_TIME', 'Sound setup verification at 2:00 PM.')
ON CONFLICT (id) DO NOTHING;

-- 11. Announcements
INSERT INTO announcements (id, festival_id, title, content, category, is_pinned, is_published)
VALUES
(
    '70000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Dhwani 2026 Officially Inaugurated!',
    'The 38th Annual College Arts Festival Dhwani 2026 was inaugurated with a grand lighting ceremony. Over 45 events across 3 vibrant categories begin today!',
    'GENERAL',
    true,
    true
),
(
    '70000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Results Declared: Water Color Painting & Bharatanatyam',
    'Official scores and grade points for Water Color Painting (CH-01) and Bharatanatyam (ST-01) are published. Check the Live Leaderboard for updated team standings.',
    'RESULT_ALERT',
    false,
    true
),
(
    '70000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Mime Competition Reporting Guidelines',
    'All participating group squads for Mime (ST-02) scheduled tomorrow at 3:00 PM on Stage 1 must report to Stage Greenroom A by 1:30 PM for chest number verification.',
    'SCHEDULE_CHANGE',
    false,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 12. Gallery Albums & Media
INSERT INTO gallery_albums (id, festival_id, title, description, cover_image_url, is_published)
VALUES
(
    '60000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Inauguration & Mega Stage Performances',
    'Highlights from the vibrant inaugural procession, ceremonial lamp lighting, and classical stage dance.',
    'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
    true
),
(
    '60000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Chithrolsavam Fine Arts Gallery',
    'Captivating visual expressions in water color, oil canvas, and live charcoal sketching.',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80',
    true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO gallery_media (id, album_id, festival_id, media_type, media_url, caption, is_featured, is_published, sort_order)
VALUES
('50000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'IMAGE', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', 'Inaugural lamp lighting and musical prelude', true, true, 1),
('50000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'IMAGE', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80', 'Breathtaking Bharatanatyam performance on Main Stage 1', true, true, 2),
('50000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'IMAGE', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80', 'Artists deep in concentration at Water Color competition', true, true, 1),
('50000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'IMAGE', 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80', 'Pencil portrait showcase on day 1', false, true, 2)
ON CONFLICT (id) DO NOTHING;

-- 13. Admin Profiles
INSERT INTO admin_profiles (id, email, full_name, role, avatar_url)
VALUES
('40000000-0000-0000-0000-000000000001', 'admin@fest.org', 'Chief Festival Controller', 'SUPER_ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
('40000000-0000-0000-0000-000000000002', 'coordinator@fest.org', 'Stage Operations Officer', 'EVENT_COORDINATOR', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
('40000000-0000-0000-0000-000000000003', 'scores@fest.org', 'Lead Tabulation Officer', 'SCORE_MANAGER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')
ON CONFLICT (id) DO NOTHING;

