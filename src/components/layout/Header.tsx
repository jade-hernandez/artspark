import { useEffect, useState } from "react";

import { Button } from "../ui/Button";
import { cn } from "../../utils/utils";
import { HeartIcon } from "../icons/HeartIcon";

type HeaderProps = {
  onOpenCollection: () => void;
};

function Header({ onOpenCollection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "border-border sticky top-0 z-20 w-full border px-6 py-4 transition-all duration-300",
        isScrolled
          ? "border-border bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className='flex items-center justify-between'>
        <span className='text-text-primary text-xl font-bold'>ArtSpark</span>

        <Button
          variant='ghost'
          size='md'
          aria-label='Open my collection'
          onClick={onOpenCollection}
        >
          <HeartIcon className='stroke-accent h-5 w-5 fill-none' />
          My Collection
        </Button>
      </div>
    </header>
  );
}

export { Header };
