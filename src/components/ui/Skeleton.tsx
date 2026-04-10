import { cn } from "../../utils/utils";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-[#E5E5E5]", className)} />;
}

export { Skeleton };
