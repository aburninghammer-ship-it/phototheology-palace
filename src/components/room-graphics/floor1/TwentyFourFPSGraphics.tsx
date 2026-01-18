import React from 'react';

// 24FPS Room Method Flowchart
export function TwentyFourFPSFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fps-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="fps-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="fps-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="fps-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="fps-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#fps-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#92400E" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        24FPS Method: Visual GPS for the Bible
      </text>

      {/* Step Flow */}
      <g transform="translate(50, 80)">
        {[
          { step: '1', icon: 'READ', title: 'Read the', subtitle: 'Chapter' },
          { step: '2', icon: 'FIND', title: 'Find MOST', subtitle: 'MEMORABLE Element' },
          { step: '3', icon: 'DRAW', title: 'Convert to', subtitle: 'CONCRETE Visual' },
          { step: '4', icon: 'TEST', title: 'TEST:', subtitle: 'Instant Recall?', bg: '#16A34A' },
        ].map((item, i) => (
          <g key={i} filter="url(#fps-shadow)">
            <rect x={i * 180} y="0" width="165" height="100" rx="12" fill={item.bg ? item.bg : 'url(#fps-grad)'} />
            <circle cx={i * 180 + 30} cy="25" r="18" fill="white" fillOpacity="0.3" filter="url(#fps-glow)" />
            <text x={i * 180 + 30} y="31" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">{item.step}</text>
            <text x={i * 180 + 100} y="35" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">{item.title}</text>
            <text x={i * 180 + 100} y="60" textAnchor="middle" fill={item.bg ? '#D1FAE5' : '#FEF3C7'} fontSize="12">{item.subtitle}</text>
            <text x={i * 180 + 82} y="85" textAnchor="middle" fill="#FEF3C7" fontSize="10">{item.icon}</text>
            {i < 3 && <polygon points={`${(i + 1) * 180 - 15},50 ${(i + 1) * 180 + 5},50 ${(i + 1) * 180 + 5},40 ${(i + 1) * 180 + 20},55 ${(i + 1) * 180 + 5},70 ${(i + 1) * 180 + 5},60 ${(i + 1) * 180 - 15},60`} fill="#F59E0B" />}
          </g>
        ))}
      </g>

      {/* Key Principle Box */}
      <g filter="url(#fps-shadow)">
        <rect x="50" y="200" width="700" height="80" rx="12" fill="white" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="230" textAnchor="middle" fill="#92400E" fontSize="16" fontWeight="bold">
          The Secret: ONE striking image per chapter
        </text>
        <text x="400" y="255" textAnchor="middle" fill="#78350F" fontSize="13">
          Prefer quirky over dignified. Memory hooks need to be WEIRD to stick.
        </text>
        <text x="400" y="275" textAnchor="middle" fill="#78350F" fontSize="13">
          This is about FINDABILITY, not theological depth.
        </text>
      </g>

      {/* Good vs Bad */}
      <g transform="translate(50, 300)" filter="url(#fps-shadow)">
        <rect x="0" y="0" width="340" height="130" rx="12" fill="#D1FAE5" fillOpacity="0.9" stroke="#16A34A" strokeWidth="2" />
        <text x="170" y="28" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">Good Images</text>
        <text x="20" y="55" fill="#166534" fontSize="12">Birthday Cake Earth (Gen 1)</text>
        <text x="20" y="75" fill="#166534" fontSize="12">Snake + Apple + Clock (Gen 3)</text>
        <text x="20" y="95" fill="#166534" fontSize="12">Knife Suspended Over Altar (Gen 22)</text>
        <text x="20" y="115" fill="#166534" fontSize="12">Burning Bush (Ex 3)</text>
      </g>

      <g transform="translate(410, 300)" filter="url(#fps-shadow)">
        <rect x="0" y="0" width="340" height="130" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#DC2626" strokeWidth="2" />
        <text x="170" y="28" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">Bad Images</text>
        <text x="20" y="55" fill="#991B1B" fontSize="12">"The Creation Story" (descriptive title)</text>
        <text x="20" y="75" fill="#991B1B" fontSize="12">"Grace" or "Redemption" (abstract)</text>
        <text x="20" y="95" fill="#991B1B" fontSize="12">Multi-scene panoramas (too complex)</text>
        <text x="20" y="115" fill="#991B1B" fontSize="12">Same image for multiple chapters</text>
      </g>
    </svg>
  );
}

// 24FPS Room Concept Infographic
export function TwentyFourFPSConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fps2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="fps2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="fps2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#fps2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#92400E" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Why 24FPS? Film Frame Memory System
      </text>

      {/* Film Strip */}
      <g transform="translate(50, 60)" filter="url(#fps2-shadow)">
        <rect x="0" y="0" width="700" height="120" fill="#1F2937" rx="8" />
        {/* Sprocket holes */}
        {[30, 130, 230, 330, 430, 530, 630].map((x, i) => (
          <React.Fragment key={i}>
            <rect x={x} y="8" width="20" height="10" rx="2" fill="#374151" />
            <rect x={x} y="102" width="20" height="10" rx="2" fill="#374151" />
          </React.Fragment>
        ))}
        {/* Film frames - Genesis chapters */}
        {[
          { x: 20, ch: 'Gen 1', label: 'CAKE' },
          { x: 110, ch: 'Gen 2', label: 'TREE' },
          { x: 200, ch: 'Gen 3', label: 'SNAKE' },
          { x: 290, ch: 'Gen 4', label: 'BLOOD' },
          { x: 380, ch: 'Gen 5', label: 'SCROLL' },
          { x: 470, ch: 'Gen 6-8', label: 'ARK' },
          { x: 560, ch: 'Gen 9', label: 'BOW' },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="25" width="80" height="70" fill="#FBBF24" rx="4" />
            <text x={item.x + 40} y="55" textAnchor="middle" fill="#78350F" fontWeight="bold" fontSize="10">{item.label}</text>
            <text x={item.x + 40} y="85" textAnchor="middle" fill="#78350F" fontSize="8">{item.ch}</text>
          </g>
        ))}
      </g>

      {/* 1189 chapters concept */}
      <g filter="url(#fps2-shadow)">
        <rect x="50" y="200" width="700" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="235" textAnchor="middle" fill="#92400E" fontSize="18" fontWeight="bold">
          The Bible has 1,189 chapters
        </text>
        <text x="400" y="265" textAnchor="middle" fill="#78350F" fontSize="14">
          If you can assign ONE visual image to each chapter, you create a mental
        </text>
        <text x="400" y="285" textAnchor="middle" fill="#78350F" fontSize="14">
          GPS that lets you FIND any passage instantly by its image.
        </text>
      </g>

      {/* Why quirky works */}
      <g transform="translate(50, 320)" filter="url(#fps2-shadow)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="#FEF3C7" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
        <text x="170" y="30" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">Why Quirky Works</text>
        <text x="20" y="60" fill="#78350F" fontSize="12">The brain flags UNUSUAL images</text>
        <text x="20" y="80" fill="#78350F" fontSize="12">as worth remembering.</text>
        <text x="20" y="110" fill="#78350F" fontSize="12">"Birthday Cake Earth" is weird</text>
        <text x="20" y="130" fill="#78350F" fontSize="12">enough that your brain WON'T</text>
        <text x="20" y="150" fill="#78350F" fontSize="12">let you forget it.</text>
      </g>

      {/* Deliverable */}
      <g transform="translate(410, 320)" filter="url(#fps2-shadow)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="#D1FAE5" fillOpacity="0.9" stroke="#16A34A" strokeWidth="2" />
        <text x="170" y="30" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">Deliverable Format</text>
        <text x="20" y="60" fill="#166534" fontSize="12" fontFamily="monospace">Gen 1 = Birthday Cake Earth</text>
        <text x="20" y="80" fill="#166534" fontSize="12" fontFamily="monospace">Gen 2 = Garden + 4 Rivers</text>
        <text x="20" y="100" fill="#166534" fontSize="12" fontFamily="monospace">Gen 3 = Snake + Apple + Clock</text>
        <text x="20" y="120" fill="#166534" fontSize="12" fontFamily="monospace">Gen 4 = Blood Crying from Ground</text>
        <text x="20" y="145" fill="#166534" fontSize="11" fontStyle="italic">Chapter → Image table</text>
      </g>
    </svg>
  );
}

// 24FPS Room Example
export function TwentyFourFPSExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fps3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="fps3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="fps3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#fps3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#92400E" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Genesis Visual Gallery (First 24 Chapters)
      </text>

      {/* Grid of chapter images - 6x4 grid */}
      {[
        { ch: 1, label: 'Birthday Cake' },
        { ch: 2, label: 'Garden + Rivers' },
        { ch: 3, label: 'Snake + Apple' },
        { ch: 4, label: 'Blood Crying' },
        { ch: 5, label: 'Genealogy Scroll' },
        { ch: 6, label: 'Ark Blueprint' },
        { ch: 7, label: 'Rain 40 Days' },
        { ch: 8, label: 'Dove + Olive' },
        { ch: 9, label: 'Rainbow Covenant' },
        { ch: 10, label: 'Nations Map' },
        { ch: 11, label: 'Tower Crumbling' },
        { ch: 12, label: "Abram's Tent" },
        { ch: 13, label: 'Lot Choosing' },
        { ch: 14, label: 'Battle + Bread' },
        { ch: 15, label: 'Stars Promise' },
        { ch: 16, label: "Hagar's Well" },
        { ch: 17, label: 'Circumcision' },
        { ch: 18, label: 'Three Visitors' },
        { ch: 19, label: 'Salt Pillar' },
        { ch: 20, label: "King's Dream" },
        { ch: 21, label: 'Isaac Laughing' },
        { ch: 22, label: 'Knife + Altar' },
        { ch: 23, label: 'Cave Purchased' },
        { ch: 24, label: 'Camel + Ring' },
      ].map((item, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = 55 + col * 120;
        const y = 60 + row * 130;
        return (
          <g key={item.ch} transform={`translate(${x}, ${y})`} filter="url(#fps3-shadow)">
            <rect x="0" y="0" width="110" height="110" rx="10" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
            <rect x="5" y="5" width="100" height="70" rx="6" fill="white" />
            <text x="55" y="45" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">IMAGE</text>
            <text x="55" y="90" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">Ch. {item.ch}</text>
            <text x="55" y="105" textAnchor="middle" fill="#78350F" fontSize="8">{item.label}</text>
          </g>
        );
      })}

      {/* Bottom tip */}
      <g filter="url(#fps3-shadow)">
        <rect x="50" y="545" width="700" height="40" rx="10" fill="#D1FAE5" fillOpacity="0.9" stroke="#16A34A" strokeWidth="2" />
        <text x="400" y="570" textAnchor="middle" fill="#166534" fontSize="13" fontWeight="bold">
          Test yourself: Cover labels. Can you recall each chapter from the image alone?
        </text>
      </g>
    </svg>
  );
}

export default {
  TwentyFourFPSFlowchart,
  TwentyFourFPSConcept,
  TwentyFourFPSExample
};
