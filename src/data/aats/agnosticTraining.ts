// ─── AATS: Agnostic Avatar Training Data ──────────────────────────────────────
// Comprehensive training curriculum for defending SDA faith against agnostic arguments.

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ─────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "unknowability-of-god",
    title: "Unknowability of God",
    description:
      "The claim that God's existence is inherently unknowable. Human cognitive faculties are too limited to access transcendent realities, so any definitive statement about God -- whether affirming or denying -- exceeds the boundaries of what we can legitimately know.",
  },
  {
    id: "insufficient-evidence",
    title: "Insufficient Evidence",
    description:
      "The position that the available evidence for God's existence is not compelling enough to warrant belief. Neither philosophical arguments, historical testimony, nor personal experience rises to the level of proof required for such an extraordinary claim.",
  },
  {
    id: "suspension-of-judgment",
    title: "Suspension of Judgment",
    description:
      "The epistemological stance that intellectual honesty requires withholding belief on questions where the evidence is ambiguous or inconclusive. On the God question, the rational response is neither belief nor disbelief but a perpetual openness that never commits.",
  },
  {
    id: "religious-diversity-problem",
    title: "Religious Diversity Problem",
    description:
      "The argument that the sheer number of conflicting religious traditions, each claiming exclusive truth, undermines confidence in any single tradition. If thousands of religions disagree about God's nature and will, none of them can be trusted to have gotten it right.",
  },
  {
    id: "pragmatic-unbelief",
    title: "Pragmatic Unbelief",
    description:
      "The practical position that even if God might exist, it makes no functional difference to daily life. One can live a moral, meaningful, and fulfilling life without settling the God question, so the issue is irrelevant rather than urgent.",
  },
  {
    id: "prophetic-evidence",
    title: "Prophetic Evidence for God",
    description:
      "Biblical prophecy — particularly in Daniel and Revelation — provides historically verifiable, mathematically precise, centuries-in-advance predictions that constitute uniquely testable evidence for divine inspiration. The agnostic who claims the evidence is insufficient has often never engaged the prophetic evidence at all.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "agnostic-steelman-limits-of-reason",
    title: "Human Reason Cannot Reach God",
    argument:
      "If God exists, He would be an infinite, transcendent being wholly beyond the categories of finite human thought. Our minds evolved to navigate the savanna, not to comprehend the Absolute. Just as a two-dimensional being could never fully grasp a three-dimensional object, our cognitive architecture is structurally incapable of apprehending a being that exists outside space, time, and matter. Every concept we apply to God -- personhood, goodness, power, knowledge -- is drawn from finite human experience and becomes meaningless when stretched to infinity. Honest intellectual humility requires admitting that the God question exceeds our cognitive pay grade.",
    hiddenAssumptions: [
      "Finite minds cannot receive revelation from an infinite God -- assumes God is passive and silent rather than actively communicating.",
      "All knowledge of God must originate in human reason -- ignores the possibility that God Himself bridges the epistemological gap through self-disclosure.",
      "Partial knowledge is equivalent to no knowledge -- because we cannot know God exhaustively, we cannot know Him truly at all.",
    ],
    sdaResponse:
      "SDAs agree that unaided human reason cannot fully comprehend an infinite God -- but that is precisely why God has revealed Himself. The Bible is not humanity's search for God but God's search for humanity. 'The heavens declare the glory of God' (Psalm 19:1) through general revelation in nature, while Scripture provides special revelation that accommodates divine truth to human understanding. Jesus Christ is the ultimate self-revelation of God: 'Anyone who has seen me has seen the Father' (John 14:9). We need not scale an infinite ladder of reason; God came down. The design argument -- the staggering fine-tuning of the universe, the information content in DNA, the irreducible complexity of biological systems -- makes the Creator's 'invisible qualities' clearly visible (Romans 1:20). Partial knowledge of God is still genuine knowledge, just as a child's knowledge of her father is real even though it is not exhaustive.",
  },
  {
    id: "agnostic-steelman-evidence-insufficient",
    title: "The Evidence Does Not Meet the Burden",
    argument:
      "Extraordinary claims require extraordinary evidence. The claim that an all-powerful, all-knowing, personal God created the universe, intervenes in history, hears prayers, and will judge all humanity is about as extraordinary as a claim can get. Yet the evidence offered -- ancient texts, subjective experiences, philosophical arguments with disputed premises, and ambiguous natural phenomena -- falls far short of what such a claim demands. If God wanted us to know He exists, He could write His name across the sky, heal every amputee simultaneously, or appear on live television. The fact that He does not, and that we are left debating His existence millennia after the question was first asked, is itself evidence that the evidence is insufficient.",
    hiddenAssumptions: [
      "The standard of 'extraordinary evidence' is itself undefined and can always be raised -- it is an unfalsifiable demand that no evidence could satisfy.",
      "God's primary goal is to produce intellectual certainty rather than to cultivate free, trusting relationship -- assumes God would optimize for proof over faith.",
      "Subjective experience, historical testimony, and philosophical reasoning are inherently inferior forms of evidence -- privileges empirical verification over other legitimate epistemic methods.",
    ],
    sdaResponse:
      "The demand for 'extraordinary evidence' is a moving goalpost: no matter what evidence is presented, the agnostic can always say it is not extraordinary enough. But the evidence is substantial. The moral argument demonstrates that objective moral duties require a moral Lawgiver -- without God, good and evil are mere preferences. Fulfilled biblical prophecy provides historically verifiable evidence: the succession of world empires in Daniel 2 and 7 was written centuries before Medo-Persia, Greece, and Rome rose and fell exactly as predicted. The testimony of personal transformation -- lives radically changed by encounter with the living Christ, addictions broken, families restored, purpose discovered -- constitutes experiential evidence that demands an explanation. Romans 1:20 declares that God has provided sufficient evidence through creation so that all people are 'without excuse.' God does not hide; He reveals Himself to those who genuinely seek (Jeremiah 29:13).",
  },
  {
    id: "agnostic-steelman-honest-doubt",
    title: "Intellectual Honesty Demands Suspended Judgment",
    argument:
      "Belief and disbelief are both premature. The intellectually honest position is to say 'I don't know' and leave it at that. Theists claim certainty they cannot justify; atheists claim certainty in the negative they cannot justify either. Both sides are guilty of epistemological overreach. The agnostic alone occupies the rational middle ground, proportioning belief to evidence and refusing to commit where the evidence is ambiguous. It takes more intellectual courage to say 'I don't know' than to retreat into the false comfort of either belief or disbelief.",
    hiddenAssumptions: [
      "The middle position is automatically the most rational -- assumes that truth always lies between extremes (the fallacy of moderation).",
      "Refusing to decide is itself not a decision -- but in practice, living without God is functionally identical to living as if God does not exist.",
      "All claims about God are equally uncertain -- treats well-supported theistic arguments and flimsy ones as interchangeable, refusing to weigh evidence differentially.",
    ],
    sdaResponse:
      "SDAs respect genuine intellectual humility, but perpetual suspension of judgment on the most important question in the universe is not neutral -- it is a choice with consequences. Jesus said, 'Whoever is not with me is against me' (Matthew 12:30). Not deciding IS deciding. The evidence for God's existence is not 50/50; it is substantial and cumulative. The design argument reveals a universe fine-tuned for life to an incomprehensible degree. The moral argument shows that objective moral values require a transcendent ground. Biblical prophecy provides testable, historically verified predictions. And the testimony of millions of transformed lives -- including former agnostics who found God when they genuinely sought Him -- constitutes powerful experiential evidence. Psalm 19:1 declares that 'the heavens declare the glory of God.' The evidence is not ambiguous; the question is whether one is willing to follow where it leads.",
  },
  {
    id: "agnostic-steelman-religious-diversity",
    title: "Religious Contradiction Undermines All Claims",
    argument:
      "There are approximately 4,200 religions in the world, each claiming to know the truth about God. Christians say God is a Trinity; Muslims say He is strictly one; Hindus say He is everything; Buddhists say the question is irrelevant; Jews reject Jesus as Messiah; Mormons add extra scriptures; Adventists insist on Saturday worship. They cannot all be right. The sheer diversity and mutual contradiction of religious claims strongly suggests that religion is a cultural product rather than a reflection of objective reality. If God were real and wanted to be known, would He really allow thousands of incompatible religions to flourish, each claiming exclusive access to truth?",
    hiddenAssumptions: [
      "Disagreement proves all parties wrong -- but disagreement about the shape of the earth does not prove the earth has no shape. One view can be correct even amid widespread disagreement.",
      "All religions are epistemically equal -- treats sophisticated theological traditions with extensive evidence as equivalent to folk religions with none.",
      "A God who values genuine freedom would override human autonomy to eliminate religious diversity -- assumes divine clarity requires eliminating human choice.",
    ],
    sdaResponse:
      "The existence of counterfeit currency does not disprove the existence of genuine currency -- it presupposes it. Religious diversity does not prove that no religion is true; it proves that the question matters enough for humanity to keep asking it. SDAs hold that God has given sufficient evidence of His existence and character through creation (Psalm 19:1), through conscience (Romans 2:14-15), through Scripture, through fulfilled prophecy, and supremely through Jesus Christ. The fact that many religions exist is exactly what the Bible predicts: 'For the time will come when people will not put up with sound doctrine' (2 Timothy 4:3). SDA eschatology in Daniel and Revelation traces the history of religious confusion and points to the final vindication of God's truth. The prophecy argument is uniquely powerful here: no other religious tradition offers the kind of historically verifiable, centuries-in-advance predictive prophecy found in Daniel 2, 7, 8, and Revelation. This is testable evidence that distinguishes biblical Christianity from all competitors.",
  },
  {
    id: "agnostic-steelman-practical-irrelevance",
    title: "The God Question Is Practically Irrelevant",
    argument:
      "Even if God exists, what difference does it make? I can live a moral life, love my family, contribute to society, find meaning in art and nature, and face death with dignity -- all without settling the God question. Millions of agnostics live fulfilling, ethical lives. The practical test of a belief system is whether it works, and secular humanism works just fine. Why should I upend my life for an unresolved metaphysical question when the answers do not change how I treat my neighbor or raise my children?",
    hiddenAssumptions: [
      "Morality can function long-term without a transcendent foundation -- borrows Christian moral capital (human dignity, equality, compassion) without acknowledging its theistic roots.",
      "The consequences of the God question are limited to this life -- ignores the possibility that eternity hangs in the balance.",
      "Meaning is self-generated and requires no external source -- assumes that subjective purpose is sufficient even if the universe is ultimately purposeless.",
    ],
    sdaResponse:
      "The claim that God is practically irrelevant assumes that this life is all there is -- but if there is a Creator who will judge the living and the dead, then the God question is the most practically urgent question imaginable. SDAs believe that we are living in the time of the end, that Christ's return is imminent, and that every human being will stand before God in judgment (Ecclesiastes 12:14; Revelation 14:7). The moral values the agnostic cherishes -- human dignity, equality, compassion, justice -- are borrowed capital from the Christian worldview. Without God, these values have no objective grounding; they are preferences masquerading as principles. The testimony of personal transformation proves that God is not practically irrelevant: countless lives have been rescued from addiction, despair, broken relationships, and purposelessness through encounter with Jesus Christ. The design argument shows that the universe itself is not neutral but points unmistakably to a purposeful Creator (Romans 1:20). The question is not whether you can live without answering it -- the question is whether you should.",
  },
  {
    id: "agnostic-steelman-prophecy-unconvincing",
    title: "Biblical Prophecy Is Not Convincing Evidence",
    argument:
      "Believers often point to biblical prophecy as unique evidence for God, but this argument collapses under scrutiny. Daniel was likely written after the events it describes (the Maccabean thesis places it in the 2nd century BC), making its 'predictions' history written as prophecy. The symbolic language of apocalyptic literature is inherently flexible — beasts, horns, and numbers can be mapped onto virtually any historical sequence by a sufficiently motivated interpreter. Every generation has applied Revelation to its own era and been wrong. Nostradamus, the Quran, and the Hindu Puranas also contain passages that followers claim as prophecy. Why should we privilege the Bible's claims over theirs? At best, biblical prophecy is an interesting feature of ancient literature; it is not the kind of rigorous, testable evidence that would justify believing in an omniscient deity.",
    hiddenAssumptions: [
      "The Maccabean dating is established fact — but it is a contested hypothesis driven partly by the antisupernatural presupposition that genuine prediction is impossible.",
      "All prophecy claims are epistemically equal — treats the Bible's detailed, historically specific, mathematically timed prophecies as equivalent to vague or post-hoc 'predictions' in other traditions.",
      "Symbolic language cannot be precise — ignores that Daniel explicitly names empires (Daniel 8:20-21) and provides exact timelines (70 weeks, 1,260 days, 2,300 days).",
      "Failed applications by interpreters invalidate the prophecy itself — confuses human misinterpretation with the reliability of the prophetic text.",
    ],
    sdaResponse:
      "Biblical prophecy is qualitatively different from anything in Nostradamus, the Quran, or any other text. Daniel 2 predicts the exact succession of four world empires and the permanent fragmentation of the fourth — a prediction now verified across 2,500 years. Daniel 8:20-21 names Medo-Persia and Greece by name before Greece was a world power. Daniel 9:24-27 provides a 490-year mathematical timeline that pinpoints the year of Christ's baptism (27 AD) and crucifixion (31 AD). Daniel 8:14's 2,300-day prophecy, starting from 457 BC, reaches to 1844 — the commencement of the pre-Advent judgment that Revelation 14:7 announces. The sixth trumpet of Revelation 9 predicted the fall of Ottoman independence to August 11, 1840 — a date published in advance by Josiah Litch and confirmed by documented history. These are not vague symbols susceptible to any reading. They are historically anchored, mathematically precise, and uniquely verifiable. The agnostic who says 'the evidence is insufficient' while ignoring the prophetic evidence has not yet engaged the strongest case. Isaiah 46:9-10: 'I am God, and there is none like me, declaring the end from the beginning.'",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "agnostic-mg-false-neutrality",
    name: "False Neutrality",
    description:
      "Presenting agnosticism as the only intellectually honest position while framing belief and disbelief as equally irrational extremes. This tactic gives the agnostic a permanent sense of moral and intellectual superiority without requiring them to defend any positive position. By claiming the middle ground, they avoid the burden of proof entirely while making both theists and atheists look unreasonable.",
    example:
      "\"I'm not closed-minded like believers or dogmatic like atheists. I just follow the evidence wherever it leads -- and so far it doesn't lead anywhere definitive.\" -- But the agnostic has decided in advance that no amount of evidence will be definitive, making their 'open-mindedness' a mask for permanent non-commitment.",
    detectionTip:
      "When someone claims neutrality on the God question, ask: 'What would it take to convince you? What evidence would you accept?' If they cannot name any specific evidence or if every answer is 'that wouldn't be enough,' they are not genuinely open-minded -- they are committed to permanent uncertainty. True open-mindedness means being willing to reach a conclusion when the evidence warrants it.",
  },
  {
    id: "agnostic-mg-perpetual-doubt",
    name: "Perpetual Doubt Machine",
    description:
      "Treating doubt as a virtue in itself rather than as a stage on the way to knowledge. The agnostic elevates permanent uncertainty to a moral ideal, suggesting that anyone who claims to know anything about God is arrogant, while the one who endlessly doubts is humble and brave. This turns skepticism from a useful tool into a philosophical prison.",
    example:
      "\"The wisest thing anyone can say about God is 'I don't know.' Certainty is the enemy of truth.\" -- But this is itself a certain claim about the relationship between certainty and truth. If certainty is always wrong, then the agnostic cannot be certain that certainty is wrong -- a self-refuting position.",
    detectionTip:
      "Watch for doubt being praised as inherently virtuous. Ask: 'Is doubt always better than conviction? Are you certain that uncertainty is the correct response? If so, you have the very certainty you condemn.' Doubt is valuable as a step toward truth, not as a permanent residence. At some point, intellectual courage means following the evidence to a conclusion.",
  },
  {
    id: "agnostic-mg-goalpost-moving",
    name: "Moving the Goalposts",
    description:
      "Continually raising the standard of evidence so that no amount of proof can ever be sufficient. When presented with philosophical arguments, the agnostic demands empirical evidence. When presented with empirical evidence, they demand repeatable laboratory proof. When presented with historical evidence, they demand contemporary eyewitness testimony. The target always moves just beyond reach, ensuring the agnostic never has to engage seriously with the cumulative case.",
    example:
      "\"The cosmological argument is interesting, but it's just philosophy. Show me something scientific.\" Then: \"Fine-tuning is suggestive, but it could be a multiverse. Show me a miracle.\" Then: \"Miracles can always be explained naturally. Show me God directly.\" -- Each response moves the standard upward, ensuring no evidence ever counts.",
    detectionTip:
      "Before presenting evidence, ask the agnostic: 'What specific evidence would you accept as sufficient to believe in God? Can you describe it concretely?' If they refuse to specify or if every specification leads to yet another demand, they are not genuinely seeking truth -- they are protecting their position from falsification. A truth-seeker defines their criteria before examining the evidence, not after.",
  },
  {
    id: "agnostic-mg-false-humility",
    name: "False Humility",
    description:
      "Using the language of intellectual humility to disguise what is actually intellectual apathy or cowardice. The agnostic presents their refusal to commit as a sign of deep thinking and epistemic virtue, when in reality it may be an avoidance of the personal, moral, and existential implications that would follow from acknowledging God's existence. Genuine humility would follow the evidence wherever it leads, even to uncomfortable conclusions.",
    example:
      "\"I'm just humble enough to admit I don't have all the answers. Unlike you, I don't pretend to know the unknowable.\" -- But humility before evidence means being willing to accept what the evidence shows, not perpetually declining to look at it. The truly humble person submits to truth rather than hovering above it.",
    detectionTip:
      "Distinguish between genuine humility and false humility by asking whether the person is willing to be changed by the evidence. A genuinely humble truth-seeker says: 'If the evidence points to God, I will follow it.' A falsely humble agnostic says: 'No one can really know, so I will stay where I am.' The first is open; the second is closed while appearing open.",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "agnostic-fallacy-argument-from-ignorance",
    name: "Argument from Ignorance",
    definition:
      "Claiming that because God's existence has not been conclusively proven or disproven, the rational position is to suspend judgment indefinitely. This treats the absence of absolute proof as evidence that the question is unanswerable, ignoring the substantial cumulative evidence that can ground rational belief without absolute certainty.",
    example:
      "\"No one has ever proven God exists, and no one has ever proven He doesn't. Therefore, the honest answer is 'we can't know.'\" -- But this standard would eliminate most of our knowledge. We cannot 'prove' the external world exists, that other minds are real, or that the past happened, yet we reasonably believe these things based on cumulative evidence.",
    counterMove:
      "Point out that very few things in life are known with absolute certainty. We make knowledge claims based on the best available evidence, not on proof beyond all conceivable doubt. The evidence for God's existence -- the cosmological argument, the design argument, the moral argument, fulfilled prophecy, personal transformation -- constitutes a strong cumulative case. As in a court of law, we assess the preponderance of evidence, not absolute certainty. Ask: 'Do you apply this standard of absolute proof to anything else you believe?'",
  },
  {
    id: "agnostic-fallacy-middle-ground",
    name: "Fallacy of the Middle Ground (Argument to Moderation)",
    definition:
      "Assuming that the truth must lie between two extreme positions simply because they are extreme. The agnostic treats 'God exists' and 'God does not exist' as equally extreme claims and concludes that the moderate middle position ('we can't know') must be correct. But truth is not determined by splitting the difference between competing claims; it is determined by evidence.",
    example:
      "\"Theists say God definitely exists, atheists say He definitely doesn't. The truth is probably somewhere in the middle.\" -- But if one side is correct, the middle is wrong. The truth about God's existence is not 'halfway between existing and not existing.' Either God exists or He does not; there is no middle ontological state.",
    counterMove:
      "Expose the fallacy directly: 'Truth is not found by averaging two positions. Either God exists or He does not -- there is no halfway point. The question is which position is better supported by the evidence.' Then present the cumulative case: the universe had a beginning (cosmological argument), is fine-tuned for life (design argument), contains objective moral laws (moral argument), and features historically verified prophecy (Daniel 2, 7). The evidence does not point to a 'middle' -- it points decisively to a Creator.",
  },
  {
    id: "agnostic-fallacy-equivocation-on-knowledge",
    name: "Equivocation on 'Knowledge'",
    definition:
      "Shifting between different meanings of 'knowledge' to make the God question seem unanswerable. The agnostic uses 'knowledge' to mean absolute, infallible certainty (which virtually nothing meets) when discussing God, but uses it in its ordinary sense (justified true belief, reasonable confidence) for everything else. This double standard makes God uniquely unknowable by definitional fiat.",
    example:
      "\"You can't KNOW God exists -- you can only believe it.\" -- But by this standard, you cannot 'know' that other minds exist, that the universe is older than five minutes, or that your senses are reliable. If knowledge requires infallible certainty, we know almost nothing. If it requires reasonable confidence based on evidence, we can know God exists.",
    counterMove:
      "Expose the equivocation: 'What do you mean by knowledge? If you mean absolute certainty, then we know almost nothing -- including the reliability of science. If you mean justified true belief based on evidence, then the evidence for God is at least as strong as the evidence for many things you claim to know.' Then present specific evidence: the design argument (Psalm 19:1; Romans 1:20), fulfilled prophecy in Daniel as historically verifiable data, the moral argument grounding objective values, and the testimony of transformed lives as experiential evidence. Knowledge of God is not inferior to other knowledge -- it is knowledge of a different kind of object.",
  },
  {
    id: "agnostic-fallacy-appeal-to-complexity",
    name: "Appeal to Complexity",
    definition:
      "Arguing that because the God question is complex and has been debated for millennia, it must be unanswerable. This treats the difficulty of a question as evidence that it has no answer, ignoring that many once-intractable questions (the nature of disease, the structure of the atom, the age of the universe) were eventually resolved through persistent inquiry and evidence.",
    example:
      "\"Philosophers have debated God's existence for 2,500 years and still haven't settled it. That tells you the question is probably unanswerable.\" -- But philosophers debated the nature of matter for millennia before atomic theory. The length of a debate says nothing about whether it has a correct answer.",
    counterMove:
      "Distinguish between 'unsettled' and 'unsettleable.' The God question has been debated not because the evidence is absent but because the stakes are high and the personal implications are profound. Many resist the conclusion not for intellectual reasons but for existential ones. Point out that the cumulative evidence has actually grown stronger over time: modern cosmology confirms the universe had a beginning, molecular biology reveals staggering information content in cells, and archaeological discoveries continue to corroborate biblical history. The question is not too complex to answer -- it is too important to ignore.",
  },
];

// ── Counter Strategies ───────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "unknowability-of-god",
    title: "Countering the Unknowability Claim with Divine Self-Revelation",
    sdaPosition:
      "SDAs affirm that God, though transcendent and infinite, has chosen to reveal Himself in ways accessible to finite human minds. He is not a distant, unknowable force but a personal God who actively bridges the epistemic gap. He reveals Himself through nature (general revelation), through Scripture (special revelation), through the prophetic gift, and supremely through the incarnation of Jesus Christ. The design argument -- the breathtaking fine-tuning of the cosmos, the information-rich structure of DNA, the intricate machinery of the cell -- constitutes evidence visible to any honest observer. 'The heavens declare the glory of God' (Psalm 19:1). God is not silent; the question is whether we are listening.",
    keyScriptures: [
      "Psalm 19:1 -- 'The heavens declare the glory of God; the skies proclaim the work of his hands.' Creation itself is a revelation of the Creator accessible to all people everywhere.",
      "Romans 1:20 -- 'For since the creation of the world God's invisible qualities -- his eternal power and divine nature -- have been clearly seen, being understood from what has been made, so that people are without excuse.' God has provided sufficient evidence through the design of nature.",
      "John 14:9 -- 'Anyone who has seen me has seen the Father.' Jesus is the ultimate self-revelation of the unknowable God in knowable human form.",
      "Hebrews 1:1-2 -- 'In the past God spoke to our ancestors through the prophets at many times and in various ways, but in these last days he has spoken to us by his Son.' God has progressively revealed Himself throughout history.",
    ],
    counterArguments: [
      "The claim that God is unknowable is self-defeating: to say 'God is unknowable' is to make a knowledge claim about God. How do you know that God is unknowable? You would have to know something about God -- namely, that He is the sort of being who cannot be known -- to make the claim. This is a performative contradiction.",
      "The design argument provides evidence accessible to reason alone: the fine-tuning of cosmological constants, the specified complexity in biological information, and the irreducible complexity of molecular machines all point to intelligent design. These are not appeals to faith but to publicly available evidence that even agnostics can evaluate.",
      "SDAs do not claim exhaustive knowledge of God but sufficient knowledge for relationship and salvation. A child does not need to know everything about her father to know him truly. Similarly, God has revealed enough of Himself for us to know His character, His will, and His plan for humanity -- even if His infinite nature transcends our full comprehension.",
      "The testimony of personal transformation constitutes experiential evidence: millions of people across every culture, century, and background testify to encountering the living God in ways that transformed their character, healed their wounds, and redirected their lives. This evidence cannot be dismissed as merely subjective when it is so widespread and so consistent.",
    ],
    closingStatement:
      "The agnostic says God cannot be known, but God says He can be found by those who seek Him with all their heart (Jeremiah 29:13). The heavens declare His glory, the moral law written on every heart testifies to His character, fulfilled prophecy demonstrates His sovereignty over history, and the lives of transformed believers demonstrate His present power. God is not hiding from the agnostic; He is waiting for the agnostic to stop hiding from Him.",
  },
  {
    subjectId: "insufficient-evidence",
    title: "Countering the Insufficient Evidence Claim with Cumulative Proof",
    sdaPosition:
      "SDAs hold that God has provided abundant, multi-layered evidence for His existence and character. The design argument reveals a universe fine-tuned to astonishing precision. The moral argument shows that objective moral duties require a personal moral Lawgiver. Fulfilled biblical prophecy -- particularly the detailed predictions in Daniel 2, 7, 8, and Revelation -- provides historically verifiable evidence unique to the Bible. The testimony of personal transformation demonstrates God's present, active power in human lives. The evidence is not insufficient; it is ignored, misunderstood, or subjected to an impossibly high standard designed to preclude any conclusion.",
    keyScriptures: [
      "Romans 1:20 -- 'Since the creation of the world God's invisible qualities -- his eternal power and divine nature -- have been clearly seen, being understood from what has been made, so that people are without excuse.' The evidence in nature is declared sufficient by God Himself.",
      "Psalm 19:1-4 -- 'The heavens declare the glory of God; the skies proclaim the work of his hands. Day after day they pour forth speech; night after night they reveal knowledge. They have no speech, they use no words; no sound is heard from them. Yet their voice goes out into all the earth.' The evidence is universal and continuous.",
      "Daniel 2:31-45 -- The prophecy of the great image foretelling the succession of Babylon, Medo-Persia, Greece, Rome, and the divided kingdoms of Europe -- written centuries before the events, historically verifiable, and uniquely precise.",
      "Jeremiah 29:13 -- 'You will seek me and find me when you seek me with all your heart.' God guarantees that genuine seeking leads to finding.",
    ],
    counterArguments: [
      "The demand for 'extraordinary evidence' is a rhetorical device, not an honest epistemological standard. No clear definition is ever given for how extraordinary the evidence must be, ensuring that any evidence can always be dismissed as insufficient. In practice, it means: 'No evidence will convince me.'",
      "The design argument is extraordinarily powerful: the cosmological constant is fine-tuned to 1 part in 10^120; the strong nuclear force varies by less than 0.5% from the value needed for stable atoms; the initial entropy of the universe was specified to 1 part in 10^(10^123). These numbers are not ambiguous -- they point unmistakably to intentional calibration by an intelligent Designer.",
      "Fulfilled prophecy is testable evidence. Daniel chapter 2, written in the 6th century BC, accurately predicted the succession of four world empires and the fragmented state of Europe. Daniel 8:14 and 9:24-27 predicted the timing of the Messiah's coming. These are not vague horoscope-style predictions but specific, historically verifiable forecasts.",
      "The testimony of personal transformation is evidence that atheism and agnosticism cannot explain. When hardened addicts are instantly freed, when bitter enemies are filled with inexplicable love, when broken families are miraculously restored -- all through encounter with Jesus Christ -- this constitutes powerful experiential evidence for the reality and present activity of God.",
    ],
    closingStatement:
      "The agnostic says the evidence is insufficient, but the universe screams design, the moral law demands a Lawgiver, biblical prophecy has been verified by history, and millions of transformed lives testify to a living God. The evidence is not insufficient; the standard being applied is impossibly and selectively high. God has provided more than enough evidence for those willing to follow it wherever it leads -- and He promises that those who seek Him with all their heart will find Him.",
  },
  {
    subjectId: "suspension-of-judgment",
    title: "Countering Suspension of Judgment with the Urgency of Decision",
    sdaPosition:
      "SDAs affirm that while intellectual humility is a virtue, perpetual suspension of judgment on the God question is neither intellectually neutral nor existentially safe. Not deciding is a decision -- to live as though God does not exist, with all the practical and eternal consequences that entails. The evidence for God's existence, when honestly examined, is sufficient to warrant commitment. The design argument, the moral argument, the evidence of fulfilled prophecy, and the testimony of personal transformation together form a cumulative case that demands a verdict, not perpetual postponement. Jesus Himself said, 'Whoever is not with me is against me' (Matthew 12:30). In the SDA understanding of the great controversy, neutrality is not an option.",
    keyScriptures: [
      "Matthew 12:30 -- 'Whoever is not with me is against me, and whoever does not gather with me scatters.' Jesus eliminates the possibility of neutrality.",
      "Joshua 24:15 -- 'Choose for yourselves this day whom you will serve.' God frames the issue as an urgent choice, not an endless deliberation.",
      "Revelation 3:15-16 -- 'I know your deeds, that you are neither cold nor hot. I wish you were either one or the other! So, because you are lukewarm -- neither hot nor cold -- I am about to spit you out of my mouth.' God specifically rejects the lukewarm middle position.",
      "Hebrews 3:15 -- 'Today, if you hear his voice, do not harden your hearts.' The call to decision is urgent and time-sensitive.",
    ],
    counterArguments: [
      "Suspension of judgment is not neutral -- it is a functional decision to live without God. The person who 'suspends judgment' about whether their house is on fire and stays in bed is not being cautious; they are being reckless. If the stakes are as high as Christianity claims (eternity), then perpetual non-commitment is the most dangerous position of all.",
      "The cumulative case for God's existence exceeds the threshold for reasonable belief. We do not require absolute proof for any other area of life -- we act on the best available evidence. The design argument, moral argument, prophetic evidence, and experiential evidence together form a case at least as strong as many things the agnostic accepts without question.",
      "The agnostic's demand for certainty before commitment is a standard they apply nowhere else. They marry without certainty that the marriage will last. They take medications without certainty about long-term effects. They trust scientific theories that may be revised. Why is the God question uniquely required to reach absolute certainty before a reasonable person can act?",
      "SDA eschatology adds urgency: the prophecies of Daniel and Revelation indicate that we are living in the last days of earth's history. The judgment-hour message of Revelation 14:7 calls for decision now: 'Fear God and give him glory, because the hour of his judgment has come.' Perpetual postponement is not a safe harbor; it is a refusal to heed the most important warning ever given.",
    ],
    closingStatement:
      "The agnostic believes they stand safely in the middle, but there is no middle ground on the most consequential question in the universe. Every day lived without God is a day lived as if God does not exist -- with all the practical, moral, and eternal consequences that follow. The evidence is sufficient. The call is urgent. The decision cannot be endlessly deferred. 'Today, if you hear his voice, do not harden your hearts.'",
  },
  {
    subjectId: "religious-diversity-problem",
    title: "Countering the Religious Diversity Problem with Prophetic Uniqueness",
    sdaPosition:
      "SDAs acknowledge the reality of religious diversity but argue that it undermines no religion in particular -- just as the existence of many conflicting scientific theories about dark matter does not prove dark matter is unknowable. One religion can be true even if others are false. The question is whether any tradition offers evidence strong enough to distinguish itself from the rest. SDAs believe biblical Christianity uniquely passes this test through fulfilled prophecy, the historical evidence for Christ's resurrection, the moral coherence of Scripture, and the experiential evidence of lives transformed by the Holy Spirit. The prophecies of Daniel and Revelation, in particular, provide a kind of evidence no other religion offers: detailed, historically verifiable predictions written centuries in advance.",
    keyScriptures: [
      "Isaiah 46:9-10 -- 'I am God, and there is no other; I am God, and there is none like me. I make known the end from the beginning, from ancient times, what is still to come.' Predictive prophecy is God's unique signature, distinguishing the Bible from all competitors.",
      "Psalm 19:1 -- 'The heavens declare the glory of God.' General revelation is available to all people in all religions, pointing toward the one true Creator.",
      "Acts 4:12 -- 'Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.' Christianity makes a unique claim supported by unique evidence.",
      "John 14:6 -- 'I am the way and the truth and the life. No one comes to the Father except through me.' Jesus claims uniqueness, and the evidence supports the claim.",
    ],
    counterArguments: [
      "The existence of many religions does not prove all are wrong any more than the existence of many answers to a math problem proves the problem has no correct answer. One answer can be right while the rest are wrong. The task is to evaluate each claim on its merits, not to dismiss all claims because many exist.",
      "Biblical prophecy uniquely distinguishes Christianity from all other religions. No other scripture offers the kind of detailed, centuries-in-advance, historically verifiable predictions found in Daniel 2 (succession of world empires), Daniel 8-9 (timing of the Messiah), and Revelation (the rise of papal Rome, the Protestant Reformation, the judgment). This prophetic track record is unmatched in any religious tradition.",
      "The moral argument transcends religious diversity: regardless of what various religions teach about rituals and doctrines, the existence of objective moral values points to a moral Lawgiver. The agnostic who says 'injustice is wrong' borrows from a theistic moral framework that religious diversity does not undermine.",
      "The testimony of personal transformation through Christ is cross-cultural and cross-historical: people from every nation, language, and background report life-changing encounters with the living Jesus. This consistent testimony across radically different cultural contexts argues against religion being merely a cultural product.",
    ],
    closingStatement:
      "Religious diversity is not evidence against God -- it is evidence that humanity is searching for God. The question is not whether many religions exist but whether any one of them offers evidence sufficient to warrant commitment. Biblical Christianity, and the SDA understanding of it in particular, offers what no other tradition can: detailed fulfilled prophecy spanning millennia, a historically grounded resurrection, a morally coherent worldview, and the transforming power of the living Christ. The multiplicity of maps does not mean the territory does not exist -- it means finding the right map matters enormously.",
  },
  {
    subjectId: "pragmatic-unbelief",
    title: "Countering Pragmatic Unbelief with Eternal Consequences",
    sdaPosition:
      "SDAs reject the claim that the God question is practically irrelevant. If the Bible is true, then every human being will face judgment (Ecclesiastes 12:14; Revelation 14:7), and eternal destiny depends on one's response to God's revelation. The moral values the agnostic prizes -- human dignity, compassion, justice, equality -- are borrowed capital from the Christian worldview and cannot be sustained without their theistic foundation. The testimony of personal transformation demonstrates that God makes a tangible, practical difference in human lives right now, not merely in some distant afterlife. The design argument shows that the universe was made with purpose and intention (Romans 1:20), which means human life has objective purpose and meaning -- not merely the subjective meaning we invent for ourselves.",
    keyScriptures: [
      "Ecclesiastes 12:13-14 -- 'Fear God and keep his commandments, for this is the duty of all mankind. For God will bring every deed into judgment, including every hidden thing, whether it is good or evil.' The God question has ultimate practical consequences.",
      "Romans 1:20 -- 'Since the creation of the world God's invisible qualities -- his eternal power and divine nature -- have been clearly seen, being understood from what has been made, so that people are without excuse.' The evidence from design means indifference is not innocent.",
      "Revelation 14:7 -- 'Fear God and give him glory, because the hour of his judgment has come. Worship him who made the heavens, the earth, the sea and the springs of water.' The judgment-hour message makes the God question urgently practical.",
      "Psalm 19:1 -- 'The heavens declare the glory of God; the skies proclaim the work of his hands.' The purpose visible in creation implies purpose for the creatures within it.",
    ],
    counterArguments: [
      "The claim that God is practically irrelevant depends entirely on the assumption that this life is all there is. But if there is a judgment, an afterlife, and an eternity, then the God question is the most practically consequential question a human being can face. Ignoring it does not make it go away; it simply means facing the consequences unprepared.",
      "The moral values the agnostic lives by -- human dignity, equality, compassion, justice -- have no foundation in a godless universe. If humans are merely rearranged stardust, there is no objective reason why they should be treated with dignity. The agnostic borrows Christian moral capital while denying the account from which it is drawn.",
      "The design argument demonstrates that the universe was created with purpose and intention: the fine-tuning of cosmological constants, the information content in DNA, and the emergence of consciousness all point to a purposeful Creator. If the universe has purpose, then human beings within it have purpose -- and that purpose cannot be discovered without knowing the One who assigned it.",
      "The testimony of personal transformation answers the pragmatic objection directly: God makes a tangible, measurable, practical difference in human lives. Addictions broken, marriages healed, purpose discovered, fear of death conquered, character transformed -- these are not abstract theological claims but concrete, observable realities experienced by millions. God is not practically irrelevant; He is the most practically relevant reality in existence.",
    ],
    closingStatement:
      "The agnostic says the God question does not matter practically, but that claim only works if there is no eternity, no judgment, no purpose, and no transcendent moral law. If any of these exist -- and the evidence from design, morality, prophecy, and personal transformation strongly suggests they do -- then ignoring the God question is not pragmatic wisdom but catastrophic negligence. The most practically relevant thing a human being can do is settle the question of their relationship with their Creator -- because eternity is a very long time to have been wrong.",
  },
  {
    subjectId: "prophetic-evidence",
    title: "Countering Prophecy Dismissal with the Bible's Unique Prophetic Track Record",
    sdaPosition:
      "Biblical prophecy offers what no philosophical argument or subjective testimony alone can: historically verifiable, mathematically precise, centuries-in-advance predictions. This is the evidence the agnostic claims does not exist. Daniel's prophecies name empires, describe their characteristics, predict their sequence, and provide exact timelines that can be checked against the historical record. The historicist method reads prophecy as a continuous timeline from the prophet's day to the end — and history has confirmed it for 2,500 years. The agnostic who demands testable evidence and then refuses to examine prophetic evidence is not following the evidence; they are avoiding it.",
    keyScriptures: [
      "Daniel 2:31-45 — The great image prophecy predicting Babylon, Medo-Persia, Greece, Rome, and fragmented Europe — verified by 2,500 years of history.",
      "Daniel 7:23-25 — The little horn persecutes the saints for 1,260 years (538 AD to 1798 AD) — historically verifiable.",
      "Daniel 8:14 — The 2,300-day prophecy reaching to 1844 AD — the inauguration of the pre-Advent judgment. Daniel gives the time; Revelation 14:7 gives the meaning.",
      "Daniel 9:24-27 — The 70-week (490-year) prophecy pinpointing Christ's baptism (27 AD) and crucifixion (31 AD) — mathematical precision centuries in advance.",
      "Revelation 9:13-21 — The sixth trumpet predicts the 391-year-and-15-day Ottoman period ending August 11, 1840 — predicted in advance by Josiah Litch and confirmed by history.",
      "Isaiah 46:9-10 — 'I am God, and there is none like me, declaring the end from the beginning.' God identifies predictive prophecy as His unique credential.",
    ],
    counterArguments: [
      "The Maccabean dating of Daniel is a hypothesis, not an established fact. It is driven in part by the antisupernatural assumption that genuine prediction is impossible — the very conclusion it claims to prove. Even on a late date, Daniel's prophecies about Rome, Europe's permanent fragmentation, and the mathematical timelines extend centuries beyond the 2nd century BC.",
      "Biblical prophecy is categorically different from Nostradamus, the Quran, or any other text. Daniel names empires explicitly (Daniel 8:20-21), provides mathematical timelines (70 weeks = 490 years), and describes historical details that can be independently verified. No other religious or secular text offers comparable predictive precision.",
      "The sixth trumpet prophecy (Revelation 9) is a publicly falsifiable test case. Josiah Litch published the predicted date of August 11, 1840, for the end of Ottoman independence before it happened. It happened. This is advance prediction confirmed by documented history — exactly the kind of evidence the agnostic claims is missing.",
      "The convergence of multiple independent prophetic timelines — 1,260 years, 2,300 days, 70 weeks, 391 years and 15 days — all reaching historically verified endpoints eliminates coincidence as an explanation. This is a pattern of prophetic accuracy that demands an explanation beyond human authorship.",
    ],
    closingStatement:
      "The agnostic says the evidence for God is insufficient, but biblical prophecy is the most underexamined evidence in the conversation. Daniel predicted the succession of world empires, the timing of Christ's coming, and the inauguration of the heavenly judgment — all with mathematical precision, centuries in advance. The sixth trumpet predicted the fall of Ottoman independence to the exact day. No naturalistic explanation accounts for this prophetic track record. The evidence the agnostic seeks already exists — it has simply never been engaged. 'I am God, and there is none like me, declaring the end from the beginning' (Isaiah 46:9-10).",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ────── Module 1: Unknowability of God ──────
  {
    id: "agnostic-mod-unknowability",
    subjectId: "unknowability-of-god",
    title: "Confronting the Unknowability Claim: Can We Know God?",
    doctrineBrief:
      "The agnostic claim that God is unknowable is perhaps the most philosophically sophisticated form of unbelief. Unlike the atheist who denies God's existence, the agnostic claims that the question itself exceeds human cognitive capacity. The word 'agnostic' comes from the Greek agnosis -- 'without knowledge.' The agnostic says: 'I do not know whether God exists, and neither do you. No one can know.'\n\nThis position has deep roots in philosophy. Immanuel Kant argued that human reason is limited to the phenomenal world (things as they appear to us) and cannot access the noumenal world (things as they are in themselves). Since God, if He exists, belongs to the noumenal realm, God is beyond the reach of human knowledge. Modern agnostics inherit this Kantian framework, often without knowing it.\n\nThe fatal flaw in this position is that it makes a knowledge claim about God in the very act of denying that knowledge claims about God are possible. To say 'God is unknowable' is to claim knowledge about God -- namely, that He is the sort of being who cannot be known. This is a performative self-contradiction.\n\nSDAs respond that God is indeed beyond the full comprehension of finite minds -- but He has not left us in the dark. He has actively and progressively revealed Himself through creation (Psalm 19:1), through the moral law written on every heart (Romans 2:14-15), through Scripture, through the prophetic gift, and ultimately through the incarnation of His Son, Jesus Christ (John 14:9). The God of the Bible is not a distant, unknowable Absolute; He is a personal Father who invites relationship and promises that those who seek Him will find Him (Jeremiah 29:13).",
    steelmanArguments: [
      steelmanArguments[0], // "Human Reason Cannot Reach God"
      steelmanArguments[1], // "The Evidence Does Not Meet the Burden"
    ],
    hiddenAssumptions: [
      "To say 'God is unknowable' is itself a knowledge claim about God -- a performative self-contradiction that undermines the position from within.",
      "Assumes God is passive and silent -- that He has not taken initiative to reveal Himself to finite creatures through general and special revelation.",
      "Confuses exhaustive knowledge with genuine knowledge -- because we cannot know everything about God, we supposedly cannot know anything about Him.",
      "Treats human reason as the only path to knowledge about God, ignoring the possibility that God Himself has bridged the gap through revelation, incarnation, and the work of the Holy Spirit.",
    ],
    mindGames: [
      mindGames[0], // False Neutrality
      mindGames[3], // False Humility
    ],
    fallacies: [
      fallacies[2], // Equivocation on Knowledge
      fallacies[3], // Appeal to Complexity
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "agnostic",
    debriefPrompt:
      "Reflect on your engagement with the unknowability claim. Were you able to identify the self-defeating nature of saying 'God is unknowable'? Did you effectively present the design argument from Psalm 19:1 and Romans 1:20 as evidence of God's self-revelation through creation? Could you articulate the SDA view that God has actively revealed Himself through Scripture, prophecy, and supremely through Jesus Christ? What areas require further study?",
  },
  // ────── Module 2: Insufficient Evidence ──────
  {
    id: "agnostic-mod-evidence",
    subjectId: "insufficient-evidence",
    title: "Confronting the Insufficient Evidence Claim: How Much Is Enough?",
    doctrineBrief:
      "The agnostic claim of insufficient evidence is one of the most common objections encountered in modern apologetics. It was famously expressed by Bertrand Russell, who, when asked what he would say if he met God after death, replied: 'I would say, not enough evidence, God, not enough evidence.'\n\nThis objection sounds reasonable on the surface. After all, who could fault someone for following the evidence? But beneath the surface lies a hidden double standard. The agnostic demands a level of evidence for God's existence that they require for virtually nothing else in their lives. They marry without certainty, invest without certainty, trust science without certainty -- but on the one question with the highest possible stakes, they insist on a standard of proof that would make even a mathematician blush.\n\nThe SDA response is that God has provided abundant, multi-layered, cumulative evidence for His existence and character. The design argument reveals a universe fine-tuned to an almost inconceivable degree: the cosmological constant alone is set to 1 part in 10^120. The moral argument shows that the objective moral values everyone recognizes (justice, compassion, human dignity) require a transcendent Lawgiver. Fulfilled prophecy in Daniel and Revelation provides historically verifiable, centuries-in-advance predictions that have been confirmed by the march of history. And the testimony of personal transformation -- lives radically changed through encounter with Jesus Christ -- constitutes powerful experiential evidence that demands explanation.\n\nRomans 1:20 declares that God has revealed enough through creation that all people are 'without excuse.' The issue is not insufficient evidence but an insufficiently willing heart.",
    steelmanArguments: [
      steelmanArguments[1], // "The Evidence Does Not Meet the Burden"
      steelmanArguments[4], // "The God Question Is Practically Irrelevant"
    ],
    hiddenAssumptions: [
      "The standard of 'sufficient evidence' is never defined, allowing it to be raised indefinitely -- a permanently unfalsifiable demand.",
      "Empirical evidence is the only legitimate form of evidence, ruling out philosophical arguments, historical testimony, and personal experience by definitional fiat.",
      "God's purpose is to produce intellectual certainty rather than to cultivate free relationship built on trust -- projects a scientific paradigm onto a personal relationship.",
      "The absence of coercive, undeniable evidence proves God's absence rather than God's respect for human freedom.",
    ],
    mindGames: [
      mindGames[2], // Moving the Goalposts
      mindGames[0], // False Neutrality
    ],
    fallacies: [
      fallacies[0], // Argument from Ignorance
      fallacies[2], // Equivocation on Knowledge
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "agnostic",
    debriefPrompt:
      "Evaluate your response to the insufficient evidence claim. Were you able to expose the moving-goalpost tactic? Could you present the design argument, moral argument, prophetic evidence, and personal transformation testimony as a cumulative case? Did you challenge the agnostic to define what specific evidence they would accept? Were you able to show from Romans 1:20 that God considers the evidence sufficient even if the agnostic does not? What would you strengthen next time?",
  },
  // ────── Module 3: Suspension of Judgment ──────
  {
    id: "agnostic-mod-suspension",
    subjectId: "suspension-of-judgment",
    title: "Confronting Suspension of Judgment: Is Neutrality Possible?",
    doctrineBrief:
      "The agnostic who suspends judgment on God's existence believes they have found the rational high ground. Neither committing to belief nor to unbelief, they see themselves as the only truly open-minded participants in the debate. But this appearance of neutrality is deceptive.\n\nIn practice, suspending judgment about God is functionally identical to living as though God does not exist. The person who 'hasn't decided' whether to board the lifeboat is, for all practical purposes, choosing to stay on the sinking ship. Every day lived without prayer, worship, obedience, and relationship with God is a day lived in practical atheism, regardless of the philosophical label.\n\nMoreover, perpetual suspension of judgment is not a genuinely open epistemic state. It presupposes that the evidence is and will always remain ambiguous -- a claim that itself requires justification. If the evidence actually points in one direction, then refusing to follow it is not open-mindedness but stubbornness.\n\nThe Bible never presents the God question as one that can be safely postponed. 'Today, if you hear his voice, do not harden your hearts' (Hebrews 3:15). 'Choose for yourselves this day whom you will serve' (Joshua 24:15). 'I know your deeds, that you are neither cold nor hot. I wish you were either one or the other!' (Revelation 3:15). The God of the Bible calls for decision, not deliberation without end.\n\nSDA eschatology adds a uniquely urgent dimension: the prophecies of Daniel and Revelation indicate that we are living in the final chapter of earth's history. The judgment-hour message of Revelation 14:6-7 calls all people to 'fear God and give him glory, because the hour of his judgment has come.' Suspension of judgment in the judgment hour is not wisdom -- it is the most perilous position imaginable.",
    steelmanArguments: [
      steelmanArguments[2], // "Intellectual Honesty Demands Suspended Judgment"
      steelmanArguments[0], // "Human Reason Cannot Reach God"
    ],
    hiddenAssumptions: [
      "Neutrality is a real option on the God question -- but in practice, not deciding is deciding to live without God, which carries the same consequences as active disbelief.",
      "The evidence will always remain ambiguous -- a presupposition the agnostic treats as established fact without arguing for it.",
      "The middle position is automatically the most rational -- the fallacy of moderation, assuming truth always lies between extremes.",
      "There is no urgency to the question -- but if SDA eschatology is correct and we live in the time of judgment, perpetual postponement is catastrophically dangerous.",
    ],
    mindGames: [
      mindGames[1], // Perpetual Doubt Machine
      mindGames[3], // False Humility
    ],
    fallacies: [
      fallacies[1], // Fallacy of the Middle Ground
      fallacies[0], // Argument from Ignorance
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "agnostic",
    debriefPrompt:
      "Assess your engagement with the suspension of judgment position. Were you able to show that not deciding is itself a decision with consequences? Could you present the urgency of the God question from both a philosophical and an eschatological perspective? Did you effectively use Matthew 12:30, Revelation 3:15-16, and Joshua 24:15 to demonstrate that God rejects the neutral position? Were you able to present the cumulative evidence as sufficient to warrant a verdict? What would you refine for next time?",
  },
  // ────── Module 4: Religious Diversity Problem ──────
  {
    id: "agnostic-mod-diversity",
    subjectId: "religious-diversity-problem",
    title: "Confronting the Religious Diversity Problem: Does Disagreement Disprove Truth?",
    doctrineBrief:
      "The religious diversity objection is one of the most emotionally compelling arguments in the agnostic arsenal. When confronted with the bewildering array of the world's religions -- each claiming truth, many claiming exclusive truth, all disagreeing with each other -- the agnostic concludes that none of them can be trusted. If so many people disagree about God, how can anyone claim to have the right answer?\n\nBut this argument contains a fatal logical flaw. Disagreement about a question does not prove the question has no answer. Scientists disagree about the nature of dark matter, the interpretation of quantum mechanics, and the cause of consciousness -- but no one concludes from this that physics and neuroscience are bunk. Doctors disagree about the best treatment for certain cancers, but no one concludes that medicine is futile. In every other domain of knowledge, we recognize that disagreement among experts means we need to evaluate the evidence more carefully, not give up entirely.\n\nThe same principle applies to religion. The existence of 4,200 religions does not prove that none of them is true. It proves that the question of God's existence and nature is profoundly important to human beings, that many have attempted to answer it, and that careful evaluation of the evidence is needed to determine which answer, if any, is correct.\n\nSDAs believe biblical Christianity uniquely passes this evidential test. No other religion offers the kind of detailed, historically verifiable, centuries-in-advance predictive prophecy found in Daniel and Revelation. The succession of world empires in Daniel 2 and 7, the timing of the Messiah in Daniel 9, and the panorama of church history in Revelation provide a prophetic track record unmatched by any other scripture on earth. This is the distinguishing evidence that separates biblical truth from religious confusion.",
    steelmanArguments: [
      steelmanArguments[3], // "Religious Contradiction Undermines All Claims"
      steelmanArguments[2], // "Intellectual Honesty Demands Suspended Judgment"
    ],
    hiddenAssumptions: [
      "Disagreement proves all parties wrong -- a conclusion that, if applied consistently, would eliminate most of human knowledge since experts disagree about nearly everything.",
      "All religions are epistemically equal -- treats ancient, evidence-rich traditions with extensive philosophical development as equivalent to modern cults or folk superstitions.",
      "If God existed and wanted to be known, there would be universal religious agreement -- ignores human free will, cultural influence, and the biblical teaching that sin distorts perception of divine truth.",
      "No criterion exists for evaluating competing religious claims -- ignores the criteria of internal coherence, historical evidence, predictive prophecy, and transformative power.",
    ],
    mindGames: [
      mindGames[0], // False Neutrality
      mindGames[2], // Moving the Goalposts
    ],
    fallacies: [
      fallacies[1], // Fallacy of the Middle Ground
      fallacies[3], // Appeal to Complexity
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "agnostic",
    debriefPrompt:
      "Review your response to the religious diversity problem. Were you able to show that disagreement does not disprove truth? Could you present fulfilled prophecy as the distinguishing evidence that sets biblical Christianity apart from all other religions? Did you effectively use the analogy of counterfeit currency (the existence of counterfeits presupposes a genuine)? Were you able to present the moral argument and personal transformation testimony as cross-cultural evidence that transcends religious diversity? What aspects would you develop further?",
  },
  // ────── Module 5: Pragmatic Unbelief ──────
  {
    id: "agnostic-mod-pragmatic",
    subjectId: "pragmatic-unbelief",
    title: "Confronting Pragmatic Unbelief: Does God Matter for Daily Life?",
    doctrineBrief:
      "Pragmatic unbelief is perhaps the most culturally prevalent form of agnosticism in the modern Western world. Many people do not actively reject God; they simply find the question irrelevant to their daily lives. They get up, go to work, raise their families, enjoy their hobbies, and manage their morality without any reference to a Higher Power. The God question is filed away as an interesting philosophical puzzle that has no bearing on practical life.\n\nThis position is seductive because it offers all the social benefits of religion (moral behavior, community, meaning) without any of the costs (Sabbath observance, dietary restrictions, doctrinal commitment, accountability to a transcendent authority). The pragmatic agnostic says: 'I'm a good person. I live a meaningful life. I don't need God for that.'\n\nBut this stance has deep philosophical and existential problems. First, the moral values the pragmatic agnostic relies on -- human dignity, equality, compassion, justice -- are not self-evident in a godless universe. They are the fruit of centuries of Christian moral teaching, now plucked from the tree and enjoyed while the tree itself is rejected. Without the theistic foundation that generated these values, they become mere preferences with no binding authority.\n\nSecond, pragmatic unbelief assumes this life is all there is. If there is a judgment, an eternity, and a God who holds us accountable, then ignoring the God question is not practical wisdom but cosmic recklessness. SDA eschatology emphasizes that we live in the time of judgment (Daniel 8:14; Revelation 14:7), making the God question not a distant philosophical abstraction but an immediate, urgent, practical reality.\n\nThird, the testimony of millions of transformed lives demonstrates that God is not practically irrelevant. He is the most practically relevant reality in existence -- the source of true peace, purpose, healing, and hope that no amount of secular striving can replicate. 'You will keep in perfect peace those whose minds are steadfast, because they trust in you' (Isaiah 26:3).",
    steelmanArguments: [
      steelmanArguments[4], // "The God Question Is Practically Irrelevant"
      steelmanArguments[1], // "The Evidence Does Not Meet the Burden"
    ],
    hiddenAssumptions: [
      "This life is all there is -- if eternity exists, pragmatic unbelief is the most impractical stance possible.",
      "Moral values can be sustained long-term without their theistic foundation -- historically, societies that abandon God eventually abandon the moral values He underwrites.",
      "Subjective meaning is sufficient even if the universe is objectively purposeless -- a meaning you invent for yourself dissolves the moment you admit it is invented.",
      "The practical benefits of secular life are comparable to what God offers -- ignores the unique peace, purpose, transformation, and hope that relationship with God provides.",
    ],
    mindGames: [
      mindGames[1], // Perpetual Doubt Machine
      mindGames[3], // False Humility
    ],
    fallacies: [
      fallacies[0], // Argument from Ignorance
      fallacies[1], // Fallacy of the Middle Ground
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "agnostic",
    debriefPrompt:
      "Evaluate your engagement with pragmatic unbelief. Were you able to show that the moral values the agnostic relies on are borrowed from a Christian worldview? Could you present the eternal consequences of ignoring the God question using SDA eschatology and the judgment-hour message? Did you effectively use the design argument from Romans 1:20 to show that indifference is not innocent? Were you able to present the testimony of personal transformation as proof that God makes a tangible, practical difference? What would you emphasize more strongly next time?",
  },
  // ────── Module 6: Prophetic Evidence ──────
  {
    id: "agnostic-mod-prophetic-evidence",
    subjectId: "prophetic-evidence",
    title: "Confronting Agnosticism with Fulfilled Prophecy: The Bible's Testable Evidence",
    doctrineBrief:
      "The agnostic says the evidence for God is insufficient. Fulfilled biblical prophecy is the direct answer to that claim — because prophecy is not subjective, not philosophical, and not a matter of personal interpretation. It is testable. It is historically verifiable. It is mathematically precise. And it is unique to the Bible.\n\nDaniel chapter 2, written in the 6th century BC, predicted the exact succession of four world empires — Babylon, Medo-Persia, Greece, and Rome — followed by a fragmented Europe that would never reunite. This prophecy has been verified by 2,500 years of unbroken history. Napoleon could not unite Europe. Hitler could not. The European Union cannot. The prophecy stands.\n\nDaniel 9:24-27 provides the seventy-week (490-year) prophecy beginning with the decree to restore Jerusalem in 457 BC (Ezra 7). This timeline pinpoints the baptism of Jesus Christ in 27 AD and His crucifixion in 31 AD — centuries in advance, with mathematical precision. This is not vague symbolism; it is a date-specific prediction confirmed by history.\n\nDaniel 8:14 extends the prophetic telescope further: the 2,300-day prophecy, sharing the same starting point of 457 BC, reaches to 1844 AD — the inauguration of the pre-Advent investigative judgment in the heavenly sanctuary. Revelation 14:7 announces: 'the hour of his judgment is come.' Daniel gives the time; Revelation gives the meaning.\n\nThe sixth trumpet of Revelation 9:13-21 predicted the 391-year-and-15-day career of Ottoman Turkish power, culminating on August 11, 1840. Josiah Litch published this prediction before the date arrived. When the Ottoman Empire surrendered its independent power on that exact date, it was a publicly falsifiable prophecy confirmed in real time.\n\nNo other religious or secular text on earth offers anything comparable. This is the evidence the agnostic claims to seek. It is specific, testable, historically verifiable, and mathematically precise. The agnostic who engages it must explain how ancient authors predicted specific empires, specific dates, and specific events centuries in advance — without recourse to divine inspiration.\n\n'I am God, and there is none like me, declaring the end from the beginning, and from ancient times the things that are not yet done' (Isaiah 46:9-10).",
    steelmanArguments: [
      steelmanArguments[5], // "Biblical Prophecy Is Not Convincing"
      steelmanArguments[1], // "The Evidence Does Not Meet the Burden"
    ],
    hiddenAssumptions: [
      "Predictive prophecy is impossible by definition — a presupposition that predetermines the conclusion before examining evidence.",
      "All prophecy claims are equally vague — ignores that Daniel names empires and provides exact mathematical timelines.",
      "The Maccabean dating eliminates the problem — but Daniel's predictions about Rome, European fragmentation, and the multi-century timelines extend far beyond the 2nd century BC.",
      "Failed interpretive applications disprove the prophecy itself — confuses interpreter error with textual reliability.",
    ],
    mindGames: [
      mindGames[2], // Moving the Goalposts
      mindGames[0], // False Neutrality
    ],
    fallacies: [
      fallacies[0], // Argument from Ignorance
      fallacies[3], // Appeal to Complexity
    ],
    counterStrategy: counterStrategies[5],
    debateSimLink: "agnostic",
    debriefPrompt:
      "This module addresses the agnostic's central claim head-on: that the evidence is insufficient. Evaluate your performance. Were you able to present Daniel 2 and 7 as historically verifiable predictions rather than retroactive readings? Could you walk through the 70-week and 2,300-day timelines mathematically? Did you use the sixth trumpet (Ottoman) prophecy as a falsifiable test case? Were you able to show that no other text — religious or secular — offers comparable predictive evidence? Could you articulate the connection between Daniel 8:14 and Revelation 14:7? What areas of prophetic apologetics do you need to strengthen?",
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const agnosticTraining: AATSAvatarTraining = {
  avatarId: "agnostic",
  avatarName: "The Agnostic",
  emoji: "\u2753", // ❓
  color: "border-gray-400",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
