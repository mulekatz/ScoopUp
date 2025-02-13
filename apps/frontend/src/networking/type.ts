export interface ReceiptData {
  isValid: boolean;
  address: string;
  deviceID: string;
}

export interface ImageValidationData {
  firstImage?: string | null;
  secondImage?: string | null;
  thirdImage?: string | null;
  address: string;
  deviceID: string;
}
