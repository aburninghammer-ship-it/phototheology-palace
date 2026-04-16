// ─── AATS: Skeptical Ex-SDA Avatar Training Data ─────────────────────────────
// Comprehensive training curriculum for defending SDA faith against skeptical ex-Adventist arguments.

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ─────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "emotional-trauma",
    title: "Emotional Trauma from Adventism",
    description:
      "The claim that growing up Adventist causes lasting psychological harm through fear-based theology, social isolation, dietary guilt, and a culture of perfectionism that leaves deep emotional scars.",
  },
  {
    id: "ij-anxiety",
    title: "Investigative Judgment as Anxiety Engine",
    description:
      "The argument that the doctrine of the investigative judgment creates crippling anxiety by teaching that every sin is being reviewed in heaven's court and that one could be lost at any moment if not perfectly confessing every wrong.",
  },
  {
    id: "egw-manipulation",
    title: "EGW Manipulation Claims",
    description:
      "The charge that Ellen G. White used claimed visions and prophetic authority to manipulate, control, and psychologically dominate early Adventists, and that her writings continue to function as an instrument of institutional control.",
  },
  {
    id: "adventist-exceptionalism",
    title: "Adventist Exceptionalism Critique",
    description:
      "The objection that SDAs exhibit a cult-like mentality by claiming to be the 'remnant church' with unique end-time truth, fostering an us-versus-them worldview that isolates members from broader society.",
  },
  {
    id: "health-message-control",
    title: "Health Message as Control",
    description:
      "The claim that the SDA health message -- vegetarianism, abstinence from alcohol and tobacco, and lifestyle restrictions -- functions not as genuine health counsel but as a mechanism of social control and boundary maintenance.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "exsda-steelman-trauma-real",
    title: "Religious Trauma from Adventism Is Real and Documented",
    argument:
      "Thousands of former Adventists report the same cluster of symptoms: chronic anxiety about the end times, guilt over diet and entertainment, fear of the investigative judgment, social isolation from non-Adventist peers, and a pervasive sense that they could never be 'good enough.' These experiences are so consistent across different congregations and countries that they cannot be dismissed as individual weakness. Religious Trauma Syndrome is recognized by therapists who specialize in religious deconstruction, and Adventism consistently appears among the traditions most frequently cited by those seeking treatment.",
    hiddenAssumptions: [
      "Negative experiences in a community disprove the truth claims of that community -- but bad teaching or harsh culture does not refute sound doctrine.",
      "All Adventist churches produce these outcomes -- generalizes from worst-case congregations to the entire movement.",
      "The emotional pain is caused by the doctrine itself rather than by distorted applications of the doctrine.",
    ],
    sdaResponse:
      "SDAs take religious trauma seriously and acknowledge that some congregations have communicated truth in harmful ways. However, the abuse of a truth does not invalidate the truth itself. A physician who delivers a cancer diagnosis harshly does not make the diagnosis false. The gospel is 'good news' (Isaiah 61:1-3), and any presentation that produces only fear without hope is a distortion of SDA theology. Rightly understood, the investigative judgment is assurance (1 John 2:1 -- 'we have an Advocate with the Father'), not terror. Ellen White herself wrote: 'We have nothing to fear for the future, except as we forget the way the Lord has led us' (Life Sketches, p. 196). The remedy for bad theology is better theology, not no theology.",
  },
  {
    id: "exsda-steelman-ij-fear",
    title: "The Investigative Judgment Creates Perpetual Insecurity",
    argument:
      "The doctrine of the investigative judgment teaches that beginning in 1844, every professed believer's life record is being examined in heaven. If any unconfessed sin remains, the person's name is blotted out of the book of life. This means that a believer can never have assurance of salvation -- they might have a forgotten sin that disqualifies them. The practical result is a community where people live in constant low-grade terror, performing righteousness to pass a heavenly audit rather than resting in grace.",
    hiddenAssumptions: [
      "The IJ is about God discovering information He does not already know -- misunderstands the purpose as vindication before the universe, not divine fact-finding.",
      "Forgotten sins doom believers -- ignores that confession is about the posture of the heart, not a perfect memory inventory.",
      "Assurance of salvation requires the impossibility of apostasy -- conflates biblical assurance (confidence in Christ's work) with unconditional eternal security.",
    ],
    sdaResponse:
      "The investigative judgment, rightly understood, is not about God finding sins to condemn you but about Christ defending His people before the universe. Daniel 7:22 says 'judgment was given in favor of the saints.' Jesus is our Advocate (1 John 2:1), not our prosecutor. The purpose is to vindicate God's justice in saving sinners and to demonstrate to the watching universe that those who are saved genuinely chose to belong to Christ. Assurance comes not from the impossibility of falling away but from the faithfulness of our Advocate: 'He who began a good work in you will carry it on to completion' (Philippians 1:6). Adventists can and should have assurance -- not in their own perfection but in Christ's intercession.",
  },
  {
    id: "exsda-steelman-egw-control",
    title: "Ellen White Functioned as an Instrument of Control",
    argument:
      "Ellen White claimed divine visions that conveniently supported her positions on everything from diet to dress to institutional governance. She used these visions to override democratic processes, silence dissent, and consolidate power within the early Adventist movement. Members who questioned her visions were treated as questioning God Himself. Today, her writings still function as an extra-biblical authority that church leaders use to shut down discussion. This is indistinguishable from the control mechanisms found in high-demand religious groups.",
    hiddenAssumptions: [
      "Prophetic authority is inherently manipulative -- dismisses the possibility that genuine prophets exist and exercise legitimate spiritual authority.",
      "Any influence beyond personal persuasion is 'control' -- applies a standard that would delegitimize all religious leadership.",
      "EGW's writings override Scripture -- misrepresents the SDA position, which holds Scripture as the supreme authority and EGW as a 'lesser light' pointing to the 'greater light.'",
    ],
    sdaResponse:
      "SDAs hold that the gift of prophecy continues in the church (Ephesians 4:11-13; 1 Corinthians 12:28) and that Ellen White's ministry meets the biblical tests of a prophet (Isaiah 8:20; Matthew 7:15-20; Deuteronomy 18:21-22). However, her writings are not an addition to Scripture; they are a 'lesser light' leading to the 'greater light' of the Bible (Colossians Counsels, Introduction). The SDA Church has always maintained that the Bible is the supreme standard by which all teaching -- including Ellen White's -- must be tested. Abuses of her authority by individuals or congregations are real but do not reflect the church's official position. Jesus Himself exercised prophetic authority; the question is not whether prophetic authority can be misused (it can) but whether it is genuine.",
  },
  {
    id: "exsda-steelman-remnant-cult",
    title: "Remnant Theology Creates a Cult Mentality",
    argument:
      "SDAs believe they are the 'remnant church' of Revelation 12:17 -- the one true end-time people of God who 'keep the commandments of God and have the testimony of Jesus Christ.' This self-identification as uniquely chosen creates a classic in-group/out-group dynamic: members are taught that other Christians are part of 'Babylon,' that the world is hostile to Adventist truth, and that leaving the church means leaving God's protection. This siege mentality discourages critical thinking, makes it emotionally costly to leave, and mirrors the exclusivism found in recognized cults.",
    hiddenAssumptions: [
      "Any group that claims distinctive truth is automatically a cult -- but by this standard, the early Christians were a cult, and every denomination that believes it has something distinctive to offer is cultic.",
      "Remnant theology means SDAs believe they are the ONLY true Christians -- misrepresents the actual SDA position, which acknowledges sincere believers in all denominations.",
      "High social cost of leaving proves cultic control -- but leaving any tight-knit community (military, ethnic enclave, political movement) carries social costs without being a cult.",
    ],
    sdaResponse:
      "SDAs do identify as the remnant of Revelation 12:17, but this is a theological conviction about institutional mission, not a claim that individual SDAs are superior to other Christians. The SDA Church officially teaches that 'sincere Christians are found in all churches, including the Roman Catholic communion' (Questions on Doctrine, p. 197). Having distinctive truth does not make a group a cult; it makes it a denomination with convictions. The biblical test of a cult is not exclusivism but the denial of Christ's deity, salvation by grace, and the authority of Scripture (2 Peter 2:1; 1 John 4:1-3). SDAs affirm all three. The 'remnant' identity is a call to responsibility and mission, not a license for arrogance. Jesus said: 'From everyone who has been given much, much will be demanded' (Luke 12:48).",
  },
  {
    id: "exsda-steelman-health-control",
    title: "The Health Message Is Really About Social Control",
    argument:
      "The SDA health message -- vegetarianism, no alcohol, no caffeine, no unclean meats -- functions as a powerful social boundary marker that keeps members identifiable and separate from the broader culture. It creates constant micro-opportunities for guilt (did you eat the wrong thing?) and social policing (other members watching your plate). The health message is presented as divinely inspired through Ellen White's visions, but its real function is sociological: it reinforces group identity, creates compliance habits, and makes members dependent on the community for meal planning and social eating. This is a classic technique of high-demand groups.",
    hiddenAssumptions: [
      "Dietary practices motivated by religion are inherently controlling -- but this would indict Jewish kosher laws, Islamic halal, Hindu vegetarianism, and Buddhist dietary ethics equally.",
      "The health benefits are incidental or fabricated -- ignores the Adventist Health Studies (Loma Linda University) showing significantly lower rates of cancer, heart disease, and longer life expectancy.",
      "Social cohesion through shared practices equals manipulation -- conflates normal community-building with cult tactics.",
    ],
    sdaResponse:
      "The SDA health message is grounded in the biblical principle that the body is the temple of the Holy Spirit (1 Corinthians 6:19-20) and that believers should glorify God in what they eat and drink (1 Corinthians 10:31). The Adventist Health Studies conducted by Loma Linda University over decades have consistently demonstrated that the SDA lifestyle is associated with significantly longer life expectancy -- Adventist men live 7.3 years longer and women 4.4 years longer than the general population. The health message is not about legalism or control; it is about stewardship of the body God gave us. Leviticus 11 establishes the dietary principles in Scripture long before Ellen White. And the SDA Church has never made vegetarianism a test of membership; it is recommended, not required.",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "exsda-mg-trauma-weaponization",
    name: "Trauma Weaponization",
    description:
      "Using personal pain as an unassailable argument that shuts down theological discussion. Any attempt to address the doctrinal claims is deflected as 'invalidating my experience' or 'not caring about people.' The emotional weight of genuine suffering is leveraged to make the opponent feel that defending doctrine is inherently cruel.",
    example:
      "\"You can sit there and defend the investigative judgment all day, but I had panic attacks as a child because of that doctrine. How dare you tell me my experience doesn't matter?\" -- The pain is real, but the logical leap from 'this doctrine caused me pain' to 'this doctrine is false' is never justified.",
    detectionTip:
      "When you feel that responding to the theological argument would make you seem heartless, you're being emotionally manipulated. Acknowledge the pain genuinely (it's real), then gently redirect: 'Your pain is valid and I take it seriously. But can we also examine whether the doctrine itself teaches what you were taught it teaches? Because if it was misrepresented to you, that's a separate issue from whether it's true.'",
  },
  {
    id: "exsda-mg-insider-authority",
    name: "Insider Authority",
    description:
      "Claiming that only someone who has left Adventism can truly understand it. The ex-member positions themselves as the ultimate authority because they have 'seen behind the curtain,' while current members are dismissed as brainwashed or in denial. This creates an unfalsifiable dynamic where staying in the church is proof of delusion.",
    example:
      "\"You'll never understand because you're still in it. I used to think like you. Once you leave, you'll see how messed up it all is.\" -- This assumes that leaving produces clarity while staying produces blindness, but the reverse could equally be true.",
    detectionTip:
      "Watch for the claim that their perspective is uniquely valid because they left. Respond: 'Your experience inside and outside gives you valuable perspective. But by the same logic, my experience inside gives me perspective too. Can we evaluate the claims on their merits rather than on who has the right credentials?'",
  },
  {
    id: "exsda-mg-guilt-reversal",
    name: "Guilt Reversal",
    description:
      "Making you feel guilty for still believing what they once believed. The implication is that you are perpetuating harm by remaining in the church, and that your continued membership makes you complicit in the suffering of those who left. This leverages the natural empathy of believers against their own convictions.",
    example:
      "\"Every time you teach the Sabbath to children, you're setting them up for the same guilt and isolation I experienced. How can you do that to kids?\" -- This equates faithful teaching with abuse, making continued belief feel morally wrong.",
    detectionTip:
      "Recognize when your faith commitment is being reframed as moral failure. The accusation assumes that the negative outcome is intrinsic to the teaching rather than a result of distortion. Respond: 'I'm sorry for what you experienced. I believe these truths can be taught in a way that brings joy rather than fear. My responsibility is to teach them rightly, not to abandon them because they were taught wrongly to you.'",
  },
  {
    id: "exsda-mg-community-pressure",
    name: "Deconstruction Community Pressure",
    description:
      "Leveraging the growing ex-Adventist online community to create social proof that leaving is the enlightened choice. Ex-SDA podcasts, forums, and social media groups create an echo chamber where every negative Adventist experience is amplified and every positive one is dismissed as Stockholm syndrome.",
    example:
      "\"Thousands of people are leaving. All these podcasts, all these support groups -- doesn't that tell you something? Where there's smoke, there's fire.\" -- This appeals to popularity and social momentum rather than engaging the truth claims.",
    detectionTip:
      "Popularity is not a truth indicator. Throughout biblical history, the majority was often wrong (Matthew 7:13-14). The existence of a large ex-SDA community proves that many people have left, not that the reasons for leaving are sound. Ask: 'The early church lost members too (John 6:66). Does the size of the departing crowd tell us whether Jesus' teaching was true?'",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "exsda-fallacy-anecdotal",
    name: "Anecdotal Fallacy",
    definition:
      "Using personal stories or selected negative experiences as if they constitute proof that Adventist doctrine is false. Individual negative experiences, however genuine and painful, do not logically disprove the truth claims of a theological system.",
    example:
      "\"My grandmother was terrified of the investigative judgment her whole life and died anxious. That doctrine is evil.\" -- The grandmother's suffering is real and heartbreaking, but it tells us about how the doctrine was communicated to her, not whether the doctrine is true.",
    counterMove:
      "Honor the experience while distinguishing experience from truth. Say: 'I'm genuinely sorry about your grandmother's fear. That should not have been her experience. But can we look at what the doctrine actually teaches? Because Daniel 7:22 says judgment was given IN FAVOR of the saints. If she was taught a distorted version, the answer is correction, not abandonment.'",
  },
  {
    id: "exsda-fallacy-genetic",
    name: "Genetic Fallacy (Origin Attack)",
    definition:
      "Dismissing SDA beliefs by attacking their historical origins -- particularly the 1844 Great Disappointment -- rather than evaluating their biblical merits. The fact that a doctrine emerged from a painful historical experience does not determine whether it is biblically sound.",
    example:
      "\"The whole church started because William Miller was wrong about 1844. It's a movement built on a failed prediction. Why would I trust anything that comes from that?\" -- This judges the current theological system by its messy origins rather than by its biblical arguments.",
    counterMove:
      "Name the fallacy: 'That's the genetic fallacy -- judging a belief by its origin rather than its content.' Then note historical parallels: 'Christianity itself began with disciples who misunderstood Jesus' mission (they expected a political kingdom). Their initial misunderstanding didn't invalidate the truth they later understood. The question is: does Daniel 8:14 teach a heavenly event? Let's look at the text.'",
  },
  {
    id: "exsda-fallacy-composition",
    name: "Fallacy of Composition",
    definition:
      "Assuming that because some Adventist congregations or individuals are harmful, the entire denomination and its theology are harmful. This takes the worst examples and treats them as representative of the whole.",
    example:
      "\"My church was judgmental, legalistic, and controlling. My pastor was a narcissist. Adventism is toxic.\" -- This extrapolates from one local experience to a global movement of 22 million members across vastly different cultures.",
    counterMove:
      "Acknowledge the specific experience while challenging the generalization: 'Your church experience sounds genuinely harmful, and I'm sorry. But would you judge all public schools by the worst school in the country? The SDA Church has 22+ million members in over 200 countries. Experiences vary enormously. The question is whether the teachings themselves, rightly understood, are true -- not whether every congregation applies them well.'",
  },
  {
    id: "exsda-fallacy-appeal-emotion",
    name: "Appeal to Emotion",
    definition:
      "Substituting emotional intensity for logical argument. Stories of pain, fear, and loss are presented as if the depth of the emotion proves the falsity of the belief. The more intense the suffering described, the less the audience feels they can question the conclusion.",
    example:
      "\"I cried every night as a teenager because I was sure I wasn't going to be saved. If you defend that theology, you're defending child abuse.\" -- The emotional weight is overwhelming, but the logical structure is: 'I suffered, therefore the theology is false,' which is a non sequitur.",
    counterMove:
      "Lead with empathy, then gently introduce logic: 'No teenager should cry themselves to sleep over theology. Something went terribly wrong in how this was communicated to you, and I grieve that. But consider: many people have found deep peace, joy, and assurance in these same doctrines. The difference is how they were taught. The doctrine that Jesus is your Advocate (1 John 2:1) should produce confidence, not terror. Can we explore what went wrong in the teaching rather than discarding the teaching itself?'",
  },
];

// ── Counter Strategies ───────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "emotional-trauma",
    title: "Responding to Religious Trauma Claims with Compassion and Truth",
    sdaPosition:
      "SDAs acknowledge that some members have experienced genuine harm within Adventist communities due to legalism, fear-based preaching, social isolation, and perfectionist culture. These experiences are real and grievous. However, the existence of distorted applications does not invalidate the doctrines themselves. The SDA gospel, rightly understood, is a message of grace, assurance, and hope: we are saved by grace through faith (Ephesians 2:8-9), justified freely by Christ's blood (Romans 3:24), and kept by the power of God (1 Peter 1:5). The remedy for bad Adventism is better Adventism -- a return to the Christ-centered, grace-filled, hope-anchored faith of Scripture.",
    keyScriptures: [
      "Isaiah 61:1-3 -- 'The Lord has anointed me to proclaim good news to the poor... to bind up the brokenhearted... to comfort all who mourn.' The gospel is healing, not harm.",
      "1 John 4:18 -- 'There is no fear in love. But perfect love drives out fear.' Fear-based religion is a distortion of the gospel.",
      "Romans 8:1 -- 'There is now no condemnation for those who are in Christ Jesus.' The gospel's first word to believers is freedom from condemnation.",
      "Matthew 11:28-30 -- 'Come to me, all you who are weary and burdened, and I will give you rest.' Jesus offers rest, not anxiety.",
    ],
    counterArguments: [
      "The abuse of a truth does not invalidate the truth. A doctor who prescribes the right medicine in a harsh manner does not make the medicine wrong. The issue is delivery, not doctrine.",
      "Millions of Adventists worldwide experience their faith as a source of deep joy, purpose, community, and hope. The trauma narrative, while valid for some, is not the universal Adventist experience.",
      "Many who experience religious trauma carry wounds from specific people and specific congregations, not from the theology itself. Directing anger at the doctrine rather than the distortion prevents genuine healing.",
      "The Bible itself acknowledges that truth can be taught in harmful ways (Matthew 23:4 -- the Pharisees loaded heavy burdens on people). Jesus' remedy was not to abandon God's law but to teach it with grace and mercy.",
    ],
    closingStatement:
      "We hear you. Your pain matters. But we invite you to distinguish between the message and the messengers who failed you. The Adventist faith, at its core, is a love story -- a cosmic narrative of a God who pursues His wayward creation, gives His Son to redeem them, and promises to return and make everything new. If that story was told to you as a horror story, you were told it wrong. Come back and hear it told rightly.",
  },
  {
    subjectId: "ij-anxiety",
    title: "Reclaiming the Investigative Judgment as Gospel Assurance",
    sdaPosition:
      "The investigative judgment (Daniel 7:9-14; 8:14) is not a doctrine of terror but of vindication. It teaches that Christ, our High Priest and Advocate, stands before the Father and the watching universe to defend His people. The judgment reveals that those who have placed their faith in Christ are genuinely His -- not because they achieved sinless perfection but because they maintained a living relationship of trust and surrender. The judgment is 'in favor of the saints' (Daniel 7:22). It answers the cosmic question of the great controversy: can God be trusted? And it assures believers that their salvation, secured by Christ's blood, will be publicly vindicated before all creation.",
    keyScriptures: [
      "Daniel 7:22 -- 'Judgment was given in favor of the saints of the Most High.' The verdict is FOR God's people, not against them.",
      "1 John 2:1 -- 'If anyone sins, we have an Advocate with the Father -- Jesus Christ the Righteous.' Christ is our defense attorney, not our prosecutor.",
      "Hebrews 7:25 -- 'He is able to save completely those who come to God through him, because he always lives to intercede for them.' Christ's intercession is ongoing and effectual.",
      "Romans 8:33-34 -- 'Who will bring any charge against those whom God has chosen? It is God who justifies. Who then is the one who condemns?' No charge can stand against Christ's justified ones.",
    ],
    counterArguments: [
      "The investigative judgment is about Christ defending us, not prosecuting us. The heavenly court scene in Daniel 7 ends with the Ancient of Days ruling IN FAVOR of the saints (v. 22). This is assurance, not anxiety.",
      "The judgment vindicates God before the universe. It demonstrates that God is just in saving sinners -- that He does not exercise arbitrary favoritism but saves those who have genuinely received His grace by faith.",
      "Biblical assurance does not require unconditional eternal security. A married person can be assured of their spouse's love without believing that the marriage is indestructible regardless of their behavior. Assurance is relational, not mechanical.",
      "Ellen White wrote: 'Jesus appears as their Advocate, to plead in their behalf before God... While Jesus is pleading for the subjects of His grace, Satan accuses them. But their Advocate presents the effectual offering of His blood' (The Great Controversy, p. 484). This is a comfort passage, not a terror passage.",
    ],
    closingStatement:
      "The investigative judgment, rightly understood, is one of the most comforting doctrines in all of Christianity. It means that Jesus Christ Himself stands in heaven's court as your personal Advocate, pointing to His own blood as the basis for your acquittal. The verdict has already been rendered at the cross -- 'It is finished.' The investigative judgment simply makes that verdict public before the universe. You have nothing to fear in a courtroom where your Lawyer is also the Judge's Son, and where the evidence in your favor is the blood of God Himself.",
  },
  {
    subjectId: "egw-manipulation",
    title: "Defending the Prophetic Gift Against Manipulation Charges",
    sdaPosition:
      "SDAs believe that the gift of prophecy is a continuing gift of the Holy Spirit (Ephesians 4:11-13; 1 Corinthians 12:28) and that Ellen White's ministry meets the biblical criteria for a genuine prophetic gift (Isaiah 8:20; Deuteronomy 18:21-22; Matthew 7:15-20). Her writings are not an addition to the biblical canon but a 'lesser light' pointing to the 'greater light' of Scripture. The charge of 'manipulation' must be evaluated against the actual content of her writings, which consistently uplift Christ, call people to Scripture, promote health and education, and advocate for religious liberty. Prophets in every era have been accused of control; the question is whether the prophetic gift is genuine, not whether it can be misused.",
    keyScriptures: [
      "Ephesians 4:11-13 -- 'He gave some to be prophets... until we all reach unity in the faith.' The prophetic gift continues until Christ's return.",
      "1 Thessalonians 5:19-21 -- 'Do not quench the Spirit. Do not treat prophecies with contempt but test them all.' The command is to test, not to reject outright.",
      "Amos 3:7 -- 'Surely the Sovereign Lord does nothing without revealing his plan to his servants the prophets.' God communicates through prophets.",
      "Revelation 12:17 -- 'The testimony of Jesus' (interpreted as the spirit of prophecy, Rev 19:10) is a mark of the remnant church.",
    ],
    counterArguments: [
      "Every biblical prophet was accused of manipulation or madness by their contemporaries (Jeremiah was imprisoned, Elijah was hunted, Jesus was called demon-possessed). The accusation itself is not evidence.",
      "Ellen White consistently pointed people to Scripture, not to herself. She wrote: 'The Bible, and the Bible alone, is to be our creed' (Selected Messages, vol. 1, p. 416). A manipulator elevates their own authority; she elevated the Bible.",
      "The 'fruits test' (Matthew 7:15-20) applied to her ministry shows: the establishment of a worldwide educational system, a world-class health system (Loma Linda University), a global humanitarian organization (ADRA), and consistent Christ-centered theology.",
      "Accusations of control must be weighed against her advocacy for religious liberty, her opposition to slavery, her promotion of women's roles in ministry, and her insistence on personal Bible study -- none of which are hallmarks of a manipulative leader.",
    ],
    closingStatement:
      "The question is not whether prophetic authority can be misused -- it certainly can, and individuals have misused Ellen White's writings. The question is whether the prophetic gift is genuine. Apply the biblical tests: Does it align with Scripture? Does it uplift Christ? Does it produce good fruit? Does it accurately represent God's character? Evaluated honestly, Ellen White's ministry passes these tests. Rejecting the gift because some have distorted it is like rejecting Scripture because false teachers have twisted it (2 Peter 3:16).",
  },
  {
    subjectId: "adventist-exceptionalism",
    title: "Defending Remnant Identity Without Arrogance",
    sdaPosition:
      "SDAs identify as the remnant of Revelation 12:17 based on two identifying marks: keeping 'the commandments of God' (including the seventh-day Sabbath) and having 'the testimony of Jesus Christ' (the spirit of prophecy). This is not a claim of moral superiority but an identification of institutional mission and doctrinal markers. SDAs officially teach that God has sincere followers in every Christian communion and that the remnant is defined by truth faithfully held, not by exclusive possession of God's favor. The remnant calling is one of responsibility and service, not of triumphalism.",
    keyScriptures: [
      "Revelation 12:17 -- 'The dragon was enraged at the woman and went to make war with the rest of her offspring, who keep the commandments of God and have the testimony of Jesus Christ.'",
      "Revelation 14:6-12 -- The three angels' messages, which SDAs understand as their unique end-time commission to the world.",
      "John 10:16 -- 'I have other sheep that are not of this sheep pen. I must bring them also.' Jesus has followers beyond any single fold.",
      "Luke 12:48 -- 'From everyone who has been given much, much will be demanded.' Remnant identity is about greater responsibility, not greater status.",
    ],
    counterArguments: [
      "Every denomination believes it has distinctive truth to offer; otherwise, why exist? Having convictions about one's mission is not cultic -- it is the basis of all organized religious life. Catholics, Baptists, and Pentecostals all believe they have unique contributions.",
      "The SDA Church officially acknowledges sincere Christians in all denominations. The remnant concept is about institutional faithfulness to specific biblical truths (Sabbath, state of the dead, sanctuary, health), not about individual superiority.",
      "The word 'cult' has specific sociological markers: authoritarian leadership, financial exploitation, information control, inability to leave, and denial of core Christian doctrines. SDAs have democratic governance, transparent finances, free access to outside information, and members leave freely every day.",
      "Adventist 'exceptionalism' is actually Adventist 'commissionism' -- we believe we have been given a specific message for a specific time (Revelation 14:6-12). This is no different from Jonah being sent to Nineveh or Paul being sent to the Gentiles. The message is urgent, not the messengers' egos.",
    ],
    closingStatement:
      "Identifying as the remnant is not arrogance; it is accountability. We believe God has entrusted specific truths to this movement for this moment in history. That belief comes with a heavy burden of responsibility, not a badge of superiority. The remnant is called to proclaim, not to boast. And if we fail to live up to the love, humility, and grace that should characterize those who carry heaven's final message, the fault is ours -- not the message's.",
  },
  {
    subjectId: "health-message-control",
    title: "Defending the Health Message as Biblical Stewardship",
    sdaPosition:
      "The SDA health message is rooted in the biblical principle that the body is the temple of the Holy Spirit (1 Corinthians 6:19-20) and that believers should glorify God in all things, including eating and drinking (1 Corinthians 10:31). The dietary guidelines in Leviticus 11 and the original Edenic diet (Genesis 1:29) provide the scriptural foundation. This is not social control but holistic stewardship -- caring for the body God gave us. The Adventist Health Studies from Loma Linda University provide robust empirical validation, showing that Adventists live significantly longer and healthier lives than the general population.",
    keyScriptures: [
      "1 Corinthians 6:19-20 -- 'Do you not know that your bodies are temples of the Holy Spirit? ... Therefore honor God with your bodies.'",
      "1 Corinthians 10:31 -- 'Whether you eat or drink or whatever you do, do it all for the glory of God.'",
      "Genesis 1:29 -- 'I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food.' God's original diet was plant-based.",
      "3 John 1:2 -- 'Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well.' God cares about physical health.",
    ],
    counterArguments: [
      "The Adventist Health Studies (Loma Linda University, spanning decades and tens of thousands of participants) demonstrate that the SDA lifestyle is associated with 7-10 years of additional life expectancy. This is empirical vindication, not social control.",
      "Vegetarianism is recommended, not required for church membership. There is no 'food police' in official SDA theology. Individual choice is respected within the framework of biblical principle.",
      "Every culture has dietary norms (kosher, halal, vegan, organic). Having a faith-based dietary ethic is universal in religion, not a unique mark of cult control. The question is whether it is grounded in good principles, and the science supports SDA health practices.",
      "The health message protects people from the leading causes of preventable death: heart disease, cancer, diabetes, and addiction. Framing genuine health protection as 'control' reveals more about the critic's framework than about the practice itself.",
    ],
    closingStatement:
      "The SDA health message has been vindicated by some of the most rigorous longitudinal health studies in history. Adventists in Loma Linda, California are one of the world's five Blue Zones -- regions where people live measurably longer, healthier lives. This is not social control; it is divinely inspired health counsel that science has progressively confirmed. God cares about the whole person -- body, mind, and spirit. The health message is His gift of care, not a chain of control.",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ────── Module 1: Emotional Trauma ──────
  {
    id: "exsda-mod-emotional-trauma",
    subjectId: "emotional-trauma",
    title: "Responding to Religious Trauma: Compassion Meets Truth",
    doctrineBrief:
      "The claim that Adventism causes religious trauma is one of the most emotionally charged challenges a believer will face. Former members describe genuine experiences of fear, guilt, isolation, and anxiety that they attribute to Adventist theology and culture. These stories are often heartbreaking and must be taken seriously.\n\nHowever, the critical distinction is between the theology itself and the way the theology was communicated. Fear-based preaching, legalistic perfectionism, and social shaming are distortions of the Adventist gospel, not expressions of it. The Bible presents God as a loving Father (1 John 4:8), salvation as a gift of grace (Ephesians 2:8-9), and the Christian life as one of freedom and joy (Galatians 5:1; Philippians 4:4).\n\nSDAs must learn to lead with empathy and compassion in these conversations while gently pointing out that the remedy for distorted teaching is not the abandonment of truth but its faithful recovery. Jesus reserved His harshest words for those who loaded heavy burdens on others (Matthew 23:4), but His remedy was not to abolish God's law -- it was to show what the law looks like when lived through love.",
    steelmanArguments: [
      steelmanArguments[0], // Religious trauma is real
      steelmanArguments[1], // IJ creates insecurity
    ],
    hiddenAssumptions: [
      "Painful experiences caused by a teaching prove the teaching is false -- but pain caused by distortion proves the distortion is harmful, not that the underlying truth is wrong.",
      "All Adventist experiences are negative -- survivorship bias means those with positive experiences are less visible in deconstruction spaces.",
      "Leaving Adventism is the only path to healing -- ignores those who found healing by understanding their faith more deeply.",
    ],
    mindGames: [
      mindGames[0], // Trauma Weaponization
      mindGames[2], // Guilt Reversal
    ],
    fallacies: [
      fallacies[0], // Anecdotal Fallacy
      fallacies[3], // Appeal to Emotion
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "skeptical-exsda",
    debriefPrompt:
      "Reflect on this encounter with the emotional trauma argument. Were you able to lead with genuine empathy before addressing the logical issues? Could you distinguish between the theology and its distorted application? Did you avoid being dismissive of real pain while still defending the truth? What would you do differently to better balance compassion and conviction?",
  },
  // ────── Module 2: Investigative Judgment Anxiety ──────
  {
    id: "exsda-mod-ij-anxiety",
    subjectId: "ij-anxiety",
    title: "The Investigative Judgment: Terror or Triumph?",
    doctrineBrief:
      "The investigative judgment is perhaps the most misunderstood and misrepresented doctrine in Adventism -- both by critics and by well-meaning Adventists who have presented it as a source of fear rather than assurance. The doctrine, based on Daniel 7:9-14 and Daniel 8:14, teaches that a phase of Christ's high-priestly ministry in the heavenly sanctuary involves the examination of the life records of professed believers.\n\nCritics portray this as a terrifying divine audit where one forgotten sin can cost you eternity. But this presentation fundamentally misunderstands the purpose and nature of the judgment. Daniel 7:22 states that 'judgment was given in favor of the saints.' Christ is not the prosecutor in this judgment; He is the Advocate (1 John 2:1), the Defense Attorney who presents His own blood as the evidence for our acquittal.\n\nThe investigative judgment answers the cosmic question of the great controversy: How can a just God justify sinners? The answer, displayed before the watching universe, is the blood of Christ applied to those who have received it by faith. Far from producing anxiety, this doctrine should produce profound assurance: the God of the universe has a legal proceeding in place whose entire purpose is to vindicate His right to save you.",
    steelmanArguments: [
      steelmanArguments[1], // IJ creates insecurity
      steelmanArguments[0], // Religious trauma is real
    ],
    hiddenAssumptions: [
      "The IJ is about God discovering unknown information -- misunderstands it as divine vindication before the universe, not fact-finding.",
      "Assurance requires the impossibility of apostasy -- biblical assurance is confidence in Christ's faithfulness, not a guarantee independent of ongoing relationship.",
      "Any judgment involving believers is inherently threatening -- ignores that the judgment is structured in the believer's favor with Christ as Advocate.",
    ],
    mindGames: [
      mindGames[0], // Trauma Weaponization
      mindGames[1], // Insider Authority
    ],
    fallacies: [
      fallacies[3], // Appeal to Emotion
      fallacies[1], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "skeptical-exsda",
    debriefPrompt:
      "Evaluate your defense of the investigative judgment. Were you able to present it as a doctrine of assurance rather than anxiety? Could you explain the cosmic purpose of the judgment in the great controversy framework? Did you effectively use Daniel 7:22, 1 John 2:1, and Romans 8:33-34 to show the pro-defendant nature of this judgment? How might you better communicate this doctrine with both theological precision and pastoral warmth?",
  },
  // ────── Module 3: EGW Manipulation ──────
  {
    id: "exsda-mod-egw-manipulation",
    subjectId: "egw-manipulation",
    title: "Ellen White: Prophet or Manipulator?",
    doctrineBrief:
      "The charge that Ellen White functioned as a religious manipulator is a central pillar of ex-Adventist argumentation. Critics point to her extensive influence over early Adventist governance, her claims of divine visions that supported her positions, and the way her writings have been used to enforce conformity in some Adventist communities.\n\nResponding to this charge requires careful distinction between three separate questions: (1) Did Ellen White's ministry meet the biblical criteria for a genuine prophetic gift? (2) Did she personally misuse her influence? (3) Have others subsequently misused her authority? These are three different questions with potentially different answers.\n\nThe biblical tests of a prophet include: consistency with Scripture (Isaiah 8:20), fulfilled predictions (Deuteronomy 18:21-22), uplifting Christ (1 John 4:2), and producing good fruit (Matthew 7:15-20). SDAs believe Ellen White's ministry meets all four tests. The misuse of her authority by individuals or institutions is a separate issue -- just as the misuse of the Bible by false teachers does not invalidate the Bible itself.",
    steelmanArguments: [
      steelmanArguments[2], // EGW as instrument of control
      steelmanArguments[3], // Remnant creates cult mentality
    ],
    hiddenAssumptions: [
      "Prophetic authority is inherently manipulative -- but this would delegitimize all biblical prophets, who also exercised spiritual authority.",
      "If people misuse her writings, the writings themselves are the problem -- but the same logic would condemn the Bible, which has been misused for centuries.",
      "A 'lesser light' cannot be a genuine prophetic gift -- misunderstands the self-description, which is about canonical status, not authenticity.",
    ],
    mindGames: [
      mindGames[1], // Insider Authority
      mindGames[3], // Deconstruction Community Pressure
    ],
    fallacies: [
      fallacies[2], // Fallacy of Composition
      fallacies[1], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "skeptical-exsda",
    debriefPrompt:
      "Review your defense of Ellen White's prophetic ministry. Did you successfully distinguish between the three questions (Is the gift genuine? Did she misuse it? Have others misused it?)? Could you apply the biblical tests of a prophet effectively? Were you able to acknowledge legitimate concerns while defending the overall authenticity of her ministry? What areas need further study?",
  },
  // ────── Module 4: Adventist Exceptionalism ──────
  {
    id: "exsda-mod-adventist-exceptionalism",
    subjectId: "adventist-exceptionalism",
    title: "Remnant Identity: Cult or Calling?",
    doctrineBrief:
      "The accusation that Adventism is a cult -- or at least 'cult-like' -- because of its remnant self-identification is one of the most socially potent charges in the ex-SDA arsenal. The word 'cult' carries enormous stigma, and simply applying it to Adventism can poison the well before any doctrinal discussion begins.\n\nResponding effectively requires understanding what the word 'cult' actually means in sociological research. Scholars like Robert Lifton and Steven Hassan have identified specific criteria for high-demand groups: authoritarian and unaccountable leadership, financial exploitation, information control, inability to leave without severe punishment, and denial of core Christian orthodoxy. SDAs have democratic governance (elected at every level), transparent financial auditing, free access to all information, members who leave freely every day, and complete affirmation of the Trinity, the deity of Christ, salvation by grace, and the authority of Scripture.\n\nThe remnant identity of Revelation 12:17 is about mission, not superiority. Every prophet was sent with a specific message for a specific time. The SDA remnant calling is to proclaim the three angels' messages of Revelation 14:6-12 in earth's final hours. This is a commission, not a coronation.",
    steelmanArguments: [
      steelmanArguments[3], // Remnant creates cult mentality
      steelmanArguments[2], // EGW control
    ],
    hiddenAssumptions: [
      "Any group claiming distinctive truth is a cult -- but this standard would indict every denomination, political party, and philosophical school in history.",
      "High social cost of leaving equals coercion -- but leaving any close-knit community (military, ethnic enclave, fraternity) carries social costs without being cultic.",
      "SDAs believe they are the ONLY true Christians -- misrepresents the official position, which acknowledges God's people in all communions.",
    ],
    mindGames: [
      mindGames[3], // Community Pressure
      mindGames[2], // Guilt Reversal
    ],
    fallacies: [
      fallacies[2], // Composition
      fallacies[0], // Anecdotal
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "skeptical-exsda",
    debriefPrompt:
      "Assess your response to the cult accusation. Were you able to define 'cult' using objective sociological criteria rather than emotion? Could you show that Adventism does not meet those criteria? Did you present remnant identity as mission-driven rather than superiority-driven? How might you better communicate the distinction between having distinctive truth and claiming exclusive access to God?",
  },
  // ────── Module 5: Health Message as Control ──────
  {
    id: "exsda-mod-health-control",
    subjectId: "health-message-control",
    title: "The Health Message: Control Mechanism or Divine Care?",
    doctrineBrief:
      "The SDA health message has been called everything from 'food legalism' to 'dietary control' by critics who view it as a mechanism for enforcing group conformity rather than a genuine expression of biblical health principles. The charge is that Adventists use food rules to create guilt, police behavior, and maintain social boundaries.\n\nThere is a kernel of truth in the critique: some Adventist communities have made diet a test of spirituality, shamed members for food choices, and treated vegetarianism as a salvation issue. These are distortions that should be forthrightly acknowledged and corrected.\n\nHowever, the health message itself is grounded in Scripture (1 Corinthians 6:19-20; 10:31; Genesis 1:29; Leviticus 11) and validated by modern science. The Adventist Health Studies from Loma Linda University represent some of the most rigorous longitudinal research on diet and health ever conducted. They consistently show that the SDA lifestyle is associated with dramatically lower rates of heart disease, cancer, and diabetes, and with significantly longer life expectancy. The health message is not about control; it is about stewarding the body God gave us as a temple of His Spirit.",
    steelmanArguments: [
      steelmanArguments[4], // Health message as social control
      steelmanArguments[0], // Religious trauma
    ],
    hiddenAssumptions: [
      "Religious dietary ethics are inherently controlling -- but this indicts every religion with dietary norms, including Judaism, Islam, Hinduism, and Buddhism.",
      "The health benefits are incidental or fabricated -- contradicts decades of peer-reviewed research from Loma Linda University.",
      "Personal choice means no communal dietary norms -- ignores that shared eating practices are universal in human communities, religious and secular alike.",
    ],
    mindGames: [
      mindGames[2], // Guilt Reversal
      mindGames[1], // Insider Authority
    ],
    fallacies: [
      fallacies[0], // Anecdotal
      fallacies[2], // Composition
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "skeptical-exsda",
    debriefPrompt:
      "Evaluate your defense of the health message. Were you able to acknowledge genuine concerns about legalism while defending the biblical and scientific basis of the health message? Could you present the Adventist Health Study data effectively? Did you distinguish between the official position (recommended, not required) and the distorted enforcement in some communities? How can you better communicate that health is a gift, not a chain?",
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const skepticalExsdaTraining: AATSAvatarTraining = {
  avatarId: "skeptical-exsda",
  avatarName: "The Skeptical Ex-SDA",
  emoji: "\u{1F50D}", // 🔍
  color: "border-red-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
