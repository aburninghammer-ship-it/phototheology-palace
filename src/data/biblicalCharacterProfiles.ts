// Biblical Character Therapy Profiles - 270 Characters with Situation Analysis

import { characterBatch1 } from "./characterBatch1";
import { characterBatch2 } from "./characterBatch2";
import { characterBatch3 } from "./characterBatch3";
import { characterBatch4 } from "./characterBatch4";
import { characterBatch5 } from "./characterBatch5";

export type Archetype = "Shepherd" | "Warrior" | "Prophet" | "Strategist" | "Survivor" | "Redeemed" | "Seeker" | "Manipulator" | "Oppressor" | "Tragic Hero" | "Servant" | "Matriarch" | "Patriarch" | "Judge" | "King" | "Priest" | "Missionary" | "Builder" | "Exile" | "Martyr";

export type SituationCategory = "Temptation" | "Rejection" | "Leadership Pressure" | "Correction" | "Fear" | "Betrayal" | "Waiting" | "Power and Success" | "Loss" | "Conflict" | "Faith Testing" | "Obedience" | "Sacrifice" | "Restoration" | "Calling" | "Persecution";

export type Era = "Creation" | "Patriarchs" | "Exodus" | "Conquest" | "Judges" | "United Kingdom" | "Divided Kingdom" | "Exile" | "Post-Exile" | "Intertestamental" | "Gospels" | "Early Church";

export interface CharacterDNA {
  faith: number;
  humility: number;
  courage: number;
  wisdom: number;
  compassion: number;
  fear: number;
  pride: number;
  greed: number;
}

export interface SituationAnalysis {
  id: string;
  title: string;
  category: SituationCategory;
  reference: string;
  keyVerse?: string;
  situation: string;
  pressure: string;
  innerBattle: string;
  response: string;
  outcome: string;
  lesson: string;
  traitRevealed: string;
  spiritualPrinciple: string;
  reflectionQuestions: string[];
  dnaSnapshot?: Partial<CharacterDNA>;
}

export interface JourneyPhase {
  phase: "Calling" | "Resistance" | "Testing" | "Failure" | "Refinement" | "Legacy";
  description: string;
}

export interface Relationship {
  name: string;
  role: string;
}

export interface QuickCard {
  archetype: Archetype;
  strength: string;
  weakness: string;
  mindset: string;
  keyLesson: string;
  keyVerse: string;
  keyVerseRef: string;
}

export interface TherapyView {
  drivingFears: string[];
  coreMotivations: string[];
  relationalStyle: string;
  blindSpots: string[];
  healingMoments: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  meaning: string;
  emoji: string;
  role: string;
  era: Era;
  testament: "OT" | "NT";
  keyScriptures: string[];
  archetypes: Archetype[];
  dna: CharacterDNA;
  quickCard: QuickCard;
  storyArc: string;
  therapyView: TherapyView;
  strengths: string[];
  weaknesses: string[];
  journey: JourneyPhase[];
  relationships: Relationship[];
  lessonsAndReflection: string[];
  relatedCharacters: string[];
  situations: SituationAnalysis[];
  imageUrl?: string;
}

const coreCharacters: CharacterProfile[] = [
  // ============================================
  // CORE 20 CHARACTERS
  // ============================================
  {
    id: "david",
    name: "David",
    meaning: "Beloved",
    emoji: "👑",
    role: "King of Israel, Psalmist",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 16-31", "2 Samuel", "Psalms"],
    archetypes: ["Shepherd", "Warrior", "Redeemed"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 4, fear: 2, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Shepherd",
      strength: "Courage and worship",
      weakness: "Impulsive desire",
      mindset: "God-centered faith",
      keyLesson: "Repentance restores relationship with God.",
      keyVerse: "Create in me a clean heart, O God; and renew a right spirit within me.",
      keyVerseRef: "Psalm 51:10"
    },
    storyArc: "A shepherd boy anointed king who defeated Goliath, united Israel, committed adultery and murder, repented deeply, and established a covenant dynasty pointing to the Messiah.",
    therapyView: {
      drivingFears: ["Losing God's favor", "Failing as king"],
      coreMotivations: ["Pleasing God", "Protecting Israel", "Worship"],
      relationalStyle: "Intensely loyal but emotionally volatile",
      blindSpots: ["Sexual desire", "Indulgent parenting", "Impulsive decisions"],
      healingMoments: ["Psalm 51 repentance", "Sparing Saul's life", "Dancing before the Ark"]
    },
    strengths: ["Unshakeable faith in God", "Military genius", "Deep worshipper", "Genuine repentance", "Loyalty to friends"],
    weaknesses: ["Lust and adultery", "Poor parenting", "Impulsive decisions", "Violence", "Census pride"],
    journey: [
      { phase: "Calling", description: "Anointed as a shepherd boy by Samuel" },
      { phase: "Resistance", description: "Persecuted by Saul for years" },
      { phase: "Testing", description: "Life as a fugitive, twice sparing Saul" },
      { phase: "Failure", description: "Adultery with Bathsheba, murder of Uriah" },
      { phase: "Refinement", description: "Deep repentance, loss of child, Absalom's rebellion" },
      { phase: "Legacy", description: "United Israel, Psalms, Messianic covenant" }
    ],
    relationships: [
      { name: "Jonathan", role: "Covenant friend" },
      { name: "Saul", role: "King and persecutor" },
      { name: "Bathsheba", role: "Wife (through sin)" },
      { name: "Nathan", role: "Prophet and corrector" },
      { name: "Absalom", role: "Rebellious son" },
      { name: "Samuel", role: "Anointing prophet" }
    ],
    lessonsAndReflection: [
      "How do you handle seasons of waiting between promise and fulfillment?",
      "What does genuine repentance look like in your life?",
      "Are there areas where success has made you spiritually careless?"
    ],
    relatedCharacters: ["saul-king", "jonathan", "solomon", "absalom", "bathsheba"],
    situations: [
      {
        id: "david-goliath",
        title: "David vs. Goliath",
        category: "Faith Testing",
        reference: "1 Samuel 17",
        keyVerse: "The LORD that delivered me out of the paw of the lion, and out of the paw of the bear, he will deliver me out of the hand of this Philistine. —1 Samuel 17:37",
        situation: "A teenage shepherd faces a nine-foot Philistine champion while the entire Israelite army cowers in fear.",
        pressure: "Mockery from his brothers, doubt from King Saul, a giant armed with sword, spear, and javelin. National disgrace if he fails.",
        innerBattle: "Fear of death versus trust in God's past faithfulness. The temptation to use Saul's armor (the world's methods) instead of trusting what God had already proven.",
        response: "David refuses Saul's armor, takes five stones and a sling, and runs toward Goliath declaring God's name.",
        outcome: "Goliath falls with a single stone. Israel routs the Philistines. David's faith becomes legendary.",
        lesson: "Past victories with God prepare you for present giants. Fight with the weapons God has already proven in your life.",
        traitRevealed: "Faith and courage",
        spiritualPrinciple: "God uses the weak and simple to confound the mighty.",
        reflectionQuestions: [
          "What giant are you facing that everyone else says is too big?",
          "Are you trying to fight with someone else's armor instead of your own proven faith?",
          "What past deliverances can you remember to build courage today?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4, fear: 1 }
      },
      {
        id: "david-bathsheba",
        title: "David and Bathsheba",
        category: "Temptation",
        reference: "2 Samuel 11",
        keyVerse: "And David sent messengers, and took her; and she came in unto him, and he lay with her. —2 Samuel 11:4",
        situation: "King David stays home during war season, sees Bathsheba bathing from his rooftop, and sends for her.",
        pressure: "Unchecked power, idle time, sexual desire, no accountability. He is king—no one will stop him.",
        innerBattle: "Desire versus duty. The knowledge that she is another man's wife versus the power to take what he wants without immediate consequence.",
        response: "David sends for Bathsheba, commits adultery, then orchestrates Uriah's death to cover it up.",
        outcome: "The child dies. Nathan confronts David. The sword never departs from his house. Absalom's rebellion follows.",
        lesson: "Unchecked power and idle seasons are the most dangerous combinations. Sin always costs more than you expect.",
        traitRevealed: "Lust and abuse of power",
        spiritualPrinciple: "God sees what kings try to hide. Consequences of sin extend far beyond the sinner.",
        reflectionQuestions: [
          "What idle seasons or unchecked power areas exist in your life?",
          "Are you where you're supposed to be spiritually, or have you stayed home from your battle?",
          "What accountability do you have to prevent moral failure?"
        ],
        dnaSnapshot: { faith: 1, pride: 4, wisdom: 1, fear: 1 }
      },
      {
        id: "david-spares-saul",
        title: "David Spares Saul in the Cave",
        category: "Leadership Pressure",
        reference: "1 Samuel 24",
        keyVerse: "The LORD forbid that I should do this thing unto my master, the LORD's anointed. —1 Samuel 24:6",
        situation: "Saul enters the exact cave where David is hiding. David's men urge him to kill Saul and take the throne now.",
        pressure: "Years of running. His men pressuring him. The perfect opportunity. Self-defense would be justified by anyone's standard.",
        innerBattle: "The temptation to take matters into his own hands versus trusting God's timing for the throne.",
        response: "David cuts Saul's robe but refuses to kill him, rebuking his own men for suggesting it.",
        outcome: "Saul weeps and acknowledges David will be king. David's integrity is preserved.",
        lesson: "Refusing to take shortcuts to God's promises preserves your integrity and God's timing.",
        traitRevealed: "Self-control and reverence for God's authority",
        spiritualPrinciple: "God's anointing is not permission to force God's timing.",
        reflectionQuestions: [
          "Where are you tempted to force an outcome God has promised but not yet delivered?",
          "Can you trust God's timing even when shortcuts seem justified?",
          "What does it cost you to wait for God to act?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, wisdom: 5, courage: 4 }
      },
      {
        id: "david-absalom-rebellion",
        title: "Absalom's Rebellion",
        category: "Betrayal",
        reference: "2 Samuel 15-18",
        keyVerse: "O my son Absalom, my son, my son Absalom! would God I had died for thee. —2 Samuel 18:33",
        situation: "David's own son Absalom steals the hearts of Israel and leads a coup, forcing David to flee Jerusalem barefoot and weeping.",
        pressure: "Betrayal by his own child. Loss of the throne. The bitter fruit of his own parenting failures. The army wants Absalom dead but David loves him.",
        innerBattle: "A father's love for his son versus the duty of a king to protect his kingdom. Grief over reaping what he has sown.",
        response: "David flees rather than fight his son in the city. He orders his generals to deal gently with Absalom.",
        outcome: "Absalom is killed by Joab. David is restored to the throne but is shattered by grief.",
        lesson: "Our greatest failures often produce consequences in those closest to us. Even restored sinners carry scars.",
        traitRevealed: "Parental love and grief",
        spiritualPrinciple: "Forgiven sin still has earthly consequences. The sword did not depart from David's house.",
        reflectionQuestions: [
          "What consequences of past decisions are you still living with?",
          "How do you balance justice and mercy with those who have hurt you?",
          "Are there parenting or leadership gaps that need attention before they become crises?"
        ],
        dnaSnapshot: { faith: 4, humility: 5, compassion: 5, fear: 3 }
      }
    ]
  },
  {
    id: "moses",
    name: "Moses",
    meaning: "Drawn out",
    emoji: "🔥",
    role: "Deliverer, Lawgiver, Prophet",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    archetypes: ["Prophet", "Shepherd"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 5, compassion: 4, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Meekness and intercession",
      weakness: "Anger and self-doubt",
      mindset: "Reluctant obedience that becomes bold faith",
      keyLesson: "God uses the reluctant and broken.",
      keyVerse: "Now the man Moses was very meek, above all the men which were upon the face of the earth.",
      keyVerseRef: "Numbers 12:3"
    },
    storyArc: "Born under a death sentence, raised in Pharaoh's palace, exiled as a murderer, called at 80 from a burning bush, confronted Pharaoh, led Israel through the wilderness for 40 years, but barred from the Promised Land for striking the rock.",
    therapyView: {
      drivingFears: ["Inadequacy", "Public speaking", "Failing God's people"],
      coreMotivations: ["Obedience to God", "Freedom for Israel", "Justice"],
      relationalStyle: "Deeply empathetic but prone to frustration under pressure",
      blindSpots: ["Anger when pushed past limits", "Trying to carry all burdens alone"],
      healingMoments: ["Burning bush encounter", "Face-to-face intimacy with God", "Song of Moses before death"]
    },
    strengths: ["Unmatched intimacy with God", "Intercession for enemies", "Meekness", "Perseverance", "Courage before Pharaoh"],
    weaknesses: ["Anger", "Self-doubt and excuse-making", "Striking the rock", "Initially reluctant"],
    journey: [
      { phase: "Calling", description: "Burning bush commission at age 80" },
      { phase: "Resistance", description: "Five excuses to avoid the mission" },
      { phase: "Testing", description: "Plagues, Red Sea, wilderness complaints" },
      { phase: "Failure", description: "Striking the rock in anger at Meribah" },
      { phase: "Refinement", description: "40 years of patient shepherding a rebellious people" },
      { phase: "Legacy", description: "The Torah, the Tabernacle, a nation formed" }
    ],
    relationships: [
      { name: "God", role: "Spoke face to face" },
      { name: "Aaron", role: "Brother and spokesman" },
      { name: "Miriam", role: "Sister" },
      { name: "Pharaoh", role: "Adversary" },
      { name: "Joshua", role: "Successor and protégé" },
      { name: "Jethro", role: "Father-in-law and advisor" }
    ],
    lessonsAndReflection: [
      "Have you ever felt too old or inadequate for God's calling?",
      "Where does anger threaten to disqualify you from your promise?",
      "Are you trying to lead alone instead of delegating?"
    ],
    relatedCharacters: ["aaron", "joshua", "pharaoh-exodus", "miriam"],
    situations: [
      {
        id: "moses-burning-bush",
        title: "The Burning Bush",
        category: "Calling",
        reference: "Exodus 3-4",
        keyVerse: "Who am I, that I should go unto Pharaoh, and that I should bring forth the children of Israel out of Egypt? —Exodus 3:11",
        situation: "After 40 years of shepherding in the desert, God appears in a burning bush and commands Moses to return to Egypt.",
        pressure: "Moses is 80 years old. He fled Egypt as a wanted murderer. He has a speech impediment. The task seems impossible.",
        innerBattle: "Deep inadequacy versus God's direct command. The comfort of obscurity versus the danger of obedience.",
        response: "Moses offers five excuses—Who am I? What is Your name? They won't believe me. I can't speak. Send someone else. But ultimately he goes.",
        outcome: "Moses becomes the greatest prophet of the Old Testament and delivers an entire nation.",
        lesson: "God's calling doesn't require your confidence—it requires your obedience. Every excuse has an answer in God.",
        traitRevealed: "Humility and reluctance transformed into obedience",
        spiritualPrinciple: "God doesn't call the equipped—He equips the called.",
        reflectionQuestions: [
          "What excuses are you giving God for not stepping into your calling?",
          "Is your reluctance humility or disobedience?",
          "What burning bush moment have you been ignoring?"
        ],
        dnaSnapshot: { faith: 3, humility: 5, courage: 2, fear: 4 }
      },
      {
        id: "moses-red-sea",
        title: "Crossing the Red Sea",
        category: "Leadership Pressure",
        reference: "Exodus 14",
        keyVerse: "Stand still, and see the salvation of the LORD. —Exodus 14:13",
        situation: "Israel is trapped between the Red Sea and Pharaoh's advancing army. The people panic and blame Moses.",
        pressure: "Millions of terrified people. An army behind them. Water in front. Moses has no military or naval solution.",
        innerBattle: "The weight of leading people who blame you for their situation. Trusting God for the literally impossible.",
        response: "Moses tells the people to stand still and watch God work. He lifts his rod and God parts the sea.",
        outcome: "Israel crosses on dry ground. The Egyptian army is destroyed. Israel sings the first recorded worship song.",
        lesson: "Sometimes the only path forward is the one God creates in the moment. Leadership means trusting God when there is no plan B.",
        traitRevealed: "Faith under impossible pressure",
        spiritualPrinciple: "God's deliverance often requires you to reach the point of absolute impossibility first.",
        reflectionQuestions: [
          "Where in your life are you trapped between the sea and the army?",
          "Can you stand still when everyone around you is panicking?",
          "What impossible situation is God asking you to walk into?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 4, fear: 2 }
      },
      {
        id: "moses-strikes-rock",
        title: "Moses Strikes the Rock",
        category: "Leadership Pressure",
        reference: "Numbers 20:1-13",
        keyVerse: "Because ye believed me not, to sanctify me in the eyes of the children of Israel. —Numbers 20:12",
        situation: "After decades of complaints, Israel again demands water. God tells Moses to speak to the rock, but Moses strikes it twice in anger.",
        pressure: "40 years of ingratitude. His sister Miriam just died. The same complaints, the same faithlessness, again.",
        innerBattle: "Exhaustion and fury versus obedience. The temptation to act out of frustration rather than faith.",
        response: "Moses strikes the rock twice and takes credit: 'Must WE fetch you water?'",
        outcome: "Water flows, but God bars Moses from entering the Promised Land.",
        lesson: "How you represent God matters as much as whether you get results. Anger in leadership can disqualify you from your greatest reward.",
        traitRevealed: "Anger and presumption",
        spiritualPrinciple: "Leaders are held to a higher standard. Misrepresenting God's character has consequences.",
        reflectionQuestions: [
          "Has frustration ever caused you to misrepresent God to others?",
          "What Promised Land might your anger cost you?",
          "Are you burned out from carrying burdens God never asked you to carry alone?"
        ],
        dnaSnapshot: { faith: 3, pride: 3, courage: 4, wisdom: 2 }
      }
    ]
  },
  {
    id: "joseph",
    name: "Joseph",
    meaning: "He will add",
    emoji: "🧥",
    role: "Patriarch, Governor of Egypt",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 37-50"],
    archetypes: ["Survivor", "Strategist"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 5, compassion: 5, fear: 1, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "Integrity under pressure",
      weakness: "Youthful naivety (early)",
      mindset: "God meant it for good",
      keyLesson: "Faithfulness in darkness positions you for God's purpose.",
      keyVerse: "Ye thought evil against me; but God meant it unto good.",
      keyVerseRef: "Genesis 50:20"
    },
    storyArc: "Favored son sold into slavery by jealous brothers, falsely accused in Potiphar's house, forgotten in prison, elevated to second in command of Egypt, and ultimately reconciled with his family—seeing God's providence through every injustice.",
    therapyView: {
      drivingFears: ["Being forgotten", "Injustice without resolution"],
      coreMotivations: ["Integrity before God", "Providential purpose", "Family reconciliation"],
      relationalStyle: "Emotionally deep but controlled; tests trust before vulnerability",
      blindSpots: ["Youthful boasting about dreams (early)", "Potential bitterness from prolonged suffering"],
      healingMoments: ["Naming sons Manasseh and Ephraim", "Weeping when revealing himself to brothers", "Forgiving brothers"]
    },
    strengths: ["Unwavering integrity", "Administrative brilliance", "Faith through suffering", "Emotional depth", "Forgiveness"],
    weaknesses: ["Youthful pride in sharing dreams", "Potential isolation from emotional control"],
    journey: [
      { phase: "Calling", description: "Prophetic dreams of family bowing to him" },
      { phase: "Resistance", description: "Brothers' hatred and betrayal" },
      { phase: "Testing", description: "Slavery, Potiphar's wife, prison" },
      { phase: "Failure", description: "No personal moral failure—but tested by injustice and forgetting" },
      { phase: "Refinement", description: "Years in prison, interpreting dreams, waiting" },
      { phase: "Legacy", description: "Saved Egypt and Israel from famine, reconciled family" }
    ],
    relationships: [
      { name: "Jacob", role: "Favoring father" },
      { name: "Brothers", role: "Betrayers turned reconciled family" },
      { name: "Potiphar", role: "Master" },
      { name: "Pharaoh", role: "King who elevated him" },
      { name: "Asenath", role: "Wife" },
      { name: "Benjamin", role: "Beloved younger brother" }
    ],
    lessonsAndReflection: [
      "How do you respond when life is deeply unfair?",
      "Can you serve faithfully in a place you didn't choose?",
      "What would it take for you to forgive those who deeply wronged you?"
    ],
    relatedCharacters: ["jacob", "benjamin", "judah", "pharaoh-exodus"],
    situations: [
      {
        id: "joseph-potiphars-wife",
        title: "Potiphar's Wife",
        category: "Temptation",
        reference: "Genesis 39",
        keyVerse: "How then can I do this great wickedness, and sin against God? —Genesis 39:9",
        situation: "Joseph is alone in a position of trust inside Potiphar's house, and Potiphar's wife repeatedly tries to seduce him.",
        pressure: "Joseph is far from home, vulnerable, young, and powerless in Egypt. Saying yes would offer temporary pleasure. Saying no risks losing everything.",
        innerBattle: "Sexual temptation, loneliness, opportunity without witnesses, fear of consequences either way, the temptation to justify compromise.",
        response: "Joseph refuses before the final crisis even happens. He sets moral boundaries early. Then when she grabs him, he runs.",
        outcome: "Joseph loses his garment, his reputation, and his freedom. He is falsely accused and sent to prison.",
        lesson: "Integrity may cost you in the short term, but compromise would cost more. Righteousness is not merely resisting sin at the last second—it is recognizing evil clearly and refusing to stay near it.",
        traitRevealed: "Integrity and fear of God",
        spiritualPrinciple: "Flee temptation. Distance is the strategy, not negotiation.",
        reflectionQuestions: [
          "What kind of temptation do you tend to underestimate because it is private?",
          "Do you try to resist sin while staying too close to it?",
          "What are you willing to lose in order to keep integrity?",
          "Have you mistaken immediate suffering for divine abandonment?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 5, fear: 1 }
      },
      {
        id: "joseph-sold-by-brothers",
        title: "Sold by His Brothers",
        category: "Betrayal",
        reference: "Genesis 37:12-36",
        situation: "Joseph's brothers strip him of his coat, throw him in a pit, and sell him to Midianite traders headed for Egypt.",
        pressure: "Absolute helplessness. Betrayed by family. Facing slavery or death at age 17.",
        innerBattle: "Terror, confusion, the question of whether God's dreams were lies, the seed of bitterness.",
        response: "The text records no resistance or cursing. Joseph endures and eventually thrives in Egypt.",
        outcome: "Joseph enters slavery but God's hand remains on him. His journey to Egypt ultimately saves his entire family.",
        lesson: "The worst betrayal in your life may be the vehicle God uses to position you for your greatest purpose.",
        traitRevealed: "Resilience and quiet faith",
        spiritualPrinciple: "God's providence works through human evil without endorsing it.",
        reflectionQuestions: [
          "Has someone close to you betrayed you in a way that still shapes your life?",
          "Can you see any redemptive purpose in your deepest wounds?",
          "Are you carrying bitterness that's blocking God's larger plan?"
        ],
        dnaSnapshot: { faith: 4, humility: 4, courage: 3, fear: 3 }
      },
      {
        id: "joseph-prison-waiting",
        title: "Forgotten in Prison",
        category: "Waiting",
        reference: "Genesis 40:1-23",
        keyVerse: "Yet did not the chief butler remember Joseph, but forgat him. —Genesis 40:23",
        situation: "Joseph correctly interprets the butler's dream and asks to be remembered. The butler forgets him for two full years.",
        pressure: "False imprisonment. Faithful service unrewarded. The one connection to freedom forgets him completely.",
        innerBattle: "Despair versus hope. The question: Does God see me? Has He forgotten me too?",
        response: "Joseph continues serving faithfully in prison. When called before Pharaoh two years later, he credits God, not himself.",
        outcome: "Joseph is elevated from prison to palace in a single day when God's timing arrives.",
        lesson: "God's delays are not God's denials. Faithfulness in forgotten seasons is preparation for sudden promotion.",
        traitRevealed: "Patience and faith in God's timing",
        spiritualPrinciple: "God's timing is precise even when it feels unbearably slow.",
        reflectionQuestions: [
          "Where in your life does it feel like God has forgotten you?",
          "Are you still serving faithfully in your 'prison' season?",
          "Can you trust that God's delay is preparation, not punishment?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, wisdom: 4, fear: 2 }
      },
      {
        id: "joseph-reveals-himself",
        title: "Joseph Reveals Himself to His Brothers",
        category: "Restoration",
        reference: "Genesis 45",
        keyVerse: "I am Joseph your brother, whom ye sold into Egypt. Now therefore be not grieved. —Genesis 45:4-5",
        situation: "After testing his brothers' character, Joseph can no longer contain himself and reveals his identity with weeping.",
        pressure: "Enormous power over the men who destroyed his youth. The option of revenge, justice, or mercy.",
        innerBattle: "Years of pain versus the desire for reconciliation. Justice versus grace.",
        response: "Joseph chooses forgiveness and reconciliation, weeping so loudly the Egyptians hear it.",
        outcome: "The family is reunited. Israel is preserved during famine. Joseph sees God's sovereign purpose.",
        lesson: "Forgiveness is not weakness—it is the final victory over what was done to you.",
        traitRevealed: "Forgiveness and spiritual perspective",
        spiritualPrinciple: "God can transform human evil into providential good.",
        reflectionQuestions: [
          "Do you interpret suffering through resentment or through God's providence?",
          "What would forgiveness look like in your most painful relationship?",
          "Can you see God's hand in the worst chapters of your life?"
        ],
        dnaSnapshot: { faith: 5, compassion: 5, wisdom: 5, humility: 5 }
      }
    ]
  },
  {
    id: "peter",
    name: "Peter",
    meaning: "Rock",
    emoji: "🪨",
    role: "Apostle, Leader of the Early Church",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 16", "Luke 22", "John 21", "Acts 1-12", "1 Peter", "2 Peter"],
    archetypes: ["Redeemed", "Warrior"],
    dna: { faith: 4, humility: 3, courage: 4, wisdom: 3, compassion: 4, fear: 3, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Bold proclamation",
      weakness: "Impulsive and fearful under pressure",
      mindset: "Passionate follower who fails forward",
      keyLesson: "Failure does not disqualify you—denial of grace does.",
      keyVerse: "Lord, thou knowest all things; thou knowest that I love thee.",
      keyVerseRef: "John 21:17"
    },
    storyArc: "A fisherman who left everything to follow Jesus, made bold confessions and embarrassing mistakes, denied Christ three times, was restored by the risen Lord, and became the rock of the early church at Pentecost.",
    therapyView: {
      drivingFears: ["Being exposed as inadequate", "Abandonment", "Failure"],
      coreMotivations: ["Loyalty to Jesus", "Proving himself", "Leading boldly"],
      relationalStyle: "All-in, emotionally intense, first to speak and first to fail",
      blindSpots: ["Overestimating his own strength", "Acting before thinking", "People-pleasing under pressure"],
      healingMoments: ["Restoration at the charcoal fire (John 21)", "Pentecost boldness", "Vision of the sheet (Acts 10)"]
    },
    strengths: ["Bold faith", "Willingness to step out", "Genuine love for Jesus", "Powerful preacher", "Resilient after failure"],
    weaknesses: ["Impulsive", "Fearful under social pressure", "Rebuking Jesus", "Denying Christ three times"],
    journey: [
      { phase: "Calling", description: "Called from fishing nets to follow Jesus" },
      { phase: "Resistance", description: "Trying to fit Jesus into his own expectations" },
      { phase: "Testing", description: "Walking on water, confessing Christ, Gethsemane" },
      { phase: "Failure", description: "Three denials of Jesus" },
      { phase: "Refinement", description: "Restoration by Jesus, Pentecost transformation" },
      { phase: "Legacy", description: "Leader of the early church, martyrdom" }
    ],
    relationships: [
      { name: "Jesus", role: "Master and restorer" },
      { name: "Andrew", role: "Brother" },
      { name: "John", role: "Fellow inner-circle disciple" },
      { name: "Paul", role: "Fellow apostle (sometimes in tension)" }
    ],
    lessonsAndReflection: [
      "Have you ever overestimated your spiritual strength?",
      "How has Jesus restored you after failure?",
      "Are you willing to step out of the boat even when you might sink?"
    ],
    relatedCharacters: ["jesus", "paul", "john-apostle", "andrew"],
    situations: [
      {
        id: "peter-walks-on-water",
        title: "Walking on Water",
        category: "Faith Testing",
        reference: "Matthew 14:22-33",
        keyVerse: "Lord, if it be thou, bid me come unto thee on the water. —Matthew 14:28",
        situation: "The disciples are in a storm. Jesus walks on the water toward them. Peter asks to come to Him.",
        pressure: "Violent storm, nighttime, fear of drowning, the other disciples watching.",
        innerBattle: "Bold faith pulling him out of the boat versus the reality of wind and waves pulling him under.",
        response: "Peter steps out and walks on water—then looks at the waves and begins to sink. He cries out and Jesus catches him.",
        outcome: "Peter is the only disciple who walked on water, even though he also sank. Jesus questions his doubt, not his attempt.",
        lesson: "Peter's sinking doesn't define him—his stepping out does. Jesus never rebuked him for trying, only for doubting.",
        traitRevealed: "Bold faith mixed with wavering focus",
        spiritualPrinciple: "Faith works as long as your eyes are on Jesus. The moment you focus on the storm, you sink.",
        reflectionQuestions: [
          "Are you still in the boat while God is calling you to step out?",
          "What waves are causing you to take your eyes off Jesus?",
          "Would you rather sink trying or stay safe and never walk on water?"
        ],
        dnaSnapshot: { faith: 4, courage: 5, fear: 3, humility: 3 }
      },
      {
        id: "peter-denial",
        title: "Peter's Denial of Christ",
        category: "Fear",
        reference: "Luke 22:54-62",
        keyVerse: "And the Lord turned, and looked upon Peter. And Peter went out, and wept bitterly. —Luke 22:61-62",
        situation: "After Jesus' arrest, Peter follows at a distance and is identified three times as a follower of Jesus.",
        pressure: "Jesus is arrested. The disciples have scattered. Peter is surrounded by hostile strangers. His life may be at risk.",
        innerBattle: "Love for Jesus versus fear of death. The man who said he would die for Jesus cannot even admit knowing Him.",
        response: "Peter denies Jesus three times, the last time with cursing. Then the rooster crows and Jesus looks at him.",
        outcome: "Peter weeps bitterly. But unlike Judas, Peter's grief leads to repentance, not despair.",
        lesson: "The difference between Peter and Judas is not the size of the failure—it's the response afterward. Bitter tears of repentance lead to restoration.",
        traitRevealed: "Fear and cowardice under pressure",
        spiritualPrinciple: "Your worst moment does not have to be your final moment. Repentance reopens every door sin closes.",
        reflectionQuestions: [
          "Have you ever denied your faith under social pressure?",
          "What is the difference between Peter's response and Judas's response to failure?",
          "Is there a failure you believe disqualifies you that Jesus has already forgiven?"
        ],
        dnaSnapshot: { faith: 1, courage: 1, fear: 5, humility: 2 }
      },
      {
        id: "peter-restoration",
        title: "Restoration at the Charcoal Fire",
        category: "Restoration",
        reference: "John 21:15-19",
        keyVerse: "Simon, son of Jonas, lovest thou me? —John 21:17",
        situation: "After the resurrection, Jesus meets Peter on the beach—at a charcoal fire, just like the one where Peter denied Him.",
        pressure: "Shame, guilt, the memory of failure, the question of whether he's still qualified to lead.",
        innerBattle: "Self-condemnation versus accepting grace. Believing you're disqualified versus hearing Jesus recommission you.",
        response: "Peter answers three times that he loves Jesus—once for each denial. Jesus responds each time: Feed my sheep.",
        outcome: "Peter is fully restored and commissioned to lead the church. He becomes the preacher at Pentecost.",
        lesson: "Jesus doesn't just forgive—He restores. He brings you back to the exact place of your failure to replace shame with purpose.",
        traitRevealed: "Humility and love",
        spiritualPrinciple: "Grace meets you at the scene of your worst failure and gives you a new assignment.",
        reflectionQuestions: [
          "What 'charcoal fire' does Jesus need to take you back to?",
          "Can you accept restoration or are you holding onto self-punishment?",
          "What new assignment might Jesus have for you on the other side of failure?"
        ],
        dnaSnapshot: { faith: 4, humility: 5, compassion: 4, fear: 1 }
      }
    ]
  },
  {
    id: "paul",
    name: "Paul (Saul of Tarsus)",
    meaning: "Small / Humble",
    emoji: "⚡",
    role: "Apostle to the Gentiles, Missionary, Theologian",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 9-28", "Romans", "1-2 Corinthians", "Galatians", "Ephesians", "Philippians"],
    archetypes: ["Redeemed", "Missionary"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 4, fear: 1, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Theological brilliance and relentless mission",
      weakness: "Past persecution of believers; sharp in conflict",
      mindset: "To live is Christ, to die is gain",
      keyLesson: "No past is too dark for God's grace to transform.",
      keyVerse: "For me to live is Christ, and to die is gain.",
      keyVerseRef: "Philippians 1:21"
    },
    storyArc: "A Pharisee who hunted Christians was struck down on the Damascus road, converted by the risen Christ, and became the greatest missionary in history—planting churches across the Roman Empire while enduring beatings, shipwrecks, and imprisonment.",
    therapyView: {
      drivingFears: ["Failing to finish the race", "The church departing from truth"],
      coreMotivations: ["Spreading the gospel", "Knowing Christ", "Finishing well"],
      relationalStyle: "Intense mentor who builds deep bonds but can be confrontational",
      blindSpots: ["Sharp disagreements (Barnabas split)", "Difficulty with gentleness when truth is at stake"],
      healingMoments: ["Damascus road conversion", "Thorn in the flesh—grace is sufficient", "Final letter to Timothy"]
    },
    strengths: ["Theological depth", "Missionary endurance", "Church planting", "Teaching", "Suffering joyfully"],
    weaknesses: ["Sharp temper in disagreements", "Pre-conversion violence", "Possible rigidity"],
    journey: [
      { phase: "Calling", description: "Damascus road encounter with Christ" },
      { phase: "Resistance", description: "Three days blind; the church feared him" },
      { phase: "Testing", description: "Stoning, shipwrecks, beatings, imprisonments" },
      { phase: "Failure", description: "Sharp disagreement with Barnabas; thorn in the flesh humbling" },
      { phase: "Refinement", description: "Imprisonment letters reveal deepened theology and joy" },
      { phase: "Legacy", description: "13 epistles, churches across the Empire, martyrdom in Rome" }
    ],
    relationships: [
      { name: "Jesus", role: "Lord encountered on Damascus road" },
      { name: "Barnabas", role: "Early partner (later split)" },
      { name: "Timothy", role: "Spiritual son" },
      { name: "Luke", role: "Traveling companion and historian" },
      { name: "Silas", role: "Ministry partner" },
      { name: "Peter", role: "Fellow apostle" }
    ],
    lessonsAndReflection: [
      "Is there a past identity God is asking you to leave behind?",
      "Can you find joy in suffering for a purpose greater than yourself?",
      "What thorn in the flesh is teaching you to depend on God's grace?"
    ],
    relatedCharacters: ["peter", "barnabas", "timothy", "luke", "silas"],
    situations: [
      {
        id: "paul-damascus-road",
        title: "Damascus Road Conversion",
        category: "Calling",
        reference: "Acts 9:1-22",
        keyVerse: "Saul, Saul, why persecutest thou me? —Acts 9:4",
        situation: "Saul is traveling to Damascus to arrest Christians when a blinding light strikes him down and Christ speaks to him directly.",
        pressure: "His entire identity, career, and belief system are shattered in an instant. He has been fighting against God.",
        innerBattle: "Everything he believed was righteous—persecuting Christians—is revealed as rebellion against God Himself.",
        response: "Saul submits immediately: 'Lord, what wilt thou have me to do?' He fasts three days, is baptized, and begins preaching Christ.",
        outcome: "The greatest persecutor becomes the greatest missionary. The early church is stunned but eventually accepts him.",
        lesson: "God can redirect the most misdirected zeal into the most powerful ministry. No one is beyond conversion.",
        traitRevealed: "Capacity for radical change",
        spiritualPrinciple: "The same intensity that fuels your sin can fuel your service when redirected by God.",
        reflectionQuestions: [
          "Is there something you're passionately pursuing that might actually be opposing God?",
          "How quickly are you willing to abandon your plans when God reveals His?",
          "What 'Damascus road' experience has God used to redirect your life?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 4, pride: 1 }
      },
      {
        id: "paul-thorn-flesh",
        title: "Paul's Thorn in the Flesh",
        category: "Waiting",
        reference: "2 Corinthians 12:7-10",
        keyVerse: "My grace is sufficient for thee: for my strength is made perfect in weakness. —2 Corinthians 12:9",
        situation: "Paul is given a 'thorn in the flesh'—some persistent affliction—and pleads three times for God to remove it.",
        pressure: "A man who has been beaten, shipwrecked, and stoned still has something God will not remove. The strongest believer has a permanent weakness.",
        innerBattle: "Why would God leave His most effective servant in pain? The desire for relief versus trusting God's purpose in suffering.",
        response: "Paul accepts God's answer: 'My grace is sufficient.' He learns to glory in weakness.",
        outcome: "Paul's theology of grace deepens. He teaches the church that God's power is perfected in human weakness.",
        lesson: "Some prayers are answered with 'No' because the weakness serves a greater purpose than the healing would.",
        traitRevealed: "Humility and acceptance of divine sovereignty",
        spiritualPrinciple: "God's strength is most visible through your weakness, not your strength.",
        reflectionQuestions: [
          "What 'thorn' has God refused to remove from your life?",
          "Can you see how your weakness has made you more dependent on God?",
          "Are you willing to boast in weakness rather than demand strength?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, wisdom: 5, courage: 4 }
      }
    ]
  },
  {
    id: "judas",
    name: "Judas Iscariot",
    meaning: "Praised (ironic)",
    emoji: "💰",
    role: "Apostle, Betrayer of Jesus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 26-27", "John 12-13", "Acts 1"],
    archetypes: ["Tragic Hero", "Manipulator"],
    dna: { faith: 1, humility: 1, courage: 2, wisdom: 2, compassion: 1, fear: 4, pride: 4, greed: 5 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Proximity to Jesus (had every opportunity)",
      weakness: "Greed and disillusionment",
      mindset: "Self-serving calculation masquerading as devotion",
      keyLesson: "Proximity to Christ is not the same as surrender to Christ.",
      keyVerse: "What will ye give me, and I will deliver him unto you?",
      keyVerseRef: "Matthew 26:15"
    },
    storyArc: "Chosen as one of twelve, trusted with the money bag, but never truly surrendered his heart. Betrayed Jesus for thirty pieces of silver, then hanged himself in despair rather than seeking repentance.",
    therapyView: {
      drivingFears: ["Loss of control", "Being on the losing side", "Exposure"],
      coreMotivations: ["Financial gain", "Political positioning", "Self-preservation"],
      relationalStyle: "Transactional; near Jesus but never intimate with Him",
      blindSpots: ["Believed religious activity equaled genuine faith", "Couldn't distinguish remorse from repentance"],
      healingMoments: ["None recorded—he chose despair over repentance"]
    },
    strengths: ["Organizational ability (treasurer)", "Strategic thinking", "Three years of exposure to Jesus"],
    weaknesses: ["Greed", "Hypocrisy", "Disillusionment when Jesus didn't match expectations", "Despair instead of repentance"],
    journey: [
      { phase: "Calling", description: "Chosen as one of the twelve apostles" },
      { phase: "Resistance", description: "Internal resistance to Jesus' spiritual kingdom" },
      { phase: "Testing", description: "Entrusted with the money bag; began stealing" },
      { phase: "Failure", description: "Betrayed Jesus with a kiss for thirty silver coins" },
      { phase: "Refinement", description: "None—chose self-destruction over repentance" },
      { phase: "Legacy", description: "A permanent warning about proximity without surrender" }
    ],
    relationships: [
      { name: "Jesus", role: "Master he betrayed" },
      { name: "Other disciples", role: "Companions who didn't suspect him" },
      { name: "Chief priests", role: "Conspirators" }
    ],
    lessonsAndReflection: [
      "Are you near Jesus without truly surrendering to Him?",
      "Is there a gap between your religious activity and your heart condition?",
      "Do you know the difference between remorse and repentance?"
    ],
    relatedCharacters: ["jesus", "peter", "john-apostle"],
    situations: [
      {
        id: "judas-betrayal",
        title: "The Betrayal Kiss",
        category: "Betrayal",
        reference: "Matthew 26:47-50",
        keyVerse: "Friend, wherefore art thou come? —Matthew 26:50",
        situation: "Judas leads an armed mob to Gethsemane and identifies Jesus with a kiss—the most intimate gesture used as the ultimate betrayal.",
        pressure: "He has already taken the money. There is no going back. Satan has entered him.",
        innerBattle: "Whatever remained of conscience versus the deal already made. The horror of using intimacy as a weapon.",
        response: "Judas kisses Jesus and says 'Hail, Master.' Jesus calls him 'Friend.'",
        outcome: "Jesus is arrested. Judas later returns the money and hangs himself.",
        lesson: "Using the language of love to accomplish betrayal is the deepest form of treachery. And even then, Jesus called him 'Friend.'",
        traitRevealed: "Treachery disguised as affection",
        spiritualPrinciple: "Jesus knows who will betray Him and still offers grace until the last moment.",
        reflectionQuestions: [
          "Have you ever used religious gestures to hide a compromised heart?",
          "What is the difference between Judas's remorse and Peter's repentance?",
          "Is there still time to turn back from a betrayal you're walking toward?"
        ],
        dnaSnapshot: { faith: 1, greed: 5, pride: 4, fear: 4 }
      }
    ]
  },
  {
    id: "saul-king",
    name: "King Saul",
    meaning: "Asked for",
    emoji: "⚔️",
    role: "First King of Israel",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 9-31"],
    archetypes: ["Tragic Hero"],
    dna: { faith: 2, humility: 2, courage: 3, wisdom: 2, compassion: 2, fear: 5, pride: 5, greed: 3 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Initial humility and military ability",
      weakness: "Insecurity and disobedience",
      mindset: "Fear of man over fear of God",
      keyLesson: "Insecurity in leadership leads to disobedience and destruction.",
      keyVerse: "To obey is better than sacrifice.",
      keyVerseRef: "1 Samuel 15:22"
    },
    storyArc: "A humble man chosen as Israel's first king who let insecurity, jealousy, and fear of man corrupt his reign. He disobeyed God repeatedly, hunted David out of jealousy, consulted a witch, and died in disgrace on Mount Gilboa.",
    therapyView: {
      drivingFears: ["Loss of control", "Being replaced", "Public shame"],
      coreMotivations: ["Maintaining power", "Public approval", "Fear-driven obedience"],
      relationalStyle: "Paranoid, controlling, alternating between affection and violence",
      blindSpots: ["Partial obedience is disobedience", "Jealousy disguised as national security", "Blaming others for his failures"],
      healingMoments: ["Brief moments of clarity when spared by David", "None lasting—he returned to darkness each time"]
    },
    strengths: ["Initial humility", "Military capability", "Chosen by God"],
    weaknesses: ["Insecurity", "Jealousy", "Disobedience", "Fear of people", "Consulting the occult"],
    journey: [
      { phase: "Calling", description: "Anointed king while searching for donkeys" },
      { phase: "Resistance", description: "Hiding among baggage at his coronation" },
      { phase: "Testing", description: "Battle against the Philistines; impatient sacrifice" },
      { phase: "Failure", description: "Sparing Agag, persecuting David, consulting the witch of Endor" },
      { phase: "Refinement", description: "None—Saul never repented, only regretted consequences" },
      { phase: "Legacy", description: "A cautionary tale of wasted potential and insecurity" }
    ],
    relationships: [
      { name: "Samuel", role: "Prophet who anointed and rejected him" },
      { name: "David", role: "Successor he tried to murder" },
      { name: "Jonathan", role: "Loyal son torn between father and friend" },
      { name: "God", role: "Lord whose Spirit departed from Saul" }
    ],
    lessonsAndReflection: [
      "Where does insecurity drive your decisions more than God's word?",
      "Are you more concerned with what people think than what God says?",
      "What partial obedience are you calling 'good enough'?"
    ],
    relatedCharacters: ["david", "jonathan", "samuel"],
    situations: [
      {
        id: "saul-spares-agag",
        title: "Saul Spares Agag",
        category: "Obedience",
        reference: "1 Samuel 15",
        keyVerse: "Hath the LORD as great delight in burnt offerings and sacrifices, as in obeying the voice of the LORD? —1 Samuel 15:22",
        situation: "God commands Saul to destroy the Amalekites completely. Saul defeats them but spares King Agag and the best livestock.",
        pressure: "The soldiers want the plunder. Agag is a trophy of war. Complete destruction seems wasteful.",
        innerBattle: "God's clear command versus human reasoning. Obedience versus the desire to keep what looks valuable.",
        response: "Saul partially obeys—destroys what is worthless, keeps what is valuable. Then claims he obeyed God and blames the people.",
        outcome: "God rejects Saul as king. Samuel delivers the devastating verdict: 'The LORD hath rejected thee from being king.'",
        lesson: "Partial obedience is complete disobedience. You cannot serve God and keep the parts you want for yourself.",
        traitRevealed: "Self-deception and partial obedience",
        spiritualPrinciple: "God values obedience over religious performance.",
        reflectionQuestions: [
          "Where are you partially obeying God while keeping what you want?",
          "Do you blame circumstances or others for your disobedience?",
          "What has God clearly told you to let go of that you're still holding?"
        ],
        dnaSnapshot: { faith: 2, pride: 5, wisdom: 1, humility: 1 }
      }
    ]
  },
  {
    id: "esther",
    name: "Esther (Hadassah)",
    meaning: "Star / Myrtle",
    emoji: "👸",
    role: "Queen of Persia, Deliverer of the Jews",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Esther 1-10"],
    archetypes: ["Strategist", "Survivor"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 5, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Courage and strategic wisdom",
      weakness: "Initial hesitation to act",
      mindset: "For such a time as this",
      keyLesson: "Your position is not for your comfort—it's for God's purpose.",
      keyVerse: "Who knoweth whether thou art come to the kingdom for such a time as this?",
      keyVerseRef: "Esther 4:14"
    },
    storyArc: "An orphan Jewish girl elevated to queen of Persia who risked her life to save her people from genocide, using wisdom, fasting, and strategic courage.",
    therapyView: {
      drivingFears: ["Death for approaching the king uninvited", "Exposure of her Jewish identity"],
      coreMotivations: ["Protecting her people", "Honoring Mordecai's faith", "Fulfilling divine purpose"],
      relationalStyle: "Strategic, measured, patient before acting",
      blindSpots: ["Initial reluctance to risk comfort for calling"],
      healingMoments: ["Decision to fast and approach the king", "Revealing her identity to save her people"]
    },
    strengths: ["Strategic courage", "Wisdom in timing", "Willingness to sacrifice", "Leadership under pressure"],
    weaknesses: ["Initial hesitation", "Dependence on Mordecai's push"],
    journey: [
      { phase: "Calling", description: "Elevated to queen in a foreign empire" },
      { phase: "Resistance", description: "Initially reluctant to risk approaching the king" },
      { phase: "Testing", description: "Haman's genocide decree against the Jews" },
      { phase: "Failure", description: "No moral failure—but hesitation that could have been fatal" },
      { phase: "Refinement", description: "Three days of fasting; resolving 'if I perish, I perish'" },
      { phase: "Legacy", description: "Saved the Jewish nation; Purim celebration" }
    ],
    relationships: [
      { name: "Mordecai", role: "Adoptive father and mentor" },
      { name: "King Ahasuerus", role: "Husband and king" },
      { name: "Haman", role: "Enemy of her people" }
    ],
    lessonsAndReflection: [
      "What position has God placed you in 'for such a time as this'?",
      "Are you using your influence for comfort or for purpose?",
      "What risk is God asking you to take on behalf of others?"
    ],
    relatedCharacters: ["mordecai", "haman"],
    situations: [
      {
        id: "esther-approaches-king",
        title: "Esther Approaches the King Uninvited",
        category: "Faith Testing",
        reference: "Esther 4-5",
        keyVerse: "If I perish, I perish. —Esther 4:16",
        situation: "Esther must approach King Ahasuerus without being summoned—an act punishable by death—to plead for her people.",
        pressure: "Death penalty for approaching uninvited. Her Jewish identity is secret. Haman has already secured the genocide decree.",
        innerBattle: "Self-preservation versus sacrificial courage. Comfort in the palace versus death outside it.",
        response: "Esther calls a three-day fast, then approaches the king in her royal robes. The king extends his scepter.",
        outcome: "The king receives her. She uses strategic timing with two banquets to expose Haman. The Jews are saved.",
        lesson: "Preparation through prayer and fasting, then courageous action. The order matters—spiritual preparation before bold steps.",
        traitRevealed: "Strategic courage born from faith",
        spiritualPrinciple: "God positions people in places of influence for moments of divine purpose.",
        reflectionQuestions: [
          "What is God asking you to risk for the sake of others?",
          "Are you preparing spiritually before acting courageously?",
          "Is your comfort keeping you from your calling?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 5, fear: 2 }
      }
    ]
  },
  {
    id: "ruth",
    name: "Ruth",
    meaning: "Friend / Companion",
    emoji: "🌾",
    role: "Moabite widow, Great-grandmother of David",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Ruth 1-4"],
    archetypes: ["Servant", "Survivor"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 5, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Loyalty and selfless devotion",
      weakness: "Vulnerability as a foreigner",
      mindset: "Covenant love that transcends circumstance",
      keyLesson: "Faithful loyalty in small things positions you for extraordinary blessing.",
      keyVerse: "Whither thou goest, I will go; and where thou lodgest, I will lodge.",
      keyVerseRef: "Ruth 1:16"
    },
    storyArc: "A Moabite widow who chose loyalty to her mother-in-law and Israel's God over returning to her homeland, gleaned in Boaz's field, and was redeemed into the lineage of David and ultimately Jesus.",
    therapyView: {
      drivingFears: ["Destitution", "Being rejected as a foreigner"],
      coreMotivations: ["Covenant loyalty", "Caring for Naomi", "Faith in Israel's God"],
      relationalStyle: "Deeply committed, humble, willing to serve",
      blindSpots: ["Could have been too passive without Naomi's guidance"],
      healingMoments: ["Boaz's kindness in the field", "Marriage and the birth of Obed"]
    },
    strengths: ["Radical loyalty", "Humility", "Hard work", "Faith in a foreign God", "Submission to wise counsel"],
    weaknesses: ["Social vulnerability", "Dependence on others' goodwill"],
    journey: [
      { phase: "Calling", description: "Choosing Naomi's God and people over Moab" },
      { phase: "Resistance", description: "Naomi tried to send her back" },
      { phase: "Testing", description: "Gleaning as a poor foreigner in Bethlehem" },
      { phase: "Failure", description: "No personal failure recorded" },
      { phase: "Refinement", description: "Humble service and obedience to Naomi's plan" },
      { phase: "Legacy", description: "Great-grandmother of David; in the lineage of Jesus" }
    ],
    relationships: [
      { name: "Naomi", role: "Mother-in-law and mentor" },
      { name: "Boaz", role: "Kinsman-redeemer and husband" },
      { name: "Orpah", role: "Sister-in-law who turned back" }
    ],
    lessonsAndReflection: [
      "What are you willing to leave behind to follow God?",
      "Are you faithful in small, unglamorous tasks?",
      "How does loyalty in hardship position you for unexpected blessing?"
    ],
    relatedCharacters: ["naomi", "boaz", "david"],
    situations: [
      {
        id: "ruth-chooses-naomi",
        title: "Ruth Chooses Naomi Over Moab",
        category: "Sacrifice",
        reference: "Ruth 1:14-18",
        keyVerse: "Thy people shall be my people, and thy God my God. —Ruth 1:16",
        situation: "After losing her husband, Ruth must choose between returning to Moab's security or following Naomi into poverty in Bethlehem.",
        pressure: "Naomi urges her to go back. Orpah leaves. Ruth has no guarantee of provision, acceptance, or marriage in Israel.",
        innerBattle: "Security versus loyalty. The known versus the unknown. Her old gods versus Naomi's God.",
        response: "Ruth clings to Naomi with one of the most beautiful declarations of loyalty in all Scripture.",
        outcome: "Ruth enters the lineage of David and Jesus. Her loyalty is rewarded beyond anything she could have imagined.",
        lesson: "Choosing covenant over comfort is the gateway to blessing you cannot foresee.",
        traitRevealed: "Radical loyalty and faith",
        spiritualPrinciple: "God honors those who choose His people and His ways over the familiar and comfortable.",
        reflectionQuestions: [
          "What familiar comfort is God asking you to leave behind?",
          "Are you willing to commit to an uncertain path out of faith?",
          "Who in your life deserves the kind of loyalty Ruth showed?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, compassion: 5, humility: 5 }
      }
    ]
  },

  // ============================================
  // ADDITIONAL CORE CHARACTERS
  // ============================================

  {
    id: "mary-mother-of-jesus",
    name: "Mary (Mother of Jesus)",
    meaning: "Bitter / Beloved",
    emoji: "🕊️",
    role: "Mother of Jesus, Humble Servant of God",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 1:26-56", "Luke 2", "John 2:1-12", "John 19:25-27", "Acts 1:14"],
    archetypes: ["Servant", "Matriarch"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 5, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Surrendered faith and quiet courage",
      weakness: "Sorrow and the pain of watching her son suffer",
      mindset: "Total submission to God's will",
      keyLesson: "God chooses the humble to carry His greatest purposes.",
      keyVerse: "Behold the handmaid of the Lord; be it unto me according to thy word.",
      keyVerseRef: "Luke 1:38"
    },
    storyArc: "A young virgin in Nazareth chosen to bear the Son of God, who treasured all things in her heart, stood at the foot of the cross, and remained faithful to the end.",
    therapyView: {
      drivingFears: ["Social disgrace", "Harm to her son", "Not understanding God's plan"],
      coreMotivations: ["Obedience to God", "Motherly love", "Faith in God's promises"],
      relationalStyle: "Quietly observant, deeply nurturing, pondering before speaking",
      blindSpots: ["Occasional misunderstanding of Jesus's mission", "Tendency to worry"],
      healingMoments: ["The Magnificat", "Jesus's first miracle at Cana", "Standing at the cross with unwavering faith"]
    },
    strengths: ["Radical obedience", "Humility", "Quiet strength", "Deep faith", "Pondering heart"],
    weaknesses: ["Anxiety about Jesus's safety", "Moments of misunderstanding His mission"],
    journey: [
      { phase: "Calling", description: "The angel Gabriel announces she will bear the Son of God" },
      { phase: "Resistance", description: "Questions how this can be, but immediately surrenders" },
      { phase: "Testing", description: "Social shame, fleeing to Egypt, losing Jesus in the temple" },
      { phase: "Failure", description: "No moral failure recorded; she endured through sorrow" },
      { phase: "Refinement", description: "Watching Jesus's ministry unfold, standing at the cross" },
      { phase: "Legacy", description: "Mother of the Messiah, example of faith for all generations" }
    ],
    relationships: [
      { name: "Jesus", role: "Son and Savior" },
      { name: "Joseph", role: "Husband and protector" },
      { name: "Elizabeth", role: "Relative and fellow miracle-mother" },
      { name: "John (Apostle)", role: "Entrusted son at the cross" },
      { name: "Gabriel", role: "Angelic messenger" }
    ],
    lessonsAndReflection: [
      "Are you willing to say yes to God even when the cost is unknown?",
      "Do you treasure and ponder God's work in your life?",
      "Can you trust God's plan even when it brings sorrow?"
    ],
    relatedCharacters: ["joseph-husband-of-mary", "elizabeth", "jesus"],
    situations: [
      {
        id: "mary-annunciation",
        title: "The Annunciation",
        category: "Calling",
        reference: "Luke 1:26-38",
        keyVerse: "Behold the handmaid of the Lord; be it unto me according to thy word. —Luke 1:38",
        situation: "A young virgin in Nazareth receives an angelic visitation announcing she will conceive the Son of the Most High by the Holy Spirit.",
        pressure: "She is betrothed to Joseph. Pregnancy outside marriage means public disgrace, divorce, or even death by stoning. No one will believe her explanation.",
        innerBattle: "Fear of the impossible versus trust in God's word. The weight of social consequences versus the honor of divine calling.",
        response: "After one clarifying question, Mary surrenders completely: 'Be it unto me according to thy word.'",
        outcome: "She conceives Jesus, visits Elizabeth for confirmation, and pours out the Magnificat—one of Scripture's greatest songs of faith.",
        lesson: "The greatest acts of faith often begin with a simple 'yes' to God in the face of impossible circumstances.",
        traitRevealed: "Surrendered faith and humility",
        spiritualPrinciple: "God does not call the qualified; He qualifies the called. Surrender is the highest form of courage.",
        reflectionQuestions: [
          "What impossible thing is God asking of you right now?",
          "Are you willing to bear the social cost of obedience?",
          "How quickly do you move from questioning to surrendering?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 5, fear: 2 }
      },
      {
        id: "mary-at-the-cross",
        title: "Mary at the Cross",
        category: "Loss",
        reference: "John 19:25-27",
        keyVerse: "Now there stood by the cross of Jesus his mother. —John 19:25",
        situation: "Mary stands at the foot of the cross watching her firstborn son—the one Simeon prophesied a sword would pierce her heart over—being crucified.",
        pressure: "The ultimate grief of a mother. The apparent failure of every promise. Roman soldiers, mocking crowds, and the darkening sky.",
        innerBattle: "Unimaginable sorrow versus the faith she has carried for thirty-three years. The temptation to despair versus trust in God's unseen plan.",
        response: "Mary does not flee. She stands. She remains present in the worst moment of her life, faithful to the end.",
        outcome: "Jesus entrusts her to John. Three days later, the resurrection vindicates everything. Her faithfulness through sorrow is honored for eternity.",
        lesson: "Sometimes faith means simply standing when everything in you wants to collapse. Presence in suffering is its own act of worship.",
        traitRevealed: "Enduring faithfulness through suffering",
        spiritualPrinciple: "The sword that pierces your heart may be the very instrument God uses to redeem the world.",
        reflectionQuestions: [
          "Can you remain faithful when God's promises seem to be dying?",
          "What does it mean to simply 'stand' in your darkest hour?",
          "How does sorrow deepen rather than destroy your faith?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, compassion: 5, humility: 5 }
      }
    ]
  },

  {
    id: "daniel",
    name: "Daniel",
    meaning: "God is my judge",
    emoji: "🦁",
    role: "Prophet, Statesman, Interpreter of Dreams",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["Daniel 1-12"],
    archetypes: ["Prophet", "Strategist", "Exile"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 3, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Uncompromising integrity in a hostile culture",
      weakness: "Socially isolated by his convictions",
      mindset: "Faithful in private, fearless in public",
      keyLesson: "Consistency in small convictions prepares you for great trials.",
      keyVerse: "But Daniel purposed in his heart that he would not defile himself with the portion of the king's meat.",
      keyVerseRef: "Daniel 1:8"
    },
    storyArc: "Taken captive as a teenager to Babylon, Daniel rose to the highest levels of pagan government while never compromising his faith—from refusing the king's food to surviving the lion's den to receiving apocalyptic visions of the end times.",
    therapyView: {
      drivingFears: ["Compromise under pressure", "Losing his identity in a foreign culture"],
      coreMotivations: ["Faithfulness to God", "Integrity regardless of consequences", "Serving with excellence"],
      relationalStyle: "Respectful and diplomatic but immovable on convictions",
      blindSpots: ["Potential isolation from peers", "Bearing enormous burdens alone"],
      healingMoments: ["God's vindication in the lion's den", "Angelic visitations", "Being called 'greatly beloved' by Gabriel"]
    },
    strengths: ["Unshakeable integrity", "Prophetic gifting", "Political wisdom", "Courage under pressure", "Discipline and self-control"],
    weaknesses: ["Isolation from community", "Heavy burden of prophetic knowledge"],
    journey: [
      { phase: "Calling", description: "Taken captive to Babylon as a youth of noble birth" },
      { phase: "Resistance", description: "Refused the king's food—his first act of holy defiance" },
      { phase: "Testing", description: "Interpreting dreams, the lion's den, navigating multiple empires" },
      { phase: "Failure", description: "No recorded moral failure; Daniel's life is remarkably consistent" },
      { phase: "Refinement", description: "Decades of faithful service in a pagan empire, fasting and prayer" },
      { phase: "Legacy", description: "Apocalyptic prophecies, model of exile faithfulness, influence on kings" }
    ],
    relationships: [
      { name: "Shadrach, Meshach, Abednego", role: "Fellow exiles and friends" },
      { name: "Nebuchadnezzar", role: "King he served and influenced" },
      { name: "Darius", role: "King who respected him" },
      { name: "Gabriel", role: "Angel who brought visions" }
    ],
    lessonsAndReflection: [
      "Where are you tempted to compromise convictions for cultural acceptance?",
      "Are you faithful in the small disciplines that prepare you for great tests?",
      "Can you serve with excellence in an environment hostile to your faith?"
    ],
    relatedCharacters: ["shadrach", "meshach", "abednego", "nebuchadnezzar"],
    situations: [
      {
        id: "daniel-lions-den",
        title: "Daniel in the Lion's Den",
        category: "Faith Testing",
        reference: "Daniel 6",
        keyVerse: "My God hath sent his angel, and hath shut the lions' mouths. —Daniel 6:22",
        situation: "Daniel's political rivals conspire to pass a law making prayer to anyone but the king punishable by death in the lion's den.",
        pressure: "Daniel knows the decree. He knows the punishment. He holds one of the highest offices in the empire and could pray secretly.",
        innerBattle: "Self-preservation versus public faithfulness. The temptation to hide his devotion versus maintaining his lifelong discipline of open prayer.",
        response: "Daniel opens his windows toward Jerusalem and prays three times a day exactly as he always has. He changes nothing.",
        outcome: "Cast into the den, God shuts the lions' mouths. Darius decrees honor to Daniel's God. His accusers are destroyed.",
        lesson: "A lifetime of consistent faith makes the crisis moment automatic. You don't rise to the occasion—you fall to your level of discipline.",
        traitRevealed: "Unwavering consistency and courage",
        spiritualPrinciple: "God honors those who honor Him publicly, regardless of the cost.",
        reflectionQuestions: [
          "Would your prayer life survive if it became illegal?",
          "Are you the same person in private that you claim to be in public?",
          "What daily discipline is preparing you for a future test you cannot foresee?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4, fear: 1 }
      },
      {
        id: "daniel-refuses-kings-food",
        title: "Daniel Refuses the King's Food",
        category: "Obedience",
        reference: "Daniel 1:8-21",
        keyVerse: "But Daniel purposed in his heart that he would not defile himself with the portion of the king's meat. —Daniel 1:8",
        situation: "As a young captive in Babylon, Daniel is offered the finest food and wine from the king's table as part of his training for royal service.",
        pressure: "He is a teenager in a foreign land with no power. Refusing the king's provision could be seen as ingratitude or rebellion. His captors control his life.",
        innerBattle: "Assimilation versus identity. The comfort of acceptance versus the cost of standing apart. A small compromise that no one back home would ever know about.",
        response: "Daniel respectfully proposes a ten-day test: vegetables and water versus the king's rich food. He negotiates with wisdom, not defiance.",
        outcome: "After ten days, Daniel and his friends appear healthier than all the others. God grants them exceptional wisdom and learning.",
        lesson: "Faithfulness in small, unseen choices is the foundation of great spiritual authority. The first compromise is always the most dangerous.",
        traitRevealed: "Quiet conviction and diplomatic courage",
        spiritualPrinciple: "Small acts of obedience in private prepare you for great acts of faith in public.",
        reflectionQuestions: [
          "What small compromise is the enemy offering you right now that seems harmless?",
          "Can you stand for your convictions diplomatically rather than defiantly?",
          "What 'king's food' are you being pressured to accept?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 5, humility: 4, courage: 4 }
      },
      {
        id: "daniel-interprets-nebuchadnezzar-dream",
        title: "Interpreting Nebuchadnezzar's Dream",
        category: "Faith Testing",
        reference: "Daniel 2",
        keyVerse: "There is a God in heaven that revealeth secrets. —Daniel 2:28",
        situation: "Nebuchadnezzar demands his wise men tell him both his dream and its interpretation—or be executed. No one can do it.",
        pressure: "Daniel and his friends face death along with all the wise men of Babylon. The king is irrational with fury. There is no human solution.",
        innerBattle: "The terror of an impossible demand versus faith that God reveals secrets. Trusting God with his life when the stakes are absolute.",
        response: "Daniel asks for time, gathers his friends to pray, and God reveals the dream and its meaning in a night vision. Daniel gives all glory to God before the king.",
        outcome: "Nebuchadnezzar falls on his face and acknowledges Daniel's God. Daniel is elevated to ruler over the province of Babylon.",
        lesson: "When you face impossible situations, your first move should be prayer with trusted friends—not panic.",
        traitRevealed: "Dependence on God and Spirit-led wisdom",
        spiritualPrinciple: "God gives revelation to those who seek Him in community and give Him the glory.",
        reflectionQuestions: [
          "When facing impossible demands, is prayer your first response or your last resort?",
          "Do you have a community of faith you can call on in crisis?",
          "When God gives you success, do you take the credit or redirect the glory?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 5, humility: 5, courage: 4 }
      }
    ]
  },

  {
    id: "samson",
    name: "Samson",
    meaning: "Sun / Man of the sun",
    emoji: "💪",
    role: "Judge of Israel, Nazarite",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 13-16"],
    archetypes: ["Warrior", "Tragic Hero"],
    dna: { faith: 3, humility: 1, courage: 5, wisdom: 1, compassion: 2, fear: 1, pride: 5, greed: 3 },
    quickCard: {
      archetype: "Warrior",
      strength: "Supernatural physical power",
      weakness: "Enslaved by lust and pride",
      mindset: "Invincible in body, vulnerable in spirit",
      keyLesson: "Anointing without discipline leads to destruction.",
      keyVerse: "And he wist not that the LORD was departed from him.",
      keyVerseRef: "Judges 16:20"
    },
    storyArc: "Born with a divine calling and supernatural strength, Samson squandered his gifts through lust, pride, and recklessness—yet in his final blinded, broken moment, he turned back to God and accomplished more in death than in life.",
    therapyView: {
      drivingFears: ["Vulnerability", "Loss of control", "Being ordinary"],
      coreMotivations: ["Physical dominance", "Sensual pleasure", "Revenge"],
      relationalStyle: "Uses people for gratification, trusts no one fully, emotionally immature",
      blindSpots: ["His own vulnerability to manipulation", "Confusing anointing with invincibility", "Pattern of destructive relationships"],
      healingMoments: ["Final prayer in the temple—brokenness producing the greatest victory"]
    },
    strengths: ["Supernatural strength", "Fearlessness", "Single-handed military victories", "Final act of repentant faith"],
    weaknesses: ["Lust", "Pride", "Impulsiveness", "Broken Nazarite vows", "Inability to learn from relational patterns"],
    journey: [
      { phase: "Calling", description: "Announced by an angel as a Nazarite from the womb" },
      { phase: "Resistance", description: "Pursued Philistine women against his parents' counsel" },
      { phase: "Testing", description: "Riddles, battles, and escalating conflict with the Philistines" },
      { phase: "Failure", description: "Delilah's seduction, revealed the secret of his strength, captured and blinded" },
      { phase: "Refinement", description: "Grinding grain in a Philistine prison, blind and humiliated" },
      { phase: "Legacy", description: "Final prayer brings down the temple; listed among the heroes of faith in Hebrews 11" }
    ],
    relationships: [
      { name: "Delilah", role: "Manipulative lover who betrayed him" },
      { name: "Manoah", role: "Father" },
      { name: "Philistines", role: "Lifelong enemies" }
    ],
    lessonsAndReflection: [
      "Are you confusing God's gifting with God's approval of your lifestyle?",
      "What relational pattern keeps tripping you up?",
      "Is it too late for God to use you? Samson's greatest act was his last."
    ],
    relatedCharacters: ["delilah", "gideon"],
    situations: [
      {
        id: "samson-delilah-betrayal",
        title: "Delilah's Betrayal",
        category: "Betrayal",
        reference: "Judges 16:4-21",
        keyVerse: "And he wist not that the LORD was departed from him. —Judges 16:20",
        situation: "Samson falls in love with Delilah, who is bribed by the Philistine lords to discover the secret of his strength.",
        pressure: "Delilah nags him day after day. She accuses him of not loving her. The emotional manipulation is relentless. He has already lied three times but keeps returning.",
        innerBattle: "Lust and emotional need versus his sacred Nazarite vow. The arrogance of believing he can play with fire and never get burned.",
        response: "Worn down, Samson tells her everything. He lays his head in her lap and sleeps while she calls a man to shave his head.",
        outcome: "The Lord departs from him. He is captured, blinded, and enslaved to grind grain in a Philistine prison. The strongest man alive becomes the most pathetic.",
        lesson: "No amount of gifting can protect you from the consequences of persistent compromise. The most dangerous moment is when you think you are immune.",
        traitRevealed: "Fatal pride and addiction to destructive relationships",
        spiritualPrinciple: "God's anointing is not a shield against the consequences of willful sin. You can lose what you refuse to steward.",
        reflectionQuestions: [
          "What relationship or habit are you returning to despite knowing it's destroying you?",
          "Are you confusing God's patience with God's approval?",
          "What would it take for you to recognize a 'Delilah' pattern in your life?"
        ],
        dnaSnapshot: { faith: 1, pride: 5, wisdom: 1, fear: 1 }
      },
      {
        id: "samson-final-prayer",
        title: "Samson's Final Prayer in the Temple",
        category: "Restoration",
        reference: "Judges 16:23-30",
        keyVerse: "O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God. —Judges 16:28",
        situation: "Blind, chained, and humiliated, Samson is brought to the Philistine temple to be mocked before three thousand people and their god Dagon.",
        pressure: "Total degradation. He is entertainment for his enemies. God's name is being mocked through his failure. He has nothing left—no eyes, no freedom, no dignity.",
        innerBattle: "Despair versus one final act of faith. The question of whether God would hear him again after so much squandered potential.",
        response: "Samson prays the most honest prayer of his life, asks God for strength one more time, and pushes the pillars of the temple apart.",
        outcome: "The temple collapses, killing more Philistines in his death than in his entire life. He is buried with honor and listed among the faithful in Hebrews 11.",
        lesson: "It is never too late to turn back to God. Your worst failure does not have to be your final chapter.",
        traitRevealed: "Broken-hearted faith and redemptive courage",
        spiritualPrinciple: "God's mercy reaches the lowest point. Brokenness is often the prerequisite for the greatest victory.",
        reflectionQuestions: [
          "Have you written yourself off because of past failures?",
          "What would it look like to pray the most honest prayer of your life right now?",
          "Can God still use the broken pieces of your story for His glory?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 5, pride: 1 }
      }
    ]
  },

  {
    id: "laban",
    name: "Laban",
    meaning: "White",
    emoji: "🐑",
    role: "Father-in-law of Jacob, Wealthy Herder",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 24", "Genesis 29-31"],
    archetypes: ["Manipulator"],
    dna: { faith: 1, humility: 1, courage: 2, wisdom: 3, compassion: 1, fear: 3, pride: 4, greed: 5 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Shrewd negotiation and business acumen",
      weakness: "Greed that poisons every relationship",
      mindset: "Everything and everyone is a transaction",
      keyLesson: "Manipulation eventually isolates you from everyone you claim to love.",
      keyVerse: "Your father hath deceived me, and changed my wages ten times; but God suffered him not to hurt me.",
      keyVerseRef: "Genesis 31:7"
    },
    storyArc: "A wealthy Aramean who welcomed Jacob but exploited him for twenty years through deception, changing his wages ten times, and using his daughters as bargaining chips—until God intervened and Jacob fled.",
    therapyView: {
      drivingFears: ["Losing wealth", "Losing control over family", "Being outsmarted"],
      coreMotivations: ["Accumulation of wealth", "Control over others", "Self-preservation"],
      relationalStyle: "Transactional and exploitative, disguised with hospitality",
      blindSpots: ["Cannot see how his greed alienates his own daughters", "Believes his manipulation is justified cleverness", "Underestimates God's protection of Jacob"],
      healingMoments: ["The covenant at Mizpah—forced by God into a peace agreement"]
    },
    strengths: ["Business intelligence", "Persistence", "Negotiation skill"],
    weaknesses: ["Greed", "Deception", "Exploitation of family", "Spiritual blindness", "Controlling behavior"],
    journey: [
      { phase: "Calling", description: "No divine calling; Laban operates entirely on self-interest" },
      { phase: "Resistance", description: "Resists letting Jacob leave because Jacob's labor enriches him" },
      { phase: "Testing", description: "God warns him in a dream not to harm Jacob" },
      { phase: "Failure", description: "Twenty years of exploiting his son-in-law and treating his daughters as property" },
      { phase: "Refinement", description: "Minimal; forced into a covenant of non-aggression" },
      { phase: "Legacy", description: "A cautionary tale of greed destroying family bonds" }
    ],
    relationships: [
      { name: "Jacob", role: "Son-in-law and victim of exploitation" },
      { name: "Rachel", role: "Daughter, used as a bargaining chip" },
      { name: "Leah", role: "Daughter, substituted in deception" },
      { name: "Rebekah", role: "Sister" }
    ],
    lessonsAndReflection: [
      "Are you treating people as means to your ends?",
      "Has greed poisoned relationships you claim to value?",
      "Do you recognize when God is protecting someone from your manipulation?"
    ],
    relatedCharacters: ["jacob", "rachel", "leah"],
    situations: [
      {
        id: "laban-deceives-jacob-leah",
        title: "Laban Deceives Jacob with Leah",
        category: "Betrayal",
        reference: "Genesis 29:21-27",
        keyVerse: "And it came to pass, that in the morning, behold, it was Leah. —Genesis 29:25",
        situation: "After Jacob works seven years for Rachel's hand in marriage, Laban substitutes Leah under the wedding veil on the wedding night.",
        pressure: "Laban wants to secure Jacob's labor for as long as possible. Cultural customs give him cover. He also needs to marry off his older daughter first.",
        innerBattle: "Greed and control versus basic honesty and love for his daughters. The temptation to exploit someone who has no leverage.",
        response: "Laban executes the switch without remorse, then demands seven more years of labor for Rachel.",
        outcome: "Jacob is trapped into fourteen years of service. Both daughters suffer in a rivalry they did not create. Laban gains labor but loses his family's trust.",
        lesson: "Manipulation may achieve short-term gains but creates generational wounds. The deceiver always underestimates the long-term cost.",
        traitRevealed: "Calculating greed and relational exploitation",
        spiritualPrinciple: "What you gain through deception, you lose in trust. God sees every hidden transaction.",
        reflectionQuestions: [
          "Have you ever manipulated someone who trusted you for your own benefit?",
          "What long-term relational damage has resulted from short-term scheming?",
          "Are you treating those closest to you as assets rather than people?"
        ],
        dnaSnapshot: { greed: 5, pride: 4, wisdom: 3, compassion: 1 }
      }
    ]
  },

  {
    id: "goliath",
    name: "Goliath",
    meaning: "Exile / Splendor",
    emoji: "🗡️",
    role: "Philistine Champion, Giant Warrior",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 17"],
    archetypes: ["Oppressor", "Warrior"],
    dna: { faith: 1, humility: 1, courage: 4, wisdom: 1, compassion: 1, fear: 1, pride: 5, greed: 3 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Physical dominance and intimidation",
      weakness: "Pride that blinds him to God's power",
      mindset: "Might makes right",
      keyLesson: "No giant is too big for the God of Israel.",
      keyVerse: "Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts.",
      keyVerseRef: "1 Samuel 17:45"
    },
    storyArc: "A nine-foot Philistine champion who terrorized Israel for forty days, defying the armies of the living God—until a shepherd boy with a sling and faith in God brought him down with a single stone.",
    therapyView: {
      drivingFears: ["Being challenged by an equal", "Loss of reputation"],
      coreMotivations: ["Dominance", "National honor for Philistia", "Personal glory"],
      relationalStyle: "Intimidating and contemptuous; respects only superior force",
      blindSpots: ["Cannot conceive of a power greater than physical might", "Dismisses opponents based on appearance", "Mocks what he does not understand"],
      healingMoments: ["None recorded; Goliath serves as a warning, not a model"]
    },
    strengths: ["Immense physical power", "Military experience", "Fearlessness in battle", "Commanding presence"],
    weaknesses: ["Pride", "Spiritual blindness", "Underestimating God", "Contempt for the seemingly weak"],
    journey: [
      { phase: "Calling", description: "Chosen as Philistia's champion to decide the battle" },
      { phase: "Resistance", description: "None—he eagerly embraces the role of intimidator" },
      { phase: "Testing", description: "Forty days of unchallenged taunting" },
      { phase: "Failure", description: "Mocked the God of Israel and underestimated a boy with a sling" },
      { phase: "Refinement", description: "None—his story ends in sudden judgment" },
      { phase: "Legacy", description: "The ultimate symbol of intimidating obstacles that fall before faith" }
    ],
    relationships: [
      { name: "Philistine army", role: "The force he represented" },
      { name: "David", role: "The unlikely opponent who defeated him" }
    ],
    lessonsAndReflection: [
      "What 'Goliath' in your life seems invincible but is vulnerable to God's power?",
      "Are you intimidating others with your strengths while ignoring your spiritual blindness?",
      "Have you dismissed someone God is using because they don't look the part?"
    ],
    relatedCharacters: ["david", "saul-king"],
    situations: [
      {
        id: "goliath-challenges-israel",
        title: "Goliath Challenges Israel",
        category: "Power and Success",
        reference: "1 Samuel 17:1-11",
        keyVerse: "I defy the armies of Israel this day; give me a man, that we may fight together. —1 Samuel 17:10",
        situation: "Goliath strides into the valley between two armies and issues a challenge of single combat, mocking Israel and their God for forty consecutive days.",
        pressure: "No Israelite dares face him. Saul and his army are paralyzed with fear. Goliath's confidence grows with each unchallenged day.",
        innerBattle: "There is no internal battle for Goliath—he is completely assured of his own supremacy. This is precisely his fatal flaw.",
        response: "Goliath taunts, mocks, and blasphemes with increasing arrogance, fully convinced no one can touch him.",
        outcome: "His unchallenged dominance creates the very conditions that set the stage for his spectacular downfall at the hands of a shepherd boy.",
        lesson: "Unchallenged pride builds toward its own destruction. The louder the boasting, the more dramatic the fall.",
        traitRevealed: "Arrogance and spiritual blindness",
        spiritualPrinciple: "Pride goes before destruction, and a haughty spirit before a fall (Proverbs 16:18).",
        reflectionQuestions: [
          "Where has unchallenged success made you spiritually blind?",
          "Are you intimidating others rather than inspiring them?",
          "What would it take for you to recognize a power greater than your own?"
        ],
        dnaSnapshot: { pride: 5, courage: 4, faith: 1, humility: 1 }
      },
      {
        id: "goliath-falls-to-david",
        title: "Goliath Falls to David",
        category: "Loss",
        reference: "1 Samuel 17:41-51",
        keyVerse: "So David prevailed over the Philistine with a sling and with a stone. —1 Samuel 17:50",
        situation: "A boy with no armor approaches Goliath with a sling and five stones. Goliath sees him and is filled with contempt.",
        pressure: "Goliath's entire identity is built on physical superiority. This boy is an insult to everything he stands for.",
        innerBattle: "Rage at being disrespected versus a flicker of the unknown. David's words invoke a God Goliath has never reckoned with.",
        response: "Goliath curses David by his gods and moves forward to crush him, never considering that the battle has already been decided in the heavenlies.",
        outcome: "A single stone sinks into his forehead. The giant falls face-first. David takes Goliath's own sword and cuts off his head. The Philistines flee.",
        lesson: "The battle belongs to the Lord. Physical might, intimidating armor, and decades of experience mean nothing when God has decided the outcome.",
        traitRevealed: "The fatal consequence of dismissing God",
        spiritualPrinciple: "God uses the foolish things of the world to confound the wise, and the weak things to confound the mighty (1 Corinthians 1:27).",
        reflectionQuestions: [
          "Have you underestimated someone God is using because they look unimpressive?",
          "What 'armor' are you trusting in instead of God?",
          "How does Goliath's fall reshape your understanding of what true power looks like?"
        ],
        dnaSnapshot: { pride: 5, fear: 2, faith: 1, wisdom: 1 }
      }
    ]
  },

  {
    id: "pharaoh-exodus",
    name: "Pharaoh (of Exodus)",
    meaning: "Great House",
    emoji: "🐍",
    role: "King of Egypt, Oppressor of Israel",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 1-14"],
    archetypes: ["Oppressor"],
    dna: { faith: 1, humility: 1, courage: 3, wisdom: 2, compassion: 1, fear: 3, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Political power and relentless will",
      weakness: "Hardened heart that destroys his own nation",
      mindset: "I am god; no one commands me",
      keyLesson: "Resisting God does not make you strong—it makes you a cautionary tale.",
      keyVerse: "And Pharaoh said, Who is the LORD, that I should obey his voice to let Israel go? I know not the LORD, neither will I let Israel go.",
      keyVerseRef: "Exodus 5:2"
    },
    storyArc: "The most powerful ruler on earth who repeatedly hardened his heart against God through ten devastating plagues, losing his workforce, his nation's wealth, his firstborn son, and ultimately his army in the Red Sea.",
    therapyView: {
      drivingFears: ["Loss of power", "Economic collapse", "Appearing weak before subordinates"],
      coreMotivations: ["Absolute control", "National supremacy", "Self-deification"],
      relationalStyle: "Domineering and transactional; views people as resources",
      blindSpots: ["Cannot recognize a power greater than his own", "Each plague should be a wake-up call but instead deepens his resistance", "His stubbornness destroys his own people"],
      healingMoments: ["Brief moments of relenting during plagues—but never genuine repentance"]
    },
    strengths: ["Determination", "Political authority", "Commanding presence"],
    weaknesses: ["Pride", "Hardened heart", "Cruelty", "Spiritual blindness", "Stubbornness unto self-destruction"],
    journey: [
      { phase: "Calling", description: "No divine calling; he inherits a throne built on oppression" },
      { phase: "Resistance", description: "Refuses Moses's demand from the very first encounter" },
      { phase: "Testing", description: "Ten plagues—each an opportunity to repent" },
      { phase: "Failure", description: "Hardens his heart repeatedly until God confirms it permanently" },
      { phase: "Refinement", description: "None—he is hardened beyond recovery" },
      { phase: "Legacy", description: "The ultimate warning of what happens when you resist God to the bitter end" }
    ],
    relationships: [
      { name: "Moses", role: "God's representative and adversary" },
      { name: "Aaron", role: "Moses's spokesman" },
      { name: "Egyptian magicians", role: "Advisors who eventually admitted God's superiority" },
      { name: "Israel", role: "Enslaved people he refused to release" }
    ],
    lessonsAndReflection: [
      "Where is your heart hardening against what God is clearly saying?",
      "Are you ignoring repeated warnings because of pride?",
      "What are you holding onto that is destroying you and those around you?"
    ],
    relatedCharacters: ["moses", "aaron"],
    situations: [
      {
        id: "pharaoh-hardened-heart-plagues",
        title: "Pharaoh's Hardened Heart During the Plagues",
        category: "Power and Success",
        reference: "Exodus 7-12",
        keyVerse: "And Pharaoh hardened his heart at this time also, neither would he let the people go. —Exodus 8:32",
        situation: "God sends ten increasingly devastating plagues upon Egypt, each time offering Pharaoh the chance to relent and release Israel.",
        pressure: "Each plague escalates—blood, frogs, lice, flies, livestock death, boils, hail, locusts, darkness, and finally the death of every firstborn. His own advisors beg him to let Israel go.",
        innerBattle: "The mounting evidence of God's supremacy versus his identity as a living god. Each moment of weakness when he almost relents is followed by a re-hardening when the pressure lifts.",
        response: "Pharaoh hardens his heart again and again. Initially it is his own choice; eventually God confirms the hardening permanently.",
        outcome: "His firstborn son dies. He releases Israel in anguish, then pursues them and loses his entire army in the Red Sea. Egypt is devastated.",
        lesson: "Every time you resist God's clear voice, your heart becomes harder. There is a point beyond which God gives you over to the stubbornness you have chosen.",
        traitRevealed: "Catastrophic pride and self-destructive defiance",
        spiritualPrinciple: "A hardened heart is not formed in a single moment but in a series of small refusals. God's patience has a limit—not because He is cruel, but because He honors human choice.",
        reflectionQuestions: [
          "What is God repeatedly asking you to release that you keep clinging to?",
          "Are you softening or hardening each time God speaks?",
          "What plagues—consequences—are you enduring because of your stubbornness?",
          "Is there still time for you to relent, or are you dangerously close to the point of no return?"
        ],
        dnaSnapshot: { pride: 5, greed: 5, faith: 1, humility: 1 }
      }
    ]
  },

  {
    id: "jonah",
    name: "Jonah",
    meaning: "Dove",
    emoji: "🐋",
    role: "Reluctant Prophet",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Jonah 1-4", "2 Kings 14:25"],
    archetypes: ["Prophet", "Exile"],
    dna: { faith: 3, humility: 2, courage: 2, wisdom: 2, compassion: 1, fear: 4, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Powerful preaching that moved an entire city",
      weakness: "Prejudice and anger at God's mercy toward enemies",
      mindset: "I know God is merciful—and I hate it when He extends mercy to people I despise",
      keyLesson: "God's compassion is bigger than your categories of who deserves it.",
      keyVerse: "I knew that thou art a gracious God, and merciful, slow to anger, and of great kindness, and repentest thee of the evil.",
      keyVerseRef: "Jonah 4:2"
    },
    storyArc: "Called to preach to Israel's worst enemy, Jonah fled to Tarshish, was swallowed by a great fish, preached to Nineveh, saw the greatest revival in history—and then sat furiously angry that God showed mercy.",
    therapyView: {
      drivingFears: ["God being merciful to his enemies", "Loss of national superiority", "Being proven wrong about who deserves grace"],
      coreMotivations: ["Nationalistic pride", "Justice without mercy", "Control over who receives God's favor"],
      relationalStyle: "Avoidant when challenged, sulking when things don't go his way",
      blindSpots: ["His own need for the same mercy he resents in others", "Cares more about a plant than an entire city", "His theology is correct but his heart is wrong"],
      healingMoments: ["Prayer from the belly of the fish", "God's patient object lesson with the gourd"]
    },
    strengths: ["Effective preaching", "Theological knowledge", "Honesty about his own feelings"],
    weaknesses: ["Prejudice", "Disobedience", "Anger at God's mercy", "Self-pity", "Nationalistic hatred"],
    journey: [
      { phase: "Calling", description: "God commands him to preach repentance to Nineveh" },
      { phase: "Resistance", description: "Flees to Tarshish—the opposite direction" },
      { phase: "Testing", description: "Storm, thrown overboard, swallowed by a great fish" },
      { phase: "Failure", description: "Even after obeying, he is furious at God's mercy" },
      { phase: "Refinement", description: "God's patient lesson through the gourd, the worm, and the scorching wind" },
      { phase: "Legacy", description: "Jesus references Jonah as a sign of His own death and resurrection" }
    ],
    relationships: [
      { name: "God", role: "The Lord he runs from and argues with" },
      { name: "Nineveh", role: "The enemy city he is sent to save" },
      { name: "Sailors", role: "Pagan men who feared God more than Jonah did" }
    ],
    lessonsAndReflection: [
      "Who are the 'Ninevites' in your life—people you think don't deserve God's grace?",
      "Are you running from a clear calling because you disagree with God's plan?",
      "Can you celebrate when God blesses your enemies?"
    ],
    relatedCharacters: ["elijah", "nahum"],
    situations: [
      {
        id: "jonah-flees-tarshish",
        title: "Jonah Flees to Tarshish",
        category: "Obedience",
        reference: "Jonah 1",
        keyVerse: "But Jonah rose up to flee unto Tarshish from the presence of the LORD. —Jonah 1:3",
        situation: "God calls Jonah to preach repentance to Nineveh, the capital of Assyria—Israel's most brutal enemy. Jonah boards a ship heading the opposite direction.",
        pressure: "Nineveh represents everything Jonah hates. Assyria has brutalized his people. He knows God is merciful and fears that if Nineveh repents, God will spare them.",
        innerBattle: "Obedience to God's clear command versus nationalistic hatred. The unbearable thought that his enemies might receive the same mercy he enjoys.",
        response: "Jonah deliberately disobeys. He goes to Joppa, pays the fare, and sails for Tarshish—as far from Nineveh as he can get.",
        outcome: "God sends a violent storm. The pagan sailors fear God more than Jonah does. Jonah is thrown overboard and swallowed by a great fish for three days.",
        lesson: "You cannot outrun God's calling. The cost of disobedience is always greater than the cost of obedience.",
        traitRevealed: "Willful disobedience and prejudice",
        spiritualPrinciple: "Running from God doesn't change His plan—it only adds suffering to your journey.",
        reflectionQuestions: [
          "What clear calling are you running from because you disagree with it?",
          "Is your disobedience rooted in fear, prejudice, or a desire to control outcomes?",
          "What storm is God sending to redirect you?"
        ],
        dnaSnapshot: { faith: 2, courage: 1, pride: 4, fear: 4 }
      },
      {
        id: "jonah-anger-nineveh-repentance",
        title: "Jonah's Anger at Nineveh's Repentance",
        category: "Correction",
        reference: "Jonah 3:10-4:11",
        keyVerse: "Doest thou well to be angry? —Jonah 4:4",
        situation: "Jonah preaches eight words—'Yet forty days, and Nineveh shall be overthrown'—and the entire city repents, from the king to the cattle. God relents from judgment.",
        pressure: "Jonah has just witnessed the greatest revival in recorded history. Instead of joy, he is consumed with rage because God spared his enemies.",
        innerBattle: "His theology is perfect—he knows God is gracious, merciful, slow to anger, and of great kindness. But his heart cannot accept that this mercy extends to Nineveh.",
        response: "Jonah sits outside the city hoping God will still destroy it. He tells God he'd rather die than watch Nineveh live.",
        outcome: "God grows a gourd to shade him, then sends a worm to kill it. When Jonah grieves more for a plant than for 120,000 people, God delivers the book's devastating final question.",
        lesson: "Correct theology with a merciless heart is a spiritual crisis. You can know everything about God's grace and still resent it when it reaches people you despise.",
        traitRevealed: "Merciless prejudice masked by religious knowledge",
        spiritualPrinciple: "God's mercy is not limited by your categories. If you rejoice in grace for yourself but resent it for others, you do not truly understand it.",
        reflectionQuestions: [
          "Whose repentance would make you angry rather than joyful?",
          "Do you care more about your comfort (the gourd) than about people's souls (Nineveh)?",
          "How would you answer God's final question: 'Should not I spare Nineveh?'"
        ],
        dnaSnapshot: { pride: 5, compassion: 1, faith: 3, humility: 1 }
      }
    ]
  },

  {
    id: "jeremiah",
    name: "Jeremiah",
    meaning: "The LORD exalts / The LORD throws",
    emoji: "😢",
    role: "Prophet to Judah, The Weeping Prophet",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Jeremiah", "Lamentations"],
    archetypes: ["Prophet", "Martyr"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 5, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Unwavering faithfulness despite zero visible results",
      weakness: "Depression and desire to quit",
      mindset: "I must speak what God says even if no one listens",
      keyLesson: "Faithfulness is not measured by results but by obedience.",
      keyVerse: "Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations.",
      keyVerseRef: "Jeremiah 1:5"
    },
    storyArc: "Called as a teenager, Jeremiah preached for forty years to a nation that refused to listen. He was beaten, imprisoned, thrown in a cistern, and forced to watch Jerusalem's destruction—yet never stopped speaking God's word.",
    therapyView: {
      drivingFears: ["Speaking and not being heard", "Inadequacy due to youth", "Watching destruction he warned about"],
      coreMotivations: ["Obedience to God's word", "Love for his people", "Truth regardless of cost"],
      relationalStyle: "Deeply empathetic but emotionally overwhelmed, isolated by his calling",
      blindSpots: ["Occasional despair that borders on bitterness", "Struggles with loneliness", "Questions God's calling in moments of pain"],
      healingMoments: ["God's promise at his calling", "The new covenant prophecy (Jeremiah 31:31-34)", "Baruch's faithful companionship"]
    },
    strengths: ["Absolute faithfulness", "Emotional honesty with God", "Courage to speak unpopular truth", "Compassion for his enemies", "Perseverance through decades of rejection"],
    weaknesses: ["Depression", "Desire to quit", "Loneliness", "Emotional overwhelm"],
    journey: [
      { phase: "Calling", description: "Called as a youth, told not to say 'I am too young'" },
      { phase: "Resistance", description: "Protested his youth and inadequacy" },
      { phase: "Testing", description: "Decades of preaching to a deaf nation, persecution from leaders and false prophets" },
      { phase: "Failure", description: "Moments of wanting to quit and cursing the day he was born" },
      { phase: "Refinement", description: "Endured imprisonment, the cistern, and the fall of Jerusalem" },
      { phase: "Legacy", description: "The New Covenant prophecy, Lamentations, and a model of faithful suffering" }
    ],
    relationships: [
      { name: "God", role: "The One who called and sustained him" },
      { name: "Baruch", role: "Faithful scribe and companion" },
      { name: "Zedekiah", role: "Weak king who secretly consulted him" },
      { name: "Pashhur", role: "Priest who persecuted him" }
    ],
    lessonsAndReflection: [
      "Are you willing to be faithful even when no one listens?",
      "How do you handle the loneliness of an unpopular calling?",
      "Can you be honest with God about your pain without abandoning your post?"
    ],
    relatedCharacters: ["isaiah", "ezekiel", "baruch"],
    situations: [
      {
        id: "jeremiah-called-as-youth",
        title: "Jeremiah Called as a Youth",
        category: "Calling",
        reference: "Jeremiah 1:4-10",
        keyVerse: "Before I formed thee in the belly I knew thee. —Jeremiah 1:5",
        situation: "God calls the young Jeremiah to be a prophet to the nations, giving him authority to root out, pull down, destroy, throw down, build, and plant.",
        pressure: "He is young and inexperienced. The message he must deliver is judgment to his own people. He knows he will face opposition from kings, priests, and the entire nation.",
        innerBattle: "Inadequacy versus divine calling. 'I am only a child' versus 'Before you were born I set you apart.'",
        response: "Jeremiah protests his youth, but God touches his mouth and places His words there. Jeremiah accepts the commission.",
        outcome: "He begins a forty-year prophetic ministry that will cost him everything earthly but preserve God's word for eternity.",
        lesson: "God does not call the equipped—He equips the called. Your youth, inexperience, or inadequacy are not disqualifiers when God has ordained you.",
        traitRevealed: "Humble willingness despite fear",
        spiritualPrinciple: "God's calling is based on His knowledge of you before birth, not on your current qualifications.",
        reflectionQuestions: [
          "What calling are you resisting because you feel too young, too old, or too unqualified?",
          "Can you trust that the God who formed you also prepared you?",
          "What would it mean to stop making excuses and simply say 'Here I am'?"
        ],
        dnaSnapshot: { faith: 4, humility: 5, courage: 3, fear: 3 }
      },
      {
        id: "jeremiah-cistern",
        title: "Jeremiah Thrown in a Cistern",
        category: "Persecution",
        reference: "Jeremiah 38:1-13",
        keyVerse: "So they took Jeremiah, and cast him into the dungeon... and Jeremiah sunk in the mire. —Jeremiah 38:6",
        situation: "Jeremiah's message of surrender to Babylon enrages the officials. They accuse him of treason and throw him into an empty cistern to die, where he sinks into the mud.",
        pressure: "He has been faithfully preaching God's word and is rewarded with attempted murder by his own people's leaders. There is no human rescue in sight.",
        innerBattle: "The temptation to despair completely. Every fear about his calling has been realized. He is sinking in mud, starving, and left to die for speaking truth.",
        response: "Jeremiah does not recant. He does not change his message. He waits in the mire until God sends rescue through Ebed-melech, an Ethiopian eunuch.",
        outcome: "Ebed-melech pulls him out with rags and ropes. Jeremiah continues prophesying. His message is vindicated when Jerusalem falls exactly as he warned.",
        lesson: "Faithfulness to God's word may put you in the pit, but God always has a deliverer prepared—often from the most unexpected source.",
        traitRevealed: "Unbreakable faithfulness under persecution",
        spiritualPrinciple: "God does not promise to keep you from the pit, but He promises to never leave you in it.",
        reflectionQuestions: [
          "What pit has your faithfulness to truth landed you in?",
          "Are you willing to keep speaking truth even when it costs you everything?",
          "Who is the unexpected 'Ebed-melech' God might send to rescue you?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 5, fear: 3 }
      }
    ]
  },

  {
    id: "elijah",
    name: "Elijah",
    meaning: "My God is Yahweh",
    emoji: "🔥",
    role: "Prophet of Fire, Challenger of Baal",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 17-19", "2 Kings 1-2"],
    archetypes: ["Prophet", "Warrior"],
    dna: { faith: 5, humility: 3, courage: 5, wisdom: 4, compassion: 3, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Bold confrontation of evil and supernatural faith",
      weakness: "Emotional crash after spiritual highs",
      mindset: "God is God—and I will prove it",
      keyLesson: "Even the strongest warriors of faith have breaking points, and God meets them there.",
      keyVerse: "How long halt ye between two opinions? if the LORD be God, follow him: but if Baal, then follow him.",
      keyVerseRef: "1 Kings 18:21"
    },
    storyArc: "Appeared from nowhere to confront King Ahab, shut the heavens for three years, called down fire from heaven on Mount Carmel, then fled in terror from Jezebel and wanted to die—until God restored him with rest, food, and a still small voice.",
    therapyView: {
      drivingFears: ["Being the only faithful one left", "Jezebel's death threat", "Abandonment"],
      coreMotivations: ["Zeal for God's honor", "Destroying idolatry", "Proving God's supremacy"],
      relationalStyle: "Intensely passionate but prone to isolation and emotional extremes",
      blindSpots: ["Believes he is the only faithful one when God has 7,000 who haven't bowed to Baal", "Emotional crash after victory", "Difficulty sustaining beyond dramatic moments"],
      healingMoments: ["God's provision at Cherith and Zarephath", "The still small voice on Horeb", "Passing the mantle to Elisha"]
    },
    strengths: ["Supernatural boldness", "Uncompromising stand for God", "Powerful prayer", "Dramatic faith", "Willingness to stand alone"],
    weaknesses: ["Emotional volatility", "Depression after victory", "Isolation", "Self-pity", "Running when threatened"],
    journey: [
      { phase: "Calling", description: "Appears suddenly to pronounce drought on Israel" },
      { phase: "Resistance", description: "None initially—he acts with bold obedience" },
      { phase: "Testing", description: "Hidden by the brook Cherith, sustained by a widow in Zarephath" },
      { phase: "Failure", description: "Flees from Jezebel in terror after his greatest victory" },
      { phase: "Refinement", description: "God meets him on Mount Horeb with rest, food, and a still small voice" },
      { phase: "Legacy", description: "Taken to heaven in a chariot of fire; appears at the Transfiguration with Jesus" }
    ],
    relationships: [
      { name: "Ahab", role: "Wicked king he confronted" },
      { name: "Jezebel", role: "Queen who sought his life" },
      { name: "Elisha", role: "Successor and spiritual son" },
      { name: "Obadiah", role: "Secret believer in Ahab's court" },
      { name: "Widow of Zarephath", role: "Gentile woman who sustained him" }
    ],
    lessonsAndReflection: [
      "Do your emotional lows follow closely after spiritual highs?",
      "Are you isolating yourself and believing you're the only one left?",
      "Can you hear God in the still small voice, not just in the fire?"
    ],
    relatedCharacters: ["elisha", "ahab", "jezebel"],
    situations: [
      {
        id: "elijah-mount-carmel",
        title: "Elijah on Mount Carmel",
        category: "Faith Testing",
        reference: "1 Kings 18:17-40",
        keyVerse: "The God that answereth by fire, let him be God. —1 Kings 18:24",
        situation: "After three years of drought, Elijah challenges 450 prophets of Baal and 400 prophets of Asherah to a contest on Mount Carmel: build altars, and the God who answers by fire is the true God.",
        pressure: "He is one man against 850. The entire nation is watching. King Ahab is hostile. If God does not answer, Elijah is a dead man and Baal wins.",
        innerBattle: "The audacity of staking everything on God showing up. Mocking the prophets of Baal while waiting for fire that has not yet fallen.",
        response: "Elijah builds an altar, drenches it with water three times to eliminate any doubt, and prays a simple, confident prayer.",
        outcome: "Fire falls from heaven and consumes the sacrifice, the wood, the stones, the dust, and the water. The people fall on their faces crying 'The LORD, he is God!' The prophets of Baal are executed.",
        lesson: "One person standing with God is a majority. Bold faith invites God to display His power in unmistakable ways.",
        traitRevealed: "Supernatural boldness and dramatic faith",
        spiritualPrinciple: "God will vindicate His name when His servants are willing to stake everything on His faithfulness.",
        reflectionQuestions: [
          "Where do you need to stop wavering between two opinions?",
          "Are you willing to drench your situation in impossibility so that only God gets the glory?",
          "What bold step of faith is God asking you to take in front of everyone watching?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 4, pride: 2 }
      },
      {
        id: "elijah-flees-jezebel",
        title: "Elijah Flees from Jezebel",
        category: "Fear",
        reference: "1 Kings 19:1-18",
        keyVerse: "And after the fire a still small voice. —1 Kings 19:12",
        situation: "The day after his greatest victory, Jezebel sends a death threat. Elijah—the man who just called down fire from heaven—runs for his life into the wilderness and asks God to let him die.",
        pressure: "Physical exhaustion, emotional depletion, spiritual burnout. The adrenaline crash after Mount Carmel. Jezebel's threat feels more real than yesterday's fire.",
        innerBattle: "The devastating gap between spiritual triumph and emotional collapse. 'I am no better than my fathers.' The loneliness of believing he is the only one left.",
        response: "Elijah runs, collapses under a tree, and begs to die. God responds not with rebuke but with sleep, food, water, and a gentle voice.",
        outcome: "God feeds him twice, lets him sleep, brings him to Mount Horeb, and speaks in a still small voice. He reveals that 7,000 in Israel have not bowed to Baal. Elijah receives a new mission and a successor.",
        lesson: "Burnout is not a sign of weak faith—it is a sign of human limitation. God's response to exhausted servants is not correction but care.",
        traitRevealed: "Human fragility behind bold faith",
        spiritualPrinciple: "God does not scold the broken; He feeds them. Sometimes the most spiritual thing you can do is rest.",
        reflectionQuestions: [
          "Are you in an emotional crash after a spiritual high?",
          "Do you believe you're the only one left when God has reserved thousands?",
          "Can you hear God in the quiet after the storm, or do you only recognize Him in the dramatic?"
        ],
        dnaSnapshot: { faith: 3, fear: 5, courage: 1, humility: 4 }
      }
    ]
  },

  {
    id: "martha",
    name: "Martha",
    meaning: "Lady / Mistress of the house",
    emoji: "🏠",
    role: "Faithful Friend of Jesus, Sister of Mary and Lazarus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 10:38-42", "John 11:1-44", "John 12:1-2"],
    archetypes: ["Servant"],
    dna: { faith: 4, humility: 3, courage: 4, wisdom: 3, compassion: 4, fear: 2, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Practical devotion and bold confession of faith",
      weakness: "Anxiety and distraction from what matters most",
      mindset: "Serve with excellence—but sometimes forget to sit and listen",
      keyLesson: "Service for God must never replace relationship with God.",
      keyVerse: "Martha, Martha, thou art careful and troubled about many things: But one thing is needful.",
      keyVerseRef: "Luke 10:41-42"
    },
    storyArc: "A devoted hostess and practical servant who was gently corrected by Jesus for anxious busyness, but later made one of the boldest confessions of faith in the Gospels—declaring Jesus as the Christ even before Lazarus was raised.",
    therapyView: {
      drivingFears: ["Not being appreciated for her work", "Things not being done properly", "Losing control of situations"],
      coreMotivations: ["Serving Jesus well", "Caring for those she loves", "Having everything in order"],
      relationalStyle: "Task-oriented, expressive when frustrated, but deeply loving",
      blindSpots: ["Measures love by activity rather than presence", "Resents those who approach differently", "Anxiety disguised as devotion"],
      healingMoments: ["Jesus's gentle correction in Luke 10", "Her bold confession at Lazarus's tomb", "Serving at the supper in John 12 with evident peace"]
    },
    strengths: ["Practical service", "Hospitality", "Bold confession of faith", "Directness", "Deep love for Jesus"],
    weaknesses: ["Anxiety", "Distraction", "Comparing herself to her sister", "Measuring devotion by activity"],
    journey: [
      { phase: "Calling", description: "Opens her home to Jesus—one of His most trusted friends" },
      { phase: "Resistance", description: "Resists the idea that sitting at Jesus's feet is better than serving" },
      { phase: "Testing", description: "Lazarus's death tests everything she believes about Jesus's power" },
      { phase: "Failure", description: "Anxious complaint to Jesus about Mary not helping" },
      { phase: "Refinement", description: "From anxious hostess to bold confessor of Christ" },
      { phase: "Legacy", description: "One of the great confessions of faith: 'I believe that thou art the Christ, the Son of God'" }
    ],
    relationships: [
      { name: "Jesus", role: "Beloved friend and Lord" },
      { name: "Mary (of Bethany)", role: "Sister with a different devotional style" },
      { name: "Lazarus", role: "Brother whom Jesus raised from the dead" }
    ],
    lessonsAndReflection: [
      "Is your service for God replacing your relationship with God?",
      "Are you resentful when others serve differently than you do?",
      "Can your faith hold when God doesn't act on your timeline?"
    ],
    relatedCharacters: ["mary-of-bethany", "lazarus"],
    situations: [
      {
        id: "martha-distracted-serving",
        title: "Martha Distracted with Serving",
        category: "Correction",
        reference: "Luke 10:38-42",
        keyVerse: "Martha, Martha, thou art careful and troubled about many things: But one thing is needful. —Luke 10:41-42",
        situation: "Jesus visits Martha's home. While Mary sits at Jesus's feet listening, Martha is overwhelmed with preparations and demands that Jesus tell Mary to help.",
        pressure: "Cultural expectations of hospitality. Multiple dishes to prepare. The anxiety of hosting the most important guest imaginable. Her sister appears to be doing nothing.",
        innerBattle: "Resentment versus devotion. The feeling that her hard work is unappreciated versus the nagging sense that Mary has chosen something she herself is missing.",
        response: "Martha interrupts Jesus to complain: 'Lord, dost thou not care that my sister hath left me to serve alone? Bid her therefore that she help me.'",
        outcome: "Jesus gently but firmly redirects her: 'Martha, Martha, thou art careful and troubled about many things: but one thing is needful: and Mary hath chosen that good part.' It is the most loving rebuke in the Gospels.",
        lesson: "Busyness for God can become a substitute for being with God. The most important thing is not what you do for Jesus but what you receive from Him.",
        traitRevealed: "Service-driven anxiety and comparison",
        spiritualPrinciple: "Presence with God is more valuable than performance for God. Activity without intimacy produces resentment, not worship.",
        reflectionQuestions: [
          "Is your busyness for God actually keeping you from God?",
          "Are you resentful of people who seem to 'do less' but enjoy more peace?",
          "What would it look like to stop and simply sit at Jesus's feet today?"
        ],
        dnaSnapshot: { compassion: 4, pride: 3, humility: 2, wisdom: 2 }
      },
      {
        id: "martha-confession-lazarus-tomb",
        title: "Martha's Confession at Lazarus's Tomb",
        category: "Faith Testing",
        reference: "John 11:17-27",
        keyVerse: "I believe that thou art the Christ, the Son of God, which should come into the world. —John 11:27",
        situation: "Lazarus has been dead four days. Martha goes out to meet Jesus before He reaches the house and confronts Him with raw honesty: 'Lord, if thou hadst been here, my brother had not died.'",
        pressure: "Overwhelming grief. The apparent failure of Jesus to arrive in time. Four days of decomposition makes resurrection seem impossible.",
        innerBattle: "Grief and disappointment versus faith in Jesus's power. The tension between 'You could have prevented this' and 'I still believe You are who You say You are.'",
        response: "Despite her pain, Martha makes one of the greatest confessions of faith in Scripture: 'Yea, Lord: I believe that thou art the Christ, the Son of God.'",
        outcome: "Jesus raises Lazarus from the dead. Martha's bold faith—expressed in the darkest moment—is vindicated beyond anything she could have imagined.",
        lesson: "Faith spoken in grief is the most powerful faith of all. You can be honest about your pain and still declare what you believe about God.",
        traitRevealed: "Bold faith under grief",
        spiritualPrinciple: "God does not require you to pretend you are not hurting. He requires you to still believe while you hurt.",
        reflectionQuestions: [
          "Can you hold grief and faith at the same time?",
          "When has God's delay tested your belief in His goodness?",
          "What bold confession of faith do you need to make right now, in the middle of your pain?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4, compassion: 5 }
      }
    ]
  },

  {
    id: "mary-magdalene",
    name: "Mary Magdalene",
    meaning: "Of Magdala / Bitter",
    emoji: "💐",
    role: "Devoted Follower of Jesus, First Witness of the Resurrection",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 8:1-3", "Mark 15:40-41", "John 20:1-18"],
    archetypes: ["Redeemed", "Servant"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 3, compassion: 5, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Unwavering devotion born from radical deliverance",
      weakness: "Initial despair when the tomb appeared empty",
      mindset: "The one who has been forgiven much loves much",
      keyLesson: "Those who have experienced the deepest deliverance become the most devoted followers.",
      keyVerse: "Jesus saith unto her, Mary. She turned herself, and saith unto him, Rabboni; which is to say, Master.",
      keyVerseRef: "John 20:16"
    },
    storyArc: "Delivered from seven demons, Mary Magdalene became one of Jesus's most devoted followers—supporting His ministry, standing at the cross when others fled, arriving first at the tomb, and becoming the first person to see the risen Christ.",
    therapyView: {
      drivingFears: ["Losing Jesus", "Returning to her former bondage", "Not being believed"],
      coreMotivations: ["Gratitude for deliverance", "Devotion to Jesus", "Being near the One who set her free"],
      relationalStyle: "Fiercely loyal, emotionally present, unashamed in devotion",
      blindSpots: ["Grief can temporarily blind her to what God is doing", "Initial inability to recognize the risen Jesus through tears"],
      healingMoments: ["Deliverance from seven demons", "Jesus speaking her name at the tomb", "Being chosen as the first witness of the resurrection"]
    },
    strengths: ["Radical devotion", "Courage to stand at the cross", "Faithfulness to the end", "Emotional honesty", "First at the tomb"],
    weaknesses: ["Grief-driven despair", "Momentary inability to see beyond present pain"],
    journey: [
      { phase: "Calling", description: "Delivered from seven demons by Jesus" },
      { phase: "Resistance", description: "No recorded resistance; her gratitude fueled immediate devotion" },
      { phase: "Testing", description: "Standing at the cross when most disciples had fled" },
      { phase: "Failure", description: "Momentary despair at the empty tomb, not recognizing Jesus" },
      { phase: "Refinement", description: "Jesus speaks her name and she recognizes Him" },
      { phase: "Legacy", description: "First witness of the resurrection; sent to tell the apostles" }
    ],
    relationships: [
      { name: "Jesus", role: "Savior and Lord who delivered her" },
      { name: "The Twelve", role: "Fellow followers she was sent to tell" },
      { name: "Mary (mother of Jesus)", role: "Fellow mourner at the cross" }
    ],
    lessonsAndReflection: [
      "Has your deliverance produced devotion or complacency?",
      "Are you willing to show up when everyone else has fled?",
      "Can you recognize Jesus even when He appears in unexpected ways?"
    ],
    relatedCharacters: ["peter", "john-apostle"],
    situations: [
      {
        id: "mary-magdalene-empty-tomb",
        title: "Mary Magdalene at the Empty Tomb",
        category: "Faith Testing",
        reference: "John 20:1-18",
        keyVerse: "Jesus saith unto her, Mary. She turned herself, and saith unto him, Rabboni. —John 20:16",
        situation: "Mary Magdalene arrives at the tomb before dawn on the first day of the week and finds the stone rolled away. She sees the grave clothes but no body. She stands outside weeping.",
        pressure: "The One who delivered her from seven demons is dead. Now His body appears to be stolen. She is alone in the predawn darkness, consumed by grief.",
        innerBattle: "Despair versus hope. She cannot see past her tears. Even when two angels speak to her, she is too grief-stricken to recognize the supernatural. When Jesus stands before her, she mistakes Him for the gardener.",
        response: "She stays. She does not leave. Through her tears, she keeps looking. When Jesus speaks her name—just one word, 'Mary'—she recognizes Him instantly.",
        outcome: "She becomes the first human being to see the risen Christ. Jesus sends her as the apostle to the apostles: 'Go to my brethren and say unto them, I ascend unto my Father.' She runs to tell them.",
        lesson: "The people who show up in the darkest hour—even through tears, even without understanding—are the first to witness the resurrection. Grief does not disqualify devotion; it deepens it.",
        traitRevealed: "Devoted perseverance through grief",
        spiritualPrinciple: "Jesus reveals Himself to those who seek Him even when they cannot see Him. He knows your name, and one word from Him changes everything.",
        reflectionQuestions: [
          "Are you still showing up even when it seems like all hope is gone?",
          "Can you hear Jesus speaking your name through your grief?",
          "Who has God sent you to tell about what you have seen and experienced?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, compassion: 5, humility: 5 }
      }
    ]
  },

  {
    id: "abraham",
    name: "Abraham",
    meaning: "Father of a multitude",
    emoji: "⭐",
    role: "Father of Faith, Patriarch of Israel",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 12-25", "Romans 4", "Hebrews 11:8-19"],
    archetypes: ["Patriarch", "Seeker"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 3, compassion: 4, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Radical faith that obeyed without seeing the destination",
      weakness: "Fear-driven deception when his life was at risk",
      mindset: "God said it, and that is enough—even when I cannot see it",
      keyLesson: "Faith is believing God's promise when every circumstance says otherwise.",
      keyVerse: "And he believed in the LORD; and he counted it to him for righteousness.",
      keyVerseRef: "Genesis 15:6"
    },
    storyArc: "Called out of Ur to an unknown land with a promise of innumerable descendants, Abraham waited twenty-five years for the promised son, stumbled with Hagar, lied about Sarah twice, but ultimately passed the ultimate test of faith on Mount Moriah.",
    therapyView: {
      drivingFears: ["Dying without an heir", "Physical danger in foreign lands", "The promise never being fulfilled"],
      coreMotivations: ["Obedience to God's call", "The covenant promise", "Building a legacy"],
      relationalStyle: "Generous and hospitable but capable of self-protective deception",
      blindSpots: ["Fear-driven lying about Sarah", "Taking matters into his own hands with Hagar", "Not fully trusting God's protection in foreign territory"],
      healingMoments: ["The covenant of stars", "Isaac's birth", "The ram on Mount Moriah"]
    },
    strengths: ["Pioneering faith", "Generosity", "Hospitality", "Willingness to sacrifice everything", "Intercession for Sodom"],
    weaknesses: ["Fear-driven deception", "Impatience with God's timing (Hagar)", "Passive in family conflict"],
    journey: [
      { phase: "Calling", description: "Called to leave Ur for an unknown land at age 75" },
      { phase: "Resistance", description: "Took Lot along; lingered in Haran" },
      { phase: "Testing", description: "Famine in Canaan, wars, waiting decades for Isaac" },
      { phase: "Failure", description: "Lying about Sarah (twice), Hagar and Ishmael" },
      { phase: "Refinement", description: "The binding of Isaac—the ultimate test" },
      { phase: "Legacy", description: "Father of Israel, father of faith, friend of God" }
    ],
    relationships: [
      { name: "Sarah", role: "Wife and mother of the promise" },
      { name: "Isaac", role: "Son of promise" },
      { name: "Hagar", role: "Sarah's servant, mother of Ishmael" },
      { name: "Lot", role: "Nephew he rescued and interceded for" },
      { name: "Melchizedek", role: "Priest-king he honored" }
    ],
    lessonsAndReflection: [
      "Are you willing to leave the familiar for an unknown destination because God said so?",
      "Where is fear causing you to deceive instead of trust?",
      "What are you holding onto that God is asking you to place on the altar?"
    ],
    relatedCharacters: ["sarah", "isaac", "lot", "jacob"],
    situations: [
      {
        id: "abraham-leaves-ur",
        title: "Abraham Leaves Ur",
        category: "Calling",
        reference: "Genesis 12:1-9",
        keyVerse: "Get thee out of thy country, and from thy kindred, and from thy father's house, unto a land that I will shew thee. —Genesis 12:1",
        situation: "God calls Abram to leave everything—his country, his family, his father's house—and go to a land He will show him, with a promise of becoming a great nation.",
        pressure: "He is 75 years old. He has no children. He must leave the most advanced civilization of his day for an unknown destination. There is no map, no timeline, no guarantee except God's word.",
        innerBattle: "The security of Ur and Haran versus the uncertainty of God's promise. Leaving everything familiar for a word from a God his culture did not worship.",
        response: "Abram goes. The text is stunningly simple: 'So Abram departed, as the LORD had spoken unto him.' No recorded argument, no negotiation, no delay.",
        outcome: "He arrives in Canaan. God confirms the promise. Abraham becomes the father of the entire nation of Israel and the spiritual father of all who believe.",
        lesson: "The first step of faith is always the hardest—and the most important. Obedience does not require understanding the full plan.",
        traitRevealed: "Pioneering faith and radical obedience",
        spiritualPrinciple: "God's promises require leaving before you arrive. You cannot discover the Promised Land without first leaving the familiar.",
        reflectionQuestions: [
          "What is your 'Ur'—the comfortable place God is calling you to leave?",
          "Can you obey God's direction even when the destination is not yet visible?",
          "What would your life look like if you simply went when God said go?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4, fear: 2 }
      },
      {
        id: "abraham-sacrifice-isaac",
        title: "The Sacrifice of Isaac",
        category: "Sacrifice",
        reference: "Genesis 22:1-19",
        keyVerse: "And Abraham said, My son, God will provide himself a lamb for a burnt offering. —Genesis 22:8",
        situation: "God commands Abraham to sacrifice Isaac—the son of promise, the miracle child born when Abraham was 100—on Mount Moriah.",
        pressure: "This is the son he waited 25 years for. The one through whom all the promises flow. God appears to be contradicting Himself. If Isaac dies, the covenant dies.",
        innerBattle: "Love for his son versus obedience to God. The impossibility of reconciling God's promise with God's command. Faith that God can raise the dead versus the horror of what he is about to do.",
        response: "Abraham rises early, takes Isaac, and travels three days to Moriah. He binds his son on the altar, raises the knife, and only stops when the angel calls from heaven.",
        outcome: "God provides a ram in the thicket. The covenant is reaffirmed with the strongest language in Scripture. Abraham names the place 'The LORD will provide.'",
        lesson: "The ultimate test of faith is not what you are willing to do for God, but what you are willing to give back to Him—including the very thing He promised you.",
        traitRevealed: "Supreme faith and willingness to sacrifice",
        spiritualPrinciple: "What you hold with an open hand, God multiplies. What you cling to, you risk losing. The altar is where promises are confirmed, not destroyed.",
        reflectionQuestions: [
          "What 'Isaac' in your life—your greatest blessing—is God asking you to surrender?",
          "Can you trust God with the very thing He promised you?",
          "Do you believe God can provide even when the situation looks like death?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 5, fear: 2 }
      },
      {
        id: "abraham-lies-about-sarah",
        title: "Abraham Lies About Sarah",
        category: "Fear",
        reference: "Genesis 12:10-20; Genesis 20:1-18",
        keyVerse: "Say, I pray thee, thou art my sister: that it may be well with me for thy sake. —Genesis 12:13",
        situation: "Facing famine and then entering foreign territory, Abraham tells Sarah to say she is his sister, fearing he will be killed for his beautiful wife.",
        pressure: "He is a stranger in a powerful kingdom with no army, no allies, and no legal protection. If the king wants Sarah, the easiest path is to kill her husband.",
        innerBattle: "Self-preservation versus trust in God's protection. The fear that the God who called him out of Ur cannot protect him in Egypt or Gerar.",
        response: "Abraham deceives—twice, in Egypt and in Gerar. He lets Sarah be taken into royal households to save his own life.",
        outcome: "Both times, God intervenes directly to protect Sarah and expose the deception. Pharaoh and Abimelech both rebuke Abraham. The man of faith is shamed by pagans.",
        lesson: "Fear can make you betray the people closest to you. The same faith that climbs Mount Moriah can collapse in a foreign palace when physical danger feels more real than God's promises.",
        traitRevealed: "Fear-driven self-preservation and moral compromise",
        spiritualPrinciple: "Great faith is not perfect faith. Even heroes of faith have moments where fear overrides trust. God protects despite our failures.",
        reflectionQuestions: [
          "Where has fear caused you to compromise the people you love?",
          "Is there a pattern of self-protective deception in your life?",
          "Can you receive God's protection without engineering your own safety?"
        ],
        dnaSnapshot: { fear: 5, pride: 3, faith: 2, courage: 1 }
      }
    ]
  },

  {
    id: "jacob",
    name: "Jacob",
    meaning: "Supplanter / Heel-grabber",
    emoji: "🤼",
    role: "Patriarch of the Twelve Tribes, Israel",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 25-35", "Genesis 46-49"],
    archetypes: ["Manipulator", "Patriarch", "Redeemed"],
    dna: { faith: 4, humility: 2, courage: 3, wisdom: 3, compassion: 3, fear: 4, pride: 4, greed: 4 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Tenacity and desire for God's blessing",
      weakness: "Deception and manipulation as default strategies",
      mindset: "I must secure the blessing by any means necessary",
      keyLesson: "What you scheme to obtain, God was willing to give freely. Surrender produces what striving never could.",
      keyVerse: "I will not let thee go, except thou bless me.",
      keyVerseRef: "Genesis 32:26"
    },
    storyArc: "Born grasping his brother's heel, Jacob deceived his father, fled from Esau, was deceived by Laban for twenty years, wrestled with God at Peniel, and was broken and renamed Israel—the man who strives with God and prevails.",
    therapyView: {
      drivingFears: ["Being second", "Missing the blessing", "Esau's revenge", "Loss of control"],
      coreMotivations: ["Securing the blessing at any cost", "Proving his worth", "Building a legacy"],
      relationalStyle: "Calculating and strategic, capable of deep love but defaults to manipulation",
      blindSpots: ["His schemes always create bigger problems than they solve", "He reaps exactly what he sows (Laban deceives him as he deceived Isaac)", "Cannot see that God's blessing was already his"],
      healingMoments: ["Bethel ladder dream", "Wrestling with God at Peniel", "Reconciliation with Esau"]
    },
    strengths: ["Tenacity", "Desire for spiritual things", "Hard worker", "Deep love for Rachel and Joseph", "Eventual humility after Peniel"],
    weaknesses: ["Deception", "Favoritism among children", "Fear and scheming", "Manipulation", "Slow to trust God's provision"],
    journey: [
      { phase: "Calling", description: "Chosen before birth—'the elder shall serve the younger'" },
      { phase: "Resistance", description: "Instead of trusting God's promise, he schemes to obtain it himself" },
      { phase: "Testing", description: "Twenty years of Laban's exploitation, reaping what he sowed" },
      { phase: "Failure", description: "Deceiving Isaac, fleeing from Esau, favoritism with Joseph" },
      { phase: "Refinement", description: "Wrestling with God, broken hip, new name 'Israel'" },
      { phase: "Legacy", description: "Father of the twelve tribes, blesses his sons prophetically before death" }
    ],
    relationships: [
      { name: "Esau", role: "Twin brother he deceived" },
      { name: "Isaac", role: "Father he tricked" },
      { name: "Rebekah", role: "Mother who helped him scheme" },
      { name: "Laban", role: "Father-in-law who out-deceived him" },
      { name: "Rachel", role: "Beloved wife" },
      { name: "Leah", role: "Unloved first wife" },
      { name: "Joseph", role: "Favorite son" }
    ],
    lessonsAndReflection: [
      "Where are you scheming for what God has already promised to give?",
      "What deception in your past has come back to visit you?",
      "Are you willing to be broken before God so He can rename you?"
    ],
    relatedCharacters: ["esau", "laban", "rachel", "leah", "joseph"],
    situations: [
      {
        id: "jacob-steals-blessing",
        title: "Jacob Steals the Blessing",
        category: "Temptation",
        reference: "Genesis 27:1-40",
        keyVerse: "Art thou my very son Esau? And he said, I am. —Genesis 27:24",
        situation: "Isaac is old and blind and calls Esau to receive the patriarchal blessing. Rebekah overhears and orchestrates a scheme for Jacob to impersonate Esau and steal it.",
        pressure: "This is a once-in-a-lifetime, irrevocable blessing. If Jacob does not act now, Esau receives what Jacob believes God intended for him. His mother is pushing him. The window is closing.",
        innerBattle: "Fear of being caught versus desire for the blessing. Trust in God's pre-birth promise versus the compulsion to make it happen through deception.",
        response: "Jacob puts on Esau's clothes, covers his hands with goatskins, and lies directly to his blind father's face—multiple times—to steal the blessing.",
        outcome: "He receives the blessing but loses his home, his family, and his safety. Esau vows to kill him. Jacob flees and does not see his mother again. He spends twenty years reaping the consequences of deception.",
        lesson: "What God has promised you does not need to be stolen. Scheming for God's blessing always costs more than waiting for it.",
        traitRevealed: "Deception and impatient grasping",
        spiritualPrinciple: "God's timing and God's methods are as important as God's promises. When you manipulate outcomes, you create consequences that outlast the achievement.",
        reflectionQuestions: [
          "Where have you tried to 'help God' through deception or manipulation?",
          "What relational damage has resulted from your scheming?",
          "Can you trust God to give you what He promised without your interference?"
        ],
        dnaSnapshot: { greed: 5, pride: 4, fear: 4, faith: 2 }
      },
      {
        id: "jacob-wrestles-with-god",
        title: "Jacob Wrestles with God",
        category: "Faith Testing",
        reference: "Genesis 32:22-32",
        keyVerse: "I will not let thee go, except thou bless me. —Genesis 32:26",
        situation: "The night before meeting Esau after twenty years, Jacob sends his family across the Jabbok River and is left alone. A mysterious man wrestles with him until dawn.",
        pressure: "Jacob is terrified of Esau. He has schemed, bribed, and strategized. Now, alone in the dark, every human strategy is exhausted. He faces both Esau's wrath and God's reckoning.",
        innerBattle: "The culmination of a lifetime of grasping. Every scheme, every manipulation, every fear converges in this one night. He cannot defeat this opponent, but he refuses to let go.",
        response: "Jacob clings to his opponent with desperate tenacity. When his hip is dislocated, he still will not release his grip. 'I will not let thee go, except thou bless me.'",
        outcome: "God renames him Israel—'he who strives with God and prevails.' His hip is permanently broken. He limps into the dawn a different man. When he meets Esau, he bows seven times, and the brother he feared embraces him.",
        lesson: "The blessing you spent your whole life scheming for only comes when you stop fighting for it and start clinging to God. Brokenness is the door to identity.",
        traitRevealed: "Desperate tenacity transformed into surrender",
        spiritualPrinciple: "God sometimes has to break you to bless you. The limp is the proof of the encounter. Your new name comes through surrender, not strategy.",
        reflectionQuestions: [
          "What midnight wrestling match is God bringing you through right now?",
          "Are you willing to be broken in order to be renamed?",
          "What would it look like to stop scheming and simply cling to God?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 5, fear: 3 }
      }
    ]
  }
];

export const biblicalCharacterProfiles: CharacterProfile[] = [
  ...coreCharacters,
  ...characterBatch1,
  ...characterBatch2,
  ...characterBatch3,
  ...characterBatch4,
  ...characterBatch5,
];
