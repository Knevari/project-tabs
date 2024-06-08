import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva("py-1.5 px-1.5 bg-blue-500", {
  variants: {
    intent: {
      primary: ["your", "primary", "classes"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface ButtonVariants extends VariantProps<typeof buttonVariants> {}

export const button = (variants?: ButtonVariants) =>
  twMerge(buttonVariants(variants));
