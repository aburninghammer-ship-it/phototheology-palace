import React from 'react';

/**
 * Enhanced Jeeves response formatter with beautiful styling, emojis, and proper formatting
 * Converts markdown-style text into visually appealing React components
 */
export const formatJeevesResponse = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // Decode HTML entities first
  let cleanedText = text
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/^\s*\*\s+/gm, '• ') // Convert asterisk bullets to bullet points
    .replace(/^\s*-\s+/gm, '• ')  // Normalize dashes to bullets
    .trim();

  const blocks: React.ReactNode[] = [];

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
        const bgColor = getHeadingBgColor(headingText, level);
        
        blocks.push(
          <div 
            key={`heading-${sectionIdx}`} 
            className={`mb-6 mt-8 p-4 rounded-lg ${bgColor}`}
          >
            <div className={`${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'} font-bold flex items-center gap-3 text-foreground`}>
              <span className="text-2xl">{emoji}</span>
              <span>{formatInlineText(headingText)}</span>
            </div>
          </div>
        );
        
        // Process remaining lines with extra spacing
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
 * Get background color for headings based on content
 */
const getHeadingBgColor = (text: string, level: number): string => {
  const lower = text.toLowerCase();
  
  // Topic-specific colors
  if (lower.includes('overview') || lower.includes('introduction')) return 'bg-blue-500/10 border-l-4 border-blue-500';
  if (lower.includes('biblical') || lower.includes('scripture')) return 'bg-amber-500/10 border-l-4 border-amber-500';
  if (lower.includes('christ') || lower.includes('jesus')) return 'bg-purple-500/10 border-l-4 border-purple-500';
  if (lower.includes('application') || lower.includes('practical')) return 'bg-green-500/10 border-l-4 border-green-500';
  if (lower.includes('analysis') || lower.includes('interpretation')) return 'bg-indigo-500/10 border-l-4 border-indigo-500';
  if (lower.includes('historical') || lower.includes('history')) return 'bg-orange-500/10 border-l-4 border-orange-500';
  if (lower.includes('prophecy') || lower.includes('vision')) return 'bg-red-500/10 border-l-4 border-red-500';
  if (lower.includes('summary') || lower.includes('conclusion')) return 'bg-cyan-500/10 border-l-4 border-cyan-500';
  if (lower.includes('key') || lower.includes('important')) return 'bg-yellow-500/10 border-l-4 border-yellow-500';
  
  // Default based on level
  if (level === 1) return 'bg-primary/10 border-l-4 border-primary';
  if (level === 2) return 'bg-accent/50 border-l-4 border-accent-foreground/30';
  return 'bg-muted/50 border-l-4 border-muted-foreground/30';
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
  const isQuote = lines.some(line => line.trim().startsWith('>'));

  if (isQuote) {
    // Process quotes mixed with regular text
    let currentQuote: string[] = [];
    
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('>')) {
        currentQuote.push(line.replace(/^>\s*/, ''));
      } else if (currentQuote.length > 0) {
        // End current quote block
        blocks.push(
          <div key={`quote-${baseKey}-${idx}`} className="my-6 pl-5 border-l-4 border-amber-400 bg-amber-500/15 p-5 rounded-r-lg">
            <span className="text-xl mr-2">📜</span>
            <span className="italic font-medium text-foreground">{formatInlineText(currentQuote.join(' '))}</span>
          </div>
        );
        currentQuote = [];
        
        // Process non-quote line
        if (line.trim()) {
          blocks.push(
            <p key={`para-${baseKey}-${idx}`} className="mb-5 leading-relaxed text-base text-foreground">
              {formatInlineText(line)}
            </p>
          );
        }
      } else if (line.trim()) {
        blocks.push(
          <p key={`para-${baseKey}-${idx}`} className="mb-5 leading-relaxed text-base text-foreground">
            {formatInlineText(line)}
          </p>
        );
      }
    });
    
    // Handle remaining quote
    if (currentQuote.length > 0) {
      blocks.push(
        <div key={`quote-final-${baseKey}`} className="my-6 pl-5 border-l-4 border-amber-400 bg-amber-500/15 p-5 rounded-r-lg">
          <span className="text-xl mr-2">📜</span>
          <span className="italic font-medium text-foreground">{formatInlineText(currentQuote.join(' '))}</span>
        </div>
      );
    }
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
            className="flex items-start gap-4 p-4 pl-6 rounded-lg hover:bg-accent/20 transition-all group mb-2 border-l-2 border-primary/30"
          >
            <span className="text-lg mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
              {emoji}
            </span>
            <span className="flex-1 leading-relaxed text-base text-foreground">
              {formatInlineText(content)}
            </span>
          </li>
        );
      } else if (trimmedLine) {
        // Sub-content within list
        listItems.push(
          <div key={`bullet-text-${baseKey}-${idx}`} className="ml-12 mb-3 pl-4 border-l-2 border-muted-foreground/30 text-sm text-foreground/80 leading-relaxed">
            {formatInlineText(trimmedLine)}
          </div>
        );
      }
    });

    blocks.push(
      <ul key={`list-${baseKey}`} className="mb-8 space-y-1 list-none pl-0 bg-muted/30 rounded-lg p-4">
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
            className="flex items-start gap-4 p-4 pl-6 rounded-lg hover:bg-accent/20 transition-all mb-2 border-l-2 border-primary/40"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/25 text-primary font-bold text-sm flex items-center justify-center mt-0.5 shadow-sm">
              {number}
            </span>
            <span className="flex-1 leading-relaxed text-base text-foreground">
              {formatInlineText(content)}
            </span>
          </li>
        );
      }
    });

    blocks.push(
      <ol key={`numbered-list-${baseKey}`} className="mb-8 space-y-1 list-none pl-0 bg-muted/30 rounded-lg p-4">
        {listItems}
      </ol>
    );
  } else {
    // Handle regular paragraphs with sentence-based splitting
    const content = lines.join(' ').trim();
    
    // Don't process empty content
    if (!content) return blocks;
    
    // Check if it's a key insight or important point
    const isKeyInsight = content.toLowerCase().includes('key insight') || 
                         content.toLowerCase().includes('important') ||
                         content.toLowerCase().includes('note:') ||
                         content.toLowerCase().includes('remember:');
    
    // Check if it's a cross-reference section
    const isCrossRef = content.toLowerCase().includes('cross-reference') ||
                       content.toLowerCase().includes('related verse');
    
    if (isKeyInsight) {
      blocks.push(
        <div 
          key={`insight-${baseKey}`} 
          className="mb-6 p-5 rounded-lg bg-yellow-500/15 border border-yellow-400/40 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="leading-relaxed text-base font-medium text-foreground">
              {formatInlineText(content)}
            </p>
          </div>
        </div>
      );
    } else if (isCrossRef) {
      blocks.push(
        <div 
          key={`crossref-${baseKey}`} 
          className="mb-6 p-5 rounded-lg bg-blue-500/15 border border-blue-400/40 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔗</span>
            <p className="leading-relaxed text-base text-foreground">
              {formatInlineText(content)}
            </p>
          </div>
        </div>
      );
    } else {
      // Split long content into paragraphs for readability
      const sentences = content.match(/[^.!?]+[.!?]+(\s|$)/g) || [content];
      
      if (sentences.length > 5) {
        const chunks: string[] = [];
        for (let i = 0; i < sentences.length; i += 3) {
          const chunk = sentences.slice(i, i + 3).join(' ').trim();
          if (chunk) chunks.push(chunk);
        }
        
        chunks.forEach((chunk, idx) => {
          blocks.push(
            <p 
              key={`para-${baseKey}-${idx}`} 
              className="mb-5 leading-relaxed text-base text-foreground pl-4 border-l-2 border-transparent hover:border-primary/30 transition-colors"
            >
              {formatInlineText(chunk)}
            </p>
          );
        });
      } else {
        blocks.push(
          <p 
            key={`para-${baseKey}`} 
            className="mb-5 leading-relaxed text-base text-foreground pl-4 border-l-2 border-transparent hover:border-primary/30 transition-colors"
          >
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
  let lastCharWasLetter = false; // Track if previous char was a letter

  while (remaining.length > 0) {
    // Only match room codes if NOT preceded by a letter (word boundary)
    if (!lastCharWasLetter) {
      // Handle PT room codes with specific variants (e.g., C6-Gospel, DR-Christ, TRm-Sanctuary)
      const roomCodeVariantMatch = remaining.match(/^(SR|IR|24F|BR|TR|GR|OR|DC|ST|QR|QA|NF|PF|BF|HF|LR|CR|DR|C6|TRm|TZ|PRm|FRt|BL|PR|3A|JR|FRm|MR|SRm|∞|@Ad|@No|@Ab|@Mo|@Cy|@CyC|@Sp|@Re|1H|2H|3H|[1-5]D)[-:]?\s*(Gospel|Law|History|Poetry|Prophecy|Epistle|Literal|Christ|Me|Church|Heaven|Sanctuary|Great Controversy|Time Prophecy|Life of Christ|Love|Joy|Peace|Patience|Kindness|Goodness|Faithfulness|Gentleness|Self-Control|Earth-Past|Earth-Now|Earth-Future|Heaven-Past|Heaven-Now|Heaven-Future)?(?![a-zA-Z])/i);
      if (roomCodeVariantMatch) {
        const code = roomCodeVariantMatch[1];
        const variant = roomCodeVariantMatch[2] || '';
        const roomColor = getRoomColor(code);
        
        parts.push(
          <span 
            key={`room-${keyCounter++}`} 
            className="inline-flex items-center gap-1 mx-1"
          >
            <span 
              className={`px-2 py-1 rounded-md font-bold text-xs ${roomColor} border shadow-sm`}
            >
              {code}{variant ? `: ${variant}` : ''}
            </span>
          </span>
        );
        remaining = remaining.slice(roomCodeVariantMatch[0].length);
        lastCharWasLetter = false;
        continue;
      }

      // Handle basic PT room codes (without variants)
      const roomCodeMatch = remaining.match(/^(SR|IR|24F|BR|TR|GR|OR|DC|ST|QR|QA|NF|PF|BF|HF|LR|CR|DR|C6|TRm|TZ|PRm|FRt|BL|PR|3A|JR|FRm|MR|SRm|∞|@Ad|@No|@Ab|@Mo|@Cy|@CyC|@Sp|@Re|1H|2H|3H|[1-5]D)(?![a-zA-Z])(\s*\([^)]+\))?/);
      if (roomCodeMatch) {
        const code = roomCodeMatch[1];
        const description = roomCodeMatch[2] || '';
        const roomColor = getRoomColor(code);
        
        parts.push(
          <span 
            key={`room-${keyCounter++}`} 
            className="inline-flex items-center gap-1 mx-1"
          >
            <span 
              className={`px-2 py-1 rounded-md font-bold text-xs ${roomColor} border shadow-sm`}
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
        lastCharWasLetter = false;
        continue;
      }
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
      lastCharWasLetter = /[a-zA-Z]$/.test(boldText);
      continue;
    }

    // Handle italic text (*text* or _text_)
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
    if (italicMatch && !remaining.startsWith('**')) {
      const italicText = italicMatch[2];
      parts.push(
        <em key={`italic-${keyCounter++}`} className="italic text-foreground/90">
          {italicText}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      lastCharWasLetter = /[a-zA-Z]$/.test(italicText);
      continue;
    }

    // Handle inline code (`code`)
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const codeText = codeMatch[1];
      parts.push(
        <code 
          key={`code-${keyCounter++}`} 
          className="px-2 py-0.5 rounded bg-muted/50 font-mono text-sm border border-border text-foreground"
        >
          {codeText}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      lastCharWasLetter = false;
      continue;
    }

    // Handle verse references (e.g., John 3:16, Genesis 1:1-5, 1 Corinthians 13:4)
    const verseMatch = remaining.match(/^([1-3]?\s*[A-Z][a-z]+\s+\d+:\d+(-\d+)?)/);
    if (verseMatch) {
      const verseText = verseMatch[1];
      parts.push(
        <span 
          key={`verse-${keyCounter++}`} 
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mx-1 shadow-sm"
        >
          <span>📖</span>
          <span>{verseText}</span>
        </span>
      );
      remaining = remaining.slice(verseMatch[0].length);
      lastCharWasLetter = false;
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
          🔗 {url.length > 40 ? url.slice(0, 40) + '...' : url}
        </a>
      );
      remaining = remaining.slice(urlMatch[0].length);
      lastCharWasLetter = false;
      continue;
    }

    // Regular character - track if it's a letter
    const char = remaining[0];
    lastCharWasLetter = /[a-zA-Z]/.test(char);
    parts.push(char);
    remaining = remaining.slice(1);
  }

  return <>{parts}</>;
};

/**
 * Get color styling for PT room codes
 */
const getRoomColor = (code: string): string => {
  // Floor 1 - Furnishing (Width) - Blue theme
  if (code.match(/^(SR|IR|24F?|BR|TR|GR)$/)) return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
  
  // Floor 2 - Investigation (Width) - Purple theme
  if (code.match(/^(OR|DC|ST|QR|QA)$/)) return 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700';
  
  // Floor 3 - Freestyle (Time) - Green theme
  if (code.match(/^(NF|PF|BF|HF|LR)$/)) return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
  
  // Floor 4 - Next Level (Depth) - Orange theme
  if (code.match(/^(CR|DR|C6|TRm|TZ|PRm|P\|\||FRt)$/)) return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700';
  
  // Floor 5 - Vision (Depth) - Red theme
  if (code.match(/^(BL|PR|3A)$/)) return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
  
  // Floor 6 - Cycles & Heavens (Depth) - Indigo theme
  if (code.match(/^@(Ad|No|Ab|Mo|Cy|CyC|Sp|Re)$/)) return 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700';
  if (code.match(/^(1H|2H|3H|JR)$/)) return 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700';
  
  // Floor 7 - Spiritual/Emotional (Height) - Pink theme
  if (code.match(/^(FRm|MR|SRm)$/)) return 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-700';
  
  // Floor 8 - Master (Height) - Gold theme
  if (code === '∞') return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
  
  // Dimensions - Cyan theme
  if (code.match(/^\d+D$/)) return 'bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700';
  
  // Default
  return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
};

/**
 * Get contextual emoji for headings
 */
const getHeadingEmoji = (text: string): string => {
  const lower = text.toLowerCase();
  
  // PT-specific rooms and concepts
  if (lower.includes('story room') || lower.match(/\bsr\b/)) return '📚';
  if (lower.includes('observation') || lower.match(/\bor\b/)) return '🔍';
  if (lower.includes('dimension') || lower.match(/\bdr\b/)) return '🌐';
  if (lower.includes('concentration') || lower.match(/\bcr\b/)) return '🎯';
  if (lower.includes('theme room') || lower.match(/\btrm\b/)) return '🏛️';
  if (lower.includes('pattern') || lower.match(/\bprm\b/)) return '🔄';
  if (lower.includes('parallel') || lower.includes('p||')) return '⚖️';
  if (lower.includes('fruit room') || lower.match(/\bfrt\b/)) return '🍇';
  if (lower.includes('imagination') || lower.match(/\bir\b/)) return '✨';
  if (lower.includes('meditation') || lower.match(/\bmr\b/)) return '🙏';
  if (lower.includes('bible freestyle') || lower.match(/\bbf\b/)) return '🔗';
  if (lower.includes('infinity') || lower.includes('∞')) return '♾️';
  
  // Biblical themes
  if (lower.includes('christ') || lower.includes('jesus') || lower.includes('messiah')) return '✝️';
  if (lower.includes('prophecy') || lower.includes('prophetic')) return '🔮';
  if (lower.includes('vision')) return '👁️';
  if (lower.includes('sanctuary') || lower.includes('temple')) return '⛪';
  if (lower.includes('gospel') || lower.includes('good news')) return '📣';
  if (lower.includes('summary') || lower.includes('conclusion')) return '📝';
  if (lower.includes('key') || lower.includes('important')) return '🔑';
  if (lower.includes('overview') || lower.includes('introduction')) return '📋';
  if (lower.includes('biblical') || lower.includes('foundation')) return '📜';
  if (lower.includes('analysis') || lower.includes('interpretation')) return '🔬';
  if (lower.includes('historical') || lower.includes('history')) return '🏺';
  if (lower.includes('application') || lower.includes('practical')) return '🎯';
  if (lower.includes('cross-reference') || lower.includes('related')) return '🔗';
  if (lower.includes('horn') || lower.includes('daniel')) return '📯';
  if (lower.includes('beast') || lower.includes('kingdom')) return '🦁';
  if (lower.includes('roman') || lower.includes('empire')) return '🏛️';
  
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
  if (lower.match(/\b(mr|meditation)\b/)) return '🙏';
  if (lower.match(/\b(bf|freestyle)\b/)) return '🔗';
  if (lower.match(/\b(frt|fruit)\b/)) return '🍇';
  
  // Content types
  if (lower.includes('christ') || lower.includes('jesus')) return '✝️';
  if (lower.includes('light')) return '💡';
  if (lower.includes('truth')) return '💎';
  if (lower.includes('transparent') || lower.includes('reveal')) return '🪟';
  if (lower.includes('work') || lower.includes('deed')) return '🔨';
  if (lower.includes('god') || lower.includes('lord')) return '👑';
  if (lower.includes('love') || lower.includes('grace')) return '❤️';
  if (lower.includes('wisdom') || lower.includes('understand')) return '🧠';
  if (lower.includes('prayer') || lower.includes('pray')) return '🙏';
  if (lower.includes('scripture') || lower.includes('verse') || lower.includes('bible')) return '📖';
  if (lower.includes('heaven') || lower.includes('eternal')) return '☁️';
  if (lower.includes('prophecy') || lower.includes('prophetic')) return '🔮';
  if (lower.includes('kingdom') || lower.includes('king')) return '👑';
  if (lower.includes('horn') || lower.includes('beast')) return '📯';
  if (lower.includes('fourth') || lower.includes('roman')) return '🏛️';
  if (lower.includes('little horn') || lower.includes('papacy')) return '⚠️';
  if (lower.includes('cross-reference') || lower.includes('related')) return '🔗';
  if (lower.includes('note') || lower.includes('important')) return '📌';
  if (lower.includes('warning') || lower.includes('caution')) return '⚠️';
  if (lower.includes('promise') || lower.includes('blessing')) return '🌟';
  
  return '▪️';
};
