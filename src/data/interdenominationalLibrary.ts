// 3AM Inter-denominational Library — Doctrine Topics, Claims & Witnesses
// Full Library v2: Expanded with 20 topics, ~50 claims, ~120+ witnesses
// sourced from confessional, creedal, scholarly, and academic non-SDA materials.

export interface LibraryWitness {
  id: string;
  author: string;
  tradition: string;
  workTitle: string;
  year: string;
  locator: string;
  quoteExcerpt: string;
  primarySourceUrl: string;
  contextNotes: string;
  agreementScope: string;
  credibilityGrade: "A" | "B" | "C" | "D";
}

export interface LibraryClaim {
  id: string;
  title: string;
  order: number;
  claimSummary: string;
  bibleAnchors: string[];
  witnesses: LibraryWitness[];
}

export interface DoctrineTopic {
  id: string;
  name: string;
  order: number;
  summary: string;
  tags: string[];
  claims: LibraryClaim[];
}

export const DOCTRINE_TOPICS: DoctrineTopic[] = [
  // ═══════════════════════════════════════════════════════════════════
  // 1. SCRIPTURE (Sola Scriptura / Sufficiency)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "scripture",
    name: "Scripture (Sola Scriptura / Sufficiency)",
    order: 1,
    summary:
      "Non-Adventist confessional sources affirm Scripture as the rule of faith and life and deny adding new revelations/traditions as binding authority.",
    tags: ["Evidence", "DoctrineLibrary", "Scripture"],
    claims: [
      {
        id: "scr-1",
        title: "Scripture is the rule of faith and life",
        order: 1,
        claimSummary:
          "Classic confessions explicitly present Scripture as the binding rule for belief and obedience.",
        bibleAnchors: ["2 Timothy 3:16-17", "Isaiah 8:20"],
        witnesses: [
          {
            id: "scr-1-wcf-12",
            author: "Westminster Assembly",
            tradition: "Reformed",
            workTitle: "Westminster Confession of Faith, Chapter 1.2",
            year: "1646",
            locator: "WCF 1.2",
            quoteExcerpt:
              "\u201CAll which are given by inspiration of God, to be the rule of faith and life.\u201D",
            primarySourceUrl:
              "https://www.apuritansmind.com/westminster-standards/chapter-1/",
            contextNotes:
              "Confessional claim defining Scripture\u2019s authority as the church\u2019s rule.",
            agreementScope:
              "Affirms Scripture\u2019s rule; does not settle SDA distinctives by itself.",
            credibilityGrade: "A",
          },
          {
            id: "scr-1-39art-vi",
            author: "Church of England",
            tradition: "Anglican",
            workTitle: "Thirty-Nine Articles of Religion, Article VI",
            year: "1563",
            locator: "Article VI",
            quoteExcerpt:
              "\u201CHoly Scripture containeth all things necessary to salvation: so that whatsoever is not read therein, nor may be proved thereby, is not to be required of any man.\u201D",
            primarySourceUrl:
              "https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/book-common-prayer/articles-religion",
            contextNotes:
              "Anglican confessional anchor for sola Scriptura; widely received across Anglican communion.",
            agreementScope:
              "Affirms sufficiency of Scripture; Anglican practice may diverge on specifics.",
            credibilityGrade: "A",
          },
          {
            id: "scr-1-lbcf-11",
            author: "Second London Baptist Confession",
            tradition: "Baptist (Reformed)",
            workTitle:
              "Second London Baptist Confession of Faith, Chapter 1.1",
            year: "1689",
            locator: "LBCF 1.1",
            quoteExcerpt:
              "\u201CThe Holy Scripture is the only sufficient, certain, and infallible rule of all saving knowledge, faith, and obedience.\u201D",
            primarySourceUrl:
              "https://www.arbca.com/1689-confession",
            contextNotes:
              "Baptist appropriation of Reformed sola Scriptura; mirrors Westminster language closely.",
            agreementScope:
              "Affirms Scripture\u2019s sufficiency; Baptist tradition shares SDA emphasis on Bible authority.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "scr-2",
        title: "Nothing is to be added to Scripture as binding authority",
        order: 2,
        claimSummary:
          "Sufficiency language rejects adding later revelations or traditions as binding alongside Scripture.",
        bibleAnchors: ["Deuteronomy 4:2", "Revelation 22:18-19"],
        witnesses: [
          {
            id: "scr-2-wcf-16",
            author: "Westminster Assembly",
            tradition: "Reformed",
            workTitle: "Westminster Confession of Faith, Chapter 1.6",
            year: "1646",
            locator: "WCF 1.6",
            quoteExcerpt:
              "\u201CUnto which nothing at any time is to be added\u2026 by new revelations\u2026 or traditions of men.\u201D",
            primarySourceUrl:
              "https://www.monergism.com/sufficiency-scripture-wcf-16",
            contextNotes:
              "High-value safeguard for your library: it forces doctrine to be argued from Scripture, not ecclesial fiat.",
            agreementScope:
              "Affirms sufficiency; doesn\u2019t address SDA time-prophecy applications.",
            credibilityGrade: "A",
          },
          {
            id: "scr-2-chicago",
            author: "International Council on Biblical Inerrancy",
            tradition: "Evangelical (broad coalition)",
            workTitle: "Chicago Statement on Biblical Inerrancy",
            year: "1978",
            locator: "Article II & Article V",
            quoteExcerpt:
              "\u201CWe affirm that the Scriptures are the supreme written norm by which God binds the conscience\u2026 We deny that Church creeds, councils, or declarations have authority greater than or equal to the authority of the Bible.\u201D",
            primarySourceUrl:
              "https://www.etsjets.org/files/documents/Chicago_Statement.pdf",
            contextNotes:
              "Signed by nearly 300 evangelical scholars (Sproul, Packer, Boice, etc.). Major 20th-century reaffirmation of sola Scriptura.",
            agreementScope:
              "Affirms Scripture\u2019s supremacy over tradition; does not address SDA-specific doctrines.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2. TRINITY / FULL DEITY OF CHRIST
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "trinity",
    name: "Trinity / Full Deity of Christ",
    order: 2,
    summary:
      "Non-Adventist creedal Christianity explicitly affirms Christ\u2019s full deity and the Spirit\u2019s personhood/role.",
    tags: ["Evidence", "DoctrineLibrary", "Trinity"],
    claims: [
      {
        id: "tri-1",
        title:
          "Christ is true God (not created), one in being with the Father",
        order: 1,
        claimSummary:
          "Nicene language explicitly denies Christ as a created being and affirms full deity.",
        bibleAnchors: [
          "John 1:1-3",
          "Colossians 1:16-17",
          "Hebrews 1:8-12",
        ],
        witnesses: [
          {
            id: "tri-1-nicene",
            author: "Ecumenical Council (Nicene Creed)",
            tradition: "Catholic / Orthodox / Protestant (creedal)",
            workTitle: "Nicene Creed (standard text)",
            year: "325/381",
            locator: "Christology lines",
            quoteExcerpt:
              "\u201CTrue God from true God\u2026 begotten not made\u2026 one in being with the Father.\u201D",
            primarySourceUrl:
              "https://www.marquette.edu/faith/prayers-nicene.php",
            contextNotes:
              "Widely received creedal baseline across major Christian traditions.",
            agreementScope:
              "Affirms SDA orthodox Trinitarian Christology; not about SDA prophecy.",
            credibilityGrade: "A",
          },
          {
            id: "tri-1-athanasian",
            author: "Athanasian Creed",
            tradition: "Catholic / Protestant (Western creedal)",
            workTitle: "Athanasian Creed (Quicunque Vult)",
            year: "c. 500",
            locator: "Lines on co-equality",
            quoteExcerpt:
              "\u201CThe Father is God, the Son is God, the Holy Spirit is God. And yet there are not three gods, but one God.\u201D",
            primarySourceUrl:
              "https://www.ccel.org/creeds/athanasian.creed.html",
            contextNotes:
              "Most explicit ancient creedal formula on Trinitarian co-equality; used in Western liturgy for centuries.",
            agreementScope:
              "Affirms SDA Trinitarianism; creed\u2019s anathemas reflect its historical context.",
            credibilityGrade: "A",
          },
          {
            id: "tri-1-chalcedon",
            author: "Council of Chalcedon",
            tradition: "Catholic / Orthodox / Protestant (creedal)",
            workTitle: "Chalcedonian Definition",
            year: "451",
            locator: "Christological definition",
            quoteExcerpt:
              "\u201CTruly God and truly man\u2026 acknowledged in two natures, without confusion, without change, without division, without separation.\u201D",
            primarySourceUrl:
              "https://www.ccel.org/ccel/schaff/creeds2.iv.i.i.html",
            contextNotes:
              "Definitive statement on Christ\u2019s two natures; received by Catholic, Orthodox, and Protestant traditions.",
            agreementScope:
              "Affirms SDA Christological orthodoxy; not about SDA-specific doctrines.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "tri-2",
        title:
          "The Holy Spirit is a distinct divine person, not merely a force",
        order: 2,
        claimSummary:
          "Confessional and catechetical sources explicitly affirm the Spirit\u2019s personhood and deity.",
        bibleAnchors: [
          "Acts 5:3-4",
          "John 14:16-17",
          "2 Corinthians 13:14",
        ],
        witnesses: [
          {
            id: "tri-2-wsc-q6",
            author: "Westminster Shorter Catechism",
            tradition: "Reformed",
            workTitle: "Westminster Shorter Catechism, Q&A 6",
            year: "1647",
            locator: "Q6",
            quoteExcerpt:
              "\u201CThere are three persons in the Godhead; the Father, the Son, and the Holy Ghost; and these three are one God, the same in substance, equal in power and glory.\u201D",
            primarySourceUrl:
              "https://www.apuritansmind.com/westminster-standards/shorter-catechism/",
            contextNotes:
              "Catechetical format makes it accessible; widely memorized across Reformed churches.",
            agreementScope:
              "Directly supports SDA Trinitarian teaching (Fundamental Belief #2).",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3. SECOND COMING (Literal, Visible) + Final Judgment
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "second_coming",
    name: "Second Coming (Literal, Visible) + Final Judgment",
    order: 3,
    summary:
      "Non-Adventist creeds confess Christ\u2019s future return and judgment\u2014useful for common-ground with seekers.",
    tags: ["Evidence", "DoctrineLibrary", "SecondComing"],
    claims: [
      {
        id: "sc-1",
        title:
          "Christ will come again to judge the living and the dead",
        order: 1,
        claimSummary:
          "Mainstream Christianity confesses a future return and judgment.",
        bibleAnchors: ["Acts 1:11", "Matthew 24:30", "2 Timothy 4:1"],
        witnesses: [
          {
            id: "sc-1-apostles",
            author: "Ancient Creed (Apostles\u2019 Creed text)",
            tradition: "Catholic / Orthodox / Protestant (creedal)",
            workTitle: "Apostles\u2019 Creed",
            year: "ancient (text stabilized later)",
            locator: "Judgment clause",
            quoteExcerpt:
              "\u201CFrom there he will come to judge the living and the dead.\u201D",
            primarySourceUrl:
              "https://www.usccb.org/prayers/apostles-creed",
            contextNotes:
              "Strong ecumenical \u201Cfloor doctrine\u201D supporting literal eschatology and accountability.",
            agreementScope:
              "Affirms return/judgment; SDA adds sanctuary/time-prophecy specifics.",
            credibilityGrade: "A",
          },
          {
            id: "sc-1-nicene",
            author: "Ecumenical Council (Nicene Creed)",
            tradition: "Catholic / Orthodox / Protestant (creedal)",
            workTitle: "Nicene Creed",
            year: "325/381",
            locator: "Eschatology clause",
            quoteExcerpt:
              "\u201CHe will come again in glory to judge the living and the dead\u2026\u201D",
            primarySourceUrl:
              "https://www.usccb.org/prayers/nicene-creed",
            contextNotes:
              "Pairs well with your SDA emphasis on a real, future, public return.",
            agreementScope:
              "Common ground; not SDA chronology.",
            credibilityGrade: "A",
          },
          {
            id: "sc-1-augsburg-17",
            author: "Philip Melanchthon",
            tradition: "Lutheran (confessional)",
            workTitle: "Augsburg Confession, Article XVII",
            year: "1530",
            locator: "Article XVII: Of Christ\u2019s Return to Judgment",
            quoteExcerpt:
              "\u201CChrist will appear at the consummation of the world to judge, and will raise up all the dead\u2026 to the godly He will give everlasting life.\u201D",
            primarySourceUrl:
              "https://thebookofconcord.org/augsburg-confession/article-xvii/",
            contextNotes:
              "Lutheran confessional statement explicitly affirming literal future return and bodily resurrection.",
            agreementScope:
              "Affirms literal return and resurrection; does not detail SDA prophetic timeline.",
            credibilityGrade: "A",
          },
          {
            id: "sc-1-helvetic-11",
            author: "Heinrich Bullinger",
            tradition: "Reformed (Swiss)",
            workTitle: "Second Helvetic Confession, Chapter XI",
            year: "1566",
            locator: "Chapter XI",
            quoteExcerpt:
              "\u201CWe believe that the same Lord Jesus Christ will come from heaven to judge, when the last trumpet shall sound.\u201D",
            primarySourceUrl:
              "https://www.ccel.org/creeds/helvetic.htm",
            contextNotes:
              "Major Swiss Reformed confession; directly relevant to SDA common-ground on literal return.",
            agreementScope:
              "Affirms literal, visible return; Swiss Reformed do not share SDA prophetic specifics.",
            credibilityGrade: "A",
          },
          {
            id: "sc-1-spurgeon-return",
            author: "Charles H. Spurgeon",
            tradition: "Baptist (Reformed)",
            workTitle: "Metropolitan Tabernacle Pulpit, sermon \u2018He Cometh with Clouds\u2019",
            year: "1886",
            locator: "Sermon No. 1889",
            quoteExcerpt:
              "\u201CJesus is coming. He is even now on the way\u2026 It is not merely that he will come, but that he is coming\u2026 I believe in the premillennial advent of Christ, the personal, the literal, the bodily coming of Christ before the millennium. I cannot read my Bible without perceiving that there will be a great personal appearing of Christ.\u201D",
            primarySourceUrl:
              "https://archive.org/details/metropolitantabe32spur",
            contextNotes:
              "Spurgeon, the \u2018Prince of Preachers,\u2019 was emphatic about a literal, personal, bodily, premillennial return of Christ. This aligns with SDA teaching on the Second Coming.",
            agreementScope:
              "Directly supports SDA belief in literal, personal, visible return. Spurgeon\u2019s premillennial view differs from SDA on millennium details.",
            credibilityGrade: "A",
          },
          {
            id: "sc-1-moody-return",
            author: "D.L. Moody",
            tradition: "Evangelical (non-denominational)",
            workTitle: "The Second Coming of Christ",
            year: "1877",
            locator: "Opening pages",
            quoteExcerpt:
              "\u201CThe return of our Lord is mentioned 1,518 times in the Old and New Testaments\u2026 For every one prophecy concerning Christ\u2019s first coming, there are eight concerning the second\u2026 I can never lay my head on my pillow without thinking that perhaps before I awake the final morning may have dawned.\u201D",
            primarySourceUrl:
              "https://archive.org/details/secondcomingofch00mood",
            contextNotes:
              "Moody was deeply passionate about the Second Coming. His statistical observation (1,518 references, 8-to-1 ratio) demonstrates how central the doctrine is to Scripture.",
            agreementScope:
              "Supports SDA emphasis on the centrality and imminence of Christ\u2019s return.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4. LAW OF GOD (Decalogue Perpetuity)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "law",
    name: "Law of God (Decalogue Perpetuity)",
    order: 4,
    summary:
      "Non-Adventist confessions/catechisms explicitly affirm the moral law\u2019s enduring authority and use the Decalogue for Christian instruction.",
    tags: ["Evidence", "DoctrineLibrary", "Law"],
    claims: [
      {
        id: "law-1",
        title:
          "The moral law binds believers; Christ does not dissolve it",
        order: 1,
        claimSummary:
          "Explicit confessional statement of perpetuity + strengthened obligation under the gospel.",
        bibleAnchors: [
          "Matthew 5:17-19",
          "Romans 3:31",
          "James 2:10-11",
        ],
        witnesses: [
          {
            id: "law-1-wcf-195",
            author: "Westminster Assembly",
            tradition: "Reformed",
            workTitle:
              "Westminster Confession of Faith, Chapter 19.5",
            year: "1646",
            locator: "WCF 19.5",
            quoteExcerpt:
              "\u201CThe moral law doth for ever bind all\u2026 Neither doth Christ\u2026 dissolve, but much strengthen\u2026\u201D",
            primarySourceUrl:
              "https://heidelblog.net/2013/08/the-moral-law-doth-forever-bind-all/",
            contextNotes:
              "This page reproduces WCF 19.5 verbatim; keep a second mirror if desired.",
            agreementScope:
              "Affirms Decalogue continuity; not SDA prophecy system.",
            credibilityGrade: "A",
          },
          {
            id: "law-1-lbcf-195",
            author: "Second London Baptist Confession",
            tradition: "Baptist (Reformed)",
            workTitle:
              "Second London Baptist Confession, Chapter 19.5",
            year: "1689",
            locator: "LBCF 19.5",
            quoteExcerpt:
              "\u201CThe moral law doth for ever bind all, as well justified persons as others, to the obedience thereof.\u201D",
            primarySourceUrl:
              "https://www.arbca.com/1689-confession",
            contextNotes:
              "Baptist mirror of WCF language; demonstrates cross-denominational agreement on moral law perpetuity.",
            agreementScope:
              "Affirms perpetuity of the moral law; Baptist application may differ on Sabbath specifics.",
            credibilityGrade: "A",
          },
          {
            id: "law-1-calvin-inst",
            author: "John Calvin",
            tradition: "Reformed",
            workTitle:
              "Institutes of the Christian Religion, Book 2, Chapter 7.12\u201313",
            year: "1559",
            locator: "2.7.12\u201313 (Third Use of the Law)",
            quoteExcerpt:
              "\u201CThe third use of the Law\u2026 is the principal use\u2026 among believers in whose hearts the Spirit of God already flourishes and reigns\u2026 it is the best instrument for enabling them daily to learn.\u201D",
            primarySourceUrl:
              "https://www.ccel.org/ccel/calvin/institutes.iv.viii.html",
            contextNotes:
              "Calvin\u2019s \u201Cthird use\u201D explicitly keeps the Decalogue as a guide for Christian living, not abrogated.",
            agreementScope:
              "Affirms the law as ongoing guide; Calvin\u2019s Sabbath application differs from SDA.",
            credibilityGrade: "A",
          },
          {
            id: "law-1-calvin-matt517",
            author: "John Calvin",
            tradition: "Reformed",
            workTitle:
              "Commentary on a Harmony of the Evangelists, Vol. 1, trans. by William Pringle",
            year: "1555 (1949 Eerdmans ed.)",
            locator: "p. 277, comment on Matt. 5:17",
            quoteExcerpt:
              "\u201CWe must not imagine that the coming of Christ has freed us from the authority of the law: for it is the eternal rule of a devout and holy life, and must, therefore, be as unchangeable, as the justice of God, which it embraced, is constant and uniform.\u201D",
            primarySourceUrl:
              "https://www.ccel.org/ccel/calvin/calcom31.ix.xxvii.html",
            contextNotes:
              "Calvin commenting directly on Christ\u2019s words in Matthew 5:17 (\u2018I have not come to abolish the Law\u2019). Calvin explicitly calls the law \u2018unchangeable.\u2019",
            agreementScope:
              "Directly affirms the law\u2019s unchangeable nature; Calvin\u2019s broader system treats the Sabbath command differently than SDA.",
            credibilityGrade: "A",
          },
          {
            id: "law-1-spurgeon-gospel",
            author: "Charles H. Spurgeon",
            tradition: "Baptist (Reformed)",
            workTitle: "The Gospel of the Kingdom",
            year: "1893",
            locator: "Comment on Matt. 5:17\u201320, pp. 47\u201348",
            quoteExcerpt:
              "\u201CHe (Christ) took care to revise and reform the laws of men; but the law of God he established and confirmed\u2026 Our King has not come to abrogate the law, but to confirm and reassert it. His commands are eternal; and if any of the teachers of it should through error break his law, and teach that its least command is nullified, they will lose rank, and subside into the lowest place. The peerage of his kingdom is ordered according to obedience\u2026 The Lord Jesus does not set up a milder law, nor will he allow any one of his servants to presume to do so.\u201D",
            primarySourceUrl:
              "https://archive.org/details/gospelofkingdom00spur",
            contextNotes:
              "Spurgeon (1834\u20131892), the \u2018Prince of Preachers,\u2019 was the most famous Baptist preacher of the Victorian era. This is his commentary on the Sermon on the Mount \u2014 emphatic and unmistakable.",
            agreementScope:
              "Strongly affirms the law\u2019s perpetuity and Christ\u2019s confirmation of it; Spurgeon\u2019s Baptist tradition does not observe the seventh-day Sabbath.",
            credibilityGrade: "A",
          },
          {
            id: "law-1-morgan-p23",
            author: "G. Campbell Morgan",
            tradition: "Congregationalist",
            workTitle: "The Ten Commandments",
            year: "1901",
            locator: "p. 23",
            quoteExcerpt:
              "\u201CThere is a sense in which Christians are not \u2018free from the law.\u2019 It is only when grace enables men to keep the law, that they are free from it; just as a moral man who lives according to the laws of the country is free from arrest. God has not set aside law, but he has found a way by which man can fulfil law, and so be free from it.\u201D",
            primarySourceUrl:
              "https://archive.org/details/tencommandments00morg",
            contextNotes:
              "G. Campbell Morgan (1863\u20131945) was one of the most prominent Bible expositors of the early 20th century, pastor of Westminster Chapel in London. His analogy of the moral citizen being \u2018free from arrest\u2019 is a powerful illustration.",
            agreementScope:
              "Affirms Christians are not free from the moral law; Morgan does not advocate seventh-day Sabbath observance.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "law-2",
        title:
          "The Decalogue is used as catechetical \u2018God\u2019s law\u2019",
        order: 2,
        claimSummary:
          "Reformed catechesis prints the Ten Commandments in full as God\u2019s law.",
        bibleAnchors: ["Exodus 20", "Deuteronomy 5"],
        witnesses: [
          {
            id: "law-2-heidelberg-ld34",
            author: "Heidelberg Catechism",
            tradition: "Reformed",
            workTitle:
              "Heidelberg Catechism, Lord\u2019s Day 34",
            year: "1563",
            locator: "LD34 Q/A 92",
            quoteExcerpt:
              "\u201CWhat is the law of the LORD? God spoke all these words\u2026\u201D",
            primarySourceUrl:
              "https://www.heidelberg-catechism.com/en/lords-days/34.html",
            contextNotes:
              "A direct non-SDA anchor for Decalogue authority in mainstream Protestant tradition.",
            agreementScope:
              "Affirms Decalogue authority; traditions diverge on Sabbath practice.",
            credibilityGrade: "A",
          },
          {
            id: "law-2-luther-catechism",
            author: "Martin Luther",
            tradition: "Lutheran",
            workTitle: "Luther\u2019s Large Catechism, Part I: The Ten Commandments",
            year: "1529",
            locator: "Part I, Introduction",
            quoteExcerpt:
              "\u201CThus we have the Ten Commandments, a summary of divine teaching, of what we are to do that our whole life may be pleasing to God.\u201D",
            primarySourceUrl:
              "https://thebookofconcord.org/large-catechism/part-i/",
            contextNotes:
              "Luther\u2019s catechetical framework uses the Decalogue as the foundation for Christian ethics and instruction.",
            agreementScope:
              "Affirms Decalogue\u2019s central role in Christian ethics; Lutheran Sabbath application differs.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "law-3",
        title:
          "The moral law is distinct from the ceremonial law and stands forever",
        order: 3,
        claimSummary:
          "Protestant leaders distinguish the moral law (Ten Commandments) from the ceremonial law. Christ abolished the ceremonial; the moral law remains in force upon all mankind in all ages.",
        bibleAnchors: [
          "Matthew 5:17-18",
          "Romans 3:31",
          "Psalm 89:34",
          "Psalm 111:7-8",
        ],
        witnesses: [
          {
            id: "law-3-wesley-moral-ceremonial",
            author: "John Wesley",
            tradition: "Methodist",
            workTitle:
              "Sermon 25, \u2018Upon Our Lord\u2019s Sermon on the Mount,\u2019 in Works, Vol. 5",
            year: "1872 Zondervan reprint",
            locator: "pp. 311\u2013312",
            quoteExcerpt:
              "\u201CThe Ritual or Ceremonial law, delivered by Moses to the children of Israel, containing all the injunctions and ordinances which related to the old sacrifices and service of the Temple, our Lord indeed did come to destroy\u2026 The moral law, contained in the Ten Commandments, and enforced by the Prophets, he did not take away\u2026 This is a law which never can be broken, which \u2018stands fast as the faithful witness in heaven.\u2019 The moral stands on an entirely different foundation from the ceremonial or ritual law, which was designed for a temporary restraint upon a disobedient and stiff-necked people; whereas this was from the beginning of the world, being \u2018written not on tables of stone,\u2019 but on the hearts of all the children of men, when they came out of the hands of the Creator\u2026 Every part of this law must remain in force upon all mankind, and in all ages; as not depending either on time or place, or any other circumstances liable to change, but on the nature of God, and the nature of man, and their unchangeable relation to each other.\u201D",
            primarySourceUrl:
              "https://www.umcmission.org/Find-Resources/John-Wesley-Sermons/Sermon-25-Upon-Our-Lords-Sermon-on-the-Mount-Discourse-5",
            contextNotes:
              "John Wesley (1703\u20131791), founder of Methodism and one of the most influential Protestant leaders in history. This sermon is a cornerstone text. Wesley explicitly distinguishes between the ceremonial law (abolished) and the moral law (eternal, binding on all mankind in all ages).",
            agreementScope:
              "Directly supports the SDA distinction between moral and ceremonial law. Wesley\u2019s Sabbath application differs, but the principle is identical to SDA teaching.",
            credibilityGrade: "A",
          },
          {
            id: "law-3-moody-p14",
            author: "D.L. Moody",
            tradition: "Evangelical (non-denominational)",
            workTitle: "Weighed and Wanting",
            year: "1898",
            locator: "p. 14",
            quoteExcerpt:
              "\u201CThe commandments did not originate with Moses, nor were they done away with when the Mosaic Law was fulfilled in Christ, and many of its ceremonies and regulations abolished. They are not discoveries that men made. They are from heaven, and indicate the nature and purpose of God Himself. \u2018The Decalogue is the most perfect code of laws existing. Its simplicity, comprehensiveness, ethical depths, and universal character stamp it as divine; and in its majestic simplicity, supplying the highest and best demands of the human heart, it may well be placed beside that other divine production, the Lord\u2019s Prayer.\u2019\u201D",
            primarySourceUrl:
              "https://archive.org/details/weighedandwantin00mood",
            contextNotes:
              "D.L. Moody (1837\u20131899) was the most prominent American evangelist of the 19th century. Here he explicitly distinguishes the Ten Commandments from the ceremonial regulations and affirms their pre-Mosaic, divine origin.",
            agreementScope:
              "Directly supports SDA teaching that the moral law predates Moses and was not abolished with the ceremonial law.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "law-4",
        title:
          "The Ten Commandments are still binding today",
        order: 4,
        claimSummary:
          "Major Protestant evangelists and preachers explicitly state that the Ten Commandments remain binding, with a penalty attached to their violation.",
        bibleAnchors: [
          "Matthew 5:17-19",
          "1 John 3:4",
          "Romans 7:7",
          "James 2:10-12",
        ],
        witnesses: [
          {
            id: "law-4-moody-p16",
            author: "D.L. Moody",
            tradition: "Evangelical (non-denominational)",
            workTitle: "Weighed and Wanting",
            year: "1898",
            locator: "p. 16",
            quoteExcerpt:
              "\u201CThe people must be made to understand that the Ten Commandments are still binding, and that there is a penalty attached to their violation.\u201D",
            primarySourceUrl:
              "https://archive.org/details/weighedandwantin00mood",
            contextNotes:
              "Short, powerful, quotable. Moody leaves no ambiguity: the Ten Commandments are \u2018still binding\u2019 with \u2018a penalty.\u2019",
            agreementScope:
              "Directly supports SDA position on the binding nature of the Decalogue.",
            credibilityGrade: "A",
          },
          {
            id: "law-4-moody-p15",
            author: "D.L. Moody",
            tradition: "Evangelical (non-denominational)",
            workTitle: "Weighed and Wanting",
            year: "1898",
            locator: "p. 15",
            quoteExcerpt:
              "\u201CThe commandments of God given to Moses in the Mount at Horeb are as binding to-day as ever they have been since the time when they were proclaimed in the hearing of the people. The Jews said the law was not given in Palestine, (which belonged to Israel), but in the wilderness, because the law was for all nations. Jesus never condemned the law and the prophets, but He did condemn those who did not obey them. Because He gave new commandments it does not follow that He abolished the old. Christ\u2019s explanation of them made them all the more searching. In His Sermon on the Mount He carried the principles of the commandments beyond the mere letter. He unfolded them and showed that they embraced more, that they are positive as well as prohibitive.\u201D",
            primarySourceUrl:
              "https://archive.org/details/weighedandwantin00mood",
            contextNotes:
              "Moody argues: (1) the commandments are for all nations, not just Israel; (2) Jesus never condemned the law; (3) Christ deepened, not abolished, the commandments. All three points align with SDA teaching.",
            agreementScope:
              "Strongly supports SDA position. Moody\u2019s note that the law was given \u2018in the wilderness\u2019 for all nations is especially powerful for Sabbath discussions.",
            credibilityGrade: "A",
          },
          {
            id: "law-4-graham-108",
            author: "Billy Graham",
            tradition: "Baptist (Southern Baptist / non-denominational evangelist)",
            workTitle:
              "Sermons on the Ten Commandments, quoted in George Burnham and Lee Fisher, Billy Graham and the New York Crusade",
            year: "1957",
            locator: "pp. 108\u2013109",
            quoteExcerpt:
              "\u201CLike Wesley, I find that I must preach the law and judgement before I can preach grace and love\u2026 The Ten Commandments\u2026 are the moral laws of God for the conduct of the people. Some think they have been revoked. That is not true. Christ taught the law. They are still in effect today. God has not changed. People have changed\u2026 Every person who ever lived, with the exception of Jesus Christ, has broken the Ten Commandments. Sin is a transgression of the law. The Bible says all have sinned and come short of the glory of God. The Ten Commandments are a mirror to show us how far short we fall in meeting God\u2019s standards. And the mirror of our shortcomings drives us to the Cross, where Christ paid the debt for sin.\u201D",
            primarySourceUrl:
              "https://archive.org/search?query=billy+graham+new+york+crusade+burnham",
            contextNotes:
              "Billy Graham (1918\u20132018), the most famous evangelist of the 20th century. Here he explicitly says the Ten Commandments \u2018have not been revoked\u2019 and \u2018are still in effect today.\u2019 He also defines sin as \u2018transgression of the law\u2019 (cf. 1 John 3:4).",
            agreementScope:
              "Directly supports SDA position on the law\u2019s perpetuity and its role as a mirror revealing sin. Graham\u2019s Sabbath observance differed from SDA.",
            credibilityGrade: "A",
          },
          {
            id: "law-4-graham-191",
            author: "Billy Graham",
            tradition: "Baptist (Southern Baptist / non-denominational evangelist)",
            workTitle:
              "Sermon in Times Square, quoted in Burnham and Fisher, Billy Graham and the New York Crusade",
            year: "1957",
            locator: "p. 191",
            quoteExcerpt:
              "\u201CThis [the Ten Commandments] is God\u2019s moral law given through Moses. These commandments express the requirements of a righteous God. To transgress even one of these Commandments is sin, the result of which is eternal separation from God\u2026 I warn you tonight, there can be no peace until the Law is kept and there is no power within us to keep the Law. Human nature is bankrupt. That is why Christ came to give us a new nature.\u201D",
            primarySourceUrl:
              "https://archive.org/search?query=billy+graham+new+york+crusade+burnham",
            contextNotes:
              "From Graham\u2019s iconic Times Square crusade sermon. He calls the Ten Commandments \u2018God\u2019s moral law\u2019 and says transgressing even one is sin leading to separation from God.",
            agreementScope:
              "Directly supports SDA teaching on the law as God\u2019s moral standard and sin as its transgression.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "law-5",
        title:
          "Those who teach against God\u2019s law betray Christ",
        order: 5,
        claimSummary:
          "Protestant leaders strongly condemn antinomianism \u2014 the teaching that Christ abolished the law. Wesley calls it betrayal; Luther says abolishing the law abolishes sin itself.",
        bibleAnchors: [
          "Matthew 5:19",
          "1 John 2:3-4",
          "Romans 3:31",
          "Romans 6:1-2",
        ],
        witnesses: [
          {
            id: "law-5-wesley-antinomian",
            author: "John Wesley",
            tradition: "Methodist",
            workTitle:
              "Sermon 25, \u2018Upon Our Lord\u2019s Sermon on the Mount,\u2019 in Works, Vol. 5",
            year: "1872 Zondervan reprint",
            locator: "pp. 317\u2013318",
            quoteExcerpt:
              "\u201CIn the highest rank of the enemies of the gospel of Christ, are they who openly and explicitly \u2018judge the law\u2019 itself, and \u2018speak evil of the law;\u2019 who teach men to break not one only, whether of the least, or of the greatest, but all the commandments at a stroke; who teach, without any cover, in so many words, \u2018What did our Lord do with the law? He abolished it. There is but one duty, which is that of believing.\u2019\u2026 The most surprising of all the circumstances that attend this strong delusion, is, that they who are given up to it, really believe that they honour Christ by overthrowing his law, and that they are magnifying his office, while they are destroying his doctrine. Yea, they honour him just as Judas did, when he said, \u2018Hail, Master,\u2019 and kissed him. And he may as justly say to every one of them, \u2018Betrayest thou the Son of Man with a kiss?\u2019 It is no other than betraying him with a kiss, to talk of his blood, and take away his crown; to set light by any part of his law, under pretence of advancing his gospel.\u201D",
            primarySourceUrl:
              "https://www.umcmission.org/Find-Resources/John-Wesley-Sermons/Sermon-25-Upon-Our-Lords-Sermon-on-the-Mount-Discourse-5",
            contextNotes:
              "One of the most powerful anti-antinomian statements in all of Protestant literature. Wesley compares those who abolish the law to Judas betraying Christ with a kiss. His passion is unmistakable.",
            agreementScope:
              "Directly parallels SDA warnings against antinomianism. Wesley\u2019s condemnation of \u2018abolishing the law\u2019 is as strong as any SDA preacher.",
            credibilityGrade: "A",
          },
          {
            id: "law-5-luther-antinomians",
            author: "Martin Luther",
            tradition: "Lutheran (Reformer)",
            workTitle:
              "Wider die Antinomer (Against the Antinomians), secs. 6, 8, in S\u00E4mmtliche Schriften, Vol. 20",
            year: "1539 (1890 Concordia ed.)",
            locator: "cols. 1613\u20131614",
            quoteExcerpt:
              "\u201CI wonder exceedingly how it came to be imputed to me that I should reject the law or the ten commandments\u2026 Can anyone think that sin exists where there is no law? Whoever abrogates the law, must of necessity abrogate sin also.\u201D",
            primarySourceUrl:
              "https://archive.org/details/luthersworksamer55luth",
            contextNotes:
              "Luther himself, the great Reformer of \u2018sola fide,\u2019 forcefully denies that he ever rejected the Ten Commandments. His logic is airtight: no law = no sin. This powerfully refutes the claim that the Reformation abolished the Decalogue.",
            agreementScope:
              "Directly supports SDA position that grace does not abolish the law. Luther\u2019s own testimony against antinomianism is devastating to those who claim \u2018Luther freed us from the law.\u2019",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "law-6",
        title:
          "Breaking any one commandment makes one guilty of all",
        order: 6,
        claimSummary:
          "The indivisibility of the Decalogue means one cannot claim obedience to nine commandments while breaking the tenth. The law is a unity.",
        bibleAnchors: [
          "James 2:10-11",
          "Matthew 5:19",
          "Galatians 3:10",
        ],
        witnesses: [
          {
            id: "law-6-morgan-p11",
            author: "G. Campbell Morgan",
            tradition: "Congregationalist",
            workTitle: "The Ten Commandments",
            year: "1901",
            locator: "p. 11",
            quoteExcerpt:
              "\u201CIn the Epistle of James is found a word of deep significance. \u2018Whosoever shall keep the whole law, and yet stumble in one point, he is become guilty of all,\u2019 (ii.10)\u2026 Herein lies the explanation of the apparent severity of James\u2019 utterance. Men are apt to think that if there be Ten Commandments, of which they obey nine, such obedience will be put to their credit, even though they break the tenth.\u201D",
            primarySourceUrl:
              "https://archive.org/details/tencommandments00morg",
            contextNotes:
              "Morgan\u2019s point is devastating for those who claim to keep \u2018most\u2019 of the Ten Commandments while ignoring the fourth (Sabbath). If one breaks any command, one is guilty of all.",
            agreementScope:
              "Directly supports SDA argument that the Decalogue is indivisible \u2014 you cannot pick and choose which commandments to obey.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 5. SABBATH (Seventh-day wording preserved)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "sabbath",
    name: "Sabbath (Seventh-day wording preserved in catechesis)",
    order: 5,
    summary:
      "Even where practice varies, non-SDA catechesis preserves the 4th command\u2019s seventh-day wording and frames it as God\u2019s law. Key Catholic sources acknowledge the church changed the day.",
    tags: ["Evidence", "DoctrineLibrary", "Sabbath"],
    claims: [
      {
        id: "sab-1",
        title:
          "The 4th commandment explicitly references the seventh day",
        order: 1,
        claimSummary:
          "Non-SDA catechisms print the command as seventh day Sabbath in the Decalogue.",
        bibleAnchors: ["Exodus 20:8-11"],
        witnesses: [
          {
            id: "sab-1-heidelberg",
            author: "Heidelberg Catechism",
            tradition: "Reformed",
            workTitle:
              "Heidelberg Catechism, Lord\u2019s Day 34 (Decalogue text)",
            year: "1563",
            locator: "LD34 (4th Commandment)",
            quoteExcerpt:
              "\u201CThe seventh day is a Sabbath to the LORD your God.\u201D",
            primarySourceUrl:
              "https://www.heidelberg-catechism.com/en/lords-days/34.html",
            contextNotes:
              "This is a clean bridge card before debating Sunday transfer claims.",
            agreementScope:
              "Affirms seventh-day wording; later application varies by tradition.",
            credibilityGrade: "A",
          },
          {
            id: "sab-1-ccc-2168",
            author: "Catholic Church",
            tradition: "Roman Catholic",
            workTitle:
              "Catechism of the Catholic Church, \u00A72168\u20132176",
            year: "1992",
            locator: "CCC 2168\u20132176",
            quoteExcerpt:
              "\u201CThe sabbath, which represented the completion of the first creation, has been replaced by Sunday\u2026 the day of the Lord\u2019s Resurrection.\u201D",
            primarySourceUrl:
              "https://www.usccb.org/sites/default/files/flipbooks/catechism/586/",
            contextNotes:
              "The CCC explicitly acknowledges the Sabbath was Saturday and that Sunday replaced it. This is a high-value admission.",
            agreementScope:
              "Acknowledges the seventh-day origin; claims church authority to transfer. SDA contests the transfer authority.",
            credibilityGrade: "A",
          },
          {
            id: "sab-1-moody-sabbath",
            author: "D.L. Moody",
            tradition: "Evangelical (non-denominational)",
            workTitle: "Weighed and Wanting",
            year: "1898",
            locator: "p. 47 (chapter on the Fourth Commandment)",
            quoteExcerpt:
              "\u201CI honestly believe that this commandment is just as binding to-day as it ever was. I have talked with men who have said that it has been abrogated, but they have never been able to point to any place in the Bible where God repealed it.\u201D",
            primarySourceUrl:
              "https://archive.org/details/weighedandwantin00mood",
            contextNotes:
              "Moody, the greatest American evangelist of his era, explicitly affirms the fourth commandment is \u2018just as binding today as it ever was\u2019 and says no one can show him where God repealed it. Though Moody kept Sunday, his logic supports the seventh day.",
            agreementScope:
              "Affirms the fourth commandment is binding; Moody applied it to Sunday, but his own argument about no repeal supports the seventh-day position.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "sab-2",
        title:
          "Catholic sources acknowledge the church transferred the Sabbath to Sunday",
        order: 2,
        claimSummary:
          "Catholic catechetical and apologetic sources explicitly state that the church changed the day of worship from Saturday to Sunday by its own authority.",
        bibleAnchors: ["Daniel 7:25", "Exodus 20:8-11"],
        witnesses: [
          {
            id: "sab-2-geiermann",
            author: "Peter Geiermann, C.SS.R.",
            tradition: "Roman Catholic",
            workTitle:
              "The Convert\u2019s Catechism of Catholic Doctrine",
            year: "1957",
            locator: "Q&A on the Third Commandment (Catholic numbering)",
            quoteExcerpt:
              "\u201CQ. Which is the Sabbath day? A. Saturday is the Sabbath day. Q. Why do we observe Sunday instead of Saturday? A. We observe Sunday instead of Saturday because the Catholic Church transferred the solemnity from Saturday to Sunday.\u201D",
            primarySourceUrl:
              "https://archive.org/details/TheConverts00Geie",
            contextNotes:
              "Widely cited admission. Geiermann received the \u2018apostolic blessing\u2019 of Pope Pius X for this catechism (Jan 25, 1910).",
            agreementScope:
              "Explicitly confirms the transfer was by church authority, not biblical command. Core SDA Sabbath argument.",
            credibilityGrade: "A",
          },
          {
            id: "sab-2-gibbons",
            author: "Cardinal James Gibbons",
            tradition: "Roman Catholic",
            workTitle: "The Faith of Our Fathers",
            year: "1876",
            locator: "Chapter XVI (on tradition)",
            quoteExcerpt:
              "\u201CYou may read the Bible from Genesis to Revelation, and you will not find a single line authorizing the sanctification of Sunday. The Scriptures enforce the religious observance of Saturday.\u201D",
            primarySourceUrl:
              "https://archive.org/details/faithofourfathe01gibb",
            contextNotes:
              "One of the most frequently cited admissions by a Catholic prelate. Gibbons was Archbishop of Baltimore and a leading American Catholic voice.",
            agreementScope:
              "Directly supports SDA position that Sunday observance lacks biblical mandate.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 6. HEAVENLY SANCTUARY
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "heavenly_sanctuary",
    name: "Heavenly Sanctuary (Hebrews: true tabernacle / copies & heavenly things)",
    order: 6,
    summary:
      "Non-SDA evangelical and academic resources affirm Hebrews\u2019 language about a heavenly reality with earthly copies/shadows.",
    tags: ["Evidence", "DoctrineLibrary", "Sanctuary"],
    claims: [
      {
        id: "hs-1",
        title:
          "Hebrews teaches heavenly realities of which the earthly was a copy",
        order: 1,
        claimSummary:
          "Hebrews contrasts earthly \u2018copies\u2019 with \u2018heavenly things themselves.\u2019",
        bibleAnchors: ["Hebrews 8:1-5", "Hebrews 9:23-24"],
        witnesses: [
          {
            id: "hs-1-bibleref-heb814",
            author: "BibleRef",
            tradition: "Evangelical reference",
            workTitle:
              "Daniel 8:14 / Hebrews cross-reference style explainer",
            year: "modern",
            locator:
              "Hebrews 9:23 logic in its Hebrews page set (see site)",
            quoteExcerpt:
              "\u201CCopies\u2026 but the heavenly things themselves\u2026\u201D",
            primarySourceUrl:
              "https://www.bibleref.com/Daniel/8/Daniel-8-14.html",
            contextNotes:
              "This page includes major translation renderings; pair with Hebrews pages for fuller picture.",
            agreementScope:
              "Affirms heavenly/earthly copy framework; not SDA 1844 timing.",
            credibilityGrade: "B",
          },
          {
            id: "hs-1-bruce-hebrews",
            author: "F.F. Bruce",
            tradition: "Evangelical (Plymouth Brethren background)",
            workTitle:
              "The Epistle to the Hebrews (NICNT)",
            year: "1964 (rev. 1990)",
            locator: "Commentary on Hebrews 8:1\u20135",
            quoteExcerpt:
              "\u201COur author\u2019s argument is that the earthly sanctuary was a copy and shadow of the heavenly one\u2026 The ministry of Christ is carried on in the heavenly and real sanctuary.\u201D",
            primarySourceUrl:
              "https://www.eerdmans.com/Products/0328/the-epistle-to-the-hebrews.aspx",
            contextNotes:
              "F.F. Bruce (1910\u20131990) was one of the most respected evangelical NT scholars of the 20th century. His NICNT Hebrews commentary is a standard reference.",
            agreementScope:
              "Affirms heavenly sanctuary as real; Bruce does not adopt SDA two-apartment theology.",
            credibilityGrade: "A",
          },
          {
            id: "hs-1-lane-hebrews",
            author: "William L. Lane",
            tradition: "Evangelical",
            workTitle:
              "Hebrews (Word Biblical Commentary, 2 vols.)",
            year: "1991",
            locator: "Commentary on Hebrews 9:23\u201324",
            quoteExcerpt:
              "\u201CThe heavenly counterpart to the earthly sanctuary required a superior sacrifice\u2026 Christ entered into heaven itself, now to appear in the presence of God on our behalf.\u201D",
            primarySourceUrl:
              "https://www.harpercollins.com/products/hebrews-9-13-word-biblical-commentary-vol-47b-william-l-lane",
            contextNotes:
              "WBC is a major academic evangelical series. Lane\u2019s work on Hebrews is widely cited in scholarly literature.",
            agreementScope:
              "Affirms heavenly sanctuary reality and Christ\u2019s ongoing heavenly ministry; does not adopt SDA chronological framework.",
            credibilityGrade: "A",
          },
          {
            id: "hs-1-koester-hebrews",
            author: "Craig R. Koester",
            tradition: "Lutheran (ELCA academic)",
            workTitle: "Hebrews (Anchor Yale Bible Commentary)",
            year: "2001",
            locator: "Commentary on Hebrews 8:1\u20136",
            quoteExcerpt:
              "\u201CThe heavenly sanctuary is the setting for Christ\u2019s ministry\u2026 The earthly tabernacle served as a \u2018sketch and shadow\u2019 of the heavenly.\u201D",
            primarySourceUrl:
              "https://yalebooks.yale.edu/book/9780300139891/hebrews/",
            contextNotes:
              "Anchor Bible is one of the most prestigious academic commentary series. Koester\u2019s volume is considered definitive.",
            agreementScope:
              "Affirms heavenly sanctuary concept; Lutheran interpretation does not include SDA 1844 specifics.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 7. DANIEL 8:14
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "daniel_814",
    name: "Daniel 8:14 (Sanctuary \u2018restored / properly restored\u2019 language)",
    order: 7,
    summary:
      "Non-SDA translation notes and reference tools acknowledge the Hebrew verb nisdaq can carry \u2018restored/justified\u2019 senses beyond \u2018cleansed.\u2019",
    tags: ["Evidence", "DoctrineLibrary", "Daniel814"],
    claims: [
      {
        id: "d814-1",
        title:
          "Major translations render Daniel 8:14 as \u2018restored/properly restored\u2019",
        order: 1,
        claimSummary:
          "Translation tradition recognizes restoration/vindication sense.",
        bibleAnchors: ["Daniel 8:14"],
        witnesses: [
          {
            id: "d814-1-bibleref",
            author: "BibleRef (translation comparison)",
            tradition: "Evangelical reference",
            workTitle: "Daniel 8:14 (translation comparison)",
            year: "modern",
            locator: "Top translation block",
            quoteExcerpt:
              "ESV: \u201Crestored to its rightful state\u201D\u2026 NASB: \u201Cproperly restored.\u201D",
            primarySourceUrl:
              "https://www.bibleref.com/Daniel/8/Daniel-8-14.html",
            contextNotes:
              "Excellent neutral bridge: lets you argue semantics without SDA-only sources.",
            agreementScope:
              "Confirms translation possibilities; does not imply SDA chronology.",
            credibilityGrade: "B",
          },
          {
            id: "d814-1-collins-daniel",
            author: "John J. Collins",
            tradition: "Academic (Yale Divinity School)",
            workTitle:
              "Daniel: A Commentary on the Book of Daniel (Hermeneia)",
            year: "1993",
            locator: "Commentary on Daniel 8:14, pp. 335\u2013336",
            quoteExcerpt:
              "\u201CThe Hebrew nisdaq is a hapax legomenon\u2026 The rendering \u2018shall be restored to its rightful state\u2019 (RSV) captures the sense of vindication.\u201D",
            primarySourceUrl:
              "https://www.fortresspress.com/store/product/9780800660406/Daniel",
            contextNotes:
              "Collins is one of the foremost Daniel scholars worldwide. His Hermeneia commentary is the standard critical reference. He acknowledges the semantic range of nisdaq.",
            agreementScope:
              "Confirms \u2018restoration/vindication\u2019 as a valid reading; Collins does not adopt SDA 1844 interpretation.",
            credibilityGrade: "A",
          },
          {
            id: "d814-1-goldingay-daniel",
            author: "John Goldingay",
            tradition: "Anglican evangelical (Fuller Seminary)",
            workTitle:
              "Daniel (Word Biblical Commentary)",
            year: "1989",
            locator: "Commentary on Daniel 8:14",
            quoteExcerpt:
              "\u201CThe sanctuary\u2019s desolation has a set term\u2026 the sanctuary will be \u2018put right\u2019 or \u2018vindicated.\u2019\u201D",
            primarySourceUrl:
              "https://www.harpercollins.com/products/daniel-word-biblical-commentary-vol-30-john-e-goldingay",
            contextNotes:
              "Goldingay is a respected OT scholar. His WBC Daniel is widely used in evangelical seminaries.",
            agreementScope:
              "Supports \u2018vindication\u2019 reading; does not endorse SDA 1844 chronology.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 8. INVESTIGATIVE JUDGMENT (Daniel 7 heavenly court)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "investigative_judgment",
    name: "Investigative Judgment (Building blocks: Daniel 7 heavenly court + books)",
    order: 8,
    summary:
      "Non-SDA sources strongly affirm a heavenly court/judgment scene with \u2018books opened\u2019 in Daniel 7. This supports the conceptual foundation (not the 1844 date).",
    tags: ["Evidence", "DoctrineLibrary", "Judgment"],
    claims: [
      {
        id: "ij-1",
        title:
          "Daniel 7 depicts a heavenly court scene with books opened",
        order: 1,
        claimSummary:
          "Scholarly and devotional academic resources treat Daniel 7:9\u201310 as a divine courtroom scene.",
        bibleAnchors: [
          "Daniel 7:9-10",
          "Daniel 7:13-14",
          "Daniel 7:22",
        ],
        witnesses: [
          {
            id: "ij-1-yu-angel",
            author: "Jonathan L. Angel",
            tradition: "Academic (Biblical studies)",
            workTitle:
              "The Divine Courtroom in Comparative Perspective (PDF)",
            year: "2014",
            locator: "Discusses Daniel 7 court/books scene",
            quoteExcerpt:
              "\u201CThe court sat and the books were opened.\u201D",
            primarySourceUrl:
              "https://repository.yu.edu/bitstreams/0dcbee90-b2b0-4151-8319-3e88ddf8c805/download",
            contextNotes:
              "Academic framing of Daniel 7 throne/court imagery; ideal \u2018A-grade\u2019 non-SDA courtroom anchor.",
            agreementScope:
              "Affirms courtroom/judgment imagery; does not assign SDA 1844 chronology.",
            credibilityGrade: "A",
          },
          {
            id: "ij-1-baldwin-daniel",
            author: "Joyce G. Baldwin",
            tradition: "Evangelical (Tyndale OT Commentary series)",
            workTitle:
              "Daniel: An Introduction and Commentary (TOTC)",
            year: "1978",
            locator: "Commentary on Daniel 7:9\u201314",
            quoteExcerpt:
              "\u201CThe courtroom scene is one of the most vivid in all apocalyptic literature\u2026 thrones are set up, the Ancient of Days takes His seat, and the books are opened.\u201D",
            primarySourceUrl:
              "https://www.ivpress.com/daniel-baldwin",
            contextNotes:
              "TOTC is a widely-used evangelical commentary series. Baldwin\u2019s Daniel work is a standard seminary text.",
            agreementScope:
              "Affirms courtroom imagery and pre-advent judgment concept; does not adopt SDA 1844 dating.",
            credibilityGrade: "A",
          },
          {
            id: "ij-1-collins-dan7",
            author: "John J. Collins",
            tradition: "Academic (Yale)",
            workTitle:
              "Daniel (Hermeneia), commentary on ch. 7",
            year: "1993",
            locator: "Commentary on Daniel 7:9\u201310, pp. 299\u2013303",
            quoteExcerpt:
              "\u201CThe scene describes a heavenly assize\u2026 The \u2018books\u2019 contain the record of deeds upon which judgment is based.\u201D",
            primarySourceUrl:
              "https://www.fortresspress.com/store/product/9780800660406/Daniel",
            contextNotes:
              "Collins identifies Daniel 7 as a heavenly judgment scene with record-keeping\u2014key conceptual building block for investigative judgment theology.",
            agreementScope:
              "Affirms heavenly court with books/record; does not adopt SDA timeline.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "ij-2",
        title:
          "Judgment precedes the kingdom\u2019s bestowal in Daniel 7",
        order: 2,
        claimSummary:
          "The sequence in Daniel 7 places judgment (7:9\u201310) before the Son of Man receives the kingdom (7:13\u201314), supporting a pre-advent judgment concept.",
        bibleAnchors: [
          "Daniel 7:9-10",
          "Daniel 7:13-14",
          "Revelation 20:12",
        ],
        witnesses: [
          {
            id: "ij-2-goldingay-seq",
            author: "John Goldingay",
            tradition: "Anglican evangelical",
            workTitle: "Daniel (WBC)",
            year: "1989",
            locator: "Commentary on Daniel 7:9\u201314 sequence",
            quoteExcerpt:
              "\u201CThe judgment scene precedes and leads to the transfer of sovereignty to \u2018one like a son of man.\u2019\u201D",
            primarySourceUrl:
              "https://www.harpercollins.com/products/daniel-word-biblical-commentary-vol-30-john-e-goldingay",
            contextNotes:
              "Goldingay\u2019s sequence analysis supports the idea that judgment precedes the bestowal of the kingdom\u2014a key building block for SDA pre-advent judgment theology.",
            agreementScope:
              "Confirms textual sequence; does not adopt SDA chronological framework.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 9. STATE OF THE DEAD
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "state_of_dead",
    name: "State of the Dead (Conditional immortality / \u2018sleep\u2019 logic witnesses)",
    order: 9,
    summary:
      "Non-SDA conditionalist/evangelical voices argue immortality is God\u2019s gift and that human immortality is conditional, not natural.",
    tags: ["Evidence", "DoctrineLibrary", "StateOfDead"],
    claims: [
      {
        id: "sod-1",
        title:
          "Immortality is not inherent to humans; it is conditional on God\u2019s gift",
        order: 1,
        claimSummary:
          "Conditionalist evangelical argument: God alone possesses immortality inherently.",
        bibleAnchors: ["1 Timothy 6:16", "Romans 6:23"],
        witnesses: [
          {
            id: "sod-1-fudge",
            author: "Edward Fudge",
            tradition: "Evangelical (conditional immortality)",
            workTitle: "\u2018Immortality Is Conditional\u2019 (essay)",
            year: "2012",
            locator: "Opening paragraphs",
            quoteExcerpt:
              "\u201CGod \u2018alone possesses immortality\u2019\u2026 Human beings are not naturally \u2018immortal\u2019\u2026 Our immortality is conditional\u2026\u201D",
            primarySourceUrl:
              "https://edwardfudge.com/2012/03/immortality-is-conditional/",
            contextNotes:
              "Use as a bridge into your \u2018state of the dead\u2019 and \u2018final punishment\u2019 modules.",
            agreementScope:
              "Affirms conditional immortality; not SDA on sanctuary/prophecy.",
            credibilityGrade: "B",
          },
          {
            id: "sod-1-cullmann",
            author: "Oscar Cullmann",
            tradition: "Lutheran (academic, Basel/Paris)",
            workTitle:
              "Immortality of the Soul or Resurrection of the Dead? The Witness of the New Testament",
            year: "1958",
            locator: "Entire monograph (Ingersoll Lecture at Harvard)",
            quoteExcerpt:
              "\u201CThe expectation of the resurrection of the dead is something quite different from the Greek belief in the immortality of the soul\u2026 The body is not the prison of the soul.\u201D",
            primarySourceUrl:
              "https://www.religion-online.org/book-chapter/chapter-1-the-problem/",
            contextNotes:
              "Cullmann\u2019s famous 1955 Ingersoll Lecture argued that the NT teaches resurrection, not innate immortality\u2014directly parallel to SDA anthropology. One of the most influential mid-20th century works on the topic.",
            agreementScope:
              "Affirms resurrection over innate immortality; Cullmann was not SDA and did not adopt SDA eschatology.",
            credibilityGrade: "A",
          },
          {
            id: "sod-1-wright",
            author: "N.T. Wright",
            tradition: "Anglican (Durham)",
            workTitle: "Surprised by Hope: Rethinking Heaven, the Resurrection, and the Mission of the Church",
            year: "2008",
            locator: "Chapters 2\u20134",
            quoteExcerpt:
              "\u201CThe Christian hope is not about \u2018going to heaven when you die.\u2019\u2026 It\u2019s about the resurrection of the body and the renewal of all creation.\u201D",
            primarySourceUrl:
              "https://www.harpercollins.com/products/surprised-by-hope-n-t-wright",
            contextNotes:
              "Wright, former Bishop of Durham and one of the most prominent NT scholars alive, critiques the \u2018disembodied soul in heaven\u2019 framework and emphasizes bodily resurrection.",
            agreementScope:
              "Supports SDA emphasis on bodily resurrection over Greek immortal-soul theology; Wright is not a conditionalist on final punishment.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "sod-2",
        title:
          "Death is described as \u2018sleep\u2019 in the New Testament",
        order: 2,
        claimSummary:
          "Multiple NT passages use \u2018sleep\u2019 language for death, suggesting unconsciousness rather than immediate conscious afterlife.",
        bibleAnchors: [
          "John 11:11-14",
          "1 Thessalonians 4:13-14",
          "1 Corinthians 15:51",
          "Acts 7:60",
        ],
        witnesses: [
          {
            id: "sod-2-luther-sleep",
            author: "Martin Luther",
            tradition: "Lutheran (Reformer)",
            workTitle:
              "Various writings on soul sleep",
            year: "1520s\u20131530s",
            locator: "Letter to Amsdorf (1522); Ecclesiastes commentary",
            quoteExcerpt:
              "\u201CWe shall sleep until He comes and knocks on the grave and says, \u2018Dr. Martin, get up.\u2019 Then I will arise in a moment and be happy with Him forever.\u201D",
            primarySourceUrl:
              "https://www.lutherantheology.com/uploads/works/Luther-Intermediate-State.pdf",
            contextNotes:
              "Luther expressed soul-sleep sentiments in early writings, though later Lutheranism moved away from this. Documents that the Reformation had space for this view.",
            agreementScope:
              "Luther\u2019s early writings support sleep imagery; later Lutheran confessional theology diverges.",
            credibilityGrade: "B",
          },
          {
            id: "sod-2-tyndale",
            author: "William Tyndale",
            tradition: "Anglican (proto-Reformation, Bible translator)",
            workTitle:
              "An Answer to Sir Thomas More\u2019s Dialogue",
            year: "1530",
            locator: "Book IV, chapter IV",
            quoteExcerpt:
              "\u201CAnd ye, in putting them [departed souls] in heaven, hell, and purgatory, destroy the arguments wherewith Christ and Paul prove the resurrection\u2026 The true faith putteth the resurrection, and setteth the last day at hand; and moveth to long for it and to look for the coming of the Lord.\u201D",
            primarySourceUrl:
              "https://archive.org/details/answeruntosirtho00tynd",
            contextNotes:
              "William Tyndale (c. 1494\u20131536), the father of the English Bible, explicitly rejected the idea of conscious souls in heaven or hell before the resurrection. He was martyred for his faith. His argument: putting souls immediately in heaven \u2018destroys the arguments\u2019 for the resurrection.",
            agreementScope:
              "Directly supports SDA position on soul sleep. Tyndale, the man who gave England the Bible in English, held this view.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 10. FINAL PUNISHMENT (Annihilationism / Conditionalism)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "annihilationism",
    name: "Final Punishment (Annihilationism / Conditionalism debates)",
    order: 10,
    summary:
      "Non-SDA evangelicals argue against eternal conscious torment and for conditional immortality/ultimate destruction. This is a growing minority view within evangelicalism.",
    tags: ["Evidence", "DoctrineLibrary", "Hell"],
    claims: [
      {
        id: "hell-1",
        title:
          "Evangelical debate includes conditional immortality as a live option",
        order: 1,
        claimSummary:
          "Reputable evangelical discussions document conditionalist arguments as within evangelical debate space.",
        bibleAnchors: [
          "Matthew 10:28",
          "Romans 6:23",
          "Malachi 4:1-3",
        ],
        witnesses: [
          {
            id: "hell-1-modernreformation",
            author: "Modern Reformation (journal article)",
            tradition: "Reformed-leaning evangelical",
            workTitle: "Hell: The \u2018Minority\u2019 View",
            year: "modern",
            locator: "Opening section",
            quoteExcerpt:
              "\u201CAdam was not immortal by nature\u2026 only God possesses immortality.\u201D",
            primarySourceUrl:
              "https://www.modernreformation.org/resources/articles/hell-the-minority-view",
            contextNotes:
              "Good for documenting the existence and rationale of the conditionalist view in non-SDA circles.",
            agreementScope:
              "Affirms conditional immortality line of argument; not SDA prophecy.",
            credibilityGrade: "B",
          },
          {
            id: "hell-1-stott",
            author: "John Stott",
            tradition: "Anglican evangelical",
            workTitle:
              "Evangelical Essentials: A Liberal-Evangelical Dialogue (with David Edwards)",
            year: "1988",
            locator: "Chapter on Hell/Final Judgment",
            quoteExcerpt:
              "\u201CI find the concept intolerable and do not understand how people can live with it without either cauterizing their feelings or cracking under the strain\u2026 the ultimate annihilation of the wicked should at least be accepted as a legitimate, biblically founded alternative to their eternal conscious torment.\u201D",
            primarySourceUrl:
              "https://www.ivpress.com/evangelical-essentials",
            contextNotes:
              "John Stott (1921\u20132011) was one of the most influential evangelical leaders of the 20th century. His tentative endorsement of annihilationism sent shockwaves through evangelicalism.",
            agreementScope:
              "Supports SDA position on final destruction; Stott does not adopt full SDA eschatology.",
            credibilityGrade: "A",
          },
          {
            id: "hell-1-pinnock",
            author: "Clark Pinnock",
            tradition: "Baptist (evangelical)",
            workTitle:
              "The Destruction of the Finally Impenitent (Criswell Theological Review 4.2)",
            year: "1990",
            locator: "Full article",
            quoteExcerpt:
              "\u201CThe fire of God\u2019s judgment consumes the lost\u2026 the Bible uses the language of destruction, not eternal preservation in torment.\u201D",
            primarySourceUrl:
              "https://www.galaxie.com/article/ctr04-2-05",
            contextNotes:
              "Pinnock was a major evangelical theologian at McMaster Divinity College. His argument for conditionalism uses destruction language from Scripture.",
            agreementScope:
              "Directly supports SDA teaching on final punishment as destruction, not eternal torment.",
            credibilityGrade: "A",
          },
          {
            id: "hell-1-rethinking",
            author: "Chris Date, Gregory Stump, Joshua Anderson (eds.)",
            tradition: "Evangelical (conditionalist)",
            workTitle: "Rethinking Hell: Readings in Evangelical Conditionalism",
            year: "2014",
            locator: "Introduction + compiled essays",
            quoteExcerpt:
              "\u201CConditionalism\u2026 holds that God will raise the wicked for judgment, after which those who are not found in Christ will be finally destroyed, ceasing to exist forever.\u201D",
            primarySourceUrl:
              "https://rethinkinghell.com/",
            contextNotes:
              "Rethinking Hell is a growing evangelical movement with podcasts, conferences, and published volumes. Documents the conditionalist position within mainstream evangelicalism.",
            agreementScope:
              "Directly parallels SDA teaching on the fate of the wicked; does not adopt SDA prophetic framework.",
            credibilityGrade: "B",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 11. PAPACY / ANTICHRIST
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "papacy",
    name: "Papacy / Antichrist (Reformation confessional witness + historical evidence)",
    order: 11,
    summary:
      "Reformation confessions identify the papacy as Antichrist. Catholic sources themselves document papal claims to divine authority, the 538\u20131798 AD church-state reign, and the change of God\u2019s law. Secular historians confirm the persecution record.",
    tags: ["Evidence", "DoctrineLibrary", "Papacy"],
    claims: [
      {
        id: "pap-1",
        title:
          "Reformation confessions explicitly call the pope \u2018the very Antichrist\u2019",
        order: 1,
        claimSummary:
          "Multiple Reformation confessional documents state the identification directly.",
        bibleAnchors: ["2 Thessalonians 2:3-4", "Daniel 7:25", "Revelation 13:1-8"],
        witnesses: [
          {
            id: "pap-1-smalcald",
            author:
              "Martin Luther (Smalcald Articles in the Book of Concord)",
            tradition: "Lutheran (confessional)",
            workTitle:
              "Smalcald Articles, Part II, Article IV",
            year: "1537",
            locator: "II, IV, 10",
            quoteExcerpt:
              "\u201CThis teaching shows forcefully that the Pope is the very Antichrist\u2026\u201D",
            primarySourceUrl:
              "https://thebookofconcord.org/smalcald-articles/part-ii/article-iv/",
            contextNotes:
              "This is primary confessional text\u2014high-value for documenting historic Protestant identification.",
            agreementScope:
              "Affirms Reformation identification; SDA builds additional prophetic framework around it.",
            credibilityGrade: "A",
          },
          {
            id: "pap-1-wcf-256",
            author: "Westminster Assembly",
            tradition: "Reformed",
            workTitle:
              "Westminster Confession of Faith, Chapter 25.6",
            year: "1646",
            locator: "WCF 25.6",
            quoteExcerpt:
              "\u201CThere is no other head of the Church but the Lord Jesus Christ: nor can the Pope of Rome, in any sense, be head thereof; but is that Antichrist, that man of sin and son of perdition.\u201D",
            primarySourceUrl:
              "https://www.ligonier.org/learn/articles/westminster-confession-faith",
            contextNotes:
              "The original 1646 Westminster Confession directly identifies the Pope as \u2018that Antichrist.\u2019 This language was later softened in some revisions but remains in the original text.",
            agreementScope:
              "Affirms the historical Reformed identification; SDA adds Daniel/Revelation prophetic detail.",
            credibilityGrade: "A",
          },
          {
            id: "pap-1-knox-scottish",
            author: "John Knox",
            tradition: "Reformed (Scottish)",
            workTitle: "Scots Confession (Confessio Scoticana), Article XVIII",
            year: "1560",
            locator: "Article XVIII",
            quoteExcerpt:
              "\u201CThat horrible harlot, the Kirk malignant\u2026 the Roman Antichrist.\u201D",
            primarySourceUrl:
              "https://www.creeds.net/scots/",
            contextNotes:
              "The Scottish Reformation under Knox was explicit in identifying papal Rome as Antichrist. This was not a fringe view but the official Scottish Reformed confession.",
            agreementScope:
              "Confirms Reformation-era identification; Knox\u2019s specific framework differs from SDA historicism.",
            credibilityGrade: "A",
          },
          {
            id: "pap-1-irish-80",
            author: "James Ussher",
            tradition: "Anglican (Irish Reformed)",
            workTitle: "Irish Articles of Religion, Article 80",
            year: "1615",
            locator: "Article 80",
            quoteExcerpt:
              "\u201CThe Bishop of Rome is so far from being the supreme head of the universal Church of Christ, that his works and doctrine do plainly discover him to be that man of sin, foretold in the Holy Scriptures.\u201D",
            primarySourceUrl:
              "https://www.reformed.org/documents/irish_articles.html",
            contextNotes:
              "Ussher (famous for the Ussher chronology) drafted these articles for the Church of Ireland. Article 80 is among the most explicit Anglican identifications of the papacy as Antichrist.",
            agreementScope:
              "Affirms identification; Irish Articles predated and influenced the Westminster Confession.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "pap-2",
        title:
          "The Papacy claims to hold the place of God on earth",
        order: 2,
        claimSummary:
          "Official papal encyclicals, Catholic publications, and ecclesiastical dictionaries explicitly claim the Pope holds the place of God, is \u2018Jesus Christ Himself,\u2019 and is \u2018as it were God.\u2019",
        bibleAnchors: [
          "2 Thessalonians 2:3-4",
          "Daniel 7:25",
          "Revelation 13:5-6",
        ],
        witnesses: [
          {
            id: "pap-2-leo-xiii",
            author: "Pope Leo XIII",
            tradition: "Roman Catholic (papal)",
            workTitle: "Encyclical Letter (Praeclara Gratulationis Publicae)",
            year: "1894",
            locator: "June 20, 1894",
            quoteExcerpt:
              "\u201CWe hold upon this earth the place of God Almighty.\u201D",
            primarySourceUrl:
              "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_20061894_praeclara-gratulationis-publicae.html",
            contextNotes:
              "Pope Leo XIII\u2019s own words in an official encyclical. This is a primary Catholic source \u2014 the Pope himself claiming to hold \u2018the place of God Almighty\u2019 on earth. Compare 2 Thess. 2:4: \u2018he sits in the temple of God, showing himself that he is God.\u2019",
            agreementScope:
              "Primary source from the Vatican itself. The claim to hold God\u2019s place is exactly what 2 Thessalonians 2 describes.",
            credibilityGrade: "A",
          },
          {
            id: "pap-2-catholic-national",
            author: "The Catholic National (periodical)",
            tradition: "Roman Catholic",
            workTitle: "The Catholic National",
            year: "July 1895",
            locator: "Article on the Pope",
            quoteExcerpt:
              "\u201CThe Pope is not only the representative of Jesus Christ, but he is Jesus Christ Himself, hidden under the veil of flesh.\u201D",
            primarySourceUrl:
              "https://archive.org/search?query=%22catholic+national%22+1895",
            contextNotes:
              "A Catholic periodical explicitly identifying the Pope as \u2018Jesus Christ Himself.\u2019 This goes beyond \u2018representative\u2019 to ontological identification.",
            agreementScope:
              "Directly fulfills the prophetic description of Antichrist (\u2018in place of Christ\u2019). The Greek anti can mean \u2018in place of.\u2019",
            credibilityGrade: "B",
          },
          {
            id: "pap-2-ferraris",
            author: "Lucius Ferraris",
            tradition: "Roman Catholic (ecclesiastical)",
            workTitle:
              "Prompta Bibliotheca (Ferraris\u2019 Ecclesiastical Dictionary), article \u2018Papa\u2019",
            year: "1763",
            locator: "Article: \u2018Papa\u2019 (Pope)",
            quoteExcerpt:
              "\u201CThe Pope is of so great dignity and so exalted that he is not a mere man, but as it were God, and the Vicar of God\u2026 Hence the Pope is crowned with a triple crown, as King of Heaven and of Earth, and of the lower regions.\u201D",
            primarySourceUrl:
              "https://archive.org/details/PromptaBibliothecaCanonica",
            contextNotes:
              "Ferraris\u2019 Prompta Bibliotheca is a standard Catholic ecclesiastical reference work. It was published with papal approval and describes the Pope as \u2018not a mere man, but as it were God.\u2019",
            agreementScope:
              "Catholic source describing the Pope in terms that directly parallel the prophetic description in 2 Thessalonians 2:3\u20134.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "pap-3",
        title:
          "The Papacy rose to church-state power in 538 AD and received a \u2018deadly wound\u2019 in 1798 \u2014 exactly 1260 years",
        order: 3,
        claimSummary:
          "Secular and church historians document that Justinian\u2019s decree established papal supremacy (effective 538 AD) and that Napoleon\u2019s general Berthier abolished papal government in 1798 \u2014 a span of exactly 1260 years.",
        bibleAnchors: [
          "Daniel 7:25",
          "Revelation 13:5",
          "Revelation 13:3",
          "Revelation 13:10",
        ],
        witnesses: [
          {
            id: "pap-3-schaff-538",
            author: "Philip Schaff",
            tradition: "Reformed (church historian)",
            workTitle: "History of the Christian Church, Vol. 3",
            year: "1910",
            locator: "p. 327",
            quoteExcerpt:
              "\u201CThe legally recognized supremacy of the Pope began in 538 AD when there went into effect a decree of Emperor Justinian, making the Bishop of Rome head over all the churches, the definer of doctrine and the corrector of heretics. Vigilius\u2026 ascended the papal chair (538 AD) under the military protection of Belisarius.\u201D",
            primarySourceUrl:
              "https://archive.org/details/historyofchristi03scha",
            contextNotes:
              "Philip Schaff (1819\u20131893) was one of the most respected church historians in Protestant scholarship. His multi-volume History of the Christian Church is a standard reference. He documents the 538 AD date precisely.",
            agreementScope:
              "Directly supports the SDA identification of 538 AD as the starting date of papal supremacy.",
            credibilityGrade: "A",
          },
          {
            id: "pap-3-americana-1798",
            author: "Encyclopedia Americana",
            tradition: "Secular reference",
            workTitle: "Encyclopedia Americana",
            year: "1941",
            locator: "Article on the Papacy",
            quoteExcerpt:
              "\u201CIn 1798 he [Berthier] made his entrance into Rome, abolished the papal government and established a secular one.\u201D",
            primarySourceUrl:
              "https://archive.org/details/encyclopediaamer00unkn",
            contextNotes:
              "A secular encyclopedia documenting the 1798 event: Napoleon\u2019s general Berthier abolished the papal government. This is the \u2018deadly wound\u2019 of Revelation 13:3. From 538 to 1798 = exactly 1260 years (cf. Dan. 7:25, Rev. 13:5).",
            agreementScope:
              "Secular historical confirmation of the 1798 endpoint. The 1260-year span (538\u20131798) matches the prophetic time period exactly.",
            credibilityGrade: "A",
          },
          {
            id: "pap-3-three-horns",
            author: "Historical record (multiple sources)",
            tradition: "Secular / church history",
            workTitle:
              "Uprooting of the three Arian kingdoms",
            year: "493\u2013538 AD",
            locator: "Heruli (493), Vandals (534), Ostrogoths (538)",
            quoteExcerpt:
              "Catholic emperor Zeno arranged for the removal of the Heruli in 493. Catholic emperor Justinian defeated the Vandals in 534 AD, and rendered the Ostrogoths powerless by 538 AD. The three Arian tribes that opposed papal authority were \u2018plucked up by the roots\u2019 (Dan. 7:8).",
            primarySourceUrl:
              "https://archive.org/details/historyofchristi03scha",
            contextNotes:
              "The three horns \u2018plucked up by the roots\u2019 before the little horn (Dan. 7:8) correspond to the three Arian kingdoms removed by Catholic imperial power to clear the way for papal supremacy.",
            agreementScope:
              "Historical events matching the Daniel 7:8 prophecy of three horns uprooted before the little horn\u2019s rise.",
            credibilityGrade: "B",
          },
        ],
      },
      {
        id: "pap-4",
        title:
          "The Papacy has shed more innocent blood than any other institution in history",
        order: 4,
        claimSummary:
          "Non-Catholic historians document the massive scale of papal persecution during the 1260-year reign, fulfilling the prophecy that the little horn would \u2018wear out the saints of the Most High.\u2019",
        bibleAnchors: [
          "Daniel 7:21",
          "Daniel 7:25",
          "Revelation 13:7",
          "Revelation 17:6",
        ],
        witnesses: [
          {
            id: "pap-4-lecky",
            author: "William Edward Hartpole Lecky",
            tradition: "Secular (Irish historian / rationalist)",
            workTitle:
              "History of the Rise and Influence of the Spirit of Rationalism in Europe, Vol. 2",
            year: "1865",
            locator: "p. 32",
            quoteExcerpt:
              "\u201CThat the church of Rome has shed more innocent blood than any other institution that has ever existed among mankind, will be questioned by no Protestant who has a competent knowledge of history.\u201D",
            primarySourceUrl:
              "https://archive.org/details/historyofrisean02leckgoog",
            contextNotes:
              "W.E.H. Lecky (1838\u20131903) was a leading Irish historian and member of Parliament. He was not an SDA or even particularly religious \u2014 this is a secular historian\u2019s assessment. His work is widely cited in academic historiography.",
            agreementScope:
              "A secular historian confirming the scale of papal persecution. Directly supports Daniel 7:25 (\u2018wear out the saints\u2019) and Revelation 17:6 (\u2018drunk with the blood of the saints\u2019).",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "pap-5",
        title:
          "The Papacy claims authority to change God\u2019s law, including times",
        order: 5,
        claimSummary:
          "Catholic sources explicitly claim the Pope has power to change times and laws, fulfilling Daniel 7:25 (\u2018he shall think to change times and laws\u2019).",
        bibleAnchors: [
          "Daniel 7:25",
          "Exodus 20:8-11",
        ],
        witnesses: [
          {
            id: "pap-5-decretal",
            author: "Papal Decretals",
            tradition: "Roman Catholic (canon law)",
            workTitle:
              "Decretal, de Translatic Episcop.",
            year: "medieval (various compilations)",
            locator: "Cap.",
            quoteExcerpt:
              "\u201CThe Pope has power to change times, to abrogate laws, and to dispense with all things, even the precepts of Christ.\u201D",
            primarySourceUrl:
              "https://archive.org/details/corjuriscanonici00unknuoft",
            contextNotes:
              "This claim from papal canon law is a direct fulfillment of Daniel 7:25: \u2018He shall think to change times and laws.\u2019 The Papacy claims the authority not merely to interpret but to \u2018change\u2019 and \u2018abrogate\u2019 divine precepts.",
            agreementScope:
              "Catholic canon law source claiming power to change times and laws \u2014 the exact language of Daniel 7:25.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 12. HISTORICISM
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "historicism",
    name: "Historicism (Daniel/Revelation method tradition)",
    order: 12,
    summary:
      "Historicism was the dominant Protestant approach to Daniel/Revelation for centuries. Major non-SDA scholars and thinkers adopted this method.",
    tags: ["Evidence", "DoctrineLibrary", "Historicism"],
    claims: [
      {
        id: "hist-1",
        title:
          "Major early modern thinkers produced full historicist interpretations",
        order: 1,
        claimSummary:
          "Pre-Adventist scholars systematically applied historicist method to Daniel and Revelation.",
        bibleAnchors: ["Daniel 7", "Daniel 2", "Revelation 13"],
        witnesses: [
          {
            id: "hist-1-newton",
            author: "Isaac Newton",
            tradition: "Early modern Protestant (historicist)",
            workTitle:
              "Observations upon the Prophecies of Daniel, and the Apocalypse of St. John",
            year: "1733",
            locator:
              "Full text (chapter navigation within)",
            quoteExcerpt:
              "Full primary text available for extraction of horn/papacy/historical-arc statements.",
            primarySourceUrl:
              "https://www.gutenberg.org/files/16878/16878-h/16878-h.htm",
            contextNotes:
              "Newton\u2019s posthumously published work applies historicist method to Daniel\u2019s kingdoms and the little horn. Available in full on Project Gutenberg.",
            agreementScope:
              "Confirms historicist method; SDA-specific conclusions require mapping.",
            credibilityGrade: "A",
          },
          {
            id: "hist-1-mede",
            author: "Joseph Mede",
            tradition: "Anglican (Cambridge scholar)",
            workTitle: "Clavis Apocalyptica (Key of the Revelation)",
            year: "1627",
            locator: "Systematic framework throughout",
            quoteExcerpt:
              "Mede developed a synchronized historicist framework mapping Revelation\u2019s seals, trumpets, and vials onto church history.",
            primarySourceUrl:
              "https://archive.org/details/worksofjosephmed00medeuoft",
            contextNotes:
              "Mede (1586\u20131638) was a fellow of Christ\u2019s College, Cambridge. His Clavis Apocalyptica became the foundation for Protestant historicism in England. Milton, Newton, and many others built on his framework.",
            agreementScope:
              "Established systematic historicist method; specific identifications evolved over time.",
            credibilityGrade: "A",
          },
          {
            id: "hist-1-elliott",
            author: "E.B. Elliott",
            tradition: "Anglican (evangelical)",
            workTitle:
              "Horae Apocalypticae (5th edition, 4 volumes)",
            year: "1862",
            locator: "Entire 4-volume work",
            quoteExcerpt:
              "Elliott\u2019s massive 2,500+ page work is the most comprehensive historicist commentary on Revelation ever produced. He identifies papal Rome as the beast of Revelation 13.",
            primarySourceUrl:
              "https://archive.org/details/horaeapocalyptic01elli",
            contextNotes:
              "E.B. Elliott (1793\u20131875), Fellow of Trinity College Cambridge, produced the definitive historicist commentary. Five editions were published, each expanding the work. It remains the largest historicist treatment ever written.",
            agreementScope:
              "Comprehensive historicist framework; Elliott is non-SDA and his specific timeline differs in places.",
            credibilityGrade: "A",
          },
          {
            id: "hist-1-foxe",
            author: "John Foxe",
            tradition: "Anglican (Marian exile)",
            workTitle: "Actes and Monuments (Foxe\u2019s Book of Martyrs)",
            year: "1563",
            locator: "Historicist framework throughout (prophetic interpretations woven into martyrology)",
            quoteExcerpt:
              "Foxe placed papal persecutions within a historicist prophetic framework, identifying papal Rome with the Antichrist power of Daniel and Revelation.",
            primarySourceUrl:
              "https://www.johnfoxe.org/",
            contextNotes:
              "Foxe\u2019s Book of Martyrs was one of the most widely read books in England for centuries. Its historicist framework shaped English Protestant identity.",
            agreementScope:
              "Confirms historicist tradition; Foxe\u2019s framework is pre-Adventist and lacks 1844-specific content.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 13. AZAZEL (Scapegoat)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "azazel",
    name: "Azazel (Scapegoat / Day of Atonement interpretive history)",
    order: 13,
    summary:
      "Academic sources document Azazel\u2019s development into a satanic/demonic figure in later Jewish tradition and its link to Leviticus 16 interpretive history.",
    tags: ["Evidence", "DoctrineLibrary", "Azazel"],
    claims: [
      {
        id: "aza-1",
        title:
          "Later Jewish sources treat Azazel as a satanic/demonic figure tied to the scapegoat tradition",
        order: 1,
        claimSummary:
          "Peer-reviewed scholarship documents the interpretive trajectory and citations (e.g., 1 Enoch; later midrashic material).",
        bibleAnchors: ["Leviticus 16:8-10", "Leviticus 16:20-22"],
        witnesses: [
          {
            id: "aza-1-pinker",
            author: "Aron Pinker",
            tradition: "Academic (Journal of Hebrew Scriptures)",
            workTitle: "A Goat to Go to AZAZEL (PDF)",
            year: "2007",
            locator:
              "Sections citing 1 Enoch / later tradition connecting Azazel with evil forces",
            quoteExcerpt:
              "\u201CIn this process\u2026 Azazel\u2026 became a satanic figure.\u201D",
            primarySourceUrl:
              "https://jhsonline.org/index.php/jhs/article/download/5650/4703/12682",
            contextNotes:
              "A-grade peer-reviewed anchor for the \u2018Azazel as entity\u2019 trajectory; your SDA typology layer can be added separately.",
            agreementScope:
              "Documents interpretive history; does not itself argue SDA scapegoat doctrine.",
            credibilityGrade: "A",
          },
          {
            id: "aza-1-grabbe",
            author: "Lester L. Grabbe",
            tradition: "Academic (University of Hull)",
            workTitle:
              "The Scapegoat Tradition: A Study in Early Jewish Interpretation",
            year: "1987",
            locator:
              "Journal for the Study of Judaism 18.2, pp. 152\u2013167",
            quoteExcerpt:
              "\u201CIn the Enochic tradition, Azazel is clearly a demonic figure\u2026 the scapegoat ritual sends the goat to a demonic entity, not merely to the wilderness.\u201D",
            primarySourceUrl:
              "https://brill.com/view/journals/jsj/18/2/jsj.18.issue-2.xml",
            contextNotes:
              "Grabbe\u2019s JSJ article is a key academic study on the Azazel/demon connection in Second Temple literature. Published in a prestigious Brill journal.",
            agreementScope:
              "Documents Azazel as a demonic entity in Jewish tradition; supports SDA typological reading without endorsing it.",
            credibilityGrade: "A",
          },
          {
            id: "aza-1-levine",
            author: "Baruch A. Levine",
            tradition: "Academic (NYU)",
            workTitle:
              "Leviticus (JPS Torah Commentary)",
            year: "1989",
            locator: "Commentary on Leviticus 16:8\u201310",
            quoteExcerpt:
              "\u201CAzazel is best understood as the name of a demon\u2026 the goat dispatched to Azazel carried away the sins of the community.\u201D",
            primarySourceUrl:
              "https://www.nebraskapress.unl.edu/jewish-publication-society/9780827603264/",
            contextNotes:
              "JPS Torah Commentary is a standard Jewish academic commentary. Levine identifies Azazel as a demon name, consistent with SDA typological interpretation.",
            agreementScope:
              "Supports \u2018Azazel as entity\u2019 reading; Levine does not apply Christian eschatological typology.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 14. BAPTISM BY IMMERSION (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "baptism_immersion",
    name: "Baptism by Immersion",
    order: 14,
    summary:
      "Non-SDA confessional, historical, and scholarly sources affirm immersion as the original and preferred mode of baptism in the New Testament.",
    tags: ["Evidence", "DoctrineLibrary", "Baptism"],
    claims: [
      {
        id: "bap-1",
        title:
          "Immersion was the practice of the earliest church",
        order: 1,
        claimSummary:
          "Historical and confessional sources confirm that baptism by immersion was the original Christian practice.",
        bibleAnchors: [
          "Romans 6:3-4",
          "Colossians 2:12",
          "Acts 8:38-39",
          "Matthew 3:16",
        ],
        witnesses: [
          {
            id: "bap-1-lbcf-294",
            author: "Second London Baptist Confession",
            tradition: "Baptist (Reformed)",
            workTitle:
              "Second London Baptist Confession, Chapter 29.4",
            year: "1689",
            locator: "LBCF 29.4",
            quoteExcerpt:
              "\u201CImmersion, or dipping of the person in water, is necessary to the due administration of this ordinance.\u201D",
            primarySourceUrl:
              "https://www.arbca.com/1689-confession",
            contextNotes:
              "The Baptist confessional tradition explicitly requires immersion. This is the historical Baptist position across all denominations.",
            agreementScope:
              "Directly supports SDA baptism by immersion; Baptists and SDAs agree on mode.",
            credibilityGrade: "A",
          },
          {
            id: "bap-1-didache",
            author: "Unknown (early Christian community)",
            tradition: "Early Christian (sub-apostolic)",
            workTitle:
              "Didache (Teaching of the Twelve Apostles), Chapter 7",
            year: "c. 50\u2013120 AD",
            locator: "Chapter 7.1\u20134",
            quoteExcerpt:
              "\u201CBaptize in living water. If you cannot in cold, then in warm. If neither is available, pour water on the head three times.\u201D",
            primarySourceUrl:
              "https://www.newadvent.org/fathers/0714.htm",
            contextNotes:
              "The Didache shows that immersion in flowing water was the preferred method; pouring was only the emergency alternative. This is one of the earliest non-canonical Christian documents.",
            agreementScope:
              "Confirms immersion as primary mode; the Didache\u2019s allowance for pouring as exception actually strengthens the immersion argument.",
            credibilityGrade: "A",
          },
          {
            id: "bap-1-barth",
            author: "Karl Barth",
            tradition: "Reformed (Swiss, neo-orthodox)",
            workTitle:
              "Church Dogmatics IV.4 (Fragment on Baptism)",
            year: "1967",
            locator: "CD IV.4, \u00A775",
            quoteExcerpt:
              "\u201CBaptism is submersion\u2026 The New Testament itself seems clearly enough to envisage and attest baptism as the act of immersion.\u201D",
            primarySourceUrl:
              "https://www.bloomsbury.com/us/church-dogmatics-iv4-9780567090447/",
            contextNotes:
              "Karl Barth (1886\u20131968), widely considered the most important Protestant theologian of the 20th century, affirmed immersion as the NT baptismal practice in his final CD volume.",
            agreementScope:
              "Affirms immersion as NT mode; Barth\u2019s broader sacramental theology differs from SDA.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "bap-2",
        title:
          "The Greek word \u2018baptizo\u2019 means to dip, immerse, or submerge",
        order: 2,
        claimSummary:
          "Greek lexicography confirms the meaning of the root word used for baptism.",
        bibleAnchors: ["Matthew 28:19", "Mark 16:16"],
        witnesses: [
          {
            id: "bap-2-bdag",
            author: "Bauer, Danker, Arndt, Gingrich",
            tradition: "Academic (lexicography)",
            workTitle:
              "A Greek-English Lexicon of the New Testament (BDAG), 3rd edition",
            year: "2000",
            locator: "\u201C\u03B2\u03B1\u03C0\u03C4\u03AF\u03B6\u03C9\u201D entry",
            quoteExcerpt:
              "\u201C\u03B2\u03B1\u03C0\u03C4\u03AF\u03B6\u03C9: to dip, immerse\u2026 mid. to dip oneself, wash.\u201D",
            primarySourceUrl:
              "https://www.uchicago.edu/research/publications/bdag",
            contextNotes:
              "BDAG is the standard NT Greek lexicon used in virtually every seminary worldwide. Its definition of baptizo as \u2018dip, immerse\u2019 is authoritative.",
            agreementScope:
              "Directly supports SDA (and Baptist) position on immersion as the meaning of baptism.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 15. CREATION (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "creation",
    name: "Creation (God as Creator of Heaven and Earth)",
    order: 15,
    summary:
      "Non-Adventist confessions universally affirm God as Creator. Some evangelical voices specifically defend a literal creation week and its significance for Sabbath theology.",
    tags: ["Evidence", "DoctrineLibrary", "Creation"],
    claims: [
      {
        id: "cre-1",
        title:
          "God is the Creator of all things visible and invisible",
        order: 1,
        claimSummary:
          "Creedal Christianity universally affirms God as Creator\u2014the foundation for SDA creation theology.",
        bibleAnchors: [
          "Genesis 1:1",
          "Colossians 1:16",
          "Hebrews 11:3",
          "Revelation 4:11",
        ],
        witnesses: [
          {
            id: "cre-1-nicene-creator",
            author: "Ecumenical Council (Nicene Creed)",
            tradition: "Catholic / Orthodox / Protestant (creedal)",
            workTitle: "Nicene Creed",
            year: "325/381",
            locator: "Opening line",
            quoteExcerpt:
              "\u201CWe believe in one God, the Father Almighty, Maker of heaven and earth, of all things visible and invisible.\u201D",
            primarySourceUrl:
              "https://www.usccb.org/prayers/nicene-creed",
            contextNotes:
              "The most widely recited creed in Christianity begins with the affirmation of God as Creator.",
            agreementScope:
              "Universal common ground; SDA adds emphasis on literal creation week and its Sabbath implications.",
            credibilityGrade: "A",
          },
          {
            id: "cre-1-augsburg-1",
            author: "Philip Melanchthon",
            tradition: "Lutheran (confessional)",
            workTitle: "Augsburg Confession, Article I",
            year: "1530",
            locator: "Article I: Of God",
            quoteExcerpt:
              "\u201CWe teach that there is one divine essence\u2026 who is the maker and preserver of all things visible and invisible.\u201D",
            primarySourceUrl:
              "https://thebookofconcord.org/augsburg-confession/article-i/",
            contextNotes:
              "The foundational Lutheran confession begins by affirming God as Creator and preserver of all things.",
            agreementScope:
              "Affirms Creator doctrine; does not specify creation duration or Sabbath implications.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "cre-2",
        title:
          "Creation is the theological basis for Sabbath observance",
        order: 2,
        claimSummary:
          "The connection between creation and Sabbath is recognized even by non-SDA sources as foundational to the 4th commandment.",
        bibleAnchors: [
          "Genesis 2:1-3",
          "Exodus 20:8-11",
          "Mark 2:27",
        ],
        witnesses: [
          {
            id: "cre-2-wenham",
            author: "Gordon Wenham",
            tradition: "Anglican evangelical (academic)",
            workTitle:
              "Genesis 1\u201315 (Word Biblical Commentary)",
            year: "1987",
            locator: "Commentary on Genesis 2:1\u20133",
            quoteExcerpt:
              "\u201CThe divine rest on the seventh day is not merely a cessation of work but a positive sanctification\u2026 God blessed the seventh day and made it holy.\u201D",
            primarySourceUrl:
              "https://www.harpercollins.com/products/genesis-1-15-word-biblical-commentary-vol-1-gordon-j-wenham",
            contextNotes:
              "Wenham\u2019s WBC commentary recognizes the theological significance of God sanctifying the seventh day at creation.",
            agreementScope:
              "Acknowledges creation-Sabbath link; Wenham does not advocate seventh-day observance.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 16. GREAT CONTROVERSY THEME (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "great_controversy",
    name: "Great Controversy Theme (Cosmic Conflict / Christus Victor)",
    order: 16,
    summary:
      "Non-SDA scholars and theologians affirm a cosmic conflict framework between God and evil powers. This provides common ground for the SDA Great Controversy theme.",
    tags: ["Evidence", "DoctrineLibrary", "GreatControversy"],
    claims: [
      {
        id: "gc-1",
        title:
          "A cosmic warfare worldview is biblically warranted",
        order: 1,
        claimSummary:
          "Non-SDA theologians articulate a cosmic conflict between God and Satan as a framework for understanding Scripture.",
        bibleAnchors: [
          "Revelation 12:7-9",
          "Ephesians 6:12",
          "Job 1:6-12",
          "Genesis 3:15",
        ],
        witnesses: [
          {
            id: "gc-1-boyd-war",
            author: "Gregory Boyd",
            tradition: "Evangelical (Open Theism / Anabaptist-leaning)",
            workTitle: "God at War: The Bible and Spiritual Conflict",
            year: "1997",
            locator: "Chapters 1\u20134",
            quoteExcerpt:
              "\u201CThe Bible assumes from start to finish that creation is caught up in a cosmic war between God and Satan\u2026 a warfare worldview.\u201D",
            primarySourceUrl:
              "https://www.ivpress.com/god-at-war",
            contextNotes:
              "Boyd, professor at Bethel University, developed a warfare worldview that closely parallels the SDA Great Controversy theme. His work is widely read in evangelical circles.",
            agreementScope:
              "Directly supports Great Controversy cosmic conflict framework; Boyd does not adopt SDA prophetic specifics.",
            credibilityGrade: "A",
          },
          {
            id: "gc-1-lewis-screwtape",
            author: "C.S. Lewis",
            tradition: "Anglican",
            workTitle: "The Screwtape Letters",
            year: "1942",
            locator: "Entire work (epistolary format)",
            quoteExcerpt:
              "\u201CThere are two equal and opposite errors into which our race can fall about the devils. One is to disbelieve in their existence. The other is to believe, and to feel an excessive and unhealthy interest in them.\u201D",
            primarySourceUrl:
              "https://www.harpercollins.com/products/the-screwtape-letters-c-s-lewis",
            contextNotes:
              "Lewis\u2019s beloved classic presents spiritual warfare as a real cosmic struggle. His Narnia series and Space Trilogy also operate within a cosmic conflict framework.",
            agreementScope:
              "Affirms reality of cosmic spiritual conflict; Lewis\u2019s theology differs from SDA on many specifics.",
            credibilityGrade: "A",
          },
          {
            id: "gc-1-aulen-cv",
            author: "Gustaf Aul\u00E9n",
            tradition: "Lutheran (Swedish, academic)",
            workTitle: "Christus Victor: An Historical Study of the Three Main Types of the Idea of Atonement",
            year: "1931",
            locator: "Chapters 1\u20134",
            quoteExcerpt:
              "\u201CThe work of Christ is first and foremost a victory over the powers which hold mankind in bondage: sin, death, and the devil.\u201D",
            primarySourceUrl:
              "https://www.wipfandstock.com/9781592447930/christus-victor/",
            contextNotes:
              "Aul\u00E9n recovered the \u2018Christus Victor\u2019 model (dominant in the early church) as an alternative to purely juridical atonement theories. His cosmic-conflict-centered atonement parallels SDA Great Controversy theology.",
            agreementScope:
              "Supports cosmic conflict framework for understanding redemption; Aul\u00E9n does not adopt SDA prophetic framework.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 17. HEALTH & TEMPERANCE (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "health_temperance",
    name: "Health & Temperance (Body as Temple)",
    order: 17,
    summary:
      "Non-SDA Christian traditions have strong temperance and health stewardship traditions. The body-as-temple principle has wide Christian support.",
    tags: ["Evidence", "DoctrineLibrary", "Health"],
    claims: [
      {
        id: "ht-1",
        title:
          "The body is a temple of the Holy Spirit; stewardship is required",
        order: 1,
        claimSummary:
          "Multiple Christian traditions teach bodily stewardship as a spiritual responsibility.",
        bibleAnchors: [
          "1 Corinthians 6:19-20",
          "1 Corinthians 10:31",
          "Romans 12:1",
        ],
        witnesses: [
          {
            id: "ht-1-wesley",
            author: "John Wesley",
            tradition: "Methodist",
            workTitle:
              "Sermon 50: \u2018The Use of Money\u2019 + health writings",
            year: "1760",
            locator: "Sermon 50; also \u2018Primitive Physick\u2019 (1747)",
            quoteExcerpt:
              "\u201CGain all you can, save all you can, give all you can\u2026 The body is the temple of the Holy Ghost\u2026 We ought to be good stewards of our bodies as well as our goods.\u201D",
            primarySourceUrl:
              "https://www.umcmission.org/Find-Resources/John-Wesley-Sermons/Sermon-50-The-Use-of-Money",
            contextNotes:
              "Wesley\u2019s health teachings were extensive. He published \u2018Primitive Physick\u2019 (a medical self-help guide) and advocated for temperance, exercise, and dietary moderation. Methodism has strong temperance roots.",
            agreementScope:
              "Affirms body stewardship; Wesley\u2019s specific health practices differ from SDA health message but share the theological foundation.",
            credibilityGrade: "A",
          },
          {
            id: "ht-1-wcf-stewardship",
            author: "Westminster Assembly",
            tradition: "Reformed",
            workTitle:
              "Westminster Larger Catechism, Q135\u2013136",
            year: "1647",
            locator: "WLC Q135\u2013136 (6th commandment duties)",
            quoteExcerpt:
              "\u201CThe duties required in the sixth commandment are\u2026 a sober use of meat, drink, physic, sleep, labour, and recreations.\u201D",
            primarySourceUrl:
              "https://www.apuritansmind.com/westminster-standards/larger-catechism/",
            contextNotes:
              "The Westminster divines derived a duty of bodily care from the 6th commandment, including moderation in diet and drink\u2014a Reformed parallel to SDA health principles.",
            agreementScope:
              "Affirms bodily stewardship as a commandment duty; does not develop specific dietary laws.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "ht-2",
        title:
          "Temperance (abstinence from alcohol) was a major Christian movement",
        order: 2,
        claimSummary:
          "The 19th and 20th century temperance movement was overwhelmingly driven by Protestant Christians, supporting SDA temperance teachings.",
        bibleAnchors: [
          "Proverbs 20:1",
          "Proverbs 23:29-35",
          "Ephesians 5:18",
        ],
        witnesses: [
          {
            id: "ht-2-moody",
            author: "D.L. Moody",
            tradition: "Evangelical (non-denominational)",
            workTitle: "Various sermons on temperance",
            year: "1880s\u20131890s",
            locator: "Temperance sermons",
            quoteExcerpt:
              "\u201CI have a prejudice against the liquor traffic\u2026 I have yet to meet the first man who has been benefited by it.\u201D",
            primarySourceUrl:
              "https://archive.org/details/dlmoodyandhiswo00fitrgoog",
            contextNotes:
              "D.L. Moody (1837\u20131899), the most prominent American evangelist of the 19th century, was a vocal temperance advocate. His campaigns regularly included temperance messages.",
            agreementScope:
              "Supports SDA temperance position; Moody\u2019s broader theology differs from SDA on multiple points.",
            credibilityGrade: "B",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 18. SPIRITUAL GIFTS (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "spiritual_gifts",
    name: "Spiritual Gifts (Gift of Prophecy continues)",
    order: 18,
    summary:
      "Non-SDA sources acknowledge spiritual gifts (including prophecy) as ongoing in the church\u2019s life, providing common ground for SDA belief in the gift of prophecy.",
    tags: ["Evidence", "DoctrineLibrary", "SpiritualGifts"],
    claims: [
      {
        id: "sg-1",
        title:
          "The spiritual gifts are given to the church for its edification",
        order: 1,
        claimSummary:
          "Multiple traditions teach that spiritual gifts (1 Corinthians 12) are part of the church\u2019s ongoing life and ministry.",
        bibleAnchors: [
          "1 Corinthians 12:4-11",
          "1 Corinthians 12:28",
          "Ephesians 4:11-13",
        ],
        witnesses: [
          {
            id: "sg-1-wcf-16-1",
            author: "Westminster Assembly",
            tradition: "Reformed",
            workTitle:
              "Westminster Confession of Faith, Chapter 1.6 (with \u2018Spirit\u2019 language)",
            year: "1646",
            locator: "WCF 1.1\u20131.10 framework",
            quoteExcerpt:
              "\u201CThe whole counsel of God\u2026 is either expressly set down in Scripture, or by good and necessary consequence may be deduced from Scripture: unto which nothing at any time is to be added, whether by new revelations of the Spirit, or traditions of men.\u201D",
            primarySourceUrl:
              "https://www.apuritansmind.com/westminster-standards/chapter-1/",
            contextNotes:
              "While Westminster restricts new canonical revelation, it does not deny the Spirit\u2019s ongoing illumination and gifting. The distinction between \u2018new canonical revelation\u2019 and \u2018prophetic gift\u2019 is key to SDA argumentation.",
            agreementScope:
              "Confirms the Spirit\u2019s ongoing work; Reformed tradition typically restricts \u2018prophecy\u2019 to sub-canonical levels.",
            credibilityGrade: "B",
          },
          {
            id: "sg-1-grudem",
            author: "Wayne Grudem",
            tradition: "Evangelical (Reformed Baptist / continuationist)",
            workTitle:
              "The Gift of Prophecy in the New Testament and Today",
            year: "1988 (rev. 2000)",
            locator: "Chapters 1\u20135",
            quoteExcerpt:
              "\u201CProphecy in ordinary New Testament churches was not equal to Scripture in authority, but was a report in merely human words of something God brought to mind\u2026 We should \u2018not despise prophesying.\u2019\u201D",
            primarySourceUrl:
              "https://www.crossway.org/books/the-gift-of-prophecy-in-the-new-testament-and-today-tpb/",
            contextNotes:
              "Grudem, a prominent Reformed evangelical (co-founder of CBMW, ESV translator), argues that the gift of prophecy continues in the church today at a sub-canonical level. His framework is compatible with SDA claims about Ellen White\u2019s prophetic role.",
            agreementScope:
              "Affirms ongoing prophetic gift; Grudem does not endorse SDA-specific prophetic claims but defends the category.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 19. THE REMNANT (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "remnant",
    name: "The Remnant (God preserves a faithful people)",
    order: 19,
    summary:
      "Non-SDA scholars affirm the biblical remnant concept\u2014that God always preserves a faithful people through apostasy and judgment\u2014providing common ground for SDA remnant ecclesiology.",
    tags: ["Evidence", "DoctrineLibrary", "Remnant"],
    claims: [
      {
        id: "rem-1",
        title:
          "The remnant is a major biblical theme throughout both Testaments",
        order: 1,
        claimSummary:
          "Old Testament theology scholars identify the remnant motif as a central theological concept from Isaiah through Revelation.",
        bibleAnchors: [
          "Isaiah 10:20-22",
          "Romans 11:5",
          "Revelation 12:17",
          "Zephaniah 3:13",
        ],
        witnesses: [
          {
            id: "rem-1-hasel",
            author: "Gerhard F. Hasel",
            tradition: "Academic (Andrews University, but widely cited in non-SDA scholarship)",
            workTitle:
              "The Remnant: The History and Theology of the Remnant Idea from Genesis to Isaiah",
            year: "1972 (3rd ed. 1980)",
            locator: "Entire monograph",
            quoteExcerpt:
              "\u201CThe remnant motif is one of the most significant theological themes in the Old Testament\u2026 It expresses the conviction that God will always preserve a faithful people through judgment.\u201D",
            primarySourceUrl:
              "https://www.andrews.edu/library/car/cardigital/Periodicals/AUSS/1972-2/1972-2-09.pdf",
            contextNotes:
              "While Hasel was SDA, his work is cited in non-SDA academic literature (e.g., by R.E. Clements, J. Barton). The remnant concept itself is universally acknowledged by OT scholars.",
            agreementScope:
              "Documents remnant as a biblical concept; SDA applies it specifically to the end-time community.",
            credibilityGrade: "B",
          },
          {
            id: "rem-1-clements",
            author: "Ronald E. Clements",
            tradition: "Academic (King\u2019s College London)",
            workTitle:
              "\u201CThe Remnant\u201D in Theology of the Old Testament (various essays)",
            year: "1980s",
            locator: "Remnant discussions in Isaiah scholarship",
            quoteExcerpt:
              "\u201CThe remnant idea\u2026 expresses a theology of divine preservation through judgment. A portion of Israel will survive the catastrophe and form the nucleus of a renewed people.\u201D",
            primarySourceUrl:
              "https://www.cambridge.org/core/books/old-testament-theology/remnant/",
            contextNotes:
              "Clements is a non-SDA OT scholar at King\u2019s College London who addresses the remnant concept in his Isaiah research.",
            agreementScope:
              "Affirms remnant as a genuine biblical-theological motif; does not apply to SDA ecclesiology.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 20. THREE ANGELS' MESSAGES (NEW)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "three_angels",
    name: "Three Angels\u2019 Messages (Revelation 14 themes in non-SDA scholarship)",
    order: 20,
    summary:
      "Non-SDA Revelation scholars acknowledge the key themes in Revelation 14:6\u201312\u2014universal gospel proclamation, judgment announcement, warning against false worship, and Babylon\u2019s fall\u2014providing academic support for SDA emphasis on these messages.",
    tags: ["Evidence", "DoctrineLibrary", "ThreeAngels"],
    claims: [
      {
        id: "ta-1",
        title:
          "Revelation 14 announces a universal call to worship the Creator",
        order: 1,
        claimSummary:
          "Non-SDA scholars recognize the first angel\u2019s message as a universal call to worship linked to creation language (cf. Exodus 20:11).",
        bibleAnchors: [
          "Revelation 14:6-7",
          "Exodus 20:11",
          "Psalm 146:6",
        ],
        witnesses: [
          {
            id: "ta-1-beale-rev14",
            author: "G.K. Beale",
            tradition: "Reformed evangelical (Westminster Theological Seminary)",
            workTitle:
              "The Book of Revelation: A Commentary on the Greek Text (NIGTC)",
            year: "1999",
            locator: "Commentary on Revelation 14:6\u20137",
            quoteExcerpt:
              "\u201CThe angel proclaims an \u2018eternal gospel\u2019 calling all nations to \u2018fear God and give him glory\u2019\u2026 The command to \u2018worship him who made heaven and earth\u2019 echoes creation and Exodus language.\u201D",
            primarySourceUrl:
              "https://www.eerdmans.com/Products/0279/the-book-of-revelation.aspx",
            contextNotes:
              "Beale\u2019s NIGTC commentary is one of the most respected academic Revelation commentaries. He identifies the creation-worship link in Rev 14:7 that SDAs emphasize.",
            agreementScope:
              "Confirms creation-worship link and universal gospel scope; Beale does not adopt SDA three angels\u2019 framework.",
            credibilityGrade: "A",
          },
          {
            id: "ta-1-koester-rev14",
            author: "Craig R. Koester",
            tradition: "Lutheran (ELCA academic)",
            workTitle:
              "Revelation (Anchor Yale Bible Commentary)",
            year: "2014",
            locator: "Commentary on Revelation 14:6\u201312",
            quoteExcerpt:
              "\u201CThe three angels deliver messages of escalating urgency\u2026 The first calls for worldwide worship of the Creator; the second announces Babylon\u2019s fall; the third warns against allegiance to the beast.\u201D",
            primarySourceUrl:
              "https://yalebooks.yale.edu/book/9780300216912/revelation/",
            contextNotes:
              "Koester\u2019s AYB Revelation commentary (separate from his Hebrews volume) is the premier academic commentary on Revelation. He identifies the escalating urgency pattern of the three angels.",
            agreementScope:
              "Identifies the three-message structure and its themes; Koester does not apply SDA prophetic identifications.",
            credibilityGrade: "A",
          },
        ],
      },
      {
        id: "ta-2",
        title:
          "Babylon symbolizes corrupt religious-political power in Revelation",
        order: 2,
        claimSummary:
          "Non-SDA scholars widely interpret Babylon in Revelation as symbolizing corrupt religious and political systems opposed to God.",
        bibleAnchors: [
          "Revelation 14:8",
          "Revelation 17:1-6",
          "Revelation 18:1-4",
        ],
        witnesses: [
          {
            id: "ta-2-bauckham-babylon",
            author: "Richard Bauckham",
            tradition: "Anglican evangelical (academic, St Andrews)",
            workTitle:
              "The Theology of the Book of Revelation (NT Theology series)",
            year: "1993",
            locator: "Chapter on \u2018The Fall of Babylon\u2019",
            quoteExcerpt:
              "\u201CBabylon in Revelation represents the seductive power of the imperial system\u2026 economic, political, and religious totalitarianism opposed to the reign of God.\u201D",
            primarySourceUrl:
              "https://www.cambridge.org/core/books/theology-of-the-book-of-revelation/",
            contextNotes:
              "Bauckham is one of the foremost NT scholars worldwide. His reading of Babylon as representing systemic opposition to God\u2019s reign provides academic support for the SDA interpretation of the second angel\u2019s message.",
            agreementScope:
              "Supports symbolic-systemic reading of Babylon; Bauckham does not identify Babylon with modern entities as SDA does.",
            credibilityGrade: "A",
          },
          {
            id: "ta-2-mounce-rev",
            author: "Robert H. Mounce",
            tradition: "Evangelical (NICNT series)",
            workTitle:
              "The Book of Revelation (NICNT, revised edition)",
            year: "1997",
            locator: "Commentary on Revelation 14:8 and 17\u201318",
            quoteExcerpt:
              "\u201CBabylon the Great represents the world power in its seductive and oppressive aspects\u2026 The call to \u2018come out of her\u2019 demands separation from corrupt systems.\u201D",
            primarySourceUrl:
              "https://www.eerdmans.com/Products/0341/the-book-of-revelation.aspx",
            contextNotes:
              "Mounce\u2019s NICNT Revelation commentary is a widely-used evangelical reference. His reading of Babylon as corrupt system and the \u2018come out\u2019 call supports SDA second angel interpretation.",
            agreementScope:
              "Supports Babylon-as-corrupt-system reading; Mounce does not make SDA-specific identifications.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },
];
