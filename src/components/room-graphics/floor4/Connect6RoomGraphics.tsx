import React from 'react';

// Connect-6 Room Method Flowchart
export function Connect6Flowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="c6-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="50%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="c6-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="c6-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
        <filter id="c6-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="c6-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#c6-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#9A3412" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Connect-6: Six Dimensions of Connection
      </text>

      {/* The 6 Connections */}
      <g transform="translate(100, 80)">
        {[
          { num: '1', name: 'Backward', icon: '⬅️', desc: 'What came BEFORE this?' },
          { num: '2', name: 'Forward', icon: '➡️', desc: 'What comes AFTER this?' },
          { num: '3', name: 'Upward', icon: '⬆️', desc: 'What HEAVENLY reality?' },
          { num: '4', name: 'Downward', icon: '⬇️', desc: 'What EARTHLY application?' },
          { num: '5', name: 'Inward', icon: '🔄', desc: 'What INTERNAL meaning?' },
          { num: '6', name: 'Outward', icon: '🌍', desc: 'What EXTERNAL witness?' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 200}, ${Math.floor(i / 3) * 100})`}>
            <rect x="0" y="0" width="180" height="85" rx="12" fill="white" stroke="#F97316" strokeWidth="2" />
            <circle cx="25" cy="25" r="18" fill="url(#c6-grad)" />
            <text x="25" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.num}</text>
            <text x="110" y="20" textAnchor="middle" fontSize="20">{item.icon}</text>
            <text x="90" y="45" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">{item.name}</text>
            <text x="90" y="65" textAnchor="middle" fill="#C2410C" fontSize="9">{item.desc}</text>
          </g>
        ))}
      </g>

      {/* Central Concept */}
      <g transform="translate(300, 300)">
        <circle cx="100" cy="50" r="45" fill="url(#c6-grad)" />
        <text x="100" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">YOUR</text>
        <text x="100" y="62" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">VERSE</text>
      </g>

      {/* Key Principle */}
      <rect x="50" y="390" width="700" height="90" rx="12" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
      <text x="400" y="420" textAnchor="middle" fill="#9A3412" fontSize="16" fontWeight="bold">
        The Connect-6 Principle
      </text>
      <text x="400" y="445" textAnchor="middle" fill="#C2410C" fontSize="13">
        Every verse exists in relationship — connect it in all 6 directions for full context
      </text>
      <text x="400" y="468" textAnchor="middle" fill="#C2410C" fontSize="12">
        Time (Past/Future) + Space (Heaven/Earth) + Scope (Internal/External)
      </text>
    </svg>
  );
}

// Connect-6 Room Concept Infographic
export function Connect6Concept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="500" fill="#FFF7ED" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9A3412" fontSize="22" fontWeight="bold">
        The 6 Connections Explained
      </text>

      {/* Explanation Grid */}
      <g transform="translate(50, 55)">
        {[
          { conn: 'Backward', question: 'What OT passages lead here?', example: 'John 1:1 → Genesis 1:1' },
          { conn: 'Forward', question: 'Where does this lead in NT?', example: 'Gen 3:15 → Revelation 12' },
          { conn: 'Upward', question: 'What heavenly reality?', example: 'Tabernacle → Heavenly Sanctuary' },
          { conn: 'Downward', question: 'What practical application?', example: '"Love your neighbor" → specific actions' },
          { conn: 'Inward', question: 'What does this mean for ME?', example: 'Psalm 51 → personal confession' },
          { conn: 'Outward', question: 'How does this affect others?', example: 'Great Commission → evangelism' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 350}, ${Math.floor(i / 2) * 80})`}>
            <rect x="0" y="0" width="340" height="70" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
            <text x="170" y="22" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">{item.conn}</text>
            <text x="170" y="40" textAnchor="middle" fill="#C2410C" fontSize="10">{item.question}</text>
            <text x="170" y="58" textAnchor="middle" fill="#EA580C" fontSize="9" fontStyle="italic">e.g., {item.example}</text>
          </g>
        ))}
      </g>

      {/* Connection Web Visual */}
      <rect x="50" y="310" width="700" height="80" rx="12" fill="white" stroke="#F97316" strokeWidth="2" />
      <text x="400" y="340" textAnchor="middle" fill="#9A3412" fontSize="14" fontWeight="bold">
        The Web of Scripture
      </text>
      <text x="400" y="365" textAnchor="middle" fill="#C2410C" fontSize="12">
        Every verse is a node in a vast interconnected web — Connect-6 maps 6 primary threads
      </text>

      {/* Deliverable */}
      <rect x="50" y="410" width="700" height="70" rx="12" fill="#F97316" />
      <text x="400" y="440" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Connect-6 Map
      </text>
      <text x="400" y="465" textAnchor="middle" fill="#FED7AA" fontSize="12">
        Central Verse + 6 Directional Connections = Complete Contextual Understanding
      </text>
    </svg>
  );
}

// Connect-6 Room Example
export function Connect6Example() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#FFF7ED" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9A3412" fontSize="22" fontWeight="bold">
        Example: Connect-6 on John 1:29
      </text>

      {/* Central Verse */}
      <rect x="250" y="50" width="300" height="50" rx="10" fill="#F97316" />
      <text x="400" y="80" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        "Behold the Lamb of God, which taketh away the sin of the world"
      </text>

      {/* 6 Connections */}
      <g transform="translate(50, 120)">
        <rect x="0" y="0" width="340" height="100" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
        <text x="170" y="20" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">⬅️ BACKWARD</text>
        <text x="15" y="40" fill="#C2410C" fontSize="10">• Genesis 22:8 — "God will provide himself a lamb"</text>
        <text x="15" y="55" fill="#C2410C" fontSize="10">• Exodus 12:3 — Passover lamb</text>
        <text x="15" y="70" fill="#C2410C" fontSize="10">• Isaiah 53:7 — "Led as a lamb to the slaughter"</text>
        <text x="15" y="85" fill="#EA580C" fontSize="9" fontStyle="italic">All OT lambs pointed to this moment!</text>
      </g>

      <g transform="translate(410, 120)">
        <rect x="0" y="0" width="340" height="100" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
        <text x="170" y="20" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">➡️ FORWARD</text>
        <text x="15" y="40" fill="#C2410C" fontSize="10">• 1 Corinthians 5:7 — "Christ our Passover"</text>
        <text x="15" y="55" fill="#C2410C" fontSize="10">• 1 Peter 1:19 — "Precious blood of Christ"</text>
        <text x="15" y="70" fill="#C2410C" fontSize="10">• Revelation 5:6 — "A Lamb as though slain"</text>
        <text x="15" y="85" fill="#EA580C" fontSize="9" fontStyle="italic">From the cross to the throne!</text>
      </g>

      <g transform="translate(50, 230)">
        <rect x="0" y="0" width="340" height="90" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
        <text x="170" y="20" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">⬆️ UPWARD</text>
        <text x="15" y="40" fill="#C2410C" fontSize="10">• Heavenly Sanctuary — Lamb's blood applied</text>
        <text x="15" y="55" fill="#C2410C" fontSize="10">• Revelation 5 — Lamb worthy to open scroll</text>
        <text x="15" y="75" fill="#EA580C" fontSize="9" fontStyle="italic">The heavenly reality behind earthly sacrifice</text>
      </g>

      <g transform="translate(410, 230)">
        <rect x="0" y="0" width="340" height="90" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
        <text x="170" y="20" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">⬇️ DOWNWARD</text>
        <text x="15" y="40" fill="#C2410C" fontSize="10">• Communion — "This do in remembrance"</text>
        <text x="15" y="55" fill="#C2410C" fontSize="10">• Daily living — "Lamb-like character"</text>
        <text x="15" y="75" fill="#EA580C" fontSize="9" fontStyle="italic">How do I live out Lamb theology?</text>
      </g>

      <g transform="translate(50, 330)">
        <rect x="0" y="0" width="340" height="90" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
        <text x="170" y="20" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">🔄 INWARD</text>
        <text x="15" y="40" fill="#C2410C" fontSize="10">• My sin specifically carried by the Lamb</text>
        <text x="15" y="55" fill="#C2410C" fontSize="10">• Personal acceptance of His sacrifice</text>
        <text x="15" y="75" fill="#EA580C" fontSize="9" fontStyle="italic">The Lamb died for ME personally</text>
      </g>

      <g transform="translate(410, 330)">
        <rect x="0" y="0" width="340" height="90" rx="10" fill="white" stroke="#F97316" strokeWidth="2" />
        <text x="170" y="20" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">🌍 OUTWARD</text>
        <text x="15" y="40" fill="#C2410C" fontSize="10">• "Sin of the WORLD" — universal scope</text>
        <text x="15" y="55" fill="#C2410C" fontSize="10">• Evangelism — "Behold!" = proclamation</text>
        <text x="15" y="75" fill="#EA580C" fontSize="9" fontStyle="italic">Point others to the Lamb!</text>
      </g>

      {/* Summary */}
      <rect x="50" y="435" width="700" height="100" rx="12" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" />
      <text x="400" y="465" textAnchor="middle" fill="#9A3412" fontSize="14" fontWeight="bold">
        Connect-6 Result: One Verse → Complete Understanding
      </text>
      <text x="400" y="490" textAnchor="middle" fill="#C2410C" fontSize="11">
        John 1:29 connects: OT sacrifices → NT theology → Heavenly reality →
      </text>
      <text x="400" y="510" textAnchor="middle" fill="#C2410C" fontSize="11">
        Personal salvation → Practical living → Global mission
      </text>
    </svg>
  );
}

export default {
  Connect6Flowchart,
  Connect6Concept,
  Connect6Example
};
