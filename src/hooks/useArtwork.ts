import { useCallback, useEffect, useRef, useState } from "react";

import type { ArtworkWithImage } from "../types/artwork";

import {
  fetchArtworkById,
  fetchArtworkOfTheDay,
  fetchRandomArtwork,
  fetchSafeTotalPages,
} from "../api/fetch-artworks";

function useArtwork() {
  const [artwork, setArtwork] = useState<ArtworkWithImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seenIds = useRef<number[]>([]);

  async function loadArtworkOfTheDay() {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchArtworkOfTheDay();

      seenIds.current = [...seenIds.current, result.id];
      setArtwork(result);
      console.log("Artwork of the day ID:", result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load artwork of the day");
    } finally {
      setLoading(false);
    }
  }

  async function loadRandomArtwork() {
    setLoading(true);
    setError(null);

    try {
      const totalPages = await fetchSafeTotalPages();
      const result = await fetchRandomArtwork(totalPages, seenIds.current);

      seenIds.current = [...seenIds.current, result.id];
      setArtwork(result);
      console.log("Random artwork ID:", result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load random artwork");
    } finally {
      setLoading(false);
    }
  }

  const loadArtworkById = useCallback(async (artworkId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchArtworkById(artworkId);
      seenIds.current = [...seenIds.current, result.id];
      setArtwork(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load artwork");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtworkOfTheDay();
  }, []);

  return { artwork, loading, error, loadArtworkOfTheDay, loadRandomArtwork, loadArtworkById };
}

export { useArtwork };
