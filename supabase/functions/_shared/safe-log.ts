/**
 * Safe logging utility that sanitizes PII in production.
 * Use this instead of raw console.log in edge functions.
 */

function sanitizeValue(key: string, value: unknown): unknown {
  if (value === null || value === undefined) return value;
  const str = String(value);

  // Email addresses
  if (
    typeof value === "string" &&
    (key.toLowerCase().includes("email") || value.includes("@"))
  ) {
    const parts = str.split("@");
    if (parts.length === 2) return `***@${parts[1]}`;
  }

  // UUIDs (user IDs, etc.)
  if (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str) &&
    (key.toLowerCase().includes("id") || key.toLowerCase().includes("user"))
  ) {
    return str.substring(0, 8) + "...";
  }

  // API keys / tokens
  if (
    typeof value === "string" &&
    (key.toLowerCase().includes("key") ||
      key.toLowerCase().includes("token") ||
      key.toLowerCase().includes("secret"))
  ) {
    return str.substring(0, 4) + "****";
  }

  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = sanitizeValue(key, value);
    }
  }
  return result;
}

export function safeLog(message: string, data?: Record<string, unknown>): void {
  if (data) {
    console.log(message, sanitizeObject(data));
  } else {
    console.log(message);
  }
}

export function safeError(message: string, error?: unknown): void {
  if (error instanceof Error) {
    console.error(message, { name: error.name, message: error.message });
  } else {
    console.error(message, error);
  }
}
