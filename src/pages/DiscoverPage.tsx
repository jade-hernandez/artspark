import { useArtwork } from "../hooks/useArtwork";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { ArtworkDetail } from "../components/artwork/ArtworkDetail";
import { Loader } from "../components/ui/Loader";

function DiscoverPage() {
  const { artwork, loading, error, loadRandomArtwork } = useArtwork();

  // TODO: move to FavoritesContext + AuthContext in step 9 (auth implementation)
  const { user } = useAuth();
  useFavorites(user?.id ?? null);

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
