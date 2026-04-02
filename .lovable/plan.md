## Phase 1: Quick Wins (This Session)

### 1. A/B Test CTAs on Landing Page
- Create an A/B testing utility that randomly assigns users to variants and tracks conversions
- Test hero CTA button text variants (e.g., "Start Free" vs "Try the Palace" vs "Begin Your Journey")
- Store variant assignment in localStorage, track clicks via user_events table

### 2. Lighthouse Performance Review
- Run performance profile on current site
- Identify and fix top bottlenecks (bundle size, render-blocking resources, image optimization)
- Document findings and improvements

## Phase 2: Gamification (Next Session)

### 3. Floor Completion Badges
- Create visual badge/award system for completing each of the 8 Palace floors
- Track floor completion progress and award badges automatically
- Display badges on user profile and dashboard

### 4. Scripture Memory Battles
- 1v1 verse memorization challenges (fill-in-the-blank, word ordering)
- Matchmaking system using realtime channels
- Scoring and results tracking

### 5. Multiplayer Bible Trivia
- Real-time trivia rooms with multiple players
- Question bank from Palace method content
- Live scoring and leaderboard per session

## Phase 3: AI Features (Following Session)

### 6. Personalized Study Plans
- Edge function that analyzes user's reading history, completed rooms, and study patterns
- AI generates a weekly study plan targeting weak areas
- Suggests specific rooms, chapters, and exercises

### 7. Situational Verse Finder
- "What are you going through?" input
- AI matches life situations (grief, anxiety, joy, doubt) to relevant verses
- Includes Palace room context for deeper study

---
**Recommended order:** Start with Phase 1 (A/B testing + Lighthouse) since they directly impact conversion and performance. Then gamification, then AI features.