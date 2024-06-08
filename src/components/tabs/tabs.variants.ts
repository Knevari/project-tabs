import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import * as styles from "./tabs.module.css";

const tabVariants = cva(styles["tabs-list-item"], {
  variants: {
    intent: {
      inactive: "hover:bg-blue-500/50",
      active: "bg-blue-700 text-white",
    },
  },
  defaultVariants: {
    intent: "inactive",
  },
});

export interface TabVariants extends VariantProps<typeof tabVariants> {}

export const tab = (variants?: TabVariants) => twMerge(tabVariants(variants));
