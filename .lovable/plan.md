
# 3-Mode System: Simple → Guided → Master

## Overview
Add a global user experience mode that controls how much Phototheology architecture (rooms, principles, codes) is exposed. The engine stays identical — only the presentation layer changes.

## The 3 Modes

### 🟢 Simple Mode ("The Clock")
- No mention of rooms, floors, principles, or codes
- Actions presented as: "Understand", "Apply", "Defend", "Connect"
- Jeeves speaks in plain language: "Here are 3 layers of meaning..." instead of "Let's use the Dimensions Room"
- Palace rooms still fire behind the scenes, just invisible
- Best for: New users, non-SDA audiences, casual Bible students

### 🟡 Guided Mode ("Learning the Engine")
- Occasional mentions: "This insight uses a pattern-recognition technique..."
- After showing results, a subtle tag appears: "💡 This used the Dimensions principle"
- Tooltips explain PT concepts when hovered
- Progressive disclosure — users learn PT vocabulary naturally through use
- Best for: Growing users who want to understand why insights are powerful

### 🔴 Master Mode ("Full Engine")
- Full room names, floor numbers, codes visible
- Claim Ladder, debate tools, all PT terminology
- Current experience preserved exactly as-is
- Best for: Advanced users, teachers, apologists, course students

## Implementation Plan

### Step 1: Create the Mode System (Context + Storage)
- Create a `UserExperienceMode` context provider
- Store preference in localStorage + user profile (database)
- Default new users to **Simple** mode
- Provide a clean toggle UI accessible from Settings and a floating indicator

### Step 2: Create Mode-Aware Components
- `<PTLabel>` component that renders differently per mode:
  - Simple: plain language only
  - Guided: plain language + subtle PT tag
  - Master: full PT terminology
- `<PTSection>` wrapper that shows/hides architectural UI per mode

### Step 3: Update Key Surfaces
- **Welcome/Home**: Action-based buttons in Simple, space tiles in Master
- **Palace Rooms**: Show as "Study Tools" in Simple, room names in Master
- **Jeeves**: System prompt adjusts per mode (no jargon → some context → full PT)
- **Navigation labels**: "Memory Training" vs "Floor 1 - Furnishing"
- **Study results**: Hide room tags in Simple, show progressively in Guided

### Step 4: Mode Selector UI
- Settings page toggle (primary)
- First-time user onboarding prompt
- Quick-switch in sidebar/header for power users

### Step 5: Persist to Database
- Add `experience_mode` column to profiles table
- Sync between localStorage and database
