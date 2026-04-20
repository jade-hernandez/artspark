import { useEffect, useRef } from "react";

import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";

import type { Favorite } from "../../types/artwork";

import { MasonryGrid } from "../gallery/MasonryGrid";
import { CloseIcon } from "../icons/CloseIcon";
import { Button, Loader, Portal } from "../ui";

import { cn } from "../../utils/utils";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (favorite: Favorite) => void;
};

function Drawer({ isOpen, onClose, onSelect }: DrawerProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { favorites, loading, error, removeFavorite } = useFavoritesContext();

  useFocusTrap(menuRef as React.RefObject<HTMLElement>, isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <Portal>
      <div
        id='drawer-container'
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      >
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='drawer-title'
          ref={menuRef}
          onClick={e => e.stopPropagation()}
          className={cn(
            "bg-surface fixed inset-y-0 right-0 z-50 flex h-screen w-full flex-col shadow-lg transition-transform duration-300 ease-in-out md:w-100",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className='border-border flex items-center justify-between border-b px-6 py-4'>
            <h2
              id='drawer-title'
              className='text-text-primary text-xl font-semibold'
            >
              My Collection
            </h2>
            <Button
              variant='ghost'
              size='icon-md'
              onClick={onClose}
              aria-label='Close drawer'
            >
              <CloseIcon />
            </Button>
          </div>

          <div className='flex flex-1 flex-col overflow-y-auto p-6'>
            {loading && <Loader />}
            {error && <p className='text-red-600'>Something went wrong. Please try again.</p>}
            {!loading && !error && favorites.length === 0 && (
              <p className='text-text-secondary text-center text-sm'>
                No favorites yet — start exploring!
              </p>
            )}
            {!loading && !error && favorites.length > 0 && (
              <MasonryGrid
                favorites={favorites}
                onSelect={onSelect}
                onRemove={removeFavorite}
              />
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export { Drawer };
