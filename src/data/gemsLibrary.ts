// Gems Room Library - Typological Connections, Prophecies, and Biblical Insights

export interface Gem {
  id: string;
  title: string;
  category: "typology" | "parallel" | "prophecy" | "wordplay" | "numerics" | "chiasm" | "symbol";
  oldTestament: { book: string; chapter: number; verses: string; text?: string };
  newTestament?: { book: string; chapter: number; verses: string; text?: string };
  insight: string;
  depth: "beginner" | "intermediate" | "advanced";
  tags: string[];
  relatedGems?: string[];
}

export const gemsLibrary: Gem[] = [
  // TYPOLOGY - Old Testament shadows pointing to Christ
  {
    id: "passover-lamb",
    title: "Passover Lamb = Christ Crucified",
    category: "typology",
    oldTestament: { book: "Exodus", chapter: 12, verses: "3-7,13", text: "Take a lamb... without blemish... kill it in the evening... strike the blood on the two side posts and on the upper door post... when I see the blood, I will pass over you" },
    newTestament: { book: "1 Corinthians", chapter: 5, verses: "7", text: "Christ our passover is sacrificed for us" },
    insight: "The Passover lamb was slain on Nisan 14—the same day Christ died on the cross. Blood was applied to the two doorposts and lintel using hyssop (Exodus 12:22). Death 'passed over' those under the blood, pointing to salvation through Christ's sacrifice.",
    depth: "beginner",
    tags: ["sacrifice", "exodus", "passover", "blood", "lamb", "deliverance"]
  },
  {
    id: "bronze-serpent",
    title: "Bronze Serpent Lifted Up",
    category: "typology",
    oldTestament: { book: "Numbers", chapter: 21, verses: "8-9", text: "Make a fiery serpent and set it on a pole; everyone who is bitten, when he looks at it, shall live" },
    newTestament: { book: "John", chapter: 3, verses: "14-15", text: "As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up" },
    insight: "Jesus directly identified Himself with the bronze serpent. Serpent = sin (Genesis 3). Christ was 'made sin for us' (2 Cor 5:21). Looking in faith brings healing and eternal life.",
    depth: "beginner",
    tags: ["serpent", "cross", "healing", "faith", "wilderness"]
  },
  {
    id: "isaac-sacrifice",
    title: "Isaac on Mount Moriah",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 22, verses: "1-14", text: "Take your son, your only son Isaac... offer him as a burnt offering" },
    newTestament: { book: "John", chapter: 3, verses: "16", text: "God so loved the world that He gave His only begotten Son" },
    insight: "Isaac carried the wood up the mountain (Christ carried the cross). Abraham said 'God will provide Himself a lamb' (prophetic). Mount Moriah = Temple Mount = Golgotha region. Isaac was 'received back from the dead' figuratively (Heb 11:19).",
    depth: "intermediate",
    tags: ["abraham", "isaac", "sacrifice", "moriah", "substitute", "ram"]
  },
  {
    id: "joseph-christ",
    title: "Joseph as a Type of Christ",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 37, verses: "1-36" },
    newTestament: { book: "Acts", chapter: 7, verses: "9-14" },
    insight: "Joseph: beloved son, hated by brothers, sold for silver, falsely accused, imprisoned between two (one saved, one lost), exalted to right hand of power, savior of the world, gentile bride, brothers didn't recognize him at first coming but will at second.",
    depth: "intermediate",
    tags: ["joseph", "rejection", "exaltation", "brothers", "egypt", "savior"]
  },
  {
    id: "ark-of-noah",
    title: "Noah's Ark = Salvation in Christ",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 6, verses: "14-18", text: "Make yourself an ark... I will establish My covenant with you" },
    newTestament: { book: "1 Peter", chapter: 3, verses: "20-21", text: "Eight souls were saved through water. There is also an antitype which now saves us—baptism" },
    insight: "One door (John 10:9). Pitched within and without (atonement - same Hebrew word 'kaphar'). Three stories (Trinity/resurrection on third day). Window above (look up). All who entered were saved.",
    depth: "beginner",
    tags: ["ark", "noah", "flood", "salvation", "baptism", "door"]
  },
  {
    id: "jonah-three-days",
    title: "Jonah: Three Days in the Fish",
    category: "typology",
    oldTestament: { book: "Jonah", chapter: 1, verses: "17", text: "Jonah was in the belly of the fish three days and three nights" },
    newTestament: { book: "Matthew", chapter: 12, verses: "40", text: "So shall the Son of Man be three days and three nights in the heart of the earth" },
    insight: "Jesus gave this as THE sign of His messiahship. Jonah died (symbolically) to save the sailors, was 'resurrected' from the deep, then preached to Gentiles who repented. Christ died, rose, and the Gospel went to Gentiles.",
    depth: "beginner",
    tags: ["jonah", "resurrection", "three days", "gentiles", "sign"]
  },
  {
    id: "rock-struck",
    title: "The Rock Struck Once",
    category: "typology",
    oldTestament: { book: "Exodus", chapter: 17, verses: "6", text: "Strike the rock, and water will come out of it" },
    newTestament: { book: "1 Corinthians", chapter: 10, verses: "4", text: "They drank of that spiritual Rock that followed them, and that Rock was Christ" },
    insight: "The rock was struck ONCE at Horeb (Christ crucified once). When Moses struck it again at Meribah (Numbers 20), he misrepresented God—Christ need not be crucified again. Living water flowed from Christ's side (John 19:34).",
    depth: "intermediate",
    tags: ["rock", "water", "wilderness", "moses", "crucifixion"]
  },
  {
    id: "tabernacle-christ",
    title: "Tabernacle: God Dwelling with Man",
    category: "typology",
    oldTestament: { book: "Exodus", chapter: 25, verses: "8-9", text: "Let them make Me a sanctuary, that I may dwell among them" },
    newTestament: { book: "John", chapter: 1, verses: "14", text: "The Word became flesh and dwelt [tabernacled] among us" },
    insight: "Every piece of furniture points to Christ: Altar (sacrifice), Laver (cleansing/baptism), Table (Bread of Life), Lampstand (Light of World), Incense (prayers/intercession), Ark (God's presence). The veil = His flesh (Heb 10:20).",
    depth: "advanced",
    tags: ["tabernacle", "sanctuary", "furniture", "dwelling", "presence"]
  },
  {
    id: "day-of-atonement",
    title: "Day of Atonement: Two Goats",
    category: "typology",
    oldTestament: { book: "Leviticus", chapter: 16, verses: "7-22" },
    newTestament: { book: "Hebrews", chapter: 9, verses: "11-14" },
    insight: "Two goats = one work of Christ. Lord's goat: sacrificed (Christ died). Scapegoat (Azazel): bore sins into wilderness (Satan bears responsibility). High Priest entered Most Holy Place once yearly; Christ entered heavenly sanctuary once for all.",
    depth: "advanced",
    tags: ["atonement", "goat", "scapegoat", "high priest", "sanctuary"]
  },
  {
    id: "manna-bread",
    title: "Manna: Bread from Heaven",
    category: "typology",
    oldTestament: { book: "Exodus", chapter: 16, verses: "14-15", text: "When the dew lifted, there on the surface of the wilderness was a small round substance" },
    newTestament: { book: "John", chapter: 6, verses: "48-51", text: "I am the bread of life. Your fathers ate the manna in the wilderness, and are dead... I am the living bread" },
    insight: "Manna came down from heaven (Christ descended). White and pure. Sweet like honey (God's Word). Gathered daily (daily devotion). Double portion on sixth day (preparation). None on Sabbath (rest in Christ). Hidden manna in the Ark (Rev 2:17).",
    depth: "beginner",
    tags: ["manna", "bread", "wilderness", "daily", "heaven"]
  },

  // PARALLELS - OT/NT Connections
  {
    id: "babel-pentecost",
    title: "Babel Reversed at Pentecost",
    category: "parallel",
    oldTestament: { book: "Genesis", chapter: 11, verses: "1-9", text: "The LORD confused the language of all the earth" },
    newTestament: { book: "Acts", chapter: 2, verses: "1-11", text: "They were all filled with the Holy Spirit and began to speak with other tongues" },
    insight: "At Babel, one language became many (judgment, scattering). At Pentecost, many languages were understood as one (grace, gathering). The curse of division was reversed by the Spirit. Babel built UP to reach God; Pentecost brought God DOWN to man.",
    depth: "beginner",
    tags: ["babel", "pentecost", "languages", "spirit", "unity", "reversal"]
  },
  {
    id: "adam-christ",
    title: "First Adam vs. Last Adam",
    category: "parallel",
    oldTestament: { book: "Genesis", chapter: 3, verses: "1-24" },
    newTestament: { book: "Romans", chapter: 5, verses: "12-21", text: "For as by one man's disobedience many were made sinners, so by the obedience of one shall many be made righteous" },
    insight: "Adam: in a garden, faced temptation, chose self, brought death. Christ: in a garden (Gethsemane), faced temptation, chose Father's will, brought life. Adam's bride came from his wounded side; Christ's bride (church) came from His wounded side.",
    depth: "beginner",
    tags: ["adam", "christ", "fall", "redemption", "obedience", "garden"]
  },
  {
    id: "elijah-john-baptist",
    title: "Elijah and John the Baptist",
    category: "parallel",
    oldTestament: { book: "Malachi", chapter: 4, verses: "5-6", text: "I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD" },
    newTestament: { book: "Matthew", chapter: 11, verses: "14", text: "If you are willing to receive it, he is Elijah who is to come" },
    insight: "Both wore rough garments (camel hair). Both confronted evil kings (Ahab/Herod). Both faced wicked queens (Jezebel/Herodias). Both had wilderness ministries. Both called Israel to repentance. John came in 'spirit and power of Elijah' (Luke 1:17).",
    depth: "intermediate",
    tags: ["elijah", "john", "baptist", "prophet", "preparation", "repentance"]
  },
  {
    id: "moses-jesus",
    title: "Moses and Jesus: Prophet Like Me",
    category: "parallel",
    oldTestament: { book: "Deuteronomy", chapter: 18, verses: "15-18", text: "The LORD your God will raise up for you a Prophet like me from your midst" },
    newTestament: { book: "Acts", chapter: 3, verses: "22-23" },
    insight: "Both escaped infant massacres. Both spent 40 days fasting. Both performed miracles. Both gave law from a mountain. Both mediated covenants. Both had 70 helpers. Moses delivered from Egypt (bondage); Christ delivers from sin.",
    depth: "intermediate",
    tags: ["moses", "jesus", "prophet", "deliverer", "law", "covenant"]
  },
  {
    id: "creation-new-creation",
    title: "Genesis 1 Parallels Revelation 21-22",
    category: "parallel",
    oldTestament: { book: "Genesis", chapter: 1, verses: "1" },
    newTestament: { book: "Revelation", chapter: 21, verses: "1-5" },
    insight: "Genesis: 'In the beginning' / Revelation: 'Behold, I make all things new'. Genesis: darkness / Rev: no night. Genesis: sea created / Rev: no more sea. Genesis: curse pronounced / Rev: no more curse. Genesis: death enters / Rev: no more death. Genesis: tree of life guarded / Rev: tree of life accessible.",
    depth: "advanced",
    tags: ["genesis", "revelation", "creation", "new creation", "restoration", "eden"]
  },

  // PROPHECY FULFILLMENTS
  {
    id: "bethlehem-birth",
    title: "Born in Bethlehem",
    category: "prophecy",
    oldTestament: { book: "Micah", chapter: 5, verses: "2", text: "But you, Bethlehem Ephrathah... out of you shall come forth to Me the One to be Ruler in Israel" },
    newTestament: { book: "Matthew", chapter: 2, verses: "1", text: "Jesus was born in Bethlehem of Judea" },
    insight: "Bethlehem means 'House of Bread'—the Bread of Life was born there. It was David's city, and Jesus is David's greater Son. The prophecy specified 'Ephrathah' to distinguish from the other Bethlehem in Zebulun.",
    depth: "beginner",
    tags: ["bethlehem", "birth", "micah", "messiah", "david"]
  },
  {
    id: "virgin-birth",
    title: "Born of a Virgin",
    category: "prophecy",
    oldTestament: { book: "Isaiah", chapter: 7, verses: "14", text: "The virgin shall conceive and bear a Son, and shall call His name Immanuel" },
    newTestament: { book: "Matthew", chapter: 1, verses: "22-23" },
    insight: "Immanuel = 'God with us'. The Hebrew 'almah' means young woman of marriageable age (implying virginity). The Greek LXX used 'parthenos' (virgin). Only a virgin birth could produce the God-Man: fully God, fully human, without sin nature.",
    depth: "intermediate",
    tags: ["virgin", "birth", "immanuel", "isaiah", "incarnation"]
  },
  {
    id: "thirty-silver",
    title: "Betrayed for Thirty Pieces of Silver",
    category: "prophecy",
    oldTestament: { book: "Zechariah", chapter: 11, verses: "12-13", text: "They weighed out for my wages thirty pieces of silver... throw it to the potter" },
    newTestament: { book: "Matthew", chapter: 27, verses: "3-10" },
    insight: "Thirty pieces of silver was the price of a slave (Exodus 21:32). The exact amount, the throwing of money in the Temple, and the purchase of the potter's field were all prophesied 500 years before. Judas fulfilled prophecy unconsciously.",
    depth: "intermediate",
    tags: ["betrayal", "judas", "silver", "zechariah", "potter"]
  },
  {
    id: "psalm-22-crucifixion",
    title: "Psalm 22: Crucifixion Details",
    category: "prophecy",
    oldTestament: { book: "Psalms", chapter: 22, verses: "1-18" },
    newTestament: { book: "Matthew", chapter: 27, verses: "35-46" },
    insight: "Written 1000 years before Christ, 600 years before crucifixion was invented. Details: 'My God, why have you forsaken me' (v.1), mocking words (v.8), pierced hands and feet (v.16), bones out of joint (v.14), casting lots for garments (v.18), 'thirst' implied (v.15).",
    depth: "advanced",
    tags: ["psalm22", "crucifixion", "prophecy", "details", "suffering"]
  },
  {
    id: "isaiah-53-suffering",
    title: "Isaiah 53: The Suffering Servant",
    category: "prophecy",
    oldTestament: { book: "Isaiah", chapter: 53, verses: "1-12" },
    newTestament: { book: "1 Peter", chapter: 2, verses: "22-25" },
    insight: "Despised and rejected (v.3). Bore our griefs and sorrows (v.4). Wounded for our transgressions (v.5). Silent before accusers like a lamb (v.7). Cut off from the living (v.8). Grave with the wicked but tomb with the rich (v.9). Shall see His seed (resurrection, v.10).",
    depth: "beginner",
    tags: ["isaiah53", "suffering", "servant", "substitution", "atonement"]
  },

  // SYMBOLS
  {
    id: "seven-creation",
    title: "Seven: The Number of Completion",
    category: "symbol",
    oldTestament: { book: "Genesis", chapter: 2, verses: "2-3", text: "On the seventh day God ended His work... and He rested" },
    newTestament: { book: "Revelation", chapter: 1, verses: "4", text: "Seven Spirits... seven churches... seven golden lampstands" },
    insight: "Seven appears 735+ times in Scripture. Creation week established the pattern. 7 churches, 7 seals, 7 trumpets, 7 bowls in Revelation. 7 = divine completion. The Hebrew word for 'seven' (sheva) is related to 'oath' (shevua)—God's covenant number.",
    depth: "intermediate",
    tags: ["seven", "number", "completion", "sabbath", "revelation"]
  },
  {
    id: "twelve-tribes-apostles",
    title: "Twelve: God's Governmental Order",
    category: "symbol",
    oldTestament: { book: "Genesis", chapter: 49, verses: "28", text: "All these are the twelve tribes of Israel" },
    newTestament: { book: "Matthew", chapter: 10, verses: "1", text: "He called His twelve disciples" },
    insight: "12 tribes, 12 apostles, 12 foundations of New Jerusalem, 12 gates, 12 angels, 12x12,000 sealed (144,000). Represents organized government under God. 12 = 3 (divine) × 4 (earth/creation). Jesus sat with 12, judging 12 tribes (Matt 19:28).",
    depth: "intermediate",
    tags: ["twelve", "tribes", "apostles", "government", "organization"]
  },
  {
    id: "forty-testing",
    title: "Forty: The Number of Testing",
    category: "symbol",
    oldTestament: { book: "Numbers", chapter: 14, verses: "34", text: "Forty years... you shall bear your iniquities" },
    newTestament: { book: "Matthew", chapter: 4, verses: "2", text: "When He had fasted forty days and forty nights" },
    insight: "40 days of rain (Noah). 40 years in wilderness (Israel). 40 days on Sinai (Moses). 40 days spying Canaan. 40 days Goliath's challenge. 40 days Jonah's warning. 40 days temptation (Jesus). 40 days resurrection to ascension. Testing that leads to new beginning.",
    depth: "beginner",
    tags: ["forty", "testing", "wilderness", "probation", "trial"]
  },

  // CHIASTIC STRUCTURES
  {
    id: "flood-chiasm",
    title: "Flood Narrative Chiasm",
    category: "chiasm",
    oldTestament: { book: "Genesis", chapter: 6, verses: "1" },
    insight: "The Flood narrative (Gen 6-9) forms a perfect chiasm: A-Violence fills earth, B-Ark commanded, C-Enter ark, D-Waters rise 40 days, E-Waters prevail 150 days, E'-Waters recede 150 days, D'-Waters fall 40 days, C'-Exit ark, B'-Altar built, A'-Covenant peace. The center point: 'God remembered Noah' (8:1).",
    depth: "advanced",
    tags: ["chiasm", "flood", "noah", "structure", "literary"]
  },
  {
    id: "matthew-chiasm",
    title: "Matthew's Five Discourse Structure",
    category: "chiasm",
    oldTestament: { book: "Deuteronomy", chapter: 1, verses: "1", text: "These are the words Moses spoke" },
    newTestament: { book: "Matthew", chapter: 5, verses: "1" },
    insight: "Matthew arranges Jesus' teaching in five discourses (like the five books of Moses): Sermon on the Mount (5-7), Mission Discourse (10), Parables (13), Church Life (18), Olivet Discourse (24-25). Jesus is the new Moses giving the new Torah. Each ends with 'When Jesus finished these sayings...'",
    depth: "advanced",
    tags: ["matthew", "chiasm", "discourse", "moses", "torah", "structure"]
  },

  // WORDPLAY
  {
    id: "peter-rock",
    title: "Peter and the Rock",
    category: "wordplay",
    newTestament: { book: "Matthew", chapter: 16, verses: "18", text: "You are Peter (Petros), and on this rock (petra) I will build My church" },
    oldTestament: { book: "Isaiah", chapter: 28, verses: "16", text: "Behold, I lay in Zion a stone for a foundation" },
    insight: "Greek wordplay: Petros (masculine, small stone) vs. Petra (feminine, bedrock). Peter is a stone; the Rock is Christ (the confession Peter made). Peter himself later calls Christ the 'living stone' and believers 'living stones' (1 Peter 2:4-5).",
    depth: "intermediate",
    tags: ["peter", "rock", "church", "foundation", "wordplay"]
  },
  {
    id: "branch-nazarene",
    title: "Nazarene and the Branch",
    category: "wordplay",
    oldTestament: { book: "Isaiah", chapter: 11, verses: "1", text: "A Branch (netzer) shall grow out of his roots" },
    newTestament: { book: "Matthew", chapter: 2, verses: "23", text: "He shall be called a Nazarene" },
    insight: "Hebrew wordplay: 'Netzer' (branch) sounds like 'Nazareth/Nazarene'. The prophets said Messiah would be called a Branch (netzer). Jesus was from Nazareth—the 'Branch-town.' Isaiah 11:1 and Jeremiah 23:5 prophecies fulfilled in His hometown.",
    depth: "advanced",
    tags: ["branch", "nazarene", "nazareth", "wordplay", "hebrew"]
  },

  // JESUS IN ALL THE BIBLE - Composite Sketch (Pastor Ivor Myers)
  {
    id: "jesus-composite-sketch",
    title: "Jesus in All the Bible: The Composite Sketch",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 1, verses: "1", text: "In the beginning God created..." },
    newTestament: { book: "Hebrews", chapter: 1, verses: "1-3", text: "God, who at various times and in various ways spoke in time past to the fathers by the prophets, has in these last days spoken to us by His Son" },
    insight: "Like Adam, He was the Son of God. Like Samuel, only a boy discovering His mission in the temple. Like Joseph, 30 when He came into prominence. Like Joshua, He crossed the Jordan to lead 12. Like Elijah, He provided drink for the thirsty. Like Moses, He wandered 40 days in the wilderness. Like Daniel, He overcame temptation of appetite. Like Job, He refused presumption. Like the three Hebrews, He refused to bow before another lord. Like Elisha, He raised the dead, multiplied bread, and healed lepers. Like Ezekiel, He preached to a stubborn people. Like Josiah, He exposed false worship. Like Enoch, He walked with God. Like Moses, He gathered the 12 to repeat the covenant and sang a song before going to die. Like David, He crossed the brook Kidron. Like David, He was betrayed by His close friend who hung himself. Like Job, He entered a time of trouble and was tempted to think God forsook Him. Like Joseph, He was sold for silver and deserted by His brothers. Like Joseph with the butler and baker, He was placed between two men—one forgiven, the other rejected. Like Samson, He was beaten, bound, mocked, placed between two pillars, bowed His head, and saved more in death than in life. Like Isaac, He was given up for sacrifice. Like Noah, He was lifted up on wood above the earth. Like Nehemiah, He would not come down—He had a great work to do. Like Job, He prayed for His enemies. Like Elisha's dead bones, His death brought many to life from the grave. Like Jonah, He was in the belly of the earth three days. Like David, He delivered a deadly blow to the head of His enemy. Like Moses, He was willing to be blotted out but was resurrected. Like Samuel, He was called from sleep to serve as Priest. Like Nehemiah, He finished the work. Like Elijah, He was raised to the heavens. Like Joseph, He was sent ahead to prepare a place. Like Daniel, He intercedes for His people. Like Jacob, while He is away He works for His bride. Like Joseph, He will investigate His brethren before allowing entry. Like Moses, He will descend from the mount upon an unexpected people. Like Moses parting the sea, He will part the sky. Like Joshua, He will lead His people into the Promised Land. Like David, He will take His throne as rightful King. Like Solomon, He will reign in peace for a thousand years and answer all our hard questions. Like Gideon, He will put down God's enemies. Like Jephthah, He will destroy those who cannot speak the heavenly language. Like Abraham, He will be Father of a great multitude. And like Joseph, He will be reunited with His loved ones. Jesus is the center of Scripture.",
    depth: "advanced",
    tags: ["composite sketch", "jesus in all the bible", "typology", "christ centered", "all scripture", "ivor myers"]
  },
  {
    id: "samson-christ-death",
    title: "Samson's Death = Christ's Death",
    category: "typology",
    oldTestament: { book: "Judges", chapter: 16, verses: "25-30", text: "They called for Samson... he bowed himself with all his might; and the house fell... so the dead which he slew at his death were more than they which he slew in his life" },
    newTestament: { book: "Hebrews", chapter: 2, verses: "14-15", text: "Through death He might destroy him who had the power of death" },
    insight: "Samson: beaten, bound, mocked, eyes put out, placed between two pillars, bowed his head, pushed—and saved more in death. Christ: beaten, bound, mocked, blindfolded, placed between two crosses, bowed His head—and saved infinitely more in death than in life. Samson's death caused a great rumbling; Christ's death shook the earth (Matt 27:51).",
    depth: "intermediate",
    tags: ["samson", "death", "victory", "pillars", "cross", "earthquake"]
  },
  {
    id: "nehemiah-cross",
    title: "Nehemiah Would Not Come Down = Christ Would Not Come Down",
    category: "typology",
    oldTestament: { book: "Nehemiah", chapter: 6, verses: "3", text: "I am doing a great work, so that I cannot come down. Why should the work cease while I leave it and go down to you?" },
    newTestament: { book: "Matthew", chapter: 27, verses: "40-42", text: "If You are the Son of God, come down from the cross... He saved others; Himself He cannot save" },
    insight: "Nehemiah's enemies four times urged him to come down from the wall; Christ's enemies mocked 'Come down from the cross!' Nehemiah said 'I have a great work to do.' Christ had the greatest work—saving the world. Nehemiah finished the wall in 52 days; Christ cried 'It is finished!' (John 19:30).",
    depth: "intermediate",
    tags: ["nehemiah", "cross", "finished", "wall", "great work", "perseverance"]
  },
  {
    id: "noah-lifted-on-wood",
    title: "Noah Lifted Up on Wood = Christ Lifted on the Cross",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 7, verses: "17-18", text: "The waters increased and lifted up the ark, and it rose high above the earth" },
    newTestament: { book: "John", chapter: 12, verses: "32", text: "And I, if I am lifted up from the earth, will draw all peoples to Myself" },
    insight: "Noah was lifted above the earth on wood (the ark) and all who came to him were saved. Christ was lifted above the earth on wood (the cross) and all who come to Him are saved. The ark drew all living things; the cross draws all people. One door on the ark; one way through Christ.",
    depth: "beginner",
    tags: ["noah", "ark", "lifted up", "cross", "wood", "salvation", "draw"]
  },
  {
    id: "david-kidron-betrayal",
    title: "David Crossed Kidron = Christ Crossed Kidron",
    category: "parallel",
    oldTestament: { book: "2 Samuel", chapter: 15, verses: "23, 30-31", text: "The king crossed over the Brook Kidron... David went up by the ascent of the Mount of Olives, and wept" },
    newTestament: { book: "John", chapter: 18, verses: "1", text: "He went out with His disciples over the Brook Kidron, where there was a garden" },
    insight: "David crossed Kidron weeping, fleeing from Absalom's rebellion, betrayed by his counselor Ahithophel who later hanged himself (2 Sam 17:23). Christ crossed Kidron in anguish heading to Gethsemane, betrayed by Judas who later hanged himself (Matt 27:5). Both had trusted friends turn traitor.",
    depth: "intermediate",
    tags: ["david", "kidron", "betrayal", "ahithophel", "judas", "gethsemane", "weeping"]
  },
  {
    id: "joseph-butler-baker",
    title: "Joseph Between Two Prisoners = Christ Between Two Thieves",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 40, verses: "1-22", text: "The chief butler and the chief baker of the king of Egypt... were confined in prison" },
    newTestament: { book: "Luke", chapter: 23, verses: "39-43", text: "One of the criminals... said, 'Lord, remember me'... 'Today you will be with Me in Paradise'" },
    insight: "Joseph in prison was placed between two men—the butler (forgiven, restored) and the baker (rejected, executed). Christ on the cross was placed between two thieves—one repented and was promised paradise, the other rejected and perished. The one who remembered Joseph forgot him; the one who asked Christ to remember was never forgotten.",
    depth: "intermediate",
    tags: ["joseph", "butler", "baker", "thieves", "cross", "prison", "forgiveness", "judgment"]
  },
  {
    id: "jacob-working-for-bride",
    title: "Jacob Working for His Bride = Christ Working for the Church",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 29, verses: "18-20", text: "I will serve you seven years for Rachel your younger daughter... they seemed only a few days to him because of the love he had for her" },
    newTestament: { book: "Ephesians", chapter: 5, verses: "25-27", text: "Christ loved the church and gave Himself for her" },
    insight: "Jacob left his father's house and traveled to a far country to labor for his bride. The years seemed like nothing because of his love. Christ left His Father's house (heaven), came to a far country (earth), and now labors in the heavenly sanctuary for His bride, the church. His love makes every year of waiting worthwhile.",
    depth: "intermediate",
    tags: ["jacob", "bride", "church", "love", "labor", "waiting", "heaven"]
  },
  {
    id: "elisha-dead-bones-resurrection",
    title: "Elisha's Dead Bones = Christ's Death Brings Life",
    category: "typology",
    oldTestament: { book: "2 Kings", chapter: 13, verses: "21", text: "When the man touched the bones of Elisha, he revived and stood on his feet" },
    newTestament: { book: "Matthew", chapter: 27, verses: "52-53", text: "The graves were opened; and many bodies of the saints who had fallen asleep were raised" },
    insight: "Even after death, Elisha's bones had power to raise the dead. When Christ died, the power of His death broke open graves and raised many saints. The death of the righteous has resurrection power. Elisha's miracle was one man; Christ's death raised many.",
    depth: "advanced",
    tags: ["elisha", "bones", "resurrection", "death", "power", "graves"]
  },

  // MORE TYPOLOGY
  {
    id: "red-sea-baptism",
    title: "Red Sea Crossing = Baptism",
    category: "typology",
    oldTestament: { book: "Exodus", chapter: 14, verses: "21-22" },
    newTestament: { book: "1 Corinthians", chapter: 10, verses: "1-2", text: "All our fathers... were baptized into Moses in the cloud and in the sea" },
    insight: "Passed through water (baptism). Left Egypt (sin/world) behind. Pharaoh's army (old life) drowned. Emerged as a new nation. Led by pillar of cloud/fire (Holy Spirit). Heading toward Promised Land (heaven). No turning back.",
    depth: "beginner",
    tags: ["red sea", "baptism", "exodus", "deliverance", "new life"]
  },
  {
    id: "david-goliath",
    title: "David Defeats Goliath",
    category: "typology",
    oldTestament: { book: "1 Samuel", chapter: 17, verses: "1-51" },
    newTestament: { book: "Colossians", chapter: 2, verses: "15", text: "Having disarmed principalities and powers, He made a public spectacle of them" },
    insight: "David (beloved) faced the giant with 5 smooth stones from the brook. Used the enemy's own weapon (sword) to finish him—Christ used death to defeat death. Goliath's head severed = serpent's head crushed (Gen 3:15). Israel (unable to fight) won through their champion who fought on their behalf.",
    depth: "intermediate",
    tags: ["david", "goliath", "champion", "victory", "giant", "faith"]
  },
  {
    id: "ruth-boaz",
    title: "Ruth and Boaz: Kinsman Redeemer",
    category: "typology",
    oldTestament: { book: "Ruth", chapter: 4, verses: "1-10" },
    newTestament: { book: "Ephesians", chapter: 1, verses: "7", text: "In Him we have redemption through His blood" },
    insight: "Boaz (strength) as kinsman-redeemer: had the right (kinship), had the resources (wealthy), had the resolve (chose to redeem). Ruth (Gentile) was brought into the family of Israel. Christ redeemed His Gentile bride. From this union came David, then Jesus.",
    depth: "intermediate",
    tags: ["ruth", "boaz", "kinsman", "redeemer", "gentile", "bride"]
  },
  {
    id: "melchizedek-priest",
    title: "Melchizedek: Priest-King",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 14, verses: "18-20", text: "Melchizedek king of Salem brought out bread and wine; he was the priest of God Most High" },
    newTestament: { book: "Hebrews", chapter: 7, verses: "1-3" },
    insight: "Melchizedek = 'King of Righteousness'. Salem = 'Peace'. King AND Priest (forbidden in Levitical system—Uzziah struck leprous for this). No recorded genealogy, birth, or death (eternal priesthood type). Bread and wine (communion elements). Greater than Abraham (received tithes).",
    depth: "advanced",
    tags: ["melchizedek", "priest", "king", "salem", "eternal", "tithe"]
  },
  {
    id: "esther-intercession",
    title: "Esther: Royal Intercessor",
    category: "typology",
    oldTestament: { book: "Esther", chapter: 4, verses: "14-16" },
    newTestament: { book: "Hebrews", chapter: 7, verses: "25", text: "He always lives to make intercession for them" },
    insight: "Esther (star/hidden one) risked death to approach the king for her people. 'If I perish, I perish.' She found favor and the death decree was reversed. Christ approached the Father for us, found favor, and reversed our death sentence. Esther's 3 days of fasting mirror Christ's 3 days in the grave.",
    depth: "intermediate",
    tags: ["esther", "intercession", "queen", "advocate", "favor"]
  },
  {
    id: "cities-refuge",
    title: "Cities of Refuge = Christ Our Refuge",
    category: "typology",
    oldTestament: { book: "Numbers", chapter: 35, verses: "11-15" },
    newTestament: { book: "Hebrews", chapter: 6, verses: "18", text: "We who have fled for refuge to lay hold of the hope set before us" },
    insight: "Six cities of refuge for the manslayer. Had to stay until death of high priest (our High Priest never dies—eternal refuge). Roads kept clear and marked (Gospel is accessible). Name of nearest city: Kedesh = 'holy/sanctuary'. We flee to Christ from the avenger (Satan/law's curse).",
    depth: "advanced",
    tags: ["cities", "refuge", "sanctuary", "high priest", "safety"]
  },
  {
    id: "feast-trumpets",
    title: "Feast of Trumpets = Second Coming",
    category: "typology",
    oldTestament: { book: "Leviticus", chapter: 23, verses: "24", text: "A memorial of blowing of trumpets, a holy convocation" },
    newTestament: { book: "1 Thessalonians", chapter: 4, verses: "16", text: "The Lord Himself will descend from heaven with a shout, with the voice of an archangel, and with the trumpet of God" },
    insight: "Spring feasts (Passover, Unleavened Bread, Firstfruits, Pentecost) fulfilled at First Coming. Fall feasts await: Trumpets (Second Coming), Day of Atonement (judgment), Tabernacles (dwelling with God). Trumpets = awakening call, gathering, coronation of the King.",
    depth: "advanced",
    tags: ["trumpets", "feast", "second coming", "shofar", "gathering"]
  },
  {
    id: "gideon-300",
    title: "Gideon's 300: Victory Through Weakness",
    category: "typology",
    oldTestament: { book: "Judges", chapter: 7, verses: "1-22" },
    newTestament: { book: "2 Corinthians", chapter: 12, verses: "9-10", text: "My strength is made perfect in weakness" },
    insight: "God reduced army from 32,000 to 300 so Israel couldn't boast. Weapons: trumpets (Word proclaimed), torches in clay jars (light in earthen vessels—2 Cor 4:7), and the shout 'The sword of the LORD and Gideon!' God wins through unlikely means so HE gets glory.",
    depth: "intermediate",
    tags: ["gideon", "weakness", "victory", "300", "vessels"]
  },
  {
    id: "jacob-ladder",
    title: "Jacob's Ladder = Christ the Way",
    category: "typology",
    oldTestament: { book: "Genesis", chapter: 28, verses: "12", text: "A ladder was set up on the earth, and its top reached to heaven; and there the angels of God were ascending and descending on it" },
    newTestament: { book: "John", chapter: 1, verses: "51", text: "You shall see heaven open, and the angels of God ascending and descending upon the Son of Man" },
    insight: "Jesus directly identified Himself as Jacob's ladder. He is THE connection between heaven and earth. Angels ascend FIRST (reporting) then descend (serving). Bethel = 'House of God'—Jesus is the true temple where God dwells.",
    depth: "beginner",
    tags: ["jacob", "ladder", "angels", "bethel", "connection", "way"]
  },
  {
    id: "scarlet-cord",
    title: "Rahab's Scarlet Cord",
    category: "typology",
    oldTestament: { book: "Joshua", chapter: 2, verses: "18-21", text: "You shall bind this line of scarlet cord in the window" },
    newTestament: { book: "Hebrews", chapter: 9, verses: "22", text: "Without shedding of blood there is no remission" },
    insight: "Rahab (a Gentile harlot) saved by scarlet cord in window—like Passover blood on doorposts. All who entered her house were saved. She's in the lineage of Christ (Matt 1:5)! Scarlet = blood = salvation. Faith + action (James 2:25).",
    depth: "beginner",
    tags: ["rahab", "scarlet", "cord", "blood", "faith", "gentile"]
  },
];

// Helper function to get gems by category
export const getGemsByCategory = (category: Gem["category"]) =>
  gemsLibrary.filter(g => g.category === category);

// Helper function to get gems by depth
export const getGemsByDepth = (depth: Gem["depth"]) =>
  gemsLibrary.filter(g => g.depth === depth);

// Helper function to search gems by tags
export const searchGemsByTag = (tag: string) =>
  gemsLibrary.filter(g => g.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())));

// Helper function to search gems by keyword
export const searchGems = (query: string) => {
  const q = query.toLowerCase();
  return gemsLibrary.filter(g =>
    g.title.toLowerCase().includes(q) ||
    g.insight.toLowerCase().includes(q) ||
    g.tags.some(t => t.toLowerCase().includes(q))
  );
};

// Get all unique tags
export const getAllGemTags = () => {
  const tags = new Set<string>();
  gemsLibrary.forEach(g => g.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
};
