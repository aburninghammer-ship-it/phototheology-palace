import React from 'react';

// Mathematics Room Method Flowchart - Six Time Prophecies
export function MathematicsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="math-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="50%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="math-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="math-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <filter id="math-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="math-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="550" fill="url(#math-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#1E3A8A" fontSize="20" fontWeight="bold" letterSpacing="0.5">
        Mathematics Room: Six Time-Prophecy Structures
      </text>
      <text x="400" y="55" textAnchor="middle" fill="#3730A3" fontSize="11">
        God works through TIME itself—divine timestamps revealing sovereignty over history
      </text>

      {/* Six Time Prophecies Grid - 2x3 */}
      {/* Row 1 */}
      {/* @120 */}
      <g transform="translate(50, 75)">
        <rect x="0" y="0" width="230" height="130" rx="10" fill="#F87171" />
        <rect x="8" y="8" width="214" height="114" rx="6" fill="#FEF2F2" />
        <text x="115" y="32" textAnchor="middle" fill="#B91C1C" fontSize="18" fontWeight="bold">@120</text>
        <text x="115" y="52" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="bold">PROBATION BEFORE JUDGMENT</text>
        <line x1="30" y1="62" x2="200" y2="62" stroke="#FECACA" strokeWidth="1" />
        <text x="115" y="80" textAnchor="middle" fill="#7F1D1D" fontSize="10">Genesis 6:3</text>
        <text x="115" y="95" textAnchor="middle" fill="#991B1B" fontSize="9">"My Spirit shall not strive</text>
        <text x="115" y="108" textAnchor="middle" fill="#991B1B" fontSize="9">with man forever"</text>
        <text x="115" y="120" textAnchor="middle" fill="#B91C1C" fontSize="8" fontStyle="italic">Theme: Mercy limit</text>
      </g>

      {/* @400 */}
      <g transform="translate(285, 75)">
        <rect x="0" y="0" width="230" height="130" rx="10" fill="#FB923C" />
        <rect x="8" y="8" width="214" height="114" rx="6" fill="#FFF7ED" />
        <text x="115" y="32" textAnchor="middle" fill="#C2410C" fontSize="18" fontWeight="bold">@400</text>
        <text x="115" y="52" textAnchor="middle" fill="#EA580C" fontSize="11" fontWeight="bold">AFFLICTION → DELIVERANCE</text>
        <line x1="30" y1="62" x2="200" y2="62" stroke="#FED7AA" strokeWidth="1" />
        <text x="115" y="80" textAnchor="middle" fill="#9A3412" fontSize="10">Genesis 15:13</text>
        <text x="115" y="95" textAnchor="middle" fill="#C2410C" fontSize="9">"Your offspring will be</text>
        <text x="115" y="108" textAnchor="middle" fill="#C2410C" fontSize="9">strangers 400 years"</text>
        <text x="115" y="120" textAnchor="middle" fill="#EA580C" fontSize="8" fontStyle="italic">Theme: Covenant oppression</text>
      </g>

      {/* @70y */}
      <g transform="translate(520, 75)">
        <rect x="0" y="0" width="230" height="130" rx="10" fill="#FBBF24" />
        <rect x="8" y="8" width="214" height="114" rx="6" fill="#FEFCE8" />
        <text x="115" y="32" textAnchor="middle" fill="#A16207" fontSize="18" fontWeight="bold">@70y</text>
        <text x="115" y="52" textAnchor="middle" fill="#CA8A04" fontSize="11" fontWeight="bold">CAPTIVITY → RESTORATION</text>
        <line x1="30" y1="62" x2="200" y2="62" stroke="#FEF08A" strokeWidth="1" />
        <text x="115" y="80" textAnchor="middle" fill="#854D0E" fontSize="10">Jeremiah 25:11-12</text>
        <text x="115" y="95" textAnchor="middle" fill="#A16207" fontSize="9">"These nations shall serve</text>
        <text x="115" y="108" textAnchor="middle" fill="#A16207" fontSize="9">Babylon 70 years"</text>
        <text x="115" y="120" textAnchor="middle" fill="#CA8A04" fontSize="8" fontStyle="italic">Theme: Discipline</text>
      </g>

      {/* Row 2 */}
      {/* @490 */}
      <g transform="translate(50, 220)">
        <rect x="0" y="0" width="230" height="130" rx="10" fill="#22C55E" />
        <rect x="8" y="8" width="214" height="114" rx="6" fill="#F0FDF4" />
        <text x="115" y="32" textAnchor="middle" fill="#166534" fontSize="18" fontWeight="bold">@490</text>
        <text x="115" y="52" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="bold">MESSIAH & COVENANT</text>
        <line x1="30" y1="62" x2="200" y2="62" stroke="#BBF7D0" strokeWidth="1" />
        <text x="115" y="80" textAnchor="middle" fill="#14532D" fontSize="10">Daniel 9:24-27</text>
        <text x="115" y="95" textAnchor="middle" fill="#166534" fontSize="9">"70 weeks are decreed</text>
        <text x="115" y="108" textAnchor="middle" fill="#166534" fontSize="9">for your people"</text>
        <text x="115" y="120" textAnchor="middle" fill="#15803D" fontSize="8" fontStyle="italic">Theme: Redemption</text>
      </g>

      {/* @1260 */}
      <g transform="translate(285, 220)">
        <rect x="0" y="0" width="230" height="130" rx="10" fill="#3B82F6" />
        <rect x="8" y="8" width="214" height="114" rx="6" fill="#EFF6FF" />
        <text x="115" y="32" textAnchor="middle" fill="#1E40AF" fontSize="18" fontWeight="bold">@1260</text>
        <text x="115" y="52" textAnchor="middle" fill="#2563EB" fontSize="11" fontWeight="bold">SUPPRESSED TRUTH</text>
        <line x1="30" y1="62" x2="200" y2="62" stroke="#BFDBFE" strokeWidth="1" />
        <text x="115" y="80" textAnchor="middle" fill="#1E3A8A" fontSize="10">Daniel 7:25, Rev 11-13</text>
        <text x="115" y="95" textAnchor="middle" fill="#1E40AF" fontSize="9">"Time, times, and half</text>
        <text x="115" y="108" textAnchor="middle" fill="#1E40AF" fontSize="9">a time" (3.5 years)</text>
        <text x="115" y="120" textAnchor="middle" fill="#2563EB" fontSize="8" fontStyle="italic">Theme: Persecution</text>
      </g>

      {/* @2300 */}
      <g transform="translate(520, 220)">
        <rect x="0" y="0" width="230" height="130" rx="10" fill="#8B5CF6" />
        <rect x="8" y="8" width="214" height="114" rx="6" fill="#FAF5FF" />
        <text x="115" y="32" textAnchor="middle" fill="#6D28D9" fontSize="18" fontWeight="bold">@2300</text>
        <text x="115" y="52" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="bold">JUDGMENT & CLEANSING</text>
        <line x1="30" y1="62" x2="200" y2="62" stroke="#DDD6FE" strokeWidth="1" />
        <text x="115" y="80" textAnchor="middle" fill="#4C1D95" fontSize="10">Daniel 8:14</text>
        <text x="115" y="95" textAnchor="middle" fill="#6D28D9" fontSize="9">"Unto 2300 days, then</text>
        <text x="115" y="108" textAnchor="middle" fill="#6D28D9" fontSize="9">sanctuary cleansed"</text>
        <text x="115" y="120" textAnchor="middle" fill="#7C3AED" fontSize="8" fontStyle="italic">Theme: Final resolution</text>
      </g>

      {/* Practice Modes */}
      <rect x="50" y="365" width="700" height="75" rx="10" fill="url(#math-grad)" />
      <text x="400" y="390" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        📊 PRACTICE MODES
      </text>
      <text x="200" y="415" textAnchor="middle" fill="#93C5FD" fontSize="11">🟢 BEGINNER</text>
      <text x="200" y="430" textAnchor="middle" fill="#BFDBFE" fontSize="9">One-to-one mapping</text>
      <text x="400" y="415" textAnchor="middle" fill="#FDE68A" fontSize="11">🟡 INTERMEDIATE</text>
      <text x="400" y="430" textAnchor="middle" fill="#FEF9C3" fontSize="9">Multi-mapping</text>
      <text x="600" y="415" textAnchor="middle" fill="#FECACA" fontSize="11">🔴 MASTER</text>
      <text x="600" y="430" textAnchor="middle" fill="#FEE2E2" fontSize="9">All six (if defensible)</text>

      {/* Guardrails */}
      <rect x="50" y="455" width="700" height="80" rx="10" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" />
      <text x="400" y="478" textAnchor="middle" fill="#B91C1C" fontSize="12" fontWeight="bold">
        ⚠️ ANTI-HALLUCINATION GUARDRAILS
      </text>
      <text x="150" y="500" fill="#991B1B" fontSize="9">• NEVER invent new time periods</text>
      <text x="400" y="500" fill="#991B1B" fontSize="9">• NEVER assign dates without warrant</text>
      <text x="625" y="500" fill="#991B1B" fontSize="9">• NEVER collapse symbolic/literal</text>
      <text x="400" y="520" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">
        Every mapping requires: WHY + BOUNDARY + LIMITATION
      </text>
    </svg>
  );
}

// Mathematics Room Concept - Timeline Visual
export function MathematicsRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#EFF6FF" rx="16" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#1E3A8A" fontSize="18" fontWeight="bold">
        ⏳ God's Prophetic Calendar: Timeline Overview
      </text>

      {/* Main timeline */}
      <line x1="50" y1="250" x2="750" y2="250" stroke="#1E3A8A" strokeWidth="4" />

      {/* Era markers */}
      <g transform="translate(100, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">CREATION</text>
      </g>

      <g transform="translate(200, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">FLOOD</text>
        <text x="0" y="45" textAnchor="middle" fill="#3B82F6" fontSize="8">@120</text>
      </g>

      <g transform="translate(300, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">EXODUS</text>
        <text x="0" y="45" textAnchor="middle" fill="#F97316" fontSize="8">@400</text>
      </g>

      <g transform="translate(400, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">EXILE</text>
        <text x="0" y="45" textAnchor="middle" fill="#EAB308" fontSize="8">@70y</text>
      </g>

      <g transform="translate(500, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">MESSIAH</text>
        <text x="0" y="45" textAnchor="middle" fill="#22C55E" fontSize="8">@490</text>
      </g>

      <g transform="translate(600, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">DARK AGES</text>
        <text x="0" y="45" textAnchor="middle" fill="#3B82F6" fontSize="8">@1260</text>
      </g>

      <g transform="translate(700, 250)">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1E3A8A" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">JUDGMENT</text>
        <text x="0" y="45" textAnchor="middle" fill="#8B5CF6" fontSize="8">@2300</text>
      </g>

      {/* Arc spans above timeline */}
      {/* @120 arc */}
      <path d="M100 240 Q150 160 200 240" stroke="#EF4444" strokeWidth="2" fill="none" />
      <text x="150" y="170" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold">120 yrs</text>
      <text x="150" y="185" textAnchor="middle" fill="#DC2626" fontSize="8">Probation</text>

      {/* @400 arc */}
      <path d="M150 235 Q225 100 300 235" stroke="#F97316" strokeWidth="2" fill="none" />
      <text x="225" y="110" textAnchor="middle" fill="#C2410C" fontSize="10" fontWeight="bold">400 yrs</text>
      <text x="225" y="125" textAnchor="middle" fill="#EA580C" fontSize="8">Affliction</text>

      {/* @70y arc */}
      <path d="M350 235 Q375 190 400 235" stroke="#EAB308" strokeWidth="2" fill="none" />
      <text x="375" y="195" textAnchor="middle" fill="#A16207" fontSize="9" fontWeight="bold">70y</text>

      {/* @490 arc */}
      <path d="M400 230 Q450 70 500 230" stroke="#22C55E" strokeWidth="2" fill="none" />
      <text x="450" y="80" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">490 yrs</text>
      <text x="450" y="95" textAnchor="middle" fill="#15803D" fontSize="8">(70 weeks)</text>

      {/* @1260 arc */}
      <path d="M500 225 Q550 55 600 225" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <text x="550" y="60" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">1260 yrs</text>
      <text x="550" y="75" textAnchor="middle" fill="#2563EB" fontSize="8">Persecution</text>

      {/* @2300 arc - longest */}
      <path d="M400 220 Q550 20 700 220" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeDasharray="5,3" />
      <text x="550" y="30" textAnchor="middle" fill="#6D28D9" fontSize="11" fontWeight="bold">2300 yrs</text>
      <text x="550" y="45" textAnchor="middle" fill="#7C3AED" fontSize="8">457 BC → AD 1844</text>

      {/* Key Calculations */}
      <rect x="50" y="300" width="700" height="90" rx="10" fill="white" stroke="#3B82F6" strokeWidth="1" />
      <text x="400" y="325" textAnchor="middle" fill="#1E3A8A" fontSize="14" fontWeight="bold">
        🧮 Key Prophetic Calculations
      </text>

      <text x="200" y="355" textAnchor="middle" fill="#166534" fontSize="10">@490: 457 BC + 483 yrs</text>
      <text x="200" y="372" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold">= AD 27 (Christ's baptism)</text>

      <text x="600" y="355" textAnchor="middle" fill="#6D28D9" fontSize="10">@2300: 457 BC + 2300 yrs</text>
      <text x="600" y="372" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="bold">= AD 1844 (Judgment begins)</text>

      {/* Bottom insight */}
      <rect x="50" y="405" width="700" height="80" rx="10" fill="#1E3A8A" />
      <text x="400" y="430" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        💡 KEY INSIGHT
      </text>
      <text x="400" y="455" textAnchor="middle" fill="#93C5FD" fontSize="11">
        Time prophecies are PATTERNS, not just dates. God marks pivotal moments
      </text>
      <text x="400" y="472" textAnchor="middle" fill="#BFDBFE" fontSize="11">
        with precise timelines revealing His sovereignty over history.
      </text>
    </svg>
  );
}

// Mathematics Room Example - John 3:16 Six-Fold Analysis
export function MathematicsRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#EFF6FF" rx="16" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#1E3A8A" fontSize="18" fontWeight="bold">
        📖 Example: John 3:16 — Six-Fold Time Analysis
      </text>

      {/* Verse Display */}
      <rect x="100" y="50" width="600" height="50" rx="10" fill="#1E3A8A" />
      <text x="400" y="82" textAnchor="middle" fill="white" fontSize="12" fontStyle="italic">
        "For God so loved the world that He gave His only Son, that whoever believes
      </text>
      <text x="400" y="95" textAnchor="middle" fill="white" fontSize="12" fontStyle="italic">
        in Him should not perish but have eternal life."
      </text>

      {/* Six Analysis Boxes */}
      {/* Row 1 */}
      {/* @490 - Primary */}
      <g transform="translate(50, 115)">
        <rect x="0" y="0" width="230" height="95" rx="8" fill="#22C55E" />
        <rect x="4" y="4" width="222" height="87" rx="6" fill="#F0FDF4" />
        <text x="115" y="22" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">@490 (PRIMARY)</text>
        <line x1="20" y1="30" x2="210" y2="30" stroke="#BBF7D0" strokeWidth="1" />
        <text x="115" y="48" textAnchor="middle" fill="#15803D" fontSize="9">Directly Messianic</text>
        <text x="115" y="62" textAnchor="middle" fill="#166534" fontSize="9">"Gave His Son" = covenant confirmation</text>
        <text x="115" y="78" textAnchor="middle" fill="#14532D" fontSize="9" fontStyle="italic">Fulfillment of Daniel 9</text>
      </g>

      {/* @120 */}
      <g transform="translate(285, 115)">
        <rect x="0" y="0" width="230" height="95" rx="8" fill="#EF4444" />
        <rect x="4" y="4" width="222" height="87" rx="6" fill="#FEF2F2" />
        <text x="115" y="22" textAnchor="middle" fill="#B91C1C" fontSize="12" fontWeight="bold">@120</text>
        <line x1="20" y1="30" x2="210" y2="30" stroke="#FECACA" strokeWidth="1" />
        <text x="115" y="48" textAnchor="middle" fill="#DC2626" fontSize="9">Universal probation</text>
        <text x="115" y="62" textAnchor="middle" fill="#B91C1C" fontSize="9">"the world" = love extended</text>
        <text x="115" y="78" textAnchor="middle" fill="#991B1B" fontSize="9" fontStyle="italic">before judgment (mercy window)</text>
      </g>

      {/* @400 */}
      <g transform="translate(520, 115)">
        <rect x="0" y="0" width="230" height="95" rx="8" fill="#F97316" />
        <rect x="4" y="4" width="222" height="87" rx="6" fill="#FFF7ED" />
        <text x="115" y="22" textAnchor="middle" fill="#C2410C" fontSize="12" fontWeight="bold">@400</text>
        <line x1="20" y1="30" x2="210" y2="30" stroke="#FED7AA" strokeWidth="1" />
        <text x="115" y="48" textAnchor="middle" fill="#EA580C" fontSize="9">"Gave His Son" = deliverance</text>
        <text x="115" y="62" textAnchor="middle" fill="#C2410C" fontSize="9">Christ enters humanity's bondage</text>
        <text x="115" y="78" textAnchor="middle" fill="#9A3412" fontSize="9" fontStyle="italic">Exodus logic applied spiritually</text>
      </g>

      {/* Row 2 */}
      {/* @70y */}
      <g transform="translate(50, 220)">
        <rect x="0" y="0" width="230" height="95" rx="8" fill="#EAB308" />
        <rect x="4" y="4" width="222" height="87" rx="6" fill="#FEFCE8" />
        <text x="115" y="22" textAnchor="middle" fill="#A16207" fontSize="12" fontWeight="bold">@70y</text>
        <line x1="20" y1="30" x2="210" y2="30" stroke="#FEF08A" strokeWidth="1" />
        <text x="115" y="48" textAnchor="middle" fill="#CA8A04" fontSize="9">Exile → return theme</text>
        <text x="115" y="62" textAnchor="middle" fill="#A16207" fontSize="9">Humanity alienated → restored</text>
        <text x="115" y="78" textAnchor="middle" fill="#854D0E" fontSize="9" fontStyle="italic">"perish vs life" = captivity language</text>
      </g>

      {/* @1260 */}
      <g transform="translate(285, 220)">
        <rect x="0" y="0" width="230" height="95" rx="8" fill="#3B82F6" />
        <rect x="4" y="4" width="222" height="87" rx="6" fill="#EFF6FF" />
        <text x="115" y="22" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">@1260</text>
        <line x1="20" y1="30" x2="210" y2="30" stroke="#BFDBFE" strokeWidth="1" />
        <text x="115" y="48" textAnchor="middle" fill="#2563EB" fontSize="9">Truth suppressed during</text>
        <text x="115" y="62" textAnchor="middle" fill="#1E40AF" fontSize="9">medieval distortion</text>
        <text x="115" y="78" textAnchor="middle" fill="#1E3A8A" fontSize="9" fontStyle="italic">Salvation by faith eclipsed by works</text>
      </g>

      {/* @2300 */}
      <g transform="translate(520, 220)">
        <rect x="0" y="0" width="230" height="95" rx="8" fill="#8B5CF6" />
        <rect x="4" y="4" width="222" height="87" rx="6" fill="#FAF5FF" />
        <text x="115" y="22" textAnchor="middle" fill="#6D28D9" fontSize="12" fontWeight="bold">@2300</text>
        <line x1="20" y1="30" x2="210" y2="30" stroke="#DDD6FE" strokeWidth="1" />
        <text x="115" y="48" textAnchor="middle" fill="#7C3AED" fontSize="9">"Everlasting life" contrasts</text>
        <text x="115" y="62" textAnchor="middle" fill="#6D28D9" fontSize="9">with final judgment</text>
        <text x="115" y="78" textAnchor="middle" fill="#4C1D95" fontSize="9" fontStyle="italic">Belief vs rejection = separation</text>
      </g>

      {/* Methodology Section */}
      <rect x="50" y="330" width="700" height="100" rx="10" fill="white" stroke="#1E3A8A" strokeWidth="2" />
      <text x="400" y="355" textAnchor="middle" fill="#1E3A8A" fontSize="14" fontWeight="bold">
        📋 METHODOLOGY APPLIED
      </text>

      <text x="70" y="380" fill="#374151" fontSize="10">
        <tspan fontWeight="bold">1. PRIMARY MAPPING:</tspan> @490 — "Gave His Son" directly fulfills Daniel's 70 weeks prophecy
      </text>
      <text x="70" y="398" fill="#374151" fontSize="10">
        <tspan fontWeight="bold">2. SECONDARY MAPPINGS:</tspan> Each time structure illuminates different theological aspects
      </text>
      <text x="70" y="416" fill="#374151" fontSize="10">
        <tspan fontWeight="bold">3. BOUNDARIES:</tspan> @490 is primary; others show thematic connections, not direct fulfillment
      </text>

      {/* Output Format */}
      <rect x="50" y="445" width="700" height="90" rx="10" fill="#1E3A8A" />
      <text x="400" y="470" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
        📝 DELIVERABLE FORMAT
      </text>
      <text x="400" y="495" textAnchor="middle" fill="#93C5FD" fontSize="10">
        MATH tag: Prophecy Code (@120/@400/@70y/@490/@1260/@2300)
      </text>
      <text x="400" y="515" textAnchor="middle" fill="#BFDBFE" fontSize="10">
        → Core Meaning → Textual Connection → Boundary/Limitation → Theological Lesson
      </text>
    </svg>
  );
}
