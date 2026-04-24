import { useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { AuthModal } from "./components/auth/AuthModal";
import { Drawer } from "./components/layout/Drawer";
import { Header } from "./components/layout/Header";
import { DiscoverPage } from "./pages/DiscoverPage";

import type { DisplayIntent } from "./pages/DiscoverPage";
import type { Favorite } from "./types/artwork";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthModalOpen, closeAuthModal } = useAuthContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [displayIntent, setDisplayIntent] = useState<DisplayIntent>({
    type: "artwork-of-the-day",
  });

  function handleSelect(favorite: Favorite) {
    setDisplayIntent({ type: "favorite", artworkId: favorite.artwork_id });
    setIsDrawerOpen(false);
  }

  function handleDiscoverAnother() {
    setDisplayIntent({ type: "random" });
  }

  return (
    <div className='bg-background min-h-screen'>
      <Header onOpenCollection={() => setIsDrawerOpen(true)} />
      <DiscoverPage
        displayIntent={displayIntent}
        onDiscoverAnother={handleDiscoverAnother}
      />
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelect={handleSelect}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
      <Toaster
        position='bottom-center'
        offset={32}
        mobileOffset={24}
        toastOptions={{
          style: {
            backgroundColor: "#f9543f",
            color: "white",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            fontSize: "14px",
            padding: "12px 20px",
            width: "fit-content",
            borderRadius: "8px",
          },
          classNames: {
            error: "border-accent",
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export { App };
