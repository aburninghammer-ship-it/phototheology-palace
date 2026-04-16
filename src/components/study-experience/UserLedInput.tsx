import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

// Detailed explanations for each principle to guide user-led study
const PRINCIPLE_GUIDES: Record<string, string> = {
  // Dimensions Room
  "dr-literal": "What does this verse say at face value? What is the plain, historical meaning — who said it, to whom, and what was happening?",
  "dr-christ": "How does this verse point to Jesus Christ — His life, His sacrifice, His character, or His mission? Where is Christ hidden in these words?",
  "dr-personal": "What does this verse say to YOU personally? How does it speak to your life, your struggles, your growth right now?",
  "dr-church": "What does this verse reveal about the body of Christ — the church's mission, its struggles, or its calling through history?",
  "dr-endtimes": "How does this verse connect to the end times — final events, the Second Coming, or the ultimate restoration of all things?",

  // Connect-6
  "c6-prophecy": "Is this verse connected to any prophecy — either as a prediction, a fulfillment, or a prophetic pattern?",
  "c6-parable": "Does this verse contain or connect to a parable or illustrative story? What deeper lesson is being taught through imagery?",
  "c6-epistle": "How does this verse connect to the apostolic letters? Does it echo teaching, doctrine, or instruction given to the early church?",
  "c6-history": "What historical narrative does this verse belong to or connect with? What does the historical context reveal?",
  "c6-gospel": "How does this verse connect to the Gospel accounts — the life, teachings, death, or resurrection of Jesus?",
  "c6-poetry": "Does this verse connect to the poetic or wisdom literature? Is there a psalm, proverb, or song that echoes its theme?",

  // Time Zone
  "tz-hp": "What was happening in HEAVEN in the PAST that connects to this verse?",
  "tz-hpr": "What is happening in HEAVEN RIGHT NOW that connects to this verse?",
  "tz-hf": "What will happen in HEAVEN in the FUTURE that connects to this verse?",
  "tz-ep": "What happened on EARTH in the PAST that connects to this verse?",
  "tz-epr": "What is happening on EARTH RIGHT NOW that connects to this verse?",
  "tz-ef": "What will happen on EARTH in the FUTURE that connects to this verse?",

  // Concentration Room
  "cr-prophet": "How does this verse reveal Christ as PROPHET — the One who speaks God's truth, reveals God's will, and proclaims God's word?",
  "cr-priest": "How does this verse reveal Christ as PRIEST — the One who intercedes, mediates, atones, and ministers on our behalf?",
  "cr-king": "How does this verse reveal Christ as KING — the One who rules, reigns, conquers, and exercises sovereign authority?",

  // Blue Room — Sanctuary
  "bl-altar": "How does this verse connect to the Altar of Burnt Offering — sacrifice, surrender, and total consecration?",
  "bl-laver": "How does this verse connect to the Laver — cleansing, sanctification, and washing by the Word?",
  "bl-lampstand": "How does this verse connect to the Lampstand — the light of God's Spirit, illumination, and witness?",
  "bl-showbread": "How does this verse connect to the Table of Showbread — communion, fellowship, and the Bread of Life?",
  "bl-incense": "How does this verse connect to the Altar of Incense — prayer, intercession, and worship?",
  "bl-ark": "How does this verse connect to the Ark of the Covenant — God's law, His presence, and His covenant promises?",
  "bl-mercy": "How does this verse connect to the Mercy Seat — grace, atonement, and the meeting place between God and man?",

  // Christ in Every Chapter
  "cec-explicit": "Where is Christ EXPLICITLY mentioned or directly referenced in this verse or its surrounding chapter?",
  "cec-typological": "What TYPE or shadow of Christ appears here? What person, object, or event prefigures Christ?",
  "cec-thematic": "What THEME in this verse echoes the character, mission, or work of Christ?",
  "cec-prophetic": "What PROPHECY of Christ is found here — either spoken, symbolized, or patterned?",

  // Observation Room
  "or-who": "WHO is involved in this verse? Who is speaking, acting, or being addressed?",
  "or-what": "WHAT is happening? What action, event, or statement is being made?",
  "or-when": "WHEN does this take place? What is the time setting or sequence of events?",
  "or-where": "WHERE does this happen? What is the geographical or spiritual location?",
  "or-why": "WHY is this happening? What is the purpose, cause, or motivation behind it?",

  // Theme Room
  "trm-covenant": "How does this verse connect to the theme of COVENANT — God's binding promises and agreements with His people?",
  "trm-redemption": "How does this verse connect to the theme of REDEMPTION — buying back, deliverance, and liberation?",
  "trm-kingdom": "How does this verse connect to the theme of GOD'S KINGDOM — His reign, His territory, and His subjects?",
  "trm-judgment": "How does this verse connect to the theme of JUDGMENT — God's justice, evaluation, and final decisions?",
  "trm-restoration": "How does this verse connect to the theme of RESTORATION — God making all things new?",

  // Patterns Room
  "prm-repeat": "What REPEATING PATTERN do you see — a cycle, a recurring event, or a principle that appears again and again in Scripture?",
  "prm-contrast": "What CONTRAST or opposition do you see — light vs. dark, obedience vs. rebellion, blessing vs. curse?",
  "prm-progression": "What PROGRESSION do you see — a movement from lesser to greater, from shadow to substance, from promise to fulfillment?",

  // Parallels Room
  "p||-ot-nt": "What Old Testament passage PARALLELS this verse in the New Testament, or vice versa?",
  "p||-story": "What other STORY in Scripture mirrors the events, characters, or themes of this verse?",
  "p||-person": "What other PERSON in Scripture parallels the figure in this verse — similar calling, trial, or response?",

  // Fruit Room
  "frt-love": "How does this verse reveal or cultivate LOVE — God's love, or the love He calls us to show?",
  "frt-joy": "How does this verse reveal or cultivate JOY — deep gladness rooted in God's promises?",
  "frt-peace": "How does this verse reveal or cultivate PEACE — wholeness, reconciliation, and rest in God?",
  "frt-patience": "How does this verse reveal or cultivate PATIENCE — endurance, long-suffering, and trust in God's timing?",
  "frt-kindness": "How does this verse reveal or cultivate KINDNESS — generosity, gentleness, and compassion?",
  "frt-goodness": "How does this verse reveal or cultivate GOODNESS — moral excellence and righteous action?",
  "frt-faith": "How does this verse reveal or cultivate FAITHFULNESS — loyalty, trustworthiness, and fidelity to God?",
  "frt-gentle": "How does this verse reveal or cultivate GENTLENESS — meekness, humility, and controlled strength?",
  "frt-self": "How does this verse reveal or cultivate SELF-CONTROL — discipline, temperance, and mastery over desire?",
};

interface UserLedInputProps {
  roomName: string;
  principleName: string;
  principleId: string;
  principleDescription: string;
  userInput: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  teachMe?: boolean;
}

export function UserLedInput({
  roomName,
  principleName,
  principleId,
  principleDescription,
  userInput,
  onChange,
  onSubmit,
  loading,
  teachMe = false,
}: UserLedInputProps) {
  const guide = PRINCIPLE_GUIDES[principleId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-card/80 border space-y-3 ${teachMe ? "border-amber-500/30" : "border-blue-500/30"}`}
    >
      <p className="text-sm font-medium">
        {teachMe ? (
          <>🎓 Try applying <span className="text-amber-400">{roomName}: {principleName}</span> — Jeeves will guide your thinking</>
        ) : (
          <>How does <span className="text-blue-400">{roomName}: {principleName}</span> illuminate this verse?</>
        )}
      </p>

      {/* Principle explanation */}
      <div className={`flex gap-2 items-start rounded-lg px-3 py-2.5 ${teachMe ? "bg-amber-500/5 border border-amber-500/15" : "bg-blue-500/5 border border-blue-500/15"}`}>
        <HelpCircle className={`w-4 h-4 mt-0.5 shrink-0 ${teachMe ? "text-amber-400" : "text-blue-400"}`} />
        <p className={`text-xs leading-relaxed ${teachMe ? "text-amber-300/80" : "text-blue-300/80"}`}>
          {teachMe
            ? `Think about this: ${guide || principleDescription} Don't worry about getting it perfect — write what you see, and Jeeves will help you dig deeper.`
            : guide || principleDescription}
        </p>
      </div>

      <Textarea
        value={userInput}
        onChange={(e) => onChange(e.target.value)}
        placeholder={teachMe ? "Write what you think the connection is…" : "Write your connection here..."}
        rows={3}
        className="bg-background/50 border-border/50 resize-none"
      />
      <Button
        onClick={onSubmit}
        disabled={!userInput.trim() || loading}
        size="sm"
        className={`w-full ${teachMe ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500" : ""}`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        {loading ? (teachMe ? "Jeeves is thinking…" : "Evaluating...") : (teachMe ? "Submit & Get Guidance" : "Submit Connection")}
      </Button>
    </motion.div>
  );
}
