import { scoopUpContract } from './thor';

async function main() {
  try {
    const currentAppId = await scoopUpContract.read.appId();
    console.log('Current Contract APP_ID:', currentAppId);
  } catch (error) {
    console.error('Error checking APP_ID:', error);
  }
}

main(); 