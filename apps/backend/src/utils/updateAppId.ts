import { scoopUpContract } from './thor';
import { config } from '@repo/config-contract';

async function main() {
  const appId = config.APP_ID;

  try {
    console.log('Setting APP_ID:', appId);
    const tx = await scoopUpContract.transact.setAppId(appId);
    await tx.wait();
    console.log('APP_ID successfully updated!');
  } catch (error) {
    console.error('Error updating APP_ID:', error);
  }
}

main();
