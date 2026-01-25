import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { SavedMindMap, MindMapData, AnalysisMode, AIMapAnalysis } from '../types';
import { Node, Edge } from 'reactflow';

interface UseMindMapStorageReturn {
  saveMap: (params: SaveMapParams) => Promise<SavedMindMap | null>;
  loadMap: (id: string) => Promise<SavedMindMap | null>;
  listMaps: () => Promise<SavedMindMap[]>;
  deleteMap: (id: string) => Promise<boolean>;
  isSaving: boolean;
  isLoading: boolean;
}

interface SaveMapParams {
  name: string;
  sourceText: string;
  sourceType?: 'custom' | 'scripture' | 'sermon' | 'devotional';
  sourceReference?: string;
  mode: AnalysisMode;
  nodes: Node[];
  edges: Edge[];
  analysis: AIMapAnalysis;
  parentMapId?: string;
}

export function useMindMapStorage(): UseMindMapStorageReturn {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveMap = useCallback(async (params: SaveMapParams): Promise<SavedMindMap | null> => {
    if (!user) {
      console.error('User must be logged in to save maps');
      return null;
    }

    setIsSaving(true);
    try {
      const mapData: MindMapData = {
        nodes: params.nodes,
        edges: params.edges,
        analysis: params.analysis,
      };

      const { data, error } = await supabase
        .from('mind_maps')
        .insert({
          user_id: user.id,
          name: params.name,
          source_text: params.sourceText,
          source_type: params.sourceType || 'custom',
          source_reference: params.sourceReference,
          mode: params.mode,
          map_data: mapData as any,
          analysis_summary: params.analysis.overallTheme,
          parent_map_id: params.parentMapId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving mind map:', error);
        return null;
      }

      return data as unknown as SavedMindMap;
    } catch (err) {
      console.error('Error saving mind map:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  const loadMap = useCallback(async (id: string): Promise<SavedMindMap | null> => {
    if (!user) {
      console.error('User must be logged in to load maps');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading mind map:', error);
        return null;
      }

      return data as unknown as SavedMindMap;
    } catch (err) {
      console.error('Error loading mind map:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const listMaps = useCallback(async (): Promise<SavedMindMap[]> => {
    if (!user) {
      return [];
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error listing mind maps:', error);
        return [];
      }

      return (data || []) as unknown as SavedMindMap[];
    } catch (err) {
      console.error('Error listing mind maps:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteMap = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('mind_maps')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting mind map:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error deleting mind map:', err);
      return false;
    }
  }, [user]);

  return {
    saveMap,
    loadMap,
    listMaps,
    deleteMap,
    isSaving,
    isLoading,
  };
}
