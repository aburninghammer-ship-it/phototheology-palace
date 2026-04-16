// Theme Room Library - The 6 Walls of Biblical Themes

export interface ThemeEntry {
  id: string;
  title: string;
  theme: "life-of-jesus" | "gospel" | "heaven" | "great-controversy" | "time-prophecy" | "sanctuary";
  subTheme?: string;
  description: string;
  keyVerses: { reference: string; text: string }[];
  connections: string[];
  studyQuestions: string[];
  practicalApplication: string;
}

// THEME CATEGORIES - The 6 Walls of the Theme Room
export const themeCategories = {
  "life-of-jesus": {
    name: "Life of Jesus Wall",
    description: "Every event and teaching in Christ's life on earth",
    icon: "Heart",
    color: "from-rose-500 to-pink-600"
  },
  "gospel": {
    name: "Gospel Floor",
    description: "The good news of salvation through faith in Christ",
    icon: "Book",
    color: "from-amber-500 to-orange-600"
  },
  "heaven": {
    name: "Heaven Ceiling",
    description: "The heavenly realms, angels, and God's throne",
    icon: "Cloud",
    color: "from-sky-500 to-blue-600"
  },
  "great-controversy": {
    name: "Great Controversy Wall",
    description: "The cosmic conflict between Christ and Satan",
    icon: "Swords",
    color: "from-purple-500 to-violet-600"
  },
  "time-prophecy": {
    name: "Time Prophecy Wall",
    description: "Prophetic timelines and their fulfillments",
    icon: "Clock",
    color: "from-emerald-500 to-teal-600"
  },
  "sanctuary": {
    name: "Sanctuary Wall",
    description: "The earthly and heavenly sanctuary services",
    icon: "Church",
    color: "from-yellow-500 to-amber-600"
  }
};

export const themesLibrary: ThemeEntry[] = [
  // LIFE OF JESUS WALL
  {
    id: "birth-jesus",
    title: "The Birth of Jesus",
    theme: "life-of-jesus",
    subTheme: "Incarnation",
    description: "God became flesh, born in Bethlehem to a virgin, announced by angels, worshiped by shepherds and wise men.",
    keyVerses: [
      { reference: "John 1:14", text: "The Word became flesh and dwelt among us" },
      { reference: "Luke 2:7", text: "She brought forth her firstborn Son, and wrapped Him in swaddling cloths" },
      { reference: "Matthew 1:23", text: "They shall call His name Immanuel, which is translated, 'God with us'" }
    ],
    connections: ["Virgin birth fulfills Isaiah 7:14", "Bethlehem fulfills Micah 5:2", "Egypt fulfills Hosea 11:1"],
    studyQuestions: ["Why did God choose to enter humanity as a baby?", "What does 'Immanuel' mean for your daily life?"],
    practicalApplication: "Jesus understands human weakness because He lived it. He is truly 'with us' in every situation."
  },
  {
    id: "baptism-jesus",
    title: "The Baptism of Jesus",
    theme: "life-of-jesus",
    subTheme: "Anointing",
    description: "Jesus was baptized by John in the Jordan River. The Spirit descended like a dove, and the Father spoke from heaven.",
    keyVerses: [
      { reference: "Matthew 3:16-17", text: "He saw the Spirit of God descending like a dove... 'This is My beloved Son, in whom I am well pleased'" },
      { reference: "Acts 10:38", text: "God anointed Jesus of Nazareth with the Holy Spirit and with power" }
    ],
    connections: ["Begins 69th week of Daniel 9", "Trinity revealed", "Example for believers", "Anointing = 'Messiah/Christ'"],
    studyQuestions: ["Why did the sinless One need baptism?", "What is the significance of all three Persons of the Trinity being present?"],
    practicalApplication: "Baptism marks the beginning of public ministry. Have you been baptized as a testimony of your faith?"
  },
  {
    id: "temptation-jesus",
    title: "The Temptation in the Wilderness",
    theme: "life-of-jesus",
    subTheme: "Victory",
    description: "Jesus fasted 40 days and was tempted by Satan on appetite, presumption, and worldly power—yet without sin.",
    keyVerses: [
      { reference: "Matthew 4:1-11", text: "Jesus was led up by the Spirit into the wilderness to be tempted by the devil" },
      { reference: "Hebrews 4:15", text: "He was in all points tempted as we are, yet without sin" }
    ],
    connections: ["Reverses Adam's failure", "40 days parallels Israel's 40 years", "Answered each temptation with 'It is written'"],
    studyQuestions: ["How did Jesus resist temptation?", "What three areas did Satan attack?"],
    practicalApplication: "Scripture is our weapon against temptation. Memorize key verses for your areas of struggle."
  },
  {
    id: "sermon-mount",
    title: "The Sermon on the Mount",
    theme: "life-of-jesus",
    subTheme: "Teaching",
    description: "Jesus' foundational teaching on kingdom ethics: Beatitudes, salt and light, the Law's spirit, prayer, trust, and building on rock.",
    keyVerses: [
      { reference: "Matthew 5:3", text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven" },
      { reference: "Matthew 5:17", text: "I did not come to destroy the Law but to fulfill" },
      { reference: "Matthew 7:24", text: "Whoever hears these sayings of Mine, and does them, I will liken him to a wise man who built his house on the rock" }
    ],
    connections: ["New Moses giving new law from the mountain", "Deepens the Ten Commandments", "Lord's Prayer model"],
    studyQuestions: ["Which Beatitude speaks most to your current situation?", "How is Jesus' teaching different from the Pharisees'?"],
    practicalApplication: "True righteousness is internal, not just external. Check your heart, not just your behavior."
  },
  {
    id: "miracles-jesus",
    title: "The Miracles of Jesus",
    theme: "life-of-jesus",
    subTheme: "Power",
    description: "Jesus healed the sick, raised the dead, calmed storms, multiplied food, and cast out demons—demonstrating divine authority.",
    keyVerses: [
      { reference: "John 20:30-31", text: "These are written that you may believe that Jesus is the Christ" },
      { reference: "Acts 2:22", text: "Jesus of Nazareth, a Man attested by God to you by miracles, wonders, and signs" }
    ],
    connections: ["Nature miracles (Creator)", "Healing miracles (Restorer)", "Resurrection miracles (Life-giver)", "Exorcisms (Conqueror)"],
    studyQuestions: ["What do the miracles reveal about Jesus' identity?", "Why did Jesus sometimes tell people not to spread the news?"],
    practicalApplication: "The same power that raised Lazarus is available to transform your life today."
  },
  {
    id: "parables-jesus",
    title: "The Parables of Jesus",
    theme: "life-of-jesus",
    subTheme: "Teaching",
    description: "Jesus taught in parables—earthly stories with heavenly meanings—to reveal truth to seekers and conceal it from the hard-hearted.",
    keyVerses: [
      { reference: "Matthew 13:34", text: "Without a parable He did not speak to them" },
      { reference: "Mark 4:11", text: "To you it has been given to know the mystery of the kingdom of God" }
    ],
    connections: ["Sower and soils (hearts)", "Prodigal Son (grace)", "Good Samaritan (love)", "Talents (stewardship)", "Sheep and Goats (judgment)"],
    studyQuestions: ["Why did Jesus teach in parables?", "Which parable challenges you the most?"],
    practicalApplication: "Parables require reflection. Take time to ask: 'What is Jesus teaching ME in this story?'"
  },
  {
    id: "transfiguration",
    title: "The Transfiguration",
    theme: "life-of-jesus",
    subTheme: "Glory",
    description: "On a mountain, Jesus' divine glory was revealed. Moses and Elijah appeared. The Father spoke: 'This is My beloved Son.'",
    keyVerses: [
      { reference: "Matthew 17:2", text: "He was transfigured before them. His face shone like the sun" },
      { reference: "2 Peter 1:16-18", text: "We were eyewitnesses of His majesty" }
    ],
    connections: ["Moses (Law) and Elijah (Prophets) testify", "Preview of Second Coming glory", "Strengthening before the cross"],
    studyQuestions: ["Why did Moses and Elijah appear?", "How did this prepare Jesus and the disciples for the cross?"],
    practicalApplication: "Mountaintop experiences prepare us for valley challenges. Store up spiritual strength."
  },
  {
    id: "last-supper",
    title: "The Last Supper",
    theme: "life-of-jesus",
    subTheme: "Covenant",
    description: "Jesus celebrated Passover with His disciples, instituted the Lord's Supper, washed feet, and gave the new commandment of love.",
    keyVerses: [
      { reference: "Luke 22:19-20", text: "This is My body... This cup is the new covenant in My blood" },
      { reference: "John 13:34-35", text: "A new commandment I give to you, that you love one another" }
    ],
    connections: ["Passover fulfilled in Christ", "Communion instituted", "Foot-washing = servant leadership", "Judas exposed"],
    studyQuestions: ["Why did Jesus wash the disciples' feet?", "What is the 'new covenant'?"],
    practicalApplication: "Communion reminds us of Christ's sacrifice. Foot-washing calls us to humble service."
  },
  {
    id: "gethsemane",
    title: "Gethsemane: The Agony",
    theme: "life-of-jesus",
    subTheme: "Submission",
    description: "Jesus prayed in anguish, sweating blood, facing the cup of God's wrath against sin. 'Not My will, but Yours be done.'",
    keyVerses: [
      { reference: "Luke 22:42-44", text: "Not My will, but Yours, be done... His sweat became like great drops of blood" },
      { reference: "Hebrews 5:7", text: "He offered up prayers and supplications, with vehement cries and tears" }
    ],
    connections: ["Garden reversal (Eden→Gethsemane)", "Cup of wrath (Isa 51:17)", "Angel strengthening (Luke 22:43)"],
    studyQuestions: ["What was in the 'cup' Jesus dreaded?", "How do we follow Jesus' example when facing trials?"],
    practicalApplication: "When facing your hardest moments, pray: 'Not my will, but Yours be done.'"
  },
  {
    id: "crucifixion",
    title: "The Crucifixion",
    theme: "life-of-jesus",
    subTheme: "Sacrifice",
    description: "Jesus was crucified at Golgotha, bearing the sins of the world, fulfilling countless prophecies, saying 'It is finished.'",
    keyVerses: [
      { reference: "John 19:30", text: "It is finished! And bowing His head, He gave up His spirit" },
      { reference: "1 Peter 2:24", text: "Who Himself bore our sins in His own body on the tree" }
    ],
    connections: ["Fulfills Psalm 22, Isaiah 53", "Three hours of darkness", "Veil torn", "Passover Lamb slain at 3pm"],
    studyQuestions: ["What did Jesus mean by 'It is finished'?", "What do the seven sayings from the cross teach us?"],
    practicalApplication: "At the cross, your debt was paid in full. You cannot add to it—only receive it by faith."
  },
  {
    id: "resurrection",
    title: "The Resurrection",
    theme: "life-of-jesus",
    subTheme: "Victory",
    description: "On the third day, Jesus rose bodily from the grave, appeared to many witnesses, and proved He had conquered death.",
    keyVerses: [
      { reference: "1 Corinthians 15:3-4", text: "Christ died for our sins... was buried, and rose again the third day" },
      { reference: "Romans 1:4", text: "Declared to be the Son of God with power... by the resurrection from the dead" }
    ],
    connections: ["Firstfruits of resurrection (1 Cor 15:20)", "500+ witnesses", "Bodily resurrection—not just spiritual"],
    studyQuestions: ["Why is the bodily resurrection essential to the Gospel?", "How does the resurrection prove Jesus' claims?"],
    practicalApplication: "Because He lives, you will live also. Death is not the end for those in Christ."
  },
  {
    id: "ascension",
    title: "The Ascension",
    theme: "life-of-jesus",
    subTheme: "Exaltation",
    description: "Forty days after resurrection, Jesus ascended to heaven in view of His disciples, promising to return the same way.",
    keyVerses: [
      { reference: "Acts 1:9-11", text: "He was taken up, and a cloud received Him... This same Jesus... will so come in like manner" },
      { reference: "Hebrews 4:14", text: "We have a great High Priest who has passed through the heavens" }
    ],
    connections: ["Begins heavenly ministry (Heb 8:1-2)", "Sent the Holy Spirit (John 16:7)", "Promise of return"],
    studyQuestions: ["Why did Jesus have to leave?", "What is Jesus doing in heaven now?"],
    practicalApplication: "Jesus is alive and active as your High Priest. He intercedes for you right now."
  },

  // GOSPEL FLOOR
  {
    id: "gospel-grace",
    title: "Salvation by Grace",
    theme: "gospel",
    subTheme: "Grace",
    description: "We are saved by grace alone through faith alone in Christ alone—not by works, lest anyone should boast.",
    keyVerses: [
      { reference: "Ephesians 2:8-9", text: "By grace you have been saved through faith, and that not of yourselves; it is the gift of God" },
      { reference: "Titus 3:5", text: "Not by works of righteousness which we have done, but according to His mercy He saved us" }
    ],
    connections: ["Grace = unmerited favor", "Faith receives the gift", "Works are the result, not the cause"],
    studyQuestions: ["What is the difference between grace and mercy?", "How does understanding grace change how you live?"],
    practicalApplication: "Stop trying to earn God's love. Receive it as a gift, then live in grateful response."
  },
  {
    id: "gospel-faith",
    title: "Justification by Faith",
    theme: "gospel",
    subTheme: "Faith",
    description: "We are declared righteous (justified) when we believe in Jesus. His righteousness is credited to our account.",
    keyVerses: [
      { reference: "Romans 5:1", text: "Having been justified by faith, we have peace with God through our Lord Jesus Christ" },
      { reference: "Romans 4:5", text: "To him who does not work but believes on Him who justifies the ungodly, his faith is accounted for righteousness" }
    ],
    connections: ["Abraham believed God (Gen 15:6)", "Courtroom language—declared 'not guilty'", "Imputed righteousness"],
    studyQuestions: ["What does 'justified' mean?", "How can God declare sinners righteous and still be just?"],
    practicalApplication: "You are not on trial—the verdict is already in. In Christ, you are declared righteous."
  },
  {
    id: "gospel-sanctification",
    title: "Sanctification: Growing in Christ",
    theme: "gospel",
    subTheme: "Growth",
    description: "After justification, the Holy Spirit works to transform us into Christ's likeness. This is a lifelong process.",
    keyVerses: [
      { reference: "2 Corinthians 3:18", text: "We all... are being transformed into the same image from glory to glory" },
      { reference: "Philippians 2:12-13", text: "Work out your own salvation... for it is God who works in you" }
    ],
    connections: ["Justification (status) vs. Sanctification (process)", "Spirit produces fruit (Gal 5:22-23)", "Daily dying to self"],
    studyQuestions: ["What is the difference between justification and sanctification?", "How do we cooperate with the Spirit?"],
    practicalApplication: "Growth takes time. Be patient with yourself, but keep surrendering to the Spirit daily."
  },
  {
    id: "gospel-repentance",
    title: "Repentance and Confession",
    theme: "gospel",
    subTheme: "Response",
    description: "Repentance is a change of mind that leads to a change of direction. Confession acknowledges sin and receives forgiveness.",
    keyVerses: [
      { reference: "Acts 3:19", text: "Repent and be converted, that your sins may be blotted out" },
      { reference: "1 John 1:9", text: "If we confess our sins, He is faithful and just to forgive us our sins" }
    ],
    connections: ["Godly sorrow leads to repentance (2 Cor 7:10)", "Confession = 'to say the same thing' (agree with God)"],
    studyQuestions: ["What is true repentance vs. mere regret?", "Why must we confess specific sins?"],
    practicalApplication: "Don't hide your sins. Bring them to God honestly. He already knows—and He forgives."
  },
  {
    id: "gospel-new-birth",
    title: "The New Birth",
    theme: "gospel",
    subTheme: "Regeneration",
    description: "Jesus told Nicodemus: 'You must be born again.' The Holy Spirit gives new life to those who believe.",
    keyVerses: [
      { reference: "John 3:3", text: "Unless one is born again, he cannot see the kingdom of God" },
      { reference: "2 Corinthians 5:17", text: "If anyone is in Christ, he is a new creation; old things have passed away" }
    ],
    connections: ["New heart (Eze 36:26)", "Spiritual resurrection (Eph 2:1-5)", "Children of God (John 1:12-13)"],
    studyQuestions: ["What does it mean to be 'born again'?", "How do you know if you've been born again?"],
    practicalApplication: "Have you experienced the new birth? If not, ask Jesus to give you a new heart today."
  },

  // HEAVEN CEILING
  {
    id: "heaven-throne",
    title: "The Throne of God",
    theme: "heaven",
    subTheme: "Throne",
    description: "God sits on His throne in heaven, surrounded by the four living creatures and twenty-four elders, ruling the universe.",
    keyVerses: [
      { reference: "Revelation 4:2-3", text: "A throne set in heaven, and One sat on the throne... like jasper and sardius in appearance" },
      { reference: "Isaiah 6:1", text: "I saw the Lord sitting on a throne, high and lifted up, and the train of His robe filled the temple" }
    ],
    connections: ["Judgment seat", "Mercy seat", "Rainbow around throne (covenant)", "Sea of glass (purity)"],
    studyQuestions: ["What does the throne symbolize?", "How does knowing God is on the throne affect your daily life?"],
    practicalApplication: "No matter what chaos you face, remember: God is on His throne. He is in control."
  },
  {
    id: "heaven-angels",
    title: "The Angels of Heaven",
    theme: "heaven",
    subTheme: "Angels",
    description: "Angels are ministering spirits sent to serve believers, worship God, and carry out His commands.",
    keyVerses: [
      { reference: "Hebrews 1:14", text: "Are they not all ministering spirits sent forth to minister for those who will inherit salvation?" },
      { reference: "Psalm 103:20", text: "Bless the LORD, you His angels, who excel in strength, who do His word" }
    ],
    connections: ["Cherubim (throne guardians)", "Seraphim (worship)", "Gabriel (messenger)", "Michael (warrior)"],
    studyQuestions: ["What roles do angels play?", "How are angels different from humans?"],
    practicalApplication: "Angels are active in your life, though unseen. Thank God for their protection and service."
  },
  {
    id: "heaven-new-jerusalem",
    title: "The New Jerusalem",
    theme: "heaven",
    subTheme: "Eternal Home",
    description: "The Holy City, prepared as a bride for her husband, will descend from heaven to the new earth—our eternal home.",
    keyVerses: [
      { reference: "Revelation 21:2", text: "The holy city, New Jerusalem, coming down out of heaven from God" },
      { reference: "Revelation 21:4", text: "God will wipe away every tear... there shall be no more death, nor sorrow, nor crying" }
    ],
    connections: ["12 gates (tribes)", "12 foundations (apostles)", "Street of gold", "River of life", "Tree of life"],
    studyQuestions: ["What features of the New Jerusalem excite you most?", "Why is there no temple in the city?"],
    practicalApplication: "This world is not our home. Keep your eyes on the heavenly city God is preparing."
  },

  // GREAT CONTROVERSY WALL
  {
    id: "gc-origin-sin",
    title: "The Origin of Sin: Lucifer's Fall",
    theme: "great-controversy",
    subTheme: "Origin",
    description: "Sin originated in heaven when Lucifer, a covering cherub, exalted himself against God and was cast out.",
    keyVerses: [
      { reference: "Isaiah 14:12-14", text: "How you are fallen from heaven, O Lucifer... You said in your heart, 'I will be like the Most High'" },
      { reference: "Ezekiel 28:15", text: "You were perfect in your ways from the day you were created, till iniquity was found in you" }
    ],
    connections: ["Pride at the root", "1/3 of angels fell (Rev 12:4)", "War in heaven (Rev 12:7-9)"],
    studyQuestions: ["How did sin originate in a perfect being?", "What was Satan's core sin?"],
    practicalApplication: "Pride is the root of all sin. Ask God to reveal any self-exaltation in your heart."
  },
  {
    id: "gc-eden-fall",
    title: "The Fall of Humanity",
    theme: "great-controversy",
    subTheme: "Fall",
    description: "Satan deceived Eve in Eden, and Adam chose to join her in disobedience. Sin entered humanity, and death followed.",
    keyVerses: [
      { reference: "Genesis 3:6", text: "She took of its fruit and ate. She also gave to her husband with her, and he ate" },
      { reference: "Romans 5:12", text: "Through one man sin entered the world, and death through sin" }
    ],
    connections: ["Serpent = Satan (Rev 12:9)", "Deception strategy", "Nakedness = guilt", "Promise of Seed (Gen 3:15)"],
    studyQuestions: ["What tactics did Satan use to deceive Eve?", "How did God show mercy even in judgment?"],
    practicalApplication: "Satan still uses the same strategies: doubt God's Word, question God's character, offer forbidden pleasure."
  },
  {
    id: "gc-cross-victory",
    title: "Victory at the Cross",
    theme: "great-controversy",
    subTheme: "Victory",
    description: "At the cross, Satan was decisively defeated. Jesus crushed the serpent's head, proving God's love and justice.",
    keyVerses: [
      { reference: "Colossians 2:15", text: "Having disarmed principalities and powers, He made a public spectacle of them" },
      { reference: "John 12:31", text: "Now the ruler of this world will be cast out" }
    ],
    connections: ["Seed crushes serpent (Gen 3:15)", "Ransom paid (Mark 10:45)", "Satan's accusations answered"],
    studyQuestions: ["How did the cross defeat Satan?", "In what sense is the battle 'already won'?"],
    practicalApplication: "You fight from victory, not for victory. Christ has already won the war."
  },
  {
    id: "gc-final-conflict",
    title: "The Final Conflict",
    theme: "great-controversy",
    subTheme: "End Times",
    description: "Before Christ returns, Satan will make one final push through deception, persecution, and a counterfeit trinity.",
    keyVerses: [
      { reference: "Revelation 12:17", text: "The dragon was enraged with the woman, and went to make war with the rest of her offspring" },
      { reference: "Revelation 13:14", text: "He deceives those who dwell on the earth by those signs" }
    ],
    connections: ["Dragon, beast, false prophet", "Mark of the beast", "Persecution of God's people", "Armageddon"],
    studyQuestions: ["What are the characteristics of the end-time remnant?", "How do we prepare for the final conflict?"],
    practicalApplication: "Stay close to Jesus. Know His Word. Don't be deceived by miracles without truth."
  },

  // TIME PROPHECY WALL
  {
    id: "tp-70-weeks",
    title: "Daniel's 70 Weeks",
    theme: "time-prophecy",
    subTheme: "Messiah",
    description: "490 years were determined for Israel, pinpointing the exact time of Messiah's appearing and sacrificial death.",
    keyVerses: [
      { reference: "Daniel 9:24-27", text: "Seventy weeks are determined for your people... to anoint the Most Holy" },
      { reference: "Galatians 4:4", text: "When the fullness of the time had come, God sent forth His Son" }
    ],
    connections: ["457 BC decree", "69 weeks to Messiah = 27 AD", "Crucifixion in middle of 70th week = 31 AD"],
    studyQuestions: ["How do we calculate the 70 weeks?", "What happened at the end of the 70 weeks?"],
    practicalApplication: "God keeps His prophetic appointments with mathematical precision. Trust His timing."
  },
  {
    id: "tp-2300-days",
    title: "The 2300 Days",
    theme: "time-prophecy",
    subTheme: "Judgment",
    description: "The longest time prophecy in the Bible points to 1844 AD and the beginning of the pre-advent judgment in heaven.",
    keyVerses: [
      { reference: "Daniel 8:14", text: "Unto two thousand three hundred days; then shall the sanctuary be cleansed" },
      { reference: "Daniel 7:9-10", text: "The Ancient of Days was seated... The court was seated, and the books were opened" }
    ],
    connections: ["Same starting point as 70 weeks (457 BC)", "Heavenly sanctuary cleansing", "Investigative judgment"],
    studyQuestions: ["Why 1844?", "What is the heavenly sanctuary?"],
    practicalApplication: "We are living in judgment hour. Make sure your name is written in the Lamb's book of life."
  },
  {
    id: "tp-1260-years",
    title: "The 1260 Years",
    theme: "time-prophecy",
    subTheme: "Persecution",
    description: "From 538 AD to 1798 AD, the papal power dominated Europe and persecuted God's faithful people.",
    keyVerses: [
      { reference: "Daniel 7:25", text: "Time and times and half a time" },
      { reference: "Revelation 12:6", text: "The woman fled into the wilderness... one thousand two hundred and sixty days" }
    ],
    connections: ["538 AD: Ostrogoths defeated", "1798 AD: Pope captured", "Waldenses, Albigenses, Huguenots persecuted"],
    studyQuestions: ["What historical events mark this period?", "Who are the 'saints' who were worn out?"],
    practicalApplication: "History confirms prophecy. God's Word is reliable and His people are preserved."
  },

  // SANCTUARY WALL
  {
    id: "sanc-overview",
    title: "The Sanctuary System",
    theme: "sanctuary",
    subTheme: "Overview",
    description: "God instructed Moses to build a sanctuary so He could dwell among His people. Every element pointed to Christ.",
    keyVerses: [
      { reference: "Exodus 25:8", text: "Let them make Me a sanctuary, that I may dwell among them" },
      { reference: "Hebrews 8:5", text: "They serve a copy and shadow of the heavenly things" }
    ],
    connections: ["Court (justification)", "Holy Place (sanctification)", "Most Holy Place (glorification)", "Each piece = Christ"],
    studyQuestions: ["Why did God need a sanctuary?", "How does the sanctuary reveal the plan of salvation?"],
    practicalApplication: "Your body is now God's temple. How are you caring for this sacred dwelling?"
  },
  {
    id: "sanc-altar",
    title: "The Altar of Burnt Offering",
    theme: "sanctuary",
    subTheme: "Sacrifice",
    description: "The bronze altar in the courtyard was where animals were sacrificed for sin—pointing to Christ's sacrifice on the cross.",
    keyVerses: [
      { reference: "Leviticus 1:4", text: "He shall put his hand on the head of the burnt offering, and it will be accepted on his behalf to make atonement" },
      { reference: "Hebrews 9:22", text: "Without shedding of blood there is no remission" }
    ],
    connections: ["Hand on head = transfer of sin", "Death of innocent for guilty", "Daily morning and evening sacrifice"],
    studyQuestions: ["Why was blood necessary for forgiveness?", "How does this point to Christ?"],
    practicalApplication: "Have you laid your hand on the Lamb? Have you accepted His sacrifice for your sins?"
  },
  {
    id: "sanc-laver",
    title: "The Laver",
    theme: "sanctuary",
    subTheme: "Cleansing",
    description: "The bronze laver was for priests to wash before entering the Holy Place—symbolizing cleansing and baptism.",
    keyVerses: [
      { reference: "Exodus 30:18-21", text: "You shall also make a laver of bronze... Aaron and his sons shall wash their hands and their feet" },
      { reference: "Titus 3:5", text: "Through the washing of regeneration and renewing of the Holy Spirit" }
    ],
    connections: ["Baptism (cleansing)", "Word of God (Eph 5:26)", "Daily cleansing needed"],
    studyQuestions: ["Why did priests need to wash daily?", "What does the laver teach about ongoing sanctification?"],
    practicalApplication: "We need daily cleansing. Come to God's Word and Spirit for continuous renewal."
  },
  {
    id: "sanc-lampstand",
    title: "The Golden Lampstand",
    theme: "sanctuary",
    subTheme: "Light",
    description: "The seven-branched lampstand provided light in the Holy Place. Jesus is the Light of the World; we reflect His light.",
    keyVerses: [
      { reference: "Exodus 25:31-37", text: "You shall also make a lampstand of pure gold" },
      { reference: "John 8:12", text: "I am the light of the world. He who follows Me shall not walk in darkness" }
    ],
    connections: ["Jesus = Light", "Seven = completeness", "Olive oil = Holy Spirit", "Church as lampstand (Rev 1:20)"],
    studyQuestions: ["Why was there no window in the sanctuary?", "How do we shine as lights?"],
    practicalApplication: "You are called to be light in a dark world. Let the Spirit's oil keep your lamp burning."
  },
  {
    id: "sanc-table",
    title: "The Table of Showbread",
    theme: "sanctuary",
    subTheme: "Bread",
    description: "Twelve loaves of bread were placed on the golden table, representing God's provision and Christ as the Bread of Life.",
    keyVerses: [
      { reference: "Exodus 25:30", text: "You shall set the showbread on the table before Me always" },
      { reference: "John 6:35", text: "I am the bread of life. He who comes to Me shall never hunger" }
    ],
    connections: ["12 loaves = 12 tribes/apostles", "Bread of the Presence", "Continuous provision", "Communion bread"],
    studyQuestions: ["Why was bread always before God's presence?", "How do we 'feed' on Christ daily?"],
    practicalApplication: "Feed on Christ through His Word. Daily bread = daily devotion."
  },
  {
    id: "sanc-incense",
    title: "The Altar of Incense",
    theme: "sanctuary",
    subTheme: "Prayer",
    description: "The golden altar of incense was before the veil. The smoke rising symbolized prayers ascending to God.",
    keyVerses: [
      { reference: "Exodus 30:8", text: "He shall burn incense on it, a perpetual incense before the LORD" },
      { reference: "Revelation 8:3-4", text: "The smoke of the incense, with the prayers of the saints, ascended before God" }
    ],
    connections: ["Prayers (Ps 141:2)", "Christ's intercession", "Morning and evening prayer", "Sweet aroma to God"],
    studyQuestions: ["Why is prayer compared to incense?", "How does Jesus' intercession enhance our prayers?"],
    practicalApplication: "Your prayers matter. They rise like incense before God's throne. Keep praying."
  },
  {
    id: "sanc-ark",
    title: "The Ark of the Covenant",
    theme: "sanctuary",
    subTheme: "Presence",
    description: "The Ark in the Most Holy Place contained the law, manna, and Aaron's rod. The Shekinah glory dwelt above it.",
    keyVerses: [
      { reference: "Exodus 25:22", text: "There I will meet with you, and I will speak with you from above the mercy seat" },
      { reference: "Hebrews 9:4-5", text: "The ark of the covenant... and above it were the cherubim of glory shadowing the mercy seat" }
    ],
    connections: ["Law inside (character of God)", "Mercy seat above (grace covers law)", "Blood sprinkled (atonement)"],
    studyQuestions: ["What was in the Ark and why?", "What does the mercy seat teach about how God relates to sinners?"],
    practicalApplication: "God meets us where justice and mercy kiss. At the cross, law and grace unite."
  },
  {
    id: "sanc-day-atonement",
    title: "The Day of Atonement",
    theme: "sanctuary",
    subTheme: "Judgment",
    description: "Once a year, the high priest entered the Most Holy Place to cleanse the sanctuary and make final atonement.",
    keyVerses: [
      { reference: "Leviticus 16:30", text: "On that day the priest shall make atonement for you, to cleanse you" },
      { reference: "Hebrews 9:24", text: "Christ has entered... into heaven itself, now to appear in the presence of God for us" }
    ],
    connections: ["Two goats (Lord's and scapegoat)", "Afflict your souls (self-examination)", "Sanctuary cleansed", "Anti-typical: 1844"],
    studyQuestions: ["What happened on the Day of Atonement?", "What is Christ doing in the heavenly sanctuary now?"],
    practicalApplication: "We are living in the antitypical Day of Atonement. It's time for self-examination and confession."
  },
];

// Helper functions
export const getThemesByCategory = (theme: ThemeEntry["theme"]) =>
  themesLibrary.filter(t => t.theme === theme);

export const searchThemes = (query: string) => {
  const q = query.toLowerCase();
  return themesLibrary.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keyVerses.some(v => v.text.toLowerCase().includes(q) || v.reference.toLowerCase().includes(q))
  );
};

export const getThemeCategoryInfo = (theme: ThemeEntry["theme"]) =>
  themeCategories[theme];
