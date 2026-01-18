import React from 'react';

// Personal Freestyle Room Method Flowchart
export function PersonalFreestyleFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pf-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="pf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id="pf-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <filter id="pf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
        <filter id="pf-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <marker id="arrow-pf" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#EC4899" />
        </marker>
      </defs>

      <rect width="800" height="500" fill="url(#pf-bg)" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#9D174D" fontSize="24" fontWeight="bold" letterSpacing="0.5">
        Personal Freestyle: Your Story in Scripture
      </text>

      {/* Life → Scripture → Testimony Flow */}
      <g transform="translate(50, 70)">
        {/* Life Experience Circle */}
        <g filter="url(#pf-glow)">
          <circle cx="120" cy="100" r="80" fill="url(#pf-grad)" />
          <text x="120" y="85" textAnchor="middle" fill="white" fontSize="36">🧠</text>
          <text x="120" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">YOUR LIFE</text>
          <text x="120" y="135" textAnchor="middle" fill="#FBCFE8" fontSize="11">Experience, Memory</text>
        </g>

        {/* Arrow */}
        <path d="M210 100 L290 100" stroke="#EC4899" strokeWidth="4" fill="none" markerEnd="url(#arrow-pf)" />

        {/* Scripture Mirror Circle */}
        <g filter="url(#pf-glow)">
          <circle cx="380" cy="100" r="80" fill="#3B82F6" />
          <text x="380" y="85" textAnchor="middle" fill="white" fontSize="36">📖</text>
          <text x="380" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SCRIPTURE</text>
          <text x="380" y="135" textAnchor="middle" fill="#BFDBFE" fontSize="11">Find the Mirror</text>
        </g>

        {/* Arrow */}
        <path d="M470 100 L550 100" stroke="#EC4899" strokeWidth="4" fill="none" markerEnd="url(#arrow-pf)" />

        {/* Testimony Circle */}
        <g filter="url(#pf-glow)">
          <circle cx="640" cy="100" r="80" fill="#F59E0B" />
          <text x="640" y="85" textAnchor="middle" fill="white" fontSize="36">🎤</text>
          <text x="640" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">TESTIMONY</text>
          <text x="640" y="135" textAnchor="middle" fill="#FEF3C7" fontSize="11">Share the Truth</text>
        </g>
      </g>

      {/* Method Steps */}
      <g filter="url(#pf-shadow)">
        <rect x="50" y="220" width="700" height="130" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <text x="400" y="250" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
          The Personal Freestyle Method
        </text>

        <g transform="translate(70, 270)">
          {[
            { step: '1', text: 'Recall: Identify a meaningful life experience', icon: '💭' },
            { step: '2', text: 'Reflect: What principle or emotion is present?', icon: '🪞' },
            { step: '3', text: 'Research: Find a Bible story or verse that mirrors it', icon: '🔍' },
            { step: '4', text: 'Relate: Connect your story to God\'s truth', icon: '🔗' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 165}, 0)`}>
              <circle cx="20" cy="25" r="20" fill="url(#pf-grad)" filter="url(#pf-glow)" />
              <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
              <text x="20" y="55" textAnchor="middle" fontSize="18">{item.icon}</text>
              <text x="20" y="75" textAnchor="middle" fill="#9D174D" fontSize="9">{item.text}</text>
            </g>
          ))}
        </g>
      </g>

      {/* Key Principle */}
      <g filter="url(#pf-shadow)">
        <rect x="50" y="370" width="700" height="110" rx="12" fill="#FCE7F3" fillOpacity="0.9" stroke="#EC4899" strokeWidth="2" />
        <text x="400" y="400" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
          The Mirror Principle
        </text>
        <text x="400" y="425" textAnchor="middle" fill="#BE185D" fontSize="13">
          Your story is never just yours — it's a reflection of eternal truth.
        </text>
        <text x="400" y="450" textAnchor="middle" fill="#BE185D" fontSize="12">
          Every human experience has a biblical parallel waiting to be discovered.
        </text>
        <text x="400" y="470" textAnchor="middle" fill="#9D174D" fontSize="11" fontStyle="italic">
          "They overcame him by the blood of the Lamb and by the word of their testimony" (Rev 12:11)
        </text>
      </g>
    </svg>
  );
}

// Personal Freestyle Room Concept Infographic
export function PersonalFreestyleConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pf2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="pf2-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <filter id="pf2-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="550" fill="url(#pf2-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Experience Categories → Scripture Mirrors
      </text>

      {/* Categories Grid */}
      <g transform="translate(50, 55)">
        {[
          { exp: 'Suffering', icon: '😢', mirror: 'Job, Psalms, Christ\'s Passion', question: 'Where is God in pain?' },
          { exp: 'Victory', icon: '🏆', mirror: 'David, Joshua, Revelation', question: 'Who gave the victory?' },
          { exp: 'Failure', icon: '😞', mirror: 'Peter, Samson, Prodigal Son', question: 'How does God restore?' },
          { exp: 'Waiting', icon: '⏳', mirror: 'Abraham, Joseph, Simeon', question: 'What is God developing?' },
          { exp: 'Provision', icon: '🎁', mirror: 'Elijah, Manna, Loaves/Fish', question: 'How does God provide?' },
          { exp: 'Calling', icon: '📢', mirror: 'Moses, Isaiah, Paul', question: 'What is God\'s purpose?' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 130})`} filter="url(#pf2-shadow)">
            <rect x="0" y="0" width="220" height="120" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
            <text x="110" y="35" textAnchor="middle" fontSize="28">{item.icon}</text>
            <text x="110" y="55" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">{item.exp}</text>
            <text x="110" y="75" textAnchor="middle" fill="#BE185D" fontSize="10">→ {item.mirror}</text>
            <text x="110" y="100" textAnchor="middle" fill="#DB2777" fontSize="9" fontStyle="italic">"{item.question}"</text>
          </g>
        ))}
      </g>

      {/* Testimony Structure */}
      <g filter="url(#pf2-shadow)">
        <rect x="50" y="330" width="700" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <text x="400" y="360" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
          Testimony Structure
        </text>
        <g transform="translate(70, 375)">
          {[
            { part: 'BEFORE', desc: 'My situation/struggle', color: '#FEE2E2' },
            { part: 'BIBLE', desc: 'The Scripture that spoke', color: '#DBEAFE' },
            { part: 'BRIDGE', desc: 'How they connected', color: '#FEF3C7' },
            { part: 'AFTER', desc: 'The transformation', color: '#D1FAE5' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 165}, 0)`}>
              <rect x="0" y="0" width="150" height="40" rx="8" fill={item.color} />
              <text x="75" y="18" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">{item.part}</text>
              <text x="75" y="33" textAnchor="middle" fill="#6B7280" fontSize="9">{item.desc}</text>
            </g>
          ))}
        </g>
      </g>

      {/* Deliverable */}
      <g filter="url(#pf2-shadow)">
        <rect x="50" y="450" width="700" height="80" rx="12" fill="url(#pf2-header)" />
        <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          Deliverable: Personal Testimony Collection
        </text>
        <text x="400" y="505" textAnchor="middle" fill="#FBCFE8" fontSize="13">
          My Experience + Biblical Mirror + Bridge Statement + Life Application
        </text>
        <text x="400" y="525" textAnchor="middle" fill="#FBCFE8" fontSize="11">
          Build your unique testimony library — every story is a sermon
        </text>
      </g>
    </svg>
  );
}

// Personal Freestyle Room Example
export function PersonalFreestyleExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pf3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="50%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
        <linearGradient id="pf3-header" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <filter id="pf3-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#pf3-bg)" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold" letterSpacing="0.5">
        Example: Betrayal → Joseph's Story
      </text>

      {/* Life Experience */}
      <g transform="translate(50, 55)" filter="url(#pf3-shadow)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="white" fillOpacity="0.95" stroke="#EC4899" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12" fill="url(#pf3-header)" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 1: The Personal Experience
        </text>

        <text x="30" y="60" fill="#9D174D" fontSize="12" fontWeight="bold">My Story:</text>
        <text x="30" y="78" fill="#BE185D" fontSize="11">
          "A trusted friend spread lies about me and destroyed a relationship I valued."
        </text>
        <text x="30" y="93" fill="#DB2777" fontSize="10" fontStyle="italic">
          Emotion: Hurt, anger, confusion, desire for vindication
        </text>
      </g>

      {/* Scripture Mirror */}
      <g transform="translate(50, 165)" filter="url(#pf3-shadow)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="#EFF6FF" fillOpacity="0.95" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12" fill="#3B82F6" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 2: The Scripture Mirror
        </text>

        <text x="30" y="60" fill="#1E40AF" fontSize="12" fontWeight="bold">Joseph's Story (Genesis 37-50)</text>
        <text x="30" y="80" fill="#1D4ED8" fontSize="11">• Brothers sold him into slavery out of jealousy</text>
        <text x="30" y="97" fill="#1D4ED8" fontSize="11">• Potiphar's wife lied, sending him to prison</text>
        <text x="30" y="114" fill="#1D4ED8" fontSize="11">• Years of waiting with no vindication in sight</text>
      </g>

      {/* Bridge Connection */}
      <g transform="translate(50, 295)" filter="url(#pf3-shadow)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#FEF3C7" fillOpacity="0.95" stroke="#F59E0B" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12" fill="#F59E0B" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 3: The Bridge Statement
        </text>

        <text x="30" y="60" fill="#92400E" fontSize="11">
          "Like Joseph, I was betrayed by someone I trusted. Like Joseph, I felt forgotten in the pit.
        </text>
        <text x="30" y="78" fill="#92400E" fontSize="11">
          But Joseph's story doesn't end in the pit — and neither does mine.
        </text>
        <text x="30" y="93" fill="#78350F" fontSize="11" fontStyle="italic">
          Genesis 50:20 — 'You meant it for evil, but God meant it for good.'"
        </text>
      </g>

      {/* Transformation */}
      <g transform="translate(50, 405)" filter="url(#pf3-shadow)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#D1FAE5" fillOpacity="0.95" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12" fill="#10B981" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 4: The Transformation
        </text>

        <text x="30" y="60" fill="#065F46" fontSize="11">
          <tspan fontWeight="bold">What I learned:</tspan> God uses betrayal as a redirect, not a dead end.
        </text>
        <text x="30" y="78" fill="#065F46" fontSize="11">
          <tspan fontWeight="bold">What changed:</tspan> I released bitterness; I trusted God's timing for vindication.
        </text>
        <text x="30" y="95" fill="#047857" fontSize="11" fontStyle="italic">
          My story now carries weight — I can speak to others in the "pit" with authority.
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="515" width="700" height="70" rx="12" fill="url(#pf3-header)" filter="url(#pf3-shadow)" />
      <text x="400" y="545" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Testimony Formula
      </text>
      <text x="400" y="568" textAnchor="middle" fill="#FBCFE8" fontSize="12">
        My Experience + Scripture Mirror + Bridge Statement = Shareable Truth
      </text>
    </svg>
  );
}

export default {
  PersonalFreestyleFlowchart,
  PersonalFreestyleConcept,
  PersonalFreestyleExample
};
