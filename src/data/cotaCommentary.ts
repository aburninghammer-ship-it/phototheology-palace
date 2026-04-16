// Conflict of the Ages Commentary with Great Controversy Conflict Tags
// Demonstration of the multi-layered exegetical engine

import { GCConflictTag } from "@/types/gcConflictTag";

export interface COTAParagraph {
  id: string;
  book: "patriarchs_prophets" | "prophets_kings" | "desire_ages" | "acts_apostles" | "great_controversy";
  chapter: number;
  paragraphNumber: number;
  egwText: string;

  // Paragraph type: theological analysis vs pure historical narrative
  paragraphType?: "theological" | "historical";

  // Scripture Commentary Layer (Optional for historical paragraphs)
  scriptureRefs?: string[];
  scriptureCommentary?: string;

  // PT Principle Funnel Layer (Optional for historical paragraphs)
  ptPrinciples?: {
    principle: string;
    explanation: string;
    application: string;
  }[];

  // Great Controversy Conflict Tag (SIGNATURE FEATURE)
  gcConflictTag: GCConflictTag;

  // Doctrinal Extraction Layer (Optional for pure narrative)
  doctrinesPresent?: string[];

  // Historical Context Layer (Phase 2)
  historicalContext?: {
    dateOfEvents: string;
    politicalPowers: string[];
    religiousClimate: string;
    propheticTimeline: string;
  };

  // Defense Mode Integration
  apologeticsImplications?: {
    doctrine: string;
    likelyAttacks: {
      opponent: string;
      attack: string;
      defense: string;
    }[];
  };
}

// ═══════════════════════════════════════════════════════════════════
// SAMPLE PARAGRAPHS FROM GREAT CONTROVERSY
// Demonstrating the GC Conflict Tag system
// ═══════════════════════════════════════════════════════════════════

export const SAMPLE_COTA_PARAGRAPHS: COTAParagraph[] = [
  {
    id: "gc-01-intro-001",
    book: "great_controversy",
    chapter: 1,
    paragraphNumber: 1,
    egwText:
      "Before the entrance of sin, Adam enjoyed open communion with his Maker; but since man separated himself from God by transgression, the human race has been cut off from this high privilege. By the plan of redemption, however, a way has been opened whereby the inhabitants of the earth may still have connection with heaven.",

    scriptureRefs: ["Genesis 3:8-24", "John 1:51", "Hebrews 1:14"],
    scriptureCommentary:
      "Genesis 3 records the immediate consequence of sin: Adam and Eve hiding from God's presence (v.8), followed by their expulsion from Eden (v.23-24). The broken communion is central to understanding the Great Controversy. John 1:51 promises the restoration of heaven-earth connection through Christ ('you shall see heaven open'). Hebrews 1:14 reveals angelic ministry as part of God's plan to maintain connection despite sin's separation.",

    ptPrinciples: [
      {
        principle: "Sanctuary Wall: God's dwelling with humanity",
        explanation:
          "The paragraph introduces the core sanctuary concept: God desires communion with His people. Eden was the first sanctuary. Sin broke that dwelling-together. The plan of redemption is fundamentally about God re-establishing His dwelling with humanity (culminating in Revelation 21:3 'the tabernacle of God is with men').",
        application:
          "Every worship service, every prayer, every Bible study is an act of sanctuary restoration — reconnecting what sin severed. We are not merely moral beings; we are covenant beings designed for communion with our Creator.",
      },
      {
        principle: "Gospel Floor: Redemption as foundational reality",
        explanation:
          "The 'plan of redemption' is not an afterthought but the bedrock upon which all hope rests. This paragraph establishes that the gospel is not peripheral but central — the way back to connection with heaven.",
        application:
          "Every doctrine, every command, every promise must be understood through the lens of redemption. Apart from the plan of salvation, all else collapses.",
      },
    ],

    gcConflictTag: {
      axis: "Light vs Darkness",
      battlefield: ["Mind", "Sanctuary", "Doctrine"],

      satanStrategy:
        "Sever humanity's connection with God through sin, creating a chasm that makes communion impossible. Convince humanity that the breach is permanent and that God is distant, unapproachable, or nonexistent.",

      godCounterStrategy:
        "Implement the 'plan of redemption' to restore heaven-earth connection despite sin. Maintain angelic ministry and providential care to demonstrate that God has not abandoned His creation. Point humanity toward Christ as the ladder reconnecting heaven and earth (Genesis 28:12; John 1:51).",

      deceptionType: ["False Security", "Spiritualism"],

      outcome: ["Light Preserved", "Crisis Point"],

      propheticWeight: 9,

      historicalPeriod: "Introduction — Setting the stage for all conflict",

      prophecyConnection:
        "This paragraph introduces the meta-narrative that Daniel and Revelation will unfold: the cosmic war over worship and communion with God. The 'plan of redemption' is what enables the sealed 144,000 (Rev 14) to maintain connection with heaven despite Babylon's attempts to sever it.",

      modernParallel:
        "In our hyper-connected digital age, people feel more isolated and cut off from transcendence than ever. The same temptation exists: to believe that God is distant, that prayer is futile, that the spiritual realm is inaccessible. The gospel counters this with the promise of real, ongoing communion through Christ.",

      defenseRelevance: [
        {
          opponent: "atheist",
          attackVector: "There is no spiritual realm; humans are material beings only, evolved without purpose.",
          defenseWeapon:
            "Genesis 3 and universal human longing for transcendence. Atheism cannot explain why humans universally seek meaning beyond survival. The 'God-shaped vacuum' is evidence of our design for communion.",
        },
        {
          opponent: "catholic",
          attackVector: "Connection with heaven requires the Church as mediator. Sola scriptura cuts believers off from sacramental grace.",
          defenseWeapon:
            "The plan of redemption centers on Christ as the sole mediator (1 Tim 2:5). Angels minister, but no human institution holds exclusive access. The veil was torn (Matt 27:51) — direct access secured.",
        },
      ],
    },

    doctrinesPresent: ["Sanctuary", "Fall of Man", "Plan of Salvation", "Angelic Ministry"],

    historicalContext: {
      dateOfEvents: "Eternal past to present",
      politicalPowers: ["N/A — Cosmic introduction"],
      religiousClimate: "Pre-Christian context of broken communion",
      propheticTimeline: "Foundation for all subsequent prophetic conflict",
    },

    apologeticsImplications: {
      doctrine: "Plan of Redemption as central to all theology",
      likelyAttacks: [
        {
          opponent: "Atheist",
          attack: "Redemption implies a broken relationship that never existed. Evolution shows humans as biological accidents, not fallen beings.",
          defense:
            "Universal moral consciousness and guilt point to broken relationship. Evolution cannot explain the categorical moral 'ought' humans experience. Only imago Dei + Fall explains human paradox (glory + depravity).",
        },
        {
          opponent: "Evangelical",
          attack: "SDAs overemphasize Ellen White's 'Great Controversy' narrative. Stick to Scripture alone.",
          defense:
            "The Great Controversy theme is biblically rooted: Job 1-2 (cosmic wager), Ezekiel 28 (Lucifer's fall), Revelation 12 (war in heaven), Ephesians 6 (spiritual warfare). Ellen White systematizes what Scripture already teaches.",
        },
      ],
    },
  },

  {
    id: "gc-25-reform-001",
    book: "great_controversy",
    chapter: 25,
    paragraphNumber: 12,
    egwText:
      "In the movements now in progress in the United States to secure for the institutions and usages of the church the support of the state, Protestants are following in the steps of papists. Nay, more, they are opening the door for the papacy to regain in Protestant America the supremacy which she has lost in the Old World.",

    scriptureRefs: ["Revelation 13:11-17", "Revelation 17:1-6", "2 Thessalonians 2:3-12"],
    scriptureCommentary:
      "Revelation 13:11-17 describes the beast from the earth (symbolic of the United States) speaking 'as a dragon' and causing the earth to worship the first beast (papacy). The enforcement of religious observance through state power (v.15-17) is the prophetic climax. Revelation 17 portrays church-state union as spiritual fornication — the harlot riding the beast. 2 Thessalonians 2 warns of apostasy where lawlessness masquerades as righteousness through deceptive signs.",

    ptPrinciples: [
      {
        principle: "Time-Prophecy Wall: Revelation 13 fulfillment",
        explanation:
          "This paragraph identifies the lamb-like beast of Revelation 13:11 as the United States. The 'speaking as a dragon' is interpreted as abandoning religious liberty principles and enforcing religious observance through civil law — classic union of church and state that characterized papal Rome.",
        application:
          "Prophetic interpretation is not merely academic. Understanding Revelation 13 shapes how believers engage politically. Support for religious freedom laws, opposition to Sunday legislation, and vigilance against church-state entanglement are prophetic imperatives.",
      },
      {
        principle: "Great Controversy Wall: Satan's final deception",
        explanation:
          "Satan's ultimate strategy is to use religious coercion to enforce false worship. The 'mark of the beast' (Rev 13:16-17) represents enforced apostasy. The United States, founded on liberty, will betray its own principles and become the enforcer of papal error.",
        application:
          "Liberty of conscience is a Great Controversy issue, not merely a political preference. When the state enforces religious practice, Satan wins a strategic victory. Believers must champion freedom even for those with whom they disagree.",
      },
    ],

    gcConflictTag: {
      axis: "Freedom vs Tyranny",
      battlefield: ["State", "Church", "Conscience", "Worship"],

      satanStrategy:
        "Co-opt Protestantism by leading it to abandon its foundational principle (sola scriptura and individual conscience) and instead seek state power to enforce religious observance. Use American nationalism and 'Christian nation' rhetoric to justify church-state union. Make persecution appear patriotic and righteous.",

      godCounterStrategy:
        "Preserve a remnant who will refuse state-enforced worship and remain loyal to biblical truth despite legal penalties. Use the very tyranny of the state to expose the true character of the beast system. Revelation 18:4 ('Come out of her, my people') will become the urgent call.",

      deceptionType: [
        "Counterfeit Authority",
        "Gradual Compromise",
        "Force & Coercion",
        "Tradition Over Scripture",
      ],

      outcome: ["Apostasy Deepens", "Crisis Point", "Remnant Emerges"],

      propheticWeight: 10,

      historicalPeriod: "Pre-Final Crisis (late 19th-21st century)",

      prophecyConnection:
        "Direct fulfillment of Revelation 13:11-17. The two-horned beast (United States) exercises 'all the authority of the first beast' (papacy) and enforces the mark of the beast. This is the climax of the time-prophecy wall — the final phase before Christ's return.",

      modernParallel:
        "Current movements to legislate Christian morality (abortion bans without conscience clauses, mandatory prayer in schools, etc.) are incremental steps toward church-state union. The rhetoric of 'reclaiming America for God' echoes papal Christendom logic. True reformation always champions freedom; apostasy always enforces conformity.",

      defenseRelevance: [
        {
          opponent: "evangelical",
          attackVector:
            "Christians should use political power to enforce God's law. America was founded as a Christian nation and should legislate biblical morality.",
          defenseWeapon:
            "Jesus' kingdom is 'not of this world' (John 18:36). Using state force to compel worship creates hypocrites, not disciples. Revelation 13 explicitly condemns religious coercion through state power.",
        },
        {
          opponent: "catholic",
          attackVector:
            "The Catholic Church rightly partners with the state for the common good. Religious liberty taken to extremes leads to moral chaos.",
          defenseWeapon:
            "History proves church-state union produces persecution, not piety. The Dark Ages, Inquisition, and St. Bartholomew's Day Massacre are fruits of that union. Revelation 17-18 condemns the harlot riding the beast.",
        },
        {
          opponent: "former-sda",
          attackVector:
            "Ellen White's warnings about America and Sunday laws are paranoid conspiracy theories that have not materialized after 100+ years.",
          defenseWeapon:
            "Prophecy operates on God's timeline, not ours. Daniel 8 took 2,300 years to fulfill. Current trends (Christian nationalism, erosion of separation of church/state) vindicate Ellen White's warnings as prescient, not paranoid.",
        },
      ],
    },

    doctrinesPresent: [
      "Prophecy (Revelation 13)",
      "Church-State Separation",
      "Religious Liberty",
      "Mark of the Beast",
      "Remnant",
    ],

    historicalContext: {
      dateOfEvents: "1888 (when written) → End Time",
      politicalPowers: ["United States", "Papacy", "Protestant Churches"],
      religiousClimate:
        "Late 19th-century America saw growing National Reform Association movement to amend U.S. Constitution to declare America a 'Christian nation.' Sunday law agitation was at its peak.",
      propheticTimeline:
        "Post-1844 (investigative judgment ongoing), pre-close of probation. Final movements are 'rapid ones' leading to enforcement of mark of beast.",
    },

    apologeticsImplications: {
      doctrine: "Religious Liberty and Revelation 13 prophecy",
      likelyAttacks: [
        {
          opponent: "Evangelical",
          attack:
            "SDAs are alarmist about America. Most Christians see political engagement as stewardship, not apostasy.",
          defense:
            "Stewardship ≠ coercion. Supporting candidates is different from legislating worship. Revelation 13:15-17 is explicit: enforcing religious observance (mark) on pain of economic exclusion or death is satanic, not godly.",
        },
        {
          opponent: "Catholic",
          attack:
            "SDAs unfairly demonize the Catholic Church. The papacy has been a force for good (hospitals, education, charity).",
          defense:
            "Condemning a system is not condemning individual Catholics. Revelation 18:4 ('come out of her, my people') implies God's people are in Babylon. The issue is the system's claim to change God's law (Dan 7:25) and enforce worship through state power.",
        },
      ],
    },
  },

  // Example of a HISTORICAL paragraph (no forced Scripture connections or PT principles)
  {
    id: "gc-07-luther-birth-001",
    book: "great_controversy",
    chapter: 7,
    paragraphNumber: 3,
    paragraphType: "historical",
    egwText:
      "Luther's parents, while untiring in labor and exposed to hardship and privation, were of strong and hopeful temperament, of sterling character and deep piety. They trained their children in the fear of God and in strict obedience. The father sometimes made use of severity; yet the children found their chief happiness in making their way from the schoolroom to the fields and the forest.",

    // No Scripture refs or commentary for pure historical narrative
    // No PT Principles - this is biographical detail

    gcConflictTag: {
      axis: "Light vs Darkness",
      battlefield: ["Mind", "Church"],

      satanStrategy:
        "Prevent God's chosen instrument (Luther) from ever being equipped for the Reformation. Attack through poverty, harsh discipline, fear-based religion, and discouragement in childhood to break his spirit before he can challenge Rome.",

      godCounterStrategy:
        "Providentially place Luther in a home of 'sterling character and deep piety' despite poverty. Use discipline to build resilience, not crush spirit. Balance hardship with hope ('hopeful temperament'). The very strictness that could have broken him becomes the backbone for standing before emperors.",

      deceptionType: ["Gradual Compromise", "Confusion & Division"],

      outcome: ["Light Preserved"],

      propheticWeight: 7,

      historicalPeriod: "1483 — Luther's birth and childhood in Eisleben/Mansfeld, Germany",

      prophecyConnection:
        "God preparing His instrument for the Reformation. Like Moses (raised in Pharaoh's court to later confront Pharaoh), Luther's upbringing — both hardship and piety — equipped him for the cosmic confrontation with papal Rome.",

      modernParallel:
        "God still uses difficult childhoods and strict upbringings to forge character. What Satan means for discouragement, God uses for steel. The generation most wounded by harshness may become the generation most equipped to stand against compromise.",

      defenseRelevance: [
        {
          opponent: "atheist",
          attackVector: "Luther's 'deep piety' was just medieval superstition. Religion was a crutch for poor, uneducated miners.",
          defenseWeapon:
            "Luther's parents combined rigorous work ethic with genuine faith — not escapism but integration. Their piety didn't make them passive; it made them resilient. Atheism cannot account for how this miner's son changed Western civilization.",
        },
        {
          opponent: "catholic",
          attackVector: "Luther's harsh upbringing and fear-based religion warped his theology. A balanced Catholic upbringing would have kept him from rebellion.",
          defenseWeapon:
            "Luther's parents were Catholic! The harshness and fear came from late medieval Catholicism's emphasis on purgatory, penance, and works. His reformation was precisely a response to that toxic environment, not a result of it.",
        },
      ],
    },

    // Doctrines are minimal for historical paragraphs - just context
    doctrinesPresent: ["Providence", "Character Development"],

    historicalContext: {
      dateOfEvents: "1483-1490s (Luther's childhood)",
      politicalPowers: ["Holy Roman Empire", "Saxony"],
      religiousClimate: "Late medieval Catholic Europe — fear of purgatory, works-based salvation, indulgence system dominant",
      propheticTimeline: "Pre-Reformation (Papal supremacy unchallenged, 1260-year prophecy still in progress)",
    },

    // Defense Mode Integration
    apologeticsImplications: {
      doctrine: "Providence in biographical detail",
      likelyAttacks: [
        {
          opponent: "Former SDA",
          attack: "Why does Ellen White spend paragraphs on Luther's childhood? This is hagiography, not theology.",
          defense:
            "Scripture itself includes biographical detail (Moses, David, Paul). God works through history and biography. Understanding Luther's formation helps us see God's hand in the Reformation — not hero worship, but providence.",
        },
        {
          opponent: "Catholic",
          attack: "Ellen White romanticizes Luther's upbringing to make him a hero. His parents were strict, fearful Catholics — hardly models of 'deep piety.'",
          defense:
            "Ellen White doesn't ignore the harshness ('severity'). She's highlighting that despite the system's errors, genuine faith existed in homes. Luther's parents' piety was real, even if their theology was incomplete. This shows God works through flawed systems to preserve light.",
        },
      ],
    },
  },
];
