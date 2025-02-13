import { create } from "zustand";
import { SubmissionResponse } from "@/features/scoop/components/SubmissionResponse/SubmissionResponse.types";

interface useSubmissionState {
  isLoading: boolean;
  response: SubmissionResponse | null;
  setIsLoading: (isLoading: boolean) => void;
  setResponse: (response: SubmissionResponse | null) => void;
  clearAll: () => void;
}

export const useSubmission = create<useSubmissionState>((set) => ({
  isLoading: false,
  response: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setResponse: (response) => set({ response } ),
  clearAll: () => set({ isLoading: false, response: null }),
}));
