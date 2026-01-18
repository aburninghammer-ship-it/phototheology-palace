import React from 'react';

// Gems Room Method Flowchart
export function GemsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gem-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFEFF" />
          <stop offset="50%" stopColor="#CFFAFE" />
          <stop offset="100%" stopColor="#A5F3FC" />
        </linearGradient>
        <linearGradient id="gem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="gem-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <filter id="gem-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="gem-sparkle" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#gem-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#0E7490" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Gems Room: Mining Rare Biblical Truths
      </text>

      {/* Central Diamond */}
      <g transform="translate(400, 180)" filter="url(#gem-sparkle)">
        <polygon points="0,-60 50,0 0,60 -50,0" fill="url(#gem-grad)" stroke="#0891B2" strokeWidth="2" />
        <polygon points="0,-60 50,0 0,20 -50,0" fill="#67E8F9" opacity="0.5" />
        <text x="0" y="10" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">GEM</text>
      </g>

      {/* Incoming Verses */}
      {[
        { x: 100, y: 120, verse: 'Verse A', ref: 'Ex 12:6' },
        { x: 100, y: 200, verse: 'Verse B', ref: 'Jn 19:14' },
        { x: 580, y: 120, verse: 'Verse C', ref: '1 Cor 5:7' },
        { x: 580, y: 200, verse: 'Verse D', ref: '(optional)' },
      ].map((item, i) => (
        <g key={i} transform={`translate(${item.x}, ${item.y})`} filter="url(#gem-shadow)">
          <rect x="0" y="0" width="120" height="60" rx="10" fill="white" fillOpacity="0.95" stroke="#06B6D4" strokeWidth="2" />
          <text x="60" y="25" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">{item.verse}</text>
          <text x="60" y="45" textAnchor="middle" fill="#0891B2" fontSize="10">{item.ref}</text>
        </g>
      ))}

      {/* Connection lines */}
      <path d="M220 150 L340 180" stroke="#06B6D4" strokeWidth="2" />
      <path d="M220 230 L340 190" stroke="#06B6D4" strokeWidth="2" />
      <path d="M580 150 L460 180" stroke="#06B6D4" strokeWidth="2" />
      <path d="M580 230 L460 190" stroke="#06B6D4" strokeWidth="2" />

      {/* Output */}
      <path d="M400 245 L400 290" stroke="#06B6D4" strokeWidth="3" />
      <polygon points="395,285 400,300 405,285" fill="#06B6D4" />

      <g filter="url(#gem-shadow)">
        <rect x="250" y="305" width="300" height="70" rx="12" fill="url(#gem-header)" />
        <text x="400" y="335" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">RARE TRUTH EMERGES</text>
        <text x="400" y="358" textAnchor="middle" fill="#A5F3FC" fontSize="12">Beautiful insight from combination</text>
      </g>

      {/* Method Steps */}
      <g filter="url(#gem-shadow)">
        <rect x="50" y="390" width="700" height="45" rx="10" fill="white" fillOpacity="0.95" stroke="#06B6D4" strokeWidth="2" />
        <text x="400" y="420" textAnchor="middle" fill="#0E7490" fontSize="13">
          1. Select 2-4 unrelated verses  2. Place side by side  3. Ask: What insight emerges?  4. Crystallize truth
        </text>
      </g>
    </svg>
  );
}

// Gems Room Concept Infographic
export function GemsRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gem2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFEFF" />
          <stop offset="50%" stopColor="#CFFAFE" />
          <stop offset="100%" stopColor="#A5F3FC" />
        </linearGradient>
        <linearGradient id="gem2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <filter id="gem2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#gem2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#0E7490" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        How Gems Work: Cross-Textual Illumination
      </text>

      {/* The Mining Metaphor */}
      <g filter="url(#gem2-shadow)">
        <rect x="50" y="55" width="700" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#06B6D4" strokeWidth="2" />
        <text x="100" y="90" fill="#0E7490" fontSize="40">Pick</text>
        <text x="160" y="100" fill="#0E7490" fontSize="16" fontWeight="bold">Mining Scripture</text>
        <text x="160" y="125" fill="#0891B2" fontSize="13">Individual verses are like ore—valuable but unrefined.</text>
        <text x="160" y="145" fill="#0891B2" fontSize="13">When you COMBINE verses from different contexts, rare gems emerge.</text>
      </g>

      {/* Example Gem */}
      <g filter="url(#gem2-shadow)">
        <rect x="50" y="190" width="700" height="180" rx="12" fill="#CFFAFE" fillOpacity="0.9" stroke="#06B6D4" strokeWidth="2" />
        <text x="400" y="220" textAnchor="middle" fill="#0E7490" fontSize="16" fontWeight="bold">
          Example Gem: The Passover Timing
        </text>
      </g>

      {/* Verse boxes */}
      <g transform="translate(70, 240)" filter="url(#gem2-shadow)">
        <rect x="0" y="0" width="200" height="60" rx="8" fill="white" stroke="#06B6D4" />
        <text x="100" y="20" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">Exodus 12:6</text>
        <text x="100" y="38" textAnchor="middle" fill="#0891B2" fontSize="10">"Kill it at twilight"</text>
        <text x="100" y="52" textAnchor="middle" fill="#6B7280" fontSize="9">(Passover lamb timing)</text>
      </g>

      <text x="290" y="280" fill="#06B6D4" fontSize="28" fontWeight="bold">+</text>

      <g transform="translate(310, 240)" filter="url(#gem2-shadow)">
        <rect x="0" y="0" width="200" height="60" rx="8" fill="white" stroke="#06B6D4" />
        <text x="100" y="20" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">John 19:14</text>
        <text x="100" y="38" textAnchor="middle" fill="#0891B2" fontSize="10">"About the sixth hour"</text>
        <text x="100" y="52" textAnchor="middle" fill="#6B7280" fontSize="9">(Jesus before Pilate)</text>
      </g>

      <text x="530" y="280" fill="#06B6D4" fontSize="28" fontWeight="bold">=</text>

      <g transform="translate(560, 240)" filter="url(#gem2-shadow)">
        <rect x="0" y="0" width="170" height="60" rx="8" fill="url(#gem2-header)" />
        <text x="85" y="25" textAnchor="middle" fill="white" fontSize="24">GEM</text>
        <text x="85" y="50" textAnchor="middle" fill="#A5F3FC" fontSize="10">Exact moment match!</text>
      </g>

      {/* Insight */}
      <g filter="url(#gem2-shadow)">
        <rect x="70" y="315" width="660" height="40" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="342" textAnchor="middle" fill="#92400E" fontSize="13" fontWeight="bold">
          Gem: Jesus died at the EXACT moment Passover lambs were being slain across Israel!
        </text>
      </g>

      {/* Gem Card Format */}
      <g filter="url(#gem2-shadow)">
        <rect x="50" y="390" width="700" height="90" rx="12" fill="white" fillOpacity="0.95" stroke="#06B6D4" strokeWidth="2" />
        <text x="400" y="420" textAnchor="middle" fill="#0E7490" fontSize="14" fontWeight="bold">
          Gem Card Format
        </text>
        <text x="80" y="450" fill="#0891B2" fontSize="12">Combined Texts: [Ex 12:6 + Jn 19:14]</text>
        <text x="350" y="450" fill="#0891B2" fontSize="12">Rare Truth: [Timing synchrony]</text>
        <text x="580" y="450" fill="#0891B2" fontSize="12">Use-Case: [Easter sermon]</text>
      </g>
    </svg>
  );
}

// Gems Room Example
export function GemsRoomExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gem3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFEFF" />
          <stop offset="50%" stopColor="#CFFAFE" />
          <stop offset="100%" stopColor="#A5F3FC" />
        </linearGradient>
        <linearGradient id="gem3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <filter id="gem3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#gem3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#0E7490" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Gem Examples: Rare Truths from Combined Texts
      </text>

      {/* Gems Grid */}
      {[
        { title: 'Gem 1: Virgin Birth Thread', texts: ['Gen 3:15 — "seed of the woman"', 'Gal 4:4 — "born of a woman"', 'Rev 12:5 — "male child"'], truth: 'Virgin birth thread across redemptive history' },
        { title: 'Gem 2: Three Days Pattern', texts: ['Gen 22:4 — Abraham saw place on 3rd day', 'Jonah 1:17 — 3 days in fish', 'Matt 12:40 — 3 days in earth'], truth: '"Third day" = God\'s resurrection signature' },
        { title: 'Gem 3: Rock Struck Once', texts: ['Ex 17:6 — "Strike the rock" (Horeb)', 'Num 20:8 — "Speak to the rock" (Kadesh)', '1 Cor 10:4 — "That Rock was Christ"'], truth: 'Christ struck ONCE (Calvary); Moses\' error = re-striking' },
        { title: 'Gem 4: Veil & Handwriting', texts: ['Dan 5:5 — Hand writes on wall (Belshazzar)', 'Matt 27:51 — Veil torn top to bottom', 'MS 101, 1897 (EGW connection)'], truth: 'Same hand that wrote doom tore the veil!' },
      ].map((gem, i) => (
        <g key={i} transform={`translate(${(i % 2) * 360 + 50}, ${Math.floor(i / 2) * 180 + 55})`} filter="url(#gem3-shadow)">
          <rect x="0" y="0" width="340" height="160" rx="12" fill="white" fillOpacity="0.95" stroke="#06B6D4" strokeWidth="2" />
          <rect x="0" y="0" width="340" height="35" rx="12" fill="url(#gem3-header)" />
          <text x="170" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{gem.title}</text>
          <text x="20" y="60" fill="#0E7490" fontSize="11" fontWeight="bold">Texts Combined:</text>
          {gem.texts.map((text, j) => (
            <text key={j} x="20" y={80 + j * 15} fill="#0891B2" fontSize="10">{text}</text>
          ))}
          <text x="20" y="135" fill="#0E7490" fontSize="11" fontWeight="bold">Rare Truth:</text>
          <text x="20" y="150" fill="#065F46" fontSize="10">{gem.truth}</text>
        </g>
      ))}

      {/* Pitfalls */}
      <g filter="url(#gem3-shadow)">
        <rect x="50" y="415" width="700" height="80" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#EF4444" strokeWidth="2" />
        <text x="400" y="445" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">Pitfalls to Avoid</text>
        <text x="80" y="475" fill="#B91C1C" fontSize="12">Forced connections that Scripture doesn't support</text>
        <text x="450" y="475" fill="#B91C1C" fontSize="12">Trivia instead of theology</text>
      </g>

      {/* Call to action */}
      <g filter="url(#gem3-shadow)">
        <rect x="50" y="510" width="700" height="70" rx="12" fill="#D1FAE5" fillOpacity="0.9" stroke="#10B981" strokeWidth="2" />
        <text x="400" y="540" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
          Your Turn: Find 2-4 verses that seem unrelated...
        </text>
        <text x="400" y="565" textAnchor="middle" fill="#047857" fontSize="13">
          Place them side by side and ask: "What beautiful truth emerges?"
        </text>
      </g>
    </svg>
  );
}

export default {
  GemsRoomFlowchart,
  GemsRoomConcept,
  GemsRoomExample
};
