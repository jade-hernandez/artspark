import { useState } from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { Drawer } from "./components/layout/Drawer";
import { Header } from "./components/layout/Header";
import { DiscoverPage } from "./pages/DiscoverPage";

import type { DisplayIntent } from "./pages/DiscoverPage";
import type { Favorite } from "./types/artwork";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Single source of truth for what DiscoverPage should display.
  // Using an object (not a primitive) ensures a new reference is created
  // on every action — including re-selecting the same favourite — so
  // DiscoverPage's useEffect always re-runs as expected.
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
    <AuthProvider>
      <FavoritesProvider>
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
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export { App };
