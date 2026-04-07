import { type ArtworkWithImage, type FavoriteInsert } from "../../types/artwork";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { cn } from "../../utils/utils";

type FavoriteButtonProps = {
  artwork: ArtworkWithImage;
  onRequireAuth: () => void;
};

function FavoriteButton({ artwork, onRequireAuth }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites(user?.id ?? null);

  const isActive = isFavorite(artwork.id);

  async function handleClick() {
    if (!user) {
      onRequireAuth();
      return;
    }

    try {
      if (isActive) {
        await removeFavorite(artwork.id);
      } else {
        const favorite: FavoriteInsert = {
          artwork_id: artwork.id,
          title: artwork.title,
          artist: artwork.artist_title,
          image_id: artwork.image_id,
        };

        await addFavorite(favorite);
      }
    } catch {
      // will improve error handling later
    }
  }

  return (
    <button
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isActive}
      onClick={handleClick}
      className='inline-flex items-center justify-center p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D4A] focus-visible:ring-offset-2'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='24'
        height='24'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={cn(
          "transition-colors duration-200",
          isActive
            ? "fill-[#E85D4A] stroke-[#E85D4A]"
            : "fill-none stroke-[#E85D4A]"
        )}
      >
        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
      </svg>
    </button>
  );
}

export { FavoriteButton };
