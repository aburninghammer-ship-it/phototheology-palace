import React from 'react';

// Speed Room Method Flowchart - Rapid Recall Training
export function SpeedRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="speed-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18181B" />
          <stop offset="50%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <linearGradient id="speed-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="speed-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="speed-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
        </filter>
        <filter id="speed-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#speed-bg)" rx="16" />

      {/* Title with speed effect */}
      <text x="400" y="35" textAnchor="middle" fill="#FBBF24" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Speed Room: Rapid Recall Under Pressure
      </text>
      <text x="400" y="55" textAnchor="middle" fill="#FCD34D" fontSize="11">
        From theoretical knowledge to usable fluency
      </text>

      {/* Stopwatch visual */}
      <g transform="translate(350, 80)">
        <circle cx="50" cy="50" r="45" fill="#27272A" stroke="url(#speed-grad)" strokeWidth="4" />
        <circle cx="50" cy="50" r="35" fill="#18181B" />
        <text x="50" y="40" textAnchor="middle" fill="#FBBF24" fontSize="24" fontWeight="bold">⏱️</text>
        <text x="50" y="65" textAnchor="middle" fill="#FCD34D" fontSize="12">TIMED</text>
        <line x1="50" y1="15" x2="50" y2="5" stroke="#F97316" strokeWidth="2" />
      </g>

      {/* Sprint Types - 6 boxes */}
      <text x="400" y="165" textAnchor="middle" fill="#A1A1AA" fontSize="14" fontWeight="bold">
        🏃 SPRINT TYPES:
      </text>

      {/* Row 1 */}
      <g transform="translate(50, 180)">
        <rect x="0" y="0" width="220" height="65" rx="8" fill="#DC2626" />
        <text x="110" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">CHRIST-LINK SPRINT</text>
        <text x="110" y="40" textAnchor="middle" fill="#FECACA" fontSize="9">"10 Christ-connections in</text>
        <text x="110" y="52" textAnchor="middle" fill="#FECACA" fontSize="9">Genesis in 3 minutes"</text>
      </g>

      <g transform="translate(290, 180)">
        <rect x="0" y="0" width="220" height="65" rx="8" fill="#EA580C" />
        <text x="110" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">VERSE LOCATION SPRINT</text>
        <text x="110" y="40" textAnchor="middle" fill="#FED7AA" fontSize="9">"Where is Armor of God?"</text>
        <text x="110" y="52" textAnchor="middle" fill="#FED7AA" fontSize="9">→ "Ephesians 6" (5 sec)</text>
      </g>

      <g transform="translate(530, 180)">
        <rect x="0" y="0" width="220" height="65" rx="8" fill="#F59E0B" />
        <text x="110" y="22" textAnchor="middle" fill="#1C1917" fontSize="11" fontWeight="bold">TYPOLOGY SPRINT</text>
        <text x="110" y="40" textAnchor="middle" fill="#451A03" fontSize="9">"5 Passover → Christ</text>
        <text x="110" y="52" textAnchor="middle" fill="#451A03" fontSize="9">parallels in 2 minutes"</text>
      </g>

      {/* Row 2 */}
      <g transform="translate(50, 255)">
        <rect x="0" y="0" width="220" height="65" rx="8" fill="#22C55E" />
        <text x="110" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">TIMELINE SPRINT</text>
        <text x="110" y="40" textAnchor="middle" fill="#BBF7D0" fontSize="9">"Order these 10 OT events"</text>
        <text x="110" y="52" textAnchor="middle" fill="#BBF7D0" fontSize="9">in 90 seconds</text>
      </g>

      <g transform="translate(290, 255)">
        <rect x="0" y="0" width="220" height="65" rx="8" fill="#3B82F6" />
        <text x="110" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">DANIEL MACRO SPRINT</text>
        <text x="110" y="40" textAnchor="middle" fill="#BFDBFE" fontSize="9">"Recite Dan 2-7 kingdoms"</text>
        <text x="110" y="52" textAnchor="middle" fill="#BFDBFE" fontSize="9">in 60 seconds</text>
      </g>

      <g transform="translate(530, 255)">
        <rect x="0" y="0" width="220" height="65" rx="8" fill="#8B5CF6" />
        <text x="110" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">"I AM" SPRINT</text>
        <text x="110" y="40" textAnchor="middle" fill="#DDD6FE" fontSize="9">"Name all 7 'I AM' statements</text>
        <text x="110" y="52" textAnchor="middle" fill="#DDD6FE" fontSize="9">in John in 30 seconds"</text>
      </g>

      {/* Methodology */}
      <rect x="50" y="335" width="700" height="85" rx="10" fill="#27272A" />
      <text x="400" y="360" textAnchor="middle" fill="#FBBF24" fontSize="14" fontWeight="bold">
        📋 SPRINT METHODOLOGY
      </text>

      <g transform="translate(80, 375)">
        <circle cx="0" cy="8" r="10" fill="#DC2626" />
        <text x="0" y="12" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>
        <text x="25" y="8" fill="#FDE68A" fontSize="9">Choose sprint</text>
        <text x="25" y="20" fill="#A1A1AA" fontSize="8">type</text>
      </g>

      <g transform="translate(200, 375)">
        <circle cx="0" cy="8" r="10" fill="#EA580C" />
        <text x="0" y="12" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">2</text>
        <text x="25" y="8" fill="#FDE68A" fontSize="9">Set timer</text>
        <text x="25" y="20" fill="#A1A1AA" fontSize="8">(start generous)</text>
      </g>

      <g transform="translate(335, 375)">
        <circle cx="0" cy="8" r="10" fill="#F59E0B" />
        <text x="0" y="12" textAnchor="middle" fill="#1C1917" fontSize="8" fontWeight="bold">3</text>
        <text x="25" y="8" fill="#FDE68A" fontSize="9">Execute sprint</text>
        <text x="25" y="20" fill="#A1A1AA" fontSize="8">(no looking up)</text>
      </g>

      <g transform="translate(475, 375)">
        <circle cx="0" cy="8" r="10" fill="#22C55E" />
        <text x="0" y="12" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">4</text>
        <text x="25" y="8" fill="#FDE68A" fontSize="9">Score yourself</text>
        <text x="25" y="20" fill="#A1A1AA" fontSize="8">(accuracy + time)</text>
      </g>

      <g transform="translate(610, 375)">
        <circle cx="0" cy="8" r="10" fill="#3B82F6" />
        <text x="0" y="12" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">5</text>
        <text x="25" y="8" fill="#FDE68A" fontSize="9">Identify weak spots</text>
        <text x="25" y="20" fill="#A1A1AA" fontSize="8">→ drill more</text>
      </g>

      {/* Output */}
      <rect x="50" y="430" width="700" height="30" rx="6" fill="url(#speed-grad)" />
      <text x="400" y="450" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        📝 OUTPUT: Sprint Sheet — Sprint type → Target → Attempt → Score (accuracy + time) → Weak spots
      </text>

      {/* Key principle */}
      <rect x="50" y="468" width="700" height="25" rx="6" fill="#18181B" stroke="#FBBF24" strokeWidth="1" />
      <text x="400" y="485" textAnchor="middle" fill="#FCD34D" fontSize="10">
        🎯 GOAL: Speed + Accuracy — Without accuracy, speed is useless
      </text>
    </svg>
  );
}

// Speed Room Concept - Knowledge Fluency Visual
export function SpeedRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#18181B" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="bold">
        ⚡ From Knowing to DEPLOYING: The Fluency Gap
      </text>

      {/* Two scenarios */}
      {/* Scenario 1: Without Speed Room */}
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#7F1D1D" />
        <text x="160" y="28" textAnchor="middle" fill="#FCA5A5" fontSize="14" fontWeight="bold">
          ❌ WITHOUT SPEED ROOM
        </text>
        <line x1="30" y1="42" x2="290" y2="42" stroke="#B91C1C" strokeWidth="1" />

        <text x="160" y="65" textAnchor="middle" fill="white" fontSize="10" fontStyle="italic">
          "Where is Christ in Jonah?"
        </text>

        <text x="30" y="90" fill="#FEE2E2" fontSize="9">• Long pause...</text>
        <text x="30" y="108" fill="#FEE2E2" fontSize="9">• "I know I studied this..."</text>
        <text x="30" y="126" fill="#FEE2E2" fontSize="9">• Fumbling for notes</text>
        <text x="30" y="144" fill="#FEE2E2" fontSize="9">• Awkward silence</text>
        <text x="30" y="162" fill="#FECACA" fontSize="9" fontWeight="bold">Result: Knowledge STUCK in brain</text>
      </g>

      {/* Arrow */}
      <path d="M385 150 L415 150" stroke="#F97316" strokeWidth="4" markerEnd="url(#spd-arrow)" />
      <defs>
        <marker id="spd-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0, 12 4, 0 8" fill="#F97316" />
        </marker>
      </defs>

      {/* Scenario 2: With Speed Room */}
      <g transform="translate(430, 60)">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#166534" />
        <text x="160" y="28" textAnchor="middle" fill="#86EFAC" fontSize="14" fontWeight="bold">
          ✓ WITH SPEED ROOM TRAINING
        </text>
        <line x1="30" y1="42" x2="290" y2="42" stroke="#22C55E" strokeWidth="1" />

        <text x="160" y="65" textAnchor="middle" fill="white" fontSize="10" fontStyle="italic">
          "Where is Christ in Jonah?"
        </text>

        <text x="30" y="90" fill="#DCFCE7" fontSize="9">• "Three days in the fish—</text>
        <text x="30" y="108" fill="#DCFCE7" fontSize="9">   Matt 12:40, Christ's burial!"</text>
        <text x="30" y="126" fill="#DCFCE7" fontSize="9">• Instant recall, confident delivery</text>
        <text x="30" y="144" fill="#DCFCE7" fontSize="9">• Others impressed and edified</text>
        <text x="30" y="162" fill="#BBF7D0" fontSize="9" fontWeight="bold">Result: Knowledge DEPLOYED instantly</text>
      </g>

      {/* Jazz musician analogy */}
      <rect x="100" y="255" width="600" height="55" rx="10" fill="#27272A" stroke="#FBBF24" strokeWidth="1" />
      <text x="400" y="280" textAnchor="middle" fill="#FCD34D" fontSize="13" fontWeight="bold">
        🎵 LIKE A JAZZ MUSICIAN...
      </text>
      <text x="400" y="300" textAnchor="middle" fill="#E5E5E5" fontSize="10">
        Practice scales SLOWLY → Then play them at SPEED until instinctive → Performance flows naturally
      </text>

      {/* Real-world scenarios */}
      <text x="400" y="335" textAnchor="middle" fill="#A1A1AA" fontSize="12" fontWeight="bold">
        🌍 REAL-WORLD APPLICATIONS:
      </text>

      <g transform="translate(80, 350)">
        <rect x="0" y="0" width="150" height="60" rx="6" fill="#3B82F6" />
        <text x="75" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">TEACHING</text>
        <text x="75" y="38" textAnchor="middle" fill="#BFDBFE" fontSize="8">Answer questions</text>
        <text x="75" y="50" textAnchor="middle" fill="#BFDBFE" fontSize="8">on the spot</text>
      </g>

      <g transform="translate(245, 350)">
        <rect x="0" y="0" width="150" height="60" rx="6" fill="#8B5CF6" />
        <text x="75" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">EVANGELISM</text>
        <text x="75" y="38" textAnchor="middle" fill="#DDD6FE" fontSize="8">Quick Scripture</text>
        <text x="75" y="50" textAnchor="middle" fill="#DDD6FE" fontSize="8">recall for seekers</text>
      </g>

      <g transform="translate(410, 350)">
        <rect x="0" y="0" width="150" height="60" rx="6" fill="#EC4899" />
        <text x="75" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">COUNSELING</text>
        <text x="75" y="38" textAnchor="middle" fill="#FBCFE8" fontSize="8">Right verse at</text>
        <text x="75" y="50" textAnchor="middle" fill="#FBCFE8" fontSize="8">the right moment</text>
      </g>

      <g transform="translate(575, 350)">
        <rect x="0" y="0" width="150" height="60" rx="6" fill="#F97316" />
        <text x="75" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">DEBATE</text>
        <text x="75" y="38" textAnchor="middle" fill="#FED7AA" fontSize="8">Defend faith with</text>
        <text x="75" y="50" textAnchor="middle" fill="#FED7AA" fontSize="8">precision and speed</text>
      </g>

      {/* Progression visual */}
      <rect x="100" y="425" width="600" height="60" rx="10" fill="#18181B" stroke="#22C55E" strokeWidth="1" />
      <text x="400" y="448" textAnchor="middle" fill="#86EFAC" fontSize="12" fontWeight="bold">
        📈 PROGRESSION: Reduce time limits as you improve
      </text>
      <text x="200" y="472" textAnchor="middle" fill="#D1D5DB" fontSize="10">5 min → 3 min → 2 min → 1 min → 30 sec</text>
      <text x="550" y="472" textAnchor="middle" fill="#22C55E" fontSize="10" fontWeight="bold">= FLUENCY</text>
    </svg>
  );
}

// Speed Room Example - Daniel Kingdom Sprint
export function SpeedRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#18181B" rx="16" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="bold">
        ⚡ Sprint Example: Daniel's Four Kingdoms (60 Seconds)
      </text>

      {/* Stopwatch */}
      <g transform="translate(680, 50)">
        <circle cx="35" cy="35" r="30" fill="#27272A" stroke="#F97316" strokeWidth="3" />
        <text x="35" y="42" textAnchor="middle" fill="#FBBF24" fontSize="16" fontWeight="bold">60s</text>
      </g>

      {/* The sprint attempt */}
      <rect x="50" y="55" width="600" height="150" rx="12" fill="#27272A" stroke="#FBBF24" strokeWidth="2" />
      <text x="350" y="78" textAnchor="middle" fill="#FCD34D" fontSize="13" fontWeight="bold">
        📝 SPRINT ATTEMPT:
      </text>

      <text x="70" y="105" fill="white" fontSize="11">
        <tspan fontWeight="bold" fill="#F97316">Babylon</tspan> = gold head / lion
      </text>
      <text x="70" y="125" fill="white" fontSize="11">
        <tspan fontWeight="bold" fill="#EAB308">Medo-Persia</tspan> = silver chest / bear
      </text>
      <text x="70" y="145" fill="white" fontSize="11">
        <tspan fontWeight="bold" fill="#22C55E">Greece</tspan> = bronze belly / leopard with 4 wings
      </text>
      <text x="70" y="165" fill="white" fontSize="11">
        <tspan fontWeight="bold" fill="#3B82F6">Rome</tspan> = iron legs / terrible beast with 10 horns
      </text>
      <text x="70" y="185" fill="white" fontSize="11">
        <tspan fontWeight="bold" fill="#8B5CF6">Christ's Kingdom</tspan> = stone / Son of Man receives dominion
      </text>

      {/* Score card */}
      <rect x="50" y="220" width="320" height="120" rx="10" fill="#166534" />
      <text x="210" y="245" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        ✓ SCORE CARD
      </text>
      <text x="70" y="275" fill="#DCFCE7" fontSize="11">Accuracy: 100% ✓</text>
      <text x="70" y="295" fill="#DCFCE7" fontSize="11">Time: 52 seconds ✓</text>
      <text x="70" y="315" fill="#BBF7D0" fontSize="11" fontWeight="bold">Result: PASS</text>
      <text x="70" y="330" fill="#86EFAC" fontSize="9">Ready to teach anytime!</text>

      {/* Second example: I AM statements */}
      <rect x="390" y="220" width="360" height="120" rx="10" fill="#7F1D1D" />
      <text x="570" y="245" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        ❌ EXAMPLE: PARTIAL PASS
      </text>
      <text x="410" y="270" fill="#FEE2E2" fontSize="10" fontWeight="bold">Sprint: 7 "I AM" statements (30 sec)</text>
      <text x="410" y="290" fill="#FEE2E2" fontSize="10">Got 5/7 in 28 seconds</text>
      <text x="410" y="310" fill="#FECACA" fontSize="10">Missed: "Way, Truth, Life" + "True Vine"</text>
      <text x="410" y="330" fill="#EF4444" fontSize="10" fontWeight="bold">→ Weak spot: John 14-15 needs drilling</text>

      {/* Sprint sheet template */}
      <rect x="50" y="355" width="700" height="100" rx="10" fill="#27272A" stroke="#FBBF24" strokeWidth="1" />
      <text x="400" y="378" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="bold">
        📋 SPRINT SHEET TEMPLATE
      </text>

      <text x="70" y="405" fill="#FDE68A" fontSize="10" fontWeight="bold">Sprint Type:</text>
      <text x="170" y="405" fill="#D1D5DB" fontSize="10">[Daniel Kingdoms / I AM / Christ-Links / etc.]</text>

      <text x="70" y="425" fill="#FDE68A" fontSize="10" fontWeight="bold">Target:</text>
      <text x="130" y="425" fill="#D1D5DB" fontSize="10">[X answers in Y time]</text>

      <text x="320" y="425" fill="#FDE68A" fontSize="10" fontWeight="bold">Score:</text>
      <text x="375" y="425" fill="#D1D5DB" fontSize="10">[Accuracy % + Time]</text>

      <text x="520" y="425" fill="#FDE68A" fontSize="10" fontWeight="bold">Weak Spots:</text>
      <text x="610" y="425" fill="#D1D5DB" fontSize="10">[Areas to drill]</text>

      {/* Key principles */}
      <rect x="50" y="470" width="700" height="65" rx="10" fill="#18181B" stroke="#F97316" strokeWidth="1" />
      <text x="400" y="495" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="bold">
        🎯 KEY PRINCIPLES
      </text>
      <text x="180" y="520" textAnchor="middle" fill="#FDE68A" fontSize="9">Speed WITHOUT accuracy = useless</text>
      <text x="400" y="520" textAnchor="middle" fill="#FDE68A" fontSize="9">Repetition builds fluency</text>
      <text x="620" y="520" textAnchor="middle" fill="#FDE68A" fontSize="9">Sprints expose gaps</text>
    </svg>
  );
}
