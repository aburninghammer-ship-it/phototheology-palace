// Expanded Frame Details for Bible Rendered Room
// Each frame includes: thematic description, anchor verse, gem triggers, connections, and PT room activations

export interface FrameDetail {
  frameNumber: number;
  themeDescription: string;
  anchorVerse: string;
  anchorVerseText: string;
  gemTriggers: string[];
  connections: string[];
  primaryRooms: string[];
  secondaryRooms: string[];
}

export const frameDetails: Record<number, FrameDetail> = {
  1: {
    frameNumber: 1,
    themeDescription: "God first divides to bring order—light from darkness, waters from land. But after sin, division becomes relational and destructive: humanity separates from God, Cain from Abel, nations scatter at Babel. Even covenant lines split between Ishmael and Isaac. Division moves from divine design to human fracture, yet God uses it to preserve a promised line.",
    anchorVerse: "Genesis 3:8–9",
    anchorVerseText: "And they heard the voice of the Lord God… and Adam and his wife hid themselves…",
    gemTriggers: [
      "Track every separation: light/dark → God/man → brother/brother → nations → covenant lines",
      "Connect: Creation divisions vs. sin divisions"
    ],
    connections: ["Frame 14 (Kingdom Division)", "Frame 50 (Heaven — division healed)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: ["Mathematics Room"]
  },
  2: {
    frameNumber: 2,
    themeDescription: "The patriarchal family expands through Isaac, Jacob, and the twelve tribes. Though marked by rivalry (Jacob and Esau, Joseph and his brothers), God multiplies His covenant people and positions them in Egypt. What begins in tension ends in growth, as God turns broken relationships into the multiplication of a nation.",
    anchorVerse: "Genesis 50:20",
    anchorVerseText: "Ye thought evil against me; but God meant it unto good…",
    gemTriggers: [
      "Map how conflict multiplies into blessing",
      "Connect: Division (Frame 1) → Multiplication (Frame 2)"
    ],
    connections: ["Frame 1 (Division becomes multiplication)", "Frame 43 (Church growth)"],
    primaryRooms: ["Mathematics Room", "Story Room (SR)"],
    secondaryRooms: ["Dimensions Room (DR)"]
  },
  3: {
    frameNumber: 3,
    themeDescription: "Israel, now multiplied, is enslaved in Egypt. God raises Moses, sends plagues, and executes judgment on Egypt's gods. The Passover marks redemption through blood, and the Red Sea finalizes separation from bondage. Deliverance is not just escape—it is covenant restoration, as God brings His people to Himself at Sinai.",
    anchorVerse: "Exodus 12:13",
    anchorVerseText: "When I see the blood, I will pass over you…",
    gemTriggers: [
      "Deliverance always comes through substitution (blood)",
      "Connect: Passover → Cross (Frames 39–41)"
    ],
    connections: ["Frame 41 (Cross Fulfilled)", "Frame 4 (Sanctuary follows deliverance)"],
    primaryRooms: ["Story Room (SR)", "Feasts Room"],
    secondaryRooms: ["Dimensions Room (DR)"]
  },
  4: {
    frameNumber: 4,
    themeDescription: "After deliverance, God establishes His dwelling among the people. The sanctuary system reveals how a holy God can live among sinful humanity. Every detail—the furniture, priesthood, and sacrifices—teaches mediation, atonement, and access. This frame shifts from freedom to fellowship: God not only saves—He dwells.",
    anchorVerse: "Exodus 25:8",
    anchorVerseText: "Let them make me a sanctuary; that I may dwell among them.",
    gemTriggers: [
      "Map furniture → salvation process",
      "Connect: Sanctuary → Cross → Heaven (Frame 50)"
    ],
    connections: ["Frame 3 (Deliverance precedes dwelling)", "Frame 48 (Sanctuary Reality)", "Frame 50 (Heaven)"],
    primaryRooms: ["Feasts Room", "Dimensions Room (DR)"],
    secondaryRooms: ["Story Room (SR)"]
  },
  5: {
    frameNumber: 5,
    themeDescription: "Instructions are given for worship, conduct, health, and community life. Holiness is defined in practical terms—what to eat, how to worship, how to live. The laws are not random; they shape Israel into a distinct people reflecting God's character.",
    anchorVerse: "Leviticus 19:2",
    anchorVerseText: "Be ye holy; for I the Lord your God am holy.",
    gemTriggers: [
      "Laws define what holiness looks like in action",
      "Connect: Law → Character → Judgment (Frame 29)"
    ],
    connections: ["Frame 29 (Judgment)", "Frame 46 (Walk Worthy)"],
    primaryRooms: ["Concentration Room (CR)", "Story Room (SR)"],
    secondaryRooms: ["Dimensions Room (DR)"]
  },
  6: {
    frameNumber: 6,
    themeDescription: "Movement toward the promised land is marked by testing, rebellion, and divine guidance. Complaints, unbelief, and judgment delay progress, yet God continues to lead, provide, and correct. The journey reveals that direction alone is not enough—faith is required to advance.",
    anchorVerse: "Numbers 14:33",
    anchorVerseText: "And your children shall wander in the wilderness…",
    gemTriggers: [
      "Track delay due to unbelief",
      "Connect: Journey → Christian walk (Frame 46)"
    ],
    connections: ["Frame 46 (Walk Worthy)", "Frame 7 (Arrival)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: ["Mathematics Room"]
  },
  7: {
    frameNumber: 7,
    themeDescription: "Israel approaches the promised land. The journey nears completion, and preparation intensifies. Covenant responsibilities, leadership structure, and obedience are emphasized. Arrival is not automatic—it requires readiness to live under God's rule in the land.",
    anchorVerse: "Deuteronomy 6:23",
    anchorVerseText: "He brought us out… that he might bring us in…",
    gemTriggers: [
      "Deliverance is incomplete without arrival",
      "Connect: Exodus (Frame 3) → Arrival (Frame 7)"
    ],
    connections: ["Frame 3 (Deliverance)", "Frame 9 (Conquest)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: ["Feasts Room"]
  },
  8: {
    frameNumber: 8,
    themeDescription: "Leadership transitions from Moses to Joshua, and a new generation prepares to act. God's promises remain constant, but the people must step forward in faith. Crossing the Jordan marks a shift from wandering to possessing. This frame highlights continuity—God's mission moves forward through new leadership.",
    anchorVerse: "Joshua 1:9",
    anchorVerseText: "Be strong and of a good courage…",
    gemTriggers: [
      "Leadership transitions test faith",
      "Connect: Moses → Joshua → Christ → Church (Frame 42)"
    ],
    connections: ["Frame 42 (Transition: Cross to Church)", "Frame 9 (Conquest follows transition)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  9: {
    frameNumber: 9,
    themeDescription: "Israel begins taking possession of the land. Victory comes through obedience, but failure (like Achan's sin) brings defeat. The conquest reveals that God fights for His people, yet requires faithfulness. The land is given, but must be claimed through trust and obedience.",
    anchorVerse: "Joshua 24:15",
    anchorVerseText: "Choose you this day whom ye will serve…",
    gemTriggers: [
      "Victory depends on choice + obedience",
      "Connect: Conquest → Spiritual warfare (Frame 49)"
    ],
    connections: ["Frame 49 (Warfare)", "Frame 10 (Disorder follows incomplete conquest)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: ["Concentration Room (CR)"]
  },
  10: {
    frameNumber: 10,
    themeDescription: "After initial victories, Israel descends into cycles of sin, oppression, and temporary deliverance. Without stable leadership, the nation fragments morally and spiritually. 'Every man did what was right in his own eyes.' Disorder reveals what happens when God's authority is ignored—freedom without obedience leads to chaos.",
    anchorVerse: "Judges 21:25",
    anchorVerseText: "Every man did that which was right in his own eyes.",
    gemTriggers: [
      "Absence of leadership → moral collapse",
      "Connect: Disorder → need for King (Frame 12)"
    ],
    connections: ["Frame 12 (Kingship)", "Frame 44 (Christ-Centered correction)"],
    primaryRooms: ["Story Room (SR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  11: {
    frameNumber: 11,
    themeDescription: "Dominated by Saul's jealousy toward David. After David's rise, Saul's insecurity turns into obsession, leading him to repeatedly pursue David's life. Jealousy corrupts leadership, distorts judgment, and replaces trust in God with fear and comparison. In contrast, David models restraint, refusing to harm Saul even when given the opportunity.",
    anchorVerse: "1 Samuel 18:9",
    anchorVerseText: "Saul eyed David from that day forward.",
    gemTriggers: [
      "Jealousy = comparison + insecurity",
      "Connect: Saul vs. David → Cain vs. Abel"
    ],
    connections: ["Frame 1 (Division — Cain/Abel)", "Frame 12 (Kingship established)"],
    primaryRooms: ["Story Room (SR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  12: {
    frameNumber: 12,
    themeDescription: "Transitions from the fall of Saul to the establishment of David's rule. Saul's death marks the end of failed leadership, while David is gradually recognized as king over all Israel. The narrative explores both the strength and weakness of human kingship—showing God's ideal while exposing human imperfection.",
    anchorVerse: "2 Samuel 5:4",
    anchorVerseText: "David was thirty years old when he began to reign…",
    gemTriggers: [
      "Contrast human kingship vs. divine kingship",
      "Connect: David → Christ (Frame 39)"
    ],
    connections: ["Frame 39 (Cross Revealed — Messiah King)", "Frame 10 (Disorder → need for king)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  13: {
    frameNumber: 13,
    themeDescription: "The unified kingdom under David and Solomon. David secures the kingdom, and Solomon expands it, builds the temple, and brings national stability and prosperity. Worship becomes centralized, and Israel reaches its peak. Yet underlying compromises begin to form, setting up future fracture.",
    anchorVerse: "1 Kings 4:25",
    anchorVerseText: "Judah and Israel dwelt safely…",
    gemTriggers: [
      "Unity comes under right leadership",
      "Connect: Unity → future restoration (Frame 50)"
    ],
    connections: ["Frame 50 (Heaven — full restoration)", "Frame 14 (Division follows compromise)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  14: {
    frameNumber: 14,
    themeDescription: "The united kingdom splits into Israel (north) and Judah (south). Political instability and widespread apostasy mark this era. Kings rise and fall, most leading the people away from God. Prophets like Elijah and Elisha call for repentance, but division deepens both spiritually and nationally.",
    anchorVerse: "1 Kings 12:16",
    anchorVerseText: "What portion have we in David?",
    gemTriggers: [
      "Division follows compromise",
      "Connect: Genesis division (Frame 1) → Kingdom division"
    ],
    connections: ["Frame 1 (Division)", "Frame 15 (Collapse follows division)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  15: {
    frameNumber: 15,
    themeDescription: "Judah's collapse and exile to Babylon. Jerusalem falls, the temple is destroyed, and the monarchy ends. Then Chronicles reframes history by revisiting David's life, emphasizing preparation for the temple and covenant faithfulness. Even in collapse, God redirects attention to His original purpose.",
    anchorVerse: "2 Kings 25:9",
    anchorVerseText: "He burnt the house of the Lord…",
    gemTriggers: [
      "Sin leads to total system collapse",
      "Connect: Temple destroyed → rebuilt (Frame 18)"
    ],
    connections: ["Frame 18 (Restoration Under Threat)", "Frame 4 (Sanctuary — original blueprint)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  16: {
    frameNumber: 16,
    themeDescription: "Structure in worship and the glory of Solomon's reign. Temple service is organized, leadership roles are defined, and worship is systematized. Solomon's reign showcases wisdom, wealth, and the height of Israel's national and spiritual influence. An ideal vision of ordered worship under God.",
    anchorVerse: "2 Chronicles 7:1",
    anchorVerseText: "The glory of the Lord filled the house.",
    gemTriggers: [
      "True order invites God's presence",
      "Connect: Sanctuary (Frame 4) → Temple"
    ],
    connections: ["Frame 4 (Sanctuary)", "Frame 13 (Unification peak)"],
    primaryRooms: ["Feasts Room", "Story Room (SR)"],
    secondaryRooms: []
  },
  17: {
    frameNumber: 17,
    themeDescription: "Judah's decline into exile and the beginning of restoration. Persistent disobedience leads to Babylonian captivity, but God moves through foreign rulers like Cyrus to initiate a return. Judgment gives way to restoration—captivity is not the end, but a turning point.",
    anchorVerse: "Ezra 1:3",
    anchorVerseText: "Who is there among you of all his people?",
    gemTriggers: [
      "God restores after judgment",
      "Connect: Exile → spiritual restoration"
    ],
    connections: ["Frame 15 (Collapse)", "Frame 18 (Rebuilding)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  18: {
    frameNumber: 18,
    themeDescription: "The temple is completed, but restoration remains fragile. Opposition continues, and in Esther, a decree threatens the destruction of God's people. Though God is not explicitly named, His providence is evident. Restoration is real—but constantly under attack.",
    anchorVerse: "Esther 4:14",
    anchorVerseText: "For such a time as this…",
    gemTriggers: [
      "God works behind the scenes",
      "Connect: Hidden God → unseen providence"
    ],
    connections: ["Frame 17 (Return begins)", "Frame 19 (Preservation through crisis)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  19: {
    frameNumber: 19,
    themeDescription: "God's people are preserved as Haman's plan collapses. The narrative then shifts to Job, where suffering raises deeper questions about justice and divine control. This frame reveals that God preserves His people not by removing trials, but by sustaining them through crisis.",
    anchorVerse: "Job 1:21",
    anchorVerseText: "The Lord gave, and the Lord hath taken away…",
    gemTriggers: [
      "Faith persists without understanding",
      "Connect: Suffering → trust (Frame 20)"
    ],
    connections: ["Frame 20 (Trust)", "Frame 48 (Hope)"],
    primaryRooms: ["Story Room (SR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  20: {
    frameNumber: 20,
    themeDescription: "Transitions from questioning to anchoring. Job wrestles with injustice, while the Psalms begin to affirm confidence in God. Psalm 1 establishes the foundation: the righteous are rooted in God's word, not circumstances. Trust becomes the stabilizing force in a broken world.",
    anchorVerse: "Psalm 1:2",
    anchorVerseText: "His delight is in the law of the Lord…",
    gemTriggers: [
      "Stability = rooted in God's word",
      "Connect: Trust → Wisdom (Frame 26)"
    ],
    connections: ["Frame 26 (Wisdom)", "Frame 19 (Suffering precedes trust)"],
    primaryRooms: ["Concentration Room (CR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  21: {
    frameNumber: 21,
    themeDescription: "Filled with cries to God—prayers for help, justice, mercy, and deliverance. David and others plead for God to intervene against enemies, forgive sin, and restore righteousness. The dominant movement is dependence expressed through urgent prayer. The human voice reaches upward in desperation and trust.",
    anchorVerse: "Psalm 6:9",
    anchorVerseText: "The Lord hath heard my supplication…",
    gemTriggers: [
      "Identify the problem → plea → trust pattern",
      "Connect: Crisis → Prayer response"
    ],
    connections: ["Frame 22 (Pleading shifts to Praising)", "Frame 32 (God's Pleading)"],
    primaryRooms: ["Story Room (SR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  22: {
    frameNumber: 22,
    themeDescription: "The tone shifts from pleading to praise. These psalms exalt God's holiness, kingship, and faithfulness. Worship becomes central, celebrating who God is rather than just what He does. Zion is lifted up as the place of God's presence. Praise replaces anxiety as confidence in God grows.",
    anchorVerse: "Psalm 34:1",
    anchorVerseText: "I will bless the Lord at all times…",
    gemTriggers: [
      "Praise independent of circumstances",
      "Connect: Pleading → Praising shift"
    ],
    connections: ["Frame 21 (Pleading)", "Frame 24 (Victory)"],
    primaryRooms: ["Story Room (SR)", "Feasts Room"],
    secondaryRooms: []
  },
  23: {
    frameNumber: 23,
    themeDescription: "Wrestles with injustice, the prosperity of the wicked, and the vulnerability of the righteous. Yet within the struggle, God is seen as protector and refuge. The tension between reality and faith is strong—life is hard, but God remains a shield. Protection is not the absence of trouble, but God's presence within it.",
    anchorVerse: "Psalm 62:6",
    anchorVerseText: "He only is my rock and my salvation…",
    gemTriggers: [
      "Contrast wicked prosperity vs. righteous security",
      "Connect: Struggle → God as refuge"
    ],
    connections: ["Frame 24 (Victory follows struggle)", "Frame 49 (Warfare)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  24: {
    frameNumber: 24,
    themeDescription: "God's reign and ultimate victory. The Lord is portrayed as King over all the earth, ruling with righteousness and power. Despite chaos in the world, God's throne is secure. Victory is not based on human strength, but on God's sovereign rule.",
    anchorVerse: "Psalm 93:1",
    anchorVerseText: "The Lord reigneth…",
    gemTriggers: [
      "God's kingship guarantees victory",
      "Connect: Victory not situational, but positional (God reigns)"
    ],
    connections: ["Frame 25 (Certainty follows victory)", "Frame 50 (Heaven — final victory)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  25: {
    frameNumber: 25,
    themeDescription: "Builds confidence in God's justice and faithfulness. Though evil may appear to prevail, judgment is certain. God hears, sees, and will act. Assurance replaces doubt—there is a settled confidence that God's purposes will stand.",
    anchorVerse: "Psalm 100:5",
    anchorVerseText: "His mercy is everlasting…",
    gemTriggers: [
      "Certainty rooted in God's character",
      "Connect: Victory → Confidence"
    ],
    connections: ["Frame 24 (Victory)", "Frame 26 (Wisdom)"],
    primaryRooms: ["Concentration Room (CR)"],
    secondaryRooms: []
  },
  26: {
    frameNumber: 26,
    themeDescription: "The transition from Psalms to Proverbs introduces wisdom as a way of life. Fear of the Lord, righteous living, and practical instruction dominate. Wisdom is not abstract—it is lived daily through choices, speech, and relationships. This frame shows how truth is applied.",
    anchorVerse: "Proverbs 1:7",
    anchorVerseText: "The fear of the Lord is the beginning of knowledge…",
    gemTriggers: [
      "Wisdom = applied trust",
      "Connect: Trust (Frame 20) → Wisdom (Frame 26)"
    ],
    connections: ["Frame 20 (Trust)", "Frame 27 (Vanity — wisdom's opposite)"],
    primaryRooms: ["Concentration Room (CR)", "Mathematics Room"],
    secondaryRooms: []
  },
  27: {
    frameNumber: 27,
    themeDescription: "Exposes the limits of human wisdom apart from God. Proverbs continues contrasting wisdom and folly, while Ecclesiastes wrestles with the emptiness ('vanity') of life pursued without eternal perspective. Human effort, success, and pleasure are shown to be insufficient. Foolishness is ultimately living without God at the center.",
    anchorVerse: "Ecclesiastes 1:2",
    anchorVerseText: "Vanity of vanities… all is vanity.",
    gemTriggers: [
      "Life without God = empty cycles",
      "Connect: Wisdom vs. vanity contrast"
    ],
    connections: ["Frame 26 (Wisdom)", "Frame 28 (Faltering Bride)"],
    primaryRooms: ["Concentration Room (CR)"],
    secondaryRooms: []
  },
  28: {
    frameNumber: 28,
    themeDescription: "Begins with the brokenness of human life and transitions into prophetic imagery of God's people as an unfaithful bride. Ecclesiastes highlights mortality and unpredictability, while early Isaiah reveals spiritual decline and rebellion. God's people are faltering—called to relationship, yet drifting away.",
    anchorVerse: "Isaiah 1:4",
    anchorVerseText: "Ah sinful nation… they have forsaken the Lord…",
    gemTriggers: [
      "Track decline of God's people",
      "Connect: Vanity → Spiritual unfaithfulness"
    ],
    connections: ["Frame 27 (Vanity)", "Frame 31 (Faltering Part II)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  29: {
    frameNumber: 29,
    themeDescription: "Judgment expands beyond Israel to the nations. God confronts pride, idolatry, and injustice across the world. These chapters reveal that no nation stands outside God's authority. Yet within judgment, there are glimpses of restoration and hope. Judgment is both corrective and revelatory.",
    anchorVerse: "Isaiah 13:11",
    anchorVerseText: "I will punish the world for their evil…",
    gemTriggers: [
      "Judgment extends to all nations",
      "Connect: Sin → Accountability"
    ],
    connections: ["Frame 5 (Laws)", "Frame 38 (Day of the Lord)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  30: {
    frameNumber: 30,
    themeDescription: "Shifts toward redemption. Historical narratives (like Hezekiah) blend with prophetic visions of salvation. The suffering servant emerges, pointing to a coming Redeemer who will bear sin and bring healing (Isaiah 53). The gospel is revealed—God Himself providing the solution to humanity's deepest problem.",
    anchorVerse: "Isaiah 53:5",
    anchorVerseText: "He was wounded for our transgressions…",
    gemTriggers: [
      "Substitutionary salvation revealed",
      "Connect: Passover (Frame 3) → Cross"
    ],
    connections: ["Frame 3 (Deliverance)", "Frame 41 (Cross Fulfilled)"],
    primaryRooms: ["Story Room (SR)", "Feasts Room"],
    secondaryRooms: []
  },
  31: {
    frameNumber: 31,
    themeDescription: "Continues the tension between God's ideal and His people's reality. Isaiah ends with visions of glory and restoration, but Jeremiah exposes deep corruption—idolatry, broken covenant, and hardened hearts. The contrast is sharp: what God intends vs. what His people are becoming. The bride continues to falter despite clear light.",
    anchorVerse: "Jeremiah 17:9",
    anchorVerseText: "The heart is deceitful above all things…",
    gemTriggers: [
      "Internal corruption, not just external failure",
      "Connect: Outward sin → inward condition"
    ],
    connections: ["Frame 28 (Faltering Bride Part I)", "Frame 32 (God's Pleading)"],
    primaryRooms: ["Concentration Room (CR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  32: {
    frameNumber: 32,
    themeDescription: "God pleads with His people through Jeremiah. Using images like the potter and clay, He calls for repentance, warning of coming judgment while still offering mercy. Despite repeated appeals, the people resist. This frame reveals God's heart—reluctant to judge, persistent in calling His people back.",
    anchorVerse: "Jeremiah 18:6",
    anchorVerseText: "As the clay is in the potter's hand…",
    gemTriggers: [
      "God's desire to reshape, not destroy",
      "Connect: God's pleading vs. human resistance"
    ],
    connections: ["Frame 21 (Human Pleading)", "Frame 37 (Mercy)"],
    primaryRooms: ["Story Room (SR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  33: {
    frameNumber: 33,
    themeDescription: "Exposes the depth of rebellion. The people reject God's counsel and persist in disobedience. Ezekiel is shown the hidden abominations in the temple—idolatry, corruption, and spiritual betrayal at every level. Sin is no longer surface-level; it is entrenched and systemic.",
    anchorVerse: "Ezekiel 8:6",
    anchorVerseText: "Seest thou what they do… great abominations…",
    gemTriggers: [
      "Hidden sin exposed",
      "Connect: Public religion vs. private corruption"
    ],
    connections: ["Frame 34 (Apostasy)", "Frame 15 (Collapse)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  34: {
    frameNumber: 34,
    themeDescription: "Judgment begins with those closest to God. Ezekiel sees the marking of the faithful and the destruction of the unfaithful. Jerusalem falls, and the consequences of long-term apostasy unfold. Persistent rejection of God leads to irreversible collapse.",
    anchorVerse: "Ezekiel 9:4",
    anchorVerseText: "Set a mark upon the foreheads…",
    gemTriggers: [
      "Separation between faithful and unfaithful",
      "Connect: Genesis division (Frame 1) → final separation"
    ],
    connections: ["Frame 1 (Division)", "Frame 49 (Warfare — final separation)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  35: {
    frameNumber: 35,
    themeDescription: "Hope re-enters through prophecy. Ezekiel begins to speak of restoration, watchmen, and renewed life, while Daniel introduces apocalyptic visions of kingdoms and timelines. God reveals the future—not to satisfy curiosity, but to guide His people through history with clarity and confidence.",
    anchorVerse: "Daniel 8:14",
    anchorVerseText: "Unto two thousand and three hundred days…",
    gemTriggers: [
      "Time prophecy = divine timeline",
      "Connect: Sanctuary (Frame 4) → Prophecy"
    ],
    connections: ["Frame 4 (Sanctuary)", "Frame 36 (Probation Closing)"],
    primaryRooms: ["Mathematics Room", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  36: {
    frameNumber: 36,
    themeDescription: "Centers on accountability and timing. Daniel 9 reveals a prophetic timeline tied to redemption and judgment, while the prophets emphasize that God does nothing without revealing it first. Opportunities for repentance are not indefinite—probation has limits.",
    anchorVerse: "Amos 3:7",
    anchorVerseText: "Surely the Lord God will do nothing, but he revealeth his secret unto his servants the prophets.",
    gemTriggers: [
      "God warns before judgment",
      "Connect: Prophecy → accountability"
    ],
    connections: ["Frame 35 (Prophecy)", "Frame 38 (Day of the Lord)"],
    primaryRooms: ["Dimensions Room (DR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  37: {
    frameNumber: 37,
    themeDescription: "Even after warnings, God continues to extend mercy. Amos calls for repentance again and again, while Habakkuk wrestles with injustice and learns to trust God's plan. Mercy persists, even when judgment is deserved. God's desire is still restoration, not destruction.",
    anchorVerse: "Habakkuk 3:2",
    anchorVerseText: "In wrath remember mercy.",
    gemTriggers: [
      "Mercy persists even in judgment",
      "Connect: Judgment (Frame 29) → Mercy tension"
    ],
    connections: ["Frame 29 (Judgment)", "Frame 32 (God's Pleading)"],
    primaryRooms: ["Story Room (SR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  38: {
    frameNumber: 38,
    themeDescription: "Culminates in the Day of the Lord—a time of judgment, purification, and final reckoning. The prophets point forward to a decisive intervention where evil is addressed and righteousness is established. Yet within this day is hope for those who fear God's name.",
    anchorVerse: "Malachi 4:1",
    anchorVerseText: "The day cometh, that shall burn as an oven…",
    gemTriggers: [
      "Final justice + purification",
      "Connect: Day of the Lord → Revelation"
    ],
    connections: ["Frame 36 (Probation)", "Frame 49 (Warfare)", "Frame 50 (Heaven)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  39: {
    frameNumber: 39,
    themeDescription: "The long-awaited Messiah arrives. Christ's birth, ministry, teachings, and growing opposition. The kingdom of God is revealed, but so is rejection. The cross is now in view—humanity's response to God reaches its climax as they prepare to reject the very One sent to save them.",
    anchorVerse: "Matthew 1:21",
    anchorVerseText: "He shall save his people from their sins.",
    gemTriggers: [
      "Messiah identified",
      "Connect: Isaiah 53 (Frame 30) → Jesus"
    ],
    connections: ["Frame 30 (Gospel / Isaiah 53)", "Frame 12 (David → Christ)"],
    primaryRooms: ["Feasts Room", "Story Room (SR)"],
    secondaryRooms: []
  },
  40: {
    frameNumber: 40,
    themeDescription: "Urgency intensifies. Christ teaches on judgment, readiness, and the end of the age. Parables emphasize accountability and preparation. The mission is clear, and the cross is no longer distant. Everything is moving toward sacrifice.",
    anchorVerse: "Matthew 25:13",
    anchorVerseText: "Watch therefore…",
    gemTriggers: [
      "Urgency + readiness",
      "Connect: Second coming themes begin"
    ],
    connections: ["Frame 39 (Cross Revealed)", "Frame 41 (Cross Fulfilled)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  41: {
    frameNumber: 41,
    themeDescription: "Carries Christ's life to its climax. From His early years to His ministry, everything moves toward the cross. The crucifixion, resurrection, and post-resurrection appearances complete the mission. What was anticipated is now accomplished—redemption is secured through Christ's sacrifice.",
    anchorVerse: "Luke 23:46",
    anchorVerseText: "Father, into thy hands I commend my spirit…",
    gemTriggers: [
      "Redemption completed",
      "Connect: Passover (Frame 3) → Cross fulfilled"
    ],
    connections: ["Frame 3 (Deliverance / Passover)", "Frame 42 (Transition to Church)"],
    primaryRooms: ["Feasts Room", "Story Room (SR)"],
    secondaryRooms: []
  },
  42: {
    frameNumber: 42,
    themeDescription: "Bridges Christ's work to the birth of the church. John presents the divine identity of Christ, while Acts shows the outpouring of the Holy Spirit and the beginning of apostolic mission. The focus shifts from Christ physically present to Christ working through His people.",
    anchorVerse: "Acts 2:38",
    anchorVerseText: "Repent… and ye shall receive the gift of the Holy Ghost.",
    gemTriggers: [
      "Spirit replaces physical presence",
      "Connect: Christ → Church"
    ],
    connections: ["Frame 8 (Transition — Moses to Joshua)", "Frame 43 (Church Growth)"],
    primaryRooms: ["Story Room (SR)", "Dimensions Room (DR)"],
    secondaryRooms: []
  },
  43: {
    frameNumber: 43,
    themeDescription: "The church expands rapidly despite persecution. The gospel spreads from Jerusalem outward through bold preaching, miracles, and missionary journeys. Opposition intensifies, but so does impact. Growth here is both numerical and geographical—the message reaches the world.",
    anchorVerse: "Acts 5:42",
    anchorVerseText: "They ceased not to teach and preach Jesus…",
    gemTriggers: [
      "Growth through persecution",
      "Connect: Opposition → expansion"
    ],
    connections: ["Frame 2 (Multiplication)", "Frame 42 (Transition)"],
    primaryRooms: ["Story Room (SR)", "Mathematics Room"],
    secondaryRooms: []
  },
  44: {
    frameNumber: 44,
    themeDescription: "Emphasizes grounding the growing church in Christ. As the gospel spreads, doctrinal clarity becomes essential. Paul begins addressing divisions, immorality, and confusion in the church, pointing believers back to Christ as the center. The foundation must be right for growth to last.",
    anchorVerse: "1 Corinthians 2:2",
    anchorVerseText: "I determined not to know any thing… save Jesus Christ…",
    gemTriggers: [
      "Christ as foundation",
      "Connect: Disorder (Frame 10) → correction"
    ],
    connections: ["Frame 10 (Disorder)", "Frame 45 (Gospel Power)"],
    primaryRooms: ["Concentration Room (CR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  45: {
    frameNumber: 45,
    themeDescription: "The gospel is clarified and defended. Paul confronts legalism, false teachings, and misuse of freedom. The message becomes sharper: salvation is through Christ alone, not human effort. The power of the gospel lies in its ability to transform lives, not just inform minds.",
    anchorVerse: "Galatians 1:8",
    anchorVerseText: "Though we… preach any other gospel…",
    gemTriggers: [
      "Guard the gospel",
      "Connect: Truth vs. distortion"
    ],
    connections: ["Frame 44 (Christ-Centered Foundation)", "Frame 46 (Walk Worthy)"],
    primaryRooms: ["Concentration Room (CR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  46: {
    frameNumber: 46,
    themeDescription: "Shifts from doctrine to lifestyle. Believers are called to live in a way that reflects the gospel—walking in the Spirit, producing fruit, and living with purpose. Faith is not just belief; it is demonstrated through daily conduct.",
    anchorVerse: "Galatians 5:16",
    anchorVerseText: "Walk in the Spirit…",
    gemTriggers: [
      "Life reflects belief",
      "Connect: Doctrine → lifestyle"
    ],
    connections: ["Frame 5 (Laws — holiness in action)", "Frame 6 (Journey — Christian walk)"],
    primaryRooms: ["Concentration Room (CR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  47: {
    frameNumber: 47,
    themeDescription: "The focus is encouragement and warning. Believers are urged to remain steadfast, endure persecution, and stay grounded in truth. Hebrews elevates Christ as superior—greater than angels, Moses, and the priesthood—calling believers to hold firmly to their faith.",
    anchorVerse: "Hebrews 3:13",
    anchorVerseText: "Exhort one another daily…",
    gemTriggers: [
      "Perseverance required",
      "Connect: Journey (Frame 6) → endurance"
    ],
    connections: ["Frame 6 (Journey)", "Frame 48 (Hope)"],
    primaryRooms: ["Concentration Room (CR)"],
    secondaryRooms: []
  },
  48: {
    frameNumber: 48,
    themeDescription: "Anchors believers in hope. Christ's priestly ministry, God's promises, and the assurance of salvation are emphasized. Hope is not wishful thinking—it is rooted in what Christ has already accomplished and what He continues to do.",
    anchorVerse: "Hebrews 6:19",
    anchorVerseText: "Which hope we have as an anchor…",
    gemTriggers: [
      "Hope stabilizes",
      "Connect: Anchor imagery → sanctuary"
    ],
    connections: ["Frame 4 (Sanctuary)", "Frame 19 (Preservation)"],
    primaryRooms: ["Dimensions Room (DR)", "Concentration Room (CR)"],
    secondaryRooms: []
  },
  49: {
    frameNumber: 49,
    themeDescription: "The conflict intensifies. Truth vs. deception, Christ vs. antichrist, righteousness vs. rebellion. Revelation unveils the cosmic battle between good and evil, exposing Satan's strategies and the perseverance of God's people. Spiritual warfare reaches its peak.",
    anchorVerse: "Revelation 12:11",
    anchorVerseText: "They overcame him by the blood of the Lamb…",
    gemTriggers: [
      "Victory through Christ",
      "Connect: Genesis conflict (Frame 1) → final war"
    ],
    connections: ["Frame 1 (Division — first conflict)", "Frame 9 (Conquest)", "Frame 50 (Heaven — war ends)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  50: {
    frameNumber: 50,
    themeDescription: "The story concludes with final judgment, the end of sin, and the restoration of all things. Death is destroyed, evil is eliminated, and God dwells with His people. The division introduced in Genesis is fully healed. The narrative ends where it began—perfect unity, restored.",
    anchorVerse: "Revelation 21:3",
    anchorVerseText: "God himself shall be with them…",
    gemTriggers: [
      "Full restoration",
      "Connect: Genesis 1 → Revelation 21 (Eden restored)"
    ],
    connections: ["Frame 1 (Division healed)", "Frame 4 (Sanctuary — God dwelling)", "Frame 13 (Unity restored)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  },
  51: {
    frameNumber: 51,
    themeDescription: "The final frame echoes Frame 50, extending the vision of heaven into eternity. God's presence is permanent, the Lamb is the light, and the river of life flows from the throne. All things are made new—the story of redemption is complete.",
    anchorVerse: "Revelation 22:5",
    anchorVerseText: "And there shall be no night there…",
    gemTriggers: [
      "Eternity begins where time ends",
      "Connect: The whole Bible points here"
    ],
    connections: ["Frame 50 (Heaven)", "Frame 1 (Genesis — full circle)"],
    primaryRooms: ["Dimensions Room (DR)", "Story Room (SR)"],
    secondaryRooms: []
  }
};

export function getFrameDetail(frameNumber: number): FrameDetail | undefined {
  return frameDetails[frameNumber];
}
