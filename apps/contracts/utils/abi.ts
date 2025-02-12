import fs from 'node:fs';
import path from 'path';

export async function getABI(contractName: string): Promise<any> {
    try {
        // Korrekter Pfad zum Contract
        const contractFile = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, `../artifacts/contracts/core/${contractName}.sol/${contractName}.json`),
                'utf8'
            )
        );

        return contractFile.abi;
    } catch (error) {
        console.error(`Error: Unable to find ABI for ${contractName}`);
        console.error(error);
    }
}