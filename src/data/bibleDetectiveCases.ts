export type ClueType = "scripture" | "historical" | "linguistic" | "typological" | "prophetic";

export interface DetectiveClue {
  id: string;
  clueNumber: number;
  text: string;
  scriptureRef: string;
  clueType: ClueType;
}

export type Difficulty = "rookie" | "detective" | "master-sleuth";
export type CaseCategory = "identity" | "timeline" | "typology" | "prophecy" | "doctrine";

export interface DetectiveCaseFile {
  id: string;
  caseNumber: number;
  title: string;
  difficulty: Difficulty;
  category: CaseCategory;
  description: string;
  clues: DetectiveClue[];
  verdict: {
    identity: string;
    timeline: string;
    meaning: string;
    explanation: string;
  };
}

export const DETECTIVE_CASES: DetectiveCaseFile[] = [
  {
    id: "beast-power",
    caseNumber: 1,
    title: "The Beast Power — Who Is It?",
    difficulty: "detective",
    category: "identity",
    description: "A mysterious power rises from the sea with seven heads and ten horns. It speaks blasphemies, persecutes the saints, and rules for 42 months. Your mission: identify this power using the clues Scripture provides.",
    clues: [
      { id: "bp-1", clueNumber: 1, text: "The suspect rises from the 'sea' — which Revelation 17:15 defines as 'peoples, and multitudes, and nations, and tongues.' This power arose from a heavily populated area.", scriptureRef: "Revelation 13:1; 17:15", clueType: "scripture" },
      { id: "bp-2", clueNumber: 2, text: "It has features of a leopard (Greece), bear (Medo-Persia), and lion (Babylon) — combining all previous empires into one system.", scriptureRef: "Revelation 13:2; Daniel 7:4-6", clueType: "prophetic" },
      { id: "bp-3", clueNumber: 3, text: "The dragon (Satan working through pagan Rome) gave this power 'his seat, and great authority.' The suspect inherited Rome's capital city and governmental structure.", scriptureRef: "Revelation 13:2", clueType: "historical" },
      { id: "bp-4", clueNumber: 4, text: "It speaks 'great things and blasphemies.' Biblically, blasphemy = claiming to forgive sins (Mark 2:7) and claiming to be God (John 10:33). This power's leader claims both.", scriptureRef: "Revelation 13:5-6; Mark 2:7; John 10:33", clueType: "scripture" },
      { id: "bp-5", clueNumber: 5, text: "It 'made war with the saints and overcame them' for 42 months (1260 prophetic years). The Inquisition, persecution of Waldenses, Albigenses, and Huguenots — tens of millions martyred.", scriptureRef: "Revelation 13:7; Daniel 7:25", clueType: "historical" },
      { id: "bp-6", clueNumber: 6, text: "It received a 'deadly wound' — in 1798, General Berthier arrested the leader of this power. But the wound 'was healed' — by 1929 (Lateran Treaty), political sovereignty was restored.", scriptureRef: "Revelation 13:3", clueType: "historical" },
      { id: "bp-7", clueNumber: 7, text: "Its number is 666. One of its leader's official Latin titles adds up to 666 in Roman numerals.", scriptureRef: "Revelation 13:18", clueType: "linguistic" },
    ],
    verdict: {
      identity: "The Papacy — the Roman Catholic religio-political system",
      timeline: "538 AD (receiving civil authority via Justinian's decree) to 1798 AD (deadly wound) = exactly 1260 years. Wound healing from 1929 onward.",
      meaning: "This is not an attack on individual Catholics but an identification of a SYSTEM that substituted human traditions for God's law, persecuted Bible-believing Christians, and claimed divine prerogatives. Every Reformer — Luther, Calvin, Knox, Wesley, Huss — identified this beast as the papacy.",
      explanation: "The 7 identifying marks — origin in populated Europe, composite of all previous empires, receiving Rome's seat, blasphemous claims, 1260-year rule, persecution of saints, deadly wound and healing — match one and only one institution in all of history. The Reformers unanimously recognized this. The futurist 'future Antichrist' theory was invented by Jesuit Francisco Ribera in 1585 specifically to deflect this identification.",
    },
  },
  {
    id: "little-horn",
    caseNumber: 2,
    title: "The Little Horn — Daniel's Mystery Power",
    difficulty: "detective",
    category: "identity",
    description: "Daniel sees a 'little horn' rise among ten horns on the fourth beast. This horn has eyes like a man, speaks great words, and persecutes God's people. Who or what is this horn?",
    clues: [
      { id: "lh-1", clueNumber: 1, text: "The little horn arises from the FOURTH beast — which represents Rome (following Babylon, Medo-Persia, and Greece). This power must emerge from the Roman Empire.", scriptureRef: "Daniel 7:7-8", clueType: "prophetic" },
      { id: "lh-2", clueNumber: 2, text: "It comes up 'among' the ten horns. The ten horns are the barbarian tribes that divided Western Rome: Alemanni, Franks, Anglo-Saxons, Burgundians, Visigoths, Suevi, Lombards, Heruli, Vandals, Ostrogoths.", scriptureRef: "Daniel 7:8, 24", clueType: "historical" },
      { id: "lh-3", clueNumber: 3, text: "Three of the first horns were 'plucked up by the roots' before it. Three Arian tribes were destroyed to establish this power's supremacy: Heruli (493), Vandals (534), Ostrogoths (538).", scriptureRef: "Daniel 7:8, 24", clueType: "historical" },
      { id: "lh-4", clueNumber: 4, text: "It has 'eyes like the eyes of man' — indicating a single human leader at its head, with human intelligence and insight directing the system.", scriptureRef: "Daniel 7:8", clueType: "scripture" },
      { id: "lh-5", clueNumber: 5, text: "It speaks 'great words against the most High' — blasphemous claims of divine authority, including the power to forgive sins and titles that belong only to God.", scriptureRef: "Daniel 7:25", clueType: "scripture" },
      { id: "lh-6", clueNumber: 6, text: "It 'wears out the saints' for 'a time and times and the dividing of time' — 3.5 prophetic years = 1260 prophetic days = 1260 literal years.", scriptureRef: "Daniel 7:25; Ezekiel 4:6", clueType: "prophetic" },
      { id: "lh-7", clueNumber: 7, text: "It 'thinks to change times and laws' — specifically God's law. The suspect changed the Sabbath from Saturday to Sunday and altered the Ten Commandments.", scriptureRef: "Daniel 7:25", clueType: "scripture" },
    ],
    verdict: {
      identity: "The Papacy — the Bishop of Rome who rose to religio-political supremacy",
      timeline: "Arose among the 10 barbarian kingdoms after Rome's fall (476 AD). Gained supreme authority by 538 AD after the last Arian opposition was removed. Ruled for 1260 years until 1798 AD.",
      meaning: "Daniel's little horn prophecy has 11 distinct identifying marks, and the papacy matches every single one. No other power in history arose from the divisions of Rome, uprooted exactly 3 tribes, has a single human leader, claimed divine prerogatives, persecuted saints for 1260 years, and attempted to change God's law.",
      explanation: "The Reformers universally identified the little horn as the papacy. This identification was so powerful that the Jesuits invented two counter-interpretations: Ribera's futurism (a future individual Antichrist) and Alcazar's preterism (Antiochus Epiphanes). Both were designed specifically to break the prophetic chain that pointed to Rome.",
    },
  },
  {
    id: "2300-days",
    caseNumber: 3,
    title: "The 2300 Days — Heaven's Calendar",
    difficulty: "master-sleuth",
    category: "timeline",
    description: "Daniel hears a mysterious timeframe: 'Unto two thousand and three hundred days; then shall the sanctuary be cleansed.' When does this period begin? When does it end? And what sanctuary is being cleansed?",
    clues: [
      { id: "td-1", clueNumber: 1, text: "The angel Gabriel is sent to help Daniel 'understand the vision' (Dan 8:16). But Daniel faints and the vision is not fully explained in chapter 8. Gabriel returns in chapter 9 to complete the explanation.", scriptureRef: "Daniel 8:16, 27; 9:21-23", clueType: "scripture" },
      { id: "td-2", clueNumber: 2, text: "Gabriel says 'Seventy weeks are determined upon thy people.' The Hebrew word 'chathak' means 'cut off.' The 70 weeks (490 years) are CUT OFF from the larger 2300-day period.", scriptureRef: "Daniel 9:24", clueType: "linguistic" },
      { id: "td-3", clueNumber: 3, text: "The starting point: 'From the going forth of the commandment to restore and to build Jerusalem.' This is the decree of Artaxerxes in 457 BC (Ezra 7:11-26) — the ONLY decree that commands restoration of Jerusalem's government.", scriptureRef: "Daniel 9:25; Ezra 7:11-26", clueType: "historical" },
      { id: "td-4", clueNumber: 4, text: "69 weeks (483 years) reach 'Messiah the Prince.' 457 BC + 483 = 27 AD. Jesus was baptized in the 15th year of Tiberius Caesar — precisely 27 AD (Luke 3:1).", scriptureRef: "Daniel 9:25; Luke 3:1", clueType: "prophetic" },
      { id: "td-5", clueNumber: 5, text: "In the midst of the 70th week (31 AD), Messiah is 'cut off' — crucified. At that moment, the temple veil was 'rent in twain from the top to the bottom' — God ended the earthly sacrificial system.", scriptureRef: "Daniel 9:26-27; Matthew 27:51", clueType: "typological" },
      { id: "td-6", clueNumber: 6, text: "The 70 weeks (490 years) end in 34 AD with the stoning of Stephen (Acts 7) — the gospel officially goes to the Gentiles. The remaining 1810 years of the 2300 extend beyond Israel.", scriptureRef: "Daniel 9:24; Acts 7:54-60", clueType: "historical" },
      { id: "td-7", clueNumber: 7, text: "457 BC + 2300 years = 1844 AD. The sanctuary being cleansed is NOT the earthly temple (destroyed in 70 AD) but the HEAVENLY sanctuary where Christ ministers as High Priest (Hebrews 8:1-2).", scriptureRef: "Daniel 8:14; Hebrews 8:1-2; 9:23", clueType: "typological" },
    ],
    verdict: {
      identity: "The 2300 years point to the beginning of Christ's final high priestly ministry in the heavenly sanctuary — the antitypical Day of Atonement",
      timeline: "457 BC (Artaxerxes' decree) → 27 AD (Christ's baptism, 69 weeks) → 31 AD (crucifixion, middle of 70th week) → 34 AD (end of 70 weeks) → 1844 AD (end of 2300 years, sanctuary cleansing begins)",
      meaning: "In 1844, Christ moved from the Holy Place to the Most Holy Place of the heavenly sanctuary to begin the investigative judgment — reviewing the records of all who have professed faith, determining who is covered by His blood. This is the antitypical Day of Atonement (Leviticus 16).",
      explanation: "This prophecy is mathematically precise. Every date can be verified historically. The 70 weeks pinpoint Christ's baptism and crucifixion to the exact year. The remaining 1810 years reach 1844 — the year the Advent movement arose and discovered the truth about the heavenly sanctuary. No other prophetic interpretation accounts for all the mathematical, historical, and typological evidence.",
    },
  },
  {
    id: "70-weeks",
    caseNumber: 4,
    title: "The 70 Weeks — Messiah's Timetable",
    difficulty: "rookie",
    category: "timeline",
    description: "God gave Daniel an exact timetable for the Messiah's arrival. Can you decode the 70 weeks and prove that Jesus of Nazareth arrived on schedule?",
    clues: [
      { id: "sw-1", clueNumber: 1, text: "70 weeks = 70 × 7 = 490 days. Using the year-day principle (Ezek 4:6, Num 14:34), this is 490 YEARS 'determined upon thy people' (Israel).", scriptureRef: "Daniel 9:24; Ezekiel 4:6", clueType: "prophetic" },
      { id: "sw-2", clueNumber: 2, text: "The decree to 'restore and build Jerusalem' was issued by Artaxerxes I of Persia in 457 BC. This is our starting point.", scriptureRef: "Ezra 7:11-26", clueType: "historical" },
      { id: "sw-3", clueNumber: 3, text: "7 weeks (49 years) for rebuilding Jerusalem: 457 BC – 408 BC. The city and walls were rebuilt 'in troublous times,' as Nehemiah records.", scriptureRef: "Daniel 9:25; Nehemiah 4-6", clueType: "historical" },
      { id: "sw-4", clueNumber: 4, text: "After 62 more weeks (434 years), 'Messiah the Prince' appears. 408 BC + 434 = 27 AD — the year Jesus was baptized by John and anointed with the Holy Spirit.", scriptureRef: "Daniel 9:25; Luke 3:21-22", clueType: "prophetic" },
      { id: "sw-5", clueNumber: 5, text: "The word 'Messiah' means 'Anointed One.' Jesus was literally anointed with the Holy Spirit at His baptism in 27 AD. He then declared: 'The time is fulfilled' (Mark 1:15).", scriptureRef: "Mark 1:15; Acts 10:38", clueType: "linguistic" },
      { id: "sw-6", clueNumber: 6, text: "In the 'midst of the week' (3.5 years into the 70th week = 31 AD), Messiah was 'cut off, but not for himself' — crucified for the sins of the world. The sacrifice and oblation ceased.", scriptureRef: "Daniel 9:26-27", clueType: "typological" },
    ],
    verdict: {
      identity: "Jesus of Nazareth is the prophesied Messiah — arriving exactly when Daniel predicted",
      timeline: "457 BC → 408 BC (49 years, city rebuilt) → 27 AD (483 years, Messiah baptized) → 31 AD (crucifixion, midst of 70th week) → 34 AD (490 years, gospel to Gentiles)",
      meaning: "God gave an exact mathematical timetable for the Messiah's arrival, and Jesus fulfilled it to the year. This is one of the most powerful proofs that Jesus is the Christ and that the Bible is divinely inspired.",
      explanation: "When Jesus said 'The time is fulfilled' (Mark 1:15) at His baptism in 27 AD, He was referencing Daniel 9. The 69 weeks had been fulfilled to the exact year. No other figure in history appeared at the precise time predicted by Daniel's prophecy. This is irrefutable evidence for the messiahship of Jesus.",
    },
  },
  {
    id: "woman-rev12",
    caseNumber: 5,
    title: "The Woman of Revelation 12",
    difficulty: "rookie",
    category: "identity",
    description: "A radiant woman appears in heaven, clothed with the sun, the moon under her feet, crowned with twelve stars. A dragon tries to destroy her child. Who is she?",
    clues: [
      { id: "wr-1", clueNumber: 1, text: "She is 'clothed with the sun' — representing the glory of the New Testament gospel. The 'moon under her feet' represents the reflected light of the Old Testament ceremonial system that pointed forward to Christ.", scriptureRef: "Revelation 12:1", clueType: "typological" },
      { id: "wr-2", clueNumber: 2, text: "She has 'a crown of twelve stars' — representing the 12 apostles who founded the New Testament church (and echoing the 12 tribes of Israel).", scriptureRef: "Revelation 12:1", clueType: "scripture" },
      { id: "wr-3", clueNumber: 3, text: "She gives birth to 'a man child, who was to rule all nations with a rod of iron' — this is Jesus Christ (Psalm 2:9). The child is 'caught up unto God, and to his throne' — the ascension.", scriptureRef: "Revelation 12:5; Psalm 2:9", clueType: "prophetic" },
      { id: "wr-4", clueNumber: 4, text: "She 'fled into the wilderness' for 1260 days (years). During the 1260 years of papal persecution (538-1798), God's faithful church hid in remote areas — the Waldenses in the Alps, the Albigenses in southern France.", scriptureRef: "Revelation 12:6, 14", clueType: "historical" },
      { id: "wr-5", clueNumber: 5, text: "The dragon (Satan, working through pagan Rome — Herod tried to kill baby Jesus) persecuted her, but 'the earth helped the woman' — the Protestant Reformation and the discovery of the New World provided refuge.", scriptureRef: "Revelation 12:13-16", clueType: "historical" },
      { id: "wr-6", clueNumber: 6, text: "The 'remnant of her seed' at the end of time has two identifying marks: they 'keep the commandments of God' (ALL ten, including the Sabbath) and 'have the testimony of Jesus Christ' (the spirit of prophecy, Rev 19:10).", scriptureRef: "Revelation 12:17; 19:10", clueType: "scripture" },
    ],
    verdict: {
      identity: "God's true church throughout history — from the apostolic era through the Middle Ages to the end-time remnant",
      timeline: "Apostolic church → wilderness preservation (538-1798 AD) → end-time remnant church",
      meaning: "The woman is NOT Mary (she persists for 1260 years after the child ascends). She represents the true, faithful church — always persecuted, always preserved. Her 'remnant' at the end keeps ALL of God's commandments and has the prophetic gift.",
      explanation: "In Bible prophecy, a pure woman = God's true church (2 Cor 11:2, Jer 6:2). A harlot = an apostate church (Rev 17). The woman of Revelation 12 is the faithful line of believers throughout history. The remnant described in verse 17 keeps all ten commandments (including the seventh-day Sabbath) and has the testimony of Jesus (the spirit of prophecy). This identifies a specific end-time movement.",
    },
  },
  {
    id: "seal-of-god",
    caseNumber: 6,
    title: "The Seal of God — What Is It?",
    difficulty: "detective",
    category: "doctrine",
    description: "Revelation speaks of God's people receiving a 'seal' in their foreheads. What is this seal? How do you receive it? And why does the enemy counterfeit it with a 'mark'?",
    clues: [
      { id: "sg-1", clueNumber: 1, text: "A seal contains three elements: the NAME of the authority, their TITLE, and their TERRITORY. A king's seal might read: 'George (name), King (title) of England (territory).'", scriptureRef: "Esther 3:12; 8:8", clueType: "historical" },
      { id: "sg-2", clueNumber: 2, text: "Only ONE of the Ten Commandments contains all three elements of a seal: 'The LORD (name) made (title: Creator) heaven and earth, the sea, and all that in them is (territory: the universe).'", scriptureRef: "Exodus 20:8-11", clueType: "scripture" },
      { id: "sg-3", clueNumber: 3, text: "God says the Sabbath is a 'sign' (same Hebrew word as 'seal') between Him and His people forever: 'That ye may know that I am the LORD that doth sanctify you.'", scriptureRef: "Exodus 31:13, 17; Ezekiel 20:12, 20", clueType: "scripture" },
      { id: "sg-4", clueNumber: 4, text: "The seal is placed in the 'forehead' — representing the mind, conscious decision, and loyalty. It is not a physical mark but a spiritual commitment to worship God on HIS day.", scriptureRef: "Revelation 7:3; 14:1", clueType: "typological" },
      { id: "sg-5", clueNumber: 5, text: "The counterfeit (the 'mark of the beast') is received in the forehead (conscious choice) OR the hand (going along for convenience). The beast's claimed mark of authority? Changing the Sabbath to Sunday.", scriptureRef: "Revelation 13:16-17", clueType: "scripture" },
      { id: "sg-6", clueNumber: 6, text: "Catholic catechisms openly state: 'Sunday is our mark of authority... The church is above the Bible, and this transference of Sabbath observance is proof of that fact.' — Catholic Record, September 1, 1923.", scriptureRef: "Daniel 7:25", clueType: "historical" },
    ],
    verdict: {
      identity: "The Seal of God is the seventh-day Sabbath — the sign of God's creative and sanctifying authority",
      timeline: "Established at Creation (Gen 2:1-3), codified at Sinai (Exod 20:8-11), honored by Christ (Luke 4:16), and restored in the end time as the final test of loyalty",
      meaning: "The Sabbath is not merely a day of rest — it is GOD'S SEAL, containing His name (LORD), title (Creator), and territory (heaven, earth, sea). The mark of the beast is the counterfeit: Sunday worship enforced by law, the beast's claimed mark of authority over God's law.",
      explanation: "The final conflict in earth's history is over worship — specifically, the day of worship. The Sabbath (God's seal) represents loyalty to the Creator. Sunday observance (when enforced by law) represents submission to human authority over God's. This is not about casual Sunday-keepers who don't know better — the mark is received only when the truth is known and rejected under pressure.",
    },
  },
  {
    id: "mark-of-beast",
    caseNumber: 7,
    title: "The Mark of the Beast — 666",
    difficulty: "detective",
    category: "doctrine",
    description: "The most feared number in prophecy. Everyone speculates about it, but few investigate the biblical evidence. What is the mark? And what does 666 really mean?",
    clues: [
      { id: "mb-1", clueNumber: 1, text: "The mark is received either in the 'right hand' (actions/compliance) or 'forehead' (belief/allegiance). It's about WORSHIP, not technology — 'worship the beast and his image' (Rev 14:9).", scriptureRef: "Revelation 13:16; 14:9", clueType: "scripture" },
      { id: "mb-2", clueNumber: 2, text: "The mark is contrasted with God's seal (Rev 7:3). If God's seal is the Sabbath (the sign of His authority as Creator), then the mark must be the beast's counterfeit day of worship.", scriptureRef: "Revelation 7:3; 14:9-12", clueType: "typological" },
      { id: "mb-3", clueNumber: 3, text: "The beast 'thinks to change times and laws' (Dan 7:25). The only commandment involving both TIME and LAW is the fourth: 'Remember the Sabbath day, to keep it holy.'", scriptureRef: "Daniel 7:25; Exodus 20:8-11", clueType: "scripture" },
      { id: "mb-4", clueNumber: 4, text: "The number 666 is 'the number of a man' (Rev 13:18). One of the pope's official titles, 'Vicarius Filii Dei' (Vicar of the Son of God), adds up to 666 in Roman numerals.", scriptureRef: "Revelation 13:18", clueType: "linguistic" },
      { id: "mb-5", clueNumber: 5, text: "Those who REFUSE the mark are described in Rev 14:12: 'Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.' They keep ALL commandments — including the Sabbath.", scriptureRef: "Revelation 14:12", clueType: "scripture" },
      { id: "mb-6", clueNumber: 6, text: "No one has the mark of the beast TODAY. The mark is received only when Sunday worship is enforced by civil law and people must choose between obeying God (Sabbath) or obeying the beast (Sunday) under penalty.", scriptureRef: "Revelation 13:15-17", clueType: "prophetic" },
    ],
    verdict: {
      identity: "The mark of the beast is Sunday worship enforced by civil law — the beast's counterfeit of God's Sabbath seal",
      timeline: "Not yet enforced. The mark becomes relevant when religious legislation compels Sunday observance and penalizes Sabbath-keeping.",
      meaning: "The mark is NOT a barcode, microchip, or tattoo. It is a matter of WORSHIP — choosing to obey human authority (the beast system) over God's explicit command. The contrast is clear: God's seal (Sabbath) vs. the beast's mark (enforced Sunday).",
      explanation: "Revelation 13-14 presents a final, worldwide test of loyalty. Those who follow the beast receive his mark. Those who follow God keep His commandments (Rev 14:12). The issue is not about a physical mark but about who you worship. Sincere Sunday-keepers who don't know better are NOT currently receiving the mark — the test comes when truth is made plain and civil authority demands compliance.",
    },
  },
  {
    id: "two-witnesses",
    caseNumber: 8,
    title: "The Two Witnesses — Who Are They?",
    difficulty: "master-sleuth",
    category: "identity",
    description: "Two mysterious witnesses prophesy for 1260 days, are killed, and rise again after 3.5 days. Their identity has puzzled scholars for centuries. Follow the clues.",
    clues: [
      { id: "tw-1", clueNumber: 1, text: "They prophesy for 1260 days (years) — the same period as the beast's reign and the woman's wilderness sojourn. During papal supremacy, these witnesses testified 'in sackcloth' (mourning, suppression).", scriptureRef: "Revelation 11:3", clueType: "prophetic" },
      { id: "tw-2", clueNumber: 2, text: "They are called 'two olive trees and two candlesticks.' Zechariah 4:2-6 identifies olive trees as channels of the Holy Spirit. Psalm 119:105 says 'Thy word is a lamp unto my feet.'", scriptureRef: "Revelation 11:4; Zechariah 4:2-6; Psalm 119:105", clueType: "typological" },
      { id: "tw-3", clueNumber: 3, text: "They have power to shut heaven (like Elijah, 1 Kings 17:1) and turn water to blood (like Moses, Exodus 7:20). The Old and New Testaments bear the same authoritative witness as Moses and Elijah.", scriptureRef: "Revelation 11:5-6", clueType: "scripture" },
      { id: "tw-4", clueNumber: 4, text: "The 'beast from the bottomless pit' kills them. After 1260 years of suppression, the French Revolution (1789-1799) attempted to destroy the Bible entirely — banning Scripture and enthroning the 'Goddess of Reason.'", scriptureRef: "Revelation 11:7", clueType: "historical" },
      { id: "tw-5", clueNumber: 5, text: "They lie dead for 3.5 days (years). From November 1793 (French ban on the Bible) to June 1797 — exactly 3.5 years — when France reversed the ban and allowed Scripture again.", scriptureRef: "Revelation 11:9, 11", clueType: "historical" },
      { id: "tw-6", clueNumber: 6, text: "After their resurrection, they ascend with great honor. After the French Revolution, the Bible experienced an unprecedented explosion — the British and Foreign Bible Society (1804) and the American Bible Society (1816) launched worldwide distribution.", scriptureRef: "Revelation 11:11-12", clueType: "historical" },
    ],
    verdict: {
      identity: "The Old and New Testaments — God's written Word, His two witnesses to truth throughout history",
      timeline: "Prophesied in sackcloth during papal supremacy (538-1798). 'Killed' during the French Revolution (1793). 'Resurrected' after 3.5 years (1797). Exalted through the Bible society movement (1804 onward).",
      meaning: "The two witnesses are not two individuals but the two testaments of Scripture — God's dual witness to truth. During the 1260 years of papal supremacy, the Bible was suppressed, chained to monastery walls, and forbidden to common people. The French Revolution was Satan's attempt to destroy Scripture entirely. But the Word of God cannot be killed — it rose again and has spread to every nation on earth.",
      explanation: "The Bible is its own best interpreter. The symbolism of olive trees (Holy Spirit), candlesticks (light/truth), and the powers of Moses and Elijah all point to the written Word of God. The French Revolution's brief but intense war against the Bible — followed by Scripture's global triumph through Bible societies — fulfills this prophecy with striking precision.",
    },
  },
  {
    id: "elijah-typology",
    caseNumber: 9,
    title: "The Elijah Message — Past and Future",
    difficulty: "master-sleuth",
    category: "typology",
    description: "Malachi promised God would send 'Elijah the prophet before the coming of the great and dreadful day of the LORD.' Was this John the Baptist? Or is there more to the story?",
    clues: [
      { id: "et-1", clueNumber: 1, text: "Malachi 4:5-6 promises: 'Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD.' This is a dual prophecy — partial and final fulfillment.", scriptureRef: "Malachi 4:5-6", clueType: "prophetic" },
      { id: "et-2", clueNumber: 2, text: "Jesus confirmed John the Baptist was the first fulfillment: 'If ye will receive it, this is Elias, which was for to come' (Matt 11:14). But John himself denied being literally Elijah (John 1:21).", scriptureRef: "Matthew 11:14; 17:11-12; John 1:21", clueType: "scripture" },
      { id: "et-3", clueNumber: 3, text: "John came 'in the spirit and power of Elias' (Luke 1:17) — not as Elijah reincarnated, but carrying the same MESSAGE: repentance, turning hearts to God, and preparing the way for the Messiah.", scriptureRef: "Luke 1:17", clueType: "typological" },
      { id: "et-4", clueNumber: 4, text: "Jesus said 'Elias truly shall first come, and restore all things' (Matt 17:11) — using the FUTURE tense even after John had already come and been killed. A future Elijah work was still expected.", scriptureRef: "Matthew 17:11", clueType: "scripture" },
      { id: "et-5", clueNumber: 5, text: "Elijah's original mission: call Israel back to the true God in a time of apostasy (1 Kings 18). The end-time Elijah message calls the world back to true worship in the final apostasy — 'Fear God, and give glory to him' (Rev 14:7).", scriptureRef: "1 Kings 18:21, 36-39; Revelation 14:6-7", clueType: "typological" },
      { id: "et-6", clueNumber: 6, text: "The three angels' messages of Revelation 14:6-12 ARE the end-time Elijah message: calling the world to worship the Creator (Sabbath), come out of Babylon (apostasy), and reject the beast's mark — before 'the great and dreadful day of the LORD.'", scriptureRef: "Revelation 14:6-12; Malachi 4:5", clueType: "prophetic" },
    ],
    verdict: {
      identity: "The Elijah message has a dual fulfillment: John the Baptist before Christ's first coming, and the three angels' messages before Christ's second coming",
      timeline: "First fulfillment: John the Baptist (27 AD). Final fulfillment: the three angels' messages (1844 onward, continuing to the Second Coming).",
      meaning: "The Elijah message is not about a single person returning — it's about a MESSAGE and a MOVEMENT that calls the world back to the true God in a time of apostasy, just as Elijah called Israel back at Mount Carmel.",
      explanation: "The parallel is striking: Elijah confronted Baal worship (false worship) in Israel's darkest apostasy. The end-time Elijah movement confronts beast worship (false Sabbath) in Christianity's final apostasy. Both call people to decide: 'If the LORD be God, follow him' (1 Kings 18:21). The three angels' messages are the Elijah message in its fullest, final form.",
    },
  },
  {
    id: "sanctuary-antitype",
    caseNumber: 10,
    title: "The Heavenly Sanctuary — Shadow to Reality",
    difficulty: "master-sleuth",
    category: "typology",
    description: "The earthly sanctuary was a 'shadow of heavenly things.' But what does the heavenly sanctuary look like? And what is Christ doing there right now?",
    clues: [
      { id: "sa-1", clueNumber: 1, text: "God told Moses: 'Let them make me a sanctuary; that I may dwell among them. According to all that I shew thee, after the PATTERN of the tabernacle' — the earthly was a copy of a heavenly original.", scriptureRef: "Exodus 25:8-9, 40; Hebrews 8:5", clueType: "scripture" },
      { id: "sa-2", clueNumber: 2, text: "Hebrews 8:1-2 declares: 'We have such an high priest, who is set on the right hand of the throne of the Majesty in the heavens; a minister of the sanctuary, and of the true tabernacle, which the Lord pitched, and not man.'", scriptureRef: "Hebrews 8:1-2", clueType: "scripture" },
      { id: "sa-3", clueNumber: 3, text: "The earthly sanctuary had two apartments: the Holy Place (daily ministry) and the Most Holy Place (entered once a year on the Day of Atonement). Christ's heavenly ministry follows the same pattern.", scriptureRef: "Hebrews 9:1-7; Leviticus 16", clueType: "typological" },
      { id: "sa-4", clueNumber: 4, text: "John saw heavenly sanctuary furniture in his visions: 7 candlesticks (Rev 1:12 — Holy Place), altar of incense (Rev 8:3 — Holy Place), and the ark of the covenant (Rev 11:19 — Most Holy Place).", scriptureRef: "Revelation 1:12; 8:3; 11:19", clueType: "scripture" },
      { id: "sa-5", clueNumber: 5, text: "On the Day of Atonement (Lev 16), the sanctuary was 'cleansed' — sins transferred to the sanctuary throughout the year were removed and placed on the scapegoat (Azazel). This is the type of Daniel 8:14.", scriptureRef: "Leviticus 16:15-22; Daniel 8:14", clueType: "typological" },
      { id: "sa-6", clueNumber: 6, text: "In 1844, Christ entered the Most Holy Place of the heavenly sanctuary to begin the antitypical Day of Atonement — the investigative judgment, reviewing who among the professed believers is covered by His blood.", scriptureRef: "Daniel 7:9-10; 8:14; Revelation 14:7", clueType: "prophetic" },
    ],
    verdict: {
      identity: "The heavenly sanctuary is the TRUE tabernacle where Christ ministers as our High Priest — and since 1844, He has been in the Most Holy Place conducting the investigative judgment",
      timeline: "Christ entered the Holy Place at His ascension (31 AD). He moved to the Most Holy Place in 1844 (Daniel 8:14). He will complete His ministry and return when the judgment is finished.",
      meaning: "The sanctuary doctrine unlocks the entire plan of salvation. Christ's death was the sacrifice. His Holy Place ministry applies that sacrifice to believers daily. His Most Holy Place ministry (since 1844) is the final phase — the judgment that determines who is ready for His return.",
      explanation: "The earthly sanctuary was a teaching model — every piece of furniture, every sacrifice, every priestly act pointed to what Christ would do in the heavenly reality. The daily (tamid) services = Christ's ongoing intercession for believers. The yearly Day of Atonement = the investigative judgment (Dan 7:9-10) that began in 1844. Understanding the sanctuary is the key to understanding why there has been a delay in Christ's return — He is completing His high priestly work.",
    },
  },
];
