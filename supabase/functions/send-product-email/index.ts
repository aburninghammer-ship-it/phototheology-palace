import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Product configuration - maps product IDs to their details
const PRODUCT_CONFIG: Record<string, { 
  name: string; 
  files: string | string[];
  description: string;
}> = {
  "quick-start-guide": {
    name: "Phototheology Quick-Start Guide",
    files: "THE-PHOTOTHEOLOGY-QUICK-START-GUIDE.pdf",
    description: "Your complete introduction to the Phototheology system"
  },
  "genesis-6-days": {
    name: "Genesis in 6 Days",
    files: "GENESIS-IN-6-DAYS.pdf",
    description: "Master Genesis using the Phototheology method in just 6 days"
  },
  "study-suite": {
    name: "PhototheologyOS",
    files: ["FLOOR-2.pdf", "FLOOR-4-The-Next-Level-Floor.pdf", "FLOOR-6.pdf"],
    description: "The complete PhototheologyOS collection"
  },
};

interface SendProductEmailRequest {
  email: string;
  name?: string;
  product: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, product }: SendProductEmailRequest = await req.json();

    console.log("[send-product-email] Request received:", { email, name, product });

    if (!email || !product) {
      return new Response(
        JSON.stringify({ error: "Email and product are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productConfig = PRODUCT_CONFIG[product];
    if (!productConfig) {
      return new Response(
        JSON.stringify({ error: "Invalid product specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client to generate signed URLs
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bucketName = "products";
    const downloadLinks: { name: string; url: string }[] = [];

    // Generate signed URLs (valid for 7 days = 604800 seconds)
    const expirationSeconds = 604800;

    if (typeof productConfig.files === "string") {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(productConfig.files, expirationSeconds);

      if (error) {
        console.error("[send-product-email] Storage error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to generate download link" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      downloadLinks.push({
        name: productConfig.name,
        url: data.signedUrl
      });
    } else {
      for (const fileName of productConfig.files) {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(fileName, expirationSeconds);

        if (error) {
          console.error(`[send-product-email] Storage error for ${fileName}:`, error);
          continue;
        }

        const displayName = fileName
          .replace('.pdf', '')
          .replace(/-/g, ' ')
          .replace(/study suite (\d)/, 'Study Suite Part $1')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        downloadLinks.push({
          name: displayName,
          url: data.signedUrl
        });
      }
    }

    if (downloadLinks.length === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to generate any download links" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[send-product-email] Generated links:", downloadLinks.length);

    // Build download links HTML
    const downloadLinksHtml = downloadLinks.map(link => `
      <tr>
        <td style="padding: 16px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;">
          <a href="${link.url}" 
             style="display: inline-block; background: linear-gradient(135deg, #f5d742, #c9a800); color: #1a1a2e; 
                    padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            📥 Download ${link.name}
          </a>
        </td>
      </tr>
      <tr><td style="height: 12px;"></td></tr>
    `).join('');

    const customerName = name || email.split('@')[0];

    const emailResponse = await resend.emails.send({
      from: "Phototheology <noreply@thephototheologyapp.com>",
      to: [email],
      subject: `Your ${productConfig.name} is Ready for Download! 📖`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5d742; margin: 0; font-size: 28px;">
              Thank You for Your Purchase!
            </h1>
            <p style="color: #adb5bd; margin-top: 8px; font-size: 16px;">
              Your download is ready
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 32px; border: 1px solid #e9ecef; border-top: none;">
            <p style="color: #495057; font-size: 16px; line-height: 1.6;">
              Hi ${customerName},
            </p>
            
            <p style="color: #495057; font-size: 16px; line-height: 1.6;">
              Thank you for purchasing <strong>${productConfig.name}</strong>! 
              ${productConfig.description}.
            </p>

            <div style="margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; text-align: center;">
              <h2 style="color: #f5d742; margin: 0 0 16px 0; font-size: 20px;">
                📥 Your Download${downloadLinks.length > 1 ? 's' : ''}
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${downloadLinksHtml}
              </table>
              <p style="color: #adb5bd; font-size: 12px; margin-top: 16px;">
                Links expire in 7 days. Having trouble? Visit phototheologybible.com for support.
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #f5d742;">
              <h3 style="color: #1a1a2e; margin: 0 0 8px 0; font-size: 16px;">💡 What's Next?</h3>
              <p style="color: #495057; margin: 0; font-size: 14px; line-height: 1.6;">
                Ready to explore the entire Phototheology Palace? Start your 7-day free trial 
                and unlock all 8 Floors, 40+ Rooms, and AI-guided study tools at 
                <a href="https://phototheologybible.com/pricing" style="color: #007bff;">phototheologybible.com/pricing</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #212529; padding: 24px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #f5d742; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
              The Phototheology App
            </p>
            <p style="color: #6c757d; margin: 0; font-size: 12px;">
              Questions? Reply to this email or contact support@phototheologybible.com
            </p>
            </p>
          </div>
        </div>
      `,
    });

    console.log("[send-product-email] Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[send-product-email] Error:", error);
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
