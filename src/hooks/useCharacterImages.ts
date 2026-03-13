import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCharacterImages() {
  return useQuery({
    queryKey: ["character-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_image_cache")
        .select("character_id, public_url");

      if (error) throw error;

      const map = new Map<string, string>();
      for (const row of data ?? []) {
        map.set(row.character_id, row.public_url);
      }
      return map;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - images are static
  });
}
