import { type ArtworkWithImage, type FavoriteInsert } from "../../types/artwork";
import { HeartIcon } from "../icons/HeartIcon";
import { cn } from "../../utils/utils";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState } from "react";

type FavoriteButtonProps = {
  artwork: ArtworkWithImage;
  onUnauthenticated?: () => void;
};

function FavoriteButton({ artwork, onUnauthenticated }: FavoriteButtonProps) {
  const { user } = useAuthContext();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext();
  const [error, setError] = useState<string | null>(null);

  const isActive = isFavorite(artwork.id);

  async function handleClick() {
    if (!user) {
      onUnauthenticated?.();
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
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isActive}
        onClick={handleClick}
        className='inline-flex items-center justify-center rounded-full p-2 transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D4A] focus-visible:ring-offset-2 active:scale-95'
      >
        <HeartIcon
          className={cn(
            "transition-colors duration-200",
            isActive ? "fill-[#E85D4A] stroke-[#E85D4A]" : "fill-none stroke-[#E85D4A]"
          )}
        />
      </button>

      {error && (
        <p
          role='alert'
          className='text-center text-sm text-[#E85D4A]'
        >
          {error}
        </p>
      )}
    </div>
  );
}

export { FavoriteButton };
