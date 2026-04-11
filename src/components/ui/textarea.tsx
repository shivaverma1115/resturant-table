import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const textareaVariants = cva(
  "flex min-h-[4.5rem] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-theme-sm transition-[color,box-shadow] placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
