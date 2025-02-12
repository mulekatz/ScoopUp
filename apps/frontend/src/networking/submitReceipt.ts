import axios from "axios";
import { ReceiptData } from "./type";
import { backendURL } from "@/config/";
import { ImageValidationResponse } from "@/components/home/Submission/Validation/ValidationResult";

export const submitReceipt = async (data: ReceiptData): Promise<ImageValidationResponse> => {
  try {
    const response = await axios.post(`${backendURL}/api/submitReceipt`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Hier fangen wir die Fehlermeldung aus der ErrorMiddleware ab
      throw new Error(error.response.data.message);
    }
    throw new Error("Ein unerwarteter Fehler ist aufgetreten");
  }
};
