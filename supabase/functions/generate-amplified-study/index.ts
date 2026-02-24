import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Doctrinal red flags to scan for in sermon content
const OFFSHOOT_INDICATORS = [
  // Anti-Trinity keywords
  { pattern: /anti[-\s]?trinit/i, warning: "Potential anti-Trinitarian content detected" },
  { pattern: /god\s+is\s+(not|isn't)\s+three/i, warning: "Potential anti-Trinitarian content detected" },
  { pattern: /trinity\s+(is\s+)?(a\s+)?pagan/i, warning: "Anti-Trinity teaching detected" },
  { pattern: /jesus\s+(is|was)\s+(not|n't)\s+god/i, warning: "Non-SDA Christology detected" },
  
  // COVID/conspiracy markers
  { pattern: /vaccine[sd]?\s+(are|is)\s+(the\s+)?mark/i, warning: "COVID-mark of beast conspiracy detected" },
  { pattern: /covid[-\s]?(19)?\s+(is\s+)?(the\s+)?mark/i, warning: "COVID conspiracy content detected" },
  { pattern: /5g\s+(is\s+)?beast/i, warning: "Technology conspiracy content detected" },
  { pattern: /chip\s+(implant|is\s+the\s+mark)/i, warning: "Microchip mark conspiracy detected" },
  
  // Known offshoot movements
  { pattern: /shepherd'?s?\s+rod/i, warning: "Shepherd's Rod (Davidian) content detected" },
  { pattern: /branch\s+davidian/i, warning: "Branch Davidian content detected" },
  { pattern: /1888\s+message/i, warning: "1888 movement content - may need review" },
  { pattern: /last\s+generation\s+theology/i, warning: "Last Generation Theology - review for balance" },
  
  // Date setting
  { pattern: /(second\s+coming|jesus\s+(will\s+)?return[s]?)\s+(in|on|by)\s+20\d{2}/i, warning: "Date-setting for Second Coming detected" },
  { pattern: /know\s+the\s+exact\s+(date|day|time)/i, warning: "Potential date-setting content" },
  
  // Non-SDA doctrines
  { pattern: /once\s+saved[,]?\s+always\s+saved/i, warning: "Once Saved Always Saved doctrine (non-SDA)" },
  { pattern: /secret\s+rapture/i, warning: "Secret rapture teaching (non-SDA)" },
  { pattern: /pre[-\s]?trib(ulation)?\s+rapture/i, warning: "Pre-tribulation rapture (non-SDA)" },
  { pattern: /sunday\s+(is|as)\s+(the\s+)?true\s+sabbath/i, warning: "Sunday sacredness teaching detected" },
  { pattern: /sabbath\s+(was|is)\s+done\s+away/i, warning: "Anti-Sabbath teaching detected" },
];

function scanForDoctrinalIssues(content: string): string[] {
  const warnings: string[] = [];
  
  for (const indicator of OFFSHOOT_INDICATORS) {
    if (indicator.pattern.test(content)) {
      if (!warnings.includes(indicator.warning)) {
        warnings.push(indicator.warning);
      }
    }
  }
  
  return warnings;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sermonOutline, sermonTitle, preacher, sermonDate, sourceType, isVerifiedChannel } = await req.json();

    if (!sermonOutline) {
      return new Response(
        JSON.stringify({ error: "Sermon outline is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Scan for doctrinal issues
    const doctrinalWarnings = scanForDoctrinalIssues(sermonOutline);
    
    // Log source verification status
    console.log(`Processing sermon: "${sermonTitle || 'Untitled'}"`);
    console.log(`Source type: ${sourceType || 'unknown'}, Verified channel: ${isVerifiedChannel || false}`);
    if (doctrinalWarnings.length > 0) {
      console.log(`⚠️ Doctrinal warnings detected: ${doctrinalWarnings.join(", ")}`);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Add extra caution instructions if content is unverified or has warnings
    const cautionLevel = !isVerifiedChannel || doctrinalWarnings.length > 0 
      ? "HIGH CAUTION" 
      : "STANDARD";

    const systemPrompt = `You are a biblical scholar and Phototheology expert creating an amplified small group study from a sermon outline.

⚠️ CRITICAL THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. AZAZEL = SATAN, NOT CHRIST: In Leviticus 16, Azazel (scapegoat) represents SATAN. NEVER identify it as Jesus.
2. LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome/Papal power. NEVER say Antiochus Epiphanes.
3. TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
4. DAY OF ATONEMENT = 1844: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
5. FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.
6. HEBREWS CLARITY: Hebrews contrasts earthly vs heavenly sanctuary, NOT Holy vs Most Holy Place.

⚠️ CAUTION LEVEL: ${cautionLevel}
${doctrinalWarnings.length > 0 ? `\n⚠️ PRE-SCAN DETECTED POTENTIAL ISSUES:\n${doctrinalWarnings.map(w => `- ${w}`).join('\n')}\n\nBe extra vigilant in assessment. Flag any problematic claims as "questionable" with clear reasoning.` : ''}

${!isVerifiedChannel ? `\n⚠️ UNVERIFIED SOURCE: This content was NOT verified as coming from the church's registered YouTube channel. Apply heightened scrutiny.` : ''}

Your task is to:

1. EXPAND each sermon point with:
   - Deep biblical analysis and cross-references
   - Hebrew/Greek word studies where relevant
   - Historical and cultural context
   - Scholarly support from trusted sources

2. ASSESS each theological claim:
   - Mark as SUPPORTED (✔), NEEDS NUANCE (⚠), or QUESTIONABLE (❌)
   - Provide brief reasoning for assessment
   - BE ESPECIALLY VIGILANT for non-SDA doctrines, conspiracy theories, anti-Trinitarian ideas

3. CREATE discussion questions that:
   - Start with observation (what does the text say?)
   - Move to interpretation (what does it mean?)
   - End with application (how do we live this?)

4. APPLY Phototheology Palace methodology:
   - CR (Concentration Room): Christ-centered focus
   - OR (Observation Room): Key details to notice
   - ST (Symbols/Types): Symbolic connections
   - DR (Dimensions): Literal, Christ, Me, Church, Heaven
   - BL (Blue Room/Sanctuary): Sanctuary connections
   - PRm (Patterns): Biblical patterns
   - P‖ (Parallels): Scripture parallels

5. ALL Scripture quotes MUST be KJV (King James Version)

6. If ANY content appears to promote offshoot ideas, conspiracy theories, anti-Trinity views, or non-SDA doctrines, include a "doctrinalWarnings" array in your response listing specific concerns.

Respond ONLY with valid JSON in this exact format:
{
  "studyTitle": "string",
  "overview": "string (2-3 paragraphs summarizing the study)",
  "doctrinalWarnings": ["string array of any doctrinal concerns detected - empty if none"],
  "iceBreakers": ["string", "string"],
  "sections": [
    {
      "sectionNumber": 1,
      "title": "string",
      "originalPoint": "string (from sermon)",
      "biblicalBasis": {
        "primaryTexts": ["verse reference - KJV text"],
        "supportingTexts": ["verse reference - KJV text"]
      },
      "analysis": "string (detailed biblical analysis)",
      "scholarlySupport": "string (scholarly insights)",
      "assessment": {
        "rating": "supported|needs-nuance|questionable",
        "reasoning": "string"
      },
      "ptConnections": {
        "rooms": ["CR", "OR", etc.],
        "insights": "string"
      },
      "discussionQuestions": [
        {
          "question": "string",
          "type": "observation|interpretation|application",
          "ptRoom": "string"
        }
      ]
    }
  ],
  "christSynthesis": "string (how all points unite in Christ)",
  "sanctuaryConnection": "string (Blue Room connection)",
  "discussionQuestions": [
    {
      "question": "string",
      "type": "observation|interpretation|application",
      "ptRoom": "string"
    }
  ],
  "actionChallenge": "string (practical weekly challenge)",
  "prayerFocus": "string (guided prayer themes)",
  "furtherStudy": ["string (additional resources/passages)"],
  "facilitatorNotes": "string (tips for group leaders)"
}`;

    const userPrompt = `Create an amplified small group study from this sermon outline:

SERMON TITLE: ${sermonTitle || "Untitled Sermon"}
PREACHER: ${preacher || "Unknown"}
DATE: ${sermonDate || "Not specified"}
SOURCE VERIFICATION: ${isVerifiedChannel ? "✓ Verified church channel" : "⚠️ Unverified source"}

SERMON OUTLINE:
${sermonOutline}

Generate a comprehensive, Christ-centered study that expands on each point while maintaining theological accuracy. Include Phototheology Palace connections throughout. If you detect any concerning doctrinal content, flag it in the doctrinalWarnings array.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 16000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response with robust extraction
    let studyData: Record<string, unknown> = {};
    try {
      let jsonStr = content.trim();
      
      console.log("Raw AI response length:", jsonStr.length);
      console.log("First 100 chars:", jsonStr.substring(0, 100));
      
      // Step 1: Remove markdown code blocks with multiple approaches
      // Handle ```json ... ``` pattern
      const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
        console.log("Extracted from code block, length:", jsonStr.length);
      } else {
        // No code block found, try to strip any leading/trailing backticks
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      }
      
      // Step 2: Find the JSON object boundaries (first { to last })
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        console.log("Extracted JSON object, length:", jsonStr.length);
      }
      
      // Step 3: Clean up common JSON issues
      // Remove trailing commas before } or ]
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
      // Remove any control characters
      jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
      
      console.log("Cleaned JSON starts with:", jsonStr.substring(0, 80));
      
      // Step 4: Parse the JSON
      studyData = JSON.parse(jsonStr);
      
      // Merge pre-scan warnings with AI-detected warnings
      if (doctrinalWarnings.length > 0) {
        const existingWarnings = Array.isArray(studyData.doctrinalWarnings) ? studyData.doctrinalWarnings : [];
        studyData.doctrinalWarnings = [
          ...existingWarnings,
          ...doctrinalWarnings.filter(w => !existingWarnings.includes(w))
        ];
      }
      
      console.log("Successfully parsed study with", Object.keys(studyData).length, "fields");
      console.log("Study has sections:", Array.isArray(studyData.sections) ? studyData.sections.length : 0);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw content first 1000 chars:", content.substring(0, 1000));
      console.log("Raw content last 500 chars:", content.substring(content.length - 500));
      
      // Attempt a more aggressive extraction - try to fix truncated JSON
      try {
        // Find JSON by looking for studyTitle pattern
        const studyTitleMatch = content.match(/\{\s*"studyTitle"\s*:\s*"[^"]+"/);
        if (studyTitleMatch) {
          const startIndex = content.indexOf(studyTitleMatch[0]);
          let extracted = content.substring(startIndex);
          
          // Try to close any unclosed brackets/braces to make valid JSON
          let braceCount = 0;
          let bracketCount = 0;
          let inString = false;
          let lastValidIndex = 0;
          
          for (let i = 0; i < extracted.length; i++) {
            const char = extracted[i];
            const prevChar = i > 0 ? extracted[i-1] : '';
            
            if (char === '"' && prevChar !== '\\') {
              inString = !inString;
            }
            
            if (!inString) {
              if (char === '{') braceCount++;
              if (char === '}') {
                braceCount--;
                if (braceCount >= 0) lastValidIndex = i;
              }
              if (char === '[') bracketCount++;
              if (char === ']') {
                bracketCount--;
                if (bracketCount >= 0) lastValidIndex = i;
              }
            }
          }
          
          // Take content up to last valid closing, then close remaining
          let fixedJson = extracted.substring(0, lastValidIndex + 1);
          
          // Close any remaining open structures
          while (bracketCount > 0) { fixedJson += ']'; bracketCount--; }
          while (braceCount > 0) { fixedJson += '}'; braceCount--; }
          
          // Clean up trailing commas before closing brackets
          fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
          
          studyData = JSON.parse(fixedJson);
          console.log("Recovery successful! Parsed study with", Object.keys(studyData).length, "fields");
        }
      } catch (recoveryError) {
        console.error("Recovery parse also failed:", recoveryError);
        // Return raw content if parsing fails - frontend can still display it
        studyData = { 
          rawContent: content, 
          parseError: true, 
          doctrinalWarnings,
          studyTitle: sermonTitle || "Generated Study",
          overview: "The AI generated content but it couldn't be automatically formatted. Please review the raw content below and try again with a shorter sermon transcript."
        };
      }
    }

    return new Response(
      JSON.stringify({ success: true, study: studyData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate amplified study error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
