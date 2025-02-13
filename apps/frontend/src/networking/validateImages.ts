import axios from "axios";
import { ImageValidationData } from "./type";
import { backendURL } from "@/config/";
import { ImageValidationResponse } from "@/features/scoop/components/ValidationResponse";

export const validateImage = async (
  data: ImageValidationData
): Promise<ImageValidationResponse> => {
  try {
    const response = await axios.post(
      `${backendURL}/api/validateImages`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Hier fangen wir die Fehlermeldung aus der ErrorMiddleware ab
      throw new Error(error.response.data.message);
    }
    throw new Error("Ein unerwarteter Fehler ist aufgetreten");
  }
};
