import { useEffect } from "react";
import { useArtwork } from "../hooks/useArtwork";
import { ArtworkDetail } from "../components/artwork/ArtworkDetail";
import { Loader } from "../components/ui/Loader";

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

  function handleRequireAuth() {
    console.log("Auth required");
  }

  return (
    <main
      id='main-content'
      aria-label='Artwork discovery'
      aria-live='polite'
      aria-busy={loading}
    >
      {loading && !artwork && (
        <div className='flex min-h-[60vh] items-center justify-center'>
          <Loader />
        </div>
      )}
      {error && (
        <p
          role='alert'
          className='py-12 text-center text-[#6B6B6B]'
        >
          Something went wrong. Please try again later.
        </p>
      )}
      {artwork && (
        <ArtworkDetail
          key={artwork.id}
          artwork={artwork}
          onDiscoverAnother={loadRandomArtwork}
          onRequireAuth={handleRequireAuth}
        />
      )}
    </main>
  );
}

export { DiscoverPage };
