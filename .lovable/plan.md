
## OS-Wide Behavioral Module Injection

### What We're Doing
Injecting the 5 behavioral modules from `palace-schema.ts` into every AI generation edge function so that ALL AI output across the platform benefits from the full Phototheology framework:

1. **APPLICATION_ENGINE** — 24-hour actionable steps, Heart-Level & Mission Impact
2. **GUARDRAILS** — SC-1 through SC-7 theological safety constraints  
3. **THINKING_PROCESS** — 6-step silent self-check before responding
4. **ROOM_ROTATION** — Ensures diverse Palace lens usage (no Concentration Room bias)
5. **UNIVERSAL_RESPONSE_RULES** — Jesus Sightline, Deep Cut, Fruit Test

### Two Modes of Injection
- **Chat/Interactive** (Jeeves, Study Buddy, Analyze My Thoughts): Rooms named explicitly as teaching tool
- **Commentary/Content** (Audio, Devotionals, Gems, etc.): Rooms used silently — never labeled, just applied for diversity

### Functions to Update (grouped by priority)

**Batch 1 — Audio Commentary Suite**
1. `generate-epic-commentary` — 8-voice commentary (Epic, Urban, Ancient, etc.)
2. `generate-audio-commentary` — Study Bible verse commentary
3. `generate-chapter-commentary` — Chapter-level commentary
4. `generate-verse-commentary` — Individual verse commentary
5. `egw-audio-commentary` — EGW-informed commentary
6. `pregenerate-commentary` — Background pre-generation

**Batch 2 — Devotionals & Watches**
7. `generate-devotional-audio` — Morning/Night Watch devotionals
8. `send-daily-audio-devotional-sms` — Daily SMS devotional

**Batch 3 — Gems, Sparks & Study Tools**
9. `generate-gem` — Give Me A Gem
10. `generate-audio-guide` — Audio study guides
11. `generate-research-audio` — Research assistant audio

**Batch 4 — Other AI Features**
12. `generate-palace-tour-audio` — Palace tour narration
13. `generate-baptism-audio` — Baptism study audio
14. `live-sermon-commentary` — Live sermon AI commentary

**Batch 5 — Jeeves Chat (already done, verify)**
15. `jeeves/index.ts` — Already updated; verify completeness

### Implementation Pattern
For each function:
1. Import behavioral modules from `_shared/palace-schema.ts`
2. Add a **commentary-specific wrapper** that instructs: "Apply these lenses silently to diversify output. Never name rooms or floors by label."
3. Inject into the system prompt construction
4. Deploy and verify

### What Changes for Users
- Commentaries become more varied (no more Concentration Room bias)
- Devotionals include actionable steps and fruit testing
- Gems rotate across all 8 floors naturally
- All output passes theological guardrails consistently
- Audio quality improves because text quality improves
