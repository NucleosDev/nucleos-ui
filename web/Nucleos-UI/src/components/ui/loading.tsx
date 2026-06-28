interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

export function Loading({
  size = "md",
  color = "border-blue-600",
  fullScreen = true,
  text = "One moment...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-2",
    lg: "h-16 w-16 border-4",
  };

  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <div
          className={`
            animate-spin rounded-full 
            ${sizeClasses[size]} 
            border-t-transparent 
            ${color}
          `}
        />
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    </div>
  );
}
