import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type LabelHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const labelVariants = cva(
  "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
Label.displayName = "Label";

export { Label, labelVariants };
