import React from 'react';

// Three Angels Room Method Flowchart
export function ThreeAngelsFlowchart() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="3angel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="3angel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="3angel-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="3angel-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="3angel-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="3angel-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="3angel-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#3angel-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#92400E" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Three Angels' Messages: Heaven's Final Appeal
      </text>

      {/* Three Angels Visual */}
      <g transform="translate(50, 70)">
        {/* First Angel */}
        <g transform="translate(0, 0)" filter="url(#3angel-shadow)">
          <rect x="0" y="0" width="220" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#3B82F6" strokeWidth="3" />
          <circle cx="110" cy="40" r="25" fill="url(#3angel-blue)" filter="url(#3angel-glow)" />
          <text x="110" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">1</text>
          <text x="110" y="85" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">FIRST ANGEL</text>
          <text x="110" y="102" textAnchor="middle" fill="#1E40AF" fontSize="10">Rev 14:6-7</text>
          <text x="110" y="125" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="bold">"Fear God, give glory"</text>
          <text x="110" y="145" textAnchor="middle" fill="#3B82F6" fontSize="9">"Worship Him who made"</text>
          <text x="110" y="165" textAnchor="middle" fill="#1E40AF" fontSize="9" fontWeight="bold">EVERLASTING GOSPEL</text>
        </g>

        {/* Second Angel */}
        <g transform="translate(240, 0)" filter="url(#3angel-shadow)">
          <rect x="0" y="0" width="220" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="3" />
          <circle cx="110" cy="40" r="25" fill="url(#3angel-red)" filter="url(#3angel-glow)" />
          <text x="110" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">2</text>
          <text x="110" y="85" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">SECOND ANGEL</text>
          <text x="110" y="102" textAnchor="middle" fill="#991B1B" fontSize="10">Rev 14:8</text>
          <text x="110" y="125" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">"Babylon is fallen"</text>
          <text x="110" y="145" textAnchor="middle" fill="#DC2626" fontSize="9">"Made all nations drink"</text>
          <text x="110" y="165" textAnchor="middle" fill="#991B1B" fontSize="9" fontWeight="bold">JUDGMENT ANNOUNCED</text>
        </g>

        {/* Third Angel */}
        <g transform="translate(480, 0)" filter="url(#3angel-shadow)">
          <rect x="0" y="0" width="220" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#7C3AED" strokeWidth="3" />
          <circle cx="110" cy="40" r="25" fill="url(#3angel-purple)" filter="url(#3angel-glow)" />
          <text x="110" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">3</text>
          <text x="110" y="85" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">THIRD ANGEL</text>
          <text x="110" y="102" textAnchor="middle" fill="#5B21B6" fontSize="10">Rev 14:9-12</text>
          <text x="110" y="125" textAnchor="middle" fill="#7C3AED" fontSize="10" fontWeight="bold">"If any worship beast"</text>
          <text x="110" y="145" textAnchor="middle" fill="#7C3AED" fontSize="9">"Drink wrath of God"</text>
          <text x="110" y="165" textAnchor="middle" fill="#5B21B6" fontSize="9" fontWeight="bold">FINAL WARNING</text>
        </g>
      </g>

      {/* Key Elements */}
      <g filter="url(#3angel-shadow)">
        <rect x="50" y="270" width="700" height="100" rx="12" fill="#FEF3C7" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="295" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          Core Elements of the Three Angels
        </text>

        <g transform="translate(70, 310)">
          {[
            { element: 'Gospel', desc: 'Everlasting good news', icon: '📖' },
            { element: 'Creation', desc: 'Worship Creator', icon: '🌍' },
            { element: 'Judgment', desc: 'Hour has come', icon: '⚖️' },
            { element: 'Babylon', desc: 'False system falls', icon: '🏛️' },
            { element: 'Beast', desc: 'Don\'t worship', icon: '🚫' },
            { element: 'Saints', desc: 'Keep commandments', icon: '✝️' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 110}, 0)`}>
              <text x="50" y="15" textAnchor="middle" fontSize="18">{item.icon}</text>
              <text x="50" y="35" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="bold">{item.element}</text>
              <text x="50" y="50" textAnchor="middle" fill="#B45309" fontSize="7">{item.desc}</text>
            </g>
          ))}
        </g>
      </g>

      {/* The Result */}
      <g filter="url(#3angel-shadow)">
        <rect x="50" y="390" width="700" height="70" rx="12" fill="white" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="420" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          Rev 14:12 — The Result: "Here are they that keep the commandments of God,
        </text>
        <text x="400" y="445" textAnchor="middle" fill="#B45309" fontSize="13">
          and the faith of Jesus"
        </text>
      </g>

      {/* Key Principle */}
      <g filter="url(#3angel-shadow)">
        <rect x="50" y="480" width="700" height="55" rx="12" fill="url(#3angel-grad)" />
        <text x="400" y="505" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          The Three Angels = God's last message before Christ returns
        </text>
        <text x="400" y="525" textAnchor="middle" fill="#FEF3C7" fontSize="11">
          Every believer is called to understand, believe, and share these messages
        </text>
      </g>
    </svg>
  );
}

// Three Angels Room Concept Infographic
export function ThreeAngelsConcept() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="3angel2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="3angel2-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="3angel2-red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="3angel2-purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="3angel2-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="3angel2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#3angel2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#92400E" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Deep Dive: The Three Angels Unpacked
      </text>

      {/* First Angel Details */}
      <g transform="translate(50, 55)" filter="url(#3angel2-shadow)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12" fill="url(#3angel2-blue)" />
        <text x="350" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">
          FIRST ANGEL: The Everlasting Gospel (Rev 14:6-7)
        </text>

        <g transform="translate(20, 45)">
          <text x="0" y="0" fill="#1E40AF" fontSize="10" fontWeight="bold">Key Phrases:</text>
          <text x="0" y="18" fill="#3B82F6" fontSize="9">• "Fear God" = reverence, awe, obedience</text>
          <text x="0" y="34" fill="#3B82F6" fontSize="9">• "Give glory to Him" = reflect His character</text>
          <text x="0" y="50" fill="#3B82F6" fontSize="9">• "Hour of His judgment" = 1844 AD (Dan 8:14)</text>
          <text x="0" y="66" fill="#3B82F6" fontSize="9">• "Worship Him who made" = Sabbath (Creation memorial)</text>
        </g>

        <g transform="translate(350, 45)">
          <text x="0" y="0" fill="#1E40AF" fontSize="10" fontWeight="bold">Connections:</text>
          <text x="0" y="18" fill="#3B82F6" fontSize="9">• Echoes Exodus 20:11 (Sabbath command)</text>
          <text x="0" y="34" fill="#3B82F6" fontSize="9">• Points to Creator vs. evolution</text>
          <text x="0" y="50" fill="#3B82F6" fontSize="9">• Sanctuary cleansing begins</text>
          <text x="0" y="66" fill="#3B82F6" fontSize="9">• Judgment before Second Coming</text>
        </g>
      </g>

      {/* Second Angel Details */}
      <g transform="translate(50, 190)" filter="url(#3angel2-shadow)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12" fill="url(#3angel2-red)" />
        <text x="350" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">
          SECOND ANGEL: Babylon is Fallen (Rev 14:8)
        </text>

        <g transform="translate(20, 45)">
          <text x="0" y="0" fill="#991B1B" fontSize="10" fontWeight="bold">What is Babylon?</text>
          <text x="0" y="18" fill="#DC2626" fontSize="9">• Literal: Ancient enemy of God's people</text>
          <text x="0" y="34" fill="#DC2626" fontSize="9">• Spiritual: False religious system</text>
          <text x="0" y="50" fill="#DC2626" fontSize="9">• Characteristics: Confusion, mixture of truth/error</text>
          <text x="0" y="66" fill="#DC2626" fontSize="9">• "Wine of fornication" = false doctrines</text>
        </g>

        <g transform="translate(350, 45)">
          <text x="0" y="0" fill="#991B1B" fontSize="10" fontWeight="bold">The Fall:</text>
          <text x="0" y="18" fill="#DC2626" fontSize="9">• Moral fall (rejecting truth)</text>
          <text x="0" y="34" fill="#DC2626" fontSize="9">• Announcement of coming judgment</text>
          <text x="0" y="50" fill="#DC2626" fontSize="9">• Call to "come out" (Rev 18:4)</text>
          <text x="0" y="66" fill="#DC2626" fontSize="9">• Progressive apostasy exposed</text>
        </g>
      </g>

      {/* Third Angel Details */}
      <g transform="translate(50, 325)" filter="url(#3angel2-shadow)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12" fill="url(#3angel2-purple)" />
        <text x="350" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">
          THIRD ANGEL: The Beast and His Mark (Rev 14:9-12)
        </text>

        <g transform="translate(20, 45)">
          <text x="0" y="0" fill="#5B21B6" fontSize="10" fontWeight="bold">The Warning:</text>
          <text x="0" y="18" fill="#7C3AED" fontSize="9">• Most solemn warning in Scripture</text>
          <text x="0" y="34" fill="#7C3AED" fontSize="9">• "Beast" = political/religious power (Rev 13)</text>
          <text x="0" y="50" fill="#7C3AED" fontSize="9">• "Image" = likeness of beast's system</text>
          <text x="0" y="66" fill="#7C3AED" fontSize="9">• "Mark" = sign of allegiance</text>
        </g>

        <g transform="translate(350, 45)">
          <text x="0" y="0" fill="#5B21B6" fontSize="10" fontWeight="bold">The Saints:</text>
          <text x="0" y="18" fill="#7C3AED" fontSize="9">• "Patience of the saints" = endurance</text>
          <text x="0" y="34" fill="#7C3AED" fontSize="9">• "Keep commandments" = obedience</text>
          <text x="0" y="50" fill="#7C3AED" fontSize="9">• "Faith of Jesus" = His faith in us</text>
          <text x="0" y="66" fill="#7C3AED" fontSize="9">• Seal of God vs. mark of beast</text>
        </g>
      </g>

      {/* Timeline Context */}
      <g filter="url(#3angel2-shadow)">
        <rect x="50" y="460" width="700" height="60" rx="12" fill="#FEF3C7" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="485" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">
          Historical Context: These messages began going forth in 1844
        </text>
        <text x="400" y="505" textAnchor="middle" fill="#B45309" fontSize="10">
          We are now in the time when all three messages are being proclaimed globally
        </text>
      </g>

      {/* Deliverable */}
      <g filter="url(#3angel2-shadow)">
        <rect x="50" y="535" width="700" height="50" rx="12" fill="url(#3angel2-gold)" />
        <text x="400" y="565" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Deliverable: Personal response to each angel's message — what must I do?
        </text>
      </g>
    </svg>
  );
}

// Three Angels Room Example
export function ThreeAngelsExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="3angel3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="3angel3-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="3angel3-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="3angel3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#3angel3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#92400E" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Applying the First Angel's Message
      </text>

      {/* The Text */}
      <g filter="url(#3angel3-shadow)">
        <rect x="50" y="55" width="700" height="70" rx="12" fill="white" fillOpacity="0.95" stroke="#3B82F6" strokeWidth="2" />
        <text x="400" y="85" textAnchor="middle" fill="#1E40AF" fontSize="11" fontStyle="italic">
          "Fear God, and give glory to him; for the hour of his judgment is come:
        </text>
        <text x="400" y="105" textAnchor="middle" fill="#1E40AF" fontSize="11" fontStyle="italic">
          and worship him that made heaven, and earth, and the sea, and the fountains of waters."
        </text>
      </g>

      {/* Four Commands Analysis */}
      <g transform="translate(50, 140)">
        {[
          {
            command: 'Fear God',
            meaning: 'Holy reverence, not terror',
            application: 'Live with awareness that God sees all',
            verse: 'Prov 1:7 — Beginning of wisdom'
          },
          {
            command: 'Give Glory',
            meaning: 'Reflect His character',
            application: 'Health, speech, actions honor God',
            verse: '1 Cor 10:31 — Do all to His glory'
          },
          {
            command: 'Judgment Come',
            meaning: 'Investigative judgment began',
            application: 'Live in light of accountability',
            verse: 'Dan 7:9-10 — Books opened'
          },
          {
            command: 'Worship Creator',
            meaning: 'Recognize God as Maker',
            application: 'Keep Sabbath as creation memorial',
            verse: 'Ex 20:8-11 — Remember Sabbath'
          },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 360}, ${Math.floor(i / 2) * 100})`} filter="url(#3angel3-shadow)">
            <rect x="0" y="0" width="340" height="90" rx="10" fill={i % 2 === 0 ? '#EFF6FF' : '#DBEAFE'} fillOpacity="0.95" stroke="#3B82F6" strokeWidth="1" />
            <text x="170" y="20" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">{item.command}</text>
            <text x="170" y="38" textAnchor="middle" fill="#3B82F6" fontSize="10">{item.meaning}</text>
            <text x="170" y="55" textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="bold">Apply: {item.application}</text>
            <text x="170" y="75" textAnchor="middle" fill="#60A5FA" fontSize="8" fontStyle="italic">{item.verse}</text>
          </g>
        ))}
      </g>

      {/* Creation Connection */}
      <g filter="url(#3angel3-shadow)">
        <rect x="50" y="360" width="700" height="80" rx="12" fill="#FEF3C7" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="385" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          The Creation-Sabbath Connection
        </text>
        <text x="400" y="408" textAnchor="middle" fill="#B45309" fontSize="11">
          "Worship him that made heaven, earth, sea, fountains" = Exodus 20:11 language
        </text>
        <text x="400" y="428" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="bold">
          The first angel calls the world back to Sabbath worship of the Creator
        </text>
      </g>

      {/* Personal Response */}
      <g filter="url(#3angel3-shadow)">
        <rect x="50" y="455" width="700" height="80" rx="12" fill="url(#3angel3-blue)" />
        <text x="400" y="483" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          My Response to the First Angel
        </text>
        <text x="400" y="505" textAnchor="middle" fill="#BFDBFE" fontSize="11">
          1. Do I fear/reverence God daily? 2. Does my life glorify Him?
        </text>
        <text x="400" y="525" textAnchor="middle" fill="#BFDBFE" fontSize="11">
          3. Am I ready for judgment? 4. Do I worship Him on His day?
        </text>
      </g>
    </svg>
  );
}

export default {
  ThreeAngelsFlowchart,
  ThreeAngelsConcept,
  ThreeAngelsExample
};
