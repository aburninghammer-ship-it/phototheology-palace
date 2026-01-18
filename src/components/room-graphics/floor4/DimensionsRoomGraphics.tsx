import React from 'react';

// Dimensions Room Method Flowchart
export function DimensionsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="50%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
        <linearGradient id="dr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="dr-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <filter id="dr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="dr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#dr-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#075985" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Dimensions Room: The 10-Dimension Framework
      </text>

      {/* 10 Dimensions Grid */}
      <g transform="translate(50, 70)">
        {[
          { dim: '1', name: 'Historical', q: 'What happened?', icon: '📜' },
          { dim: '2', name: 'Grammatical', q: 'What do the words mean?', icon: '📝' },
          { dim: '3', name: 'Literary', q: 'What genre/structure?', icon: '📚' },
          { dim: '4', name: 'Theological', q: 'What about God?', icon: '⛪' },
          { dim: '5', name: 'Christological', q: 'Where is Christ?', icon: '✝️' },
          { dim: '6', name: 'Pneumatic', q: 'What of the Spirit?', icon: '🕊️' },
          { dim: '7', name: 'Ecclesial', q: 'What about the Church?', icon: '🏛️' },
          { dim: '8', name: 'Ethical', q: 'What should I do?', icon: '⚖️' },
          { dim: '9', name: 'Eschatological', q: 'What about the end?', icon: '⏳' },
          { dim: '10', name: 'Personal', q: 'What for ME today?', icon: '👤' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 5) * 140}, ${Math.floor(i / 5) * 100})`}>
            <rect x="0" y="0" width="130" height="90" rx="10" fill="white" stroke="#0EA5E9" strokeWidth="2" />
            <circle cx="25" cy="20" r="15" fill="url(#dr-grad)" />
            <text x="25" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{item.dim}</text>
            <text x="70" y="22" textAnchor="middle" fontSize="16">{item.icon}</text>
            <text x="65" y="45" textAnchor="middle" fill="#075985" fontSize="10" fontWeight="bold">{item.name}</text>
            <text x="65" y="65" textAnchor="middle" fill="#0284C7" fontSize="8">{item.q}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="290" width="700" height="90" rx="12" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
      <text x="400" y="320" textAnchor="middle" fill="#075985" fontSize="16" fontWeight="bold">
        The 10-Dimension Rule
      </text>
      <text x="400" y="345" textAnchor="middle" fill="#0369A1" fontSize="13">
        Every passage can be examined through 10 different lenses.
      </text>
      <text x="400" y="368" textAnchor="middle" fill="#0369A1" fontSize="12">
        Don't stop at one dimension — multiply your insights by 10!
      </text>

      {/* Process */}
      <rect x="50" y="400" width="700" height="80" rx="12" fill="white" stroke="#0EA5E9" strokeWidth="2" />
      <text x="400" y="428" textAnchor="middle" fill="#075985" fontSize="14" fontWeight="bold">
        Method: Ask each dimension's question of your passage
      </text>
      <text x="400" y="452" textAnchor="middle" fill="#0284C7" fontSize="12">
        Passage + 10 Questions = 10 Insights = Complete Understanding
      </text>
      <text x="400" y="472" textAnchor="middle" fill="#0369A1" fontSize="11" fontStyle="italic">
        Not every dimension applies equally, but asking forces thoroughness
      </text>
    </svg>
  );
}

// Dimensions Room Concept Infographic
export function DimensionsRoomConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#F0F9FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#075985" fontSize="22" fontWeight="bold">
        The 10 Dimensions Explained
      </text>

      {/* Detailed Dimensions */}
      <g transform="translate(50, 55)">
        {[
          { dim: 'Historical', detail: 'Context, author, audience, date, setting, cultural background' },
          { dim: 'Grammatical', detail: 'Word meanings, verb tenses, syntax, original languages' },
          { dim: 'Literary', detail: 'Genre, structure, rhetoric, poetry, narrative, apocalyptic' },
          { dim: 'Theological', detail: 'What does this reveal about God\'s character and ways?' },
          { dim: 'Christological', detail: 'How does this point to, picture, or proclaim Christ?' },
          { dim: 'Pneumatic', detail: 'What is the Holy Spirit\'s role? How does He apply this?' },
          { dim: 'Ecclesial', detail: 'What does this mean for the community of believers?' },
          { dim: 'Ethical', detail: 'What commands, principles, or behaviors are implied?' },
          { dim: 'Eschatological', detail: 'How does this fit in God\'s end-time plan?' },
          { dim: 'Personal', detail: 'What is God saying to ME personally through this?' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 350}, ${Math.floor(i / 2) * 48})`}>
            <rect x="0" y="0" width="340" height="43" rx="8" fill={i % 2 === 0 ? '#E0F2FE' : 'white'} stroke="#0EA5E9" strokeWidth="1" />
            <text x="15" y="18" fill="#075985" fontSize="11" fontWeight="bold">{i + 1}. {item.dim}</text>
            <text x="15" y="35" fill="#0284C7" fontSize="9">{item.detail}</text>
          </g>
        ))}
      </g>

      {/* Grouping */}
      <rect x="50" y="310" width="700" height="130" rx="12" fill="white" stroke="#0EA5E9" strokeWidth="2" />
      <text x="400" y="335" textAnchor="middle" fill="#075985" fontSize="14" fontWeight="bold">
        Dimension Categories
      </text>

      <g transform="translate(70, 350)">
        <rect x="0" y="0" width="200" height="75" rx="8" fill="#DBEAFE" />
        <text x="100" y="20" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold">Foundation (1-3)</text>
        <text x="100" y="38" textAnchor="middle" fill="#1D4ED8" fontSize="9">Historical, Grammatical, Literary</text>
        <text x="100" y="55" textAnchor="middle" fill="#2563EB" fontSize="8" fontStyle="italic">What does it MEAN?</text>
      </g>

      <g transform="translate(290, 350)">
        <rect x="0" y="0" width="200" height="75" rx="8" fill="#FCE7F3" />
        <text x="100" y="20" textAnchor="middle" fill="#9D174D" fontSize="11" fontWeight="bold">Doctrine (4-7)</text>
        <text x="100" y="38" textAnchor="middle" fill="#BE185D" fontSize="9">Theological, Christological...</text>
        <text x="100" y="55" textAnchor="middle" fill="#DB2777" fontSize="8" fontStyle="italic">What does it TEACH?</text>
      </g>

      <g transform="translate(510, 350)">
        <rect x="0" y="0" width="200" height="75" rx="8" fill="#D1FAE5" />
        <text x="100" y="20" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold">Application (8-10)</text>
        <text x="100" y="38" textAnchor="middle" fill="#047857" fontSize="9">Ethical, Eschatological, Personal</text>
        <text x="100" y="55" textAnchor="middle" fill="#059669" fontSize="8" fontStyle="italic">What should I DO?</text>
      </g>

      {/* Deliverable */}
      <rect x="50" y="460" width="700" height="70" rx="12" fill="#0EA5E9" />
      <text x="400" y="490" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: 10-Dimension Analysis Sheet
      </text>
      <text x="400" y="515" textAnchor="middle" fill="#E0F2FE" fontSize="12">
        Passage + Each Dimension Question Answered = Comprehensive Study
      </text>
    </svg>
  );
}

// Dimensions Room Example
export function DimensionsRoomExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F0F9FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#075985" fontSize="22" fontWeight="bold">
        Example: John 3:16 Through 10 Dimensions
      </text>

      {/* Passage */}
      <rect x="50" y="50" width="700" height="35" rx="8" fill="white" stroke="#0EA5E9" strokeWidth="2" />
      <text x="400" y="72" textAnchor="middle" fill="#0369A1" fontSize="11" fontStyle="italic">
        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth..."
      </text>

      {/* 10 Dimension Analysis */}
      <g transform="translate(50, 95)">
        {[
          { dim: '1. Historical', answer: 'Jesus speaking to Nicodemus at night; Pharisee context' },
          { dim: '2. Grammatical', answer: '"So loved" (houtos) = in this manner; "begotten" (monogenes) = unique, one-of-a-kind' },
          { dim: '3. Literary', answer: 'Gospel narrative; explanatory discourse; chiastic structure possible' },
          { dim: '4. Theological', answer: 'God\'s love initiates salvation; His character is self-giving love' },
          { dim: '5. Christological', answer: 'Jesus is the unique Son; the GIFT of salvation; belief centers on Him' },
          { dim: '6. Pneumatic', answer: 'Spirit context (v.5-8); Spirit enables belief and new birth' },
          { dim: '7. Ecclesial', answer: '"Whosoever" = universal invitation; basis for evangelism' },
          { dim: '8. Ethical', answer: 'We should believe; we should share this love with others' },
          { dim: '9. Eschatological', answer: 'Eternal life vs. perishing; final destiny determined by belief' },
          { dim: '10. Personal', answer: 'God loved ME specifically; I must personally believe' },
        ].map((item, i) => (
          <g key={i} transform={`translate(0, ${i * 48})`}>
            <rect x="0" y="0" width="700" height="45" rx="6" fill={i % 2 === 0 ? '#E0F2FE' : 'white'} stroke="#BAE6FD" strokeWidth="1" />
            <text x="15" y="18" fill="#075985" fontSize="10" fontWeight="bold">{item.dim}</text>
            <text x="15" y="35" fill="#0284C7" fontSize="9">{item.answer}</text>
          </g>
        ))}
      </g>

      {/* Summary */}
      <rect x="50" y="580" width="700" height="8" rx="4" fill="#0EA5E9" />
    </svg>
  );
}

export default {
  DimensionsRoomFlowchart,
  DimensionsRoomConcept,
  DimensionsRoomExample
};
