import { useDisclosure, useValidation } from "@/hooks";
import { CheckCircle, XCircle } from "lucide-react";
import { ValidationStep } from "./ValidationResponse.types";

export const ValidationResponse = () => {
  const { responseValidation, setResponseValidation } = useValidation();
  const { onClose } = useDisclosure();

  if (!responseValidation) return null;

  const handleOnClick = () => {
    onClose();
    setResponseValidation(null);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center p-4 text-center gap-12">
      {responseValidation.isValid ? (
        <CheckCircle className="text-accent" size={72} />
      ) : (
        <XCircle className="text-destructive" size={72} />
      )}
      <p className="text-lg">
        Score:{" "}
        {responseValidation.isValid ? (
          <span className="text-accent font-semibold">Perfect</span>
        ) : (
          <span className="text-destructive font-semibold">Bad</span>
        )}
      </p>
      <div className="flex flex-col items-center justify-center">
        {responseValidation.step === ValidationStep.STEP2 && !responseValidation.isValid && (
          <div className="flex flex-row gap-2 text-sm">
            <p>Image Quality: </p>
            <p
              className={
                !responseValidation.isValid &&
                responseValidation.step === ValidationStep.STEP2 &&
                responseValidation.locationMatch !== undefined &&
                responseValidation.locationMatch >= 0.8
                  ? "text-destructive"
                  : responseValidation.validityFactor >= 0.6
                    ? "text-accent"
                    : "text-destructive"
              }
            >
              {!responseValidation.isValid &&
              responseValidation.step === ValidationStep.STEP2 &&
              responseValidation.locationMatch !== undefined &&
              responseValidation.locationMatch >= 0.8
                ? "Failed"
                : responseValidation.validityFactor >= 0.6
                  ? "OK"
                  : "Failed"}
            </p>
          </div>
        )}
        {responseValidation.step === ValidationStep.STEP2 && !responseValidation.isValid &&
          responseValidation.locationMatch !== undefined && (
            <div className="flex flex-row gap-2 text-sm">
              <p>Location Match:</p>
              <p
                className={
                  responseValidation.locationMatch >= 0.8
                    ? "text-accent"
                    : "text-destructive"
                }
              >
                {responseValidation.locationMatch >= 0.8 ? "OK" : "Failed"}
              </p>
            </div>
          )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{responseValidation.analysis}</p>
      </div>
      <button
        onClick={handleOnClick}
        className={`flex flex-col items-center bg-accent text-accent-foreground font-semibold text-lg py-2 px-8 w-fit rounded-full shadow-lg transition-colors duration-300 cursor-pointer hover:bg-accent/90"}`}
      >
        Done
      </button>
    </div>
  );
};
