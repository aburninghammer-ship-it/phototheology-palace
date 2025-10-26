export interface KidsDanielDay {
  day: number;
  week: number;
  title: string;
  ageGroup: 'ages-5-8' | 'ages-9-12' | 'ages-13-16';
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
    ageGroup: 'ages-5-8',
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
    ageGroup: 'ages-5-8',
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
    ageGroup: 'ages-5-8',
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
    ageGroup: 'ages-5-8',
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
    ageGroup: 'ages-13-16',
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
    ageGroup: 'ages-13-16',
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
  // Continue with Week 3-6 covering Daniel 8-12 in kid-friendly ways...
];

export default danielCourseKids;
