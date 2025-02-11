import { ImageValidationResponse } from "./ValidationResult.types";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  validation: ImageValidationResponse | null;
}

export const ValidationResult = ({validation}: Props) => {
  if (!validation) return null;

  const { validityFactors, overallValid } = validation;

  const getFailureMessage = (): string => {
    if (validityFactors.image1Valid < 0.8) {
      return "The first image doesn't show a clear dog waste. Please ensure it's clearly visible.";
    }
    if (validityFactors.image2Valid < 0.8) {
      return "The second image doesn't show a clear dog waste. Please ensure it's clearly visible.";
    }
    if (validityFactors.image3Valid < 0.7) {
      return "The disposal is not clearly visible. Please show clearly how the dog waste is being disposed of.";
    }
    if (validityFactors.locationMatch < 0.8) {
      return "The location before and after cleaning doesn't match. Please photograph the same spot.";
    }
    return "Unfortunately, the images don't meet all requirements. Please try again.";
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {overallValid ? (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Well done!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contributing to a cleaner environment.
          </p>
          <div className="flex items-center space-x-2">
            <p className="text-xl">You receive 1</p>
            <img src="/images/b3tr-token.svg" alt="Token" className="h-6 w-6" />
          </div>
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
          <p className="text-gray-600">
            {getFailureMessage()}
          </p>
        </>
      )}
    </div>
  );
};