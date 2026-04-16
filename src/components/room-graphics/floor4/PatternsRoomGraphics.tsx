import React from 'react';

// Patterns Room Method Flowchart
export function PatternsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="prm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="50%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="prm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
        <linearGradient id="prm-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
        <filter id="prm-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="prm-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#prm-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#6B21A8" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Patterns Room: God's Fingerprints in Scripture
      </text>

      {/* Pattern Visual */}
      <g transform="translate(100, 80)">
        {/* Repeating Pattern */}
        {[1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${(i - 1) * 200}, 0)`}>
            <circle cx="80" cy="50" r="40" fill={i === 2 ? 'url(#prm-grad)' : '#E9D5FF'} stroke="#A855F7" strokeWidth="2" />
            <text x="80" y="55" textAnchor="middle" fill={i === 2 ? 'white' : '#6B21A8'} fontSize="14" fontWeight="bold">
              {i === 1 ? '3 Days' : i === 2 ? '3 Days' : '3 Days'}
            </text>
            {i < 3 && (
              <path d="M130 50 L170 50" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrow-prm)" />
            )}
          </g>
        ))}
        <defs>
          <marker id="arrow-prm" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#A855F7" />
          </marker>
        </defs>

        <text x="280" y="120" textAnchor="middle" fill="#6B21A8" fontSize="12">
          Jonah | Joseph | Jesus — Same pattern, different stories
        </text>
      </g>

      {/* Common Patterns */}
      <rect x="50" y="170" width="700" height="140" rx="12" fill="white" stroke="#A855F7" strokeWidth="2" />
      <text x="400" y="195" textAnchor="middle" fill="#6B21A8" fontSize="14" fontWeight="bold">
        Major Biblical Patterns
      </text>

      <g transform="translate(60, 210)">
        {[
          { pattern: '3 Days', examples: 'Jonah, Joseph, Jesus resurrection' },
          { pattern: '40 Days/Years', examples: 'Flood, Moses, Elijah, Jesus' },
          { pattern: '7 Days/Years', examples: 'Creation, feasts, Daniel' },
          { pattern: '12', examples: 'Tribes, apostles, foundations' },
          { pattern: 'Lifted Up', examples: 'Serpent, Jesus, exaltation' },
          { pattern: 'Wilderness', examples: 'Israel, Jesus, church' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 225}, ${Math.floor(i / 3) * 45})`}>
            <rect x="0" y="0" width="215" height="40" rx="8" fill="#F3E8FF" />
            <text x="50" y="18" fill="#6B21A8" fontSize="10" fontWeight="bold">{item.pattern}</text>
            <text x="110" y="32" textAnchor="middle" fill="#9333EA" fontSize="8">{item.examples}</text>
          </g>
        ))}
      </g>

      {/* Method */}
      <rect x="50" y="330" width="700" height="80" rx="12" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" />
      <text x="400" y="360" textAnchor="middle" fill="#6B21A8" fontSize="16" fontWeight="bold">
        The Pattern Recognition Method
      </text>
      <text x="400" y="385" textAnchor="middle" fill="#7C3AED" fontSize="12">
        When you see something repeated 3+ times, you've found a divine pattern
      </text>
      <text x="400" y="405" textAnchor="middle" fill="#7C3AED" fontSize="11">
        Track it, trace it, teach it — patterns are intentional
      </text>

      {/* Key Principle */}
      <rect x="50" y="430" width="700" height="50" rx="12" fill="#A855F7" />
      <text x="400" y="460" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        "God repeats what He wants you to remember"
      </text>
    </svg>
  );
}

// Patterns Room Concept Infographic
export function PatternsRoomConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#FAF5FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#6B21A8" fontSize="22" fontWeight="bold">
        Pattern Categories
      </text>

      {/* Pattern Types */}
      <g transform="translate(50, 55)">
        {[
          { type: 'Numeric', icon: '🔢', desc: 'Numbers that repeat: 3, 7, 12, 40, 70', example: '40 days: Noah, Moses, Elijah, Jesus' },
          { type: 'Structural', icon: '🏗️', desc: 'Literary forms: chiasm, parallelism', example: 'Genesis 1 parallels Genesis 2' },
          { type: 'Typological', icon: '🔄', desc: 'People/events foreshadowing Christ', example: 'Joseph, Moses, David → Jesus' },
          { type: 'Thematic', icon: '🎯', desc: 'Recurring motifs and concepts', example: 'Water, blood, bread throughout Scripture' },
          { type: 'Chronological', icon: '⏰', desc: 'Time-based repetitions', example: '7-year cycles, jubilee patterns' },
          { type: 'Geographical', icon: '🗺️', desc: 'Place-based patterns', example: 'Mountains, rivers, wilderness' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 130})`}>
            <rect x="0" y="0" width="220" height="120" rx="12" fill="white" stroke="#A855F7" strokeWidth="2" />
            <text x="110" y="30" textAnchor="middle" fontSize="24">{item.icon}</text>
            <text x="110" y="50" textAnchor="middle" fill="#6B21A8" fontSize="12" fontWeight="bold">{item.type}</text>
            <text x="110" y="70" textAnchor="middle" fill="#7C3AED" fontSize="9">{item.desc}</text>
            <text x="110" y="100" textAnchor="middle" fill="#9333EA" fontSize="8" fontStyle="italic">{item.example}</text>
          </g>
        ))}
      </g>

      {/* Pattern Discovery Process */}
      <rect x="50" y="330" width="700" height="100" rx="12" fill="white" stroke="#A855F7" strokeWidth="2" />
      <text x="400" y="355" textAnchor="middle" fill="#6B21A8" fontSize="14" fontWeight="bold">
        Pattern Discovery Process
      </text>
      <g transform="translate(80, 370)">
        {['Notice Repetition', 'Gather 3+ Examples', 'Identify Variations', 'Extract Meaning', 'Apply Today'].map((step, i) => (
          <g key={i} transform={`translate(${i * 130}, 0)`}>
            <circle cx="20" cy="15" r="15" fill="#A855F7" />
            <text x="20" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{i + 1}</text>
            <text x="60" y="20" fill="#6B21A8" fontSize="9">{step}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#A855F7" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Pattern Tracker
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#E9D5FF" fontSize="12">
        Pattern Name + 3+ Examples + Meaning + Application = Pattern Mastery
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#E9D5FF" fontSize="11">
        Build your library of divine patterns
      </text>
    </svg>
  );
}

// Patterns Room Example
export function PatternsRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#FAF5FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#6B21A8" fontSize="22" fontWeight="bold">
        Example: The "3 Days" Pattern
      </text>

      {/* Pattern Instances */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="280" rx="12" fill="white" stroke="#A855F7" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#6B21A8" fontSize="14" fontWeight="bold">
          3 Days: From Death/Darkness to Life/Light
        </text>

        {[
          { person: 'Jonah', event: '3 days in fish\'s belly', result: 'Delivered to preach', ref: 'Jonah 1:17' },
          { person: 'Joseph', event: '3 days in prison (cupbearer)', result: 'Remembered, exalted', ref: 'Gen 40:12-13' },
          { person: 'Abraham', event: '3 days journey to Moriah', result: 'Isaac "raised" back', ref: 'Gen 22:4' },
          { person: 'Esther', event: '3 days of fasting', result: 'Deliverance granted', ref: 'Esther 4:16' },
          { person: 'Hosea', event: '"On 3rd day He will raise us"', result: 'National restoration', ref: 'Hosea 6:2' },
          { person: 'Jesus', event: '3 days in the tomb', result: 'RESURRECTION', ref: 'Matt 12:40' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 350 + 15}, ${Math.floor(i / 2) * 70 + 45})`}>
            <rect x="0" y="0" width="330" height="60" rx="8" fill={i === 5 ? '#F3E8FF' : '#FAFAF9'} stroke={i === 5 ? '#A855F7' : '#E9D5FF'} strokeWidth={i === 5 ? 2 : 1} />
            <text x="165" y="18" textAnchor="middle" fill="#6B21A8" fontSize="11" fontWeight="bold">{item.person}</text>
            <text x="165" y="35" textAnchor="middle" fill="#7C3AED" fontSize="9">{item.event}</text>
            <text x="165" y="52" textAnchor="middle" fill="#9333EA" fontSize="8">→ {item.result} ({item.ref})</text>
          </g>
        ))}
      </g>

      {/* Pattern Analysis */}
      <g transform="translate(50, 350)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#6B21A8" fontSize="14" fontWeight="bold">
          Pattern Analysis
        </text>
        <text x="20" y="50" fill="#7C3AED" fontSize="11">
          <tspan fontWeight="bold">The Pattern:</tspan> 3 days of darkness/death/waiting → breakthrough/life/deliverance
        </text>
        <text x="20" y="70" fill="#7C3AED" fontSize="11">
          <tspan fontWeight="bold">The Point:</tspan> God uses periods of apparent defeat to set up ultimate victory
        </text>
        <text x="20" y="90" fill="#7C3AED" fontSize="11">
          <tspan fontWeight="bold">The Fulfillment:</tspan> Jesus' resurrection is the ultimate "3 days" — all others pointed here
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="465" width="700" height="70" rx="12" fill="#A855F7" />
      <text x="400" y="495" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        6 Examples = Undeniable Divine Pattern
      </text>
      <text x="400" y="518" textAnchor="middle" fill="#E9D5FF" fontSize="11">
        When you're in your "3 days," trust the pattern — resurrection is coming
      </text>
    </svg>
  );
}

export default {
  PatternsRoomFlowchart,
  PatternsRoomConcept,
  PatternsRoomExample
};
