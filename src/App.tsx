import { useState } from "react";
import { Drawer } from "./components/layout/Drawer";
import { Header } from "./components/layout/Header";
import { DiscoverPage } from "./pages/DiscoverPage";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className='min-h-screen bg-[#FAFAFA]'>
      <Header onOpenCollection={() => setIsDrawerOpen(true)} />
      <DiscoverPage />
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        favorites={[]}
        loading={false}
        error={null}
      />
    </div>
  );
}

export { App };
