// ============================================================================
// THE EIGHT CYCLES LIBRARY
// ============================================================================
// Content library for studying the Eight Cycles of redemptive history
// Each cycle follows the five-part rhythm: Fall → Covenant → Sanctuary → Enemy → Restoration
// ============================================================================

import { CycleCode, ptCycles } from './phototheologySystem';

export interface CycleEntry {
  id: string;
  cycleCode: CycleCode;
  title: string;
  phase: "fall" | "covenant" | "sanctuary" | "enemy" | "restoration";
  description: string;
  keyTexts: { reference: string; text: string }[];
  connections: string[];
  christConnection: string;
  studyQuestions: string[];
}

export interface CycleComparison {
  id: string;
  theme: string;
  description: string;
  acrossCycles: {
    cycle: CycleCode;
    manifestation: string;
    keyText: string;
  }[];
  insight: string;
}

// ============================================================================
// CYCLE ENTRIES - Detailed content for each cycle phase
// ============================================================================

export const cyclesLibrary: CycleEntry[] = [
  // ========== ADAMIC CYCLE (@Ad) ==========
  {
    id: "ad-fall-001",
    cycleCode: "@Ad",
    title: "The Fall in Eden",
    phase: "fall",
    description: "Adam and Eve disobey God by eating the forbidden fruit, bringing sin and death into the world. They hide in shame and are expelled from Eden.",
    keyTexts: [
      { reference: "Genesis 3:6", text: "She took of its fruit and ate. She also gave to her husband with her, and he ate." },
      { reference: "Romans 5:12", text: "Through one man sin entered the world, and death through sin" }
    ],
    connections: ["First sin", "First death (animals for skins)", "First judgment", "First exile"],
    christConnection: "The 'last Adam' (1 Cor 15:45) reverses what the first Adam lost. Where Adam failed in a garden of abundance, Christ succeeded in a wilderness of scarcity.",
    studyQuestions: ["What were the immediate effects of the Fall?", "How does this establish the pattern for all future cycles?"]
  },
  {
    id: "ad-covenant-001",
    cycleCode: "@Ad",
    title: "The Seed Promise",
    phase: "covenant",
    description: "God promises that the seed of the woman will crush the serpent's head—the first Messianic prophecy and the foundation of redemption.",
    keyTexts: [
      { reference: "Genesis 3:15", text: "I will put enmity between you and the woman, between your seed and her Seed; He shall bruise your head, and you shall bruise His heel." },
      { reference: "Galatians 4:4", text: "When the fullness of the time had come, God sent forth His Son, born of a woman" }
    ],
    connections: ["Protoevangelium (first gospel)", "Virgin birth implied (her seed)", "Suffering Messiah (bruised heel)", "Victory over Satan (crushed head)"],
    christConnection: "Christ is the Seed of the woman who came to destroy the works of the devil (1 John 3:8) and crush Satan under our feet (Romans 16:20).",
    studyQuestions: ["Why is this called the 'protoevangelium'?", "How does this promise give hope to Adam and Eve?"]
  },
  {
    id: "ad-sanctuary-001",
    cycleCode: "@Ad",
    title: "Skins of Sacrifice",
    phase: "sanctuary",
    description: "God clothes Adam and Eve with animal skins—the first death, the first blood sacrifice, pointing to the Lamb of God who would cover our shame.",
    keyTexts: [
      { reference: "Genesis 3:21", text: "For Adam and his wife the LORD God made tunics of skin, and clothed them." },
      { reference: "Revelation 7:14", text: "They washed their robes and made them white in the blood of the Lamb." }
    ],
    connections: ["First animal death", "Covering shame", "God provides the covering", "Points to Christ's robe of righteousness"],
    christConnection: "We cannot cover our own shame; God must provide the covering. Christ is our righteousness, and we are clothed in His sacrifice.",
    studyQuestions: ["Why couldn't fig leaves suffice?", "What does God providing the covering teach us about salvation?"]
  },
  {
    id: "ad-enemy-001",
    cycleCode: "@Ad",
    title: "Cain and the Two Seeds",
    phase: "enemy",
    description: "Cain murders Abel, beginning the conflict between the seed of the serpent and the seed of the woman. The two lines diverge.",
    keyTexts: [
      { reference: "Genesis 4:8", text: "Cain rose up against Abel his brother and killed him." },
      { reference: "1 John 3:12", text: "Cain who was of the wicked one and murdered his brother... because his own works were evil and his brother's righteous." }
    ],
    connections: ["First murder", "Hatred of righteousness", "Two seeds/two lines", "Pattern of persecution"],
    christConnection: "The righteous have always been persecuted by the wicked. Christ Himself was rejected and killed by His own people.",
    studyQuestions: ["Why did Cain kill Abel?", "How does this establish the 'two seeds' theme throughout Scripture?"]
  },
  {
    id: "ad-restoration-001",
    cycleCode: "@Ad",
    title: "Seth and Worship Renewed",
    phase: "restoration",
    description: "God raises up Seth to replace Abel. Through Seth's line, 'men began to call on the name of the LORD.' The faithful seed continues.",
    keyTexts: [
      { reference: "Genesis 4:25-26", text: "She called his name Seth... Then men began to call on the name of the LORD." },
      { reference: "Genesis 5:3", text: "Adam... begot a son in his own likeness, after his image, and named him Seth." }
    ],
    connections: ["Godly line preserved", "Worship instituted", "Genealogy to Christ", "Hope renewed"],
    christConnection: "The line of Seth eventually produces the Messiah. God always preserves a faithful remnant through whom His purposes advance.",
    studyQuestions: ["What does 'calling on the name of the LORD' mean?", "Why is Seth's genealogy important for redemption history?"]
  },

  // ========== NOAHIC CYCLE (@No) ==========
  {
    id: "no-fall-001",
    cycleCode: "@No",
    title: "The World Corrupted",
    phase: "fall",
    description: "Violence fills the earth. Every imagination of humanity is bent toward evil continually. God grieves that He made man.",
    keyTexts: [
      { reference: "Genesis 6:5", text: "The LORD saw that the wickedness of man was great in the earth, and that every intent of the thoughts of his heart was only evil continually." },
      { reference: "Genesis 6:11", text: "The earth also was corrupt before God, and the earth was filled with violence." }
    ],
    connections: ["Total depravity", "Global judgment warranted", "Pre-flood world picture", "God's grief over sin"],
    christConnection: "Jesus warned that the days before His return would be 'as the days of Noah' (Matthew 24:37)—a world ripe for judgment.",
    studyQuestions: ["What made the pre-flood world so wicked?", "How do we see similar conditions today?"]
  },
  {
    id: "no-covenant-001",
    cycleCode: "@No",
    title: "The Covenant with Noah",
    phase: "covenant",
    description: "God establishes a covenant with Noah: salvation through the ark. Eight souls will be saved while the world is judged.",
    keyTexts: [
      { reference: "Genesis 6:18", text: "But I will establish My covenant with you; and you shall go into the ark—you, your sons, your wife, and your sons' wives with you." },
      { reference: "1 Peter 3:20", text: "Eight souls were saved through water." }
    ],
    connections: ["Covenant of preservation", "Ark = type of Christ/salvation", "Eight souls (new beginning)", "Water = judgment/baptism"],
    christConnection: "The ark had one door—Christ is the one way of salvation. As Noah entered the ark by faith, we enter Christ by faith.",
    studyQuestions: ["Why only one door on the ark?", "How is baptism connected to Noah's flood (1 Peter 3:21)?"]
  },
  {
    id: "no-sanctuary-001",
    cycleCode: "@No",
    title: "The Ark as Floating Temple",
    phase: "sanctuary",
    description: "The ark is God's provision for dwelling with His people through judgment. One door, one refuge, one family saved.",
    keyTexts: [
      { reference: "Genesis 6:14", text: "Make yourself an ark of gopherwood; make rooms in the ark, and cover it inside and outside with pitch." },
      { reference: "Genesis 7:1", text: "Come into the ark, you and all your household, because I have seen that you are righteous before Me in this generation." }
    ],
    connections: ["Ark dimensions reflect sanctuary proportions", "Pitch = same word as 'atonement' covering", "Animals preserved for future sacrifices"],
    christConnection: "Christ is our ark—the only place of safety when judgment comes. We must be 'in Christ' to be saved.",
    studyQuestions: ["What does the pitch (covering) symbolize?", "How is the ark similar to the later tabernacle?"]
  },
  {
    id: "no-enemy-001",
    cycleCode: "@No",
    title: "Mockery and Unbelief",
    phase: "enemy",
    description: "For 120 years Noah preached righteousness while building the ark. The world mocked, ignored, and continued in sin until the flood came.",
    keyTexts: [
      { reference: "2 Peter 2:5", text: "Noah, one of eight people, a preacher of righteousness" },
      { reference: "Matthew 24:38-39", text: "They were eating and drinking, marrying and giving in marriage, until the day that Noah entered the ark, and did not know until the flood came." }
    ],
    connections: ["Preaching ignored", "Normal life continued", "Sudden destruction", "No second chance"],
    christConnection: "As in Noah's day, the world today ignores the warnings. When Christ returns, it will be sudden and final.",
    studyQuestions: ["Why did people ignore Noah's warnings?", "What parallel do we see before the Second Coming?"]
  },
  {
    id: "no-restoration-001",
    cycleCode: "@No",
    title: "The Rainbow Covenant",
    phase: "restoration",
    description: "After the flood, God makes an everlasting covenant with all flesh. The rainbow is the sign—never again will a flood destroy the earth.",
    keyTexts: [
      { reference: "Genesis 9:13-15", text: "I set My rainbow in the cloud... I will remember My covenant... the waters shall never again become a flood to destroy all flesh." },
      { reference: "Genesis 8:21", text: "I will never again curse the ground for man's sake" }
    ],
    connections: ["Rainbow = covenant sign", "New beginning for humanity", "Sacrifice and promise", "Earth preserved until final judgment"],
    christConnection: "The rainbow around God's throne (Revelation 4:3) reminds us that God keeps His promises. His mercy endures forever.",
    studyQuestions: ["What does the rainbow represent?", "Why did God choose a visible sign for this covenant?"]
  },

  // ========== ABRAHAMIC CYCLE (@Ab) ==========
  {
    id: "ab-fall-001",
    cycleCode: "@Ab",
    title: "Babel and the Scattered Nations",
    phase: "fall",
    description: "Humanity unites in rebellion at Babel, building a tower to make a name for themselves. God confuses their language and scatters them.",
    keyTexts: [
      { reference: "Genesis 11:4", text: "Let us build ourselves a city, and a tower whose top is in the heavens; let us make a name for ourselves" },
      { reference: "Genesis 11:8", text: "The LORD scattered them abroad from there over the face of all the earth" }
    ],
    connections: ["Human pride and rebellion", "One world government attempt", "Languages divided", "Nations scattered"],
    christConnection: "At Pentecost, the curse of Babel is reversed—all nations hear the gospel in their own tongue and are united in Christ.",
    studyQuestions: ["What was wrong with building the tower?", "How does Pentecost reverse Babel?"]
  },
  {
    id: "ab-covenant-001",
    cycleCode: "@Ab",
    title: "The Call of Abraham",
    phase: "covenant",
    description: "God calls Abram out of Ur to a land He will show him. God promises to make him a great nation and bless all families through him.",
    keyTexts: [
      { reference: "Genesis 12:1-3", text: "Get out of your country... I will make you a great nation; I will bless you... and in you all the families of the earth shall be blessed." },
      { reference: "Galatians 3:8", text: "The Scripture... preached the gospel to Abraham beforehand, saying, 'In you all the nations shall be blessed.'" }
    ],
    connections: ["Election of one for the blessing of many", "Land promise", "Seed promise", "Gospel to Abraham"],
    christConnection: "The blessing to all nations is fulfilled in Christ, Abraham's seed, through whom all who believe are justified.",
    studyQuestions: ["Why did God choose Abraham?", "How is the Abrahamic covenant fulfilled in Christ?"]
  },
  {
    id: "ab-sanctuary-001",
    cycleCode: "@Ab",
    title: "Altars and Moriah",
    phase: "sanctuary",
    description: "Wherever Abraham goes, he builds altars. On Mount Moriah, God provides a ram and reveals 'Jehovah-Jireh'—the LORD will provide.",
    keyTexts: [
      { reference: "Genesis 22:8", text: "My son, God will provide for Himself the lamb for a burnt offering." },
      { reference: "Genesis 22:14", text: "Abraham called the name of the place, The-LORD-Will-Provide; as it is said to this day, 'In the Mount of the LORD it shall be provided.'" }
    ],
    connections: ["Mount Moriah = future temple site", "Isaac carried wood = Christ carried cross", "Father willing to give son", "Ram substituted"],
    christConnection: "Abraham's test was God's autobiography—what Abraham almost did, God actually did. He gave His only Son on the same mountain.",
    studyQuestions: ["Why did God test Abraham this way?", "How does Moriah connect to Calvary?"]
  },
  {
    id: "ab-enemy-001",
    cycleCode: "@Ab",
    title: "Pharaoh, Famine, and Failure",
    phase: "enemy",
    description: "Abraham faces Pharaoh, famine, conflict with Lot, and his own impatience with Ishmael—yet God preserves the covenant.",
    keyTexts: [
      { reference: "Genesis 12:10-13", text: "There was a famine in the land, and Abram went down to Egypt... Say you are my sister" },
      { reference: "Genesis 16:2", text: "Sarai said to Abram, 'The LORD has restrained me from bearing children. Please, go in to my maid'" }
    ],
    connections: ["Fear and deception", "Human schemes vs. divine promise", "Ishmael's conflict with Isaac", "God faithful despite failures"],
    christConnection: "Even when we fail, God's covenant stands. Our salvation depends on His faithfulness, not ours.",
    studyQuestions: ["How did Abraham's failures threaten the covenant?", "What do we learn about God's faithfulness?"]
  },
  {
    id: "ab-restoration-001",
    cycleCode: "@Ab",
    title: "Isaac: The Son of Promise",
    phase: "restoration",
    description: "Against all natural hope, Isaac is born to Abraham and Sarah in their old age. The covenant rests on miracle, not human strength.",
    keyTexts: [
      { reference: "Genesis 21:1-3", text: "The LORD visited Sarah as He had said... Sarah conceived and bore Abraham a son in his old age" },
      { reference: "Romans 4:19-21", text: "He did not waver at the promise of God through unbelief, but was strengthened in faith, giving glory to God" }
    ],
    connections: ["Miraculous birth", "Laughter (Isaac's name)", "Covenant continues", "Faith vindicated"],
    christConnection: "Isaac's birth from a 'dead womb' foreshadows resurrection. The true Seed comes through miracle, not natural means.",
    studyQuestions: ["Why was Isaac's birth miraculous?", "What does this teach about salvation by works vs. grace?"]
  },

  // ========== MOSAIC CYCLE (@Mo) ==========
  {
    id: "mo-fall-001",
    cycleCode: "@Mo",
    title: "Bondage in Egypt",
    phase: "fall",
    description: "Israel becomes enslaved in Egypt—a picture of bondage to sin. Pharaoh hardens his heart against God's commands to let His people go.",
    keyTexts: [
      { reference: "Exodus 1:13-14", text: "The Egyptians made the children of Israel serve with rigor... they made their lives bitter with hard bondage" },
      { reference: "Exodus 5:2", text: "Pharaoh said, 'Who is the LORD, that I should obey His voice to let Israel go?'" }
    ],
    connections: ["Egypt = bondage to sin", "Pharaoh = Satan's resistance", "400 years of affliction (Gen 15:13)", "Crying out to God"],
    christConnection: "Christ delivers us from bondage to sin and Satan. The Exodus is our salvation story in picture form.",
    studyQuestions: ["How is Egypt a type of sin?", "What does Israel's crying out teach about repentance?"]
  },
  {
    id: "mo-covenant-001",
    cycleCode: "@Mo",
    title: "The Sinai Covenant",
    phase: "covenant",
    description: "At Mount Sinai, God makes a covenant with Israel: 'I will take you as My people, and I will be your God.' The Ten Commandments are given.",
    keyTexts: [
      { reference: "Exodus 6:7", text: "I will take you as My people, and I will be your God." },
      { reference: "Exodus 19:5-6", text: "If you will indeed obey My voice and keep My covenant, then you shall be a special treasure to Me... a kingdom of priests and a holy nation." }
    ],
    connections: ["Law given in love", "Covenant formalized", "Israel as nation", "Theocracy established"],
    christConnection: "The Law reveals our sin and need for Christ. Jesus fulfilled the Law perfectly on our behalf.",
    studyQuestions: ["What was the purpose of the Law?", "How does the Sinai covenant point to Christ?"]
  },
  {
    id: "mo-sanctuary-001",
    cycleCode: "@Mo",
    title: "The Tabernacle Built",
    phase: "sanctuary",
    description: "God gives Moses the pattern for the tabernacle—His dwelling place among His people. Every detail points to Christ.",
    keyTexts: [
      { reference: "Exodus 25:8-9", text: "Let them make Me a sanctuary, that I may dwell among them. According to all that I show you... so you shall make it." },
      { reference: "Hebrews 8:5", text: "They serve the copy and shadow of the heavenly things, as Moses was divinely instructed when he was about to make the tabernacle" }
    ],
    connections: ["Gate = Way (John 14:6)", "Altar = Cross", "Laver = Baptism", "Lampstand = Light of World", "Bread = Bread of Life", "Incense = Intercession", "Ark = Throne of Grace"],
    christConnection: "The tabernacle is Christ in architectural form. 'The Word became flesh and tabernacled among us' (John 1:14).",
    studyQuestions: ["How does each piece of furniture point to Christ?", "What does 'God dwelling among His people' mean for us today?"]
  },
  {
    id: "mo-enemy-001",
    cycleCode: "@Mo",
    title: "Wilderness Unbelief",
    phase: "enemy",
    description: "Israel repeatedly rebels in the wilderness—golden calf, spies' bad report, Korah's rebellion. A whole generation dies without entering Canaan.",
    keyTexts: [
      { reference: "Numbers 14:22-23", text: "All these men who have seen My glory and the signs... and have not heeded My voice, they certainly shall not see the land" },
      { reference: "Hebrews 3:19", text: "So we see that they could not enter in because of unbelief." }
    ],
    connections: ["Golden calf idolatry", "Ten spies vs. two", "40 years wandering", "Unbelief = root sin"],
    christConnection: "Israel's failure warns us: don't harden your hearts. Faith and obedience are required to enter God's rest (Hebrews 4).",
    studyQuestions: ["What caused Israel to fail in the wilderness?", "How does this apply to Christians today?"]
  },
  {
    id: "mo-restoration-001",
    cycleCode: "@Mo",
    title: "Conquest and Canaan",
    phase: "restoration",
    description: "Under Joshua, the new generation crosses the Jordan and conquers Canaan. The land is divided, sanctuary worship is established.",
    keyTexts: [
      { reference: "Joshua 1:3", text: "Every place that the sole of your foot will tread upon I have given you, as I said to Moses." },
      { reference: "Joshua 21:45", text: "Not a word failed of any good thing which the LORD had spoken to the house of Israel. All came to pass." }
    ],
    connections: ["Jordan crossing = baptism into new life", "Jericho = faith victory", "Land divided = inheritance", "Promise fulfilled"],
    christConnection: "Joshua (Yeshua = Jesus) leads the people into rest. Christ leads us into the true rest of salvation.",
    studyQuestions: ["How does Joshua foreshadow Jesus?", "What does Canaan represent for the believer?"]
  },

  // ========== CYRUSIC CYCLE (@Cy) ==========
  {
    id: "cy-fall-001",
    cycleCode: "@Cy",
    title: "Exile to Babylon",
    phase: "fall",
    description: "Because of persistent idolatry and covenant unfaithfulness, Jerusalem falls to Babylon. The temple is destroyed. Israel goes into exile.",
    keyTexts: [
      { reference: "2 Chronicles 36:15-17", text: "The LORD God of their fathers sent warnings to them... but they mocked the messengers of God... until the wrath of the LORD arose against His people, till there was no remedy." },
      { reference: "Jeremiah 25:11", text: "This whole land shall be a desolation and an astonishment, and these nations shall serve the king of Babylon seventy years." }
    ],
    connections: ["70 years exile prophesied", "Temple destroyed", "Covenant broken by Israel", "God faithful to warn"],
    christConnection: "Exile is the consequence of sin—spiritual death and separation from God. Christ restores us from the exile of sin.",
    studyQuestions: ["Why did God allow the temple to be destroyed?", "What does exile teach about the consequences of sin?"]
  },
  {
    id: "cy-covenant-001",
    cycleCode: "@Cy",
    title: "The Promise of Return",
    phase: "covenant",
    description: "Prophets promise restoration. Isaiah names Cyrus 150 years before his birth. Jeremiah promises 70 years then return.",
    keyTexts: [
      { reference: "Isaiah 44:28", text: "Who says of Cyrus, 'He is My shepherd, and he shall perform all My pleasure, saying to Jerusalem, \"You shall be built,\" and to the temple, \"Your foundation shall be laid.\"'" },
      { reference: "Jeremiah 29:10", text: "After seventy years are completed at Babylon, I will visit you and perform My good word toward you, and cause you to return to this place." }
    ],
    connections: ["Cyrus named before birth", "70 years specific", "God's sovereignty over nations", "Promise of rebuilding"],
    christConnection: "God raises up deliverers—Cyrus as type, Christ as antitype. God keeps His promises even when circumstances seem impossible.",
    studyQuestions: ["What does God naming Cyrus in advance teach us?", "How does this give hope during 'exile' seasons?"]
  },
  {
    id: "cy-sanctuary-001",
    cycleCode: "@Cy",
    title: "Temple Rebuilt",
    phase: "sanctuary",
    description: "Under Zerubbabel, the altar is rebuilt and the temple foundations are laid. Worship resumes. The glory of the latter house will exceed the former.",
    keyTexts: [
      { reference: "Ezra 3:10-11", text: "When the builders laid the foundation of the temple of the LORD... they sang responsively, praising and giving thanks to the LORD" },
      { reference: "Haggai 2:9", text: "The glory of this latter temple shall be greater than the former" }
    ],
    connections: ["First priority: altar restored", "Mixed emotions at foundation", "Haggai and Zechariah encourage", "Christ will enter this temple"],
    christConnection: "Christ entered the second temple, fulfilling Haggai's prophecy. He is the true temple (John 2:19-21).",
    studyQuestions: ["Why did the old men weep at the foundation?", "How was the latter house greater?"]
  },
  {
    id: "cy-enemy-001",
    cycleCode: "@Cy",
    title: "Opposition and Compromise",
    phase: "enemy",
    description: "Local enemies try to stop the rebuilding. Spiritual compromise threatens the community. Ezra and Nehemiah lead reforms.",
    keyTexts: [
      { reference: "Ezra 4:4-5", text: "The people of the land tried to discourage the people of Judah. They troubled them in building, and hired counselors against them" },
      { reference: "Nehemiah 6:9", text: "They all were trying to make us afraid... Now therefore, O God, strengthen my hands." }
    ],
    connections: ["Letters to stop the work", "Intermarriage threatened identity", "Tobiah and Sanballat", "Prayer and perseverance"],
    christConnection: "Building God's kingdom always faces opposition. But 'if God is for us, who can be against us?' (Romans 8:31).",
    studyQuestions: ["What strategies did enemies use against rebuilding?", "How did Nehemiah respond to opposition?"]
  },
  {
    id: "cy-restoration-001",
    cycleCode: "@Cy",
    title: "Covenant Renewed",
    phase: "restoration",
    description: "Ezra reads the Law publicly. The people weep, celebrate, and renew the covenant. Walls are rebuilt. But the nation remains fragile.",
    keyTexts: [
      { reference: "Nehemiah 8:8-10", text: "They read distinctly from the book... and helped them to understand the reading... 'Do not sorrow, for the joy of the LORD is your strength.'" },
      { reference: "Nehemiah 9:38", text: "Because of all this, we make a sure covenant and write it; our leaders, our Levites, and our priests seal it." }
    ],
    connections: ["Public Scripture reading", "Covenant renewal", "Feast of Tabernacles revived", "Joy and weeping together"],
    christConnection: "True reformation comes through the Word of God. Revival always returns to Scripture.",
    studyQuestions: ["What role did Scripture reading play in revival?", "Why is covenant renewal important?"]
  },

  // ========== CYRUS-CHRIST CYCLE (@CyC) ==========
  {
    id: "cyc-fall-001",
    cycleCode: "@CyC",
    title: "Spiritual Weakness Under Rome",
    phase: "fall",
    description: "Though restored from Babylon, Israel is spiritually weak. Now under Roman occupation, they await a political Messiah while missing the spiritual one.",
    keyTexts: [
      { reference: "Matthew 23:37", text: "O Jerusalem, Jerusalem, the one who kills the prophets... How often I wanted to gather your children together... but you were not willing!" },
      { reference: "John 1:11", text: "He came to His own, and His own did not receive Him." }
    ],
    connections: ["400 years of prophetic silence", "Roman oppression", "Pharisaic legalism", "Messianic expectation misunderstood"],
    christConnection: "Christ came to His own, but they rejected Him. Spiritual blindness is worse than physical oppression.",
    studyQuestions: ["Why did Israel miss their Messiah?", "How do we avoid the same mistake today?"]
  },
  {
    id: "cyc-covenant-001",
    cycleCode: "@CyC",
    title: "The True Anointed Appears",
    phase: "covenant",
    description: "Christ—the Anointed One (Messiah)—appears. He is the covenant embodied, the fulfillment of all promises, the 'Yes' to every promise of God.",
    keyTexts: [
      { reference: "Luke 4:18-21", text: "The Spirit of the LORD is upon Me, because He has anointed Me to preach the gospel... Today this Scripture is fulfilled in your hearing." },
      { reference: "2 Corinthians 1:20", text: "For all the promises of God in Him are Yes, and in Him Amen, to the glory of God through us." }
    ],
    connections: ["Daniel 9 fulfilled", "Baptism = anointing", "Fulfills Law and Prophets", "New Covenant inaugurated"],
    christConnection: "Jesus is not just a deliverer like Cyrus—He IS the covenant. In Him all God's promises find their ultimate fulfillment.",
    studyQuestions: ["How did Jesus fulfill Daniel's prophecy of Messiah the Prince?", "What does it mean that Jesus IS the covenant?"]
  },
  {
    id: "cyc-sanctuary-001",
    cycleCode: "@CyC",
    title: "Christ the True Temple",
    phase: "sanctuary",
    description: "Jesus declares: 'Destroy this temple, and in three days I will raise it up.' He was speaking of His body—the true meeting place between God and man.",
    keyTexts: [
      { reference: "John 2:19-21", text: "Jesus answered and said to them, 'Destroy this temple, and in three days I will raise it up.'... He was speaking of the temple of His body." },
      { reference: "Colossians 2:9", text: "For in Him dwells all the fullness of the Godhead bodily" }
    ],
    connections: ["Cross = true altar", "Resurrection = cornerstone", "Veil torn = access opened", "Christ = High Priest and sacrifice"],
    christConnection: "Everything the temple represented finds fulfillment in Christ. He is the place where we meet God.",
    studyQuestions: ["How did Jesus fulfill the sanctuary?", "What does it mean that we are now 'living stones' in His temple?"]
  },
  {
    id: "cyc-enemy-001",
    cycleCode: "@CyC",
    title: "Opposition from All Sides",
    phase: "enemy",
    description: "Christ faces opposition from every quarter: Herod, Rome, Pharisees, Sadducees, and ultimately Satan himself. But through death, He conquers.",
    keyTexts: [
      { reference: "Psalm 2:1-2", text: "Why do the nations rage... The kings of the earth set themselves, and the rulers take counsel together, against the LORD and against His Anointed" },
      { reference: "Acts 4:27", text: "For truly against Your holy Servant Jesus, whom You anointed, both Herod and Pontius Pilate, with the Gentiles and the people of Israel, were gathered together" }
    ],
    connections: ["Human and demonic opposition", "Cross seemed like defeat", "Sin and death = ultimate enemies", "Victory through apparent defeat"],
    christConnection: "Christ conquered by dying. The cross that looked like defeat was His greatest victory over sin, death, and Satan.",
    studyQuestions: ["How did the cross defeat Christ's enemies?", "Why did God allow the opposition?"]
  },
  {
    id: "cyc-restoration-001",
    cycleCode: "@CyC",
    title: "Resurrection and Ascension",
    phase: "restoration",
    description: "Christ rises from the dead, ascends to heaven, and begins His heavenly ministry. The true restoration of God's presence with man is accomplished.",
    keyTexts: [
      { reference: "Matthew 28:18", text: "All authority has been given to Me in heaven and on earth." },
      { reference: "Hebrews 9:24", text: "For Christ has not entered the holy places made with hands, which are copies of the true, but into heaven itself, now to appear in the presence of God for us" }
    ],
    connections: ["Resurrection validates all claims", "Ascension begins heavenly ministry", "Authority given", "Presence restored eternally"],
    christConnection: "What all previous cycles pointed to is now accomplished. The new and living way is opened; we have access to God through Christ.",
    studyQuestions: ["Why is the resurrection central to Christianity?", "What is Christ doing in heaven now?"]
  },

  // ========== SPIRIT CYCLE (@Sp) ==========
  {
    id: "sp-fall-001",
    cycleCode: "@Sp",
    title: "Disciples in Doubt and Fear",
    phase: "fall",
    description: "Even after the resurrection, the disciples are fearful, confused, and scattered. They need the power of the Spirit to fulfill their mission.",
    keyTexts: [
      { reference: "John 20:19", text: "The doors were shut where the disciples were assembled, for fear of the Jews" },
      { reference: "Luke 24:21", text: "But we were hoping that it was He who was going to redeem Israel" }
    ],
    connections: ["Fear despite resurrection", "Misunderstanding of kingdom", "Waiting for power", "Human weakness revealed"],
    christConnection: "We cannot serve God in our own strength. The Spirit empowers what flesh cannot accomplish.",
    studyQuestions: ["Why were the disciples still fearful after the resurrection?", "What does this teach about our need for the Spirit?"]
  },
  {
    id: "sp-covenant-001",
    cycleCode: "@Sp",
    title: "The Promise of the Spirit",
    phase: "covenant",
    description: "Jesus promises: 'I will be with you always.' The Spirit is given to indwell, empower, and guide the church until Christ returns.",
    keyTexts: [
      { reference: "John 14:16-17", text: "I will pray the Father, and He will give you another Helper, that He may abide with you forever—the Spirit of truth" },
      { reference: "Acts 1:8", text: "But you shall receive power when the Holy Spirit has come upon you; and you shall be witnesses to Me" }
    ],
    connections: ["Promise of presence", "Power for witness", "Spirit as Comforter", "Guidance into all truth"],
    christConnection: "The Spirit is Christ's presence with us now. Through the Spirit, Jesus continues His ministry in and through His people.",
    studyQuestions: ["What roles does the Holy Spirit fulfill?", "How is the Spirit's coming related to Christ's ascension?"]
  },
  {
    id: "sp-sanctuary-001",
    cycleCode: "@Sp",
    title: "Pentecost: Believers as Temple",
    phase: "sanctuary",
    description: "At Pentecost, the Spirit falls with fire and wind. Believers become living temples. Homes become micro-sanctuaries.",
    keyTexts: [
      { reference: "Acts 2:3-4", text: "There appeared to them divided tongues, as of fire... And they were all filled with the Holy Spirit" },
      { reference: "1 Corinthians 3:16", text: "Do you not know that you are the temple of God and that the Spirit of God dwells in you?" }
    ],
    connections: ["Fire of God's presence", "Tongues = Babel reversed", "3,000 saved vs. 3,000 died at Sinai", "Church born"],
    christConnection: "The temple is no longer a building—it is the people. Christ dwells in believers by His Spirit.",
    studyQuestions: ["How does Pentecost reverse Babel?", "What does it mean to be a 'temple of the Holy Spirit'?"]
  },
  {
    id: "sp-enemy-001",
    cycleCode: "@Sp",
    title: "Persecution and Heresy",
    phase: "enemy",
    description: "The church faces external persecution (Rome) and internal corruption (heresies, compromise). Yet the gospel spreads despite—and because of—opposition.",
    keyTexts: [
      { reference: "Acts 8:1, 4", text: "At that time a great persecution arose... those who were scattered went everywhere preaching the word." },
      { reference: "1 John 2:19", text: "They went out from us, but they were not of us; for if they had been of us, they would have continued with us" }
    ],
    connections: ["Scattered but spreading", "Blood of martyrs = seed of church", "Apostasy predicted", "True vs. false teaching"],
    christConnection: "The church faces the same opposition Christ faced. But persecution purifies and spreads the gospel.",
    studyQuestions: ["How did persecution help spread the gospel?", "What heresies threatened the early church?"]
  },
  {
    id: "sp-restoration-001",
    cycleCode: "@Sp",
    title: "Revivals and Reformation",
    phase: "restoration",
    description: "Throughout history, God sends revivals and reformation movements—Waldenses, Reformation, Great Awakening. The Spirit renews the church across ages.",
    keyTexts: [
      { reference: "Habakkuk 3:2", text: "O LORD, revive Your work in the midst of the years!" },
      { reference: "Acts 3:19", text: "Repent therefore and be converted, that your sins may be blotted out, so that times of refreshing may come from the presence of the Lord" }
    ],
    connections: ["Reformation restored Scripture", "Great Awakening renewed evangelism", "Missionary movements", "Spirit-led renewal"],
    christConnection: "The Spirit continues Christ's work through every generation. God always preserves a faithful witness.",
    studyQuestions: ["What characterizes true revival?", "How does God preserve truth through dark ages?"]
  },

  // ========== REMNANT CYCLE (@Re) ==========
  {
    id: "re-fall-001",
    cycleCode: "@Re",
    title: "End-Time Apostasy",
    phase: "fall",
    description: "In the last days, apostasy deepens. False worship rises through beast, image, and mark. The world unites against God's truth.",
    keyTexts: [
      { reference: "2 Thessalonians 2:3", text: "Let no one deceive you by any means; for that Day will not come unless the falling away comes first" },
      { reference: "Revelation 13:8", text: "All who dwell on the earth will worship him, whose names have not been written in the Book of Life of the Lamb" }
    ],
    connections: ["Falling away predicted", "Beast power rises", "False prophet deceives", "Global false worship"],
    christConnection: "Christ warned of end-time deception. Only those rooted in His Word will stand.",
    studyQuestions: ["What characterizes end-time apostasy?", "How can we guard against deception?"]
  },
  {
    id: "re-covenant-001",
    cycleCode: "@Re",
    title: "The Remnant Covenant",
    phase: "covenant",
    description: "Revelation 12:17 identifies the remnant: those who keep God's commandments and have the testimony of Jesus. A faithful people stand in the final crisis.",
    keyTexts: [
      { reference: "Revelation 12:17", text: "The dragon was enraged with the woman, and he went to make war with the rest of her offspring, who keep the commandments of God and have the testimony of Jesus Christ." },
      { reference: "Revelation 14:12", text: "Here is the patience of the saints; here are those who keep the commandments of God and the faith of Jesus." }
    ],
    connections: ["Commandment-keeping", "Faith of Jesus", "Testimony of Jesus = Spirit of Prophecy", "Perseverance required"],
    christConnection: "The remnant reflects Christ's character—obedient and faithful. They follow the Lamb wherever He goes.",
    studyQuestions: ["What identifies the remnant?", "What is the 'testimony of Jesus'?"]
  },
  {
    id: "re-sanctuary-001",
    cycleCode: "@Re",
    title: "Heavenly Judgment",
    phase: "sanctuary",
    description: "The heavenly sanctuary explains the last conflict. Daniel 8:14's cleansing, the investigative judgment, and Christ's final ministry in the Most Holy Place.",
    keyTexts: [
      { reference: "Daniel 8:14", text: "For two thousand three hundred days; then the sanctuary shall be cleansed." },
      { reference: "Revelation 11:19", text: "Then the temple of God was opened in heaven, and the ark of His covenant was seen in His temple." }
    ],
    connections: ["1844 and the 2300 days", "Investigative judgment", "Ark of covenant seen", "Final atonement ministry"],
    christConnection: "Christ our High Priest is finishing His work in the heavenly sanctuary. Soon He will come to receive His people.",
    studyQuestions: ["What is the 'cleansing of the sanctuary'?", "How does this relate to the Day of Atonement?"]
  },
  {
    id: "re-enemy-001",
    cycleCode: "@Re",
    title: "The Final Confederacy",
    phase: "enemy",
    description: "Dragon, beast, and false prophet unite in the final battle against God's remnant. The whole world is deceived—but God's people stand firm.",
    keyTexts: [
      { reference: "Revelation 16:13-14", text: "I saw three unclean spirits like frogs coming out of the mouth of the dragon, out of the mouth of the beast, and out of the mouth of the false prophet... to gather them to the battle of that great day of God Almighty." },
      { reference: "Revelation 19:19", text: "I saw the beast, the kings of the earth, and their armies, gathered together to make war against Him who sat on the horse and against His army." }
    ],
    connections: ["Trinity of evil", "Spirits of demons", "Global deception", "Armageddon gathering"],
    christConnection: "The battle is real but the outcome is certain. Christ has already won; He simply comes to claim His victory.",
    studyQuestions: ["Who are the dragon, beast, and false prophet?", "What is the nature of the final battle?"]
  },
  {
    id: "re-restoration-001",
    cycleCode: "@Re",
    title: "New Heaven and New Earth",
    phase: "restoration",
    description: "Christ returns. God's people are vindicated. The new heaven and new earth are created. God dwells with His people forever. No more tears, death, or curse.",
    keyTexts: [
      { reference: "Revelation 21:1-4", text: "I saw a new heaven and a new earth... God will wipe away every tear from their eyes; there shall be no more death, nor sorrow, nor crying." },
      { reference: "Revelation 22:3-5", text: "There shall be no more curse, but the throne of God and of the Lamb shall be in it, and His servants shall serve Him... and they shall reign forever and ever." }
    ],
    connections: ["Eden restored and exceeded", "New Jerusalem descends", "Tree of Life restored", "God dwells with man forever"],
    christConnection: "The Lamb is the temple and the light of the new creation. All that was lost in Genesis 3 is more than restored in Revelation 22.",
    studyQuestions: ["How is the new earth 'better than Eden'?", "What will eternity with God be like?"]
  }
];

// ============================================================================
// CYCLE COMPARISONS - Themes traced across multiple cycles
// ============================================================================

export const cycleComparisons: CycleComparison[] = [
  {
    id: "comp-deliverer",
    theme: "The Deliverer",
    description: "God raises up deliverers in every cycle, each pointing to Christ the ultimate Deliverer.",
    acrossCycles: [
      { cycle: "@Ad", manifestation: "God Himself provides the promise of deliverance (Gen 3:15)", keyText: "Genesis 3:15" },
      { cycle: "@No", manifestation: "Noah delivers his family through the ark", keyText: "Hebrews 11:7" },
      { cycle: "@Ab", manifestation: "Abraham called to be a blessing to all nations", keyText: "Genesis 12:3" },
      { cycle: "@Mo", manifestation: "Moses delivers Israel from Egypt", keyText: "Exodus 3:10" },
      { cycle: "@Cy", manifestation: "Cyrus delivers Israel from Babylon", keyText: "Isaiah 44:28" },
      { cycle: "@CyC", manifestation: "Christ delivers from sin and death", keyText: "Colossians 1:13" },
      { cycle: "@Sp", manifestation: "Apostles spread deliverance through the gospel", keyText: "Acts 4:12" },
      { cycle: "@Re", manifestation: "Christ returns to deliver His remnant", keyText: "Revelation 19:11-16" }
    ],
    insight: "Every deliverer is a type of Christ. All point to the one Deliverer who saves not from earthly enemies but from sin and death eternally."
  },
  {
    id: "comp-covenant",
    theme: "The Covenant Promise",
    description: "God's covenant faithfulness spans all cycles, building to ultimate fulfillment in Christ.",
    acrossCycles: [
      { cycle: "@Ad", manifestation: "Seed promise given", keyText: "Genesis 3:15" },
      { cycle: "@No", manifestation: "Rainbow covenant - earth preserved", keyText: "Genesis 9:13" },
      { cycle: "@Ab", manifestation: "Abrahamic covenant - blessing to nations", keyText: "Genesis 12:3" },
      { cycle: "@Mo", manifestation: "Sinai covenant - law and nation", keyText: "Exodus 19:5-6" },
      { cycle: "@Cy", manifestation: "Promise of return and restoration", keyText: "Jeremiah 29:10" },
      { cycle: "@CyC", manifestation: "New covenant in Christ's blood", keyText: "Luke 22:20" },
      { cycle: "@Sp", manifestation: "Covenant extended to all nations", keyText: "Galatians 3:14" },
      { cycle: "@Re", manifestation: "Everlasting covenant fully realized", keyText: "Revelation 21:3" }
    ],
    insight: "God's covenants are cumulative, not replacement. Each builds on the previous, all finding their Yes in Christ."
  },
  {
    id: "comp-sanctuary",
    theme: "God Dwelling with His People",
    description: "The sanctuary theme shows God's progressive plan to dwell with humanity.",
    acrossCycles: [
      { cycle: "@Ad", manifestation: "Eden - God walks with man", keyText: "Genesis 3:8" },
      { cycle: "@No", manifestation: "Ark - God preserves a household", keyText: "Genesis 7:1" },
      { cycle: "@Ab", manifestation: "Altars - Abraham meets God at each stop", keyText: "Genesis 12:7" },
      { cycle: "@Mo", manifestation: "Tabernacle - God dwells in the camp", keyText: "Exodus 25:8" },
      { cycle: "@Cy", manifestation: "Temple rebuilt - presence restored", keyText: "Haggai 2:9" },
      { cycle: "@CyC", manifestation: "Christ = Temple in flesh", keyText: "John 2:21" },
      { cycle: "@Sp", manifestation: "Believers = living temples", keyText: "1 Corinthians 3:16" },
      { cycle: "@Re", manifestation: "New Jerusalem - no temple needed, God is present", keyText: "Revelation 21:22" }
    ],
    insight: "The sanctuary theme traces God's determination to dwell with His people, from garden to city, with Christ as the ultimate meeting place."
  },
  {
    id: "comp-enemy",
    theme: "Opposition to God's People",
    description: "Every cycle faces opposition from the serpent's seed, ultimately defeated by Christ.",
    acrossCycles: [
      { cycle: "@Ad", manifestation: "Cain murders Abel", keyText: "Genesis 4:8" },
      { cycle: "@No", manifestation: "World mocks Noah", keyText: "2 Peter 2:5" },
      { cycle: "@Ab", manifestation: "Pharaoh, foreign kings threaten", keyText: "Genesis 12:15" },
      { cycle: "@Mo", manifestation: "Pharaoh, wilderness enemies", keyText: "Exodus 14:9" },
      { cycle: "@Cy", manifestation: "Sanballat, Tobiah oppose rebuilding", keyText: "Nehemiah 4:1-3" },
      { cycle: "@CyC", manifestation: "Herod, Pilate, Satan, death oppose Christ", keyText: "Acts 4:27" },
      { cycle: "@Sp", manifestation: "Persecution, heresy attack church", keyText: "Acts 8:1" },
      { cycle: "@Re", manifestation: "Dragon, beast, false prophet united", keyText: "Revelation 16:13" }
    ],
    insight: "The enemy's strategy remains the same across all cycles: oppose God's people and God's truth. But in every cycle, God preserves His faithful."
  },
  {
    id: "comp-restoration",
    theme: "God's Faithfulness to Restore",
    description: "Despite every fall, God always restores and advances His purpose.",
    acrossCycles: [
      { cycle: "@Ad", manifestation: "Seth raised up, worship continues", keyText: "Genesis 4:26" },
      { cycle: "@No", manifestation: "New beginning after flood", keyText: "Genesis 9:1" },
      { cycle: "@Ab", manifestation: "Isaac born against all hope", keyText: "Genesis 21:2" },
      { cycle: "@Mo", manifestation: "New generation enters Canaan", keyText: "Joshua 21:45" },
      { cycle: "@Cy", manifestation: "Temple rebuilt, covenant renewed", keyText: "Nehemiah 8:10" },
      { cycle: "@CyC", manifestation: "Resurrection - ultimate restoration", keyText: "Matthew 28:6" },
      { cycle: "@Sp", manifestation: "Revival and reformation movements", keyText: "Acts 3:19" },
      { cycle: "@Re", manifestation: "New heaven and new earth", keyText: "Revelation 21:1" }
    ],
    insight: "Every cycle ends with restoration that exceeds what was lost. The final restoration in the new earth will exceed Eden itself."
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCycleEntries = (cycleCode: CycleCode): CycleEntry[] => {
  return cyclesLibrary.filter(entry => entry.cycleCode === cycleCode);
};

export const getCycleEntriesByPhase = (phase: CycleEntry["phase"]): CycleEntry[] => {
  return cyclesLibrary.filter(entry => entry.phase === phase);
};

export const searchCyclesLibrary = (query: string): CycleEntry[] => {
  const lowerQuery = query.toLowerCase();
  return cyclesLibrary.filter(entry =>
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.description.toLowerCase().includes(lowerQuery) ||
    entry.christConnection.toLowerCase().includes(lowerQuery) ||
    entry.keyTexts.some(kt => kt.reference.toLowerCase().includes(lowerQuery) || kt.text.toLowerCase().includes(lowerQuery))
  );
};

export const getCycleComparison = (theme: string): CycleComparison | undefined => {
  return cycleComparisons.find(comp => comp.theme.toLowerCase().includes(theme.toLowerCase()));
};

export const getAllCyclePhases = (): CycleEntry["phase"][] => {
  return ["fall", "covenant", "sanctuary", "enemy", "restoration"];
};

export const getCycleInfo = (cycleCode: CycleCode) => {
  return ptCycles[cycleCode];
};

// Get entries for a specific cycle and phase
export const getCyclePhaseEntry = (cycleCode: CycleCode, phase: CycleEntry["phase"]): CycleEntry | undefined => {
  return cyclesLibrary.find(entry => entry.cycleCode === cycleCode && entry.phase === phase);
};

// Get all comparisons
export const getAllComparisons = (): CycleComparison[] => {
  return cycleComparisons;
};
