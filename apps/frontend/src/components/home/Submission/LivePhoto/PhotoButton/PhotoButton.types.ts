import { ChangeEvent, RefObject } from "react";

export interface PhotoButtonProps {
    type: 'first' | 'second' | 'third';
    icon: React.ComponentType<{ size: number }>;
    label: string;
    disabled: boolean;
    inputRef: RefObject<HTMLInputElement>;
    createHandleCameraCapture: (type: 'first' | 'second' | 'third') => (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  };