import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, Zap } from "lucide-react";

interface ValuePropositionProps {
  roomId: string;
}

export const ValueProposition = ({ roomId }: ValuePropositionProps) => {
  const values: Record<string, {
    why: string;
    whatYouGain: string;
    immediate: string;
  }> = {
    // Floor 1 - Furnishing
    sr: {
      why: "You can't interpret what you can't remember. Every other room in the Palace depends on you knowing the storyline.",
      whatYouGain: "Instant recall of any Bible story in beats—teach it, preach it, reference it without notes",
      immediate: "In 5 minutes, you'll have David & Goliath locked in your memory forever"
    },
    ir: {
      why: "Facts alone don't transform you—but experiencing Scripture with all five senses burns it into your heart",
      whatYouGain: "Stories that stick for decades because you've truly 'been there'—not just read about it",
      immediate: "In 2 minutes, one scene will touch your emotions deeper than 10 commentaries"
    },
    "24fps": {
      why: "You've read it, but WHERE was it? This room makes every chapter instantly findable.",
      whatYouGain: "Never again stare blankly when someone references a chapter—you'll see the image and recall the content",
      immediate: "In 5 minutes, you'll have 3 chapters permanently indexed in your mind"
    },
    br: {
      why: "Without the big picture, you get lost in details. This gives you a mental map of all 1,189 chapters.",
      whatYouGain: "See how every passage fits into the grand narrative—sketch the whole Bible on a napkin",
      immediate: "In 5 minutes, you'll compress 24 chapters into one unforgettable symbol"
    },
    tr: {
      why: "Your brain remembers images 6x better than words. This turns abstract truth into concrete visuals.",
      whatYouGain: "Illustrations that make your teaching unforgettable—listeners forget points but remember pictures",
      immediate: "In 3 minutes, one verse will become a vivid image you'll never forget"
    },
    gr: {
      why: "The most powerful insights emerge when you combine texts that illuminate each other",
      whatYouGain: "Sermon-ready truths that defend the faith and reveal connections most readers miss",
      immediate: "In 5 minutes, discover one 'aha!' connection that will preach for years"
    },
    or: {
      why: "Interpretation built on sloppy observation is a house on sand. This trains your eye to see what's really there.",
      whatYouGain: "Patterns and details you never noticed before—the 23rd observation often unlocks everything",
      immediate: "In 5 minutes, find 10 details in one verse you've read a hundred times"
    },
    dc: {
      why: "English translations hide crucial meanings. You need to know what the original words meant THEN.",
      whatYouGain: "Stand on the shoulders of giants while keeping Scripture as final authority",
      immediate: "In 10 minutes, unlock one word that changes how you see an entire passage"
    },
    st: {
      why: "God's symbols are consistent throughout Scripture—learn the vocabulary He uses to teach",
      whatYouGain: "A theological toolbox of symbols that unlock hundreds of passages instantly",
      immediate: "In 10 minutes, map one symbol (like LAMB) from Genesis to Revelation"
    },
    qr: {
      why: "Quality of understanding equals quality of questions—this room trains relentless interrogation",
      whatYouGain: "A diagnostic tool that exposes hidden meaning through precision questioning",
      immediate: "In 5 minutes, generate 10 questions about one verse you'll never see the same way"
    },
    qa: {
      why: "Scripture interprets Scripture—this keeps you from importing opinions into the text",
      whatYouGain: "Interpretive authority built on chains of biblical evidence, not clever ideas",
      immediate: "In 5 minutes, answer one question using only Scripture as witness"
    },
    // Floor 3 - Freestyle
    nf: {
      why: "Creation declares God's glory—this trains you to see theology in trees, storms, and sparrows",
      whatYouGain: "A bilingual fluency in natural and special revelation—every walk becomes a sermon",
      immediate: "In 3 minutes, turn one natural object into an unforgettable spiritual lesson"
    },
    pf: {
      why: "Your biography becomes theology when you read life events through Scripture's lens",
      whatYouGain: "Authentic testimony—preach from your scars and joys with verified experience",
      immediate: "In 5 minutes, reinterpret one life event as part of God's covenant storyline"
    },
    bf: {
      why: "Every verse is related—discovering verse genetics reveals connections readers miss",
      whatYouGain: "A family tree of Scripture showing siblings, cousins, and distant relatives",
      immediate: "In 3 minutes, link two verses and watch new meaning emerge"
    },
    hf: {
      why: "History repeats God's patterns—current events become object lessons",
      whatYouGain: "The ability to interpret culture through biblical wisdom, not trending opinions",
      immediate: "In 5 minutes, connect one current event to a biblical principle"
    },
    lr: {
      why: "Conversations are springboards—train to turn any remark into Scripture connections",
      whatYouGain: "Agile, responsive witness—you'll never be caught without a word",
      immediate: "In 3 minutes, practice turning one casual conversation into a biblical insight"
    },
    // Floor 4 - Next Level
    cr: {
      why: "Christ isn't just nice—He's functional. Knowing His office (Prophet/Priest/King) sharpens everything",
      whatYouGain: "Precise Christology that shows what Christ DOES, not just who He is",
      immediate: "In 3 minutes, tag one passage with Christ's office and see new clarity"
    },
    dr: {
      why: "Scripture is a diamond with five facets—seeing all dimensions prevents reductionism",
      whatYouGain: "Rich, layered readings that satisfy scholars and saints simultaneously",
      immediate: "In 5 minutes, see one verse through five lenses and discover hidden depth"
    },
    c6: {
      why: "Parables aren't prophecies—genre blindness causes massive interpretive chaos",
      whatYouGain: "Stop making rookie mistakes like allegorizing parables or literalizing apocalyptic imagery",
      immediate: "In 3 minutes, identify one genre and apply the right interpretive rules"
    },
    trm: {
      why: "Texts belong to structural walls—knowing which span prevents random connections",
      whatYouGain: "Architectural clarity—every passage has its load-bearing location",
      immediate: "In 3 minutes, assign one passage to its theological span"
    },
    tz: {
      why: "Past, present, or future? Earth or heaven? This prevents confusion about timing",
      whatYouGain: "Temporal clarity—you'll never mix completed work with awaiting promises",
      immediate: "In 3 minutes, locate one verse in its correct time zone"
    },
    prm: {
      why: "God's fingerprints repeat with variation—patterns reveal His consistent ways",
      whatYouGain: "Pattern recognition that anticipates how God works across stories",
      immediate: "In 5 minutes, spot one recurring motif across three texts"
    },
    "p||": {
      why: "Mirrored actions across time show how history echoes—parallels enrich interpretation",
      whatYouGain: "The ability to see Babel/Pentecost or Exodus/Return connections instantly",
      immediate: "In 5 minutes, identify one parallel action and see the mirror reflection"
    },
    frt: {
      why: "Truth must produce love, joy, peace—if it doesn't, something's wrong with the interpretation",
      whatYouGain: "A safety test that ensures study produces Christlike character, not arrogance",
      immediate: "In 3 minutes, test one interpretation for spiritual fruit"
    },
    cec: {
      why: "ALL Scripture testifies of Jesus—every chapter without exception must yield a Christ-line",
      whatYouGain: "A comprehensive Christ-map that transforms history lessons into gospel encounters",
      immediate: "In 5 minutes, find Christ in one unexpected chapter"
    },
    r66: {
      why: "One theme through 66 books reveals progressive revelation—this builds panoramic theology",
      whatYouGain: "The ability to sketch entire redemptive arcs on a napkin",
      immediate: "In 10 minutes, trace one theme through 5 key books"
    },
    // Floor 5 - Vision
    bl: {
      why: "The sanctuary is the blueprint—every article points to Christ's work",
      whatYouGain: "A visual map of salvation that unlocks hundreds of passages",
      immediate: "In 5 minutes, connect one passage to sanctuary furniture"
    },
    pr: {
      why: "Daniel and Revelation aren't puzzles—they're God's master timeline",
      whatYouGain: "Confidence navigating prophecy without speculation or newspaper exegesis",
      immediate: "In 5 minutes, map one prophetic sequence with symbols"
    },
    "3a": {
      why: "The Three Angels are marching orders—all doctrine converges here",
      whatYouGain: "A missional framework that turns study into proclamation",
      immediate: "In 3 minutes, connect one truth to the final gospel appeal"
    },
    fe: {
      why: "The feasts are enacted prophecy—they reveal Christ's timeline",
      whatYouGain: "A redemptive calendar showing past fulfillment and future hope",
      immediate: "In 5 minutes, connect one passage to a feast and see prophetic timing"
    },
    // Floor 6 - Three Heavens & Cycles
    "123h": {
      why: "Prophecies have multiple horizons—flattening them into one causes chaos",
      whatYouGain: "Clarity on what's fulfilled, in progress, or awaiting final consummation",
      immediate: "In 5 minutes, tag one prophecy's horizon with historical evidence"
    },
    cycles: {
      why: "History repeats in patterns—God's covenant arcs are consistent",
      whatYouGain: "The ability to compare sanctuary, enemy, and restoration across eras",
      immediate: "In 5 minutes, assign one passage to its cycle and see the pattern"
    },
    jr: {
      why: "Surface reading misses essence—this room forces deep compression",
      whatYouGain: "Mastery of entire books through layered synthesis",
      immediate: "In 15 minutes, squeeze one short book through multiple rooms"
    },
    // Floor 7 - Spiritual & Emotional
    frm: {
      why: "Truth that only touches mind never transforms heart—experience burns deeper",
      whatYouGain: "Passages that pierce your soul and stick for decades",
      immediate: "In 3 minutes, let one scene touch your emotions deeper than 10 commentaries"
    },
    mr: {
      why: "Slow cooking beats microwaving—marinated Scripture carries richer flavor",
      whatYouGain: "Depth that casual reading misses, truths that saturate your spirit",
      immediate: "In 5 minutes, repeat one phrase until it rests in your bones"
    },
    srm: {
      why: "Reflexes build through speed—quick connections train your brain for instant recall",
      whatYouGain: "The ability to answer questions and make connections without hours of study",
      immediate: "In 3 minutes, rapid-fire through 10 connections and build neural pathways"
    }
  };

  const value = values[roomId];
  if (!value) return null;

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Why This Room Matters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">The Foundation</h4>
              <p className="text-sm text-muted-foreground">{value.why}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">What You'll Gain</h4>
              <p className="text-sm text-muted-foreground">{value.whatYouGain}</p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-primary">
            ⚡ Quick Win: {value.immediate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
