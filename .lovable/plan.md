
# Audio Training Courses — Option D Implementation

## Overview
Convert Genesis in 6 Days ($9), Quick-Start Guide ($17), and Study Suite ($97) from paid PDFs into **free audio training courses** available to all subscribers inside Phototheology University. Each course has lessons with audio narration (OpenAI TTS), read-along transcript, and downloadable PDF companion.

## Three Courses

### 1. Quick-Start Guide (from Training Manual — Parts I & IV)
- **5 lessons**: The Big Idea → The Palace Picture → Imagination & Memory → PT Codes → Guardrails
- Orientation to the framework before diving in
- Voice: `nova` (warm, welcoming)

### 2. Genesis in 6 Days (from Genesis PDF)
- **6 lessons** (one per day): Day 1 (Ch 1-8) → Day 2 (Ch 9-16) → Day 3 (Ch 17-24) → Day 4 (Ch 25-34) → Day 5 (Ch 35-42) → Day 6 (Ch 43-50)
- Each lesson covers ~8 chapter frames with memory keys
- Voice: `onyx` (deep, authoritative)

### 3. The Complete Study Suite (from Training Manual — Parts II, III, V)
- **12 lessons**: Floor 1 → Floor 2 → Floor 3 → Floor 4 → Floor 5 → Floor 6 → Floor 7 → Floor 8 → Cycles & Heavens → Ascensions & Expansions → Training Exercises → Walkthroughs (Daniel 7, Genesis 22, Psalm 23)
- Deep method training
- Voice: `echo` (scholarly, precise)

## Database

### `training_courses` table
- id, title, description, slug, voice (OpenAI voice ID), lesson_count, icon, sort_order

### `training_lessons` table  
- id, course_id, lesson_number, title, transcript (full text for read-along), audio_storage_path, duration_seconds, status (pending/ready)

## Edge Function: `generate-training-audio`
- Takes lesson_id, generates OpenAI TTS audio from transcript
- Chunks long transcripts, stitches MP3s
- Stores in Supabase storage bucket `training-audio`
- Uses existing OpenAI TTS pattern (parallel batching, "nova" fallback)

## UI Components
1. **Training Courses page** (`/university/training`) — card grid of 3 courses
2. **Course Detail page** (`/university/training/:slug`) — lesson list with play buttons
3. **Lesson Player** — audio player + scrollable read-along transcript + PDF download button

## PDF Companions
- Store the uploaded PDFs in Supabase storage (`training-pdfs` bucket)
- Quick-Start Guide PDF = Training Manual PDF (it IS the companion)
- Genesis PDF = Genesis in 6 Days PDF
- Study Suite PDF = Training Manual PDF

## Access
- All 3 courses: **free for all authenticated subscribers** (any tier)
- Non-subscribers see a locked state prompting subscription

## Steps
1. Create database tables + storage buckets
2. Seed course & lesson data (titles, transcripts extracted from PDFs)
3. Build edge function for OpenAI TTS generation
4. Upload PDFs to storage
5. Build UI: courses page, course detail, lesson player
6. Add navigation entry in University space
