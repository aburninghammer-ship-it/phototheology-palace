// ─── AATS Training Data: The Jewish Scholar ────────────────────────────────

import type { AATSAvatarTraining } from "../aatsTrainingData";

// ── Subjects ───────────────────────────────────────────────────────────────

const subjects = [
  {
    id: "messianic-prophecy-denial",
    title: "Messianic Prophecy Denial",
    description:
      "Jesus didn't fulfill the messianic prophecies (no world peace, no temple rebuild)",
  },
  {
    id: "trinity-vs-shema",
    title: "Trinity vs Shema",
    description:
      "The Shema teaches absolute monotheism; Trinity violates this",
  },
  {
    id: "isaiah-53-reinterpretation",
    title: "Isaiah 53 Reinterpretation",
    description:
      "Isaiah 53 refers to the nation of Israel, not an individual Messiah",
  },
  {
    id: "oral-torah-authority",
    title: "Oral Torah Authority",
    description:
      "The Oral Torah (Talmud) is authoritative; Christian interpretations lack rabbinic context",
  },
  {
    id: "daniels-dating",
    title: "Daniel's Dating",
    description:
      "Daniel was written in the Maccabean period; its 'prophecies' are history written as prophecy",
  },
];

// ── Steelman Arguments ─────────────────────────────────────────────────────

const steelmanArguments = [
  {
    id: "steel-messianic-checklist",
    title: "The Unfulfilled Messianic Checklist",
    argument:
      "The Tanakh describes a Messiah who will rebuild the Third Temple (Ezekiel 37:26-28), gather all Jews to Israel (Isaiah 43:5-6), usher in an era of world peace (Isaiah 2:4), and bring universal knowledge of God (Jeremiah 31:33-34). Jesus accomplished none of these. Christianity reinterprets 'Messiah' to mean a spiritual savior who dies and returns later, but this is a post-hoc redefinition that no pre-Christian Jewish text supports. If a candidate fails the job description, the correct conclusion is that he was not the Messiah, not that the job description needs to be revised.",
    hiddenAssumptions: [
      "Assumes the Messiah's work must be accomplished in a single appearance with no progressive fulfillment",
      "Ignores the Tanakh's own portrait of a suffering servant who precedes the conquering king",
      "Treats later rabbinic compilations of messianic criteria as though they represent a uniform pre-Christian consensus",
      "Dismisses the possibility that some prophecies have dual or phased fulfillment as seen elsewhere in Scripture",
    ],
    sdaResponse:
      "The SDA position recognizes that the Tanakh itself presents two streams of messianic prophecy: a suffering servant (Isaiah 53, Psalm 22, Daniel 9:26) and a conquering king (Daniel 7:13-14, Zechariah 14). These are not contradictory but sequential. Jesus fulfilled the first-advent prophecies precisely, including Daniel 9's 70-week timeline pointing to AD 27-31. The unfulfilled 'checklist' items belong to the second advent, a concept already embedded in the prophetic structure of Daniel 2, 7, and 8. Even the Talmud (Sanhedrin 98a-b) records debate between a suffering and a triumphant Messiah, showing this tension existed within Judaism itself.",
  },
  {
    id: "steel-shema-monotheism",
    title: "The Shema's Absolute Oneness",
    argument:
      "Deuteronomy 6:4 declares 'Hear, O Israel: the LORD our God, the LORD is one (echad).' This is the foundational creed of Judaism and it teaches absolute, uncompounded divine unity. The Trinity doctrine, asserting three co-eternal Persons sharing one divine essence, was unknown to Moses, the prophets, or any pre-Christian Jewish thinker. It was borrowed from Greco-Roman philosophical categories and imposed onto the Hebrew Bible. Maimonides codified this as the second of his Thirteen Principles: God's unity is unlike any other unity, indivisible and simple.",
    hiddenAssumptions: [
      "Equates 'echad' with absolute mathematical singularity, ignoring its frequent biblical use for compound unity (Genesis 2:24, 'one flesh')",
      "Treats Maimonides' medieval formulation as representing all of ancient Jewish theology",
      "Assumes Trinitarian theology is exclusively derived from Greek philosophy rather than the Hebrew text itself",
      "Ignores plural divine references in the Tanakh (Genesis 1:26, Isaiah 48:16, the Angel of the LORD passages)",
    ],
    sdaResponse:
      "SDAs affirm absolute monotheism: there is one God. However, the Hebrew 'echad' in the Shema is the same word used for 'one flesh' in Genesis 2:24, indicating compound unity is linguistically possible. The Tanakh itself presents a complex divine identity: the Angel of the LORD is identified as God yet distinct from Him (Genesis 16:7-13; Exodus 3:2-6); Isaiah 48:16 has the speaker sent by 'the Lord GOD and His Spirit'; the 'Son' in Psalm 2:7-12 is worshipped alongside YHWH; and the 'one like a Son of Man' in Daniel 7:13-14 receives universal worship, something the Tanakh reserves exclusively for God. The Trinity is not a Greek imposition but the best explanation of the Tanakh's own data.",
  },
  {
    id: "steel-isaiah-53-israel",
    title: "Isaiah 53 as Corporate Israel",
    argument:
      "Isaiah 53 is part of the Servant Songs that begin in chapter 41, where the servant is explicitly named as Israel (Isaiah 41:8, 44:1, 49:3). The suffering described in chapter 53 fits the historical experience of the Jewish nation: despised by the nations, afflicted, bearing the consequences of Gentile sin and hatred. Rashi and most medieval Jewish commentators identified the servant as Israel. Christians ripped this chapter from its literary context and retrofitted it onto Jesus. The shift from a corporate to an individual reading was a Christian innovation, not the plain sense of the Hebrew text.",
    hiddenAssumptions: [
      "Ignores that Isaiah's servant oscillates between corporate Israel and an individual figure, with the individual narrowing in chapters 49-53",
      "Overlooks Isaiah 49:5-6, where the servant has a mission to Israel, making the servant distinct from Israel",
      "Selectively cites Rashi while ignoring earlier Jewish sources (Targum Jonathan, Talmud Sanhedrin 98b) that applied Isaiah 53 to an individual Messiah",
      "Fails to account for the specific details: sinlessness (v. 9), voluntary substitutionary death (v. 10-12), and burial with the rich (v. 9), which do not fit national Israel",
    ],
    sdaResponse:
      "While Isaiah does use 'servant' for the nation of Israel, the text itself makes a distinction. In Isaiah 49:5-6, the servant has a mission to restore Israel, making them separate entities. By chapter 53, the servant is sinless (v. 9), voluntarily bears the sins of others (v. 4-6), is silent before accusers (v. 7), and is 'cut off from the land of the living' (v. 8). National Israel cannot be sinless, nor can a nation die as a voluntary substitute for others. The Targum Jonathan (pre-Christian) and Talmud Sanhedrin 98b both apply this passage to an individual Messiah. Rashi's corporate reading was a later development, likely responding to Christian usage. The details of Isaiah 53 match Jesus' life, death, and burial with striking specificity.",
  },
  {
    id: "steel-oral-torah",
    title: "The Indispensable Oral Torah",
    argument:
      "The Written Torah cannot be understood without the Oral Torah. Deuteronomy 17:8-11 commands Israel to follow the rulings of the judges and priests, establishing a chain of authoritative interpretation. The Talmud preserves this oral tradition from Sinai. Without it, you cannot know how to properly observe Shabbat, perform sacrifices, or understand the scope of mitzvot. Christians who read the Hebrew Bible without rabbinic commentary are like medical students reading textbooks without professors: they reach dangerously wrong conclusions. Christian messianic interpretations fail precisely because they lack this authoritative interpretive framework.",
    hiddenAssumptions: [
      "Assumes the Oral Torah as codified in the Mishnah and Talmud is identical to what was given at Sinai, despite centuries of development and internal disagreement",
      "Conflates the legitimate role of judicial authority in Deuteronomy 17 with the specific content of later rabbinic tradition",
      "Ignores that the Written Torah frequently claims to be complete and sufficient (Deuteronomy 4:2, Proverbs 30:5-6)",
      "Overlooks the many internal contradictions within the Talmud itself, suggesting human development rather than direct divine transmission",
    ],
    sdaResponse:
      "SDAs respect the historical value of rabbinic literature while recognizing Scripture alone (sola Scriptura) as the final authority. The Talmud itself records extensive disagreements between sages (machloket), which is difficult to reconcile with a single authoritative oral tradition from Sinai. Deuteronomy 17:8-11 establishes a judicial function, not an infallible interpretive magisterium. The prophets repeatedly called Israel back to the Written Word (Isaiah 8:20, 'To the law and to the testimony'). Jesus Himself critiqued the oral tradition for contradicting Scripture (Mark 7:8-13). The Hebrew Bible is its own best interpreter, and its messianic prophecies can be understood by careful grammatical-historical study without requiring rabbinic gatekeeping.",
  },
  {
    id: "steel-daniel-late-dating",
    title: "Daniel as Maccabean Pseudepigraphy",
    argument:
      "Critical scholarship has established that Daniel was written circa 165 BC during the Maccabean revolt, not in the 6th century BC. The evidence includes: (1) Daniel's placement in the Ketuvim (Writings) rather than the Nevi'im (Prophets) in the Hebrew canon; (2) the presence of Greek loanwords; (3) the detailed 'predictions' of Antiochus IV Epiphanes that read like contemporary history; and (4) the absence of Daniel from Ben Sira's praise of famous men (c. 180 BC). If Daniel was written after the events it 'predicts,' then its prophecies including the 70 weeks, the four kingdoms, and the 2,300 days have no predictive value. The SDA sanctuary doctrine collapses because it rests on a forged document.",
    hiddenAssumptions: [
      "Assumes naturalistic presuppositions: predictive prophecy is impossible, so detailed predictions must be written after the fact",
      "Overstates the evidence for Greek loanwords (only three, all musical instrument names, easily explained by trade contact)",
      "Ignores the Dead Sea Scrolls evidence: multiple Daniel manuscripts at Qumran presuppose an earlier composition and canonical status",
      "Misrepresents Daniel's canonical placement: the Ketuvim category does not imply late authorship, as Psalms and Proverbs are also placed there",
    ],
    sdaResponse:
      "The late-dating of Daniel rests largely on a philosophical assumption that predictive prophecy cannot occur. When this assumption is set aside, the evidence supports an early date: (1) The Dead Sea Scrolls contain eight manuscripts of Daniel (including 4QDan-a and 4QDan-b), with the oldest dating to around 125 BC, implying the book was already well-established and copied extensively, which is incompatible with composition just 40 years earlier. (2) Ezekiel 14:14, 20 and 28:3 reference Daniel as a well-known figure, which is inexplicable if Daniel was a 2nd-century fiction. (3) The three Greek loanwords are musical instrument names, consistent with the international trade of the Neo-Babylonian period. (4) Josephus records that Alexander the Great was shown Daniel's prophecy about Greece (Antiquities 11.8.5), placing the book centuries before the Maccabean period. Daniel's 70-week prophecy (Daniel 9:24-27) points precisely to the time of Jesus, and the 2,300-day prophecy (Daniel 8:14) anchors the SDA understanding of the heavenly sanctuary ministry.",
  },
];

// ── Mind Games ─────────────────────────────────────────────────────────────

const mindGames = [
  {
    id: "mg-hebrew-gatekeeping",
    name: "Hebrew Language Gatekeeping",
    description:
      "Insisting that one cannot understand the Hebrew Bible without reading fluent Hebrew, thereby disqualifying any non-Hebrew-reading Christian from the conversation. This creates an artificial authority barrier where the Jewish interlocutor claims exclusive access to textual meaning.",
    example:
      "\"You're reading a translation of a translation. Unless you can parse the Hebrew verb forms in Isaiah 53, you really can't comment on what the text 'actually says.' The nuances are lost in English.\"",
    detectionTip:
      "While Hebrew knowledge is valuable, this tactic is used to shut down discussion, not to illuminate it. Note that many Jewish laypeople also read the Tanakh in translation, and the Septuagint (Greek translation) was used by Greek-speaking Jews centuries before Christ. Ask the interlocutor to specify which particular Hebrew word or construction changes the meaning, rather than accepting a blanket dismissal.",
  },
  {
    id: "mg-rabbinic-authority-pressure",
    name: "Rabbinic Authority Pressure",
    description:
      "Appealing to 2,000 years of rabbinic consensus as an unquestionable authority, implying that any individual who disagrees with the rabbis is either arrogant or ignorant. This leverages social proof and tradition weight to foreclose independent biblical study.",
    example:
      "\"Two thousand years of the greatest Jewish minds, from Hillel to Maimonides to the Vilna Gaon, have studied these texts and none of them found Jesus in the Tanakh. Are you saying you know better than all of them?\"",
    detectionTip:
      "This is an appeal to authority combined with social pressure. Counter by noting that the rabbis themselves frequently disagreed with each other (the entire Talmud is structured around debate). Also point out that some early Jewish sources did apply key passages (like Isaiah 53 and Daniel 9) to an individual Messiah. Truth is not determined by majority vote but by the text itself.",
  },
  {
    id: "mg-messianic-checklist-demand",
    name: "Messianic Prophecy Checklist Demand",
    description:
      "Presenting a modern compiled 'checklist' of messianic requirements as though it represents an ancient, universally agreed-upon standard. The checklist typically includes items the Messiah must accomplish in a single lifetime, thereby ruling out a two-advent fulfillment by definition.",
    example:
      "\"Here are the criteria the Messiah must fulfill: rebuild the Temple, gather all Jews, end war, and bring universal Torah knowledge. Jesus scored zero out of four. Fail.\"",
    detectionTip:
      "Ask where this exact checklist appears in the Tanakh as a unified list. It doesn't; it is compiled from various passages and interpreted through a specific rabbinic lens. Point out that many of the 'checklist' items come from passages about the messianic age (which SDAs associate with the second advent and the new earth), not from requirements for identifying the Messiah at his initial appearance. Daniel 9:26 explicitly says the Messiah will be 'cut off' before these things are completed.",
  },
  {
    id: "mg-historical-revisionism",
    name: "Historical Revisionism",
    description:
      "Rewriting the history of Jewish-Christian interpretation to claim that messianic readings of key passages were entirely Christian inventions, erasing the pre-Christian Jewish sources that supported individual messianic interpretations of texts like Isaiah 53, Psalm 22, and Daniel 7.",
    example:
      "\"No Jewish person ever read Isaiah 53 as being about a personal Messiah until Christians came along and twisted it. This is entirely a Christian reading imposed on a Jewish text.\"",
    detectionTip:
      "This is factually incorrect and can be countered with specific sources. The Targum Jonathan (Aramaic paraphrase, pre-Christian or early Christian era) explicitly identifies the servant of Isaiah 52:13 as the Messiah. Talmud Sanhedrin 98b discusses the Messiah in the context of suffering. The Dead Sea Scrolls contain messianic expectations that parallel Christian readings. Always have specific source citations ready to counter this tactic.",
  },
];

// ── Fallacies ──────────────────────────────────────────────────────────────

const fallacies = [
  {
    id: "fall-context-stripping",
    name: "Context Fallacy (Selective Contextual Framing)",
    definition:
      "Demanding that a passage be read 'in context' but then only providing the context that supports one's preferred reading while ignoring other contextual elements (literary, historical, canonical) that point elsewhere.",
    example:
      "\"Read Isaiah 53 in context! The servant is identified as Israel in chapter 41.\" This selectively uses one contextual marker (the earlier identification of Israel as servant) while ignoring another (Isaiah 49:5-6, where the servant is distinguished from Israel and has a mission to restore Israel).",
    counterMove:
      "Accept the invitation to read in context, then broaden the context beyond the single verse cited. Walk through the Servant Songs sequentially (Isaiah 42, 49, 50, 52-53), showing how the servant narrows from corporate Israel to an individual figure. The very context they invoke actually supports the Christian reading when read completely.",
  },
  {
    id: "fall-appeal-to-tradition",
    name: "Appeal to Tradition (Argumentum ad Antiquitatem)",
    definition:
      "Arguing that the rabbinic interpretation must be correct because it is older, more established, or held by the Jewish community that 'owns' the text. This treats tradition as an infallible interpretive authority rather than engaging with the textual evidence directly.",
    example:
      "\"Jews have been reading these texts for 3,000 years. We wrote them. We know what they mean. Your 2,000-year-old religion doesn't get to tell us how to read our own Scriptures.\"",
    counterMove:
      "Respectfully point out that age of a tradition does not guarantee accuracy (Jeremiah 8:8 warns that 'the lying pen of the scribes has made it into a lie'). The question is not who has held a text longest but what the text actually says. Engage the text directly and let the evidence speak. Note that early Christianity was a Jewish movement; the apostles were Torah-observant Jews who read the same Scriptures.",
  },
  {
    id: "fall-anachronism",
    name: "Anachronism (Reading Later Theology Back into Earlier Texts)",
    definition:
      "Importing medieval or modern Jewish theological categories into the interpretation of ancient biblical texts, treating later systematic formulations as though they were always the 'plain meaning' of the Hebrew Bible.",
    example:
      "\"Maimonides clearly defined God's absolute unity. The Tanakh teaches this same thing.\" This reads Maimonides' 12th-century philosophical monotheism (influenced by Islamic Aristotelian philosophy) back into texts written over a thousand years earlier that present a more complex picture of divine identity.",
    counterMove:
      "Identify the historical gap between the cited authority and the biblical text. Point out that Maimonides was influenced by Islamic Aristotelian philosophy (particularly Avicenna and al-Farabi), and his formulation of divine simplicity goes beyond what the biblical text itself states. Compare the Tanakh's own presentation of divine complexity (the Angel of the LORD, the 'us' language, the Son of Psalm 2) against the later medieval systematization.",
  },
  {
    id: "fall-selective-rabbinic-sources",
    name: "Selective Use of Rabbinic Sources",
    definition:
      "Cherry-picking rabbinic sources that support one's position while ignoring other rabbinic sources (sometimes from the same work) that contradict it. This creates a false impression of rabbinic unanimity.",
    example:
      "\"Rashi says Isaiah 53 is about Israel, and Rashi is the most authoritative commentator.\" This ignores that Rashi's contemporary, Rabbi Moshe ben Nachman (Nachmanides), and earlier sources like the Targum Jonathan applied the same passage to an individual Messiah. It also ignores that Rashi was explicitly responding to Christian arguments, making his interpretation partly polemical.",
    counterMove:
      "Demonstrate familiarity with the full range of rabbinic opinion. Cite the specific sources that contradict the cherry-picked selection: Targum Jonathan on Isaiah 52:13, Talmud Sanhedrin 98b, the Zohar on Isaiah 53, and the views of rabbis like Moshe Alshich who affirmed individual messianic readings. Show that the rabbinic tradition itself is diverse on these key texts.",
  },
];

// ── Counter Strategies ─────────────────────────────────────────────────────

const counterStrategies = [
  {
    subjectId: "messianic-prophecy-denial",
    title: "Two-Advent Messianic Fulfillment",
    sdaPosition:
      "The Tanakh presents two streams of messianic prophecy: a suffering servant who comes first (Isaiah 53, Daniel 9:26, Zechariah 12:10, Psalm 22) and a conquering king who comes second (Daniel 7:13-14, Zechariah 14, Isaiah 11). Jesus fulfilled the first-advent prophecies with precision, including the exact timing of Daniel's 70 weeks. The unfulfilled 'kingly' prophecies belong to the second advent, which is the hope of the SDA faith. The two-advent model is not a Christian invention but is embedded in the prophetic structure itself.",
    keyScriptures: [
      "Daniel 9:24-27 — The 70-week prophecy gives an exact timeline for the Messiah's appearance and death, pointing unmistakably to the time of Jesus.",
      "Isaiah 53:3-12 — The suffering servant is pierced, crushed, and bears the iniquity of many, then is exalted. This was fulfilled in Jesus' crucifixion and resurrection.",
      "Zechariah 12:10 — 'They will look on me, the one they have pierced, and they will mourn for him as one mourns for an only child.' God speaks of being pierced, requiring an embodied divine figure.",
      "Psalm 22:1, 16-18 — Written centuries before crucifixion was invented, this psalm describes pierced hands and feet, garments divided by lot, and the cry 'My God, my God, why have you forsaken me?'",
    ],
    counterArguments: [
      "The 'two-advent' model is not a post-hoc rescue. Daniel 9:26 explicitly says 'the Anointed One will be cut off and have nothing,' indicating the Messiah's death before the kingdom comes. This was always part of the prophetic plan.",
      "Even within Jewish tradition, the rabbis struggled with the two portraits of Messiah. Talmud Sukkah 52a introduces 'Messiah ben Joseph' (who suffers and dies) alongside 'Messiah ben David' (who reigns). This dual-Messiah concept reflects the same textual tension that the two-advent model resolves.",
      "The Daniel 9 timeline is mathematically precise: 69 weeks (483 years) from the decree to restore Jerusalem (457 BC) reaches AD 27, the exact year of Jesus' baptism. No other messianic candidate fits this prophetic window.",
      "Jesus Himself fulfilled over 300 specific prophecies in His first advent, including birth in Bethlehem (Micah 5:2), entry into Jerusalem on a donkey (Zechariah 9:9), betrayal for 30 pieces of silver (Zechariah 11:12-13), and silence before accusers (Isaiah 53:7).",
    ],
    closingStatement:
      "The messianic 'checklist' argument only works if you artificially restrict all prophecy to a single fulfillment event. The Tanakh itself does not do this. It presents a Messiah who suffers first and reigns later. Jesus fulfilled the first set perfectly and on time. We await His return for the second.",
  },
  {
    subjectId: "trinity-vs-shema",
    title: "Complex Monotheism in the Hebrew Bible",
    sdaPosition:
      "SDAs affirm the Shema's declaration that God is one. However, the Hebrew word 'echad' allows for compound unity, and the Tanakh itself presents a complex divine identity. The Angel of the LORD is identified as God yet is sent by God. The 'Son' in Psalm 2 receives worship. The Spirit of God acts as a distinct personal agent. The Trinity is not a violation of the Shema but the fullest expression of what the Shema's 'echad' encompasses, as revealed progressively through Scripture.",
    keyScriptures: [
      "Genesis 1:26 — 'Let Us make man in Our image.' The plural deliberation within God suggests a complex unity, not a singular monad.",
      "Isaiah 48:16 — 'And now the Lord GOD has sent me, and His Spirit.' The speaker (identified in context as the divine Redeemer) distinguishes Himself from the Lord GOD and the Spirit, yielding a threefold distinction within the Godhead.",
      "Daniel 7:13-14 — The 'one like a Son of Man' approaches the Ancient of Days and receives universal worship and an everlasting kingdom. Worship in the Tanakh belongs to God alone, yet this figure is distinct from the Ancient of Days.",
      "Psalm 110:1 — 'The LORD said to my Lord: Sit at My right hand.' David's Lord is distinct from YHWH yet shares His throne, a divine prerogative.",
    ],
    counterArguments: [
      "'Echad' in the Shema is the same word used in Genesis 2:24 ('the two shall become one [echad] flesh'), demonstrating that Hebrew 'oneness' can encompass plurality within unity. If 'echad' meant absolute mathematical singularity, the Hebrew language had the word 'yachid' (solitary one) available, but it is never used of God in the Shema.",
      "The Angel of the LORD (Malak YHWH) is called 'God' by the narrator and the characters in Genesis 16:7-13, 18:1-33, and Exodus 3:2-6, yet is also 'sent' by God. This creates a distinction within the Godhead that the Tanakh never resolves into simple Unitarianism.",
      "Maimonides' doctrine of absolute divine simplicity was influenced by Islamic Aristotelianism (Avicenna, al-Farabi), not derived from the biblical text alone. Earlier Jewish mystical traditions (Sefirot, the Memra of the Targumim) preserved a more complex understanding of God's inner life.",
      "The early Jewish-Christian movement did not borrow the Trinity from paganism. The apostles were Torah-observant Jews who arrived at Trinitarian theology through their reading of the Tanakh and their encounter with Jesus. The doctrine arose from within Judaism, not from outside it.",
    ],
    closingStatement:
      "The Shema says God is one. Christians agree. The question is what kind of 'one.' The Tanakh presents a God who deliberates in the plural, who sends Himself, whose Angel bears His name and nature, and whose Son sits at His right hand. The Trinity does not break the Shema; it explains it.",
  },
  {
    subjectId: "isaiah-53-reinterpretation",
    title: "The Individual Suffering Servant of Isaiah 53",
    sdaPosition:
      "While Isaiah uses 'servant' for Israel in earlier chapters, the text itself progressively narrows the servant's identity from the nation (ch. 41-44) to a faithful remnant (ch. 49) to a single individual (ch. 50, 52-53). By chapter 53, the servant is sinless, suffers voluntarily for others' sins, dies, and is exalted. These details cannot apply to the nation of Israel. Multiple pre-Christian and early Jewish sources identified this servant as the Messiah. Isaiah 53 is the clearest Old Testament portrait of Jesus' atoning death.",
    keyScriptures: [
      "Isaiah 49:5-6 — The servant has a mission 'to bring Jacob back to Him' and to be 'a light to the Gentiles.' The servant is distinguished from Israel and has a mission to Israel.",
      "Isaiah 53:4-6 — 'He was pierced for our transgressions, crushed for our iniquities; the punishment that brought us peace was on him.' The language of penal substitution is unmistakable.",
      "Isaiah 53:9 — 'He had done no violence, nor was any deceit in his mouth.' Sinlessness cannot apply to the nation of Israel, which the prophets consistently rebuke for sin.",
      "Isaiah 53:10-12 — The servant's death is a 'guilt offering' (asham), a technical sacrificial term. After his death, he 'sees his offspring' and 'prolongs his days,' implying resurrection.",
    ],
    counterArguments: [
      "The corporate Israel interpretation collapses on Isaiah 49:5-6, where the servant is explicitly distinguished from Israel and given a mission to restore Israel. The servant cannot be the very entity he is sent to restore.",
      "Isaiah 53:9 describes the servant as sinless ('no violence, no deceit'). The entire prophetic corpus rebukes Israel for its sins. A sinless Israel is a contradiction of the Tanakh's own testimony (Isaiah 1:2-4, Jeremiah 2:13, Ezekiel 16).",
      "The Targum Jonathan (Aramaic paraphrase) on Isaiah 52:13 opens with 'Behold, my servant, the Messiah, shall prosper.' This is a pre-medieval Jewish source that identifies the servant as an individual Messiah, disproving the claim that this reading is a Christian invention.",
      "The sacrificial language of Isaiah 53:10 (asham, guilt offering) is priestly terminology for an individual substitutionary sacrifice. Nations do not function as guilt offerings; individuals do. This language points to a single atoning figure.",
    ],
    closingStatement:
      "Isaiah 53 describes a sinless individual who voluntarily bears the sins of others, dies as a guilt offering, and is raised to life. Israel fits none of these criteria. The earliest Jewish sources agreed. The servant is the Messiah, and the Messiah is Jesus.",
  },
  {
    subjectId: "oral-torah-authority",
    title: "Scripture Alone as the Final Authority",
    sdaPosition:
      "SDAs respect rabbinic scholarship as historically and culturally valuable but affirm sola Scriptura: the Written Word is the final, sufficient authority for faith and practice. The Oral Torah tradition, as codified in the Mishnah and Talmud, contains human interpretation that sometimes contradicts Scripture. Deuteronomy 17 establishes a judicial function, not an infallible interpretive magisterium. The prophets consistently called Israel back to the Written Word (Isaiah 8:20), and Jesus critiqued oral traditions that nullified God's commands (Mark 7:8-13).",
    keyScriptures: [
      "Isaiah 8:20 — 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them.' The written Torah is the standard by which all teaching is measured.",
      "Deuteronomy 4:2 — 'Do not add to what I command you and do not subtract from it.' This places a boundary on tradition that claims equal authority with Scripture.",
      "Proverbs 30:5-6 — 'Every word of God is flawless. Do not add to his words, or he will rebuke you.' Scripture claims sufficiency for itself.",
      "Jeremiah 8:8 — 'How can you say, \"We are wise, for we have the law of the LORD,\" when actually the lying pen of the scribes has handled it falsely?' The prophets warned about scribal mishandling of the Word.",
    ],
    counterArguments: [
      "The Talmud records extensive disagreements between sages (machloket) on virtually every topic. If the Oral Torah were a unified divine tradition from Sinai, such fundamental disagreements would be inexplicable. The very structure of the Talmud reveals it to be a human interpretive tradition, not a monolithic divine revelation.",
      "Deuteronomy 17:8-11 establishes a judicial function for specific legal cases ('matters of controversy within your gates'), not a blanket hermeneutical authority over all Scripture interpretation. Extending it to mean 'the rabbis have final say on all textual meaning' goes far beyond the text's scope.",
      "Jesus was a Torah-observant Jew who critiqued the Oral Torah tradition not from outside Judaism but from within it. His critique in Mark 7:8-13 (corban vows nullifying the commandment to honor parents) demonstrates exactly what the SDA position affirms: when tradition contradicts Scripture, Scripture must prevail.",
      "Many key rabbinic interpretive methods (gematria, notarikon, allegorical exegesis) are human hermeneutical tools, not divinely revealed methods. They can yield contradictory results, which is why the rabbis themselves often disagreed. The plain sense of Scripture (peshat) remains the most reliable guide.",
    ],
    closingStatement:
      "Rabbinic literature is a treasure of historical insight, but it is not infallible. The Written Word is its own best interpreter. When tradition aligns with Scripture, we welcome it. When it contradicts Scripture, we stand with the prophets: 'To the law and to the testimony.'",
  },
  {
    subjectId: "daniels-dating",
    title: "The Early Date and Prophetic Authority of Daniel",
    sdaPosition:
      "The book of Daniel was written in the 6th century BC by the historical prophet Daniel. The late-dating hypothesis rests primarily on the philosophical presupposition that predictive prophecy is impossible. When this assumption is removed, the evidence overwhelmingly supports an early date: the Dead Sea Scrolls evidence, Ezekiel's references to Daniel, the absence of clear Maccabean-era theology, and the precise prophetic timelines that extend far beyond the Maccabean period all point to authentic 6th-century composition. Daniel's prophecies are the backbone of SDA prophetic understanding.",
    keyScriptures: [
      "Daniel 9:24-27 — The 70-week prophecy extends to the coming and death of the Messiah, centuries beyond the Maccabean period. A Maccabean author would have no reason to construct a timeline pointing to the 1st century AD.",
      "Daniel 8:14 — The 2,300-day prophecy extends to 1844, far beyond any Maccabean concern. This timeline anchors the SDA understanding of the heavenly sanctuary and the investigative judgment.",
      "Ezekiel 14:14, 20 — Ezekiel, writing in the 6th century BC, references Daniel alongside Noah and Job as a well-known righteous figure. This is inexplicable if Daniel is a 2nd-century fiction.",
      "Daniel 2:44-45 — The prophecy of the stone that destroys all earthly kingdoms and fills the earth describes the eternal kingdom of God, not the temporary Maccabean victory. The scope is cosmic, not local.",
    ],
    counterArguments: [
      "The Dead Sea Scrolls contain eight manuscripts of Daniel (4QDan-a through 4QDan-e, etc.), with the oldest dating to approximately 125 BC. For a text to be copied this extensively and treated as authoritative Scripture at Qumran, it must have been composed significantly earlier than 165 BC. Scholars who accept the late date must explain how a brand-new composition was already widely circulated and canonically authoritative within a single generation.",
      "The three Greek loanwords in Daniel (names of musical instruments: qithros, psanterin, sumponeyah) are consistent with Neo-Babylonian period international trade contact with the Greek world, well attested in archaeological evidence. Persian loanwords in Daniel are far more numerous, matching a 6th-century composition in a Persian-influenced court.",
      "Daniel's prophecies extend far beyond the Maccabean period: the 70-week prophecy reaches to the 1st century AD, the four-kingdom sequence extends to Rome (not Greece), and the 2,300-day prophecy reaches to 1844. A Maccabean pseudepigrapher would have no motivation to construct timelines pointing centuries into his own future.",
      "Josephus (Antiquities 11.8.5) records that Alexander the Great was shown the prophecy of Daniel concerning Greece when he entered Jerusalem in 332 BC, over 160 years before the supposed Maccabean composition date. While Josephus' historicity is debated, this tradition is difficult to explain if Daniel did not exist before the Maccabean period.",
    ],
    closingStatement:
      "The late-dating of Daniel is not a conclusion of neutral scholarship but of naturalistic philosophy that rules out predictive prophecy in advance. The textual, archaeological, and manuscript evidence supports a 6th-century date. Daniel's prophecies, especially the 70 weeks and the 2,300 days, provide the precise chronological backbone for understanding Jesus as the Messiah and the ongoing heavenly sanctuary ministry.",
  },
];

// ── Modules (8-step training) ──────────────────────────────────────────────

const modules = [
  // ── Module 1: Messianic Prophecy Denial ──────────────────────────────────
  {
    id: "mod-jewish-messianic-prophecy",
    subjectId: "messianic-prophecy-denial",
    title: "Messianic Prophecy Denial — Full Training Module",
    doctrineBrief:
      "The Jewish objection that Jesus failed to fulfill messianic prophecy rests on a curated checklist of kingly expectations (world peace, temple rebuilding, ingathering of exiles) while ignoring the Tanakh's equally prominent portrait of a suffering, dying Messiah. The two-advent model embedded in Daniel, Isaiah, and Zechariah resolves the apparent contradiction. Jesus fulfilled the first-advent prophecies on Daniel's precise timetable; the remaining prophecies await His return.",
    steelmanArguments: [
      {
        id: "mod1-steel-1",
        title: "Zero-for-Four Failure",
        argument:
          "The Messiah must rebuild the Temple, gather Israel, end war, and bring universal knowledge of God. Jesus did none of these. Score: 0/4. He does not qualify.",
        hiddenAssumptions: [
          "Assumes all messianic prophecies must be fulfilled in a single visit",
          "Ignores passages about a suffering and dying Messiah entirely",
        ],
        sdaResponse:
          "Daniel 9:26 explicitly states the Messiah will be 'cut off' before the Temple is destroyed, meaning His death was prophesied before the kingly reign. The two-advent model is in the text itself.",
      },
      {
        id: "mod1-steel-2",
        title: "Post-Hoc Invention of the Second Coming",
        argument:
          "The 'second coming' concept was invented by Christians to explain Jesus' failure. No pre-Christian Jewish text describes a Messiah who comes twice.",
        hiddenAssumptions: [
          "Ignores Daniel's temporal structure that places the Messiah's death before the establishment of the eternal kingdom",
          "Overlooks the Talmudic concept of two Messiahs (ben Joseph and ben David) which reflects the same textual tension",
        ],
        sdaResponse:
          "The Talmud (Sukkah 52a) itself records the concept of Messiah ben Joseph who suffers and dies, and Messiah ben David who reigns. The rabbis saw the two portraits but split them into two persons rather than two advents. The textual tension is undeniable.",
      },
    ],
    hiddenAssumptions: [
      "The messianic 'checklist' is treated as ancient and universal, but it is a modern compilation filtered through specific rabbinic theology",
      "Predictive timelines like Daniel 9 are ignored because they point inconveniently to Jesus' era",
      "The concept of progressive or phased fulfillment is dismissed without argument, despite being a common prophetic pattern in the Tanakh",
    ],
    mindGames: [
      {
        id: "mod1-mg-1",
        name: "The Moving Goalpost",
        description:
          "When presented with fulfilled prophecies, the interlocutor shifts to unfulfilled ones. When the two-advent model is explained, they demand proof of a second coming from the Tanakh alone, excluding any NT evidence.",
        example:
          "\"Okay, maybe Daniel 9 points to that time period, but show me where in the Tanakh it says the Messiah comes twice. Chapter and verse.\"",
        detectionTip:
          "The goalpost shifts from 'Jesus didn't fulfill prophecy' to 'prove the second coming from the OT alone.' Hold them to the original claim and show that Daniel 9:26 and Zechariah 12:10 both describe events after the Messiah's death.",
      },
      {
        id: "mod1-mg-2",
        name: "Emotional Appeal to Jewish Suffering",
        description:
          "Invoking the Holocaust and centuries of Christian persecution of Jews to delegitimize Christian messianic claims. This makes theological critique feel morally wrong.",
        example:
          "\"How can you tell us your Messiah brought peace when your religion has persecuted us for 2,000 years?\"",
        detectionTip:
          "Acknowledge the genuine historical injustice without accepting the theological conclusion. Christian persecution of Jews was a terrible sin that contradicts Jesus' own teaching. But the truth of prophecy is determined by the text, not by the behavior of those who misuse it.",
      },
    ],
    fallacies: [
      {
        id: "mod1-fall-1",
        name: "Stacking the Deck",
        definition:
          "Presenting only the unfulfilled kingly prophecies while suppressing the fulfilled suffering-servant prophecies, creating an artificially one-sided case.",
        example:
          "\"Here are the messianic prophecies: world peace, temple rebuild, ingathering. Jesus failed all of them.\" (Omits Isaiah 53, Psalm 22, Daniel 9:26, Zechariah 12:10.)",
        counterMove:
          "Introduce the suppressed evidence. Present the full prophetic picture, including the suffering-servant passages the interlocutor has omitted. Ask why these passages are excluded from the 'checklist.'",
      },
      {
        id: "mod1-fall-2",
        name: "False Dilemma",
        definition:
          "Presenting only two options: either the Messiah fulfills everything in one visit or he is not the Messiah. This excludes the possibility of phased fulfillment.",
        example:
          "\"Either he does it all or he's not the one. There's no 'coming back later' option.\"",
        counterMove:
          "Show that the Tanakh itself presents a Messiah who dies (Daniel 9:26, Isaiah 53) before the kingdom is established (Daniel 7:13-14). The text demands a gap between these events. The false dilemma ignores what the text actually says.",
      },
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "jewish",
    debriefPrompt:
      "Reflect on this module. Can you now articulate both the Jewish objection (messianic prophecy checklist) and the SDA response (two-advent fulfillment with Daniel 9 timeline) from memory? What evidence would you present first in a live conversation?",
  },

  // ── Module 2: Trinity vs Shema ──────────────────────────────────────────
  {
    id: "mod-jewish-trinity-shema",
    subjectId: "trinity-vs-shema",
    title: "Trinity vs Shema — Full Training Module",
    doctrineBrief:
      "The Shema (Deuteronomy 6:4) is the cornerstone of Jewish monotheism, and SDAs fully affirm it. The debate is not over whether God is one but over what kind of 'one' the Tanakh reveals. The Hebrew word 'echad' allows for compound unity, and the Tanakh presents multiple lines of evidence for a complex divine identity: plural self-references, the Angel of the LORD who is God yet distinct from God, the divine Son in Psalm 2 and Daniel 7, and the Spirit as a distinct personal agent. The Trinity is the Tanakh's own data systematized, not a Greek philosophical import.",
    steelmanArguments: [
      {
        id: "mod2-steel-1",
        title: "The Shema Is Unambiguous",
        argument:
          "Deuteronomy 6:4 is the most fundamental statement of Jewish belief: God is one, period. Three Persons sharing one essence is not oneness; it is tritheism dressed up in philosophical language.",
        hiddenAssumptions: [
          "Assumes 'echad' can only mean absolute numerical singularity",
          "Ignores the broader Tanakh evidence for plurality within God",
        ],
        sdaResponse:
          "The Shema uses 'echad,' the same word used for 'one flesh' in Genesis 2:24. If Moses intended absolute mathematical singularity, 'yachid' (solitary one) was available. The Shema affirms one God; it does not define the internal nature of that oneness.",
      },
      {
        id: "mod2-steel-2",
        title: "Trinity Is Greek Philosophy, Not Hebrew Theology",
        argument:
          "The Trinity doctrine was formulated at Nicaea (325 AD) and Constantinople (381 AD) using Greek philosophical terms like 'ousia' and 'hypostasis.' This proves it is a product of Hellenistic culture, not biblical revelation.",
        hiddenAssumptions: [
          "Confuses the language used to articulate a doctrine with its origin",
          "Ignores that the biblical data the councils were systematizing came from the Hebrew Bible and Jewish apostolic teaching",
        ],
        sdaResponse:
          "The councils used Greek terminology to describe what the biblical text already revealed. The data preceded the formulation. Isaiah 48:16, Daniel 7:13-14, and the Angel of the LORD passages present a complex divine identity centuries before any council met. Similarly, Maimonides' doctrine of divine simplicity uses Arabic Aristotelian categories, but no one claims his theology is therefore 'Islamic.'",
      },
    ],
    hiddenAssumptions: [
      "Maimonides' formulation of divine unity is treated as the original and only Jewish understanding, despite being a medieval development",
      "The Tanakh's plural divine language is systematically explained away rather than taken at face value",
      "The Trinitarian reading is dismissed as 'Christian' without engaging with the pre-Christian Jewish texts that point in the same direction",
    ],
    mindGames: [
      {
        id: "mod2-mg-1",
        name: "The 'Polytheism' Label",
        description:
          "Immediately labeling the Trinity as 'polytheism' or 'three gods' to trigger a defensive reaction and frame the Christian as violating the most basic principle of biblical faith.",
        example:
          "\"So you worship three gods? That's not monotheism; that's just paganism with extra steps.\"",
        detectionTip:
          "This is a straw man. No Trinitarian claims to worship three gods. Calmly restate: 'We worship one God who exists in three Persons. This is monotheism, not tritheism.' Then redirect to the textual evidence.",
      },
      {
        id: "mod2-mg-2",
        name: "Authority Stacking",
        description:
          "Listing a chain of Jewish authorities (Moses, the prophets, Maimonides, the Vilna Gaon) as all affirming absolute Unitarian monotheism, creating an overwhelming wall of authority.",
        example:
          "\"Moses taught it. Isaiah taught it. Maimonides codified it. Every great Jewish mind for 3,000 years affirmed God's absolute oneness. And you think you know better?\"",
        detectionTip:
          "Point out that Moses wrote Genesis 1:26 ('Let Us make man in Our image'), Isaiah wrote 48:16 (threefold divine distinction), and the prophets presented the Angel of the LORD as God. The authorities being invoked actually support the Trinitarian reading when their own texts are examined.",
      },
    ],
    fallacies: [
      {
        id: "mod2-fall-1",
        name: "Equivocation on 'One'",
        definition:
          "Using 'one' to mean 'absolute numerical singularity' in the Shema while the Hebrew text uses 'echad,' which carries a broader semantic range including compound unity.",
        example:
          "\"One means one. It's simple math. You can't make one into three.\"",
        counterMove:
          "Introduce the lexical data. 'Echad' in Genesis 2:24 means 'one flesh' (two persons, one unity). In Ezekiel 37:17, two sticks become 'one' (echad). The word's semantic range allows for compound unity. This is not math; it is Hebrew.",
      },
      {
        id: "mod2-fall-2",
        name: "Genetic Fallacy",
        definition:
          "Rejecting the Trinity because of its association with Greek conciliar formulations, rather than evaluating the biblical evidence on its own merits.",
        example:
          "\"The Trinity was invented at Nicaea. It's a Greek doctrine, not a biblical one.\"",
        counterMove:
          "The origin of a doctrinal formulation does not determine its truth. The question is whether the biblical data supports the doctrine. Present the Tanakh evidence (Genesis 1:26, Isaiah 48:16, Daniel 7:13-14, Angel of the LORD) and let the text speak, regardless of when and where the systematic formulation was articulated.",
      },
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "jewish",
    debriefPrompt:
      "Can you explain the difference between 'echad' and 'yachid,' and why this matters for the Shema debate? Can you cite three Tanakh passages that present a complex divine identity? Practice articulating this concisely.",
  },

  // ── Module 3: Isaiah 53 Reinterpretation ────────────────────────────────
  {
    id: "mod-jewish-isaiah-53",
    subjectId: "isaiah-53-reinterpretation",
    title: "Isaiah 53 Reinterpretation — Full Training Module",
    doctrineBrief:
      "Isaiah 53 is the most contested chapter in Jewish-Christian dialogue. The Jewish position that the 'suffering servant' is corporate Israel became dominant in the medieval period, largely in response to Christian arguments. However, the text itself progressively narrows the servant from Israel (ch. 41-44) to an individual (ch. 49-53) who has a mission to Israel, is sinless, dies as a substitutionary guilt offering, and is exalted after death. Pre-Christian and early Jewish sources confirm the individual messianic reading. SDAs see Isaiah 53 as the clearest Old Testament prophecy of Jesus' atoning sacrifice.",
    steelmanArguments: [
      {
        id: "mod3-steel-1",
        title: "The Servant Is Named as Israel",
        argument:
          "Isaiah 41:8 says 'But you, Israel, are my servant.' Isaiah 44:1 says 'Now listen, Jacob my servant, Israel whom I have chosen.' The servant is identified. Case closed.",
        hiddenAssumptions: [
          "Assumes the servant identity is static throughout Isaiah and never narrows to an individual",
          "Ignores Isaiah 49:5-6 where the servant is distinguished from Israel",
        ],
        sdaResponse:
          "Isaiah uses 'servant' for Israel in the early chapters, but by chapter 49, the servant is given a mission to restore Israel (49:5-6). The servant cannot be Israel if his mission is to Israel. The identity narrows progressively, reaching its climax in the individual figure of chapter 53.",
      },
      {
        id: "mod3-steel-2",
        title: "Rashi and the Rabbinic Consensus",
        argument:
          "Rashi, the most authoritative Jewish commentator, identified the servant of Isaiah 53 as Israel. This has been the dominant Jewish interpretation for nearly a millennium.",
        hiddenAssumptions: [
          "Treats Rashi's 11th-century interpretation as the original and only reading",
          "Ignores pre-Rashi Jewish sources that identify the servant as an individual Messiah",
        ],
        sdaResponse:
          "Rashi (11th century) was explicitly responding to Christian arguments, making his interpretation partly polemical. Before Rashi, the Targum Jonathan identifies the servant of Isaiah 52:13 as the Messiah. Talmud Sanhedrin 98b applies suffering to the Messiah. Rabbi Moshe Alshich (16th century) wrote: 'Our rabbis with one voice accept and affirm that the prophet is speaking of King Messiah.' Rashi's is one voice among many, and it is the later one.",
      },
    ],
    hiddenAssumptions: [
      "The corporate reading of Isaiah 53 is presented as ancient and universal when it is actually a medieval development",
      "The specific details of Isaiah 53 (sinlessness, substitutionary death, guilt offering, burial with the rich) are glossed over rather than exegeted",
      "The progressive narrowing of the servant figure across Isaiah 41-53 is ignored in favor of a flat reading that equates all 'servant' references",
    ],
    mindGames: [
      {
        id: "mod3-mg-1",
        name: "The 'Christian Prooftext' Dismissal",
        description:
          "Dismissing Isaiah 53 as a 'classic Christian prooftext' that has been debunked, framing any appeal to it as naive and uninformed.",
        example:
          "\"Oh, Isaiah 53. That's the first thing every missionary brings up, and it's the first thing every rabbi debunks. This has been dealt with centuries ago.\"",
        detectionTip:
          "This is a thought-terminating cliche designed to prevent engagement with the text. Respond by inviting a detailed textual discussion: 'Let's go through the chapter verse by verse and examine the evidence together, rather than relying on general dismissals.'",
      },
      {
        id: "mod3-mg-2",
        name: "Hebrew Nuance Overload",
        description:
          "Citing multiple Hebrew grammatical points in rapid succession to overwhelm the interlocutor and create the impression that the Christian reading fails on linguistic grounds.",
        example:
          "\"The verb in verse 5 is a Pual form, the pronouns shift from singular to plural, and the 'lamo' in verse 8 is a plural suffix, so this can't be about one person.\"",
        detectionTip:
          "Slow down and address each point individually. The 'lamo' suffix, for instance, is used for singular referents elsewhere in Scripture (Isaiah 44:15, Job 22:2, 27:23). Do not be intimidated by rapid-fire technical claims; verify each one independently.",
      },
    ],
    fallacies: [
      {
        id: "mod3-fall-1",
        name: "Part-to-Whole Fallacy",
        definition:
          "Because the servant is identified as Israel in chapters 41-44, assuming the servant must be Israel in every subsequent chapter, ignoring the progressive narrowing of the servant's identity.",
        example:
          "\"The servant is Israel. Isaiah said so in chapter 41. Therefore the servant in chapter 53 is also Israel.\"",
        counterMove:
          "Trace the servant's identity across all the Servant Songs. In chapters 41-44, the servant is Israel. In chapter 49:5-6, the servant is distinguished from Israel. In chapters 50 and 52-53, the servant is a sinless individual who atones for Israel's sins. The identity narrows progressively.",
      },
      {
        id: "mod3-fall-2",
        name: "Appeal to Authority (Rashi)",
        definition:
          "Treating Rashi's interpretation as conclusive simply because of his stature as a commentator, rather than evaluating the textual evidence independently.",
        example:
          "\"Rashi settled this question 900 years ago. He's the greatest Jewish commentator ever.\"",
        counterMove:
          "Respect Rashi's brilliance while noting that many other Jewish authorities disagreed: the Targum Jonathan, the Talmud, the Zohar, and later rabbis like Moshe Alshich. Rashi's interpretation was one perspective within a diverse tradition. The text must be evaluated on its own terms.",
      },
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "jewish",
    debriefPrompt:
      "Can you walk through the Servant Songs (Isaiah 42, 49, 50, 52-53) and show how the servant's identity narrows from Israel to an individual? Can you cite at least two pre-Rashi Jewish sources that support the individual messianic reading?",
  },

  // ── Module 4: Oral Torah Authority ──────────────────────────────────────
  {
    id: "mod-jewish-oral-torah",
    subjectId: "oral-torah-authority",
    title: "Oral Torah Authority — Full Training Module",
    doctrineBrief:
      "The claim that the Written Torah cannot be understood without the Oral Torah (Mishnah, Talmud, and later rabbinic literature) functions as an epistemological gatekeeping mechanism. If accepted, it makes rabbinic interpretation the necessary filter for all Bible reading, effectively giving human tradition authority over the divine text. SDAs affirm sola Scriptura: the Bible is its own interpreter, sufficient and clear for the essential truths of salvation. Rabbinic literature is valuable for historical context but is not infallible or authoritative over Scripture.",
    steelmanArguments: [
      {
        id: "mod4-steel-1",
        title: "The Torah Is Incomplete Without Oral Tradition",
        argument:
          "The Torah says to slaughter animals 'as I have commanded you' (Deuteronomy 12:21), but the specific method of shechitah (ritual slaughter) is not described anywhere in the Written Torah. This proves there was an oral tradition that accompanied the written text from Sinai.",
        hiddenAssumptions: [
          "Assumes that a reference to prior instruction necessarily proves the entire Oral Torah as codified centuries later",
          "Confuses the existence of some oral supplementary instruction with the authority of the entire Talmudic corpus",
        ],
        sdaResponse:
          "The existence of some oral instruction accompanying Moses does not validate the entire Mishnah and Talmud as we have them. The Talmud was compiled over centuries (Mishnah: ~200 AD; Babylonian Talmud: ~500 AD) and contains extensive rabbinic debate, contradiction, and innovation. Claiming it all traces back to Sinai is an extraordinary claim that the Talmud's own internal disagreements undermine.",
      },
      {
        id: "mod4-steel-2",
        title: "Christians Misread Without Rabbinic Training",
        argument:
          "Christian messianic interpretations consistently violate the rules of Jewish hermeneutics (middot). You cannot interpret the Tanakh properly without understanding pardes, the four levels of interpretation, and the thirteen hermeneutical rules of Rabbi Ishmael.",
        hiddenAssumptions: [
          "Assumes rabbinic hermeneutical methods are the only valid approach to the Hebrew Bible",
          "Ignores that the apostles, as Jews, used Jewish interpretive methods in their own reading of Scripture",
        ],
        sdaResponse:
          "The apostles were trained Jews who used Jewish interpretive methods. Matthew's use of typology, Paul's rabbinic argumentation, and the author of Hebrews' midrashic technique all demonstrate deep engagement with Jewish hermeneutics. Christianity did not abandon Jewish interpretive methods; it carried them forward. The question is not whether one uses Jewish methods but whether the conclusions follow from the text.",
      },
    ],
    hiddenAssumptions: [
      "The Oral Torah is treated as a monolithic tradition from Sinai, when in fact it developed over centuries with extensive internal disagreement",
      "Sola Scriptura is caricatured as 'me and my Bible alone,' ignoring that it affirms the value of tradition while subordinating it to Scripture",
      "The claim that Christians 'need' rabbinic training to read the Bible functions as an access-control mechanism, not a genuine hermeneutical argument",
    ],
    mindGames: [
      {
        id: "mod4-mg-1",
        name: "The Credentialing Trap",
        description:
          "Demanding to know the interlocutor's formal rabbinic training or Hebrew credentials before engaging with their arguments, creating an impossible entry barrier.",
        example:
          "\"Where did you study? Do you have semicha (rabbinic ordination)? Have you learned Gemara with a chavruta? If not, you're not qualified to discuss what these texts mean.\"",
        detectionTip:
          "This is an ad hominem disguised as a qualification requirement. Arguments stand or fall on their merits, not on the credentials of the person making them. Redirect to the evidence: 'Let's examine the text together and see what it says, regardless of our respective credentials.'",
      },
      {
        id: "mod4-mg-2",
        name: "The Infinite Regress of Sources",
        description:
          "For every source you cite, demanding another source to validate it, creating an infinite regress that prevents any conclusion from being reached.",
        example:
          "\"You cite the Targum Jonathan? But do you know what the Tosafot say about that passage? And the Maharsha's gloss on the Tosafot? You're only scratching the surface.\"",
        detectionTip:
          "Acknowledge the depth of rabbinic literature while refusing to be drawn into an infinite regress. Anchor the discussion in the primary text (the Tanakh) and use rabbinic sources as supporting evidence, not as the final arbiter.",
      },
    ],
    fallacies: [
      {
        id: "mod4-fall-1",
        name: "Appeal to Complexity",
        definition:
          "Arguing that the Hebrew Bible is so complex that it cannot be understood without expert rabbinic guidance, thereby gatekeeping access to the text's meaning.",
        example:
          "\"The Torah is so deep that without the Oral Torah, you can't even begin to understand it. You need a lifetime of study with rabbis to grasp the basics.\"",
        counterMove:
          "God gave His Word to be understood by His people, not just by scholars (Deuteronomy 30:11-14: 'This commandment is not too difficult for you or beyond your reach'). While scholarship is valuable, the essential message of Scripture is accessible to all who read with honest hearts and the Spirit's guidance.",
      },
      {
        id: "mod4-fall-2",
        name: "False Dichotomy (Oral Torah or Nothing)",
        definition:
          "Presenting only two options: accept the entire Oral Torah as authoritative or have no way to understand the Written Torah. This ignores the possibility of using sound hermeneutical principles to interpret Scripture without accepting rabbinic infallibility.",
        example:
          "\"Without the Oral Torah, you have no idea what the Torah means. It's either both or neither.\"",
        counterMove:
          "SDAs affirm that Scripture interprets Scripture (the analogy of faith). The Bible contains its own hermeneutical principles: context, genre, parallel passages, progressive revelation, and the testimony of Jesus. We do not need an external infallible interpreter any more than the Bereans did when they 'examined the Scriptures daily' (Acts 17:11).",
      },
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "jewish",
    debriefPrompt:
      "Can you explain the SDA position of sola Scriptura in a way that respects rabbinic scholarship without granting it authority over the text? Can you identify the hidden gatekeeping function in the Oral Torah argument?",
  },

  // ── Module 5: Daniel's Dating ────────────────────────────────────────────
  {
    id: "mod-jewish-daniels-dating",
    subjectId: "daniels-dating",
    title: "Daniel's Dating — Full Training Module",
    doctrineBrief:
      "The late-dating of Daniel (c. 165 BC, Maccabean period) is used to neutralize the book's predictive prophecies, particularly the 70-week timeline (Daniel 9:24-27) and the 2,300-day prophecy (Daniel 8:14) that are foundational to SDA theology. If Daniel is a forgery written after the fact, its 'prophecies' have no supernatural authority. The SDA position affirms a 6th-century BC date based on manuscript evidence (Dead Sea Scrolls), internal evidence (Ezekiel's references, Persian and Babylonian details), and the self-defeating nature of the late-date hypothesis (Daniel's prophecies extend far beyond the Maccabean period). This module equips the student to defend Daniel's authenticity and its prophetic significance.",
    steelmanArguments: [
      {
        id: "mod5-steel-1",
        title: "Scholarly Consensus Supports Late Dating",
        argument:
          "The overwhelming majority of critical scholars date Daniel to the Maccabean period. This is not a fringe position; it is the mainstream academic view taught in every major university. To reject it is to reject modern biblical scholarship.",
        hiddenAssumptions: [
          "Equates scholarly majority opinion with proven fact",
          "Ignores that the 'consensus' rests on the a priori rejection of predictive prophecy, not on purely textual evidence",
        ],
        sdaResponse:
          "Scholarly consensus is not proof; it is a sociological phenomenon. The same 'consensus' once denied the historicity of the Hittites, the existence of Belshazzar, and the antiquity of writing in Moses' era. All three were overturned by archaeological discovery. The late-date consensus rests on a philosophical presupposition (no predictive prophecy), not on overwhelming textual evidence. When the presupposition is set aside, the evidence for an early date is strong.",
      },
      {
        id: "mod5-steel-2",
        title: "Daniel's Detailed Knowledge of Antiochus IV",
        argument:
          "Daniel 11 describes the career of Antiochus IV Epiphanes with astonishing detail: his political maneuvering, his desecration of the Temple, and his persecution of the Jews. This level of detail is impossible in genuine prophecy and is only explicable as history written in prophetic guise.",
        hiddenAssumptions: [
          "Assumes detailed prediction is impossible, which is a philosophical claim, not a textual one",
          "Ignores that Daniel 11 extends beyond Antiochus into events that the Maccabean author supposedly could not have known",
        ],
        sdaResponse:
          "The argument is circular: 'Detailed prediction is impossible, therefore detailed prediction must be post-event narration.' If one allows for the possibility of genuine prophecy, the detail is evidence of divine inspiration, not fraud. Furthermore, Daniel 11:40-45 describes events that do not match Antiochus' actual death (he died of disease in Persia, not in Palestine 'between the seas'). If Daniel were simply narrating Maccabean history, why does the account diverge from known history at the end?",
      },
    ],
    hiddenAssumptions: [
      "The late-date hypothesis is presented as 'scholarship' while the early date is dismissed as 'fundamentalism,' creating a false prestige differential",
      "The Dead Sea Scrolls evidence, which strongly favors an early date, is downplayed or ignored",
      "The scope of Daniel's prophecies (extending to the 1st century AD and beyond) is incompatible with the Maccabean hypothesis but this inconvenience is rarely addressed",
    ],
    mindGames: [
      {
        id: "mod5-mg-1",
        name: "The Academic Authority Play",
        description:
          "Invoking 'scholarship' and 'the academy' as unquestionable authorities to intimidate the interlocutor into accepting the late-date hypothesis without examining the evidence.",
        example:
          "\"This isn't even debated in serious scholarship anymore. Only fundamentalists hold to the early date. Are you a fundamentalist?\"",
        detectionTip:
          "This is a combination of appeal to authority and ad hominem. Respond by engaging the evidence directly: 'Let's look at the Dead Sea Scrolls evidence, the Ezekiel references, and the scope of Daniel's prophecies. What does the evidence say, regardless of labels?'",
      },
      {
        id: "mod5-mg-2",
        name: "The 'You Can't Have It Both Ways' Trap",
        description:
          "Framing the debate so that accepting any critical scholarship means accepting all of it, including the late date of Daniel. Rejecting the late date is presented as rejecting scholarship entirely.",
        example:
          "\"You use historical-grammatical method for other texts. Why do you suddenly abandon critical methods when it comes to Daniel? You can't use scholarship selectively.\"",
        detectionTip:
          "Point out that the historical-grammatical method and the historical-critical method are different things. The former takes the text's claims about itself seriously; the latter begins with naturalistic presuppositions. Using sound historical and linguistic analysis does not require accepting the philosophical framework that rules out supernatural prophecy.",
      },
    ],
    fallacies: [
      {
        id: "mod5-fall-1",
        name: "Begging the Question (Circular Reasoning)",
        definition:
          "Assuming that predictive prophecy is impossible (naturalism), then concluding that Daniel's predictions must have been written after the fact, which 'proves' that the book is late. The conclusion is embedded in the premise.",
        example:
          "\"Daniel's predictions are too accurate to be real prophecy, so they must have been written after the events.\"",
        counterMove:
          "Expose the circularity: 'You're assuming prophecy is impossible in order to conclude that this prophecy isn't real. That's not evidence; that's a philosophical presupposition disguised as a conclusion. Let's examine the evidence without assuming the answer in advance.'",
      },
      {
        id: "mod5-fall-2",
        name: "Argument from Silence (Ben Sira)",
        definition:
          "Arguing that because Ben Sira (c. 180 BC) does not mention Daniel in his 'praise of famous men,' Daniel must not have existed yet. This assumes that an omission from one text proves non-existence.",
        example:
          "\"Ben Sira lists the great figures of Israel but skips Daniel. If Daniel existed, Ben Sira would have mentioned him.\"",
        counterMove:
          "Ben Sira also omits Job, Mordecai, and Ezra, all figures whose historicity is not typically questioned. Absence from one author's list does not prove non-existence. Additionally, Ben Sira's list is selective, not exhaustive, and its criteria for inclusion are not stated.",
      },
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "jewish",
    debriefPrompt:
      "Can you identify the circular reasoning in the late-date hypothesis? Can you cite the Dead Sea Scrolls evidence, the Ezekiel references, and the Josephus tradition? How does the scope of Daniel's prophecies (70 weeks, 2,300 days) undermine the Maccabean dating?",
  },
];

// ── Export ──────────────────────────────────────────────────────────────────

export const jewishTraining: AATSAvatarTraining = {
  avatarId: "jewish",
  avatarName: "The Jewish Scholar",
  emoji: "\u2721\uFE0F",
  color: "border-blue-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
