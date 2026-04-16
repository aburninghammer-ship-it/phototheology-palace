// Nature Freestyle Room Library - 100 Object Lessons from Nature
// Each entry provides a natural phenomenon with spiritual applications

export interface NatureObjectLesson {
  id: string;
  title: string;
  category: "animals" | "plants" | "weather" | "geology" | "astronomy" | "water" | "insects" | "birds" | "ecosystems" | "seasons";
  summary: string;
  biblicalParallel: string;
  biblicalReference: string;
  spiritualLesson: string;
  useCase: string;
}

export const natureFreestyleLibrary: NatureObjectLesson[] = [
  // ANIMALS (1-15)
  {
    id: "nature-001",
    title: "The Eagle's Renewal",
    category: "birds",
    summary: "Eagles go through a molting process where they shed old feathers and grow new ones, seemingly renewing their strength and appearance.",
    biblicalParallel: "Isaiah's promise of renewed strength for those who wait on the Lord",
    biblicalReference: "Isaiah 40:31",
    spiritualLesson: "Spiritual renewal comes through patient waiting on God. Like the eagle's molting, we must shed old habits and attitudes to soar higher.",
    useCase: "Teaching about spiritual renewal, patience in trials, or the transformation process"
  },
  {
    id: "nature-002",
    title: "The Ant's Diligence",
    category: "insects",
    summary: "Ants work tirelessly without supervision, storing food for winter. They can carry 50 times their body weight and work in perfect coordination.",
    biblicalParallel: "Solomon's wisdom directing the lazy to observe the ant",
    biblicalReference: "Proverbs 6:6-8",
    spiritualLesson: "Diligence and preparation require no external motivation for the wise. Self-discipline and foresight are virtues worth cultivating.",
    useCase: "Addressing laziness, teaching work ethic, or discussing preparation for future challenges"
  },
  {
    id: "nature-003",
    title: "The Lion's Authority",
    category: "animals",
    summary: "Lions are apex predators whose roar can be heard 5 miles away. They rule their territory with undisputed authority yet are protective of their pride.",
    biblicalParallel: "Christ as the Lion of Judah who conquers through authority and love",
    biblicalReference: "Revelation 5:5",
    spiritualLesson: "True authority combines strength with protective love. Christ's kingship is both powerful and tender toward His people.",
    useCase: "Teaching about Christ's dual nature, leadership principles, or spiritual authority"
  },
  {
    id: "nature-004",
    title: "The Lamb's Submission",
    category: "animals",
    summary: "Lambs are among the most docile animals, following their shepherd willingly and not resisting when led. They are completely dependent on their caretaker.",
    biblicalParallel: "Christ as the Lamb of God who submitted to sacrifice without resistance",
    biblicalReference: "Isaiah 53:7; John 1:29",
    spiritualLesson: "Meekness is not weakness but strength under control. Christ's submission to the cross was voluntary power restrained for redemptive purposes.",
    useCase: "Teaching about Christ's sacrifice, submission to God's will, or the nature of meekness"
  },
  {
    id: "nature-005",
    title: "The Salmon's Upstream Journey",
    category: "animals",
    summary: "Salmon swim thousands of miles upstream against powerful currents, leaping over waterfalls, to return to their birthplace to spawn and die.",
    biblicalParallel: "The narrow way that leads to life requires perseverance against the current",
    biblicalReference: "Matthew 7:13-14",
    spiritualLesson: "The Christian life often means swimming against cultural currents. The journey home requires sacrifice, but the destination makes it worthwhile.",
    useCase: "Encouraging perseverance, discussing countercultural Christianity, or teaching about sacrifice"
  },
  {
    id: "nature-006",
    title: "The Chameleon's Camouflage",
    category: "animals",
    summary: "Chameleons change color to blend with their environment, becoming virtually invisible to predators and prey alike.",
    biblicalParallel: "Warning against being conformed to the world's patterns",
    biblicalReference: "Romans 12:2",
    spiritualLesson: "Christians should be transformed, not camouflaged. Blending in with worldly values compromises our distinct witness and mission.",
    useCase: "Addressing compromise, worldliness, or the call to be distinct as God's people"
  },
  {
    id: "nature-007",
    title: "The Wolf in Sheep's Clothing",
    category: "animals",
    summary: "Wolves are predators that hunt in packs, using strategy and deception. In nature, some predators use mimicry to approach prey.",
    biblicalParallel: "Jesus' warning about false prophets who appear harmless but are spiritually dangerous",
    biblicalReference: "Matthew 7:15",
    spiritualLesson: "Spiritual discernment requires looking beyond appearances. False teachers may seem appealing but their fruit reveals their true nature.",
    useCase: "Teaching discernment, warning about false teaching, or discussing spiritual deception"
  },
  {
    id: "nature-008",
    title: "The Dolphin's Echolocation",
    category: "animals",
    summary: "Dolphins navigate murky waters using echolocation—sending out sounds and interpreting the echoes to 'see' their environment clearly.",
    biblicalParallel: "Walking by faith, not by sight, using God's Word as our guide",
    biblicalReference: "2 Corinthians 5:7",
    spiritualLesson: "When circumstances are unclear, we navigate by sending out prayer and receiving God's guidance through His Word and Spirit.",
    useCase: "Teaching about faith, prayer, or navigating uncertain times"
  },
  {
    id: "nature-009",
    title: "The Elephant's Memory",
    category: "animals",
    summary: "Elephants have remarkable memories, remembering water sources, friends, and threats for decades. They also mourn their dead.",
    biblicalParallel: "God's command to remember His works and pass them to future generations",
    biblicalReference: "Deuteronomy 6:6-9; Psalm 77:11",
    spiritualLesson: "Spiritual memory is essential—remembering God's faithfulness strengthens faith for present challenges and builds legacy for the next generation.",
    useCase: "Teaching about remembrance, testimony, or passing faith to children"
  },
  {
    id: "nature-010",
    title: "The Turtle's Armor",
    category: "animals",
    summary: "Turtles carry their protection with them—a shell that shields them from predators. They retreat inside when threatened.",
    biblicalParallel: "The armor of God that believers are commanded to put on daily",
    biblicalReference: "Ephesians 6:10-18",
    spiritualLesson: "God provides spiritual armor we must consciously wear. Unlike the turtle, we don't retreat but stand firm with divine protection.",
    useCase: "Teaching spiritual warfare, the armor of God, or divine protection"
  },
  {
    id: "nature-011",
    title: "The Octopus's Escape",
    category: "animals",
    summary: "Octopuses can squeeze through incredibly small spaces, escaping seemingly impossible situations. They can also release ink to confuse predators.",
    biblicalParallel: "God provides a way of escape from every temptation",
    biblicalReference: "1 Corinthians 10:13",
    spiritualLesson: "No temptation is inescapable. God always provides an exit, though it may require flexibility and leaving behind what clouds our judgment.",
    useCase: "Teaching about overcoming temptation, God's faithfulness, or spiritual flexibility"
  },
  {
    id: "nature-012",
    title: "The Peacock's Display",
    category: "birds",
    summary: "Male peacocks display elaborate, beautiful feathers to attract mates. The display is stunning but serves primarily for self-promotion.",
    biblicalParallel: "Warning against pride and vain displays that seek human approval",
    biblicalReference: "Proverbs 16:18; Matthew 6:1",
    spiritualLesson: "Beauty and gifts should glorify God, not ourselves. Displaying our spiritual 'feathers' for human approval misses the purpose of our gifts.",
    useCase: "Addressing pride, proper use of gifts, or the danger of seeking human approval"
  },
  {
    id: "nature-013",
    title: "The Spider's Web",
    category: "insects",
    summary: "Spider silk is stronger than steel by weight, yet incredibly flexible. Spiders weave intricate webs with architectural precision.",
    biblicalParallel: "The wicked's security is like a spider's web—seeming strong but ultimately fragile",
    biblicalReference: "Job 8:14; Isaiah 59:5",
    spiritualLesson: "Human schemes and self-made security appear strong but cannot withstand God's judgment. Only divine foundation endures.",
    useCase: "Warning against false security, teaching about God as true foundation, or exposing deceptive plans"
  },
  {
    id: "nature-014",
    title: "The Ox's Strength",
    category: "animals",
    summary: "Oxen are incredibly strong and were essential for agricultural work. They are patient, steady workers that can plow fields for hours.",
    biblicalParallel: "The ox knows its owner; believers should know and serve their Master",
    biblicalReference: "Isaiah 1:3; Proverbs 14:4",
    spiritualLesson: "Strength combined with patience accomplishes great work. Knowing our Master and serving steadily produces lasting fruit.",
    useCase: "Teaching about faithful service, patience in ministry, or the value of steady work"
  },
  {
    id: "nature-015",
    title: "The Deer's Thirst",
    category: "animals",
    summary: "Deer seek water sources with intense determination, especially after being chased by predators. Their survival depends on finding water.",
    biblicalParallel: "The psalmist's soul thirsting for God as a deer pants for water",
    biblicalReference: "Psalm 42:1-2",
    spiritualLesson: "Spiritual thirst should drive us to seek God with desperate intensity. Our soul's survival depends on drinking from Living Water.",
    useCase: "Teaching about spiritual hunger, seeking God, or the satisfaction found only in Christ"
  },

  // PLANTS (16-30)
  {
    id: "nature-016",
    title: "The Mustard Seed's Growth",
    category: "plants",
    summary: "The mustard seed is one of the smallest seeds, yet it grows into a large tree where birds can nest in its branches.",
    biblicalParallel: "Jesus' parable about faith starting small but growing to shelter many",
    biblicalReference: "Matthew 13:31-32; 17:20",
    spiritualLesson: "Kingdom work often starts imperceptibly small. Genuine faith, however tiny, contains explosive growth potential.",
    useCase: "Encouraging small beginnings, teaching about faith, or discussing kingdom growth"
  },
  {
    id: "nature-017",
    title: "The Vine and Branches",
    category: "plants",
    summary: "Grapevine branches only produce fruit when connected to the main vine. Severed branches wither and die within days.",
    biblicalParallel: "Jesus as the True Vine and believers as branches that must remain connected",
    biblicalReference: "John 15:1-8",
    spiritualLesson: "Spiritual fruitfulness is impossible apart from vital connection to Christ. Abiding is not optional but essential for life.",
    useCase: "Teaching about abiding in Christ, the source of spiritual life, or the danger of disconnection"
  },
  {
    id: "nature-018",
    title: "The Wheat and Tares",
    category: "plants",
    summary: "Tares (darnel) look almost identical to wheat while growing but produce poisonous seeds. They can only be distinguished at harvest.",
    biblicalParallel: "Jesus' parable about true and false believers growing together until judgment",
    biblicalReference: "Matthew 13:24-30",
    spiritualLesson: "The church contains both genuine and counterfeit believers. Final separation belongs to God at harvest time.",
    useCase: "Teaching about the mixed nature of the visible church, patience, or final judgment"
  },
  {
    id: "nature-019",
    title: "The Fig Tree's Lesson",
    category: "plants",
    summary: "Fig trees put out leaves after their fruit begins to form. A leafy fig tree without fruit is abnormal—all show with no substance.",
    biblicalParallel: "Jesus cursing the barren fig tree as a sign of fruitless religion",
    biblicalReference: "Mark 11:12-21",
    spiritualLesson: "Outward religious appearance without spiritual fruit is abhorrent to God. Leaves without figs represent hypocrisy.",
    useCase: "Warning against religious hypocrisy, teaching about genuine fruit, or Israel's spiritual condition"
  },
  {
    id: "nature-020",
    title: "The Seed's Death",
    category: "plants",
    summary: "A seed must fall into the ground and 'die'—its outer shell decomposing—before it can germinate and produce new life.",
    biblicalParallel: "Jesus' teaching that a grain of wheat must die to produce much fruit",
    biblicalReference: "John 12:24",
    spiritualLesson: "Resurrection requires death. Self-preservation prevents multiplication. Dying to self releases life in others.",
    useCase: "Teaching about sacrifice, death to self, or the principle of spiritual multiplication"
  },
  {
    id: "nature-021",
    title: "The Oak from Acorn",
    category: "plants",
    summary: "A mighty oak tree begins as a small acorn. The full-grown tree can live for centuries and support entire ecosystems.",
    biblicalParallel: "The righteous planted like trees that grow strong and provide for others",
    biblicalReference: "Psalm 1:3; Isaiah 61:3",
    spiritualLesson: "Spiritual maturity is a long process. Patient growth in righteousness eventually provides shade and sustenance for many.",
    useCase: "Teaching about spiritual maturity, patience in growth, or legacy building"
  },
  {
    id: "nature-022",
    title: "The Lily's Beauty",
    category: "plants",
    summary: "Lilies display exquisite beauty without any effort—they don't toil or spin, yet their glory surpasses Solomon's finest robes.",
    biblicalParallel: "Jesus pointing to lilies as evidence of God's care and provision",
    biblicalReference: "Matthew 6:28-30",
    spiritualLesson: "Anxious striving cannot add to what God freely provides. Trust in the Father's care releases us from worry about provision.",
    useCase: "Teaching about anxiety, God's provision, or the futility of worry"
  },
  {
    id: "nature-023",
    title: "The Thorns and Thistles",
    category: "plants",
    summary: "Thorns and thistles were part of the curse on the ground after the Fall. They grow aggressively, choking out useful plants.",
    biblicalParallel: "The curse in Eden and thorns choking the Word in the parable of the sower",
    biblicalReference: "Genesis 3:18; Matthew 13:7, 22",
    spiritualLesson: "Worldly cares and riches are thorns that choke spiritual life. The curse's effects must be actively resisted.",
    useCase: "Teaching about the Fall's effects, worldly distractions, or guarding the heart"
  },
  {
    id: "nature-024",
    title: "The Olive Tree's Endurance",
    category: "plants",
    summary: "Olive trees can live for thousands of years, surviving drought, fire, and being cut down. They regenerate from the stump repeatedly.",
    biblicalParallel: "Israel as God's olive tree with wild branches (Gentiles) grafted in",
    biblicalReference: "Romans 11:17-24",
    spiritualLesson: "God's covenant purposes endure through every trial. What appears dead can spring back to life through His faithfulness.",
    useCase: "Teaching about Israel and the church, God's faithfulness, or spiritual resilience"
  },
  {
    id: "nature-025",
    title: "The Bamboo's Hidden Growth",
    category: "plants",
    summary: "Chinese bamboo shows no visible growth for four years while developing roots underground. In year five, it grows 80 feet in six weeks.",
    biblicalParallel: "The kingdom growing secretly until sudden, visible manifestation",
    biblicalReference: "Mark 4:26-29",
    spiritualLesson: "Spiritual development often happens invisibly. Years of root-building precede explosive visible growth.",
    useCase: "Encouraging patience in unseen growth, teaching about kingdom principles, or trusting God's timing"
  },
  {
    id: "nature-026",
    title: "The Rose Among Thorns",
    category: "plants",
    summary: "Roses grow among thorns, their beauty contrasting sharply with the harsh protective thorns surrounding them.",
    biblicalParallel: "The Beloved as a lily/rose among thorns—beauty in hostile environment",
    biblicalReference: "Song of Solomon 2:2",
    spiritualLesson: "God's people display distinctive beauty precisely because they flourish in difficult environments. Thorns highlight the rose.",
    useCase: "Teaching about beauty in adversity, Christ's bride, or standing out in dark world"
  },
  {
    id: "nature-027",
    title: "The Cedar of Lebanon",
    category: "plants",
    summary: "Cedars of Lebanon were prized for their height, strength, and fragrance. They were used in Solomon's temple and symbolized majesty.",
    biblicalParallel: "The righteous flourishing like cedars, tall and strong in God's courts",
    biblicalReference: "Psalm 92:12; Ezekiel 31:3-9",
    spiritualLesson: "Spiritual stature comes from being rooted in God's presence. The righteous grow tall, providing shelter and leaving lasting legacy.",
    useCase: "Teaching about spiritual growth, God's temple, or the dangers of pride (Ezekiel's warning)"
  },
  {
    id: "nature-028",
    title: "The Pomegranate's Seeds",
    category: "plants",
    summary: "Pomegranates contain hundreds of seeds, each wrapped in sweet-tart flesh. They were embroidered on the High Priest's robe.",
    biblicalParallel: "Fruitfulness and the priestly ministry decorated with pomegranates",
    biblicalReference: "Exodus 28:33-34; Song of Solomon 4:3",
    spiritualLesson: "True ministry produces abundant seed—many lives touched, many disciples made. Inner fruitfulness should adorn our service.",
    useCase: "Teaching about fruitfulness, priestly ministry, or spiritual multiplication"
  },
  {
    id: "nature-029",
    title: "The Poison Ivy's Warning",
    category: "plants",
    summary: "Poison ivy looks harmless but causes severe allergic reactions. 'Leaves of three, let it be' is the warning for identification.",
    biblicalParallel: "Sin appearing attractive but bringing painful consequences",
    biblicalReference: "Hebrews 11:25; James 1:14-15",
    spiritualLesson: "Some things that look harmless are spiritually toxic. Learning to identify dangers prevents painful consequences.",
    useCase: "Warning about deceptive sin, teaching discernment, or discussing consequences of wrong choices"
  },
  {
    id: "nature-030",
    title: "The Sequoia's Fire Dependence",
    category: "plants",
    summary: "Giant sequoia seeds require fire to germinate. The heat opens their cones and clears competing vegetation, enabling new growth.",
    biblicalParallel: "Trials as refining fire that produces growth and new life",
    biblicalReference: "1 Peter 1:7; Malachi 3:2-3",
    spiritualLesson: "Some spiritual growth only comes through fiery trials. What seems destructive often opens seeds of new life.",
    useCase: "Teaching about purpose in suffering, refinement, or growth through difficulty"
  },

  // WEATHER (31-45)
  {
    id: "nature-031",
    title: "The Rainbow's Promise",
    category: "weather",
    summary: "Rainbows appear when sunlight refracts through water droplets after rain, creating a spectrum of colors arcing across the sky.",
    biblicalParallel: "God's covenant sign to Noah promising never to flood the earth again",
    biblicalReference: "Genesis 9:13-16",
    spiritualLesson: "God places reminders of His promises in creation itself. Even after storms, covenant faithfulness shines through.",
    useCase: "Teaching about God's covenants, faithfulness, or hope after trials"
  },
  {
    id: "nature-032",
    title: "The Storm's Calm Center",
    category: "weather",
    summary: "Hurricanes have an eye—a calm center surrounded by violent winds. Inside the eye, skies are clear and winds are light.",
    biblicalParallel: "Peace that passes understanding in life's storms when Christ is our center",
    biblicalReference: "Philippians 4:7; Mark 4:39",
    spiritualLesson: "With Christ at our center, we experience supernatural peace even when chaos swirls around us. Position determines experience.",
    useCase: "Teaching about peace in trials, Christ-centered living, or spiritual stability"
  },
  {
    id: "nature-033",
    title: "The Lightning's Power",
    category: "weather",
    summary: "Lightning bolts carry 300 million volts, instantly heating air to 30,000°C. They're unpredictable yet essential for nitrogen fixation in soil.",
    biblicalParallel: "Christ's return will be sudden and visible like lightning from east to west",
    biblicalReference: "Matthew 24:27; Luke 17:24",
    spiritualLesson: "The Second Coming will be unmistakable, instantaneous, and powerful. No one will miss it or mistake it for something else.",
    useCase: "Teaching about the Second Coming, God's power, or the certainty of Christ's return"
  },
  {
    id: "nature-034",
    title: "The Morning Dew",
    category: "weather",
    summary: "Dew forms silently overnight as moisture condenses on cool surfaces. It provides essential hydration in arid regions where rain is scarce.",
    biblicalParallel: "God's Word and blessing coming gently like dew upon grass",
    biblicalReference: "Deuteronomy 32:2; Hosea 14:5",
    spiritualLesson: "God's refreshing often comes quietly, not dramatically. Daily, gentle deposits of His Word sustain us in dry seasons.",
    useCase: "Teaching about quiet time, God's gentle provision, or spiritual refreshment"
  },
  {
    id: "nature-035",
    title: "The Flood's Destruction",
    category: "weather",
    summary: "Floods can reshape landscapes in hours, destroying everything in their path. They represent unstoppable power once unleashed.",
    biblicalParallel: "Noah's flood as judgment and the enemy coming in like a flood",
    biblicalReference: "Genesis 7; Isaiah 59:19",
    spiritualLesson: "Judgment delayed is not judgment cancelled. When God's patience ends, nothing can withstand the flood of His righteousness.",
    useCase: "Teaching about judgment, spiritual warfare, or the urgency of repentance"
  },
  {
    id: "nature-036",
    title: "The Drought's Test",
    category: "weather",
    summary: "Droughts test everything—exposing shallow roots, revealing what's truly essential, and forcing adaptation or death.",
    biblicalParallel: "Elijah's drought as divine discipline and the blessed person's drought-resistance",
    biblicalReference: "1 Kings 17-18; Jeremiah 17:8",
    spiritualLesson: "Spiritual droughts reveal root depth. Those planted by water streams remain green when others wither.",
    useCase: "Teaching about spiritual dryness, deep roots, or persevering through difficult seasons"
  },
  {
    id: "nature-037",
    title: "The Snow's Purity",
    category: "weather",
    summary: "Fresh snow blankets everything in pure white, covering dirt and imperfections. Each snowflake has a unique crystalline structure.",
    biblicalParallel: "Sins made white as snow through God's cleansing",
    biblicalReference: "Isaiah 1:18; Psalm 51:7",
    spiritualLesson: "God's forgiveness completely covers our crimson sins. His purity blankets our imperfections with spotless righteousness.",
    useCase: "Teaching about forgiveness, cleansing from sin, or God's transforming grace"
  },
  {
    id: "nature-038",
    title: "The Fog's Obscurity",
    category: "weather",
    summary: "Fog reduces visibility dramatically, making familiar paths disorienting. It forms when warm air meets cold, creating suspended water droplets.",
    biblicalParallel: "Life as a vapor/mist that appears briefly then vanishes",
    biblicalReference: "James 4:14",
    spiritualLesson: "Life's brevity should produce urgency and humility. Our plans are as temporary as morning fog burned off by the sun.",
    useCase: "Teaching about life's brevity, eternal perspective, or humble planning"
  },
  {
    id: "nature-039",
    title: "The Wind's Mystery",
    category: "weather",
    summary: "Wind is invisible yet powerful—you cannot see it, only its effects. It can be gentle breeze or devastating hurricane.",
    biblicalParallel: "The Spirit moves like wind—invisible, unpredictable, powerful",
    biblicalReference: "John 3:8; Acts 2:2",
    spiritualLesson: "The Holy Spirit's work is mysterious yet evident in effects. We cannot control Him but can position ourselves to catch His wind.",
    useCase: "Teaching about the Holy Spirit, spiritual sensitivity, or divine sovereignty"
  },
  {
    id: "nature-040",
    title: "The Thunder's Voice",
    category: "weather",
    summary: "Thunder is the sound of rapidly expanding air heated by lightning. It can be heard miles away, demanding attention.",
    biblicalParallel: "God's voice compared to thunder, commanding awe and attention",
    biblicalReference: "Job 37:4-5; Psalm 29:3",
    spiritualLesson: "When God speaks, creation responds with trembling. His voice demands the attention that thunder naturally commands.",
    useCase: "Teaching about God's voice, reverent fear, or the power of God's Word"
  },
  {
    id: "nature-041",
    title: "The Hail's Judgment",
    category: "weather",
    summary: "Hailstorms can destroy crops in minutes. Large hail causes billions in damage annually, falling with devastating force.",
    biblicalParallel: "Hail as instrument of divine judgment in Egypt and end times",
    biblicalReference: "Exodus 9:22-26; Revelation 16:21",
    spiritualLesson: "God commands all weather as instruments of blessing or judgment. Nothing in nature operates outside His sovereignty.",
    useCase: "Teaching about God's sovereignty, judgment, or divine power over creation"
  },
  {
    id: "nature-042",
    title: "The Sunset's Glory",
    category: "weather",
    summary: "Sunsets paint the sky with brilliant colors as light scatters through atmosphere. No two sunsets are exactly alike.",
    biblicalParallel: "The glory of God displayed in the heavens daily",
    biblicalReference: "Psalm 19:1; Psalm 113:3",
    spiritualLesson: "God paints a unique masterpiece every evening for anyone who will look up. His creativity and beauty are inexhaustible.",
    useCase: "Teaching about worship, God's artistry, or finding God in daily life"
  },
  {
    id: "nature-043",
    title: "The Tornado's Fury",
    category: "weather",
    summary: "Tornadoes form from rotating thunderstorms, creating violently spinning columns of air that can level buildings in seconds.",
    biblicalParallel: "God appearing in the whirlwind to Job, demonstrating sovereign power",
    biblicalReference: "Job 38:1; 2 Kings 2:11",
    spiritualLesson: "God often speaks and acts in overwhelming displays of power. Encountering His majesty silences human complaint.",
    useCase: "Teaching about God's sovereignty, humility before God, or divine power"
  },
  {
    id: "nature-044",
    title: "The Rain's Blessing",
    category: "weather",
    summary: "Rain is essential for all life, arriving in seasons to water crops. Without it, nothing grows and famine follows.",
    biblicalParallel: "God sending early and latter rain as blessing, and the Spirit poured out",
    biblicalReference: "Joel 2:23; James 5:7",
    spiritualLesson: "Spiritual rain (revival, refreshing) comes in seasons. We prepare soil and pray, trusting God for the timing of outpouring.",
    useCase: "Teaching about revival, spiritual seasons, or patient waiting for God's blessing"
  },
  {
    id: "nature-045",
    title: "The Clouds' Witness",
    category: "weather",
    summary: "Clouds carry water, provide shade, and constantly change shape. They can build into towering thunderheads or drift as wispy cirrus.",
    biblicalParallel: "The cloud of witnesses and God's glory appearing in cloud",
    biblicalReference: "Hebrews 12:1; Exodus 13:21",
    spiritualLesson: "We are surrounded by witnesses who've gone before, and God's presence guides us like the pillar of cloud guided Israel.",
    useCase: "Teaching about spiritual heritage, God's guidance, or community of faith"
  },

  // WATER (46-55)
  {
    id: "nature-046",
    title: "The River's Course",
    category: "water",
    summary: "Rivers always flow to the lowest point, carving canyons over time. They gather from many sources to form powerful flows.",
    biblicalParallel: "The river of life flowing from God's throne; rivers of living water from believers",
    biblicalReference: "Revelation 22:1; John 7:38",
    spiritualLesson: "Living water flows to the lowest, neediest places. The humble receive what the proud miss. Rivers don't flow uphill.",
    useCase: "Teaching about humility, the Holy Spirit, or life-giving ministry"
  },
  {
    id: "nature-047",
    title: "The Ocean's Depths",
    category: "water",
    summary: "Ocean depths remain largely unexplored—pressure increases, light fades, and strange creatures thrive in complete darkness.",
    biblicalParallel: "God's mercy and wisdom compared to ocean depths; sins cast into the sea",
    biblicalReference: "Micah 7:19; Romans 11:33",
    spiritualLesson: "God's attributes are unfathomably deep. His mercy can bury our sins in depths they'll never surface from.",
    useCase: "Teaching about God's forgiveness, His inscrutable wisdom, or eternal depths of His love"
  },
  {
    id: "nature-048",
    title: "The Waterfall's Power",
    category: "water",
    summary: "Waterfalls demonstrate gravity's relentless power. They can generate electricity and carve through solid rock over time.",
    biblicalParallel: "God's blessings poured out abundantly, overflowing measure",
    biblicalReference: "Malachi 3:10; Joel 2:28",
    spiritualLesson: "God doesn't give in trickles but waterfalls. His blessing, when the windows of heaven open, overwhelms our capacity.",
    useCase: "Teaching about abundance, tithing promises, or Pentecostal outpouring"
  },
  {
    id: "nature-049",
    title: "The Lake's Stillness",
    category: "water",
    summary: "Still lakes create perfect reflections, mirroring the sky and surroundings. Any disturbance ripples across the entire surface.",
    biblicalParallel: "Being still and knowing God; heart stillness reflecting His image",
    biblicalReference: "Psalm 46:10; 2 Corinthians 3:18",
    spiritualLesson: "Only in stillness do we clearly reflect God's image. Agitation distorts the reflection. Calm hearts mirror Christ.",
    useCase: "Teaching about meditation, stillness, or reflecting Christ's character"
  },
  {
    id: "nature-050",
    title: "The Wave's Persistence",
    category: "water",
    summary: "Waves constantly crash against shorelines, reshaping coastlines over time. Individual waves seem insignificant, but cumulative effect is massive.",
    biblicalParallel: "The doubter compared to waves, tossed back and forth",
    biblicalReference: "James 1:6; Ephesians 4:14",
    spiritualLesson: "Faith requires anchored stability, not wave-like fluctuation. Constant, small faithful actions reshape our spiritual landscape.",
    useCase: "Teaching about faith stability, consistency, or the danger of doubt"
  },
  {
    id: "nature-051",
    title: "The Spring's Source",
    category: "water",
    summary: "Natural springs emerge from underground aquifers, providing constant, pure water even in drought. The source is hidden but flow is reliable.",
    biblicalParallel: "God as the spring of living water; the heart as a wellspring of life",
    biblicalReference: "Jeremiah 2:13; Proverbs 4:23",
    spiritualLesson: "Deep connection to the Source produces constant, pure flow regardless of surface conditions. Guard the internal spring.",
    useCase: "Teaching about spiritual life source, guarding the heart, or abiding in Christ"
  },
  {
    id: "nature-052",
    title: "The Ice's Preservation",
    category: "water",
    summary: "Ice preserves things for millennia. Glaciers contain ancient air bubbles, and permafrost preserves specimens for thousands of years.",
    biblicalParallel: "Hearts growing cold, love freezing; or preservation through trials",
    biblicalReference: "Matthew 24:12; 2 Timothy 1:12",
    spiritualLesson: "Spiritual coldness preserves nothing good—it freezes love and relationships. Yet God preserves what we commit to Him.",
    useCase: "Warning about spiritual coldness, teaching about God's preservation, or heart condition"
  },
  {
    id: "nature-053",
    title: "The Tide's Rhythm",
    category: "water",
    summary: "Tides rise and fall predictably, governed by moon's gravity. Coastal life adapts to this reliable rhythm of high and low.",
    biblicalParallel: "Spiritual rhythms of rest and work; seasons of intensity and withdrawal",
    biblicalReference: "Ecclesiastes 3:1-8; Mark 6:31",
    spiritualLesson: "Spiritual life has rhythms—advancing and retreating, working and resting. Fighting natural rhythms leads to exhaustion.",
    useCase: "Teaching about Sabbath rest, spiritual rhythms, or ministry sustainability"
  },
  {
    id: "nature-054",
    title: "The Puddle's Evaporation",
    category: "water",
    summary: "Puddles quickly evaporate under sun, their water drawn upward to form clouds again. What seems lost enters a larger cycle.",
    biblicalParallel: "Earthly loss becoming heavenly gain; temporary giving yielding eternal returns",
    biblicalReference: "2 Corinthians 4:17-18",
    spiritualLesson: "What evaporates from our hands rises to God's. Earthly loss participates in heavenly economy we cannot yet see.",
    useCase: "Teaching about sacrifice, eternal perspective, or loss and gain"
  },
  {
    id: "nature-055",
    title: "The Well's Depth",
    category: "water",
    summary: "Deep wells access water tables unaffected by surface conditions. Digging them requires significant effort but yields reliable supply.",
    biblicalParallel: "Jacob's well where Jesus offered living water; deep spiritual digging",
    biblicalReference: "John 4:11-14; Proverbs 20:5",
    spiritualLesson: "Deep spiritual resources require digging effort. Surface spirituality dries up; deep wells access inexhaustible supply.",
    useCase: "Teaching about spiritual depth, Bible study discipline, or sustainable faith"
  },

  // ASTRONOMY (56-70)
  {
    id: "nature-056",
    title: "The Sun's Constancy",
    category: "astronomy",
    summary: "The sun rises faithfully every morning, providing light, heat, and energy for all life. It hasn't missed a day in recorded history.",
    biblicalParallel: "God's faithfulness new every morning like the sun; Christ as Sun of Righteousness",
    biblicalReference: "Lamentations 3:23; Malachi 4:2",
    spiritualLesson: "God's mercies are as reliable as sunrise. We can count on His faithfulness because He never changes.",
    useCase: "Teaching about God's faithfulness, daily mercies, or hope in dark times"
  },
  {
    id: "nature-057",
    title: "The Moon's Reflection",
    category: "astronomy",
    summary: "The moon produces no light of its own—it only reflects sunlight. Its phases show varying amounts of the sun's reflected light.",
    biblicalParallel: "Believers reflecting Christ's light in darkness; the church as moon to Christ's sun",
    biblicalReference: "Matthew 5:14-16; 2 Corinthians 3:18",
    spiritualLesson: "We have no spiritual light of our own. Our role is faithful reflection of the Son's light into dark places.",
    useCase: "Teaching about witness, reflecting Christ, or the church's role"
  },
  {
    id: "nature-058",
    title: "The Stars' Innumerability",
    category: "astronomy",
    summary: "There are more stars than grains of sand on earth—estimates suggest 200 sextillion. Each is a sun, potentially with planets.",
    biblicalParallel: "God calling stars by name; Abraham's descendants compared to stars",
    biblicalReference: "Psalm 147:4; Genesis 15:5",
    spiritualLesson: "The God who names each star knows your name. His promises are as certain and numerous as the heavens.",
    useCase: "Teaching about God's omniscience, His promises, or our significance to Him"
  },
  {
    id: "nature-059",
    title: "The Eclipse's Shadow",
    category: "astronomy",
    summary: "Solar eclipses occur when the moon passes between earth and sun, casting a shadow. Total eclipses turn day to night briefly.",
    biblicalParallel: "Darkness at the crucifixion; spiritual forces trying to block the Son's light",
    biblicalReference: "Luke 23:44-45; Amos 8:9",
    spiritualLesson: "Even when darkness seems to eclipse the Son, it's temporary and limited. Nothing can ultimately block God's light.",
    useCase: "Teaching about the crucifixion, spiritual warfare, or hope in darkness"
  },
  {
    id: "nature-060",
    title: "The Comet's Return",
    category: "astronomy",
    summary: "Comets orbit the sun in predictable cycles, returning after decades or centuries. Halley's Comet returns every 75-76 years.",
    biblicalParallel: "The certainty of Christ's return; prophecy being fulfilled in cycles",
    biblicalReference: "Acts 1:11; Hebrews 10:37",
    spiritualLesson: "Christ's return is as certain as Halley's Comet—predictable in promise though the timing seems long to us.",
    useCase: "Teaching about the Second Coming, patience in waiting, or prophetic certainty"
  },
  {
    id: "nature-061",
    title: "The Black Hole's Event Horizon",
    category: "astronomy",
    summary: "Black holes have gravity so intense that beyond the event horizon, nothing—not even light—can escape.",
    biblicalParallel: "Sin's enslaving power; the point of no return in hardening hearts",
    biblicalReference: "John 8:34; Hebrews 3:13",
    spiritualLesson: "Sin has an event horizon—a point where escape becomes impossible without divine intervention. Don't venture near the edge.",
    useCase: "Warning about sin's enslaving power, teaching about spiritual danger zones"
  },
  {
    id: "nature-062",
    title: "The Galaxy's Spiral",
    category: "astronomy",
    summary: "Spiral galaxies contain billions of stars rotating around a central core. Our Milky Way takes 230 million years to complete one rotation.",
    biblicalParallel: "All things holding together in Christ; the vastness of God's creation",
    biblicalReference: "Colossians 1:17; Isaiah 40:26",
    spiritualLesson: "The same Christ who holds galaxies together holds your life together. The scale of His power matches the scope of His care.",
    useCase: "Teaching about Christ's supremacy, God's creative power, or trusting God with our lives"
  },
  {
    id: "nature-063",
    title: "The Meteor's Blaze",
    category: "astronomy",
    summary: "Meteors burn brilliantly as they enter atmosphere, most being small rocks that completely disintegrate before reaching ground.",
    biblicalParallel: "False teachers burning out; brief lives making eternal impact",
    biblicalReference: "Jude 1:13; 2 Peter 2:17",
    spiritualLesson: "Some spiritual phenomena burn bright but briefly. Test all things—endurance reveals genuineness.",
    useCase: "Warning about false teachers, teaching about endurance, or discernment"
  },
  {
    id: "nature-064",
    title: "The Planet's Orbit",
    category: "astronomy",
    summary: "Planets orbit the sun in elliptical paths, held by gravity. They sometimes appear to move backward (retrograde) from our perspective.",
    biblicalParallel: "Our lives orbiting around the Son; times when progress seems backward",
    biblicalReference: "Colossians 1:16-17; Romans 8:28",
    spiritualLesson: "Apparent setbacks are often changes in perspective, not actual regression. Keep the Son at the center and trust the orbit.",
    useCase: "Teaching about Christ-centered living, trusting during setbacks, or perspective"
  },
  {
    id: "nature-065",
    title: "The Aurora's Dance",
    category: "astronomy",
    summary: "Northern/Southern Lights occur when solar particles interact with Earth's magnetic field, creating spectacular light displays.",
    biblicalParallel: "The glory of God displayed; heavenly worship reflected on earth",
    biblicalReference: "Psalm 19:1; Ezekiel 1:28",
    spiritualLesson: "God's glory creates spectacular displays when heavenly reality touches earthly environment. Divine encounters produce visible effects.",
    useCase: "Teaching about worship, God's glory, or heavenly encounters"
  },
  {
    id: "nature-066",
    title: "The Supernova's Death",
    category: "astronomy",
    summary: "When massive stars die, they explode as supernovae—brilliant explosions that outshine entire galaxies and create heavy elements.",
    biblicalParallel: "Death producing life; Christ's death creating new elements in God's family",
    biblicalReference: "John 12:24; Colossians 1:20",
    spiritualLesson: "The most spectacular creation often comes from death. Christ's death-explosion created elements of salvation unavailable any other way.",
    useCase: "Teaching about the cross, death producing life, or redemption"
  },
  {
    id: "nature-067",
    title: "The Constellation's Patterns",
    category: "astronomy",
    summary: "Constellations are patterns humans have traced in the stars for navigation and storytelling throughout history.",
    biblicalParallel: "God's story written in the heavens; Mazzaroth mentioned to Job",
    biblicalReference: "Job 38:32; Psalm 19:1-4",
    spiritualLesson: "God embedded His story in the stars before Scripture was written. The heavens declare His glory to every nation.",
    useCase: "Teaching about general revelation, God's creativity, or the gospel in the stars"
  },
  {
    id: "nature-068",
    title: "The Asteroid Belt's Protection",
    category: "astronomy",
    summary: "Jupiter's gravity captures many asteroids that might otherwise strike Earth, acting as a cosmic guardian for our planet.",
    biblicalParallel: "God's protection from unseen dangers; guardian angels",
    biblicalReference: "Psalm 91:11-12; Psalm 121:7-8",
    spiritualLesson: "God protects us from countless dangers we never see. His providential care operates in realms beyond our awareness.",
    useCase: "Teaching about God's protection, providence, or hidden blessings"
  },
  {
    id: "nature-069",
    title: "The Light Year's Distance",
    category: "astronomy",
    summary: "Light travels 6 trillion miles in a year. We see distant stars as they were years ago—their light traveling through time to reach us.",
    biblicalParallel: "God's eternal perspective; light from ages past reaching present",
    biblicalReference: "2 Peter 3:8; Psalm 90:4",
    spiritualLesson: "God sees across time as easily as we see across space. What reaches us today may have originated in His eternal past.",
    useCase: "Teaching about God's timelessness, eternal perspective, or patience"
  },
  {
    id: "nature-070",
    title: "The Pulsar's Beacon",
    category: "astronomy",
    summary: "Pulsars are rapidly rotating neutron stars that emit beams of radiation, appearing to pulse with lighthouse-like regularity.",
    biblicalParallel: "God's Word as a lamp and light; consistent guidance in darkness",
    biblicalReference: "Psalm 119:105; 2 Peter 1:19",
    spiritualLesson: "God provides reliable, consistent guidance through the darkness—a beacon that never fails to pulse with truth.",
    useCase: "Teaching about God's Word, guidance, or faithful direction"
  },

  // GEOLOGY (71-80)
  {
    id: "nature-071",
    title: "The Diamond's Formation",
    category: "geology",
    summary: "Diamonds form under extreme pressure and heat deep underground. Carbon atoms arrange into the hardest natural substance known.",
    biblicalParallel: "Trials producing character; pressure creating precious value",
    biblicalReference: "James 1:2-4; 1 Peter 1:7",
    spiritualLesson: "Spiritual diamonds are formed under pressure. What feels crushing is actually creating something precious and unbreakable.",
    useCase: "Teaching about trials, character development, or finding purpose in suffering"
  },
  {
    id: "nature-072",
    title: "The Earthquake's Shift",
    category: "geology",
    summary: "Earthquakes occur when tectonic plates shift, releasing built-up pressure. They can reshape landscapes in seconds.",
    biblicalParallel: "Earthquakes accompanying divine revelation and judgment",
    biblicalReference: "Matthew 27:54; Revelation 16:18",
    spiritualLesson: "God shakes what can be shaken so what cannot be shaken remains. Divine encounters often include earthshaking upheaval.",
    useCase: "Teaching about spiritual shaking, judgment, or unshakeable kingdom"
  },
  {
    id: "nature-073",
    title: "The Volcano's Eruption",
    category: "geology",
    summary: "Volcanoes build pressure until eruption becomes inevitable. They can create new land while destroying old formations.",
    biblicalParallel: "God's wrath stored up; holy passion that cannot be indefinitely contained",
    biblicalReference: "Romans 2:5; Revelation 14:10",
    spiritualLesson: "Divine patience has limits. Pressure against God's holiness will eventually erupt, creating new realities from old destruction.",
    useCase: "Teaching about God's wrath, judgment, or the danger of presuming on grace"
  },
  {
    id: "nature-074",
    title: "The Fossil's Record",
    category: "geology",
    summary: "Fossils preserve evidence of ancient life in stone, telling stories millions of years after the organism died.",
    biblicalParallel: "The written Word preserving God's acts; stones crying out",
    biblicalReference: "Luke 19:40; Joshua 4:21-24",
    spiritualLesson: "God preserves testimony in unexpected places. Even stones record His works for future generations to discover.",
    useCase: "Teaching about the reliability of Scripture, testimonies, or God's preservation"
  },
  {
    id: "nature-075",
    title: "The Canyon's Erosion",
    category: "geology",
    summary: "The Grand Canyon was carved by persistent water over time. Gentle flow accomplished what dynamite couldn't.",
    biblicalParallel: "Patient endurance accomplishing what force cannot; wearing down opposition",
    biblicalReference: "Luke 18:1-8; Galatians 6:9",
    spiritualLesson: "Persistent, gentle faithfulness accomplishes what explosive effort cannot. Time and consistency carve grand canyons.",
    useCase: "Teaching about persistence in prayer, patient endurance, or long-term faithfulness"
  },
  {
    id: "nature-076",
    title: "The Quicksand's Trap",
    category: "geology",
    summary: "Quicksand traps victims who struggle. Fighting makes sinking faster. Only stillness and slow movement lead to escape.",
    biblicalParallel: "Being still and trusting God; panic worsening spiritual situations",
    biblicalReference: "Psalm 46:10; Isaiah 30:15",
    spiritualLesson: "Panic and struggle often deepen our trouble. Stillness and trust in God's timing provide unexpected escape routes.",
    useCase: "Teaching about trust, stillness, or responding to crisis"
  },
  {
    id: "nature-077",
    title: "The Geode's Hidden Beauty",
    category: "geology",
    summary: "Geodes appear as ordinary rocks outside but contain spectacular crystal formations within, formed over thousands of years.",
    biblicalParallel: "Treasure in earthen vessels; inner beauty more valuable than outer",
    biblicalReference: "2 Corinthians 4:7; 1 Samuel 16:7",
    spiritualLesson: "Spiritual treasure is hidden in ordinary-looking vessels. God sees and develops inner crystal beauty invisible to others.",
    useCase: "Teaching about inner character, hidden value, or God's perspective"
  },
  {
    id: "nature-078",
    title: "The Mountain's Majesty",
    category: "geology",
    summary: "Mountains represent stability and permanence. They were formed by immense forces but now stand unshakeable for millennia.",
    biblicalParallel: "God's love as immovable as mountains; being built on the rock",
    biblicalReference: "Isaiah 54:10; Matthew 7:24-25",
    spiritualLesson: "What appears permanent required violent formation. Current stability was forged through past upheaval. Mountains don't move.",
    useCase: "Teaching about God's faithfulness, firm foundations, or unshakeable promises"
  },
  {
    id: "nature-079",
    title: "The Cave's Darkness",
    category: "geology",
    summary: "Caves offer complete darkness untouched by sun. They maintain constant temperature and preserve things unchanged for ages.",
    biblicalParallel: "David hiding in caves; seasons of hiddenness before emergence",
    biblicalReference: "1 Samuel 22:1; Psalm 142",
    spiritualLesson: "Cave seasons—dark, hidden, seemingly unproductive—often precede breakthrough. Caves preserve what needs protecting.",
    useCase: "Teaching about hidden seasons, preparation, or waiting on God"
  },
  {
    id: "nature-080",
    title: "The Precious Metal's Refining",
    category: "geology",
    summary: "Gold and silver must be refined by extreme heat to separate them from impurities. The refiner watches until he sees his reflection.",
    biblicalParallel: "God as refiner who purifies His people through fire",
    biblicalReference: "Malachi 3:2-3; 1 Peter 1:7",
    spiritualLesson: "God's refining fire isn't punishment but purification. He watches until our character reflects His image clearly.",
    useCase: "Teaching about trials, sanctification, or God's purposes in suffering"
  },

  // ECOSYSTEMS (81-90)
  {
    id: "nature-081",
    title: "The Symbiosis of Clownfish",
    category: "ecosystems",
    summary: "Clownfish live within stinging anemones that would kill other fish. The clownfish gains protection; the anemone gains food from the clownfish's scraps.",
    biblicalParallel: "The body of Christ where different members need each other",
    biblicalReference: "1 Corinthians 12:12-27",
    spiritualLesson: "What's deadly to some is home to others. Each member contributes uniquely to the relationship. We need each other.",
    useCase: "Teaching about church unity, spiritual gifts, or interdependence"
  },
  {
    id: "nature-082",
    title: "The Food Chain's Order",
    category: "ecosystems",
    summary: "Food chains show how energy flows through ecosystems—from sun to plants to herbivores to predators. Each level depends on those below.",
    biblicalParallel: "Spiritual authority structures; receiving and passing on what we're given",
    biblicalReference: "1 Corinthians 11:3; 2 Timothy 2:2",
    spiritualLesson: "Spiritual life flows through chains of transmission. We receive from those above and pass on to those below. Breaking the chain starves those downstream.",
    useCase: "Teaching about discipleship, authority, or spiritual mentoring"
  },
  {
    id: "nature-083",
    title: "The Coral Reef's Community",
    category: "ecosystems",
    summary: "Coral reefs support 25% of marine life while covering less than 1% of ocean floor. They're built by tiny organisms over centuries.",
    biblicalParallel: "The church as a living structure built by many small contributions",
    biblicalReference: "1 Peter 2:4-5; Ephesians 2:19-22",
    spiritualLesson: "Great spiritual structures are built by countless small, faithful contributions over time. Each living stone matters.",
    useCase: "Teaching about church building, faithful contribution, or community"
  },
  {
    id: "nature-084",
    title: "The Forest Fire's Renewal",
    category: "ecosystems",
    summary: "Forest fires, while destructive, clear dead wood and enable new growth. Some seeds only germinate after fire. Ecosystems renew through burning.",
    biblicalParallel: "Judgment that purifies and enables new growth; testing by fire",
    biblicalReference: "1 Corinthians 3:13-15; Hebrews 12:29",
    spiritualLesson: "What seems destructive often enables necessary renewal. God's fire consumes what's dead while releasing dormant life.",
    useCase: "Teaching about trials, renewal, or God's purifying work"
  },
  {
    id: "nature-085",
    title: "The Pollination Partnership",
    category: "ecosystems",
    summary: "Bees pollinate flowers while gathering nectar—a partnership where both parties benefit. Without bees, most plants couldn't reproduce.",
    biblicalParallel: "Mutual ministry where giving and receiving intertwine",
    biblicalReference: "Philippians 4:15-17; Galatians 6:6",
    spiritualLesson: "True ministry is mutual—both parties benefit. We receive while giving and give while receiving.",
    useCase: "Teaching about partnership in ministry, generosity, or mutual blessing"
  },
  {
    id: "nature-086",
    title: "The Migration's Mystery",
    category: "ecosystems",
    summary: "Birds migrate thousands of miles to the same locations yearly, guided by internal compasses and magnetic fields they cannot see.",
    biblicalParallel: "Being guided by the Spirit along unseen paths",
    biblicalReference: "Romans 8:14; Galatians 5:16-18",
    spiritualLesson: "God guides us through senses we're not always consciously aware of. Trust the internal compass the Spirit provides.",
    useCase: "Teaching about spiritual guidance, following the Spirit, or trusting God's leading"
  },
  {
    id: "nature-087",
    title: "The Decomposer's Ministry",
    category: "ecosystems",
    summary: "Fungi and bacteria break down dead matter, returning nutrients to soil. Without decomposers, death would pile up and nothing new could grow.",
    biblicalParallel: "Forgiveness breaking down offense; letting go of what's dead",
    biblicalReference: "Colossians 3:13; Ephesians 4:31-32",
    spiritualLesson: "Spiritual decomposition—letting go of dead things—releases nutrients for new growth. Holding onto dead matter prevents new life.",
    useCase: "Teaching about forgiveness, letting go, or releasing the past"
  },
  {
    id: "nature-088",
    title: "The Watershed's Boundaries",
    category: "ecosystems",
    summary: "Watersheds are areas where all water drains to a common point. The boundary is often barely visible but determines where each raindrop ultimately flows.",
    biblicalParallel: "Small choices determining ultimate destinations; heart posture affecting outcome",
    biblicalReference: "Matthew 7:13-14; Proverbs 4:23",
    spiritualLesson: "Life's watershed moments often seem insignificant. Tiny shifts in position determine whether we flow toward life or death.",
    useCase: "Teaching about decision-making, heart posture, or the significance of small choices"
  },
  {
    id: "nature-089",
    title: "The Predator-Prey Balance",
    category: "ecosystems",
    summary: "Predators keep prey populations healthy by removing weak members. Without predators, prey overpopulate and ecosystems collapse.",
    biblicalParallel: "Spiritual testing that strengthens; adversity producing health",
    biblicalReference: "1 Peter 5:8-10; James 1:2-4",
    spiritualLesson: "Spiritual 'predators' (challenges, opposition) can actually strengthen the body. What threatens can also train.",
    useCase: "Teaching about spiritual warfare, the purpose of trials, or healthy spiritual ecosystems"
  },
  {
    id: "nature-090",
    title: "The Rainforest Canopy",
    category: "ecosystems",
    summary: "Rainforest canopies are so dense that little light reaches the floor. Each layer of the forest supports different life forms.",
    biblicalParallel: "Spiritual maturity creating shelter for those still growing; levels of growth",
    biblicalReference: "1 Corinthians 3:1-2; Hebrews 5:12-14",
    spiritualLesson: "Mature believers create canopy that shelters younger ones. Different levels of spiritual growth serve different purposes.",
    useCase: "Teaching about spiritual maturity, mentoring, or church ecology"
  },

  // SEASONS (91-100)
  {
    id: "nature-091",
    title: "The Spring's Awakening",
    category: "seasons",
    summary: "Spring brings warmth after winter, triggering dormant seeds to sprout and animals to emerge. It's a season of resurrection and new beginnings.",
    biblicalParallel: "Resurrection life; new beginnings after spiritual winter",
    biblicalReference: "Song of Solomon 2:11-12; Romans 6:4",
    spiritualLesson: "After every spiritual winter comes spring. Dormant things awaken. What seemed dead was only sleeping.",
    useCase: "Teaching about resurrection, new seasons, or hope after difficulty"
  },
  {
    id: "nature-092",
    title: "The Summer's Abundance",
    category: "seasons",
    summary: "Summer brings long days and growth. Plants reach full size, fruit ripens, and life flourishes in warm abundance.",
    biblicalParallel: "Seasons of spiritual flourishing and abundant harvest",
    biblicalReference: "John 10:10; Psalm 92:14",
    spiritualLesson: "Spiritual summer seasons bring abundant growth and fruit. Maximize these times—winter comes again.",
    useCase: "Teaching about spiritual seasons, fruitfulness, or maximizing opportunities"
  },
  {
    id: "nature-093",
    title: "The Autumn's Release",
    category: "seasons",
    summary: "Autumn means letting go—leaves fall, plants go to seed, animals prepare for winter. It's a season of release and preparation.",
    biblicalParallel: "Letting go of what was; preparing for transition; harvest time",
    biblicalReference: "Ecclesiastes 3:1-8; Galatians 6:7-9",
    spiritualLesson: "Spiritual maturity includes knowing when to release. Holding autumn leaves prevents spring buds.",
    useCase: "Teaching about letting go, transitions, or harvest"
  },
  {
    id: "nature-094",
    title: "The Winter's Rest",
    category: "seasons",
    summary: "Winter brings dormancy—growth stops visibly, but roots deepen underground. Rest is essential for next season's growth.",
    biblicalParallel: "Seasons of hidden growth; rest that prepares for future fruitfulness",
    biblicalReference: "Mark 4:26-27; Psalm 23:2",
    spiritualLesson: "Spiritual winters serve purposes invisible on surface. Deep root work happens when nothing seems to be growing.",
    useCase: "Teaching about spiritual dry seasons, rest, or hidden growth"
  },
  {
    id: "nature-095",
    title: "The Solstice's Turning",
    category: "seasons",
    summary: "Solstices mark when days stop getting longer or shorter and begin reversing. The longest night is followed by lengthening days.",
    biblicalParallel: "Turning points in God's timing; dawn coming after darkest night",
    biblicalReference: "Psalm 30:5; Isaiah 21:11-12",
    spiritualLesson: "The darkest point is also the turning point. When night seems longest, light has already begun its return.",
    useCase: "Teaching about hope in darkness, God's timing, or spiritual turning points"
  },
  {
    id: "nature-096",
    title: "The Equinox's Balance",
    category: "seasons",
    summary: "Equinoxes are moments of balance—day and night equal length. They mark transitions between seasons.",
    biblicalParallel: "Balance in spiritual life; transitional seasons",
    biblicalReference: "Ecclesiastes 7:18; Philippians 4:12",
    spiritualLesson: "Spiritual balance is real but often transitional. We move through equilibrium toward new seasons.",
    useCase: "Teaching about balance, transitions, or contentment in all circumstances"
  },
  {
    id: "nature-097",
    title: "The Harvest's Timing",
    category: "seasons",
    summary: "Harvest must happen at the right time—too early yields immature fruit, too late loses the crop. Timing is everything in harvest.",
    biblicalParallel: "The fields white for harvest; not growing weary in doing good",
    biblicalReference: "John 4:35; Galatians 6:9",
    spiritualLesson: "Spiritual harvest requires readiness to act at the right moment. Missed timing means missed opportunity.",
    useCase: "Teaching about evangelism, discernment of timing, or spiritual urgency"
  },
  {
    id: "nature-098",
    title: "The Perennial's Return",
    category: "seasons",
    summary: "Perennial plants return year after year from the same root system. They die back but their root endures, producing new growth each spring.",
    biblicalParallel: "Enduring faith that produces fresh fruit in every season",
    biblicalReference: "Jeremiah 17:7-8; Psalm 1:3",
    spiritualLesson: "Rooted faith may appear to die back but always returns with fresh life. The root system outlasts visible growth.",
    useCase: "Teaching about perseverance, rooted faith, or cyclical growth"
  },
  {
    id: "nature-099",
    title: "The Cicada's Cycle",
    category: "seasons",
    summary: "Certain cicadas emerge only every 13 or 17 years, living underground before a brief season above ground to reproduce and die.",
    biblicalParallel: "Long hidden seasons of preparation; emerging at God's appointed time",
    biblicalReference: "Galatians 4:4; Ecclesiastes 3:11",
    spiritualLesson: "Some callings require years of hidden preparation. Emergence happens on God's mysterious timing, not ours.",
    useCase: "Teaching about long preparation, God's timing, or hidden seasons"
  },
  {
    id: "nature-100",
    title: "The Phoenix Constellation",
    category: "seasons",
    summary: "The Phoenix constellation symbolizes the mythical bird that dies in flames and rises renewed. Though myth, it captures nature's pattern of death and renewal.",
    biblicalParallel: "The resurrection pattern throughout creation—death preceding life",
    biblicalReference: "1 Corinthians 15:35-44; Romans 6:5",
    spiritualLesson: "Creation itself groans with resurrection hope. The pattern of death-to-life is written throughout nature, pointing to the ultimate resurrection.",
    useCase: "Teaching about resurrection hope, the gospel in nature, or new creation"
  }
];

// Helper functions for using the library
export const getLessonsByCategory = (category: NatureObjectLesson["category"]): NatureObjectLesson[] => {
  return natureFreestyleLibrary.filter(lesson => lesson.category === category);
};

export const searchLessons = (query: string): NatureObjectLesson[] => {
  const lowerQuery = query.toLowerCase();
  return natureFreestyleLibrary.filter(lesson =>
    lesson.title.toLowerCase().includes(lowerQuery) ||
    lesson.summary.toLowerCase().includes(lowerQuery) ||
    lesson.spiritualLesson.toLowerCase().includes(lowerQuery) ||
    lesson.biblicalParallel.toLowerCase().includes(lowerQuery)
  );
};

export const getRandomLesson = (): NatureObjectLesson => {
  const randomIndex = Math.floor(Math.random() * natureFreestyleLibrary.length);
  return natureFreestyleLibrary[randomIndex];
};

export const getLessonsByBibleReference = (bookName: string): NatureObjectLesson[] => {
  const lowerBookName = bookName.toLowerCase();
  return natureFreestyleLibrary.filter(lesson =>
    lesson.biblicalReference.toLowerCase().includes(lowerBookName)
  );
};

export const getAllCategories = (): NatureObjectLesson["category"][] => {
  return ["animals", "plants", "weather", "geology", "astronomy", "water", "insects", "birds", "ecosystems", "seasons"];
};
