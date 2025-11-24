export interface RankRequirement {
  id: string;
  description: string;
  category: "surrender" | "weapons" | "creatures" | "fruit" | "warfare" | "endurance";
}

export interface DojoRank {
  id: string;
  name: string;
  level: number;
  description: string;
  requirements: RankRequirement[];
  badge: string;
  title: string;
}

export const DOJO_RANKS: DojoRank[] = [
  {
    id: "observer",
    name: "Observer",
    level: 1,
    description: "You are observing the battlefield from a distance. You see spiritual warfare but haven't yet engaged. You're learning the vocabulary and beginning to recognize the enemy.",
    badge: "👁️",
    title: "Observer of the War",
    requirements: [
      {
        id: "recognize-enemy",
        description: "Recognize that the enemy is SELF, not other people",
        category: "warfare"
      },
      {
        id: "understand-battle",
        description: "Understand that the war is minute-by-minute",
        category: "warfare"
      },
      {
        id: "see-weapons",
        description: "Identify at least 3 spiritual weapons from Scripture",
        category: "weapons"
      }
    ]
  },
  {
    id: "recruit",
    name: "Recruit",
    level: 2,
    description: "You have enlisted in the holy war. You've entered the Surrender Room and begun basic training. You're learning to die daily and recognize self's tactics.",
    badge: "🛡️",
    title: "Enlisted Recruit",
    requirements: [
      {
        id: "daily-surrender",
        description: "Complete the Daily White-Flag Ritual for 7 consecutive days",
        category: "surrender"
      },
      {
        id: "identify-self",
        description: "Successfully identify and confess one area where SELF is active",
        category: "warfare"
      },
      {
        id: "weapon-basic",
        description: "Complete basic training with 2 weapons (must include Sword of the Word)",
        category: "weapons"
      },
      {
        id: "fruit-awareness",
        description: "Identify which fruit of the Spirit you lack most often",
        category: "fruit"
      }
    ]
  },
  {
    id: "footsoldier",
    name: "Footsoldier",
    level: 3,
    description: "You are on the battlefield, engaging in active daily warfare. You've tasted both victory and defeat. You're learning weapon combinations and beginning to identify eponyms.",
    badge: "⚔️",
    title: "Footsoldier of Christ",
    requirements: [
      {
        id: "consistent-practice",
        description: "Maintain daily surrender ritual for 30 consecutive days",
        category: "surrender"
      },
      {
        id: "weapon-proficiency",
        description: "Demonstrate proficiency with 4 weapons through drills",
        category: "weapons"
      },
      {
        id: "eponym-identification",
        description: "Identify 2 active eponyms in your life (Goliath, Judas, Peter, Jacob, or Pharaoh)",
        category: "warfare"
      },
      {
        id: "creature-style-basic",
        description: "Learn and practice 1 creature style",
        category: "creatures"
      },
      {
        id: "fruit-combination",
        description: "Successfully deploy a fruit combination to overcome a specific temptation",
        category: "fruit"
      }
    ]
  },
  {
    id: "specialist",
    name: "Specialist",
    level: 4,
    description: "You have specialized skills in spiritual combat. You've mastered multiple weapons and styles. You can identify eponyms quickly and deploy appropriate counterstrategies.",
    badge: "🎯",
    title: "Combat Specialist",
    requirements: [
      {
        id: "weapon-mastery",
        description: "Master 6 weapons with advanced drill completion",
        category: "weapons"
      },
      {
        id: "creature-styles-trained",
        description: "Demonstrate competence in all 4 creature styles",
        category: "creatures"
      },
      {
        id: "eponym-victory",
        description: "Achieve victory over 2 identified eponyms",
        category: "warfare"
      },
      {
        id: "fruit-advanced",
        description: "Deploy complex fruit combinations (3+ fruits) successfully",
        category: "fruit"
      },
      {
        id: "mentor-junior",
        description: "Help a recruit or footsoldier with their training",
        category: "warfare"
      }
    ]
  },
  {
    id: "elite-fighter",
    name: "Elite Fighter",
    level: 5,
    description: "You are an elite warrior. You fight with precision, wisdom, and power. You know the Mind of Christ and can wield all weapons. You're becoming known in hell as a dangerous soldier.",
    badge: "⚡",
    title: "Elite Fighter of the Faith",
    requirements: [
      {
        id: "full-weapon-arsenal",
        description: "Master all 12 primary weapons",
        category: "weapons"
      },
      {
        id: "style-mastery",
        description: "Master all 4 creature styles and know when to use each",
        category: "creatures"
      },
      {
        id: "mind-of-christ",
        description: "Demonstrate consistent practice of the Mind of Christ weapon",
        category: "weapons"
      },
      {
        id: "minute-warrior",
        description: "Maintain minute-by-minute awareness for an entire week",
        category: "warfare"
      },
      {
        id: "eponym-freedom",
        description: "Experience sustained freedom from 3 major eponyms",
        category: "warfare"
      },
      {
        id: "endurance-trial",
        description: "Endure a major trial without compromising or retreating",
        category: "endurance"
      }
    ]
  },
  {
    id: "mighty-warrior",
    name: "Mighty Warrior",
    level: 6,
    description: "You are a Mighty Man or Woman of God. Like David's mighty men, you have proven yourself in impossible battles. You rescue others, you take territory, you stand when others flee.",
    badge: "👑",
    title: "Mighty Warrior of the Most High",
    requirements: [
      {
        id: "sustained-victory",
        description: "Maintain 90 consecutive days of daily surrender and warfare victory",
        category: "endurance"
      },
      {
        id: "rescue-mission",
        description: "Lead others to freedom from specific sins or bondages",
        category: "warfare"
      },
      {
        id: "stronghold-demolition",
        description: "Completely demolish a major personal stronghold",
        category: "warfare"
      },
      {
        id: "myrrh-power-proven",
        description: "Demonstrate Myrrh-Power: endure suffering without retreat",
        category: "weapons"
      },
      {
        id: "war-council-leader",
        description: "Successfully plan and execute strategic spiritual campaigns",
        category: "warfare"
      }
    ]
  },
  {
    id: "lion-faced",
    name: "Lion-Faced Champion",
    level: 7,
    description: "You are a Lion-Faced Champion - the highest rank. Like Benaiah who killed a lion in a pit on a snowy day, you face impossible odds and win. You are faithful unto death. Hell fears you. Heaven celebrates you. Christ is glorified in you.",
    badge: "🦁",
    title: "Lion-Faced Champion of the King",
    requirements: [
      {
        id: "impossible-victory",
        description: "Overcome an 'impossible' stronghold or situation through faith",
        category: "warfare"
      },
      {
        id: "faithful-unto-death",
        description: "Demonstrate willingness to die rather than compromise",
        category: "endurance"
      },
      {
        id: "perfect-combination",
        description: "Consistently deploy all 9 fruits in combination like Christ",
        category: "fruit"
      },
      {
        id: "spiritual-father-mother",
        description: "Raise up multiple warriors through mentorship",
        category: "warfare"
      },
      {
        id: "christ-likeness",
        description: "Display consistent Christ-likeness in thought, emotion, and action",
        category: "fruit"
      },
      {
        id: "legacy-of-freedom",
        description: "Leave a legacy of liberated believers and demolished strongholds",
        category: "warfare"
      }
    ]
  }
];
