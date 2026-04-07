import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-[#E85D4A] text-white hover:bg-[#D14A38] focus-visible:ring-[#E85D4A]",
        outline:
          "border border-[#E5E5E5] bg-transparent text-[#1A1A1A] hover:bg-[#F0F0F0] focus-visible:ring-[#E5E5E5]",
        ghost: "bg-transparent text-[#1A1A1A] hover:bg-[#F0F0F0] focus-visible:ring-[#E5E5E5]",
      },
      size: {
        md: "px-4 py-2 text-sm rounded-md gap-2",
        lg: "px-6 py-3 text-base rounded-md gap-2",
        "icon-md": "p-2 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export { buttonVariants };
