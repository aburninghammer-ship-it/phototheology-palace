import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHURCH-WELCOME-CAMPAIGN] ${step}${detailsStr}`);
};

const generateEmailHtml = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #141422; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 32px; }
    .header h1 { color: #ffffff; font-size: 28px; margin: 0 0 8px 0; letter-spacing: -0.5px; }
    .header .subtitle { color: #2da1c7; font-size: 16px; margin: 0; font-weight: 500; }
    .header .badge { display: inline-block; background: linear-gradient(135deg, #2563eb, #0d9488); color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
    .card { background: linear-gradient(135deg, #1c1c30 0%, #1e2640 100%); border: 1px solid rgba(37, 99, 235, 0.25); border-radius: 16px; padding: 32px; margin-bottom: 24px; }
    .greeting { color: #e2e8f0; font-size: 17px; line-height: 1.7; margin-bottom: 24px; }
    .feature-grid { display: grid; gap: 12px; margin: 0 0 24px 0; }
    .feature-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.12); border-radius: 10px; }
    .feature-icon { font-size: 20px; flex-shrink: 0; width: 28px; text-align: center; }
    .feature-text { color: #cbd5e1; font-size: 14px; line-height: 1.5; }
    .feature-text strong { color: #ffffff; font-weight: 600; }
    .highlight { color: #38bdf8; font-weight: 600; }
    .highlight-teal { color: #2dd4bf; font-weight: 600; }
    .cta-section { text-align: center; margin: 32px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb, #0d9488); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 18px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 8px 32px -8px rgba(37, 99, 235, 0.5); }
    .note { color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.6; margin-top: 24px; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(37, 99, 235, 0.3), rgba(13, 148, 136, 0.3), transparent); margin: 24px 0; }
    .footer { text-align: center; color: #475569; font-size: 12px; margin-top: 32px; line-height: 1.6; }
    .tagline { color: #38bdf8; font-size: 17px; font-style: italic; text-align: center; margin: 16px 0; }
    .accent-bar { height: 4px; background: linear-gradient(to right, #2563eb, #0d9488, #2dd4bf); border-radius: 2px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="accent-bar"></div>
    
    <div class="header">
      <h1>📖 The PhototheologyOS</h1>
      <p class="subtitle">A Gift from Living Manna to You</p>
      <span class="badge">Full Premium Access</span>
    </div>

    <div class="card">
      <div class="greeting">
        Dear ${name},<br><br>
        As a valued member of <span class="highlight">Living Manna Online Church</span>, Pastor Myers has opened the doors of the <span class="highlight-teal">PhototheologyOS</span> for you — a powerful digital platform designed to take your Bible study to an entirely new level.
      </div>

      <div class="divider"></div>

      <p style="color: #e2e8f0; font-size: 16px; font-weight: 600; margin-bottom: 16px;">Here's what's waiting for you inside:</p>

      <div class="feature-grid">
        <div class="feature-item">
          <span class="feature-icon">📖</span>
          <span class="feature-text"><strong>Phototheology Study Bible</strong> — AI-powered commentary, cross-references, and visual insights verse by verse</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">⛪</span>
          <span class="feature-text"><strong>Living Manna Church Space</strong> — Your digital home for fellowship, small groups, devotionals, and announcements</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🤖</span>
          <span class="feature-text"><strong>Study Buddy AI</strong> — A personal Bible study companion that answers your questions</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🧠</span>
          <span class="feature-text"><strong>Mind Map Palace</strong> — Visually map and memorize biblical themes, prophecies, and doctrines</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🗓️</span>
          <span class="feature-text"><strong>Daily Devotionals & Reading Plans</strong> — Structured plans to keep you in the Word daily</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">⚔️</span>
          <span class="feature-text"><strong>Christian Art of War Dojo</strong> — Spiritual warfare training grounded in Scripture</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎮</span>
          <span class="feature-text"><strong>Bible Games & Challenges</strong> — Engaging ways to test and grow your knowledge</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎤</span>
          <span class="feature-text"><strong>Sermon Builder</strong> — Tools for preparing powerful Bible-based messages</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🏛️</span>
          <span class="feature-text"><strong>Memory Palace</strong> — Memorize Scripture using proven memory techniques</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🃏</span>
          <span class="feature-text"><strong>Study Deck & Flashcards</strong> — Review and retain what you've learned</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎓</span>
          <span class="feature-text"><strong>Courses & Video Training</strong> — In-depth learning modules on key biblical topics</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="tagline">
        Now you can truly get <strong>Living Manna</strong> every day.
      </div>
    </div>

    <div class="cta-section">
      <p style="color: #cbd5e1; font-size: 16px; margin-bottom: 20px;">
        All you need to do is <strong style="color: #ffffff;">create your free account</strong> using this email address, and you'll have instant access:
      </p>
      <a href="https://phototheologybible.com/auth" class="cta-button">
        Create Your Account →
      </a>
    </div>

    <div class="card" style="padding: 20px;">
      <p class="note" style="margin: 0;">
        <strong style="color: #cbd5e1;">Important:</strong> Make sure to sign up with <strong style="color: #38bdf8;">this same email address</strong> so your Living Manna membership is automatically linked to your account. No invitation code needed — just sign up and you're in!
      </p>
    </div>

    <div class="footer">
      <p>Living Manna Online Church × PhototheologyOS</p>
      <p>If you have questions, reply to this email or reach out to your church leaders.</p>
    </div>
  </div>
</body>
</html>
`;
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body for options
    const body = await req.json().catch(() => ({}));
    const testMode = body.testMode || false;
    const testEmail = body.testEmail || null;

    // Get all pre-approved members for Living Manna who haven't claimed yet
    const { data: preapproved, error: paError } = await supabaseClient
      .from("church_preapproved_members")
      .select("email, churches(name)")
      .is("claimed_at", null);

    if (paError) throw paError;

    // Also get already-claimed members who might not have received the welcome email
    const { data: allPreapproved, error: allError } = await supabaseClient
      .from("church_preapproved_members")
      .select("email");

    if (allError) throw allError;

    const allEmails = allPreapproved?.map(m => m.email) || [];
    logStep("Total pre-approved emails found", { count: allEmails.length });

    // Build name map from email (extract first name before @, or use "Member")
    const nameMap = new Map<string, string>();
    // Names from the original list
    const emailToName: Record<string, string> = {
      'pprempeh@gmail.com': 'PJ',
      'silvia927.sa@gmail.com': 'Silvia',
      'gavinanthony1@gmail.com': 'Gavin',
      'norwalksonbeams@yahoo.com': 'Yvette',
      'bautista.phillip@gmail.com': 'Phillip',
      'breekeys28@gmail.com': 'Brianna',
      'karla.bivens@gmail.com': 'Karla',
      'jenigx@hotmail.com': 'Jennifer',
      'kennethbritt@hotmail.com': 'Kenneth',
      'teambroden@gmail.com': 'Adavid',
      'jossybroden@gmail.com': 'Jossy Ann',
      'jeannabrower1971@gmail.com': 'Jeanna',
      'rjpaint721@gmail.com': 'Ross',
      'nicolethehealthcoach@gmail.com': 'Marie Nicole',
      'carlson_michelle@hotmail.com': 'Michelle',
      'lovelydolll8dy@comcast.net': 'Laura',
      'drew.celaya@yahoo.com': 'Andrew',
      'bearssportsfan@yahoo.com': 'Trevor',
      'shacheb@gmail.com': 'Aisha',
      'clark7004@suddenlink.net': 'Danny',
      'clarkjacqueline13@gmail.com': 'Jacqueline',
      'pastorcooper@mac.com': 'Sheldon',
      'shanecooper94@gmail.com': 'Shane',
      'lcoppedge@hotmail.com': 'Lisa',
      'crysangel25@gmail.com': 'Crystal',
      'levaina7@live.com': 'Levaina',
      'alonso09@gmail.com': 'Dorman',
      'knicole.curtis@gmail.com': 'Katherine',
      'songstressjoy@hotmail.com': 'Joy',
      'patrice@livingmanna.live': 'Patrice',
      'marieearlington@gmail.com': 'Marie',
      'alyssia.plata@gmail.com': 'Alyssia',
      'amdegibson@gmail.com': 'Althea',
      'qpeazy7@yahoo.com': 'Pauline',
      'fit2ahtee@yahoo.com': 'Thomas',
      'godsrn33@yahoo.com': 'Gerrie',
      'johnnyoheasley69@gmail.com': 'Johnathon',
      'graham-henry@att.net': 'Graham',
      'pretty_tigger13@yahoo.com': 'Ashleigh',
      'mariajosehummel@gmail.com': 'Maria Jose',
      'terri.humphreys@ashgrove.com': 'Terri',
      'gnizzard@gmail.com': 'Gloria',
      'sdizzard@gmail.com': 'Sheila',
      'artice3201@gmail.com': 'Arthur',
      'artmon@bellsouth.net': 'Eunice',
      'd2rjohnson77@gmail.com': 'Dianna',
      'sharonfaye191973@gmail.com': 'Sharon',
      'deezinesd9@gmail.com': 'Denise',
      'gigi@livingmanna.church': 'Gennifer',
      'cyntiebevz@gmail.com': 'Linda',
      'windthinnet@yahoo.com': 'Michaela',
      'james@jak-cpas.com': 'James',
      'mkendrick@puc.edu': 'Michelle',
      'kdonna462@aol.com': 'Donna',
      'tracylofton2003@yahoo.com': 'Tracy',
      'shellyssnowdogs@gmail.com': 'Michelle',
      'followthecreator@live.com': 'Jodie',
      'mcdonalddonna@msn.com': 'Donna',
      'nursehmcdonald@icloud.com': 'Harriet',
      'pamc16@aol.com': 'Paulla',
      'kiyana.mckenzie@gmail.com': 'Kiyana',
      'pmitchellcsm@gmail.com': 'Pamela',
      'lesanndramorton@yahoo.com': 'Lesanndra',
      'amuller@capitalcitysdac.org': 'Audrey',
      'atontemyers@gmail.com': 'Atonte',
      'imyers@northeastern.org': 'Ivor',
      'laurence777nagy@gmail.com': 'Laurence',
      'mae23ann@gmail.com': 'Mae',
      'leafriser4197@yahoo.com': 'Sam',
      'jonesgenevia@hotmail.com': 'Genevia',
      'tbumphus82@gmail.com': 'Toccara',
      'tpchurchgirl@gmail.com': 'Terri',
      'sperkins@smbp.com': 'Shenay',
      'artelle@yahoo.com': 'Artelle',
      'newstart3tv@gmail.com': 'Demetrius',
      'regina.d.irector@gmail.com': 'Regina',
      'lorich84@yahoo.com': 'Lo-Ammi',
      'slrvlr6970@gmail.com': 'Samuel',
      'b.roni.sam.roderick@gmail.com': 'Veronica',
      'sandram.silas@gmail.com': 'Sandra',
      'amara_dk@hotmail.com': 'Amara',
      'bladeofhope17@gmail.com': 'Terry',
      'randyst.amant@gmail.com': 'Randy',
      'cstan705@cox.net': 'Charlotte',
      'drms.my.email@gmail.com': 'Debra',
      'kristinakmhomes@msn.com': 'Kristina',
      'mykmhomes@msn.com': 'Michael',
      'gabrieltuailuuluu@gmail.com': 'Gabriel',
      'eelco.vanderveen@gmail.com': 'Eelco',
      'anavan631@gmail.com': 'Anastasia',
      'wordink@yahoo.com': 'Elaine',
      'mhamilton144@yahoo.com': 'Mattina',
      'doctorwhyte@gmail.com': 'Ricardo',
      'delewonyoung@gmail.com': 'Delewon',
      'lynne.zeigler7@gmail.com': 'Lynne',
    };

    let recipients: { email: string; name: string }[];

    if (testMode && testEmail) {
      recipients = [{ email: testEmail, name: 'Test User' }];
      logStep("Test mode", { testEmail });
    } else {
      recipients = allEmails.map(email => ({
        email,
        name: emailToName[email.toLowerCase()] || 'Beloved Member',
      }));
    }

    logStep("Sending to recipients", { count: recipients.length });

    // Send in batches of 50
    const batchSize = 50;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      try {
        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch.map(r => ({
            from: "Living Manna Church <support@thephototheologyapp.com>",
            to: [r.email],
            subject: "🏰 Welcome to the PhototheologyOS — Your Access is Ready!",
            html: generateEmailHtml(r.name),
          }))),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logStep("Batch error", { batch: i / batchSize, error: errorText });
          errors.push(`Batch ${i / batchSize}: ${errorText}`);
        } else {
          totalSent += batch.length;
          logStep("Batch sent", { batch: i / batchSize, count: batch.length });
        }
      } catch (batchError: unknown) {
        const msg = batchError instanceof Error ? batchError.message : String(batchError);
        errors.push(`Batch ${i / batchSize}: ${msg}`);
      }

      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    logStep("Campaign complete", { totalSent, errors: errors.length });

    return new Response(
      JSON.stringify({
        success: true,
        sent: totalSent,
        total: recipients.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Sent welcome email to ${totalSent} of ${recipients.length} Living Manna members`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
