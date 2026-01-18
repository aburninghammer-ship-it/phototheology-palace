import React from 'react';

// Def-Com Room Method Flowchart
export function DefComRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="50%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#99F6E4" />
        </linearGradient>
        <linearGradient id="dc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        <linearGradient id="dc-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <filter id="dc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="dc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#dc-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#0F766E" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Def-Com Room: Define Terms & Consult Sources
      </text>

      {/* Two Main Branches */}
      <g transform="translate(50, 70)" filter="url(#dc-shadow)">
        {/* DEF Branch */}
        <rect x="0" y="0" width="320" height="180" rx="12" fill="url(#dc-grad)" />
        <text x="160" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">DEF</text>
        <text x="160" y="60" textAnchor="middle" fill="#CCFBF1" fontSize="14">Define Key Terms</text>

        <rect x="20" y="80" width="280" height="80" rx="8" fill="white" fillOpacity="0.95" />
        <text x="160" y="105" textAnchor="middle" fill="#0F766E" fontSize="12" fontWeight="bold">Process:</text>
        <text x="30" y="125" fill="#115E59" fontSize="11">1. Circle unfamiliar words</text>
        <text x="30" y="142" fill="#115E59" fontSize="11">2. Look up Hebrew/Greek meanings</text>
        <text x="30" y="159" fill="#115E59" fontSize="11">3. Check cross-references for usage</text>
      </g>

      <g transform="translate(430, 70)" filter="url(#dc-shadow)">
        {/* COM Branch */}
        <rect x="0" y="0" width="320" height="180" rx="12" fill="url(#dc-grad)" />
        <text x="160" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">COM</text>
        <text x="160" y="60" textAnchor="middle" fill="#CCFBF1" fontSize="14">Consult Commentaries</text>

        <rect x="20" y="80" width="280" height="80" rx="8" fill="white" fillOpacity="0.95" />
        <text x="160" y="105" textAnchor="middle" fill="#0F766E" fontSize="12" fontWeight="bold">Process:</text>
        <text x="30" y="125" fill="#115E59" fontSize="11">1. Read 2-3 commentaries</text>
        <text x="30" y="142" fill="#115E59" fontSize="11">2. Note points of agreement</text>
        <text x="30" y="159" fill="#115E59" fontSize="11">3. Note points of disagreement</text>
      </g>

      {/* Merge Arrow */}
      <path d="M210 260 L400 310 M590 260 L400 310" stroke="#14B8A6" strokeWidth="3" fill="none" />
      <polygon points="400,310 390,295 410,295" fill="#14B8A6" filter="url(#dc-glow)" />

      {/* Combined Output */}
      <g filter="url(#dc-shadow)">
        <rect x="200" y="320" width="400" height="80" rx="12" fill="url(#dc-header)" />
        <text x="400" y="355" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          Combined Definition Sheet
        </text>
        <text x="400" y="380" textAnchor="middle" fill="#CCFBF1" fontSize="12">
          Word definitions + scholarly insights = solid foundation
        </text>
      </g>

      {/* Tools List */}
      <g filter="url(#dc-shadow)">
        <rect x="50" y="420" width="700" height="60" rx="10" fill="white" fillOpacity="0.95" stroke="#14B8A6" strokeWidth="2" />
        <text x="400" y="445" textAnchor="middle" fill="#0F766E" fontSize="14" fontWeight="bold">
          Recommended Tools: Strong's Concordance | Vine's Dictionary | BDB | TWOT | SDA Bible Commentary
        </text>
        <text x="400" y="465" textAnchor="middle" fill="#115E59" fontSize="11">
          Blue Letter Bible | Bible Hub | e-Sword (free digital resources)
        </text>
      </g>
    </svg>
  );
}

// Def-Com Room Concept Infographic
export function DefComRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dc2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="50%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#99F6E4" />
        </linearGradient>
        <linearGradient id="dc2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <filter id="dc2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#dc2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#0F766E" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Why Def-Com Matters
      </text>

      {/* The Problem */}
      <g transform="translate(50, 60)" filter="url(#dc2-shadow)">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#FEE2E2" fillOpacity="0.95" stroke="#EF4444" strokeWidth="2" />
        <text x="160" y="30" textAnchor="middle" fill="#991B1B" fontSize="16" fontWeight="bold">
          Without Def-Com
        </text>
        <text x="20" y="60" fill="#B91C1C" fontSize="12">• Reading English translations only</text>
        <text x="20" y="85" fill="#B91C1C" fontSize="12">• Missing Hebrew/Greek nuances</text>
        <text x="20" y="110" fill="#B91C1C" fontSize="12">• Reinventing interpretive wheels</text>
        <text x="20" y="135" fill="#B91C1C" fontSize="12">• Missing historical context</text>
        <text x="20" y="160" fill="#B91C1C" fontSize="12">• Prone to eisegesis (reading IN)</text>
      </g>

      {/* The Solution */}
      <g transform="translate(430, 60)" filter="url(#dc2-shadow)">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#D1FAE5" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <text x="160" y="30" textAnchor="middle" fill="#065F46" fontSize="16" fontWeight="bold">
          With Def-Com
        </text>
        <text x="20" y="60" fill="#047857" fontSize="12">• Accessing original language depth</text>
        <text x="20" y="85" fill="#047857" fontSize="12">• Understanding word ranges</text>
        <text x="20" y="110" fill="#047857" fontSize="12">• Standing on scholarly shoulders</text>
        <text x="20" y="135" fill="#047857" fontSize="12">• Grasping historical setting</text>
        <text x="20" y="160" fill="#047857" fontSize="12">• Practicing exegesis (reading OUT)</text>
      </g>

      {/* Definition Example */}
      <g filter="url(#dc2-shadow)">
        <rect x="50" y="260" width="700" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#14B8A6" strokeWidth="2" />
        <text x="400" y="290" textAnchor="middle" fill="#0F766E" fontSize="16" fontWeight="bold">
          Example: "Repent" (Greek: metanoia)
        </text>
        <text x="70" y="320" fill="#115E59" fontSize="12">
          English: "Feel sorry" → Greek: "Change of mind" (meta = change, noia = mind)
        </text>
        <text x="70" y="345" fill="#115E59" fontSize="12">
          Implication: Repentance is cognitive transformation, not just emotional regret
        </text>
        <text x="70" y="370" fill="#0F766E" fontSize="11" fontStyle="italic">
          This definition changes how you read every verse about repentance!
        </text>
      </g>

      {/* Deliverable */}
      <g filter="url(#dc2-shadow)">
        <rect x="50" y="400" width="700" height="80" rx="12" fill="#CCFBF1" fillOpacity="0.9" stroke="#14B8A6" strokeWidth="2" />
        <text x="400" y="430" textAnchor="middle" fill="#0F766E" fontSize="14" fontWeight="bold">
          Deliverable: Definition Sheet
        </text>
        <text x="400" y="455" textAnchor="middle" fill="#115E59" fontSize="12">
          Word | Original Language | Meaning Range | Commentary Insights | Cross-References
        </text>
      </g>
    </svg>
  );
}

// Def-Com Room Example
export function DefComRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dc3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="50%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#99F6E4" />
        </linearGradient>
        <linearGradient id="dc3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <filter id="dc3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#dc3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#0F766E" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: John 3:16 Def-Com Analysis
      </text>

      {/* Verse Display */}
      <g filter="url(#dc3-shadow)">
        <rect x="50" y="55" width="700" height="50" rx="10" fill="white" fillOpacity="0.95" stroke="#14B8A6" strokeWidth="2" />
        <text x="400" y="85" textAnchor="middle" fill="#115E59" fontSize="13" fontStyle="italic">
          "For God so loved the world, that he gave his only begotten Son..."
        </text>
      </g>

      {/* Definition Cards */}
      <g transform="translate(50, 120)">
        {[
          { word: 'loved', greek: 'agapaō', meaning: 'Sacrificial, unconditional love (not phileo/eros)', insight: 'Covenantal commitment, not feeling' },
          { word: 'world', greek: 'kosmos', meaning: 'Created order, humanity, or worldly system', insight: 'Context: humanity as object of love' },
          { word: 'only begotten', greek: 'monogenēs', meaning: 'Unique, one-of-a-kind (not "only born")', insight: 'Emphasizes uniqueness, not origin' },
          { word: 'gave', greek: 'didōmi', meaning: 'To give, grant, bestow freely', insight: 'Voluntary gift, not forced payment' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 350}, ${Math.floor(i / 2) * 110})`} filter="url(#dc3-shadow)">
            <rect x="0" y="0" width="340" height="100" rx="10" fill="white" fillOpacity="0.95" stroke="#14B8A6" strokeWidth="2" />
            <rect x="0" y="0" width="340" height="30" rx="10" fill="url(#dc3-header)" />
            <text x="170" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              "{item.word}" — {item.greek}
            </text>
            <text x="15" y="50" fill="#0F766E" fontSize="11" fontWeight="bold">Meaning:</text>
            <text x="15" y="65" fill="#115E59" fontSize="10">{item.meaning}</text>
            <text x="15" y="85" fill="#0F766E" fontSize="11" fontWeight="bold">Insight:</text>
            <text x="70" y="85" fill="#115E59" fontSize="10">{item.insight}</text>
          </g>
        ))}
      </g>

      {/* Commentary Summary */}
      <g filter="url(#dc3-shadow)">
        <rect x="50" y="350" width="700" height="100" rx="12" fill="#CCFBF1" fillOpacity="0.9" stroke="#14B8A6" strokeWidth="2" />
        <text x="400" y="378" textAnchor="middle" fill="#0F766E" fontSize="14" fontWeight="bold">
          Commentary Consensus:
        </text>
        <text x="70" y="405" fill="#115E59" fontSize="11">
          • John presents God's love as active, sacrificial, and universal in scope
        </text>
        <text x="70" y="425" fill="#115E59" fontSize="11">
          • "Monogenēs" emphasizes Jesus' unique relationship to the Father, not physical generation
        </text>
        <text x="70" y="445" fill="#115E59" fontSize="11">
          • The giving is voluntary and rooted in divine love, not human merit
        </text>
      </g>

      {/* Application */}
      <g filter="url(#dc3-shadow)">
        <rect x="50" y="465" width="700" height="65" rx="10" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="495" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          Def-Com Insight: God's love is covenantal commitment expressed through
        </text>
        <text x="400" y="515" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          the voluntary gift of His unique Son—not emotion, but action.
        </text>
      </g>
    </svg>
  );
}

export default {
  DefComRoomFlowchart,
  DefComRoomConcept,
  DefComRoomExample
};
