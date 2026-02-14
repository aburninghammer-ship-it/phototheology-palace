/**
 * Q1 2026 Sabbath School Quarterly: "Uniting Heaven and Earth"
 * Philippians & Colossians
 * Principal Contributor: Clinton Wahlen
 */

export interface QuarterlyDay {
  day: string;
  title: string;
  date: string;
  scriptures: string[];
  content: string;
}

export interface QuarterlyLessonData {
  id: string;
  num: number;
  title: string;
  startDate: string;
  endDate: string;
  memoryText: string;
  memoryRef: string;
  scriptures: string[];
  sabbathIntro: string;
  days: QuarterlyDay[];
}

export const Q1_2026_TITLE = "Uniting Heaven and Earth";
export const Q1_2026_SUBTITLE = "Philippians & Colossians";
export const Q1_2026_QUARTER = "Q1 2026";
export const Q1_2026_DESCRIPTION =
  "This quarter we study Paul's epistles to the Philippians and to the Colossians. They reveal Christ, the only One able to unite heaven and earth. He is the ladder Jacob saw stretching from earth to heaven. As the Son of man and the Son of God, He redeems us from sin, and He intercedes for us.";

export const Q1_2026_LESSONS: QuarterlyLessonData[] = [
  {
    id: "01",
    num: 1,
    title: "Persecuted but Not Forsaken",
    startDate: "2025-12-27",
    endDate: "2026-01-02",
    memoryText:
      "Rejoice in the Lord always. Again I will say, rejoice!",
    memoryRef: "Philippians 4:4, NKJV",
    scriptures: [
      "Eph. 3:1",
      "2 Cor. 4:7-12",
      "Acts 9:16",
      "Philem. 15, 16",
      "Col. 4:9",
      "Phil. 1:1-3",
      "Col. 1:1, 2",
    ],
    sabbathIntro:
      "An Adventist pastor, imprisoned on false charges, spent nearly two years behind bars. Though at first greatly perplexed, he realized the prison was his God-given mission field. Paul wrote Philippians and Colossians from prison. In Philippi itself, after Paul and Silas were unjustly accused, the jailer put their feet in the stocks. At midnight, they were praying and singing hymns to God. Truly they knew how to 'rejoice always.' This week we'll look at the circumstances that Paul faced.",
    days: [
      {
        day: "Sunday",
        title: "Paul, the Prisoner of Jesus Christ",
        date: "2025-12-28",
        scriptures: ["Eph. 3:1", "Philem. 1"],
        content:
          "Paul describes himself as 'an ambassador in chains' (Eph. 6:20, NKJV). He had been on missionary journeys, raising up churches and training workers for the Lord. Paul was also imprisoned later, when he wrote 2 Timothy. In none of the prison epistles does Paul mention exactly where he was imprisoned.",
      },
      {
        day: "Monday",
        title: "Paul in Chains",
        date: "2025-12-29",
        scriptures: ["2 Cor. 4:7-12", "2 Cor. 6:3-7"],
        content:
          "While in Macedonia, Paul mentions multiple imprisonments. The first recorded instance was in Philippi. Later he was imprisoned in Jerusalem briefly before being transferred to prison in Caesarea. No matter how hard life got, Paul was able to see a brighter side, and that gave him courage to bear up under stress. Despite Satan hurling everything he could, Paul knew he was not forsaken.",
      },
      {
        day: "Tuesday",
        title: "Paul in Philippi",
        date: "2025-12-30",
        scriptures: ["Acts 16:6-15", "Acts 16:16-34"],
        content:
          "During Paul's second missionary journey, shortly after Timothy was added to the team, they are forbidden by the Holy Spirit to continue across Asia Minor. During a vision, Paul sees a man pleading with him to come to Macedonia. Philippi was 'the chief city of that part of Macedonia' — one of the most honored cities of the Roman Empire. Paul and his team joined people for prayer by the riverside, where Lydia and her household were baptized.",
      },
      {
        day: "Wednesday",
        title: "Paul and Colossae",
        date: "2025-12-31",
        scriptures: ["Col. 4:12", "Col. 1:7", "Philem. 15, 16", "Col. 4:9"],
        content:
          "We have no record of Paul ever visiting Colossae, which tells us something about the effectiveness of his evangelistic strategy. It was Epaphras, a resident of Colossae, who brought the gospel to that city. Most likely it was in the mid-50s, when Paul was in nearby Ephesus and 'all they which dwelt in Asia heard the word of the Lord Jesus.' Paul gently urged Philemon to pursue reconciliation with Onesimus.",
      },
      {
        day: "Thursday",
        title: "The Churches of Philippi and Colossae",
        date: "2026-01-01",
        scriptures: ["Phil. 1:1-3", "Col. 1:1, 2"],
        content:
          "Paul's typical greeting in his epistles calls Christians in those places 'saints'; that is, through baptism they have been set apart as God's special people. Paul refers to 'overseers and deacons' in Philippi and 'faithful brothers in Christ' in Colossae. Training coworkers such as Timothy and Epaphras and providing for the leadership of local churches was a priority for Paul and augmented his evangelistic efforts.",
      },
      {
        day: "Friday",
        title: "Further Thought",
        date: "2026-01-02",
        scriptures: ["Phil. 1:7", "Col. 4:3"],
        content:
          "Read Ellen G. White, 'Paul's Last Journey to Jerusalem,' pp. 389-398, in The Acts of the Apostles. Paul, even from a Roman prison, was able to respond to challenges in distant churches. He knew his time was short, and he did all he could to draw the church closer to heaven and to each other.",
      },
    ],
  },
  {
    id: "02",
    num: 2,
    title: "Reasons for Thanksgiving and Prayer",
    startDate: "2026-01-03",
    endDate: "2026-01-09",
    memoryText:
      "Being confident of this very thing, that He who has begun a good work in you will complete it until the day of Jesus Christ.",
    memoryRef: "Philippians 1:6, NKJV",
    scriptures: [
      "Phil. 1:1-18",
      "1 Cor. 13:1-8",
      "Jer. 17:9",
      "Col. 1:1-12",
      "1 Pet. 1:4",
      "Ps. 119:105",
      "Isa. 30:21",
    ],
    sabbathIntro:
      "Paul quite intentionally begins his epistles with words of greeting — and thanksgiving. 'Grace to you and peace from God our Father and the Lord Jesus Christ. We give thanks to the God and Father of our Lord Jesus Christ' (Col. 1:2, 3, NKJV). We, like Paul, have much to be thankful for.",
    days: [
      { day: "Sunday", title: "Thanksgiving and Joy", date: "2026-01-04", scriptures: ["Phil. 1:1-8"], content: "Paul thanks God for the Philippians' partnership in the gospel from the first day until now. His love for them overflows, and he prays that their love will abound yet more and more in knowledge and all discernment." },
      { day: "Monday", title: "Paul's Prayer for Philippians", date: "2026-01-05", scriptures: ["Phil. 1:9-11", "1 Cor. 13:1-8"], content: "Paul prays that their love may abound more and more in knowledge and all discernment, that they may approve the things that are excellent, being filled with the fruits of righteousness." },
      { day: "Tuesday", title: "The Gospel Advances", date: "2026-01-06", scriptures: ["Phil. 1:12-18"], content: "Paul's chains have become evident to the whole palace guard and to all the rest that his imprisonment is for Christ. Most of the brethren have become confident by his chains and are much more bold to speak the word without fear." },
      { day: "Wednesday", title: "Thanksgiving for the Colossians", date: "2026-01-07", scriptures: ["Col. 1:1-8"], content: "Paul gives thanks for the faith and love of the Colossians, since hearing of their faith in Christ Jesus and the love they have for all the saints, because of the hope laid up for them in heaven." },
      { day: "Thursday", title: "Prayer for the Colossians", date: "2026-01-08", scriptures: ["Col. 1:9-12", "Ps. 119:105", "Isa. 30:21"], content: "Paul prays that the Colossians may be filled with the knowledge of God's will in all wisdom and spiritual understanding, walking worthy of the Lord, fully pleasing Him, being fruitful in every good work." },
      { day: "Friday", title: "Further Thought", date: "2026-01-09", scriptures: ["Phil. 1:6"], content: "God who began the good work in us will carry it on to completion. Consider the confidence Paul has in God's faithfulness to finish what He started. How does this assurance shape our daily walk?" },
    ],
  },
  {
    id: "03",
    num: 3,
    title: "Life and Death",
    startDate: "2026-01-10",
    endDate: "2026-01-16",
    memoryText: "For to me, to live is Christ, and to die is gain.",
    memoryRef: "Philippians 1:21, NKJV",
    scriptures: [
      "Phil. 1:19-30",
      "1 Cor. 4:14-16",
      "2 Cor. 10:3-6",
      "John 17:17-19",
      "Micah 6:8",
      "Acts 14:22",
    ],
    sabbathIntro:
      "Death is the opposite of life, the enemy of life. Paul emphatically says that Christ died to 'destroy him that had the power of death, that is, the devil; and deliver them who through fear of death were all their lifetime subject to bondage' (Heb. 2:14, 15). Although ready to die for Christ, Paul was confident of his long-term fate.",
    days: [
      { day: "Sunday", title: "The Sufficiency of Christ", date: "2026-01-11", scriptures: ["Phil. 1:19-20"], content: "Paul expresses confidence that through the Philippians' prayers and the supply of the Spirit of Jesus Christ, his imprisonment will turn out for his deliverance. Christ shall be magnified in his body, whether by life or by death." },
      { day: "Monday", title: "To Live Is Christ", date: "2026-01-12", scriptures: ["Phil. 1:21-26"], content: "Paul is hard-pressed between two desires: to depart and be with Christ, which is far better, or to remain in the flesh, which is more needful for the Philippians. His life is wholly devoted to Christ." },
      { day: "Tuesday", title: "Standing Firm for the Gospel", date: "2026-01-13", scriptures: ["Phil. 1:27-30", "Acts 14:22"], content: "Paul urges the Philippians to let their conduct be worthy of the gospel of Christ, standing fast in one spirit, with one mind striving together for the faith of the gospel." },
      { day: "Wednesday", title: "Spiritual Warfare", date: "2026-01-14", scriptures: ["2 Cor. 10:3-6", "John 17:17-19"], content: "Paul reminds us that though we walk in the flesh, we do not war according to the flesh. The weapons of our warfare are mighty in God for pulling down strongholds." },
      { day: "Thursday", title: "Walking Humbly", date: "2026-01-15", scriptures: ["Micah 6:8", "1 Cor. 4:14-16"], content: "What does the Lord require of us? To do justly, to love mercy, and to walk humbly with our God. Paul urges the Corinthians to imitate him as he imitates Christ." },
      { day: "Friday", title: "Further Thought", date: "2026-01-16", scriptures: ["Phil. 1:21"], content: "Consider Paul's remarkable statement 'to live is Christ.' How fully does our life reflect this priority? What would need to change for us to honestly say the same?" },
    ],
  },
  {
    id: "04",
    num: 4,
    title: "Unity Through Humility",
    startDate: "2026-01-17",
    endDate: "2026-01-23",
    memoryText:
      "Fulfill my joy by being like-minded, having the same love, being of one accord, of one mind.",
    memoryRef: "Philippians 2:2, NKJV",
    scriptures: [
      "Phil. 2:1-11",
      "Jer. 17:9",
      "Phil. 4:8",
      "1 Cor. 8:2",
      "Rom. 8:3",
      "Heb. 2:14-18",
    ],
    sabbathIntro:
      "Unity is strength. But knowing what is true is not the same as doing it. Paul bases the necessity of unity on the teaching and example of Jesus. The origin of disunity in the universe was pride, and the solution is humility — the humility of Christ, who emptied Himself and took the form of a servant.",
    days: [
      { day: "Sunday", title: "The Encouragement in Christ", date: "2026-01-18", scriptures: ["Phil. 2:1-4"], content: "Paul appeals to whatever consolation there is in Christ, whatever comfort of love, whatever fellowship of the Spirit, whatever affection and mercy. Let nothing be done through selfish ambition or conceit, but in lowliness of mind let each esteem others better than himself." },
      { day: "Monday", title: "The Mind of Christ", date: "2026-01-19", scriptures: ["Phil. 2:5-8", "Rom. 8:3"], content: "Let this mind be in you which was also in Christ Jesus, who, being in the form of God, did not consider it robbery to be equal with God, but made Himself of no reputation, taking the form of a bondservant, and coming in the likeness of men." },
      { day: "Tuesday", title: "Highly Exalted", date: "2026-01-20", scriptures: ["Phil. 2:9-11"], content: "Therefore God also has highly exalted Him and given Him the name which is above every name, that at the name of Jesus every knee should bow, of those in heaven, and of those on earth, and of those under the earth." },
      { day: "Wednesday", title: "The Deceitful Heart", date: "2026-01-21", scriptures: ["Jer. 17:9", "Phil. 4:8"], content: "The heart is deceitful above all things, and desperately wicked; who can know it? Paul's answer: focus on whatever is true, noble, just, pure, lovely, and of good report." },
      { day: "Thursday", title: "Christ's Humanity", date: "2026-01-22", scriptures: ["Heb. 2:14-18", "1 Cor. 8:2"], content: "Inasmuch then as the children have partaken of flesh and blood, He Himself likewise shared in the same, that through death He might destroy him who had the power of death. He was tempted in all points as we are, yet without sin." },
      { day: "Friday", title: "Further Thought", date: "2026-01-23", scriptures: ["Phil. 2:5"], content: "How does having 'the mind of Christ' transform our relationships? Consider the practical implications of Christ's self-emptying for how we relate to one another in the church." },
    ],
  },
  {
    id: "05",
    num: 5,
    title: "Shining as Lights in the Night",
    startDate: "2026-01-24",
    endDate: "2026-01-30",
    memoryText:
      "Do all things without complaining and disputing, that you may become blameless and harmless, children of God without fault in the midst of a crooked and perverse generation, among whom you shine as lights in the world.",
    memoryRef: "Philippians 2:14, 15, NKJV",
    scriptures: [
      "Phil. 2:12-30",
      "Rom. 3:23, 24",
      "Rom. 5:8",
      "2 Tim. 4:6",
      "1 Cor. 4:17",
      "2 Tim. 4:21, 13",
      "Luke 7:2",
    ],
    sabbathIntro:
      "God told the Hebrews to obey because that obedience 'is your wisdom and your understanding in the sight of the peoples.' Centuries later Jesus said, 'I am the light of the world. He who follows Me shall not walk in darkness, but have the light of life' (John 8:12, NKJV). He has also said, 'You are the light of the world.'",
    days: [
      { day: "Sunday", title: "Work Out Your Salvation", date: "2026-01-25", scriptures: ["Phil. 2:12-13", "Rom. 3:23, 24"], content: "Work out your own salvation with fear and trembling; for it is God who works in you both to will and to do for His good pleasure. Salvation is God's work in us — we cooperate with divine power." },
      { day: "Monday", title: "Lights in the World", date: "2026-01-26", scriptures: ["Phil. 2:14-18", "Rom. 5:8"], content: "Do all things without complaining, that you may become blameless and harmless, children of God. Paul is being poured out as a drink offering on the sacrifice and service of their faith." },
      { day: "Tuesday", title: "Timothy: A Faithful Example", date: "2026-01-27", scriptures: ["Phil. 2:19-24", "1 Cor. 4:17"], content: "Paul commends Timothy, who has no one like-minded who will sincerely care for the Philippians' state. Timothy proved himself as a son with his father serving in the gospel." },
      { day: "Wednesday", title: "Epaphroditus: Nearly Died for Christ", date: "2026-01-28", scriptures: ["Phil. 2:25-30"], content: "Epaphroditus, Paul's brother, fellow worker, and fellow soldier, had been sick almost unto death, but God had mercy on him. He risked his life for the work of Christ, coming close to death to supply what was lacking in the Philippians' service to Paul." },
      { day: "Thursday", title: "Sacrificial Service", date: "2026-01-29", scriptures: ["2 Tim. 4:6", "Luke 7:2"], content: "Paul sees himself as being poured out as a drink offering. The concept of sacrificial service permeates the New Testament and calls every believer to a life given for others." },
      { day: "Friday", title: "Further Thought", date: "2026-01-30", scriptures: ["Phil. 2:15"], content: "How can we 'shine as lights' in our communities today? What does it mean to be blameless and harmless in a world that is often dark and hostile?" },
    ],
  },
  {
    id: "06",
    num: 6,
    title: "Confidence Only in Christ",
    startDate: "2026-01-31",
    endDate: "2026-02-06",
    memoryText:
      "That I may know Him and the power of His resurrection, and the fellowship of His sufferings, being conformed to His death, if, by any means, I may attain to the resurrection from the dead.",
    memoryRef: "Philippians 3:10, 11, NKJV",
    scriptures: [
      "Phil. 3:1-16",
      "Rom. 2:25-29",
      "John 9:1-39",
      "Eph. 1:4, 10",
      "1 Cor. 9:24-27",
    ],
    sabbathIntro:
      "There's something about us that remains suspicious about salvation by faith alone, apart from the works of the law. Paul deals with this point in a vigorous polemic against those who insist that circumcision is necessary for salvation. Paul counts all his religious credentials as loss for the excellence of the knowledge of Christ Jesus his Lord.",
    days: [
      { day: "Sunday", title: "Beware of the Dogs", date: "2026-02-01", scriptures: ["Phil. 3:1-3", "Rom. 2:25-29"], content: "Paul warns against those who would undermine the gospel — the mutilators of the flesh. True circumcision is of the heart, by the Spirit, not the letter." },
      { day: "Monday", title: "All Things Loss", date: "2026-02-02", scriptures: ["Phil. 3:4-8"], content: "Paul had every reason to boast in the flesh — circumcised the eighth day, of the tribe of Benjamin, a Hebrew of the Hebrews, a Pharisee. Yet he counts all these things as loss for the excellence of the knowledge of Christ." },
      { day: "Tuesday", title: "Knowing Christ", date: "2026-02-03", scriptures: ["Phil. 3:9-11", "John 9:1-39"], content: "Paul's supreme desire is to be found in Christ, not having his own righteousness from the law, but that which is through faith in Christ — the righteousness from God by faith. He wants to know Christ and the power of His resurrection." },
      { day: "Wednesday", title: "Pressing Toward the Goal", date: "2026-02-04", scriptures: ["Phil. 3:12-14", "1 Cor. 9:24-27"], content: "Paul has not yet attained, but he presses on. Forgetting those things which are behind and reaching forward, he presses toward the goal for the prize of the upward call of God in Christ Jesus." },
      { day: "Thursday", title: "Mature Thinking", date: "2026-02-05", scriptures: ["Phil. 3:15-16", "Eph. 1:4, 10"], content: "Let us, as many as are mature, have this mind. Paul calls believers to a mature perspective that recognizes both our present inadequacy and God's ultimate plan in Christ." },
      { day: "Friday", title: "Further Thought", date: "2026-02-06", scriptures: ["Phil. 3:10"], content: "What does it mean to know 'the fellowship of His sufferings'? How can sharing in Christ's sufferings actually become a source of joy and confidence?" },
    ],
  },
  {
    id: "07",
    num: 7,
    title: "A Heavenly Citizenship",
    startDate: "2026-02-07",
    endDate: "2026-02-13",
    memoryText:
      "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.",
    memoryRef: "Philippians 4:6, NKJV",
    scriptures: [
      "Phil. 3:17-4:23",
      "1 Cor. 15:42-44",
      "John 14:27",
      "Ps. 119:165",
      "Job 1:21",
      "1 Tim. 6:7",
    ],
    sabbathIntro:
      "This week's lesson concludes our study of Philippians, and it is packed with valuable lessons and maxims for daily living. The high moral values that guided Paul's life are found in the closing verses of the epistle. Similar to the teachings of Jesus, which focus on the inner person, what Paul shares with us are secrets to living a joyful Christian life.",
    days: [
      { day: "Sunday", title: "Citizens of Heaven", date: "2026-02-08", scriptures: ["Phil. 3:17-21", "1 Cor. 15:42-44"], content: "Our citizenship is in heaven, from which we eagerly wait for the Savior, the Lord Jesus Christ, who will transform our lowly body that it may be conformed to His glorious body." },
      { day: "Monday", title: "Rejoice Always", date: "2026-02-09", scriptures: ["Phil. 4:1-5"], content: "Rejoice in the Lord always. Again I will say, rejoice! Let your gentleness be known to all men. The Lord is at hand." },
      { day: "Tuesday", title: "The Peace of God", date: "2026-02-10", scriptures: ["Phil. 4:6-7", "John 14:27"], content: "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus." },
      { day: "Wednesday", title: "Think on These Things", date: "2026-02-11", scriptures: ["Phil. 4:8-9", "Ps. 119:165"], content: "Whatever things are true, noble, just, pure, lovely, of good report — if there is any virtue and if there is anything praiseworthy — meditate on these things. Great peace have those who love God's law." },
      { day: "Thursday", title: "Contentment in Christ", date: "2026-02-12", scriptures: ["Phil. 4:10-23", "Job 1:21", "1 Tim. 6:7"], content: "Paul has learned in whatever state he is to be content. He can do all things through Christ who strengthens him. We brought nothing into this world, and it is certain we can carry nothing out." },
      { day: "Friday", title: "Further Thought", date: "2026-02-13", scriptures: ["Phil. 4:6-7"], content: "How does the peace of God differ from the peace of the world? What practical steps can we take to move from anxiety to the peace that surpasses all understanding?" },
    ],
  },
  {
    id: "08",
    num: 8,
    title: "The Preeminence of Christ",
    startDate: "2026-02-14",
    endDate: "2026-02-20",
    memoryText:
      "He [Christ] is the image of the invisible God, the firstborn over all creation. For by Him all things were created that are in heaven and that are on earth, visible and invisible, whether thrones or dominions or principalities or powers. All things were created through Him and for Him. And He is before all things, and in Him all things consist.",
    memoryRef: "Colossians 1:15-17, NKJV",
    scriptures: [
      "Gen. 1:26, 27",
      "Col. 1:13-19",
      "John 1:1-3",
      "Eph. 1:22",
      "1 Cor. 12:12-27",
      "1 Cor. 4:9",
      "Rom. 6:3, 4",
    ],
    sabbathIntro:
      "With this week's lesson, we resume our consideration of Colossians. Paul prays for believers in Colossae, asking that they may live in a way pleasing to God. He contrasts two realms: that of light and of darkness, 'the kingdom of light' and 'the dominion of darkness.' God the Father has qualified us to share in the eternal inheritance of the realm of light.",
    days: [
      { day: "Sunday", title: "The Image of the Invisible God", date: "2026-02-15", scriptures: ["Col. 1:13-15", "Gen. 1:26, 27"], content: "Christ is the image of the invisible God, the firstborn over all creation. He has delivered us from the power of darkness and conveyed us into the kingdom of the Son of His love, in whom we have redemption through His blood." },
      { day: "Monday", title: "Creator of All Things", date: "2026-02-16", scriptures: ["Col. 1:16-17", "John 1:1-3"], content: "For by Him all things were created that are in heaven and that are on earth, visible and invisible. All things were created through Him and for Him. He is before all things, and in Him all things consist." },
      { day: "Tuesday", title: "Head of the Church", date: "2026-02-17", scriptures: ["Col. 1:18", "Eph. 1:22", "1 Cor. 12:12-27"], content: "Christ is the head of the body, the church, who is the beginning, the firstborn from the dead, that in all things He may have the preeminence." },
      { day: "Wednesday", title: "The Fullness of God", date: "2026-02-18", scriptures: ["Col. 1:19", "1 Cor. 4:9"], content: "For it pleased the Father that in Him all the fullness should dwell. The incredible truth that the fullness of the Godhead dwelt in Christ is central to understanding who Jesus really is." },
      { day: "Thursday", title: "Baptized Into Christ", date: "2026-02-19", scriptures: ["Rom. 6:3, 4", "Col. 1:13"], content: "We were buried with Him through baptism into death, that just as Christ was raised from the dead by the glory of the Father, even so we also should walk in newness of life." },
      { day: "Friday", title: "Further Thought", date: "2026-02-20", scriptures: ["Col. 1:15-17"], content: "How does the preeminence of Christ over all creation inform our understanding of His authority in our lives? What implications does this have for our priorities?" },
    ],
  },
  {
    id: "09",
    num: 9,
    title: "Reconciliation and Hope",
    startDate: "2026-02-21",
    endDate: "2026-02-27",
    memoryText:
      "For he hath made him to be sin for us, who knew no sin; that we might be made the righteousness of God in him.",
    memoryRef: "2 Corinthians 5:21",
    scriptures: [
      "Col. 1:20-29",
      "Eph. 5:27",
      "Eph. 3:17",
      "Rom. 8:18",
      "Eph. 1:7-10",
      "Eph. 3:3-6",
      "Prov. 14:12",
    ],
    sabbathIntro:
      "What is this mystery, and what all does it envision — for the individual and for the universe? How does this 'mystery' relate to the gospel that Paul has so passionately proclaimed?",
    days: [
      { day: "Sunday", title: "Peace Through His Blood", date: "2026-02-22", scriptures: ["Col. 1:20-22", "Eph. 1:7-10"], content: "Having made peace through the blood of His cross, by Him to reconcile all things to Himself. You, who once were alienated and enemies in your mind by wicked works, yet now He has reconciled." },
      { day: "Monday", title: "The Hope of the Gospel", date: "2026-02-23", scriptures: ["Col. 1:23", "Rom. 8:18"], content: "Continue in the faith, grounded and steadfast, and are not moved away from the hope of the gospel which you heard, which was preached to every creature under heaven." },
      { day: "Tuesday", title: "Suffering for the Church", date: "2026-02-24", scriptures: ["Col. 1:24-25"], content: "Paul rejoices in his sufferings for the sake of the Colossians and fills up in his flesh what is lacking in the afflictions of Christ, for the sake of His body, which is the church." },
      { day: "Wednesday", title: "The Mystery Revealed", date: "2026-02-25", scriptures: ["Col. 1:26-27", "Eph. 3:3-6"], content: "The mystery which has been hidden from ages and from generations, but now has been revealed to His saints: 'Christ in you, the hope of glory.'" },
      { day: "Thursday", title: "Complete in Christ", date: "2026-02-26", scriptures: ["Col. 1:28-29", "Eph. 5:27"], content: "Him we preach, warning every man and teaching every man in all wisdom, that we may present every man perfect in Christ Jesus. Paul labors striving according to His working which works in him mightily." },
      { day: "Friday", title: "Further Thought", date: "2026-02-27", scriptures: ["Col. 1:27"], content: "What does 'Christ in you, the hope of glory' mean practically? How does the indwelling Christ transform our daily experience and our eternal hope?" },
    ],
  },
  {
    id: "10",
    num: 10,
    title: "Complete in Christ",
    startDate: "2026-02-28",
    endDate: "2026-03-06",
    memoryText:
      "So let no one judge you in food or in drink, or regarding a festival or a new moon or sabbaths, which are a shadow of things to come, but the substance is of Christ.",
    memoryRef: "Colossians 2:16, 17, NKJV",
    scriptures: [
      "Colossians 2",
      "Heb. 7:11",
      "Isa. 61:3",
      "1 Cor. 3:6",
      "Deut. 31:24-26",
      "Rom. 2:28, 29",
      "Rom. 7:7",
    ],
    sabbathIntro:
      "Have you ever been asked why you keep the Sabbath? Perhaps even this week's memory text was used as 'evidence' against it. Yet, the text was written not about the fourth commandment, but in response to errors taught by some false teachers in the church. These errors involved 'philosophy,' 'the tradition of men,' 'the basic principles of the world,' and were 'not according to Christ.' The 'sabbaths' here refer to the ceremonial sabbaths — shadows pointing forward to Christ.",
    days: [
      { day: "Sunday", title: "Rooted in Christ", date: "2026-03-01", scriptures: ["Col. 2:1-7", "1 Cor. 3:6"], content: "As you received Christ Jesus the Lord, so walk in Him, rooted and built up in Him and established in the faith. Being rooted means having deep foundations that sustain growth." },
      { day: "Monday", title: "Beware of Philosophy", date: "2026-03-02", scriptures: ["Col. 2:8-10"], content: "Beware lest anyone cheat you through philosophy and empty deceit, according to the tradition of men, according to the basic principles of the world, and not according to Christ. For in Him dwells all the fullness of the Godhead bodily; and you are complete in Him." },
      { day: "Tuesday", title: "Circumcision of Christ", date: "2026-03-03", scriptures: ["Col. 2:11-13", "Rom. 2:28, 29"], content: "In Christ you were circumcised with the circumcision made without hands, by putting off the body of the sins of the flesh, by the circumcision of Christ, buried with Him in baptism." },
      { day: "Wednesday", title: "The Handwriting Nailed to the Cross", date: "2026-03-04", scriptures: ["Col. 2:14-15", "Deut. 31:24-26"], content: "Having wiped out the handwriting of requirements that was against us, He has taken it out of the way, having nailed it to the cross. The ceremonial law's requirements were fulfilled in Christ." },
      { day: "Thursday", title: "Shadows and Substance", date: "2026-03-05", scriptures: ["Col. 2:16-23", "Heb. 7:11", "Rom. 7:7"], content: "Let no one judge you in food or in drink, or regarding a festival or a new moon or sabbaths, which are a shadow of things to come, but the substance is of Christ. The ceremonial sabbaths (not the weekly Sabbath) pointed forward to Christ's work." },
      { day: "Friday", title: "Further Thought", date: "2026-03-06", scriptures: ["Col. 2:16-17"], content: "How do we distinguish between the ceremonial 'sabbaths' in Colossians 2:16 and the weekly Sabbath of the fourth commandment? Why is this distinction crucial for Adventist theology?" },
    ],
  },
  {
    id: "11",
    num: 11,
    title: "Living With Christ",
    startDate: "2026-03-07",
    endDate: "2026-03-13",
    memoryText:
      "But above all these things put on love, which is the bond of perfection.",
    memoryRef: "Colossians 3:14, NKJV",
    scriptures: [
      "Col. 3:1-17",
      "Rom. 1:18",
      "Rom. 6:1-7",
      "Eph. 4:22-24",
      "Deut. 7:6-8",
      "1 Sam. 16:23",
    ],
    sabbathIntro:
      "It's commonly urged not to be so heavenly-minded; otherwise, we'll be of no earthly good. But there's an equally important concept: if we are too earthly-minded, we will be of no heavenly use to the Lord. Paul draws our attention to practical, real-life principles that are born of heaven and can be understood only by those who are 'risen with Christ.'",
    days: [
      { day: "Sunday", title: "Seek Things Above", date: "2026-03-08", scriptures: ["Col. 3:1-4", "Rom. 6:1-7"], content: "If then you were raised with Christ, seek those things which are above, where Christ is, sitting at the right hand of God. Set your mind on things above, not on things on the earth." },
      { day: "Monday", title: "Put Off the Old Man", date: "2026-03-09", scriptures: ["Col. 3:5-9", "Rom. 1:18"], content: "Put to death your members which are on the earth: fornication, uncleanness, passion, evil desire, and covetousness. Put off the old man with his deeds." },
      { day: "Tuesday", title: "Put On the New Man", date: "2026-03-10", scriptures: ["Col. 3:10-11", "Eph. 4:22-24"], content: "Put on the new man who is renewed in knowledge according to the image of Him who created him, where there is neither Greek nor Jew, circumcised nor uncircumcised, but Christ is all and in all." },
      { day: "Wednesday", title: "The Elect of God", date: "2026-03-11", scriptures: ["Col. 3:12-13", "Deut. 7:6-8"], content: "As the elect of God, holy and beloved, put on tender mercies, kindness, humility, meekness, longsuffering; bearing with one another, and forgiving one another." },
      { day: "Thursday", title: "Love, Word, and Worship", date: "2026-03-12", scriptures: ["Col. 3:14-17", "1 Sam. 16:23"], content: "Above all these things put on love. Let the word of Christ dwell in you richly. Whatever you do in word or deed, do all in the name of the Lord Jesus, giving thanks to God the Father through Him." },
      { day: "Friday", title: "Further Thought", date: "2026-03-13", scriptures: ["Col. 3:14"], content: "Why is love 'the bond of perfection'? How does putting on love tie together all the other virtues Paul lists? What does this look like in daily church life?" },
    ],
  },
  {
    id: "12",
    num: 12,
    title: "Living With Each Other",
    startDate: "2026-03-14",
    endDate: "2026-03-20",
    memoryText:
      "Let your speech always be with grace, seasoned with salt, that you may know how you ought to answer each one.",
    memoryRef: "Colossians 4:6, NKJV",
    scriptures: [
      "Col. 3:18-4:6",
      "Eph. 5:22-25, 33",
      "Prov. 22:6, 15",
      "1 Pet. 2:16",
      "1 Thess. 5:17",
    ],
    sabbathIntro:
      "When people live and work in close proximity, they meet a variety of challenges. Differences of opinion may cause tensions; arguments may ensue. The closest relationships are within the family. The home has sometimes been called 'the family firm.' Paul provides practical guidance for living with each other in love.",
    days: [
      { day: "Sunday", title: "Wives and Husbands", date: "2026-03-15", scriptures: ["Col. 3:18-19", "Eph. 5:22-25, 33"], content: "Wives, submit to your own husbands, as is fitting in the Lord. Husbands, love your wives and do not be bitter toward them. This is a reciprocal relationship rooted in mutual love and respect." },
      { day: "Monday", title: "Children and Parents", date: "2026-03-16", scriptures: ["Col. 3:20-21", "Prov. 22:6, 15"], content: "Children, obey your parents in all things, for this is well pleasing to the Lord. Fathers, do not provoke your children, lest they become discouraged. Train up a child in the way he should go." },
      { day: "Tuesday", title: "Bondservants and Masters", date: "2026-03-17", scriptures: ["Col. 3:22-4:1", "1 Pet. 2:16"], content: "Bondservants, obey your masters, not with eyeservice, as men-pleasers, but in sincerity of heart, fearing God. Masters, give your servants what is just and fair, knowing that you also have a Master in heaven." },
      { day: "Wednesday", title: "Devoted to Prayer", date: "2026-03-18", scriptures: ["Col. 4:2-4", "1 Thess. 5:17"], content: "Continue earnestly in prayer, being vigilant in it with thanksgiving; meanwhile praying also for us, that God would open to us a door for the word, to speak the mystery of Christ." },
      { day: "Thursday", title: "Walking in Wisdom", date: "2026-03-19", scriptures: ["Col. 4:5-6"], content: "Walk in wisdom toward those who are outside, redeeming the time. Let your speech always be with grace, seasoned with salt, that you may know how you ought to answer each one." },
      { day: "Friday", title: "Further Thought", date: "2026-03-20", scriptures: ["Col. 4:6"], content: "How do we let our speech be 'seasoned with salt'? What role does grace play in our everyday conversations, especially with those who don't share our faith?" },
    ],
  },
  {
    id: "13",
    num: 13,
    title: "Standing in All the Will of God",
    startDate: "2026-03-21",
    endDate: "2026-03-27",
    memoryText:
      "Epaphras, who is one of you, a bondservant of Christ, greets you, always laboring fervently for you in prayers, that you may stand perfect and complete in all the will of God.",
    memoryRef: "Colossians 4:12, NKJV",
    scriptures: [
      "Col. 4:7-18",
      "2 Tim. 4:11",
      "Philem. 24",
      "Acts 15:36-41",
      "Col. 4:12",
      "James 5:16",
    ],
    sabbathIntro:
      "Paul concludes his letter to the Colossians with greetings from and about his coworkers. These final verses reveal the network of believers who supported Paul's ministry and carried the gospel forward. Epaphras, in particular, labors fervently in prayer that the Colossians may stand perfect and complete in all the will of God.",
    days: [
      { day: "Sunday", title: "Tychicus and Onesimus", date: "2026-03-22", scriptures: ["Col. 4:7-9", "2 Tim. 4:11"], content: "Tychicus, a beloved brother, faithful minister, and fellow servant in the Lord, will tell you all the news about Paul. With him Onesimus, a faithful and beloved brother, who is one of you." },
      { day: "Monday", title: "Greetings From Fellow Workers", date: "2026-03-23", scriptures: ["Col. 4:10-11", "Acts 15:36-41"], content: "Aristarchus, Mark, and Jesus called Justus send greetings. These are Paul's only fellow workers for the kingdom of God who are of the circumcision — they have been a comfort to him." },
      { day: "Tuesday", title: "Epaphras: A Prayer Warrior", date: "2026-03-24", scriptures: ["Col. 4:12-13", "James 5:16"], content: "Epaphras, always laboring fervently in prayers, that the Colossians may stand perfect and complete in all the will of God. He has great zeal for them, for those in Laodicea, and those in Hierapolis." },
      { day: "Wednesday", title: "Luke and Demas", date: "2026-03-25", scriptures: ["Col. 4:14", "2 Tim. 4:11", "Philem. 24"], content: "Luke the beloved physician and Demas greet you. Luke faithfully stood by Paul to the end. Sadly, Demas later forsook Paul, having loved this present world. A sobering contrast." },
      { day: "Thursday", title: "Final Instructions", date: "2026-03-26", scriptures: ["Col. 4:15-18"], content: "Greet the brethren who are in Laodicea and Nymphas and the church in her house. When this epistle is read among you, see that it is read also in the church of the Laodiceans. Remember Paul's chains." },
      { day: "Friday", title: "Further Thought", date: "2026-03-27", scriptures: ["Col. 4:12"], content: "What can we learn from Epaphras about intercessory prayer? How does his example challenge our prayer life? What does it mean to 'stand perfect and complete in all the will of God'?" },
    ],
  },
];
