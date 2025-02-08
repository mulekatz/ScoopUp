import { useEffect, useState, useCallback } from "react";
import { useImageStore } from "@/stores/useImageStore";
import { SUBMISSION_TIMELIMIT } from "@/config";
import { cn } from "@/lib/utils";
import { LiaUndoAltSolid } from "react-icons/lia";

export function Timer() {
  const { timestamp, isExpired, setIsExpired } = useImageStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const calculateTimeLeft = useCallback((currentTimestamp: number) => {
    return Math.max(0, SUBMISSION_TIMELIMIT - (Date.now() - currentTimestamp));
  }, []);

  useEffect(() => {
    if (!timestamp) return;

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft(timestamp);
      setTimeLeft(newTimeLeft);
      setIsExpired(newTimeLeft <= 0);
    };

    // Initial calculation
    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timestamp, calculateTimeLeft, setIsExpired]);

  if (!timestamp) return null;

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formattedTime = {
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };

  return (
    <p
      className={cn(
        "text-sm font-bold",
        isExpired && "text-destructive animate-pulse"
      )}
      role="timer"
      aria-live="polite"
    >
      {formattedTime.minutes}:{formattedTime.seconds}
    </p>
  );
}

export const ResetButton = () => {
  const { isExpired, clearImages, setIsExpired } = useImageStore();

  const handleUndo = useCallback(() => {
    clearImages();
    setIsExpired(false);
  }, [clearImages, setIsExpired]);

  if (!isExpired) return null;

  return (
    <button
      className="absolute flex flex-col gap-4 items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/20 backdrop-blur-sm text-secondary-foreground p-3 rounded-lg z-10"
      aria-label="Timer zurücksetzen"
    >
      <LiaUndoAltSolid size={96} className="text-primary-foreground cursor-pointer" onClick={handleUndo} />
      <p className="text-xl font-semibold text-primary-foreground">Time is up!</p>
    </button>
  );
};
