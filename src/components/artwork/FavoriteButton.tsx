import { type ArtworkWithImage, type FavoriteInsert } from "../../types/artwork";
import { toast } from "sonner";

import { useFavorites } from "../../hooks/useFavorites";
import { useAuthContext } from "../../contexts/AuthContext";

import { HeartIcon } from "../icons/HeartIcon";
import { Button } from "../ui";

import { cn } from "../../utils/utils";

type FavoriteButtonProps = {
  artwork: ArtworkWithImage;
};

function FavoriteButton({ artwork }: FavoriteButtonProps) {
  const { user } = useAuthContext();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites(user?.id ?? null);

  const isActive = isFavorite(artwork.id);

  async function handleClick() {
    if (!user) {
      toast.info("Sign in to save favorites");
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
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
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
  );
}

export { FavoriteButton };
