import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { ReactNode } from "react";

export default function SkeletonButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "secondary",
          className: "pointer-events-none animate-pulse w-24",
        }),
        className
      )}
    />
  );
}

export function SkeletonArray({
  amount,
  children,
}: {
  amount: number;
  children: ReactNode;
}) {
  return Array.from({ length: amount }).map(() => children);
}

export function SkeletonText({
  row = 1,
  size = "md",
  className,
}: {
  row?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <SkeletonArray amount={row}>
        <div
          className={cn(
            "bg-secondary animate-pulse w-full rounded-sm",
            row > 1 && "last:w-3/4",
            size === "md" && "h-3",
            size === "lg" && "h-5",
            className
          )}
        />
      </SkeletonArray>
    </div>
  );
}
