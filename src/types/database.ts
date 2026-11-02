// =====================================================================
// COLLEGE ARTS FESTIVAL MANAGEMENT SYSTEM - DATABASE & DOMAIN TYPES
// =====================================================================

export type FestivalStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type EventType = 'INDIVIDUAL' | 'GROUP';
export type EventStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type RegistrationStatus = 'CONFIRMED' | 'DISQUALIFIED' | 'WITHDRAWN';
export type ResultStatus = 'DRAFT' | 'PUBLISHED';
export type GradeType = 'A' | 'B' | 'C' | 'PARTICIPATION';
export type ScheduleStatus = 'ON_TIME' | 'DELAYED' | 'RESCHEDULED' | 'COMPLETED';
export type AnnouncementCategory = 'GENERAL' | 'SCHEDULE_CHANGE' | 'RESULT_ALERT' | 'URGENT';
export type AdminRole = 'SUPER_ADMIN' | 'EVENT_COORDINATOR' | 'SCORE_MANAGER';
export type MediaType = 'IMAGE' | 'VIDEO';

export interface JudgeProfile {
  id: string;
  judge_code: string; // e.g. JUDGE-01
  full_name: string;
  email: string;
  assigned_category: string;
  assigned_venue: string;
  avatar_url?: string;
}

export interface Festival {
  id: string;
  name: string;
  edition: string;
  year: number;
  theme: string | null;
  description: string | null;
  college_name: string;
  banner_url: string | null;
  start_date: string;
  end_date: string;
  status: FestivalStatus;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  festival_id: string;
  name: string;
  code: string;
  color: string;
  bg_gradient: string;
  badge_icon: string;
  motto: string | null;
  captain_name: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  festival_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface PointRule {
  id: string;
  festival_id: string;
  first_place_points: number;
  second_place_points: number;
  third_place_points: number;
  grade_a_points: number;
  grade_b_points: number;
  grade_c_points: number;
  group_multiplier: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  festival_id: string;
  student_id: string; // e.g. AF2026-001
  full_name: string;
  class_grade: string;
  course: string;
  department: string;
  team_id: string;
  gender: Gender | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  // joined fields
  team?: Team;
}

export interface FestivalEvent {
  id: string;
  festival_id: string;
  category_id: string;
  code: string;
  name: string;
  description: string | null;
  event_type: EventType;
  min_participants: number;
  max_participants: number;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  stage_number: string | null;
  coordinator_name: string | null;
  coordinator_phone: string | null;
  rules: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  // joined fields
  category?: Category;
  registrations_count?: number;
}

export interface EventRegistration {
  id: string;
  festival_id: string;
  event_id: string;
  student_id: string;
  team_id: string;
  chest_number: string;
  status: RegistrationStatus;
  registered_at: string;
  // joined fields
  student?: Student;
  team?: Team;
  event?: FestivalEvent;
}

export interface GroupEventTeam {
  id: string;
  festival_id: string;
  event_id: string;
  team_id: string;
  group_name: string;
  chest_number: string;
  status: RegistrationStatus;
  created_at: string;
  // joined fields
  team?: Team;
  event?: FestivalEvent;
  members?: GroupEventMember[];
}

export interface GroupEventMember {
  id: string;
  group_team_id: string;
  student_id: string;
  role: string;
  created_at: string;
  // joined
  student?: Student;
}

export interface EventResult {
  id: string;
  festival_id: string;
  event_id: string;
  registration_id: string | null;
  group_team_id: string | null;
  student_id: string | null;
  team_id: string;
  position: 1 | 2 | 3 | null;
  grade: GradeType | null;
  position_points: number;
  grade_points: number;
  total_points: number;
  remarks: string | null;
  status: ResultStatus;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  event?: FestivalEvent;
  student?: Student;
  team?: Team;
  group_team?: GroupEventTeam;
}

export interface FestivalSchedule {
  id: string;
  festival_id: string;
  event_id: string;
  venue: string;
  stage_number: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
  notes: string | null;
  created_at: string;
  event?: FestivalEvent;
}

export interface GalleryAlbum {
  id: string;
  festival_id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
  media_count?: number;
}

export interface GalleryMedia {
  id: string;
  album_id: string;
  festival_id: string;
  media_type: MediaType;
  media_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Announcement {
  id: string;
  festival_id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  is_pinned: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface AdminProfile {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  role: AdminRole;
  avatar_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  festival_id: string | null;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

// =====================================================================
// COMPUTED / DERIVED MODELS FOR LEADERBOARDS & REPORTS
// =====================================================================

export interface TeamLeaderboardItem {
  team_id: string;
  name: string;
  code: string;
  color: string;
  bg_gradient: string;
  badge_icon: string;
  motto: string | null;
  captain_name?: string | null;
  rank: number;
  total_points: number;
  first_count: number;
  second_count: number;
  third_count: number;
  grade_a_count: number;
  grade_b_count: number;
  grade_c_count: number;
  total_awards: number;
  category_points: Record<string, number>; // category_id -> points
}

export interface StudentLeaderboardItem {
  rank?: number;
  student_id: string;
  unique_id: string;
  full_name: string;
  course: string;
  class_grade: string;
  department: string;
  team_name: string;
  team_color: string;
  team_code: string;
  total_points: number;
  first_count: number;
  second_count: number;
  third_count: number;
  grade_a_count: number;
  events_won: string[];
}
