import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-white shadow-theme-sm hover:opacity-90 active:opacity-100",
        secondary:
          "border border-border bg-surface-subtle text-foreground hover:bg-surface-muted",
        outline:
          "border border-border bg-background text-foreground hover:bg-surface-subtle",
        ghost: "text-foreground hover:bg-surface-subtle",
        destructive:
          "bg-danger text-white shadow-theme-sm hover:opacity-90 active:opacity-100",
        link: "h-auto p-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs [&_svg]:size-3.5",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-lg px-6 text-base [&_svg]:size-[1.125rem]",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type = "button", ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(!asChild ? { type } : {})}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
