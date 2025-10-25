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
    // Get the auth token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        },
        auth: {
          persistSession: false,
        },
      }
    );

    // Get user from auth
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Generating Bible Rendered flashcard set for user:', user.id);

    // Create the flashcard set
    const { data: flashcardSet, error: setError } = await supabaseClient
      .from('flashcard_sets')
      .insert({
        user_id: user.id,
        title: 'Bible Rendered - 50 Sets',
        description: 'Master the entire Bible through 50 symbolic sets, from Creation to New Jerusalem',
        is_public: true,
        is_ai_generated: false
      })
      .select()
      .single();

    if (setError) {
      console.error('Error creating flashcard set:', setError);
      throw setError;
    }

    console.log('Created flashcard set:', flashcardSet.id);

    // Define the 50 sets
    const bibleRenderedSets = [
      { num: 1, symbol: "÷", name: "Separation / Division", range: "Genesis 1–24", desc: "Creation, fall, flood, Babel, call of Abram" },
      { num: 2, symbol: "×", name: "Multiplication", range: "Genesis 25–50", desc: "Abraham's line explodes → Isaac, Jacob, 12 tribes, Joseph" },
      { num: 3, symbol: "➤", name: "Deliverance", range: "Exodus 1–24", desc: "Slavery, plagues, Passover, Red Sea, Sinai covenant" },
      { num: 4, symbol: "⛺", name: "Sanctuary", range: "Exodus 25 – Leviticus 8", desc: "God moves in; blueprint of worship, priesthood" },
      { num: 5, symbol: "⚖", name: "Laws / Holiness", range: "Leviticus 9 – Numbers 5", desc: "Clean/unclean, atonement, how to live near holiness without dying" },
      { num: 6, symbol: "👣", name: "Journey", range: "Numbers 6 – Numbers 29", desc: "Wilderness walk, rebellion, mercy" },
      { num: 7, symbol: "🏁", name: "Arrival Prep", range: "Numbers 30 – Deuteronomy 17", desc: "End of Numbers, Moses warning them how to live in the land" },
      { num: 8, symbol: "🔄", name: "Transition", range: "Deuteronomy 18 – Joshua 6", desc: "Handoff from Moses to Joshua, crossing Jordan, Jericho falls" },
      { num: 9, symbol: "⚔", name: "Conquer", range: "Joshua 7 – Judges 6", desc: "Land taken, then decline cycles begin" },
      { num: 10, symbol: "☢", name: "Disorder", range: "Judges 7 – Ruth 4 – 1 Samuel 3", desc: "Chaos, 'everyone did what was right in his own eyes,' plus Ruth locking in the David line" },
      { num: 11, symbol: "💢", name: "Jealousy", range: "1 Samuel 4 – 28", desc: "Israel demands a king, Saul's insecurity and rage against David" },
      { num: 12, symbol: "👑", name: "Kingship", range: "1 Samuel 29 – 2 Samuel 21", desc: "Saul falls, David rises and rules" },
      { num: 13, symbol: "🔗", name: "Unification", range: "2 Samuel 22 – 1 Kings 21", desc: "David's final stretch, Solomon takes the throne, the kingdom at peak strength and unity" },
      { num: 14, symbol: "✂", name: "Division", range: "1 Kings 22 – 2 Kings 23", desc: "Split kingdoms, idolatry, prophetic confrontations, northern/southern drift" },
      { num: 15, symbol: "⏪", name: "David Flashback", range: "2 Kings 24 – 1 Chronicles 22", desc: "Collapse toward Babylon, then rewind to David's story to anchor identity" },
      { num: 16, symbol: "💎", name: "Solomon Flashback", range: "1 Chronicles 23 – 2 Chronicles 14", desc: "Temple order, priestly structure, early kingship under Solomon and the first Judean kings" },
      { num: 17, symbol: "⛓", name: "Captivity & Redemption", range: "2 Chronicles 15 – Ezra 5", desc: "Spiritual reforms, downfall, Babylonian exile, first waves of return" },
      { num: 18, symbol: "🧱", name: "Rebuilding & Crisis", range: "Ezra 6 – Esther 6", desc: "Temple completion, Nehemiah walls, Esther's setup in Persia with the threat forming" },
      { num: 19, symbol: "🕊", name: "God's Protection", range: "Esther 7 – Job 20", desc: "God preserves His people from annihilation; Job pulls the curtain back on spiritual attack" },
      { num: 20, symbol: "🙏", name: "Trust in God", range: "Job 21 – Psalm 1", desc: "Why do the wicked prosper? → 'Blessed is the man…' Psalm 1 sets the righteous pattern" },
      { num: 21, symbol: "😭", name: "Pleading", range: "Psalms 2 – 25", desc: "Crying out for justice and deliverance; 'Why do the heathen rage?'" },
      { num: 22, symbol: "🎵", name: "Praising", range: "Psalms 26 – 48", desc: "Worship, God as fortress and King" },
      { num: 23, symbol: "🛡", name: "Protecting", range: "Psalms 49 – 70", desc: "God as shield/defense in real conflict" },
      { num: 24, symbol: "🏆", name: "Victory", range: "Psalms 71 – 93", desc: "'The LORD reigns.' Triumph language." },
      { num: 25, symbol: "✔", name: "Certainty", range: "Psalms 94 – 117", desc: "Judgment is sure, salvation is sure, nations will praise" },
      { num: 26, symbol: "🧠", name: "Wisdom", range: "Psalms 118 – Proverbs 15", desc: "Close of Psalms including Psalm 118… then launch into practical wisdom, fear of the LORD" },
      { num: 27, symbol: "🤦", name: "Foolishness Exposed", range: "Proverbs 16 – Ecclesiastes 8", desc: "Warnings about pride, lust, sloth, and the 'vanity' problem" },
      { num: 28, symbol: "💔", name: "Unfaithful Bride", range: "Ecclesiastes 9 – Song of Solomon 8 – Isaiah 12", desc: "End of Ecclesiastes, covenant love language in Song of Solomon, then early Isaiah: God's bride is drifting" },
      { num: 29, symbol: "🔨", name: "Judgment", range: "Isaiah 13 – 35", desc: "Burden against the nations, warnings of the Day of the LORD" },
      { num: 30, symbol: "🩸", name: "The Gospel", range: "Isaiah 36 – 59", desc: "Siege, deliverance, and the Suffering Servant: 'wounded for our transgressions,' substitution, atonement" },
      { num: 31, symbol: "🚨", name: "Faltering (Part II)", range: "Isaiah 60 – Jeremiah 17", desc: "Promise of glory/light + Judah still refusing. The call to trust God, not idols" },
      { num: 32, symbol: "📣", name: "God's Pleading", range: "Jeremiah 18 – 41", desc: "God begging His people to repent before Babylon finishes them" },
      { num: 33, symbol: "☠", name: "Abominations", range: "Jeremiah 42 – Lamentations 5 – Ezekiel 8", desc: "Refusal to repent, Jerusalem falls, lament, and God shows the corruption inside the sanctuary itself" },
      { num: 34, symbol: "↘", name: "Apostasy", range: "Ezekiel 9 – 32", desc: "Glory departs, judgment falls, nations indicted" },
      { num: 35, symbol: "⏳", name: "Prophecy", range: "Ezekiel 33 – Daniel 8", desc: "Watchman call, dry bones, beasts and horns, sanctuary under attack, kingdoms laid out" },
      { num: 36, symbol: "⛔", name: "Probation Closes", range: "Daniel 9 – Amos 3", desc: "Timed mercy; Messiah foretold; 'Prepare to meet thy God'" },
      { num: 37, symbol: "❤️", name: "Mercy", range: "Amos 4 – Habakkuk 3", desc: "Justice AND mercy; God preserves a remnant even under judgment" },
      { num: 38, symbol: "🌩", name: "Day of the Lord", range: "Zephaniah 1 – Malachi 4", desc: "Final Old Testament warnings, restoration promises, forerunner of Messiah" },
      { num: 39, symbol: "✨", name: "Cross (Incarnation / Contact)", range: "Matthew 1 – 24", desc: "God in flesh; authority, teaching, warnings about the end" },
      { num: 40, symbol: "⏰", name: "Cross (Accountability & Return)", range: "Matthew 25 – Mark 16 – Luke 1", desc: "Parables of judgment, Great Commission trajectory, full gospel witness in Mark, announcement of Christ in Luke 1" },
      { num: 41, symbol: "✝", name: "Cross (Life / Death / Resurrection)", range: "Luke 2 – Luke 24", desc: "Birth, ministry, crucifixion, resurrection, and 'open their understanding'" },
      { num: 42, symbol: "🔥", name: "Cross Transition", range: "John 1 – Acts 3", desc: "'The Word was made flesh,' death, resurrection, ascension, Pentecost fire, church is born" },
      { num: 43, symbol: "🌱", name: "Growth", range: "Acts 4 – 27", desc: "Mission expansion under persecution; church plants everywhere" },
      { num: 44, symbol: "☝", name: "Christ Only", range: "Acts 28 – 1 Corinthians 7", desc: "Romans, then early Corinthians: salvation in Christ alone, body life, holiness" },
      { num: 45, symbol: "⚡", name: "The Power of the Gospel", range: "1 Corinthians 8 – Galatians 1", desc: "Idols, resurrection hope, and the warning against 'another gospel'" },
      { num: 46, symbol: "🚶", name: "Walk Worthy", range: "Galatians 2 – 1 Thessalonians 5", desc: "Life in the Spirit, unity, endurance, readiness for Christ's return" },
      { num: 47, symbol: "🛠", name: "Exhortation / Endure", range: "2 Thessalonians 1 – Hebrews 5", desc: "Hold the line under pressure; Christ greater than angels, Moses, priests" },
      { num: 48, symbol: "🕯", name: "Hope (Sanctuary Gospel)", range: "Hebrews 6 – 1 John 3", desc: "Christ our High Priest in the heavenly sanctuary; love, obedience, identity of the true church" },
      { num: 49, symbol: "⚔", name: "Warfare (Final Conflict)", range: "1 John 4 – Revelation 19", desc: "Test the spirits, expose antichrist, Babylon vs. the Lamb, the return of Christ as King of Kings" },
      { num: 50, symbol: "🌅", name: "Heaven / Reward", range: "Revelation 20 – 22", desc: "Satan destroyed, judgment executed, New Jerusalem, no more curse" }
    ];

    // Create flashcards for each set
    const flashcards = bibleRenderedSets.map((set, index) => ({
      set_id: flashcardSet.id,
      order_index: index,
      question: `Set ${set.num}: ${set.symbol} - What is this set about?`,
      answer: `${set.name}\n\nRange: ${set.range}\n\nDescription: ${set.desc}`,
      verse_reference: set.range
    }));

    const { error: flashcardsError } = await supabaseClient
      .from('flashcards')
      .insert(flashcards);

    if (flashcardsError) {
      console.error('Error creating flashcards:', flashcardsError);
      throw flashcardsError;
    }

    console.log(`Successfully created ${flashcards.length} flashcards`);

    return new Response(
      JSON.stringify({
        success: true,
        setId: flashcardSet.id,
        message: 'Bible Rendered flashcard set created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-bible-rendered-flashcards:', error);
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
