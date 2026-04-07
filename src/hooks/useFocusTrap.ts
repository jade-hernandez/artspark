import { useEffect } from "react";
import type React from "react";

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    const lastFocusedElement = document.activeElement as HTMLElement;

    firstFocusable?.focus();

    element.addEventListener("keydown", handleTabKey);

    return () => {
      element.removeEventListener("keydown", handleTabKey);
      lastFocusedElement?.focus();
    };
  }, [isActive, ref]);
}

export { useFocusTrap };
