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

  useEffect(() => {
    if (hasSaved.current || entries.length === 0 || players.length === 0) return;
    hasSaved.current = true;

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

      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { message: prompt, context: 'scrabble_polish' },
      });

      if (error) throw error;

      const narrative = data?.content || data?.response || data?.message || '';
      if (!narrative) return;

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
        console.log(`[ScrabblePolish] Saved polish for ${firstName} (${player.userId})`);
      }
    } catch (err) {
      console.error(`[ScrabblePolish] Error generating polish for ${player.displayName}:`, err);
    }
  });

  await Promise.allSettled(promises);
  toast.success('📜 Personalized polish saved for all players!', { duration: 5000 });
}
