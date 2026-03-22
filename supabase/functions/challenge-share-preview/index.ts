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
    const previewUrl = requestUrl.toString();
    const title = sanitizeText(requestUrl.searchParams.get("title"), 120) || "Phototheology Challenge";
    const description =
      sanitizeText(requestUrl.searchParams.get("description"), 240) ||
      "Explore this challenge in Phototheology Palace.";
    const badge = sanitizeText(requestUrl.searchParams.get("badge"), 48) || "Phototheology Challenge";
    const path = normalizePath(requestUrl.searchParams.get("path"));
    const targetUrl = new URL(path, `${APP_URL}/`).toString();

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
    <meta property="og:image" content="${DEFAULT_IMAGE}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Phototheology Bible Learning Suite" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(previewUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${DEFAULT_IMAGE}" />

    <meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}" />
    <script>
      window.location.replace(${JSON.stringify(targetUrl)});
    </script>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#0f172a;color:#f8fafc;font-family:Inter,system-ui,sans-serif;">
    <main style="max-width:720px;text-align:center;">
      <div style="display:inline-block;margin-bottom:16px;padding:8px 14px;border-radius:999px;background:#1e293b;color:#fbbf24;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
        ${escapeHtml(badge)}
      </div>
      <h1 style="margin:0 0 12px;font-size:36px;line-height:1.15;">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px;font-size:18px;line-height:1.6;color:#cbd5e1;">${escapeHtml(description)}</p>
      <p style="margin:0;font-size:14px;color:#94a3b8;">
        Redirecting to the challenge…
        <a href="${escapeHtml(targetUrl)}" style="color:#fbbf24;">Open it here</a>
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
