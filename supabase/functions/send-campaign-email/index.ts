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

type CampaignType = 'winback' | 'trial' | 'engagement';

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
    // Use a verified domain sender (default: support@phototheologybible.com).
    const defaultFromAddress = "PhotoTheology <support@phototheologybible.com>";
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
        const { data: neverSubscribedUsers } = await supabaseClient
          .from('profiles')
          .select('id, created_at, onboarding_completed, first_meaningful_action_at')
          .or('subscription_status.is.null,subscription_status.eq.none,subscription_status.eq.trial_expired,subscription_status.eq.expired,subscription_status.eq.cancelled')
          .eq('has_lifetime_access', false)
          .lt('created_at', sevenDaysAgo.toISOString());

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

    type Recipient = { email: string; userId: string; dayNumber?: number };

    const getTemplateForRecipient = (recipient: Recipient) => {
      if (campaignType === 'trial' && recipient.dayNumber !== undefined) {
        return TRIAL_EMAILS.find(e => e.day === recipient.dayNumber);
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

    for (const [groupKey, group] of groups.entries()) {
      for (let i = 0; i < group.recipients.length; i += batchSize) {
        const batchRecipients = group.recipients.slice(i, i + batchSize);

        logStep("Sending batch", {
          campaignType,
          group: groupKey,
          batch: i / batchSize,
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

    logStep("Campaign complete", { sent, failed });

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
