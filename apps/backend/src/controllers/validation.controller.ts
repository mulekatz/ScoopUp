import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OpenaiService } from '@/services/openai.service';
import { ValidationStep } from '@/interfaces/validation.interface';
import { HttpException } from '@/exceptions/HttpException';

export class ValidationController {
  public openai = Container.get(OpenaiService);

  public validateImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { firstImage, secondImage, thirdImage } = req.body;

      // Case 3: Validierung des dritten Bildes
      if (thirdImage && !firstImage && !secondImage) {
        const validationResult = await this.openai.validateImage(null, null, thirdImage, ValidationStep.STEP3);
        if (!validationResult) {
          throw new HttpException(500, 'Error validating third image');
        }
        res.status(200).json(validationResult);
        return;
      }

      // Case 2: Validierung der ersten beiden Bilder
      if (firstImage && secondImage && !thirdImage) {
        const validationResult = await this.openai.validateImage(firstImage, secondImage, null, ValidationStep.STEP2);
        if (!validationResult) {
          throw new HttpException(500, 'Error validating first and second images');
        }
        res.status(200).json(validationResult);
        return;
      }

      // Case 1: Validierung nur des ersten Bildes
      if (firstImage && !secondImage && !thirdImage) {
        const validationResult = await this.openai.validateImage(firstImage, null, null, ValidationStep.STEP1);
        if (!validationResult) {
          throw new HttpException(500, 'Error validating first image');
        }
        res.status(200).json(validationResult);
        return;
      }

      throw new HttpException(400, 'No valid images provided for validation');
    } catch (error) {
      next(error);
      return;
    }
  };
}
