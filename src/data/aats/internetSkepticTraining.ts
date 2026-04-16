// ─── AATS Training Data: The Internet Skeptic ─────────────────────────────────
// Apologetics Avatar Training System — meme-culture skepticism, viral objections,
// surface-level Bible contradictions, and social-media-driven challenges to faith.

import type { AATSAvatarTraining } from "../aatsTrainingData";

/* ── Subjects ────────────────────────────────────────────────────────────── */

const subjects = [
  {
    id: "meme-based-objections",
    title: "Meme-Based Objections",
    description:
      "Viral images, one-liners, and infographics that reduce complex theological topics to dismissive punchlines — designed to be shared, not studied.",
  },
  {
    id: "gotcha-questions",
    title: "Gotcha Questions",
    description:
      "Rapid-fire questions designed to embarrass believers rather than seek genuine answers — 'Can God make a rock so heavy He can't lift it?' and similar traps.",
  },
  {
    id: "surface-bible-contradictions",
    title: "Surface-Level Bible Contradictions",
    description:
      "Lists of alleged Bible contradictions copied from skeptic websites without examining context, genre, original languages, or harmonization — quantity over quality.",
  },
  {
    id: "youtube-skepticism",
    title: "YouTube Skepticism",
    description:
      "Arguments popularized by YouTube atheists and podcast hosts that rely on confident delivery, selective evidence, and audience applause rather than rigorous scholarship.",
  },
  {
    id: "social-media-hot-takes",
    title: "Social Media Hot Takes",
    description:
      "280-character theology: oversimplified moral critiques, decontextualized Bible verses, and outrage-driven attacks on faith that go viral precisely because they lack nuance.",
  },
];

/* ── Steelman Arguments ──────────────────────────────────────────────────── */

const steelmanArguments = [
  {
    id: "is-steel-1",
    title: "The Bible Contradicts Itself Hundreds of Times",
    argument:
      "Skeptic websites catalog hundreds of alleged contradictions in the Bible — different numbers in parallel accounts (2 Samuel 24:9 vs. 1 Chronicles 21:5), conflicting resurrection narratives (how many angels at the tomb?), and God commanding genocide in Joshua while Jesus says 'love your enemies.' If the Bible were truly inspired by an omniscient God, it would contain zero discrepancies. The sheer volume of contradictions demonstrates that it is a purely human collection of texts written by fallible authors with conflicting agendas.",
    hiddenAssumptions: [
      "Inspiration requires mechanical dictation — every author must produce identical wording, ignoring that God works through diverse human perspectives and literary genres.",
      "Any apparent discrepancy is a real contradiction — assumes that if a resolution is not immediately obvious, none exists, ignoring context, language, copyist variations, and complementary perspectives.",
      "Volume equals validity — listing hundreds of alleged contradictions substitutes quantity for quality; most dissolve upon even basic examination.",
    ],
    sdaResponse:
      "SDAs affirm the Bible as the inspired, authoritative Word of God while recognizing that inspiration works through human authors with distinct vocabularies, perspectives, and literary styles (2 Peter 1:21). Alleged contradictions almost always fall into predictable categories: differences in rounding or counting methods (common in ancient Near Eastern texts), complementary perspectives (like different witnesses at a car accident reporting different true details), progressive revelation, genre differences (poetry vs. history vs. prophecy), and copyist variations in transmission. The SDA approach is to let Scripture interpret Scripture (Isaiah 28:10) and to study with intellectual honesty. As 2 Timothy 2:15 says, 'Study to show yourself approved.' A list of alleged contradictions copied from a website is not a substitute for careful, contextual study.",
  },
  {
    id: "is-steel-2",
    title: "Religion Is Just a Coping Mechanism for Weak Minds",
    argument:
      "People believe in God because they can't handle the randomness and meaninglessness of existence. Religion provides a psychological security blanket — an imaginary father figure in the sky, a comforting afterlife narrative, and a tribal community. Studies show that religiosity correlates with lower education, fear of death, and need for cognitive closure. Strong, independent thinkers don't need these crutches; they can face reality as it is without retreating into fairy tales.",
    hiddenAssumptions: [
      "Psychological motivation disproves truth — the genetic fallacy: explaining WHY someone believes something says nothing about WHETHER it is true.",
      "Correlation is causation — even if lower education correlates with religiosity in some datasets, that does not mean education causes atheism or that intelligence and faith are incompatible.",
      "Facing 'reality as it is' assumes atheism IS reality — the very conclusion being argued, begging the question.",
    ],
    sdaResponse:
      "The claim that faith is for weak minds ignores that some of history's greatest intellects were devout believers — Newton, Faraday, Pasteur, Dostoevsky, C.S. Lewis, and Alvin Plantinga, among many others. More importantly, explaining the psychology of belief does not address the truth of the belief (the genetic fallacy). A child believes in her mother partly because the belief brings comfort, but the mother still exists. Biblical faith is not a comfortable escape — it demands Sabbath-keeping against cultural pressure, radical self-denial (Luke 9:23), willingness to suffer for truth (2 Timothy 3:12), and intellectual rigor (1 Peter 3:15). SDAs who have studied Daniel's prophecies, the sanctuary doctrine, and the great controversy theme know that faith is not the absence of thought but its most demanding exercise.",
  },
  {
    id: "is-steel-3",
    title: "The God of the Old Testament Is a Moral Monster",
    argument:
      "The God of the Old Testament commands genocide (1 Samuel 15:3), endorses slavery (Leviticus 25:44-46), sends bears to maul children (2 Kings 2:23-24), drowns the entire planet (Genesis 6-8), and demands animal sacrifices. By any modern moral standard, this God is a tyrant worse than any human dictator. You can't claim God is love while He orders the slaughter of infants. Richard Dawkins was right: the God of the Old Testament is 'arguably the most unpleasant character in all fiction.'",
    hiddenAssumptions: [
      "Modern Western moral standards are the objective measure — but where do these standards come from if not from the Judeo-Christian tradition the skeptic is attacking?",
      "Ancient Near Eastern context is irrelevant — refuses to read texts in their historical, cultural, and literary context while demanding they conform to 21st-century sensibilities.",
      "Selective reading is comprehensive — cherry-picks the most shocking passages while ignoring the overwhelming biblical emphasis on God's mercy, patience, justice, and love.",
    ],
    sdaResponse:
      "SDAs take these difficult texts seriously rather than dismissing them. Several key principles apply. First, many of these passages involve divine judgment against extreme evil — the Canaanite nations practiced child sacrifice, temple prostitution, and systematic brutality. God's judgment, like a surgeon's scalpel, was aimed at removing a cancer. Second, the 'slavery' in the Mosaic law was radically different from chattel slavery — it was regulated indentured servitude with protections unknown in the ancient world (Exodus 21:2-6, Deuteronomy 15:12-15). Third, the great controversy framework shows that God works within a fallen, violent world while progressively revealing His true character, culminating in Jesus, who is 'the exact representation of His being' (Hebrews 1:3). Fourth, the 'bears and children' passage in 2 Kings 2 actually describes young men (not toddlers) threatening a prophet in a region hostile to God's messengers. Context matters. Ripping verses from a 3,000-year-old text and judging them by your Instagram feed is not serious engagement with Scripture.",
  },
  {
    id: "is-steel-4",
    title: "Science Has Made God Unnecessary",
    argument:
      "We used to need God to explain lightning, disease, earthquakes, and the origin of life. Now science explains all of these things. Every gap where God was inserted has been filled by natural explanations. Religion is retreating into an ever-shrinking 'God of the gaps.' Give science enough time and every remaining mystery — consciousness, abiogenesis, fine-tuning — will be explained naturalistically too. The trend is clear: the more we learn, the less we need God.",
    hiddenAssumptions: [
      "Explaining the mechanism eliminates the need for an agent — discovering HOW gravity works does not prove no one designed gravity.",
      "Past success guarantees future results — because science explained lightning does not mean it will explain consciousness or the origin of information in DNA.",
      "God is a gap-filler — misunderstands Christian theology, which does not argue 'I can't explain X, therefore God,' but rather 'the best explanation of X is a transcendent, intelligent cause.'",
    ],
    sdaResponse:
      "SDAs affirm genuine science as the study of God's creation (Psalm 19:1). The 'God of the gaps' accusation misrepresents the theistic argument. We do not argue from ignorance ('I can't explain it, therefore God') but from evidence ('the best explanation of fine-tuning, information in DNA, the origin of consciousness, and the existence of rational minds is an intelligent Creator'). These are not gaps shrinking with knowledge; they are gaps growing wider. The more we discover about the complexity of the cell, the information content of DNA, and the fine-tuning of cosmological constants, the stronger the evidence for design becomes. Furthermore, science itself presupposes a rationally ordered universe — an expectation that makes sense if a rational God created it but is an unexplained lucky coincidence on atheism. Ellen White wrote, 'True science and Bible religion are in perfect harmony' (CT 426).",
  },
  {
    id: "is-steel-5",
    title: "Christians Cherry-Pick the Bible and Ignore What's Inconvenient",
    argument:
      "Christians wear mixed fabrics but condemn homosexuality. They eat shellfish but keep the Ten Commandments. They ignore the commands to stone disobedient children but insist on the Sabbath (or Sunday). The Bible says women should be silent in church, yet churches have women leading worship. If you're going to take the Bible literally, take ALL of it literally — otherwise you're just picking and choosing what suits your preferences and calling it 'God's will.'",
    hiddenAssumptions: [
      "All biblical commands are the same type and carry the same weight — ignores the well-established distinction between moral, ceremonial, and civil law recognized by virtually all serious biblical interpreters.",
      "Contextual interpretation is cherry-picking — confuses responsible hermeneutics (understanding different genres, audiences, and covenant contexts) with dishonest selectivity.",
      "Consistency requires wooden literalism — assumes that if you take the Bible seriously, you must treat every genre (poetry, parable, apocalyptic, historical narrative, legal code) identically.",
    ],
    sdaResponse:
      "This is one of the most common internet objections, and it dissolves with basic hermeneutics. The Bible contains different types of law: moral law (the Ten Commandments, which reflect God's eternal character), ceremonial law (sacrifices, dietary restrictions, and rituals that pointed forward to Christ and were fulfilled at the cross — Colossians 2:16-17), and civil law (specific regulations for ancient Israel as a theocratic nation). SDAs distinguish these categories not by personal preference but by careful study of Scripture. The moral law is eternal (Psalm 111:7-8, Matthew 5:17-18); the ceremonial law was fulfilled in Christ (Hebrews 10:1); the civil law applied to ancient Israel's unique political situation. The 'mixed fabrics' and 'shellfish' arguments target ceremonial and civil regulations, not the moral law. SDAs are uniquely consistent here: we keep ALL Ten Commandments, including the fourth — the Sabbath — which most Christians abandon. That is the opposite of cherry-picking.",
  },
  {
    id: "is-steel-6",
    title: "Prayer Doesn't Work — It's Just Talking to Yourself",
    argument:
      "Controlled studies on intercessory prayer (like the 2006 STEP study) show no statistically significant effect on health outcomes. If prayer worked, we would expect measurable results. Instead, amputees never regrow limbs, childhood cancer rates don't drop in praying families, and natural disasters hit churches and mosques equally. Prayer is a placebo — it makes you feel better because you think someone is listening, but the universe doesn't care about your requests.",
    hiddenAssumptions: [
      "God is a vending machine — insert prayer, receive miracle. This misunderstands prayer as a mechanical cause-and-effect rather than a relational conversation with a sovereign Person.",
      "Only empirically measurable results count — reduces prayer to a lab experiment while ignoring transformation of character, guidance, peace, and spiritual growth.",
      "God's sovereignty means He must comply — assumes that if God is real, He must answer every prayer the way we want, when we want, or He doesn't exist.",
    ],
    sdaResponse:
      "The Bible never presents prayer as a cosmic vending machine. Jesus Himself prayed 'not My will, but Yours be done' (Luke 22:42). Prayer is relational communication with a sovereign God who answers according to His wisdom, not our demands. SDAs understand from the great controversy framework that God operates within a cosmic conflict where He respects free will and does not always intervene in ways we expect. James 5:16 says 'the prayer of a righteous person is powerful and effective,' and millions testify to answered prayer — but God is not a lab rat to be tested on our terms. The demand 'prove prayer works under controlled conditions' commits a category error: you cannot put a personal, sovereign Being into a double-blind study any more than you can measure love with a thermometer. 1 Peter 3:15 calls us to give a reason for our hope with gentleness — not to prove God's existence in a petri dish.",
  },
];

/* ── Mind Games ──────────────────────────────────────────────────────────── */

const mindGames = [
  {
    id: "is-mg-gish-gallop",
    name: "The Gish Gallop",
    description:
      "Flooding you with dozens of objections in rapid succession so you cannot address any of them adequately. The internet skeptic copies a list of '100 Bible contradictions' or fires off ten objections in a single message, then declares victory when you cannot respond to all of them in real time. The goal is overwhelm, not understanding.",
    example:
      "\"What about slavery? And genocide? And contradictions? And why does God need worship? And what about the dinosaurs? And Jephthah's daughter? And the Midianite virgins? Answer ALL of them or admit you can't defend your faith.\"",
    detectionTip:
      "When someone dumps a laundry list of objections, recognize the Gish Gallop. Calmly say: 'You've raised ten different topics. Serious engagement means taking them one at a time. Pick the one you consider strongest, and let's discuss it thoroughly.' This forces depth over breadth and exposes whether the skeptic actually wants answers or just wants to overwhelm. Proverbs 26:4-5 guides us: do not answer a fool according to his folly (don't play the rapid-fire game), but do answer him (address the strongest point so onlookers see the truth).",
  },
  {
    id: "is-mg-mockery-memes",
    name: "Mockery by Meme",
    description:
      "Using humor, sarcasm, and viral images to ridicule faith instead of engaging arguments. The meme format is inherently reductive — it strips away context, nuance, and response, leaving only the punchline. The goal is social humiliation, not intellectual exchange. A meme shared 10,000 times feels like 10,000 arguments even though it contains zero.",
    example:
      "\"*posts image of 'Skeptic's Annotated Bible' list* LOL how do Christians still believe this?\" or \"Imagine believing a talking snake is real history 😂\" — These are social signals, not arguments.",
    detectionTip:
      "When someone responds with memes, emojis, or one-liner ridicule, name the tactic: 'I notice you're using humor instead of making an argument. I'm happy to engage a serious objection if you have one.' Mockery is a social pressure tool — it works by making you feel embarrassed. Recognizing it as a tactic rather than an argument defuses its power. Proverbs 26:4 applies: do not descend to the fool's level. Stay calm, stay substantive, and remember that onlookers are watching how you handle the pressure, not just the words you say.",
  },
  {
    id: "is-mg-appeal-to-crowd",
    name: "Appeal to the Online Crowd",
    description:
      "Leveraging likes, shares, upvotes, and audience reaction as proof that an argument is correct. In online spaces, the most popular comment is treated as the most true. The skeptic plays to the gallery, making crowd-pleasing quips rather than making rigorous arguments, knowing the audience will reward confidence and mockery over careful reasoning.",
    example:
      "\"This post debunking Christianity has 50K likes and your response has 3. I think we know who won this debate.\" — Popularity is not a truth-test; the majority has been wrong about virtually everything at some point in history.",
    detectionTip:
      "When someone points to likes, shares, or audience approval, remind them (and the audience): 'Truth is not determined by popular vote. The majority once believed the earth was flat, that bloodletting cured disease, and that slavery was acceptable. Numbers tell you what is popular, not what is true.' This appeals to the thoughtful minority in any audience — the people who are actually open to evidence. Focus on them, not on the crowd. Jesus warned that the broad road is popular but leads to destruction (Matthew 7:13-14).",
  },
  {
    id: "is-mg-screenshot-sniping",
    name: "Screenshot Sniping",
    description:
      "Taking a single sentence or verse out of context, screenshotting it, and sharing it without the surrounding argument. This tactic weaponizes decontextualization — by isolating one phrase from a larger argument or one verse from a chapter, the skeptic can make anything look absurd. It is the intellectual equivalent of quoting 'there is no God' from Psalm 14:1 while omitting 'The fool says in his heart.'",
    example:
      "\"The Bible says 'Slaves, obey your masters' — here's your holy book, Christians\" — shared without Ephesians 6:9 ('Masters, treat your slaves in the same way... He who is both their Master and yours is in heaven'), without the historical context of first-century Roman slavery, and without Paul's letter to Philemon which undermined the entire institution.",
    detectionTip:
      "When someone shares a decontextualized verse or screenshot, say: 'Let's read the full passage together.' Context destroys most screenshot arguments. Always carry the full passage in your response — quote what comes before and after. This demonstrates intellectual honesty and exposes the skeptic's selectivity. As 2 Timothy 2:15 says, we must rightly divide the word of truth.",
  },
];

/* ── Fallacies ───────────────────────────────────────────────────────────── */

const fallacies = [
  {
    id: "is-fallacy-hasty-generalization",
    name: "Hasty Generalization",
    definition:
      "Drawing sweeping conclusions from a tiny, unrepresentative sample. The internet skeptic encounters one hypocritical Christian, reads one difficult Bible passage, or watches one viral video of a bad church experience, and concludes that ALL of Christianity is false, ALL Christians are hypocrites, and the ENTIRE Bible is unreliable.",
    example:
      "\"I saw a pastor get arrested for fraud — religion is just a scam to take your money.\" One corrupt pastor no more disproves Christianity than one corrupt scientist disproves science. The sample size is one; the conclusion is universal.",
    counterMove:
      "Name the fallacy: 'You're generalizing from one example to all of Christianity. That's like saying all teachers are incompetent because you had one bad teacher.' Then redirect: 'Let's talk about the actual truth claims of Christianity rather than the failures of individual Christians. Jesus predicted that wolves would come in sheep's clothing (Matthew 7:15) — the existence of fakes confirms, not disproves, that the real thing exists.'",
  },
  {
    id: "is-fallacy-appeal-to-ridicule",
    name: "Appeal to Ridicule (Argumentum ad Ridiculum)",
    definition:
      "Presenting an opponent's position in a deliberately absurd or humorous way to make it seem unworthy of serious consideration, without actually engaging the logic or evidence behind the position. This is the backbone of internet skepticism — the snarky tweet, the dismissive meme, the eye-roll emoji used as a substitute for reasoning.",
    example:
      "\"So you believe a cosmic zombie Jew who is his own father wants you to telepathically tell him you accept him as your master so he can remove an evil force from your soul caused by a rib-woman being convinced by a talking snake to eat from a magical tree. Seems legit. 🙄\" — This is parody, not argument.",
    counterMove:
      "Do not take the bait. Calmly respond: 'That's a creative summary, but it's not what Christianity actually teaches. Would you like me to explain what I actually believe, or would you prefer to keep responding to the caricature?' This puts the skeptic in a position where they must either engage honestly or openly admit they are not interested in truth. 1 Peter 3:15 instructs us to respond 'with gentleness and respect' — the gentleness itself is a witness.",
  },
  {
    id: "is-fallacy-red-herring",
    name: "Red Herring",
    definition:
      "Introducing an irrelevant topic to divert attention from the argument at hand. When an internet skeptic is losing on one point, they abruptly shift to a completely different objection — from discussing the resurrection to suddenly asking about slavery, from talking about prophecy to demanding you explain the dinosaurs. The goal is to keep you perpetually on defense and never let you complete a single argument.",
    example:
      "You: 'The prophecies in Daniel 2 were written centuries before their fulfillment—' Skeptic: 'Yeah but what about all the children God killed in the flood? How is that moral?' — The topic has nothing to do with Daniel 2; it's a deliberate diversion.",
    counterMove:
      "Identify the redirect: 'That's an important question, and I'm happy to discuss it after we finish this topic. Right now we're talking about Daniel's prophecies. Can we stay on this subject?' This is not evasion — it's intellectual discipline. Staying on topic forces depth and prevents the skeptic from using breadth as a weapon. If they refuse to stay on topic, the audience sees that the skeptic is running from the argument, not engaging it.",
  },
  {
    id: "is-fallacy-chronological-snobbery",
    name: "Chronological Snobbery",
    definition:
      "Dismissing a belief or text simply because it is old, as though being ancient automatically makes something false. The internet skeptic assumes that modern people are smarter, more rational, and more enlightened than ancient people, and therefore anything from the ancient world — especially religious texts — can be dismissed as the product of primitive, pre-scientific minds.",
    example:
      "\"The Bible was written by Bronze Age goat herders who didn't even know where the sun went at night. Why would I trust that over modern science?\" — This ignores that these 'goat herders' produced literature, law codes, poetry, and philosophical insights that have shaped civilization for millennia.",
    counterMove:
      "Name the fallacy: 'The age of an idea has no bearing on its truth. Pythagoras was ancient — is his theorem wrong? Aristotle's logic is 2,400 years old — should we discard it?' Then note: 'The biblical authors included kings, doctors, scholars, fishermen, and Roman-trained intellectuals like Paul. Dismissing them as ignorant primitives is historically uninformed chronological snobbery — a term coined by C.S. Lewis. Truth does not have an expiration date.'",
  },
];

/* ── Counter Strategies ──────────────────────────────────────────────────── */

const counterStrategies = [
  {
    subjectId: "meme-based-objections",
    title: "Countering Meme-Based Objections with Substance and Speed",
    sdaPosition:
      "SDAs recognize that meme-based objections are not arguments but social signals — they communicate tribal identity ('I'm too smart for religion') rather than engage truth claims. However, because memes are the dominant mode of public discourse for millions, SDAs must be equipped to respond with concise, substantive answers that match the speed of viral culture without sacrificing depth. 1 Peter 3:15 calls us to 'always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have — but do this with gentleness and respect.' Proverbs 26:4-5 gives the balanced strategy: do not answer a fool according to his folly (don't get drawn into meme wars), but DO answer a fool (provide a substantive response so onlookers are not led astray).",
    keyScriptures: [
      "1 Peter 3:15 — 'Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have — but do this with gentleness and respect.' Speed and readiness, not anger.",
      "Proverbs 26:4-5 — 'Do not answer a fool according to his folly, or you yourself will be just like him. Answer a fool according to his folly, or he will be wise in his own eyes.' The dual strategy: don't descend to mockery, but do expose the error.",
      "2 Timothy 2:24-25 — 'The Lord's servant must not be quarrelsome but must be kind to everyone, able to teach, not resentful.' Tone matters as much as content in public forums.",
      "Colossians 4:6 — 'Let your conversation be always full of grace, seasoned with salt, so that you may know how to answer everyone.' Grace with substance.",
    ],
    counterArguments: [
      "A meme is not an argument — it is a conclusion without premises. When someone shares a meme against Christianity, ask: 'What is the actual argument here? Can you state it in your own words?' Most cannot, because they never analyzed it; they just shared it because it got likes.",
      "Memes exploit the brain's preference for simplicity over accuracy. Complex truths cannot be reduced to image macros without distortion. Point this out: 'Any worldview — including atheism — looks absurd when you reduce it to a meme. That says something about memes, not about worldviews.'",
      "Respond with concise, quotable truth. SDAs should have ready-made short answers: 'The Bible has 66 books, 40 authors, written over 1,500 years, with a unified message. That's not what you'd expect from a random human collection.' Match speed without sacrificing substance.",
      "Use the meme as a door to deeper conversation: 'That meme raises an interesting point. Here's what the Bible actually says about that topic...' This disarms hostility and redirects to substance.",
    ],
    closingStatement:
      "Memes are the fast food of intellectual discourse — satisfying in the moment but nutritionally empty. SDAs should not fear them or fight fire with fire. Instead, respond with calm, concise, substantive truth that invites the thoughtful person to look deeper. The goal is not to win a meme war but to plant a seed of genuine inquiry. As Isaiah 55:11 promises, God's word does not return void.",
  },
  {
    subjectId: "gotcha-questions",
    title: "Countering Gotcha Questions with Reframing",
    sdaPosition:
      "Gotcha questions are designed to produce a lose-lose scenario: any answer you give can be twisted. The classic 'Can God make a rock so heavy He can't lift it?' is a logical trick, not a genuine inquiry. SDAs should recognize these as rhetorical traps and respond not by answering the loaded question directly but by reframing it — exposing the hidden assumption, identifying the logical error, and redirecting to the real issue. Jesus modeled this perfectly: when asked 'Is it lawful to pay taxes to Caesar?' (a gotcha designed to make Him either a Roman collaborator or a rebel), He reframed the entire question (Matthew 22:15-22). Proverbs 26:4-5 applies here: discern when a question deserves a direct answer and when it needs to be exposed as a trap.",
    keyScriptures: [
      "Matthew 22:15-22 — Jesus' masterful reframing of the tax question. He did not accept the false dilemma; He transcended it.",
      "Proverbs 26:4-5 — The wisdom of knowing when to engage directly and when to expose the trap before answering.",
      "Luke 20:1-8 — When the Pharisees demanded to know Jesus' authority, He responded with a counter-question that exposed their dishonesty. Sometimes the best answer is a better question.",
      "1 Peter 3:15 — Be prepared, be gentle, be respectful — even when the question is designed to humiliate you.",
    ],
    counterArguments: [
      "The 'omnipotence paradox' (can God make a rock too heavy to lift?) is a logical category error, not a real problem. It's like asking 'Can God make a square circle?' Omnipotence means God can do all things that are logically possible; it does not mean God can make logical contradictions real. A married bachelor is not a thing God 'can't' create — it's a meaningless string of words.",
      "Most gotcha questions contain a hidden false assumption. Identify it: 'Your question assumes X — but X is not what the Bible teaches. Let me correct the assumption and then address the real question.' This puts you in control of the framing.",
      "When asked a rapid-fire gotcha, slow down: 'That's actually a really important question. Let me give it the serious answer it deserves rather than a quick sound bite.' This resets the dynamic from gotcha-performance to genuine inquiry.",
      "Use Jesus' method: respond to a loaded question with a clarifying question. 'Before I answer that, let me ask you: what do you mean by [key term]?' This forces the skeptic to define their terms, which often exposes the weakness in their framing.",
    ],
    closingStatement:
      "Gotcha questions are designed to make you stumble, not to find truth. Jesus never stumbled — He reframed, counter-questioned, and redirected every trap to reveal the deeper issue. SDAs should study His method and practice it. The goal is not to fire back a clever comeback but to expose the hidden assumption and open a door to genuine dialogue. As Proverbs 15:1 says, 'A gentle answer turns away wrath.'",
  },
  {
    subjectId: "surface-bible-contradictions",
    title: "Countering Surface-Level Bible Contradictions with Context",
    sdaPosition:
      "The internet is flooded with lists of alleged Bible contradictions — many of them recycled from 19th-century skeptic literature. These lists rely on a strategy of volume: throw 200 'contradictions' at a Christian and hope they cannot answer all of them. However, the vast majority dissolve upon examination of context, genre, original language, and basic hermeneutical principles. SDAs are uniquely positioned to address these because of the denomination's strong emphasis on Bible study, the year-for-a-day principle in prophecy, the sanctuary typology, and the distinction between moral, ceremonial, and civil law. When a skeptic lists contradictions, the SDA response should be: 'Let's pick the strongest one and examine it carefully.' Depth defeats volume every time.",
    keyScriptures: [
      "2 Timothy 2:15 — 'Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.' Correct handling of Scripture resolves most alleged contradictions.",
      "Isaiah 28:10 — 'Line upon line, precept upon precept.' Scripture interprets Scripture — context within the canon resolves apparent tensions.",
      "John 10:35 — 'Scripture cannot be broken.' Jesus affirmed the reliability and unity of God's Word.",
      "Psalm 119:160 — 'The entirety of Your word is truth.' The whole is coherent even when individual passages appear to tension.",
    ],
    counterArguments: [
      "Most alleged contradictions involve numbers (2 Samuel 24:9 vs. 1 Chronicles 21:5): these are explained by different counting methods, rounding conventions, or copyist variations in transmission — none of which affect any doctrine.",
      "Parallel accounts (especially the Gospels) give complementary, not contradictory, perspectives. Four witnesses to a car accident will report different details — that proves they are independent witnesses, not that the accident didn't happen.",
      "Genre matters: poetry (Psalms), parable (Jesus' stories), apocalyptic (Revelation), historical narrative (Kings), and legal code (Leviticus) cannot be read with the same interpretive lens. Reading Psalm 91:4 ('He will cover you with His feathers') as a claim that God is a bird is a genre error, not a contradiction.",
      "Progressive revelation means God revealed His character and plan over centuries, with later revelation building on earlier revelation. What looks like a 'contradiction' between Old and New Testament is often progressive unfolding — like calling it a 'contradiction' that a caterpillar and a butterfly look different.",
    ],
    closingStatement:
      "Lists of Bible contradictions are impressive only to those who have never examined them. When investigated one by one with attention to context, language, genre, and canonical context, the vast majority dissolve. The few genuinely difficult passages (like differing numbers in Samuel and Chronicles) involve minor textual transmission issues that affect no doctrine. SDAs should welcome these challenges — they are opportunities to demonstrate the depth, coherence, and reliability of Scripture. As Jesus said, 'You are in error because you do not know the Scriptures' (Matthew 22:29).",
  },
  {
    subjectId: "youtube-skepticism",
    title: "Countering YouTube Skepticism with Rigorous Sources",
    sdaPosition:
      "YouTube has produced a generation of skeptics who learned their objections not from scholarly monographs but from entertaining, confident, and often combative video content. The format rewards delivery over substance, personality over peer review, and zingers over sustained argumentation. SDAs must recognize that the person they are engaging may have absorbed hours of one-sided content and genuinely believes they are well-informed. The response should not be dismissive ('You got that from YouTube') but should gently introduce the person to the level of scholarship that YouTube skeptics typically ignore — Dead Sea Scrolls evidence, serious archaeological findings, peer-reviewed biblical scholarship, and the logical rigor of professional philosophy of religion.",
    keyScriptures: [
      "Acts 17:11 — 'The Berean Jews were of more noble character than those in Thessalonica, for they received the message with great eagerness and examined the Scriptures every day to see if what Paul said was true.' Test everything — including YouTube claims — against the evidence.",
      "Proverbs 18:17 — 'In a lawsuit the first to speak seems right, until someone comes forward and cross-examines.' YouTube gives you the prosecution without the defense. Hear both sides.",
      "1 Thessalonians 5:21 — 'Test everything. Hold on to the good.' Discernment, not gullibility, is the Christian standard.",
      "Isaiah 8:20 — 'To the law and to the testimony! If they do not speak according to this word, they have no light of dawn.' Scripture is the standard by which all claims are measured.",
    ],
    counterArguments: [
      "YouTube is not peer review. A confident presentation does not make an argument valid. Ask: 'Has this argument been published in a peer-reviewed journal? Has it survived cross-examination by experts in the field?' If not, it's an opinion with a camera, not scholarship.",
      "Most popular YouTube skeptics rely on outdated scholarship. Claims like 'Jesus never existed' (mythicism) are rejected by the overwhelming majority of historians, including secular ones. Bart Ehrman, an agnostic New Testament scholar, wrote an entire book refuting mythicism (Did Jesus Exist?). Point skeptics to the actual academic consensus, not to YouTube personalities.",
      "Encourage the skeptic to read primary sources: 'Have you actually read Daniel, or just watched a video about Daniel? Have you read a scholarly commentary, or just a Reddit summary?' Direct engagement with the text is the antidote to secondhand skepticism.",
      "Contrast YouTube skeptic claims with actual archaeological and manuscript evidence: the Dead Sea Scrolls confirm the reliability of Old Testament transmission; archaeology has confirmed dozens of biblical people, places, and events that critics once said were fictional (Pontius Pilate's inscription, the Pool of Bethesda, the Tel Dan inscription referencing the House of David).",
    ],
    closingStatement:
      "YouTube skepticism is confident but shallow. It thrives on audiences that never check the sources. SDAs should not be intimidated by production quality or subscriber counts. Instead, gently point to the actual evidence — manuscript evidence, archaeological discoveries, fulfilled prophecy, and the testimony of peer-reviewed scholarship. The truth does not need a flashy thumbnail; it just needs someone willing to study (2 Timothy 2:15).",
  },
  {
    subjectId: "social-media-hot-takes",
    title: "Countering Social Media Hot Takes with Measured Truth",
    sdaPosition:
      "Social media platforms are engineered for outrage, brevity, and virality — the exact opposite of what theological discussion requires. A hot take about the Bible that gets 100K likes in 24 hours may contain more misinformation than a careful 30-page academic paper that gets 200 reads. SDAs must understand this ecosystem: people are not arguing in good faith on Twitter/X; they are performing for an audience. The response must be calibrated accordingly — brief enough to work in the medium, substantive enough to plant a seed, and gracious enough to reflect Christ. The goal is never to 'own' the skeptic but to reach the silent reader who is genuinely questioning.",
    keyScriptures: [
      "1 Peter 3:15 — 'Always be prepared to give an answer... with gentleness and respect.' In hostile online spaces, tone is half the battle.",
      "Proverbs 15:1 — 'A gentle answer turns away wrath, but a harsh word stirs up anger.' De-escalation is a strategy, not weakness.",
      "Matthew 10:16 — 'Be wise as serpents and innocent as doves.' Navigate the hostile social media environment with both shrewdness and integrity.",
      "Proverbs 26:4-5 — Know when to engage and when to walk away. Not every hot take deserves a response.",
    ],
    counterArguments: [
      "Hot takes are optimized for engagement, not truth. Remind yourself and others: 'This post went viral because it provokes emotion, not because it is accurate. Let's slow down and check the facts.' Speed kills nuance; resist the pressure to respond instantly.",
      "Address the silent audience, not just the poster. Most people reading a thread never comment. Write your response for the person who is quietly wondering whether the hot take is true — they are the ones most likely to be influenced by a calm, well-sourced reply.",
      "Use the 'one clear point' strategy: in a medium that rewards brevity, make one clear, well-supported point rather than trying to address everything. A single strong rebuttal is more effective than a ten-point essay that no one reads.",
      "When a hot take is genuinely unanswerable in the medium (too complex for a tweet), say so honestly: 'This is a complex topic that can't be addressed in 280 characters. Here's a resource that addresses it in depth: [link].' Honesty about complexity is more persuasive than forced oversimplification.",
    ],
    closingStatement:
      "Social media is a battlefield where nuance goes to die. SDAs should engage it strategically — not with outrage or desperation but with concise truth, gracious tone, and links to deeper resources. Remember: you are not trying to win the algorithm; you are trying to reach one honest heart. 'A word fitly spoken is like apples of gold in a setting of silver' (Proverbs 25:11).",
  },
];

/* ── Modules ─────────────────────────────────────────────────────────────── */

const modules = [
  // ────── Module 1: Meme-Based Objections ──────
  {
    id: "is-mod-meme-objections",
    subjectId: "meme-based-objections",
    title: "Viral Attacks: Responding to Meme-Based Objections",
    doctrineBrief:
      "Meme culture has created an entirely new mode of skepticism — one that trades in images, one-liners, and shareable content rather than sustained arguments. A meme that says 'The Bible was used to justify slavery — your moral book isn't moral' gets shared 50,000 times before anyone checks whether the claim is accurate, contextual, or fair. This matters because millions of young people are encountering their first objections to Christianity not in a philosophy class but on Reddit, TikTok, and Instagram.\n\nThe SDA response must operate on two levels. First, at the speed level: have concise, accurate, ready-made responses to the most common meme objections. You need to be able to respond in 2-3 sentences that are true, memorable, and shareable. Second, at the depth level: be able to unpack any meme objection into its component claims and address each one with Scripture, logic, and evidence.\n\nThe key insight is that memes are conclusions without arguments. They state a result but skip the reasoning. Your job is to supply the missing reasoning — and show that when you do, the conclusion does not follow. Proverbs 26:4-5 gives the dual strategy: do not descend to the meme level (folly for folly), but do answer the underlying claim (so the fool is not wise in his own eyes).",
    steelmanArguments: [
      steelmanArguments[0], // Bible contradicts itself
      steelmanArguments[2], // OT God is a moral monster
      steelmanArguments[4], // Christians cherry-pick
    ],
    hiddenAssumptions: [
      "A meme that gets thousands of shares must contain some truth — popularity bias applied to arguments.",
      "If a claim is funny or clever, it is more likely true — the humor heuristic, where comedic framing substitutes for evidence.",
      "Complex topics can be accurately reduced to a single image and caption — the compression fallacy.",
      "If the Christian cannot respond instantly and in the same format, the meme 'wins' — speed bias over accuracy.",
    ],
    mindGames: [mindGames[1], mindGames[2]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "internet-skeptic",
    debriefPrompt:
      "Reflect on your encounter with meme-based objections. Were you able to identify that the meme was a conclusion without an argument? Could you unpack the hidden assumptions? Did you maintain a calm, gracious tone while delivering a substantive response? Were you concise enough to be effective in a fast-paced format? What meme objections do you still need to prepare ready-made responses for?",
  },
  // ────── Module 2: Gotcha Questions ──────
  {
    id: "is-mod-gotcha-questions",
    subjectId: "gotcha-questions",
    title: "Trap Detection: Dismantling Gotcha Questions",
    doctrineBrief:
      "Gotcha questions are rhetorical landmines — they are designed so that any direct answer harms you. 'Can God make a rock so heavy He can't lift it?' If you say yes, God is not omnipotent (He can't lift it). If you say no, God is not omnipotent (He can't make it). The questioner thinks they have cornered you — but the question itself is logically malformed. It's like asking 'What does the color blue taste like?' The failure is in the question, not in the inability to answer it.\n\nThe internet is full of these: 'If God knows the future, do we have free will?' 'If God is good, why does He send people to hell?' 'If the Bible is true, why are there so many denominations?' Each of these contains a hidden false dilemma or a smuggled assumption. The SDA apologist must learn to detect the trap, identify the hidden assumption, and reframe the question before answering it.\n\nJesus was the master of this technique. When the Pharisees asked, 'Is it lawful to pay taxes to Caesar?' (Matthew 22:15-22), He did not accept the false dilemma. He reframed: 'Render to Caesar the things that are Caesar's, and to God the things that are God's.' The gotcha was dissolved. SDAs should study and imitate this method.",
    steelmanArguments: [
      steelmanArguments[5], // Prayer doesn't work
      steelmanArguments[3], // Science made God unnecessary
    ],
    hiddenAssumptions: [
      "The question is fair and well-formed — most gotcha questions contain logical errors (false dilemmas, category errors, loaded assumptions) that make them unanswerable as stated.",
      "Inability to answer a trick question quickly proves the belief is false — speed of response has no bearing on truth.",
      "There are only two possible answers (the ones the questioner wants) — ignoring that the correct response may be to reject the framing entirely.",
    ],
    mindGames: [mindGames[0], mindGames[2]],
    fallacies: [fallacies[2], fallacies[0]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "internet-skeptic",
    debriefPrompt:
      "Review how you handled the gotcha questions. Were you able to identify the hidden assumption in each question before answering? Did you successfully reframe rather than accept the false dilemma? Could you use Jesus' counter-question technique effectively? Where did you feel most trapped, and how could you prepare better next time?",
  },
  // ────── Module 3: Surface-Level Bible Contradictions ──────
  {
    id: "is-mod-bible-contradictions",
    subjectId: "surface-bible-contradictions",
    title: "Contradiction Busting: Addressing Surface-Level Bible Challenges",
    doctrineBrief:
      "The internet has made lists of 'Bible contradictions' ubiquitous. Websites like the Skeptic's Annotated Bible catalog hundreds of alleged discrepancies, and these lists get recycled endlessly on social media. For someone who has never studied the Bible in depth, these lists can seem devastating: 'How many animals did Noah take on the ark — two of each (Genesis 6:19) or seven of some (Genesis 7:2)?' 'Did Judas hang himself (Matthew 27:5) or fall headlong and burst open (Acts 1:18)?'\n\nThe SDA response begins with a crucial distinction: an apparent contradiction is not a real contradiction until you have exhausted all reasonable harmonizations. In virtually every case, the apparent discrepancy dissolves when you apply basic principles: read the full context, consider the genre, check the original language, understand ancient literary conventions, and distinguish between contradiction and complementarity.\n\nThe Noah example is trivially resolved: Genesis 6:19 gives the general instruction (two of every kind), while Genesis 7:2-3 gives the specific exception (seven pairs of clean animals, for sacrifice). There is no contradiction — the second passage adds detail to the first. The Judas example is complementary: he hanged himself, and subsequently the body fell and burst open. Two witnesses, two perspectives, one event.\n\nSDAs should welcome these challenges because they drive us deeper into Scripture. Every alleged contradiction investigated is an opportunity to discover richness in the text that a surface reading misses.",
    steelmanArguments: [
      steelmanArguments[0], // Bible contradicts itself
      steelmanArguments[4], // Christians cherry-pick
    ],
    hiddenAssumptions: [
      "If two passages appear to differ, they contradict — ignores the possibility of complementary perspectives, progressive revelation, different audiences, or literary conventions.",
      "The skeptic's list is comprehensive and final — most lists recycle the same well-answered objections that have been addressed in commentaries for centuries.",
      "Ancient authors were unaware of their 'contradictions' — assumes the biblical editors who compiled these texts side by side were too stupid to notice what a modern blog reader can see instantly.",
      "Any difficulty in a text means the text is unreliable — applies a standard of perfection to the Bible that is applied to no other ancient document.",
    ],
    mindGames: [mindGames[0], mindGames[3]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "internet-skeptic",
    debriefPrompt:
      "Assess how you handled the contradiction challenges. Were you able to force depth over breadth by insisting on one-at-a-time examination? Could you demonstrate the contextual, genre-based, and linguistic tools that resolve apparent discrepancies? Did you show that the Bible's diversity of perspective is a strength (multiple independent witnesses), not a weakness? What specific 'contradictions' do you need to study further to be fully prepared?",
  },
  // ────── Module 4: YouTube Skepticism ──────
  {
    id: "is-mod-youtube-skepticism",
    subjectId: "youtube-skepticism",
    title: "Beyond the Algorithm: Countering YouTube Skeptic Culture",
    doctrineBrief:
      "A generation of skeptics has been discipled not by Hume, Russell, or Nietzsche but by YouTube personalities who package objections to Christianity in entertaining, accessible, and often combative videos. These creators — some brilliant, some not — have built audiences in the millions by confidently dismantling (or appearing to dismantle) religious claims.\n\nThe format itself creates problems. A 20-minute YouTube video can raise dozens of objections that would take hours to research and address properly. The creator controls the framing, the editing, the tone, and the pacing. The viewer absorbs the conclusion without ever encountering the strongest Christian response. It is Proverbs 18:17 in action: 'In a lawsuit the first to speak seems right, until someone comes forward and cross-examines.'\n\nSDAs engaging with YouTube-informed skeptics should not be dismissive. Many of these people are genuinely curious and have invested real time watching content. The respectful approach is to acknowledge their research while gently introducing them to the scholarship that YouTube skeptics typically ignore: evangelical and Adventist scholars who have addressed these objections rigorously, archaeological evidence that confirms biblical accounts, and the peer-reviewed literature on the historical Jesus, Old Testament reliability, and philosophy of religion.\n\nThe SDA advantage is that we have a comprehensive, internally coherent theological system — creation, Sabbath, sanctuary, prophecy, great controversy, Second Coming — that provides answers at every level. Most YouTube skeptics are attacking a generic Christianity that lacks this depth.",
    steelmanArguments: [
      steelmanArguments[3], // Science made God unnecessary
      steelmanArguments[1], // Religion is for weak minds
      steelmanArguments[2], // OT God is a moral monster
    ],
    hiddenAssumptions: [
      "A confident video presentation constitutes a valid refutation — delivery is not evidence; charisma is not logic.",
      "If a Christian has not seen the specific video, they cannot respond — the arguments in these videos are not new; they recycle centuries-old objections that have centuries-old answers.",
      "Academic consensus supports the YouTube skeptic's position — in many cases (e.g., mythicism, late Daniel dating as universally accepted), the actual scholarly consensus is far more nuanced than the video claims.",
      "Watching a video is equivalent to studying a topic — passive consumption of one-sided content is not research; it is entertainment.",
    ],
    mindGames: [mindGames[2], mindGames[1]],
    fallacies: [fallacies[3], fallacies[1]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "internet-skeptic",
    debriefPrompt:
      "Evaluate your engagement with YouTube-informed skepticism. Were you able to respectfully acknowledge the skeptic's research while introducing them to deeper scholarship? Could you identify specific claims from popular YouTube skeptics and counter them with peer-reviewed evidence? Did you avoid being dismissive while still demonstrating that YouTube confidence is not the same as academic rigor? What popular YouTube skeptic arguments do you need to research further?",
  },
  // ────── Module 5: Social Media Hot Takes ──────
  {
    id: "is-mod-social-media-hot-takes",
    subjectId: "social-media-hot-takes",
    title: "Signal vs Noise: Navigating Social Media Attacks on Faith",
    doctrineBrief:
      "Social media has fundamentally changed how people encounter objections to Christianity. A tweet or TikTok can reach millions in hours, carrying a theological claim that would be laughed out of a seminary classroom but sounds devastating in 280 characters or 60 seconds. The algorithm rewards outrage, certainty, and confrontation — all qualities that work against nuanced theological discussion.\n\nFor SDAs, the challenge is threefold. First, we must recognize that social media hot takes are not arguments — they are emotional performances optimized for engagement. The person posting 'Imagine worshipping a God who sends people to hell for not believing in Him' is not asking a theological question; they are making a social statement designed to get likes from a sympathetic audience.\n\nSecond, we must discern when to engage and when to walk away. Proverbs 26:4-5 is the operative text: some hot takes should be ignored (answering would dignify a bad-faith attack), while others should be addressed (because silent people are watching and may be influenced). The key question is: 'Is there a genuine seeker in this audience who will benefit from my response?'\n\nThird, when we do engage, we must be brief, gracious, accurate, and strategic. The goal is never to 'win' a social media argument (an impossible task in a medium designed for conflict) but to plant a seed of doubt in the skeptic's certainty and a seed of faith in the silent reader's heart. 1 Peter 3:15 is the north star: be ready, be gentle, be respectful.",
    steelmanArguments: [
      steelmanArguments[4], // Christians cherry-pick
      steelmanArguments[1], // Religion for weak minds
      steelmanArguments[5], // Prayer doesn't work
    ],
    hiddenAssumptions: [
      "If a take goes viral, it must be substantially correct — virality is a function of emotional resonance, not factual accuracy.",
      "Brevity equals clarity — short does not mean true; complex realities cannot always be compressed without distortion.",
      "The person posting the hot take has thoroughly studied the topic — most viral posts reveal a surface-level familiarity at best.",
      "If no one responds, the take is unanswered — silence can be strategic; not every claim deserves a public response.",
    ],
    mindGames: [mindGames[2], mindGames[3]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "internet-skeptic",
    debriefPrompt:
      "Reflect on your navigation of the social media battleground. Were you able to discern when to engage and when to walk away? Could you craft brief, gracious, substantive responses that work within the constraints of the medium? Did you address the silent audience rather than just the hostile poster? Were you able to maintain your composure and reflect Christ in a medium designed to provoke anger? What strategies for social media apologetics do you want to develop further?",
  },
];

/* ── Export ───────────────────────────────────────────────────────────────── */

export const internetSkepticTraining: AATSAvatarTraining = {
  avatarId: "internet-skeptic",
  avatarName: "The Internet Skeptic",
  emoji: "\u{1F4BB}", // 💻
  color: "border-cyan-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
