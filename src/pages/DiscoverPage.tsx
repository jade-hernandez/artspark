import { useArtwork } from "../hooks/useArtwork";
import { Header } from "../components/layout/Header";
import { ArtworkDetail } from "../components/artwork/ArtworkDetail";
import { Loader } from "../components/ui/Loader";

function DiscoverPage() {
  const { artwork, loading, error, loadRandomArtwork } = useArtwork();

  function handleOpenCollection() {
    console.log("Open collection");
  }

  function handleRequireAuth() {
    console.log("Auth required");
  }

  return (
    <div className='min-h-screen bg-[#FAFAFA]'>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#1A1A1A] focus:shadow-md focus:ring-2 focus:ring-[#E85D4A] focus:outline-none'
      >
        Skip to main content
      </a>

      <Header onOpenCollection={handleOpenCollection} />

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
    </div>
  );
}

export { DiscoverPage };
