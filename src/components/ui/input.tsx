import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const inputVariants = cva(
  "flex h-9 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-1 text-sm text-foreground shadow-theme-sm transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error:
          "border-danger focus-visible:ring-danger aria-invalid:border-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
