export interface KidsRevelationLesson {
  id: number;
  section: string;
  title: string;
  ageGroup: 'ages-6-8' | 'ages-9-12' | 'ages-13-15';
  kidFriendlyFocus: string;
  scripture: string;
  scriptureText: string;
  storyTime: string;
  funActivity: string;
  memoryVerse: string;
  questionToThink: string;
  prayer: string;
  parentNote?: string;
}

export const revelationCourseKids: KidsRevelationLesson[] = [
  // Section 1: Messages to the Seven Churches
  {
    id: 1,
    section: "Messages to the Seven Churches",
    title: "John Sees Jesus in Heaven!",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Jesus is alive and powerful in heaven!",
    scripture: "Revelation 1:17-18",
    scriptureText: "Fear not; I am the first and the last: I am he that liveth.",
    storyTime: "John was one of Jesus' best friends! But now John was old—probably over 90 years old! The mean Roman emperor put John on a lonely island called Patmos because John wouldn't stop telling people about Jesus. One Sunday, while John was praying, he heard a LOUD voice like a trumpet! He turned around and saw... JESUS! But Jesus didn't look like a regular person anymore. His hair was white like snow, His eyes were like flames of fire, His feet glowed like hot bronze, and His face was as bright as the SUN! John was so amazed he fell down like he was dead! But Jesus touched him gently and said, 'Don't be afraid! I'm alive forever, and I have the keys to death!' Jesus told John, 'Write down everything you see and send it to the seven churches.' That's the book of Revelation!",
    funActivity: "Draw Jesus as John saw Him: white hair, fiery eyes, glowing feet, and a face bright like the sun! Draw 7 golden candlesticks around Him (representing the 7 churches). Write: 'JESUS IS ALIVE FOREVER!'",
    memoryVerse: "Revelation 1:8 - 'I am Alpha and Omega.'",
    questionToThink: "Why do you think Jesus appeared so powerful and glorious to John?",
    prayer: "Dear Jesus, thank You for being alive in heaven right now! You're not just a story from long ago—You're real and powerful today! Help me not be afraid because You hold the keys to everything. Amen.",
    parentNote: "Revelation can seem scary to kids. Emphasize that Jesus appears glorious because He wants us to TRUST Him, not fear the future."
  },
  {
    id: 2,
    section: "Messages to the Seven Churches",
    title: "The Church That Forgot to Love",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Doing good things isn't enough if we lose our love for Jesus",
    scripture: "Revelation 2:4",
    scriptureText: "Thou hast left thy first love.",
    storyTime: "Jesus sent special messages to 7 churches in Asia Minor (now Turkey). The first church was Ephesus. Jesus said to them: 'I know how hard you work! I know you hate evil and test fake teachers. You've suffered a lot and haven't given up!' Sounds great, right? But then Jesus said something sad: 'But I have something against you: you've left your FIRST LOVE.' What does that mean? Imagine getting a Christmas present and being SO excited... but after a few months, you forget about it and never play with it anymore. That's what happened with the Ephesians. When they first believed in Jesus, they were SO in love with Him! They prayed all the time, shared their faith, and couldn't stop talking about Jesus. But over time, they got busy with rules and work and forgot HOW MUCH they loved Jesus. They were like robots doing Christian things without actually being excited about Jesus anymore. Jesus said, 'REMEMBER how you felt at first! Come back to Me!'",
    funActivity: "Heart check-up: Draw a big heart. Inside, write things that show you LOVE Jesus (praying, singing, helping others with joy). Outside the heart, write things that are 'just rules' without love. Ask yourself: Do I love Jesus, or am I just going through the motions?",
    memoryVerse: "Revelation 2:5 - 'Remember... and repent, and do the first works.'",
    questionToThink: "How can you tell if you're serving Jesus out of love vs. just following rules?",
    prayer: "Jesus, I don't want to be like a robot Christian! Help me love You with my whole heart, not just do Christian stuff. If I've lost my excitement for You, please bring it back! I love You! Amen.",
    parentNote: "This is a great check-up for the whole family. Discuss: Are we going through the motions at church, or do we genuinely love Jesus?"
  },
  {
    id: 3,
    section: "Messages to the Seven Churches",
    title: "The Brave Church That Suffered",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "God rewards faithfulness even when life is hard",
    scripture: "Revelation 2:10",
    scriptureText: "Be thou faithful unto death, and I will give thee a crown of life.",
    storyTime: "The second church was Smyrna. These Christians were POOR and persecuted! People made fun of them, beat them, and even killed some of them for loving Jesus. Jesus sent them a message: 'I know your troubles and your poverty (but you are RICH in heaven!). I know the mean things people say about you. Don't be afraid of what's coming. Some of you will be thrown in prison for 10 days. Be faithful even if it costs your life, and I will give you a CROWN OF LIFE!' Wait—10 days? In prophecy, a day can equal a year. Sure enough, history records 10 YEARS of terrible persecution under Emperor Diocletian (303-313 AD). But the Christians stayed faithful! They knew that even if they died, they would get an eternal crown and live forever with Jesus. Being faithful doesn't mean life will be easy—it means trusting Jesus NO MATTER WHAT.",
    funActivity: "Make a crown: Use paper, cardboard, or craft materials to create a 'Crown of Life.' Decorate it with jewels (stickers or drawn gems). Wear it and say: 'I will be faithful to Jesus no matter what!'",
    memoryVerse: "Revelation 2:10 - 'Be thou faithful unto death.'",
    questionToThink: "If being a Christian meant losing friends or getting in trouble, would you still follow Jesus?",
    prayer: "Jesus, I want to be like the brave Christians of Smyrna. Even when following You is hard, help me stay faithful. The crown of life You promise is worth more than anything on earth! Amen.",
    parentNote: "Discuss religious persecution happening today in other countries. Pray for persecuted Christians around the world."
  },
  {
    id: 4,
    section: "Messages to the Seven Churches",
    title: "The Lukewarm Church",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Jesus wants us HOT for Him, not halfway!",
    scripture: "Revelation 3:15-16",
    scriptureText: "Thou art neither cold nor hot... I will spue thee out of my mouth.",
    storyTime: "The last church was Laodicea. These Christians thought they had everything! They said, 'We're rich! We don't need anything!' But Jesus saw the truth: 'You don't know how sad and poor and blind you really are! You're like LUKEWARM water!' Have you ever tried to drink water that's not cold OR hot—just blah in the middle? It's gross! Jesus said, 'If only you were hot OR cold, but you're lukewarm, and it makes Me want to spit you out!' Ouch! But then Jesus said something beautiful: 'I'm knocking at your door. If you let Me in, we'll eat dinner together!' See, Jesus wasn't angry—He was SAD! He wanted to be close to them again. He offered them real gold (faith), white clothes (righteousness), and eye medicine (spiritual sight). Laodicea represents US—the end-time church. Are WE lukewarm?",
    funActivity: "Temperature test: Get three cups: one HOT water, one COLD water, one lukewarm. Taste a tiny bit of each (carefully!). Which is most refreshing? Draw a thermometer and mark where YOUR love for Jesus is. Hot? Cold? Lukewarm?",
    memoryVerse: "Revelation 3:20 - 'Behold, I stand at the door, and knock.'",
    questionToThink: "What would make your love for Jesus go from 'lukewarm' to 'HOT'?",
    prayer: "Jesus, I don't want to be lukewarm! Make my heart HOT for You! Help me open the door and let You all the way in. I want to eat with You and be close to You every day! Amen.",
    parentNote: "This message is for Seventh-day Adventists specifically (the end-time church). Discuss: What does being 'on fire' for Jesus look like in our family?"
  },
  // Section 2: Heaven's Throne Room
  {
    id: 5,
    section: "Heaven's Throne Room",
    title: "Peeking into Heaven!",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Heaven is more amazing than we can imagine!",
    scripture: "Revelation 4:2-3",
    scriptureText: "A throne was set in heaven, and one sat on the throne.",
    storyTime: "After Jesus gave messages to the 7 churches, John heard a voice say, 'Come up here! I'll show you what must happen!' Suddenly, John was looking at HEAVEN! He saw a throne with Someone sitting on it—God the Father! God looked like glittering jewels: jasper (clear/red) and sardine (fiery orange). Around the throne was a rainbow that looked like an emerald (green!). Lightning flashed, thunder roared! Around the throne were 24 smaller thrones with 24 elders in white robes and gold crowns. And there were 4 amazing creatures covered with eyes—a lion, an ox, a man, and an eagle—each with 6 wings! Day and night they sang: 'HOLY, HOLY, HOLY, Lord God Almighty, who was, and is, and is to come!' The 24 elders would throw down their crowns and worship: 'You are worthy, Lord!' Heaven is NOT boring—it's the most exciting place ever!",
    funActivity: "Heaven scene art: Draw God's throne with rainbow colors around it. Add 24 elders bowing down. Draw the 4 creatures (lion, ox, man, eagle) with wings and eyes. Make it as colorful and amazing as possible!",
    memoryVerse: "Revelation 4:11 - 'Thou art worthy, O Lord, to receive glory.'",
    questionToThink: "What do you think it will feel like to actually SEE heaven someday?",
    prayer: "Wow, God! Heaven sounds amazing! Thank You for letting John see it so we know what's waiting for us. I can't wait to see Your throne and worship You forever! Amen.",
    parentNote: "Use this to build excitement about heaven. Kids need a picture of what they're looking forward to!"
  },
  {
    id: 6,
    section: "Heaven's Throne Room",
    title: "The Lamb Opens the Scroll",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Only Jesus can open the future!",
    scripture: "Revelation 5:5",
    scriptureText: "The Lion of the tribe of Juda... hath prevailed to open the book.",
    storyTime: "John saw a scroll in God's right hand, sealed with 7 seals. An angel shouted, 'Who is worthy to open it?' No one in heaven or earth could! John started CRYING. Then one of the elders said, 'Don't cry! The Lion of Judah has won! He can open it!' John looked for a lion... but instead he saw a LAMB that looked like it had been killed! The Lamb had 7 horns (complete power) and 7 eyes (complete sight). Wait—wasn't it supposed to be a lion? Here's the beautiful truth: Jesus is BOTH! He's the conquering Lion (King!) AND the sacrificial Lamb (Savior!). He won, not by fighting with swords, but by DYING for us! When the Lamb took the scroll, all of heaven EXPLODED with worship! Millions of angels sang, 'Worthy is the Lamb!' Every creature in the universe joined in!",
    funActivity: "Lion AND Lamb art: Draw Jesus as both a lion and a lamb (get creative—maybe half lion, half lamb, or both images together). Write underneath: 'Jesus is my King AND my Savior!'",
    memoryVerse: "Revelation 5:12 - 'Worthy is the Lamb that was slain.'",
    questionToThink: "Why do you think Jesus is shown as a Lamb instead of a warrior?",
    prayer: "Jesus, You conquered sin and death not with weapons but with love! You're the Lion AND the Lamb. I worship You! Worthy is the Lamb! Amen.",
    parentNote: "This dual imagery (Lion/Lamb) is central to understanding Jesus' character. He wins through sacrifice, not violence."
  },
  // Section 3: The Four Horsemen
  {
    id: 7,
    section: "The Seven Seals",
    title: "The Four Horses of History",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "The seals show church history from Jesus to now",
    scripture: "Revelation 6:2",
    scriptureText: "A white horse: and he that sat on him had a bow.",
    storyTime: "When the Lamb opened the first 4 seals, 4 horses galloped out! (1) WHITE HORSE: A rider with a crown, conquering! This is the early church (31-100 AD) spreading the pure gospel everywhere. (2) RED HORSE: The rider took peace from earth—people killed each other! This is the persecuted church (100-313 AD) when Christians were hunted and martyred. (3) BLACK HORSE: The rider held scales and food was expensive. This is the compromised church (313-538 AD) when Christianity mixed with paganism and truth became 'scarce.' (4) PALE HORSE: Named DEATH, with Hell following. This is the dark ages (538-1517 AD) when the true gospel was almost lost and millions died for believing the Bible. These horses show that church history had ups and DOWNS—but Jesus is still on the throne!",
    funActivity: "Draw the 4 horses in order: White (pure gospel), Red (persecution), Black (compromise), Pale/Green (spiritual death). Label each with its time period. Then draw JESUS above them all, showing He's in control!",
    memoryVerse: "Revelation 6:2 - 'He went forth conquering, and to conquer.'",
    questionToThink: "We live after all 4 horses—what does that mean about where we are in history?",
    prayer: "Lord, history shows that Your church has gone through hard times. Thank You for preserving truth! Help me be faithful like the white-horse Christians, ready to share the gospel purely. Amen.",
    parentNote: "Connect this to the statue in Daniel 2 and beasts in Daniel 7—same kingdoms, different symbols. This builds prophetic literacy."
  },
  // Section 4: The 144,000 and Great Multitude
  {
    id: 8,
    section: "God's Special People",
    title: "The 144,000 Super-Soldiers for Jesus",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "God is preparing a special end-time army!",
    scripture: "Revelation 7:4",
    scriptureText: "I heard the number of them which were sealed: 144,000.",
    storyTime: "Before the final troubles, an angel cried: 'WAIT! Don't hurt the earth yet! First we seal God's servants!' John heard the number: 144,000—12,000 from each of Israel's 12 tribes. But wait—is this literal? Look at verse 9: John also sees 'a GREAT MULTITUDE that NO ONE could count, from every nation!' So the 144,000 are symbolic of ALL God's faithful end-time people. What makes them special? They have the 'Father's name in their foreheads' (God's character), they follow the Lamb everywhere (total commitment), they don't lie (totally honest), and they're 'without fault' (covered by Jesus' righteousness). These are people who KNOW Jesus deeply and would rather DIE than dishonor Him. God is preparing this army RIGHT NOW. Will YOU be one of them?",
    funActivity: "Soldier for Jesus badge: Cut out a badge shape. Write '144,000' and add: '1. God's name in my mind, 2. I follow Jesus everywhere, 3. I always tell the truth.' Decorate it and pin it on!",
    memoryVerse: "Revelation 14:5 - 'In their mouth was found no guile.'",
    questionToThink: "What would it take for you to be part of God's end-time army?",
    prayer: "God, I want to be sealed with Your name! Train me to follow Jesus everywhere, to be completely honest, and to reflect Your character. Make me part of Your end-time army! Amen.",
    parentNote: "Emphasize that 144,000 isn't about exclusion but about character. Anyone who follows Jesus fully can be part of this group."
  },
  // Section 5: The Three Angels
  {
    id: 9,
    section: "The Three Angels' Messages",
    title: "The First Angel: Judgment Has Come!",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "God's judgment is GOOD news for His people!",
    scripture: "Revelation 14:7",
    scriptureText: "Fear God, and give glory to him; for the hour of his judgment is come.",
    storyTime: "Three angels fly through heaven with the MOST IMPORTANT messages for the last days! The first angel shouts: 'Fear God and give Him glory! The hour of His JUDGMENT is come! Worship Him who made heaven and earth!' This judgment started in 1844 (remember Daniel 8:14?). But here's the thing: judgment isn't scary for God's people—it's GOOD NEWS! Why? Because Jesus is our Lawyer defending us! The judgment proves to the whole universe that God's people really belong to Him. It also means Jesus' return is CLOSE! The angel also says to worship the CREATOR—pointing to the Sabbath commandment ('in six days the Lord made heaven and earth'). This message is going to the whole world right now!",
    funActivity: "First angel poster: Draw an angel flying with a scroll. Write the message: '1. Fear God, 2. Give Him glory, 3. Judgment is here, 4. Worship the Creator!' Add 'Since 1844!' at the bottom.",
    memoryVerse: "Revelation 14:7 - 'Worship him that made heaven, and earth.'",
    questionToThink: "How does knowing that Jesus is your Lawyer make the judgment less scary?",
    prayer: "Lord, thank You that judgment means Jesus is defending me! Help me fear You (respect You), give You glory in how I live, and worship You as my Creator by keeping the Sabbath holy. Amen.",
    parentNote: "The first angel's message is THE Adventist mission. Help your child understand this is our calling to share with the world."
  },
  {
    id: 10,
    section: "The Three Angels' Messages",
    title: "The Second Angel: Babylon is Fallen!",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "False religious systems will collapse",
    scripture: "Revelation 14:8",
    scriptureText: "Babylon is fallen, is fallen, that great city.",
    storyTime: "The second angel announces: 'Babylon is fallen, is fallen!' What's Babylon? It's not the ancient city—that was destroyed long ago. Prophetic Babylon represents false religion that mixes truth with error. Just like ancient Babylon captured God's people and forced them to worship idols, spiritual Babylon captures minds with false teachings. The 'wine of her fornication' means her intoxicating false doctrines—things like: immortal soul (you go to heaven immediately when you die), Sunday worship (replacing God's Sabbath), eternal hellfire (God torturing people forever), etc. 'Babylon' includes any church that teaches these errors. The angel says she has 'FALLEN'—her errors are being exposed! God is calling His people to 'come OUT of her' (Revelation 18:4). Many sincere Christians are in Babylon churches, but God is waking them up to truth!",
    funActivity: "Truth vs. Babylon chart: Make two columns. Label one 'Bible Truth' and one 'Babylon's Wine.' Compare: Sabbath vs. Sunday, Death is sleep vs. Immediate heaven, Hell is destruction vs. Eternal torture. Which column lines up with Scripture?",
    memoryVerse: "Revelation 18:4 - 'Come out of her, my people.'",
    questionToThink: "Why is it important to lovingly share truth with people in 'Babylon' churches?",
    prayer: "Lord, open the eyes of sincere Christians trapped in false teachings. Give me courage to share the truth lovingly. Help Your people come out of confusion and into Your light. Amen.",
    parentNote: "Emphasize: We're not against PEOPLE, we're against false TEACHINGS. Many beautiful Christians are in these churches and need truth shared kindly."
  },
  {
    id: 11,
    section: "The Three Angels' Messages",
    title: "The Third Angel: Warning About the Mark!",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Choosing God's seal over the beast's mark",
    scripture: "Revelation 14:9-10",
    scriptureText: "If any man worship the beast... the same shall drink of the wine of the wrath of God.",
    storyTime: "The third angel gives the STRONGEST warning in the Bible: 'If anyone worships the beast and his image, and receives his mark in their forehead or hand, they will drink God's full wrath!' What's the mark of the beast? Let's work backwards: The SEAL of God is keeping His Sabbath (the sign of creation and loyalty). The MARK of the beast is the counterfeit—Sunday worship enforced by law. Right now, Sunday worship is a choice. But Revelation 13 predicts a time when a 'Sunday law' will be enforced, and people who keep the true Sabbath will be persecuted. That's when the mark becomes active. The mark is in the 'forehead' (believing Sunday is right) or 'hand' (going along to avoid trouble). The third angel warns: Don't give in! Those who stay faithful will face trouble, but those who take the mark will face God's wrath. Choose wisely!",
    funActivity: "Seal vs. Mark diagram: Draw a forehead. On one side, draw God's Sabbath seal. On the other, draw the beast's Sunday mark. Write underneath: 'I choose God's Seal!' Research Revelation 13:16-17 to understand the coming crisis.",
    memoryVerse: "Revelation 14:12 - 'Here are they that keep the commandments of God, and the faith of Jesus.'",
    questionToThink: "If keeping the Sabbath meant losing your job or going to jail, would you still keep it?",
    prayer: "God, I want Your seal, not the beast's mark! Strengthen me NOW so when the test comes, I'll be ready. I choose to worship You and keep Your Sabbath no matter what. Amen.",
    parentNote: "This is heavy content. Reassure your teen that God will give strength when needed (don't borrow tomorrow's trouble). Focus on building faithfulness NOW."
  },
  // Section 6: The Second Coming
  {
    id: 12,
    section: "Jesus Returns!",
    title: "Every Eye Will See Him!",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Jesus is coming back and EVERYONE will see Him!",
    scripture: "Revelation 1:7",
    scriptureText: "Behold, he cometh with clouds; and every eye shall see him.",
    storyTime: "The BEST part of Revelation is this: JESUS IS COMING BACK! And not secretly—EVERYONE will see Him! He'll come on the clouds with millions of angels. The sky will LIGHT UP! A trumpet will blast so loud the dead will wake up! Jesus' friends who are alive will fly up to meet Him in the air. He'll take us to the beautiful homes He's been building in heaven. No more tears! No more sadness! No more death! We'll live with Jesus FOREVER! When will this happen? We don't know the day or hour, but we know it's SOON. All the signs are happening. Our job is to be ready—loving Jesus, keeping His commandments, and telling others about Him so they can come too!",
    funActivity: "Second Coming scene: Draw the sky opening with Jesus on the clouds, surrounded by angels. Draw people flying UP to meet Him. Draw graves opening with happy people coming out. Make it the HAPPIEST picture ever! Write: 'JESUS IS COMING!'",
    memoryVerse: "Revelation 22:20 - 'Even so, come, Lord Jesus!'",
    questionToThink: "If Jesus came back TODAY, would you be ready?",
    prayer: "Jesus, I can't wait for You to come! Thank You for preparing a place for me in heaven. Help me be ready and help me tell my friends so they can be ready too! Come soon! Amen.",
    parentNote: "Let your child's excitement about the Second Coming grow! This hope should motivate everything we do."
  },
  // Section 7: Heaven and New Earth
  {
    id: 13,
    section: "New Heaven and New Earth",
    title: "No More Crying, No More Pain!",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "God will make everything new and perfect!",
    scripture: "Revelation 21:4",
    scriptureText: "God shall wipe away all tears from their eyes.",
    storyTime: "After sin is finally destroyed, God does something AMAZING: He makes a NEW heaven and a NEW earth! John saw a beautiful city—the New Jerusalem—coming down from heaven like a bride! It's HUGE (as big as half the United States!) with walls of jasper and streets of gold so pure it looks like glass! The gates are made of pearls! But here's the BEST part: 'God Himself will live with His people. He will wipe every tear from their eyes. There will be NO MORE DEATH or sadness or crying or pain. The old things are GONE!' Can you imagine? No more getting sick. No more saying goodbye. No more bullies or wars. No more scary things. Just JOY and PEACE and LOVE forever! That's what Jesus is preparing for you!",
    funActivity: "New Earth dream list: Draw or write everything you're excited about in the new earth: playing with lions, flying through space, hugging family forever, asking Bible characters questions, building a house, eating from the Tree of Life... anything! God's promises are REAL!",
    memoryVerse: "Revelation 21:5 - 'Behold, I make all things new.'",
    questionToThink: "What are you MOST excited about in the new earth?",
    prayer: "God, thank You for promising to wipe away every tear! I'm SO excited for the new earth where everything is perfect. Help me live now in a way that gets me there! Amen.",
    parentNote: "Let your child dream BIG about heaven. This isn't escapism—it's biblical hope that motivates holy living now."
  },
  {
    id: 14,
    section: "New Heaven and New Earth",
    title: "The River and Tree of Life",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "We'll eat from the Tree of Life forever!",
    scripture: "Revelation 22:2",
    scriptureText: "On either side of the river, was there the tree of life.",
    storyTime: "In the middle of the New Jerusalem, John saw something wonderful: a crystal-clear RIVER flowing from God's throne! Along both sides of the river grew the TREE OF LIFE—the same tree that was in the Garden of Eden! Remember, Adam and Eve couldn't eat from it after they sinned. But in heaven, we GET TO EAT FROM IT! The tree has 12 different kinds of fruit (one for each month!) and its leaves heal the nations. There's no night there because God's glory lights everything. And here's the best part: 'They shall see His FACE!' We'll actually look at God's face and have His name on our foreheads. We'll be His people, and He'll be our God—FOREVER. The Bible ends with an invitation: 'Let anyone who wants to come drink the water of life freely!' That means YOU!",
    funActivity: "Tree of Life art: Draw a beautiful tree with 12 different kinds of fruit. Draw a river flowing nearby. Add people eating the fruit with huge smiles. Write: 'I will eat from this tree someday!'",
    memoryVerse: "Revelation 22:17 - 'Whosoever will, let him take the water of life freely.'",
    questionToThink: "What do you think the 12 fruits will taste like?",
    prayer: "Jesus, thank You for inviting me to drink from the water of life! I want to eat from the Tree of Life and live forever with You. Help me stay faithful so I can be there! Amen.",
    parentNote: "Emphasize the free invitation—'whosoever will.' No one is excluded who wants to come. This is the gospel in one verse!"
  },
  {
    id: 15,
    section: "Revelation Complete",
    title: "Come, Lord Jesus!",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Revelation ends with the greatest invitation!",
    scripture: "Revelation 22:20",
    scriptureText: "He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.",
    storyTime: "We've reached the end of Revelation—and the end of the whole Bible! Jesus' last words are: 'Surely I am coming QUICKLY!' And John's response (and ours!) is: 'Amen! Come, Lord Jesus!' That's how the Bible ends—with a PROMISE and a PRAYER. Jesus promises He's coming soon. We pray for Him to hurry! Until then, we have work to do: share the three angels' messages, keep God's commandments, trust in Jesus' righteousness, and help others get ready. Revelation isn't a scary book—it's a HOPE book! It shows us that no matter how bad things get, JESUS WINS. The dragon, the beasts, Babylon—they all LOSE. The Lamb wins. And if we're on the Lamb's side, WE win too! Are you ready?",
    funActivity: "Revelation review poster: Draw these scenes in order: (1) Jesus among candlesticks, (2) Throne room in heaven, (3) Four horsemen, (4) Three angels flying, (5) Jesus coming on clouds, (6) New Jerusalem. Title it: 'REVELATION: JESUS WINS!'",
    memoryVerse: "Revelation 22:20 - 'Even so, come, Lord Jesus!'",
    questionToThink: "What's ONE thing from Revelation you want to remember forever?",
    prayer: "Jesus, thank You for the book of Revelation! It shows me that You WIN. Help me be faithful, share Your message, and be ready when You return. Amen! Come, Lord Jesus! Amen.",
    parentNote: "Celebrate finishing this study! Revelation is a victory book. Your child should walk away excited, not scared."
  }
];

export default revelationCourseKids;
