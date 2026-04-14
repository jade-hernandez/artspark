import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent ",
        outline:
          "border border-border bg-transparent text-text-primary hover:bg-surface focus-visible:ring-border ",
        ghost: "bg-transparent text-text-primary hover:bg-surface focus-visible:ring-border ",
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
