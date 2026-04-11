import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const selectTriggerVariants = cva(
  "flex h-9 w-full min-w-0 appearance-none rounded-lg border border-border bg-background px-3 py-1 pr-9 text-sm text-foreground shadow-theme-sm transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof selectTriggerVariants>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(selectTriggerVariants({ variant, className }))}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select, selectTriggerVariants };
