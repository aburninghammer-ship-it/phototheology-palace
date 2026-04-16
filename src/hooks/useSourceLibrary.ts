import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import mammoth from "mammoth";

export interface SourceDocument {
  id: string;
  user_id: string;
  title: string;
  document_type: "pdf" | "docx" | "pptx" | "txt";
  file_size_bytes: number | null;
  storage_path: string | null;
  extracted_text: string | null;
  metadata: Record<string, any>;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSourceInput {
  title: string;
  document_type: "pdf" | "docx" | "pptx" | "txt";
  file_size_bytes?: number;
  extracted_text: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export function useSourceLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch all source documents for the user
  const {
    data: sources = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["source-documents", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Using type cast since table may not exist in schema yet
      const { data, error } = await (supabase as any)
        .from("user_source_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SourceDocument[];
    },
    enabled: !!user,
  });

  // Parse file content based on type
  const parseFile = useCallback(async (file: File): Promise<string> => {
    const fileType = file.name.toLowerCase().split(".").pop();

    if (fileType === "txt") {
      return await file.text();
    }

    if (fileType === "docx") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    if (fileType === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }
      return fullText;
    }

    if (fileType === "pptx") {
      // For PPTX, we'll extract as much text as possible
      // This is a simplified approach - full PPTX parsing would need additional libraries
      const arrayBuffer = await file.arrayBuffer();
      try {
        // Try to extract text from PPTX XML structure
        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(arrayBuffer);
        let fullText = "";

        // PPTX slides are in ppt/slides/slide*.xml
        const slideFiles = Object.keys(zip.files).filter(
          (name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
        );

        for (const slideFile of slideFiles.sort()) {
          const content = await zip.files[slideFile].async("string");
          // Extract text between <a:t> tags (text elements in PPTX)
          const textMatches = content.match(/<a:t>([^<]*)<\/a:t>/g) || [];
          const slideText = textMatches
            .map((match) => match.replace(/<\/?a:t>/g, ""))
            .join(" ");
          if (slideText.trim()) {
            fullText += slideText + "\n\n";
          }
        }

        return fullText || "Unable to extract text from this PowerPoint file.";
      } catch (e) {
        console.error("PPTX parsing error:", e);
        return "Unable to extract text from this PowerPoint file.";
      }
    }

    throw new Error(`Unsupported file type: ${fileType}`);
  }, []);

  // Upload and create a new source document
  const uploadSource = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("Not authenticated");

      setIsUploading(true);

      try {
        // Parse the file content
        const extractedText = await parseFile(file);
        const fileType = file.name.toLowerCase().split(".").pop() as
          | "pdf"
          | "docx"
          | "pptx"
          | "txt";

        // Create the source document record (using type cast since table may not exist in schema yet)
        const { data, error } = await (supabase as any)
          .from("user_source_documents")
          .insert({
            user_id: user.id,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            document_type: fileType,
            file_size_bytes: file.size,
            extracted_text: extractedText,
            metadata: {
              original_filename: file.name,
              uploaded_at: new Date().toISOString(),
            },
            tags: [],
            is_favorite: false,
          })
          .select()
          .single();

        if (error) throw error;
        return data as SourceDocument;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-documents"] });
      toast({
        title: "Document uploaded",
        description: "Your document has been added to the library.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create source from text directly
  const createFromText = useMutation({
    mutationFn: async (input: CreateSourceInput) => {
      if (!user) throw new Error("Not authenticated");

      // Using type cast since table may not exist in schema yet
      const { data, error } = await (supabase as any)
        .from("user_source_documents")
        .insert({
          user_id: user.id,
          title: input.title,
          document_type: input.document_type,
          file_size_bytes: input.file_size_bytes || input.extracted_text.length,
          extracted_text: input.extracted_text,
          metadata: input.metadata || {},
          tags: input.tags || [],
          is_favorite: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SourceDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-documents"] });
      toast({
        title: "Document created",
        description: "Your document has been added to the library.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update a source document
  const updateSource = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<SourceDocument>;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Using type cast since table may not exist in schema yet
      const { data, error } = await (supabase as any)
        .from("user_source_documents")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as SourceDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-documents"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a source document
  const deleteSource = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");

      // Using type cast since table may not exist in schema yet
      const { error } = await (supabase as any)
        .from("user_source_documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been removed from your library.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (id: string) => {
      const source = sources.find((s) => s.id === id);
      if (!source) return;

      await updateSource.mutateAsync({
        id,
        updates: { is_favorite: !source.is_favorite },
      });
    },
    [sources, updateSource]
  );

  // Search sources by content
  const searchSources = useCallback(
    async (query: string): Promise<SourceDocument[]> => {
      if (!user || !query.trim()) return sources;

      // Using type cast since function may not exist in schema yet
      const { data, error } = await (supabase as any).rpc("search_source_documents", {
        search_query: query,
        user_id_param: user.id,
      });

      if (error) {
        console.error("Search error:", error);
        return sources.filter(
          (s) =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.extracted_text?.toLowerCase().includes(query.toLowerCase())
        );
      }

      return (data || []) as SourceDocument[];
    },
    [user, sources]
  );

  // Get sources by IDs (for series generator)
  const getSourcesByIds = useCallback(
    (ids: string[]): SourceDocument[] => {
      return sources.filter((s) => ids.includes(s.id));
    },
    [sources]
  );

  return {
    sources,
    isLoading,
    error,
    isUploading,
    refetch,
    uploadSource: uploadSource.mutateAsync,
    createFromText: createFromText.mutateAsync,
    updateSource: updateSource.mutateAsync,
    deleteSource: deleteSource.mutateAsync,
    toggleFavorite,
    searchSources,
    getSourcesByIds,
    parseFile,
  };
}
