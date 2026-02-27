// ─── War College: Jehovah's Witness 56-Day Training Track ─────────────────────
// SDA counter-apologetics War College curriculum for engaging JW theology.

import type { WarCollegeTrack, WarCollegeDay } from "../warCollegeTypes";
import { getDifficultyTier, getXPForDay } from "../warCollegeTypes";

const days: WarCollegeDay[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // WEEK 1: SUBJECT DEEP DIVES — JW vs SDA Theology
  // ════════════════════════════════════════════════════════════════════════════

  // ── Day 1 ──────────────────────────────────────────────────────────────────
  {
    day: 1,
    title: "The 144,000: Literal Number or Symbolic Seal?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(1),
    estimatedMinutes: 25,
    xpReward: getXPForDay(1),
    instructorVoice:
      "Soldier, today thou dost enter the War College to face one of the most carefully constructed doctrinal systems in the modern religious world. The Jehovah's Witness organization hath built an entire salvation framework upon a single number — 144,000 — drawn from the apocalyptic visions of the Revelation. They teach that only this precise count of 'anointed' believers shall ascend to heaven, while the 'great multitude' remaineth upon a paradise earth forever.\n\nBut mark well the text from which they draw this teaching. Revelation chapter seven presenteth this number in the midst of intensely symbolic imagery — twelve tribes, twelve thousand from each, sealed upon their foreheads. The book of Revelation employeth symbolic numbers throughout: seven churches, seven seals, seven trumpets, twenty-four elders, a thousand years. Yet the Watchtower insisteth that 144,000 alone must be taken as a literal, mathematical count.\n\nConsider the words of our Lord in John 10:16: 'And other sheep I have, which are not of this fold: them also I must bring, and they shall hear my voice; and there shall be one fold, and one shepherd.' One fold. One shepherd. Not two classes, not two destinies — one unified people of God.\n\nThy task today is to understand the JW position thoroughly before thou dost engage it. Know thy adversary's argument better than he knoweth it himself, and the truth shall be thy sword.",
    avatarPresence:
      "The Jehovah's Witness avatar steps forward with a well-worn New World Translation, opening directly to Revelation 7:4. 'The number is specific — 144,000. Jehovah does not deal in vague symbolism when He gives a precise figure. These are the anointed who rule with Christ in heaven. The great multitude in verse 9 are a separate group — an earthly class. This is Jehovah's arrangement.'",
    tacticalBriefing:
      "The JW two-class salvation system (heavenly anointed vs. earthly other sheep) was formalized by J.F. Rutherford in 1935. Before that, all Bible Students expected to go to heaven. This doctrine has no precedent in Christian history prior to the Watchtower. Your tactical objective today is to understand why JWs hold to a literal 144,000, identify the selective literalism at work, and prepare a foundation-level response from Scripture. Key texts: Revelation 7:4-9, Revelation 14:1-4, John 10:16, Ephesians 4:4.",
    drill:
      "Read Revelation 7:1-17 in the KJV. List every symbolic element you find (tribes, seals, angels, winds, etc.). Then answer: If 144,000 is literal, must the twelve tribes listed also be literal? Must the sealed all be male Jewish virgins (Rev 14:4)? Write a one-paragraph summary explaining why the number is best understood as symbolic of the completeness of God's end-time people.",
    forgeAWeapon:
      "Craft a 'Selective Literalism Exposer' — a concise argument (3-5 sentences) that demonstrates the JW must either take ALL details of the 144,000 literally (male, Jewish, virgin, from exactly 12 named tribes) or acknowledge that the number is part of Revelation's symbolic language. This weapon forces consistency.",
    jeevesDebrief:
      "Well done on your first day, soldier. The key insight to carry forward is this: the JW interpretation of 144,000 requires a hermeneutical inconsistency that collapses under its own weight. They literalize the number but symbolize every other detail in the same passage. When you encounter this in the field, your strongest move is to ask a simple question: 'If 144,000 is literal, are they all male Jewish virgins from exactly twelve tribes?' The answer will reveal the interpretive double standard. Tomorrow we press deeper into NWT translation issues.",
    masteryCheck: [
      {
        question:
          "When did the Watchtower formally adopt the two-class salvation system (heavenly anointed vs. earthly other sheep)?",
        options: [
          "In the first century, taught by the apostles",
          "At the Council of Nicaea in 325 AD",
          "In 1935 under J.F. Rutherford",
          "In 1879 when Charles Taze Russell founded the Watch Tower",
        ],
        correctIndex: 2,
        explanation:
          "J.F. Rutherford formalized the two-class system in 1935. Before this, all Bible Students (early JWs) expected to be part of the heavenly class. This doctrine has no precedent in Christian history prior to the Watchtower organization.",
      },
      {
        question:
          "What does John 10:16 teach about the destiny of Christ's followers?",
        options: [
          "There are two separate flocks with two different shepherds",
          "The 'other sheep' are an earthly class distinct from the heavenly anointed",
          "There shall be one fold and one shepherd — unity of all believers",
          "Only 144,000 sheep will hear His voice",
        ],
        correctIndex: 2,
        explanation:
          "John 10:16 (KJV) states: 'And other sheep I have, which are not of this fold: them also I must bring, and they shall hear my voice; and there shall be one fold, and one shepherd.' Jesus teaches one unified people, not two classes with different eternal destinies.",
      },
      {
        question:
          "Why is the JW interpretation of 144,000 considered 'selective literalism'?",
        options: [
          "Because they take the entire book of Revelation literally",
          "Because they literalize the number 144,000 but symbolize other details in the same passage (male, Jewish, virgin, twelve tribes)",
          "Because they reject all symbolic interpretation of Revelation",
          "Because they apply the number to Gentile believers instead of Jewish believers",
        ],
        correctIndex: 1,
        explanation:
          "JWs insist 144,000 is a literal number but do not require the 144,000 to be literal male Jewish virgins from exactly twelve named tribes (Revelation 14:1-4). This inconsistency — literalizing one detail while symbolizing others in the same context — is selective literalism.",
      },
    ],
  },

  // ── Day 2 ──────────────────────────────────────────────────────────────────
  {
    day: 2,
    title: "The New World Translation: Faithful Rendering or Theological Edit?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(2),
    estimatedMinutes: 28,
    xpReward: getXPForDay(2),
    instructorVoice:
      "Soldier, today we examine the primary weapon in the JW arsenal — their own Bible translation. The New World Translation, first published in 1961, is presented by the Watchtower as the most accurate modern Bible. But a careful examination revealeth a pattern of theological editing that serveth organizational doctrine rather than textual fidelity.\n\nConsider the gravity of this matter. Proverbs 30:5-6 declareth: 'Every word of God is pure: he is a shield unto them that put their trust in him. Add thou not unto his words, lest he reprove thee, and thou be found a liar.' And Revelation 22:18-19 pronounceth a solemn warning against adding to or taking away from the words of Scripture.\n\nThe NWT containeth three categories of alteration: insertions (adding 'other' in Colossians 1:16-17), mistranslations (rendering John 1:1 as 'a god'), and unsupported substitutions (inserting 'Jehovah' 237 times into the New Testament without a single Greek manuscript containing the Tetragrammaton in those locations).\n\nThy task is not to attack a translation for the sake of attack, but to learn precisely where and how the NWT departeth from the Greek and Hebrew text, so that thou canst redirect any conversation from 'my translation vs. your translation' to what the original languages actually require.",
    avatarPresence:
      "The Jehovah's Witness avatar holds the NWT with visible pride. 'The New World Translation is the most accurate Bible available. Unlike Trinitarian translations that impose their theology on the text, the NWT lets the Bible speak for itself. John 1:1 correctly reads \"the Word was a god\" — the Greek grammar demands it. And we have restored Jehovah's name to its rightful place in the Christian Greek Scriptures.'",
    tacticalBriefing:
      "The NWT is the foundation of JW apologetics — nearly every distinctive JW doctrine depends on NWT-specific renderings. If you can demonstrate that the NWT alters the text to fit theology (rather than deriving theology from the text), you undermine the entire doctrinal structure. Focus today on three key alterations: (1) 'a god' in John 1:1, (2) insertion of 'other' in Colossians 1:16-17, (3) insertion of 'Jehovah' 237 times in the NT. Key Greek grammar: Colwell's Rule, anarthrous predicate nominative, qualitative vs. indefinite nouns.",
    drill:
      "Compare John 1:1 in the KJV, ESV, NASB, and NWT. Then research Colwell's Rule (1933): a definite predicate nominative that precedes the verb usually lacks the article. Write a paragraph explaining why theos in John 1:1c is qualitative ('the Word was divine in nature / was God in essence') rather than indefinite ('a god'). Bonus: find three other places in John 1 where theos is anarthrous and the NWT translates it as 'God' (not 'a god').",
    forgeAWeapon:
      "Craft an 'NWT Inconsistency Probe' — identify at least three verses in the Gospel of John where the NWT translates anarthrous theos as 'God' (John 1:6, 1:12, 1:13, 1:18a) but then translates it as 'a god' in John 1:1c. This demonstrates that the NWT applies different translation rules to the same grammatical construction depending on whether Jesus is the subject.",
    jeevesDebrief:
      "Excellent work, soldier. The NWT's rendering of John 1:1 is not a grammatical decision — it is a theological one. If anarthrous theos means 'a god' in John 1:1c, the NWT must apply this rule consistently throughout the New Testament. But they cannot, because it would produce polytheistic absurdities ('a god was the Father of Jesus' in verse 18, etc.). Remember: never argue 'my translation vs. your translation.' Always redirect to the Greek text. The grammar is your ally, and it demolishes 'a god.' Tomorrow we engage the question: Is Jesus Michael the Archangel?",
    masteryCheck: [
      {
        question:
          "What is Colwell's Rule and how does it apply to John 1:1?",
        options: [
          "It states that any noun without the article must be translated with 'a' — supporting the NWT's 'a god'",
          "It states that a definite predicate nominative before the verb usually lacks the article — meaning theos in John 1:1c is qualitative or definite, not indefinite",
          "It states that Greek grammar is too ambiguous to determine the meaning of John 1:1",
          "It states that only nouns with the definite article can refer to God",
        ],
        correctIndex: 1,
        explanation:
          "Colwell's Rule (1933) demonstrates that a definite predicate nominative preceding the verb typically drops the article. In John 1:1c, theos precedes the verb (en), and Colwell's Rule indicates it is qualitative ('the Word was fully divine in nature') or definite — not indefinite ('a god').",
      },
      {
        question:
          "How many times does the NWT insert 'Jehovah' into the New Testament, and what is the manuscript basis for this?",
        options: [
          "237 times, based on over 100 Greek manuscripts containing the Tetragrammaton",
          "237 times, but no Greek NT manuscript contains the Tetragrammaton — the NWT relies on medieval Hebrew translations of the NT",
          "50 times, based on the Dead Sea Scrolls",
          "237 times, based on the Septuagint",
        ],
        correctIndex: 1,
        explanation:
          "The NWT inserts 'Jehovah' 237 times into the New Testament. Not a single one of the 5,800+ extant Greek NT manuscripts contains the Tetragrammaton. The Watchtower's 'J-references' are medieval and modern Hebrew translations of the NT — secondary sources, not original manuscripts.",
      },
    ],
  },

  // ── Day 3 ──────────────────────────────────────────────────────────────────
  {
    day: 3,
    title: "Is Jesus Michael the Archangel?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(3),
    estimatedMinutes: 27,
    xpReward: getXPForDay(3),
    instructorVoice:
      "Soldier, today we confront one of the most striking claims in JW theology: that Jesus Christ is Michael the Archangel. This identification is central to the Watchtower system because it reduces Jesus from eternal God to the highest created angel — a being with a beginning, made by Jehovah before all other creation.\n\nThe Watchtower citeth several passages in support: Daniel 10:13 and 12:1 (Michael as 'one of the chief princes' and the great prince who stands for God's people), 1 Thessalonians 4:16 (the Lord descending 'with the voice of the archangel'), and Jude 9 (Michael the archangel). They argue that since Michael leads heaven's armies and Jesus leads heaven's armies, they must be the same being.\n\nBut consider the weight of Hebrews chapter one. The entire argument of that chapter is built upon the categorical superiority of Christ over all angels. Verse 5 declareth: 'For unto which of the angels said he at any time, Thou art my Son, this day have I begotten thee?' If Jesus were Michael — an angel — this rhetorical question would have an answer, and the entire argument of Hebrews 1 would collapse.\n\nFurthermore, Jude 9 recordeth that Michael 'durst not bring against him a railing accusation, but said, The Lord rebuke thee.' Michael invoketh the Lord's authority. But Jesus Himself rebuketh Satan directly: 'Get thee hence, Satan' (Matthew 4:10). One defers to a higher authority; the other exercises that authority.",
    avatarPresence:
      "The Jehovah's Witness avatar opens to 1 Thessalonians 4:16 with confidence. 'When Jesus returns, he descends with the voice of the archangel. Why would Jesus use the voice of the archangel unless He IS the archangel? Daniel 12:1 calls Michael the great prince who stands for God's people — exactly what Jesus does. The evidence is clear: Jesus is Michael in his heavenly role.'",
    tacticalBriefing:
      "The Jesus=Michael doctrine has no support in mainstream Christianity and rests on circumstantial parallels rather than direct identification. Your tactical approach: (1) Show that Hebrews 1 categorically distinguishes Jesus from all angels; (2) Demonstrate that Michael defers to the Lord's authority (Jude 9) while Jesus exercises divine authority directly; (3) Point out that 1 Thessalonians 4:16 says Jesus descends 'with' the voice of the archangel — the preposition 'with' (en) does not mean 'as.' Key texts: Hebrews 1:4-14, Jude 9, Matthew 4:10, 1 Thessalonians 4:16.",
    drill:
      "Read Hebrews 1:1-14 in the KJV. List every statement made about the Son that distinguishes Him from angels. Then read Jude 9 and Matthew 4:10 side by side. Write a comparison showing how Michael defers to the Lord's authority while Jesus exercises authority over Satan directly. Finally, examine 1 Thessalonians 4:16 — does the preposition 'with' (en) require identification, or can it indicate accompaniment?",
    forgeAWeapon:
      "Craft a 'Hebrews 1 Challenge' — a structured argument using Hebrews 1:5-8 to demonstrate that the Son is categorically distinguished from all angels. Include the rhetorical question of verse 5 ('unto which of the angels said he at any time, Thou art my Son?'), the worship command of verse 6 ('let all the angels of God worship him'), and the throne declaration of verse 8 ('Thy throne, O God, is for ever and ever'). If Jesus is Michael, each of these verses becomes a contradiction.",
    jeevesDebrief:
      "Solid work, soldier. The Jesus=Michael identification crumbles under the weight of Hebrews 1, which exists precisely to refute any equation of Christ with angels. Remember this principle: the JW argument relies on parallel roles (both Michael and Jesus lead heavenly armies), but parallel function does not prove identical identity. Many generals lead armies — that does not make them the same person. The biblical text explicitly distinguishes Christ from angels, and that distinction is your strongest weapon. Tomorrow we enter the doctrine of the soul and the JW denial of hell.",
    masteryCheck: [
      {
        question:
          "What is the primary argument of Hebrews chapter 1?",
        options: [
          "That Jesus is the greatest of all angels, including Michael",
          "That Jesus is categorically superior to all angels — He is the Son, not an angel",
          "That angels and Jesus share the same divine nature",
          "That Michael the archangel was promoted to become the Son of God",
        ],
        correctIndex: 1,
        explanation:
          "Hebrews 1 argues that Jesus is categorically above all angels. He is called 'Son' (v.5), worshipped by angels (v.6), addressed as 'God' (v.8), and credited with creating the heavens (v.10). The entire chapter distinguishes Jesus FROM angels, not as one of them.",
      },
      {
        question:
          "How does Jude 9 distinguish Michael from Jesus in the exercise of authority?",
        options: [
          "Michael rebukes Satan directly, just as Jesus does",
          "Michael says 'The Lord rebuke thee,' deferring to a higher authority, while Jesus rebukes Satan directly in His own authority (Matt 4:10)",
          "Michael and Jesus both defer to the Father's authority equally",
          "Jude 9 explicitly identifies Michael as Jesus in a pre-incarnate role",
        ],
        correctIndex: 1,
        explanation:
          "In Jude 9, Michael 'durst not bring against him a railing accusation, but said, The Lord rebuke thee' — deferring to a higher authority. Jesus, by contrast, commands Satan directly: 'Get thee hence, Satan' (Matt 4:10). This difference in authority exercise demonstrates they are not the same being.",
      },
    ],
  },

  // ── Day 4 ──────────────────────────────────────────────────────────────────
  {
    day: 4,
    title: "No Hell? The JW Doctrine of Soul Annihilation",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(4),
    estimatedMinutes: 26,
    xpReward: getXPForDay(4),
    instructorVoice:
      "Soldier, today we examine a point where JW and SDA theology share some common ground, yet diverge in critical ways. Both Jehovah's Witnesses and Seventh-day Adventists reject the doctrine of eternal conscious torment — the popular notion of hell as an ever-burning place of suffering. Both traditions affirm that the dead are unconscious (Ecclesiastes 9:5) and that the wicked face ultimate destruction rather than endless torture.\n\nWhere we agree: the soul is not inherently immortal. Genesis 2:7 teacheth that man 'became a living soul' — the soul is the whole person, not an immaterial component that survives death. Ezekiel 18:4 confirmeth: 'The soul that sinneth, it shall die.' JWs and SDAs both reject the Platonic concept of an immortal soul imported into Christianity from Greek philosophy.\n\nWhere we diverge: the JW position denieth any form of post-death consciousness and rejecteth the SDA understanding of a final, post-millennial judgment. SDAs teach that the wicked are resurrected at the end of the millennium, face the great white throne judgment (Revelation 20:11-15), and are consumed by fire — a punishment that is eternal in its consequences but not in its duration. The JW position also ties soul-sleep to their broader denial of Christ's divine nature, arguing that Jesus ceased to exist between His death and resurrection.\n\nThy task today is to identify the areas of agreement, sharpen the areas of disagreement, and ensure that when thou dost debate a JW on this topic, thou dost not accidentally concede ground on Christ's divinity while agreeing on soul mortality.",
    avatarPresence:
      "The Jehovah's Witness avatar nods approvingly. 'At least Adventists understand that hellfire is a lie. The churches of Christendom teach that a loving God tortures people forever — that is a slander against Jehovah's name. When you die, you cease to exist. There is no immortal soul, no spirit that lives on. Even Jesus was completely dead for three days — he did not exist in any form until Jehovah re-created him.'",
    tacticalBriefing:
      "This is a nuanced engagement. You agree with JWs on soul mortality and the rejection of eternal torment, but you must guard against two JW overreaches: (1) the claim that Jesus ceased to exist at death (denying His divinity), and (2) the denial of a final judgment involving conscious awareness. SDAs affirm conditional immortality — immortality is a gift bestowed at the resurrection (1 Corinthians 15:53-54), not an inherent property of the soul. Key SDA distinctives: the post-millennial judgment (Rev 20:11-15), the consuming fire that results in permanent destruction (Malachi 4:1-3), and the preservation of Christ's divine nature even through death.",
    drill:
      "Read Ecclesiastes 9:5-6, Ezekiel 18:4, and Genesis 2:7 in the KJV. Write one paragraph explaining the SDA position on conditional immortality. Then read Revelation 20:11-15 and Malachi 4:1-3. Write a second paragraph explaining the SDA view of final judgment. Finally, address the JW claim that Jesus 'ceased to exist' at death — using Colossians 2:9 and John 2:19-21 to show that Christ's divine nature persisted through death.",
    forgeAWeapon:
      "Craft an 'Agreement-with-Distinction' argument — a response that acknowledges common ground on soul mortality while firmly distinguishing the SDA position from the JW position on three points: (1) the nature of final judgment, (2) the divine nature of Christ through death, and (3) the source of immortality (a gift at resurrection, not annihilation into nothingness).",
    jeevesDebrief:
      "Well navigated, soldier. The soul-mortality discussion is a rare opportunity to build rapport with a JW by affirming shared convictions while maintaining crucial distinctions. The most important distinction is Christological: SDAs affirm that Christ's divine nature could not be extinguished by death. He laid down His human life voluntarily (John 10:18), but He did not cease to exist. The JW position that Jesus was 're-created' by Jehovah undermines both His deity and the integrity of the resurrection. Tomorrow we confront the blood transfusion doctrine.",
    masteryCheck: [
      {
        question:
          "On what point do SDAs and JWs agree regarding death and the soul?",
        options: [
          "Both teach that the soul is inherently immortal and goes to heaven or hell at death",
          "Both reject the inherent immortality of the soul and affirm that the dead are unconscious",
          "Both teach that the wicked are eternally tormented in hell",
          "Both deny the resurrection of the dead",
        ],
        correctIndex: 1,
        explanation:
          "Both SDAs and JWs reject the doctrine of the inherently immortal soul and affirm that the dead are unconscious (Ecclesiastes 9:5). Both reject eternal conscious torment. However, they diverge on the nature of final judgment and Christ's nature through death.",
      },
      {
        question:
          "How does the SDA position on Christ's death differ from the JW position?",
        options: [
          "SDAs teach that Christ's body and soul were both annihilated, just as JWs teach",
          "SDAs affirm that Christ's divine nature persisted through death; JWs claim Jesus ceased to exist entirely and was re-created by Jehovah",
          "SDAs deny that Jesus truly died; JWs affirm a real death",
          "There is no difference between the two positions",
        ],
        correctIndex: 1,
        explanation:
          "SDAs affirm that while Christ's human life was sacrificed on the cross, His divine nature was not extinguished. JWs teach that Jesus ceased to exist entirely for three days and was then re-created by Jehovah — a position that undermines both Christ's divinity and the integrity of the resurrection.",
      },
    ],
  },

  // ── Day 5 ──────────────────────────────────────────────────────────────────
  {
    day: 5,
    title: "Blood Transfusion: Conscience or Command?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(5),
    estimatedMinutes: 28,
    xpReward: getXPForDay(5),
    instructorVoice:
      "Soldier, today we examine one of the most consequential JW doctrines — the prohibition of blood transfusions. This teaching hath resulted in the deaths of thousands of Jehovah's Witnesses, including children, who refused life-saving medical treatment based on their understanding of Scripture. It is a matter that demandeth both theological precision and pastoral sensitivity.\n\nThe Watchtower buildeth this doctrine upon three texts: Genesis 9:4 ('But flesh with the life thereof, which is the blood thereof, shall ye not eat'), Leviticus 17:14 ('Ye shall eat the blood of no manner of flesh'), and Acts 15:28-29 ('That ye abstain from... blood'). From these texts concerning the eating of blood, the Governing Body hath extrapolated a prohibition on the medical transfer of blood from one person to another — a procedure unknown in the ancient world.\n\nThe SDA approach to these texts respecteth the dietary laws while recognizing that a medical blood transfusion is fundamentally different from consuming blood as food. The biblical prohibition addressed the pagan practice of eating or drinking animal blood, often in idolatrous rituals. A transfusion is a tissue transfer — more analogous to an organ transplant than to eating blood.\n\nNote well: the Watchtower itself hath changed its position on organ transplants. From 1967 to 1980, organ transplants were banned as 'cannibalism.' This was reversed in 1980. If organ transplants are now acceptable, the theological basis for banning blood transfusions — which is the same type of tissue transfer — is inconsistent.\n\nApproach this topic with great compassion. Many JWs have lost loved ones to this doctrine. Thy goal is not to mock but to demonstrate from Scripture that the blood prohibition was about dietary practice, not medical procedure.",
    avatarPresence:
      "The Jehovah's Witness avatar becomes somber and resolute. 'This is not a matter of debate — it is a matter of obedience to Jehovah. Acts 15:29 is clear: abstain from blood. A transfusion is taking blood into your body. It does not matter whether it enters through the mouth or through a vein — the principle is the same. We would rather die faithful to Jehovah than live by violating His command. This is our sacred conscience.'",
    tacticalBriefing:
      "This is a sensitive but critical topic. The blood transfusion ban has caused real deaths, including of children. Your approach must combine biblical accuracy with pastoral compassion. Key arguments: (1) The biblical texts address eating blood as food, not medical tissue transfer; (2) Jesus taught that saving life supersedes ceremonial law (Matthew 12:11-12, Mark 2:27); (3) The Watchtower's own inconsistency on organ transplants undermines their position; (4) Acts 15:29 addresses specific first-century Gentile-Jewish fellowship concerns, not modern medicine. Always maintain respect for the sincerity of JW conviction while challenging the Watchtower's interpretation.",
    drill:
      "Read Genesis 9:4, Leviticus 17:14, and Acts 15:28-29 in the KJV. Write a paragraph explaining the original context of each blood prohibition. Then read Matthew 12:11-12 where Jesus teaches that preserving life supersedes ceremonial law. Write a second paragraph arguing that a medical blood transfusion is categorically different from consuming blood as food. Finally, research the Watchtower's reversal on organ transplants (banned 1967-1980) and explain how this inconsistency undermines the blood transfusion ban.",
    forgeAWeapon:
      "Craft a 'Life-Preserving Principle' argument — using Matthew 12:11-12 and Mark 2:27 to establish that Jesus consistently prioritized saving life over rigid ceremonial application. Then connect this principle to the blood transfusion question: if the Sabbath was made for man and not man for the Sabbath, then the blood laws were given to preserve life and holiness, not to require death when life could be saved.",
    jeevesDebrief:
      "Well done, soldier. This is perhaps the most pastorally delicate topic in JW engagement. Never approach it with triumphalism — real lives have been lost. Your strongest argument is Jesus' own hermeneutical principle: ceremonial law serves human life, not the reverse. When a JW says 'we would rather die than disobey Jehovah,' respond with compassion: 'I admire your devotion. But is Jehovah better honored by a teaching that takes life or one that preserves it? Jesus healed on the Sabbath precisely because God's law is life-giving.' Tomorrow we examine Watchtower authority claims.",
    masteryCheck: [
      {
        question:
          "What is the original context of the biblical blood prohibitions in Genesis 9:4 and Leviticus 17:14?",
        options: [
          "They prohibit all forms of contact with blood, including medical procedures",
          "They prohibit the eating or drinking of animal blood, often connected to pagan idolatrous practices",
          "They specifically address modern blood transfusions",
          "They prohibit blood sacrifice of any kind",
        ],
        correctIndex: 1,
        explanation:
          "The blood prohibitions in Genesis 9:4 and Leviticus 17:14 address the consumption of animal blood as food — a practice connected to pagan idolatrous rituals. Medical blood transfusions, which are tissue transfers unknown in the ancient world, are categorically different from eating blood.",
      },
      {
        question:
          "What principle did Jesus establish in Matthew 12:11-12 that applies to the blood transfusion debate?",
        options: [
          "That ceremonial law must be obeyed even if it costs human life",
          "That saving life supersedes rigid ceremonial application — God's laws serve human welfare",
          "That all Old Testament laws are abolished under the new covenant",
          "That medical procedures are never discussed in Scripture",
        ],
        correctIndex: 1,
        explanation:
          "In Matthew 12:11-12, Jesus taught that it is lawful to do good and save life on the Sabbath — establishing the principle that saving life supersedes rigid ceremonial application. This principle applies to the blood question: the blood laws were given to preserve holiness and life, not to require death.",
      },
    ],
  },

  // ── Day 6 ──────────────────────────────────────────────────────────────────
  {
    day: 6,
    title: "Watchtower Authority: The Faithful and Discreet Slave",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(6),
    estimatedMinutes: 30,
    xpReward: getXPForDay(6),
    instructorVoice:
      "Soldier, today we strike at the structural foundation of the entire Jehovah's Witness system — the Governing Body's claim to be the 'faithful and discreet slave' of Matthew 24:45. This is not merely a doctrinal point; it is the mechanism by which the Watchtower controls every aspect of its members' lives. Every doctrine, every practice, every prohibition floweth from this single claim: that a small group of men in Warwick, New York, constituteth Jehovah's sole channel of communication on earth.\n\nMatthew 24:45 recordeth our Lord's words: 'Who then is a faithful and wise servant, whom his lord hath made ruler over his household, to give them meat in due season?' The Watchtower readeth this not as a parable about individual faithfulness — which is its plain meaning — but as a prophecy about a specific organization that would emerge in the late 19th century.\n\nThis self-appointment is circular. The Governing Body claimeth to be the faithful slave. How do we know? Because the Governing Body saith so. What is their evidence? The NWT, which they translated. And the NWT is reliable because the Governing Body produced it. The circle hath no independent verification point.\n\nMoreover, Deuteronomy 18:20-22 provideth a clear test for any who claim to speak for God: 'When a prophet speaketh in the name of the Lord, if the thing follow not, nor come to pass, that is the thing which the Lord hath not spoken.' The Watchtower hath predicted the end of the world in 1914, 1925, 1975, and through various 'generation' calculations — all of which failed. By the biblical standard they themselves invoke, their prophetic authority is disqualified.",
    avatarPresence:
      "The Jehovah's Witness avatar speaks with institutional confidence. 'Jehovah has always had an organization on earth. In Noah's day, there was the ark. In Moses' day, the nation of Israel. In the first century, the governing body in Jerusalem. Today, the Governing Body of Jehovah's Witnesses serves as the faithful and discreet slave. Jesus appointed them in 1919 after inspecting all Christian organizations. We trust them as we trust Jehovah's arrangement.'",
    tacticalBriefing:
      "The Governing Body's authority claim is the linchpin of the entire JW system. If it falls, every distinctive JW doctrine becomes merely the opinion of fallible men. Your three-point attack: (1) Matthew 24:45 is a parable about individual faithfulness, not an organizational prophecy; (2) The Governing Body's failed predictions disqualify them under Deuteronomy 18:20-22; (3) Acts 17:11 (the Berean standard) requires testing all teaching against Scripture — a practice the Watchtower discourages. Approach with firmness but without mockery. Many JWs sincerely believe the Governing Body speaks for God.",
    drill:
      "Read Matthew 24:42-51 in the KJV as a complete unit. Note that verses 45-47 (the faithful servant) and verses 48-51 (the evil servant) form a single parable about individual readiness. Write a paragraph explaining why this parable cannot be an organizational appointment. Then list the Watchtower's major failed predictions (1914, 1925, 1975) and write a paragraph applying Deuteronomy 18:20-22 to these failures. Finally, read Acts 17:11 and write a paragraph on why testing the Governing Body's claims against Scripture is not apostasy but faithfulness.",
    forgeAWeapon:
      "Craft a 'Berean Standard Challenge' — a response to any JW appeal to Governing Body authority that redirects to Acts 17:11. The Bereans tested even Paul's teaching against Scripture and were commended for it. If Paul — an actual apostle — was subject to Scriptural testing, how much more should the Governing Body be? This weapon reframes questioning as faithfulness, not rebellion.",
    jeevesDebrief:
      "Outstanding work, soldier. The Governing Body authority claim is the JW's most protected doctrine because it is the foundation of organizational control. When you challenge it, expect strong emotional resistance. Your strongest approach is not to attack the Governing Body directly but to elevate Scripture above them: 'I respect your leaders' sincerity. But even the apostle Paul was tested by the Bereans — and God called that noble. Can we test the Governing Body's teachings by the same standard?' This approach is disarming because it appeals to a biblical example the JW cannot reject. Tomorrow we examine the 1914 doctrine.",
    masteryCheck: [
      {
        question:
          "What is the plain reading of Matthew 24:45-51 in its literary context?",
        options: [
          "A prophecy about the Watchtower Governing Body being appointed in 1919",
          "A parable about individual faithfulness and readiness for the master's return",
          "A command to establish a governing body in every church",
          "A prediction about the end of the world in 1914",
        ],
        correctIndex: 1,
        explanation:
          "Matthew 24:45-51, read in context, is a parable about individual faithfulness. It contrasts a faithful servant (vv.45-47) with an evil servant (vv.48-51) and is part of a series of parables about being ready for the master's return. It is not an organizational appointment.",
      },
      {
        question:
          "Which Watchtower predictions failed, disqualifying the Governing Body under Deuteronomy 18:20-22?",
        options: [
          "The Watchtower has never made specific date predictions",
          "Only the 1975 prediction failed; all others were fulfilled",
          "Predictions for 1914 (end of the world), 1925 (resurrection of patriarchs), and 1975 (start of millennium) all failed",
          "The predictions were fulfilled spiritually, not literally",
        ],
        correctIndex: 2,
        explanation:
          "The Watchtower predicted the end of the world in 1914 (originally the full end, later reinterpreted), the resurrection of Abraham, Isaac, and Jacob in 1925, and the beginning of the millennium in 1975. All failed. Deuteronomy 18:20-22 states that a prophet whose word does not come to pass has spoken presumptuously.",
      },
      {
        question:
          "What does the Berean example in Acts 17:11 teach about testing religious authority?",
        options: [
          "The Bereans were rebuked for questioning Paul's authority",
          "The Bereans were commended as 'more noble' because they tested Paul's teaching against Scripture daily",
          "The Bereans accepted Paul's teaching without question",
          "The Bereans rejected all apostolic authority as man-made",
        ],
        correctIndex: 1,
        explanation:
          "Acts 17:11 states that the Bereans 'were more noble than those in Thessalonica, in that they received the word with all readiness of mind, and searched the scriptures daily, whether those things were so.' They tested even apostolic teaching against Scripture — and were commended for it. This is the standard for all claims to religious authority.",
      },
    ],
  },

  // ── Day 7 ──────────────────────────────────────────────────────────────────
  {
    day: 7,
    title: "The 1914 Doctrine: Invisible Return or Invisible Error?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(7),
    estimatedMinutes: 30,
    xpReward: getXPForDay(7),
    instructorVoice:
      "Soldier, today we examine the doctrinal cornerstone upon which the Watchtower hath built its entire prophetic timeline — the claim that Jesus Christ returned invisibly in 1914. This date is calculated through a chain of interpretive steps that each requireth the previous to be correct: the destruction of Jerusalem in 607 BC (historically dated to 587 BC), the 'seven times' of Daniel 4 interpreted as 2,520 years, and the conclusion that Christ's invisible presence began in October 1914.\n\nThe chain of reasoning proceedeth thus: Nebuchadnezzar's dream in Daniel 4 of a great tree cut down for 'seven times' is interpreted not merely as seven years of the king's madness (its plain meaning), but as a prophecy of Gentile domination lasting 2,520 years. They calculate seven times as 7 x 360 prophetic days = 2,520 days, then apply the 'day-for-a-year' principle to reach 2,520 years. Starting from 607 BC, they arrive at 1914 AD.\n\nBut the foundation crumbleth at the first step. Every secular historian, every archaeological record, and even the Bible itself pointeth to 587/586 BC as the date of Jerusalem's destruction — not 607 BC. The Watchtower alone holdeth to 607 BC because their entire system requireth it. If Jerusalem fell in 587 BC, the calculation yieldeth 1934, not 1914 — and the entire prophetic framework collapses.\n\nMoreover, Daniel 4 is explicitly about Nebuchadnezzar's personal humiliation and restoration, not a coded prophecy about Gentile times. The chapter itself interpreteth the dream within its own narrative. To extract a hidden secondary fulfillment requireth assumptions that the text itself doth not support.",
    avatarPresence:
      "The Jehovah's Witness avatar produces a carefully constructed timeline chart. 'The Gentile Times ended in 1914, exactly as Bible chronology predicted. Jesus became King invisibly in heaven. Look at the evidence: World War I broke out in 1914 — the beginning of the time of the end. Pestilence, famine, earthquakes — all the signs Jesus predicted in Matthew 24 began in 1914. This is not coincidence; it is divine fulfillment.'",
    tacticalBriefing:
      "The 1914 doctrine depends on a chain with multiple weak links. You need only break one to collapse the entire calculation. Focus on: (1) Jerusalem fell in 587/586 BC, not 607 BC — the archaeological and historical evidence is overwhelming; (2) Daniel 4 is about Nebuchadnezzar's personal experience, not a coded Gentile-times prophecy; (3) An 'invisible' return cannot be verified or falsified, making it unfalsifiable; (4) The original prediction was for 1914 to be the END, not the beginning of Christ's invisible presence — it was reinterpreted after the prediction failed. Key texts: Daniel 4, Matthew 24:30 (every eye shall see), Acts 1:11, Revelation 1:7.",
    drill:
      "Read Daniel 4 in the KJV from start to finish. Note how the chapter interprets its own symbolism within the narrative (vv.24-26). Write a paragraph explaining why the 'seven times' refer to Nebuchadnezzar's seven years of madness, not a coded 2,520-year prophecy. Then research the historical dating of Jerusalem's destruction (587/586 BC) and explain why 607 BC is rejected by all non-Watchtower historians. Finally, read Matthew 24:30, Acts 1:11, and Revelation 1:7 — how do these describe Jesus' return? Is it invisible?",
    forgeAWeapon:
      "Craft a 'Chain-Link Breaker' argument focused on the 607 BC dating. The entire 1914 calculation depends on Jerusalem falling in 607 BC. Yet every line of evidence — Babylonian chronicle tablets, astronomical diaries, Egyptian synchronisms, and even the Bible's own internal chronology — points to 587/586 BC. If Jerusalem fell in 587 BC, the calculation yields 1934, and the entire Watchtower prophetic system collapses. This weapon attacks the weakest link in the chain.",
    jeevesDebrief:
      "Excellent analysis, soldier. The 1914 doctrine is remarkable in its complexity — and its fragility. It depends on a chain of assumptions where each link must hold, and the very first link (607 BC) is demonstrably wrong. When engaging a JW on this topic, do not get drawn into arguing about whether World War I 'proves' 1914. Instead, go straight to the foundation: 'Can you show me a single non-Watchtower historian, archaeologist, or scholar who dates Jerusalem's destruction to 607 BC?' The answer is no — and that silence is devastating. Week 1 concludes tomorrow with a comprehensive review.",
    masteryCheck: [
      {
        question:
          "What is the historically attested date for the destruction of Jerusalem by Nebuchadnezzar?",
        options: [
          "607 BC, as the Watchtower teaches",
          "587/586 BC, as confirmed by Babylonian chronicles, astronomical diaries, and all non-Watchtower historians",
          "605 BC, based on Daniel's captivity",
          "70 AD, when Rome destroyed the temple",
        ],
        correctIndex: 1,
        explanation:
          "The historically attested date for Nebuchadnezzar's destruction of Jerusalem is 587/586 BC. This is confirmed by Babylonian chronicle tablets, astronomical diaries, Egyptian synchronisms, and the consensus of all non-Watchtower historians and archaeologists. Only the Watchtower holds to 607 BC.",
      },
      {
        question:
          "What is the plain meaning of the 'seven times' in Daniel chapter 4?",
        options: [
          "A coded prophecy of 2,520 years of Gentile domination ending in 1914",
          "Seven literal years of Nebuchadnezzar's madness, as the chapter itself interprets",
          "Seven symbolic weeks representing the end times",
          "A prophecy about seven world empires from Babylon to the Second Coming",
        ],
        correctIndex: 1,
        explanation:
          "Daniel 4 itself interprets the 'seven times' as the period of Nebuchadnezzar's personal humiliation — seven years of madness after which his kingdom was restored (Daniel 4:24-26, 34-36). The chapter provides its own interpretation within the narrative. The Watchtower's secondary application to Gentile times is an extrapolation not supported by the text.",
      },
    ],
  },

  // ── Day 8 ──────────────────────────────────────────────────────────────────
  {
    day: 8,
    title: "Week 1 Review: Mapping the JW Doctrinal Landscape",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(8),
    estimatedMinutes: 25,
    xpReward: getXPForDay(8),
    instructorVoice:
      "Soldier, thou hast completed the first week of War College training against the Jehovah's Witness theological system. Thou hast surveyed the terrain — the 144,000 doctrine, the NWT translation, the Jesus=Michael claim, soul annihilation, the blood transfusion ban, Watchtower authority, and the 1914 doctrine. Each of these teachings formeth an interlocking component of a comprehensive theological structure.\n\nMark well this strategic insight: JW doctrines are not independent propositions that can be dismantled one by one in isolation. They form a self-reinforcing system. The NWT supports the Governing Body, the Governing Body validates the NWT, the NWT's renderings support the denial of Christ's deity, the denial of Christ's deity supports the Jesus=Michael doctrine, and 1914 validates the Governing Body's appointment. Pull one thread and the others tighten; address one doctrine and they redirect to another.\n\nThis is why the most effective engagement strategy is not to attack every doctrine simultaneously but to identify the load-bearing wall — the single point whose removal causeth the greatest structural collapse. That load-bearing wall is Watchtower authority. If the Governing Body is not God's sole channel, then every distinctive JW doctrine becomes merely one fallible interpretation among many, subject to testing against Scripture by any believer.\n\nToday, review and consolidate. Tomorrow we begin Week 2 — Steelman Argument Mastery — where thou shalt learn to present JW arguments more persuasively than most JWs themselves can, so that thy refutations will be airtight.",
    avatarPresence:
      "The Jehovah's Witness avatar regards you with cautious respect. 'You have studied our beliefs more carefully than most. But studying about us is not the same as understanding our hearts. We serve Jehovah out of love, not because an organization forces us. You may know the arguments, but do you understand why eight million people have given their lives to this truth? Perhaps you should ask why Jehovah's organization is the fastest-growing religion in many countries.'",
    tacticalBriefing:
      "This is a consolidation day. Review the seven major JW doctrines covered this week and map their interconnections. Identify which doctrines depend on which others. The key strategic insight: Watchtower authority is the load-bearing wall. If it falls, every other distinctive doctrine becomes an unsupported opinion. Secondary load-bearing wall: the NWT. If the NWT is shown to be theologically biased, the textual foundation for JW distinctives crumbles. Your goal is to enter Week 2 with a comprehensive mental map of JW theology and a clear understanding of its structural vulnerabilities.",
    drill:
      "Create a written 'Doctrine Dependency Map' connecting all seven JW doctrines studied this week. Draw arrows showing which doctrines support which others. Identify the load-bearing wall (Watchtower authority) and the secondary structural support (NWT). For each doctrine, write one sentence stating the JW position and one sentence stating the strongest SDA response. This map will serve as your tactical reference for the remaining seven weeks of training.",
    forgeAWeapon:
      "Craft a 'Structural Collapse' argument — a single, focused challenge that addresses Watchtower authority (the load-bearing wall) in a way that opens questions about every other doctrine. Example framework: 'If the Governing Body has made demonstrably false predictions, and if the NWT contains demonstrable textual insertions, then every doctrine built upon these foundations must be re-examined against the original texts. Are you willing to do that examination with me?'",
    jeevesDebrief:
      "Excellent work completing Week 1, soldier. You now have a comprehensive understanding of JW theology and its structural interdependencies. The insight that JW doctrines form a self-reinforcing system is crucial — it means you cannot engage piecemeal without a strategy. Always aim for the load-bearing wall. Always redirect from secondary doctrines to the fundamental authority question. And always remember: behind every doctrine is a sincere human being who has staked their life and relationships on this system. Compassion and truth must walk together. Week 2 begins tomorrow with Steelman Argument Mastery.",
    masteryCheck: [
      {
        question:
          "What is the 'load-bearing wall' in the JW doctrinal system?",
        options: [
          "The 144,000 doctrine, because it determines who goes to heaven",
          "The blood transfusion ban, because it is the most controversial doctrine",
          "Watchtower/Governing Body authority, because every other doctrine depends on their claim to be God's sole channel",
          "The 1914 doctrine, because it is the most complex calculation",
        ],
        correctIndex: 2,
        explanation:
          "Watchtower/Governing Body authority is the load-bearing wall because every distinctive JW doctrine depends on the Governing Body's claim to be God's sole channel of truth. If this claim falls, every other JW distinctive becomes merely one fallible interpretation subject to Scriptural testing.",
      },
      {
        question:
          "Why is the NWT considered a 'secondary structural support' in the JW system?",
        options: [
          "Because it is the only Bible translation JWs are allowed to read",
          "Because its unique renderings (John 1:1 'a god,' Colossians 1:16 'other,' 237 insertions of 'Jehovah') provide the textual basis for distinctive JW doctrines",
          "Because it is the most widely used Bible in the world",
          "Because it is the only translation approved by scholars",
        ],
        correctIndex: 1,
        explanation:
          "The NWT is a secondary structural support because its unique renderings provide the textual foundation for JW distinctives. Without 'a god' in John 1:1, the denial of Christ's deity loses its chief prooftext. Without 'other' in Colossians 1:16, the created-Christ doctrine is harder to maintain. Demonstrating NWT bias undermines the textual basis for JW theology.",
      },
    ],
  },

  // ── Day 9 ──────────────────────────────────────────────────────────────────
  {
    day: 9,
    title: "The Trinity and the Shema: One God, How Many Persons?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(9),
    estimatedMinutes: 28,
    xpReward: getXPForDay(9),
    instructorVoice:
      "Soldier, we return to the Trinity question but from a different angle — the Old Testament itself. The Watchtower insisteth that monotheism requireth unitarianism: if there is one God, there can be only one Person. But the Hebrew Scriptures tell a richer story than the Watchtower acknowledgeth.\n\nDeuteronomy 6:4, the Shema, declareth: 'Hear, O Israel: The Lord our God is one Lord.' The word for 'one' is echad — a Hebrew word that frequently denoteth compound unity. In Genesis 2:24, a man and woman become 'one' (echad) flesh — two persons, one unity. In Numbers 13:23, a single cluster of grapes is called 'one' (echad) cluster — many grapes, one cluster. Had Moses intended to convey absolute singularity, the Hebrew word yachid was available — the word used for Abraham's 'only' son Isaac (Genesis 22:2). But the Shema employeth echad.\n\nThis doth not prove the Trinity from a single word, but it demolisheth the JW claim that Old Testament monotheism requireth a unipersonal God. The very word chosen for God's oneness permitteth — and argueth for — a unity that admitteth plurality.\n\nBeyond the Shema, consider Genesis 1:26: 'Let us make man in our image.' The Watchtower claimeth God was speaking to angels, but angels did not participate in creation and mankind is not made in the image of angels. Isaiah 48:16 recordeth: 'The Lord God, and his Spirit, hath sent me' — three distinct agents within the divine communication. The Old Testament containeth the seeds of Trinitarian revelation that the New Testament bringeth to full flower.",
    avatarPresence:
      "The Jehovah's Witness avatar challenges firmly. 'Echad simply means \"one\" — you are reading theology into a basic number. Jehovah is one God, one Person. The Trinity is a pagan doctrine formalized centuries after Christ. Genesis 1:26 uses the plural of majesty — kings say \"we\" all the time. And Isaiah 48:16 is about a prophet, not a trinity. You are forcing three persons into texts that simply affirm one God.'",
    tacticalBriefing:
      "This day deepens the Trinity defense by grounding it in the Old Testament. Your three-point approach: (1) Echad permits compound unity and the Shema does not require unitarianism; (2) Genesis 1:26 and other plural-of-God passages are best explained by plurality within the Godhead; (3) Isaiah 48:16 presents three distinct agents in divine action. Note: do not claim that echad PROVES the Trinity — that would be an overreach. Argue that echad is CONSISTENT with Trinitarian theology and that the OT contains seeds of Trinitarian revelation that the NT brings to full expression.",
    drill:
      "Read Deuteronomy 6:4 in Hebrew (or with an interlinear). Study the word echad in Genesis 2:24 (one flesh), Numbers 13:23 (one cluster), and Ezekiel 37:17 (one stick from two). Write a paragraph explaining how echad functions as compound unity. Then read Genesis 1:26, Genesis 3:22, Genesis 11:7, and Isaiah 6:8 — note the plural self-references of God. Write a second paragraph addressing the 'plural of majesty' objection.",
    forgeAWeapon:
      "Craft a 'Compound Unity' argument showing that the Shema's use of echad is consistent with Trinitarian theology. Include: (1) echad vs. yachid distinction, (2) at least two examples of echad denoting compound unity in the OT, (3) a conclusion that Old Testament monotheism affirms one God while leaving room for plurality within the Godhead.",
    jeevesDebrief:
      "Good work, soldier. The echad argument is not a silver bullet — no single argument is. But it effectively removes the JW claim that the Old Testament requires a unipersonal God. When a JW says 'God is one,' you can agree wholeheartedly and then ask: 'What kind of one? The same kind of one that a husband and wife are — echad? Or absolute mathematical singularity — yachid? The Shema uses echad, not yachid. Why?' This question plants a seed that the Old Testament itself permits what the New Testament reveals. Tomorrow we complete our Week 1 subject deep dives with the topic of Christ's resurrection body.",
    masteryCheck: [
      {
        question:
          "What is the significance of the Hebrew word 'echad' in Deuteronomy 6:4?",
        options: [
          "It proves the Trinity beyond any doubt",
          "It means 'absolute singularity,' confirming that God is one Person",
          "It denotes a unity that can be compound (as in Genesis 2:24, 'one flesh'), and is consistent with plurality within the Godhead",
          "It is identical in meaning to 'yachid' (only, singular)",
        ],
        correctIndex: 2,
        explanation:
          "Echad frequently denotes compound unity in the Old Testament (one flesh in Gen 2:24, one cluster in Num 13:23). While it does not prove the Trinity alone, it is consistent with plurality within the Godhead and demolishes the claim that OT monotheism requires a unipersonal God. Yachid (absolute singularity) was available but not used in the Shema.",
      },
      {
        question:
          "How do SDAs respond to the JW claim that Genesis 1:26 ('Let us make man') is a 'plural of majesty'?",
        options: [
          "SDAs agree that it is a plural of majesty",
          "SDAs note that the plural of majesty is not attested in biblical Hebrew, and God speaks in dialogue ('us,' 'our'), which is better explained by plurality within the Godhead",
          "SDAs believe God was speaking to the angels",
          "SDAs say Genesis 1:26 is a scribal error",
        ],
        correctIndex: 1,
        explanation:
          "The 'plural of majesty' (royal we) is not clearly attested in biblical Hebrew — kings in the OT speak in the singular. God's use of 'us' and 'our' in Genesis 1:26 is better explained by plurality within the Godhead, especially since mankind is made in God's image, not in the image of angels.",
      },
    ],
  },

  // ── Day 10 ─────────────────────────────────────────────────────────────────
  {
    day: 10,
    title: "Christ's Resurrection: Body or Spirit?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(10),
    estimatedMinutes: 27,
    xpReward: getXPForDay(10),
    instructorVoice:
      "Soldier, today we address the JW claim that Jesus was not raised bodily from the dead. The Watchtower teacheth that Jehovah disposed of Jesus' physical body (possibly dissolving it into gases) and re-created him as a spirit creature — Michael the Archangel restored. When Jesus appeared to the disciples, they argue, he merely materialized temporary physical bodies to communicate, as angels had done in the Old Testament.\n\nThis teaching striketh at the very heart of the gospel. The apostle Paul declareth in Romans 8:11: 'But if the Spirit of him that raised up Jesus from the dead dwell in you, he that raised up Christ from the dead shall also quicken your mortal bodies by his Spirit that dwelleth in you.' Our hope of resurrection is tied directly to Christ's bodily resurrection.\n\nJesus Himself addressed this with devastating clarity in John 2:19-21: 'Destroy this temple, and in three days I will raise it up. Then said the Jews, Forty and six years was this temple in building, and wilt thou rear it up in three days? But he spake of the temple of his body.' Not a spirit-temple. Not a re-created body. His body. The same body that was destroyed would be raised.\n\nAnd in Luke 24:39, the risen Christ declareth: 'Behold my hands and my feet, that it is I myself: handle me, and see; for a spirit hath not flesh and bones, as ye see me have.' Jesus explicitly distinguished Himself from a spirit. He invited physical verification. He ate fish (Luke 24:42-43). Thomas touched His wounds (John 20:27). These are not the actions of a materialized angel.",
    avatarPresence:
      "The Jehovah's Witness avatar counters methodically. 'First Peter 3:18 says Jesus was \"put to death in the flesh, but made alive in the spirit.\" He was raised as a spirit creature, not in a physical body. When he appeared to the disciples, he materialized bodies — just as angels did in Abraham's time. The physical body was gone. Jehovah disposed of it, perhaps dissolving it. Jesus no longer needed a fleshly body because he returned to heaven as a spirit.'",
    tacticalBriefing:
      "The JW denial of Christ's bodily resurrection is linked to their denial of His deity. If Jesus is merely a spirit creature (Michael), a bodily resurrection is unnecessary and even problematic for their theology. Your key texts: (1) John 2:19-21 — Jesus promised to raise THIS temple (His body); (2) Luke 24:39 — 'A spirit hath not flesh and bones, as ye see me have'; (3) Luke 24:42-43 — He ate physical food; (4) John 20:27 — Thomas touched the same wounds. Address 1 Peter 3:18 by showing that 'made alive in the spirit' means made alive BY the Spirit (the Holy Spirit), not made alive AS a spirit — consistent with Romans 8:11.",
    drill:
      "Read John 2:19-21, Luke 24:36-43, and John 20:24-29 in the KJV. Write a summary of the evidence for Christ's bodily resurrection from these passages. Then read 1 Peter 3:18 and Romans 8:11. Write a paragraph explaining how 'made alive in the spirit' (1 Pet 3:18) means made alive BY the Spirit — the same Spirit who will quicken our mortal bodies (Rom 8:11). Finally, address the JW claim that Jesus 'materialized' bodies: if the resurrection body was temporary and fake, how could Jesus say 'It is I myself' (Luke 24:39)?",
    forgeAWeapon:
      "Craft a 'Resurrection Identity' argument using three key texts: (1) John 2:19-21 — Jesus promised to raise the same body that was destroyed; (2) Luke 24:39 — Jesus explicitly denied being a spirit; (3) John 20:27 — Thomas touched the same crucifixion wounds. Conclude: the resurrection was not a re-creation but a restoration of the same body, glorified. This is the foundation of the believer's hope (Romans 8:11, Philippians 3:21).",
    jeevesDebrief:
      "Well done, soldier. The bodily resurrection of Christ is the cornerstone of Christian faith (1 Corinthians 15:14, 17). The JW position — that Jesus was dissolved and re-created as a spirit — destroys the continuity of identity that makes the resurrection meaningful. If the body in the tomb was discarded and a new spirit creature was made, that is not resurrection; it is replacement. Jesus said 'It is I myself' — not 'I am a new creation of Jehovah.' The identity of the risen Christ with the crucified Christ is the gospel. Hold this ground absolutely. Tomorrow we begin studying the JW approach to the Holy Spirit.",
    masteryCheck: [
      {
        question:
          "What did Jesus promise in John 2:19-21 about His resurrection?",
        options: [
          "That Jehovah would create a new spirit body for Him",
          "That He would raise the same body ('this temple') that was destroyed",
          "That His disciples would build a new temple in three days",
          "That His physical body would be dissolved into gases",
        ],
        correctIndex: 1,
        explanation:
          "In John 2:19-21, Jesus said: 'Destroy this temple, and in three days I will raise it up.' John explains: 'He spake of the temple of his body.' Jesus promised to raise the SAME body that was destroyed — not to be re-created as a spirit creature.",
      },
      {
        question:
          "How should 1 Peter 3:18 ('put to death in the flesh, but made alive in the spirit') be understood?",
        options: [
          "Jesus was killed physically and raised as a spirit creature with no body",
          "Jesus was put to death in the realm of the flesh and made alive BY the Spirit (the Holy Spirit) — consistent with Romans 8:11",
          "Jesus' spirit survived death while His body was permanently destroyed",
          "The verse proves that the resurrection was purely spiritual with no physical component",
        ],
        correctIndex: 1,
        explanation:
          "1 Peter 3:18 uses 'spirit' (pneumati) in the dative, indicating the agent or sphere of resurrection. Romans 8:11 confirms: the Spirit who raised Jesus from the dead will also give life to our mortal bodies. 'Made alive in the spirit' means raised BY the Spirit of God, not raised AS a spirit creature.",
      },
    ],
  },
  // ── Day 11 ─────────────────────────────────────────────────────────────────
  {
    day: 11,
    title: "The Holy Spirit: Person or Active Force?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(11),
    estimatedMinutes: 28,
    xpReward: getXPForDay(11),
    instructorVoice:
      "Soldier, today we confront the JW denial of the personality and deity of the Holy Spirit. The Watchtower teacheth that the Holy Spirit is not a Person but an impersonal 'active force' — like electricity or wind — that Jehovah useth to accomplish His purposes. The NWT reflecteth this by rendering references to the Spirit without the definite article and with lowercase 'spirit' in many passages.\n\nBut Scripture painteth a profoundly different picture. The Holy Spirit speaketh: 'The Holy Ghost said, Separate me Barnabas and Saul for the work whereunto I have called them' (Acts 13:2). An impersonal force doth not say 'me' or 'I.' The Holy Spirit can be lied to — and lying to Him is lying to God: 'Why hath Satan filled thine heart to lie to the Holy Ghost?... thou hast not lied unto men, but unto God' (Acts 5:3-4). One cannot lie to electricity.\n\nThe Holy Spirit grieveth: 'Grieve not the holy Spirit of God' (Ephesians 4:30). He intercedeth: 'The Spirit itself maketh intercession for us with groanings which cannot be uttered' (Romans 8:26). He possesseth a mind: 'He that searcheth the hearts knoweth what is the mind of the Spirit' (Romans 8:27). He teacheth: 'The Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things' (John 14:26).\n\nEvery attribute of personhood — intellect, will, emotion, speech, agency — is ascribed to the Holy Spirit in Scripture. The JW reduction of the Spirit to an impersonal force requireth ignoring or redefining dozens of passages.",
    avatarPresence:
      "The Jehovah's Witness avatar shakes their head. 'The holy spirit is Jehovah's active force — like his power extended into the world. The Bible uses impersonal imagery: wind, fire, water, oil. You cannot pour out a person. You cannot be filled with a person. The holy spirit is described in ways that make it clearly impersonal. Trinitarians personify what is simply God's power.'",
    tacticalBriefing:
      "The JW denial of the Spirit's personhood is based on two arguments: (1) impersonal imagery (wind, fire, water) and (2) the Spirit is 'poured out' and 'fills' people, which seems impersonal. Counter: (1) God the Father is also described with impersonal imagery (rock, fortress, consuming fire) without becoming impersonal; (2) being 'filled with' the Spirit is relational language, like being 'filled with joy' — joy is an experience with a source. Your strongest evidence: Acts 5:3-4 (lying to the Spirit = lying to God), Acts 13:2 (the Spirit uses personal pronouns), Romans 8:26-27 (the Spirit has a mind and intercedes). Key texts: John 14:26, John 16:13, Acts 5:3-4, Acts 13:2, Ephesians 4:30.",
    drill:
      "Read Acts 5:1-4, Acts 13:2, Romans 8:26-27, and Ephesians 4:30 in the KJV. For each passage, identify the personal attribute ascribed to the Holy Spirit (speech, moral agency, intercession, emotion). Write a paragraph demonstrating that these attributes require personhood. Then address the JW objection about impersonal imagery by listing similar impersonal imagery used for God the Father (rock, fortress, consuming fire, Psalm 18:2, Deuteronomy 4:24) and showing that impersonal metaphors do not make the subject impersonal.",
    forgeAWeapon:
      "Craft a 'Personhood Proof' argument listing five personal attributes of the Holy Spirit from five different passages: (1) Speech — Acts 13:2; (2) Moral witness — Acts 5:3-4 (lying to the Spirit is lying to God); (3) Intercession with a mind — Romans 8:26-27; (4) Grief — Ephesians 4:30; (5) Teaching — John 14:26. Conclude: no impersonal force speaks, grieves, intercedes, has a mind, and can be lied to. These are exclusively personal attributes.",
    jeevesDebrief:
      "Excellent work, soldier. The cumulative weight of evidence for the Holy Spirit's personhood is overwhelming. The JW position requires either ignoring or redefining every passage where the Spirit speaks, grieves, teaches, intercedes, or exercises agency. When engaging a JW on this topic, start with Acts 5:3-4: 'Ananias lied to the Holy Spirit, and Peter said he lied to God. Can you lie to electricity? Can you lie to a force? If the Holy Spirit is not a Person, how can you lie to it?' This question cuts through theological abstraction to common-sense reality. Tomorrow we examine the JW understanding of the cross versus the torture stake.",
    masteryCheck: [
      {
        question:
          "What does Acts 5:3-4 reveal about the nature of the Holy Spirit?",
        options: [
          "The Holy Spirit is an impersonal force that Ananias misused",
          "Lying to the Holy Spirit is lying to God — identifying the Spirit as a divine Person",
          "The Holy Spirit is a created angel who serves God",
          "The passage does not mention the Holy Spirit at all",
        ],
        correctIndex: 1,
        explanation:
          "In Acts 5:3-4, Peter says Ananias 'lied to the Holy Ghost' and then immediately equates this with lying 'unto God.' This passage identifies the Holy Spirit as a divine Person — one cannot lie to an impersonal force, and equating the Spirit with God affirms His deity.",
      },
      {
        question:
          "How should SDAs respond to the JW argument that impersonal imagery (wind, fire, water) proves the Spirit is not a Person?",
        options: [
          "Agree that the imagery proves the Spirit is impersonal",
          "Point out that God the Father is also described with impersonal imagery (rock, fortress, consuming fire) without becoming impersonal — metaphors describe aspects, not nature",
          "Argue that the imagery is mistranslated in the JW Bible",
          "Avoid the topic of imagery entirely",
        ],
        correctIndex: 1,
        explanation:
          "God the Father is described as a rock (Psalm 18:2), a fortress (Psalm 91:2), and a consuming fire (Deuteronomy 4:24) — yet no one concludes the Father is impersonal. Impersonal metaphors describe functional aspects of a subject; they do not determine the subject's nature. The same principle applies to the Holy Spirit.",
      },
    ],
  },

  // ── Day 12 ─────────────────────────────────────────────────────────────────
  {
    day: 12,
    title: "Cross or Torture Stake? The Shape of Salvation",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(12),
    estimatedMinutes: 25,
    xpReward: getXPForDay(12),
    instructorVoice:
      "Soldier, the Watchtower insisteth that Jesus died not on a cross but on a single upright stake — a 'torture stake' without a crossbeam. They translate the Greek stauros as 'torture stake' throughout the NWT and condemn the cross as a pagan symbol that hath no place in true worship.\n\nThe Greek word stauros in its earliest usage did refer to a simple upright pole. But by the first century, under Roman crucifixion practice, it commonly referred to the composite structure of upright beam and crossbeam (the patibulum). Historical and archaeological evidence — including the discovery of crucified remains at Givat HaMivtar in 1968 showing nails through the heel bones in a position consistent with cross-shaped crucifixion — supports the traditional understanding.\n\nMoreover, John 20:25 speaketh of the 'print of the nails' in Jesus' hands — nails, plural. On a single upright stake with both hands overlapping above the head, a single nail would suffice. The plural 'nails' (helous) suggesteth the hands were separated, requiring multiple nails — consistent with crucifixion on a cross.\n\nBut here is the deeper point, soldier: the shape of the instrument is theologically secondary. Whether cross-shaped or stake-shaped, the instrument of Christ's death is the instrument of our salvation. The Watchtower useth the shape debate as a distraction — shifting attention from the meaning of Christ's sacrifice to the physical form of the execution device. Do not be drawn into endless debates about wood shapes when the real question is the nature and sufficiency of the One who hung upon it.",
    avatarPresence:
      "The Jehovah's Witness avatar holds up an illustration of an upright stake. 'The cross is a pagan symbol adopted by apostate Christianity. Stauros means an upright stake, not a cross. The crossbeam was invented by the Catholic Church to incorporate pagan sun-worship symbols. True Christians would never wear a miniature execution device around their necks. Jesus died on a simple stake.'",
    tacticalBriefing:
      "This is a secondary battle — do not let it consume disproportionate time. The key evidence: (1) John 20:25 mentions nails (plural) in Jesus' hands; (2) Archaeological evidence from Givat HaMivtar supports cross-shaped crucifixion; (3) Early church witnesses (Justin Martyr, c. 155 AD) describe the cross shape before any alleged pagan influence; (4) The Watchtower's own publications have shifted on this issue over the decades. Your strategic goal: address the shape question briefly with evidence, then redirect to the significance of Christ's sacrifice.",
    drill:
      "Read John 20:25 in the KJV — note the plural 'nails.' Research the Givat HaMivtar archaeological find (1968) and write a brief summary of what it reveals about Roman crucifixion. Then write a paragraph redirecting the conversation from the shape of the instrument to the meaning of Christ's sacrifice. The weapon here is not winning the shape debate but demonstrating that the JW focuses on the form while missing the substance.",
    forgeAWeapon:
      "Craft a 'Redirect to the Cross's Meaning' argument. Acknowledge the shape question briefly (cite John 20:25 plural nails and archaeological evidence), then pivot: 'Whether the instrument was cross-shaped or stake-shaped, the real question is: Who hung upon it, and what did His death accomplish? Galatians 6:14 says Paul gloried in the cross — not the shape, but the sacrifice. Can we discuss what Christ's death means for our salvation?'",
    jeevesDebrief:
      "Nicely handled, soldier. The cross-vs-stake debate is a classic example of a JW misdirection — a secondary issue elevated to primary importance to keep you away from the central questions of Christ's deity and the sufficiency of His atonement. Your evidence for the cross shape is sound (plural nails, archaeology, early church testimony), but your greatest weapon is the redirect. Never spend thirty minutes on wood shapes when you could spend thirty minutes on the Savior who died upon it. Tomorrow we advance to Day 13 — the JW approach to worship and proskuneo.",
    masteryCheck: [
      {
        question:
          "What evidence from John 20:25 suggests Jesus was crucified on a cross rather than a single stake?",
        options: [
          "John mentions a crossbeam explicitly",
          "Thomas refers to the 'print of the nails' (plural) in Jesus' hands — suggesting the hands were separated, requiring multiple nails as on a cross",
          "John describes the shape of the instrument in detail",
          "John 20:25 does not provide any relevant evidence",
        ],
        correctIndex: 1,
        explanation:
          "John 20:25 records Thomas speaking of the 'print of the nails' (helous, plural) in Jesus' hands. On a single upright stake with overlapping hands, one nail would suffice. The plural nails suggest the hands were separated on a crossbeam, consistent with cross-shaped crucifixion.",
      },
      {
        question:
          "What is the best strategic approach when a JW raises the cross-vs-stake debate?",
        options: [
          "Spend the entire conversation proving the cross shape with extensive historical evidence",
          "Concede that it was a stake and move on",
          "Present brief evidence (plural nails, archaeology), then redirect to the meaning of Christ's sacrifice — who He is and what His death accomplished",
          "Refuse to discuss the topic at all",
        ],
        correctIndex: 2,
        explanation:
          "The cross-vs-stake debate is a secondary issue the JW uses to distract from central questions about Christ's deity and atonement. Present brief evidence (John 20:25 plural nails, Givat HaMivtar archaeology), then redirect to the real question: Who hung upon it, and what does His sacrifice mean? This prevents misdirection.",
      },
    ],
  },

  // ── Day 13 ─────────────────────────────────────────────────────────────────
  {
    day: 13,
    title: "Worship and Proskuneo: Does Jesus Receive Worship?",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(13),
    estimatedMinutes: 28,
    xpReward: getXPForDay(13),
    instructorVoice:
      "Soldier, today we engage one of the most revealing inconsistencies in JW translation practice — the handling of the Greek word proskuneo. This word, meaning 'to bow down, to worship, to do reverence,' appeareth in the New Testament both for worship directed to God and for honor directed to Jesus.\n\nThe NWT translateth proskuneo as 'worship' when directed to Jehovah (Matthew 4:10: 'It is Jehovah your God you must worship') but as mere 'obeisance' when directed to Jesus (Matthew 14:33: 'Those in the boat did obeisance to him'). The same Greek word receiveth two different English translations depending on who is the object — a translation choice driven by theology, not grammar.\n\nBut Scripture itself refuseth this distinction. In Hebrews 1:6, the Father commandeth: 'And let all the angels of God worship him' — referring to the Son. If proskuneo to the Father is worship and proskuneo to the Son is mere obeisance, then the Father commanded the angels to give His Son something less than worship. This maketh no sense in the context of Hebrews 1, which argueth for the supreme exaltation of Christ.\n\nRevelation 5:13-14 recordeth: 'Blessing, and honour, and glory, and power, be unto him that sitteth upon the throne, and unto the Lamb for ever and ever.' The Father and the Son receive identical praise from every creature. If this is not co-equal worship, language hath lost its meaning.",
    avatarPresence:
      "The Jehovah's Witness avatar draws a sharp line. 'Proskuneo has a range of meaning — it can mean worship or it can mean respectful obeisance. When directed to Jehovah, it is worship. When directed to Jesus, it is obeisance — the kind a subject gives to a king. Only Jehovah deserves worship. Jesus himself said: \"It is Jehovah your God you must worship, and it is to him alone you must render sacred service.\" Giving Jesus worship would be idolatry.'",
    tacticalBriefing:
      "The proskuneo inconsistency is one of the most powerful tools against the NWT. Your three-part approach: (1) Show that the NWT translates the same Greek word differently based on theology, not grammar; (2) Cite Hebrews 1:6 where the Father commands angels to proskuneo the Son — if this is mere obeisance, the Father commanded less-than-worship for His Son; (3) Show from Revelation 5:13-14 that the Father and Lamb receive identical worship from all creation. Key texts: Matthew 4:10, Matthew 14:33, Hebrews 1:6, Revelation 5:13-14, Philippians 2:10-11.",
    drill:
      "Compare the NWT and KJV renderings of proskuneo in these passages: Matthew 4:10 (to God), Matthew 14:33 (to Jesus), Hebrews 1:6 (to Jesus, commanded by God), Revelation 5:13-14 (to God and the Lamb). Note how the NWT translates the same word differently depending on the recipient. Write a paragraph exposing this inconsistency. Then read Philippians 2:10-11 — 'every knee should bow... every tongue confess that Jesus Christ is Lord.' Compare this with Isaiah 45:23 where Jehovah says every knee will bow to HIM. What does this parallel imply about Jesus' identity?",
    forgeAWeapon:
      "Craft a 'Consistent Proskuneo Challenge' — a structured argument showing that the NWT's dual translation of proskuneo (worship for God, obeisance for Jesus) is theologically motivated. Include: (1) Hebrews 1:6 where the Father commands proskuneo for the Son; (2) Revelation 5:13-14 where identical praise goes to God and the Lamb; (3) The Philippians 2:10-11 / Isaiah 45:23 parallel showing Jesus receives what belongs to Jehovah. Conclude: if the same word, the same action, and the same praise belong to both Father and Son, the Son is worthy of worship — not mere obeisance.",
    jeevesDebrief:
      "Excellent work, soldier. The proskuneo evidence is devastating to the JW position because it exposes the NWT's methodology: translate to support theology rather than letting the text determine theology. When a JW insists proskuneo merely means obeisance for Jesus, ask: 'Then did the Father command the angels to give Jesus less than worship in Hebrews 1:6? And in Revelation 5:13, when every creature praises God and the Lamb identically, is the Lamb receiving something lesser? If so, explain the difference — because the text uses the same words for both.' This forces the JW to either admit co-equal worship or explain a distinction the text does not make. Tomorrow we close out our foundation phase.",
    masteryCheck: [
      {
        question:
          "How does the NWT handle the Greek word 'proskuneo' differently depending on the recipient?",
        options: [
          "It translates proskuneo consistently as 'worship' for all recipients",
          "It translates proskuneo as 'worship' for Jehovah but as 'obeisance' for Jesus — the same word, two different translations based on theology",
          "It translates proskuneo as 'obeisance' for all recipients",
          "It does not translate proskuneo at all",
        ],
        correctIndex: 1,
        explanation:
          "The NWT translates proskuneo as 'worship' when directed to Jehovah (Matt 4:10) but as mere 'obeisance' when directed to Jesus (Matt 14:33). This inconsistency is theologically driven — the same Greek word receives different translations based on who the recipient is, not based on grammar.",
      },
      {
        question:
          "What is the significance of Revelation 5:13-14 for the worship of Jesus?",
        options: [
          "It shows that only God receives worship; Jesus receives mere honor",
          "Every creature gives identical praise — 'blessing, honour, glory, and power' — to God AND the Lamb, demonstrating co-equal worship",
          "The Lamb is excluded from the worship described in this passage",
          "The passage is about angels, not about Jesus",
        ],
        correctIndex: 1,
        explanation:
          "Revelation 5:13-14 records every creature ascribing 'Blessing, and honour, and glory, and power' to both 'him that sitteth upon the throne, AND unto the Lamb.' The Father and Son receive identical praise from all creation — this is co-equal worship.",
      },
    ],
  },

  // ── Day 14 ─────────────────────────────────────────────────────────────────
  {
    day: 14,
    title: "Foundation Capstone: The Full Deity of Christ from All Angles",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(14),
    estimatedMinutes: 30,
    xpReward: getXPForDay(14),
    instructorVoice:
      "Soldier, today thou dost complete the Foundation phase of thy War College training. For two weeks thou hast studied every major JW doctrine and the SDA biblical response. Now we consolidate the single most important theological truth that the Watchtower system deniethThe full, eternal, uncreated deity of Jesus Christ.\n\nThis is not one doctrine among many. It is the doctrine upon which the gospel standeth or falleth. If Jesus is a created being, His sacrifice is finite — and a finite sacrifice cannot atone for the infinite guilt of a fallen race. Only God can save (Isaiah 43:11), and Jesus is called 'our great God and Saviour Jesus Christ' (Titus 2:13). If Jesus is Michael the Archangel, then God sent a creature to die for the sins of all creation — and the cross becometh merely the death of an angel, not the self-sacrifice of the Creator.\n\nLet us marshal the full weight of evidence. John 1:1 — 'The Word was God.' Colossians 2:9 — 'In him dwelleth all the fulness of the Godhead bodily.' Hebrews 1:8 — The Father addresseth the Son: 'Thy throne, O God, is for ever and ever.' Isaiah 9:6 — The Messiah is 'The mighty God, The everlasting Father.' Titus 2:13 — 'Our great God and Saviour Jesus Christ.' John 20:28 — Thomas calleth Jesus 'My Lord and my God' — and Jesus doth not correct him.\n\nThe deity of Christ is the central truth of Christianity. Every JW doctrine is an attempt to undermine it. Every SDA response must uphold it. As thou dost enter the Intermediate phase, carry this truth as thy unsheathed sword.",
    avatarPresence:
      "The Jehovah's Witness avatar makes their final Foundation-level challenge. 'You quote verses, but you ignore context. John 1:1 says \"the Word was A god\" — a lesser deity. Colossians 1:15 says Jesus is the firstborn OF creation. Jesus himself said \"the Father is greater than I\" in John 14:28. If Jesus were God, why would he say someone is greater? Your Trinity doctrine forces you to explain away Jesus' own words about his subordination to the Father.'",
    tacticalBriefing:
      "This is your capstone day. You will construct a comprehensive, multi-text argument for the full deity of Christ. Address the three main JW counter-arguments: (1) John 1:1 'a god' — refuted by Colwell's Rule and NWT inconsistency; (2) Colossians 1:15 'firstborn' — prototokos is a title of preeminence, not origin; (3) John 14:28 'the Father is greater' — functional subordination in the incarnation does not negate ontological equality. Your presentation should flow logically from text to text, building a cumulative case that no single objection can overturn.",
    drill:
      "Construct a comprehensive written argument for the deity of Christ using at least eight Scripture texts. Organize it in three tiers: (1) Direct deity statements (John 1:1, Titus 2:13, Heb 1:8, John 20:28); (2) Creator-passages (Col 1:16-17, Heb 1:10, John 1:3); (3) OT-YHWH-applied-to-Jesus passages (Isa 45:23/Phil 2:10-11, Joel 2:32/Rom 10:13, Isa 44:6/Rev 1:17). Address each of the three main JW counter-arguments with a one-paragraph rebuttal.",
    forgeAWeapon:
      "Craft a 'Deity Cascade' — a rapid-deployment argument that presents the deity of Christ from five different biblical angles in under two minutes. The cascade moves from John 1:1 (nature), to Colossians 1:16 (creative work), to Hebrews 1:8 (Father's address), to John 20:28 (apostolic confession), to Revelation 5:13-14 (universal worship). Each text reinforces the others, creating a cumulative weight that no single objection can dislodge.",
    jeevesDebrief:
      "Soldier, thou hast completed the Foundation phase with distinction. You now possess a comprehensive understanding of JW theology, its structural vulnerabilities, and the biblical defense of core Christian doctrines. The deity of Christ is your central weapon — never enter an engagement without it drawn and ready. Beginning tomorrow, you enter the Intermediate phase: Steelman Argument Mastery. You will learn to present JW arguments more persuasively than most Witnesses can, so that when you refute them, your refutation will be airtight. The difficulty increases. The minutes grow longer. The XP rewards rise. You are no longer an initiate. You are becoming a scholar. Onward.",
    masteryCheck: [
      {
        question:
          "Why is the deity of Christ the central issue in SDA-JW engagement?",
        options: [
          "Because it is a minor theological disagreement with no practical consequences",
          "Because if Jesus is a created being, His sacrifice is finite and cannot atone for the infinite guilt of humanity — the gospel itself depends on Christ's deity",
          "Because the shape of the cross depends on whether Jesus is God",
          "Because JWs and SDAs disagree about the name of God",
        ],
        correctIndex: 1,
        explanation:
          "The deity of Christ is the central issue because the sufficiency of the atonement depends on it. Only an infinite sacrifice can atone for infinite guilt. If Jesus is a creature, His death is the death of an angel — finite, limited, insufficient. Isaiah 43:11 declares 'beside me there is no saviour.' If Jesus saves, He must be God.",
      },
      {
        question:
          "How should SDAs address John 14:28 ('the Father is greater than I') when JWs cite it to deny Christ's deity?",
        options: [
          "Admit that Jesus is a lesser being than the Father",
          "Explain that Jesus was speaking of functional subordination during the incarnation — He voluntarily took a servant role (Phil 2:6-8) without ceasing to be equal in nature with the Father",
          "Argue that John 14:28 is a mistranslation",
          "Ignore the verse and change the subject",
        ],
        correctIndex: 1,
        explanation:
          "John 14:28 reflects Jesus' functional subordination during the incarnation. Philippians 2:6-8 explains that Jesus, being in the form of God and equal with God, voluntarily emptied Himself and took the form of a servant. 'Greater' refers to positional role, not ontological nature. A president is 'greater' than a citizen in role but not in human nature.",
      },
      {
        question:
          "What is the 'load-bearing wall' strategy for engaging JW theology?",
        options: [
          "Attack every JW doctrine simultaneously",
          "Focus on minor issues like the cross-vs-stake debate",
          "Target Watchtower/Governing Body authority — if this claim falls, every distinctive JW doctrine becomes an unsupported opinion",
          "Avoid challenging any doctrines to maintain friendship",
        ],
        correctIndex: 2,
        explanation:
          "The 'load-bearing wall' strategy targets Watchtower authority because every distinctive JW doctrine depends on the Governing Body's claim to be God's sole channel. If this claim is undermined (through failed prophecies, the Berean standard, circular reasoning), every other doctrine becomes a fallible interpretation subject to Scriptural testing.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // WEEK 2 (Days 15-21): STEELMAN ARGUMENT MASTERY
  // ════════════════════════════════════════════════════════════════════════════

  // ── Day 15 ─────────────────────────────────────────────────────────────────
  {
    day: 15,
    title: "Steelmanning the Created-Christ Argument",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(15),
    estimatedMinutes: 35,
    xpReward: getXPForDay(15),
    instructorVoice:
      "Soldier, welcome to the Intermediate phase. From this point forward, the training intensifieth. Thou wilt spend longer sessions, face harder questions, and develop skills that go beyond knowledge into mastery. Today we begin Steelman Argument Mastery — the discipline of presenting thy opponent's argument in its strongest possible form before thou dost refute it.\n\nWhy steelman? Because a refutation is only as strong as the argument it refuteth. If thou dost attack a strawman — a weak or distorted version of the JW position — thy victory is hollow and unconvincing. But if thou canst present the JW argument more persuasively than the JW himself, and THEN dismantle it, thy refutation carrieth the weight of intellectual honesty.\n\nToday we steelman the created-Christ argument. The strongest JW case proceedeth thus: Colossians 1:15 calleth Jesus 'the firstborn of every creature.' Proverbs 8:22 (Wisdom personified) saith 'The Lord possessed me in the beginning of his way, before his works of old.' Revelation 3:14 calleth Christ 'the beginning of the creation of God.' These texts, taken together, form a consistent pattern: Jesus is the first and greatest of God's creations — preeminent, yes, but created nonetheless.\n\nNow, the hidden assumptions. 'Firstborn' (prototokos) is assumed to mean 'first created' — but prototokos and protoktistos are different Greek words, and Paul chose prototokos. 'Beginning' (arche) is assumed to mean 'first thing made' — but arche can mean 'source, ruler, origin.' And Proverbs 8 is assumed to be a literal biography of Christ — but it is wisdom poetry, not Christological narrative. Thou must know the strongest version of the argument AND every hidden assumption it containeth.",
    avatarPresence:
      "The Jehovah's Witness avatar presents the case with scholarly precision. 'Colossians 1:15 is clear: prototokos means first-brought-forth. The firstborn IS part of the family. Proverbs 8:22-30 describes Wisdom — whom Paul identifies with Christ — as brought forth before the world. Revelation 3:14 calls Jesus the arche of God's creation — the beginning, the first thing created. Three independent witnesses pointing to one truth: Jesus is the first and greatest creature.'",
    tacticalBriefing:
      "Your task today is twofold: (1) Present the created-Christ argument in its strongest form, better than most JWs can; (2) Identify and expose every hidden assumption. The steelman: Colossians 1:15 + Proverbs 8:22 + Revelation 3:14 form a consistent pattern of Christ as first created being. The dismantling: prototokos ≠ protoktistos (Psalm 89:27 proves this); Proverbs 8 is wisdom poetry (v.12 personifies wisdom alongside discretion and knowledge — are those also Christ?); arche means ruler/source (Rev 21:6 — God is 'the beginning and the end'). The clincher: Colossians 1:16-17 states 'by him were ALL things created' — if He created ALL things, He cannot be among the things created.",
    drill:
      "Write the strongest possible created-Christ argument in 200 words, using Colossians 1:15, Proverbs 8:22, and Revelation 3:14. Make it genuinely persuasive. Then write a 300-word dismantling that addresses every point, exposing hidden assumptions and providing the correct reading of each text. Finally, identify the logical contradiction: if Christ created ALL things (Col 1:16), He cannot be among the things created — the NWT's insertion of 'other' is the only way to avoid this contradiction, and it has no manuscript support.",
    forgeAWeapon:
      "Craft a 'Steelman-then-Shatter' presentation on the created-Christ doctrine. Part 1: Present the JW argument in its strongest form (60 seconds). Part 2: Expose the three hidden assumptions (60 seconds). Part 3: Deliver the fatal blow — Colossians 1:16 says 'ALL things were created by him' — the Creator cannot be a creature, and 'other' is not in the Greek (60 seconds).",
    jeevesDebrief:
      "Outstanding work, soldier. The steelman discipline is uncomfortable at first — it feels wrong to present your opponent's best case. But this is intellectual honesty in service of truth. When you can present the created-Christ argument more effectively than a JW elder, and THEN dismantle it piece by piece, your credibility is unassailable. The JW cannot accuse you of misunderstanding their position, because you just stated it better than they could. This is the power of steelmanning. Tomorrow we steelman the anti-Trinity argument.",
    masteryCheck: [
      {
        question:
          "Why is steelmanning — presenting an opponent's argument in its strongest form — important in apologetics?",
        options: [
          "It allows you to deceive your opponent by pretending to agree with them",
          "It ensures your refutation addresses the strongest version of the argument, making your response credible and intellectually honest",
          "It is unnecessary because the JW arguments are too weak to need steelmanning",
          "It helps you adopt the JW position for yourself",
        ],
        correctIndex: 1,
        explanation:
          "Steelmanning ensures you refute the strongest version of your opponent's argument, not a weak caricature. This makes your refutation credible and intellectually honest — the JW cannot claim you misunderstood their position when you just stated it better than they could.",
      },
      {
        question:
          "What is the key difference between 'prototokos' and 'protoktistos' in the created-Christ debate?",
        options: [
          "They are the same word with the same meaning",
          "Prototokos means 'first-created' and protoktistos means 'firstborn in rank'",
          "Prototokos means 'firstborn' (a title of preeminence/rank) and protoktistos means 'first-created' — Paul chose prototokos, not protoktistos, in Colossians 1:15",
          "Neither word appears in the New Testament",
        ],
        correctIndex: 2,
        explanation:
          "Prototokos (firstborn) is a title of preeminence and rank, as demonstrated by Psalm 89:27 where David — the youngest son — is called 'firstborn.' Protoktistos (first-created) is a different Greek word that Paul deliberately did NOT use in Colossians 1:15. This distinction demolishes the JW claim that 'firstborn' means 'first created.'",
      },
    ],
  },

  // ── Day 16 ─────────────────────────────────────────────────────────────────
  {
    day: 16,
    title: "Steelmanning the Anti-Trinity Argument",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(16),
    estimatedMinutes: 38,
    xpReward: getXPForDay(16),
    instructorVoice:
      "Soldier, today we steelman the anti-Trinity argument — the JW claim that the Trinity is a pagan invention imposed upon Christianity. To steelman this effectively, thou must understand why it is persuasive to millions of intelligent people.\n\nThe strongest version proceedeth thus: The word 'Trinity' nowhere appeareth in Scripture. The doctrine was not formally defined until the Council of Nicaea in 325 AD, convened by Emperor Constantine — a political ruler, not a theologian. Ancient pagan religions contained triadic deity structures: the Egyptian triad of Osiris, Isis, and Horus; the Babylonian triad of Anu, Enlil, and Ea; the Hindu Trimurti of Brahma, Vishnu, and Shiva. The early church, as it absorbed Gentile converts steeped in Hellenistic philosophy, gradually adopted these pagan concepts and dressed them in Christian language.\n\nNow the hidden assumptions: (1) Similarity in number equals derivation — but three is a common pattern in nature and theology without implying borrowing. (2) Formal conciliar definition means invention — but councils articulate existing beliefs under pressure from heresy; the Bereans did not wait for a council to believe the gospel. (3) Pre-Nicene Christianity was unitarian — this is historically false; Ignatius, Justin Martyr, Irenaeus, and Tertullian all affirm plurality within the Godhead before 325 AD. (4) Pagan triads are structurally identical to the Trinity — they are not; pagan triads are three separate gods in a hierarchy, while the Trinity is one God in three co-equal Persons.\n\nThy task: present this argument at full strength, then dismantle every hidden assumption with historical and scriptural evidence.",
    avatarPresence:
      "The Jehovah's Witness avatar speaks with the authority of research. 'Alexander Hislop documented the pagan origins of Trinitarian theology in The Two Babylons. The parallels are undeniable. Constantine merged Christianity with paganism to unify his empire. The Trinity was the theological price of political unity. Even the word \"Trinity\" comes from Tertullian — a man the church itself declared a heretic. How can truth come from a heretic's vocabulary?'",
    tacticalBriefing:
      "The anti-Trinity argument draws emotional power from the word 'pagan' — it triggers suspicion in anyone who values biblical purity. Your dismantling must be systematic: (1) The word 'Trinity' not appearing in the Bible is irrelevant — 'theocracy,' 'Bible,' and 'Governing Body' also don't appear; (2) Nicaea did not invent but defended the Trinity against Arius; (3) Pre-Nicene fathers clearly affirm Christ's deity; (4) Pagan triads are structurally nothing like the Trinity. Regarding Alexander Hislop's The Two Babylons — this book has been thoroughly debunked by scholars (including non-Trinitarian scholars) as relying on faulty etymology and discredited 19th-century comparative religion methods.",
    drill:
      "Write the strongest anti-Trinity argument in 250 words, incorporating pagan parallels, the absence of the word 'Trinity,' the Nicaea argument, and the Constantine connection. Then write a 350-word refutation addressing each point. Include at least three pre-Nicene fathers who affirmed Christ's deity with specific dates and quotes. Address The Two Babylons by noting its scholarly reception.",
    forgeAWeapon:
      "Craft a 'Pre-Nicene Fathers Timeline' weapon — a rapid-reference list of church fathers who affirmed Christ's deity before the Council of Nicaea: Clement of Rome (c. 96 AD), Ignatius of Antioch (c. 110 AD), Justin Martyr (c. 155 AD), Irenaeus (c. 180 AD), Tertullian (c. 200 AD), Origen (c. 230 AD). For each, include one quote affirming Christ's full deity. This weapon demolishes the claim that the Trinity was invented at Nicaea.",
    jeevesDebrief:
      "Excellent steelmanning, soldier. The anti-Trinity argument is emotionally powerful but historically bankrupt. Its persuasiveness depends on the audience not knowing early church history. When you can produce a timeline of pre-Nicene fathers who affirmed Christ's deity — spanning from 96 AD to 325 AD — the 'Nicaea invented the Trinity' narrative collapses. Remember: the JW who raises this argument is usually repeating what they read in Watchtower literature. They have not studied the primary sources. Your job is to gently introduce them to the historical record. Tomorrow we steelman the 'Jehovah's name' argument.",
    masteryCheck: [
      {
        question:
          "Why is the argument 'the word Trinity does not appear in the Bible' ineffective against the Trinity?",
        options: [
          "Because the word 'Trinity' does appear in the Bible, in Revelation",
          "Because many accepted biblical concepts — 'theocracy,' 'Bible,' 'Governing Body,' 'millennium' — also do not appear as words in Scripture. Doctrines are established by scriptural weight, not by the presence of a specific term",
          "Because the word 'Trinity' appears in the Apocrypha",
          "Because language does not matter in theology",
        ],
        correctIndex: 1,
        explanation:
          "Many accepted theological concepts are not present as specific words in Scripture. 'Bible,' 'theocracy,' 'millennium,' and even 'Governing Body' (a JW concept) do not appear verbatim. Doctrines are established by the cumulative weight of Scripture, not by whether a theological term appears in the text.",
      },
      {
        question:
          "Which pre-Nicene church father called Jesus 'our God' around 110 AD — over 200 years before the Council of Nicaea?",
        options: [
          "Martin Luther",
          "Ignatius of Antioch",
          "Emperor Constantine",
          "Charles Taze Russell",
        ],
        correctIndex: 1,
        explanation:
          "Ignatius of Antioch (c. 110 AD) referred to Jesus as 'our God' in his letter to the Ephesians — over 200 years before the Council of Nicaea in 325 AD. This demonstrates that belief in Christ's deity was not invented at Nicaea but was held by the earliest post-apostolic church leaders.",
      },
    ],
  },

  // ── Day 17 ─────────────────────────────────────────────────────────────────
  {
    day: 17,
    title: "Steelmanning the Divine Name Argument",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(17),
    estimatedMinutes: 36,
    xpReward: getXPForDay(17),
    instructorVoice:
      "Soldier, today we steelman the JW argument that God's personal name — Jehovah — must be used by all true worshippers and that churches which do not use it dishonor God. This argument hath emotional power because it toucheth on something genuine: the divine name YHWH doth appear nearly 7,000 times in the Old Testament, and its removal from many translations is a legitimate scholarly discussion.\n\nThe strongest JW case: YHWH is God's personal name, revealed to Moses at the burning bush (Exodus 3:14-15) and used throughout the Old Testament. Psalm 83:18 declareth: 'That men may know that thou, whose name alone is JEHOVAH, art the most high over all the earth.' God commandeth: 'This is my name for ever, and this is my memorial unto all generations' (Exodus 3:15). Churches that replace YHWH with 'LORD' have participated in a conspiracy to hide God's name.\n\nNow the hidden assumptions: (1) 'Jehovah' is the correct pronunciation — it is not; 'Jehovah' is a 13th-century Latin hybrid combining YHWH consonants with Adonai vowels; most scholars favor 'Yahweh.' (2) The New Testament authors used YHWH — no surviving NT manuscript contains the Tetragrammaton; the NWT's 237 insertions have zero manuscript support. (3) Using the name is what defines true worship — but Jesus Himself rarely used the Tetragrammaton and instead called God 'Father' (Abba), emphasizing relationship over pronunciation. (4) SDAs and other Christians have 'removed' the name — SDAs recognize YHWH and its significance while also recognizing that the NT authors consistently used kurios (Lord).",
    avatarPresence:
      "The Jehovah's Witness avatar speaks with deep conviction. 'Jehovah's name is the most important truth in the Bible. Psalm 83:18 makes it clear. Jesus taught us to pray: \"Our Father in the heavens, let your name be sanctified.\" Sanctifying God's name means using it. The churches have removed Jehovah's name from their Bibles and replaced it with a generic title. They have dishonored the Creator. Only Jehovah's Witnesses have restored the divine name to its rightful place.'",
    tacticalBriefing:
      "This is a topic where you can build genuine common ground. SDAs respect the divine name and acknowledge that YHWH appears nearly 7,000 times in the OT. Your three correctives: (1) 'Jehovah' is not the original pronunciation — it is a medieval hybrid; (2) The NWT inserts 'Jehovah' 237 times into the NT without manuscript support; (3) Jesus emphasized relational intimacy ('Father') over name pronunciation. Your approach should be warm: 'We agree God's name is sacred. We disagree on pronunciation and on inserting it where the NT authors did not write it.' Key texts: Exodus 3:14-15, Psalm 83:18, Matthew 6:9, John 17:3.",
    drill:
      "Research the linguistic history of 'Jehovah' — how the name was formed by combining YHWH consonants with Adonai vowels in medieval Latin manuscripts. Write a paragraph explaining this history. Then examine five of the NWT's 237 NT insertions — look up the underlying Greek in each case and note that kurios (Lord) or theos (God) appears, not the Tetragrammaton. Write a second paragraph explaining why inserting 'Jehovah' into the NT is not 'restoration' but 'insertion without evidence.' Finally, note how Jesus addressed God in prayer (Matthew 6:9, John 17:1) — what does His relational approach to God teach us?",
    forgeAWeapon:
      "Craft a 'Common Ground with Correction' argument on the divine name. Step 1: Affirm that God's name YHWH is sacred and appears nearly 7,000 times in the OT. Step 2: Gently correct that 'Jehovah' is a medieval pronunciation hybrid, not the original. Step 3: Challenge the 237 NT insertions — no Greek manuscript supports them. Step 4: Show that Jesus Himself modeled addressing God as 'Father,' prioritizing relationship over pronunciation formula.",
    jeevesDebrief:
      "Well done, soldier. The divine name topic is uniquely suited for a respectful engagement because there IS genuine common ground. SDAs do not dismiss the significance of YHWH — we simply insist on textual integrity. When a JW says 'you don't use Jehovah's name,' you can respond: 'We respect the divine name deeply. But we also respect the NT manuscripts, and none of them contain the Tetragrammaton. The NWT inserts it 237 times where the apostles wrote kurios. Is it faithful to add words to Scripture that the inspired authors did not write?' This question reframes the discussion from name usage to textual fidelity. Tomorrow we steelman the 'paradise earth' doctrine.",
    masteryCheck: [
      {
        question:
          "How was the name 'Jehovah' historically formed?",
        options: [
          "It was revealed directly by God as the correct pronunciation of YHWH",
          "It is a 13th-century Latin hybrid combining the consonants of YHWH with the vowels of Adonai — most scholars favor 'Yahweh' as closer to the original",
          "It was discovered in the Dead Sea Scrolls as the original pronunciation",
          "It was created by Charles Taze Russell in the 19th century",
        ],
        correctIndex: 1,
        explanation:
          "The name 'Jehovah' originated in the 13th century when Latin scholars combined the four consonants of the Tetragrammaton (YHWH) with the vowel points of Adonai (the Hebrew word for 'Lord' that was read aloud in place of the divine name). Most Hebrew scholars agree that 'Yahweh' is closer to the original pronunciation.",
      },
      {
        question:
          "What is the manuscript basis for the NWT's 237 insertions of 'Jehovah' into the New Testament?",
        options: [
          "Over 100 Greek NT manuscripts contain the Tetragrammaton",
          "No Greek NT manuscript contains the Tetragrammaton — the NWT relies on medieval and modern Hebrew translations of the NT, which are secondary sources, not original manuscripts",
          "The Dead Sea Scrolls contain NT books with the Tetragrammaton",
          "The Septuagint provides the manuscript basis",
        ],
        correctIndex: 1,
        explanation:
          "Not a single one of the 5,800+ extant Greek NT manuscripts contains the Tetragrammaton. The Watchtower's 'J-references' are medieval and modern Hebrew translations of the Greek NT — secondary sources created centuries after the originals. Inserting 'Jehovah' into the NT is not restoration but insertion without manuscript evidence.",
      },
    ],
  },

  // ── Day 18 ─────────────────────────────────────────────────────────────────
  {
    day: 18,
    title: "Steelmanning the Paradise Earth Doctrine",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(18),
    estimatedMinutes: 37,
    xpReward: getXPForDay(18),
    instructorVoice:
      "Soldier, today we steelman the JW doctrine of the paradise earth — the teaching that the ultimate destiny of the 'other sheep' (the vast majority of JWs) is eternal life on a perfected, physical earth rather than in heaven. This doctrine is deeply appealing because it connecteth with a genuine biblical theme: God's plan to restore the earth.\n\nThe strongest JW case: God created humans to live on earth, not in heaven (Genesis 1:28, Psalm 115:16). The meek shall 'inherit the earth' (Matthew 5:5, Psalm 37:11, 29). Isaiah prophesieth a renewed world: 'The wolf also shall dwell with the lamb' (Isaiah 11:6-9). Revelation 21:3-4 declareth that God will 'wipe away all tears' and that 'there shall be no more death.' The earth will be a paradise — as Eden was meant to be.\n\nHere is where the steelman meeteth the SDA response: SDAs ALSO believe in a renewed, physical earth. Revelation 21:1 speaketh of 'a new heaven and a new earth.' The SDA position is not that believers float on clouds forever but that God will recreate this earth as the eternal home of the redeemed. The disagreement is not WHETHER there will be a paradise earth but WHETHER there are two classes of believers with different destinies.\n\nThe JW hidden assumption is the two-tier system: 144,000 go to heaven, the rest stay on earth. But Revelation 21:1-4 placeth God's throne ON the new earth — 'the tabernacle of God is with men, and he will dwell with them.' Heaven and earth are reunited. There is one destiny, one hope, one dwelling place — God with His people on a renewed creation.",
    avatarPresence:
      "The Jehovah's Witness avatar speaks with genuine warmth about this doctrine. 'The paradise earth is the most beautiful hope in the Bible. No more sickness, no more death, no more tears. You will see your loved ones again. The animals will be at peace. God will dwell with mankind on a perfect earth. This is not a metaphor — this is Jehovah's promise. Psalm 37:29 says \"the righteous shall inherit the land, and dwell therein for ever.\" This is the real hope.'",
    tacticalBriefing:
      "This is an engagement where you BUILD on JW convictions rather than tear them down. SDAs share the hope of a renewed physical earth — this is common ground. Your correction is surgical: remove the two-class system. There are not two hopes (heaven for 144,000, earth for the rest) but ONE hope: God dwelling with ALL His people on the new earth (Revelation 21:1-4). The new earth IS the ultimate destiny — and God's throne will be there. Key texts: Revelation 21:1-4, Ephesians 4:4 ('one hope'), John 14:2-3, Isaiah 65:17-25.",
    drill:
      "Read Revelation 21:1-5, Isaiah 65:17-25, and 2 Peter 3:13 in the KJV. Write a paragraph describing the SDA understanding of the new earth as the eternal home of ALL the redeemed. Then read Ephesians 4:4 ('one hope of your calling') and John 14:2-3 ('I go to prepare a place for you'). Explain how these texts support one unified destiny rather than a two-class system. Finally, show from Revelation 21:3 that God's throne will be ON the new earth — dissolving the heaven/earth distinction entirely.",
    forgeAWeapon:
      "Craft an 'Agreement-then-Correction' argument: 'I share your hope for a paradise earth — the Bible clearly teaches it. But the Bible teaches ONE hope for ALL believers, not two hopes for two classes. Revelation 21:1-4 shows God coming DOWN to dwell with man on the new earth. God's throne will be HERE. There is no separation between a heavenly class and an earthly class — because heaven itself comes to earth. We all inherit the same promise.'",
    jeevesDebrief:
      "Beautifully executed, soldier. The paradise earth topic is your greatest opportunity for connection with a JW because you share the core hope. Your correction is not 'you're wrong about the earth' — it is 'you're right about the earth, but you've added a class division the Bible doesn't teach.' When a JW speaks longingly about paradise, join them in that longing and then expand it: 'That hope is for ALL of us — not just for an earthly class. God's throne comes to the new earth. We all share one hope.' This is disarming, biblical, and deeply SDA. Tomorrow we steelman the JW view of the soul and death.",
    masteryCheck: [
      {
        question:
          "What is the SDA position on the paradise earth hope?",
        options: [
          "SDAs reject the idea of a paradise earth and believe heaven is the eternal home",
          "SDAs affirm the new earth as the eternal home of ALL the redeemed — God will dwell with His people on a renewed creation (Revelation 21:1-4)",
          "SDAs believe only 144,000 will live on the new earth",
          "SDAs believe the earth will be permanently destroyed",
        ],
        correctIndex: 1,
        explanation:
          "SDAs affirm that the new earth is the eternal home of all the redeemed. Revelation 21:1-4 describes God dwelling with His people on a new earth where death, sorrow, and pain are no more. The SDA correction to the JW view is not rejecting the earth hope but removing the two-class system — ALL believers share one hope.",
      },
      {
        question:
          "How does Revelation 21:3 dissolve the JW two-class system?",
        options: [
          "It confirms that only 144,000 go to heaven while others stay on earth",
          "It shows God's tabernacle coming down to earth — 'he will dwell with them' — meaning God's presence (heaven) comes to the new earth, eliminating any heaven/earth class distinction",
          "It teaches that the earth is destroyed and everyone goes to heaven",
          "It does not address the question of where believers will live",
        ],
        correctIndex: 1,
        explanation:
          "Revelation 21:3 declares: 'The tabernacle of God is with men, and he will dwell with them.' God's throne comes DOWN to the new earth. This dissolves the heaven/earth distinction — there are not two separate destinies because heaven itself comes to earth. All believers share one hope in God's presence on the renewed creation.",
      },
    ],
  },

  // ── Day 19 ─────────────────────────────────────────────────────────────────
  {
    day: 19,
    title: "Steelmanning the 1914 Invisible-Presence Argument",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(19),
    estimatedMinutes: 40,
    xpReward: getXPForDay(19),
    instructorVoice:
      "Soldier, today we steelman the 1914 invisible-presence doctrine at full strength. This is the Watchtower's most complex prophetic argument, and to dismantle it thou must first understand why millions find it convincing.\n\nThe steelman version: Daniel 4 describeth Nebuchadnezzar's dream of a great tree cut down for 'seven times.' While the primary fulfillment was Nebuchadnezzar's seven years of madness, the principle of dual fulfillment — common in biblical prophecy — suggesteth a secondary, grander application. The 'seven times' represent the period of Gentile domination over God's people. Calculating seven times as 7 x 360 = 2,520 prophetic days, and applying the day-for-a-year principle (Ezekiel 4:6, Numbers 14:34), we arrive at 2,520 years. Beginning from 607 BC when Jerusalem fell, we reach 1914 — the exact year World War I erupted, ushering in the 'time of the end' described in Matthew 24.\n\nThe convergence of 1914 with World War I feeleth providential. The world DID change catastrophically in 1914. The 'signs' Jesus described — wars, earthquakes, pestilences, famines — did intensify in the 20th century. If the calculation landeth precisely on the year global civilization began to unravel, is that mere coincidence?\n\nNow the dismantling: (1) 607 BC is historically indefensible — every non-Watchtower source placeth Jerusalem's destruction at 587/586 BC; (2) Daniel 4 self-interprets within its own narrative — it is about Nebuchadnezzar; (3) The 'invisible' return is unfalsifiable — how do you disprove something no one can see?; (4) The original 1914 prediction was for the END of the world, not an invisible beginning — it was reinterpreted after it failed.",
    avatarPresence:
      "The Jehovah's Witness avatar unrolls a prophetic chart with dates and calculations. 'The evidence is mathematical. Seven times equals 2,520 years. Starting from 607 BC, you arrive at 1914. World War I broke out that exact year — the greatest upheaval in human history to that point. Jesus said there would be wars, earthquakes, pestilence. All of these intensified after 1914. This is not coincidence. This is Jehovah's prophetic timeline, and it proves we are living in the last days with Jesus ruling invisibly in heaven since 1914.'",
    tacticalBriefing:
      "The 1914 doctrine is the most complex JW argument and requires surgical dismantling of a multi-link chain. Focus on the weakest link: the 607 BC date. Every Babylonian chronicle, astronomical diary, and Egyptian synchronism points to 587/586 BC. If the starting date is wrong by 20 years, the calculation yields 1934, not 1914 — and the entire framework collapses. Secondary attacks: Daniel 4 is self-interpreting (about Nebuchadnezzar), the 'dual fulfillment' principle is never applied to Daniel 4 in Scripture itself, and the original prediction was for a visible end — not an invisible beginning.",
    drill:
      "Present the 1914 calculation in its strongest form (300 words), including the Gentile-times framework, the day-for-a-year principle, and the World War I 'confirmation.' Then dismantle it in 400 words by attacking: (1) the 607 BC dating error with specific historical evidence; (2) the misapplication of Daniel 4; (3) the unfalsifiability of an 'invisible' return; (4) the fact that the original prediction was for the end, not a beginning.",
    forgeAWeapon:
      "Craft a 'Dating Chain-Breaker' — a focused argument on the 607 vs. 587 BC question. Include: (1) the Babylonian Chronicles (British Museum) dating Nebuchadnezzar's reign; (2) astronomical diaries with verifiable eclipse records; (3) Egyptian chronological synchronisms; (4) the Bible's own internal chronology (compare 2 Kings 25 with Jeremiah 52 and known regnal dates). Conclude: the entire 1914 calculation depends on a date rejected by every non-Watchtower historian.",
    jeevesDebrief:
      "Excellent work, soldier. The 1914 doctrine is the Watchtower's most impressive-sounding argument, and it crumbles at the foundation — 607 BC. When a JW presents the 1914 calculation, do not argue about World War I or 'invisible' returns. Go straight to the start date: 'Your calculation requires Jerusalem to have fallen in 607 BC. Can you show me a single non-Watchtower historian, archaeologist, or ancient source that supports this date?' The silence that follows is more powerful than any argument. Tomorrow we steelman the NWT defense.",
    masteryCheck: [
      {
        question:
          "What is the weakest link in the 1914 prophetic chain?",
        options: [
          "The day-for-a-year principle, which has no biblical basis",
          "The starting date of 607 BC, which is rejected by all non-Watchtower historians in favor of 587/586 BC",
          "The calculation of 2,520 years, which is mathematically incorrect",
          "The connection to World War I, which did not happen in 1914",
        ],
        correctIndex: 1,
        explanation:
          "The weakest link is the 607 BC starting date. Every line of historical evidence — Babylonian chronicles, astronomical diaries, Egyptian synchronisms — points to 587/586 BC as the date of Jerusalem's destruction. Only the Watchtower holds to 607 BC because their 1914 calculation requires it. If Jerusalem fell in 587 BC, the calculation yields 1934, not 1914.",
      },
      {
        question:
          "What was the Watchtower's original prediction for 1914?",
        options: [
          "That Christ would begin an invisible presence in heaven",
          "That the end of the world and the full establishment of God's Kingdom would occur visibly — this was reinterpreted after the prediction failed",
          "That World War I would begin",
          "That the Governing Body would be appointed as the faithful slave",
        ],
        correctIndex: 1,
        explanation:
          "The Watchtower's original prediction for 1914 was the visible end of the world and the full establishment of God's Kingdom on earth. When this did not happen, the prediction was reinterpreted as an 'invisible' heavenly enthronement of Christ — a classic example of post-hoc reinterpretation of a failed prophecy.",
      },
    ],
  },

  // ── Day 20 ─────────────────────────────────────────────────────────────────
  {
    day: 20,
    title: "Steelmanning the NWT as 'Most Accurate'",
    warfareType: "scriptural-revisionists",
    difficulty: getDifficultyTier(20),
    estimatedMinutes: 40,
    xpReward: getXPForDay(20),
    instructorVoice:
      "Soldier, today we steelman the JW claim that the New World Translation is the most accurate Bible available. This is a bold claim, and to dismantle it effectively thou must first understand the genuine strengths the JW will cite.\n\nThe strongest NWT defense: The NWT consistently uses 'Jehovah' where the Tetragrammaton appears in the Hebrew text — unlike most English translations that substitute 'LORD.' The NWT translates sheol and hades consistently as 'the Grave' rather than 'hell,' avoiding the misleading traditional rendering. The NWT uses clear, modern English that is accessible to ordinary readers. And the NWT rendering of John 1:1 as 'the Word was a god' is acknowledged as 'possible' by a small number of scholars — the JW will cite Jason BeDuhn's book Truth in Translation as academic support.\n\nNow the dismantling: (1) Consistency with 'Jehovah' in the OT is commendable — but inserting 'Jehovah' 237 times into the NT where kurios appears in every manuscript is not consistency; it is invention. (2) Translating sheol/hades as 'Grave' is a legitimate choice shared by other translations — SDAs generally approve this approach. (3) The NWT adds 'other' in Colossians 1:16-17 without manuscript support. (4) Jason BeDuhn's endorsement is selective — he acknowledges NWT bias in other passages and his is a minority scholarly position. (5) The NWT translation committee was anonymous with no publicly verifiable Greek or Hebrew credentials — removing accountability and peer review.\n\nThe pattern is clear: the NWT containeth some genuinely good translation choices alongside systematic theological alterations that serve Watchtower doctrine. The good choices provide cover for the alterations.",
    avatarPresence:
      "The Jehovah's Witness avatar cites scholarly support. 'Professor Jason BeDuhn of Northern Arizona University conducted an independent study of nine English Bible translations and concluded that the NWT was the most accurate overall. He said other translations are influenced by Trinitarian theology. The NWT lets the text speak for itself without theological bias. The fact that it was produced by a committee that wished to remain anonymous shows humility, not something to hide.'",
    tacticalBriefing:
      "The BeDuhn citation is the JW's strongest academic card. Address it honestly: BeDuhn did rank the NWT favorably in certain categories, but he also identified NWT bias in other areas and his conclusion is a distinct minority position in biblical scholarship. Your approach: (1) Acknowledge what the NWT does well (consistent Sheol/Grave, readable English); (2) Demonstrate what it does poorly (John 1:1, Colossians 1:16 'other,' 237 NT insertions); (3) Point to the lack of credentialed translators; (4) Apply the principle of Revelation 22:18-19 — adding to Scripture is a serious matter regardless of who does it.",
    drill:
      "Research Jason BeDuhn's Truth in Translation. Write a balanced paragraph noting his favorable assessment of the NWT AND his criticisms. Then create a two-column analysis: 'NWT Strengths' and 'NWT Theological Alterations.' Under strengths, list legitimate translation choices. Under alterations, list at least five specific changes that serve Watchtower theology (John 1:1 'a god,' Col 1:16 'other,' 237 NT 'Jehovah' insertions, Phil 2:6 alteration, 'torture stake' for stauros). Which column is more consequential for core Christian doctrine?",
    forgeAWeapon:
      "Craft a 'Fair Assessment' weapon — an approach to the NWT that acknowledges its strengths before exposing its weaknesses. This is more credible than blanket condemnation. Structure: 'The NWT makes some good translation choices — consistent rendering of Sheol, readable English, and restoring YHWH in the OT. But it also makes changes that serve Watchtower theology rather than the text: adding \"other\" in Colossians 1:16, rendering \"a god\" in John 1:1 against scholarly consensus, and inserting \"Jehovah\" 237 times in the NT without manuscript support. A faithful translation follows the text wherever it leads — even when it challenges cherished doctrines.'",
    jeevesDebrief:
      "Outstanding steelmanship, soldier. The NWT discussion requires nuance. Blanket condemnation ('the NWT is garbage') is intellectually dishonest and will alienate your JW interlocutor. Balanced assessment ('the NWT has real strengths AND systematic theological alterations') is both truthful and disarming. When a JW cites BeDuhn, acknowledge it: 'BeDuhn's work is interesting, and he does praise some NWT choices. He also identifies areas of NWT bias. More importantly, the vast majority of Greek scholars — including non-Trinitarians — reject \"a god\" in John 1:1. One scholar's minority opinion does not override the consensus of the field.' Tomorrow we complete Steelman week with the Watchtower authority defense.",
    masteryCheck: [
      {
        question:
          "What is the most effective approach when a JW cites Jason BeDuhn's praise of the NWT?",
        options: [
          "Dismiss BeDuhn as a fraud or apostate",
          "Acknowledge that BeDuhn praised some NWT choices, note that he also identified NWT bias, and point out that his overall favorable conclusion is a distinct minority position in biblical scholarship",
          "Agree that BeDuhn proves the NWT is the best translation",
          "Refuse to discuss any scholarly opinions",
        ],
        correctIndex: 1,
        explanation:
          "The honest approach is to acknowledge BeDuhn's favorable assessment of certain NWT choices while noting that he also identified NWT bias and that his overall conclusion is a minority scholarly position. The vast majority of Greek scholars reject key NWT renderings like 'a god' in John 1:1.",
      },
      {
        question:
          "Why is balanced assessment of the NWT more effective than blanket condemnation?",
        options: [
          "Because the NWT is actually a perfect translation with no flaws",
          "Because acknowledging genuine NWT strengths builds credibility, making your criticism of its theological alterations more persuasive — intellectual honesty disarms defensiveness",
          "Because all Bible translations are equally accurate",
          "Because SDAs should avoid criticizing other translations",
        ],
        correctIndex: 1,
        explanation:
          "Blanket condemnation of the NWT is intellectually dishonest (it does have genuine strengths) and alienates JWs. Balanced assessment — acknowledging strengths before exposing theological alterations — demonstrates intellectual honesty, builds credibility, and makes your specific criticisms far more persuasive.",
      },
    ],
  },
];

export const jwTrack: WarCollegeTrack = {
  avatarId: "jw",
  avatarName: "The Jehovah's Witness",
  emoji: "\u{1F4D6}",
  color: "text-purple-400",
  warfareType: "scriptural-revisionists",
  description:
    "An intensive 56-day training track equipping SDA apologists to engage Jehovah's Witness theology with scriptural precision, exposing NWT translation bias, Watchtower authority claims, and revisionist Christology while defending the full deity of Christ and the unity of all believers.",
  days,
};
