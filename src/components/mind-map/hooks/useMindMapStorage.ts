import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { SavedMindMap, AnalysisMode, AIMapAnalysis, MindMapData } from '../types';
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
  notes?: Record<string, string>; // User notes keyed by node ID
}

// Type for the database record shape
interface MindMapRecord {
  id: string;
  user_id: string;
  name: string;
  source_text: string;
  source_type: string;
  source_reference: string | null;
  mode: string;
  map_data: unknown;
  analysis_summary: string | null;
  parent_map_id: string | null;
  created_at: string;
  updated_at: string;
}

function transformToSavedMindMap(record: MindMapRecord): SavedMindMap {
  return {
    id: record.id,
    user_id: record.user_id,
    name: record.name,
    source_text: record.source_text,
    source_type: record.source_type as SavedMindMap['source_type'],
    source_reference: record.source_reference,
    mode: record.mode as AnalysisMode,
    map_data: record.map_data as MindMapData,
    analysis_summary: record.analysis_summary,
    parent_map_id: record.parent_map_id,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
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
      const mapData = {
        nodes: params.nodes,
        edges: params.edges,
        analysis: params.analysis,
        notes: params.notes || {},
      };

      const { data, error } = await supabase
        .from('mind_maps')
        .insert([{
          user_id: user.id,
          name: params.name,
          source_text: params.sourceText,
          source_type: params.sourceType || 'custom',
          source_reference: params.sourceReference || null,
          mode: params.mode,
          map_data: JSON.parse(JSON.stringify(mapData)) as Json,
          analysis_summary: params.analysis.overallTheme || null,
          parent_map_id: params.parentMapId || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving mind map:', error);
        return null;
      }

      return transformToSavedMindMap(data as unknown as MindMapRecord);
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
        .single();

      if (error) {
        console.error('Error loading mind map:', error);
        return null;
      }

      return transformToSavedMindMap(data as unknown as MindMapRecord);
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

      return (data as unknown as MindMapRecord[]).map(transformToSavedMindMap);
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
