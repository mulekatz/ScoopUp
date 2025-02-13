import { ChangeEvent, RefObject } from "react";
import { IconType } from "react-icons/lib";

export interface PhotoButtonProps {
    type: 'first' | 'second' | 'third';
    icon: IconProps;
    label: string;
    disabled: boolean;
    inputRef: RefObject<HTMLInputElement>;
    createHandleCameraCapture: (type: 'first' | 'second' | 'third') => (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  };

  interface IconProps {
    Icon: IconType;
    className?: string;
  }
