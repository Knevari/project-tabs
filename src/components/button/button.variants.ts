import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva("font-semibold rounded-lg", {
  variants: {
    intent: {
      primary: "bg-blue-500 text-white",
    },
    size: {
      small: "p-1",
      medium: "p-1.5",
      large: "px-3 py-2",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonVariants extends VariantProps<typeof buttonVariants> {}

export const button = (variants?: ButtonVariants) =>
  twMerge(buttonVariants(variants));
