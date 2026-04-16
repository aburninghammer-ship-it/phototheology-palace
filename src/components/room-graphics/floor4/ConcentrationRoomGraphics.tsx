import React from 'react';

// Concentration Room Method Flowchart
export function ConcentrationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="cr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="cr-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="cr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="cr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#cr-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Concentration Room: The Law of Saturation
      </text>

      {/* Target Concept */}
      <g transform="translate(300, 80)" filter="url(#cr-glow)">
        <circle cx="100" cy="100" r="90" fill="url(#cr-grad)" />
        <text x="100" y="90" textAnchor="middle" fill="white" fontSize="48">🎯</text>
        <text x="100" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">ONE TOPIC</text>
        <text x="100" y="145" textAnchor="middle" fill="#DDD6FE" fontSize="11">Deep Not Wide</text>
      </g>

      {/* Surrounding verses */}
      {[
        { angle: 0, label: 'Verse 1' },
        { angle: 45, label: 'Cross Ref' },
        { angle: 90, label: 'Word Study' },
        { angle: 135, label: 'Context' },
        { angle: 180, label: 'Verse 2' },
        { angle: 225, label: 'History' },
        { angle: 270, label: 'Application' },
        { angle: 315, label: 'Summary' },
      ].map((item, i) => {
        const x = 400 + Math.cos((item.angle * Math.PI) / 180) * 160;
        const y = 180 + Math.sin((item.angle * Math.PI) / 180) * 130;
        return (
          <g key={i}>
            <line x1="400" y1="180" x2={x} y2={y} stroke="#A78BFA" strokeWidth="2" strokeDasharray="4,4" />
            <circle cx={x} cy={y} r="25" fill="#A78BFA" />
            <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="8">{item.label}</text>
          </g>
        );
      })}

      {/* Method Description */}
      <g filter="url(#cr-shadow)">
        <rect x="50" y="330" width="700" height="70" rx="12" fill="white" fillOpacity="0.95" stroke="#7C3AED" strokeWidth="2" />
        <text x="400" y="360" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          The Method: Study ONE topic exhaustively before moving on
        </text>
        <text x="400" y="385" textAnchor="middle" fill="#6D28D9" fontSize="12">
          Gather every verse, every angle, every cross-reference until the topic is "saturated"
        </text>
      </g>

      {/* Key Principle */}
      <g filter="url(#cr-shadow)">
        <rect x="50" y="420" width="700" height="60" rx="12" fill="#EDE9FE" fillOpacity="0.9" stroke="#7C3AED" strokeWidth="2" />
        <text x="400" y="450" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          "An inch wide and a mile deep" — Master one truth before chasing another
        </text>
        <text x="400" y="470" textAnchor="middle" fill="#6D28D9" fontSize="11">
          Better to know one doctrine thoroughly than ten superficially
        </text>
      </g>
    </svg>
  );
}

// Concentration Room Concept Infographic
export function ConcentrationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cr2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="cr2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="cr2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#cr2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Saturation Study Components
      </text>

      {/* Components Grid */}
      <g transform="translate(50, 55)">
        {[
          { comp: 'All Verses', icon: '📚', desc: 'Gather EVERY verse on the topic using concordance', output: 'Verse list' },
          { comp: 'Word Study', icon: '📝', desc: 'Study key Hebrew/Greek words in depth', output: 'Definition sheet' },
          { comp: 'Context', icon: '🔎', desc: 'Understand each passage in its setting', output: 'Context notes' },
          { comp: 'Cross-Refs', icon: '🔗', desc: 'Map how verses connect and explain each other', output: 'Chain diagram' },
          { comp: 'History', icon: '📜', desc: 'Research historical background and fulfillment', output: 'Timeline' },
          { comp: 'Synthesis', icon: '💡', desc: 'Combine all findings into unified understanding', output: 'Summary doc' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 115})`} filter="url(#cr2-shadow)">
            <rect x="0" y="0" width="220" height="105" rx="12" fill="white" fillOpacity="0.95" stroke="#7C3AED" strokeWidth="2" />
            <text x="110" y="30" textAnchor="middle" fontSize="24">{item.icon}</text>
            <text x="110" y="50" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">{item.comp}</text>
            <text x="110" y="70" textAnchor="middle" fill="#6D28D9" fontSize="9">{item.desc}</text>
            <text x="110" y="92" textAnchor="middle" fill="#7C3AED" fontSize="9" fontStyle="italic">→ {item.output}</text>
          </g>
        ))}
      </g>

      {/* Concentration vs Scattered */}
      <g filter="url(#cr2-shadow)">
        <rect x="50" y="300" width="700" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#7C3AED" strokeWidth="2" />
        <g transform="translate(75, 320)">
          <rect x="0" y="0" width="300" height="70" rx="8" fill="#FEE2E2" />
          <text x="150" y="20" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">Scattered Approach</text>
          <text x="150" y="40" textAnchor="middle" fill="#B91C1C" fontSize="10">Read a verse here, a verse there</text>
          <text x="150" y="55" textAnchor="middle" fill="#991B1B" fontSize="9">Result: Surface knowledge, confusion</text>
        </g>
        <g transform="translate(425, 320)">
          <rect x="0" y="0" width="300" height="70" rx="8" fill="#D1FAE5" />
          <text x="150" y="20" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">Concentration Approach</text>
          <text x="150" y="40" textAnchor="middle" fill="#047857" fontSize="10">Exhaust EVERY verse on ONE topic</text>
          <text x="150" y="55" textAnchor="middle" fill="#065F46" fontSize="9">Result: Deep mastery, clarity</text>
        </g>
      </g>

      {/* Deliverable */}
      <g filter="url(#cr2-shadow)">
        <rect x="50" y="420" width="700" height="60" rx="12" fill="url(#cr2-header)" />
        <text x="400" y="450" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          Deliverable: Topic Saturation File
        </text>
        <text x="400" y="470" textAnchor="middle" fill="#DDD6FE" fontSize="12">
          All verses + Word studies + Cross-references + Synthesis = Comprehensive topic mastery
        </text>
      </g>
    </svg>
  );
}

// Concentration Room Example
export function ConcentrationRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cr3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="cr3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="cr3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#cr3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Saturation Study on "Faith"
      </text>

      {/* Verse Gathering */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12 12 0 0" fill="#7C3AED" />
        <text x="350" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Step 1: Gather ALL Faith Verses (300+ verses)
        </text>

        <text x="20" y="55" fill="#5B21B6" fontSize="10">Hebrews 11:1 | Romans 1:17 | Galatians 3:11 | Habakkuk 2:4 | James 2:17 | Romans 10:17</text>
        <text x="20" y="72" fill="#5B21B6" fontSize="10">Mark 11:22-24 | Matthew 17:20 | Luke 17:5-6 | 1 John 5:4 | Ephesians 2:8-9 | Romans 4:3</text>
        <text x="20" y="89" fill="#6D28D9" fontSize="9" fontStyle="italic">...and 290+ more verses using concordance search</text>
      </g>

      {/* Word Study */}
      <g transform="translate(50, 165)">
        <rect x="0" y="0" width="340" height="90" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="12 12 0 0" fill="#A78BFA" />
        <text x="170" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Step 2: Word Study
        </text>
        <text x="15" y="50" fill="#5B21B6" fontSize="10" fontWeight="bold">Hebrew: 'emunah' — firmness, faithfulness</text>
        <text x="15" y="67" fill="#5B21B6" fontSize="10" fontWeight="bold">Greek: 'pistis' — trust, conviction, reliance</text>
        <text x="15" y="84" fill="#6D28D9" fontSize="9">Root meaning: confident trust that produces action</text>
      </g>

      {/* Categories */}
      <g transform="translate(410, 165)">
        <rect x="0" y="0" width="340" height="90" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="12 12 0 0" fill="#A78BFA" />
        <text x="170" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Step 3: Categorize Findings
        </text>
        <text x="15" y="48" fill="#5B21B6" fontSize="9">• Faith defined (Heb 11:1)</text>
        <text x="15" y="62" fill="#5B21B6" fontSize="9">• Faith's source (Rom 10:17)</text>
        <text x="175" y="48" fill="#5B21B6" fontSize="9">• Faith and works (James 2)</text>
        <text x="175" y="62" fill="#5B21B6" fontSize="9">• Faith examples (Heb 11)</text>
        <text x="15" y="82" fill="#6D28D9" fontSize="9">• Faith's object • Faith's fruit • Faith's trial</text>
      </g>

      {/* Cross-Reference Chain */}
      <g transform="translate(50, 265)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12 12 0 0" fill="#8B5CF6" />
        <text x="350" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Step 4: Cross-Reference Chain
        </text>
        <text x="350" y="50" textAnchor="middle" fill="#5B21B6" fontSize="11">
          Habakkuk 2:4 → Romans 1:17 → Galatians 3:11 → Hebrews 10:38
        </text>
        <text x="350" y="68" textAnchor="middle" fill="#6D28D9" fontSize="10" fontStyle="italic">
          "The just shall live by faith" — traced from OT through Paul to Hebrews
        </text>
      </g>

      {/* Synthesis */}
      <g transform="translate(50, 355)">
        <rect x="0" y="0" width="700" height="110" rx="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12 12 0 0" fill="#6D28D9" />
        <text x="350" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Step 5: Synthesis — What Faith IS
        </text>
        <text x="20" y="50" fill="#5B21B6" fontSize="10">
          <tspan fontWeight="bold">Definition:</tspan> Confident trust in God based on His Word, producing action and righteousness.
        </text>
        <text x="20" y="68" fill="#5B21B6" fontSize="10">
          <tspan fontWeight="bold">Source:</tspan> Faith comes by hearing the Word of God (Romans 10:17).
        </text>
        <text x="20" y="86" fill="#5B21B6" fontSize="10">
          <tspan fontWeight="bold">Evidence:</tspan> True faith always produces works — "faith without works is dead" (James 2:26).
        </text>
        <text x="20" y="104" fill="#6D28D9" fontSize="10">
          <tspan fontWeight="bold">Goal:</tspan> "This is the victory that overcometh the world, even our faith" (1 John 5:4).
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="475" width="700" height="60" rx="12" fill="#7C3AED" />
      <text x="400" y="502" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Result: One topic (Faith) = 300+ verses = Complete doctrinal understanding
      </text>
      <text x="400" y="522" textAnchor="middle" fill="#DDD6FE" fontSize="11">
        This is saturation study — you now KNOW this topic deeply, not just surface-level
      </text>
    </svg>
  );
}

export default {
  ConcentrationRoomFlowchart,
  ConcentrationRoomConcept,
  ConcentrationRoomExample
};
