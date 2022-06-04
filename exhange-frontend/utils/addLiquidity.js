
import { Contract, utils, BigNumber } from "ethers";
import { EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, CRYPTODEV_TOKEN_CONTRACT_ADDRESS, CRYPTO_DEV_TOKEN_CONTRACT_ABI } from "../constants";

export const calculateCD = (
  _addEther = "0",
  etherBalanceContract,
  cdTokenReserve
) => {
  const addEtherInBN = utils.parseEther(_addEther);

  const cdTokenToBeDeposited = addEtherInBN
    .mul(cdTokenReserve)
    .div(etherBalanceContract);

  return cdTokenToBeDeposited;
};

export const addLiquidity = async (signer, addCDAmountWei, addEtherAmountWei) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );

    const tokenContract = new Contract(
        CRYPTODEV_TOKEN_CONTRACT_ADDRESS,
        CRYPTO_DEV_TOKEN_CONTRACT_ABI, 
        signer
    );

    const tx = await tokenContract.approve(
        EXCHANGE_CONTRACT_ADDRESS, addCDAmountWei.toString()
    );
    await tx.wait();

    const addRequiredCDToken = await exchangeContract.addLiquidity(addCDAmountWei, 
        {
            value: addEtherAmountWei,
        });
        await addRequiredCDToken.wait();

  } catch (err) {
    console.error(err.message);
  }
};
