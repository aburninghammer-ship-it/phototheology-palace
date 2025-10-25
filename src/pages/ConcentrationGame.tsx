import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, RotateCcw, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ParallelPair {
  id: string;
  oldTestament: {
    event: string;
    reference: string;
    description: string;
  };
  newTestament: {
    event: string;
    reference: string;
    description: string;
  };
  category: string;
}

const PARALLEL_PAIRS: ParallelPair[] = [
  // Existing 16 parallels
  { id: "1", category: "Transition of Power", oldTestament: { event: "Moses to Joshua", reference: "Joshua 1:1-9", description: "Moses dies, Joshua appointed to lead Israel into Promised Land" }, newTestament: { event: "John Baptist to Jesus", reference: "John 3:30", description: "John: 'He must increase, I must decrease' - transition at Jordan" }},
  { id: "2", category: "Sacrificial Lamb", oldTestament: { event: "Isaac Bound", reference: "Genesis 22:8", description: "Abraham binds Isaac; God provides ram as substitute" }, newTestament: { event: "Jesus Crucified", reference: "John 1:29", description: "Behold the Lamb of God who takes away sin" }},
  { id: "3", category: "Exodus from Bondage", oldTestament: { event: "Red Sea Crossing", reference: "Exodus 14:21-22", description: "Israel passes through water, escaping Egyptian slavery" }, newTestament: { event: "Baptism", reference: "Romans 6:3-4", description: "Buried with Christ in baptism, raised to new life" }},
  { id: "4", category: "Wilderness Testing", oldTestament: { event: "Israel 40 Years", reference: "Deuteronomy 8:2", description: "Israel tested in wilderness 40 years, failed repeatedly" }, newTestament: { event: "Jesus 40 Days", reference: "Matthew 4:1-11", description: "Jesus tempted 40 days in wilderness, remained faithful" }},
  { id: "5", category: "Rejected Stone", oldTestament: { event: "David Rejected", reference: "1 Samuel 16:7", description: "David, youngest son, rejected by men but chosen by God" }, newTestament: { event: "Jesus Rejected", reference: "1 Peter 2:7", description: "Stone rejected by builders becomes chief cornerstone" }},
  { id: "6", category: "Provision in Desert", oldTestament: { event: "Manna from Heaven", reference: "Exodus 16:4", description: "God provides bread from heaven daily" }, newTestament: { event: "Bread of Life", reference: "John 6:35", description: "Jesus: 'I am the bread of life'" }},
  { id: "7", category: "Healing Serpent", oldTestament: { event: "Bronze Serpent", reference: "Numbers 21:9", description: "Look at lifted serpent and live" }, newTestament: { event: "Lifted Up", reference: "John 3:14-15", description: "Son of Man must be lifted up for eternal life" }},
  { id: "8", category: "Betrayed for Silver", oldTestament: { event: "Joseph Sold", reference: "Genesis 37:28", description: "Sold by brothers for silver, becomes savior of nations" }, newTestament: { event: "Christ Sold", reference: "Matthew 26:15", description: "Betrayed for 30 silver pieces, becomes Savior of world" }},
  { id: "9", category: "Between Two", oldTestament: { event: "Samson's Death", reference: "Judges 16:29-30", description: "Samson between two pillars, dies destroying enemies" }, newTestament: { event: "Christ's Cross", reference: "Luke 23:33", description: "Jesus between two criminals, dies defeating sin and death" }},
  { id: "10", category: "Three-Day Resurrection", oldTestament: { event: "Jonah in Fish", reference: "Jonah 1:17", description: "Jonah swallowed by great fish, emerges after three days" }, newTestament: { event: "Christ Rises", reference: "Matthew 12:40", description: "Jesus in tomb three days, rises victorious" }},
  { id: "11", category: "Rock Struck", oldTestament: { event: "Water from Rock", reference: "Exodus 17:6", description: "Moses strikes rock, water flows for thirsty people" }, newTestament: { event: "Spirit Flows", reference: "John 7:37-39", description: "Christ struck, living water (Spirit) flows to all who thirst" }},
  { id: "12", category: "Innocent Blood Cries", oldTestament: { event: "Abel's Blood", reference: "Genesis 4:10", description: "Abel's blood cries out from ground for justice" }, newTestament: { event: "Jesus' Blood", reference: "Hebrews 12:24", description: "Jesus' blood speaks better word - mercy and forgiveness" }},
  { id: "13", category: "Passover Deliverance", oldTestament: { event: "Egypt's Firstborn", reference: "Exodus 12:12-13", description: "Lamb's blood on doorposts spares Israel from death angel" }, newTestament: { event: "Christ Our Passover", reference: "1 Corinthians 5:7", description: "Christ sacrificed as Passover lamb, delivers from sin's death" }},
  { id: "14", category: "Suffering Righteousness", oldTestament: { event: "Job's Testing", reference: "Job 1:21-22", description: "Job loses everything, remains faithful, blessed double" }, newTestament: { event: "Christ's Humiliation", reference: "Philippians 2:8-11", description: "Christ empties self unto death, exalted above all names" }},
  { id: "15", category: "Shepherd King", oldTestament: { event: "David the Shepherd", reference: "1 Samuel 17:34-35", description: "David protects sheep from lion and bear, becomes king" }, newTestament: { event: "Good Shepherd", reference: "John 10:11", description: "Jesus lays down life for sheep, reigns as eternal King" }},
  { id: "16", category: "Bride Acquired", oldTestament: { event: "Isaac's Bride", reference: "Genesis 24:67", description: "Abraham sends servant to get bride for Isaac with gifts" }, newTestament: { event: "Church as Bride", reference: "Ephesians 5:25-27", description: "Father sends Spirit to gather bride for Christ through gospel" }},
  
  // Additional 84 parallels to reach 100+
  { id: "17", category: "Scapegoat Bearing Sin", oldTestament: { event: "Azazel Goat", reference: "Leviticus 16:21-22", description: "Sins confessed on scapegoat, sent into wilderness" }, newTestament: { event: "Sin Bearer", reference: "2 Corinthians 5:21", description: "Christ made sin for us, carries our iniquities away" }},
  { id: "18", category: "Firstborn Sacrifice", oldTestament: { event: "Isaac Offered", reference: "Genesis 22:2", description: "Abraham offers only son on mountain" }, newTestament: { event: "God's Only Son", reference: "John 3:16", description: "Father gives only begotten Son for the world" }},
  { id: "19", category: "Glory Cloud", oldTestament: { event: "Tabernacle Filled", reference: "Exodus 40:34-35", description: "Glory cloud fills tent, Moses cannot enter" }, newTestament: { event: "Incarnation", reference: "John 1:14", description: "Word becomes flesh, we behold His glory dwelling among us" }},
  { id: "20", category: "High Priest Intercedes", oldTestament: { event: "Aaron's Intercession", reference: "Numbers 16:48", description: "Aaron stands between living and dead, plague stops" }, newTestament: { event: "Christ's Mediation", reference: "1 Timothy 2:5", description: "One mediator between God and man stands in the gap" }},
  
  { id: "21", category: "Veil Torn", oldTestament: { event: "Most Holy Blocked", reference: "Exodus 26:33", description: "Veil separates people from God's presence" }, newTestament: { event: "Access Granted", reference: "Hebrews 10:19-20", description: "Christ's flesh torn like veil, new living way opened" }},
  { id: "22", category: "Stone Covenant", oldTestament: { event: "Tablets Written", reference: "Exodus 31:18", description: "God writes law on stone tablets at Sinai" }, newTestament: { event: "Hearts Written", reference: "2 Corinthians 3:3", description: "Spirit writes law on hearts of flesh, not stone" }},
  { id: "23", category: "City of Refuge", oldTestament: { event: "Manslayer Flees", reference: "Numbers 35:11-12", description: "Guilty one flees to city, safe from avenger" }, newTestament: { event: "Flee to Christ", reference: "Hebrews 6:18", description: "Fled for refuge to lay hold of hope set before us" }},
  { id: "24", category: "Year of Jubilee", oldTestament: { event: "Freedom Proclaimed", reference: "Leviticus 25:10", description: "Every 50th year, liberty proclaimed, debts cancelled" }, newTestament: { event: "Gospel Jubilee", reference: "Luke 4:18-19", description: "Jesus proclaims year of Lord's favor, sets captives free" }},
  { id: "25", category: "Day of Atonement", oldTestament: { event: "Annual Cleansing", reference: "Leviticus 16:30", description: "Once yearly, high priest atones for all sins" }, newTestament: { event: "Once for All", reference: "Hebrews 9:12", description: "Christ entered Most Holy once, obtained eternal redemption" }},
  
  { id: "26", category: "Manna Jar Kept", oldTestament: { event: "Testimony Preserved", reference: "Exodus 16:33", description: "Jar of manna placed before testimony, memorial forever" }, newTestament: { event: "Hidden Manna", reference: "Revelation 2:17", description: "Overcomers receive hidden manna, new name in white stone" }},
  { id: "27", category: "Fire from Heaven", oldTestament: { event: "Elijah's Altar", reference: "1 Kings 18:38", description: "Fire consumes sacrifice, proves God is LORD" }, newTestament: { event: "Pentecost Fire", reference: "Acts 2:3", description: "Tongues of fire rest on disciples, Holy Spirit descends" }},
  { id: "28", category: "Prophet Like Moses", oldTestament: { event: "Prophet Promised", reference: "Deuteronomy 18:15", description: "God will raise prophet like Moses, must hear him" }, newTestament: { event: "Prophet Revealed", reference: "Acts 3:22-23", description: "Jesus is that prophet; whoever rejects Him is cut off" }},
  { id: "29", category: "Vine and Branches", oldTestament: { event: "Israel the Vine", reference: "Psalm 80:8", description: "God brought vine out of Egypt, planted it" }, newTestament: { event: "True Vine", reference: "John 15:1", description: "Jesus is true vine, we are branches abiding in Him" }},
  { id: "30", category: "Living Water", oldTestament: { event: "Jeremiah's Fountain", reference: "Jeremiah 2:13", description: "People forsook fountain of living waters, dug broken cisterns" }, newTestament: { event: "Rivers of Living Water", reference: "John 7:38", description: "Believe in Christ, rivers of living water flow from within" }},
  
  { id: "31", category: "Light for Nations", oldTestament: { event: "Israel's Mission", reference: "Isaiah 49:6", description: "Made light to Gentiles, salvation to ends of earth" }, newTestament: { event: "Light of World", reference: "John 8:12", description: "Jesus is light of world, followers never walk in darkness" }},
  { id: "32", category: "Cornerstone Laid", oldTestament: { event: "Foundation Stone", reference: "Isaiah 28:16", description: "Precious cornerstone laid in Zion, who believes not ashamed" }, newTestament: { event: "Chief Cornerstone", reference: "Ephesians 2:20", description: "Christ Jesus chief cornerstone, whole building joined together" }},
  { id: "33", category: "Horn of Salvation", oldTestament: { event: "David's Horn", reference: "Psalm 132:17", description: "Horn to sprout for David, lamp for anointed" }, newTestament: { event: "Horn Raised Up", reference: "Luke 1:69", description: "Raised up horn of salvation in house of David" }},
  { id: "34", category: "Peace Prince", oldTestament: { event: "Name Given", reference: "Isaiah 9:6", description: "Child called Wonderful Counselor, Prince of Peace" }, newTestament: { event: "Peace Made", reference: "Ephesians 2:14", description: "Christ Himself is our peace, made both one" }},
  { id: "35", category: "Bruised Reed", oldTestament: { event: "Servant's Gentleness", reference: "Isaiah 42:3", description: "Will not break bruised reed or quench smoldering wick" }, newTestament: { event: "Gentle Savior", reference: "Matthew 12:20", description: "Jesus embodies gentle servant, brings justice with compassion" }},
  
  { id: "36", category: "King Enters Jerusalem", oldTestament: { event: "Humble King Prophesied", reference: "Zechariah 9:9", description: "King comes gentle, riding on donkey, colt" }, newTestament: { event: "Triumphal Entry", reference: "Matthew 21:5", description: "Jesus enters Jerusalem on donkey, fulfills prophecy" }},
  { id: "37", category: "Pierced Redeemer", oldTestament: { event: "Look on Pierced One", reference: "Zechariah 12:10", description: "They will look on Him whom they pierced, mourn" }, newTestament: { event: "Side Pierced", reference: "John 19:37", description: "Soldier pierces Jesus' side, fulfills Scripture" }},
  { id: "38", category: "Sun of Righteousness", oldTestament: { event: "Healing in Wings", reference: "Malachi 4:2", description: "Sun of righteousness arises with healing in wings" }, newTestament: { event: "Light Arisen", reference: "Luke 1:78", description: "Sunrise visits from on high to give light" }},
  { id: "39", category: "Suffering Servant", oldTestament: { event: "Led as Lamb", reference: "Isaiah 53:7", description: "Oppressed, silent before shearers like lamb to slaughter" }, newTestament: { event: "Silent Lamb", reference: "Acts 8:32", description: "Philip explains Jesus fulfilled Isaiah's suffering servant" }},
  { id: "40", category: "Carried Our Sorrows", oldTestament: { event: "Griefs Borne", reference: "Isaiah 53:4", description: "Surely bore griefs, carried sorrows, stricken by God" }, newTestament: { event: "Bore Our Sins", reference: "1 Peter 2:24", description: "Bore sins in body on tree, by wounds we are healed" }},
  
  { id: "41", category: "Numbered with Transgressors", oldTestament: { event: "Counted with Criminals", reference: "Isaiah 53:12", description: "Poured out soul unto death, numbered with transgressors" }, newTestament: { event: "Crucified with Thieves", reference: "Mark 15:28", description: "Crucified between two criminals, Scripture fulfilled" }},
  { id: "42", category: "Lots Cast for Garments", oldTestament: { event: "Divide Clothing", reference: "Psalm 22:18", description: "Divide garments among them, cast lots for robe" }, newTestament: { event: "Soldiers Gamble", reference: "John 19:24", description: "Soldiers divide clothes, cast lots for seamless tunic" }},
  { id: "43", category: "Forsaken Cry", oldTestament: { event: "Why Forsaken?", reference: "Psalm 22:1", description: "My God, my God, why have you forsaken me?" }, newTestament: { event: "Cross Cry", reference: "Matthew 27:46", description: "Jesus cries same words from cross at ninth hour" }},
  { id: "44", category: "Bones Unbroken", oldTestament: { event: "Passover Lamb Whole", reference: "Exodus 12:46", description: "Do not break any bones of Passover lamb" }, newTestament: { event: "Legs Not Broken", reference: "John 19:33-36", description: "Jesus already dead, soldiers don't break legs" }},
  { id: "45", category: "Vinegar Given", oldTestament: { event: "Gall to Drink", reference: "Psalm 69:21", description: "Gave me gall for food, vinegar for my thirst" }, newTestament: { event: "Sour Wine Offered", reference: "Matthew 27:34", description: "Offered wine mixed with gall, Jesus refused" }},
  
  { id: "46", category: "Grave with Rich", oldTestament: { event: "Burial Prophesied", reference: "Isaiah 53:9", description: "Grave assigned with wicked, with rich in his death" }, newTestament: { event: "Joseph's Tomb", reference: "Matthew 27:57-60", description: "Rich man Joseph provides new tomb for Jesus" }},
  { id: "47", category: "Not See Decay", oldTestament: { event: "Holy One Preserved", reference: "Psalm 16:10", description: "Will not abandon soul to Sheol or let Holy One decay" }, newTestament: { event: "Resurrected Undecayed", reference: "Acts 2:27-31", description: "David spoke of Christ's resurrection, no decay" }},
  { id: "48", category: "Ascension Predicted", oldTestament: { event: "Ascended on High", reference: "Psalm 68:18", description: "You ascended on high, led captives, received gifts" }, newTestament: { event: "Christ Ascends", reference: "Ephesians 4:8", description: "When He ascended, gave gifts to men" }},
  { id: "49", category: "Right Hand Throne", oldTestament: { event: "Sit at Right Hand", reference: "Psalm 110:1", description: "LORD said to my Lord: Sit at my right hand" }, newTestament: { event: "Seated in Glory", reference: "Hebrews 1:3", description: "After purifying sins, sat down at right hand" }},
  { id: "50", category: "Priest Forever", oldTestament: { event: "Melchizedek Order", reference: "Psalm 110:4", description: "You are priest forever after order of Melchizedek" }, newTestament: { event: "Eternal Priest", reference: "Hebrews 5:6", description: "Christ appointed priest forever like Melchizedek" }},
  
  { id: "51", category: "Seed of Woman", oldTestament: { event: "Serpent Crusher", reference: "Genesis 3:15", description: "Her seed will crush serpent's head, heel bruised" }, newTestament: { event: "Satan Defeated", reference: "Romans 16:20", description: "God of peace will soon crush Satan under your feet" }},
  { id: "52", category: "Abraham's Seed", oldTestament: { event: "All Nations Blessed", reference: "Genesis 22:18", description: "Through your offspring all nations blessed" }, newTestament: { event: "Blessing to Nations", reference: "Galatians 3:16", description: "Seed is Christ, through whom blessing comes" }},
  { id: "53", category: "Jacob's Star", oldTestament: { event: "Star from Jacob", reference: "Numbers 24:17", description: "Star comes out of Jacob, scepter rises from Israel" }, newTestament: { event: "Bright Morning Star", reference: "Revelation 22:16", description: "Jesus is Root of David, bright Morning Star" }},
  { id: "54", category: "Shiloh Comes", oldTestament: { event: "Scepter Remains", reference: "Genesis 49:10", description: "Scepter shall not depart from Judah until Shiloh comes" }, newTestament: { event: "Lion of Judah", reference: "Revelation 5:5", description: "Lion of tribe of Judah, Root of David has conquered" }},
  { id: "55", category: "Immanuel Born", oldTestament: { event: "Virgin Conceives", reference: "Isaiah 7:14", description: "Virgin will conceive, bear son, call Him Immanuel" }, newTestament: { event: "Born of Virgin", reference: "Matthew 1:23", description: "Virgin Mary conceives by Spirit, names Him Jesus" }},
  
  { id: "56", category: "Bethlehem Birth", oldTestament: { event: "Ruler from Bethlehem", reference: "Micah 5:2", description: "From you, Bethlehem, ruler comes whose origins are ancient" }, newTestament: { event: "Born in Bethlehem", reference: "Matthew 2:1", description: "Jesus born in Bethlehem of Judea, fulfills prophecy" }},
  { id: "57", category: "Egypt Exodus", oldTestament: { event: "Son Called from Egypt", reference: "Hosea 11:1", description: "Out of Egypt I called my son" }, newTestament: { event: "Return from Egypt", reference: "Matthew 2:15", description: "Fled to Egypt, returned to fulfill Hosea's word" }},
  { id: "58", category: "Rachel Weeping", oldTestament: { event: "Ramah Mourning", reference: "Jeremiah 31:15", description: "Voice heard in Ramah, Rachel weeping for her children" }, newTestament: { event: "Slaughter of Innocents", reference: "Matthew 2:18", description: "Herod kills babies, Rachel weeps again" }},
  { id: "59", category: "Nazarene Called", oldTestament: { event: "Branch Prophesied", reference: "Isaiah 11:1", description: "Branch (Netzer) will grow from Jesse's stump" }, newTestament: { event: "Jesus of Nazareth", reference: "Matthew 2:23", description: "Called Nazarene, fulfills branch prophecy" }},
  { id: "60", category: "Voice in Wilderness", oldTestament: { event: "Prepare the Way", reference: "Isaiah 40:3", description: "Voice cries in wilderness: Prepare way of LORD" }, newTestament: { event: "John the Baptist", reference: "Matthew 3:3", description: "John fulfills Isaiah, prepares way for Messiah" }},
  
  { id: "61", category: "Spirit Anointing", oldTestament: { event: "Spirit Upon Him", reference: "Isaiah 61:1", description: "Spirit of Lord upon me, anointed to preach good news" }, newTestament: { event: "Baptism Anointing", reference: "Luke 4:18", description: "Jesus reads Isaiah, declares fulfilled in hearing" }},
  { id: "62", category: "Galilee Light", oldTestament: { event: "Darkness to Light", reference: "Isaiah 9:1-2", description: "Galilee of Gentiles, people in darkness see great light" }, newTestament: { event: "Ministry in Galilee", reference: "Matthew 4:15-16", description: "Jesus begins Galilee ministry, light has dawned" }},
  { id: "63", category: "Healing Ministry", oldTestament: { event: "Blind See, Lame Walk", reference: "Isaiah 35:5-6", description: "Eyes of blind opened, lame leap like deer" }, newTestament: { event: "Miracles Performed", reference: "Matthew 11:5", description: "Jesus heals blind, lame, deaf - Isaiah fulfilled" }},
  { id: "64", category: "Zeal Consumes", oldTestament: { event: "Zeal for House", reference: "Psalm 69:9", description: "Zeal for your house consumes me" }, newTestament: { event: "Temple Cleansed", reference: "John 2:17", description: "Disciples remember Psalm when Jesus cleanses temple" }},
  { id: "65", category: "Rejected by Brothers", oldTestament: { event: "Stranger to Brothers", reference: "Psalm 69:8", description: "I am a stranger to my brothers, alien to mother's sons" }, newTestament: { event: "Family Unbelief", reference: "John 7:5", description: "Even His brothers did not believe in Him" }},
  
  { id: "66", category: "Hated Without Cause", oldTestament: { event: "Groundless Hatred", reference: "Psalm 69:4", description: "More than hairs of head, those who hate me without cause" }, newTestament: { event: "World's Hatred", reference: "John 15:25", description: "They hated me without cause, fulfills their Law" }},
  { id: "67", category: "Friend Betrays", oldTestament: { event: "Trusted Friend", reference: "Psalm 41:9", description: "Close friend whom I trusted, ate my bread, lifted heel" }, newTestament: { event: "Judas Betrays", reference: "John 13:18", description: "Jesus quotes Psalm about Judas's betrayal" }},
  { id: "68", category: "Thirty Silver Pieces", oldTestament: { event: "Price Valued", reference: "Zechariah 11:12-13", description: "Weighed out 30 pieces of silver, my price" }, newTestament: { event: "Betrayal Price", reference: "Matthew 27:9", description: "Took 30 silver pieces, price set on Him" }},
  { id: "69", category: "Potter's Field", oldTestament: { event: "Thrown to Potter", reference: "Zechariah 11:13", description: "Throw it to potter in house of LORD" }, newTestament: { event: "Field of Blood", reference: "Matthew 27:7", description: "Bought potter's field with betrayal money" }},
  { id: "70", category: "Sheep Scattered", oldTestament: { event: "Strike Shepherd", reference: "Zechariah 13:7", description: "Strike shepherd, sheep will be scattered" }, newTestament: { event: "Disciples Flee", reference: "Matthew 26:31", description: "Jesus predicts disciples scatter at His arrest" }},
  
  { id: "71", category: "False Witnesses", oldTestament: { event: "Lies Against Me", reference: "Psalm 35:11", description: "Malicious witnesses rise, ask things I know not" }, newTestament: { event: "Trial Lies", reference: "Matthew 26:59-60", description: "Sanhedrin seeks false testimony against Jesus" }},
  { id: "72", category: "Silent Before Accusers", oldTestament: { event: "Mouth Not Opened", reference: "Isaiah 53:7", description: "Oppressed and afflicted, did not open mouth" }, newTestament: { event: "Silent Before Pilate", reference: "Matthew 27:12-14", description: "Made no reply to accusations, Pilate amazed" }},
  { id: "73", category: "Struck and Spat Upon", oldTestament: { event: "Back to Smiters", reference: "Isaiah 50:6", description: "Gave back to those who struck, face to those who spit" }, newTestament: { event: "Mocked and Beaten", reference: "Matthew 26:67", description: "Spit in face, struck with fists, slapped" }},
  { id: "74", category: "Hands and Feet Pierced", oldTestament: { event: "Pierced Hands/Feet", reference: "Psalm 22:16", description: "Dogs surround me, they pierce my hands and feet" }, newTestament: { event: "Nails Driven", reference: "John 20:25", description: "Thomas wants to see nail marks in hands" }},
  { id: "75", category: "Crucified with Criminals", oldTestament: { event: "Counted with Lawless", reference: "Isaiah 53:12", description: "Numbered with transgressors, interceded for them" }, newTestament: { event: "Two Thieves", reference: "Luke 23:33", description: "Crucified with two criminals, one on each side" }},
  
  { id: "76", category: "Prayed for Enemies", oldTestament: { event: "Intercession Prophesied", reference: "Isaiah 53:12", description: "Interceded for transgressors" }, newTestament: { event: "Father Forgive", reference: "Luke 23:34", description: "Jesus prays for those crucifying Him" }},
  { id: "77", category: "Mocked and Insulted", oldTestament: { event: "Scorned by Men", reference: "Psalm 22:7-8", description: "Scorn of men, despised, they mock: 'Trust LORD'" }, newTestament: { event: "Crowd Taunts", reference: "Matthew 27:39-43", description: "Passers-by mock: 'He trusts God, let God rescue'" }},
  { id: "78", category: "Darkness at Noon", oldTestament: { event: "Sun Darkened", reference: "Amos 8:9", description: "Make sun go down at noon, darken earth in daytime" }, newTestament: { event: "Three Hours Darkness", reference: "Matthew 27:45", description: "Darkness over land from sixth to ninth hour" }},
  { id: "79", category: "Thirst on Cross", oldTestament: { event: "Tongue Sticks", reference: "Psalm 22:15", description: "Strength dried up, tongue sticks to roof of mouth" }, newTestament: { event: "I Thirst", reference: "John 19:28", description: "Jesus says 'I thirst' to fulfill Scripture" }},
  { id: "80", category: "Committed Spirit to Father", oldTestament: { event: "Into Your Hands", reference: "Psalm 31:5", description: "Into your hand I commit my spirit, you redeem me" }, newTestament: { event: "Final Words", reference: "Luke 23:46", description: "Father, into your hands I commit my spirit, then died" }},
  
  { id: "81", category: "Side Pierced", oldTestament: { event: "Look on Pierced", reference: "Zechariah 12:10", description: "Look on me, the one they have pierced, will mourn" }, newTestament: { event: "Spear Thrust", reference: "John 19:34", description: "Soldier pierced side, blood and water flowed out" }},
  { id: "82", category: "Buried in Rich Man's Tomb", oldTestament: { event: "Grave with Wealthy", reference: "Isaiah 53:9", description: "Assigned grave with wicked but with rich in death" }, newTestament: { event: "Joseph's New Tomb", reference: "Matthew 27:57-60", description: "Rich man Joseph buries Jesus in own new tomb" }},
  { id: "83", category: "Resurrection on Third Day", oldTestament: { event: "Raised on Third Day", reference: "Hosea 6:2", description: "After two days He will revive us, third day raise up" }, newTestament: { event: "Easter Morning", reference: "1 Corinthians 15:4", description: "Raised third day according to Scriptures" }},
  { id: "84", category: "Incorruptible Body", oldTestament: { event: "No Decay Seen", reference: "Psalm 16:10", description: "Will not let your Holy One see corruption" }, newTestament: { event: "Risen Without Decay", reference: "Acts 13:35-37", description: "Jesus raised, did not see corruption like David did" }},
  { id: "85", category: "Great Commission", oldTestament: { event: "Ask of Me", reference: "Psalm 2:8", description: "Ask of me, I'll give nations as inheritance" }, newTestament: { event: "All Authority Given", reference: "Matthew 28:18-19", description: "All authority given, go make disciples of all nations" }},
  
  { id: "86", category: "Believers Baptized", oldTestament: { event: "Cleansed with Water", reference: "Ezekiel 36:25", description: "Sprinkle clean water on you, cleanse from impurities" }, newTestament: { event: "Water Baptism", reference: "Acts 2:38", description: "Repent and be baptized for forgiveness of sins" }},
  { id: "87", category: "New Covenant Written", oldTestament: { event: "Law on Hearts", reference: "Jeremiah 31:33", description: "Put law within them, write it on their hearts" }, newTestament: { event: "New Covenant Enacted", reference: "Hebrews 8:10", description: "Laws in minds, write on hearts under new covenant" }},
  { id: "88", category: "Spirit Poured Out", oldTestament: { event: "Pour Out Spirit", reference: "Joel 2:28", description: "Pour out my Spirit on all flesh, sons/daughters prophesy" }, newTestament: { event: "Pentecost Outpouring", reference: "Acts 2:17", description: "Peter declares Joel fulfilled at Pentecost" }},
  { id: "89", category: "Gospel to Gentiles", oldTestament: { event: "Nations Included", reference: "Isaiah 49:6", description: "Light to nations, salvation to ends of earth" }, newTestament: { event: "Mission to Gentiles", reference: "Acts 13:47", description: "Paul quotes Isaiah, takes gospel to Gentiles" }},
  { id: "90", category: "Stone Rolls Away", oldTestament: { event: "Stone Cut Without Hands", reference: "Daniel 2:34", description: "Stone cut without hands strikes image, becomes mountain" }, newTestament: { event: "Tomb Stone Removed", reference: "Matthew 28:2", description: "Angel rolls away stone, Jesus risen" }},
  
  { id: "91", category: "Kingdom Never Destroyed", oldTestament: { event: "Eternal Kingdom", reference: "Daniel 2:44", description: "God will set up kingdom that never destroyed" }, newTestament: { event: "Kingdom Established", reference: "Luke 1:33", description: "Reign over Jacob forever, kingdom will never end" }},
  { id: "92", category: "Son of Man Given Dominion", oldTestament: { event: "One Like Son of Man", reference: "Daniel 7:13-14", description: "Given authority, glory, kingdom, all peoples serve Him" }, newTestament: { event: "Ascension Authority", reference: "Matthew 28:18", description: "All authority in heaven and earth given to me" }},
  { id: "93", category: "Ancient of Days Judges", oldTestament: { event: "Thrones Set Up", reference: "Daniel 7:9-10", description: "Ancient of Days takes seat, court seated, books opened" }, newTestament: { event: "Judgment Seat", reference: "Romans 14:10", description: "We will all stand before God's judgment seat" }},
  { id: "94", category: "Believers Reign with Christ", oldTestament: { event: "Kingdom Given to Saints", reference: "Daniel 7:27", description: "Kingdom given to saints of Most High, eternal kingdom" }, newTestament: { event: "Reign with Him", reference: "Revelation 20:6", description: "Priests of God and Christ, reign with Him thousand years" }},
  { id: "95", category: "New Jerusalem Descends", oldTestament: { event: "Holy City Vision", reference: "Ezekiel 40-48", description: "Vision of restored temple and city, LORD is there" }, newTestament: { event: "City from Heaven", reference: "Revelation 21:2", description: "Holy city New Jerusalem descending from God" }},
  
  { id: "96", category: "God Dwells with People", oldTestament: { event: "Tabernacle Among Them", reference: "Ezekiel 37:27", description: "My dwelling place will be with them, I'll be their God" }, newTestament: { event: "Tabernacle of God", reference: "Revelation 21:3", description: "God's dwelling with mankind, He will dwell with them" }},
  { id: "97", category: "No More Tears", oldTestament: { event: "Wipe Away Tears", reference: "Isaiah 25:8", description: "Swallow up death forever, wipe tears from all faces" }, newTestament: { event: "All Tears Wiped", reference: "Revelation 21:4", description: "Wipe every tear, no death, mourning, crying, pain" }},
  { id: "98", category: "Tree of Life Restored", oldTestament: { event: "Eden's Tree", reference: "Genesis 2:9", description: "Tree of life in midst of garden" }, newTestament: { event: "Tree in New Creation", reference: "Revelation 22:2", description: "Tree of life on both sides of river, healing for nations" }},
  { id: "99", category: "River of Life", oldTestament: { event: "Temple River", reference: "Ezekiel 47:1", description: "Water flowing from temple, everything lives wherever river goes" }, newTestament: { event: "Crystal River", reference: "Revelation 22:1", description: "River of water of life from throne of God and Lamb" }},
  { id: "100", category: "Face to Face", oldTestament: { event: "Seek My Face", reference: "Psalm 27:8", description: "Your face, LORD, I will seek" }, newTestament: { event: "See His Face", reference: "Revelation 22:4", description: "They will see His face, His name on their foreheads" }},
  
  // Bonus parallels to exceed 100
  { id: "101", category: "No Night There", oldTestament: { event: "No Need for Sun", reference: "Isaiah 60:19-20", description: "No longer need sun or moon, LORD will be eternal light" }, newTestament: { event: "No More Night", reference: "Revelation 22:5", description: "No night there, no need for lamp or sun, Lord gives light" }},
  { id: "102", category: "Curse Removed", oldTestament: { event: "Curse Pronounced", reference: "Genesis 3:17", description: "Cursed is ground because of you, toil all days" }, newTestament: { event: "No More Curse", reference: "Revelation 22:3", description: "No longer any curse, throne of God and Lamb in city" }},
  { id: "103", category: "Eden Restored", oldTestament: { event: "Paradise Lost", reference: "Genesis 3:23-24", description: "Drove man out, cherubim guard way to tree of life" }, newTestament: { event: "Paradise Regained", reference: "Revelation 22:14", description: "Blessed who wash robes, right to tree of life, enter gates" }},
  { id: "104", category: "Everlasting Covenant", oldTestament: { event: "Covenant Promised", reference: "Isaiah 55:3", description: "I will make everlasting covenant with you, faithful love to David" }, newTestament: { event: "Covenant Sealed", reference: "Hebrews 13:20", description: "God of peace brought back great Shepherd by blood of eternal covenant" }},
  { id: "105", category: "Final Victory", oldTestament: { event: "Serpent's End", reference: "Genesis 3:15", description: "You will strike his heel, he will crush your head" }, newTestament: { event: "Satan Cast Down", reference: "Revelation 20:10", description: "Devil thrown into lake of fire, tormented forever" }}
];

interface GameCard {
  id: string;
  pairId: string;
  testament: "old" | "new";
  event: string;
  reference: string;
  description: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function ConcentrationGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !gameComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    
    PARALLEL_PAIRS.forEach(pair => {
      gameCards.push({
        id: `${pair.id}-old`,
        pairId: pair.id,
        testament: "old",
        event: pair.oldTestament.event,
        reference: pair.oldTestament.reference,
        description: pair.oldTestament.description,
        isFlipped: false,
        isMatched: false
      });
      
      gameCards.push({
        id: `${pair.id}-new`,
        pairId: pair.id,
        testament: "new",
        event: pair.newTestament.event,
        reference: pair.newTestament.reference,
        description: pair.newTestament.description,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setStartTime(null);
    setElapsedTime(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId) || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card flip state
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          setCards(cards.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMatchedPairs([...matchedPairs, firstCard.pairId]);
          setFlippedCards([]);
          
          toast.success("Parallel matched!", {
            description: `${firstCard.event} ↔ ${secondCard.event}`
          });

          // Check if game is complete
          if (matchedPairs.length + 1 === PARALLEL_PAIRS.length) {
            setGameComplete(true);
            toast.success("Congratulations!", {
              description: `You found all ${PARALLEL_PAIRS.length} parallels!`
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                Biblical Parallels Concentration
              </h1>
              <p className="text-muted-foreground mt-1">
                Match Old Testament events with their New Testament fulfillments
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{matchedPairs.length}/{PARALLEL_PAIRS.length}</div>
                    <div className="text-xs text-muted-foreground">Pairs Found</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{moves}</div>
                    <div className="text-xs text-muted-foreground">Moves</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={initializeGame}
                  className="w-full"
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(card => (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  card.isFlipped || card.isMatched 
                    ? 'bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'bg-secondary/50'
                } ${card.isMatched ? 'opacity-50' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <CardHeader className="pb-3">
                  {card.isFlipped || card.isMatched ? (
                    <>
                      <Badge 
                        variant="outline" 
                        className={card.testament === "old" ? "bg-amber-500/10" : "bg-blue-500/10"}
                      >
                        {card.testament === "old" ? "OT" : "NT"}
                      </Badge>
                      <CardTitle className="text-base mt-2">{card.event}</CardTitle>
                      <CardDescription className="text-xs">{card.reference}</CardDescription>
                    </>
                  ) : (
                    <div className="h-24 flex items-center justify-center">
                      <div className="text-4xl opacity-20">?</div>
                    </div>
                  )}
                </CardHeader>
                {(card.isFlipped || card.isMatched) && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {card.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {gameComplete && (
            <Card className="mt-6 bg-gradient-palace">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  🎉 Excellent Work!
                </CardTitle>
                <CardDescription className="text-white/90 text-center">
                  You matched all {PARALLEL_PAIRS.length} biblical parallels in {moves} moves and {formatTime(elapsedTime)}!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4">
                <Button onClick={initializeGame} variant="secondary">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
                  More Games
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Click cards to flip them and reveal biblical events</li>
                <li>Find matching parallels between Old Testament and New Testament events</li>
                <li>Match events that share the same typological pattern (e.g., Moses→Joshua parallels John Baptist→Jesus)</li>
                <li>All {PARALLEL_PAIRS.length} pairs demonstrate how Christ fulfills OT patterns</li>
                <li>Complete the game in as few moves as possible!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
