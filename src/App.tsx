import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { Drawer } from "./components/layout/Drawer";
import { Header } from "./components/layout/Header";
import { DiscoverPage } from "./pages/DiscoverPage";
import type { Favorite } from "./types/artwork";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);

  function handleSelect(favorite: Favorite) {
    setSelectedFavoriteId(favorite.artwork_id);
    setIsDrawerOpen(false);
  }

  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className='bg-background min-h-screen'>
          <Header onOpenCollection={() => setIsDrawerOpen(true)} />
          <DiscoverPage selectedFavoriteId={selectedFavoriteId} />
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
