import React from 'react';

/**
 * Enhanced Jeeves response formatter with beautiful styling, emojis, and proper formatting
 * Converts markdown-style text into visually appealing React components
 */
export const formatJeevesResponse = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // Clean up markdown-style formatting
  let cleanedText = text
    .replace(/^\s*\*\s+/gm, '• ') // Convert asterisk bullets to bullet points
    .replace(/^\s*-\s+/gm, '• ')  // Normalize dashes to bullets
    .trim();

  const blocks: React.ReactNode[] = [];
  let currentIndex = 0;

  // Split into blocks by double newlines
  const sections = cleanedText.split(/\n\n+/).filter(s => s.trim());

  sections.forEach((section, sectionIdx) => {
    const trimmed = section.trim();
    const lines = trimmed.split('\n');

    // Check for headings (##, ###, etc.)
    if (lines[0].match(/^#{1,6}\s+/)) {
      const headingMatch = lines[0].match(/^(#{1,6})\s+(.+)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const headingText = headingMatch[2];
        const emoji = getHeadingEmoji(headingText);
        
        blocks.push(
          <div 
            key={`heading-${sectionIdx}`} 
            className={`mb-4 mt-6 ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'} font-bold text-primary flex items-center gap-2`}
          >
            <span className="text-2xl">{emoji}</span>
            <span>{formatInlineText(headingText)}</span>
          </div>
        );
        
        // Process remaining lines
        if (lines.length > 1) {
          const remainingText = lines.slice(1).join('\n');
          blocks.push(...formatSection(remainingText, sectionIdx));
        }
        return;
      }
    }

    blocks.push(...formatSection(trimmed, sectionIdx));
  });

  return blocks;
};

/**
 * Format a section (paragraph, list, or quote)
 */
const formatSection = (text: string, baseKey: number): React.ReactNode[] => {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];

  // Check if it's a bulleted list
  const isBulletList = lines.some(line => line.trim().match(/^[•\-\*]\s+/));
  
  // Check if it's a numbered list
  const isNumberedList = lines.some(line => line.trim().match(/^\d+\.\s+/));

  // Check if it's a quote
  const isQuote = lines.every(line => line.trim().startsWith('>') || line.trim() === '');

  if (isQuote) {
    const quoteContent = lines
      .map(line => line.replace(/^>\s*/, ''))
      .join('\n')
      .trim();
    
    blocks.push(
      <div key={`quote-${baseKey}`} className="my-4 pl-4 border-l-4 border-primary/30 bg-accent/20 p-4 rounded-r-lg italic">
        <span className="text-xl mr-2">💭</span>
        {formatInlineText(quoteContent)}
      </div>
    );
  } else if (isBulletList) {
    const listItems: React.ReactNode[] = [];
    
    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^[•\-\*]\s+/)) {
        const content = trimmedLine.replace(/^[•\-\*]\s+/, '');
        const emoji = getBulletEmoji(content);
        
        listItems.push(
          <li 
            key={`bullet-${baseKey}-${idx}`} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-all group"
          >
            <span className="text-lg mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
              {emoji}
            </span>
            <span className="flex-1 leading-relaxed text-base">
              {formatInlineText(content)}
            </span>
          </li>
        );
      } else if (trimmedLine) {
        // Sub-content within list
        listItems.push(
          <div key={`bullet-text-${baseKey}-${idx}`} className="ml-9 mb-2 text-sm text-muted-foreground">
            {formatInlineText(trimmedLine)}
          </div>
        );
      }
    });

    blocks.push(
      <ul key={`list-${baseKey}`} className="mb-6 space-y-2 list-none pl-0">
        {listItems}
      </ul>
    );
  } else if (isNumberedList) {
    const listItems: React.ReactNode[] = [];
    
    lines.forEach((line, idx) => {
      const match = line.trim().match(/^(\d+)\.\s+(.+)/);
      if (match) {
        const number = match[1];
        const content = match[2];
        
        listItems.push(
          <li 
            key={`numbered-${baseKey}-${idx}`} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-all"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
              {number}
            </span>
            <span className="flex-1 leading-relaxed text-base">
              {formatInlineText(content)}
            </span>
          </li>
        );
      }
    });

    blocks.push(
      <ol key={`numbered-list-${baseKey}`} className="mb-6 space-y-2 list-none pl-0">
        {listItems}
      </ol>
    );
  } else {
    // Regular paragraph
    const content = lines.join(' ').trim();
    if (content) {
      blocks.push(
        <p key={`para-${baseKey}`} className="mb-4 leading-relaxed text-base">
          {formatInlineText(content)}
        </p>
      );
    }
  }

  return blocks;
};

/**
 * Format inline text with bold, italic, code, and emojis
 */
const formatInlineText = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    // Handle bold text (**text** or __text__)
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      const boldText = boldMatch[2];
      parts.push(
        <strong key={`bold-${keyCounter++}`} className="font-bold text-primary">
          {boldText}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Handle italic text (*text* or _text_)
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      const italicText = italicMatch[2];
      parts.push(
        <em key={`italic-${keyCounter++}`} className="italic text-muted-foreground">
          {italicText}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Handle inline code (`code`)
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const codeText = codeMatch[1];
      parts.push(
        <code 
          key={`code-${keyCounter++}`} 
          className="px-2 py-0.5 rounded bg-muted font-mono text-sm border border-border"
        >
          {codeText}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Handle verse references (e.g., John 3:16, Genesis 1:1-5)
    const verseMatch = remaining.match(/^([1-3]?\s*[A-Z][a-z]+\s+\d+:\d+(-\d+)?)/);
    if (verseMatch) {
      const verseText = verseMatch[1];
      parts.push(
        <span 
          key={`verse-${keyCounter++}`} 
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-sm"
        >
          <span>📖</span>
          <span>{verseText}</span>
        </span>
      );
      remaining = remaining.slice(verseMatch[0].length);
      continue;
    }

    // Handle URLs (make them clickable links)
    const urlMatch = remaining.match(/^(https?:\/\/\S+)/);
    if (urlMatch) {
      const url = urlMatch[1];
      parts.push(
        <a
          key={`url-${keyCounter++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary hover:text-primary/80 break-words"
        >
          {url}
        </a>
      );
      remaining = remaining.slice(urlMatch[0].length);
      continue;
    }

    // Regular character
    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return <>{parts}</>;
};

/**
 * Get contextual emoji for headings
 */
const getHeadingEmoji = (text: string): string => {
  const lower = text.toLowerCase();
  
  if (lower.includes('key') || lower.includes('important')) return '🔑';
  if (lower.includes('summary') || lower.includes('conclusion')) return '📝';
  if (lower.includes('question') || lower.includes('why')) return '❓';
  if (lower.includes('example') || lower.includes('instance')) return '💡';
  if (lower.includes('warning') || lower.includes('caution')) return '⚠️';
  if (lower.includes('note') || lower.includes('remember')) return '📌';
  if (lower.includes('christ') || lower.includes('jesus')) return '✝️';
  if (lower.includes('scripture') || lower.includes('verse')) return '📖';
  if (lower.includes('prayer') || lower.includes('worship')) return '🙏';
  if (lower.includes('study') || lower.includes('learn')) return '📚';
  
  return '✨';
};

/**
 * Get contextual emoji for bullet points
 */
const getBulletEmoji = (text: string): string => {
  const lower = text.toLowerCase();
  
  if (lower.includes('christ') || lower.includes('jesus') || lower.includes('messiah')) return '✝️';
  if (lower.includes('prayer') || lower.includes('pray')) return '🙏';
  if (lower.includes('love') || lower.includes('grace')) return '❤️';
  if (lower.includes('wisdom') || lower.includes('understand')) return '🧠';
  if (lower.includes('faith') || lower.includes('believe')) return '⭐';
  if (lower.includes('hope') || lower.includes('promise')) return '🌟';
  if (lower.includes('peace') || lower.includes('rest')) return '☮️';
  if (lower.includes('joy') || lower.includes('rejoice')) return '😊';
  if (lower.includes('spirit') || lower.includes('holy')) return '🕊️';
  if (lower.includes('light') || lower.includes('truth')) return '💡';
  if (lower.includes('bible') || lower.includes('scripture') || lower.includes('verse')) return '📖';
  if (lower.includes('temple') || lower.includes('sanctuary')) return '⛪';
  if (lower.includes('covenant') || lower.includes('promise')) return '🤝';
  if (lower.includes('prophet') || lower.includes('prophecy')) return '🔮';
  if (lower.includes('angel')) return '👼';
  if (lower.includes('heaven')) return '☁️';
  if (lower.includes('cross') || lower.includes('crucif')) return '✞';
  if (lower.includes('resurrection') || lower.includes('risen')) return '🌅';
  
  return '✨';
};
