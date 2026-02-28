// ─── AATS: Black Hebrew Israelite Training Data ────────────────────────────
// Apologetics Avatar Training System — BHI module
// SDA (Seventh-day Adventist) responses to Black Hebrew Israelite theology

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "bhi-ethnic-exclusivity",
    title: "Ethnic Israel Exclusivity",
    description:
      "Only biological descendants of Jacob are God's chosen people",
  },
  {
    id: "bhi-law-identity",
    title: "Law Identity Arguments",
    description:
      "True Israel is identified by law-keeping tied to ethnic identity",
  },
  {
    id: "bhi-genealogical-salvation",
    title: "Genealogical Salvation",
    description:
      "Salvation is determined by bloodline, not by faith in Christ",
  },
  {
    id: "bhi-deut28-curses",
    title: "Deuteronomy 28 Curses",
    description:
      "The curses of Deuteronomy 28 prove African Americans are the true Israelites",
  },
  {
    id: "bhi-anti-gentile",
    title: "Anti-Gentile Theology",
    description:
      "Non-Israelites cannot receive salvation or are secondary in God's plan",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "bhi-sa-deut28-curses",
    title: "Deuteronomy 28 Curses Match African American Experience",
    argument:
      "Deuteronomy 28 curses perfectly describe the African American experience — slavery in ships (v. 68), being scattered among the nations (v. 64), serving enemies in hunger and thirst (v. 48), having children taken away (v. 32), and becoming a byword and proverb (v. 37). No other people group on earth matches every single one of these curses the way African Americans do. This proves they are the true descendants of Israel.",
    hiddenAssumptions: [
      "Curses are ethnic identifiers rather than covenant consequences for disobedience that applied to ancient Israel",
      "Only one group in all of human history matches these curses, when in fact multiple peoples have experienced slavery, exile, and oppression",
      "The curses were not already fulfilled in Israel's Assyrian and Babylonian captivities, which Scripture itself records as fulfillments",
    ],
    sdaResponse:
      "The curses of Deuteronomy 28 are covenant consequences, not ethnic identifiers. Moses explicitly stated these curses would come upon Israel 'if you do not obey the Lord your God' (Deut 28:15). They were fulfilled in the Assyrian captivity (2 Kings 17:6-23), the Babylonian exile (2 Chron 36:15-21), and the Roman destruction of Jerusalem in 70 AD. Verse 68 about ships to Egypt was fulfilled when Titus sent Jewish captives to Egyptian mines by ship (Josephus, Wars 6.9.2). The suffering of African Americans under slavery is a real and grievous historical evil, but it is not evidence of Israelite lineage — it is evidence of human sin. God's response to oppression is universal justice (Amos 5:24), not ethnic re-identification.",
  },
  {
    id: "bhi-sa-lost-sheep",
    title: "Jesus Came Only for the Lost Sheep of Israel",
    argument:
      "Jesus Himself said, 'I am not sent but unto the lost sheep of the house of Israel' (Matthew 15:24). He told the twelve, 'Go not into the way of the Gentiles' (Matthew 10:5-6). Jesus was clear that His mission was to ethnic Israel, not to Gentiles. Everything else is a distortion added by Paul and the later church to water down the exclusivity of God's covenant people.",
    hiddenAssumptions: [
      "Matthew 15:24 limits all salvation permanently to ethnic Israel, when Jesus was describing the priority of His earthly ministry",
      "The Great Commission in Matthew 28:19 — 'Go therefore and make disciples of all nations' — does not expand this initial scope",
      "'Israel' in the New Testament must always mean biological descendants, ignoring Paul's redefinition in Romans 9:6-8",
    ],
    sdaResponse:
      "Jesus' statement in Matthew 15:24 describes the sequence of His earthly ministry — 'to the Jew first and also to the Greek' (Romans 1:16) — not an eternal limitation on salvation. In the very passage cited, Jesus healed the Canaanite woman's daughter, demonstrating that faith, not ethnicity, is the qualifying factor (Matt 15:28). Jesus also commended the Roman centurion's faith as greater than any in Israel (Matt 8:10) and declared that 'many will come from the east and west and recline at table with Abraham' while 'sons of the kingdom will be thrown into outer darkness' (Matt 8:11-12). The Great Commission in Matthew 28:19 — the resurrected Christ's final command — says 'all nations,' not 'all tribes of Israel.' SDA theology holds that God's remnant is identified by faith and commandment-keeping (Rev 12:17), not by bloodline.",
  },
  {
    id: "bhi-sa-romans9-blood",
    title: "Salvation Is by Blood — Romans 9 Proves It",
    argument:
      "Romans 9 says God chose Jacob over Esau before they were born — that's bloodline election. Paul mourned for 'my kinsmen according to the flesh' (Rom 9:3) because salvation belongs to Israel by birth. The covenants, the promises, the adoption — all belong to Israel ethnically (Rom 9:4-5). You cannot spiritualize away what Paul clearly ties to physical descent.",
    hiddenAssumptions: [
      "Romans 9-11 teaches ethnic exclusivity, when Paul's point is that God's election was never merely ethnic (Rom 9:6-8)",
      "Paul did not also write 'There is neither Jew nor Gentile... for you are all one in Christ Jesus' (Galatians 3:28)",
      "'Israel of God' (Galatians 6:16) refers only to ethnic Israel, ignoring the entire argument of Galatians 3-4 about Abraham's seed being defined by faith",
    ],
    sdaResponse:
      "Romans 9 is actually the strongest refutation of ethnic salvation. Paul's entire argument is that 'not all who are descended from Israel are Israel' (Rom 9:6). He explains that 'it is not the children of the flesh who are the children of God, but the children of the promise' (Rom 9:8). Paul used Jacob and Esau precisely to show that God's election is based on His sovereign purpose, not on birth. Romans 9-11 reaches its climax in 11:23-26, where Paul says even cut-off branches (ethnic Israel) can be grafted back in 'if they do not continue in unbelief' — making faith, not blood, the operative criterion. SDAs affirm with Paul that 'if you are Christ's, then you are Abraham's offspring, heirs according to promise' (Gal 3:29).",
  },
  {
    id: "bhi-sa-bible-black-people",
    title: "The Bible Was Written by Black People for Black People",
    argument:
      "The Bible originated in Africa and the Middle East — lands of dark-skinned peoples. Moses married an Ethiopian (Cushite) woman. Solomon said 'I am black and beautiful' (Song 1:5). Revelation describes Jesus with 'hair like wool' and 'feet like burnished bronze' (Rev 1:14-15). The Bible was written by people of color about people of color, and European Christianity hijacked it. Recognizing this means recognizing that the covenant belongs to Black people.",
    hiddenAssumptions: [
      "Geography and climate automatically determine a single ethnicity, conflating ancient Near Eastern diversity with modern racial categories",
      "The message of Scripture is ethnic-specific rather than universally applicable to all humanity",
      "God's covenant is fundamentally racial in nature, when Scripture grounds it in faith (Genesis 15:6, Habakkuk 2:4, Romans 1:17)",
    ],
    sdaResponse:
      "It is historically accurate that the Bible emerged from the ancient Near East and North Africa, and that European depictions of biblical characters have often been inaccurate. SDAs affirm this and reject racial whitewashing of Scripture. However, the leap from 'the Bible's authors were people of color' to 'the covenant belongs exclusively to Black people' is a non sequitur. The ancient world did not operate with modern racial categories. Song of Solomon 1:5 uses 'dark' to describe sun exposure during labor, not racial identity. Revelation 1:14-15 uses apocalyptic symbolism — the white hair represents antiquity and wisdom (Dan 7:9), and the bronze feet represent judgment authority. The Bible was written by diverse peoples of the ancient Near East, and its message transcends all ethnic boundaries: 'After this I looked, and behold, a great multitude that no one could number, from every nation, from all tribes and peoples and languages' (Rev 7:9).",
  },
  {
    id: "bhi-sa-twelve-tribes-mapped",
    title: "The Twelve Tribes Are Mapped to Specific Modern Ethnic Groups",
    argument:
      "The twelve tribes of Israel can be identified today: Judah is the African Americans, Benjamin is the West Indians, Levi is the Haitians, and so on. Each tribe was scattered to a specific region, and the ethnic groups in those regions today are the descendants. The so-called Jews in Israel are actually Khazars — European converts — not real Israelites. We are the real Jews, and the prophecy of the regathering refers to us.",
    hiddenAssumptions: [
      "Tribal identification survived the Assyrian dispersion (722 BC), the Babylonian exile (586 BC), the Roman destruction (70 AD), and 2,000+ years of migration and intermarriage",
      "Modern ethnicity maps cleanly onto ancient tribal boundaries despite millennia of population movement",
      "DNA and archaeological evidence is irrelevant or actively suppressed by a conspiracy, rather than simply not supporting these claims",
    ],
    sdaResponse:
      "There is no historical, archaeological, or genetic evidence that the twelve tribes can be mapped onto modern ethnic groups in the way BHI theology claims. The Assyrian exile of the northern ten tribes (722 BC) resulted in intermarriage and cultural assimilation so thorough that they were called 'lost' in antiquity itself. The Khazar theory — that Ashkenazi Jews are descended from Turkic converts — has been extensively studied and largely refuted by genetic research showing Middle Eastern ancestry in Jewish populations worldwide. More importantly, SDAs believe that the regathering of Israel finds its fulfillment in the church — the spiritual Israel composed of all who have faith in Christ (Gal 3:7-9, 28-29; Rom 2:28-29; 1 Pet 2:9-10). The 144,000 of Revelation 7 are followed immediately by an innumerable multitude from 'every nation,' demonstrating that God's end-time people are not defined by tribal ethnicity but by the seal of God and faith in the Lamb.",
  },
  {
    id: "bhi-sa-gentile-dogs",
    title: "Gentiles Are 'Dogs' According to Scripture",
    argument:
      "Jesus Himself called the Canaanite woman a 'dog' (Matt 15:26). The Old Testament repeatedly distinguishes Israel from the nations and commands separation. Deuteronomy 7:6 says Israel is 'a people holy to the LORD... chosen out of all the peoples on the face of the earth.' God never revoked this special status. Gentiles can at best be servants to Israel in the Kingdom — Isaiah 14:2 says 'the house of Israel will possess the nations as male and female slaves.'",
    hiddenAssumptions: [
      "Jesus' interaction with the Canaanite woman was a permanent statement of Gentile inferiority rather than a test of faith that she passed (Matt 15:28)",
      "Old Testament separation commands were about racial supremacy rather than covenant holiness and the prevention of idolatry",
      "Isaiah's kingdom prophecies are literal predictions of ethnic domination rather than typological pictures fulfilled in the universal church",
    ],
    sdaResponse:
      "Jesus' exchange with the Canaanite woman must be read to its conclusion: He healed her daughter and commended her faith as 'great' (Matt 15:28). Jesus used the encounter to demonstrate that faith transcends ethnic boundaries — the very opposite of the BHI reading. Deuteronomy 7:6 describes Israel's covenant calling to be a 'kingdom of priests' (Ex 19:6), a mediatorial role for the benefit of all nations, not an ethnic hierarchy. God told Abraham, 'in you all the families of the earth shall be blessed' (Gen 12:3). Peter learned through Cornelius that 'God shows no partiality, but in every nation anyone who fears him and does what is right is acceptable to him' (Acts 10:34-35). SDAs understand that Isaiah's kingdom prophecies find their fulfillment in the new earth where God 'will wipe away every tear from every eye' — from every people and nation (Rev 21:3-4).",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "bhi-mg-identity-pressure",
    name: "Identity Pressure Tactics",
    description:
      "Framing the debate as racial loyalty — 'Are you going to deny your own people?'",
    example:
      "A BHI teacher challenges a Black SDA: 'So you're going to side with the white man's religion over your own heritage? You're going to worship a white Jesus while your people are suffering? Wake up, brother — they stole your identity and gave you a slave religion.' This reframes a theological discussion into a test of ethnic loyalty, making any disagreement feel like racial betrayal.",
    detectionTip:
      "Watch for the shift from Scripture to identity. The moment the argument becomes about your racial loyalty rather than what the text actually says, a mind game is in play. Ask: 'Can we look at what the passage says in its original context?' Biblical truth is not determined by the ethnicity of the person presenting it. SDAs have historically been at the forefront of racial equality (see the 1895 Ellen White statements against racism), so defending biblical universalism is not siding with oppression — it is siding with God's justice for all peoples.",
  },
  {
    id: "bhi-mg-selective-ot",
    name: "Selective Old Testament Usage",
    description:
      "Using Old Testament texts while ignoring New Testament universalism",
    example:
      "A BHI apologist cites Deuteronomy 7:6, Deuteronomy 14:2, Amos 3:2, and Psalm 147:19-20 to prove God's exclusive relationship with ethnic Israel. When you bring up Galatians 3:28, Acts 10:34-35, or Romans 10:12, they dismiss the New Testament as 'Paul's opinion' or a Gentile corruption of the original message. They build an entire theology from the Old Testament while systematically excluding the New Testament's expansion of the covenant.",
    detectionTip:
      "Notice when someone only engages with one Testament. The Bible is a unified whole — 'All Scripture is breathed out by God' (2 Tim 3:16). Ask: 'Do you accept the New Testament as Scripture?' If they do, they must grapple with its universalism. If they don't, the conversation becomes about the canon, not ethnicity. Jesus Himself said 'the Scripture cannot be broken' (John 10:35), and the earliest Christians — including the Jerusalem Council in Acts 15 — understood that the gospel was for all nations.",
  },
  {
    id: "bhi-mg-oppression-rhetoric",
    name: "Emotional Oppression Rhetoric",
    description:
      "Leveraging real historical suffering to make questioning feel like endorsing oppression",
    example:
      "When you challenge the Deuteronomy 28 interpretation, a BHI teacher responds: 'Do you know what our ancestors went through? They were ripped from their homeland, put in chains, whipped, lynched, and had their names stolen. And you're going to sit here and tell me that's not Deuteronomy 28? You're spitting on their graves.' The real historical evil of slavery is used to make exegetical critique feel like moral callousness.",
    detectionTip:
      "Separate the two claims: (1) The transatlantic slave trade was a horrific evil — this is true and must be affirmed. (2) The transatlantic slave trade was a fulfillment of Deuteronomy 28's curses on Israel — this is an interpretive claim that must be evaluated on exegetical grounds. You can fully honor the suffering while questioning the theological framework built on it. In fact, reducing centuries of African suffering to a proof text for ethnic identity arguably diminishes that suffering by making it merely instrumental.",
  },
  {
    id: "bhi-mg-shame-guilt",
    name: "Shame and Guilt",
    description:
      "Implying that disagreement means you're a self-hating traitor or colonized mind",
    example:
      "After presenting counter-evidence, a BHI advocate says: 'This is exactly what happens when you let the slave master teach you theology. You've been so brainwashed you can't even recognize your own people in the Bible. You've got a colonized mind — you love your oppressor more than your own.' This is designed to make the person feel that their education, reasoning, and faith are all products of oppression rather than genuine conviction.",
    detectionTip:
      "This is an ad hominem attack disguised as cultural critique. The truth of an argument does not depend on the psychological state of the person making it. Ask: 'Can you address the Scripture I cited rather than my motivations?' It is possible — and historically demonstrable — for Black Christians to arrive at orthodox theology through rigorous, independent study of Scripture. The SDA church itself has a rich tradition of Black scholarship and leadership, from Charles Kinney to E.E. Cleveland, who embraced biblical universalism not because of colonization but because of conviction.",
  },
  {
    id: "bhi-mg-hidden-knowledge",
    name: "Gnostic Hidden Knowledge Claims",
    description:
      "Claiming access to suppressed or hidden truths that mainstream Christianity conceals",
    example:
      "'The Catholic Church and the Freemasons have been hiding the truth about who the real Israelites are for centuries. They changed the maps, burned the books, and rewrote the Bible to keep us from knowing our identity. Only now is the truth being revealed to those with eyes to see.' This creates an unfalsifiable framework where any lack of evidence is proof of conspiracy.",
    detectionTip:
      "Conspiracy claims are unfalsifiable — they treat the absence of evidence as evidence of suppression. Ask for positive evidence rather than arguments from silence. The Dead Sea Scrolls, ancient Near Eastern archaeology, and centuries of textual scholarship have enormously expanded our understanding of the Bible. None of it supports the tribal mapping claims of BHI theology. SDAs value the investigative study of Scripture (Acts 17:11) and reject both blind tradition and conspiracy-based reasoning.",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "bhi-f-eisegesis",
    name: "Eisegesis",
    definition:
      "Reading modern racial categories into ancient texts that do not address them — importing meaning into the text rather than drawing meaning out of it",
    example:
      "Interpreting 'I am black and beautiful' (Song 1:5) as a declaration of African racial identity, when the Hebrew word 'shachor' refers to being darkened by the sun and the context is a love poem, not an ethnic manifesto. Similarly, reading Revelation 1:14-15's apocalyptic imagery of Christ as a statement about His skin color ignores the genre of apocalyptic literature and its symbolic conventions (white hair = eternal wisdom as in Daniel 7:9, bronze feet = purifying judgment).",
    counterMove:
      "Always ask: 'What did this text mean to its original audience in its original context?' Demonstrate the difference between exegesis (drawing meaning out) and eisegesis (reading meaning in). Use the SDA hermeneutical principle of letting Scripture interpret Scripture. Song of Solomon 1:6 explains the 'darkness' in 1:5 — 'my mother's sons... made me keeper of the vineyards' — it is about manual labor under the sun, not racial identity.",
  },
  {
    id: "bhi-f-hasty-generalization",
    name: "Hasty Generalization",
    definition:
      "Applying specific covenant curses as universal ethnic identifiers for a single modern group",
    example:
      "Claiming that Deuteronomy 28:68 — 'The LORD will bring you back in ships to Egypt... and there you shall offer yourselves for sale as slaves' — uniquely identifies African Americans via the transatlantic slave trade. This ignores that the verse specifies Egypt (not the Americas), that the curse was a covenant consequence for disobedience (not an ethnic marker), that multiple ancient peoples experienced deportation by ship, and that Jewish historian Josephus records its fulfillment in the Roman period when Jewish captives were shipped to Egypt.",
    counterMove:
      "Point out the logical structure: 'Group X experienced suffering Y. Deuteronomy 28 describes suffering Y. Therefore Group X is Israel.' This syllogism is invalid because the curses are not unique identifiers — many peoples throughout history have experienced slavery, exile, famine, and oppression. Multiple groups could 'match' these curses. Moreover, the text itself identifies the recipients as those who violated the Sinai covenant — a historical event, not a racial prophecy.",
  },
  {
    id: "bhi-f-genetic-fallacy",
    name: "Genetic Fallacy",
    definition:
      "Determining the truth of a message by the ethnicity of the messenger rather than by its content and evidence",
    example:
      "'You got your theology from white seminaries, so it's slave-master religion.' Or conversely: 'This teaching must be true because it comes from a Hebrew Israelite teacher who knows his roots.' In both cases, the argument is evaluated based on the racial identity of the source rather than on its fidelity to Scripture. This is a two-edged sword that can be used to dismiss or to validate based solely on ethnicity.",
    counterMove:
      "Separate the source from the substance. Ask: 'Can we evaluate this claim based on what Scripture actually says, regardless of who is making the argument?' The Bereans were commended not for accepting or rejecting Paul based on his ethnicity, but for 'examining the Scriptures daily to see if these things were so' (Acts 17:11). Truth is validated by evidence and sound exegesis, not by the background of the exegete.",
  },
  {
    id: "bhi-f-appeal-to-emotion",
    name: "Appeal to Emotion",
    definition:
      "Using the undeniable trauma of slavery and racism to bypass exegetical arguments and make disagreement feel morally unconscionable",
    example:
      "'How can you deny Deuteronomy 28 when our ancestors were thrown overboard during the Middle Passage? When families were ripped apart on the auction block? When our names, our language, and our identity were stolen? This is exactly what Moses prophesied.' The emotional weight of real suffering is deployed to foreclose rational examination of the interpretive claim.",
    counterMove:
      "Affirm the suffering without affirming the interpretation: 'The evil of slavery is undeniable and grieves the heart of God. But honoring that suffering means getting the theology right, not just getting it emotional. If Deuteronomy 28 was about covenant faithfulness and was fulfilled in the ancient world, then building an identity theology on it — however emotionally compelling — is building on sand. We honor our ancestors by seeking truth, not by using their pain as a proof text.'",
  },
  {
    id: "bhi-f-no-true-scotsman",
    name: "No True Scotsman",
    definition:
      "Redefining 'Israel' in an unfalsifiable way so that any counter-evidence is dismissed as applying to 'fake Israel' rather than 'real Israel'",
    example:
      "'Modern Jews aren't real Jews — they're Khazars. The archaeological evidence for ancient Israel? That was about Edomites, not real Israel. DNA studies showing Ashkenazi Jews have Middle Eastern ancestry? The tests are rigged by the establishment.' Every piece of counter-evidence is deflected by moving the goalpost of who counts as 'real' Israel, making the claim unfalsifiable.",
    counterMove:
      "Point out the unfalsifiability: 'What evidence would you accept as disproving your claim? If no evidence could possibly change your mind, then this is not a truth claim — it is an article of faith immune to examination.' Compare with the scientific and historical method: claims must be testable and potentially falsifiable to be taken seriously. The Bible itself invites investigation: 'Come now, let us reason together' (Isaiah 1:18).",
  },
];

// ── Counter Strategies (one per subject) ────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "bhi-ethnic-exclusivity",
    title: "The Universal Scope of God's Covenant People",
    sdaPosition:
      "SDAs believe that God's covenant people are defined by faith in Christ and obedience to His commandments (Rev 12:17, Rev 14:12), not by ethnic descent. While God chose ethnic Israel as His covenant vehicle in the Old Testament, this was always instrumental — 'in you all the families of the earth shall be blessed' (Gen 12:3). The New Testament makes explicit what the Old Testament foreshadowed: that 'in Christ Jesus you are all sons of God through faith' and 'there is neither Jew nor Greek... for you are all one in Christ Jesus' (Gal 3:26-28). God's remnant church in the last days is identified by doctrinal fidelity and faith, not by bloodline.",
    keyScriptures: [
      "Galatians 3:28-29 — 'There is neither Jew nor Greek, there is neither slave nor free, there is no male and female, for you are all one in Christ Jesus. And if you are Christ's, then you are Abraham's offspring, heirs according to promise.'",
      "Romans 2:28-29 — 'For no one is a Jew who is merely one outwardly, nor is circumcision outward and physical. But a Jew is one inwardly, and circumcision is a matter of the heart, by the Spirit, not by the letter.'",
      "Revelation 7:9 — 'After this I looked, and behold, a great multitude that no one could number, from every nation, from all tribes and peoples and languages, standing before the throne and before the Lamb.'",
      "Acts 10:34-35 — 'Truly I understand that God shows no partiality, but in every nation anyone who fears him and does what is right is acceptable to him.'",
    ],
    counterArguments: [
      "God's purpose for Israel was always missional, not exclusionary. Genesis 12:3 ('in you all families of the earth shall be blessed') establishes from the very beginning that Israel's election was for the benefit of all nations, not for ethnic supremacy.",
      "Jesus' genealogy in Matthew 1 deliberately includes Gentile women — Rahab the Canaanite, Ruth the Moabitess, and Bathsheba the wife of Uriah the Hittite — demonstrating that God's covenant line was never ethnically pure.",
      "The Jerusalem Council in Acts 15 definitively settled this question for the apostolic church: Gentiles do not need to become ethnic Israelites to be saved. James cited Amos 9:11-12 to show that the inclusion of Gentiles was the fulfillment of prophecy, not a deviation from it.",
      "Paul explicitly argues in Romans 9:6-8 that 'not all who are descended from Israel belong to Israel, and not all are children of Abraham because they are his offspring.' Physical descent was never sufficient — it was always 'the children of the promise' who are counted as offspring.",
    ],
    closingStatement:
      "The God of the Bible is not a tribal deity. He is the Creator of all humanity who 'made from one man every nation of mankind to live on all the face of the earth' (Acts 17:26). His covenant is open to all who come in faith. To restrict it to one ethnic group is to diminish the very God who 'so loved the world' (John 3:16).",
  },
  {
    subjectId: "bhi-law-identity",
    title: "Law-Keeping as Covenant Faithfulness, Not Ethnic Identity",
    sdaPosition:
      "SDAs hold that God's moral law (the Ten Commandments) is universal and eternal, binding on all humanity — not as an ethnic marker but as the expression of God's character (Ps 119:142, Rom 7:12). We keep the Sabbath not because we claim to be ethnic Israelites, but because the Sabbath was established at Creation (Gen 2:2-3) before any nation existed. The law identifies the people of God in the last days (Rev 12:17, Rev 14:12), but this identification is by obedience through faith, not by bloodline. The law is 'written on the hearts' of all who are in the new covenant (Jer 31:33, Heb 8:10), regardless of ethnicity.",
    keyScriptures: [
      "Revelation 14:12 — 'Here is the endurance of the saints, those who keep the commandments of God and hold fast the faith of Jesus.' — The saints are identified by commandment-keeping AND faith in Jesus, not by ethnicity.",
      "Jeremiah 31:33 — 'I will put my law within them, and I will write it on their hearts. And I will be their God, and they shall be my people.' — The new covenant internalizes the law for all who enter covenant relationship.",
      "Romans 3:29-30 — 'Or is God the God of Jews only? Is he not the God of Gentiles also? Yes, of Gentiles also, since God is one — who will justify the circumcised by faith and the uncircumcised through that same faith.'",
      "Isaiah 56:6-7 — 'And the foreigners who join themselves to the LORD... who keep the Sabbath... these I will bring to my holy mountain. For my house shall be called a house of prayer for all peoples.'",
    ],
    counterArguments: [
      "The Sabbath predates Israel. It was established at Creation (Gen 2:2-3) for all humanity, not at Sinai for one ethnic group. Jesus confirmed this: 'The Sabbath was made for man, not man for the Sabbath' (Mark 2:27) — 'man' (anthropos), meaning all humanity.",
      "Isaiah 56:3-7 explicitly includes 'the foreigner who joins himself to the LORD' among Sabbath-keepers and temple-worshippers, demolishing the claim that law-keeping is an ethnic identifier. God says He will bring them to His 'holy mountain' — the same destination as Israel.",
      "The law written on the heart (Jer 31:33) is the hallmark of the new covenant. This is not about ethnic DNA but about the Spirit's transforming work in any person who accepts Christ. The law becomes an identity marker of faith, not of genealogy.",
      "SDAs demonstrate this principle globally: the Sabbath is kept by millions from every continent, language, and ethnicity. A Korean SDA keeping the seventh-day Sabbath in Seoul is no less obedient than a Jewish believer doing the same in Jerusalem. The law's universal scope reflects the universal character of its Author.",
    ],
    closingStatement:
      "God's law is the transcript of His character, and His character has no ethnicity. To claim that commandment-keeping belongs to one race is to shrink the infinite God into a tribal idol. The SDA movement is itself living proof that God's law is for all peoples — with congregations in over 200 countries, all keeping the same seventh-day Sabbath.",
  },
  {
    subjectId: "bhi-genealogical-salvation",
    title: "Salvation by Grace Through Faith, Not by Bloodline",
    sdaPosition:
      "SDAs affirm the Protestant principle of salvation by grace through faith alone in Jesus Christ (Eph 2:8-9), emphatically rejecting any notion that bloodline, ethnicity, or genealogy contributes to salvation. John the Baptist warned the Pharisees against genealogical presumption: 'Do not presume to say to yourselves, \"We have Abraham as our father,\" for I tell you, God is able from these stones to raise up children for Abraham' (Matt 3:9). Salvation has always been by faith — Abraham 'believed the LORD, and he counted it to him as righteousness' (Gen 15:6) — and this principle applies universally.",
    keyScriptures: [
      "Romans 10:12-13 — 'For there is no distinction between Jew and Greek; for the same Lord is Lord of all, bestowing his riches on all who call on him. For everyone who calls on the name of the Lord will be saved.'",
      "Ephesians 2:8-9 — 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.'",
      "Galatians 3:7-9 — 'Know then that it is those of faith who are the sons of Abraham... So then, those who are of faith are blessed along with Abraham, the man of faith.'",
      "John 1:12-13 — 'But to all who did receive him, who believed in his name, he gave the right to become children of God, who were born, not of blood nor of the will of the flesh nor of the will of man, but of God.'",
    ],
    counterArguments: [
      "John 1:12-13 could not be clearer: becoming a child of God happens 'not of blood nor of the will of the flesh nor of the will of man, but of God.' The Greek word for 'blood' here (haimaton) explicitly excludes bloodline as a basis for covenant standing.",
      "John the Baptist directly confronted genealogical presumption (Matt 3:9), warning that descent from Abraham means nothing without repentance and faith. If bloodline guaranteed salvation, John's warning was meaningless.",
      "The book of Ruth is a devastating counterexample: a Moabitess — from a people cursed in Deuteronomy 23:3 — becomes an ancestor of King David and of Jesus Christ Himself (Matt 1:5, Ruth 4:17). God's covenant line passes through a Gentile woman whose qualification was faith, not blood: 'Your people shall be my people, and your God my God' (Ruth 1:16).",
      "Rahab the Canaanite prostitute is listed in both Jesus' genealogy (Matt 1:5) and the Hebrews 11 hall of faith (Heb 11:31). She was saved 'by faith' despite being a Canaanite — the very people Israel was commanded to dispossess. Her bloodline disqualified her; her faith saved her.",
    ],
    closingStatement:
      "The cross of Christ is the ultimate refutation of genealogical salvation. At Calvary, the blood that saves is not Abraham's blood flowing through your veins but Christ's blood poured out for your sins. 'There is one mediator between God and men, the man Christ Jesus, who gave himself as a ransom for all' (1 Tim 2:5-6) — for all, not for one ethnicity.",
  },
  {
    subjectId: "bhi-deut28-curses",
    title: "Deuteronomy 28 in Its Covenant Context",
    sdaPosition:
      "SDAs read Deuteronomy 28 in its proper context: a covenant document in the suzerain-vassal treaty format common in the ancient Near East, specifying blessings for obedience (vv. 1-14) and curses for disobedience (vv. 15-68). These curses were addressed to the specific nation that entered the covenant at Sinai. They were fulfilled in the Assyrian captivity (2 Kings 17), the Babylonian exile (2 Chron 36), and the Roman destruction (70 AD). While the suffering of African Americans under slavery is a grievous historical evil that cries out for justice, it is not a fulfillment of Mosaic covenant curses — it is a consequence of human sin and the broader biblical theme of oppression that God universally condemns (Amos 5:11-12, Isa 58:6).",
    keyScriptures: [
      "Deuteronomy 28:15 — 'But if you will not obey the voice of the LORD your God or be careful to do all his commandments and his statutes that I command you today, then all these curses shall come upon you and overtake you.' — The curses are conditional and covenantal, not ethnic prophecies.",
      "2 Chronicles 36:15-21 — The Babylonian exile is presented as the fulfillment of covenant curses: 'He brought up against them the king of the Chaldeans... to fulfill the word of the LORD by the mouth of Jeremiah.' — Scripture itself identifies when these curses were fulfilled.",
      "Nehemiah 9:26-31 — Nehemiah's prayer explicitly recounts the cycle of disobedience and covenant curses being fulfilled in Israel's history — long before the transatlantic slave trade.",
      "Amos 5:24 — 'But let justice roll down like waters, and righteousness like an ever-flowing stream.' — God's response to oppression is universal justice, not ethnic re-identification.",
    ],
    counterArguments: [
      "Deuteronomy 28:68 specifies return to 'Egypt' — not the Americas. When BHI teachers claim 'Egypt' is symbolic of slavery anywhere, they abandon the literal hermeneutic they use for every other detail in the chapter. You cannot insist the 'ships' are literal transatlantic slave ships while simultaneously claiming 'Egypt' is figurative.",
      "Multiple peoples throughout history match the Deuteronomy 28 curses: the Armenian genocide (1915), the Cambodian killing fields (1975-79), the Rwandan genocide (1994), the Uyghur persecution today. The curses describe generic consequences of conquest and exile that are tragically common in human history, not unique ethnic identifiers.",
      "Scripture itself records the fulfillments. Josephus describes Jews being transported by ships to Egypt after 70 AD (Wars 6.9.2), directly fulfilling Deuteronomy 28:68. The Lamentations of Jeremiah describe the horrors of the Babylonian siege matching Deuteronomy 28 curse by curse. The fulfillments are documented within the biblical and historical record.",
      "Using Deuteronomy 28 as an ethnic identifier inverts its theological purpose. The curses were meant to drive Israel to repentance and covenant faithfulness (Deut 30:1-3), not to serve as a DNA test for future ethnic groups. The passage ends with a call to 'return to the LORD' — a call to faith, not to racial identification.",
    ],
    closingStatement:
      "Deuteronomy 28 is a covenant document, not a genealogy test. Its purpose is to reveal the seriousness of covenant faithfulness and the mercy of a God who always provides a path of return. To repurpose it as an ethnic identifier is to miss its profound theological point — and to build an identity on curses rather than on the blessings of the new covenant in Christ.",
  },
  {
    subjectId: "bhi-anti-gentile",
    title: "God's Heart for All Nations",
    sdaPosition:
      "SDAs affirm that from the very beginning, God's plan encompassed all nations. The Abrahamic covenant was missional: 'in you all the families of the earth shall be blessed' (Gen 12:3). Israel was chosen as a 'kingdom of priests' (Ex 19:6) — priests mediate between God and others, which implies that others are included in God's concern. The prophets consistently envisioned Gentile inclusion (Isa 49:6, 56:6-7, Jonah, Malachi 1:11). Jesus inaugurated this universal scope (John 3:16, Matt 28:19), and the apostolic church confirmed it (Acts 15, Eph 2:11-22). God 'shows no partiality' (Acts 10:34) and desires 'all people to be saved' (1 Tim 2:4). Anti-Gentile theology fundamentally contradicts the character of the God revealed in Scripture.",
    keyScriptures: [
      "Genesis 12:3 — 'In you all the families of the earth shall be blessed.' — God's original promise to Abraham was never ethnically exclusive.",
      "Isaiah 49:6 — 'I will make you as a light for the nations, that my salvation may reach to the end of the earth.' — Israel's calling was to be a light to all peoples.",
      "Acts 10:34-35 — 'Truly I understand that God shows no partiality, but in every nation anyone who fears him and does what is right is acceptable to him.' — Peter's revelation through Cornelius.",
      "1 Timothy 2:3-4 — 'God our Savior, who desires all people to be saved and to come to the knowledge of the truth.' — God's salvific will encompasses all humanity.",
    ],
    counterArguments: [
      "The book of Jonah is a direct rebuke of anti-Gentile theology within the Old Testament itself. God sent a Hebrew prophet to pagan Nineveh, saved the entire city when they repented, and then rebuked Jonah for his ethnic resentment. Jonah wanted God to be a tribal deity; God refused.",
      "Ruth the Moabitess and Rahab the Canaanite are in the genealogy of Jesus Christ (Matt 1:5). God wove Gentile women into the Messianic line — the most sacred lineage in all of Scripture. This was not an accident but a theological statement: salvation was never limited to one ethnicity.",
      "Ephesians 2:14 declares that Christ 'has broken down in his flesh the dividing wall of hostility' between Jew and Gentile, creating 'one new man in place of the two.' Anti-Gentile theology wants to rebuild the wall that Christ tore down. It is, in Paul's language, a return to the 'elementary principles of the world' (Gal 4:3).",
      "The three angels' messages of Revelation 14:6-12 — the core of SDA identity — are addressed to 'every nation, tribe, language, and people.' The final proclamation of the everlasting gospel is universal. A gospel limited to one ethnicity is not the everlasting gospel — it is a different gospel (Gal 1:6-8).",
    ],
    closingStatement:
      "The God who created all humanity in His image (Gen 1:27) loves all humanity with an everlasting love. The cross stands at the center of human history as God's definitive statement: 'For God so loved the world' — not one nation, not one race, not one tribe, but the world. Any theology that narrows this love to a single ethnic group has not understood the cross.",
  },
];

// ── Modules (one per subject) ───────────────────────────────────────────────

const modules: AATSModule[] = [
  {
    id: "bhi-mod-ethnic-exclusivity",
    subjectId: "bhi-ethnic-exclusivity",
    title: "Module 1: Ethnic Israel Exclusivity",
    doctrineBrief:
      "Black Hebrew Israelite theology teaches that only biological descendants of the patriarch Jacob constitute God's chosen people. According to this view, modern African Americans (and sometimes other specific ethnic groups) are the true descendants of the ancient Israelites, and the covenant promises belong exclusively to them. All others — including modern Jews, Europeans, Asians, and other non-Black peoples — are either Edomites, Gentile outsiders, or imposters. This ethnic exclusivity forms the foundation of BHI theology and determines their approach to every other doctrine: who can be saved, who receives God's promises, and who will inherit the Kingdom. The SDA response emphasizes that God's covenant was always missional and inclusive in its ultimate scope, that 'Israel' is redefined in the New Testament by faith rather than blood, and that the remnant of Revelation is identified by the commandments of God and the faith of Jesus — not by genealogy.",
    steelmanArguments: [
      steelmanArguments[0], // Deut 28 curses
      steelmanArguments[1], // Lost sheep
      steelmanArguments[4], // Twelve tribes mapped
    ],
    hiddenAssumptions: [
      "Ethnic descent is the primary criterion for covenant membership, despite the New Testament's explicit redefinition (Rom 9:6-8, Gal 3:28-29)",
      "The 'chosen people' concept implies ethnic supremacy rather than missional responsibility — Israel was chosen to serve, not to rule (Ex 19:6, Isa 49:6)",
      "Modern racial categories can be mapped onto ancient Near Eastern peoples without anachronism",
      "The inclusion of Gentiles in the New Testament is a corruption rather than the fulfillment of God's original plan (Gen 12:3, Isa 49:6)",
    ],
    mindGames: [mindGames[0], mindGames[3]], // Identity pressure, Shame and guilt
    fallacies: [fallacies[0], fallacies[4]], // Eisegesis, No true Scotsman
    counterStrategy: counterStrategies[0],
    debateSimLink: "bhi",
    debriefPrompt:
      "Reflect on the distinction between Israel's calling and Israel's identity. How does Genesis 12:3 ('in you all the families of the earth shall be blessed') reshape the meaning of 'chosen people'? Consider how Ruth, Rahab, and the Canaanite woman demonstrate that faith — not blood — has always been the entry point into God's covenant community. How does Revelation 7:9 (the great multitude from every nation) serve as the ultimate answer to ethnic exclusivity claims?",
  },
  {
    id: "bhi-mod-law-identity",
    subjectId: "bhi-law-identity",
    title: "Module 2: Law Identity Arguments",
    doctrineBrief:
      "BHI theology ties law-keeping to ethnic identity: since the law was given to Israel at Sinai, only Israelites (defined ethnically) are the true law-keepers, and law-keeping proves ethnic Israelite identity. This creates a circular argument: Israel keeps the law, and those who keep the law are Israel — all defined by ethnicity rather than faith. Sabbath-keeping, dietary laws, and feast observance become ethnic markers rather than universal principles. The SDA position is that God's moral law is universal in scope (it was established at Creation, not at Sinai), that the Sabbath was 'made for man' (Mark 2:27 — all humanity), and that the new covenant writes the law on the hearts of all believers regardless of ethnicity (Jer 31:33, Heb 8:10). Law-keeping in the last days identifies the remnant (Rev 12:17), but the remnant is drawn from 'every nation, tribe, language, and people' (Rev 14:6).",
    steelmanArguments: [
      steelmanArguments[1], // Lost sheep
      steelmanArguments[2], // Romans 9 blood
    ],
    hiddenAssumptions: [
      "The law was given exclusively to ethnic Israel, ignoring that the moral law (including Sabbath) existed before Sinai — at Creation itself (Gen 2:2-3)",
      "Law-keeping is an ethnic identifier rather than a faith response to God's character, which is universal",
      "The 'stranger' and 'foreigner' provisions in the Torah (Ex 12:48-49, Num 15:15-16, Isa 56:6-7) do not demonstrate that law-keeping was always open to non-Israelites",
      "Revelation 12:17 and 14:12 describe an ethnically homogeneous group rather than a multi-ethnic remnant",
    ],
    mindGames: [mindGames[1], mindGames[4]], // Selective OT, Hidden knowledge
    fallacies: [fallacies[0], fallacies[2]], // Eisegesis, Genetic fallacy
    counterStrategy: counterStrategies[1],
    debateSimLink: "bhi",
    debriefPrompt:
      "Consider the relationship between Creation, Sinai, and the New Covenant. How does the Sabbath's origin in Genesis 2:2-3 — before any nation existed — undermine the claim that law-keeping is an ethnic marker? Reflect on Isaiah 56:6-7, where God explicitly welcomes foreigners who keep the Sabbath. How does the global SDA church — with members from over 200 countries keeping the same seventh-day Sabbath — serve as a living demonstration that God's law transcends ethnicity?",
  },
  {
    id: "bhi-mod-genealogical-salvation",
    subjectId: "bhi-genealogical-salvation",
    title: "Module 3: Genealogical Salvation",
    doctrineBrief:
      "Perhaps the most consequential claim in BHI theology is that salvation is determined by bloodline — that being a biological descendant of Jacob is either necessary or sufficient for salvation. Some BHI groups teach that only Israelites can be saved; others teach that Israelites have a privileged pathway to salvation that Gentiles lack. This directly contradicts the New Testament's insistence that salvation is by grace through faith (Eph 2:8-9), that God shows no partiality (Acts 10:34-35), and that 'there is no distinction between Jew and Greek; for the same Lord is Lord of all, bestowing his riches on all who call on him' (Rom 10:12). Jesus Himself warned against genealogical presumption (Matt 3:9), and John 1:12-13 explicitly states that becoming God's children happens 'not of blood.' The SDA understanding is that salvation is offered to all humanity through the atoning sacrifice of Christ, received by faith, and evidenced by a transformed life of obedience — with no ethnic prerequisites.",
    steelmanArguments: [
      steelmanArguments[2], // Romans 9 blood
      steelmanArguments[3], // Bible for Black people
    ],
    hiddenAssumptions: [
      "Biological descent from Abraham/Jacob contributes to or guarantees salvation, despite John the Baptist's direct warning against this presumption (Matt 3:9)",
      "John 1:12-13's explicit exclusion of 'blood' as a basis for becoming God's children can be ignored or spiritualized away",
      "The universal language of the gospel — 'whoever believes' (John 3:16), 'everyone who calls' (Rom 10:13), 'all peoples' (Rev 14:6) — can be restricted to mean 'whoever believes within ethnic Israel'",
      "Ruth, Rahab, the Ethiopian eunuch, Cornelius, and the Samaritan woman are exceptions rather than demonstrations of God's universal salvific will",
    ],
    mindGames: [mindGames[2], mindGames[3]], // Oppression rhetoric, Shame and guilt
    fallacies: [fallacies[3], fallacies[1]], // Appeal to emotion, Hasty generalization
    counterStrategy: counterStrategies[2],
    debateSimLink: "bhi",
    debriefPrompt:
      "Meditate on John 1:12-13 — 'to all who did receive him, who believed in his name, he gave the right to become children of God, who were born, not of blood nor of the will of the flesh nor of the will of man, but of God.' How does this single verse dismantle the entire framework of genealogical salvation? Consider the role of Ruth and Rahab in Jesus' genealogy (Matt 1:5) — what does their inclusion tell us about God's view of ethnic boundaries? How would you lovingly communicate the sufficiency of Christ's blood over Abraham's blood to someone deeply invested in ethnic identity theology?",
  },
  {
    id: "bhi-mod-deut28-curses",
    subjectId: "bhi-deut28-curses",
    title: "Module 4: Deuteronomy 28 Curses",
    doctrineBrief:
      "The Deuteronomy 28 argument is the most popular and emotionally compelling claim in BHI evangelism. It asserts that the curses described in Deuteronomy 28:15-68 — slavery, exile, loss of children, servitude to enemies, becoming a byword among nations — uniquely and perfectly describe the African American experience, thereby proving that African Americans are the true descendants of Israel. This argument draws its power from the undeniable historical reality of the transatlantic slave trade and centuries of racial oppression. However, it depends on several exegetical errors: reading the curses as ethnic identifiers rather than covenant consequences, ignoring their documented fulfillment in ancient Israel's captivities, applying a selective literal-figurative hermeneutic (ships are literal, Egypt is figurative), and overlooking that the same curses describe many peoples throughout history. The SDA response must be pastorally sensitive — fully honoring the real suffering while gently correcting the interpretive framework.",
    steelmanArguments: [
      steelmanArguments[0], // Deut 28 curses
      steelmanArguments[4], // Twelve tribes mapped
    ],
    hiddenAssumptions: [
      "Deuteronomy 28's curses function as ethnic identifiers rather than as covenant consequences for a specific historical people who violated a specific historical covenant",
      "The curses were not already fulfilled in documented historical events — the Assyrian exile (722 BC), the Babylonian captivity (586 BC), and the Roman destruction (70 AD)",
      "Only one people group in all of human history matches these curses, when in fact the curses describe generic consequences of military defeat and exile that are tragically common",
      "A selective hermeneutic is acceptable: 'ships' in verse 68 are literal transatlantic slave ships, but 'Egypt' in the same verse is figurative for any land of slavery",
    ],
    mindGames: [mindGames[2], mindGames[0]], // Oppression rhetoric, Identity pressure
    fallacies: [fallacies[1], fallacies[3]], // Hasty generalization, Appeal to emotion
    counterStrategy: counterStrategies[3],
    debateSimLink: "bhi",
    debriefPrompt:
      "This is the most emotionally charged module. Reflect on how to separate compassion from exegesis — how can you fully honor the suffering of the transatlantic slave trade while maintaining interpretive integrity? Practice saying: 'The evil of slavery is undeniable, and it grieves God's heart. But I believe we honor that suffering by getting the theology right, not by building identity on covenant curses.' Consider: how does reading Deuteronomy 28 in its covenant context (looking at chapters 27-30 as a unit) change the interpretation? What does Deuteronomy 30:1-3 — the promise of restoration through repentance — tell us about the chapter's purpose?",
  },
  {
    id: "bhi-mod-anti-gentile",
    subjectId: "bhi-anti-gentile",
    title: "Module 5: Anti-Gentile Theology",
    doctrineBrief:
      "Some BHI groups teach that Gentiles (non-Israelites) are excluded from salvation entirely, while others teach that Gentiles occupy a secondary or servant status in God's kingdom. This anti-Gentile theology draws on Old Testament separation commands (Deut 7:1-6), selected prophetic passages about Israel's future dominion (Isa 14:2, 61:5), and Jesus' reference to the Canaanite woman as a 'dog' (Matt 15:26). It directly contradicts the biblical revelation of God's universal love (John 3:16), the prophetic vision of Gentile inclusion (Isa 49:6, 56:6-7, Mal 1:11), Peter's revelation through Cornelius (Acts 10:34-35), the Jerusalem Council's decision (Acts 15), Paul's entire theology of Jew-Gentile unity in Christ (Eph 2:11-22, Gal 3:28), and the eschatological vision of Revelation (Rev 7:9, 21:3-4). Anti-Gentile theology is not merely an exegetical error — it is a fundamental misunderstanding of God's character and His redemptive purpose for all creation.",
    steelmanArguments: [
      steelmanArguments[5], // Gentiles are dogs
      steelmanArguments[3], // Bible for Black people
    ],
    hiddenAssumptions: [
      "Old Testament separation commands were about ethnic supremacy rather than covenant holiness and the prevention of idolatry (Deut 7:4 gives the reason: 'for they would turn away your sons from following me, to serve other gods')",
      "Jesus' exchange with the Canaanite woman was a statement of permanent Gentile exclusion rather than a test of faith that she passed with commendation (Matt 15:28)",
      "Prophetic passages about Israel's dominion over nations are literal predictions of ethnic rule rather than typological pictures fulfilled in the universal church's spiritual authority",
      "The entire New Testament trajectory of Gentile inclusion — from Pentecost to Cornelius to the Jerusalem Council to Paul's mission — represents a deviation from God's plan rather than its fulfillment",
    ],
    mindGames: [mindGames[1], mindGames[4]], // Selective OT, Hidden knowledge
    fallacies: [fallacies[2], fallacies[0]], // Genetic fallacy, Eisegesis
    counterStrategy: counterStrategies[4],
    debateSimLink: "bhi",
    debriefPrompt:
      "Reflect on the trajectory of Scripture from Genesis 12:3 to Revelation 7:9 — the arc from 'in you all families shall be blessed' to 'a great multitude from every nation.' How does the book of Jonah function as an Old Testament rebuke of anti-Gentile theology? Consider Peter's transformation in Acts 10 — how does his statement 'God shows no partiality' represent the fulfillment of Amos 9:11-12 and Isaiah 49:6? How would you communicate God's universal love to someone who has found identity and dignity in ethnic exclusivity? Remember: the goal is not to strip away identity but to offer a greater identity — children of God by faith, heirs of all God's promises in Christ.",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const bhiTraining: AATSAvatarTraining = {
  avatarId: "bhi",
  avatarName: "The Black Hebrew Israelite",
  emoji: "\u270a", // ✊
  color: "border-yellow-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
