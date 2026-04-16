// ─── AATS: Preterist Avatar Training ────────────────────────────────────────
// Training data for the Preterist worldview — the belief that all or most
// biblical prophecy (including Matthew 24 and Revelation) was fulfilled by
// the destruction of Jerusalem in 70 AD.

import type { AATSAvatarTraining } from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects = [
  {
    id: "all-prophecy-fulfilled-70ad",
    title: "All Prophecy Fulfilled by 70 AD",
    description:
      "Matthew 24, Revelation all fulfilled in the destruction of Jerusalem",
  },
  {
    id: "this-generation-argument",
    title: "'This Generation' Argument",
    description:
      "Jesus said 'this generation' — everything must have happened within ~40 years",
  },
  {
    id: "anti-year-day-principle",
    title: "Anti-Year-Day Principle",
    description:
      "The year-day principle is an invention; prophetic time is literal",
  },
  {
    id: "no-future-second-coming",
    title: "No Future Second Coming",
    description:
      "The 'coming' of Christ was His judgment on Jerusalem in 70 AD",
  },
  {
    id: "audience-relevance-hermeneutic",
    title: "Audience Relevance Hermeneutic",
    description:
      "Revelation was written TO first-century churches ABOUT first-century events",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments = [
  {
    id: "steel-pret-1",
    title: "The Olivet Discourse Was Entirely About 70 AD",
    argument:
      "In Matthew 24:1-2 Jesus pointed to the temple and said 'not one stone shall be left upon another.' The entire discourse that followed — wars, famines, false prophets, the abomination of desolation, tribulation, and the 'coming of the Son of Man' — was His answer to the disciples' question about WHEN the temple would be destroyed. The context is seamless; there is no exegetical break that shifts the topic to a distant future event. Every element was fulfilled when Rome besieged and destroyed Jerusalem in 70 AD, exactly as Josephus documented.",
    hiddenAssumptions: [
      "Assumes the disciples asked one question, not three distinct ones (Matt 24:3 actually contains three questions)",
      "Ignores the shift markers in the discourse — 'immediately after the tribulation of those days' (v.29) signals a new phase",
      "Conflates the local destruction of a city with the cosmic, visible return of Christ described in v.30-31",
      "Relies on Josephus as the interpretive lens rather than Scripture interpreting Scripture",
    ],
    sdaResponse:
      "Matthew 24:3 records three distinct questions: (1) when will the temple be destroyed, (2) what is the sign of Your coming, and (3) what is the sign of the end of the age. Jesus answers all three, weaving near and far fulfillment together — a common prophetic pattern called 'telescoping.' The destruction of Jerusalem in 70 AD fulfills the near application, but the cosmic signs of v.29-31 and the worldwide gathering of the elect point to the literal, visible Second Coming that 'every eye shall see' (Rev 1:7). Acts 1:11 explicitly promises He will return 'in like manner as you saw Him go' — bodily and visibly — which did not happen in 70 AD.",
  },
  {
    id: "steel-pret-2",
    title: "'This Generation' Demands First-Century Fulfillment",
    argument:
      "Jesus said 'Truly I say to you, this generation will not pass away until all these things take place' (Matt 24:34). The Greek word 'genea' means a literal generation — roughly 30-40 years. Since Jesus spoke these words around 30 AD and Jerusalem fell in 70 AD, the timeline fits perfectly. To redefine 'this generation' as 'this race' or 'a future generation' is eisegesis driven by theological necessity rather than honest exegesis. Every other use of 'this generation' in the Gospels refers to the people alive at that time.",
    hiddenAssumptions: [
      "Assumes 'all these things' must include every element of Matthew 24, not just the signs leading to the temple's destruction",
      "Ignores that 'genea' can also mean 'kind' or 'type' (cf. Psalm 24:6 LXX, 'the generation of those who seek Him')",
      "Does not account for prophetic telescoping where near and far events share language",
      "Overlooks that some elements — the sun darkened, stars falling, the Son of Man coming on clouds with great power — clearly did not happen in 70 AD in any literal sense",
    ],
    sdaResponse:
      "The phrase 'this generation' in context most naturally refers to the generation that sees the final signs begin. Jesus uses 'all these things' (panta tauta) in v.33-34 to refer to the signs He just listed, not to the Second Coming itself — 'when you see all these things, know that it [His coming] is near, at the doors.' The near fulfillment (70 AD) validates the pattern; the ultimate fulfillment awaits. Additionally, even if 'this generation' referred to the first-century audience, it could apply to the preliminary signs (temple destruction, wars, famines) while the cosmic culmination — the literal, visible return — remains future. Daniel 12:4 says the book is sealed 'until the time of the end,' indicating end-time prophecy extends far beyond 70 AD.",
  },
  {
    id: "steel-pret-3",
    title: "The Year-Day Principle Is a Medieval Invention",
    argument:
      "The year-day principle — interpreting one prophetic day as one literal year — has no basis in the text of Daniel or Revelation. It was invented by Joachim of Fiore in the 12th century and later adopted by Protestant historicists to generate timelines pointing to their own era. The 'time, times, and half a time' of Daniel 7:25 is simply 3.5 literal years — matching the duration of Antiochus IV's persecution of the Jews (167-164 BC) and the Roman siege (66-70 AD). The 2,300 'evenings and mornings' of Daniel 8:14 refer to 1,150 days of suspended sacrifices, not 2,300 years.",
    hiddenAssumptions: [
      "Ignores that Numbers 14:34 and Ezekiel 4:6 establish the day-for-a-year principle within Scripture itself",
      "Misrepresents history — the year-day principle was recognized by Jewish scholars well before the medieval period",
      "The 2,300 'evenings and mornings' uses the Hebrew 'ereb boqer' — evening-morning — which is a single day unit as in Genesis 1, not half-days",
      "Antiochus IV does not fit the scope of Daniel 8 — the vision spans from Medo-Persia to the 'time of the end' (Dan 8:17)",
    ],
    sdaResponse:
      "The year-day principle is not a medieval invention; it is rooted in Scripture. In Numbers 14:34, God told Israel, 'each day for a year, you shall bear your iniquity forty years.' In Ezekiel 4:6, God commanded, 'I have assigned you each day for a year.' These passages establish an explicit divine precedent for prophetic day-year equivalence. Furthermore, the Hebrew 'ereb boqer' in Daniel 8:14 means 'evening-morning' — a single day unit identical to the Genesis 1 creation formula — yielding 2,300 full days (= 2,300 prophetic years), not 1,150. The angel Gabriel explicitly told Daniel this vision concerns 'the time of the end' (Dan 8:17, 19), which rules out Antiochus IV in the 2nd century BC. Applied as year-day, the 2,300 years from 457 BC reach 1844 AD — the beginning of the investigative judgment in the heavenly sanctuary.",
  },
  {
    id: "steel-pret-4",
    title: "The 'Coming' in the Clouds Was Judgment Language, Not a Physical Return",
    argument:
      "In the Old Testament, God 'comes on clouds' as a symbol of judgment — not a literal descent from heaven. Isaiah 19:1 says 'the LORD rides on a swift cloud and is coming to Egypt.' God did not literally ride a cloud to Egypt; it was Assyria executing His judgment. Similarly, when Jesus said 'they will see the Son of Man coming on the clouds of heaven with power and great glory' (Matt 24:30), He was using the same Old Testament judgment language. His 'coming' was the Roman armies destroying the apostate temple system. There is no need for a future physical return.",
    hiddenAssumptions: [
      "Cherry-picks OT metaphorical 'coming' language while ignoring passages that clearly describe a literal return",
      "Ignores Acts 1:9-11 where angels explicitly said Jesus would return 'in the same way' He ascended — physically and visibly",
      "Cannot account for 1 Thessalonians 4:16-17 — the dead rising, the living caught up, the trumpet, the shout",
      "Reduces the bodily resurrection hope of the early church to a metaphorical 'spiritual' event",
    ],
    sdaResponse:
      "While God does use cloud-coming language metaphorically in some OT contexts, the New Testament makes the Second Coming unmistakably literal and physical. In Acts 1:9-11, as the disciples watched Jesus physically ascend into the sky, two angels declared: 'This same Jesus, who has been taken from you into heaven, will come back in the same way you have seen him go into heaven.' The manner is explicit — visible, bodily, from the sky. Revelation 1:7 says 'every eye will see Him,' including those who pierced Him. First Thessalonians 4:16-17 describes the Lord descending with a shout, the dead in Christ rising, and the living being caught up together — none of which occurred in 70 AD. The preterist position strips Christianity of its resurrection hope and reduces the Blessed Hope to a past political event.",
  },
  {
    id: "steel-pret-5",
    title: "Revelation's Own Time Indicators Demand a First-Century Fulfillment",
    argument:
      "Revelation 1:1 says these are 'things which must shortly take place.' Revelation 1:3 says 'the time is near.' Revelation 22:10 says 'Do not seal up the words of the prophecy of this book, for the time is near' — directly contrasting Daniel 12:4 where the book was sealed because the time was distant. These internal time indicators prove Revelation was written to describe events imminent to its first-century readers — primarily the fall of Jerusalem and the end of the Old Covenant age. To push these into the distant future is to deny the plain meaning of the text.",
    hiddenAssumptions: [
      "Assumes 'shortly' and 'near' must mean 'within a few years' rather than conveying certainty and divine urgency",
      "Ignores that 2 Peter 3:8 establishes that God's concept of time differs from ours — 'one day is as a thousand years'",
      "Fails to explain how the events of Revelation 19-22 — new heaven, new earth, New Jerusalem, no more death — were fulfilled in 70 AD",
      "The contrast with Daniel 12:4 actually proves the point: Daniel was sealed for a future era; Revelation is unsealed because its fulfillment BEGINS in the church age and unfolds across history",
    ],
    sdaResponse:
      "The phrases 'shortly' (en tachei) and 'near' (engys) in Revelation convey divine certainty and urgency — God sees the end from the beginning and speaks of future events as already present (Isa 46:10). Second Peter 3:8 warns against imposing human timescales on God: 'with the Lord one day is as a thousand years.' The contrast with Daniel 12:4 actually supports the historicist view: Daniel was sealed because its fulfillment was centuries away; Revelation is unsealed because the prophetic sequence it describes BEGINS in John's era and unfolds progressively through history — the seven churches, seven seals, seven trumpets — spanning from the apostolic age to the Second Coming and beyond. If Revelation were entirely fulfilled by 70 AD, chapters 20-22 become meaningless — the millennium, the final judgment, the new earth, and the elimination of death itself clearly remain unfulfilled.",
  },
  {
    id: "steel-pret-6",
    title: "The 'Last Days' Began at Pentecost and Ended at Jerusalem's Fall",
    argument:
      "Peter quoted Joel 2 at Pentecost and declared 'this is that which was spoken by the prophet Joel... in the last days' (Acts 2:16-17). Hebrews 1:2 says God 'in these last days has spoken to us by His Son.' The 'last days' in the New Testament always refer to the last days of the Old Covenant age — the final generation before God judged apostate Israel and ended the temple system forever. The 'last days' are not some distant future period; they were the period from Pentecost to 70 AD.",
    hiddenAssumptions: [
      "Reduces 'last days' to a 40-year window when the NT writers clearly expected ongoing eschatological unfolding",
      "Ignores 2 Timothy 3:1-5 where Paul describes 'last days' conditions that extend well beyond the first century",
      "Cannot explain why Paul expected a future resurrection of the dead (1 Cor 15) if everything ended in 70 AD",
      "The temple's destruction did not end God's covenant purposes — the heavenly sanctuary ministry continues (Heb 8:1-2)",
    ],
    sdaResponse:
      "The 'last days' began at Pentecost and extend to the Second Coming — they are the entire church age, not a 40-year window. Peter's quotation of Joel 2 at Pentecost marked the BEGINNING of the last days, not their totality. Joel's prophecy includes 'the sun shall be turned to darkness and the moon to blood BEFORE the great and awesome day of the LORD comes' (Joel 2:31) — cosmic signs that Adventists connect to the events of 1755 (Lisbon earthquake), 1780 (Dark Day), and 1833 (Leonid meteor shower), signs that precede the literal day of the Lord. Paul, writing in the last days, described conditions in 2 Timothy 3:1-5 that escalate over centuries. The heavenly sanctuary ministry described in Hebrews 8-9 continues today, with Christ serving as our High Priest — a ministry that the preterist position renders unnecessary by collapsing everything into 70 AD.",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames = [
  {
    id: "mg-pret-1",
    name: "Chronological Snobbery Reversal",
    description:
      "The preterist accuses you of reading your modern era into the Bible, flipping the typical charge. They imply that only a first-century reading is honest, and any future application is an anachronistic projection motivated by theological bias rather than exegesis.",
    example:
      "'You're reading 21st-century newspaper headlines into a 1st-century Jewish text. That's not exegesis — that's narcissistic eisegesis. The original audience would have had no concept of your modern prophetic timelines.'",
    detectionTip:
      "Watch for the framing that equates 'original audience understanding' with 'total meaning.' The prophets themselves often did not fully understand their own prophecies (1 Peter 1:10-12). God's word transcends its original audience.",
  },
  {
    id: "mg-pret-2",
    name: "The Academic Authority Play",
    description:
      "The preterist appeals to the weight of modern biblical scholarship — claiming that 'serious scholars' have moved past futurist readings and that only popular-level, uneducated Christians still believe in a future Second Coming or prophetic timelines.",
    example:
      "'No credible New Testament scholar at a major research university takes the futurist or historicist view seriously anymore. This is settled in academia. You're clinging to a pre-critical reading that scholarship left behind decades ago.'",
    detectionTip:
      "This is an appeal to authority combined with a bandwagon fallacy. Ask them to name specific scholars and engage their arguments rather than hiding behind 'consensus.' Also note that many respected scholars (N.T. Wright, G.K. Beale, etc.) do not hold full preterist positions.",
  },
  {
    id: "mg-pret-3",
    name: "The Josephus Trap",
    description:
      "The preterist constantly redirects to Josephus's 'Wars of the Jews' as the interpretive key to Revelation and Matthew 24, treating a secular historian's account as though it were inspired commentary on Scripture. This subtly shifts the authority from the Bible to an external source.",
    example:
      "'Have you even read Josephus? He describes exactly what Revelation predicted — famine, slaughter, the temple burning, signs in the sky. It's a perfect match. If you haven't studied Josephus, you can't understand Revelation.'",
    detectionTip:
      "Josephus is a valuable historical source, but he is not an inspired interpreter of Scripture. Challenge this by asking: 'Does Scripture interpret Scripture, or does Josephus interpret Scripture?' Biblical hermeneutics must be governed by the Bible itself, not external sources that are then forced onto the text.",
  },
  {
    id: "mg-pret-4",
    name: "The Covenant-Shift Shell Game",
    description:
      "The preterist reframes the entire book of Revelation as being about the end of the Old Covenant — not the end of the world. By shifting the referent from the cosmos to the covenant, they can 'fulfill' every prophecy within the first century without needing any physical cosmic events.",
    example:
      "'When Revelation talks about heaven and earth passing away, it's not literal — it's covenant language. The old heavens and earth are the Old Covenant system, and the new heavens and earth are the New Covenant. It all happened in 70 AD when the temple was destroyed and the Old Covenant officially ended.'",
    detectionTip:
      "Ask them to explain Revelation 21:4 — 'God will wipe away every tear from their eyes; there shall be no more death, nor sorrow, nor crying.' Did death cease in 70 AD? Did suffering end? If not, this 'covenant language' interpretation collapses under its own weight.",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies = [
  {
    id: "fal-pret-1",
    name: "Reductive Hermeneutic (Single-Fulfillment Fallacy)",
    definition:
      "Insisting that a prophecy can only have one fulfillment — the first-century one — and that any additional or ultimate fulfillment is illegitimate. This ignores the well-established biblical pattern of layered or typological fulfillment.",
    example:
      "'Matthew 24 was fulfilled in 70 AD. Full stop. There is no 'double fulfillment.' That's a made-up interpretive escape hatch to rescue failed predictions.'",
    counterMove:
      "Point to clear biblical examples of layered fulfillment: Isaiah 7:14 was fulfilled in Isaiah's day AND in Christ's virgin birth (Matt 1:22-23). Joel 2 was fulfilled at Pentecost (Acts 2:16-21) AND awaits cosmic fulfillment (the sun/moon signs). Hosea 11:1 referred to Israel AND to Jesus (Matt 2:15). Layered fulfillment is not an 'escape hatch' — it is how God's prophetic word works throughout Scripture.",
  },
  {
    id: "fal-pret-2",
    name: "Equivocation on 'Coming'",
    definition:
      "Using the word 'coming' (parousia/erchomai) in different senses without acknowledging the shift — sometimes meaning a metaphorical 'judgment coming' and other times a literal arrival — depending on which meaning supports the preterist conclusion.",
    example:
      "'Jesus came in judgment in 70 AD — that's what parousia means. The early church expected His coming within their generation, and He came, just not the way you imagine.'",
    counterMove:
      "Demand consistency. If 'coming' in Matthew 24:30 is metaphorical judgment, then what about 1 Thessalonians 4:15-17 where Paul uses the same word 'parousia' — and describes the dead rising, a trumpet sounding, and believers caught up in the air? Did that happen metaphorically in 70 AD? The same word cannot mean a spiritual event in one passage and then be dismissed in another passage that clearly describes physical events.",
  },
  {
    id: "fal-pret-3",
    name: "Selective Literalism",
    definition:
      "Taking 'this generation' hyper-literally (exactly 40 years!) while simultaneously reading 'every eye will see Him,' 'the dead in Christ shall rise,' and 'no more death' as figurative covenant language. The hermeneutic shifts depending on which reading supports preterism.",
    example:
      "'This generation' clearly means the people alive when Jesus spoke — that's literal. But 'every eye will see Him' is apocalyptic symbolism for God's judgment being recognized. And 'the dead in Christ shall rise' is about the church rising from spiritual death under the Old Covenant.'",
    counterMove:
      "Expose the inconsistency directly: 'You demand literal interpretation when it supports your timeline, but switch to figurative interpretation when the text describes events that obviously didn't happen in 70 AD. Which hermeneutic are you actually using? You can't have both.' A consistent hermeneutic must apply the same principles to the entire passage.",
  },
  {
    id: "fal-pret-4",
    name: "Argument from Silence (Nero-Dating Revelation)",
    definition:
      "Asserting that Revelation MUST have been written before 70 AD (under Nero, ~65 AD) so that its prophecies could point to the destruction of Jerusalem — despite the strong early church testimony that John wrote Revelation during Domitian's reign (~95 AD).",
    example:
      "'Revelation had to be written before 70 AD — otherwise the prophecy about the temple's destruction would be after the fact. The internal evidence clearly points to a Neronic date. The Domitian dating is unreliable.'",
    counterMove:
      "Irenaeus, who was a disciple of Polycarp (who knew the Apostle John personally), explicitly stated that the Revelation 'was seen... towards the end of Domitian's reign' (Against Heresies 5.30.3). This is a direct chain of testimony: John -> Polycarp -> Irenaeus. The preterist must dismiss this eyewitness chain and substitute an argument from internal 'clues' — which is circumstantial at best. If Revelation was written in ~95 AD, the entire preterist framework collapses since the 'prophecy' would have been written 25 years after its supposed fulfillment.",
  },
  {
    id: "fal-pret-5",
    name: "Category Error: Local Event as Cosmic Fulfillment",
    definition:
      "Treating the localized destruction of one city (Jerusalem) as the fulfillment of prophecies that describe universal, cosmic, and eternal realities — the end of death, a new heaven and earth, the resurrection of all the dead, and the eternal reign of God.",
    example:
      "'The fall of Jerusalem WAS the end of the old world. The new heavens and new earth are the New Covenant reality we live in now. Death 'passed away' in the sense that the Old Covenant system of death and condemnation ended.'",
    counterMove:
      "Ask plainly: 'Are people still dying? Is there still sorrow and crying? Is Satan still active?' Revelation 21:4 says in the new earth there will be 'no more death, nor sorrow, nor crying.' Revelation 20:10 says the devil will be cast into the lake of fire. None of this has occurred. The preterist must spiritualize these concrete, physical promises into abstraction — which robs the gospel of its power and the believer of their hope.",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies = [
  {
    subjectId: "all-prophecy-fulfilled-70ad",
    title: "Layered Fulfillment and the Historicist Framework",
    sdaPosition:
      "SDA theology follows the historicist method of prophetic interpretation — the same method used by the Reformers. Prophecy unfolds progressively through history, from the prophet's time through to the Second Coming. The destruction of Jerusalem in 70 AD is a significant prophetic event, but it is a TYPE of the final end, not the final end itself.",
    keyScriptures: [
      "Daniel 2:44 — 'In the days of these kings the God of heaven will set up a kingdom which shall never be destroyed' (the stone strikes the statue — still future)",
      "Daniel 7:27 — 'The kingdom and dominion... shall be given to the people of the saints of the Most High' (not fulfilled in 70 AD)",
      "Daniel 8:14 — 'For two thousand three hundred days; then the sanctuary shall be cleansed' (457 BC + 2300 years = 1844 AD)",
      "Matthew 24:14 — 'This gospel of the kingdom will be preached in all the world... and then the end will come' (the gospel had not reached 'all the world' by 70 AD)",
      "Revelation 14:6-7 — The three angels' messages go to 'every nation, tribe, tongue, and people' — a scope far beyond first-century Judea",
    ],
    counterArguments: [
      "70 AD was a significant prophetic event — but it is a local type of the global antitype. The destruction of Jerusalem foreshadows the final destruction of Babylon (Rev 18).",
      "Daniel's four-kingdom sequence (Babylon, Medo-Persia, Greece, Rome) extends well beyond 70 AD — the stone that destroys the statue represents Christ's kingdom replacing ALL earthly kingdoms, which has not yet occurred.",
      "The 2,300-day prophecy of Daniel 8:14, using the year-day principle, reaches to 1844 — not 70 AD. The preterist must ignore or dismiss this entire timeline.",
      "Jesus Himself said the gospel must go to 'all the world' before the end (Matt 24:14). By 70 AD, vast portions of the world had never heard the gospel. This condition remains partially unfulfilled even today.",
      "Revelation 20-22 describes events — the millennium, the final judgment, the lake of fire, the new earth — that cannot be credibly mapped onto the events of 70 AD.",
    ],
    closingStatement:
      "The destruction of Jerusalem in 70 AD was a profound prophetic fulfillment — but treating it as THE fulfillment of all prophecy requires ignoring Daniel's timelines, dismissing the literal Second Coming, spiritualizing the resurrection, and emptying the gospel of its ultimate hope. The historicist framework honors both the near and far dimensions of prophecy without collapsing everything into a single past event.",
  },
  {
    subjectId: "this-generation-argument",
    title: "Context, Scope, and Prophetic Telescoping",
    sdaPosition:
      "Jesus' statement in Matthew 24:34 is best understood within the structure of the entire Olivet Discourse, which answers three questions and employs prophetic telescoping — blending near and far fulfillments in a single prophetic panorama. 'This generation' applies to the signs that precede the end, not to the Second Coming itself.",
    keyScriptures: [
      "Matthew 24:3 — Three distinct questions: (1) when will the temple fall, (2) what is the sign of Your coming, (3) the end of the age",
      "Matthew 24:33-34 — 'When you see all these things, know that it is near... this generation will not pass away'",
      "Matthew 24:36 — 'But of that day and hour no one knows' — a clear shift showing the Second Coming's timing is unknown",
      "Luke 21:24 — 'Jerusalem will be trampled by the Gentiles until the times of the Gentiles are fulfilled' — an extended period beyond 70 AD",
      "Daniel 12:4 — 'Seal up the book until the time of the end' — the 'time of the end' is distinct from 70 AD",
    ],
    counterArguments: [
      "Matthew 24:3 contains three questions — the preterist collapses them into one. Jesus answers the temple question first (v.4-28), then shifts to the cosmic Second Coming (v.29-31), then gives the fig tree parable (v.32-34) about recognizing signs, then declares the timing unknown (v.36).",
      "'This generation' can refer to the generation that sees these final signs — just as 'this generation' in Psalm 24:6 refers to a TYPE of people, not a chronological cohort.",
      "Even if 'this generation' refers to the first-century audience, it naturally applies to the preliminary signs (temple destruction, wars, famines) while the ultimate fulfillment (v.29-31) remains future.",
      "Luke 21:24 explicitly extends the timeline beyond 70 AD — 'until the times of the Gentiles are fulfilled' — indicating a long period of Gentile dominion over Jerusalem.",
      "Matthew 24:36 is a decisive text: immediately after the 'this generation' statement, Jesus says no one knows the day or hour — proving the Second Coming was NOT expected within 40 years.",
    ],
    closingStatement:
      "If 'this generation' forced everything into a 40-year window, then Matthew 24:36 — 'of that day and hour no one knows' — would be meaningless. Why declare the timing unknowable if it was supposed to happen within the lifetime of the audience? The structure of the Olivet Discourse itself refutes the preterist interpretation.",
  },
  {
    subjectId: "anti-year-day-principle",
    title: "The Year-Day Principle: Scriptural Foundation and Prophetic Accuracy",
    sdaPosition:
      "The year-day principle is not a human invention — it is established by God Himself in Numbers 14:34 and Ezekiel 4:6, and it is confirmed by the precise historical fulfillment of Daniel's time prophecies when applied using this principle.",
    keyScriptures: [
      "Numbers 14:34 — 'According to the number of the days in which you spied out the land, forty days, for each day you shall bear your guilt one year'",
      "Ezekiel 4:6 — 'I have laid on you a day for each year'",
      "Daniel 9:24-27 — The 70-week (490-day/year) prophecy, beginning 457 BC, predicts the Messiah's appearance and death with stunning accuracy",
      "Daniel 8:14 — 2,300 evenings-mornings (= years), reaching from 457 BC to 1844 AD",
      "Daniel 7:25 — 'Time, times, and half a time' = 1,260 day/years of papal supremacy (538-1798 AD)",
    ],
    counterArguments: [
      "Numbers 14:34 and Ezekiel 4:6 are explicit divine declarations of the day-year equivalence. These are not 'proof texts ripped from context' — they establish a hermeneutical principle that God Himself uses in His dealings with Israel.",
      "The 70-week prophecy of Daniel 9 is the ultimate test case. Starting from the decree of Artaxerxes in 457 BC, 69 weeks (483 years) reach to 27 AD — the exact year of Jesus' baptism and the beginning of His ministry. The 70th week places the crucifixion at 31 AD. This precision is impossible with literal days.",
      "If the 2,300 'evenings and mornings' were literal days (6.3 years), there is no historical event of sufficient magnitude to match. But 2,300 years from 457 BC reach to 1844 — the beginning of the antitypical Day of Atonement, the investigative judgment.",
      "The 1,260 days of Daniel 7:25 and Revelation 12:6, applied as years, match the period of papal supremacy from 538 AD to 1798 AD — when the Pope was taken captive by Napoleon's general. Literal days (3.5 years) produce no meaningful historical fulfillment.",
      "Even non-SDA historicist interpreters (Isaac Newton, Matthew Henry, Jonathan Edwards) recognized the year-day principle. It is not an SDA invention.",
    ],
    closingStatement:
      "The year-day principle is established by God in Scripture, confirmed by the precise fulfillment of the 70-week prophecy pointing to Christ's baptism and death, and validated by the 1,260-year period of papal supremacy. Dismissing it requires ignoring both the biblical foundation and the historical evidence that vindicates it.",
  },
  {
    subjectId: "no-future-second-coming",
    title: "The Literal, Visible, Bodily Return of Jesus Christ",
    sdaPosition:
      "The Second Coming of Jesus is a literal, visible, audible, bodily event that has not yet occurred. It is the 'blessed hope' of the Christian faith (Titus 2:13), promised by angels, apostles, and Christ Himself. To reduce it to a past metaphorical event is to deny the core hope of the gospel.",
    keyScriptures: [
      "Acts 1:9-11 — 'This same Jesus... will come back in the same way you have seen him go' — physically, visibly, from the sky",
      "Revelation 1:7 — 'Every eye will see Him, even those who pierced Him, and all tribes of the earth will mourn'",
      "1 Thessalonians 4:16-17 — 'The Lord Himself will descend from heaven with a shout... the dead in Christ will rise... caught up together'",
      "Matthew 24:27 — 'As lightning comes from the east and flashes to the west, so also will the coming of the Son of Man be'",
      "2 Peter 3:10-13 — 'The day of the Lord will come like a thief... the heavens will pass away with a great noise... the earth will be burned up'",
    ],
    counterArguments: [
      "Acts 1:11 is decisive: the angels said Jesus would return 'in the same way' He left — visibly ascending into the sky. Did Jesus visibly descend from the sky in 70 AD? No. The Roman armies are not the bodily return of Christ.",
      "Revelation 1:7 says 'every eye will see Him.' In 70 AD, only those in the Jerusalem area witnessed the destruction. The scope of 'every eye' is global — not local.",
      "1 Thessalonians 4:16-17 describes the dead literally rising and the living being caught up to meet the Lord in the air. The preterist must either spiritualize the bodily resurrection or claim it already happened — both positions are explicitly condemned in 2 Timothy 2:17-18 (Hymenaeus and Philetus, who said the resurrection had already passed).",
      "If the Second Coming already happened, then the resurrection already happened, death has already been defeated, and we are living in the new earth now — yet people still die, suffer, and sin. The preterist position creates an absurd reality that contradicts observable experience.",
      "The early church fathers — Ignatius, Justin Martyr, Irenaeus — all expected a future, literal return of Christ AFTER 70 AD. If the 'coming' happened in 70 AD, the entire post-70 AD church was deceived about its own foundational hope.",
    ],
    closingStatement:
      "The Second Coming is not a metaphor and not a past event. It is the literal, visible, glorious return of Jesus Christ — when the dead are raised, the living are transformed, sin is ended, and God's kingdom is established forever. Every attempt to relegate this hope to 70 AD crashes against Acts 1:11, 1 Thessalonians 4:16-17, and the plain testimony of Revelation 1:7.",
  },
  {
    subjectId: "audience-relevance-hermeneutic",
    title: "Revelation's Scope: From the First Century to Eternity",
    sdaPosition:
      "Revelation was indeed written to first-century churches — but its prophetic scope extends from John's day through the entire Christian age to the Second Coming and the new earth. The historicist method recognizes that Revelation is a prophetic panorama of church history, not a document limited to one generation.",
    keyScriptures: [
      "Revelation 1:19 — 'Write the things which you have seen, the things which are, and the things which will take place after this' — three timeframes, not one",
      "Revelation 4:1 — 'I will show you things which must take place after this' — explicitly future from John's perspective",
      "Revelation 12:6 — The woman (church) flees into the wilderness for 1,260 days — a period spanning centuries of persecution",
      "Revelation 14:6-12 — The three angels' messages go to 'every nation, tribe, tongue, and people' — global, not local to Judea",
      "Revelation 20-22 — The millennium, final judgment, new heaven and earth — events that transcend any first-century horizon",
    ],
    counterArguments: [
      "Revelation 1:19 itself provides a three-part outline: past ('things which you have seen'), present ('things which are'), and future ('things which will take place after this'). The preterist collapses the third category into the first century.",
      "The seven churches of Revelation 2-3 are real first-century churches AND prophetic types representing seven eras of church history. This dual application is consistent with how God uses historical entities as prophetic symbols throughout Scripture.",
      "The 1,260 days of Revelation 12:6 (= 1,260 years via year-day), the 42 months of Revelation 13:5, and the 'time, times, and half a time' of Revelation 12:14 all describe the same extended period of persecution that historically matches the era of papal supremacy (538-1798 AD) — far beyond the first century.",
      "The three angels' messages of Revelation 14 address 'every nation, tribe, tongue, and people.' By the first century, the gospel had reached a fraction of the world. This is an end-time proclamation, not a first-century one.",
      "If Revelation is entirely about first-century events, then the new heaven and new earth (Rev 21), the tree of life (Rev 22:2), and 'no more death' (Rev 21:4) must already exist. They do not. The audience-relevance principle has legitimate use but cannot override the text's own scope markers.",
    ],
    closingStatement:
      "Revelation was addressed to first-century churches to encourage them, but its prophetic vision spans from their day to eternity. The historicist method — shared by the Reformers, the Millerite movement, and Seventh-day Adventists — reads Revelation as a divinely inspired map of church history, not a localized first-century pamphlet. The audience-relevance hermeneutic, when taken to the preterist extreme, shrinks the infinite scope of God's prophetic word down to a single generation.",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules = [
  {
    id: "mod-pret-1",
    subjectId: "all-prophecy-fulfilled-70ad",
    title: "Module 1: All Prophecy Fulfilled by 70 AD",
    doctrineBrief:
      "Full preterism teaches that all biblical prophecy — including the Second Coming, the resurrection, and the final judgment — was fulfilled by the destruction of Jerusalem in 70 AD. Partial preterism limits this to most prophecy while preserving a future bodily return. Both forms deny the historicist prophetic framework and the ongoing prophetic significance of post-70 AD history.",
    steelmanArguments: [steelmanArguments[0], steelmanArguments[5]],
    hiddenAssumptions: [
      "Assumes that the destruction of a single city constitutes the fulfillment of worldwide, cosmic prophecy",
      "Requires that the 'new heaven and new earth' (Rev 21) be purely spiritual — already present — despite ongoing death, suffering, and sin",
      "Ignores the scope of Daniel's four-kingdom prophecy, which extends through Rome to the establishment of God's eternal kingdom",
      "Treats Josephus as a quasi-inspired interpreter of Revelation",
    ],
    mindGames: [mindGames[0], mindGames[2]],
    fallacies: [fallacies[0], fallacies[4]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "preterist",
    debriefPrompt:
      "Reflect on how the preterist reduces global, cosmic prophecy to a local event. How does the historicist framework preserve both the significance of 70 AD and the future hope of the Second Coming? How does Daniel 8:14 anchor the prophetic timeline beyond 70 AD?",
  },
  {
    id: "mod-pret-2",
    subjectId: "this-generation-argument",
    title: "Module 2: The 'This Generation' Argument",
    doctrineBrief:
      "The preterist builds much of their system on Jesus' statement 'this generation will not pass away until all these things take place' (Matt 24:34). They argue this forces all of Matthew 24 into a 40-year window ending in 70 AD. Understanding the structure of the Olivet Discourse and the principle of prophetic telescoping is essential to answering this challenge.",
    steelmanArguments: [steelmanArguments[1]],
    hiddenAssumptions: [
      "Collapses three distinct questions (Matt 24:3) into one",
      "Ignores the 'no one knows the day or hour' statement in v.36, which is meaningless if fulfillment was expected within one generation",
      "Assumes 'genea' can ONLY mean a chronological generation, not a type or class of people",
      "Does not account for Luke 21:24's 'times of the Gentiles' extending well beyond 70 AD",
    ],
    mindGames: [mindGames[0]],
    fallacies: [fallacies[2]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "preterist",
    debriefPrompt:
      "How does Matthew 24:36 function as a key rebuttal to the preterist 'this generation' argument? Practice articulating the three questions of Matthew 24:3 and how Jesus answers each one in sequence.",
  },
  {
    id: "mod-pret-3",
    subjectId: "anti-year-day-principle",
    title: "Module 3: Defending the Year-Day Principle",
    doctrineBrief:
      "The preterist (and futurist) rejection of the year-day principle strikes at the heart of the historicist prophetic framework. Without it, the 2,300-day prophecy, the 1,260-day prophecy, and the 70-week prophecy lose their historical-prophetic precision. Defending this principle from Scripture is a critical apologetic skill for SDA believers.",
    steelmanArguments: [steelmanArguments[2]],
    hiddenAssumptions: [
      "Claims the principle is a 'medieval invention' despite its scriptural basis in Numbers 14:34 and Ezekiel 4:6",
      "Misidentifies Daniel 8:14's 'ereb boqer' as half-day units when the Hebrew follows the Genesis 1 full-day pattern",
      "Forces Antiochus IV into Daniel 8 despite the vision explicitly extending to 'the time of the end' (Dan 8:17)",
      "Cannot account for the 70-week prophecy's precise fulfillment using year-day calculation",
    ],
    mindGames: [mindGames[1]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "preterist",
    debriefPrompt:
      "Practice walking through the 70-week prophecy calculation: 457 BC decree -> 69 weeks (483 years) -> 27 AD baptism -> middle of the 70th week -> 31 AD crucifixion. Then extend to Daniel 8:14: 457 BC + 2,300 years = 1844 AD. How does this mathematical precision validate the year-day principle?",
  },
  {
    id: "mod-pret-4",
    subjectId: "no-future-second-coming",
    title: "Module 4: The Literal Second Coming",
    doctrineBrief:
      "The preterist denial of a future, physical Second Coming is perhaps the most dangerous element of their system. It removes the 'blessed hope' (Titus 2:13) that has sustained believers for two millennia and replaces it with a past event that no one witnessed as a 'coming.' Defending the literal return of Christ is fundamental to the gospel itself.",
    steelmanArguments: [steelmanArguments[3]],
    hiddenAssumptions: [
      "Equates OT judgment-coming language with the NT's explicit descriptions of a physical, visible return",
      "Cannot explain Acts 1:11's 'in the same way you have seen Him go' without spiritualizing or ignoring it",
      "Must spiritualize 1 Thessalonians 4:16-17's bodily resurrection, which Paul warned against (2 Tim 2:17-18)",
      "If the coming already happened, the entire post-70 AD church — including the church fathers — was wrong about its most basic hope",
    ],
    mindGames: [mindGames[3]],
    fallacies: [fallacies[1], fallacies[4]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "preterist",
    debriefPrompt:
      "Memorize Acts 1:11, Revelation 1:7, and 1 Thessalonians 4:16-17. Practice presenting these three texts as a unified testimony to the literal Second Coming. How would you respond if the preterist says 'every eye will see Him' is figurative?",
  },
  {
    id: "mod-pret-5",
    subjectId: "audience-relevance-hermeneutic",
    title: "Module 5: Beyond Audience Relevance",
    doctrineBrief:
      "The audience-relevance hermeneutic asserts that biblical texts mean primarily (or exclusively) what they meant to their original audience. While honoring original context is important, this principle becomes destructive when it is used to lock all prophetic meaning into the first century. The historicist method affirms original relevance while also recognizing that God's prophetic word unfolds across centuries.",
    steelmanArguments: [steelmanArguments[4]],
    hiddenAssumptions: [
      "Confuses 'relevant to' with 'limited to' — a text can be relevant to its original audience while having broader prophetic scope",
      "Ignores Revelation 1:19's three-timeframe outline (past, present, and future from John's perspective)",
      "Cannot explain why Revelation 20-22 describes events — the millennium, the lake of fire, the new earth — that clearly transcend the first century",
      "The prophets themselves did not fully understand their own prophecies (1 Peter 1:10-12), so 'original audience understanding' is not the ceiling of meaning",
    ],
    mindGames: [mindGames[1], mindGames[3]],
    fallacies: [fallacies[3], fallacies[0]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "preterist",
    debriefPrompt:
      "Consider the implications of 1 Peter 1:10-12 — the prophets searched and inquired about their own prophecies, and it was revealed that they were serving not themselves but 'you' (future believers). How does this text dismantle the audience-relevance hermeneutic's claim that prophetic meaning is limited to the original audience?",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const preteristTraining: AATSAvatarTraining = {
  avatarId: "preterist",
  avatarName: "The Preterist",
  emoji: "\u{1F4DC}",
  color: "border-stone-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
