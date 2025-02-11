import { HttpException } from '@/exceptions/HttpException';
import { openAIHelper } from '@/server';
import { isBase64Image } from '@/utils/data';
import { Service } from 'typedi';

@Service()
export class OpenaiService {
  public async validateImage(firstImage: string, secondImage: string, thirdImage: string): Promise<unknown> {
    if (!isBase64Image(firstImage)) throw new HttpException(400, 'Invalid image format');
    if (!isBase64Image(secondImage)) throw new HttpException(400, 'Invalid image format');
    if (!isBase64Image(thirdImage)) throw new HttpException(400, 'Invalid image format');

    const prompt = `
      Carefully analyze the three provided images. The images MUST satisfy all of the following criteria:

      Image 1 (Before situation):
      - Must specifically show dog waste (not cat or other animal waste)
      - Can be located anywhere (sidewalk, street, grass, etc.)
      - The dog waste must be clearly visible and identifiable as dog waste
      - Must not be a screenshot or screen photography
      - Optional: A dog can be in the image but is not required

      Image 2 (After situation):
      - Must show the same general location as Image 1, but without the dog waste
      - Must show the bagged dog waste in any form, on the ground or in the hand
      - Should have at least some recognizable environmental features that match Image 1
      - Can be taken from a different angle or perspective
      - Be lenient in matching location features, as the angle might be quite different
      - Focus on identifying key environmental markers (buildings, trees, distinctive patterns, etc.)
      
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
        "validityFactors": {
          "image1Valid": number, // 0-1, validity of first image (must be dog waste)
          "image2Valid": number, // 0-1, validity of second image
          "image3Valid": number, // 0-1, validity of third image
          "locationMatch": number // 0-1, probability that images 1 and 2 show the same location (>0.5 considered passing, be lenient)
        },
        "analysis": {
          "image1": "string", // analysis of first image, specifically confirm it's dog waste
          "image2": "string", // analysis of second image
          "image3": "string", // analysis of third image
          "locationAnalysis": "string" // description of any matching features between images 1 and 2
        },
        "overallValid": boolean // true if image1Valid > 0.8 (must be dog waste), image2Valid > 0.7, image3Valid > 0.7, and locationMatch > 0.5
      }`;

    const gptResponse = await openAIHelper.askChatGPTAboutImage({
      firstImage,
      secondImage,
      thirdImage,
      prompt,
    });

    const responseJSONStr = openAIHelper.getResponseJSONString(gptResponse);

    return openAIHelper.parseChatGPTJSONString(responseJSONStr);
  }
}