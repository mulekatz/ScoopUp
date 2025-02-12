import { create } from "zustand";
import { ImageValidationResponse } from "@/components/home/Submission/Validation/ValidationResult/ValidationResult.types";

interface useSubmissionState {
  isLoading: boolean;
  response: ImageValidationResponse | null;
  setIsLoading: (isLoading: boolean) => void;
  setResponse: (response: ImageValidationResponse | null) => void;
  clearAll: () => void;
}

export const useSubmission = create<useSubmissionState>((set) => ({
  isLoading: false,
  response: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setResponse: (response) => set({ response } ),
  clearAll: () => set({ isLoading: false, response: null }),
}));
