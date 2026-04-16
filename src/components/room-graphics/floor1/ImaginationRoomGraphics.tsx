import React from 'react';

// Imagination Room Method Flowchart
export function ImaginationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="50%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="ir-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <filter id="ir-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="ir-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#ir-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#6D28D9" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Imagination Room: Immersive Experience Method
      </text>

      {/* Central Scene Circle */}
      <circle cx="400" cy="200" r="100" fill="url(#ir-grad)" filter="url(#ir-glow)" />
      <text x="400" y="190" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">STEP INTO</text>
      <text x="400" y="215" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">THE SCENE</text>
      <text x="400" y="240" textAnchor="middle" fill="#E9D5FF" fontSize="12">Close your eyes</text>

      {/* 5 Senses radiating out */}
      {[
        { x: 400, y: 50, color: '#F59E0B', emoji: 'EYE', label: 'SEE', desc: 'What colors, shapes?' },
        { x: 550, y: 200, color: '#3B82F6', emoji: 'EAR', label: 'HEAR', desc: 'Crowds? Wind?' },
        { x: 490, y: 320, color: '#10B981', emoji: 'HAND', label: 'TOUCH', desc: 'Rough? Smooth?' },
        { x: 310, y: 320, color: '#EC4899', emoji: 'NOSE', label: 'SMELL', desc: 'Incense? Earth?' },
        { x: 250, y: 200, color: '#EF4444', emoji: 'TONGUE', label: 'TASTE', desc: 'Salt? Bread?' },
      ].map((sense, i) => (
        <g key={i} transform={`translate(${sense.x}, ${sense.y})`} filter="url(#ir-shadow)">
          <circle cx="0" cy="0" r="35" fill={sense.color} filter="url(#ir-glow)" />
          <text x="0" y="8" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{sense.emoji}</text>
          <text x={i === 1 ? 55 : i === 4 ? -55 : 0} y={i === 0 ? 55 : i === 2 || i === 3 ? 55 : 5}
                textAnchor={i === 1 ? 'start' : i === 4 ? 'end' : 'middle'} fill={sense.color} fontSize="12" fontWeight="bold">
            {sense.label}
          </text>
          <text x={i === 1 ? 55 : i === 4 ? -55 : 0} y={i === 0 ? 70 : i === 2 || i === 3 ? 70 : 20}
                textAnchor={i === 1 ? 'start' : i === 4 ? 'end' : 'middle'} fill={sense.color} fontSize="10">
            {sense.desc}
          </text>
        </g>
      ))}

      {/* Connection lines */}
      <line x1="400" y1="100" x2="400" y2="85" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="500" y1="200" x2="515" y2="200" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="450" y1="280" x2="465" y2="295" stroke="#10B981" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="350" y1="280" x2="335" y2="295" stroke="#EC4899" strokeWidth="2" strokeDasharray="4,2" />
      <line x1="300" y1="200" x2="285" y2="200" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2" />

      {/* Output Section */}
      <g filter="url(#ir-shadow)">
        <rect x="50" y="380" width="700" height="50" rx="10" fill="#E9D5FF" fillOpacity="0.9" stroke="#8B5CF6" strokeWidth="2" />
        <text x="400" y="412" textAnchor="middle" fill="#6D28D9" fontSize="14" fontWeight="bold">
          Output: Sensory paragraph + One sentence of personal resonance
        </text>
      </g>
    </svg>
  );
}

// Imagination Room Concept Infographic
export function ImaginationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="50%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="ir2-scene" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <filter id="ir2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#ir2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#6D28D9" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        From Information to Experience
      </text>

      {/* Left: Plain Text */}
      <g transform="translate(50, 70)" filter="url(#ir2-shadow)">
        <rect x="0" y="0" width="300" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#D1D5DB" strokeWidth="2" />
        <text x="150" y="30" textAnchor="middle" fill="#6B7280" fontSize="16" fontWeight="bold">Information Only</text>
        <text x="20" y="65" fill="#374151" fontSize="12">"Jesus calmed the storm.</text>
        <text x="20" y="85" fill="#374151" fontSize="12">The disciples were afraid.</text>
        <text x="20" y="105" fill="#374151" fontSize="12">Jesus rebuked the wind.</text>
        <text x="20" y="125" fill="#374151" fontSize="12">There was a great calm."</text>
        <text x="150" y="160" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontStyle="italic">Facts without feeling</text>
      </g>

      {/* Arrow */}
      <text x="400" y="160" textAnchor="middle" fill="#8B5CF6" fontSize="36">==&gt;</text>

      {/* Right: Immersive Experience */}
      <g transform="translate(450, 70)" filter="url(#ir2-shadow)">
        <rect x="0" y="0" width="300" height="180" rx="12" fill="url(#ir2-scene)" />
        <text x="150" y="30" textAnchor="middle" fill="#E9D5FF" fontSize="16" fontWeight="bold">Lived Experience</text>
        <text x="20" y="60" fill="#C4B5FD" fontSize="11">SEE: Black waves rising like walls</text>
        <text x="20" y="80" fill="#C4B5FD" fontSize="11">HEAR: Thunder cracking, disciples screaming</text>
        <text x="20" y="100" fill="#C4B5FD" fontSize="11">TOUCH: Splintering wood, cold spray</text>
        <text x="20" y="120" fill="#C4B5FD" fontSize="11">SMELL: Salt and fear in the air</text>
        <text x="20" y="140" fill="#C4B5FD" fontSize="11">TASTE: Copper taste of panic</text>
        <text x="150" y="168" textAnchor="middle" fill="#A78BFA" fontSize="11" fontStyle="italic">You were THERE</text>
      </g>

      {/* Why It Works Section */}
      <g filter="url(#ir2-shadow)">
        <rect x="50" y="270" width="700" height="100" rx="12" fill="#F3E8FF" fillOpacity="0.9" stroke="#8B5CF6" strokeWidth="2" />
        <text x="400" y="300" textAnchor="middle" fill="#6D28D9" fontSize="16" fontWeight="bold">
          Why This Works: Episodic Memory
        </text>
        <text x="400" y="330" textAnchor="middle" fill="#4C1D95" fontSize="13">
          Experiences are remembered 6x better than facts. When you FEEL the story,
        </text>
        <text x="400" y="350" textAnchor="middle" fill="#4C1D95" fontSize="13">
          it moves from short-term to long-term memory. Your emotions become anchors.
        </text>
      </g>

      {/* Pitfalls */}
      <g filter="url(#ir2-shadow)">
        <rect x="50" y="390" width="340" height="90" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#EF4444" strokeWidth="2" />
        <text x="220" y="420" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">Pitfalls to Avoid</text>
        <text x="70" y="445" fill="#B91C1C" fontSize="11">Adding details Scripture doesn't give</text>
        <text x="70" y="465" fill="#B91C1C" fontSize="11">Making it about YOUR creativity, not the text</text>
      </g>

      {/* Personal Resonance */}
      <g filter="url(#ir2-shadow)">
        <rect x="410" y="390" width="340" height="90" rx="12" fill="#D1FAE5" fillOpacity="0.9" stroke="#10B981" strokeWidth="2" />
        <text x="580" y="420" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">Personal Resonance</text>
        <text x="430" y="445" fill="#047857" fontSize="11">Ask: "When have I felt like this?"</text>
        <text x="430" y="465" fill="#047857" fontSize="11">Connect the scene to YOUR story</text>
      </g>
    </svg>
  );
}

// Imagination Room Example
export function ImaginationRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="50%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="ir3-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="ir3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <filter id="ir3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      {/* Scene Background */}
      <rect width="800" height="250" fill="url(#ir3-sky)" rx="16 16 0 0" />
      <rect y="250" width="800" height="300" fill="url(#ir3-bg)" rx="0 0 16 16" />

      {/* Scene Title */}
      <text x="400" y="35" textAnchor="middle" fill="#E9D5FF" fontSize="20" fontWeight="bold" letterSpacing="0.5">
        Example: Red Sea Crossing (Exodus 14)
      </text>

      {/* Water Walls */}
      <path d="M50 240 Q100 100 150 240" fill="url(#ir3-water)" opacity="0.8" />
      <path d="M650 240 Q700 100 750 240" fill="url(#ir3-water)" opacity="0.8" />

      {/* Dry Path */}
      <rect x="200" y="180" width="400" height="60" fill="#C2B280" rx="4" />

      {/* People crossing */}
      <text x="300" y="220" fontSize="20">WALK</text>
      <text x="400" y="215" fontSize="18">WALK</text>
      <text x="500" y="220" fontSize="20">WALK</text>

      {/* Sensory Details Panel */}
      <g filter="url(#ir3-shadow)">
        <rect x="40" y="270" width="720" height="260" rx="12" fill="white" fillOpacity="0.95" stroke="#8B5CF6" strokeWidth="2" />
        <text x="400" y="300" textAnchor="middle" fill="#6D28D9" fontSize="16" fontWeight="bold">
          Sensory Immersion
        </text>
      </g>

      {/* 5 Senses Grid */}
      <g transform="translate(60, 320)">
        {[
          { label: 'SIGHT', color: '#92400E', bg: '#FEF3C7', lines: ['Towering walls of water', 'Fish suspended in blue'] },
          { label: 'SOUND', color: '#1E40AF', bg: '#DBEAFE', lines: ['Roar of held-back water', 'Children crying, oxen lowing'] },
          { label: 'TOUCH', color: '#065F46', bg: '#D1FAE5', lines: ['Cold mist on face', 'Sand under bare feet'] },
          { label: 'SMELL', color: '#9D174D', bg: '#FCE7F3', lines: ['Salt and seaweed', 'Fear-sweat in the crowd'] },
          { label: 'TASTE', color: '#991B1B', bg: '#FEE2E2', lines: ['Salt spray on lips', 'Metallic taste of terror'] },
        ].map((sense, i) => (
          <g key={i} transform={`translate(${i * 138}, 0)`}>
            <rect x="0" y="0" width="130" height="80" rx="8" fill={sense.bg} />
            <text x="65" y="25" textAnchor="middle" fill={sense.color} fontSize="10" fontWeight="bold">{sense.label}</text>
            <text x="65" y="45" textAnchor="middle" fill={sense.color} fontSize="9">{sense.lines[0]}</text>
            <text x="65" y="60" textAnchor="middle" fill={sense.color} fontSize="9">{sense.lines[1]}</text>
          </g>
        ))}
      </g>

      {/* Personal Resonance */}
      <g filter="url(#ir3-shadow)">
        <rect x="60" y="420" width="680" height="90" rx="10" fill="#F3E8FF" fillOpacity="0.9" stroke="#A855F7" strokeWidth="2" />
        <text x="400" y="448" textAnchor="middle" fill="#6D28D9" fontSize="14" fontWeight="bold">
          Personal Resonance:
        </text>
        <text x="400" y="475" textAnchor="middle" fill="#4C1D95" fontSize="12" fontStyle="italic">
          "I felt like this when I left my old life behind—terrified of the unknown ahead,
        </text>
        <text x="400" y="495" textAnchor="middle" fill="#4C1D95" fontSize="12" fontStyle="italic">
          but walls of chaos were being held back by invisible hands. God made a way."
        </text>
      </g>
    </svg>
  );
}

export default {
  ImaginationRoomFlowchart,
  ImaginationRoomConcept,
  ImaginationRoomExample
};
