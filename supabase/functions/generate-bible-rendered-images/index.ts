import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get the auth token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { persistSession: false }
      }
    );

    // Get user from auth token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Unauthorized');
    }

    // Create a client with the user's token for RLS
    const authenticatedClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        },
        auth: { persistSession: false }
      }
    );

    const { setNumber } = await req.json();

    const bibleRenderedSets = [
      { num: 1, symbol: "÷", name: "Separation / Division", range: "Genesis 1–24", desc: "Creation, fall, flood, Babel, call of Abram" },
      { num: 2, symbol: "×", name: "Multiplication", range: "Genesis 25–50", desc: "Abraham's line explodes → Isaac, Jacob, 12 tribes, Joseph" },
      { num: 3, symbol: "➤", name: "Deliverance", range: "Exodus 1–24", desc: "Slavery, plagues, Passover, Red Sea, Sinai covenant" },
      { num: 4, symbol: "⛺", name: "Sanctuary", range: "Exodus 25 – Leviticus 8", desc: "God moves in; blueprint of worship, priesthood" },
      { num: 5, symbol: "⚖", name: "Laws / Holiness", range: "Leviticus 9 – Numbers 5", desc: "Clean/unclean, atonement, how to live near holiness" },
      { num: 6, symbol: "👣", name: "Journey", range: "Numbers 6 – Numbers 29", desc: "Wilderness walk, rebellion, mercy" },
      { num: 7, symbol: "🏁", name: "Arrival Prep", range: "Numbers 30 – Deuteronomy 17", desc: "Moses warning them how to live in the land" },
      { num: 8, symbol: "🔄", name: "Transition", range: "Deuteronomy 18 – Joshua 6", desc: "Moses to Joshua, crossing Jordan, Jericho falls" },
      { num: 9, symbol: "⚔", name: "Conquer", range: "Joshua 7 – Judges 6", desc: "Land taken, then decline cycles begin" },
      { num: 10, symbol: "☢", name: "Disorder", range: "Judges 7 – Ruth 4 – 1 Samuel 3", desc: "Chaos and Ruth locking in David line" },
      { num: 11, symbol: "💢", name: "Jealousy", range: "1 Samuel 4 – 28", desc: "Israel demands king, Saul's rage against David" },
      { num: 12, symbol: "👑", name: "Kingship", range: "1 Samuel 29 – 2 Samuel 21", desc: "Saul falls, David rises and rules" },
      { num: 13, symbol: "🔗", name: "Unification", range: "2 Samuel 22 – 1 Kings 21", desc: "David's end, Solomon's throne, kingdom at peak" },
      { num: 14, symbol: "✂", name: "Division", range: "1 Kings 22 – 2 Kings 23", desc: "Split kingdoms, idolatry, prophetic confrontations" },
      { num: 15, symbol: "⏪", name: "David Flashback", range: "2 Kings 24 – 1 Chronicles 22", desc: "Babylon, then rewind to David's story" },
      { num: 16, symbol: "💎", name: "Solomon Flashback", range: "1 Chronicles 23 – 2 Chronicles 14", desc: "Temple order, Solomon's early kingship" },
      { num: 17, symbol: "⛓", name: "Captivity & Redemption", range: "2 Chronicles 15 – Ezra 5", desc: "Reforms, exile, first waves of return" },
      { num: 18, symbol: "🧱", name: "Rebuilding & Crisis", range: "Ezra 6 – Esther 6", desc: "Temple completion, Nehemiah walls, Esther's setup" },
      { num: 19, symbol: "🕊", name: "God's Protection", range: "Esther 7 – Job 20", desc: "God preserves from annihilation, spiritual attack" },
      { num: 20, symbol: "🙏", name: "Trust in God", range: "Job 21 – Psalm 1", desc: "Why wicked prosper, Psalm 1 righteous pattern" },
      { num: 21, symbol: "😭", name: "Pleading", range: "Psalms 2 – 25", desc: "Crying out for justice and deliverance" },
      { num: 22, symbol: "🎵", name: "Praising", range: "Psalms 26 – 48", desc: "Worship, God as fortress and King" },
      { num: 23, symbol: "🛡", name: "Protecting", range: "Psalms 49 – 70", desc: "God as shield/defense in conflict" },
      { num: 24, symbol: "🏆", name: "Victory", range: "Psalms 71 – 93", desc: "The LORD reigns, triumph language" },
      { num: 25, symbol: "✔", name: "Certainty", range: "Psalms 94 – 117", desc: "Judgment sure, salvation sure, nations praise" },
      { num: 26, symbol: "🧠", name: "Wisdom", range: "Psalms 118 – Proverbs 15", desc: "Close of Psalms, practical wisdom begins" },
      { num: 27, symbol: "🤦", name: "Foolishness Exposed", range: "Proverbs 16 – Ecclesiastes 8", desc: "Warnings about pride, vanity problem" },
      { num: 28, symbol: "💔", name: "Unfaithful Bride", range: "Ecclesiastes 9 – Song of Solomon 8 – Isaiah 12", desc: "Covenant love, God's bride drifting" },
      { num: 29, symbol: "🔨", name: "Judgment", range: "Isaiah 13 – 35", desc: "Burden against nations, Day of LORD warnings" },
      { num: 30, symbol: "🩸", name: "The Gospel", range: "Isaiah 36 – 59", desc: "Suffering Servant, wounded for transgressions" },
      { num: 31, symbol: "🚨", name: "Faltering (Part II)", range: "Isaiah 60 – Jeremiah 17", desc: "Promise of glory, Judah refusing, trust God" },
      { num: 32, symbol: "📣", name: "God's Pleading", range: "Jeremiah 18 – 41", desc: "God begging repentance before Babylon" },
      { num: 33, symbol: "☠", name: "Abominations", range: "Jeremiah 42 – Lamentations 5 – Ezekiel 8", desc: "Refusal to repent, Jerusalem falls, corruption" },
      { num: 34, symbol: "↘", name: "Apostasy", range: "Ezekiel 9 – 32", desc: "Glory departs, judgment falls, nations indicted" },
      { num: 35, symbol: "⏳", name: "Prophecy", range: "Ezekiel 33 – Daniel 8", desc: "Watchman, dry bones, beasts and kingdoms" },
      { num: 36, symbol: "⛔", name: "Probation Closes", range: "Daniel 9 – Amos 3", desc: "Timed mercy, Messiah foretold, prepare to meet God" },
      { num: 37, symbol: "❤️", name: "Mercy", range: "Amos 4 – Habakkuk 3", desc: "Justice AND mercy, God preserves remnant" },
      { num: 38, symbol: "🌩", name: "Day of the Lord", range: "Zephaniah 1 – Malachi 4", desc: "Final OT warnings, restoration, forerunner" },
      { num: 39, symbol: "✨", name: "Cross (Incarnation / Contact)", range: "Matthew 1 – 24", desc: "God in flesh, authority, end times warnings" },
      { num: 40, symbol: "⏰", name: "Cross (Accountability & Return)", range: "Matthew 25 – Mark 16 – Luke 1", desc: "Parables of judgment, Great Commission" },
      { num: 41, symbol: "✝", name: "Cross (Life / Death / Resurrection)", range: "Luke 2 – Luke 24", desc: "Birth, ministry, crucifixion, resurrection" },
      { num: 42, symbol: "🔥", name: "Cross Transition", range: "John 1 – Acts 3", desc: "Word made flesh, Pentecost fire, church born" },
      { num: 43, symbol: "🌱", name: "Growth", range: "Acts 4 – 27", desc: "Mission expansion, church plants everywhere" },
      { num: 44, symbol: "☝", name: "Christ Only", range: "Acts 28 – 1 Corinthians 7", desc: "Salvation in Christ alone, holiness" },
      { num: 45, symbol: "⚡", name: "The Power of the Gospel", range: "1 Corinthians 8 – Galatians 1", desc: "Resurrection hope, warning against another gospel" },
      { num: 46, symbol: "🚶", name: "Walk Worthy", range: "Galatians 2 – 1 Thessalonians 5", desc: "Life in Spirit, endurance, Christ's return readiness" },
      { num: 47, symbol: "🛠", name: "Exhortation / Endure", range: "2 Thessalonians 1 – Hebrews 5", desc: "Hold the line, Christ greater than all" },
      { num: 48, symbol: "🕯", name: "Hope (Sanctuary Gospel)", range: "Hebrews 6 – 1 John 3", desc: "Christ High Priest, heavenly sanctuary, true church" },
      { num: 49, symbol: "⚔", name: "Warfare (Final Conflict)", range: "1 John 4 – Revelation 19", desc: "Test spirits, Babylon vs Lamb, King of Kings returns" },
      { num: 50, symbol: "🌅", name: "Heaven / Reward", range: "Revelation 20 – 22", desc: "Satan destroyed, New Jerusalem, no more curse" }
    ];

    const set = bibleRenderedSets.find(s => s.num === setNumber);
    if (!set) {
      throw new Error('Invalid set number');
    }

    console.log(`Generating image for Set ${set.num}: ${set.name}`);

    const prompt = `Create a symbolic, artistic representation of the biblical theme "${set.name}" (${set.symbol}). 
    
Theme: ${set.desc}
Biblical Range: ${set.range}

Style: Modern, symbolic, with rich biblical imagery. Use warm golden and deep blue tones. The image should be iconic and memorable, capturing the spiritual essence of this biblical period. Include subtle symbolism that represents the theme without being literal. Professional Bible study visual.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Save to bible_images table
    const { data: imageRecord, error: imageError } = await authenticatedClient
      .from('bible_images')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        room_type: 'Bible Rendered',
        description: `${set.symbol} ${set.name}: ${set.desc}`,
        verse_reference: set.range
      })
      .select()
      .single();

    if (imageError) {
      console.error('Error saving image:', imageError);
      throw imageError;
    }

    console.log(`Successfully created image for Set ${set.num}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl,
        imageId: imageRecord.id,
        set: set
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-bible-rendered-images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
