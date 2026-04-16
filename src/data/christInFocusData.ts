// Christ in Focus - Concentration Room Motion Game
// Core Rule: Every verse must converge on Christ

export type ChristResolutionTag =
  | 'TYPE_TO_CHRIST'
  | 'PROMISE_FULFILLED_IN_CHRIST'
  | 'SUBSTITUTION'
  | 'PRIESTLY_MEDIATION'
  | 'SACRIFICIAL_AUTHORITY'
  | 'COVENANT_CENTER'
  | 'JUDGMENT_THROUGH_CROSS'
  | 'ATONEMENT'
  | 'LAW_THROUGH_CHRIST';

export type FalseCenterType =
  | 'LAW_ONLY'
  | 'SYMBOL_ONLY'
  | 'NATION_ONLY'
  | 'EMOTION_ONLY'
  | 'OBEDIENCE'
  | 'MORALITY'
  | 'RITUAL'
  | 'CHRONOLOGY'
  | 'IGNORANCE';

export type LevelCategory = 'TORAH' | 'PROPHETS' | 'GOSPELS' | 'REVELATION';

export type Difficulty = 'beginner' | 'intermediate' | 'master';

export interface MotionElement {
  id: string;
  label: string;
  christResolutionTags: ChristResolutionTag[];
  correctTarget: string; // Which element or anchor it should connect to
  isFalseCenter?: boolean;
  falseCenterType?: FalseCenterType;
}

export interface ChristAnchor {
  id: string;
  label: string;
  icon: 'lamb' | 'cross' | 'high_priest' | 'throne' | 'mediator';
  description: string;
}

export interface ConnectionRule {
  from: string;
  to: string;
  description: string;
}

export interface CRLevel {
  id: string;
  category: LevelCategory;
  reference: string;
  verse: string;
  difficulty: Difficulty;
  motionElements: MotionElement[];
  christAnchor: ChristAnchor;
  requiredConnections: ConnectionRule[];
  falseCenters: { id: string; label: string; type: FalseCenterType }[];
  lesson: string;
  christFocusSummary: string;
  ptRoom: string;
}

// ============================================
// TORAH LEVELS (TYPE / SHADOW)
// ============================================

const torahLevels: CRLevel[] = [
  {
    id: 'exodus_12_13',
    category: 'TORAH',
    reference: 'Exodus 12:13',
    verse: 'When I see the blood, I will pass over you, and the plague shall not be upon you to destroy you.',
    difficulty: 'beginner',
    motionElements: [
      { id: 'blood', label: 'BLOOD', christResolutionTags: ['SUBSTITUTION', 'ATONEMENT'], correctTarget: 'lamb_anchor' },
      { id: 'sign', label: 'SIGN', christResolutionTags: ['TYPE_TO_CHRIST'], correctTarget: 'blood' },
      { id: 'house', label: 'HOUSE', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'blood' },
      { id: 'see', label: 'SEE', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'blood' },
      { id: 'pass_over', label: 'PASS OVER', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'blood' },
      { id: 'protection', label: 'PROTECTION', christResolutionTags: ['SUBSTITUTION'], correctTarget: 'pass_over' },
    ],
    christAnchor: {
      id: 'lamb_anchor',
      label: 'LAMB / SACRIFICE',
      icon: 'lamb',
      description: 'The blood of Christ, our Passover Lamb'
    },
    requiredConnections: [
      { from: 'blood', to: 'lamb_anchor', description: 'Blood flows from the Lamb' },
      { from: 'pass_over', to: 'blood', description: 'Judgment passes over through blood' },
      { from: 'house', to: 'blood', description: 'House is covered by blood' },
    ],
    falseCenters: [
      { id: 'obedience_false', label: 'OBEDIENCE', type: 'OBEDIENCE' },
      { id: 'israel_false', label: 'ISRAEL', type: 'NATION_ONLY' },
      { id: 'morality_false', label: 'MORALITY', type: 'MORALITY' },
    ],
    lesson: 'Protection stabilizes only when blood resolves in Christ.',
    christFocusSummary: 'This passage reveals Christ as the Lamb whose blood protects from judgment. The sign is effective only because of the sacrifice.',
    ptRoom: 'Blue Room'
  },
  {
    id: 'leviticus_17_11',
    category: 'TORAH',
    reference: 'Leviticus 17:11',
    verse: 'For the life of the flesh is in the blood, and I have given it to you upon the altar to make atonement for your souls.',
    difficulty: 'beginner',
    motionElements: [
      { id: 'blood', label: 'BLOOD', christResolutionTags: ['SUBSTITUTION', 'ATONEMENT'], correctTarget: 'life_given_anchor' },
      { id: 'life', label: 'LIFE', christResolutionTags: ['SUBSTITUTION'], correctTarget: 'blood' },
      { id: 'atonement', label: 'ATONEMENT', christResolutionTags: ['ATONEMENT', 'SUBSTITUTION'], correctTarget: 'blood' },
      { id: 'altar', label: 'ALTAR', christResolutionTags: ['SACRIFICIAL_AUTHORITY', 'TYPE_TO_CHRIST'], correctTarget: 'life_given_anchor' },
    ],
    christAnchor: {
      id: 'life_given_anchor',
      label: 'SUBSTITUTIONARY LIFE GIVEN',
      icon: 'cross',
      description: 'Christ gave His life as atonement'
    },
    requiredConnections: [
      { from: 'blood', to: 'life_given_anchor', description: 'Blood carries the life given' },
      { from: 'life', to: 'blood', description: 'Life is in the blood' },
      { from: 'atonement', to: 'blood', description: 'Atonement comes through blood' },
    ],
    falseCenters: [
      { id: 'ritual_false', label: 'RITUAL ITSELF', type: 'RITUAL' },
      { id: 'symbol_false', label: 'SYMBOL ONLY', type: 'SYMBOL_ONLY' },
    ],
    lesson: 'Blood has no power apart from Christ\'s life offered.',
    christFocusSummary: 'The life given in the blood points to Christ\'s substitutionary sacrifice. The altar typifies the cross where atonement was made.',
    ptRoom: 'Blue Room'
  },
  {
    id: 'genesis_22_8',
    category: 'TORAH',
    reference: 'Genesis 22:8',
    verse: 'God will provide himself a lamb for a burnt offering.',
    difficulty: 'intermediate',
    motionElements: [
      { id: 'god', label: 'GOD', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'provide_anchor' },
      { id: 'provide', label: 'PROVIDE', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'provide_anchor' },
      { id: 'himself', label: 'HIMSELF', christResolutionTags: ['SUBSTITUTION'], correctTarget: 'lamb' },
      { id: 'lamb', label: 'LAMB', christResolutionTags: ['TYPE_TO_CHRIST', 'SUBSTITUTION'], correctTarget: 'provide_anchor' },
      { id: 'offering', label: 'BURNT OFFERING', christResolutionTags: ['SACRIFICIAL_AUTHORITY'], correctTarget: 'lamb' },
    ],
    christAnchor: {
      id: 'provide_anchor',
      label: 'GOD PROVIDES HIMSELF',
      icon: 'lamb',
      description: 'God Himself becomes the sacrifice'
    },
    requiredConnections: [
      { from: 'lamb', to: 'provide_anchor', description: 'The Lamb is God\'s provision' },
      { from: 'himself', to: 'lamb', description: 'God provides Himself as the Lamb' },
      { from: 'offering', to: 'lamb', description: 'The burnt offering is the Lamb' },
    ],
    falseCenters: [
      { id: 'isaac_false', label: 'ISAAC\'S OBEDIENCE', type: 'OBEDIENCE' },
      { id: 'abraham_false', label: 'ABRAHAM\'S FAITH', type: 'EMOTION_ONLY' },
    ],
    lesson: 'God Himself provides the sacrifice - He does not merely accept it.',
    christFocusSummary: 'Abraham prophesied that God would provide Himself as the lamb. This was fulfilled when Christ, God incarnate, became our sacrifice.',
    ptRoom: 'Story Room'
  },
];

// ============================================
// PROPHETS LEVELS (PROMISE / ANTICIPATION)
// ============================================

const prophetsLevels: CRLevel[] = [
  {
    id: 'isaiah_53_5',
    category: 'PROPHETS',
    reference: 'Isaiah 53:5',
    verse: 'He was wounded for our transgressions, he was bruised for our iniquities; the chastisement of our peace was upon him.',
    difficulty: 'intermediate',
    motionElements: [
      { id: 'wounded', label: 'WOUNDED', christResolutionTags: ['SUBSTITUTION'], correctTarget: 'substitute_anchor' },
      { id: 'transgressions', label: 'TRANSGRESSIONS', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'wounded' },
      { id: 'bruised', label: 'BRUISED', christResolutionTags: ['SUBSTITUTION'], correctTarget: 'substitute_anchor' },
      { id: 'iniquities', label: 'INIQUITIES', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'bruised' },
      { id: 'chastisement', label: 'CHASTISEMENT', christResolutionTags: ['JUDGMENT_THROUGH_CROSS', 'SUBSTITUTION'], correctTarget: 'substitute_anchor' },
      { id: 'peace', label: 'PEACE', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'chastisement' },
    ],
    christAnchor: {
      id: 'substitute_anchor',
      label: 'SUBSTITUTE / BEARER',
      icon: 'cross',
      description: 'Christ bears our punishment'
    },
    requiredConnections: [
      { from: 'wounded', to: 'substitute_anchor', description: 'He was wounded as our substitute' },
      { from: 'transgressions', to: 'wounded', description: 'Wounded for our transgressions' },
      { from: 'peace', to: 'chastisement', description: 'Peace comes through His chastisement' },
    ],
    falseCenters: [
      { id: 'suffering_false', label: 'SUFFERING ITSELF', type: 'EMOTION_ONLY' },
      { id: 'example_false', label: 'MORAL EXAMPLE', type: 'MORALITY' },
    ],
    lesson: 'Peace stabilizes only when suffering is substitutionary.',
    christFocusSummary: 'Isaiah prophesies Christ as the suffering substitute who bears our sins. Peace comes not from His example but from His substitutionary death.',
    ptRoom: 'Prophecy Room'
  },
  {
    id: 'daniel_7_13',
    category: 'PROPHETS',
    reference: 'Daniel 7:13-14',
    verse: 'One like the Son of man came with the clouds of heaven... and there was given him dominion.',
    difficulty: 'intermediate',
    motionElements: [
      { id: 'son_of_man', label: 'SON OF MAN', christResolutionTags: ['COVENANT_CENTER', 'PRIESTLY_MEDIATION'], correctTarget: 'throne_anchor' },
      { id: 'clouds', label: 'CLOUDS', christResolutionTags: ['SACRIFICIAL_AUTHORITY'], correctTarget: 'son_of_man' },
      { id: 'dominion', label: 'DOMINION', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'throne_anchor' },
      { id: 'kingdom', label: 'KINGDOM', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'dominion' },
      { id: 'glory', label: 'GLORY', christResolutionTags: ['SACRIFICIAL_AUTHORITY'], correctTarget: 'throne_anchor' },
    ],
    christAnchor: {
      id: 'throne_anchor',
      label: 'ENTHRONED MEDIATOR',
      icon: 'throne',
      description: 'Christ receives the eternal kingdom'
    },
    requiredConnections: [
      { from: 'son_of_man', to: 'throne_anchor', description: 'The Son of Man approaches the throne' },
      { from: 'dominion', to: 'throne_anchor', description: 'Dominion is given to Christ' },
      { from: 'kingdom', to: 'dominion', description: 'The kingdom is His dominion' },
    ],
    falseCenters: [
      { id: 'nation_false', label: 'NATION', type: 'NATION_ONLY' },
      { id: 'power_false', label: 'POWER', type: 'SYMBOL_ONLY' },
      { id: 'chronology_false', label: 'CHRONOLOGY ONLY', type: 'CHRONOLOGY' },
    ],
    lesson: 'Kingdom only stabilizes when authority is Christ-centered, not time-centered.',
    christFocusSummary: 'Daniel sees Christ receiving eternal dominion from the Father. The kingdom is not about timelines but about Christ\'s authority.',
    ptRoom: 'Prophecy Room'
  },
  {
    id: 'zechariah_12_10',
    category: 'PROPHETS',
    reference: 'Zechariah 12:10',
    verse: 'They shall look upon me whom they have pierced, and they shall mourn for him.',
    difficulty: 'master',
    motionElements: [
      { id: 'look', label: 'LOOK', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'pierced_anchor' },
      { id: 'me', label: 'ME (YAHWEH)', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'pierced_anchor' },
      { id: 'pierced', label: 'PIERCED', christResolutionTags: ['SUBSTITUTION', 'JUDGMENT_THROUGH_CROSS'], correctTarget: 'pierced_anchor' },
      { id: 'mourn', label: 'MOURN', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'look' },
      { id: 'him', label: 'HIM', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'pierced_anchor' },
    ],
    christAnchor: {
      id: 'pierced_anchor',
      label: 'PIERCED YAHWEH',
      icon: 'cross',
      description: 'God Himself is pierced'
    },
    requiredConnections: [
      { from: 'me', to: 'pierced_anchor', description: 'Yahweh is the one pierced' },
      { from: 'pierced', to: 'pierced_anchor', description: 'The piercing identifies Christ' },
      { from: 'look', to: 'pierced_anchor', description: 'Looking to the pierced one' },
    ],
    falseCenters: [
      { id: 'israel_false', label: 'ISRAEL ONLY', type: 'NATION_ONLY' },
      { id: 'future_false', label: 'FUTURE ONLY', type: 'CHRONOLOGY' },
    ],
    lesson: 'Yahweh Himself is pierced - proving Christ is God.',
    christFocusSummary: 'Zechariah prophesies that Yahweh Himself will be pierced. This proves Christ\'s deity - He is the pierced God whom all will see.',
    ptRoom: 'Blue Room'
  },
];

// ============================================
// GOSPELS LEVELS (FULFILLMENT)
// ============================================

const gospelsLevels: CRLevel[] = [
  {
    id: 'john_1_29',
    category: 'GOSPELS',
    reference: 'John 1:29',
    verse: 'Behold the Lamb of God, which taketh away the sin of the world.',
    difficulty: 'beginner',
    motionElements: [
      { id: 'behold', label: 'BEHOLD', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'lamb_anchor' },
      { id: 'lamb', label: 'LAMB', christResolutionTags: ['TYPE_TO_CHRIST', 'SUBSTITUTION'], correctTarget: 'lamb_anchor' },
      { id: 'god', label: 'OF GOD', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'lamb' },
      { id: 'takes_away', label: 'TAKES AWAY', christResolutionTags: ['ATONEMENT', 'SUBSTITUTION'], correctTarget: 'lamb_anchor' },
      { id: 'sin', label: 'SIN', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'takes_away' },
      { id: 'world', label: 'WORLD', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'sin' },
    ],
    christAnchor: {
      id: 'lamb_anchor',
      label: 'ATONING LAMB',
      icon: 'lamb',
      description: 'Christ the Lamb removes sin'
    },
    requiredConnections: [
      { from: 'lamb', to: 'lamb_anchor', description: 'Jesus is the Lamb' },
      { from: 'takes_away', to: 'lamb_anchor', description: 'The Lamb takes away sin' },
      { from: 'sin', to: 'takes_away', description: 'Sin is removed' },
    ],
    falseCenters: [
      { id: 'teacher_false', label: 'MORAL TEACHER', type: 'MORALITY' },
      { id: 'deliverer_false', label: 'NATIONAL DELIVERER', type: 'NATION_ONLY' },
    ],
    lesson: 'Sin disappears only through Lamb-centered removal.',
    christFocusSummary: 'John identifies Jesus as the fulfillment of all sacrificial lambs. He alone takes away sin - not teaches against it or delivers from its consequences.',
    ptRoom: 'Blue Room'
  },
  {
    id: 'luke_23_34',
    category: 'GOSPELS',
    reference: 'Luke 23:34',
    verse: 'Father, forgive them; for they know not what they do.',
    difficulty: 'intermediate',
    motionElements: [
      { id: 'father', label: 'FATHER', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'priest_anchor' },
      { id: 'forgive', label: 'FORGIVE', christResolutionTags: ['PRIESTLY_MEDIATION', 'ATONEMENT'], correctTarget: 'priest_anchor' },
      { id: 'them', label: 'THEM', christResolutionTags: ['JUDGMENT_THROUGH_CROSS'], correctTarget: 'forgive' },
      { id: 'know_not', label: 'KNOW NOT', christResolutionTags: [], correctTarget: 'them' },
      { id: 'intercession', label: 'INTERCESSION', christResolutionTags: ['PRIESTLY_MEDIATION'], correctTarget: 'priest_anchor' },
    ],
    christAnchor: {
      id: 'priest_anchor',
      label: 'INTERCEDING HIGH PRIEST',
      icon: 'high_priest',
      description: 'Christ intercedes for sinners'
    },
    requiredConnections: [
      { from: 'forgive', to: 'priest_anchor', description: 'Forgiveness through priestly intercession' },
      { from: 'intercession', to: 'priest_anchor', description: 'Christ intercedes as High Priest' },
      { from: 'them', to: 'forgive', description: 'They receive forgiveness' },
    ],
    falseCenters: [
      { id: 'ignorance_false', label: 'IGNORANCE', type: 'IGNORANCE' },
      { id: 'intent_false', label: 'GOOD INTENT', type: 'EMOTION_ONLY' },
    ],
    lesson: 'Forgiveness stabilizes through priestly mediation, not excuses.',
    christFocusSummary: 'Jesus intercedes as High Priest while being sacrificed as Lamb. Forgiveness comes through His mediation, not through their ignorance.',
    ptRoom: 'Blue Room'
  },
  {
    id: 'john_19_30',
    category: 'GOSPELS',
    reference: 'John 19:30',
    verse: 'It is finished.',
    difficulty: 'master',
    motionElements: [
      { id: 'it', label: 'IT', christResolutionTags: ['ATONEMENT', 'SUBSTITUTION'], correctTarget: 'finished_anchor' },
      { id: 'is', label: 'IS', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'finished_anchor' },
      { id: 'finished', label: 'FINISHED', christResolutionTags: ['ATONEMENT', 'SUBSTITUTION', 'JUDGMENT_THROUGH_CROSS'], correctTarget: 'finished_anchor' },
      { id: 'debt', label: 'DEBT PAID', christResolutionTags: ['SUBSTITUTION'], correctTarget: 'finished' },
      { id: 'prophecy', label: 'PROPHECY FULFILLED', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'finished' },
      { id: 'work', label: 'WORK COMPLETE', christResolutionTags: ['ATONEMENT'], correctTarget: 'finished' },
    ],
    christAnchor: {
      id: 'finished_anchor',
      label: 'COMPLETED ATONEMENT',
      icon: 'cross',
      description: 'The work of salvation is complete'
    },
    requiredConnections: [
      { from: 'finished', to: 'finished_anchor', description: 'Tetelestai - completely finished' },
      { from: 'debt', to: 'finished', description: 'The debt is paid in full' },
      { from: 'prophecy', to: 'finished', description: 'All prophecy fulfilled' },
    ],
    falseCenters: [
      { id: 'beginning_false', label: 'JUST BEGINNING', type: 'CHRONOLOGY' },
      { id: 'partial_false', label: 'PARTIAL WORK', type: 'LAW_ONLY' },
    ],
    lesson: 'Nothing can be added to the finished work of Christ.',
    christFocusSummary: 'Tetelestai means paid in full. Christ\'s death completed all that was needed for salvation - nothing remains for us to add.',
    ptRoom: 'Blue Room'
  },
];

// ============================================
// REVELATION LEVELS (CONSUMMATION)
// ============================================

const revelationLevels: CRLevel[] = [
  {
    id: 'revelation_5_9',
    category: 'REVELATION',
    reference: 'Revelation 5:9',
    verse: 'Thou art worthy... for thou wast slain, and hast redeemed us to God by thy blood.',
    difficulty: 'intermediate',
    motionElements: [
      { id: 'worthy', label: 'WORTHY', christResolutionTags: ['SACRIFICIAL_AUTHORITY'], correctTarget: 'slain_lamb_anchor' },
      { id: 'slain', label: 'SLAIN', christResolutionTags: ['SUBSTITUTION', 'ATONEMENT'], correctTarget: 'slain_lamb_anchor' },
      { id: 'redeemed', label: 'REDEEMED', christResolutionTags: ['ATONEMENT', 'SUBSTITUTION'], correctTarget: 'blood' },
      { id: 'blood', label: 'BLOOD', christResolutionTags: ['SUBSTITUTION', 'ATONEMENT'], correctTarget: 'slain_lamb_anchor' },
      { id: 'nations', label: 'NATIONS', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'redeemed' },
    ],
    christAnchor: {
      id: 'slain_lamb_anchor',
      label: 'SLAIN-YET-REIGNING LAMB',
      icon: 'throne',
      description: 'The Lamb who was slain now reigns'
    },
    requiredConnections: [
      { from: 'worthy', to: 'slain_lamb_anchor', description: 'Worthiness comes from being slain' },
      { from: 'slain', to: 'slain_lamb_anchor', description: 'The Lamb was slain' },
      { from: 'blood', to: 'slain_lamb_anchor', description: 'Redemption through blood' },
    ],
    falseCenters: [
      { id: 'victory_false', label: 'VICTORY WITHOUT CROSS', type: 'SYMBOL_ONLY' },
      { id: 'ethnic_false', label: 'ETHNIC IDENTITY', type: 'NATION_ONLY' },
    ],
    lesson: 'Worship destabilizes unless victory passes through sacrifice.',
    christFocusSummary: 'Heaven worships the Lamb because He was slain. Authority comes through sacrifice, not despite it. The cross is the source of Christ\'s reign.',
    ptRoom: 'Blue Room'
  },
  {
    id: 'revelation_14_12',
    category: 'REVELATION',
    reference: 'Revelation 14:12',
    verse: 'Here are they that keep the commandments of God, and the faith of Jesus.',
    difficulty: 'master',
    motionElements: [
      { id: 'keep', label: 'KEEP', christResolutionTags: ['LAW_THROUGH_CHRIST'], correctTarget: 'faith_anchor' },
      { id: 'commandments', label: 'COMMANDMENTS', christResolutionTags: ['LAW_THROUGH_CHRIST'], correctTarget: 'faith_anchor' },
      { id: 'god', label: 'OF GOD', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'commandments' },
      { id: 'faith', label: 'FAITH', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'faith_anchor' },
      { id: 'jesus', label: 'OF JESUS', christResolutionTags: ['SUBSTITUTION', 'PRIESTLY_MEDIATION'], correctTarget: 'faith' },
    ],
    christAnchor: {
      id: 'faith_anchor',
      label: 'FAITH OF JESUS',
      icon: 'mediator',
      description: 'Christ\'s faithfulness is the center'
    },
    requiredConnections: [
      { from: 'faith', to: 'faith_anchor', description: 'Faith of Jesus is central' },
      { from: 'commandments', to: 'faith_anchor', description: 'Commandments orbit Christ\'s faith' },
      { from: 'jesus', to: 'faith', description: 'It is Jesus\'s faith' },
    ],
    falseCenters: [
      { id: 'law_only_false', label: 'LAW-ONLY OBEDIENCE', type: 'LAW_ONLY' },
      { id: 'human_faith_false', label: 'HUMAN PERFORMANCE', type: 'OBEDIENCE' },
    ],
    lesson: 'Law stabilizes only when orbiting Christ\'s faith, not human performance.',
    christFocusSummary: 'The saints are characterized by two things in proper order: God\'s commandments kept through the faith OF Jesus - His faithfulness, not merely faith IN Him.',
    ptRoom: 'Blue Room'
  },
  {
    id: 'revelation_22_13',
    category: 'REVELATION',
    reference: 'Revelation 22:13',
    verse: 'I am Alpha and Omega, the beginning and the end, the first and the last.',
    difficulty: 'master',
    motionElements: [
      { id: 'alpha', label: 'ALPHA', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'eternal_anchor' },
      { id: 'omega', label: 'OMEGA', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'eternal_anchor' },
      { id: 'beginning', label: 'BEGINNING', christResolutionTags: ['COVENANT_CENTER'], correctTarget: 'eternal_anchor' },
      { id: 'end', label: 'END', christResolutionTags: ['PROMISE_FULFILLED_IN_CHRIST'], correctTarget: 'eternal_anchor' },
      { id: 'first', label: 'FIRST', christResolutionTags: ['SACRIFICIAL_AUTHORITY'], correctTarget: 'eternal_anchor' },
      { id: 'last', label: 'LAST', christResolutionTags: ['SACRIFICIAL_AUTHORITY'], correctTarget: 'eternal_anchor' },
    ],
    christAnchor: {
      id: 'eternal_anchor',
      label: 'ETERNAL CHRIST',
      icon: 'throne',
      description: 'Christ encompasses all of history'
    },
    requiredConnections: [
      { from: 'alpha', to: 'eternal_anchor', description: 'Christ is the beginning' },
      { from: 'omega', to: 'eternal_anchor', description: 'Christ is the end' },
      { from: 'first', to: 'eternal_anchor', description: 'Christ is first' },
      { from: 'last', to: 'eternal_anchor', description: 'Christ is last' },
    ],
    falseCenters: [
      { id: 'history_false', label: 'HISTORY ITSELF', type: 'CHRONOLOGY' },
      { id: 'events_false', label: 'EVENTS', type: 'SYMBOL_ONLY' },
    ],
    lesson: 'All history finds its meaning only in Christ.',
    christFocusSummary: 'Christ is not merely in history - He IS history\'s meaning. All beginnings and endings find their purpose in Him alone.',
    ptRoom: 'Blue Room'
  },
];

// ============================================
// COMBINED LEVELS
// ============================================

export const allCRLevels: CRLevel[] = [
  ...torahLevels,
  ...prophetsLevels,
  ...gospelsLevels,
  ...revelationLevels,
];

export const getLevelsByCategory = (category: LevelCategory): CRLevel[] => {
  return allCRLevels.filter(level => level.category === category);
};

export const getLevelsByDifficulty = (difficulty: Difficulty): CRLevel[] => {
  return allCRLevels.filter(level => level.difficulty === difficulty);
};

export const getLevelById = (id: string): CRLevel | undefined => {
  return allCRLevels.find(level => level.id === id);
};

// ============================================
// UI FEEDBACK MESSAGES
// ============================================

export const feedbackMessages = {
  soft: [
    "This center does not resolve the verse.",
    "Something essential is missing.",
    "Try centering this through Christ.",
    "The connection doesn't quite fit.",
  ],
  medium: [
    "This alignment bypasses Christ.",
    "The verse remains unstable.",
    "This path leads away from the center.",
    "The structure wavers without Christ.",
  ],
  strong: [
    "Christ is not yet in focus.",
    "This structure cannot stand.",
    "The verse will not converge here.",
  ],
  success: [
    "The verse has converged.",
    "Christ is now in focus.",
    "Stability achieved.",
    "The center holds.",
  ],
  levelComplete: [
    "What could not be centered without Christ?",
    "The verse reveals its true meaning.",
    "All elements find their place in Him.",
  ],
};

// ============================================
// FALSE CENTER DESCRIPTIONS
// ============================================

export const falseCenterDescriptions: Record<FalseCenterType, string> = {
  LAW_ONLY: "Law without Christ leads to endless striving.",
  SYMBOL_ONLY: "Symbols without Christ are empty shells.",
  NATION_ONLY: "National identity cannot save.",
  EMOTION_ONLY: "Feelings without truth are unstable.",
  OBEDIENCE: "Obedience cannot precede grace.",
  MORALITY: "Moral teaching cannot atone.",
  RITUAL: "Ritual without meaning is dead.",
  CHRONOLOGY: "Timelines without Christ miss the point.",
  IGNORANCE: "Ignorance does not excuse sin.",
};

// ============================================
// SCORING CONFIGURATION
// ============================================

export const scoringConfig = {
  correctConnection: 100,
  speedBonus: {
    fast: 50,      // Under 3 seconds
    medium: 25,    // Under 6 seconds
    slow: 0,       // Over 6 seconds
  },
  stabilityBonus: 200,        // All elements locked
  purityBonus: 100,           // No false centers attempted
  falseCenterPenalty: -50,    // Each false center attempt
  streakMultiplier: 1.5,      // Applied after 3 correct in a row
};
