import React from 'react';

// Time Zone Room Method Flowchart
export function TimeZoneFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tz-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="tz-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="tz-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="tz-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="tz-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#tz-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Time Zone Room: Biblical Timeline Mastery
      </text>

      {/* Timeline */}
      <g transform="translate(50, 80)">
        <line x1="50" y1="50" x2="650" y2="50" stroke="#8B5CF6" strokeWidth="4" />

        {/* Time Periods */}
        {[
          { x: 50, label: 'Creation', date: '~4000 BC' },
          { x: 150, label: 'Flood', date: '~2348 BC' },
          { x: 250, label: 'Abraham', date: '~2000 BC' },
          { x: 350, label: 'Exodus', date: '~1446 BC' },
          { x: 450, label: 'Temple', date: '~960 BC' },
          { x: 550, label: 'Christ', date: '~4 BC-31 AD' },
          { x: 650, label: 'Return', date: 'Future' },
        ].map((item, i) => (
          <g key={i}>
            <circle cx={item.x} cy="50" r="8" fill={i === 6 ? '#F59E0B' : '#8B5CF6'} />
            <text x={item.x} y="80" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">{item.label}</text>
            <text x={item.x} y="95" textAnchor="middle" fill="#7C3AED" fontSize="8">{item.date}</text>
          </g>
        ))}
      </g>

      {/* Time Periods Box */}
      <rect x="50" y="150" width="700" height="120" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />
      <text x="400" y="175" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
        The 7 Major Time Periods
      </text>

      <g transform="translate(60, 190)">
        {[
          { period: 'Antediluvian', span: 'Creation → Flood' },
          { period: 'Patriarchal', span: 'Abraham → Egypt' },
          { period: 'Mosaic', span: 'Exodus → Judges' },
          { period: 'Monarchical', span: 'Saul → Exile' },
          { period: 'Exilic/Post', span: 'Babylon → Christ' },
          { period: 'Church Age', span: 'Pentecost → Now' },
          { period: 'Eschaton', span: 'Return → Eternity' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 97}, 0)`}>
            <rect x="0" y="0" width="90" height="55" rx="6" fill="#EDE9FE" />
            <text x="45" y="20" textAnchor="middle" fill="#5B21B6" fontSize="9" fontWeight="bold">{item.period}</text>
            <text x="45" y="38" textAnchor="middle" fill="#7C3AED" fontSize="7">{item.span}</text>
          </g>
        ))}
      </g>

      {/* Method */}
      <rect x="50" y="290" width="700" height="90" rx="12" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2" />
      <text x="400" y="320" textAnchor="middle" fill="#5B21B6" fontSize="16" fontWeight="bold">
        The Time Zone Method
      </text>
      <text x="400" y="345" textAnchor="middle" fill="#6D28D9" fontSize="12">
        For every passage: When did this happen? What era? What was happening globally?
      </text>
      <text x="400" y="368" textAnchor="middle" fill="#6D28D9" fontSize="11">
        Place every text on the timeline — context determines meaning
      </text>

      {/* Key Principle */}
      <rect x="50" y="400" width="700" height="80" rx="12" fill="#8B5CF6" />
      <text x="400" y="430" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        "When is as important as What"
      </text>
      <text x="400" y="455" textAnchor="middle" fill="#DDD6FE" fontSize="12">
        A prophecy before Babylon means something different than one after
      </text>
      <text x="400" y="475" textAnchor="middle" fill="#DDD6FE" fontSize="11">
        Timeline placement unlocks interpretation
      </text>
    </svg>
  );
}

// Time Zone Room Concept Infographic
export function TimeZoneConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="500" fill="#F5F3FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold">
        Key Dates Every Bible Student Should Know
      </text>

      {/* Essential Dates Grid */}
      <g transform="translate(50, 55)">
        {[
          { date: '~4000 BC', event: 'Creation', sig: 'Beginning of time' },
          { date: '~2348 BC', event: 'Flood', sig: 'World reset' },
          { date: '~2000 BC', event: 'Abraham called', sig: 'Covenant begins' },
          { date: '~1446 BC', event: 'Exodus', sig: 'Nation of Israel born' },
          { date: '~1406 BC', event: 'Canaan entered', sig: 'Promised Land' },
          { date: '~1010 BC', event: 'David king', sig: 'Messianic line established' },
          { date: '~960 BC', event: 'Temple built', sig: 'God\'s dwelling' },
          { date: '722 BC', event: 'Israel falls', sig: 'Northern kingdom ends' },
          { date: '607/586 BC', event: 'Judah falls', sig: '70-year exile begins' },
          { date: '457 BC', event: 'Ezra\'s decree', sig: '70 weeks prophecy starts' },
          { date: '~4 BC', event: 'Christ born', sig: 'Incarnation' },
          { date: '31 AD', event: 'Crucifixion', sig: 'Atonement complete' },
          { date: '34 AD', event: 'Stephen martyred', sig: '70 weeks end' },
          { date: '70 AD', event: 'Temple destroyed', sig: 'Day of the Lord 2' },
          { date: '95 AD', event: 'Revelation written', sig: 'Canon closes' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 5) * 140}, ${Math.floor(i / 5) * 80})`}>
            <rect x="0" y="0" width="130" height="70" rx="8" fill="white" stroke="#8B5CF6" strokeWidth="1" />
            <text x="65" y="18" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">{item.date}</text>
            <text x="65" y="35" textAnchor="middle" fill="#6D28D9" fontSize="9">{item.event}</text>
            <text x="65" y="55" textAnchor="middle" fill="#8B5CF6" fontSize="7" fontStyle="italic">{item.sig}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="320" width="700" height="160" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />
      <text x="400" y="345" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
        Why Dates Matter
      </text>
      <text x="70" y="375" fill="#6D28D9" fontSize="11">• Pre-exilic prophet? → Speaks to Babylonian judgment primarily</text>
      <text x="70" y="395" fill="#6D28D9" fontSize="11">• Post-exilic prophet? → Speaks to Messiah and 70 AD primarily</text>
      <text x="70" y="415" fill="#6D28D9" fontSize="11">• Post-70 AD? → Speaks to end-time events primarily (Daniel, Revelation)</text>
      <text x="70" y="445" fill="#8B5CF6" fontSize="10" fontStyle="italic">
        The Three Heavens framework depends on knowing WHEN a prophecy was written
      </text>
      <text x="70" y="465" fill="#5B21B6" fontSize="10" fontWeight="bold">
        Deliverable: Master timeline with all key dates memorized
      </text>
    </svg>
  );
}

// Time Zone Room Example
export function TimeZoneExample() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="500" fill="#F5F3FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold">
        Example: Dating Isaiah 24
      </text>

      {/* Timeline Position */}
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          Step 1: Place on Timeline
        </text>

        <line x1="50" y1="60" x2="650" y2="60" stroke="#8B5CF6" strokeWidth="3" />
        <circle cx="200" cy="60" r="10" fill="#8B5CF6" />
        <text x="200" y="85" textAnchor="middle" fill="#5B21B6" fontSize="9">Isaiah writes</text>
        <text x="200" y="95" textAnchor="middle" fill="#7C3AED" fontSize="8">~740-680 BC</text>

        <circle cx="400" cy="60" r="8" fill="#EF4444" />
        <text x="400" y="85" textAnchor="middle" fill="#EF4444" fontSize="9">Babylon falls</text>
        <text x="400" y="95" textAnchor="middle" fill="#EF4444" fontSize="8">607/586 BC</text>
      </g>

      {/* Interpretation Impact */}
      <g transform="translate(50, 170)">
        <rect x="0" y="0" width="700" height="150" rx="12" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          Step 2: Interpretation Impact
        </text>

        <text x="20" y="55" fill="#6D28D9" fontSize="11" fontWeight="bold">Because Isaiah wrote BEFORE Babylon:</text>
        <text x="40" y="75" fill="#6D28D9" fontSize="10">• "The earth is utterly broken" = 1H Babylonian destruction (primary)</text>
        <text x="40" y="93" fill="#6D28D9" fontSize="10">• "The city of confusion is broken" = Jerusalem falling (primary)</text>
        <text x="40" y="111" fill="#6D28D9" fontSize="10">• "Prisoners gathered in the pit" = Babylonian captivity</text>
        <text x="40" y="129" fill="#6D28D9" fontSize="10">• "After many days visited" = 70 years later, restoration</text>
      </g>

      {/* Three Heavens Application */}
      <g transform="translate(50, 330)">
        <rect x="0" y="0" width="700" height="90" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          Step 3: Three Heavens Application
        </text>

        <text x="20" y="50" fill="#3B82F6" fontSize="10"><tspan fontWeight="bold">1H (Primary):</tspan> Babylonian destruction of Judah — Isaiah's immediate audience</text>
        <text x="20" y="68" fill="#8B5CF6" fontSize="10"><tspan fontWeight="bold">2H (Secondary):</tspan> 70 AD destruction — same cosmic language applies</text>
        <text x="20" y="86" fill="#F59E0B" fontSize="10"><tspan fontWeight="bold">3H (Ultimate):</tspan> Final Day of the Lord — complete fulfillment awaits</text>
      </g>

      {/* Summary */}
      <rect x="50" y="435" width="700" height="50" rx="12" fill="#8B5CF6" />
      <text x="400" y="465" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
        Knowing WHEN (740 BC) tells you WHAT Isaiah was primarily addressing
      </text>
    </svg>
  );
}

export default {
  TimeZoneFlowchart,
  TimeZoneConcept,
  TimeZoneExample
};
