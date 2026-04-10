import { type ArtworkWithImage, type FavoriteInsert } from "../../types/artwork";

import { HeartIcon } from "../icons/HeartIcon";

import { cn } from "../../utils/utils";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useAuthContext } from "../../contexts/AuthContext";

type FavoriteButtonProps = {
  artwork: ArtworkWithImage;
  onRequireAuth: () => void;
};

function FavoriteButton({ artwork, onRequireAuth }: FavoriteButtonProps) {
  const { user } = useAuthContext();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext();

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
      className='inline-flex items-center justify-center rounded-full p-2 transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D4A] focus-visible:ring-offset-2 active:scale-95'
    >
      <HeartIcon
        className={cn(
          "transition-colors duration-200",
          isActive ? "fill-[#E85D4A] stroke-[#E85D4A]" : "fill-none stroke-[#E85D4A]"
        )}
      />
    </button>
  );
}

export { FavoriteButton };
