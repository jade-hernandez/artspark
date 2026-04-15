import type { Favorite } from "../../types/artwork";
import { CloseIcon } from "../icons/CloseIcon";
import { Button } from "../ui";

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
      onClick={onSelect}
      role='button'
      tabIndex={0}
      aria-label={`View ${favorite.title}`}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className='relative cursor-pointer overflow-hidden rounded-lg bg-white transition-all duration-150 ease-in-out hover:scale-[1.02] hover:shadow-md'
    >
      <div className='relative'>
        <img
          src={thumbnailUrl}
          alt={favorite.title}
          width={400}
          height={400}
          className='aspect-square w-full object-cover'
        />
        <Button
          variant='ghost'
          size='icon-md'
          onClick={handleRemove}
          aria-label={`Remove ${favorite.title} from favorites`}
          className='text-text-primary absolute top-1.5 right-1.5 rounded-full bg-white/90 hover:bg-white'
        >
          <CloseIcon />
        </Button>
      </div>
      <div className='px-2 py-2'>
        <p className='text-text-primary truncate text-sm font-medium'>{favorite.title}</p>
        {favorite.artist && (
          <p className='text-text-secondary truncate text-xs'>{favorite.artist}</p>
        )}
      </div>
    </div>
  );
}

export { ArtworkCard };
