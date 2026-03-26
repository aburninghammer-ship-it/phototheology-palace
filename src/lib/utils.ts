import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRODUCTION_URL = "https://phototheologybible.com";

/**
 * Rewrites any URL to use the production domain.
 * Prevents sharing dev/preview URLs (e.g. *.lovableproject.com)
 * that show Lovable's branding in link previews instead of ours.
 */
export function getShareUrl(path?: string): string {
  if (path) {
    // If a full production URL is already provided, return as-is
    if (path.startsWith(PRODUCTION_URL)) return path;
    // If it's a relative path, prepend production domain
    if (path.startsWith("/")) return `${PRODUCTION_URL}${path}`;
    // If it's a full URL on another domain, rewrite the host
    try {
      const url = new URL(path);
      return `${PRODUCTION_URL}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return `${PRODUCTION_URL}/${path}`;
    }
  }
  // Default: rewrite current page URL to production domain
  const { pathname, search, hash } = window.location;
  return `${PRODUCTION_URL}${pathname}${search}${hash}`;
}
