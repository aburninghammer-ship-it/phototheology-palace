import { z } from 'zod';

// Community post schemas
export const communityPostSchema = z.object({
  title: z.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must be less than 10,000 characters'),
  category: z.enum(['general', 'testimony', 'question', 'study', 'prayer'])
});

// Sermon builder schemas
export const sermonTitleSchema = z.string()
  .trim()
  .min(3, 'Title must be at least 3 characters')
  .max(200, 'Title must be less than 200 characters');

export const sermonThemeSchema = z.string()
  .trim()
  .min(5, 'Theme must be at least 5 characters')
  .max(500, 'Theme must be less than 500 characters');

export const sermonStoneSchema = z.string()
  .trim()
  .min(10, 'Stone must be at least 10 characters')
  .max(1000, 'Stone must be less than 1000 characters');

export const sermonBridgeSchema = z.string()
  .trim()
  .min(10, 'Bridge must be at least 10 characters')
  .max(1000, 'Bridge must be less than 1000 characters');

// Flashcard schemas
export const flashcardSetSchema = z.object({
  title: z.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

export const flashcardSchema = z.object({
  question: z.string()
    .trim()
    .min(5, 'Question must be at least 5 characters')
    .max(500, 'Question must be less than 500 characters'),
  answer: z.string()
    .trim()
    .min(5, 'Answer must be at least 5 characters')
    .max(1000, 'Answer must be less than 1000 characters'),
  verse_reference: z.string()
    .trim()
    .max(50, 'Verse reference is too long')
    .optional()
});

// AI prompt schema
export const aiPromptSchema = z.string()
  .trim()
  .min(3, 'Prompt must be at least 3 characters')
  .max(200, 'Prompt must be less than 200 characters');
