import { OPENAI_API_KEY } from '@/config';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';

export class OpenAIHelper {
  private openai: OpenAI;

  constructor(private _openai?: OpenAI) {
    if (_openai) {
      this.openai = _openai;
    } else {
      this.openai = this.createOpenAIInstance();
    }
  }

  private createOpenAIInstance = () =>
    new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // TODO: Check if this is necessary
    });

  public askChatGPTAboutImage = async ({
    firstImage,
    secondImage,
    thirdImage,
    maxTokens = 350,
    prompt,
  }: {
    firstImage?: string | null;
    secondImage?: string | null;
    thirdImage?: string | null;
    prompt: string;
    maxTokens?: number;
  }) => {
    // Erstelle ein Array nur mit den vorhandenen Bildern
    const images = [firstImage, secondImage, thirdImage]
      .filter((img): img is string => !!img)
      .map(img => ({
        type: 'image_url' as const,
        image_url: { url: img },
      }));

    // Kombiniere Text und Bilder
    const content = [{ type: 'text' as const, text: prompt }, ...images];

    return this.openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    });
  };

  public getResponseJSONString = (response: ChatCompletion) => response.choices[0].message.content;

  private cleanChatGPTJSONString = (jsonString: string) => jsonString.replace('```json', '').replace('```', '');

  public parseChatGPTJSONString = <Response>(jsonString?: string | null): Response | undefined => {
    if (!jsonString) {
      return;
    }
    const content = this.cleanChatGPTJSONString(jsonString);
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (e) {
        console.error('Failing parsing Chat GPT response:', e);
      }
    }
  };
}
