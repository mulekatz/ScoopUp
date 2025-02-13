import type { MapCardProps } from "./MapCard.types";

export function MapCard({
  children,
  className = "",
  title,
}: MapCardProps) {

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}

      {children}
    </div>
  );
}
