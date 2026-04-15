import { useState } from "react";

import { type ArtworkWithImage } from "../../types/artwork";

import { LoaderIcon } from "../icons/LoaderIcon";
import { Button, Lightbox, Skeleton } from "../ui";

import { FavoriteButton } from "./FavoriteButton";

import { cn } from "../../utils/utils";

type ArtworkDetailProps = {
  artwork: ArtworkWithImage;
  iiifUrl?: string;
  onDiscoverAnother: () => void;
};

function ArtworkDetail({ artwork, iiifUrl, onDiscoverAnother }: ArtworkDetailProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const baseIiifUrl = iiifUrl ?? "https://www.artic.edu/iiif/2";
  const imageUrl = `${baseIiifUrl}/${artwork.image_id}/full/843,/0/default.jpg`;
  const imageUrlHD = `${baseIiifUrl}/${artwork.image_id}/full/full/0/default.jpg`;

  const metadataParts = [
    artwork.date_display,
    artwork.medium_display,
    artwork.place_of_origin,
  ].filter(Boolean);
  const metadataLine = metadataParts.join(" · ");

  return (
    <div className='animate-fade-in mx-auto flex w-[calc(100%-2rem)] max-w-2xl flex-col items-center gap-8 py-12'>
      <div className='relative h-100 w-full md:h-125'>
        {!imageLoaded && <Skeleton className='h-full w-full' />}
        <img
          src={imageUrl}
          alt={artwork.title}
          width={843}
          height={843}
          onLoad={() => setImageLoaded(true)}
          onClick={() => setIsLightboxOpen(true)}
          className={cn(
            "h-full w-full cursor-zoom-in object-contain transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "absolute inset-0 opacity-0"
          )}
        />
      </div>

      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-text-primary text-3xl font-semibold'>{artwork.title}</h1>

        {artwork.artist_title && (
          <p className='text-text-primary text-lg font-medium'>{artwork.artist_title}</p>
        )}

        {metadataLine && <p className='text-text-secondary text-sm'>{metadataLine}</p>}
      </div>

      <div className='flex flex-col items-center gap-3'>
        <div className='flex items-center gap-4'>
          <FavoriteButton
            artwork={artwork}
            onUnauthenticated={() => setShowAuthMessage(true)}
          />

          <Button
            variant='outline'
            size='md'
            onClick={onDiscoverAnother}
          >
            <LoaderIcon />
            Discover another
          </Button>
        </div>

        {showAuthMessage && (
          <p className='text-text-secondary text-center text-sm'>Sign in to save favorites</p>
        )}
      </div>

      {artwork.description && (
        <div className='flex w-full max-w-xl flex-col items-center'>
          <div className='relative w-full'>
            <div
              className={cn(
                "text-text-primary overflow-hidden text-left text-base leading-relaxed transition-[max-height] duration-500 ease-in-out",
                showDescription ? "max-h-500" : "max-h-24"
              )}
              dangerouslySetInnerHTML={{ __html: artwork.description }}
            />

            {!showDescription && (
              <div
                aria-hidden='true'
                className='from-background pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-linear-to-t to-transparent'
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
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={imageUrlHD}
        alt={artwork.title}
      />
    </div>
  );
}

export { ArtworkDetail };
