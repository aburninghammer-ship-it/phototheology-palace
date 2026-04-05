## Daily Generated Sample Questions

### What we're building:
Replace the static/hourly-rotating sample questions in Level 1 chat with 6 fresh AI-generated questions every day, each touching a different Palace principle.

### Steps:

1. **Database table** — `generated_sample_questions` to store daily batches (date, questions array, palace principles used)

2. **Edge function** — `generate-daily-questions` that:
   - Uses Gemini Flash to generate 6 diverse questions
   - Each question maps to a different Palace principle area (Sanctuary, Prophecy, Christ Types, Patterns, Freestyle, etc.)
   - Stores them with the generation date
   - Includes a fallback static set if generation fails

3. **Cron job** — Schedule at 5:00 AM UTC daily (same as existing spark cards)

4. **Update BasicChatTab** — Fetch today's questions from DB; fall back to static array if none found

### No changes to:
- Jeeves backend logic
- Level 2/3 interfaces
- Chapel or other sections
