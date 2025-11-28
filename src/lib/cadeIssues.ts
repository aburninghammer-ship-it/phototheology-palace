// CADE - Context-Aware Devotional Engine
// Primary issues and their associated guidance

export const CADE_ISSUES = [
  { value: "racism", label: "Racism / Racial Tension", emoji: "✊", category: "injustice" },
  { value: "addiction", label: "Addiction", emoji: "⛓️", category: "struggle" },
  { value: "grief", label: "Grief", emoji: "💔", category: "loss" },
  { value: "divorce", label: "Divorce Recovery", emoji: "💍", category: "loss" },
  { value: "betrayal", label: "Betrayal", emoji: "🗡️", category: "trust" },
  { value: "identity", label: "Identity Crisis", emoji: "🪞", category: "self" },
  { value: "depression", label: "Depression", emoji: "🌧️", category: "mental" },
  { value: "trauma", label: "Trauma", emoji: "🩹", category: "healing" },
  { value: "spiritual_warfare", label: "Spiritual Warfare", emoji: "⚔️", category: "spiritual" },
  { value: "fear", label: "Fear / Anxiety", emoji: "😰", category: "mental" },
  { value: "loneliness", label: "Loneliness", emoji: "🏝️", category: "connection" },
  { value: "immigration", label: "Immigration Stress", emoji: "🌍", category: "identity" },
  { value: "church_hurt", label: "Church Hurt", emoji: "⛪", category: "trust" },
  { value: "abuse_recovery", label: "Abuse Recovery", emoji: "🦋", category: "healing" },
  { value: "doubt", label: "Doubt / Unbelief", emoji: "❓", category: "spiritual" },
  { value: "purity", label: "Sexual Purity", emoji: "🕊️", category: "struggle" },
  { value: "family_conflict", label: "Family Conflict", emoji: "🏠", category: "relationships" },
  { value: "prodigal", label: "Parenting a Prodigal", emoji: "🚪", category: "parenting" },
  { value: "career", label: "Career Insecurity", emoji: "💼", category: "provision" },
  { value: "aging", label: "Aging / Health Decline", emoji: "🕰️", category: "health" },
  { value: "poverty", label: "Poverty / Financial Strain", emoji: "💰", category: "provision" },
  { value: "injustice", label: "Injustice / Systemic Oppression", emoji: "⚖️", category: "injustice" },
  { value: "self_worth", label: "Self-Worth", emoji: "💎", category: "self" },
  { value: "anger", label: "Anger Management", emoji: "🔥", category: "emotions" },
  { value: "forgiveness", label: "Unforgiveness", emoji: "🤝", category: "healing" },
];

export const ISSUE_SEVERITY = [
  { value: "mild", label: "Mild", description: "Manageable day-to-day" },
  { value: "moderate", label: "Moderate", description: "Significantly affecting life" },
  { value: "severe", label: "Severe", description: "Deeply impacting functioning" },
  { value: "crisis", label: "Crisis", description: "Urgent need for support" },
];

export const ISSUE_CATEGORIES = {
  injustice: { label: "Justice & Equity", color: "orange" },
  struggle: { label: "Battles & Struggles", color: "red" },
  loss: { label: "Loss & Grief", color: "blue" },
  trust: { label: "Trust & Betrayal", color: "purple" },
  self: { label: "Identity & Self-Worth", color: "pink" },
  mental: { label: "Mental Health", color: "teal" },
  healing: { label: "Healing & Recovery", color: "green" },
  spiritual: { label: "Spiritual Life", color: "indigo" },
  connection: { label: "Connection & Belonging", color: "cyan" },
  relationships: { label: "Relationships", color: "rose" },
  parenting: { label: "Parenting", color: "amber" },
  provision: { label: "Provision & Security", color: "emerald" },
  health: { label: "Health & Aging", color: "slate" },
  emotions: { label: "Emotional Regulation", color: "yellow" },
};

// Sanctuary stations mapped to healing patterns
export const SANCTUARY_HEALING_MAP = {
  racism: {
    altar: "Laying down the anger at the foot of the cross",
    laver: "Cleansing of shame and internalized oppression",
    candlestick: "Spirit's courage to stand with dignity",
    table: "Identity rooted in the Word of God",
    incense: "Praying for oppressors and self",
    ark: "God's justice and eternal law"
  },
  grief: {
    altar: "Surrendering the loss to Christ",
    laver: "Tears that cleanse the soul",
    candlestick: "Light in the valley of shadow",
    table: "Bread of comfort from Scripture",
    incense: "Prayers of lament rising to God",
    ark: "Promise of resurrection and reunion"
  },
  addiction: {
    altar: "Daily surrender of the struggle",
    laver: "Cleansing from guilt and shame",
    candlestick: "Spirit's power for sobriety",
    table: "Nourishment replacing the counterfeit",
    incense: "Intercessory support network",
    ark: "God's law as protection, not condemnation"
  },
  // Generic fallback for other issues
  default: {
    altar: "Bringing the burden to Christ",
    laver: "Cleansing and renewal",
    candlestick: "Holy Spirit illumination",
    table: "Feeding on God's Word",
    incense: "Prayer and intercession",
    ark: "God's presence and promises"
  }
};

// Historical and statistical anchors by issue
export const ISSUE_CONTEXT_ANCHORS = {
  racism: {
    historical: [
      "Frederick Douglass found in Scripture the moral power to fight for freedom.",
      "Harriet Tubman prayed, 'Lord, I'm going to hold steady on to you and you've got to see me through.'",
      "Sojourner Truth declared, 'Ain't I a woman?' standing on the truth that all are made in God's image.",
      "The early Adventist church was one of few integrated denominations in 19th century America."
    ],
    biblical: [
      "Joseph experienced discrimination in Egypt, Daniel in Babylon, Esther in Persia.",
      "Jesus Himself endured ethnic hostility as a Galilean: 'Can any good thing come out of Nazareth?' (John 1:46)",
      "In Christ there is neither Jew nor Greek (Galatians 3:28)."
    ]
  },
  grief: {
    historical: [
      "C.S. Lewis wrote 'A Grief Observed' after losing his wife, finding God meets us in the darkness.",
      "Ellen White lost multiple children and her husband, yet wrote, 'We sorrow, but not as those without hope.'"
    ],
    biblical: [
      "Jesus wept at Lazarus' tomb (John 11:35), showing grief is not sinful.",
      "David's psalms of lament give voice to our deepest sorrow.",
      "Rachel weeping for her children (Jeremiah 31:15) – God sees maternal grief."
    ]
  },
  default: {
    historical: ["Throughout church history, believers have faced similar trials and found God faithful."],
    biblical: ["Scripture repeatedly shows God's presence in human struggle."]
  }
};
