import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OpenaiService } from '@/services/openai.service';
import { Submission } from '@/interfaces/submission.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ContractsService } from '@/services/contracts.service';

export class SubmissionController {
  public openai = Container.get(OpenaiService);
  public contracts = Container.get(ContractsService);

  public submitReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: Omit<Submission, 'timestamp'> = req.body;
      const submissionRequest: Submission = {
        ...body,
        timestamp: Date.now(),
      };
      // Submission validation with smart contract
      await this.contracts.validateSubmission(submissionRequest);

      const validationResult = await this.openai.validateImage(body.firstImage, body.secondImage, body.thirdImage);

      if (!validationResult) {
        throw new HttpException(500, 'Error validating image');
      }

      if (validationResult.overallValid) {
        if (!(await this.contracts.registerSubmission(submissionRequest))) {
          throw new HttpException(500, 'Error registering submission and sending rewards');
        }
      }

      res.status(200).json( validationResult );
    } catch (error) {
      next(error);
      return;
    }
  };
}
