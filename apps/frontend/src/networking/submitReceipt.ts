import axios from "axios";
import { ReceiptData } from "./type";
import { backendURL } from "@/config/";
import { SubmissionResponse } from "@/features/scoop/components/SubmissionResponse/SubmissionResponse.types";

export const submitReceipt = async (data: ReceiptData): Promise<SubmissionResponse> => {
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
