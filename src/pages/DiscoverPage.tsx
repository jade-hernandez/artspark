import { useEffect } from "react";

import { useArtwork } from "../hooks/useArtwork";
import { ArtworkDetail } from "../components/artwork/ArtworkDetail";
import { Skeleton } from "../components/ui";

// Discriminated union that represents every possible display intention.
// Exported so App.tsx can drive DiscoverPage without knowing its internals.
type DisplayIntent =
  | { type: "artwork-of-the-day" }
  | { type: "random" }
  | { type: "favorite"; artworkId: number };

type DiscoverPageProps = {
  displayIntent: DisplayIntent;
  onDiscoverAnother: () => void;
};

function DiscoverPage({ displayIntent, onDiscoverAnother }: DiscoverPageProps) {
  const { artwork, loading, error, loadArtworkOfTheDay, loadRandomArtwork, loadArtworkById } =
    useArtwork();

  // Single effect, single source of truth.
  // Every intent creates a new object reference in App, so this always re-runs
  // even when the same favourite is selected twice in a row.
  useEffect(() => {
    switch (displayIntent.type) {
      case "artwork-of-the-day":
        loadArtworkOfTheDay();
        break;
      case "random":
        loadRandomArtwork();
        break;
      case "favorite":
        loadArtworkById(displayIntent.artworkId);
        break;
    }
  }, [displayIntent, loadArtworkOfTheDay, loadRandomArtwork, loadArtworkById]);

  return (
    <main
      id='main-content'
      aria-label='Artwork discovery'
      aria-live='polite'
      aria-busy={loading}
    >
      {loading && !artwork && (
        <div className='mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-12'>
          <Skeleton className='aspect-4/3 w-full' />
          <div className='flex w-full flex-col items-center gap-3'>
            <Skeleton className='h-8 w-2/3' />
            <Skeleton className='h-5 w-1/3' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </div>
      )}
      {error && (
        <p
          role='alert'
          className='text-text-secondary py-12 text-center'
        >
          Something went wrong. Please try again later.
        </p>
      )}
      {artwork && (
        <ArtworkDetail
          key={artwork.id}
          artwork={artwork}
          onDiscoverAnother={onDiscoverAnother}
        />
      )}
    </main>
  );
}

export { DiscoverPage };
export type { DisplayIntent };
