import { type ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
};

function Portal({ children }: PortalProps) {
  const portalRoot = document.getElementById("portal-root");

  if (!portalRoot) {
    return null;
  }

  return createPortal(children, portalRoot);
}

export { Portal };
