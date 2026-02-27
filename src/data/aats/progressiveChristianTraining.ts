// ─── AATS: Progressive Christian Avatar Training Data ─────────────────────────
// Comprehensive training curriculum for defending SDA faith against progressive
// Christian arguments that prioritize cultural accommodation over biblical fidelity.

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
    id: "love-over-doctrine",
    title: "Love Over Doctrine",
    description:
      "Love is all that matters; doctrine divides. This position holds that theological precision and doctrinal boundaries are inherently harmful, and that the only test of authentic Christianity is whether one is 'loving' -- defined primarily as unconditional affirmation of people's choices and identities. Any appeal to doctrinal standards, moral boundaries, or biblical correction is framed as unloving and therefore unchristian.",
  },
  {
    id: "trajectory-hermeneutics",
    title: "Trajectory Hermeneutics",
    description:
      "Scripture was moving toward full inclusion; we continue that trajectory. This hermeneutical method argues that the Bible contains an ethical trajectory that was progressively liberalizing across its pages -- from slavery toward freedom, from patriarchy toward equality, from exclusion toward inclusion -- and that faithful readers must extend that trajectory beyond the text itself into modern culture, even when it contradicts the explicit statements of Scripture.",
  },
  {
    id: "universal-reconciliation",
    title: "Universal Reconciliation",
    description:
      "A loving God wouldn't condemn anyone eternally. This doctrine asserts that a truly loving God would ultimately save every person regardless of their beliefs, choices, or repentance. Hell, judgment, and condemnation are reinterpreted as temporary corrective measures or dismissed entirely as incompatible with divine love. The exclusive claims of Christ and the reality of final judgment are softened or abandoned.",
  },
  {
    id: "anti-judgment-theology",
    title: "Anti-Judgment Theology",
    description:
      "Judging others is the worst sin; the church should only affirm. This theology elevates non-judgment to the supreme Christian virtue, treating any moral evaluation, church discipline, or call to repentance as a violation of Jesus' command 'Judge not.' The church's role is reduced to unconditional affirmation, and any distinction between sin and righteousness is labeled as 'judgmental' and therefore antithetical to the gospel.",
  },
  {
    id: "cultural-accommodation",
    title: "Cultural Accommodation",
    description:
      "The church must adapt its teachings to modern understanding. This position holds that Christian theology must be continuously revised to align with contemporary cultural values, scientific consensus, and social norms. Biblical teachings that conflict with prevailing cultural sensibilities are dismissed as culturally conditioned artifacts of ancient societies, not timeless divine revelation. The church is expected to follow culture rather than shape it.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "prog-steelman-love-supreme",
    title: "Love as the Supreme Hermeneutical Lens",
    argument:
      "Jesus Himself said the greatest commandment is love (Matthew 22:36-40), and Paul declared that love is the fulfillment of the law (Romans 13:10). If love is the interpretive key to all of Scripture, then any doctrine, practice, or tradition that causes harm, exclusion, or psychological damage to people cannot be from God. The early church evolved on circumcision, food laws, and Gentile inclusion when it realized love demanded it. We must do the same with the issues of our day. A theology that wounds people is a theology that has failed the love test, and no amount of proof-texting can justify it.",
    hiddenAssumptions: [
      "Love is defined by contemporary therapeutic culture (affirmation, inclusion, non-offense) rather than by Scripture's own definition (1 Corinthians 13; 1 John 5:3), which includes truth-telling, correction, and self-sacrifice.",
      "Subjective feelings of harm determine theological truth -- if someone feels hurt by a doctrine, the doctrine must be wrong.",
      "The early church's development on circumcision and Gentile inclusion is a precedent for abandoning all moral boundaries that feel exclusionary, ignoring that the Jerusalem Council affirmed moral standards (Acts 15:20, 29).",
    ],
    sdaResponse:
      "Jesus paired love with truth inseparably. In the same breath that He loved the rich young ruler (Mark 10:21), He told him what he did not want to hear. Jesus said, 'If you love Me, keep My commandments' (John 14:15), making obedience the evidence of love, not its opposite. Biblical love (agape) is defined as willing the genuine good of another, even at personal cost -- which sometimes means speaking uncomfortable truth. The Three Angels' Messages of Revelation 14 are heaven's supreme act of love: warning the world of coming judgment so that people can repent and be saved. True love does not leave people comfortable in danger; it warns them. As Proverbs 27:6 says, 'Faithful are the wounds of a friend; profuse are the kisses of an enemy.'",
  },
  {
    id: "prog-steelman-bible-trajectory",
    title: "The Bible's Progressive Ethical Trajectory",
    argument:
      "Scripture itself demonstrates an evolving ethic. The Old Testament permitted slavery, polygamy, and the subjugation of women, yet by the New Testament we see Paul declaring 'there is neither male nor female' (Galatians 3:28) and planting the seeds that would eventually abolish slavery. The trajectory is clear: God meets people where they are and gradually moves them toward greater justice, inclusion, and equality. If we freeze the ethical development at the first century, we betray the very spirit of Scripture. The faithful thing to do is to continue the trajectory the Bible started -- toward full inclusion of all people, regardless of orientation, gender identity, or lifestyle.",
    hiddenAssumptions: [
      "The interpreter stands above Scripture, qualified to discern where the biblical authors 'didn't go far enough' and to extend the trajectory beyond the text -- effectively making the reader's cultural moment the final authority.",
      "Descriptive passages (what the Bible records) are equated with prescriptive passages (what the Bible commands), blurring the distinction between regulation of existing cultural practices and endorsement of them.",
      "The trajectory always points in the direction of contemporary progressive values -- a suspiciously convenient conclusion that never challenges modern assumptions.",
    ],
    sdaResponse:
      "The trajectory hermeneutic makes the interpreter's cultural values the endpoint of revelation, placing human judgment above Scripture. But the Bible warns against exactly this: 'There is a way that seems right to a man, but its end is the way of death' (Proverbs 14:12). SDAs hold that Scripture is its own interpreter -- the Bible provides its own trajectory, and that trajectory culminates in Christ, not in 21st-century cultural trends. The Jerusalem Council in Acts 15 is instructive: while it freed Gentiles from circumcision, it simultaneously affirmed moral standards (Acts 15:20, 29). The 'trajectory' of Scripture moves toward the restoration of God's creation ideal (Genesis 1-2), not beyond it. The Sabbath itself embodies this principle: it calls humanity back to creation's design, not forward to cultural innovation.",
  },
  {
    id: "prog-steelman-universal-love",
    title: "A God of Universal Love Cannot Condemn Eternally",
    argument:
      "The Bible says 'God is love' (1 John 4:8) and that God 'desires all people to be saved' (1 Timothy 2:4). If God is genuinely all-powerful and genuinely all-loving, how can He fail to save everyone? The traditional doctrine of eternal punishment portrays God as a cosmic torturer who punishes finite sins with infinite suffering -- a being more cruel than the worst human dictator. Even earthly parents would never give up on their children. How much more would a perfect heavenly Father find a way to redeem every soul? The retributive god of fundamentalism is a projection of human vengeance, not the Abba Father Jesus revealed.",
    hiddenAssumptions: [
      "God's love overrides His justice, holiness, and the genuine free will of creatures -- love is defined as getting the outcome you want regardless of the other person's choice.",
      "Human analogies (parenting) are sufficient to fully comprehend divine attributes, ignoring that God is also holy, just, and the moral Governor of the universe.",
      "The only alternative to universalism is eternal conscious torment, ignoring the SDA position of conditional immortality and annihilationism, which resolves the objection entirely.",
    ],
    sdaResponse:
      "SDAs actually agree that eternal conscious torment misrepresents God's character -- but the answer is not universalism; it is conditional immortality. The Bible teaches that 'the wages of sin is death' (Romans 6:23), not eternal torment. The wicked are consumed in the lake of fire (Revelation 20:14-15; Malachi 4:1-3), and God makes all things new (Revelation 21:5). This upholds both God's love AND His justice. God 'desires all people to be saved' (1 Timothy 2:4), but He does not override human free will. Those who persistently reject God's grace ultimately receive what they have chosen: existence without God, which is destruction. The Three Angels' Messages (Revelation 14:6-12) are God's final loving appeal, urging the world to worship the Creator and avoid the consequences of rebellion. Love warns; love does not pretend judgment is unreal.",
  },
  {
    id: "prog-steelman-judge-not",
    title: "Jesus' Command Not to Judge",
    argument:
      "Jesus said, 'Judge not, that you be not judged' (Matthew 7:1). This is the clearest ethical command in the Gospels. Yet conservative Christians spend enormous energy judging people's lifestyles, identities, and choices. The Pharisees were the religious judges of their day, and Jesus reserved His harshest condemnation for them, not for sinners. Jesus ate with tax collectors and sinners without demanding they change first. He told the woman caught in adultery, 'Neither do I condemn you' (John 8:11). The church's primary calling is to welcome, include, and affirm -- not to serve as moral police. When the church judges, it drives people away from the very God who came to embrace them.",
    hiddenAssumptions: [
      "Jesus' command against hypocritical judgment (Matthew 7:1-5) is universalized to prohibit ALL moral discernment, ignoring that the same passage instructs removing the log from your own eye SO THAT you can help your brother with his speck.",
      "Jesus never called anyone to repentance or moral change -- a claim directly contradicted by His first sermon ('Repent, for the kingdom of heaven has come near,' Matthew 4:17) and His words to the woman at the well, the rich young ruler, and others.",
      "'Neither do I condemn you' is quoted while 'Go and sin no more' (John 8:11b) is consistently omitted -- a selective reading that distorts Jesus' actual message.",
    ],
    sdaResponse:
      "Jesus did not abolish moral discernment; He corrected hypocritical judgment. The full context of Matthew 7 instructs believers to first deal with their own sin and THEN help others -- 'then you will see clearly to remove the speck from your brother's eye' (Matthew 7:5). Jesus' first public message was 'Repent' (Matthew 4:17). He told the woman caught in adultery, 'Go and sin no more' (John 8:11b) -- grace and moral call together. The SDA understanding of the investigative judgment (Daniel 7:9-10; Revelation 14:7) reveals that judgment is GOOD NEWS: God vindicates His people, exposes oppressors, and demonstrates that His dealings have been just. 'The hour of His judgment has come' (Revelation 14:7) is proclaimed as part of the 'everlasting gospel' -- because true justice is an act of love, especially for the oppressed, the marginalized, and the victims of injustice who long to hear that God sees and will make things right.",
  },
  {
    id: "prog-steelman-cultural-evolution",
    title: "Theology Must Evolve with Human Understanding",
    argument:
      "The church once used the Bible to defend geocentrism, slavery, the subordination of women, and the persecution of heretics. In each case, the church eventually recognized it was wrong and adapted. Today's conservative positions on sexuality, gender, and exclusive truth claims are the geocentrism of our era -- sincere but ultimately incorrect readings that future generations will look back on with embarrassment. Theology is not static; it is a living conversation with the living God, and the Spirit is leading us into 'all truth' (John 16:13). If the church cannot grow and change, it becomes a museum piece rather than a living body.",
    hiddenAssumptions: [
      "Past theological errors on peripheral matters (geocentrism) prove that core moral teachings (sexual ethics, the exclusivity of Christ) are equally liable to revision -- a false equivalence.",
      "The direction of cultural change is always the direction of the Holy Spirit's leading -- a claim that equates prevailing social trends with divine guidance, despite Jesus' warning that the gate is narrow and few find it (Matthew 7:14).",
      "Contemporary culture is the most enlightened culture in history and therefore the best judge of which biblical teachings are 'timeless' and which are 'culturally conditioned' -- chronological snobbery (C.S. Lewis's term).",
    ],
    sdaResponse:
      "SDAs recognize a crucial distinction between culturally conditioned applications and timeless moral principles. The Bible's acceptance of slavery was regulatory, not endorsive, and the trajectory toward freedom was completed within Scripture itself (Philemon; Galatians 3:28). But the moral law -- the Ten Commandments, including the Sabbath -- is presented as eternal, written by God's own finger, and reflective of His character. Paul warned that 'the time will come when people will not put up with sound doctrine. Instead, to suit their own desires, they will gather around them a great number of teachers to say what their itching ears want to hear' (2 Timothy 4:3-4). The SDA prophetic understanding sees end-time deception as precisely this: a wholesale accommodation to culture that abandons biblical truth under the guise of 'progress.' The Sabbath stands as the ultimate counter-cultural sign -- a practice that refuses to bend to the world's calendar and instead testifies to God's unchanging creative authority.",
  },
  {
    id: "prog-steelman-harm-theology",
    title: "Traditional Theology Causes Real Psychological Harm",
    argument:
      "Studies show that religious teachings about sin, hell, and moral failure contribute to depression, anxiety, and suicidal ideation, particularly among LGBTQ+ youth. When the church tells people that fundamental aspects of their identity are sinful, it is literally destroying lives. The fruits of traditional theology are broken families, self-hatred, and spiritual trauma. Jesus said, 'By their fruits you will know them' (Matthew 7:16). If a theology produces psychological devastation, it cannot be from God. The church has a moral obligation to revise any teaching that causes measurable harm, regardless of how well it can be proof-texted from ancient manuscripts.",
    hiddenAssumptions: [
      "Psychological discomfort is the ultimate measure of theological truth -- if a teaching causes distress, it must be false, regardless of its evidential basis.",
      "The only compassionate response to human suffering is to affirm the person's current self-understanding, rather than offering a framework for transformation (2 Corinthians 5:17).",
      "Correlation between traditional religious environments and psychological harm proves causation, ignoring that many other factors (family rejection, bullying, social isolation) contribute to negative outcomes.",
    ],
    sdaResponse:
      "SDAs take human suffering with utmost seriousness. God 'is close to the brokenhearted and saves those who are crushed in spirit' (Psalm 34:18). However, the measure of truth cannot be whether it makes us comfortable. Jesus said, 'In this world you will have trouble' (John 16:33) and 'whoever wants to save their life will lose it' (Matthew 16:25). The gospel itself is offensive to the natural heart (1 Corinthians 1:23) -- it tells every human being that they are sinners in need of a Savior, which is never psychologically comfortable. Genuine pastoral care means walking with people through pain while pointing them to the Healer, not rewriting the diagnosis to avoid discomfort. The SDA health message demonstrates this principle: telling someone their lifestyle choices are destructive is not hateful -- it is the most loving thing you can do, precisely because you care about their well-being. 'Faithful are the wounds of a friend' (Proverbs 27:6).",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "prog-mg-emotional-blackmail",
    name: "Emotional Blackmail",
    description:
      "Using stories of suffering to shut down theological discussion. The progressive Christian leverages personal pain narratives to make any doctrinal disagreement feel like a personal attack on vulnerable people. The implicit message is: if you hold to traditional theology, you are personally responsible for people's suffering, and any attempt to articulate a biblical position becomes an act of cruelty.",
    example:
      "\"My friend almost took their life because of what your church teaches. How can you sit there and defend that doctrine?\" -- This redirects the conversation from 'Is this teaching true?' to 'Are you a compassionate person?' making it impossible to engage theologically without appearing heartless.",
    detectionTip:
      "When personal pain is used to end theological inquiry, acknowledge the pain genuinely but redirect to the real question: 'I grieve with you and care deeply about your friend. AND the question of what is true remains. Can both be true -- that we care about people deeply AND that some truths are uncomfortable?' Compassion and truth are not enemies. Jesus wept at Lazarus's tomb AND still called people to repentance.",
  },
  {
    id: "prog-mg-love-shaming",
    name: "Love Shaming",
    description:
      "Framing any doctrinal conviction as inherently unloving. This tactic redefines 'love' as unconditional affirmation and then accuses anyone who holds to biblical moral standards of being unloving. The equation is simple: love = agreement, therefore disagreement = hate. This makes it impossible to hold a traditional position without being labeled as hateful, bigoted, or un-Christlike.",
    example:
      "\"If you really loved people the way Jesus did, you wouldn't hold to those harmful beliefs. Jesus never turned anyone away.\" -- This ignores that Jesus regularly confronted sin, called people to repentance, and made exclusive truth claims that many found deeply offensive (John 6:60-66).",
    detectionTip:
      "When accused of being 'unloving' for holding a doctrinal position, ask: 'How are you defining love? Is it possible to love someone AND disagree with them? Does a doctor who tells a patient they have cancer lack love?' Biblical love (agape) is defined by 1 John 5:3: 'This is love for God: to keep his commands.' Love and truth are married in Scripture; divorcing them distorts both.",
  },
  {
    id: "prog-mg-progressive-inevitability",
    name: "Progressive Inevitability",
    description:
      "Framing cultural accommodation as inevitable, implying resistance is futile and foolish. This tactic presents the progressive direction of Western culture as an unstoppable force of history, placing traditional believers on 'the wrong side of history.' It leverages social pressure and the fear of irrelevance to push theological compromise, as though cultural trends have the authority of divine revelation.",
    example:
      "\"The church will eventually accept this, just like it accepted the end of slavery and the equality of women. You're just delaying the inevitable and hurting people in the process.\" -- This assumes that all cultural change is moral progress and that the church's role is to follow culture rather than prophetically challenge it.",
    detectionTip:
      `When someone invokes historical inevitability, point out that 'the wrong side of history' is a secular eschatological claim with no more authority than anyone's prediction about the future. History is not a moral agent. The German church that accommodated Nazism was following the cultural trajectory of its day. Ask: 'Who decides which cultural direction is "progress"? Is it possible that a culture can "progress" in the wrong direction?' Jesus warned that the end times would be marked by widespread deception, not inevitable enlightenment (Matthew 24:24).`,
  },
  {
    id: "prog-mg-pharisee-labeling",
    name: "Pharisee Labeling",
    description:
      "Calling anyone who upholds biblical standards a 'Pharisee' or 'legalist.' This tactic weaponizes Jesus' confrontations with the Pharisees to silence all moral conviction, ignoring that the Pharisees' error was hypocrisy and adding human traditions to God's law, not holding to God's actual commandments. By labeling traditional believers as Pharisees, the progressive Christian positions themselves as the voice of Jesus against the religious establishment.",
    example:
      "\"You sound just like the Pharisees -- obsessed with rules and missing the heart of God. Jesus came to free us from that kind of religion.\" -- This misidentifies the Pharisees' error. Jesus criticized them for hypocrisy and for replacing God's commands with human traditions (Mark 7:8-9), not for keeping God's actual law.",
    detectionTip:
      "When labeled a 'Pharisee,' clarify what the Pharisees actually did wrong: they replaced God's commandments with human traditions (Mark 7:8-9), they were hypocrites who didn't practice what they preached (Matthew 23:3), and they added burdensome rules to God's law. SDAs who uphold God's actual commandments (including the Sabbath) are doing the opposite of what Pharisees did. In fact, it is the progressive who adds to Scripture by claiming authority to extend the Bible's 'trajectory' beyond what is written -- which is precisely the Pharisaic error of adding human interpretation to divine revelation.",
  },
  {
    id: "prog-mg-inclusion-trump-card",
    name: "The Inclusion Trump Card",
    description:
      "Using 'inclusion' as an unchallengeable moral absolute that overrides all other considerations. In progressive discourse, 'inclusion' functions as the supreme value that cannot be questioned. Any theological position, doctrinal standard, or moral boundary that excludes anyone for any reason is ipso facto wrong. The irony is that this absolute commitment to inclusion is itself exclusionary -- it excludes those who believe in biblical moral boundaries.",
    example:
      "\"God's table has no boundaries. Everyone is welcome, just as they are, without conditions. That's the gospel.\" -- This conflates God's invitation (which is universal) with God's terms (which include repentance, faith, and transformation). Jesus invited everyone to follow Him, but following Him required leaving behind their old way of life (Luke 9:23).",
    detectionTip:
      "When 'inclusion' is invoked as an absolute, point out the self-refuting nature of the claim: 'Are you including people who believe in biblical moral standards, or are you excluding them from your inclusive community? Inclusion without truth is not gospel inclusion -- it is indifference dressed up as compassion.' Jesus included tax collectors and sinners at His table AND called them to 'repent and believe' (Mark 1:15). Biblical inclusion always includes the call to transformation.",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "prog-fallacy-appeal-to-emotion",
    name: "Appeal to Emotion over Evidence",
    definition:
      "Substituting emotional narratives for logical and biblical argumentation. The progressive Christian replaces exegesis with empathy, making feelings the arbiter of theological truth. If a doctrine feels harmful, it is declared wrong; if a revision feels compassionate, it is declared right. The result is a theology driven by sentiment rather than Scripture.",
    example:
      "\"How can you look at a loving same-sex couple and tell them God doesn't approve? Just look at the love in their eyes!\" -- This appeals to emotional sympathy while bypassing the theological question entirely. The sincerity of someone's feelings does not determine the morality of their actions.",
    counterMove:
      "Acknowledge the emotional weight while redirecting to the actual question: 'I recognize the genuine love and sincerity you describe, and I treat all people with dignity and respect. But the question is not whether people's feelings are sincere -- the question is what God has revealed in His Word. Sincerity alone does not determine truth. Proverbs 14:12 warns, \"There is a way that seems right to a man, but its end is the way of death.\" We must let Scripture, not cultural sentiment, define the boundaries of love and faithfulness.'",
  },
  {
    id: "prog-fallacy-false-analogy",
    name: "False Analogy (Slavery/Inclusion)",
    definition:
      "Drawing a false equivalence between the church's past errors on slavery or geocentrism and its current moral teachings, as though correcting a scientific misunderstanding (geocentrism) or repenting of a moral evil (slavery) establishes a precedent for revising core ethical teachings on sexuality, marriage, or the exclusivity of Christ.",
    example:
      "\"Christians used the Bible to defend slavery too. You're making the same mistake now with your traditional views on marriage.\" -- This ignores that the abolition of slavery was driven by a more faithful reading of Scripture (Galatians 3:28; Philemon), not by abandoning Scripture. The trajectory toward abolition was IN the Bible; the trajectory toward sexual revolution is not.",
    counterMove:
      "Expose the false equivalence: 'The abolition of slavery came from reading the Bible MORE faithfully, not less. Abolitionists like William Wilberforce argued FROM Scripture. The analogy actually undermines your position: the Bible consistently presents marriage as between a man and a woman from Genesis 1-2 through Revelation 21. There is no internal biblical trajectory away from this standard. The false analogy assumes that all traditional positions are equally liable to revision, which does not follow logically.'",
  },
  {
    id: "prog-fallacy-no-true-scotsman",
    name: "No True Christian",
    definition:
      "Defining 'authentic Christianity' as whatever aligns with progressive values, and dismissing all traditional Christians as not truly representing Christ. This fallacy allows the progressive to claim the mantle of Jesus while denying it to anyone who disagrees, without ever having to engage the theological arguments.",
    example:
      "\"A true follower of Jesus would never exclude anyone. If you hold those views, you're following the religion ABOUT Jesus, not the religion OF Jesus.\" -- This assumes that the progressive interpretation of Jesus is the only valid one, while billions of Christians across 2,000 years of history who held traditional views were all wrong.",
    counterMove:
      "Challenge the definitional move: 'Who gets to define what a \"true\" follower of Jesus looks like -- you, or Jesus Himself? Jesus said, \"If you love Me, keep My commandments\" (John 14:15). He called people to repentance (Matthew 4:17), upheld the moral law (Matthew 5:17-19), spoke of hell and judgment (Matthew 25:41-46), and made exclusive truth claims (John 14:6). The historical, biblical Jesus does not fit neatly into progressive categories. We must follow the Jesus of Scripture, not a culturally curated version of Him.'",
  },
  {
    id: "prog-fallacy-chronological-snobbery",
    name: "Chronological Snobbery",
    definition:
      "Dismissing biblical teachings simply because they are ancient, as though older ideas are inherently inferior to modern ones. This fallacy assumes that moral and spiritual understanding necessarily improves over time, and that contemporary culture is the most enlightened and therefore the best judge of which ancient teachings to keep and which to discard. C.S. Lewis identified this as one of the most pervasive intellectual errors of modern thought.",
    example:
      "\"Those passages were written by ancient people with a pre-scientific worldview. We know better now.\" -- This assumes that modern people are morally and spiritually superior to the biblical authors, ignoring that our era has its own blind spots, biases, and moral failures that future generations may judge harshly.",
    counterMove:
      "Name the fallacy directly: 'C.S. Lewis called this chronological snobbery -- the uncritical assumption that newer is always better. Every age has its blind spots. Ancient cultures may have been wrong about some things (cosmology), but they were not necessarily wrong about everything (morality, human nature, the existence of God). Our culture endorses practices that many future generations may condemn. The age of an idea is irrelevant to its truth. The law of gravity is ancient; it is not therefore wrong. The question is not when a teaching was given, but whether it is TRUE. SDAs affirm that God's moral law transcends culture and time because it reflects His eternal character.'",
  },
  {
    id: "prog-fallacy-equivocation-love",
    name: "Equivocation on 'Love'",
    definition:
      "Using the word 'love' with shifting meanings -- sometimes meaning biblical agape (self-sacrificial willing of another's good), sometimes meaning modern therapeutic affirmation (making someone feel accepted and comfortable). This equivocation allows the progressive to claim biblical authority ('God is love') while importing a definition of love that the Bible does not endorse (love as unconditional affirmation without call to repentance).",
    example:
      "\"God IS love, so anything done in love is from God. Love wins in the end.\" -- The word 'love' here silently shifts from the biblical sense (God's holy, just, self-sacrificing love that includes discipline -- Hebrews 12:6) to the cultural sense (warm feelings, acceptance, no standards). This equivocation makes the argument appear biblical while actually contradicting the biblical definition.",
    counterMove:
      "Pin down the definition: 'When you say \"love,\" what exactly do you mean? The Bible defines love very specifically. \"This is love for God: to keep his commands\" (1 John 5:3). \"The Lord disciplines the one he loves\" (Hebrews 12:6). \"Faithful are the wounds of a friend\" (Proverbs 27:6). Biblical love includes truth-telling, correction, warning, and even judgment. If we redefine love as mere affirmation, we have abandoned the biblical concept entirely and replaced it with something far less costly and far less transformative. God's love sent His Son to die -- not to affirm our sin, but to save us from it.'",
  },
];

// ── Counter Strategies ───────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "love-over-doctrine",
    title: "Countering 'Love Over Doctrine' with Christ's Inseparable Love and Truth",
    sdaPosition:
      "SDAs affirm that love and truth are inseparable in the character of God and in authentic Christian witness. Jesus is described as 'full of grace AND truth' (John 1:14) -- never grace without truth, never truth without grace. The Three Angels' Messages (Revelation 14:6-12) represent heaven's ultimate act of love: warning the world of coming judgment so people can repent, worship the Creator, and be saved. Doctrine is not the enemy of love; it is the vehicle through which love speaks with clarity. A doctor who withholds a cancer diagnosis to avoid causing distress is not loving the patient -- and a church that withholds truth to avoid causing offense is not loving its members. The SDA commitment to present truth (2 Peter 1:12) is an expression of the deepest love: caring enough about people's eternal destiny to tell them what they need to hear, not just what they want to hear.",
    keyScriptures: [
      "John 1:14 -- 'The Word became flesh and made his dwelling among us, full of grace and truth.' Christ embodies the union of love and truth.",
      "John 14:15 -- 'If you love Me, keep My commandments.' Jesus made obedience the proof of love, not its opposite.",
      "Revelation 14:6-7 -- 'Fear God and give him glory, because the hour of his judgment has come.' The everlasting gospel includes the judgment message -- love warns.",
      "Ephesians 4:15 -- 'Speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ.' Truth and love belong together.",
      "Proverbs 27:6 -- 'Faithful are the wounds of a friend; profuse are the kisses of an enemy.' True love sometimes hurts; false love always flatters.",
    ],
    counterArguments: [
      "Jesus never separated love from truth. His most loving acts included His most confrontational moments: cleansing the temple, rebuking the Pharisees, calling the rich young ruler to radical obedience. The progressive framework that pits love against doctrine would make Jesus Himself 'unloving' by its own standard.",
      "Paul's epistles are saturated with both love and doctrinal correction. He told the Galatians he would not have them 'bewitched' by a false gospel (Galatians 3:1), told the Corinthians to expel the immoral brother (1 Corinthians 5:13), and warned Timothy that people would accumulate teachers to suit their desires (2 Timothy 4:3-4). All of this was love in action.",
      "The SDA Three Angels' Messages are the supreme example of love and doctrine united. The first angel proclaims the 'everlasting gospel' and calls the world to 'fear God and give Him glory, because the hour of His judgment has come' (Revelation 14:6-7). This is love: warning the world before it is too late.",
      "The claim that doctrine divides is actually an argument for false unity. True unity is built on shared truth, not on the absence of conviction. Jesus said He came not to bring peace but a sword (Matthew 10:34) -- not because He delights in division, but because truth inevitably divides those who accept it from those who reject it.",
    ],
    closingStatement:
      "The progressive claim that love and doctrine are enemies would have been incomprehensible to Jesus, who is Himself 'the Truth' (John 14:6). A loveless doctrine is cold orthodoxy, and SDAs reject it. But a truthless love is sentimental indulgence, and SDAs reject that equally. The Three Angels' Messages are the final demonstration that love and truth are one: God loves the world enough to warn it, clearly and urgently, before the coming judgment. That is the SDA calling -- to speak the truth in love, faithfully and fearlessly, to a world that desperately needs both.",
  },
  {
    subjectId: "trajectory-hermeneutics",
    title: "Countering Trajectory Hermeneutics with Sola Scriptura",
    sdaPosition:
      "SDAs hold to the Protestant principle of Sola Scriptura: the Bible is its own interpreter and the final authority in all matters of faith and practice. Trajectory hermeneutics subtly undermines this principle by placing the interpreter above the text, granting human cultural judgment the authority to declare where Scripture 'didn't go far enough.' This is not reading the Bible faithfully; it is reading beyond the Bible presumptuously. The Bible provides its own trajectory, and it culminates not in 21st-century cultural values but in the person of Jesus Christ and the restoration of God's creation ideal. SDAs read Scripture as a unified whole, interpreting unclear passages by clear ones and allowing the Bible to correct our cultural assumptions rather than allowing our culture to correct the Bible.",
    keyScriptures: [
      "Isaiah 8:20 -- 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them.' Scripture is the standard that tests all claims.",
      "2 Timothy 3:16-17 -- 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.' Scripture is sufficient -- it does not need cultural supplementation.",
      "Proverbs 14:12 -- 'There is a way that seems right to a man, but its end is the way of death.' Human judgment, untethered from Scripture, is unreliable.",
      "Revelation 22:18-19 -- 'I warn everyone who hears the words of the prophecy of this scroll: If anyone adds anything to them, God will add to that person the plagues described in this scroll.' The Bible warns against adding to its message.",
    ],
    counterArguments: [
      "Trajectory hermeneutics has no braking mechanism. If the interpreter is authorized to extend the Bible's 'trajectory' beyond the text, who decides where the trajectory ends? Today it is sexuality; tomorrow it could be the exclusivity of Christ, the reality of sin, or the existence of God. Once you place the interpreter above the text, there is no principled stopping point.",
      "The abolition of slavery, often cited as a precedent, was accomplished by MORE faithful reading of Scripture, not by reading beyond it. Abolitionists argued FROM Galatians 3:28, Philemon, and the imago Dei -- they did not need to go 'beyond' Scripture. The trajectory was completed WITHIN the Bible.",
      "The Bible's own trajectory points backward to the creation ideal, not forward to cultural accommodation. Jesus Himself, when asked about marriage and divorce, said, 'From the beginning it was not so' (Matthew 19:8), redirecting to Genesis 1-2. The Sabbath follows the same pattern: it calls humanity back to the Creator's design.",
      "Progressive trajectory hermeneutics suspiciously always arrives at conclusions that align with contemporary Western progressive values. A hermeneutical method that invariably confirms the reader's pre-existing cultural commitments is not a discovery tool; it is a confirmation bias engine.",
    ],
    closingStatement:
      "Trajectory hermeneutics is not a method of reading the Bible more faithfully; it is a method of reading beyond the Bible while claiming biblical authority for the result. SDAs stand with the Reformers in affirming that Scripture alone is the rule of faith and practice. The Bible needs no cultural extension; it needs faithful exposition. The SDA commitment to 'the law and the testimony' (Isaiah 8:20) is not a refusal to grow -- it is a refusal to substitute human wisdom for divine revelation. As 2 Timothy 4:3-4 warns, the time will come when people will not endure sound doctrine but will accumulate teachers to suit their own desires. That time may be now.",
  },
  {
    subjectId: "universal-reconciliation",
    title: "Countering Universal Reconciliation with Conditional Immortality and Just Judgment",
    sdaPosition:
      "SDAs reject both eternal conscious torment and universal reconciliation, offering a biblical third way: conditional immortality. The Bible teaches that God alone has immortality (1 Timothy 6:16), that the soul is not inherently immortal (Ezekiel 18:20), and that the final fate of the unrepentant is destruction, not eternal suffering (2 Thessalonians 1:9; Malachi 4:1-3). This preserves both God's love (He does not torture anyone eternally) and God's justice (sin has real, final consequences). Universal reconciliation collapses the moral seriousness of the great controversy, renders the cross unnecessary (if everyone is saved anyway, why did Jesus need to die?), and contradicts Jesus' own repeated warnings about judgment and destruction.",
    keyScriptures: [
      "Romans 6:23 -- 'The wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.' Eternal life is a GIFT, not a default -- implying that the alternative to receiving it is death, not continued existence in torment or eventual salvation.",
      "Ezekiel 18:20 -- 'The soul who sins shall die.' The soul is not inherently immortal; it can perish.",
      "Malachi 4:1-3 -- 'The day is coming, burning like a furnace... all the arrogant and every evildoer will be stubble... they will be ashes under the soles of your feet.' Total destruction, not eternal preservation in suffering or eventual reconciliation.",
      "Matthew 7:13-14 -- 'Wide is the gate and broad is the road that leads to destruction, and many enter through it. But small is the gate and narrow the road that leads to life, and only a few find it.' Jesus taught two destinies, not universal salvation.",
      "Revelation 20:14-15 -- 'Then death and Hades were thrown into the lake of fire. The lake of fire is the second death.' The lake of fire results in final, irrevocable death.",
    ],
    counterArguments: [
      "Universal reconciliation makes the cross an overreaction. If God was going to save everyone regardless, the agonizing death of Jesus was unnecessary. The cross only makes sense if there is a real, final consequence to sin that only Christ's sacrifice can avert.",
      "Jesus taught two destinies more clearly than any other figure in the Bible. He spoke of sheep and goats (Matthew 25:31-46), wheat and tares (Matthew 13:24-30), wise and foolish virgins (Matthew 25:1-13), and the narrow and wide gates (Matthew 7:13-14). Universal reconciliation requires dismissing or reinterpreting Jesus' own most explicit teaching.",
      "The SDA doctrine of conditional immortality resolves the progressive Christian's legitimate concern about eternal torture without falling into the opposite error of universalism. God is not a cosmic torturer (because the wicked are destroyed, not tortured forever), AND God is not an enabler who ignores rebellion (because sin has final consequences). This is the biblical balance.",
      "Universal reconciliation strips the Three Angels' Messages of their urgency. If everyone is saved eventually, why does Revelation 14 warn the world with such passion? The entire apocalyptic urgency of the SDA message depends on the reality that choices have eternal consequences -- not eternal torture, but eternal life or eternal death.",
    ],
    closingStatement:
      "Universal reconciliation is an understandable reaction to the unbiblical doctrine of eternal conscious torment, but it overcorrects into an equally unbiblical position. SDAs offer the biblical resolution: conditional immortality. God is love, and His love has provided a way of salvation through Christ. But love that does not respect free will is not love -- and God will not force salvation on those who persistently reject it. The Three Angels' Messages call the world to decision precisely because the decision matters eternally. 'Choose this day whom you will serve' (Joshua 24:15) -- because the choice is real, the stakes are final, and the God who offers life also respects the terrible freedom to refuse it.",
  },
  {
    subjectId: "anti-judgment-theology",
    title: "Countering Anti-Judgment Theology with the Good News of Divine Judgment",
    sdaPosition:
      "SDAs proclaim that the judgment of God is GOOD NEWS -- the 'everlasting gospel' of Revelation 14:7 includes the announcement that 'the hour of His judgment has come.' Far from being oppressive, divine judgment is the vindication of the oppressed, the exposure of hidden evil, the demonstration of God's justice, and the assurance that the universe's moral fabric is not broken beyond repair. The investigative judgment (Daniel 7:9-10, 22) reveals that God takes every case seriously, that no injustice goes unnoticed, and that His people will be vindicated before the cosmos. Anti-judgment theology ironically harms the very people it claims to protect: the poor, the marginalized, and the abused, who desperately need to know that a just God sees their suffering and will make things right.",
    keyScriptures: [
      "Revelation 14:7 -- 'Fear God and give glory to Him, for the hour of His judgment has come; and worship Him who made heaven and earth.' Judgment is part of the everlasting gospel.",
      "Daniel 7:22 -- 'Judgment was given in favor of the saints of the Most High.' The judgment VINDICATES God's people; it is good news for the faithful.",
      "Ecclesiastes 12:14 -- 'God will bring every work into judgment, including every secret thing, whether good or evil.' Nothing is hidden from God; all will be accounted for.",
      "Matthew 7:5 -- 'First remove the plank from your own eye, and then you will see clearly to remove the speck from your brother's eye.' Jesus did not prohibit moral discernment; He demanded we do it with humility and integrity.",
      "Psalm 96:10-13 -- 'He shall judge the peoples righteously... He is coming to judge the earth. He shall judge the world with righteousness, and the peoples with His truth.' Creation itself rejoices at God's coming judgment.",
    ],
    counterArguments: [
      "Jesus did not abolish moral judgment; He corrected hypocritical judgment. Matthew 7:1-5 is about removing the log from your own eye SO THAT you can help your brother -- not about refusing to help at all. Jesus also commanded, 'Judge with righteous judgment' (John 7:24), showing that proper moral discernment is a Christian duty, not a sin.",
      "The SDA investigative judgment is profoundly good news for the oppressed. It means God sees every hidden injustice, every secret abuse, every act of exploitation. For victims of systemic oppression, the message that God is judging the world is the best news possible -- it means the powerful cannot escape accountability forever. Anti-judgment theology, ironically, leaves the oppressed without hope of divine vindication.",
      "The Three Angels' Messages include judgment as gospel. Revelation 14:6-7 presents 'the hour of His judgment' as part of 'the everlasting gospel' -- not as a contradiction to it. For SDAs, judgment and good news are not opposed; they are united. The judgment reveals God's character, vindicates His people, and resolves the great controversy.",
      "Church discipline is an act of love, not hate. Paul commanded the Corinthian church to expel the immoral brother (1 Corinthians 5) specifically to save him -- 'hand this man over to Satan for the destruction of the flesh, so that his spirit may be saved on the day of the Lord' (1 Corinthians 5:5). The refusal to judge is not compassion; it is abandonment.",
    ],
    closingStatement:
      "Anti-judgment theology sounds compassionate, but it actually abandons the people who need justice most. If God does not judge, then the oppressor and the oppressed receive the same treatment, the abuser and the victim are equally 'affirmed,' and the moral fabric of the universe has no repair. SDAs proclaim that 'the hour of His judgment has come' as GOOD NEWS -- because it means God cares, God sees, and God will make things right. The judgment is not the enemy of love; it is love's guarantee that evil will not have the last word. As Psalm 96 declares, even the trees of the forest 'sing for joy before the Lord, for He comes to judge the earth.'",
  },
  {
    subjectId: "cultural-accommodation",
    title: "Countering Cultural Accommodation with the Prophetic Remnant Identity",
    sdaPosition:
      "SDAs understand themselves as the prophetic remnant of Revelation 12:17, called to 'keep the commandments of God and have the testimony of Jesus Christ' in a world that pressures conformity. The SDA identity is inherently counter-cultural: the Sabbath sets Adventists apart from the world's calendar, the health message challenges cultural norms around diet and substance use, the modesty principles resist consumer culture, and the prophetic interpretation of Revelation warns against the very accommodation that progressive Christianity celebrates. Cultural accommodation is not a sign of spiritual maturity; it is the specific end-time danger the Three Angels' Messages are designed to combat. The mark of the beast itself represents the ultimate cultural accommodation -- substituting human tradition for divine command.",
    keyScriptures: [
      "2 Timothy 4:3-4 -- 'The time will come when people will not put up with sound doctrine. Instead, to suit their own desires, they will gather around them a great number of teachers to say what their itching ears want to hear. They will turn their ears away from the truth and turn aside to myths.' This is a precise description of cultural accommodation.",
      "Romans 12:2 -- 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.' The church is called to transform culture, not be transformed by it.",
      "Revelation 12:17 -- 'Then the dragon was enraged at the woman and went off to wage war against the rest of her offspring -- those who keep God's commands and hold fast their testimony about Jesus.' The remnant is defined by faithfulness to God's commands, not cultural conformity.",
      "Revelation 14:9-12 -- The third angel warns against receiving the mark of the beast -- the ultimate symbol of accommodating human tradition over divine commandment. The saints are those who 'keep the commandments of God and the faith of Jesus.'",
      "James 4:4 -- 'Do you not know that friendship with the world is enmity with God? Whoever therefore wants to be a friend of the world makes himself an enemy of God.' The church cannot serve both God and cultural approval.",
    ],
    counterArguments: [
      "The Bible explicitly warns that end-time deception will come in the form of apparent spiritual enlightenment and cultural accommodation. 2 Timothy 4:3-4 describes a time when people will not endure sound doctrine but will accumulate teachers to suit their desires -- a precise description of progressive Christianity's demand that the church 'evolve' its teachings to match cultural trends.",
      "The SDA Sabbath is the ultimate test case against cultural accommodation. The world operates on a different calendar; the Sabbath insists on God's calendar. The mark of the beast (Revelation 14:9-11) represents the ultimate accommodation -- substituting human authority for divine command. SDAs see cultural accommodation not as progress but as the specific danger Revelation warns about.",
      "Every society believes it is the most enlightened in history. The Germans of the 1930s believed they were progressing; the European colonizers believed they were civilizing the world; the eugenicists of the early 20th century believed they were advancing human health. Cultural 'progress' without an external moral standard is directionless at best and catastrophic at worst.",
      "The SDA prophetic identity is inherently counter-cultural. The remnant of Revelation 12:17 is defined by keeping God's commandments in a hostile world, not by accommodating that world's values. The church is called to be salt and light (Matthew 5:13-16) -- preserving truth and illuminating darkness, not dissolving into the surrounding culture.",
      "Jesus warned that the end times would be marked not by enlightenment but by deception: 'For false christs and false prophets will rise and show great signs and wonders to deceive, if possible, even the elect' (Matthew 24:24). The pressure to accommodate is itself a fulfillment of end-time prophecy.",
    ],
    closingStatement:
      "Cultural accommodation is not the future of Christianity; it is the specific danger the Bible warns about. SDAs are called to be the prophetic remnant -- not because they are better than anyone else, but because God needs a people who will faithfully uphold His commandments and testify to His truth in a world that demands conformity. The Sabbath, the sanctuary, the state of the dead, the Second Coming, and the Three Angels' Messages are all counter-cultural truths that resist accommodation. As Paul warned Timothy, 'The time will come when people will not endure sound doctrine.' That time has come. The SDA mission is not to accommodate the culture but to call it to repentance and worship the Creator while there is still time.",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ────── Module 1: Love Over Doctrine ──────
  {
    id: "prog-mod-love-over-doctrine",
    subjectId: "love-over-doctrine",
    title: "Confronting 'Love Over Doctrine': When Love Is Weaponized Against Truth",
    doctrineBrief:
      "The progressive Christian claim that 'love is all that matters' and that 'doctrine divides' is one of the most emotionally compelling arguments in contemporary Christianity. It resonates deeply because Christians genuinely desire to be loving, and because doctrinal rigidity HAS sometimes been used to justify cruelty. The progressive position trades on this legitimate concern, but it overcorrects catastrophically by severing love from truth.\n\nAt the heart of this argument is a redefinition of love. Biblical agape -- self-sacrificial willing of another's genuine good, even at personal cost -- is replaced by a therapeutic model of love: unconditional affirmation, emotional validation, and the avoidance of discomfort. Under this redefinition, any teaching that makes someone feel bad about themselves is 'unloving,' and any community that maintains moral standards is 'exclusionary.'\n\nThe SDA response is that Jesus Christ Himself is the union of love and truth (John 1:14). He wept over Jerusalem AND cleansed the temple. He ate with sinners AND called them to repentance. He forgave the woman caught in adultery AND told her to sin no more. The Three Angels' Messages of Revelation 14 are the ultimate expression of this union: heaven's most loving act is its most urgent doctrinal proclamation -- warning the world of judgment so that people can be saved.",
    steelmanArguments: [
      steelmanArguments[0], // Love as Supreme Hermeneutical Lens
      steelmanArguments[5], // Traditional Theology Causes Harm
    ],
    hiddenAssumptions: [
      "Love is defined by the receiver's subjective feelings rather than by God's revealed character and Word.",
      "Any teaching that causes discomfort or emotional distress is inherently unloving and therefore untrue.",
      "Doctrine is optional to Christianity -- you can have 'Jesus' without His teachings, commands, and truth claims.",
      "Unity without doctrinal agreement is possible and desirable -- but this is merely uniformity in ambiguity, not genuine unity.",
    ],
    mindGames: [
      mindGames[0], // Emotional Blackmail
      mindGames[1], // Love Shaming
    ],
    fallacies: [
      fallacies[0], // Appeal to Emotion
      fallacies[4], // Equivocation on Love
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "progressive-christian",
    debriefPrompt:
      "Reflect on your engagement with the 'love over doctrine' argument. Were you able to show that biblical love includes truth-telling, correction, and warning? Could you demonstrate that Jesus Himself was both supremely loving AND doctrinally rigorous? Did you present the Three Angels' Messages as an act of love? How did you handle the emotional weight of the conversation without either capitulating or becoming cold? What would you improve?",
  },
  // ────── Module 2: Trajectory Hermeneutics ──────
  {
    id: "prog-mod-trajectory-hermeneutics",
    subjectId: "trajectory-hermeneutics",
    title: "Confronting Trajectory Hermeneutics: Who Has the Final Word -- Scripture or Culture?",
    doctrineBrief:
      "Trajectory hermeneutics, also called 'redemptive-movement hermeneutics,' is the interpretive method most commonly used by progressive Christians to justify departing from the explicit teachings of Scripture. Popularized by scholars like William Webb, it argues that the Bible contains an ethical 'trajectory' or 'arc' that was moving in a progressive direction -- and that faithful readers should continue that trajectory beyond the text itself.\n\nThe examples commonly cited are slavery (regulated in the Old Testament, undermined in the New), the status of women (subordinated in the Old Testament, elevated in the New), and dietary laws (strict in the Old Testament, relaxed in the New). The progressive argument is that the same liberalizing trajectory should be extended to contemporary issues like sexuality, gender identity, and religious pluralism.\n\nThe fatal flaw of this hermeneutic is that it places the interpreter above the text. The reader becomes the judge of where Scripture 'didn't go far enough,' using their own cultural moment as the endpoint of divine revelation. This is the opposite of Sola Scriptura. For SDAs, the Bible is its own interpreter. Its trajectory points not to 21st-century progressive values but to the restoration of God's creation ideal -- which is why Jesus, when asked about marriage, pointed BACK to Genesis 1-2 (Matthew 19:4-6), not forward to cultural evolution.",
    steelmanArguments: [
      steelmanArguments[1], // Bible's Progressive Ethical Trajectory
      steelmanArguments[4], // Theology Must Evolve
    ],
    hiddenAssumptions: [
      "The interpreter is qualified to determine where Scripture 'fell short' and to extend its teaching beyond what is written -- effectively replacing divine authority with human cultural judgment.",
      "The direction of the trajectory always aligns with contemporary progressive values -- a conclusion that is culturally convenient rather than exegetically demonstrated.",
      "Descriptive regulation (how the Bible managed existing cultural practices like slavery) is the same as moral endorsement, so 'moving beyond' regulation means moving beyond biblical morality itself.",
    ],
    mindGames: [
      mindGames[2], // Progressive Inevitability
      mindGames[3], // Pharisee Labeling
    ],
    fallacies: [
      fallacies[1], // False Analogy
      fallacies[3], // Chronological Snobbery
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "progressive-christian",
    debriefPrompt:
      "Evaluate your response to trajectory hermeneutics. Were you able to show that this method places the interpreter above Scripture? Could you demonstrate that the abolition of slavery was accomplished FROM within Scripture, not by going beyond it? Did you highlight that Jesus' own hermeneutic pointed BACK to creation, not forward to cultural trends? How effectively did you connect this to the SDA commitment to Sola Scriptura and the Sabbath as a creation ordinance?",
  },
  // ────── Module 3: Universal Reconciliation ──────
  {
    id: "prog-mod-universal-reconciliation",
    subjectId: "universal-reconciliation",
    title: "Confronting Universal Reconciliation: Does Love Mean Everyone Is Saved?",
    doctrineBrief:
      "Universal reconciliation (universalism) is the belief that all human beings will ultimately be saved, regardless of their beliefs, choices, or repentance. It has gained significant popularity in progressive Christian circles through writers like Rob Bell ('Love Wins'), who argued that a truly loving God would never allow anyone to be permanently lost.\n\nThe emotional appeal is enormous. No one wants to believe that people they love might be eternally separated from God. And the progressive Christian is correct that the traditional doctrine of eternal conscious torment -- burning in hell forever for finite sins -- IS a distortion of God's character. But the solution is not to eliminate judgment altogether; it is to recover the biblical teaching.\n\nSDAs are uniquely positioned to respond to universalism because of the doctrine of conditional immortality. The Bible teaches that only God has inherent immortality (1 Timothy 6:16), that the soul is not naturally immortal (Ezekiel 18:20), and that the final fate of the unrepentant is the 'second death' (Revelation 20:14) -- total, permanent destruction, not eternal torture. This preserves God's love (He doesn't torture anyone forever) and His justice (sin has real, final consequences). It also preserves human freedom: God will not force anyone into salvation who does not want it. The Three Angels' Messages call the world to decision because the decision genuinely matters -- eternally.",
    steelmanArguments: [
      steelmanArguments[2], // God of Universal Love Cannot Condemn
      steelmanArguments[0], // Love as Supreme Hermeneutical Lens
    ],
    hiddenAssumptions: [
      "God's love overrides His justice and the free will of creatures -- but forced salvation is a contradiction in terms.",
      "The only alternative to universalism is eternal conscious torment -- ignoring the SDA position of conditional immortality, which resolves the objection.",
      "The cross was a demonstration of love but not a substitutionary sacrifice -- if everyone is saved regardless, the cross addresses nothing that wouldn't be resolved anyway.",
    ],
    mindGames: [
      mindGames[0], // Emotional Blackmail
      mindGames[4], // Inclusion Trump Card
    ],
    fallacies: [
      fallacies[0], // Appeal to Emotion
      fallacies[2], // No True Christian
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "progressive-christian",
    debriefPrompt:
      "Review your engagement with universal reconciliation. Were you able to present the SDA doctrine of conditional immortality as a biblical alternative to both eternal torment and universalism? Could you show that universalism makes the cross unnecessary and undermines human free will? Did you effectively argue that Jesus Himself taught two destinies? How did you balance theological precision with compassion for the emotional weight of this topic?",
  },
  // ────── Module 4: Anti-Judgment Theology ──────
  {
    id: "prog-mod-anti-judgment-theology",
    subjectId: "anti-judgment-theology",
    title: "Confronting Anti-Judgment Theology: Is Judgment Really Bad News?",
    doctrineBrief:
      "Anti-judgment theology takes Jesus' command 'Judge not, that you be not judged' (Matthew 7:1) and elevates it to the supreme -- indeed, the only -- Christian ethical principle. In this framework, the worst thing a Christian can do is to make any moral evaluation of another person's behavior, beliefs, or lifestyle. The church's sole function is to welcome, affirm, and include; any call to repentance, moral accountability, or church discipline is an act of spiritual violence.\n\nThis theology is deeply attractive because it appears humble, non-threatening, and kind. But it is built on a selective reading of Jesus that ignores His calls to repentance (Matthew 4:17), His warnings about judgment and hell (Matthew 25:41-46), His command to 'judge with righteous judgment' (John 7:24), and His instruction in Matthew 7:5 to remove the log from your own eye SO THAT you can help your brother with his speck -- implying that helping your brother IS the goal.\n\nFor SDAs, the judgment is not bad news -- it is the heart of the everlasting gospel. Revelation 14:7 proclaims 'the hour of His judgment has come' as GOOD NEWS. The investigative judgment of Daniel 7 vindicates God's people, demonstrates God's fairness to the watching universe, and resolves the great controversy. Judgment means that God sees every hidden injustice, every secret oppression, every tear cried in the dark -- and He will make things right. Anti-judgment theology, for all its compassionate appearance, actually abandons the oppressed by denying them the hope of divine justice.",
    steelmanArguments: [
      steelmanArguments[3], // Jesus' Command Not to Judge
      steelmanArguments[5], // Traditional Theology Causes Harm
    ],
    hiddenAssumptions: [
      "Matthew 7:1 prohibits ALL moral evaluation, not just hypocritical judgment -- despite the context (7:2-5) clearly limiting the prohibition to hypocrisy and commanding proper discernment.",
      "Jesus never called anyone to repentance or moral transformation -- contradicted by Matthew 4:17, John 5:14, John 8:11, and dozens of other passages.",
      "Affirmation is always more loving than correction -- but a parent who never corrects a child is not loving; they are negligent.",
    ],
    mindGames: [
      mindGames[3], // Pharisee Labeling
      mindGames[1], // Love Shaming
    ],
    fallacies: [
      fallacies[4], // Equivocation on Love
      fallacies[2], // No True Christian
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "progressive-christian",
    debriefPrompt:
      "Assess your defense of the biblical doctrine of judgment. Were you able to show that the SDA investigative judgment is GOOD NEWS, especially for the oppressed? Could you demonstrate that Jesus corrected hypocritical judgment, not all moral discernment? Did you effectively use Revelation 14:7 to show that judgment is part of the everlasting gospel? How did you respond when labeled 'judgmental'? What would you do differently next time?",
  },
  // ────── Module 5: Cultural Accommodation ──────
  {
    id: "prog-mod-cultural-accommodation",
    subjectId: "cultural-accommodation",
    title: "Confronting Cultural Accommodation: Should the Church Follow Culture or Shape It?",
    doctrineBrief:
      "Cultural accommodation is the overarching strategy of progressive Christianity: the belief that the church must continuously revise its teachings to align with contemporary cultural values. It is presented as a matter of survival ('the church will become irrelevant if it doesn't adapt'), compassion ('outdated teachings cause harm'), and intellectual integrity ('we know more now than the biblical authors did').\n\nBut what is presented as humble adaptation is actually a profound shift in authority. When the church accommodates culture, it is implicitly declaring that contemporary society, not Scripture, is the final arbiter of truth. The Bible becomes a historical document to be mined for inspiration rather than a living Word to be obeyed. The result is not a more relevant church but a redundant one -- a church that merely echoes what the culture is already saying has nothing distinctive to offer.\n\nFor SDAs, cultural accommodation is not a theoretical danger; it is the specific eschatological threat described in the Three Angels' Messages. The mark of the beast represents the ultimate accommodation -- substituting human tradition and authority for divine command. The Sabbath stands as the supreme counter-cultural sign: a practice that refuses to conform to the world's calendar, economy, or values, and instead testifies every seventh day to God's creative and redemptive authority. The SDA remnant identity (Revelation 12:17) is defined by counter-cultural faithfulness: keeping God's commandments in a world that demands conformity. 2 Timothy 4:3-4 is a precise prophetic description of cultural accommodation: the time will come when people will not endure sound doctrine but will accumulate teachers to tell them what they want to hear.",
    steelmanArguments: [
      steelmanArguments[4], // Theology Must Evolve
      steelmanArguments[1], // Bible's Progressive Trajectory
    ],
    hiddenAssumptions: [
      "Contemporary culture is the most morally enlightened in history and therefore the best judge of which biblical teachings are timeless and which are outdated -- chronological snobbery at its purest.",
      "Relevance requires agreement with culture -- but the most relevant message in a sick society is the one that diagnoses the sickness, not the one that affirms it.",
      "The church's decline in the West is caused by its traditional teachings -- ignoring that accommodating churches are declining faster than traditional ones, and that the fastest-growing churches globally are theologically conservative.",
    ],
    mindGames: [
      mindGames[2], // Progressive Inevitability
      mindGames[4], // Inclusion Trump Card
    ],
    fallacies: [
      fallacies[3], // Chronological Snobbery
      fallacies[1], // False Analogy
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "progressive-christian",
    debriefPrompt:
      "Reflect on your engagement with cultural accommodation. Were you able to connect it to the SDA prophetic framework -- especially 2 Timothy 4:3-4, the Three Angels' Messages, and the mark of the beast? Could you show that the Sabbath is the ultimate counter-cultural sign? Did you effectively argue that accommodating churches are declining, not thriving? How did you handle the charge of being 'on the wrong side of history'? What areas need further study?",
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const progressiveChristianTraining: AATSAvatarTraining = {
  avatarId: "progressive-christian",
  avatarName: "The Progressive Christian",
  emoji: "\u{1F308}", // 🌈
  color: "border-pink-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
