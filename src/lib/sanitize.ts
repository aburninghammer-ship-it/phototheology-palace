import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes while preserving safe formatting
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitizes plain text by removing all HTML tags
 * Use for user input that should contain no markup
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

/**
 * Validates and sanitizes user input with length limits
 */
export function validateAndSanitize(
  text: string,
  minLength: number = 1,
  maxLength: number = 10000
): { valid: boolean; sanitized: string; error?: string } {
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, sanitized: '', error: `Must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, sanitized: '', error: `Must be less than ${maxLength} characters` };
  }
  
  return { valid: true, sanitized: sanitizeText(trimmed) };
}
