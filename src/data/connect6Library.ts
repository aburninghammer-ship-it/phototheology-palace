// Connect-6 Library - Cross-Genre Connections
// Shows how biblical truth appears across six major genres

export type GenreType = 'prophecy' | 'parable' | 'epistle' | 'history' | 'gospel' | 'poetry';

export interface GenreConnection {
  genre: GenreType;
  reference: string;
  text: string;
  contribution: string;
}

export interface Connect6Theme {
  id: string;
  theme: string;
  description: string;
  connections: GenreConnection[];
  synthesis: string;
  christCenter: string;
}

export const connect6Library: Connect6Theme[] = [
  {
    id: 'gods-love',
    theme: "God's Love for Sinners",
    description: 'How Scripture across all genres reveals God\'s pursuing, sacrificial love for the undeserving.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Isaiah 53:5',
        text: 'He was pierced for our transgressions, he was crushed for our iniquities.',
        contribution: 'PROPHECY predicts love-driven sacrifice centuries before Calvary.'
      },
      {
        genre: 'parable',
        reference: 'Luke 15:20',
        text: 'While he was still a long way off, his father saw him and was filled with compassion.',
        contribution: 'PARABLE illustrates the Father running to embrace returning sinners.'
      },
      {
        genre: 'epistle',
        reference: 'Romans 5:8',
        text: 'While we were still sinners, Christ died for us.',
        contribution: 'EPISTLE explains the doctrine: love precedes repentance, not the reverse.'
      },
      {
        genre: 'history',
        reference: 'Genesis 22:8, 13',
        text: 'God himself will provide the lamb... Abraham looked up and there was a ram.',
        contribution: 'HISTORY foreshadows divine provision—God supplies the sacrifice.'
      },
      {
        genre: 'gospel',
        reference: 'John 3:16',
        text: 'For God so loved the world that he gave his one and only Son.',
        contribution: 'GOSPEL states the love-action directly from Jesus Himself.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 103:12',
        text: 'As far as the east is from the west, so far has he removed our transgressions.',
        contribution: 'POETRY celebrates the result of that love—complete forgiveness.'
      }
    ],
    synthesis: "God's love isn't just stated (John 3:16)—it's predicted (Isaiah), illustrated (Luke 15), explained (Romans), foreshadowed (Genesis 22), accomplished (Gospels), and celebrated (Psalms). All six genres converge on this single truth.",
    christCenter: 'Jesus IS the love of God made visible—the Lamb provided, the Son given, the prodigal welcomed home.'
  },
  {
    id: 'substitutionary-atonement',
    theme: "Christ's Substitutionary Sacrifice",
    description: 'How all of Scripture testifies that the innocent dies in place of the guilty.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Isaiah 53:6',
        text: 'The LORD has laid on him the iniquity of us all.',
        contribution: 'PROPHECY declares substitution—our sin transferred to Him.'
      },
      {
        genre: 'parable',
        reference: 'Matthew 20:28',
        text: 'The Son of Man came to give his life as a ransom for many.',
        contribution: 'PARABLE (within teaching) explains the purpose: His life for ours.'
      },
      {
        genre: 'epistle',
        reference: '2 Corinthians 5:21',
        text: 'God made him who had no sin to be sin for us.',
        contribution: 'EPISTLE unpacks the mechanism: sinless One becomes sin.'
      },
      {
        genre: 'history',
        reference: 'Exodus 12:13',
        text: 'When I see the blood, I will pass over you.',
        contribution: 'HISTORY demonstrates: blood of the lamb averts judgment.'
      },
      {
        genre: 'gospel',
        reference: 'John 1:29',
        text: 'Behold the Lamb of God who takes away the sin of the world.',
        contribution: 'GOSPEL identifies Jesus as THE Lamb all others pointed to.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 22:1, 16-18',
        text: 'My God, my God, why have you forsaken me?... they pierced my hands and feet.',
        contribution: 'POETRY expresses the agony of the substituting Savior.'
      }
    ],
    synthesis: 'Prophecy foretold it, history foreshadowed it, parable clarified the purpose, gospel executed it, epistle explained the mechanism, poetry expressed its agony. Together they form an unbreakable chain proving substitutionary atonement.',
    christCenter: 'Christ alone qualifies as the substitute—sinless, willing, sufficient for all sin.'
  },
  {
    id: 'resurrection-hope',
    theme: 'Resurrection Hope',
    description: 'How Scripture across genres promises and celebrates victory over death.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Isaiah 25:8; Hosea 6:2',
        text: 'He will swallow up death forever... On the third day he will raise us up.',
        contribution: 'PROPHECY predicts death\'s defeat and third-day resurrection.'
      },
      {
        genre: 'parable',
        reference: 'Luke 15:24, 32',
        text: 'This son of mine was dead and is alive again; he was lost and is found.',
        contribution: 'PARABLE pictures resurrection as coming alive from death.'
      },
      {
        genre: 'epistle',
        reference: '1 Corinthians 15:20-22',
        text: 'Christ has been raised from the dead, the firstfruits of those who have fallen asleep.',
        contribution: 'EPISTLE explains: Christ\'s resurrection guarantees ours.'
      },
      {
        genre: 'history',
        reference: 'Genesis 22:5; Hebrews 11:19',
        text: 'We will worship and then we will come back... Abraham reasoned that God could raise the dead.',
        contribution: 'HISTORY shows Abraham\'s resurrection faith—Isaac raised "figuratively."'
      },
      {
        genre: 'gospel',
        reference: 'John 11:25-26',
        text: 'I am the resurrection and the life. The one who believes in me will live, even though they die.',
        contribution: 'GOSPEL presents Jesus not just teaching about resurrection but BEING it.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 16:10',
        text: 'You will not abandon me to the realm of the dead, nor will you let your faithful one see decay.',
        contribution: 'POETRY cries out in confidence: God will not leave His Holy One in the grave.'
      }
    ],
    synthesis: 'From prophecy\'s promise to poetry\'s confidence, from Abraham\'s faith to Jesus\' declaration, from parable\'s picture to epistle\'s explanation—resurrection hope echoes through every genre.',
    christCenter: 'Jesus doesn\'t just teach resurrection—He IS the Resurrection. His rising is the guarantee of ours.'
  },
  {
    id: 'shepherd-flock',
    theme: 'The Shepherd and His Flock',
    description: 'How God\'s care for His people as Shepherd appears in every genre.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Ezekiel 34:11-16',
        text: 'I myself will search for my sheep and look after them... I will rescue them.',
        contribution: 'PROPHECY promises God Himself will shepherd His scattered flock.'
      },
      {
        genre: 'parable',
        reference: 'Luke 15:4-7',
        text: 'Suppose one of you has a hundred sheep and loses one... Does he not go after the lost sheep?',
        contribution: 'PARABLE illustrates the Shepherd leaving 99 to pursue one lost sheep.'
      },
      {
        genre: 'epistle',
        reference: '1 Peter 2:25',
        text: 'You were like sheep going astray, but now you have returned to the Shepherd.',
        contribution: 'EPISTLE applies the imagery to believers: we were lost, now found.'
      },
      {
        genre: 'history',
        reference: 'Genesis 48:15',
        text: 'The God who has been my shepherd all my life to this day.',
        contribution: 'HISTORY records Jacob\'s testimony of lifelong shepherding care.'
      },
      {
        genre: 'gospel',
        reference: 'John 10:11, 14',
        text: 'I am the good shepherd. The good shepherd lays down his life for the sheep.',
        contribution: 'GOSPEL reveals Jesus as THE Good Shepherd who dies for His flock.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 23:1-4',
        text: 'The LORD is my shepherd, I lack nothing... Even though I walk through the valley...',
        contribution: 'POETRY expresses the personal experience of the Shepherd\'s care.'
      }
    ],
    synthesis: 'The shepherd imagery spans the entire Bible—promised prophetically, illustrated parabolically, applied in epistles, testified historically, embodied in Christ, and worshiped poetically.',
    christCenter: 'Jesus claims the title directly: "I AM the Good Shepherd"—fulfilling every OT shadow.'
  },
  {
    id: 'kingdom-god',
    theme: 'The Kingdom of God',
    description: 'How God\'s sovereign rule is revealed progressively through all genres.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Daniel 2:44; 7:13-14',
        text: 'The God of heaven will set up a kingdom that will never be destroyed... All peoples and nations worshiped him.',
        contribution: 'PROPHECY foretells an eternal kingdom crushing all earthly empires.'
      },
      {
        genre: 'parable',
        reference: 'Matthew 13:31-32',
        text: 'The kingdom of heaven is like a mustard seed... smallest of all seeds, yet it grows.',
        contribution: 'PARABLE illustrates the kingdom\'s humble beginning and explosive growth.'
      },
      {
        genre: 'epistle',
        reference: 'Colossians 1:13-14',
        text: 'He has rescued us from the dominion of darkness and brought us into the kingdom of the Son.',
        contribution: 'EPISTLE explains: believers have already been transferred into Christ\'s kingdom.'
      },
      {
        genre: 'history',
        reference: '2 Samuel 7:12-16',
        text: 'I will establish the throne of his kingdom forever.',
        contribution: 'HISTORY records the Davidic covenant—throne established through his seed.'
      },
      {
        genre: 'gospel',
        reference: 'Mark 1:15',
        text: 'The kingdom of God has come near. Repent and believe the good news!',
        contribution: 'GOSPEL announces: the kingdom has arrived in the person of Jesus.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 145:11-13',
        text: 'They tell of the glory of your kingdom... Your kingdom is an everlasting kingdom.',
        contribution: 'POETRY celebrates God\'s eternal, glorious reign.'
      }
    ],
    synthesis: 'The kingdom is prophesied (Daniel), illustrated (parables), explained (epistles), covenanted (Samuel), announced (Mark), and celebrated (Psalms). One kingdom, six genres, one King.',
    christCenter: 'Jesus is the King of this kingdom—He brings it, embodies it, and will consummate it at His return.'
  },
  {
    id: 'new-covenant',
    theme: 'The New Covenant',
    description: 'How Scripture promises and fulfills a superior covenant written on hearts.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Jeremiah 31:31-34',
        text: 'I will make a new covenant... I will put my law in their minds and write it on their hearts.',
        contribution: 'PROPHECY promises internal transformation—law on hearts, not stone.'
      },
      {
        genre: 'parable',
        reference: 'Luke 22:20',
        text: 'This cup is the new covenant in my blood, which is poured out for you.',
        contribution: 'PARABLE (Last Supper): Jesus establishes the covenant with His blood.'
      },
      {
        genre: 'epistle',
        reference: 'Hebrews 8:6-13',
        text: 'The ministry Jesus has received is as superior... as the covenant of which he is mediator is superior.',
        contribution: 'EPISTLE explains: the new covenant is better—better promises, better mediator.'
      },
      {
        genre: 'history',
        reference: 'Exodus 24:3-8',
        text: 'Moses took the blood, sprinkled it on the people and said, "This is the blood of the covenant."',
        contribution: 'HISTORY records the old covenant sealed with blood—pattern for the new.'
      },
      {
        genre: 'gospel',
        reference: 'Matthew 26:28',
        text: 'This is my blood of the covenant, which is poured out for many for the forgiveness of sins.',
        contribution: 'GOSPEL: Jesus explicitly connects His death to covenant inauguration.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 51:10-12',
        text: 'Create in me a pure heart, O God... Do not take your Holy Spirit from me.',
        contribution: 'POETRY cries for what the new covenant provides: new heart, Spirit\'s presence.'
      }
    ],
    synthesis: 'Prophecy promised it (Jeremiah), history patterned it (Exodus), poetry longed for it (Psalm 51), Jesus inaugurated it (Gospels), and epistles explain its superiority (Hebrews).',
    christCenter: 'Christ is both mediator and sacrifice of the new covenant—His blood makes it valid forever.'
  },
  {
    id: 'second-coming',
    theme: "Christ's Second Coming",
    description: 'How all Scripture anticipates and celebrates the return of the King.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Daniel 7:13-14; Zechariah 14:4',
        text: 'One like a son of man, coming with the clouds of heaven... His feet will stand on the Mount of Olives.',
        contribution: 'PROPHECY describes His glorious, visible return in power.'
      },
      {
        genre: 'parable',
        reference: 'Matthew 25:1-13',
        text: 'At midnight the cry rang out: "Here\'s the bridegroom! Come out to meet him!"',
        contribution: 'PARABLE warns: be ready for the Bridegroom\'s sudden arrival.'
      },
      {
        genre: 'epistle',
        reference: '1 Thessalonians 4:16-17',
        text: 'The Lord himself will come down from heaven... and we who are still alive will be caught up.',
        contribution: 'EPISTLE explains the mechanics: trumpet, resurrection, gathering.'
      },
      {
        genre: 'history',
        reference: 'Acts 1:9-11',
        text: 'This same Jesus will come back in the same way you have seen him go into heaven.',
        contribution: 'HISTORY records the angel\'s promise at the ascension.'
      },
      {
        genre: 'gospel',
        reference: 'Matthew 24:30',
        text: 'They will see the Son of Man coming on the clouds of heaven, with power and great glory.',
        contribution: 'GOSPEL: Jesus Himself promises His visible return.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 98:9',
        text: 'He comes to judge the earth. He will judge the world in righteousness.',
        contribution: 'POETRY celebrates: the coming Judge brings righteousness to earth.'
      }
    ],
    synthesis: 'From Daniel\'s vision to Jesus\' promise, from angels\' words to apostles\' teaching, from parables\' warnings to psalms\' celebration—Scripture anticipates His return.',
    christCenter: 'The same Jesus who ascended will descend—bodily, visibly, gloriously. Maranatha!'
  },
  {
    id: 'rest-sabbath',
    theme: 'Sabbath Rest',
    description: 'How the theme of rest in God permeates every genre of Scripture.',
    connections: [
      {
        genre: 'prophecy',
        reference: 'Isaiah 58:13-14',
        text: 'If you call the Sabbath a delight... then you will find your joy in the LORD.',
        contribution: 'PROPHECY connects Sabbath-keeping with delight in the LORD.'
      },
      {
        genre: 'parable',
        reference: 'Luke 14:1-6',
        text: 'Is it lawful to heal on the Sabbath or not?... Which of you, having a son or an ox that has fallen into a well...',
        contribution: 'PARABLE/teaching: Jesus shows Sabbath is for mercy and restoration.'
      },
      {
        genre: 'epistle',
        reference: 'Hebrews 4:9-10',
        text: 'There remains a Sabbath-rest for the people of God; for anyone who enters God\'s rest also rests from their works.',
        contribution: 'EPISTLE explains: true Sabbath is ceasing from self-salvation efforts.'
      },
      {
        genre: 'history',
        reference: 'Genesis 2:2-3; Exodus 20:8-11',
        text: 'God rested on the seventh day... Remember the Sabbath day by keeping it holy.',
        contribution: 'HISTORY establishes Sabbath at creation and commands it at Sinai.'
      },
      {
        genre: 'gospel',
        reference: 'Matthew 11:28-30',
        text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
        contribution: 'GOSPEL: Jesus offers Himself as the source of rest.'
      },
      {
        genre: 'poetry',
        reference: 'Psalm 95:7-11',
        text: 'Today, if only you would hear his voice... do not harden your hearts... They shall never enter my rest.',
        contribution: 'POETRY warns against missing God\'s rest through unbelief.'
      }
    ],
    synthesis: 'Sabbath rest is rooted in creation (Genesis), commanded at Sinai (Exodus), warned about in poetry (Psalm 95), promised in prophecy (Isaiah), offered by Christ (Matthew), and explained spiritually (Hebrews).',
    christCenter: 'Jesus IS our Sabbath rest—we cease from works-righteousness and rest in His finished work.'
  }
];

// Helper functions
export const searchConnect6 = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return connect6Library.filter(theme =>
    theme.theme.toLowerCase().includes(lowerQuery) ||
    theme.description.toLowerCase().includes(lowerQuery) ||
    theme.connections.some(c =>
      c.text.toLowerCase().includes(lowerQuery) ||
      c.reference.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getRandomTheme = () => {
  return connect6Library[Math.floor(Math.random() * connect6Library.length)];
};

export const getConnectionsByGenre = (genre: GenreType) => {
  const results: { theme: string; connection: GenreConnection }[] = [];
  connect6Library.forEach(theme => {
    const connection = theme.connections.find(c => c.genre === genre);
    if (connection) {
      results.push({ theme: theme.theme, connection });
    }
  });
  return results;
};

// Genre definitions for reference
export const genreDefinitions: Record<GenreType, { name: string; description: string; icon: string }> = {
  prophecy: {
    name: 'Prophecy',
    description: 'Predictive/forth-telling speech—Isaiah, Ezekiel, Daniel, Revelation',
    icon: 'Scroll'
  },
  parable: {
    name: 'Parable',
    description: "Jesus' illustrative stories with one main point",
    icon: 'Drama'
  },
  epistle: {
    name: 'Epistle',
    description: 'Apostolic letters explaining doctrine and ethics—Romans, Ephesians, Hebrews',
    icon: 'Mail'
  },
  history: {
    name: 'History/Narrative',
    description: 'Narrative accounts of what happened—Genesis, Exodus, Acts',
    icon: 'Book'
  },
  gospel: {
    name: 'Gospel',
    description: "Jesus' life, death, resurrection—Matthew, Mark, Luke, John",
    icon: 'Cross'
  },
  poetry: {
    name: 'Poetry/Wisdom',
    description: 'Artistic/metaphorical language—Psalms, Proverbs, Job, Song of Songs',
    icon: 'Music'
  }
};
