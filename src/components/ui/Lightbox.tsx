import { useEffect, useRef } from "react";

import { Button } from "./Button";
import { Portal } from "./Portal";

import { CloseIcon } from "../icons/CloseIcon";

import { useFocusTrap } from "../../hooks/useFocusTrap";

import { cn } from "../../utils/utils";

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
};

function Lightbox({ isOpen, onClose, imageUrl, alt }: LightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef as React.RefObject<HTMLElement>, isOpen);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <Portal>
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      >
        <Button
          variant='ghost'
          size='icon-md'
          aria-label='Close lightbox'
          className='fixed top-4 right-4 text-white hover:bg-white/20'
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
        >
          <CloseIcon />
        </Button>

        <img
          src={imageUrl}
          alt={alt}
          className='h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain'
          onClick={e => e.stopPropagation()}
        />
      </div>
    </Portal>
  );
}

export { Lightbox };
