import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Submission, SubmissionRequest, SubmissionResponse } from '@/interfaces/submission.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ContractsService } from '@/services/contracts.service';
import { REWARD_AMOUNT } from '@/config';

export class SubmissionController {
  public contracts = Container.get(ContractsService);

  public submitReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: Omit<SubmissionRequest, 'timestamp'> = req.body;
      const submissionRequest: Submission = {
        ...body,
        timestamp: Date.now(),
      };

      // Submission validation with smart contract
      await this.contracts.validateSubmission(submissionRequest);

      // Register submission and get transaction result
      const submissionResult = await this.contracts.registerSubmission(submissionRequest);
      if (!submissionResult) {
        throw new HttpException(500, 'Error registering submission and sending rewards');
      }

      // Get remaining submissions for this user
      const remainingSubmissions = await this.contracts.getRemainingSubmissions(submissionRequest.address);

      const response: SubmissionResponse = {
        success: true,
        reward: REWARD_AMOUNT,
        remainingSubmissions,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  };
}
