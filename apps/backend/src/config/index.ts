import { config } from 'dotenv';
import { Mnemonic } from '@vechain/sdk-core';
import { ValidateEnv } from '@utils/validateEnv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const validatedEnv = ValidateEnv();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN } = validatedEnv;

export const { OPENAI_API_KEY } = validatedEnv;
export const { MAX_FILE_SIZE } = validatedEnv;
export const { ADMIN_MNEMONIC, ADMIN_ADDRESS } = validatedEnv;
export const { NETWORK_URL, NETWORK_TYPE } = validatedEnv;
export const { REWARD_AMOUNT } = validatedEnv;

export const ADMIN_PRIVATE_KEY = Mnemonic.toPrivateKey(ADMIN_MNEMONIC.split(' '));

export const MIN_VALIDITY_FACTOR = {
  first: 0.8,
  second: 0.6,
  third: 0.8,
  location: 0.8,
} as const;
