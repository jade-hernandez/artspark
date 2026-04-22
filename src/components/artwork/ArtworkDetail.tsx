import { useState } from "react";

import { type ArtworkWithImage } from "../../types/artwork";

import { IIIF_BASE_URL, IIIF_SIZES } from "../../lib/constants";
import { stripHtml } from "../../utils/strip-html";

import { LoaderIcon } from "../icons/LoaderIcon";
import { Button, Lightbox, Skeleton } from "../ui";

import { FavoriteButton } from "./FavoriteButton";

import { cn } from "../../utils/utils";

type ArtworkDetailProps = {
  artwork: ArtworkWithImage;

  onDiscoverAnother: () => void;
};

function ArtworkDetail({ artwork, onDiscoverAnother }: ArtworkDetailProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = `${IIIF_BASE_URL}/${artwork.image_id}/full/${IIIF_SIZES.standard}/0/default.jpg`;
  const imageUrlHD = isLightboxOpen
    ? `${IIIF_BASE_URL}/${artwork.image_id}/full/${IIIF_SIZES.highRes}/0/default.jpg`
    : "";

  const metadataParts = [
    artwork.date_display,
    artwork.medium_display,
    artwork.place_of_origin,
  ].filter(Boolean);
  const metadataLine = metadataParts.join(" · ");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className='animate-fade-in mx-auto flex w-[calc(100%-2rem)] max-w-2xl flex-col items-center gap-8 py-12'>
      <div className='relative h-100 w-full md:h-125'>
        {!imageLoaded && !imageError && <Skeleton className='h-full w-full' />}
        {imageError && (
          <div className='flex h-full w-full items-center justify-center'>
            <p className='text-text-secondary text-sm'>Image unavailable</p>
          </div>
        )}
        <img
          src={imageUrl}
          alt={artwork.title}
          width={843}
          height={843}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          onClick={() => !imageError && setIsLightboxOpen(true)}
          className={cn(
            "h-full w-full object-contain transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "absolute inset-0 opacity-0",
            imageError ? "hidden" : "cursor-zoom-in"
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

      <div className='flex items-center gap-3'>
        <FavoriteButton artwork={artwork} />
        <Button
          variant='outline'
          size='md'
          onClick={() => {
            onDiscoverAnother();
            scrollToTop();
          }}
        >
          <LoaderIcon />
          Discover another
        </Button>
      </div>

      {artwork.description && (
        <div className='flex w-full max-w-xl flex-col items-center'>
          <div className='relative w-full'>
            <div
              className={cn(
                "text-text-primary overflow-hidden text-left text-base leading-relaxed transition-[max-height] duration-500 ease-in-out",
                showDescription ? "max-h-500" : "max-h-24"
              )}
            >
              {stripHtml(artwork.description ?? "")}
            </div>

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
