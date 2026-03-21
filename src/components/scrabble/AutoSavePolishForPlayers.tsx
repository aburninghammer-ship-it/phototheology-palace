// Auto-saves a personalized Polish manuscript for every player when a Scrabble PT multiplayer game ends
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { StudyLogEntry } from './StudyLog';

interface PlayerInfo {
  userId: string;
  displayName: string;
  score: number;
  cardsPlayed: number;
}

interface AutoSavePolishProps {
  players: PlayerInfo[];
  entries: StudyLogEntry[];
  seedVerseRef?: string;
  seedVerseText?: string;
  winnerName: string;
}

export function AutoSavePolishForPlayers({
  players,
  entries,
  seedVerseRef,
  seedVerseText,
  winnerName,
}: AutoSavePolishProps) {
  const hasSaved = useRef(false);
  const attemptCount = useRef(0);

  useEffect(() => {
    if (hasSaved.current) return;
    
    console.log('[ScrabblePolish] Check — players:', players.length, 'entries:', entries.length);
    
    if (entries.length === 0 || players.length === 0) {
      // Retry up to 10 times with a delay if data isn't ready yet
      if (attemptCount.current < 10) {
        attemptCount.current++;
        const timer = setTimeout(() => {
          // Force re-check by triggering a state-independent check
          console.log('[ScrabblePolish] Retry attempt', attemptCount.current);
        }, 2000);
        return () => clearTimeout(timer);
      }
      console.warn('[ScrabblePolish] Gave up waiting for data after 10 attempts');
      return;
    }
    
    hasSaved.current = true;
    console.log('[ScrabblePolish] Triggering auto-save for', players.length, 'players with', entries.length, 'entries');

    // Fire and forget — generate + save for each player
    generateAndSaveForAllPlayers(players, entries, seedVerseRef, seedVerseText, winnerName);
  }, [players, entries, seedVerseRef, seedVerseText, winnerName]);

  return null; // invisible component
}

async function generateAndSaveForAllPlayers(
  players: PlayerInfo[],
  entries: StudyLogEntry[],
  seedVerseRef?: string,
  seedVerseText?: string,
  winnerName?: string,
) {
  // Build the shared entries text once
  const entriesText = entries.map((e, i) => {
    const connectionLabel = i === 0
      ? '(Connected to the verse)'
      : `(Building on ${entries[i - 1].playerName}'s "${entries[i - 1].cardName}")`;
    const jeevesNote = e.jeevesJudgment ? `\n   Jeeves Commentary: "${e.jeevesJudgment}"` : '';
    return `${i + 1}. ${e.playerName} applied "${e.cardName}" (${e.cardCode}) ${connectionLabel}${e.isChristConnection ? ' [Christ Connection]' : ''}:\n   "${e.explanation}"${jeevesNote}`;
  }).join('\n\n');

  const playerNames = players.map(p => p.displayName).join(', ');
  const verseInfo = seedVerseRef ? `${seedVerseRef}: "${seedVerseText}"` : 'a Scrabble PT study session';

  toast.info('📜 Generating personalized polishes for all players...', { duration: 5000 });

  // Generate one personalized polish per player in parallel
  const promises = players.map(async (player) => {
    try {
      const firstName = player.displayName.trim().split(/\s+/)[0];

      const prompt = `You are Jeeves, a masterful Bible study editor with the voice of a warm, wise pastor. A group of ${players.length} students (${playerNames}) just completed a PT Scrabble game studying ${verseInfo}.

IMPORTANT: You are writing this polish DIRECTLY TO ${firstName}. Address ${firstName} by name throughout — as if handing them their own personal copy. Use "you" and "${firstName}" freely. Make them feel this study was written just for them.

${winnerName ? `${winnerName} won the game!` : ''}
${firstName}'s score: ${player.score} points (${player.cardsPlayed} cards played).

Here are ALL the study entries from the game (from all players):

${entriesText}

Your task: Create a POLISHED THEMATIC MANUSCRIPT addressed to ${firstName} that:

1. **ADDRESSES ${firstName.toUpperCase()} DIRECTLY** — "You'll notice, ${firstName}..." or "${firstName}, look at what was uncovered here..."
2. **WEAVES** all contributions into a flowing, cohesive Bible study narrative
3. **POLISHES** each insight — fix grammar, deepen theology, strengthen chain connections
4. **INTEGRATES JEEVES GEMS** — weave commentary naturally into the flow
5. **ADDS 2-3 BONUS GEMS** — deeper connections or cross-references the group missed
6. **CHRIST CONNECTION** — ensure the study culminates in how the passage points to Jesus
7. **CLOSING REFLECTION** — end with a personal word of encouragement to ${firstName}

Format: Use ## headings, flowing paragraphs, **bold** Scripture references (KJV). Make it something ${firstName} would treasure.`;

      console.log(`[ScrabblePolish] Calling jeeves for ${firstName}...`);
      
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { message: prompt, context: 'scrabble_polish' },
      });

      if (error) {
        console.error(`[ScrabblePolish] Jeeves error for ${firstName}:`, error);
        throw error;
      }

      const narrative = data?.content || data?.response || data?.message || '';
      if (!narrative) {
        console.warn(`[ScrabblePolish] Empty narrative for ${firstName}`);
        return;
      }

      const title = seedVerseRef
        ? `Scrabble PT: ${seedVerseRef}`
        : 'Scrabble PT Study';
      const tagline = `A personal study polish for ${firstName} from a ${players.length}-player game`;

      // Build verses used from entries
      const versesUsed = entries
        .filter(e => e.explanation)
        .flatMap(e => {
          const refs = e.explanation.match(/\b(\d?\s?[A-Z][a-z]+\.?\s+\d+[:\d-]*)/g);
          return refs || [];
        });

      // Save to polish_stories for this player
      const { error: insertError } = await supabase
        .from('polish_stories')
        .insert({
          user_id: player.userId,
          input_text: `Scrabble PT game with ${playerNames}. Verse: ${verseInfo}`,
          title,
          tagline,
          narrative,
          closing_reflection: `Personalized polish from a ${players.length}-player Scrabble PT session.`,
          verses_used: versesUsed.length > 0 ? versesUsed : null,
        });

      if (insertError) {
        console.error(`[ScrabblePolish] Failed to save for ${firstName}:`, insertError);
      } else {
        console.log(`[ScrabblePolish] ✅ Saved polish for ${firstName} (${player.userId})`);
      }

      // Also send an in-app notification to the player
      try {
        await supabase.from('notifications').insert({
          user_id: player.userId,
          type: 'polish_ready',
          title: '📜 Your Scrabble PT Polish is Ready!',
          message: `Jeeves prepared a personalized study manuscript from your ${players.length}-player game${seedVerseRef ? ` on ${seedVerseRef}` : ''}. Check your Saved Polishes!`,
          link: '/polish',
          metadata: { source: 'scrabble_pt', seed_verse: seedVerseRef },
        });
      } catch (notifErr) {
        console.warn(`[ScrabblePolish] Notification failed for ${firstName}:`, notifErr);
      }
    } catch (err) {
      console.error(`[ScrabblePolish] Error generating polish for ${player.displayName}:`, err);
    }
  });

  const results = await Promise.allSettled(promises);
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  
  if (succeeded > 0) {
    toast.success(`📜 Personalized polish saved for ${succeeded} player${succeeded > 1 ? 's' : ''}!`, { duration: 5000 });
  } else {
    toast.error('Failed to generate polishes. Check the study log for details.', { duration: 5000 });
  }
}
