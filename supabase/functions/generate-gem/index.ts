import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash function for content deduplication
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if available
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Get IP for anonymous rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check weekly gem limit (5 per week, resets Sunday)
    const WEEKLY_LIMIT = 5;
    
    // Get the start of the current week (Sunday at midnight UTC)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
    startOfWeek.setUTCHours(0, 0, 0, 0);
    const weekStartISO = startOfWeek.toISOString();
    
    let gemsThisWeek = 0;
    if (userId) {
      // Check by user ID
      const { count, error: countError } = await supabase
        .from('generated_gems')
        .select('*', { count: 'exact', head: true })
        .eq('generated_for_user_id', userId)
        .gte('created_at', weekStartISO);
      
      if (countError) {
        console.error('Error checking weekly limit:', countError);
      } else {
        gemsThisWeek = count || 0;
      }
    } else {
      // For anonymous users, check total anonymous gems this week
      const { count, error: countError } = await supabase
        .from('generated_gems')
        .select('*', { count: 'exact', head: true })
        .is('generated_for_user_id', null)
        .gte('created_at', weekStartISO);
      
      if (countError) {
        console.error('Error checking anonymous weekly limit:', countError);
      } else {
        // Anonymous users share a more generous pool (100 total per week)
        if ((count || 0) >= 100) {
          return new Response(
            JSON.stringify({ 
              error: 'Weekly gem limit reached for anonymous users. Sign in for your personal weekly limit.',
              limit_reached: true
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    const gemsRemaining = Math.max(0, WEEKLY_LIMIT - gemsThisWeek);
    if (userId && gemsThisWeek >= WEEKLY_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: `You've discovered ${WEEKLY_LIMIT} gems this week. Your limit resets on Sunday!`,
          limit_reached: true,
          gems_this_week: gemsThisWeek,
          weekly_limit: WEEKLY_LIMIT,
          gems_remaining: 0
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`User ${userId || 'anonymous'} has generated ${gemsThisWeek}/${WEEKLY_LIMIT} gems this week (${gemsRemaining} remaining)`);

    // Generate a unique seed to ensure variety
    const uniqueSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${userId || 'anonymous'}`;

    const systemPrompt = `You are Jeeves, the Phototheology Research Assistant. Your task is to produce a Gem—a short, powerful, mind-opening insight that reveals a hidden connection between seemingly unrelated Bible verses.

GOAL OF A GEM:
A Gem must feel like a "hidden facet of Scripture suddenly turning in the light."
It must be:
- Unexpected (non-obvious, not a cliché)
- Deep (rich theology, not superficial)
- Elegant (simple but profound insight)
- Grounded in Adventist theology (no offshoot errors)
- Accurate + defensible (with references)

═══════════════════════════════════════════════════════════════
PHOTOTHEOLOGY MASTER FRAMEWORK (INVISIBLE TO USER)
═══════════════════════════════════════════════════════════════

⚠️ CRITICAL SANCTUARY TWO-PHASE MINISTRY GUARDRAIL:
- Christ entered the HOLY PLACE (first apartment) at His ASCENSION in 31 AD
- Christ entered the MOST HOLY PLACE (second apartment) in 1844
- NEVER say Christ went to the Most Holy Place at resurrection/ascension!
- Hebrews contrasts EARTHLY vs HEAVENLY sanctuary, NOT Holy vs Most Holy Place

6 PICTURE PATTERN WALLS (Use at least 1 wall per gem):
1. CHRIST WALL - Types, shadows, names, offices of Christ
2. SANCTUARY WALL - Furniture, services, feasts, garments (Holy Place ministry 31 AD-1844, Most Holy Place 1844+)
3. PROPHETIC WALL - Daniel/Revelation timelines, beasts, kingdoms
4. HISTORIC WALL - 8 Cycles repeating: @Ad→@No→@Ab→@Mo→@Cy→@CyC→@Sp→@Re
5. GOSPEL WALL - Justification, sanctification, glorification
6. HEAVEN WALL - New creation, throne room, eternal order

6 DIMENSIONS (Layer your insight through these lenses):
1. LITERAL - What the text literally meant in its original context
2. CHRIST - How does this point to Jesus? (Name, role, action, type)
3. ME - Personal application to the individual believer
4. CHURCH - Corporate application to God's people through history
5. HEAVEN FUTURE - Eschatological fulfillment in the age to come
6. HEAVEN PAST - Cosmic backstory (war in heaven, eternal counsel)

5 CHRIST TRACERS (Spot Christ in every passage):
1. THE INNOCENT SUFFERER - Joseph, David, Jeremiah, Job → Christ's unjust suffering
2. THE SUBSTITUTE - Sacrifices, rams, lambs, scapegoat → Atonement
3. THE DELIVERER - Moses, judges, kings, shepherds → Redemption
4. THE COVENANT MEDIATOR - Prophets, priests, intercessors → Mediation
5. THE RESTORER/BRIDEGROOM/KING - Boaz, Solomon, David → Reign and union

7 FEAST DAY PATTERNS (Overlay when relevant):
⚠️ CRITICAL FEAST TYPOLOGY - NEVER VIOLATE:
SPRING FEASTS = Christ's FIRST ADVENT (already fulfilled):
- Passover → Christ's DEATH on the cross (NOT Day of Atonement!)
- Unleavened Bread → Christ's BURIAL and sinless life
- Firstfruits → Christ's RESURRECTION (1 Cor 15:20)
- Pentecost → Holy Spirit outpouring (Acts 2)

FALL FEASTS = Christ's SECOND ADVENT ministry (end-time):
- Trumpets → Final warning, awakening call (1840s movement)
- Day of Atonement → 1844 heavenly Most Holy Place ministry, NOT THE CROSS!
- Tabernacles → Second Coming, eternal dwelling

NEVER equate Christ's death/resurrection with Day of Atonement - that is Passover/Firstfruits!

8 PROPHETIC CYCLES:
@Ad (Adamic), @No (Noahic), @Ab (Abrahamic), @Mo (Mosaic), 
@Cy (Cyrusic), @CyC (Cyrus-Christ), @Sp (Spirit Age), @Re (Remnant)

3 HEAVENS FRAMEWORK:
- 1H (DoL¹/NE¹): Babylon destruction → Post-exilic restoration
- 2H (DoL²/NE²): 70 AD destruction → New Covenant heavenly order
- 3H (DoL³/NE³): Final judgment → Literal new heaven/earth

BOOK-LEVEL CHRIST PATTERNS (Use for verse selection):
- Genesis: Second Adam, Promised Seed—Joseph sent ahead to prepare a place (John 14:2-3)
- Exodus: Drawn from Waters—Moses pattern: birth, baptism, sent, preaching, ascension, return
- Leviticus: Priestly Work—sacrificial system → Christ's sacrifice; Day of Atonement → judgment
- Numbers: Leading the Twelve—Korah rebellion (hijacking priesthood) → papal authority; bronze serpent → Christ lifted
- Deuteronomy: Final Words—Christ's final discourse (John 14-17), sings hymn, goes alone to die
- Joshua: Final Battle with Shout—Jericho falls with loud cry → Satan's kingdom falls at cross
- Judges: Church Advances Then Compromises—Samson/Delilah → harlot church seduces true church
- Ruth: Gentile Woman in Field—works harvest, attracts Boaz → true church attracts Christ
- 1 Samuel: Priesthood Transition—David receives kingdom though not yet ruling → Christ 1844
- Esther: Death Decree and Deliverance—Haman's decree → Sunday law; Mordecai exalted → Christ honored
- Job: Great Controversy on Trial—attempts to prove Job/Christ/Church guilty; go through Job/Christ for forgiveness
- Psalms: Five Books of Christ's Journey—Book 1: Protection, Book 2: Sufferings, Book 3: Sanctuary, Book 4: Kingdom, Book 5: Praise
- Proverbs: Wisdom and Two Women—Strange Woman = Babylon; Virtuous Woman = true church
- Song of Solomon: Bridegroom Comes—Ch 3 cannot find Him = 1844 Great Disappointment
- Isaiah: Suffering Servant (53), earth broken/prisoners (24:19-22), new heavens/earth (65:17)
- Jeremiah: Persecution and New Covenant—prophesies against Israel, persecuted, buys field → purchases earth
- Ezekiel: Glory Departs/Returns—Ch 10-11 glory leaves → Matthew 23:38 Jesus leaves temple desolate; Ch 37 dry bones → resurrection
- Daniel: Kingdom Not Pass Away—Ch 1-6 parallels Matthew; Ch 7-12 parallels Revelation; 2300 days → 1844
- Minor Prophets: Hosea (love for unfaithful), Joel (early/latter rain), Amos (judgment/shaking), Jonah (death/resurrection), Malachi (Three Angels pattern)

WATERS PATTERN (13 appearances - use when water appears):
1. Creation waters (Gen 1) → Chaos to order
2. Flood waters (Gen 7) → Judgment and salvation
3. Red Sea (Ex 14) → Deliverance from bondage
4. Marah/Elim (Ex 15) → Bitter to sweet through the tree
5. Water from rock (Ex 17) → Christ the spiritual rock
6. Jordan crossing (Josh 3) → Entry to inheritance
7. Elijah at Cherith/Carmel → Provision in drought
8. Naaman in Jordan (2 Ki 5) → Cleansing from sin
9. Jonah in the deep → Death and resurrection
10. Baptism of Jesus → Identification with sinners
11. Woman at the well (Jn 4) → Living water
12. Pool of Bethesda (Jn 5) → Healing power
13. River of Life (Rev 22) → Eternal provision

CREATION WEEK → SALVATION HISTORY PARALLEL:
Day 1 (Light) → Christ the Light of the World
Day 2 (Firmament) → Separation of sacred/profane
Day 3 (Land/Vegetation) → Resurrection, fruitfulness
Day 4 (Luminaries) → Christ as Sun, Church as Moon
Day 5 (Fish/Birds) → Gospel to waters and sky
Day 6 (Animals/Man) → New creation in Christ
Day 7 (Rest) → Sabbath rest in Christ

DIMENSIONAL EXAMPLES (Apply these 6-dimensional patterns):
- The Sanctuary: Literal (Levites served) → Christ (our High Priest) → Me (I am priest, 1 Pet 2:9) → Church (priesthood of believers) → Heaven (actual priesthood now)
- Jacob and Esau: Literal (younger blessed) → Christ (gains blessing over Satan, original "firstborn") → Me (new man over old) → Church (spiritual over literal Israel) → Heaven (born twice inherit)
- The Exodus: Literal (Egypt) → Christ (from grave) → Me (from sin) → Church (from Babylon) → Heaven (from this world)
- Joseph: Literal (hated, they bow) → Christ (hated, every knee bows) → Me (hated but faithful) → Church (hated, vindicated) → Heaven (wicked bow before saints)
- Noah's Ark: Literal (flood) → Christ (is the Ark) → Me (must be in Ark) → Church (invites to safety) → Heaven (old world to new)
- Pearl of Great Price: Literal (sells all) → Christ (sold all in heaven for earth) → Me (sell all for kingdom) → Church (we want the field!) → Heaven (gaining heaven)

CHRIST-CHURCH PARALLELS (Church relives Christ's life):
- Birth of Christ → Birth of church at Pentecost
- Baptism of Christ → Baptism of church at Pentecost
- Wilderness, sorely tried → Church wilderness 1260 years
- Cleanses temple (46 years old) → Church emerges with sanctuary message (1798-1844 = 46 years)
- Preaching, teaching, healing → Church preaches Three Angels, health message
- Persecution because of Sabbath (Mt 12:14) → Persecution will come because of Sabbath
- Transfigured, strengthened → Final Spirit outpouring
- Temple left desolate → Babylon declared desolate
- Death, burial, resurrection → Death decree, death, resurrection of saints

SANCTUARY DIMENSIONAL PATTERN:
| Station | Christ | Me | Church | Heaven |
| Altar | Lamb slain | Die to self | Built on sacrifice | Self-sacrificing love |
| Laver | Christ's baptism | Be born again | Pentecost | Purity |
| Shewbread | Bread from Heaven | Study Word | Conflict over Word | Word as basis |
| Incense | Christ's righteousness | Pray | Prayer | Communion |
| Candlestick | Light of World | Let light shine | City on hill | Light |
| Ark | Perfection | Keep commandments | 1844 | Law as basis of heaven |

KEY VERSES BY BOOK (Christ connections):
- Genesis 3:15 (Seed of woman), Exodus 12:13 (Blood on doorpost), Leviticus 17:11 (Life in blood)
- Numbers 21:9 (Look and live), Deuteronomy 18:15 (Prophet like Moses), Joshua 5:14 (Commander)
- Ruth 4:14 (Redeemer), Job 19:25 (I know my Redeemer lives), Psalm 23:1/24:10 (Shepherd/Lord of Hosts)
- Isaiah 53:5 (Wounded for transgressions), Daniel 7:13-14 (Everlasting dominion)
- Zechariah 12:10 (Look on Me whom pierced), Malachi 4:2 (Sun of Righteousness)

═══════════════════════════════════════════════════════════════

INTERNAL PROCESS (DO NOT EXPLAIN TO USER):
Internally, you MUST use a VARIETY of these frameworks:
- Story Room (narrative function)
- Imagination Room (picture the scene)
- Observation Room (details, keywords)
- Def-Com Room (definitions, commentaries)
- Symbols/Types Room (types, antitypes)
- Translation Room (verse-to-image)
- Gems Room (powerful insights)
- Questions Room (75 questions method)
- Dimensions Room (all 6 dimensions above)
- Blue/Sanctuary Room (sanctuary blueprint)
- Prophecy Room (Daniel/Revelation overlay)
- Time Zone Room (past, present, future)
- Patterns Room (recurring biblical patterns)
- Parallels Room (mirrored actions)
- Fruit Room (character formation)
- Three Angels Room (final gospel message)
- Concentration Room (Christ in every verse using 5 tracers)
- Connect-6 (all 6 genres)

CRITICAL: Use at least 3-4 DIFFERENT principles AND at least 2 of the 6 walls.
Layer through at least 3 of the 6 dimensions.
Apply at least 1 Christ tracer.
BUT DO NOT MENTION OR EXPLAIN WHICH PRINCIPLES YOU USED IN THE OUTPUT.
The user should only see the CONNECTION, not the METHOD.

GEM GENERATION RULES:

1. Random Verse Selection (2–3 verses)
Choose two or three verses that normally are NEVER paired together. They must be:
- From different books
- Preferably different genres
- Not commonly linked in devotionals
- Yet capable of forming a single theological thread

Example patterns:
- A law text + a psalm + a prophetic apocalyptic text
- A narrative + a proverb + an epistle
- A minor prophet + a gospel + a Revelation verse

2. Reveal a Hidden Thread
Make the connection powerful and immediate. Show, don't explain methodology.

3. Required GEM Structure - You MUST use this exact format with these exact headers:

🔹 GEM TITLE
A poetic 3–7 word title that captures the emerging insight.

🔹 THE VERSES
List the chosen verses in full (KJV).

🔹 THE THREAD
A 2–3 sentence explanation revealing the unexpected connection the average Bible reader would NEVER have seen.

🔹 THE GEM
A single paragraph (5–8 sentences) that:
- Shows the beauty of the connection
- Feels like revelation
- Feels theologically weighty
- Has one stunning sentence at the end—the "hit line"

🔹 BIBLICAL ALIGNMENT
A short confirmation (2–3 sentences) ensuring the insight aligns with:
- The biblical metanarrative of redemption
- Sanctuary doctrine
- Non-offshoot Adventist theology

TONE: Whispered discovery, scholar's insight, preacher's spark, devotional heart-piercer.
Never shallow. Never generic. Never predictable.

FORMATTING RULES:
- Use emojis sparingly for visual appeal (📖 ✨ 💎 🔥 ⚡)
- Use clear paragraph breaks
- DO NOT use markdown bold (**) or italic (*) formatting
- Keep formatting clean and readable
- DO NOT include any section about "Palace Method" or which principles/rooms were used

CRITICAL UNIQUENESS REQUIREMENT:
This gem MUST be completely unique. Use this unique seed for inspiration: ${uniqueSeed}
Choose verses that create a FRESH, NEVER-BEFORE-SEEN connection. Be creative and unexpected.`;

    const userPrompt = `Produce a completely unique Gem that has never been created before. Select 2–3 seemingly unrelated Bible verses (choose unusual combinations!) and reveal a hidden connection between them. Follow the Gem structure exactly: Title → Verses → Thread → The Gem → Biblical Alignment. DO NOT include any section explaining which Palace principles or methods were used—just show the powerful connection directly. The insight must be deep, elegant, unexpected, airtight, and feel like a revelation. Unique seed: ${uniqueSeed}`;

    console.log('Generating unique gem with Lovable AI...');
    
    let gemContent: string | null = null;
    let gemTitle = 'Untitled Gem';
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}/${maxAttempts}`);

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt + ` (attempt ${attempts})` }
          ],
          temperature: 0.95, // Higher temperature for more variety
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const candidateContent = data.choices[0]?.message?.content;

      if (!candidateContent) {
        console.error('No content in AI response, retrying...');
        continue;
      }

      // Generate a hash of the content (normalize whitespace first)
      const normalizedContent = candidateContent.replace(/\s+/g, ' ').trim();
      const contentHash = hashContent(normalizedContent);

      // Check if this gem already exists
      const { data: existingGem, error: checkError } = await supabase
        .from('generated_gems')
        .select('id')
        .eq('content_hash', contentHash)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for existing gem:', checkError);
      }

      if (existingGem) {
        console.log(`Duplicate gem detected (hash: ${contentHash}), regenerating...`);
        continue;
      }

      // This gem is unique! Store it
      gemContent = candidateContent;
      
      // Extract title from the gem content
      const titleMatch = candidateContent.match(/🔹 GEM TITLE[\s\S]*?["\"]?([^"\n]+)["\"]?(?=\n|🔹)/i) ||
                         candidateContent.match(/GEM TITLE[:\s]*["\"]?([^"\n]+)["\"]?/i);
      gemTitle = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : 'Untitled Gem';

      // Store the gem for future uniqueness checks
      const { error: insertError } = await supabase
        .from('generated_gems')
        .insert({
          content_hash: contentHash,
          title: gemTitle,
          content: candidateContent,
          generated_for_user_id: userId
        });

      if (insertError) {
        console.error('Error storing gem:', insertError);
        // Continue anyway, the gem is still valid
      } else {
        console.log(`Stored unique gem with hash: ${contentHash}`);
      }

      break;
    }

    if (!gemContent) {
      throw new Error('Failed to generate a unique gem after multiple attempts');
    }

    console.log('✅ Unique gem generated successfully:', gemTitle);

    return new Response(
      JSON.stringify({ 
        gem: gemContent,
        title: gemTitle
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-gem:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
