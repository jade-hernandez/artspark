import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import type { DisplayIntent } from "../pages/DiscoverPage";

import {
  fetchArtworkById,
  fetchArtworkOfTheDay,
  fetchRandomArtwork,
  fetchSafeTotalPages,
} from "../api/fetch-artworks";

function useArtwork(displayIntent: DisplayIntent) {
  const seenIds = useRef<number[]>([]);

  const selectedArtworkId = displayIntent.type === "favorite" ? displayIntent.artworkId : null;

  const activeQuery =
    displayIntent.type === "artwork-of-the-day"
      ? ("daily" as const)
      : displayIntent.type === "random"
        ? ("random" as const)
        : ("by-id" as const);

  const randomKey = displayIntent.type === "random" ? displayIntent.key : 0;

  const artworkOfTheDayQuery = useQuery({
    queryKey: ["artwork", "daily"],
    queryFn: async () => {
      const result = await fetchArtworkOfTheDay();
      seenIds.current = [...seenIds.current, result.id];
      return result;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const randomArtworkQuery = useQuery({
    queryKey: ["artwork", "random", randomKey],
    queryFn: async () => {
      const totalPages = await fetchSafeTotalPages();
      const result = await fetchRandomArtwork(totalPages, seenIds.current);
      seenIds.current = [...seenIds.current, result.id];
      return result;
    },
    enabled: randomKey > 0,
  });

  const artworkByIdQuery = useQuery({
    queryKey: ["artwork", "by-id", selectedArtworkId],
    queryFn: async () => {
      const result = await fetchArtworkById(selectedArtworkId!);
      seenIds.current = [...seenIds.current, result.id];
      return result;
    },
    enabled: selectedArtworkId !== null,
  });
  const activeQueryResult =
    activeQuery === "daily"
      ? artworkOfTheDayQuery
      : activeQuery === "random"
        ? randomArtworkQuery
        : artworkByIdQuery;

  return {
    artwork: activeQueryResult.data ?? null,
    loading: activeQueryResult.isLoading || activeQueryResult.isFetching,
    error: (activeQueryResult.error as Error)?.message ?? null,
  };
}

export { useArtwork };
