import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import type { Favorite, FavoriteInsert } from "../types/artwork";

import { AuthContext } from "./AuthContext";

type FavoritesContextValue = {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  addFavorite: (favorite: FavoriteInsert) => Promise<void>;
  removeFavorite: (artworkId: number) => Promise<void>;
  isFavorite: (artworkId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  const user = authContext?.user ?? null;
  const userId = user?.id ?? null;

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
        console.log("Loaded favorites:", data);
      }

      setLoading(false);
    }

    loadFavorites();
  }, [userId]);

  async function addFavorite(favorite: FavoriteInsert) {
    const { data, error: insertError } = await supabase
      .from("favorites")
      .insert({ ...favorite, user_id: userId })
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

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, error, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

function useFavoritesContext() {
  const context = useContext(FavoritesContext);

  if (context === null) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { FavoritesProvider, useFavoritesContext };
