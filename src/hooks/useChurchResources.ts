import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useChurchResources(churchId?: string) {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getResources = useCallback(async (cId?: string, categoryId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      let query = (supabase as any)
        .from("church_resources")
        .select("*")
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setResources(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching resources:", err);
      return [];
    }
  }, [churchId]);

  const getCategories = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_resource_categories")
        .select("*")
        .eq("church_id", id)
        .order("name", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  }, [churchId]);

  const uploadResource = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_resources")
        .insert({
          church_id: cId,
          uploaded_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Resource uploaded!");
      await getResources(cId);
      return result;
    } catch (err: any) {
      console.error("Error uploading resource:", err);
      toast.error(err.message || "Failed to upload resource");
      return null;
    }
  }, [user, getResources]);

  const createCategory = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_resource_categories")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Category created!");
      await getCategories(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating category:", err);
      toast.error(err.message || "Failed to create category");
      return null;
    }
  }, [user, getCategories]);

  const deleteResource = useCallback(async (id: string) => {
    if (!user) { toast.error("You must be logged in"); return false; }
    try {
      const { error } = await (supabase as any)
        .from("church_resources")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Resource deleted!");
      setResources((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting resource:", err);
      toast.error(err.message || "Failed to delete resource");
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (!churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getResources(), getCategories()])
      .finally(() => setLoading(false));
  }, [churchId]);

  return {
    resources,
    categories,
    loading,
    getResources,
    getCategories,
    uploadResource,
    createCategory,
    deleteResource,
  };
}
