import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-bold uppercase tracking-[0.15em] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        
        default: "bg-brand-magenta text-white hover:bg-brand-dark shadow-md",
        
        destructive: "bg-brand-dark text-white hover:bg-brand-magenta",
        
        outline: "border-2 border-brand-light-gray bg-transparent text-brand-dark hover:bg-brand-gray hover:border-brand-dark",
        secondary: "bg-brand-gray text-brand-dark hover:bg-brand-light-gray",
        ghost: "hover:bg-brand-gray text-brand-dark",
        link: "text-brand-magenta underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-2", 
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-10 text-sm",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };