
# Level 1 "Basic" Mode — ChatGPT-Style Interface

## Overview
When a user is in Level 1 (Basic), the entire app shell transforms into a dark, modern ChatGPT-like interface. No Spaces dashboard, no palace navigation — just a clean left sidebar with tool tabs and a main content area.

## Naming Updates
- Simple → **Basic** (Level 1)
- Guided → **Explorer** (Level 2)  
- Master → **Immersion** (Level 3)

## Level 1 Interface Layout
```
┌──────────────────────────────────────────────┐
│ [≡] Phototheology    [Basic ▾]    [👤]       │  ← Header with level chip
├────────┬─────────────────────────────────────┤
│ 💬 Ask │                                     │
│ 📖 Bible│    Main Content Area               │
│ 🎧 Audio│   (Chat / Bible / etc.)            │
│ 📅 Plans│                                    │
│ 🌅 AM   │                                    │
│ 🌙 PM   │                                    │
│ ✨ Daily │                                    │
│        │                                     │
│────────│                                     │
│ ⚙️ Settings                                  │
└────────┴─────────────────────────────────────┘
```

## Sidebar Tabs (7 items)
1. **Ask Jeeves** — Primary chat (default tab, ChatGPT-like)
2. **Study Bible** — Bible reader with commentary
3. **Audio Commentary** — Listen to chapter commentaries
4. **Reading Plans** — Bible reading plans
5. **Morning Watch** — AM devotional
6. **Night Watch** — PM meditation
7. **Daily Devotional** — Reginald's daily entry

## Level Toggle
- Header shows current level as a styled chip (e.g., "Basic")
- Clicking opens a modal with descriptions of all 3 levels
- Settings menu also has the toggle

## Visual Style
- Dark background (similar to ChatGPT dark mode)
- Clean, minimal sidebar with icons + labels
- Chat area with centered content, max-width container
- Smooth transitions between tabs

## Implementation Steps
1. Update ExperienceModeContext: rename simple→basic, guided→explorer, master→immersion
2. Create `BasicModeShell.tsx` — the Level 1 app shell with sidebar + content area
3. Create `BasicModeSidebar.tsx` — left sidebar with 7 tabs
4. Create `LevelToggleChip.tsx` — header chip + modal for switching levels
5. Update main layout to conditionally render BasicModeShell when level=basic
6. Add a welcome/explainer screen shown on first entry to Basic mode
7. Wire existing components (Jeeves chat, Bible reader, etc.) into the tabs
