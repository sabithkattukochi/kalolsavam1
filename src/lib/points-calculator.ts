import {
  PointRule,
  EventResult,
  Team,
  FestivalEvent,
  TeamLeaderboardItem,
  StudentLeaderboardItem,
  Student,
} from '@/types/database';

/**
 * Calculates points for a single result entry given the point rules and event type.
 */
export function calculateResultPoints(
  position: 1 | 2 | 3 | null,
  grade: 'A' | 'B' | 'C' | 'PARTICIPATION' | null,
  rules: PointRule,
  isGroupEvent: boolean = false
): { positionPoints: number; gradePoints: number; totalPoints: number } {
  let posPoints = 0;
  if (position === 1) posPoints = rules.first_place_points;
  else if (position === 2) posPoints = rules.second_place_points;
  else if (position === 3) posPoints = rules.third_place_points;

  let grdPoints = 0;
  if (grade === 'A') grdPoints = rules.grade_a_points;
  else if (grade === 'B') grdPoints = rules.grade_b_points;
  else if (grade === 'C') grdPoints = rules.grade_c_points;

  const multiplier = isGroupEvent ? (rules.group_multiplier || 1.0) : 1.0;

  const total = Number(((posPoints + grdPoints) * multiplier).toFixed(2));

  return {
    positionPoints: posPoints * multiplier,
    gradePoints: grdPoints * multiplier,
    totalPoints: total,
  };
}

/**
 * Computes the team leaderboard from published results, point rules, and active teams.
 * Guarantees no duplicate counting and produces full category-wise breakdown.
 */
export function computeTeamLeaderboard(
  teams: Team[],
  results: EventResult[],
  events: FestivalEvent[]
): TeamLeaderboardItem[] {
  // Map eventId -> FestivalEvent for quick category & type lookup
  const eventMap = new Map<string, FestivalEvent>();
  events.forEach((ev) => eventMap.set(ev.id, ev));

  // Filter only PUBLISHED results
  const publishedResults = results.filter((r) => r.status === 'PUBLISHED');

  const teamStats: Record<string, TeamLeaderboardItem> = {};

  // Initialize for all teams
  teams.forEach((t) => {
    teamStats[t.id] = {
      team_id: t.id,
      name: t.name,
      code: t.code,
      color: t.color,
      bg_gradient: t.bg_gradient,
      badge_icon: t.badge_icon,
      motto: t.motto,
      captain_name: t.captain_name,
      rank: 1,
      total_points: 0,
      first_count: 0,
      second_count: 0,
      third_count: 0,
      grade_a_count: 0,
      grade_b_count: 0,
      grade_c_count: 0,
      total_awards: 0,
      category_points: {},
    };
  });

  publishedResults.forEach((res) => {
    const item = teamStats[res.team_id];
    if (!item) return;

    const ev = eventMap.get(res.event_id);
    const categoryId = ev?.category_id || 'unknown';

    // Accumulate points
    const pts = res.total_points || 0;
    item.total_points = Number((item.total_points + pts).toFixed(2));

    // Category breakdown
    item.category_points[categoryId] = Number(
      ((item.category_points[categoryId] || 0) + pts).toFixed(2)
    );

    // Positions count
    if (res.position === 1) item.first_count += 1;
    else if (res.position === 2) item.second_count += 1;
    else if (res.position === 3) item.third_count += 1;

    // Grades count
    if (res.grade === 'A') item.grade_a_count += 1;
    else if (res.grade === 'B') item.grade_b_count += 1;
    else if (res.grade === 'C') item.grade_c_count += 1;

    if (res.position || (res.grade && res.grade !== 'PARTICIPATION')) {
      item.total_awards += 1;
    }
  });

  // Sort by total_points DESC, then first_count DESC, then second_count DESC
  const sorted = Object.values(teamStats).sort((a, b) => {
    if (b.total_points !== a.total_points) return b.total_points - a.total_points;
    if (b.first_count !== a.first_count) return b.first_count - a.first_count;
    if (b.second_count !== a.second_count) return b.second_count - a.second_count;
    return b.third_count - a.third_count;
  });

  // Assign ranks
  sorted.forEach((team, index) => {
    team.rank = index + 1;
  });

  return sorted;
}

/**
 * Computes individual top performers from published results.
 */
export function computeStudentLeaderboard(
  students: Student[],
  teams: Team[],
  results: EventResult[],
  events: FestivalEvent[]
): StudentLeaderboardItem[] {
  const studentMap = new Map<string, Student>();
  students.forEach((s) => studentMap.set(s.id, s));

  const teamMap = new Map<string, Team>();
  teams.forEach((t) => teamMap.set(t.id, t));

  const eventMap = new Map<string, FestivalEvent>();
  events.forEach((e) => eventMap.set(e.id, e));

  const publishedResults = results.filter((r) => r.status === 'PUBLISHED' && r.student_id);

  const scores: Record<string, StudentLeaderboardItem> = {};

  publishedResults.forEach((res) => {
    if (!res.student_id) return;
    const st = studentMap.get(res.student_id);
    if (!st) return;

    const team = teamMap.get(st.team_id);
    const ev = eventMap.get(res.event_id);

    if (!scores[res.student_id]) {
      scores[res.student_id] = {
        student_id: st.id,
        unique_id: st.student_id,
        full_name: st.full_name,
        course: st.course,
        class_grade: st.class_grade,
        department: st.department,
        team_name: team?.name || 'Independent',
        team_color: team?.color || '#3b82f6',
        team_code: team?.code || 'IND',
        total_points: 0,
        first_count: 0,
        second_count: 0,
        third_count: 0,
        grade_a_count: 0,
        events_won: [],
      };
    }

    const item = scores[res.student_id];
    item.total_points = Number((item.total_points + (res.total_points || 0)).toFixed(2));

    if (res.position === 1) item.first_count += 1;
    else if (res.position === 2) item.second_count += 1;
    else if (res.position === 3) item.third_count += 1;

    if (res.grade === 'A') item.grade_a_count += 1;

    if (ev && (res.position || res.grade === 'A')) {
      const posLabel = res.position ? `#${res.position}` : '';
      const grdLabel = res.grade ? ` (${res.grade} Grade)` : '';
      item.events_won.push(`${ev.name}${posLabel ? ` - ${posLabel}` : ''}${grdLabel}`);
    }
  });

  const sorted = Object.values(scores).sort((a, b) => b.total_points - a.total_points);
  sorted.forEach((item, idx) => {
    item.rank = idx + 1;
  });
  return sorted;
}
