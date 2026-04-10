import { type ButtonHTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "./button-variants";

import { cn } from "../../utils/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export { Button };
