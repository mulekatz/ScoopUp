import { HttpException } from '@/exceptions/HttpException';
import { Submission } from '@/interfaces/submission.interface';
import { scoopUpContract } from '@/utils/thor';
import { Service } from 'typedi';
import * as console from 'node:console';
import { Units } from '@vechain/sdk-core';
import { REWARD_AMOUNT } from '@config';
import { ethers } from 'ethers';

@Service()
export class ContractsService {
  private readonly scoopUpContract = scoopUpContract;

  public async registerSubmission(submission: Submission): Promise<boolean> {
    let isSuccess = false;
    try {
      const result = await (
        await scoopUpContract.transact.registerValidSubmission(submission.address, Units.parseUnits(REWARD_AMOUNT, Units.ether))
      ).wait();
      isSuccess = !result.reverted;
      console.log('result', result);
    } catch (error) {
      console.log('Error', error);
    }
    return isSuccess;
  }

  public async validateSubmission(submission: Submission): Promise<void> {
    const isLimitReached = (await scoopUpContract.read.isUserDailyLimitReached(submission.address))[0];
    if (Boolean(isLimitReached) === true) {
      throw new HttpException(409, `ScoopUp: Daily submission limit reached`);
    }
  }

  public async getRemainingSubmissions(address: string): Promise<number> {
    return Number((await scoopUpContract.read.getRemainingDailySubmissions(address))[0]);
  }

  public async updateContractSettings(appId: string) {
    try {
      const appIdBytes32 = ethers.encodeBytes32String(appId);
      const setAppIdTx = await this.scoopUpContract.transact.setAppId(appIdBytes32);
      await setAppIdTx.wait();
      console.log('APP_ID updated successfully');
    } catch (error) {
      console.error('Error updating APP_ID:', error);
      throw error;
    }
}
}
