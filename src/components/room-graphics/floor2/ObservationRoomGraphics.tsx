import React from 'react';

// Observation Room Method Flowchart
export function ObservationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="or-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="50%" stopColor="#E0E7FF" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
        <linearGradient id="or-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="or-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <filter id="or-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="or-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#or-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#3730A3" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Observation Room: Biblical Detective Work
      </text>

      {/* Magnifying glass icon */}
      <g transform="translate(60, 70)" filter="url(#or-glow)">
        <circle cx="30" cy="30" r="25" fill="none" stroke="#6366F1" strokeWidth="4" />
        <line x1="48" y1="48" x2="65" y2="65" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <text x="30" y="38" textAnchor="middle" fill="#4F46E5" fontSize="20">🔍</text>
      </g>

      {/* Step 1: What is Happening */}
      <g filter="url(#or-shadow)">
        <rect x="120" y="70" width="630" height="100" rx="12" fill="url(#or-grad)" />
        <text x="435" y="100" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
          FIRST: What Is Happening?
        </text>
        <text x="140" y="130" fill="#E0E7FF" fontSize="13">• How many people? • What objects? • What actions? • Where? • When?</text>
        <text x="140" y="155" fill="#C7D2FE" fontSize="12">Start with FACTS before interpretation</text>
      </g>

      {/* Category Grid */}
      <g transform="translate(50, 190)">
        {[
          { title: 'Grammar', icon: '📝', examples: 'Verbs, tenses, pronouns' },
          { title: 'Repetition', icon: '🔄', examples: 'Repeated words/phrases' },
          { title: 'Contrasts', icon: '⚖️', examples: 'Opposites, comparisons' },
          { title: 'Setting', icon: '📍', examples: 'Time, place, context' },
          { title: 'Structure', icon: '🏗️', examples: 'Chiasm, parallelism' },
          { title: 'Numbers', icon: '#️⃣', examples: 'Counts, measurements' },
        ].map((cat, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 90})`} filter="url(#or-shadow)">
            <rect x="0" y="0" width="220" height="75" rx="10" fill="white" fillOpacity="0.95" stroke="#6366F1" strokeWidth="2" />
            <text x="30" y="32" fontSize="20">{cat.icon}</text>
            <text x="60" y="30" fill="#3730A3" fontSize="14" fontWeight="bold">{cat.title}</text>
            <text x="20" y="55" fill="#6366F1" fontSize="11">{cat.examples}</text>
          </g>
        ))}
      </g>

      {/* Target */}
      <g filter="url(#or-shadow)">
        <rect x="50" y="390" width="700" height="90" rx="12" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="420" textAnchor="middle" fill="#92400E" fontSize="16" fontWeight="bold">
          🎯 Target: 20-50 Observations Minimum
        </text>
        <text x="400" y="450" textAnchor="middle" fill="#78350F" fontSize="13">
          If you have fewer than 20 observations, you're not done looking!
        </text>
        <text x="400" y="470" textAnchor="middle" fill="#78350F" fontSize="12">
          Write ONLY what you SEE — no interpretation yet
        </text>
      </g>
    </svg>
  );
}

// Observation Room Concept Infographic
export function ObservationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="or2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="50%" stopColor="#E0E7FF" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
        <linearGradient id="or2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <filter id="or2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#or2-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#3730A3" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Observation vs. Interpretation
      </text>

      {/* Two Columns */}
      <g transform="translate(50, 55)">
        {/* Observation Column */}
        <g filter="url(#or2-shadow)">
          <rect x="0" y="0" width="320" height="200" rx="12" fill="#D1FAE5" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
          <text x="160" y="30" textAnchor="middle" fill="#065F46" fontSize="16" fontWeight="bold">✅ OBSERVATION</text>
          <text x="160" y="55" textAnchor="middle" fill="#047857" fontSize="12">(What the text SAYS)</text>

          <text x="20" y="85" fill="#065F46" fontSize="12">• "Father ran" (v.20)</text>
          <text x="20" y="105" fill="#065F46" fontSize="12">• 5 actions by father listed</text>
          <text x="20" y="125" fill="#065F46" fontSize="12">• Son was "yet a great way off"</text>
          <text x="20" y="145" fill="#065F46" fontSize="12">• Physical embrace BEFORE words</text>
          <text x="20" y="165" fill="#065F46" fontSize="12">• "Ran" = unusual for patriarch</text>
          <text x="20" y="185" fill="#065F46" fontSize="12">• Verb sequence: saw→felt→ran→embraced</text>
        </g>
      </g>

      <g transform="translate(430, 55)">
        {/* Interpretation Column */}
        <g filter="url(#or2-shadow)">
          <rect x="0" y="0" width="320" height="200" rx="12" fill="#FEE2E2" fillOpacity="0.95" stroke="#EF4444" strokeWidth="2" />
          <text x="160" y="30" textAnchor="middle" fill="#991B1B" fontSize="16" fontWeight="bold">❌ INTERPRETATION</text>
          <text x="160" y="55" textAnchor="middle" fill="#B91C1C" fontSize="12">(What the text MEANS — save for later)</text>

          <text x="20" y="85" fill="#991B1B" fontSize="12">• "God runs to sinners"</text>
          <text x="20" y="105" fill="#991B1B" fontSize="12">• "This shows God's grace"</text>
          <text x="20" y="125" fill="#991B1B" fontSize="12">• "The father represents God"</text>
          <text x="20" y="145" fill="#991B1B" fontSize="12">• "We should forgive like this"</text>
          <text x="20" y="165" fill="#991B1B" fontSize="12">• "Grace precedes repentance"</text>
          <text x="20" y="185" fill="#991B1B" fontSize="12">• "This is about justification"</text>
        </g>
      </g>

      {/* Key Principle */}
      <g filter="url(#or2-shadow)">
        <rect x="50" y="270" width="700" height="80" rx="12" fill="white" fillOpacity="0.95" stroke="#6366F1" strokeWidth="2" />
        <text x="400" y="300" textAnchor="middle" fill="#3730A3" fontSize="16" fontWeight="bold">
          🔑 Key Principle: See Before You Interpret
        </text>
        <text x="400" y="330" textAnchor="middle" fill="#4F46E5" fontSize="13">
          Most Bible study errors come from interpreting what we haven't carefully observed.
        </text>
      </g>

      {/* Detective metaphor */}
      <g filter="url(#or2-shadow)">
        <rect x="50" y="365" width="700" height="115" rx="12" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="100" y="400" fill="#92400E" fontSize="40">🕵️</text>
        <text x="160" y="400" fill="#92400E" fontSize="16" fontWeight="bold">Think Like a Detective</text>
        <text x="160" y="425" fill="#78350F" fontSize="12">Detectives collect EVIDENCE before drawing CONCLUSIONS.</text>
        <text x="160" y="445" fill="#78350F" fontSize="12">Your observation sheet = evidence file.</text>
        <text x="160" y="465" fill="#78350F" fontSize="12">The more you observe, the stronger your interpretation will be.</text>
      </g>
    </svg>
  );
}

// Observation Room Example
export function ObservationRoomExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="or3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="50%" stopColor="#E0E7FF" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
        <linearGradient id="or3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <filter id="or3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="600" fill="url(#or3-bg)" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#3730A3" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Matthew 25:1-4 (Ten Virgins)
      </text>

      {/* Two-column observation sheet */}
      <g transform="translate(50, 55)">
        {/* What is Happening */}
        <g filter="url(#or3-shadow)">
          <rect x="0" y="0" width="340" height="260" rx="12" fill="white" fillOpacity="0.95" stroke="#6366F1" strokeWidth="2" />
          <rect x="0" y="0" width="340" height="40" rx="12" fill="url(#or3-header)" />
          <text x="170" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            WHAT IS HAPPENING
          </text>

          <text x="15" y="65" fill="#3730A3" fontSize="11" fontWeight="bold">Numbers & People:</text>
          <text x="15" y="82" fill="#4F46E5" fontSize="10">1. 10 virgins total</text>
          <text x="15" y="97" fill="#4F46E5" fontSize="10">2. 5 foolish + 5 wise = 50/50 split</text>
          <text x="15" y="112" fill="#4F46E5" fontSize="10">3. 1 bridegroom mentioned</text>

          <text x="15" y="135" fill="#3730A3" fontSize="11" fontWeight="bold">Objects:</text>
          <text x="15" y="152" fill="#4F46E5" fontSize="10">4. All 10 have lamps</text>
          <text x="15" y="167" fill="#4F46E5" fontSize="10">5. Foolish: lamps only, 0 extra oil</text>
          <text x="15" y="182" fill="#4F46E5" fontSize="10">6. Wise: lamps + oil in vessels (2 things)</text>

          <text x="15" y="205" fill="#3730A3" fontSize="11" fontWeight="bold">Actions & Setting:</text>
          <text x="15" y="222" fill="#4F46E5" fontSize="10">7. "Went out" = active movement</text>
          <text x="15" y="237" fill="#4F46E5" fontSize="10">8. Setting: nighttime (need lamps)</text>
          <text x="15" y="252" fill="#4F46E5" fontSize="10">9. Event: wedding procession</text>
        </g>
      </g>

      <g transform="translate(410, 55)">
        {/* Deeper Observations */}
        <g filter="url(#or3-shadow)">
          <rect x="0" y="0" width="340" height="260" rx="12" fill="white" fillOpacity="0.95" stroke="#6366F1" strokeWidth="2" />
          <rect x="0" y="0" width="340" height="40" rx="12" fill="#4F46E5" />
          <text x="170" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            DEEPER OBSERVATIONS
          </text>

          <text x="15" y="65" fill="#3730A3" fontSize="11" fontWeight="bold">Contrasts:</text>
          <text x="15" y="82" fill="#4F46E5" fontSize="10">10. Foolish vs. Wise = key division</text>
          <text x="15" y="97" fill="#4F46E5" fontSize="10">11. Difference is PREPARATION, not appearance</text>
          <text x="15" y="112" fill="#4F46E5" fontSize="10">12. Both groups have lamps (external same)</text>

          <text x="15" y="135" fill="#3730A3" fontSize="11" fontWeight="bold">Grammar:</text>
          <text x="15" y="152" fill="#4F46E5" fontSize="10">13. "Took" (v.3) vs. "took" (v.4) — same verb</text>
          <text x="15" y="167" fill="#4F46E5" fontSize="10">14. "With them" = personal possession</text>

          <text x="15" y="190" fill="#3730A3" fontSize="11" fontWeight="bold">Structure:</text>
          <text x="15" y="207" fill="#4F46E5" fontSize="10">15. "Then" (v.1) = connects to previous chapter</text>
          <text x="15" y="222" fill="#4F46E5" fontSize="10">16. Kingdom of heaven = subject</text>
          <text x="15" y="237" fill="#4F46E5" fontSize="10">17. "Likened unto" = comparison language</text>
          <text x="15" y="252" fill="#4F46E5" fontSize="10">18. Parable introduces delay theme</text>
        </g>
      </g>

      {/* Summary */}
      <g filter="url(#or3-shadow)">
        <rect x="50" y="330" width="700" height="80" rx="12" fill="#D1FAE5" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <text x="400" y="360" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
          📊 Observation Count: 18+ (and we could find more!)
        </text>
        <text x="400" y="385" textAnchor="middle" fill="#047857" fontSize="12">
          Notice: We haven't INTERPRETED yet — just collected raw data
        </text>
      </g>

      {/* Pitfalls */}
      <g filter="url(#or3-shadow)">
        <rect x="50" y="425" width="700" height="155" rx="12" fill="#FEE2E2" fillOpacity="0.95" stroke="#EF4444" strokeWidth="2" />
        <text x="400" y="455" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">
          ⚠️ Common Pitfalls
        </text>
        <text x="80" y="485" fill="#B91C1C" fontSize="11">• Skipping factual details (always start with WHAT is happening)</text>
        <text x="80" y="505" fill="#B91C1C" fontSize="11">• Slipping into interpretation ("this means...") instead of observation</text>
        <text x="80" y="525" fill="#B91C1C" fontSize="11">• Stopping too early (fewer than 20 = not done)</text>
        <text x="80" y="545" fill="#B91C1C" fontSize="11">• Only observing "theological" details (notice EVERYTHING)</text>
        <text x="80" y="565" fill="#B91C1C" fontSize="11">• Skipping "obvious" observations (they're often foundational)</text>
      </g>
    </svg>
  );
}

export default {
  ObservationRoomFlowchart,
  ObservationRoomConcept,
  ObservationRoomExample
};
