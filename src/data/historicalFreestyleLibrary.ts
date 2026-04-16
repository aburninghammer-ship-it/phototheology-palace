// Historical Freestyle Library - 100 Historical Events with Spiritual Applications
// For the History/Social Freestyle Room (HF) in the Phototheology Palace

export interface HistoricalEvent {
  id: string;
  title: string;
  year: string;
  category: "ancient" | "medieval" | "early-modern" | "modern" | "contemporary";
  region: string;
  summary: string;
  biblicalParallel: string;
  biblicalReference: string;
  spiritualLesson: string;
  useCase: string;
}

export const historicalFreestyleLibrary: HistoricalEvent[] = [
  // ============================================
  // ANCIENT HISTORY (Before 500 AD)
  // ============================================
  {
    id: "hf-001",
    title: "Fall of the Roman Empire",
    year: "476 AD",
    category: "ancient",
    region: "Europe",
    summary: "The Western Roman Empire collapsed after centuries of internal decay, economic troubles, and external invasions by Germanic tribes.",
    biblicalParallel: "Babylon's fall in Revelation 18; 'Pride goes before destruction' (Proverbs 16:18)",
    biblicalReference: "Revelation 18:2-8; Proverbs 16:18",
    spiritualLesson: "Empires built on human pride and moral corruption inevitably collapse. No earthly kingdom is permanent because only God's kingdom is eternal.",
    useCase: "Sermon on the temporary nature of worldly power vs. eternal kingdom"
  },
  {
    id: "hf-002",
    title: "Construction of the Great Pyramid of Giza",
    year: "c. 2560 BC",
    category: "ancient",
    region: "Egypt",
    summary: "Pharaoh Khufu commissioned the largest pyramid, employing thousands of workers for decades to build his eternal monument.",
    biblicalParallel: "Tower of Babel (Genesis 11:1-9); human attempts to achieve immortality through works",
    biblicalReference: "Genesis 11:1-9; Ecclesiastes 2:4-11",
    spiritualLesson: "Humanity's grandest monuments to self eventually become tourist attractions and tombs. True immortality comes only through Christ, not human achievement.",
    useCase: "Discussion on the futility of self-salvation and works-based righteousness"
  },
  {
    id: "hf-003",
    title: "Alexander the Great's Conquests",
    year: "336-323 BC",
    category: "ancient",
    region: "Mediterranean/Asia",
    summary: "Alexander conquered the known world by age 30, creating the largest empire in ancient history, then died at 32 without an heir.",
    biblicalParallel: "The 'goat' of Daniel 8; vanity of earthly glory (Ecclesiastes)",
    biblicalReference: "Daniel 8:5-8, 21-22; Ecclesiastes 2:18-19",
    spiritualLesson: "Conquering the world means nothing if you lose your soul. Alexander's empire fragmented immediately upon his death - what we build without God cannot outlast us.",
    useCase: "Youth message on ambition, success, and eternal priorities"
  },
  {
    id: "hf-004",
    title: "Spartacus Slave Revolt",
    year: "73-71 BC",
    category: "ancient",
    region: "Roman Republic",
    summary: "Gladiator Spartacus led 120,000 escaped slaves in rebellion against Rome, seeking freedom from brutal oppression.",
    biblicalParallel: "Exodus liberation; Jesus setting captives free (Luke 4:18)",
    biblicalReference: "Exodus 3:7-10; Luke 4:18-19; Galatians 5:1",
    spiritualLesson: "The human cry for freedom reflects our deeper spiritual bondage. Only Christ can truly liberate us from the slavery of sin that no rebellion can break.",
    useCase: "Message on spiritual freedom vs. political/physical liberation"
  },
  {
    id: "hf-005",
    title: "Destruction of Pompeii",
    year: "79 AD",
    category: "ancient",
    region: "Roman Empire",
    summary: "Mount Vesuvius erupted suddenly, burying the prosperous city of Pompeii in volcanic ash, preserving its decadence for millennia.",
    biblicalParallel: "Sodom and Gomorrah (Genesis 19); unexpected judgment",
    biblicalReference: "Genesis 19:24-25; Luke 17:28-30; 2 Peter 3:10",
    spiritualLesson: "Life's ordinary pleasures can blind us to impending judgment. Pompeii's citizens were eating, drinking, and conducting business when destruction came 'like a thief.'",
    useCase: "Sermon on readiness and the sudden nature of Christ's return"
  },

  // ============================================
  // MEDIEVAL HISTORY (500-1500 AD)
  // ============================================
  {
    id: "hf-006",
    title: "The Black Death",
    year: "1347-1351",
    category: "medieval",
    region: "Europe/Asia",
    summary: "Bubonic plague killed 75-200 million people (30-60% of Europe's population), transforming society, economy, and religious practice.",
    biblicalParallel: "Plagues of Egypt; pale horse of Revelation 6",
    biblicalReference: "Revelation 6:7-8; Matthew 24:7",
    spiritualLesson: "Pestilence reminds humanity of mortality and judgment. The plague prompted both spiritual awakening and bitter apostasy - suffering either softens or hardens the heart.",
    useCase: "Discussion on suffering, mortality, and spiritual response to crisis"
  },
  {
    id: "hf-007",
    title: "The Crusades",
    year: "1095-1291",
    category: "medieval",
    region: "Europe/Middle East",
    summary: "Religious wars fought to reclaim the Holy Land, mixing genuine faith with political ambition, violence, and corruption.",
    biblicalParallel: "Jesus rejecting earthly kingdom (John 18:36); warning against carnal weapons",
    biblicalReference: "John 18:36; 2 Corinthians 10:4; Matthew 26:52",
    spiritualLesson: "The kingdom of God never advances by sword. When the church weds political power and military force, it betrays its mission and creates enemies of the gospel.",
    useCase: "Apologetics discussion on violence done 'in Christ's name'"
  },
  {
    id: "hf-008",
    title: "The Magna Carta",
    year: "1215",
    category: "medieval",
    region: "England",
    summary: "English nobles forced King John to sign a charter limiting royal power and establishing that even kings are under law.",
    biblicalParallel: "God's law binding all people equally; no partiality (Romans 2:11)",
    biblicalReference: "Deuteronomy 17:18-20; Romans 2:11; Acts 10:34",
    spiritualLesson: "Biblical principles of justice and limited authority shaped Western law. All human authority is accountable to a higher law - ultimately God's.",
    useCase: "Civics/apologetics on biblical foundations of Western legal concepts"
  },
  {
    id: "hf-009",
    title: "Fall of Constantinople",
    year: "1453",
    category: "medieval",
    region: "Byzantine Empire",
    summary: "Ottoman Turks conquered the Christian capital of the Eastern Roman Empire, ending 1,000 years of Byzantine civilization.",
    biblicalParallel: "Jerusalem's destruction (Luke 21); lampstand removed (Revelation 2:5)",
    biblicalReference: "Luke 21:20-24; Revelation 2:5",
    spiritualLesson: "Christian civilizations are not guaranteed permanence. When churches compromise with power and lose first love, God removes the lampstand.",
    useCase: "Church history lesson on the rise and fall of Christian cultures"
  },
  {
    id: "hf-010",
    title: "Gutenberg's Printing Press",
    year: "c. 1440",
    category: "medieval",
    region: "Germany",
    summary: "Johannes Gutenberg invented movable type printing, making books affordable and sparking an information revolution.",
    biblicalParallel: "God's Word spreading (Isaiah 55:11); 'My people perish for lack of knowledge'",
    biblicalReference: "Isaiah 55:10-11; Hosea 4:6; Acts 6:7",
    spiritualLesson: "God prepared technology to spread His Word. The printing press made the Reformation possible by putting Scripture in common hands - God's timing is precise.",
    useCase: "Discussion on providence and technology serving gospel purposes"
  },

  // ============================================
  // EARLY MODERN (1500-1800)
  // ============================================
  {
    id: "hf-011",
    title: "Protestant Reformation",
    year: "1517",
    category: "early-modern",
    region: "Europe",
    summary: "Martin Luther's 95 Theses sparked a movement recovering salvation by grace through faith, breaking Rome's religious monopoly.",
    biblicalParallel: "Elijah on Mount Carmel; calling people back to true worship",
    biblicalReference: "Romans 1:17; Galatians 2:16; 1 Kings 18:21",
    spiritualLesson: "God raises reformers when the church obscures the gospel. The recovery of 'sola fide' (faith alone) was not innovation but restoration of biblical truth.",
    useCase: "Reformation Day sermon on justification by faith"
  },
  {
    id: "hf-012",
    title: "Transatlantic Slave Trade",
    year: "1500s-1800s",
    category: "early-modern",
    region: "Africa/Americas",
    summary: "12-15 million Africans were forcibly transported to the Americas in one of history's greatest crimes against humanity.",
    biblicalParallel: "Israel's bondage in Egypt; 'man-stealers' condemned (1 Tim 1:10)",
    biblicalReference: "Exodus 1:11-14; 1 Timothy 1:10; Galatians 3:28",
    spiritualLesson: "Slavery contradicts the imago Dei - every human bears God's image. The church's complicity shows how economic interest can corrupt biblical interpretation.",
    useCase: "Racial reconciliation discussion; warning against proof-texting for injustice"
  },
  {
    id: "hf-013",
    title: "American Revolution",
    year: "1775-1783",
    category: "early-modern",
    region: "North America",
    summary: "American colonists declared independence from Britain, establishing a republic based on Enlightenment principles and religious freedom.",
    biblicalParallel: "Exodus liberation; 'where the Spirit of the Lord is, there is freedom'",
    biblicalReference: "2 Corinthians 3:17; Galatians 5:1; 1 Peter 2:16",
    spiritualLesson: "Religious freedom allowed the gospel to flourish without state control. Yet earthly liberty must not be confused with spiritual liberation that only Christ provides.",
    useCase: "July 4th message balancing patriotism with eternal kingdom priorities"
  },
  {
    id: "hf-014",
    title: "French Revolution",
    year: "1789-1799",
    category: "early-modern",
    region: "France",
    summary: "Revolution overthrew the monarchy, then descended into the Reign of Terror, atheistic worship of 'Reason,' and mass executions.",
    biblicalParallel: "Revelation 11 (witnesses killed); 'professing to be wise, they became fools'",
    biblicalReference: "Revelation 11:7-10; Romans 1:21-22; Psalm 14:1",
    spiritualLesson: "Revolution without God leads to new tyrannies. When society rejects divine authority, human reason becomes a cruel idol demanding blood sacrifice.",
    useCase: "Apologetics on secular utopian movements and their outcomes"
  },
  {
    id: "hf-015",
    title: "The Great Awakening",
    year: "1730s-1740s",
    category: "early-modern",
    region: "British Colonies (America)",
    summary: "Revivalists like Whitefield and Edwards sparked mass conversions, emotional preaching, and transformed colonial religious life.",
    biblicalParallel: "Pentecost (Acts 2); latter rain outpouring",
    biblicalReference: "Acts 2:17-18; Joel 2:28-29; Zechariah 10:1",
    spiritualLesson: "God sends seasons of refreshing when His people pray and preach with power. Revival transforms not just individuals but entire societies.",
    useCase: "Prayer meeting emphasis on seeking spiritual awakening"
  },

  // ============================================
  // MODERN ERA (1800-1950)
  // ============================================
  {
    id: "hf-016",
    title: "Abolition of British Slave Trade",
    year: "1807",
    category: "modern",
    region: "British Empire",
    summary: "William Wilberforce's decades-long campaign ended British participation in the slave trade, followed by emancipation in 1833.",
    biblicalParallel: "Moses confronting Pharaoh; prophetic witness against injustice",
    biblicalReference: "Isaiah 58:6; Micah 6:8; Proverbs 31:8-9",
    spiritualLesson: "Gospel transformation produces social reform. Wilberforce's evangelical faith compelled him to fight injustice - true conversion bears fruit in justice and mercy.",
    useCase: "Social justice rooted in gospel motivation"
  },
  {
    id: "hf-017",
    title: "Irish Potato Famine",
    year: "1845-1852",
    category: "modern",
    region: "Ireland",
    summary: "Potato blight caused mass starvation, killing 1 million and forcing 2 million to emigrate while British policy worsened the crisis.",
    biblicalParallel: "Joseph's famine (Genesis 41); God's provision in scarcity",
    biblicalReference: "Genesis 41:53-57; Psalm 37:19; Matthew 6:31-33",
    spiritualLesson: "Human policies can turn natural disaster into genocide. Yet God preserved a remnant who carried faith to new lands, multiplying what seemed destroyed.",
    useCase: "Providence in suffering; diaspora spreading faith"
  },
  {
    id: "hf-018",
    title: "American Civil War",
    year: "1861-1865",
    category: "modern",
    region: "United States",
    summary: "The bloodiest American conflict ended slavery but cost 620,000 lives, with both sides claiming God's blessing.",
    biblicalParallel: "Nation divided (Matthew 12:25); judgment on injustice",
    biblicalReference: "Matthew 12:25; Amos 5:21-24; Galatians 6:7",
    spiritualLesson: "National sins eventually demand blood. Lincoln recognized the war as divine judgment on slavery - 'the judgments of the Lord are true and righteous altogether.'",
    useCase: "Message on corporate sin and national reckoning"
  },
  {
    id: "hf-019",
    title: "Sinking of the Titanic",
    year: "1912",
    category: "modern",
    region: "Atlantic Ocean",
    summary: "The 'unsinkable' luxury liner struck an iceberg on its maiden voyage, killing 1,500 passengers in icy waters.",
    biblicalParallel: "Pride before destruction; Babel's hubris",
    biblicalReference: "Proverbs 16:18; James 4:13-16; Luke 12:19-20",
    spiritualLesson: "Human technological pride meets divine reality. Many wealthy passengers went from champagne toasts to freezing death in hours - wealth cannot save.",
    useCase: "Evangelistic message on the uncertainty of life and need for salvation"
  },
  {
    id: "hf-020",
    title: "World War I",
    year: "1914-1918",
    category: "modern",
    region: "Global",
    summary: "The 'Great War' killed 20 million, destroyed empires, and shattered Europe's optimistic belief in human progress.",
    biblicalParallel: "Wars and rumors of wars (Matthew 24:6); first seal of Revelation",
    biblicalReference: "Matthew 24:6-7; Revelation 6:1-4; James 4:1-2",
    spiritualLesson: "WWI exposed the myth of inevitable human progress. Christian nations slaughtered each other using advanced technology - education and culture cannot cure the human heart.",
    useCase: "Apologetics on human nature and the failure of secular optimism"
  },
  {
    id: "hf-021",
    title: "Russian Revolution",
    year: "1917",
    category: "modern",
    region: "Russia",
    summary: "Bolsheviks overthrew the Tsar, established communist rule, and launched decades of atheistic persecution killing millions.",
    biblicalParallel: "Beast making war on saints; atheistic last-day powers",
    biblicalReference: "Revelation 13:7; Daniel 7:25; Psalm 2:1-3",
    spiritualLesson: "Atheistic regimes inevitably persecute believers because they cannot tolerate any authority above the state. Yet the church survived and even grew under persecution.",
    useCase: "Persecuted church awareness; faith under hostile governments"
  },
  {
    id: "hf-022",
    title: "The Great Depression",
    year: "1929-1939",
    category: "modern",
    region: "Global",
    summary: "Stock market crash triggered global economic collapse, mass unemployment, poverty, and despair affecting billions.",
    biblicalParallel: "Rich fool's sudden loss (Luke 12); trusting in uncertain riches",
    biblicalReference: "Luke 12:16-21; 1 Timothy 6:17; James 5:1-3",
    spiritualLesson: "Economic security is an illusion. Fortunes vanished overnight, teaching that 'a man's life does not consist in the abundance of his possessions.'",
    useCase: "Stewardship message on eternal investments vs. earthly treasure"
  },
  {
    id: "hf-023",
    title: "The Holocaust",
    year: "1941-1945",
    category: "modern",
    region: "Europe",
    summary: "Nazi Germany systematically murdered 6 million Jews and millions of others in history's most organized genocide.",
    biblicalParallel: "Haman's plot (Esther); satanic hatred of God's covenant people",
    biblicalReference: "Esther 3:6; John 8:44; Revelation 12:13",
    spiritualLesson: "Anti-Semitism has spiritual roots - Satan's ancient war against the people through whom Messiah came. Silence in the face of evil is complicity.",
    useCase: "Holocaust remembrance; standing against persecution"
  },
  {
    id: "hf-024",
    title: "D-Day Invasion",
    year: "June 6, 1944",
    category: "modern",
    region: "France",
    summary: "Allied forces landed at Normandy in the largest amphibious invasion in history, beginning the liberation of Europe from Nazi rule.",
    biblicalParallel: "Joshua crossing Jordan; divine timing for deliverance",
    biblicalReference: "Joshua 3:14-17; Ecclesiastes 3:1; Isaiah 60:22",
    spiritualLesson: "Sometimes deliverance requires great sacrifice. Young men stormed beaches knowing many would die - a dim reflection of Christ storming death's gates for us.",
    useCase: "Memorial Day/Veterans Day message on sacrifice"
  },
  {
    id: "hf-025",
    title: "Atomic Bombing of Hiroshima and Nagasaki",
    year: "August 1945",
    category: "modern",
    region: "Japan",
    summary: "Two atomic bombs killed 200,000+ instantly, ushering in the nuclear age and ending World War II.",
    biblicalParallel: "Fire from heaven (Revelation 13:13); end-time destruction potential",
    biblicalReference: "2 Peter 3:10-12; Revelation 8:7; Matthew 24:22",
    spiritualLesson: "Humanity now possesses the power of apocalyptic destruction. 'Unless those days were shortened, no flesh would be saved' - only Christ's return prevents extinction.",
    useCase: "Eschatology discussion on humanity's capacity for self-destruction"
  },

  // ============================================
  // CONTEMPORARY (1950-Present)
  // ============================================
  {
    id: "hf-026",
    title: "Creation of Israel",
    year: "1948",
    category: "contemporary",
    region: "Middle East",
    summary: "After 2,000 years of diaspora and the Holocaust, the modern State of Israel was established in the ancient homeland.",
    biblicalParallel: "Dry bones coming to life (Ezekiel 37); return from exile",
    biblicalReference: "Ezekiel 37:1-14; Isaiah 11:11-12; Amos 9:14-15",
    spiritualLesson: "God's covenant faithfulness spans millennia. Whatever one's eschatological view, Israel's restoration demonstrates that God keeps His promises to generations.",
    useCase: "Prophecy discussion; God's faithfulness to covenant"
  },
  {
    id: "hf-027",
    title: "Civil Rights Movement",
    year: "1954-1968",
    category: "contemporary",
    region: "United States",
    summary: "Led by MLK Jr. and others, African Americans fought for equal rights through nonviolent protest, changing American law and society.",
    biblicalParallel: "Jubilee year (Leviticus 25); Jesus proclaiming liberty (Luke 4:18)",
    biblicalReference: "Leviticus 25:10; Luke 4:18-19; Galatians 3:28",
    spiritualLesson: "King's movement was deeply biblical - he preached liberation, redemptive suffering, and beloved community. Justice movements divorced from faith lose moral foundation.",
    useCase: "MLK Day message on biblical justice; redemptive suffering"
  },
  {
    id: "hf-028",
    title: "Apollo 11 Moon Landing",
    year: "1969",
    category: "contemporary",
    region: "Space",
    summary: "Neil Armstrong became the first human to walk on the moon, fulfilling President Kennedy's challenge and demonstrating human capability.",
    biblicalParallel: "God setting humans 'over the works of His hands' (Psalm 8)",
    biblicalReference: "Psalm 8:3-6; Genesis 1:28; Psalm 19:1",
    spiritualLesson: "Space exploration reveals God's glory, not human autonomy. The heavens declare His handiwork - the more we explore, the more we should worship the Creator.",
    useCase: "Science and faith discussion; dominion mandate"
  },
  {
    id: "hf-029",
    title: "Apollo 13 Crisis",
    year: "1970",
    category: "contemporary",
    region: "Space",
    summary: "An oxygen tank explosion crippled the spacecraft, but NASA engineers and astronauts worked miracles to bring the crew home safely.",
    biblicalParallel: "Paul's shipwreck and miraculous survival (Acts 27)",
    biblicalReference: "Acts 27:22-25; Psalm 107:23-31; Isaiah 43:2",
    spiritualLesson: "In impossible situations, human ingenuity combined with prayer produces deliverance. The nation prayed, and against all odds, the crew survived.",
    useCase: "Prayer testimony; God working through human effort"
  },
  {
    id: "hf-030",
    title: "Fall of the Berlin Wall",
    year: "1989",
    category: "contemporary",
    region: "Germany",
    summary: "The wall dividing communist East and free West Berlin fell peacefully, symbolizing communism's collapse and the end of the Cold War.",
    biblicalParallel: "Walls of Jericho falling (Joshua 6); 'the truth shall set you free'",
    biblicalReference: "Joshua 6:20; John 8:32; Isaiah 45:1-2",
    spiritualLesson: "Prayer and faithfulness outlasted totalitarian power. East German Christians' Monday prayer meetings contributed to peaceful revolution - God tears down walls.",
    useCase: "Prayer's power against impossible odds"
  },
  {
    id: "hf-031",
    title: "September 11 Attacks",
    year: "2001",
    category: "contemporary",
    region: "United States",
    summary: "Terrorists flew planes into the World Trade Center and Pentagon, killing 3,000 and transforming American security and foreign policy.",
    biblicalParallel: "Tower of Siloam falling (Luke 13:4); wake-up call to repentance",
    biblicalReference: "Luke 13:4-5; Psalm 46:1-2; 2 Chronicles 7:14",
    spiritualLesson: "Jesus warned against assuming victims were worse sinners. Tragedy calls everyone to repentance - 'unless you repent, you will all likewise perish.'",
    useCase: "Memorial message; tragedy and the call to repentance"
  },
  {
    id: "hf-032",
    title: "Indian Ocean Tsunami",
    year: "2004",
    category: "contemporary",
    region: "Southeast Asia",
    summary: "A massive earthquake triggered tsunamis killing 230,000 people across 14 countries in minutes on the day after Christmas.",
    biblicalParallel: "Noah's flood; 'sea and waves roaring' (Luke 21:25)",
    biblicalReference: "Genesis 7:11; Luke 21:25-26; Matthew 7:24-27",
    spiritualLesson: "Natural disasters remind us of nature's power and human fragility. Building on sand - whether literal coastline or spiritual foundation - invites destruction.",
    useCase: "Disaster response; building life on solid foundation"
  },
  {
    id: "hf-033",
    title: "Global Financial Crisis",
    year: "2008",
    category: "contemporary",
    region: "Global",
    summary: "Housing bubble collapse triggered worldwide banking crisis, recession, and the largest economic intervention in history.",
    biblicalParallel: "House built on sand collapses (Matthew 7); Babel economics",
    biblicalReference: "Matthew 7:26-27; Proverbs 22:7; 1 Timothy 6:9-10",
    spiritualLesson: "Financial systems built on debt and greed eventually collapse. 'The borrower is slave to the lender' - biblical wisdom proves true generation after generation.",
    useCase: "Stewardship; biblical principles of economics"
  },
  {
    id: "hf-034",
    title: "Arab Spring",
    year: "2010-2012",
    category: "contemporary",
    region: "Middle East/North Africa",
    summary: "Protests toppled dictators across the Arab world, raising hopes for democracy that largely gave way to new conflicts.",
    biblicalParallel: "Israel demanding a king (1 Samuel 8); political messiahs fail",
    biblicalReference: "1 Samuel 8:5-18; Psalm 146:3; Jeremiah 17:5",
    spiritualLesson: "Political revolution cannot transform human hearts. New governments inherit the same fallen nature - only gospel transformation produces lasting change.",
    useCase: "Politics and the gospel; limits of political solutions"
  },
  {
    id: "hf-035",
    title: "COVID-19 Pandemic",
    year: "2020-2023",
    category: "contemporary",
    region: "Global",
    summary: "A novel coronavirus spread globally, killing millions, shutting economies, and transforming daily life worldwide.",
    biblicalParallel: "Plagues as signs (Luke 21:11); God getting the world's attention",
    biblicalReference: "Luke 21:11; 2 Chronicles 7:13-14; Revelation 16:9",
    spiritualLesson: "Global pestilence is a prophetic sign. Lockdowns forced the world to stop and consider mortality - an invitation to repentance that many refused.",
    useCase: "Post-pandemic reflection; mortality and eternal life"
  },
  {
    id: "hf-036",
    title: "George Floyd and Racial Justice Movement",
    year: "2020",
    category: "contemporary",
    region: "United States/Global",
    summary: "Floyd's death sparked global protests against racial injustice and police brutality, reigniting conversations about systemic racism.",
    biblicalParallel: "Abel's blood crying from the ground (Genesis 4:10); demanding justice",
    biblicalReference: "Genesis 4:10; Amos 5:24; Micah 6:8",
    spiritualLesson: "Injustice cries out to God. The church must both proclaim individual salvation and work for justice - the gospel addresses both sin and its social consequences.",
    useCase: "Racial reconciliation; church's role in justice"
  },
  {
    id: "hf-037",
    title: "Russia-Ukraine War",
    year: "2022-present",
    category: "contemporary",
    region: "Eastern Europe",
    summary: "Russia invaded Ukraine, triggering Europe's largest conflict since WWII, displacing millions and raising nuclear tensions.",
    biblicalParallel: "Wars and rumors of wars (Matthew 24:6); 'nation against nation'",
    biblicalReference: "Matthew 24:6-7; Ezekiel 38-39; Luke 21:9",
    spiritualLesson: "War in a nuclear age carries apocalyptic potential. Christians should pray for peace while understanding that ultimate peace comes only with Christ's return.",
    useCase: "Geopolitical events and prophecy; praying for peace"
  },
  {
    id: "hf-038",
    title: "Artificial Intelligence Revolution",
    year: "2022-present",
    category: "contemporary",
    region: "Global",
    summary: "AI systems like ChatGPT demonstrated unprecedented capabilities, raising questions about human identity, work, and ethics.",
    biblicalParallel: "Tower of Babel (Genesis 11); 'nothing will be impossible for them'",
    biblicalReference: "Genesis 11:6; Daniel 12:4; Revelation 13:15",
    spiritualLesson: "Technology amplifies human capability for good or evil. AI reflects our image-bearing creativity but cannot replicate the soul - only God breathes life.",
    useCase: "Technology ethics; what makes humans unique"
  },

  // ============================================
  // ADDITIONAL ANCIENT/CLASSICAL EVENTS
  // ============================================
  {
    id: "hf-039",
    title: "Peloponnesian War",
    year: "431-404 BC",
    category: "ancient",
    region: "Greece",
    summary: "Athens and Sparta fought for Greek dominance, devastating both powers and ending the golden age of classical Greece.",
    biblicalParallel: "Civil strife in Israel; a house divided cannot stand",
    biblicalReference: "Matthew 12:25; Judges 20; Galatians 5:15",
    spiritualLesson: "Internal division destroys what external enemies cannot. When brothers war against brothers, everyone loses - unity in Christ is precious.",
    useCase: "Church unity message; dangers of internal conflict"
  },
  {
    id: "hf-040",
    title: "Assassination of Julius Caesar",
    year: "44 BC",
    category: "ancient",
    region: "Roman Republic",
    summary: "Roman senators murdered Caesar on the Ides of March, triggering civil war and the end of the Roman Republic.",
    biblicalParallel: "Betrayal by trusted associates; Judas and Jesus",
    biblicalReference: "Matthew 26:14-16; Psalm 41:9; Proverbs 27:6",
    spiritualLesson: "Betrayal by friends wounds deepest. Caesar's 'Et tu, Brute?' echoes our Lord's question to Judas - those closest can hurt us most.",
    useCase: "Message on betrayal, forgiveness, and trust"
  },
  {
    id: "hf-041",
    title: "Burning of Rome under Nero",
    year: "64 AD",
    category: "ancient",
    region: "Roman Empire",
    summary: "A great fire destroyed much of Rome; Nero blamed Christians, launching the first official persecution including Peter and Paul's martyrdoms.",
    biblicalParallel: "Fiery trials (1 Peter 4:12); persecution as normal",
    biblicalReference: "1 Peter 4:12-14; John 16:2; Acts 14:22",
    spiritualLesson: "The church was born in persecution and thrived under it. Scapegoating believers is Satan's ancient tactic - but 'the blood of martyrs is the seed of the church.'",
    useCase: "Persecuted church; cost of discipleship"
  },
  {
    id: "hf-042",
    title: "Destruction of Jerusalem",
    year: "70 AD",
    category: "ancient",
    region: "Judea",
    summary: "Roman armies destroyed Jerusalem and the Temple, fulfilling Jesus' prophecy and ending the Old Covenant sacrificial system.",
    biblicalParallel: "Jesus' prophecy fulfilled (Matthew 24:2); 'not one stone left'",
    biblicalReference: "Matthew 24:1-2; Luke 21:20-24; Daniel 9:26",
    spiritualLesson: "Jesus' words proved literally true within one generation. Prophetic accuracy validates Scripture - God's warnings must be heeded before judgment falls.",
    useCase: "Apologetics on fulfilled prophecy; heeding warnings"
  },
  {
    id: "hf-043",
    title: "Vesuvius Eruption and Pliny's Account",
    year: "79 AD",
    category: "ancient",
    region: "Roman Empire",
    summary: "Pliny the Younger documented the Vesuvius eruption that killed his uncle, providing history's first detailed volcano account.",
    biblicalParallel: "Witnesses testifying to God's power in nature",
    biblicalReference: "Psalm 97:5; Nahum 1:5; Hebrews 12:29",
    spiritualLesson: "Nature's fury testifies to God's greater power. Mountains melt at His presence - if we fear volcanoes, how much more the consuming fire of God's holiness.",
    useCase: "God's power in nature; holy fear"
  },
  {
    id: "hf-044",
    title: "Constantine's Conversion",
    year: "312 AD",
    category: "ancient",
    region: "Roman Empire",
    summary: "Emperor Constantine claimed a vision of the cross before battle, then legalized Christianity, transforming church-state relations forever.",
    biblicalParallel: "Mixed blessing; church gaining world but risking soul (Mark 8:36)",
    biblicalReference: "Mark 8:36; John 18:36; 2 Corinthians 6:14",
    spiritualLesson: "Imperial favor brought both opportunity and corruption. When the church weds political power, she gains influence but risks compromising her prophetic witness.",
    useCase: "Church-state relations; cost of cultural acceptance"
  },
  {
    id: "hf-045",
    title: "Attila the Hun's Invasions",
    year: "434-453 AD",
    category: "ancient",
    region: "Europe",
    summary: "The 'Scourge of God' terrorized the Roman Empire, yet spared Rome itself after meeting Pope Leo I.",
    biblicalParallel: "God using pagan nations for judgment (Isaiah 10:5-7)",
    biblicalReference: "Isaiah 10:5-7; Habakkuk 1:6; Jeremiah 27:6",
    spiritualLesson: "God uses even godless conquerors as instruments of judgment. Rome's moral collapse invited invasion - national sin invites national consequences.",
    useCase: "Divine judgment through history; national morality"
  },

  // ============================================
  // ADDITIONAL MEDIEVAL EVENTS
  // ============================================
  {
    id: "hf-046",
    title: "Viking Raids and Lindisfarne",
    year: "793 AD",
    category: "medieval",
    region: "Europe",
    summary: "Vikings attacked Lindisfarne monastery, beginning centuries of raids that terrorized Christian Europe.",
    biblicalParallel: "Enemies attacking God's people (Psalm 83); testing of faith",
    biblicalReference: "Psalm 83:1-4; 1 Peter 1:6-7; James 1:2-4",
    spiritualLesson: "Persecution tests and purifies faith. Many Viking descendants became Christians - God transforms enemies into worshippers across generations.",
    useCase: "Long-term perspective on enemies; perseverance"
  },
  {
    id: "hf-047",
    title: "Charlemagne's Coronation",
    year: "800 AD",
    category: "medieval",
    region: "Europe",
    summary: "Pope Leo III crowned Charlemagne 'Emperor of the Romans,' establishing the precedent of papal authority over kings.",
    biblicalParallel: "Two kingdoms confused; render unto Caesar (Matthew 22:21)",
    biblicalReference: "Matthew 22:21; John 18:36; Revelation 13:1-2",
    spiritualLesson: "Blending spiritual and political authority leads to corruption of both. Christ's kingdom is not of this world - the church must not wield the sword.",
    useCase: "Church-state separation; dangers of religious political power"
  },
  {
    id: "hf-048",
    title: "The Great Schism",
    year: "1054 AD",
    category: "medieval",
    region: "Christendom",
    summary: "Eastern Orthodox and Roman Catholic churches formally split over theological and political disputes, dividing Christianity.",
    biblicalParallel: "Division in the body (1 Corinthians 12:25); Jesus' prayer for unity (John 17)",
    biblicalReference: "John 17:20-21; 1 Corinthians 1:10-13; Ephesians 4:3",
    spiritualLesson: "Church division grieves Christ who prayed 'that they may be one.' Pride, politics, and power divided what should have remained united in essentials.",
    useCase: "Ecumenical reflection; unity in Christ"
  },
  {
    id: "hf-049",
    title: "Genghis Khan's Empire",
    year: "1206-1368",
    category: "medieval",
    region: "Asia/Europe",
    summary: "Mongol conquests created history's largest contiguous empire, killing tens of millions while inadvertently opening the Silk Road.",
    biblicalParallel: "First seal horseman (Revelation 6:2); conquest spreading",
    biblicalReference: "Revelation 6:2; Habakkuk 1:6-11; Daniel 7:23",
    spiritualLesson: "Conquest and trade routes spread both terror and truth. Missionaries followed Mongol roads - God uses even violent history to advance His purposes.",
    useCase: "Providence in dark times; gospel advance through unlikely means"
  },
  {
    id: "hf-050",
    title: "Joan of Arc's Mission",
    year: "1429-1431",
    category: "medieval",
    region: "France",
    summary: "A teenage peasant girl claimed divine visions, led French armies to victory, then was burned as a heretic by church authorities.",
    biblicalParallel: "Deborah leading Israel; religious leaders rejecting prophets",
    biblicalReference: "Judges 4:4-9; Matthew 23:29-31; John 9:34",
    spiritualLesson: "God uses unlikely vessels while religious establishments often oppose genuine faith. Those who burn 'heretics' may themselves be rejecting God.",
    useCase: "God using the weak; danger of religious institutionalism"
  },

  // ============================================
  // ADDITIONAL EARLY MODERN EVENTS
  // ============================================
  {
    id: "hf-051",
    title: "Columbus Reaches the Americas",
    year: "1492",
    category: "early-modern",
    region: "Americas",
    summary: "Christopher Columbus's voyage initiated European colonization of the Americas, with devastating consequences for indigenous peoples.",
    biblicalParallel: "Gospel going to new lands (Acts 1:8); mixed with human sin",
    biblicalReference: "Acts 1:8; Matthew 28:19-20; James 4:1-2",
    spiritualLesson: "The Great Commission has often been entangled with greed and conquest. God's command to spread the gospel does not justify exploitation - motive matters.",
    useCase: "Missions history; separating gospel from colonialism"
  },
  {
    id: "hf-052",
    title: "Diet of Worms",
    year: "1521",
    category: "early-modern",
    region: "Germany",
    summary: "Martin Luther refused to recant before Emperor Charles V: 'Here I stand, I can do no other. God help me. Amen.'",
    biblicalParallel: "Shadrach, Meshach, Abednego before Nebuchadnezzar; standing alone",
    biblicalReference: "Daniel 3:16-18; Acts 4:19-20; Matthew 10:32-33",
    spiritualLesson: "Conscience bound by Scripture cannot submit to human authority against God. One man standing for truth can change history.",
    useCase: "Courage under pressure; conscience and conviction"
  },
  {
    id: "hf-053",
    title: "St. Bartholomew's Day Massacre",
    year: "1572",
    category: "early-modern",
    region: "France",
    summary: "Catholic mobs murdered thousands of French Protestants in Paris, spreading violence that killed up to 30,000 Huguenots.",
    biblicalParallel: "Blood of martyrs; persecution of the remnant",
    biblicalReference: "Revelation 17:6; Matthew 23:35; Hebrews 11:36-38",
    spiritualLesson: "Religious violence betrays the gospel. Those who kill in Christ's name serve another master - persecution cannot destroy true faith but condemns persecutors.",
    useCase: "Religious tolerance; true vs. false Christianity"
  },
  {
    id: "hf-054",
    title: "Mayflower Pilgrims",
    year: "1620",
    category: "early-modern",
    region: "North America",
    summary: "Separatist Puritans fled religious persecution, crossing the Atlantic to establish a colony based on their covenant faith.",
    biblicalParallel: "Abraham leaving home for promised land; pilgrims and strangers",
    biblicalReference: "Hebrews 11:13-16; Genesis 12:1; 1 Peter 2:11",
    spiritualLesson: "Faith sometimes requires leaving everything familiar. The Pilgrims sought religious freedom, not wealth - their covenant theology shaped American ideals.",
    useCase: "Thanksgiving reflection; faith and freedom"
  },
  {
    id: "hf-055",
    title: "Salem Witch Trials",
    year: "1692",
    category: "early-modern",
    region: "Colonial America",
    summary: "Mass hysteria led to execution of 20 people accused of witchcraft in Puritan Massachusetts.",
    biblicalParallel: "False accusation; mob justice condemned",
    biblicalReference: "Exodus 23:1-2; Proverbs 18:17; Matthew 7:1-2",
    spiritualLesson: "Fear and religious zeal without wisdom produce injustice. The 'godly' community became guilty of murder through false witness - good intentions don't justify evil methods.",
    useCase: "Warning against religious hysteria; justice and due process"
  },
  {
    id: "hf-056",
    title: "Scientific Revolution",
    year: "1543-1700s",
    category: "early-modern",
    region: "Europe",
    summary: "Copernicus, Galileo, Newton and others transformed understanding of nature through systematic observation and mathematics.",
    biblicalParallel: "Discovering God's creation (Psalm 19:1); dominion over nature",
    biblicalReference: "Psalm 19:1-4; Proverbs 25:2; Romans 1:20",
    spiritualLesson: "Most pioneers of modern science were believers studying God's creation. Science and faith conflict only when either exceeds its proper domain.",
    useCase: "Science and faith harmony; God's two books"
  },
  {
    id: "hf-057",
    title: "John Wesley's Aldersgate Experience",
    year: "1738",
    category: "early-modern",
    region: "England",
    summary: "Wesley felt his heart 'strangely warmed' while hearing Luther's preface to Romans, launching the Methodist revival.",
    biblicalParallel: "Hearts burning on Emmaus road (Luke 24:32); Spirit's work",
    biblicalReference: "Luke 24:32; Romans 8:16; Acts 2:37",
    spiritualLesson: "Intellectual faith must become heart faith. Wesley had theology but needed personal encounter - assurance comes when the Spirit witnesses with our spirit.",
    useCase: "Testimony emphasis; heart religion vs. head knowledge"
  },
  {
    id: "hf-058",
    title: "Haitian Revolution",
    year: "1791-1804",
    category: "early-modern",
    region: "Caribbean",
    summary: "Enslaved Africans overthrew French colonial rule in history's only successful slave revolution, creating Haiti.",
    biblicalParallel: "Exodus liberation; God hearing the cry of the oppressed",
    biblicalReference: "Exodus 3:7-9; Psalm 72:4; Luke 1:52",
    spiritualLesson: "God hears the cry of the oppressed. The Haitian revolution, beginning with a prayer meeting, showed that 'He has scattered the proud and lifted up the humble.'",
    useCase: "Liberation theology grounded in Scripture; prayer and action"
  },
  {
    id: "hf-059",
    title: "Waterloo and Napoleon's Fall",
    year: "1815",
    category: "early-modern",
    region: "Europe",
    summary: "Napoleon's final defeat ended his empire and two decades of war that had reshaped Europe.",
    biblicalParallel: "Pride before destruction; 'how the mighty have fallen'",
    biblicalReference: "Proverbs 16:18; 2 Samuel 1:19; Daniel 4:30-32",
    spiritualLesson: "Ambition that aims for world conquest ends in exile. Napoleon crowned himself emperor but died a prisoner - self-exaltation leads to humiliation.",
    useCase: "Leadership humility; dangers of unchecked ambition"
  },

  // ============================================
  // ADDITIONAL MODERN ERA EVENTS
  // ============================================
  {
    id: "hf-060",
    title: "The Underground Railroad",
    year: "1800s",
    category: "modern",
    region: "United States",
    summary: "A secret network helped thousands of enslaved people escape to freedom, often led by people of deep faith like Harriet Tubman.",
    biblicalParallel: "Rahab hiding spies; civil disobedience for righteousness",
    biblicalReference: "Joshua 2:1-16; Acts 5:29; Hebrews 11:31",
    spiritualLesson: "Sometimes obeying God requires disobeying unjust human laws. Tubman called herself Moses - faith compelled believers to risk everything for freedom.",
    useCase: "Civil disobedience; practical faith and justice"
  },
  {
    id: "hf-061",
    title: "Charles Darwin's Origin of Species",
    year: "1859",
    category: "modern",
    region: "England",
    summary: "Darwin published his theory of evolution by natural selection, challenging traditional views of human origins.",
    biblicalParallel: "'In the beginning God created' (Genesis 1:1); Creator vs. chance",
    biblicalReference: "Genesis 1:1, 27; Psalm 100:3; Colossians 1:16",
    spiritualLesson: "Origins matter because they determine meaning and morality. If we're accidents, there's no inherent purpose; if created, we're accountable to our Maker.",
    useCase: "Apologetics on origins; worldview implications"
  },
  {
    id: "hf-062",
    title: "Opening of Japan",
    year: "1853-1854",
    category: "modern",
    region: "Japan",
    summary: "Commodore Perry forced Japan to end 200 years of isolation, eventually leading to Christian missionary access.",
    biblicalParallel: "'Other sheep I have' (John 10:16); nations opened to gospel",
    biblicalReference: "John 10:16; Isaiah 42:4; Revelation 5:9",
    spiritualLesson: "God opens doors no one can shut. Japan's hidden Christians emerged after centuries of persecution - God preserved a remnant through impossible times.",
    useCase: "Missions; God's global purposes"
  },
  {
    id: "hf-063",
    title: "Indian Removal Act / Trail of Tears",
    year: "1830-1850",
    category: "modern",
    region: "United States",
    summary: "The U.S. government forcibly relocated Native American nations, causing thousands of deaths on forced marches.",
    biblicalParallel: "Israel's treatment of foreigners judged; injustice against the weak",
    biblicalReference: "Ezekiel 22:29; Proverbs 22:22-23; Amos 2:6-7",
    spiritualLesson: "National sins have generational consequences. The church's failure to oppose injustice compromised its witness - silence is complicity.",
    useCase: "National repentance; historical injustice acknowledgment"
  },
  {
    id: "hf-064",
    title: "Florence Nightingale and Modern Nursing",
    year: "1854-1860s",
    category: "modern",
    region: "England/Crimea",
    summary: "Nightingale transformed military nursing during the Crimean War, establishing nursing as a respected profession.",
    biblicalParallel: "Good Samaritan; 'I was sick and you visited me'",
    biblicalReference: "Luke 10:33-35; Matthew 25:36; James 2:15-16",
    spiritualLesson: "Nightingale's faith drove her medical mission - she believed nursing was a divine calling. Compassion in action demonstrates Christ's love concretely.",
    useCase: "Faith and vocation; healthcare as ministry"
  },
  {
    id: "hf-065",
    title: "Boxer Rebellion",
    year: "1900",
    category: "modern",
    region: "China",
    summary: "Chinese nationalists attacked foreigners and Chinese Christians, martyring thousands of believers and missionaries.",
    biblicalParallel: "Persecution of the early church; 'they will kill you thinking they serve God'",
    biblicalReference: "John 16:2; Revelation 6:9-11; 2 Timothy 3:12",
    spiritualLesson: "The Chinese church was watered with martyrs' blood. Those who died singing hymns planted seeds that today produce the world's fastest-growing church.",
    useCase: "Persecuted church; long-term fruit of martyrdom"
  },
  {
    id: "hf-066",
    title: "Women's Suffrage Movement",
    year: "1848-1920",
    category: "modern",
    region: "United States/UK",
    summary: "Women fought for and won voting rights, with many leaders motivated by evangelical faith and abolitionist connections.",
    biblicalParallel: "Deborah leading Israel; Galatians 3:28 'neither male nor female'",
    biblicalReference: "Galatians 3:28; Judges 4:4; Joel 2:28-29",
    spiritualLesson: "Many suffragists were evangelical Christians seeing voting rights as consistent with biblical human dignity. Gospel implications often drive social change.",
    useCase: "Faith and social reform; image of God in all people"
  },
  {
    id: "hf-067",
    title: "Azusa Street Revival",
    year: "1906",
    category: "modern",
    region: "United States",
    summary: "A multiracial Pentecostal revival in Los Angeles launched a movement now numbering over 600 million globally.",
    biblicalParallel: "Pentecost's latter rain; 'your sons and daughters shall prophesy'",
    biblicalReference: "Acts 2:17-18; Joel 2:28-29; Zechariah 4:6",
    spiritualLesson: "God poured out His Spirit through a one-eyed Black pastor to humble the proud. Azusa's interracial worship scandalized segregated America - the Spirit breaks barriers.",
    useCase: "Revival history; Holy Spirit's work; racial reconciliation"
  },
  {
    id: "hf-068",
    title: "Armenian Genocide",
    year: "1915-1923",
    category: "modern",
    region: "Ottoman Empire",
    summary: "The Ottoman government systematically killed 1.5 million Armenians, targeting one of the world's oldest Christian communities.",
    biblicalParallel: "Martyrs under the altar (Revelation 6:9); ancient hatred of believers",
    biblicalReference: "Revelation 6:9-10; Matthew 24:9; John 15:18-20",
    spiritualLesson: "Ancient Christian communities can face genocide. The world's silence during the Armenian genocide emboldened later perpetrators - we must not be silent.",
    useCase: "Persecuted church; remembrance and advocacy"
  },
  {
    id: "hf-069",
    title: "Spanish Flu Pandemic",
    year: "1918-1920",
    category: "modern",
    region: "Global",
    summary: "The deadliest pandemic in modern history killed 50-100 million people, more than World War I's combat deaths.",
    biblicalParallel: "Pestilence as prophetic sign (Luke 21:11); death's indiscriminate power",
    biblicalReference: "Luke 21:11; Hebrews 9:27; James 4:14",
    spiritualLesson: "Pandemic reminded a war-weary world of mortality. Death comes for young and old, rich and poor - 'it is appointed unto man once to die, then judgment.'",
    useCase: "Evangelistic appeal; mortality and preparation"
  },
  {
    id: "hf-070",
    title: "Scopes Trial",
    year: "1925",
    category: "modern",
    region: "United States",
    summary: "A Tennessee teacher was tried for teaching evolution, in a case that became a cultural flashpoint between faith and science.",
    biblicalParallel: "Elijah vs. prophets of Baal; competing worldviews clash",
    biblicalReference: "1 Kings 18:21; Colossians 2:8; 1 Peter 3:15",
    spiritualLesson: "The trial showed culture shifting against biblical authority. Christians must engage intellectually, not just emotionally - 'always be ready to give a reason.'",
    useCase: "Apologetics; engaging culture thoughtfully"
  },
  {
    id: "hf-071",
    title: "Kristallnacht",
    year: "1938",
    category: "modern",
    region: "Nazi Germany",
    summary: "Nazi-organized mobs attacked Jewish homes, businesses, and synagogues in the 'Night of Broken Glass,' foreshadowing the Holocaust.",
    biblicalParallel: "Pharaoh's persecution of Israel; 'they afflicted them with hard labor'",
    biblicalReference: "Exodus 1:11-14; Psalm 83:1-4; Matthew 24:9",
    spiritualLesson: "Silence in the face of growing evil enables genocide. Few German churches protested - the failure to act when cost was low enabled horrors when cost became total.",
    useCase: "Speaking up for the vulnerable; moral courage"
  },
  {
    id: "hf-072",
    title: "Pearl Harbor Attack",
    year: "1941",
    category: "modern",
    region: "Pacific",
    summary: "Japan's surprise attack killed 2,400 Americans and drew the United States into World War II.",
    biblicalParallel: "'Watch and pray' (Mark 13:33); unexpected attack",
    biblicalReference: "Mark 13:33-37; 1 Thessalonians 5:2-4; Matthew 24:42",
    spiritualLesson: "Pearl Harbor's tragedy came partly from ignored warnings. Christ warns His church to watch and be ready - spiritual complacency invites disaster.",
    useCase: "Spiritual alertness; heeding warnings"
  },
  {
    id: "hf-073",
    title: "UN Declaration of Human Rights",
    year: "1948",
    category: "modern",
    region: "Global",
    summary: "After World War II's horrors, nations adopted universal human rights principles, many derived from Christian natural law tradition.",
    biblicalParallel: "Imago Dei - human dignity from creation (Genesis 1:27)",
    biblicalReference: "Genesis 1:27; James 3:9; Proverbs 31:8-9",
    spiritualLesson: "Human rights without God become arbitrary. The Declaration drew on Christian concepts but tried to universalize them without their theological foundation.",
    useCase: "Christian foundations of human rights; image of God"
  },

  // ============================================
  // ADDITIONAL CONTEMPORARY EVENTS
  // ============================================
  {
    id: "hf-074",
    title: "Korean War",
    year: "1950-1953",
    category: "contemporary",
    region: "Korea",
    summary: "War divided Korea, with brutal persecution of Christians in the North and explosive church growth in the South.",
    biblicalParallel: "Division bringing persecution and growth simultaneously",
    biblicalReference: "Acts 8:1-4; Philippians 1:12-14; 2 Timothy 3:12",
    spiritualLesson: "Persecution scattered but didn't destroy the church. North Korea's underground believers and South Korea's megachurches both witness to resilient faith.",
    useCase: "Persecuted church; gospel advance through suffering"
  },
  {
    id: "hf-075",
    title: "Montgomery Bus Boycott",
    year: "1955-1956",
    category: "contemporary",
    region: "United States",
    summary: "Rosa Parks' arrest sparked a 381-day boycott that desegregated city buses and launched MLK's national leadership.",
    biblicalParallel: "Esther's courageous stand; 'for such a time as this'",
    biblicalReference: "Esther 4:14; Micah 6:8; James 2:1-9",
    spiritualLesson: "One person's courage can spark a movement. Parks and King combined prayer, dignity, and nonviolent resistance rooted in Christian conviction.",
    useCase: "Courage; individual action sparking change"
  },
  {
    id: "hf-076",
    title: "Hungarian Revolution",
    year: "1956",
    category: "contemporary",
    region: "Hungary",
    summary: "Hungarians rose against Soviet control, briefly achieving freedom before brutal suppression killed thousands.",
    biblicalParallel: "Israel's failed rebellions; hope deferred",
    biblicalReference: "Proverbs 13:12; Lamentations 3:21-26; Romans 8:24-25",
    spiritualLesson: "Not all righteous causes succeed immediately. Hungarian believers maintained faith through decades more of oppression until 1989's liberation came.",
    useCase: "Perseverance; hope deferred but not destroyed"
  },
  {
    id: "hf-077",
    title: "Cuban Missile Crisis",
    year: "1962",
    category: "contemporary",
    region: "Cuba/USA/USSR",
    summary: "The world stood at the brink of nuclear war for 13 days before Soviet missiles were withdrawn from Cuba.",
    biblicalParallel: "'Unless those days were shortened' (Matthew 24:22); near-extinction",
    biblicalReference: "Matthew 24:22; Psalm 46:1-3; Proverbs 21:1",
    spiritualLesson: "Humanity came within hours of nuclear holocaust. God's restraining hand preserves the world for the sake of His purposes - until He says 'enough.'",
    useCase: "Providence; nuclear age and eschatology"
  },
  {
    id: "hf-078",
    title: "Assassination of JFK",
    year: "1963",
    category: "contemporary",
    region: "United States",
    summary: "President Kennedy's murder shocked the nation and the world, ending an era of American optimism.",
    biblicalParallel: "Uncertainty of life; leaders are mortal",
    biblicalReference: "Psalm 146:3-4; James 4:14; Proverbs 27:1",
    spiritualLesson: "No human leader is permanent or ultimate. Kennedy's assassination reminded a nation not to put trust in princes - only Christ's kingdom is secure.",
    useCase: "Not trusting in human leaders; life's uncertainty"
  },
  {
    id: "hf-079",
    title: "Cultural Revolution (China)",
    year: "1966-1976",
    category: "contemporary",
    region: "China",
    summary: "Mao's campaign destroyed temples, churches, and traditional culture while persecuting millions, including believers.",
    biblicalParallel: "Nebuchadnezzar demanding worship; Daniel in lion's den",
    biblicalReference: "Daniel 6:10; Revelation 13:15-17; Acts 5:29",
    spiritualLesson: "The church in China survived by going underground. House churches grew secretly, so that today Chinese Christians outnumber Communist Party members.",
    useCase: "Persecuted church; underground faith"
  },
  {
    id: "hf-080",
    title: "Prague Spring Crushed",
    year: "1968",
    category: "contemporary",
    region: "Czechoslovakia",
    summary: "Soviet tanks crushed Czechoslovakia's attempt at 'socialism with a human face,' extinguishing hopes for reform.",
    biblicalParallel: "Israel under Assyria/Babylon; occupation and waiting",
    biblicalReference: "Habakkuk 1:2-4; Psalm 44:23-26; Lamentations 3:25-26",
    spiritualLesson: "Freedom movements don't always succeed when expected. Czech believers waited 21 more years - God's timing is not our timing, but He is faithful.",
    useCase: "Patience under oppression; God's timing"
  },
  {
    id: "hf-081",
    title: "Roe v. Wade Decision",
    year: "1973",
    category: "contemporary",
    region: "United States",
    summary: "The Supreme Court legalized abortion nationwide, sparking decades of moral and political conflict.",
    biblicalParallel: "Child sacrifice to Molech; 'hands that shed innocent blood'",
    biblicalReference: "Psalm 139:13-16; Proverbs 6:16-17; Jeremiah 32:35",
    spiritualLesson: "Legal does not mean moral. The church must speak for those who cannot speak for themselves while extending grace to all caught in sin's web.",
    useCase: "Pro-life ethic; balancing truth and compassion"
  },
  {
    id: "hf-082",
    title: "Vietnamese Boat People",
    year: "1975-1990s",
    category: "contemporary",
    region: "Southeast Asia",
    summary: "Over a million Vietnamese fled communism by boat, with many dying at sea but survivors building new lives.",
    biblicalParallel: "Refugees fleeing persecution; 'strangers and aliens'",
    biblicalReference: "Hebrews 11:13-16; Matthew 25:35; Deuteronomy 10:18-19",
    spiritualLesson: "The church welcomed refugees, and many became vibrant Christians in diaspora. Displacement often produces spiritual harvest.",
    useCase: "Refugee ministry; church welcoming strangers"
  },
  {
    id: "hf-083",
    title: "Camp David Accords",
    year: "1978",
    category: "contemporary",
    region: "Middle East",
    summary: "Egypt and Israel signed a peace treaty brokered by President Carter, showing enemies can become allies.",
    biblicalParallel: "Wall of partition broken down (Ephesians 2:14); reconciliation",
    biblicalReference: "Ephesians 2:14-16; Matthew 5:9; Romans 12:18",
    spiritualLesson: "Ancient enemies made peace through painstaking negotiation. Blessed are the peacemakers - but lasting peace requires changed hearts, not just treaties.",
    useCase: "Peacemaking; political vs. spiritual reconciliation"
  },
  {
    id: "hf-084",
    title: "Iranian Revolution",
    year: "1979",
    category: "contemporary",
    region: "Iran",
    summary: "Islamic revolution overthrew the Shah, establishing theocratic rule and beginning decades of tension with the West.",
    biblicalParallel: "False religion gaining political power; end-time religious deception",
    biblicalReference: "Matthew 24:24; 2 Thessalonians 2:3-4; Revelation 13:11-14",
    spiritualLesson: "Religious revolution doesn't guarantee godliness. Iran shows that enforced religion produces hypocrisy and oppression - God wants willing hearts, not coerced obedience.",
    useCase: "Theocracy critique; voluntary faith"
  },
  {
    id: "hf-085",
    title: "Chernobyl Nuclear Disaster",
    year: "1986",
    category: "contemporary",
    region: "Soviet Union",
    summary: "The worst nuclear accident contaminated vast areas, displaced populations, and accelerated Soviet collapse.",
    biblicalParallel: "Wormwood (Revelation 8:10-11); environmental judgment",
    biblicalReference: "Revelation 8:10-11; Romans 8:22; Genesis 3:17-18",
    spiritualLesson: "Interestingly, 'Chernobyl' means 'wormwood' in Ukrainian. Creation groans under human mismanagement - we are stewards, not owners, of the earth.",
    useCase: "Environmental stewardship; creation care"
  },
  {
    id: "hf-086",
    title: "Tiananmen Square Massacre",
    year: "1989",
    category: "contemporary",
    region: "China",
    summary: "The Chinese government killed hundreds or thousands of pro-democracy protesters, crushing the reform movement.",
    biblicalParallel: "Innocent blood crying out; truth suppressed",
    biblicalReference: "Genesis 4:10; Habakkuk 2:12; Proverbs 29:2",
    spiritualLesson: "Tanks can suppress protest but not the human longing for freedom. Chinese believers continue to grow despite government control - truth cannot be permanently silenced.",
    useCase: "Human dignity; truth's resilience"
  },
  {
    id: "hf-087",
    title: "End of Apartheid",
    year: "1990-1994",
    category: "contemporary",
    region: "South Africa",
    summary: "South Africa peacefully ended racial apartheid, with Mandela and de Klerk choosing reconciliation over revenge.",
    biblicalParallel: "Joseph forgiving brothers; 'Father, forgive them'",
    biblicalReference: "Genesis 50:20; Luke 23:34; Colossians 3:13",
    spiritualLesson: "Mandela's Christian-influenced forgiveness prevented civil war. The Truth and Reconciliation Commission showed gospel principles applied to national healing.",
    useCase: "Reconciliation; forgiveness over revenge"
  },
  {
    id: "hf-088",
    title: "Rwandan Genocide",
    year: "1994",
    category: "contemporary",
    region: "Rwanda",
    summary: "800,000 Tutsis were murdered in 100 days, often by neighbors and even church members, in Africa's worst genocide.",
    biblicalParallel: "Cain killing Abel; ethnic hatred among supposed believers",
    biblicalReference: "Genesis 4:8; 1 John 3:15; James 4:1-2",
    spiritualLesson: "Nominal Christianity without heart transformation enables genocide. Some killers attended church on Sundays - cultural religion without regeneration is worthless.",
    useCase: "Genuine vs. nominal faith; ethnic reconciliation"
  },
  {
    id: "hf-089",
    title: "Good Friday Agreement",
    year: "1998",
    category: "contemporary",
    region: "Northern Ireland",
    summary: "After decades of sectarian violence, Catholics and Protestants agreed to share power and pursue peace.",
    biblicalParallel: "Reconciliation of enemies; 'blessed are the peacemakers'",
    biblicalReference: "Matthew 5:9; Ephesians 2:16; 2 Corinthians 5:18-19",
    spiritualLesson: "Christians killing Christians in Ireland was a scandal. Peace came when people chose the hard work of reconciliation over the easy comfort of tribalism.",
    useCase: "Christian unity; overcoming sectarian division"
  },
  {
    id: "hf-090",
    title: "Y2K Preparations and Relief",
    year: "1999-2000",
    category: "contemporary",
    region: "Global",
    summary: "Fears of computer crashes at the millennium proved largely unfounded after massive preparation efforts.",
    biblicalParallel: "False predictions; 'that day and hour no one knows'",
    biblicalReference: "Matthew 24:36; Acts 1:7; 2 Peter 3:10",
    spiritualLesson: "Y2K hysteria showed human tendency to predict apocalypse. Christians should prepare spiritually for Christ's return without setting dates or panicking over technology.",
    useCase: "Warning against date-setting; calm readiness"
  },
  {
    id: "hf-091",
    title: "Boxing Day Tsunami (2004)",
    year: "2004",
    category: "contemporary",
    region: "Indian Ocean",
    summary: "A massive earthquake generated tsunamis killing 230,000 people across multiple nations in minutes.",
    biblicalParallel: "Noah's flood; 'in such an hour as you think not'",
    biblicalReference: "Matthew 24:37-39; Luke 21:25; Genesis 7:11",
    spiritualLesson: "Vacationers were swept away without warning on the day after Christmas. The fragility of life demands readiness - tomorrow is promised to no one.",
    useCase: "Evangelistic urgency; disaster response"
  },
  {
    id: "hf-092",
    title: "Hurricane Katrina",
    year: "2005",
    category: "contemporary",
    region: "United States",
    summary: "The deadliest U.S. hurricane killed 1,800 people, displaced millions, and exposed failures in disaster preparation.",
    biblicalParallel: "Storms testing foundations; wise and foolish builders",
    biblicalReference: "Matthew 7:24-27; Luke 6:47-49; Proverbs 27:12",
    spiritualLesson: "Katrina exposed both infrastructure weakness and human compassion. The church's disaster response often exceeded government's - faith produces action.",
    useCase: "Disaster ministry; church serving community"
  },
  {
    id: "hf-093",
    title: "Deepwater Horizon Oil Spill",
    year: "2010",
    category: "contemporary",
    region: "Gulf of Mexico",
    summary: "The largest marine oil spill in history devastated Gulf ecosystems and fishing communities for years.",
    biblicalParallel: "Creation groaning (Romans 8:22); dominion mandate abused",
    biblicalReference: "Romans 8:22; Genesis 1:28; Jeremiah 2:7",
    spiritualLesson: "Human dominion over creation comes with responsibility. Corporate greed polluted what God made clean - we will answer for environmental stewardship.",
    useCase: "Environmental ethics; corporate responsibility"
  },
  {
    id: "hf-094",
    title: "Arab Spring and Syrian Civil War",
    year: "2011-present",
    category: "contemporary",
    region: "Middle East",
    summary: "Popular uprisings toppled dictators but led to chaos, with Syria's civil war displacing millions and destroying ancient Christian communities.",
    biblicalParallel: "Wars and rumors of wars; refugee displacement",
    biblicalReference: "Matthew 24:6-7; Psalm 46:1-3; Isaiah 17:1",
    spiritualLesson: "Political revolution without spiritual transformation leads to new tyrannies. Syrian Christians, present since the first century, now face extinction in their homeland.",
    useCase: "Middle East Christian persecution; refugee crisis"
  },
  {
    id: "hf-095",
    title: "Rise of ISIS and Persecution of Christians",
    year: "2014-2019",
    category: "contemporary",
    region: "Iraq/Syria",
    summary: "Islamic State conquered territory, executing Christians and other minorities, destroying churches and ancient communities.",
    biblicalParallel: "Antichrist figure; 'wearing out the saints'",
    biblicalReference: "Daniel 7:25; Revelation 13:7; John 16:2",
    spiritualLesson: "The church of Mosul, planted by the apostles, nearly disappeared. Yet persecuted Christians chose death over denying Christ - faith proved genuine under fire.",
    useCase: "Persecuted church; genuine faith tested"
  },
  {
    id: "hf-096",
    title: "Paris Climate Agreement",
    year: "2015",
    category: "contemporary",
    region: "Global",
    summary: "Nations agreed to limit global warming, reflecting growing concern about climate change and its effects.",
    biblicalParallel: "Stewardship of creation; caring for what God made",
    biblicalReference: "Genesis 2:15; Psalm 24:1; Revelation 11:18",
    spiritualLesson: "Christians have stewardship responsibility for creation. Whatever one's view on specific policies, Scripture is clear that God holds humans accountable for the earth.",
    useCase: "Creation care; environmental stewardship"
  },
  {
    id: "hf-097",
    title: "Brexit Referendum",
    year: "2016",
    category: "contemporary",
    region: "United Kingdom",
    summary: "Britain voted to leave the European Union, highlighting tensions between globalization and national sovereignty.",
    biblicalParallel: "Nations and boundaries (Acts 17:26); Babel's reversal",
    biblicalReference: "Acts 17:26-27; Genesis 11:8-9; Daniel 2:43",
    spiritualLesson: "God established nations and boundaries for His purposes. Neither nationalism nor globalism is inherently Christian - the kingdom of God transcends all earthly arrangements.",
    useCase: "Christian political engagement; transcendent citizenship"
  },
  {
    id: "hf-098",
    title: "Australian Bushfires",
    year: "2019-2020",
    category: "contemporary",
    region: "Australia",
    summary: "Catastrophic fires killed a billion animals, destroyed thousands of homes, and burned an area larger than many countries.",
    biblicalParallel: "Fire judgment imagery; creation's groaning",
    biblicalReference: "2 Peter 3:10; Romans 8:22; Joel 1:19-20",
    spiritualLesson: "Creation suffers with us. Australian Christians served heroically in disaster relief - the church is called to be present in catastrophe, not absent.",
    useCase: "Disaster response; creation care"
  },
  {
    id: "hf-099",
    title: "Overturning of Roe v. Wade",
    year: "2022",
    category: "contemporary",
    region: "United States",
    summary: "The Supreme Court returned abortion regulation to states, after 50 years of national legal protection for abortion.",
    biblicalParallel: "Josiah's reforms; partial restoration of righteousness",
    biblicalReference: "2 Kings 23:25; Proverbs 31:8-9; Psalm 139:13-16",
    spiritualLesson: "Legal change alone doesn't change hearts. The church must offer both prophetic witness for life and practical support for women in crisis pregnancies.",
    useCase: "Pro-life wholistic witness; supporting mothers"
  },
  {
    id: "hf-100",
    title: "October 7 Hamas Attack and Gaza War",
    year: "2023",
    category: "contemporary",
    region: "Israel/Gaza",
    summary: "Hamas militants killed 1,200 Israelis in the deadliest attack on Jews since the Holocaust, triggering devastating war in Gaza.",
    biblicalParallel: "Ancient enmity; 'pray for the peace of Jerusalem'",
    biblicalReference: "Psalm 122:6; Genesis 16:12; Matthew 5:44",
    spiritualLesson: "The conflict defies easy political solutions because it has ancient spiritual roots. Christians are called to pray for peace, love enemies, and recognize that only Christ brings ultimate reconciliation.",
    useCase: "Praying for Israel and Palestinian believers; peace-seeking"
  }
];

// Helper function to get events by category
export const getEventsByCategory = (category: HistoricalEvent["category"]): HistoricalEvent[] => {
  return historicalFreestyleLibrary.filter(event => event.category === category);
};

// Helper function to get events by region
export const getEventsByRegion = (region: string): HistoricalEvent[] => {
  return historicalFreestyleLibrary.filter(event =>
    event.region.toLowerCase().includes(region.toLowerCase())
  );
};

// Helper function to search events
export const searchEvents = (query: string): HistoricalEvent[] => {
  const lowerQuery = query.toLowerCase();
  return historicalFreestyleLibrary.filter(event =>
    event.title.toLowerCase().includes(lowerQuery) ||
    event.summary.toLowerCase().includes(lowerQuery) ||
    event.biblicalParallel.toLowerCase().includes(lowerQuery) ||
    event.spiritualLesson.toLowerCase().includes(lowerQuery)
  );
};

// Get random event for training
export const getRandomEvent = (): HistoricalEvent => {
  return historicalFreestyleLibrary[Math.floor(Math.random() * historicalFreestyleLibrary.length)];
};

// Category labels for UI
export const categoryLabels: Record<HistoricalEvent["category"], string> = {
  "ancient": "Ancient History (Before 500 AD)",
  "medieval": "Medieval Period (500-1500)",
  "early-modern": "Early Modern Era (1500-1800)",
  "modern": "Modern Era (1800-1950)",
  "contemporary": "Contemporary (1950-Present)"
};
