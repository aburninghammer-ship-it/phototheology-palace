export interface BlueprintLesson {
  id: number;
  level: string;
  title: string;
  description: string;
  focus: string;
  scripture: string;
  scriptureText: string;
  keyPoints: string[];
  historicalContext: string;
  propheticApplication: string;
  practicalApplication: string;
  crossReferences: string[];
  reflectionQuestion: string;
  prayer: string;
}

export const blueprintLessons: BlueprintLesson[] = [
  // Level 1: The Origin of Sin
  {
    id: 1,
    level: "Level 1: The Origin of Sin",
    title: "Part 1: The War in Heaven",
    description: "The Fall of Angels and the beginning of the Great Controversy",
    focus: "Understanding Lucifer's rebellion and the origin of evil",
    scripture: "Revelation 12:7-9",
    scriptureText: "And there was war in heaven: Michael and his angels fought against the dragon; and the dragon fought and his angels, And prevailed not; neither was their place found any more in heaven. And the great dragon was cast out, that old serpent, called the Devil, and Satan, which deceiveth the whole world: he was cast out into the earth, and his angels were cast out with him.",
    keyPoints: [
      "Lucifer was the most exalted angel, covering cherub by God's throne",
      "Pride entered his heart - he wanted to be equal with God",
      "He deceived 1/3 of the angels to join his rebellion",
      "War broke out in heaven between Michael (Christ) and the dragon (Satan)",
      "Satan and his angels were cast out of heaven to earth",
      "The Great Controversy between good and evil began"
    ],
    historicalContext: "Before creation of Earth, heaven was perfect. Lucifer (meaning 'light bearer') held the highest position among created beings. His beauty, wisdom, and proximity to God's throne made him the model of perfection. But pride corrupted him. He questioned God's authority and government, suggesting God was unjust and restrictive. He subtly planted seeds of doubt among the angels, recruiting followers for his cause. This rebellion forced God to act - not with immediate destruction (which would have left questions about His character), but with exposure of Satan's true nature.",
    propheticApplication: "Revelation 12 shows this heavenly war has continued to Earth. The 'woman' (God's true church) is persecuted by the 'dragon' (Satan working through earthly powers). Throughout history, Satan has used kingdoms and false religious systems to war against God's people. The final phase of this war occurs just before Christ's return when Satan makes his last desperate attempt to defeat God's remnant.",
    practicalApplication: "The war that began in heaven continues in your heart today. Satan still uses the same tactics - questioning God's word, suggesting God is withholding good from you, painting God as harsh and restrictive. Recognizing his methods is the first defense. Like Jesus in the wilderness, respond to temptation with 'It is written.' Stand firm on God's Word, not feelings. Remember: Satan is a defeated foe. Christ won the victory at Calvary.",
    crossReferences: [
      "Isaiah 14:12-15 - Lucifer's fall: 'How art thou fallen from heaven, O Lucifer, son of the morning!'",
      "Ezekiel 28:12-17 - Description of Lucifer's original glory and fall",
      "Luke 10:18 - Jesus saw Satan fall like lightning from heaven",
      "Jude 1:6 - Angels who left their first estate are kept in chains",
      "2 Peter 2:4 - God cast down angels that sinned"
    ],
    reflectionQuestion: "What areas of my life am I most vulnerable to pride? How can I recognize when I'm questioning God's character or authority?",
    prayer: "Father, help me see Satan's deceptions clearly. Guard my heart from pride. Help me trust Your character completely, even when I don't understand Your ways. Thank You that Jesus has already won the victory over Satan. Amen."
  },
  {
    id: 2,
    level: "Level 1: The Origin of Sin",
    title: "Part 2: The War on Earth",
    description: "The Fall of Man and entrance of sin into our world",
    focus: "How Satan extended his rebellion from heaven to Earth through Adam and Eve",
    scripture: "Genesis 3:1-6",
    scriptureText: "Now the serpent was more subtil than any beast of the field which the LORD God had made. And he said unto the woman, Yea, hath God said, Ye shall not eat of every tree of the garden? ...And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat.",
    keyPoints: [
      "Earth was created perfect - no sin, pain, or death",
      "God gave humans one test: don't eat from the Tree of Knowledge of Good and Evil",
      "Satan appeared as a serpent to deceive Eve",
      "His strategy: Question God's word ('Hath God said?'), deny consequences ('Ye shall not surely die'), accuse God's motives ('God knows you'll become like Him')",
      "Eve believed the lie, ate the fruit, gave it to Adam",
      "Sin entered the world - bringing death, separation from God, and suffering"
    ],
    historicalContext: "After being cast from heaven, Satan targeted Earth - God's newest creation. The Garden of Eden was paradise. Adam and Eve walked with God in perfect fellowship. They had everything they needed. But God gave them free will - including the freedom to reject Him. The Tree of Knowledge was the test. Would they trust God's word above their own desires? Satan waited for the perfect moment. He approached Eve when she was alone, away from Adam's protection. He twisted God's words, made sin look attractive, and cast doubt on God's goodness.",
    propheticApplication: "The pattern of Satan's attack on Eve is the same pattern he uses throughout history: Question God's Word → Deny consequences of sin → Accuse God of withholding good. This exact pattern is repeated in the end times as Satan deceives the whole world (Revelation 12:9). False teachers question the authority of Scripture, popular culture denies that sin leads to death, and society portrays God as restrictive and outdated. The remnant church must stand firm on God's Word, just as Christ did in the wilderness when He defeated Satan's temptations with 'It is written.'",
    practicalApplication: "Every temptation follows Satan's Eden playbook: 1) Did God really say...? (Question the Bible) 2) You won't really die... (Minimize sin's consequences) 3) You'll be like God... (Appeal to pride). Your defense: Know God's Word. When tempted, identify which part of Satan's strategy is being used. Don't dialog with temptation like Eve did - shut it down immediately with Scripture. Run from situations where you're isolated and vulnerable. Stay in God's presence through prayer.",
    crossReferences: [
      "Romans 5:12 - By one man sin entered the world, and death by sin",
      "Genesis 2:16-17 - God's original command about the tree",
      "2 Corinthians 11:3 - Paul warns: 'as the serpent beguiled Eve'",
      "1 Timothy 2:14 - Adam was not deceived, but Eve was",
      "James 1:14-15 - Sin conceived brings forth death"
    ],
    reflectionQuestion: "Where in my life am I most tempted to question what God has clearly said? What forbidden 'fruit' am I rationalizing as 'not that bad'?",
    prayer: "Lord Jesus, You defeated Satan's temptations in the wilderness. Strengthen me to resist temptation by standing on Your Word. Help me not to dialog with sin, but to flee from it. Give me wisdom to recognize Satan's strategies. Thank You for the victory You've already won. Amen."
  },

  // Level 2: The Plan of Redemption
  {
    id: 3,
    level: "Level 2: The Plan of Redemption",
    title: "Part 3: The Plan of Salvation",
    description: "God's Blueprint revealed through the sanctuary",
    focus: "How God's sanctuary system reveals His plan to save humanity",
    scripture: "Exodus 25:8-9",
    scriptureText: "And let them make me a sanctuary; that I may dwell among them. According to all that I shew thee, after the pattern of the tabernacle, and the pattern of all the instruments thereof, even so shall ye make it.",
    keyPoints: [
      "Immediately after sin, God promised a Redeemer (Genesis 3:15)",
      "The sanctuary was God's visual aid showing His plan of salvation",
      "Every element pointed to Christ: the Lamb, the Priest, the Mediator",
      "The sanctuary had 2 apartments and 2 main services: Daily and Yearly",
      "Daily service: Sin confessed, lamb sacrificed, blood applied - pointing to Christ's sacrifice",
      "Yearly service: Day of Atonement, cleansing the sanctuary - pointing to final judgment"
    ],
    historicalContext: "After Adam and Eve sinned, God didn't abandon them. He made a promise: 'The seed of the woman shall bruise the serpent's head' (Genesis 3:15). This was the first gospel promise - a Redeemer would come. To teach His people about this salvation, God designed an elaborate visual system: the sanctuary. Moses was shown the exact pattern on Mount Sinai. Every color, material, measurement had meaning. The outer court represented Earth, the Holy Place represented heaven, and the Most Holy Place represented God's throne room. The daily services taught forgiveness through sacrifice. The yearly Day of Atonement taught final judgment and cleansing from sin.",
    propheticApplication: "The sanctuary is God's GPS through Bible prophecy. Daniel 8:14 says 'unto 2300 days, then shall the sanctuary be cleansed' - pointing to 1844 when Jesus began the final phase of His ministry (investigative judgment). The daily service represents Jesus' sacrifice at Calvary and His ongoing intercession. The yearly Day of Atonement represents the pre-Advent judgment happening now before Jesus returns. Every prophecy in Daniel and Revelation connects to the sanctuary. Understanding the sanctuary is the key to unlocking prophecy.",
    practicalApplication: "The sanctuary teaches you how salvation works: 1) You sin (everyone does). 2) You confess (daily service). 3) Christ's blood covers you (the Lamb - Christ is the LORD'S goat that was slain, not the scapegoat). 4) Your life is reviewed (yearly service/judgment). 5) Sin is finally removed and placed on its originator, Satan (the scapegoat represents Azazel/Satan, not Christ). Where are you in this process? Have you confessed your sins? Have you accepted Christ's sacrifice? Are you living ready for the judgment? Don't just know about the sanctuary - live the sanctuary experience daily.",
    crossReferences: [
      "Hebrews 8:1-2 - Christ is High Priest in the true tabernacle in heaven",
      "Hebrews 9:11-12 - Christ entered the heavenly sanctuary with His own blood",
      "Leviticus 16 - Complete description of the Day of Atonement service",
      "Daniel 8:14 - The 2300-day prophecy and cleansing of sanctuary",
      "Revelation 11:19 - John sees the ark in God's temple in heaven"
    ],
    reflectionQuestion: "Do I truly understand how Christ's sacrifice saves me? Am I living as though the final judgment is happening now?",
    prayer: "Father, thank You for designing a system that shows Your plan so clearly. Help me understand the sanctuary and its meaning for my life. Jesus, thank You for being my Lamb, my High Priest, and my Advocate. Prepare me for the judgment. Amen."
  },

  // Level 3: God's Advance
  {
    id: 4,
    level: "Level 3: God's Advance",
    title: "Part 4: The 70 Weeks Prophecy",
    description: "Messianic prophecy and Satan's first counterattack",
    focus: "Daniel's prophecy pinpointing the exact time of Jesus' ministry",
    scripture: "Daniel 9:24-27",
    scriptureText: "Seventy weeks are determined upon thy people... Know therefore and understand, that from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince shall be seven weeks, and threescore and two weeks... And he shall confirm the covenant with many for one week: and in the midst of the week he shall cause the sacrifice and the oblation to cease.",
    keyPoints: [
      "70 weeks = 490 days = 490 years (day-year principle)",
      "Starting point: 457 BC (decree to restore Jerusalem)",
      "69 weeks (483 years) = 27 AD: Jesus baptized as 'Messiah the Prince'",
      "Middle of 70th week = 31 AD: Jesus crucified, ending sacrificial system",
      "End of 70 weeks = 34 AD: Gospel goes to Gentiles (Stephen's martyrdom)",
      "This prophecy proved Jesus was the Messiah with mathematical precision"
    ],
    historicalContext: "Daniel was in Babylonian captivity when he received this prophecy. He had been studying Jeremiah's prophecy of 70 years of captivity and was praying for his people's restoration. God answered with a far greater timeline - 70 prophetic 'weeks' revealing when Messiah would come. Three decrees were issued to restore Jerusalem: Cyrus (538 BC), Darius (520 BC), and Artaxerxes (457 BC). The complete restoration decree was Artaxerxes' in 457 BC. Counting 483 years forward leads to 27 AD - the exact year Jesus was baptized and began His ministry at age 30. In the middle of the final week (3.5 years later), Jesus was crucified in 31 AD.",
    propheticApplication: "The 70 weeks are cut off from the 2300-day prophecy of Daniel 8:14. While 70 weeks were given to the Jewish nation, the remaining time (2300 - 490 = 1810 years) extended to 1844. This is when Jesus began the final phase of His ministry - the cleansing of the heavenly sanctuary (investigative judgment). Satan tried to prevent this prophecy by having Jesus killed as a baby (Herod's slaughter) and by tempting Him to sin. But Jesus lived perfectly and fulfilled every specification. Now Satan tries to obscure this prophecy so people won't understand that judgment began in 1844.",
    practicalApplication: "This prophecy is mathematical proof that Jesus is the Messiah. When skeptics doubt Christianity, show them Daniel 9. It was written 500+ years before Christ and predicted the exact year of His ministry. This should strengthen your faith immensely. More importantly, if God was this precise about Jesus' first coming, you can trust He'll be precise about His second coming. Live ready. If this prophecy points to 1844 as the start of judgment, that means judgment is happening now. Your life is under review. Are you living worthy of God's approval?",
    crossReferences: [
      "Ezra 7:11-26 - The 457 BC decree of Artaxerxes",
      "Luke 3:1, 21-23 - Jesus baptized in 27 AD (15th year of Tiberius)",
      "Galatians 4:4 - When the fullness of time came, God sent His Son",
      "Acts 7:51-60 - Stephen's martyrdom marking end of 490 years (34 AD)",
      "Daniel 8:14 - The 2300-day prophecy that the 70 weeks are part of"
    ],
    reflectionQuestion: "Does my life reflect confidence that Jesus fulfilled this prophecy perfectly? Am I living as though the final judgment is happening right now?",
    prayer: "Lord, thank You for the mathematical precision of Your prophetic word. The 70 weeks prove You are in control of history. Help me trust Your timing for Jesus' return. Prepare my heart for the judgment. Amen."
  },

  {
    id: 5,
    level: "Level 3: Satan's Counter",
    title: "Part 5: The 1,260 Years Prophecy",
    description: "The Dark Ages and Satan's second counterattack",
    focus: "Satan's attempt to destroy truth through a corrupt religious system",
    scripture: "Daniel 7:25",
    scriptureText: "And he shall speak great words against the most High, and shall wear out the saints of the most High, and think to change times and laws: and they shall be given into his hand until a time and times and the dividing of time.",
    keyPoints: [
      "'Time, times, dividing of time' = 3.5 prophetic years = 1260 days = 1260 literal years",
      "Timeline: 538 AD to 1798 AD",
      "Little Horn power (papal Rome) persecuted true believers",
      "Millions martyred for their faith during this period",
      "Satan tried to destroy the Bible and replace God's law with human traditions",
      "At the end (1798), Napoleon's general took the pope captive - 'deadly wound'"
    ],
    historicalContext: "After the fall of pagan Rome (476 AD), a new power rose from its ruins: papal Rome. In 538 AD, the last of three Arian kingdoms was defeated, giving the papacy supreme religious and political power. For over 1200 years, Europe was controlled by this system. Those who rejected papal authority were branded heretics and often executed. The Bible was chained in Latin (a dead language), keeping truth from common people. Saints were persecuted, Scripture was forbidden, and human tradition replaced God's Word. The Inquisition tortured and killed millions. But God preserved His truth through faithful believers like the Waldenses in mountain valleys and reformers like Wycliffe who translated the Bible.",
    propheticApplication: "This same power that ruled for 1260 years received a 'deadly wound' in 1798 when Napoleon captured Pope Pius VI. But Revelation 13:3 says the wound 'was healed: and all the world wondered after the beast.' Today we see this prophecy fulfilling - the papacy has regained global influence. World leaders visit the Vatican. Papal statements shape policy. The final crisis will involve this power attempting to enforce Sunday worship (mark of the beast) in opposition to God's Sabbath. Just as the 1260 years of persecution came, so will final persecution before Jesus returns.",
    practicalApplication: "Many believers today are biblically illiterate - just like during the Dark Ages. Don't depend on tradition or popular preachers - search the Scriptures yourself. The same spirit that persecuted saints for 1260 years is still active, now working to make biblical Christianity seem intolerant and outdated. Expect to be mocked for standing on God's Word. Remember the martyrs who gave their lives rather than compromise truth. Are you willing to stand alone if necessary? Study prophecy so you won't be deceived when the final crisis comes.",
    crossReferences: [
      "Revelation 12:6 - Woman flees to wilderness for 1260 days",
      "Revelation 13:5 - Beast given authority for 42 months (1260 days)",
      "Daniel 12:7 - Time, times, half a time mentioned again",
      "Revelation 13:3 - Deadly wound was healed",
      "2 Thessalonians 2:3-4 - The man of sin exalts himself above God"
    ],
    reflectionQuestion: "Am I more influenced by religious tradition or by Scripture alone? Would I be willing to stand for truth if it cost me everything?",
    prayer: "Father, give me courage like the Waldenses and Reformers. Help me value Your Word above all tradition. Strengthen me to stand for truth in the coming crisis. Thank You for preserving Your Word through the dark ages. Amen."
  },

  {
    id: 6,
    level: "Level 3: God's Advance",
    title: "Part 6: The 2,300 Days Prophecy",
    description: "The cleansing of the sanctuary and investigative judgment",
    focus: "Understanding the judgment that began in 1844",
    scripture: "Daniel 8:14",
    scriptureText: "And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed.",
    keyPoints: [
      "2300 prophetic days = 2300 literal years",
      "Starting point: 457 BC (same as 70 weeks - they're connected)",
      "2300 years from 457 BC = 1844 AD",
      "The sanctuary is in heaven (earthly was just a copy)",
      "Cleansing = Day of Atonement = investigative judgment",
      "Jesus moved from Holy Place to Most Holy Place in 1844"
    ],
    historicalContext: "In 1844, thousands of Christians (led by William Miller) expected Jesus to return based on their study of Daniel 8:14. They thought 'the sanctuary' meant the earth being cleansed by fire at Jesus' coming. When Jesus didn't return, it caused the 'Great Disappointment.' But faithful Bible students kept searching and discovered their mistake: the sanctuary to be cleansed wasn't Earth, but the heavenly sanctuary. October 22, 1844 was a Day of Atonement - the day Jesus moved from the Holy Place (daily ministry) to the Most Holy Place (final judgment before His return). This began the investigative judgment - the pre-Advent review of every person's life.",
    propheticApplication: "We are living in the judgment hour right now. This is why Revelation 14:7 (first angel's message) proclaims 'the hour of his judgment is come.' The books of heaven are open. Every person's life - starting with those who died first - is under review. Soon the judgment of the living will begin. When that phase completes, Jesus will declare 'He that is unjust, let him be unjust still... and he that is righteous, let him be righteous still' (Rev 22:11). Then probation closes and the seven last plagues fall. Christ returns to execute the judgment already rendered.",
    practicalApplication: "Your life is under divine review. Not to see if you're perfect (you're not), but to see if you've accepted Christ's perfection by faith. Are you clinging to Jesus as your Savior and Lord? Is there unconfessed sin? Harbored rebellion? Secret compromise? The judgment is not something to fear if you're in Christ - it's meant to vindicate you before the universe. Let it motivate holy living. Live as though Jesus is examining your record today, because He is. The judgment message should create urgency for sharing the gospel before probation closes.",
    crossReferences: [
      "Hebrews 9:23-24 - Heavenly sanctuary needs cleansing",
      "Leviticus 16 - Day of Atonement procedures (shadow of judgment)",
      "Revelation 14:6-7 - Judgment hour is come",
      "Daniel 7:9-10 - Throne scene showing judgment",
      "Revelation 11:19 - Ark of covenant seen in God's temple (Most Holy Place)"
    ],
    reflectionQuestion: "If Jesus is reviewing my life record today, what would He find? Is there anything I'm hiding that needs to be confessed?",
    prayer: "Lord Jesus, I'm living in the judgment hour. Cleanse my heart. Cover me with Your righteousness. Help me live ready for that moment when probation closes. Thank You for being my Advocate. Amen."
  },

  // Level 4: Final Warnings
  {
    id: 7,
    level: "Level 4: Final Warnings",
    title: "Part 7: The Three Angels' Messages",
    description: "God's last call to the world before Christ returns",
    focus: "Understanding Revelation 14's urgent end-time messages",
    scripture: "Revelation 14:6-12",
    scriptureText: "And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth... Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters.",
    keyPoints: [
      "First Angel: Judgment hour is come - worship the Creator (points to Sabbath)",
      "Second Angel: Babylon is fallen - false religious systems exposed",
      "Third Angel: Warning against mark of the beast - don't worship the beast or receive his mark",
      "These messages must go to every nation, kindred, tongue, and people before Jesus returns",
      "They create a separation - those who keep God's commandments vs those who receive the mark",
      "This is God's final mercy call before the seven last plagues"
    ],
    historicalContext: "These three messages are sequential and build on each other. Starting in 1844 (judgment hour), God raised up a movement to proclaim these truths. The first angel calls people back to worshiping the Creator - which includes keeping His Sabbath (the Sabbath commandment is the only one that identifies God as Creator). The second angel exposes Babylon - a term representing all false religious systems that have mixed truth with error. The third angel gives the most solemn warning in Scripture - against receiving the mark of the beast (enforced Sunday worship in opposition to God's Sabbath).",
    propheticApplication: "We are seeing these messages fulfill before our eyes. The judgment hour message has been proclaimed since 1844. The fall of Babylon is accelerating - people are leaving spiritually dead churches. Soon the final crisis will come: a global Sunday law enforced by the beast power (papal Rome) with support from fallen Protestantism and the USA (the second beast of Revelation 13). Those who refuse to worship on Sunday and instead keep God's Sabbath will face persecution and economic boycott. But they are the remnant who 'keep the commandments of God and have the testimony of Jesus' (Rev 12:17).",
    practicalApplication: "These messages demand a response. You can't be neutral. Which side will you be on? The first step is accepting the judgment hour message - Jesus is your judge and advocate. Next, come out of Babylon - don't compromise truth for popularity or tradition. Finally, prepare now for the mark of the beast crisis. Study the Sabbath truth. Understand why it matters. Develop a character now that will stand faithful later. Share these messages with others - they need to know what's coming. Time is running out.",
    crossReferences: [
      "Revelation 18:1-4 - Babylon is fallen, come out of her my people",
      "Exodus 20:8-11 - Sabbath commandment identifies God as Creator",
      "Revelation 13:11-18 - The second beast enforces mark of first beast",
      "Revelation 12:17 - Remnant keep commandments and have testimony of Jesus",
      "Revelation 15:1-4 - Those victorious over beast stand on sea of glass"
    ],
    reflectionQuestion: "Have I responded to these three messages? Am I ready to stand faithful when the mark of the beast is enforced?",
    prayer: "Father, give me courage to proclaim these messages. Help me prepare for the coming crisis. I choose to worship You as Creator by keeping Your Sabbath holy. Bring me out of Babylon completely. Give me the seal of God. Amen."
  },

  {
    id: 8,
    level: "Level 4: Final Warnings",
    title: "Part 8: The Time of Trouble",
    description: "The seven last plagues and earth's final crisis",
    focus: "Understanding what happens after probation closes",
    scripture: "Revelation 16:1",
    scriptureText: "And I heard a great voice out of the temple saying to the seven angels, Go your ways, and pour out the vials of the wrath of God upon the earth.",
    keyPoints: [
      "After probation closes, the seven last plagues fall",
      "These plagues parallel the plagues of Egypt before the Exodus",
      "They fall ONLY on those who have the mark of the beast",
      "God's people are protected during this time (like Israel in Goshen)",
      "This is 'Jacob's trouble' - a time of testing for the remnant",
      "The plagues prove God's justice and expose Satan's cruelty",
      "They climax with the battle of Armageddon"
    ],
    historicalContext: "Throughout history, God has been patient. 'The Lord is not slack concerning his promise... but is longsuffering' (2 Peter 3:9). But there comes a point when mercy ends and judgment begins. After the judgment is complete and every case is decided, Jesus declares 'it is done' (Rev 16:17) and the plagues fall. Just as the plagues of Egypt demonstrated God's power and exposed Pharaoh's stubbornness, the seven last plagues will demonstrate God's righteousness and expose Satan's true character. They will be unlike anything earth has ever experienced - pure, unmixed wrath without mercy.",
    propheticApplication: "The seven plagues include: (1) Grievous sores on those with the mark (2) Sea turns to blood (3) Rivers and fountains become blood (4) Scorching heat from the sun (5) Darkness on the beast's kingdom (6) Euphrates dries up preparing for kings of the east (7) Great earthquake, massive hail, Babylon divided into three parts. During this time, God's people will be hunted. They'll have to flee to mountains and desolate places. They'll have no human protection. Food will be scarce. But God will supernaturally sustain them, just as He fed Elijah by ravens and Israel with manna.",
    practicalApplication: "This is why you must develop a character NOW that can stand then. You can't wait until the crisis to decide to be faithful. Jesus said you must be faithful in little things to be faithful in much. Practice sacrifice now. Learn to trust God when you can't see the way. Memorize Scripture now - you may not have a Bible then. Build prayer habits now - you'll need to hear God's voice then. Most importantly, surrender completely to Jesus NOW. Let Him root out every compromise, every secret sin, every divided loyalty. Those who make it through the time of trouble will be those who learned to depend utterly on God before it came.",
    crossReferences: [
      "Exodus 7-12 - The ten plagues of Egypt (type of last plagues)",
      "Revelation 15:1 - Seven angels with seven last plagues",
      "Jeremiah 30:7 - 'Time of Jacob's trouble'",
      "Psalm 91 - Protection during the plagues",
      "Daniel 12:1 - 'Time of trouble such as never was'",
      "Matthew 24:21-22 - Great tribulation shortened for elect's sake"
    ],
    reflectionQuestion: "Am I developing a character now that can stand in the time of trouble? What areas of compromise in my life would cause me to fall away under pressure?",
    prayer: "Lord, the time of trouble is coming. Prepare me now. Root out every compromise. Teach me to trust You completely. Help me be faithful in small tests now so I can be faithful in the great test then. Thank You for Your promise of protection. Amen."
  },

  // Level 5: Earth's Final Movie
  {
    id: 9,
    level: "Level 5: Earth's Final Movie",
    title: "Part 9: The Second Coming",
    description: "Christ's return and the resurrection of the righteous",
    focus: "The glorious moment all creation has waited for",
    scripture: "1 Thessalonians 4:16-17",
    scriptureText: "For the Lord himself shall descend from heaven with a shout, with the voice of the archangel, and with the trump of God: and the dead in Christ shall rise first: Then we which are alive and remain shall be caught up together with them in the clouds, to meet the Lord in the air: and so shall we ever be with the Lord.",
    keyPoints: [
      "Jesus returns visibly - every eye will see Him",
      "He comes with power and great glory, with all the holy angels",
      "First, the righteous dead are resurrected",
      "Then the living righteous are translated without seeing death",
      "Together they are caught up to meet Jesus in the air",
      "The wicked are destroyed by the brightness of His coming",
      "This begins the 1000 years (millennium) with Christ in heaven"
    ],
    historicalContext: "For 6000 years, sin has dominated Earth. Death has reigned. Satan has claimed this planet. But Jesus promised 'I will come again' (John 14:3). Every prophet looked forward to this day. Job said 'I know that my redeemer liveth, and that he shall stand at the latter day upon the earth' (Job 19:25). Isaiah foresaw 'the ransomed of the LORD shall return' (Isa 35:10). Jesus Himself described His return: 'as the lightning cometh out of the east, and shineth even unto the west; so shall also the coming of the Son of man be' (Matt 24:27). It will be the most spectacular event in history - visible, audible, physical, and unmistakable.",
    propheticApplication: "There will be no secret rapture. Jesus comes ONCE more before the millennium. Those who teach a 'secret rapture' or multiple comings contradict Scripture. When Jesus comes: (1) Righteous dead raised (2) Righteous living translated (3) Both groups taken to heaven (4) Wicked destroyed (5) Satan bound to this desolate earth for 1000 years. During the millennium, the righteous will be in heaven reviewing the records of the wicked, understanding why some were lost. At the millennium's end, Jesus returns to earth a third time with the New Jerusalem, the wicked are raised, Satan is loosed for a short time, and the final judgment occurs.",
    practicalApplication: "This is our blessed hope! Every trial here is temporary. 'Our light affliction, which is but for a moment, worketh for us a far more exceeding and eternal weight of glory' (2 Cor 4:17). When you're discouraged, remember: Jesus is coming soon. When you face persecution for your faith, remember: deliverance is near. When you're tempted to give up, remember: the reward is worth it. Watch for the signs of His coming (Matt 24). Don't set dates (Matt 24:36), but live ready. Every day should be lived as though Jesus might come today. Are you ready?",
    crossReferences: [
      "Matthew 24:30-31 - Sign of Son of Man in heaven, angels gather elect",
      "Revelation 1:7 - Every eye shall see Him",
      "Revelation 19:11-16 - Jesus on white horse, King of kings",
      "1 Corinthians 15:51-54 - The dead raised incorruptible",
      "Revelation 6:14-17 - Wicked cry for rocks to hide them",
      "Acts 1:9-11 - Same Jesus will return in like manner"
    ],
    reflectionQuestion: "If Jesus came today, would I be ready? What in my life would I regret not doing or confessing?",
    prayer: "Even so, come, Lord Jesus! I long for Your appearing. Help me live ready every day. Thank You for the promise of resurrection and eternal life. Purify my heart as I wait for You. Amen."
  },

  {
    id: 10,
    level: "Level 5: Earth's Final Movie",
    title: "Part 10: The Final Judgment & New Earth",
    description: "The millennium, final judgment, and God's eternal kingdom",
    focus: "The complete victory of Christ and restoration of all things",
    scripture: "Revelation 21:1-4",
    scriptureText: "And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea. And I John saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband. And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God. And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    keyPoints: [
      "During the millennium (1000 years), Satan is bound on this desolate earth",
      "The righteous review the records in heaven, understanding God's justice",
      "After 1000 years, Jesus returns with the New Jerusalem and all the saints",
      "The wicked dead are resurrected",
      "Satan is loosed briefly and deceives them one final time",
      "The wicked surround the holy city, but fire from heaven destroys them",
      "This is the lake of fire - the second death - final and complete destruction",
      "God creates a new heaven and new earth - the original plan restored"
    ],
    historicalContext: "The millennium is not on Earth but in heaven. Jeremiah 4:23-27 describes Earth during this time as 'without form and void' (same language as Genesis 1:2 before creation) - no people, cities destroyed, total desolation. Satan is 'bound' not by chains but by circumstances - he has no one to tempt. The righteous spend 1000 years understanding why some were lost, participating in judgment as Paul indicated: 'Do ye not know that the saints shall judge the world?' (1 Cor 6:2). This gives them confidence in God's justice before sin is finally destroyed forever. Then comes the recreation - the 'new heaven and new earth' where righteousness dwells eternally.",
    propheticApplication: "After the millennium, the Holy City descends. God makes one final attempt to save the wicked by showing them what they rejected. The wicked see Jesus crowned, see the redeemed joyful, and witness their own life records played before them. Conviction overwhelms them - 'every knee shall bow, every tongue confess that Jesus Christ is Lord' (Phil 2:10-11). But it's too late. They chose Satan. Now they follow him in one last rebellion - surrounding the city. Fire falls from heaven (the lake of fire). This fire is thorough - it leaves neither root nor branch (Mal 4:1). The wicked are completely destroyed - not eternally tormented. Then God creates new.",
    practicalApplication: "This is where the Great Controversy ends. Sin is finally destroyed. Satan is no more. Death is dead. All questions are answered. God's character is vindicated before the entire universe. And you - if you've chosen Jesus - will live forever on the new earth. You'll build houses, plant vineyards, never experience pain, death, or sorrow again. You'll see your loved ones who died in Christ. You'll meet the heroes of faith. You'll explore the universe. Best of all - you'll be with Jesus face to face forever. This is not fantasy - this is your future if you hold fast to Christ. Let this hope sustain you through every trial. The journey is hard, but the destination is worth it all.",
    crossReferences: [
      "Revelation 20:1-15 - Complete description of the millennium and final judgment",
      "Jeremiah 4:23-27 - Earth during millennium",
      "1 Corinthians 6:2-3 - Saints judge the world and angels",
      "Malachi 4:1-3 - Wicked become ashes under feet of righteous",
      "2 Peter 3:10-13 - Old earth destroyed by fire, new earth created",
      "Isaiah 65:17-25 - Description of life on the new earth"
    ],
    reflectionQuestion: "Does my daily life reflect the reality that I'm living for eternity? What am I investing in - things that burn or things that last?",
    prayer: "Father, thank You for Your plan to restore all things. Thank You for the promise of the new earth where I'll live with You forever. Help me live worthy of this calling. Keep my eyes on eternity. I choose Jesus and His eternal kingdom. Maranatha! Amen."
  }
];
