import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Trophy, RotateCcw, Send, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GameCard {
  id: string;
  event1Title: string;
  event1Story: string;
  event1Reference: string;
  event2Title: string;
  event2Story: string;
  event2Reference: string;
  parallelKey: string;
  color: string;
  isFlipped: boolean;
  isCompleted: boolean;
  userAnswer: string;
  isValidating: boolean;
}

// Biblical parallels for the game - Comprehensive collection
const PARALLEL_PAIRS = [
  // CREATION PATTERNS
  {
    event1Title: "Third Day of Creation",
    event1Story: "On the third day, God said 'Let the earth bring forth grass, the herb yielding seed, and the fruit tree.' The earth brought forth vegetation, and it was good. Life emerged from the ground.",
    event1Reference: "Genesis 1:11-13",
    event2Title: "Jesus' Third Day Resurrection",
    event2Story: "Jesus rose from the dead on the third day. Paul writes, 'But now Christ is risen from the dead, and has become the firstfruits of those who have fallen asleep.' He is the firstfruits from the ground.",
    event2Reference: "1 Cor 15:20; Matt 28:1-6",
    parallelKey: "Third day brings life from the earth; firstfruits emerge from the ground; both mark new creation and life from death",
    color: "from-green-600 via-emerald-700 to-green-800"
  },
  {
    event1Title: "Light Created First Day",
    event1Story: "God said, 'Let there be light,' and there was light. God divided the light from the darkness, calling the light Day and the darkness Night.",
    event1Reference: "Genesis 1:3-5",
    event2Title: "Christ the Light of the World",
    event2Story: "Jesus declared, 'I am the light of the world. He who follows Me shall not walk in darkness, but have the light of life.' John writes, 'The light shines in the darkness, and the darkness did not comprehend it.'",
    event2Reference: "John 8:12; 1:5",
    parallelKey: "First creation: light precedes all life; In Christ: light precedes new creation; both separate light from darkness",
    color: "from-yellow-600 via-amber-700 to-yellow-800"
  },
  {
    event1Title: "God Rests Seventh Day",
    event1Story: "On the seventh day God ended His work which He had done, and He rested. God blessed the seventh day and sanctified it, because in it He rested from all His work.",
    event1Reference: "Genesis 2:2-3",
    event2Title: "Christ's Rest and Ours",
    event2Story: "Jesus said, 'Come to Me, all you who labor and are heavy laden, and I will give you rest.' Hebrews says, 'There remains therefore a rest for the people of God. For he who has entered His rest has himself also ceased from his works.'",
    event2Reference: "Matthew 11:28; Hebrews 4:9-10",
    parallelKey: "God's rest after completing creation work; Christ offers rest after completing redemption work; both are entrance into completed work",
    color: "from-blue-600 via-indigo-700 to-blue-800"
  },
  {
    event1Title: "Adam from Dust",
    event1Story: "The LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living being.",
    event1Reference: "Genesis 2:7",
    event2Title: "Last Adam Christ",
    event2Story: "Paul writes, 'The first man Adam became a living being. The last Adam became a life-giving spirit.' Christ is the second man from heaven who gives spiritual life.",
    event2Reference: "1 Cor 15:45-47",
    parallelKey: "First Adam brought natural life from dust; Last Adam brings spiritual life from heaven; one receives life, one gives life",
    color: "from-brown-600 via-amber-700 to-brown-800"
  },
  {
    event1Title: "Eve from Adam's Side",
    event1Story: "God caused a deep sleep to fall on Adam, and He took one of his ribs and closed up the flesh. From the rib God made woman and brought her to the man.",
    event1Reference: "Genesis 2:21-22",
    event2Title: "Church from Christ's Side",
    event2Story: "When Jesus died, a soldier pierced His side, and immediately blood and water came out. The church is born from Christ's wounded side, His bride formed while He 'slept' in death.",
    event2Reference: "John 19:34; Eph 5:25-27",
    parallelKey: "Bride formed from bridegroom's wounded side during sleep/death; both births require sacrifice and opening of the side",
    color: "from-rose-600 via-pink-700 to-rose-800"
  },

  // WATER THEMES
  {
    event1Title: "Elijah's Mantle Transfer",
    event1Story: "Elijah struck the waters of Jordan with his mantle, and they parted. After crossing, he was taken up to heaven, and his mantle fell to Elisha, who struck the Jordan again and the waters parted.",
    event1Reference: "2 Kings 2:8-14",
    event2Title: "Jesus' Baptism",
    event2Story: "Jesus came to the Jordan to be baptized by John. When He came up from the water, the Spirit descended upon Him like a dove, and a voice from heaven declared Him God's Son.",
    event2Reference: "Matthew 3:13-17",
    parallelKey: "Transfer of power and anointing at the Jordan River; the passing of authority from one to another with divine confirmation",
    color: "from-blue-600 via-cyan-700 to-blue-800"
  },
  {
    event1Title: "Noah's Ark Through Water",
    event1Story: "Noah, his family, and the animals entered the ark. God shut them in, and the flood waters covered the earth. The ark floated above the waters, and those inside were saved through water.",
    event1Reference: "Genesis 7:1-24",
    event2Title: "Baptism Saves Through Water",
    event2Story: "Peter writes, 'Eight souls were saved through water. There is also an antitype which now saves us—baptism (not the removal of filth but the answer of a good conscience toward God), through the resurrection of Jesus Christ.'",
    event2Reference: "1 Peter 3:20-21",
    parallelKey: "Few saved through water in a vessel; judgment waters become means of salvation; old world dies, new world begins",
    color: "from-cyan-600 via-blue-700 to-cyan-800"
  },
  {
    event1Title: "Red Sea Crossing",
    event1Story: "Moses stretched out his hand over the sea, and the LORD caused the sea to go back by a strong wind. The waters were divided, and Israel went through on dry ground with walls of water on both sides.",
    event1Reference: "Exodus 14:21-22",
    event2Title: "Baptism into Christ",
    event2Story: "Paul writes, 'All our fathers were under the cloud, all passed through the sea, all were baptized into Moses in the cloud and in the sea.' He parallels this to baptism into Christ's death and resurrection.",
    event2Reference: "1 Cor 10:1-2; Rom 6:3-4",
    parallelKey: "Passing through waters as escape from slavery; burial and resurrection through water; leaving old life for new",
    color: "from-teal-600 via-cyan-700 to-teal-800"
  },
  {
    event1Title: "Water from the Rock",
    event1Story: "The people complained for water in the wilderness. God told Moses to strike the rock at Horeb, and water came out for the people to drink.",
    event1Reference: "Exodus 17:6",
    event2Title: "Christ the Smitten Rock",
    event2Story: "Paul writes, 'They drank of that spiritual Rock that followed them, and that Rock was Christ.' Jesus promised living water to the woman at the well, saying it would become a fountain springing up to eternal life.",
    event2Reference: "1 Cor 10:4; John 4:14",
    parallelKey: "Rock smitten once provides living water; Christ struck once gives eternal life; water flows from the wounded rock",
    color: "from-stone-600 via-gray-700 to-stone-800"
  },
  {
    event1Title: "Jordan River Parted",
    event1Story: "When the priests' feet touched the Jordan, the waters were cut off. Those upstream stood in a heap, and Israel crossed over on dry ground into the Promised Land.",
    event1Reference: "Joshua 3:14-17",
    event2Title: "Death Conquered in Christ",
    event2Story: "Jesus descended into death (Jordan), and death could not hold Him. He rose victorious, opening the way for us to pass through death into the promised inheritance.",
    event2Reference: "Acts 2:24; Heb 2:14-15",
    parallelKey: "Waters of death held back; passage into promised inheritance; priests enter first to open the way for the people",
    color: "from-blue-600 via-indigo-700 to-blue-800"
  },

  // MOUNTAIN ENCOUNTERS
  {
    event1Title: "Isaac on Mount Moriah",
    event1Story: "Abraham took his only son Isaac to Mount Moriah to offer him as a sacrifice. Isaac carried the wood for the burnt offering up the mountain.",
    event1Reference: "Genesis 22:1-10",
    event2Title: "Jesus on Calvary",
    event2Story: "God gave His only begotten Son. Jesus carried His cross to Golgotha, where He was offered as a sacrifice for the sins of the world.",
    event2Reference: "John 3:16; 19:17",
    parallelKey: "A father offering his only beloved son on a mountain; the son carries the instrument of sacrifice; substitutionary provision",
    color: "from-amber-600 via-yellow-700 to-amber-800"
  },
  {
    event1Title: "Moses on Mount Sinai",
    event1Story: "Moses went up to God on Mount Sinai. The LORD descended in fire, and Moses received the law written by the finger of God on tablets of stone.",
    event1Reference: "Exodus 19:20; 31:18",
    event2Title: "Christ on Mount of Transfiguration",
    event2Story: "Jesus took Peter, James, and John up a high mountain. He was transfigured before them, His face shining like the sun. Moses and Elijah appeared, speaking of His coming exodus at Jerusalem.",
    event2Reference: "Matthew 17:1-5",
    parallelKey: "Mountain revelation of God's glory; Moses present at both; law given vs. law fulfilled; voice from heaven confirms God's choice",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },
  {
    event1Title: "Elijah on Mount Carmel",
    event1Story: "Elijah challenged the prophets of Baal on Mount Carmel. He rebuilt the altar of the LORD, prepared the sacrifice, poured water over it, and prayed. Fire fell from heaven consuming the sacrifice and the water.",
    event1Reference: "1 Kings 18:30-39",
    event2Title: "Jesus' Sacrifice Accepted",
    event2Story: "Jesus offered Himself as a sacrifice for sin. When He cried 'It is finished,' the veil was torn, the earth quaked, and graves opened—God's acceptance of the sacrifice was manifest.",
    event2Reference: "Matthew 27:50-54; Heb 9:14",
    parallelKey: "Sacrifice on altar consumed by divine fire; heaven's acceptance demonstrated; false worship defeated; people acknowledge 'Truly this was the Son of God'",
    color: "from-red-600 via-orange-700 to-red-800"
  },
  {
    event1Title: "Abraham Sees the Promised Seed",
    event1Story: "God brought Abraham outside and said, 'Look toward heaven and count the stars, if you are able. So shall your descendants be.' Abraham believed, and it was accounted to him for righteousness.",
    event1Reference: "Genesis 15:5-6",
    event2Title: "Christ the Promised Seed",
    event2Story: "Paul writes, 'He does not say, \"And to seeds,\" as of many, but as of one, \"And to your Seed,\" who is Christ.' The promise made to Abraham finds its fulfillment in Jesus.",
    event2Reference: "Galatians 3:16",
    parallelKey: "One promised Seed through whom all nations blessed; faith counted as righteousness; stars point to the Star of Jacob",
    color: "from-indigo-600 via-blue-700 to-indigo-800"
  },

  // SACRIFICE AND BLOOD
  {
    event1Title: "Passover Lamb",
    event1Story: "In Egypt, each household took a lamb without blemish, killed it at twilight, and put its blood on the doorposts. The destroyer passed over those houses, sparing the firstborn inside.",
    event1Reference: "Exodus 12:3-13",
    event2Title: "Christ Our Passover",
    event2Story: "John the Baptist declared Jesus 'the Lamb of God who takes away the sin of the world.' Paul wrote, 'Christ our Passover is sacrificed for us.'",
    event2Reference: "John 1:29; 1 Cor 5:7",
    parallelKey: "An unblemished lamb's blood provides protection from death; sacrifice at appointed time brings deliverance",
    color: "from-red-600 via-rose-700 to-red-800"
  },
  {
    event1Title: "Abel's Sacrifice Accepted",
    event1Story: "Abel brought firstlings of his flock and their fat. The LORD respected Abel and his offering. Cain's bloodless offering was rejected, but Abel's blood sacrifice was accepted.",
    event1Reference: "Genesis 4:4",
    event2Title: "Christ's Blood Speaks Better",
    event2Story: "Hebrews says, 'Jesus the Mediator of the new covenant, and to the blood of sprinkling that speaks better things than that of Abel.' Abel's blood cried for vengeance; Christ's blood speaks forgiveness.",
    event2Reference: "Hebrews 12:24",
    parallelKey: "Blood sacrifice accepted while bloodless rejected; Abel's blood cries out, Christ's blood answers; righteous blood shed by wicked",
    color: "from-red-600 via-crimson-700 to-red-800"
  },
  {
    event1Title: "Scapegoat Bears Sin",
    event1Story: "On the Day of Atonement, Aaron laid both hands on the live goat, confessed Israel's sins over it, and sent it into the wilderness. The goat carried away all their iniquities.",
    event1Reference: "Leviticus 16:21-22",
    event2Title: "Christ Bears Our Sins",
    event2Story: "Isaiah prophesied, 'The LORD has laid on Him the iniquity of us all.' Peter writes, 'He Himself bore our sins in His own body on the tree, that we, having died to sins, might live for righteousness.'",
    event2Reference: "Isaiah 53:6; 1 Peter 2:24",
    parallelKey: "Sins placed on substitute; carried away into wilderness/death; people freed from guilt; separation from camp/heaven",
    color: "from-gray-600 via-stone-700 to-gray-800"
  },
  {
    event1Title: "Day of Atonement Blood Ritual",
    event1Story: "The high priest took blood into the Most Holy Place once a year, sprinkling it on the mercy seat. No one else could enter. Without this blood, the people had no atonement.",
    event1Reference: "Leviticus 16:14-15",
    event2Title: "Christ Enters Heaven with Blood",
    event2Story: "Hebrews says Christ 'entered the Most Holy Place once for all, having obtained eternal redemption. For if the blood of bulls and goats sanctifies, how much more shall the blood of Christ cleanse your conscience?'",
    event2Reference: "Hebrews 9:12-14",
    parallelKey: "High priest enters with blood once a year vs. Christ enters once for all; animal blood vs. divine blood; temporary vs. eternal atonement",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },
  {
    event1Title: "Bronze Altar Sacrifice",
    event1Story: "Every morning and evening, a lamb was offered on the bronze altar. Fire burned continually, and the blood was poured at the base of the altar. This daily sacrifice covered the sins of Israel.",
    event1Reference: "Exodus 29:38-42",
    event2Title: "Christ the Continual Offering",
    event2Story: "Jesus offered Himself once for all. Hebrews says, 'By one offering He has perfected forever those who are being sanctified.' His sacrifice continues in efficacy eternally.",
    event2Reference: "Hebrews 10:14",
    parallelKey: "Daily repeated sacrifice vs. once-for-all sacrifice; temporary covering vs. permanent cleansing; animal blood vs. divine blood",
    color: "from-orange-600 via-red-700 to-orange-800"
  },

  // DELIVERERS AND SAVIORS
  {
    event1Title: "Joseph Saves from Famine",
    event1Story: "Joseph, betrayed by his brothers and sold for silver, was raised to Pharaoh's right hand. He saved Egypt and his family from famine, saying, 'You meant evil, but God meant it for good to save many people alive.'",
    event1Reference: "Genesis 45:5-8; 50:20",
    event2Title: "Jesus Saves from Sin",
    event2Story: "Jesus, betrayed for thirty pieces of silver, was raised to God's right hand. He saves the world from spiritual death. What was meant for evil, God used for salvation of the world.",
    event2Reference: "Acts 2:23-24; 5:31",
    parallelKey: "Rejected by brothers, exalted by Gentiles; sold for silver; suffering leads to salvation; right hand of power; saves many from death",
    color: "from-yellow-600 via-gold-700 to-yellow-800"
  },
  {
    event1Title: "Moses Delivers from Egypt",
    event1Story: "Moses, after forty years in Midian, returned to Egypt. Through signs and wonders, he led Israel out of bondage through the Red Sea into freedom.",
    event1Reference: "Exodus 3:10; 14:30",
    event2Title: "Jesus Delivers from Sin",
    event2Story: "Jesus, after forty days in the wilderness, began His ministry with signs and wonders. He leads us from slavery to sin through death and resurrection into freedom.",
    event2Reference: "Luke 4:14-21; Rom 6:6-7",
    parallelKey: "Forty period of testing; delivers from bondage through water; signs and wonders authenticate; freedom from slavery",
    color: "from-blue-600 via-cyan-700 to-blue-800"
  },
  {
    event1Title: "David Defeats Goliath",
    event1Story: "Young David, armed only with a sling and stones, defeated the giant Goliath who defied the armies of Israel. He struck him in the forehead and cut off his head with the giant's own sword.",
    event1Reference: "1 Samuel 17:41-51",
    event2Title: "Jesus Defeats Satan",
    event2Story: "Jesus, though tempted in the wilderness, defeated Satan with the Word of God. Through His death and resurrection, He crushed the serpent's head and triumphed over principalities and powers.",
    event2Reference: "Matthew 4:1-11; Col 2:15",
    parallelKey: "Unlikely champion defeats seemingly invincible enemy; victory secures deliverance for God's people; enemy's weapon turned against him",
    color: "from-indigo-600 via-blue-700 to-indigo-800"
  },
  {
    event1Title: "Nehemiah Rebuilds the Walls",
    event1Story: "Nehemiah returned to rebuild Jerusalem's broken walls. Despite opposition and mockery, he rallied the people, saying, 'Let us rise up and build.' In fifty-two days the wall was complete.",
    event1Reference: "Nehemiah 2:17-20; 6:15",
    event2Title: "Jesus Rebuilds the Temple",
    event2Story: "Jesus said, 'Destroy this temple, and in three days I will raise it up.' He spoke of His body. Through His death and resurrection, He rebuilds God's dwelling place—the church.",
    event2Reference: "John 2:19-21; 1 Cor 3:16",
    parallelKey: "Rebuilding after destruction; opposition and mockery; completed in miraculous time; establishes God's dwelling with His people",
    color: "from-stone-600 via-gray-700 to-stone-800"
  },
  {
    event1Title: "Joshua Enters the Promised Land",
    event1Story: "After forty years in the wilderness, Joshua led Israel across Jordan into Canaan. He conquered Jericho and gave each tribe their inheritance in the land of rest.",
    event1Reference: "Joshua 1:1-6; 21:43-45",
    event2Title: "Jesus Gives Eternal Inheritance",
    event2Story: "Jesus (Greek form of Joshua) leads us through death into our heavenly inheritance. Hebrews says, 'If Joshua had given them rest, God would not afterward have spoken of another day.' Jesus gives true rest.",
    event2Reference: "Hebrews 4:8-9; 1 Peter 1:3-4",
    parallelKey: "Same name (Joshua/Jesus); leads into promised rest; conquers enemies; divides inheritance; forty-year connection",
    color: "from-green-600 via-emerald-700 to-green-800"
  },

  // PROPHETIC SIGNS
  {
    event1Title: "Jonah in the Fish",
    event1Story: "Jonah was swallowed by a great fish and remained in its belly three days and three nights before being vomited out alive onto dry land.",
    event1Reference: "Jonah 1:17, 2:10",
    event2Title: "Jesus' Resurrection",
    event2Story: "Jesus said the only sign He would give was the sign of Jonah: as Jonah was three days and nights in the belly of the fish, so would the Son of Man be three days and nights in the heart of the earth.",
    event2Reference: "Matthew 12:39-40",
    parallelKey: "Three days in darkness/death followed by miraculous emergence to life; both are signs pointing to God's deliverance",
    color: "from-emerald-600 via-green-700 to-emerald-800"
  },
  {
    event1Title: "Moses Lifted Up the Serpent",
    event1Story: "When fiery serpents bit the Israelites in the wilderness, Moses made a bronze serpent and lifted it up on a pole. Whoever looked at it lived.",
    event1Reference: "Numbers 21:8-9",
    event2Title: "Jesus Lifted Up on the Cross",
    event2Story: "Jesus told Nicodemus that as Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up, that whoever believes in Him should have eternal life.",
    event2Reference: "John 3:14-15",
    parallelKey: "Both involve being lifted up as the means of salvation from death; looking/believing brings life",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },
  {
    event1Title: "Elijah Taken to Heaven",
    event1Story: "Elijah was taken up to heaven in a whirlwind by a chariot of fire. Elisha saw it and cried, 'My father, my father, the chariot of Israel and its horsemen!' Elijah did not see death.",
    event1Reference: "2 Kings 2:11-12",
    event2Title: "Jesus Ascends to Heaven",
    event2Story: "Jesus was taken up into heaven, and a cloud received Him. The disciples looked steadfastly toward heaven as He went up. Two angels said, 'This same Jesus will come in like manner as you saw Him go.'",
    event2Reference: "Acts 1:9-11",
    parallelKey: "Bodily ascension to heaven; disciples witness departure; fiery/cloud presence; chariots/angels attend; return promised",
    color: "from-sky-600 via-blue-700 to-sky-800"
  },
  {
    event1Title: "Daniel in the Lions' Den",
    event1Story: "Daniel was cast into the lions' den, and a stone was laid on the mouth of the den and sealed. God sent His angel and shut the lions' mouths. Daniel was taken up out of the den, and no injury was found on him.",
    event1Reference: "Daniel 6:16-23",
    event2Title: "Jesus in the Tomb",
    event2Story: "Jesus was laid in a tomb, and a great stone was rolled against the door of the tomb, and it was sealed with a Roman seal. On the third day, God raised Him, and death could not hold Him.",
    event2Reference: "Matthew 27:60-66; 28:2-6",
    parallelKey: "Sealed in a place of death; enemies confident he's finished; God intervenes; brought out alive; stone moved; unharmed by death",
    color: "from-amber-600 via-orange-700 to-amber-800"
  },
  {
    event1Title: "Shadrach, Meshach, and Abednego",
    event1Story: "Three Hebrew men refused to bow to Nebuchadnezzar's golden image. They were thrown into a furnace heated seven times hotter. A fourth person appeared with them in the fire—'like the Son of God'—and they came out unharmed.",
    event1Reference: "Daniel 3:19-27",
    event2Title: "Jesus Endures God's Fire",
    event2Story: "Jesus faced the fire of God's wrath for sin. Isaiah prophesied, 'It pleased the LORD to bruise Him.' Though overwhelmed by judgment, He emerged victorious, and now stands at God's right hand.",
    event2Reference: "Isaiah 53:10; Acts 2:24",
    parallelKey: "Thrown into fire of judgment; fourth person present (Son of God); emerge unharmed; enemies confounded; God's deliverance",
    color: "from-orange-600 via-red-700 to-orange-800"
  },

  // SANCTUARY TYPOLOGY
  {
    event1Title: "Tabernacle Veil Separates",
    event1Story: "A thick veil separated the Holy Place from the Most Holy Place. Only the high priest could pass through once a year. The veil blocked access to God's immediate presence.",
    event1Reference: "Exodus 26:33; Heb 9:7",
    event2Title: "Temple Veil Torn",
    event2Story: "When Jesus died, the veil of the temple was torn in two from top to bottom. Access to God was opened. Now we can boldly enter the Most Holy Place by the blood of Jesus.",
    event2Reference: "Matthew 27:51; Heb 10:19-20",
    parallelKey: "Veil blocks access vs. veil torn opens access; human hands cannot tear it (torn from top); Christ's body is the veil",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },
  {
    event1Title: "Lampstand Gives Light",
    event1Story: "The golden lampstand with seven lamps burned continually in the Holy Place, giving light. It was beaten from one piece of gold and had to be tended daily by the priests.",
    event1Reference: "Exodus 25:31-37; 27:20",
    event2Title: "Christ the Light Shines",
    event2Story: "Jesus said, 'I am the light of the world.' John writes, 'In Him was life, and the life was the light of men.' The church, filled with the Spirit, becomes lampstands bearing His light.",
    event2Reference: "John 8:12; Rev 1:20",
    parallelKey: "Seven-fold perfect light; beaten gold/suffering Messiah; continual presence; priests/believers tend it; illuminates holy place/church",
    color: "from-yellow-600 via-gold-700 to-yellow-800"
  },
  {
    event1Title: "Table of Showbread",
    event1Story: "Twelve loaves of bread were placed on the golden table in the Holy Place every Sabbath. The bread was called 'the Bread of the Presence' and was eaten only by the priests.",
    event1Reference: "Exodus 25:23-30; Lev 24:5-9",
    event2Title: "Christ the Bread of Life",
    event2Story: "Jesus declared, 'I am the bread of life. He who comes to Me shall never hunger.' He broke bread saying, 'This is My body which is given for you; do this in remembrance of Me.'",
    event2Reference: "John 6:35; Luke 22:19",
    parallelKey: "Twelve loaves/twelve tribes fed; continual presence; priests eat/believers commune; Sabbath renewal/Lord's Supper remembrance",
    color: "from-amber-600 via-yellow-700 to-amber-800"
  },
  {
    event1Title: "Altar of Incense Prayers",
    event1Story: "The golden altar of incense stood before the veil. Aaron burned fragrant incense on it every morning and evening. The smoke ascended continually before the Lord.",
    event1Reference: "Exodus 30:7-8",
    event2Title: "Christ Our Intercessor",
    event2Story: "Revelation shows the golden altar before God's throne where the prayers of the saints ascend as incense. Christ lives forever to make intercession, standing at God's right hand.",
    event2Reference: "Revelation 8:3-4; Heb 7:25",
    parallelKey: "Prayers ascend as fragrant incense; golden altar before throne; continual intercession; mediator stands between God and people",
    color: "from-gold-600 via-amber-700 to-gold-800"
  },
  {
    event1Title: "Ark of the Covenant Contains Law",
    event1Story: "The Ark of the Covenant contained the tablets of the law, Aaron's rod that budded, and a pot of manna. The mercy seat covered the ark, and God's presence dwelt between the cherubim.",
    event1Reference: "Hebrews 9:4; Exodus 25:21-22",
    event2Title: "Christ Contains All Truth",
    event2Story: "In Christ are hidden 'all the treasures of wisdom and knowledge.' The law is fulfilled in Him, His resurrection life is in Him (rod), and He is the true manna. God's throne of grace is in Christ.",
    event2Reference: "Colossians 2:3; Heb 4:16",
    parallelKey: "Law written within; life from death (rod budded); heavenly bread; mercy seat covers judgment; God's presence dwells",
    color: "from-gold-600 via-yellow-700 to-gold-800"
  },

  // COVENANT PATTERNS
  {
    event1Title: "Rainbow Covenant with Noah",
    event1Story: "After the flood, God set His rainbow in the cloud as a sign of covenant, promising never again to destroy the earth with water. The bow appears when clouds come over the earth.",
    event1Reference: "Genesis 9:12-16",
    event2Title: "Christ the Rainbow Around Throne",
    event2Story: "John sees 'a rainbow around the throne, in appearance like an emerald.' The rainbow signifies God's mercy toward a fallen world, made possible through Christ's sacrifice.",
    event2Reference: "Revelation 4:3",
    parallelKey: "Sign of covenant mercy after judgment; appears in clouds/heaven; promise of no destroying flood/no condemnation in Christ",
    color: "from-emerald-600 via-green-700 to-emerald-800"
  },
  {
    event1Title: "Circumcision Covenant Sign",
    event1Story: "God made covenant with Abraham, saying, 'Every male among you shall be circumcised. It shall be a sign of the covenant between Me and you.' The flesh was cut away on the eighth day.",
    event1Reference: "Genesis 17:10-11",
    event2Title: "Circumcision of the Heart",
    event2Story: "Paul writes, 'He is a Jew who is one inwardly; and circumcision is that of the heart, in the Spirit.' We are 'circumcised with the circumcision made without hands, by putting off the body of sins, the circumcision of Christ.'",
    event2Reference: "Romans 2:29; Colossians 2:11",
    parallelKey: "Cutting away flesh vs. cutting away sinful nature; eighth day/resurrection day; outward sign vs. inward reality; covenant identity",
    color: "from-red-600 via-rose-700 to-red-800"
  },
  {
    event1Title: "Moses Sprinkles Blood of Covenant",
    event1Story: "Moses took the blood and sprinkled it on the people, saying, 'This is the blood of the covenant which the LORD has made with you according to all these words.'",
    event1Reference: "Exodus 24:8",
    event2Title: "Jesus Institutes New Covenant",
    event2Story: "Jesus took the cup, saying, 'This cup is the new covenant in My blood, which is shed for you.' The writer of Hebrews calls it 'the blood of the everlasting covenant.'",
    event2Reference: "Luke 22:20; Heb 13:20",
    parallelKey: "Blood seals covenant; old covenant at Sinai/new covenant at Calvary; temporary ratification/eternal confirmation",
    color: "from-red-600 via-crimson-700 to-red-800"
  },
  {
    event1Title: "Sabbath Sign of Covenant",
    event1Story: "God said, 'The children of Israel shall keep the Sabbath throughout their generations, as a perpetual covenant. It is a sign between Me and the children of Israel forever.'",
    event1Reference: "Exodus 31:16-17",
    event2Title: "Christ Our Sabbath Rest",
    event2Story: "Jesus said, 'Come to Me, all you who labor, and I will give you rest.' Hebrews says, 'There remains therefore a rest (Sabbath-rest) for the people of God. For he who has entered His rest has ceased from his works.'",
    event2Reference: "Matthew 11:28; Hebrews 4:9-10",
    parallelKey: "Sign of covenant relationship; ceasing from works; God's rest given; perpetual vs. fulfilled in Christ; weekly reminder/eternal reality",
    color: "from-blue-600 via-indigo-700 to-blue-800"
  },

  // BREAD AND PROVISION
  {
    event1Title: "Manna from Heaven",
    event1Story: "God provided bread from heaven each morning for Israel in the wilderness. The people gathered it daily, and it sustained them for forty years.",
    event1Reference: "Exodus 16:4-35",
    event2Title: "Jesus the Bread of Life",
    event2Story: "Jesus declared, 'I am the bread of life. Your fathers ate manna in the wilderness and died, but I am the living bread that came down from heaven. Whoever eats this bread will live forever.'",
    event2Reference: "John 6:48-51",
    parallelKey: "Both are bread from heaven that sustains life; daily dependence required; points to eternal life through Christ",
    color: "from-orange-600 via-amber-700 to-orange-800"
  },
  {
    event1Title: "Elijah Fed by Ravens",
    event1Story: "God commanded ravens to feed Elijah by the brook Cherith. Morning and evening they brought him bread and meat, and he drank from the brook.",
    event1Reference: "1 Kings 17:4-6",
    event2Title: "Jesus Fed in Wilderness",
    event2Story: "After forty days of fasting and resisting Satan, angels came and ministered to Jesus. God provided for His Son in the wilderness just as He provided for Elijah.",
    event2Reference: "Matthew 4:11",
    parallelKey: "God provides food in wilderness; miraculous sustenance; morning and evening/continual care; sustained during testing",
    color: "from-brown-600 via-amber-700 to-brown-800"
  },
  {
    event1Title: "Elisha Multiplies Bread",
    event1Story: "A man brought Elisha twenty barley loaves. Elisha said, 'Give it to the people that they may eat.' His servant protested, but Elisha insisted. They all ate, and there were leftovers, according to God's word.",
    event1Reference: "2 Kings 4:42-44",
    event2Title: "Jesus Feeds Five Thousand",
    event2Story: "Jesus took five barley loaves and two fish, blessed them, and fed five thousand men plus women and children. Twelve baskets of fragments remained—more than they started with.",
    event2Reference: "John 6:9-13",
    parallelKey: "Barley loaves multiplied; few fed many; leftovers exceed the start; servant doubts/disciples doubt; God's word guarantees provision",
    color: "from-wheat-600 via-amber-700 to-wheat-800"
  },
  {
    event1Title: "Widow's Oil Multiplied",
    event1Story: "A widow in debt cried to Elisha. He told her to gather empty vessels and pour from her one jar of oil. The oil continued flowing until all vessels were full, then it stopped. She sold it and paid her debts.",
    event1Reference: "2 Kings 4:1-7",
    event2Title: "Spirit Poured Out Abundantly",
    event2Story: "Peter preached, 'Repent, and let every one of you be baptized in the name of Jesus Christ, and you shall receive the gift of the Holy Spirit. For the promise is to you and to your children, and to all who are afar off.'",
    event2Reference: "Acts 2:38-39",
    parallelKey: "Little oil/small beginnings; multiplied to fill all vessels; debt paid/sin's debt paid; stops when all are filled/each receives measure",
    color: "from-olive-600 via-yellow-700 to-olive-800"
  },

  // JUDGMENT AND SCATTERING
  {
    event1Title: "Tower of Babel Scattered",
    event1Story: "At Babel, God confused the languages of mankind, and they were scattered across the earth, unable to understand one another.",
    event1Reference: "Genesis 11:1-9",
    event2Title: "Pentecost Gathered",
    event2Story: "At Pentecost, the Holy Spirit came upon the disciples, and they spoke in various languages. People from every nation heard the gospel in their own tongue and were united in Christ.",
    event2Reference: "Acts 2:1-11",
    parallelKey: "Division of languages reversed; scattering becomes gathering; human pride judged vs. divine grace uniting; Babel divided, Pentecost united",
    color: "from-pink-600 via-rose-700 to-pink-800"
  },
  {
    event1Title: "Sodom and Gomorrah Destroyed",
    event1Story: "The LORD rained brimstone and fire on Sodom and Gomorrah from heaven. Lot and his daughters escaped, but his wife looked back and became a pillar of salt. The cities were utterly destroyed.",
    event1Reference: "Genesis 19:24-26",
    event2Title: "Final Judgment by Fire",
    event2Story: "Peter writes, 'The heavens and the earth which are now preserved by the same word, are reserved for fire until the day of judgment and perdition of ungodly men.' Jesus warned, 'Remember Lot's wife.'",
    event2Reference: "2 Peter 3:7; Luke 17:32",
    parallelKey: "Fire from heaven destroys wicked; righteous barely escape; looking back brings loss; total destruction; warning for last days",
    color: "from-red-600 via-orange-700 to-red-800"
  },
  {
    event1Title: "Israel Scattered for Disobedience",
    event1Story: "Moses warned Israel, 'The LORD will scatter you among all peoples, from one end of the earth to the other.' Because of covenant breaking, they were exiled to Babylon and dispersed among nations.",
    event1Reference: "Deuteronomy 28:64; 2 Kings 25:21",
    event2Title: "Church Scattered, Gospel Spreads",
    event2Story: "After Stephen's martyrdom, persecution scattered the church throughout Judea and Samaria. 'Those who were scattered went everywhere preaching the word.' Judgment became opportunity for gospel spread.",
    event2Reference: "Acts 8:1-4",
    parallelKey: "Scattering as judgment/opportunity; diaspora spreads message; exile leads to witness; ends of earth reached through dispersion",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },

  // HEALING AND RESTORATION
  {
    event1Title: "Naaman Washed Seven Times",
    event1Story: "Naaman the leper came to Elisha. The prophet told him, 'Go and wash in the Jordan seven times, and your flesh shall be restored to you, and you shall be clean.' He obeyed and was healed.",
    event1Reference: "2 Kings 5:10-14",
    event2Title: "Jesus Cleanses Lepers",
    event2Story: "Ten lepers cried to Jesus for mercy. He said, 'Go, show yourselves to the priests.' As they went, they were cleansed. One returned to give thanks, and Jesus said, 'Your faith has made you well.'",
    event2Reference: "Luke 17:12-19",
    parallelKey: "Healing of leprosy (type of sin); cleansing through water/obedience; restoration to community; faith required; go and show yourselves",
    color: "from-cyan-600 via-blue-700 to-cyan-800"
  },
  {
    event1Title: "Blind Man's Eyes Opened",
    event1Story: "Jesus spat on the ground, made clay, and anointed the blind man's eyes. He said, 'Go, wash in the pool of Siloam.' The man went, washed, and came back seeing.",
    event1Reference: "John 9:6-7",
    event2Title: "Spiritual Eyes Opened",
    event2Story: "Paul prayed 'that the eyes of your understanding being enlightened; that you may know what is the hope of His calling.' The natural man is blind to spiritual things until God opens his eyes.",
    event2Reference: "Ephesians 1:18; 2 Cor 4:4",
    parallelKey: "Blindness healed through water/Word; clay (creation) and spit (Word); Siloam means 'sent' (Christ sent); physical/spiritual sight",
    color: "from-blue-600 via-indigo-700 to-blue-800"
  },
  {
    event1Title: "Elisha Restores Widow's Son",
    event1Story: "The widow's son died. Elisha went up, shut the door, prayed, and stretched himself upon the child. The child's flesh became warm, he sneezed seven times, and his eyes opened. Life returned.",
    event1Reference: "2 Kings 4:32-35",
    event2Title: "Jesus Raises Widow's Son",
    event2Story: "Jesus met a funeral procession. The only son of a widow had died. Jesus had compassion, touched the coffin, and said, 'Young man, I say to you, arise.' The dead man sat up and began to speak.",
    event2Reference: "Luke 7:12-15",
    parallelKey: "Widow's only son dies; prophet/Messiah intervenes with compassion; physical contact with dead; life restored; seven (completeness) involved",
    color: "from-green-600 via-emerald-700 to-green-800"
  },
  {
    event1Title: "Hezekiah's Life Extended",
    event1Story: "Hezekiah became sick unto death. He prayed and wept. God sent Isaiah saying, 'I have heard your prayer, I have seen your tears; I will add to your days fifteen years.' The sign: the sundial's shadow moved backward.",
    event1Reference: "2 Kings 20:1-11",
    event2Title: "Lazarus Raised After Four Days",
    event2Story: "Lazarus died and was buried four days. Jesus wept at the tomb, then commanded, 'Lazarus, come forth!' The dead man came out bound in grave clothes. Jesus said, 'Loose him, and let him go.'",
    event2Reference: "John 11:38-44",
    parallelKey: "Death sentence reversed; tears move God to act; time reversed/death reversed; supernatural sign; life extended as testimony",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },

  // KINGSHIP THEMES
  {
    event1Title: "David Anointed by Samuel",
    event1Story: "Samuel took the horn of oil and anointed David in the midst of his brothers. The Spirit of the LORD came upon David from that day forward. He was chosen from among his brothers.",
    event1Reference: "1 Samuel 16:13",
    event2Title: "Jesus Anointed by the Spirit",
    event2Story: "At Jesus' baptism, the Spirit descended like a dove and remained on Him. God said, 'This is My beloved Son, in whom I am well pleased.' Peter preached, 'God anointed Jesus of Nazareth with the Holy Spirit and with power.'",
    event2Reference: "Matthew 3:16-17; Acts 10:38",
    parallelKey: "Anointing with oil/Spirit; youngest brother/humble origin; chosen by God not man; Spirit comes and remains; begins public ministry",
    color: "from-gold-600 via-yellow-700 to-gold-800"
  },
  {
    event1Title: "David Rejected Before Reigning",
    event1Story: "Though anointed, David was rejected by Saul and hunted in the wilderness. His own people tried to hand him over. He became king only after years of suffering and rejection.",
    event1Reference: "1 Samuel 19-31",
    event2Title: "Jesus Rejected Before Glory",
    event2Story: "John writes, 'He came to His own, and His own did not receive Him.' Jesus was rejected by His people, hunted by authorities, and handed over to die. He entered glory through suffering.",
    event2Reference: "John 1:11; Heb 2:10",
    parallelKey: "Anointed but rejected; hunted in wilderness; own people betray; suffering precedes reign; faithful few follow; vindicated in end",
    color: "from-blue-600 via-indigo-700 to-blue-800"
  },
  {
    event1Title: "Solomon Builds the Temple",
    event1Story: "Solomon built the house of the LORD. When it was finished, the glory of the LORD filled the temple. The cloud was so thick the priests could not minister. God's promise to David was fulfilled.",
    event1Reference: "1 Kings 8:10-11",
    event2Title: "Jesus Builds the Church",
    event2Story: "Jesus said, 'On this rock I will build My church, and the gates of Hades shall not prevail against it.' At Pentecost, the Spirit filled the believers. They became the temple of God.",
    event2Reference: "Matthew 16:18; Acts 2:4; 1 Cor 3:16",
    parallelKey: "Son of David builds temple; glory fills the house; God dwells with His people; promise fulfilled; eternal structure established",
    color: "from-purple-600 via-gold-700 to-purple-800"
  },
  {
    event1Title: "Solomon's Wisdom and Wealth",
    event1Story: "God gave Solomon wisdom and understanding exceedingly great. His wisdom exceeded all the kings of the earth. Gold was abundant, and the Queen of Sheba came to hear his wisdom, saying, 'The half was not told me.'",
    event1Reference: "1 Kings 4:29-34; 10:1-7",
    event2Title: "Christ Greater Than Solomon",
    event2Story: "Jesus said, 'A greater than Solomon is here.' He is 'the wisdom of God' in whom 'are hidden all the treasures of wisdom and knowledge.' Nations will come to His light.",
    event2Reference: "Matthew 12:42; 1 Cor 1:24; Col 2:3",
    parallelKey: "Unsurpassable wisdom; wealth beyond measure; nations come seeking; fame spreads worldwide; even glory was a shadow of Christ's",
    color: "from-gold-600 via-amber-700 to-gold-800"
  },

  // FORTY-DAY/YEAR PATTERNS
  {
    event1Title: "Moses Forty Days on Mountain",
    event1Story: "Moses was on Mount Sinai forty days and forty nights. He did not eat bread or drink water. God wrote the Ten Commandments with His finger on tablets of stone.",
    event1Reference: "Exodus 34:28",
    event2Title: "Jesus Forty Days in Wilderness",
    event2Story: "Jesus was led by the Spirit into the wilderness and fasted forty days and forty nights. He was tempted by Satan but overcame every temptation by the Word of God.",
    event2Reference: "Matthew 4:1-2",
    parallelKey: "Forty days of testing; fasting without food; receiving/defending God's Word; mountain/wilderness; preparation for ministry",
    color: "from-brown-600 via-stone-700 to-brown-800"
  },
  {
    event1Title: "Elijah Forty Days to Horeb",
    event1Story: "Elijah fled into the wilderness, sat under a juniper tree, and prayed to die. An angel fed him, and in the strength of that food he went forty days and forty nights to Horeb, the mountain of God.",
    event1Reference: "1 Kings 19:4-8",
    event2Title: "Jesus Strengthened by Angels",
    event2Story: "After Jesus fasted forty days and defeated Satan's temptations, angels came and ministered to Him. His journey through testing prepared Him for His mission, just as Elijah's prepared him.",
    event2Reference: "Matthew 4:11",
    parallelKey: "Forty days of testing; angelic provision; journey to meet God; preparation for prophetic ministry; sustained by divine food",
    color: "from-desert-600 via-sand-700 to-desert-800"
  },
  {
    event1Title: "Israel Forty Years in Wilderness",
    event1Story: "Israel wandered forty years in the wilderness because of unbelief. The generation that doubted died, but their children entered the Promised Land. The wilderness tested and humbled them.",
    event1Reference: "Numbers 14:33-34; Deut 8:2",
    event2Title: "Church's Wilderness Journey",
    event2Story: "Paul writes, 'These things happened to them as examples and were written for our admonition.' The church journeys through this world toward the heavenly Canaan, tested and refined.",
    event2Reference: "1 Corinthians 10:11; Heb 11:13-16",
    parallelKey: "Forty-period testing; unbelief excludes/faith enters; wilderness preparation; old generation dies/new enters promise; daily manna/daily grace",
    color: "from-sand-600 via-desert-700 to-sand-800"
  },
  {
    event1Title: "Spies Scout Land Forty Days",
    event1Story: "Twelve spies explored Canaan forty days. Ten brought an evil report of giants, spreading fear. Only Joshua and Caleb believed God could give them the land. The people refused to enter.",
    event1Reference: "Numbers 13:25-14:9",
    event2Title: "Jesus Appears Forty Days After Resurrection",
    event2Story: "Jesus appeared to His disciples over forty days after His resurrection, speaking of the kingdom of God. He sent them to 'spy out' the world, promising to be with them as they took the gospel to all nations.",
    event2Reference: "Acts 1:3; Matthew 28:19-20",
    parallelKey: "Forty-day period before mission; land to conquer; fear vs. faith; few believe/many doubt; commission to enter and possess",
    color: "from-green-600 via-olive-700 to-green-800"
  }
];


export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Shuffle and select parallels for the game
    const shuffled = [...PARALLEL_PAIRS].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffled.slice(0, 6);

    const gameCards: GameCard[] = selectedPairs.map((pair, index) => ({
      id: `parallel-${index}`,
      event1Title: pair.event1Title,
      event1Story: pair.event1Story,
      event1Reference: pair.event1Reference,
      event2Title: pair.event2Title,
      event2Story: pair.event2Story,
      event2Reference: pair.event2Reference,
      parallelKey: pair.parallelKey,
      color: pair.color,
      isFlipped: false,
      isCompleted: false,
      userAnswer: '',
      isValidating: false,
    }));

    setCards(gameCards);
    setCurrentCardIndex(0);
    setCompletedCount(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c
    ));
  };

  const handleAnswerChange = (cardId: string, answer: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, userAnswer: answer } : c
    ));
  };

  const handleSubmitAnswer = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || !card.userAnswer.trim()) {
      toast.error("Please write your answer first");
      return;
    }

    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isValidating: true } : c
    ));

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          event1: `${card.event1Title}: ${card.event1Story} (${card.event1Reference})`,
          event2: `${card.event2Title}: ${card.event2Story} (${card.event2Reference})`,
          parallelKey: card.parallelKey,
          userAnswer: card.userAnswer,
          validationType: 'parallel'
        }
      });

      if (error) throw error;

      const { isCorrect, feedback } = data;

      if (isCorrect) {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, isCompleted: true, isValidating: false } : c
        ));
        setCompletedCount(prev => prev + 1);
        toast.success(feedback || "Excellent! You identified the parallel!");
        
        // Check if game is won
        if (completedCount + 1 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, isValidating: false } : c
        ));
        toast.error(feedback || "Look deeper! How do these events mirror each other?");
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isValidating: false } : c
      ));
      toast.error("Failed to validate your answer. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
          `
        }} />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/games")}
              className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-1" style={{ 
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255,215,0,0.5)"
              }}>
                PARALLELS MATCH
              </h1>
              <p className="text-sm text-amber-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Discover Biblical Echoes Across Time
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={initializeGame}
              className="gap-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex justify-center gap-12 mb-10">
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-amber-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-amber-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Completed</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                {completedCount}<span className="text-2xl text-amber-500/50">/{cards.length}</span>
              </p>
            </div>
          </div>
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-blue-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Progress</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {cards.length > 0 ? Math.round((completedCount / cards.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {cards.map((card) => {
            
            return (
              <div
                key={card.id}
                className="aspect-[2/3] transition-all duration-500"
                style={{ perspective: "1500px" }}
              >
                <div
                  className={`relative w-full h-full transition-all duration-700 ${
                    card.isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Front - First Event */}
                  <div
                    onClick={() => !card.isCompleted && handleCardClick(card.id)}
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br ${card.color} border-4 border-amber-500/50 shadow-2xl flex flex-col overflow-hidden ${
                      !card.isCompleted ? 'cursor-pointer hover:border-amber-400 hover:scale-[1.02] transition-transform' : 'opacity-90'
                    }`}
                    style={{ 
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="relative flex-1 flex flex-col p-6">
                      {/* Event Title */}
                      <div className="text-center mb-4">
                        <h3 className="text-amber-100 font-bold text-lg mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                          {card.event1Title}
                        </h3>
                        <p className="text-amber-300/90 text-xs" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {card.event1Reference}
                        </p>
                      </div>

                      {/* Event Story */}
                      <div className="flex-1 flex items-center justify-center mb-4">
                        <div className="bg-black/30 rounded-lg p-4 border border-amber-400/30 backdrop-blur-sm">
                          <p className="text-white text-sm leading-relaxed" style={{ 
                            fontFamily: "'Cormorant Garamond', serif"
                          }}>
                            {card.event1Story}
                          </p>
                        </div>
                      </div>

                      {/* Instruction */}
                      <div className="text-center">
                        <p className="text-amber-200 text-sm font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                          {card.isCompleted ? '✓ Matched!' : 'CLICK TO FIND THE PARALLEL →'}
                        </p>
                      </div>

                      {/* Completion Badge */}
                      {card.isCompleted && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-10 h-10 text-amber-400 drop-shadow-2xl animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Back - Second Event & Input */}
                  <div
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-cyan-500/50 shadow-2xl flex flex-col overflow-hidden`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Top Banner */}
                    <div className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 px-3 py-2 shadow-lg">
                      <h3 className="relative text-center font-black text-gray-900 text-xs uppercase tracking-wide" style={{
                        fontFamily: "'Cinzel', serif",
                        textShadow: "1px 1px 2px rgba(255,255,255,0.5)"
                      }}>
                        Find the Parallel
                      </h3>
                    </div>
                    
                    {/* Second Event */}
                    <div className="p-4 border-b border-cyan-500/30">
                      <h4 className="text-cyan-300 font-bold text-sm mb-1 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                        {card.event2Title}
                      </h4>
                      <p className="text-cyan-400/80 text-xs mb-2 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {card.event2Reference}
                      </p>
                      <div className="bg-black/40 rounded-lg p-3 border border-cyan-500/20">
                        <p className="text-cyan-100 text-xs leading-relaxed" style={{ 
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                          {card.event2Story}
                        </p>
                      </div>
                    </div>
                    
                    {/* Answer Input */}
                    <div className="flex-1 p-4 flex flex-col">
                      <label className="text-amber-300 text-xs font-semibold mb-2 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                        How do these events parallel each other?
                      </label>
                      <Textarea
                        value={card.userAnswer}
                        onChange={(e) => handleAnswerChange(card.id, e.target.value)}
                        placeholder="Explain the connection between these two events..."
                        className="flex-1 bg-black/50 border-cyan-500/30 text-white text-xs mb-3 resize-none"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        disabled={card.isCompleted || card.isValidating}
                      />
                      <Button
                        onClick={() => handleSubmitAnswer(card.id)}
                        disabled={card.isCompleted || card.isValidating || !card.userAnswer.trim()}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold"
                        size="sm"
                      >
                        {card.isValidating ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Checking...
                          </>
                        ) : card.isCompleted ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory Message */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <Card className="max-w-lg mx-4 p-10 text-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-4 border-amber-500 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-3xl" />
                <div className="relative">
                  <div className="inline-block relative mb-6">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse" />
                    <Trophy className="relative w-24 h-24 text-yellow-500 drop-shadow-2xl animate-bounce" />
                  </div>
                  
                  <h2 className="text-5xl font-black mb-4" style={{
                    fontFamily: "'Cinzel', serif",
                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 30px rgba(255,215,0,0.5)"
                  }}>
                    VICTORY! 🎉
                  </h2>
                  
                  <p className="text-xl text-amber-200 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    You matched all {cards.length} biblical parallels!
                  </p>
                  
                  <p className="text-sm text-amber-300/80 mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "Scripture echoes Scripture - Christ is the fulfillment of all things"
                  </p>
                  
                  <Button 
                    onClick={initializeGame} 
                    className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-bold text-lg px-8 py-6 shadow-2xl border-2 border-amber-300"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    NEW CHALLENGE
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
