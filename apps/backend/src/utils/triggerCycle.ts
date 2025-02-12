import { scoopUpContract } from './thor';

async function main() {
  try {
    // Neuen Cycle starten
    const tx = await scoopUpContract.transact.triggerCycle();
    await tx.wait();
    
    // Aktuellen Cycle und Block ausgeben
    const currentCycle = await scoopUpContract.read.getCurrentCycle();
    const nextCycleBlock = await scoopUpContract.read.getNextCycleBlock();
    
    console.log('New cycle triggered successfully!');
    console.log('Current cycle:', currentCycle.toString());
    console.log('Next cycle block:', nextCycleBlock.toString());
  } catch (error) {
    console.error('Error triggering new cycle:', error);
  }
}

main(); 