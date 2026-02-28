// ─── AATS: Evangelical Avatar Training ──────────────────────────────────────
// Training data for the Evangelical avatar in the Apologetics Avatar Training
// System. Covers the five core friction-points between mainstream Evangelical
// Protestantism and Seventh-day Adventist theology: Sola Fide, Once Saved
// Always Saved, the Investigative Judgment, the Sabbath, and the moral law.

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "sola-fide",
    title: "Sola Fide (Faith Alone)",
    description:
      "Salvation is by faith alone; any works are legalism. Evangelicals argue that adding obedience to the salvation equation constitutes works-righteousness, rendering grace ineffective. SDAs affirm justification by faith while teaching that genuine faith inevitably produces Spirit-empowered obedience (James 2:26).",
  },
  {
    id: "osas",
    title: "Once Saved Always Saved (OSAS)",
    description:
      "True believers can never lose salvation. Also called 'eternal security' or 'perseverance of the saints,' this doctrine holds that anyone genuinely saved is irrevocably sealed regardless of subsequent choices. SDAs teach that salvation is secure in Christ moment by moment but can be forfeited through deliberate, persistent rebellion (Hebrews 6:4-6; 10:26-29).",
  },
  {
    id: "anti-investigative-judgment",
    title: "Anti-Investigative Judgment",
    description:
      "The Investigative Judgment is a fear doctrine invented after the Great Disappointment. Evangelicals claim the IJ was fabricated to explain the failed 1844 prediction and that it undermines assurance. SDAs root the pre-Advent judgment in Daniel 7:9-10, 8:14, Leviticus 16, and Revelation 14:7, showing it vindicates God's people rather than condemning them.",
  },
  {
    id: "anti-sabbath",
    title: "Anti-Sabbath",
    description:
      "The Sabbath was only for Jews; Sunday worship honors the resurrection. Evangelicals argue that the seventh-day Sabbath was a temporary covenant sign for Israel, superseded by resurrection-day worship. SDAs demonstrate that the Sabbath predates Sinai (Genesis 2:2-3), was made for all humanity (Mark 2:27), and was kept by Jesus, the apostles, and the early church.",
  },
  {
    id: "law-abolished",
    title: "Law Abolished",
    description:
      "Christ abolished the law at the cross; we are under grace not law. Evangelicals contend that the entire Old Testament legal system -- moral, ceremonial, and civil -- was nailed to the cross in Colossians 2:14. SDAs distinguish between the eternal moral law (Ten Commandments) and the ceremonial/typological laws fulfilled in Christ, showing that grace establishes rather than abolishes God's moral standard (Romans 3:31).",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "sa-ij-fear",
    title: "IJ = Fear Doctrine",
    argument:
      "The Investigative Judgment produces anxiety, not assurance. If God is currently reviewing the records of every professed believer to determine who is truly saved, how can anyone have peace? Paul says 'there is therefore now no condemnation for those who are in Christ Jesus' (Romans 8:1). A judgment that examines works undermines the finished work of Christ on the cross and replaces confidence with dread. No other Christian body teaches this doctrine, which was invented to salvage credibility after the Great Disappointment of 1844.",
    hiddenAssumptions: [
      "Judgment necessarily means condemnation rather than vindication -- ignoring that the Day of Atonement cleansed and restored God's people (Leviticus 16:30).",
      "Assurance and accountability are fundamentally incompatible -- yet Scripture repeatedly ties confidence to obedience (1 John 3:21; 2 Peter 1:10-11).",
      "A pre-Advent judgment has no biblical basis -- dismissing Daniel 7:9-10, 22 where judgment is given 'in favor of' the saints before the Ancient of Days arrives.",
    ],
    sdaResponse:
      "The Investigative Judgment does not introduce condemnation; it vindicates the saints. Daniel 7:22 says judgment was 'given in favor of the saints of the Most High.' Romans 8:1 is not negated by judgment -- it is the very verdict the judgment announces. The Day of Atonement in Leviticus 16 was a day of cleansing and restoration, not terror. Furthermore, Revelation 14:7 announces that 'the hour of His judgment has come' as part of the everlasting gospel -- judgment is good news for those who trust Christ. Assurance comes not from avoiding accountability but from knowing that our Advocate (1 John 2:1) stands in the judgment for us.",
  },
  {
    id: "sa-sabbath-jewish",
    title: "Sabbath Was Only for Jews",
    argument:
      "The Sabbath was given at Sinai as part of the Mosaic covenant with Israel. It was a sign between God and the Jews (Exodus 31:13, 17). Colossians 2:16 explicitly says 'let no one judge you regarding a Sabbath day,' proving the Sabbath was a shadow that passed away with the cross. The early church met on 'the first day of the week' (Acts 20:7; 1 Corinthians 16:2), and Hebrews 4 spiritualizes the Sabbath into an ongoing rest in Christ rather than a specific day.",
    hiddenAssumptions: [
      "Genesis 2:2-3 does not establish Sabbath observance -- ignoring that God blessed and sanctified the seventh day at creation, before any nation existed.",
      "Colossians 2:16 abolishes the weekly seventh-day Sabbath -- though the context addresses ceremonial sabbaths tied to 'food and drink, festivals, new moons,' the typical Jewish liturgical calendar (cf. Ezekiel 45:17; Hosea 2:11).",
      "Jesus did not reaffirm the Sabbath -- despite declaring Himself 'Lord of the Sabbath' (Mark 2:28), instructing His followers to pray their flight not be on the Sabbath (Matthew 24:20), and consistently keeping it.",
    ],
    sdaResponse:
      "The Sabbath predates Sinai by millennia. Genesis 2:2-3 records God resting, blessing, and sanctifying the seventh day at creation -- there were no Jews. Jesus said 'the Sabbath was made for man' (Mark 2:27), not 'for Jews.' Colossians 2:16-17 addresses ceremonial sabbaths connected to the feast system ('a shadow of things to come'), not the weekly creation Sabbath which is rooted in God's own rest. Acts 20:7 describes one evening gathering; 1 Corinthians 16:2 describes private bookkeeping at home ('by himself,' NKJV). Neither commands Sunday worship. Isaiah 66:22-23 prophesies Sabbath-keeping in the new earth, spanning from creation to eternity.",
  },
  {
    id: "sa-law-abolished",
    title: "The Law Was Abolished at the Cross",
    argument:
      "Colossians 2:14 says God 'wiped out the handwriting of requirements that was against us... nailing it to the cross.' Ephesians 2:15 says Christ 'abolished in His flesh the enmity, that is, the law of commandments contained in ordinances.' Romans 6:14 declares 'you are not under law but under grace.' The entire Old Testament legal system was a unified package; you cannot cherry-pick the Ten Commandments while discarding the rest. Christians are now led by the Spirit, not by an external code carved in stone.",
    hiddenAssumptions: [
      "All law is one undifferentiated category -- ignoring Scripture's own distinction between the 'law of God' (moral, Nehemiah 9:13-14) and the 'law of Moses' (ceremonial/civil, 2 Chronicles 33:8; Luke 2:22-24).",
      "Colossians 2:14 refers to the Ten Commandments -- though 'handwriting of requirements' (cheirographon) denotes a certificate of debt or ordinances, not the moral law written by God's own finger.",
      "Grace and law are inherently opposed -- contradicting Romans 3:31 where Paul asks 'do we then make void the law through faith? Certainly not! On the contrary, we establish the law.'",
    ],
    sdaResponse:
      "Scripture itself distinguishes categories of law. The Ten Commandments were spoken by God's voice (Deuteronomy 4:12-13), written by God's finger (Exodus 31:18), and placed inside the Ark of the Covenant (Deuteronomy 10:5). The ceremonial law was written by Moses in a book and placed beside the ark (Deuteronomy 31:26). Colossians 2:14's 'handwriting of ordinances' (cheirographon tois dogmasin) refers to the certificate of debt -- the record of our sins and the ceremonial system that pointed to Christ. Ephesians 2:15's 'law of commandments in ordinances' describes the ceremonial dividing wall between Jew and Gentile. Romans 3:31, 7:12, and 8:4 all affirm the ongoing validity of God's moral law, fulfilled in us 'who walk not according to the flesh but according to the Spirit.'",
  },
  {
    id: "sa-sda-cult",
    title: "SDA Is a Legalistic Cult",
    argument:
      "Seventh-day Adventists are a cult that teaches works-based salvation. By insisting on Sabbath-keeping, dietary laws, and the Investigative Judgment, SDAs add requirements to the gospel that Paul would condemn as 'another gospel' (Galatians 1:6-9). The emphasis on Ellen White as a prophetess places extra-biblical authority alongside Scripture, similar to Mormonism's reliance on Joseph Smith. The entire SDA system is built on fear, legalism, and the failed prophecy of William Miller.",
    hiddenAssumptions: [
      "Sabbath-keeping constitutes works-based salvation -- ignoring that obedience as a response to grace is affirmed throughout Scripture (Ephesians 2:10; Titus 2:11-14; Revelation 14:12).",
      "Obedience motivated by love is equivalent to legalism -- contradicting Jesus' own words: 'If you love Me, keep My commandments' (John 14:15).",
      "Any distinctive doctrine automatically makes a group a cult -- a standard that would classify early Christianity itself as a Jewish cult.",
    ],
    sdaResponse:
      "SDAs do not teach that obedience saves. We teach that Christ's sacrifice alone saves (Ephesians 2:8-9) and that saving faith produces obedience as its fruit (Ephesians 2:10; James 2:17-26). This is precisely what Paul, James, and Jesus taught. Revelation 14:12 describes God's end-time people as those who 'keep the commandments of God and have the faith of Jesus' -- both elements together. Ellen White's writings are valued as a 'lesser light' pointing to the Bible, not as a replacement for it. She consistently pointed readers back to Scripture. The 'cult' label is a conversation-stopper that avoids engaging with actual biblical arguments. Walter Martin, the foremost Evangelical authority on cults, concluded that SDAs are not a cult but an orthodox Christian body with distinctive beliefs.",
  },
  {
    id: "sa-romans-galatians",
    title: "Romans and Galatians Teach Against Law-Keeping",
    argument:
      "Paul's entire theological project in Romans and Galatians was to liberate Christians from the bondage of law-keeping. 'By the works of the law no flesh shall be justified' (Galatians 2:16). 'Christ is the end of the law for righteousness to everyone who believes' (Romans 10:4). 'If you are led by the Spirit, you are not under the law' (Galatians 5:18). Paul even rebuked Peter for Judaizing behavior. How can SDAs claim to follow Paul while insisting on law observance?",
    hiddenAssumptions: [
      "Paul condemned all law-keeping in any form -- ignoring that Paul himself kept the Sabbath (Acts 13:42-44; 17:2; 18:4), circumcised Timothy (Acts 16:3), and took a Nazarite vow (Acts 21:23-26).",
      "'Works of the law' means moral obedience -- when scholarship (especially the New Perspective on Paul) shows it refers to Torah-based identity markers (circumcision, food laws, feast days) used to exclude Gentiles.",
      "Paul contradicts James -- though James 2:24 says 'a person is justified by works and not by faith alone,' which harmonizes with Paul when both are read in context: Paul addresses the basis of justification (faith, not works), James addresses the evidence of justification (works demonstrate faith).",
    ],
    sdaResponse:
      "Paul's 'works of the law' (erga nomou) in Romans and Galatians addresses using Torah observance as a means of earning salvation or as ethnic boundary markers to exclude Gentiles -- not Spirit-empowered moral obedience. Romans 10:4's 'end' (telos) means 'goal' or 'fulfillment,' not 'termination' (cf. 1 Timothy 1:5 where telos means 'purpose'). Paul says in Romans 3:31, 'Do we then make void the law through faith? Certainly not! On the contrary, we establish the law.' In Romans 7:12 he declares 'the law is holy, and the commandment holy and just and good.' In Romans 8:4 the law's 'righteous requirement' is 'fulfilled in us who walk according to the Spirit.' Paul's project was not to abolish God's moral standard but to show that justification comes through faith in Christ, which then empowers genuine obedience.",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "mg-emotional-framing",
    name: "Emotional Framing",
    description:
      "Positioning Sabbath-keeping as 'bondage' and Sunday freedom as 'joy' to bypass exegesis. The opponent wraps their position in positive emotional language (freedom, joy, rest in Christ) and wraps yours in negative language (bondage, legalism, fear) so the listener makes an emotional decision before any Scripture is examined.",
    example:
      "'I used to be in bondage keeping all those rules, but when I found grace I was set free! Why would you go back to the chains of the law when Jesus offers freedom?' -- Note how 'keeping the Sabbath' is equated with 'chains' and abandoning it is equated with 'freedom,' all without a single verse.",
    detectionTip:
      "Watch for emotion-laden adjectives attached to doctrines rather than scriptural analysis. Ask: 'Can we set feelings aside for a moment and look at what the text actually says?' Redirect to specific passages. Feelings are valid but cannot override exegesis.",
  },
  {
    id: "mg-grace-weaponization",
    name: "Grace Weaponization",
    description:
      "Using grace language to shut down any discussion of obedience. The moment you mention commandments, law, or standards, the opponent invokes 'grace' as a trump card that ends the conversation. This weaponizes a beautiful doctrine into a rhetorical shield against biblical accountability.",
    example:
      "'We're under grace, not law! Why are you trying to put people back under bondage? Don't you believe in the finished work of Christ?' -- The implication is that mentioning obedience means you reject grace, creating a false binary where you either accept grace (their way) or you're a legalist.",
    detectionTip:
      "When someone uses grace to avoid discussing obedience, quote Romans 6:1-2: 'Shall we continue in sin that grace may abound? Certainly not!' Then show Titus 2:11-14 where grace 'teaches us' to live godly lives. Grace is not the opposite of obedience; it is the power for obedience.",
  },
  {
    id: "mg-loaded-language",
    name: "Loaded Language",
    description:
      "Labels like 'legalist,' 'cult,' 'Judaizer' used to end conversations before they begin. These terms carry heavy negative connotations in Evangelical culture and are deployed not as accurate descriptions but as rhetorical weapons to discredit without engaging the substance of arguments.",
    example:
      "'Oh, you're a Seventh-day Adventist? That's basically a cult. They're legalists who follow a false prophet.' -- Three loaded labels in two sentences, each designed to trigger an emotional reaction rather than invite biblical discussion.",
    detectionTip:
      "When labels are thrown, calmly ask for definitions: 'What do you mean by legalist? Can you define cult for me? What criteria are you using?' Most people cannot define these terms precisely. Once definitions are on the table, you can show how they do not apply. Refuse to be emotionally derailed by name-calling; stay anchored in Scripture.",
  },
  {
    id: "mg-testimony-pressure",
    name: "Testimony Pressure",
    description:
      "Sharing emotional conversion stories as if personal experience overrides biblical text. The opponent recounts a powerful personal testimony of 'leaving legalism' or 'finding grace' and treats their subjective experience as authoritative evidence that law-keeping is wrong. This creates social pressure: disagreeing with their doctrine feels like invalidating their experience.",
    example:
      "'When I stopped keeping the Sabbath, I felt such peace and freedom for the first time. The Holy Spirit confirmed to me that I was finally free. Are you saying my experience with God isn't real?' -- Now any biblical rebuttal feels like a personal attack on their spiritual journey.",
    detectionTip:
      "Affirm the person's sincerity without conceding the theology: 'I don't doubt your experience, but experience must be tested by Scripture (Isaiah 8:20; 1 John 4:1). The heart is deceitful (Jeremiah 17:9), which is why God gave us an objective standard. Let's look at what the Bible actually teaches.' This validates them personally while keeping the conversation grounded in the Word.",
  },
  {
    id: "mg-consensus-appeal",
    name: "Consensus Appeal",
    description:
      "Leveraging the sheer number of Sunday-keeping Christians to imply SDAs must be wrong. 'Two billion Christians can't all be wrong.' This is an argumentum ad populum dressed in theological clothing. Majority opinion is treated as the standard of truth rather than Scripture itself.",
    example:
      "'If the Sabbath were really important, don't you think the majority of Christians throughout history would have kept it? The fact that almost nobody agrees with you should tell you something.' -- The implication is that truth is determined by majority vote.",
    detectionTip:
      "Point out that truth has never been determined by majority. Noah was in the minority. Elijah stood alone against 850 false prophets. Jesus was crucified by popular demand. The Reformers were vastly outnumbered by Rome. Matthew 7:13-14 warns that the path to life is narrow and 'few find it.' Ask: 'Should we follow the crowd or follow Scripture?'",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "fl-false-dichotomy",
    name: "False Dichotomy",
    definition:
      "Presenting only two options as if they are the only possibilities when other valid alternatives exist. In the Evangelical context, this typically manifests as: 'You're either under grace OR keeping the law -- they can't coexist.'",
    example:
      "'You have to choose: are you saved by grace or are you trying to earn your way to heaven by keeping the law? You can't have it both ways.' This ignores the biblical position that grace empowers obedience (Romans 3:31; Titus 2:11-14; Revelation 14:12).",
    counterMove:
      "Expose the false binary by showing the third option Scripture actually teaches. Quote Romans 3:31: 'Do we then make void the law through faith? Certainly not! On the contrary, we establish the law.' Show that grace and law are not opponents -- grace is the power that writes the law on our hearts (Hebrews 8:10). Faith that does not produce obedience is dead faith (James 2:17).",
  },
  {
    id: "fl-proof-text-isolation",
    name: "Proof-Text Isolation",
    definition:
      "Extracting a single verse from its literary, historical, and canonical context and using it to 'prove' a position the original author never intended. This is the most common fallacy in anti-Sabbath and anti-law arguments.",
    example:
      "'Colossians 2:16 clearly says don't let anyone judge you about a Sabbath day. Case closed!' This rips the verse from its context, which addresses ceremonial observances ('food and drink, festivals, new moons') -- the ascending sequence of the Jewish liturgical calendar -- not the weekly creation Sabbath. Colossians 2:17 calls these 'a shadow of things to come,' and the weekly Sabbath is never called a shadow in Scripture; it is a memorial of creation.",
    counterMove:
      "Always demand the full context. Read Colossians 2:14-17 together and identify the subject: 'handwriting of requirements' (ceremonial law). Show the festivals-new moons-sabbaths sequence from Ezekiel 45:17, Hosea 2:11, and 1 Chronicles 23:31, which consistently refers to the ceremonial calendar. Then ask: 'If Paul abolished the weekly Sabbath here, why did he himself keep it every week in Acts 13:42-44, 17:2, and 18:4 -- years after writing Colossians?'",
  },
  {
    id: "fl-straw-man",
    name: "Straw Man",
    definition:
      "Misrepresenting an opponent's position to make it easier to attack. Instead of engaging what SDAs actually teach, the opponent constructs a distorted version and demolishes that instead.",
    example:
      "'SDAs believe you have to earn your way to heaven by keeping the Sabbath and following dietary laws. That's works salvation plain and simple.' No SDA statement of faith teaches this. The SDA Fundamental Belief #10 explicitly states: 'Through Christ we are justified, adopted as God's sons and daughters, and delivered from the lordship of sin.' Obedience is the fruit, not the root, of salvation.",
    counterMove:
      "Correct the misrepresentation directly and calmly. State the actual SDA position: 'We believe salvation is entirely by grace through faith in Christ (Ephesians 2:8-9). We also believe that saving faith produces obedience (Ephesians 2:10; James 2:17). We keep the commandments not to be saved but because we are saved. Could you engage with what we actually believe rather than a caricature?' Then invite them to read SDA Fundamental Belief #10 for themselves.",
  },
  {
    id: "fl-equivocation",
    name: "Equivocation",
    definition:
      "Using the same word in different senses within an argument without acknowledging the shift in meaning. In Evangelical anti-law arguments, the word 'law' (nomos) is treated as a single undifferentiated concept, blurring the distinction between moral, ceremonial, and civil law.",
    example:
      "'Paul says Christ is the end of the law (Romans 10:4), so the law -- including the Ten Commandments -- is done away with.' Here 'law' shifts meaning between Paul's specific usage (Torah-based righteousness system) and the moral law (Ten Commandments). The same word is used but the referent changes without notice.",
    counterMove:
      "Demand precision on which 'law' is being discussed. Show that the Bible itself distinguishes: the 'law of God' (the Ten Commandments, written by God's finger, placed inside the Ark -- Exodus 31:18; Deuteronomy 10:5) versus the 'law of Moses' (ceremonial ordinances, written by Moses in a book, placed beside the Ark -- Deuteronomy 31:24-26). These are not the same 'law.' Then show that 'telos' in Romans 10:4 means 'goal/fulfillment,' not 'termination' (cf. 1 Timothy 1:5; James 5:11 where the same word means 'outcome/purpose').",
  },
  {
    id: "fl-appeal-to-novelty",
    name: "Appeal to Novelty (Chronological Snobbery)",
    definition:
      "Assuming that newer theological developments are automatically superior to older ones. In the Evangelical context, this takes the form of treating the Reformation's sola fide emphasis as the final word on soteriology, dismissing any call to obedience as a regression to pre-Reformation darkness.",
    example:
      "'We've moved beyond Old Testament legalism. The Reformation recovered grace, and you want to drag us back to the Dark Ages with your Sabbath and dietary laws.' This assumes that anything pre-Reformation (or anything that sounds 'Old Testament') is inherently inferior to post-Reformation theology.",
    counterMove:
      "Point out that the Sabbath predates not only the Reformation but also the Old Testament itself -- it was established at creation (Genesis 2:2-3). The Reformers recovered important truths but did not complete the reformation. Luther himself acknowledged this. The SDA movement represents a further recovery of biblical truth, not a regression. Truth is not determined by chronology but by Scripture: 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them' (Isaiah 8:20).",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "sola-fide",
    title: "Faith and Works: The Biblical Balance",
    sdaPosition:
      "Seventh-day Adventists wholeheartedly affirm justification by grace through faith alone (Ephesians 2:8-9). However, 'faith alone' that produces no obedience is what James calls 'dead' faith (James 2:17, 26). Saving faith is never alone -- it is always accompanied by the fruit of the Spirit and loving obedience to God's commandments. We are saved by faith alone, but the faith that saves is never alone.",
    keyScriptures: [
      "Ephesians 2:8-10 -- 'For by grace you have been saved through faith... created in Christ Jesus for good works, which God prepared beforehand that we should walk in them.' Verses 8-9 establish grace; verse 10 establishes the purpose: good works.",
      "James 2:17-26 -- 'Faith without works is dead.' James does not contradict Paul; he complements him. Paul addresses the root of salvation (faith), James addresses the evidence of salvation (works). Both are inspired.",
      "Revelation 14:12 -- 'Here is the patience of the saints; here are those who keep the commandments of God and the faith of Jesus.' God's end-time people hold both -- commandment-keeping AND faith in Jesus. Not one or the other.",
      "Titus 2:11-14 -- Grace 'teaches us' to deny ungodliness and live soberly, righteously, and godly. Grace is not the absence of standards but the power to meet them.",
    ],
    counterArguments: [
      "When Evangelicals quote Ephesians 2:8-9, always complete the thought with verse 10. Paul's own argument does not stop at 'not of works' -- it continues to 'created for good works.' The passage is a unity, and separating verses 8-9 from verse 10 distorts Paul's message.",
      "The alleged Paul vs. James contradiction dissolves when you see they address different questions. Paul asks: 'How is a person justified before God?' Answer: by faith, not works. James asks: 'How do you know if faith is genuine?' Answer: by its fruits. They agree perfectly.",
      "Jesus Himself settled this debate: 'If you love Me, keep My commandments' (John 14:15). Obedience is the language of love, not the currency of salvation. A husband who says 'I love my wife' but never demonstrates it does not have real love. Faith that claims to trust Christ but refuses to follow Him is equally empty.",
      "'Not under law but under grace' (Romans 6:14) does not mean 'free to break the law.' Read the very next verse: 'Shall we sin because we are not under law but under grace? Certainly not!' (Romans 6:15). Being 'under grace' means grace empowers us to fulfill the law's righteous requirement (Romans 8:4).",
    ],
    closingStatement:
      "The gospel does not pit faith against obedience. It unites them. We are justified by faith alone, sanctified by faith working through love (Galatians 5:6), and will be glorified when Jesus returns. At every stage, faith is the root and obedience is the fruit. To separate them is to divide what God has joined together.",
  },
  {
    subjectId: "osas",
    title: "Assurance Without Presumption",
    sdaPosition:
      "SDAs teach that believers can have genuine, present assurance of salvation (1 John 5:13) while also taking seriously the biblical warnings against apostasy. Assurance is relational -- it is secure as long as we remain in Christ by faith. The Bible consistently warns genuine believers against falling away, which would be pointless if falling away were impossible.",
    keyScriptures: [
      "Hebrews 6:4-6 -- Those who were 'once enlightened, tasted the heavenly gift, became partakers of the Holy Spirit' can 'fall away.' These are not descriptions of false believers; they are descriptions of genuine spiritual experience followed by deliberate apostasy.",
      "Hebrews 10:26-29 -- 'If we sin willfully after receiving the knowledge of the truth, there no longer remains a sacrifice for sins.' The 'we' includes the writer and the believing audience -- genuine Christians are warned of a real danger.",
      "2 Peter 2:20-22 -- Those who 'escaped the pollutions of the world through the knowledge of the Lord and Savior Jesus Christ' can become 'entangled again and overcome.' You cannot escape what you were never in, nor can you return to what you never left.",
      "Ezekiel 18:24-26 -- 'When a righteous man turns away from his righteousness and commits iniquity... shall he live? None of the righteousness which he has done shall be remembered.' God Himself teaches that the righteous can turn away.",
    ],
    counterArguments: [
      "John 10:28-29 ('no one can snatch them out of My hand') does not say believers cannot voluntarily leave. It says no external force can remove them. The danger is not that God lets go but that people walk away. A child held by a parent cannot be snatched by a stranger, but the child can choose to release the parent's hand.",
      "Romans 8:38-39 lists external threats (death, life, angels, principalities, etc.) that cannot separate us from God's love. Conspicuously absent from the list is our own free will. Nothing external can separate us, but we can choose to separate ourselves through persistent, deliberate rebellion.",
      "The OSAS doctrine makes every biblical warning against apostasy meaningless. Why does Paul say 'I discipline my body... lest when I have preached to others I myself should become disqualified' (1 Corinthians 9:27)? Why does Jesus warn 'he who endures to the end shall be saved' (Matthew 24:13)? These warnings are unintelligible if falling away is impossible.",
      "OSAS leads to the bizarre conclusion that anyone who appears to fall away was 'never really saved.' This is unfalsifiable and provides zero comfort: you can never know if you are 'really' saved until you die. Biblical assurance is better: you ARE saved right now in Christ, and you remain saved as you continue to abide in Him (John 15:4-6).",
    ],
    closingStatement:
      "True security is not the claim that nothing you do matters; it is the confidence that Christ who began a good work in you will complete it as you continue to yield to Him (Philippians 1:6). Biblical assurance is anchored in a living, daily relationship with Jesus, not in a one-time past decision that supposedly cannot be reversed. 'Abide in Me,' Jesus said, 'and I in you' (John 15:4). The invitation assumes the possibility of not abiding.",
  },
  {
    subjectId: "anti-investigative-judgment",
    title: "The Pre-Advent Judgment: Vindication, Not Condemnation",
    sdaPosition:
      "The Investigative Judgment is not a fear doctrine but a vindication doctrine. Before Christ returns, God demonstrates to the watching universe that His saved people are genuinely His -- not to inform Himself (He already knows) but to answer Satan's accusations and vindicate both the saints and God's own character. It is rooted in the Day of Atonement typology (Leviticus 16), the judgment scene of Daniel 7:9-10, and the everlasting gospel of Revelation 14:6-7.",
    keyScriptures: [
      "Daniel 7:9-10, 22 -- A pre-Advent judgment scene where thrones are set up, books are opened, and judgment is given 'in favor of the saints of the Most High.' This judgment occurs before the Son of Man receives His kingdom (v. 13-14), not at the Second Coming.",
      "Daniel 8:14 -- 'Unto 2,300 days; then the sanctuary shall be cleansed.' The antitypical Day of Atonement, marking the beginning of the final phase of Christ's high priestly ministry in the heavenly sanctuary.",
      "Revelation 14:6-7 -- 'The hour of His judgment has come' is proclaimed as part of the 'everlasting gospel.' Judgment is good news, not bad news, for those who trust Christ. It is integral to the gospel itself.",
      "1 Peter 4:17 -- 'The time has come for judgment to begin at the house of God.' Judgment begins with God's people -- not to condemn them but to vindicate them before the universe.",
    ],
    counterArguments: [
      "The objection that 'there is no condemnation for those in Christ' (Romans 8:1) actually supports the IJ. The Investigative Judgment's purpose is to publicly demonstrate and confirm this very verdict: these people are indeed in Christ and there is no condemnation for them. The judgment announces Romans 8:1 to the cosmos.",
      "The Day of Atonement in Leviticus 16 was not a day of terror for faithful Israelites -- it was the day they were cleansed and vindicated (Leviticus 16:30). Those who 'afflicted their souls' (humbled themselves before God) were cleansed; only the impenitent were 'cut off' (Leviticus 23:29). This is the pattern for the antitypical Day of Atonement.",
      "Every legal system requires a judgment before sentencing. Even in human courts, you do not receive a reward or punishment without a hearing. The pre-Advent judgment is Christ reviewing the evidence -- not to discover anything new, but to demonstrate to the watching universe that His decisions are just (Psalm 51:4; Revelation 15:3).",
      "The claim that 'no other Christians teach this' is historically false. Many scholars have recognized a pre-Advent judgment in Daniel 7. Furthermore, truth is not determined by popularity but by Scripture. The Reformers taught doctrines no one had taught for centuries; novelty in human tradition is not novelty in biblical teaching.",
    ],
    closingStatement:
      "The Investigative Judgment is the courtroom scene where Jesus stands as both our Judge and our Advocate (1 John 2:1). For those who trust Him, the verdict is already determined: 'no condemnation' (Romans 8:1). The judgment vindicates God's people, answers Satan's accusations, and demonstrates to the universe that God is both just and merciful. Far from producing fear, it produces confidence -- because we know who our Lawyer is.",
  },
  {
    subjectId: "anti-sabbath",
    title: "The Sabbath: Creation to Eternity",
    sdaPosition:
      "The seventh-day Sabbath is a creation ordinance established by God Himself before sin, before Israel, and before Sinai. It is a memorial of creation (Exodus 20:8-11), a sign of sanctification (Ezekiel 20:12), and a foretaste of eternal rest (Isaiah 66:22-23). Jesus kept it, the apostles kept it, and the redeemed will keep it in the new earth. No biblical text transfers the sanctity of the seventh day to the first day of the week.",
    keyScriptures: [
      "Genesis 2:2-3 -- God rested on the seventh day, blessed it, and sanctified it at creation -- before any Jew, any covenant, any Sinai. The Sabbath is for humanity, not for a single nation.",
      "Mark 2:27-28 -- Jesus said 'the Sabbath was made for man, not man for the Sabbath.' 'Man' (anthropos) is generic -- humankind, not 'Jew.' Jesus then claims lordship over it, elevating rather than abolishing it.",
      "Isaiah 66:22-23 -- 'From one Sabbath to another, all flesh shall come to worship before Me, says the LORD.' The Sabbath persists in the new earth. A doctrine bookended by creation and new creation cannot be a temporary Jewish institution.",
      "Matthew 24:20 -- Jesus told His disciples to pray that their flight (during Jerusalem's destruction in AD 70) would not be on the Sabbath -- decades after the cross. If the Sabbath ended at the cross, this instruction is nonsensical.",
    ],
    counterArguments: [
      "Colossians 2:16-17 addresses the ceremonial calendar (festivals, new moons, ceremonial sabbaths) -- the same sequence found in Ezekiel 45:17, Hosea 2:11, and 1 Chronicles 23:31. The weekly creation Sabbath is categorically different from annual ceremonial sabbaths tied to the feast system. Paul himself kept the weekly Sabbath throughout Acts.",
      "Acts 20:7 describes one evening meal (breaking bread was a common meal, not necessarily communion -- Acts 2:46) on the first day of the week. This is a single narrative event, not a command to worship on Sunday. Meanwhile, Acts records Paul keeping Sabbath 84+ consecutive weeks in the synagogues (Acts 13:42-44; 17:2; 18:4, 11).",
      "The claim that Sunday honors the resurrection has no biblical foundation. No New Testament text commands Sunday worship, assigns holiness to the first day, or connects Sunday rest to the resurrection. The resurrection is honored by baptism (Romans 6:3-4), not by changing the day of worship.",
      "Hebrews 4:9 literally reads: 'There remains therefore a sabbatismos (Sabbath-keeping) for the people of God.' The Greek word sabbatismos refers specifically to Sabbath observance, not a vague spiritual rest. This is the only time this word appears in the New Testament, and it affirms ongoing Sabbath-keeping.",
    ],
    closingStatement:
      "The Sabbath is God's signature on creation, His seal in the moral law, and His gift to humanity across all ages. It was not born at Sinai and it did not die at Calvary. From Eden to Eternity, the seventh day remains holy because the One who made it holy has never revoked that blessing. The question is not 'Are you under the Sabbath?' but 'Are you under the authority of the One who made it?'",
  },
  {
    subjectId: "law-abolished",
    title: "Grace Establishes the Law",
    sdaPosition:
      "SDAs teach that the moral law (Ten Commandments) is an eternal reflection of God's character and cannot be abolished any more than God's character can change. The ceremonial law, which pointed forward to Christ's sacrifice, was fulfilled at the cross. Grace does not nullify the moral law; it writes the law on our hearts through the new covenant (Hebrews 8:10). Christ came to magnify the law (Isaiah 42:21), not to destroy it (Matthew 5:17-18).",
    keyScriptures: [
      "Matthew 5:17-18 -- 'Do not think that I came to destroy the Law or the Prophets. I did not come to destroy but to fulfill. Till heaven and earth pass away, one jot or one tittle will by no means pass from the law.' Jesus could not have been more explicit.",
      "Romans 3:31 -- 'Do we then make void the law through faith? Certainly not! On the contrary, we establish the law.' Paul's own answer to those who claim faith abolishes the law.",
      "Hebrews 8:10 -- 'I will put My laws in their mind and write them on their hearts.' The new covenant does not remove the law; it relocates it from stone tablets to human hearts. The content of the law remains; the medium changes.",
      "Romans 7:12 -- 'The law is holy, and the commandment holy and just and good.' This is Paul writing after the cross, after his conversion, after decades of ministry -- and he calls the law holy, just, and good.",
    ],
    counterArguments: [
      "Colossians 2:14's 'handwriting of requirements' (cheirographon tois dogmasin) is not the Ten Commandments. The Greek cheirographon means 'a handwritten document of debt' -- a certificate recording our sins against us. God nailed our debt to the cross, not His own moral law. The Ten Commandments were written by God's finger, not by human handwriting.",
      "Ephesians 2:15's 'law of commandments contained in ordinances' (ton nomon ton entolon en dogmasin) specifically refers to the ceremonial laws that created the barrier between Jew and Gentile -- circumcision, dietary distinctions, and purification rites. Christ removed this dividing wall so that both Jew and Gentile could approach God on equal footing through faith.",
      "If the moral law was abolished at the cross, then there is no sin (Romans 4:15: 'where there is no law there is no transgression') and no need for grace (Romans 5:20: 'where sin abounded, grace abounded much more'). Abolishing the law does not exalt grace -- it destroys the very foundation that makes grace necessary and meaningful.",
      "The distinction between moral and ceremonial law is not an SDA invention. The Bible itself separates them physically (Ten Commandments inside the Ark vs. Book of the Law beside the Ark), by authorship (God's finger vs. Moses' hand), and by function (eternal moral standard vs. temporary typological system pointing to Christ).",
    ],
    closingStatement:
      "The cross did not abolish God's moral standard; it paid the penalty for our violation of it and provided the power to keep it. As Paul declares, grace establishes the law. The new covenant promise is not a law-free existence but a law-written-on-the-heart existence. When we love God supremely and love our neighbor as ourselves, we fulfill the very law that grace enables us to keep.",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ── Module 1: Sola Fide ─────────────────────────────────────────────────
  {
    id: "mod-ev-sola-fide",
    subjectId: "sola-fide",
    title: "Sola Fide: Faith, Works, and the Gospel",
    doctrineBrief:
      "Mainstream Evangelical theology teaches that salvation is by faith alone (sola fide) and that any emphasis on obedience or works constitutes legalism. This doctrine, rooted in the Reformation's reaction against medieval Roman Catholic merit theology, correctly identifies faith as the sole instrument of justification. However, many Evangelicals extend this principle to mean that obedience is irrelevant, optional, or even dangerous to mention in the context of salvation. The SDA position affirms sola fide for justification while insisting, with James, that 'faith without works is dead' (James 2:26). We are saved by faith alone, but the faith that saves is never alone -- it is always accompanied by the fruit of Spirit-empowered obedience. Ephesians 2:8-10 is the key passage: saved by grace through faith (v. 8-9) for good works (v. 10). Both halves of this passage are Paul's words, and both are authoritative.",
    steelmanArguments: [steelmanArguments[3], steelmanArguments[4]],
    hiddenAssumptions: [
      "Faith and obedience are mutually exclusive categories -- yet Jesus said 'If you love Me, keep My commandments' (John 14:15).",
      "Paul and James contradict each other -- ignoring that Paul addresses the basis of justification while James addresses its evidence.",
      "Any mention of law or commandments in the Christian life equals legalism -- a definition that would condemn Jesus, Paul, James, and John as legalists.",
      "The Reformation's recovery of sola fide was complete and requires no further development -- despite Luther himself acknowledging areas left unfinished.",
    ],
    mindGames: [mindGames[1], mindGames[2], mindGames[3]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "evangelical",
    debriefPrompt:
      "Reflect on how you handled the grace-vs-works tension. Were you able to affirm justification by faith while also demonstrating the necessity of Spirit-empowered obedience? Could you show from Scripture that faith and works are not enemies but partners? Did you successfully distinguish between legalism (works as the root of salvation) and the SDA position (works as the fruit of salvation)? What passages were most effective in your conversation?",
  },

  // ── Module 2: Once Saved Always Saved ───────────────────────────────────
  {
    id: "mod-ev-osas",
    subjectId: "osas",
    title: "Once Saved Always Saved: Eternal Security Examined",
    doctrineBrief:
      "The doctrine of 'Once Saved Always Saved' (OSAS), also known as eternal security or the perseverance of the saints, teaches that anyone who has genuinely accepted Christ can never lose their salvation regardless of their subsequent choices or behavior. This is rooted in Calvinist theology (the 'P' in TULIP) and draws heavily on John 10:28-29 and Romans 8:38-39. While the doctrine rightly emphasizes God's faithfulness and power, it effectively denies the reality of human free will in the ongoing salvation relationship and renders meaningless the numerous biblical warnings against apostasy. The SDA position teaches genuine, present assurance of salvation (1 John 5:13) while affirming that salvation is a living relationship that can be abandoned. Security is found not in the impossibility of leaving but in the faithfulness of the One who holds us as we continue to trust Him.",
    steelmanArguments: [steelmanArguments[0], steelmanArguments[3]],
    hiddenAssumptions: [
      "God's sovereignty overrides human free will in salvation -- yet God consistently appeals to human choice throughout Scripture (Deuteronomy 30:19; Joshua 24:15; Revelation 22:17).",
      "Biblical warnings against apostasy are hypothetical and addressed to false believers -- despite the descriptions fitting genuine believers (Hebrews 6:4-5; 2 Peter 2:20-22).",
      "Assurance requires impossibility of loss -- when Scripture grounds assurance in present relationship with Christ, not in the impossibility of future departure (1 John 5:13; Romans 8:1).",
      "Anyone who falls away was 'never really saved' -- an unfalsifiable claim that provides less assurance, not more, since you can never know if your own faith is 'genuine enough.'",
    ],
    mindGames: [mindGames[0], mindGames[3], mindGames[4]],
    fallacies: [fallacies[0], fallacies[1]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "evangelical",
    debriefPrompt:
      "Consider how the conversation addressed the nature of assurance. Were you able to provide genuine comfort and security without embracing the presumption of OSAS? Did you successfully show that the biblical warnings against apostasy are real, not hypothetical? How did you handle the 'never really saved' escape clause? Were you able to demonstrate that SDA assurance (present security in a living relationship with Christ) is actually stronger than OSAS assurance (which can always be undermined by the question 'was I ever really saved?')?",
  },

  // ── Module 3: Anti-Investigative Judgment ───────────────────────────────
  {
    id: "mod-ev-ij",
    subjectId: "anti-investigative-judgment",
    title: "The Investigative Judgment: Heaven's Vindication",
    doctrineBrief:
      "Evangelicals typically reject the Investigative Judgment (IJ) as a uniquely SDA invention with no biblical basis, born from the embarrassment of the Great Disappointment of 1844. They argue it undermines assurance by making salvation contingent on a works-review and contradicts Romans 8:1. The SDA position is that the IJ is the antitypical Day of Atonement prophesied in Daniel 8:14, depicted in the judgment scene of Daniel 7:9-10, 22, and proclaimed in the first angel's message of Revelation 14:6-7. It is not a condemnation procedure but a vindication procedure: Christ, our High Priest and Advocate, demonstrates before the watching universe that His people are genuinely covered by His blood. The judgment is 'in favor of the saints' (Daniel 7:22). For those who trust Christ, the IJ is not bad news but the best news -- our case is being presented by the best Lawyer in the universe.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: [
      "Judgment and gospel are incompatible -- yet Revelation 14:6-7 presents judgment as part of the 'everlasting gospel.'",
      "The Day of Atonement typology was fully exhausted at the cross -- ignoring that Leviticus 16 includes a two-phase ministry (daily and yearly) corresponding to Christ's ongoing heavenly intercession.",
      "Daniel 8:14 has no connection to judgment or the sanctuary -- despite the passage explicitly mentioning the sanctuary ('then the sanctuary shall be cleansed') and Daniel 7 providing a parallel judgment scene.",
      "All SDA doctrine is tainted by the Great Disappointment -- a genetic fallacy that attacks origins rather than engaging the biblical arguments on their merits.",
    ],
    mindGames: [mindGames[0], mindGames[2], mindGames[4]],
    fallacies: [fallacies[1], fallacies[2], fallacies[4]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "evangelical",
    debriefPrompt:
      "Evaluate how you presented the Investigative Judgment. Did you successfully reframe it as vindication rather than condemnation? Were you able to connect it to the Day of Atonement typology in Leviticus 16? Did you show from Daniel 7:9-10, 22 that a pre-Advent judgment is explicitly biblical? How did you handle the emotional objection that the IJ produces fear? Were you able to demonstrate that having Jesus as our Advocate in the judgment is actually the strongest possible basis for assurance?",
  },

  // ── Module 4: Anti-Sabbath ──────────────────────────────────────────────
  {
    id: "mod-ev-sabbath",
    subjectId: "anti-sabbath",
    title: "The Sabbath: God's Eternal Sign",
    doctrineBrief:
      "The anti-Sabbath position is perhaps the most common Evangelical objection to SDA faith. It takes several forms: (1) the Sabbath was only for Jews, given at Sinai; (2) Colossians 2:16 abolishes the Sabbath; (3) the early church worshiped on Sunday in honor of the resurrection; (4) Hebrews 4 spiritualizes the Sabbath into rest in Christ. The SDA response demonstrates that the Sabbath originates at creation (Genesis 2:2-3), was made for all humanity (Mark 2:27), was kept by Jesus and the apostles, is affirmed in the New Testament (Hebrews 4:9), and will be kept in the new earth (Isaiah 66:22-23). No biblical text transfers the sanctity of the seventh day to any other day. The Sabbath is a creation ordinance that spans from Eden to the new earth -- it cannot be a temporary Jewish institution.",
    steelmanArguments: [steelmanArguments[1], steelmanArguments[2]],
    hiddenAssumptions: [
      "The Sabbath began at Sinai with the Jews -- ignoring Genesis 2:2-3, where God established it at creation for all humanity.",
      "Colossians 2:16 addresses the weekly seventh-day Sabbath -- when the context indicates ceremonial sabbaths tied to the feast calendar.",
      "The early church universally worshiped on Sunday -- when historical evidence shows Sabbath-keeping continued for centuries, and Sunday worship was gradually introduced through pagan-influenced compromise.",
      "If no explicit New Testament command reaffirms a practice, it is abolished -- a hermeneutical principle that, if applied consistently, would abolish tithing, Trinitarian worship, and dozens of other practices Evangelicals affirm.",
    ],
    mindGames: [mindGames[0], mindGames[1], mindGames[2], mindGames[4]],
    fallacies: [fallacies[0], fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "evangelical",
    debriefPrompt:
      "Review how you handled the Sabbath discussion. Were you able to establish the creation origin of the Sabbath before the conversation moved to Colossians 2? Did you successfully demonstrate that Colossians 2:16 addresses ceremonial sabbaths, not the weekly Sabbath? How did you respond to the Sunday worship claim? Were you able to show the absence of any biblical command for Sunday observance? Did you use Isaiah 66:22-23 and Hebrews 4:9 to demonstrate the Sabbath's eternal nature? The Sabbath conversation is often the most emotionally charged -- did you maintain grace and patience throughout?",
  },

  // ── Module 5: Law Abolished ─────────────────────────────────────────────
  {
    id: "mod-ev-law",
    subjectId: "law-abolished",
    title: "The Law: Abolished or Established?",
    doctrineBrief:
      "The 'law abolished' position holds that Christ ended the entire Old Testament legal system at the cross, including the Ten Commandments. Key proof texts include Colossians 2:14, Ephesians 2:15, Romans 6:14, and Romans 10:4. Evangelicals argue that Christians are now guided solely by the Holy Spirit and the 'law of Christ' (Galatians 6:2), which they define as love apart from any written code. The SDA response carefully distinguishes between the moral law (Ten Commandments -- eternal, reflecting God's character, placed inside the Ark) and the ceremonial law (Mosaic ordinances -- temporary, pointing to Christ, placed beside the Ark). The ceremonial law was indeed fulfilled at the cross; the moral law was established, magnified, and written on believers' hearts through the new covenant (Hebrews 8:10). Jesus Himself declared: 'Do not think that I came to destroy the Law or the Prophets. I did not come to destroy but to fulfill' (Matthew 5:17).",
    steelmanArguments: [steelmanArguments[2], steelmanArguments[4]],
    hiddenAssumptions: [
      "The Bible treats all 'law' as one monolithic category -- ignoring the physical, authorial, and functional distinctions Scripture itself makes between the moral law and the ceremonial law.",
      "'Fulfill' (pleroo) in Matthew 5:17 means 'bring to an end' -- when the word actually means 'fill up, complete, bring to full expression,' and Jesus spends the rest of Matthew 5 intensifying the law's demands, not relaxing them.",
      "The 'law of Christ' is a replacement for the Ten Commandments -- when the 'law of Christ' (bearing one another's burdens, Galatians 6:2) is an application of the second great commandment, which is itself a summary of the last six commandments (Romans 13:8-10).",
      "If the moral law still stands, Christians must also keep the ceremonial law -- a non sequitur that ignores the clear biblical basis for distinguishing the two and the explicit New Testament teaching that the ceremonial system was fulfilled in Christ (Hebrews 9:9-12; 10:1-4).",
    ],
    mindGames: [mindGames[1], mindGames[2], mindGames[0]],
    fallacies: [fallacies[1], fallacies[3], fallacies[4]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "evangelical",
    debriefPrompt:
      "Assess how effectively you distinguished the moral law from the ceremonial law. Were you able to use the physical placement (inside vs. beside the Ark), authorship (God's finger vs. Moses' hand), and function (eternal standard vs. temporary type) to establish this distinction? Did you handle Colossians 2:14 and Ephesians 2:15 by showing they address the ceremonial law and the certificate of debt, not the Ten Commandments? Were you able to use Jesus' words in Matthew 5:17-18 as the definitive statement on the law's continuity? Did the conversation address the logical impossibility of abolishing the moral law (no law = no sin = no need for grace)?",
  },
];

// ── Exported Training Object ────────────────────────────────────────────────

export const evangelicalTraining: AATSAvatarTraining = {
  avatarId: "evangelical",
  avatarName: "The Evangelical",
  emoji: "\u271D\uFE0F",
  color: "border-blue-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
