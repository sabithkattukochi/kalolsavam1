import {
  Festival,
  Team,
  Category,
  PointRule,
  Student,
  FestivalEvent,
  EventRegistration,
  GroupEventTeam,
  GroupEventMember,
  EventResult,
  FestivalSchedule,
  GalleryAlbum,
  GalleryMedia,
  Announcement,
  AdminProfile,
  AuditLog,
  TeamLeaderboardItem,
  StudentLeaderboardItem,
} from '@/types/database';
import { calculateResultPoints, computeTeamLeaderboard, computeStudentLeaderboard } from './points-calculator';
import { getSupabaseBrowserClient } from './supabase/client';

// Initial Mock/Seed Store Data
const INITIAL_FESTIVALS: Festival[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'DHWANI 2026',
    edition: '38th Edition',
    year: 2026,
    theme: 'Echoes of Heritage, Rhythms of Tomorrow',
    description:
      'The premier inter-department cultural festival celebrating creative arts, literature, dance, music, and dramatic performances.',
    college_name: 'Victoria State Arts & Science College',
    banner_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    is_current: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'UTSAV 2025',
    edition: '37th Edition',
    year: 2025,
    theme: 'Canvas of Expressions',
    description: 'Annual cultural fest showcasing creative brilliance across visual arts, literature, and live stage arts.',
    college_name: 'Victoria State Arts & Science College',
    banner_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    start_date: '2025-02-10',
    end_date: '2025-02-14',
    status: 'COMPLETED',
    is_current: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z',
  },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Ruby Phoenix',
    code: 'RUBY',
    color: '#e11d48',
    bg_gradient: 'from-rose-500 to-red-700',
    badge_icon: 'Flame',
    motto: 'Ignite the Stage, Conquer the Realm',
    captain_name: 'Aadhavan Nair',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Emerald Dragons',
    code: 'EMERALD',
    color: '#059669',
    bg_gradient: 'from-emerald-500 to-teal-700',
    badge_icon: 'Shield',
    motto: 'Rooted in Tradition, Soaring in Glory',
    captain_name: 'Fathima Zahra',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Sapphire Titans',
    code: 'SAPPHIRE',
    color: '#2563eb',
    bg_gradient: 'from-blue-500 to-indigo-700',
    badge_icon: 'Zap',
    motto: 'Waves of Artistry, Boundless Vision',
    captain_name: 'Rohit George',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Topaz Knights',
    code: 'TOPAZ',
    color: '#d97706',
    bg_gradient: 'from-amber-500 to-orange-700',
    badge_icon: 'Crown',
    motto: 'Golden Valor, Unmatched Elegance',
    captain_name: 'Ananya Menon',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Chithrolsavam',
    slug: 'chithrolsavam',
    description: 'Visual arts, painting, charcoal sketching, poster design, and sculpture.',
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Sahithyolsavam',
    slug: 'sahithyolsavam',
    description: 'Literary competitions including poetry, short story, essay writing, and debates in English and Malayalam.',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Stage Events',
    slug: 'stage-events',
    description: 'High-energy live performances: classical dance, cinematic dance, mime, drama, and light music.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_POINT_RULES: PointRule[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    first_place_points: 5.0,
    second_place_points: 3.0,
    third_place_points: 1.0,
    grade_a_points: 5.0,
    grade_b_points: 3.0,
    grade_c_points: 1.0,
    group_multiplier: 2.0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-001',
    full_name: 'Aarav Krishna',
    class_grade: '3rd Year',
    course: 'B.Sc Computer Science',
    department: 'Computer Science',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    gender: 'MALE',
    email: 'aarav@college.edu',
    phone: '9847000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-002',
    full_name: 'Diya Lakshmi',
    class_grade: '2nd Year',
    course: 'B.A. English Literature',
    department: 'Humanities',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    gender: 'FEMALE',
    email: 'diya@college.edu',
    phone: '9847000002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-003',
    full_name: 'Bilal Mansoor',
    class_grade: '3rd Year',
    course: 'B.Com Finance',
    department: 'Commerce',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    gender: 'MALE',
    email: 'bilal@college.edu',
    phone: '9847000003',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-004',
    full_name: 'Kavya S. Pillai',
    class_grade: '1st Year PG',
    course: 'M.A. Malayalam',
    department: 'Malayalam',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    gender: 'FEMALE',
    email: 'kavya@college.edu',
    phone: '9847000004',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-005',
    full_name: 'Gautam Varma',
    class_grade: '2nd Year',
    course: 'B.Sc Physics',
    department: 'Physics',
    team_id: 'b0000000-0000-0000-0000-000000000003',
    gender: 'MALE',
    email: 'gautam@college.edu',
    phone: '9847000005',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000006',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-006',
    full_name: 'Sneha Rachel',
    class_grade: '3rd Year',
    course: 'B.Sc Chemistry',
    department: 'Chemistry',
    team_id: 'b0000000-0000-0000-0000-000000000003',
    gender: 'FEMALE',
    email: 'sneha@college.edu',
    phone: '9847000006',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000007',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-007',
    full_name: 'Naveen Kumar',
    class_grade: '1st Year',
    course: 'B.A. Economics',
    department: 'Economics',
    team_id: 'b0000000-0000-0000-0000-000000000004',
    gender: 'MALE',
    email: 'naveen@college.edu',
    phone: '9847000007',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e0000000-0000-0000-0000-000000000008',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    student_id: 'AF2026-008',
    full_name: 'Meera Nandini',
    class_grade: '3rd Year',
    course: 'B.Sc Mathematics',
    department: 'Mathematics',
    team_id: 'b0000000-0000-0000-0000-000000000004',
    gender: 'FEMALE',
    email: 'meera@college.edu',
    phone: '9847000008',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const INITIAL_EVENTS: FestivalEvent[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    code: 'CH-01',
    name: 'Water Color Painting',
    description: 'On-the-spot water color painting based on a surprise environmental theme.',
    event_type: 'INDIVIDUAL',
    min_participants: 1,
    max_participants: 1,
    date: todayStr,
    start_time: '09:30 AM',
    end_time: '12:00 PM',
    venue: 'Fine Arts Studio A',
    stage_number: 'Hall 1',
    coordinator_name: 'Prof. K. Rajendran',
    coordinator_phone: '9847111222',
    rules: 'Duration: 2.5 hours. Standard drawing sheets provided. Water colors and brushes must be brought by participant.',
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    code: 'CH-02',
    name: 'Pencil Sketching',
    description: 'Live portrait and landscape pencil sketching competition.',
    event_type: 'INDIVIDUAL',
    min_participants: 1,
    max_participants: 1,
    date: todayStr,
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    venue: 'Fine Arts Studio B',
    stage_number: 'Hall 2',
    coordinator_name: 'Dr. Maya Balan',
    coordinator_phone: '9847222333',
    rules: 'Only graphite and charcoal pencils allowed. No mechanical stencils or tracing.',
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f0000000-0000-0000-0000-000000000003',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    code: 'SA-01',
    name: 'Short Story Writing (Malayalam)',
    description: 'Original creative prose writing on an announced topic.',
    event_type: 'INDIVIDUAL',
    min_participants: 1,
    max_participants: 1,
    date: todayStr,
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    venue: 'Seminar Hall 2',
    stage_number: 'Room 204',
    coordinator_name: 'Dr. Vinod Narayanan',
    coordinator_phone: '9847333444',
    rules: 'Maximum word limit: 2000 words. Topic given 10 minutes prior to competition.',
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f0000000-0000-0000-0000-000000000004',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    code: 'SA-02',
    name: 'Elocution (English)',
    description: 'Persuasive speech contest evaluating rhetoric, diction, and presence.',
    event_type: 'INDIVIDUAL',
    min_participants: 1,
    max_participants: 1,
    date: tomorrowStr,
    start_time: '11:00 AM',
    end_time: '01:00 PM',
    venue: 'Language Lab',
    stage_number: 'Room 102',
    coordinator_name: 'Prof. Sarah Mathew',
    coordinator_phone: '9847444555',
    rules: 'Time limit: 5 minutes + 1 minute warning bell. No notes or papers allowed during speech.',
    status: 'SCHEDULED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f0000000-0000-0000-0000-000000000005',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    code: 'ST-01',
    name: 'Bharatanatyam',
    description: 'Solo classical Indian dance presentation adhering to traditional margam.',
    event_type: 'INDIVIDUAL',
    min_participants: 1,
    max_participants: 1,
    date: todayStr,
    start_time: '05:00 PM',
    end_time: '08:30 PM',
    venue: 'Main Open-Air Auditorium',
    stage_number: 'Stage 1',
    coordinator_name: 'Smt. Deepa Padmanabhan',
    coordinator_phone: '9847555666',
    rules: 'Maximum duration: 15 minutes. Pure classical costume and makeup mandatory.',
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f0000000-0000-0000-0000-000000000006',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    code: 'ST-02',
    name: 'Mime (Group Competition)',
    description: 'Silent theatrical enactment focusing on social themes with mime makeup.',
    event_type: 'GROUP',
    min_participants: 4,
    max_participants: 6,
    date: tomorrowStr,
    start_time: '03:00 PM',
    end_time: '06:00 PM',
    venue: 'Main Open-Air Auditorium',
    stage_number: 'Stage 1',
    coordinator_name: 'Prof. Harikrishnan R',
    coordinator_phone: '9847666777',
    rules: 'Group size: 4-6 students. Maximum time: 8 minutes. Background audio track allowed without vocal lyrics.',
    status: 'SCHEDULED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    student_id: 'e0000000-0000-0000-0000-000000000001',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    chest_number: '101',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    student_id: 'e0000000-0000-0000-0000-000000000003',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    chest_number: '102',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    student_id: 'e0000000-0000-0000-0000-000000000005',
    team_id: 'b0000000-0000-0000-0000-000000000003',
    chest_number: '103',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000104',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    student_id: 'e0000000-0000-0000-0000-000000000007',
    team_id: 'b0000000-0000-0000-0000-000000000004',
    chest_number: '104',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000105',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    student_id: 'e0000000-0000-0000-0000-000000000002',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    chest_number: '201',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000106',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    student_id: 'e0000000-0000-0000-0000-000000000004',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    chest_number: '202',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000107',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    student_id: 'e0000000-0000-0000-0000-000000000008',
    team_id: 'b0000000-0000-0000-0000-000000000004',
    chest_number: '203',
    status: 'CONFIRMED',
    registered_at: new Date().toISOString(),
  },
];

const INITIAL_GROUP_TEAMS: GroupEventTeam[] = [
  {
    id: '00000000-0000-0000-0000-000000000201',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000006',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    group_name: 'Phoenix Silent Mimes',
    chest_number: 'G-10',
    status: 'CONFIRMED',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000202',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000006',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    group_name: 'Emerald Drama Guild',
    chest_number: 'G-11',
    status: 'CONFIRMED',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_GROUP_MEMBERS: GroupEventMember[] = [
  {
    id: 'm-1',
    group_team_id: '00000000-0000-0000-0000-000000000201',
    student_id: 'e0000000-0000-0000-0000-000000000001',
    role: 'Lead',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-2',
    group_team_id: '00000000-0000-0000-0000-000000000201',
    student_id: 'e0000000-0000-0000-0000-000000000002',
    role: 'Performer',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-3',
    group_team_id: '00000000-0000-0000-0000-000000000202',
    student_id: 'e0000000-0000-0000-0000-000000000003',
    role: 'Lead',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-4',
    group_team_id: '00000000-0000-0000-0000-000000000202',
    student_id: 'e0000000-0000-0000-0000-000000000004',
    role: 'Performer',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_RESULTS: EventResult[] = [
  // Water Color Painting
  {
    id: '90000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    registration_id: '00000000-0000-0000-0000-000000000101',
    group_team_id: null,
    student_id: 'e0000000-0000-0000-0000-000000000001',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    position: 1,
    grade: 'A',
    position_points: 5.0,
    grade_points: 5.0,
    total_points: 10.0,
    remarks: 'Masterful landscape wash and composition.',
    status: 'PUBLISHED',
    published_at: new Date().toISOString(),
    created_by: 'admin@fest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '90000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    registration_id: '00000000-0000-0000-0000-000000000102',
    group_team_id: null,
    student_id: 'e0000000-0000-0000-0000-000000000003',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    position: 2,
    grade: 'A',
    position_points: 3.0,
    grade_points: 5.0,
    total_points: 8.0,
    remarks: 'Vivid color gradient and technique.',
    status: 'PUBLISHED',
    published_at: new Date().toISOString(),
    created_by: 'admin@fest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '90000000-0000-0000-0000-000000000003',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    registration_id: '00000000-0000-0000-0000-000000000103',
    group_team_id: null,
    student_id: 'e0000000-0000-0000-0000-000000000005',
    team_id: 'b0000000-0000-0000-0000-000000000003',
    position: 3,
    grade: 'B',
    position_points: 1.0,
    grade_points: 3.0,
    total_points: 4.0,
    remarks: 'Expressive tonal control.',
    status: 'PUBLISHED',
    published_at: new Date().toISOString(),
    created_by: 'admin@fest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Bharatanatyam
  {
    id: '90000000-0000-0000-0000-000000000004',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    registration_id: '00000000-0000-0000-0000-000000000106',
    group_team_id: null,
    student_id: 'e0000000-0000-0000-0000-000000000004',
    team_id: 'b0000000-0000-0000-0000-000000000002',
    position: 1,
    grade: 'A',
    position_points: 5.0,
    grade_points: 5.0,
    total_points: 10.0,
    remarks: 'Exquisite bhavam and rhythm precision.',
    status: 'PUBLISHED',
    published_at: new Date().toISOString(),
    created_by: 'admin@fest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '90000000-0000-0000-0000-000000000005',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    registration_id: '00000000-0000-0000-0000-000000000105',
    group_team_id: null,
    student_id: 'e0000000-0000-0000-0000-000000000002',
    team_id: 'b0000000-0000-0000-0000-000000000001',
    position: 2,
    grade: 'A',
    position_points: 3.0,
    grade_points: 5.0,
    total_points: 8.0,
    remarks: 'Splendid footwork and mudra clarity.',
    status: 'PUBLISHED',
    published_at: new Date().toISOString(),
    created_by: 'admin@fest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '90000000-0000-0000-0000-000000000006',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    registration_id: '00000000-0000-0000-0000-000000000107',
    group_team_id: null,
    student_id: 'e0000000-0000-0000-0000-000000000008',
    team_id: 'b0000000-0000-0000-0000-000000000004',
    position: 3,
    grade: 'B',
    position_points: 1.0,
    grade_points: 3.0,
    total_points: 4.0,
    remarks: 'Graceful execution.',
    status: 'PUBLISHED',
    published_at: new Date().toISOString(),
    created_by: 'admin@fest.org',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_SCHEDULES: FestivalSchedule[] = [
  {
    id: '80000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    venue: 'Fine Arts Studio A',
    stage_number: 'Hall 1',
    date: todayStr,
    start_time: '09:30 AM',
    end_time: '12:00 PM',
    status: 'COMPLETED',
    notes: 'Concluded with 4 participating teams.',
    created_at: new Date().toISOString(),
  },
  {
    id: '80000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000002',
    venue: 'Fine Arts Studio B',
    stage_number: 'Hall 2',
    date: todayStr,
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    status: 'COMPLETED',
    notes: 'Result evaluation complete.',
    created_at: new Date().toISOString(),
  },
  {
    id: '80000000-0000-0000-0000-000000000004',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000004',
    venue: 'Language Lab',
    stage_number: 'Room 102',
    date: tomorrowStr,
    start_time: '11:00 AM',
    end_time: '01:00 PM',
    status: 'ON_TIME',
    notes: 'Reporting time 10:30 AM.',
    created_at: new Date().toISOString(),
  },
  {
    id: '80000000-0000-0000-0000-000000000005',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    venue: 'Main Open-Air Auditorium',
    stage_number: 'Stage 1',
    date: todayStr,
    start_time: '05:00 PM',
    end_time: '08:30 PM',
    status: 'COMPLETED',
    notes: 'Grand classical evening event.',
    created_at: new Date().toISOString(),
  },
  {
    id: '80000000-0000-0000-0000-000000000006',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000006',
    venue: 'Main Open-Air Auditorium',
    stage_number: 'Stage 1',
    date: tomorrowStr,
    start_time: '03:00 PM',
    end_time: '06:00 PM',
    status: 'ON_TIME',
    notes: 'Sound setup verification at 2:00 PM.',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '70000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Dhwani 2026 Officially Inaugurated!',
    content:
      'The 38th Annual College Arts Festival Dhwani 2026 was inaugurated with a grand lighting ceremony. Over 45 events across 3 vibrant categories begin today!',
    category: 'GENERAL',
    is_pinned: true,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '70000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Results Declared: Water Color Painting & Bharatanatyam',
    content:
      'Official scores and grade points for Water Color Painting (CH-01) and Bharatanatyam (ST-01) are published. Check the Live Leaderboard for updated team standings.',
    category: 'RESULT_ALERT',
    is_pinned: false,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '70000000-0000-0000-0000-000000000003',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Mime Competition Reporting Guidelines',
    content:
      'All participating group squads for Mime (ST-02) scheduled tomorrow at 3:00 PM on Stage 1 must report to Stage Greenroom A by 1:30 PM for chest number verification.',
    category: 'SCHEDULE_CHANGE',
    is_pinned: false,
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const INITIAL_ALBUMS: GalleryAlbum[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000005',
    title: 'Inauguration & Mega Stage Performances',
    description: 'Highlights from the vibrant inaugural procession, ceremonial lamp lighting, and classical stage dance.',
    cover_image_url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'f0000000-0000-0000-0000-000000000001',
    title: 'Chithrolsavam Fine Arts Gallery',
    description: 'Captivating visual expressions in water color, oil canvas, and live charcoal sketching.',
    cover_image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_MEDIA: GalleryMedia[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    album_id: '60000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    caption: 'Inaugural lamp lighting and musical prelude',
    is_featured: true,
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    album_id: '60000000-0000-0000-0000-000000000001',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    caption: 'Breathtaking Bharatanatyam performance on Main Stage 1',
    is_featured: true,
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    album_id: '60000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    caption: 'Artists deep in concentration at Water Color competition',
    is_featured: true,
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '50000000-0000-0000-0000-000000000004',
    album_id: '60000000-0000-0000-0000-000000000002',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    media_type: 'IMAGE',
    media_url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    caption: 'Pencil portrait showcase on day 1',
    is_featured: false,
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_ADMINS: AdminProfile[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    email: 'admin@fest.org',
    full_name: 'Dr. Anand Ramanathan',
    role: 'SUPER_ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    email: 'coordinator@fest.org',
    full_name: 'Prof. Geetha V.',
    role: 'EVENT_COORDINATOR',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    email: 'scores@fest.org',
    full_name: 'Markus Philip',
    role: 'SCORE_MANAGER',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    admin_email: 'admin@fest.org',
    action: 'PUBLISH_RESULT',
    entity_type: 'Result',
    entity_id: '90000000-0000-0000-0000-000000000001',
    details: { event: 'Water Color Painting', first_place: 'Aarav Krishna (Ruby Phoenix)' },
    created_at: new Date().toISOString(),
  },
  {
    id: 'audit-2',
    festival_id: 'a0000000-0000-0000-0000-000000000001',
    admin_email: 'scores@fest.org',
    action: 'PUBLISH_RESULT',
    entity_type: 'Result',
    entity_id: '90000000-0000-0000-0000-000000000004',
    details: { event: 'Bharatanatyam', first_place: 'Kavya S. Pillai (Emerald Dragons)' },
    created_at: new Date().toISOString(),
  },
];

// In-Memory / Local Storage state management
class DataStore {
  private festivals: Festival[] = [...INITIAL_FESTIVALS];
  private teams: Team[] = [...INITIAL_TEAMS];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private pointRules: PointRule[] = [...INITIAL_POINT_RULES];
  private students: Student[] = [...INITIAL_STUDENTS];
  private events: FestivalEvent[] = [...INITIAL_EVENTS];
  private registrations: EventRegistration[] = [...INITIAL_REGISTRATIONS];
  private groupTeams: GroupEventTeam[] = [...INITIAL_GROUP_TEAMS];
  private groupMembers: GroupEventMember[] = [...INITIAL_GROUP_MEMBERS];
  private results: EventResult[] = [...INITIAL_RESULTS];
  private schedules: FestivalSchedule[] = [...INITIAL_SCHEDULES];
  private announcements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
  private albums: GalleryAlbum[] = [...INITIAL_ALBUMS];
  private media: GalleryMedia[] = [...INITIAL_MEDIA];
  private admins: AdminProfile[] = [...INITIAL_ADMINS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  private currentAdmin: AdminProfile | null = INITIAL_ADMINS[0]; // Chief Festival Controller (Super Admin default)

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('kalolsavam_store_v1');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.festivals) this.festivals = data.festivals;
        if (data.teams) this.teams = data.teams;
        if (data.categories) this.categories = data.categories;
        if (data.pointRules) this.pointRules = data.pointRules;
        if (data.students) this.students = data.students;
        if (data.events) this.events = data.events;
        if (data.registrations) this.registrations = data.registrations;
        if (data.groupTeams) this.groupTeams = data.groupTeams;
        if (data.groupMembers) this.groupMembers = data.groupMembers;
        if (data.results) this.results = data.results;
        if (data.schedules) this.schedules = data.schedules;
        if (data.announcements) this.announcements = data.announcements;
        if (data.albums) this.albums = data.albums;
        if (data.media) this.media = data.media;
        if (data.admins) this.admins = data.admins;
        if (data.auditLogs) this.auditLogs = data.auditLogs;
      }
    } catch (e) {
      console.warn('Failed to parse stored kalolsavam state:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const state = {
        festivals: this.festivals,
        teams: this.teams,
        categories: this.categories,
        pointRules: this.pointRules,
        students: this.students,
        events: this.events,
        registrations: this.registrations,
        groupTeams: this.groupTeams,
        groupMembers: this.groupMembers,
        results: this.results,
        schedules: this.schedules,
        announcements: this.announcements,
        albums: this.albums,
        media: this.media,
        admins: this.admins,
        auditLogs: this.auditLogs,
      };
      localStorage.setItem('kalolsavam_store_v1', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist kalolsavam state:', e);
    }
  }

  // --- Session & Admin Auth ---
  getCurrentAdmin(): AdminProfile | null {
    return this.currentAdmin;
  }

  setCurrentAdmin(admin: AdminProfile | null) {
    this.currentAdmin = admin;
  }

  getAdmins(): AdminProfile[] {
    return [...this.admins];
  }

  loginAs(role: 'SUPER_ADMIN' | 'EVENT_COORDINATOR' | 'SCORE_MANAGER'): AdminProfile {
    const found = this.admins.find((a) => a.role === role) || this.admins[0];
    this.currentAdmin = found;
    return found;
  }

  // --- Festivals ---
  getFestivals(): Festival[] {
    return [...this.festivals];
  }

  getActiveFestival(): Festival {
    return this.festivals.find((f) => f.is_current) || this.festivals[0];
  }

  setActiveFestival(id: string): Festival {
    this.festivals = this.festivals.map((f) => ({
      ...f,
      is_current: f.id === id,
    }));
    this.saveToStorage();
    return this.getActiveFestival();
  }

  addFestival(festival: Omit<Festival, 'id' | 'created_at' | 'updated_at'>): Festival {
    const newFest: Festival = {
      ...festival,
      id: `fest-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.festivals.push(newFest);
    this.saveToStorage();
    return newFest;
  }

  // --- Teams ---
  getTeams(festivalId?: string): Team[] {
    const fId = festivalId || this.getActiveFestival().id;
    return this.teams.filter((t) => t.festival_id === fId);
  }

  addTeam(team: Omit<Team, 'id' | 'created_at'>): Team {
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.teams.push(newTeam);
    this.saveToStorage();
    this.logAudit('CREATE', 'Team', newTeam.id, { name: newTeam.name });
    return newTeam;
  }

  updateTeam(id: string, updates: Partial<Team>): Team {
    const idx = this.teams.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Team not found');
    this.teams[idx] = { ...this.teams[idx], ...updates };
    this.saveToStorage();
    this.logAudit('UPDATE', 'Team', id, updates);
    return this.teams[idx];
  }

  deleteTeam(id: string): void {
    // Check if any students exist
    const hasStudents = this.students.some((s) => s.team_id === id);
    if (hasStudents) {
      throw new Error('Cannot delete team with assigned students. Transfer students first.');
    }
    this.teams = this.teams.filter((t) => t.id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'Team', id, {});
  }

  // --- Categories ---
  getCategories(festivalId?: string): Category[] {
    const fId = festivalId || this.getActiveFestival().id;
    return this.categories
      .filter((c) => c.festival_id === fId)
      .sort((a, b) => a.display_order - b.display_order);
  }

  addCategory(category: Omit<Category, 'id' | 'created_at'>): Category {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.categories.push(newCat);
    this.saveToStorage();
    this.logAudit('CREATE', 'Category', newCat.id, { name: newCat.name });
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.saveToStorage();
    this.logAudit('UPDATE', 'Category', id, updates);
    return this.categories[idx];
  }

  deleteCategory(id: string): void {
    const hasEvents = this.events.some((e) => e.category_id === id);
    if (hasEvents) {
      throw new Error('Cannot delete category with active events. Reassign or delete events first.');
    }
    this.categories = this.categories.filter((c) => c.id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'Category', id, {});
  }

  // --- Point Rules ---
  getPointRule(festivalId?: string): PointRule {
    const fId = festivalId || this.getActiveFestival().id;
    const rule = this.pointRules.find((r) => r.festival_id === fId && r.is_active);
    if (rule) return rule;
    // Default fallback
    const defRule: PointRule = {
      id: `rule-${Date.now()}`,
      festival_id: fId,
      first_place_points: 5.0,
      second_place_points: 3.0,
      third_place_points: 1.0,
      grade_a_points: 5.0,
      grade_b_points: 3.0,
      grade_c_points: 1.0,
      group_multiplier: 2.0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.pointRules.push(defRule);
    return defRule;
  }

  updatePointRule(festivalId: string, updates: Partial<PointRule>): PointRule {
    const rule = this.getPointRule(festivalId);
    const updatedRule: PointRule = {
      ...rule,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const idx = this.pointRules.findIndex((r) => r.id === rule.id);
    if (idx !== -1) this.pointRules[idx] = updatedRule;
    else this.pointRules.push(updatedRule);

    // Recalculate all results for this festival using the new rules!
    this.recalculateAllResults(festivalId, updatedRule);
    this.saveToStorage();
    this.logAudit('UPDATE', 'PointRule', rule.id, updates);
    return updatedRule;
  }

  private recalculateAllResults(festivalId: string, rule: PointRule) {
    const eventMap = new Map<string, FestivalEvent>();
    this.events.forEach((e) => eventMap.set(e.id, e));

    this.results = this.results.map((res) => {
      if (res.festival_id !== festivalId) return res;
      const ev = eventMap.get(res.event_id);
      const isGroup = ev?.event_type === 'GROUP';
      const calc = calculateResultPoints(res.position, res.grade, rule, isGroup);
      return {
        ...res,
        position_points: calc.positionPoints,
        grade_points: calc.gradePoints,
        total_points: calc.totalPoints,
        updated_at: new Date().toISOString(),
      };
    });
  }

  // --- Students ---
  getStudents(festivalId?: string): Student[] {
    const fId = festivalId || this.getActiveFestival().id;
    const teamMap = new Map<string, Team>();
    this.teams.forEach((t) => teamMap.set(t.id, t));

    return this.students
      .filter((s) => s.festival_id === fId)
      .map((s) => ({
        ...s,
        team: teamMap.get(s.team_id),
      }));
  }

  generateNextStudentId(festivalYear?: number): string {
    const year = festivalYear || this.getActiveFestival().year;
    const prefix = `AF${year}-`;
    const existing = this.students.filter((s) => s.student_id.startsWith(prefix));
    let maxNum = 0;
    existing.forEach((s) => {
      const parts = s.student_id.split('-');
      if (parts[1]) {
        const n = parseInt(parts[1], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  }

  addStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Student {
    // Check duplicate student_id
    if (this.students.some((s) => s.festival_id === student.festival_id && s.student_id === student.student_id)) {
      throw new Error(`Student ID ${student.student_id} already exists.`);
    }

    const newStudent: Student = {
      ...student,
      id: `stud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.students.push(newStudent);
    this.saveToStorage();
    this.logAudit('CREATE', 'Student', newStudent.id, { name: newStudent.full_name, id: newStudent.student_id });
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): Student {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    this.students[idx] = {
      ...this.students[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveToStorage();
    this.logAudit('UPDATE', 'Student', id, updates);
    return this.students[idx];
  }

  transferStudent(id: string, newTeamId: string): Student {
    const student = this.students.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');
    const oldTeamId = student.team_id;
    student.team_id = newTeamId;
    student.updated_at = new Date().toISOString();

    // Also update all individual registrations for this student
    this.registrations = this.registrations.map((reg) => {
      if (reg.student_id === id) {
        return { ...reg, team_id: newTeamId };
      }
      return reg;
    });

    this.saveToStorage();
    this.logAudit('TRANSFER_STUDENT', 'Student', id, { from: oldTeamId, to: newTeamId });
    return student;
  }

  deleteStudent(id: string): void {
    // Check if enrolled in results
    const inResults = this.results.some((r) => r.student_id === id);
    if (inResults) {
      throw new Error('Cannot delete student with recorded results. Clear results first.');
    }
    this.students = this.students.filter((s) => s.id !== id);
    this.registrations = this.registrations.filter((r) => r.student_id !== id);
    this.groupMembers = this.groupMembers.filter((m) => m.student_id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'Student', id, {});
  }

  importStudents(students: Array<Omit<Student, 'id' | 'created_at' | 'updated_at'>>): { success: number; skipped: number } {
    let success = 0;
    let skipped = 0;

    students.forEach((s) => {
      const exists = this.students.some((e) => e.festival_id === s.festival_id && e.student_id === s.student_id);
      if (exists) {
        skipped++;
      } else {
        this.addStudent(s);
        success++;
      }
    });

    return { success, skipped };
  }

  // --- Events ---
  getEvents(festivalId?: string): FestivalEvent[] {
    const fId = festivalId || this.getActiveFestival().id;
    const catMap = new Map<string, Category>();
    this.categories.forEach((c) => catMap.set(c.id, c));

    return this.events
      .filter((e) => e.festival_id === fId)
      .map((e) => {
        const regCount =
          e.event_type === 'INDIVIDUAL'
            ? this.registrations.filter((r) => r.event_id === e.id).length
            : this.groupTeams.filter((g) => g.event_id === e.id).length;
        return {
          ...e,
          category: catMap.get(e.category_id),
          registrations_count: regCount,
        };
      });
  }

  addEvent(event: Omit<FestivalEvent, 'id' | 'created_at' | 'updated_at'>): FestivalEvent {
    if (this.events.some((e) => e.festival_id === event.festival_id && e.code === event.code)) {
      throw new Error(`Event code ${event.code} already exists.`);
    }

    const newEvent: FestivalEvent = {
      ...event,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.events.push(newEvent);

    // Also auto-create a schedule record
    this.schedules.push({
      id: `sch-${Date.now()}`,
      festival_id: newEvent.festival_id,
      event_id: newEvent.id,
      venue: newEvent.venue,
      stage_number: newEvent.stage_number,
      date: newEvent.date,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time,
      status: 'ON_TIME',
      notes: null,
      created_at: new Date().toISOString(),
    });

    this.saveToStorage();
    this.logAudit('CREATE', 'Event', newEvent.id, { name: newEvent.name, code: newEvent.code });
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<FestivalEvent>): FestivalEvent {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Event not found');
    this.events[idx] = {
      ...this.events[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Update associated schedule venue/timing if modified
    const sch = this.schedules.find((s) => s.event_id === id);
    if (sch) {
      if (updates.venue) sch.venue = updates.venue;
      if (updates.stage_number !== undefined) sch.stage_number = updates.stage_number;
      if (updates.date) sch.date = updates.date;
      if (updates.start_time) sch.start_time = updates.start_time;
      if (updates.end_time) sch.end_time = updates.end_time;
    }

    this.saveToStorage();
    this.logAudit('UPDATE', 'Event', id, updates);
    return this.events[idx];
  }

  deleteEvent(id: string): void {
    const hasResults = this.results.some((r) => r.event_id === id);
    if (hasResults) {
      throw new Error('Cannot delete event with existing results. Clear results first.');
    }
    this.events = this.events.filter((e) => e.id !== id);
    this.registrations = this.registrations.filter((r) => r.event_id !== id);
    this.groupTeams = this.groupTeams.filter((g) => g.event_id !== id);
    this.schedules = this.schedules.filter((s) => s.event_id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'Event', id, {});
  }

  // --- Enrollments (ADMIN CONTROLLED ONLY) ---
  getRegistrations(eventId?: string): EventRegistration[] {
    const studentMap = new Map<string, Student>();
    this.students.forEach((s) => studentMap.set(s.id, s));

    const teamMap = new Map<string, Team>();
    this.teams.forEach((t) => teamMap.set(t.id, t));

    const eventMap = new Map<string, FestivalEvent>();
    this.events.forEach((e) => eventMap.set(e.id, e));

    let list = this.registrations;
    if (eventId) {
      list = list.filter((r) => r.event_id === eventId);
    }

    return list.map((r) => ({
      ...r,
      student: studentMap.get(r.student_id),
      team: teamMap.get(r.team_id),
      event: eventMap.get(r.event_id),
    }));
  }

  enrollStudent(
    festivalId: string,
    eventId: string,
    studentId: string,
    chestNumber?: string
  ): EventRegistration {
    // Check if already registered
    const exists = this.registrations.some((r) => r.event_id === eventId && r.student_id === studentId);
    if (exists) {
      throw new Error('Student is already enrolled in this event.');
    }

    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found.');

    const cNum =
      chestNumber ||
      String(100 + this.registrations.filter((r) => r.event_id === eventId).length + 1);

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      festival_id: festivalId,
      event_id: eventId,
      student_id: studentId,
      team_id: student.team_id,
      chest_number: cNum,
      status: 'CONFIRMED',
      registered_at: new Date().toISOString(),
    };

    this.registrations.push(newReg);
    this.saveToStorage();
    this.logAudit('ENROLL_STUDENT', 'EventRegistration', newReg.id, {
      student: student.full_name,
      chest: cNum,
    });
    return newReg;
  }

  bulkEnrollStudents(
    festivalId: string,
    eventId: string,
    studentIds: string[]
  ): { enrolled: number; duplicates: number } {
    let enrolled = 0;
    let duplicates = 0;

    studentIds.forEach((sId) => {
      try {
        this.enrollStudent(festivalId, eventId, sId);
        enrolled++;
      } catch (e) {
        duplicates++;
      }
    });

    return { enrolled, duplicates };
  }

  removeRegistration(id: string): void {
    this.registrations = this.registrations.filter((r) => r.id !== id);
    // Also remove from results if exists
    this.results = this.results.filter((r) => r.registration_id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'EventRegistration', id, {});
  }

  // --- Group Event Teams ---
  getGroupTeams(eventId?: string): GroupEventTeam[] {
    const teamMap = new Map<string, Team>();
    this.teams.forEach((t) => teamMap.set(t.id, t));

    const studentMap = new Map<string, Student>();
    this.students.forEach((s) => studentMap.set(s.id, s));

    const eventMap = new Map<string, FestivalEvent>();
    this.events.forEach((e) => eventMap.set(e.id, e));

    let list = this.groupTeams;
    if (eventId) {
      list = list.filter((g) => g.event_id === eventId);
    }

    return list.map((g) => {
      const members = this.groupMembers
        .filter((m) => m.group_team_id === g.id)
        .map((m) => ({
          ...m,
          student: studentMap.get(m.student_id),
        }));

      return {
        ...g,
        team: teamMap.get(g.team_id),
        event: eventMap.get(g.event_id),
        members,
      };
    });
  }

  createGroupTeam(
    festivalId: string,
    eventId: string,
    teamId: string,
    groupName: string,
    chestNumber: string,
    studentIds: string[]
  ): GroupEventTeam {
    const newGroup: GroupEventTeam = {
      id: `grp-${Date.now()}`,
      festival_id: festivalId,
      event_id: eventId,
      team_id: teamId,
      group_name: groupName,
      chest_number: chestNumber,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
    };
    this.groupTeams.push(newGroup);

    studentIds.forEach((sId, index) => {
      this.groupMembers.push({
        id: `mem-${Date.now()}-${index}`,
        group_team_id: newGroup.id,
        student_id: sId,
        role: index === 0 ? 'Lead' : 'Performer',
        created_at: new Date().toISOString(),
      });
    });

    this.saveToStorage();
    this.logAudit('CREATE_GROUP_TEAM', 'GroupEventTeam', newGroup.id, {
      name: groupName,
      members: studentIds.length,
    });
    return newGroup;
  }

  deleteGroupTeam(id: string): void {
    this.groupTeams = this.groupTeams.filter((g) => g.id !== id);
    this.groupMembers = this.groupMembers.filter((m) => m.group_team_id !== id);
    this.results = this.results.filter((r) => r.group_team_id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'GroupEventTeam', id, {});
  }

  // --- Results Management ---
  getResults(eventId?: string, onlyPublished: boolean = false): EventResult[] {
    const studentMap = new Map<string, Student>();
    this.students.forEach((s) => studentMap.set(s.id, s));

    const teamMap = new Map<string, Team>();
    this.teams.forEach((t) => teamMap.set(t.id, t));

    const eventMap = new Map<string, FestivalEvent>();
    this.events.forEach((e) => eventMap.set(e.id, e));

    const groupMap = new Map<string, GroupEventTeam>();
    this.groupTeams.forEach((g) => groupMap.set(g.id, g));

    let list = this.results;
    if (eventId) {
      list = list.filter((r) => r.event_id === eventId);
    }
    if (onlyPublished) {
      list = list.filter((r) => r.status === 'PUBLISHED');
    }

    return list.map((r) => ({
      ...r,
      student: r.student_id ? studentMap.get(r.student_id) : undefined,
      team: teamMap.get(r.team_id),
      event: eventMap.get(r.event_id),
      group_team: r.group_team_id ? groupMap.get(r.group_team_id) : undefined,
    }));
  }

  saveResult(
    festivalId: string,
    eventId: string,
    data: {
      registration_id?: string | null;
      group_team_id?: string | null;
      student_id?: string | null;
      team_id: string;
      position: 1 | 2 | 3 | null;
      grade: 'A' | 'B' | 'C' | 'PARTICIPATION' | null;
      remarks?: string | null;
      status: 'DRAFT' | 'PUBLISHED';
    }
  ): EventResult {
    const ev = this.events.find((e) => e.id === eventId);
    if (!ev) throw new Error('Event not found');

    const rule = this.getPointRule(festivalId);
    const isGroup = ev.event_type === 'GROUP';
    const calc = calculateResultPoints(data.position, data.grade, rule, isGroup);

    // Prevent duplicate entry for same participant or same group in the same event
    const existingIdx = this.results.findIndex(
      (r) =>
        r.event_id === eventId &&
        ((data.student_id && r.student_id === data.student_id) ||
          (data.group_team_id && r.group_team_id === data.group_team_id) ||
          (data.registration_id && r.registration_id === data.registration_id))
    );

    let saved: EventResult;

    if (existingIdx !== -1) {
      // Update existing result
      this.results[existingIdx] = {
        ...this.results[existingIdx],
        position: data.position,
        grade: data.grade,
        position_points: calc.positionPoints,
        grade_points: calc.gradePoints,
        total_points: calc.totalPoints,
        remarks: data.remarks ?? null,
        status: data.status,
        published_at: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      saved = this.results[existingIdx];
    } else {
      // Create new
      saved = {
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        festival_id: festivalId,
        event_id: eventId,
        registration_id: data.registration_id || null,
        group_team_id: data.group_team_id || null,
        student_id: data.student_id || null,
        team_id: data.team_id,
        position: data.position,
        grade: data.grade,
        position_points: calc.positionPoints,
        grade_points: calc.gradePoints,
        total_points: calc.totalPoints,
        remarks: data.remarks || null,
        status: data.status,
        published_at: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
        created_by: this.currentAdmin?.email || 'admin@fest.org',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.results.push(saved);
    }

    // Mark event as COMPLETED if published
    if (data.status === 'PUBLISHED' && ev.status !== 'COMPLETED') {
      ev.status = 'COMPLETED';
    }

    this.saveToStorage();
    this.logAudit('SAVE_RESULT', 'EventResult', saved.id, {
      event: ev.name,
      pos: data.position,
      grade: data.grade,
      pts: calc.totalPoints,
      status: data.status,
    });
    return saved;
  }

  deleteResult(id: string): void {
    this.results = this.results.filter((r) => r.id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'EventResult', id, {});
  }

  // --- Leaderboards ---
  getTeamLeaderboard(festivalId?: string): TeamLeaderboardItem[] {
    const fId = festivalId || this.getActiveFestival().id;
    const teams = this.getTeams(fId);
    const results = this.results.filter((r) => r.festival_id === fId);
    const events = this.events.filter((e) => e.festival_id === fId);
    return computeTeamLeaderboard(teams, results, events);
  }

  getStudentLeaderboard(festivalId?: string): StudentLeaderboardItem[] {
    const fId = festivalId || this.getActiveFestival().id;
    const students = this.students.filter((s) => s.festival_id === fId);
    const teams = this.teams.filter((t) => t.festival_id === fId);
    const results = this.results.filter((r) => r.festival_id === fId);
    const events = this.events.filter((e) => e.festival_id === fId);
    return computeStudentLeaderboard(students, teams, results, events);
  }

  // --- Schedules ---
  getSchedules(festivalId?: string): FestivalSchedule[] {
    const fId = festivalId || this.getActiveFestival().id;
    const eventMap = new Map<string, FestivalEvent>();
    this.events.forEach((e) => eventMap.set(e.id, e));

    return this.schedules
      .filter((s) => s.festival_id === fId)
      .map((s) => ({
        ...s,
        event: eventMap.get(s.event_id),
      }))
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
  }

  updateSchedule(id: string, updates: Partial<FestivalSchedule>): FestivalSchedule {
    const idx = this.schedules.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Schedule not found');
    this.schedules[idx] = { ...this.schedules[idx], ...updates };
    this.saveToStorage();
    this.logAudit('UPDATE', 'FestivalSchedule', id, updates);
    return this.schedules[idx];
  }

  // --- Announcements ---
  getAnnouncements(festivalId?: string, onlyPublished: boolean = true): Announcement[] {
    const fId = festivalId || this.getActiveFestival().id;
    return this.announcements
      .filter((a) => a.festival_id === fId && (!onlyPublished || a.is_published))
      .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || b.published_at.localeCompare(a.published_at));
  }

  addAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.announcements.unshift(newAnn);
    this.saveToStorage();
    this.logAudit('CREATE', 'Announcement', newAnn.id, { title: newAnn.title });
    return newAnn;
  }

  updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Announcement not found');
    this.announcements[idx] = { ...this.announcements[idx], ...updates };
    this.saveToStorage();
    this.logAudit('UPDATE', 'Announcement', id, updates);
    return this.announcements[idx];
  }

  deleteAnnouncement(id: string): void {
    this.announcements = this.announcements.filter((a) => a.id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'Announcement', id, {});
  }

  // --- Gallery ---
  getAlbums(festivalId?: string, onlyPublished: boolean = true): GalleryAlbum[] {
    const fId = festivalId || this.getActiveFestival().id;
    return this.albums
      .filter((a) => a.festival_id === fId && (!onlyPublished || a.is_published))
      .map((a) => ({
        ...a,
        media_count: this.media.filter((m) => m.album_id === a.id && (!onlyPublished || m.is_published)).length,
      }));
  }

  getMedia(albumId?: string, onlyPublished: boolean = true): GalleryMedia[] {
    return this.media
      .filter((m) => (!albumId || m.album_id === albumId) && (!onlyPublished || m.is_published))
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  addAlbum(album: Omit<GalleryAlbum, 'id' | 'created_at'>): GalleryAlbum {
    const newAlb: GalleryAlbum = {
      ...album,
      id: `alb-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.albums.push(newAlb);
    this.saveToStorage();
    this.logAudit('CREATE', 'GalleryAlbum', newAlb.id, { title: newAlb.title });
    return newAlb;
  }

  addMedia(mediaItem: Omit<GalleryMedia, 'id' | 'created_at'>): GalleryMedia {
    const newM: GalleryMedia = {
      ...mediaItem,
      id: `med-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.media.push(newM);
    this.saveToStorage();
    this.logAudit('CREATE', 'GalleryMedia', newM.id, { caption: newM.caption });
    return newM;
  }

  deleteMedia(id: string): void {
    this.media = this.media.filter((m) => m.id !== id);
    this.saveToStorage();
    this.logAudit('DELETE', 'GalleryMedia', id, {});
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  logAudit(action: string, entity_type: string, entity_id: string | null, details: Record<string, unknown>) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      festival_id: this.getActiveFestival()?.id || null,
      admin_email: this.currentAdmin?.email || 'admin@fest.org',
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  resetToDefaultSeed() {
    this.festivals = [...INITIAL_FESTIVALS];
    this.teams = [...INITIAL_TEAMS];
    this.categories = [...INITIAL_CATEGORIES];
    this.pointRules = [...INITIAL_POINT_RULES];
    this.students = [...INITIAL_STUDENTS];
    this.events = [...INITIAL_EVENTS];
    this.registrations = [...INITIAL_REGISTRATIONS];
    this.groupTeams = [...INITIAL_GROUP_TEAMS];
    this.groupMembers = [...INITIAL_GROUP_MEMBERS];
    this.results = [...INITIAL_RESULTS];
    this.schedules = [...INITIAL_SCHEDULES];
    this.announcements = [...INITIAL_ANNOUNCEMENTS];
    this.albums = [...INITIAL_ALBUMS];
    this.media = [...INITIAL_MEDIA];
    this.admins = [...INITIAL_ADMINS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.saveToStorage();
  }
}

// Global Singleton Instance
export const dataStore = new DataStore();

