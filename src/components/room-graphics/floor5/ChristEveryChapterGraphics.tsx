import React from 'react';

// Christ Every Chapter Method Flowchart
export function ChristEveryChapterFlowchart() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cec-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF2F2" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id="cec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="cec-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <filter id="cec-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="cec-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#cec-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#991B1B" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Christ Every Chapter: Finding Jesus in All Scripture
      </text>

      {/* Central Image */}
      <g transform="translate(300, 70)" filter="url(#cec-shadow)">
        <circle cx="100" cy="80" r="70" fill="url(#cec-grad)" filter="url(#cec-glow)" />
        <text x="100" y="70" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">✝️</text>
        <text x="100" y="100" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CHRIST</text>
        <text x="100" y="115" textAnchor="middle" fill="#FECACA" fontSize="10">Center of All</text>
      </g>

      {/* Ways Christ Appears */}
      <g filter="url(#cec-shadow)">
        <rect x="50" y="180" width="700" height="150" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="2" />
        <rect x="50" y="180" width="700" height="30" rx="12" fill="url(#cec-header)" />
        <text x="400" y="200" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" letterSpacing="0.5">
          7 WAYS CHRIST APPEARS IN EVERY CHAPTER
        </text>
      </g>

      <g transform="translate(60, 220)">
        {[
          { way: 'Prediction', desc: 'Prophecy about Him', example: 'Gen 3:15 — Seed of woman' },
          { way: 'Type', desc: 'Person/event foreshadowing', example: 'Isaac — only begotten son' },
          { way: 'Symbol', desc: 'Object representing Him', example: 'Lamb, bread, light, door' },
          { way: 'Principle', desc: 'Truth He embodies', example: 'Justice, mercy, love' },
          { way: 'Appearance', desc: 'Christophany (OT)', example: 'Angel of the LORD' },
          { way: 'Need', desc: 'Problem only He solves', example: 'Sin, death, separation' },
          { way: 'Contrast', desc: 'Failure pointing to need', example: 'Adam failed → Christ succeeded' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 4) * 170}, ${Math.floor(i / 4) * 55})`}>
            <rect x="0" y="0" width="160" height="48" rx="8" fill={i % 2 === 0 ? '#FEE2E2' : '#FEF2F2'} stroke="#FECACA" strokeWidth="1" />
            <text x="80" y="15" textAnchor="middle" fill="#991B1B" fontSize="10" fontWeight="bold">{item.way}</text>
            <text x="80" y="30" textAnchor="middle" fill="#B91C1C" fontSize="8">{item.desc}</text>
            <text x="80" y="42" textAnchor="middle" fill="#DC2626" fontSize="7" fontStyle="italic">{item.example}</text>
          </g>
        ))}
      </g>

      {/* The Method */}
      <g filter="url(#cec-shadow)">
        <rect x="50" y="350" width="700" height="90" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#DC2626" strokeWidth="2" />
        <text x="400" y="375" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">
          The Christ Every Chapter Method
        </text>
      </g>

      <g transform="translate(80, 390)">
        {[
          { step: '1', text: 'Read the chapter' },
          { step: '2', text: 'Ask: Where is Jesus?' },
          { step: '3', text: 'Use 7 categories above' },
          { step: '4', text: 'Record connection' },
          { step: '5', text: 'Apply to life' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 130}, 0)`}>
            <circle cx="15" cy="15" r="14" fill="url(#cec-grad)" filter="url(#cec-glow)" />
            <text x="15" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{item.step}</text>
            <text x="75" y="19" textAnchor="middle" fill="#991B1B" fontSize="9">{item.text}</text>
          </g>
        ))}
      </g>

      {/* Biblical Basis */}
      <g filter="url(#cec-shadow)">
        <rect x="50" y="460" width="700" height="75" rx="12" fill="url(#cec-grad)" />
        <text x="400" y="490" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          "Search the scriptures... they are they which testify of me" — John 5:39
        </text>
        <text x="400" y="515" textAnchor="middle" fill="#FECACA" fontSize="11">
          Jesus said ALL Scripture points to Him — every chapter has a Christ connection
        </text>
      </g>
    </svg>
  );
}

// Christ Every Chapter Concept Infographic
export function ChristEveryChapterConcept() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cec2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF2F2" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id="cec2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <filter id="cec2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#cec2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#991B1B" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Christ in Every Book of the Bible
      </text>

      {/* OT Books */}
      <g transform="translate(50, 55)" filter="url(#cec2-shadow)">
        <rect x="0" y="0" width="340" height="380" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="12" fill="url(#cec2-header)" />
        <text x="170" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">OLD TESTAMENT</text>

        {[
          { book: 'Genesis', christ: 'Seed of the Woman (3:15)' },
          { book: 'Exodus', christ: 'Passover Lamb' },
          { book: 'Leviticus', christ: 'High Priest & Sacrifice' },
          { book: 'Numbers', christ: 'Lifted Serpent (21:9)' },
          { book: 'Deuteronomy', christ: 'Prophet like Moses (18:15)' },
          { book: 'Joshua', christ: 'Captain of the LORD\'s host' },
          { book: 'Ruth', christ: 'Kinsman Redeemer' },
          { book: 'Psalms', christ: 'The Shepherd, King, Sufferer' },
          { book: 'Isaiah', christ: 'Suffering Servant (53)' },
          { book: 'Daniel', christ: 'Son of Man (7:13)' },
          { book: 'Jonah', christ: 'Three days sign' },
          { book: 'Zechariah', christ: 'Pierced One (12:10)' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${40 + i * 28})`}>
            <rect x="-5" y="-12" width="330" height="24" rx="4" fill={i % 2 === 0 ? '#FEF2F2' : 'transparent'} />
            <text x="0" y="0" fill="#991B1B" fontSize="9" fontWeight="bold">{item.book}:</text>
            <text x="80" y="0" fill="#B91C1C" fontSize="9">{item.christ}</text>
          </g>
        ))}
      </g>

      {/* NT Books */}
      <g transform="translate(410, 55)" filter="url(#cec2-shadow)">
        <rect x="0" y="0" width="340" height="380" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="12" fill="url(#cec2-header)" />
        <text x="170" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="0.5">NEW TESTAMENT</text>

        {[
          { book: 'Matthew', christ: 'King of the Jews' },
          { book: 'Mark', christ: 'Servant of the LORD' },
          { book: 'Luke', christ: 'Son of Man' },
          { book: 'John', christ: 'Son of God' },
          { book: 'Acts', christ: 'Ascended Lord' },
          { book: 'Romans', christ: 'Our Righteousness' },
          { book: 'Hebrews', christ: 'Better High Priest' },
          { book: 'James', christ: 'Coming Judge' },
          { book: '1 Peter', christ: 'Suffering Example' },
          { book: '1 John', christ: 'Eternal Life' },
          { book: 'Revelation', christ: 'King of Kings' },
          { book: 'All Epistles', christ: 'Head of the Church' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${40 + i * 28})`}>
            <rect x="-5" y="-12" width="330" height="24" rx="4" fill={i % 2 === 0 ? '#FEF2F2' : 'transparent'} />
            <text x="0" y="0" fill="#991B1B" fontSize="9" fontWeight="bold">{item.book}:</text>
            <text x="90" y="0" fill="#B91C1C" fontSize="9">{item.christ}</text>
          </g>
        ))}
      </g>

      {/* Road to Emmaus */}
      <g filter="url(#cec2-shadow)">
        <rect x="50" y="450" width="700" height="70" rx="12" fill="white" fillOpacity="0.9" stroke="#DC2626" strokeWidth="2" />
        <text x="400" y="475" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">
          The Emmaus Road Principle (Luke 24:27)
        </text>
        <text x="400" y="495" textAnchor="middle" fill="#B91C1C" fontSize="11">
          "Beginning at Moses and all the prophets, He expounded unto them
        </text>
        <text x="400" y="512" textAnchor="middle" fill="#B91C1C" fontSize="11" fontWeight="bold">
          in ALL the scriptures the things concerning Himself"
        </text>
      </g>

      {/* Deliverable */}
      <g filter="url(#cec2-shadow)">
        <rect x="50" y="535" width="700" height="50" rx="12" fill="url(#cec2-header)" />
        <text x="400" y="565" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Deliverable: Journal every chapter's Christ connection as you read through the Bible
        </text>
      </g>
    </svg>
  );
}

// Christ Every Chapter Example
export function ChristEveryChapterExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cec3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF2F2" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id="cec3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <filter id="cec3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#cec3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#991B1B" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Finding Christ in Genesis 22
      </text>

      {/* The Chapter */}
      <g filter="url(#cec3-shadow)">
        <rect x="50" y="55" width="700" height="60" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="2" />
        <text x="400" y="80" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">
          Genesis 22: The Binding of Isaac (Akedah)
        </text>
        <text x="400" y="100" textAnchor="middle" fill="#B91C1C" fontSize="10" fontStyle="italic">
          "Take now thy son, thine only son Isaac, whom thou lovest... offer him for a burnt offering"
        </text>
      </g>

      {/* Christ Connections */}
      <g transform="translate(50, 130)" filter="url(#cec3-shadow)">
        <rect x="0" y="0" width="700" height="250" rx="12" fill="white" fillOpacity="0.95" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="30" rx="12" fill="url(#cec3-header)" />
        <text x="350" y="21" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" letterSpacing="0.5">
          CHRIST CONNECTIONS FOUND
        </text>

        {[
          { element: '"Only son whom thou lovest"', christ: 'John 3:16 — God\'s only begotten Son', type: 'TYPE' },
          { element: 'Isaac carries wood up mountain', christ: 'Jesus carries cross up Calvary', type: 'TYPE' },
          { element: '3-day journey (v.4)', christ: '3 days in tomb before resurrection', type: 'PATTERN' },
          { element: '"God will provide the lamb" (v.8)', christ: 'Behold the Lamb of God (John 1:29)', type: 'PREDICTION' },
          { element: 'Ram caught in thorns (v.13)', christ: 'Crown of thorns on Christ\'s head', type: 'SYMBOL' },
          { element: '"Jehovah-Jireh" — LORD provides', christ: 'God provided Himself as sacrifice', type: 'NAME' },
          { element: 'Isaac "raised" from altar (v.12)', christ: 'Hebrews 11:19 — figure of resurrection', type: 'TYPE' },
          { element: 'Mount Moriah = Jerusalem', christ: 'Where Jesus was crucified!', type: 'PLACE' },
        ].map((item, i) => (
          <g key={i} transform={`translate(15, ${45 + i * 25})`}>
            <rect x="-5" y="-14" width="680" height="22" rx="4" fill={i % 2 === 0 ? '#FEF2F2' : 'transparent'} />
            <rect x="0" y="-12" width="50" height="18" rx="6" fill="url(#cec3-header)" />
            <text x="25" y="1" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{item.type}</text>
            <text x="60" y="2" fill="#991B1B" fontSize="9">{item.element}</text>
            <text x="330" y="2" fill="#B91C1C" fontSize="9">→ {item.christ}</text>
          </g>
        ))}
      </g>

      {/* Key Insight */}
      <g filter="url(#cec3-shadow)">
        <rect x="50" y="395" width="700" height="60" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#DC2626" strokeWidth="2" />
        <text x="400" y="420" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">
          Key Insight: Genesis 22 is a Preview of Calvary
        </text>
        <text x="400" y="442" textAnchor="middle" fill="#B91C1C" fontSize="10">
          Written ~2000 years before Christ, on the same mountain where He would die!
        </text>
      </g>

      {/* Application */}
      <g filter="url(#cec3-shadow)">
        <rect x="50" y="470" width="700" height="65" rx="12" fill="url(#cec3-header)" />
        <text x="400" y="498" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Christ Every Chapter Deliverable for Genesis 22
        </text>
        <text x="400" y="520" textAnchor="middle" fill="#FECACA" fontSize="11">
          8 distinct Christ connections in one chapter — the OT is a Christ-saturated book!
        </text>
      </g>
    </svg>
  );
}

export default {
  ChristEveryChapterFlowchart,
  ChristEveryChapterConcept,
  ChristEveryChapterExample
};
