import { useCallback, useRef, useState } from "react";

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

  // useCallback with [] is safe here: seenIds is a ref (stable by design),
  // and all fetch functions are stable module-level imports.
  const loadArtworkOfTheDay = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchArtworkOfTheDay();

      seenIds.current = [...seenIds.current, result.id];
      setArtwork(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load artwork of the day");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRandomArtwork = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const totalPages = await fetchSafeTotalPages();
      const result = await fetchRandomArtwork(totalPages, seenIds.current);

      seenIds.current = [...seenIds.current, result.id];
      setArtwork(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load random artwork");
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Note: the initial artwork-of-the-day load has been intentionally removed.
  // It is now driven by the DisplayIntent mechanism in DiscoverPage,
  // which initialises with { type: "artwork-of-the-day" }.

  return { artwork, loading, error, loadArtworkOfTheDay, loadRandomArtwork, loadArtworkById };
}

export { useArtwork };
