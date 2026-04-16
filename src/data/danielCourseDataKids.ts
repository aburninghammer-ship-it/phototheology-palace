export interface KidsDanielDay {
  day: number;
  week: number;
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

export const danielCourseKids: KidsDanielDay[] = [
  // Week 1: Daniel's Brave Choices
  {
    day: 1,
    week: 1,
    title: "Daniel Gets Kidnapped (But God Has a Plan!)",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Being brave when everything changes",
    scripture: "Daniel 1:8",
    scriptureText: "But Daniel purposed in his heart that he would not defile himself.",
    storyTime: "Daniel was a teenager living in Jerusalem when enemy soldiers invaded his city! The bad king Nebuchadnezzar took all the smart, strong young people as prisoners—including Daniel and his three best friends. They were marched hundreds of miles away to Babylon, a scary foreign city with strange food, strange language, and people who worshiped fake gods instead of the true God. Nebuchadnezzar said, 'I'm going to train you to work for me. Eat my royal food and drink my wine.' But there was a problem—that food had been offered to idols! Daniel had a choice: obey God or obey the king. Daniel was brave. He said, 'I won't eat that. Give me vegetables and water instead.' His guard was afraid—'The king will be mad!' But Daniel prayed, and God gave him favor. After 10 days, Daniel and his friends looked HEALTHIER than everyone else! The king was so impressed that he put Daniel in charge.",
    funActivity: "Food choice challenge: With your parent's help, choose between candy/soda and veggies/water for one meal. As you eat the healthy choice, remember Daniel's bravery. Draw Daniel refusing the king's fancy food and write: 'I CHOOSE GOD OVER JUNK!'",
    memoryVerse: "Daniel 1:8 - 'Daniel purposed in his heart.'",
    questionToThink: "What are some ways kids today have to choose between what's popular and what's right?",
    prayer: "Dear God, help me be brave like Daniel. When everyone around me is choosing wrong, give me courage to choose You. I want to honor You with my body, my words, and my choices. Amen.",
    parentNote: "Use this story to discuss peer pressure. Help your child identify one area where they face pressure to compromise (language, entertainment, friends' choices)."
  },
  {
    day: 2,
    week: 1,
    title: "The King's Bad Dream",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "God knows the future and shares it with those who trust Him",
    scripture: "Daniel 2:28",
    scriptureText: "But there is a God in heaven that revealeth secrets.",
    storyTime: "One night, King Nebuchadnezzar had a SUPER weird dream that scared him so much he woke up sweating! He called all his 'wise men'—the magicians, astrologers, and sorcerers—and said, 'I had a dream. Tell me what it was and what it means!' They said, 'Tell us the dream first, then we'll explain it.' But the king roared, 'NO! If you're really wise, you should be able to tell ME what I dreamed! If you can't, I'll CUT OFF YOUR HEADS!' The wise men panicked: 'No one can do that! It's impossible!' The king was furious and ordered ALL wise men in Babylon killed—including Daniel and his friends, even though they hadn't been asked yet! When Daniel heard about it, he prayed. He said, 'God, only You know dreams. Please show me what the king dreamed.' That night, God showed Daniel the ENTIRE dream AND its meaning in a vision! The next day, Daniel marched into the throne room and said, 'I can tell you your dream—not because I'm smart, but because MY GOD reveals secrets!'",
    funActivity: "Dream detective game: Draw a comic strip of Daniel's story with 4 panels: (1) King having nightmare, (2) Wise men panicking, (3) Daniel praying, (4) Daniel explaining the dream to the king. Add speech bubbles!",
    memoryVerse: "Daniel 2:22 - 'He revealeth the deep and secret things.'",
    questionToThink: "Why did God show Daniel the dream instead of the king's magicians?",
    prayer: "Dear God, You know everything—even the future! Thank You for answering prayers and showing Your people what they need to know. Help me trust You with things I don't understand. Amen.",
    parentNote: "Use this story to build prayer confidence. Ask your child: 'Is there something you don't understand or feel afraid about? Let's pray and ask God to reveal wisdom to you, just like He did for Daniel.'"
  },
  {
    day: 3,
    week: 1,
    title: "The Statue with Weird Toes",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "God's prophecy about kingdoms and how Jesus will win in the end!",
    scripture: "Daniel 2:44",
    scriptureText: "The God of heaven shall set up a kingdom, which shall never be destroyed.",
    storyTime: "Daniel told the king: 'You dreamed about a GIANT statue—but a weird one! The head was pure gold. The chest and arms were silver. The belly was bronze. The legs were iron. But the feet were a mix of iron and clay—that doesn't stick together well! As you watched, a rock came flying out of nowhere (no one threw it—it just appeared!). It smashed the statue's feet, and the WHOLE statue crumbled into dust. Then the rock grew into a HUGE mountain that filled the whole earth!' The king gasped—that WAS his dream! Daniel said, 'Here's what it means: The GOLD head? That's you, King Nebuchadnezzar—Babylon. After you, another kingdom will rise (SILVER = Medo-Persia), then another (BRONZE = Greece), then IRON legs (Rome—super strong!), then feet of iron + clay (divided kingdoms that never fully unite). But watch: the ROCK is God's kingdom! When Jesus returns, He'll destroy all human kingdoms and set up His eternal kingdom. That rock is JESUS!' Sure enough, history happened exactly like Daniel said!",
    funActivity: "Build the statue! Stack items to represent each kingdom: (Head) something gold/yellow, (Chest) something silver/gray, (Belly) something bronze/brown, (Legs) something hard like sticks, (Feet) clay + rocks mixed. Then drop a rock on the feet and watch it fall! Shout: 'JESUS' KINGDOM WINS!'",
    memoryVerse: "Daniel 2:44 - 'The God of heaven shall set up a kingdom which shall never be destroyed.'",
    questionToThink: "We live in the 'iron and clay' time right now. How do you see kingdoms NOT sticking together today?",
    prayer: "Dear Jesus, thank You for showing us the future! Human kingdoms rise and fall, but Your kingdom will last forever. I want to be part of Your kingdom! Help me be faithful until You return. Amen.",
    parentNote: "Use a map or timeline to show your child where we are in history (feet of iron/clay). Discuss how Jesus' second coming will be the 'rock' that ends all human governments."
  },
  {
    day: 4,
    week: 1,
    title: "Three Boys vs. A Fiery Furnace",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Staying faithful even when it's scary",
    scripture: "Daniel 3:17-18",
    scriptureText: "Our God is able to deliver us... But if not... we will not serve thy gods.",
    storyTime: "Years later, King Nebuchadnezzar built a GIANT golden statue—90 feet tall! He made a law: 'When the music plays, everyone BOW DOWN and worship my statue. If you don't, you'll be thrown into a blazing furnace!' Daniel's three friends (Shadrach, Meshach, and Abednego) heard the law. They looked at each other—'We can't bow to a statue! We only worship God!' When the music played, EVERYONE bowed... except those three boys. Soldiers saw them standing and told the king. Nebuchadnezzar was FURIOUS! He said, 'I'll give you one more chance. Bow or BURN!' The boys answered, 'Our God can save us from the fire. But even if He doesn't, we STILL won't bow.' The king was so mad he made the furnace 7 times hotter! He threw them in—the fire was SO hot it killed the soldiers who tossed them in! But inside the furnace... something AMAZING happened! The king jumped up: 'Didn't we throw THREE men in? I see FOUR—and the fourth looks like the Son of God!' The three boys walked around inside the fire completely safe. Jesus was IN THE FIRE WITH THEM!",
    funActivity: "Fire can't hurt them! Draw the three boys inside a huge furnace with flames all around. Draw Jesus standing with them, protecting them. Color the flames bright red, orange, and yellow. Write at the top: 'JESUS IS IN THE FIRE WITH ME!'",
    memoryVerse: "Daniel 3:18 - 'But if not... we will NOT serve thy gods!'",
    questionToThink: "What would you do if everyone told you to do something wrong or you'd get in BIG trouble?",
    prayer: "Dear Jesus, thank You for being with Shadrach, Meshach, and Abednego in the fire. Help me be brave like them. Even when I'm scared, help me choose You. I know You're always with me! Amen.",
    parentNote: "Discuss modern 'bowing' scenarios: going along with lying, cheating, or mocking God to fit in. Reinforce that Jesus promises to be with us in our 'furnace' moments."
  },
  {
    day: 5,
    week: 1,
    title: "The Night God Wrote on a Wall",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "God sees everything, even when people think He doesn't",
    scripture: "Daniel 5:27",
    scriptureText: "Thou art weighed in the balances, and art found wanting.",
    storyTime: "King Nebuchadnezzar died, and his grandson Belshazzar became king. Belshazzar was proud and disrespectful. One night, he threw a HUGE party with 1,000 guests. He decided to do something super insulting: he brought out the sacred golden cups that his grandfather had stolen from God's temple in Jerusalem—cups that were supposed to be used ONLY for worshiping God—and used them to drink wine while praising idols! As they drank and laughed, suddenly... a HAND appeared out of nowhere! A ghostly hand with no body attached! Everyone froze in terror as the hand wrote mysterious words on the palace wall: 'MENE, MENE, TEKEL, UPHARSIN.' Then the hand disappeared. Belshazzar's face turned white. He screamed for his wise men: 'What does it mean?!' No one knew. Finally, the queen remembered Daniel. They brought him in. Daniel said, 'You knew about the true God, but you mocked Him anyway. Here's what the writing means: MENE = God has numbered your kingdom and finished it. TEKEL = You've been weighed on God's scale and found too light (not good enough). UPHARSIN = Your kingdom will be divided and given to the Medes and Persians.' That very night, enemy soldiers snuck into Babylon through the river and killed Belshazzar. God's prophecy came true!",
    funActivity: "Create the mysterious handwriting! On a large paper, trace your hand. Inside the hand outline, write 'MENE, MENE, TEKEL, UPHARSIN' in big fancy letters. Around it write: 'GOD SEES EVERYTHING I DO!' Put it on your wall as a reminder.",
    memoryVerse: "Daniel 5:27 - 'Thou art weighed in the balances.'",
    questionToThink: "If God weighed your actions this week on His scale, what would He find?",
    prayer: "Dear God, You see everything I do—even when I think no one's watching. Help me live like You're always near (because You are!). Forgive me for times I've disrespected You. I want to honor You in everything! Amen.",
    parentNote: "Discuss accountability: God sees and weighs our actions. Use this story to talk about honesty when no one is watching."
  },
  {
    day: 6,
    week: 1,
    title: "Daniel in the Lions' Den",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Praying even when it's against the law",
    scripture: "Daniel 6:10",
    scriptureText: "He kneeled upon his knees three times a day, and prayed, and gave thanks before his God, as he did aforetime.",
    storyTime: "Daniel was now an old man, and he served a new king named Darius. King Darius LOVED Daniel—he was going to put him in charge of the WHOLE kingdom! But the other officials were jealous. They plotted, 'How can we get rid of Daniel?' They watched him but couldn't find him doing anything wrong. Finally they realized: 'Daniel's only weakness is his God!' So they tricked the king: 'O King, make a law that for 30 days, NO ONE can pray to anyone except YOU. If they do, throw them into the lions den!' The king signed the law. Daniel heard about it. Did he hide his praying? NOPE! He went home, opened his window toward Jerusalem, and prayed to God THREE TIMES A DAY like he always did! The enemies caught him and told the king. Darius was heartbroken—he loved Daniel—but the law couldn't be changed. At sunset, Daniel was thrown into a pit of HUNGRY LIONS! The king couldn't sleep all night. At sunrise, he ran to the den: 'Daniel! Did your God save you?!' Daniel called back, 'MY GOD SENT HIS ANGEL AND SHUT THE LIONS MOUTHS!' The king pulled Daniel out—not a scratch! Then he threw Daniel's enemies into the den, and the lions ate them instantly. Why didn't they eat Daniel? Because GOD protected him!",
    funActivity: "Lions' den art! Draw or color a picture of Daniel standing calmly in a pit with lions all around him. Draw an angel shutting the lions' mouths. Color the lions orange and yellow. Write: 'GOD PROTECTS ME WHEN I PRAY!'",
    memoryVerse: "Daniel 6:10 - 'He prayed three times a day, as he did before.'",
    questionToThink: "What would you do if praying to God was against the law?",
    prayer: "Dear God, thank You for protecting Daniel in the lions' den! Help me be brave and keep praying to You no matter what. I know You're with me and You'll take care of me. Amen.",
    parentNote: "Practice praying openly as a family. Talk about religious freedom and how some countries still make it illegal to worship Jesus."
  },
  {
    day: 7,
    week: 1,
    title: "Review: Daniel's Greatest Hits!",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Remembering this week's brave stories",
    scripture: "Daniel 6:26-27",
    scriptureText: "He is the living God, and stedfast for ever, and his kingdom shall not be destroyed.",
    storyTime: "Let's review the amazing adventures you learned this week! (1) Daniel refused the king's food and chose to honor God instead—even as a prisoner. (2) God revealed King Nebuchadnezzar's dream to Daniel when no one else could. (3) Shadrach, Meshach, and Abednego refused to bow to the statue and Jesus met them in the fire. (4) God's hand wrote on the wall and judged King Belshazzar's sin. (5) Daniel prayed even when it was illegal, and God shut the lions' mouths! Do you see the pattern? Every time Daniel and his friends chose God over the world, God protected them and made them shine brighter! The kings who saw these miracles declared: 'The God of Daniel is the TRUE God!' That's the power of faithfulness—it makes God famous!",
    funActivity: "Create a 'Daniel Week' poster with 5 sections: (1) Daniel refusing food, (2) The dream statue, (3) Fiery furnace, (4) Handwriting on wall, (5) Lions' den. Draw stick figures for each. Present it to your family!",
    memoryVerse: "Daniel 1:17 - 'God gave them knowledge and skill in all learning.'",
    questionToThink: "Which Daniel story is your favorite? Why?",
    prayer: "Dear God, thank You for Daniel's example! He was faithful when he was young, middle-aged, and old. Help me start being faithful NOW while I'm young, and keep following You my whole life. Amen.",
    parentNote: "Have your child retell one story to a sibling, friend, or grandparent. This cements memory and builds confidence in witnessing."
  },
  // Week 2: The Beasts of Daniel 7
  {
    day: 8,
    week: 2,
    title: "Four Scary Beasts Rise from the Sea",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Understanding that beasts in prophecy represent kingdoms",
    scripture: "Daniel 7:17",
    scriptureText: "These great beasts, which are four, are four kings, which shall arise out of the earth.",
    storyTime: "Years later, Daniel himself had a dream—and it was TERRIFYING! He saw the ocean churning in a storm. Then out of the water came four massive beasts, one after another. BEAST #1: A LION with eagle wings! As Daniel watched, its wings were torn off, it stood like a man, and it was given a man's heart. BEAST #2: A BEAR—lopsided, with 3 ribs in its mouth! A voice said, 'Get up and eat lots of meat!' BEAST #3: A LEOPARD with FOUR wings and FOUR heads—super fast! BEAST #4: This one was the WORST. It was terrifying, had iron teeth, 10 horns, and crushed everything in its path. Then a LITTLE HORN grew up, plucked out 3 horns, and had EYES like a man and a mouth speaking proud words! Daniel woke up shaking. What did it mean? An angel explained: 'The beasts are kingdoms that will rise and fall.' (Same kingdoms as the statue in chapter 2, but now with MORE details!) Lion = Babylon. Bear = Medo-Persia. Leopard = Greece. Terrible beast = Rome. Little horn = A POWER that comes from Rome, speaks against God, and persecutes God's people for 1,260 years!",
    funActivity: "Beast drawing challenge! Draw all four beasts. Make them look as wild and scary as possible. Label each: Lion = Babylon, Bear = Medo-Persia, Leopard = Greece, Terrible Beast = Rome. Draw the little horn with a mouth and eyes. Then draw a throne above it all with Jesus sitting on it—showing HE'S in charge!",
    memoryVerse: "Daniel 7:14 - 'His dominion is an everlasting dominion.'",
    questionToThink: "Why does God show the same kingdoms as beasts in Daniel 7 that He showed as statue parts in Daniel 2?",
    prayer: "Lord, these prophecies show that You know the future. Even when scary kingdoms rise, You're still on Your throne. Help me trust that You're in control of history! Amen.",
    parentNote: "Explain that prophecy isn't meant to scare us but to build confidence—God knows what's coming and He's already planned the victory!"
  },
  {
    day: 9,
    week: 2,
    title: "The Judgment Day Scene",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Understanding the pre-Advent judgment (not scary—it's GOOD news!)",
    scripture: "Daniel 7:9-10",
    scriptureText: "The judgment was set, and the books were opened.",
    storyTime: "After seeing the four beasts, Daniel saw something even MORE amazing—a courtroom scene in HEAVEN! Thrones were set up. The 'Ancient of Days' (God the Father) sat down—His clothes white as snow, His hair like pure wool, His throne a fiery flame with wheels of fire! Thousands of angels attended Him. Then the books were opened. What books? The books recording every person's life! This is called the Investigative Judgment—it's happening RIGHT NOW in heaven. Jesus is our Lawyer/High Priest defending us. The devil is the accuser (Revelation 12:10). The angels are witnesses. God the Father is the Judge. Here's what people get WRONG: They think judgment is scary. But it's actually GOOD NEWS! Why? Because Jesus is your defense attorney! When Satan accuses, 'This person sinned!' Jesus says, 'Yes, but I died for them. My blood covers them. They accepted Me. They're Mine!' The judgment isn't to make you afraid—it's to publicly clear your name and prove you belong to Jesus. After this judgment, Jesus will return!",
    funActivity: "Courtroom diagram: Draw a courtroom with these people: (1) God the Judge on the throne, (2) Jesus your Lawyer standing beside you, (3) Satan the accuser pointing at you, (4) Angels as witnesses. Draw a book labeled 'Book of Life' with your name in it. Write: 'JESUS DEFENDS ME!'",
    memoryVerse: "1 John 2:1 - 'If any man sin, we have an advocate with the Father, Jesus Christ.'",
    questionToThink: "Why is the judgment good news if you're trusting in Jesus?",
    prayer: "Dear Jesus, thank You for being my Advocate in heaven's court. I mess up every day, but I trust that Your blood covers me. Help me live in a way that shows I'm Yours. I'm not afraid of judgment because I'm Yours! Amen.",
    parentNote: "Clarify the difference between investigative judgment (happening now in heaven—determining who truly belongs to Christ) vs. executive judgment (after Jesus returns—carrying out the sentence). This prevents fear and builds assurance."
  },
  {
    day: 10,
    week: 2,
    title: "The Little Horn's Big Mouth",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Identifying the antichrist power (not scary—just truth!)",
    scripture: "Daniel 7:25",
    scriptureText: "He shall speak great words against the most High, and shall wear out the saints.",
    storyTime: "The 'little horn' in Daniel 7 is one of the most important prophecies in the Bible. Let's identify it step by step using only what the Bible says: (1) It comes from the 4th beast (Rome), (2) It plucks up 3 horns/kingdoms, (3) It has eyes (intelligence) and a mouth speaking great things (proud words against God), (4) It makes war with the saints and prevails (persecutes God's people), (5) It speaks against the Most High (blasphemy), (6) It thinks to CHANGE TIMES AND LAWS (God's law!), (7) It rules for 'a time, times, and half a time' = 1,260 years. History shows only ONE power fits ALL these clues: The Papal system that ruled Europe from AD 538-1798. It came from Rome (check!), destroyed 3 kingdoms that opposed it (check!), claimed authority equal to God (check!), persecuted millions of Christians who wouldn't submit (check!), changed God's 4th commandment about Sabbath (check!), and ruled for exactly 1,260 years until Napoleon's general took the pope captive in 1798 (check!). This isn't about hating Catholics—it's about identifying a SYSTEM that opposes God's truth. Many beautiful Catholics are being deceived by the system. Our job isn't to attack them but to lovingly share truth!",
    funActivity: "Clue chart: Make a table with two columns: 'Bible Clue from Daniel 7' and 'Historical Match.' List all 7 clues and write how the Papal system matches each one. Research one historical fact (like the 1,260 years) to verify it yourself!",
    memoryVerse: "Daniel 7:25 - 'He shall think to change times and laws.'",
    questionToThink: "Why is it important to identify the antichrist power without being hateful toward people caught in that system?",
    prayer: "Father, thank You for giving us prophecy to prepare us for the end. Help me understand these truths and share them with love, not pride. Give me compassion for people deceived by false systems. Amen.",
    parentNote: "This is sensitive content. Emphasize: We identify the SYSTEM, not attack PEOPLE. Many sincere believers are in that system. Our mission is truth-telling with love, not hate."
  },
  // Week 3: The Ram, Goat, and 2300 Days (Daniel 8)
  {
    day: 11,
    week: 3,
    title: "The Ram and the Goat Vision",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "More animal prophecies that came true!",
    scripture: "Daniel 8:20-21",
    scriptureText: "The ram which thou sawest... are the kings of Media and Persia. And the rough goat is the king of Grecia.",
    storyTime: "Daniel had another wild dream! This time he saw a RAM with two horns—one was longer than the other. The ram was POWERFUL, charging in every direction. No one could stop it! Then suddenly, a GOAT came flying across the earth so fast its feet didn't even touch the ground! It had one huge horn between its eyes. The goat SLAMMED into the ram, broke both its horns, and stomped on it. The goat was now the strongest animal around. But then—SNAP!—the big horn broke off, and FOUR smaller horns grew in its place. An angel told Daniel exactly what this meant: the RAM = Medo-Persia (the two horns = Media and Persia, with Persia being the stronger one). The GOAT = Greece (the big horn = Alexander the Great). When Alexander died young, his kingdom was split among his FOUR generals (4 horns)! Historians confirm: this prophecy was written 200+ years BEFORE it happened!",
    funActivity: "Animal battle comic: Draw a 4-panel comic: (1) Ram charging around, (2) Flying goat appears, (3) Goat smashes ram, (4) Big horn breaks into 4 small ones. Label: 'God knew this 200 years ahead!'",
    memoryVerse: "Daniel 8:26 - 'The vision of the evening and the morning is true.'",
    questionToThink: "How does fulfilled prophecy prove the Bible is from God?",
    prayer: "Dear God, You predicted Alexander the Great and the four generals hundreds of years before they were born. You know MY future too! Help me trust Your plan for my life. Amen.",
    parentNote: "Research Alexander the Great briefly with your child. Show how he conquered at age 20 and died at 33, just as the prophecy described."
  },
  {
    day: 12,
    week: 3,
    title: "The 2,300 Day Prophecy",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "The longest time prophecy in the Bible!",
    scripture: "Daniel 8:14",
    scriptureText: "Unto two thousand and three hundred days; then shall the sanctuary be cleansed.",
    storyTime: "After seeing the ram and goat, Daniel heard two angels talking: 'How long until the sanctuary is cleansed?' Answer: '2,300 days!' But wait—the sanctuary was destroyed! So this must be about the HEAVENLY sanctuary where Jesus is our High Priest right now. In Bible prophecy, 1 day = 1 year (Numbers 14:34). So 2,300 days = 2,300 years! When does it start? The angel Gabriel explained in Daniel 9: 'From the command to restore Jerusalem...' That command was given in 457 BC. Do the math: 457 BC + 2,300 years = 1844 AD! What happened in 1844? Jesus moved from the Holy Place to the Most Holy Place in heaven's sanctuary to begin the JUDGMENT—the 'cleansing' mentioned here! This is when God's people's names are examined to see who truly belongs to Jesus. The Millerite movement in America discovered this prophecy and expected Jesus to return in 1844. They had the DATE right but the EVENT wrong—it wasn't Jesus coming to Earth, but Jesus beginning His final work in Heaven!",
    funActivity: "Math prophecy worksheet: Draw a timeline starting at 457 BC. Mark the following: 457 BC (Start), add 2300 years, = 1844 AD. Write 'SANCTUARY CLEANSING BEGINS!' at 1844. Draw Jesus moving from one room to another in heaven's sanctuary.",
    memoryVerse: "Daniel 8:14 - 'Unto two thousand and three hundred days.'",
    questionToThink: "Why is it important that Jesus is our High Priest right now in heaven's sanctuary?",
    prayer: "Jesus, thank You for being my High Priest. Right now You're in heaven's Most Holy Place, defending me and preparing to return. Help me be ready when You come back! Amen.",
    parentNote: "The 2300-day prophecy is foundational to Adventist identity. Help your teen understand 1844 not as a failed prediction but as a correct date with a corrected understanding."
  },
  {
    day: 13,
    week: 3,
    title: "Daniel's Prayer of Confession",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "How to pray a really powerful prayer",
    scripture: "Daniel 9:4-5",
    scriptureText: "We have sinned, and have committed iniquity... and have rebelled.",
    storyTime: "Daniel was reading the prophecy of Jeremiah, which said Israel's captivity in Babylon would last 70 years. Daniel realized: 'That's almost done! Time to pray!' But Daniel didn't pray a little prayer. He put on sackcloth (scratchy uncomfortable clothes), covered himself in ashes, and FASTED (didn't eat). Then he prayed one of the most powerful prayers in the Bible! Notice something amazing: Daniel said 'WE have sinned'—not 'THEY have sinned.' Even though Daniel was one of the most righteous men in the Bible, he identified with his people's sins. He didn't point fingers or blame others. He took responsibility as part of the group. Daniel confessed: 'We rebelled. We didn't listen to the prophets. We were stubborn. We deserve this punishment. But God, You are merciful! Forgive us! Restore Your city Jerusalem!' While Daniel was STILL PRAYING, the angel Gabriel showed up and said, 'God heard you the MOMENT you started praying! I'm here to give you understanding!' God answers humble, repentant prayer!",
    funActivity: "Write your own confession prayer: Like Daniel, confess something YOU need forgiveness for. Write: 'God, I confess that I have __________. Please forgive me and help me do better. I trust in Your mercy. Amen.' (This is just between you and God!)",
    memoryVerse: "Daniel 9:19 - 'O Lord, hear; O Lord, forgive!'",
    questionToThink: "Why did Daniel say 'we' instead of 'they' when confessing sins?",
    prayer: "Lord, I confess my sins to You right now—not my family's sins, not my friends' sins, but MY sins. Forgive me. Cleanse me. Help me live for You. Thank You for Your mercy! Amen.",
    parentNote: "Model confession for your child. Share an appropriate example of when you needed to confess something to God and how He forgave you."
  },
  {
    day: 14,
    week: 3,
    title: "The 70 Weeks Prophecy",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Calculating the exact year Jesus would be baptized!",
    scripture: "Daniel 9:25",
    scriptureText: "Unto the Messiah the Prince shall be seven weeks, and threescore and two weeks.",
    storyTime: "While Daniel was praying, Gabriel arrived with a new prophecy: 'Seventy weeks are determined for your people and your holy city.' Using the day=year principle, 70 weeks × 7 days = 490 days = 490 years. Gabriel divided it into parts: (1) 7 weeks (49 years) to rebuild Jerusalem's walls; (2) 62 more weeks (434 years) until Messiah the Prince. That's 49 + 434 = 483 years from the command to rebuild Jerusalem to the MESSIAH! Start date: 457 BC (decree of Artaxerxes). 457 BC + 483 years = 27 AD! What happened in 27 AD? JESUS WAS BAPTIZED and began His ministry! The prophecy continues: 'In the midst of the week [final 7 years] He shall cause the sacrifice to cease.' Jesus was crucified in the middle of the last week (31 AD), exactly 3.5 years after His baptism! This prophecy predicted Jesus' baptism date 500+ years in advance! At the end of the 70 weeks (34 AD), Stephen was stoned and the gospel went to the Gentiles. Every date matched perfectly!",
    funActivity: "70 Weeks timeline: Draw a long line. Mark: 457 BC (start), 408 BC (Jerusalem rebuilt), 27 AD (Jesus baptized!), 31 AD (Jesus crucified), 34 AD (Gospel to Gentiles). Color-code the 7 weeks, 62 weeks, and 1 week. Share this with someone!",
    memoryVerse: "Daniel 9:25 - 'Unto the Messiah the Prince.'",
    questionToThink: "How does the 70 Weeks prophecy PROVE Jesus is the true Messiah?",
    prayer: "Jesus, Your arrival was predicted to the exact YEAR hundreds of years before! You are the true Messiah. Help me share this proof with others who doubt. Thank You for fulfilling every prophecy! Amen.",
    parentNote: "This prophecy is one of the strongest proofs for Jesus' Messiahship. Consider showing a Jewish person this prophecy—it's from THEIR Scriptures!"
  },
  // Week 4: Daniel's Spiritual Warfare (Daniel 10)
  {
    day: 15,
    week: 4,
    title: "Daniel Sees a Glorious Being",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Meeting angels is overwhelming—but they're on our side!",
    scripture: "Daniel 10:5-6",
    scriptureText: "His body also was like the beryl, and his face as the appearance of lightning.",
    storyTime: "Daniel had been fasting and praying for THREE WEEKS. He was standing by the Tigris River when suddenly he looked up and saw... SOMEONE AMAZING. This being wore linen clothes with a golden belt. His body gleamed like a precious gem. His face flashed like lightning. His eyes were like torches of fire. His arms and feet glowed like polished bronze. His voice sounded like a roaring crowd! Daniel's companions didn't see the vision, but they felt TERROR and ran away! Daniel was left alone, face to face with this glorious being. He felt all strength drain from his body. He fell on his face to the ground! The being touched him and said, 'Don't be afraid, Daniel. God loves you. Stand up!' Even with help, Daniel was trembling. The angel had to strengthen him THREE TIMES before he could even speak! This shows us: heavenly beings are AWESOME in the true sense—so amazing and powerful that humans can barely handle their presence!",
    funActivity: "Draw the glowing being: Use bright colors for the lightning face, fiery eyes, bronze arms/legs, and golden belt. Make it as glorious as possible! Draw Daniel on the ground in awe.",
    memoryVerse: "Daniel 10:19 - 'O man greatly beloved, fear not: peace be unto thee.'",
    questionToThink: "Why do you think Daniel's companions felt terror even though they couldn't SEE the angel?",
    prayer: "Lord, Your angels are so powerful and glorious! Thank You for sending them to protect me, even when I can't see them. Help me remember that the unseen world is real! Amen.",
    parentNote: "Discuss the unseen spiritual world. Angels and demons are real, even though we don't see them. This builds faith in God's protection."
  },
  {
    day: 16,
    week: 4,
    title: "The Prince of Persia—A Demon Stronghold",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Understanding spiritual warfare behind the scenes",
    scripture: "Daniel 10:12-13",
    scriptureText: "The prince of the kingdom of Persia withstood me one and twenty days.",
    storyTime: "Here's where it gets INTENSE. The glorious being (probably Gabriel) told Daniel: 'From the FIRST DAY you started praying, God heard you and sent me with the answer. But the prince of the kingdom of Persia fought against me for 21 DAYS!' Wait—who could fight an angel for 3 weeks? This wasn't a human prince. This was a DEMON assigned to control the Persian Empire! Gabriel continued, 'Michael, one of the chief princes, came to help me, and I left him fighting there so I could come to you.' This reveals something huge: there's a WAR going on in the unseen world! Demons try to influence nations. Angels fight to protect God's people and deliver answers to prayer. Some prayers take TIME to be answered—not because God is slow, but because there's spiritual warfare happening! Michael (Jesus, the commander) and Gabriel (a top angel) were battling demonic forces over the fate of empires and the future of God's people. Your prayers matter in this cosmic war!",
    funActivity: "Spiritual warfare diagram: Draw the earth with Persia highlighted. Above it, draw a demon ('Prince of Persia') blocking an angel. Draw Michael coming as backup. Label each figure. Write: 'MY PRAYERS AFFECT THE BATTLE!'",
    memoryVerse: "Ephesians 6:12 - 'We wrestle not against flesh and blood, but against principalities.'",
    questionToThink: "If demons try to block answered prayers, what should we do when prayer isn't answered right away?",
    prayer: "Father, I know there's a spiritual war I can't see. When my prayers seem unanswered, help me KEEP PRAYING! I trust that You and Your angels are fighting for me right now. I won't give up! Amen.",
    parentNote: "This passage gives the biblical basis for persistent prayer (Luke 18:1-8). Encourage your teen not to give up on 'unanswered' prayers—the battle may still be raging!"
  },
  // Week 5: The King of the North and South (Daniel 11)
  {
    day: 17,
    week: 5,
    title: "Prophecy of Wars and Alliances",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Daniel 11 predicted centuries of history in advance",
    scripture: "Daniel 11:2",
    scriptureText: "Behold, there shall stand up yet three kings in Persia.",
    storyTime: "Daniel 11 is the MOST DETAILED prophecy in the Bible—so detailed that skeptics claim it must have been written AFTER the events! But we know Daniel was a real prophet. Here's a summary: Verse 2 predicts THREE more Persian kings, then a fourth richer than all (Xerxes, who attacked Greece). Verses 3-4 predict Alexander the Great ('a mighty king') whose kingdom would be divided among FOUR (not his children!). Verses 5-20 describe the wars between 'King of the North' (Seleucid Syria) and 'King of the South' (Ptolemaic Egypt)—back-and-forth battles, marriages, alliances, and betrayals that ALL came true in exact detail. Verses 21-35 describe Antiochus Epiphanes, who desecrated the Jewish temple with a pig on the altar and killed many Jews. Verses 36-39 transition to a NEW power (the Papacy). Verses 40-45 describe end-time events still being fulfilled! The point? God knows EVERY twist and turn of history. Nothing surprises Him!",
    funActivity: "Research challenge: Pick ONE section of Daniel 11 (like verses 3-4 about Alexander). Look up the historical fulfillment online. Write 3 facts that prove the prophecy came true!",
    memoryVerse: "Isaiah 46:10 - 'Declaring the end from the beginning.'",
    questionToThink: "Why would God give such detailed prophecy about wars and political alliances?",
    prayer: "God, Daniel 11 shows You know every detail of history before it happens. Nothing catches You by surprise. Help me trust You even when the world seems chaotic. You're in control! Amen.",
    parentNote: "Daniel 11 can be overwhelming. Focus on the BIG PICTURE: God knows everything in advance. For deeper study, use a verse-by-verse commentary together."
  },
  // Week 6: The End and Resurrection (Daniel 12)
  {
    day: 18,
    week: 6,
    title: "Michael Stands Up—The Time of Trouble",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "When Jesus finishes His work in heaven, the final crisis begins",
    scripture: "Daniel 12:1",
    scriptureText: "At that time shall Michael stand up... there shall be a time of trouble, such as never was.",
    storyTime: "Daniel 12 reveals the END of the story! 'At that time, Michael shall stand up.' Michael is Jesus (the name means 'Who is like God?'). When He 'stands up,' His work as our High Priest in heaven is DONE. That's when the 'time of trouble' begins—the worst crisis in history! But here's the GOOD NEWS in verse 1: 'At that time, your people shall be delivered—everyone whose name is found written in the book!' If your name is in the Book of Life (because you've accepted Jesus as your Savior), you will be PROTECTED! Even if the crisis is scary, God's people won't be abandoned. He'll deliver them just like He delivered Daniel from the lions and his friends from the fire!",
    funActivity: "Book of Life craft: Take a small notebook or fold paper to make a 'Book of Life.' Write your name inside. Write names of family and friends you're praying for. Decorate the cover. Pray: 'Lord, please keep these names in Your real Book of Life!'",
    memoryVerse: "Daniel 12:1 - 'Everyone whose name is found written in the book.'",
    questionToThink: "Is your name in the Book of Life? How do you know?",
    prayer: "Jesus, I want my name in the Book of Life! Thank You for being my High Priest who defends me. When the time of trouble comes, I trust You to protect me. I'm not afraid because I'm Yours! Amen.",
    parentNote: "Discuss assurance of salvation: our names are in the Book of Life when we accept Jesus and keep trusting Him (Rev 3:5). Help your child understand this isn't about earning salvation."
  },
  {
    day: 19,
    week: 6,
    title: "The Resurrection Promise",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "People who died loving Jesus will wake up again!",
    scripture: "Daniel 12:2",
    scriptureText: "Many of them that sleep in the dust of the earth shall awake.",
    storyTime: "Here's one of the most BEAUTIFUL verses in Daniel! 'Many of those who sleep in the dust of the earth shall awake, some to everlasting life...' When the Bible says people 'sleep,' it means they've died. Their bodies are in the ground. But guess what? They're NOT gone forever! When Jesus returns, a LOUD trumpet will sound, and all the people who loved Jesus will WAKE UP! Their bodies will come out of the ground—but not as zombies! They'll be PERFECT. No more sickness. No more sadness. No more death. They'll live FOREVER with Jesus! If you've had someone you love die—a grandparent, a pet, a friend—and they loved Jesus, you WILL see them again! They're just 'sleeping' until Jesus comes. Isn't that amazing?",
    funActivity: "Resurrection drawing: Draw a graveyard with stones. Then draw Jesus in the sky with a trumpet. Draw people coming OUT of the graves with happy faces, flying up to meet Jesus! Write: 'WE WILL MEET AGAIN!'",
    memoryVerse: "1 Thessalonians 4:16 - 'The dead in Christ shall rise first.'",
    questionToThink: "Is there someone you love who died? How does the resurrection promise make you feel?",
    prayer: "Jesus, thank You for the promise that death is not the end. The people I love who are sleeping will wake up when You return! I can't wait to see them and You! Come soon, Lord Jesus! Amen.",
    parentNote: "If your child has experienced loss, this is a powerful comfort. Let them talk about their loved one and affirm the hope of resurrection."
  },
  {
    day: 20,
    week: 6,
    title: "Shining Like Stars Forever!",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "People who teach others about Jesus will glow like stars!",
    scripture: "Daniel 12:3",
    scriptureText: "They that turn many to righteousness shall shine as the stars for ever and ever.",
    storyTime: "Daniel 12:3 is one of the most ENCOURAGING verses ever! 'Those who are wise shall shine like the brightness of the sky. And those who turn many to righteousness shall shine like the stars forever and ever!' What does this mean? When you tell someone about Jesus—and they believe—you helped 'turn them to righteousness.' And in heaven, you'll GLOW like a star! Imagine: billions of years from now, you'll still be shining! The more people you help know Jesus, the brighter you'll shine. This isn't about getting attention—it's about showing how your life blessed others! Every time you share a Bible story, every time you invite a friend to church, every time you show God's love—you're storing up STAR SHINE for eternity!",
    funActivity: "Star collection: Cut out paper stars. Every time you share something about Jesus with someone this week, write their name on a star. Hang the stars in your room as reminders that you're building eternal brightness!",
    memoryVerse: "Daniel 12:3 - 'Shine as the stars for ever and ever.'",
    questionToThink: "Who could YOU tell about Jesus this week?",
    prayer: "God, I want to shine like a star forever! Give me courage to share Your love with others. Help me tell someone about You this week. I want to help fill heaven with people who love You! Amen.",
    parentNote: "Make this practical: help your child identify ONE person they could share something about Jesus with this week. Role-play how to do it."
  },
  {
    day: 21,
    week: 6,
    title: "Daniel Course Complete—Now YOU Be Faithful!",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Putting it all together—Daniel's life lessons",
    scripture: "Daniel 12:13",
    scriptureText: "Go thou thy way till the end... thou shalt rest, and stand in thy lot at the end of the days.",
    storyTime: "We've reached the end of Daniel! The angel's final words to Daniel were: 'Go your way until the end. You will rest, and at the end of days you will rise to receive your reward!' Daniel had been faithful his whole life—from teenager to old man. He stood strong when kidnapped. He prayed when outlawed. He interpreted dreams when no one else could. He saw visions of the future. He trusted God through every trial. And now God promised: 'You'll rest (die peacefully) and then RISE (be resurrected) to receive your eternal reward!' The same promise applies to YOU! Be faithful like Daniel. Make brave choices. Keep praying. Study prophecy. Trust God through hard times. And one day, you too will rise and shine like a star forever! Daniel's story isn't just history—it's a PATTERN for how to live in the last days. Will you be a Daniel?",
    funActivity: "Final project: Create a 'Daniel Lessons' poster with these 5 points: (1) Stay faithful to God's health laws, (2) Pray every day no matter what, (3) Study prophecy to understand the times, (4) Trust God when life is scary, (5) Share God's truth with others. Decorate it and put it where you'll see it daily!",
    memoryVerse: "Daniel 12:13 - 'Thou shalt rest, and stand in thy lot at the end.'",
    questionToThink: "Which lesson from Daniel do you most need to apply to YOUR life?",
    prayer: "Lord, thank You for the book of Daniel! Thank You for showing me that a young person CAN be faithful in a wicked world. Help me be like Daniel—brave, prayerful, wise, and faithful till the end. Come soon, Lord Jesus! Amen.",
    parentNote: "Celebrate completing this study! Consider rewards, a special dinner, or sharing what your child learned with extended family. Reinforce that finishing well matters."
  }
];

export default danielCourseKids;
