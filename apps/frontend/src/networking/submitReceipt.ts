import axios from "axios";
import { ReceiptData } from "./type";
import { backendURL } from "@/config/";

export type Response = {
  validation: {
    validityFactor: number;
    descriptionOfAnalysis: string;
  };
};

export const submitReceipt = async (data: ReceiptData): Promise<Response> => {
  try {
    const response = await axios.post(`${backendURL}/submitReceipt`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
      validateStatus: (status) => status < 500
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
