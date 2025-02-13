import { create } from "zustand";
import { ImageValidationResponse } from "@/features/scoop/components/ValidationResponse/ValidationResponse.types";

interface useValidationState {
  isValidationLoading: boolean;
  responseValidation: ImageValidationResponse | null;
  setIsValidationLoading: (isValidationLoading: boolean) => void;
  setResponseValidation: (responseValidation: ImageValidationResponse | null) => void;
  clearAll: () => void;
}

export const useValidation = create<useValidationState>((set) => ({
  isValidationLoading: false,
  responseValidation: null,
  setIsValidationLoading: (isValidationLoading) => set({ isValidationLoading }),
  setResponseValidation: (responseValidation) => set({ responseValidation }),
  clearAll: () => set({ isValidationLoading: false, responseValidation: null }),
}));
