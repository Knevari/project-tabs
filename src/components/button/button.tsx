import React from "react";
import { cn } from "@/utils/cn";
import { button } from "./button.variants";

const Button = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) => {
  return <button className={cn(button(), className)} {...props}></button>;
};

export default Button;
