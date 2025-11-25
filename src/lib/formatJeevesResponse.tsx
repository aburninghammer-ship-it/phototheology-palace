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

  // Split into blocks by double newlines OR by sentences for better readability
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
 * Format a section (paragraph, list, or quote) with enhanced visual appeal
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
    // Split long paragraphs into sentences for better readability
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    if (sentences.length > 3) {
      // Break into smaller paragraphs every 2-3 sentences
      const chunks: string[] = [];
      for (let i = 0; i < sentences.length; i += 2) {
        chunks.push(sentences.slice(i, i + 2).join(' ').trim());
      }
      
      chunks.forEach((chunk, idx) => {
        if (chunk) {
          blocks.push(
            <p key={`para-${baseKey}-${idx}`} className="mb-4 leading-relaxed text-base">
              {formatInlineText(chunk)}
            </p>
          );
        }
      });
    } else {
      // Short paragraph, keep as-is
      const content = lines.join(' ').trim();
      if (content) {
        blocks.push(
          <p key={`para-${baseKey}`} className="mb-4 leading-relaxed text-base">
            {formatInlineText(content)}
          </p>
        );
      }
    }
  }

  return blocks;
};

/**
 * Format inline text with bold, italic, code, emojis, and PT room codes
 */
const formatInlineText = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    // Handle PT room codes (e.g., SR, DR, 1D, @Ab, ∞)
    const roomCodeMatch = remaining.match(/^([A-Z]{1,3}R?m?|∞|@[A-Z][a-z]+|\d+D)(\s*\([^)]+\))?/);
    if (roomCodeMatch) {
      const code = roomCodeMatch[1];
      const description = roomCodeMatch[2] || '';
      const roomColor = getRoomColor(code);
      
      parts.push(
        <span 
          key={`room-${keyCounter++}`} 
          className="inline-flex items-center gap-1 mx-0.5"
        >
          <span 
            className={`px-2 py-0.5 rounded-md font-bold text-xs ${roomColor} border shadow-sm`}
          >
            {code}
          </span>
          {description && (
            <span className="text-sm text-muted-foreground italic">
              {description}
            </span>
          )}
        </span>
      );
      remaining = remaining.slice(roomCodeMatch[0].length);
      continue;
    }

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
 * Get color styling for PT room codes
 */
const getRoomColor = (code: string): string => {
  // Floor 1 - Furnishing (Width)
  if (code.match(/^(SR|IR|24F?|BR|TR|GR)$/)) return 'bg-blue-100 text-blue-700 border-blue-300';
  
  // Floor 2 - Investigation (Width)
  if (code.match(/^(OR|DC|ST|QR|QA)$/)) return 'bg-purple-100 text-purple-700 border-purple-300';
  
  // Floor 3 - Freestyle (Time)
  if (code.match(/^(NF|PF|BF|HF|LR)$/)) return 'bg-green-100 text-green-700 border-green-300';
  
  // Floor 4 - Next Level (Depth)
  if (code.match(/^(CR|DR|C6|TRm|TZ|PRm|P\|\||FRt)$/)) return 'bg-orange-100 text-orange-700 border-orange-300';
  
  // Floor 5 - Vision (Depth)
  if (code.match(/^(BL|PR|3A)$/)) return 'bg-red-100 text-red-700 border-red-300';
  
  // Floor 6 - Cycles & Heavens (Depth)
  if (code.match(/^@(Ad|No|Ab|Mo|Cy|CyC|Sp|Re)$/)) return 'bg-indigo-100 text-indigo-700 border-indigo-300';
  if (code.match(/^(1H|2H|3H|JR)$/)) return 'bg-indigo-100 text-indigo-700 border-indigo-300';
  
  // Floor 7 - Spiritual/Emotional (Height)
  if (code.match(/^(FRm|MR|SR)$/)) return 'bg-pink-100 text-pink-700 border-pink-300';
  
  // Floor 8 - Master (Height)
  if (code === '∞') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  
  // Dimensions
  if (code.match(/^\d+D$/)) return 'bg-cyan-100 text-cyan-700 border-cyan-300';
  
  // Default
  return 'bg-gray-100 text-gray-700 border-gray-300';
};

/**
 * Get contextual emoji for headings
 */
const getHeadingEmoji = (text: string): string => {
  const lower = text.toLowerCase();
  
  // PT-specific rooms and concepts
  if (lower.includes('story room') || lower.includes('sr')) return '📚';
  if (lower.includes('observation') || lower.includes('or')) return '🔍';
  if (lower.includes('dimension') || lower.includes('dr')) return '🌐';
  if (lower.includes('concentration') || lower.includes('cr')) return '🎯';
  if (lower.includes('theme room') || lower.includes('trm')) return '🏛️';
  if (lower.includes('pattern') || lower.includes('prm')) return '🔄';
  if (lower.includes('parallel') || lower.includes('p||')) return '⚖️';
  if (lower.includes('fruit room') || lower.includes('frt')) return '🍇';
  if (lower.includes('imagination') || lower.includes('ir')) return '✨';
  if (lower.includes('meditation') || lower.includes('mr')) return '🧘';
  if (lower.includes('bible freestyle') || lower.includes('bf')) return '🔗';
  if (lower.includes('infinity') || lower.includes('∞')) return '♾️';
  
  // Biblical themes
  if (lower.includes('christ') || lower.includes('jesus') || lower.includes('messiah')) return '✝️';
  if (lower.includes('prophecy') || lower.includes('vision')) return '🔮';
  if (lower.includes('sanctuary') || lower.includes('temple')) return '⛪';
  if (lower.includes('gospel') || lower.includes('good news')) return '📣';
  if (lower.includes('summary') || lower.includes('conclusion')) return '📝';
  if (lower.includes('key') || lower.includes('important')) return '🔑';
  
  return '✨';
};

/**
 * Get contextual emoji for bullet points
 */
const getBulletEmoji = (text: string): string => {
  const lower = text.toLowerCase();
  
  // PT room/floor references
  if (lower.match(/\b(sr|story room)\b/)) return '📚';
  if (lower.match(/\b(or|observation)\b/)) return '🔍';
  if (lower.match(/\b(dr|dimension)\b/)) return '🌐';
  if (lower.match(/\b(cr|concentration)\b/)) return '🎯';
  if (lower.match(/\b(trm|theme)\b/)) return '🏛️';
  if (lower.match(/\b(ir|imagination)\b/)) return '✨';
  if (lower.match(/\b(mr|meditation)\b/)) return '🧘';
  if (lower.match(/\b(bf|freestyle)\b/)) return '🔗';
  if (lower.match(/\b(frt|fruit)\b/)) return '🍇';
  
  // Content types
  if (lower.includes('christ') || lower.includes('jesus')) return '✝️';
  if (lower.includes('light')) return '💡';
  if (lower.includes('truth')) return '💎';
  if (lower.includes('transparent') || lower.includes('reveal')) return '🪟';
  if (lower.includes('work') || lower.includes('deed')) return '🔨';
  if (lower.includes('god')) return '🙏';
  if (lower.includes('love') || lower.includes('grace')) return '❤️';
  if (lower.includes('wisdom')) return '🧠';
  if (lower.includes('prayer')) return '🙏';
  if (lower.includes('scripture') || lower.includes('verse')) return '📖';
  if (lower.includes('heaven')) return '☁️';
  
  return '▪️';
};
