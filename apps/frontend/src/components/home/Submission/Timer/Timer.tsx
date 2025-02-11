import { useEffect, useState, useCallback } from "react";
import { useImageStore } from "@/stores/useImageStore";
import { cn } from "@/lib/utils";
import { LiaUndoAltSolid } from "react-icons/lia";
import { Overlay } from "../LivePhoto/Overlay";
import { SUBMISSION_TIMELIMIT } from "@/config";

export function Timer() {
  const { timestamp, isExpired, setIsExpired, firstImage, secondImage, thirdImage } = useImageStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const getCurrentTimeLimit = useCallback(() => {
    if (!firstImage) return 0;
    if (!secondImage) return SUBMISSION_TIMELIMIT.FIRST_TO_SECOND;
    if (!thirdImage) return SUBMISSION_TIMELIMIT.SECOND_TO_THIRD;
    return SUBMISSION_TIMELIMIT.THIRD_TO_SUBMIT;
  }, [firstImage, secondImage, thirdImage]);

  const calculateTimeLeft = useCallback((currentTimestamp: number) => {
    const timeLimit = getCurrentTimeLimit();
    return Math.max(0, timeLimit - (Date.now() - currentTimestamp));
  }, [getCurrentTimeLimit]);

  useEffect(() => {
    if (!timestamp) return;

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft(timestamp);
      setTimeLeft(newTimeLeft);
      setIsExpired(newTimeLeft <= 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timestamp, calculateTimeLeft, setIsExpired]);

  if (!timestamp || !firstImage) return null;

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
    <Overlay>
      <button
        className="flex flex-col gap-4 w-full h-full items-center justify-center"
        aria-label="Timer zurücksetzen"
      >
        <LiaUndoAltSolid
          size={96}
          className="text-primary-foreground cursor-pointer"
          onClick={handleUndo}
        />
        <p className="text-xl font-semibold text-primary-foreground">
          Time is up!
        </p>
      </button>
    </Overlay>
  );
};
