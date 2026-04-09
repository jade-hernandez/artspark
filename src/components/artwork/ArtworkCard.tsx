import type { Favorite } from "../../types/artwork";
import { CloseIcon } from "../icons/CloseIcon";

type ArtworkCardProps = {
  favorite: Favorite;
  onSelect: () => void;
  onRemove: () => void;
};

function ArtworkCard({ favorite, onSelect, onRemove }: ArtworkCardProps) {
  const thumbnailUrl = `https://www.artic.edu/iiif/2/${favorite.image_id}/full/400,/0/default.jpg`;

  function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onRemove();
  }

  return (
    <div
      className='group relative cursor-pointer overflow-hidden rounded-lg bg-white transition-all duration-150 ease-in-out hover:scale-[1.02] hover:shadow-md'
      onClick={onSelect}
      role='button'
      tabIndex={0}
      aria-label={`View ${favorite.title}`}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className='relative'>
        <img
          src={thumbnailUrl}
          alt={favorite.title}
          className='aspect-square w-full object-cover'
        />
        <button
          onClick={handleRemove}
          aria-label={`Remove ${favorite.title} from favorites`}
          className='absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-sm leading-none text-[#1A1A1A] opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100 hover:bg-white'
        >
          <CloseIcon />
        </button>
      </div>
      <div className='px-2 py-2'>
        <p className='truncate text-sm font-medium text-[#1A1A1A]'>{favorite.title}</p>
        {favorite.artist && <p className='truncate text-xs text-[#6B6B6B]'>{favorite.artist}</p>}
      </div>
    </div>
  );
}

export { ArtworkCard };
