import React from 'react';

// Bible Rendered Method Flowchart
export function BibleRenderedFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="br-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="50%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="br-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="br-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="br-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="br-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#br-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#065F46" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Bible Rendered: 51-Frame Compression
      </text>

      {/* The Formula */}
      <g filter="url(#br-shadow)">
        <rect x="100" y="70" width="600" height="80" rx="12" fill="white" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <text x="400" y="100" textAnchor="middle" fill="#065F46" fontSize="18" fontWeight="bold">
          1,189 chapters / 24 chapters per block = ~51 glyphs
        </text>
        <text x="400" y="130" textAnchor="middle" fill="#047857" fontSize="14">
          One symbol per 24-chapter block compresses the ENTIRE Bible into your palm
        </text>
      </g>

      {/* Step Flow */}
      <g transform="translate(50, 180)">
        {[
          { step: '1', title: 'Divide', desc: 'Split Bible into', desc2: '24-chapter blocks' },
          { step: '2', title: 'Read', desc: 'Review entire block', desc2: 'for central movement' },
          { step: '3', title: 'Assign', desc: 'Choose ONE simple', desc2: 'glyph: /, x, up, right' },
        ].map((item, i) => (
          <g key={i} filter="url(#br-shadow)">
            <rect x={i * 235} y="0" width="220" height="90" rx="12" fill="url(#br-grad)" />
            <circle cx={i * 235 + 30} cy="25" r="18" fill="white" fillOpacity="0.3" filter="url(#br-glow)" />
            <text x={i * 235 + 30} y="31" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">{item.step}</text>
            <text x={i * 235 + 110} y="30" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">{item.title}</text>
            <text x={i * 235 + 110} y="55" textAnchor="middle" fill="#D1FAE5" fontSize="12">{item.desc}</text>
            <text x={i * 235 + 110} y="75" textAnchor="middle" fill="#D1FAE5" fontSize="12">{item.desc2}</text>
            {i < 2 && (
              <polygon points={`${(i + 1) * 235 - 15},45 ${(i + 1) * 235 + 5},45 ${(i + 1) * 235 + 5},35 ${(i + 1) * 235 + 25},50 ${(i + 1) * 235 + 5},65 ${(i + 1) * 235 + 5},55 ${(i + 1) * 235 - 15},55`} fill="#10B981" />
            )}
          </g>
        ))}
      </g>

      {/* Glyph Examples */}
      <g filter="url(#br-shadow)">
        <rect x="50" y="290" width="700" height="140" rx="12" fill="white" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <rect x="50" y="290" width="700" height="35" rx="12" fill="url(#br-header)" />
        <text x="400" y="315" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" letterSpacing="0.5">
          SAMPLE GLYPH SYSTEM
        </text>
      </g>

      <g transform="translate(70, 340)">
        {[
          { glyph: '/', meaning: 'Division', example: 'Gen 1-24' },
          { glyph: 'x', meaning: 'Conflict/Cross', example: 'Gospels' },
          { glyph: 'up', meaning: 'Ascent/Rise', example: 'Ex 1-24' },
          { glyph: 'rt', meaning: 'Movement', example: 'Acts' },
          { glyph: 'O', meaning: 'Completion', example: 'Revelation' },
          { glyph: '+', meaning: 'Addition', example: 'Numbers' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 110}, 0)`}>
            <circle cx="30" cy="20" r="25" fill="url(#br-grad)" filter="url(#br-glow)" />
            <text x="30" y="28" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{item.glyph}</text>
            <text x="30" y="60" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">{item.meaning}</text>
            <text x="30" y="75" textAnchor="middle" fill="#6B7280" fontSize="9">{item.example}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// Bible Rendered Concept Infographic
export function BibleRenderedConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="br2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="50%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="br2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="br2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#br2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        The Entire Bible at a Glance
      </text>

      {/* Visual of Bible blocks */}
      <g filter="url(#br2-shadow)">
        <rect x="50" y="60" width="700" height="180" fill="white" fillOpacity="0.95" rx="12" stroke="#10B981" strokeWidth="2" />
        <text x="400" y="90" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
          Bible broken into 24-chapter blocks (~51 total)
        </text>
      </g>

      {/* Block visualization */}
      <g transform="translate(70, 110)">
        {Array.from({ length: 17 }, (_, i) => (
          <g key={i}>
            <rect x={i * 38} y="0" width="35" height="50" rx="6" fill={i < 16 ? '#D1FAE5' : '#10B981'} stroke="#10B981" strokeWidth="1" />
            <text x={i * 38 + 17} y="32" textAnchor="middle" fill={i < 16 ? '#065F46' : 'white'} fontSize="14" fontWeight="bold">
              {['/', '/', 'up', 'rt', '~', '+', '=', 'dn', 'up', 'x', 'O', 'rt', '^', 'up', 'O', '+', '*'][i]}
            </text>
          </g>
        ))}
        <text x="320" y="70" textAnchor="middle" fill="#6B7280" fontSize="11">...51 glyphs total...</text>
      </g>

      {/* Block detail */}
      <g transform="translate(70, 180)">
        {[
          { block: 'Gen 1-24', glyph: '/', desc: 'Divisions' },
          { block: 'Gen 25-50', glyph: 'SEED', desc: 'Promise line' },
          { block: 'Ex 1-24', glyph: 'up', desc: 'Ascent from slavery' },
        ].map((item, i) => (
          <rect key={i} x={i * 190} y="0" width="180" height="35" fill="#FEF3C7" rx="6" stroke="#F59E0B" strokeWidth="1" />
        ))}
        <text x="90" y="23" textAnchor="middle" fill="#92400E" fontSize="11">Gen 1-24 = /</text>
        <text x="280" y="23" textAnchor="middle" fill="#92400E" fontSize="11">Gen 25-50 = SEED</text>
        <text x="470" y="23" textAnchor="middle" fill="#92400E" fontSize="11">Ex 1-24 = up</text>
      </g>

      {/* Why this works */}
      <g filter="url(#br2-shadow)">
        <rect x="50" y="260" width="340" height="120" rx="12" fill="#D1FAE5" fillOpacity="0.9" stroke="#10B981" strokeWidth="2" />
        <text x="220" y="292" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">Cognitive Benefit</text>
        <text x="70" y="320" fill="#047857" fontSize="12">51 items is within the brain's</text>
        <text x="70" y="340" fill="#047857" fontSize="12">chunking limit. You can hold</text>
        <text x="70" y="360" fill="#047857" fontSize="12">the ENTIRE Bible in working memory.</text>
      </g>

      {/* The deliverable */}
      <g filter="url(#br2-shadow)">
        <rect x="410" y="260" width="340" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <text x="580" y="292" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">Deliverable</text>
        <text x="430" y="315" fill="#047857" fontSize="11" fontFamily="monospace">Gen 1-24 = / Divisions emerge</text>
        <text x="430" y="335" fill="#047857" fontSize="11" fontFamily="monospace">Gen 25-50 = SEED Promise line</text>
        <text x="430" y="355" fill="#047857" fontSize="11" fontFamily="monospace">Ex 1-24 = up Ascent from slavery</text>
        <text x="430" y="375" fill="#6B7280" fontSize="10" fontStyle="italic">Block glyph brief explanation</text>
      </g>

      {/* Pitfalls */}
      <g filter="url(#br2-shadow)">
        <rect x="50" y="400" width="700" height="80" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#EF4444" strokeWidth="2" />
        <text x="400" y="428" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">Pitfalls</text>
        <text x="70" y="455" fill="#B91C1C" fontSize="12">Over-explaining the glyph (keep to 1-2 sentences)</text>
        <text x="70" y="475" fill="#B91C1C" fontSize="12">Using more than 1 glyph per block</text>
        <text x="430" y="455" fill="#B91C1C" fontSize="12">Changing your glyph system midstream</text>
        <text x="430" y="475" fill="#B91C1C" fontSize="12">Trying to capture EVERYTHING in one glyph</text>
      </g>
    </svg>
  );
}

// Bible Rendered Example
export function BibleRenderedExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="br3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="50%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="br3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="br3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="br3-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#br3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Complete 51-Frame Legend
      </text>

      {/* Legend Grid */}
      <g transform="translate(30, 55)">
        {[
          { block: 'Gen 1-24', glyph: '/', note: 'Divisions: light/dark, land/sea, nations' },
          { block: 'Gen 25-50', glyph: 'SEED', note: 'Patriarchs carry the promise' },
          { block: 'Ex 1-24', glyph: 'up', note: 'Ascent from slavery to Sinai' },
          { block: 'Ex 25-Lev 16', glyph: 'T', note: 'Tabernacle built, worship begins' },
          { block: 'Lev 17-Num 16', glyph: '=', note: 'Laws, holiness, order' },
          { block: 'Num 17-Deut 16', glyph: '~', note: 'Wilderness wandering' },
          { block: 'Deut 17-Josh 16', glyph: 'S', note: 'Conquest begins' },
          { block: 'Josh 17-1Sam 7', glyph: 'O', note: 'Cycles of judges' },
          { block: '1Sam 8-2Sam 7', glyph: 'K', note: 'Kingdom established' },
          { block: '2Sam 8-1Ki 7', glyph: 'B', note: 'Temple building' },
          { block: '1Ki 8-2Ki 7', glyph: 'dn', note: 'Decline begins' },
          { block: '2Ki 8-1Ch 16', glyph: 'X', note: 'Division, exile' },
          { block: 'Psalms', glyph: 'M', note: 'Songs of every emotion' },
          { block: 'Prophets', glyph: '!', note: 'Warning and hope' },
          { block: 'Gospels', glyph: '+', note: 'Christ comes' },
          { block: 'Acts', glyph: 'rt', note: 'Up (ascension) then out (mission)' },
          { block: 'Epistles', glyph: 'E', note: 'Letters to churches' },
          { block: 'Revelation', glyph: 'O+', note: 'Full circle: Eden restored' },
        ].map((item, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <g key={i} transform={`translate(${col * 250}, ${row * 75})`} filter="url(#br3-shadow)">
              <rect x="0" y="0" width="240" height="65" rx="8" fill="white" fillOpacity="0.95" stroke="#10B981" strokeWidth="1" />
              <circle cx="35" cy="32" r="22" fill="url(#br3-header)" filter="url(#br3-glow)" />
              <text x="35" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.glyph}</text>
              <text x="70" y="25" fill="#065F46" fontSize="11" fontWeight="bold">{item.block}</text>
              <text x="70" y="45" fill="#047857" fontSize="10">{item.note}</text>
            </g>
          );
        })}
      </g>

      {/* Usage tip */}
      <g filter="url(#br3-shadow)">
        <rect x="50" y="495" width="700" height="40" rx="10" fill="#FEF3C7" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="520" textAnchor="middle" fill="#92400E" fontSize="13" fontWeight="bold">
          Practice: Close your eyes and walk through all 51 glyphs from memory
        </text>
      </g>
    </svg>
  );
}

export default {
  BibleRenderedFlowchart,
  BibleRenderedConcept,
  BibleRenderedExample
};
