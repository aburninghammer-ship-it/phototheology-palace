export interface CreatureStyleDrill {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

export interface CreatureStyle {
  id: string;
  name: string;
  animal: string;
  philosophy: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  bestUsedAgainst: string[];
  keyPrinciples: string[];
  scripture: string[];
  drills: CreatureStyleDrill[];
}

export const CREATURE_STYLES: CreatureStyle[] = [
  {
    id: "crane",
    name: "Crane Style",
    animal: "Crane",
    philosophy: "Graceful Countering - Non-retaliatory, precise, defensive redirection",
    description: "The Crane Style is the art of elegant defense and precise counterattacks. Like a crane standing in water, you remain calm, balanced, and patient. You don't initiate aggression - you redirect it. When the enemy attacks, you step aside gracefully and use their momentum against them. This is the style of turning the other cheek while maintaining dignity and strength.",
    strengths: [
      "Excellent for maintaining composure under attack",
      "Redirects enemy energy without absorbing it",
      "Preserves your peace while defending truth",
      "Perfect for verbal attacks and criticism",
      "Demonstrates Christlike non-retaliation"
    ],
    weaknesses: [
      "Can be misinterpreted as weakness",
      "Requires high self-control",
      "May not feel satisfying to the flesh",
      "Requires practice to master timing",
      "Can be difficult when emotions are high"
    ],
    bestUsedAgainst: [
      "Verbal attacks and criticism",
      "False accusations",
      "Provocations designed to make you react",
      "Arguments and quarrels",
      "Attempts to draw you into sin through conflict"
    ],
    keyPrinciples: [
      "Don't absorb the attack - deflect it",
      "Remain graceful under pressure",
      "Use precise, minimal movements",
      "Let the enemy's force work against them",
      "Maintain balance and poise at all times",
      "Answer softly to turn away wrath"
    ],
    scripture: [
      "Proverbs 15:1 - A soft answer turneth away wrath: but grievous words stir up anger",
      "Matthew 5:39 - Whosoever shall smite thee on thy right cheek, turn to him the other also",
      "Romans 12:19 - Vengeance is mine; I will repay, saith the Lord",
      "1 Peter 2:23 - When he was reviled, reviled not again",
      "Proverbs 26:4 - Answer not a fool according to his folly"
    ],
    drills: [
      {
        id: "feather-parry",
        name: "Feather-Parry Drill",
        description: "Practice deflecting verbal attacks with soft, graceful responses",
        steps: [
          "Recall or imagine a harsh criticism",
          "Instead of defending or counterattacking, practice a gentle redirect",
          "Example: 'I understand you feel that way. Thank you for sharing.'",
          "Focus on not absorbing the emotional poison",
          "Let the attack pass by you like water off a crane's feathers",
          "Maintain inner peace regardless of their response"
        ]
      },
      {
        id: "wing-guard",
        name: "Wing-Guard Stance",
        description: "Maintain protective posture without aggression",
        steps: [
          "Stand with dignified posture",
          "Imagine yourself as a crane with wings partially raised - protective but not threatening",
          "Practice responding to attacks without retreating or advancing",
          "Hold your ground with quiet strength",
          "Refuse to be moved by provocation",
          "Let your calm presence disarm the aggressor"
        ]
      },
      {
        id: "sky-pivot",
        name: "Sky-Pivot Technique",
        description: "Redirect conversations away from conflict",
        steps: [
          "When conversation turns hostile, pivot gracefully",
          "Acknowledge the other person's concern",
          "Redirect to higher ground: focus on solutions, common values, or truth",
          "Don't get sucked into the argument",
          "Maintain elevation like a crane flying above the swamp",
          "End with blessing or prayer if possible"
        ]
      }
    ]
  },
  {
    id: "mantis",
    name: "Praying Mantis Style",
    animal: "Praying Mantis",
    philosophy: "Patience and Timing - Small movements, sudden strike, waiting until temptation exposes weakness",
    description: "The Praying Mantis Style is the art of stillness, patience, and perfectly timed counterattacks. Like a mantis that remains motionless until the precise moment to strike, you wait on God's timing. You don't rush into battle. You observe, discern, and strike only when the Spirit leads. This is the style of 'waiting on the Lord' and executing with precision.",
    strengths: [
      "Conserves energy by waiting for the right moment",
      "Strikes with maximum effectiveness",
      "Demonstrates faith in God's timing",
      "Avoids impulsive reactions",
      "Creates opportunities through patience"
    ],
    weaknesses: [
      "Requires significant self-control",
      "Can be difficult in urgent situations",
      "May appear passive to observers",
      "Requires spiritual discernment",
      "Can be challenging when feeling pressured"
    ],
    bestUsedAgainst: [
      "Temptations that pressure you to act immediately",
      "Situations requiring wisdom and discernment",
      "When the enemy is trying to force your hand",
      "Complex problems with no clear solution",
      "When multiple attacks are coming simultaneously"
    ],
    keyPrinciples: [
      "Stillness is strength",
      "Wait for the enemy to expose their weakness",
      "Strike only when the Spirit gives the signal",
      "Small, precise movements are better than large, wild ones",
      "Timing is everything",
      "Patience wears down the enemy"
    ],
    scripture: [
      "Psalm 27:14 - Wait on the LORD: be of good courage, and he shall strengthen thine heart",
      "Isaiah 40:31 - They that wait upon the LORD shall renew their strength",
      "Lamentations 3:26 - It is good that a man should both hope and quietly wait for the salvation of the LORD",
      "Psalm 37:7 - Rest in the LORD, and wait patiently for him",
      "Ecclesiastes 3:1 - To every thing there is a season, and a time to every purpose under the heaven"
    ],
    drills: [
      {
        id: "hand-trap",
        name: "Hand-Trap Exercise",
        description: "Practice waiting for the enemy's overreach before responding",
        steps: [
          "When tempted, resist the urge to immediately react",
          "Observe the temptation like a mantis watching prey",
          "Wait for the temptation to overstep or reveal a weakness",
          "When it does, strike with a precise Scripture or prayer",
          "Return to stillness",
          "Repeat the cycle until temptation retreats"
        ]
      },
      {
        id: "freeze-timing",
        name: "Freeze-Timing Drill",
        description: "Develop the ability to remain still under pressure",
        steps: [
          "Set a timer for 5 minutes",
          "Sit in complete stillness and silence",
          "As thoughts, urgencies, or anxieties arise, remain frozen",
          "Practice discerning between fleshly impulse and Spirit leading",
          "Only move when you have clear direction from God",
          "Build up to longer periods of stillness"
        ]
      },
      {
        id: "delayed-countermove",
        name: "Delayed Countermove",
        description: "Train to respond with delay, not immediacy",
        steps: [
          "When provoked or tempted, institute a mandatory 10-second delay",
          "Use those 10 seconds to pray silently",
          "Ask God: 'Is now the time? Is this the right response?'",
          "If yes, move with precision",
          "If no, remain still and wait",
          "Let God time your counterattacks"
        ]
      }
    ]
  },
  {
    id: "snake",
    name: "Snake Style",
    animal: "Snake",
    philosophy: "Fluidity and Adaptation - Soft strength, serpentine motion, redirecting temptation",
    description: "The Snake Style is the art of flexibility, adaptation, and flowing movement. Like a snake that can move through any terrain, you adapt to every situation without breaking. When you can't go through something, you go around it. When blocked, you find another path. This is the style of supernatural flexibility - strong but never rigid, firm but never brittle.",
    strengths: [
      "Adapts to any situation",
      "Avoids direct confrontation when wise",
      "Finds creative solutions",
      "Maintains strength through flexibility",
      "Difficult for enemy to pin down"
    ],
    weaknesses: [
      "Can be misinterpreted as compromise",
      "Requires wisdom to avoid actual compromise",
      "May frustrate those who prefer direct approaches",
      "Can become evasive if misused",
      "Requires discernment to know when to adapt vs. stand firm"
    ],
    bestUsedAgainst: [
      "Situations with no clear direct path",
      "When surrounded by multiple temptations",
      "Complex interpersonal conflicts",
      "When the enemy expects a specific response",
      "Environments requiring cultural or social navigation"
    ],
    keyPrinciples: [
      "Flexibility is not weakness - it's wisdom",
      "Flow around obstacles instead of crashing into them",
      "Adapt your approach, never your principles",
      "Be unpredictable to the enemy",
      "Use indirect routes to reach goals",
      "Soft strength is still strength"
    ],
    scripture: [
      "Matthew 10:16 - Be ye therefore wise as serpents, and harmless as doves",
      "1 Corinthians 9:22 - I am made all things to all men, that I might by all means save some",
      "Proverbs 22:3 - A prudent man foreseeth the evil, and hideth himself",
      "Acts 17:22-23 - Paul adapted his approach to the Athenians",
      "Daniel 1:8 - Daniel purposed in his heart (principle) but adapted method"
    ],
    drills: [
      {
        id: "liquid-flow",
        name: "Liquid-Flow Thought Movement",
        description: "Practice mental flexibility and creative problem-solving",
        steps: [
          "Identify a situation where you feel stuck",
          "Imagine yourself as water finding a way around the obstacle",
          "List 5 different approaches (not compromises) to the same goal",
          "Ask God for creative wisdom",
          "Choose the path of least resistance that maintains integrity",
          "Execute with fluid confidence"
        ]
      },
      {
        id: "temptation-displacement",
        name: "Temptation Displacement",
        description: "Learn to redirect temptation rather than confront it head-on",
        steps: [
          "When tempted, instead of fighting directly, redirect",
          "If tempted to lust, redirect energy into worship or service",
          "If tempted to anger, redirect into intercession",
          "If tempted to pride, redirect into gratitude",
          "Flow around the temptation to a better path",
          "Let the temptation's energy fuel righteousness"
        ]
      },
      {
        id: "soft-block",
        name: "Soft-Block Defense",
        description: "Deflect attacks without rigid resistance",
        steps: [
          "When criticized or attacked, don't stiffen defensively",
          "Soften your response: 'You may be right. Let me consider that.'",
          "Flow with the attack to remove its power",
          "Don't give the enemy a hard surface to strike",
          "Like a snake that can't be cornered, remain elusive",
          "Maintain your course while appearing flexible"
        ]
      }
    ]
  },
  {
    id: "dragon",
    name: "Dragon Style",
    animal: "Dragon",
    philosophy: "Ferocity and Overwhelm - Bold, Spirit-filled fire, holy indignation",
    description: "The Dragon Style is the art of overwhelming force, fierce conviction, and holy aggression. Like a dragon breathing fire, you attack sin with intensity and zeal. This is not fleshly anger - it's righteous indignation. You hate evil with a perfect hatred. You storm the gates of hell. You tear down strongholds with violence. This is the style of the prophets who overturned tables and called out hypocrisy.",
    strengths: [
      "Destroys strongholds decisively",
      "Demonstrates holy zeal and passion",
      "Intimidates the enemy",
      "Useful for urgent spiritual crises",
      "Mobilizes others to action"
    ],
    weaknesses: [
      "Can be misused in fleshly anger",
      "May damage relationships if applied to people",
      "Requires spiritual maturity to wield correctly",
      "Can be exhausting to sustain",
      "Can cross into pride if not Spirit-led"
    ],
    bestUsedAgainst: [
      "Entrenched sin and strongholds",
      "Demonic oppression",
      "False teaching and heresy",
      "Blasphemy and mockery of God",
      "When righteous indignation is required"
    ],
    keyPrinciples: [
      "Channel holy anger, not fleshly rage",
      "Direct fire at sin, never at people",
      "Overwhelming force breaks through resistance",
      "Boldness and confidence in God's power",
      "No hesitation or half-measures",
      "Let the Spirit be your fire"
    ],
    scripture: [
      "Matthew 21:12-13 - Jesus cleansed the temple with fiery zeal",
      "John 2:15-17 - Zeal for thine house hath eaten me up",
      "Matthew 11:12 - The kingdom of heaven suffereth violence, and the violent take it by force",
      "Psalm 139:21-22 - Do not I hate them, O LORD, that hate thee?",
      "2 Corinthians 10:4-5 - Pulling down strongholds, casting down imaginations"
    ],
    drills: [
      {
        id: "fire-breath-prayer",
        name: "Fire-Breath Prayer",
        description: "Pray with intensity, authority, and holy aggression",
        steps: [
          "Identify a stronghold in your life",
          "Get alone and pray loudly against it",
          "Command it to break in Jesus' name",
          "Don't be polite - be bold and aggressive",
          "Let righteous anger fuel your prayer",
          "Keep attacking until you sense breakthrough"
        ]
      },
      {
        id: "talon-strike",
        name: "Talon-Strike (Destroy Strongholds)",
        description: "Attack sin with ferocious decisiveness",
        steps: [
          "Identify a sin pattern that has entrenched itself",
          "Refuse to negotiate or manage it",
          "Attack it with overwhelming force: fasting, extended prayer, accountability",
          "Cut off all supply lines feeding the sin",
          "Pursue it until it's completely destroyed",
          "Take no prisoners - total eradication"
        ]
      },
      {
        id: "overwhelm-with-scripture",
        name: "Overwhelm Self with Scripture",
        description: "Flood your mind with rapid-fire Scripture",
        steps: [
          "When self rises up, don't debate - overwhelm it",
          "Quote verse after verse without stopping",
          "Let the Word build like fire",
          "Don't give self a chance to respond",
          "Keep the pressure on until self is silenced",
          "End with a declaration of victory"
        ]
      }
    ]
  }
];
