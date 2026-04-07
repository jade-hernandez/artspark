import { useState } from "react";
import { type ArtworkWithImage } from "../../types/artwork";
import { Button } from "../ui/Button";
import { FavoriteButton } from "./FavoriteButton";
import { cn } from "../../utils/utils";

type ArtworkDetailProps = {
  artwork: ArtworkWithImage;
  iiifUrl?: string;
  onDiscoverAnother: () => void;
  onRequireAuth: () => void;
};

function ArtworkDetail({ artwork, iiifUrl, onDiscoverAnother, onRequireAuth }: ArtworkDetailProps) {
  const [showDescription, setShowDescription] = useState(false);

  const baseIiifUrl = iiifUrl ?? "https://www.artic.edu/iiif/2";
  const imageUrl = `${baseIiifUrl}/${artwork.image_id}/full/843,/0/default.jpg`;

  const metadataParts = [
    artwork.date_display,
    artwork.medium_display,
    artwork.place_of_origin,
  ].filter(Boolean);
  const metadataLine = metadataParts.join(" · ");

  return (
    <div className='animate-fade-in mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-12'>
      <img
        src={imageUrl}
        alt={artwork.title}
        loading='lazy'
        className='max-h-[70vh] w-full object-contain'
      />

      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-3xl font-semibold text-[#1A1A1A]'>{artwork.title}</h1>

        {artwork.artist_title && (
          <p className='text-lg font-medium text-[#1A1A1A]'>{artwork.artist_title}</p>
        )}

        {metadataLine && <p className='text-sm text-[#6B6B6B]'>{metadataLine}</p>}
      </div>

      <div className='flex items-center gap-4'>
        <FavoriteButton
          artwork={artwork}
          onRequireAuth={onRequireAuth}
        />

        <Button
          variant='outline'
          size='md'
          onClick={onDiscoverAnother}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='16'
            height='16'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polyline points='23 4 23 10 17 10' />
            <polyline points='1 20 1 14 7 14' />
            <path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' />
          </svg>
          Discover another
        </Button>
      </div>

      {artwork.description && (
        <div className='flex w-full max-w-xl flex-col items-center'>
          <div className='relative w-full'>
            <div
              className={cn(
                "overflow-hidden text-left text-base leading-relaxed text-[#1A1A1A] transition-[max-height] duration-500 ease-in-out",
                showDescription ? "max-h-500" : "max-h-24"
              )}
              dangerouslySetInnerHTML={{ __html: artwork.description }}
            />

            {!showDescription && (
              <div
                aria-hidden='true'
                className='pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-linear-to-t from-[#FAFAFA] to-transparent'
              />
            )}
          </div>

          <Button
            variant='outline'
            size='md'
            onClick={() => setShowDescription(prev => !prev)}
            aria-expanded={showDescription}
            className='mt-4'
          >
            {showDescription ? "Show less" : "Read more"}
          </Button>
        </div>
      )}
    </div>
  );
}

export { ArtworkDetail };
