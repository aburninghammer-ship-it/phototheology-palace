import React from 'react';

// Story Room Method Flowchart
export function StoryRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 520" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="sr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="sr-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="sr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="sr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="520" fill="url(#sr-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E40AF" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Story Room: Storage Through Visualization
      </text>

      {/* Steps */}
      <g transform="translate(30, 80)">
        {[
          { step: '1', icon: 'BOOK', title: 'Read the', subtitle: 'Story' },
          { step: '2', icon: 'SCENE', title: 'Identify', subtitle: '3-7 Scenes' },
          { step: '3', icon: 'PEN', title: 'Name Each', subtitle: 'with Noun/Verb' },
          { step: '4', icon: 'STORE', title: 'Store as', subtitle: 'Mental Movie' },
        ].map((item, i) => (
          <g key={i} filter="url(#sr-shadow)">
            <rect x={i * 185} y="0" width="170" height="100" rx="12" fill="url(#sr-grad)" />
            <circle cx={i * 185 + 85} cy="-10" r="22" fill="#FCD34D" filter="url(#sr-glow)" />
            <text x={i * 185 + 85} y="-3" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="10">{item.icon}</text>
            <text x={i * 185 + 85} y="35" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP {item.step}</text>
            <text x={i * 185 + 85} y="60" textAnchor="middle" fill="white" fontSize="12">{item.title}</text>
            <text x={i * 185 + 85} y="78" textAnchor="middle" fill="#BFDBFE" fontSize="12">{item.subtitle}</text>
            {i < 3 && (
              <polygon points={`${(i + 1) * 185 - 15},50 ${(i + 1) * 185 + 5},50 ${(i + 1) * 185 + 5},40 ${(i + 1) * 185 + 20},55 ${(i + 1) * 185 + 5},70 ${(i + 1) * 185 + 5},60 ${(i + 1) * 185 - 15},60`} fill="#3B82F6" />
            )}
          </g>
        ))}
      </g>

      {/* Step 5 - Final */}
      <g transform="translate(550, 200)" filter="url(#sr-shadow)">
        <path d="M-200 -10 Q-150 -10 -150 40 Q-150 90 0 90" stroke="#3B82F6" strokeWidth="3" fill="none" />
        <rect x="-90" y="60" width="180" height="100" rx="12" fill="#16A34A" />
        <circle cx="0" cy="50" r="22" fill="#FCD34D" filter="url(#sr-glow)" />
        <text x="0" y="57" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="10">TEST</text>
        <text x="0" y="95" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 5</text>
        <text x="0" y="120" textAnchor="middle" fill="white" fontSize="12">Test: Can you replay</text>
        <text x="0" y="138" textAnchor="middle" fill="#D1FAE5" fontSize="12">the whole movie?</text>
      </g>

      {/* Key Principles Box */}
      <g filter="url(#sr-shadow)">
        <rect x="30" y="350" width="740" height="150" rx="12" fill="white" fillOpacity="0.95" stroke="#3B82F6" strokeWidth="2" />
        <rect x="30" y="350" width="740" height="35" rx="12" fill="url(#sr-header)" />
        <text x="400" y="375" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" letterSpacing="0.5">KEY PRINCIPLES</text>
        <text x="50" y="410" fill="#374151" fontSize="12">Stories are FURNITURE — every scene stored adds capacity</text>
        <text x="50" y="432" fill="#374151" fontSize="12">Store BEFORE you interpret — collect first, analyze later</text>
        <text x="50" y="454" fill="#374151" fontSize="12">Use CONCRETE nouns (Altar, River) not abstractions</text>
        <text x="430" y="410" fill="#374151" fontSize="12">More furniture = exponentially more connections</text>
        <text x="430" y="432" fill="#374151" fontSize="12">If you can SEE it, you OWN it</text>
        {/* Divider line between columns */}
        <line x1="415" y1="395" x2="415" y2="470" stroke="#CBD5E1" strokeWidth="1" />
      </g>
    </svg>
  );
}

// Story Room Concept Infographic
export function StoryRoomConcept() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sr2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <filter id="sr2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#sr2-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E40AF" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        What is a "Scene"?
      </text>

      {/* Scene Concept Circle */}
      <circle cx="150" cy="160" r="80" fill="#3B82F6" opacity="0.9" />
      <text x="150" y="145" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18">SCENE</text>
      <text x="150" y="170" textAnchor="middle" fill="white" fontSize="12">= A Vivid Moment</text>
      <text x="150" y="188" textAnchor="middle" fill="white" fontSize="12">You Can Store</text>

      {/* Film strip visualization */}
      <g transform="translate(280, 100)" filter="url(#sr2-shadow)">
        <rect x="0" y="0" width="480" height="120" fill="#1F2937" rx="8" />
        {/* Sprocket holes */}
        {[30, 110, 190, 270, 350, 430].map((x, i) => (
          <React.Fragment key={i}>
            <rect x={x} y="8" width="20" height="12" rx="2" fill="#374151" />
            <rect x={x} y="100" width="20" height="12" rx="2" fill="#374151" />
          </React.Fragment>
        ))}
        {/* Film frames */}
        {['BOOK', 'COAT', 'PIT', 'CAMEL', 'LOCK', 'CROWN'].map((label, i) => (
          <g key={i}>
            <rect x={20 + i * 80} y="25" width="60" height="70" fill="#FBBF24" rx="4" />
            <text x={50 + i * 80} y="65" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="10">{label}</text>
          </g>
        ))}
        {/* Arrows */}
        {[70, 150, 230, 310, 390].map((x, i) => (
          <text key={i} x={x + 10} y="65" fill="white" fontSize="20">→</text>
        ))}
      </g>

      {/* Labels below film strip */}
      <g transform="translate(300, 235)">
        {['Read', 'Coat', 'Pit', 'Caravan', 'Prison', 'Palace'].map((label, i) => (
          <text key={label} x={i * 80} y="0" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="500">
            {label}
          </text>
        ))}
      </g>

      {/* Good vs Bad Examples */}
      <g transform="translate(50, 280)" filter="url(#sr2-shadow)">
        <rect x="0" y="0" width="330" height="150" rx="12" fill="#D1FAE5" fillOpacity="0.9" stroke="#16A34A" strokeWidth="2" />
        <text x="165" y="30" textAnchor="middle" fill="#166534" fontWeight="bold" fontSize="16">Good Scene Names</text>
        <text x="20" y="60" fill="#166534" fontSize="13">"Coat" — concrete, visual, storable</text>
        <text x="20" y="85" fill="#166534" fontSize="13">"Pit" — specific location you can see</text>
        <text x="20" y="110" fill="#166534" fontSize="13">"Waters Part" — vivid action moment</text>
        <text x="20" y="135" fill="#166534" fontSize="13">"Head Severed" — unforgettable image</text>
      </g>

      <g transform="translate(420, 280)" filter="url(#sr2-shadow)">
        <rect x="0" y="0" width="330" height="150" rx="12" fill="#FEE2E2" fillOpacity="0.9" stroke="#DC2626" strokeWidth="2" />
        <text x="165" y="30" textAnchor="middle" fill="#991B1B" fontWeight="bold" fontSize="16">Bad Scene Names</text>
        <text x="20" y="60" fill="#991B1B" fontSize="13">"Joseph's prideful dream" — too wordy</text>
        <text x="20" y="85" fill="#991B1B" fontSize="13">"The crisis deepens" — abstract</text>
        <text x="20" y="110" fill="#991B1B" fontSize="13">"God shows His grace" — interpretive</text>
        <text x="20" y="135" fill="#991B1B" fontSize="13">Full sentences — defeats purpose</text>
      </g>
    </svg>
  );
}

// Story Room Example Illustration
export function StoryRoomExample() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sr3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="sr3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="sr3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="sr3-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#sr3-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E40AF" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Genesis 37 (Joseph's Descent)
      </text>

      {/* Beat Timeline */}
      <line x1="60" y1="140" x2="740" y2="140" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />

      {/* Beats */}
      {[
        { x: 80, icon: 'DREAM', label: 'DREAM', ref: 'v. 5-11' },
        { x: 190, icon: 'COAT', label: 'COAT', ref: 'v. 3-4' },
        { x: 300, icon: 'PIT', label: 'PIT', ref: 'v. 23-24' },
        { x: 410, icon: 'CAMEL', label: 'CARAVAN', ref: 'v. 25-28' },
        { x: 520, icon: 'EGYPT', label: 'EGYPT', ref: 'v. 36' },
        { x: 630, icon: 'HOUSE', label: 'POTIPHAR', ref: 'v. 36', color: '#16A34A' },
      ].map((beat, i) => (
        <g key={i} transform={`translate(${beat.x}, 80)`}>
          <circle cx="0" cy="60" r="35" fill={beat.color || '#3B82F6'} filter="url(#sr3-glow)" />
          <text x="0" y="68" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{beat.icon}</text>
          <text x="0" y="120" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">{beat.label}</text>
          <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">{beat.ref}</text>
          {i < 5 && <text x="50" y="65" fill="#3B82F6" fontSize="24" fontWeight="bold">→</text>}
        </g>
      ))}

      {/* Arc indicator */}
      <path d="M100 200 Q400 280 650 200" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8,4" />
      <text x="400" y="260" textAnchor="middle" fill="#B45309" fontSize="14" fontWeight="bold">
        The "Descent Arc" — From favorite son to slave
      </text>

      {/* Plot Summary Box */}
      <g filter="url(#sr3-shadow)">
        <rect x="50" y="300" width="700" height="80" rx="12" fill="white" fillOpacity="0.95" stroke="#3B82F6" strokeWidth="2" />
        <text x="400" y="330" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="16">
          One-Line Plot Summary:
        </text>
        <text x="400" y="355" textAnchor="middle" fill="#374151" fontSize="12">
          "A favored son's dreams provoke brothers to violence, sending him from pit to slavery—
        </text>
        <text x="400" y="373" textAnchor="middle" fill="#374151" fontSize="12">
          but divine providence positions him for future exaltation."
        </text>
      </g>

      {/* Deliverable Box */}
      <g filter="url(#sr3-shadow)">
        <rect x="50" y="400" width="700" height="80" rx="12" fill="#FEF3C7" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="430" textAnchor="middle" fill="#92400E" fontWeight="bold" fontSize="16">
          Deliverable: Scene Sequence + Summary
        </text>
        <text x="400" y="455" textAnchor="middle" fill="#78350F" fontSize="14">
          Dream → Coat → Pit → Caravan → Egypt → Potiphar
        </text>
        <text x="400" y="475" textAnchor="middle" fill="#78350F" fontSize="12" fontStyle="italic">
          (6 scenes stored — the complete descent arc)
        </text>
      </g>
    </svg>
  );
}

export default {
  StoryRoomFlowchart,
  StoryRoomConcept,
  StoryRoomExample
};
