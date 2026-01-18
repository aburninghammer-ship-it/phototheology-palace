import React from 'react';

// Room 66 Method Flowchart
export function Room66Flowchart() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="r66-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="r66-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="r66-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <filter id="r66-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="r66-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#r66-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Room 66: Know Every Book of the Bible
      </text>

      {/* 66 Books Visual */}
      <g transform="translate(50, 70)" filter="url(#r66-shadow)">
        <rect x="0" y="0" width="340" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#1E40AF" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="12" fill="url(#r66-header)" />
        <text x="170" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">OLD TESTAMENT</text>
        <text x="170" y="55" textAnchor="middle" fill="#1E3A8A" fontSize="36" fontWeight="bold">39</text>
        <text x="170" y="75" textAnchor="middle" fill="#3B82F6" fontSize="10">Books</text>
        <text x="170" y="90" textAnchor="middle" fill="#60A5FA" fontSize="8">Law • History • Poetry • Prophets</text>
      </g>

      <g transform="translate(410, 70)" filter="url(#r66-shadow)">
        <rect x="0" y="0" width="340" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#1E40AF" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="12" fill="url(#r66-header)" />
        <text x="170" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">NEW TESTAMENT</text>
        <text x="170" y="55" textAnchor="middle" fill="#1E3A8A" fontSize="36" fontWeight="bold">27</text>
        <text x="170" y="75" textAnchor="middle" fill="#3B82F6" fontSize="10">Books</text>
        <text x="170" y="90" textAnchor="middle" fill="#60A5FA" fontSize="8">Gospels • History • Epistles • Prophecy</text>
      </g>

      {/* What to Know */}
      <g filter="url(#r66-shadow)">
        <rect x="50" y="190" width="700" height="170" rx="12" fill="white" fillOpacity="0.95" stroke="#1E40AF" strokeWidth="2" />
        <rect x="50" y="190" width="700" height="30" rx="12" fill="url(#r66-header)" />
        <text x="400" y="210" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" letterSpacing="0.5">
          FOR EACH BOOK, KNOW THESE 6 THINGS
        </text>
      </g>

      <g transform="translate(70, 235)">
        {[
          { item: 'Author', desc: 'Who wrote it?', example: 'Moses, Paul, John, etc.' },
          { item: 'Date', desc: 'When written?', example: '~1400 BC, ~50 AD, etc.' },
          { item: 'Audience', desc: 'To whom?', example: 'Israel, Church at Rome, etc.' },
          { item: 'Purpose', desc: 'Why written?', example: 'Instruction, encouragement, etc.' },
          { item: 'Theme', desc: 'Main idea?', example: 'Redemption, faith, hope, etc.' },
          { item: 'Key Verse', desc: 'Summary verse?', example: 'One verse that captures book' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 220}, ${Math.floor(i / 3) * 65})`}>
            <rect x="0" y="0" width="210" height="55" rx="8" fill={i % 2 === 0 ? '#EFF6FF' : '#DBEAFE'} stroke="#3B82F6" strokeWidth="1" />
            <text x="105" y="18" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold">{item.item}</text>
            <text x="105" y="34" textAnchor="middle" fill="#3B82F6" fontSize="9">{item.desc}</text>
            <text x="105" y="48" textAnchor="middle" fill="#60A5FA" fontSize="8" fontStyle="italic">{item.example}</text>
          </g>
        ))}
      </g>

      {/* Categories */}
      <g filter="url(#r66-shadow)">
        <rect x="50" y="380" width="700" height="80" rx="12" fill="#DBEAFE" fillOpacity="0.9" stroke="#1E40AF" strokeWidth="2" />
        <text x="400" y="405" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">
          Bible Book Categories
        </text>
        <g transform="translate(70, 420)">
          {[
            { cat: 'Law (5)', books: 'Gen-Deut' },
            { cat: 'History (12)', books: 'Josh-Esther' },
            { cat: 'Poetry (5)', books: 'Job-Song' },
            { cat: 'Major Prophets (5)', books: 'Isa-Dan' },
            { cat: 'Minor Prophets (12)', books: 'Hosea-Mal' },
            { cat: 'Gospels (4)', books: 'Matt-John' },
            { cat: 'History (1)', books: 'Acts' },
            { cat: 'Epistles (21)', books: 'Rom-Jude' },
            { cat: 'Prophecy (1)', books: 'Revelation' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 73}, 0)`}>
              <text x="35" y="0" textAnchor="middle" fill="#1E40AF" fontSize="8" fontWeight="bold">{item.cat}</text>
              <text x="35" y="15" textAnchor="middle" fill="#3B82F6" fontSize="7">{item.books}</text>
            </g>
          ))}
        </g>
      </g>

      {/* Key Principle */}
      <g filter="url(#r66-shadow)">
        <rect x="50" y="480" width="700" height="55" rx="12" fill="url(#r66-grad)" />
        <text x="400" y="505" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Goal: Know every book well enough to teach its basics in 2 minutes
        </text>
        <text x="400" y="525" textAnchor="middle" fill="#BFDBFE" fontSize="11">
          66 books = 66 opportunities to see God's progressive revelation
        </text>
      </g>
    </svg>
  );
}

// Room 66 Concept Infographic
export function Room66Concept() {
  return (
    <svg viewBox="0 0 800 700" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="r662-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="r662-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <filter id="r662-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="700" fill="url(#r662-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E3A8A" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        The 66 Books at a Glance
      </text>

      {/* OT Grid */}
      <g transform="translate(30, 55)" filter="url(#r662-shadow)">
        <rect x="0" y="0" width="740" height="280" rx="12" fill="white" fillOpacity="0.95" stroke="#1E40AF" strokeWidth="2" />
        <rect x="0" y="0" width="740" height="25" rx="12" fill="url(#r662-header)" />
        <text x="370" y="18" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" letterSpacing="0.5">OLD TESTAMENT (39 Books)</text>

        {[
          // Row 1: Law
          { book: 'Gen', theme: 'Beginnings' }, { book: 'Exod', theme: 'Deliverance' },
          { book: 'Lev', theme: 'Holiness' }, { book: 'Num', theme: 'Wandering' },
          { book: 'Deut', theme: 'Review' },
          // Row 2: History
          { book: 'Josh', theme: 'Conquest' }, { book: 'Judg', theme: 'Cycles' },
          { book: 'Ruth', theme: 'Redemption' }, { book: '1Sam', theme: 'Transition' },
          { book: '2Sam', theme: 'David' }, { book: '1Kgs', theme: 'Division' },
          { book: '2Kgs', theme: 'Decline' }, { book: '1Chr', theme: 'David' },
          { book: '2Chr', theme: 'Temple' }, { book: 'Ezra', theme: 'Return' },
          { book: 'Neh', theme: 'Rebuild' }, { book: 'Esth', theme: 'Providence' },
          // Row 3: Poetry
          { book: 'Job', theme: 'Suffering' }, { book: 'Psa', theme: 'Worship' },
          { book: 'Prov', theme: 'Wisdom' }, { book: 'Eccl', theme: 'Meaning' },
          { book: 'Song', theme: 'Love' },
          // Row 4: Major Prophets
          { book: 'Isa', theme: 'Salvation' }, { book: 'Jer', theme: 'Warning' },
          { book: 'Lam', theme: 'Sorrow' }, { book: 'Ezek', theme: 'Glory' },
          { book: 'Dan', theme: 'Kingdoms' },
          // Row 5: Minor Prophets
          { book: 'Hos', theme: 'Faithful love' }, { book: 'Joel', theme: 'Day of LORD' },
          { book: 'Amos', theme: 'Justice' }, { book: 'Obad', theme: 'Edom' },
          { book: 'Jonah', theme: 'Mission' }, { book: 'Mic', theme: 'Messiah' },
          { book: 'Nah', theme: 'Nineveh' }, { book: 'Hab', theme: 'Faith' },
          { book: 'Zeph', theme: 'Remnant' }, { book: 'Hag', theme: 'Temple' },
          { book: 'Zech', theme: 'Messiah' }, { book: 'Mal', theme: 'Messenger' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 13) * 56 + 8}, ${Math.floor(i / 13) * 50 + 35})`}>
            <rect x="0" y="0" width="52" height="42" rx="6" fill={Math.floor(i / 13) % 2 === 0 ? '#DBEAFE' : '#EFF6FF'} stroke="#BFDBFE" strokeWidth="1" />
            <text x="26" y="15" textAnchor="middle" fill="#1E40AF" fontSize="8" fontWeight="bold">{item.book}</text>
            <text x="26" y="30" textAnchor="middle" fill="#3B82F6" fontSize="6">{item.theme}</text>
          </g>
        ))}
      </g>

      {/* NT Grid */}
      <g transform="translate(30, 350)" filter="url(#r662-shadow)">
        <rect x="0" y="0" width="740" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#1E40AF" strokeWidth="2" />
        <rect x="0" y="0" width="740" height="25" rx="12" fill="url(#r662-header)" />
        <text x="370" y="18" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" letterSpacing="0.5">NEW TESTAMENT (27 Books)</text>

        {[
          // Row 1: Gospels + Acts
          { book: 'Matt', theme: 'King' }, { book: 'Mark', theme: 'Servant' },
          { book: 'Luke', theme: 'Man' }, { book: 'John', theme: 'God' },
          { book: 'Acts', theme: 'Church' },
          // Row 2: Paul's Letters
          { book: 'Rom', theme: 'Gospel' }, { book: '1Cor', theme: 'Order' },
          { book: '2Cor', theme: 'Ministry' }, { book: 'Gal', theme: 'Freedom' },
          { book: 'Eph', theme: 'Unity' }, { book: 'Phil', theme: 'Joy' },
          { book: 'Col', theme: 'Christ' }, { book: '1Thes', theme: 'Return' },
          { book: '2Thes', theme: 'Day of Lord' }, { book: '1Tim', theme: 'Leadership' },
          { book: '2Tim', theme: 'Finish' }, { book: 'Titus', theme: 'Order' },
          { book: 'Phlm', theme: 'Forgive' },
          // Row 3: General + Rev
          { book: 'Heb', theme: 'Better' }, { book: 'Jas', theme: 'Works' },
          { book: '1Pet', theme: 'Suffering' }, { book: '2Pet', theme: 'Growth' },
          { book: '1Jn', theme: 'Love' }, { book: '2Jn', theme: 'Truth' },
          { book: '3Jn', theme: 'Hospitality' }, { book: 'Jude', theme: 'Contend' },
          { book: 'Rev', theme: 'Victory' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 9) * 80 + 15}, ${Math.floor(i / 9) * 50 + 35})`}>
            <rect x="0" y="0" width="72" height="42" rx="6" fill={Math.floor(i / 9) % 2 === 0 ? '#DBEAFE' : '#EFF6FF'} stroke="#BFDBFE" strokeWidth="1" />
            <text x="36" y="15" textAnchor="middle" fill="#1E40AF" fontSize="9" fontWeight="bold">{item.book}</text>
            <text x="36" y="30" textAnchor="middle" fill="#3B82F6" fontSize="7">{item.theme}</text>
          </g>
        ))}
      </g>

      {/* Memory Aid */}
      <g filter="url(#r662-shadow)">
        <rect x="50" y="545" width="700" height="70" rx="12" fill="#DBEAFE" fillOpacity="0.9" stroke="#1E40AF" strokeWidth="2" />
        <text x="400" y="570" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">
          Memory Pattern: 5-12-5-5-12 + 4-1-13-9
        </text>
        <text x="400" y="590" textAnchor="middle" fill="#3B82F6" fontSize="10">
          OT: Law(5) + History(12) + Poetry(5) + Major(5) + Minor(12) = 39
        </text>
        <text x="400" y="605" textAnchor="middle" fill="#3B82F6" fontSize="10">
          NT: Gospels(4) + History(1) + Paul(13) + General+Rev(9) = 27
        </text>
      </g>

      {/* Deliverable */}
      <g filter="url(#r662-shadow)">
        <rect x="50" y="630" width="700" height="55" rx="12" fill="url(#r662-header)" />
        <text x="400" y="655" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Deliverable: 66 Book Flashcards (Author, Date, Theme, Key Verse)
        </text>
        <text x="400" y="675" textAnchor="middle" fill="#BFDBFE" fontSize="10">
          Master all 66 and you'll navigate Scripture with confidence
        </text>
      </g>
    </svg>
  );
}

// Room 66 Example
export function Room66Example() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="r663-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="r663-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <filter id="r663-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#r663-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E3A8A" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Room 66 Card for Romans
      </text>

      {/* Book Card */}
      <g transform="translate(150, 55)" filter="url(#r663-shadow)">
        <rect x="0" y="0" width="500" height="350" rx="16" fill="white" fillOpacity="0.95" stroke="#1E40AF" strokeWidth="3" />

        {/* Header */}
        <rect x="0" y="0" width="500" height="50" rx="16" fill="url(#r663-header)" />
        <text x="250" y="33" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" letterSpacing="1">ROMANS</text>

        {/* Content */}
        <g transform="translate(30, 70)">
          {[
            { label: 'Author:', value: 'Paul the Apostle' },
            { label: 'Date:', value: '~57 AD (from Corinth)' },
            { label: 'Audience:', value: 'Church at Rome (mixed Jew/Gentile)' },
            { label: 'Purpose:', value: 'Explain the Gospel systematically' },
            { label: 'Theme:', value: 'Righteousness by Faith' },
            { label: 'Key Verse:', value: '"For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation..." (1:16)' },
            { label: 'Outline:', value: '1-3: Sin | 4-5: Salvation | 6-8: Sanctification | 9-11: Israel | 12-16: Service' },
          ].map((item, i) => (
            <g key={i} transform={`translate(0, ${i * 38})`}>
              <rect x="-10" y="-12" width="460" height="35" rx="6" fill={i % 2 === 0 ? '#EFF6FF' : 'transparent'} />
              <text x="0" y="0" fill="#1E40AF" fontSize="13" fontWeight="bold">{item.label}</text>
              <text x="0" y="20" fill="#3B82F6" fontSize="11">{item.value}</text>
            </g>
          ))}
        </g>
      </g>

      {/* How to Create Cards */}
      <g filter="url(#r663-shadow)">
        <rect x="50" y="420" width="700" height="115" rx="12" fill="url(#r663-header)" />
        <text x="400" y="448" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Room 66 Method: Create a Card for Every Book
        </text>
        <text x="400" y="475" textAnchor="middle" fill="#BFDBFE" fontSize="11">
          1. Read the book (or a good introduction)
        </text>
        <text x="400" y="495" textAnchor="middle" fill="#BFDBFE" fontSize="11">
          2. Fill in the 6 categories: Author, Date, Audience, Purpose, Theme, Key Verse
        </text>
        <text x="400" y="515" textAnchor="middle" fill="#BFDBFE" fontSize="11">
          3. Review regularly until you can recall all 66 from memory
        </text>
      </g>
    </svg>
  );
}

export default {
  Room66Flowchart,
  Room66Concept,
  Room66Example
};
