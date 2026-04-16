import React from 'react';

// Parallels Room Method Flowchart
export function ParallelsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="par-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="50%" stopColor="#E0E7FF" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
        <linearGradient id="par-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="par-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <filter id="par-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="par-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#par-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#3730A3" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Parallels Room: OT/NT Mirror Connections
      </text>

      {/* Parallel Lines Visual */}
      <g transform="translate(100, 80)">
        <rect x="0" y="0" width="250" height="120" rx="12" fill="url(#par-grad)" />
        <text x="125" y="35" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">OLD TESTAMENT</text>
        <text x="125" y="60" textAnchor="middle" fill="#C7D2FE" fontSize="12">Shadow / Type</text>
        <text x="125" y="85" textAnchor="middle" fill="#E0E7FF" fontSize="11">Promise / Pattern</text>
        <text x="125" y="105" textAnchor="middle" fill="#E0E7FF" fontSize="11">Prophecy / Picture</text>

        {/* Mirror Lines */}
        <line x1="260" y1="30" x2="340" y2="30" stroke="#6366F1" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="260" y1="60" x2="340" y2="60" stroke="#6366F1" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="260" y1="90" x2="340" y2="90" stroke="#6366F1" strokeWidth="2" strokeDasharray="5,5" />
        <text x="300" y="120" textAnchor="middle" fontSize="24">🪞</text>

        <rect x="350" y="0" width="250" height="120" rx="12" fill="#10B981" />
        <text x="475" y="35" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">NEW TESTAMENT</text>
        <text x="475" y="60" textAnchor="middle" fill="#A7F3D0" fontSize="12">Reality / Antitype</text>
        <text x="475" y="85" textAnchor="middle" fill="#D1FAE5" fontSize="11">Fulfillment / Completion</text>
        <text x="475" y="105" textAnchor="middle" fill="#D1FAE5" fontSize="11">Revelation / Person</text>
      </g>

      {/* Method Steps */}
      <rect x="50" y="230" width="700" height="130" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="260" textAnchor="middle" fill="#3730A3" fontSize="16" fontWeight="bold">
        The Parallels Method
      </text>

      <g transform="translate(70, 280)">
        {[
          { step: '1', text: 'Read OT passage', desc: 'Note key elements' },
          { step: '2', text: 'Find NT echo', desc: 'Where quoted/referenced?' },
          { step: '3', text: 'Map the parallel', desc: 'What = What?' },
          { step: '4', text: 'Extract the upgrade', desc: 'How is NT greater?' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <circle cx="20" cy="20" r="18" fill="#6366F1" />
            <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.step}</text>
            <text x="85" y="15" textAnchor="middle" fill="#3730A3" fontSize="10" fontWeight="bold">{item.text}</text>
            <text x="85" y="32" textAnchor="middle" fill="#6366F1" fontSize="9">{item.desc}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="380" width="700" height="100" rx="12" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="410" textAnchor="middle" fill="#3730A3" fontSize="16" fontWeight="bold">
        The Upgrade Principle
      </text>
      <text x="400" y="435" textAnchor="middle" fill="#4338CA" fontSize="13">
        "The NT is in the OT concealed; the OT is in the NT revealed"
      </text>
      <text x="400" y="458" textAnchor="middle" fill="#4338CA" fontSize="12">
        Every parallel shows Christ as the greater fulfillment
      </text>
      <text x="400" y="478" textAnchor="middle" fill="#3730A3" fontSize="11" fontStyle="italic">
        Greater temple, greater priest, greater sacrifice, greater covenant
      </text>
    </svg>
  );
}

// Parallels Room Concept Infographic
export function ParallelsRoomConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#EEF2FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#3730A3" fontSize="22" fontWeight="bold">
        Major OT/NT Parallels
      </text>

      {/* Parallels Table */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="30" rx="8 8 0 0" fill="#6366F1" />
        <text x="175" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OLD TESTAMENT</text>
        <text x="525" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">NEW TESTAMENT</text>

        {[
          { ot: 'Adam (first man)', nt: 'Christ (last Adam) — 1 Cor 15:45' },
          { ot: 'Passover Lamb', nt: 'Christ our Passover — 1 Cor 5:7' },
          { ot: 'Manna from heaven', nt: 'Bread of Life — John 6:35' },
          { ot: 'Bronze serpent lifted', nt: 'Son of Man lifted — John 3:14' },
          { ot: 'Melchizedek priest', nt: 'Christ eternal priest — Heb 7' },
          { ot: 'Tabernacle (copy)', nt: 'Heavenly sanctuary — Heb 8:2' },
          { ot: 'Day of Atonement', nt: 'Christ\'s once-for-all sacrifice — Heb 9' },
          { ot: 'Moses (deliverer)', nt: 'Christ (greater deliverer) — Heb 3' },
          { ot: 'Joshua (rest-giver)', nt: 'Jesus (true rest) — Heb 4' },
          { ot: 'David (king)', nt: 'Christ (eternal King) — Luke 1:32' },
        ].map((item, i) => (
          <g key={i} transform={`translate(0, ${30 + i * 35})`}>
            <rect x="0" y="0" width="700" height="35" fill={i % 2 === 0 ? '#E0E7FF' : 'white'} />
            <text x="175" y="22" textAnchor="middle" fill="#3730A3" fontSize="10">{item.ot}</text>
            <text x="350" y="22" textAnchor="middle" fill="#6366F1" fontSize="14">→</text>
            <text x="525" y="22" textAnchor="middle" fill="#10B981" fontSize="10">{item.nt}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#6366F1" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Parallel Mapping Chart
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#C7D2FE" fontSize="12">
        OT Element + NT Fulfillment + How Christ is Greater = Parallel Complete
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        Build your personal typology reference
      </text>
    </svg>
  );
}

// Parallels Room Example
export function ParallelsRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#EEF2FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#3730A3" fontSize="22" fontWeight="bold">
        Example: Jonah/Jesus Parallel
      </text>

      {/* Parallel Mapping */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="330" height="270" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
        <rect x="0" y="0" width="330" height="35" rx="12 12 0 0" fill="#6366F1" />
        <text x="165" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">JONAH (Type)</text>

        {[
          '3 days in fish\'s belly',
          'Storm-tossed boat',
          'Sleeping during storm',
          '"Throw me over"',
          'Sailors converted',
          'Preached to Gentiles',
          'Nineveh repented',
          'Angry at grace to pagans',
        ].map((item, i) => (
          <text key={i} x="20" y={60 + i * 28} fill="#3730A3" fontSize="10">• {item}</text>
        ))}
      </g>

      <g transform="translate(420, 55)">
        <rect x="0" y="0" width="330" height="270" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="330" height="35" rx="12 12 0 0" fill="#10B981" />
        <text x="165" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">JESUS (Antitype)</text>

        {[
          '3 days in the tomb',
          'Storms of trial/crucifixion',
          'Peace amid the storm',
          '"Take me instead"',
          'Disciples transformed',
          'Gospel to all nations',
          'Billions saved',
          'REJOICES at grace to all',
        ].map((item, i) => (
          <text key={i} x="20" y={60 + i * 28} fill="#065F46" fontSize="10">• {item}</text>
        ))}
      </g>

      {/* Center Arrow */}
      <text x="385" y="200" textAnchor="middle" fontSize="40">→</text>

      {/* Upgrade Analysis */}
      <g transform="translate(50, 340)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#3730A3" fontSize="14" fontWeight="bold">
          The Upgrade: How Jesus is Greater
        </text>
        <text x="20" y="50" fill="#4338CA" fontSize="10">• Jonah ran from God; Jesus ran TO the cross</text>
        <text x="20" y="68" fill="#4338CA" fontSize="10">• Jonah was angry at Gentile salvation; Jesus died for it</text>
        <text x="350" y="50" fill="#4338CA" fontSize="10">• Jonah's "death" saved a boat; Jesus' death saved the world</text>
        <text x="350" y="68" fill="#4338CA" fontSize="10">• Jonah's story ended in complaint; Jesus' ends in triumph</text>
        <text x="350" y="90" textAnchor="middle" fill="#3730A3" fontSize="11" fontWeight="bold" fontStyle="italic">
          "A greater than Jonah is here" — Matthew 12:41
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="455" width="700" height="80" rx="12" fill="#6366F1" />
      <text x="400" y="485" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Parallel Insight: Jonah's story was a preview of the Gospel
      </text>
      <text x="400" y="510" textAnchor="middle" fill="#C7D2FE" fontSize="12">
        Every detail of Jonah points forward to Christ — the greater prophet,
      </text>
      <text x="400" y="528" textAnchor="middle" fill="#C7D2FE" fontSize="12">
        the willing sacrifice, the victorious resurrection, the Savior of nations
      </text>
    </svg>
  );
}

export default {
  ParallelsRoomFlowchart,
  ParallelsRoomConcept,
  ParallelsRoomExample
};
