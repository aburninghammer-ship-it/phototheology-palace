import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCharacterImages() {
  return useQuery({
    queryKey: ["character-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles" as any)
        .select("id")
        .limit(0);

      // character_image_cache table may not exist yet — return empty map
      const map = new Map<string, string>();
      try {
        const res = await supabase
          .from("character_image_cache" as any)
          .select("character_id, public_url");
        if (!res.error && res.data) {
          for (const row of res.data as any[]) {
            map.set(row.character_id, row.public_url);
          }
        }
      } catch {
        // table doesn't exist yet
      }
      return map;
    },
    staleTime: 1000 * 60 * 60,
  });
}
