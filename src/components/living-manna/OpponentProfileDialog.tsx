import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Swords, Target, BookOpen, Sparkles, Crosshair,
  AlertTriangle, Brain, Flame, ChevronRight, Eye, Zap, GraduationCap,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DefenseOpponent } from "@/data/defenseModeOpponents";
import { DEFENSE_TOPICS } from "@/data/defenseModeOpponents";
import { AATS_AVATAR_IDS, AATS_PHASES, type AATSAvatarId } from "@/data/aatsTrainingData";
import { useAATSProgress } from "@/hooks/useAATSProgress";
import { Progress } from "@/components/ui/progress";
import { getAvatarTraining } from "@/data/aatsTrainingData";

// Convert second-person AI prompt text to third-person for display, respecting pronouns
function toThirdPerson(text: string, pronouns: "he/him" | "she/her" | "they/them" = "he/him"): string {
  let s = text;
  const subj = pronouns === "she/her" ? "She" : pronouns === "they/them" ? "They" : "He";
  const poss = pronouns === "she/her" ? "her" : pronouns === "they/them" ? "their" : "his";
  const possCap = pronouns === "she/her" ? "Her" : pronouns === "they/them" ? "Their" : "His";
  const sg = pronouns !== "they/them";
  const verbs: [string, string][] = [
    ["are", sg ? "is" : "are"], ["hold", sg ? "holds" : "hold"], ["reject", sg ? "rejects" : "reject"], ["consider", sg ? "considers" : "consider"],
    ["view", sg ? "views" : "view"], ["believe", sg ? "believes" : "believe"], ["argue", sg ? "argues" : "argue"], ["emphasize", sg ? "emphasizes" : "emphasize"],
    ["teach", sg ? "teaches" : "teach"], ["maintain", sg ? "maintains" : "maintain"], ["use", sg ? "uses" : "use"], ["cite", sg ? "cites" : "cite"],
    ["press", sg ? "presses" : "press"], ["point", sg ? "points" : "point"], ["challenge", sg ? "challenges" : "challenge"], ["insist", sg ? "insists" : "insist"],
    ["seek", sg ? "seeks" : "seek"], ["draw", sg ? "draws" : "draw"], ["identify", sg ? "identifies" : "identify"], ["know", sg ? "knows" : "know"],
    ["have", sg ? "has" : "have"], ["follow", sg ? "follows" : "follow"], ["see", sg ? "sees" : "see"], ["study", sg ? "studies" : "study"],
    ["respect", sg ? "respects" : "respect"], ["demand", sg ? "demands" : "demand"], ["rely", sg ? "relies" : "rely"], ["focus", sg ? "focuses" : "focus"],
    ["practice", sg ? "practices" : "practice"], ["explore", sg ? "explores" : "explore"], ["question", sg ? "questions" : "question"],
    ["engage", sg ? "engages" : "engage"], ["promote", sg ? "promotes" : "promote"], ["prefer", sg ? "prefers" : "prefer"], ["lean", sg ? "leans" : "lean"],
    ["advocate", sg ? "advocates" : "advocate"], ["deny", sg ? "denies" : "deny"], ["claim", sg ? "claims" : "claim"], ["were", sg ? "was" : "were"],
    ["grew", "grew"], ["left", "left"], ["feel", sg ? "feels" : "feel"], ["once", "once"],
  ];
  for (const [v2, v3] of verbs) {
    s = s.replace(new RegExp(`\\bYou ${v2}\\b`, "g"), `${subj} ${v3}`);
  }
  s = s.replace(/\byour\b/g, poss).replace(/\bYour\b/g, possCap).replace(/\bYou\b/g, subj);
  return s;
}

interface OpponentProfileDialogProps {
  opponent: DefenseOpponent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOpponent: (opponent: DefenseOpponent) => void;
  onNavigateToAATS?: (avatarId: string) => void;
}

// Map opponent IDs to preparation strategies
const PREPARATION_STRATEGIES: Record<string, {
  dangerLevel: "moderate" | "high" | "extreme";
  commonEncounters: string[];
  jeevesApproach: string;
  weaponTips: string[];
  fallacies: string[];
  keyScriptures: string[];
}> = {
  "atheist": {
    dangerLevel: "high",
    commonEncounters: ["University campuses", "Online forums", "Workplace conversations"],
    jeevesApproach: "Jeeves will expose category errors in naturalism, reveal the limits of empiricism for metaphysical claims, and equip you with the cosmological and moral arguments. He'll show how the Problem of Evil actually presupposes God's existence.",
    weaponTips: [
      "Challenge the epistemological assumption that only empirical evidence counts as 'evidence'",
      "Use the moral argument — objective morality requires a transcendent standard",
      "Point out that science explains HOW, not WHY — they are different questions",
      "The fine-tuning argument is mathematically devastating when presented properly",
    ],
    fallacies: ["Scientism (treating science as the only path to truth)", "Category error (applying material tests to immaterial claims)", "Genetic fallacy (dismissing beliefs based on psychological origins)"],
    keyScriptures: ["Psalm 19:1", "Romans 1:20", "Hebrews 11:3", "Acts 17:24-28"],
  },
  "muslim": {
    dangerLevel: "high",
    commonEncounters: ["Interfaith events", "University Islamic societies", "Online debates"],
    jeevesApproach: "Jeeves will equip you to defend the Trinity from the Shema itself (echad = compound unity), expose the Quran's own textual variants, and demonstrate Christ's deity from passages Muslims accept. He'll dismantle the 'Paraclete = Muhammad' argument with Greek precision.",
    weaponTips: [
      "Know the difference between echad (compound unity) and yachid (absolute singularity) in Hebrew",
      "Point out Quranic textual variants (Sana'a manuscripts) to challenge 'perfect preservation'",
      "Use Isaiah 53 — a passage both traditions must reckon with",
      "The crucifixion is the most attested event in ancient history — even secular scholars affirm it",
    ],
    fallacies: ["Equivocation (redefining 'corruption' to mean any textual variant)", "Tu quoque (claiming Bible corruption while ignoring Quranic variants)", "Appeal to authority (citing scholars selectively)"],
    keyScriptures: ["Deuteronomy 6:4", "Isaiah 48:16", "John 1:1-14", "Philippians 2:5-11"],
  },
  "mormon": {
    dangerLevel: "moderate",
    commonEncounters: ["Doorstep visits", "Community events", "Online missionary outreach"],
    jeevesApproach: "Jeeves will help you distinguish between 'burning in the bosom' as subjective experience vs. objective truth criteria. He'll arm you with archaeological and historical evidence against Book of Mormon claims and expose the Great Apostasy as historically unsupported.",
    weaponTips: [
      "Challenge the epistemology: feelings confirm truth? Then every religion is 'true' by the same test",
      "No archaeological evidence supports Book of Mormon civilizations — unlike the Bible",
      "The 'Great Apostasy' contradicts Jesus' promise in Matthew 16:18",
      "Joseph Smith's changing accounts of the First Vision are historically documented",
    ],
    fallacies: ["Appeal to emotion (burning in bosom as truth test)", "Unfalsifiable claims (apostasy erased all evidence)", "Moving the goalposts (redefining what counts as 'evidence')"],
    keyScriptures: ["Matthew 16:18", "Galatians 1:8-9", "Revelation 22:18-19", "2 Timothy 3:16-17"],
  },
  "jw": {
    dangerLevel: "moderate",
    commonEncounters: ["Door-to-door visits", "Public witnessing carts", "Workplace conversations"],
    jeevesApproach: "Jeeves will expose the New World Translation's alterations (John 1:1, Colossians 1:15-17), demonstrate Christ's deity from their own pre-1950 publications, and dismantle the 144,000 doctrine using Revelation's own literary structure.",
    weaponTips: [
      "Know the Greek behind John 1:1 — the NWT's 'a god' is grammatically indefensible",
      "Colossians 1:16-17 says 'ALL things' — the NWT inserts 'other' without textual basis",
      "Ask: 'If Jesus is Michael, why does Hebrews 1:5 say God never called an angel His Son?'",
      "The 144,000 are explicitly from the 12 tribes of Israel (Rev 7:4-8) — are JWs from these tribes?",
    ],
    fallacies: ["Circular reasoning (using NWT to prove NWT is accurate)", "Special pleading (inserting 'other' in Col 1:16 but not elsewhere)", "False dichotomy (created or Creator, with no middle ground)"],
    keyScriptures: ["John 1:1", "Hebrews 1:5-8", "Colossians 1:15-17", "Revelation 7:4-8"],
  },
  "evangelical": {
    dangerLevel: "high",
    commonEncounters: ["Church-hopping visitors", "Family debates", "Social media", "Seminary discussions"],
    jeevesApproach: "Jeeves will sharpen your law-gospel balance, demonstrating that grace empowers obedience rather than abolishing it. He'll dismantle the 'nailed to the cross' argument from Colossians 2 with precision and show that 1844 is anchored in Daniel's text, not post-hoc invention.",
    weaponTips: [
      "Colossians 2:14 says the 'handwriting of ordinances' was nailed — not the Ten Commandments",
      "Romans 3:31: 'Do we make void the law through faith? God forbid: we ESTABLISH the law'",
      "Hebrews 4:9: 'There remaineth therefore a REST (sabbatismos) to the people of God'",
      "The Sabbath was established at Creation (Gen 2:2-3) — before any 'Jewish' covenant",
    ],
    fallacies: ["Equivocation (confusing ceremonial law with moral law)", "Straw man (caricaturing Sabbath-keeping as 'works salvation')", "Anachronism (reading post-Reformation categories into 1st-century texts)"],
    keyScriptures: ["Romans 3:31", "James 2:17-26", "Hebrews 4:9", "Matthew 5:17-19"],
  },
  "catholic": {
    dangerLevel: "high",
    commonEncounters: ["Historical debates", "Interfaith dialogues", "Family members", "Academic settings"],
    jeevesApproach: "Jeeves will equip you to engage patristic sources honestly while showing that apostolic succession is not what the Church Fathers actually taught. He'll demonstrate that tradition must be tested by Scripture (Isaiah 8:20) and expose where Catholic doctrine contradicts its own early sources.",
    weaponTips: [
      "Many Church Fathers actually disagreed with later Catholic dogmas — cite them accurately",
      "Peter himself rejected being venerated (Acts 10:25-26) — papal authority is a later development",
      "Transubstantiation uses Aristotelian categories foreign to Scripture",
      "The Bereans were praised for testing Paul's teaching by Scripture (Acts 17:11)",
    ],
    fallacies: ["Appeal to antiquity (age doesn't equal truth)", "Appeal to authority (councils don't override Scripture)", "Historical revisionism (reading later dogma back into early sources)"],
    keyScriptures: ["Isaiah 8:20", "Acts 17:11", "Acts 10:25-26", "1 Timothy 2:5"],
  },
  "bhi": {
    dangerLevel: "moderate",
    commonEncounters: ["Street preaching encounters", "Social media", "YouTube comment sections"],
    jeevesApproach: "Jeeves will help you navigate the identity question with grace while exposing the exegetical errors in the 'Israel only' salvation claim. He'll demonstrate from Scripture that Galatians 3:28-29 makes the ethnic boundary irrelevant in Christ.",
    weaponTips: [
      "Deuteronomy 28 curses apply to ancient Israel's covenant unfaithfulness — not ethnic identification",
      "Galatians 3:28-29: 'If ye be Christ's, then are ye Abraham's seed, and heirs according to the promise'",
      "Ruth the Moabitess, Rahab the Canaanite — non-Israelites in Jesus' own genealogy",
      "Revelation 7:9: 'a great multitude, of ALL nations' — not Israel only",
    ],
    fallacies: ["Eisegesis (reading modern categories into ancient texts)", "Hasty generalization (applying specific curses universally)", "Genetic fallacy (truth of message tied to ethnicity of messenger)"],
    keyScriptures: ["Galatians 3:28-29", "Romans 10:12-13", "Revelation 7:9", "Acts 10:34-35"],
  },
  "former-sda": {
    dangerLevel: "extreme",
    commonEncounters: ["Ex-SDA forums", "YouTube channels", "Family members who left", "Social media"],
    jeevesApproach: "Jeeves will help you engage the insider critique honestly — acknowledging legitimate concerns while defending the theological core. He'll distinguish between cultural SDA dysfunction and biblical truth, equipping you to answer from substance, not defensiveness.",
    weaponTips: [
      "Acknowledge legitimate pain without conceding theological truth",
      "Desmond Ford's critique was answered — know the response to the Glacier View arguments",
      "Walter Rea's 'The White Lie' was refuted by the Veltman study — know the details",
      "The Great Disappointment was real — but so was the disciples' disappointment at the cross. Neither disproves the message.",
    ],
    fallacies: ["Genetic fallacy (origin of belief doesn't determine its truth)", "Hasty generalization (bad church experiences ≠ bad theology)", "Poisoning the well (leading with 'cult' label before examining evidence)"],
    keyScriptures: ["Daniel 8:14", "Hebrews 8:1-2", "Revelation 14:6-12", "Acts 3:19-21"],
  },
  "offshoot-sda": {
    dangerLevel: "high",
    commonEncounters: ["YouTube conspiracy channels", "Telegram groups", "Camp meeting fringes"],
    jeevesApproach: "Jeeves will use Ellen White's OWN mature writings against the offshoot's selective quoting. He'll trace the Trinity understanding's DEVELOPMENT through SDA history, showing that doctrinal growth is biblical, not apostasy.",
    weaponTips: [
      "Early pioneers taught Christ was CREATED — even offshoot groups reject this, proving development is valid",
      "Ellen White post-1888: Christ is 'eternal, self-existent' (DA 530) — this is her MATURE view",
      "The 'three Arian horns' argument doesn't prove Arius was RIGHT — both sides held error",
      "Feast-day keeping was explicitly addressed by Ellen White as not binding on Christians",
    ],
    fallacies: ["Cherry-picking (using early quotes while ignoring mature theology)", "Conspiracy thinking (unfalsifiable infiltration claims)", "No true Scotsman (only 'real' SDAs agree with us)"],
    keyScriptures: ["John 1:1-3", "Hebrews 1:8", "Proverbs 4:18", "Colossians 2:16-17"],
  },
  "jewish": {
    dangerLevel: "extreme",
    commonEncounters: ["Interfaith academic dialogue", "Counter-missionary YouTube", "Seminary settings"],
    jeevesApproach: "Jeeves will help you engage the Hebrew text honestly — knowing where the LXX differs from the MT and why. He'll arm you with the strongest messianic prophecy arguments that even rabbinic sources struggle with (Daniel 9's timeline, Isaiah 53's details).",
    weaponTips: [
      "Isaiah 53: Even ancient rabbis (Targum Jonathan, Talmud Sanhedrin 98b) applied it to Messiah",
      "Daniel 9:24-27 gives a TIMELINE — the Messiah must come before the Temple's destruction in 70 AD",
      "Psalm 22: David never had his hands and feet pierced — this is prophetic, not autobiographical",
      "The Suffering Servant cannot be Israel — Israel is sinful; the servant is sinless (Isa 53:9)",
    ],
    fallacies: ["Context fallacy (claiming all of Isaiah's servant = Israel, ignoring shifts)", "Appeal to tradition (rabbinic consensus ≠ textual evidence)", "Anachronism (reading medieval commentary as original meaning)"],
    keyScriptures: ["Daniel 9:24-27", "Isaiah 53:1-12", "Psalm 22:1-18", "Micah 5:2"],
  },
  "preterist": {
    dangerLevel: "high",
    commonEncounters: ["Seminary debates", "Reformed theology circles", "Academic conferences"],
    jeevesApproach: "Jeeves will expose the preterist's selective reading of time texts while demonstrating that 'this generation' has multiple valid referents. He'll show how the year-day principle is established within Scripture itself, not imposed externally.",
    weaponTips: [
      "'This generation' (genea) can mean 'this kind/type of people' — not only chronological",
      "Matthew 24 blends near (70 AD) and far (Second Coming) fulfillment — standard prophetic layering",
      "Revelation 1:1 'shortly' (en tachei) means 'swiftly/suddenly' when it happens, not 'soon in time'",
      "The year-day principle is INTERNAL to Scripture: Numbers 14:34, Ezekiel 4:6",
    ],
    fallacies: ["Temporal fallacy (forcing all time texts into one narrow meaning)", "Reductionism (collapsing layered prophecy into single fulfillment)", "Begging the question (assuming audience-relevance hermeneutic)"],
    keyScriptures: ["Numbers 14:34", "Ezekiel 4:6", "Daniel 8:14", "2 Peter 3:8"],
  },
  "futurist": {
    dangerLevel: "high",
    commonEncounters: ["Evangelical churches", "Prophecy conferences", "Christian media", "Family discussions"],
    jeevesApproach: "Jeeves will dismantle the 'gap theory' in Daniel 9, demonstrate that the Papacy fits the little horn criteria perfectly, and show that dispensationalism was invented in the 1830s — not found in Scripture or church history before Darby.",
    weaponTips: [
      "Dispensationalism was invented by J.N. Darby in 1830s — it has NO historical precedent",
      "The 70th week of Daniel 9 was fulfilled by Christ (confirmed by the covenant, Dan 9:27)",
      "The 'gap' between week 69 and 70 has zero textual support — it's inserted, not exegeted",
      "Revelation's beast matches the Papacy historically — not a future individual",
    ],
    fallacies: ["Argument from silence (inserting a 2000-year gap with no textual warrant)", "Special pleading (literal when convenient, symbolic when not)", "Appeal to novelty (modern Israel as 'proof' of unfulfilled prophecy)"],
    keyScriptures: ["Daniel 9:24-27", "Daniel 7:25", "2 Thessalonians 2:3-4", "Revelation 13:1-10"],
  },
  "secular-scholar": {
    dangerLevel: "extreme",
    commonEncounters: ["University classrooms", "Academic publications", "Documentary films", "YouTube lectures"],
    jeevesApproach: "Jeeves will engage academic criticism on its own terms — using archaeology, manuscript evidence, and internal textual analysis to demonstrate Daniel's pre-Maccabean date, the reliability of biblical transmission, and the historical grounding of sanctuary theology.",
    weaponTips: [
      "Daniel's Aramaic is Imperial Aramaic, not late Aramaic — supporting earlier dating",
      "Dead Sea Scrolls include Daniel manuscripts, showing it was already canonical by Maccabean period",
      "The 'prophecy after the fact' theory fails to explain Daniel 11:40-45 — which preterists admit is unfulfilled",
      "Archaeological discoveries consistently confirm rather than contradict biblical historicity",
    ],
    fallacies: ["Genetic fallacy (dating a text late doesn't disprove its content)", "Argument from silence (absence of evidence ≠ evidence of absence)", "Naturalistic presupposition (excluding the supernatural a priori)"],
    keyScriptures: ["Daniel 2:44", "Isaiah 46:9-10", "2 Peter 1:19-21", "Luke 24:44"],
  },
  "progressive-christian": {
    dangerLevel: "high",
    commonEncounters: ["Progressive churches", "Social media", "Christian podcasts", "Youth groups", "Seminary"],
    jeevesApproach: "Jeeves will help you distinguish between genuine compassion and theological compromise. He'll show how Jesus' inclusivity was always paired with a call to repentance, and how the Three Angels' Messages are themselves an act of love — warning before judgment.",
    weaponTips: [
      "Jesus' table fellowship ALWAYS included a call to transformation — 'Go and sin no more' (John 8:11)",
      "Love without truth is sentimentality; truth without love is brutality — you need BOTH",
      "The Three Angels' Messages ARE the gospel — 'the everlasting gospel' (Rev 14:6)",
      "Universal reconciliation contradicts Jesus' own words about the narrow way (Matthew 7:13-14)",
    ],
    fallacies: ["False dichotomy (love OR doctrine, as if they're opposed)", "Trajectory hermeneutic (projecting cultural trends onto Scripture)", "Appeal to compassion (emotion overriding exegesis)"],
    keyScriptures: ["John 8:11", "Matthew 7:13-14", "Revelation 14:6-7", "2 Timothy 4:3-4"],
  },
  "skeptical-exsda": {
    dangerLevel: "extreme",
    commonEncounters: ["Online ex-SDA communities", "Family members", "Social media testimonials", "Podcasts"],
    jeevesApproach: "Jeeves will help you respond with genuine empathy — acknowledging real pain without surrendering truth. He'll distinguish between institutional failures and theological validity, and show how the Investigative Judgment is actually GOOD NEWS, not anxiety fuel.",
    weaponTips: [
      "Lead with empathy, not defense — 'I hear your pain, and some of it is legitimate'",
      "Distinguish cultural Adventism (legalism, perfectionism) from biblical Adventism (grace-empowered obedience)",
      "The Investigative Judgment is about God vindicating HIS character — not terrorizing believers",
      "Bad fruit in a community doesn't invalidate the tree — judging by fruit means examining DOCTRINE, not culture",
    ],
    fallacies: ["Anecdotal evidence (personal trauma ≠ theological refutation)", "Composition fallacy (some members are legalistic ≠ the theology is legalistic)", "Appeal to emotion (pain is real but doesn't determine truth)"],
    keyScriptures: ["Romans 8:1", "1 John 4:18", "Hebrews 4:16", "Psalm 103:8-14"],
  },
  "philosopher": {
    dangerLevel: "extreme",
    commonEncounters: ["University philosophy departments", "Academic debates", "Thoughtful skeptics"],
    jeevesApproach: "Jeeves will help you engage at the philosophical level — using Plantinga's reformed epistemology, the coherence of the Great Controversy theodicy, and the logical structure of the Investigative Judgment as divine vindication (answering the 'why review?' question).",
    weaponTips: [
      "The Investigative Judgment answers the philosopher: it's not God learning — it's God REVEALING to the universe",
      "The Great Controversy framework is actually the strongest theodicy available — God on trial, not humanity",
      "Omniscience and free will are compatible if God exists outside time (Boethius, eternal now)",
      "Divine hiddenness is answered by the Great Controversy — premature revelation would coerce, not invite",
    ],
    fallacies: ["False dilemma (either God knows OR we're free — ignores timeless knowledge)", "Straw man (investigative judgment as 'God learning' ignores the onlooking universe)", "Loaded question ('Why does God hide?' presupposes hiding rather than wooing)"],
    keyScriptures: ["Job 1:6-12", "Romans 3:4", "1 Corinthians 4:9", "Revelation 15:3-4"],
  },
  "new-age": {
    dangerLevel: "high",
    commonEncounters: ["Yoga studios", "Wellness culture", "Social media spirituality", "Bookstores", "Family"],
    jeevesApproach: "Jeeves will expose the deception behind NDEs and mediumship using the state-of-the-dead doctrine, show how 'all paths' universalism contradicts even basic logic (contradictory truth claims can't all be true), and reveal the Three Angels' warning against spiritualism.",
    weaponTips: [
      "NDEs are neurological phenomena — the dead 'know not anything' (Eccl 9:5)",
      "If all paths lead to God, and those paths contradict each other, then truth itself is meaningless",
      "Spiritualism/mediumship is explicitly condemned in Scripture (Deut 18:10-12, Isa 8:19-20)",
      "The Third Angel's Message directly addresses this deception — spiritualism is end-time strategy",
    ],
    fallacies: ["Appeal to experience (subjective NDEs as objective evidence)", "Contradiction tolerance (all paths true = no path meaningful)", "Equivocation (redefining 'God' to mean whatever feels right)"],
    keyScriptures: ["Ecclesiastes 9:5-6", "Deuteronomy 18:10-12", "Isaiah 8:19-20", "Revelation 16:13-14"],
  },
  "anti-prophet": {
    dangerLevel: "extreme",
    commonEncounters: ["Ex-SDA forums", "Counter-cult ministries", "YouTube documentaries", "Anti-EGW websites"],
    jeevesApproach: "Jeeves will equip you with the honest, documented responses to plagiarism charges (the Veltman study, 19th-century literary conventions), false prophecy claims (context and conditional prophecy), and help you present the fruits test comprehensively.",
    weaponTips: [
      "19th-century literary conventions allowed extensive unattributed use — Ellen White was not unique in this",
      "The Veltman study (commissioned by the church) found literary dependence but also massive original content",
      "Many 'false prophecy' claims strip quotes from context — always check the full passage",
      "Apply Deuteronomy 18:22 consistently: conditional prophecy (Jonah, Jeremiah) is biblical pattern",
    ],
    fallacies: ["Presentism (judging 19th-century literary practices by 21st-century standards)", "Cherry-picking (selecting problematic statements while ignoring the vast corpus)", "Guilt by association (any similarity = plagiarism, ignoring common sources)"],
    keyScriptures: ["Matthew 7:15-20", "1 Thessalonians 5:19-21", "Amos 3:7", "Joel 2:28-29"],
  },
  "internet-skeptic": {
    dangerLevel: "moderate",
    commonEncounters: ["TikTok comments", "Reddit threads", "Twitter/X debates", "Group chats", "YouTube comments"],
    jeevesApproach: "Jeeves will train you for SPEED — crafting concise, punchy responses that work in 280 characters or 60-second reels. He'll help you identify the rhetorical tricks (gotcha framing, false equivalence) and respond with clarity, not complexity.",
    weaponTips: [
      "Don't take the bait on 'gotcha' questions — reframe the question before answering",
      "Keep responses SHORT — the internet punishes long answers",
      "Use their own logic against them: 'If science explains everything, explain consciousness'",
      "Humor is a weapon — don't be afraid to be clever, not just correct",
    ],
    fallacies: ["Meme fallacy (a clever image doesn't constitute an argument)", "Dunning-Kruger (superficial knowledge presented as expertise)", "Red herring (jumping between objections without addressing any)"],
    keyScriptures: ["1 Peter 3:15", "Proverbs 26:4-5", "Colossians 4:6", "Titus 1:9"],
  },
  "goliath": {
    dangerLevel: "extreme",
    commonEncounters: ["This is the final exam — all worldviews at once"],
    jeevesApproach: "Jeeves will operate in full Master Mode — pre-briefing, live sidebar coaching, real-time tactical analysis, and post-battle debrief. He'll identify which worldview Goliath is wielding and equip you with the specific counter in real time.",
    weaponTips: [
      "Stay grounded in YOUR foundation — don't chase Goliath's shifting angles",
      "Identify which worldview he's using BEFORE responding — different angles need different weapons",
      "When he combines attacks, address the STRONGEST one first — the rest often collapse with it",
      "This is endurance training — don't try to 'win' every exchange. Stay standing.",
    ],
    fallacies: ["Multi-front assault (overwhelming with quantity, not quality)", "Shape-shifting (changing worldviews to avoid being pinned)", "Gish Gallop (too many arguments to address in limited time)"],
    keyScriptures: ["1 Samuel 17:45-47", "Ephesians 6:10-18", "2 Corinthians 10:4-5", "Isaiah 54:17"],
  },
};

export function OpponentProfileDialog({
  opponent,
  open,
  onOpenChange,
  onSelectOpponent,
  onNavigateToAATS,
}: OpponentProfileDialogProps) {
  const { getAvatarProgress, getPhaseProgress } = useAATSProgress();
  const [dialogTab, setDialogTab] = useState<"profile" | "training">("profile");

  if (!opponent) return null;

  const strategy = PREPARATION_STRATEGIES[opponent.id];
  const signatureTopics = DEFENSE_TOPICS.filter(t => opponent.signatureTopics.includes(t.id));
  const hasAATSTraining = AATS_AVATAR_IDS.includes(opponent.id as AATSAvatarId);
  const aatsProgress = hasAATSTraining ? getAvatarProgress(opponent.id) : 0;

  const dangerColors = {
    moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    extreme: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const dangerLabels = {
    moderate: "⚠️ Moderate Threat",
    high: "🔥 High Threat",
    extreme: "💀 Extreme Threat",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            {/* Header — Avatar + Name */}
            <div className="flex items-start gap-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative w-24 h-24 rounded-full overflow-hidden border-3 ${opponent.color} shadow-xl flex-shrink-0`}
              >
                <img src={opponent.avatar} alt={opponent.name} className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="text-left p-0">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <span>{opponent.emoji}</span> {opponent.name}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mt-1">{opponent.description}</p>
                {strategy && (
                  <Badge variant="outline" className={`mt-2 text-xs ${dangerColors[strategy.dangerLevel]}`}>
                    {dangerLabels[strategy.dangerLevel]}
                  </Badge>
                )}
              </div>
            </div>

            {/* Tabs: Profile | Training */}
            <Tabs value={dialogTab} onValueChange={(v) => setDialogTab(v as "profile" | "training")} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Profile
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> Training
                </TabsTrigger>
              </TabsList>

              {/* ─── Profile Tab ─── */}
              <TabsContent value="profile" className="space-y-6 mt-4">
                {/* Worldview Summary */}
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Worldview Profile
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {toThirdPerson(opponent.worldview, opponent.pronouns)}
                  </p>
                </section>

                {/* Attack Targets */}
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-destructive" /> Primary Attack Targets
                  </h3>
                  <div className="grid gap-1.5">
                    {opponent.attackTargets.map((target, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Target className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{target}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Where You'll Encounter Them */}
                {strategy && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-accent-foreground" /> Where You'll Encounter This
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {strategy.commonEncounters.map((enc, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {enc}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Common Fallacies to Expose */}
                {strategy && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" /> Fallacies Jeeves Will Help You Expose
                    </h3>
                    <div className="space-y-2">
                      {strategy.fallacies.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                          <Zap className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* How Jeeves Prepares You */}
                {strategy && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent-foreground" /> How Jeeves Prepares You
                    </h3>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/15">
                      <p className="text-sm leading-relaxed">{strategy.jeevesApproach}</p>
                    </div>
                  </section>
                )}

                {/* Weapon Sharpening Tips */}
                {strategy && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Swords className="h-4 w-4 text-accent-foreground" /> Weapon Sharpening Approaches
                    </h3>
                    <div className="space-y-2">
                      {strategy.weaponTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                          <Shield className="h-3.5 w-3.5 text-accent-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Key Scriptures */}
                {strategy && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" /> Key Scripture Arsenal
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {strategy.keyScriptures.map((ref, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                          📖 {ref}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Signature Topics */}
                {signatureTopics.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Flame className="h-4 w-4 text-destructive" /> Signature Attack Topics
                    </h3>
                    <div className="space-y-2">
                      {signatureTopics.map((topic) => (
                        <div key={topic.id} className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                          <p className="font-semibold text-sm">{topic.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              {/* ─── Training Tab ─── */}
              <TabsContent value="training" className="space-y-6 mt-4">
                {hasAATSTraining ? (() => {
                  const training = getAvatarTraining(opponent.id as AATSAvatarId);
                  return (
                    <>
                      {/* Overall Progress */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/15 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-xs text-muted-foreground">{aatsProgress}%</span>
                        </div>
                        <Progress value={aatsProgress} className="h-2" />
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                          {AATS_PHASES.map((phase) => {
                            const pp = getPhaseProgress(opponent.id, phase.number);
                            return (
                              <div key={phase.number} className="text-center">
                                <div className="text-[10px] text-muted-foreground mb-1 truncate">P{phase.number}</div>
                                <Progress value={pp} className="h-1.5" />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Phase breakdown */}
                      {training && AATS_PHASES.map((phase) => {
                        const pp = getPhaseProgress(opponent.id, phase.number);
                        return (
                          <div key={phase.number} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                Phase {phase.number}: {phase.title}
                              </h4>
                              <span className="text-xs text-muted-foreground">{pp}%</span>
                            </div>
                            <Progress value={pp} className="h-1.5" />
                          </div>
                        );
                      })}

                      <Separator />

                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => {
                          onOpenChange(false);
                          onNavigateToAATS?.(opponent.id);
                        }}
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Go to Full Training
                      </Button>
                    </>
                  );
                })() : (
                  <div className="text-center py-8 space-y-3">
                    <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Advanced training for this opponent is coming soon.
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      In the meantime, use the Forge to build weapons against this worldview.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => {
                  onSelectOpponent(opponent);
                  onOpenChange(false);
                }}
              >
                <Swords className="h-4 w-4 mr-2" />
                Enter Combat
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
