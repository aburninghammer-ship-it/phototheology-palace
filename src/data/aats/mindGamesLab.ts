// ============================================================================
// Mind Games & Fallacy Detection Lab
// Universal module for the Apologetics Avatar Training System (AATS)
// ============================================================================

import type { AATSMindGame, AATSFallacy } from "../aatsTrainingData";

// ── Detection Exercise Interface ────────────────────────────────────────────

export interface DetectionExercise {
  id: string;
  scenario: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  type: "mind-game" | "fallacy";
  relatedId: string; // ID of the mind game or fallacy
}

// ============================================================================
// UNIVERSAL MIND GAMES
// Psychological tactics used in debates to bypass rational discourse
// ============================================================================

export const UNIVERSAL_MIND_GAMES: AATSMindGame[] = [
  {
    id: "mg-gish-gallop",
    name: "Gish Gallop",
    description:
      "Overwhelming an opponent with a rapid-fire barrage of arguments, claims, and questions delivered so quickly that none of them can be properly examined or rebutted. Named after creationist Duane Gish, the strategy relies on volume over substance, forcing the defender to either ignore most points (appearing evasive) or spend all their time catching up (never making their own case).",
    example:
      "An atheist fires off: 'What about the crusades, the inquisition, slavery justified by the Bible, contradictions in Genesis, the problem of evil, who made God, why does God need worship, what about dinosaurs, and the age of the universe?' --- all in a single breath, leaving no time for any single point to be addressed.",
    detectionTip:
      "Count the claims. If more than three unrelated assertions are packed into a single turn with no pause for response, you are being Gish Galloped. Slow the conversation down: pick the strongest claim and address it thoroughly. Say, 'You raised about ten points --- let's take the strongest one and examine it carefully.'",
  },
  {
    id: "mg-emotional-hijack",
    name: "Emotional Hijack",
    description:
      "Deliberately triggering strong emotions --- anger, fear, guilt, shame, or outrage --- to short-circuit rational thinking. Once the target is emotionally reactive, they lose the ability to think clearly and often say things they later regret, giving the attacker ammunition.",
    example:
      "A skeptic says: 'So you worship a God who sends babies to hell and commands genocide? What kind of monster do you follow?' The goal is not to understand your theology but to provoke an emotional outburst or stammering defense.",
    detectionTip:
      "Notice your body: racing heart, clenched jaw, heat rising. These are signals that someone is targeting your emotions, not your arguments. Take a breath. Respond to the intellectual content, not the emotional bait. 'I can see this is an important question to you. Let me address what Scripture actually teaches about God's justice and mercy.'",
  },
  {
    id: "mg-burden-shifting",
    name: "Burden Shifting",
    description:
      "Demanding that you prove your position while offering zero evidence for their own claims. The person making a positive claim bears the burden of proof, but burden-shifters try to put you permanently on the defensive so they never have to justify their own worldview assumptions.",
    example:
      "An atheist says: 'Prove God exists. Prove the Bible is reliable. Prove miracles are possible.' When you present evidence, they dismiss it and demand more, yet they never demonstrate that naturalism is true or that the universe can come from nothing without a cause.",
    detectionTip:
      "When you notice you are doing all the defending and they are doing all the demanding, pause and redirect: 'I've offered evidence for my position. Now help me understand --- what evidence grounds your belief that the universe is self-caused and that consciousness arises from matter without guidance?'",
  },
  {
    id: "mg-mockery-ridicule",
    name: "Mockery & Ridicule",
    description:
      "Using sarcasm, laughter, eye-rolls, condescending tone, or belittling humor to make a position appear absurd without engaging its substance. The audience laughs, and the position is dismissed not because it was refuted but because it was made to seem ridiculous.",
    example:
      "A critic says: 'Oh, you believe a talking snake convinced a woman made from a rib to eat magic fruit? And you want me to take you seriously?' No argument is presented --- just ridicule designed to delegitimize.",
    detectionTip:
      "Humor is not an argument. When someone mocks rather than engages, name it calmly: 'I notice you're using humor rather than addressing the argument. I'm happy to discuss the literary genre and theological meaning of Genesis if you're willing to engage seriously.'",
  },
  {
    id: "mg-appeal-to-consensus",
    name: "Appeal to Consensus",
    description:
      "Invoking the agreement of unnamed scholars, experts, or 'most people' to pressure you into capitulating. The implication is that disagreeing with the majority makes you ignorant or fringe, even though truth is not determined by popular vote.",
    example:
      "A liberal theologian says: 'Most biblical scholars today agree that Daniel was written in the 2nd century BCE and is not prophecy. You're going against the scholarly consensus.' No specific evidence is cited --- just the weight of unnamed majority opinion.",
    detectionTip:
      "Ask for specifics: 'Which scholars? What is their evidence? And is there a methodological assumption driving that consensus?' Consensus has been wrong before (e.g., the scholarly consensus that denied the historicity of the Hittites until archaeology proved otherwise).",
  },
  {
    id: "mg-poisoning-the-well",
    name: "Poisoning the Well",
    description:
      "Attaching negative labels to you or your group before the debate even begins, so that anything you say is filtered through that prejudice. By the time you speak, the audience already sees you as a cult member, a fundamentalist, or brainwashed --- and your arguments are pre-dismissed.",
    example:
      "Before you can present any evidence, your opponent says: 'Just so everyone knows, Seventh-day Adventists are a cult founded by a false prophet, and they don't even believe in the real Jesus.' Now everything you say is heard through that distortion.",
    detectionTip:
      "Address the label briefly and redirect to substance: 'I understand there are misconceptions about Adventists. Rather than debating labels, let's examine the actual biblical evidence. I believe the text can speak for itself.' Do not spend the entire debate defending against the label --- that is exactly what they want.",
  },
  {
    id: "mg-moving-goalposts",
    name: "Moving the Goalposts",
    description:
      "When you meet a challenge or provide the evidence demanded, the opponent changes the criteria for what would count as acceptable evidence. No amount of proof is ever enough because the standard keeps shifting.",
    example:
      "Critic: 'Show me a prophecy that was clearly written before the event.' You present Daniel 2 and the Dead Sea Scrolls dating. Critic: 'Well, that's not specific enough.' You present Daniel 8-9 with historical fulfillment. Critic: 'Well, those could be interpreted differently.' You present Isaiah 53. Critic: 'That's about Israel, not Jesus.' The goalposts never stop moving.",
    detectionTip:
      "Before presenting evidence, establish criteria: 'What would you accept as evidence of fulfilled prophecy? Let's agree on the standard before I present the case.' If they refuse to commit to any standard, point out that their position is unfalsifiable and therefore not a rational objection.",
  },
  {
    id: "mg-loaded-questions",
    name: "Loaded Questions",
    description:
      "Embedding an unproven or false assumption inside a question so that any direct answer appears to concede the hidden premise. The question is designed so that you lose whether you answer yes or no.",
    example:
      "'Why does your church teach fear-based salvation?' This presupposes that the SDA Church teaches fear-based salvation. Answering 'We don't' still leaves the impression planted. 'Have you stopped following Ellen White blindly yet?' presupposes blind following.",
    detectionTip:
      "Identify the hidden premise and challenge it directly before answering: 'That question contains an assumption I don't accept. Our church does not teach fear-based salvation. Let me explain what we actually believe about assurance and the gospel, and then you can tell me if you still see a problem.'",
  },
  {
    id: "mg-false-equivalence",
    name: "False Equivalence",
    description:
      "Treating two things as if they are the same when they differ in critical ways. This is used to neutralize your truth claims by equating biblical Christianity with mythology, superstition, or other religions, as though all faith claims are interchangeable.",
    example:
      "'Believing in the God of the Bible is the same as believing in Zeus, Thor, or the Flying Spaghetti Monster. You're an atheist too --- you just believe in one fewer god than I do.' This ignores the fundamental philosophical and evidential differences between a necessary, self-existent Creator and contingent mythological beings.",
    detectionTip:
      "Point out the disanalogy: 'Zeus and Thor are contingent beings within the universe --- part of the created order in their own mythologies. The God of the Bible is the necessary, uncaused, self-existent ground of all reality. These are categorically different claims, and equating them ignores that distinction.'",
  },
  {
    id: "mg-gaslighting",
    name: "Gaslighting",
    description:
      "Making you doubt your own beliefs, experiences, or reasoning by telling you that you don't really believe what you say, that your position is outdated, or that no reasonable person holds your view. The goal is to erode your confidence so you abandon your position out of self-doubt rather than evidence.",
    example:
      "'You don't actually believe the earth was created in six literal days, do you? No educated person in the 21st century thinks that. Deep down, you know it's just mythology.' Or: 'Nobody really believes in a literal second coming anymore --- that's medieval thinking.'",
    detectionTip:
      "Recognize that someone telling you what you believe is a manipulation tactic, not an argument. Reaffirm your position clearly: 'I appreciate your perspective, but I can assure you I've examined the evidence carefully and I do hold this conviction. Rather than telling me what I believe, let's discuss the reasons behind our respective positions.'",
  },
  {
    id: "mg-tone-policing",
    name: "Tone Policing",
    description:
      "Dismissing your argument by criticizing the way you express it rather than addressing its content. If you speak with conviction, you're 'too aggressive.' If you cite Scripture frequently, you're 'Bible-thumping.' The tone critique replaces substantive engagement.",
    example:
      "'Wow, you're really passionate about this. Don't you think you should calm down before we can have a rational conversation?' Or: 'You sound like a preacher, not a debater. Can you just talk normally?' The substance of your argument is never addressed.",
    detectionTip:
      "Acknowledge the observation briefly and redirect: 'I am passionate about truth, and I don't think that disqualifies the argument. Let's focus on the substance of what I said. Do you have a response to the evidence I presented?'",
  },
  {
    id: "mg-stacking-assumptions",
    name: "Stacking Assumptions",
    description:
      "Burying multiple unproven premises inside a single complex statement or question, so that engaging with the surface-level point forces you to implicitly accept the hidden assumptions underneath. By the time you realize the foundation is flawed, the conversation has moved on.",
    example:
      "'Since we know the Bible was written by men with political agendas, redacted multiple times, and reflects the limited scientific understanding of its era, why do you treat it as authoritative?' Three major assumptions are stacked: purely human authorship, politically motivated redaction, and scientific irrelevance --- none of which have been established.",
    detectionTip:
      "Unpack the layers: 'That statement contains several assumptions, each of which needs its own evidence. Let's take them one at a time. First, what is your evidence that the biblical authors were motivated by political agendas rather than genuine conviction and divine guidance?'",
  },
];

// ============================================================================
// UNIVERSAL FALLACIES
// Logical errors in reasoning that undermine the validity of an argument
// ============================================================================

export const UNIVERSAL_FALLACIES: AATSFallacy[] = [
  {
    id: "fl-strawman",
    name: "Strawman",
    definition:
      "Misrepresenting or oversimplifying an opponent's argument to make it easier to attack. Instead of engaging the actual position, the critic constructs a weaker, distorted version and refutes that instead.",
    example:
      "SDA believer says: 'We believe the Sabbath is still the day God set apart at creation.' Critic responds: 'Oh, so you think keeping Saturday saves you? That's legalism!' The actual argument about the creation Sabbath is replaced with a caricature about earning salvation.",
    counterMove:
      "Restate your actual position clearly and firmly: 'That's not what I said. I didn't claim Sabbath-keeping saves anyone. I said the Sabbath was established at creation as a gift, not at Sinai as a burden. Salvation is by grace through faith. Now, would you like to address my actual point about the Sabbath's origin?'",
  },
  {
    id: "fl-red-herring",
    name: "Red Herring",
    definition:
      "Introducing an irrelevant topic or issue to divert attention away from the original argument. The conversation is steered to a different subject, often without the audience noticing the switch.",
    example:
      "You present evidence for the seventh-day Sabbath from Genesis 2, Exodus 20, Isaiah 58, and the Gospels. Your opponent responds: 'Well, what about all the people who never heard about the Sabbath? Are they all lost?' The soteriological question is valid but irrelevant to the exegetical argument about which day is the Sabbath.",
    counterMove:
      "Name the redirect and return to the topic: 'That's an important question, and I'm happy to address it later. But right now we're discussing what Scripture teaches about the Sabbath day. Can you respond to the texts I cited before we move to a different subject?'",
  },
  {
    id: "fl-circular-reasoning",
    name: "Circular Reasoning",
    definition:
      "Using the conclusion of an argument as one of its premises, so the argument assumes the very thing it is trying to prove. Also known as begging the question. The reasoning goes in a circle and never actually provides independent evidence.",
    example:
      "'The Bible is God's Word because it says so, and we can trust what it says because it's God's Word.' While Christians do believe the Bible is self-authenticating, an apologetics argument must also include external corroboration, fulfilled prophecy, archaeological evidence, and philosophical reasoning to avoid circularity.",
    counterMove:
      "Point out the circle and request independent evidence: 'You're assuming what you're trying to prove. Can you provide evidence for your conclusion that doesn't depend on your conclusion already being true? For example, what external data supports your claim?'",
  },
  {
    id: "fl-ad-hominem",
    name: "Ad Hominem",
    definition:
      "Attacking the character, motives, background, or personal attributes of the person making the argument rather than addressing the argument itself. The person is discredited so the argument is dismissed by association.",
    example:
      "'You're an Adventist --- you follow Ellen White, who had head trauma as a child. Why should I listen to anything from a brain-damaged prophet's followers?' The argument about, say, the state of the dead or the sanctuary is never engaged. The person is attacked instead.",
    counterMove:
      "Separate the person from the argument: 'My personal background is irrelevant to whether the argument is sound. Can you address the biblical evidence I presented rather than my religious affiliation? Truth is true regardless of who speaks it.'",
  },
  {
    id: "fl-false-dilemma",
    name: "False Dilemma",
    definition:
      "Presenting only two options as if they are the only possibilities when, in fact, other alternatives exist. This artificially constrains the discussion and forces a choice between extremes.",
    example:
      "'Either the Bible is a perfect science textbook with no literary devices, or it's just a collection of myths. Which is it?' This ignores the possibility that the Bible is divinely inspired revelation that uses various literary genres --- poetry, prophecy, narrative, apocalyptic --- while remaining historically and theologically reliable.",
    counterMove:
      "Introduce the missing options: 'Those aren't the only two choices. The Bible can be divinely inspired and authoritative while also employing literary genres, figurative language, and progressive revelation. Let me explain the view I actually hold rather than choosing between two extremes I don't accept.'",
  },
  {
    id: "fl-appeal-to-authority",
    name: "Appeal to Authority",
    definition:
      "Citing an authority figure, institution, or expert as definitive proof of a claim without providing the actual evidence or reasoning behind it. While expert testimony can be valuable, it becomes fallacious when the authority is treated as infallible or is cited outside their area of expertise.",
    example:
      "'Dr. Bart Ehrman, a world-renowned New Testament scholar, says the Bible is full of contradictions. He has a PhD from Princeton. Case closed.' Ehrman's credentials are real, but his conclusions must be evaluated on the merits of his arguments, not simply accepted because of his title.",
    counterMove:
      "Distinguish credentials from arguments: 'I respect Dr. Ehrman's scholarship, but credentials don't settle debates --- arguments do. Other scholars with equal or greater credentials disagree with him. Can we examine the specific evidence for these alleged contradictions rather than settling the matter by credential comparison?'",
  },
  {
    id: "fl-slippery-slope",
    name: "Slippery Slope",
    definition:
      "Claiming that one action or belief will inevitably lead to a chain of increasingly extreme consequences, without demonstrating the causal links between each step. The argument leaps from a reasonable position to an absurd outcome.",
    example:
      "'If you keep the Sabbath, next you'll be keeping all 613 laws. Then you'll be sacrificing animals. Then you'll be stoning people for picking up sticks. Where does it end?' Each step in the chain is asserted without evidence that one leads to the next.",
    counterMove:
      "Demand the causal mechanism: 'Can you show me the logical connection between honoring the Sabbath and sacrificing animals? The New Testament itself distinguishes between the moral law and the ceremonial system. You're asserting a chain reaction without demonstrating any of the links.'",
  },
  {
    id: "fl-tu-quoque",
    name: "Tu Quoque",
    definition:
      "Responding to an accusation or argument by pointing out that the accuser does the same thing (or something similar), rather than addressing the substance of the charge. 'You do it too' is a deflection, not a defense.",
    example:
      "You point out that Sunday worship has no biblical command. The critic responds: 'Well, you Adventists changed some of Ellen White's writings too, so you're no different from the Catholic Church changing the Sabbath.' Whether or not the claim about Ellen White is accurate, it does not address the original argument about the Sabbath.",
    counterMove:
      "Acknowledge the deflection and return to the point: 'Even if your claim were true, it wouldn't change what the Bible says about the Sabbath. Let's stay on topic. Can you show me a biblical command to worship on Sunday? That was my original question.'",
  },
  {
    id: "fl-equivocation",
    name: "Equivocation",
    definition:
      "Using a word or phrase with multiple meanings in different parts of the same argument, switching between meanings to create an illusion of logical connection. The argument appears valid only because the same word is being used in two different senses.",
    example:
      "'The Bible says we are saved by faith, not works. Keeping the Sabbath is a work. Therefore, keeping the Sabbath contradicts salvation by faith.' Here, 'works' is equivocated --- Paul's 'works of the law' (ceremonial boundary markers) is conflated with 'obedient response to God's commands.' James says faith without works is dead (James 2:26).",
    counterMove:
      "Define terms precisely: 'You're using the word \"works\" in two different senses. Paul is talking about ceremonial works of the law as a means of earning righteousness. Sabbath observance as a loving response to God's grace is a completely different category. Let's define our terms before we proceed.'",
  },
  {
    id: "fl-hasty-generalization",
    name: "Hasty Generalization",
    definition:
      "Drawing a broad, sweeping conclusion from a small, unrepresentative, or insufficient sample of evidence. A few examples are treated as proof of a universal pattern.",
    example:
      "'I met two Adventists who were judgmental about food. Your whole church is a legalistic food cult.' Two individuals are used to characterize an entire global denomination of over 20 million members with diverse perspectives.",
    counterMove:
      "Challenge the sample size: 'Two people do not represent 20 million. I could find judgmental individuals in any group. Would you want your entire worldview judged by the worst behavior of two random people who share it? Let's discuss the actual teachings rather than anecdotal experiences.'",
  },
  {
    id: "fl-post-hoc",
    name: "Post Hoc Ergo Propter Hoc",
    definition:
      "Assuming that because event B followed event A, A must have caused B. Temporal sequence is confused with causal connection. Just because one thing happened after another does not mean the first caused the second.",
    example:
      "'The early church started meeting on Sunday, and Christianity grew rapidly. Therefore, Sunday worship is what God blesses.' The growth of Christianity had many factors --- the resurrection, the Holy Spirit, apostolic preaching, Roman roads --- and attributing it to a day of worship is a causal leap.",
    counterMove:
      "Distinguish correlation from causation: 'The fact that two things happened in sequence doesn't prove one caused the other. Christianity grew because of the power of the gospel and the Holy Spirit, not because of a particular day choice. Can you provide direct biblical evidence that God commanded Sunday observance?'",
  },
  {
    id: "fl-composition-division",
    name: "Composition/Division",
    definition:
      "Assuming that what is true of the parts must be true of the whole (composition), or that what is true of the whole must be true of each part (division). Properties do not automatically transfer between parts and wholes.",
    example:
      "Composition: 'Some Old Testament laws are no longer binding (e.g., ceremonial sacrifices). Therefore, ALL Old Testament laws are no longer binding --- including the Sabbath and the Ten Commandments.' Division: 'Christians are called to freedom. Therefore, individual Christians are free to ignore any specific commandment they want.'",
    counterMove:
      "Distinguish the parts from the whole: 'You're assuming that what applies to one category of law applies to all categories. The Bible itself distinguishes between ceremonial, civil, and moral law. The ceremonial system found fulfillment in Christ, but the moral law --- including the Sabbath commandment within the Decalogue --- reflects God's eternal character.'",
  },
  {
    id: "fl-appeal-to-tradition",
    name: "Appeal to Tradition",
    definition:
      "Arguing that something is correct, good, or justified simply because it has been done that way for a long time. The age of a practice is treated as evidence of its truth or legitimacy, ignoring the possibility that a long-standing tradition could be wrong.",
    example:
      "'Christians have worshipped on Sunday for nearly 2,000 years. You can't just come along now and say everyone has been wrong.' The length of a tradition does not establish its biblical basis. Many traditions in church history (indulgences, papal infallibility, infant baptism by immersion) were later challenged by Scripture.",
    counterMove:
      "Point to Scripture over tradition: 'Longevity does not equal truth. The Reformers' principle was Sola Scriptura --- Scripture alone as the ultimate authority. If a tradition contradicts Scripture, the tradition must yield, no matter how old it is. Can we examine what the Bible actually says rather than appealing to historical practice?'",
  },
  {
    id: "fl-no-true-scotsman",
    name: "No True Scotsman",
    definition:
      "Protecting a universal claim from counterexamples by retroactively redefining the group to exclude any member who contradicts the claim. Instead of accepting the counterexample, the definition is narrowed to make the original claim unfalsifiable.",
    example:
      "Claim: 'No real Christian keeps the Old Testament Sabbath.' You cite early Christians, Ethiopian Christians, and many Protestant groups who keep the seventh-day Sabbath. Response: 'Well, those aren't real Christians --- they're Judaizers.' The definition of 'real Christian' keeps shifting to exclude counterexamples.",
    counterMove:
      "Expose the moving definition: 'You're redefining \"real Christian\" to exclude anyone who disagrees with you. That makes your claim unfalsifiable --- it's true by definition because you've defined away all the counterevidence. Can we instead discuss what the Bible says a Christian is and what the Bible says about the Sabbath?'",
  },
];

// ============================================================================
// DETECTION EXERCISES
// Realistic apologetics debate scenarios for training discernment
// ============================================================================

export const DETECTION_EXERCISES: DetectionExercise[] = [
  // ── Mind Game Exercises ──────────────────────────────────────────────────

  {
    id: "de-001",
    scenario:
      "An atheist in an online forum says: 'If you believe in God, why not believe in unicorns, leprechauns, the Flying Spaghetti Monster, and invisible pink dragons? They're all equally unsupported by evidence.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "False Equivalence",
    explanation:
      "This equates the concept of a necessary, self-existent, omnipotent Creator God --- supported by cosmological, teleological, and moral arguments --- with fictional creatures that are contingent beings within the universe. The categories are fundamentally different: God is proposed as the uncaused cause of all reality, while unicorns and spaghetti monsters are proposed as entities within the already-existing universe. Equating them ignores these categorical distinctions.",
    type: "mind-game",
    relatedId: "mg-false-equivalence",
  },
  {
    id: "de-002",
    scenario:
      "A Muslim debater says: 'The Bible has over 30,000 textual variants, the canon wasn't settled until the 4th century, the Trinity wasn't formalized until Nicaea, the original manuscripts are lost, and the earliest copies we have are fragments. How can you possibly trust this book?'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Gish Gallop",
    explanation:
      "Five separate historical claims are fired off in rapid succession, each of which requires substantial scholarly engagement. The goal is not to discuss any one of them carefully but to create an overwhelming impression of unreliability. The defender would need hours to address each point properly, which is exactly the trap. The correct response is to slow down, pick the strongest claim, and address it thoroughly while noting that volume of assertions is not the same as strength of argument.",
    type: "mind-game",
    relatedId: "mg-gish-gallop",
  },
  {
    id: "de-003",
    scenario:
      "Before you begin presenting your case for the Sabbath, a Baptist pastor tells the audience: 'My opponent is a Seventh-day Adventist. They follow a false prophet named Ellen White, they're considered a cult by many Christian watchdog organizations, and they deny the finished work of Christ on the cross. Keep that in mind as you listen.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Poisoning the Well",
    explanation:
      "Every claim about you and your church was front-loaded before you could speak, so that the audience now hears every argument you make through a prejudicial filter. Even if your biblical exegesis is sound, the audience has been primed to distrust it. This is a classic well-poisoning tactic: pre-loading negative associations so that the arguments themselves are never fairly evaluated.",
    type: "mind-game",
    relatedId: "mg-poisoning-the-well",
  },
  {
    id: "de-004",
    scenario:
      "You present archaeological evidence for the Bible's historical reliability. A skeptic responds: 'Really? You're going to sit here with a straight face and tell me you believe in a talking donkey, a man living inside a fish, and a woman turning into a pillar of salt? Come on.' The audience laughs.",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Mockery & Ridicule",
    explanation:
      "The skeptic never addresses the archaeological evidence you presented. Instead, they cherry-pick narratives that sound unusual to modern ears and present them in the most mocking way possible. The audience laughter substitutes for intellectual engagement. The evidence you cited is left completely unaddressed while the conversation is hijacked by ridicule.",
    type: "mind-game",
    relatedId: "mg-mockery-ridicule",
  },
  {
    id: "de-005",
    scenario:
      "A progressive Christian says: 'You don't actually believe the earth was created in six literal days, do you? Nobody who has been to college believes that anymore. Maybe in the 1800s, but we've moved past that. Deep down, you probably have doubts too.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Gaslighting",
    explanation:
      "The speaker is attempting to make you doubt your own sincerely held conviction by asserting that you don't really believe it. They're telling you what you think, implying your position is so outdated that no rational person could hold it, and suggesting you secretly agree with them. This is a textbook gaslighting maneuver designed to erode confidence rather than engage evidence.",
    type: "mind-game",
    relatedId: "mg-gaslighting",
  },
  {
    id: "de-006",
    scenario:
      "A Catholic apologist says: 'Show me where the Bible teaches Sola Scriptura.' You cite 2 Timothy 3:16-17, Isaiah 8:20, and Acts 17:11. They respond: 'Those don't prove Sola Scriptura, just that Scripture is useful. Show me where it says Scripture ALONE.' You cite additional passages. They say: 'Those are about reading Scripture, not about it being the only authority. Try again.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Moving the Goalposts",
    explanation:
      "Every time you meet the challenge, the criteria for what would count as acceptable proof shifts. First any passage about Scripture's authority should suffice. Then it has to explicitly say 'alone.' Then even passages about sufficiency are deemed insufficient. The standard keeps rising because the goal is not to evaluate evidence but to create the appearance that no evidence exists.",
    type: "mind-game",
    relatedId: "mg-moving-goalposts",
  },
  {
    id: "de-007",
    scenario:
      "An atheist says during a debate: 'So you worship a God who drowned babies in a flood, commanded genocide of the Canaanites, and allows children to die of cancer every single day. What kind of moral monster do you serve?'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Emotional Hijack",
    explanation:
      "The framing is designed to provoke outrage, defensiveness, or guilt. Words like 'drowned babies,' 'genocide,' and 'children dying of cancer' are emotionally loaded to bypass your rational processing. While these are real theological questions deserving thoughtful answers, the way they are packaged here is meant to trigger an emotional reaction, not to invite careful discussion of theodicy and divine justice.",
    type: "mind-game",
    relatedId: "mg-emotional-hijack",
  },
  {
    id: "de-008",
    scenario:
      "You are presenting evidence for the seventh-day Sabbath. A critic interrupts: 'Why does your church teach fear-based religion? Why do Adventists scare people into keeping Saturday?' You hadn't mentioned anything about fear.",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Loaded Questions",
    explanation:
      "Both questions embed the unproven assumption that the SDA Church teaches 'fear-based religion' and that Adventists 'scare people' into Sabbath-keeping. These premises are smuggled in as though they are established facts. Any direct answer risks implicitly accepting the false framing. The correct response is to challenge the hidden assumption before engaging the question.",
    type: "mind-game",
    relatedId: "mg-loaded-questions",
  },
  {
    id: "de-009",
    scenario:
      "You present a passionate, well-researched case for the state of the dead from Scripture. Your opponent says: 'You seem really worked up about this. Maybe if you calmed down, we could have a civilized discussion. Your intensity makes it hard to take your points seriously.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Tone Policing",
    explanation:
      "Your argument is not addressed at all. Instead, the way you delivered it is criticized. By focusing on your perceived emotional intensity, the opponent avoids having to respond to the substance of your evidence. The implicit message is that passionate delivery disqualifies the argument, which is a way to dismiss content without refuting it.",
    type: "mind-game",
    relatedId: "mg-tone-policing",
  },
  {
    id: "de-010",
    scenario:
      "An atheist says: 'Prove God exists. I mean real evidence --- not the Bible, not personal experience, not philosophy. I want scientific, laboratory-testable evidence only.' You present cosmological arguments. 'That's philosophy, not science.' You present fine-tuning data. 'That's just the anthropic principle.' You present consciousness research. 'That's neuroscience, not proof of God.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Burden Shifting + Moving the Goalposts",
    explanation:
      "Two mind games are stacked: First, the entire burden of proof is placed on you while the atheist offers no evidence for naturalism. Second, every category of evidence you offer is dismissed by a shifting standard. Philosophy doesn't count. Cosmological data doesn't count. The definition of 'real evidence' keeps changing to exclude whatever you present, making the demand unfalsifiable.",
    type: "mind-game",
    relatedId: "mg-burden-shifting",
  },
  {
    id: "de-011",
    scenario:
      "A JW elder says: 'Since we know the soul is not immortal and hellfire is not eternal, and since the early church didn't teach the Trinity, and since Jesus himself said the Father is greater than I, and since the Holy Spirit is never called God directly, it's clear that the Trinity is a pagan doctrine borrowed from Babylon.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Stacking Assumptions",
    explanation:
      "Multiple unproven premises are layered together and presented as established facts: that the soul is not immortal (debatable), that the early church didn't teach the Trinity (historically contested), that John 14:28 disproves the Trinity (ignores the incarnational context), that the Holy Spirit is never called God (Acts 5:3-4 disagrees), and that the Trinity is Babylonian (a claim without credible historical support). Each assumption needs independent verification, but they are stacked to create an illusion of a settled case.",
    type: "mind-game",
    relatedId: "mg-stacking-assumptions",
  },
  {
    id: "de-012",
    scenario:
      "A university professor says: 'Over 90% of biblical scholars agree that the Pentateuch was not written by Moses but by multiple later authors. Are you really going to go against the global academic consensus?'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Appeal to Consensus",
    explanation:
      "The argument rests entirely on the weight of unnamed majority opinion rather than presenting the evidence behind the Documentary Hypothesis. The 90% figure is unverifiable, and even if accurate, scholarly consensus does not determine truth. The consensus once denied the existence of the Hittites, the historicity of Belshazzar, and the antiquity of writing in Moses' era --- all of which were later confirmed by archaeological discoveries.",
    type: "mind-game",
    relatedId: "mg-appeal-to-consensus",
  },

  // ── Fallacy Exercises ────────────────────────────────────────────────────

  {
    id: "de-013",
    scenario:
      "An Evangelical says: 'So you keep the Sabbath? That's works-based salvation. Next you'll be keeping kosher, then circumcision, then you'll be sacrificing animals at the temple. That's the logical end of your legalism.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Slippery Slope + Strawman",
    explanation:
      "Two fallacies are combined: First, a slippery slope asserts that Sabbath-keeping inevitably leads to animal sacrifice, with no causal mechanism linking any of the steps. Second, a strawman misrepresents the SDA position as 'works-based salvation' when Adventists explicitly teach salvation by grace through faith, with Sabbath observance as a loving response, not a means of earning righteousness.",
    type: "fallacy",
    relatedId: "fl-slippery-slope",
  },
  {
    id: "de-014",
    scenario:
      "You cite 1 Thessalonians 4:13-16 and Ecclesiastes 9:5 about the state of the dead. A Pentecostal responds: 'But what about the thief on the cross? Jesus said, \"Today you will be with me in paradise.\" Clearly, people go to heaven immediately when they die.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Red Herring (partial) + False Dilemma",
    explanation:
      "While the thief on the cross passage is relevant to the broader topic, using it here deflects from the specific texts you cited (which explicitly say the dead know nothing and sleep until the resurrection) without addressing them. It also creates a false dilemma: either the thief went to heaven immediately OR the dead sleep --- when the punctuation of Luke 23:43 (where the comma is placed) and the context of Jesus' own statement 'I have not yet ascended to the Father' (John 20:17) reconcile both passages.",
    type: "fallacy",
    relatedId: "fl-red-herring",
  },
  {
    id: "de-015",
    scenario:
      "A Mormon missionary says: 'The Book of Mormon is the word of God because the Holy Spirit confirmed it to me when I prayed about it. And the Holy Spirit is always right because He speaks God's words. So the Book of Mormon is Scripture.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Circular Reasoning",
    explanation:
      "The argument is circular: The Book of Mormon is God's word (conclusion) because the Holy Spirit confirmed it (premise). But the Holy Spirit's confirmation is validated by the assumption that the Book of Mormon accurately describes how the Spirit works (which requires the Book of Mormon to already be God's word). The conclusion is assumed in the premise. External evidence --- historical, archaeological, textual --- would be needed to break the circle.",
    type: "fallacy",
    relatedId: "fl-circular-reasoning",
  },
  {
    id: "de-016",
    scenario:
      "During a discussion about the investigative judgment, a critic says: 'I don't need to address your arguments. Ellen White had temporal lobe epilepsy, and she was just a 19th-century woman with a third-grade education. Why would I trust anything that comes from that source?'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Ad Hominem",
    explanation:
      "The argument about the investigative judgment is completely ignored. Instead, the person behind the argument (Ellen White) is attacked on personal grounds: a medical speculation and educational background. Even if both claims were true, they would not address whether the biblical case for the investigative judgment (Daniel 7-8, Leviticus 16, Hebrews 8-9) is exegetically sound. Arguments must be evaluated on their merits, not dismissed because of the person associated with them.",
    type: "fallacy",
    relatedId: "fl-ad-hominem",
  },
  {
    id: "de-017",
    scenario:
      "A BHI (Black Hebrew Israelite) street preacher says: 'Either you accept that the true Israelites are Black people and follow all the laws of Moses, or you're following a white European version of Christianity that was invented to enslave Africans. There's no middle ground.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "False Dilemma",
    explanation:
      "Only two options are presented when many others exist. One can affirm the diverse ethnic heritage of biblical Israelites, reject racist interpretations of Christianity, acknowledge historical injustices, and still follow Scripture's actual teaching without adopting BHI theology. The claim that Christianity was 'invented to enslave Africans' ignores the African roots of early Christianity (Ethiopian eunuch, church in North Africa, etc.). The binary framing eliminates all nuanced positions.",
    type: "fallacy",
    relatedId: "fl-false-dilemma",
  },
  {
    id: "de-018",
    scenario:
      "A Catholic says: 'St. Augustine, St. Thomas Aquinas, and every Church Father for a thousand years taught that the Church has authority to interpret Scripture. These are the greatest minds in Christian history. The case is closed.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Appeal to Authority",
    explanation:
      "The names of respected historical figures are cited as definitive proof without examining their actual arguments or the biblical basis for their claims. While Augustine and Aquinas were brilliant thinkers, their authority does not settle the question of whether the institutional Church has interpretive authority over Scripture. Even the Church Fathers disagreed with each other on many points. The question is what the Bible itself teaches, not what prominent individuals believed.",
    type: "fallacy",
    relatedId: "fl-appeal-to-authority",
  },
  {
    id: "de-019",
    scenario:
      "You point out that the Catholic Church historically claims to have changed the Sabbath to Sunday. A Catholic apologist responds: 'Well, your church changed some of Ellen White's writings in later editions too. You're in no position to criticize.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Tu Quoque",
    explanation:
      "Instead of addressing the historical claim about the Sabbath change, the apologist deflects by accusing you of a similar (but unrelated) inconsistency. Even if the claim about Ellen White's editorial revisions were true and problematic, it would not affect the historical question of whether the Sabbath was changed by ecclesiastical authority. The original argument is left completely unaddressed.",
    type: "fallacy",
    relatedId: "fl-tu-quoque",
  },
  {
    id: "de-020",
    scenario:
      "An Evangelical says: 'The Bible says we are saved by faith, not by works of the law. Keeping the Sabbath is a work of the law. Therefore, Sabbath-keeping contradicts the gospel of grace.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Equivocation",
    explanation:
      "The word 'works' is used in two different senses. When Paul says we are not saved by 'works of the law' (Galatians 2:16), he is referring to the ceremonial and identity-marker practices (circumcision, food laws, feast days) that Jewish Christians were imposing as requirements for Gentile salvation. Sabbath observance as a response of love and obedience to God's moral law is a different category entirely. James explicitly says 'faith without works is dead' (James 2:26). The fallacy works by equivocating between these distinct meanings of 'works.'",
    type: "fallacy",
    relatedId: "fl-equivocation",
  },
  {
    id: "de-021",
    scenario:
      "A skeptic says: 'I had a friend who was Adventist and she was the most judgmental, self-righteous person I ever met. I also read a blog by an ex-Adventist who described a toxic church community. Clearly, Adventism produces judgmental, toxic people.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Hasty Generalization",
    explanation:
      "Two anecdotal experiences (one personal, one from a blog) are used to characterize an entire global denomination of over 20 million members across virtually every country on earth. Individual negative experiences, while valid and regrettable, cannot logically represent the character of an entire religious movement. Every group has imperfect members. The argument would need a much larger and more representative sample to draw such broad conclusions.",
    type: "fallacy",
    relatedId: "fl-hasty-generalization",
  },
  {
    id: "de-022",
    scenario:
      "A Muslim says: 'Christianity became the dominant world religion after Constantine made it the state religion. The power of the Roman Empire spread Christianity. Therefore, Christianity's growth proves political power, not divine truth.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Post Hoc Ergo Propter Hoc",
    explanation:
      "The argument assumes that because Christianity grew rapidly after Constantine (temporal sequence), Constantine's political endorsement was the cause of that growth. However, Christianity was already the fastest-growing religion in the Roman Empire before Constantine, growing from a few hundred to an estimated 6-10 million in three centuries of persecution. The post-Constantinian growth had multiple factors including theological appeal, social networks, and the Holy Spirit's work --- not merely political backing.",
    type: "fallacy",
    relatedId: "fl-post-hoc",
  },
  {
    id: "de-023",
    scenario:
      "An Evangelical says: 'Some Old Testament laws, like animal sacrifice, are clearly fulfilled in Christ. Therefore, ALL Old Testament laws are abolished --- including the Sabbath, the dietary principles, and even the Ten Commandments as a binding code.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Composition/Division (Composition)",
    explanation:
      "What is true of one part (ceremonial sacrificial laws) is applied to the whole (all Old Testament laws). The Bible itself distinguishes between categories of law: the moral law (Ten Commandments, reflecting God's eternal character), the ceremonial law (sacrificial system, pointing forward to Christ), and the civil law (governance of theocratic Israel). The fulfillment of the ceremonial system in Christ does not logically entail the abolition of the moral law, which Jesus himself said he came not to destroy but to fulfill (Matthew 5:17-19).",
    type: "fallacy",
    relatedId: "fl-composition-division",
  },
  {
    id: "de-024",
    scenario:
      "A Catholic apologist says: 'Christians have worshipped on Sunday since the time of the apostles. The Church has maintained this practice for nearly 2,000 years. Who are you to come along now and say the entire Christian world has been wrong for two millennia?'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Appeal to Tradition",
    explanation:
      "The longevity of Sunday worship is presented as evidence of its legitimacy, but duration does not equal divine authorization. The practice of indulgences lasted for centuries before being challenged. Infant baptism by sprinkling became widespread but was not the original practice. The question is not 'how long has this been done?' but 'what does Scripture command?' The Protestant Reformation was built on the principle that tradition must be tested against Scripture, not the reverse.",
    type: "fallacy",
    relatedId: "fl-appeal-to-tradition",
  },
  {
    id: "de-025",
    scenario:
      "You point out that many early Christians, including Ethiopian and some Eastern churches, kept the seventh-day Sabbath. A critic responds: 'Those weren't real Christians --- they were Judaizers who never fully accepted the gospel of grace. Real Christians have always worshipped on Sunday.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "No True Scotsman",
    explanation:
      "When presented with historical counterexamples of Christians who kept the Sabbath, the critic redefines 'real Christian' to exclude them. This makes the claim unfalsifiable: Sunday worship is universal among Christians, and any Christian who kept the Sabbath was not a 'real' Christian. The definition shifts to preserve the conclusion rather than engaging the historical evidence. Ethiopian Christianity predates many European traditions and cannot be dismissed as 'Judaizing.'",
    type: "fallacy",
    relatedId: "fl-no-true-scotsman",
  },
  {
    id: "de-026",
    scenario:
      "A JW says: 'The Watchtower organization is God's faithful and discreet slave. We know this because the organization has been faithfully dispensing spiritual food. And we know the food is trustworthy because it comes from God's faithful and discreet slave.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Circular Reasoning",
    explanation:
      "The argument is perfectly circular: The Watchtower is God's organization (conclusion) because it produces trustworthy teaching (premise). But the teaching is deemed trustworthy because it comes from God's organization (which is the conclusion). Neither claim is independently established. The argument simply assumes what it is trying to prove and goes in a circle.",
    type: "fallacy",
    relatedId: "fl-circular-reasoning",
  },
  {
    id: "de-027",
    scenario:
      "During a debate about the sanctuary doctrine, a critic suddenly shifts: 'Speaking of 1844, isn't it true that the Millerites sold all their property and stood on hilltops in white robes? How can you take anything from that movement seriously?'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "Red Herring + Ad Hominem",
    explanation:
      "The biblical case for the sanctuary doctrine (Daniel 8:14, Leviticus 16, Hebrews 8-9) is abandoned in favor of a historical anecdote about Millerite behavior. Even the historical claim is partly apocryphal (the white robes story is largely myth). But even if true, the behavior of some early Millerites does not address whether the sanctuary doctrine is biblically sound. The argument shifts from exegesis to historical embarrassment --- a double fallacy of both ad hominem and red herring.",
    type: "fallacy",
    relatedId: "fl-red-herring",
  },
  {
    id: "de-028",
    scenario:
      "A Mormon says: 'Joseph Smith prophesied that the temple would be built in Independence, Missouri in that generation. Now, no true prophet gets everything right --- even biblical prophets made mistakes. So this doesn't disprove his prophetic gift.'",
    question: "What mind game or fallacy is being used here?",
    correctAnswer: "No True Scotsman + Strawman",
    explanation:
      "The definition of a 'true prophet' is retroactively modified to accommodate a failed prediction. Deuteronomy 18:22 is clear that a prophet who speaks a word that does not come to pass has not spoken from the Lord. The claim that 'even biblical prophets made mistakes' is a strawman of the biblical prophetic standard. The goalposts for what counts as a valid prophetic gift are moved to accommodate the failure rather than evaluating the claim by the biblical standard.",
    type: "fallacy",
    relatedId: "fl-no-true-scotsman",
  },
];
