import React from 'react';

// Fire Room Method Flowchart - Devotional Encounter
export function FireRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fire-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C1917" />
          <stop offset="50%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>
        <linearGradient id="fire-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="fire-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id="fire-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
        </filter>
        <filter id="fire-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#fire-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#FBBF24" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Fire Room: From Head to Heart
      </text>
      <text x="400" y="55" textAnchor="middle" fill="#FCD34D" fontSize="11">
        "Is not my word like fire?" — Jeremiah 23:29
      </text>

      {/* Central Fire */}
      <ellipse cx="400" cy="180" rx="80" ry="100" fill="url(#fire-grad)" filter="url(#fire-glow)" />
      <text x="400" y="165" textAnchor="middle" fill="#1C1917" fontSize="14" fontWeight="bold">ENCOUNTER</text>
      <text x="400" y="185" textAnchor="middle" fill="#1C1917" fontSize="14" fontWeight="bold">GOD</text>
      <text x="400" y="210" textAnchor="middle" fill="#451A03" fontSize="10">through His Word</text>

      {/* Two Paths: Wound or Hope */}
      {/* Wound Path - Left */}
      <g transform="translate(80, 120)">
        <rect x="0" y="0" width="180" height="160" rx="12" fill="#7F1D1D" />
        <text x="90" y="30" textAnchor="middle" fill="#FECACA" fontSize="16" fontWeight="bold">🩹 WOUND</text>
        <text x="90" y="50" textAnchor="middle" fill="#FCA5A5" fontSize="11">(Conviction)</text>
        <line x1="20" y1="62" x2="160" y2="62" stroke="#B91C1C" strokeWidth="1" />

        <text x="90" y="82" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Ask:</text>
        <text x="90" y="98" textAnchor="middle" fill="#FEE2E2" fontSize="9">"What sin does this expose?"</text>
        <text x="90" y="112" textAnchor="middle" fill="#FEE2E2" fontSize="9">"What idolatry is revealed?"</text>
        <text x="90" y="126" textAnchor="middle" fill="#FEE2E2" fontSize="9">"What hardness of heart?"</text>

        <rect x="20" y="135" width="140" height="20" rx="4" fill="#B91C1C" />
        <text x="90" y="149" textAnchor="middle" fill="white" fontSize="9">CONFESS → REPENT</text>
      </g>

      {/* Hope Path - Right */}
      <g transform="translate(540, 120)">
        <rect x="0" y="0" width="180" height="160" rx="12" fill="#166534" />
        <text x="90" y="30" textAnchor="middle" fill="#BBF7D0" fontSize="16" fontWeight="bold">✨ HOPE</text>
        <text x="90" y="50" textAnchor="middle" fill="#86EFAC" fontSize="11">(Comfort)</text>
        <line x1="20" y1="62" x2="160" y2="62" stroke="#22C55E" strokeWidth="1" />

        <text x="90" y="82" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Ask:</text>
        <text x="90" y="98" textAnchor="middle" fill="#DCFCE7" fontSize="9">"What promise is offered?"</text>
        <text x="90" y="112" textAnchor="middle" fill="#DCFCE7" fontSize="9">"What fear is dismantled?"</text>
        <text x="90" y="126" textAnchor="middle" fill="#DCFCE7" fontSize="9">"What joy is ignited?"</text>

        <rect x="20" y="135" width="140" height="20" rx="4" fill="#22C55E" />
        <text x="90" y="149" textAnchor="middle" fill="white" fontSize="9">THANK → WORSHIP</text>
      </g>

      {/* Connecting arrows */}
      <path d="M310 180 L270 180" stroke="#F97316" strokeWidth="3" markerEnd="url(#fire-arrow)" />
      <path d="M490 180 L530 180" stroke="#F97316" strokeWidth="3" markerEnd="url(#fire-arrow)" />
      <defs>
        <marker id="fire-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#F97316" />
        </marker>
      </defs>

      {/* Bottom Steps */}
      <rect x="100" y="305" width="600" height="80" rx="10" fill="#292524" />
      <text x="400" y="330" textAnchor="middle" fill="#FBBF24" fontSize="14" fontWeight="bold">
        📖 METHODOLOGY
      </text>

      <g transform="translate(120, 345)">
        <circle cx="0" cy="10" r="12" fill="#DC2626" />
        <text x="0" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
        <text x="30" y="10" fill="#FDE68A" fontSize="9">Choose text</text>
        <text x="30" y="24" fill="#A8A29E" fontSize="8">that resonates</text>
      </g>

      <g transform="translate(240, 345)">
        <circle cx="0" cy="10" r="12" fill="#F97316" />
        <text x="0" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
        <text x="30" y="10" fill="#FDE68A" fontSize="9">Read slowly</text>
        <text x="30" y="24" fill="#A8A29E" fontSize="8">& meditatively</text>
      </g>

      <g transform="translate(360, 345)">
        <circle cx="0" cy="10" r="12" fill="#FBBF24" />
        <text x="0" y="14" textAnchor="middle" fill="#1C1917" fontSize="10" fontWeight="bold">3</text>
        <text x="30" y="10" fill="#FDE68A" fontSize="9">Name wound</text>
        <text x="30" y="24" fill="#A8A29E" fontSize="8">OR hope</text>
      </g>

      <g transform="translate(480, 345)">
        <circle cx="0" cy="10" r="12" fill="#22C55E" />
        <text x="0" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">4</text>
        <text x="30" y="10" fill="#FDE68A" fontSize="9">Pray it back</text>
        <text x="30" y="24" fill="#A8A29E" fontSize="8">to God</text>
      </g>

      <g transform="translate(600, 345)">
        <circle cx="0" cy="10" r="12" fill="#3B82F6" />
        <text x="0" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">5</text>
        <text x="30" y="10" fill="#FDE68A" fontSize="9">Record it</text>
        <text x="30" y="24" fill="#A8A29E" fontSize="8">(2-3 sentences)</text>
      </g>

      {/* Output */}
      <rect x="100" y="400" width="600" height="45" rx="8" fill="#F97316" />
      <text x="400" y="420" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        📝 OUTPUT: Fire Record
      </text>
      <text x="400" y="438" textAnchor="middle" fill="#FEF3C7" fontSize="10">
        Wound/Hope named → Prayer response → One sentence capturing the encounter
      </text>

      {/* Warning */}
      <rect x="100" y="455" width="600" height="35" rx="6" fill="#1C1917" stroke="#FBBF24" strokeWidth="1" />
      <text x="400" y="477" textAnchor="middle" fill="#FCD34D" fontSize="10">
        ⚠️ Fire Room comes AFTER exegesis, not instead of it — don't twist text to fit feelings
      </text>
    </svg>
  );
}

// Fire Room Concept - Heart vs Head Visual
export function FireRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      {/* Background - dark gradient */}
      <rect width="800" height="500" fill="#1C1917" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="bold">
        🔥 The Fire Room: Moving from Information to Transformation
      </text>

      {/* Two sides: Head vs Heart */}
      {/* Head side - Left */}
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="320" height="200" rx="12" fill="#374151" />
        <text x="160" y="30" textAnchor="middle" fill="#9CA3AF" fontSize="16" fontWeight="bold">🧠 HEAD (Floors 1-6)</text>
        <line x1="40" y1="45" x2="280" y2="45" stroke="#4B5563" strokeWidth="1" />

        <text x="160" y="70" textAnchor="middle" fill="#D1D5DB" fontSize="11">Analytical • Exegetical • Structural</text>

        <text x="30" y="100" fill="#9CA3AF" fontSize="10">✓ Story beats identified</text>
        <text x="30" y="118" fill="#9CA3AF" fontSize="10">✓ Words defined</text>
        <text x="30" y="136" fill="#9CA3AF" fontSize="10">✓ Types traced</text>
        <text x="30" y="154" fill="#9CA3AF" fontSize="10">✓ Christ connections made</text>
        <text x="30" y="172" fill="#9CA3AF" fontSize="10">✓ Genre checked</text>
        <text x="30" y="190" fill="#9CA3AF" fontSize="10">✓ Horizons mapped</text>
      </g>

      {/* Arrow between */}
      <path d="M385 160 L415 160" stroke="#F97316" strokeWidth="4" markerEnd="url(#concept-arrow)" />
      <defs>
        <marker id="concept-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0, 12 4, 0 8" fill="#F97316" />
        </marker>
      </defs>
      <text x="400" y="185" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="bold">BUT...</text>

      {/* Heart side - Right */}
      <g transform="translate(430, 60)">
        <rect x="0" y="0" width="320" height="200" rx="12" fill="url(#heart-grad)" />
        <text x="160" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">❤️ HEART (Floor 7)</text>
        <line x1="40" y1="45" x2="280" y2="45" stroke="#FCA5A5" strokeWidth="1" />

        <text x="160" y="70" textAnchor="middle" fill="#FEE2E2" fontSize="11">Personal • Devotional • Transformative</text>

        <text x="30" y="100" fill="white" fontSize="10">→ What wound does this EXPOSE?</text>
        <text x="30" y="120" fill="white" fontSize="10">→ What hope does this KINDLE?</text>
        <text x="30" y="140" fill="white" fontSize="10">→ How does this make me PRAY?</text>
        <text x="30" y="160" fill="white" fontSize="10">→ Where do I need to REPENT?</text>
        <text x="30" y="180" fill="white" fontSize="10">→ What can I WORSHIP for?</text>
      </g>

      {/* Key insight box */}
      <rect x="100" y="280" width="600" height="70" rx="10" fill="#451A03" stroke="#F97316" strokeWidth="2" />
      <text x="400" y="305" textAnchor="middle" fill="#FBBF24" fontSize="14" fontWeight="bold">
        💡 KEY INSIGHT
      </text>
      <text x="400" y="325" textAnchor="middle" fill="#FDE68A" fontSize="11">
        "God's Word isn't merely information to master—it's FIRE that burns." (Jer 20:9)
      </text>
      <text x="400" y="342" textAnchor="middle" fill="#FCD34D" fontSize="10">
        The Fire Room prevents cold orthodoxy (theologically correct but spiritually dead)
      </text>

      {/* Two outcomes */}
      <g transform="translate(100, 365)">
        <rect x="0" y="0" width="280" height="120" rx="10" fill="#7F1D1D" />
        <text x="140" y="25" textAnchor="middle" fill="#FCA5A5" fontSize="13" fontWeight="bold">
          🩹 If CONVICTION...
        </text>
        <text x="20" y="50" fill="#FEE2E2" fontSize="10">• Name the specific sin/idolatry</text>
        <text x="20" y="68" fill="#FEE2E2" fontSize="10">• Confess to God</text>
        <text x="20" y="86" fill="#FEE2E2" fontSize="10">• Ask for grace to change</text>
        <text x="20" y="104" fill="#FECACA" fontSize="9" fontStyle="italic">Don't just feel guilty—run to the cross</text>
      </g>

      <g transform="translate(420, 365)">
        <rect x="0" y="0" width="280" height="120" rx="10" fill="#166534" />
        <text x="140" y="25" textAnchor="middle" fill="#86EFAC" fontSize="13" fontWeight="bold">
          ✨ If COMFORT...
        </text>
        <text x="20" y="50" fill="#DCFCE7" fontSize="10">• Name the specific promise</text>
        <text x="20" y="68" fill="#DCFCE7" fontSize="10">• Thank God for it</text>
        <text x="20" y="86" fill="#DCFCE7" fontSize="10">• Ask for faith to believe it</text>
        <text x="20" y="104" fill="#BBF7D0" fontSize="9" fontStyle="italic">Let it dismantle your fear</text>
      </g>
    </svg>
  );
}

// Fire Room Example - Psalm 22:1 and Romans 8:38-39
export function FireRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#1C1917" rx="16" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="bold">
        🔥 Fire Room Examples: Wound and Hope
      </text>

      {/* Example 1: Wound - Psalm 22:1 */}
      <g transform="translate(50, 50)">
        <rect x="0" y="0" width="340" height="230" rx="12" fill="#7F1D1D" />
        <text x="170" y="25" textAnchor="middle" fill="#FCA5A5" fontSize="14" fontWeight="bold">
          🩹 WOUND EXAMPLE
        </text>

        <rect x="15" y="40" width="310" height="40" rx="6" fill="#450A0A" />
        <text x="170" y="55" textAnchor="middle" fill="white" fontSize="10" fontStyle="italic">
          "My God, my God, why have you forsaken me?"
        </text>
        <text x="170" y="72" textAnchor="middle" fill="#FCA5A5" fontSize="9">— Psalm 22:1</text>

        <text x="20" y="100" fill="white" fontSize="10" fontWeight="bold">WOUND EXPOSED:</text>
        <text x="20" y="115" fill="#FEE2E2" fontSize="9">Seasons of feeling abandoned by God.</text>
        <text x="20" y="128" fill="#FEE2E2" fontSize="9">Anger at God's silence. Doubting His goodness.</text>

        <text x="20" y="148" fill="white" fontSize="10" fontWeight="bold">BUT ALSO HOPE:</text>
        <text x="20" y="163" fill="#BBF7D0" fontSize="9">This is CHRIST'S cry on the cross—</text>
        <text x="20" y="176" fill="#BBF7D0" fontSize="9">He bore ultimate forsakenness so I never would.</text>

        <text x="20" y="196" fill="white" fontSize="10" fontWeight="bold">PRAYER:</text>
        <text x="20" y="211" fill="#FDE68A" fontSize="8" fontStyle="italic">"Jesus, You cried these words so I wouldn't cry them</text>
        <text x="20" y="223" fill="#FDE68A" fontSize="8" fontStyle="italic">in hell. Help me trust even in Your silence."</text>
      </g>

      {/* Example 2: Hope - Romans 8:38-39 */}
      <g transform="translate(410, 50)">
        <rect x="0" y="0" width="340" height="230" rx="12" fill="#166534" />
        <text x="170" y="25" textAnchor="middle" fill="#86EFAC" fontSize="14" fontWeight="bold">
          ✨ HOPE EXAMPLE
        </text>

        <rect x="15" y="40" width="310" height="40" rx="6" fill="#052E16" />
        <text x="170" y="55" textAnchor="middle" fill="white" fontSize="9" fontStyle="italic">
          "Nothing can separate us from the love of God"
        </text>
        <text x="170" y="72" textAnchor="middle" fill="#86EFAC" fontSize="9">— Romans 8:38-39</text>

        <text x="20" y="100" fill="white" fontSize="10" fontWeight="bold">HOPE KINDLED:</text>
        <text x="20" y="115" fill="#DCFCE7" fontSize="9">Deep assurance—no failure, no sin, no circumstance</text>
        <text x="20" y="128" fill="#DCFCE7" fontSize="9">can rip me from God's grip.</text>

        <text x="20" y="148" fill="white" fontSize="10" fontWeight="bold">WOUND EXPOSED:</text>
        <text x="20" y="163" fill="#FECACA" fontSize="9">I've been living as if my standing with God</text>
        <text x="20" y="176" fill="#FECACA" fontSize="9">depends on my performance.</text>

        <text x="20" y="196" fill="white" fontSize="10" fontWeight="bold">PRAYER:</text>
        <text x="20" y="211" fill="#FDE68A" fontSize="8" fontStyle="italic">"Father, Your love is anchored in Christ's work,</text>
        <text x="20" y="223" fill="#FDE68A" fontSize="8" fontStyle="italic">not mine. Help me REST in this."</text>
      </g>

      {/* Fire Record Template */}
      <rect x="50" y="295" width="700" height="130" rx="12" fill="#292524" stroke="#F97316" strokeWidth="2" />
      <text x="400" y="320" textAnchor="middle" fill="#FBBF24" fontSize="14" fontWeight="bold">
        📝 FIRE RECORD TEMPLATE
      </text>

      <text x="70" y="350" fill="#FDE68A" fontSize="11" fontWeight="bold">1. TEXT:</text>
      <text x="130" y="350" fill="#D1D5DB" fontSize="10">[Verse reference]</text>

      <text x="70" y="375" fill="#FDE68A" fontSize="11" fontWeight="bold">2. WOUND or HOPE:</text>
      <text x="220" y="375" fill="#D1D5DB" fontSize="10">[What did it expose or kindle?]</text>

      <text x="70" y="400" fill="#FDE68A" fontSize="11" fontWeight="bold">3. PRAYER RESPONSE:</text>
      <text x="230" y="400" fill="#D1D5DB" fontSize="10">[Confession or thanksgiving, 1-2 sentences]</text>

      {/* Pitfalls */}
      <rect x="50" y="440" width="700" height="95" rx="10" fill="#1C1917" stroke="#EF4444" strokeWidth="1" />
      <text x="400" y="465" textAnchor="middle" fill="#FCA5A5" fontSize="12" fontWeight="bold">
        ⚠️ PITFALLS TO AVOID
      </text>
      <text x="180" y="490" textAnchor="middle" fill="#FEE2E2" fontSize="9">Emotionalism without exegesis</text>
      <text x="400" y="490" textAnchor="middle" fill="#FEE2E2" fontSize="9">Manufacturing emotion</text>
      <text x="620" y="490" textAnchor="middle" fill="#FEE2E2" fontSize="9">Vague confessions</text>
      <text x="290" y="515" textAnchor="middle" fill="#FEE2E2" fontSize="9">Skipping the Fire Room entirely</text>
      <text x="510" y="515" textAnchor="middle" fill="#FEE2E2" fontSize="9">Ignoring Christ in guilt</text>
    </svg>
  );
}
