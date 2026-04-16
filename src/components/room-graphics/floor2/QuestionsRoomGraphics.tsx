import React from 'react';

// Questions Room Method Flowchart
export function QuestionsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF2F2" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id="qr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="qr-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <filter id="qr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="qr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#qr-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#991B1B" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Questions Room: Generate 50-100 Precision Questions
      </text>

      {/* Target */}
      <g filter="url(#qr-glow)">
        <circle cx="400" cy="140" r="70" fill="url(#qr-grad)" />
        <text x="400" y="130" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">50+</text>
        <text x="400" y="155" textAnchor="middle" fill="#FECACA" fontSize="14">Questions</text>
        <text x="400" y="175" textAnchor="middle" fill="#FECACA" fontSize="11">Minimum Target</text>
      </g>

      {/* Question Categories */}
      <g transform="translate(50, 230)">
        {[
          { cat: 'WHO?', examples: 'Who is speaking? To whom? About whom?', color: '#EF4444' },
          { cat: 'WHAT?', examples: 'What is happening? What words used?', color: '#F97316' },
          { cat: 'WHERE?', examples: 'Where is this? Significance of place?', color: '#EAB308' },
          { cat: 'WHEN?', examples: 'When did this occur? Time indicators?', color: '#22C55E' },
          { cat: 'WHY?', examples: 'Why this action? Why these words?', color: '#3B82F6' },
          { cat: 'HOW?', examples: 'How accomplished? How related?', color: '#8B5CF6' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 75})`} filter="url(#qr-shadow)">
            <rect x="0" y="0" width="220" height="65" rx="10" fill="white" fillOpacity="0.95" stroke={item.color} strokeWidth="2" />
            <rect x="0" y="0" width="60" height="65" rx="10" fill={item.color} />
            <text x="30" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.cat}</text>
            <text x="145" y="28" textAnchor="middle" fill="#374151" fontSize="9">{item.examples.split('?')[0]}?</text>
            <text x="145" y="45" textAnchor="middle" fill="#374151" fontSize="9">{item.examples.split('?')[1]}?</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <g filter="url(#qr-shadow)">
        <rect x="50" y="400" width="700" height="80" rx="12" fill="#FEE2E2" fillOpacity="0.95" stroke="#EF4444" strokeWidth="2" />
        <text x="400" y="430" textAnchor="middle" fill="#991B1B" fontSize="16" fontWeight="bold">
          Key Principle: Questions Open Doors
        </text>
        <text x="400" y="455" textAnchor="middle" fill="#B91C1C" fontSize="13">
          A question you don't ask is an answer you'll never find.
        </text>
        <text x="400" y="475" textAnchor="middle" fill="#B91C1C" fontSize="12">
          More questions = more discovery = deeper understanding
        </text>
      </g>
    </svg>
  );
}

// Questions Room Concept Infographic
export function QuestionsRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qr2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF2F2" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id="qr2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <filter id="qr2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#qr2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#991B1B" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        The Art of Biblical Interrogation
      </text>

      {/* Levels of Questions */}
      <g transform="translate(50, 60)" filter="url(#qr2-shadow)">
        <rect x="0" y="0" width="700" height="180" rx="12" fill="white" fillOpacity="0.95" stroke="#EF4444" strokeWidth="2" />
        <text x="350" y="30" textAnchor="middle" fill="#991B1B" fontSize="16" fontWeight="bold">
          Three Levels of Questions
        </text>

        {/* Level 1 */}
        <rect x="20" y="50" width="200" height="110" rx="8" fill="#FEE2E2" fillOpacity="0.9" />
        <text x="120" y="75" textAnchor="middle" fill="#991B1B" fontSize="12" fontWeight="bold">Level 1: Factual</text>
        <text x="120" y="95" textAnchor="middle" fill="#B91C1C" fontSize="10">What happened?</text>
        <text x="120" y="112" textAnchor="middle" fill="#B91C1C" fontSize="10">Who was there?</text>
        <text x="120" y="129" textAnchor="middle" fill="#B91C1C" fontSize="10">When did it occur?</text>
        <text x="120" y="150" textAnchor="middle" fill="#7F1D1D" fontSize="9" fontStyle="italic">Surface data</text>

        {/* Level 2 */}
        <rect x="250" y="50" width="200" height="110" rx="8" fill="#FED7AA" fillOpacity="0.9" />
        <text x="350" y="75" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="bold">Level 2: Analytical</text>
        <text x="350" y="95" textAnchor="middle" fill="#C2410C" fontSize="10">Why this word choice?</text>
        <text x="350" y="112" textAnchor="middle" fill="#C2410C" fontSize="10">What pattern emerges?</text>
        <text x="350" y="129" textAnchor="middle" fill="#C2410C" fontSize="10">How does this connect?</text>
        <text x="350" y="150" textAnchor="middle" fill="#7C2D12" fontSize="9" fontStyle="italic">Deeper structure</text>

        {/* Level 3 */}
        <rect x="480" y="50" width="200" height="110" rx="8" fill="#D1FAE5" fillOpacity="0.9" />
        <text x="580" y="75" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">Level 3: Application</text>
        <text x="580" y="95" textAnchor="middle" fill="#047857" fontSize="10">What does this mean for me?</text>
        <text x="580" y="112" textAnchor="middle" fill="#047857" fontSize="10">How should I respond?</text>
        <text x="580" y="129" textAnchor="middle" fill="#047857" fontSize="10">What action is required?</text>
        <text x="580" y="150" textAnchor="middle" fill="#14532D" fontSize="9" fontStyle="italic">Personal impact</text>
      </g>

      {/* Question Multiplication */}
      <g filter="url(#qr2-shadow)">
        <rect x="50" y="260" width="700" height="100" rx="12" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <text x="400" y="290" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">
          Question Multiplication Technique
        </text>
        <text x="70" y="320" fill="#78350F" fontSize="12">
          Start: "Why did Jesus weep?" (John 11:35)
        </text>
        <text x="70" y="345" fill="#78350F" fontSize="11">
          Multiply: Was it grief? Frustration? Compassion? All three? Why use Greek "dakryō"? Who saw? What happened next?
        </text>
      </g>

      {/* Deliverable */}
      <g filter="url(#qr2-shadow)">
        <rect x="50" y="380" width="700" height="100" rx="12" fill="url(#qr2-header)" />
        <text x="400" y="415" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          Deliverable: Numbered Question List
        </text>
        <text x="400" y="445" textAnchor="middle" fill="#FECACA" fontSize="13">
          1. Who is speaking? 2. To whom? 3. Why this location? ... 50+
        </text>
        <text x="400" y="470" textAnchor="middle" fill="#FECACA" fontSize="12">
          If you have fewer than 50, you're not done asking!
        </text>
      </g>
    </svg>
  );
}

// Questions Room Example
export function QuestionsRoomExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qr3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF2F2" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECACA" />
        </linearGradient>
        <linearGradient id="qr3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <filter id="qr3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#qr3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#991B1B" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Matthew 14:22-33 (Walking on Water)
      </text>

      {/* Question List */}
      <g transform="translate(50, 55)" filter="url(#qr3-shadow)">
        <rect x="0" y="0" width="700" height="480" rx="12" fill="white" fillOpacity="0.95" stroke="#EF4444" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="40" rx="12" fill="url(#qr3-header)" />
        <text x="350" y="27" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Sample Questions (50 shown in grid)
        </text>

        {/* Questions Grid */}
        {[
          '1. Why did Jesus constrain disciples?',
          '2. Why send multitude away?',
          '3. Why go to mountain alone?',
          '4. What was He praying about?',
          '5. Why evening specifically?',
          '6. How far was boat from land?',
          '7. Why was wind contrary?',
          '8. What is fourth watch?',
          '9. Why did Jesus walk on water?',
          '10. Could He have calmed wind first?',
          '11. Why did disciples think ghost?',
          '12. What fear did they have?',
          '13. Why say "Be of good cheer"?',
          '14. Why say "It is I"?',
          '15. Why did Peter ask to come?',
          '16. Why only Peter?',
          '17. What enabled Peter to walk?',
          '18. What made Peter sink?',
          '19. Why did Jesus call him "little faith"?',
          '20. What happened when they boarded?',
          '21. Why did wind cease then?',
          '22. Why worship Jesus?',
          '23. What does "Son of God" mean here?',
          '24. Where did they land?',
          '25. Who recognized Jesus?',
          '26. Why bring sick to Him?',
          '27. What is hem of garment?',
          '28. Why were all healed?',
          '29. How does this connect to ch. 13?',
          '30. What does water symbolize?',
          '31. What does wind symbolize?',
          '32. Why nighttime?',
          '33. Fourth watch = what time?',
          '34. Why immediately after feeding?',
          '35. What is boat symbolically?',
          '36. Why Peter and not others?',
          '37. What is relationship of faith/fear?',
          '38. Why reach hand to Peter?',
          '39. Did Peter learn lesson?',
          '40. How apply to my storms?',
          '41. When do I sink?',
          '42. What voices distract me?',
          '43. How keep eyes on Jesus?',
          '44. Why does Jesus constrain me?',
          '45. What mountains do I need?',
          '46. How does doubt manifest?',
          '47. What is my hem of garment?',
          '48. Who am I bringing to Jesus?',
          '49. What contrary winds face me?',
          '50. When has Jesus met me in storm?',
        ].map((q, i) => (
          <text key={i} x={20 + (i % 2) * 345} y={65 + Math.floor(i / 2) * 17} fill="#7F1D1D" fontSize="9">
            {q}
          </text>
        ))}
      </g>

      {/* Note */}
      <g filter="url(#qr3-shadow)">
        <rect x="50" y="550" width="700" height="35" rx="8" fill="#D1FAE5" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <text x="400" y="573" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">
          50 questions from just 12 verses! Now answer them using other rooms.
        </text>
      </g>
    </svg>
  );
}

export default {
  QuestionsRoomFlowchart,
  QuestionsRoomConcept,
  QuestionsRoomExample
};
