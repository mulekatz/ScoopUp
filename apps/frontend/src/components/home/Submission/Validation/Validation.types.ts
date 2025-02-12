export interface ValidationFactors {
  image1Valid: number;
  image2Valid: number;
  image3Valid: number;
  locationMatch: number;
}

export interface ValidationAnalysis {
  image1: string;
  image2: string;
  image3: string;
  locationAnalysis: string;
}

export interface ImageValidationResponse {
  validityFactors: ValidationFactors;
  analysis: ValidationAnalysis;
  overallValid: boolean;
}
