import { HttpException } from '@/exceptions/HttpException';
import { openAIHelper } from '@/server';
import { isBase64Image } from '@/utils/data';
import { Service } from 'typedi';
import { ImageValidationResponse, ValidationStep } from '../interfaces/validation.interface';
import { MIN_VALIDITY_FACTOR } from '../config';

// Konstanten für die Prompts
const VALIDATION_PROMPTS = {
  STEP1: `Carefully analyze this provided image. The image MUST satisfy all of the following criteria:
    Image 1 (Before situation):
      - Must specifically show dog waste (not cat or other animal waste)
      - Can be located anywhere (sidewalk, street, grass, etc.)
      - The dog waste must be clearly visible and identifiable as dog waste
      - Must not be a screenshot or screen photography
      - Optional: A dog can be in the image but is not required
      
      Please respond exclusively with the following JSON object as you are a REST API:
      {
        "validityFactor": number, // 0-1, validity of first image (must be dog waste),
        "analysis": "string", // analysis of the image, specifically confirm it's dog waste
      }`,

  STEP2: `Carefully analyze these two provided images. The images MUST satisfy all of the following criteria:
    Image 1 (Before situation): - Is already validated no further validation needed
    Image 2 (After situation):
      - Must not be altered or manipulated in any way, be strict about this
      - Must show the same location as Image 1, but without the dog waste
      - Must show the bagged dog waste in any form, on the ground or in the hand
      - Must have recognizable environmental features that match Image 1
      - Can be taken from a different angle but must have recognizable environmental features

    Please respond exclusively with the following JSON object as you are a REST API:
    {
      "imageValidityFactor": number, // 0-1, validity of second image based ONLY on image requirements
      "analysis": "string",         // analysis of second image
      "locationMatch": number       // 0-1, probability that images 1 and 2 show the same location
    }`,

  STEP3: `Carefully analyze this provided image. The image MUST satisfy all of the following criteria:
    Image 3 (Disposal):
      - Must show proper waste disposal action
      - Can show either:
        a) The process of putting dog waste into a bag
        b) A bag containing dog waste
        c) The act of disposing the bag into a trash bin
      - Must include either the disposal action or the final disposal into a trash bin
      - The waste bag and trash bin should be clearly visible

    Please respond exclusively with the following JSON object as you are a REST API:
    {
      "validityFactor": number, // 0-1 based on how well criteria are met
      "analysis": "string"     // brief analysis of the image
    }`,
};

@Service()
export class OpenaiService {
  private calculateFinalValidityFactor(imageValidityFactor: number, locationMatch: number): number {
    const locationWeight = 0.7;
    const imageWeight = 0.3;
    
    return Math.min(
      imageValidityFactor,
      (locationMatch * locationWeight) + (imageValidityFactor * imageWeight)
    );
  }

  private isValidStep(step: ValidationStep, validityFactor: number, locationMatch?: number): boolean {
    switch (step) {
      case ValidationStep.STEP1:
        return validityFactor >= MIN_VALIDITY_FACTOR.first;
      
      case ValidationStep.STEP2:
        return validityFactor >= MIN_VALIDITY_FACTOR.second && 
               (locationMatch ? locationMatch >= MIN_VALIDITY_FACTOR.location : false);
      
      case ValidationStep.STEP3:
        return validityFactor >= MIN_VALIDITY_FACTOR.third;
      
      default:
        return false;
    }
  }

  private validateBase64Images(
    firstImage: string | null,
    secondImage: string | null,
    thirdImage: string | null,
    step: ValidationStep
  ): void {
    switch (step) {
      case ValidationStep.STEP1:
        if (!firstImage || !isBase64Image(firstImage)) {
          throw new HttpException(400, 'Invalid base64 image for step 1');
        }
        break;
      
      case ValidationStep.STEP2:
        if (!firstImage || !secondImage || !isBase64Image(firstImage) || !isBase64Image(secondImage)) {
          throw new HttpException(400, 'Invalid base64 images for step 2');
        }
        break;
      
      case ValidationStep.STEP3:
        if (!thirdImage || !isBase64Image(thirdImage)) {
          throw new HttpException(400, 'Invalid base64 image for step 3');
        }
        break;
    }
  }

  public async validateImage(
    firstImage: string | null,
    secondImage: string | null,
    thirdImage: string | null,
    step: ValidationStep,
  ): Promise<ImageValidationResponse> {
    // Prüfe zuerst die Base64-Bilder
    this.validateBase64Images(firstImage, secondImage, thirdImage, step);

    const responses = {
      [ValidationStep.STEP1]: async (): Promise<ImageValidationResponse> => {
        const response = await openAIHelper.askChatGPTAboutImage({
          firstImage: firstImage,
          prompt: VALIDATION_PROMPTS.STEP1,
        });
        const responseJSONStr = openAIHelper.getResponseJSONString(response);
        const result = openAIHelper.parseChatGPTJSONString(responseJSONStr) as {
          validityFactor: number;
          analysis: string;
        };

        return {
          validityFactor: result.validityFactor,
          analysis: result.analysis,
          step,
          isValid: this.isValidStep(step, result.validityFactor)
        };
      },

      [ValidationStep.STEP2]: async (): Promise<ImageValidationResponse> => {
        const response = await openAIHelper.askChatGPTAboutImage({
          firstImage: firstImage,
          secondImage: secondImage,
          prompt: VALIDATION_PROMPTS.STEP2,
        });
        const responseJSONStr = openAIHelper.getResponseJSONString(response);
        const result = openAIHelper.parseChatGPTJSONString(responseJSONStr) as {
          imageValidityFactor: number;
          analysis: string;
          locationMatch: number;
        };

        const validityFactor = this.calculateFinalValidityFactor(
          result.imageValidityFactor,
          result.locationMatch
        );

        return {
          validityFactor,
          analysis: result.analysis,
          locationMatch: result.locationMatch,
          step,
          isValid: this.isValidStep(step, validityFactor, result.locationMatch)
        };
      },

      [ValidationStep.STEP3]: async (): Promise<ImageValidationResponse> => {
        const response = await openAIHelper.askChatGPTAboutImage({
          firstImage: thirdImage,
          prompt: VALIDATION_PROMPTS.STEP3,
        });
        const responseJSONStr = openAIHelper.getResponseJSONString(response);
        const result = openAIHelper.parseChatGPTJSONString(responseJSONStr) as {
          validityFactor: number;
          analysis: string;
        };

        return {
          validityFactor: result.validityFactor,
          analysis: result.analysis,
          step,
          isValid: this.isValidStep(step, result.validityFactor)
        };
      },
    };

    return await responses[step]();
  }
}
