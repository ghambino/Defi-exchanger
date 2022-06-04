import { Contract } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants";

export const getTokensAfterRemove = async (
  provider,
  removeLPTokenWei,
  _ethBalance,
  cryptodevTokenReserve
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );

    const totalSuppliedLPToken = await exchangeContract.totalSupply();

    const etherRemoved = _ethBalance
      .mul(removeLPTokenWei)
      .div(totalSuppliedLPToken);

    const CDRemoved = cryptodevTokenReserve
      .mul(removeLPTokenWei)
      .div(totalSuppliedLPToken);

    return {
      etherRemoved,
      CDRemoved
    };

  } catch (err) {
    console.error(err.message);
  }
};

export const removeLiquidity = async (signer, removedLPToken) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );

    const tx = await exchangeContract.removeLiquidity(removedLPToken);
    await tx.wait();
  } catch (err) {
    console.error(err.message);
  }
};
