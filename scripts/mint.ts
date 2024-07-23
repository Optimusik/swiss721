import { ethers, network } from 'hardhat';
import { encryptDataField } from '@swisstronik/utils';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/src/signers';
import { HttpNetworkConfig } from 'hardhat/types';
import deployedAddress from '../utils/deployed-address';

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpclink = (network.config as HttpNetworkConfig).url;
  const [encryptedData] = await encryptDataField(rpclink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = deployedAddress;
  const [signer] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory('TestNFT');
  const contract = contractFactory.attach(contractAddress);

  const functionName = 'mintNFT';
  const recipient = signer.address; // Адрес владельца контракта
  const tokenURI = "https://example.com/token-metadata.json";
  const setMessageTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, [recipient, tokenURI]),
    0
  );
  await setMessageTx.wait();

  console.log('Transaction Receipt: ', setMessageTx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
