import type { CharacterProfile, Era } from "@/data/biblicalCharacterProfiles";

const eraEnvironments: Record<Era, string> = {
  Creation: "primordial garden landscape, lush ancient vegetation, dawn light",
  Patriarchs: "ancient Mesopotamian desert, nomadic tents, starlit sky",
  Exodus: "Egyptian architecture, desert wilderness, dramatic sky",
  Conquest: "rocky Canaanite hillsides, fortified ancient cities",
  Judges: "rustic Israelite settlement, olive groves, rough terrain",
  "United Kingdom": "ancient Jerusalem, royal palace, ornate stone architecture",
  "Divided Kingdom": "divided ancient city, temple courtyards, political tension",
  Exile: "Babylonian cityscape, rivers of Babylon, foreign architecture",
  "Post-Exile": "rebuilt Jerusalem walls, Persian-influenced architecture",
  Intertestamental: "Hellenistic architecture blending with ancient Near Eastern style",
  Gospels: "Roman-era Palestine, dusty roads, Sea of Galilee, olive trees",
  "Early Church": "Roman Mediterranean city, early house churches, ancient ports",
};

const testamentClothing: Record<string, string> = {
  Creation: "simple linen garments, natural fibers",
  Patriarchs: "layered wool robes, leather sandals, head coverings",
  Exodus: "Egyptian-influenced linen garments, Hebrew slave clothing or priestly vestments",
  Conquest: "leather armor over tunics, bronze weapons, warrior attire",
  Judges: "rough tribal clothing, leather belts, simple homespun garments",
  "United Kingdom": "royal robes, fine linen, gold jewelry, crown or headdress",
  "Divided Kingdom": "ornate robes with embroidery, prophetic cloaks, royal garments",
  Exile: "Babylonian or Persian influenced clothing, mixed cultural dress",
  "Post-Exile": "Persian court clothing or rebuilt Hebrew priestly garments",
  Intertestamental: "Hellenistic robes blending with Jewish tradition",
  Gospels: "simple homespun tunics, Roman-era Palestinian dress, leather sandals",
  "Early Church": "Roman-era tunics and cloaks, simple traveling garments",
};

const femaleIndicators = new Set([
  "Matriarch", "Queen", "Wife", "Mother", "Prophetess", "Servant Girl",
  "Judge", // Deborah
]);

const femaleNames = new Set([
  "eve", "sarah", "rebekah", "rachel", "leah", "miriam", "deborah",
  "ruth", "hannah", "abigail", "bathsheba", "esther", "jezebel",
  "mary-mother", "mary-magdalene", "martha", "mary-of-bethany",
  "elizabeth", "priscilla", "lydia", "rahab", "delilah", "hagar",
  "naomi", "tamar", "jochebed", "zipporah", "michal", "rizpah",
  "huldah", "anna-prophetess", "sapphira", "dorcas", "phoebe",
  "eunice", "lois", "claudia", "nympha", "apphia",
]);

function inferGender(character: CharacterProfile): "man" | "woman" {
  const id = character.id.toLowerCase();
  if (femaleNames.has(id)) return "woman";

  const role = character.role.toLowerCase();
  if (role.includes("wife") || role.includes("mother") || role.includes("queen") ||
      role.includes("prophetess") || role.includes("matriarch") || role.includes("woman") ||
      role.includes("sister") || role.includes("daughter") || role.includes("midwife") ||
      role.includes("nurse") || role.includes("widow")) {
    return "woman";
  }

  if (character.archetypes.includes("Matriarch")) return "woman";

  return "man";
}

function inferAge(character: CharacterProfile): string {
  const role = character.role.toLowerCase();
  const name = character.name.toLowerCase();

  if (role.includes("boy") || role.includes("youth") || role.includes("child") ||
      role.includes("young")) {
    return "young";
  }
  if (role.includes("elder") || role.includes("aged") || name.includes("methuselah") ||
      name.includes("simeon") || name.includes("anna")) {
    return "elderly";
  }
  return "middle-aged";
}

export function buildCharacterPortraitPrompt(character: CharacterProfile): string {
  const gender = inferGender(character);
  const age = inferAge(character);
  const environment = eraEnvironments[character.era] || "ancient Near Eastern setting";
  const clothing = testamentClothing[character.era] || "ancient Near Eastern clothing";

  const roleContext = character.role;
  const primaryArchetype = character.archetypes[0] || "figure";

  return `Create a photorealistic cinematic portrait of ${character.name}, a biblical ${gender} — ${roleContext}.

SUBJECT: A ${age} ancient Near Eastern ${gender} with historically accurate Semitic features — olive to deep brown skin, dark curly or wavy hair, brown eyes, strong facial features. This is NOT a European medieval depiction. This person looks authentically ancient Levantine/Mesopotamian.

EXPRESSION & POSE: The expression and posture should reflect their character as a ${primaryArchetype}: ${character.quickCard.mindset}. Head-and-shoulders portrait, slight three-quarter turn, looking into camera or slightly past it with intensity.

CLOTHING: ${clothing}, appropriate for their role as ${roleContext}.

ENVIRONMENT: Softly blurred background suggesting ${environment}. Cinematic depth of field.

LIGHTING: Golden hour or dramatic directional lighting. Rich warm tones. Rembrandt-style lighting with deep shadows and luminous highlights on skin.

STYLE: Photorealistic, cinematic, 8K quality. Think Ridley Scott's "Exodus" or "Kingdom of Heaven" cinematography meets National Geographic portrait photography. NOT cartoonish, NOT stylized, NOT AI-looking. No text, no watermarks, no borders.`;
}
