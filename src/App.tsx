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
  console.log("App rendered with selectedFavoriteId:", selectedFavoriteId);

  function handleSelect(favorite: Favorite) {
    console.log("App Selected favorite artwork ID:", favorite.artwork_id);
    setSelectedFavoriteId(favorite.artwork_id);
    setIsDrawerOpen(false);
  }
  console.log("App rendered with selectedFavoriteId:", selectedFavoriteId);
  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className='bg-background min-h-screen'>
          <Header onOpenCollection={() => setIsDrawerOpen(true)} />
          {/*
              FIXME:
              We have an issue with the DiscoverPage. It doesn't reload/refresh when:
              - User saves an artwork to favorites, say ART#1 -> This works
              - User clicks on favorites drawer and selects another artwork, say ART#2 -> This works
              - User clicks on "Discover another artwork" button, say ART#3 -> This works
              - User now clicks again on the favorites drawer and selects the same artwork - ART#2 - that was previously displayed -> This doesn't work:
                  the DiscoverPage doesn't update and still shows ART#3.
                  It only updates if we select a different artwork from the drawer, say ART#1,
                  but not if we select the same one that was previously displayed.
                  This is a problem because users might want to re-select the same artwork from their favorites to view it again, but it won't update.
                  We need to fix this issue so that the DiscoverPage refreshes and shows the selected artwork even if it's the same one that was previously displayed.

                  l'erreur que nous avons est une erreur de state,
                  car quand on click sur discover another finalement on garde en memoir l'id du favoris selectionné
                  alors qu'il devrait se mettre à null quand on click sur le bouton discover another
                  car il n'est plus selectionné

                  useEffect ne reçoit pas la mise à jour de selectedFavoriteId quand on click sur discover another
                  car on ne met pas à jour selectedFavoriteId dans le handler de discover another
                  il faudrait que dans le handler de discover another mette à jour selectedFavoriteId à null
                  pour forcer le useEffect à se déclencher et recharger un nouvel artwork
            */}
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
