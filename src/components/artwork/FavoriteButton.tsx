import { useState } from "react";

import { type ArtworkWithImage, type FavoriteInsert } from "../../types/artwork";

import { HeartIcon } from "../icons/HeartIcon";

import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { cn } from "../../utils/utils";
import { Button } from "../ui";

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
      <Button
        variant='ghost'
        size='icon-md'
        aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isActive}
        onClick={handleClick}
        className='inline-flex items-center justify-center rounded-full border-none p-2 transition-transform duration-200 hover:scale-110 focus:outline-none active:scale-95'
      >
        <HeartIcon
          className={cn(
            "transition-colors duration-200",
            isActive ? "fill-accent stroke-accent" : "stroke-accent fill-none"
          )}
        />
      </Button>

      {error && (
        <p
          role='alert'
          className='text-accent text-center text-sm'
        >
          {error}
        </p>
      )}
    </div>
  );
}

export { FavoriteButton };
