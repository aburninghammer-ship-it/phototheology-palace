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

// Win-Back Campaign Emails (for users who tried but did not subscribe)
const WIN_BACK_EMAILS = [
  {
    day: 0,
    subject: "PhotoTheology Isn't What You Think — Here's What It Actually Is",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">A Quiet Word About PhotoTheology</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          When you first explored PhotoTheology, you may have expected a Bible app — something with verses, search bars, and quick devotionals.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          But PhotoTheology isn't an app. It's a <strong style="color: #f5d742;">system of interpretation</strong> — a structured method for learning how to study Scripture the way the apostles and reformers did, with Christ as the interpretive center of every text.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Most people who leave early weren't shown how to use it properly. They clicked around, felt overwhelmed, and left without completing even one focused session.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          That's not a failure on your part — it's a failure in how we introduced you.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 24px;">
          Since then, we've rebuilt the guided path. The first session now takes 15 minutes, works best on a <strong>desktop or laptop</strong>, and teaches you the foundational structure before you explore.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px; color: #a0a0a0; font-style: italic;">
          If you're willing to try again — slowly, intentionally — we'd like to show you what you missed.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheology.com" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Return and Begin With the Guided Path
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
    subject: "How PhotoTheology Is Meant to Be Used",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">The Right Way to Enter</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          PhotoTheology was never designed to be sampled. It's meant to be <em>entered</em> — the way you'd enter a library, not scroll through a feed.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Here's how it works when used as intended:
        </p>
        
        <ul style="line-height: 1.9; margin-bottom: 20px; padding-left: 20px;">
          <li><strong style="color: #f5d742;">Session 1:</strong> The 24FPS Room — Learn how to "frame" chapters in your memory</li>
          <li><strong style="color: #f5d742;">Session 2:</strong> The Story Room — Practice walking through narrative with visual recall</li>
          <li><strong style="color: #f5d742;">Session 3:</strong> The Concentration Room — See Christ in every text using structured lenses</li>
        </ul>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          These three sessions — done slowly, on a <strong>desktop or laptop</strong> — are the foundation of everything else.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 24px;">
          Rushing past them is why most users felt confused. Completing them is why others now study Scripture with confidence they've never had before.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px; color: #a0a0a0; font-style: italic;">
          The system works. But only if you work with it.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheology.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Study With Intention
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
    subject: "An Invitation to Continue (When You're Ready)",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #e5e5e5;">
        <h1 style="color: #f5d742; font-size: 24px; margin-bottom: 20px;">Continuity, Not Completion</h1>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          PhotoTheology isn't about finishing content. It's about developing a <strong style="color: #f5d742;">method of interpretation</strong> that stays with you for life.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          Subscription doesn't unlock more "stuff." It removes the ceiling on your training — giving you full access to the 8-Floor Palace, prophecy integration, Jeeves (your AI study partner), and structured growth paths.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 16px;">
          You won't be overwhelmed. The system adapts to your pace.
        </p>
        
        <p style="line-height: 1.7; margin-bottom: 24px;">
          But if you're not ready, that's fine. We'll be here when you are.
        </p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://phototheology.com/pricing" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Remove the Ceiling When Ready
          </a>
        </div>
        
        <p style="margin-top: 32px; font-size: 14px; color: #777;">
          — The PhotoTheology Team
        </p>
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
          <a href="https://phototheology.com/dashboard" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/challenges" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/pricing" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/pricing" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/study" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/dashboard" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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
          <a href="https://phototheology.com/dashboard" style="display: inline-block; background: #f5d742; color: #1a1a2e; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px;">
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

    const { campaignType, testMode, testEmail, dayOverride }: CampaignRequest = await req.json();
    logStep("Request parsed", { campaignType, testMode });

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
        // Get users who tried but did not subscribe
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: expiredUsers } = await supabaseClient
          .from('user_subscriptions')
          .select('user_id')
          .in('subscription_status', ['expired', 'cancelled', 'trial_expired'])
          .eq('has_lifetime_access', false);

        if (expiredUsers) {
          // Get emails and filter out recent recipients
          const { data: profiles } = await supabaseClient
            .from('profiles')
            .select('id, email')
            .in('id', expiredUsers.map(u => u.user_id));

          const { data: recentEmails } = await supabaseClient
            .from('email_logs')
            .select('user_id')
            .eq('campaign_type', 'winback')
            .gte('sent_at', thirtyDaysAgo.toISOString());

          const recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);
          
          recipients = (profiles || [])
            .filter(p => p.email && !recentUserIds.has(p.id))
            .map(p => ({ email: p.email!, userId: p.id }));
        }

        emailTemplates = [WIN_BACK_EMAILS[0]]; // Start with first email in sequence

      } else if (campaignType === 'trial') {
        // Get users currently in trial
        const { data: trialUsers } = await supabaseClient
          .from('user_subscriptions')
          .select('user_id, trial_ends_at, created_at')
          .eq('subscription_status', 'trial')
          .not('trial_ends_at', 'is', null);

        if (trialUsers) {
          const now = new Date();
          
          for (const user of trialUsers) {
            const trialStart = new Date(user.created_at);
            const daysSinceStart = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
            
            // Find appropriate email for this day
            const emailForDay = TRIAL_EMAILS.find(e => e.day === daysSinceStart);
            
            if (emailForDay) {
              const { data: profile } = await supabaseClient
                .from('profiles')
                .select('email')
                .eq('id', user.user_id)
                .single();

              // Check if already sent this day's email
              const { data: alreadySent } = await supabaseClient
                .from('email_logs')
                .select('id')
                .eq('user_id', user.user_id)
                .eq('campaign_type', 'trial')
                .eq('day_number', daysSinceStart)
                .maybeSingle();

              if (profile?.email && !alreadySent) {
                recipients.push({ 
                  email: profile.email, 
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

        if (paidUsers) {
          // Determine which week of the month
          const weekOfMonth = Math.ceil(new Date().getDate() / 7);
          const emailForWeek = ENGAGEMENT_EMAILS[(weekOfMonth - 1) % ENGAGEMENT_EMAILS.length];

          // Get profiles and filter out recent recipients
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const { data: profiles } = await supabaseClient
            .from('profiles')
            .select('id, email')
            .in('id', paidUsers.map(u => u.user_id));

          const { data: recentEmails } = await supabaseClient
            .from('email_logs')
            .select('user_id')
            .eq('campaign_type', 'engagement')
            .gte('sent_at', oneWeekAgo.toISOString());

          const recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);

          recipients = (profiles || [])
            .filter(p => p.email && !recentUserIds.has(p.id))
            .map(p => ({ email: p.email!, userId: p.id }));

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

    // Send emails
    const results: { email: string; success: boolean; error?: string }[] = [];
    
    for (const recipient of recipients) {
      try {
        // Get the right email template
        let template;
        if (campaignType === 'trial' && recipient.dayNumber !== undefined) {
          template = TRIAL_EMAILS.find(e => e.day === recipient.dayNumber);
        } else if (emailTemplates.length > 0) {
          template = emailTemplates[0];
        }

        if (!template) {
          logStep("No template found", { campaignType, dayNumber: recipient.dayNumber });
          results.push({ email: recipient.email, success: false, error: "No matching template" });
          continue;
        }

        logStep("Sending email", { to: recipient.email, subject: template.subject });

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "PhotoTheology <support@phototheology.com>",
            to: [recipient.email],
            subject: template.subject,
            html: template.html,
          }),
        });

        const responseText = await response.text();
        logStep("Resend response", { status: response.status, body: responseText });

        if (!response.ok) {
          results.push({ email: recipient.email, success: false, error: responseText });
        } else {
          results.push({ email: recipient.email, success: true });

          // Log the email (even in test mode for debugging)
          await supabaseClient.from('email_logs').insert({
            user_id: recipient.userId,
            campaign_type: testMode ? `test_${campaignType}` : campaignType,
            day_number: recipient.dayNumber || 0,
            subject: template.subject,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err: any) {
        logStep("Error sending email", { email: recipient.email, error: err.message });
        results.push({ email: recipient.email, success: false, error: err.message });
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    logStep("Campaign complete", { sent, failed });

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent, 
        failed,
        total: recipients.length,
        results 
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
