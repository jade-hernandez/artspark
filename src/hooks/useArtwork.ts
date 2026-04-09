import { useEffect, useState } from "react";
import { fetchArtworkOfTheDay } from "../api/fetch-artworks";
import type { Artwork } from "../types/artwork";

function useArtwork() {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadArtworkOfTheDay() {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchArtworkOfTheDay();
      setArtwork(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArtworkOfTheDay();
  }, []);

  return { artwork, loading, error, loadArtworkOfTheDay };
}

export { useArtwork };
