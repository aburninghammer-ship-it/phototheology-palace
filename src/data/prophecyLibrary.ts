// Prophecy Room Library - Prophetic Timelines and Fulfillments

export interface Prophecy {
  id: string;
  title: string;
  prophecy: string;
  source: { book: string; chapter: number; verses: string };
  fulfillment?: { book: string; chapter: number; verses: string; description: string };
  category: "messianic" | "national" | "end-times" | "near-term" | "dual" | "time-prophecy";
  timeframe: "fulfilled" | "being-fulfilled" | "future";
  explanation: string;
  historicistView?: string;
  dateGiven?: string;
  dateFulfilled?: string;
  significance: string;
}

export const prophecyLibrary: Prophecy[] = [
  // MESSIANIC PROPHECIES
  {
    id: "seed-of-woman",
    title: "The Seed of the Woman",
    prophecy: "He shall bruise your head, and you shall bruise His heel",
    source: { book: "Genesis", chapter: 3, verses: "15" },
    fulfillment: { book: "Galatians", chapter: 4, verses: "4", description: "God sent forth His Son, born of a woman" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "The first Messianic prophecy (Protoevangelium). The 'seed of woman' is unique—normally lineage is through the man. This hints at virgin birth. The serpent bruises Christ's heel (temporary suffering on cross), but Christ crushes the serpent's head (fatal, permanent defeat).",
    dateFulfilled: "~4 BC (birth), 31 AD (cross)",
    significance: "Establishes the conflict between Christ and Satan from the beginning."
  },
  {
    id: "born-bethlehem",
    title: "Born in Bethlehem",
    prophecy: "But you, Bethlehem Ephrathah, though you are little among the thousands of Judah, yet out of you shall come forth to Me the One to be Ruler in Israel",
    source: { book: "Micah", chapter: 5, verses: "2" },
    fulfillment: { book: "Matthew", chapter: 2, verses: "1-6", description: "Jesus was born in Bethlehem of Judea" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Micah prophesied 700 years before Christ. Bethlehem means 'House of Bread'—fitting for the Bread of Life. The prophecy adds 'whose goings forth are from of old, from everlasting'—indicating pre-existence and deity.",
    dateGiven: "~700 BC",
    dateFulfilled: "~4 BC",
    significance: "Geographic specificity proves divine foreknowledge."
  },
  {
    id: "virgin-birth",
    title: "Born of a Virgin",
    prophecy: "Behold, the virgin shall conceive and bear a Son, and shall call His name Immanuel",
    source: { book: "Isaiah", chapter: 7, verses: "14" },
    fulfillment: { book: "Matthew", chapter: 1, verses: "22-23", description: "Mary was found with child of the Holy Spirit" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "The Hebrew 'almah' means young woman of marriageable age. The Septuagint (Greek OT, translated 200+ years before Christ) used 'parthenos'—specifically 'virgin.' This translation predates any Christian influence.",
    dateGiven: "~735 BC",
    dateFulfilled: "~4 BC",
    significance: "Only a virgin birth could produce the sinless God-Man."
  },
  {
    id: "out-of-egypt",
    title: "Called Out of Egypt",
    prophecy: "Out of Egypt I called My Son",
    source: { book: "Hosea", chapter: 11, verses: "1" },
    fulfillment: { book: "Matthew", chapter: 2, verses: "15", description: "Joseph took the child and mother to Egypt, then returned after Herod died" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Israel was God's 'son' called out of Egypt. Jesus recapitulates Israel's history perfectly—where they failed, He succeeds. Both 'sons' went to Egypt and were called out. Jesus is the true Israel.",
    significance: "Shows Christ fulfilling Israel's role and history."
  },
  {
    id: "triumphal-entry",
    title: "Riding on a Donkey",
    prophecy: "Behold, your King is coming to you; He is just and having salvation, lowly and riding on a donkey",
    source: { book: "Zechariah", chapter: 9, verses: "9" },
    fulfillment: { book: "Matthew", chapter: 21, verses: "1-9", description: "Jesus sent disciples to get a donkey and rode into Jerusalem" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Kings rode horses to war, donkeys for peace. Jesus came first as Prince of Peace. He will return on a white horse (Rev 19). This was Palm Sunday—exactly 69 weeks of years (483 years) from Artaxerxes' decree (Dan 9:25).",
    significance: "Public Messianic claim understood by the crowds."
  },
  {
    id: "thirty-pieces",
    title: "Betrayed for Thirty Pieces of Silver",
    prophecy: "They weighed out for my wages thirty pieces of silver... throw it to the potter",
    source: { book: "Zechariah", chapter: 11, verses: "12-13" },
    fulfillment: { book: "Matthew", chapter: 27, verses: "3-10", description: "Judas received 30 pieces and threw them in the temple; the money bought a potter's field" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "30 pieces of silver = price of a slave (Ex 21:32). The exact amount, the location (temple), the throwing, and the potter's field—all predicted 500 years before. No one 'staged' this; Judas fulfilled prophecy unknowingly.",
    dateGiven: "~520 BC",
    dateFulfilled: "31 AD",
    significance: "Multiple specific details fulfilled precisely."
  },
  {
    id: "silent-before-accusers",
    title: "Silent Before Accusers",
    prophecy: "He was oppressed and He was afflicted, yet He opened not His mouth",
    source: { book: "Isaiah", chapter: 53, verses: "7" },
    fulfillment: { book: "Matthew", chapter: 27, verses: "12-14", description: "When accused by the chief priests, He answered nothing" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Jesus could have defended Himself—He had the words and authority. His silence fulfilled prophecy and demonstrated willing submission to the Father's plan. Even Pilate 'marveled greatly.'",
    significance: "Shows Christ's voluntary sacrifice."
  },
  {
    id: "crucified-with-criminals",
    title: "Numbered with Transgressors",
    prophecy: "He was numbered with the transgressors",
    source: { book: "Isaiah", chapter: 53, verses: "12" },
    fulfillment: { book: "Mark", chapter: 15, verses: "27-28", description: "They crucified two robbers with Him, one on His right and one on His left" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Jesus was treated as a criminal though innocent. The two thieves represent all humanity—one repents and is saved, one mocks and is lost. Jesus was in the middle as the dividing line of destiny.",
    significance: "Christ took the sinner's place completely."
  },
  {
    id: "pierced-hands-feet",
    title: "Hands and Feet Pierced",
    prophecy: "They pierced My hands and My feet",
    source: { book: "Psalms", chapter: 22, verses: "16" },
    fulfillment: { book: "John", chapter: 20, verses: "25-27", description: "Thomas saw the nail prints in His hands" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Written by David 1000 years before Christ, 600 years before crucifixion was invented (Persian, then Roman). David never experienced this—prophetic, not autobiographical. The entire Psalm 22 reads like an eyewitness account of Calvary.",
    dateGiven: "~1000 BC",
    significance: "Details of a death method not yet invented."
  },
  {
    id: "lots-for-garments",
    title: "Lots Cast for Clothing",
    prophecy: "They divide My garments among them, and for My clothing they cast lots",
    source: { book: "Psalms", chapter: 22, verses: "18" },
    fulfillment: { book: "John", chapter: 19, verses: "23-24", description: "Soldiers divided His garments and cast lots for His seamless tunic" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "The soldiers fulfilled prophecy unknowingly. They divided the outer garments (4 parts for 4 soldiers) but cast lots for the seamless inner tunic—too valuable to tear. Minor details predicted 1000 years ahead.",
    significance: "Unconscious prophetic fulfillment by pagans."
  },
  {
    id: "bones-not-broken",
    title: "No Bones Broken",
    prophecy: "He guards all his bones; not one of them is broken",
    source: { book: "Psalms", chapter: 34, verses: "20" },
    fulfillment: { book: "John", chapter: 19, verses: "32-36", description: "Soldiers broke the legs of the two thieves but not Jesus, because He was already dead" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Breaking legs (crurifragium) hastened death by preventing the victim from pushing up to breathe. Jesus died before this was necessary. Also connects to the Passover lamb—no bone was to be broken (Ex 12:46).",
    significance: "Links Jesus to the Passover lamb."
  },
  {
    id: "rich-mans-tomb",
    title: "Buried in a Rich Man's Tomb",
    prophecy: "They made His grave with the wicked—but with the rich at His death",
    source: { book: "Isaiah", chapter: 53, verses: "9" },
    fulfillment: { book: "Matthew", chapter: 27, verses: "57-60", description: "Joseph of Arimathea, a rich man, placed Jesus in his own new tomb" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "Jesus was crucified with criminals (wicked), but buried with honor by Joseph of Arimathea, a wealthy member of the Sanhedrin. Isaiah predicted both aspects 700 years before.",
    significance: "Seemingly contradictory details both fulfilled."
  },
  {
    id: "resurrection",
    title: "Resurrection Prophesied",
    prophecy: "You will not leave my soul in Sheol, nor will You allow Your Holy One to see corruption",
    source: { book: "Psalms", chapter: 16, verses: "10" },
    fulfillment: { book: "Acts", chapter: 2, verses: "25-32", description: "Peter cited this Psalm, saying David spoke of Christ's resurrection" },
    category: "messianic",
    timeframe: "fulfilled",
    explanation: "David died and saw corruption (decay). This must refer to another—the Messiah. Peter's Pentecost sermon makes this argument. 'Holy One' = Messiah. Jesus rose before His body could decay.",
    significance: "Old Testament proof of resurrection."
  },

  // TIME PROPHECIES
  {
    id: "daniel-70-weeks",
    title: "70 Weeks: Messiah's Coming Timed",
    prophecy: "Seventy weeks are determined... from the going forth of the command to restore and build Jerusalem until Messiah the Prince, there shall be seven weeks and sixty-two weeks",
    source: { book: "Daniel", chapter: 9, verses: "24-27" },
    fulfillment: { book: "Luke", chapter: 3, verses: "1-22", description: "Jesus baptized in the 15th year of Tiberius—exactly 69 weeks of years from 457 BC" },
    category: "time-prophecy",
    timeframe: "fulfilled",
    explanation: "70 weeks = 490 years (day-year principle). Decree of Artaxerxes: 457 BC. 69 weeks (483 years) to Messiah = 27 AD (Jesus' baptism/anointing). Final week: 3.5 years ministry, 3.5 years Gospel to Jews. 34 AD: Stephen stoned, Gospel to Gentiles.",
    historicistView: "The 2300-day prophecy (Dan 8:14) begins at the same starting point, reaching to 1844—the start of the investigative judgment/cleansing of the heavenly sanctuary.",
    dateGiven: "~538 BC",
    dateFulfilled: "27 AD (baptism), 31 AD (crucifixion), 34 AD (end of 70 weeks)",
    significance: "Most precise Messianic time prophecy. Mathematically pinpoints Jesus."
  },
  {
    id: "daniel-2-kingdoms",
    title: "Daniel 2: Four Kingdoms to God's Kingdom",
    prophecy: "This image's head was of fine gold, its chest and arms of silver, its belly and thighs of bronze, its legs of iron, its feet partly of iron and partly of clay",
    source: { book: "Daniel", chapter: 2, verses: "31-45" },
    category: "time-prophecy",
    timeframe: "being-fulfilled",
    explanation: "Gold = Babylon (605-539 BC). Silver = Medo-Persia (539-331 BC). Bronze = Greece (331-168 BC). Iron = Rome (168 BC-476 AD). Iron/clay = Divided Europe (476 AD-present). Stone = God's eternal kingdom. We live in the toes!",
    historicistView: "The kingdoms trace history exactly as predicted. No fifth world empire has succeeded Rome—Europe has remained divided despite many attempts to unite (Charlemagne, Napoleon, Hitler, EU). The stone strikes the feet, meaning Christ returns when the divided state still exists.",
    significance: "Outlines world history from Daniel's day to Christ's return."
  },
  {
    id: "daniel-7-beasts",
    title: "Daniel 7: Four Beasts and the Little Horn",
    prophecy: "Four great beasts came up from the sea... The fourth beast was different from all the beasts... and a little horn came up among them",
    source: { book: "Daniel", chapter: 7, verses: "1-27" },
    category: "time-prophecy",
    timeframe: "being-fulfilled",
    explanation: "Lion = Babylon. Bear = Medo-Persia. Leopard = Greece. Dreadful Beast = Rome. Little Horn (uprooting 3 horns) = Papal Rome. 'Time, times, half a time' (3.5 years/1260 days) = 1260 years (538-1798 AD). Ancient of Days brings judgment.",
    historicistView: "The little horn speaking 'great words against the Most High,' wearing out the saints, and thinking to change 'times and laws' points to the papacy: claims divine titles, persecuted during the Dark Ages, changed the Sabbath. 1798: Napoleon's general captured the pope, ending the 1260 years.",
    significance: "Expands Daniel 2, adding the persecuting little horn power."
  },
  {
    id: "daniel-8-2300",
    title: "2300 Days: Cleansing of the Sanctuary",
    prophecy: "Unto two thousand and three hundred days; then shall the sanctuary be cleansed",
    source: { book: "Daniel", chapter: 8, verses: "14" },
    category: "time-prophecy",
    timeframe: "being-fulfilled",
    explanation: "Ram = Medo-Persia. Goat = Greece. Little horn (different from Dan 7) = Rome in both pagan and papal phases. 2300 years from 457 BC = 1844 AD. The earthly sanctuary was destroyed in 70 AD; this must refer to the heavenly sanctuary.",
    historicistView: "Starting from the same 457 BC decree as Daniel 9, the 2300 years reach to 1844. This marks the beginning of the investigative/pre-advent judgment in heaven (Dan 7:9-10), the antitypical Day of Atonement when Christ began the final phase of His high priestly ministry.",
    dateGiven: "~551 BC",
    dateFulfilled: "1844 AD (ongoing)",
    significance: "Longest Bible time prophecy, points to heavenly judgment phase."
  },
  {
    id: "1260-days",
    title: "1260 Days of Persecution",
    prophecy: "They will be given into his hand for a time and times and half a time",
    source: { book: "Daniel", chapter: 7, verses: "25" },
    category: "time-prophecy",
    timeframe: "fulfilled",
    explanation: "Time (1) + times (2) + half a time (0.5) = 3.5 years = 1260 days. Using the day-year principle (Num 14:34, Eze 4:6), this equals 1260 years. This period is mentioned in Daniel 7:25, 12:7; Revelation 11:2-3, 12:6, 12:14, 13:5.",
    historicistView: "538 AD: Last of 3 Arian kingdoms uprooted; papal supremacy established. 1798 AD: Pope Pius VI captured by Napoleon's general Berthier. Exactly 1260 years of papal dominance and persecution. The 'deadly wound' was inflicted but would be healed (Rev 13:3).",
    dateGiven: "~553 BC",
    dateFulfilled: "538-1798 AD",
    significance: "Precisely fulfilled period of church persecution."
  },
  {
    id: "revelation-churches",
    title: "Seven Churches: Church History",
    prophecy: "Write what you see... to the seven churches",
    source: { book: "Revelation", chapter: 1, verses: "11" },
    category: "time-prophecy",
    timeframe: "fulfilled",
    explanation: "Ephesus (apostolic, 31-100 AD), Smyrna (persecution, 100-313), Pergamos (compromise, 313-538), Thyatira (Dark Ages, 538-1517), Sardis (Reformation, 1517-1798), Philadelphia (missionary era, 1798-1844), Laodicea (lukewarm, 1844-end).",
    historicistView: "The seven churches represent both literal first-century congregations AND consecutive eras of church history. Each message fits its corresponding era precisely. We are in the Laodicean period—lukewarm, self-satisfied, needing Christ.",
    significance: "Outlines entire church history from apostolic age to Second Coming."
  },

  // END-TIMES PROPHECIES
  {
    id: "matthew-24-signs",
    title: "Signs of Christ's Coming",
    prophecy: "There will be famines, pestilences, and earthquakes in various places... Then they will deliver you up to tribulation... This gospel of the kingdom will be preached in all the world",
    source: { book: "Matthew", chapter: 24, verses: "7-14" },
    category: "end-times",
    timeframe: "being-fulfilled",
    explanation: "Jesus gave signs to watch for: wars, famines, earthquakes, persecution, false prophets, lawlessness, love growing cold, Gospel to all nations. The specific sign: 'This generation (that sees all these things begin) will not pass away until all be fulfilled.'",
    significance: "Jesus's own outline of end-time events."
  },
  {
    id: "mark-of-beast",
    title: "Mark of the Beast",
    prophecy: "He causes all... to receive a mark on their right hand or on their foreheads, and that no one may buy or sell except one who has the mark",
    source: { book: "Revelation", chapter: 13, verses: "16-17" },
    category: "end-times",
    timeframe: "future",
    explanation: "The beast power (first beast, Rev 13:1-10) has a 'mark' of authority. Contrasted with God's seal (Rev 7:3, Eze 9:4). Economic coercion will be used. This is not a computer chip but a religious/loyalty issue—choosing beast's authority over God's.",
    historicistView: "The mark represents allegiance to the beast system. The seal of God is the Sabbath (Ex 31:13, Eze 20:12, 20)—the sign of loyalty to the Creator. The counterfeit 'mark' is Sunday observance enforced by human law. The final test is over worship and authority.",
    significance: "Final test of allegiance before Christ returns."
  },
  {
    id: "three-angels",
    title: "Three Angels' Messages",
    prophecy: "I saw another angel fly in the midst of heaven, having the everlasting gospel to preach...",
    source: { book: "Revelation", chapter: 14, verses: "6-12" },
    category: "end-times",
    timeframe: "being-fulfilled",
    explanation: "First Angel: Fear God, give Him glory, the hour of His judgment has come, worship the Creator. Second Angel: Babylon is fallen. Third Angel: Warning against the mark of the beast. These messages prepare the world for Christ's return.",
    historicistView: "These messages began going to the world after 1844, when the judgment hour arrived (Dan 8:14). They call humanity back to true worship (Sabbath), out of spiritual Babylon (confused false religion), and warn against the coming mark crisis.",
    significance: "God's final message to humanity before the Second Coming."
  },
  {
    id: "second-coming",
    title: "The Second Coming of Christ",
    prophecy: "This same Jesus, who was taken up from you into heaven, will so come in like manner as you saw Him go into heaven",
    source: { book: "Acts", chapter: 1, verses: "11" },
    fulfillment: { book: "Revelation", chapter: 1, verses: "7", description: "Behold, He is coming with clouds, and every eye will see Him" },
    category: "end-times",
    timeframe: "future",
    explanation: "Jesus will return literally, visibly, audibly, and gloriously. As He ascended (visible, bodily, with clouds), so He will return. Every eye will see Him. The dead in Christ rise first, then the living are caught up together. No secret rapture.",
    significance: "The blessed hope of all believers."
  },
  {
    id: "new-earth",
    title: "New Heavens and New Earth",
    prophecy: "Behold, I create new heavens and a new earth; and the former shall not be remembered",
    source: { book: "Isaiah", chapter: 65, verses: "17" },
    fulfillment: { book: "Revelation", chapter: 21, verses: "1", description: "Now I saw a new heaven and a new earth, for the first heaven and the first earth had passed away" },
    category: "end-times",
    timeframe: "future",
    explanation: "After the millennium and final judgment, God creates the earth anew. The New Jerusalem descends. God dwells with His people. No more death, sorrow, crying, or pain. The curse is removed. Tree of life restored. Eden regained and enhanced.",
    significance: "The ultimate destiny of the redeemed."
  },

  // DUAL FULFILLMENT
  {
    id: "elijah-coming",
    title: "Elijah Before the Day of the Lord",
    prophecy: "Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD",
    source: { book: "Malachi", chapter: 4, verses: "5-6" },
    fulfillment: { book: "Matthew", chapter: 11, verses: "14", description: "If you are willing to receive it, he [John] is Elijah who is to come" },
    category: "dual",
    timeframe: "being-fulfilled",
    explanation: "John the Baptist came 'in the spirit and power of Elijah' (Luke 1:17) before Christ's first coming. An Elijah message (call to repentance, turning hearts to God) will also precede the Second Coming. Rev 11's two witnesses may relate to this.",
    historicistView: "The Elijah message prepares the way for both comings. Before the 'great and dreadful day of the LORD' (Second Coming), God raises up messengers with Elijah's spirit—bold, calling for reform, confronting false worship.",
    significance: "Prophetic principle: local and worldwide fulfillment."
  },
];

// Helper functions
export const getPropheciesByCategory = (category: Prophecy["category"]) =>
  prophecyLibrary.filter(p => p.category === category);

export const getPropheciesByTimeframe = (timeframe: Prophecy["timeframe"]) =>
  prophecyLibrary.filter(p => p.timeframe === timeframe);

export const searchProphecies = (query: string) => {
  const q = query.toLowerCase();
  return prophecyLibrary.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.prophecy.toLowerCase().includes(q) ||
    p.explanation.toLowerCase().includes(q)
  );
};

export const getMessianicProphecies = () =>
  prophecyLibrary.filter(p => p.category === "messianic");

export const getTimeProphecies = () =>
  prophecyLibrary.filter(p => p.category === "time-prophecy");
