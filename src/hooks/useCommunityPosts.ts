import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface UseCommunityPostsOptions {
  pageSize?: number;
  sortBy?: 'latest' | 'most_commented' | 'needs_feedback';
  category?: string;
  searchQuery?: string;
  tags?: string[];
}

export const useCommunityPosts = (options: UseCommunityPostsOptions = {}) => {
  const {
    pageSize = 10,
    sortBy = 'latest',
    category = 'all',
    searchQuery = '',
    tags = [],
  } = options;

  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async (pageNumber: number, append = false) => {
    try {
      setLoading(true);
      const from = pageNumber * pageSize;
      const to = from + pageSize - 1;

      // Build query with type assertion to prevent deep type inference
      let query: any = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id(username, display_name, avatar_url)
        `, { count: 'exact' })
        .range(from, to);

      // Apply category filter
      if (category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      // Apply tags filter
      if (tags.length > 0) {
        query = query.contains('tags', tags);
      }

      // Apply sorting
      if (sortBy === 'most_commented') {
        query = query.order('comment_count', { ascending: false });
      } else if (sortBy === 'needs_feedback') {
        query = query.eq('needs_feedback', true);
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error loading posts',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (append) {
        setPosts(prev => [...prev, ...(data || [])]);
      } else {
        setPosts(data || []);
      }

      // Check if there are more posts
      const totalFetched = append ? posts.length + (data?.length || 0) : (data?.length || 0);
      setHasMore(count ? totalFetched < count : false);

    } catch (error: any) {
      console.error('Unexpected error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [pageSize, sortBy, category, searchQuery, tags, toast]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(0, false);
    setPage(0);
  }, [sortBy, category, searchQuery, tags]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  }, [page, loading, hasMore, fetchPosts]);

  // Refresh function
  const refresh = useCallback(() => {
    setPage(0);
    fetchPosts(0, false);
  }, [fetchPosts]);

  // Optimistic update for a single post
  const updatePost = useCallback((postId: string, updates: Partial<CommunityPost>) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, ...updates } : post
    ));
  }, []);

  // Remove a post
  const removePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  // Add a new post (optimistic)
  const addPost = useCallback((newPost: CommunityPost) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  return {
    posts,
    loading,
    hasMore,
    loadMore,
    refresh,
    updatePost,
    removePost,
    addPost,
  };
};
