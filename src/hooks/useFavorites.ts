import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../lib/supabase";

import type { Favorite, FavoriteInsert } from "../types/artwork";

function useFavorites(userId: string | null) {
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data as Favorite[];
    },
    enabled: !!userId,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (favorite: FavoriteInsert) => {
      const { data, error } = await supabase
        .from("favorites")
        .insert({ ...favorite, user_id: userId })
        .select()
        .single();

      if (error) throw error;

      return data as Favorite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (artworkId: number) => {
      const { error } = await supabase.from("favorites").delete().eq("artwork_id", artworkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  function isFavorite(artworkId: number): boolean {
    return favorites.some(f => f.artwork_id === artworkId);
  }

  return {
    favorites,
    loading,
    error: (queryError as Error)?.message ?? null,
    addFavorite: addFavoriteMutation.mutateAsync,
    removeFavorite: removeFavoriteMutation.mutateAsync,
    isFavorite,
  };
}

export { useFavorites };
