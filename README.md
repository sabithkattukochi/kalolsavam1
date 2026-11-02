# KALOLSAVAM — College Arts Festival Management System

> **A production-grade, database-driven web platform designed for managing college cultural, literary, and fine arts festivals.**
> Engineered with Next.js (App Router, Turbopack, React 19, TypeScript), Tailwind CSS, Lucide Icons, Recharts, and Supabase PostgreSQL.

---

## 🏛️ 1. Project Philosophy & Architecture

Kalolsavam is engineered specifically for institutional arts festivals where:
- **STRICT ADMIN CONTROL**: Students **never** register themselves, create accounts, or self-enroll. All student rosters, event registrations, group squad formations, chest number assignments, schedule planning, and results tabulation are executed by authenticated festival coordinators and administrators.
- **PUBLIC ACCESS**: The public festival website allows students, faculty, alumni, and visitors to inspect event schedules, view live team leaderboards, browse category competitions, read official notices, search certified results, and enjoy festival photo/video galleries without needing an account.
- **DYNAMIC POINTS ENGINE**: An automatic, mathematically consistent point calculation engine with configurable position points (1st, 2nd, 3rd), grade points (A, B, C), and group event multipliers. Modifying rules immediately recalculates historical and live scores without duplication.
- **MULTI-EDITION ARCHIVE**: Full support for multiple festival editions (e.g. DHWANI 2026 active, UTSAV 2025 archived) preserving historical student accomplishments and trophy histories.

---

## 🚀 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with modern dark editorial glassmorphism
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security policies)
- **Data Visualizations**: [Recharts](https://recharts.org/) for house points comparison and standings
- **Icons**: [Lucide React](https://lucide.dev/)
- **Spreadsheet & Reporting**: [SheetJS (xlsx)](https://docs.sheetjs.com/) for native `.xlsx` and `.csv` exports
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) for festive podium celebrations

---

## 📦 3. Application Structure & Modules

### 🌐 Public Portal (`/`)
1. **Homepage (`/`)**:
   - Hero banner with festival branding, edition badge, and college attribution
   - Live KPI stat counters (Total Students, Teams, Competitions, Results Published)
   - Real-time Podium Leaderboard preview
   - Arena navigation (Chithrolsavam, Sahithyolsavam, Stage Events)
   - Recent results feed, upcoming schedule preview, and official bulletin
2. **Event Categories (`/categories`)**:
   - Detailed showcase of competition arenas:
     - **Chithrolsavam** (Drawing, painting, charcoal sketching, poster design, sculpture)
     - **Sahithyolsavam** (Poetry, short story, essay writing, debates, elocution)
     - **Stage Events** (Classical dance, mime, drama, Western vocal, cinematic dance)
3. **Event Directory (`/events`)**:
   - Filterable event catalog with category, search, and type (Individual vs. Group)
   - Event detail modal showing rules, venues, timing, and enrolled participant rosters
4. **Schedule & Venues (`/schedule`)**:
   - Day-by-day filterable timetable
   - Dual view modes: **Timeline Cards** and **Structured List View**
   - Venue and status badges (`UPCOMING`, `ONGOING`, `COMPLETED`, `DELAYED`)
5. **Certified Results (`/results`)**:
   - Event-wise official result cards
   - Position badges (1st, 2nd, 3rd) and Grade badges (A, B, C)
   - Points breakdown and one-click PDF print/export
6. **Live Leaderboard (`/leaderboard`)**:
   - Interactive bar chart showing house points comparison
   - Grand podium display (Gold, Silver, Bronze) with confetti trigger
   - Category-wise points matrix (Chithrolsavam, Sahithyolsavam, Stage Events)
   - Individual student honors (**Kalaprathibha** & **Kalathilakam** contenders)
7. **Festival Gallery (`/gallery`)**:
   - Event-wise albums and media grids
   - Interactive Lightbox viewer for high-resolution images and videos
8. **Notice Board (`/announcements`)**:
   - Pinned urgent notices, schedule updates, and category advisories
9. **Festival History (`/history`)**:
   - Archive of previous editions (e.g., UTSAV 2025) with championship rosters

---

### 🛡️ Administrative Console (`/admin`)

Access the admin portal via `/admin`. Role-based access simulation allows toggling between **Super Admin**, **Event Coordinator**, and **Score Manager**.

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Command Center** | `/admin/dashboard` | Real-time KPI metrics, points comparison chart, quick action shortcuts, recent tabulation logs. |
| **Student Directory** | `/admin/students` | Add/Edit/Delete institutional records, auto-generated student IDs (`AF2026-001`), Excel/CSV import & export, team transfers. |
| **Team Houses** | `/admin/teams` | Manage 4 house teams (Ruby Phoenix, Emerald Dragons, Sapphire Titans, Topaz Knights), brand colors, captains, and house rosters. |
| **Categories** | `/admin/categories` | Create custom arenas, set display order, hero banner imagery, and descriptions. |
| **Events Manager** | `/admin/events` | Create individual and group events, assign categories, venues, coordinators, participant limits, and rules. |
| **Enrollment Center** | `/admin/enrollments` | **Strict Admin Control**: Search students, single enroll, bulk multi-select enrollment, group squad assembly, chest numbering, duplicate enrollment prevention. |
| **Schedules & Venues** | `/admin/schedules` | Schedule events, assign stages/venues, detect scheduling conflicts, publish timing changes. |
| **Results & Tabulation**| `/admin/results` | Award 1st/2nd/3rd positions and A/B/C grades for individual or group events, save as `DRAFT` or `PUBLISHED`, instant points update. |
| **Points Engine** | `/admin/points` | Configurable scoring rules: position points, grade points, group event multipliers, with one-click full recalculation engine. |
| **Media & Albums** | `/admin/gallery` | Create photo/video albums, upload media links, toggle public visibility, set featured items. |
| **Announcements** | `/admin/announcements` | Draft and broadcast urgent notices, pin announcements, set publication statuses. |
| **Festival Editions**| `/admin/festivals` | Switch active festival edition, create new editions, archive past editions. |
| **Reports & Export** | `/admin/reports` | Export Excel (`.xlsx`) & CSV, print official event call sheets, certified result booklets, student rosters, and leaderboards. |
| **Audit Trail** | `/admin/audit-logs` | Immutable audit log of all admin operations (who changed what, timestamps, and payload inspection). |

---

## ⚙️ 4. Quick Start & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node.js v20 LTS)
- npm or pnpm

### Installation Steps

1. **Clone and enter the directory**:
   ```bash
   cd c:\Users\sabith\Desktop\kalolsavam
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(The application works out-of-the-box with built-in resilient state persistence even before setting up Supabase!)*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the public website.
   Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Console.

---

## 🗄️ 5. Supabase Database Setup

When you are ready to link a live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire schema defined in `supabase/schema.sql`.
4. (Optional) Run `supabase/seed.sql` to populate sample data for Victoria State Arts College.
5. In your Supabase Project Settings, copy:
   - `Project URL`
   - `anon public` API Key
6. Update your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 🧮 6. Point Calculation Engine Logic

The point system evaluates results atomically:

$$\text{Total Points} = (\text{Position Points} + \text{Grade Points}) \times (\text{Group Multiplier if Group Event})$$

### Default Standard Points:
- **Positions**:
  - 🥇 First Place: **5 Points**
  - 🥈 Second Place: **3 Points**
  - 🥉 Third Place: **1 Point**
- **Grades**:
  - 🅰️ A Grade: **5 Points**
  - 🅱️ B Grade: **3 Points**
  - 🅲 C Grade: **1 Point**
- **Group Multiplier**: **1.5x** (configurable in Admin > Point Engine Rules)

When an admin publishes or edits a result, the engine verifies that only `PUBLISHED` results affect the team leaderboard and individual honors, preventing duplicate awards or desynchronized scores.

---

## 📄 7. License

Built for college arts festival organizations. Open for educational and institutional deployment.
