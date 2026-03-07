import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Ingest Nichol's "Answers to Objections" (1952)
 * into transcript_chunks for RAG retrieval in Apologetics-Defense mode and AATS.
 *
 * Covers doctrinal defense on: Law, Sabbath, Covenants, Grace, and related objections.
 */

const SOURCE_FILE = "Nichol_AnswersToObjections_1952";

const NICHOL_ATO_CHUNKS = [
  // === SECTION 1: LAW ===
  {
    content: `Nichol refutes the claim that Christians should only use the New Testament, not the Old. He demonstrates that the "Bible" of the apostles was the Old Testament — the first NT writings didn't appear until 20-30 years after Christ's ascension. Christ Himself commanded: "Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me" (John 5:39). He told the Jews: "Had ye believed Moses, ye would have believed me: for he wrote of me" (John 5:46-47). Paul declared he preached "none other things than those which the prophets and Moses did say should come" (Acts 26:22). The classic Protestant position is that the New Testament is enfolded in the Old, and the Old is unfolded in the New.`,
    doctrine_tags: ["Old Testament Authority", "Sola Scriptura", "Two Testaments"],
    chapter_ref: "Objection 1 — OT vs NT",
  },
  {
    content: `Nichol establishes the biblical distinction between the moral law (Ten Commandments) and the ceremonial law (law of Moses). He shows 18 points of contrast: (1) Spoken by God vs. spoken by Moses; (2) Written by God's finger vs. written by Moses; (3) Written on stone vs. on paper; (4) Placed inside the Ark vs. beside the Ark; (5) Complete and self-contained (Deut 5:22) vs. expandable; (6) Eternal (Ps 111:7-8) vs. temporary (Heb 7:12); (7) Good (Rom 7:12) vs. "against us" (Col 2:14); (8) Points out sin vs. points to Savior; (9) Must be obeyed (Matt 5:19) vs. Acts 15:24 relief; (10) Spiritual (Rom 7:14) vs. carnal ordinances (Heb 7:16); (11) Perfect (Ps 19:7) vs. imperfect (Heb 7:19); (12) Law of liberty (James 2:11-12) vs. yoke of bondage (Gal 5:1); (13) Delight (Ps 119:77) vs. burden (Acts 15:10); (14) Christ upheld it (Isa 42:21) vs. Christ abolished it (Eph 2:15); (15) Endures forever (Matt 5:18) vs. temporary (Gal 3:19); (16) Our standard (James 2:8-12) vs. not our judge (Col 2:16-17).`,
    doctrine_tags: ["Two Laws", "Moral Law", "Ceremonial Law", "Ten Commandments"],
    chapter_ref: "Objection 2 — Two Laws",
  },
  {
    content: `Nichol proves the Ten Commandments existed before Moses. His argument: (1) Angels sinned (2 Peter 2:4), Adam sinned (Rom 5:12-14), Cain sinned (Gen 4:7), Sodomites were sinners (Gen 13:13) — but "where no law is, there is no transgression" (Rom 4:15) and "sin is the transgression of the law" (1 John 3:4). Therefore law must have existed. (2) Paul identifies this law specifically: "I had not known lust, except the law had said, Thou shalt not covet" (Rom 7:7) — the Ten Commandments. (3) Satan was "a murderer from the beginning" and "a liar" (John 8:44) — violations of the sixth and ninth commandments. Adam and Eve coveted the forbidden fruit — the tenth commandment. (4) Paul explains that even Gentiles "show the work of the law written in their hearts, their conscience also bearing witness" (Rom 2:14-15). (5) Deuteronomy 5:3 ("The Lord made not this covenant with our fathers, but with us") refers to the formal covenant with the nation, not the non-existence of the moral principles.`,
    doctrine_tags: ["Ten Commandments", "Pre-Sinai Law", "Sin Definition", "Moral Law"],
    chapter_ref: "Objection 3 — Law Before Moses",
  },
  {
    content: `Nichol demolishes the claim that the Ten Commandments were abolished at the cross. His proof: (1) Sin existed after the cross — apostles preached to sinners — but "sin is not imputed when there is no law" (Rom 5:13). Therefore the law still existed. (2) If Christians were freed from the highest conceivable moral code, how could they be said to have a higher moral standard than pre-Christian people? (3) Christ's death was to save us FROM sin (transgression of the law), not to abolish the standard that defines sin. (4) James, writing after the cross, identifies God's law by citing "Do not commit adultery" and "Do not kill" — Ten Commandment precepts — and calls it "the law of liberty" (James 2:9-12). (5) Paul after the cross declares: "the law is holy, and the commandment holy, and just, and good" (Rom 7:12) and "we establish the law" through faith (Rom 3:31).`,
    doctrine_tags: ["Ten Commandments", "Law Not Abolished", "Cross and Law"],
    chapter_ref: "Objection 4 — Law Abolished at Cross",
  },
  {
    content: `Nichol explains the two covenants. The old covenant failed not because of any defect in its terms (the Ten Commandments) but because of the people's inability to keep them in their own strength — "they continued not in my covenant" (Heb 8:9). The new covenant promises: "I will put my laws into their mind, and write them in their hearts" (Heb 8:10). Nichol presents a clear parallel table: both covenants have the same text (Ten Commandments), but differ in mediator (Moses vs. Christ), writing location (stone vs. heart), ratification blood (animals vs. Christ), and ministration (earthly vs. heavenly sanctuary). The essence of the new covenant is not a change in the law but a change in WHERE the law is written — from external stone to internal heart. Revelation 14:12 describes those awaiting Christ's return: "Here are they that keep the commandments of God, and the faith of Jesus."`,
    doctrine_tags: ["Two Covenants", "Old Covenant", "New Covenant", "Hebrews 8", "Ten Commandments"],
    chapter_ref: "Objection 5 — Two Covenants",
  },
  {
    content: `Nichol addresses 2 Corinthians 3:7-13, where Paul speaks of the "ministration of death, written and engraved in stones" being "done away." He demonstrates: (1) A "ministration" of a law is not the same as the law itself — the administering of law is distinct from the law; (2) Paul speaks of the relative "glory" of two ministrations, not two laws; (3) The glory that was "done away" was the glory on Moses' FACE, not the glory of the law itself — "the veil was on Moses' face, not on the tables of stone"; (4) Paul himself, in the same context, affirms the law as "holy, and just, and good" (Rom 7:12); (5) Romans 8:3-4 shows how we escape the ministration of condemnation: not by abolishing law, but through Christ, "that the righteousness of the law might be fulfilled in us." Jamieson, Fausset, and Brown comment: "Still the moral law of the ten commandments, being written by the finger of God, is as obligatory now as ever."`,
    doctrine_tags: ["2 Corinthians 3", "Ministration of Death", "Glory", "Ten Commandments", "New Covenant"],
    chapter_ref: "Objection 6 — Ministration of Death",
  },
  {
    content: `Nichol interprets Paul's allegory in Galatians 4 on the two covenants. Hagar represents Sinai and bondage; Sarah represents the heavenly Jerusalem and freedom. The "bondage" of the old covenant is twofold: (1) The ceremonial ritual of sacrifices, feast days, and rabbinic additions became an intolerable burden — Peter called it "a yoke upon the neck of the disciples, which neither our fathers nor we were able to bear" (Acts 15:10); (2) The moral law, when a man seeks to keep it in his own strength, "works wrath" (Rom 4:15) and brings condemnation. Freedom comes not by abolishing the law but by moving from the old to the new covenant — receiving God's promise to write His law in the heart. Paul's climax: "Now we, brethren, as Isaac was, are the children of promise" (Gal 4:28). And why did God promise Abraham? "Because that Abraham obeyed my voice, and kept my charge, my commandments, my statutes, and my laws" (Gen 26:5).`,
    doctrine_tags: ["Galatians 4", "Allegory", "Hagar and Sarah", "Two Covenants", "Bondage and Freedom"],
    chapter_ref: "Objection 7 — Galatians 4 Allegory",
  },
  {
    content: `Nichol addresses Romans 6:14 ("not under the law, but under grace"), John 1:17 ("grace and truth came by Jesus Christ"), and Romans 10:4 ("Christ is the end of the law"). He shows: (1) "Not under the law" means not under its condemnation — Paul immediately adds "shall we sin [break the law] because we are not under the law? God forbid" (Rom 6:15); (2) "Under grace" means living under God's plan of salvation, which produces "obedience unto righteousness" (Rom 6:16-18), not lawlessness; (3) Grace enables "the righteousness of the law" to be "fulfilled in us" (Rom 8:3-4); (4) "Christ is the end [telos = goal/purpose] of the law" — Christ is what the law aims toward, driving sinners to seek His righteousness; (5) John 1:17 shows law and grace complement each other: through Moses God gave the written moral code, through Christ came divine power to keep it. "By the power of God's grace we no longer dwell under the condemnation of the law, but are in Him raised up to the lofty plane of complete obedience."`,
    doctrine_tags: ["Law and Grace", "Romans 6", "Romans 10:4", "John 1:17", "Not Under Law"],
    chapter_ref: "Objection 8 — Not Under Law But Grace",
  },
  {
    content: `Nichol refutes the claim that Luke 16:16 ("The law and the prophets were until John") abolishes the law. He shows: (1) The word "were" is supplied — Luke wrote "The law and the prophets, until John"; (2) The parallel in Matthew 11:13 clarifies: "all the prophets and the law PROPHESIED until John"; (3) "The law and the prophets" is a standard phrase for the OT writings, not specifically the Ten Commandments; (4) The prophets "prophesied until" John in the sense that their prophecies about Messiah found fulfillment when Christ appeared — prophecy became history; (5) Christ was not announcing the abolition of Moses but declaring "the time is fulfilled, and the kingdom of God is at hand" (Mark 1:15).`,
    doctrine_tags: ["Luke 16:16", "Law and Prophets", "John the Baptist"],
    chapter_ref: "Objection 9 — Luke 16:16",
  },
  {
    content: `Nichol analyzes Romans 7 and the marriage analogy. Paul's figure has four parts: a woman, her first husband, her second husband, and the law of marriage. The critical point: Paul speaks of the death of a HUSBAND, not the death of the LAW. The marriage law remains on the books — without it, "adultery" would be meaningless. Our "old man" (sinful nature) dies through conversion (Rom 6:6); then we are "married to another, even to him who is raised from the dead" (Rom 7:4) — Christ. Paul explicitly prevents misunderstanding: "Is the law sin? God forbid" (v.7); "the law is holy, and the commandment holy, and just, and good" (v.12); "the law is spiritual: but I am carnal, sold under sin" (v.14). The climax: God sent Christ "that the righteousness of the law might be fulfilled in us" (Rom 8:4). Romans 7:6 ("delivered from the law") means delivered from its condemnation, not from the law itself — as confirmed by the RSV: "dead to that which held us captive."`,
    doctrine_tags: ["Romans 7", "Marriage Analogy", "Old Man", "New Man", "Law Not Dead"],
    chapter_ref: "Objection 10 — Romans 7 Marriage",
  },
  {
    content: `Nichol demonstrates that Ephesians 2:14-15 and Colossians 2:14,16 refer to the ceremonial law, not the Ten Commandments. His proofs: (1) The texts speak of "ordinances" — religious rites and ceremonies like the Passover (Ex 12:43), "meats and drinks, and divers washings, and carnal ordinances" (Heb 9:10); (2) If the Ten Commandments were abolished, why would Paul only mention minor matters like "meat, drink, holy days" rather than major issues like murder, adultery, idolatry? It would be like a government repealing ALL traffic laws but only announcing freedom from parking tickets; (3) The abolished law is called "against us, contrary to us" — but who would call the Ten Commandments "against us"? (4) If God sent Christ to abolish the Ten Commandments, He sent His Son to repeal the ban on murder, idolatry, and profanity — "what a monstrous idea!" (5) These texts don't even mention the Ten Commandments.`,
    doctrine_tags: ["Ephesians 2:15", "Colossians 2:14", "Ceremonial Law Abolished", "Ordinances"],
    chapter_ref: "Objection 11 — Ephesians & Colossians",
  },
  {
    content: `Nichol refutes the idea that Christ's commandments replace God's Ten Commandments. He shows: (1) Christ's Sermon on the Mount commands are summarized in the golden rule, which Christ Himself declares is the epitome of "the law and the prophets" (Matt 7:12) — not a new code; (2) Christ explicitly expanded the Ten Commandments, not replaced them — "Ye have heard that it was said... but I say unto you" deepened the commands against murder (to include anger) and adultery (to include lust); (3) Christ declared: "Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil" (Matt 5:17); (4) "Whosoever therefore shall break one of these least commandments, and shall teach men so, he shall be called the least in the kingdom" (Matt 5:19); (5) When asked "what good thing shall I do, that I may have eternal life?" Christ answered: "Keep the commandments" and then quoted from the Ten Commandments (Matt 19:17-19).`,
    doctrine_tags: ["Christ's Commandments", "Sermon on the Mount", "Ten Commandments", "Matt 5:17"],
    chapter_ref: "Objection 12 — Christ's vs God's Commandments",
  },
  // === METHODOLOGY: HOW TO DEFEND THE FAITH ===
  {
    content: `In his preface, Nichol establishes five rules for defending the faith, drawing from apostolic precedent: (1) Impute good faith and sincerity to your opponent — even those with preposterous opinions may be sincere; (2) Keep calm — if you cannot fight for the faith without a rise of temperature, stay by the stuff and let others of more equable disposition carry on; (3) Be sparing of strong language — because we are sure the truth and evidence are on our side, we can afford to be calm, cool, and kind; (4) Reveal a spirit of great seriousness — let it be evident your contending is prompted by solemn conviction, not a desire for wrangling; (5) Appeal to the heart as well as to the head — it is one thing to convince a man, another to convict him. "If we are really to help a man, we must do more than close his mouth; we must open his heart to receive the truth." He grounds this methodology in Paul's example (2 Tim 1:13), Jude's exhortation to "earnestly contend for the faith" (Jude 3), and Peter's warning against "false teachers" (2 Peter 2:1).`,
    doctrine_tags: ["Apologetic Method", "Defense of Faith", "Christian Conduct", "Evangelism"],
    chapter_ref: "Preface — Rules of Engagement",
  },
  {
    content: `Nichol argues that doctrinal defense is not optional but apostolic. He demonstrates from Scripture: (1) John warned against Docetic heresy (1 John 1:1-3; 4:2-3) and the antinomian heresy that Christians need not keep commandments — calling such teachers "liars" (1 John 2:4); (2) Paul's epistles are "tightly reasoned presentations of truth, with a negative as well as a positive aspect" — he fought Jewish legalism and the denial of resurrection (1 Cor 15:12); (3) Jude exhorted believers to "earnestly contend for the faith" (Jude 3); (4) Peter warned of "false teachers" bringing "damnable heresies" (2 Peter 2:1); (5) Nehemiah kept builders working with one hand while the other "held a weapon" — "It was the gleam of the swords on the ramparts that gave heart to the builders" (Neh 4:16-18). Nichol warns that every movement that stopped defending its distinctive truths lost its identity — from early Christianity merging with paganism to Protestant churches losing distinctiveness.`,
    doctrine_tags: ["Apologetics", "Contending for Faith", "Doctrinal Vigilance", "Church History"],
    chapter_ref: "Preface — Biblical Basis for Apologetics",
  },
];

async function generateEmbedding(text: string, openaiKey: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI embedding error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: { chunk: string; status: string }[] = [];
    let inserted = 0;
    let skipped = 0;

    for (const chunk of NICHOL_ATO_CHUNKS) {
      // Check if already exists
      const { data: existing } = await supabase
        .from("transcript_chunks")
        .select("id")
        .eq("source_file", SOURCE_FILE)
        .ilike("content", `%${chunk.content.slice(0, 80)}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        results.push({ chunk: chunk.chapter_ref, status: "skipped (exists)" });
        continue;
      }

      // Generate embedding
      const embedding = await generateEmbedding(chunk.content, openaiKey);

      // Insert
      const { error } = await supabase.from("transcript_chunks").insert({
        content: chunk.content,
        source_file: SOURCE_FILE,
        category: "Apologetics-Defense",
        embedding,
        metadata: {
          author: "Francis D. Nichol",
          book_title: "Answers to Objections",
          year: 1952,
          chapter_ref: chunk.chapter_ref,
          doctrine_tags: chunk.doctrine_tags,
          source_type: "book",
          corpus_tier: "defense",
        },
      });

      if (error) {
        console.error(`Error inserting chunk ${chunk.chapter_ref}:`, error);
        results.push({ chunk: chunk.chapter_ref, status: `error: ${error.message}` });
      } else {
        inserted++;
        results.push({ chunk: chunk.chapter_ref, status: "inserted" });
      }

      // Rate limit protection
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`[ingest-nichol-objections] Inserted: ${inserted}, Skipped: ${skipped}`);

    return new Response(
      JSON.stringify({
        success: true,
        source: SOURCE_FILE,
        total_chunks: NICHOL_ATO_CHUNKS.length,
        inserted,
        skipped,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ingest-nichol-objections] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
