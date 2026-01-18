import React from 'react';

// Q&A Chains Room Method Flowchart
export function QAChainsFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qa-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="qa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="qa-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="qa-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="qa-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#qa-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Q&A Chains: Scripture Interprets Scripture
      </text>

      {/* Chain Visualization */}
      <g transform="translate(50, 70)">
        {/* Link 1 */}
        <g filter="url(#qa-glow)">
          <ellipse cx="100" cy="60" rx="80" ry="40" fill="url(#qa-grad)" />
          <text x="100" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Question</text>
          <text x="100" y="73" textAnchor="middle" fill="#DDD6FE" fontSize="10">from Passage A</text>
        </g>

        {/* Chain link */}
        <path d="M180 60 Q220 60 220 100 Q220 140 260 140" stroke="#8B5CF6" strokeWidth="4" fill="none" />

        {/* Link 2 */}
        <g filter="url(#qa-glow)">
          <ellipse cx="340" cy="140" rx="80" ry="40" fill="url(#qa-grad)" />
          <text x="340" y="135" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Answer</text>
          <text x="340" y="153" textAnchor="middle" fill="#DDD6FE" fontSize="10">from Passage B</text>
        </g>

        {/* Chain link */}
        <path d="M420 140 Q460 140 460 180 Q460 220 500 220" stroke="#8B5CF6" strokeWidth="4" fill="none" />

        {/* Link 3 */}
        <g filter="url(#qa-glow)">
          <ellipse cx="580" cy="220" rx="80" ry="40" fill="url(#qa-grad)" />
          <text x="580" y="215" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">New Question</text>
          <text x="580" y="233" textAnchor="middle" fill="#DDD6FE" fontSize="10">arises...</text>
        </g>

        {/* Continuing arrow */}
        <path d="M660 220 L700 220" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="8,4" />
        <text x="720" y="225" fill="#8B5CF6" fontSize="20">∞</text>
      </g>

      {/* The Principle */}
      <g filter="url(#qa-shadow)">
        <rect x="50" y="290" width="700" height="90" rx="12" fill="white" fillOpacity="0.95" stroke="#8B5CF6" strokeWidth="2" />
        <text x="400" y="325" textAnchor="middle" fill="#5B21B6" fontSize="16" fontWeight="bold">
          The Principle: Scripture is its own best interpreter
        </text>
        <text x="400" y="355" textAnchor="middle" fill="#6D28D9" fontSize="13">
          Never interpret a verse in isolation. Find related passages that shed light on your question.
        </text>
      </g>

      {/* Method Steps */}
      <g transform="translate(50, 400)">
        {[
          { step: '1', text: 'Start with a question from your list' },
          { step: '2', text: 'Search for related passages (keywords, themes)' },
          { step: '3', text: 'Let clearer passages explain unclear ones' },
          { step: '4', text: 'Document the chain of references' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 175}, 0)`} filter="url(#qa-shadow)">
            <circle cx="20" cy="25" r="20" fill="url(#qa-grad)" filter="url(#qa-glow)" />
            <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
            <text x="20" y="65" textAnchor="middle" fill="#5B21B6" fontSize="9" width="160">{item.text}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// Q&A Chains Room Concept Infographic
export function QAChainsConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qa2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="qa2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="qa2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#qa2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Building Chains: The Method
      </text>

      {/* Types of Chain Links */}
      <g transform="translate(50, 60)" filter="url(#qa2-shadow)">
        <rect x="0" y="0" width="700" height="200" rx="12" fill="white" fillOpacity="0.95" stroke="#8B5CF6" strokeWidth="2" />
        <text x="350" y="30" textAnchor="middle" fill="#5B21B6" fontSize="16" fontWeight="bold">
          Types of Chain Connections
        </text>

        {[
          { type: 'Word Link', desc: 'Same Hebrew/Greek word appears', example: '"Faith" in Hab 2:4 → Rom 1:17 → Gal 3:11' },
          { type: 'Theme Link', desc: 'Same concept or idea', example: '"Shepherd" in Ps 23 → John 10 → 1 Pet 5:4' },
          { type: 'Quote Link', desc: 'NT quotes OT directly', example: 'Ps 22:1 → Matt 27:46' },
          { type: 'Type Link', desc: 'OT event foreshadows NT', example: 'Bronze serpent → John 3:14' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 2) * 350 + 20}, ${Math.floor(i / 2) * 80 + 50})`}>
            <rect x="0" y="0" width="320" height="70" rx="8" fill={i % 2 === 0 ? '#EDE9FE' : '#F5F3FF'} />
            <text x="160" y="22" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">{item.type}</text>
            <text x="160" y="40" textAnchor="middle" fill="#6D28D9" fontSize="10">{item.desc}</text>
            <text x="160" y="58" textAnchor="middle" fill="#7C3AED" fontSize="9" fontStyle="italic">{item.example}</text>
          </g>
        ))}
      </g>

      {/* Chain Notation */}
      <g filter="url(#qa2-shadow)">
        <rect x="50" y="280" width="700" height="100" rx="12" fill="#DDD6FE" fillOpacity="0.9" stroke="#8B5CF6" strokeWidth="2" />
        <text x="400" y="310" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          Chain Notation Format
        </text>
        <text x="400" y="340" textAnchor="middle" fill="#6D28D9" fontSize="13" fontFamily="monospace">
          Q: "What is faith?" → Heb 11:1 → Hab 2:4 → Rom 1:17 → Gal 3:11 → Jas 2:17
        </text>
        <text x="400" y="365" textAnchor="middle" fill="#7C3AED" fontSize="11">
          A: Faith is confident trust (Heb 11:1) that produces righteous living (Hab/Rom/Gal) and works (Jas)
        </text>
      </g>

      {/* Tools */}
      <g filter="url(#qa2-shadow)">
        <rect x="50" y="400" width="700" height="80" rx="12" fill="white" fillOpacity="0.95" stroke="#8B5CF6" strokeWidth="2" />
        <text x="400" y="430" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          Chain-Building Tools
        </text>
        <text x="400" y="455" textAnchor="middle" fill="#6D28D9" fontSize="12">
          Concordance | Cross-Reference Bible | Treasury of Scripture Knowledge | Blue Letter Bible
        </text>
        <text x="400" y="475" textAnchor="middle" fill="#7C3AED" fontSize="11">
          Always trace the chain BEFORE forming conclusions
        </text>
      </g>
    </svg>
  );
}

// Q&A Chains Room Example
export function QAChainsExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qa3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="50%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="qa3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <filter id="qa3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#qa3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example Chain: "What is the Sabbath for?"
      </text>

      {/* Chain Visual */}
      <g transform="translate(50, 55)" filter="url(#qa3-shadow)">
        <rect x="0" y="0" width="700" height="480" rx="12" fill="white" fillOpacity="0.95" stroke="#8B5CF6" strokeWidth="2" />

        {/* Question */}
        <rect x="250" y="20" width="200" height="50" rx="25" fill="url(#qa3-header)" />
        <text x="350" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Q: What is Sabbath for?
        </text>

        {/* Chain Links */}
        {[
          { ref: 'Gen 2:2-3', text: 'God rested, blessed, sanctified', y: 90, insight: 'Origin: Divine rest and holiness' },
          { ref: 'Ex 20:8-11', text: 'Remember... keep it holy', y: 160, insight: 'Command: Memorial of creation' },
          { ref: 'Deut 5:15', text: 'Remember you were slaves', y: 230, insight: 'Purpose: Freedom from bondage' },
          { ref: 'Isa 58:13-14', text: 'Call it a delight', y: 300, insight: 'Attitude: Joy, not burden' },
          { ref: 'Mark 2:27', text: 'Sabbath made for man', y: 370, insight: 'Design: For human benefit' },
          { ref: 'Heb 4:9-11', text: 'There remains a rest', y: 440, insight: 'Fulfillment: Eternal rest in Christ' },
        ].map((link, i) => (
          <g key={i}>
            {/* Connector line */}
            {i > 0 && <line x1="350" y1={link.y - 25} x2="350" y2={link.y} stroke="#8B5CF6" strokeWidth="2" />}

            {/* Link box */}
            <rect x="100" y={link.y} width="500" height="55" rx="8" fill={i % 2 === 0 ? '#EDE9FE' : '#F5F3FF'} stroke="#A78BFA" strokeWidth="1" />

            {/* Reference */}
            <rect x="110" y={link.y + 8} width="120" height="25" rx="5" fill="url(#qa3-header)" />
            <text x="170" y={link.y + 26} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{link.ref}</text>

            {/* Text */}
            <text x="250" y={link.y + 28} fill="#5B21B6" fontSize="11">"{link.text}"</text>

            {/* Insight */}
            <text x="420" y={link.y + 28} fill="#7C3AED" fontSize="10" fontStyle="italic">→ {link.insight}</text>

            {/* Chain icon */}
            <text x="580" y={link.y + 32} fill="#A78BFA" fontSize="16">🔗</text>
          </g>
        ))}
      </g>

      {/* Summary */}
      <rect x="50" y="550" width="700" height="35" rx="8" fill="url(#qa3-header)" filter="url(#qa3-shadow)" />
      <text x="400" y="573" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Chain Answer: Sabbath = Creation memorial, freedom sign, joyful rest, pointing to eternal rest in Christ
      </text>
    </svg>
  );
}

export default {
  QAChainsFlowchart,
  QAChainsConcept,
  QAChainsExample
};
