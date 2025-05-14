import { cn } from "../../lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={cn(
        "border-solid rounded-full animate-spin border-t-transparent",
        "border-[#8B5E3C]", // Using Kurumba Brown from our color scheme
        sizeClasses[size],
        className
      )}
    />
  );
}