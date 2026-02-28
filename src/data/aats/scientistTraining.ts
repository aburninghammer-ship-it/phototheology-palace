// ─── AATS: Scientist Avatar Training Data ────────────────────────────────────
// Comprehensive training curriculum for defending SDA faith against empirical/scientific objections.
// Distinct from the Atheist track: focuses on DATA, METHOD, and EMPIRICAL CLAIMS rather than philosophy.

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
    id: "evolution",
    title: "Evolution & Darwinism",
    description:
      "The theory that all biological complexity arose through unguided natural selection and random mutation over billions of years, rendering a Creator unnecessary for explaining life's diversity and apparent design.",
  },
  {
    id: "age-of-earth",
    title: "Age of the Earth",
    description:
      "Radiometric dating, geological strata, and cosmological measurements indicate the earth is approximately 4.5 billion years old and the universe 13.8 billion years old — directly contradicting a literal six-day creation week.",
  },
  {
    id: "fossil-record",
    title: "The Fossil Record",
    description:
      "Paleontology presents fossils as a progressive record of life evolving over deep time, with transitional forms, mass extinctions, and no evidence of a global flood's catastrophic sediment layers.",
  },
  {
    id: "cosmology",
    title: "Cosmology & Origins",
    description:
      "The Big Bang, cosmic microwave background radiation, and the expansion of the universe provide a naturalistic account of cosmic origins that seemingly requires no divine First Cause.",
  },
  {
    id: "neuroscience",
    title: "Neuroscience & Consciousness",
    description:
      "Brain imaging, neurochemistry, and cognitive science suggest that consciousness, morality, and religious experience are entirely products of neural activity — the soul is a pre-scientific concept.",
  },
  {
    id: "flood-geology",
    title: "Flood Geology & Catastrophism",
    description:
      "Scientific evaluation of the global flood narrative: geological column, sediment patterns, biogeography, and hydraulic physics either challenge or confirm the biblical account depending on methodology and assumptions.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "scientist-steelman-evolution",
    title: "The Overwhelming Consensus on Evolution",
    argument:
      "Evolution is supported by converging evidence from genetics (shared DNA sequences, endogenous retroviruses), paleontology (transitional fossils like Tiktaalik and Archaeopteryx), comparative anatomy (homologous structures), embryology, biogeography, and direct observation of speciation. No credible scientific institution rejects evolution. To deny it is to reject the methodology that gave us antibiotics, vaccines, and genomics.",
    hiddenAssumptions: [
      "Consensus equals truth — but scientific consensus has been wrong before (continental drift, stomach ulcers)",
      "Micro-evolution (observable variation) is treated as proof of macro-evolution (new body plans) without demonstrating the mechanism",
      "Methodological naturalism is conflated with metaphysical naturalism — the method excludes God by definition, then declares God absent from evidence",
      "Shared genetic features are assumed to indicate common ancestry rather than common design",
    ],
    sdaResponse:
      "SDAs distinguish between operational science (repeatable, testable) and historical science (reconstructive, interpretive). We affirm micro-evolution — adaptation within kinds — as observable and undeniable. What lacks empirical demonstration is macro-evolution: the generation of fundamentally new body plans, genetic information, and irreducibly complex systems through unguided mutation and selection. The Cambrian Explosion remains unexplained by gradualism — virtually every animal phylum appears in a geological instant with no ancestral precursors. Information theory shows that random processes do not generate the specified complexity found in DNA. Genesis 1 records creation 'after their kind' — a framework that predicts variation within boundaries, precisely what we observe. Romans 1:20 declares God's invisible attributes visible through creation. True science and Scripture are allies, not enemies.",
  },
  {
    id: "scientist-steelman-age",
    title: "Radiometric Dating Proves Deep Time",
    argument:
      "Multiple independent radiometric methods (uranium-lead, potassium-argon, rubidium-strontium, carbon-14) consistently yield ages of billions of years for rocks and millions of years for fossils. These methods are cross-validated and their physics is well understood. A young earth requires all these methods to be simultaneously and systematically wrong.",
    hiddenAssumptions: [
      "Assumption of constant decay rates — yet decay rates may be affected by extreme conditions (e.g., research on accelerated nuclear decay during catastrophic events)",
      "Assumption of known initial conditions — the starting ratio of parent/daughter isotopes is assumed, not measured",
      "Discordant dates are common but explained away; concordant dates are presented as confirmation",
      "Carbon-14 found in diamonds and coal (which should contain zero C-14 if billions of years old) is dismissed as contamination without falsifiable criteria",
    ],
    sdaResponse:
      "SDAs take radiometric dating seriously but recognize its built-in assumptions: constant decay rates, closed systems, and known initial conditions. When these assumptions are tested, anomalies emerge — carbon-14 in diamonds, helium retention in zircons, soft tissue in dinosaur bones. The RATE research project (Radioisotopes and the Age of The Earth) documented evidence of accelerated nuclear decay. Furthermore, catastrophism (the global Flood of Genesis 6-8) provides an alternative framework for rapid geological processes that conventional uniformitarianism cannot account for. Jesus Himself affirmed the historicity of Noah and the Flood (Matthew 24:37-39). The biblical chronology — supported by genealogies in Genesis 5 and 11, cross-referenced with Daniel's prophetic timelines — provides an internally consistent framework. SDAs hold that the Flood reshaped earth's geology in ways that challenge uniformitarian assumptions.",
  },
  {
    id: "scientist-steelman-fossils",
    title: "Transitional Fossils Prove Gradual Change",
    argument:
      "Paleontology has documented numerous transitional forms: Tiktaalik (fish to tetrapod), Archaeopteryx (dinosaur to bird), Ambulocetus (land mammal to whale), Australopithecus (ape to human). These forms show precisely the intermediate anatomical features predicted by evolutionary theory.",
    hiddenAssumptions: [
      "Transitional forms are often fragmentary and their placement in lineages is interpretive, not observed",
      "Many 'transitions' are reclassified as evolutionary dead ends when new data emerges",
      "The overall fossil record shows stasis (species remain unchanged for long periods) then sudden appearance — the opposite of gradualism",
      "Soft-tissue preservation in dinosaur fossils challenges deep-time assumptions",
    ],
    sdaResponse:
      "SDAs recognize that some fossils display mosaic features — combinations of traits from different groups. However, mosaic does not equal transitional. A platypus combines mammalian, reptilian, and avian features but is not transitional between any of them. The fossil record overwhelmingly shows sudden appearance and stasis, not gradual transformation — a pattern more consistent with creation 'after their kind' (Genesis 1) followed by catastrophic burial during the Flood. The discovery of original soft tissue, blood vessels, and proteins in dinosaur bones (Schweitzer et al., 2005) raises profound questions about conventional dating. If these bones are 65+ million years old, how has organic material survived? The simpler explanation is that they are not that old. Psalm 104 and Genesis 7-8 describe a catastrophic reshaping of the earth that accounts for rapid fossil formation.",
  },
  {
    id: "scientist-steelman-cosmology",
    title: "The Big Bang Explains Origins Without God",
    argument:
      "Cosmic microwave background radiation, the expansion of the universe (Hubble's Law), the abundance of light elements, and the large-scale structure of the cosmos all confirm the Big Bang model. The universe began from an incredibly dense, hot state approximately 13.8 billion years ago. No divine intervention is required.",
    hiddenAssumptions: [
      "The Big Bang describes expansion from a singularity — but cannot explain where the singularity came from or why the laws of physics exist",
      "Fine-tuning of cosmological constants is acknowledged but explained away by the multiverse hypothesis — an unfalsifiable speculation",
      "The assumption that 'no divine intervention is required' is metaphysical, not empirical — science describes HOW, not WHO or WHY",
    ],
    sdaResponse:
      "The Big Bang actually poses a severe problem for naturalism: it demands a beginning. If the universe had a beginning, then something outside the universe caused it. The cosmological argument (Kalam) stands: whatever begins to exist has a cause; the universe began to exist; therefore the universe has a cause. The fine-tuning of over 30 cosmological constants (gravitational force, electromagnetic force, nuclear strong force) to values that permit life is so precise that physicist Roger Penrose calculated the odds at 1 in 10^10^123. The multiverse hypothesis is an untestable escape hatch — it multiplies entities without evidence, violating Occam's Razor. Genesis 1:1 declares 'In the beginning God created the heaven and the earth.' Psalm 19:1 adds 'The heavens declare the glory of God.' The heavens do declare — and what they declare is design.",
  },
  {
    id: "scientist-steelman-brain",
    title: "Consciousness Is Just Brain Activity",
    argument:
      "Functional MRI, EEG studies, and neurochemistry demonstrate that every aspect of human experience — thought, emotion, moral reasoning, even religious experience — correlates with specific brain states. Damage to the brain alters personality, memory, and consciousness. There is no evidence for a soul independent of the brain.",
    hiddenAssumptions: [
      "Correlation is not causation — brain activity correlating with consciousness does not prove brain activity PRODUCES consciousness",
      "The hard problem of consciousness remains unsolved: subjective experience (qualia) cannot be explained by physical processes alone",
      "Near-death experiences with verifiable observations during clinical brain death challenge the reductive model",
      "The assumption that only physical evidence counts presupposes materialism — the conclusion being smuggled into the premises",
    ],
    sdaResponse:
      "SDAs hold a holistic anthropology: the soul is not a ghost in a machine but the whole living person (Genesis 2:7 — 'the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul'). The Hebrew nephesh (soul) means the whole person, not a disembodied spirit. We agree that consciousness is deeply integrated with the body — this is why death is described as 'sleep' (John 11:11-14, Ecclesiastes 9:5). However, the materialist claim that consciousness IS brain activity faces the 'hard problem': no amount of neural mapping explains WHY there is subjective experience. Information, meaning, and intentionality are not physical properties. The brain is an instrument the Creator designed for consciousness to operate through — like a piano through which music is played. Destroying the piano stops the music, but the composer still exists.",
  },
  {
    id: "scientist-steelman-flood",
    title: "A Global Flood Is Geologically Impossible",
    argument:
      "The geological column shows ordered strata deposited over billions of years, not a single catastrophic event. There is insufficient water on earth for a global flood. The sorting of fossils by complexity (simple organisms in lower strata, complex in upper) reflects evolutionary progression, not hydrodynamic sorting. Biogeography (distribution of species across continents) cannot be explained by a single dispersal point after a flood.",
    hiddenAssumptions: [
      "The geological column as presented in textbooks is an idealized composite — nowhere on earth is the full column found in one location",
      "Polystrate fossils (spanning multiple strata) indicate rapid deposition, not slow accumulation",
      "Uniformitarian assumptions ('the present is the key to the past') exclude catastrophism by methodological choice, not by evidence",
      "Massive sediment transport, fossil graveyards, and continent-wide formations are better explained by catastrophic processes",
    ],
    sdaResponse:
      "SDAs affirm the historicity of the Genesis Flood (Genesis 6-8) as confirmed by Christ Himself (Matthew 24:37-39) and Peter (2 Peter 3:5-6). The geological evidence, when interpreted through a catastrophist lens, strongly supports rapid, massive deposition: continent-wide sediment layers (the Tapeats Sandstone spans most of North America), fossil graveyards with mixed species (indicating catastrophic burial, not peaceful death), polystrate fossils spanning multiple 'millions of years' of strata, and the presence of marine fossils on every mountain range on earth. The water source is described in Genesis 7:11 — 'the fountains of the great deep broken up, and the windows of heaven were opened' — indicating tectonic and atmospheric mechanisms. Catastrophic plate tectonics models (developed by geophysicist John Baumgardner) demonstrate that rapid subduction and mantle convection could drive a global flood event. The Bible does not ask us to ignore science — it asks us to interpret evidence through the lens of revelation.",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "scientist-mg-consensus-pressure",
    name: "Consensus Pressure",
    description:
      "Using the weight of scientific consensus as a psychological weapon. 'All real scientists agree' implies that disagreement equals ignorance or dishonesty. This is social pressure disguised as evidence.",
    example:
      "\"97% of scientists accept evolution. Are you really going to claim you know better than the entire scientific community?\"",
    detectionTip:
      "Ask whether consensus is evidence or sociology. Consensus has been wrong before (continental drift, stomach ulcers, static universe). Truth is determined by evidence, not by vote. The history of science is a graveyard of consensuses.",
  },
  {
    id: "scientist-mg-credential-gatekeeping",
    name: "Credential Gatekeeping",
    description:
      "Dismissing any challenge to scientific claims by demanding the challenger hold specific degrees. This prevents engagement with the actual argument by attacking the person's qualifications instead.",
    example:
      "\"Do you have a PhD in evolutionary biology? No? Then you're not qualified to question the science.\"",
    detectionTip:
      "Ask whether truth depends on credentials or evidence. Many scientific breakthroughs came from outsiders. Evaluate the argument, not the arguer. If the evidence is public, anyone can examine it.",
  },
  {
    id: "scientist-mg-complexity-shield",
    name: "Complexity Shield",
    description:
      "Overwhelming the opponent with technical jargon, obscure terminology, and dense data to create the impression that only specialists can evaluate the claim. The goal is to shut down inquiry, not to educate.",
    example:
      "\"The phylogenetic analysis of homologous allelic variation across orthologous loci clearly demonstrates monophyletic descent...\" — used not to explain but to intimidate.",
    detectionTip:
      "Ask for the claim to be stated in plain language. If someone cannot explain their argument simply, they may not fully understand it themselves. Complexity is not a substitute for clarity.",
  },
  {
    id: "scientist-mg-method-worship",
    name: "Method Worship",
    description:
      "Elevating the scientific method to an infallible epistemological standard — treating it as the ONLY way to know truth. This excludes historical evidence, logical deduction, moral reasoning, and eyewitness testimony by definition.",
    example:
      "\"If you can't test it in a lab, it's not real knowledge. Faith is just a word for believing things without evidence.\"",
    detectionTip:
      "Point out that the claim 'only science gives truth' is itself not a scientific claim — it cannot be tested in a lab. It is a philosophical commitment (scientism), not a scientific finding. Science is one powerful tool among several.",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "scientist-fallacy-appeal-to-authority",
    name: "Appeal to Authority",
    definition:
      "Citing scientific consensus or prestigious institutions as proof rather than engaging with the actual evidence. The authority of the claim substitutes for the strength of the argument.",
    example:
      "\"NASA says the universe is 13.8 billion years old. Are you going to argue with NASA?\" — This is an appeal to institutional prestige, not to specific evidence that can be examined.",
    counterMove:
      "Acknowledge the expertise respectfully but redirect to the evidence itself. 'I respect NASA's work. Can we examine the specific assumptions behind that measurement?' Authority tells you what to investigate, not what to conclude.",
  },
  {
    id: "scientist-fallacy-false-dichotomy",
    name: "False Dichotomy: Science vs. Faith",
    definition:
      "Framing the debate as a binary choice between accepting all scientific claims uncritically or being an anti-intellectual science-denier. No middle ground is permitted.",
    example:
      "\"You either accept the science or you're living in the Dark Ages.\" — This ignores the possibility of engaging science critically while holding biblical convictions.",
    counterMove:
      "Show that many foundational scientists were believers (Newton, Faraday, Maxwell, Pasteur). Science and faith address different questions: science asks HOW; theology asks WHY and WHO. A Christian can practice excellent science while holding a biblical worldview.",
  },
  {
    id: "scientist-fallacy-equivocation-science",
    name: "Equivocation on 'Science'",
    definition:
      "Switching between 'science' as operational/experimental methodology and 'science' as historical/reconstructive interpretation without acknowledging the difference. Observational science is repeatable; historical science is interpretive.",
    example:
      "\"You use the products of science every day — your phone, your medicine. So how can you reject what science says about origins?\" — This equates operational science (technology) with historical science (origins reconstruction).",
    counterMove:
      "Distinguish operational science (repeatable, testable, present-tense) from historical science (interpretive, based on assumptions about the unobserved past). We fully affirm operational science. We question whether unobserved past events can be reconstructed with the same certainty as repeatable experiments.",
  },
  {
    id: "scientist-fallacy-god-of-gaps",
    name: "God-of-the-Gaps Accusation",
    definition:
      "Dismissing any theistic argument by labeling it a 'God of the gaps' — claiming that invoking God is merely filling ignorance with superstition rather than engaging the positive evidence for design.",
    example:
      "\"You can't explain irreducible complexity, so you just say 'God did it.' That's not an explanation, it's a surrender.\"",
    counterMove:
      "Distinguish between argument from ignorance and inference to best explanation. Design arguments are based on what we DO know about information, complexity, and causation — not on what we don't know. We infer design because we know that specified complexity always comes from intelligent agents in every other domain of human experience.",
  },
];

// ── Counter-Strategies ───────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "evolution",
    title: "Creation After Their Kind — The Limits of Darwinism",
    sdaPosition:
      "SDAs affirm micro-evolution (adaptation within kinds) while questioning macro-evolution (new body plans from unguided processes). Genesis 1 records creation 'after their kind' — a framework that predicts variation within boundaries, precisely what we observe.",
    keyScriptures: [
      "Genesis 1:11-12, 21, 24-25",
      "Psalm 139:14",
      "Romans 1:20",
      "Hebrews 11:3",
      "Job 38-39",
    ],
    counterArguments: [
      "Distinguish micro from macro evolution — one is observed, the other inferred",
      "The Cambrian Explosion shows sudden appearance, not gradualism",
      "Information theory: random mutation does not generate specified complexity",
      "Irreducible complexity in biological systems challenges unguided assembly",
    ],
    closingStatement:
      "True science examines evidence without metaphysical prejudice. When we do, creation 'after their kind' fits the data better than unguided macro-evolution. The heavens declare the glory of God — and so does the cell.",
  },
  {
    subjectId: "age-of-earth",
    title: "Questioning Deep Time — Assumptions Behind the Clock",
    sdaPosition:
      "SDAs hold to a recent creation as described in Genesis 1-2, supported by biblical chronology. Radiometric dating depends on untestable assumptions about initial conditions, decay rate constancy, and system closure.",
    keyScriptures: [
      "Genesis 1:1-2:3",
      "Exodus 20:11",
      "Matthew 19:4",
      "2 Peter 3:3-6",
      "Psalm 33:6, 9",
    ],
    counterArguments: [
      "Radiometric dating assumes constant decay rates — research suggests variability",
      "Carbon-14 in diamonds and coal challenges deep-time claims",
      "Helium retention in zircons indicates thousands, not billions, of years",
      "Biblical chronology (Genesis 5, 11) provides a coherent alternative framework",
    ],
    closingStatement:
      "The question is not whether we trust science but which assumptions we trust. When we examine the assumptions behind deep time, the case is far less settled than textbooks suggest.",
  },
  {
    subjectId: "fossil-record",
    title: "Reading the Rocks — Catastrophism vs. Gradualism",
    sdaPosition:
      "SDAs interpret the fossil record through the lens of Genesis 6-8 — a global catastrophe that rapidly buried organisms in sedimentary layers. This explains fossil graveyards, polystrate fossils, and continent-wide formations.",
    keyScriptures: [
      "Genesis 7:11-12, 17-24",
      "Genesis 8:1-3",
      "2 Peter 3:5-6",
      "Matthew 24:37-39",
      "Psalm 104:6-9",
    ],
    counterArguments: [
      "Fossil graveyards with mixed species indicate catastrophic burial",
      "Polystrate fossils spanning multiple strata require rapid deposition",
      "Soft tissue in dinosaur bones challenges millions-of-years timelines",
      "The geological column is an idealized composite, not a single observable sequence",
    ],
    closingStatement:
      "The rocks don't speak for themselves — they are interpreted. When read through a catastrophist lens, the evidence is consistent with the biblical Flood.",
  },
  {
    subjectId: "cosmology",
    title: "The Cosmos Declares — Fine-Tuning and First Cause",
    sdaPosition:
      "The universe's beginning and fine-tuning point powerfully to a Creator. The cosmological argument (Kalam) and the teleological argument (fine-tuning) provide robust rational grounds for theism.",
    keyScriptures: [
      "Genesis 1:1",
      "Psalm 19:1-4",
      "Isaiah 40:26",
      "Hebrews 11:3",
      "Romans 1:20",
    ],
    counterArguments: [
      "The Kalam argument: whatever begins to exist has a cause; the universe began; therefore it has a cause",
      "Fine-tuning of 30+ constants to life-permitting values defies chance",
      "The multiverse hypothesis is unfalsifiable and violates Occam's Razor",
      "Science describes HOW the universe operates; it cannot address WHY it exists",
    ],
    closingStatement:
      "The heavens declare the glory of God. The more we learn about the cosmos, the louder that declaration becomes.",
  },
  {
    subjectId: "neuroscience",
    title: "The Soul Question — Beyond the Brain",
    sdaPosition:
      "SDAs hold a holistic anthropology: the soul (nephesh) is the whole living person (Genesis 2:7), not a disembodied ghost. Consciousness is deeply integrated with the body, but the hard problem of consciousness points beyond materialism.",
    keyScriptures: [
      "Genesis 2:7",
      "Ecclesiastes 12:7",
      "John 11:11-14",
      "1 Thessalonians 4:13-16",
      "Ecclesiastes 9:5-6",
    ],
    counterArguments: [
      "Correlation between brain states and consciousness does not equal causation",
      "The hard problem of consciousness: subjective experience cannot be reduced to physics",
      "Information and meaning are not physical properties — they require an explanation beyond matter",
      "SDA holistic anthropology avoids the Cartesian dualism that neuroscience rightly critiques",
    ],
    closingStatement:
      "The Bible never taught that the soul is a ghost floating inside the body. It taught that God breathed life into dust and man became a living soul. Neuroscience confirms the integration; it does not explain the origin.",
  },
  {
    subjectId: "flood-geology",
    title: "The Flood as Geological Reality",
    sdaPosition:
      "SDAs affirm the global Flood of Genesis 6-8 as a historical event with massive geological consequences. Catastrophic plate tectonics, continent-wide sediment layers, and marine fossils on mountaintops are consistent with this framework.",
    keyScriptures: [
      "Genesis 6:17",
      "Genesis 7:11, 19-20",
      "Genesis 8:1-4",
      "2 Peter 3:5-7",
      "Matthew 24:37-39",
    ],
    counterArguments: [
      "Continent-wide sediment layers require continent-wide water transport",
      "Marine fossils on every mountain range indicate former submersion",
      "Catastrophic plate tectonics models provide a mechanism for rapid geological change",
      "Genesis 7:11 describes tectonic ('fountains of the great deep') and atmospheric mechanisms",
    ],
    closingStatement:
      "Christ Himself affirmed the Flood as historical reality. The geological evidence, when freed from uniformitarian assumptions, testifies to the same.",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  {
    id: "scientist-mod-evolution",
    subjectId: "evolution",
    title: "Creation vs. Evolution — The Evidence Examined",
    doctrineBrief:
      "SDAs affirm a literal, recent, six-day creation as described in Genesis 1-2 and affirmed by the Fourth Commandment (Exodus 20:8-11). This is Fundamental Belief #6.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: steelmanArguments[0].hiddenAssumptions,
    mindGames: [mindGames[0], mindGames[1]],
    fallacies: [fallacies[2], fallacies[3]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "scientist",
    debriefPrompt:
      "Evaluate your engagement. Could you distinguish micro from macro evolution clearly? Did you present the Cambrian Explosion and information theory as positive evidence for creation rather than merely poking holes in evolution? Were you able to articulate the difference between operational and historical science?",
  },
  {
    id: "scientist-mod-age",
    subjectId: "age-of-earth",
    title: "Deep Time — Examining the Assumptions",
    doctrineBrief:
      "The Bible presents creation as recent, with genealogies in Genesis 5 and 11 providing chronological anchors. Exodus 20:11 roots the Sabbath in a literal creation week.",
    steelmanArguments: [steelmanArguments[1]],
    hiddenAssumptions: steelmanArguments[1].hiddenAssumptions,
    mindGames: [mindGames[3], mindGames[2]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "scientist",
    debriefPrompt:
      "Did you identify the three assumptions behind radiometric dating? Could you cite specific anomalies (C-14 in diamonds, helium retention, soft tissue)? Did you connect the Sabbath commandment to the creation week framework?",
  },
  {
    id: "scientist-mod-fossils",
    subjectId: "fossil-record",
    title: "Reading the Rocks — Flood Geology in Action",
    doctrineBrief:
      "The Genesis Flood (chs. 6-8) provides a catastrophist framework for interpreting the fossil record. SDAs affirm the Flood as historical, as confirmed by Christ (Matthew 24:37-39).",
    steelmanArguments: [steelmanArguments[2]],
    hiddenAssumptions: steelmanArguments[2].hiddenAssumptions,
    mindGames: [mindGames[0], mindGames[2]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "scientist",
    debriefPrompt:
      "Could you present the Flood model as a positive explanation rather than merely denying evolution? Did you cite specific geological features (polystrate fossils, continental sediment layers, soft tissue preservation)? Were you able to handle the biogeography objection?",
  },
  {
    id: "scientist-mod-cosmology",
    subjectId: "cosmology",
    title: "The Cosmos Declares — First Cause and Fine-Tuning",
    doctrineBrief:
      "Genesis 1:1 — 'In the beginning God created the heaven and the earth.' Psalm 19:1 — 'The heavens declare the glory of God.' The cosmological and fine-tuning arguments are among the strongest rational supports for theism.",
    steelmanArguments: [steelmanArguments[3]],
    hiddenAssumptions: steelmanArguments[3].hiddenAssumptions,
    mindGames: [mindGames[3], mindGames[1]],
    fallacies: [fallacies[0], fallacies[1]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "scientist",
    debriefPrompt:
      "Could you walk through the Kalam argument step by step? Did you present fine-tuning data with specific constants? Were you able to show that the multiverse hypothesis is philosophical speculation, not empirical science?",
  },
  {
    id: "scientist-mod-neuro",
    subjectId: "neuroscience",
    title: "Beyond the Brain — Consciousness and the Soul",
    doctrineBrief:
      "SDAs hold a unique holistic anthropology: the soul is the whole living person (Genesis 2:7), not a disembodied spirit. Death is sleep (John 11:11-14). This distinguishes SDA theology from both dualism and materialism.",
    steelmanArguments: [steelmanArguments[4]],
    hiddenAssumptions: steelmanArguments[4].hiddenAssumptions,
    mindGames: [mindGames[2], mindGames[3]],
    fallacies: [fallacies[2], fallacies[3]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "scientist",
    debriefPrompt:
      "Did you avoid the trap of defending Cartesian dualism? Could you explain the SDA holistic view of the soul from Genesis 2:7? Were you able to articulate the hard problem of consciousness as a challenge to materialism?",
  },
  {
    id: "scientist-mod-flood",
    subjectId: "flood-geology",
    title: "The Flood — Geology's Greatest Witness",
    doctrineBrief:
      "The global Flood of Genesis 6-8 is central to SDA understanding of earth history. It connects creation, judgment, and redemption — foreshadowing the final judgment by fire (2 Peter 3:5-7).",
    steelmanArguments: [steelmanArguments[5]],
    hiddenAssumptions: steelmanArguments[5].hiddenAssumptions,
    mindGames: [mindGames[0], mindGames[1]],
    fallacies: [fallacies[0], fallacies[1]],
    counterStrategy: counterStrategies[5],
    debateSimLink: "scientist",
    debriefPrompt:
      "Could you present catastrophic plate tectonics as a scientific model, not just a faith claim? Did you connect the Flood to the prophetic structure of 2 Peter 3 (creation by water, destruction by water, future destruction by fire)? Were you able to handle the 'where did the water go?' question?",
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const scientistTraining: AATSAvatarTraining = {
  avatarId: "scientist",
  avatarName: "The Scientist",
  emoji: "🔬",
  color: "border-emerald-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
