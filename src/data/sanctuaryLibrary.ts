// Sanctuary Library - Comprehensive Guide to the Heavenly Sanctuary and Its Earthly Type
// Every element of the sanctuary teaches about Christ's person, work, and ministry

export type SanctuaryZone = "courtyard" | "holy-place" | "most-holy-place" | "camp";
export type FurnitureCategory = "furniture" | "vessel" | "garment" | "material" | "service";

export interface SanctuaryElement {
  id: string;
  name: string;
  zone: SanctuaryZone;
  category: FurnitureCategory;
  hebrewName?: string;
  hebrewMeaning?: string;
  physicalDescription: string;
  dimensions?: string;
  materials: string[];
  construction: string;
  purpose: string;
  priestlyService: string;
  christConnection: string;
  believerApplication: string;
  keyVerses: string[];
  relatedElements?: string[];
  prophetic?: string;
}

export interface SanctuaryService {
  id: string;
  name: string;
  hebrewName?: string;
  frequency: "daily" | "weekly" | "monthly" | "annual" | "occasional";
  timing: string;
  zone: SanctuaryZone;
  description: string;
  procedure: string[];
  offerings: string[];
  priestlyRole: string;
  christFulfillment: string;
  believerApplication: string;
  keyVerses: string[];
  relatedServices?: string[];
}

export interface SanctuaryOffering {
  id: string;
  name: string;
  hebrewName: string;
  hebrewMeaning: string;
  type: "blood" | "non-blood" | "drink";
  category: "mandatory" | "voluntary" | "purification";
  purpose: string;
  description: string;
  animalOrMaterial: string[];
  procedure: string[];
  whoOffers: string;
  whenOffered: string;
  priestPortion: string;
  offererPortion: string;
  christTypology: string;
  spiritualLesson: string;
  keyVerses: string[];
}

export interface PriestlyGarment {
  id: string;
  name: string;
  hebrewName: string;
  hebrewMeaning: string;
  wornBy: "high-priest" | "common-priest" | "both";
  materials: string[];
  colors: string[];
  description: string;
  symbolism: string;
  christConnection: string;
  believerApplication: string;
  keyVerses: string[];
}

// Zone Information
export const sanctuaryZones = [
  {
    id: "camp",
    name: "The Camp",
    description: "The area where Israel dwelt around the tabernacle, representing the world and unconverted humanity",
    spiritualMeaning: "The world in its fallen state, outside God's immediate presence but within His providential care",
    christConnection: "Christ came out of heaven's sanctuary to the 'camp' of humanity, bearing our reproach outside the gate"
  },
  {
    id: "courtyard",
    name: "The Courtyard",
    description: "The enclosed outer area containing the altar of burnt offering and the laver, open to the sky",
    spiritualMeaning: "Justification and initial cleansing—where sinners first encounter God through sacrifice and washing",
    christConnection: "Christ's sacrifice on Calvary (altar) and the washing of regeneration (laver) bring us into God's presence"
  },
  {
    id: "holy-place",
    name: "The Holy Place",
    description: "The first apartment of the tabernacle proper, containing the lampstand, table of showbread, and altar of incense",
    spiritualMeaning: "Sanctification—ongoing spiritual growth through light (Word), bread (Christ), and prayer (incense)",
    christConnection: "Christ as Light of the World, Bread of Life, and our Intercessor ministers here daily for believers"
  },
  {
    id: "most-holy-place",
    name: "The Most Holy Place",
    description: "The inner sanctum containing only the Ark of the Covenant with the mercy seat, entered only on Day of Atonement",
    spiritualMeaning: "Glorification and God's immediate presence—where judgment occurs and mercy is dispensed",
    christConnection: "Christ entered the heavenly Most Holy Place with His own blood, securing eternal redemption"
  }
];

// Sanctuary Furniture and Elements
export const sanctuaryElements: SanctuaryElement[] = [
  // COURTYARD ELEMENTS
  {
    id: "altar-burnt-offering",
    name: "Altar of Burnt Offering",
    zone: "courtyard",
    category: "furniture",
    hebrewName: "Mizbeach Ha'Olah",
    hebrewMeaning: "Altar of Ascending",
    physicalDescription: "A large hollow square altar made of acacia wood overlaid with bronze, with horns on each corner and a bronze grating inside",
    dimensions: "5 cubits long × 5 cubits wide × 3 cubits high (approximately 7.5ft × 7.5ft × 4.5ft)",
    materials: ["Acacia wood", "Bronze overlay", "Bronze grating", "Bronze rings", "Bronze poles"],
    construction: "Hollow wooden frame overlaid with bronze, with a bronze grating inside at mid-height for burning, four horns projecting from corners, rings and poles for transport",
    purpose: "The place where all blood sacrifices were offered, where fire consumed the offerings and blood was applied to the horns and base",
    priestlyService: "Priests maintained perpetual fire, offered morning and evening sacrifices, applied blood to horns, removed ashes to a clean place",
    christConnection: "Christ is both our altar (Hebrews 13:10) and our sacrifice. The bronze speaks of judgment; the fire of divine holiness consuming sin. Christ offered Himself on the altar of the cross, bearing God's judgment for us.",
    believerApplication: "Present your body as a living sacrifice (Romans 12:1). Die daily to self. The altar transforms the ordinary into the sacred.",
    keyVerses: ["Exodus 27:1-8", "Exodus 38:1-7", "Leviticus 1:1-17", "Hebrews 13:10-12"],
    relatedElements: ["laver", "courtyard-gate"],
    prophetic: "The cross of Calvary where Christ made atonement. The perpetual fire points to Christ's eternal sacrifice."
  },
  {
    id: "laver",
    name: "Bronze Laver",
    zone: "courtyard",
    category: "furniture",
    hebrewName: "Kiyyor",
    hebrewMeaning: "Basin/Pot for washing",
    physicalDescription: "A large bronze basin for washing, mounted on a bronze base, made from the bronze mirrors donated by women who served at the tabernacle entrance",
    dimensions: "No specific dimensions given—sized for priestly washing",
    materials: ["Bronze from women's mirrors"],
    construction: "Cast bronze basin on a bronze stand, filled with water for priestly washing",
    purpose: "Priests washed hands and feet before entering the Holy Place or serving at the altar—failure meant death",
    priestlyService: "Before any service, priests must wash hands (their works) and feet (their walk). This was not optional but life-or-death obedience.",
    christConnection: "Christ washes us by the water of the Word (Ephesians 5:26). The mirrors become a laver—self-examination leads to cleansing. Jesus washed disciples' feet, showing servant leadership and ongoing cleansing.",
    believerApplication: "Daily cleansing through the Word is essential. Examine yourself (the mirror). Let Christ wash your walk (feet) and works (hands).",
    keyVerses: ["Exodus 30:17-21", "Exodus 38:8", "John 13:5-10", "Ephesians 5:26", "Titus 3:5"],
    relatedElements: ["altar-burnt-offering", "holy-place-entrance"],
    prophetic: "Baptism and ongoing sanctification. The Word as a mirror (James 1:23-25) and a washing agent."
  },
  {
    id: "courtyard-gate",
    name: "Gate of the Court",
    zone: "courtyard",
    category: "furniture",
    hebrewName: "Sha'ar",
    hebrewMeaning: "Gate/Opening",
    physicalDescription: "A 20-cubit-wide entrance on the east side, made of fine-twined linen in blue, purple, and scarlet, hung on four pillars",
    dimensions: "20 cubits wide × 5 cubits high (30ft × 7.5ft)",
    materials: ["Fine-twined linen", "Blue, purple, and scarlet thread", "Four bronze pillars", "Silver hooks and bands"],
    construction: "Woven curtain of white linen embroidered with blue, purple, and scarlet, suspended from four pillars with silver hooks",
    purpose: "The only entrance to the sanctuary complex—all worshippers entered through this single gate",
    priestlyService: "Priests controlled access, ensuring proper sacrifices were brought and only the ritually clean entered",
    christConnection: "Christ said 'I am the door' (John 10:9). There is only one way to the Father. Blue (heaven), purple (royalty), scarlet (sacrifice), white (purity)—all speak of Christ's nature.",
    believerApplication: "Enter through Christ alone. No other access to God exists. The colors remind us who He is—heavenly King who shed His blood in purity.",
    keyVerses: ["Exodus 27:16", "John 10:9", "John 14:6", "Acts 4:12"],
    relatedElements: ["altar-burnt-offering", "courtyard-fence"],
    prophetic: "The single entrance foreshadows Christ as the only way of salvation—narrow gate, exclusive claim."
  },
  {
    id: "courtyard-fence",
    name: "Courtyard Fence",
    zone: "courtyard",
    category: "furniture",
    hebrewName: "Chatser",
    hebrewMeaning: "Enclosed court",
    physicalDescription: "White linen curtains 5 cubits high surrounding the courtyard, supported by bronze pillars with silver hooks and bands",
    dimensions: "100 cubits long × 50 cubits wide × 5 cubits high (150ft × 75ft × 7.5ft)",
    materials: ["Fine-twined linen", "60 bronze pillars", "Silver hooks and bands", "Bronze sockets"],
    construction: "White linen hangings suspended from bronze pillars set in bronze sockets, connected by silver bands and hooks",
    purpose: "Separated the sacred space from the camp, defining holy ground and limiting access to proper worshippers",
    priestlyService: "Maintained the boundary between sacred and common, reminded all of God's holiness and the need for proper approach",
    christConnection: "The white linen speaks of Christ's perfect righteousness that separates the holy from the common. Bronze (judgment) supports white (righteousness)—we're made righteous through judgment borne by Christ.",
    believerApplication: "Separation from the world is necessary for worship. We are in the world but not of it. Righteousness defines our boundaries.",
    keyVerses: ["Exodus 27:9-19", "2 Corinthians 6:17", "1 Peter 2:9"],
    relatedElements: ["courtyard-gate"]
  },

  // HOLY PLACE ELEMENTS
  {
    id: "lampstand",
    name: "Golden Lampstand",
    zone: "holy-place",
    category: "furniture",
    hebrewName: "Menorah",
    hebrewMeaning: "Light-bearer",
    physicalDescription: "A seven-branched lampstand of pure hammered gold, with cups shaped like almond blossoms, knobs, and flowers on each branch",
    dimensions: "Approximately 5 feet tall, made from one talent (75 lbs) of pure gold",
    materials: ["Pure gold—one talent (75 pounds)", "Olive oil for light"],
    construction: "Hammered (not cast) from a single piece of gold, with six branches extending from a central shaft, decorated with almond blossom shapes, buds, and flowers. Seven lamps with wicks held pure olive oil.",
    purpose: "Provided the only light in the Holy Place—without it, the sanctuary would be in complete darkness",
    priestlyService: "Priests trimmed wicks and added oil morning and evening to keep lamps burning perpetually. The lamp was never to go out.",
    christConnection: "Christ is the Light of the World (John 8:12). The seven lamps represent the sevenfold Spirit (Revelation 4:5). The almond (first to blossom) speaks of resurrection. Beaten gold—Christ suffered to become our light.",
    believerApplication: "We are to shine as lights (Philippians 2:15). The church holds up the light of Christ. We need the oil of the Spirit to shine continuously.",
    keyVerses: ["Exodus 25:31-40", "Exodus 37:17-24", "Zechariah 4:2-6", "Revelation 1:12-20", "John 8:12"],
    relatedElements: ["table-showbread", "altar-incense", "olive-oil"],
    prophetic: "The seven churches of Revelation are lampstands. The Spirit empowers our witness. Christ walks among the lampstands."
  },
  {
    id: "table-showbread",
    name: "Table of Showbread",
    zone: "holy-place",
    category: "furniture",
    hebrewName: "Shulchan Lechem HaPanim",
    hebrewMeaning: "Table of the Bread of the Presence/Faces",
    physicalDescription: "A gold-covered acacia wood table with a golden crown molding, holding 12 loaves of unleavened bread arranged in two rows of six",
    dimensions: "2 cubits long × 1 cubit wide × 1.5 cubits high (3ft × 1.5ft × 2.25ft)",
    materials: ["Acacia wood", "Pure gold overlay", "Gold crown molding", "Gold rings and poles", "Golden dishes, spoons, bowls, pitchers"],
    construction: "Acacia wood overlaid with pure gold, with decorative crown molding around the top, rings for carrying poles, various golden utensils for the bread service",
    purpose: "Held the 12 loaves (representing the 12 tribes) in God's presence perpetually—'bread of the Presence'",
    priestlyService: "Every Sabbath, priests replaced the 12 loaves with fresh ones. The old loaves were eaten by priests in the holy place. Fresh frankincense was placed on each row.",
    christConnection: "Christ is the Bread of Life (John 6:35). The 12 loaves represent all God's people sustained by Christ. Bread replaced on Sabbath—resurrection morning brings fresh bread. Christ feeds His church perpetually.",
    believerApplication: "Feed on Christ daily. The Word is our bread. We are sustained in God's presence. Fellowship with believers (breaking bread) reflects this table.",
    keyVerses: ["Exodus 25:23-30", "Leviticus 24:5-9", "John 6:35", "John 6:48-51", "1 Corinthians 10:17"],
    relatedElements: ["lampstand", "altar-incense"],
    prophetic: "The Lord's Supper—communion with Christ and His body. The church as one loaf, many members."
  },
  {
    id: "altar-incense",
    name: "Altar of Incense",
    zone: "holy-place",
    category: "furniture",
    hebrewName: "Mizbeach HaKetoret",
    hebrewMeaning: "Altar of Fragrant Smoke",
    physicalDescription: "A small gold-covered acacia wood altar with horns on each corner, positioned before the veil separating the Holy Place from the Most Holy",
    dimensions: "1 cubit long × 1 cubit wide × 2 cubits high (1.5ft × 1.5ft × 3ft)",
    materials: ["Acacia wood", "Pure gold overlay", "Gold crown molding", "Gold rings and poles", "Special incense compound"],
    construction: "Small square altar of acacia wood covered with pure gold, with a gold crown around the top, four horns at corners, and rings with poles for transport",
    purpose: "The place where sacred incense was burned morning and evening, sending fragrant smoke before the veil—representing prayer ascending to God",
    priestlyService: "Morning and evening, priests burned the sacred incense compound (four ingredients in equal parts). Annual blood application on Day of Atonement. No strange incense or fire allowed.",
    christConnection: "Christ's intercession (Hebrews 7:25) and the prayers of saints (Revelation 8:3-4) rise like incense before God. Christ's prayers make ours acceptable. He stands nearest the throne, interceding.",
    believerApplication: "Prayer rises to God like incense. Pray without ceasing. Our prayers, offered through Christ, are a sweet aroma to God. Regular, consistent prayer life (morning and evening).",
    keyVerses: ["Exodus 30:1-10", "Exodus 37:25-28", "Psalm 141:2", "Luke 1:9-10", "Revelation 8:3-4"],
    relatedElements: ["lampstand", "table-showbread", "veil", "incense-compound"],
    prophetic: "Christ's ongoing intercession in the heavenly sanctuary. The prayers of saints filling golden bowls before God's throne."
  },
  {
    id: "veil",
    name: "The Veil",
    zone: "holy-place",
    category: "furniture",
    hebrewName: "Parochet",
    hebrewMeaning: "Curtain/Separator",
    physicalDescription: "A thick, intricately woven curtain of blue, purple, and scarlet yarn and fine linen, with cherubim embroidered on it, separating the Holy Place from the Most Holy Place",
    dimensions: "10 cubits wide × 10 cubits high (15ft × 15ft), approximately 4 inches thick",
    materials: ["Fine-twined linen", "Blue, purple, and scarlet yarn", "Embroidered cherubim", "Four gold-covered pillars", "Gold hooks"],
    construction: "Skillfully woven curtain with cherubim worked into the fabric, hung on gold hooks from four gold-covered acacia pillars set in silver sockets",
    purpose: "Separated the Holy Place from the Most Holy, limiting access to God's immediate presence. Only the high priest could pass through, and only once a year.",
    priestlyService: "The high priest passed through the veil only on the Day of Atonement, with blood and incense. The veil was a solemn barrier—violation meant death.",
    christConnection: "The veil is Christ's flesh (Hebrews 10:20). When Christ died, the temple veil tore from top to bottom (Matthew 27:51)—God opened access from heaven's side. The cherubim (guardians of God's presence) now welcome us through Christ.",
    believerApplication: "Through Christ we have bold access to God's presence (Hebrews 10:19). The barrier is removed. We enter the Most Holy Place by faith, not works.",
    keyVerses: ["Exodus 26:31-35", "Matthew 27:51", "Hebrews 10:19-22", "Hebrews 6:19-20"],
    relatedElements: ["ark-covenant", "mercy-seat", "altar-incense"],
    prophetic: "Christ's death opened heaven itself. The torn veil demonstrates that the old system ended—the new and living way is established."
  },

  // MOST HOLY PLACE ELEMENTS
  {
    id: "ark-covenant",
    name: "Ark of the Covenant",
    zone: "most-holy-place",
    category: "furniture",
    hebrewName: "Aron HaBrit",
    hebrewMeaning: "Chest of the Covenant",
    physicalDescription: "A gold-covered acacia wood chest containing the tablets of the law, Aaron's rod that budded, and a golden pot of manna, with a solid gold mercy seat on top",
    dimensions: "2.5 cubits long × 1.5 cubits wide × 1.5 cubits high (3.75ft × 2.25ft × 2.25ft)",
    materials: ["Acacia wood", "Pure gold overlay inside and out", "Gold crown molding", "Gold rings and poles", "Solid gold mercy seat and cherubim"],
    construction: "Acacia wood box overlaid with pure gold inside and outside, gold crown around top, gold rings at corners for gold-covered carrying poles (never removed), with solid gold mercy seat forming the lid",
    purpose: "God's throne on earth, His footstool, the place where heaven and earth met. The visible manifestation of God's presence (Shekinah) dwelt between the cherubim above the mercy seat.",
    priestlyService: "Only the high priest approached, only once a year, only with blood and incense. The ark was carried by Levites using poles—never touched directly. Its presence brought either blessing or judgment.",
    christConnection: "Christ is the true Ark—God dwelling among humanity. The contents: Law (He kept it perfectly), Manna (He is the bread from heaven), Aaron's rod (He is our resurrected High Priest). He is God's throne of grace.",
    believerApplication: "Christ dwells in us—we are His temple. The law is written on our hearts. We carry His presence wherever we go. He is both Judge and Savior.",
    keyVerses: ["Exodus 25:10-22", "Hebrews 9:4-5", "Romans 3:25", "1 John 2:2"],
    relatedElements: ["mercy-seat", "cherubim", "tablets-law", "aarons-rod", "manna-pot"],
    prophetic: "God's throne in heaven. Christ at the right hand of the Father. The final judgment proceeds from this throne."
  },
  {
    id: "mercy-seat",
    name: "The Mercy Seat",
    zone: "most-holy-place",
    category: "furniture",
    hebrewName: "Kapporet",
    hebrewMeaning: "Covering/Propitiation/Atonement-place",
    physicalDescription: "A solid gold slab forming the lid of the ark, with two cherubim of beaten gold at each end, their wings stretched upward and overshadowing the mercy seat, their faces looking toward each other and down at the mercy seat",
    dimensions: "2.5 cubits long × 1.5 cubits wide (3.75ft × 2.25ft), solid gold",
    materials: ["Pure solid gold", "Beaten gold cherubim"],
    construction: "Hammered from one piece of gold, with two cherubim rising from each end, wings spread upward forming an arch, faces gazing downward at where blood was sprinkled",
    purpose: "The place of propitiation—where blood was sprinkled to cover sin and where God's presence dwelt. Here mercy and judgment met. God spoke to Moses from between the cherubim.",
    priestlyService: "On the Day of Atonement, the high priest sprinkled blood on and before the mercy seat seven times—first for himself, then for all Israel. This satisfied God's justice and extended His mercy.",
    christConnection: "Christ IS our mercy seat/propitiation (Romans 3:25; 1 John 2:2). His blood covers the law we broke. The cherubim—who once barred Eden—now gaze at completed redemption. God's justice and mercy kiss at the cross.",
    believerApplication: "Come boldly to the throne of grace (Hebrews 4:16). Our sins are covered, not merely forgiven—they are propitiated. We stand before God as if we'd never sinned.",
    keyVerses: ["Exodus 25:17-22", "Leviticus 16:14-15", "Romans 3:25", "Hebrews 4:16", "1 John 2:2"],
    relatedElements: ["ark-covenant", "cherubim", "high-priest"],
    prophetic: "The Day of Atonement and Christ's final work in the heavenly sanctuary—cleansing the heavenly record of sin."
  },
  {
    id: "cherubim",
    name: "The Cherubim",
    zone: "most-holy-place",
    category: "furniture",
    hebrewName: "Keruvim",
    hebrewMeaning: "Celestial beings/Guardians",
    physicalDescription: "Two golden figures rising from each end of the mercy seat, with wings stretched upward forming an arch over the mercy seat, faces gazing downward",
    dimensions: "Made from the same piece as the mercy seat, wings forming protective canopy",
    materials: ["Pure beaten gold"],
    construction: "Hammered from the same piece of gold as the mercy seat, forming one unified structure",
    purpose: "Representing the heavenly beings that surround God's throne, guarding His holiness and witnessing His redemptive work",
    priestlyService: "Not served directly, but the high priest entered their presence once a year, symbolizing access to God's throne room",
    christConnection: "Cherubim guarded Eden (Genesis 3:24) but now look down at the blood-sprinkled mercy seat—redemption accomplished! They witness God's grace. Christ passed through the heavens, greater than all angelic beings.",
    believerApplication: "Angels desire to look into our salvation (1 Peter 1:12). The redemption we experience amazes celestial beings. We have access where angels stand guard.",
    keyVerses: ["Exodus 25:18-20", "Genesis 3:24", "Ezekiel 10:1-22", "1 Peter 1:12"],
    relatedElements: ["mercy-seat", "ark-covenant"]
  },

  // CONTENTS OF THE ARK
  {
    id: "tablets-law",
    name: "Tablets of the Law",
    zone: "most-holy-place",
    category: "vessel",
    hebrewName: "Luchot HaBrit",
    hebrewMeaning: "Tablets of the Covenant",
    physicalDescription: "Two stone tablets inscribed by God's own finger with the Ten Commandments—the second set, after Moses broke the first",
    dimensions: "Stone tablets—size not specified",
    materials: ["Stone", "Divine inscription"],
    construction: "Cut by Moses, inscribed by God. The first set was entirely God's work; these were a partnership—man's labor, God's inscription.",
    purpose: "The covenant terms between God and Israel—moral, ceremonial, and civil law summarized in ten words. Stored in the ark as the covenant document.",
    priestlyService: "Protected in the ark, read to the people every seven years, the basis for all worship and national life",
    christConnection: "Christ fulfilled every letter of the law (Matthew 5:17). He had the law within His heart (Psalm 40:8). He is the living Torah—the Word made flesh. The law under the mercy seat shows grace covering judgment.",
    believerApplication: "The law reveals our need for Christ. It is now written on our hearts (Jeremiah 31:33). We obey from love, not fear. The Spirit enables what the law demanded.",
    keyVerses: ["Exodus 31:18", "Exodus 34:1", "Deuteronomy 10:2-5", "Hebrews 8:10", "Romans 8:3-4"],
    relatedElements: ["ark-covenant", "mercy-seat"]
  },
  {
    id: "aarons-rod",
    name: "Aaron's Rod That Budded",
    zone: "most-holy-place",
    category: "vessel",
    hebrewName: "Matteh Aharon",
    hebrewMeaning: "Staff of Aaron",
    physicalDescription: "A dead almond branch that miraculously budded, blossomed, and produced ripe almonds overnight, confirming Aaron's priesthood",
    dimensions: "A shepherd's staff length",
    materials: ["Almond wood"],
    construction: "A natural staff that experienced supernatural life",
    purpose: "Permanently testified to God's choice of Aaron's line for the priesthood, silencing rebellion against divine appointments",
    priestlyService: "Kept in the ark as perpetual witness that only God appoints spiritual leaders. The rebellion of Korah was answered by resurrection power.",
    christConnection: "Christ's resurrection validates His priesthood forever (Hebrews 7:16). Dead wood bringing forth life pictures His resurrection. The almond (first to bloom in spring) represents resurrection. Christ is God's chosen High Priest.",
    believerApplication: "God validates His appointments through resurrection power. Trust His choices, not popular opinion. Life from death is God's signature move.",
    keyVerses: ["Numbers 17:1-11", "Hebrews 9:4", "Hebrews 7:16", "Romans 1:4"],
    relatedElements: ["ark-covenant", "mercy-seat"]
  },
  {
    id: "manna-pot",
    name: "Golden Pot of Manna",
    zone: "most-holy-place",
    category: "vessel",
    hebrewName: "Tzintsenet HaMan",
    hebrewMeaning: "Jar of Manna",
    physicalDescription: "A golden pot containing an omer of manna—the miraculous bread from heaven that sustained Israel for 40 years in the wilderness",
    dimensions: "Contained one omer (approximately 2 quarts) of manna",
    materials: ["Gold", "Preserved manna"],
    construction: "Golden container holding a sample of the daily bread from heaven",
    purpose: "Memorial of God's faithful provision—40 years of daily bread that never failed. Testimony to future generations of God's supernatural care.",
    priestlyService: "Preserved as perpetual reminder that man does not live by bread alone but by every word from God's mouth",
    christConnection: "Christ is the true manna—the bread from heaven (John 6:31-35). The hidden manna promised to overcomers (Revelation 2:17) suggests intimate communion with Christ. He sustains eternally.",
    believerApplication: "Daily dependence on Christ for spiritual nourishment. He is sufficient for every wilderness experience. Past faithfulness guarantees future provision.",
    keyVerses: ["Exodus 16:32-34", "Hebrews 9:4", "John 6:31-35", "Revelation 2:17"],
    relatedElements: ["ark-covenant", "mercy-seat"]
  }
];

// Priestly Garments
export const priestlyGarments: PriestlyGarment[] = [
  {
    id: "ephod",
    name: "The Ephod",
    hebrewName: "Ephod",
    hebrewMeaning: "Girded/Bound on",
    wornBy: "high-priest",
    materials: ["Gold thread", "Blue yarn", "Purple yarn", "Scarlet yarn", "Fine-twined linen"],
    colors: ["Gold", "Blue", "Purple", "Scarlet", "White"],
    description: "A sleeveless vest-like outer garment worn over the robe, with shoulder straps holding two onyx stones engraved with the names of the 12 tribes (6 per stone), connected by a waistband of the same materials",
    symbolism: "The high priest carried Israel on his shoulders—the place of strength and support. The five colors represent Christ's divine (gold), heavenly (blue), royal (purple), sacrificial (scarlet), and pure (white linen) nature.",
    christConnection: "Christ bears His people on His shoulders—the place of strength. 'I give them eternal life...no one can snatch them out of my hand.' He is our burden-bearer.",
    believerApplication: "We are engraved on Christ's heart and carried on His shoulders. We cannot be forgotten or dropped. His strength upholds us.",
    keyVerses: ["Exodus 28:6-14", "Exodus 39:2-7", "Isaiah 9:6", "Luke 15:5"]
  },
  {
    id: "breastplate",
    name: "Breastplate of Judgment",
    hebrewName: "Choshen Mishpat",
    hebrewMeaning: "Breastplate of Decision/Judgment",
    wornBy: "high-priest",
    materials: ["Gold thread", "Blue, purple, scarlet yarn", "Fine linen", "12 precious stones", "Gold settings"],
    colors: ["Multi-colored—each stone different"],
    description: "A square (span × span) pouch worn over the heart, set with 12 precious stones in gold settings, each engraved with a tribal name. Attached to the ephod, it contained the Urim and Thummim for discerning God's will.",
    symbolism: "Each of God's people is precious, unique, and close to His heart. The 12 different stones show diversity within unity. 'Judgment' relates to discerning God's will, not condemnation.",
    christConnection: "Christ carries His people on His heart—the place of love. He intercedes for us by name. Every believer is a precious jewel to Him, each uniquely beautiful.",
    believerApplication: "You are precious to God—unique, named, close to His heart. Christ doesn't just carry you; He treasures you. Your name is engraved forever.",
    keyVerses: ["Exodus 28:15-30", "Exodus 39:8-21", "Malachi 3:17", "Isaiah 49:16"]
  },
  {
    id: "robe-ephod",
    name: "Robe of the Ephod",
    hebrewName: "Me'il",
    hebrewMeaning: "Upper garment/Robe",
    wornBy: "high-priest",
    materials: ["Blue woven fabric", "Gold bells", "Pomegranate-shaped ornaments in blue, purple, and scarlet"],
    colors: ["All blue", "Gold bells", "Colored pomegranates"],
    description: "An all-blue seamless robe worn under the ephod, with a woven collar opening (not to be torn), and alternating golden bells and pomegranate ornaments around the hem",
    symbolism: "All blue—entirely heavenly. Seamless—Christ's unity. Bells—testimony heard. Pomegranates—fruitfulness. When the high priest ministered, the bells testified he was alive and working.",
    christConnection: "Christ's seamless robe (John 19:23). He is our heavenly intercessor. We can 'hear' His ministry continuing. His work produces fruit in us. He lives to intercede!",
    believerApplication: "Listen for the 'bells'—evidence of Christ's ongoing work. He is alive and active on your behalf right now. Fruitfulness accompanies genuine ministry.",
    keyVerses: ["Exodus 28:31-35", "Exodus 39:22-26", "John 19:23", "Hebrews 7:25"]
  },
  {
    id: "turban",
    name: "Turban with Gold Plate",
    hebrewName: "Mitznefet",
    hebrewMeaning: "Wrapped/Wound around",
    wornBy: "high-priest",
    materials: ["Fine linen", "Pure gold plate", "Blue cord"],
    colors: ["White linen", "Gold plate"],
    description: "A fine linen turban with a gold plate attached to the front by a blue cord. The plate was engraved with 'HOLINESS TO THE LORD' (Kodesh L'YHWH).",
    symbolism: "The mind consecrated to God. Holiness as the defining characteristic of approaching God. The plate bore Israel's iniquities regarding holy things—making their worship acceptable.",
    christConnection: "Christ is our holiness (1 Corinthians 1:30). His perfect holiness makes our imperfect worship acceptable. 'Holiness to the Lord'—His dedication was complete.",
    believerApplication: "Renew your mind. Present your thoughts to God. Christ's holiness covers your imperfect worship. You can approach God because He has made you holy.",
    keyVerses: ["Exodus 28:36-38", "Exodus 39:30-31", "1 Corinthians 1:30", "Hebrews 2:11"]
  },
  {
    id: "linen-tunic",
    name: "Linen Tunic",
    hebrewName: "Ketonet",
    hebrewMeaning: "Coat/Tunic",
    wornBy: "both",
    materials: ["Fine-twined linen"],
    colors: ["White"],
    description: "A full-length checkered (woven in a pattern) undergarment of fine white linen, worn by both high priest and common priests as the foundational garment",
    symbolism: "Righteousness as the foundation of all ministry. Pure white linen represents the righteous acts of the saints. The innermost garment—closest to the person.",
    christConnection: "Christ is our righteousness (Jeremiah 23:6). His righteous life clothes us. The fine linen of Revelation 19:8—the bride's wedding garment—represents Christ's righteousness credited to us.",
    believerApplication: "Be clothed with Christ's righteousness. Your own works are filthy rags; His righteousness is pure white linen. This is your foundational covering.",
    keyVerses: ["Exodus 28:39", "Exodus 39:27", "Isaiah 64:6", "Revelation 19:8"]
  },
  {
    id: "linen-sash",
    name: "Linen Sash",
    hebrewName: "Avnet",
    hebrewMeaning: "Belt/Girdle",
    wornBy: "both",
    materials: ["Fine linen", "Blue, purple, and scarlet needlework"],
    colors: ["White with blue, purple, and scarlet"],
    description: "An embroidered belt worn around the waist over the tunic, binding the garments for service",
    symbolism: "Service readiness—girding the loins meant preparing for action. The belt holds all together, enabling effective work. Truth and faithfulness 'gird the loins.'",
    christConnection: "Christ girded Himself with a towel to wash feet—ultimate servant. 'Righteousness shall be the girdle of his loins, and faithfulness the girdle of his reins' (Isaiah 11:5).",
    believerApplication: "Gird up the loins of your mind. Be ready to serve. Stand with truth as your belt (Ephesians 6:14). Be prepared for action.",
    keyVerses: ["Exodus 28:39", "Exodus 39:29", "Isaiah 11:5", "Ephesians 6:14", "1 Peter 1:13"]
  },
  {
    id: "linen-breeches",
    name: "Linen Undergarments",
    hebrewName: "Miknesayim",
    hebrewMeaning: "Coverings",
    wornBy: "both",
    materials: ["Fine linen"],
    colors: ["White"],
    description: "Linen undergarments covering from waist to thighs, worn for modesty and to cover nakedness when ascending altar steps",
    symbolism: "Covering of shame and human weakness. The flesh must be covered in God's presence. Modesty in service—no exposure of human nature.",
    christConnection: "Christ covers our shame completely. Adam's nakedness in the Garden required covering; Christ provides complete covering. His righteousness covers all.",
    believerApplication: "Let Christ cover your shame. Don't expose your flesh in ministry—keep self hidden. Modesty in service honors God.",
    keyVerses: ["Exodus 28:42-43", "Exodus 39:28", "Genesis 3:21", "Revelation 3:18"]
  }
];

// Sanctuary Services
export const sanctuaryServices: SanctuaryService[] = [
  {
    id: "daily-morning",
    name: "Morning Sacrifice (Tamid)",
    hebrewName: "Tamid Shel Shachar",
    frequency: "daily",
    timing: "At sunrise, before any other offering",
    zone: "courtyard",
    description: "The first sacrifice each day—a year-old lamb without blemish offered as a whole burnt offering, accompanied by grain and drink offerings",
    procedure: [
      "Priests cast lots to determine duties",
      "Lamb inspected for blemishes",
      "Lamb slaughtered on the north side of the altar",
      "Blood caught and sprinkled on altar sides",
      "Lamb prepared and laid on altar fire",
      "Grain offering (fine flour with oil) offered",
      "Drink offering (wine) poured out",
      "Incense burned in the Holy Place",
      "Lamps trimmed",
      "Priestly blessing pronounced"
    ],
    offerings: ["Year-old lamb", "Tenth of ephah flour", "Quarter hin of oil", "Quarter hin of wine"],
    priestlyRole: "Multiple priests participated in choreographed service—each with assigned role based on lot casting",
    christFulfillment: "Christ, the Lamb of God, offered Himself at the morning hour (9 AM crucifixion). He is the perpetual sacrifice—always before the Father. The drink offering poured out pictures His blood poured out.",
    believerApplication: "Begin each day presenting yourself to God. Morning devotion before daily activities. Let your first thoughts and actions be consecrated to God.",
    keyVerses: ["Exodus 29:38-42", "Numbers 28:3-8", "Mark 15:25", "Romans 12:1"],
    relatedServices: ["daily-evening", "incense-morning"]
  },
  {
    id: "daily-evening",
    name: "Evening Sacrifice (Tamid)",
    hebrewName: "Tamid Bein Ha'Arbayim",
    frequency: "daily",
    timing: "Between the evenings (3 PM/ninth hour)",
    zone: "courtyard",
    description: "Mirror of the morning sacrifice, completing the daily cycle. At 3 PM, as the evening lamb was offered, Christ died on the cross.",
    procedure: [
      "Identical to morning service",
      "Second lamb slaughtered",
      "Blood applied to altar",
      "Lamb burned completely",
      "Grain and drink offerings",
      "Evening incense",
      "Lamps lit for the night",
      "Gates closed"
    ],
    offerings: ["Year-old lamb", "Tenth of ephah flour", "Quarter hin of oil", "Quarter hin of wine"],
    priestlyRole: "Evening shift of priests conducted identical service, ensuring perpetual worship",
    christFulfillment: "Christ died at the ninth hour (3 PM)—exactly when the evening lamb was slain (Matthew 27:46). His death coincided precisely with the sanctuary service. 'It is finished' as the lamb was offered.",
    believerApplication: "End each day with reflection and worship. Examine the day's actions. Close with prayer and commitment.",
    keyVerses: ["Exodus 29:38-42", "Numbers 28:3-8", "Matthew 27:46", "Luke 23:44-46"],
    relatedServices: ["daily-morning", "incense-evening"]
  },
  {
    id: "incense-morning",
    name: "Morning Incense",
    hebrewName: "Ketoret Shel Shachar",
    frequency: "daily",
    timing: "After the morning lamb was laid on the altar, before the sacrifice was burned",
    zone: "holy-place",
    description: "The burning of sacred incense on the golden altar, filling the Holy Place with fragrant smoke that rose toward the veil and the Most Holy Place",
    procedure: [
      "Priest selected by lot (once-in-lifetime privilege)",
      "Coals taken from altar of burnt offering",
      "Coals placed on incense altar",
      "Special incense compound poured on coals",
      "Priest prostrated while incense rose",
      "People prayed outside during this time"
    ],
    offerings: ["Sacred incense compound (stacte, onycha, galbanum, frankincense in equal parts)"],
    priestlyRole: "The most sacred regular priestly function—Zacharias was burning incense when Gabriel appeared (Luke 1:9-11)",
    christFulfillment: "Christ's prayers and intercession rise before the Father continually (Hebrews 7:25). He adds His merit to our prayers (Revelation 8:3-4). His advocacy makes our prayers acceptable.",
    believerApplication: "Morning prayer—a sacred privilege. Your prayers rise to God. Christ's intercession backs your petitions. Prayer is precious, not routine.",
    keyVerses: ["Exodus 30:7-8", "Psalm 141:2", "Luke 1:9-11", "Revelation 8:3-4"],
    relatedServices: ["daily-morning", "incense-evening"]
  },
  {
    id: "sabbath-service",
    name: "Sabbath Service",
    hebrewName: "Korban HaShabbat",
    frequency: "weekly",
    timing: "Every seventh day, in addition to daily offerings",
    zone: "courtyard",
    description: "Double the daily offering plus changing of the showbread in the Holy Place. The Sabbath was marked by increased worship, not decreased.",
    procedure: [
      "Regular morning and evening tamid",
      "Additional two lambs offered",
      "Extra grain and drink offerings",
      "Showbread replaced with 12 fresh loaves",
      "Old showbread eaten by priests in holy place",
      "Frankincense from old showbread burned"
    ],
    offerings: ["2 additional lambs", "Two-tenths ephah flour", "Half hin oil", "Half hin wine", "12 fresh loaves of showbread"],
    priestlyRole: "All priests participated. The course changing (24 courses rotating) occurred at Sabbath.",
    christFulfillment: "Christ is Lord of the Sabbath (Matthew 12:8). He offers Himself doubly—abundance of rest in Him. The fresh showbread weekly pictures His resurrection bringing fresh bread every Lord's Day.",
    believerApplication: "Sabbath is enhanced worship, not absence of worship. Give God your best day. Double your devotion, not your rest from Him.",
    keyVerses: ["Numbers 28:9-10", "Leviticus 24:5-9", "Matthew 12:8", "Hebrews 4:9-10"],
    relatedServices: ["daily-morning", "daily-evening", "showbread-service"]
  },
  {
    id: "new-moon",
    name: "New Moon Service",
    hebrewName: "Rosh Chodesh",
    frequency: "monthly",
    timing: "First day of each lunar month, determined by new moon sighting",
    zone: "courtyard",
    description: "Special offerings marking the beginning of each new month, with trumpet blowing and celebration. More elaborate than Sabbath but less than annual feasts.",
    procedure: [
      "Two young bulls, one ram, seven lambs offered",
      "One male goat for sin offering",
      "Corresponding grain offerings with each animal",
      "Trumpets blown in celebration",
      "Announcement of new month"
    ],
    offerings: ["2 young bulls", "1 ram", "7 yearling lambs", "1 male goat", "Grain offerings", "Drink offerings"],
    priestlyRole: "Full contingent of priests involved. Trumpets blown by priests. Month-long calendar established.",
    christFulfillment: "Christ is the beginning of a new era—new creation, new covenant, new month in God's calendar. His resurrection marks the 'new moon' of the gospel age.",
    believerApplication: "Mark new beginnings with worship. Start fresh cycles with dedication. Let God establish your times and seasons.",
    keyVerses: ["Numbers 28:11-15", "Psalm 81:3", "Colossians 2:16", "Isaiah 66:23"],
    relatedServices: ["sabbath-service", "daily-morning"]
  },
  {
    id: "day-of-atonement",
    name: "Day of Atonement",
    hebrewName: "Yom Kippur",
    frequency: "annual",
    timing: "Tenth day of seventh month (Tishri)",
    zone: "most-holy-place",
    description: "The most solemn day of the year—the only time the high priest entered the Most Holy Place. Complete cleansing of the sanctuary and removal of Israel's sins.",
    procedure: [
      "High priest bathes and puts on white linen (not golden garments)",
      "Offers bull for himself and his household",
      "Takes incense and coals into Most Holy Place—smoke covers mercy seat",
      "Returns to get bull's blood, sprinkles on and before mercy seat",
      "Casts lots over two goats—one for LORD, one for Azazel",
      "Slaughters LORD's goat, brings blood into Most Holy Place",
      "Sprinkles blood on mercy seat and before it",
      "Cleanses the Holy Place and altar of incense",
      "Cleanses the altar of burnt offering",
      "Lays hands on live goat, confesses all Israel's sins",
      "Scapegoat led to wilderness and released",
      "High priest bathes, puts on golden garments, offers final offerings"
    ],
    offerings: ["1 bull for high priest", "2 goats for Israel", "2 rams as burnt offerings"],
    priestlyRole: "High priest alone performed most of the service. No one else could be in the tabernacle. Life or death moment for the high priest.",
    christFulfillment: "Christ entered the true Most Holy Place once for all with His own blood (Hebrews 9:12). He is both the sacrifice (LORD's goat) and the scapegoat (bearing sins away). His work cleanses the heavenly sanctuary.",
    believerApplication: "Examine yourself. Afflict your soul through genuine repentance. Know that Christ has entered heaven itself on your behalf. His blood speaks for you.",
    keyVerses: ["Leviticus 16:1-34", "Leviticus 23:27-32", "Hebrews 9:7-14", "Hebrews 9:24-28"],
    relatedServices: ["incense-morning", "sin-offering"]
  }
];

// Offerings
export const sanctuaryOfferings: SanctuaryOffering[] = [
  {
    id: "burnt-offering",
    name: "Burnt Offering",
    hebrewName: "Olah",
    hebrewMeaning: "Ascending/Going up",
    type: "blood",
    category: "voluntary",
    purpose: "Complete dedication to God—the entire animal consumed, representing total surrender and consecration",
    description: "A voluntary offering expressing worship and complete dedication. The entire animal (except the skin) was burned on the altar, ascending as a 'pleasing aroma' to God.",
    animalOrMaterial: ["Bull (wealthy)", "Sheep/goat (moderate)", "Turtledove/pigeon (poor)"],
    procedure: [
      "Offerer brings animal to tabernacle entrance",
      "Lays hand on animal's head (identification/transfer)",
      "Offerer slaughters the animal",
      "Priest catches and sprinkles blood on altar sides",
      "Offerer skins and cuts animal into pieces",
      "Priest arranges pieces on altar fire",
      "Entire animal consumed by fire (except skin)"
    ],
    whoOffers: "Any Israelite—voluntary expression of worship and dedication",
    whenOffered: "At will for personal worship; required at feasts; daily morning and evening tamid",
    priestPortion: "Skin only (given to officiating priest)",
    offererPortion: "Nothing—everything goes up to God",
    christTypology: "Christ offered Himself wholly to God (Hebrews 10:5-7). His entire life was 'ascending' worship—completely dedicated to the Father's will. Nothing held back.",
    spiritualLesson: "Total surrender is the foundation of relationship with God. Give everything—not just the parts you're willing to sacrifice. Romans 12:1 living sacrifice.",
    keyVerses: ["Leviticus 1:1-17", "Hebrews 10:5-7", "Romans 12:1", "Ephesians 5:2"]
  },
  {
    id: "grain-offering",
    name: "Grain Offering",
    hebrewName: "Minchah",
    hebrewMeaning: "Gift/Tribute/Present",
    type: "non-blood",
    category: "voluntary",
    purpose: "Thanksgiving for God's provision—acknowledging that all sustenance comes from Him",
    description: "An offering of fine flour, unleavened bread, or roasted grain, mixed with oil and frankincense. Represents daily labor offered to God—the work of human hands.",
    animalOrMaterial: ["Fine flour with oil and frankincense", "Unleavened cakes baked with oil", "Roasted grain with oil and frankincense"],
    procedure: [
      "Offerer brings flour/cakes to priest",
      "Salt added (covenant salt)",
      "No leaven or honey (no corruption or artificial sweetness)",
      "Priest takes memorial portion (handful)",
      "Memorial portion burned on altar",
      "Remainder belongs to priests"
    ],
    whoOffers: "Any Israelite—often accompanied burnt offering or as independent thanksgiving",
    whenOffered: "Voluntary thanksgiving; accompanies burnt and peace offerings; daily with tamid",
    priestPortion: "All but the memorial portion—eaten in the court by male priests",
    offererPortion: "Nothing—given entirely to God and His servants",
    christTypology: "Christ's perfect life—fine flour (even consistency), mixed with oil (Spirit-filled), with frankincense (prayer life), no leaven (no sin). His humanity was perfectly refined and dedicated.",
    spiritualLesson: "Offer your daily work to God. Every labor can be worship. Let your life be a consistent, Spirit-filled offering of gratitude.",
    keyVerses: ["Leviticus 2:1-16", "Leviticus 6:14-23", "Hebrews 10:5", "Romans 12:1"]
  },
  {
    id: "peace-offering",
    name: "Peace Offering",
    hebrewName: "Shelamim",
    hebrewMeaning: "Peace/Completeness/Well-being",
    type: "blood",
    category: "voluntary",
    purpose: "Communion and fellowship with God and others—a shared meal celebrating relationship",
    description: "The only offering where the offerer ate part of the sacrifice. A celebration meal shared with God (fat portions burned), priests (breast and thigh), and the offerer's family and guests.",
    animalOrMaterial: ["Bull (male or female)", "Sheep (male or female)", "Goat (male or female)", "No birds—must be shared"],
    procedure: [
      "Offerer brings animal without defect",
      "Lays hand on animal's head",
      "Offerer slaughters at tabernacle entrance",
      "Priest sprinkles blood on altar sides",
      "Fat portions and organs burned on altar",
      "Breast waved before LORD (wave offering)",
      "Right thigh given to priest (heave offering)",
      "Remaining meat eaten by offerer's family in designated clean place",
      "Thanksgiving offering: eaten same day",
      "Vow or freewill: eaten within two days"
    ],
    whoOffers: "Any Israelite—most joyful offering, accompanied by celebration",
    whenOffered: "Thanksgiving for answered prayer; fulfillment of vows; freewill expression of gratitude",
    priestPortion: "Breast and right thigh",
    offererPortion: "Remaining edible meat—shared with family and guests",
    christTypology: "Christ is our peace (Ephesians 2:14). Through Him we have fellowship with God and each other. The Lord's Supper reflects this shared meal—communion with God through Christ's sacrifice.",
    spiritualLesson: "Worship includes celebration and fellowship. God invites you to His table. Share your blessing with others. Peace with God enables peace with others.",
    keyVerses: ["Leviticus 3:1-17", "Leviticus 7:11-34", "Ephesians 2:14", "1 Corinthians 10:16-18"]
  },
  {
    id: "sin-offering",
    name: "Sin Offering",
    hebrewName: "Chatat",
    hebrewMeaning: "Sin/Sin-offering/Purification",
    type: "blood",
    category: "mandatory",
    purpose: "Purification from unintentional sins—restoring relationship broken by inadvertent transgression",
    description: "Required when someone sinned unintentionally against God's commands. The blood was applied differently based on the sinner's status, purifying the sanctuary from the contamination caused by sin.",
    animalOrMaterial: ["Bull for high priest or congregation", "Male goat for leader", "Female goat or lamb for common person", "Two turtledoves for poor", "Flour for very poor"],
    procedure: [
      "Sinner brings appropriate animal",
      "Lays hand on head (confession and transfer)",
      "Sinner slaughters animal",
      "Blood application varies by status:",
      "  - High priest/congregation: blood sprinkled seven times before veil, applied to incense altar horns, poured at burnt altar base",
      "  - Leader/common person: blood applied to burnt altar horns, poured at base",
      "Fat burned on altar",
      "For high priest/congregation: remainder burned outside camp",
      "For leader/commoner: priests eat meat in holy place"
    ],
    whoOffers: "Anyone who has sinned unintentionally—required, not voluntary",
    whenOffered: "When sin is realized; special times (new moons, feasts); Day of Atonement",
    priestPortion: "Priests eat meat for leader's and commoner's sin offerings (in holy place)",
    offererPortion: "Nothing—sin offerings are not celebratory",
    christTypology: "Christ 'became sin for us' (2 Corinthians 5:21). He was burned 'outside the camp'—crucified outside Jerusalem. His blood purifies the heavenly sanctuary and our conscience.",
    spiritualLesson: "Even unintentional sins require atonement. We are responsible for what we didn't know we did. Sin contaminates everything—but blood cleanses. Confess specifically.",
    keyVerses: ["Leviticus 4:1-35", "Leviticus 6:24-30", "2 Corinthians 5:21", "Hebrews 13:11-12"]
  },
  {
    id: "guilt-offering",
    name: "Guilt/Trespass Offering",
    hebrewName: "Asham",
    hebrewMeaning: "Guilt/Restitution/Compensation",
    type: "blood",
    category: "mandatory",
    purpose: "Restitution for specific trespasses—sins requiring compensation to God or neighbor",
    description: "Required for specific violations: misuse of holy things, deception, theft, false oath. Unique in requiring restitution of principal plus one-fifth to the wronged party.",
    animalOrMaterial: ["Ram without blemish", "Monetary equivalent valued by priest in certain cases"],
    procedure: [
      "Restitution made first: principal + 20% to wronged party",
      "If victim cannot be found, restitution goes to priest",
      "Ram brought to tabernacle",
      "Offerer lays hand on ram's head",
      "Ram slaughtered",
      "Blood sprinkled on altar sides",
      "Fat portions burned",
      "Meat eaten by priests in holy place"
    ],
    whoOffers: "One who has trespassed against sacred things or defrauded neighbor",
    whenOffered: "When guilt is realized or proven; before full fellowship can be restored",
    priestPortion: "All the meat—most holy, eaten in holy place",
    offererPortion: "Nothing",
    christTypology: "Christ is our 'guilt offering' (Isaiah 53:10). He made restitution for what we stole from God (glory, obedience). He paid the principal plus interest—we get back more than Adam lost.",
    spiritualLesson: "Make restitution where possible. Repentance includes making things right. Some sins have earthly consequences that require earthly restoration. God values integrity with neighbors.",
    keyVerses: ["Leviticus 5:14-6:7", "Leviticus 7:1-7", "Isaiah 53:10", "1 Peter 2:24"]
  }
];

// Helper Functions
export const getSanctuaryElementsByZone = (zone: SanctuaryZone): SanctuaryElement[] => {
  return sanctuaryElements.filter(e => e.zone === zone);
};

export const getGarmentsByWho = (who: "high-priest" | "common-priest" | "both"): PriestlyGarment[] => {
  if (who === "both") return priestlyGarments;
  return priestlyGarments.filter(g => g.wornBy === who || g.wornBy === "both");
};

export const getServicesByFrequency = (freq: SanctuaryService["frequency"]): SanctuaryService[] => {
  return sanctuaryServices.filter(s => s.frequency === freq);
};

export const getOfferingsByType = (type: SanctuaryOffering["type"]): SanctuaryOffering[] => {
  return sanctuaryOfferings.filter(o => o.type === type);
};

export const searchSanctuary = (query: string): {
  elements: SanctuaryElement[];
  garments: PriestlyGarment[];
  services: SanctuaryService[];
  offerings: SanctuaryOffering[];
} => {
  const lowerQuery = query.toLowerCase();

  return {
    elements: sanctuaryElements.filter(e =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.purpose.toLowerCase().includes(lowerQuery) ||
      e.christConnection.toLowerCase().includes(lowerQuery) ||
      e.keyVerses.some(v => v.toLowerCase().includes(lowerQuery))
    ),
    garments: priestlyGarments.filter(g =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.symbolism.toLowerCase().includes(lowerQuery) ||
      g.christConnection.toLowerCase().includes(lowerQuery)
    ),
    services: sanctuaryServices.filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.christFulfillment.toLowerCase().includes(lowerQuery)
    ),
    offerings: sanctuaryOfferings.filter(o =>
      o.name.toLowerCase().includes(lowerQuery) ||
      o.purpose.toLowerCase().includes(lowerQuery) ||
      o.christTypology.toLowerCase().includes(lowerQuery)
    )
  };
};

export const getTotalSanctuaryItems = (): number => {
  return sanctuaryElements.length + priestlyGarments.length + sanctuaryServices.length + sanctuaryOfferings.length;
};
