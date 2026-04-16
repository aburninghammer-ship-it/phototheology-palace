import React from 'react';

// Theme Room Method Flowchart
export function ThemeRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEFCE8" />
          <stop offset="50%" stopColor="#FEF9C3" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
        <linearGradient id="trm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="trm-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#854D0E" />
        </linearGradient>
        <filter id="trm-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="trm-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#trm-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#854D0E" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Theme Room: The 6-Theme Framework
      </text>

      {/* House Structure */}
      <g transform="translate(250, 70)">
        {/* Roof/Ceiling */}
        <polygon points="150,0 0,60 300,60" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
        <text x="150" y="45" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CEILING</text>
        <text x="150" y="58" textAnchor="middle" fill="#FEF3C7" fontSize="9">God's Character</text>

        {/* 4 Walls */}
        <rect x="0" y="60" width="70" height="120" fill="#FBBF24" stroke="#CA8A04" strokeWidth="2" />
        <text x="35" y="100" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">WALL 1</text>
        <text x="35" y="115" textAnchor="middle" fill="white" fontSize="8">Great</text>
        <text x="35" y="128" textAnchor="middle" fill="white" fontSize="8">Controversy</text>

        <rect x="77" y="60" width="70" height="120" fill="#FCD34D" stroke="#CA8A04" strokeWidth="2" />
        <text x="112" y="100" textAnchor="middle" fill="#854D0E" fontSize="9" fontWeight="bold">WALL 2</text>
        <text x="112" y="115" textAnchor="middle" fill="#854D0E" fontSize="8">Life of</text>
        <text x="112" y="128" textAnchor="middle" fill="#854D0E" fontSize="8">Christ</text>

        <rect x="153" y="60" width="70" height="120" fill="#FBBF24" stroke="#CA8A04" strokeWidth="2" />
        <text x="188" y="100" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">WALL 3</text>
        <text x="188" y="115" textAnchor="middle" fill="white" fontSize="8">Sanctuary</text>

        <rect x="230" y="60" width="70" height="120" fill="#FCD34D" stroke="#CA8A04" strokeWidth="2" />
        <text x="265" y="100" textAnchor="middle" fill="#854D0E" fontSize="9" fontWeight="bold">WALL 4</text>
        <text x="265" y="115" textAnchor="middle" fill="#854D0E" fontSize="8">Three</text>
        <text x="265" y="128" textAnchor="middle" fill="#854D0E" fontSize="8">Angels</text>

        {/* Floor */}
        <rect x="0" y="180" width="300" height="40" fill="#92400E" stroke="#78350F" strokeWidth="2" />
        <text x="150" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">FLOOR: Law of God</text>
      </g>

      {/* Method Description */}
      <rect x="50" y="310" width="700" height="80" rx="12" fill="white" stroke="#EAB308" strokeWidth="2" />
      <text x="400" y="340" textAnchor="middle" fill="#854D0E" fontSize="16" fontWeight="bold">
        The 6-Theme Method
      </text>
      <text x="400" y="365" textAnchor="middle" fill="#A16207" fontSize="12">
        Every passage connects to at least one major theme — identify which one(s)
      </text>
      <text x="400" y="385" textAnchor="middle" fill="#A16207" fontSize="11">
        Like a house: ceiling above, floor below, walls around — all connected
      </text>

      {/* Key Principle */}
      <rect x="50" y="410" width="700" height="70" rx="12" fill="#FEF3C7" stroke="#EAB308" strokeWidth="2" />
      <text x="400" y="440" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="bold">
        "All Scripture fits somewhere in the house of truth"
      </text>
      <text x="400" y="463" textAnchor="middle" fill="#A16207" fontSize="12">
        Organize your study by theme — nothing floats disconnected
      </text>
    </svg>
  );
}

// Theme Room Concept Infographic
export function ThemeRoomConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#FEFCE8" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#854D0E" fontSize="22" fontWeight="bold">
        The 6 Major PT Themes Explained
      </text>

      {/* Theme Cards */}
      <g transform="translate(50, 55)">
        {[
          { theme: 'God\'s Character', icon: '👑', desc: 'Love, justice, mercy — WHO God is', verses: 'Ex 34:6-7, 1 John 4:8', type: 'CEILING' },
          { theme: 'Great Controversy', icon: '⚔️', desc: 'Cosmic battle between Christ and Satan', verses: 'Rev 12, Isa 14, Eze 28', type: 'WALL 1' },
          { theme: 'Life of Christ', icon: '✝️', desc: 'Birth to resurrection — the Gospel story', verses: 'Gospels, Phil 2:5-11', type: 'WALL 2' },
          { theme: 'Sanctuary', icon: '⛪', desc: 'Salvation plan in furniture and services', verses: 'Hebrews, Leviticus', type: 'WALL 3' },
          { theme: 'Three Angels', icon: '📯', desc: 'End-time messages to the world', verses: 'Rev 14:6-12', type: 'WALL 4' },
          { theme: 'Law of God', icon: '📜', desc: 'The 10 Commandments as foundation', verses: 'Ex 20, Matt 5:17-19', type: 'FLOOR' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 120})`}>
            <rect x="0" y="0" width="220" height="110" rx="12" fill="white" stroke="#EAB308" strokeWidth="2" />
            <rect x="0" y="0" width="220" height="25" rx="12 12 0 0" fill="#EAB308" />
            <text x="25" y="17" fontSize="14">{item.icon}</text>
            <text x="120" y="17" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{item.type}</text>
            <text x="110" y="45" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">{item.theme}</text>
            <text x="110" y="65" textAnchor="middle" fill="#A16207" fontSize="9">{item.desc}</text>
            <text x="110" y="90" textAnchor="middle" fill="#CA8A04" fontSize="8" fontStyle="italic">{item.verses}</text>
          </g>
        ))}
      </g>

      {/* Theme Connections */}
      <rect x="50" y="310" width="700" height="120" rx="12" fill="white" stroke="#EAB308" strokeWidth="2" />
      <text x="400" y="335" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="bold">
        How Themes Connect
      </text>
      <text x="70" y="360" fill="#A16207" fontSize="10">
        • Every doctrine relates to God's CHARACTER (ceiling above all)
      </text>
      <text x="70" y="380" fill="#A16207" fontSize="10">
        • The LAW is the foundation (floor) for all moral teaching
      </text>
      <text x="70" y="400" fill="#A16207" fontSize="10">
        • The 4 WALLS surround and protect — Great Controversy, Christ, Sanctuary, Three Angels
      </text>
      <text x="70" y="420" fill="#A16207" fontSize="10">
        • No biblical truth floats alone — it fits somewhere in the house
      </text>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#EAB308" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Theme Classification Sheet
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#FEF3C7" fontSize="12">
        For any passage: Which theme(s) does it connect to? How does it fit in the house?
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#FEF3C7" fontSize="11">
        Build your mental architecture of truth
      </text>
    </svg>
  );
}

// Theme Room Example
export function ThemeRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#FEFCE8" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#854D0E" fontSize="22" fontWeight="bold">
        Example: Theme Analysis of John 3:16
      </text>

      {/* Passage */}
      <rect x="50" y="50" width="700" height="40" rx="8" fill="white" stroke="#EAB308" strokeWidth="2" />
      <text x="400" y="75" textAnchor="middle" fill="#A16207" fontSize="11" fontStyle="italic">
        "For God so loved the world, that he gave his only begotten Son..."
      </text>

      {/* Theme Analysis */}
      <g transform="translate(50, 100)">
        {[
          { theme: 'God\'s Character', connection: 'YES — "God so LOVED" reveals His nature', strength: 'PRIMARY' },
          { theme: 'Great Controversy', connection: 'YES — The Son was "given" to win the battle', strength: 'SECONDARY' },
          { theme: 'Life of Christ', connection: 'YES — The giving of the Son = incarnation', strength: 'PRIMARY' },
          { theme: 'Sanctuary', connection: 'YES — "Only begotten" = the ultimate sacrifice', strength: 'SECONDARY' },
          { theme: 'Three Angels', connection: 'IMPLIED — "Everlasting" connects to Rev 14:6', strength: 'TERTIARY' },
          { theme: 'Law of God', connection: 'IMPLICIT — Sin requires salvation; law defines sin', strength: 'BACKGROUND' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 350}, ${Math.floor(i / 2) * 75})`}>
            <rect x="0" y="0" width="340" height="65" rx="10" fill={
              item.strength === 'PRIMARY' ? '#D1FAE5' :
              item.strength === 'SECONDARY' ? '#DBEAFE' :
              item.strength === 'TERTIARY' ? '#FEF3C7' : '#F3F4F6'
            } stroke="#EAB308" strokeWidth="1" />
            <text x="170" y="20" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">{item.theme}</text>
            <text x="170" y="40" textAnchor="middle" fill="#A16207" fontSize="9">{item.connection}</text>
            <text x="170" y="57" textAnchor="middle" fill={
              item.strength === 'PRIMARY' ? '#065F46' :
              item.strength === 'SECONDARY' ? '#1E40AF' :
              item.strength === 'TERTIARY' ? '#92400E' : '#6B7280'
            } fontSize="8" fontWeight="bold">{item.strength}</text>
          </g>
        ))}
      </g>

      {/* Summary */}
      <g transform="translate(50, 340)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="white" stroke="#EAB308" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="bold">
          Theme Analysis Summary
        </text>
        <text x="20" y="50" fill="#A16207" fontSize="11">
          <tspan fontWeight="bold">Primary Themes:</tspan> God's Character (love), Life of Christ (giving of Son)
        </text>
        <text x="20" y="70" fill="#A16207" fontSize="11">
          <tspan fontWeight="bold">Secondary Themes:</tspan> Great Controversy (rescue mission), Sanctuary (sacrifice)
        </text>
        <text x="20" y="90" fill="#A16207" fontSize="11">
          <tspan fontWeight="bold">Teaching Angle:</tspan> John 3:16 is a "ceiling" verse — it reveals WHO God is
        </text>
      </g>

      {/* Deliverable */}
      <rect x="50" y="455" width="700" height="80" rx="12" fill="#EAB308" />
      <text x="400" y="485" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Result: Every verse finds its home in the house of truth
      </text>
      <text x="400" y="510" textAnchor="middle" fill="#FEF3C7" fontSize="12">
        John 3:16 touches 4 of 6 themes directly — it's a "ceiling beam" verse
      </text>
      <text x="400" y="528" textAnchor="middle" fill="#FEF3C7" fontSize="11">
        connecting all 4 walls to the foundation of who God is
      </text>
    </svg>
  );
}

export default {
  ThemeRoomFlowchart,
  ThemeRoomConcept,
  ThemeRoomExample
};
