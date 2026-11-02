-- =====================================================================
-- COLLEGE ARTS FESTIVAL MANAGEMENT SYSTEM (KALOLSAVAM)
-- Comprehensive PostgreSQL Schema with RLS and Audit Triggers
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FESTIVALS TABLE (Multi-edition support)
CREATE TABLE IF NOT EXISTS festivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    edition TEXT NOT NULL,
    year INTEGER NOT NULL,
    theme TEXT,
    description TEXT,
    college_name TEXT NOT NULL DEFAULT 'Victoria Government College',
    banner_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED')) DEFAULT 'ACTIVE',
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#e11d48',
    bg_gradient TEXT NOT NULL DEFAULT 'from-rose-500 to-red-700',
    badge_icon TEXT NOT NULL DEFAULT 'Flame',
    motto TEXT,
    captain_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_team_code_per_festival UNIQUE (festival_id, code)
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_category_slug_per_festival UNIQUE (festival_id, slug)
);

-- 4. POINT RULES TABLE (Configurable scoring per festival)
CREATE TABLE IF NOT EXISTS point_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    first_place_points NUMERIC(6,2) NOT NULL DEFAULT 5.0,
    second_place_points NUMERIC(6,2) NOT NULL DEFAULT 3.0,
    third_place_points NUMERIC(6,2) NOT NULL DEFAULT 1.0,
    grade_a_points NUMERIC(6,2) NOT NULL DEFAULT 5.0,
    grade_b_points NUMERIC(6,2) NOT NULL DEFAULT 3.0,
    grade_c_points NUMERIC(6,2) NOT NULL DEFAULT 1.0,
    group_multiplier NUMERIC(6,2) NOT NULL DEFAULT 2.0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_point_rule_per_festival UNIQUE (festival_id)
);

-- 5. STUDENTS TABLE (Admin-only management, unique ID like AF2026-001)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    class_grade TEXT NOT NULL,
    course TEXT NOT NULL,
    department TEXT NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_id_per_festival UNIQUE (festival_id, student_id)
);

-- 6. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('INDIVIDUAL', 'GROUP')) DEFAULT 'INDIVIDUAL',
    min_participants INTEGER NOT NULL DEFAULT 1,
    max_participants INTEGER NOT NULL DEFAULT 1,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    stage_number TEXT,
    coordinator_name TEXT,
    coordinator_phone TEXT,
    rules TEXT,
    status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED')) DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_event_code_per_festival UNIQUE (festival_id, code)
);

-- 7. EVENT REGISTRATIONS (Individual Participants)
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    chest_number TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('CONFIRMED', 'DISQUALIFIED', 'WITHDRAWN')) DEFAULT 'CONFIRMED',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_per_event UNIQUE (event_id, student_id)
);

-- 8. GROUP EVENT TEAMS (Squads created by Admin for group competitions)
CREATE TABLE IF NOT EXISTS group_event_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    group_name TEXT NOT NULL,
    chest_number TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('CONFIRMED', 'DISQUALIFIED', 'WITHDRAWN')) DEFAULT 'CONFIRMED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_chest_per_event UNIQUE (event_id, chest_number)
);

-- 9. GROUP EVENT MEMBERS (Members assigned to a group squad)
CREATE TABLE IF NOT EXISTS group_event_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_team_id UUID NOT NULL REFERENCES group_event_teams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Performer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_in_group UNIQUE (group_team_id, student_id)
);

-- 10. RESULTS TABLE (Scores & Grades)
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES event_registrations(id) ON DELETE CASCADE,
    group_team_id UUID REFERENCES group_event_teams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    position INTEGER CHECK (position IN (1, 2, 3)),
    grade TEXT CHECK (grade IN ('A', 'B', 'C', 'PARTICIPATION')),
    position_points NUMERIC(6,2) NOT NULL DEFAULT 0.0,
    grade_points NUMERIC(6,2) NOT NULL DEFAULT 0.0,
    total_points NUMERIC(6,2) NOT NULL DEFAULT 0.0,
    remarks TEXT,
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED')) DEFAULT 'DRAFT',
    published_at TIMESTAMPTZ,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    venue TEXT NOT NULL,
    stage_number TEXT,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ON_TIME', 'DELAYED', 'RESCHEDULED', 'COMPLETED')) DEFAULT 'ON_TIME',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. GALLERY ALBUMS TABLE
CREATE TABLE IF NOT EXISTS gallery_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. GALLERY MEDIA TABLE
CREATE TABLE IF NOT EXISTS gallery_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO')) DEFAULT 'IMAGE',
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('GENERAL', 'SCHEDULE_CHANGE', 'RESULT_ALERT', 'URGENT')) DEFAULT 'GENERAL',
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. ADMIN PROFILES & ROLES
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'EVENT_COORDINATOR', 'SCORE_MANAGER')) DEFAULT 'EVENT_COORDINATOR',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. ADMIN EVENT ASSIGNMENTS
CREATE TABLE IF NOT EXISTS admin_event_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin_profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_admin_event UNIQUE (admin_id, event_id)
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID REFERENCES festivals(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_students_festival ON students(festival_id);
CREATE INDEX IF NOT EXISTS idx_students_team ON students(team_id);
CREATE INDEX IF NOT EXISTS idx_events_festival ON events(festival_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON event_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_results_event ON results(event_id);
CREATE INDEX IF NOT EXISTS idx_results_status ON results(status);
CREATE INDEX IF NOT EXISTS idx_announcements_festival ON announcements(festival_id, is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_festival ON gallery_media(festival_id, is_published);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_event_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_event_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ-ONLY POLICIES
CREATE POLICY "Public can view active festivals" ON festivals FOR SELECT USING (true);
CREATE POLICY "Public can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view point rules" ON point_rules FOR SELECT USING (true);
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view event participants" ON event_registrations FOR SELECT USING (status = 'CONFIRMED');
CREATE POLICY "Public can view group squads" ON group_event_teams FOR SELECT USING (status = 'CONFIRMED');
CREATE POLICY "Public can view group members" ON group_event_members FOR SELECT USING (true);
CREATE POLICY "Public can view published results only" ON results FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public can view schedules" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public can view published albums" ON gallery_albums FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published media" ON gallery_media FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view students for scoreboards" ON students FOR SELECT USING (true);

-- ADMIN FULL ACCESS POLICIES
CREATE POLICY "Authenticated users manage festivals" ON festivals FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage teams" ON teams FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage point rules" ON point_rules FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage students" ON students FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage events" ON events FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage registrations" ON event_registrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage group teams" ON group_event_teams FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage group members" ON group_event_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage results" ON results FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage schedules" ON schedules FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage albums" ON gallery_albums FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage media" ON gallery_media FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage announcements" ON announcements FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage admin profiles" ON admin_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage assignments" ON admin_event_assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users manage audit logs" ON audit_logs FOR ALL TO authenticated USING (true);

