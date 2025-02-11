import { scoopUpContract } from './thor';
import { ethers } from 'ethers';
import { config } from '@repo/config-contract';

async function main() {
  const appId = config.APP_ID;

  try {
    // Direkte Konvertierung zu bytes32
    const appIdBytes32 = ethers.id(appId);  // Verwendet keccak256 hash
    console.log('Converting APP_ID:', appId);
    console.log('To bytes32:', appIdBytes32);
    
    const tx = await scoopUpContract.transact.setAppId(appIdBytes32);
    await tx.wait();
    console.log('APP_ID successfully updated!', appIdBytes32);
  } catch (error) {
    console.error('Error updating APP_ID:', error);
  }
}

main();
