export enum ValidationStep {
  STEP1 = 'STEP1',
  STEP2 = 'STEP2',
  STEP3 = 'STEP3',
}

export interface ImageValidationResponse {
  validityFactor: number;
  analysis: string;
  locationMatch?: number;
  step: ValidationStep;
  isValid: boolean;
}
