/**
 * Pre-built Bible Study Series Templates
 * These serve as examples and starting points for users
 */

export interface SeriesTemplate {
  id: string;
  title: string;
  description: string;
  audienceType: 'adults' | 'youth' | 'mixed' | 'new-believers' | 'seekers';
  context: 'sabbath-school' | 'small-group' | 'evangelistic' | 'youth-group' | 'online';
  primaryGoal: string;
  themeSubject: string;
  lessonCount: number;
  lessons: TemplateLessonOutline[];
}

export interface TemplateLessonOutline {
  lessonNumber: number;
  title: string;
  bigIdea: string;
  mainFloors: string[];
  keyRooms: string[];
  keyPassages: string;
  corePoints: string[];
  palaceMappingNotes: string;
  christEmphasis: string;
  discussionQuestions: string[];
  palaceActivity: string;
  takeHomeChallenge: string;
}

export const seriesTemplates: SeriesTemplate[] = [
  {
    id: 'daniel-kingdoms',
    title: 'Daniel & the Kingdoms',
    description: 'A 6-part series walking adults or youth through Daniel 2, 7, and 8 using the Palace floors and rooms. Focus: Christ\'s kingdom in the chaos of earthly empires.',
    audienceType: 'adults',
    context: 'sabbath-school',
    primaryGoal: 'Help people see Jesus at the center of Daniel\'s prophecies and understand God\'s sovereignty over world history.',
    themeSubject: 'Daniel\'s prophetic visions (chapters 2, 7, 8) and the eternal kingdom of Christ',
    lessonCount: 6,
    lessons: [
      {
        lessonNumber: 1,
        title: 'The Statue and the Stone: God\'s Kingdom in Daniel 2',
        bigIdea: 'By the end of this study, participants should see Daniel 2 as a visual timeline of world empires ending in God\'s eternal kingdom, understand that the stone represents Christ and His kingdom, feel more secure that history is not random, and be able to describe the statue and stone in simple language.',
        mainFloors: ['Floor 1 – Story', 'Floor 5 – Vision'],
        keyRooms: ['Story Room (SR)', 'Prophecy Room (PR)'],
        keyPassages: 'Daniel 2:1–45; Matthew 21:42–44; Luke 20:17–18',
        corePoints: [
          'The dream is a crisis before it is a prophecy—death is on the table before anyone hears the interpretation',
          'The statue is a timeline of human pride and power—metals get harder but cheaper, showing power increases but moral worth declines',
          'The stone is not another human empire—it\'s God\'s kingdom, cut out without hands',
          'History is not drifting; it\'s moving toward the stone—every empire rises and falls exactly as foretold',
          'Your allegiance must be to the stone, not to the statue'
        ],
        palaceMappingNotes: 'Floor 1 – Story Room: Picture the scene with 5 beats (king, dream, death decree, prayer, revelation). Floor 5 – Vision: Draw the statue on board (gold→silver→bronze→iron→clay), then draw stone striking feet and growing into mountain. Emphasize patterns: metals down in value but up in hardness.',
        christEmphasis: 'Tie the stone explicitly to Christ using Matthew 21:42–44. The same stone that the builders reject becomes the cornerstone and ultimately crushes the kingdoms that reject Him.',
        discussionQuestions: [
          'If you had to retell Daniel 2 in five short scenes, what would they be?',
          'Have you ever felt like your life was at the mercy of powers above you—job, government, economy? How does Daniel 2 speak to that feeling?',
          'What details about the statue stand out to you? Why do you think God used this image instead of just giving a list of kingdoms?',
          'The metals get stronger but less valuable as you go down. What might that say about human history and the way we define "progress"?',
          'In what ways is the stone completely different from the statue? List as many contrasts as you can.',
          'When Jesus calls Himself the "stone the builders rejected," how does that deepen your understanding of Daniel 2?',
          'What does it look like, practically, to live "stone-first" in a world obsessed with statue power—nationalism, political parties, economic status?',
          'What specific anxiety in your life looks smaller when you remember that the stone kingdom is guaranteed?'
        ],
        palaceActivity: 'Draw the Statue Map: On whiteboard, draw simple outline of statue. Group helps label each section (Gold=Babylon, Silver=Medo-Persia, etc.). Draw stone hitting feet and mountain filling space. Participants copy drawing in notes with one-sentence summary beside each metal and stone.',
        takeHomeChallenge: 'This week: (1) Memorize the statue sequence (gold, silver, bronze, iron, iron & clay) and what each represents. Review once a day. (2) Identify one "statue loyalty" in your life—something earthly you lean on for identity or security. In prayer, consciously surrender it to Christ the Stone.'
      },
      {
        lessonNumber: 2,
        title: 'Four Beasts, One Throne: The Vision of Daniel 7',
        bigIdea: 'Understand how Daniel 7 enlarges Daniel 2, see the beasts as kingdoms rising against God, and recognize the judgment scene where the Ancient of Days vindicates His people.',
        mainFloors: ['Floor 5 – Vision', 'Floor 6 – Horizons'],
        keyRooms: ['Prophecy Room (PR)', 'Patterns Room (PRm)'],
        keyPassages: 'Daniel 7:1–14; Revelation 13:1–2',
        corePoints: [
          'Daniel 7 is Daniel 2 enlarged—same kingdoms, different imagery (beasts vs. metals)',
          'Beasts show the predatory nature of earthly kingdoms—they devour and destroy',
          'The little horn introduces a new power that persecutes the saints',
          'The judgment scene (thrones set, books opened, Ancient of Days) is the climax',
          'The Son of Man receives the kingdom and shares it with the saints'
        ],
        palaceMappingNotes: 'Create visual comparison chart: Daniel 2 metals on left, Daniel 7 beasts on right. Draw beasts (lion, bear, leopard, terrifying beast). Emphasize little horn details. Show judgment throne scene as centerpiece.',
        christEmphasis: 'The Son of Man (v13-14) is Christ receiving His kingdom. Connect to His ascension and heavenly ministry. The saints receive the kingdom WITH Him (v27).',
        discussionQuestions: [
          'Why do you think God showed Daniel the same prophecy twice with different imagery?',
          'What does the beast imagery reveal about human kingdoms that the statue doesn\'t?',
          'Who is the little horn and what makes it different from the other beasts?',
          'Why is the judgment scene so important in this chapter?',
          'How does knowing Christ receives the kingdom give you confidence today?',
          'What does it mean that the saints possess the kingdom with Christ?'
        ],
        palaceActivity: 'Beast-to-Metal matching game: Print cards with beasts and metals. Have teams match Daniel 7 beasts to Daniel 2 metals and explain the connection.',
        takeHomeChallenge: 'Read Daniel 7 three times this week. Each time, focus on a different element: (1) the beasts, (2) the little horn, (3) the judgment scene. Journal one insight from each reading.'
      },
      {
        lessonNumber: 3,
        title: 'The Little Horn and the Judgment',
        bigIdea: 'Identify the little horn power, understand its persecution of the saints, and see how the judgment vindicates God\'s people.',
        mainFloors: ['Floor 5 – Vision', 'Floor 6 – Horizons'],
        keyRooms: ['Prophecy Room (PR)', 'Time Zone Room (TZ)', 'Three Heavens (2H)'],
        keyPassages: 'Daniel 7:8, 19–27; Revelation 13:5–7',
        corePoints: [
          'The little horn rises from the fourth beast (Rome) and has specific characteristics',
          'It speaks great words against the Most High and persecutes the saints for "time, times, and half a time" (1260 years)',
          'The judgment scene is not about condemning believers but vindicating them',
          'After judgment, the kingdom is given to the saints of the Most High',
          'We are living in the judgment hour—our loyalty to Christ matters eternally'
        ],
        palaceMappingNotes: 'Timeline on board: Show Rome → little horn → 1260-year period → judgment → kingdom to saints. Use Three Heavens framework (2H) to show we\'re in the judgment phase now.',
        christEmphasis: 'Christ is both the Judge (Ancient of Days attributes) and the Advocate (Son of Man). He defends His people in the judgment and shares His kingdom with them.',
        discussionQuestions: [
          'What characteristics help us identify the little horn historically?',
          'How does knowing about the 1260-year persecution help us understand church history?',
          'Why does the judgment focus on vindicating the saints rather than condemning them?',
          'What does "possessing the kingdom" look like practically for believers today?',
          'How should living in the judgment hour affect our daily choices?'
        ],
        palaceActivity: 'Judgment Scene Reconstruction: Draw the throne room scene from Daniel 7:9-10. Label: Ancient of Days, thrones, books opened, fire, thousands ministering. Discuss what each element means.',
        takeHomeChallenge: 'This week, memorize Daniel 7:27. Reflect daily on what it means that "the kingdom...shall be given to the people of the saints of the most High." How does this promise change your perspective on current struggles?'
      },
      {
        lessonNumber: 4,
        title: 'The Ram, the Goat, and the Sanctuary',
        bigIdea: 'Understand Daniel 8\'s vision, connect it to previous prophecies, and see how the 2300-day prophecy points to the cleansing of the sanctuary.',
        mainFloors: ['Floor 5 – Vision', 'Floor 6 – Horizons'],
        keyRooms: ['Prophecy Room (PR)', 'Blue Room – Sanctuary (BL)', 'Mathematics Room (MATH)'],
        keyPassages: 'Daniel 8:1–27; Daniel 9:24–27',
        corePoints: [
          'Daniel 8 focuses on Medo-Persia (ram) and Greece (goat) in more detail',
          'The little horn in Daniel 8 attacks the sanctuary and the daily ministry',
          'The 2300 days/years prophecy points to the cleansing of the sanctuary (1844)',
          'This connects to the judgment scene in Daniel 7',
          'The sanctuary is God\'s way of showing His plan of salvation and judgment'
        ],
        palaceMappingNotes: 'Three-part visual: (1) Draw ram and goat with horns, (2) Show timeline from 457 BC to 1844, (3) Draw simple sanctuary diagram showing cleansing/judgment connection.',
        christEmphasis: 'Christ is the High Priest in the heavenly sanctuary. The cleansing of the sanctuary is His final ministry before returning—investigating judgment, not vindictive punishment.',
        discussionQuestions: [
          'Why does Daniel 8 zoom in on Medo-Persia and Greece more than the other kingdoms?',
          'What does the attack on the sanctuary tell us about the nature of spiritual warfare?',
          'How do we calculate the 2300-day prophecy and what does it point to?',
          'What is the significance of 1844 in Adventist theology?',
          'How does Christ\'s heavenly ministry in the sanctuary give you confidence?',
          'What does it mean practically that we\'re living in the judgment hour?'
        ],
        palaceActivity: 'Sanctuary Timeline Math: Give teams the starting date (457 BC decree) and have them calculate 2300 years. Walk through the math together and show how it points to 1844. Then discuss what\'s happening in heaven right now.',
        takeHomeChallenge: 'Study Hebrews 8-10 this week. Write down every verse that mentions Christ\'s heavenly priesthood. How does this deepen your understanding of Daniel 8?'
      },
      {
        lessonNumber: 5,
        title: 'From Image to Beast to Dragon: Connecting Daniel & Revelation',
        bigIdea: 'See how Revelation enlarges Daniel, trace the statue→beasts→dragon progression, and understand the final conflict.',
        mainFloors: ['Floor 5 – Vision', 'Floor 6 – Horizons'],
        keyRooms: ['Prophecy Room (PR)', 'Patterns Room (PRm)', 'Parallels Room (P‖)', 'Three Angels Room (3A)'],
        keyPassages: 'Daniel 2, 7; Revelation 12-14',
        corePoints: [
          'Revelation is Daniel on steroids—same prophecies, fuller detail, final focus',
          'The dragon (Satan) is revealed as the power behind all earthly kingdoms',
          'Revelation 13 shows the beast rising from the sea (same as Daniel 7 little horn)',
          'The mark of the beast is the final test of loyalty: God\'s seal vs. Satan\'s mark',
          'The Three Angels\' Messages (Rev 14) are God\'s final call before Jesus returns'
        ],
        palaceMappingNotes: 'Create "repeat and enlarge" chart: Show Daniel 2 → Daniel 7 → Revelation 12-13 progression. Highlight how each prophecy adds detail. Use dragon symbol to show Satan\'s role throughout history.',
        christEmphasis: 'Christ is the Seed (Rev 12:5), the Lamb (Rev 14:1), and the coming King (Rev 14:14). He defeats the dragon, vindicates His people, and establishes His eternal kingdom.',
        discussionQuestions: [
          'How does Revelation help us understand Daniel better? Give specific examples.',
          'Why is it important to see Satan (the dragon) as the power behind earthly kingdoms?',
          'What is the mark of the beast and how do we avoid receiving it?',
          'How do the Three Angels\' Messages summarize God\'s final warning to the world?',
          'What does it mean to have the Father\'s name written on our foreheads (Rev 14:1)?',
          'How should knowing we\'re in the final conflict affect how we live?'
        ],
        palaceActivity: 'Prophecy Connection Web: On large paper, draw Daniel 2 statue in center. Add spokes connecting to Daniel 7 beasts, Daniel 8 ram/goat, Revelation 12 dragon, Revelation 13 beast. Show how they all connect. Label each connection.',
        takeHomeChallenge: 'Read Revelation 12-14 in one sitting this week. Mark every reference to the dragon, beast, or Lamb. Notice the cosmic conflict and ask yourself: Which side am I on? What does my loyalty look like practically?'
      },
      {
        lessonNumber: 6,
        title: 'Living Under the Stone Kingdom: Application & Mission',
        bigIdea: 'Apply all we\'ve learned to daily life, understand our mission as kingdom citizens, and live with confident hope in Christ\'s return.',
        mainFloors: ['Floor 7 – Spiritual Fire', 'Floor 8 – Mastery'],
        keyRooms: ['Fruit Room (FRt)', 'Fire Room (FRm)', 'Meditation Room (MR)'],
        keyPassages: 'Daniel 2:44; Revelation 14:6-12; Matthew 6:33; 2 Peter 3:10-14',
        corePoints: [
          'The stone kingdom is already here (in our hearts) and not yet (fully consummated)',
          'Kingdom citizens live by kingdom values: seek first the kingdom (Matt 6:33)',
          'Our mission is to proclaim the Three Angels\' Messages—call people out of Babylon',
          'We live in the "already but not yet"—the judgment is happening, the kingdom is coming',
          'Confident hope in the stone kingdom changes how we face trials, make decisions, and spend our time'
        ],
        palaceMappingNotes: 'Create visual of "Kingdom Now & Kingdom Come": Show how the stone is already growing (in our lives) but hasn\'t yet crushed the statue fully (still living in divided kingdoms). Emphasize living as citizens of the kingdom even now.',
        christEmphasis: 'Christ is both our current King (ruling in our hearts) and our coming King (returning to establish His eternal kingdom). Our job is to be His ambassadors (2 Cor 5:20) until He returns.',
        discussionQuestions: [
          'What does it mean practically that the stone kingdom is "already but not yet"?',
          'How do kingdom values differ from the values of the "statue kingdoms" around us?',
          'What is our mission as citizens of the stone kingdom living in statue territory?',
          'How does confident hope in Christ\'s return change the way you face daily challenges?',
          'What would it look like to "seek first the kingdom" in your specific life situation?',
          'How can we proclaim the Three Angels\' Messages without being judgmental or harsh?',
          'What is one area of your life where you need to surrender "statue loyalty" and live fully for the stone kingdom?'
        ],
        palaceActivity: 'Kingdom Citizenship Declaration: Have each person write a personal declaration: "As a citizen of the stone kingdom, I will..." (list 3-5 concrete actions). Share in small groups and pray for each other.',
        takeHomeChallenge: 'This week, live consciously as a kingdom citizen: (1) Daily prayer: "Your kingdom come, Your will be done" (Matt 6:10), asking what that means for your day. (2) Find one opportunity to share the hope of Christ\'s kingdom with someone. (3) Journal about one area where you\'re tempted to put "statue loyalty" over kingdom loyalty, and surrender it to Christ.'
      }
    ]
  },
  {
    id: 'three-angels',
    title: 'Three Angels, One Message',
    description: 'A 4-part series on Revelation 14:6–12, mapped into the Three Angels Room, with strong mission and character application.',
    audienceType: 'adults',
    context: 'small-group',
    primaryGoal: 'Help participants understand the Three Angels\' Messages as God\'s final gospel call and their role in proclaiming it.',
    themeSubject: 'The Three Angels\' Messages of Revelation 14:6-12 as final gospel proclamation',
    lessonCount: 4,
    lessons: [
      {
        lessonNumber: 1,
        title: 'Everlasting Gospel to Every Nation (First Angel)',
        bigIdea: 'Understand the first angel\'s message as the everlasting gospel, the call to worship the Creator, and the announcement of the judgment hour.',
        mainFloors: ['Floor 5 – Vision', 'Floor 7 – Spiritual Fire'],
        keyRooms: ['Three Angels Room (3A)', 'Fire Room (FRm)'],
        keyPassages: 'Revelation 14:6-7; Genesis 1:1; Exodus 20:11; Romans 1:16',
        corePoints: [
          'The everlasting gospel is the same good news given to Adam, Abraham, Moses—salvation by grace through faith',
          'Worship the Creator emphasizes God as maker of heaven and earth—ties to Sabbath commandment',
          'The hour of His judgment has come—we\'re living in the judgment hour right now',
          'This message goes to every nation, kindred, tongue, and people—universal mission',
          'Fear God means reverence, not terror—acknowledge His authority and love'
        ],
        palaceMappingNotes: 'Draw three concentric circles: Center = Everlasting Gospel, Middle ring = Worship Creator, Outer ring = Judgment Hour. Show how they all connect. Use Sabbath as practical expression of worship.',
        christEmphasis: 'Christ is the everlasting gospel—His life, death, and resurrection. He is the Creator (John 1:1-3, Col 1:16-17) and the Judge (John 5:22). Fearing God means trusting Christ completely.',
        discussionQuestions: [
          'What is the "everlasting gospel" and how has it been the same throughout history?',
          'Why is it significant that the first angel calls us to worship the Creator?',
          'How does the Sabbath commandment connect to the first angel\'s message?',
          'What does it mean practically that we\'re living in the judgment hour?',
          'How should "fear God" change the way we live daily?',
          'What is our responsibility in taking this message to every nation?'
        ],
        palaceActivity: 'Gospel Timeline: Create timeline from Genesis to Revelation showing how the "everlasting gospel" appears in different forms (promise to Adam, covenant to Abraham, sanctuary system, Christ\'s sacrifice, etc.). See unity of the message.',
        takeHomeChallenge: 'This week: (1) Memorize Revelation 14:6-7. (2) Worship the Creator by keeping Sabbath holy—rest in His finished work. (3) Share the gospel with one person, emphasizing that salvation is by grace through faith in Jesus.'
      },
      {
        lessonNumber: 2,
        title: 'Babylon is Fallen (Second Angel)',
        bigIdea: 'Understand what Babylon represents, why it has fallen, and the call to come out of her.',
        mainFloors: ['Floor 5 – Vision', 'Floor 6 – Horizons'],
        keyRooms: ['Three Angels Room (3A)', 'Prophecy Room (PR)', 'Patterns Room (PRm)'],
        keyPassages: 'Revelation 14:8; 18:1-4; 17:1-6; Isaiah 21:9',
        corePoints: [
          'Babylon is not a literal city but a symbol of false religion and spiritual confusion',
          'The name comes from the Tower of Babel (Gen 11)—rebellion against God, human pride',
          '"Fallen" is repeated twice for emphasis—her fall is certain and complete',
          'The wine of her fornication represents false doctrines that intoxicate people',
          '"Come out of her, my people" (Rev 18:4) is a call to separation from error'
        ],
        palaceMappingNotes: 'Use Pattern Room to trace Babylon through Scripture: Tower of Babel → Ancient Babylon (Daniel) → Spiritual Babylon (Revelation). Show progression of the symbol. Draw contrast chart: Babylon (confusion, rebellion, false worship) vs. New Jerusalem (clarity, obedience, true worship).',
        christEmphasis: 'Christ calls His people out of Babylon into the truth. He is the way, the truth, and the life (John 14:6)—the antidote to Babylon\'s confusion.',
        discussionQuestions: [
          'What does Babylon symbolize in Revelation and why is that symbol used?',
          'How is spiritual Babylon different from ancient Babylon but connected to it?',
          'What is the "wine of her fornication" and how does it intoxicate people today?',
          'Why does God say "fallen, fallen" twice? What\'s the significance?',
          'Who are "my people" still in Babylon and what is God calling them to do?',
          'How do we "come out of Babylon" practically without being judgmental?'
        ],
        palaceActivity: 'Babylon vs. New Jerusalem Comparison Chart: Divide whiteboard in half. Left side = Babylon characteristics (confusion, pride, false worship, human traditions). Right side = New Jerusalem characteristics (truth, humility, true worship, God\'s commands). Fill in together from Scripture.',
        takeHomeChallenge: 'This week: (1) Study Revelation 17-18 and list characteristics of Babylon. (2) Ask yourself: Is there any "Babylonian wine" (false teaching or tradition) I\'ve accepted? (3) Pray for people you know who are still in spiritual Babylon, that God would call them out.'
      },
      {
        lessonNumber: 3,
        title: 'The Mark, the Beast, and the Patience of the Saints (Third Angel)',
        bigIdea: 'Understand the mark of the beast, the consequences of receiving it, and the patience and faith of the saints who refuse it.',
        mainFloors: ['Floor 5 – Vision', 'Floor 7 – Spiritual Fire'],
        keyRooms: ['Three Angels Room (3A)', 'Prophecy Room (PR)', 'Fruit Room (FRt)'],
        keyPassages: 'Revelation 14:9-12; 13:15-17; 7:2-3',
        corePoints: [
          'The third angel\'s warning is the most solemn in Scripture—eternal consequences',
          'Worshiping the beast and receiving his mark leads to God\'s wrath without mixture of mercy',
          'The mark is about worship and allegiance, not just a physical sign',
          'God\'s seal (Rev 7:2-3) is the opposite of the beast\'s mark—shows ownership by God',
          'The patience of the saints is keeping God\'s commandments and the faith of Jesus through the final crisis'
        ],
        palaceMappingNotes: 'Create visual comparison: God\'s Seal (forehead = mind, keeping commandments, Sabbath as sign) vs. Beast\'s Mark (forehead or hand = mind or actions, false worship, Sunday sacredness). Show that the issue is worship—who do we obey?',
        christEmphasis: 'Christ is the seal of the living God. His name and character are written on our foreheads (Rev 14:1). Keeping "the faith of Jesus" means trusting Him completely through the final test.',
        discussionQuestions: [
          'What is the mark of the beast and how will it be enforced?',
          'Why is receiving the mark such a serious issue—why God\'s wrath "without mixture of mercy"?',
          'What is the seal of God and how do we receive it?',
          'Why is Sabbath-keeping connected to both the seal and the mark issue?',
          'What does "the patience of the saints" look like in the final crisis?',
          'How can we prepare now to stand faithful when the mark is enforced?',
          'What is "the faith of Jesus" and how is it different from faith IN Jesus?'
        ],
        palaceActivity: 'Seal vs. Mark Identification Game: Give scenarios and have groups identify whether each represents movement toward God\'s seal or the beast\'s mark. Discuss how our daily choices prepare us for the final test.',
        takeHomeChallenge: 'This week: (1) Study the Sabbath commandment (Ex 20:8-11) and its connection to worship. (2) Identify areas where you\'re tempted to compromise obedience for convenience. (3) Practice "the patience of the saints" by obeying God in one difficult area even when it\'s hard.'
      },
      {
        lessonNumber: 4,
        title: 'Fear God, Give Glory, and Shine (Putting It All Together)',
        bigIdea: 'Synthesize the Three Angels\' Messages into a unified mission call and understand our role in proclaiming them before Jesus returns.',
        mainFloors: ['Floor 7 – Spiritual Fire', 'Floor 8 – Mastery'],
        keyRooms: ['Three Angels Room (3A)', 'Fire Room (FRm)', 'Fruit Room (FRt)'],
        keyPassages: 'Revelation 14:6-12; Matthew 24:14; 28:18-20',
        corePoints: [
          'The Three Angels\' Messages are one unified message—the final gospel presentation',
          'This is Adventism\'s mission and identity—we exist to proclaim these messages',
          'The messages are both a warning and an invitation—come out, stand up, be sealed',
          'Proclaiming them requires both courage and compassion—we\'re calling people we love',
          'After the Three Angels fly, Jesus returns (Rev 14:14-20)—urgency!'
        ],
        palaceMappingNotes: 'Create a visual summary of all three angels flying together. Show how they build on each other: Angel 1 (call TO true worship) → Angel 2 (call OUT of false worship) → Angel 3 (warning about consequences). All point to Christ\'s return.',
        christEmphasis: 'Christ is the center of all three messages: He is the everlasting gospel, He calls us out of Babylon, He seals us for eternity, and He returns as King. Everything points to Him.',
        discussionQuestions: [
          'How do the Three Angels\' Messages work together as one unified message?',
          'Why did God give Seventh-day Adventists the mission to proclaim these messages?',
          'How can we share these solemn warnings with love and grace, not judgment?',
          'What role does the Holy Spirit play in proclaiming the Three Angels\' Messages?',
          'How should the urgency of Jesus\' soon return affect our daily priorities?',
          'What are practical ways we can proclaim these messages in our communities?',
          'How do we live as "lighthouses" in a dark world without being self-righteous?'
        ],
        palaceActivity: 'Three Angels Mission Statement: Have each person write a personal mission statement based on the Three Angels\' Messages: "I will proclaim..." Share in pairs and pray for each other. Then create a group mission statement for your study group.',
        takeHomeChallenge: 'This week: (1) Memorize all three angels\' messages (Rev 14:6-12). (2) Find one way to share these truths with someone—through conversation, literature, social media, or act of service. (3) Ask God to use you as a "voice" for the Three Angels before Jesus returns. Journal about the experience.'
      }
    ]
  }
  // ... remaining templates to be added (Palace Foundations, Gospel & Sanctuary, Identity & Kingdom)
];
