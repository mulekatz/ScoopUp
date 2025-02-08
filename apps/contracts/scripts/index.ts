// We recommend this pattern to be able to use async/await everywhere

import { deploy } from './deploy-scoopup';

// and properly handle errors.
const execute = async () => {
    await deploy();
};

execute()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });