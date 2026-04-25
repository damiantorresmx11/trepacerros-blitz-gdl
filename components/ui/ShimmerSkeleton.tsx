interface ShimmerSkeletonProps {
  variant?: "text" | "card" | "stat" | "avatar";
  className?: string;
}

const variants = {
  text: "h-4 w-3/4 rounded-lg",
  card: "h-40 w-full rounded-card",
  stat: "h-20 w-full rounded-xl",
  avatar: "h-16 w-16 rounded-full",
};

export function ShimmerSkeleton({ variant = "text", className = "" }: ShimmerSkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${variants[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
