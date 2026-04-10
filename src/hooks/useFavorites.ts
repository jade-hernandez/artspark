import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import type { Favorite, FavoriteInsert } from "../types/artwork";

function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      if (!userId) {
        setFavorites([]);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setFavorites(data ?? []);
      }

      setLoading(false);
    }

    loadFavorites();
  }, [userId]);

  async function addFavorite(favorite: FavoriteInsert) {
    const { data, error: insertError } = await supabase
      .from("favorites")
      .insert(favorite)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    setFavorites(prev => [data, ...prev]);
  }

  async function removeFavorite(artworkId: number) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("artwork_id", artworkId);

    if (deleteError) {
      throw deleteError;
    }

    setFavorites(prev => prev.filter(f => f.artwork_id !== artworkId));
  }

  function isFavorite(artworkId: number): boolean {
    return favorites.some(f => f.artwork_id === artworkId);
  }

  return { favorites, loading, error, addFavorite, removeFavorite, isFavorite };
}

export { useFavorites };
