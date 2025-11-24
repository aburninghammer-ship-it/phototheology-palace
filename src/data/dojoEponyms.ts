export interface EponymDrill {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

export interface SpiritualEponym {
  id: string;
  name: string;
  biblicalCharacter: string;
  description: string;
  traits: string[];
  howItManifests: string[];
  whyItsDangerous: string[];
  scriptureProfile: string[];
  counterStrategy: string;
  drills: EponymDrill[];
  victorySign: string;
}

export const SPIRITUAL_EPONYMS: SpiritualEponym[] = [
  {
    id: "goliath",
    name: "Goliath Within",
    biblicalCharacter: "Goliath",
    description: "The Goliath Within is the spirit of pride, intimidation, and boastful arrogance. It makes you overconfident, mocking, and dismissive of others. It speaks big words and looks down on those it considers weak. Like Goliath, it's all show - loud, threatening, and imposing - but one well-placed stone from God can bring it down.",
    traits: [
      "Arrogance and pride",
      "Intimidation tactics",
      "Boastful speech",
      "Looking down on others",
      "Overconfidence in own strength",
      "Mocking those perceived as weaker"
    ],
    howItManifests: [
      "You speak harshly to 'lesser' people",
      "You boast about your abilities or accomplishments",
      "You intimidate others to get your way",
      "You mock sincere believers as naive",
      "You trust in your own strength instead of God's",
      "You can't handle correction - it enrages you"
    ],
    whyItsDangerous: [
      "Pride comes before destruction (Proverbs 16:18)",
      "It blinds you to your own weaknesses",
      "It drives people away from you and from God",
      "It invites God's resistance (James 4:6)",
      "It makes you vulnerable to a sudden fall",
      "It's directly opposed to the spirit of Christ"
    ],
    scriptureProfile: [
      "1 Samuel 17:4, 8-10 - Goliath's intimidation and boasting",
      "1 Samuel 17:43-44 - Goliath cursing David and boasting",
      "Proverbs 16:18 - Pride goeth before destruction",
      "Daniel 4:30-33 - Nebuchadnezzar's pride brought him down",
      "James 4:6 - God resisteth the proud, but giveth grace unto the humble"
    ],
    counterStrategy: "The only way to defeat Goliath is with humility and God's weapon, not your own strength. Like David, you must refuse the armor of self and strike at the head (pride) with the stone of humility.",
    victorySign: "You know Goliath is defeated when you can accept correction without defensiveness, when you serve others without resentment, and when you boast in the Lord alone.",
    drills: [
      {
        id: "head-strike-elimination",
        name: "Head-Strike Elimination",
        description: "Target and destroy the head of pride",
        steps: [
          "Identify an area where you feel superior to others",
          "Confess this as the sin of pride",
          "Fast from boasting or self-promotion for one week",
          "Serve someone you secretly look down on",
          "Ask God to give you His view of your weakness",
          "Declare: 'I am nothing without Christ. He is my only boast.'"
        ]
      },
      {
        id: "lowly-service-drill",
        name: "Lowly Service Drill",
        description: "Crush pride through intentional humility",
        steps: [
          "Choose a task you consider 'beneath you'",
          "Do it for someone else without being asked",
          "Do it secretly if possible - no credit",
          "Notice your internal resistance - that's Goliath",
          "Kill the resistance with Scripture on humility",
          "Repeat weekly until the resistance dies"
        ]
      }
    ]
  },
  {
    id: "judas",
    name: "Judas Within",
    biblicalCharacter: "Judas Iscariot",
    description: "The Judas Within is the spirit of compromise, secret betrayal, and hidden sin. It looks spiritual on the outside but is corrupt within. It betrays Christ for personal gain while maintaining a religious facade. Like Judas, it serves two masters and eventually sells out for the right price.",
    traits: [
      "Hypocrisy and double life",
      "Secret sin while appearing righteous",
      "Compromise for personal gain",
      "Love of money or comfort over Christ",
      "Betrayal disguised as loyalty",
      "Spiritual appearance with corrupt heart"
    ],
    howItManifests: [
      "You say one thing in public, do another in private",
      "You justify small compromises that grow over time",
      "You love the praise of men more than the praise of God",
      "You're willing to betray convictions for comfort or money",
      "You maintain a spiritual image while harboring secret sin",
      "You're more concerned with appearance than reality"
    ],
    whyItsDangerous: [
      "Hypocrisy is spiritual poison",
      "Secret sin eventually becomes public",
      "It destroys your testimony and others' faith",
      "It leads to spiritual death if unrepented",
      "It makes you a tool of Satan while thinking you serve God",
      "It ends in remorse without repentance"
    ],
    scriptureProfile: [
      "John 12:4-6 - Judas was a thief, had the bag",
      "Matthew 26:14-16 - Judas betrayed Jesus for money",
      "John 13:27 - Satan entered into Judas",
      "Matthew 27:3-5 - Judas' remorse and suicide",
      "Acts 1:25 - Judas fell from apostleship to go to his own place"
    ],
    counterStrategy: "Expose the secret sin immediately. Bring it into the light. Confess it to God and a trusted believer. Cut off the double life completely. Choose to serve one master - Christ alone.",
    victorySign: "You know Judas is defeated when your private life matches your public testimony, when you can't be bought, and when you choose Christ over comfort consistently.",
    drills: [
      {
        id: "betrayal-exposure",
        name: "Betrayal Exposure Exercise",
        description: "Identify and confess areas of compromise and double life",
        steps: [
          "Ask God to search your heart for secret sin",
          "Write down any areas where you're living a double life",
          "Confess each one specifically to God",
          "Tell one trusted person about your compromise",
          "Make a plan to end the double life immediately",
          "Declare: 'No more secrets. Christ is my only Master.'"
        ]
      },
      {
        id: "integrity-restoration",
        name: "Integrity Restoration Drill",
        description: "Rebuild alignment between public and private life",
        steps: [
          "List your public spiritual commitments",
          "Honestly assess your private obedience to those commitments",
          "Identify gaps between profession and practice",
          "Close each gap with specific action",
          "Invite accountability - let someone check your progress",
          "Maintain this alignment through weekly self-examination"
        ]
      }
    ]
  },
  {
    id: "peter",
    name: "Peter Within",
    biblicalCharacter: "Peter",
    description: "The Peter Within is the spirit of impulsiveness, overconfidence, and inconsistency. It means well but acts rashly. It makes bold declarations but fails under pressure. It's passionate but unstable, zealous but unreliable. Like Peter, it loves Jesus but denies Him when the cost gets real.",
    traits: [
      "Impulsive reactions",
      "Overconfident declarations",
      "Emotional instability",
      "Bold promises followed by cowardice",
      "Inconsistent obedience",
      "Quick to speak, slow to endure"
    ],
    howItManifests: [
      "You make big spiritual commitments you can't keep",
      "You act on emotion instead of wisdom",
      "You're bold in public but compromising in private",
      "You overestimate your own strength",
      "You're hot and cold - zealous one day, lukewarm the next",
      "You react without thinking through consequences"
    ],
    whyItsDangerous: [
      "Impulsiveness leads to foolish decisions",
      "Overconfidence sets you up for failure",
      "Inconsistency destroys trust and testimony",
      "It makes you unreliable to God and others",
      "It can lead to public denial of Christ",
      "It wastes energy on false starts and failed commitments"
    ],
    scriptureProfile: [
      "Matthew 26:33-35 - Peter's overconfident promise",
      "Matthew 26:69-75 - Peter's denial and weeping",
      "Matthew 14:28-31 - Peter walking on water then sinking",
      "John 18:10 - Peter cutting off Malchus' ear",
      "Galatians 2:11-14 - Peter's hypocrisy confronted by Paul"
    ],
    counterStrategy: "Discipline your emotions. Don't make promises in the heat of passion. Count the cost before committing. Build consistency through small, daily obediences. Let the Spirit control your tongue and actions.",
    victorySign: "You know Peter is defeated when you can keep your word consistently, when you think before acting, and when your private devotion matches your public declarations.",
    drills: [
      {
        id: "emotional-stability-discipline",
        name: "Emotional Stability Discipline",
        description: "Train your emotions to submit to truth instead of driving you",
        steps: [
          "Identify a situation where you tend to react impulsively",
          "Institute a mandatory 24-hour waiting period before making decisions",
          "During that time, pray and seek Scripture",
          "Ask: 'Am I reacting or responding? Is this wisdom or emotion?'",
          "Make the decision based on truth, not feeling",
          "Build this habit until it becomes automatic"
        ]
      },
      {
        id: "promise-keeper-protocol",
        name: "Promise-Keeper Protocol",
        description: "Stop making rash commitments and start keeping small ones",
        steps: [
          "For one month, make NO big spiritual promises",
          "Instead, make small, achievable commitments",
          "Keep every single one - no exceptions",
          "Build a track record of reliability",
          "Let your yes be yes and your no be no",
          "Earn back your own trust before making big vows"
        ]
      }
    ]
  },
  {
    id: "jacob",
    name: "Jacob Within",
    biblicalCharacter: "Jacob",
    description: "The Jacob Within is the spirit of self-sufficiency, manipulation, and scheming. It trusts its own cleverness instead of God's provision. It works angles, manipulates people, and relies on strategy over surrender. Like Jacob, it grabs for blessings instead of receiving them, schemes for what God promised to give freely.",
    traits: [
      "Self-reliance and scheming",
      "Manipulation of people and situations",
      "Trusting in own cleverness",
      "Working angles for personal gain",
      "Inability to simply trust and wait on God",
      "Grabbing instead of receiving"
    ],
    howItManifests: [
      "You're always working an angle",
      "You manipulate instead of trusting God",
      "You can't rest - you have to scheme",
      "You take shortcuts to get what God promised",
      "You lean on your own understanding exclusively",
      "You struggle to simply receive grace - you feel you must earn it"
    ],
    whyItsDangerous: [
      "It keeps you from experiencing God's grace",
      "It damages relationships through manipulation",
      "It leads to moral compromise",
      "It delays God's promises through self-effort",
      "It creates anxiety and restlessness",
      "It keeps you from surrendering to God's ways"
    ],
    scriptureProfile: [
      "Genesis 25:29-34 - Jacob manipulates Esau for birthright",
      "Genesis 27 - Jacob deceives Isaac for blessing",
      "Genesis 30:37-43 - Jacob's breeding schemes",
      "Genesis 32:24-32 - Jacob wrestles with God and is broken",
      "Proverbs 3:5-6 - Lean not on your own understanding"
    ],
    counterStrategy: "Stop scheming. Stop manipulating. Wrestle with God until He breaks your self-sufficiency. Surrender your plans and trust His. Walk with a limp - a permanent reminder that His strength, not yours, is what carries you.",
    victorySign: "You know Jacob is defeated when you can rest in God's provision without scheming, when you trust instead of manipulate, and when you limp forward in dependence on Him alone.",
    drills: [
      {
        id: "wrestling-to-surrender",
        name: "Wrestling-to-Surrender Drill",
        description: "Bring your self-sufficiency to God until He breaks it",
        steps: [
          "Identify an area where you're scheming instead of trusting",
          "Bring it to God in prayer and confess your self-reliance",
          "Ask Him to break your self-sufficiency",
          "Commit to stop manipulating and simply obey",
          "Let go of all backup plans and schemes",
          "Walk forward in faith, not cleverness"
        ]
      },
      {
        id: "strategic-surrender",
        name: "Strategic Surrender",
        description: "Practice receiving instead of grabbing",
        steps: [
          "Choose one goal or desire you've been scheming to achieve",
          "Lay it down completely before God",
          "Declare: 'If You want me to have this, You will provide it. I will not scheme.'",
          "Do nothing to manipulate the outcome",
          "Wait on God's provision or redirection",
          "Let this teach you to receive grace instead of earning blessings"
        ]
      }
    ]
  },
  {
    id: "pharaoh",
    name: "Pharaoh Within",
    biblicalCharacter: "Pharaoh",
    description: "The Pharaoh Within is the spirit of stubbornness, hardened heart, and refusal to yield. It will not submit to God no matter how many plagues fall. It digs in its heels and says 'I will not let go' even when destruction is imminent. Like Pharaoh, it hardens under judgment instead of softening under grace.",
    traits: [
      "Stubbornness and inflexibility",
      "Hardened heart",
      "Refusal to submit to God",
      "Resistance to conviction",
      "Pride that won't bend",
      "Hardening under judgment instead of repenting"
    ],
    howItManifests: [
      "You refuse to change despite clear warnings",
      "You resist conviction of sin",
      "You harden your heart under discipline",
      "You say 'I will not' to God",
      "You prefer destruction to surrender",
      "You become more stubborn the more God presses"
    ],
    whyItsDangerous: [
      "A hardened heart leads to spiritual death",
      "It invites increasing judgment",
      "It destroys you and those under your authority",
      "It can reach a point of no return",
      "It grieves the Holy Spirit",
      "It ends in catastrophic loss"
    ],
    scriptureProfile: [
      "Exodus 5:2 - Who is the LORD, that I should obey his voice?",
      "Exodus 7-11 - Pharaoh's repeated hardening through plagues",
      "Exodus 14:5-28 - Pharaoh's final stubbornness and destruction",
      "Hebrews 3:7-8 - Harden not your hearts",
      "Proverbs 29:1 - He that being often reproved hardeneth his neck shall suddenly be destroyed"
    ],
    counterStrategy: "Break the stubbornness now before it's too late. Yield immediately to conviction. Soften your heart through worship and humility. Repent while there's time. Don't wait for another plague.",
    victorySign: "You know Pharaoh is defeated when you respond quickly to conviction, when your heart is soft toward God, and when you yield without a fight.",
    drills: [
      {
        id: "plague-cycle-breaker",
        name: "Plague-Cycle Breaker",
        description: "Stop the cycle of hardening and judgment",
        steps: [
          "Identify an area where you've been resisting God's conviction",
          "Acknowledge the pattern: conviction → partial repentance → return to sin",
          "Break the cycle by full, immediate surrender",
          "Don't wait for another warning or consequence",
          "Yield completely, right now",
          "Ask God to keep your heart tender going forward"
        ]
      },
      {
        id: "immediate-obedience-training",
        name: "Immediate Obedience Training",
        description: "Practice instant obedience to cultivate a soft heart",
        steps: [
          "For one week, obey every conviction immediately",
          "No delay, no negotiation, no halfway obedience",
          "When the Spirit nudges, move instantly",
          "Don't let any stubbornness take root",
          "Notice how this softens your heart",
          "Make immediate obedience your new normal"
        ]
      }
    ]
  }
];
