import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CAMPAIGN-EMAIL] ${step}${detailsStr}`);
};

// Admin notification helper using fetch
const sendAdminNotification = async (
  resendApiKey: string, 
  adminEmail: string, 
  subject: string, 
  html: string
) => {
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PhotoTheology <support@thephototheologyapp.com>",
        to: [adminEmail],
        subject,
        html,
      }),
    });
    logStep("Admin notification sent", { subject });
  } catch (err: any) {
    logStep("Failed to send admin notification", { error: err?.message });
  }
};

const mapUserIdsToEmails = async (
  supabaseAdmin: any,
  userIds: string[],
  perPage = 1000,
  maxPages = 50,
) => {
  const remaining = new Set(userIds.filter(Boolean));
  const emailMap = new Map<string, string>();

  for (let page = 1; page <= maxPages && remaining.size > 0; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });

    if (error) {
      logStep("Error listing auth users", { error: error.message, page, perPage });
      break;
    }

    const users = data?.users ?? [];
    if (users.length === 0) break;

    for (const user of users) {
      if (user?.email && remaining.has(user.id)) {
        emailMap.set(user.id, user.email);
        remaining.delete(user.id);
      }
    }

    // No more pages
    if (users.length < perPage) break;
  }

  if (remaining.size > 0) {
    logStep("Auth email lookup incomplete", {
      requested: userIds.length,
      found: emailMap.size,
      missing: remaining.size,
    });
  }

  return emailMap;
};

// Win-Back Campaign Emails (7-email series highlighting improvements)
const WIN_BACK_EMAILS = [
  {
    day: 0,
    subject: "🎬 See PhotoTheology in Action — A New Way to Study Scripture",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 50%, #4ecdc4 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 28px; margin-bottom: 8px; text-align: center;">
            ✨ PhotoTheology Has Evolved ✨
          </h1>
          <p style="text-align: center; color: #4ecdc4; font-size: 16px; margin-bottom: 24px;">
            And we'd love to show you what's new
          </p>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Since you last visited, we've been hard at work making PhotoTheology more intuitive, more powerful, and more beautiful than ever.
          </p>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Instead of telling you about it, we want to <strong style="color: #f5d742;">show you</strong>. Watch this overview to see the Palace system in action:
          </p>
          
          <!-- YouTube Video Card -->
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #4ecdc4;">
            <p style="color: #ff6b6b; font-weight: bold; margin: 0 0 12px 0; font-size: 14px;">🎥 FEATURED VIDEO</p>
            <p style="color: #f5d742; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">The PhotoTheology Palace System Explained</p>
            <div style="text-align: center;">
              <a href="https://www.youtube.com/watch?v=TOhylk-3B58&t=1753s" style="display: inline-block; background: #ff6b6b; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
                ▶ Watch Now on YouTube
              </a>
            </div>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            PhotoTheology isn't just a Bible app — it's a <strong style="color: #4ecdc4;">complete system of interpretation</strong> that trains you to see Christ in every chapter of Scripture.
          </p>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic;">
            Over the next week, we'll share the specific improvements we've made. But first, watch the video above to see what makes this system unique.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 100%); color: #1a1a2e; padding: 16px 36px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Explore the New PhotoTheology
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">
            — The PhotoTheology Team
          </p>
        </div>
      </div>
    `
  },
  {
    day: 2,
    subject: "🏰 NEW: The Guided Palace Tour Makes Learning Easy",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <p style="color: #4ecdc4; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">IMPROVEMENT #1</p>
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px;">
            🏰 The New Guided Palace Tour
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            One of the biggest pieces of feedback we received was that the 8-Floor Palace felt overwhelming at first. <strong style="color: #4ecdc4;">We listened.</strong>
          </p>
          
          <!-- Feature Box -->
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2a2a4e 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #4ecdc4;">
            <p style="color: #f5d742; font-weight: bold; margin: 0 0 16px 0;">✨ What's New:</p>
            <ul style="margin: 0; padding-left: 20px; color: #e5e5e5; line-height: 2;">
              <li><strong style="color: #4ecdc4;">Interactive Palace Tour</strong> — A step-by-step introduction to each floor</li>
              <li><strong style="color: #ff6b6b;">Room-by-Room Guidance</strong> — Clear explanations before you dive in</li>
              <li><strong style="color: #f5d742;">Progress Tracking</strong> — See exactly where you are in your journey</li>
              <li><strong style="color: #4ecdc4;">15-Minute First Session</strong> — No more guessing where to start</li>
            </ul>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Now when you enter PhotoTheology, you're guided through the <strong style="color: #f5d742;">Story Room</strong>, <strong style="color: #ff6b6b;">24FPS Room</strong>, and <strong style="color: #4ecdc4;">Imagination Room</strong> with clear instructions and practice exercises.
          </p>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic;">
            No more feeling lost. The path is now clearly marked.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/palace" style="display: inline-block; background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%); color: #1a1a2e; padding: 16px 36px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Take the Palace Tour
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 4,
    subject: "🤖 Meet Jeeves — Your AI Study Partner",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <p style="color: #ff6b6b; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">IMPROVEMENT #2</p>
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px;">
            🤖 Introducing Jeeves, Your Personal Study Partner
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Imagine having a knowledgeable Bible scholar available 24/7 to answer your questions, guide your studies, and help you discover insights you'd never find on your own.
          </p>
          
          <!-- AI Feature Box -->
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #ff6b6b;">
            <p style="color: #f5d742; font-weight: bold; margin: 0 0 16px 0; font-size: 18px;">🎩 What Jeeves Can Do:</p>
            <div style="display: grid; gap: 12px;">
              <div style="background: rgba(255, 107, 107, 0.1); padding: 12px; border-radius: 8px;">
                <span style="color: #ff6b6b;">📖</span> <span style="color: #e5e5e5;">Answer questions about any passage using PhotoTheology principles</span>
              </div>
              <div style="background: rgba(78, 205, 196, 0.1); padding: 12px; border-radius: 8px;">
                <span style="color: #4ecdc4;">🔍</span> <span style="color: #e5e5e5;">Find Christ-connections across the entire Bible</span>
              </div>
              <div style="background: rgba(245, 215, 66, 0.1); padding: 12px; border-radius: 8px;">
                <span style="color: #f5d742;">💡</span> <span style="color: #e5e5e5;">Generate study guides, sermon outlines, and teaching materials</span>
              </div>
              <div style="background: rgba(255, 107, 107, 0.1); padding: 12px; border-radius: 8px;">
                <span style="color: #ff6b6b;">🎯</span> <span style="color: #e5e5e5;">Explain complex prophetic timelines and sanctuary symbolism</span>
              </div>
            </div>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Jeeves isn't just any AI — he's trained on the <strong style="color: #f5d742;">entire PhotoTheology methodology</strong>, including all 8 floors, the cycles of history, and the sanctuary framework.
          </p>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic;">
            Ask him anything. He's ready to help.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/chat" style="display: inline-block; background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%); color: #fff; padding: 16px 36px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Chat with Jeeves Now
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 6,
    subject: "📚 NEW: Daily Challenges & Reading Plans",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #f5d742 0%, #f39c12 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <p style="color: #f5d742; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">IMPROVEMENT #3</p>
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px;">
            📚 Daily Challenges & Structured Reading Plans
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            We've added daily practice that keeps you engaged without overwhelming you. Each day brings a new opportunity to apply PhotoTheology principles.
          </p>
          
          <!-- Challenge Types -->
          <div style="margin: 24px 0;">
            <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 20px; margin-bottom: 12px; border-left: 4px solid #f5d742;">
              <p style="color: #f5d742; font-weight: bold; margin: 0 0 8px 0;">🌅 Daily Challenges</p>
              <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">Quick 5-10 minute exercises that train your PhotoTheological reflexes. New challenge every day!</p>
            </div>
            <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 20px; margin-bottom: 12px; border-left: 4px solid #4ecdc4;">
              <p style="color: #4ecdc4; font-weight: bold; margin: 0 0 8px 0;">📖 Reading Plans</p>
              <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">7-day, 30-day, and custom plans that guide you through Scripture with PhotoTheology lenses.</p>
            </div>
            <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #ff6b6b;">
              <p style="color: #ff6b6b; font-weight: bold; margin: 0 0 8px 0;">🏆 Streaks & Progress</p>
              <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">Track your consistency and watch your understanding deepen over time.</p>
            </div>
          </div>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic;">
            Consistency beats intensity. A little each day changes everything.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/challenges" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #f39c12 100%); color: #1a1a2e; padding: 16px 36px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Start Today's Challenge
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 8,
    subject: "💎 The Gems Room — Save Your Best Insights Forever",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #9b59b6 0%, #8e44ad 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <p style="color: #9b59b6; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">IMPROVEMENT #4</p>
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px;">
            💎 The Enhanced Gems Room
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Every time you discover something powerful in Scripture — a connection, an insight, a Christ-moment — you can now <strong style="color: #9b59b6;">save it as a Gem</strong> and return to it anytime.
          </p>
          
          <!-- Gems Feature -->
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #9b59b6; text-align: center;">
            <p style="font-size: 48px; margin: 0;">💎</p>
            <p style="color: #f5d742; font-weight: bold; margin: 16px 0 8px 0; font-size: 18px;">Your Personal Treasury</p>
            <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">Save insights • Add notes • Build your collection • Share with others</p>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            The Gems Room is like having a <strong style="color: #4ecdc4;">personal treasure chest</strong> of biblical insights. Over time, it becomes your go-to resource for sermons, teaching, and personal reflection.
          </p>
          
          <div style="background: rgba(155, 89, 182, 0.1); padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #9b59b6; font-weight: bold; margin: 0 0 8px 0;">💡 Pro Tip:</p>
            <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">After any study session with Jeeves, click "Save as Gem" to preserve your best discoveries!</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/study" style="display: inline-block; background: linear-gradient(90deg, #9b59b6 0%, #8e44ad 100%); color: #fff; padding: 16px 36px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Start Collecting Gems
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 10,
    subject: "🔮 Prophecy & Sanctuary — The Vision Floor Awaits",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #3498db 0%, #2980b9 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <p style="color: #3498db; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">IMPROVEMENT #5</p>
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px;">
            🔮 The Vision Floor: Prophecy & Sanctuary United
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Floor 5 of the Palace is where everything connects. Here, the <strong style="color: #3498db;">sanctuary blueprint</strong> and <strong style="color: #ff6b6b;">prophetic timelines</strong> merge into one coherent vision.
          </p>
          
          <!-- Vision Floor Features -->
          <div style="margin: 24px 0;">
            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
              <div style="flex: 1; background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 16px; text-align: center;">
                <p style="font-size: 32px; margin: 0;">🏛️</p>
                <p style="color: #3498db; font-weight: bold; margin: 8px 0 4px 0;">Blue Room</p>
                <p style="color: #a0a0a0; font-size: 13px; margin: 0;">Sanctuary Blueprint</p>
              </div>
              <div style="flex: 1; background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 16px; text-align: center;">
                <p style="font-size: 32px; margin: 0;">🔭</p>
                <p style="color: #ff6b6b; font-weight: bold; margin: 8px 0 4px 0;">Prophecy Room</p>
                <p style="color: #a0a0a0; font-size: 13px; margin: 0;">Daniel & Revelation</p>
              </div>
              <div style="flex: 1; background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 16px; text-align: center;">
                <p style="font-size: 32px; margin: 0;">👼</p>
                <p style="color: #f5d742; font-weight: bold; margin: 8px 0 4px 0;">Three Angels</p>
                <p style="color: #a0a0a0; font-size: 13px; margin: 0;">Final Messages</p>
              </div>
            </div>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            We've enhanced this floor with <strong style="color: #4ecdc4;">interactive timelines</strong>, <strong style="color: #f5d742;">visual sanctuary tours</strong>, and clear connections between ancient prophecy and present truth.
          </p>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic;">
            When you see how the sanctuary explains prophecy, everything clicks into place.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/palace" style="display: inline-block; background: linear-gradient(90deg, #3498db 0%, #2980b9 100%); color: #fff; padding: 16px 36px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Explore the Vision Floor
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 12,
    subject: "🌟 Your Invitation to Return — Everything Has Changed",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 50%, #4ecdc4 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 28px; margin-bottom: 24px; text-align: center;">
            🌟 A Fresh Start Awaits 🌟
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Over the past two weeks, we've shared the major improvements we've made to PhotoTheology. Let's recap:
          </p>
          
          <!-- Recap Grid -->
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="color: #4ecdc4;">✓</span> <strong style="color: #f5d742;">Guided Palace Tour</strong> <span style="color: #a0a0a0;">— Step-by-step introduction</span>
            </div>
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="color: #4ecdc4;">✓</span> <strong style="color: #ff6b6b;">Jeeves AI Partner</strong> <span style="color: #a0a0a0;">— 24/7 study companion</span>
            </div>
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="color: #4ecdc4;">✓</span> <strong style="color: #f5d742;">Daily Challenges</strong> <span style="color: #a0a0a0;">— Consistent practice</span>
            </div>
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="color: #4ecdc4;">✓</span> <strong style="color: #9b59b6;">Enhanced Gems Room</strong> <span style="color: #a0a0a0;">— Save your insights</span>
            </div>
            <div>
              <span style="color: #4ecdc4;">✓</span> <strong style="color: #3498db;">Vision Floor</strong> <span style="color: #a0a0a0;">— Prophecy & sanctuary united</span>
            </div>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            PhotoTheology is a <strong style="color: #4ecdc4;">system of interpretation</strong> that will change how you read Scripture forever. It's designed for slow, intentional study — best experienced on <strong>desktop or laptop</strong>.
          </p>
          
          <div style="background: rgba(245, 215, 66, 0.1); border: 2px solid #f5d742; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: #f5d742; font-weight: bold; margin: 0 0 8px 0; font-size: 18px;">Ready for a Fresh Start?</p>
            <p style="color: #e5e5e5; margin: 0;">Your account is waiting. Everything you need has been improved.</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 50%, #4ecdc4 100%); color: #1a1a2e; padding: 18px 48px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">
              Return to PhotoTheology
            </a>
          </div>
          
          <p style="text-align: center; margin-top: 24px; color: #a0a0a0; font-style: italic;">
            We're here when you're ready. Take your time.
          </p>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  }
];

// Trial Conversion Campaign (7-day guided path)
const TRIAL_EMAILS = [
  {
    day: 0,
    subject: "Welcome to Your 7-Day Orientation — Read This First",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Your Week of Orientation Begins</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Welcome. This week is not about seeing everything — it's about learning <strong style="color: #f5d742;">how to study here</strong>.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          PhotoTheology is a system of interpretation, not a Bible app. It works best when entered slowly, with intention, on a <strong>desktop or laptop</strong>.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Over the next 7 days, we'll guide you through foundational sessions that teach you the method — not just the content.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">Today's Focus:</p>
          <p style="margin: 8px 0 0 0;">Open the dashboard. Locate the "Start Here" path. Begin with the Palace Tour.</p>
        </div>
        
        <p style="line-height: 1.7; margin-bottom: 16px; color: #a0a0a0; font-style: italic;">
          Do not rush ahead. This week's purpose is orientation, not completion.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/dashboard" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Begin Your Orientation
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    day: 2,
    subject: "Days 1–2: Your First Sessions Matter Most",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">The Foundation Is Being Laid</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          By now, you should have completed the Palace Tour and explored the 24FPS Room or Story Room.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          These first sessions are not "getting started" — they <em>are</em> the method. Everything else builds on what you're learning now.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">Today's Focus:</p>
          <p style="margin: 8px 0 0 0;">Complete one study in the Story Room. Focus on visual recall. Ask Jeeves a question about what you read.</p>
        </div>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          If you haven't started yet, today is the day. 15 minutes is enough to begin.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Continue Your Training
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    day: 4,
    subject: "Days 3–4: Integration Time",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Now It Starts to Connect</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          You've completed foundational sessions. Now it's time to see how the rooms work together.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          The Concentration Room teaches you to find Christ in every text. The Questions Room trains you to interrogate passages like a detective. The Gems Room stores your discoveries.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">Today's Focus:</p>
          <p style="margin: 8px 0 0 0;">Try a Daily Challenge. Then save your first Gem. These two actions connect what you learn to what you keep.</p>
        </div>
        
        <p style="line-height: 1.7; margin-bottom: 16px; color: #a0a0a0; font-style: italic;">
          You're not meant to master everything this week — you're meant to feel the structure.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/challenges" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Try Today's Challenge
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    day: 5,
    subject: "Day 5: You May Feel the Stretch — That's Normal",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Discomfort Is Part of Growth</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          By now, you may feel slightly overwhelmed. There's more here than you expected.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          That's <em>normal</em>. PhotoTheology isn't designed to be consumed in a week. It's designed to form you over months and years.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          The trial isn't about completion — it's about deciding whether this method of study is worth continuing.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">Today's Focus:</p>
          <p style="margin: 8px 0 0 0;">Slow down. Return to the Story Room or 24FPS. Spend 10 minutes with one chapter. Don't rush.</p>
        </div>
        
        <p style="line-height: 1.7; margin-bottom: 16px; color: #a0a0a0; font-style: italic;">
          Confusion usually means you're moving too fast. Clarity comes from slowing down.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Stay With the Structure
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    day: 6,
    subject: "Day 6: What Changes After You Subscribe",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">What Subscription Actually Means</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Tomorrow your trial ends. Let's be clear about what changes if you subscribe.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          You don't get "more content." You get <strong style="color: #f5d742;">continuity</strong> — the ability to keep training without interruption.
        </p>
        
        <ul style="line-height: 1.9; margin-bottom: 20px; padding-left: 20px;">
          <li>Full access to all 8 floors of the Palace</li>
          <li>Prophecy integration and sanctuary mapping</li>
          <li>Jeeves — your AI study partner — without limits</li>
          <li>Daily Challenges and community participation</li>
          <li>Structured growth paths from Beginner to Master</li>
        </ul>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          The method doesn't change. But your access to it becomes unlimited.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/pricing" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            View Subscription Options
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    day: 7,
    subject: "Day 7: Continue Your Training",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Your Trial Ends Today</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          This week you experienced the foundation of PhotoTheology. You've seen how the Palace works, how Christ centers every text, and how the rooms build on each other.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          If you found value in what you experienced — even just a glimpse — subscription allows you to continue without starting over.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Your progress, your gems, your notes — they'll all remain. You'll pick up exactly where you left off.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742;">
            This is an invitation, not a demand. If you're not ready, that's okay. But if you are — extend your study today.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/pricing" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Extend Your Study
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  }
];

// Subscriber Engagement Campaign (ongoing monthly)
const ENGAGEMENT_EMAILS = [
  {
    week: 1,
    subject: "What Changes as You Grow in PhotoTheology",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Growth Looks Different Here</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          You're not "using a product." You're training as an interpreter.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          In most Bible apps, progress means reading more chapters. Here, progress means <strong style="color: #f5d742;">seeing more clearly</strong> — recognizing patterns, finding Christ in unexpected places, moving through the floors with increasing fluency.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Slow down. The goal isn't speed. It's clarity.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">This Month's Focus:</p>
          <p style="margin: 8px 0 0 0;">Return to the 1st Floor rooms this week. Notice what you see now that you missed before. That's growth.</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Return to the Structure
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    week: 2,
    subject: "Why the Foundational Rooms Still Matter",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Foundations Are Not Just for Beginners</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          The Story Room. The 24FPS Room. The Observation Room.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          These are the first rooms you encounter — but they're also the ones you should return to regularly.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Mastery doesn't mean moving past foundations. It means <em>integrating them so deeply</em> that they become reflexive.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">Integration Exercise:</p>
          <p style="margin: 8px 0 0 0;">Pick one book of the Bible. Spend 10 minutes in the Story Room with chapter 1. Then open the Concentration Room and find Christ in the same chapter. Notice how the rooms build on each other.</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Continue Where You Are
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    week: 3,
    subject: "Recalibration Is Part of Maturity",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Sometimes You Need to Step Back</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          If you've been pushing forward and feeling stuck — that's not failure. It's a signal.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          PhotoTheology is designed for recalibration. The higher floors require the lower floors to be solid. If you're struggling on Floor 4, return to Floor 2.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Recalibration is not regression. It's <strong style="color: #f5d742;">integration</strong>.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">This Week's Challenge:</p>
          <p style="margin: 8px 0 0 0;">Return to a room you haven't visited in a while. Spend 15 minutes there. Notice what feels different now.</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/dashboard" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Slow Down and Integrate
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  },
  {
    week: 4,
    subject: "Prepare for Your Next Level",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">The Path Ahead</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Another month of training. Another layer of clarity.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          PhotoTheology doesn't rush you. But it does invite you forward — into deeper integration, fuller understanding, and more confident interpretation.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Christ remains the interpretive center at every level. The method doesn't change. Your mastery of it does.
        </p>
        
        <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0; color: #f5d742; font-weight: bold;">Monthly Review:</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>How many gems have you saved this month?</li>
            <li>Which room feels most natural now?</li>
            <li>Where do you feel the stretch?</li>
          </ul>
        </div>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Mastery is earned, not rushed. Keep going.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/dashboard" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Prepare for Your Next Level
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    `
  }
];

// Conversion Campaign for Non-Paying Users (5-email sequence)
const CONVERSION_EMAILS = [
  {
    day: 0,
    subject: "💎 What PhotoTheology Users Are Discovering",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 50%, #4ecdc4 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 8px; text-align: center;">
            Real Stories from Real Learners
          </h1>
          <p style="text-align: center; color: #4ecdc4; font-size: 16px; margin-bottom: 24px;">
            What happens when you commit to the method
          </p>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            We noticed you've explored PhotoTheology but haven't started your full journey yet. Here's what others are experiencing:
          </p>
          
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #f5d742;">
            <p style="color: #f5d742; font-size: 14px; margin: 0 0 12px 0;">⭐ MEMBER TESTIMONIAL</p>
            <p style="color: #e5e5e5; line-height: 1.8; margin: 0; font-style: italic;">
              "I've studied the Bible for 30 years, but PhotoTheology taught me HOW to study. The Palace system gave me a structure I never knew I was missing. Now I find Christ in every chapter — not because I'm told to, but because I see Him."
            </p>
            <p style="color: #4ecdc4; margin: 12px 0 0 0; font-weight: bold;">— Pastor Marcus, Georgia</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #4ecdc4;">
            <p style="color: #4ecdc4; font-size: 14px; margin: 0 0 12px 0;">⭐ MEMBER TESTIMONIAL</p>
            <p style="color: #e5e5e5; line-height: 1.8; margin: 0; font-style: italic;">
              "Jeeves isn't just an AI — it's like having a study partner who knows the entire Bible and is always patient. I ask questions I'd be embarrassed to ask anyone else."
            </p>
            <p style="color: #ff6b6b; margin: 12px 0 0 0; font-weight: bold;">— Sarah, Tennessee</p>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #a0a0a0; font-style: italic; text-align: center;">
            Your 7-day trial includes full access to everything. No charge until day 8.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/pricing?trial=true" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 100%); color: #1a1a2e; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">
              Start Your Free Trial
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 2,
    subject: "🏰 Why 800+ Believers Chose the Palace Method",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px; text-align: center;">
            The 8-Floor Palace System
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Most Bible apps give you content. PhotoTheology gives you a <strong style="color: #f5d742;">method</strong>.
          </p>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            The Palace is an 8-floor system of interpretation, where each floor builds on the one below:
          </p>
          
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
            <table style="width: 100%; color: #e5e5e5; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #3a3a5e;">
                  <span style="color: #f5d742; font-weight: bold;">Floor 1–2:</span> Memory & Investigation
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #3a3a5e;">
                  <span style="color: #4ecdc4; font-weight: bold;">Floor 3:</span> Freestyle Connections
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #3a3a5e;">
                  <span style="color: #ff6b6b; font-weight: bold;">Floor 4–5:</span> Christ-Centered Depth & Prophecy
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #3a3a5e;">
                  <span style="color: #f5d742; font-weight: bold;">Floor 6:</span> Cosmic Context & Cycles
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <span style="color: #4ecdc4; font-weight: bold;">Floor 7–8:</span> Transformation & Mastery
                </td>
              </tr>
            </table>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            By the time you reach Floor 8, you don't need the rooms anymore — the method has become <strong style="color: #4ecdc4;">reflexive thought</strong>.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/pricing?trial=true" style="display: inline-block; background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%); color: #1a1a2e; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">
              Explore the Palace — Free for 7 Days
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 4,
    subject: "🤖 Meet Jeeves — Your AI Study Partner",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px; text-align: center;">
            🤖 Jeeves: AI That Speaks PhotoTheology
          </h1>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Jeeves isn't ChatGPT with a Bible skin. He's trained on the entire PhotoTheology system — the Palace, the Cycles, the Heavens, the Rooms.
          </p>
          
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #ff6b6b;">
            <p style="color: #ff6b6b; font-weight: bold; margin: 0 0 16px 0;">Ask Jeeves anything:</p>
            <ul style="margin: 0; padding-left: 20px; color: #e5e5e5; line-height: 2;">
              <li>"Where is Christ in Genesis 38?"</li>
              <li>"What cycle does Daniel 7 belong to?"</li>
              <li>"Help me understand the Types Room"</li>
              <li>"Grade my interpretation of John 3"</li>
              <li>"Generate a Gem from Psalm 22"</li>
            </ul>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Jeeves is available in <strong style="color: #f5d742;">every room</strong> of the Palace. He guides, teaches, grades, and helps you think Phototheologically.
          </p>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic;">
            Imagine having a study partner available 24/7 who never gets tired of your questions.
          </p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/pricing?trial=true" style="display: inline-block; background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%); color: #fff; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">
              Try Jeeves Free for 7 Days
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 6,
    subject: "📊 Your Bible Study: Before vs. After",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #f5d742 0%, #4ecdc4 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 24px; text-align: center;">
            The Difference is Clear
          </h1>
          
          <div style="display: flex; gap: 16px; margin: 24px 0;">
            <div style="flex: 1; background: rgba(239, 68, 68, 0.1); border-radius: 12px; padding: 20px; border: 2px solid #ef4444;">
              <p style="color: #ef4444; font-weight: bold; margin: 0 0 12px 0;">❌ WITHOUT PHOTOTHEOLOGY</p>
              <ul style="margin: 0; padding-left: 18px; color: #e5e5e5; line-height: 1.8; font-size: 14px;">
                <li>Random reading, no structure</li>
                <li>Struggling to see Christ in hard texts</li>
                <li>Forgetting what you read</li>
                <li>Stuck at surface meaning</li>
                <li>Dependent on commentaries</li>
              </ul>
            </div>
            <div style="flex: 1; background: rgba(34, 197, 94, 0.1); border-radius: 12px; padding: 20px; border: 2px solid #22c55e;">
              <p style="color: #22c55e; font-weight: bold; margin: 0 0 12px 0;">✅ WITH PHOTOTHEOLOGY</p>
              <ul style="margin: 0; padding-left: 18px; color: #e5e5e5; line-height: 1.8; font-size: 14px;">
                <li>8-floor guided system</li>
                <li>Christ visible in EVERY chapter</li>
                <li>Visual memory techniques</li>
                <li>Depth + prophecy + application</li>
                <li>Independent interpreter</li>
              </ul>
            </div>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5; text-align: center;">
            PhotoTheology doesn't just teach you the Bible — it teaches you <strong style="color: #f5d742;">how to study it for the rest of your life</strong>.
          </p>
          
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: #4ecdc4; font-size: 24px; font-weight: bold; margin: 0;">Starting at just $9/month</p>
            <p style="color: #a0a0a0; margin: 8px 0 0 0;">Less than a cup of coffee per week</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/pricing?trial=true" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #4ecdc4 100%); color: #1a1a2e; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">
              Start Your Transformation
            </a>
          </div>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  },
  {
    day: 8,
    subject: "⏰ Final Invitation: Join the PhotoTheology Community",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <div style="background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 50%, #4ecdc4 100%); padding: 4px;"></div>
        
        <div style="padding: 32px;">
          <h1 style="color: #f5d742; font-size: 26px; margin-bottom: 8px; text-align: center;">
            ⏰ One Final Invitation
          </h1>
          <p style="text-align: center; color: #4ecdc4; font-size: 16px; margin-bottom: 24px;">
            The Palace doors are open
          </p>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Over the past week, we've shared what makes PhotoTheology different:
          </p>
          
          <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
            <ul style="margin: 0; padding-left: 20px; color: #e5e5e5; line-height: 2.2;">
              <li>✅ <strong style="color: #f5d742;">Real testimonials</strong> from believers who transformed their study</li>
              <li>✅ <strong style="color: #4ecdc4;">The 8-Floor Palace</strong> — a complete system of interpretation</li>
              <li>✅ <strong style="color: #ff6b6b;">Jeeves AI</strong> — your always-available study partner</li>
              <li>✅ <strong style="color: #f5d742;">Before/After</strong> — what structured study looks like</li>
            </ul>
          </div>
          
          <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
            Now it's your turn. The 7-day free trial gives you <strong style="color: #f5d742;">full access</strong> to everything — no restrictions, no charge until day 8.
          </p>
          
          <div style="background: rgba(245, 215, 66, 0.1); border: 2px solid #f5d742; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: #f5d742; font-size: 18px; font-weight: bold; margin: 0 0 8px 0;">🎁 Special Offer</p>
            <p style="color: #e5e5e5; margin: 0;">Start today and your first 7 days are completely free.</p>
            <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 14px;">Cancel anytime before day 8 — no questions asked.</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://phototheologybible.com/pricing?trial=true" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 100%); color: #1a1a2e; padding: 20px 48px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 20px;">
              Start Your Free Trial Now
            </a>
          </div>
          
          <p style="line-height: 1.8; color: #a0a0a0; font-style: italic; text-align: center; margin-top: 24px;">
            This is the last email in our conversion series. If you have questions, just reply — we're here to help.
          </p>
        </div>
        
        <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #777;">— The PhotoTheology Team</p>
        </div>
      </div>
    `
  }
];

type CampaignType = 'winback' | 'trial' | 'engagement' | 'login_reminder' | 'conversion';

// Login Reminder Email for Stripe subscribers who haven't created accounts
const LOGIN_REMINDER_EMAIL = {
  subject: "🔑 Complete Your PhotoTheology Setup — You're Already Subscribed!",
  html: `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
      <div style="background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 50%, #4ecdc4 100%); padding: 4px;"></div>
      
      <div style="padding: 32px;">
        <h1 style="color: #f5d742; font-size: 28px; margin-bottom: 8px; text-align: center;">
          🔑 Your Account is Ready
        </h1>
        <p style="text-align: center; color: #4ecdc4; font-size: 16px; margin-bottom: 24px;">
          Just one step left to unlock PhotoTheology
        </p>
        
        <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
          Great news! Your PhotoTheology subscription is <strong style="color: #4ecdc4;">active</strong>, but we noticed you haven't created your account yet.
        </p>
        
        <p style="line-height: 1.8; margin-bottom: 16px; color: #e5e5e5;">
          To access the full Palace system, Jeeves AI, and all premium features, you just need to <strong style="color: #f5d742;">sign up with the same email</strong> you used for your subscription.
        </p>
        
        <div style="background: linear-gradient(135deg, #2a2a4e 0%, #1e3a5f 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #4ecdc4;">
          <p style="color: #f5d742; font-weight: bold; margin: 0 0 16px 0; font-size: 18px;">✨ Here's What's Waiting for You:</p>
          <ul style="margin: 0; padding-left: 20px; color: #e5e5e5; line-height: 2;">
            <li><strong style="color: #4ecdc4;">The 8-Floor Palace</strong> — Complete Bible study system</li>
            <li><strong style="color: #ff6b6b;">Jeeves AI</strong> — Your personal study partner</li>
            <li><strong style="color: #f5d742;">Daily Challenges</strong> — Build consistent habits</li>
            <li><strong style="color: #4ecdc4;">Gems Room</strong> — Save and organize insights</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheologybible.com/signup" style="display: inline-block; background: linear-gradient(90deg, #f5d742 0%, #ff6b6b 100%); color: #1a1a2e; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 18px;">
            Create Your Account Now
          </a>
        </div>
        
        <div style="background: rgba(78, 205, 196, 0.1); padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="color: #4ecdc4; font-weight: bold; margin: 0 0 8px 0;">💡 Important:</p>
          <p style="color: #e5e5e5; margin: 0; line-height: 1.6;">Use the <strong>same email address</strong> you used when subscribing to automatically link your premium access.</p>
        </div>
        
        <p style="line-height: 1.8; color: #a0a0a0; font-style: italic; text-align: center;">
          Questions? Just reply to this email — we're here to help!
        </p>
      </div>
      
      <div style="background: #0d0d1a; padding: 20px 32px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
      </div>
    </div>
  `
};

interface CampaignRequest {
  campaignType: CampaignType;
  testMode?: boolean;
  testEmail?: string;
  dayOverride?: number;
  forceSend?: boolean; // Ignore 30-day cooldown
}

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

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized - admin access required");
    logStep("Admin verified", { userId: userData.user.id });

    const { campaignType, testMode, testEmail, dayOverride, forceSend }: CampaignRequest = await req.json();
    logStep("Request parsed", { campaignType, testMode, forceSend });

    // Resend requires a verified sending domain for production sends.
    // Use thephototheologyapp.com which is the verified Resend domain.
    const defaultFromAddress = "PhotoTheology <support@thephototheologyapp.com>";
    const customFromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    const fromAddress = customFromEmail
      ? `PhotoTheology <${customFromEmail}>`
      : defaultFromAddress;

    logStep("Using from address", { fromAddress, testMode });

    let recipients: { email: string; userId: string; dayNumber?: number }[] = [];
    let emailTemplates: any[] = [];

    if (testMode && testEmail) {
      recipients = [{ email: testEmail, userId: 'test' }];
      
      if (campaignType === 'winback') {
        emailTemplates = [WIN_BACK_EMAILS[dayOverride || 0]];
      } else if (campaignType === 'trial') {
        emailTemplates = [TRIAL_EMAILS[dayOverride || 0]];
      } else if (campaignType === 'login_reminder') {
        emailTemplates = [LOGIN_REMINDER_EMAIL];
      } else if (campaignType === 'conversion') {
        emailTemplates = [CONVERSION_EMAILS[dayOverride || 0]];
      } else {
        emailTemplates = [ENGAGEMENT_EMAILS[dayOverride || 0]];
      }
    } else {
      // Get recipients based on campaign type
      if (campaignType === 'winback') {
        // Get users who created an account, explored briefly, but NEVER subscribed
        // These are NOT expired/cancelled - they never paid at all
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Target users from profiles who:
        // 1. Have no subscription or trial-only status
        // 2. Created account at least 7 days ago (gave them time to explore)
        // 3. Don't have lifetime access
        // 4. Have some activity (onboarding completed or first action)
        // Paginate to get ALL profiles (Supabase default limit is 1000)
        let allNeverSubscribedUsers: any[] = [];
        let profilePage = 0;
        const profilePageSize = 1000;
        
        while (true) {
          const { data: batch, error: batchError } = await supabaseClient
            .from('profiles')
            .select('id, created_at, onboarding_completed, first_meaningful_action_at')
            .or('subscription_status.is.null,subscription_status.eq.none,subscription_status.eq.trial_expired,subscription_status.eq.expired,subscription_status.eq.cancelled')
            .eq('has_lifetime_access', false)
            .lt('created_at', sevenDaysAgo.toISOString())
            .range(profilePage * profilePageSize, (profilePage + 1) * profilePageSize - 1);
          
          if (batchError) {
            logStep("Error fetching profiles batch", { error: batchError.message, page: profilePage });
            break;
          }
          if (!batch || batch.length === 0) break;
          
          allNeverSubscribedUsers = [...allNeverSubscribedUsers, ...batch];
          if (batch.length < profilePageSize) break;
          profilePage++;
        }
        
        const neverSubscribedUsers = allNeverSubscribedUsers;

        if (neverSubscribedUsers && neverSubscribedUsers.length > 0) {
          // Filter to those with some engagement (explored briefly)
          const engagedUsers = neverSubscribedUsers.filter(u => 
            u.onboarding_completed || u.first_meaningful_action_at
          );

          logStep("Winback initial filter", { 
            totalNeverSubscribed: neverSubscribedUsers.length,
            withEngagement: engagedUsers.length 
          });

          // Get emails from auth.users
          const userIds = engagedUsers.map(u => u.id);
          const userEmailMap = await mapUserIdsToEmails(supabaseClient, userIds);

          let recentUserIds = new Set<string>();
          
          if (!forceSend) {
            const { data: recentEmails } = await supabaseClient
              .from('email_logs')
              .select('user_id')
              .eq('campaign_type', 'winback')
              .gte('sent_at', thirtyDaysAgo.toISOString());

            recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);
          }
          
          recipients = engagedUsers
            .filter(u => userEmailMap.has(u.id) && !recentUserIds.has(u.id))
            .map(u => ({ email: userEmailMap.get(u.id)!, userId: u.id }));
          
          logStep("Winback recipients mapped", { 
            neverSubscribedCount: neverSubscribedUsers.length,
            engagedCount: engagedUsers.length,
            emailsFound: userEmailMap.size,
            afterRecentFilter: recipients.length,
            forceSend: !!forceSend
          });
        }

        emailTemplates = [WIN_BACK_EMAILS[0]]; // Start with first email in sequence

      } else if (campaignType === 'trial') {
        // Get users currently in trial
        const { data: trialUsers } = await supabaseClient
          .from('user_subscriptions')
          .select('user_id, trial_ends_at, created_at')
          .eq('subscription_status', 'trial')
          .not('trial_ends_at', 'is', null);

        if (trialUsers && trialUsers.length > 0) {
          const now = new Date();
          
          const userIds = trialUsers.map(u => u.user_id);
          const userEmailMap = await mapUserIdsToEmails(supabaseClient, userIds);
          
          for (const user of trialUsers) {
            const trialStart = new Date(user.created_at);
            const daysSinceStart = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
            
            // Find appropriate email for this day
            const emailForDay = TRIAL_EMAILS.find(e => e.day === daysSinceStart);
            
            if (emailForDay) {
              const userEmail = userEmailMap.get(user.user_id);

              // Check if already sent this day's email
              const { data: alreadySent } = await supabaseClient
                .from('email_logs')
                .select('id')
                .eq('user_id', user.user_id)
                .eq('campaign_type', 'trial')
                .eq('day_number', daysSinceStart)
                .maybeSingle();

              if (userEmail && !alreadySent) {
                recipients.push({ 
                  email: userEmail, 
                  userId: user.user_id,
                  dayNumber: daysSinceStart 
                });
              }
            }
          }
        }

      } else if (campaignType === 'engagement') {
        // Get active paid subscribers
        const { data: paidUsers } = await supabaseClient
          .from('user_subscriptions')
          .select('user_id')
          .eq('subscription_status', 'active')
          .or('subscription_tier.eq.monthly,subscription_tier.eq.yearly,has_lifetime_access.eq.true');

        if (paidUsers && paidUsers.length > 0) {
          // Determine which week of the month
          const weekOfMonth = Math.ceil(new Date().getDate() / 7);
          const emailForWeek = ENGAGEMENT_EMAILS[(weekOfMonth - 1) % ENGAGEMENT_EMAILS.length];

          // Get emails from auth.users
          const userIds = paidUsers.map(u => u.user_id);
          const userEmailMap = await mapUserIdsToEmails(supabaseClient, userIds);

          // Filter out recent recipients
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const { data: recentEmails } = await supabaseClient
            .from('email_logs')
            .select('user_id')
            .eq('campaign_type', 'engagement')
            .gte('sent_at', oneWeekAgo.toISOString());

          const recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);

          recipients = paidUsers
            .filter(u => userEmailMap.has(u.user_id) && !recentUserIds.has(u.user_id))
            .map(u => ({ email: userEmailMap.get(u.user_id)!, userId: u.user_id }));

          emailTemplates = [emailForWeek];
        }
      } else if (campaignType === 'login_reminder') {
        // Target: Stripe subscribers who have NOT created an account in our database
        // These are users we know from Stripe but can't find matching profiles for
        
        logStep("Login reminder: fetching Stripe subscriptions");
        
        // Call Stripe to get all active subscriptions
        const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeSecretKey) {
          throw new Error("STRIPE_SECRET_KEY not configured");
        }
        
        // Fetch active subscriptions from Stripe
        let allStripeCustomers: { email: string; customerId: string }[] = [];
        let hasMore = true;
        let startingAfter: string | undefined;
        
        while (hasMore) {
          const params = new URLSearchParams({
            limit: '100',
            status: 'active',
            expand: ['data.customer'].join(','),
          });
          if (startingAfter) params.append('starting_after', startingAfter);
          
          const stripeResponse = await fetch(`https://api.stripe.com/v1/subscriptions?${params}`, {
            headers: {
              'Authorization': `Bearer ${stripeSecretKey}`,
            },
          });
          
          if (!stripeResponse.ok) {
            const errorText = await stripeResponse.text();
            logStep("Stripe API error", { status: stripeResponse.status, error: errorText });
            throw new Error(`Stripe API error: ${errorText}`);
          }
          
          const stripeData = await stripeResponse.json();
          
          for (const sub of stripeData.data) {
            const customer = sub.customer;
            if (customer && typeof customer === 'object' && customer.email) {
              allStripeCustomers.push({
                email: customer.email.toLowerCase(),
                customerId: customer.id,
              });
            }
          }
          
          hasMore = stripeData.has_more;
          if (stripeData.data.length > 0) {
            startingAfter = stripeData.data[stripeData.data.length - 1].id;
          }
        }
        
        logStep("Stripe customers fetched", { count: allStripeCustomers.length });
        
        // Get all existing profile emails from auth.users
        const existingEmails = new Set<string>();
        let authPage = 1;
        const authPerPage = 1000;
        
        while (true) {
          const { data: authData, error: authError } = await supabaseClient.auth.admin.listUsers({ 
            page: authPage, 
            perPage: authPerPage 
          });
          
          if (authError) {
            logStep("Error listing auth users", { error: authError.message });
            break;
          }
          
          const users = authData?.users ?? [];
          if (users.length === 0) break;
          
          for (const user of users) {
            if (user.email) {
              existingEmails.add(user.email.toLowerCase());
            }
          }
          
          if (users.length < authPerPage) break;
          authPage++;
        }
        
        logStep("Auth users fetched", { count: existingEmails.size });
        
        // Find Stripe customers who don't have matching auth accounts
        const missingAccounts = allStripeCustomers.filter(c => !existingEmails.has(c.email));
        
        logStep("Missing accounts found", { 
          stripeCustomers: allStripeCustomers.length,
          existingAccounts: existingEmails.size,
          needReminder: missingAccounts.length 
        });
        
        // Check for recent emails to avoid spamming
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        let recentEmailSet = new Set<string>();
        if (!forceSend) {
          const { data: recentEmails } = await supabaseClient
            .from('email_logs')
            .select('subject')
            .eq('campaign_type', 'login_reminder')
            .gte('sent_at', sevenDaysAgo.toISOString());
          
          // Since these users don't have user_ids, we'd need to track by email
          // For now, we'll use forceSend or just send once
          logStep("Recent login_reminder emails", { count: recentEmails?.length || 0 });
        }
        
        recipients = missingAccounts.map(c => ({
          email: c.email,
          userId: c.customerId, // Use Stripe customer ID as a pseudo-userId for logging
        }));
        
        emailTemplates = [LOGIN_REMINDER_EMAIL];
      } else if (campaignType === 'conversion') {
        // Conversion Campaign: Target users who registered but never subscribed/started trial
        // These are "free" users with no payment source
        logStep("Conversion campaign: fetching non-paying users");
        
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        // Get all non-paying users:
        // - subscription_status is null, 'none', 'pending', or 'expired'
        // - no lifetime access
        // - account created at least 3 days ago (give them time to convert on their own)
        let allNonPayingUsers: any[] = [];
        let profilePage = 0;
        const profilePageSize = 1000;
        
        while (true) {
          const { data: batch, error: batchError } = await supabaseClient
            .from('profiles')
            .select('id, created_at')
            .or('subscription_status.is.null,subscription_status.eq.none,subscription_status.eq.pending,subscription_status.eq.expired,subscription_status.eq.trial_expired')
            .eq('has_lifetime_access', false)
            .lt('created_at', threeDaysAgo.toISOString())
            .range(profilePage * profilePageSize, (profilePage + 1) * profilePageSize - 1);
          
          if (batchError) {
            logStep("Error fetching profiles batch", { error: batchError.message, page: profilePage });
            break;
          }
          if (!batch || batch.length === 0) break;
          
          allNonPayingUsers = [...allNonPayingUsers, ...batch];
          if (batch.length < profilePageSize) break;
          profilePage++;
        }
        
        logStep("Non-paying users found", { count: allNonPayingUsers.length });
        
        if (allNonPayingUsers.length > 0) {
          // Get emails from auth.users
          const userIds = allNonPayingUsers.map(u => u.id);
          const userEmailMap = await mapUserIdsToEmails(supabaseClient, userIds);
          
          // Calculate which email to send based on when they signed up
          const now = new Date();
          
          let recentUserIds = new Set<string>();
          if (!forceSend) {
            // Check who has already received a conversion email in the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const { data: recentEmails } = await supabaseClient
              .from('email_logs')
              .select('user_id, day_number')
              .eq('campaign_type', 'conversion')
              .gte('sent_at', thirtyDaysAgo.toISOString());
            
            recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);
          }
          
          // Build recipient list with day numbers based on account age
          for (const user of allNonPayingUsers) {
            if (!userEmailMap.has(user.id)) continue;
            if (!forceSend && recentUserIds.has(user.id)) continue;
            
            const createdAt = new Date(user.created_at);
            const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            
            // Map days since creation to conversion email schedule:
            // 3-4 days old → Email 1 (day 0)
            // 5-6 days old → Email 2 (day 2) 
            // 7-8 days old → Email 3 (day 4)
            // 9-10 days old → Email 4 (day 6)
            // 11+ days old → Email 5 (day 8) - final
            let emailDay = 0;
            if (daysSinceCreation >= 11) emailDay = 8;
            else if (daysSinceCreation >= 9) emailDay = 6;
            else if (daysSinceCreation >= 7) emailDay = 4;
            else if (daysSinceCreation >= 5) emailDay = 2;
            else emailDay = 0;
            
            const emailForDay = CONVERSION_EMAILS.find(e => e.day === emailDay);
            
            if (emailForDay) {
              // Check if this specific day's email was already sent to this user
              const { data: alreadySent } = await supabaseClient
                .from('email_logs')
                .select('id')
                .eq('user_id', user.id)
                .eq('campaign_type', 'conversion')
                .eq('day_number', emailDay)
                .maybeSingle();
              
              if (!alreadySent) {
                recipients.push({
                  email: userEmailMap.get(user.id)!,
                  userId: user.id,
                  dayNumber: emailDay
                });
              }
            }
          }
          
          logStep("Conversion recipients mapped", {
            totalNonPaying: allNonPayingUsers.length,
            emailsFound: userEmailMap.size,
            afterFilters: recipients.length,
            forceSend: !!forceSend
          });
        }
        
        // Use the first template as default (individual emails are matched by dayNumber)
        emailTemplates = [CONVERSION_EMAILS[0]];
      }
    }

    // Exclude church members from trial/winback/conversion campaigns
    // Church members have full access through their church and should never receive upgrade emails
    if (['trial', 'winback', 'conversion'].includes(campaignType) && recipients.length > 0) {
      const { data: activeChurches } = await supabaseClient
        .from('churches')
        .select('id')
        .eq('subscription_status', 'active');

      if (activeChurches && activeChurches.length > 0) {
        const { data: churchMembers } = await supabaseClient
          .from('church_members')
          .select('user_id')
          .in('church_id', activeChurches.map(c => c.id));

        const churchMemberIds = new Set((churchMembers || []).map(m => m.user_id));
        const beforeCount = recipients.length;
        recipients = recipients.filter(r => !churchMemberIds.has(r.userId));
        logStep("Church members excluded from campaign", {
          churchMembers: churchMemberIds.size,
          removed: beforeCount - recipients.length
        });
      }
    }

    logStep("Recipients determined", { count: recipients.length, campaignType });

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No eligible recipients for this campaign" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send emails (batched) — Resend is rate-limited (~2 requests/sec).
    // We group by template and send with the /emails/batch endpoint to avoid 429s.
    const results: { email: string; success: boolean; error?: string }[] = [];
    const campaignStartTime = new Date();
    const adminEmail = userData.user.email || "support@thephototheologyapp.com";

    type Recipient = { email: string; userId: string; dayNumber?: number };

    const getTemplateForRecipient = (recipient: Recipient) => {
      if (campaignType === 'trial' && recipient.dayNumber !== undefined) {
        return TRIAL_EMAILS.find(e => e.day === recipient.dayNumber);
      }
      if (campaignType === 'conversion' && recipient.dayNumber !== undefined) {
        return CONVERSION_EMAILS.find(e => e.day === recipient.dayNumber);
      }
      return emailTemplates[0];
    };

    const groups = new Map<string, { template: any; recipients: Recipient[] }>();

    for (const recipient of recipients as Recipient[]) {
      const template = getTemplateForRecipient(recipient);

      if (!template) {
        logStep("No template found", { campaignType, dayNumber: recipient.dayNumber });
        results.push({ email: recipient.email, success: false, error: "No matching template" });
        continue;
      }

      const key = `${template.subject}`;
      const existing = groups.get(key);
      if (existing) existing.recipients.push(recipient);
      else groups.set(key, { template, recipients: [recipient] });
    }

    const batchSize = 50;
    const MIN_DELAY_BETWEEN_REQUESTS_MS = 600; // stay below 2 requests/sec
    let batchNumber = 0;
    const totalBatches = Math.ceil(recipients.length / batchSize);

    for (const [groupKey, group] of groups.entries()) {
      for (let i = 0; i < group.recipients.length; i += batchSize) {
        batchNumber++;
        const batchRecipients = group.recipients.slice(i, i + batchSize);

        logStep("Sending batch", {
          campaignType,
          group: groupKey,
          batch: batchNumber,
          totalBatches,
          count: batchRecipients.length,
        });

        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            batchRecipients.map((r) => ({
              from: fromAddress,
              to: [r.email],
              subject: group.template.subject,
              html: group.template.html,
            }))
          ),
        });

        const responseText = await response.text();
        logStep("Resend response", { status: response.status, body: responseText });

        if (!response.ok) {
          // If the sender domain isn't verified, stop immediately (otherwise we'll spam failures).
          if (response.status === 403 && responseText.includes("verify a domain")) {
            for (const r of batchRecipients) {
              results.push({ email: r.email, success: false, error: responseText });
            }

            // Notify admin of domain verification failure
            await sendAdminNotification(
              resendApiKey,
              adminEmail,
              `❌ Campaign Failed - Domain Verification Required`,
              `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #ef4444;">Campaign Failed</h2>
                  <p><strong>Campaign:</strong> ${campaignType}</p>
                  <p><strong>Error:</strong> Sender domain not verified</p>
                  <p>Please verify your domain in Resend before retrying.</p>
                </div>
              `
            );

            return new Response(
              JSON.stringify({
                success: false,
                sent: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                total: recipients.length,
                error: "Sender domain not verified. Verify your domain and use a verified 'from' address, then retry.",
                results,
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
            );
          }

          for (const r of batchRecipients) {
            results.push({ email: r.email, success: false, error: responseText });
          }
        } else {
          for (const r of batchRecipients) {
            results.push({ email: r.email, success: true });
          }

          // Log successes (best-effort; don't fail the send if logging fails)
          try {
            const logRows = batchRecipients
              .filter(r => r.userId && r.userId !== 'test')
              .map(r => ({
                user_id: r.userId,
                campaign_type: testMode ? `test_${campaignType}` : campaignType,
                day_number: r.dayNumber || 0,
                subject: group.template.subject,
                status: 'sent',
                sent_at: new Date().toISOString(),
              }));

            if (logRows.length > 0) {
              await supabaseClient.from('email_logs').insert(logRows);
            }
          } catch (logErr: any) {
            logStep("Failed to write email_logs for batch", { error: logErr?.message ?? String(logErr) });
          }
        }

        // small delay between all requests
        await new Promise(resolve => setTimeout(resolve, MIN_DELAY_BETWEEN_REQUESTS_MS));
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const success = failed === 0;
    const campaignEndTime = new Date();
    const durationMs = campaignEndTime.getTime() - campaignStartTime.getTime();
    const durationMinutes = Math.round(durationMs / 60000);

    logStep("Campaign complete", { sent, failed });

    // Send final campaign completion summary
    const durationLabel = durationMinutes > 0 ? `${durationMinutes} min` : `${Math.round(durationMs / 1000)} sec`;
    const successRate = recipients.length > 0 ? Math.round((sent / recipients.length) * 100) : 100;
    const campaignLabel = campaignType.toUpperCase().replace(/_/g, ' ');

    await sendAdminNotification(
      resendApiKey,
      adminEmail,
      `🎉 ${campaignLabel} Campaign Complete — ${sent.toLocaleString()} Emails Sent`,
      `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#0f0f1a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a; padding: 40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

      <!-- Top accent bar -->
      <tr><td style="background: linear-gradient(90deg, #f5d742, #ff6b6b, #4ecdc4, #a855f7); height: 5px; border-radius: 8px 8px 0 0;"></td></tr>

      <!-- Header -->
      <tr><td style="background: linear-gradient(160deg, #1a1a3e 0%, #12122a 100%); padding: 48px 40px 36px; text-align: center; border-left: 1px solid rgba(255,255,255,0.06); border-right: 1px solid rgba(255,255,255,0.06);">
        <div style="font-size: 52px; line-height: 1; margin-bottom: 16px;">🎉</div>
        <h1 style="margin: 0 0 8px; font-size: 32px; font-weight: 800; color: #f5d742; letter-spacing: -0.5px;">Campaign Complete!</h1>
        <p style="margin: 0; font-size: 16px; color: #8b8baa;">${campaignLabel} · ${campaignEndTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </td></tr>

      <!-- Stats row -->
      <tr><td style="background: #12122a; padding: 0 40px; border-left: 1px solid rgba(255,255,255,0.06); border-right: 1px solid rgba(255,255,255,0.06);">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: -24px 0 0;">
          <tr>
            <td width="48%" style="padding: 0 8px 0 0;">
              <div style="background: linear-gradient(135deg, #064e3b, #065f46); border: 1px solid #10b981; border-radius: 16px; padding: 28px 20px; text-align: center;">
                <div style="font-size: 48px; font-weight: 900; color: #34d399; letter-spacing: -2px; line-height: 1;">${sent.toLocaleString()}</div>
                <div style="font-size: 13px; font-weight: 600; color: #6ee7b7; letter-spacing: 1px; text-transform: uppercase; margin-top: 6px;">✓ Delivered</div>
              </div>
            </td>
            <td width="4%"></td>
            <td width="48%" style="padding: 0 0 0 8px;">
              <div style="background: ${failed > 0 ? 'linear-gradient(135deg, #450a0a, #7f1d1d)' : 'linear-gradient(135deg, #1e1b4b, #312e81)'}; border: 1px solid ${failed > 0 ? '#ef4444' : '#6366f1'}; border-radius: 16px; padding: 28px 20px; text-align: center;">
                <div style="font-size: 48px; font-weight: 900; color: ${failed > 0 ? '#f87171' : '#a5b4fc'}; letter-spacing: -2px; line-height: 1;">${failed.toLocaleString()}</div>
                <div style="font-size: 13px; font-weight: 600; color: ${failed > 0 ? '#fca5a5' : '#c7d2fe'}; letter-spacing: 1px; text-transform: uppercase; margin-top: 6px;">${failed > 0 ? '✗ Failed' : '✓ No Errors'}</div>
              </div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Details card -->
      <tr><td style="background: #12122a; padding: 32px 40px; border-left: 1px solid rgba(255,255,255,0.06); border-right: 1px solid rgba(255,255,255,0.06);">
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 28px;">
          <h2 style="margin: 0 0 20px; font-size: 13px; font-weight: 700; color: #4ecdc4; letter-spacing: 2px; text-transform: uppercase;">📊 Campaign Details</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #6b7280; font-size: 14px; width: 40%;">Campaign Type</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e5e5f0; font-size: 14px; font-weight: 600;">${campaignLabel}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #6b7280; font-size: 14px;">Total Recipients</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e5e5f0; font-size: 14px; font-weight: 600;">${recipients.length.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #6b7280; font-size: 14px;">Success Rate</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: ${successRate === 100 ? '#34d399' : successRate > 90 ? '#fbbf24' : '#f87171'};">${successRate}%</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #6b7280; font-size: 14px;">Started</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e5e5f0; font-size: 14px;">${campaignStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #6b7280; font-size: 14px;">Completed</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e5e5f0; font-size: 14px;">${campaignEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Duration</td>
              <td style="padding: 10px 0; color: #e5e5f0; font-size: 14px; font-weight: 600;">⚡ ${durationLabel}</td>
            </tr>
          </table>
        </div>
      </td></tr>

      <!-- Status banner -->
      <tr><td style="background: #12122a; padding: 0 40px 40px; border-left: 1px solid rgba(255,255,255,0.06); border-right: 1px solid rgba(255,255,255,0.06);">
        <div style="background: ${success ? 'linear-gradient(135deg, #064e3b, #065f46)' : 'linear-gradient(135deg, #450a0a, #7f1d1d)'}; border: 1px solid ${success ? '#10b981' : '#ef4444'}; border-radius: 12px; padding: 18px 24px; text-align: center;">
          <span style="font-size: 15px; font-weight: 700; color: ${success ? '#34d399' : '#f87171'};">
            ${success ? '✅ All emails delivered successfully — great send!' : `⚠️ ${failed} email${failed !== 1 ? 's' : ''} failed. Review logs for details.`}
          </span>
        </div>
        ${failed > 0 ? `
        <div style="background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 20px 24px; margin-top: 16px;">
          <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #f87171; text-transform: uppercase; letter-spacing: 1px;">Failed Recipients (first 10)</h3>
          <ul style="margin: 0; padding-left: 20px; color: #fca5a5; font-size: 13px; line-height: 1.8;">
            ${results.filter(r => !r.success).slice(0, 10).map(r => `<li>${r.email}: ${r.error || 'Unknown error'}</li>`).join('')}
          </ul>
        </div>` : ''}
      </td></tr>

      <!-- Footer -->
      <tr><td style="background: #0c0c1d; border: 1px solid rgba(255,255,255,0.06); border-top: none; border-radius: 0 0 8px 8px; padding: 24px 40px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #4b4b6b;">PhotoTheology Admin · Campaign Report · ${campaignEndTime.getFullYear()}</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
    );

    return new Response(
      JSON.stringify({
        success,
        sent,
        failed,
        total: recipients.length,
        results,
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
