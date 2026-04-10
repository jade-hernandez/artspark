import { useEffect, useRef } from "react";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Portal } from "../ui/Portal";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { MasonryGrid } from "../gallery/MasonryGrid";
import { CloseIcon } from "../icons/CloseIcon";
import { cn } from "../../utils/utils";
import type { Favorite } from "../../types/artwork";

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
      document.body.style.overflow = "unset";
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
            "fixed inset-y-0 right-0 z-50 flex h-screen w-full flex-col bg-[#F0F0F0] shadow-lg transition-transform duration-300 ease-in-out md:w-100",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className='flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4'>
            <h2
              id='drawer-title'
              className='text-xl font-semibold text-[#1A1A1A]'
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
              <p className='text-[#6B6B6B]'>No favorites yet.</p>
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
