import { useEffect, useState } from "react";

import { Button } from "../ui/Button";
import { cn } from "../../utils/utils";

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
        "sticky top-0 z-50 w-full border border-[#E5E5E5] px-6 py-4 transition-all duration-300",
        isScrolled
          ? "border-[#E5E5E5] bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-[#FAFAFA]/80 backdrop-blur-sm"
      )}
    >
      <div className='flex items-center justify-between'>
        <span className='text-xl font-bold text-[#1A1A1A]'>ArtSpark</span>

        <Button
          variant='ghost'
          size='md'
          aria-label='Open my collection'
          onClick={onOpenCollection}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='20'
            height='20'
            fill='none'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='stroke-[#1A1A1A]'
          >
            <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
          </svg>
          My Collection
        </Button>
      </div>
    </header>
  );
}

export { Header };
