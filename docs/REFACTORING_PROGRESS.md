# Phototheology App - Refactoring & Optimization Progress

## 🎯 Project Goals
1. Make app fully responsive for all mobile devices
2. Optimize performance for app store deployment
3. Reduce technical debt
4. Improve offline functionality
5. Enhance user experience

---

## ✅ COMPLETED TASKS

### Phase 1: Mobile Deployment Setup (2025-12-01)
- [x] Fixed Capacitor configuration for native deployment
  - Changed app ID to `com.phototheology.palace`
  - Removed remote Lovable server URL
  - Added splash screen configuration
- [x] Initialized iOS and Android platforms
- [x] Organized dev documentation into `/docs` folder
- [x] Updated `.gitignore` for mobile platforms
- [x] Verified production build works

### Phase 2: Responsive Design Fixes (2025-12-01)
- [x] Fixed horizontal overflow on mobile devices
  - Added `overflow-x: hidden` to html/body
  - Fixed whitespace-nowrap causing text cutoffs
  - Enhanced viewport meta tags
  - Added word-wrap and overflow-wrap for text breaking
  - iOS-specific viewport height fix
- [x] Enhanced mobile meta tags for PWA
- [x] Synced changes to Capacitor platforms

**Files Modified:**
- `capacitor.config.ts`
- `.gitignore`
- `index.html`
- `src/index.css`

**Git Commits:**
- `34357cc` - Prepare app for iOS and Android deployment
- `106f60a` - Fix responsive design issues on mobile devices
- `a08d1e5` - Add community performance optimization - Part 1

---

## 🚧 IN PROGRESS

### Phase 3: Performance Optimization
**Status:** In Progress (Started 2025-12-01 20:30)

#### Task 1: Optimize Community Page Performance
**Priority:** HIGH | **Estimated Time:** 2-3 hours

**Sub-tasks:**
- [x] Add pagination for posts (load 10 at a time) - useCommunityPosts hook created
- [x] Implement lazy loading for comments - useCommunityComments hook created
- [x] Add loading skeletons - PostSkeleton component created
- [x] Add optimistic UI updates for comments - Built into hooks
- [ ] Create CommunityCommentThread component
- [ ] Refactor Community.tsx to use new hooks/components
- [ ] Fix real-time subscription to update specific posts only
- [ ] Add "Load More" button with infinite scroll option
- [ ] Test performance improvements

**Files to Modify:**
- `src/pages/Community.tsx` (1,010 lines - needs refactoring)
- Create new components:
  - `src/components/community/CommunityHeader.tsx`
  - `src/components/community/CommunityPostList.tsx`
  - `src/components/community/CommunityPostCard.tsx`
  - `src/components/community/CommunityCommentThread.tsx`
  - `src/components/community/ActiveUsersSection.tsx`

**Current Issues:**
- All posts loaded at once (performance issue)
- No lazy loading of comments
- Real-time subscription refetches ALL posts on any change
- 1,010 line component (maintainability issue)

---

## 📋 PENDING TASKS

### Phase 4: Offline Audio Fixes
**Priority:** HIGH | **Estimated Time:** 1-2 hours

- [ ] Test offline audio implementation across browsers
- [ ] Fix `navigator.onLine` reliability issues
- [ ] Handle CORS properly for music caching
- [ ] Test browser TTS voice availability
- [ ] Add fallback handling for TTS failures
- [ ] Create testing matrix:
  - [ ] Chrome desktop
  - [ ] Safari desktop
  - [ ] Firefox desktop
  - [ ] iOS Safari (via Capacitor)
  - [ ] Android Chrome (via Capacitor)
  - [ ] Slow 3G simulation
  - [ ] Airplane mode

**Files to Review:**
- `src/components/audio/offlineAudioCache.ts`
- `src/hooks/useTextToSpeech.ts`
- `src/components/audio/AudioNarrator.tsx`

---

### Phase 5: Add Read-Along Fallback
**Priority:** MEDIUM | **Estimated Time:** 1-2 hours

- [ ] Design read-along text-highlight mode
- [ ] Implement highlighting logic
- [ ] Add toggle between audio/read-along
- [ ] Test on mobile devices
- [ ] Add to user preferences

**New Files to Create:**
- `src/components/reading/ReadAlongHighlight.tsx`
- `src/hooks/useReadAlong.ts`

---

### Phase 6: Consolidate Edge Functions
**Priority:** MEDIUM | **Estimated Time:** 3-4 hours

**Current State:**
- 69 total edge functions in `supabase/functions/`
- Multiple similar functions doing similar things

**Consolidation Plan:**

#### Email Functions (6 → 1)
- [ ] Consolidate these into one `send-email` function with parameters:
  - `send-admin-signup-email`
  - `send-daily-challenge`
  - `send-engagement-email`
  - `send-invitation`
  - `send-partner-nudges`
  - `send-renewal-reminders`
  - `send-purchase-notification`
  - `send-signup-notification`

#### Generate Functions (8 → 3-4)
- [ ] Review and consolidate:
  - `generate-30-challenges`
  - `generate-access-code`
  - `generate-achievement-share`
  - `generate-bible-rendered-flashcards`
  - `generate-bible-rendered-images`
  - `generate-visual-anchor`

#### Import Functions (3 → 1)
- [ ] Consolidate:
  - `import-stepbible`
  - `import-stepbible-verses`
  - `import-strongs-csv`
  - `import-strongs-lexicon`
  - `import-tahot-file`

---

### Phase 7: Refactor Large Components
**Priority:** LOW | **Estimated Time:** 4-6 hours

**Components to Refactor:**

1. **Community.tsx** (1,010 lines)
   - Split into smaller components (listed in Phase 3)

2. **SequencePlayer.tsx** (1,340 lines)
   - [ ] `src/components/sequence/SequenceHeader.tsx`
   - [ ] `src/components/sequence/SequenceControls.tsx`
   - [ ] `src/components/sequence/SequenceTimeline.tsx`
   - [ ] `src/components/sequence/SequenceFrameDisplay.tsx`

3. **Other Large Files** (>500 lines)
   - [ ] Review and potentially split

---

## 🐛 Known Issues to Fix

### High Priority
- [ ] Community page loads all posts at once
- [ ] Offline audio reliability issues
- [ ] No error boundaries for TTS failures

### Medium Priority
- [ ] 69 edge functions (technical debt)
- [ ] Large component files (maintainability)

### Low Priority
- [ ] npm security vulnerabilities (2 moderate)

---

## 📊 Metrics to Track

### Performance Metrics
- [ ] Initial page load time (target: <3s on 3G)
- [ ] Time to interactive (target: <5s on 3G)
- [ ] Community page load time (target: <2s)
- [ ] Bundle size (current: 1.87MB - needs optimization)

### Code Quality Metrics
- [ ] Average component size (target: <300 lines)
- [ ] Number of edge functions (target: <30)
- [ ] Test coverage (target: >60%)

---

## 🔄 Next Session Checklist

When resuming work:
1. Read this document
2. Check git status: `git status`
3. Check current branch: `git branch`
4. Review recent commits: `git log --oneline -10`
5. Check what phase was in progress
6. Continue from the first unchecked task

---

## 📝 Notes & Decisions

### 2025-12-01
- Decided to prioritize performance optimization over code refactoring
- Mobile responsiveness is critical for app store approval
- Will refactor after app is stable and launched

### Architecture Decisions
- Using Capacitor for iOS/Android deployment
- Supabase for backend
- React + TypeScript + Vite
- Tailwind CSS for styling
- shadcn-ui components

### Testing Strategy
- Manual testing on actual devices
- Browser dev tools for responsive testing
- Network throttling for offline testing

---

## 🚀 Deployment Checklist (Future)

### Before App Store Submission
- [ ] All phases above completed
- [ ] Performance metrics meet targets
- [ ] Tested on real iOS device
- [ ] Tested on real Android device
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] App store assets prepared (screenshots, descriptions)
- [ ] Beta testing completed

---

**Last Updated:** 2025-12-01 20:30 UTC
**Current Phase:** 3 - Performance Optimization
**Status:** In Progress
