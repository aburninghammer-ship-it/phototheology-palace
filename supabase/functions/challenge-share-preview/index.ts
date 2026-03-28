import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = "https://phototheology-palace.lovable.app";
const DEFAULT_IMAGE = "https://phototheologybible.com/phototheology-hero-og.png";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestUrl = new URL(req.url);
    const format = requestUrl.searchParams.get("format");
    const previewUrl = requestUrl.toString();
    const title = sanitizeText(requestUrl.searchParams.get("title"), 120) || "Phototheology Challenge";
    const description =
      sanitizeText(requestUrl.searchParams.get("description"), 320) ||
      "Explore this challenge in Phototheology Palace.";
    const badge = sanitizeText(requestUrl.searchParams.get("badge"), 48) || "Phototheology Challenge";
    const content = sanitizeMultilineText(requestUrl.searchParams.get("content"), 2400);
    const instructions = sanitizeMultilineText(requestUrl.searchParams.get("instructions"), 600);
    const path = normalizePath(requestUrl.searchParams.get("path"));
    const targetUrl = new URL(path, `${APP_URL}/`).toString();
    const imageUrl = new URL(requestUrl.toString());
    imageUrl.searchParams.set("format", "image");

    if (format === "image") {
      const svg = buildPreviewSvg({ title, badge, description, content, instructions });

      return new Response(svg, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | Phototheology</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(previewUrl)}" />

    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(previewUrl)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl.toString())}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="PhototheologyOS" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(previewUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl.toString())}" />

  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:hsl(222 47% 11%);color:hsl(210 40% 98%);font-family:Georgia,ui-serif,serif;">
    <main style="max-width:860px;width:100%;text-align:left;border:1px solid hsl(215 28% 17%);border-radius:28px;padding:32px;background:linear-gradient(135deg, hsl(222 47% 11%), hsl(221 39% 17%));box-shadow:0 24px 80px rgba(0,0,0,.35);">
      <div style="display:inline-block;margin-bottom:16px;padding:8px 14px;border-radius:999px;background:hsl(215 28% 17%);color:hsl(43 96% 56%);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
        ${escapeHtml(badge)}
      </div>
      <h1 style="margin:0 0 12px;font-size:36px;line-height:1.15;">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px;font-size:18px;line-height:1.6;color:hsl(214 32% 91%);">${escapeHtml(description)}</p>
      ${content ? `<pre style="margin:0 0 18px;padding:20px;border-radius:20px;white-space:pre-wrap;word-break:break-word;background:hsl(215 28% 17%);color:hsl(210 40% 96%);font:15px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;">${escapeHtml(content)}</pre>` : ""}
      ${instructions ? `<div style="margin:0 0 18px;padding:18px 20px;border-radius:20px;background:hsl(43 96% 56% / 0.12);border:1px solid hsl(43 96% 56% / 0.28);color:hsl(48 96% 89%);font-size:15px;line-height:1.6;"><strong style="display:block;margin-bottom:8px;letter-spacing:.04em;text-transform:uppercase;font-size:12px;color:hsl(43 96% 56%);">What to do</strong>${escapeHtml(instructions)}</div>` : ""}
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:0 0 14px;">
        <a href="${escapeHtml(targetUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:hsl(43 96% 56%);color:hsl(222 47% 11%);font-weight:700;text-decoration:none;">Open in PhototheologyOS</a>
        <a href="${escapeHtml(APP_URL)}" style="display:inline-block;padding:12px 18px;border-radius:999px;border:1px solid hsl(215 20% 35%);color:hsl(210 40% 98%);font-weight:700;text-decoration:none;">Visit Phototheology Palace</a>
      </div>
      <p style="margin:0;font-size:14px;color:hsl(215 20% 65%);">
        This public preview explains the challenge for newcomers; use the button above to jump back into PhototheologyOS and respond.
      </p>
    </main>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("challenge-share-preview error:", error);
    return new Response("Unable to load challenge preview", {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
});

function normalizePath(value: string | null): string {
  if (!value) return "/daily-challenges";
  return value.startsWith("/") ? value : `/${value}`;
}

function sanitizeText(value: string | null, maxLength: number): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeMultilineText(value: string | null, maxLength: number): string {
  return (value ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .trim()
    .slice(0, maxLength);
}

function buildPreviewSvg({
  title,
  badge,
  description,
  content,
  instructions,
}: {
  title: string;
  badge: string;
  description: string;
  content: string;
  instructions: string;
}) {
  const lines = [
    ...wrapText(description, 58, 3),
    ...(content ? wrapText(content, 52, 11) : []),
    ...(instructions ? wrapText(`What to do: ${instructions}`, 58, 4) : []),
  ].slice(0, 18);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="hsl(222 47% 11%)" />
  <rect x="36" y="36" width="1128" height="558" rx="28" fill="hsl(221 39% 17%)" />
  <rect x="72" y="72" width="240" height="40" rx="20" fill="hsl(215 28% 17%)" />
  <text x="192" y="98" text-anchor="middle" fill="hsl(43 96% 56%)" font-size="18" font-family="Georgia, serif" font-weight="700" letter-spacing="2">${escapeHtml(badge.toUpperCase())}</text>
  <text x="72" y="162" fill="white" font-size="42" font-family="Georgia, serif" font-weight="700">${escapeHtml(title)}</text>
  ${lines.map((line, index) => `<text x="72" y="${220 + index * 24}" fill="hsl(214 32% 91%)" font-size="20" font-family="Arial, sans-serif">${escapeHtml(line)}</text>`).join("")}
  <text x="72" y="576" fill="hsl(43 96% 56%)" font-size="22" font-family="Georgia, serif" font-weight="700">Open this challenge in Phototheology Palace</text>
</svg>`;
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.replace(/\n+/g, " \n ").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (word === "\\n") {
      if (currentLine) lines.push(currentLine);
      currentLine = "";
      if (lines.length >= maxLines) break;
      continue;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length > maxChars) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }

    if (lines.length >= maxLines) break;
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
  }

  return lines;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
