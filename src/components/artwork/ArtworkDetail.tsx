import { useState } from "react";
import { type ArtworkWithImage } from "../../types/artwork";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { FavoriteButton } from "./FavoriteButton";
import { cn } from "../../utils/utils";
import { LoaderIcon } from "../icons/LoaderIcon";

type ArtworkDetailProps = {
  artwork: ArtworkWithImage;
  iiifUrl?: string;
  onDiscoverAnother: () => void;
};

function ArtworkDetail({ artwork, iiifUrl, onDiscoverAnother }: ArtworkDetailProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
      <div className='relative w-full'>
        {!imageLoaded && <Skeleton className='aspect-4/3 max-h-[70vh] w-full' />}
        <img
          src={imageUrl}
          alt={artwork.title}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "max-h-[70vh] w-full object-contain transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "absolute inset-0 opacity-0"
          )}
        />
      </div>

      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-3xl font-semibold text-[#1A1A1A]'>{artwork.title}</h1>

        {artwork.artist_title && (
          <p className='text-lg font-medium text-[#1A1A1A]'>{artwork.artist_title}</p>
        )}

        {metadataLine && <p className='text-sm text-[#6B6B6B]'>{metadataLine}</p>}
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
          <p className='text-center text-sm text-[#6B6B6B]'>Sign in to save favorites</p>
        )}
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
