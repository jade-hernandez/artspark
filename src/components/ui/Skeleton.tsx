import { cn } from "../../utils/utils";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("bg-border animate-pulse rounded-md", className)} />;
}

export { Skeleton };
