import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Target,
  Brain,
  RefreshCw,
  MessageSquare,
  Eye,
  Sparkles,
  Languages,
  Layers,
  Search,
  Lightbulb,
  MessageCircle,
  Link2,
  Type,
  PanelLeftClose,
  Highlighter,
  BookMarked,
} from "lucide-react";

interface StudyBibleFeature {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  verse: string;
  verseText: string;
  whatItIs: string;
  howToUse: string;
  exampleInAction: string;
  jeevesInsight: string;
  proTip: string;
}

const ALL_FEATURES: StudyBibleFeature[] = [
  {
    id: "bible-navigation",
    name: "Bible Navigation",
    category: "Navigation",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500/20 text-blue-600",
    verse: "John 3:16",
    verseText: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    whatItIs: "Jump to any book, chapter, and verse in seconds. Use the top navigation bar to select a book, then pick your chapter. Arrow buttons let you move forward and backward through chapters without losing your place.",
    howToUse: "Click the book name at the top to open the book selector. Choose your book, then tap the chapter number. Use the left/right arrows to move between chapters. You can also type a reference directly in the search bar.",
    exampleInAction: "Studying John 3:16 — tap 'John' from the book list, select chapter 3, and the verse appears with all study tools ready. Hit the right arrow to continue into John 4 when you're ready.",
    jeevesInsight: "I recommend reading in chapter-sized portions rather than isolated verses. The Bible was written in flowing narrative and argument — context is everything. Navigate by chapter, study by verse.",
    proTip: "Use the At-a-Glance sidebar to see all 66 books organized by testament. It's the fastest way to jump between distant books during cross-reference study.",
  },
  {
    id: "translation-selector",
    name: "Translation Selector",
    category: "Navigation",
    icon: <Languages className="h-5 w-5" />,
    color: "bg-teal-500/20 text-teal-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd; I shall not want.",
    whatItIs: "Switch between Bible translations instantly — KJV, NIV, ESV, NASB, and more. Each translation brings different word choices and nuances, helping you see the text from multiple angles without needing a shelf of Bibles.",
    howToUse: "Click the translation badge (e.g., 'KJV') near the top of the Bible view. A dropdown shows all available translations. Select one and the current chapter instantly reloads in that version.",
    exampleInAction: "Psalm 23:1 in KJV says 'I shall not want.' Switch to NIV and it reads 'I lack nothing.' Switch to ESV: 'I shall not want.' The NIV's modern phrasing clarifies what the KJV means — David lacks nothing because the Lord provides.",
    jeevesInsight: "Comparing translations is one of the most powerful study habits. When three translations agree on a word, you can trust the meaning. When they differ, that's where the gold is — dig into the original language.",
    proTip: "Try reading a passage in KJV for beauty, NIV for clarity, and NASB for literal accuracy. The differences between them often reveal layers of meaning a single translation can't capture.",
  },
  {
    id: "five-dimension-filter",
    name: "5-Dimension Filter",
    category: "Study Tools",
    icon: <Layers className="h-5 w-5" />,
    color: "bg-purple-500/20 text-purple-600",
    verse: "Genesis 22:8",
    verseText: "And Abraham said, My son, God will provide himself a lamb for a burnt offering.",
    whatItIs: "View any verse through five interpretive lenses: Literal (what happened), Christ (how it points to Jesus), Me (personal application), Church (corporate meaning), and Heaven (eternal significance). This is multi-dimensional Bible reading.",
    howToUse: "With a verse selected, look for the 5-Dimension filter buttons. Tap each lens to see the verse reinterpreted through that dimension. You can toggle multiple dimensions to see layered meaning side by side.",
    exampleInAction: "Genesis 22:8 — LITERAL: Abraham trusts God will provide an animal. CHRIST: God will provide Himself AS the lamb — Jesus on the cross. ME: God provides what I need in my impossible situations. CHURCH: The body of Christ shares in sacrificial provision. HEAVEN: The Lamb slain from the foundation of the world (Rev 13:8).",
    jeevesInsight: "The Christ dimension is the master key. Every Old Testament passage has a Christological layer — sometimes obvious, sometimes hidden. Abraham's words are prophetic: God didn't just provide A lamb, He provided HIMSELF as the Lamb.",
    proTip: "Start with the Literal dimension to ground yourself in what actually happened. Then move to Christ, then Me. This prevents eisegesis (reading your own meaning in) while still making the text personal.",
  },
  {
    id: "study-modes",
    name: "Study Modes",
    category: "Study Tools",
    icon: <BookMarked className="h-5 w-5" />,
    color: "bg-green-500/20 text-green-600",
    verse: "2 Timothy 2:15",
    verseText: "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.",
    whatItIs: "Four study modes tailored to your level and purpose: Beginner (simplified explanations), Advanced (deep exegesis), Apologetics (defend-the-faith focus), and Preacher Mentor (sermon preparation tools). Each mode adjusts the depth and type of content shown.",
    howToUse: "Select your study mode from the mode selector at the top of the Bible view. The entire interface adapts — Beginner mode shows simpler language and key takeaways, while Advanced mode surfaces original languages, textual variants, and scholarly commentary.",
    exampleInAction: "Reading 2 Timothy 2:15 — BEGINNER: 'Work hard to understand God's Word correctly.' ADVANCED: 'Orthotomeo (rightly dividing) literally means to cut straight, like a tentmaker cutting fabric along the pattern — Paul's own trade metaphor for handling Scripture with precision.'",
    jeevesInsight: "Don't stay in Beginner mode forever, but don't skip it either. Many advanced students miss simple truths because they jump to Greek parsing before grasping the plain meaning. Master the simple reading first.",
    proTip: "Use Preacher Mentor mode when preparing sermons or lessons. It highlights homiletical structure, suggests illustrations, and shows how passages connect to broader biblical theology — like having a seasoned pastor looking over your shoulder.",
  },
  {
    id: "principle-panel",
    name: "Principle Panel",
    category: "Study Tools",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-amber-500/20 text-amber-600",
    verse: "Romans 8:28",
    verseText: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    whatItIs: "Apply any of the 38+ Palace method principles directly to the verse you're reading. The Principle Panel shows how each room — Story, Imagination, Translation, Symbols, and more — illuminates the current passage.",
    howToUse: "Open the Principle Panel from the toolbar while viewing any verse. Browse or search for a principle, then tap it to see how that principle applies to your current passage. Jeeves generates a custom application on the fly.",
    exampleInAction: "Romans 8:28 through the Story Room: Picture a master weaver at a loom. From underneath, the threads look chaotic — loose ends, crossed colors, knots. But flip the tapestry over and a beautiful image appears. 'All things work together' is the view from above.",
    jeevesInsight: "The Principle Panel bridges the Palace tab and the Bible tab. It's where memory technique meets living Scripture. Try applying 2-3 different principles to the same verse — each one reveals a different facet, like turning a diamond.",
    proTip: "The Translation Room principle is especially powerful for abstract verses. 'All things work together for good' becomes concrete when you translate it into a visible image — that weaver's loom makes Romans 8:28 unforgettable.",
  },
  {
    id: "jeeves-ai",
    name: "Jeeves AI Assistant",
    category: "AI Features",
    icon: <MessageCircle className="h-5 w-5" />,
    color: "bg-indigo-500/20 text-indigo-600",
    verse: "Hebrews 4:12",
    verseText: "For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit.",
    whatItIs: "Ask Jeeves any question about any verse and get an intelligent, theologically grounded response. Jeeves draws on commentary, original languages, cross-references, and the Palace method to give you rich, layered answers.",
    howToUse: "Tap the Jeeves chat icon while viewing any passage. Type your question — anything from 'What does this verse mean?' to 'How does this connect to the covenant theme?' Jeeves responds with sourced, thoughtful analysis.",
    exampleInAction: "Ask Jeeves about Hebrews 4:12: 'What's the difference between soul and spirit?' Jeeves explains: 'The Greek words are psyche (soul — mind, will, emotions) and pneuma (spirit — the God-conscious part of you). The Word of God is precise enough to distinguish between what you THINK and what God's Spirit reveals.'",
    jeevesInsight: "I'm designed to point you deeper into Scripture, not replace your own study. Use me to unlock hard passages, explore cross-references you'd never find on your own, and get unstuck when a verse seems opaque. But always verify with the text itself.",
    proTip: "Try asking Jeeves comparative questions: 'How does this verse in Hebrews compare to the sword imagery in Ephesians 6:17?' Cross-reference questions are where Jeeves really shines, connecting dots across the entire Bible.",
  },
  {
    id: "commentary-panel",
    name: "Commentary Panel",
    category: "Deep Study",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-rose-500/20 text-rose-600",
    verse: "Ephesians 2:8-9",
    verseText: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.",
    whatItIs: "Access traditional commentary, historical context, and cultural background for any passage. The Commentary Panel surfaces insights from centuries of biblical scholarship, organized by verse so you can study at your own pace.",
    howToUse: "Open the Commentary Panel from the right sidebar or toolbar. Select your verse and browse available commentary. Toggle between different commentary perspectives — historical, cultural, theological — to build a complete picture.",
    exampleInAction: "Ephesians 2:8-9 commentary reveals: 'Grace' (charis) was a loaded term in Ephesus — the city's economy ran on patron-client relationships where 'grace' meant a powerful person's unearned favor. Paul is saying God is the ultimate Patron, and salvation is His gift — no strings, no repayment, no boasting.",
    jeevesInsight: "Historical context transforms abstract theology into concrete reality. When you learn that Ephesus was dominated by patronage culture, suddenly 'gift of God' isn't just doctrine — it's a socioeconomic revolution. God's grace breaks the favor-trading system.",
    proTip: "Read the cultural context BEFORE the theological commentary. Understanding what words meant to the original audience prevents importing modern assumptions into ancient texts.",
  },
  {
    id: "chain-references",
    name: "Chain References",
    category: "Deep Study",
    icon: <Link2 className="h-5 w-5" />,
    color: "bg-orange-500/20 text-orange-600",
    verse: "Isaiah 53:7",
    verseText: "He is brought as a lamb to the slaughter, and as a sheep before her shearers is dumb, so he openeth not his mouth.",
    whatItIs: "Follow cross-reference chains between related verses across the entire Bible. See how one verse connects to dozens of others, forming thematic threads that weave through Scripture — from Genesis to Revelation.",
    howToUse: "Click the chain-link icon on any verse to see its cross-references. Each reference is clickable, taking you to that verse with ITS cross-references visible. Follow the chain as deep as you want — it's like a web of interconnected truth.",
    exampleInAction: "Isaiah 53:7 'lamb to the slaughter' chains to: Genesis 22:8 (Abraham's lamb), Exodus 12:3 (Passover lamb), John 1:29 ('Behold the Lamb of God'), Acts 8:32 (Ethiopian eunuch reads this passage), 1 Peter 1:19 ('precious blood of Christ, as of a lamb'), Revelation 5:6 (Lamb standing as slain).",
    jeevesInsight: "Chain references reveal the Bible's internal architecture. The 'lamb' chain from Genesis to Revelation is one continuous story: God promises a lamb, provides a temporary lamb, sends THE Lamb, and enthrones the Lamb forever. No human author could plan this across 1,500 years.",
    proTip: "When you find a powerful chain, save it as a study note. These chains become the backbone of sermons, lessons, and personal devotions. The lamb chain alone could fuel a 6-week sermon series.",
  },
  {
    id: "strongs-greek-hebrew",
    name: "Strong's / Greek-Hebrew",
    category: "Deep Study",
    icon: <Type className="h-5 w-5" />,
    color: "bg-cyan-500/20 text-cyan-600",
    verse: "John 21:15-17",
    verseText: "Jesus saith to Simon Peter, Simon, son of Jonas, lovest thou me more than these?",
    whatItIs: "Access original language word studies with Strong's Concordance numbers. Tap any word to see its Greek or Hebrew root, definition, usage frequency, and every other place it appears in Scripture. No seminary degree required.",
    howToUse: "Enable Strong's mode from the toolbar. Words with available Greek/Hebrew data become tappable. Tap a word to see its Strong's number, original language form, transliteration, full definition, and a list of every occurrence in the Bible.",
    exampleInAction: "In John 21:15-17, Jesus asks Peter 'Do you love me?' three times — but the Greek reveals TWO different words: Jesus uses 'agapao' (unconditional love) twice, then switches to 'phileo' (friendship love). Peter only ever answers with 'phileo.' Jesus meets Peter where he is.",
    jeevesInsight: "The agapao/phileo distinction in John 21 is one of the most famous Greek insights in the Bible. But be careful — some scholars debate whether John uses these as true synonyms. Strong's gives you the data; wisdom requires discernment about how rigidly to press word distinctions.",
    proTip: "Look for words that appear infrequently — they're often more theologically loaded. A word used only 3 times in the New Testament carries more specific weight than one used 300 times. Rarity signals intentionality.",
  },
  {
    id: "research-mode",
    name: "Research Mode",
    category: "Deep Study",
    icon: <Search className="h-5 w-5" />,
    color: "bg-violet-500/20 text-violet-600",
    verse: "Romans 9:13",
    verseText: "As it is written, Jacob have I loved, but Esau have I hated.",
    whatItIs: "A multi-panel layout designed for serious study. Open your Bible text, commentary, cross-references, and original language tools all at once — side by side. It's your digital study desk with everything in view.",
    howToUse: "Activate Research Mode from the top toolbar. The screen splits into customizable panels. Drag panels to resize, click the + button to add new panels, and arrange your study workspace to match your research needs.",
    exampleInAction: "Studying Romans 9:13 — Panel 1 shows the verse in KJV. Panel 2 shows Malachi 1:2-3 (the source quote). Panel 3 shows the Hebrew word for 'hated' (sane — meaning 'loved less' in comparative context). Panel 4 shows commentary explaining covenant election. Four perspectives, one screen.",
    jeevesInsight: "Romans 9:13 is one of the most debated verses in Scripture. Research Mode lets you see the Old Testament source, original language, and theological commentary simultaneously — exactly what you need to form an informed view rather than a reactive one.",
    proTip: "Save your panel layouts for different study types. Create a 'sermon prep' layout, a 'devotional' layout, and a 'deep exegesis' layout. Switching between saved layouts is faster than rebuilding each time.",
  },
  {
    id: "at-a-glance-sidebar",
    name: "At-a-Glance Sidebar",
    category: "Navigation",
    icon: <PanelLeftClose className="h-5 w-5" />,
    color: "bg-emerald-500/20 text-emerald-600",
    verse: "Psalm 119:105",
    verseText: "Thy word is a lamp unto my feet, and a light unto my path.",
    whatItIs: "A collapsible sidebar showing all 66 books of the Bible organized by Old and New Testament. Expand any book to see its chapters at a glance. It's the fastest way to navigate the entire Bible without losing your current position.",
    howToUse: "Click the sidebar icon (or swipe from the left on mobile) to open the At-a-Glance panel. Books are grouped by testament. Tap a book name to expand its chapters, then tap a chapter number to jump there instantly.",
    exampleInAction: "You're studying Psalm 119:105 and want to check a cross-reference in Proverbs 6:23 ('the commandment is a lamp'). Open the sidebar, tap Proverbs, tap chapter 6 — you're there in two taps while Psalm 119 stays in your reading history.",
    jeevesInsight: "The sidebar is designed for the way experienced Bible students actually work — jumping between books constantly. A sermon on 'light' might touch Psalms, Proverbs, Isaiah, John, and Revelation in ten minutes. The sidebar makes that workflow frictionless.",
    proTip: "On desktop, keep the sidebar pinned open while studying. It provides a constant visual map of where you are in the Bible — surprisingly helpful for building your mental geography of Scripture.",
  },
  {
    id: "verse-tools",
    name: "Verse Tools",
    category: "Study Tools",
    icon: <Highlighter className="h-5 w-5" />,
    color: "bg-pink-500/20 text-pink-600",
    verse: "Philippians 4:13",
    verseText: "I can do all things through Christ which strengtheneth me.",
    whatItIs: "A suite of tools for interacting with individual verses: highlight in multiple colors, add personal notes, bookmark for quick access, attach images, copy formatted text, and share verses with others. Make the Bible truly yours.",
    howToUse: "Tap or long-press any verse to reveal the verse toolbar. From there, choose a highlight color, write a note, toggle the bookmark star, attach an image, or use the share button. All your annotations sync across devices.",
    exampleInAction: "Highlight Philippians 4:13 in yellow (key verses). Add a note: 'Context! Paul is talking about contentment in ALL circumstances — abundance AND need (v.12). This isn't a blank check for ambition; it's power for contentment.' Bookmark it for your 'Contentment' study collection.",
    jeevesInsight: "The most common misuse of Philippians 4:13 comes from ignoring context. Your note feature is perfect for recording context-aware interpretations. When you highlight a verse, always ask: what comes before and after? The surrounding verses are the guardrails.",
    proTip: "Use different highlight colors for different purposes: yellow for key verses, blue for promises, green for commands, pink for prophecy, orange for questions. Over time, you'll build a color-coded map of the entire Bible.",
  },
];

function shuffleAndPick(arr: StudyBibleFeature[], count: number): StudyBibleFeature[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const StudyBibleWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedFeatures = useMemo(
    () => shuffleAndPick(ALL_FEATURES, 7),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey]
  );

  const step = selectedFeatures[currentStep];

  const nextStep = () => {
    if (currentStep < selectedFeatures.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentStep(0);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <BookOpen className="h-3 w-3 mr-1" />
            Interactive Demo — 12 Study Bible Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How the Study Bible Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Explore 7 of 12 powerful features that make the Phototheology Study Bible more than just reading — it's deep, interactive study.
          </p>

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try 7 More Features
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {selectedFeatures.map((f, idx) => (
            <button
              key={`${f.id}-${refreshKey}`}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? "w-8 bg-primary"
                  : idx < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 sm:p-6 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${step.color} w-fit`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{step.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {step.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Feature {currentStep + 1} of 7</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-5">
                {/* The Feature */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/20 text-primary mt-0.5 flex-shrink-0">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-2">📖 The Feature</p>
                      <p className="text-foreground text-sm sm:text-base">{step.whatItIs}</p>
                    </div>
                  </div>
                </div>

                {/* Scripture Example */}
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">{step.verse}</p>
                  <p className="text-base sm:text-lg italic">&ldquo;{step.verseText}&rdquo;</p>
                </div>

                {/* How to Use It */}
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-accent/10 text-accent mt-0.5 flex-shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-accent mb-1">🎯 How to Use It</p>
                    <p className="text-muted-foreground text-sm sm:text-base">{step.howToUse}</p>
                  </div>
                </div>

                {/* Example in Action */}
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-yellow-500/10 text-yellow-600 mt-0.5 flex-shrink-0">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-yellow-600 mb-1">💡 Example in Action</p>
                    <p className="text-muted-foreground text-sm sm:text-base">{step.exampleInAction}</p>
                  </div>
                </div>

                {/* Jeeves Says */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">🎩 Jeeves Says...</p>
                      <p className="text-foreground text-sm sm:text-base italic">{step.jeevesInsight}</p>
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-primary mb-1">⚡ Pro Tip</p>
                    <p className="text-muted-foreground italic text-sm sm:text-base">{step.proTip}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentStep + 1} / {selectedFeatures.length}
                  </span>

                  <Button
                    onClick={nextStep}
                    disabled={currentStep === selectedFeatures.length - 1}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Final CTA if on last step */}
        {currentStep === selectedFeatures.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 space-y-4"
          >
            <p className="text-lg font-medium">
              Ready to study Scripture with tools this powerful?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try 7 More Features
              </Button>
              <Button size="lg" className="gradient-palace">
                Try the Study Bible
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
