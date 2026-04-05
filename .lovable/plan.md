
## Level 2 (Explorer) Visual Distinction Plan

### 1. Explorer Mode Banner/Header Badge
- Add a subtle **"Workshop Mode"** indicator badge in the dashboard/sidebar that shows when in Explorer mode
- Uses a distinct **teal/cyan** accent color (vs primary gold for Immersion)
- Includes a coaching tooltip: "You're in guided mode — PT principles are introduced gently as you study"

### 2. Coaching Indicators on Features
- Explorer features get a subtle **"🧭 Guided"** badge overlay on cards/tiles
- Immersion features show a **"⚡ Full Access"** badge instead
- Locked Immersion-only features show a tasteful **"🔒 Immersion"** lock badge with a "Level up" tooltip

### 3. Dashboard Differentiation
- Explorer dashboard shows a **"Your Workshop"** section header with coaching language
- Add a **progress indicator** showing how many Explorer tools they've tried (encouraging advancement)
- Show a **"Ready for Immersion?"** prompt after significant Explorer usage

### 4. Navigation Visual Cues
- Explorer sidebar items get a subtle left-border accent in teal
- Immersion sidebar items use the primary gold accent
- Locked items show dimmed with lock icon

### 5. PT Label Enhancement
- Explorer: PT codes appear as **learning tooltips** with explanations (already partly done)
- Immersion: PT codes appear as **professional badges** (compact, no tooltip needed)
- Make the visual gap between these more pronounced

### Files to modify:
- `src/contexts/ExperienceModeContext.tsx` — add mode-specific accent color tokens
- `src/components/experience-mode/ExperienceModeIndicator.tsx` — NEW: floating mode badge
- `src/pages/Dashboard.tsx` — Explorer-specific dashboard section
- `src/index.css` — Explorer accent color tokens
- Sidebar/navigation components — mode-aware styling
