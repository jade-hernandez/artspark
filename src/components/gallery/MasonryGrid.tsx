import type { Favorite } from "../../types/artwork";
import { ArtworkCard } from "../artwork/ArtworkCard";

type MasonryGridProps = {
  favorites: Favorite[];
  onSelect: (favorite: Favorite) => void;
  onRemove: (artworkId: number) => void;
};

function MasonryGrid({ favorites, onSelect, onRemove }: MasonryGridProps) {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {favorites.map(favorite => (
        <ArtworkCard
          key={favorite.id}
          favorite={favorite}
          onSelect={() => onSelect(favorite)}
          onRemove={() => onRemove(favorite.artwork_id)}
        />
      ))}
    </div>
  );
}

export { MasonryGrid };
