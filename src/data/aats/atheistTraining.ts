// ─── AATS: Atheist Avatar Training Data ──────────────────────────────────────
// Comprehensive training curriculum for defending SDA faith against atheist arguments.

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
    id: "naturalism",
    title: "Naturalism",
    description:
      "Nature is all there is; no supernatural realm exists. Everything that happens can be explained by natural laws and processes without recourse to any transcendent cause or being.",
  },
  {
    id: "materialism",
    title: "Materialism",
    description:
      "Only physical matter is real; consciousness is brain chemistry. The mind, the soul, and all subjective experience are reducible to electrochemical processes in the brain.",
  },
  {
    id: "scientism",
    title: "Scientism",
    description:
      "Only science can give us truth about reality. Any claim that cannot be tested through the scientific method is meaningless or, at best, mere opinion.",
  },
  {
    id: "moral-relativism",
    title: "Moral Relativism",
    description:
      "Morality is subjective; no objective moral law exists. Ethical standards are culturally constructed preferences with no grounding beyond human consensus.",
  },
  {
    id: "problem-of-evil",
    title: "Problem of Evil",
    description:
      "A good God wouldn't allow suffering. The existence of gratuitous evil and innocent suffering is logically incompatible with an all-powerful, all-knowing, all-loving God.",
  },
  {
    id: "fulfilled-prophecy",
    title: "Fulfilled Prophecy as Evidence",
    description:
      "Biblical prophecy — particularly in Daniel and Revelation — provides historically verifiable, centuries-in-advance predictions that no human author could fabricate. The succession of world empires, the rise and fall of specific powers, and the precision of prophetic timelines constitute unique, testable evidence for divine inspiration that no other religious or secular text can match.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "atheist-steelman-god-myth",
    title: "God as Human Invention",
    argument:
      "God is a myth created by humans for comfort. Across every known civilization, humans have invented deities to explain what they could not understand and to soothe their fear of death. Psychological research shows that humans are pattern-seeking creatures prone to agency detection -- we project intentionality onto random events. The concept of God fits perfectly as a projection of our deepest anxieties and desires, shaped by cultural evolution rather than revelation.",
    hiddenAssumptions: [
      "Psychological origin disproves truth -- because we can explain WHY people believe, the belief must be false (the genetic fallacy).",
      "All religions share this origin -- treats vastly different theological traditions as interchangeable wish-fulfillment fantasies.",
      "Comfort-seeking invalidates beliefs -- assumes that if a belief brings comfort, it cannot also be true.",
    ],
    sdaResponse:
      "Explaining the psychology of belief does not address whether the object of belief is real. A child may believe in her mother because the belief brings comfort, but the mother still exists. SDAs recognize that God implanted eternity in the human heart (Ecclesiastes 3:11); the universal longing for transcendence is exactly what we would expect if a Creator designed us for relationship with Himself. Furthermore, biblical faith is not mere comfort -- it demands radical self-denial, Sabbath-keeping counter to culture, and readiness to suffer for truth (2 Timothy 3:12).",
  },
  {
    id: "atheist-steelman-science-disproved",
    title: "Science Has Disproved God",
    argument:
      "Science has disproved God. Every gap where God was once invoked -- lightning, disease, planetary motion, the origin of species -- has been filled by naturalistic explanations. The trajectory of science is consistently away from supernatural causation. Modern cosmology explains the universe's origin without a creator; neuroscience explains the mind without a soul; evolutionary biology explains life's diversity without design. The God hypothesis is simply no longer needed.",
    hiddenAssumptions: [
      "Science is the only way to know truth -- presupposes scientism, which is itself a philosophical (not scientific) claim.",
      "Absence of measurable evidence = absence -- conflates methodological naturalism (a tool) with metaphysical naturalism (a worldview).",
      "Science addresses metaphysical claims -- assumes that physical instruments can adjudicate non-physical realities.",
    ],
    sdaResponse:
      "Science is a powerful tool for studying the natural world, but it operates within methodological naturalism by design -- it brackets the supernatural, it does not disprove it. Claiming science disproves God is like claiming a metal detector disproves the existence of plastic. SDAs affirm both Scripture and genuine scientific inquiry (Psalm 19:1-2). The fine-tuning of cosmological constants, the information content in DNA, and the origin of consciousness all point beyond naturalism. Ellen White wrote: 'True science and Bible religion are in perfect harmony' (Counsels to Parents, Teachers, and Students, p. 426).",
  },
  {
    id: "atheist-steelman-evolution",
    title: "Evolution Explains Life Without God",
    argument:
      "Evolution explains life without God. Darwin showed that the appearance of design in biology is the product of natural selection acting on random variation over deep time. There is no need for a designer when blind, purposeless processes can produce the eye, the wing, and the brain. The fossil record, comparative genomics, and observed speciation events all confirm the standard evolutionary model, leaving no room for a Creator.",
    hiddenAssumptions: [
      "Mechanism disproves agency -- assumes that describing HOW something works eliminates the possibility of WHO initiated it.",
      "Origins = meaning -- assumes that if life arose through physical processes, it has no purpose or meaning beyond survival.",
      "Biological complexity requires no designer -- assumes that information-rich systems (like DNA) can arise without intelligent input.",
    ],
    sdaResponse:
      "SDAs hold to a recent six-day creation as taught in Genesis 1-2 and affirmed by the fourth commandment (Exodus 20:8-11), which anchors the Sabbath in a literal creation week. While microevolution (variation within kinds) is observable, the extrapolation to universal common descent faces significant challenges: the Cambrian explosion, the origin of genetic information, and irreducible complexity in molecular machines. Describing a mechanism does not eliminate the need for an Agent. A car engine operates by combustion, but that does not disprove the existence of an engineer. The SDA understanding of creation is foundational to the Sabbath, human dignity, marriage, and the plan of salvation.",
  },
  {
    id: "atheist-steelman-no-evidence",
    title: "No Evidence for God Exists",
    argument:
      "No evidence for God exists. If God were real, we should expect clear, unambiguous, empirically verifiable evidence -- a divine signature in the sky, a testable miracle on demand, or at minimum a consensus among scientists that supernatural causation is necessary. Instead, we find a universe that operates as if no God exists. Prayer studies show no effect. Miracles are never verified under controlled conditions. The burden of proof lies squarely on the one making the extraordinary claim.",
    hiddenAssumptions: [
      "Only empirical evidence counts -- rules out philosophical, historical, and experiential evidence by definitional fiat.",
      "Testimony and experience are invalid -- dismisses billions of human experiences of the divine as mass delusion.",
      "Logical arguments aren't evidence -- ignores that deductive reasoning (cosmological, teleological, moral arguments) constitutes legitimate evidence in philosophy and law.",
    ],
    sdaResponse:
      "The demand for empirical-only evidence presupposes materialism -- the very conclusion the atheist is trying to prove. Evidence comes in many forms: the cosmological argument (why is there something rather than nothing?), the teleological argument (fine-tuning of the universe), the moral argument (objective moral duties require a moral Lawgiver), historical evidence for the resurrection, and the testimony of transformed lives. SDAs point to fulfilled prophecy in Daniel and Revelation as uniquely verifiable evidence -- the succession of world empires in Daniel 2 and 7 was written centuries before the events unfolded. Romans 1:19-20 declares that God's 'invisible attributes are clearly seen, being understood by the things that are made.'",
  },
  {
    id: "atheist-steelman-religion-violence",
    title: "Religion Causes Violence and Harm",
    argument:
      "Religion causes violence and harm. The Crusades, the Inquisition, witch trials, honor killings, religiously motivated terrorism, clergy abuse scandals, and the suppression of scientific progress all testify to religion's toxic influence on human civilization. The world would be better off without religious belief, which divides people into in-groups and out-groups, sanctions violence against the 'other,' and replaces critical thinking with dogma.",
    hiddenAssumptions: [
      "Correlation = causation -- because violence happens alongside religion, religion must be the cause, ignoring power, politics, and human nature.",
      "Secular ideologies are violence-free -- overlooks the atrocities committed under atheistic regimes (Soviet Union, Maoist China, Khmer Rouge) which killed tens of millions.",
      "Institutional abuse = doctrinal truth -- confuses the failure of religious people with the failure of religious truth claims.",
    ],
    sdaResponse:
      "SDAs unequivocally condemn all violence done in the name of religion. Jesus taught love for enemies (Matthew 5:44) and declared His kingdom 'not of this world' (John 18:36). The atrocities cited are violations of, not expressions of, biblical Christianity. Meanwhile, the 20th century's greatest mass murders were perpetrated by explicitly atheistic regimes -- Stalin, Mao, and Pol Pot collectively killed over 100 million people. The issue is not religion vs. irreligion but fallen human nature. SDA eschatology specifically warns against religious coercion in the last days (Revelation 13), demonstrating that forced worship is antithetical to biblical faith. Religious liberty is a core SDA doctrine precisely because genuine faith can never be compelled.",
  },
  {
    id: "atheist-steelman-prophecy-fabricated",
    title: "Biblical Prophecy Is Vague, Retrodicted, or Fabricated",
    argument:
      "Believers point to Daniel and Revelation as proof of divine foresight, but the evidence falls apart under scrutiny. Daniel was almost certainly written in the 2nd century BC (Maccabean thesis), after the empires it 'predicts,' making its 'prophecies' history dressed as prediction — retrodiction. The symbolic language is so vague that any sequence of empires could be retrofitted into it. Revelation is apocalyptic literature full of bizarre imagery that has been applied to every century by every generation — failed predictions about every pope, Napoleon, Hitler, and now modern geopolitics. Nostradamus-level pattern matching does not constitute evidence. If biblical prophecy were genuinely predictive, there would be a consensus among historians, not just believers reading their own expectations into ancient texts.",
    hiddenAssumptions: [
      "The Maccabean dating of Daniel is an established fact — but it is a contested scholarly hypothesis driven in part by the antisupernatural bias that predictive prophecy is impossible, the very conclusion it claims to prove.",
      "Symbolic language equals vagueness — ignores that Daniel identifies empires by name (Medo-Persia, Greece in Daniel 8:20-21) and by unmistakable historical detail (four divisions of Greece in Daniel 8:22, the iron legs of Rome in Daniel 2).",
      "Failed applications disprove the prophecy itself — confuses the misapplication of prophecy by interpreters with the validity of the prophetic text.",
      "Scholarly consensus determines truth — but consensus has been wrong before, and the antisupernatural presupposition that drives much critical scholarship is itself a philosophical commitment, not a conclusion of evidence.",
    ],
    sdaResponse:
      "The Maccabean dating hypothesis is circular: it assumes predictive prophecy is impossible, then dates Daniel after the events to avoid admitting prophecy occurred. But even critical scholars acknowledge that Daniel accurately portrays details of Babylonian court life that a 2nd-century author would not know. More importantly, Daniel's prophecies extend far beyond the Maccabean period. Daniel 2 predicts not only Babylon, Medo-Persia, Greece, and Rome but the fragmented state of post-Roman Europe — a prediction that has held for 1,500 years and counting. Daniel 7 adds the little horn power rising among the divisions of Rome, persecuting the saints for 1,260 years (Daniel 7:25) — a timeline that maps precisely to the rise of papal dominance from 538 AD to 1798 AD. Daniel 8:14's 2,300-day prophecy (using the day-for-a-year principle confirmed by Numbers 14:34 and Ezekiel 4:6) reaches to 1844, inaugurating the pre-Advent judgment. Daniel 9:24-27 pinpoints the exact year of Christ's baptism (27 AD) and crucifixion (31 AD). These are not vague symbols susceptible to any interpretation — they are historically anchored, mathematically precise, and uniquely verifiable. No other religious text on earth offers anything comparable. The prophecy of Revelation 9:13-21 (the sixth trumpet) predicted the 391-year-and-15-day career of Ottoman power, culminating on August 11, 1840 — a date published in advance by Josiah Litch and confirmed by history. This is testable, falsifiable evidence for divine foreknowledge. The atheist who dismisses it has not engaged it.",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "atheist-mg-burden-shifting",
    name: "Burden Shifting",
    description:
      "Demanding you prove God exists while refusing to prove He doesn't. The atheist frames the debate so that all evidential responsibility falls on the believer, while treating atheism as a zero-cost default position that requires no justification of its own sweeping metaphysical commitments.",
    example:
      "\"I don't have to prove God doesn't exist. You're the one making the claim. I just lack belief.\" -- But the atheist is also making a claim: that the universe, consciousness, morality, and fine-tuning all exist without any transcendent cause.",
    detectionTip:
      "When someone insists they 'merely lack belief,' ask what positive worldview they hold and whether they can justify it. Everyone carries a burden of proof for their own worldview commitments. The atheist who says 'there is no God' carries an equal burden; the one who says 'I lack belief' still must account for reality without God.",
  },
  {
    id: "atheist-mg-mockery",
    name: "Mockery",
    description:
      "Using ridicule to make faith seem foolish rather than engaging arguments. This tactic substitutes emotional manipulation for rational discourse, aiming to make the believer feel socially embarrassed rather than intellectually challenged.",
    example:
      "\"You believe in a magic sky daddy? That's like believing in Santa Claus or the Tooth Fairy.\" -- This comparison trivializes millennia of philosophical theology, historical evidence, and lived experience into a childish caricature.",
    detectionTip:
      "Mockery is not an argument; it is a social pressure technique. When you feel the sting of ridicule, recognize that your opponent has abandoned reason in favor of rhetoric. Calmly name the tactic: 'I notice you're using ridicule rather than engaging the argument. Can we return to the evidence?' Proverbs 26:4 counsels not to answer a fool according to his folly.",
  },
  {
    id: "atheist-mg-intellectual-intimidation",
    name: "Intellectual Intimidation",
    description:
      "Implying you must be uneducated to believe in God. This tactic leverages social prestige and appeals to the authority of 'smart people' to pressure the believer into abandoning faith, suggesting that intelligence and faith are incompatible.",
    example:
      "\"Most top scientists are atheists. You'd know better if you had studied more science.\" -- This ignores that many pioneering scientists were devout believers (Newton, Faraday, Pasteur, Carver) and that intelligence does not guarantee correct metaphysical conclusions.",
    detectionTip:
      "Watch for appeals to authority ('scientists say'), credentialist snobbery ('if you'd studied...'), and the implication that faith is for the uninformed. Respond by noting that belief in God has been held by some of the most brilliant minds in history, and that the question of God's existence is philosophical, not a matter of IQ. As Paul wrote, 'the wisdom of this world is foolishness with God' (1 Corinthians 3:19).",
  },
  {
    id: "atheist-mg-false-superiority",
    name: "False Superiority",
    description:
      "Positioning atheism as the 'default' rational position. This game frames the discussion so that atheism is treated as neutral and rational by definition, while theism is a deviation that requires special justification -- despite atheism itself being a metaphysical position with significant philosophical liabilities.",
    example:
      "\"We're all born atheists. Religion is something that has to be imposed on you.\" -- This confuses absence of articulated belief in infants with a reasoned philosophical position, and ignores research showing children are naturally inclined toward teleological thinking.",
    detectionTip:
      "Challenge the claim that atheism is 'default.' Studies in cognitive science of religion show that children naturally infer purpose and design in nature. The historical default of virtually every human civilization has been theism, not atheism. Ask: 'If atheism is the rational default, why has it been a tiny minority position for nearly all of human history?'",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "atheist-fallacy-strawman",
    name: "Strawman",
    definition:
      "Attacking a simplistic caricature of Christianity rather than its best arguments. The atheist constructs a weak, distorted version of Christian theology and then refutes the distortion rather than engaging the real thing.",
    example:
      "\"Christians believe a bearded man in the sky magically snapped everything into existence.\" -- This ignores the sophisticated theology of divine aseity, the cosmological argument, and the careful biblical account of creation.",
    counterMove:
      "Correct the caricature before responding. Say: 'That's not what I believe. Let me state my actual position, and then you can respond to that.' Then present the strongest version of the SDA position -- God as the self-existent, eternal Creator who spoke the physical universe into existence by His word (Hebrews 11:3), whose nature transcends the material categories of beards and skies.",
  },
  {
    id: "atheist-fallacy-false-dilemma",
    name: "False Dilemma",
    definition:
      "Either you accept science OR you believe in God -- no middle ground. This fallacy forces an artificial choice between scientific inquiry and religious faith, ignoring the vast history of scientist-believers and the logical compatibility of both.",
    example:
      "\"You can either trust the scientific method or trust ancient mythology. You can't have both.\" -- This ignores that the scientific method itself was pioneered largely by theists who believed in an orderly, intelligible universe created by a rational God.",
    counterMove:
      "Reject the false binary. SDAs embrace genuine science while recognizing its methodological limits. Point out that many fathers of modern science (Newton, Kepler, Boyle, Faraday, Pasteur) were devout believers. Science investigates HOW the natural world works; theology addresses WHO made it and WHY. These are complementary, not competing, domains. As Psalm 111:2 says, 'Great are the works of the Lord, studied by all who delight in them.'",
  },
  {
    id: "atheist-fallacy-category-error",
    name: "Category Error",
    definition:
      "Demanding physical evidence for a metaphysical being. This fallacy confuses categories by insisting that a non-physical, transcendent God must be detectable by physical instruments -- like demanding to weigh the color blue or taste the number seven.",
    example:
      "\"Show me God under a microscope or in a telescope, and I'll believe.\" -- This assumes God is a physical object within the universe rather than the transcendent Creator of the universe.",
    counterMove:
      "Identify the category confusion. God is not an object within the universe but the ground of the universe's existence. You don't find an author by examining the pages of the book; you find evidence of the author IN the book. Similarly, we find evidence of God in creation (Romans 1:20), in conscience (Romans 2:15), in history (Daniel 2), and in the person of Jesus Christ (John 1:14, Colossians 1:15-17). The demand for physical evidence of a non-physical being is itself incoherent.",
  },
  {
    id: "atheist-fallacy-genetic",
    name: "Genetic Fallacy",
    definition:
      "Dismissing belief based on its psychological origins rather than its truth claims. The atheist argues that because we can explain WHY people believe in God (fear, wish-fulfillment, social conditioning), the belief must therefore be false.",
    example:
      "\"You only believe in God because you were raised in a religious household. If you'd been born in Saudi Arabia, you'd be Muslim.\" -- This observation about cultural conditioning applies equally to atheism and does not address whether God actually exists.",
    counterMove:
      "Name the fallacy directly: 'You're committing the genetic fallacy -- explaining the origin of a belief is not the same as refuting its truth.' Then turn the argument around: 'If you'd been born in Soviet Russia, you'd likely be an atheist. Does that mean atheism is false?' The origin of a belief tells us nothing about its truth value. A person raised in a family of mathematicians who believes 2+2=4 is not wrong just because they were culturally conditioned to believe it.",
  },
];

// ── Counter Strategies ───────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "naturalism",
    title: "Countering Naturalism with the God of Creation",
    sdaPosition:
      "SDAs affirm that God is the transcendent Creator of all that exists (Genesis 1:1; John 1:1-3; Colossians 1:16-17). Nature is not self-existent; it is a contingent creation that points beyond itself to its Maker. The Sabbath (the seventh day, Saturday) is the divinely appointed memorial of creation, a weekly testimony that the natural world has a supernatural origin. Naturalism cannot account for the origin of the universe from nothing, the fine-tuning of physical constants, the origin of biological information, or the existence of consciousness. The SDA worldview provides a coherent framework in which science, reason, and revelation harmonize under the authority of a Creator God.",
    keyScriptures: [
      "Genesis 1:1 -- 'In the beginning God created the heavens and the earth.' The universe has a personal, intentional origin.",
      "Psalm 19:1-4 -- 'The heavens declare the glory of God; the skies proclaim the work of his hands.' Nature itself testifies to a Creator.",
      "Romans 1:19-20 -- 'Since the creation of the world God's invisible qualities -- his eternal power and divine nature -- have been clearly seen.' God has not left Himself without witness.",
      "Hebrews 11:3 -- 'By faith we understand that the universe was formed at God's command, so that what is seen was not made out of what was visible.' Creation ex nihilo points to transcendence.",
    ],
    counterArguments: [
      "Naturalism is self-defeating: if all that exists is matter in motion, then human reason itself is just chemical reactions -- and chemical reactions are neither true nor false. Naturalism undercuts the very rationality it depends on to make its case.",
      "The universe had a beginning (Big Bang cosmology, the Borde-Guth-Vilenkin theorem), which demands a cause beyond nature. Something cannot come from nothing without a transcendent cause.",
      "The fine-tuning of the universe's physical constants (gravitational force, strong nuclear force, cosmological constant) within unimaginably narrow ranges for life points powerfully to intelligent design, not blind chance.",
      "The Sabbath commandment (Exodus 20:8-11) explicitly grounds the weekly cycle in a literal creation week, making the creation doctrine central to SDA worship and identity.",
    ],
    closingStatement:
      "Naturalism asks you to believe that everything came from nothing, that order came from chaos, that life came from non-life, that consciousness came from unconsciousness, and that reason came from irrationality -- all without any guiding intelligence. The SDA position is that a personal, all-powerful, all-wise God created the heavens and the earth in six literal days and rested on the seventh, establishing the Sabbath as an eternal sign of His creative authority. The evidence from cosmology, biology, and human experience confirms what Scripture declares: 'In the beginning, God.'",
  },
  {
    subjectId: "materialism",
    title: "Countering Materialism with the Reality of the Immaterial",
    sdaPosition:
      "SDAs teach that while humans are a psychosomatic unity (the body and breath of life together constitute a living soul, Genesis 2:7), reality is not limited to the physical. God is Spirit (John 4:24), angels are real beings, and the great controversy between Christ and Satan is waged in both visible and invisible realms (Ephesians 6:12). Materialism fails to account for consciousness, free will, moral obligation, the laws of logic, and the existence of information in DNA. The SDA understanding of human nature -- that we are whole beings who 'sleep' in death until the resurrection (1 Thessalonians 4:16-17) -- avoids the errors of both dualistic immortal-soul theology and reductive materialism.",
    keyScriptures: [
      "Genesis 2:7 -- 'The Lord God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being.' Humanity is a union of material and divine breath.",
      "John 4:24 -- 'God is spirit, and his worshipers must worship in the Spirit and in truth.' Ultimate reality transcends the material.",
      "2 Corinthians 4:18 -- 'What is seen is temporary, but what is unseen is eternal.' The material world is not the ultimate reality.",
      "Ephesians 6:12 -- 'Our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world.' Reality includes a spiritual dimension.",
    ],
    counterArguments: [
      "Consciousness is the hard problem of materialism. No physical account explains WHY there is subjective experience ('what it is like' to see red, feel pain, or think about thinking). Materialism has no answer for qualia.",
      "The laws of logic, mathematics, and morality are immaterial realities that materialism cannot account for. They are not made of matter, yet they are real and binding. Where do they come from in a purely material universe?",
      "Free will is incompatible with strict materialism. If every thought is merely the result of prior physical causes (determinism), then the materialist's own argument is not the result of rational deliberation but of blind chemistry -- undermining the very claim.",
      "The information content in DNA (3 billion base pairs in the human genome, encoding complex specified information) has no known material-only origin. Information always traces back to an intelligent source in our uniform experience.",
    ],
    closingStatement:
      "Materialism asks you to deny what you know most directly -- your own conscious experience, your capacity for rational thought, and your moral intuitions -- in favor of a philosophical assumption that only matter exists. The SDA position affirms the goodness and reality of the material world as God's creation while recognizing that the Creator Himself transcends it. We are not merely molecules in motion; we are beings created in the image of God, designed for relationship with Him, and destined for resurrection into an eternal, tangible reality at Christ's return.",
  },
  {
    subjectId: "scientism",
    title: "Countering Scientism with the Limits of Science",
    sdaPosition:
      "SDAs deeply value scientific inquiry as the study of God's 'second book' -- the book of nature (Psalm 19:1-2). However, the claim that science is the ONLY path to truth is self-refuting, since that claim itself is not a scientific finding but a philosophical assertion. Science operates within methodological naturalism: it studies natural causes and effects. It is powerfully effective within its domain but cannot, by its own design, pronounce on metaphysical, moral, aesthetic, or theological questions. SDAs hold that Scripture and genuine science complement each other, and that truth is unified because all truth originates in God.",
    keyScriptures: [
      "Psalm 19:1-2 -- 'The heavens declare the glory of God; the skies proclaim the work of his hands. Day after day they pour forth speech.' Nature is a witness, not the whole testimony.",
      "Proverbs 1:7 -- 'The fear of the Lord is the beginning of knowledge.' True knowledge starts with the recognition of God, not with its denial.",
      "1 Timothy 6:20 -- 'Guard what has been entrusted to your care. Turn away from godless chatter and the opposing ideas of what is falsely called knowledge.' Not all that claims the label of 'knowledge' is genuine.",
      "Colossians 2:3 -- 'In [Christ] are hidden all the treasures of wisdom and knowledge.' Ultimate truth is found in a Person, not merely in a method.",
    ],
    counterArguments: [
      "Scientism is self-refuting: the claim 'only science can give us truth' is not itself a scientific claim -- it cannot be tested in a lab. It is a philosophical (epistemological) assertion. Therefore, by its own standard, scientism is either not true or not the only way to know truth.",
      "Science depends on non-scientific presuppositions it cannot prove: the reliability of human reason, the uniformity of nature, the validity of mathematics, and the existence of an objective external world. These are philosophical commitments that must be assumed before science can even begin.",
      "Many of the most important truths in human life -- moral truths, aesthetic truths, truths about meaning and purpose, historical truths, logical truths -- lie outside the scope of the scientific method. Science can tell you how to build a bomb; it cannot tell you whether you should drop it.",
      "The history of science shows that scientific consensus has changed dramatically over time (phlogiston, geocentrism, static universe, Newtonian physics as complete). Science is a self-correcting process, not an infallible oracle. Treating it as one is a form of misplaced faith.",
    ],
    closingStatement:
      "Science is a gift from God -- a powerful tool for understanding the natural world He created. But scientism, the ideology that science is the ONLY way to know truth, is not science; it is a philosophy that collapses under its own weight. SDAs welcome every genuine discovery of science while insisting that the Creator who made the world we study has also spoken to us in Scripture, in prophecy, and supremely in the person of Jesus Christ. 'The fear of the Lord is the beginning of wisdom' (Proverbs 9:10).",
  },
  {
    subjectId: "moral-relativism",
    title: "Countering Moral Relativism with God's Moral Law",
    sdaPosition:
      "SDAs hold that God's moral law, summarized in the Ten Commandments (Exodus 20:1-17), is an objective, eternal, and universal standard of right and wrong rooted in God's own unchanging character. The law is not arbitrary (God could have made murder good) nor is it external to God (a standard above God); it flows from who God IS -- loving, just, holy, and true. Moral relativism cannot account for the universal human sense of justice, the reality of moral outrage at genuine evil, or the existence of objective human rights. Without God, 'good' and 'evil' are merely labels for personal preferences.",
    keyScriptures: [
      "Exodus 20:1-17 -- The Ten Commandments, God's objective moral law given directly by His voice and written by His finger.",
      "Romans 2:14-15 -- 'The requirements of the law are written on their hearts, their consciences also bearing witness.' God's moral law is embedded in human nature.",
      "Psalm 119:160 -- 'All your words are true; all your righteous laws are eternal.' God's moral standard is not culturally relative but eternal.",
      "Ecclesiastes 12:13-14 -- 'Fear God and keep his commandments, for this is the duty of all mankind. For God will bring every deed into judgment.' Moral accountability presupposes objective morality.",
    ],
    counterArguments: [
      "Moral relativism is self-defeating: the statement 'there is no objective morality' is itself presented as an objective moral truth. If morality is truly relative, then you cannot say that tolerance is objectively better than intolerance, or that moral relativism is objectively truer than moral realism.",
      "The atheist borrows from the Christian worldview every time they make a moral judgment. When they say the Crusades were 'wrong' or that slavery is 'evil,' they appeal to an objective moral standard they cannot ground in their own worldview. C.S. Lewis observed: the very fact that we argue about right and wrong shows we have access to a moral law beyond mere preference.",
      "If morality is just evolutionary conditioning, then moral beliefs have survival value but no truth value. On this view, our moral intuitions are no more 'true' than a moth's attraction to a flame. This undercuts all moral discourse, including the atheist's moral objections to Christianity.",
      "The SDA emphasis on the perpetuity of God's law (Matthew 5:17-18) provides the objective moral foundation that every human being intuitively recognizes. The Sabbath commandment is especially significant: it anchors ethics in creation, not cultural convention.",
    ],
    closingStatement:
      "Moral relativism sounds tolerant, but it is a philosophy that cannot condemn genocide, slavery, or child abuse as objectively wrong -- only as culturally disfavored. The SDA position is that God has revealed an objective moral law, written in stone and on the human heart, that transcends culture and time. This law is not oppressive; it is the framework for human flourishing, reflecting the character of a God who is love (1 John 4:8). Without God's law, morality is a castle built on sand.",
  },
  {
    subjectId: "problem-of-evil",
    title: "Countering the Problem of Evil with the Great Controversy",
    sdaPosition:
      "The SDA great controversy theme provides the most comprehensive Christian answer to the problem of evil. Evil entered the universe not because God created it or willed it, but because God created beings with genuine free will -- and one of those beings, Lucifer, chose rebellion (Isaiah 14:12-14; Ezekiel 28:14-17). God did not immediately destroy Satan because the watching universe needed to see the full outworking of sin's consequences in contrast to God's character of love (Romans 9:22; Nahum 1:9). The cross of Christ is God's definitive answer to evil: He entered human suffering, bore its full weight, and conquered death itself. The promise of Adventism is that evil is temporary -- Christ will return, evil will be eradicated, and God will make all things new (Revelation 21:4-5).",
    keyScriptures: [
      "Isaiah 14:12-14 -- The origin of evil in Lucifer's free-will rebellion against God in heaven.",
      "Romans 8:28 -- 'In all things God works for the good of those who love him.' God is sovereign over suffering, working redemptively through it.",
      "Revelation 21:4 -- 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.' Evil is temporary; God will end it completely.",
      "Nahum 1:9 -- 'Affliction will not rise up a second time.' The great controversy will be resolved so thoroughly that evil will never recur.",
    ],
    counterArguments: [
      "The problem of evil is actually a greater problem for the atheist than for the theist. If there is no God, there is no objective standard by which anything can be called 'evil.' The atheist must borrow from a theistic framework to even formulate the problem. As C.S. Lewis wrote: 'My argument against God was that the universe seemed so cruel and unjust. But how had I got this idea of just and unjust? A man does not call a line crooked unless he has some idea of a straight line.'",
      "The SDA great controversy narrative explains WHY God permits evil temporarily: to vindicate His character before the entire universe. If God had destroyed Satan immediately, the universe would have served Him from fear, not love. By allowing sin to run its course, God demonstrates that His way is the only way that leads to life and joy.",
      "The cross answers the problem of evil not by explaining it philosophically but by entering it personally. God is not a distant spectator of human suffering; He became a man, suffered, and died (Philippians 2:5-8). A God who shares our suffering cannot be accused of indifference to it.",
      "SDA eschatology provides ultimate hope: the second coming of Christ, the millennial judgment, and the new earth represent God's final, total eradication of evil. Suffering is real, but it is not the end of the story. 'Weeping may endure for a night, but joy comes in the morning' (Psalm 30:5).",
    ],
    closingStatement:
      "The problem of evil is the atheist's strongest emotional argument, but it is logically self-defeating: you cannot call something 'evil' without an objective moral standard, and you cannot have an objective moral standard without God. The SDA great controversy theme offers what no other worldview can: a coherent explanation of evil's origin in free will, a God who entered our suffering at the cross, and a guaranteed future in which every tear will be wiped away and sin will never rise again. This is not blind optimism; it is the promise of the God who conquered the grave.",
  },
  {
    subjectId: "fulfilled-prophecy",
    title: "Countering Prophecy Dismissal with Historically Verifiable Evidence",
    sdaPosition:
      "Biblical prophecy is the single most powerful apologetic weapon against unbelief because it is testable. Unlike philosophical arguments that depend on contested premises, fulfilled prophecy provides historically verifiable, centuries-in-advance predictions that either came true or did not. Daniel's prophecies name empires (Medo-Persia and Greece in Daniel 8:20-21), predict their sequence, describe their characteristics, and provide mathematical timelines that can be checked against the historical record. The historicist method of prophetic interpretation — reading prophecy as a continuous timeline from the prophet's day to the end of the world — has been vindicated by the march of history across more than 2,500 years. This is not a 'God of the gaps' argument; it is an argument from evidence that the atheist must engage on its own terms.",
    keyScriptures: [
      "Daniel 2:31-45 — The great image prophecy: Babylon (gold head), Medo-Persia (silver chest), Greece (bronze belly), Rome (iron legs), divided Europe (iron/clay feet). Written in the 6th century BC, historically verified across 2,500 years. No other religious text offers anything comparable.",
      "Daniel 7:23-25 — The fourth beast (Rome) produces a little horn that speaks against the Most High and persecutes the saints for 'a time, times, and half a time' (1,260 years). Historical fulfillment: 538 AD to 1798 AD.",
      "Daniel 8:14 — 'Unto two thousand and three hundred days; then shall the sanctuary be cleansed.' Using the day-for-a-year principle (Numbers 14:34; Ezekiel 4:6), this timeline begins in 457 BC (Artaxerxes' decree, Ezra 7) and reaches to 1844 AD — the inauguration of the pre-Advent investigative judgment in the heavenly sanctuary.",
      "Daniel 9:24-27 — The seventy-week prophecy (490 years) pinpoints the baptism of Jesus (27 AD), His crucifixion ('cut off,' 31 AD), and the close of the gospel's exclusive mission to Israel (34 AD). This is mathematical prophecy: start date, duration, and fulfillment events are all historically verifiable.",
      "Revelation 9:13-21 — The sixth trumpet prophesies the 391-year-and-15-day period of Ottoman Turkish power (1449 to August 11, 1840). Josiah Litch published this prediction in advance, and it was confirmed by history — a falsifiable, publicly verifiable test of prophetic reliability.",
      "Isaiah 46:9-10 — 'I am God, and there is none like me, declaring the end from the beginning, and from ancient times the things that are not yet done.' God Himself points to predictive prophecy as the distinguishing evidence of His deity.",
    ],
    counterArguments: [
      "The Maccabean dating hypothesis for Daniel is circular. It assumes predictive prophecy is impossible and then dates the book after the events to avoid admitting prophecy occurred. This is antisupernatural bias disguised as scholarship. Even on a late dating, Daniel's predictions about Rome, Europe's fragmentation, and the 1,260-year timeline extend centuries beyond the Maccabean period and cannot be explained as retrodiction.",
      "Daniel's prophecies are not vague — they name empires (Daniel 8:20-21), describe their characteristics in detail (four divisions of Greece, iron strength of Rome), predict their sequence, and provide mathematical timelines (2,300 days, 70 weeks, 1,260 years) that can be checked against the historical record. This is the opposite of Nostradamus-style vagueness.",
      "The sixth trumpet prophecy (Revelation 9) demonstrates testable, falsifiable prophetic accuracy. Josiah Litch published the predicted date of August 11, 1840, for the fall of Ottoman independence — and it happened. This is not retroactive pattern-matching; it is advance prediction confirmed by documented history.",
      "No other religious text — the Quran, the Vedas, the Book of Mormon, the Tao Te Ching — offers anything approaching the Bible's prophetic track record. This is a unique, distinguishing mark of divine inspiration that places the Bible in a category by itself. The atheist who dismisses prophecy without engaging the specific evidence is avoiding the strongest argument against their position.",
      "The convergence of Daniel 8:14 and Revelation 14:6-7 is the capstone of prophetic apologetics. Daniel gives the time (2,300 days ending in 1844); Revelation gives the meaning ('the hour of his judgment is come'). Together they reveal that God is not only sovereign over history — He is conducting a judgment right now, and the prophetic timeline that predicted it is itself evidence that the Judge is real.",
    ],
    closingStatement:
      "Fulfilled biblical prophecy is the atheist's most formidable challenge because it is testable, historically verifiable, and mathematically precise. Daniel predicted the succession of world empires centuries in advance. Daniel 9 pinpointed the year of Christ's baptism and crucifixion. The sixth trumpet predicted the fall of Ottoman independence to the exact day. No naturalistic explanation accounts for this prophetic track record. The atheist who dismisses prophecy as 'vague symbolism' has not engaged the evidence; the atheist who engages it must explain how an ancient text predicted the future with such precision — without God. 'I am God, and there is none like me, declaring the end from the beginning' (Isaiah 46:9-10).",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ────── Module 1: Naturalism ──────
  {
    id: "atheist-mod-naturalism",
    subjectId: "naturalism",
    title: "Confronting Naturalism: Is Nature All There Is?",
    doctrineBrief:
      "Naturalism is the philosophical position that nature -- the physical universe governed by natural laws -- is all that exists. There is no supernatural realm, no God, no angels, no miracles, and no afterlife. Everything that happens, from the birth of stars to the emergence of human consciousness, can (in principle) be explained by natural causes without any recourse to a transcendent Creator.\n\nThis worldview is the bedrock of modern atheism. It goes beyond the methodological naturalism used in science (which merely brackets the supernatural for the purpose of investigation) and makes the metaphysical claim that nature is all there is, all there was, and all there ever will be. Naturalism directly contradicts the first article of the SDA faith: 'In the beginning, God created the heavens and the earth' (Genesis 1:1).\n\nFor SDAs, the Sabbath is the weekly memorial of creation -- a standing protest against the naturalistic claim that the universe is self-originating and self-sustaining. Every seventh day, Adventists testify by their worship that the natural world has a supernatural origin and that the Creator who made it still sustains it by His powerful word (Hebrews 1:3).",
    steelmanArguments: [
      steelmanArguments[1], // "Science has disproved God"
      steelmanArguments[2], // "Evolution explains life without God"
    ],
    hiddenAssumptions: [
      "Nature is self-existent and self-explanatory -- it needs no cause or explanation beyond itself, despite having a finite past.",
      "Methodological naturalism (a tool) = metaphysical naturalism (a worldview). Because science operates without invoking God, God must not exist.",
      "The success of science in explaining natural phenomena proves that natural phenomena are all that exist -- a non sequitur.",
      "Consciousness, reason, morality, and information can all emerge from mindless, purposeless matter given enough time.",
    ],
    mindGames: [
      mindGames[2], // Intellectual Intimidation
      mindGames[3], // False Superiority
    ],
    fallacies: [
      fallacies[1], // False Dilemma
      fallacies[2], // Category Error
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "atheist",
    debriefPrompt:
      "Reflect on your encounter with naturalism. Were you able to show that naturalism is a philosophical position, not a scientific conclusion? Did you identify the category error in demanding physical evidence for a non-physical God? Could you articulate why the Sabbath is the SDA's strongest witness against naturalism? What areas do you need to study further?",
  },
  // ────── Module 2: Materialism ──────
  {
    id: "atheist-mod-materialism",
    subjectId: "materialism",
    title: "Confronting Materialism: Is Physical Matter All That's Real?",
    doctrineBrief:
      "Materialism asserts that physical matter is the only fundamental reality. Mind, consciousness, emotions, will, and even the sense of self are ultimately reducible to physical processes -- electrochemical signals in neurons, nothing more. There is no 'ghost in the machine,' no soul, no spirit, and no mind distinct from the brain. When the brain dies, the person ceases to exist entirely.\n\nMaterialism poses a unique challenge to Christianity because it denies the possibility of any non-physical reality: God, angels, the soul, the resurrection, and answered prayer are all categorically impossible if materialism is true. It also directly challenges human dignity and moral responsibility, since on a materialist view, human beings are merely complex arrangements of atoms with no intrinsic value or genuine freedom.\n\nSDAs hold a distinctive position on human nature that avoids both Platonic dualism (the soul as a separate substance trapped in the body) and reductive materialism. Genesis 2:7 teaches that God formed the body from dust and breathed the breath of life into it, and the whole person BECAME a living soul. We are an indivisible unity -- but a unity that includes the breath (ruach) of God, pointing beyond mere matter to a transcendent source of life.",
    steelmanArguments: [
      steelmanArguments[0], // "God is a myth created for comfort"
      steelmanArguments[3], // "No evidence for God"
    ],
    hiddenAssumptions: [
      "Consciousness is identical to brain activity -- not merely correlated with it but reducible to it, despite the 'hard problem' remaining unsolved.",
      "If something is not made of matter, it does not exist -- excluding logic, mathematics, morality, information, and consciousness itself from 'reality.'",
      "Physical causal closure is proven -- every physical event has a sufficient physical cause, leaving no room for non-physical causation. This is an assumption, not a demonstrated fact.",
    ],
    mindGames: [
      mindGames[0], // Burden Shifting
      mindGames[2], // Intellectual Intimidation
    ],
    fallacies: [
      fallacies[2], // Category Error
      fallacies[3], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "atheist",
    debriefPrompt:
      "Review your defense against materialism. Were you able to press the hard problem of consciousness as a fundamental challenge? Could you show that the materialist worldview undercuts rationality, free will, and moral accountability? Did you present the SDA holistic view of human nature as a coherent alternative to both dualism and materialism? What would you do differently next time?",
  },
  // ────── Module 3: Scientism ──────
  {
    id: "atheist-mod-scientism",
    subjectId: "scientism",
    title: "Confronting Scientism: Is Science the Only Path to Truth?",
    doctrineBrief:
      "Scientism is the belief that the scientific method is the only reliable path to genuine knowledge. Any claim that cannot be empirically tested, measured, and repeated is not real knowledge -- it is opinion, superstition, or at best, useful fiction. On this view, theology, philosophy, ethics, and aesthetics are all second-class disciplines that cannot deliver truth.\n\nThis position is enormously influential in contemporary culture, where 'science says' functions as the ultimate authority claim. It is important to distinguish scientism from science itself. Science is a method for studying the natural world; scientism is the ideology that elevates this method to the only source of truth. SDAs respect science deeply but reject the ideological overreach of scientism.\n\nThe self-refuting nature of scientism is its greatest vulnerability: the claim 'only science can give us truth' is itself not a scientific claim. It cannot be tested in a laboratory. It is a philosophical assertion -- and by its own standard, it fails to qualify as truth. SDAs affirm that God has given us multiple avenues to truth: reason, experience, conscience, history, and supremely, His written Word and the living Word, Jesus Christ (John 14:6).",
    steelmanArguments: [
      steelmanArguments[1], // "Science has disproved God"
      steelmanArguments[3], // "No evidence for God"
      steelmanArguments[2], // "Evolution explains life without God"
    ],
    hiddenAssumptions: [
      "The statement 'only science gives truth' is treated as self-evidently true despite being untestable by the scientific method -- a performative contradiction.",
      "Science presupposes philosophical commitments (uniformity of nature, reliability of reason, validity of math) that it cannot prove, yet scientism treats these as given while denying other non-empirical truths.",
      "Historical, moral, logical, aesthetic, and personal truths are either reducible to scientific truths or are not real truths at all.",
    ],
    mindGames: [
      mindGames[2], // Intellectual Intimidation
      mindGames[3], // False Superiority
    ],
    fallacies: [
      fallacies[0], // Strawman
      fallacies[1], // False Dilemma
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "atheist",
    debriefPrompt:
      "Evaluate your response to scientism. Could you clearly articulate WHY scientism is self-refuting? Did you successfully show that science depends on non-scientific presuppositions? Were you able to affirm science as a gift from God while critiquing scientism as a philosophical overreach? How might you strengthen your argument with specific examples?",
  },
  // ────── Module 4: Moral Relativism ──────
  {
    id: "atheist-mod-moral-relativism",
    subjectId: "moral-relativism",
    title: "Confronting Moral Relativism: Is Right and Wrong Just Opinion?",
    doctrineBrief:
      "Moral relativism holds that there are no objective moral truths. What is considered 'right' and 'wrong' varies from culture to culture, era to era, and even person to person. Morality, on this view, is a human construction -- a set of social agreements, evolutionary instincts, or personal preferences that have no binding authority beyond the community or individual that holds them.\n\nThis position is deeply attractive in a pluralistic age because it appears tolerant and non-judgmental. However, it collapses under scrutiny. If morality is truly relative, then no one can say that the Holocaust was objectively wrong -- only that our culture disapproves of it. The relativist cannot consistently condemn slavery, genocide, or child abuse as genuinely evil; they can only say these things are against current social norms.\n\nSDAs stand on the bedrock of God's moral law, the Ten Commandments (Exodus 20:1-17), which they understand as a transcript of God's own character. This law is not an arbitrary set of rules imposed from outside; it is the expression of who God is -- and since God does not change (Malachi 3:6), His moral law does not change either. The SDA emphasis on the perpetuity of God's law (Matthew 5:17-18) and the Sabbath commandment as a sign of sanctification (Ezekiel 20:12) provides a powerful counter to moral relativism.",
    steelmanArguments: [
      steelmanArguments[0], // "God is a myth" (implied: morality is human invention)
      steelmanArguments[4], // "Religion causes violence"
    ],
    hiddenAssumptions: [
      "Moral disagreement between cultures proves there is no objective moral truth -- but disagreement about facts (e.g., shape of the earth) does not prove there is no objective fact.",
      "Evolutionary origins of moral instincts mean morality has survival value but no truth value -- our sense of right and wrong is a useful illusion.",
      "Tolerance requires moral relativism -- but genuine tolerance actually requires an objective standard by which you decide to tolerate people with whom you disagree.",
    ],
    mindGames: [
      mindGames[1], // Mockery
      mindGames[0], // Burden Shifting
    ],
    fallacies: [
      fallacies[0], // Strawman
      fallacies[3], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "atheist",
    debriefPrompt:
      "Assess your engagement with moral relativism. Were you able to show that the position is self-defeating? Could you demonstrate that the atheist borrows from Christian morality when making moral judgments? Did you effectively connect God's moral law (especially the Ten Commandments and Sabbath) to the SDA position? How could you improve your approach to this deeply emotional topic?",
  },
  // ────── Module 5: Problem of Evil ──────
  {
    id: "atheist-mod-problem-of-evil",
    subjectId: "problem-of-evil",
    title: "Confronting the Problem of Evil: Why Does God Allow Suffering?",
    doctrineBrief:
      "The problem of evil is the most emotionally powerful argument in the atheist arsenal. It comes in two forms: the logical problem (God and evil are logically incompatible) and the evidential problem (the amount and distribution of suffering make God's existence improbable). Both forms challenge the core Christian claim that God is all-powerful, all-knowing, and all-loving.\n\nThe logical problem has been largely abandoned by professional philosophers since Alvin Plantinga's free will defense demonstrated that God and evil are not logically incompatible. The evidential problem remains a live debate, but it rests on the assumption that we are in an epistemic position to judge whether God has morally sufficient reasons for permitting specific instances of suffering -- an assumption that seems presumptuous given our cognitive limitations.\n\nThe SDA great controversy theme provides the most comprehensive Christian response to the problem of evil. It explains evil's origin (Lucifer's free-will rebellion in heaven), its purpose in being temporarily permitted (to vindicate God's character before the universe), its definitive answer (the cross of Christ), and its ultimate resolution (the second coming, the millennium, and the new earth where sin will never rise again -- Nahum 1:9). This cosmic narrative transforms the problem of evil from an abstract philosophical puzzle into a dramatic story of love, freedom, rebellion, sacrifice, and ultimate restoration.",
    steelmanArguments: [
      steelmanArguments[4], // "Religion causes violence"
      steelmanArguments[0], // "God is a myth for comfort"
      steelmanArguments[3], // "No evidence for God"
    ],
    hiddenAssumptions: [
      "We are in an epistemic position to judge that an all-knowing God could have no morally sufficient reason for permitting specific suffering -- a breathtaking assumption of near-omniscience.",
      "A truly good God would prevent ALL suffering -- but this assumes that a world without suffering would be a better world, ignoring the soul-making value of hardship and the necessity of genuine free will.",
      "The existence of evil counts as evidence against God -- but the existence of evil actually requires an objective moral standard, which requires God. The argument defeats itself.",
    ],
    mindGames: [
      mindGames[1], // Mockery
      mindGames[0], // Burden Shifting
    ],
    fallacies: [
      fallacies[0], // Strawman
      fallacies[2], // Category Error
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "atheist",
    debriefPrompt:
      "Reflect carefully on this most personal of topics. Were you able to balance intellectual rigor with pastoral compassion? Could you explain the SDA great controversy theme as a comprehensive answer to evil? Did you show that the problem of evil is actually harder for the atheist to solve than for the Christian? Most importantly, did you point to the cross as God's definitive answer to suffering? What would you do differently when facing someone in genuine pain?",
  },
  // ────── Module 6: Fulfilled Prophecy ──────
  {
    id: "atheist-mod-fulfilled-prophecy",
    subjectId: "fulfilled-prophecy",
    title: "Confronting Atheism with Fulfilled Prophecy: The Bible's Testable Evidence",
    doctrineBrief:
      "Fulfilled biblical prophecy is the most underutilized weapon in apologetics against atheism — and it is arguably the strongest. While the design argument, the moral argument, and the argument from personal transformation are powerful, they are often dismissed as 'subjective' or 'philosophical.' Prophecy is different. It is testable. It is historically verifiable. It is mathematically precise. And it has no naturalistic explanation.\n\nDaniel chapter 2, written in the 6th century BC, predicted the exact succession of four world empires — Babylon, Medo-Persia, Greece, and Rome — followed by a fragmented Europe that would never reunite into a single empire. Napoleon tried. Hitler tried. The EU strives. None have succeeded. The prophecy stands after 2,500 years.\n\nDaniel chapter 7 enlarges the same timeline with greater detail, adding the rise of a 'little horn' power among the divisions of Rome that would persecute God's people for 1,260 years (Daniel 7:25). This maps precisely to the dominance of papal Rome from 538 AD (when Justinian's decree gave the bishop of Rome supremacy) to 1798 AD (when Napoleon's general Berthier arrested Pope Pius VI).\n\nDaniel 9:24-27 provides the seventy-week (490-year) prophecy, beginning with the decree to restore Jerusalem in 457 BC (Ezra 7). This timeline pinpoints the baptism of Jesus Christ in 27 AD and His crucifixion in 31 AD — centuries in advance, with mathematical precision.\n\nDaniel 8:14 extends the prophetic telescope further: the 2,300-day prophecy, beginning from the same starting point of 457 BC, reaches to 1844 AD — the commencement of the pre-Advent investigative judgment in the heavenly sanctuary. This is the meaning of Revelation 14:7: 'the hour of his judgment is come.' Daniel gives the time; Revelation gives the meaning.\n\nPerhaps most strikingly, the sixth trumpet prophecy of Revelation 9:13-21 predicted the 391-year-and-15-day career of Ottoman Turkish power. Using the day-for-a-year principle, this period runs from July 27, 1449, to August 11, 1840. Josiah Litch, an American preacher, published this prediction before the date arrived. When the Ottoman Empire surrendered its independent power on August 11, 1840, exactly as predicted, it sent shockwaves through the religious world and validated the prophetic time methodology.\n\nNo other religious text on earth offers anything approaching this prophetic track record. Not the Quran. Not the Vedas. Not the Book of Mormon. Not the writings of any philosopher, scientist, or futurist. Biblical prophecy stands alone as testable, falsifiable, historically verifiable evidence of divine foreknowledge.\n\nThe atheist who has never engaged this evidence has never confronted the strongest case for God's existence. The atheist who engages it must explain how ancient texts predicted specific empires, specific dates, and specific events centuries in advance — without divine inspiration. 'I am God, and there is none like me, declaring the end from the beginning, and from ancient times the things that are not yet done' (Isaiah 46:9-10).",
    steelmanArguments: [
      steelmanArguments[5], // "Biblical Prophecy Is Vague, Retrodicted, or Fabricated"
      steelmanArguments[3], // "No Evidence for God"
    ],
    hiddenAssumptions: [
      "Predictive prophecy is impossible by definition — an antisupernatural presupposition that predetermines the conclusion before examining the evidence.",
      "Daniel must be late-dated to avoid admitting prophecy — but even a 2nd-century date cannot explain Daniel's predictions about Rome, Europe's fragmentation, or the 1,260-year, 2,300-day, and 70-week timelines.",
      "Symbolic language equals vagueness — ignores that Daniel names empires explicitly and provides mathematical timelines.",
      "Prophecy can always be explained by coincidence, retroactive interpretation, or cultural influence — but the convergence of multiple independent prophetic timelines reaching specific dates eliminates chance as an explanation.",
    ],
    mindGames: [
      mindGames[2], // Intellectual Intimidation
      mindGames[3], // False Superiority
    ],
    fallacies: [
      fallacies[3], // Genetic Fallacy (dismissing prophecy based on origin rather than content)
      fallacies[2], // Category Error
    ],
    counterStrategy: counterStrategies[5],
    debateSimLink: "atheist",
    debriefPrompt:
      "This module targets the atheist's weakest point: testable evidence. Evaluate your performance. Were you able to present Daniel 2 and 7 as historically verifiable predictions, not retroactive readings? Could you walk through the 70-week and 2,300-day timelines mathematically? Did you use the sixth trumpet (Ottoman) prophecy as a falsifiable, publicly verifiable test case? Were you able to show that no other religious text offers comparable predictive evidence? Could you articulate the connection between Daniel 8:14 and Revelation 14:7 — that the 2,300-day prophecy does not end at a date but at a process (the judgment)? What areas of prophetic apologetics do you need to study more deeply?",
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const atheistTraining: AATSAvatarTraining = {
  avatarId: "atheist",
  avatarName: "The Atheist",
  emoji: "\u{1F9EA}", // 🧪
  color: "border-gray-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
