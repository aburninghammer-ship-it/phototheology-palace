import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// All 70 hardcoded Strong's entries
const ALL_STRONGS = [
  { number: "G2316", word: "θεός", transliteration: "theos", pronunciation: "theh'-os", language: "Greek", definition: "A deity, especially the supreme Divinity", usage: ["God", "god", "godly"], occurrences: 1343 },
  { number: "G25", word: "ἀγαπάω", transliteration: "agapaō", pronunciation: "ag-ap-ah'-o", language: "Greek", definition: "To love (in a social or moral sense)", usage: ["love", "beloved"], occurrences: 143 },
  { number: "G2889", word: "κόσμος", transliteration: "kosmos", pronunciation: "kos'-mos", language: "Greek", definition: "Orderly arrangement, the world, universe", usage: ["world", "adorning"], occurrences: 186 },
  { number: "G1325", word: "δίδωμι", transliteration: "didōmi", pronunciation: "did'-o-mee", language: "Greek", definition: "To give, bestow", usage: ["give", "bestow", "grant", "commit"], occurrences: 415 },
  { number: "G3439", word: "μονογενής", transliteration: "monogenēs", pronunciation: "mon-og-en-ace'", language: "Greek", definition: "Only-born, only-begotten, unique", usage: ["only begotten", "only"], occurrences: 9 },
  { number: "G5207", word: "υἱός", transliteration: "huios", pronunciation: "hwee-os'", language: "Greek", definition: "A son (literal or figurative)", usage: ["son", "child"], occurrences: 382 },
  { number: "G4100", word: "πιστεύω", transliteration: "pisteuō", pronunciation: "pist-yoo'-o", language: "Greek", definition: "To have faith, believe, trust", usage: ["believe", "commit unto", "trust"], occurrences: 248 },
  { number: "G2222", word: "ζωή", transliteration: "zōē", pronunciation: "dzo-ay'", language: "Greek", definition: "Life, both physical and spiritual", usage: ["life", "lifetime"], occurrences: 135 },
  { number: "G166", word: "αἰώνιος", transliteration: "aiōnios", pronunciation: "ahee-o'-nee-os", language: "Greek", definition: "Perpetual, eternal", usage: ["eternal", "everlasting", "forever"], occurrences: 71 },
  { number: "G444", word: "ἄνθρωπος", transliteration: "anthrōpos", pronunciation: "anth'-ro-pos", language: "Greek", definition: "A human being, man, mankind", usage: ["man", "mankind", "person"], occurrences: 550 },
  { number: "G1080", word: "γεννάω", transliteration: "gennaō", pronunciation: "ghen-nah'-o", language: "Greek", definition: "To beget, bring forth, be born", usage: ["beget", "bear", "be born"], occurrences: 97 },
  { number: "G509", word: "ἄνωθεν", transliteration: "anōthen", pronunciation: "an'-o-then", language: "Greek", definition: "From above, again, anew", usage: ["from above", "again", "from the beginning"], occurrences: 13 },
  { number: "G1492", word: "εἴδω", transliteration: "eidō", pronunciation: "i'-do", language: "Greek", definition: "To see, perceive, know", usage: ["see", "behold", "know"], occurrences: 666 },
  { number: "G932", word: "βασιλεία", transliteration: "basileia", pronunciation: "bas-il-i'-ah", language: "Greek", definition: "Royal power, kingdom, reign", usage: ["kingdom", "reign"], occurrences: 162 },
  { number: "G746", word: "ἀρχή", transliteration: "archē", pronunciation: "ar-khay'", language: "Greek", definition: "Beginning, origin, first", usage: ["beginning", "principality", "rule"], occurrences: 58 },
  { number: "G3056", word: "λόγος", transliteration: "logos", pronunciation: "log'-os", language: "Greek", definition: "Word, speech, divine utterance", usage: ["word", "saying", "speech"], occurrences: 330 },
  { number: "G3598", word: "ὁδός", transliteration: "hodos", pronunciation: "hod-os'", language: "Greek", definition: "A way, road, journey", usage: ["way", "road", "journey"], occurrences: 101 },
  { number: "G225", word: "ἀλήθεια", transliteration: "alētheia", pronunciation: "al-ay'-thi-a", language: "Greek", definition: "Truth, reality, sincerity", usage: ["truth", "truly", "verity"], occurrences: 109 },
  { number: "G3962", word: "πατήρ", transliteration: "patēr", pronunciation: "pat-ayr'", language: "Greek", definition: "A father, ancestor", usage: ["father", "parent"], occurrences: 413 },
  { number: "H7225", word: "רֵאשִׁית", transliteration: "re'shiyth", pronunciation: "ray-sheeth'", language: "Hebrew", definition: "The first, beginning, best, chief", usage: ["beginning", "firstfruit", "chief"], occurrences: 51 },
  { number: "H430", word: "אֱלֹהִים", transliteration: "elohiym", pronunciation: "el-o-heem'", language: "Hebrew", definition: "Gods, God, judges, angels", usage: ["God", "gods", "judges"], occurrences: 2606 },
  { number: "H1254", word: "בָּרָא", transliteration: "bara'", pronunciation: "baw-raw'", language: "Hebrew", definition: "To create, shape, form", usage: ["create", "creator", "choose"], occurrences: 54 },
  { number: "H8064", word: "שָׁמַיִם", transliteration: "shamayim", pronunciation: "shaw-mah'-yim", language: "Hebrew", definition: "Heaven, heavens, sky", usage: ["heaven", "air", "sky"], occurrences: 420 },
  { number: "H776", word: "אֶרֶץ", transliteration: "erets", pronunciation: "eh'-rets", language: "Hebrew", definition: "Earth, land, country", usage: ["land", "earth", "country"], occurrences: 2505 },
  { number: "H3068", word: "יְהוָה", transliteration: "YHWH", pronunciation: "yeh-ho-vaw'", language: "Hebrew", definition: "The LORD, Jehovah", usage: ["LORD", "GOD"], occurrences: 6828 },
  { number: "H7462", word: "רָעָה", transliteration: "ra'ah", pronunciation: "raw-aw'", language: "Hebrew", definition: "To pasture, tend, graze", usage: ["feed", "shepherd", "pastor"], occurrences: 173 },
  { number: "H3808", word: "לֹא", transliteration: "lo'", pronunciation: "lo", language: "Hebrew", definition: "Not, no", usage: ["not", "no", "none"], occurrences: 5188 },
  { number: "H2637", word: "חָסֵר", transliteration: "chaser", pronunciation: "khaw-sare'", language: "Hebrew", definition: "To lack, need, be lacking", usage: ["lack", "want", "decrease"], occurrences: 23 },
  { number: "H2490", word: "חָלַל", transliteration: "chalal", pronunciation: "khaw-lal'", language: "Hebrew", definition: "To profane, defile, pollute", usage: ["profane", "defile", "pollute"], occurrences: 135 },
  { number: "H6588", word: "פֶּשַׁע", transliteration: "pesha'", pronunciation: "peh'-shah", language: "Hebrew", definition: "Transgression, rebellion", usage: ["transgression", "trespass", "sin"], occurrences: 93 },
  { number: "H1792", word: "דָּכָא", transliteration: "daka'", pronunciation: "daw-kaw'", language: "Hebrew", definition: "To crush, be crushed", usage: ["crush", "break", "contrite"], occurrences: 18 },
  { number: "H5771", word: "עָוֹן", transliteration: "avon", pronunciation: "aw-vone'", language: "Hebrew", definition: "Iniquity, guilt, punishment", usage: ["iniquity", "guilt", "punishment"], occurrences: 231 },
  { number: "H4148", word: "מוּסָר", transliteration: "muwcar", pronunciation: "moo-sawr'", language: "Hebrew", definition: "Discipline, correction, instruction", usage: ["instruction", "correction", "discipline"], occurrences: 50 },
  { number: "H7965", word: "שָׁלוֹם", transliteration: "shalom", pronunciation: "shaw-lome'", language: "Hebrew", definition: "Peace, completeness, welfare", usage: ["peace", "prosperity", "health"], occurrences: 237 },
  { number: "H2250", word: "חַבּוּרָה", transliteration: "chabburah", pronunciation: "khab-boo-raw'", language: "Hebrew", definition: "Bruise, wound, stripe", usage: ["bruise", "stripe", "wound"], occurrences: 7 },
  { number: "H7495", word: "רָפָא", transliteration: "rapha'", pronunciation: "raw-faw'", language: "Hebrew", definition: "To heal, make whole", usage: ["heal", "physician", "cure"], occurrences: 67 },
  { number: "G3956", word: "πᾶς", transliteration: "pas", pronunciation: "pas", language: "Greek", definition: "All, every, the whole", usage: ["all", "every", "whole"], occurrences: 1243 },
  { number: "G264", word: "ἁμαρτάνω", transliteration: "hamartanō", pronunciation: "ham-ar-tan'-o", language: "Greek", definition: "To sin, miss the mark", usage: ["sin", "trespass", "offend"], occurrences: 43 },
  { number: "G5302", word: "ὑστερέω", transliteration: "hustereō", pronunciation: "hoos-ter-eh'-o", language: "Greek", definition: "To come short, lack, be inferior", usage: ["lack", "come short", "want"], occurrences: 16 },
  { number: "G1391", word: "δόξα", transliteration: "doxa", pronunciation: "dox'-ah", language: "Greek", definition: "Glory, splendor, brightness", usage: ["glory", "dignity", "praise"], occurrences: 166 },
  { number: "G3800", word: "ὀψώνιον", transliteration: "opsōnion", pronunciation: "op-so'-nee-on", language: "Greek", definition: "Wages, pay, allowance", usage: ["wages", "reward"], occurrences: 4 },
  { number: "G266", word: "ἁμαρτία", transliteration: "hamartia", pronunciation: "ham-ar-tee'-ah", language: "Greek", definition: "Sin, failure, missing the mark", usage: ["sin", "sinful", "offense"], occurrences: 174 },
  { number: "G2288", word: "θάνατος", transliteration: "thanatos", pronunciation: "than'-at-os", language: "Greek", definition: "Death, mortality", usage: ["death", "deadly"], occurrences: 120 },
  { number: "G5486", word: "χάρισμα", transliteration: "charisma", pronunciation: "khar'-is-mah", language: "Greek", definition: "Gift, grace, favor", usage: ["gift", "free gift"], occurrences: 17 },
  { number: "G2962", word: "κύριος", transliteration: "kurios", pronunciation: "koo'-ree-os", language: "Greek", definition: "Lord, master, sir", usage: ["Lord", "master", "sir"], occurrences: 748 },
  { number: "G5485", word: "χάρις", transliteration: "charis", pronunciation: "khar'-ece", language: "Greek", definition: "Grace, favor, kindness", usage: ["grace", "favor", "thanks"], occurrences: 156 },
  { number: "G4982", word: "σῴζω", transliteration: "sōzō", pronunciation: "sode'-zo", language: "Greek", definition: "To save, deliver, protect", usage: ["save", "make whole", "heal"], occurrences: 110 },
  { number: "G4102", word: "πίστις", transliteration: "pistis", pronunciation: "pis'-tis", language: "Greek", definition: "Faith, belief, trust", usage: ["faith", "belief", "fidelity"], occurrences: 244 },
  { number: "G1435", word: "δῶρον", transliteration: "dōron", pronunciation: "do'-ron", language: "Greek", definition: "Gift, present, offering", usage: ["gift", "offering"], occurrences: 19 },
  { number: "G3100", word: "μαθητεύω", transliteration: "mathēteuō", pronunciation: "math-ayt-yoo'-o", language: "Greek", definition: "To be a disciple, make disciples", usage: ["disciple", "instruct", "teach"], occurrences: 4 },
  { number: "G1484", word: "ἔθνος", transliteration: "ethnos", pronunciation: "eth'-nos", language: "Greek", definition: "Nation, people, Gentiles", usage: ["Gentiles", "nation", "heathen"], occurrences: 162 },
  { number: "G907", word: "βαπτίζω", transliteration: "baptizō", pronunciation: "bap-tid'-zo", language: "Greek", definition: "To baptize, immerse, wash", usage: ["baptize", "wash"], occurrences: 77 },
  { number: "G3686", word: "ὄνομα", transliteration: "onoma", pronunciation: "on'-om-ah", language: "Greek", definition: "Name, title, reputation", usage: ["name", "named"], occurrences: 231 },
  { number: "G40", word: "ἅγιος", transliteration: "hagios", pronunciation: "hag'-ee-os", language: "Greek", definition: "Holy, sacred, saint", usage: ["holy", "saint", "Holy One"], occurrences: 233 },
  { number: "G4151", word: "πνεῦμα", transliteration: "pneuma", pronunciation: "pnyoo'-mah", language: "Greek", definition: "Spirit, wind, breath", usage: ["Spirit", "spirit", "ghost"], occurrences: 385 },
  { number: "G2480", word: "ἰσχύω", transliteration: "ischuō", pronunciation: "is-khoo'-o", language: "Greek", definition: "To be strong, have power", usage: ["can", "be able", "prevail"], occurrences: 28 },
  { number: "G5547", word: "Χριστός", transliteration: "Christos", pronunciation: "khris-tos'", language: "Greek", definition: "Christ, Messiah, Anointed", usage: ["Christ", "Messiah"], occurrences: 569 },
  { number: "G1743", word: "ἐνδυναμόω", transliteration: "endunamoō", pronunciation: "en-doo-nam-o'-o", language: "Greek", definition: "To strengthen, empower", usage: ["strengthen", "enable", "increase in strength"], occurrences: 7 },
  { number: "G3306", word: "μένω", transliteration: "menō", pronunciation: "men'-o", language: "Greek", definition: "To remain, abide, stay", usage: ["abide", "remain", "dwell"], occurrences: 118 },
  { number: "G1680", word: "ἐλπίς", transliteration: "elpis", pronunciation: "el-pece'", language: "Greek", definition: "Hope, expectation, confidence", usage: ["hope", "faith"], occurrences: 53 },
  { number: "G26", word: "ἀγάπη", transliteration: "agapē", pronunciation: "ag-ah'-pay", language: "Greek", definition: "Love, charity, affection", usage: ["love", "charity", "dear"], occurrences: 116 },
  { number: "G3187", word: "μείζων", transliteration: "meizōn", pronunciation: "mide'-zone", language: "Greek", definition: "Greater, larger, elder", usage: ["greater", "greatest", "more"], occurrences: 48 },
  { number: "G1813", word: "ἐξαλείφω", transliteration: "exaleiphō", pronunciation: "ex-al-i'-fo", language: "Greek", definition: "To wipe out, erase, blot out", usage: ["blot out", "wipe away"], occurrences: 5 },
  { number: "G1144", word: "δάκρυ", transliteration: "dakru", pronunciation: "dak'-roo", language: "Greek", definition: "Tear, weeping", usage: ["tear"], occurrences: 10 },
  { number: "G3756", word: "οὐ", transliteration: "ou", pronunciation: "oo", language: "Greek", definition: "Not, no", usage: ["not", "no", "cannot"], occurrences: 1606 },
  { number: "G3997", word: "πένθος", transliteration: "penthos", pronunciation: "pen'-thos", language: "Greek", definition: "Mourning, sorrow, grief", usage: ["mourning", "sorrow"], occurrences: 5 },
  { number: "G2906", word: "κραυγή", transliteration: "kraugē", pronunciation: "krow-gay'", language: "Greek", definition: "Cry, clamor, outcry", usage: ["cry", "clamor"], occurrences: 6 },
  { number: "G4192", word: "πόνος", transliteration: "ponos", pronunciation: "pon'-os", language: "Greek", definition: "Pain, labor, toil", usage: ["pain", "labor"], occurrences: 4 },
  { number: "G4413", word: "πρῶτος", transliteration: "prōtos", pronunciation: "pro'-tos", language: "Greek", definition: "First, before, former", usage: ["first", "former", "before"], occurrences: 155 },
  { number: "G565", word: "ἀπέρχομαι", transliteration: "aperchomai", pronunciation: "ap-erkh'-om-ahee", language: "Greek", definition: "To go away, depart", usage: ["depart", "go", "pass"], occurrences: 117 }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting bulk import of ${ALL_STRONGS.length} Strong's entries...`);

    let imported = 0;
    let errors = 0;

    for (const entry of ALL_STRONGS) {
      const dbEntry = {
        strongs_number: entry.number,
        word: entry.word,
        transliteration: entry.transliteration,
        pronunciation: entry.pronunciation,
        language: entry.language,
        definition: entry.definition,
        kjv_translation: entry.usage.join(', '),
        occurrences: entry.occurrences
      };

      const { error } = await supabase
        .from('strongs_dictionary')
        .upsert(dbEntry, { onConflict: 'strongs_number' });

      if (error) {
        console.error(`Error importing ${entry.number}:`, error);
        errors++;
      } else {
        imported++;
        if (imported % 10 === 0) {
          console.log(`Imported ${imported}/${ALL_STRONGS.length}...`);
        }
      }
    }

    console.log(`Bulk import complete: ${imported} imported, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Bulk import complete`,
        stats: { imported, errors, total: ALL_STRONGS.length }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Bulk import error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
