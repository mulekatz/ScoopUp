import { ADMIN_PRIVATE_KEY, NETWORK_URL } from '../config';
import { HttpClient, ThorClient, VeChainPrivateKeySigner, VeChainProvider } from '@vechain/sdk-network';
import { ScoopUpRewardsABI } from '@utils/const';
import { config } from '@repo/config-contract';

export const thor = ThorClient.at(NETWORK_URL);

export const scoopUpContract = thor.contracts.load(
  config.CONTRACT_ADDRESS,
  ScoopUpRewardsABI,
  new VeChainPrivateKeySigner(Buffer.from(ADMIN_PRIVATE_KEY), new VeChainProvider(thor)),
);
