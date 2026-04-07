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
      <Header onOpenCollection={handleOpenCollection} />

      <main>
        {loading && !artwork && (
          <div className='flex min-h-[60vh] items-center justify-center'>
            <Loader />
          </div>
        )}

        {error && (
          <p className='py-12 text-center text-[#6B6B6B]'>
            Something went wrong. Please try again later.
          </p>
        )}

        {artwork && (
          <ArtworkDetail
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
