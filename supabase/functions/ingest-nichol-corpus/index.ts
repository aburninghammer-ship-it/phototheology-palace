import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Ingest Nichol's "Ellen G. White and Her Critics" (1951)
 * into transcript_chunks for RAG retrieval in Apologetics-Defense mode.
 *
 * This edge function:
 * 1. Takes pre-chunked text segments from the parsed PDF
 * 2. Generates embeddings via OpenAI
 * 3. Inserts into transcript_chunks with appropriate metadata
 */

// ─── Book Content Chunks ────────────────────────────────────────────
// Key apologetic arguments extracted from Nichol's work, chunked for RAG

const NICHOL_CHUNKS = [
  // Chapter 1: Mrs. White and the SDA Church
  {
    content: `Nichol establishes two distinguishing marks of Seventh-day Adventism: (1) The belief that the church arose at a prophetically appointed time to accomplish a last work foretold by the prophets; (2) The belief that God gave this movement a manifestation of the prophetic gift through Mrs. E. G. White. He argues that no other explanation can account for the vitality, distinctiveness, and foresight of the SDA movement's growth across the world. An aged leader of another Adventist body admitted their men laid "better plans," to which Nichol replied: "No, our men were no wiser than yours, but we had a frail handmaiden of the Lord in our midst who declared that by visions from God she saw what we should do." The other Adventist bodies from the Millerite movement totaled less than 50,000 members — no more than 1844 — while SDAs grew to nearly a million despite strict membership rules.`,
    doctrine_tags: ["Spirit of Prophecy", "Prophetic Gift", "Remnant Church"],
    chapter_ref: "Chapter 1",
  },
  // Chapter 2-5: Were Visions Due to Nervous Disorders?
  {
    content: `Nichol identifies two primary weaknesses in the charge that Ellen White's visions were due to nervous disorders (epilepsy, hysteria): (1) Medical authorities cited by critics were almost invariably from the early 20th century or earlier, while most knowledge of mental maladies has been acquired since then, greatly revising our understanding; (2) Diagnosis was reached by examining isolated incidents rather than her whole case history. A reputable psychiatrist would never attempt diagnosis without a complete case history. Hysteria is not simply a group of symptoms but a group of interrelated symptoms producing a distinctive personality picture. D. M. Canright first formulated this charge in 1887, claiming she was afflicted with "a complication of hysteria, epilepsy, catalepsy and ecstasy." Nearly all other critics have drawn from him.`,
    doctrine_tags: ["Spirit of Prophecy", "Visions", "Medical Evidence"],
    chapter_ref: "Chapters 2-5",
  },
  {
    content: `Against the nervous disorder charge, Nichol presents Mrs. White's complete life history: her resolute courage during storms at sea ("My trust was in God, that he would bring us safe to land if it was for his glory"), her practical domestic skills (making pants, coats, mattresses, gardens), her disciplined child-rearing ("I never allowed my children to think that they could plague me"), her compassion for the poor, and her tireless work despite frailty. He argues that hysteria produces a "distinctive kind of personality" — but Mrs. White's personality, as revealed across 70 years of public life, shows none of the diagnostic markers: no attention-seeking behavior, no dramatic self-centeredness, no inability to maintain relationships, no pattern of manipulative conduct. Her life was "an open book" and the meagerness of evidence against her character is itself significant.`,
    doctrine_tags: ["Spirit of Prophecy", "Character Evidence", "Nervous Disorders Rebuttal"],
    chapter_ref: "Chapters 2-5",
  },
  {
    content: `Nichol systematically examines the medical witnesses brought against Mrs. White: Dr. Fairfield (who never personally examined her and based opinions on secondhand reports), Dr. Russell (who examined her once briefly), Dr. Jackson (a hydrotherapy advocate with limited psychiatric training), and Dr. Kellogg (who later became hostile to the church). He demonstrates that none conducted the comprehensive case-history examination required for psychiatric diagnosis. The critics' approach — selecting a few isolated symptoms and forcing them into a diagnostic category — would not be accepted by any competent modern psychiatrist. Mrs. White's visions occurred in religious settings during prayer and worship, not in the random, unprovoked episodes characteristic of epilepsy. Her mental clarity and prolific productivity across 70 years is incompatible with either epilepsy or hysteria as understood by modern medicine.`,
    doctrine_tags: ["Spirit of Prophecy", "Medical Evidence", "Visions"],
    chapter_ref: "Chapters 4-5",
  },
  // Chapter 6: What Do Adventists Claim for Mrs. White's Writings?
  {
    content: `Nichol refutes the charge that Adventists consider Mrs. White's writings "another Bible." He documents that SDA leaders and Mrs. White herself consistently denied this: her writings are "a lesser light to lead men and women to the greater light" (Scripture). Adventists have always taught that the Bible is the only rule of faith and practice, and that the prophetic gift operates to confirm, illuminate, and apply Scripture — never to replace or supersede it. Mrs. White stated: "The Testimonies are not to take the place of the Word. . . . Let all prove their positions from the Scriptures and substantiate every point they claim as truth from the revealed Word of God." Nichol argues that having a prophetic gift in the church is precisely what Scripture predicts for the remnant (Revelation 12:17; 19:10), and that denying this gift is as unbiblical as elevating it above Scripture.`,
    doctrine_tags: ["Spirit of Prophecy", "Sola Scriptura", "Lesser Light"],
    chapter_ref: "Chapter 6",
  },
  // Chapter 7: Astronomy Vision
  {
    content: `Nichol addresses the charge that Mrs. White gave false figures on moons of planets. He demonstrates: (1) It was not Mrs. White but Joseph Bates who named the planets seen in vision — she described celestial scenes without identifying them as specific planets; (2) The critic suppresses part of J. N. Loughborough's account, which clarifies this distinction; (3) It is not necessary for a prophet to know all truth in perfect scientific detail in order to be a true prophet — biblical prophets used the language and understanding of their times. The value of the astronomy vision was its spiritual and evangelistic impact on Bates, who had been skeptical of her prophetic gift and was convinced by her accurate description of celestial scenes she could not have known through normal means.`,
    doctrine_tags: ["Spirit of Prophecy", "Astronomy Vision", "Scientific Accuracy"],
    chapter_ref: "Chapter 7",
  },
  // Chapter 8: 1856 Vision Predictions
  {
    content: `Nichol addresses the 1856 vision where Mrs. White stated some present would be "food for worms," some subjects of the seven last plagues, and some translated at Christ's coming. He establishes the conditional quality of divine predictions using Scripture: Jonah's unconditional prediction of Nineveh's destruction in 40 days did not occur because of human response (Jonah 3:4-10). God explicitly states this principle in Jeremiah 18:7-10. The promised blessing of the Advent was conditioned on the church's faithfulness. Mrs. White herself repeatedly addressed the Lord's delay, writing that had the church pursued its mission with urgency, Christ could have returned within that generation. This conditional framework does not undermine the certainty of the ultimate fulfillment of prophecy — only the timing was affected by human response.`,
    doctrine_tags: ["Spirit of Prophecy", "Conditional Prophecy", "Second Coming"],
    chapter_ref: "Chapter 8",
  },
  // Chapters 9: Civil War Predictions
  {
    content: `Nichol examines ten specific charges related to Mrs. White's Civil War predictions and refutes each: (1) She did not merely state what "everybody knew" — her statements were made before key events unfolded; (2) Her descriptions were not simply reflecting Lincoln's opponents but contained specific prophetic details; (3) She did not predict slavery would continue perpetually but within the prophetic framework of merging present and future judgments; (4-5) Her statements about the nation being "humbled" and "divided" were prophetically descriptive of the broader trajectory, not failed predictions; (6-7) The claim she predicted England would declare war overstates her words; (8) She did not forbid Adventists from aiding the government; (9-10) Her connection of the Civil War to end-time signs was prophetically consistent with biblical patterns of escalating judgments.`,
    doctrine_tags: ["Spirit of Prophecy", "Civil War", "Failed Prophecy Rebuttal"],
    chapter_ref: "Chapter 9",
  },
  // Chapters 13-16: Shut Door
  {
    content: `Nichol provides the most exhaustive historical treatment of the shut-door controversy. He examines the charge under twelve specific heads, demonstrating: (1) The shut-door belief was not unique to Ellen White — it was held broadly among Millerite Adventists, rooted in Jesus' parable of the ten virgins (Matthew 25:10); (2) Mrs. White's visions were not the source of the shut-door view but confirmed the developing sanctuary understanding; (3) The transition from "shut door" to "open door" was gradual and corporate, driven by Bible study and evangelistic experience; (4) James White's 1868 statement retrospectively clarified the developmental process; (5) Ellen White explicitly taught that probation still lingered for sincere seekers. Nichol's most critical argument: the shut-door controversy is actually evidence FOR her prophetic integrity — she grew in understanding exactly as Peter grew from Jewish exclusivism to Gentile inclusion (Acts 10-11).`,
    doctrine_tags: ["Shut Door", "Spirit of Prophecy", "1844", "Sanctuary"],
    chapter_ref: "Chapters 13-16",
  },
  // Chapter 25: Time to Begin the Sabbath
  {
    content: `Nichol addresses the charge that Mrs. White followed Bates in beginning the Sabbath at 6 PM rather than sundown. He provides the historical context: the 6 PM view was held by many early Adventists based on their initial Bible study. When J. N. Andrews presented careful exegetical evidence from Scripture that sundown was the correct time, the 1855 Battle Creek Conference adopted the sundown position. Mrs. White received a confirming vision supporting the sundown time. Critics ask: Why didn't she have an early vision correcting the error? Nichol's answer: God does not always give immediate correction on every point. The Bible itself shows progressive revelation — the apostles held incorrect views after the resurrection (Acts 1:6) that were gradually corrected. The important fact is that when biblical evidence was presented, Ellen White confirmed it through vision, which is precisely the role of the prophetic gift: to confirm and corroborate truths discovered through Bible study.`,
    doctrine_tags: ["Sabbath", "Spirit of Prophecy", "Progressive Revelation"],
    chapter_ref: "Chapter 25",
  },
  // Chapter 27: Health Teachings
  {
    content: `Nichol systematically addresses eight charges against Mrs. White's health teachings: (1) That her diet teachings make the kingdom of God consist in "meat and drink" — she always avoided extremes and placed health reform in spiritual context; (2) That condemning meat condemns Christ — exposed as a fallacy; (3) That calling meat eating "a suggestion of Satan" was extreme — context reveals her words were misconstrued; (4) That she fulfilled Paul's prediction in 1 Timothy 4:1,3 about forbidding foods — the true interpretation of Paul refers to ascetic heresy, not health reform; (5) That she first endorsed then condemned pork — analysis of debated passages refutes this; (6-7) That her statements on butter, eggs, and dairy were contradictory — parallel passages show contextual counsel for different circumstances; (8) The borrowing charge — she frankly stated she learned from others but distinguished between what she endorsed and rejected among contemporary reformers, and Dr. Kellogg himself gave remarkable testimony that her health visions preceded and surpassed the reformers' knowledge.`,
    doctrine_tags: ["Health Reform", "Spirit of Prophecy", "Diet"],
    chapter_ref: "Chapter 27",
  },
  // Chapters 28-30: Plagiarism Charges
  {
    content: `Nichol's treatment of the plagiarism charge spans three chapters. He establishes: (1) What constitutes plagiarism — by legal, literary, and ethical standards of the 19th century, literary borrowing without modern citation was standard practice; (2) Canright himself borrowed extensively from others in his own writings without attribution; (3) The legal aspect — L. C. Smith, senior attorney of the Copyright Division, Library of Congress, provided authoritative information clarifying that Mrs. White's literary practices were within the legal norms of her era; (4) The historical background of The Great Controversy — writers quoted in that volume are acknowledged in the preface, and the total of literary borrowings was a fraction of the whole; (5) For Sketches from the Life of Paul — the extent of borrowing has been greatly exaggerated; (6) The "threatened lawsuit" over her Paul book is demolished: the publisher of the allegedly plagiarized Conybeare and Howson book testified they never threatened suit; (7) Literary borrowings do not invalidate her claim to inspiration, because thought inspiration, not verbal dictation, is the biblical model (Luke 1:1-4, Chronicles, Jude quoting 1 Enoch).`,
    doctrine_tags: ["Plagiarism", "Spirit of Prophecy", "Literary Dependency", "Great Controversy"],
    chapter_ref: "Chapters 28-30",
  },
  {
    content: `On the threatened lawsuit over Sketches from the Life of Paul, Nichol conducts a forensic investigation: (1) He traces the anonymous 1907 pamphlet that first circulated the rumor; (2) He examines and refutes the Kolvoord story that alleged Mrs. White suppressed the book to avoid prosecution; (3) He presents correspondence between Haskell and W. C. White showing denominational plans for a revised edition, not suppression; (4) He contacts the actual publisher of the Conybeare and Howson Life and Epistles of Paul and obtains testimony that no legal action was ever threatened; (5) He demonstrates from copyright law that even if borrowing occurred, it was within the legal "fair use" provisions of the era. Nichol concludes: the threatened lawsuit story is a fabrication built on anonymous rumors, bad memories, and unverified hearsay — precisely the kind of evidence no court of law would accept.`,
    doctrine_tags: ["Plagiarism", "Spirit of Prophecy", "Paul Book", "Lawsuit"],
    chapter_ref: "Chapter 29",
  },
  // Chapter 31: Did Her Secretaries Write Her Books?
  {
    content: `Nichol addresses the charge that Mrs. White's secretaries — particularly Fannie Bolton — actually wrote her books, including Steps to Christ. He establishes: (1) Adventists have never held to verbal inspiration; therefore, editorial polishing of manuscripts is perfectly consistent with the thought-inspiration model; (2) Mrs. White read her manuscripts to others for criticism and suggestions, which is responsible authorship, not fraud; (3) The literary quality of her earliest writings (before she had secretaries) demonstrates her own writing ability; (4) Newspaper reporters who heard her speak commented on her eloquence and power — she was an effective communicator in her own right; (5) Her literary assistants testified that they did not change her ideas, only improved grammar and style; (6) Fannie Bolton's claims were contradicted by her own admissions and by parallel passages that expose the impossibility of her having written Steps to Christ. Bolton herself later recanted her allegations and confessed to jealousy and instability.`,
    doctrine_tags: ["Spirit of Prophecy", "Steps to Christ", "Secretaries", "Authorship"],
    chapter_ref: "Chapter 31",
  },
  // Chapter 32: Was She "Influenced to Write Testimonies"?
  {
    content: `Nichol examines whether Mrs. White's testimonies to individuals were based on gossip rather than divine revelation. He presents three key passages from her writings where she describes the process of receiving revelation about specific individuals. He demonstrates: (1) The "wrong" testimony to E. P. Daniels — when the full facts emerged, her testimony proved accurate despite initial appearances; (2) Dr. Kellogg, even after becoming hostile to the church, testified that Mrs. White had revealed things about his private life that she could not have known through any human channel; (3) D. M. Canright himself, the chief critic, testified that Mrs. White had told him things about his secret sins that no one else could have known. If both her greatest defender (Kellogg in his early years) and her greatest attacker (Canright) testified that she possessed knowledge beyond normal human channels, the "gossip theory" collapses under the weight of its own contrary evidence.`,
    doctrine_tags: ["Spirit of Prophecy", "Testimonies", "Revelation Process"],
    chapter_ref: "Chapter 32",
  },
  // Chapter 33: Financial Affairs
  {
    content: `Nichol addresses five charges about Mrs. White's finances: (1) That she commercialized her work and lived lavishly — he documents that she gave away large portions of her income, often lived in modest circumstances, and that her royalties were modest by publishing standards; (2) That she owned fine land contrary to her counsels — he surveys her actual land holdings and shows they were functional properties for her work, not luxury estates; (3) That she died heavily in debt — he distinguishes between different kinds of debts (institutional investments vs. personal extravagance) and shows her indebtedness was due to her generous funding of missionary enterprises; (4) That copyrighting her works was contrary to prophetic practice — he exposes this as a false comparison (Bible prophets did not operate in a modern publishing economy); (5) That her will providing for her children contradicted her own counsel — he argues that the charge creates an impossible standard: critics would equally condemn her for neglecting her children.`,
    doctrine_tags: ["Spirit of Prophecy", "Financial Integrity", "Critics Answered"],
    chapter_ref: "Chapter 33",
  },
  // Chapter 20: Amalgamation
  {
    content: `Nichol addresses one of the most controversial charges — that Mrs. White taught early humans cohabited with beasts and that offspring constitutes certain races. He offers two possible explanations of her words and argues for the one that does not involve inter-species procreation: "amalgamation" referred to the mixing of races (human with human) and separately the crossing of animal species. He examines the key phrase in its context, shows parallel passages, and presents three important conclusions: (1) Mrs. White's language was consistent with 19th-century scientific vocabulary, which used "amalgamation" broadly; (2) She was actually ahead of Darwin in opposing the idea that some races were inferior or sub-human — her position was the equality of all humans as God's creation; (3) The "suppression" charge is unfounded since her statements were reprinted in later editions. He demonstrates that the worst reading of her words is not the only or even the most natural reading when the full literary and historical context is considered.`,
    doctrine_tags: ["Amalgamation", "Spirit of Prophecy", "Race", "Controversial Statements"],
    chapter_ref: "Chapter 20",
  },
  // Reform Dress (Chapter 12)
  {
    content: `Nichol addresses the charge that Mrs. White advocated an outlandish reform dress then abandoned it. He provides essential context: the fashions of the 1860s included floor-sweeping skirts, tight corsets, and multiple heavy petticoats — genuinely health-destroying clothing. Mrs. White's reform dress was a moderate improvement, not an extreme position. She explicitly avoided extremes, distinguishing her counsel from the radical "American Costume" advocated by some. When cultural conditions changed and fashions improved, making the specific reform dress unnecessary, she counseled that the specific style should not be revived — demonstrating pastoral flexibility, not prophetic failure. He argues that dress reformers of the 19th century were vindicated by modern health science regarding the dangers of tight-lacing and restrictive clothing. The fact that she eventually moved on from a specific style shows wisdom, not inconsistency.`,
    doctrine_tags: ["Reform Dress", "Spirit of Prophecy", "Health Reform", "Cultural Context"],
    chapter_ref: "Chapter 12",
  },
  // Appendix B: Perpetuity of the Gifts
  {
    content: `In Appendix B, Nichol presents the biblical and theological case for the perpetuity of spiritual gifts, including the prophetic gift, in the Christian church until the Second Coming. He argues from 1 Corinthians 12-14, Ephesians 4:11-13, Revelation 12:17, and Revelation 19:10 that the prophetic gift was never intended to cease after the apostolic era. The "cessationist" position — that gifts like prophecy ended with the last apostle — contradicts Paul's explicit statement that gifts would continue "till we all come in the unity of the faith" (Ephesians 4:13). Since the church has not yet reached that unity, the gifts, including prophecy, remain operative. Seventh-day Adventists simply believe that in their midst this gift was manifested through Ellen White, as Revelation 12:17 predicts for the "remnant" who keep God's commandments and have "the testimony of Jesus," which is identified as "the spirit of prophecy" (Revelation 19:10).`,
    doctrine_tags: ["Spiritual Gifts", "Prophetic Gift", "Cessationism Rebuttal", "Revelation 12:17"],
    chapter_ref: "Appendix B",
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

    for (const chunk of NICHOL_CHUNKS) {
      // Check if already exists
      const { data: existing } = await supabase
        .from("transcript_chunks")
        .select("id")
        .eq("source_file", "Nichol_EllenGWhiteAndHerCritics_1951")
        .ilike("content", `%${chunk.content.slice(0, 100)}%`)
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
        source_file: "Nichol_EllenGWhiteAndHerCritics_1951",
        category: "Apologetics-Defense",
        embedding,
        metadata: {
          author: "Francis D. Nichol",
          book_title: "Ellen G. White and Her Critics",
          year: 1951,
          chapter_ref: chunk.chapter_ref,
          doctrine_tags: chunk.doctrine_tags,
          source_type: "book",
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

    console.log(`[ingest-nichol] Inserted: ${inserted}, Skipped: ${skipped}`);

    return new Response(
      JSON.stringify({
        success: true,
        total_chunks: NICHOL_CHUNKS.length,
        inserted,
        skipped,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ingest-nichol] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
