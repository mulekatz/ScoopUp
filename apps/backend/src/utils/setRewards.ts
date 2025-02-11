import { scoopUpContract, x2EarnRewardsPoolContract } from './thor';
import { config } from '@repo/config-contract';

async function main() {
  const appId = config.APP_ID;

  try {
    // 1. Verfügbare Funds prüfen
    const availableFunds = await x2EarnRewardsPoolContract.read.availableFunds(appId as `0x${string}`);
    console.log('Total available funds:', availableFunds.toString());

    // 2. 80% der Funds berechnen
    const rewardsAmount = availableFunds[0] * 80n / 100n;
    console.log('Setting rewards amount (80%):', rewardsAmount.toString());

    // 3. Rewards für aktuellen Cycle setzen
    console.log('Sending transaction...');
    const tx = await scoopUpContract.transact.setRewardsAmount(rewardsAmount);
    console.log('Transaction hash:', tx.id);
    console.log('Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', !receipt.reverted);
    
    if (receipt.reverted) {
      console.error('Transaction reverted!');
      return;
    }
    
    // 4. Aktuelle Cycle-Infos ausgeben
    const currentCycle = await scoopUpContract.read.getCurrentCycle();
    const nextCycle = await scoopUpContract.read.nextCycle();
    const cycleRewards = await scoopUpContract.read.rewards([currentCycle]);
    const nextCycleRewards = await scoopUpContract.read.rewards([nextCycle]);
    
    console.log('Current cycle:', currentCycle.toString());
    console.log('Next cycle:', nextCycle.toString());
    console.log('Current cycle rewards:', cycleRewards.toString());
    console.log('Next cycle rewards:', nextCycleRewards.toString());
  } catch (error) {
    console.error('Error setting rewards:', error);
  }
}

main(); 