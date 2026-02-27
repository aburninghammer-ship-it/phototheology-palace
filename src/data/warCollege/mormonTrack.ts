// ─── War College Track: The Mormon (LDS) ─────────────────────────────────────
// 56-day War College training curriculum for engaging Latter-day Saint theology
// from a Seventh-day Adventist apologetics perspective.

import type { WarCollegeTrack, WarCollegeDay } from "../warCollegeTypes";
import { getDifficultyTier, getXPForDay } from "../warCollegeTypes";

// ── Week 1: Subject Deep Dives ──────────────────────────────────────────────

const week1: WarCollegeDay[] = [
  {
    day: 1,
    title: "Book of Mormon Authority: Another Testament or Another Gospel?",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(1),
    estimatedMinutes: 25,
    xpReward: getXPForDay(1),
    instructorVoice: `Welcome, soldier, to the War College Mormon engagement track. Over the next fifty-six days you will be trained to engage the theology of the Church of Jesus Christ of Latter-day Saints with biblical precision, intellectual honesty, and genuine compassion for the people who hold these beliefs. Our first objective is the cornerstone of LDS authority: the Book of Mormon.

The LDS Church presents the Book of Mormon as 'another testament of Jesus Christ,' a companion volume to the Bible that restores 'plain and precious truths' allegedly lost during a Great Apostasy. They cite Ezekiel 37:16-17 — the 'stick of Judah' and the 'stick of Joseph' — as a prophecy of the Bible and the Book of Mormon being joined together. This is a foundational claim, because if the Book of Mormon is true, then Joseph Smith was a prophet and the LDS Church is God's restored church.

But the Bible provides its own standard for evaluating additional revelation. Isaiah 8:20 declares, 'To the law and to the testimony: if they speak not according to this word, it is because there is no light in them.' And 2 Timothy 3:16-17 affirms that Scripture is sufficient to make the man of God 'perfect, throughly furnished unto all good works.' The Bible does not present itself as incomplete or in need of supplementation.

Your mission today is to understand the LDS claim, identify its hidden assumptions, and begin building a biblical framework for evaluating extra-scriptural authority claims. Every argument you encounter in this track will ultimately trace back to this question: Is the Bible sufficient, or does it need the Book of Mormon?`,
    avatarPresence: `The Mormon avatar steps forward with a well-worn copy of the Book of Mormon alongside the KJV Bible. 'I carry both testaments,' the avatar says warmly. 'God loves all His children — why would He only speak to one continent? The stick of Judah and the stick of Joseph were always meant to come together.'
The avatar's tone is sincere and inviting, reflecting the genuine devotion many Latter-day Saints feel toward their scriptures.`,
    tacticalBriefing: `The Book of Mormon is the keystone of LDS faith. If it falls, the entire LDS theological structure collapses — Joseph Smith's prophetic calling, the restoration narrative, temple ordinances, and the priesthood authority all depend on the Book of Mormon being true. Today you will examine the claim that the Bible is incomplete and needs supplementation, the misuse of Ezekiel 37:16-17, the archaeological and genetic evidence (or lack thereof), and the KJV plagiarism problem within the Book of Mormon text.`,
    drill: `Study Ezekiel 37:15-28 in its full context. Write a 200-word explanation of what the 'stick of Judah' and 'stick of Joseph' actually refer to (the reunification of the northern and southern kingdoms of Israel after the Babylonian exile). Then read 2 Timothy 3:16-17 and write three reasons why Paul's statement about Scripture being sufficient undermines the claim that additional scripture is needed. Finally, list three pieces of evidence (archaeological, genetic, or textual) that challenge the Book of Mormon's historical claims.`,
    forgeAWeapon: `Craft a 'Scripture Sufficiency Shield' — a concise, memorizable argument (under 100 words) that you can deploy when someone claims the Bible is incomplete and needs the Book of Mormon. Include at least two KJV Scripture references and one factual point about the Book of Mormon's lack of archaeological support.`,
    jeevesDebrief: `Excellent first day, soldier. You have begun to understand the foundational LDS claim and why it matters. Remember: every LDS doctrine ultimately rests on the authority of the Book of Mormon. If you can demonstrate that the Bible is sufficient and that the Book of Mormon fails the tests of authentic Scripture, you have addressed the root rather than merely the branches. Tomorrow we examine ongoing revelation and the LDS prophetic office. Rest well — the campaign is just beginning.`,
    masteryCheck: [
      {
        question: "What do the 'stick of Judah' and 'stick of Joseph' in Ezekiel 37:16-17 actually refer to in context?",
        options: [
          "The Bible and the Book of Mormon being joined together",
          "The reunification of the northern and southern kingdoms of Israel",
          "Two prophetic scrolls predicting the end times",
          "The Old Testament and the New Testament"
        ],
        correctIndex: 1,
        explanation: "Ezekiel 37:15-28 describes God's promise to reunify the divided kingdoms of Israel (Judah in the south and Ephraim/Joseph in the north) — not two separate books of scripture."
      },
      {
        question: "Which KJV verse affirms that Scripture is sufficient to make the believer 'perfect, throughly furnished unto all good works'?",
        options: [
          "Isaiah 8:20",
          "Revelation 22:18",
          "2 Timothy 3:16-17",
          "Proverbs 30:5-6"
        ],
        correctIndex: 2,
        explanation: "2 Timothy 3:16-17 states that 'All scripture is given by inspiration of God... that the man of God may be perfect, throughly furnished unto all good works,' affirming the sufficiency of the biblical canon."
      },
      {
        question: "What major category of evidence consistently fails to support the Book of Mormon's historical claims?",
        options: [
          "Theological evidence",
          "Archaeological, genetic, and linguistic evidence",
          "Manuscript transmission evidence",
          "Liturgical evidence"
        ],
        correctIndex: 1,
        explanation: "Despite decades of searching, no archaeological site, artifact, inscription, or genetic evidence has been found to corroborate Book of Mormon civilizations, peoples, or events in the Americas."
      }
    ]
  },
  {
    day: 2,
    title: "Ongoing Revelation: The Living Prophet Claim",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(2),
    estimatedMinutes: 25,
    xpReward: getXPForDay(2),
    instructorVoice: `Today we engage one of the most powerful tools in the LDS arsenal: the claim of a living prophet who receives ongoing revelation from God. The LDS Church teaches that its president is a prophet, seer, and revelator who receives direct communication from God to guide the church. They cite Amos 3:7: 'Surely the Lord GOD will do nothing, but he revealeth his secret unto his servants the prophets.'

This claim functions as a theological trump card. When you present a biblical argument against an LDS doctrine, the response is often: 'The living prophet has received further light on that subject.' This effectively elevates the prophet's words above Scripture, creating an authority structure where the Bible can always be overridden by modern revelation.

The Bible does teach that God gives the gift of prophecy (1 Corinthians 12:28; Ephesians 4:11). Seventh-day Adventists affirm this gift through the ministry of Ellen G. White. But there is a critical difference: a true prophetic gift always points people back to Scripture and never contradicts it. Isaiah 8:20 remains the test. Ellen White herself wrote, 'The Bible, and the Bible alone, is to be our creed.'

Today you will learn to distinguish between the biblical gift of prophecy and the LDS claim of prophetic authority that can override Scripture. This distinction is essential for every engagement you will have with a Latter-day Saint.`,
    avatarPresence: `The Mormon avatar speaks with quiet confidence: 'God has never left His people without a prophet. From Adam to Moses to Peter — and now to our living prophet today. Amos 3:7 promises that God reveals His secrets to His prophets. Why would He stop speaking?'
The avatar gestures toward Salt Lake City as if invoking the weight of institutional authority behind the claim.`,
    tacticalBriefing: `The LDS prophetic authority claim is a meta-argument — it does not address individual doctrines but instead asserts that the LDS prophet has the authority to settle any doctrinal question. You must learn to challenge the claim itself rather than being drawn into individual prophetic pronouncements. Key weaknesses include: failed prophecies (Deuteronomy 18:22 test), doctrinal reversals (polygamy, priesthood ban), and the internal contradiction of prophets contradicting previous prophets.`,
    drill: `Read Deuteronomy 18:20-22 and write down the biblical test for a true prophet. Then research and document three specific LDS prophetic statements that failed or were reversed: (1) Joseph Smith's prophecy about the temple in Independence, Missouri (D&C 84:4-5), (2) Brigham Young's Adam-God doctrine, and (3) the 1978 reversal of the priesthood/temple ban on Black members. For each, write a one-sentence explanation of why it fails the biblical prophetic test.`,
    forgeAWeapon: `Craft a 'Prophetic Test Protocol' — a step-by-step method (4-5 steps) for evaluating any claim of prophetic authority using biblical criteria. Include the Deuteronomy 18:22 test, the Isaiah 8:20 test, and the Deuteronomy 13:1-3 test. Make it practical enough to use in a live conversation.`,
    jeevesDebrief: `Well done, soldier. You now understand that the LDS prophetic claim is not merely about having a church leader — it is about having an authority that can override Scripture itself. This is the critical distinction between the biblical gift of prophecy (which is always subordinate to Scripture) and the LDS prophetic office (which claims authority equal to or above Scripture). Keep this distinction sharp — you will need it throughout this track.`,
    masteryCheck: [
      {
        question: "What is the key difference between the SDA understanding of prophetic gifts and the LDS prophetic authority claim?",
        options: [
          "SDAs do not believe in modern prophecy at all",
          "SDA prophetic gifts are subordinate to Scripture; LDS prophetic authority can override Scripture",
          "The LDS prophet is elected by the people; the SDA prophet is self-appointed",
          "There is no meaningful difference between the two positions"
        ],
        correctIndex: 1,
        explanation: "SDAs affirm the gift of prophecy but hold that it must always be tested against and remain subordinate to Scripture (Isaiah 8:20). LDS theology allows the living prophet's words to effectively override or reinterpret the Bible."
      },
      {
        question: "Which Old Testament passage provides the definitive test for identifying a false prophet?",
        options: [
          "Amos 3:7",
          "Deuteronomy 18:20-22",
          "Isaiah 44:6",
          "Malachi 3:6"
        ],
        correctIndex: 1,
        explanation: "Deuteronomy 18:20-22 states that if a prophet speaks in God's name and the thing does not come to pass, 'that is the thing which the LORD hath not spoken' — the prophet has spoken presumptuously."
      },
      {
        question: "Which Joseph Smith prophecy remains unfulfilled nearly 200 years later?",
        options: [
          "The prophecy of the Civil War",
          "The prophecy that the temple would be built in Independence, Missouri 'in this generation' (D&C 84:4-5)",
          "The prophecy about the Rocky Mountains",
          "The prophecy of the moon being inhabited"
        ],
        correctIndex: 1,
        explanation: "In 1832, Joseph Smith prophesied that a temple would be built in Independence, Missouri 'in this generation' (D&C 84:4-5). That generation has long passed and no temple has been built on the designated site, which is owned by another church."
      }
    ]
  },
  {
    day: 3,
    title: "Temple Ordinances: Baptism for the Dead and Celestial Marriage",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(3),
    estimatedMinutes: 25,
    xpReward: getXPForDay(3),
    instructorVoice: `Today we enter one of the most distinctive features of LDS theology: temple ordinances. The LDS Church teaches that certain sacred rituals must be performed in dedicated temples in order to achieve the highest degree of salvation ('exaltation' in the celestial kingdom). These include baptism for the dead, the endowment ceremony, and celestial (eternal) marriage. Without these ordinances, even faithful believers are limited in their eternal progression.

The practice of baptism for the dead is based primarily on a single verse: 1 Corinthians 15:29, where Paul asks, 'Else what shall they do which are baptized for the dead, if the dead rise not at all? why are they then baptized for the dead?' The LDS Church interprets this as an endorsement of vicarious proxy baptism — living members being baptized on behalf of deceased persons who never had the opportunity to accept the gospel.

However, careful examination reveals that Paul is making a rhetorical argument for the resurrection, not endorsing a practice. He says 'they' (third person), not 'we' — distancing himself from whatever group practiced this. Furthermore, Hebrews 9:27 declares, 'It is appointed unto men once to die, but after this the judgment.' There is no post-mortem opportunity for salvation in biblical theology.

The temple endowment ceremony has undergone significant changes since Joseph Smith introduced it, and celestial marriage — the requirement of temple marriage for exaltation — has no biblical basis. Jesus explicitly stated that in the resurrection, people 'neither marry, nor are given in marriage' (Matthew 22:30).`,
    avatarPresence: `The Mormon avatar speaks reverently: 'The temple is the house of the Lord — the most sacred place on earth. There we perform ordinances that bind families together for eternity. Wouldn't you want your ancestors who never heard the gospel to have a chance? That is the love of God — reaching beyond the grave.'
The avatar's eyes shine with genuine devotion to the concept of eternal families.`,
    tacticalBriefing: `Temple ordinances are deeply personal to Latter-day Saints. The promise of eternal families is perhaps the most emotionally compelling aspect of LDS theology. Approach this subject with sensitivity while maintaining biblical clarity. Key points: (1) 1 Corinthians 15:29 does not endorse baptism for the dead, (2) Hebrews 9:27 establishes death as the boundary of salvific opportunity, (3) Matthew 22:30 directly contradicts celestial marriage, and (4) the temple endowment ceremony has been significantly altered multiple times.`,
    drill: `Read 1 Corinthians 15:29 in its full context (the entire chapter). Write a 150-word explanation of Paul's argument — why he mentions baptism for the dead and what rhetorical point he is making about the resurrection. Then read Matthew 22:23-33 and summarize Jesus' teaching about marriage in the resurrection. Finally, read Hebrews 9:27 and explain in three sentences why this verse undermines the theological foundation of baptism for the dead.`,
    forgeAWeapon: `Create an 'Eternal Families Truth Card' — a brief, compassionate response (under 120 words) that affirms the beauty of family while showing that the Bible promises something different from celestial marriage. Include Matthew 22:30, Hebrews 9:27, and a statement about the biblical hope of resurrection and reunion.`,
    jeevesDebrief: `Good work today, soldier. Temple ordinances are the heart of LDS devotional life, and you must engage this topic with both precision and empathy. Many Latter-day Saints have had deeply meaningful experiences in the temple, and the promise of eternal families provides immense comfort. Never mock these experiences — instead, gently redirect to what the Bible actually promises: resurrection, reunion, and an eternity of joy in God's presence that surpasses anything we can imagine. The biblical hope is better, not lesser.`,
    masteryCheck: [
      {
        question: "In 1 Corinthians 15:29, what is Paul's actual rhetorical purpose in mentioning baptism for the dead?",
        options: [
          "He is endorsing the practice as essential for salvation",
          "He is using it as a rhetorical argument for the reality of the resurrection",
          "He is commanding the Corinthians to begin the practice",
          "He is describing an Old Testament ritual"
        ],
        correctIndex: 1,
        explanation: "Paul uses the third person ('they') and references the practice to make a point about the resurrection: even those who practice this acknowledge that the dead will rise. He is not endorsing the practice but using it rhetorically."
      },
      {
        question: "What did Jesus say about marriage in the resurrection in Matthew 22:30?",
        options: [
          "Marriage will be eternal for those who are sealed in the temple",
          "Only the righteous will be married in heaven",
          "In the resurrection they neither marry nor are given in marriage",
          "Marriage will be restored to its Edenic perfection"
        ],
        correctIndex: 2,
        explanation: "Jesus explicitly stated that 'in the resurrection they neither marry, nor are given in marriage, but are as the angels of God in heaven' (Matthew 22:30), directly contradicting the LDS doctrine of celestial marriage."
      },
      {
        question: "Which verse establishes that death is the boundary of salvific opportunity?",
        options: [
          "1 Corinthians 15:29",
          "Matthew 22:30",
          "Hebrews 9:27",
          "John 3:16"
        ],
        correctIndex: 2,
        explanation: "Hebrews 9:27 declares, 'It is appointed unto men once to die, but after this the judgment' — establishing death as the final boundary, with no post-mortem opportunity for baptism or conversion."
      }
    ]
  },
  {
    day: 4,
    title: "The Godhood Doctrine: Exaltation and the Lorenzo Snow Couplet",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(4),
    estimatedMinutes: 25,
    xpReward: getXPForDay(4),
    instructorVoice: `Today we confront one of the most theologically radical doctrines in all of Latter-day Saint theology: the doctrine of human exaltation to godhood. Lorenzo Snow, the fifth president of the LDS Church, famously declared: 'As man now is, God once was; as God now is, man may be.' This couplet encapsulates the LDS teaching that God the Father was once a mortal man who progressed to deity, and that faithful Mormons can follow the same path to become gods themselves.

This doctrine was articulated most fully by Joseph Smith in his King Follett discourse (April 1844), where he proclaimed: 'God himself was once as we are now, and is an exalted man, and sits enthroned in yonder heavens!' He further stated: 'You have got to learn how to be gods yourselves, and to be kings and priests to God, the same as all gods have done before you.'

The biblical response is decisive. Isaiah 43:10 declares, 'Before me there was no God formed, neither shall there be after me.' Malachi 3:6 affirms, 'For I am the LORD, I change not.' Psalm 90:2 proclaims, 'From everlasting to everlasting, thou art God.' God has always been God — eternal, self-existent, and unchangeable in nature. He was never a man, and no man will ever become a god.

Furthermore, the aspiration to 'be like God' is not a holy ambition — it is the original lie of the serpent in Eden: 'Ye shall be as gods' (Genesis 3:5). It is also the core of Lucifer's rebellion: 'I will be like the most High' (Isaiah 14:14). The LDS exaltation doctrine unwittingly baptizes Satan's original temptation as gospel truth.`,
    avatarPresence: `The Mormon avatar beams with hope: 'This is the most beautiful doctrine in all of Christianity — that God loves us so much that He wants us to become like Him. A father wants his children to grow up to be like him. Our Heavenly Father is no different. Eternal progression is the very purpose of existence.'
The avatar's sincerity is palpable — this doctrine is deeply personal and motivational for many Latter-day Saints.`,
    tacticalBriefing: `The exaltation doctrine is the logical culmination of several LDS teachings: God has a physical body, God was once mortal, the pre-existence, temple ordinances, and celestial marriage all feed into the ultimate goal of becoming a god. Challenge this at the root by establishing God's eternal, unchangeable nature from Scripture. Key verses: Isaiah 43:10, Malachi 3:6, Psalm 90:2, Numbers 23:19. Also establish the connection between the exaltation doctrine and the original temptation of Genesis 3:5 and Isaiah 14:14.`,
    drill: `Read Isaiah 43:10-12 carefully and write a 100-word explanation of why this verse eliminates the possibility of new gods being formed — either before or after Yahweh. Then read Genesis 3:1-5 and Isaiah 14:12-14. Write a comparison (150 words) between the serpent's promise ('ye shall be as gods'), Lucifer's ambition ('I will be like the most High'), and the Lorenzo Snow couplet ('as God now is, man may be'). Note the structural parallels.`,
    forgeAWeapon: `Forge an 'Isaiah 43:10 Hammer' — a concise argument (under 100 words) that uses Isaiah 43:10 as the centerpiece to demolish the exaltation doctrine. Include the connection to Genesis 3:5 and a brief statement about the difference between biblical glorification (Christlike character) and LDS exaltation (becoming a god).`,
    jeevesDebrief: `Outstanding work, soldier. The exaltation doctrine is perhaps the greatest theological departure of LDS theology from biblical Christianity. It redefines God, redefines humanity, redefines salvation, and redefines the purpose of existence. When you demonstrate from Isaiah 43:10 that no gods were formed before or after Yahweh, and when you trace the 'be like God' aspiration to its origin in Eden and in Lucifer's rebellion, you have struck at the theological root. The biblical hope is not that we become gods — it is that we are adopted as children of the one true God and enjoy Him forever.`,
    masteryCheck: [
      {
        question: "What does Isaiah 43:10 say about the formation of other gods?",
        options: [
          "Other gods exist but are inferior to Yahweh",
          "Before Yahweh there was no God formed, neither shall there be after Him",
          "Gods are formed through righteous living and temple ordinances",
          "The question of other gods is left ambiguous"
        ],
        correctIndex: 1,
        explanation: "Isaiah 43:10 is explicit: 'Before me there was no God formed, neither shall there be after me.' This directly and decisively eliminates the possibility of humans becoming gods, contradicting the core LDS exaltation doctrine."
      },
      {
        question: "Who first made the promise 'ye shall be as gods' in the Bible?",
        options: [
          "God the Father in the Garden of Eden",
          "Jesus Christ in His earthly ministry",
          "The serpent (Satan) in Genesis 3:5",
          "Moses on Mount Sinai"
        ],
        correctIndex: 2,
        explanation: "The promise 'ye shall be as gods' was first spoken by the serpent (Satan) in Genesis 3:5 as a temptation to Eve. The LDS exaltation doctrine structurally mirrors this original lie."
      },
      {
        question: "What is the key difference between biblical glorification and LDS exaltation?",
        options: [
          "There is no meaningful difference",
          "Biblical glorification means becoming Christlike in character; LDS exaltation means becoming a god who rules worlds",
          "Biblical glorification happens immediately at death; LDS exaltation takes millions of years",
          "Biblical glorification is only for Jews; LDS exaltation is for everyone"
        ],
        correctIndex: 1,
        explanation: "Biblical glorification means being transformed into Christlike character and receiving eternal life as children of God. LDS exaltation means literally becoming a god who creates and rules worlds — a fundamentally different concept."
      }
    ]
  },
  {
    day: 5,
    title: "Pre-existence and the Council in Heaven",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(5),
    estimatedMinutes: 25,
    xpReward: getXPForDay(5),
    instructorVoice: `Today we examine the LDS doctrine of pre-existence — the teaching that all human beings existed as spirit children of Heavenly Father and a Heavenly Mother before being born on earth. According to LDS theology, in this pre-mortal realm, a grand 'council in heaven' took place where Heavenly Father presented His plan of salvation. Jesus (called Jehovah) volunteered to be the Savior, while Lucifer proposed an alternative plan. Those spirits who chose to follow Christ's plan were given the opportunity to receive mortal bodies on earth. Those who followed Lucifer were cast out and became demons.

This doctrine has enormous implications. It means that every human being is a literal spirit offspring of God. It means Jesus and Lucifer are spirit brothers. It means race, circumstances of birth, and earthly conditions were determined by one's 'valiance' in the pre-mortal existence — a teaching that was historically used to justify the priesthood ban on Black members.

The Bible presents a very different picture. Zechariah 12:1 says God 'formeth the spirit of man within him' — spirits are formed at creation, not pre-existing. Ecclesiastes 12:7 says the spirit returns to God who gave it — implying origin with God at creation. And Psalm 139:13-16 describes God forming individuals in the womb, not sending pre-existing spirits into bodies.

The pre-existence doctrine is not biblical — it is borrowed from Platonic philosophy and Joseph Smith's creative theological speculation. It undermines the biblical teaching that each person is a unique creation of God, formed at conception, not a pre-existing spirit clothed in flesh.`,
    avatarPresence: `The Mormon avatar speaks with wonder: 'Before you were born, you lived with Heavenly Father. You knew Him. You chose to come to earth as part of His plan. This life is a test — and the veil of forgetfulness was placed over your mind so you could exercise faith. But deep down, your spirit remembers.'
The avatar's voice carries a note of nostalgia, as if recalling a real memory.`,
    tacticalBriefing: `The pre-existence doctrine serves multiple theological functions in LDS thought: it provides a framework for the 'council in heaven,' it makes Jesus and Lucifer spirit brothers, it explains the purpose of earthly life, and it historically justified racial hierarchies. Dismantle it by showing that the Bible teaches spirits are formed at creation (Zechariah 12:1), that Jesus is the uncreated Creator (John 1:1-3), and that the entire framework has more in common with Plato's philosophy than with biblical theology.`,
    drill: `Read Zechariah 12:1, Ecclesiastes 12:7, and Psalm 139:13-16. Write a 200-word summary of what these passages teach about the origin of the human spirit. Then read Jeremiah 1:5 — a verse LDS missionaries sometimes cite for pre-existence — and write a 100-word explanation of why divine foreknowledge ('Before I formed thee... I knew thee') is different from pre-existence (spirits literally existing before birth).`,
    forgeAWeapon: `Create a 'Foreknowledge vs. Pre-existence' clarification tool — a side-by-side comparison (two columns, 4-5 points each) showing the difference between the biblical concept of God's foreknowledge (He knew us before forming us) and the LDS concept of literal pre-mortal spirit existence. Include Scripture references for each point.`,
    jeevesDebrief: `Well executed, soldier. The pre-existence doctrine is one of those teachings that sounds beautiful on the surface — the idea that we knew God before birth and chose to come to earth. But beneath the surface, it leads to theological catastrophe: it makes Jesus a created being, it makes Lucifer His brother, it historically justified racism, and it replaces the biblical God who creates each person uniquely with a God who merely assigns pre-existing spirits to bodies. The biblical truth is better: you are a unique, intentional creation of the Almighty, known and loved before you existed — not because you were already there, but because He is omniscient.`,
    masteryCheck: [
      {
        question: "What does Zechariah 12:1 teach about the origin of the human spirit?",
        options: [
          "Spirits are eternal and uncreated",
          "God formeth the spirit of man within him — spirits are formed at creation",
          "Spirits exist in heaven before being sent to earth",
          "The origin of the spirit is unknowable"
        ],
        correctIndex: 1,
        explanation: "Zechariah 12:1 states that the LORD 'formeth the spirit of man within him,' indicating that human spirits are created by God at the point of human formation, not pre-existing."
      },
      {
        question: "Why does Jeremiah 1:5 not support the LDS doctrine of pre-existence?",
        options: [
          "It was written before the LDS Church existed",
          "It describes God's foreknowledge, not literal pre-mortal existence of Jeremiah's spirit",
          "It only applies to prophets, not regular people",
          "It was mistranslated in the KJV"
        ],
        correctIndex: 1,
        explanation: "Jeremiah 1:5 ('Before I formed thee in the belly I knew thee') describes God's omniscient foreknowledge — He knew Jeremiah's purpose before forming him. This is categorically different from the LDS claim that Jeremiah's spirit literally existed as a person before birth."
      },
      {
        question: "What non-biblical philosophical tradition most closely parallels the LDS pre-existence doctrine?",
        options: [
          "Aristotelian empiricism",
          "Platonic philosophy (pre-existence of souls)",
          "Stoic materialism",
          "Kantian idealism"
        ],
        correctIndex: 1,
        explanation: "Plato taught that souls pre-exist in an ideal realm before being incarnated in physical bodies — a concept remarkably similar to the LDS pre-mortal existence. This was not a biblical teaching but a Greek philosophical concept that Joseph Smith absorbed and adapted."
      }
    ]
  },
  {
    day: 6,
    title: "Baptism for the Dead: Proxy Salvation and Post-Mortem Opportunity",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(6),
    estimatedMinutes: 25,
    xpReward: getXPForDay(6),
    instructorVoice: `Today we return to the practice of baptism for the dead with deeper theological analysis. Yesterday we touched on this in the context of temple ordinances; today we examine the full theological framework that supports it and the comprehensive biblical case against post-mortem salvation.

The LDS Church teaches that billions of people who lived and died without hearing the LDS gospel will have the opportunity to accept it in the 'spirit world' after death. Living LDS members perform vicarious baptisms in temples on behalf of these deceased individuals. The LDS Church maintains the largest genealogical database in the world, with the primary purpose of identifying ancestors for whom temple work can be performed.

The theological foundation rests on a misreading of 1 Corinthians 15:29 and 1 Peter 3:18-20 (Christ preaching to 'the spirits in prison'). But the biblical teaching is clear. Hebrews 9:27 states, 'It is appointed unto men once to die, but after this the judgment.' Luke 16:19-31 (the parable of the rich man and Lazarus) depicts an impassable gulf between the righteous and the unrighteous after death. Ecclesiastes 9:5 declares, 'The dead know not any thing' — they are in an unconscious sleep awaiting the resurrection.

The Adventist understanding of death as an unconscious sleep (the state of the dead) actually provides one of the strongest refutations of baptism for the dead. If the dead 'know not any thing,' they cannot hear a gospel presentation in the spirit world, they cannot make a decision for or against Christ, and they cannot benefit from a proxy baptism. The entire LDS post-mortem salvation framework collapses when the biblical state of the dead is properly understood.`,
    avatarPresence: `The Mormon avatar pleads earnestly: 'Think of the billions who died without ever hearing the gospel of Jesus Christ. Is God so unjust that He would condemn them without a chance? Baptism for the dead is the answer — it is the ultimate act of love, reaching across the veil of death to offer salvation to all of God's children.'
The avatar's compassion for the deceased is genuine and deeply felt.`,
    tacticalBriefing: `Baptism for the dead appeals to people's sense of fairness and compassion. The LDS argument is emotionally compelling: surely a loving God would not condemn people who never had a chance. Your response must address both the emotional appeal and the theological errors. Key arguments: (1) the SDA state of the dead doctrine (unconscious sleep), (2) Hebrews 9:27 on post-death judgment, (3) the proper reading of 1 Peter 3:18-20, and (4) the sufficiency of God's justice without proxy ordinances (Romans 2:14-16 — God judges people based on the light they received).`,
    drill: `Study the following passages and write a 50-word summary of each: (1) Ecclesiastes 9:5-6 on the state of the dead, (2) Hebrews 9:27 on death and judgment, (3) Luke 16:19-31 on the impassable gulf, (4) 1 Peter 3:18-20 in context (what Christ was actually doing — proclaiming victory, not offering salvation). Then write a 100-word explanation of how the SDA understanding of death as unconscious sleep demolishes the entire framework of baptism for the dead.`,
    forgeAWeapon: `Build a 'State of the Dead Shield' — a brief argument (under 120 words) that uses the SDA doctrine of the state of the dead to dismantle baptism for the dead. Show that if the dead are unconscious (Ecclesiastes 9:5), they cannot hear the gospel in a 'spirit world,' make post-mortem decisions, or benefit from proxy baptisms. Include at least three KJV references.`,
    jeevesDebrief: `Excellent, soldier. You have discovered one of the most powerful tools in the SDA apologetic arsenal: the state of the dead. This single doctrine demolishes not only baptism for the dead but the entire LDS 'spirit world' framework, the Catholic doctrine of purgatory, the belief in ghosts, and the practice of praying to saints. When you understand that the dead are asleep, unconscious, awaiting the resurrection — you have a key that unlocks multiple apologetic doors. Remember, the LDS motivation is compassion — honor that while redirecting them to the Bible's actual teaching about God's justice and the resurrection hope.`,
    masteryCheck: [
      {
        question: "How does the SDA doctrine of the state of the dead undermine baptism for the dead?",
        options: [
          "It proves that baptism is unnecessary",
          "If the dead are unconscious (Ecclesiastes 9:5), they cannot hear the gospel or make decisions in a 'spirit world'",
          "It shows that only living people can be baptized in water",
          "It demonstrates that the temple is not important"
        ],
        correctIndex: 1,
        explanation: "Ecclesiastes 9:5 states 'the dead know not any thing.' If the dead are in unconscious sleep, the entire LDS framework of post-mortem gospel hearing, decision-making, and proxy baptism falls apart — there is no conscious 'spirit world' experience."
      },
      {
        question: "What does 1 Peter 3:18-20 actually describe when it speaks of Christ preaching to 'spirits in prison'?",
        options: [
          "Jesus offering a second chance at salvation to dead people in the spirit world",
          "Jesus performing baptisms for the dead between His death and resurrection",
          "Christ proclaiming victory over evil — not offering post-mortem salvation",
          "The Holy Spirit converting people in modern prisons"
        ],
        correctIndex: 2,
        explanation: "In context, 1 Peter 3:18-20 describes Christ's proclamation of victory (not an evangelistic appeal) to the spirits who disobeyed in Noah's day. The Greek word 'ekeruxen' means 'proclaimed' or 'heralded,' not 'evangelized.' This is a declaration of triumph, not an offer of salvation."
      },
      {
        question: "According to Romans 2:14-16, how does God deal justly with those who never heard the gospel?",
        options: [
          "He sends missionaries to them after death in the spirit world",
          "He judges them according to the light they received — their conscience bearing witness",
          "He automatically saves everyone who never heard",
          "He condemns them all without exception"
        ],
        correctIndex: 1,
        explanation: "Romans 2:14-16 teaches that God judges those without the law by the law written in their hearts — their conscience bearing witness. God's justice does not require post-mortem proxy baptisms; He judges each person fairly based on the light they received."
      }
    ]
  },
  {
    day: 7,
    title: "Prophetic Succession: From Joseph Smith to Today",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(7),
    estimatedMinutes: 30,
    xpReward: getXPForDay(7),
    instructorVoice: `Today we complete our first week by examining the LDS doctrine of prophetic succession — the claim that an unbroken chain of prophets has led the LDS Church from Joseph Smith to the present-day president. This doctrine asserts that the LDS prophet holds the 'keys of the kingdom' and that God will never allow the prophet to lead the church astray.

This claim is tested by the historical record. Joseph Smith (1830-1844) introduced polygamy and the doctrine of human exaltation. Brigham Young (1847-1877) taught the Adam-God doctrine (that Adam was actually God the Father) and enforced blood atonement theology. Later prophets quietly abandoned both. The priesthood and temple ban on Black members was presented as divine revelation by multiple prophets — until it was reversed in 1978 and recharacterized as a 'policy' rather than doctrine.

The pattern is troubling: each generation of LDS prophets has reversed or quietly abandoned teachings of previous prophets while maintaining the claim that a prophet can never lead the church astray. This creates a paradox. If Brigham Young was speaking as a prophet when he taught the Adam-God doctrine, then the church was led astray when later prophets rejected it. If he was not speaking as a prophet, then how can members distinguish prophetic revelation from personal opinion?

Numbers 23:19 declares, 'God is not a man, that he should lie; neither the son of man, that he should repent: hath he said, and shall he not do it?' God's truth does not evolve, reverse, or contradict itself across generations. The shifting sands of LDS prophetic teaching stand in stark contrast to the unchanging foundation of Scripture.`,
    avatarPresence: `The Mormon avatar speaks with institutional confidence: 'We are blessed to have a living prophet who receives revelation for our time. Just as conditions changed from Moses to Paul, God continues to give new light. The prophet will never lead the church astray — that is God's promise to His people.'
The avatar seems unbothered by historical contradictions, viewing each prophetic era as a step in progressive revelation.`,
    tacticalBriefing: `The prophetic succession claim is vulnerable at multiple points. Document the pattern: (1) Joseph Smith taught polygamy as an 'everlasting covenant' (D&C 132); later prophets abandoned it. (2) Brigham Young taught the Adam-God doctrine; it was later rejected. (3) Multiple prophets enforced the racial priesthood ban as revelation; it was reversed in 1978. (4) The promise that 'the prophet will never lead the church astray' is itself unfalsifiable — any error is retroactively reclassified as 'speaking as a man.' Use Deuteronomy 18:22 and Isaiah 8:20 as your measuring rods.`,
    drill: `Create a timeline of major LDS prophetic reversals: (1) Polygamy: D&C 132 (1843) vs. Manifesto (1890), (2) Adam-God doctrine: Brigham Young's General Conference teachings vs. later rejection, (3) Priesthood/temple ban on Black members: established by Brigham Young vs. reversed in 1978, (4) Blood atonement: taught by Brigham Young vs. abandoned by later prophets. For each, write a one-sentence explanation of why this reversal is problematic if prophets cannot lead the church astray.`,
    forgeAWeapon: `Craft a 'Prophetic Consistency Test' — a series of three questions you can ask in conversation that expose the problem of prophetic reversals: (1) Was Brigham Young speaking as a prophet when he taught the Adam-God doctrine? (2) If the priesthood ban was revelation, was the reversal also revelation — and if so, was the original revelation from God? (3) If prophets can speak as 'just a man' on matters of doctrine, how do you distinguish prophetic revelation from personal opinion?`,
    jeevesDebrief: `Strong finish to Week 1, soldier. You have now surveyed the seven foundational subjects of LDS theology: Book of Mormon authority, ongoing revelation, temple ordinances, the godhood doctrine, pre-existence, baptism for the dead, and prophetic succession. Each of these is a pillar of LDS faith, and each one has been weighed against Scripture and found wanting. Next week, we shift from understanding their arguments to mastering their strongest forms. Steelman week begins tomorrow — prepare to argue the LDS position better than most Latter-day Saints can before dismantling it with biblical precision.`,
    masteryCheck: [
      {
        question: "What is the fundamental paradox of LDS prophetic succession?",
        options: [
          "The prophets disagree about which books are scripture",
          "If prophets cannot lead the church astray, then reversals of previous prophets' doctrines mean someone led the church astray",
          "The prophets are elected democratically rather than called by God",
          "There have been gaps in prophetic leadership"
        ],
        correctIndex: 1,
        explanation: "The LDS Church claims that a prophet will never lead the church astray. But when later prophets reverse the teachings of earlier prophets (polygamy, Adam-God, priesthood ban), either the earlier prophet led the church astray or the reversal itself is a departure from divine revelation."
      },
      {
        question: "What was the Adam-God doctrine taught by Brigham Young?",
        options: [
          "Adam was the first prophet of the LDS Church",
          "Adam was actually God the Father in mortal form",
          "Adam will return as the Messiah",
          "Adam and Eve were the only people God created directly"
        ],
        correctIndex: 1,
        explanation: "Brigham Young taught that Adam was actually God the Father who came to earth with one of his celestial wives (Eve) to begin the human race. This was taught at General Conference and in the temple ceremony but was later quietly rejected by subsequent LDS prophets."
      },
      {
        question: "How was the 1978 reversal of the priesthood ban on Black members problematic for LDS prophetic authority?",
        options: [
          "It happened too quickly without proper revelation",
          "It contradicted the claim that prophets cannot lead the church astray — either the ban or the reversal was wrong",
          "It was only a partial reversal",
          "It was not problematic at all"
        ],
        correctIndex: 1,
        explanation: "Multiple LDS prophets presented the priesthood ban as divinely instituted revelation. The 1978 reversal either means those prophets taught false doctrine (leading the church astray) or the reversal itself contradicts God's will — either option undermines the claim of infallible prophetic guidance."
      }
    ]
  },
];

// ── Week 2: Steelman Argument Mastery ───────────────────────────────────────

const week2: WarCollegeDay[] = [
  {
    day: 8,
    title: "Steelman: The Book of Mormon as Another Testament",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(8),
    estimatedMinutes: 25,
    xpReward: getXPForDay(8),
    instructorVoice: `Welcome to Week 2, soldier. This week we master the art of steelmanning — presenting the strongest possible version of LDS arguments before dismantling them. A soldier who underestimates the enemy's strength is a soldier who loses battles. Today we steelman the Book of Mormon's claim to be another testament of Jesus Christ.

The strongest version of this argument runs as follows: God is not limited to one geographic region or one written record. Just as He inspired prophets across centuries to produce the sixty-six books of the Bible, He could inspire prophets in the Americas to produce an additional record. Ezekiel 37:16-17 prophesied two 'sticks' (scrolls) being joined — Judah's record (the Bible) and Joseph's record (the Book of Mormon). The Book of Mormon does not contradict the Bible; it supplements it, providing additional witnesses of Christ's ministry. Jesus Himself said, 'Other sheep I have, which are not of this fold' (John 10:16), which the Book of Mormon claims was fulfilled when the resurrected Christ visited the Americas.

This is a compelling argument when presented well. It appeals to biblical precedent, cites Scripture, and invokes Jesus' own words. To defeat it, you must be surgical — demonstrating that Ezekiel 37 has a different context, John 10:16 refers to Gentiles, and the Book of Mormon's internal evidence (anachronisms, KJV plagiarism, lack of archaeology) betrays a 19th-century origin.`,
    avatarPresence: `The Mormon avatar presents the case with scholarly composure: 'Consider this: if God spoke to Isaiah in Jerusalem and to Paul in Rome, why not to Nephi in the Americas? The Bible itself is a collection of testimonies from different times and places. The Book of Mormon is simply another testimony — another witness that Jesus is the Christ. Two witnesses are better than one.'
The avatar speaks as if this is the most natural, reasonable thing in the world.`,
    tacticalBriefing: `When steelmanning, you must temporarily inhabit the argument's logic. The Book of Mormon argument rests on: (1) God can inspire multiple records, (2) Ezekiel 37 prophesied this, (3) John 10:16 predicted Christ's visit to the Americas, (4) additional testimony strengthens rather than undermines the Bible. Your counter must show: Ezekiel 37 is about Israel's political reunification (read vv. 21-28), John 10:16 refers to Gentiles being brought into the fold (cf. Acts 10), and the Book of Mormon contains anachronisms (steel, horses, wheat, elephants, chariots) that betray a non-ancient origin.`,
    drill: `Write the strongest possible 200-word argument FOR the Book of Mormon as another testament of Christ. Use the LDS proof-texts (Ezekiel 37:16-17, John 10:16) and present the case as compellingly as you can. Then, beneath it, write a 250-word rebuttal that addresses every point — using Ezekiel 37:21-28 for context, Acts 10 for John 10:16, and at least three anachronistic elements from the Book of Mormon.`,
    forgeAWeapon: `Forge a 'Steelman Breaker' for the Book of Mormon argument — a structured response that first acknowledges the strongest version of the argument, then systematically dismantles it point by point. Format: (1) Acknowledge, (2) Address Ezekiel 37, (3) Address John 10:16, (4) Present the archaeological/anachronistic evidence. Keep it under 200 words.`,
    jeevesDebrief: `Excellent steelmanning, soldier. Notice how much stronger your rebuttal becomes when you first present the best version of the opposing argument. A common mistake in apologetics is attacking a straw man — a weak version of the argument that no thoughtful Latter-day Saint would actually use. When you steelman first, your opponent knows you understand their position, which builds respect and opens ears. Tomorrow we steelman the most philosophically challenging LDS argument: human exaltation to godhood.`,
    masteryCheck: [
      {
        question: "What does John 10:16 ('other sheep I have, which are not of this fold') actually refer to in biblical context?",
        options: [
          "Ancient peoples in the Americas who would receive the Book of Mormon",
          "Gentiles who would be brought into the fold of faith (cf. Acts 10)",
          "Lost tribes of Israel scattered throughout Asia",
          "Future Christian denominations"
        ],
        correctIndex: 1,
        explanation: "In context, Jesus' 'other sheep' refers to Gentiles who would be brought into the fold of God's people — a theme developed throughout Acts and the epistles, beginning with Peter's vision in Acts 10 and the inclusion of Cornelius."
      },
      {
        question: "What is the purpose of steelmanning an opponent's argument before refuting it?",
        options: [
          "To confuse the opponent by agreeing with them",
          "To demonstrate that you understand their position at its strongest, building credibility and making your rebuttal more effective",
          "To waste time before presenting your actual argument",
          "To show that all arguments are equally valid"
        ],
        correctIndex: 1,
        explanation: "Steelmanning shows intellectual honesty and builds credibility. When you demonstrate that you understand the strongest version of the opposing argument, your refutation carries more weight because the opponent cannot claim you have misunderstood their position."
      },
      {
        question: "Which of the following is an anachronism in the Book of Mormon (something that did not exist in pre-Columbian America)?",
        options: [
          "Corn and beans",
          "Stone temples",
          "Steel swords, horses, wheat, and chariots",
          "Obsidian blades"
        ],
        correctIndex: 2,
        explanation: "The Book of Mormon mentions steel swords, horses, wheat, barley, chariots, and other items that archaeological evidence confirms did not exist in pre-Columbian America. These anachronisms suggest a 19th-century author who assumed these things were present."
      }
    ]
  },
  {
    day: 9,
    title: "Steelman: God Was Once a Man — The Case for Eternal Progression",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(9),
    estimatedMinutes: 25,
    xpReward: getXPForDay(9),
    instructorVoice: `Today we steelman the LDS doctrine of eternal progression — the teaching that God was once a mortal man and that humans can progress to godhood. This is the most philosophically ambitious claim in LDS theology, and its strongest form is more nuanced than many Christians realize.

The steelman version argues: God is a loving Father who wants His children to become like Him, just as any earthly father wants his children to grow up to share his nature. The Bible says we are 'children of God' (Romans 8:16) and 'partakers of the divine nature' (2 Peter 1:4). Jesus prayed that believers might be 'one' with the Father as He and the Father are one (John 17:21). Psalm 82:6 declares, 'Ye are gods; and all of you are children of the most High' — and Jesus quoted this approvingly in John 10:34. The Eastern Orthodox concept of 'theosis' (deification) teaches something similar: that humans participate in the divine nature. LDS exaltation is simply the fullest expression of this biblical trajectory.

This is the strongest form of the argument, and it requires a precise response. You must distinguish between: (1) biblical adoption/glorification and LDS ontological deity, (2) 'partaking of the divine nature' (character transformation) and 'becoming a god' (ontological change), (3) Psalm 82:6 in context (addressed to unjust judges, not a promise of deity), and (4) Orthodox theosis (participation in divine nature) versus LDS exaltation (literally becoming a separate god ruling your own world).`,
    avatarPresence: `The Mormon avatar presents the philosophical case: 'Even C.S. Lewis wrote that God's goal is to make us like Himself — little Christs. The Bible says we are heirs of God and joint-heirs with Christ. If we inherit what Christ has, and Christ is God, then what are we inheriting? Godhood is simply the logical conclusion of the gospel.'
The avatar cleverly invokes a respected Christian author to build a bridge.`,
    tacticalBriefing: `The C.S. Lewis appeal is a common tactic — but Lewis explicitly rejected the idea that humans become separate gods. His concept of 'little Christs' is about character transformation within the body of Christ, not ontological deity. The 2 Peter 1:4 appeal requires showing that 'divine nature' in context means moral character (the list in vv. 5-7: virtue, knowledge, temperance, etc.), not ontological godhood. Psalm 82:6 must be read in context: God addresses corrupt judges who will 'die like men' (v. 7) — it is a rebuke, not a promise.`,
    drill: `Write the strongest 200-word argument FOR the LDS exaltation doctrine, using Romans 8:16-17, 2 Peter 1:4, Psalm 82:6, John 10:34, and John 17:21. Make it as compelling as possible. Then write a 300-word rebuttal that: (1) distinguishes adoption from ontological deity, (2) shows that 'divine nature' in 2 Peter 1:4 means character (read vv. 5-7), (3) explains Psalm 82:6 in context (read all of Psalm 82, especially v. 7), and (4) uses Isaiah 43:10 as the decisive refutation.`,
    forgeAWeapon: `Forge a 'Theosis vs. Exaltation Distinction Tool' — a clear, concise explanation (under 150 words) of the difference between the Christian concept of glorification/theosis (becoming like God in character while remaining a creature) and the LDS concept of exaltation (literally becoming a god). Include at least two Scripture references that establish the boundary.`,
    jeevesDebrief: `Outstanding work, soldier. The exaltation argument is the most philosophically sophisticated LDS claim, and many Christians fumble it because they do not expect the appeal to 2 Peter 1:4 or Psalm 82:6. By steelmanning it first, you have inoculated yourself against surprise. The key insight is that the Bible consistently teaches transformation of character, not transformation of nature. We become like God in love, holiness, and righteousness — but we never become gods. Isaiah 43:10 is the immovable wall: no gods were formed before or after Yahweh.`,
    masteryCheck: [
      {
        question: "What does 2 Peter 1:4 mean by 'partakers of the divine nature' in context?",
        options: [
          "Humans will literally become gods with their own worlds",
          "Believers will develop divine character qualities — virtue, knowledge, temperance, godliness (vv. 5-7)",
          "Christians will gain physical bodies like God's",
          "Faithful members will join the Godhead as a fourth member"
        ],
        correctIndex: 1,
        explanation: "2 Peter 1:5-7 immediately defines 'divine nature' in terms of moral character: virtue, knowledge, temperance, patience, godliness, brotherly kindness, charity. It is about character transformation, not ontological deity."
      },
      {
        question: "What is the context of Psalm 82:6 ('Ye are gods')?",
        options: [
          "God promising faithful believers that they will achieve deity",
          "God rebuking unjust judges who will 'die like men' (v. 7) — a rebuke, not a promise",
          "A prophecy of the LDS temple ceremony",
          "God addressing the pre-mortal spirits in the council in heaven"
        ],
        correctIndex: 1,
        explanation: "Psalm 82 is addressed to unjust human judges (called 'gods' because they wielded divine authority). Verse 7 pronounces judgment: 'But ye shall die like men.' It is a rebuke of corrupt authority, not a promise of literal godhood."
      },
      {
        question: "How does the Christian concept of theosis/glorification differ from LDS exaltation?",
        options: [
          "They are identical concepts with different names",
          "Theosis means participation in God's character while remaining a creature; LDS exaltation means literally becoming a separate god",
          "Theosis is a Catholic invention; exaltation is biblical",
          "Theosis happens at baptism; exaltation happens in the temple"
        ],
        correctIndex: 1,
        explanation: "Christian theosis/glorification means being transformed into Christlike character while remaining a created being who worships God. LDS exaltation means literally becoming a separate god who creates and rules worlds — an ontological change, not merely a moral one."
      }
    ]
  },
  {
    day: 10,
    title: "Steelman: The Great Apostasy and Restoration Necessity",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(10),
    estimatedMinutes: 30,
    xpReward: getXPForDay(10),
    instructorVoice: `Today we steelman the LDS restoration narrative — the claim that a total apostasy occurred after the death of the apostles, necessitating Joseph Smith's restoration of the true church. This is the linchpin argument of the entire LDS system, because without a total apostasy, there is no need for a restoration.

The strongest form of the argument: The New Testament itself predicts apostasy. Paul warned that 'grievous wolves' would enter the flock (Acts 20:29-30). He predicted that many would depart from the faith (1 Timothy 4:1). He warned of a 'falling away' before the day of the Lord (2 Thessalonians 2:3). History confirms that within centuries of the apostles' deaths, Christianity adopted pagan practices — Sunday worship replaced the Sabbath, the immortality of the soul replaced biblical soul-sleep, pagan holidays were Christianized, and the bishop of Rome claimed authority never granted by Christ. If these corruptions are real (and Seventh-day Adventists agree they are), then is it not logical that God would need to restore truth through a new prophet?

This is where the argument becomes particularly challenging for Adventists, because we agree with much of the LDS diagnosis while disagreeing with the prescription. We agree that apostasy crept into Christianity. We agree that Sunday worship, the immortality of the soul, and papal authority are corruptions. But we distinguish between partial apostasy (corruption of truth within an institution) and total apostasy (complete loss of all truth from the earth). The Bible never teaches total apostasy — it always preserves a remnant.

Matthew 16:18 is decisive: 'The gates of hell shall not prevail against it.' If total apostasy occurred, Jesus' promise failed. Matthew 28:20 adds, 'I am with you alway, even unto the end of the world.' God never left His people without truth or witnesses — the Waldenses, Hussites, and other faithful groups preserved biblical truths throughout the darkest centuries of church history.`,
    avatarPresence: `The Mormon avatar presses the point strategically: 'You Adventists see it too — the Sabbath was changed, the state of the dead was corrupted, papal authority usurped Christ's. You agree with us on the diagnosis. We simply draw the logical conclusion: if so much was lost, a complete restoration was needed. Joseph Smith provided what you yourselves recognize was missing.'
The avatar knows exactly where the pressure point is between SDA and LDS theology.`,
    tacticalBriefing: `This is the most strategically complex steelman because the LDS argument exploits genuine overlap with SDA beliefs. You must acknowledge the common ground (yes, apostasy occurred; yes, doctrines were corrupted) while drawing a sharp line at the critical distinction: partial vs. total apostasy. Key arguments: (1) Matthew 16:18 — total apostasy means Jesus' promise failed, (2) God always preserved a remnant (Romans 11:4-5), (3) the Waldenses and other groups maintained Sabbath-keeping and other truths throughout the 'dark ages,' (4) the SDA position is a call back to existing biblical truth, not a restoration from nothing.`,
    drill: `Write a 200-word steelman of the Great Apostasy argument that specifically appeals to SDA beliefs about Sabbath-changing and Sunday worship. Make it as persuasive as possible. Then write a 300-word rebuttal that: (1) acknowledges the common ground, (2) draws the partial/total apostasy distinction, (3) uses Matthew 16:18 and Matthew 28:20, (4) cites the historical remnant (Waldenses, Sabbath-keepers through the centuries), and (5) explains why SDA theology is a recovery of obscured truth, not a restoration from complete loss.`,
    forgeAWeapon: `Forge a 'Remnant vs. Restoration' comparison tool — a clear, memorable distinction (under 150 words) between the SDA remnant concept (truth was obscured but preserved in Scripture and through faithful witnesses) and the LDS restoration concept (truth was completely lost and had to be re-given through a new prophet). Include Matthew 16:18 and Romans 11:4-5.`,
    jeevesDebrief: `This was perhaps the most important steelman exercise yet, soldier. The LDS restoration argument is uniquely dangerous to Adventists because it exploits our own beliefs about historical apostasy. Many Adventists have been caught off-guard by this line of reasoning. But the distinction is clear: we believe truth was obscured, not obliterated. The Sabbath was always in the Bible. The state of the dead was always in Ecclesiastes 9:5. The sanctuary truth was always in Hebrews. God preserved His Word and His witnesses — He did not abandon the earth for eighteen centuries and then give everything to one man in upstate New York.`,
    masteryCheck: [
      {
        question: "What is the critical difference between the SDA view of apostasy and the LDS view?",
        options: [
          "SDAs deny that any apostasy occurred; LDS affirm it",
          "SDAs teach partial apostasy (truth obscured but preserved); LDS teach total apostasy (all truth lost from the earth)",
          "SDAs teach apostasy happened only in Europe; LDS teach it was worldwide",
          "There is no difference — both teach the same thing"
        ],
        correctIndex: 1,
        explanation: "SDAs and LDS agree that apostasy occurred, but SDAs teach that truth was obscured within corrupted institutions while being preserved in Scripture and through faithful remnant groups. LDS teach total apostasy — the complete removal of all truth and authority from the earth — requiring a full restoration."
      },
      {
        question: "Why does Matthew 16:18 pose a problem for the LDS total apostasy doctrine?",
        options: [
          "It mentions Peter, who LDS do not recognize as an apostle",
          "Jesus promised the gates of hell would not prevail against His church — total apostasy means this promise failed",
          "It teaches that the church was built on a rock, which is a geological impossibility",
          "It predicts the LDS Church specifically"
        ],
        correctIndex: 1,
        explanation: "Jesus promised that 'the gates of hell shall not prevail against' His church. If a total apostasy removed all truth and authority from the earth for 1,800 years, then the gates of hell did prevail — and Jesus' promise failed. This is theologically impossible."
      },
      {
        question: "What historical evidence undermines the LDS claim of total apostasy?",
        options: [
          "The construction of large cathedrals during the medieval period",
          "The Waldenses, Hussites, and other groups maintained biblical truths like Sabbath-keeping throughout the centuries of apostasy",
          "The existence of the Dead Sea Scrolls",
          "The Roman Empire's adoption of Christianity"
        ],
        correctIndex: 1,
        explanation: "Groups like the Waldenses, Hussites, and Sabbath-keeping Christians in various regions maintained biblical truths throughout the centuries — demonstrating that truth was never completely lost from the earth, even during the darkest periods of institutional corruption."
      }
    ]
  },
];

// ── Week 2 continued (Days 11-14) ───────────────────────────────────────────

const week2b: WarCollegeDay[] = [
  {
    day: 11,
    title: "Steelman: Jesus and Lucifer as Spirit Brothers",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(11),
    estimatedMinutes: 30,
    xpReward: getXPForDay(11),
    instructorVoice: `Today we steelman the LDS doctrine that Jesus and Lucifer are spirit brothers — both offspring of Heavenly Father in the pre-mortal existence. This is often the most shocking LDS teaching to orthodox Christians, yet its strongest form has a certain internal logic that you must understand before you can dismantle it.

The steelman argument: All beings in the universe were created by God. Colossians 1:16 says 'all things were created by him' — including angelic beings. If God created both Jesus (in the LDS view, His firstborn spirit son) and Lucifer (another spirit son), then they share a common origin. They are 'brothers' in the sense that they both come from the same Father. This does not diminish Jesus — He is the elder, more faithful, more obedient brother who chose the right path. It simply places all creation within a family framework. Even in traditional Christianity, the concept of the 'Fatherhood of God' implies that all creatures are in some sense God's children.

The fatal flaw is that this argument depends on Jesus being a created being rather than the eternal Creator. John 1:1 does not say 'the Word was created by God' — it says 'the Word was God.' John 1:3 does not exempt Jesus from creation — it says 'All things were made by him; and without him was not any thing made that was made.' This includes Lucifer. Jesus did not have a beginning; He is 'from everlasting' (Micah 5:2). The Creator-creature distinction is the unbridgeable chasm that makes the 'spirit brother' doctrine impossible.

Hebrews 1 spends an entire chapter distinguishing Christ from all angels — asking, 'For unto which of the angels said he at any time, Thou art my Son?' (Hebrews 1:5). The answer is none. Jesus is ontologically different from every created being, including Lucifer.`,
    avatarPresence: `The Mormon avatar explains gently: 'We do not diminish Jesus by calling Him our elder brother. We exalt Him — He is the firstborn, the chosen one, the Savior. But all of us, including Lucifer, are children of the same Heavenly Father. It is a family, not a hierarchy of different species. God's family includes all of His spirit children.'
The avatar presents this as a warm, inclusive theology rather than a diminishment of Christ.`,
    tacticalBriefing: `The spirit-brother doctrine is emotionally appealing because it presents the universe as a family. Your counter must be theologically precise: (1) John 1:1-3 establishes that Jesus IS God (not a creation of God) and that He made ALL things (including Lucifer), (2) Hebrews 1 systematically distinguishes Christ from all created beings, (3) Micah 5:2 declares Christ's origins are 'from everlasting,' (4) Colossians 1:16 says Jesus created 'thrones, dominions, principalities, and powers' — angelic ranks that include Lucifer. A creator is not a 'brother' to his own creation.`,
    drill: `Write a 200-word steelman of the spirit-brother argument using Colossians 1:16 (all things created), the analogy of family, and the LDS emphasis on God as Father. Then write a 300-word rebuttal using: (1) John 1:1-3 — Jesus is God, not created, (2) Hebrews 1:5-8 — Christ is categorically different from angels, (3) Micah 5:2 — Christ's eternal origin, (4) Colossians 1:16 properly read — Jesus created ALL things, including Lucifer.`,
    forgeAWeapon: `Forge a 'Creator-Creature Distinction Blade' — a concise argument (under 100 words) that demonstrates why Jesus cannot be Lucifer's brother. Use the simple logic: Jesus created all things (John 1:3). Lucifer is a created thing (Ezekiel 28:15). Therefore, Jesus created Lucifer. A creator is not a brother to his creation.`,
    jeevesDebrief: `Brilliant work, soldier. The spirit-brother doctrine fails because it fundamentally misidentifies who Jesus is. He is not the firstborn 'spirit child' of Heavenly Father — He is the eternal, uncreated God who spoke all things into existence. When John writes 'without him was not any thing made that was made,' he leaves no room for Jesus to be among the things that were made. The Creator-creature distinction is absolute, and it is the foundation upon which the entire deity of Christ rests.`,
    masteryCheck: [
      {
        question: "Why can't Jesus be a 'spirit brother' of Lucifer according to John 1:3?",
        options: [
          "Because they were born at different times",
          "Because Jesus created ALL things, including Lucifer — a creator cannot be a brother to his own creation",
          "Because Lucifer was adopted, not born",
          "Because spirit brothers do not exist in any theology"
        ],
        correctIndex: 1,
        explanation: "John 1:3 states, 'All things were made by him; and without him was not any thing made that was made.' This means Jesus created Lucifer. A creator is categorically different from his creation — not a sibling."
      },
      {
        question: "What is the purpose of Hebrews chapter 1 in relation to the spirit-brother argument?",
        options: [
          "It teaches that angels are superior to Jesus",
          "It systematically distinguishes Christ from all angels, showing He is ontologically different",
          "It describes the pre-mortal council in heaven",
          "It endorses the LDS concept of spirit children"
        ],
        correctIndex: 1,
        explanation: "Hebrews 1 devotes an entire chapter to demonstrating that Jesus is categorically different from all angels — He is called God (v. 8), He created the heavens (v. 10), and no angel was ever called God's Son in the unique sense Christ is (v. 5)."
      }
    ]
  },
  {
    day: 12,
    title: "Steelman: A Living Prophet Receives Ongoing Revelation",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(12),
    estimatedMinutes: 30,
    xpReward: getXPForDay(12),
    instructorVoice: `Today we steelman the LDS claim that a living prophet receives ongoing revelation from God. This argument is particularly potent because it appeals to a principle that Seventh-day Adventists also affirm — the continuation of prophetic gifts in the church.

The steelman version: God has always led His people through prophets (Amos 3:7). The Bible never says the prophetic gift would cease. In fact, Joel 2:28-29 predicts an outpouring of prophecy in the last days: 'Your sons and your daughters shall prophesy.' Paul lists prophets among the gifts given to the church (1 Corinthians 12:28; Ephesians 4:11). Even Seventh-day Adventists believe in a modern prophetic gift through Ellen White. If Adventists can accept a 19th-century prophetic voice, why not the LDS prophet? The principle is the same — God speaks to His people through chosen vessels.

This steelman is powerful because it uses SDA theology as a bridge. Your response must be nuanced: (1) Yes, the Bible teaches ongoing prophetic gifts; (2) Yes, SDAs affirm this through Ellen White; (3) But there is a critical difference — Ellen White's writings are tested by and subordinate to Scripture, while LDS prophets claim authority equal to or above Scripture; (4) The biblical tests of a prophet (Deuteronomy 18:22, Isaiah 8:20, Deuteronomy 13:1-3) must be applied equally to all prophetic claimants; (5) When applied, Joseph Smith and LDS prophets fail these tests through false prophecies and doctrines that contradict Scripture.

The key distinction is between a prophetic gift that serves Scripture and a prophetic office that supersedes Scripture. Ellen White wrote: 'The Bible, and the Bible alone, is to be our creed.' LDS theology cannot make this claim because LDS prophets have introduced doctrines that contradict the Bible.`,
    avatarPresence: `The Mormon avatar presses the comparison: 'You accept Ellen White as a prophetess who received visions and dreams from God. We accept Joseph Smith as a prophet who received visions and revelations from God. What is the difference? Both claimed divine communication. Both produced volumes of inspired writing. Both led movements that claimed to restore biblical truth. Are you not being inconsistent?'
The avatar has identified the precise pressure point between SDA and LDS theology.`,
    tacticalBriefing: `This is the most strategically important steelman for SDA apologetics because it directly challenges our consistency. You must be prepared with a clear, principled distinction: (1) Ellen White consistently pointed to the Bible as the supreme authority; LDS prophets introduce doctrines not found in Scripture, (2) Ellen White's writings align with biblical teaching when tested; LDS prophetic teachings contradict Scripture on God's nature, salvation, and death, (3) Ellen White never claimed her writings were Scripture; LDS prophets' words are treated as binding revelation, (4) Ellen White's prophetic test record is consistent; Joseph Smith's includes clear failures.`,
    drill: `Write a 200-word steelman comparing Ellen White and Joseph Smith as prophetic figures, using the strongest possible LDS framing. Then write a 350-word rebuttal that provides at least five clear, principled distinctions between the SDA understanding of Ellen White's prophetic gift and the LDS understanding of their prophetic office. Use specific examples and at least three KJV Scripture references.`,
    forgeAWeapon: `Forge a 'Prophetic Gift vs. Prophetic Office' distinction chart — a side-by-side comparison (5 points) that clearly differentiates the SDA understanding of prophetic gifts (subordinate to Scripture, tested by Scripture, never introducing new doctrine) from the LDS prophetic office (equal to or above Scripture, introducing new doctrines, overriding previous revelation). Include Scripture references.`,
    jeevesDebrief: `This was perhaps the most critical exercise in the entire track, soldier. The Ellen White comparison is the sharpest weapon in the LDS arsenal against Adventists, and too many Adventists stumble when it is deployed. You must have the principled distinction memorized and ready: the prophetic gift serves Scripture; it does not supersede it. Ellen White said it herself: 'The Bible, and the Bible alone, is to be our creed.' Joseph Smith cannot make that claim because his teachings about God's nature, human exaltation, and the afterlife directly contradict the Bible he claims to supplement.`,
    masteryCheck: [
      {
        question: "What is the key principled distinction between the SDA view of Ellen White and the LDS view of their prophet?",
        options: [
          "Ellen White was female and LDS prophets are male",
          "Ellen White's gift is subordinate to and tested by Scripture; LDS prophets claim authority that can override Scripture",
          "Ellen White never had visions; LDS prophets have frequent visions",
          "There is no meaningful distinction"
        ],
        correctIndex: 1,
        explanation: "The critical distinction is authority relationship to Scripture. Ellen White consistently pointed to the Bible as the supreme authority and her writings are tested by Scripture. LDS prophets introduce doctrines (exaltation, polytheism, pre-existence) that contradict Scripture and claim binding authority."
      },
      {
        question: "What did Ellen White state about the relationship between her writings and the Bible?",
        options: [
          "Her writings were equal to or above the Bible",
          "Her writings replaced the need for the Bible",
          "'The Bible, and the Bible alone, is to be our creed'",
          "The Bible was unreliable and needed correction"
        ],
        correctIndex: 2,
        explanation: "Ellen White repeatedly affirmed biblical supremacy, stating 'The Bible, and the Bible alone, is to be our creed.' She understood her prophetic gift as pointing people back to Scripture, not replacing or superseding it."
      },
      {
        question: "Why is the LDS comparison between Ellen White and Joseph Smith ultimately invalid?",
        options: [
          "Because Ellen White lived in a different century",
          "Because Joseph Smith introduced doctrines that contradict Scripture (exaltation, polytheism, pre-existence), while Ellen White's teachings align with biblical testing",
          "Because Ellen White wrote more books",
          "Because Joseph Smith was not formally ordained"
        ],
        correctIndex: 1,
        explanation: "When the biblical prophetic tests are applied (Isaiah 8:20, Deuteronomy 18:22), Joseph Smith's teachings about God's nature, human exaltation, and the afterlife contradict the Bible. Ellen White's teachings, when tested by the same standards, align with Scripture."
      }
    ]
  },
  {
    day: 13,
    title: "Steelman: Temple Covenants and Eternal Families",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(13),
    estimatedMinutes: 30,
    xpReward: getXPForDay(13),
    instructorVoice: `Today we steelman what many Latter-day Saints consider the most beautiful and compelling aspect of their faith: the promise of eternal families sealed together through temple covenants. This doctrine resonates deeply because it addresses one of humanity's most fundamental longings — the desire that our relationships with loved ones will endure beyond death.

The steelman: God instituted marriage in Eden as an eternal institution. When He declared that the man should 'cleave unto his wife: and they shall be one flesh' (Genesis 2:24), there was no death and therefore no limitation on this union. Sin introduced death, but God's original design was eternal partnership. The LDS temple sealing ordinance restores what sin interrupted — binding husband and wife, parents and children, for eternity. Jesus gave His apostles the 'keys of the kingdom' and declared, 'Whatsoever thou shalt bind on earth shall be bound in heaven' (Matthew 16:19). Temple sealings exercise this very power. Furthermore, Malachi 4:5-6 prophesied that Elijah would come to 'turn the heart of the fathers to the children, and the heart of the children to their fathers' — LDS interpret this as the restoration of family sealings through temple work.

This is an emotionally powerful argument. Your response must be compassionate while being biblically precise. Jesus directly addressed this question in Matthew 22:29-30: 'Ye do err, not knowing the scriptures... in the resurrection they neither marry, nor are given in marriage, but are as the angels of God in heaven.' The binding and loosing of Matthew 16:19 refers to ecclesiastical authority (discipline and doctrine), not matrimonial eternity. And the biblical hope of the resurrection is not less than eternal families — it is infinitely more: a restored creation where every relationship is perfected in Christ.`,
    avatarPresence: `The Mormon avatar speaks from the heart: 'When I was sealed to my wife and children in the temple, it was the most sacred moment of my life. To know that death cannot separate us, that our family is bound together for all eternity — that is the greatest gift God offers. How can any Christian oppose the idea that families are forever?'
The avatar's voice trembles with genuine emotion — this is the most personal doctrine in LDS theology.`,
    tacticalBriefing: `Tread carefully here. The eternal families doctrine is not merely theological for Latter-day Saints — it is deeply personal and emotional. Many LDS members have buried loved ones with the comfort of temple sealings. Never mock or dismiss this. Instead: (1) Acknowledge the beauty of the longing for eternal relationships, (2) Gently present Matthew 22:29-30 — Jesus' own words about marriage in the resurrection, (3) Show that 'binding and loosing' in Matthew 16:19 is about church authority, not temple sealings, (4) Present the biblical hope as better, not lesser — a restored creation where all relationships are perfected beyond what we can imagine.`,
    drill: `Write the strongest 200-word emotional/theological argument for eternal families through temple sealings, using Genesis 2:24, Matthew 16:19, and Malachi 4:5-6. Then write a 300-word compassionate rebuttal that: (1) honors the longing for eternal relationships, (2) uses Jesus' own words in Matthew 22:29-30, (3) explains binding and loosing in proper context, (4) presents the biblical resurrection hope as surpassing the LDS concept — a new heaven and new earth where 'God shall wipe away all tears' (Revelation 21:4).`,
    forgeAWeapon: `Create a 'Better Hope' response — a compassionate argument (under 150 words) that does not merely tear down the eternal families concept but replaces it with the biblical hope of resurrection and a restored creation. Include Matthew 22:30, Revelation 21:4, and 1 Corinthians 2:9. The tone should be gentle and hopeful, not combative.`,
    jeevesDebrief: `Well done, soldier. Engaging the eternal families doctrine requires your highest level of compassion married to your sharpest biblical precision. Many Latter-day Saints will say, 'If your church does not offer eternal families, what do you offer?' Your answer must be compelling: we offer something better — resurrection into a restored creation where every relationship is perfected, where there is no more death or separation, and where the joy of being in God's presence surpasses anything we can imagine. The biblical hope is not less than eternal families — it is infinitely more.`,
    masteryCheck: [
      {
        question: "What did Jesus say about marriage in the resurrection in Matthew 22:29-30?",
        options: [
          "Only those married in the temple will remain married",
          "All marriages will be eternally binding",
          "In the resurrection they neither marry nor are given in marriage, but are as the angels of God",
          "Marriage will be optional in the resurrection"
        ],
        correctIndex: 2,
        explanation: "Jesus directly stated that in the resurrection, people 'neither marry, nor are given in marriage, but are as the angels of God in heaven.' This explicitly contradicts the LDS doctrine of celestial marriage and eternal family sealings."
      },
      {
        question: "What does 'binding and loosing' in Matthew 16:19 actually refer to?",
        options: [
          "Temple sealing ordinances that bind families for eternity",
          "Ecclesiastical authority — church discipline and doctrinal decisions",
          "The power to determine who enters heaven",
          "The ability to perform proxy baptisms for the dead"
        ],
        correctIndex: 1,
        explanation: "In Jewish rabbinic usage, 'binding and loosing' referred to declaring what was permitted or forbidden — ecclesiastical authority over doctrine and discipline. It has nothing to do with binding marriages for eternity through temple ceremonies."
      },
      {
        question: "How should you approach the eternal families doctrine in conversation with a Latter-day Saint?",
        options: [
          "Mock the concept and dismiss it as unbiblical",
          "Avoid the topic entirely because it is too emotional",
          "Honor the longing for eternal relationships while gently presenting Jesus' words and the biblical hope of resurrection as surpassingly better",
          "Agree with the doctrine to maintain peace"
        ],
        correctIndex: 2,
        explanation: "The eternal families doctrine is deeply personal. The most effective approach honors the genuine longing behind it while compassionately presenting Jesus' own words (Matthew 22:30) and the biblical hope of resurrection and a restored creation that surpasses the LDS concept."
      }
    ]
  },
  {
    day: 14,
    title: "Steelman: The Burning in the Bosom — Experiential Epistemology",
    warfareType: "cross-religious-apologists",
    difficulty: getDifficultyTier(14),
    estimatedMinutes: 30,
    xpReward: getXPForDay(14),
    instructorVoice: `Today we close Week 2 by steelmanning the most commonly deployed LDS evangelistic tool: the 'burning in the bosom' — the subjective spiritual experience that Latter-day Saints present as the ultimate confirmation of truth. This is grounded in Moroni 10:4-5 from the Book of Mormon and reinforced by D&C 9:8, which describes a 'burning in the bosom' as God's way of confirming truth.

The steelman: God communicates with His children through the Holy Spirit, and spiritual truth cannot be fully apprehended by the intellect alone. Jesus said, 'My sheep hear my voice' (John 10:27). Paul wrote that 'the natural man receiveth not the things of the Spirit of God' (1 Corinthians 2:14). When a person prays sincerely about the Book of Mormon, the Holy Spirit testifies of its truthfulness through a feeling of peace, warmth, and confirmation. This is not mere emotion — it is divine communication. Millions of Latter-day Saints have experienced this confirmation, and their collective testimony is powerful evidence of the Book of Mormon's truth.

The refutation must address epistemology — how we know truth. The Bible never tells us to pray about whether a book is Scripture. It tells us to test all things (1 Thessalonians 5:21), search the Scriptures (Acts 17:11), and measure claims against the law and testimony (Isaiah 8:20). The Bereans were commended for comparing teaching to Scripture, not for consulting their feelings. Jeremiah 17:9 warns, 'The heart is deceitful above all things, and desperately wicked: who can know it?' Feelings are unreliable epistemological tools — Muslims, Hindus, and members of every religion report equally powerful spiritual confirmations of their beliefs.`,
    avatarPresence: `The Mormon avatar speaks with quiet intensity: 'I have prayed about the Book of Mormon, and the Holy Ghost has testified to my heart that it is true. I know it with a certainty that goes beyond intellectual argument. You can study archaeology and debate theology all day, but until you sincerely pray and receive your own witness, you are relying on the arm of flesh rather than the Spirit of God.'
The avatar's eyes are closed, as if in communion with something beyond words.`,
    tacticalBriefing: `The burning-in-the-bosom epistemology is the last line of defense for many LDS arguments. When every doctrinal and historical argument has been addressed, the Latter-day Saint will often retreat to personal testimony: 'I know because I felt it.' You cannot argue against someone's experience — but you can challenge whether experience is a reliable test of truth. Key tools: (1) Jeremiah 17:9 — the heart is deceitful, (2) 1 Thessalonians 5:21 — test all things, (3) Acts 17:11 — the Berean model (Scripture-testing, not feeling-testing), (4) the cross-religious argument (Muslims, Hindus, etc. report identical experiences).`,
    drill: `Write a 200-word steelman of experiential epistemology using John 10:27, 1 Corinthians 2:14, and the personal testimony framework. Then write a 300-word rebuttal addressing: (1) Jeremiah 17:9 — the heart is deceitful, (2) Acts 17:11 — the Berean model, (3) 1 Thessalonians 5:21 — test all things, (4) the cross-religious parallel (Muslims praying about the Quran receive the same confirmation), (5) the Bible's actual epistemological method: testing claims against existing revelation (Isaiah 8:20), not against subjective feelings.`,
    forgeAWeapon: `Forge an 'Epistemology Upgrade' tool — a gentle but firm response (under 150 words) that redirects someone from feeling-based truth claims to Scripture-based truth testing. The tone should honor the sincerity of the person's experience while showing that the Bible provides a more reliable method for determining truth. Include at least three KJV references.`,
    jeevesDebrief: `Outstanding finish to Steelman Week, soldier. You have now engaged the seven strongest LDS arguments at their best and learned to dismantle them with precision, compassion, and biblical authority. The burning-in-the-bosom challenge is especially important because it is the one you will encounter most frequently in conversations with Latter-day Saints. When all else fails, they will appeal to personal experience. Your response must honor their sincerity while gently showing that the Bible provides a different — and more reliable — epistemological framework: 'To the law and to the testimony: if they speak not according to this word, it is because there is no light in them' (Isaiah 8:20). Next week, we enter the domain of mind game detection. Prepare yourself — the psychological dimension of this engagement is about to open up.`,
    masteryCheck: [
      {
        question: "What does Jeremiah 17:9 say about the reliability of feelings as a test of truth?",
        options: [
          "The heart is a reliable guide to spiritual truth",
          "The heart is deceitful above all things, and desperately wicked",
          "The heart can discern truth if properly trained",
          "The heart is neutral — neither reliable nor unreliable"
        ],
        correctIndex: 1,
        explanation: "Jeremiah 17:9 warns, 'The heart is deceitful above all things, and desperately wicked: who can know it?' This directly challenges the LDS epistemology of relying on subjective feelings ('burning in the bosom') as the test of truth."
      },
      {
        question: "How were the Bereans commended in Acts 17:11?",
        options: [
          "They prayed about Paul's teaching and felt a burning confirmation",
          "They searched the scriptures daily to verify whether Paul's teaching was true",
          "They accepted Paul's authority without question",
          "They rejected all new teaching on principle"
        ],
        correctIndex: 1,
        explanation: "The Bereans were called 'more noble' because they 'searched the scriptures daily, whether those things were so' (Acts 17:11). They tested Paul's teaching against existing Scripture — they did not pray for a subjective feeling of confirmation."
      },
      {
        question: "Why is the cross-religious argument effective against the burning-in-the-bosom epistemology?",
        options: [
          "It proves that all religions are equally true",
          "It shows that Muslims, Hindus, and members of every religion report identical spiritual confirmations of their beliefs — proving that feelings are not a reliable test of truth",
          "It demonstrates that only Christians have spiritual experiences",
          "It is not effective at all"
        ],
        correctIndex: 1,
        explanation: "If a Muslim prays about the Quran and receives the same 'burning' confirmation that a Mormon receives about the Book of Mormon, then the feeling itself cannot distinguish truth from falsehood. This demonstrates that subjective experience is not a reliable epistemological method."
      }
    ]
  },
];

export const mormonTrack: WarCollegeTrack = {
  avatarId: "mormon",
  avatarName: "The Mormon",
  emoji: "\u{1F3D4}\u{FE0F}",
  color: "text-yellow-400",
  warfareType: "cross-religious-apologists",
  description: "Train to engage Latter-day Saint theology with biblical precision, addressing the Book of Mormon, human exaltation, temple ordinances, prophetic authority, and the restoration narrative from a Seventh-day Adventist perspective.",
  days: [
    ...week1,
    ...week2,
    ...week2b,
  ],
};
