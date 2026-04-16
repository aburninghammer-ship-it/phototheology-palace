import React from 'react';

// Fruit Room Method Flowchart
export function FruitRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="frt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="50%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="frt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="frt-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
        <filter id="frt-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="frt-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#frt-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#065F46" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Fruit Room: Character Evidence of Truth
      </text>

      {/* Tree with Fruit */}
      <g transform="translate(250, 70)">
        {/* Tree trunk */}
        <rect x="130" y="120" width="40" height="80" fill="#78350F" rx="5" />
        {/* Tree crown */}
        <ellipse cx="150" cy="80" rx="100" ry="70" fill="url(#frt-grad)" />
        {/* Fruit */}
        {[
          { x: 80, y: 50 }, { x: 120, y: 40 }, { x: 180, y: 40 }, { x: 220, y: 50 },
          { x: 70, y: 90 }, { x: 230, y: 90 }, { x: 100, y: 120 }, { x: 150, y: 130 }, { x: 200, y: 120 }
        ].map((pos, i) => (
          <circle key={i} cx={pos.x} cy={pos.y} r="12" fill={['#EF4444', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'][i % 5]} />
        ))}
        <text x="150" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ABIDE</text>
      </g>

      {/* The 9 Fruit */}
      <rect x="50" y="220" width="700" height="120" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="245" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        The 9-Fold Fruit of the Spirit (Galatians 5:22-23)
      </text>

      <g transform="translate(60, 260)">
        {[
          { fruit: 'Love', icon: '❤️' },
          { fruit: 'Joy', icon: '😊' },
          { fruit: 'Peace', icon: '☮️' },
          { fruit: 'Patience', icon: '⏳' },
          { fruit: 'Kindness', icon: '🤝' },
          { fruit: 'Goodness', icon: '✨' },
          { fruit: 'Faithfulness', icon: '🛡️' },
          { fruit: 'Gentleness', icon: '🕊️' },
          { fruit: 'Self-Control', icon: '⚖️' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 75}, 0)`}>
            <text x="35" y="20" textAnchor="middle" fontSize="20">{item.icon}</text>
            <text x="35" y="45" textAnchor="middle" fill="#065F46" fontSize="8" fontWeight="bold">{item.fruit}</text>
          </g>
        ))}
      </g>

      {/* Method */}
      <rect x="50" y="360" width="700" height="60" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="390" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        The Fruit Test: Does this teaching produce Christ-like character?
      </text>
      <text x="400" y="410" textAnchor="middle" fill="#047857" fontSize="11">
        "By their fruits you shall know them" — Matthew 7:16
      </text>

      {/* Key Principle */}
      <rect x="50" y="440" width="700" height="45" rx="12" fill="#10B981" />
      <text x="400" y="468" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Truth that doesn't transform character isn't truly understood
      </text>
    </svg>
  );
}

// Fruit Room Concept Infographic
export function FruitRoomConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#ECFDF5" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold">
        The Fruit Framework
      </text>

      {/* Three Categories */}
      <g transform="translate(50, 55)">
        {/* Godward */}
        <rect x="0" y="0" width="220" height="180" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#10B981" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">GODWARD</text>
        <text x="110" y="60" textAnchor="middle" fontSize="28">❤️ 😊 ☮️</text>
        <text x="110" y="85" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold">Love, Joy, Peace</text>
        <text x="110" y="110" textAnchor="middle" fill="#047857" fontSize="9">Relationship with God</text>
        <text x="110" y="135" textAnchor="middle" fill="#047857" fontSize="9">These flow from knowing Him</text>
        <text x="110" y="160" textAnchor="middle" fill="#059669" fontSize="8" fontStyle="italic">"Delight yourself in the LORD"</text>
      </g>

      <g transform="translate(290, 55)">
        {/* Manward */}
        <rect x="0" y="0" width="220" height="180" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#10B981" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">MANWARD</text>
        <text x="110" y="60" textAnchor="middle" fontSize="28">⏳ 🤝 ✨</text>
        <text x="110" y="85" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold">Patience, Kindness, Goodness</text>
        <text x="110" y="110" textAnchor="middle" fill="#047857" fontSize="9">Relationship with Others</text>
        <text x="110" y="135" textAnchor="middle" fill="#047857" fontSize="9">These flow toward people</text>
        <text x="110" y="160" textAnchor="middle" fill="#059669" fontSize="8" fontStyle="italic">"Love your neighbor"</text>
      </g>

      <g transform="translate(530, 55)">
        {/* Selfward */}
        <rect x="0" y="0" width="220" height="180" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#10B981" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SELFWARD</text>
        <text x="110" y="60" textAnchor="middle" fontSize="28">🛡️ 🕊️ ⚖️</text>
        <text x="110" y="85" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="bold">Faithfulness, Gentleness, Self-Control</text>
        <text x="110" y="110" textAnchor="middle" fill="#047857" fontSize="9">Mastery of Self</text>
        <text x="110" y="135" textAnchor="middle" fill="#047857" fontSize="9">These govern inner life</text>
        <text x="110" y="160" textAnchor="middle" fill="#059669" fontSize="8" fontStyle="italic">"Take up your cross"</text>
      </g>

      {/* Fruit vs Works */}
      <rect x="50" y="255" width="700" height="100" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="280" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        Fruit vs. Works of the Flesh (Galatians 5:19-21)
      </text>
      <g transform="translate(100, 295)">
        <rect x="0" y="0" width="250" height="45" rx="8" fill="#FEE2E2" />
        <text x="125" y="18" textAnchor="middle" fill="#991B1B" fontSize="10" fontWeight="bold">Works of Flesh</text>
        <text x="125" y="35" textAnchor="middle" fill="#B91C1C" fontSize="8">Hatred, strife, jealousy, rage...</text>
      </g>
      <text x="400" y="320" textAnchor="middle" fill="#065F46" fontSize="20">vs.</text>
      <g transform="translate(450, 295)">
        <rect x="0" y="0" width="250" height="45" rx="8" fill="#D1FAE5" />
        <text x="125" y="18" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="bold">Fruit of Spirit</text>
        <text x="125" y="35" textAnchor="middle" fill="#047857" fontSize="8">Love, joy, peace, patience...</text>
      </g>

      {/* Study Application */}
      <rect x="50" y="375" width="700" height="80" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="400" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        Fruit Room Study Method
      </text>
      <text x="70" y="425" fill="#047857" fontSize="11">1. Read a passage → 2. Ask: Which fruit does this cultivate?</text>
      <text x="70" y="445" fill="#047857" fontSize="11">3. Examine: Is this fruit growing in MY life? → 4. Pray for growth</text>

      {/* Deliverable */}
      <rect x="50" y="475" width="700" height="55" rx="12" fill="#10B981" />
      <text x="400" y="502" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Deliverable: Fruit Assessment + Growth Plan
      </text>
      <text x="400" y="522" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        Which fruit is strong? Which is weak? What Scripture addresses it?
      </text>
    </svg>
  );
}

// Fruit Room Example
export function FruitRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#ECFDF5" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold">
        Example: Fruit Analysis of John 15
      </text>

      {/* Passage */}
      <rect x="50" y="50" width="700" height="50" rx="8" fill="white" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="80" textAnchor="middle" fill="#047857" fontSize="11" fontStyle="italic">
        "I am the vine, ye are the branches... He that abideth in me, and I in him, bringeth forth much fruit"
      </text>

      {/* Fruit Mapping */}
      <g transform="translate(50, 110)">
        <rect x="0" y="0" width="700" height="220" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
          John 15: Every Fruit Addressed
        </text>

        {[
          { fruit: 'Love', verse: 'v.9-13', teaching: '"Abide in my love... love one another as I have loved you"' },
          { fruit: 'Joy', verse: 'v.11', teaching: '"That my joy might remain in you, and your joy might be full"' },
          { fruit: 'Peace', verse: 'v.4-5', teaching: 'Abiding = rest, security in the Vine' },
          { fruit: 'Patience', verse: 'v.2', teaching: 'Pruning takes time; waiting for fruit' },
          { fruit: 'Kindness', verse: 'v.15', teaching: '"I call you friends" — gracious relationship' },
          { fruit: 'Goodness', verse: 'v.16', teaching: '"Ordained to go and bring forth fruit" — productive life' },
          { fruit: 'Faithfulness', verse: 'v.4,7', teaching: '"Abide in me... continue in my word"' },
          { fruit: 'Gentleness', verse: 'v.1-2', teaching: 'Vinedresser tends carefully, not harshly' },
          { fruit: 'Self-Control', verse: 'v.10', teaching: '"Keep my commandments" — obedience' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235 + 10}, ${Math.floor(i / 3) * 60 + 40})`}>
            <rect x="0" y="0" width="220" height="55" rx="6" fill="#D1FAE5" />
            <text x="110" y="15" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="bold">{item.fruit} ({item.verse})</text>
            <text x="110" y="35" textAnchor="middle" fill="#047857" fontSize="8">{item.teaching}</text>
          </g>
        ))}
      </g>

      {/* Analysis */}
      <g transform="translate(50, 340)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
          Fruit Room Insight
        </text>
        <text x="20" y="50" fill="#047857" fontSize="11">
          <tspan fontWeight="bold">Key Discovery:</tspan> John 15 is a complete "Fruit Room" chapter — all 9 fruit are present!
        </text>
        <text x="20" y="70" fill="#047857" fontSize="11">
          <tspan fontWeight="bold">The Secret:</tspan> "Abide in me" (v.4) — all fruit flows from connection to the Vine
        </text>
        <text x="20" y="90" fill="#047857" fontSize="11">
          <tspan fontWeight="bold">Application:</tspan> Without abiding, no amount of effort produces genuine fruit
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="455" width="700" height="80" rx="12" fill="#10B981" />
      <text x="400" y="485" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        The Abiding Principle: Fruit is the RESULT, not the GOAL
      </text>
      <text x="400" y="510" textAnchor="middle" fill="#A7F3D0" fontSize="12">
        Stay connected to Jesus → fruit happens automatically
      </text>
      <text x="400" y="528" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        "He that abideth in me, the same bringeth forth MUCH fruit" (v.5)
      </text>
    </svg>
  );
}

export default {
  FruitRoomFlowchart,
  FruitRoomConcept,
  FruitRoomExample
};
