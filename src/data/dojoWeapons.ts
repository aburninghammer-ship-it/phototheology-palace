export interface WeaponDrill {
  id: string;
  name: string;
  description: string;
  steps: string[];
  scripture: string[];
}

export interface DojoWeapon {
  id: string;
  name: string;
  category: string;
  description: string;
  purpose: string;
  drills: WeaponDrill[];
  keyScripture: string;
  combatApplication: string;
}

export const DOJO_WEAPONS: DojoWeapon[] = [
  {
    id: "myrrh-power",
    name: "Myrrh-Power",
    category: "endurance",
    description: "The weapon of endurance, faithfulness unto death. Myrrh was used in burial and suffering - it represents the power to remain faithful through pain and hardship.",
    purpose: "To endure trials, maintain faithfulness under pressure, and die to self without retreat.",
    keyScripture: "Revelation 2:10 - Be thou faithful unto death, and I will give thee a crown of life",
    combatApplication: "When facing prolonged spiritual warfare, discouragement, or the temptation to quit, deploy Myrrh-Power to outlast the enemy.",
    drills: [
      {
        id: "pain-endurance",
        name: "Pain Endurance Simulation",
        description: "Train your spirit to endure suffering without complaint or retreat",
        steps: [
          "Identify a current area of spiritual pain or difficulty",
          "Meditate on Christ's suffering on the cross",
          "Declare: 'I will not retreat. I will not complain. I will endure.'",
          "Hold your position in prayer for 10 minutes without wavering",
          "Thank God for the privilege of suffering with Christ"
        ],
        scripture: [
          "Romans 5:3-4 - We glory in tribulations also",
          "2 Corinthians 4:17 - Our light affliction works for us a far more exceeding weight of glory",
          "James 1:2-4 - Count it all joy when you fall into various trials"
        ]
      },
      {
        id: "death-before-defeat",
        name: "Death-Before-Defeat Affirmations",
        description: "Establish the resolve to die rather than surrender to sin",
        steps: [
          "Kneel before God in prayer",
          "Identify the sin or temptation you're facing",
          "Declare aloud: 'I would rather die than yield to this sin'",
          "Visualize yourself choosing death over compromise",
          "Commit to this standard for the next 24 hours"
        ],
        scripture: [
          "Revelation 12:11 - They loved not their lives unto the death",
          "Luke 9:23 - Let him deny himself, take up his cross daily, and follow me",
          "Philippians 3:10 - That I may know him...and the fellowship of his sufferings"
        ]
      }
    ]
  },
  {
    id: "burning-hammer",
    name: "The Burning Hammer",
    category: "truth",
    description: "This weapon shatters Satan's illusions and breaks the enemy's distorted lenses. It reveals reality and destroys deception.",
    purpose: "To demolish false narratives, shatter sinful illusions, and reveal the true nature of temptation.",
    keyScripture: "John 8:32 - Ye shall know the truth, and the truth shall make you free",
    combatApplication: "When the enemy disguises sin as pleasure, uses false reasoning, or twists Scripture, swing the Burning Hammer to expose the lie.",
    drills: [
      {
        id: "illusion-shatter",
        name: "Illusion-Shatter Session",
        description: "Identify and destroy the false narratives Satan is using against you",
        steps: [
          "Write down a temptation you're facing",
          "List all the lies Satan tells you about this sin (it's not that bad, everyone does it, you deserve it, etc.)",
          "For each lie, write the brutal truth from God's Word",
          "Speak the truth aloud with authority: 'This is a LIE. The TRUTH is...'",
          "Visualize the hammer shattering Satan's distorted glasses"
        ],
        scripture: [
          "2 Corinthians 10:5 - Casting down imaginations and every high thing that exalts itself against God",
          "Ephesians 5:11-13 - Have no fellowship with darkness, but rather reprove them",
          "Romans 1:25 - They changed the truth of God into a lie"
        ]
      },
      {
        id: "boomerang-scripture",
        name: "Boomerang Scripture Strike",
        description: "Use the enemy's twisted Scripture against him with proper context",
        steps: [
          "Identify a Scripture the enemy has misused against you",
          "Study the full context of that passage",
          "Write out the correct interpretation",
          "Speak it back at the enemy: 'You twisted God's Word, but HERE is what it really means!'",
          "Memorize the proper context to prevent future attacks"
        ],
        scripture: [
          "Matthew 4:1-11 - Jesus corrected Satan's Scripture twisting with 'It is written...'",
          "2 Peter 3:16 - The unlearned wrest the Scriptures unto their own destruction",
          "Acts 17:11 - Search the Scriptures daily to see if these things are so"
        ]
      },
      {
        id: "behind-scene-revelation",
        name: "Behind-the-Scene Revelation Practice",
        description: "See temptation from God's perspective - what it really is and where it leads",
        steps: [
          "Choose a sin you're tempted by",
          "Ask God to show you what He sees: the ugliness, the consequences, the slavery",
          "Visualize the full trajectory: immediate pleasure → bondage → death → hell",
          "Compare Satan's advertisement vs. God's reality",
          "Pray for holy hatred of this sin"
        ],
        scripture: [
          "Proverbs 14:12 - There is a way that seems right unto a man, but the end thereof are the ways of death",
          "James 1:15 - When lust hath conceived, it bringeth forth sin: and sin, when it is finished, bringeth forth death",
          "Hebrews 11:25 - Choosing rather to suffer affliction than to enjoy the pleasures of sin for a season"
        ]
      }
    ]
  },
  {
    id: "battle-axe",
    name: "The Battle Axe",
    category: "offense",
    description: "This weapon cuts temptation at the root. It doesn't trim branches - it destroys the source.",
    purpose: "To identify and sever the root causes of sin, not just manage symptoms.",
    keyScripture: "Matthew 3:10 - The axe is laid unto the root of the trees",
    combatApplication: "When facing recurring sin, surface symptoms, or persistent temptation, use the Battle Axe to find and destroy the root.",
    drills: [
      {
        id: "root-identification",
        name: "Root Identification",
        description: "Trace your sin back to its hidden source",
        steps: [
          "Identify a recurring sin or temptation",
          "Ask: What need am I trying to meet illegitimately?",
          "Ask: What fear, insecurity, or idol is driving this?",
          "Keep asking 'why' until you hit the core issue",
          "Name the root clearly"
        ],
        scripture: [
          "1 Timothy 6:10 - The love of money is the root of all evil",
          "James 4:1-2 - Wars come from lusts that war in your members",
          "Matthew 15:19 - Out of the heart proceed evil thoughts"
        ]
      },
      {
        id: "root-severing",
        name: "Root Severing",
        description: "Cut off the supply line feeding your sin",
        steps: [
          "Bring the identified root to God in prayer",
          "Confess it as sin (not just a struggle or weakness)",
          "Repent with specificity",
          "Ask God to cut it off at the source",
          "Visualize the Battle Axe severing the root"
        ],
        scripture: [
          "Colossians 3:5 - Mortify therefore your members which are upon the earth",
          "Romans 6:6 - Our old man is crucified with him, that the body of sin might be destroyed",
          "Galatians 5:24 - They that are Christ's have crucified the flesh"
        ]
      },
      {
        id: "root-replacement",
        name: "Root Replacement with Fruit",
        description: "Replace the severed root with the fruit of the Spirit",
        steps: [
          "Identify which fruit was missing when you sinned",
          "Plant that fruit in place of the old root",
          "Water it daily with Scripture and prayer",
          "Practice the opposite behavior",
          "Fortify with accountability"
        ],
        scripture: [
          "Ephesians 4:22-24 - Put off the old man, put on the new man",
          "Colossians 3:9-10 - Lie not...seeing you have put on the new man",
          "Romans 12:21 - Be not overcome of evil, but overcome evil with good"
        ]
      }
    ]
  },
  {
    id: "shield-of-faith",
    name: "Shield of Faith",
    category: "defense",
    description: "This shield quenches ALL the fiery darts of the wicked. It is activated by believing God's Word over Satan's lies.",
    purpose: "To deflect accusations, doubts, fears, and temptations before they penetrate.",
    keyScripture: "Ephesians 6:16 - Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked",
    combatApplication: "When under bombardment - doubts, fears, accusations, temptations - raise the shield by declaring what God says is true.",
    drills: [
      {
        id: "rapid-shield-activation",
        name: "Rapid Shield Activation",
        description: "Practice instant deployment of faith-based defense",
        steps: [
          "Set a timer for 2 minutes",
          "List rapid-fire attacks (doubts, fears, accusations)",
          "For each attack, immediately counter with a faith declaration",
          "Speak aloud: 'My shield is up! God says...'",
          "Build speed and automaticity"
        ],
        scripture: [
          "Psalm 3:3 - But thou, O LORD, art a shield for me",
          "Proverbs 30:5 - He is a shield unto them that put their trust in him",
          "Psalm 91:4 - His truth shall be thy shield and buckler"
        ]
      },
      {
        id: "missile-deflection",
        name: "Missile-Deflection Simulation",
        description: "Train to deflect specific types of spiritual missiles",
        steps: [
          "Identify the type of attack (doubt, fear, accusation, temptation)",
          "Know the corresponding Scripture shield",
          "Practice the deflection: 'That's a lie! The truth is...'",
          "Redirect the attack back at the enemy",
          "Stand firm after the deflection"
        ],
        scripture: [
          "James 4:7 - Resist the devil, and he will flee from you",
          "1 Peter 5:9 - Resist steadfast in the faith",
          "2 Corinthians 10:4 - The weapons of our warfare are mighty through God"
        ]
      }
    ]
  },
  {
    id: "thought-bombs",
    name: "Thought-Bomb Interception System",
    category: "defense",
    description: "Satan's primary weapon: rapid-fire ungodly thoughts designed to detonate in your mind. You must intercept and disarm them.",
    purpose: "To detect, intercept, and neutralize enemy thoughts before they detonate into sin.",
    keyScripture: "2 Corinthians 10:5 - Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ",
    combatApplication: "The moment an ungodly thought enters, treat it as an incoming missile. Do not entertain it. Capture it. Disarm it. Replace it.",
    drills: [
      {
        id: "radar-detection",
        name: "Radar Detection Training",
        description: "Develop sensitivity to detect thought-bombs the instant they appear",
        steps: [
          "Quiet your mind for 5 minutes",
          "Watch your thoughts like a guard at a gate",
          "The moment an ungodly thought appears, say 'DETECTED'",
          "Don't analyze it - just identify it",
          "Practice this until detection becomes automatic"
        ],
        scripture: [
          "Philippians 4:8 - Think on these things (whatsoever is true, honest, just, pure)",
          "Proverbs 4:23 - Keep thy heart with all diligence",
          "Psalm 19:14 - Let the meditation of my heart be acceptable in thy sight"
        ]
      },
      {
        id: "shock-absorption",
        name: "Shock Absorption",
        description: "Learn to absorb thought-bomb impacts without detonation",
        steps: [
          "When an evil thought hits, don't panic or shame-spiral",
          "Absorb the shock: 'This is an attack, not me'",
          "Stabilize: Take a deep breath and pray",
          "Recognize the thought as external warfare",
          "Refuse to let it explode into emotion or action"
        ],
        scripture: [
          "1 Peter 5:8 - Be sober, be vigilant; your adversary the devil walketh about",
          "James 1:14-15 - Every man is tempted when drawn away of his own lust and enticed",
          "Ephesians 6:12 - We wrestle not against flesh and blood"
        ]
      },
      {
        id: "counter-scripture-burst",
        name: "Immediate Counter-Scripture Burst",
        description: "Replace the thought-bomb with an explosive burst of Scripture",
        steps: [
          "Detect the evil thought",
          "Immediately fire a Scripture in response",
          "Speak it aloud if possible",
          "Let the Word detonate the enemy's weapon",
          "Follow up with praise or a hymn"
        ],
        scripture: [
          "Psalm 119:11 - Thy word have I hid in mine heart, that I might not sin against thee",
          "Matthew 4:4 - Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God",
          "Hebrews 4:12 - The word of God is quick, and powerful, and sharper than any twoedged sword"
        ]
      }
    ]
  },
  {
    id: "mind-of-christ",
    name: "The Mind of Christ",
    category: "transformation",
    description: "The most dangerous weapon in the arsenal. You learn to think, feel, and react like Jesus. This is the ultimate weapon because it transforms you into His image.",
    purpose: "To replace your natural thought patterns, emotions, and reactions with Christ's own mind.",
    keyScripture: "1 Corinthians 2:16 - We have the mind of Christ",
    combatApplication: "In every situation, ask: 'What would Jesus think? How would He feel? What would He do?' Then adopt His mind.",
    drills: [
      {
        id: "thought-imitation",
        name: "Thought Imitation Training",
        description: "Practice thinking Christ's thoughts in real scenarios",
        steps: [
          "Recall a recent situation where you thought wrongly",
          "Study how Jesus thought in a similar scenario from the Gospels",
          "Rewrite your thoughts using His perspective",
          "Memorize His way of thinking",
          "Apply it in the next 24 hours"
        ],
        scripture: [
          "Philippians 2:5 - Let this mind be in you, which was also in Christ Jesus",
          "Romans 12:2 - Be transformed by the renewing of your mind",
          "Colossians 3:2 - Set your affection on things above, not on things on the earth"
        ]
      },
      {
        id: "feeling-imitation",
        name: "Feeling Imitation Training",
        description: "Learn to feel what Jesus feels in each situation",
        steps: [
          "Identify a situation where your emotions were sinful",
          "Study Jesus' emotional responses in Scripture",
          "Ask: What did He feel? Why? What governed His emotions?",
          "Practice holy indignation at sin, compassion for souls, grief over unbelief",
          "Let His emotions replace yours"
        ],
        scripture: [
          "John 11:35 - Jesus wept (appropriate grief)",
          "Mark 3:5 - He looked round about on them with anger (righteous anger)",
          "Matthew 9:36 - He was moved with compassion (holy compassion)"
        ]
      },
      {
        id: "reaction-imitation",
        name: "Reaction Imitation Training",
        description: "Mirror Christ's reactions to temptation, accusation, and warfare",
        steps: [
          "Choose a recent situation where you reacted poorly",
          "Find a parallel situation in Christ's life",
          "Study how He responded",
          "Practice His response in imagination",
          "Commit to react like Him next time"
        ],
        scripture: [
          "1 Peter 2:21-23 - Christ suffered for us, leaving us an example",
          "Luke 23:34 - Father, forgive them",
          "Matthew 26:39 - Not my will, but thine"
        ]
      },
      {
        id: "gospel-scenario-training",
        name: "Gospel Scenario Training",
        description: "Immerse yourself in Gospel scenes to absorb Christ's mindset",
        steps: [
          "Read a Gospel chapter slowly",
          "Put yourself in the scene as an observer",
          "Watch how Jesus thinks, speaks, acts, reacts",
          "Notice what He prioritizes, what He ignores, what He emphasizes",
          "Ask the Spirit to burn this pattern into your mind"
        ],
        scripture: [
          "Luke 6:12 - He continued all night in prayer to God",
          "Mark 1:35 - In the morning, rising up a great while before day, he went out and prayed",
          "John 5:19 - The Son can do nothing of himself, but what he seeth the Father do"
        ]
      }
    ]
  },
  {
    id: "sword-of-word",
    name: "The Sword of the Word",
    category: "offense",
    description: "The Bible is the primary offensive weapon. It divides soul from spirit, exposes motives, and pierces through all deception.",
    purpose: "To attack temptation with precision Scripture, dissect your own heart, and destroy strongholds.",
    keyScripture: "Hebrews 4:12 - The word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit",
    combatApplication: "Use specific verses like surgical strikes against specific sins. Let the Word expose your true motives and judge your thoughts.",
    drills: [
      {
        id: "intention-dissection",
        name: "Intention Dissection",
        description: "Use Scripture to dissect your own motives and intentions",
        steps: [
          "Bring a recent action or decision to God",
          "Ask: What was my true motive?",
          "Read Hebrews 4:12-13, Jeremiah 17:9-10",
          "Let the Word expose hidden agendas, pride, fear, or selfishness",
          "Confess what the Sword reveals"
        ],
        scripture: [
          "Psalm 139:23-24 - Search me, O God, and know my heart",
          "Proverbs 21:2 - Every way of a man is right in his own eyes: but the LORD pondereth the hearts",
          "1 Chronicles 28:9 - The LORD searcheth all hearts, and understandeth all the imaginations of the thoughts"
        ]
      },
      {
        id: "temptation-stabbing",
        name: "Temptation Stabbing",
        description: "Strike temptation with precision verses",
        steps: [
          "Identify the specific temptation",
          "Find 3 verses that directly counter it",
          "Memorize them",
          "When tempted, strike verbally: 'It is written...'",
          "Repeat until the temptation retreats"
        ],
        scripture: [
          "Matthew 4:4 - It is written, Man shall not live by bread alone",
          "Matthew 4:7 - It is written again, Thou shalt not tempt the Lord thy God",
          "Matthew 4:10 - Get thee hence, Satan: for it is written..."
        ]
      },
      {
        id: "precision-verse-strikes",
        name: "Precision Verse Strikes",
        description: "Build a personal arsenal of verses for your specific battles",
        steps: [
          "List your top 5 recurring temptations",
          "Find 2-3 verses that directly address each one",
          "Write them on cards or in your phone",
          "Drill them daily until automatic",
          "Deploy them instantly when attacked"
        ],
        scripture: [
          "Psalm 119:9, 11 - Wherewithal shall a young man cleanse his way? Thy word have I hid in mine heart",
          "Ephesians 6:17 - Take the sword of the Spirit, which is the word of God",
          "Revelation 12:11 - They overcame him by the blood of the Lamb and by the word of their testimony"
        ]
      }
    ]
  },
  {
    id: "gospel-boots",
    name: "Gospel Boots of Peace",
    category: "stability",
    description: "These boots keep you standing firm and calm in the storm. They represent the peace that comes from the Gospel - you are justified, accepted, and secure in Christ.",
    purpose: "To maintain inner peace, stability, and calm under enemy fire.",
    keyScripture: "Ephesians 6:15 - Your feet shod with the preparation of the gospel of peace",
    combatApplication: "When anxiety, panic, or chaos strikes, the Gospel Boots keep you grounded. You stand on the finished work of Christ.",
    drills: [
      {
        id: "storm-walking",
        name: "Storm-Walking Drill",
        description: "Practice maintaining peace while everything around you is chaotic",
        steps: [
          "Recall or imagine a chaotic situation",
          "Breathe slowly and deeply",
          "Declare: 'I am justified. I am accepted. I am secure in Christ.'",
          "Visualize yourself walking calmly through the storm",
          "Root your peace in the Gospel, not circumstances"
        ],
        scripture: [
          "Philippians 4:6-7 - Be careful for nothing, but in everything by prayer...the peace of God shall keep your hearts",
          "John 14:27 - Peace I leave with you, my peace I give unto you",
          "Isaiah 26:3 - Thou wilt keep him in perfect peace, whose mind is stayed on thee"
        ]
      },
      {
        id: "fire-walking",
        name: "Fire-Walking",
        description: "Walk through trials with unshakable calm",
        steps: [
          "Identify a current trial or pressure",
          "Remind yourself: This trial does not change my standing with God",
          "Put on the boots: 'I am justified by faith. Nothing can separate me from His love.'",
          "Walk forward without panic or haste",
          "Rest in the Gospel's certainty"
        ],
        scripture: [
          "Romans 5:1 - Being justified by faith, we have peace with God",
          "Romans 8:38-39 - Nothing can separate us from the love of God",
          "Isaiah 43:2 - When thou walkest through the fire, thou shalt not be burned"
        ]
      },
      {
        id: "peace-shield",
        name: "Peace Shield Simulation",
        description: "Use Gospel peace as a force field against anxiety",
        steps: [
          "When anxiety rises, stop immediately",
          "Pray: 'Father, I am Your child. I am justified. I am safe.'",
          "Quote Romans 8:1 - 'There is therefore now no condemnation'",
          "Let peace flood your soul",
          "Refuse to let anxiety dictate your actions"
        ],
        scripture: [
          "Colossians 3:15 - Let the peace of God rule in your hearts",
          "2 Thessalonians 3:16 - The Lord of peace himself give you peace always",
          "Psalm 4:8 - I will both lay me down in peace, and sleep"
        ]
      }
    ]
  },
  {
    id: "wings-of-faith",
    name: "Wings of Faith",
    category: "elevation",
    description: "These wings lift you above temptation. When you can't outrun it, you fly over it. Faith elevates your perspective.",
    purpose: "To rise above earthly temptations and gain a heavenly perspective.",
    keyScripture: "Isaiah 40:31 - They that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles",
    combatApplication: "When trapped or surrounded by temptation, use faith to gain altitude and escape the ground-level battle.",
    drills: [
      {
        id: "lift-off-practice",
        name: "Lift-Off Practice",
        description: "Train your faith to lift you above temptation",
        steps: [
          "Close your eyes during temptation",
          "Visualize yourself with eagle wings",
          "Pray: 'Lord, lift me above this. I trust You to elevate me.'",
          "Imagine rising above the situation",
          "Look down at the temptation from above - see how small it is"
        ],
        scripture: [
          "Colossians 3:1-2 - Set your affection on things above",
          "Psalm 91:1 - He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty",
          "Ephesians 2:6 - Made us sit together in heavenly places in Christ Jesus"
        ]
      },
      {
        id: "altitude-maintenance",
        name: "Altitude Maintenance",
        description: "Stay in the heavenly mindset throughout the day",
        steps: [
          "Begin each day with worship and Scripture",
          "Set reminders to 'check altitude' - are you thinking earthly or heavenly?",
          "When you drift down, refocus on eternal realities",
          "Practice seeing everything from God's perspective",
          "End the day with thanksgiving for the high view"
        ],
        scripture: [
          "Philippians 3:20 - Our conversation is in heaven",
          "Matthew 6:19-21 - Lay up treasures in heaven",
          "2 Corinthians 4:18 - We look not at the things which are seen, but at the things which are not seen"
        ]
      },
      {
        id: "high-flight-endurance",
        name: "High-Flight Endurance",
        description: "Build stamina to stay elevated for extended periods",
        steps: [
          "Commit to a week of intentional 'high living'",
          "Fast from earthly entertainment and focus",
          "Spend extra time in prayer, worship, and Scripture",
          "Journal the difference in your thought life",
          "Make elevation a lifestyle, not an emergency escape"
        ],
        scripture: [
          "Galatians 2:20 - I am crucified with Christ...I live by the faith of the Son of God",
          "Romans 8:5-6 - They that are after the Spirit do mind the things of the Spirit",
          "1 John 2:15-16 - Love not the world, neither the things that are in the world"
        ]
      }
    ]
  },
  {
    id: "stones-of-fire",
    name: "Stones of Fire",
    category: "counterattack",
    description: "These are supernatural counterattacks - returning good for evil, kindness for cruelty. They confuse and defeat the enemy.",
    purpose: "To weaponize love, kindness, and blessing as offensive strikes against evil.",
    keyScripture: "Romans 12:20-21 - If thine enemy hunger, feed him...for in so doing thou shalt heap coals of fire on his head",
    combatApplication: "When attacked, insulted, or mistreated, respond with supernatural kindness. This disarms the enemy and conquers evil with good.",
    drills: [
      {
        id: "heat-inversion",
        name: "Heat Inversion",
        description: "Transform your anger into love-powered counterattacks",
        steps: [
          "When someone wrongs you, feel the heat rising",
          "Instead of exploding, invert it: 'I will bless, not curse'",
          "Do something kind for that person",
          "Pray for them specifically",
          "Watch the enemy's confusion"
        ],
        scripture: [
          "Matthew 5:44 - Love your enemies, bless them that curse you",
          "Luke 6:27-28 - Do good to them which hate you",
          "1 Peter 3:9 - Not rendering evil for evil...but contrariwise blessing"
        ]
      },
      {
        id: "kindness-strike",
        name: "Kindness Strike",
        description: "Use intentional kindness as a weapon",
        steps: [
          "Identify someone who has wronged you",
          "Plan a specific act of kindness toward them",
          "Execute it without announcing your motive",
          "Let the Holy Spirit use it to convict or heal",
          "Repeat as needed"
        ],
        scripture: [
          "Proverbs 25:21-22 - If thine enemy be hungry, give him bread to eat",
          "Romans 12:21 - Overcome evil with good",
          "1 Thessalonians 5:15 - Ever follow that which is good, both among yourselves and to all men"
        ]
      },
      {
        id: "love-under-attack",
        name: "Love Under Attack",
        description: "Maintain love as a defensive posture during spiritual assault",
        steps: [
          "When attacked or criticized, refuse to retaliate",
          "Ask God for supernatural love for your attacker",
          "Respond with gentleness and truth",
          "Refuse to let their evil infect you",
          "Let love be your shield and sword"
        ],
        scripture: [
          "1 Corinthians 13:4-7 - Love suffereth long and is kind",
          "Colossians 3:13-14 - Forbearing one another...put on love",
          "1 Peter 4:8 - Above all things have fervent love among yourselves"
        ]
      }
    ]
  },
  {
    id: "sonic-capabilities",
    name: "Sonic Capabilities",
    category: "offense",
    description: "Your voice is a weapon. Spoken prayer, declared Scripture, and audible praise create sonic blasts that demolish strongholds.",
    purpose: "To use your voice as a supernatural weapon in warfare.",
    keyScripture: "Joshua 6:20 - The people shouted with a great shout...and the wall fell down flat",
    combatApplication: "Speak the Word aloud. Pray aloud. Praise aloud. Your voice carries power when filled with Scripture and Spirit.",
    drills: [
      {
        id: "sonic-blast-prayer",
        name: "Sonic Blast Prayer",
        description: "Pray with volume, authority, and intensity",
        steps: [
          "Find a private place where you can pray loudly",
          "Identify a stronghold (fear, lust, pride, etc.)",
          "Pray against it with authority and volume",
          "Declare Scripture over it repeatedly",
          "Keep praying until you feel breakthrough"
        ],
        scripture: [
          "Psalm 150:1-6 - Praise him with the sound of the trumpet...let everything that hath breath praise the LORD",
          "Ephesians 6:18 - Praying always with all prayer and supplication in the Spirit",
          "James 5:16 - The effectual fervent prayer of a righteous man availeth much"
        ]
      },
      {
        id: "vibrational-scripture",
        name: "Vibrational Scripture Declaration",
        description: "Speak Scripture with force and frequency",
        steps: [
          "Choose a warfare Scripture (Psalm 91, Ephesians 6, Isaiah 54, etc.)",
          "Read it aloud with conviction",
          "Emphasize key phrases",
          "Repeat it multiple times, increasing intensity",
          "Let the vibration of the Word shake the atmosphere"
        ],
        scripture: [
          "Jeremiah 23:29 - Is not my word like as a fire...and like a hammer that breaketh the rock in pieces?",
          "Isaiah 55:11 - My word shall not return unto me void",
          "Hebrews 4:12 - The word of God is living and powerful"
        ]
      }
    ]
  },
  {
    id: "invisibility-cloak",
    name: "Cloak of Invisibility",
    category: "concealment",
    description: "This weapon hides your new man from Satan's attacks. You conceal your spiritual growth so the enemy can't target it.",
    purpose: "To protect your spiritual progress by hiding it from the enemy and your own pride.",
    keyScripture: "Colossians 3:3 - Your life is hid with Christ in God",
    combatApplication: "Don't advertise your victories. Don't parade your growth. Stay hidden in Christ so Satan can't counterattack.",
    drills: [
      {
        id: "ego-dissolution",
        name: "Ego Dissolution",
        description: "Practice anonymity and humility to stay hidden",
        steps: [
          "Do something good without telling anyone",
          "Resist the urge to share your spiritual victories on social media",
          "When complimented, deflect to Christ",
          "Pray in secret more than in public",
          "Let your growth be between you and God"
        ],
        scripture: [
          "Matthew 6:3-4 - When thou doest alms, let not thy left hand know what thy right hand doeth",
          "Matthew 6:6 - When thou prayest, enter into thy closet",
          "Proverbs 25:27 - It is not glory to search their own glory"
        ]
      },
      {
        id: "self-erasure",
        name: "Self-Erasure Meditation",
        description: "Practice decreasing so Christ may increase",
        steps: [
          "Meditate on John 3:30 - He must increase, but I must decrease",
          "Ask God to hide you deeper in Christ",
          "Confess any pride or self-promotion",
          "Commit to a week of secret service",
          "Let Christ alone be visible"
        ],
        scripture: [
          "Galatians 2:20 - I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me",
          "John 12:24 - Except a corn of wheat fall into the ground and die, it abideth alone",
          "Philippians 2:3 - Let nothing be done through strife or vainglory"
        ]
      }
    ]
  }
];
