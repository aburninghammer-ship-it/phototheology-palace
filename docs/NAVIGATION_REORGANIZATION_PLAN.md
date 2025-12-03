# Navigation Reorganization Plan
## Palace-Centered Progressive Disclosure System

---

## Executive Summary

Reorganize the app's navigation from **8 fragmented categories (~46 links)** into **5 intent-based pillars** with **4 progressive disclosure modes** that unlock features based on user journey stage. The Palace remains the central organizing principle and mastery system.

---

## Part 1: The 5 Intent-Based Pillars

### Pillar 1: HOME BASE (Always Visible)
**Intent:** Quick access, daily engagement, personal hub

| Feature | Description | Mode Availability |
|---------|-------------|-------------------|
| Dashboard | Personalized stats, streaks, daily verse | All |
| Daily Verse | Today's verse with PT breakdown | All |
| Continue Learning | Resume last activity | All |
| Jeeves Quick Chat | AI assistant access | All |
| Notifications | Messages, achievements, reminders | All |
| My Profile | Settings, progress, preferences | All |

### Pillar 2: READ & ENGAGE
**Intent:** Direct Scripture engagement without structured study pressure

| Feature | Description | Mode Availability |
|---------|-------------|-------------------|
| Bible Reader | Full KJV with cross-references | All |
| Reading Plans | Chronological, thematic, book-by-book | All |
| Daily Devotionals | Personalized devotions | All |
| Quarterly Study | SS lesson integration | Seeker+ |
| Audio Bible | Listen while reading | All |
| Bookmarks & Highlights | Personal annotations | All |
| Search Scripture | Word/topic search | All |

### Pillar 3: THE PALACE (Central Hub)
**Intent:** Structured learning, mastery, and the PT method

| Feature | Description | Mode Availability |
|---------|-------------|-------------------|
| Palace Overview | Visual 8-floor map | All (limited view for Seekers) |
| **Floor 1: Furnishing** | SR, IR, 24F, BR, TR, GR | All |
| **Floor 2: Investigation** | OR, DC, ST, QR, QA | Student+ |
| **Floor 3: Freestyle** | NF, PF, BF, HF, LR | Student+ |
| **Floor 4: Next Level** | CR, DR, C6, TRm, TZ, PRm, P‖, FRt | Student+ |
| **Floor 5: Vision** | BL, PR, 3A | Scholar+ |
| **Floor 6: Three Heavens** | Cycles, Heavens, JR | Scholar+ |
| **Floor 7: Spiritual** | FRm, MR, SRm | Scholar+ |
| **Floor 8: Master** | Reflexive Mastery | Scholar+ |
| Courses & Lessons | Structured PT courses | Student+ |
| Mastery Dashboard | Progress, certificates, titles | All |
| Training Drills | Room-specific exercises | Student+ |

### Pillar 4: PRACTICE & PLAY
**Intent:** Gamified learning, challenges, skill-building

| Feature | Description | Mode Availability |
|---------|-------------|-------------------|
| Games Hub | All games in one place | All |
| Daily Challenge | Community challenge | All |
| Study Deck | Card-based study | All |
| Memory Games | Verse memorization | All |
| PT Chess | Strategic learning game | Student+ |
| Leaderboard | Competition & rankings | All |
| Achievements | Badges and rewards | All |
| Kids Zone | Child-friendly content | All |

### Pillar 5: LIFE BLUEPRINTS
**Intent:** Practical Scripture application for life situations

| Feature | Description | Mode Availability |
|---------|-------------|-------------------|
| Blueprint Library | All life situation guides | All |
| Marriage & Family | Relationship guidance | All |
| Grief & Loss | Comfort and hope | All |
| Mental Health | Biblical wellness | All |
| Financial Wisdom | Stewardship principles | All |
| Career & Purpose | Calling and work | All |
| Custom Blueprints | AI-generated personal guides | Student+ |

### Pillar 6: COMMUNITY & LEADERSHIP (Expandable)
**Intent:** Social learning, teaching, group study

| Feature | Description | Mode Availability |
|---------|-------------|-------------------|
| Guilds | Study groups | Student+ |
| Community Forum | Discussion & sharing | All |
| Direct Messages | Private conversations | All |
| Series Builder | Create Bible study series | Leader |
| Church Dashboard | Church group management | Leader |
| Mentorship Tools | Disciple others | Leader |
| Lead Bible Study | Teaching resources | Leader |

---

## Part 2: Progressive Disclosure Modes

### Mode 1: SEEKER (New Users / Casual)
**Profile:** New to app, exploring, wants simple Bible reading
**Unlocked by:** Default for new users

**What They See:**
- Home Base (full)
- Read & Engage (full)
- Palace (Floor 1 only, overview locked)
- Practice & Play (basic games)
- Blueprints (read-only)
- Community (forum, messages only)

**Visual Treatment:**
- Clean, minimal interface
- Locked floors shown as "Coming Soon"
- Gentle prompts to explore more
- Focus on daily devotion + Bible reading

**Upgrade Path:**
- Complete 7-day streak
- Finish Floor 1 tour
- Complete 3 daily challenges
- Manual upgrade in settings

### Mode 2: STUDENT (Active Learner)
**Profile:** Committed to learning PT method, regular user
**Unlocked by:** Seeker requirements OR manual selection

**What They See:**
- Everything from Seeker
- Palace Floors 1-4 (full access)
- All courses and lessons
- Training drills
- Advanced games (PT Chess)
- Custom blueprints
- Guilds and study groups

**Visual Treatment:**
- Fuller navigation visible
- Progress indicators prominent
- Course recommendations
- Mastery path visible

**Upgrade Path:**
- Complete Floor 4 assessment
- 30-day streak
- Earn "Blue Master" title
- Complete one course

### Mode 3: SCHOLAR (Deep Student)
**Profile:** Serious PT practitioner, prophecy/sanctuary focus
**Unlocked by:** Student requirements OR premium subscription

**What They See:**
- Everything from Student
- Palace Floors 5-7 (full access)
- Advanced prophecy tools
- Sanctuary deep-dives
- Research tools
- Encyclopedia access
- Advanced GPT features

**Visual Treatment:**
- Research-oriented layout options
- Quick-access to definitions/commentary
- Cross-reference panels
- Advanced search filters

**Upgrade Path:**
- Complete Floor 7 assessment
- Earn "Gold Master" title
- 90-day streak
- Complete advanced course

### Mode 4: LEADER (Teacher/Mentor)
**Profile:** Teaching others, leading groups, creating content
**Unlocked by:** Scholar requirements OR church admin role

**What They See:**
- Everything from Scholar
- Palace Floor 8 (Master level)
- Series Builder (full)
- Church Dashboard
- Mentorship tools
- Analytics on student progress
- Content creation tools
- Admin features

**Visual Treatment:**
- Teacher dashboard view
- Student management panels
- Content creation prominence
- Leadership metrics

---

## Part 3: Implementation Architecture

### Database Schema Changes

```sql
-- Add user_mode to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  user_mode TEXT DEFAULT 'seeker' 
  CHECK (user_mode IN ('seeker', 'student', 'scholar', 'leader'));

-- Add mode_unlocked_at timestamps
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  mode_history JSONB DEFAULT '[]';

-- Track mode requirements progress
CREATE TABLE IF NOT EXISTS mode_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  mode TEXT NOT NULL,
  requirement_key TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  progress_data JSONB,
  UNIQUE(user_id, mode, requirement_key)
);
```

### New Hooks Required

```typescript
// src/hooks/useUserMode.ts
// Returns current mode + upgrade eligibility + feature access

// src/hooks/useNavigationPillars.ts  
// Returns filtered navigation based on mode

// src/hooks/useModeProgress.ts
// Tracks progress toward next mode unlock
```

### Component Changes

```
src/components/navigation/
├── PillarNavigation.tsx      // Main nav with 5-6 pillars
├── PillarItem.tsx            // Individual pillar with sub-items
├── ModeSelector.tsx          // Mode switching UI
├── ModeUpgradePrompt.tsx     // Upgrade suggestions
├── LockedFeatureOverlay.tsx  // Shows what's locked and why
└── ProgressiveDisclosure.tsx // Wrapper for mode-gated content
```

### Navigation Structure

```typescript
const navigationPillars = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/dashboard',
    minMode: 'seeker',
    items: [...] // sub-items
  },
  {
    id: 'read',
    label: 'Read & Engage',
    icon: BookOpen,
    path: '/bible',
    minMode: 'seeker',
    items: [...]
  },
  {
    id: 'palace',
    label: 'The Palace',
    icon: Building2,
    path: '/palace',
    minMode: 'seeker', // visible to all, content gated
    items: [...],
    highlight: true // Central pillar
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: Gamepad2,
    path: '/practice',
    minMode: 'seeker',
    items: [...]
  },
  {
    id: 'blueprints',
    label: 'Life Blueprints',
    icon: Compass,
    path: '/blueprints',
    minMode: 'seeker',
    items: [...]
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    path: '/community',
    minMode: 'seeker', // basic access
    items: [...]
  }
];
```

---

## Part 4: Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Add `user_mode` column to profiles
2. Create `useUserMode` hook
3. Create `useNavigationPillars` hook
4. Build `PillarNavigation` component (hidden behind feature flag)

### Phase 2: Navigation Shell (Week 3-4)
1. Implement new sidebar/nav structure
2. Add mode selector to settings
3. Create locked feature overlays
4. A/B test with subset of users

### Phase 3: Content Gating (Week 5-6)
1. Add mode checks to all routes
2. Implement floor-level gating in Palace
3. Add upgrade prompts at gate points
4. Create mode progress tracking

### Phase 4: Polish & Launch (Week 7-8)
1. Onboarding flow for mode selection
2. Mode upgrade celebrations
3. Full rollout with analytics
4. Deprecate old navigation

---

## Part 5: User Experience Flows

### New User Onboarding
```
1. Welcome → Brief PT intro
2. "How do you want to start?"
   - "Just read the Bible" → Seeker mode
   - "Learn the Palace method" → Seeker mode + Palace tour
   - "I know PT already" → Student mode
3. Personalization questions
4. Land on Dashboard with mode-appropriate view
```

### Mode Upgrade Flow
```
1. User completes requirement
2. Toast: "You've unlocked Student mode!"
3. Modal: Shows new features unlocked
4. Option: "Upgrade now" or "Stay in Seeker"
5. If upgrade: Animated reveal of new nav items
```

### Feature Discovery
```
1. Locked feature tapped
2. Overlay: "This unlocks in [Mode]"
3. Shows: Requirements to unlock
4. Progress: "You're 2/5 requirements done"
5. CTA: "View my progress" → Mode dashboard
```

---

## Part 6: Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| New user retention (7-day) | +20% | Analytics |
| Time to first "aha moment" | -30% | Event tracking |
| Palace engagement | +40% | Room visits |
| Mode progression rate | 30% Seeker→Student | Profile data |
| Navigation confusion support tickets | -50% | Support system |
| Feature discovery rate | +25% | Click tracking |

---

## Part 7: Open Questions

1. **Mode persistence:** Should users be able to downgrade modes?
2. **Premium integration:** Does Scholar require subscription?
3. **Church accounts:** Auto-Leader mode for admins?
4. **Mobile nav:** Bottom tabs or drawer for pillars?
5. **Onboarding:** Force mode selection or default to Seeker?

---

## Appendix A: Current vs. Proposed Navigation

### Current (8 Categories, ~46 Links)
- Study (12 items)
- Practice (8 items)
- Blueprints (6 items)
- Learn (5 items)
- GPTs (5 items)
- Research (4 items)
- Community (4 items)
- Profile (2 items)

### Proposed (5 Pillars, Mode-Gated)
- Home Base (6 items, always visible)
- Read & Engage (7 items, mostly visible)
- The Palace (12+ items, progressively unlocked)
- Practice & Play (8 items, mostly visible)
- Life Blueprints (7 items, mostly visible)
- Community (7 items, progressively unlocked)

**Net reduction for Seekers:** ~46 → ~20 visible items
**Net reduction for Students:** ~46 → ~35 visible items
**Full access for Scholars/Leaders:** All items organized logically

---

## Appendix B: Pillar Icon & Color Scheme

| Pillar | Icon | Color Token | Accent |
|--------|------|-------------|--------|
| Home | `Home` | `--primary` | Blue |
| Read | `BookOpen` | `--accent` | Amber |
| Palace | `Building2` | `--palace` | Purple/Gold |
| Practice | `Gamepad2` | `--success` | Green |
| Blueprints | `Compass` | `--info` | Cyan |
| Community | `Users` | `--secondary` | Indigo |
