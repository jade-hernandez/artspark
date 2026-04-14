import { useEffect } from "react";

import { useArtwork } from "../hooks/useArtwork";
import { ArtworkDetail } from "../components/artwork/ArtworkDetail";

import { Skeleton } from "../components/ui";

type DiscoverPageProps = {
  selectedFavoriteId: number | null;
};

function DiscoverPage({ selectedFavoriteId }: DiscoverPageProps) {
  const { artwork, loading, error, loadRandomArtwork, loadArtworkById } = useArtwork();

  useEffect(() => {
    if (selectedFavoriteId !== null) {
      loadArtworkById(selectedFavoriteId);
    }
  }, [selectedFavoriteId, loadArtworkById]);

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
          onDiscoverAnother={loadRandomArtwork}
        />
      )}
    </main>
  );
}

export { DiscoverPage };
