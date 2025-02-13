import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ImageState {
  firstImage: string | null;
  secondImage: string | null;
  thirdImage: string | null;
  timestamp: number | null;
  isExpired: boolean;
  setFirstImage: (image: string) => void;
  setSecondImage: (image: string) => void;
  setThirdImage: (image: string) => void;
  clearImages: () => void;
  setIsExpired: (isExpired: boolean) => void;
  clearImage: (imageType: "first" | "second" | "third") => void;
}

// TTL in Millisekunden (z.B. 1 Stunde)
const TTL = 60 * 60 * 1000;

// Custom Storage mit TTL Check
const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const stored = localStorage.getItem(name);
    if (!stored) return null;

    const { timestamp } = JSON.parse(stored);
    const isExpired = timestamp && Date.now() - timestamp > TTL;

    if (isExpired) {
      localStorage.removeItem(name);
      return null;
    }

    return stored;
  },
  setItem: (name: string, value: string) => {
    return localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    return localStorage.removeItem(name);
  },
};

export const useImageStore = create<ImageState>()(
  persist(
    (set) => ({
      firstImage: null,
      secondImage: null,
      thirdImage: null,
      timestamp: null,
      isExpired: false,
      setFirstImage: (image: string) =>
        set((state) => ({
          ...state,
          firstImage: image,
          timestamp: Date.now(),
        })),
      setSecondImage: (image: string) =>
        set((state) => ({
          ...state,
          secondImage: image,
          timestamp: Date.now(),
        })),
      setThirdImage: (image: string) =>
        set((state) => ({
          ...state,
          thirdImage: image,
          timestamp: Date.now(),
        })),
      clearImages: () =>
        set({
          firstImage: null,
          secondImage: null,
          thirdImage: null,
          timestamp: null,
          isExpired: false,
        }),
      clearImage: (imageType: "first" | "second" | "third") =>
        set((state) => ({
          ...state,
          [imageType === "first" ? "firstImage" : 
           imageType === "second" ? "secondImage" : 
           "thirdImage"]: null,
        })),
      setIsExpired: (value: boolean) => set({ isExpired: value }),
    }),
    {
      name: "image-storage",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        firstImage: state.firstImage,
        secondImage: state.secondImage,
        thirdImage: state.thirdImage,
        timestamp: state.timestamp,
        isExpired: state.isExpired,
      }),
    }
  )
);
