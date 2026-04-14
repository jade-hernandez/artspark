import { useEffect, useState } from "react";

import { useAuthContext } from "../../contexts/AuthContext";

import { Button } from "../ui/Button";
import { HeartIcon } from "../icons/HeartIcon";

import { cn } from "../../utils/utils";

type HeaderProps = {
  onOpenCollection: () => void;
};

function Header({ onOpenCollection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, openAuthModal, signOut } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "border-border sticky top-0 z-20 w-full border-b px-6 py-4 transition-all duration-300",
        isScrolled ? "bg-white/80 shadow-sm backdrop-blur-md" : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className='flex items-center justify-between'>
        <span className='text-text-primary text-xl font-bold'>ArtSpark</span>

        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='md'
            onClick={user ? signOut : openAuthModal}
          >
            {user ? "Sign out" : "Sign in"}
          </Button>

          <Button
            variant='ghost'
            size='icon-md'
            aria-label='Open my collection'
            onClick={onOpenCollection}
          >
            <HeartIcon className='stroke-accent h-5 w-5 fill-none' />
          </Button>
        </div>
      </div>
    </header>
  );
}

export { Header };
