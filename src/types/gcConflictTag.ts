// Great Controversy Conflict Tag System
// Signature feature: Tags each paragraph with the cosmic conflict dynamics at play

export type BattlefieldType =
  | "Mind" // Individual thought/conviction
  | "Church" // Institutional Christianity
  | "State" // Political/governmental power
  | "Doctrine" // Theological truth vs error
  | "Worship" // True vs false worship
  | "Scripture" // Biblical authority
  | "Conscience" // Individual freedom vs coercion
  | "Prophecy" // Understanding of prophetic truth
  | "Law" // God's moral law
  | "Sanctuary"; // Christ's heavenly ministry

export type DeceptionType =
  | "Counterfeit Authority" // False spiritual leadership
  | "Gradual Compromise" // Slow drift from truth
  | "Force & Coercion" // Using state power
  | "Tradition Over Scripture" // Human tradition superseding Bible
  | "Spiritualism" // Supernatural deception
  | "False Security" // "Peace and safety" when destruction near
  | "Confusion & Division" // Sowing discord among believers
  | "Prosperity Gospel" // Worldly success as spirituality
  | "Antinomianism" // Law abolished, grace as license
  | "Legalism" // Salvation by works
  | "Time Manipulation" // Prophetic timeline confusion
  | "Identity Theft"; // Claiming God's people's identity

export type OutcomeType =
  | "Light Preserved" // Truth maintained despite opposition
  | "Light Suppressed" // Truth obscured/lost for a time
  | "Remnant Emerges" // Faithful few stand
  | "Apostasy Deepens" // Church drifts further from truth
  | "Persecution Intensifies" // Physical/social suffering increases
  | "Reform Begins" // Movement back toward truth
  | "Deception Exposed" // False system revealed
  | "Crisis Point" // Decisive moment requiring choice
  | "Victory Secured" // God's truth triumphs
  | "Judgment Pronounced"; // Divine verdict rendered

export interface GCConflictTag {
  // Primary axis of the conflict
  axis: "Truth vs Error" | "Freedom vs Tyranny" | "Light vs Darkness" | "Christ vs Satan" | "Heaven vs Hell";

  // Where the battle is being fought
  battlefield: BattlefieldType[];

  // Satan's strategy in this paragraph
  satanStrategy: string;

  // God's counter-strategy
  godCounterStrategy: string;

  // Type of deception employed
  deceptionType?: DeceptionType[];

  // Outcome/result of this phase
  outcome: OutcomeType[];

  // Prophetic significance (1-10)
  propheticWeight: number;

  // Historical period (if applicable)
  historicalPeriod?: string;

  // Connection to prophecy (Daniel/Revelation)
  prophecyConnection?: string;

  // Modern parallel/application
  modernParallel?: string;

  // Defense Mode relevance (which AI opponent would attack this)
  defenseRelevance?: {
    opponent: string; // e.g., "atheist", "catholic", "evangelical"
    attackVector: string;
    defenseWeapon: string;
  }[];
}

export interface GCConflictTagDisplay {
  tag: GCConflictTag;
  showFull: boolean; // Toggle between compact and expanded view
}

// Helper function to get battlefield color
export function getBattlefieldColor(battlefield: BattlefieldType): string {
  const colors: Record<BattlefieldType, string> = {
    Mind: "purple-500",
    Church: "blue-500",
    State: "red-500",
    Doctrine: "amber-500",
    Worship: "pink-500",
    Scripture: "green-500",
    Conscience: "cyan-500",
    Prophecy: "violet-500",
    Law: "orange-500",
    Sanctuary: "yellow-500",
  };
  return colors[battlefield] || "gray-500";
}

// Helper function to get outcome icon
export function getOutcomeIcon(outcome: OutcomeType): string {
  const icons: Record<OutcomeType, string> = {
    "Light Preserved": "🕯️",
    "Light Suppressed": "🌑",
    "Remnant Emerges": "⭐",
    "Apostasy Deepens": "⬇️",
    "Persecution Intensifies": "⚔️",
    "Reform Begins": "🌅",
    "Deception Exposed": "🔍",
    "Crisis Point": "⚡",
    "Victory Secured": "👑",
    "Judgment Pronounced": "⚖️",
  };
  return icons[outcome] || "📍";
}
