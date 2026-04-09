import { useEffect, useRef } from "react";

import { Portal } from "../ui/Portal";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { CloseIcon } from "../icons/CloseIcon";
import { MasonryGrid } from "../gallery/MasonryGrid";

import type { Favorite } from "../../types/artwork";
import { useFocusTrap } from "../../hooks/useFocusTrap";

import { cn } from "../../utils/utils";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  onSelect: (favorite: Favorite) => void;
  onRemove: (artworkId: number) => void;
};

function Drawer({ isOpen, onClose, favorites, loading, error, onSelect, onRemove }: DrawerProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(menuRef as React.RefObject<HTMLElement>, isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      document.getElementById("page-body")?.classList.add("blur-sm", "brightness-90");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      document.getElementById("page-body")?.classList.remove("blur-sm", "brightness-90");
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
            "bg-surface fixed inset-y-0 top-0 right-0 z-50 h-screen w-full transform shadow-lg transition-transform duration-300 ease-in-out md:w-100",
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
              <p className='text-slate-500'>No favorites yet.</p>
            )}
            {!loading && !error && favorites.length > 0 && (
              <MasonryGrid
                favorites={favorites}
                onSelect={onSelect}
                onRemove={onRemove}
              />
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export { Drawer };
