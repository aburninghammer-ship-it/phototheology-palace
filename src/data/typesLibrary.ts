// Types Room Library - OT Types Pointing to Christ
// Each type shows how OT shadows find their substance in Christ

export interface BiblicalType {
  id: string;
  type: string;
  category: 'person' | 'object' | 'event' | 'institution' | 'office';
  otReference: string;
  otDescription: string;
  ntFulfillment: string;
  ntReference: string;
  christConnection: string;
  application: string;
}

export const typesLibrary: BiblicalType[] = [
  // PERSON TYPES
  {
    id: 'adam',
    type: 'Adam',
    category: 'person',
    otReference: 'Genesis 2:7; 3:15',
    otDescription: 'First man, head of humanity, brought death through sin',
    ntFulfillment: 'Christ as Last Adam brings life',
    ntReference: 'Romans 5:14-19; 1 Corinthians 15:22, 45',
    christConnection: 'As Adam was head of fallen humanity, Christ is head of redeemed humanity. Adam brought death; Christ brings life.',
    application: 'Our identity is no longer in Adam (condemnation) but in Christ (justification).'
  },
  {
    id: 'abel',
    type: 'Abel',
    category: 'person',
    otReference: 'Genesis 4:4-10',
    otDescription: 'Righteous one killed by his brother, blood cries from ground',
    ntFulfillment: "Christ's blood speaks a better word than Abel's",
    ntReference: 'Hebrews 11:4; 12:24',
    christConnection: "Abel's blood cried for vengeance; Christ's blood cries for mercy and forgiveness.",
    application: 'We come to a Mediator whose blood pleads grace, not judgment.'
  },
  {
    id: 'melchizedek',
    type: 'Melchizedek',
    category: 'person',
    otReference: 'Genesis 14:18-20',
    otDescription: 'King of Salem, priest of God Most High, no recorded genealogy',
    ntFulfillment: 'Christ is eternal priest-king after Melchizedek order',
    ntReference: 'Hebrews 5:6-10; 7:1-28',
    christConnection: 'Melchizedek combined kingship and priesthood—Christ alone fulfills this as eternal Priest-King.',
    application: 'Christ is our forever mediator who never dies and never stops interceding.'
  },
  {
    id: 'isaac',
    type: 'Isaac',
    category: 'person',
    otReference: 'Genesis 22:1-19',
    otDescription: 'Only begotten son of promise, bound on altar, figuratively raised',
    ntFulfillment: 'Christ is the only begotten Son actually sacrificed and raised',
    ntReference: 'Hebrews 11:17-19; John 3:16',
    christConnection: 'Isaac carried the wood, was bound willingly, and was spared when God provided a substitute. Christ IS the substitute.',
    application: 'What Abraham was spared from giving, God Himself gave—His only Son.'
  },
  {
    id: 'joseph',
    type: 'Joseph',
    category: 'person',
    otReference: 'Genesis 37-50',
    otDescription: 'Beloved son, rejected by brothers, exalted to save his family',
    ntFulfillment: 'Christ rejected by His own, exalted to save the world',
    ntReference: 'Acts 7:9-14; Romans 11:11-15',
    christConnection: 'Joseph was sold for silver, falsely accused, imprisoned, then exalted to save those who rejected him.',
    application: 'What men meant for evil, God meant for good—Christ turns rejection into redemption.'
  },
  {
    id: 'moses',
    type: 'Moses',
    category: 'person',
    otReference: 'Deuteronomy 18:15-19',
    otDescription: 'Deliverer, lawgiver, mediator between God and Israel',
    ntFulfillment: 'Christ is the Prophet like Moses, greater deliverer',
    ntReference: 'Acts 3:22-26; 7:37; Hebrews 3:1-6',
    christConnection: 'Moses delivered from Egypt; Christ delivers from sin. Moses gave law; Christ fulfills it.',
    application: 'Jesus is the final Prophet—when He speaks, we must listen.'
  },
  {
    id: 'david',
    type: 'David',
    category: 'person',
    otReference: '2 Samuel 7:12-16',
    otDescription: 'Shepherd-king, man after God\'s heart, throne established forever',
    ntFulfillment: 'Christ is Son of David, eternal King on David\'s throne',
    ntReference: 'Matthew 1:1; Luke 1:32-33; Revelation 22:16',
    christConnection: 'David defeated Goliath as underdog champion; Christ defeats Satan and death as our champion.',
    application: 'Jesus is the King who fights our battles and establishes an unshakeable kingdom.'
  },
  {
    id: 'solomon',
    type: 'Solomon',
    category: 'person',
    otReference: '1 Kings 3-10',
    otDescription: 'Wise king, temple builder, peaceful reign',
    ntFulfillment: 'Christ is greater than Solomon in wisdom, temple, and peace',
    ntReference: 'Matthew 12:42; John 2:19-21; Colossians 2:3',
    christConnection: 'Solomon built a physical temple; Christ is the true temple and builds the living temple (church).',
    application: 'In Christ are hidden all treasures of wisdom—seek Him for answers.'
  },
  {
    id: 'jonah',
    type: 'Jonah',
    category: 'person',
    otReference: 'Jonah 1:17',
    otDescription: 'Three days in fish, then delivered to preach to Gentiles',
    ntFulfillment: 'Christ three days in tomb, resurrection, gospel to all nations',
    ntReference: 'Matthew 12:39-41',
    christConnection: 'Jonah\'s experience was a sign—Christ\'s burial and resurrection is THE sign to all generations.',
    application: 'The resurrection of Jesus is the ultimate proof that He is who He claims to be.'
  },
  {
    id: 'elijah',
    type: 'Elijah',
    category: 'person',
    otReference: '1 Kings 17-19; 2 Kings 1-2',
    otDescription: 'Prophet who called Israel back to true worship, confronted apostasy',
    ntFulfillment: 'John the Baptist came in spirit of Elijah; Christ is Lord of all prophets',
    ntReference: 'Matthew 11:14; 17:10-13; Luke 1:17',
    christConnection: 'Elijah prepared the way for revival; John prepared the way for Christ, the ultimate revival.',
    application: 'Christ calls us back from spiritual compromise to wholehearted worship.'
  },
  {
    id: 'samuel',
    type: 'Samuel',
    category: 'person',
    otReference: '1 Samuel 2-3',
    otDescription: 'Only a boy when he discovered his mission in the temple, called from sleep to serve as priest in the house of God',
    ntFulfillment: 'Christ as a boy discovered His mission in the temple, and was called from the sleep of death to serve as our High Priest',
    ntReference: 'Luke 2:41-49; Hebrews 5:5-6',
    christConnection: 'Samuel was a child when God called him in the temple; Jesus at twelve said "I must be about My Father\'s business." Samuel was called from sleep to serve; Christ was called from the sleep of death to serve as eternal Priest.',
    application: 'God calls us early and unexpectedly—be listening in the temple of His Word.'
  },
  {
    id: 'joshua',
    type: 'Joshua',
    category: 'person',
    otReference: 'Joshua 1-4; 3:14-17',
    otDescription: 'Crossed the Jordan to lead twelve tribes into the Promised Land',
    ntFulfillment: 'Christ crossed the Jordan at baptism to lead twelve apostles, and will lead His people into the heavenly Promised Land',
    ntReference: 'Matthew 3:13-17; Acts 7:45; Hebrews 4:8-9; Revelation 21:1-4',
    christConnection: 'Joshua (Yeshua—same name as Jesus) crossed the Jordan to lead 12 tribes into Canaan. Christ crossed the Jordan at baptism to lead 12 apostles, and will lead His people into the eternal Promised Land.',
    application: 'Jesus is our Joshua—He goes before us into every promise and every battle.'
  },
  {
    id: 'daniel',
    type: 'Daniel',
    category: 'person',
    otReference: 'Daniel 1; 9:1-19',
    otDescription: 'Overcame the temptation of appetite; interceded on behalf of his people',
    ntFulfillment: 'Christ overcame appetite in the wilderness; He intercedes for His people in the heavenly sanctuary',
    ntReference: 'Matthew 4:1-4; Hebrews 7:25; Romans 8:34',
    christConnection: 'Daniel purposed not to defile himself with the king\'s food; Christ refused Satan\'s bread in the wilderness. Daniel interceded for captive Israel; Christ intercedes for captive humanity.',
    application: 'Victory over appetite and faithful intercession for others follow the pattern of Christ.'
  },
  {
    id: 'job',
    type: 'Job',
    category: 'person',
    otReference: 'Job 1-2; 42:10',
    otDescription: 'Refused the sin of presumption, endured suffering, was tempted to think God forsook him, prayed for his enemies',
    ntFulfillment: 'Christ refused presumption in the wilderness, endured the cross, cried "Why hast Thou forsaken Me?" and prayed for His enemies',
    ntReference: 'Matthew 4:5-7; 27:46; Luke 23:34',
    christConnection: 'Job refused to presume upon God; Christ refused to throw Himself from the temple. Job felt abandoned by God yet held on; Christ cried "Why hast thou forsaken me?" yet trusted. Job prayed for his enemies; Christ prayed "Father, forgive them."',
    application: 'Like Christ, hold to God even when you cannot feel Him, and pray for those who harm you.'
  },
  {
    id: 'three-hebrews',
    type: 'Shadrach, Meshach, and Abednego',
    category: 'person',
    otReference: 'Daniel 3:1-30',
    otDescription: 'Refused to bow before another lord, faced the fiery furnace, and a fourth figure appeared with them',
    ntFulfillment: 'Christ refused to bow to Satan and was with the three Hebrews in the fire',
    ntReference: 'Matthew 4:8-10; Philippians 2:10-11',
    christConnection: 'The three Hebrews refused to bow before Nebuchadnezzar\'s idol; Christ refused to bow before Satan. The fourth man in the fire was Christ Himself—He walks with us through every trial.',
    application: 'When you refuse to compromise, Christ stands with you in the fire.'
  },
  {
    id: 'elisha',
    type: 'Elisha',
    category: 'person',
    otReference: '2 Kings 2-13',
    otDescription: 'Raised the dead, multiplied bread, healed lepers, and his dead bones brought a man to life',
    ntFulfillment: 'Christ raised the dead, multiplied bread, healed lepers, and His death brought many to life from the grave',
    ntReference: 'John 11:43-44; John 6:11-13; Luke 17:12-14; Matthew 27:52-53',
    christConnection: 'Elisha raised the Shunammite\'s son; Christ raised Lazarus. Elisha multiplied bread for 100; Christ fed 5,000. Elisha healed Naaman; Christ cleansed lepers. Elisha\'s dead bones raised a man; Christ\'s death raised many saints from the grave.',
    application: 'The miracles of Elisha were previews—Christ does everything Elisha did, on a grander scale and with eternal effect.'
  },
  {
    id: 'ezekiel',
    type: 'Ezekiel',
    category: 'person',
    otReference: 'Ezekiel 2:3-7; 8:1-18',
    otDescription: 'Preached to a stubborn and rebellious people and spoke against the abominations done in the temple',
    ntFulfillment: 'Christ preached to a stiff-necked generation and cleansed the temple of abominations',
    ntReference: 'Matthew 23:37; John 2:13-17; Matthew 21:12-13',
    christConnection: 'Ezekiel was sent to a rebellious people who would not listen; Christ wept over Jerusalem\'s stubbornness. Ezekiel exposed temple abominations; Christ drove out those who defiled His Father\'s house.',
    application: 'God\'s truth must be spoken even to those who refuse to hear—faithfulness over popularity.'
  },
  {
    id: 'josiah',
    type: 'Josiah',
    category: 'person',
    otReference: '2 Kings 22-23; 2 Chronicles 34-35',
    otDescription: 'Young king who exposed false worship, discovered the lost Book of the Law, and purified the temple',
    ntFulfillment: 'Christ exposed false worship, restored true understanding of Scripture, and cleansed the temple',
    ntReference: 'Matthew 15:1-9; 21:12-13; John 4:23-24',
    christConnection: 'Josiah tore down the high places and restored worship according to God\'s Word; Christ confronted man-made traditions and called for worship in spirit and truth.',
    application: 'Let Christ\'s Word expose every false worship pattern in your life.'
  },
  {
    id: 'enoch',
    type: 'Enoch',
    category: 'person',
    otReference: 'Genesis 5:22-24',
    otDescription: 'Walked with God and was translated without seeing death',
    ntFulfillment: 'Christ walked with the Father perfectly and ascended bodily into heaven',
    ntReference: 'John 8:29; Acts 1:9-11; Hebrews 11:5',
    christConnection: 'Enoch walked with God and was taken up; Christ walked with the Father and ascended to heaven. Enoch\'s translation foreshadows the rapture of the saints at Christ\'s return.',
    application: 'Walk so closely with God that the boundary between earth and heaven disappears.'
  },
  {
    id: 'nehemiah',
    type: 'Nehemiah',
    category: 'person',
    otReference: 'Nehemiah 6:3, 15',
    otDescription: 'Would not come down from the wall because he had a great work to do; finished the work',
    ntFulfillment: 'Christ would not come down from the cross because He had a great work to do; He cried "It is finished"',
    ntReference: 'Matthew 27:40-42; John 19:30',
    christConnection: 'Nehemiah\'s enemies begged him to come down; the crowd mocked Jesus saying "come down from the cross." Nehemiah refused—he had a great work. Christ refused—He had a world to save. Nehemiah finished the wall; Christ cried "It is finished."',
    application: 'Stay on your cross. Don\'t come down. Finish the work God gave you to do.'
  },
  {
    id: 'samson',
    type: 'Samson',
    category: 'person',
    otReference: 'Judges 16:21-30',
    otDescription: 'Beaten, bound, and mocked; placed between two pillars, bowed his head, pushed, and saved more in death than in life',
    ntFulfillment: 'Christ was beaten, bound, and mocked; placed between two thieves, bowed His head, and saved more in His death than in His life',
    ntReference: 'Matthew 27:26-50; John 12:24; Hebrews 2:14-15',
    christConnection: 'Samson was beaten, bound, mocked, placed between two pillars, bowed his head, and his death caused a great rumbling. Christ was beaten, bound, mocked, placed between two crosses, bowed His head, the earth quaked, and He saved more in death than in life.',
    application: 'The greatest victory often comes through apparent defeat—the cross looked like failure but was ultimate triumph.'
  },
  {
    id: 'noah-person',
    type: 'Noah',
    category: 'person',
    otReference: 'Genesis 6-9',
    otDescription: 'Lifted up above the earth on wood so that all who came to him would be saved',
    ntFulfillment: 'Christ was lifted up on wood (the cross) above the earth so all who come to Him would be saved',
    ntReference: 'John 3:14-15; 12:32',
    christConnection: 'Noah was lifted above the earth on the ark (wood) and drew all living things to himself for salvation. Christ was lifted on the cross (wood) and said "I, if I be lifted up, will draw all men to Me."',
    application: 'Christ lifted up on the cross is the magnetic center of salvation—look and live.'
  },
  {
    id: 'gideon',
    type: 'Gideon',
    category: 'person',
    otReference: 'Judges 7:1-22',
    otDescription: 'Put down the enemies of God with a small remnant using unconventional weapons',
    ntFulfillment: 'Christ will put down the enemies of God at the end of the millennium with the word of His mouth',
    ntReference: 'Revelation 20:7-10; 2 Thessalonians 2:8; Revelation 19:15',
    christConnection: 'Gideon defeated the Midianites with trumpets, empty pitchers, and light—unconventional weapons. Christ defeats His enemies not with armies but with the brightness of His coming and the sword of His mouth.',
    application: 'God\'s methods of victory defy human strategy—trust His unconventional ways.'
  },
  {
    id: 'jacob',
    type: 'Jacob',
    category: 'person',
    otReference: 'Genesis 29:1-30',
    otDescription: 'Went away to a far country to work for his bride, then returned',
    ntFulfillment: 'Christ went away to heaven to work for His bride (the church), and will return for her',
    ntReference: 'John 14:2-3; Ephesians 5:25-27; Revelation 19:7-9',
    christConnection: 'Jacob left his father\'s house and labored years to win his bride Rachel. Christ left His Father\'s house (heaven) and labors in the heavenly sanctuary to prepare for His bride, the church.',
    application: 'Christ is working for you right now—He is coming back for His bride.'
  },
  {
    id: 'abraham',
    type: 'Abraham',
    category: 'person',
    otReference: 'Genesis 12:1-3; 17:4-5; 22:1-18',
    otDescription: 'Father of a great multitude, gave up his only son, received him back from the dead figuratively',
    ntFulfillment: 'God the Father gave up His only Son and received Him back from the dead literally; Christ is father of a great multitude',
    ntReference: 'John 3:16; Hebrews 11:17-19; Isaiah 9:6; Revelation 7:9',
    christConnection: 'Abraham was called "father of many nations." Christ is called "Everlasting Father" (Isaiah 9:6). Abraham gave up Isaac; God gave up Christ. Abraham received Isaac back from the dead figuratively; God received Christ back literally.',
    application: 'The faith of Abraham points to the greater Father who gave everything for us.'
  },
  {
    id: 'jephthah',
    type: 'Jephthah',
    category: 'person',
    otReference: 'Judges 12:5-6',
    otDescription: 'Destroyed those who could not speak the right language (Shibboleth)',
    ntFulfillment: 'Christ will destroy those who cannot speak the heavenly language at the end of the millennium',
    ntReference: 'Revelation 20:9-15; Matthew 7:21-23; Zephaniah 3:9',
    christConnection: 'The Gileadites under Jephthah tested the Ephraimites by their speech—those who could not say "Shibboleth" were destroyed. At the end, those who do not know the language of heaven ("Lord, Lord" without relationship) will be separated from God\'s people.',
    application: 'Learn to speak heaven\'s language now—worship, prayer, surrender—so you are recognized as belonging to God.'
  },

  // OBJECT TYPES
  {
    id: 'ark',
    type: 'Noah\'s Ark',
    category: 'object',
    otReference: 'Genesis 6-8',
    otDescription: 'Only means of salvation from flood judgment, one door',
    ntFulfillment: 'Christ is the only way of salvation from coming judgment',
    ntReference: '1 Peter 3:20-21; John 10:9',
    christConnection: 'One ark, one door, one means of safety—Christ alone saves from judgment.',
    application: 'Enter through Christ before judgment comes; He is our ark of safety.'
  },
  {
    id: 'ladder',
    type: 'Jacob\'s Ladder',
    category: 'object',
    otReference: 'Genesis 28:12',
    otDescription: 'Ladder connecting heaven and earth, angels ascending/descending',
    ntFulfillment: 'Christ is the way between heaven and earth',
    ntReference: 'John 1:51',
    christConnection: 'Jesus IS the ladder—the only connection between God and man, heaven and earth.',
    application: 'Access to God is through Christ alone—He bridges the gap.'
  },
  {
    id: 'burning-bush',
    type: 'Burning Bush',
    category: 'object',
    otReference: 'Exodus 3:2-6',
    otDescription: 'Bush burns but not consumed, God\'s presence dwelling',
    ntFulfillment: 'Christ is I AM, divine presence in human form',
    ntReference: 'John 8:58',
    christConnection: 'The I AM of the bush is the I AM of John 8—Jesus reveals God without being consumed.',
    application: 'God came near in Christ—holy yet accessible, consuming yet merciful.'
  },
  {
    id: 'passover-lamb',
    type: 'Passover Lamb',
    category: 'object',
    otReference: 'Exodus 12:1-13',
    otDescription: 'Unblemished lamb, blood on doorposts, death passes over',
    ntFulfillment: 'Christ is our Passover Lamb sacrificed for us',
    ntReference: '1 Corinthians 5:7; John 1:29; 1 Peter 1:18-19',
    christConnection: 'The lamb died at twilight; Christ died at the exact hour Passover lambs were slain.',
    application: 'His blood covers us; judgment passes over those who trust in the Lamb.'
  },
  {
    id: 'manna',
    type: 'Manna',
    category: 'object',
    otReference: 'Exodus 16:14-35',
    otDescription: 'Bread from heaven, daily provision, sustained life in wilderness',
    ntFulfillment: 'Christ is the true bread from heaven',
    ntReference: 'John 6:31-35, 48-51',
    christConnection: 'Manna sustained physical life temporarily; Christ gives eternal life to all who feed on Him.',
    application: 'Daily dependence on Christ nourishes our spiritual life.'
  },
  {
    id: 'rock',
    type: 'Rock in Wilderness',
    category: 'object',
    otReference: 'Exodus 17:6; Numbers 20:8',
    otDescription: 'Rock struck, water flows, sustains life',
    ntFulfillment: 'Christ is the Rock struck for us, living water flows',
    ntReference: '1 Corinthians 10:4; John 7:37-39',
    christConnection: 'The rock was struck ONCE (like Christ crucified once); striking again dishonored God.',
    application: 'Christ was struck for us once—we now speak to Him in prayer for living water.'
  },
  {
    id: 'bronze-serpent',
    type: 'Bronze Serpent',
    category: 'object',
    otReference: 'Numbers 21:8-9',
    otDescription: 'Serpent lifted up, those who look live',
    ntFulfillment: 'Christ lifted up on cross, those who believe live',
    ntReference: 'John 3:14-15',
    christConnection: 'The serpent represented the curse; Christ became a curse for us, lifted up for our healing.',
    application: 'Look to Christ crucified for salvation—it\'s as simple as looking in faith.'
  },
  {
    id: 'tabernacle',
    type: 'Tabernacle',
    category: 'object',
    otReference: 'Exodus 25-27',
    otDescription: 'God\'s dwelling place among His people',
    ntFulfillment: 'Christ tabernacled among us; we are now His temple',
    ntReference: 'John 1:14; 1 Corinthians 3:16; 6:19',
    christConnection: 'The tabernacle was God dwelling WITH Israel; Christ is God dwelling AS one of us.',
    application: 'God now dwells IN believers through His Spirit—we are mobile sanctuaries.'
  },
  {
    id: 'veil',
    type: 'Temple Veil',
    category: 'object',
    otReference: 'Exodus 26:31-35',
    otDescription: 'Barrier separating Holy Place from Most Holy, only High Priest passed',
    ntFulfillment: 'Christ\'s flesh is the veil, torn at His death',
    ntReference: 'Hebrews 10:19-20; Matthew 27:51',
    christConnection: 'The veil said "stay out"—it tore from top to bottom, God saying "come in" through Christ.',
    application: 'We have bold access to God\'s presence through Jesus—enter confidently.'
  },
  {
    id: 'mercy-seat',
    type: 'Mercy Seat',
    category: 'object',
    otReference: 'Exodus 25:17-22',
    otDescription: 'Gold cover on ark, blood sprinkled, God meets with His people',
    ntFulfillment: 'Christ is our propitiation (mercy seat)',
    ntReference: 'Romans 3:25; Hebrews 9:5; 1 John 2:2',
    christConnection: 'The mercy seat was where wrath was satisfied—Christ IS where God\'s wrath meets His mercy.',
    application: 'God looks at us through the blood of Christ and sees righteousness, not sin.'
  },

  // EVENT TYPES
  {
    id: 'creation',
    type: 'Creation',
    category: 'event',
    otReference: 'Genesis 1-2',
    otDescription: 'God speaks and creates, brings order from chaos',
    ntFulfillment: 'Christ is the agent of creation and new creation',
    ntReference: 'John 1:1-3; Colossians 1:16; 2 Corinthians 5:17',
    christConnection: 'The Word that created the world is the Word that creates new hearts.',
    application: 'If you are in Christ, you are a new creation—old has gone, new has come.'
  },
  {
    id: 'flood',
    type: 'The Flood',
    category: 'event',
    otReference: 'Genesis 6-8',
    otDescription: 'Judgment on sin, salvation through water, new beginning',
    ntFulfillment: 'Baptism into Christ, judgment passed, new life',
    ntReference: '1 Peter 3:20-21; Matthew 24:37-39',
    christConnection: 'As Noah passed through waters of judgment to new life, we pass through baptism to resurrection life.',
    application: 'Baptism marks our transition from the old world (Adam) to the new (Christ).'
  },
  {
    id: 'red-sea',
    type: 'Red Sea Crossing',
    category: 'event',
    otReference: 'Exodus 14',
    otDescription: 'Israel passes through water, enemies destroyed, deliverance complete',
    ntFulfillment: 'Baptism into Christ, death of old life, freedom from slavery',
    ntReference: '1 Corinthians 10:1-2; Romans 6:3-4',
    christConnection: 'Israel was baptized into Moses; we are baptized into Christ—same pattern, greater reality.',
    application: 'Your old slave-master (sin) drowned at the cross; walk in newness of life.'
  },
  {
    id: 'day-atonement',
    type: 'Day of Atonement',
    category: 'event',
    otReference: 'Leviticus 16',
    otDescription: 'High priest enters Most Holy once yearly, blood atones, sins removed',
    ntFulfillment: 'Christ entered heavenly sanctuary once for all with His own blood',
    ntReference: 'Hebrews 9:7-12, 24-28',
    christConnection: 'The high priest entered repeatedly; Christ entered once, accomplished eternal redemption.',
    application: 'Our sin is not just covered but removed—Christ finished the work.'
  },

  // INSTITUTION TYPES
  {
    id: 'sabbath',
    type: 'Sabbath',
    category: 'institution',
    otReference: 'Genesis 2:2-3; Exodus 20:8-11',
    otDescription: 'Day of rest commemorating creation, cessation from work',
    ntFulfillment: 'Christ is our rest; we cease from self-salvation efforts',
    ntReference: 'Hebrews 4:9-10; Matthew 11:28-30',
    christConnection: 'Sabbath pointed to rest in Christ—we stop trying to earn righteousness and rest in His.',
    application: 'Enter God\'s rest by faith, not works. The Sabbath remains as sign of trust in the Creator.'
  },
  {
    id: 'priesthood',
    type: 'Levitical Priesthood',
    category: 'institution',
    otReference: 'Exodus 28-29; Leviticus 8-9',
    otDescription: 'Mediators between God and Israel, offered sacrifices',
    ntFulfillment: 'Christ is the great High Priest; believers are royal priesthood',
    ntReference: 'Hebrews 4:14-16; 7:23-28; 1 Peter 2:9',
    christConnection: 'Levitical priests died and were replaced; Christ lives forever to intercede.',
    application: 'Jesus always lives to intercede for you—you have a permanent Advocate.'
  },
  {
    id: 'sacrifices',
    type: 'Sacrificial System',
    category: 'institution',
    otReference: 'Leviticus 1-7',
    otDescription: 'Animal blood offered for sin, repeated continually',
    ntFulfillment: 'Christ\'s once-for-all sacrifice ends all need for blood offerings',
    ntReference: 'Hebrews 9:11-14; 10:11-14',
    christConnection: 'Animal sacrifices reminded of sin; Christ\'s sacrifice removes sin forever.',
    application: 'No more sacrifices needed—Christ\'s blood is sufficient for all sin, past, present, future.'
  },
  {
    id: 'jubilee',
    type: 'Year of Jubilee',
    category: 'institution',
    otReference: 'Leviticus 25:8-55',
    otDescription: '50th year, debts forgiven, slaves freed, land restored',
    ntFulfillment: 'Christ proclaims the acceptable year of the Lord',
    ntReference: 'Luke 4:18-21; Isaiah 61:1-2',
    christConnection: 'Jubilee freed from bondage; Christ brings ultimate Jubilee—freedom from sin, debt paid, inheritance restored.',
    application: 'In Christ, your spiritual debts are cancelled and your inheritance is secure.'
  },
  {
    id: 'cities-refuge',
    type: 'Cities of Refuge',
    category: 'institution',
    otReference: 'Numbers 35:9-34; Joshua 20',
    otDescription: 'Safe havens for those who killed accidentally, protected from avenger',
    ntFulfillment: 'Christ is our refuge from the wrath we deserve',
    ntReference: 'Hebrews 6:18-20',
    christConnection: 'The manslayer fled to the city; we flee to Christ for safety from judgment.',
    application: 'Run to Christ—He is the refuge where no condemnation can reach you.'
  },

  // OFFICE TYPES
  {
    id: 'prophet',
    type: 'Prophet',
    category: 'office',
    otReference: 'Deuteronomy 18:15-19',
    otDescription: 'Spoke God\'s words to the people, called for repentance',
    ntFulfillment: 'Christ is THE Prophet—God\'s final Word to humanity',
    ntReference: 'Acts 3:22-26; Hebrews 1:1-2',
    christConnection: 'Prophets spoke about God; Christ speaks AS God—the final revelation.',
    application: 'When Jesus speaks, we must listen—He is the last word.'
  },
  {
    id: 'priest-office',
    type: 'Priest',
    category: 'office',
    otReference: 'Leviticus 8-9; Hebrews 5:1-4',
    otDescription: 'Represented people before God, offered sacrifice, interceded',
    ntFulfillment: 'Christ is our eternal High Priest who intercedes forever',
    ntReference: 'Hebrews 7:24-25; 9:11-12',
    christConnection: 'Earthly priests offered animal blood; Christ offered His own blood once for all.',
    application: 'You have a Priest who sympathizes with your weakness and intercedes for you always.'
  },
  {
    id: 'king-office',
    type: 'King',
    category: 'office',
    otReference: '1 Samuel 8-10; 2 Samuel 7',
    otDescription: 'Ruled God\'s people, fought their battles, established justice',
    ntFulfillment: 'Christ is King of kings, establishes eternal kingdom',
    ntReference: 'Revelation 19:16; Matthew 2:2; Luke 1:32-33',
    christConnection: 'Human kings failed; Christ reigns forever in righteousness and justice.',
    application: 'Submit to Christ\'s kingdom—His rule brings true freedom and justice.'
  },
  {
    id: 'shepherd-office',
    type: 'Shepherd',
    category: 'office',
    otReference: 'Psalm 23; Ezekiel 34',
    otDescription: 'Led, fed, protected the flock; accountable for their welfare',
    ntFulfillment: 'Christ is the Good Shepherd who lays down His life',
    ntReference: 'John 10:11-16; Hebrews 13:20; 1 Peter 5:4',
    christConnection: 'Human shepherds scattered the flock; Christ gathers and keeps them.',
    application: 'You are known by name, led to green pastures, and protected by the Shepherd.'
  },
  {
    id: 'kinsman-redeemer',
    type: 'Kinsman-Redeemer (Goel)',
    category: 'office',
    otReference: 'Ruth 3-4; Leviticus 25:25-55',
    otDescription: 'Near relative who redeems land, avenges blood, marries widow',
    ntFulfillment: 'Christ became our kinsman to redeem us',
    ntReference: 'Hebrews 2:14-17; Galatians 4:4-5',
    christConnection: 'Christ became human (kinsman), paid the price (redeemer), and takes us as His bride.',
    application: 'Jesus became like us to redeem us—He is our near kinsman and Redeemer.'
  }
];

// Helper function to get types by category
export const getTypesByCategory = (category: BiblicalType['category']) => {
  return typesLibrary.filter(type => type.category === category);
};

// Helper function to search types
export const searchTypes = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return typesLibrary.filter(type =>
    type.type.toLowerCase().includes(lowerQuery) ||
    type.otDescription.toLowerCase().includes(lowerQuery) ||
    type.christConnection.toLowerCase().includes(lowerQuery)
  );
};

// Get a random type for study
export const getRandomType = () => {
  return typesLibrary[Math.floor(Math.random() * typesLibrary.length)];
};
