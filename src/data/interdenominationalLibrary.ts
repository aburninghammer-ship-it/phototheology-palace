// 3AM Inter-denominational Library — Doctrine Topics, Claims & Witnesses
// Full Library v1: topic -> claims -> witnesses with primary/credible links,
// short excerpts, locators, agreement-scope labels, and credibility grades.

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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

  {
    id: "sabbath",
    name: "Sabbath (Seventh-day wording preserved in catechesis)",
    order: 5,
    summary:
      "Even where practice varies, non-SDA catechesis preserves the 4th command\u2019s seventh-day wording and frames it as God\u2019s law.",
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
        ],
      },
    ],
  },

  {
    id: "heavenly_sanctuary",
    name: "Heavenly Sanctuary (Hebrews: true tabernacle / copies & heavenly things)",
    order: 6,
    summary:
      "Non-SDA evangelical resources affirm Hebrews\u2019 language about a heavenly reality with earthly copies/shadows.",
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
              "This page includes major translation renderings; pair with Hebrews pages in your next expansion pass.",
            agreementScope:
              "Affirms heavenly/earthly copy framework; not SDA 1844 timing.",
            credibilityGrade: "B",
          },
        ],
      },
    ],
  },

  {
    id: "daniel_814",
    name: "Daniel 8:14 (Sanctuary \u2018restored / properly restored\u2019 language)",
    order: 7,
    summary:
      "Non-SDA translation notes and reference tools acknowledge the Hebrew verb can carry \u2018restored/justified\u2019 senses beyond \u2018cleansed.\u2019",
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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

  {
    id: "annihilationism",
    name: "Final Punishment (Annihilationism / Conditionalism debates)",
    order: 10,
    summary:
      "Non-SDA evangelicals (minority view) argue against eternal conscious torment and for conditional immortality/ultimate destruction.",
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
        ],
      },
    ],
  },

  {
    id: "papacy",
    name: "Papacy / Antichrist (Reformation confessional witness)",
    order: 11,
    summary:
      "Key Reformation confessional sources explicitly identify the papacy with Antichrist (historical Protestant view).",
    tags: ["Evidence", "DoctrineLibrary", "Papacy"],
    claims: [
      {
        id: "pap-1",
        title:
          "A Reformation confession explicitly calls the pope \u2018the very Antichrist\u2019",
        order: 1,
        claimSummary:
          "Smalcald Articles (Book of Concord) state the identification directly.",
        bibleAnchors: ["2 Thessalonians 2:3-4", "Daniel 7"],
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
        ],
      },
    ],
  },

  {
    id: "historicism",
    name: "Historicism (Daniel/Revelation method tradition)",
    order: 12,
    summary:
      "Historicism was a major Protestant approach for centuries; Newton is a major non-SDA exemplar with a full primary text available.",
    tags: ["Evidence", "DoctrineLibrary", "Historicism"],
    claims: [
      {
        id: "hist-1",
        title:
          "A major early modern thinker produced a full historicist interpretation",
        order: 1,
        claimSummary:
          "Newton\u2019s work is a primary-source anchor showing historicist method outside Adventism.",
        bibleAnchors: ["Daniel 7", "Revelation 13"],
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
              "Use this as your \u2018A-grade\u2019 historicism anchor; then add extracted chapter quotes in v1.1.",
            agreementScope:
              "Confirms historicist method; SDA-specific conclusions require mapping.",
            credibilityGrade: "A",
          },
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },
];
