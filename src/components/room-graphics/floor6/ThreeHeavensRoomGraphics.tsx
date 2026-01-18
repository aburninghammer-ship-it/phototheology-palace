import React from 'react';

// Three Heavens Room Method Flowchart
export function ThreeHeavensFlowchart() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="3h-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="3h-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="3h-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="3h-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="3h-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="3h-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#3h-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Three Heavens: Understanding Biblical Prophecy Layers
      </text>

      {/* Three Columns */}
      <g transform="translate(50, 70)">
        {/* First Heaven */}
        <g>
          <rect x="0" y="0" width="220" height="280" rx="12" fill="white" stroke="#3B82F6" strokeWidth="3" />
          <rect x="0" y="0" width="220" height="45" rx="12 12 0 0" fill="url(#3h-grad-1)" />
          <text x="110" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">1st HEAVEN</text>

          <text x="110" y="70" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">Day of the Lord 1</text>
          <text x="110" y="90" textAnchor="middle" fill="#3B82F6" fontSize="10">Babylonian Judgment</text>

          <rect x="15" y="105" width="190" height="60" rx="6" fill="#DBEAFE" />
          <text x="110" y="125" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">Key Events:</text>
          <text x="110" y="142" textAnchor="middle" fill="#3B82F6" fontSize="9">• 607/586 BC - Jerusalem falls</text>
          <text x="110" y="156" textAnchor="middle" fill="#3B82F6" fontSize="9">• Temple destroyed</text>

          <rect x="15" y="175" width="190" height="50" rx="6" fill="#EFF6FF" />
          <text x="110" y="195" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">New Earth 1:</text>
          <text x="110" y="212" textAnchor="middle" fill="#3B82F6" fontSize="9">Return from Babylon (536 BC)</text>

          <text x="110" y="250" textAnchor="middle" fill="#1E40AF" fontSize="10" fontStyle="italic">
            "The sun turned dark..."
          </text>
          <text x="110" y="268" textAnchor="middle" fill="#3B82F6" fontSize="9">Joel 2, Isaiah 13</text>
        </g>

        {/* Second Heaven */}
        <g transform="translate(240, 0)">
          <rect x="0" y="0" width="220" height="280" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="3" />
          <rect x="0" y="0" width="220" height="45" rx="12 12 0 0" fill="url(#3h-grad-2)" />
          <text x="110" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">2nd HEAVEN</text>

          <text x="110" y="70" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">Day of the Lord 2</text>
          <text x="110" y="90" textAnchor="middle" fill="#8B5CF6" fontSize="10">Roman Judgment</text>

          <rect x="15" y="105" width="190" height="60" rx="6" fill="#EDE9FE" />
          <text x="110" y="125" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">Key Events:</text>
          <text x="110" y="142" textAnchor="middle" fill="#8B5CF6" fontSize="9">• 70 AD - Jerusalem destroyed</text>
          <text x="110" y="156" textAnchor="middle" fill="#8B5CF6" fontSize="9">• Temple destroyed (again!)</text>

          <rect x="15" y="175" width="190" height="50" rx="6" fill="#F5F3FF" />
          <text x="110" y="195" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">New Earth 2:</text>
          <text x="110" y="212" textAnchor="middle" fill="#8B5CF6" fontSize="9">Church age begins</text>

          <text x="110" y="250" textAnchor="middle" fill="#5B21B6" fontSize="10" fontStyle="italic">
            "This generation..."
          </text>
          <text x="110" y="268" textAnchor="middle" fill="#8B5CF6" fontSize="9">Matthew 24, Luke 21</text>
        </g>

        {/* Third Heaven */}
        <g transform="translate(480, 0)">
          <rect x="0" y="0" width="220" height="280" rx="12" fill="white" stroke="#F59E0B" strokeWidth="3" />
          <rect x="0" y="0" width="220" height="45" rx="12 12 0 0" fill="url(#3h-grad-3)" />
          <text x="110" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">3rd HEAVEN</text>

          <text x="110" y="70" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">Day of the Lord 3</text>
          <text x="110" y="90" textAnchor="middle" fill="#F59E0B" fontSize="10">Final Judgment</text>

          <rect x="15" y="105" width="190" height="60" rx="6" fill="#FEF3C7" />
          <text x="110" y="125" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">Key Events:</text>
          <text x="110" y="142" textAnchor="middle" fill="#D97706" fontSize="9">• Second Coming of Christ</text>
          <text x="110" y="156" textAnchor="middle" fill="#D97706" fontSize="9">• Earth destroyed by fire</text>

          <rect x="15" y="175" width="190" height="50" rx="6" fill="#FFFBEB" />
          <text x="110" y="195" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">New Earth 3:</text>
          <text x="110" y="212" textAnchor="middle" fill="#D97706" fontSize="9">Eternal kingdom established</text>

          <text x="110" y="250" textAnchor="middle" fill="#92400E" fontSize="10" fontStyle="italic">
            "New heaven, new earth..."
          </text>
          <text x="110" y="268" textAnchor="middle" fill="#D97706" fontSize="9">Revelation 21</text>
        </g>
      </g>

      {/* The Principle */}
      <rect x="50" y="370" width="700" height="100" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="400" textAnchor="middle" fill="#3730A3" fontSize="14" fontWeight="bold">
        The Three Heavens Principle
      </text>
      <text x="400" y="425" textAnchor="middle" fill="#4F46E5" fontSize="11">
        Most OT prophecies have THREE fulfillments: Babylon (1H), Rome/70AD (2H), and End Times (3H)
      </text>
      <text x="400" y="450" textAnchor="middle" fill="#4F46E5" fontSize="11">
        Same cosmic language, same pattern: Judgment → Remnant Saved → New Beginning
      </text>

      {/* Key Insight */}
      <rect x="50" y="485" width="700" height="100" rx="12" fill="#6366F1" />
      <text x="400" y="515" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Why This Matters
      </text>
      <text x="400" y="540" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        When you read "Day of the Lord" language, ask: Which heaven is this primarily addressing?
      </text>
      <text x="400" y="560" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        Context (date written, audience) determines primary application
      </text>
    </svg>
  );
}

// Three Heavens Room Concept Infographic
export function ThreeHeavensConcept() {
  return (
    <svg viewBox="0 0 800 650" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="650" fill="#F8FAFC" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E3A8A" fontSize="22" fontWeight="bold">
        The Three Cycles Pattern
      </text>

      {/* Parallel Structure */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="30" rx="8" fill="#6366F1" />
        <text x="100" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ELEMENT</text>
        <text x="270" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1st HEAVEN</text>
        <text x="440" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2nd HEAVEN</text>
        <text x="610" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3rd HEAVEN</text>
      </g>

      <g transform="translate(50, 90)">
        {[
          { element: 'Babylon', h1: 'Literal Babylon', h2: 'Spiritual Babylon (Rome)', h3: 'End-time Babylon (Rev 17-18)' },
          { element: 'Temple', h1: 'Solomon\'s Temple', h2: 'Herod\'s Temple', h3: 'Heavenly Sanctuary' },
          { element: 'Judgment', h1: '607/586 BC', h2: '70 AD', h3: 'Second Coming' },
          { element: 'Remnant', h1: 'Jews return', h2: 'Christians escape', h3: '144,000 sealed' },
          { element: 'New Earth', h1: 'Rebuilt Jerusalem', h2: 'Church established', h3: 'Eternal kingdom' },
          { element: 'Duration', h1: '70 years captivity', h2: '~2000 years', h3: 'Eternity' },
          { element: 'Deliverer', h1: 'Cyrus', h2: 'Christ (1st coming)', h3: 'Christ (2nd coming)' },
          { element: 'Enemy', h1: 'Nebuchadnezzar', h2: 'Rome/Titus', h3: 'Antichrist' },
        ].map((row, i) => (
          <g key={i} transform={`translate(0, ${i * 42})`}>
            <rect x="0" y="0" width="700" height="38" rx="4" fill={i % 2 === 0 ? '#EEF2FF' : 'white'} />
            <text x="100" y="24" textAnchor="middle" fill="#3730A3" fontSize="10" fontWeight="bold">{row.element}</text>
            <text x="270" y="24" textAnchor="middle" fill="#3B82F6" fontSize="9">{row.h1}</text>
            <text x="440" y="24" textAnchor="middle" fill="#8B5CF6" fontSize="9">{row.h2}</text>
            <text x="610" y="24" textAnchor="middle" fill="#F59E0B" fontSize="9">{row.h3}</text>
          </g>
        ))}
      </g>

      {/* Key Prophets */}
      <rect x="50" y="440" width="700" height="100" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="465" textAnchor="middle" fill="#3730A3" fontSize="14" fontWeight="bold">
        Which Prophets Address Which Heaven?
      </text>

      <g transform="translate(70, 480)">
        <rect x="0" y="0" width="200" height="45" rx="8" fill="#DBEAFE" />
        <text x="100" y="18" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">Pre-Exilic (1H primary)</text>
        <text x="100" y="35" textAnchor="middle" fill="#3B82F6" fontSize="9">Isaiah, Jeremiah, Ezekiel</text>

        <rect x="220" y="0" width="200" height="45" rx="8" fill="#EDE9FE" />
        <text x="320" y="18" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">Post-Exilic (2H primary)</text>
        <text x="320" y="35" textAnchor="middle" fill="#8B5CF6" fontSize="9">Daniel, Zechariah, Malachi</text>

        <rect x="440" y="0" width="200" height="45" rx="8" fill="#FEF3C7" />
        <text x="540" y="18" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">NT Apocalyptic (3H primary)</text>
        <text x="540" y="35" textAnchor="middle" fill="#D97706" fontSize="9">Revelation, Matthew 24</text>
      </g>

      {/* Deliverable */}
      <rect x="50" y="555" width="700" height="80" rx="12" fill="#6366F1" />
      <text x="400" y="585" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Deliverable: Three Heavens Classification Chart
      </text>
      <text x="400" y="610" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        For any prophetic passage: Identify primary heaven, secondary applications, and ultimate fulfillment
      </text>
      <text x="400" y="628" textAnchor="middle" fill="#A5B4FC" fontSize="10">
        Master the pattern: DoL → Remnant → New Earth (repeated 3x)
      </text>
    </svg>
  );
}

// Three Heavens Room Example
export function ThreeHeavensExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F8FAFC" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E3A8A" fontSize="22" fontWeight="bold">
        Example: Joel 2:28-32 Through Three Heavens
      </text>

      {/* The Text */}
      <rect x="50" y="55" width="700" height="60" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="80" textAnchor="middle" fill="#3730A3" fontSize="10" fontStyle="italic">
        "I will pour out my Spirit upon all flesh... The sun shall be turned into darkness,
      </text>
      <text x="400" y="98" textAnchor="middle" fill="#3730A3" fontSize="10" fontStyle="italic">
        and the moon into blood, before the great and terrible day of the LORD come."
      </text>

      {/* Three Applications */}
      <g transform="translate(50, 130)">
        {/* 1H */}
        <rect x="0" y="0" width="220" height="200" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#3B82F6" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">1H: Babylonian Context</text>

        <text x="15" y="55" fill="#1E40AF" fontSize="10" fontWeight="bold">Primary Application:</text>
        <text x="15" y="75" fill="#3B82F6" fontSize="9">• Joel writes ~835 BC</text>
        <text x="15" y="92" fill="#3B82F6" fontSize="9">• Locust plague = preview</text>
        <text x="15" y="109" fill="#3B82F6" fontSize="9">• Day of LORD = Babylon coming</text>
        <text x="15" y="126" fill="#3B82F6" fontSize="9">• Spirit poured = prophets raised</text>
        <text x="15" y="150" fill="#1E40AF" fontSize="10" fontWeight="bold">Cosmic language = political</text>
        <text x="15" y="167" fill="#3B82F6" fontSize="9">upheaval, not literal astronomy</text>
        <text x="15" y="190" fill="#1E40AF" fontSize="9" fontStyle="italic">Remnant: exiles return</text>

        {/* 2H */}
        <g transform="translate(240, 0)">
          <rect x="0" y="0" width="220" height="200" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />
          <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#8B5CF6" />
          <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">2H: Pentecost/70 AD</text>

          <text x="15" y="55" fill="#5B21B6" fontSize="10" fontWeight="bold">NT Application (Acts 2:16):</text>
          <text x="15" y="75" fill="#8B5CF6" fontSize="9">• Peter quotes Joel directly</text>
          <text x="15" y="92" fill="#8B5CF6" fontSize="9">• "This is that" = Pentecost</text>
          <text x="15" y="109" fill="#8B5CF6" fontSize="9">• Spirit poured on ALL flesh</text>
          <text x="15" y="126" fill="#8B5CF6" fontSize="9">• DoL = 70 AD destruction</text>
          <text x="15" y="150" fill="#5B21B6" fontSize="10" fontWeight="bold">Same language, 2nd fulfillment</text>
          <text x="15" y="167" fill="#8B5CF6" fontSize="9">Jerusalem destroyed again!</text>
          <text x="15" y="190" fill="#5B21B6" fontSize="9" fontStyle="italic">Remnant: Christians flee to Pella</text>
        </g>

        {/* 3H */}
        <g transform="translate(480, 0)">
          <rect x="0" y="0" width="220" height="200" rx="12" fill="white" stroke="#F59E0B" strokeWidth="2" />
          <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#F59E0B" />
          <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">3H: End Times</text>

          <text x="15" y="55" fill="#92400E" fontSize="10" fontWeight="bold">Ultimate Fulfillment:</text>
          <text x="15" y="75" fill="#D97706" fontSize="9">• Latter Rain outpouring</text>
          <text x="15" y="92" fill="#D97706" fontSize="9">• Final Day of the LORD</text>
          <text x="15" y="109" fill="#D97706" fontSize="9">• Sun/moon = literal signs</text>
          <text x="15" y="126" fill="#D97706" fontSize="9">• Second Coming of Christ</text>
          <text x="15" y="150" fill="#92400E" fontSize="10" fontWeight="bold">Complete fulfillment</text>
          <text x="15" y="167" fill="#D97706" fontSize="9">"Whoever calls on LORD saved"</text>
          <text x="15" y="190" fill="#92400E" fontSize="9" fontStyle="italic">Remnant: 144,000 + great multitude</text>
        </g>
      </g>

      {/* Key Insight */}
      <rect x="50" y="350" width="700" height="100" rx="12" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="380" textAnchor="middle" fill="#3730A3" fontSize="14" fontWeight="bold">
        Three Heavens Insight: One Prophecy, Three Fulfillments
      </text>
      <text x="400" y="405" textAnchor="middle" fill="#4F46E5" fontSize="11">
        Joel 2 is NOT just about Pentecost (Peter's "this is that" was a 2H application)
      </text>
      <text x="400" y="425" textAnchor="middle" fill="#4F46E5" fontSize="11">
        It had a 1H meaning for Joel's audience, AND an ultimate 3H meaning for us
      </text>
      <text x="400" y="445" textAnchor="middle" fill="#3730A3" fontSize="10" fontWeight="bold">
        All three are valid — each "heaven" adds depth to understanding
      </text>

      {/* Summary */}
      <rect x="50" y="465" width="700" height="120" rx="12" fill="#6366F1" />
      <text x="400" y="495" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        The Three Heavens Method
      </text>
      <text x="400" y="520" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        1. Read the passage in its original context (which heaven was primary?)
      </text>
      <text x="400" y="542" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        2. Check if NT authors apply it to 2H events (like Peter did)
      </text>
      <text x="400" y="564" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        3. Consider the ultimate 3H eschatological fulfillment
      </text>
    </svg>
  );
}

export default {
  ThreeHeavensFlowchart,
  ThreeHeavensConcept,
  ThreeHeavensExample
};
