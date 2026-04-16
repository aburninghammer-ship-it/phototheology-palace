import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 50 weapons extracted from Pastor Ivor Myers' apologetics transcripts
const ARSENAL_WEAPONS = [
  {
    name: "The Statue Equation",
    subtitle: "2,600 years of world history foretold in one dream",
    topic: "Prophecy",
    argument: `Daniel chapter 2 records a dream given to King Nebuchadnezzar in the 6th century BC. In the dream, a great statue appears: head of gold, chest and arms of silver, belly and thighs of brass, legs of iron, and feet of iron mixed with clay. The prophet Daniel explains that these metals represent a succession of world empires. The head of gold is Babylon (Daniel 2:38). A kingdom of silver would follow — history confirms this was Medo-Persia, which conquered Babylon in 539 BC. A third kingdom of brass — Greece under Alexander the Great, which overthrew Persia in 331 BC. A fourth kingdom of iron — Rome, which subjugated Greece by 168 BC and ruled the known world. Daniel then prophesied that this fourth kingdom would NOT be overthrown by a fifth empire, but would be DIVIDED into smaller kingdoms, represented by the feet of iron and clay. This is exactly what happened: Rome fell by 476 AD and was divided into the nations of modern Europe — France, Germany, England, Spain, Italy, and others. Furthermore, Daniel 2:43 says these divided kingdoms would 'not cleave one to another, even as iron is not mixed with clay.' Throughout history, every attempt to reunite Europe has failed — Charlemagne, Napoleon, Kaiser Wilhelm, Hitler — all tried and all failed, exactly as prophesied. Whether you date Daniel to the 6th century BC or the skeptical 2nd century BC, the prophecy still accurately predicts Rome's division (completed 476 AD) and the permanent disunity of European nations — events that continue to this day, over 2,000 years later. No other holy book contains this caliber of verifiable, historically fulfilled prophecy spanning millennia.`,
    analysis: "STRENGTHS: Uses the Daniel 2 prophecy as a clear entry-point argument. The fulfilled succession of empires (Babylon → Medo-Persia → Greece → Rome → divided Europe) is historically verifiable through secular sources. The point about Europe's permanent disunity despite repeated attempts at reunification is especially powerful. Concedes the skeptical dating (2nd century BC) and shows the prophecy still holds. WEAKNESSES TO SHORE UP: A skeptic may argue Daniel was written after these events (vaticinium ex eventu). Counter: even the skeptical dating still fails to explain Rome's division and Europe's continued disunity. KEY SCRIPTURES: Daniel 2:37-43. RATING: 9/10 — This is an excellent opening argument that establishes the mathematical precision of biblical prophecy.",
  },
  {
    name: "The Noah Equation",
    subtitle: "God's prophetic pattern: prophet + time period + sign",
    topic: "Prophecy",
    argument: `The Bible reveals a divine pattern for authenticating true prophets: God gives a prophet, assigns a specific TIME PERIOD, and provides a verifiable SIGN at the end of that period. Noah received a 120-year prophecy (Genesis 6:3). At the end of the 120 years, the flood came exactly on schedule. Abraham received a 400-year prophecy regarding his descendants (Genesis 15:13). The children of Israel were in Egypt for exactly 400 years before their deliverance. Moses arrived at precisely the right moment — the fulfillment of that 400-year countdown. This pattern is God's mathematical signature. It separates the true God from every false god and every false prophet. Isaiah 46:9-10 declares: 'I am God, and there is none like me, declaring the end from the beginning, and from ancient times the things that are not yet done.' And Isaiah 41:21-23 issues the challenge: 'Produce your cause, saith the Lord; bring forth your strong reasons... show the things that are to come hereafter, that we may know that ye are gods.' The test is not miracles, feelings, or moral improvement — it is PROPHECY with MATHEMATICAL PRECISION. Any religion or prophet claiming divine authority must demonstrate this same prophetic-mathematical pattern: a specific time period given in advance, a verifiable starting date, and a confirmed fulfillment. If the math does not work, the claim does not hold.`,
    analysis: "STRENGTHS: Establishes the foundational prophetic pattern that all other weapons build upon. The challenge from Isaiah 41 and 46 is devastating to competing religious claims. The mathematical precision requirement eliminates vague or post-hoc prophecy. WEAKNESSES TO SHORE UP: Some may argue that the 120-year and 400-year periods are round numbers, not precise timestamps. Counter: round or not, they were given IN ADVANCE and fulfilled historically. KEY SCRIPTURES: Genesis 6:3, Genesis 15:13, Isaiah 41:21-23, Isaiah 46:9-10. RATING: 9/10 — Foundation-level argument that sets up the entire mathematical apologetics framework.",
  },
  {
    name: "The 70-Week Precision Strike",
    subtitle: "Daniel pinpointed Christ's baptism 500 years in advance",
    topic: "Prophecy",
    argument: `Daniel 9:24-27 contains the most mathematically precise Messianic prophecy in the Bible. The angel Gabriel tells Daniel that 'seventy weeks are determined upon thy people' — using the day-for-a-year principle (Numbers 14:34, Ezekiel 4:6), this equals 490 years. The starting point is given: 'from the going forth of the commandment to restore and to build Jerusalem' — the decree of Artaxerxes in 457 BC (Ezra 7). From this decree, 69 weeks (483 years) would pass until 'Messiah the Prince.' Counting 483 years from 457 BC brings us to exactly 27 AD — the year Jesus was baptized and began His public ministry. The prophecy continues: 'in the midst of the week he shall cause the sacrifice and the oblation to cease' — Jesus was crucified in 31 AD, exactly 3.5 years into the final prophetic week, causing the sacrificial system to meet its fulfillment. This prophecy was written approximately 500 years before Christ and pinpoints His arrival to the EXACT YEAR. No other religious text in human history contains a prophecy of this mathematical precision verified by secular chronology.`,
    analysis: "STRENGTHS: The mathematical precision is undeniable — 457 BC + 483 years = 27 AD. The decree of Artaxerxes is historically verifiable. The crucifixion in 31 AD (midst of the week) adds another layer of precision. WEAKNESSES TO SHORE UP: The 457 BC date requires explaining why this decree rather than the earlier ones (538 BC, 520 BC). Counter: only Artaxerxes' decree in Ezra 7 explicitly authorizes REBUILDING the city with self-governance. KEY SCRIPTURES: Daniel 9:24-27, Ezra 7, Numbers 14:34, Ezekiel 4:6. RATING: 10/10 — The crown jewel of prophetic apologetics.",
  },
  {
    name: "The Quran's Missing Timestamp",
    subtitle: "No biblical time prophecy points to Muhammad's arrival in 610 AD",
    topic: "Prophecy",
    argument: `Muslims claim Muhammad is prophesied in the Bible, citing Deuteronomy 18:18 (a prophet like Moses), Isaiah 42:1-6 (God's servant), and Malachi 3:1 (the messenger of the covenant). However, all three passages describe someone who will CONFIRM A COVENANT. What made Moses unique was not his miracles or background — it was that he served as MEDIATOR OF A COVENANT, sprinkling blood on the people (Exodus 24:5-8). Isaiah 42:6 says this coming one would be 'a covenant of the people, a light to the Gentiles.' Malachi 3:1 calls him 'the messenger of the covenant.' Daniel 9:27 provides the TIMESTAMP: 'He shall confirm the covenant with many for one week.' The 70-week prophecy pinpoints WHEN this covenant-confirmer arrives: 483 years after the decree to rebuild Jerusalem (457 BC) = 27 AD. Jesus at the Last Supper said: 'This is my blood of the new covenant, shed for many' (Matthew 26:28). The challenge for Muslims: demonstrate how Muhammad, appearing in 610 AD, fits within Daniel's 70-week (490-year) prophecy. If Muhammad is the prophet of Deuteronomy 18, the servant of Isaiah 42, and the messenger of Malachi 3, then he must be connected to Daniel's timestamp. Show us the math.`,
    analysis: "STRENGTHS: Turns the Muslim proof-texts back on themselves by identifying the common thread — covenant mediation — and connecting it to Daniel's timestamp. The mathematical challenge is clear and specific. WEAKNESSES TO SHORE UP: Muslims may argue Daniel's prophecy is about another figure. Counter: Daniel 9:26 says 'Messiah shall be cut off' — Muhammad was not 'cut off' (killed as a sacrifice). KEY SCRIPTURES: Deuteronomy 18:18, Isaiah 42:6, Malachi 3:1, Daniel 9:24-27, Exodus 24:5-8, Matthew 26:28. RATING: 9/10 — Devastating mathematical challenge to Islamic claims.",
  },
  {
    name: "The Mormon Timestamp Gap",
    subtitle: "No prophetic math chain connects to Joseph Smith in 1823",
    topic: "Prophecy",
    argument: `Every authentic biblical prophet is connected to a mathematical chain of time prophecies. Noah had the 120-year countdown. Moses arrived at the fulfillment of the 400-year prophecy. Daniel confirmed the 70-year prophecy and gave the 490-year prophecy. Jesus arrived at the precise year (27 AD) that Daniel's 69 weeks pointed to. Every book of the Bible was written by someone who fulfilled a prophetic timestamp. The challenge for Mormons: show us the time prophecy that points to 1823 (when Joseph Smith claims to have received the golden plates). If God provided timestamps for all the 'lesser' prophets, it is inconceivable that God would fail to provide one for this supposedly greater final prophet. Where in Daniel or Revelation is there a time prophecy that terminates in 1823? There is none. As Galatians 1:8 warns: 'Though we, or an angel from heaven, preach any other gospel unto you than that which we have preached unto you, let him be accursed.' Even angelic visitations do not override the mathematical chain.`,
    analysis: "STRENGTHS: Applies the same mathematical standard established in the Noah Equation to Mormonism. The Galatians 1:8 reference directly addresses the angel Moroni claim. WEAKNESSES TO SHORE UP: Mormons may say their prophecy comes from the Book of Mormon itself. Counter: the Book of Mormon must still be validated by BIBLICAL prophecy to be considered authoritative. KEY SCRIPTURES: Galatians 1:8, Genesis 6:3, Genesis 15:13, Daniel 9:24-27. RATING: 8/10 — Clean, logical application of the prophetic chain principle.",
  },
  {
    name: "The JW Day-Year Contradiction",
    subtitle: "Jehovah's Witnesses apply the day-year rule inconsistently to force 1914",
    topic: "Prophecy",
    argument: `Jehovah's Witnesses base their entire prophetic system on Daniel 4's 'seven times' about Nebuchadnezzar's madness. They take 2,520 days (7 years x 360 days/year), apply the day-for-a-year principle, and reach 2,520 years. Starting from 607 BC, they arrive at 1914 AD. Three devastating problems: PROBLEM 1: The 2,520 days were about a specific individual (Nebuchadnezzar), not a symbolic timeline. Daniel 4:22 explicitly says the tree represents Nebuchadnezzar. When a time prophecy is connected to a living person, it is literal. PROBLEM 2: Their starting date of 607 BC is historically wrong. Every secular source places Jerusalem's destruction at 586-587 BC, not 607 BC. They chose 607 because it is the ONLY date that produces 1914. PROBLEM 3 (fatal): In their own book 'Pay Attention to Daniel's Prophecy,' their chart shows the seven times treated as day-for-a-year (= 2,520 years), but the 1,260 days of Daniel 7:25 treated as LITERAL (= 3.5 years, 1914-1918). Why? Because 1,260 years would not fit their movement. The one prophecy that IS literal (Nebuchadnezzar's madness) they make symbolic. Every prophecy that IS symbolic they make literal. The inconsistency is mathematically fatal.`,
    analysis: "STRENGTHS: Uses their own publications against them. The three-pronged attack (wrong individual, wrong date, inconsistent rules) is devastating. The chart from their own book is irrefutable evidence. WEAKNESSES TO SHORE UP: JWs will insist the tree has a secondary application. Counter: show where in Daniel the text says 'this also applies to...' — it doesn't. KEY SCRIPTURES: Daniel 4:22, Daniel 7:25, Jeremiah 25:11. RATING: 10/10 — Their own chart destroys their system.",
  },
  {
    name: "The JW 607 BC Problem",
    subtitle: "The wrong starting date guarantees the wrong answer",
    topic: "Prophecy",
    argument: `The entire JW prophetic system depends on Jerusalem being destroyed in 607 BC. From 607 BC + 2,520 years = 1914 AD. But every credible historical source — Babylonian chronicles, astronomical diaries, and archaeological evidence — places the destruction in 586-587 BC, not 607 BC. The Watchtower acknowledges this is based on 'Bible information' rather than historical evidence, meaning they work backward from their desired conclusion (1914) to determine the starting date (607 BC). This is writing the answer first and working backward to find the equation. If you use the historically verified 586 BC, the calculation yields 1935 AD — a year with no JW significance. When your math equation has the wrong starting number, the wrong formula, and the wrong interpretation, the answer cannot be correct.`,
    analysis: "STRENGTHS: Simple, devastating argument. The mathematical logic is inescapable — wrong starting date = wrong answer. The admission from their own literature that they prioritize 'Bible information' over historical evidence is damning. RATING: 9/10 — Clean mathematical knockout.",
  },
  {
    name: "The Hebrew Israelite 400-Year Disconnect",
    subtitle: "The 400-year prophecy was never connected to the Deuteronomy 28 curses",
    topic: "Prophecy",
    argument: `Hebrew Israelites claim the transatlantic slave trade fulfills Genesis 15:13's 400-year prophecy. Four mathematical problems: PROBLEM 1 (400 ≠ curses): The 400-year prophecy was fulfilled in Egypt, BEFORE Deuteronomy 28's curses were given. The sequence: Genesis (prophecy given) → Exodus (fulfilled) → Deuteronomy 28 (curses given AFTER). PROBLEM 2 (70 ≠ 400): The Deuteronomy 28 curses pointed to Babylonian captivity — 70 years (Jeremiah 25:11), not 400. Daniel 9:11 explicitly links the curses to Babylon. PROBLEM 3 (400 ≠ 800): There is ONE 400-year prophecy. Adding a second 400 for the slave trade = 800. God said 400, not 800. PROBLEM 4 (1260 = X): Revelation 12:6,14 identifies end-time Israel with a 1,260-day prophetic period. During this period, the woman is PROTECTED, not cursed. Hebrew Israelites must show their beginning and ending dates for this 1,260 and their movement's connection to it.`,
    analysis: "STRENGTHS: Four interlocking mathematical problems that build on each other. The chronological sequence (400 before curses, 70 connected to curses) is irrefutable. The 400 ≠ 800 argument is devastatingly simple. RATING: 10/10 — Comprehensive mathematical demolition.",
  },
  {
    name: "The Revelation 12 Woman Test",
    subtitle: "End-time Israel identified by 1,260 years, not 400",
    topic: "Prophecy",
    argument: `Revelation 12 provides the New Testament identification marker for God's true people. After Christ's ascension (verse 5), the 'woman' (now representing the New Testament church) fled into the wilderness for 1,260 prophetic days — 1,260 years using the day-for-a-year principle. During this period, the woman is NOURISHED and PROTECTED by God, not cursed. This is the timestamp that identifies true end-time Israel. Any group claiming to be true Israel must demonstrate: (1) How their movement connects to this 1,260-year period, (2) Beginning and ending dates, (3) How they were in the 'wilderness,' (4) How the 'earth' helped them (verse 16). The number is NOT 400 (fulfilled in Egypt), NOT 70 (fulfilled in Babylon). The identifying number is 1,260.`,
    analysis: "STRENGTHS: Shifts the entire conversation from the Hebrew Israelite framework (400 years) to the biblical framework (1,260 years). The four-point test is clear and specific. RATING: 9/10 — Excellent companion to the 400-Year Disconnect.",
  },
  {
    name: "The Prophecy Replicability Test",
    subtitle: "No other holy book contains verifiable mathematical prophecy",
    topic: "Prophecy",
    argument: `God Himself issues the challenge in Isaiah 41:21-23: 'Produce your cause, saith the Lord; bring forth your strong reasons... show the things that are to come hereafter, that we may know that ye are gods.' Find in ANY other holy book prophecy with: (1) Specific sequence of world empires named in advance, (2) Mathematical timestamps from verifiable dates, (3) Fulfillment verified by SECULAR historical sources, (4) Scope of several hundred years between prophecy and fulfillment. The Bible provides: Daniel 2 (four empires + division = 2,600 years), Daniel 9 (490-year prophecy pinpointing Messiah to 27 AD), Revelation 13 (rise of a lamb-like nation in late 1700s = America). All verified by secular history. The Quran offers no mathematical time prophecies verified by external history. The Book of Mormon offers none either. As Isaiah 46:9-10 declares: 'I am God, and there is none like me, declaring the end from the beginning.' Show us the math from any other source.`,
    analysis: "STRENGTHS: The universal challenge — replicability — is the gold standard of evidence. The comparison across religions is fair and devastating. RATING: 10/10 — The ultimate meta-argument for biblical uniqueness.",
  },
  {
    name: "The Four-Headed Leopard",
    subtitle: "Daniel predicted Greece's four-way split centuries in advance",
    topic: "Prophecy",
    argument: `Daniel 7:6 describes the third beast (Greece) as a leopard with FOUR HEADS. Daniel 8:8 adds: the great horn (Alexander) was broken, and four notable ones came up. History confirms: Alexander died in 323 BC and his empire was divided among four generals: Cassander (Macedonia), Lysimachus (Thrace), Ptolemy (Egypt), and Seleucus (Syria). Not three, not five — exactly four. Even using the skeptical 2nd century BC dating, the fourth beast (Rome) still extends centuries beyond Daniel's time. How does any writer, even as late as 165 BC, accurately predict Rome's rise, its iron-like character, and its division — events not complete until 476 AD, over 600 years later?`,
    analysis: "STRENGTHS: The specificity of 'four' is undeniable. The skeptical-dating concession still leaves centuries of unfulfilled prophecy. RATING: 9/10 — Simple but devastating.",
  },
  {
    name: "The Covenant Mediator Test",
    subtitle: "The prophet like Moses must mediate a covenant — only Jesus qualifies",
    topic: "Prophecy",
    argument: `Muslims and Mormons both claim Deuteronomy 18:18 ('a prophet like Moses'). But what made Moses unique? Deuteronomy 5:27 — he stood BETWEEN the people and God as MEDIATOR. In Exodus 24:5-8, Moses sprinkled the blood of the covenant. No other OT prophet did this. Isaiah 42:6 says the coming one would be 'a covenant of the people.' Malachi 3:1 calls him 'the messenger of the covenant.' Daniel 9:27: 'He shall confirm the covenant.' Jesus at the Last Supper: 'This is my blood of the new covenant' (Matthew 26:28). He confirmed it within Daniel's 70-week timeline. Neither Muhammad nor Joseph Smith mediated a covenant or fit Daniel's timestamp. Only Jesus qualifies on both counts.`,
    analysis: "STRENGTHS: Identifies the ONE defining characteristic of Moses (covenant mediation) that both claimants lack. Links three separate proof-texts to Daniel's timeline. RATING: 9/10.",
  },
  {
    name: "The Iron Will Analogy",
    subtitle: "If 19 of 20 predictions came true, would you bet against the 20th?",
    topic: "Second Coming",
    argument: `Imagine a stranger tells you 20 things that will happen tomorrow. You dismiss him as crazy. But the next morning, prediction after prediction comes true — the dog, the doves, the three-minute rain, the rainbow. By prediction 15, you are rearranging your life. By prediction 19, you are certain #20 is coming. Now consider: Daniel 2 foretold Babylon, Medo-Persia, Greece, Rome, and Europe's division — fulfilled. Daniel 7 foretold 1,260 years of papal supremacy — fulfilled (538-1798). Daniel 9 pinpointed the Messiah to 27 AD — fulfilled. Revelation 13 foretold a lamb-like nation rising in the late 1700s — fulfilled (America). The final prediction: the Second Coming (the stone of Daniel 2). If every preceding prophecy has been fulfilled with mathematical precision across thousands of years, what are the odds the last one won't? Only a fool bets against the 20th prediction.`,
    analysis: "STRENGTHS: The analogy is immediately accessible. The cumulative weight of fulfilled prophecy makes the conclusion almost irresistible. RATING: 10/10 — Perfect closing argument.",
  },
  {
    name: "The Deadly Wound and Revival",
    subtitle: "The papacy lost and regained global influence exactly as prophesied",
    topic: "The Papacy / Antichrist",
    argument: `Revelation 13:3 prophesies: 'I saw one of his heads as it were wounded to death; and his deadly wound was healed: and all the world wondered after the beast.' The 'deadly wound' was inflicted in 1798 when Napoleon's General Berthier took the Pope prisoner, ending 1,260 years of papal temporal power. But the wound was healed: the 1929 Lateran Treaty restored Vatican sovereignty. Today the Pope addresses the United Nations, meets world leaders, and maintains diplomatic relations with virtually every nation. 'All the world wondered after the beast.' The trajectory — supreme power, deadly wound, global recovery — matches precisely.`,
    analysis: "STRENGTHS: The 1798 wound and 1929 healing are historically verifiable. The current global influence of the papacy is undeniable. RATING: 9/10.",
  },
  {
    name: "The Deuteronomy 28 Babylon Fulfillment",
    subtitle: "Every curse was fulfilled in Babylonian captivity, verse by verse",
    topic: "Prophecy",
    argument: `Deuteronomy 28:36 — 'The Lord shall bring thee and thy king unto a nation.' Fulfilled: 2 Kings 24:15 — King Jehoiachin carried to Babylon. Deuteronomy 28:48 — 'He shall put a yoke of iron upon thy neck.' Fulfilled: Jeremiah 28:14 — 'I have put a yoke of iron upon the neck of all these nations.' Deuteronomy 28:49 — 'A nation from far, swift as the eagle.' Fulfilled: Daniel 7:4 — Babylon described with eagle's wings. Deuteronomy 28:50 — 'A nation of fierce countenance, no compassion on young or old.' Fulfilled: 2 Chronicles 36:17. Deuteronomy 28:52 — 'He shall besiege thee in all thy gates.' Fulfilled: 2 Kings 24:10-11. Deuteronomy 28:68 — 'Bring thee into EGYPT again with ships.' NOTE: It says Egypt, NOT America. Fulfilled: Jeremiah 44:12. Every single curse has documented fulfillment in the Babylonian period.`,
    analysis: "STRENGTHS: Verse-by-verse matching with historical fulfillment is devastating. The Egypt vs. America distinction in 28:68 is the clincher. RATING: 10/10.",
  },
  {
    name: "The Hellfire Extinguisher",
    subtitle: "Biblical fire destroys completely — it does not preserve",
    topic: "Hellfire / Annihilationism",
    argument: `Malachi 4:1-3 says the wicked 'shall be stubble: and the day that cometh shall burn them up... that it shall leave them neither root nor branch' and 'ye shall tread down the wicked; for they shall be ASHES under the soles of your feet.' Ashes — not living, screaming beings. Ezekiel 28:18-19 describes Satan's end: 'I will bring thee to ASHES upon the earth... thou shalt be a terror, and NEVER SHALT THOU BE ANY MORE.' If Satan himself ceases to exist, how can the wicked burn forever? Psalm 37:20 says: 'The wicked shall perish... they shall consume; into smoke shall they consume away.' Obadiah 1:16: 'They shall be as though they had not been.' Matthew 10:28: 'Fear him which is able to DESTROY both soul and body in hell.' The Greek word 'apollumi' means to destroy utterly, not to preserve in torment. The Bible's fire CONSUMES. It does not preserve.`,
    analysis: "STRENGTHS: Seven scriptures from both Testaments all pointing to complete destruction, not preservation. The Satan argument (if he ceases to exist, so do the wicked) is logically inescapable. The Greek word study seals it. RATING: 10/10.",
  },
  {
    name: "The Wage Audit",
    subtitle: "If the wages of sin is eternal torment, Jesus didn't pay it",
    topic: "Hellfire / Annihilationism",
    argument: `Romans 6:23 says: 'The wages of sin is DEATH, but the gift of God is eternal life.' Not eternal torment — death. If the penalty for sin were eternal conscious torment, then for Jesus to pay that penalty, He would need to be eternally tormented. But He is not — He died and rose again. If Jesus paid the penalty in full, and the penalty is death (not eternal torment), then the doctrine of eternal hellfire contradicts the atonement itself. Furthermore, the contrast in Romans 6:23 is between DEATH and ETERNAL LIFE — implying the wicked do NOT have eternal life in any form, even in hell. Only the righteous receive eternal life. The wicked receive death — cessation of existence.`,
    analysis: "STRENGTHS: The logic is airtight. If eternal torment is the penalty, Jesus didn't pay it. If Jesus DID pay it (death), then death is the penalty, not torment. The eternal life contrast clinches it. RATING: 10/10 — One of the most devastating single-verse arguments in all of theology.",
  },
  {
    name: "The Grave Equalizer",
    subtitle: "Hell (Sheol) is the grave where all go, not a burning place",
    topic: "Hellfire / Annihilationism",
    argument: `In the Old Testament, the Hebrew word 'Sheol' is translated as both 'hell' and 'grave.' Genesis 37:35 records Jacob saying he would go down to Sheol mourning for Joseph. Was Jacob expecting to go to a burning hell? No — Sheol simply means the grave. Psalm 16:10: 'Thou wilt not leave my soul in hell [Sheol]' — a prophecy about Jesus being in the GRAVE, not in a burning hell. Acts 2:27 confirms this Messianic interpretation. In the New Testament, the Greek word 'Hades' likewise means 'the unseen' or the grave. In Revelation 20:14, 'death and hell [Hades] were cast into the lake of fire' — the grave itself is destroyed. If hell were already a place of eternal burning, why would it need to be cast into another fire? The grave is temporary. The lake of fire is the second death — final destruction, not eternal preservation.`,
    analysis: "STRENGTHS: The word study from Hebrew and Greek demolishes the popular concept. Jacob going to Sheol and Jesus being in Sheol prove it means the grave. Revelation 20:14 is the killshot. RATING: 9/10.",
  },
  {
    name: "The Fireproof Shield",
    subtitle: "Isaiah says the RIGHTEOUS dwell in everlasting fire",
    topic: "Hellfire / Annihilationism",
    argument: `Isaiah 33:14-16 asks: 'Who among us shall dwell with the devouring fire? Who among us shall dwell with everlasting burnings?' The answer is NOT the wicked — it is the RIGHTEOUS: 'He that walketh righteously, and speaketh uprightly... he shall dwell on high.' God Himself is described as 'a consuming fire' (Deuteronomy 4:24, Hebrews 12:29). When Moses saw the burning bush, it burned but was not consumed — because God's fire does not destroy the righteous. The everlasting fire is God's own presence. The righteous CAN dwell in it; the wicked CANNOT survive it. This is why the wicked are 'consumed' and become 'ashes' — not because they burn forever, but because they cannot withstand God's glory.`,
    analysis: "STRENGTHS: Completely flips the conventional understanding. The Isaiah passage is rarely cited and devastating. The burning bush parallel is brilliant. RATING: 9/10.",
  },
  {
    name: "The Demon's Confession",
    subtitle: "Demons in Matthew 8:29 confess hellfire is FUTURE",
    topic: "Hellfire / Annihilationism",
    argument: `In Matthew 8:29, the demons possessing two men cried out to Jesus: 'Art thou come hither to torment us BEFORE THE TIME?' The demons themselves confess that their torment is FUTURE — 'before the time.' If hell were already burning, why would demons fear a future torment? They would already be experiencing it. The 'time' they reference is the final judgment described in Revelation 20:10 — the lake of fire at the END of the millennium. Until that point, the wicked dead are simply dead in their graves, awaiting resurrection and judgment (John 5:28-29). There is no present hell burning right now. Even the demons know this.`,
    analysis: "STRENGTHS: Using the demons' own words against the doctrine of present hellfire is irrefutable. 'Before the time' proves the torment is future. RATING: 9/10.",
  },
  {
    name: "The Serpent's First Lie",
    subtitle: "The immortal soul doctrine originated with Satan in Eden",
    topic: "State of the Dead",
    argument: `God told Adam in Genesis 2:17: 'In the day that thou eatest thereof thou shalt surely DIE.' The serpent replied in Genesis 3:4: 'Ye shall NOT surely die.' This is the first lie ever recorded in Scripture — the claim that humans do not truly die. The doctrine of the immortal soul is built on this same lie: that when you die, you don't really die; you continue living in another form (heaven, hell, purgatory). But 1 Timothy 6:15-16 says God 'ONLY hath immortality.' Humans do not inherently possess immortality — it is a gift given to the righteous at the resurrection (1 Corinthians 15:53-54): 'This mortal must put on immortality.' If we already had immortality, why would we need to 'put it on'? The doctrine of the naturally immortal soul comes from Greek philosophy (Plato), not from Scripture. It entered Christianity through the same door it entered Eden — the serpent's lie.`,
    analysis: "STRENGTHS: Tracing the doctrine back to Genesis 3:4 is powerful. The 1 Timothy 6:15-16 text is decisive — ONLY God has immortality. The Platonic origin point is historically verifiable. RATING: 10/10.",
  },
  {
    name: "The Empty Tomb Proof",
    subtitle: "Bodies in graves prove the dead are not in heaven",
    topic: "State of the Dead",
    argument: `If the righteous go to heaven immediately at death, why are their bodies still in the grave? Acts 2:29 says of David: 'He is both dead and buried, and his sepulchre is with us unto this day.' Verse 34 adds: 'David is NOT ascended into the heavens.' David — a man after God's own heart — is not in heaven. He is in his grave, waiting for the resurrection. John 5:28-29 confirms: 'The hour is coming, in the which ALL that are in the graves shall hear his voice, and shall come forth.' If they were already in heaven, why would they need to come forth from the graves? 1 Thessalonians 4:16-17 describes the resurrection: 'The dead in Christ shall rise FIRST: then we which are alive and remain shall be caught up together with them.' If the dead were already with Christ in heaven, this resurrection would be pointless.`,
    analysis: "STRENGTHS: David's example is devastating — Acts explicitly says he is NOT in heaven. The logical argument (why resurrect people already in heaven?) is irrefutable. RATING: 10/10.",
  },
  {
    name: "The Parable Decoder",
    subtitle: "Lazarus and the rich man is a parable, not literal theology",
    topic: "State of the Dead",
    argument: `Luke 16:19-31 (Lazarus and the rich man) is the primary text used to support conscious existence after death. But context proves it is a parable: (1) It appears in a sequence of parables — the lost sheep (15:3), the lost coin (15:8), the prodigal son (15:11), the unjust steward (16:1), and then Lazarus (16:19). Jesus was teaching in parables throughout this section. (2) If taken literally, it contradicts the rest of Scripture: the saved would be in 'Abraham's bosom' (not heaven), the lost would be in 'flames' (not the lake of fire, which comes after the millennium), and Abraham could converse with those in torment across a chasm. (3) The rich man has a tongue, Lazarus has a finger, Abraham has a bosom — are these literal body parts in a disembodied afterlife? (4) We do not build doctrine on parables. Jesus used the common Jewish folk beliefs of the Pharisees (who adopted the Greek immortal soul concept) to make a point about the LIVING — not to teach theology about the dead.`,
    analysis: "STRENGTHS: The parable-sequence argument is strong. The literal-interpretation contradictions expose the absurdity. The Pharisaic folk-belief origin is historically accurate. RATING: 9/10.",
  },
  {
    name: "The Prohibition Proof",
    subtitle: "God forbids speaking to the dead because the dead ARE dead",
    topic: "State of the Dead",
    argument: `Deuteronomy 18:10-12 strictly prohibits consulting with 'familiar spirits.' If the dead were alive in heaven, why would God prohibit us from speaking to them? We can pray to Jesus in heaven. Angels communicate with us. God places no prohibition on contact with living heavenly beings. But He strictly forbids contact with the dead. Why? Because the dead are NOT alive (Ecclesiastes 9:5: 'The dead know not any thing'; Psalm 146:4: 'His thoughts perish'). Any 'spirit' appearing as a deceased loved one is a demon impersonating them — hence 'familiar spirits,' demons FAMILIAR with the deceased. This is why the immortal soul doctrine is dangerous: if you believe the dead are alive, you become vulnerable to demonic impersonation.`,
    analysis: "STRENGTHS: The logic is airtight — if the dead were alive, why forbid contact? The 'familiar spirits' etymology explanation is brilliant. RATING: 9/10.",
  },
  {
    name: "The Azazel Exposer",
    subtitle: "Azazel is identified as a demon by every major reference source",
    topic: "Sanctuary",
    argument: `In Leviticus 16, two goats are presented on the Day of Atonement. One is 'for the LORD' (sacrificed) and one is 'for Azazel' (sent into the wilderness). Critics claim Azazel must represent Jesus. But who is Azazel? Encyclopaedia Britannica identifies Azazel as 'a demonic figure.' The Jewish Encyclopedia says Azazel is 'the chief of the se'irim, or goat-demons.' Origen (early church father, 3rd century) wrote that Azazel was 'the evil spirit.' The Book of Enoch (pre-Christian Jewish text) names Azazel as a fallen angel who corrupted humanity. Even AI language models, when asked without theological bias, identify Azazel as a demonic figure. The goat for the LORD is sacrificed — it represents Christ's atoning death. The goat for Azazel is NOT sacrificed — it receives the confessed sins placed upon it and is banished. This represents Satan bearing the ultimate responsibility for sin, not as a savior, but as the instigator who must face final justice.`,
    analysis: "STRENGTHS: Multiple independent sources (encyclopedia, Jewish texts, church fathers, even AI) all agree Azazel is demonic. The contrast between sacrificed (LORD's goat) and unsacrificed (Azazel's goat) is key. RATING: 10/10.",
  },
  {
    name: "The Lot Splitter",
    subtitle: "Casting lots proves two different entities with different destinies",
    topic: "Sanctuary",
    argument: `In Leviticus 16:8, Aaron casts lots upon the two goats — 'one lot for the LORD, and the other lot for Azazel.' The purpose of casting lots is to distinguish between TWO DIFFERENT THINGS. You do not cast lots to determine two aspects of the same entity. If both goats represented Jesus, there would be no need for lots — they would be the same. The lot creates a binary distinction: FOR the LORD vs. FOR Azazel. One represents Christ (sacrificed, blood applied in the sanctuary). The other represents the adversary (not sacrificed, sent away bearing sins). Two different lots, two different destinations, two different entities.`,
    analysis: "STRENGTHS: The logic is clean and simple. Lots distinguish, by definition, between different things. RATING: 9/10.",
  },
  {
    name: "The Escape Goat Etymology",
    subtitle: "The word scapegoat means 'escape goat' not 'innocent victim'",
    topic: "Sanctuary",
    argument: `Critics argue the scapegoat must represent Jesus because a scapegoat is 'an innocent victim bearing others' blame.' But William Tyndale coined this English word in 1530 — it literally meant 'escape-goat,' the goat that ESCAPED death. The modern connotation didn't develop until the 19th century. The Hebrew 'Azazel' (az + azal) means 'goat of failure/departure.' The root 'azal' in Job 14:11 means 'fail' or 'disappear.' How is Jesus the 'goat of failure'? Isaiah 42:4 says of Christ: 'He shall NOT fail.' But Ezekiel 28:18-19 says of Satan: 'Never shalt thou be any more.' Satan is the one who fails, disappears, ceases to exist. The Hebrew fits Satan perfectly and contradicts Christ.`,
    analysis: "STRENGTHS: The Tyndale etymology is historically verifiable. The Hebrew word study (azal = fail/disappear) is devastating when applied to Christ vs. Satan. RATING: 9/10.",
  },
  {
    name: "The KTS Boomerang",
    subtitle: "All 5 anti-Ellen-White arguments are used by atheists against the Bible",
    topic: "General",
    argument: `Five arguments are repeatedly used to discredit Ellen White: (1) She plagiarized — she used material from other authors. (2) She made false prophecies — predictions that didn't come true. (3) Her writings contain contradictions. (4) She made hard/controversial statements. (5) She must be a false prophet. Here is the 'Keep That Same Energy' (KTS) challenge: apply EVERY ONE of these arguments to the Bible. Plagiarism? Critics claim Genesis borrowed from Gilgamesh, Proverbs from Amenemope, the law from Hammurabi. Failed prophecy? Skeptics cite Ezekiel's Tyre prophecy and Jonah's Nineveh warning. Contradictions? The number differences between Samuel and Chronicles, the genealogy differences between Matthew and Luke. Hard sayings? God commanding Israel to destroy nations (1 Samuel 15). False prophets? Atheists call Moses, Isaiah, and Jeremiah false prophets. If these arguments destroy Ellen White's credibility, they must also destroy the Bible's. But you won't discard the Bible — which means the METHOD of attack is flawed, not the target.`,
    analysis: "STRENGTHS: Forces intellectual consistency. Every critic must choose: apply these standards to all, or apply them to none. RATING: 10/10 — The master argument for defending Ellen White.",
  },
  {
    name: "The Deity Fortress",
    subtitle: "Adventists affirm Christ's full deity — documented proof",
    topic: "The Trinity",
    argument: `SDA Fundamental Belief #4: 'God the eternal Son became incarnate in Jesus Christ. Through Him all things were created... Forever truly God, He became also truly human.' Ellen White wrote: 'In Christ is life, original, unborrowed, underived.' She called Him 'the pre-existent, self-existent Son of God' and 'equal with God, infinite and omnipotent.' Even the Clear Word (which critics attack) says in John 1:1: 'The Word was FULLY God.' The claim that Adventists deny Christ's deity is flatly contradicted by official theology and Ellen White's own writings.`,
    analysis: "STRENGTHS: Direct quotes from Fundamental Beliefs AND Ellen White leave no room for misrepresentation. The Clear Word quote pre-empts that line of attack. RATING: 9/10.",
  },
  {
    name: "The Michael Mantle",
    subtitle: "Calvin, Spurgeon, Gill, and Matthew Henry all identified Michael as Christ",
    topic: "The Trinity",
    argument: `Critics call Adventists a cult for identifying Michael the Archangel as Jesus. But John Calvin wrote about Daniel 12:1: 'I embrace the opinion of those who refer this to the person of Christ.' John Gill (Baptist) wrote that Michael is 'none other than Christ Himself.' Spurgeon said: 'Our Lord, who is the true Michael, the only great Archangel.' Matthew Henry: 'Michael stood before the angel of the Lord... before Christ, the Lord of the angels.' Adam Clarke: 'There can be properly only one archangel, one chief of the angelic host.' Are Calvin, Spurgeon, Gill, Henry, and Clarke all cultists?`,
    analysis: "STRENGTHS: Using the critics' own theological heroes against them is devastating. Five major Protestant scholars all holding the same view makes the 'cult' accusation absurd. RATING: 10/10.",
  },
  {
    name: "The Clear Word Clarifier",
    subtitle: "The GC President, the author, and the Ministerial Association all deny it is official",
    topic: "General",
    argument: `When the Clear Word was published in 1994, the GC President stated: 'This should in no way be considered an official SDA Bible.' The Ministerial Association said: 'It should not be used for preaching from the pulpit or teaching Sabbath School.' Dr. Jack Blanco (the author) said: 'If anybody said this is an Adventist Bible, I would feel most hurt.' Furthermore, the Clear Word says in John 1:1: 'The Word was FULLY God' — it AFFIRMS Christ's deity, unlike the JW's NWT which says 'a god.' The claim that Adventists have their own Bible that demotes Jesus is verifiably false.`,
    analysis: "STRENGTHS: Three official sources (President, Ministerial Association, author) all on record denying official status. The John 1:1 comparison with NWT eliminates the JW parallel. RATING: 9/10.",
  },
  {
    name: "The Infallibility Antidote",
    subtitle: "SDA said Bible is the ONLY infallible rule — in 1854",
    topic: "General",
    argument: `Critics claim Adventists considered Ellen White infallible until the 1950s. But in 1854 — four years before the denomination was formally organized — article #3 of the SDA statement of beliefs declared: 'The Holy Scriptures of the Old and New Testaments were given by inspiration of God, contain a full revelation of His will to man, and are the ONLY infallible rule of faith and practice.' The word 'ONLY' is decisive. If the Bible is the only infallible rule, then by definition no other writings — including Ellen White's — are infallible. This predates the denomination's own organization. The claim that infallibility was only dropped in the 1950s is a fabrication.`,
    analysis: "STRENGTHS: The 1854 date is irrefutable — it predates the denomination itself. The word 'only' eliminates any wiggle room. RATING: 9/10.",
  },
  {
    name: "The Justice Hammer",
    subtitle: "Sins placed on Azazel is justice, not substitutionary atonement",
    topic: "Sanctuary",
    argument: `2 Chronicles 6:23 establishes a biblical principle: 'Condemn the wicked, by recompensing his way upon his own head.' When the high priest places the confessed sins of Israel upon the head of Azazel's goat (Leviticus 16:21), this is not an act of atonement or substitution — it is an act of JUSTICE. The sins are returned to their originator. Satan, as the instigator of sin, receives back upon his own head the full weight of the rebellion he initiated. This is the same principle found in Ezekiel 28:18: 'I will bring thee to ashes upon the earth.' The originator of sin bears the final consequences. Christ's blood was already applied in the sanctuary through the LORD's goat. The Azazel ceremony is not about salvation — it is about justice.`,
    analysis: "STRENGTHS: The 2 Chronicles 6:23 principle perfectly frames the Azazel ceremony as justice, not atonement. Distinguishing between salvation (LORD's goat) and justice (Azazel's goat) is theologically precise. RATING: 9/10.",
  },
  {
    name: "The Selective Prophet Detector",
    subtitle: "Critics warn against one prophet while ignoring thousands of modern ones",
    topic: "General",
    argument: `If critics are genuinely motivated by the command to 'test the prophets,' their focus should be universal. Yet entire YouTube channels are dedicated exclusively to Ellen White while saying nothing about thousands of modern self-proclaimed prophets — Kim Clement, Lance Wallnau, the entire NAR movement. Where is the same energy? The Bible's test is Isaiah 8:20: 'To the law and to the testimony: if they speak not according to this word, it is because there is no light in them.' Test by content and doctrine, not by borrowed phrases. And apply the test equally to ALL claimants.`,
    analysis: "STRENGTHS: Exposes the inconsistency that reveals the true motivation (anti-Adventism rather than anti-false-prophecy). RATING: 8/10.",
  },
  {
    name: "The Incarnation Context Key",
    subtitle: "Ellen White's 'not the Lord God Almighty' quote is standard Christology",
    topic: "The Trinity",
    argument: `Critics quote Ellen White: 'The man Christ Jesus was not the Lord God Almighty.' But the full statement continues: 'yet Christ and the Father are ONE.' She is making a basic Christological distinction: in His HUMANITY, Jesus could bleed, hunger, tire, and die. She also wrote: 'In Christ is life, original, unborrowed, underived,' and called Him 'equal with God, infinite and omnipotent.' Ripping one clause from a paragraph that simultaneously affirms Christ's deity is the same dishonest method atheists use when pulling Bible verses out of context.`,
    analysis: "STRENGTHS: Providing the full context instantly defuses the quote. The parallel to atheistic proof-texting of the Bible forces consistency. RATING: 9/10.",
  },
];

const WEAPON_EMOJIS: Record<string, { name: string; emoji: string }> = {
  "Prophecy": { name: "Prophecy Crossbow", emoji: "🏹" },
  "The Sabbath": { name: "Sabbath Sword", emoji: "⚔️" },
  "God's Law": { name: "Decalogue Shield", emoji: "🛡️" },
  "Second Coming": { name: "Advent Lance", emoji: "🔱" },
  "State of the Dead": { name: "Soul Rest Hammer", emoji: "🔨" },
  "Sanctuary": { name: "Sanctuary Breastplate", emoji: "🏛️" },
  "The Trinity": { name: "Trinity Helm", emoji: "👑" },
  "The Rapture": { name: "Rapture Rapier", emoji: "⚡" },
  "The Papacy / Antichrist": { name: "Reformation Axe", emoji: "🪓" },
  "Hellfire / Annihilationism": { name: "Purifier's Flame", emoji: "🔥" },
  "Once Saved Always Saved": { name: "Perseverance Pike", emoji: "🗡️" },
  "General": { name: "Truth Blade", emoji: "⚔️" },
  "Three Angels' Messages": { name: "Herald's Horn", emoji: "📯" },
  "Health & Temperance": { name: "Temperance Staff", emoji: "🧑‍⚕️" },
  "Baptism": { name: "Baptism Trident", emoji: "🔱" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid auth" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check how many weapons the user already has from this seed
    const { data: existing } = await supabase
      .from("defense_arsenal")
      .select("name")
      .eq("user_id", user.id);

    const existingNames = new Set((existing || []).map((w: any) => w.name));

    // Filter out weapons that already exist
    const newWeapons = ARSENAL_WEAPONS.filter(w => !existingNames.has(w.name));

    if (newWeapons.length === 0) {
      return new Response(
        JSON.stringify({ message: "Arsenal already fully stocked!", inserted: 0, total: ARSENAL_WEAPONS.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert weapons in batches
    const rows = newWeapons.map(w => ({
      user_id: user.id,
      name: w.name,
      subtitle: w.subtitle,
      argument: w.argument,
      analysis: w.analysis,
      topic: w.topic,
      saved_at: new Date().toISOString(),
    }));

    const BATCH_SIZE = 10;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from("defense_arsenal").insert(batch);
      if (error) {
        console.error("Insert error:", error);
        throw new Error(`Failed to insert batch ${i / BATCH_SIZE + 1}: ${error.message}`);
      }
      inserted += batch.length;
    }

    return new Response(
      JSON.stringify({
        message: `Arsenal stocked with ${inserted} weapons from Pastor Ivor Myers' apologetics transcripts!`,
        inserted,
        skipped: ARSENAL_WEAPONS.length - newWeapons.length,
        total: ARSENAL_WEAPONS.length,
        topics: Object.entries(
          newWeapons.reduce((acc: Record<string, number>, w) => {
            acc[w.topic] = (acc[w.topic] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1]),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("seed-arsenal error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
