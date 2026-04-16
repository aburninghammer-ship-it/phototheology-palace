/**
 * Sermon Knowledge Bank
 * This data helps Jeeves understand Phototheology's teaching approach,
 * sermon themes, and theological framework.
 */

export const SERMON_KNOWLEDGE_BANK = {
  title: "Phototheology Sermon & Teaching Knowledge Bank",
  description: "Core theological teachings and sermon content for AI reference",

  sermons: [
    {
      title: "I Unfriend You: Satan's Dehumanization Plot For the End Times",
      theme: "Dehumanization and the Great Controversy",
      keyVerses: [
        "John 15:12-14 - Love one another commandment",
        "Genesis 1:26-27 - Made in God's image",
        "1 John 4:8 - God is love",
        "Genesis 3:14-15 - Enmity between seeds",
        "1 John 3:11-15 - Love vs. murder",
        "Ephesians 6:12 - Wrestling against principalities",
        "Matthew 24:12 - Love waxing cold"
      ],
      mainPoints: [
        "God created humanity in His image - to love, not destroy",
        "Satan's strategy: Woman Seed (human/divine nature) vs Serpent Seed (animal/beastly nature)",
        "Cain was 'of that wicked one' - representing the serpent's seed of hatred",
        "Sin at the door is like a crouching beast - the animal nature waiting to devour",
        "Dehumanization leads to persecution: 'Dehumanized people dehumanize people'",
        "The papal system and religious persecution stems from the same dehumanizing spirit",
        "End-time warning: 'Because iniquity shall abound, the love of many shall wax cold'",
        "Babylon makes nations 'drunk with the wine of her fornication' - spiritual intoxication leading to persecution"
      ],
      quotations: [
        {
          text: "Pilate was convinced that no evidence of the guilt of Christ could be substantiated... But the Jews were under the inspiration of Satan as was Cain and other murderers who have determined to destroy life rather than to save it.",
          source: "CTr 270.2"
        },
        {
          text: "The same master-spirit that urged in the Massacre of St. Bartholomew, led also in the scenes of the French Revolution... The work which the papacy had begun, atheism completed.",
          source: "Great Controversy"
        }
      ],
      application: "Recognize the beast nature in ourselves and others. Choose the divine nature of love over the animal nature of hatred. Stand for truth without dehumanizing opponents."
    }
  ],

  danielRevelationFramework: {
    title: "Daniel & Revelation Knowledge Bank - Expanded Historicist SDA Framework",

    sanctuaryStructure: {
      overview: "Revelation is framed around the sanctuary system. Just as the earthly sanctuary revealed God's plan of salvation through its services, the book of Revelation unfolds through the sanctuary pattern.",
      progression: [
        { section: "Gospels", parallel: "Altar of Sacrifice", meaning: "The life, death, and resurrection of Christ fulfill the altar sacrifices (John 1:29; Luke 23:33)" },
        { section: "Acts & Epistles", parallel: "The Laver", meaning: "The cleansing and purifying of believers through baptism and the Spirit mirror the laver (Acts 2:38)" },
        { section: "Revelation", parallel: "Holy & Most Holy Place", meaning: "The visions in Revelation move us into the heavenly sanctuary: candlesticks (Rev. 1), throne and table of shewbread (Rev. 4-5), altar of incense (Rev. 8), ark of the covenant (Rev. 11:19)" }
      ],
      feastDayPattern: "Revelation's timeline parallels the feasts: Passover (Christ's sacrifice), Pentecost (Acts 2 outpouring), Trumpets (warnings), Day of Atonement (judgment, Rev. 11:19), Tabernacles (celebration, Rev. 21-22)"
    },

    sevenChurches: {
      overview: "The seven churches represent historical epochs of the Christian church, spanning from the apostolic age to the end of time. Each church carries commendations, rebukes, and promises from Christ.",
      christRole: "Man of Mercy",
      churches: [
        { name: "Ephesus", period: "A.D. 31-100", description: "The apostolic church. Faithful in doctrine and missionary zeal but gradually lost its first love (Rev. 2:4). Represents purity but waning devotion." },
        { name: "Smyrna", period: "100-313", description: "The persecuted church. Ten days of tribulation reflect the ten years of Diocletian's persecution (303-313). They are told to be faithful unto death (Rev. 2:10)." },
        { name: "Pergamos", period: "313-538", description: "The compromising church. After Constantine's conversion, the church united with the state. 'Satan's seat' indicates the infiltration of paganism. Balaam/Nicolaitan errors symbolize compromise with idolatry and immorality (Rev. 2:13-15)." },
        { name: "Thyatira", period: "538-1517", description: "The church under papal dominance. Jezebel symbolizes the papal system's corruption, persecuting dissenters, and promoting idolatry (Rev. 2:20). Yet God preserved a remnant." },
        { name: "Sardis", period: "1517-1798", description: "The Reformation church. It began with spiritual vitality but settled into formality, having 'a name that you live, but are dead' (Rev. 3:1). The work of reform stalled." },
        { name: "Philadelphia", period: "1798-1844", description: "The missionary and revival church. Christ sets before them an 'open door' (Rev. 3:8), pointing to the Most Holy Place ministry opening in 1844. This church symbolizes the Millerite movement." },
        { name: "Laodicea", period: "1844-Second Coming", description: "The end-time church. Lukewarm, self-sufficient, and in need of repentance. Yet Christ still offers gold (faith), white raiment (righteousness), and eye salve (spiritual discernment) (Rev. 3:18-19)." }
      ]
    },

    sevenSeals: {
      overview: "The seals unfold as Christ opens the scroll of history. They are anchored in the Table of Shewbread (the Word), revealing how the gospel advances and how evil progresses through time.",
      christRole: "Man of Justice",
      seals: [
        { seal: 1, symbol: "White Horse", period: "A.D. 31-100", meaning: "The gospel goes forth in purity, conquering through truth (Rev. 6:2)." },
        { seal: 2, symbol: "Red Horse", period: "100-313", meaning: "Symbol of persecution and martyrdom. Peace removed, blood flows (Rev. 6:4)." },
        { seal: 3, symbol: "Black Horse", period: "313-538", meaning: "Compromise and famine of the Word. The church embraces worldly power, truth is weighed out (Rev. 6:5-6)." },
        { seal: 4, symbol: "Pale Horse", period: "538-1517", meaning: "Death dominates. The papal system spreads spiritual darkness; millions perish under its authority (Rev. 6:8)." },
        { seal: 5, symbol: "Martyrs Cry", period: "1517-1798", meaning: "Souls under the altar cry for justice (Rev. 6:9-11). They symbolize Reformation martyrs awaiting vindication." },
        { seal: 6, symbol: "Signs of the End", period: "1755-1833", meaning: "Lisbon earthquake (1755), Dark Day (1780), and falling stars (1833) signal Christ's return (Rev. 6:12-13)." },
        { seal: 7, symbol: "Silence in Heaven", period: "1844 onward", meaning: "Silence represents the close of probation and Christ's transition into judgment (Rev. 8:1)." }
      ]
    },

    sevenTrumpets: {
      overview: "The trumpets represent judgments through war that protect God's people and answer the prayers of the saints. They unfold at the Altar of Incense, linking them to intercession.",
      christRole: "Protector",
      trumpets: [
        { trumpet: 1, event: "Fall of Jerusalem", date: "A.D. 70", meaning: "Roman armies destroy Jerusalem after the nation rejects Christ. Fire, hail, and blood symbolize destruction (Rev. 8:7)." },
        { trumpet: 2, event: "Fall of Rome", date: "476", meaning: "A burning mountain cast into the sea represents the collapse of the Western Roman Empire by barbarian invasions (Rev. 8:8-9)." },
        { trumpet: 3, event: "Wormwood", period: "Dark Ages", meaning: "A star falls, poisoning rivers and waters (Rev. 8:10-11). This represents apostate Christianity corrupting pure doctrine, leading to spiritual famine." },
        { trumpet: 4, event: "Sun, Moon, Stars Darkened", period: "Dark Ages", meaning: "The Dark Ages obscure gospel light. Church traditions overshadow the Word of God (Rev. 8:12)." },
        { trumpet: 5, event: "First Woe - Locusts", period: "1299-1449", meaning: "Locusts symbolize the rise of Islam, tormenting apostate Christendom. The prophecy of 150 years is fulfilled from July 27, 1299, to July 27, 1449 (Rev. 9:1-11)." },
        { trumpet: 6, event: "Second Woe - Euphrates Angels", period: "1449-1840", meaning: "Four angels at the Euphrates represent the Ottoman Turks. Their prophetic period of 391 years and 15 days culminates on August 11, 1840, marking the Ottoman decline (Rev. 9:13-21)." },
        { trumpet: 7, event: "Third Woe - Kingdom", period: "1844-End", meaning: "Heaven opens to reveal the ark (Rev. 11:19). This introduces the judgment hour beginning in 1844 and running to Christ's return. 'The kingdoms of this world are become the kingdoms of our Lord' (Rev. 11:15)." }
      ]
    },

    parallels: {
      description: "Revelation's series run in harmony - Churches, Seals, and Trumpets align:",
      alignment: [
        { period: "1s", churches: "Ephesus - Apostolic purity", seals: "White Horse", trumpets: "Jerusalem destroyed" },
        { period: "2s", churches: "Smyrna - Persecuted", seals: "Red Horse", trumpets: "Fall of Rome" },
        { period: "3s-4s", churches: "Pergamos/Thyatira - Compromise/darkness", seals: "Black & Pale Horses", trumpets: "Wormwood & Dark Ages" },
        { period: "5s-6s", churches: "Sardis/Philadelphia - Martyrs/Signs", seals: "Seals of witness", trumpets: "Islam & Ottoman woes" },
        { period: "7s", churches: "Laodicea - Judgment", seals: "Silence in Heaven", trumpets: "Kingdom proclamation at 7th Trumpet" }
      ]
    },

    dayOfAtonementThemes: [
      "Revelation 11:19 shows the Most Holy Place opened. The ark of God's covenant is seen, signaling judgment has begun.",
      "The trumpets climax with the Day of Atonement, where God's wrath and mercy meet.",
      "Plagues (Rev. 15-16) execute judgment on those who reject God's mercy.",
      "Tabernacles (Rev. 21-22) fulfill the sanctuary cycle with eternal celebration, God dwelling with His people."
    ],

    christRoles: {
      description: "Revelation presents Christ in four roles:",
      roles: [
        { context: "Churches", role: "Mercy", meaning: "Christ lovingly warns and corrects His people." },
        { context: "Seals", role: "Justice", meaning: "Christ unveils the advance of evil and promises justice." },
        { context: "Trumpets", role: "Protection", meaning: "Christ answers prayers through judgments that restrain enemies." },
        { context: "Plagues", role: "Vengeance", meaning: "Christ executes final justice upon the unrepentant." }
      ],
      summary: "This progression reveals the full character of God: mercy offered, justice maintained, protection given, and vengeance against rebellion - all culminating in eternal restoration."
    }
  },

  teachingPrinciples: [
    "Always center interpretation on Christ and His sanctuary ministry",
    "Use the historicist method: prophecy unfolds through history from the prophet's time to the end",
    "Connect Old Testament types to New Testament antitypes",
    "Show the parallel structure of Revelation's sevens (churches, seals, trumpets)",
    "Apply the 2D/3D principle: literal events point to spiritual realities",
    "Use the Time Zones principle: prophecy operates in different temporal dimensions",
    "Emphasize the Great Controversy theme: Christ vs. Satan, love vs. hatred",
    "Connect sanctuary furniture to Christ's progressive ministry",
    "Present the Day of Atonement as the climax of prophetic history (1844)",
    "Show how dehumanization is Satan's endgame strategy"
  ]
};

/**
 * Get sermon content for Jeeves context
 */
export function getSermonContext(): string {
  const sermons = SERMON_KNOWLEDGE_BANK.sermons;
  const framework = SERMON_KNOWLEDGE_BANK.danielRevelationFramework;
  const principles = SERMON_KNOWLEDGE_BANK.teachingPrinciples;

  return `
PHOTOTHEOLOGY TEACHING FRAMEWORK:

${principles.map((p, i) => `${i + 1}. ${p}`).join('\n')}

SERMON THEMES:
${sermons.map(s => `
Title: ${s.title}
Theme: ${s.theme}
Key Points:
${s.mainPoints.map(p => `- ${p}`).join('\n')}
Application: ${s.application}
`).join('\n')}

DANIEL & REVELATION FRAMEWORK:
${framework.sanctuaryStructure.overview}

Seven Churches (Christ as ${framework.sevenChurches.christRole}):
${framework.sevenChurches.churches.map(c => `- ${c.name} (${c.period}): ${c.description}`).join('\n')}

Seven Seals (Christ as ${framework.sevenSeals.christRole}):
${framework.sevenSeals.seals.map(s => `- Seal ${s.seal} - ${s.symbol} (${s.period}): ${s.meaning}`).join('\n')}

Seven Trumpets (Christ as ${framework.sevenTrumpets.christRole}):
${framework.sevenTrumpets.trumpets.map(t => `- Trumpet ${t.trumpet} (${t.period || t.date}): ${t.meaning}`).join('\n')}
`;
}

export default SERMON_KNOWLEDGE_BANK;
