import { cn } from "@/lib/utils";

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Overlay = ({ children, className, ...props }: OverlayProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={0}
      className={cn(
        "absolute flex flex-col gap-4 items-center justify-center",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-[120%] h-[120%]",
        "bg-secondary/20 backdrop-blur-sm",
        "text-secondary-foreground p-3 rounded-4xl z-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
