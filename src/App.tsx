import { useState } from "react";

import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AuthModal } from "./components/auth/AuthModal";
import { Drawer } from "./components/layout/Drawer";
import { Header } from "./components/layout/Header";
import { DiscoverPage } from "./pages/DiscoverPage";

import type { DisplayIntent } from "./pages/DiscoverPage";
import type { Favorite } from "./types/artwork";

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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}

export { App };
