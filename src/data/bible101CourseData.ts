/**
 * Phototheology Bible 101 — 30-Day Journey
 * 
 * A visual-first, Christ-lens introduction to the Bible
 * that teaches beginners Scripture basics through the Palace methodology.
 * Each day maps to a Palace room — but the room is invisible in Simple mode.
 */

export interface Bible101Day {
  day: number;
  title: string;
  subtitle: string;
  /** The visual anchor — shown BEFORE any text */
  visualPrompt: string;
  /** The Christ-lens question for this day */
  christQuestion: string;
  /** Key passage (KJV) */
  passage: string;
  /** Short devotional content */
  content: string;
  /** Palace room this maps to (shown only in Guided/Master) */
  roomCode: string;
  roomLabel: string;
  /** Floor number (1-8) */
  floor: number;
  /** Simple takeaway for beginners */
  takeaway: string;
  /** Action step */
  actionStep: string;
}

export const BIBLE_101_COURSE: Bible101Day[] = [
  // WEEK 1: THE BIG PICTURE (Floor 1 — Story & Imagination)
  {
    day: 1,
    title: "The Story Begins",
    subtitle: "What is the Bible?",
    visualPrompt: "Picture a massive library with 66 rooms — each room tells part of one story. Now imagine a golden thread running through every single room, connecting them all.",
    christQuestion: "If the Bible is one story, who is it about?",
    passage: "John 5:39",
    content: "The Bible isn't a collection of random books. It's one unified story with one Hero. Jesus Himself said, 'Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me.' Every page, every chapter, every story — they all point to Him.",
    roomCode: "SR",
    roomLabel: "Story Room",
    floor: 1,
    takeaway: "The Bible is one story about one Person — Jesus Christ.",
    actionStep: "Read John 5:39. Ask yourself: 'If every story in the Bible is about Jesus, what changes about how I read it?'"
  },
  {
    day: 2,
    title: "In the Beginning",
    subtitle: "Creation — God speaks, and it happens",
    visualPrompt: "Close your eyes. Picture total darkness. Then hear a voice — and light explodes into existence. Feel the ground form beneath you. See the first sunrise.",
    christQuestion: "Who was the voice that spoke creation into existence?",
    passage: "Genesis 1:1-3; John 1:1-3",
    content: "Genesis opens with God creating everything by His Word. But John tells us WHO that Word was: 'In the beginning was the Word, and the Word was with God, and the Word was God... All things were made by him.' Jesus didn't just save us — He made us.",
    roomCode: "IR",
    roomLabel: "Imagination Room",
    floor: 1,
    takeaway: "Jesus is the Creator. He spoke you into existence.",
    actionStep: "Step outside today. Look at something beautiful — a tree, the sky, a bird. Remember: Jesus made that."
  },
  {
    day: 3,
    title: "The Fall",
    subtitle: "How sin entered the world",
    visualPrompt: "Picture a perfect garden. A serpent whispers. A hand reaches for fruit. The sky darkens. But then — God walks through the garden calling your name.",
    christQuestion: "In Genesis 3:15, God makes a promise. Who is the 'seed' who will crush the serpent?",
    passage: "Genesis 3:15",
    content: "The moment sin entered, God already had a rescue plan. He told the serpent: 'I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel.' This is the first promise of Jesus — the Seed who would crush evil forever.",
    roomCode: "SR",
    roomLabel: "Story Room",
    floor: 1,
    takeaway: "God promised a Rescuer before we even asked for one.",
    actionStep: "Write Genesis 3:15 on a card. This is the Bible's first promise of Jesus."
  },
  {
    day: 4,
    title: "The Lamb",
    subtitle: "Why blood?",
    visualPrompt: "Picture Adam and Eve standing ashamed, covered in fig leaves. Now picture God gently removing those leaves and clothing them in animal skins. Something died so they could be covered.",
    christQuestion: "Who is the Lamb that God has been pointing to since Eden?",
    passage: "Genesis 3:21; John 1:29",
    content: "When Adam and Eve sinned, God killed an animal to cover them. This was the first sacrifice — the first time blood was shed to cover sin. Centuries later, John the Baptist sees Jesus and declares: 'Behold the Lamb of God, which taketh away the sin of the world!'",
    roomCode: "TR",
    roomLabel: "Translation Room",
    floor: 1,
    takeaway: "Every lamb in the Bible points to Jesus — the final, perfect Lamb.",
    actionStep: "Read John 1:29. Whenever you see 'lamb' in the Bible from now on, think of Jesus."
  },
  {
    day: 5,
    title: "Noah's Ark",
    subtitle: "One door. One rescue.",
    visualPrompt: "A massive wooden ship. Rain pounding. One door, wide open. Animals streaming in. Then God Himself shuts the door.",
    christQuestion: "Jesus said 'I am the door.' How is the ark's one door a picture of Him?",
    passage: "Genesis 7:16; John 10:9",
    content: "The ark had one door. Everyone who entered was saved. Everyone outside perished. Jesus said, 'I am the door: by me if any man enter in, he shall be saved.' The ark was a picture of Christ — there is one way to be saved, and God Himself holds the door open.",
    roomCode: "24",
    roomLabel: "24FPS Room",
    floor: 1,
    takeaway: "Jesus is the only door to salvation — and He holds it open for you.",
    actionStep: "Think of one person in your life who needs to know about this door. Pray for them."
  },
  // WEEK 2: SEEING THE PATTERN (Floor 2 — Investigation)
  {
    day: 6,
    title: "Abraham's Test",
    subtitle: "A father, a son, and a mountain",
    visualPrompt: "An old man walks up a mountain with his only son. The son carries wood on his back. The father carries fire and a knife. The son asks: 'Where is the lamb?'",
    christQuestion: "How does Isaac carrying wood up the mountain mirror Jesus carrying His cross?",
    passage: "Genesis 22:7-8; John 19:17",
    content: "Isaac asked, 'Where is the lamb?' Abraham answered prophetically: 'God will provide himself a lamb.' Centuries later, on that very mountain range, God did provide Himself as the Lamb — Jesus, carrying His own cross up the hill to die for us.",
    roomCode: "OR",
    roomLabel: "Observation Room",
    floor: 2,
    takeaway: "God always provides. He provided the Lamb — His own Son.",
    actionStep: "Read Genesis 22:1-14 slowly. Write down every detail you notice."
  },
  {
    day: 7,
    title: "The Passover",
    subtitle: "Blood on the door",
    visualPrompt: "A dark night in Egypt. A family paints blood on their doorframe. Inside, they eat bread in haste, sandals on, ready to leave. Death passes over.",
    christQuestion: "Paul says 'Christ our passover is sacrificed for us.' How is the Passover night a picture of the cross?",
    passage: "Exodus 12:13; 1 Corinthians 5:7",
    content: "On Passover night, a lamb was killed and its blood placed on the door. When judgment came, every household under the blood was spared. Paul tells us directly: 'Christ our passover is sacrificed for us.' Jesus died on Passover. He IS the Lamb. His blood IS the covering.",
    roomCode: "ST",
    roomLabel: "Symbols/Types Room",
    floor: 2,
    takeaway: "When you see Passover in the Bible, see Calvary.",
    actionStep: "Compare Exodus 12 with John 19. List three similarities."
  },
  {
    day: 8,
    title: "The Ten Commandments",
    subtitle: "God's character in stone",
    visualPrompt: "Thunder. Lightning. A mountain on fire. The ground shakes. A voice speaks words that echo through all of history. And God writes them with His own finger.",
    christQuestion: "Jesus said He didn't come to destroy the law but to fulfill it. How did He live out each commandment?",
    passage: "Exodus 20:1-17; Matthew 5:17",
    content: "The Ten Commandments aren't just rules — they're a portrait of God's character. When Jesus walked the earth, He lived them perfectly. He is the law made flesh. He didn't abolish the standard — He showed us what it looks like to live it.",
    roomCode: "DC",
    roomLabel: "Def-Com Room",
    floor: 2,
    takeaway: "The law shows us God's character. Jesus IS that character in human form.",
    actionStep: "Read Exodus 20:1-17 and ask: 'Which commandment shows me something about Jesus?'"
  },
  {
    day: 9,
    title: "The Tabernacle",
    subtitle: "God's address on earth",
    visualPrompt: "A tent glowing in the wilderness. Gold, purple, scarlet. A courtyard with an altar. Inside: a lampstand, bread, incense. Behind a veil: a golden box with God's presence.",
    christQuestion: "John 1:14 says the Word 'dwelt' (tabernacled) among us. How is the tabernacle a picture of Jesus?",
    passage: "Exodus 25:8; John 1:14",
    content: "God told Moses: 'Let them make me a sanctuary; that I may dwell among them.' Every piece of furniture, every color, every service — all pointed to Jesus. The altar = His sacrifice. The bread = He is the Bread of Life. The lamp = He is the Light. The veil = His flesh. God's address was always: wherever His Son is.",
    roomCode: "ST",
    roomLabel: "Symbols/Types Room",
    floor: 2,
    takeaway: "The tabernacle is a 3D portrait of Jesus.",
    actionStep: "Draw a simple diagram of the tabernacle. Label each piece and write 'Jesus' next to it."
  },
  {
    day: 10,
    title: "David and Goliath",
    subtitle: "The unlikely champion",
    visualPrompt: "A giant in armor. An army trembling. A boy with a sling walks forward alone. One stone flies. The giant falls.",
    christQuestion: "How is David fighting for Israel a picture of Jesus fighting for us?",
    passage: "1 Samuel 17:45; Colossians 2:15",
    content: "David didn't fight with armor or sword — he fought in the name of the Lord. He was a substitute: he fought so Israel didn't have to. Jesus did the same at Calvary — He faced the enemy alone, fought in God's name, and won the victory we could never win ourselves.",
    roomCode: "QR",
    roomLabel: "Questions Room",
    floor: 2,
    takeaway: "Jesus is our Champion. He fought the battle we couldn't win.",
    actionStep: "Ask yourself: 'What Goliath am I facing?' Then read Colossians 2:15."
  },
  // WEEK 3: SEEING CHRIST EVERYWHERE (Floor 3-4)
  {
    day: 11,
    title: "Psalms — Songs About Jesus",
    subtitle: "The Psalms are not just poems",
    visualPrompt: "A king playing a harp under the stars. But the songs he sings describe someone greater — a Messiah who will be pierced, mocked, and crowned.",
    christQuestion: "Psalm 22 was written 1,000 years before crucifixion was invented. How does it describe the cross?",
    passage: "Psalm 22:1, 16-18; Matthew 27:46",
    content: "David wrote Psalm 22 a millennium before Christ. He described hands and feet pierced, garments divided, crowds mocking. Jesus quoted this Psalm from the cross: 'My God, my God, why hast thou forsaken me?' David was seeing Christ through the Spirit.",
    roomCode: "NF",
    roomLabel: "Nature Freestyle Room",
    floor: 3,
    takeaway: "The Psalms are prophetic. They sing about Jesus centuries before He came.",
    actionStep: "Read Psalm 22 alongside Matthew 27. Circle every matching detail."
  },
  {
    day: 12,
    title: "Isaiah's Portrait",
    subtitle: "The suffering servant",
    visualPrompt: "A man beaten beyond recognition. Silent before his accusers. Carrying the weight of a world's sin on his shoulders. Yet through his wounds — healing flows.",
    christQuestion: "Isaiah 53 was written 700 years before Jesus. Who is the 'he' in this chapter?",
    passage: "Isaiah 53:5-6",
    content: "'He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.' Isaiah painted a portrait of Jesus 700 years before Bethlehem. This chapter reads like an eyewitness account of Calvary.",
    roomCode: "CR",
    roomLabel: "Concentration Room",
    floor: 4,
    takeaway: "Isaiah 53 is the clearest Old Testament portrait of Jesus' sacrifice.",
    actionStep: "Read Isaiah 53 slowly. Replace every 'he' with 'Jesus' as you read."
  },
  {
    day: 13,
    title: "Daniel's Vision",
    subtitle: "The God who knows the future",
    visualPrompt: "A massive statue — head of gold, chest of silver, legs of iron. Then a stone, cut without hands, strikes the statue and becomes a mountain filling the earth.",
    christQuestion: "Who is the stone 'cut without hands' that destroys all earthly kingdoms?",
    passage: "Daniel 2:44-45",
    content: "Daniel showed that God knows the future. Babylon, Persia, Greece, Rome — all predicted, all fulfilled. But the climax is a stone kingdom set up by God that will never be destroyed. That stone is Christ's eternal kingdom.",
    roomCode: "CR",
    roomLabel: "Concentration Room",
    floor: 4,
    takeaway: "God controls history. Every empire rises and falls according to His plan.",
    actionStep: "Read Daniel 2. Can you name the four kingdoms? Research which empires fulfilled each one."
  },
  {
    day: 14,
    title: "Jonah — The Reluctant Sign",
    subtitle: "Three days in darkness",
    visualPrompt: "A man thrown into the sea. Swallowed by a great fish. Three days in darkness. Then spat out — alive.",
    christQuestion: "Jesus said Jonah's experience was a sign pointing to Him. How?",
    passage: "Jonah 1:17; Matthew 12:40",
    content: "Jesus said: 'For as Jonas was three days and three nights in the whale's belly; so shall the Son of man be three days and three nights in the heart of the earth.' Jonah's burial and resurrection from the sea was a living preview of Christ's death and resurrection.",
    roomCode: "DR",
    roomLabel: "Dimensions Room",
    floor: 4,
    takeaway: "Jonah's story is a miniature version of the gospel: death, burial, resurrection.",
    actionStep: "Read Jonah chapters 1-2. Ask: 'How is Jonah's experience like what Jesus went through?'"
  },
  // WEEK 4: THE GOSPELS & THE CROSS
  {
    day: 15,
    title: "Jesus Arrives",
    subtitle: "The Word becomes flesh",
    visualPrompt: "A teenage girl. An angel. A stable. A manger. Shepherds kneeling. Stars blazing. The Creator of the universe — as a baby.",
    christQuestion: "Why did the King of the universe choose to arrive as a helpless infant?",
    passage: "John 1:14; Philippians 2:6-8",
    content: "The God who spoke galaxies into existence chose to enter His own creation as a helpless baby. He who was 'in the form of God' emptied Himself and 'was made in the likeness of men.' Every manger scene reminds us: God came close. As close as possible.",
    roomCode: "IR",
    roomLabel: "Imagination Room",
    floor: 1,
    takeaway: "God didn't shout instructions from heaven. He came down and became one of us.",
    actionStep: "Read Philippians 2:5-11 and let the humility of Christ sink in."
  },
  {
    day: 16,
    title: "The Parables",
    subtitle: "Stories that unlock the kingdom",
    visualPrompt: "A farmer scattering seed. A pearl merchant. A woman searching for a coin. A father running to embrace a returning son. Simple stories — infinite depth.",
    christQuestion: "Why did Jesus teach in stories instead of lectures?",
    passage: "Matthew 13:34-35",
    content: "Jesus taught in parables because truth sticks when it's wrapped in a story. A farmer, a pearl, a lost son — these images lodge in memory and grow. Every parable is a window into how God thinks, loves, and acts.",
    roomCode: "GR",
    roomLabel: "Gems Room",
    floor: 1,
    takeaway: "Jesus teaches through images. The Bible is meant to be seen, not just read.",
    actionStep: "Pick one parable from Matthew 13. Draw the image. What does it teach about God?"
  },
  {
    day: 17,
    title: "The Miracles",
    subtitle: "Signs that reveal who Jesus is",
    visualPrompt: "Water turning to wine. A blind man seeing color for the first time. A dead man walking out of a tomb. Bread multiplying in baskets.",
    christQuestion: "Each miracle reveals something about who Jesus is. What does feeding 5,000 reveal?",
    passage: "John 6:35; John 20:30-31",
    content: "Miracles weren't magic tricks — they were signs. Turning water to wine showed He transforms. Healing the blind showed He is the Light. Raising the dead showed He is the Life. John tells us they were written 'that ye might believe that Jesus is the Christ.'",
    roomCode: "OR",
    roomLabel: "Observation Room",
    floor: 2,
    takeaway: "Every miracle is a sermon in action — revealing who Jesus truly is.",
    actionStep: "Pick any miracle in John. Ask: 'What does this reveal about Jesus' character?'"
  },
  {
    day: 18,
    title: "The Cross",
    subtitle: "The center of all history",
    visualPrompt: "Three crosses on a hill. Darkness at noon. The ground shakes. The temple veil tears from top to bottom. A centurion whispers: 'Truly this was the Son of God.'",
    christQuestion: "Why did the temple veil tear at the moment Jesus died?",
    passage: "Matthew 27:50-51; Hebrews 10:19-20",
    content: "The veil separated humanity from God's presence. When Jesus died, it tore — from top to bottom, because God tore it, not man. The way was now open. Hebrews tells us: 'the veil, that is to say, his flesh.' Jesus' body was the veil — broken so we could enter God's presence.",
    roomCode: "ST",
    roomLabel: "Symbols/Types Room",
    floor: 2,
    takeaway: "The cross opened the way to God. Nothing stands between you and Him anymore.",
    actionStep: "Read Hebrews 10:19-22. Thank God that the veil is torn."
  },
  {
    day: 19,
    title: "The Resurrection",
    subtitle: "Death could not hold Him",
    visualPrompt: "An empty tomb. Folded grave clothes. An angel sitting calmly. Two women running with tears of joy. A gardener who is actually the King.",
    christQuestion: "Why is the resurrection the most important event in all of history?",
    passage: "1 Corinthians 15:17; John 11:25",
    content: "Paul said: 'If Christ be not raised, your faith is vain.' Without resurrection, the cross is just another execution. But because He rose, everything changes — sin is defeated, death is temporary, and hope is unshakable. 'I am the resurrection, and the life.'",
    roomCode: "CR",
    roomLabel: "Concentration Room",
    floor: 4,
    takeaway: "Because Jesus rose, everything He said is true and everything He promised is certain.",
    actionStep: "Read 1 Corinthians 15:1-8. How many witnesses saw the risen Christ?"
  },
  {
    day: 20,
    title: "The Holy Spirit",
    subtitle: "Fire from heaven",
    visualPrompt: "A room full of frightened disciples. A rushing wind. Tongues of fire landing on each head. Suddenly, everyone speaks — and the world hears.",
    christQuestion: "Jesus promised 'another Comforter.' How is the Spirit continuing Jesus' work today?",
    passage: "Acts 2:1-4; John 14:16-17",
    content: "Jesus didn't leave us alone. He sent the Holy Spirit — the 'other Comforter' — who is with us always. The Spirit teaches, convicts, guides, and empowers. Pentecost was not the end of Christ's work but its amplification through every believer.",
    roomCode: "PF",
    roomLabel: "Personal Freestyle Room",
    floor: 3,
    takeaway: "The Holy Spirit is Jesus' presence with you right now.",
    actionStep: "Read John 14:16-18. Ask the Spirit to teach you as you study the Bible."
  },
  // WEEK 5: THE BIG THEMES
  {
    day: 21,
    title: "The Sabbath",
    subtitle: "God's rest — a gift, not a burden",
    visualPrompt: "God finishing creation. Not because He was tired — because it was complete. He blessed the seventh day and made it holy. A weekly appointment with the Creator.",
    christQuestion: "Jesus said 'The Son of man is Lord also of the sabbath.' What does that mean?",
    passage: "Genesis 2:2-3; Mark 2:28",
    content: "The Sabbath was the first thing God made holy — before sin, before the law, before Israel. It's a weekly memorial of creation and a promise of rest in Christ. Jesus called Himself its Lord, meaning the Sabbath belongs to Him and points to Him.",
    roomCode: "TRm",
    roomLabel: "Theme Room",
    floor: 4,
    takeaway: "The Sabbath is a weekly gift — time to rest in the Creator who loves you.",
    actionStep: "Read Genesis 2:1-3 and Mark 2:27-28. Ask: 'What was the Sabbath made for?'"
  },
  {
    day: 22,
    title: "The Sanctuary",
    subtitle: "God's 3D gospel lesson",
    visualPrompt: "Walk through the sanctuary gate. See the altar (sacrifice). The laver (cleansing). Enter the Holy Place: lamp (light), bread (nourishment), incense (prayer). Behind the veil: God's throne.",
    christQuestion: "If each piece of furniture represents something Jesus does for us, what is the whole sanctuary showing?",
    passage: "Hebrews 8:1-2; Exodus 25:8",
    content: "The sanctuary is not ancient furniture — it's the gospel in 3D. Every step from the gate to the Most Holy Place shows the journey of salvation: sacrifice, cleansing, illumination, nourishment, intercession, and finally — dwelling with God. Jesus is both the sacrifice and the priest.",
    roomCode: "BL",
    roomLabel: "Blue Room (Sanctuary)",
    floor: 5,
    takeaway: "The sanctuary is a walkthrough model of how Jesus saves us — step by step.",
    actionStep: "Draw the sanctuary layout. Write one thing Jesus does for us at each piece of furniture."
  },
  {
    day: 23,
    title: "The Second Coming",
    subtitle: "The promise that changes everything",
    visualPrompt: "Every eye looking up. Clouds splitting. A trumpet blast that shakes the world. The dead rising. Jesus — not as a baby, not on a cross — but as King of Kings.",
    christQuestion: "How does the promise of Jesus' return change how we live today?",
    passage: "John 14:1-3; Revelation 1:7",
    content: "'I will come again, and receive you unto myself; that where I am, there ye may be where I am.' This isn't wishful thinking — it's a promise from the One who kept every promise He ever made. The second coming is the climax of the entire Bible story.",
    roomCode: "PR",
    roomLabel: "Prophecy Room",
    floor: 5,
    takeaway: "Jesus is coming back. This is the Bible's greatest 'to be continued.'",
    actionStep: "Read John 14:1-3. Let it comfort you. He's coming back for YOU."
  },
  {
    day: 24,
    title: "Heaven — Not a Cloud Concert",
    subtitle: "What eternity actually looks like",
    visualPrompt: "A city of gold descending from the sky. A river of life. Trees bearing fruit monthly. No death. No tears. No night. God — face to face.",
    christQuestion: "Revelation says 'the Lamb is the light thereof.' What does that tell you about heaven?",
    passage: "Revelation 21:3-4; Revelation 22:1-5",
    content: "Heaven isn't floating on clouds playing harps. It's a real city on a real earth — recreated, perfected, alive. The best part isn't the gold streets or crystal river. It's Revelation 21:3: 'God himself shall be with them, and be their God.' Heaven is being home with God.",
    roomCode: "3A",
    roomLabel: "Three Angels' Room",
    floor: 5,
    takeaway: "Heaven is not about a place. It's about a Person — and finally being home.",
    actionStep: "Read Revelation 21:1-7. What excites you most about the new earth?"
  },
  // DAYS 25-30: BRINGING IT ALL TOGETHER
  {
    day: 25,
    title: "The Golden Thread",
    subtitle: "Christ from Genesis to Revelation",
    visualPrompt: "Picture a golden thread running through 66 books. Pull it and watch: Eden's promise, Abraham's lamb, Passover's blood, Isaiah's servant, Bethlehem's baby, Calvary's cross, the empty tomb, the throne room.",
    christQuestion: "Can you name one way Christ appears in each section of the Bible?",
    passage: "Luke 24:27",
    content: "'Beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.' After His resurrection, Jesus gave the greatest Bible study ever — showing that the ENTIRE Bible is about Him. That golden thread is what you've been learning to see.",
    roomCode: "CR",
    roomLabel: "Concentration Room",
    floor: 4,
    takeaway: "You now have eyes to see Christ everywhere in Scripture.",
    actionStep: "Pick any Old Testament book. Can you find Christ in it? Write down where."
  },
  {
    day: 26,
    title: "Seeing with New Eyes",
    subtitle: "Why visuals matter in Bible study",
    visualPrompt: "Imagine two people reading the same verse. One reads words. The other sees a movie — characters, colors, emotions, connections. Which one remembers it next week?",
    christQuestion: "God taught with images (rainbow, burning bush, pillar of fire). Why?",
    passage: "Romans 1:20; Psalm 19:1",
    content: "God has always been a visual teacher. He used rainbows, sanctuaries, parables, and visions — not because words aren't enough, but because images stick. This is what you've been practicing: turning Scripture from text into living pictures. That's the Phototheology way.",
    roomCode: "TR",
    roomLabel: "Translation Room",
    floor: 1,
    takeaway: "God teaches visually. When you see the Bible in images, you remember it forever.",
    actionStep: "Take your favorite verse. Close your eyes and turn it into a vivid mental picture."
  },
  {
    day: 27,
    title: "Ask Better Questions",
    subtitle: "The art of curiosity in Scripture",
    visualPrompt: "A detective at a crime scene. He doesn't just glance — he notices the fingerprint, the misplaced chair, the half-open window. In the Bible, every detail is a clue.",
    christQuestion: "What questions about Scripture have you never thought to ask?",
    passage: "Proverbs 25:2",
    content: "'It is the glory of God to conceal a thing: but the honour of kings is to search out a matter.' God hides treasures in His Word — not to frustrate you, but to reward your search. The deeper you dig, the more gold you find. Great Bible study starts with great questions.",
    roomCode: "QR",
    roomLabel: "Questions Room",
    floor: 2,
    takeaway: "Don't just read the Bible — investigate it. Ask why, how, when, and who.",
    actionStep: "Read any chapter. Write 10 questions about it before looking for answers."
  },
  {
    day: 28,
    title: "The Bible in Daily Life",
    subtitle: "Scripture isn't just for Sabbath",
    visualPrompt: "You're driving. A sunset paints the sky. Immediately Malachi 4:2 comes to mind: 'the Sun of righteousness shall arise with healing in his wings.' The Bible is alive in your day.",
    christQuestion: "How can every moment of your day become a Bible study?",
    passage: "Psalm 1:2; Colossians 3:16",
    content: "The goal isn't to study the Bible for 30 minutes and forget it. It's to let the Word 'dwell in you richly.' When you see a storm, think of Jesus calming the waves. When you forgive someone, think of Joseph forgiving his brothers. The Bible becomes your operating system.",
    roomCode: "NF",
    roomLabel: "Nature Freestyle Room",
    floor: 3,
    takeaway: "Bible study doesn't end when you close the book — it's a way of seeing the world.",
    actionStep: "Today, find three moments where something in life reminds you of a Bible story."
  },
  {
    day: 29,
    title: "Patterns That Never Fail",
    subtitle: "God repeats Himself on purpose",
    visualPrompt: "3 days: Joseph in prison, Jonah in the fish, Jesus in the tomb. 40 days: rain, Moses on Sinai, Jesus in the wilderness. God's patterns echo across centuries.",
    christQuestion: "Why does God repeat patterns? What is He teaching through repetition?",
    passage: "Ecclesiastes 1:9; Hebrews 13:8",
    content: "God uses patterns because He is consistent. The same God who delivered Israel from Egypt delivers you from sin. The same God who raised Jesus from the dead will raise you. Recognizing these patterns isn't trivia — it builds faith. If He was faithful then, He'll be faithful now.",
    roomCode: "PRm",
    roomLabel: "Patterns Room",
    floor: 4,
    takeaway: "God's patterns prove His faithfulness. What He did before, He will do again.",
    actionStep: "Find two stories in the Bible that follow the same pattern. Write down the similarities."
  },
  {
    day: 30,
    title: "Your Journey Continues",
    subtitle: "You've just begun",
    visualPrompt: "You stand at the entrance of a palace. Behind you: 30 days of discovery. Ahead: 8 floors of depth you've only glimpsed. The door is open.",
    christQuestion: "What has changed about how you see the Bible after these 30 days?",
    passage: "Psalm 119:18",
    content: "'Open thou mine eyes, that I may behold wondrous things out of thy law.' You've spent 30 days learning to see — to see Christ in every story, images behind every text, patterns across centuries, and a God who has been telling one story from beginning to end. But this is just the ground floor. The palace has 8 floors. You've unlocked the entrance.",
    roomCode: "∞",
    roomLabel: "The Palace Awaits",
    floor: 8,
    takeaway: "You now see the Bible differently. Keep going — the best discoveries are ahead.",
    actionStep: "Explore the Memory Palace. Choose one room to go deeper. Your Phototheology journey has begun."
  },
];

export const BIBLE_101_WEEKS = [
  { week: 1, title: "The Big Picture", days: [1, 2, 3, 4, 5], theme: "God's story from the beginning" },
  { week: 2, title: "Seeing the Pattern", days: [6, 7, 8, 9, 10], theme: "Learning to investigate Scripture" },
  { week: 3, title: "Christ Everywhere", days: [11, 12, 13, 14], theme: "Finding Jesus in unexpected places" },
  { week: 4, title: "The Gospels & the Cross", days: [15, 16, 17, 18, 19, 20], theme: "The life, death, and resurrection" },
  { week: 5, title: "The Big Themes", days: [21, 22, 23, 24], theme: "Sabbath, Sanctuary, Second Coming, Heaven" },
  { week: 6, title: "Bringing It Together", days: [25, 26, 27, 28, 29, 30], theme: "Becoming a visual Bible student" },
];
