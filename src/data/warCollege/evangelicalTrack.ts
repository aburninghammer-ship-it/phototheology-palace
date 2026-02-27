// ─── War College: Evangelical Track ─────────────────────────────────────────
// 56-day training curriculum for defending SDA distinctive doctrines against
// mainstream Evangelical Protestant objections. Covers Sola Fide, OSAS,
// Investigative Judgment, Sabbath, and Law Abolished arguments.

import type { WarCollegeTrack, WarCollegeDay } from "../warCollegeTypes";
import { getDifficultyTier, getXPForDay } from "../warCollegeTypes";

const days: WarCollegeDay[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // WEEK 1: Subject Deep Dives (Days 1-7)
  // Key Evangelical vs SDA theological differences
  // ════════════════════════════════════════════════════════════════════════════
  {
    day: 1,
    title: "The Evangelical Landscape: Know Your Opponent",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(1),
    estimatedMinutes: 25,
    xpReward: getXPForDay(1),
    instructorVoice:
      "Soldier, welcome to the War College. Before you can defend the truth, you must understand who challenges it. Evangelical Protestantism is not monolithic — it spans Calvinists, Arminians, charismatics, and dispensationalists. Yet certain core convictions unite them against SDA distinctive doctrines: the belief that the law was abolished at the cross, that Sunday worship honors the resurrection, that the soul is immortal, and that once saved always saved is the gospel's promise.\n\nYour mission is not to mock or belittle these brothers and sisters in Christ. Many Evangelicals love Jesus deeply and know their Bibles well. Your mission is to understand their theological framework so thoroughly that you can address it with precision, grace, and biblical authority.\n\nAs the apostle Peter wrote: 'But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear' (1 Peter 3:15). Note the twin requirements: readiness AND meekness. Knowledge without humility is a clanging cymbal.\n\nToday we map the battlefield. By the end of this session, you will know the five major friction points between Evangelical and SDA theology and understand why each matters.",
    avatarPresence:
      "The Evangelical stands confidently with a well-worn Bible, quoting Romans and Galatians with practiced ease. Their eyes carry genuine conviction — this is not an enemy to despise but a worthy dialogue partner to respect.",
    tacticalBriefing:
      "The five primary Evangelical objections to SDA theology are: (1) Sola Fide — faith alone means works are irrelevant; (2) Once Saved Always Saved — genuine believers cannot lose salvation; (3) Anti-Investigative Judgment — the IJ is a fear doctrine invented after 1844; (4) Anti-Sabbath — the Sabbath was Jewish and temporary; (5) Law Abolished — Christ ended the entire law at the cross. Each of these will receive dedicated deep-dive treatment this week. Today, survey the entire landscape so you understand how these objections interconnect and reinforce each other in the Evangelical mind.",
    drill:
      "List all five Evangelical objections and write a one-sentence summary of the SDA response to each. Then identify how the objections interconnect — for example, how does 'law abolished' support 'anti-Sabbath'? How does 'sola fide' connect to 'OSAS'? Map the logical dependencies between these positions.",
    forgeAWeapon:
      "Create a one-page 'Evangelical Objection Map' showing the five major objections, their interconnections, and the key SDA scripture that addresses each. This becomes your strategic overview for the entire track.",
    jeevesDebrief:
      "Excellent first day, soldier. You now see the battlefield from above. The Evangelical position is not random — it is a coherent theological system where each doctrine reinforces the others. That means dismantling one pillar weakens the entire structure. But it also means you must address the system, not just isolated proof texts. Tomorrow we dive into the first and most foundational objection: Sola Fide. Rest well — the real work begins at dawn.",
    masteryCheck: [
      {
        question: "Which of the following is NOT one of the five primary Evangelical objections to SDA theology?",
        options: [
          "Once Saved Always Saved",
          "The Sabbath was only for Jews",
          "The Trinity is unbiblical",
          "The Investigative Judgment is a fear doctrine"
        ],
        correctIndex: 2,
        explanation:
          "Evangelicals generally affirm the Trinity. Their primary objections to SDA theology center on Sola Fide, OSAS, anti-IJ, anti-Sabbath, and the law being abolished."
      },
      {
        question: "According to 1 Peter 3:15, what two qualities should characterize our apologetic responses?",
        options: [
          "Power and authority",
          "Readiness and meekness",
          "Boldness and aggression",
          "Knowledge and eloquence"
        ],
        correctIndex: 1,
        explanation:
          "Peter instructs believers to be 'ready always to give an answer' (readiness) 'with meekness and fear' (humility). Both elements are essential for effective apologetics."
      },
      {
        question: "Why is it important to understand how Evangelical objections interconnect?",
        options: [
          "So we can attack all their beliefs simultaneously",
          "Because addressing isolated proof texts without understanding the system is ineffective",
          "Because Evangelicals never focus on single topics",
          "So we can avoid discussing difficult subjects"
        ],
        correctIndex: 1,
        explanation:
          "The Evangelical position is a coherent theological system where each doctrine reinforces the others. Understanding the interconnections allows for more effective, systematic responses rather than piecemeal proof-texting."
      }
    ],
  },
  {
    day: 2,
    title: "Sola Fide: Faith Alone and the Works Question",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(2),
    estimatedMinutes: 30,
    xpReward: getXPForDay(2),
    instructorVoice:
      "Today we engage the cornerstone of Evangelical soteriology: Sola Fide — salvation by faith alone. This Reformation battle cry correctly identifies faith as the instrument of justification. The error comes when 'faith alone' is stretched to mean 'faith without any obedience whatsoever.' The Evangelical will quote Ephesians 2:8-9 and stop. Your task is to complete the thought with verse 10.\n\nConsider carefully: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast. For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them' (Ephesians 2:8-10). Paul's argument does not end at 'not of works' — it continues to 'created for good works.' The passage is a unity.\n\nThe SDA position is not works-based salvation. We affirm with all our hearts that salvation is by grace through faith. But we insist, with James, that 'faith without works is dead' (James 2:26). Genuine saving faith always produces obedience as its fruit. We are saved by faith alone, but the faith that saves is never alone.\n\nRemember: the question is not whether faith saves — it does. The question is what kind of faith saves. Dead faith or living faith? A faith that transforms or a faith that merely assents?",
    avatarPresence:
      "The Evangelical leans forward with passion, opening to Ephesians 2. 'It says RIGHT HERE — not of works! Why do you Adventists keep adding to the gospel?' Their sincerity is palpable; they genuinely believe obedience cheapens grace.",
    tacticalBriefing:
      "The Sola Fide objection rests on a false dichotomy: either faith saves OR works matter — but not both. Scripture demolishes this binary. Ephesians 2:8-10 holds both truths in perfect tension. James 2:17-26 declares faith without works dead. Revelation 14:12 describes God's end-time people as those who 'keep the commandments of God, and the faith of Jesus.' Jesus Himself said, 'If ye love me, keep my commandments' (John 14:15). The key distinction: legalism makes works the ROOT of salvation; biblical obedience makes works the FRUIT of salvation.",
    drill:
      "Write out the complete argument from Ephesians 2:8-10, showing how verses 8-9 and verse 10 form a unified thought. Then compare James 2:17-26 with Romans 3:28. Demonstrate how Paul and James complement rather than contradict each other. Finally, explain the difference between legalism (works as root) and biblical obedience (works as fruit).",
    forgeAWeapon:
      "Craft a 60-second response to the claim 'You Adventists teach works-based salvation.' Include Ephesians 2:8-10, James 2:26, and John 14:15. Practice delivering it with conviction and warmth, not defensiveness.",
    jeevesDebrief:
      "Well done, soldier. You have learned that the SDA position does not oppose Sola Fide — it completes it. We affirm justification by faith alone while insisting that genuine faith is never barren. The Evangelical who accuses us of legalism has not understood our position. Tomorrow we tackle the second great objection: Once Saved Always Saved. The stakes get higher.",
    masteryCheck: [
      {
        question: "What is the key verse that completes the argument of Ephesians 2:8-9?",
        options: [
          "Ephesians 2:7",
          "Ephesians 2:10",
          "Ephesians 3:1",
          "Ephesians 1:13"
        ],
        correctIndex: 1,
        explanation:
          "Ephesians 2:10 completes Paul's thought: we are 'created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.' Separating verses 8-9 from verse 10 distorts Paul's unified argument."
      },
      {
        question: "What is the critical distinction between legalism and biblical obedience?",
        options: [
          "Legalism uses the Old Testament; obedience uses the New Testament",
          "Legalism makes works the root of salvation; biblical obedience makes works the fruit",
          "There is no distinction — all obedience is legalism",
          "Legalism is for Jews; obedience is for Christians"
        ],
        correctIndex: 1,
        explanation:
          "Legalism treats works as the basis (root) for earning salvation. Biblical obedience recognizes works as the natural fruit of genuine saving faith — a response to grace, not a means of earning it."
      },
      {
        question: "How do Paul (Romans 3:28) and James (James 2:24) complement each other?",
        options: [
          "They contradict each other — one is wrong",
          "Paul addresses the basis of justification (faith); James addresses the evidence of justification (works)",
          "Paul wrote to Jews; James wrote to Gentiles",
          "Paul was writing about moral law; James about ceremonial law"
        ],
        correctIndex: 1,
        explanation:
          "Paul and James address different questions. Paul asks how a person is justified before God (by faith, not works). James asks how genuine faith is demonstrated (by its works/fruit). Both are inspired and harmonize perfectly."
      }
    ],
  },
  {
    day: 3,
    title: "Once Saved Always Saved: Eternal Security Examined",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(3),
    estimatedMinutes: 30,
    xpReward: getXPForDay(3),
    instructorVoice:
      "Today we confront one of Evangelicalism's most popular doctrines: Once Saved Always Saved. Also called 'eternal security' or 'perseverance of the saints,' this teaching holds that anyone genuinely saved can never lose salvation regardless of subsequent choices. The proof texts are powerful: 'And I give unto them eternal life; and they shall never perish, neither shall any man pluck them out of my hand' (John 10:28).\n\nBut notice what the text says — and what it does not say. It says no external force can remove a believer from Christ's hand. It does NOT say the believer cannot voluntarily walk away. A child held safely by a parent cannot be snatched by a stranger, but the child can choose to release the parent's hand.\n\nThe Bible is filled with warnings to genuine believers about the danger of apostasy. 'For if we sin wilfully after that we have received the knowledge of the truth, there remaineth no more sacrifice for sins' (Hebrews 10:26). The 'we' includes the writer — a genuine believer warning genuine believers about a real danger.\n\nThe SDA position offers something better than OSAS: genuine, present assurance rooted in a living relationship with Christ. You ARE saved right now as you abide in Him. Security comes not from the impossibility of leaving but from the faithfulness of the One who holds you.",
    avatarPresence:
      "The Evangelical smiles warmly. 'Once you're saved, you're always saved! Nothing can separate you from God's love — Romans 8:38-39! Why do you Adventists live in fear?' Their tone is compassionate but their theology confuses presumption with assurance.",
    tacticalBriefing:
      "Key OSAS proof texts and their proper interpretation: John 10:28-29 — protection from external threats, not from voluntary departure. Romans 8:38-39 — lists external forces; conspicuously absent is the believer's own free will. Counter with: Hebrews 6:4-6 — genuine believers who 'fall away.' Hebrews 10:26-29 — willful sin after knowledge of truth. 2 Peter 2:20-22 — those who escaped pollution returning to it. Ezekiel 18:24-26 — the righteous turning away. 1 Corinthians 9:27 — Paul himself fears disqualification.",
    drill:
      "Analyze John 10:28-29 and Romans 8:38-39 carefully. What do these texts actually promise? What threats do they address? Then list five clear biblical warnings against apostasy directed at genuine believers. For each, explain why it cannot refer to 'false believers who were never really saved.'",
    forgeAWeapon:
      "Develop a response to the OSAS escape clause: 'Anyone who falls away was never really saved in the first place.' Show why this claim is (1) unfalsifiable, (2) contradicted by the descriptions in Hebrews 6:4-5 and 2 Peter 2:20, and (3) actually provides LESS assurance than the SDA position.",
    jeevesDebrief:
      "Strong work today. You have seen that OSAS, while well-intentioned, actually undermines the very assurance it claims to provide. If anyone who falls away was 'never really saved,' then no one can ever know with certainty that they are 'really' saved until they die. Biblical assurance is far richer: you are saved NOW in Christ, and you remain saved as you continue to abide in Him. Tomorrow we tackle the Investigative Judgment — brace yourself.",
    masteryCheck: [
      {
        question: "What does John 10:28-29 actually promise believers?",
        options: [
          "That believers can never choose to leave Christ",
          "That no external force can snatch believers from Christ's hand",
          "That all professing Christians will be saved",
          "That sin no longer matters after conversion"
        ],
        correctIndex: 1,
        explanation:
          "John 10:28-29 promises protection from external threats — 'neither shall any man pluck them out of my hand.' It does not address the possibility of voluntary departure through persistent, deliberate rebellion."
      },
      {
        question: "Why does the OSAS 'never really saved' escape clause actually undermine assurance?",
        options: [
          "Because it makes salvation dependent on good behavior",
          "Because if anyone who falls away was never saved, you can never know if your faith is 'genuine enough' until you die",
          "Because it contradicts John 3:16",
          "Because it requires baptism by immersion"
        ],
        correctIndex: 1,
        explanation:
          "The 'never really saved' clause is unfalsifiable and creates perpetual uncertainty: since the only proof of 'genuine' salvation is persevering until death, no living person can ever have certainty. SDA assurance is better: you ARE saved now in Christ."
      },
      {
        question: "Which passage describes genuine believers who 'fall away' using language that cannot apply to false converts?",
        options: [
          "Matthew 7:21-23",
          "Hebrews 6:4-6",
          "1 John 2:19",
          "Revelation 3:16"
        ],
        correctIndex: 1,
        explanation:
          "Hebrews 6:4-6 describes those 'once enlightened,' who 'tasted of the heavenly gift,' were 'made partakers of the Holy Ghost,' and 'tasted the good word of God.' These are descriptions of genuine spiritual experience, not false converts."
      }
    ],
  },
  {
    day: 4,
    title: "The Investigative Judgment: Vindication, Not Condemnation",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(4),
    estimatedMinutes: 30,
    xpReward: getXPForDay(4),
    instructorVoice:
      "Today we address the doctrine Evangelicals attack most fiercely: the Investigative Judgment. They call it a 'fear doctrine,' an 'invention born of embarrassment,' and claim it has 'no biblical basis.' They are wrong on all three counts.\n\nThe Investigative Judgment is rooted in Daniel 7:9-10: 'I beheld till the thrones were cast down, and the Ancient of days did sit... the judgment was set, and the books were opened.' This judgment scene occurs BEFORE the Son of Man receives His kingdom (verses 13-14). It is a pre-Advent judgment — exactly what SDAs teach.\n\nDaniel 7:22 reveals its purpose: 'judgment was given to the saints of the most High.' The judgment is FOR the saints, not AGAINST them. It is a vindication procedure. The Day of Atonement in Leviticus 16 was not a day of terror for faithful Israel — it was the day they were cleansed and declared pure (Leviticus 16:30).\n\nAnd Revelation 14:7 declares: 'Fear God, and give glory to him; for the hour of his judgment is come.' Notice: this announcement is part of the 'everlasting gospel' (verse 6). Judgment IS gospel. For those who trust Christ, the judgment is the best news imaginable — our case is being presented by the greatest Advocate in the universe.",
    avatarPresence:
      "The Evangelical shakes their head gravely. 'The Investigative Judgment was invented to cover up the failed 1844 prophecy. It puts believers under a microscope of works-review and destroys assurance. Romans 8:1 — there is NO condemnation!' Their concern for assurance is genuine, but they misunderstand the IJ's purpose.",
    tacticalBriefing:
      "The IJ defense rests on three pillars: (1) Daniel 7:9-10, 22 — a pre-Advent judgment scene where judgment is given IN FAVOR of the saints; (2) Leviticus 16 typology — the Day of Atonement cleansed and vindicated God's people; (3) Revelation 14:6-7 — judgment proclaimed as part of the everlasting gospel. The objection that 'there is no condemnation' (Romans 8:1) actually SUPPORTS the IJ — the judgment's purpose is to announce and confirm this very verdict before the watching universe. The IJ does not determine whether God forgives us; it demonstrates to the cosmos that His forgiveness is just.",
    drill:
      "Outline the three biblical pillars of the Investigative Judgment: Daniel 7:9-10, 22; Leviticus 16:30; and Revelation 14:6-7. For each, explain how the passage supports a pre-Advent vindication judgment. Then write a response to the claim that Romans 8:1 contradicts the IJ.",
    forgeAWeapon:
      "Craft a presentation titled 'The Judgment Is Good News' that reframes the IJ from a fear doctrine to a vindication doctrine. Use Daniel 7:22, 1 John 2:1, and Revelation 14:6-7 as your three main texts. The goal: anyone hearing your presentation should feel MORE assured, not less.",
    jeevesDebrief:
      "Outstanding work. The Investigative Judgment is not the Achilles' heel of Adventism — it is one of our greatest strengths when properly understood. It answers the question the universe asks: 'Is God fair?' Yes, He is. He opens the books not because He needs information but because He is transparent. He invites the universe to verify His justice. Tomorrow we turn to the Sabbath — the most emotionally charged topic of all.",
    masteryCheck: [
      {
        question: "According to Daniel 7:22, what is the purpose of the pre-Advent judgment?",
        options: [
          "To condemn sinners",
          "To determine who deserves heaven",
          "Judgment was given IN FAVOR of the saints of the Most High",
          "To review and revoke salvation from the unworthy"
        ],
        correctIndex: 2,
        explanation:
          "Daniel 7:22 states 'judgment was given to the saints of the most High.' The pre-Advent judgment vindicates God's people — it is rendered in their favor, not against them."
      },
      {
        question: "How does Revelation 14:6-7 frame the judgment?",
        options: [
          "As a warning of destruction",
          "As part of the everlasting gospel — judgment is good news",
          "As something to fear and dread",
          "As applicable only to non-believers"
        ],
        correctIndex: 1,
        explanation:
          "Revelation 14:7's announcement that 'the hour of his judgment is come' is part of the 'everlasting gospel' (verse 6). Judgment is presented as gospel — good news for those who trust Christ."
      },
      {
        question: "How does Romans 8:1 relate to the Investigative Judgment?",
        options: [
          "It contradicts and disproves the IJ",
          "It is irrelevant to the IJ",
          "The IJ's purpose is to announce and confirm this very verdict — 'no condemnation' — before the universe",
          "It only applies before the IJ begins"
        ],
        correctIndex: 2,
        explanation:
          "Romans 8:1 ('no condemnation for those in Christ Jesus') does not contradict the IJ — it IS the verdict the IJ announces. The judgment publicly demonstrates and confirms that Christ's people are covered by His blood."
      }
    ],
  },
  {
    day: 5,
    title: "The Sabbath: Creation to Eternity",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(5),
    estimatedMinutes: 30,
    xpReward: getXPForDay(5),
    instructorVoice:
      "Today we engage the most emotionally charged subject in Evangelical-SDA dialogue: the seventh-day Sabbath. Evangelicals raise four primary objections: (1) The Sabbath was only for Jews; (2) Colossians 2:16 abolishes it; (3) The early church worshiped on Sunday; (4) Hebrews 4 spiritualizes it into 'rest in Christ.' Each objection crumbles under biblical examination.\n\nBegin at the beginning: 'And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made' (Genesis 2:3). The Sabbath was established at creation — before sin, before Israel, before Sinai, before any Jew existed. It is a creation ordinance for all humanity.\n\nJesus confirmed this: 'The sabbath was made for man, and not man for the sabbath' (Mark 2:27). The Greek word for 'man' is anthropos — generic humankind, not 'Jew.' Jesus then declared Himself 'Lord also of the sabbath' (Mark 2:28), elevating rather than abolishing it.\n\nAnd the prophet Isaiah sees the Sabbath extending into eternity: 'For as the new heavens and the new earth, which I will make, shall remain before me, saith the LORD, so shall your seed and your name remain. And it shall come to pass, that from one new moon to another, and from one sabbath to another, shall all flesh come to worship before me, saith the LORD' (Isaiah 66:22-23). A doctrine bookended by creation and new creation cannot be temporary.",
    avatarPresence:
      "The Evangelical opens to Colossians 2:16 with practiced confidence. 'Let no man therefore judge you in meat, or in drink, or in respect of an holyday, or of the new moon, or of the sabbath days — Paul himself says the Sabbath is abolished!' Their go-to text feels like an ace up the sleeve.",
    tacticalBriefing:
      "The Sabbath defense has four anchors: (1) Creation origin — Genesis 2:2-3 establishes the Sabbath millennia before Sinai; (2) Universal scope — Mark 2:27 says it was made for 'man' (anthropos), not Jews; (3) Colossians 2:16 context — the passage addresses ceremonial sabbaths in the festivals-new moons-sabbaths sequence (cf. Ezekiel 45:17; Hosea 2:11), not the weekly creation Sabbath; (4) Eternal duration — Isaiah 66:22-23 and Hebrews 4:9 (sabbatismos = Sabbath-keeping) confirm the Sabbath persists into the new earth. No biblical text transfers the seventh day's sanctity to Sunday.",
    drill:
      "Trace the Sabbath from creation to eternity using Genesis 2:2-3, Exodus 20:8-11, Mark 2:27-28, Matthew 24:20, Acts 13:42-44; 17:2; 18:4, Hebrews 4:9, and Isaiah 66:22-23. Then dismantle the Colossians 2:16 objection by showing the ceremonial context (festivals, new moons, sabbaths sequence) and Paul's own Sabbath-keeping in Acts.",
    forgeAWeapon:
      "Create a 'Sabbath Timeline' weapon that traces the Sabbath from Genesis 2 through the prophets, Jesus, the apostles, and into the new earth. Include the key verse at each point. This visual argument demolishes the 'Jewish and temporary' claim at a glance.",
    jeevesDebrief:
      "Excellent work, soldier. The Sabbath is one of our strongest doctrines because it is anchored at both ends of history — creation and new creation. No temporary institution spans from Eden to eternity. Tomorrow we examine the 'law abolished' claim, and then on Day 7 we synthesize all five subjects into a unified defense. The foundation is being laid well.",
    masteryCheck: [
      {
        question: "When was the seventh-day Sabbath established according to Scripture?",
        options: [
          "At Mount Sinai with the giving of the law",
          "At creation, before sin, Israel, or Sinai existed (Genesis 2:2-3)",
          "During the wilderness wandering with the manna",
          "By the early Christian church in the first century"
        ],
        correctIndex: 1,
        explanation:
          "Genesis 2:2-3 records God resting on, blessing, and sanctifying the seventh day at creation — before any nation, covenant, or ceremonial system existed. The Sabbath is a creation ordinance for all humanity."
      },
      {
        question: "What does Colossians 2:16 actually address?",
        options: [
          "The weekly seventh-day Sabbath specifically",
          "All religious observance whatsoever",
          "Ceremonial sabbaths in the festivals-new moons-sabbaths sequence of the Jewish liturgical calendar",
          "The Christian practice of Sunday worship"
        ],
        correctIndex: 2,
        explanation:
          "Colossians 2:16-17 addresses ceremonial observances — 'meat, drink, holyday, new moon, sabbath days' — the same ascending sequence found in Ezekiel 45:17, Hosea 2:11, and 1 Chronicles 23:31, which refers to the ceremonial calendar, not the weekly creation Sabbath."
      },
      {
        question: "What does the Greek word 'sabbatismos' in Hebrews 4:9 mean?",
        options: [
          "Spiritual rest in Christ without any specific day",
          "The end of all Sabbath observance",
          "A Sabbath-keeping — the only time this word appears in the New Testament, affirming ongoing Sabbath observance",
          "Sunday worship in honor of the resurrection"
        ],
        correctIndex: 2,
        explanation:
          "Hebrews 4:9 uses the unique Greek word 'sabbatismos,' which specifically means 'a Sabbath-keeping' or 'Sabbath rest observance.' This is distinct from the general 'rest' (katapausis) used elsewhere in the chapter, affirming ongoing literal Sabbath observance."
      }
    ],
  },
  {
    day: 6,
    title: "Law Abolished: Grace Establishes the Law",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(6),
    estimatedMinutes: 30,
    xpReward: getXPForDay(6),
    instructorVoice:
      "Today we tackle the claim that Christ abolished the entire law at the cross. This is perhaps the most theologically dangerous Evangelical error, because it removes the very standard that defines sin and makes grace necessary. If there is no law, there is no transgression (Romans 4:15). If there is no transgression, there is no need for a Savior. Abolishing the law does not exalt grace — it destroys the foundation grace is built upon.\n\nThe Evangelical arsenal includes Colossians 2:14, Ephesians 2:15, and Romans 6:14. Each of these, properly understood, addresses the ceremonial law or the certificate of debt — not the Ten Commandments. But before examining these texts, hear Jesus Himself: 'Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil. For verily I say unto you, Till heaven and earth pass, one jot or one tittle shall in no wise pass from the law, till all be fulfilled' (Matthew 5:17-18).\n\nHave heaven and earth passed away? No. Then not one jot or tittle has passed from the law. Jesus could not have been more explicit. And Paul agrees: 'Do we then make void the law through faith? God forbid: yea, we establish the law' (Romans 3:31).\n\nThe key is distinguishing the moral law (Ten Commandments — eternal, reflecting God's character, placed inside the Ark) from the ceremonial law (Mosaic ordinances — temporary, pointing to Christ, placed beside the Ark). Scripture itself makes this distinction.",
    avatarPresence:
      "The Evangelical flips rapidly between Colossians, Ephesians, and Romans. 'Nailed to the cross! Abolished in His flesh! Not under law but under grace! How much clearer can it be?' Their rapid-fire proof-texting feels overwhelming but collapses under contextual examination.",
    tacticalBriefing:
      "Three-text defense: (1) Colossians 2:14 — 'handwriting of ordinances' (cheirographon tois dogmasin) is a certificate of debt, not the Ten Commandments. God nailed our debt to the cross, not His moral law. (2) Ephesians 2:15 — 'law of commandments in ordinances' refers to ceremonial laws creating the Jew-Gentile barrier, not the moral law. (3) Romans 6:14 — 'not under law but under grace' does not mean 'free to break the law'; the very next verse says 'Shall we sin because we are not under law? God forbid!' (Romans 6:15). The moral law is distinguished from the ceremonial law by placement (inside vs. beside the Ark), authorship (God's finger vs. Moses' hand), and function (eternal standard vs. temporary type).",
    drill:
      "Analyze Colossians 2:14, Ephesians 2:15, and Romans 6:14-15 in their full contexts. For each, identify: (a) what 'law' is being discussed, (b) the immediate context, and (c) why the passage does not abolish the Ten Commandments. Then present the three biblical distinctions between the moral and ceremonial law (placement, authorship, function).",
    forgeAWeapon:
      "Create a two-column comparison chart: 'The Law of God' (moral law) vs. 'The Law of Moses' (ceremonial law). Include: where each was written, by whom, where stored, function, and New Testament status. Scripture references for every point.",
    jeevesDebrief:
      "Powerful work today. The 'law abolished' claim is the linchpin of the entire Evangelical anti-SDA system. If the law still stands, the Sabbath still stands. If the law still stands, sin is still defined, and grace is still needed. Removing this one error causes the entire anti-SDA framework to wobble. Tomorrow we synthesize all five subjects into a unified overview. Week 1 is nearly complete.",
    masteryCheck: [
      {
        question: "What does the Greek word 'cheirographon' in Colossians 2:14 mean?",
        options: [
          "The Ten Commandments written by God's finger",
          "A handwritten certificate of debt — the record of our sins",
          "The entire Old Testament",
          "The covenant God made with Abraham"
        ],
        correctIndex: 1,
        explanation:
          "The Greek 'cheirographon' means 'a handwritten document' — specifically, a certificate of debt. God nailed our record of sin-debt to the cross, not His own moral law. The Ten Commandments were written by God's finger, not by human handwriting."
      },
      {
        question: "According to Jesus in Matthew 5:17-18, what would have to happen before the law passes away?",
        options: [
          "The crucifixion must occur",
          "The church must vote to change it",
          "Heaven and earth must pass away",
          "The Holy Spirit must replace it"
        ],
        correctIndex: 2,
        explanation:
          "Jesus said 'Till heaven and earth pass, one jot or one tittle shall in no wise pass from the law.' Since heaven and earth have not passed away, the law remains in full force."
      },
      {
        question: "What are the three biblical distinctions between the moral law and the ceremonial law?",
        options: [
          "Language, date, and audience",
          "Placement (inside vs. beside the Ark), authorship (God's finger vs. Moses' hand), function (eternal standard vs. temporary type)",
          "Length, complexity, and relevance",
          "Old Testament vs. New Testament location"
        ],
        correctIndex: 1,
        explanation:
          "Scripture distinguishes the moral law from the ceremonial law by: (1) Placement — Ten Commandments inside the Ark (Deuteronomy 10:5) vs. Book of the Law beside the Ark (Deuteronomy 31:26); (2) Authorship — God's finger (Exodus 31:18) vs. Moses' hand (Deuteronomy 31:24); (3) Function — eternal moral standard vs. temporary typological system fulfilled in Christ."
      }
    ],
  },
  {
    day: 7,
    title: "Week 1 Synthesis: The Unified SDA Defense",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(7),
    estimatedMinutes: 30,
    xpReward: getXPForDay(7),
    instructorVoice:
      "Congratulations, soldier. You have completed your first week of deep dives into the five major Evangelical objections. Today we synthesize everything into a unified framework. Remember: these objections are not isolated — they form an interconnected system. 'Law abolished' supports 'anti-Sabbath.' 'Sola Fide' fuels 'OSAS.' 'Anti-IJ' reinforces 'faith without works.' Your defense must likewise be systematic.\n\nThe SDA position is beautifully coherent: God's moral law is eternal (Matthew 5:17-18; Romans 3:31). The Sabbath is part of that eternal law (Genesis 2:2-3; Isaiah 66:22-23). We are saved by grace through faith (Ephesians 2:8-9), which produces obedience as its fruit (Ephesians 2:10; James 2:26). Salvation is secure in Christ as we abide in Him (John 15:4), but can be forfeited through persistent, deliberate rebellion (Hebrews 6:4-6; 10:26). The pre-Advent judgment vindicates God's people (Daniel 7:22; Revelation 14:6-7).\n\n'To the law and to the testimony: if they speak not according to this word, it is because there is no light in them' (Isaiah 8:20). Every SDA distinctive is rooted in Scripture. You can defend them with confidence — and with love.\n\nNext week, we shift from understanding what Evangelicals argue to mastering the STRONGEST versions of their arguments. Steelman training begins Monday.",
    avatarPresence:
      "The Evangelical has deployed all five objections in rapid succession, creating a theological barrage designed to overwhelm. Each objection reinforces the others, creating the impression of an unassailable wall. But you now see the cracks — and you know which scriptural chisel to use on each.",
    tacticalBriefing:
      "The unified SDA defense framework: (1) The moral law stands — Matthew 5:17-18, Romans 3:31; (2) The Sabbath is part of that law and spans creation to eternity — Genesis 2:2-3, Isaiah 66:22-23; (3) Grace and obedience are partners, not enemies — Ephesians 2:8-10, Titus 2:11-14; (4) Salvation is secure in Christ but requires abiding — John 15:4, Hebrews 6:4-6; (5) The IJ vindicates the saints — Daniel 7:22, Revelation 14:6-7. Each plank supports the others. The system stands or falls together.",
    drill:
      "Write a comprehensive one-page defense that addresses all five Evangelical objections in a unified, flowing argument. Show how each SDA response connects to the others. Start with the eternal law, move to the Sabbath within that law, then show that grace empowers obedience to that law, that salvation is secure in Christ as we obey, and that the judgment vindicates those who trust Him.",
    forgeAWeapon:
      "Create a 'Five-Point Shield' reference card: one key verse for each SDA response (law stands, Sabbath eternal, grace produces obedience, assurance in abiding, judgment vindicates). Memorize all five verses. This is your rapid-deployment weapon for any Evangelical encounter.",
    jeevesDebrief:
      "Week 1 complete. You now have a solid foundation in all five Evangelical-SDA friction points. You understand what they argue and why. But understanding is not mastery. Next week we will train you to handle the STRONGEST versions of each argument — the steelman versions. Any opponent can beat a straw man; only a true soldier can beat a steelman. Rest up, soldier. Week 2 raises the stakes considerably.",
    masteryCheck: [
      {
        question: "How do the five Evangelical objections interconnect?",
        options: [
          "They are completely independent arguments with no relationship to each other",
          "They form a coherent system: 'law abolished' supports 'anti-Sabbath'; 'sola fide' fuels 'OSAS'; 'anti-IJ' reinforces 'faith without works'",
          "They only apply to Calvinist Evangelicals",
          "They all depend solely on Colossians 2:16"
        ],
        correctIndex: 1,
        explanation:
          "The five objections form an interconnected theological system. Each reinforces the others: if the law is abolished, the Sabbath falls. If faith excludes works, OSAS follows logically. Understanding these connections allows for a systematic defense."
      },
      {
        question: "What is the key verse that anchors the SDA unified defense on the law?",
        options: [
          "Genesis 1:1",
          "Matthew 5:17-18 — Jesus declares He came not to destroy the law",
          "Acts 2:1",
          "Revelation 22:21"
        ],
        correctIndex: 1,
        explanation:
          "Matthew 5:17-18 is the cornerstone: Jesus explicitly declares He did not come to destroy the law and that not one jot or tittle will pass until heaven and earth pass away. This anchors the entire SDA defense of the law's continuity."
      },
      {
        question: "According to Isaiah 8:20, what is the standard for testing truth claims?",
        options: [
          "The majority opinion of Christian scholars",
          "Personal experience and testimony",
          "'To the law and to the testimony: if they speak not according to this word, there is no light in them'",
          "The traditions of the church fathers"
        ],
        correctIndex: 2,
        explanation:
          "Isaiah 8:20 establishes Scripture — 'the law and the testimony' — as the objective standard for testing all truth claims. This is the foundational principle for SDA apologetics: every doctrine must be rooted in the Word of God."
      }
    ],
  },
];

export const evangelicalTrack: WarCollegeTrack = {
  avatarId: "evangelical",
  avatarName: "The Evangelical",
  emoji: "\u271D\uFE0F",
  color: "text-blue-400",
  warfareType: "scriptural-revisionists",
  description:
    "An intensive 56-day training curriculum equipping SDA apologists to engage mainstream Evangelical Protestant objections with biblical precision, theological depth, and Christlike grace.",
  days,
};
