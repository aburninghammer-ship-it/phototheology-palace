import React from 'react';

// Eight Cycles Room Method Flowchart
export function EightCyclesFlowchart() {
  return (
    <svg viewBox="0 0 800 650" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cycle-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="cycle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id="cycle-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <filter id="cycle-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="cycle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="650" fill="url(#cycle-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#9D174D" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Eight Cycles: God's Repeating Pattern in History
      </text>

      {/* Cycle Wheel Visual */}
      <g transform="translate(400, 200)">
        <circle cx="0" cy="0" r="140" fill="none" stroke="#EC4899" strokeWidth="3" />

        {[
          { name: 'Adamic', code: '@Ad', angle: -90, color: '#EF4444' },
          { name: 'Noahic', code: '@No', angle: -45, color: '#F97316' },
          { name: 'Abrahamic', code: '@Ab', angle: 0, color: '#EAB308' },
          { name: 'Mosaic', code: '@Mo', angle: 45, color: '#22C55E' },
          { name: 'Cyrusic', code: '@Cy', angle: 90, color: '#06B6D4' },
          { name: 'Cyrus-Christ', code: '@CyC', angle: 135, color: '#3B82F6' },
          { name: 'Holy Spirit', code: '@Sp', angle: 180, color: '#8B5CF6' },
          { name: 'Remnant', code: '@Re', angle: 225, color: '#EC4899' },
        ].map((cycle, i) => {
          const rad = (cycle.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 140;
          const y = Math.sin(rad) * 140;
          const labelX = Math.cos(rad) * 175;
          const labelY = Math.sin(rad) * 175;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="20" fill={cycle.color} />
              <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{cycle.code}</text>
              <text x={labelX} y={labelY} textAnchor="middle" fill="#9D174D" fontSize="9" fontWeight="bold">{cycle.name}</text>
            </g>
          );
        })}

        <circle cx="0" cy="0" r="50" fill="url(#cycle-grad)" />
        <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CYCLES</text>
        <text x="0" y="15" textAnchor="middle" fill="white" fontSize="9">of History</text>
      </g>

      {/* Cycle Pattern */}
      <rect x="50" y="370" width="700" height="130" rx="12" fill="white" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="395" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
        The Universal Cycle Pattern
      </text>

      <g transform="translate(80, 410)">
        {[
          { step: 'Creation/Calling', desc: 'God initiates', icon: '1' },
          { step: 'Covenant', desc: 'Promise given', icon: '2' },
          { step: 'Corruption', desc: 'Humanity fails', icon: '3' },
          { step: 'Crisis', desc: 'Judgment comes', icon: '4' },
          { step: 'Cleansing', desc: 'Remnant preserved', icon: '5' },
          { step: 'Continuation', desc: 'New beginning', icon: '6' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 107}, 0)`}>
            <circle cx="20" cy="20" r="18" fill="#EC4899" />
            <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.icon}</text>
            <text x="55" y="15" fill="#9D174D" fontSize="9" fontWeight="bold">{item.step}</text>
            <text x="55" y="30" fill="#DB2777" fontSize="8">{item.desc}</text>
          </g>
        ))}
      </g>

      <text x="400" y="485" textAnchor="middle" fill="#9D174D" fontSize="11" fontStyle="italic">
        Each cycle follows the same pattern — God is consistent across all of history
      </text>

      {/* Key Principle */}
      <rect x="50" y="510" width="700" height="55" rx="12" fill="#FBD5E8" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="540" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">
        "What has been will be again" — Ecclesiastes 1:9
      </text>
      <text x="400" y="558" textAnchor="middle" fill="#BE185D" fontSize="10">
        History doesn't just repeat; it rhymes with divine purpose
      </text>

      {/* Summary */}
      <rect x="50" y="580" width="700" height="55" rx="12" fill="url(#cycle-grad)" />
      <text x="400" y="610" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Master the 8 cycles and you'll see God's fingerprints across all of Scripture
      </text>
    </svg>
  );
}

// Eight Cycles Room Concept Infographic
export function EightCyclesConcept() {
  return (
    <svg viewBox="0 0 800 750" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="750" fill="#FDF2F8" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold">
        The Eight Cycles Explained
      </text>

      {/* Cycles Grid */}
      <g transform="translate(50, 55)">
        {[
          {
            name: 'Adamic Cycle (@Ad)',
            period: 'Creation → Flood',
            key: 'Adam to Noah',
            pattern: 'Creation → Fall → Judgment (Flood) → New Start',
            color: '#EF4444'
          },
          {
            name: 'Noahic Cycle (@No)',
            period: 'Flood → Babel',
            key: 'Noah to Abraham',
            pattern: 'Covenant → Corruption → Babel judgment → Scattering',
            color: '#F97316'
          },
          {
            name: 'Abrahamic Cycle (@Ab)',
            period: 'Abraham → Egypt',
            key: 'Patriarchs',
            pattern: 'Calling → Promise → Famine → Egypt slavery',
            color: '#EAB308'
          },
          {
            name: 'Mosaic Cycle (@Mo)',
            period: 'Exodus → Exile',
            key: 'Israel as nation',
            pattern: 'Deliverance → Law → Idolatry → Babylon',
            color: '#22C55E'
          },
          {
            name: 'Cyrusic Cycle (@Cy)',
            period: 'Return → Christ',
            key: 'Second Temple',
            pattern: 'Restoration → Rebuilding → Apostasy → Messiah',
            color: '#06B6D4'
          },
          {
            name: 'Cyrus-Christ (@CyC)',
            period: 'Christ → 70 AD',
            key: 'Gospel era',
            pattern: 'Messiah comes → Rejected → Cross → Resurrection',
            color: '#3B82F6'
          },
          {
            name: 'Holy Spirit Cycle (@Sp)',
            period: 'Pentecost → End',
            key: 'Church age',
            pattern: 'Spirit poured → Gospel spreads → Apostasy → Remnant',
            color: '#8B5CF6'
          },
          {
            name: 'Remnant Cycle (@Re)',
            period: 'End times → Eternity',
            key: 'Final generation',
            pattern: 'Latter rain → Loud cry → Persecution → Deliverance',
            color: '#EC4899'
          },
        ].map((cycle, i) => (
          <g key={i} transform={`translate(${(i % 2) * 355}, ${Math.floor(i / 2) * 80})`}>
            <rect x="0" y="0" width="340" height="72" rx="10" fill="white" stroke={cycle.color} strokeWidth="2" />
            <rect x="0" y="0" width="340" height="24" rx="10 10 0 0" fill={cycle.color} />
            <text x="170" y="17" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{cycle.name}</text>
            <text x="10" y="42" fill="#374151" fontSize="9"><tspan fontWeight="bold">Period:</tspan> {cycle.period}</text>
            <text x="10" y="56" fill="#374151" fontSize="8"><tspan fontWeight="bold">Key:</tspan> {cycle.key}</text>
            <text x="10" y="68" fill="#6B7280" fontSize="7">{cycle.pattern}</text>
          </g>
        ))}
      </g>

      {/* How Cycles Connect */}
      <rect x="50" y="385" width="700" height="180" rx="12" fill="white" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="410" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
        How the Cycles Connect
      </text>

      <g transform="translate(70, 430)">
        <text x="0" y="0" fill="#9D174D" fontSize="11" fontWeight="bold">Cross-Cycle Patterns:</text>
        <text x="0" y="22" fill="#6B7280" fontSize="10">• Each cycle ends with judgment AND a preserved remnant</text>
        <text x="0" y="40" fill="#6B7280" fontSize="10">• The remnant becomes the seed for the next cycle</text>
        <text x="0" y="58" fill="#6B7280" fontSize="10">• Covenant promises carry forward and expand</text>
        <text x="0" y="76" fill="#6B7280" fontSize="10">• Christ is foreshadowed in EVERY cycle (types and shadows)</text>
        <text x="0" y="94" fill="#6B7280" fontSize="10">• The final cycle (@Re) is the ultimate fulfillment of all previous patterns</text>

        <text x="350" y="0" fill="#9D174D" fontSize="11" fontWeight="bold">Prophetic Connections:</text>
        <text x="350" y="22" fill="#6B7280" fontSize="10">• @Ad → @Re: Eden restored in New Earth</text>
        <text x="350" y="40" fill="#6B7280" fontSize="10">• @No → @Re: Flood/Fire parallel (2 Pet 3)</text>
        <text x="350" y="58" fill="#6B7280" fontSize="10">• @Mo → @Sp: Exodus/Revelation parallel</text>
        <text x="350" y="76" fill="#6B7280" fontSize="10">• @Cy → @CyC: Cyrus/Christ parallel</text>
        <text x="350" y="94" fill="#6B7280" fontSize="10">• First → Last: "I am Alpha and Omega"</text>
      </g>

      {/* Study Method */}
      <rect x="50" y="580" width="700" height="80" rx="12" fill="#FBD5E8" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="605" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">
        Eight Cycles Study Method
      </text>
      <text x="400" y="625" textAnchor="middle" fill="#BE185D" fontSize="10">
        1. Identify which cycle the passage is in → 2. Find the pattern stage → 3. Connect to parallel cycles
      </text>
      <text x="400" y="645" textAnchor="middle" fill="#BE185D" fontSize="10">
        4. See how Christ fulfills the pattern → 5. Apply to the Remnant cycle today
      </text>

      {/* Deliverable */}
      <rect x="50" y="675" width="700" height="60" rx="12" fill="#EC4899" />
      <text x="400" y="702" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Deliverable: 8-Cycle Reference Chart
      </text>
      <text x="400" y="722" textAnchor="middle" fill="#FBD5E8" fontSize="11">
        Map each Bible book/event to its cycle and identify cross-cycle connections
      </text>
    </svg>
  );
}

// Eight Cycles Room Example
export function EightCyclesExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#FDF2F8" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold">
        Example: Comparing Mosaic and Remnant Cycles
      </text>

      {/* Two Cycle Comparison */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="340" height="300" rx="12" fill="white" stroke="#22C55E" strokeWidth="3" />
        <rect x="0" y="0" width="340" height="40" rx="12 12 0 0" fill="#22C55E" />
        <text x="170" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">MOSAIC CYCLE (@Mo)</text>

        {[
          { stage: 'Calling', event: 'Moses at burning bush', ref: 'Exodus 3' },
          { stage: 'Deliverance', event: 'Red Sea crossing', ref: 'Exodus 14' },
          { stage: 'Covenant', event: 'Law at Sinai', ref: 'Exodus 20' },
          { stage: 'Wilderness', event: '40 years testing', ref: 'Numbers' },
          { stage: 'Inheritance', event: 'Enter Canaan', ref: 'Joshua' },
          { stage: 'Apostasy', event: 'Judges cycle', ref: 'Judges 2' },
          { stage: 'Judgment', event: 'Babylonian exile', ref: '2 Kings 25' },
          { stage: 'Remnant', event: 'Return under Cyrus', ref: 'Ezra 1' },
        ].map((item, i) => (
          <g key={i} transform={`translate(15, ${50 + i * 30})`}>
            <text x="0" y="0" fill="#15803D" fontSize="10" fontWeight="bold">{item.stage}:</text>
            <text x="80" y="0" fill="#22C55E" fontSize="9">{item.event}</text>
            <text x="260" y="0" fill="#16A34A" fontSize="8" fontStyle="italic">{item.ref}</text>
          </g>
        ))}
      </g>

      <g transform="translate(410, 55)">
        <rect x="0" y="0" width="340" height="300" rx="12" fill="white" stroke="#EC4899" strokeWidth="3" />
        <rect x="0" y="0" width="340" height="40" rx="12 12 0 0" fill="#EC4899" />
        <text x="170" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">REMNANT CYCLE (@Re)</text>

        {[
          { stage: 'Calling', event: 'Three Angels Messages', ref: 'Rev 14:6-12' },
          { stage: 'Deliverance', event: 'Sealed / protected', ref: 'Rev 7:1-4' },
          { stage: 'Covenant', event: 'Everlasting Gospel', ref: 'Rev 14:6' },
          { stage: 'Wilderness', event: 'Time of trouble', ref: 'Dan 12:1' },
          { stage: 'Inheritance', event: 'Enter New Earth', ref: 'Rev 21:1-4' },
          { stage: 'Apostasy', event: 'Babylon falls', ref: 'Rev 18:2' },
          { stage: 'Judgment', event: 'Seven last plagues', ref: 'Rev 16' },
          { stage: 'Remnant', event: '144,000 + multitude', ref: 'Rev 7:9' },
        ].map((item, i) => (
          <g key={i} transform={`translate(15, ${50 + i * 30})`}>
            <text x="0" y="0" fill="#9D174D" fontSize="10" fontWeight="bold">{item.stage}:</text>
            <text x="80" y="0" fill="#EC4899" fontSize="9">{item.event}</text>
            <text x="260" y="0" fill="#DB2777" fontSize="8" fontStyle="italic">{item.ref}</text>
          </g>
        ))}
      </g>

      {/* Center Arrow */}
      <text x="385" y="205" textAnchor="middle" fontSize="30" fill="#9D174D">↔</text>

      {/* Key Parallels */}
      <rect x="50" y="370" width="700" height="110" rx="12" fill="#FBD5E8" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="395" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
        Key Parallels Discovered
      </text>

      <g transform="translate(70, 410)">
        {[
          'Moses = End-time prophetic movement',
          'Red Sea = Deliverance from spiritual Egypt (world)',
          'Sinai = Everlasting Gospel proclaimed',
          '40 years = Time of trouble testing',
          'Canaan = New Earth inheritance',
          'Babylon exile = Spiritual Babylon deception',
        ].map((item, i) => (
          <text key={i} x={(i % 2) * 330} y={Math.floor(i / 2) * 22} fill="#9D174D" fontSize="10">
            • {item}
          </text>
        ))}
      </g>

      {/* Summary */}
      <rect x="50" y="495" width="700" height="90" rx="12" fill="#EC4899" />
      <text x="400" y="525" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Eight Cycles Insight
      </text>
      <text x="400" y="550" textAnchor="middle" fill="#FBD5E8" fontSize="11">
        The Remnant Cycle (@Re) is the FINAL replay of all previous cycles
      </text>
      <text x="400" y="572" textAnchor="middle" fill="#FBD5E8" fontSize="11">
        Study Exodus to understand Revelation — the patterns are identical!
      </text>
    </svg>
  );
}

export default {
  EightCyclesFlowchart,
  EightCyclesConcept,
  EightCyclesExample
};
