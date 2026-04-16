import React from 'react';

// Meditation Room Method Flowchart - Marination Process
export function MeditationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="med-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="med-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="med-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="med-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
        </filter>
        <filter id="med-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background - calm gradient */}
      <rect width="800" height="500" fill="url(#med-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#A5B4FC" fontSize="20" fontWeight="bold" letterSpacing="0.5">
        Meditation Room: Marinate Until Absorbed
      </text>
      <text x="400" y="55" textAnchor="middle" fill="#818CF8" fontSize="11">
        "His delight is in the law of the LORD, and on His law he meditates day and night" — Psalm 1:2
      </text>

      {/* Central verse bubble */}
      <ellipse cx="400" cy="150" rx="120" ry="60" fill="url(#med-grad)" filter="url(#med-glow)" />
      <text x="400" y="140" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ONE VERSE</text>
      <text x="400" y="158" textAnchor="middle" fill="#C7D2FE" fontSize="10">5-15 words max</text>
      <text x="400" y="175" textAnchor="middle" fill="#E0E7FF" fontSize="9" fontStyle="italic">"Less is more"</text>

      {/* 6 Steps arranged in arc */}
      {/* Step 1: Select */}
      <g transform="translate(80, 230)">
        <circle cx="40" cy="40" r="35" fill="#3B82F6" />
        <text x="40" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">1</text>
        <text x="40" y="52" textAnchor="middle" fill="white" fontSize="8">SELECT</text>
        <text x="40" y="95" textAnchor="middle" fill="#93C5FD" fontSize="9">Choose 1 verse</text>
        <text x="40" y="108" textAnchor="middle" fill="#60A5FA" fontSize="8">or phrase</text>
      </g>

      {/* Step 2: Read Slowly */}
      <g transform="translate(190, 230)">
        <circle cx="40" cy="40" r="35" fill="#6366F1" />
        <text x="40" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">2</text>
        <text x="40" y="52" textAnchor="middle" fill="white" fontSize="8">READ</text>
        <text x="40" y="95" textAnchor="middle" fill="#A5B4FC" fontSize="9">Phrase by phrase</text>
        <text x="40" y="108" textAnchor="middle" fill="#818CF8" fontSize="8">30-60 sec each</text>
      </g>

      {/* Step 3: Breathe */}
      <g transform="translate(300, 230)">
        <circle cx="40" cy="40" r="35" fill="#8B5CF6" />
        <text x="40" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">3</text>
        <text x="40" y="52" textAnchor="middle" fill="white" fontSize="8">BREATHE</text>
        <text x="40" y="95" textAnchor="middle" fill="#C4B5FD" fontSize="9">Inhale first half</text>
        <text x="40" y="108" textAnchor="middle" fill="#A78BFA" fontSize="8">Exhale second</text>
      </g>

      {/* Step 4: Visualize */}
      <g transform="translate(410, 230)">
        <circle cx="40" cy="40" r="35" fill="#A855F7" />
        <text x="40" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">4</text>
        <text x="40" y="52" textAnchor="middle" fill="white" fontSize="8">VISUALIZE</text>
        <text x="40" y="95" textAnchor="middle" fill="#D8B4FE" fontSize="9">Picture the scene</text>
        <text x="40" y="108" textAnchor="middle" fill="#C084FC" fontSize="8">or meaning</text>
      </g>

      {/* Step 5: Repeat */}
      <g transform="translate(520, 230)">
        <circle cx="40" cy="40" r="35" fill="#D946EF" />
        <text x="40" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">5</text>
        <text x="40" y="52" textAnchor="middle" fill="white" fontSize="8">REPEAT</text>
        <text x="40" y="95" textAnchor="middle" fill="#F0ABFC" fontSize="9">10-20 times</text>
        <text x="40" y="108" textAnchor="middle" fill="#E879F9" fontSize="8">until sweet</text>
      </g>

      {/* Step 6: Journal */}
      <g transform="translate(630, 230)">
        <circle cx="40" cy="40" r="35" fill="#EC4899" />
        <text x="40" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">6</text>
        <text x="40" y="52" textAnchor="middle" fill="white" fontSize="8">JOURNAL</text>
        <text x="40" y="95" textAnchor="middle" fill="#FBCFE8" fontSize="9">One truth to</text>
        <text x="40" y="108" textAnchor="middle" fill="#F472B6" fontSize="8">carry today</text>
      </g>

      {/* Breathing example */}
      <rect x="150" y="355" width="500" height="55" rx="10" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1" />
      <text x="400" y="378" textAnchor="middle" fill="#A5B4FC" fontSize="12" fontWeight="bold">
        🌬️ BREATHING PATTERN EXAMPLE
      </text>
      <text x="400" y="398" textAnchor="middle" fill="#C7D2FE" fontSize="10">
        [INHALE] "The LORD is my shepherd" [EXHALE] "I shall not want"
      </text>

      {/* Output */}
      <rect x="100" y="420" width="600" height="35" rx="8" fill="#6366F1" />
      <text x="400" y="443" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        📝 OUTPUT: Meditation Line — The verse + ONE distilled truth + Plan for returning to it
      </text>

      {/* Key principle */}
      <rect x="100" y="465" width="600" height="25" rx="6" fill="#0F172A" stroke="#8B5CF6" strokeWidth="1" />
      <text x="400" y="482" textAnchor="middle" fill="#C4B5FD" fontSize="10">
        ⏱️ PRINCIPLE: Better to meditate deeply on 1 verse than skim 10 chapters
      </text>
    </svg>
  );
}

// Meditation Room Concept - Internalization Visual
export function MeditationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#0F172A" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#A5B4FC" fontSize="18" fontWeight="bold">
        🧘 From Reading to BECOMING: The Meditation Difference
      </text>

      {/* Left: Fast reading */}
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="300" height="180" rx="12" fill="#374151" />
        <text x="150" y="28" textAnchor="middle" fill="#9CA3AF" fontSize="14" fontWeight="bold">
          ⚡ FAST READING
        </text>
        <line x1="30" y1="42" x2="270" y2="42" stroke="#4B5563" strokeWidth="1" />

        <text x="150" y="65" textAnchor="middle" fill="#D1D5DB" fontSize="10">5 chapters in 15 minutes</text>

        <text x="30" y="90" fill="#9CA3AF" fontSize="9">• Information gathering</text>
        <text x="30" y="108" fill="#9CA3AF" fontSize="9">• Surface understanding</text>
        <text x="30" y="126" fill="#9CA3AF" fontSize="9">• Easy to forget</text>
        <text x="30" y="144" fill="#9CA3AF" fontSize="9">• Novelty addiction</text>
        <text x="30" y="162" fill="#EF4444" fontSize="9">❌ "I read but didn't absorb"</text>
      </g>

      {/* Arrow */}
      <path d="M365 150 L435 150" stroke="#8B5CF6" strokeWidth="4" markerEnd="url(#med-arrow)" />
      <defs>
        <marker id="med-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0, 12 4, 0 8" fill="#8B5CF6" />
        </marker>
      </defs>
      <text x="400" y="175" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="bold">VS</text>

      {/* Right: Meditation */}
      <g transform="translate(450, 60)">
        <rect x="0" y="0" width="300" height="180" rx="12" fill="#4C1D95" />
        <text x="150" y="28" textAnchor="middle" fill="#E9D5FF" fontSize="14" fontWeight="bold">
          🧘 MEDITATION
        </text>
        <line x1="30" y1="42" x2="270" y2="42" stroke="#7C3AED" strokeWidth="1" />

        <text x="150" y="65" textAnchor="middle" fill="#DDD6FE" fontSize="10">5 words for 20 minutes</text>

        <text x="30" y="90" fill="#E9D5FF" fontSize="9">• Deep internalization</text>
        <text x="30" y="108" fill="#E9D5FF" fontSize="9">• Becomes spiritual DNA</text>
        <text x="30" y="126" fill="#E9D5FF" fontSize="9">• Instinctive recall</text>
        <text x="30" y="144" fill="#E9D5FF" fontSize="9">• Written on bones</text>
        <text x="30" y="162" fill="#22C55E" fontSize="9">✓ "It's now part of me"</text>
      </g>

      {/* Hebrew concept */}
      <rect x="100" y="260" width="600" height="60" rx="10" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="285" textAnchor="middle" fill="#A5B4FC" fontSize="13" fontWeight="bold">
        📜 HEBREW: "HAGAH" (הָגָה)
      </text>
      <text x="400" y="305" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        "To mutter, murmur, growl" — Ancient Jews repeated Scripture aloud until embedded
      </text>

      {/* Neuroscience insight */}
      <rect x="100" y="335" width="600" height="55" rx="10" fill="#052E16" stroke="#22C55E" strokeWidth="1" />
      <text x="400" y="358" textAnchor="middle" fill="#86EFAC" fontSize="12" fontWeight="bold">
        🧠 NEUROSCIENCE: "Neurons that fire together wire together"
      </text>
      <text x="400" y="378" textAnchor="middle" fill="#BBF7D0" fontSize="10">
        Repetition creates spiritual muscle memory — reflexive recall in real situations
      </text>

      {/* Return strategy */}
      <rect x="100" y="405" width="600" height="80" rx="10" fill="#0F172A" stroke="#8B5CF6" strokeWidth="1" />
      <text x="400" y="430" textAnchor="middle" fill="#A5B4FC" fontSize="13" fontWeight="bold">
        🔄 RETURN THROUGHOUT THE DAY
      </text>
      <g transform="translate(140, 445)">
        <circle cx="0" cy="10" r="8" fill="#3B82F6" />
        <text x="20" y="14" fill="#93C5FD" fontSize="10">Morning</text>
      </g>
      <g transform="translate(280, 445)">
        <circle cx="0" cy="10" r="8" fill="#6366F1" />
        <text x="20" y="14" fill="#A5B4FC" fontSize="10">Lunch reminder</text>
      </g>
      <g transform="translate(450, 445)">
        <circle cx="0" cy="10" r="8" fill="#8B5CF6" />
        <text x="20" y="14" fill="#C4B5FD" fontSize="10">Evening repeat</text>
      </g>
      <g transform="translate(600, 445)">
        <circle cx="0" cy="10" r="8" fill="#A855F7" />
        <text x="20" y="14" fill="#D8B4FE" fontSize="10">Bedtime</text>
      </g>
    </svg>
  );
}

// Meditation Room Example - Psalm 23:1 Deep Dive
export function MeditationRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#0F172A" rx="16" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#A5B4FC" fontSize="18" fontWeight="bold">
        🧘 Example: Meditating on Psalm 23:1
      </text>

      {/* The verse */}
      <rect x="150" y="50" width="500" height="50" rx="10" fill="#4C1D95" />
      <text x="400" y="82" textAnchor="middle" fill="white" fontSize="16" fontStyle="italic">
        "The LORD is my shepherd, I shall not want"
      </text>

      {/* Phrase by phrase breakdown */}
      <text x="400" y="125" textAnchor="middle" fill="#C7D2FE" fontSize="13" fontWeight="bold">
        PHRASE-BY-PHRASE MEDITATION:
      </text>

      {/* Phrase boxes */}
      <g transform="translate(80, 140)">
        <rect x="0" y="0" width="145" height="80" rx="8" fill="#1E3A8A" />
        <text x="72" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">"The LORD"</text>
        <line x1="15" y1="35" x2="130" y2="35" stroke="#3B82F6" strokeWidth="1" />
        <text x="72" y="52" textAnchor="middle" fill="#93C5FD" fontSize="9">Not a concept but</text>
        <text x="72" y="65" textAnchor="middle" fill="#93C5FD" fontSize="9">YAHWEH—covenant God</text>
      </g>

      <g transform="translate(235, 140)">
        <rect x="0" y="0" width="145" height="80" rx="8" fill="#3730A3" />
        <text x="72" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">"is MY"</text>
        <line x1="15" y1="35" x2="130" y2="35" stroke="#6366F1" strokeWidth="1" />
        <text x="72" y="52" textAnchor="middle" fill="#A5B4FC" fontSize="9">Personal relationship</text>
        <text x="72" y="65" textAnchor="middle" fill="#A5B4FC" fontSize="9">Not distant deity</text>
      </g>

      <g transform="translate(390, 140)">
        <rect x="0" y="0" width="145" height="80" rx="8" fill="#5B21B6" />
        <text x="72" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">"shepherd"</text>
        <line x1="15" y1="35" x2="130" y2="35" stroke="#8B5CF6" strokeWidth="1" />
        <text x="72" y="52" textAnchor="middle" fill="#C4B5FD" fontSize="9">Protector, provider</text>
        <text x="72" y="65" textAnchor="middle" fill="#C4B5FD" fontSize="9">Guide, tender care</text>
      </g>

      <g transform="translate(545, 140)">
        <rect x="0" y="0" width="175" height="80" rx="8" fill="#7C3AED" />
        <text x="87" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">"I shall not want"</text>
        <line x1="15" y1="35" x2="160" y2="35" stroke="#A78BFA" strokeWidth="1" />
        <text x="87" y="52" textAnchor="middle" fill="#DDD6FE" fontSize="9">Future certainty</text>
        <text x="87" y="65" textAnchor="middle" fill="#DDD6FE" fontSize="9">He supplies needs</text>
      </g>

      {/* Breathing pattern */}
      <rect x="100" y="235" width="600" height="50" rx="10" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="255" textAnchor="middle" fill="#A5B4FC" fontSize="12" fontWeight="bold">
        🌬️ BREATHE (Repeat 10 times):
      </text>
      <text x="400" y="275" textAnchor="middle" fill="#E0E7FF" fontSize="11">
        [INHALE] "The LORD is my shepherd" ——— [EXHALE] "I shall not want"
      </text>

      {/* Visualize */}
      <rect x="100" y="295" width="600" height="50" rx="10" fill="#0F172A" stroke="#8B5CF6" strokeWidth="1" />
      <text x="400" y="318" textAnchor="middle" fill="#C4B5FD" fontSize="12" fontWeight="bold">
        👁️ VISUALIZE:
      </text>
      <text x="400" y="336" textAnchor="middle" fill="#DDD6FE" fontSize="10">
        Shepherd's staff in strong hand • Sheep calm and provided for • No panic, no lack
      </text>

      {/* Distilled truth */}
      <rect x="100" y="360" width="600" height="70" rx="10" fill="#4C1D95" />
      <text x="400" y="385" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
        📝 DISTILLED TRUTH TO CARRY TODAY:
      </text>
      <text x="400" y="408" textAnchor="middle" fill="#E9D5FF" fontSize="11">
        "When anxiety about provision strikes, I'll whisper 'The LORD is my shepherd'—
      </text>
      <text x="400" y="423" textAnchor="middle" fill="#E9D5FF" fontSize="11">
        reminding myself He supplies what I truly need."
      </text>

      {/* Pitfalls */}
      <rect x="100" y="445" width="600" height="90" rx="10" fill="#0F172A" stroke="#EF4444" strokeWidth="1" />
      <text x="400" y="468" textAnchor="middle" fill="#FCA5A5" fontSize="12" fontWeight="bold">
        ⚠️ PITFALLS TO AVOID
      </text>
      <text x="170" y="495" textAnchor="middle" fill="#FEE2E2" fontSize="9">RUSHING</text>
      <text x="170" y="510" textAnchor="middle" fill="#9CA3AF" fontSize="8">(treating like checklist)</text>
      <text x="320" y="495" textAnchor="middle" fill="#FEE2E2" fontSize="9">MULTI-TASKING</text>
      <text x="320" y="510" textAnchor="middle" fill="#9CA3AF" fontSize="8">(scrolling + meditating)</text>
      <text x="480" y="495" textAnchor="middle" fill="#FEE2E2" fontSize="9">NOVELTY ADDICTION</text>
      <text x="480" y="510" textAnchor="middle" fill="#9CA3AF" fontSize="8">(switching verses too fast)</text>
      <text x="630" y="495" textAnchor="middle" fill="#FEE2E2" fontSize="9">NO FOLLOW-UP</text>
      <text x="630" y="510" textAnchor="middle" fill="#9CA3AF" fontSize="8">(never returning to verse)</text>
    </svg>
  );
}
