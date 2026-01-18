import React from 'react';

// Juice Room Method Flowchart - Three Juicing Modes
export function JuiceRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="50%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="jr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="jr-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <filter id="jr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="jr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#jr-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#C2410C" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Juice Room: Extract Maximum Meaning
      </text>
      <text x="400" y="55" textAnchor="middle" fill="#EA580C" fontSize="12">
        "Much from little. Little from much."
      </text>

      {/* Reverse Funnel Visual */}
      <polygon points="400,75 480,145 320,145" fill="url(#jr-grad)" filter="url(#jr-glow)" />
      <text x="400" y="125" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">1 VERSE</text>

      {/* Three Modes - Horizontal */}
      {/* Mode 1: Micro */}
      <g transform="translate(130, 175)">
        <rect x="0" y="0" width="180" height="180" rx="12" fill="#22C55E" />
        <circle cx="90" cy="35" r="20" fill="white" />
        <text x="90" y="42" textAnchor="middle" fill="#22C55E" fontSize="20" fontWeight="bold">1</text>
        <text x="90" y="70" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">MICRO-JUICING</text>
        <text x="90" y="88" textAnchor="middle" fill="#BBF7D0" fontSize="11">VERSE LEVEL</text>

        <text x="90" y="110" textAnchor="middle" fill="white" fontSize="10">Extract 5 types of juice:</text>
        <text x="20" y="128" fill="#DCFCE7" fontSize="9">• Doctrinal</text>
        <text x="100" y="128" fill="#DCFCE7" fontSize="9">• Narrative</text>
        <text x="20" y="143" fill="#DCFCE7" fontSize="9">• Christological</text>
        <text x="100" y="143" fill="#DCFCE7" fontSize="9">• Practical</text>
        <text x="20" y="158" fill="#DCFCE7" fontSize="9">• Prophetic</text>

        <text x="90" y="175" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontStyle="italic">"Pull much from little"</text>
      </g>

      {/* Mode 2: Meso */}
      <g transform="translate(310, 175)">
        <rect x="0" y="0" width="180" height="180" rx="12" fill="#EAB308" />
        <circle cx="90" cy="35" r="20" fill="white" />
        <text x="90" y="42" textAnchor="middle" fill="#EAB308" fontSize="20" fontWeight="bold">2</text>
        <text x="90" y="70" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">MESO-JUICING</text>
        <text x="90" y="88" textAnchor="middle" fill="#FEF9C3" fontSize="11">CHAPTER LEVEL</text>

        <text x="90" y="108" textAnchor="middle" fill="white" fontSize="10">"Can this chapter</text>
        <text x="90" y="122" textAnchor="middle" fill="white" fontSize="10">preach itself?"</text>
        <text x="20" y="142" fill="#FEF9C3" fontSize="9">• Central tension</text>
        <text x="20" y="157" fill="#FEF9C3" fontSize="9">• Flow of argument</text>
        <text x="20" y="172" fill="#FEF9C3" fontSize="9">• What would be lost?</text>
      </g>

      {/* Mode 3: Macro */}
      <g transform="translate(490, 175)">
        <rect x="0" y="0" width="180" height="180" rx="12" fill="#EF4444" />
        <circle cx="90" cy="35" r="20" fill="white" />
        <text x="90" y="42" textAnchor="middle" fill="#EF4444" fontSize="20" fontWeight="bold">3</text>
        <text x="90" y="70" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">MACRO-JUICING</text>
        <text x="90" y="88" textAnchor="middle" fill="#FECACA" fontSize="11">BOOK LEVEL</text>

        <text x="90" y="108" textAnchor="middle" fill="white" fontSize="10">"Explain in 60 sec"</text>
        <text x="20" y="128" fill="#FECACA" fontSize="9">• 1-sentence thesis</text>
        <text x="20" y="143" fill="#FECACA" fontSize="9">• 1-paragraph summary</text>
        <text x="20" y="158" fill="#FECACA" fontSize="9">• 1-word identity</text>
        <text x="90" y="175" textAnchor="middle" fill="#FECACA" fontSize="9" fontStyle="italic">"Little from much"</text>
      </g>

      {/* Arrows connecting */}
      <path d="M310 265 L330 265" stroke="#9CA3AF" strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M490 265 L510 265" stroke="#9CA3AF" strokeWidth="2" markerEnd="url(#arrow)" />

      {/* Compression Ladder */}
      <rect x="100" y="370" width="600" height="55" rx="10" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
      <text x="400" y="392" textAnchor="middle" fill="#C2410C" fontSize="13" fontWeight="bold">
        🪜 COMPRESSION LADDER DRILL
      </text>
      <text x="400" y="412" textAnchor="middle" fill="#EA580C" fontSize="11">
        1 Paragraph → 1 Sentence → 5 Words → 1 Word
      </text>

      {/* Guardrail */}
      <rect x="100" y="435" width="600" height="50" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" />
      <text x="400" y="455" textAnchor="middle" fill="#991B1B" fontSize="11" fontWeight="bold">
        ⚠️ GUARDRAIL: If it cannot be pointed to in the text, it is NOT juice
      </text>
      <text x="400" y="472" textAnchor="middle" fill="#B91C1C" fontSize="10">
        Never treat imagination as meaning • Never confuse cross-references with extraction
      </text>
    </svg>
  );
}

// Juice Room Concept Infographic - Scale Visualization
export function JuiceRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jr-orange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#jr-orange)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#9A3412" fontSize="20" fontWeight="bold">
        The Juicing Scale: Verse → Chapter → Book
      </text>

      {/* Visual Scale - Three orange segments increasing in size */}
      {/* Verse - Small orange */}
      <g transform="translate(100, 80)">
        <ellipse cx="60" cy="90" rx="50" ry="55" fill="#F97316" />
        <ellipse cx="60" cy="60" rx="40" ry="20" fill="#FB923C" />
        <text x="60" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">VERSE</text>
        <text x="60" y="170" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">5-15 words</text>
        <text x="60" y="188" textAnchor="middle" fill="#C2410C" fontSize="10">EXPLODE</text>
        <text x="60" y="205" textAnchor="middle" fill="#EA580C" fontSize="9">Extract every layer</text>
      </g>

      {/* Chapter - Medium orange */}
      <g transform="translate(310, 70)">
        <ellipse cx="90" cy="105" rx="75" ry="85" fill="#F97316" />
        <ellipse cx="90" cy="60" rx="60" ry="25" fill="#FB923C" />
        <text x="90" y="110" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">CHAPTER</text>
        <text x="90" y="200" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">20-50 verses</text>
        <text x="90" y="218" textAnchor="middle" fill="#C2410C" fontSize="10">STRUCTURE</text>
        <text x="90" y="235" textAnchor="middle" fill="#EA580C" fontSize="9">Find the skeleton</text>
      </g>

      {/* Book - Large orange */}
      <g transform="translate(530, 55)">
        <ellipse cx="120" cy="130" rx="100" ry="115" fill="#F97316" />
        <ellipse cx="120" cy="60" rx="80" ry="32" fill="#FB923C" />
        <text x="120" y="135" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">BOOK</text>
        <text x="120" y="230" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">10-150 chapters</text>
        <text x="120" y="248" textAnchor="middle" fill="#C2410C" fontSize="10">COMPRESS</text>
        <text x="120" y="265" textAnchor="middle" fill="#EA580C" fontSize="9">Distill to essence</text>
      </g>

      {/* Direction arrows */}
      <path d="M210 130 L280 130" stroke="#9A3412" strokeWidth="3" fill="none" markerEnd="url(#arr)" />
      <path d="M470 130 L520 130" stroke="#9A3412" strokeWidth="3" fill="none" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#9A3412" />
        </marker>
      </defs>

      {/* Core Questions Section */}
      <rect x="50" y="295" width="700" height="85" rx="12" fill="white" fillOpacity="0.8" />
      <text x="400" y="318" textAnchor="middle" fill="#9A3412" fontSize="14" fontWeight="bold">Core Questions for Each Scale</text>

      <text x="150" y="345" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold">VERSE:</text>
      <text x="150" y="362" textAnchor="middle" fill="#166534" fontSize="10">"How much can I pull?"</text>

      <text x="400" y="345" textAnchor="middle" fill="#EAB308" fontSize="11" fontWeight="bold">CHAPTER:</text>
      <text x="400" y="362" textAnchor="middle" fill="#A16207" fontSize="10">"Can this preach itself?"</text>

      <text x="650" y="345" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold">BOOK:</text>
      <text x="650" y="362" textAnchor="middle" fill="#B91C1C" fontSize="10">"Explain in 60 seconds?"</text>

      {/* Output Section */}
      <rect x="50" y="395" width="700" height="90" rx="12" fill="#EA580C" />
      <text x="400" y="420" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        📋 JUICE SUMMARY OUTPUT (≤150 words)
      </text>
      <text x="400" y="445" textAnchor="middle" fill="#FED7AA" fontSize="11">
        Story + Christ + Genre + Cycle + Horizon = Synthesis
      </text>
      <text x="400" y="470" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        + Final Tag Line (one punchy sentence)
      </text>
    </svg>
  );
}

// Juice Room Example - Jonah Book Juice
export function JuiceRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#FFF7ED" rx="16" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#9A3412" fontSize="18" fontWeight="bold">
        🐋 Example: JONAH JUICE (Book-Level Compression)
      </text>

      {/* Juice Extraction Visual */}
      <g transform="translate(50, 50)">
        {/* Book input */}
        <rect x="0" y="0" width="120" height="160" rx="8" fill="#92400E" />
        <rect x="10" y="10" width="100" height="140" rx="4" fill="#FDE68A" />
        <text x="60" y="60" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">JONAH</text>
        <text x="60" y="80" textAnchor="middle" fill="#A16207" fontSize="10">4 chapters</text>
        <text x="60" y="95" textAnchor="middle" fill="#A16207" fontSize="10">48 verses</text>
        <text x="60" y="115" textAnchor="middle" fill="#CA8A04" fontSize="9">~1,300 words</text>

        {/* Arrow */}
        <path d="M130 80 L180 80" stroke="#F97316" strokeWidth="4" markerEnd="url(#juicer)" />
        <text x="155" y="100" textAnchor="middle" fill="#EA580C" fontSize="10">JUICE</text>
      </g>

      {/* Juiced Output */}
      <rect x="230" y="50" width="520" height="175" rx="12" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
      <text x="490" y="75" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">
        JONAH JUICE (147 words):
      </text>

      {/* The juice text */}
      <text x="245" y="98" fill="#78350F" fontSize="9">
        <tspan x="245" dy="0">Jonah, a reluctant prophet during Israel's prosperity (@Sp cycle, ~760 BC), flees</tspan>
        <tspan x="245" dy="14">God's call to preach to Nineveh, Israel's brutal enemy. His storm-tossed flight</tspan>
        <tspan x="245" dy="14">ends in the belly of a great fish—a three-day 'tomb' foreshadowing Christ's</tspan>
        <tspan x="245" dy="14">burial and resurrection (Matt 12:40). Vomited onto dry land, Jonah obeys</tspan>
        <tspan x="245" dy="14">reluctantly, preaching judgment. Shockingly, pagan Nineveh repents in sackcloth,</tspan>
        <tspan x="245" dy="14">and God relents. Jonah, furious at God's mercy to Gentiles, sulks under a</tspan>
        <tspan x="245" dy="14">withered plant. God rebukes Jonah's tribalism: 'Should I not pity Nineveh?'</tspan>
      </text>

      {/* Tags in boxes */}
      <g transform="translate(245, 200)">
        <rect x="0" y="0" width="90" height="22" rx="4" fill="#3B82F6" />
        <text x="45" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">GENRE: Narrative</text>
      </g>
      <g transform="translate(345, 200)">
        <rect x="0" y="0" width="140" height="22" rx="4" fill="#8B5CF6" />
        <text x="70" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">CHRIST: Fish=Tomb</text>
      </g>
      <g transform="translate(495, 200)">
        <rect x="0" y="0" width="120" height="22" rx="4" fill="#10B981" />
        <text x="60" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">HORIZON: 2H Gospel</text>
      </g>

      {/* Final Tag */}
      <rect x="50" y="240" width="700" height="50" rx="10" fill="#F97316" />
      <text x="400" y="260" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        🏷️ FINAL TAG:
      </text>
      <text x="400" y="280" textAnchor="middle" fill="#FEF3C7" fontSize="13" fontWeight="bold" fontStyle="italic">
        "God's mercy defies borders, and the gospel swallows tribalism whole."
      </text>

      {/* Compression Ladder Demo */}
      <text x="400" y="315" textAnchor="middle" fill="#9A3412" fontSize="14" fontWeight="bold">
        📉 Compression Ladder Applied:
      </text>

      {/* Ladder steps */}
      <g transform="translate(50, 330)">
        <rect x="0" y="0" width="700" height="35" rx="6" fill="#DCFCE7" stroke="#22C55E" />
        <text x="15" y="22" fill="#166534" fontSize="10" fontWeight="bold">1 PARAGRAPH:</text>
        <text x="130" y="22" fill="#15803D" fontSize="9">Prophet flees → fish swallows → preaches Nineveh → city repents → Jonah angry → God rebukes tribalism</text>
      </g>

      <g transform="translate(50, 375)">
        <rect x="0" y="0" width="700" height="35" rx="6" fill="#FEF9C3" stroke="#EAB308" />
        <text x="15" y="22" fill="#A16207" fontSize="10" fontWeight="bold">1 SENTENCE:</text>
        <text x="130" y="22" fill="#CA8A04" fontSize="9">God pursues a reluctant prophet to show His mercy extends even to Israel's enemies.</text>
      </g>

      <g transform="translate(50, 420)">
        <rect x="0" y="0" width="700" height="35" rx="6" fill="#FFEDD5" stroke="#F97316" />
        <text x="15" y="22" fill="#C2410C" fontSize="10" fontWeight="bold">5 WORDS:</text>
        <text x="130" y="22" fill="#EA580C" fontSize="11" fontWeight="bold">God's mercy defies human borders</text>
      </g>

      <g transform="translate(50, 465)">
        <rect x="0" y="0" width="700" height="35" rx="6" fill="#FEE2E2" stroke="#EF4444" />
        <text x="15" y="22" fill="#B91C1C" fontSize="10" fontWeight="bold">1 WORD:</text>
        <text x="130" y="22" fill="#DC2626" fontSize="14" fontWeight="bold">MERCY</text>
      </g>

      {/* Anti-Pulp Warning */}
      <rect x="50" y="510" width="700" height="30" rx="6" fill="#FEF2F2" />
      <text x="400" y="530" textAnchor="middle" fill="#991B1B" fontSize="10">
        ⚠️ PULP CHECK: Every claim above can be pointed to in Jonah's text. No speculation = pure juice.
      </text>
    </svg>
  );
}
