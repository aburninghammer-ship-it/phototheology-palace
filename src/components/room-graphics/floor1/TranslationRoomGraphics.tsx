import React from 'react';

// Translation Room Method Flowchart
export function TranslationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="tr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id="tr-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <filter id="tr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="tr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#tr-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#9D174D" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Translation Room: Words → Pictures
      </text>

      {/* Three Levels */}
      <g filter="url(#tr-shadow)">
        <rect x="50" y="70" width="700" height="150" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <rect x="50" y="70" width="700" height="35" rx="12" fill="url(#tr-header)" />
        <text x="400" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" letterSpacing="0.5">
          THREE TRANSLATION LEVELS
        </text>
      </g>

      {/* Level boxes */}
      {[
        { x: 70, title: 'Level 1: Verse → Icon', desc: 'Single verse becomes', desc2: 'one symbolic image', bg: '#FCE7F3' },
        { x: 300, title: 'Level 2: Passage → Comic', desc: 'Pericope becomes', desc2: '3-panel comic strip', bg: '#FBCFE8' },
        { x: 530, title: 'Level 3: Book → Mural', desc: 'Entire book becomes', desc2: 'panoramic scene', bg: '#F9A8D4' },
      ].map((level, i) => (
        <g key={i} transform={`translate(${level.x}, 115)`}>
          <rect x="0" y="0" width="200" height="85" rx="10" fill={level.bg} stroke="#EC4899" strokeWidth="2" />
          <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="13" fontWeight="bold">{level.title}</text>
          <text x="100" y="50" textAnchor="middle" fill="#BE185D" fontSize="11">{level.desc}</text>
          <text x="100" y="68" textAnchor="middle" fill="#BE185D" fontSize="11">{level.desc2}</text>
        </g>
      ))}

      {/* Method Steps */}
      <g transform="translate(50, 240)">
        {[
          { step: 1, icon: 'FIND', title: 'Find', desc: 'Central visual element' },
          { step: 2, icon: 'CHOOSE', title: 'Choose', desc: 'Level (Icon/Comic/Mural)' },
          { step: 3, icon: 'SKETCH', title: 'Sketch', desc: 'Concrete objects' },
          { step: 4, icon: 'TEST', title: 'Test', desc: 'Does it capture essence?' },
        ].map((item, i) => (
          <g key={i} filter="url(#tr-shadow)">
            <rect x={i * 175} y="0" width="165" height="80" rx="10" fill="url(#tr-grad)" />
            <circle cx={i * 175 + 30} cy="20" r="15" fill="white" fillOpacity="0.3" filter="url(#tr-glow)" />
            <text x={i * 175 + 30} y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{item.step}</text>
            <text x={i * 175 + 82} y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.title}</text>
            <text x={i * 175 + 82} y="55" textAnchor="middle" fill="#FCE7F3" fontSize="11">{item.desc}</text>
            {i < 3 && <polygon points={`${(i + 1) * 175 - 10},40 ${(i + 1) * 175 + 5},40 ${(i + 1) * 175 + 5},32 ${(i + 1) * 175 + 18},45 ${(i + 1) * 175 + 5},58 ${(i + 1) * 175 + 5},50 ${(i + 1) * 175 - 10},50`} fill="#EC4899" />}
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <g filter="url(#tr-shadow)">
        <rect x="50" y="340" width="700" height="90" rx="12" fill="#FCE7F3" fillOpacity="0.9" stroke="#EC4899" strokeWidth="2" />
        <text x="400" y="375" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
          Key Principle: Images stick 6x better than words
        </text>
        <text x="400" y="405" textAnchor="middle" fill="#BE185D" fontSize="13">
          The brain processes visuals 60,000x faster than text. Visual translations create neural shortcuts.
        </text>
      </g>
    </svg>
  );
}

// Translation Room Concept Infographic
export function TranslationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tr2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="tr2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <filter id="tr2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#tr2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Visual Translation: Abstract → Concrete
      </text>

      {/* Before/After comparison */}
      <g transform="translate(50, 60)" filter="url(#tr2-shadow)">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#D1D5DB" strokeWidth="2" />
        <text x="160" y="30" textAnchor="middle" fill="#6B7280" fontSize="14" fontWeight="bold">Abstract Text</text>
        <rect x="20" y="50" width="280" height="110" rx="8" fill="#F3F4F6" />
        <text x="160" y="80" textAnchor="middle" fill="#374151" fontSize="12">"Your word is a lamp to my feet</text>
        <text x="160" y="100" textAnchor="middle" fill="#374151" fontSize="12">and a light to my path."</text>
        <text x="160" y="130" textAnchor="middle" fill="#9CA3AF" fontSize="11">— Psalm 119:105</text>
        <text x="160" y="150" textAnchor="middle" fill="#6B7280" fontSize="10" fontStyle="italic">Words only</text>
      </g>

      <g transform="translate(430, 60)" filter="url(#tr2-shadow)">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#FCE7F3" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <text x="160" y="30" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">Visual Translation</text>
        <rect x="20" y="50" width="280" height="110" rx="8" fill="#1F2937" />
        {/* Dark path with glowing scroll */}
        <rect x="30" y="130" width="260" height="20" fill="#374151" />
        <ellipse cx="160" cy="100" rx="30" ry="40" fill="#FCD34D" opacity="0.4" />
        <rect x="145" y="85" width="30" height="40" fill="#FEF3C7" rx="3" />
        <text x="160" y="112" textAnchor="middle" fill="#92400E" fontSize="12">LAMP</text>
        <text x="160" y="150" textAnchor="middle" fill="#F9A8D4" fontSize="10">Glowing scroll on dark path</text>
      </g>

      {/* The three levels explained */}
      <g filter="url(#tr2-shadow)">
        <rect x="50" y="260" width="700" height="220" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <rect x="50" y="260" width="700" height="30" rx="12" fill="url(#tr2-header)" />
        <text x="400" y="280" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" letterSpacing="0.5">
          THREE SCALES OF VISUAL TRANSLATION
        </text>
      </g>

      {/* Level examples */}
      {[
        { x: 70, title: 'VERSE → ICON', desc: 'Ps 119:105 = Glowing lamp', symbol: 'LAMP' },
        { x: 300, title: 'PASSAGE → COMIC', desc: 'Luke 15: Leave→Pigs→Embrace', symbol: '3 PANELS' },
        { x: 530, title: 'BOOK → MURAL', desc: 'Exodus: Slavery→Sea→Sinai', symbol: 'PANORAMA' },
      ].map((item, i) => (
        <g key={i} transform={`translate(${item.x}, 310)`}>
          <rect x="0" y="0" width="200" height="150" rx="10" fill={['#FCE7F3', '#FBCFE8', '#F9A8D4'][i]} />
          <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">{item.title}</text>
          <rect x="20" y="40" width="160" height="70" fill="white" rx="6" stroke="#EC4899" />
          <text x="100" y="80" textAnchor="middle" fill="#BE185D" fontSize="14" fontWeight="bold">{item.symbol}</text>
          <text x="100" y="130" textAnchor="middle" fill="#BE185D" fontSize="10">{item.desc}</text>
        </g>
      ))}
    </svg>
  );
}

// Translation Room Example
export function TranslationRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tr3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="tr3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <filter id="tr3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#tr3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Prodigal Son (Luke 15) as 3-Panel Comic
      </text>

      {/* Comic Strip */}
      <g filter="url(#tr3-shadow)">
        <rect x="50" y="55" width="700" height="250" fill="#1F2937" rx="12" />
      </g>

      {/* Panels */}
      {[
        { x: 70, title: 'Panel 1: DEPARTURE', bg: '#DBEAFE', desc: '"Give me my share..."', ref: 'v. 12-13', content: 'HOUSE → WALK' },
        { x: 300, title: 'Panel 2: DISGRACE', bg: '#FEF3C7', desc: '"He longed to fill his stomach"', ref: 'v. 14-16', content: 'PIGS' },
        { x: 530, title: 'Panel 3: EMBRACE', bg: '#D1FAE5', desc: '"Father ran and embraced him"', ref: 'v. 20', content: 'HUG' },
      ].map((panel, i) => (
        <g key={i} transform={`translate(${panel.x}, 75)`}>
          <rect x="0" y="0" width="200" height="210" fill="white" rx="8" />
          <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">{panel.title}</text>
          <rect x="15" y="35" width="170" height="130" fill={panel.bg} rx="6" />
          <text x="100" y="110" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">{panel.content}</text>
          <text x="100" y="190" textAnchor="middle" fill="#BE185D" fontSize="10">{panel.desc}</text>
          <text x="100" y="205" textAnchor="middle" fill="#6B7280" fontSize="10">{panel.ref}</text>
        </g>
      ))}

      {/* Analysis */}
      <g filter="url(#tr3-shadow)">
        <rect x="50" y="320" width="700" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <text x="400" y="350" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
          Visual Elements That Stick
        </text>
        <text x="80" y="380" fill="#BE185D" fontSize="12">Money bag = greed/inheritance</text>
        <text x="80" y="400" fill="#BE185D" fontSize="12">Pigs = Jewish rock-bottom</text>
        <text x="430" y="380" fill="#BE185D" fontSize="12">Father RUNNING = undignified love</text>
        <text x="430" y="400" fill="#BE185D" fontSize="12">Embrace = reconciliation</text>
      </g>

      {/* Deliverable */}
      <g filter="url(#tr3-shadow)">
        <rect x="50" y="435" width="700" height="100" rx="12" fill="#FCE7F3" fillOpacity="0.9" stroke="#EC4899" strokeWidth="2" />
        <text x="400" y="465" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
          Deliverable: Sketch OR Description
        </text>
        <text x="400" y="490" textAnchor="middle" fill="#BE185D" fontSize="12">
          You don't need to be an artist! Stick figures work perfectly.
        </text>
        <text x="400" y="515" textAnchor="middle" fill="#BE185D" fontSize="12">
          The goal is MEMORABLE visual translation, not artistic beauty.
        </text>
      </g>
    </svg>
  );
}

export default {
  TranslationRoomFlowchart,
  TranslationRoomConcept,
  TranslationRoomExample
};
