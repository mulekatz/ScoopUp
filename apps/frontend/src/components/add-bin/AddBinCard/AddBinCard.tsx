import type { AddBinCardProps } from "./AddBinCard.types";

export function AddBinCard({
  children,

  className = "",
  title,
}: AddBinCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
