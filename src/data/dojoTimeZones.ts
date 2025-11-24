export interface TimeZone {
  id: string;
  name: string;
  level: number;
  description: string;
  frequency: string;
  strengths: string[];
  weaknesses: string[];
  howToAdvance: string;
  scripture: string[];
}

export const TIME_ZONES: TimeZone[] = [
  {
    id: "yearly",
    name: "Yearly Warrior",
    level: 1,
    description: "You think about spiritual warfare once or twice a year - maybe at New Year's or a revival. You make annual resolutions but lack daily discipline. This is the lowest and most ineffective level of warfare.",
    frequency: "Once or twice per year",
    strengths: [
      "At least you're aware warfare exists",
      "You have moments of spiritual ambition"
    ],
    weaknesses: [
      "Self rules 99% of the time",
      "No sustained victory",
      "Easily defeated by recurring sin",
      "Live in constant defeat between resolutions",
      "No real transformation occurs"
    ],
    howToAdvance: "Begin engaging in weekly warfare. Set a specific weekly time for spiritual inventory and prayer.",
    scripture: [
      "Luke 9:23 - Take up his cross DAILY (not yearly)",
      "1 Corinthians 15:31 - I die DAILY",
      "Lamentations 3:22-23 - His mercies are new EVERY MORNING"
    ]
  },
  {
    id: "monthly",
    name: "Monthly Warrior",
    level: 2,
    description: "You fight once or twice a month - perhaps at church services or monthly accountability meetings. Better than yearly, but still allows weeks of unchecked sin between battles.",
    frequency: "Once or twice per month",
    strengths: [
      "More consistent than yearly",
      "Some accountability structure",
      "Periodic spiritual check-ins"
    ],
    weaknesses: [
      "Three weeks of unguarded living between battles",
      "Self rebuilds quickly in the gaps",
      "Victory doesn't compound",
      "Still mostly reactive rather than proactive",
      "Easy for sin to entrench between sessions"
    ],
    howToAdvance: "Move to weekly spiritual disciplines. Set aside one day per week for intensive warfare and self-examination.",
    scripture: [
      "Psalm 95:7-8 - Today if ye will hear his voice, harden not your heart",
      "Hebrews 3:13 - Exhort one another DAILY",
      "Acts 17:11 - They searched the scriptures DAILY"
    ]
  },
  {
    id: "weekly",
    name: "Weekly Warrior",
    level: 3,
    description: "You engage in warfare once a week - perhaps on Sunday or a designated discipline day. This is respectable and many believers stop here, but six days of unchecked self between battles is still too long.",
    frequency: "Once per week",
    strengths: [
      "Regular spiritual rhythm established",
      "Consistent accountability",
      "Can maintain basic spiritual health",
      "Above average among believers"
    ],
    weaknesses: [
      "Six days of vulnerability",
      "Self has room to rebuild",
      "Sins cycle throughout the week",
      "Hard to maintain victory momentum",
      "Not enough to achieve full transformation"
    ],
    howToAdvance: "Move to daily warfare. Begin each morning with the White-Flag Surrender Ritual and evening self-examination.",
    scripture: [
      "Psalm 5:3 - My voice shalt thou hear in the MORNING",
      "Matthew 6:11 - Give us this day our DAILY bread",
      "Deuteronomy 6:7 - Thou shalt talk of them when thou sittest in thine house, and when thou walkest by the way, and when thou liest down, and when thou risest up"
    ]
  },
  {
    id: "daily",
    name: "Daily Warrior",
    level: 4,
    description: "You engage in warfare every day - morning surrender, Scripture, prayer, evening examination. This is where serious transformation begins. You're ahead of most believers. But even one day still allows self too much breathing room.",
    frequency: "Multiple times per day",
    strengths: [
      "Consistent spiritual discipline",
      "Real transformation occurs",
      "Self has limited room to operate",
      "Strong spiritual momentum",
      "Biblical model of devotion"
    ],
    weaknesses: [
      "Still gaps throughout the day where self rises",
      "Morning surrender can wear off by afternoon",
      "Evening examination can't prevent daily failures",
      "Not yet the pinnacle of warfare"
    ],
    howToAdvance: "Move to minute-by-minute awareness. Set hourly reminders. Practice real-time surrender and fruit deployment throughout the day.",
    scripture: [
      "1 Corinthians 15:31 - I die DAILY",
      "Luke 9:23 - Let him deny himself, and take up his cross DAILY, and follow me",
      "Psalm 119:164 - Seven times a day do I praise thee"
    ]
  },
  {
    id: "minute",
    name: "Minute Warrior",
    level: 5,
    description: "You fight minute-by-minute, throughout the entire day. You maintain real-time awareness of self, temptation, and the need for Spirit-empowerment. This is the highest and most effective level of warfare. This is the goal. This is Christlikeness.",
    frequency: "Minute-by-minute, all day",
    strengths: [
      "Maximum spiritual effectiveness",
      "Self cannot gain foothold",
      "Temptations defeated immediately",
      "Continuous communion with God",
      "Christlike transformation accelerates",
      "Walking in the Spirit becomes natural"
    ],
    weaknesses: [
      "Requires intense focus and discipline",
      "Can be exhausting at first",
      "Easy to drift back to daily without vigilance"
    ],
    howToAdvance: "This is the peak. Now maintain it for life. Train others to reach this level.",
    scripture: [
      "1 Thessalonians 5:17 - Pray without ceasing",
      "Ephesians 6:18 - Praying always with all prayer and supplication",
      "Colossians 3:2 - Set your affection on things above, not on things on the earth",
      "Proverbs 4:23 - Keep thy heart with all diligence; for out of it are the issues of life",
      "2 Corinthians 10:5 - Bringing into captivity EVERY THOUGHT to the obedience of Christ"
    ]
  }
];
