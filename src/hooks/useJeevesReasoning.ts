import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ============================================================
// TYPES FOR JEEVES REASONING ENGINE
// ============================================================

export type JeevesMode = 'explorer' | 'auditor' | 'architect';
export type JeevesLens = 'sda' | 'neutral_historical' | 'comparative';

export type SparkKind = 'hypothesis' | 'pattern' | 'parallel' | 'warning' | 'application' | 'question';
export type ConfidenceLevel = 'speculative' | 'tentative' | 'moderate' | 'strong';
export type VerificationState = 'unverified' | 'textually_supported' | 'historically_supported' | 'logic_checked' | 'counterpoints_added' | 'validated';

export interface RoomMapping {
  room_code: string;
  room_name: string;
  trigger_reason: string;
  cognitive_move: string;
  suggested_next_step: string;
}

export interface ScriptureAnchor {
  ref: string;
  type: 'anchor' | 'parallel' | 'type' | 'supporting';
}

export interface Spark {
  id: string;
  spark_kind: SparkKind;
  title: string;
  summary: string;
  claim_text: string | null;
  confidence_level: ConfidenceLevel;
  confidence_notes: string;
  verification_state: VerificationState;
  assumptions: string[];
  counterpoints: string[];
  anchors: ScriptureAnchor[];
  next_actions: string[];
  room_mappings: RoomMapping[];
}

export interface TextualBasis {
  ref: string;
  text: string;
  role: 'supports' | 'context' | 'counter';
}

export interface HistoricalAnchor {
  period: string;
  evidence: string;
  certainty: 'low' | 'moderate' | 'high';
}

export interface RiskCounterpoint {
  objection: string;
  response: string;
}

export interface ClaimLadder {
  claim: string;
  textual_basis: TextualBasis[];
  historical_anchor: HistoricalAnchor | null;
  logical_move: string;
  theological_implication: string;
  risk_counterpoint: RiskCounterpoint[];
  validation_notes: string;
}

export interface AuditorNotes {
  challenges: string[];
  alternatives: string[];
  uncertainties: string[];
}

export interface SourceNeeded {
  source_type: 'scripture' | 'historical_primary' | 'historical_secondary' | 'sop';
  description: string;
  purpose: string;
}

export interface JeevesReasoningResponse {
  mode: JeevesMode;
  sparks: Spark[];
  claim_ladder: ClaimLadder | null;
  auditor_notes: AuditorNotes | null;
  sources_needed: SourceNeeded[];
  conversational_response: string;
}

export interface JeevesMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  response?: JeevesReasoningResponse;
}

interface UseJeevesReasoningOptions {
  mode?: JeevesMode;
  lens?: JeevesLens;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useJeevesReasoning(options: UseJeevesReasoningOptions = {}) {
  const [messages, setMessages] = useState<JeevesMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<JeevesMode>(options.mode || 'explorer');
  const [currentLens, setCurrentLens] = useState<JeevesLens>(options.lens || 'sda');
  const [activeSparks, setActiveSparks] = useState<Spark[]>([]);
  const [activeClaimLadder, setActiveClaimLadder] = useState<ClaimLadder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    context?: string,
    userName?: string
  ): Promise<JeevesReasoningResponse | null> => {
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: JeevesMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('jeeves-reasoning', {
        body: {
          message,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          mode: currentMode,
          lens: currentLens,
          context,
          existingSparks: activeSparks,
          existingClaimLadder: activeClaimLadder,
          userName
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      const response = data as JeevesReasoningResponse;

      // Add assistant message
      const assistantMessage: JeevesMessage = {
        role: 'assistant',
        content: response.conversational_response,
        timestamp: new Date(),
        response
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update active sparks
      if (response.sparks && response.sparks.length > 0) {
        setActiveSparks(prev => [...prev, ...response.sparks]);
      }

      // Update active claim ladder
      if (response.claim_ladder) {
        setActiveClaimLadder(response.claim_ladder);
      }

      return response;

    } catch (err) {
      console.error('Jeeves Reasoning error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      
      // Add error message
      const errorAssistantMessage: JeevesMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Let's try that again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorAssistantMessage]);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentMode, currentLens, activeSparks, activeClaimLadder]);

  const changeMode = useCallback((mode: JeevesMode) => {
    setCurrentMode(mode);
  }, []);

  const changeLens = useCallback((lens: JeevesLens) => {
    setCurrentLens(lens);
  }, []);

  const promoteSpark = useCallback(async (spark: Spark): Promise<ClaimLadder | null> => {
    // Switch to architect mode and request a claim ladder for this spark
    setCurrentMode('architect');
    
    const response = await sendMessage(
      `Build a formal Claim Ladder for this spark:\n\nTitle: ${spark.title}\nClaim: ${spark.claim_text || spark.summary}\nAnchors: ${spark.anchors.map(a => a.ref).join(', ')}`,
      undefined,
      undefined
    );

    return response?.claim_ladder || null;
  }, [sendMessage]);

  const auditClaim = useCallback(async (claim: string | ClaimLadder): Promise<AuditorNotes | null> => {
    // Switch to auditor mode and audit the claim
    setCurrentMode('auditor');
    
    const claimText = typeof claim === 'string' ? claim : claim.claim;
    const response = await sendMessage(
      `Audit this claim rigorously. Challenge assumptions, demand evidence, surface counterarguments:\n\n${claimText}`,
      typeof claim === 'object' ? JSON.stringify(claim) : undefined,
      undefined
    );

    return response?.auditor_notes || null;
  }, [sendMessage]);

  const clearSession = useCallback(() => {
    setMessages([]);
    setActiveSparks([]);
    setActiveClaimLadder(null);
    setError(null);
  }, []);

  const removeSpark = useCallback((sparkId: string) => {
    setActiveSparks(prev => prev.filter(s => s.id !== sparkId));
  }, []);

  return {
    // State
    messages,
    isLoading,
    currentMode,
    currentLens,
    activeSparks,
    activeClaimLadder,
    error,
    
    // Actions
    sendMessage,
    changeMode,
    changeLens,
    promoteSpark,
    auditClaim,
    clearSession,
    removeSpark,
    setActiveClaimLadder
  };
}

export default useJeevesReasoning;
