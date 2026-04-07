import { useEffect, useRef, type ReactNode } from "react";
import { Portal } from "./Portal";
import { cn } from "../../utils/utils";
import { useFocusTrap } from "../../hooks/useFocusTrap";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
};

function Modal({ isOpen, onClose, children, labelledBy }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen);

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

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div
        aria-modal='true'
        role='dialog'
        aria-labelledby={labelledBy}
        className='fixed inset-0 z-50 flex items-center justify-center'
      >
        <div
          aria-hidden='true'
          className={cn(
            "duration-250ms absolute inset-0 bg-black/50 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />

        <div
          ref={dialogRef}
          className={cn(
            "relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg transition-all duration-250",
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export { Modal };
