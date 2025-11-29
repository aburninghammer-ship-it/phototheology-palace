import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackEmailRequest {
  category: string;
  title: string;
  description: string;
  userEmail?: string;
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max 5 requests per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": "3600"
          } 
        }
      );
    }

    const { category, title, description, userEmail }: FeedbackEmailRequest = await req.json();

    // Basic input validation
    if (!category || !title || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs to prevent email injection
    const sanitizedCategory = category.slice(0, 100).replace(/[\r\n<>]/g, '');
    const sanitizedTitle = title.slice(0, 200).replace(/[\r\n<>]/g, '');
    const sanitizedDescription = description.slice(0, 5000).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sanitizedEmail = userEmail?.slice(0, 254).replace(/[\r\n<>]/g, '') || '';

    console.log("Sending feedback email:", { category: sanitizedCategory, title: sanitizedTitle, userEmail: sanitizedEmail });

    const emailResponse = await resend.emails.send({
      from: "Phototheology Feedback <onboarding@resend.dev>",
      to: ["aburninghammer@gmail.com"],
      subject: `New Feedback: ${sanitizedCategory} - ${sanitizedTitle}`,
      html: `
        <h2>New Feedback Submission</h2>
        <p><strong>Category:</strong> ${sanitizedCategory}</p>
        <p><strong>Title:</strong> ${sanitizedTitle}</p>
        <p><strong>Description:</strong></p>
        <p>${sanitizedDescription.replace(/\n/g, '<br>')}</p>
        ${sanitizedEmail ? `<p><strong>From:</strong> ${sanitizedEmail}</p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Feedback email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending feedback email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
