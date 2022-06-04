import { Contract } from "ethers";
import {
  CRYPTODEV_TOKEN_CONTRACT_ADDRESS,
  CRYPTO_DEV_TOKEN_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
} from "../constants";

export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmountWei,
  provider,
  ethSelected,
  ethBalance,
  reservedCD
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    let tokenReceived;
    if (ethSelected) {
      tokenReceived = await exchangeContract.getAmountOfToken(
        _swapAmountWei,
        ethBalance,
        reservedCD
      );
    } else {
      tokenReceived = await exchangeContract.getAmountOfToken(
        _swapAmountWei,
        reservedCD,
        ethBalance
      );
    }

    return tokenReceived;
  } catch (err) {
    console.error(err.message);
  }
};

export const swapTokens = async (
  signer,
  _swapAmountWei,
  tokenToBeReceivedAfterSwap,
  ethSelected
) => {
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

    let tx;

    if (ethSelected) {
      tx = await exchangeContract.ethToCryptoDevToken(
        tokenToBeReceivedAfterSwap,
        {
          value: _swapAmountWei,
        }
      );
      await tx.wait();
    } else {
      tx = await tokenContract.approve(
        EXCHANGE_CONTRACT_ADDRESS,
        _swapAmountWei.toString()
      );
      await tx.wait();

      tx = await exchangeContract.cryptoDevTokenToEth(
        _swapAmountWei,
        tokenToBeReceivedAfterSwap
      );
      await tx.wait();
    }
  } catch (err) {
    console.error(err.message);
  }
};
