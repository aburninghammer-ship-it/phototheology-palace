import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { useGideonAccess } from "@/hooks/useGideonAccess";
import { useGideon300 } from "@/hooks/useGideon300";
import { GideonLobby } from "@/components/gideon/GideonLobby";
import { GideonRoundActive } from "@/components/gideon/GideonRoundActive";
import { GideonRoundReveal } from "@/components/gideon/GideonRoundReveal";
import { GideonCampMode } from "@/components/gideon/GideonCampMode";
import { GideonSynthesisRound } from "@/components/gideon/GideonSynthesisRound";
import { GideonResults } from "@/components/gideon/GideonResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, WifiOff } from "lucide-react";
import type { GideonSettings } from "@/types/gideon";
import { MIN_PLAYERS, MAX_PLAYERS_DEFAULT } from "@/types/gideon";

const Gideon300 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canPlay, accessTier, isFridayNight, fridayWindowEnd } = useGideonAccess();

  const multiplayer = useGameMultiplayer("gideon_300");

  const {
    tournament,
    tournamentPlayers,
    myTournamentPlayer,
    clientQuestions,
    currentQuestion,
    revealQuestion,
    hostOnline,
    createTournament,
    startTournament,
    submitAnswer,
    submitSynthesisAnswer,
    advanceToNextQuestion,
    advanceToNextRound,
    advanceToSynthesis,
    advanceToResults,
  } = useGideon300(multiplayer.room, multiplayer.isHost);

  const phase = tournament?.round_phase || "lobby";
  const isEliminated = myTournamentPlayer?.is_eliminated || false;
  const inCampMode = myTournamentPlayer?.in_camp_mode || false;

  if (!canPlay) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Gideon 300 Tournament</h1>
          <p className="text-muted-foreground mb-4">
            Available for Full Suite members or during Friday Night Pass (Fridays 6-11:59 PM).
          </p>
          {isFridayNight && (
            <p className="text-amber-500 font-medium">
              Friday Night window ends at {fridayWindowEnd}
            </p>
          )}
          <Button onClick={() => navigate("/games")} variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
          </Button>
        </div>
      </div>
    );
  }

  const handleCreateRoom = async (settings: GideonSettings) => {
    const room = await multiplayer.createRoom(settings.max_players || MAX_PLAYERS_DEFAULT, settings);
    if (room) {
      await createTournament(room.id, settings);
    }
  };

  const handleStartTournament = async () => {
    if (tournament) {
      await startTournament(tournament.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => {
            if (multiplayer.room) {
              multiplayer.leaveRoom();
            } else {
              navigate("/games");
            }
          }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gideon 300 Tournament</h1>
            <p className="text-sm text-muted-foreground">
              Refine through fire — only the remnant survives
            </p>
          </div>
        </div>

        {/* Host Disconnected Warning */}
        {!hostOnline && !multiplayer.isHost && phase !== "lobby" && phase !== "complete" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>Host disconnected. The game will resume when they reconnect.</span>
          </div>
        )}

        {/* LOBBY */}
        {(phase === "lobby" || phase === "generating") && (
          <GideonLobby
            room={multiplayer.room}
            players={multiplayer.players}
            tournament={tournament}
            isHost={multiplayer.isHost}
            loading={multiplayer.loading}
            accessTier={accessTier}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={multiplayer.joinRoom}
            onStartTournament={handleStartTournament}
            onLeaveRoom={multiplayer.leaveRoom}
          />
        )}

        {/* ACTIVE QUESTION */}
        {phase === "question" && !inCampMode && (
          <GideonRoundActive
            tournament={tournament!}
            currentQuestion={currentQuestion}
            myPlayer={myTournamentPlayer}
            tournamentPlayers={tournamentPlayers}
            onSubmitAnswer={submitAnswer}
            isHost={multiplayer.isHost}
            onAdvanceToReveal={() => advanceToNextQuestion()}
          />
        )}

        {/* REVEAL */}
        {phase === "reveal" && !inCampMode && (
          <GideonRoundReveal
            tournament={tournament!}
            currentQuestion={currentQuestion}
            clientQuestion={clientQuestions[tournament?.current_question_index || 0]}
            revealQuestion={revealQuestion}
            myPlayer={myTournamentPlayer}
            tournamentPlayers={tournamentPlayers}
            isHost={multiplayer.isHost}
            onAdvanceToNextQuestion={() => advanceToNextQuestion()}
            onAdvanceToNextRound={() => advanceToNextRound()}
            onAdvanceToSynthesis={() => advanceToSynthesis()}
          />
        )}

        {/* CAMP MODE (eliminated players) */}
        {(inCampMode || isEliminated) && phase !== "lobby" && phase !== "complete" && phase !== "synthesis" && (
          <GideonCampMode
            tournament={tournament!}
            myPlayer={myTournamentPlayer!}
            tournamentPlayers={tournamentPlayers}
            roomId={multiplayer.room?.id}
          />
        )}

        {/* CAMP TEACHING (between rounds) */}
        {phase === "camp_teaching" && !inCampMode && (
          <GideonRoundReveal
            tournament={tournament!}
            currentQuestion={currentQuestion}
            clientQuestion={clientQuestions[tournament?.current_question_index || 0]}
            revealQuestion={revealQuestion}
            myPlayer={myTournamentPlayer}
            tournamentPlayers={tournamentPlayers}
            isHost={multiplayer.isHost}
            onAdvanceToNextQuestion={() => advanceToNextQuestion()}
            onAdvanceToNextRound={() => advanceToNextRound()}
            onAdvanceToSynthesis={() => advanceToSynthesis()}
          />
        )}

        {/* SYNTHESIS ROUND */}
        {phase === "synthesis" && (
          <GideonSynthesisRound
            tournament={tournament!}
            myPlayer={myTournamentPlayer}
            tournamentPlayers={tournamentPlayers}
            onSubmitSynthesis={submitSynthesisAnswer}
            isHost={multiplayer.isHost}
            onAdvanceToResults={() => advanceToResults()}
            isEliminated={isEliminated}
          />
        )}

        {/* RESULTS */}
        {phase === "complete" && (
          <GideonResults
            tournament={tournament!}
            tournamentPlayers={tournamentPlayers}
            myPlayer={myTournamentPlayer}
            accessTier={accessTier}
            onPlayAgain={() => {
              multiplayer.leaveRoom();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Gideon300;
