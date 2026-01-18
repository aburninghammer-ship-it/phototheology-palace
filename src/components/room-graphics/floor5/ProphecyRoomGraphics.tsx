import React from 'react';

// Prophecy Room Method Flowchart - Professional Styling
export function ProphecyRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 580" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="proph-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="proph-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="proph-accent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="proph-card" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FAFAFA" />
        </linearGradient>
        <filter id="proph-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="proph-shadow-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08"/>
        </filter>
        <filter id="proph-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="580" fill="url(#proph-bg)" rx="20" />

      <text x="400" y="45" textAnchor="middle" fill="#5B21B6" fontSize="26" fontWeight="700" letterSpacing="0.5">
        Prophecy Room
      </text>
      <text x="400" y="68" textAnchor="middle" fill="#7C3AED" fontSize="14" fontWeight="400" opacity="0.8">
        Understanding Biblical Predictions
      </text>

      <g transform="translate(40, 90)">
        <rect x="0" y="0" width="720" height="130" rx="16" fill="url(#proph-card)" filter="url(#proph-shadow)" />
        <rect x="0" y="0" width="720" height="40" rx="16" fill="url(#proph-header)" />
        <rect x="0" y="24" width="720" height="16" fill="url(#proph-header)" />
        <text x="360" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" letterSpacing="0.5">
          Types of Biblical Prophecy
        </text>

        {[
          { type: 'Messianic', desc: 'About Christ', example: 'Isaiah 53, Psalm 22', color: '#DC2626', bgColor: '#FEF2F2' },
          { type: 'National', desc: 'About Israel/Nations', example: 'Jeremiah 25, Daniel 2', color: '#2563EB', bgColor: '#EFF6FF' },
          { type: 'Apocalyptic', desc: 'End Times', example: 'Daniel 7-12, Revelation', color: '#7C3AED', bgColor: '#F5F3FF' },
          { type: 'Conditional', desc: 'If/Then Promises', example: 'Deuteronomy 28', color: '#059669', bgColor: '#ECFDF5' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 178 + 8}, 50)`}>
            <rect x="0" y="0" width="170" height="70" rx="12" fill={item.bgColor} filter="url(#proph-shadow-sm)" />
            <rect x="0" y="0" width="170" height="70" rx="12" fill="none" stroke={item.color} strokeWidth="2" strokeOpacity="0.3" />
            <text x="85" y="22" textAnchor="middle" fill={item.color} fontSize="13" fontWeight="700">{item.type}</text>
            <text x="85" y="40" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="500">{item.desc}</text>
            <text x="85" y="58" textAnchor="middle" fill={item.color} fontSize="9" fontStyle="italic" opacity="0.8">{item.example}</text>
          </g>
        ))}
      </g>

      <g transform="translate(40, 235)">
        <rect x="0" y="0" width="720" height="160" rx="16" fill="url(#proph-card)" filter="url(#proph-shadow)" />
        <rect x="0" y="0" width="720" height="40" rx="16" fill="url(#proph-header)" />
        <rect x="0" y="24" width="720" height="16" fill="url(#proph-header)" />
        <text x="360" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" letterSpacing="0.5">
          The Prophecy Interpretation Method
        </text>

        {[
          { step: '1', title: 'Context', desc: 'Who wrote? To whom?' },
          { step: '2', title: 'Language', desc: 'Literal or symbolic?' },
          { step: '3', title: 'Time Markers', desc: 'Near or far fulfillment?' },
          { step: '4', title: 'NT Interpretation', desc: 'How do apostles apply?' },
          { step: '5', title: 'Christ Center', desc: 'How points to Jesus?' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 142 + 15}, 55)`}>
            <circle cx="30" cy="30" r="26" fill="url(#proph-accent)" filter="url(#proph-glow)" />
            <text x="30" y="36" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">{item.step}</text>
            <text x="78" y="24" fill="#1E1B4B" fontSize="11" fontWeight="700">{item.title}</text>
            <text x="78" y="42" fill="#64748B" fontSize="9" fontWeight="400">{item.desc}</text>
            {i < 4 && <path d="M 125 30 L 135 30" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="4 2" />}
          </g>
        ))}

        <text x="360" y="140" textAnchor="middle" fill="#6D28D9" fontSize="12" fontStyle="italic" fontWeight="500">
          "No prophecy of Scripture is of private interpretation" — 2 Peter 1:20
        </text>
      </g>

      <g transform="translate(40, 410)">
        <rect x="0" y="0" width="350" height="100" rx="16" fill="url(#proph-card)" filter="url(#proph-shadow)" />
        <rect x="0" y="0" width="350" height="36" rx="16" fill="#EDE9FE" />
        <rect x="0" y="20" width="350" height="16" fill="#EDE9FE" />
        <text x="175" y="26" textAnchor="middle" fill="#6D28D9" fontSize="13" fontWeight="700">Day-Year Principle</text>
        <text x="175" y="55" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="500">Numbers 14:34, Ezekiel 4:6</text>
        <text x="175" y="75" textAnchor="middle" fill="#1E1B4B" fontSize="12" fontWeight="600">"A day for a year"</text>
        <text x="175" y="92" textAnchor="middle" fill="#64748B" fontSize="10">2300 days = 2300 years</text>

        <rect x="370" y="0" width="350" height="100" rx="16" fill="url(#proph-card)" filter="url(#proph-shadow)" />
        <rect x="370" y="0" width="350" height="36" rx="16" fill="#EDE9FE" />
        <rect x="370" y="20" width="350" height="16" fill="#EDE9FE" />
        <text x="545" y="26" textAnchor="middle" fill="#6D28D9" fontSize="13" fontWeight="700">Repeat & Enlarge Principle</text>
        <text x="545" y="55" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="500">Daniel 2 → 7 → 8 → 11</text>
        <text x="545" y="75" textAnchor="middle" fill="#1E1B4B" fontSize="12" fontWeight="600">Same prophecy, more detail</text>
        <text x="545" y="92" textAnchor="middle" fill="#64748B" fontSize="10">Each vision adds new elements</text>
      </g>

      <rect x="40" y="520" width="720" height="50" rx="12" fill="url(#proph-header)" filter="url(#proph-shadow)" />
      <text x="400" y="545" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        "Prophecy is history written in advance — study both together"
      </text>
      <text x="400" y="562" textAnchor="middle" fill="#DDD6FE" fontSize="10">
        Fulfilled prophecy proves divine authorship; unfulfilled awaits its time
      </text>
    </svg>
  );
}

export function ProphecyRoomConcept() {
  return (
    <svg viewBox="0 0 800 620" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="proph2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="proph2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="proph2-card" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FAFAFA" />
        </linearGradient>
        <filter id="proph2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="proph2-shadow-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08"/>
        </filter>
      </defs>

      <rect width="800" height="620" fill="url(#proph2-bg)" rx="20" />
      <text x="400" y="40" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="700" letterSpacing="0.5">
        Major Prophetic Frameworks
      </text>

      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="230" height="270" rx="16" fill="url(#proph2-card)" filter="url(#proph2-shadow)" />
        <rect x="0" y="0" width="230" height="42" rx="16" fill="url(#proph2-header)" />
        <rect x="0" y="26" width="230" height="16" fill="url(#proph2-header)" />
        <text x="115" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Daniel 2: The Image</text>

        {[
          { part: 'Gold Head', kingdom: 'Babylon', period: '605-539 BC', color: '#F59E0B', bgColor: '#FFFBEB' },
          { part: 'Silver Chest', kingdom: 'Medo-Persia', period: '539-331 BC', color: '#6B7280', bgColor: '#F3F4F6' },
          { part: 'Bronze Waist', kingdom: 'Greece', period: '331-168 BC', color: '#B45309', bgColor: '#FEF3C7' },
          { part: 'Iron Legs', kingdom: 'Rome', period: '168 BC-476 AD', color: '#374151', bgColor: '#E5E7EB' },
          { part: 'Iron/Clay', kingdom: 'Divided Europe', period: '476 AD-Now', color: '#78716C', bgColor: '#F5F5F4' },
          { part: 'Stone', kingdom: "God's Kingdom", period: 'Future', color: '#3B82F6', bgColor: '#EFF6FF' },
        ].map((item, i) => (
          <g key={i} transform={`translate(12, ${52 + i * 35})`}>
            <rect x="0" y="0" width="206" height="30" rx="8" fill={item.bgColor} />
            <circle cx="14" cy="15" r="10" fill={item.color} />
            <text x="32" y="12" fill="#1E1B4B" fontSize="10" fontWeight="600">{item.part}</text>
            <text x="32" y="24" fill="#64748B" fontSize="8">{item.kingdom} • {item.period}</text>
          </g>
        ))}
      </g>

      <g transform="translate(285, 60)">
        <rect x="0" y="0" width="230" height="270" rx="16" fill="url(#proph2-card)" filter="url(#proph2-shadow)" />
        <rect x="0" y="0" width="230" height="42" rx="16" fill="url(#proph2-header)" />
        <rect x="0" y="26" width="230" height="16" fill="url(#proph2-header)" />
        <text x="115" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Daniel 9: 70 Weeks</text>
        <text x="115" y="65" textAnchor="middle" fill="#1E1B4B" fontSize="12" fontWeight="700">70 weeks = 490 years</text>
        <text x="115" y="82" textAnchor="middle" fill="#7C3AED" fontSize="10">Start: 457 BC (Ezra 7)</text>

        {[
          { weeks: '7 weeks', years: '49 yrs', event: 'Jerusalem rebuilt' },
          { weeks: '62 weeks', years: '434 yrs', event: 'To Messiah' },
          { weeks: '1 week', years: '7 yrs', event: "Christ's ministry" },
        ].map((item, i) => (
          <g key={i} transform={`translate(12, ${98 + i * 48})`}>
            <rect x="0" y="0" width="206" height="42" rx="10" fill="#F5F3FF" filter="url(#proph2-shadow-sm)" />
            <text x="103" y="18" textAnchor="middle" fill="#6D28D9" fontSize="11" fontWeight="700">{item.weeks} = {item.years}</text>
            <text x="103" y="34" textAnchor="middle" fill="#64748B" fontSize="10">{item.event}</text>
          </g>
        ))}
        <text x="115" y="258" textAnchor="middle" fill="#1E1B4B" fontSize="10" fontWeight="600">End: 34 AD (Stephen martyred)</text>
      </g>

      <g transform="translate(530, 60)">
        <rect x="0" y="0" width="230" height="270" rx="16" fill="url(#proph2-card)" filter="url(#proph2-shadow)" />
        <rect x="0" y="0" width="230" height="42" rx="16" fill="url(#proph2-header)" />
        <rect x="0" y="26" width="230" height="16" fill="url(#proph2-header)" />
        <text x="115" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Daniel 8: 2300 Days</text>
        <text x="115" y="68" textAnchor="middle" fill="#1E1B4B" fontSize="11" fontWeight="600">"2300 days, then sanctuary cleansed"</text>
        <rect x="12" y="82" width="206" height="75" rx="10" fill="#F5F3FF" filter="url(#proph2-shadow-sm)" />
        <text x="115" y="105" textAnchor="middle" fill="#1E1B4B" fontSize="11" fontWeight="600">2300 days = 2300 years</text>
        <text x="115" y="124" textAnchor="middle" fill="#7C3AED" fontSize="10">Start: 457 BC</text>
        <text x="115" y="143" textAnchor="middle" fill="#7C3AED" fontSize="10">End: 1844 AD</text>
        <rect x="12" y="168" width="206" height="75" rx="10" fill="#EDE9FE" />
        <text x="115" y="190" textAnchor="middle" fill="#6D28D9" fontSize="11" fontWeight="700">Significance:</text>
        <text x="115" y="210" textAnchor="middle" fill="#64748B" fontSize="10">Heavenly sanctuary cleansing</text>
        <text x="115" y="228" textAnchor="middle" fill="#64748B" fontSize="10">Pre-advent judgment begins</text>
      </g>

      <g transform="translate(40, 345)">
        <rect x="0" y="0" width="720" height="130" rx="16" fill="url(#proph2-card)" filter="url(#proph2-shadow)" />
        <rect x="0" y="0" width="720" height="40" rx="16" fill="url(#proph2-header)" />
        <rect x="0" y="24" width="720" height="16" fill="url(#proph2-header)" />
        <text x="360" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" letterSpacing="0.5">
          Common Prophetic Symbols
        </text>

        {[
          { symbol: 'Beast', meaning: 'Kingdom/Power', ref: 'Dan 7:17' },
          { symbol: 'Horn', meaning: 'King/Power', ref: 'Dan 8:21' },
          { symbol: 'Water', meaning: 'Peoples/Nations', ref: 'Rev 17:15' },
          { symbol: 'Woman', meaning: 'Church', ref: 'Jer 6:2' },
          { symbol: 'Day', meaning: 'Year', ref: 'Num 14:34' },
          { symbol: 'Wind', meaning: 'War/Strife', ref: 'Jer 49:36' },
          { symbol: 'Mountain', meaning: 'Kingdom', ref: 'Dan 2:35' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 4) * 178 + 10}, ${Math.floor(i / 4) * 42 + 50})`}>
            <rect x="0" y="0" width="168" height="36" rx="8" fill="#F5F3FF" filter="url(#proph2-shadow-sm)" />
            <text x="84" y="16" textAnchor="middle" fill="#1E1B4B" fontSize="10" fontWeight="600">{item.symbol} = {item.meaning}</text>
            <text x="84" y="30" textAnchor="middle" fill="#7C3AED" fontSize="9">{item.ref}</text>
          </g>
        ))}
      </g>

      <g transform="translate(40, 490)">
        <rect x="0" y="0" width="720" height="115" rx="16" fill="#EDE9FE" filter="url(#proph2-shadow)" />
        <text x="360" y="30" textAnchor="middle" fill="#5B21B6" fontSize="15" fontWeight="700">
          Prophecy Room Deliverable: Prophetic Timeline
        </text>
        <text x="360" y="55" textAnchor="middle" fill="#6D28D9" fontSize="12">
          Daniel 2, 7, 8, 9, 11 harmonized with Revelation
        </text>
        <text x="360" y="78" textAnchor="middle" fill="#6D28D9" fontSize="12">
          Track: Empire → Date → Prophecy → Fulfillment
        </text>
        <text x="360" y="102" textAnchor="middle" fill="#7C3AED" fontSize="11" fontStyle="italic">
          "We have a more sure word of prophecy" — 2 Peter 1:19
        </text>
      </g>
    </svg>
  );
}

export function ProphecyRoomExample() {
  return (
    <svg viewBox="0 0 800 570" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="proph3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="proph3-purple-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="proph3-red-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="proph3-card" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FAFAFA" />
        </linearGradient>
        <filter id="proph3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="570" fill="url(#proph3-bg)" rx="20" />
      <text x="400" y="40" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="700" letterSpacing="0.5">
        Example: Isaiah 53 — Messianic Prophecy
      </text>

      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="350" height="260" rx="16" fill="url(#proph3-card)" filter="url(#proph3-shadow)" />
        <rect x="0" y="0" width="350" height="42" rx="16" fill="url(#proph3-purple-header)" />
        <rect x="0" y="26" width="350" height="16" fill="url(#proph3-purple-header)" />
        <text x="175" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Isaiah 53 (Written ~700 BC)</text>

        {[
          { verse: 'v.3', text: '"Despised and rejected"' },
          { verse: 'v.4', text: '"Bore our griefs, carried sorrows"' },
          { verse: 'v.5', text: '"Wounded for our transgressions"' },
          { verse: 'v.6', text: '"LORD laid on him our iniquity"' },
          { verse: 'v.7', text: '"As a lamb to the slaughter"' },
          { verse: 'v.9', text: '"With the rich in his death"' },
          { verse: 'v.10', text: '"He shall see his seed, prolong days"' },
          { verse: 'v.12', text: '"Numbered with transgressors"' },
        ].map((item, i) => (
          <g key={i} transform={`translate(15, ${55 + i * 25})`}>
            <rect x="0" y="-10" width="320" height="22" rx="4" fill={i % 2 === 0 ? '#F5F3FF' : 'transparent'} />
            <text fill="#5B21B6" fontSize="11">
              <tspan fontWeight="700" fill="#7C3AED">{item.verse}:</tspan>
              <tspan x="35" fill="#1E1B4B">{item.text}</tspan>
            </text>
          </g>
        ))}
      </g>

      <g transform="translate(410, 60)">
        <rect x="0" y="0" width="350" height="260" rx="16" fill="url(#proph3-card)" filter="url(#proph3-shadow)" />
        <rect x="0" y="0" width="350" height="42" rx="16" fill="url(#proph3-red-header)" />
        <rect x="0" y="26" width="350" height="16" fill="url(#proph3-red-header)" />
        <text x="175" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Fulfilled in Christ (31 AD)</text>

        {[
          { ref: 'John 1:11', text: 'His own received him not' },
          { ref: 'Matt 8:17', text: 'Himself took our infirmities' },
          { ref: '1 Pet 2:24', text: 'By whose stripes healed' },
          { ref: '2 Cor 5:21', text: 'Made him sin for us' },
          { ref: 'John 1:29', text: 'Lamb of God' },
          { ref: 'Matt 27:57', text: "Joseph's tomb" },
          { ref: 'Acts 2:24', text: 'God raised him up' },
          { ref: 'Luke 22:37', text: 'Reckoned with transgressors' },
        ].map((item, i) => (
          <g key={i} transform={`translate(15, ${55 + i * 25})`}>
            <rect x="0" y="-10" width="320" height="22" rx="4" fill={i % 2 === 0 ? '#FEF2F2' : 'transparent'} />
            <text fill="#B91C1C" fontSize="11">
              <tspan fontWeight="700" fill="#DC2626">{item.ref}:</tspan>
              <tspan x="80" fill="#1E1B4B">{item.text}</tspan>
            </text>
          </g>
        ))}
      </g>

      <g transform="translate(380, 180)">
        <circle cx="15" cy="0" r="15" fill="#7C3AED" />
        <path d="M 8 0 L 22 0 M 16 -6 L 22 0 L 16 6" stroke="white" strokeWidth="2" fill="none" />
      </g>

      <g transform="translate(40, 335)">
        <rect x="0" y="0" width="720" height="105" rx="16" fill="url(#proph3-card)" filter="url(#proph3-shadow)" />
        <rect x="0" y="0" width="720" height="36" rx="16" fill="#EDE9FE" />
        <rect x="0" y="20" width="720" height="16" fill="#EDE9FE" />
        <text x="360" y="26" textAnchor="middle" fill="#6D28D9" fontSize="14" fontWeight="700">Probability Analysis</text>
        <text x="360" y="55" textAnchor="middle" fill="#64748B" fontSize="12">Isaiah 53 contains 12+ specific predictions about the Messiah</text>
        <text x="360" y="75" textAnchor="middle" fill="#64748B" fontSize="12">Probability of one person fulfilling all by chance: 1 in 10¹⁷ (100 quadrillion)</text>
        <text x="360" y="95" textAnchor="middle" fill="#1E1B4B" fontSize="12" fontWeight="600">Mathematical proof of divine authorship and Jesus as Messiah</text>
      </g>

      <rect x="40" y="455" width="720" height="105" rx="16" fill="url(#proph3-purple-header)" filter="url(#proph3-shadow)" />
      <text x="400" y="485" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Prophecy Room Insight</text>
      <text x="400" y="510" textAnchor="middle" fill="#DDD6FE" fontSize="12">Isaiah 53 was written 700 years before Christ — no human could guess these details</text>
      <text x="400" y="532" textAnchor="middle" fill="#DDD6FE" fontSize="12">Fulfilled prophecy = God's signature, proving Jesus is the promised Messiah</text>
      <text x="400" y="554" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontStyle="italic">"Search the scriptures... they testify of me" — John 5:39</text>
    </svg>
  );
}

export default {
  ProphecyRoomFlowchart,
  ProphecyRoomConcept,
  ProphecyRoomExample
};
