// Eingehende Daten (Request)
export interface SubmissionRequest {
  address: string;
  deviceID: string;
  isValid: boolean;
}

// Ausgehende Daten (Response)
export interface SubmissionResponse {
  success: boolean;
  reward: string;
  remainingSubmissions: number;
}

// Internes Interface für die Verarbeitung
export interface Submission {
  _id?: string;
  round?: number;
  address: string;
  timestamp: number;
  isValid: boolean;
  deviceID?: string;
  remainingSubmissions?: number;
  reward?: number;
}
