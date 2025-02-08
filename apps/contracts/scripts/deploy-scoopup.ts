import { ethers, network } from 'hardhat';
import { updateConfig, config } from '@repo/config-contract';
import { getABI } from '../utils/abi';

export async function deploy() {
  const deployer = (await ethers.getSigners())[0];
  console.log(`Deploying on ${network.name} with wallet ${deployer.address}...`);

  console.log('Deploying ScoopUpRewards contract...');
  const ScoopUpRewards = await ethers.getContractFactory('ScoopUpRewards');
  const scoopUpInstance = await ScoopUpRewards.deploy(
    deployer.address,
    config.X2EARN_REWARDS_POOL,
    config.CYCLE_DURATION,
    config.MAX_SUBMISSIONS_PER_DAY,
    config.APP_ID
  );
  await scoopUpInstance.waitForDeployment();
  const scoopUpAddress = await scoopUpInstance.getAddress();

  console.log('Setting initial rewards and cycle...');
  await scoopUpInstance.setRewardsAmount(ethers.parseEther('1000'));
  await scoopUpInstance.triggerCycle();

  // Update config
  const scoopUpAbi = await getABI('ScoopUpRewards');
  updateConfig(
    {
      ...config,
      CONTRACT_ADDRESS: scoopUpAddress,
    },
    scoopUpAbi
  );

  console.log(`Deployment complete! Contract address: ${scoopUpAddress}`);
}

// Execute
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});