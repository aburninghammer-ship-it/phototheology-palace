import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickStartGuideProps {
  roomId: string;
  roomName: string;
}

export const QuickStartGuide = ({ roomId, roomName }: QuickStartGuideProps) => {
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickStarts: Record<string, {
    title: string;
    tagline: string;
    steps: Array<{
      action: string;
      example: string;
      tip: string;
    }>;
  }> = {
    // Floor 1 - Furnishing
    sr: {
      title: "Try Your First Story Beat",
      tagline: "Turn one story into 5 memorable beats in 3 minutes",
      steps: [
        {
          action: "Pick a story",
          example: "David & Goliath (1 Samuel 17)",
          tip: "Start with a story you already know"
        },
        {
          action: "List 5 key moments",
          example: "Giant → Boy → Stones → Sling → Victory",
          tip: "Use punchy nouns and verbs, not sentences"
        },
        {
          action: "Test it",
          example: "Can you retell the story using just these 5 beats?",
          tip: "If you need more than 7 beats, you're covering too much"
        }
      ]
    },
    ir: {
      title: "Step Into One Scene",
      tagline: "Experience one verse with all five senses in 2 minutes",
      steps: [
        {
          action: "Pick a vivid scene",
          example: "Jesus calming the storm (Mark 4:39)",
          tip: "Choose action-packed moments for your first try"
        },
        {
          action: "Close your eyes & experience it",
          example: "Feel the rocking boat, hear the wind howling, see the panicked faces, smell the sea spray",
          tip: "Spend 30 seconds on each sense"
        },
        {
          action: "Write one powerful sentence",
          example: "The crushing fear in my chest as waves tower over me, then His voice—and sudden, eerie silence.",
          tip: "Capture the emotional shift"
        }
      ]
    },
    "24fps": {
      title: "Create Your First 3 Frames",
      tagline: "Turn 3 chapters into instant-recall images in 5 minutes",
      steps: [
        {
          action: "Choose 3 chapters you know",
          example: "Genesis 1, 3, and 22",
          tip: "Start with familiar chapters for quick wins"
        },
        {
          action: "Pick ONE striking image per chapter",
          example: "Gen 1 = Birthday cake Earth • Gen 3 = Snake+Apple+Clock • Gen 22 = Knife over altar",
          tip: "Quirky and weird sticks better than dignified"
        },
        {
          action: "Test instant recall",
          example: "Someone says 'Genesis 3'—does your image flash instantly?",
          tip: "The image is a trigger, not a summary"
        }
      ]
    },
    br: {
      title: "Map Your First Book Block",
      tagline: "Compress 24 chapters into 1 symbol in 5 minutes",
      steps: [
        {
          action: "Pick one 24-chapter block",
          example: "Genesis 1-24",
          tip: "Start with a book you know well"
        },
        {
          action: "Find the central movement",
          example: "Divisions emerge: light/dark, land/sea, nations splitting",
          tip: "What's the BIG arc across all 24 chapters?"
        },
        {
          action: "Choose a symbol",
          example: "Genesis 1-24 = '/' (slash = division)",
          tip: "Keep it simple—one symbol only"
        }
      ]
    },
    tr: {
      title: "Translate Your First Verse",
      tagline: "Turn one abstract verse into a concrete image in 3 minutes",
      steps: [
        {
          action: "Pick a metaphor verse",
          example: "Psalm 119:105 - 'Thy word is a lamp unto my feet'",
          tip: "Verses with objects work best first"
        },
        {
          action: "Draw or describe the image",
          example: "A glowing scroll unrolled on a dark trail, casting golden light 5 feet ahead",
          tip: "Bad art is fine—focus on memorability"
        },
        {
          action: "Test it",
          example: "Does this image stick in your mind better than the words alone?",
          tip: "Images should be 6x more memorable"
        }
      ]
    },
    gr: {
      title: "Mine Your First Gem",
      tagline: "Discover one hidden connection in 5 minutes",
      steps: [
        {
          action: "Pick 2 verses from different books",
          example: "Exodus 12:6 (Passover at twilight) + John 19:14 (crucifixion timing)",
          tip: "Look for unexpected connections"
        },
        {
          action: "Place them side by side",
          example: "Passover lamb slain at twilight... Jesus died at same hour",
          tip: "What beautiful truth emerges?"
        },
        {
          action: "Write the gem",
          example: "💎 Jesus died at the EXACT moment Passover lambs were being slain—He is the true Passover Lamb",
          tip: "One sentence that preaches"
        }
      ]
    },
    // Floor 2 - Investigation
    or: {
      title: "Observe One Verse",
      tagline: "Find 10 details you've never noticed in 5 minutes",
      steps: [
        {
          action: "Pick one rich verse",
          example: "Luke 15:20 (Prodigal's return)",
          tip: "Choose verses with action and detail"
        },
        {
          action: "List 10 things you SEE",
          example: "1. Father SAW (was watching) 2. 'While still far off' 3. Father RAN 4. Fell on neck 5. Kissed him 6. Before son finished speech...",
          tip: "No interpretation yet—just facts"
        },
        {
          action: "Notice the pattern",
          example: "All verbs show father's eager, undignified initiative—he doesn't wait",
          tip: "20+ observations reveal patterns"
        }
      ]
    },
    dc: {
      title: "Define Your First Key Word",
      tagline: "Unlock one Greek/Hebrew word in 5 minutes",
      steps: [
        {
          action: "Pick one crucial word",
          example: "Love in John 21:15 (agapao vs. phileo)",
          tip: "Choose words that carry theological weight"
        },
        {
          action: "Look it up",
          example: "agapao (G25) = divine, sacrificial love | phileo (G5368) = friendship love",
          tip: "Use Strong's Concordance or Bible Hub"
        },
        {
          action: "Note why it matters",
          example: "Jesus asks 'Do you agapao me?' but Peter responds 'I phileo you'—shows Peter's honest limitation",
          tip: "One word can change everything"
        }
      ]
    },
    st: {
      title: "Map Your First Symbol",
      tagline: "Track one biblical symbol in 10 minutes",
      steps: [
        {
          action: "Choose a common symbol",
          example: "LAMB",
          tip: "Start with symbols Jesus explicitly fulfills"
        },
        {
          action: "Find 5 key texts",
          example: "Gen 22 (ram) → Ex 12 (Passover) → Isa 53 (slaughter) → John 1:29 (behold) → Rev 5 (throne)",
          tip: "Track from OT to NT"
        },
        {
          action: "Write the Christ-connection",
          example: "Lamb = Substitutionary sacrifice → Jesus is the Lamb of God who takes away sin",
          tip: "Every symbol points to Christ"
        }
      ]
    },
    qr: {
      title: "Ask 10 Questions",
      tagline: "Interrogate one verse in 5 minutes",
      steps: [
        {
          action: "Pick a rich verse",
          example: "John 11:35 - 'Jesus wept'",
          tip: "Short verses can yield deep questions"
        },
        {
          action: "Ask inside the text",
          example: "Why shortest verse? Why weep if He knows resurrection coming? What's the Greek tense?",
          tip: "Intra-textual = within the passage"
        },
        {
          action: "Ask across Scripture",
          example: "Where else does Jesus weep? How does this connect to 'Man of sorrows' in Isaiah 53?",
          tip: "Inter-textual = cross-references"
        }
      ]
    },
    qa: {
      title: "Answer One Question",
      tagline: "Let Scripture interpret Scripture in 5 minutes",
      steps: [
        {
          action: "Take one question",
          example: "Why did the father run to the prodigal?",
          tip: "Pick a question you already have"
        },
        {
          action: "Find 2-3 biblical answers",
          example: "Ps 103:13 (father's compassion) + Isa 49:15 (can't forget) + Ezek 33:11 (no pleasure in death)",
          tip: "Use concordances and cross-references"
        },
        {
          action: "Synthesize in one sentence",
          example: "Divine compassion can't wait—it runs to close the gap",
          tip: "Scripture interprets Scripture"
        }
      ]
    },
    // Floor 3 - Freestyle
    nf: {
      title: "Find God in Nature",
      tagline: "Turn one natural object into a spiritual lesson in 3 minutes",
      steps: [
        {
          action: "Observe something in creation",
          example: "Oak tree with deep roots",
          tip: "Pick something you can see right now"
        },
        {
          action: "Link to Scripture",
          example: "Psalm 1:3 / Jeremiah 17:8 - trees planted by water",
          tip: "Find where Scripture uses this object"
        },
        {
          action: "Distill the lesson",
          example: "Visible strength depends on invisible depth—stability requires hidden communion with God",
          tip: "One punchy sentence"
        }
      ]
    },
    pf: {
      title: "Interpret Your Story",
      tagline: "Read your life through Scripture in 5 minutes",
      steps: [
        {
          action: "Pick one personal event",
          example: "Lost a job",
          tip: "Recent experiences work best"
        },
        {
          action: "Find a biblical parallel",
          example: "Joseph's prison → palace / David's exile → throne",
          tip: "Look for similar patterns"
        },
        {
          action: "Extract the lesson",
          example: "Displacement often precedes divine positioning—God is writing a story",
          tip: "Sanctify your memory through Scripture"
        }
      ]
    },
    bf: {
      title: "Connect Two Verses",
      tagline: "Discover one verse genetics link in 3 minutes",
      steps: [
        {
          action: "Pick two similar verses",
          example: "John 3:16 and Romans 5:8",
          tip: "Look for thematic siblings"
        },
        {
          action: "Show the relationship",
          example: "Both reveal God's love through the cross—brothers in the gospel family",
          tip: "Verses are related like family members"
        },
        {
          action: "Note what deepens",
          example: "John emphasizes believing; Romans emphasizes 'while we were yet sinners'",
          tip: "Each adds nuance"
        }
      ]
    },
    // Floor 4 - Next Level
    cr: {
      title: "Tag Christ's Office",
      tagline: "Identify Prophet/Priest/King in one passage in 3 minutes",
      steps: [
        {
          action: "Read the passage",
          example: "Exodus 12 (Passover)",
          tip: "Watch what Christ/type is doing"
        },
        {
          action: "Tag the office",
          example: "PRIEST → Lamb of God → Substitutes blood to avert judgment",
          tip: "Prophet=reveals, Priest=mediates, King=rules"
        },
        {
          action: "State the benefit",
          example: "Deliverance from death through His sacrifice",
          tip: "What does He accomplish for us?"
        }
      ]
    },
    dr: {
      title: "See Five Dimensions",
      tagline: "View one verse through 5 lenses in 5 minutes",
      steps: [
        {
          action: "Pick a familiar verse",
          example: "Psalm 23:1",
          tip: "Start with verses you know"
        },
        {
          action: "Write 5 dimensions",
          example: "Literal=David's trust | Christ=Good Shepherd | Me=Daily provision | Church=Corporate care | Heaven=Eternal dwelling",
          tip: "One sentence per dimension"
        },
        {
          action: "Check for repetition",
          example: "Each dimension should offer distinct insight",
          tip: "Don't say the same thing 5 ways"
        }
      ]
    },
    c6: {
      title: "Identify the Genre",
      tagline: "Tag one passage's type and rules in 3 minutes",
      steps: [
        {
          action: "Name the genre",
          example: "Matthew 13:44 = Parable",
          tip: "Prophecy/Parable/Epistle/History/Gospel/Poetry"
        },
        {
          action: "State the rule",
          example: "Parables have ONE main point—don't allegorize details",
          tip: "Each genre has specific rules"
        },
        {
          action: "Apply it",
          example: "Point = Kingdom is worth everything. NOT 'field=world, man=Jesus'",
          tip: "Genre shapes interpretation"
        }
      ]
    },
    // Floor 5 - Vision
    bl: {
      title: "Map to Sanctuary",
      tagline: "Connect one passage to sanctuary furniture in 5 minutes",
      steps: [
        {
          action: "Identify the sanctuary element",
          example: "John 6 → Bread of Life → Table of Showbread",
          tip: "Look for explicit or implicit connections"
        },
        {
          action: "Note the OT pattern",
          example: "12 loaves always present in Holy Place (Lev 24)",
          tip: "Know the original furniture/service"
        },
        {
          action: "Show Christ's fulfillment",
          example: "Jesus is the true Bread—eternal sustenance",
          tip: "Sanctuary is Christ's blueprint"
        }
      ]
    },
    pr: {
      title: "Trace One Prophecy",
      tagline: "Follow one prophetic line in 5 minutes",
      steps: [
        {
          action: "Pick a Daniel/Revelation passage",
          example: "Daniel 2 (statue of kingdoms)",
          tip: "Start with major prophecies"
        },
        {
          action: "List the symbols",
          example: "Head=Babylon, Chest=Medo-Persia, Belly=Greece, Legs=Rome, Stone=Christ's kingdom",
          tip: "Let Scripture interpret symbols"
        },
        {
          action: "Note fulfillment",
          example: "Historical kingdoms fulfilled; stone kingdom being established now",
          tip: "Track past, present, future"
        }
      ]
    },
    "3a": {
      title: "Connect to Three Angels",
      tagline: "Link one truth to Rev 14:6-12 in 3 minutes",
      steps: [
        {
          action: "Read your passage",
          example: "Exodus 20 (Sabbath command)",
          tip: "Look for worship/judgment/truth themes"
        },
        {
          action: "Find the angel connection",
          example: "Angel 1 → Worship the Creator → Sabbath is creation memorial",
          tip: "1st=Worship Creator, 2nd=Babylon falls, 3rd=Beast warning"
        },
        {
          action: "State mission application",
          example: "Proclaim Sabbath as sign of Creator-worship in judgment hour",
          tip: "These are marching orders"
        }
      ]
    },
    // Floor 6 - Three Heavens & Cycles
    "123h": {
      title: "Assign the Horizon",
      tagline: "Tag one prophecy's fulfillment horizon in 5 minutes",
      steps: [
        {
          action: "Read the prophecy",
          example: "Isaiah 65 (new heavens/earth)",
          tip: "Look for time clues"
        },
        {
          action: "Assign horizon(s)",
          example: "1H (post-exile return) + 3H (final new creation)",
          tip: "1H=Babylon/return, 2H=AD 70/church, 3H=final"
        },
        {
          action: "Defend it",
          example: "'Build houses' = historical 1H; 'no more death' = cosmic 3H",
          tip: "Use text + history as evidence"
        }
      ]
    },
    cycles: {
      title: "Tag the Cycle",
      tagline: "Identify which covenant era in 5 minutes",
      steps: [
        {
          action: "Read the passage",
          example: "Exodus 14 (Red Sea)",
          tip: "Note the historical context"
        },
        {
          action: "Assign the cycle",
          example: "@Mo (Moses/Sinai covenant) → Exodus from slavery",
          tip: "@Ad/@No/@Ab/@Mo/@Cy/@CyC/@Sp/@Re"
        },
        {
          action: "Note the 5-beat arc",
          example: "Fall=slavery, Covenant=Sinai, Sanctuary=Tabernacle, Enemy=Egypt, Restoration=Canaan march",
          tip: "Each cycle has this pattern"
        }
      ]
    },
    // Floor 7 - Spiritual & Emotional
    frm: {
      title: "Feel the Fire",
      tagline: "Let one passage touch your heart in 3 minutes",
      steps: [
        {
          action: "Choose an emotional passage",
          example: "Isaiah 53 (Suffering Servant)",
          tip: "Pick scenes with weight"
        },
        {
          action: "Slow down & feel",
          example: "'Despised and rejected... a man of sorrows' — feel the loneliness, the crushing weight",
          tip: "Don't just analyze—experience"
        },
        {
          action: "Journal one response",
          example: "He bore MY griefs—I'm undone by this love",
          tip: "Let truth burn into your heart"
        }
      ]
    },
    mr: {
      title: "Meditate on One Line",
      tagline: "Marinate in truth for 5 minutes",
      steps: [
        {
          action: "Pick one short phrase",
          example: "'The LORD is my shepherd'",
          tip: "Shorter is better for meditation"
        },
        {
          action: "Repeat it slowly",
          example: "Say it 10 times, pausing between each",
          tip: "Let it saturate your mind"
        },
        {
          action: "Rest in it",
          example: "What changes if this is true? How does it comfort today?",
          tip: "Meditation isn't about speed"
        }
      ]
    },
    srm: {
      title: "Quick Recall Drill",
      tagline: "Sprint through connections in 3 minutes",
      steps: [
        {
          action: "Set a timer for 3 minutes",
          example: "Ready, set, go!",
          tip: "Speed builds reflexes"
        },
        {
          action: "Rapid-fire connections",
          example: "John 1 → Light → Gen 1 → Creation → John 1:3 → All through Him → Col 1:16",
          tip: "Don't overthink—just connect"
        },
        {
          action: "Note your speed",
          example: "How many connections in 3 minutes? Try to beat it next time",
          tip: "This builds neural pathways"
        }
      ]
    }
  };

  const guide = quickStarts[roomId];
  if (!guide) return null;

  const handleStepComplete = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
      if (index === guide.steps.length - 1) {
        toast({
          title: "Quick Start Complete! 🎉",
          description: "You've got the basics. Now dive deeper in the full room content.",
        });
      }
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Example copied—now try it yourself!",
    });
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Quick Start
              </Badge>
            </div>
            <CardTitle className="text-2xl">{guide.title}</CardTitle>
            <CardDescription className="text-base mt-1">
              {guide.tagline}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {guide.steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${
              completedSteps.includes(index)
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                completedSteps.includes(index)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-lg">{step.action}</h4>
                <div className="bg-muted/50 p-3 rounded border border-border relative group">
                  <p className="text-sm font-mono pr-8">{step.example}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(step.example, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  💡 {step.tip}
                </p>
                {!completedSteps.includes(index) && (
                  <Button
                    size="sm"
                    onClick={() => handleStepComplete(index)}
                    className="mt-2"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {completedSteps.length === guide.steps.length && (
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <CheckCircle className="h-5 w-5" />
              <span>Quick Start Complete!</span>
            </div>
            <p className="text-sm">
              You've experienced the core method. Now scroll down to explore the full methodology, examples, and practice with Jeeves.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
