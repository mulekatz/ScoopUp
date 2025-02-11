import { OverlayProps } from "./Overlay.types";

export const Overlay = ({ children }: OverlayProps) => {
  return (
    <div
      className="absolute flex flex-col gap-4 items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/20 backdrop-blur-sm text-secondary-foreground p-3 rounded-lg z-10"
    >
      {children}
    </div>
  );
};
