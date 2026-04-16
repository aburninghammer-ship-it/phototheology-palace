import React from 'react';

// Symbols/Types Room Method Flowchart
export function SymbolsTypesFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="st-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="50%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="st-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="st-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
        <filter id="st-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="st-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#st-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#9A3412" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Symbols & Types Room: God's Visual Dictionary
      </text>

      {/* Two Branches: Symbols vs Types */}
      <g transform="translate(50, 70)" filter="url(#st-shadow)">
        <rect x="0" y="0" width="320" height="160" rx="12" fill="url(#st-grad)" />
        <text x="160" y="35" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">SYMBOLS</text>
        <text x="160" y="60" textAnchor="middle" fill="#FED7AA" fontSize="12">Recurring images with consistent meaning</text>

        <rect x="15" y="75" width="290" height="70" rx="8" fill="white" fillOpacity="0.95" />
        <text x="160" y="95" textAnchor="middle" fill="#9A3412" fontSize="11">Water = Cleansing, Holy Spirit, Chaos</text>
        <text x="160" y="112" textAnchor="middle" fill="#9A3412" fontSize="11">Fire = Judgment, Purification, Presence</text>
        <text x="160" y="129" textAnchor="middle" fill="#9A3412" fontSize="11">Mountains = God's presence, Kingdoms</text>
      </g>

      <g transform="translate(430, 70)" filter="url(#st-shadow)">
        <rect x="0" y="0" width="320" height="160" rx="12" fill="url(#st-grad)" />
        <text x="160" y="35" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">TYPES</text>
        <text x="160" y="60" textAnchor="middle" fill="#FED7AA" fontSize="12">Historical persons/events pointing to Christ</text>

        <rect x="15" y="75" width="290" height="70" rx="8" fill="white" fillOpacity="0.95" />
        <text x="160" y="95" textAnchor="middle" fill="#9A3412" fontSize="11">Adam → Christ (Rom 5:14)</text>
        <text x="160" y="112" textAnchor="middle" fill="#9A3412" fontSize="11">Passover Lamb → Christ (1 Cor 5:7)</text>
        <text x="160" y="129" textAnchor="middle" fill="#9A3412" fontSize="11">Bronze Serpent → Cross (John 3:14)</text>
      </g>

      {/* Method Steps */}
      <g filter="url(#st-shadow)">
        <rect x="50" y="250" width="700" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#F97316" strokeWidth="2" />
        <text x="400" y="280" textAnchor="middle" fill="#9A3412" fontSize="16" fontWeight="bold">
          Building Your Symbol Dictionary
        </text>

        <g transform="translate(70, 295)">
          {[
            { step: '1', text: 'Identify: What image/person appears?' },
            { step: '2', text: 'Trace: Find 3+ uses across Scripture' },
            { step: '3', text: 'Define: What meaning emerges consistently?' },
            { step: '4', text: 'Record: Add to your personal dictionary' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 165}, 0)`}>
              <circle cx="15" cy="15" r="15" fill="url(#st-grad)" filter="url(#st-glow)" />
              <text x="15" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.step}</text>
              <text x="15" y="45" textAnchor="middle" fill="#9A3412" fontSize="9">{item.text}</text>
            </g>
          ))}
        </g>
      </g>

      {/* Key Rule */}
      <g filter="url(#st-shadow)">
        <rect x="50" y="390" width="700" height="90" rx="12" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="420" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          Key Rule: Scripture Interprets Scripture
        </text>
        <text x="400" y="445" textAnchor="middle" fill="#78350F" fontSize="12">
          Don't impose meaning—let the Bible define its own symbols.
        </text>
        <text x="400" y="465" textAnchor="middle" fill="#78350F" fontSize="12">
          Types require NT confirmation or clear pattern (3+ instances).
        </text>
      </g>
    </svg>
  );
}

// Symbols/Types Room Concept Infographic
export function SymbolsTypesConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="st2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="50%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="st2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
        <filter id="st2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#st2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9A3412" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Symbol vs Type: What's the Difference?
      </text>

      {/* Comparison Table */}
      <g transform="translate(50, 60)" filter="url(#st2-shadow)">
        {/* Header */}
        <rect x="0" y="0" width="700" height="40" rx="8" fill="url(#st2-header)" />
        <text x="175" y="27" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SYMBOL</text>
        <text x="525" y="27" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">TYPE</text>

        {/* Rows */}
        {[
          { symbol: 'Image or concept', type: 'Historical person/event', label: 'Nature' },
          { symbol: 'Repeating throughout Scripture', type: 'One-time OT reality', label: 'Occurrence' },
          { symbol: 'General spiritual truth', type: 'Specifically points to Christ', label: 'Points To' },
          { symbol: 'Water = cleansing', type: 'Joseph = Christ', label: 'Example' },
          { symbol: 'Multiple meanings possible', type: 'NT explicitly confirms', label: 'Validation' },
        ].map((row, i) => (
          <g key={i} transform={`translate(0, ${40 + i * 45})`}>
            <rect x="0" y="0" width="700" height="45" fill={i % 2 === 0 ? '#FED7AA' : 'white'} fillOpacity="0.9" />
            <text x="10" y="28" fill="#9A3412" fontSize="11" fontWeight="bold">{row.label}:</text>
            <text x="175" y="28" textAnchor="middle" fill="#78350F" fontSize="11">{row.symbol}</text>
            <line x1="350" y1="5" x2="350" y2="40" stroke="#F97316" strokeWidth="1" />
            <text x="525" y="28" textAnchor="middle" fill="#78350F" fontSize="11">{row.type}</text>
          </g>
        ))}
      </g>

      {/* Symbol Dictionary Starter */}
      <g filter="url(#st2-shadow)">
        <rect x="50" y="300" width="700" height="230" rx="12" fill="white" fillOpacity="0.95" stroke="#F97316" strokeWidth="2" />
        <text x="400" y="330" textAnchor="middle" fill="#9A3412" fontSize="16" fontWeight="bold">
          Starter Symbol Dictionary
        </text>

        <g transform="translate(70, 350)">
          {[
            { symbol: '🌊 Water', meanings: 'Life, cleansing, chaos, Holy Spirit, nations' },
            { symbol: '🔥 Fire', meanings: "Judgment, purification, God's presence, trial" },
            { symbol: '⛰️ Mountain', meanings: "Kingdom, God's dwelling, obstacle, worship" },
            { symbol: '🌲 Tree', meanings: 'Life, righteous person, nation, cross' },
            { symbol: '🐑 Lamb', meanings: 'Sacrifice, innocence, Christ, believer' },
            { symbol: '💨 Wind', meanings: 'Spirit, judgment, change, breath of God' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${(i % 2) * 330}, ${Math.floor(i / 2) * 55})`}>
              <rect x="0" y="0" width="320" height="50" rx="8" fill={i % 2 === 0 ? '#FFF7ED' : '#FFEDD5'} stroke="#FDBA74" strokeWidth="1" />
              <text x="15" y="30" fill="#9A3412" fontSize="14">{item.symbol}</text>
              <text x="85" y="30" fill="#78350F" fontSize="10">{item.meanings}</text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

// Symbols/Types Room Example
export function SymbolsTypesExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="st3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="50%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="st3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
        <filter id="st3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#st3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9A3412" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Joseph as a Type of Christ
      </text>

      {/* Type Analysis */}
      <g transform="translate(50, 55)" filter="url(#st3-shadow)">
        <rect x="0" y="0" width="700" height="385" rx="12" fill="white" fillOpacity="0.95" stroke="#F97316" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="40" rx="12" fill="url(#st3-header)" />
        <text x="175" y="27" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">JOSEPH</text>
        <text x="525" y="27" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">CHRIST</text>

        {[
          { joseph: 'Beloved son of father', christ: 'Beloved Son of the Father' },
          { joseph: 'Hated by his brothers', christ: 'Rejected by His own people' },
          { joseph: 'Sold for silver (20 pieces)', christ: 'Betrayed for silver (30 pieces)' },
          { joseph: 'Falsely accused', christ: 'Falsely condemned' },
          { joseph: 'Imprisoned with two', christ: 'Crucified with two' },
          { joseph: 'One saved, one condemned', christ: 'One thief saved, one lost' },
          { joseph: 'Exalted to right hand of power', christ: 'Seated at right hand of God' },
          { joseph: 'Given Gentile bride', christ: 'Given the Church (Jew & Gentile)' },
          { joseph: 'Provides bread in famine', christ: 'The Bread of Life' },
        ].map((row, i) => (
          <g key={i} transform={`translate(0, ${40 + i * 38})`}>
            <rect x="0" y="0" width="700" height="38" fill={i % 2 === 0 ? '#FED7AA' : 'white'} fillOpacity="0.9" />
            <text x="175" y="24" textAnchor="middle" fill="#78350F" fontSize="10">{row.joseph}</text>
            <text x="350" y="24" textAnchor="middle" fill="#F97316" fontSize="16">→</text>
            <text x="525" y="24" textAnchor="middle" fill="#78350F" fontSize="10">{row.christ}</text>
          </g>
        ))}
      </g>

      {/* Validation Box */}
      <g filter="url(#st3-shadow)">
        <rect x="50" y="460" width="700" height="70" rx="12" fill="#D1FAE5" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <text x="400" y="490" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
          Validation: 10+ parallels = strong typological connection
        </text>
        <text x="400" y="515" textAnchor="middle" fill="#047857" fontSize="12">
          Joseph is never explicitly called a type, but the pattern is unmistakable.
        </text>
      </g>
    </svg>
  );
}

export default {
  SymbolsTypesFlowchart,
  SymbolsTypesConcept,
  SymbolsTypesExample
};
